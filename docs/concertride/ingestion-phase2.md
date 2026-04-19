# Ingestion Phase 2 — Incremental Sync Design

**Date:** 2026-04-19  
**Status:** Design only — implementation follows after Phase 1 backfill is verified.

---

## 1. Cadence Matrix per Source

| Source | Webhooks? | `lastUpdate` filter? | Recommended interval | Justification |
|---|---|---|---|---|
| Ticketmaster ES | No | Yes (`lastUpdate` param) | **Weekly** | New shows announced weekly; `lastUpdate` filter makes runs cheap (~5 pages max) |
| Resident Advisor | No | No (date filter only) | **Weekly** | Electronic events announced 2–4 weeks ahead; low event volume |
| BandsInTown | No | No | **Biweekly** | Enrichment only; low urgency |
| Eventbrite ES | Yes (webhooks) | Yes | **Webhook + weekly fallback** | Webhooks fire on publish/cancel; weekly fallback catches misses |
| Wegow | No | No (scrape-based) | **Biweekly** | HTML scrape is expensive; biweekly reduces load |
| DICE | No | Unknown (partner API) | **Weekly** (if key obtained) | Partner tier likely has `updatedAfter` filter |

### Ticketmaster weekly sync detail

`lastUpdate` parameter filters events modified after a given timestamp. This makes weekly syncs very cheap:

```
GET /discovery/v2/events.json
  ?countryCode=ES&classificationName=music
  &lastUpdate=2026-04-13T00:00:00Z   ← previous run timestamp
  &size=200&page=0
```

Expected weekly result: **10–50 new/updated events** (versus 30-page full scan). Budget: ~1–3 requests per weekly run. Well within quota.

---

## 2. Cloudflare Workers Implementation

### Cron Triggers (wrangler.jsonc additions)

```jsonc
{
  "triggers": {
    "crons": [
      "*/30 * * * *",   // existing Tier 1 (currently unused — replace with explicit)
      "0 */2 * * *",    // existing Tier 2
      "0 */6 * * *",    // existing Tier 3
      "0 8 * * 1",      // NEW: Monday 08:00 UTC — Ticketmaster weekly sync
      "0 9 * * 1",      // NEW: Monday 09:00 UTC — RA weekly sync
      "0 10 * * 3"      // NEW: Wednesday 10:00 UTC — Eventbrite/BandsInTown biweekly
    ]
  }
}
```

The `dispatchScheduled` function in `scheduled.ts` already uses `CRON_TO_TIER` — extend this to map the new crons to specific adapter + cursor logic.

### Per-source cursor storage (Cloudflare KV)

Create a `INGEST_CURSORS` KV namespace to store last-fetched timestamps per source:

```typescript
// Key: "cursor:ticketmaster"
// Value: "2026-04-14T08:00:00Z"

await env.INGEST_CURSORS.put("cursor:ticketmaster", new Date().toISOString());
const lastRun = await env.INGEST_CURSORS.get("cursor:ticketmaster");
```

Bind in `wrangler.jsonc`:
```jsonc
{
  "kv_namespaces": [
    { "binding": "INGEST_CURSORS", "id": "..." }
  ]
}
```

Add `INGEST_CURSORS: KVNamespace` to `env.ts`.

### `ctx.waitUntil()` for long-running fetches

Already in use in `dispatchScheduled`. The incremental sync adapters must complete within Cloudflare's CPU time limit (~30s per invocation for scheduled workers on paid plan). Strategy:

- Weekly Ticketmaster sync: ~3 API calls + ~50 DB writes = well under 30s.
- If a sync approaches CPU limit, the adapter should save its page cursor to KV and exit cleanly. Next cron invocation picks up from that page.
- Long BandsInTown enrichment passes should be chunked to 100 artists per cron invocation.

### SSE to connected clients (real-time carousel refresh)

For live updates to the web app:
- Use **Cloudflare Durable Objects** to maintain an open SSE connection per user session.
- When ingestion inserts a concert matching a user's city filter, push a `new_concert` event.
- This is a Phase 3 feature — not required for Phase 2 sync.

---

## 3. Change Detection Strategy

### New events

```typescript
// After weekly fetch, compare source_event_ids in this batch vs DB
const fetchedIds = new Set(rawConcerts.map(r => r.source_event_id));
const existingIds = await store.getSourceEventIds("ticketmaster"); // new method needed
const newIds = [...fetchedIds].filter(id => !existingIds.has(id));
```

### Updates (content hash)

Add `content_hash` column to `concert_sources`:

```sql
ALTER TABLE concert_sources ADD COLUMN content_hash TEXT;
```

Hash fields that can change: `title`, `date_iso`, `price_min`, `price_max`, `image_url`:

```typescript
const hash = sha1(JSON.stringify({ title, date_iso, price_min, price_max, image_url }));
```

On each fetch: if `content_hash` differs → update the row + re-run dedup merge on the parent concert.

### Cancellations

Mark `concerts.status = "cancelled"` if a concert was absent from the source for **3 consecutive weekly runs**:

```typescript
// Track absence in a new table: concert_absences(source, source_event_id, absent_since, miss_count)
// After miss_count >= 3: update concerts set status='cancelled' where fingerprint=...
```

Cancelled concerts stay in the DB so existing `rides` aren't orphaned — they just stop appearing in search results.

### Price drops

Add a `price_change_log` table (optional):
```sql
CREATE TABLE price_change_log (
  id TEXT PRIMARY KEY,
  concert_id TEXT NOT NULL,
  source TEXT NOT NULL,
  old_min REAL,
  new_min REAL,
  changed_at TEXT NOT NULL
);
```

Trigger alert (log to console / Slack webhook) if `new_min < old_min * 0.5` (50%+ drop — likely a sale or error).

---

## 4. Admin Surface Design

### Route: `GET /admin/ingest`

Gated by `X-Ingest-Secret` header (same as backfill endpoint) or a JWT with `role: "admin"`.

**Page sections:**

#### Status panel
```
Last run: 2026-04-14 08:02 UTC (Ticketmaster weekly)
  ✓ ticketmaster  fetched=47  inserted=41  merged=6  errors=0  (3.2s)
  ✓ ra            fetched=12  inserted=12  merged=0  errors=0  (1.1s)

Next scheduled run: 2026-04-21 08:00 UTC
```

#### Error log (last 50)
```
2026-04-14 08:01  ticketmaster:Z0938K190AJ  venue city missing — skipped
2026-04-14 07:58  ra:32378382  GraphQL error: rate limited
...
```

#### Manual trigger buttons
- "Run Ticketmaster now"
- "Run all Tier 1"
- "View last 10 run summaries"

#### Per-source health indicators
```
Source          Last run      Status    Events/run   Trend
──────────────────────────────────────────────────────────
Ticketmaster    14 Apr 08:02  ✅ OK     47           ↔ stable
Resident Advisor 14 Apr 09:01 ✅ OK     12           ↑ growing
BandsInTown     12 Apr 10:00  ✅ OK     0 (enrich)   —
Eventbrite      —             ⚫ stub    —            —
Wegow           —             ⚫ stub    —            —
```

**Implementation:** A new `fetch_runs` table stores run history. The admin page reads from it via `GET /admin/ingest/runs?limit=10`.

```sql
CREATE TABLE fetch_runs (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  fetched INTEGER DEFAULT 0,
  inserted INTEGER DEFAULT 0,
  merged INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  error_log TEXT DEFAULT '[]'
);
```

---

## 5. Cost + Quota Analysis

### Ticketmaster (5,000 req/day limit)

| Cadence | Requests/week | Requests/day (avg) | % of daily quota |
|---|---|---|---|
| Phase 1 backfill (one-time) | 30–36 | — | 0.7% |
| Weekly incremental (lastUpdate filter) | 1–3 | 0.2–0.4/day | <0.01% |
| Weekly full scan (no lastUpdate) | 30 | 4.3/day | 0.09% |
| Daily full scan | 30/day | 30 | 0.6% |

**Conclusion:** Weekly sync with `lastUpdate` filter is extremely cheap. Even daily full scans use <1% of quota. No upgrade needed for years.

### Resident Advisor (no documented quota)

No rate limit observed during testing. Courtesy rate: 1 request/second. With 4 areas × ~3 pages = ~12 requests/week. Trivially safe.

### BandsInTown (no documented quota)

Free tier, undocumented limit. Typical pattern: 1 req/artist. With 500 unique artists enriched biweekly = 500 req/2 weeks = 35 req/day. Safe.

### Break-even for Ticketmaster upgrade

The 5,000/day quota won't be a constraint until we run **167 full-scan fetches per day** (167 × 30 = 5,010). That's not a plausible scenario. The only risk: if we accidentally run the full backfill script multiple times in one day (not possible via cron; only via manual trigger). The dryRun flag mitigates this.

---

## 6. Failure Modes + Mitigations

| Failure | Detection | Mitigation |
|---|---|---|
| Malformed JSON from Ticketmaster | `JSON.parse` throws | Per-page try/catch; log raw body (first 500 chars); skip page; continue |
| 429 rate limit | `res.status === 429` | Exponential backoff: 2s → 4s → 8s → stop; KV cursor saves progress for next cron |
| RA GraphQL adds auth | `errors[].message` contains "unauthorized" | Catch + log; disable RA adapter; notify via console.error (Phase 3: Slack alert) |
| Source schema changes silently | Normalized fields are null/wrong | Add `schema_version` to RawConcert; if >30% of a batch has null dates, abort + alert |
| Worker CPU exceeded (30s limit) | Worker returns 1101/1102 error | Chunk: process 500 events per cron invocation; save page cursor to KV |
| Turso timeout on bulk insert | `LibsqlError: TIMEOUT` | Retry once with 5s delay; if still failing, log batch and skip; never abort entire run |
| Turso connection drops mid-run | `LibsqlError: CLOSED` | Re-establish connection via `getStore(env)` at the top of each adapter loop |
| KV cursor write fails | Silent | Log warning; next run does a full (non-incremental) scan as fallback |
| Duplicate fingerprints from same source | Unique index violation | `recordSource` uses `UNIQUE(source, source_event_id)` — silently ignored at DB level |

---

## 7. Migration Plan: Phase 1 → Phase 2

### What changes

| Component | Phase 1 | Phase 2 |
|---|---|---|
| `wrangler.jsonc` | 3 cron triggers (tiers 1/2/3) | + 3 new weekly/biweekly crons |
| `env.ts` | No KV | + `INGEST_CURSORS: KVNamespace` |
| `scheduled.ts` | `CRON_TO_TIER` map | + cursor-aware dispatch |
| `concert_sources` | No `content_hash` | + `content_hash` column |
| New tables | None | `fetch_runs`, `concert_absences`, (optional) `price_change_log` |
| `SourceAdapter.fetch()` | `fromDate`/`toDate` only | + `since?: string` (lastUpdate cursor) |

### What stays the same

- `SourceAdapter` interface (extend, not replace)
- `runIngestion` / `dedup.ts` pipeline
- `RawConcert` type
- `concert_sources` + `concerts` + `venues` schema (additive migrations only)

### Rollout stages

```
Stage 1: Enable Ticketmaster weekly cron in staging (wrangler.jsonc + KV namespace)
         → Monitor 1 week: verify cursor updates, error log clean, counts expected

Stage 2: Add fetch_runs table + admin /ingest/runs endpoint
         → Switch from in-memory status to persistent run history

Stage 3: Enable RA weekly cron
         → Verify cross-source dedup (fingerprint collisions between TM + RA)

Stage 4: Enable Eventbrite (after token obtained) + weekly cron
         → Verify webhook flow (if applicable) + dedup ratio stays < 40%

Stage 5: Implement Wegow scrape adapter (after robots.txt verified OK)
         → Enable biweekly cron, monitor error rate (HTML scrapes are fragile)

Stage 6: Promote to production
         → Run full backfill refresh (one more full scan to pick up anything missed)
         → Enable admin surface at /admin/ingest
```

### Schema migrations (Drizzle)

Each additive change is a safe migration:
```bash
# In apps/api/, after editing schema.ts:
npm run db:generate   # generates migration file
npm run db:push       # applies to Turso
```

No destructive migrations required for Phase 2.

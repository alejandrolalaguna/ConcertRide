# Backfill Plan — Spain 2026 Concert Ingestion

**Status:** AWAITING USER APPROVAL before any code is written.  
**Date:** 2026-04-19  
**Author:** Claude Code (automated)

---

## 1. Current State Audit

The ingest infrastructure is already in place. No scaffolding needed.

| Component | File | Status |
|---|---|---|
| `SourceAdapter` interface | `apps/api/src/ingest/types.ts` | ✅ Exists |
| `RawConcert` type | `apps/api/src/ingest/types.ts` | ✅ Exists |
| Dedup pipeline | `apps/api/src/ingest/dedup.ts` | ✅ Exists |
| Ticketmaster adapter | `apps/api/src/ingest/sources/ticketmaster.ts` | ✅ Implemented |
| BandsInTown adapter | `apps/api/src/ingest/sources/bandsintown.ts` | 🔶 Stub |
| RA adapter | `apps/api/src/ingest/sources/ra.ts` | 🔶 Stub |
| Wegow adapter | `apps/api/src/ingest/sources/wegow.ts` | 🔶 Stub |
| DICE adapter | `apps/api/src/ingest/sources/dice.ts` | 🔶 Stub |
| Eventbrite adapter | `apps/api/src/ingest/sources/eventbrite.ts` | 🔶 Stub |
| Ingest route | `apps/api/src/routes/ingest.ts` | ✅ `POST /ingest/run?tier=N` |
| Cron dispatcher | `apps/api/src/ingest/scheduled.ts` | ✅ Exists |
| DB schema | `apps/api/src/db/schema.ts` | ✅ `concerts`, `concert_sources`, `venues` |

**What's missing and needs to be built:**
1. `POST /api/ingest/backfill-2026` endpoint (custom date range, SSE progress, dryRun flag)
2. `apps/api/scripts/backfill-2026.ts` runner script (SSE client, progress bar, summary table)
3. Ticketmaster adapter upgrade: current `MAX_PAGES = 10` caps at 2,000 events; backfill needs up to 30 pages (6,000 events)
4. BandsInTown adapter: implement as enrichment source (artist name verification)
5. `npm run ingest:backfill` script alias

---

## 2. Budget Math — Ticketmaster Requests

**API limit:** 5,000 requests / day (Public tier)

### Worst-case estimate

| Variable | Value | Basis |
|---|---|---|
| Spain 2026 music events | ~3,000–6,000 | Ticketmaster Spain historical + seasonal patterns |
| Page size | 200 (max allowed) | `size=200` |
| Pages needed (best case, 3k events) | 15 pages | 3000 / 200 = 15 |
| Pages needed (worst case, 6k events) | 30 pages | 6000 / 200 = 30 |
| Retries per page (2 max, for 5xx/429) | +6 (worst case) | 30 × 20% × 1 retry |
| **Total Ticketmaster requests (backfill)** | **~30–36** | Well within 5,000/day |

**Conclusion:** The backfill costs at most 36 requests. This leaves 4,964+ requests for same-day retries, enrichment calls, and BandsInTown enrichment. No quota risk.

### Required adapter change

Current `ticketmaster.ts` has `MAX_PAGES = 10` — hard cap at 2,000 events. For the full 2026 backfill, this must be raised to **50** (capped by API's own `totalPages`). The adapter already reads `json.page.totalPages` and breaks when exhausted, so raising `MAX_PAGES` is safe.

---

## 3. Query Strategy (no wasted requests)

```
GET https://app.ticketmaster.com/discovery/v2/events.json
  ?apikey=TUm1OiCZT8yLM19YIazz7ewDahFOywG5
  &countryCode=ES
  &classificationName=music
  &locale=es-es
  &startDateTime=2026-01-01T00:00:00Z
  &endDateTime=2026-12-31T23:59:59Z
  &size=200
  &sort=date,asc
  &page={n}
```

**Do NOT add:**
- `includeTBA=yes` — bloats results with undated events, wastes pages
- `includeTest=yes` — test events inflate counts
- `classificationId=` in addition to name — redundant, can cause mismatch

**Image selection:** filter `images[]` for `ratio=16_9` and `width >= 640`. If none match, take the widest available. This avoids the 30% response bloat from fetching all image variants by picking at normalize time (already done in current adapter's `pickBestImage`).

---

## 4. Adapter Implementation Checklist

### Tier 1 — Implement Fully

#### `ticketmaster.ts` — ALREADY IMPLEMENTED, needs one change
- [ ] Raise `MAX_PAGES` from `10` to `50`
- [ ] Update `toTMDate` calls to accept explicit backfill dates (`2026-01-01` → `2026-12-31`)
- [ ] No other changes needed — existing normalize() maps all required fields

#### `bandsintown.ts` — IMPLEMENT (enrichment only)
- Strategy: NOT used for bulk concert discovery (too many artist-specific requests)
- Used only for artist name normalization / verification on demand
- For the backfill endpoint: **skip BandsInTown** (not artist-enumeration compatible)
- For Phase 2 weekly sync: can enrich artist metadata after Ticketmaster inserts

**Decision for backfill: BandsInTown stays as STUB for the bulk backfill run.** It's not suitable for "give me all Spain concerts" queries — it requires per-artist API calls. We'd need artist names from Ticketmaster first, then enrich. That's a Phase 2 enrichment pass.

### Tier 2 — RA (Resident Advisor)

- RA is primarily an electronic music events platform
- Endpoint: `https://ra.co/graphql` — requires investigation before coding
- **Decision:** Test RA GraphQL endpoint before committing. If it accepts unauthenticated queries for Spain, implement. If it requires auth or returns CORS, stub and skip.
- Action: Test `curl -X POST https://ra.co/graphql` with a Spain query. If no CORS block, implement. Estimated cost: 1 test request.

### Tier 2 — WEGOW (stub)

- Wegow is Spain's largest local ticketing platform — high value but HTML-only
- Scraping approach: JSON-LD `<script type="application/ld+json">` on event pages
- robots.txt check required before any implementation
- **Decision:** STUB for backfill. Implement in Phase 2 Week 3+ if Ticketmaster count < 3,000.

### Tier 3 — DICE, Eventbrite (stubs)

- DICE: requires partner key (no public API documented) — STUB
- Eventbrite: no token available yet — STUB
- Fever, Taquilla, Entradas.com: no public APIs — STUB

---

## 5. Request Sequence (adapter priority order)

```
Backfill run order:
  1. ticketmaster   (Tier 1, API)  — bulk: all Spain 2026 music events
  2. [ra]           (Tier 2, API)  — implement only if GraphQL endpoint is public
  3. bandsintown    (skip backfill) — enrichment only, Phase 2
  4. wegow          (STUB)
  5. dice           (STUB)
  6. eventbrite     (STUB)
```

For the backfill endpoint, the `source` query param allows targeted runs:
- `?source=ticketmaster` → just Ticketmaster
- `?source=all` → all non-stub adapters in sequence

---

## 6. Dedup Strategy

The existing pipeline in `dedup.ts` already handles:
- `store.ensureVenue()` — exact match by name, creates if missing
- `store.upsertConcertFromIngest()` — upserts by `fingerprint`
- `store.recordSource()` — upserts by `UNIQUE(source, source_event_id)`

**Fingerprint** (computed in `DrizzleStore.upsertConcertFromIngest`):
```
sha1(lower(artist) + "|" + lower(venue_city) + "|" + yyyy-mm-dd)
```

This is the right dedup key. Same artist, same city, same date = same concert regardless of source.

**Expected dedup ratio:**
- Ticketmaster returns ~3,000–6,000 raws
- ~30% may be cross-listed on other sources (Phase 2 sources)
- Net unique concerts estimate: **3,000–5,000**

---

## 7. Fallback Strategy

| Failure | Response |
|---|---|
| Ticketmaster 429 on page N | Exponential backoff: 2s → 4s → 8s → bail page, log warning, continue remaining pages |
| Ticketmaster 5xx | Retry once after 2s. If still failing, throw — pipeline catches per-adapter |
| Page returns 0 events before `totalPages` | Break early — already implemented in current adapter |
| `totalPages` missing from response | Default to `MAX_PAGES` cap — already implemented |
| Venue normalize fails (no city) | RawConcert returns `null` from `normalize()`, skipped — already implemented |
| DB write fails (Turso timeout) | Per-concert try/catch in `dedup.ts` records error string, continues — already implemented |

**For 429s specifically:** current adapter does `break` on 429 (stops pagination). For the backfill, we want retry-with-backoff before breaking. This is the one behavior change needed.

---

## 8. New Endpoints / Scripts to Build

### `POST /api/ingest/backfill-2026`

```
Headers: X-Ingest-Secret: <secret>
Query:
  ?source=all|ticketmaster|bandsintown|ra|wegow|dice|eventbrite
  ?dryRun=true|false

Response: Server-Sent Events (text/event-stream)
  One JSON line per adapter: {adapter, fetched, inserted, updated, errors, elapsed_ms}
  Final line: {total_fetched, total_inserted, total_merged, total_errors, sources:[...]}
```

**dryRun=true behavior:**
- Fetches page 0 only from Ticketmaster (1 request)
- Parses into RawConcert
- Runs venue/dedup logic in dry mode (no DB writes)
- Returns "would insert X concerts, would merge Y"

### `apps/api/scripts/backfill-2026.ts`

- Node/tsx script (not edge-compatible)
- Calls `http://127.0.0.1:8787/api/ingest/backfill-2026` via SSE
- Reads `--dryRun` and `--source` CLI args
- Prints live progress + final summary table

---

## 9. Files to Create / Modify

| Action | File | Change |
|---|---|---|
| MODIFY | `apps/api/src/ingest/sources/ticketmaster.ts` | `MAX_PAGES = 50`, add 429 backoff |
| MODIFY | `apps/api/src/routes/ingest.ts` | Add `POST /backfill-2026` with SSE + dryRun |
| MODIFY | `apps/api/package.json` | Add `"ingest:backfill": "tsx scripts/backfill-2026.ts"` |
| CREATE | `apps/api/scripts/backfill-2026.ts` | SSE client + progress + summary table |
| CREATE | `docs/concertride/ingestion-phase1.md` | Source audit + dedup algorithm docs |
| CREATE | `docs/concertride/ingestion-phase2.md` | Sync design doc |
| SKIP | `bandsintown.ts` | Leave as stub for backfill — implement in Phase 2 |
| SKIP | `ra.ts` | Test GraphQL endpoint first; implement only if public |

---

## 10. Risks and Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Ticketmaster returns fewer than expected (< 1,000) | Low | dryRun first to validate count |
| Ticketmaster `locale=es-es` returns partial results | Medium | Also try without locale, compare page counts |
| `totalPages` reported as 0 | Low | Current adapter falls back to `events.length < PAGE_SIZE` break |
| Venue name collisions (same venue, different spelling) | High | `ensureVenue` exact-match first; fuzzy match Phase 2 |
| `date_iso` is null (TBA events) | Medium | `normalize()` returns null if no dateTime; already filtered |
| Turso write timeout on bulk insert | Medium | Per-concert try/catch already handles; errors logged to stats |

---

## APPROVAL GATE

**Awaiting user sign-off before STEP 2 (any code changes).**

Questions for user (if any):
1. Should RA GraphQL be tested before the backfill, or skip it entirely for now?
2. Acceptable to raise `MAX_PAGES` from 10 to 50 in `ticketmaster.ts`?
3. Confirm INGEST_SECRET will be set via `wrangler secret put` before running?

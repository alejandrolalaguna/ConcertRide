# Ingestion Phase 1 — Bulk Backfill Documentation

**Date:** 2026-04-19  
**Status:** Implementation complete, awaiting user backfill run.

---

## Source Audit Table

| Source | Type | Viability | Tier | Mode | Cost (req/backfill) | Status | Notes |
|---|---|---|---|---|---|---|---|
| Ticketmaster ES | API | ✅ High | 1 | API | ~30 req | Implemented | Official partner API, 5k/day quota |
| Resident Advisor | API | ✅ Medium | 1 | API | ~20 req | Implemented | Public GraphQL, electronic only |
| BandsInTown | API | 🟡 Enrichment | 3 | API | N/A | Stub | Per-artist queries, not bulk-compatible |
| Eventbrite ES | API | 🟡 Medium | 2 | API | ~50 req | Stub | No token yet; implement in Phase 2 |
| Wegow | Scrape | 🟡 Medium | 1 | Scrape | 100+ req | Stub | Spain-native; robots.txt must be checked |
| DICE | API | 🔴 Low | 1 | API | unknown | Stub | Partner key required; not public |
| Fever | Scrape | 🔴 Low | 3 | Scrape | 200+ req | Stub | No public API; ToS unclear |
| Taquilla.com | Scrape | 🔴 Low | 3 | Scrape | 200+ req | Stub | HTML-only; ToS unclear |
| Entradas.com | Scrape | 🔴 Low | 3 | Scrape | 200+ req | Stub | HTML-only; ToS unclear |

---

## Adapter Notes

### Ticketmaster ES

**Endpoint:** `GET https://app.ticketmaster.com/discovery/v2/events.json`

**Required params:**
```
?apikey=<TICKETMASTER_API_KEY>
&countryCode=ES
&classificationName=music
&locale=es-es
&startDateTime=2026-01-01T00:00:00Z
&endDateTime=2026-12-31T23:59:59Z
&size=200
&sort=date,asc
&page={n}
```

**Pagination:** `page.totalPages` in response; breaks early if `events.length < 200`.

**Expected volume:** 3,000–6,000 events for Spain 2026.

**Request budget:** `ceil(6000/200) = 30` pages + up to 6 retries = ~36 max.

**Response shape (key fields):**
```json
{
  "_embedded": {
    "events": [{
      "id": "...",
      "name": "Artist Name",
      "url": "https://www.ticketmaster.es/...",
      "dates": { "start": { "dateTime": "2026-06-15T20:00:00Z" } },
      "images": [{ "url": "...", "width": 2048, "height": 683 }],
      "classifications": [{ "genre": { "name": "Pop" } }],
      "priceRanges": [{ "currency": "EUR", "min": 25.0, "max": 75.0 }],
      "_embedded": {
        "venues": [{ "name": "Palau Sant Jordi", "city": { "name": "Barcelona" }, "location": { "latitude": "41.3579", "longitude": "2.1515" } }],
        "attractions": [{ "name": "Rosalía" }]
      }
    }]
  },
  "page": { "totalPages": 18, "number": 0 }
}
```

**Field mapping to `RawConcert`:**

| RawConcert field | TM source |
|---|---|
| `artist` | `_embedded.attractions[0].name` \|\| `name` |
| `title` | `name` (only if different from artist) |
| `venue_name` | `_embedded.venues[0].name` |
| `venue_city` | `_embedded.venues[0].city.name` |
| `venue_lat` | `parseFloat(_embedded.venues[0].location.latitude)` |
| `venue_lng` | `parseFloat(_embedded.venues[0].location.longitude)` |
| `date_iso` | `dates.start.dateTime` |
| `image_url` | Largest image by width |
| `price_min` | `priceRanges[0].min` (EUR only) |
| `price_max` | `priceRanges[0].max` (EUR only) |
| `genre` | `classifications[0].genre.name` |
| `source_url` | `url` or constructed from id |

**Rate limit handling:** Exponential backoff on 429: 2s → 4s → 8s → stop pagination.

---

### Resident Advisor (RA)

**Endpoint:** `POST https://ra.co/graphql` (no auth required as of 2026-04-19)

**Spain area IDs:** Barcelona=20, Madrid=41, Valencia=607, Bilbao=612

**Query:**
```graphql
query BackfillES($areaId: Int!, $from: String!, $to: String!, $page: Int!) {
  eventListings(
    filters: { areas: { eq: $areaId }, listingDate: { gte: $from, lte: $to } }
    pageSize: 100
    page: $page
  ) {
    data {
      id
      event {
        title date startTime
        venue { name address location { latitude longitude } }
        images { filename }
        artists { name }
      }
    }
  }
}
```

**Coverage:** Electronic music / club events only. Complements Ticketmaster's mainstream concerts.

**Expected volume:** 200–800 events across all 4 Spain areas for 2026.

**Notes:**
- RA does not return prices — `price_min` / `price_max` will be null.
- Genre is hardcoded to `"Electronic"` since RA is entirely electronic-focused.
- Images use `https://ra.co{filename}` construction.
- City is parsed from venue address string (`"Street, City, Country"` → second-to-last segment).

---

### BandsInTown (Stub for Phase 1)

BandsInTown requires **per-artist queries** (`/artists/{name}/events`), making it unsuitable for bulk discovery — you'd need an artist list first. Its role in Phase 2 is:

1. Enrich artist metadata (canonical artist IDs, social links) after Ticketmaster inserts.
2. Cross-verify concert dates when there's a fingerprint collision between sources.

**Not used in the Phase 1 backfill run.**

---

### Stubs (Wegow, DICE, Eventbrite, Fever, Taquilla, Entradas.com)

All remaining adapters throw `adapter_not_implemented:<id>`. The pipeline's per-source `try/catch` captures this as an error string and continues without aborting the run. This is by design — stubs are listed in `ADAPTERS` so they appear in status output, making it obvious which sources haven't been implemented yet.

**Wegow implementation notes (for Phase 2):**
- Spain's largest local ticketing platform, primarily Spanish-language events
- Events have JSON-LD `<script type="application/ld+json">` on event pages
- Must check `https://www.wegow.com/robots.txt` before implementation
- Pagination via HTML; estimate 100+ requests per full crawl
- Implement only if Ticketmaster + RA yield < 3,000 unique concerts

---

## Dedup Algorithm

### Fingerprint

```
fingerprint = sha1(lower(artist) + "|" + lower(venue_city) + "|" + yyyy-mm-dd)
```

**Worked example:**
- Ticketmaster returns: `artist="Rosalía"`, `venue_city="Barcelona"`, `date_iso="2026-06-15T20:00:00Z"`
- RA returns: `artist="ROSALIA"`, `venue_city="barcelona"`, `date="2026-06-15T..."`
- Both normalize to: `sha1("rosalía|barcelona|2026-06-15")` → same fingerprint → **merge**

The existing `upsertConcertFromIngest` in `DrizzleStore` handles the fingerprint computation and upsert.

### Dedup behavior on match

When `fingerprint` already exists in `concerts`:
- `is_new = false` → `merged` counter incremented
- Cheapest `price_min` is kept (lower price wins)
- Image preference order: Ticketmaster > RA > Wegow > DICE > Eventbrite > BandsInTown
- The new source row is appended to `concert.sources_json`

When fingerprint is new:
- New `concerts` row inserted (`is_new = true`)
- New `concert_sources` row created

`concert_sources` always gets a row via `recordSource()` with `UNIQUE(source, source_event_id)` — duplicate fetches are ignored at the DB level.

### Venue resolution

1. **Exact match** on `venues.name` (case-insensitive, trimmed). If found, reuse.
2. **Create new** venue row with lat/lng from raw data if no match.

Phase 2 improvement: fuzzy match that strips common prefixes (`"Palau"`, `"Sala"`, `"Teatro"`, `"Estadio"`) and removes accents before comparing.

---

## Expected Volume by Source

| Source | Fetched (raw) | After dedup | Notes |
|---|---|---|---|
| Ticketmaster ES | 3,000–6,000 | 2,800–5,500 | Primary bulk source |
| Resident Advisor | 200–800 | 150–700 | Electronic only; some overlap with TM |
| Eventbrite ES | 1,500–4,000 | — | Skipped Phase 1 (no token) |
| Wegow | 800–2,000 | — | Skipped Phase 1 (stub) |
| DICE | unknown | — | Stub |
| BandsInTown | enrichment | — | Not bulk-compatible |

**Phase 1 target:** ~3,000–5,500 unique concerts in `concerts` table.

**Expected dedup ratio (Phase 1):** 5–15% (low because only 2 sources, and they cover different music genres mostly).

**Phase 2 target (all sources):** ~4,000–8,000 unique, ~25–40% dedup ratio.

---

## Verification Checklist (run after backfill)

```sql
-- Total unique concerts
SELECT COUNT(*) FROM concerts;
-- Expected: 3,000–5,500

-- Total source records (more than concerts due to cross-source)
SELECT COUNT(*) FROM concert_sources;
-- Expected: 3,200–6,500

-- Distribution by source
SELECT source, COUNT(*) FROM concert_sources GROUP BY source ORDER BY 2 DESC;

-- Date distribution across 2026 (should be fairly even, peaks in summer)
SELECT substr(date, 1, 7) AS month, COUNT(*) AS cnt
FROM concerts
WHERE date >= '2026-01-01' AND date < '2027-01-01'
GROUP BY month ORDER BY month;

-- Price sanity check (should NOT be all 0)
SELECT
  COUNT(*) FILTER (WHERE price_min IS NOT NULL) AS with_price,
  COUNT(*) FILTER (WHERE price_min IS NULL) AS without_price,
  AVG(price_min) AS avg_min,
  MIN(price_min) AS min_price,
  MAX(price_max) AS max_price
FROM concerts;

-- Venue count
SELECT COUNT(DISTINCT venue_id) FROM concerts;
-- Expected: 200–600 unique venues

-- Manual spot-check (open 5 random source_urls in browser)
SELECT source_url FROM concert_sources ORDER BY RANDOM() LIMIT 5;
```

---

## Known Limitations and Failure Modes

| Issue | Severity | Mitigation |
|---|---|---|
| Ticketmaster TBA events (no `dateTime`) | Low | `normalize()` returns null; filtered out |
| Venue name variations ("Palau Sant Jordi" vs "Palau Sant Jordi BCN") | Medium | Separate venues created; fuzzy merge in Phase 2 |
| RA area IDs for smaller Spanish cities not covered | Medium | Only 4 main areas implemented; expand in Phase 2 |
| RA image URL construction may break | Low | `imageUrl` will be null; concert still inserted |
| Turso write latency on bulk insert (3k+ rows) | Medium | Per-concert try/catch; errors logged; run continues |
| `sources_json` field not updated on merge | Medium | Currently tracked only in `concert_sources`; Phase 2 should update `concerts.sources_json` |
| BandsInTown enrichment missing | Low | Phase 2 pass after initial backfill |
| RA GraphQL auth could be added later | Low | Monitor; update adapter if auth required |

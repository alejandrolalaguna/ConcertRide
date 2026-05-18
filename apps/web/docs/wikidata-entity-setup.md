# Wikidata Entity Setup — ConcertRide

**Goal:** Create a Wikidata entity for ConcertRide so Google's Knowledge Graph can resolve the brand to a single canonical entity. This is one of the strongest signals for AI assistants (ChatGPT, Claude, Perplexity, Gemini) to disambiguate ConcertRide vs. generic carpooling.

Once the entity exists, copy the Q-ID into `SEO_CONFIG.wikidataQid` in `apps/web/src/lib/seoConfig.ts`. `buildSchema("organization")` automatically appends `https://www.wikidata.org/wiki/{Q-ID}` to `Organization.sameAs`.

---

## Step 1 — Create a Wikidata account

1. Visit https://www.wikidata.org/wiki/Special:CreateAccount
2. Use a real name (the account is public). Avoid a brand-only username — Wikidata reviewers may treat it as conflict-of-interest editing.
3. Confirm your email. Without confirmation you cannot create new entities.

## Step 2 — Verify ConcertRide does NOT already have a Wikidata item

Before creating a new entity, search:

- https://www.wikidata.org/wiki/Special:Search?search=ConcertRide
- https://www.wikidata.org/wiki/Special:Search?search=concertride.me

If an item exists, edit it instead of creating a duplicate (Wikidata aggressively deletes duplicates).

## Step 3 — Create the entity

1. Go to https://www.wikidata.org/wiki/Special:NewItem
2. **Label (en):** `ConcertRide`
3. **Label (es):** `ConcertRide`
4. **Description (en):** `Spanish carpooling platform for concerts and music festivals`
5. **Description (es):** `Plataforma española de carpooling para conciertos y festivales`
6. **Aliases (en):** `ConcertRide ES`, `concertride.me`
7. **Aliases (es):** `Concert Ride`, `ConcertRide España`

Save. Wikidata assigns a Q-ID like `Q1234567890`.

## Step 4 — Add the recommended properties (Statements)

In the entity page, click **add statement** for each:

| Property | Code | Value |
|---|---|---|
| instance of | P31 | `organization` (Q43229) or `business` (Q4830453) |
| country | P17 | `Spain` (Q29) |
| official website | P856 | `https://concertride.me` |
| inception | P571 | `2026` |
| industry | P452 | `carpooling` (Q26214370) |
| location of formation | P740 | `Spain` (Q29) — optional |
| language of work | P407 | `Spanish` (Q1321) — optional |
| Twitter username | P2002 | `concertride_es` |
| Instagram username | P2003 | `concertride_es` |
| Facebook username | P2013 | `concertride.me` |
| LinkedIn company ID | P4264 | `concertride-es` |

Wikidata's reviewers may challenge `P31: organization` for a brand-new company without external coverage — be ready to cite at least one independent third-party source (a press article, podcast mention, industry directory). If you don't have one yet, defer the entity creation until you do.

## Step 5 — Add identifiers (optional but high-value)

If/when ConcertRide gets cited by external databases:

- **Crunchbase ID** (P2087)
- **CrunchBase organization ID** (P11631)
- **Google Knowledge Graph ID** (P2671) — appears automatically after Google indexes the site enough

## Step 6 — Copy the Q-ID back to the repo

Once saved, open `apps/web/src/lib/seoConfig.ts` and set:

```ts
wikidataQid: "Q1234567890",  // ← your real ID
```

Run `npm run build` then verify with:

```bash
curl -s https://concertride.me/ | grep -o "wikidata.org/wiki/Q[0-9]*"
```

The Wikidata URL should appear in the `Organization` JSON-LD's `sameAs` array.

## Step 7 — Cross-reference Wikipedia (long-term)

If ConcertRide eventually gets a Wikipedia article (likely needs press coverage threshold), link the article via the **sitelink** field of the Wikidata entity. Google's Knowledge Graph weights sitelinks very heavily.

---

## What NOT to do

- **Do not** create the entity from a generic `concertride_dev` account with no real-name activity — Wikidata's anti-spam patrol routinely deletes brand-only accounts.
- **Do not** add `BlaBlaCar` (Q15991115) as a "different from" statement — that creates a polemical signal we don't want.
- **Do not** mass-edit or back-link from many pages on day 1; pace edits over a week.
- **Do not** add aliases that are not legitimately used (e.g., `concertridecarpooling`).

## References

- Wikidata help: https://www.wikidata.org/wiki/Wikidata:Introduction
- Notability policy: https://www.wikidata.org/wiki/Wikidata:Notability
- Cyrus Shepard (54-study citation analysis, 2025): Wikidata sameAs correlation with AI Overview citation ~0.31.

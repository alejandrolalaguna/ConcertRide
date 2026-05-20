# Google indexability — discoverability, crawlability, serve

Owner: ConcertRide SEO • Last updated: 2026-05-20

This doc aligns the project with Google's three foundational guides:

- How Search Works — <https://developers.google.com/search/docs/fundamentals/how-search-works?hl=es>
- Get on Google — <https://developers.google.com/search/docs/fundamentals/get-on-google?hl=es>
- SEO for developers — <https://developers.google.com/search/docs/fundamentals/get-started-developers?hl=es>

## Key Google recommendations (extract)

1. **URL discovery has three signals**: revisit of known URLs, links followed from new pages, and sitemaps. Submit a sitemap for large sites or content not internally linked from the homepage.
2. **robots.txt controls crawler access, not indexing**: a blocked URL can still be indexed without content. Use `<meta name="robots" content="noindex">` for true index suppression.
3. **Canonical signals consolidate duplicates**: emit `<link rel="canonical">` on every indexable page; use `rel="alternate" hreflang="..."` for localized variants.
4. **JSON-LD structured data must be valid**: a single malformed `<script type="application/ld+json">` block can prevent rich result eligibility for the entire page.
5. **Mobile-first indexing is the default**: Googlebot crawls and indexes the mobile rendition of every page.
6. **HTTPS is required for ranking parity** with secure peers; mixed-content pages are demoted.
7. **Status codes carry semantics**: `200` indexable, `301` permanent redirect (passes signals), `302` temporary, `404`/`410` removed from index, `5xx` retry later.
8. **Search Console verification** is the only authoritative way to monitor index status, query performance and crawl errors.

## Running the audit

The static audit script ships at `apps/web/scripts/audit-google-indexability.mjs` and can be run without building:

```bash
node apps/web/scripts/audit-google-indexability.mjs
```

The script does not make network requests and exits `0` so it can be added to pre-commit pipelines without breaking CI. It performs five checks:

1. **robots.txt** — file present; `User-agent: *` declared; at least one `Sitemap:` entry; `Disallow:` covers `/api/`, `/login`, `/register`, `/profile`, `/admin`, `/crew`, `/feed`, `/squads`, `/mensajes`; `Allow: /.well-known/` declared.
2. **Sitemaps** — every URL declared via `Sitemap:` in `robots.txt` either exists on disk (`public/` or `dist/`) or is a dynamic Worker route (`/api/*`). Each XML parses, every `<lastmod>` is ISO-8601, no duplicate `<loc>` entries.
3. **Canonical** — a sample of prerendered HTML files (root, festivales, blog, two datasets, one pillar) emits `<link rel="canonical">`.
4. **JSON-LD** — every `<script type="application/ld+json">` block in the sample parses as valid JSON.
5. **Hreflang** — the sample emits `<link rel="alternate" hreflang="es-ES">` plus `x-default` (single-locale site, but declared so Google sees the language signal explicitly).

When `dist/` is missing the HTML checks are skipped with an info-level message so the script remains useful on fresh checkouts.

## Pre-deploy checklist

- [ ] `apps/web/public/robots.txt` references every production sitemap (currently 9 entries: 7 static + 1 static-aggregate + 1 dynamic Worker).
- [ ] `apps/web/public/sitemap.xml` master index references every per-type sitemap.
- [ ] Every per-type sitemap's `<lastmod>` is current (matches `CONTENT_LAST_UPDATED` from `apps/web/src/lib/seoConfig.ts`).
- [ ] Every page rendered by `prerender.mjs` emits `<link rel="canonical">` and `<link rel="alternate" hreflang="es-ES">` via `useSeoMeta`.
- [ ] Every `application/ld+json` block parses (validated by `scripts/validate-schema.mjs`).
- [ ] `apps/web/public/.well-known/security.txt` `Expires` is in the future.
- [ ] HTTPS is enforced (Cloudflare default) and HSTS is enabled (Cloudflare `_headers` file).
- [ ] No `noindex` meta on indexable pages (validated by `scripts/audit-meta.mjs`).

## Verifying property ownership in Google Search Console

ConcertRide uses **DNS TXT verification** (the only Google-recommended option for Cloudflare-hosted properties because it survives infra changes):

1. Open <https://search.google.com/search-console/welcome>.
2. Choose "Domain" property and enter `concertride.me`.
3. Copy the `google-site-verification=...` TXT record.
4. Open Cloudflare DNS dashboard for `concertride.me` and add a TXT record at the apex with the value from step 3. Set TTL to Auto.
5. Wait ~5 min for DNS propagation, then click "Verify" in Search Console.

Alternative verification methods (HTML tag in `<head>`, HTML file upload, Google Analytics) are not used because DNS TXT validates ownership of every subdomain and survives redeployments.

## Sitemap submission to Search Console

After every deploy that adds or removes a sitemap, re-submit the master index:

1. Open <https://search.google.com/search-console> with the verified property.
2. Sidebar → **Sitemaps**.
3. Enter `sitemap.xml` (relative path; Search Console resolves it against the root).
4. Click **Submit**.

Per-type sitemaps (`sitemap-festivales.xml`, `sitemap-blog.xml`, …) do **not** need to be submitted individually — Google discovers them via the master index.

Google reads `lastmod` from the sitemap aggressively after a re-submit, so a sitemap re-submit is the canonical way to nudge re-crawl of changed URLs.

## Notes on FASES 1–6 changes

- `STATIC_ROUTES` in `apps/web/scripts/prerender.mjs` already includes:
  - `/guia/festival-veterano-aficionados-mayores-2026` (Pillar 11)
  - `/datos/heatmap-demanda-festivales-ccaa-2026` (Dataset 8)
  - `/datos/cancelaciones-festivales-espana-2020-2026` (Dataset 9)
- The next `npm run build` will write all three into `dist/sitemap-static.xml` + `dist/sitemap-static-others.xml` with a fresh `lastmod`. No manual sitemap edit is required.
- `robots.txt` now Allows `/.well-known/` so crawlers reach `security.txt`, `ai-plugin.json` and `openai.txt`.
- `useSeoMeta` already emits `hreflang="es-ES"` + `x-default` on every page that opts into canonical, including the three new ones.

// Prerender-drift guard: asserts that SEO-critical content (title, schemas,
// H1, first 3 H2s, OG image, dateModified) is present in the static HTML
// BEFORE JS runs. Uses request.get() so React never hydrates — what we
// inspect is exactly what Googlebot/Bingbot/AI crawlers receive.
import { test, expect, request as pwRequest } from "@playwright/test";

const BASE = process.env.PRERENDER_BASE_URL ?? "http://127.0.0.1:5173";
const PAGES = [
  { url: "/festivales/mad-cool",        h1: /Mad Cool/i,  type: "festival" },
  { url: "/rutas/madrid-mad-cool",      h1: /Madrid|Mad Cool/i, type: "route" },
  { url: "/artistas/rosalia",           h1: /ROSAL[ÍI]A/i, type: "artist" },
];

for (const p of PAGES) {
  test(`prerender drift — ${p.url}`, async () => {
    const ctx = await pwRequest.newContext();
    const res = await ctx.get(`${BASE}${p.url}`, { headers: { "User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" } });
    expect(res.status(), `${p.url} must return 200`).toBe(200);
    const html = await res.text();

    // ── 1. <title> — never the generic SPA shell
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
    expect(title.length, `${p.url} title empty`).toBeGreaterThan(15);
    expect(title, `${p.url} generic shell title`).not.toMatch(/^ConcertRide(\s+ES)?$/i);
    expect(title).toMatch(/ConcertRide/);

    // ── 2. OG image + canonical
    expect(html).toMatch(/<meta\s+property="og:image"\s+content="https?:\/\/[^"]+"/);
    expect(html).toMatch(/<link\s+rel="canonical"\s+href="https?:\/\/[^"]+"/);

    // ── 3. H1 present in PRERENDERED body (not just hydrated)
    expect(html).toMatch(new RegExp(`<h1[^>]*>[^<]*${p.h1.source}`, "i"));

    // ── 4. At least 3 H2s in initial HTML (proves real content shipped)
    const h2Count = (html.match(/<h2[\s>]/g) ?? []).length;
    expect(h2Count, `${p.url} fewer than 3 H2s prerendered`).toBeGreaterThanOrEqual(3);

    // ── 5. JSON-LD blocks with dateModified for freshness ranking
    expect(html).toMatch(/"dateModified"\s*:\s*"20\d{2}-\d{2}-\d{2}/);

    // ── 6. Offer.price must be numeric, never a string ("Invalid Offer" GSC error)
    expect(html, `${p.url} has stringified Offer.price`).not.toMatch(/"price"\s*:\s*"\d/);
    expect(html).toMatch(/"price"\s*:\s*\d/);

    // ── 7. aggregateRating must be in SoftwareApplication schema
    expect(html).toMatch(/"aggregateRating"/);

    // ── 8. No competitor brand leak (CLAUDE.md brand-restrictions)
    expect(html.toLowerCase()).not.toMatch(/blablacar|bla\s*bla\s*car/);

    await ctx.dispose();
  });
}

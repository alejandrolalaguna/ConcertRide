# Open Graph images

`home.svg` is a placeholder. Many social crawlers (Facebook, iMessage, WhatsApp) do **not** render SVG OG images — they need a flat PNG at exactly 1200×630.

Before prod deploy:

1. Open `home.svg` in any SVG renderer (Figma, browser, Inkscape) and export `home.png` at 1200×630.
2. Commit `home.png` alongside `home.svg`.
3. Update `index.html` references from `/og/home.png` (already correct) — the SVG stays as a source file.

Alternatively, generate via sharp:
```bash
npx sharp -i apps/web/public/og/home.svg -o apps/web/public/og/home.png
```

For additional pages (concert detail, ride detail) the spec says to stay **static** — no dynamic ImageResponse (bundle-size constraint on Cloudflare Workers). Create one PNG per page template manually.

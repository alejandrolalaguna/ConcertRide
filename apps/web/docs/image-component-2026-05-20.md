# `<Image>` component + AVIF/WebP pipeline

Date: 2026-05-20

## What this adds

1. `apps/web/src/components/Image.tsx` — typed React component that emits a
   `<picture>` with AVIF and WebP sources for **local raster images**, falling
   back to the original PNG/JPG `<img>`.
2. `apps/web/scripts/convert-images.mjs` — Node script that walks
   `public/{images,og,icons}/` and writes `.avif` + `.webp` siblings next to
   every PNG/JPG it finds. Idempotent.

Neither the component nor the script touches external URLs (Ticketmaster CDN,
Unsplash, etc.) — see the TM Compliance note below.

---

## When to use `<Image>` vs plain `<img>`

| Image source                                | Use         | Why                                                                 |
| ------------------------------------------- | ----------- | ------------------------------------------------------------------- |
| Local PNG/JPG under `apps/web/public/`      | `<Image>`   | Picks AVIF (~50% smaller) or WebP (~30% smaller) when the browser supports it. |
| External URL (Ticketmaster, Unsplash, …)    | plain `<img>` *or* `<Image>` — both render identically | Component detects `http(s)://` and emits a plain `<img>` with no AVIF/WebP siblings. **Do not pre-process external URLs.** |
| SVG (`.svg`)                                | plain `<img>` *or* `<Image>` | Component detects non-raster ext and renders plain `<img>`. SVG already compresses well. |
| Already `.avif` / `.webp`                   | plain `<img>` *or* `<Image>` | No raster fallback needed. Component is safe to use. |

## Component API

```tsx
import { Image } from "@/components/Image";

<Image
  src="/og/home.png"
  alt="ConcertRide — carpooling para festivales"
  width={1200}
  height={630}
  priority           // hero / LCP candidate -> eager + fetchpriority=high
  sizes="(min-width: 768px) 50vw, 100vw"
  className="rounded-lg"
/>
```

Props:

- `src` (string, required) — local path (e.g. `/og/home.png`) or external URL.
- `alt` (string, required) — empty string allowed for decorative images.
- `width` / `height` (number) — render slot dimensions; prevents CLS.
- `loading` (`"lazy"` | `"eager"`) — defaults to `"lazy"`.
- `priority` (boolean) — sets `loading="eager"`, `decoding="sync"`,
  `fetchpriority="high"`. Use **only** for above-the-fold / LCP images.
- `sizes` (string) — passed to both `<source>` and `<img>` for responsive
  selection. Example: `"(min-width: 1024px) 33vw, 100vw"`.
- All other `<img>` attributes are forwarded (`className`, `style`, `id`,
  ARIA, event handlers, etc.).

### Output

For local rasters:

```html
<picture>
  <source type="image/avif" srcset="/og/home.avif" />
  <source type="image/webp" srcset="/og/home.webp" />
  <img src="/og/home.png" alt="…" width="1200" height="630" loading="lazy" decoding="async" />
</picture>
```

For external URLs / SVG / next-gen sources, the component degrades to a
single `<img>` element — exact same DOM as before.

---

## Running the conversion script

The script is **not** wired into `npm run build`. Run it manually whenever you
add or replace a local PNG/JPG:

```bash
node apps/web/scripts/convert-images.mjs
```

Force a full rebuild (overwrites existing `.avif` / `.webp`):

```bash
node apps/web/scripts/convert-images.mjs --force
```

What it does:

1. Walks `apps/web/public/` plus `public/images`, `public/og`,
   `public/og/templates`, `public/icons`.
2. For each `.png` / `.jpg` / `.jpeg`, writes a `.avif` (quality 55, effort 5)
   and a `.webp` (quality 78, effort 4) **next to the original**.
3. Skips outputs whose `mtime >= source mtime` unless `--force` is passed.
4. Aborts (exit 1) if it finds any file whose name starts with `ticketm_`,
   `tm_`, or `ticketmaster_` (TM Compliance guard — see below).
5. Prints a summary table with per-file sizes and total bytes saved.

Tooling: it uses `sharp` (already in `apps/web` devDependencies, v0.33.5).
No new dependencies are added.

### Why these quality settings?

- AVIF q=55 / effort=5 → roughly 50–60% smaller than the source PNG at
  visually indistinguishable quality for OG cards, festival posters, and
  decorative photography. Higher `effort` is slow but only runs offline.
- WebP q=78 → safe default that matches Cloudflare Image Resizing's
  `quality=80` baseline. ~25–35% smaller than the source PNG.
- Output mtimes are compared to source mtime, so a regenerated source PNG
  automatically retriggers a fresh AVIF/WebP next time you run the script.

---

## Why AVIF + WebP + PNG/JPG fallback?

| Format    | Browser support (2026)            | Notes                                  |
| --------- | --------------------------------- | -------------------------------------- |
| AVIF      | Chromium, Firefox, Safari 16.1+  | Best compression, slowest to encode.   |
| WebP      | All modern + Safari 14+, Edge    | Universal fallback for AVIF.           |
| PNG / JPG | Everything ever shipped          | Final safety net for ancient agents.   |

The `<picture>` element lets the browser pick the first `<source>` it can
decode. There is no JS, no UA sniffing, no preflight cost. The `<img>` inside
acts as the alt text host **and** the legacy fallback.

---

## TM Compliance — critical

`CLAUDE.md` §1 of the TM Compliance rules: **Never host Ticketmaster images
on ConcertRide servers.** Two safeguards are baked into this pipeline:

1. **`<Image>` skips external URLs.** Any `src` starting with `http://` or
   `https://` is rendered as a plain `<img>` — no AVIF/WebP siblings are
   referenced. So even if you (accidentally) pass a Ticketmaster CDN URL,
   the component will not look for a sibling on the ConcertRide origin.
2. **`convert-images.mjs` refuses TM-named files.** Filenames matching
   `ticketm_*`, `tm_*`, or `ticketmaster_*` cause the script to exit with a
   BLOCKER message. If you ever see this, the right fix is to delete the
   local copy and reference the Ticketmaster CDN URL directly.

`apps/web/src/lib/imageUrl.ts` is **not** modified — `cfImage()` still
returns external URLs as-is. The new component sits at a higher layer
(presentation) and respects the same boundary.

---

## Migration plan

Adoption is opt-in / progressive. There is no flag-day rewrite of existing
`<img>` tags. When working on a page:

1. If the page renders local PNG/JPG files (search the file for
   `src="/og/`, `src="/images/`, `src="/icons/`), replace `<img>` with
   `<Image>` keeping the same props.
2. Run `node apps/web/scripts/convert-images.mjs` so the AVIF/WebP siblings
   exist.
3. Verify in DevTools Network tab that the picked response has
   `Content-Type: image/avif` (Chromium) or `image/webp` (Safari ≤ 16.0).

No changes are needed for LandingPage hero shots (currently all external
Unsplash URLs) — they pass through unchanged.

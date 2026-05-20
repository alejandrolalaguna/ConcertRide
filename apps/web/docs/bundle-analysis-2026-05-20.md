# Bundle Analysis — 2026-05-20

Static analysis of `apps/web` dependencies, current chunking, and dynamic-import
opportunities. No build was run — sizes are estimated from `node_modules`
on-disk size, package manifests, and known minified+gzipped figures.

## Tooling added

- **`rollup-plugin-visualizer`** added to `devDependencies` (^5.12.0).
- **`cross-env`** added to `devDependencies` (^7.0.3) so the new `build:report`
  script works cross-platform (Windows PowerShell does not understand the
  `VAR=value cmd` syntax natively).
- **`vite.config.ts`**: conditional load behind `ANALYZE=true` flag. Fail-soft
  so a clean checkout without the optional dep still builds. Outputs
  `apps/web/dist/stats.html` (treemap, gzip + brotli sizes).
- **`apps/web/package.json`** script: `npm run build:report` →
  `cross-env ANALYZE=true vite build`.

Usage (after `npm install` to pick up the new devDeps):

```bash
# From repo root
npm install                   # picks up rollup-plugin-visualizer + cross-env
cd apps/web
npm run build:report          # only runs `vite build`, skipping prerender/etc.
# Open apps/web/dist/stats.html in a browser
```

The standard `npm run build` is untouched; the analyzer only activates when
`ANALYZE=true` is set.

## Top 10 heavy dependencies (`apps/web/package.json` deps)

Sizes are install size on disk (kB). Min+gzip figures from package home pages
where published; otherwise "≈" indicates rough estimate.

| # | Package           | Install kB | min+gzip est. | Type              | Currently in initial bundle? |
|---|-------------------|------------|---------------|-------------------|------------------------------|
| 1 | `lucide-react`    | 37,340     | ~5–8 kB/page  | Icon set (tree-shaken) | Yes (per-icon, light)   |
| 2 | `posthog-js`      | 36,520     | ~50 kB        | Analytics (PostHog)    | **No** — already gated by consent + dynamic import in `lib/observability.ts` |
| 3 | `@sentry/react`   | 8,933      | ~22 kB        | Error reporting        | **Yes** — `initSentry()` runs in `main.tsx` |
| 4 | `leaflet`         | 3,918      | ~42 kB        | Map renderer           | **No** — used only via lazy `MapView` |
| 5 | `motion`          | 2,355      | ~30 kB        | Animation lib          | Split into `vendor-motion` chunk (manual chunks). Shared by Hero + LandingPage; loads on first paint of `/`. |
| 6 | `react-dom`       | n/a        | ~42 kB        | Framework              | Yes (vendor-react chunk) |
| 7 | `react-router-dom`| n/a        | ~14 kB        | Routing                | Yes (vendor-router chunk) |
| 8 | `react-leaflet`   | 129        | ~6 kB         | Leaflet React wrapper  | **No** — bundled with leaflet in `vendor-map` |
| 9 | `canvas-confetti` | 112        | ~10 kB        | One-shot animation     | **Was static** in `PublishRidePage.tsx` → **now dynamic** (see below) |
| 10| `@concertride/types` | n/a     | ~0 kB         | Shared TS only         | No runtime cost (types stripped by tsc) |

Notes:
- `lucide-react`'s on-disk size is huge because every icon ships as a separate
  ESM file. Vite tree-shakes per import (`import { ArrowRight } from "lucide-react"`)
  so the actual runtime cost is small per page (~200 bytes/icon). No change.
- `posthog-js` already does dynamic `await import("posthog-js")` in
  `observability.ts` behind a consent check — confirmed clean.
- `@sentry/react` is statically imported at the top of `observability.ts` for
  `initSentry()` AND in `ErrorBoundary.tsx` for `Sentry.captureException`.
  Moving it to dynamic import would require restructuring the ErrorBoundary
  (which itself must be eagerly available to catch render errors). Skipped —
  it already lives in its own `vendor-sentry` chunk and is small enough that
  the cost/complexity tradeoff isn't worth it.

## Already lazy / well-chunked (no action needed)

All 70+ route pages in `App.tsx` are already `React.lazy()` — confirmed.

Components already lazy-loaded inside their parent pages:

| Component        | Parent page             | How                        |
|------------------|-------------------------|----------------------------|
| `MapView`        | `landing/MapSection.tsx`| `lazy(() => import("@/components/MapView"))` + Suspense |
| `RideRouteMap`   | `pages/RideDetailPage.tsx` | `lazy(() => import("@/components/RideRouteMap"))` |
| `posthog-js`     | `lib/observability.ts`  | `await import("posthog-js")` gated by `hasAnalyticsConsent()` |

Manual chunks in `vite.config.ts` already split:
- `vendor-map` (leaflet + react-leaflet)
- `vendor-motion` (motion/react)
- `vendor-sentry` (@sentry/react)
- `vendor-posthog` (posthog-js)
- `vendor-react`, `vendor-router`

## Actions applied this session

### 1. `canvas-confetti` → dynamic import on success

**File:** `apps/web/src/pages/PublishRidePage.tsx`

Was a static `import confetti from "canvas-confetti"` at the top of a route
module. Confetti only fires after the publish-ride success handler resolves —
zero need to ship it in the page's initial chunk.

**Change:** removed the top-level static import; now uses
`import("canvas-confetti").then(({ default: confetti }) => confetti(…))` inside
the click handler. Wrapped in `.catch(() => {})` so a failed dynamic chunk load
(offline, ad-blocker) silently degrades — the success screen still renders.

**Estimated savings:** ~10 kB min+gzip removed from the `PublishRidePage`
chunk. Note this is page-level, not initial-bundle, but matters because
`PublishRidePage` is also pre-fetched on hover of the "Publicar viaje" nav
link.

### 2. `ExitIntentModal` → lazy in App.tsx outer layout

**File:** `apps/web/src/App.tsx`

Was statically imported in the outer App layout, meaning its full JSX +
focus-trap + lucide `X` icon shipped in the initial chunk for every route.
The component returns `null` until the user moves the mouse off the top of
the viewport (or scrolls back up >30% on mobile) — true non-critical UI.

**Change:** wrapped in `React.lazy()` with `<Suspense fallback={null}>` because
no visible loader is needed (the modal is silent until triggered).

**Estimated savings:** ~3–5 kB min+gzip removed from the initial chunk
(modal markup + focus-trap selectors). The chunk is fetched only after
React mounts and React Router settles, so it never blocks LCP.

## Not applied (with rationale)

- **`@sentry/react`** static import in `lib/observability.ts` and
  `components/ErrorBoundary.tsx` — kept eager. Sentry must be initialised
  before render to catch hydration errors, and `ErrorBoundary` cannot be lazy
  (it has to be the parent of the Suspense tree). Sentry is already in its
  own `vendor-sentry` chunk and `tracesSampleRate: 0` keeps the runtime
  surface minimal.
- **`motion`** is used inside many landing components above the fold
  (`Hero`, `StatsBar`, `HorizontalCarousel`, `DriverCTA`, `FinalCTA`,
  `TestimonialsSection`, etc.). The whole library lives in `vendor-motion`,
  shared across pages, so converting per-component to dynamic would
  fragment the chunk for marginal benefit on the LandingPage chunk. Skipped
  per "no deep refactor" rule.
- **`leaflet` + `react-leaflet`** — already lazy via `MapView` + `RideRouteMap`.
  Confirmed `vendor-map` chunk only loads on routes that render a map.

## Bundle-initial size impact (estimate)

Initial JS download for `/` (LandingPage), gzip:

| Chunk        | Before  | After   | Δ        |
|--------------|---------|---------|----------|
| App.tsx layout| ~12 kB  | ~7 kB   | −5 kB    |
| PublishRidePage (when navigated)| ~38 kB | ~28 kB | −10 kB |
| Initial JS for first paint (excl. vendor) | ~70 kB | ~65 kB | **−5 kB** |

Totals are estimates pending an actual `npm run build:report` run with the
visualizer enabled. Confirming exact numbers requires installing the new
devDeps and producing `dist/stats.html`.

## Type-check

```bash
npx tsc --noEmit -p apps/web/tsconfig.json
# clean — no errors
```

## How to validate next

```bash
# Install the new devDeps
npm install

# Generate visualizer (one-time, opt-in)
cd apps/web
npm run build:report

# Open dist/stats.html — check that:
# - canvas-confetti appears as its own small chunk (not inlined into PublishRidePage)
# - ExitIntentModal appears as its own small chunk (not inlined into App.tsx layout)
# - vendor-motion / vendor-map / vendor-sentry remain stable
```

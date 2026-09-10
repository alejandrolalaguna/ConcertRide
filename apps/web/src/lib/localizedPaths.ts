// ─────────────────────────────────────────────────────────────────────────────
// localizedPaths — the RAW registry of locale-prefixed routes, with ZERO imports.
//
// Why this file is separate from `localizedRoutes.ts`: the Cloudflare Worker
// (`apps/api/src/index.ts`) needs this set to 301 the accidental `/en|/ca`
// mirror (SKILL §AE), but `localizedRoutes.ts` transitively imports
// `./siteUrl`, which reads `import.meta.env` — a Vite-only global that does not
// type-check under the API's tsconfig. Keeping the data dependency-free lets
// BOTH the web bundle and the Worker consume the same single source of truth
// instead of duplicating the allowlist (which would silently drift).
//
// `localizedRoutes.ts` re-exports `LOCALIZED_PATHS` from here, so §AB's rule
// still holds: add a path in ONE place and hreflang + prerender + sitemap +
// the Worker's mirror-culling redirect all follow automatically.
// ─────────────────────────────────────────────────────────────────────────────

// Locale-stripped base paths (root is "/", others have NO trailing slash) that
// have a fully-translated `/en/` SSR variant. A page only belongs here once its
// VISIBLE CONTENT is genuinely English — shipping a half-Spanish "en" page would
// give Google a fake language alternate. Keep in sync with prerender + content.
//
// Pilot v1 (2026-06): home + concerts hub (both fully English).
//
// Batch-2 festivals (2026-06-15): mad-cool / primavera-sound / sonar are now
// fully English. The remaining Spanish surfaces flagged in the original pilot
// (TransportTable, EventTransportHub, enrichmentBlocks, the H1 price subtitle)
// are now locale-aware, and each festival ships curated *_en data (blurb,
// quotableAnswer, faqs, arrival_*, transport_options, nearby_airports,
// accommodation_zones, enrichmentBlocks, parking/camping). These are top-tier
// curated money-pages with genuine English-speaking demand — NOT mass
// programmatic clusters (which stay es-only to avoid Scaled Content Abuse).
// To add more festivals: translate their *_en data + verify <5 ES tokens on
// the built /en page, then add the path here.
export const LOCALIZED_PATHS: ReadonlySet<string> = new Set<string>([
  "/",
  "/concerts",
  "/festivales/mad-cool",
  "/festivales/primavera-sound",
  "/festivales/sonar",
]);

// Strip a known locale prefix from a path, returning the locale-stripped base
// path ("/en" → "/", "/en/blog/x" → "/blog/x", "/blog/x" → "/blog/x") plus the
// prefix that was removed (null when there was none). Trailing slashes are
// normalised so "/en/concerts/" resolves to "/concerts".
//
// Duplicated-logic warning: `localizedRoutes.basePath()` does the same job but
// also accepts absolute URLs (it needs SITE_URL). This variant is path-only and
// import-free so the Worker can use it.
export function stripLocalePrefix(
  path: string,
  locales: readonly string[],
): { locale: string | null; base: string } {
  for (const loc of locales) {
    const prefix = `/${loc}`;
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      const rest = path.slice(prefix.length) || "/";
      const base = rest === "/" ? "/" : rest.replace(/\/+$/, "") || "/";
      return { locale: loc, base };
    }
  }
  return { locale: null, base: path };
}

// ─────────────────────────────────────────────────────────────────────────────
// localizedRoutes — single source of truth for which pages have a server-rendered
// English (`/en/…`) variant, plus the hreflang / canonical helpers.
//
// Why a registry: reciprocal hreflang must ONLY be emitted on pages that truly
// have BOTH language variants. Emitting `hreflang="en" → /en/…` on a page whose
// English counterpart doesn't exist points Google at a 404 and invalidates the
// whole cluster (and wastes crawl budget). So every page consults this set
// before emitting alternates; non-localized pages keep their es-only behaviour.
//
// SEO invariants enforced here:
//   • Canonical is ALWAYS self-referential (/en/X canonicals to /en/X).
//   • hreflang is reciprocal: es-ES → ES url, en → EN url, x-default → ES url.
// ─────────────────────────────────────────────────────────────────────────────

import { SITE_URL } from "./siteUrl";

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

// Ordered list (for prerender + sitemap generation).
export const EN_PILOT_BASE_PATHS: readonly string[] = Array.from(LOCALIZED_PATHS);

// The `/en/…` URL paths to prerender (root maps to "/en", no trailing slash).
export const EN_PILOT_PATHS: readonly string[] = EN_PILOT_BASE_PATHS.map((p) =>
  p === "/" ? "/en" : `/en${p}`,
);

function normalizePath(p: string): string {
  if (!p || p === "/") return "/";
  return p.replace(/\/+$/, "");
}

// Reduce a same-origin URL or a path to its locale-stripped base path.
// "https://concertride.me/en/concerts" → "/concerts"; "/en" → "/"; "/" → "/".
export function basePath(urlOrPath: string): string {
  let p = urlOrPath;
  if (p.startsWith(SITE_URL)) p = p.slice(SITE_URL.length) || "/";
  else if (p.startsWith("http")) {
    try {
      p = new URL(p).pathname;
    } catch {
      /* leave as-is */
    }
  }
  if (!p.startsWith("/")) p = `/${p}`;
  const seg = p.split("/")[1];
  if (seg === "en" || seg === "ca") p = p.slice(seg.length + 1) || "/";
  return normalizePath(p);
}

// Absolute ES (default) URL for a base path.
export function esUrl(base: string): string {
  const bp = normalizePath(base);
  return bp === "/" ? SITE_URL : `${SITE_URL}${bp}`;
}

// Absolute EN URL for a base path.
export function enUrl(base: string): string {
  const bp = normalizePath(base);
  return bp === "/" ? `${SITE_URL}/en` : `${SITE_URL}/en${bp}`;
}

// Rewrite a self canonical to the given locale's variant. Used by the SSR render
// of /en/ pages so the captured canonical is self-referential to /en/… (never ES).
export function localizeCanonical(canonical: string, locale: string): string {
  if (locale === "es") return canonical;
  const bp = basePath(canonical);
  return locale === "en" ? enUrl(bp) : canonical;
}

export interface HreflangAlt {
  hreflang: string;
  href: string;
}

// Reciprocal hreflang alternates for a page, or null if the page is not part of
// the localized set (→ caller keeps its single-language behaviour).
export function hreflangAlternates(canonical: string): HreflangAlt[] | null {
  const bp = basePath(canonical);
  if (!LOCALIZED_PATHS.has(bp)) return null;
  const es = esUrl(bp);
  const en = enUrl(bp);
  return [
    { hreflang: "es-ES", href: es },
    { hreflang: "en", href: en },
    { hreflang: "x-default", href: es },
  ];
}

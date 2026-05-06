import { useEffect } from "react";
import { SITE_URL } from "./siteUrl";

export interface BreadcrumbItem {
  position: number;
  name: string;
  url: string;
}

interface SeoMeta {
  title: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogType?: "website" | "article" | "music.event";
  noindex?: boolean;
  articleAuthor?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleSection?: string;
  articleTags?: string[];
  /** ISO 3166-2 region code, e.g. "ES-MD", "ES-CT", "ES-PV" */
  geoRegion?: string;
  /** Human-readable place name, e.g. "Madrid" or "Bilbao, País Vasco" */
  geoPlacename?: string;
  /** Decimal latitude, e.g. 40.4168 */
  geoLat?: number;
  /** Decimal longitude, e.g. -3.7038 */
  geoLng?: number;
  /** Breadcrumb items for JSON-LD BreadcrumbList */
  breadcrumb?: BreadcrumbItem[];
}

const DEFAULT_DESCRIPTION =
  "Carpooling para conciertos en España. Comparte coche, divide gastos y llega seguro. Publica un viaje o busca uno en 2 minutos. Gratis.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og/home.png`;
const DEFAULT_OG_IMAGE_WIDTH = 1200;
const DEFAULT_OG_IMAGE_HEIGHT = 630;
const SITE_NAME = "ConcertRide ES";
const TWITTER_SITE = "@concertride_es";
const OG_LOCALE = "es_ES";

const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

// SSR collector — when running under react-dom/server during the prerender
// build, useEffect never fires. We expose a mutable side channel so the
// render pipeline can capture the SEO meta of the route being rendered.
// `__concertrideSsrSeo` is a global module slot read by `prerender.ts`.
declare global {
  // eslint-disable-next-line no-var
  var __concertrideSsrSeo: ResolvedSeo | null | undefined;
}

export interface ResolvedSeo {
  title: string;
  fullTitle: string;
  description: string;
  canonical?: string;
  keywords?: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt: string;
  ogImageWidth: number;
  ogImageHeight: number;
  ogType: "website" | "article" | "music.event";
  noindex: boolean;
  articleAuthor?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleSection?: string;
  articleTags?: string[];
  geoRegion?: string;
  geoPlacename?: string;
  geoLat?: number;
  geoLng?: number;
  breadcrumb?: BreadcrumbItem[];
}

function resolve(meta: SeoMeta): ResolvedSeo {
  const fullTitle = meta.title.includes("ConcertRide") ? meta.title : `${meta.title} — ${SITE_NAME}`;
  return {
    title: meta.title,
    fullTitle,
    description: meta.description || DEFAULT_DESCRIPTION,
    canonical: meta.canonical,
    keywords: meta.keywords,
    ogTitle: meta.ogTitle ?? meta.title,
    ogDescription: meta.ogDescription ?? meta.description ?? DEFAULT_DESCRIPTION,
    ogImage: meta.ogImage || DEFAULT_OG_IMAGE,
    ogImageAlt: meta.ogImageAlt ?? meta.ogTitle ?? meta.title,
    ogImageWidth: meta.ogImageWidth ?? DEFAULT_OG_IMAGE_WIDTH,
    ogImageHeight: meta.ogImageHeight ?? DEFAULT_OG_IMAGE_HEIGHT,
    ogType: meta.ogType ?? "website",
    noindex: meta.noindex ?? false,
    articleAuthor: meta.articleAuthor,
    articlePublishedTime: meta.articlePublishedTime,
    articleModifiedTime: meta.articleModifiedTime,
    articleSection: meta.articleSection,
    articleTags: meta.articleTags,
    geoRegion: meta.geoRegion,
    geoPlacename: meta.geoPlacename,
    geoLat: meta.geoLat,
    geoLng: meta.geoLng,
    breadcrumb: meta.breadcrumb,
  };
}

function setMeta(name: string, content: string, prop = false) {
  const attr = prop ? "property" : "name";
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(name: string, prop = false) {
  const attr = prop ? "property" : "name";
  const el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (el) el.remove();
}

function setLink(rel: string, href: string, extraAttrs?: Record<string, string>) {
  const selector = extraAttrs
    ? `link[rel="${rel}"]${Object.entries(extraAttrs).map(([k, v]) => `[${k}="${v}"]`).join("")}`
    : `link[rel="${rel}"]`;
  let el = document.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (extraAttrs) Object.entries(extraAttrs).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSeoMeta(meta: SeoMeta) {
  // SSR path: capture the resolved meta on the global slot. The prerender
  // script reads this AFTER renderToString so it always sees the deepest
  // hook call (i.e. the page-level useSeoMeta wins over layout-level ones).
  if (!isBrowser) {
    globalThis.__concertrideSsrSeo = resolve(meta);
  }

  useEffect(() => {
    const r = resolve(meta);
    document.title = r.fullTitle;

    const ogUrl = r.canonical ?? (window.location.origin + window.location.pathname);

    setMeta("description", r.description);
    setMeta(
      "robots",
      r.noindex
        ? "noindex, nofollow"
        : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    );
    if (r.keywords) setMeta("keywords", r.keywords);

    // OpenGraph
    setMeta("og:locale", OG_LOCALE, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:type", r.ogType, true);
    setMeta("og:url", ogUrl, true);
    setMeta("og:title", r.ogTitle, true);
    setMeta("og:description", r.ogDescription, true);
    setMeta("og:image", r.ogImage, true);
    setMeta("og:image:secure_url", r.ogImage, true);
    setMeta("og:image:width", String(r.ogImageWidth), true);
    setMeta("og:image:height", String(r.ogImageHeight), true);
    setMeta("og:image:type", "image/png", true);
    setMeta("og:image:alt", r.ogImageAlt.includes(SITE_NAME) ? r.ogImageAlt : `${r.ogImageAlt} — ${SITE_NAME}`, true);

    if (r.ogType === "article" && r.articlePublishedTime) {
      setMeta("article:published_time", r.articlePublishedTime, true);
      if (r.articleModifiedTime) setMeta("article:modified_time", r.articleModifiedTime, true);
      if (r.articleAuthor) setMeta("article:author", r.articleAuthor, true);
      if (r.articleSection) setMeta("article:section", r.articleSection, true);
      if (r.articleTags?.length) {
        r.articleTags.forEach((tag) => setMeta("article:tag", tag, true));
      }
      setMeta("article:publisher", "https://www.facebook.com/concertride.me", true);
    } else {
      removeMeta("article:published_time", true);
      removeMeta("article:modified_time", true);
      removeMeta("article:author", true);
      removeMeta("article:section", true);
      removeMeta("article:tag", true);
      removeMeta("article:publisher", true);
    }

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:site", TWITTER_SITE);
    setMeta("twitter:creator", TWITTER_SITE);
    setMeta("twitter:title", r.ogTitle);
    setMeta("twitter:description", r.ogDescription);
    setMeta("twitter:image", r.ogImage);
    setMeta("twitter:image:alt", r.ogImageAlt.includes(SITE_NAME) ? r.ogImageAlt : `${r.ogImageAlt} — ${SITE_NAME}`);

    if (r.canonical) {
      setLink("canonical", r.canonical);
      setLink("alternate", r.canonical, { hreflang: "es-ES" });
      setLink("alternate", r.canonical, { hreflang: "x-default" });
    }

    // Geo meta tags — dynamic per page (not hardcoded to Madrid)
    if (r.geoRegion) {
      setMeta("geo.region", r.geoRegion);
    } else {
      removeMeta("geo.region");
    }
    if (r.geoPlacename) {
      setMeta("geo.placename", r.geoPlacename);
    } else {
      removeMeta("geo.placename");
    }
    if (r.geoLat != null && r.geoLng != null) {
      setMeta("geo.position", `${r.geoLat};${r.geoLng}`);
      setMeta("ICBM", `${r.geoLat}, ${r.geoLng}`);
    } else {
      removeMeta("geo.position");
      removeMeta("ICBM");
    }
  }, [
    meta.title, meta.description, meta.canonical, meta.keywords,
    meta.ogTitle, meta.ogDescription, meta.ogImage, meta.ogImageWidth,
    meta.ogImageHeight, meta.ogType, meta.noindex,
    meta.articleAuthor, meta.articlePublishedTime, meta.articleModifiedTime, meta.articleSection, meta.articleTags,
    meta.geoRegion, meta.geoPlacename, meta.geoLat, meta.geoLng,
  ]);
}

// Build helpers — used by the prerender script and (in dev) for tests.
export function renderSeoToHtml(seo: ResolvedSeo, urlPath: string): {
  title: string;
  metaTags: string;
  linkTags: string;
} {
  const ogUrl = seo.canonical ?? `${SITE_URL}${urlPath}`;

  const lines: string[] = [];
  const push = (tag: string) => lines.push(`    ${tag}`);

  push(`<meta name="description" content="${escapeAttr(seo.description)}" />`);
  push(
    `<meta name="robots" content="${
      seo.noindex
        ? "noindex, nofollow"
        : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    }" />`,
  );
  if (seo.keywords) push(`<meta name="keywords" content="${escapeAttr(seo.keywords)}" />`);

  push(`<meta property="og:locale" content="${OG_LOCALE}" />`);
  push(`<meta property="og:site_name" content="${SITE_NAME}" />`);
  push(`<meta property="og:type" content="${seo.ogType}" />`);
  push(`<meta property="og:url" content="${escapeAttr(ogUrl)}" />`);
  push(`<meta property="og:title" content="${escapeAttr(seo.ogTitle)}" />`);
  push(`<meta property="og:description" content="${escapeAttr(seo.ogDescription)}" />`);
  push(`<meta property="og:image" content="${escapeAttr(seo.ogImage)}" />`);
  push(`<meta property="og:image:secure_url" content="${escapeAttr(seo.ogImage)}" />`);
  push(`<meta property="og:image:width" content="${seo.ogImageWidth}" />`);
  push(`<meta property="og:image:height" content="${seo.ogImageHeight}" />`);
  push(`<meta property="og:image:type" content="image/png" />`);
  push(`<meta property="og:image:alt" content="${escapeAttr(seo.ogImageAlt.includes(SITE_NAME) ? seo.ogImageAlt : `${seo.ogImageAlt} — ${SITE_NAME}`)}" />`);

  if (seo.ogType === "article" && seo.articlePublishedTime) {
    push(`<meta property="article:published_time" content="${escapeAttr(seo.articlePublishedTime)}" />`);
    if (seo.articleModifiedTime)
      push(`<meta property="article:modified_time" content="${escapeAttr(seo.articleModifiedTime)}" />`);
    if (seo.articleAuthor) push(`<meta property="article:author" content="${escapeAttr(seo.articleAuthor)}" />`);
    if (seo.articleSection) push(`<meta property="article:section" content="${escapeAttr(seo.articleSection)}" />`);
    push(`<meta property="article:publisher" content="https://www.facebook.com/concertride.me" />`);
    if (seo.articleTags?.length) {
      seo.articleTags.forEach((tag) =>
        push(`<meta property="article:tag" content="${escapeAttr(tag)}" />`),
      );
    }
  }

  push(`<meta name="twitter:card" content="summary_large_image" />`);
  push(`<meta name="twitter:site" content="${TWITTER_SITE}" />`);
  push(`<meta name="twitter:creator" content="${TWITTER_SITE}" />`);
  push(`<meta name="twitter:title" content="${escapeAttr(seo.ogTitle)}" />`);
  push(`<meta name="twitter:description" content="${escapeAttr(seo.ogDescription)}" />`);
  push(`<meta name="twitter:image" content="${escapeAttr(seo.ogImage)}" />`);
  push(`<meta name="twitter:image:alt" content="${escapeAttr(seo.ogImageAlt.includes(SITE_NAME) ? seo.ogImageAlt : `${seo.ogImageAlt} — ${SITE_NAME}`)}" />`);

  // Geo meta tags — dynamic per page
  if (seo.geoRegion) push(`<meta name="geo.region" content="${escapeAttr(seo.geoRegion)}" />`);
  if (seo.geoPlacename) push(`<meta name="geo.placename" content="${escapeAttr(seo.geoPlacename)}" />`);
  if (seo.geoLat != null && seo.geoLng != null) {
    push(`<meta name="geo.position" content="${seo.geoLat};${seo.geoLng}" />`);
    push(`<meta name="ICBM" content="${seo.geoLat}, ${seo.geoLng}" />`);
  }

  const linkLines: string[] = [];
  if (seo.canonical) {
    linkLines.push(`    <link rel="canonical" href="${escapeAttr(seo.canonical)}" />`);
    linkLines.push(`    <link rel="alternate" hreflang="es-ES" href="${escapeAttr(seo.canonical)}" />`);
    linkLines.push(`    <link rel="alternate" hreflang="x-default" href="${escapeAttr(seo.canonical)}" />`);
  }

  return {
    title: seo.fullTitle,
    metaTags: lines.join("\n"),
    linkTags: linkLines.join("\n"),
  };
}

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Breadcrumb JSON-LD helper for prerender script
export function renderBreadcrumbToHtml(breadcrumb: BreadcrumbItem[]): string {
  if (!breadcrumb || breadcrumb.length === 0) return "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      item: item.url,
    })),
  };
  return `    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
}

import { useEffect } from "react";

interface SeoMeta {
  title: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogType?: "website" | "article" | "music.event";
  noindex?: boolean;
  articleAuthor?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleSection?: string;
}

const DEFAULT_DESCRIPTION =
  "Carpooling para conciertos en España. Comparte coche, divide gastos y llega seguro. Publica un viaje o busca uno en 2 minutos. Gratis.";
const DEFAULT_OG_IMAGE = "https://concertride.es/og/home.png";
const DEFAULT_OG_IMAGE_WIDTH = 1200;
const DEFAULT_OG_IMAGE_HEIGHT = 630;
const SITE_NAME = "ConcertRide ES";
const TWITTER_SITE = "@concertride_es";
const OG_LOCALE = "es_ES";

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

export function useSeoMeta({
  title,
  description,
  canonical,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogImageWidth,
  ogImageHeight,
  ogType = "website",
  noindex = false,
  articleAuthor,
  articlePublishedTime,
  articleModifiedTime,
  articleSection,
}: SeoMeta) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    document.title = fullTitle;

    const desc = description || DEFAULT_DESCRIPTION;
    const image = ogImage || DEFAULT_OG_IMAGE;
    const imgWidth = ogImageWidth ?? DEFAULT_OG_IMAGE_WIDTH;
    const imgHeight = ogImageHeight ?? DEFAULT_OG_IMAGE_HEIGHT;
    const resolvedOgTitle = ogTitle ?? title;
    const resolvedOgDesc = ogDescription ?? desc;
    const ogUrl = canonical ?? (window.location.origin + window.location.pathname);

    setMeta("description", desc);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    if (keywords) setMeta("keywords", keywords);

    // OpenGraph
    setMeta("og:locale", OG_LOCALE, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:type", ogType, true);
    setMeta("og:url", ogUrl, true);
    setMeta("og:title", resolvedOgTitle, true);
    setMeta("og:description", resolvedOgDesc, true);
    setMeta("og:image", image, true);
    setMeta("og:image:secure_url", image, true);
    setMeta("og:image:width", String(imgWidth), true);
    setMeta("og:image:height", String(imgHeight), true);
    setMeta("og:image:type", "image/png", true);
    setMeta("og:image:alt", `${resolvedOgTitle} — ${SITE_NAME}`, true);

    // Article-specific OG tags
    if (ogType === "article" && articlePublishedTime) {
      setMeta("article:published_time", articlePublishedTime, true);
      if (articleModifiedTime) setMeta("article:modified_time", articleModifiedTime, true);
      if (articleAuthor) setMeta("article:author", articleAuthor, true);
      if (articleSection) setMeta("article:section", articleSection, true);
      setMeta("article:publisher", "https://www.facebook.com/concertride.es", true);
    } else {
      removeMeta("article:published_time", true);
      removeMeta("article:modified_time", true);
      removeMeta("article:author", true);
      removeMeta("article:section", true);
      removeMeta("article:publisher", true);
    }

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:site", TWITTER_SITE);
    setMeta("twitter:creator", TWITTER_SITE);
    setMeta("twitter:title", resolvedOgTitle);
    setMeta("twitter:description", resolvedOgDesc);
    setMeta("twitter:image", image);
    setMeta("twitter:image:alt", `${resolvedOgTitle} — ${SITE_NAME}`);

    if (canonical) {
      setLink("canonical", canonical);
      setLink("alternate", canonical, { hreflang: "es-ES" });
      setLink("alternate", canonical, { hreflang: "x-default" });
    }
  }, [
    title, description, canonical, keywords, ogTitle, ogDescription,
    ogImage, ogImageWidth, ogImageHeight, ogType, noindex,
    articleAuthor, articlePublishedTime, articleModifiedTime, articleSection,
  ]);
}

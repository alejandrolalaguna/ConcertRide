import { useEffect } from "react";

interface SeoMeta {
  title: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
}

const DEFAULT_DESCRIPTION =
  "Carpooling para conciertos en España. Comparte coche, divide gastos y llega seguro. Publica un viaje o busca uno en 2 minutos. Gratis.";
const DEFAULT_OG_IMAGE = "https://concertride.es/og/home.png";
const SITE_NAME = "ConcertRide ES";

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

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
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
  ogType = "website",
  noindex = false,
}: SeoMeta) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    document.title = fullTitle;

    const desc = description || DEFAULT_DESCRIPTION;
    const image = ogImage || DEFAULT_OG_IMAGE;
    const resolvedOgTitle = ogTitle ?? title;
    const resolvedOgDesc = ogDescription ?? desc;

    setMeta("description", desc);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");
    if (keywords) setMeta("keywords", keywords);
    setMeta("og:type", ogType, true);
    setMeta("og:title", resolvedOgTitle, true);
    setMeta("og:description", resolvedOgDesc, true);
    setMeta("og:image", image, true);
    setMeta("og:image:secure_url", image, true);
    setMeta("twitter:title", resolvedOgTitle, true);
    setMeta("twitter:description", resolvedOgDesc, true);
    setMeta("twitter:image", image, true);

    if (canonical) {
      setLink("canonical", canonical);
      let hreflang = document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="es-ES"]');
      if (!hreflang) {
        hreflang = document.createElement("link");
        hreflang.setAttribute("rel", "alternate");
        hreflang.setAttribute("hreflang", "es-ES");
        document.head.appendChild(hreflang);
      }
      hreflang.setAttribute("href", canonical);
    }
  }, [title, description, canonical, keywords, ogTitle, ogDescription, ogImage, ogType, noindex]);
}

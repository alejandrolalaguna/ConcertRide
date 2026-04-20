import { useEffect } from "react";

interface SeoMeta {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article";
}

const DEFAULT_DESCRIPTION =
  "Encuentra o publica un viaje compartido para conciertos en España. Divide el coste, viaja seguro y llega al show. BlaBlaCar para conciertos.";
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
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
}: SeoMeta) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
    document.title = fullTitle;

    const desc = description || DEFAULT_DESCRIPTION;
    const image = ogImage || DEFAULT_OG_IMAGE;
    const resolvedOgTitle = ogTitle ?? title;
    const resolvedOgDesc = ogDescription ?? desc;

    setMeta("description", desc);
    setMeta("og:type", ogType, true);
    setMeta("og:title", resolvedOgTitle, true);
    setMeta("og:description", resolvedOgDesc, true);
    setMeta("og:image", image, true);
    setMeta("twitter:title", resolvedOgTitle, true);
    setMeta("twitter:description", resolvedOgDesc, true);
    setMeta("twitter:image", image, true);

    if (canonical) setLink("canonical", canonical);
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, ogType]);
}

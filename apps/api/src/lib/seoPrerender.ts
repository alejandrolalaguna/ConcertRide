/**
 * SEO prerender middleware for Cloudflare Workers.
 *
 * When a search bot (Googlebot, Bingbot, etc.) requests a SPA route, it gets
 * the raw index.html which has no per-page <title> or <meta> — just the generic
 * homepage values. This middleware intercepts those requests and rewrites the
 * HTML head with route-specific metadata before delivery.
 *
 * Only activates for known crawlers — real users get the untouched asset for
 * best performance (no HTML rewriting overhead).
 */

import type { Context, Next } from "hono";
import type { HonoEnv } from "../types";

const BASE = "https://concertride.es";
const DEFAULT_IMG = `${BASE}/og/home.png`;
const SITE_NAME = "ConcertRide ES";

const SEARCH_BOTS =
  /Googlebot|bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|Exabot|facebot|ia_archiver|AhrefsBot|SemrushBot|MJ12bot|DotBot|Applebot|LinkedInBot|Twitterbot|facebookexternalhit|WhatsApp|Slackbot|TelegramBot|Discordbot|OAI-SearchBot|PerplexityBot|anthropic-ai|Google-Extended|GPTBot|ChatGPT-User|CCBot|ClaudeBot/i;

interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
}

// ── Static route table ────────────────────────────────────────────────────────
const STATIC_ROUTES: Record<string, RouteMeta> = {
  "/": {
    title: `${SITE_NAME} — Carpooling para conciertos en España | Viajes compartidos`,
    description:
      "Carpooling para conciertos en España. Comparte coche, divide gastos y llega seguro. Publica un viaje o busca uno en 2 minutos. Gratis, sin comisiones.",
    canonical: `${BASE}/`,
  },
  "/concerts": {
    title: `Conciertos en España 2026 — Carpooling sin comisiones | ${SITE_NAME}`,
    description:
      "Directorio de conciertos en España con viajes compartidos disponibles. Filtra por ciudad, artista o fecha. Sin comisión. ConcertRide.",
    canonical: `${BASE}/concerts`,
  },
  "/festivales": {
    title: `Carpooling para festivales de música en España 2026 — ${SITE_NAME}`,
    description:
      "Viajes compartidos a los festivales más grandes de España: Mad Cool, Primavera Sound, Sónar, FIB, BBK Live y más. Sin taxi, sin comisión.",
    canonical: `${BASE}/festivales`,
  },
  "/guia-transporte-festivales": {
    title: `Guía de transporte para festivales de música en España — ${SITE_NAME}`,
    description:
      "Cómo llegar a los principales festivales de España en coche compartido. Precios, tiempos y consejos para Mad Cool, Primavera Sound, Sónar y más.",
    canonical: `${BASE}/guia-transporte-festivales`,
  },
  "/como-funciona": {
    title: `Cómo funciona el carpooling para conciertos — ${SITE_NAME}`,
    description:
      "Publica o reserva un viaje compartido a un concierto en 2 minutos. Sin comisión, conductores verificados, pago directo al conductor.",
    canonical: `${BASE}/como-funciona`,
  },
  "/faq": {
    title: `Preguntas frecuentes sobre carpooling a conciertos — ${SITE_NAME}`,
    description:
      "Respuestas a las preguntas más frecuentes sobre ConcertRide: seguridad, pagos, cancelaciones y más.",
    canonical: `${BASE}/faq`,
  },
  "/acerca-de": {
    title: `Acerca de ConcertRide — Carpooling para la cultura en España`,
    description:
      "ConcertRide es la plataforma española de carpooling para conciertos y festivales. Sin comisiones, sin intermediarios, conductores verificados.",
    canonical: `${BASE}/acerca-de`,
  },
  "/contacto": {
    title: `Contacto — ${SITE_NAME}`,
    description: "Ponte en contacto con el equipo de ConcertRide.",
    canonical: `${BASE}/contacto`,
  },
  "/publish": {
    title: `Publicar un viaje a un concierto — ${SITE_NAME}`,
    description:
      "Abre tu coche a un concierto o festival y comparte gastos con otros fans. Publica gratis en 2 minutos.",
    canonical: `${BASE}/publish`,
  },
};

// ── Festival pages ─────────────────────────────────────────────────────────────
interface FestivalMeta {
  name: string;
  shortName: string;
  city: string;
  venue: string;
  dates: string;
  priceFrom: string;
}

const FESTIVALS: Record<string, FestivalMeta> = {
  "mad-cool": { name: "Mad Cool Festival", shortName: "Mad Cool", city: "Madrid", venue: "IFEMA Madrid", dates: "9–11 julio 2026", priceFrom: "4" },
  "primavera-sound": { name: "Primavera Sound", shortName: "Primavera Sound", city: "Barcelona", venue: "Parc del Fòrum", dates: "28 mayo–1 junio 2026", priceFrom: "5" },
  "sonar": { name: "Sónar Festival", shortName: "Sónar", city: "Barcelona", venue: "Fira de Barcelona", dates: "18–20 junio 2026", priceFrom: "5" },
  "fib": { name: "FIB Benicàssim", shortName: "FIB", city: "Benicàssim", venue: "Recinte Festivaler", dates: "16–19 julio 2026", priceFrom: "6" },
  "bbk-live": { name: "Bilbao BBK Live", shortName: "BBK Live", city: "Bilbao", venue: "Kobetamendi", dates: "9–11 julio 2026", priceFrom: "5" },
  "resurrection-fest": { name: "Resurrection Fest", shortName: "Resurrection Fest", city: "Viveiro", venue: "Recinto de Viveiro", dates: "25–28 junio 2026", priceFrom: "8" },
  "arenal-sound": { name: "Arenal Sound", shortName: "Arenal Sound", city: "Burriana", venue: "Playa del Arenal", dates: "29 jul–2 ago 2026", priceFrom: "6" },
  "medusa-festival": { name: "Medusa Festival", shortName: "Medusa", city: "Cullera", venue: "Playa de Cullera", dates: "12–16 agosto 2026", priceFrom: "6" },
  "vina-rock": { name: "Viña Rock", shortName: "Viña Rock", city: "Villarrobledo", venue: "Recinto Viña Rock", dates: "30 abr–3 mayo 2026", priceFrom: "5" },
  "o-son-do-camino": { name: "O Son do Camiño", shortName: "O Son do Camiño", city: "Santiago de Compostela", venue: "Monte do Gozo", dates: "18–20 junio 2026", priceFrom: "8" },
  "cala-mijas": { name: "Cala Mijas Fest", shortName: "Cala Mijas", city: "Mijas", venue: "Cala Mijas", dates: "2–4 octubre 2026", priceFrom: "5" },
  "sonorama-ribera": { name: "Sonorama Ribera", shortName: "Sonorama", city: "Aranda de Duero", venue: "El Ferial", dates: "6–9 agosto 2026", priceFrom: "6" },
  "zevra-festival": { name: "Zevra Festival", shortName: "Zevra", city: "Valencia", venue: "La Marina de Valencia", dates: "Verano 2026", priceFrom: "4" },
  "low-festival": { name: "Low Festival", shortName: "Low Festival", city: "Benidorm", venue: "Benidorm Beach", dates: "24–26 julio 2026", priceFrom: "5" },
  "tomavistas": { name: "Tomavistas", shortName: "Tomavistas", city: "Madrid", venue: "IFEMA", dates: "15–17 mayo 2026", priceFrom: "4" },
  "cruilla": { name: "Cruïlla Barcelona", shortName: "Cruïlla", city: "Barcelona", venue: "Parc del Fòrum", dates: "9–12 julio 2026", priceFrom: "5" },
};

// ── City pages ─────────────────────────────────────────────────────────────────
const CITIES: Record<string, { name: string; region: string }> = {
  madrid: { name: "Madrid", region: "Comunidad de Madrid" },
  barcelona: { name: "Barcelona", region: "Cataluña" },
  valencia: { name: "Valencia", region: "Comunidad Valenciana" },
  sevilla: { name: "Sevilla", region: "Andalucía" },
  bilbao: { name: "Bilbao", region: "País Vasco" },
  malaga: { name: "Málaga", region: "Andalucía" },
  zaragoza: { name: "Zaragoza", region: "Aragón" },
  granada: { name: "Granada", region: "Andalucía" },
  donostia: { name: "Donostia / San Sebastián", region: "País Vasco" },
  "santiago-de-compostela": { name: "Santiago de Compostela", region: "Galicia" },
};

function resolveMeta(pathname: string): RouteMeta | null {
  // Exact static match
  const exact = STATIC_ROUTES[pathname] ?? STATIC_ROUTES[pathname.replace(/\/$/, "")] ?? null;
  if (exact) return exact;

  // /festivales/:slug
  const festMatch = pathname.match(/^\/festivales\/([^/]+)\/?$/);
  if (festMatch) {
    const slug = festMatch[1] ?? "";
    const f = FESTIVALS[slug];
    if (!f) return null;
    return {
      title: `Carpooling ${f.shortName} ${f.dates.match(/\d{4}$/)?.[0] ?? "2026"} — Comparte coche a ${f.name} | ${SITE_NAME}`,
      description: `Carpooling a ${f.name} (${f.venue}, ${f.city}) ${f.dates}. Viajes compartidos desde toda España desde ${f.priceFrom} €/asiento. Sin taxi, sin comisión. Conductores verificados.`,
      canonical: `${BASE}/festivales/${slug}`,
    };
  }

  // /conciertos/:city
  const cityMatch = pathname.match(/^\/conciertos\/([^/]+)\/?$/);
  if (cityMatch) {
    const slug = cityMatch[1] ?? "";
    const c = CITIES[slug];
    if (!c) return null;
    return {
      title: `Conciertos en ${c.name} 2026 — Carpooling sin comisiones | ${SITE_NAME}`,
      description: `Carpooling a conciertos y festivales en ${c.name} (${c.region}). Encuentra o publica un viaje compartido gratis. Sin comisiones, conductores verificados.`,
      canonical: `${BASE}/conciertos/${slug}`,
    };
  }

  return null;
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function injectMeta(html: string, meta: RouteMeta): string {
  const title = escape(meta.title);
  const desc = escape(meta.description);
  const canonical = escape(meta.canonical);
  const img = escape(meta.ogImage ?? DEFAULT_IMG);
  const siteName = escape(SITE_NAME);

  // Build the replacement block — identical structure to what useSeoMeta sets client-side
  const metaBlock = [
    `<title>${title}</title>`,
    `<meta name="description" content="${desc}"/>`,
    `<link rel="canonical" href="${canonical}"/>`,
    `<link rel="alternate" hreflang="es-ES" href="${canonical}"/>`,
    `<link rel="alternate" hreflang="x-default" href="${canonical}"/>`,
    `<meta property="og:type" content="website"/>`,
    `<meta property="og:site_name" content="${siteName}"/>`,
    `<meta property="og:locale" content="es_ES"/>`,
    `<meta property="og:url" content="${canonical}"/>`,
    `<meta property="og:title" content="${title}"/>`,
    `<meta property="og:description" content="${desc}"/>`,
    `<meta property="og:image" content="${img}"/>`,
    `<meta property="og:image:secure_url" content="${img}"/>`,
    `<meta property="og:image:width" content="1200"/>`,
    `<meta property="og:image:height" content="630"/>`,
    `<meta property="og:image:type" content="image/png"/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:site" content="@concertride_es"/>`,
    `<meta name="twitter:title" content="${title}"/>`,
    `<meta name="twitter:description" content="${desc}"/>`,
    `<meta name="twitter:image" content="${img}"/>`,
  ].join("\n    ");

  // Replace the static title + canonical block with per-route values.
  // The index.html has a <title> tag we can use as the injection anchor.
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta\s+name="description"[^>]*>/, `<meta name="description" content="${desc}"/>`)
    .replace(/<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}"/>`)
    .replace(/<link\s+rel="alternate"\s+hreflang="es-ES"[^>]*>/, `<link rel="alternate" hreflang="es-ES" href="${canonical}"/>`)
    .replace(/<link\s+rel="alternate"\s+hreflang="x-default"[^>]*>/, `<link rel="alternate" hreflang="x-default" href="${canonical}"/>`)
    .replace(/<meta\s+property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}"/>`)
    .replace(/<meta\s+property="og:title"[^>]*>/, `<meta property="og:title" content="${title}"/>`)
    .replace(/<meta\s+property="og:description"[^>]*>/, `<meta property="og:description" content="${desc}"/>`)
    .replace(/<meta\s+name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}"/>`)
    .replace(/<meta\s+name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${desc}"/>`)
    .replace(/<meta\s+property="og:image"[^>]*>/, `<meta property="og:image" content="${img}"/>`)
    .replace(/<meta\s+property="og:image:secure_url"[^>]*>/, `<meta property="og:image:secure_url" content="${img}"/>`);
}

export async function seoPrerender(c: Context<HonoEnv>, next: Next): Promise<Response | void> {
  // Only intercept GET requests to non-API, non-asset paths
  if (
    c.req.method !== "GET" ||
    c.req.path.startsWith("/api/") ||
    c.req.path.startsWith("/.well-known/") ||
    c.req.path.match(/\.[a-z0-9]{1,6}$/i) // static files (.js, .css, .png, etc.)
  ) {
    return next();
  }

  const ua = c.req.header("User-Agent") ?? "";
  if (!SEARCH_BOTS.test(ua)) {
    return next();
  }

  const meta = resolveMeta(c.req.path);
  if (!meta) {
    return next();
  }

  // Fetch the SPA shell from ASSETS
  const assetRes = await c.env.ASSETS.fetch(
    new Request(`${BASE}/`, { headers: c.req.raw.headers }),
  );
  if (!assetRes.ok || !assetRes.headers.get("content-type")?.includes("text/html")) {
    return next();
  }

  const html = await assetRes.text();
  const rewritten = injectMeta(html, meta);

  return new Response(rewritten, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Vary": "User-Agent",
      "X-SEO-Prerender": "1",
    },
  });
}

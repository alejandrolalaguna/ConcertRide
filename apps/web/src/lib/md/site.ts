// Markdown-for-agents — shared constants.
//
// Consumed by three runtimes, so this module must stay import-light (only
// brandEntity, which has no imports of its own):
//   · prerender.mjs (via the SSR bundle) — writes the markdown packs, llms.txt,
//     llms-full.txt, ai.txt and the catalog into dist/ at build time.
//   · the Worker (apps/api/src/lib/markdownServe.ts) — serves them.
//   · vitest.
//
// Keep in sync with: apps/web/public/robots.txt (crawler policy) and the
// generated /llms.txt + /ai.txt (both built from this file).

import { BRAND } from "../brandEntity";

export const MD_SITE = {
  name: BRAND.displayName,
  alternateName: BRAND.alternateName,
  url: BRAND.url,
  email: "help@concertride.me",
  language: BRAND.language,
  areaServed: "España",
  foundingDate: BRAND.foundingDate,
  shortDescription: BRAND.shortDescription,
  longDescription: BRAND.longDescription,
  wikidata: "https://www.wikidata.org/wiki/Q130455178",
  sameAs: [
    "https://www.wikidata.org/wiki/Q130455178",
    "https://twitter.com/concertride_es",
    "https://www.instagram.com/concertride_es/",
    "https://www.facebook.com/concertride.me",
    "https://www.linkedin.com/company/concertride-es",
  ],
} as const;

/**
 * Paths disallowed for EVERY user agent in robots.txt, mirrored in the
 * `## Scope Limitations` section of /ai.txt. `md/robots.test.ts` fails when
 * apps/web/public/robots.txt drifts from this list.
 */
export const ROBOTS_DISALLOW: ReadonlyArray<string> = [
  "/api/",
  "/_",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/profile",
  "/mis-viajes",
  "/favoritos",
  "/admin",
  "/widget/",
  "/crew",
  "/squads",
  "/mensajes",
];

/** Allow exceptions carved out of ROBOTS_DISALLOW (longest match wins). */
export const ROBOTS_ALLOW: ReadonlyArray<string> = ["/", "/.well-known/", "/api/sitemap-", "/api/md/"];

/**
 * Markdown bodies are stored in `dist/_md/p/<n>.json` packs, bucketed by an
 * FNV-1a hash of the page path. ONE file per page would add ~8.900 entries to
 * the Workers Free 20.000-file manifest (CLAUDE.md §PELIGRO); packs add
 * 1.024 (~85 KiB each, so the one JSON.parse per request stays well under
 * 1 ms). Changing this value only requires a rebuild (writer and reader share it).
 */
export const MD_PACK_COUNT = 1024;
export const MD_ASSET_DIR = "/_md";
export const MD_CATALOG_ASSET = `${MD_ASSET_DIR}/catalog.json`;

export function mdPackIndex(path: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < path.length; i++) {
    h ^= path.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) % MD_PACK_COUNT;
}

export function mdPackAsset(path: string): string {
  return `${MD_ASSET_DIR}/p/${mdPackIndex(path)}.json`;
}

/** `/faq` → `/faq.md`, `/` → `/index.md`. */
export function toMdPath(path: string): string {
  return path === "/" || path === "" ? "/index.md" : `${path}.md`;
}

/** `/faq.md` → `/faq`, `/index.md` → `/`. Returns null when not a `.md` path. */
export function fromMdPath(path: string): string | null {
  if (!path.endsWith(".md")) return null;
  const base = path.slice(0, -3);
  if (base === "/index" || base === "") return "/";
  return base;
}

/**
 * `<meta name="ai-summary">`: 1–2 factual sentences for a model that has
 * already fetched the page. Defaults to the meta description; hub pages get
 * their own because their description is written for the SERP, not for
 * explaining what the page contains. No counts here (they would go stale).
 */
const AI_SUMMARY_OVERRIDES: Record<string, string> = {
  "/": "Portada de ConcertRide, servicio español de carpooling para ir a conciertos y festivales: el conductor fija el precio por asiento para cubrir gastos, sin comisión de plataforma, y se paga en efectivo o Bizum. Enlaza a la agenda de conciertos, los festivales y las rutas.",
  "/festivales": "Índice de los festivales de música en España que cubre ConcertRide, con fechas, recinto y opciones de transporte; cada ficha enlaza a sus rutas de carpooling desde distintas ciudades.",
  "/rutas": "Índice de rutas de carpooling origen→festival de ConcertRide, con distancia, tiempo de conducción y rango de precio por asiento de cada ruta.",
  "/blog": "Índice del blog de ConcertRide: guías de transporte a festivales, comparativas de opciones de viaje y novedades del servicio.",
  "/concerts": "Agenda de conciertos en España (datos de Ticketmaster) con los viajes compartidos publicados en ConcertRide para cada evento.",
  "/faq": "Preguntas frecuentes sobre ConcertRide: cómo funciona el carpooling para conciertos, precios, seguridad, marco legal, sostenibilidad y datos abiertos.",
  "/datos": "Índice de los datasets abiertos (CC BY 4.0) de ConcertRide sobre transporte a festivales en España, descargables en CSV y JSON.",
};

export function aiSummaryFor(path: string, description: string): string {
  return AI_SUMMARY_OVERRIDES[path] ?? description;
}

/** Value of the site-wide `Link` header advertising the agent-facing files. */
export const AGENT_FILES_LINK_HEADER =
  '</llms.txt>; rel="describedby"; type="text/plain", ' +
  '</llms-full.txt>; rel="describedby"; type="text/plain", ' +
  '</ai.txt>; rel="describedby"; type="text/plain"';

/** One page as stored in a pack: [markdown, lastmod YYYY-MM-DD]. */
export type MdPackEntry = [markdown: string, lastmod: string];
export type MdPack = Record<string, MdPackEntry>;

export interface MdCatalogEntry {
  /** Canonical HTML path, e.g. `/festivales/mad-cool`. */
  path: string;
  title: string;
  description: string;
  section: string;
  lastmod: string;
  tokens: number;
}

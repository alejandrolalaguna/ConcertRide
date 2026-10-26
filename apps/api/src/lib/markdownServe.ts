// Markdown for agents — request handling (SKILL gsc-indexing §AM).
//
// Three ways in, one handler:
//   GET /faq.md, /index.md                 → mode "suffix"
//   GET /faq  + Accept: text/markdown      → mode "negotiated" (q-value aware)
//   GET /api/md/faq, /api/md/_catalog      → mode "api"
//
// Nothing is rendered here. The markdown is produced at BUILD time from each
// page's SSR <main> (apps/web/scripts/markdown-artifacts.mjs) and stored in
// hash-bucketed packs under dist/_md/p/. Per request the Worker only fetches
// one pack (~50–150 KB) from the asset binding, memoised per isolate — that
// keeps us inside the Workers Free 10 ms CPU budget (index.ts §AJ). The one
// exception is /concerts/:id, whose ids live in Turso.
//
// SEO invariants:
//   · every markdown response is `X-Robots-Tag: noindex, follow`; the HTML
//     page stays the only indexable URL. No `Link: rel=canonical` header on
//     top of the noindex (the repo rule is never noindex + canonical, SKILL
//     §AD); `Content-Location` and the in-body `Canonical:` line point agents
//     at the HTML URL instead.
//   · `.md` URLs are never in a sitemap and never Disallowed in robots.txt
//     (Google must be able to read the noindex, SKILL §AF).
//   · negotiated responses are `private` + `Vary: Accept`, so no shared cache
//     can ever hand markdown to a browser or to Googlebot on the HTML URL.

import type { Context } from "hono";
import type { HonoEnv } from "../types";
import { getSiteUrl } from "./siteUrl";
import { resolveMdRoute } from "../../../web/src/lib/md/registry";
import {
  MD_CATALOG_ASSET,
  mdPackAsset,
  toMdPath,
  type MdPack,
} from "../../../web/src/lib/md/site";

export type MarkdownMode = "suffix" | "negotiated" | "api";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Accept",
  "Access-Control-Expose-Headers": "X-Markdown-Tokens, Content-Location, Last-Modified",
};
const CACHE_PUBLIC = "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400";
const CACHE_NEGOTIATED = "private, max-age=300";
const CACHE_CONCERT = "public, max-age=300, s-maxage=900, stale-while-revalidate=3600";

// ── Pack cache (per isolate) ────────────────────────────────────────────────
const MAX_CACHED_PACKS = 24;
const packCache = new Map<string, Promise<MdPack | null>>();

async function loadJsonAsset<T>(c: Context<HonoEnv>, assetPath: string): Promise<T | null> {
  const res = await c.env.ASSETS.fetch(new Request(new URL(assetPath, c.req.url)));
  // not_found_handling=single-page-application answers misses with the HTML
  // shell and a 200, so the content type is the only reliable miss signal.
  if (!res.ok || !(res.headers.get("content-type") ?? "").includes("json")) return null;
  return (await res.json()) as T;
}

function loadPack(c: Context<HonoEnv>, path: string): Promise<MdPack | null> {
  const asset = mdPackAsset(path);
  let p = packCache.get(asset);
  if (!p) {
    p = loadJsonAsset<MdPack>(c, asset).catch(() => null);
    packCache.set(asset, p);
    if (packCache.size > MAX_CACHED_PACKS) packCache.delete(packCache.keys().next().value as string);
    p.then((v) => { if (!v) packCache.delete(asset); });
  }
  return p;
}

// ── Responses ───────────────────────────────────────────────────────────────
interface MdMeta {
  status: number;
  canonical?: string;
  lastmod?: string;
  cacheControl: string;
  negotiated: boolean;
}

function markdownResponse(c: Context<HonoEnv>, body: string, meta: MdMeta): Response {
  const headers: Record<string, string> = {
    ...CORS,
    "Content-Type": "text/markdown; charset=utf-8",
    "X-Markdown-Tokens": String(Math.ceil(body.length / 4)),
    "X-Robots-Tag": "noindex, follow",
    "Cache-Control": meta.cacheControl,
  };
  if (meta.canonical) headers["Content-Location"] = meta.canonical;
  if (meta.lastmod) {
    const d = new Date(`${meta.lastmod}T00:00:00Z`);
    if (!Number.isNaN(d.getTime())) headers["Last-Modified"] = d.toUTCString();
  }
  if (meta.negotiated) headers["Vary"] = "Accept";
  return new Response(c.req.method === "HEAD" ? null : body, { status: meta.status, headers });
}

function notFound(c: Context<HonoEnv>, path: string, mode: MarkdownMode): Response {
  const base = getSiteUrl(c.env);
  const body = [
    "# 404 — Página no encontrada",
    "",
    `> No hay versión Markdown de \`${path}\`.`,
    "",
    `- [Portada](${base}/index.md)`,
    `- [Mapa del sitio para IA (llms.txt)](${base}/llms.txt)`,
    `- [Catálogo de páginas en Markdown](${base}/api/md/_catalog)`,
    "",
  ].join("\n");
  return markdownResponse(c, body, {
    status: 404,
    cacheControl: "public, max-age=300",
    negotiated: mode === "negotiated",
  });
}

export function markdownPreflight(): Response {
  return new Response(null, { status: 204, headers: { ...CORS, "Access-Control-Max-Age": "86400" } });
}

// ── Entry point ─────────────────────────────────────────────────────────────

/**
 * Serves the markdown version of `path` (an HTML path, no `.md`). In
 * "negotiated" mode returns null when there is no markdown version, so the
 * caller falls through to the normal HTML response instead of a 404.
 */
export async function serveMarkdown(
  c: Context<HonoEnv>,
  path: string,
  mode: MarkdownMode,
): Promise<Response | null> {
  const base = getSiteUrl(c.env);

  if (mode === "api" && path === "/_catalog") {
    const res = await c.env.ASSETS.fetch(new Request(new URL(MD_CATALOG_ASSET, c.req.url)));
    if (!res.ok || !(res.headers.get("content-type") ?? "").includes("json")) return notFound(c, path, mode);
    return new Response(c.req.method === "HEAD" ? null : res.body, {
      status: 200,
      headers: {
        ...CORS,
        "Content-Type": "application/json; charset=utf-8",
        "X-Robots-Tag": "noindex, follow",
        "Cache-Control": CACHE_PUBLIC,
      },
    });
  }

  const route = resolveMdRoute(path);
  if (!route) return mode === "negotiated" ? null : notFound(c, path, mode);

  if (route.source === "concert-db") {
    const id = path.slice("/concerts/".length);
    const md = await renderConcert(c, id, base);
    if (!md) return mode === "negotiated" ? null : notFound(c, path, mode);
    return markdownResponse(c, md, {
      status: 200,
      canonical: `${base}${path}`,
      lastmod: new Date().toISOString().slice(0, 10),
      cacheControl: mode === "negotiated" ? CACHE_NEGOTIATED : CACHE_CONCERT,
      negotiated: mode === "negotiated",
    });
  }

  const entry = (await loadPack(c, path))?.[path];
  if (!entry) return mode === "negotiated" ? null : notFound(c, path, mode);
  const [markdown, lastmod] = entry;
  return markdownResponse(c, markdown, {
    status: 200,
    canonical: path === "/" ? `${base}/` : `${base}${path}`,
    lastmod,
    cacheControl: mode === "negotiated" ? CACHE_NEGOTIATED : CACHE_PUBLIC,
    negotiated: mode === "negotiated",
  });
}

// ── /concerts/:id (Turso) ───────────────────────────────────────────────────
// Same facts as the bot HTML in seoPrerender.ts `resolveConcertPage` plus the
// Ticketmaster link-back required by CLAUDE.md (TM rule 4). Event images are
// never referenced (TM rule 1).

async function renderConcert(c: Context<HonoEnv>, id: string, base: string): Promise<string | null> {
  if (!id || id.includes("/")) return null;
  const { getStore } = await import("../store/factory");
  const store = await getStore(c.env);
  const concert = await store.getConcert(id).catch(() => null);
  if (!concert) return null;
  const artist = concert.artist?.trim();
  const venue = concert.venue?.name?.trim();
  const city = concert.venue?.city?.trim();
  const date = concert.date?.trim();
  if (!artist || !venue || !city || !date) return null;

  const when = new Date(date);
  const dateStr = when.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" });
  const past = when.getTime() < Date.now() - 24 * 3600 * 1000;
  const citySlug = city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const canonical = `${base}/concerts/${id}`;
  const esc = (s: string) => s.replace(/\|/g, "\\|");

  const lines = [
    `# Viajes compartidos a ${artist} en ${city}`,
    "",
    `> Viaje compartido para ir al concierto de ${artist} en ${venue} (${city}). Encuentra o publica un viaje. Sin comisión, conductores verificados.`,
    "",
    `Canonical: ${canonical}`,
    `Last updated: ${new Date().toISOString().slice(0, 10)}`,
    "",
    "## Datos del concierto",
    "",
    "| Campo | Valor |",
    "| --- | --- |",
    `| Artista | ${esc(artist)} |`,
    `| Recinto | ${esc(venue)} |`,
    `| Ciudad | ${esc(city)} |`,
    `| Fecha | ${dateStr} |`,
    `| Viajes publicados en ConcertRide | ${concert.active_rides_count ?? 0} |`,
    ...(past ? ["", "Este concierto ya se ha celebrado."] : []),
    "",
    `## Llegar a ${venue}`,
    "",
    `El recinto está en ${city}. Si vienes desde una ciudad próxima, busca un viaje compartido ya publicado o publica el tuyo para que otros asistentes a ${artist} compartan gastos contigo. Precio orientativo desde 3 €/asiento para trayectos urbanos y entre 8–25 €/asiento para rutas interurbanas, según distancia y combustible repartido. Sin comisión de plataforma; el pago es en efectivo o Bizum al conductor.`,
    "",
  ];
  const tickets = [
    concert.ticketmaster_url ? `- [Comprar en Ticketmaster](${concert.ticketmaster_url})` : null,
    concert.official_url ? `- [Web oficial del evento](${concert.official_url})` : null,
  ].filter(Boolean);
  if (tickets.length) lines.push("## Entradas", "", ...(tickets as string[]), "");
  lines.push(
    "## Related",
    "",
    `- [Conciertos en ${city}](${base}/conciertos/${citySlug})`,
    `- [Todos los conciertos](${base}/concerts)`,
    `- [Cómo funciona ConcertRide](${base}/como-funciona)`,
    "",
    "_Datos del evento: Ticketmaster Discovery API v2._",
    "",
  );
  return lines.join("\n");
}

/** `toMdPath` re-export so index.ts needs a single import for redirects. */
export { toMdPath };

#!/usr/bin/env node
// Prerender — generates static HTML for SEO-critical routes after the
// regular Vite client build. Reads the built dist/index.html as the shell,
// runs the SSR bundle for each URL, and injects:
//   - <title> + meta description / OG / Twitter / canonical
//   - JSON-LD scripts that the page emitted via renderToString
//   - the rendered HTML into <div id="root">
//
// Falls back gracefully: any route that throws is skipped (the SPA shell
// still serves it via `not_found_handling: single-page-application`).

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const distDir = path.join(webRoot, "dist");
const ssrDir = path.join(webRoot, "dist-ssr");

// Public site origin baked into the generated HTML — must match VITE_SITE_URL
// used at build time so canonicals/og:url/sitemap entries all agree.
const SITE_URL = (process.env.VITE_SITE_URL ?? "https://concertride.me").replace(/\/+$/, "");

// ── Load SSR bundle ─────────────────────────────────────────────────────────
const ssrEntry = path.join(ssrDir, "entry-server.js");
if (!(await exists(ssrEntry))) {
  console.error(`[prerender] SSR bundle missing at ${ssrEntry}. Did the SSR build run?`);
  process.exit(1);
}
const { render, FESTIVAL_SLUGS, CITY_SLUGS, CITY_YEAR_SLUGS, BLOG_SLUGS, ROUTE_SLUGS, ARTIST_SLUGS, VENUE_SLUGS, REGION_SLUGS, HOW_TO_GET_THERE_PAGE_SLUGS, GENRE_SLUGS, CALENDAR_SLUGS, CONTENT_LAST_UPDATED, DISABLED_BLOG_SLUGS } = await import(pathToFileURL(ssrEntry).href);

// Defense-in-depth: even if the SSR bundle is stale, never let a disabled slug
// leak into prerender output or sitemaps. CLAUDE.md "Brand Restrictions".
const DISABLED_SLUG_SET = new Set(DISABLED_BLOG_SLUGS ?? []);
const isDisabledBlogSlug = (slug) => DISABLED_SLUG_SET.has(slug);

// ── Read shell ──────────────────────────────────────────────────────────────
const shellPath = path.join(distDir, "index.html");
const shell = await fs.readFile(shellPath, "utf8");

// ── Routes to prerender ─────────────────────────────────────────────────────
const STATIC_ROUTES = [
  "/",
  "/concerts",
  "/festivales",
  "/guia-transporte-festivales",
  "/guia/festival-sin-coche",
  "/guia/presupuesto-festival-grupo",
  "/guia/festival-sostenible-co2",
  "/guia/seguridad-carpooling-festival",
  "/guia/festival-primera-vez",
  "/guia/carpooling-conductor-festival",
  "/guia/festival-internacional-espana",
  "/guia/festival-accesibilidad-movilidad-reducida",
  "/guia/acampada-festival-libre-vs-oficial-2026",
  "/guia/festival-veterano-aficionados-mayores-2026",
  "/guia-ir-festivales-2026",
  "/blog",
  "/rutas",
  "/como-funciona-carpooling",
  // NOTE: legacy comparison route intentionally EXCLUDED — Worker 301-redirects
  // it to /blog/alternativa-carpooling-festivales-espana. Page component removed.
  // See CLAUDE.md "Brand Restrictions". Never re-add.
  "/comparativa/carpooling-vs-taxi-festival",
  "/alternativas-carpooling-festivales",
  "/mejor-carpooling-festivales-2026",
  "/viaje-compartido",
  "/compartir-coche-festival",
  "/ir-juntos-al-festival",
  "/coche-compartido-conciertos",
  "/compartir-gastos-festival",
  "/viaje-en-grupo-festival",
  "/hacer-pina-festival",
  "/prensa",
  "/sala-de-prensa",
  "/datos",
  "/datos/precio-medio-carpooling-vs-bus-festivales-2026",
  "/datos/festivales-peor-conexion-transporte-publico-2026",
  "/datos/festivales-mas-caros-mas-baratos-llegar-2026",
  "/datos/calendario-maestro-festivales-2026",
  "/datos/costes-ocultos-transporte-festivales-2026",
  "/datos/conciertos-mayor-demanda-transporte-2026",
  "/datos/alojamiento-cercano-festivales-2026",
  "/datos/cancelaciones-festivales-espana-2020-2026",
  "/datos/heatmap-demanda-festivales-ccaa-2026",
  "/como-funciona",
  "/faq",
  "/contacto",
  "/acerca-de",
  "/glosario",
  "/autor/alejandro-lalaguna",
  "/aviso-legal",
  "/privacidad",
  "/cookies",
  "/terminos",
];

const BLOG_POST_SLUGS = (BLOG_SLUGS ?? []).filter((slug) => !isDisabledBlogSlug(slug));
const BLOG_POST_SLUGS_DROPPED = (BLOG_SLUGS ?? []).filter((slug) => isDisabledBlogSlug(slug));
if (BLOG_POST_SLUGS_DROPPED.length > 0) {
  console.warn(`[prerender] WARNING: SSR bundle still contains ${BLOG_POST_SLUGS_DROPPED.length} disabled blog slug(s): ${BLOG_POST_SLUGS_DROPPED.join(", ")}. Filtered out by defense-in-depth.`);
}
const ROUTE_LANDING_SLUGS = ROUTE_SLUGS ?? [];
const ARTIST_LANDING_SLUGS = ARTIST_SLUGS ?? [];
const VENUE_LANDING_SLUGS = VENUE_SLUGS ?? [];
const REGION_LANDING_SLUGS = REGION_SLUGS ?? [];
const HOW_TO_GET_THERE_SLUGS = HOW_TO_GET_THERE_PAGE_SLUGS ?? [];
const CITY_YEAR_LANDING_SLUGS = CITY_YEAR_SLUGS ?? [];
const GENRE_LANDING_SLUGS = GENRE_SLUGS ?? [];
const CALENDAR_LANDING_SLUGS = CALENDAR_SLUGS ?? [];

const ROUTES = [
  ...STATIC_ROUTES,
  ...FESTIVAL_SLUGS.map((slug) => `/festivales/${slug}`),
  ...FESTIVAL_SLUGS.map((slug) => `/festivales/${slug}/guia`),
  ...CITY_SLUGS.map((slug) => `/conciertos/${slug}`),
  ...CITY_YEAR_LANDING_SLUGS.map((slug) => `/conciertos/${slug}`),
  ...BLOG_POST_SLUGS.map((slug) => `/blog/${slug}`),
  ...ROUTE_LANDING_SLUGS.map((slug) => `/rutas/${slug}`),
  ...ARTIST_LANDING_SLUGS.map((slug) => `/artistas/${slug}`),
  ...VENUE_LANDING_SLUGS.map((slug) => `/recintos/${slug}`),
  ...REGION_LANDING_SLUGS.map((slug) => `/festivales-en/${slug}`),
  ...HOW_TO_GET_THERE_SLUGS.map((slug) => `/como-llegar/${slug}`),
  ...GENRE_LANDING_SLUGS.map((slug) => `/festivales-genero/${slug}`),
  ...CALENDAR_LANDING_SLUGS.map((slug) => `/calendario-festivales/${slug}`),
];

console.log(`[prerender] ${ROUTES.length} routes (${FESTIVAL_SLUGS.length} festivals + ${FESTIVAL_SLUGS.length} guias, ${CITY_SLUGS.length} cities, ${CITY_YEAR_LANDING_SLUGS.length} city-year, ${BLOG_POST_SLUGS.length} blog posts, ${ROUTE_LANDING_SLUGS.length} routes, ${ARTIST_LANDING_SLUGS.length} artists, ${VENUE_LANDING_SLUGS.length} venues, ${REGION_LANDING_SLUGS.length} regions, ${HOW_TO_GET_THERE_SLUGS.length} how-to-get-there, ${GENRE_LANDING_SLUGS.length} genres, ${CALENDAR_LANDING_SLUGS.length} calendar)`);

let ok = 0;
let failed = 0;
const succeeded = [];

for (const url of ROUTES) {
  try {
    const { html, seo } = render(url);
    const out = injectIntoShell(shell, html, seo, url);
    const outPath = url === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, url.replace(/^\/+/, ""), "index.html");
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, out, "utf8");
    succeeded.push(url);
    ok++;
  } catch (err) {
    failed++;
    console.warn(`[prerender] FAIL ${url}: ${err?.message ?? err}`);
  }
}

console.log(`[prerender] done — ${ok} ok, ${failed} failed`);

// ── Sitemap ─────────────────────────────────────────────────────────────────
// Write multiple structured sitemaps (grouped) and sitemap index
await writeSeparateSitemaps(succeeded);
await writeSitemapIndex();

// ── Helpers ─────────────────────────────────────────────────────────────────
function injectIntoShell(shellHtml, bodyHtml, seo, url) {
  let out = shellHtml;

  if (seo) {
    // Replace <title>
    out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeText(seo.fullTitle)}</title>`);

    // Patch description
    out = out.replace(
      /<meta\s+name="description"[^>]*>/i,
      `<meta name="description" content="${escapeAttr(seo.description)}" />`,
    );

    // Patch canonical + alternates.
    // Google's guideline: never combine `noindex` + `canonical`. The noindex
    // wins and the canonical wastes crawl budget. When the page is noindex
    // we WIPE the shell's defaults (which point at "/") instead of patching.
    if (seo.noindex) {
      out = out.replace(/<link rel="canonical"[^>]*>\s*\n?/, "");
      out = out.replace(/<link rel="alternate" hreflang="es-ES"[^>]*>\s*\n?/, "");
      out = out.replace(/<link rel="alternate" hreflang="x-default"[^>]*>\s*\n?/, "");
    } else if (seo.canonical) {
      out = out.replace(
        /<link rel="canonical"[^>]*>/,
        `<link rel="canonical" href="${escapeAttr(seo.canonical)}" />`,
      );
      out = out.replace(
        /<link rel="alternate" hreflang="es-ES"[^>]*>/,
        `<link rel="alternate" hreflang="es-ES" href="${escapeAttr(seo.canonical)}" />`,
      );
      out = out.replace(
        /<link rel="alternate" hreflang="x-default"[^>]*>/,
        `<link rel="alternate" hreflang="x-default" href="${escapeAttr(seo.canonical)}" />`,
      );
    }

    // OG / Twitter — patch the obvious ones, otherwise append
    const ogUrl = seo.canonical ?? `${SITE_URL}${url}`;
    out = patchMeta(out, "og:url", ogUrl, true);
    out = patchMeta(out, "og:title", seo.ogTitle, true);
    out = patchMeta(out, "og:description", seo.ogDescription, true);
    out = patchMeta(out, "og:type", seo.ogType, true);
    if (seo.ogImage) {
      out = patchMeta(out, "og:image", seo.ogImage, true);
      out = patchMeta(out, "og:image:secure_url", seo.ogImage, true);
    }
    out = patchMeta(out, "twitter:title", seo.ogTitle, false);
    out = patchMeta(out, "twitter:description", seo.ogDescription, false);
    if (seo.ogImage) out = patchMeta(out, "twitter:image", seo.ogImage, false);

    // Keywords
    if (seo.keywords) {
      out = patchMeta(out, "keywords", seo.keywords, false);
    }

    // Robots
    out = patchMeta(
      out,
      "robots",
      seo.noindex
        ? seo.noindexFollow
          ? "noindex, follow"
          : "noindex, nofollow"
        : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      false,
    );

    // Geo meta tags — dynamic per page (overrides the hardcoded Madrid values in index.html)
    if (seo.geoRegion) {
      out = patchMeta(out, "geo.region", seo.geoRegion, false);
    }
    if (seo.geoPlacename) {
      out = patchMeta(out, "geo.placename", seo.geoPlacename, false);
    }
    if (seo.geoLat != null && seo.geoLng != null) {
      out = patchMeta(out, "geo.position", `${seo.geoLat};${seo.geoLng}`, false);
      out = patchMeta(out, "ICBM", `${seo.geoLat}, ${seo.geoLng}`, false);
    }
  }

  // Inject the rendered body. The shell uses <div id="root"></div>.
  out = out.replace(
    /<div id="root">[^]*?<\/div>/,
    `<div id="root">${bodyHtml}</div>`,
  );

  return out;
}

function patchMeta(html, name, content, isProperty) {
  const attr = isProperty ? "property" : "name";
  const re = new RegExp(`<meta\\s+${attr}="${escapeRegex(name)}"[^>]*>`, "i");
  const replacement = `<meta ${attr}="${name}" content="${escapeAttr(content)}" />`;
  if (re.test(html)) return html.replace(re, replacement);
  // Append before </head>
  return html.replace("</head>", `    ${replacement}\n  </head>`);
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escapeText(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function writeSitemapIndex() {
  const today = new Date().toISOString().slice(0, 10);
  // Sitemap filenames standardized to Spanish (matches site locale & internal links).
  // Note: legacy aliases (sitemap-festivals/cities/routes.xml) are NOT generated anymore —
  // if external services (GSC, search engines) still reference them, re-add via redirects.
  const staticSitemaps = [
    "sitemap-static.xml",
    "sitemap-festivales.xml",
    "sitemap-ciudades.xml",
    "sitemap-rutas.xml",
    "sitemap-blog.xml",
    "sitemap-how-to-get-there.xml",
    "sitemap-artistas.xml",
    "sitemap-recintos.xml",
    "sitemap-regiones.xml",
    "sitemap-generos.xml",
    "sitemap-calendario.xml",
    "sitemap-static-others.xml",
  ];
  const entries = staticSitemaps
    .map((f) => `  <sitemap>\n    <loc>${SITE_URL}/${f}</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
  <sitemap>
    <loc>${SITE_URL}/api/sitemap-concerts.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;
  await fs.writeFile(path.join(distDir, "sitemap.xml"), xml, "utf8");
  console.log(`[prerender] sitemap.xml updated — ${staticSitemaps.length + 1} sitemaps (${staticSitemaps.length} static + dynamic concerts)`);
}

async function writeSitemap(urls) {
  const today = new Date().toISOString().slice(0, 10);
  const contentDate = CONTENT_LAST_UPDATED ?? today;
  const LASTMOD = (u) => {
    if (u === "/" || u === "/concerts") return today;
    if (u.startsWith("/festivales/") || u.startsWith("/conciertos/") || u.startsWith("/rutas/") ||
        u.startsWith("/artistas/") || u.startsWith("/recintos/") || u.startsWith("/festivales-en/") ||
        u.startsWith("/festivales-genero/") || u.startsWith("/calendario-festivales/") ||
        u.startsWith("/blog/") || u.startsWith("/como-llegar/")) return contentDate;
    return today;
  };
  const PRIORITY = (u) => {
    if (u === "/") return "1.0";
    if (u === "/concerts" || u === "/festivales" || u === "/guia-transporte-festivales" || u === "/rutas") return "0.9";
    if (u === "/guia-ir-festivales-2026") return "0.92";
    if (u.startsWith("/festivales/")) return "0.85";
    if (u.match(/^\/conciertos\/[^/]+\/\d{4}$/)) return "0.78";
    if (u.startsWith("/conciertos/")) return "0.8";
    if (u === "/blog") return "0.8";
    if (u.startsWith("/blog/")) return "0.75";
    if (u.startsWith("/rutas/")) return "0.7";
    if (u.startsWith("/artistas/")) return "0.75";
    if (u.startsWith("/recintos/")) return "0.7";
    if (u.startsWith("/festivales-en/")) return "0.75";
    if (u.startsWith("/festivales-genero/")) return "0.78";
    if (u.startsWith("/calendario-festivales/")) return "0.78";
    if (u.startsWith("/como-llegar/")) return "0.85";
    if (["/como-funciona", "/faq"].includes(u)) return "0.7";
    if (u === "/como-funciona-carpooling") return "0.75";
    if (u === "/mejor-carpooling-festivales-2026") return "0.85";
    if (u === "/viaje-compartido") return "0.8";
    if (u === "/compartir-coche-festival") return "0.78";
    if (u === "/ir-juntos-al-festival") return "0.78";
    if (u === "/coche-compartido-conciertos") return "0.8";
    if (u === "/compartir-gastos-festival") return "0.78";
    if (u === "/viaje-en-grupo-festival") return "0.78";
    if (u === "/hacer-pina-festival") return "0.75";
    if (u.startsWith("/comparativa/")) return "0.72";
    if (["/acerca-de", "/contacto", "/prensa"].includes(u)) return "0.6";
    if (u === "/datos") return "0.7";
    if (u.startsWith("/datos/")) return "0.8";
    return "0.3";
  };
  const FREQ = (u) => {
    if (u === "/" || u === "/concerts") return "daily";
    if (u.match(/^\/conciertos\/[^/]+\/\d{4}$/)) return "monthly";
    if (u.startsWith("/festivales") || u.startsWith("/conciertos/")) return "weekly";
    if (u === "/blog" || u === "/rutas") return "weekly";
    if (u.startsWith("/blog/")) return "monthly";
    if (u.startsWith("/rutas/")) return "monthly";
    if (u.startsWith("/artistas/")) return "weekly";
    if (u.startsWith("/recintos/")) return "monthly";
    if (u.startsWith("/festivales-en/")) return "monthly";
    if (u.startsWith("/festivales-genero/")) return "monthly";
    if (u.startsWith("/calendario-festivales/")) return "monthly";
    if (u.startsWith("/como-llegar/")) return "weekly";
    return "monthly";
  };
  const FESTIVAL_OG_SLUG = (u) => {
    const m = u.match(/^\/festivales\/(.+)$/);
    return m ? m[1] : null;
  };
  const entries = urls.map((u) => {
    const festSlug = FESTIVAL_OG_SLUG(u);
    const imageBlock = festSlug
      ? `\n    <image:image>\n      <image:loc>${SITE_URL}/og/${festSlug}.png</image:loc>\n      <image:title>Carpooling a ${festSlug.replace(/-/g, " ")} — ConcertRide</image:title>\n    </image:image>`
      : "";
    return `  <url>
    <loc>${SITE_URL}${u === "/" ? "/" : u}</loc>
    <lastmod>${LASTMOD(u)}</lastmod>
    <changefreq>${FREQ(u)}</changefreq>
    <priority>${PRIORITY(u)}</priority>${imageBlock}
  </url>`;
  }).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries}
</urlset>
`;
  await fs.writeFile(path.join(distDir, "sitemap-static.xml"), xml, "utf8");
  console.log(`[prerender] sitemap-static.xml — ${urls.length} URLs`);
}

// Split static URLs into separate sitemaps for better crawl prioritization
async function writeSeparateSitemaps(urls) {
  const today = new Date().toISOString().slice(0, 10);
  const contentDate = CONTENT_LAST_UPDATED ?? today;

  const INDEXED_PREFIXES = ["/festivales/", "/conciertos/", "/rutas/", "/como-llegar/", "/blog/",
    "/festivales-genero/", "/calendario-festivales/", "/artistas/", "/recintos/", "/festivales-en/"];
  // /conciertos/:city/:year — past (2025) and future (2027) variants are
  // canonical-consolidated to the parent /conciertos/:city. Excluded from
  // sitemap (only current year 2026 is kept) so we don't signal duplicates
  // to Google. Internal links still make them discoverable.
  const isPastOrFutureYearCity = (u) => /^\/conciertos\/[^/]+\/(2025|2027)$/.test(u);
  const groups = {
    festivals: urls.filter((u) => u.startsWith("/festivales/") && !u.startsWith("/festivales-genero/") && !u.startsWith("/festivales-en/")),
    cities: urls.filter((u) => u.startsWith("/conciertos/") && !isPastOrFutureYearCity(u)),
    routes: urls.filter((u) => u.startsWith("/rutas/")),
    howto: urls.filter((u) => u.startsWith("/como-llegar/")),
    blog: urls.filter((u) => u.startsWith("/blog/")),
    genres: urls.filter((u) => u.startsWith("/festivales-genero/")),
    calendar: urls.filter((u) => u.startsWith("/calendario-festivales/")),
    artists: urls.filter((u) => u.startsWith("/artistas/")),
    venues: urls.filter((u) => u.startsWith("/recintos/")),
    regions: urls.filter((u) => u.startsWith("/festivales-en/")),
    others: urls.filter((u) => !INDEXED_PREFIXES.some((p) => u.startsWith(p))),
  };

  const write = async (filename, list, freq = "weekly", priority = "0.7") => {
    const entries = list.map((u) => `  <url>\n    <loc>${SITE_URL}${u}</loc>\n    <lastmod>${contentDate}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`).join("\n");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
    await fs.writeFile(path.join(distDir, filename), xml, "utf8");
    console.log(`[prerender] wrote ${filename} — ${list.length} URLs`);
  };

  await write("sitemap-festivales.xml", groups.festivals, "weekly", "0.85");
  await write("sitemap-ciudades.xml", groups.cities, "weekly", "0.8");
  await write("sitemap-rutas.xml", groups.routes, "monthly", "0.7");
  await write("sitemap-how-to-get-there.xml", groups.howto, "weekly", "0.85");
  await write("sitemap-blog.xml", groups.blog, "monthly", "0.75");
  await write("sitemap-generos.xml", groups.genres, "monthly", "0.78");
  await write("sitemap-calendario.xml", groups.calendar, "monthly", "0.78");
  await write("sitemap-artistas.xml", groups.artists, "monthly", "0.75");
  await write("sitemap-recintos.xml", groups.venues, "monthly", "0.72");
  await write("sitemap-regiones.xml", groups.regions, "monthly", "0.75");
  await write("sitemap-static-others.xml", groups.others, "monthly", "0.6");
}

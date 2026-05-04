#!/usr/bin/env node
/**
 * SCRIPT 4: generate-sitemaps.mjs
 *
 * Genera sitemaps divididos por tipo de contenido:
 *   - sitemap-festivales.xml   (/festivales/{slug})
 *   - sitemap-conciertos.xml   (/conciertos/{slug})
 *   - sitemap-rutas.xml        (/rutas/{slug})
 *   - sitemap-como-llegar.xml  (/como-llegar/{slug})
 *   - sitemap-blog.xml         (/blog/{slug})
 *   - sitemap-index.xml        (índice que apunta a todos)
 *
 * EJECUTAR: node apps/web/scripts/seo/generate-sitemaps.mjs
 *
 * OUTPUT:
 *   - output/sitemap-festivales.xml
 *   - output/sitemap-conciertos.xml
 *   - output/sitemap-rutas.xml
 *   - output/sitemap-como-llegar.xml
 *   - output/sitemap-blog.xml
 *   - output/sitemap-index-split.xml
 *   - output/sitemap-stats.json
 *
 * INTEGRACIÓN (opcional):
 *   Copiar los archivos XML generados a apps/web/public/ y actualizar
 *   sitemap.xml (índice) para referenciarlos en lugar del sitemap-static.xml monolítico.
 *
 * VENTAJAS DE SITEMAPS DIVIDIDOS:
 *   - Google puede rastrear cada tipo de contenido por separado
 *   - Más fácil detectar qué secciones tienen problemas de indexación
 *   - Sitemap de conciertos puede ser dinámico (Worker) sin contaminar el estático
 *   - Límite de 50.000 URLs por sitemap — preparado para escalar
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "output");
const SITE_URL = "https://concertride.me";
const TODAY = new Date().toISOString().slice(0, 10);

// ── Datos de contenido (espejo de las lib/**.ts) ──────────────────────────────

const FESTIVAL_SLUGS = [
  "mad-cool", "primavera-sound", "sonar", "fib", "bbk-live", "resurrection-fest",
  "arenal-sound", "medusa-festival", "vina-rock", "o-son-do-camino", "cala-mijas",
  "sonorama-ribera", "zevra-festival", "low-festival", "tomavistas", "cruilla",
];

const FESTIVAL_OG_IMAGES = new Set([
  "mad-cool", "primavera-sound", "sonar", "fib", "bbk-live", "resurrection-fest",
  "arenal-sound", "medusa-festival", "vina-rock", "o-son-do-camino", "cala-mijas",
  "sonorama-ribera", "cruilla", "low-festival",
]);

const CITY_SLUGS = [
  "madrid", "barcelona", "valencia", "sevilla", "bilbao", "malaga", "zaragoza",
  "granada", "donostia", "santiago-de-compostela", "alicante", "pamplona",
  "vitoria-gasteiz", "a-coruna", "vigo", "murcia", "valladolid",
];

const HOW_TO_GET_THERE_SLUGS = [
  "arenal-sound", "vina-rock", "mad-cool", "bbk-live", "primavera-sound",
  "sonar", "resurrection-fest", "cala-mijas", "o-son-do-camino",
  "low-festival", "medusa-festival", "cruilla", "sonorama-ribera",
  "zevra-festival", "fib",
];

const BLOG_SLUGS = [
  "autobuses-festivales-espana-2026",
  "blablacar-vs-concertride",
  "carpooling-vs-taxi-festival-espana",
  "coldplay-madrid-barcelona-2026-como-llegar",
  "como-llegar-resurrection-fest-2026",
  "como-volver-festival-madrugada",
  "festivales-cataluna-2026",
  "festivales-comunidad-valenciana-2026",
  "festivales-musica-espana-2026",
  "festivales-pais-vasco-2026",
  "festivales-verano-espana-2026-transporte",
  "guia-transporte-vina-rock-2026",
  "huella-carbono-festivales-carpooling",
  "que-llevar-al-festival",
];

// Rutas de alta prioridad ya definidas (subset — el resto también se incluye)
// Para el sitemap completo de rutas se usa la lógica del script generate-routes.mjs
const ROUTE_SLUGS_SAMPLE = [
  "madrid-mad-cool", "barcelona-mad-cool", "valencia-mad-cool", "zaragoza-mad-cool",
  "madrid-primavera-sound", "madrid-sonar", "madrid-bbk-live", "donostia-bbk-live", "santander-bbk-live", "vitoria-gasteiz-bbk-live",
  "madrid-arenal-sound", "valencia-arenal-sound", "barcelona-arenal-sound", "zaragoza-arenal-sound", "alicante-arenal-sound",
  "madrid-vina-rock", "valencia-vina-rock", "alicante-vina-rock", "albacete-vina-rock", "sevilla-vina-rock",
  "madrid-resurrection-fest", "a-coruna-resurrection-fest", "vigo-resurrection-fest", "bilbao-resurrection-fest",
  "malaga-cala-mijas", "madrid-cala-mijas",
  "madrid-fib", "barcelona-fib", "valencia-fib",
  "madrid-o-son-do-camino",
];

// Prioridades y frecuencias por tipo
const SEO_CONFIG = {
  festivales:   { priority: "0.85", changefreq: "weekly"  },
  conciertos:   { priority: "0.80", changefreq: "weekly"  },
  "como-llegar":{ priority: "0.85", changefreq: "weekly"  },
  rutas:        { priority: "0.72", changefreq: "weekly"  },
  blog:         { priority: "0.75", changefreq: "monthly" },
};

// Blog posts con alta prioridad temática
const BLOG_PRIORITY_OVERRIDES = {
  "autobuses-festivales-espana-2026": "0.85",
  "guia-transporte-vina-rock-2026":   "0.85",
  "como-llegar-resurrection-fest-2026": "0.85",
  "festivales-musica-espana-2026":    "0.80",
};

// ── Generador de XML ──────────────────────────────────────────────────────────

function urlEntry({ loc, lastmod = TODAY, changefreq, priority, imageUrl, imageTitle }) {
  const image = imageUrl ? `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>${escapeXml(imageTitle ?? "")}</image:title>
    </image:image>` : "";
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${image}
  </url>`;
}

function sitemapWrapper(type, urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- Sitemap generado por generate-sitemaps.mjs -->
  <!-- Tipo: ${type} | Última actualización: ${TODAY} | ${urls.split("<url>").length - 1} URLs -->
${urls}
</urlset>`;
}

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function sitemapIndex(sitemaps) {
  const entries = sitemaps.map(s => `
  <sitemap>
    <loc>${SITE_URL}/${s.file}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Índice de sitemaps divididos — generado por generate-sitemaps.mjs -->
  <!-- Para activar: reemplazar apps/web/public/sitemap.xml con este contenido -->
${entries}
</sitemapindex>`;
}

// ── Construir cada sitemap ────────────────────────────────────────────────────

function buildFestivalesSitemap() {
  const config = SEO_CONFIG.festivales;
  const urls = FESTIVAL_SLUGS.map(slug => {
    const hasOg = FESTIVAL_OG_IMAGES.has(slug);
    return urlEntry({
      loc: `${SITE_URL}/festivales/${slug}`,
      changefreq: config.changefreq,
      priority: config.priority,
      imageUrl: hasOg ? `${SITE_URL}/og/${slug}.png` : undefined,
      imageTitle: hasOg ? `Carpooling a ${slug.replace(/-/g, " ")} — ConcertRide` : undefined,
    });
  }).join("");
  return sitemapWrapper("festivales", urls);
}

function buildConciertosSitemap() {
  const config = SEO_CONFIG.conciertos;
  const urls = CITY_SLUGS.map(slug => urlEntry({
    loc: `${SITE_URL}/conciertos/${slug}`,
    changefreq: config.changefreq,
    priority: config.priority,
  })).join("");
  return sitemapWrapper("conciertos", urls);
}

function buildComoLlegarSitemap() {
  const config = SEO_CONFIG["como-llegar"];
  const urls = HOW_TO_GET_THERE_SLUGS.map(slug => urlEntry({
    loc: `${SITE_URL}/como-llegar/${slug}`,
    changefreq: config.changefreq,
    priority: config.priority,
  })).join("");
  return sitemapWrapper("como-llegar", urls);
}

function buildRutasSitemap() {
  const config = SEO_CONFIG.rutas;
  const urls = ROUTE_SLUGS_SAMPLE.map(slug => urlEntry({
    loc: `${SITE_URL}/rutas/${slug}`,
    changefreq: config.changefreq,
    priority: config.priority,
  })).join("");
  return sitemapWrapper("rutas (sample — ampliar con todos los slugs de routeLandings.ts)", urls);
}

function buildBlogSitemap() {
  const config = SEO_CONFIG.blog;
  const urls = BLOG_SLUGS.map(slug => urlEntry({
    loc: `${SITE_URL}/blog/${slug}`,
    changefreq: config.changefreq,
    priority: BLOG_PRIORITY_OVERRIDES[slug] ?? config.priority,
  })).join("");
  return sitemapWrapper("blog", urls);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const sitemaps = [
    { file: "sitemap-festivales.xml",   content: buildFestivalesSitemap(),  count: FESTIVAL_SLUGS.length },
    { file: "sitemap-conciertos.xml",   content: buildConciertosSitemap(),  count: CITY_SLUGS.length },
    { file: "sitemap-como-llegar.xml",  content: buildComoLlegarSitemap(),  count: HOW_TO_GET_THERE_SLUGS.length },
    { file: "sitemap-rutas.xml",        content: buildRutasSitemap(),       count: ROUTE_SLUGS_SAMPLE.length },
    { file: "sitemap-blog.xml",         content: buildBlogSitemap(),        count: BLOG_SLUGS.length },
  ];

  for (const s of sitemaps) {
    await fs.writeFile(path.join(outputDir, s.file), s.content, "utf8");
  }

  // Índice final (el que iría en sitemap.xml de producción)
  const index = sitemapIndex([
    ...sitemaps.map(s => ({ file: s.file })),
    { file: "api/sitemap-concerts.xml" }, // dinámico del Worker
  ]);
  await fs.writeFile(path.join(outputDir, "sitemap-index-split.xml"), index, "utf8");

  // Estadísticas
  const stats = {
    generated: TODAY,
    totalUrls: sitemaps.reduce((acc, s) => acc + s.count, 0),
    breakdown: Object.fromEntries(sitemaps.map(s => [s.file, s.count])),
    note: "sitemap-rutas.xml es un sample. Para sitemap completo ejecutar generate-routes.mjs primero.",
  };
  await fs.writeFile(path.join(outputDir, "sitemap-stats.json"), JSON.stringify(stats, null, 2), "utf8");

  console.log("\n╔═══════════════════════════════════════════════════════╗");
  console.log("║  generate-sitemaps.mjs — RESULTADOS                  ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");
  console.log(`✅ ${sitemaps.length} sitemaps generados + 1 índice`);
  sitemaps.forEach(s => console.log(`   ${s.file.padEnd(30)} ${s.count} URLs`));
  console.log(`   ${"TOTAL".padEnd(30)} ${stats.totalUrls} URLs (+ conciertos dinámicos)`);
  console.log();
  console.log("📁 Archivos generados en output/:");
  sitemaps.forEach(s => console.log(`   ${s.file}`));
  console.log("   sitemap-index-split.xml");
  console.log("   sitemap-stats.json\n");
  console.log("🔌 INTEGRACIÓN (pasos para activar sitemaps divididos):");
  console.log("   1. Copiar los XML generados a apps/web/public/");
  console.log("   2. Reemplazar apps/web/public/sitemap.xml con output/sitemap-index-split.xml");
  console.log("   3. Actualizar _headers para cachear los nuevos sitemaps individualmente:");
  console.log("      /sitemap-festivales.xml");
  console.log("        Cache-Control: public, max-age=86400");
  console.log("   4. Verificar en GSC que Google ve el índice de sitemaps correctamente\n");
  console.log("⚠️  NOTA: sitemap-rutas.xml es un sample de 30 rutas.");
  console.log("   Para incluir las ~96 rutas completas, ejecutar primero:");
  console.log("   node generate-routes.mjs");
  console.log("   Y usar el output/routes-sitemap.xml resultante.\n");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

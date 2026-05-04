#!/usr/bin/env node
/**
 * SCRIPT 2: generate-routes.mjs
 *
 * Genera el dataset completo de páginas /rutas/{origen}-{festival}
 * expandido con lógica SEO avanzada: detección de rutas sin override,
 * títulos optimizados para CTR, keywords específicas por par ciudad-festival,
 * y audit de cobertura actual.
 *
 * EJECUTAR: node apps/web/scripts/seo/generate-routes.mjs
 *
 * OUTPUT:
 *   - apps/web/scripts/seo/output/routes-full.json      (dataset completo 96+ rutas)
 *   - apps/web/scripts/seo/output/routes-missing-seo.json (rutas sin override SEO)
 *   - apps/web/scripts/seo/output/routes-sitemap.xml    (sitemap parcial de /rutas/)
 *   - apps/web/scripts/seo/output/seoOverrides-routes-patch.ts (código listo para pegar)
 *
 * IMPORTANTE: Este script NO modifica ficheros existentes.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "output");
const SITE_URL = "https://concertride.me";

// ── Datos espejados de festivalLandings.ts ────────────────────────────────────
// Actualizar si se añaden festivales nuevos

const FESTIVALS = [
  { slug: "mad-cool",          shortName: "Mad Cool",          city: "Madrid",                    lat: 40.464,  lng: -3.610 },
  { slug: "primavera-sound",   shortName: "Primavera Sound",   city: "Barcelona",                 lat: 41.407,  lng:  2.222 },
  { slug: "sonar",             shortName: "Sónar",             city: "Barcelona",                 lat: 41.356,  lng:  2.130 },
  { slug: "fib",               shortName: "FIB",               city: "Benicàssim",                lat: 40.059,  lng:  0.061 },
  { slug: "bbk-live",          shortName: "BBK Live",          city: "Bilbao",                    lat: 43.272,  lng: -2.949 },
  { slug: "resurrection-fest", shortName: "Resurrection Fest", city: "Viveiro",                   lat: 43.666,  lng: -7.599 },
  { slug: "arenal-sound",      shortName: "Arenal Sound",      city: "Burriana",                  lat: 39.881,  lng: -0.078 },
  { slug: "medusa-festival",   shortName: "Medusa Festival",   city: "Cullera",                   lat: 39.197,  lng: -0.248 },
  { slug: "vina-rock",         shortName: "Viña Rock",         city: "Villarrobledo",             lat: 39.264,  lng: -2.602 },
  { slug: "o-son-do-camino",   shortName: "O Son do Camiño",   city: "Santiago de Compostela",    lat: 42.878,  lng: -8.545 },
  { slug: "cala-mijas",        shortName: "Cala Mijas",        city: "Mijas",                     lat: 36.606,  lng: -4.640 },
  { slug: "sonorama-ribera",   shortName: "Sonorama Ribera",   city: "Aranda de Duero",           lat: 41.671,  lng: -3.690 },
  { slug: "zevra-festival",    shortName: "Zevra Festival",    city: "Valencia",                  lat: 39.470,  lng: -0.376 },
  { slug: "low-festival",      shortName: "Low Festival",      city: "Benidorm",                  lat: 38.541,  lng: -0.131 },
  { slug: "tomavistas",        shortName: "Tomavistas",        city: "Madrid",                    lat: 40.417,  lng: -3.704 },
  { slug: "cruilla",           shortName: "Cruïlla",           city: "Barcelona",                 lat: 41.407,  lng:  2.222 },
];

// Par ciudad→ festival extraído de festivalLandings.originCities
// Generado: cityName → citySlug (normalizado ASCII)
const ORIGIN_CITIES_BY_FESTIVAL = {
  "mad-cool":          [{ city: "Madrid", km: 15, time: "25 min", price: "4–7 €" }, { city: "Toledo", km: 75, time: "55 min", price: "4–7 €" }, { city: "Guadalajara", km: 60, time: "50 min", price: "3–6 €" }, { city: "Segovia", km: 90, time: "1h 10 min", price: "4–7 €" }, { city: "Valencia", km: 355, time: "3h 20 min", price: "10–14 €" }, { city: "Zaragoza", km: 325, time: "3h", price: "9–13 €" }, { city: "Barcelona", km: 620, time: "5h 30 min", price: "15–20 €" }],
  "primavera-sound":   [{ city: "Madrid", km: 620, time: "5h 30 min", price: "15–20 €" }, { city: "Valencia", km: 355, time: "3h 15 min", price: "10–14 €" }, { city: "Zaragoza", km: 306, time: "2h 45 min", price: "8–12 €" }, { city: "Bilbao", km: 615, time: "5h", price: "15–20 €" }, { city: "Lleida", km: 170, time: "1h 45 min", price: "5–8 €" }, { city: "Tarragona", km: 100, time: "1h", price: "4–7 €" }],
  "sonar":             [{ city: "Madrid", km: 620, time: "5h 30 min", price: "15–20 €" }, { city: "Valencia", km: 355, time: "3h 15 min", price: "10–14 €" }, { city: "Zaragoza", km: 306, time: "2h 45 min", price: "8–12 €" }, { city: "Girona", km: 100, time: "1h", price: "4–7 €" }, { city: "Tarragona", km: 100, time: "1h", price: "4–7 €" }],
  "fib":               [{ city: "Valencia", km: 70, time: "50 min", price: "3–6 €" }, { city: "Castellón de la Plana", km: 15, time: "20 min", price: "3–5 €" }, { city: "Madrid", km: 465, time: "4h", price: "12–17 €" }, { city: "Barcelona", km: 300, time: "2h 45 min", price: "8–12 €" }, { city: "Alicante", km: 175, time: "1h 45 min", price: "5–8 €" }, { city: "Zaragoza", km: 270, time: "2h 30 min", price: "7–11 €" }],
  "bbk-live":          [{ city: "Bilbao", km: 5, time: "15 min", price: "3–5 €" }, { city: "Donostia", km: 100, time: "1h", price: "4–7 €" }, { city: "Vitoria-Gasteiz", km: 65, time: "45 min", price: "3–6 €" }, { city: "Pamplona", km: 155, time: "1h 30 min", price: "5–8 €" }, { city: "Santander", km: 100, time: "1h", price: "4–7 €" }, { city: "Burgos", km: 155, time: "1h 30 min", price: "5–8 €" }, { city: "Madrid", km: 395, time: "3h 30 min", price: "11–16 €" }],
  "resurrection-fest": [{ city: "A Coruña", km: 100, time: "1h 15 min", price: "4–7 €" }, { city: "Santiago de Compostela", km: 185, time: "2h", price: "6–9 €" }, { city: "Vigo", km: 200, time: "2h 15 min", price: "6–9 €" }, { city: "Oviedo", km: 195, time: "2h", price: "6–9 €" }, { city: "Madrid", km: 600, time: "6h", price: "16–22 €" }, { city: "Bilbao", km: 375, time: "4h", price: "10–15 €" }],
  "arenal-sound":      [{ city: "Valencia", km: 65, time: "45 min", price: "3–6 €" }, { city: "Castellón de la Plana", km: 10, time: "15 min", price: "3–5 €" }, { city: "Burriana", km: 2, time: "5 min", price: "2–4 €" }, { city: "Madrid", km: 460, time: "4h", price: "12–17 €" }, { city: "Barcelona", km: 305, time: "2h 50 min", price: "8–12 €" }, { city: "Zaragoza", km: 275, time: "2h 30 min", price: "8–12 €" }, { city: "Alicante", km: 115, time: "1h 15 min", price: "4–7 €" }],
  "medusa-festival":   [{ city: "Valencia", km: 45, time: "40 min", price: "3–5 €" }, { city: "Alicante", km: 100, time: "1h", price: "4–7 €" }, { city: "Madrid", km: 415, time: "3h 45 min", price: "11–16 €" }, { city: "Barcelona", km: 340, time: "3h 10 min", price: "9–14 €" }, { city: "Murcia", km: 180, time: "1h 45 min", price: "6–9 €" }],
  "vina-rock":         [{ city: "Madrid", km: 190, time: "1h 55 min", price: "6–9 €" }, { city: "Valencia", km: 200, time: "2h", price: "6–9 €" }, { city: "Albacete", km: 50, time: "40 min", price: "3–5 €" }, { city: "Alicante", km: 165, time: "1h 35 min", price: "5–8 €" }, { city: "Murcia", km: 155, time: "1h 30 min", price: "5–8 €" }, { city: "Cuenca", km: 100, time: "1h", price: "4–6 €" }],
  "o-son-do-camino":   [{ city: "A Coruña", km: 70, time: "50 min", price: "3–5 €" }, { city: "Vigo", km: 90, time: "1h", price: "4–6 €" }, { city: "Lugo", km: 100, time: "1h", price: "4–6 €" }, { city: "Madrid", km: 585, time: "5h 30 min", price: "15–20 €" }, { city: "Bilbao", km: 590, time: "5h", price: "15–20 €" }],
  "cala-mijas":        [{ city: "Málaga", km: 30, time: "30 min", price: "3–5 €" }, { city: "Fuengirola", km: 10, time: "15 min", price: "2–4 €" }, { city: "Sevilla", km: 200, time: "2h 30 min", price: "7–10 €" }, { city: "Granada", km: 170, time: "2h", price: "6–9 €" }, { city: "Madrid", km: 560, time: "5h", price: "14–20 €" }, { city: "Córdoba", km: 200, time: "2h", price: "6–10 €" }],
  "sonorama-ribera":   [{ city: "Madrid", km: 160, time: "1h 45 min", price: "5–8 €" }, { city: "Burgos", km: 80, time: "50 min", price: "4–6 €" }, { city: "Valladolid", km: 100, time: "1h", price: "4–7 €" }, { city: "Zaragoza", km: 250, time: "2h 30 min", price: "7–11 €" }, { city: "Bilbao", km: 250, time: "2h 30 min", price: "7–11 €" }],
  "zevra-festival":    [{ city: "Madrid", km: 350, time: "3h 30 min", price: "10–14 €" }, { city: "Barcelona", km: 340, time: "3h", price: "10–14 €" }, { city: "Alicante", km: 165, time: "1h 40 min", price: "5–9 €" }, { city: "Murcia", km: 250, time: "2h 30 min", price: "7–11 €" }],
  "low-festival":      [{ city: "Alicante", km: 45, time: "35 min", price: "3–6 €" }, { city: "Valencia", km: 100, time: "1h", price: "5–8 €" }, { city: "Murcia", km: 120, time: "1h 15 min", price: "5–8 €" }, { city: "Madrid", km: 420, time: "3h 45 min", price: "12–18 €" }, { city: "Barcelona", km: 470, time: "4h 30 min", price: "13–19 €" }],
  "tomavistas":        [{ city: "Madrid", km: 10, time: "20 min", price: "3–6 €" }, { city: "Toledo", km: 75, time: "55 min", price: "4–7 €" }, { city: "Guadalajara", km: 60, time: "50 min", price: "3–6 €" }, { city: "Valencia", km: 355, time: "3h 20 min", price: "10–14 €" }, { city: "Zaragoza", km: 325, time: "3h", price: "9–13 €" }],
  "cruilla":           [{ city: "Madrid", km: 620, time: "5h 30 min", price: "15–20 €" }, { city: "Valencia", km: 355, time: "3h 15 min", price: "10–14 €" }, { city: "Zaragoza", km: 306, time: "2h 45 min", price: "8–12 €" }, { city: "Tarragona", km: 100, time: "1h", price: "4–7 €" }, { city: "Lleida", km: 170, time: "1h 45 min", price: "5–8 €" }, { city: "Girona", km: 100, time: "1h", price: "4–7 €" }],
};

// Overrides ya existentes en seoOverrides.ts (para detectar gaps)
const EXISTING_OVERRIDES = new Set([
  "madrid-arenal-sound", "madrid-bbk-live", "madrid-primavera-sound",
  "barcelona-mad-cool", "valencia-arenal-sound", "madrid-vina-rock",
  "valencia-vina-rock", "alicante-vina-rock", "albacete-vina-rock",
  "sevilla-vina-rock", "barcelona-arenal-sound", "zaragoza-arenal-sound",
  "alicante-arenal-sound", "donostia-bbk-live", "santander-bbk-live",
  "vitoria-gasteiz-bbk-live", "pamplona-bbk-live", "madrid-resurrection-fest",
  "a-coruna-resurrection-fest", "vigo-resurrection-fest", "bilbao-resurrection-fest",
  "madrid-sonar", "barcelona-fib", "valencia-fib", "madrid-fib",
  "malaga-cala-mijas", "madrid-cala-mijas", "madrid-o-son-do-camino",
  "valencia-mad-cool", "zaragoza-mad-cool",
]);

// ── Helpers ──────────────────────────────────────────────────────────────────

function cityToSlug(city) {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function priceMin(range) {
  const m = range.match(/(\d+)/);
  return m ? m[1] : "5";
}

function generateRouteTitle(originCity, festival, km, price) {
  const min = priceMin(price);
  const year = new Date().getFullYear();
  return `Carpooling ${originCity} → ${festival.shortName} ${year}: desde ${min}€ | ${km} km | ConcertRide`;
}

function generateRouteDescription(originCity, festival, km, time, price) {
  return `Carpooling de ${originCity} a ${festival.shortName} (${festival.city}): ${km} km en ${time}. Desde ${price}/asiento. Sin comisión de plataforma. Conductores verificados. Pago en efectivo o Bizum.`;
}

function generateRouteKeywords(originCity, festival) {
  const year = new Date().getFullYear();
  const fn = festival.shortName;
  const fc = festival.city;
  return [
    `carpooling ${originCity.toLowerCase()} ${fn.toLowerCase()}`,
    `viaje compartido ${originCity.toLowerCase()} ${fn.toLowerCase()}`,
    `coche compartido ${originCity.toLowerCase()} ${fn.toLowerCase()}`,
    `como ir ${fn.toLowerCase()} desde ${originCity.toLowerCase()}`,
    `transporte ${originCity.toLowerCase()} ${fn.toLowerCase()}`,
    `bus ${originCity.toLowerCase()} ${fn.toLowerCase()}`,
    `${originCity.toLowerCase()} ${fn.toLowerCase()} ${year}`,
    `distancia ${originCity.toLowerCase()} ${fc.toLowerCase()}`,
    `precio carpooling ${originCity.toLowerCase()} ${fn.toLowerCase()}`,
  ].join(", ");
}

// ── Construcción del dataset ─────────────────────────────────────────────────

function buildRoutes() {
  const routes = [];
  for (const festival of FESTIVALS) {
    const origins = ORIGIN_CITIES_BY_FESTIVAL[festival.slug] ?? [];
    for (const origin of origins) {
      const originSlug = cityToSlug(origin.city);
      const routeSlug = `${originSlug}-${festival.slug}`;
      routes.push({
        slug: routeSlug,
        route: `/rutas/${routeSlug}`,
        originCity: origin.city,
        originCitySlug: originSlug,
        festivalSlug: festival.slug,
        festivalName: festival.shortName,
        festivalCity: festival.city,
        km: origin.km,
        drivingTime: origin.time,
        priceRange: origin.price,
        title: generateRouteTitle(origin.city, festival, origin.km, origin.price),
        description: generateRouteDescription(origin.city, festival, origin.km, origin.time, origin.price),
        keywords: generateRouteKeywords(origin.city, festival),
        hasExistingOverride: EXISTING_OVERRIDES.has(routeSlug),
        priority: origin.km < 100 ? "0.80" : origin.km < 300 ? "0.75" : "0.70",
        changefreq: "weekly",
        lastmod: new Date().toISOString().slice(0, 10),
      });
    }
  }
  return routes;
}

// ── Patch para seoOverrides.ts ────────────────────────────────────────────────

function generateSeoOverridesPatch(routes) {
  const missing = routes.filter(r => !r.hasExistingOverride);
  if (missing.length === 0) return "// ✅ Todas las rutas ya tienen override en seoOverrides.ts\n";

  const lines = ["// PATCH para apps/web/src/lib/seoOverrides.ts", "// Añadir estas entradas al objeto ROUTE_SEO_IMPROVEMENTS", ""];
  for (const r of missing) {
    lines.push(`  "${r.slug}": {`);
    lines.push(`    title: \`${r.title.replace(/`/g, "\\`")}\`,`);
    lines.push(`    keywords: \`${r.keywords.replace(/`/g, "\\`")}\`,`);
    lines.push(`  },`);
  }
  return lines.join("\n");
}

// ── Sitemap XML ───────────────────────────────────────────────────────────────

function generateSitemapXml(routes) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes.map(r => `
  <url>
    <loc>${SITE_URL}${r.route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Generado por generate-routes.mjs -->
  <!-- ${routes.length} rutas: /rutas/{origen}-{festival} -->
${urls}
</urlset>`;
}

// ── Instrucciones ─────────────────────────────────────────────────────────────

function printInstructions(routes) {
  const withOverride = routes.filter(r => r.hasExistingOverride);
  const missing = routes.filter(r => !r.hasExistingOverride);

  console.log("\n╔═══════════════════════════════════════════════════════╗");
  console.log("║  generate-routes.mjs — RESULTADOS                    ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");
  console.log(`✅ ${routes.length} rutas totales generadas`);
  console.log(`   Con override SEO existente: ${withOverride.length}`);
  console.log(`   Sin override (gap):         ${missing.length}\n`);

  if (missing.length > 0) {
    console.log(`⚠️  Rutas sin override SEO (CTR subóptimo):`);
    missing.slice(0, 10).forEach(r => console.log(`   - ${r.route} (${r.km} km, ${r.priceRange})`));
    if (missing.length > 10) console.log(`   ... y ${missing.length - 10} más (ver routes-missing-seo.json)`);
    console.log();
  }

  console.log("📁 Archivos generados:");
  console.log("   output/routes-full.json           — dataset completo");
  console.log("   output/routes-missing-seo.json    — rutas sin override");
  console.log("   output/routes-sitemap.xml          — sitemap /rutas/");
  console.log("   output/seoOverrides-routes-patch.ts — código listo para pegar\n");

  console.log("🔌 INTEGRACIÓN (opcional — sistema ya funciona):");
  console.log("   Las rutas /rutas/{slug} ya están implementadas en RouteLandingPage.tsx");
  console.log("   Para añadir overrides SEO a las rutas sin cobertura:");
  console.log("   1. Revisar output/seoOverrides-routes-patch.ts");
  console.log("   2. Pegar las entradas en ROUTE_SEO_IMPROVEMENTS en seoOverrides.ts\n");

  // Análisis por festival
  console.log("📊 Cobertura de overrides por festival:");
  for (const festival of FESTIVALS) {
    const festRoutes = routes.filter(r => r.festivalSlug === festival.slug);
    const covered = festRoutes.filter(r => r.hasExistingOverride).length;
    const bar = "█".repeat(covered) + "░".repeat(festRoutes.length - covered);
    console.log(`   ${festival.shortName.padEnd(20)} ${bar} ${covered}/${festRoutes.length}`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const routes = buildRoutes();
  const missing = routes.filter(r => !r.hasExistingOverride);

  await fs.writeFile(
    path.join(outputDir, "routes-full.json"),
    JSON.stringify(routes, null, 2),
    "utf8",
  );

  await fs.writeFile(
    path.join(outputDir, "routes-missing-seo.json"),
    JSON.stringify(missing, null, 2),
    "utf8",
  );

  await fs.writeFile(
    path.join(outputDir, "routes-sitemap.xml"),
    generateSitemapXml(routes),
    "utf8",
  );

  await fs.writeFile(
    path.join(outputDir, "seoOverrides-routes-patch.ts"),
    generateSeoOverridesPatch(routes),
    "utf8",
  );

  printInstructions(routes);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

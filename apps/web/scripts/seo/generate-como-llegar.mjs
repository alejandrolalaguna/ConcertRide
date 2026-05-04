#!/usr/bin/env node
/**
 * SCRIPT 3: generate-como-llegar.mjs
 *
 * Genera el dataset SEO para páginas /como-llegar/{festival}.
 * Detecta festivales sin página "cómo llegar", genera overrides
 * de meta tags y el contenido estructurado de transporte.
 *
 * Targets queries como:
 *   "como llegar al arenal sound"
 *   "bus viña rock"
 *   "transporte bbk live"
 *   "lanzadera mad cool"
 *
 * EJECUTAR: node apps/web/scripts/seo/generate-como-llegar.mjs
 *
 * OUTPUT:
 *   - output/como-llegar-pages.json       (dataset completo)
 *   - output/como-llegar-sitemap.xml      (entradas de sitemap)
 *   - output/como-llegar-missing.json     (festivales sin página todavía)
 *   - output/HOW_TO_GET_THERE_SEO-patch.ts (código para seoOverrides.ts)
 *
 * IMPORTANTE: Este script NO modifica ficheros existentes.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "output");
const SITE_URL = "https://concertride.me";
const YEAR = new Date().getFullYear();

// ── Festivales disponibles (espejo de festivalLandings.ts) ───────────────────

const FESTIVALS = [
  {
    slug: "mad-cool",          shortName: "Mad Cool",          city: "Madrid",       venue: "IFEMA Madrid",                   lat: 40.464, lng: -3.610,
    transport: { metro: "L8 hasta Feria de Madrid", bus: "N1, N6 nocturno (no IFEMA directo)", shuttle: "No oficial", parking: "IFEMA P1–P4 (12–18€/día)" },
    mainCities: [{ city: "Barcelona", km: 620, price: "15–20€" }, { city: "Valencia", km: 355, price: "10–14€" }, { city: "Zaragoza", km: 325, price: "9–13€" }],
  },
  {
    slug: "primavera-sound",   shortName: "Primavera Sound",   city: "Barcelona",    venue: "Parc del Fòrum",                 lat: 41.407, lng: 2.222,
    transport: { metro: "L4 Besòs Mar (10 min a pie)", bus: "N6, N7 nocturnos", shuttle: "No oficial", parking: "Muy limitado, desaconsejado" },
    mainCities: [{ city: "Madrid", km: 620, price: "15–20€" }, { city: "Valencia", km: 355, price: "10–14€" }, { city: "Zaragoza", km: 306, price: "8–12€" }],
  },
  {
    slug: "sonar",             shortName: "Sónar",             city: "Barcelona",    venue: "Fira Gran Via / Fira Montjuïc",  lat: 41.356, lng: 2.130,
    transport: { metro: "L9 Sur parada Fira (by Night) / L3 Espanya (by Day)", bus: "Shuttle privado desde Plaça Espanya", shuttle: "Pagado ~10€ desde centro BCN", parking: "P1/P2 Fira Gran Via (20–25€/día)" },
    mainCities: [{ city: "Madrid", km: 620, price: "15–20€" }, { city: "Valencia", km: 355, price: "10–14€" }, { city: "Zaragoza", km: 306, price: "8–12€" }],
  },
  {
    slug: "fib",               shortName: "FIB",               city: "Benicàssim",   venue: "Recinto Auditorio del Parque",   lat: 40.059, lng: 0.061,
    transport: { metro: "No hay metro", bus: "Lanzadera desde Castellón estación autobuses (15 km, 15 min, 20–30 min frecuencia)", shuttle: "Oficial desde Castellón (con entrada)", parking: "Zonas habilitadas 5–10€/día" },
    mainCities: [{ city: "Valencia", km: 70, price: "3–6€" }, { city: "Madrid", km: 465, price: "12–17€" }, { city: "Barcelona", km: 300, price: "8–12€" }],
  },
  {
    slug: "bbk-live",          shortName: "BBK Live",          city: "Bilbao",       venue: "Parque de Kobetamendi",          lat: 43.272, lng: -2.949,
    transport: { metro: "No llega directamente a Kobetamendi", bus: "Lanzadera gratuita desde Plaza Moyúa (incluida en entrada)", shuttle: "Oficial gratuito Plaza Moyúa", parking: "Muy limitado — aparcar en Bilbao centro" },
    mainCities: [{ city: "Madrid", km: 395, price: "11–16€" }, { city: "Donostia", km: 100, price: "4–7€" }, { city: "Santander", km: 100, price: "4–7€" }],
  },
  {
    slug: "resurrection-fest", shortName: "Resurrection Fest", city: "Viveiro",      venue: "A Gañidoira",                    lat: 43.666, lng: -7.599,
    transport: { metro: "No hay metro", bus: "ALSA desde A Coruña / Lugo (2–3 frecuencias/día, sin servicio nocturno)", shuttle: "No oficial", parking: "Amplio aparcamiento gratuito" },
    mainCities: [{ city: "A Coruña", km: 100, price: "4–7€" }, { city: "Madrid", km: 600, price: "16–22€" }, { city: "Vigo", km: 200, price: "6–9€" }],
  },
  {
    slug: "arenal-sound",      shortName: "Arenal Sound",      city: "Burriana",     venue: "Playa de Burriana",              lat: 39.881, lng: -0.078,
    transport: { metro: "No hay metro", bus: "Lanzadera desde Castellón estación autobuses (10 km, 20 min) — horarios limitados por la noche", shuttle: "Parcial desde Castellón", parking: "Zonas habilitadas 5–8€/día" },
    mainCities: [{ city: "Valencia", km: 65, price: "3–6€" }, { city: "Madrid", km: 460, price: "12–17€" }, { city: "Barcelona", km: 305, price: "8–12€" }],
  },
  {
    slug: "medusa-festival",   shortName: "Medusa Festival",   city: "Cullera",      venue: "Playa de Cullera",               lat: 39.197, lng: -0.248,
    transport: { metro: "No hay metro", bus: "Autobús Cullera–Valencia (Herca, 1h)", shuttle: "Parcial desde Valencia", parking: "Zonas habilitadas" },
    mainCities: [{ city: "Valencia", km: 45, price: "3–5€" }, { city: "Alicante", km: 100, price: "4–7€" }, { city: "Madrid", km: 415, price: "11–16€" }],
  },
  {
    slug: "vina-rock",         shortName: "Viña Rock",         city: "Villarrobledo",venue: "Parque La Pulgosa",              lat: 39.264, lng: -2.602,
    transport: { metro: "No hay metro", bus: "Bus lanzadera oficial desde Albacete estación (50 km, 40 min, 5–10€ i/v)", shuttle: "Oficial desde Albacete", parking: "Amplio y económico junto al recinto (2–5€/día)" },
    mainCities: [{ city: "Madrid", km: 190, price: "6–9€" }, { city: "Valencia", km: 200, price: "6–9€" }, { city: "Alicante", km: 165, price: "5–8€" }],
  },
  {
    slug: "cala-mijas",        shortName: "Cala Mijas",        city: "Mijas",        venue: "Cortijo de Torres",              lat: 36.606, lng: -4.640,
    transport: { metro: "No hay metro", bus: "Sin lanzadera oficial — taxi desde Fuengirola (10 km, 10 min, 15–20€)", shuttle: "No oficial", parking: "Zonas habilitadas cercanas al Cortijo" },
    mainCities: [{ city: "Málaga", km: 30, price: "3–5€" }, { city: "Sevilla", km: 200, price: "7–10€" }, { city: "Madrid", km: 560, price: "14–20€" }],
  },
  {
    slug: "sonorama-ribera",   shortName: "Sonorama Ribera",   city: "Aranda de Duero", venue: "La Vega (recinto)",           lat: 41.671, lng: -3.690,
    transport: { metro: "No hay metro", bus: "Autobús Bilbao/Madrid–Aranda de Duero (ALSA, 1h 45min desde Madrid)", shuttle: "No oficial", parking: "Zonas cercanas al recinto" },
    mainCities: [{ city: "Madrid", km: 160, price: "5–8€" }, { city: "Burgos", km: 80, price: "4–6€" }, { city: "Valladolid", km: 100, price: "4–7€" }],
  },
  {
    slug: "zevra-festival",    shortName: "Zevra Festival",    city: "Valencia",     venue: "La Marina de Valencia",          lat: 39.470, lng: -0.376,
    transport: { metro: "L4 parada La Marina", bus: "EMT líneas 19 y 95", shuttle: "Metro L4 es el transporte oficial", parking: "Aparcamiento Port de Valencia (10–15€)" },
    mainCities: [{ city: "Madrid", km: 350, price: "10–14€" }, { city: "Barcelona", km: 340, price: "10–14€" }, { city: "Alicante", km: 165, price: "5–9€" }],
  },
  {
    slug: "low-festival",      shortName: "Low Festival",      city: "Benidorm",     venue: "Benidorm Palace / recinto",      lat: 38.541, lng: -0.131,
    transport: { metro: "TRAM L9 Alicante–Benidorm (55 min, €3)", bus: "ALSA Alicante–Benidorm", shuttle: "Parcial según edición", parking: "Zonas habilitadas en Benidorm" },
    mainCities: [{ city: "Alicante", km: 45, price: "3–6€" }, { city: "Valencia", km: 100, price: "5–8€" }, { city: "Madrid", km: 420, price: "12–18€" }],
  },
  {
    slug: "o-son-do-camino",   shortName: "O Son do Camiño",   city: "Santiago de Compostela", venue: "Monte do Gozo",       lat: 42.878, lng: -8.545,
    transport: { metro: "No hay metro", bus: "Autobús urbano Compostela–Monte do Gozo (C5, 20 min)", shuttle: "Autobús municipal incluido con entrada", parking: "Amplio parking gratuito en Monte do Gozo" },
    mainCities: [{ city: "A Coruña", km: 70, price: "3–5€" }, { city: "Vigo", km: 90, price: "4–6€" }, { city: "Madrid", km: 585, price: "15–20€" }],
  },
  {
    slug: "cruilla",           shortName: "Cruïlla",           city: "Barcelona",    venue: "Parc del Fòrum",                 lat: 41.407, lng: 2.222,
    transport: { metro: "L4 Besòs Mar (10 min a pie)", bus: "N6, N7 nocturnos", shuttle: "No oficial", parking: "Muy limitado, desaconsejado" },
    mainCities: [{ city: "Madrid", km: 620, price: "15–20€" }, { city: "Valencia", km: 355, price: "10–14€" }, { city: "Zaragoza", km: 306, price: "8–12€" }],
  },
];

// Festivales que ya tienen página /como-llegar/ activa (howToGetThereSlugs.ts)
const ACTIVE_HOW_TO_SLUGS = new Set([
  "arenal-sound", "vina-rock", "mad-cool", "bbk-live", "primavera-sound",
  "sonar", "resurrection-fest", "cala-mijas", "o-son-do-camino",
  "low-festival", "medusa-festival", "cruilla", "sonorama-ribera",
  "zevra-festival", "fib",
]);

// Overrides de HOW_TO_GET_THERE_SEO ya existentes en seoOverrides.ts
const EXISTING_HOW_TO_SEO = new Set([
  "arenal-sound", "bbk-live", "mad-cool", "primavera-sound", "vina-rock",
  "cala-mijas", "resurrection-fest", "zevra-festival", "sonar", "fib",
  "low-festival", "cruilla", "sonorama-ribera", "o-son-do-camino",
  "medusa-festival",
]);

// ── Generadores de contenido ─────────────────────────────────────────────────

function generateTitle(festival) {
  const transport = festival.transport;
  const hasMetro = transport.metro && !transport.metro.includes("No hay");
  const hasShuttle = transport.shuttle && !transport.shuttle.includes("No oficial");

  if (hasMetro) {
    return `Cómo llegar a ${festival.shortName} ${YEAR}: Metro, bus y carpooling | ${festival.city} | ConcertRide`;
  } else if (hasShuttle) {
    return `Cómo llegar a ${festival.shortName} ${YEAR}: Lanzadera, bus y carpooling | ConcertRide`;
  } else {
    return `Cómo llegar a ${festival.shortName} ${YEAR}: Carpooling y transporte | ${festival.city} | ConcertRide`;
  }
}

function generateDescription(festival) {
  const firstCity = festival.mainCities[0];
  const t = festival.transport;
  const hasMetro = t.metro && !t.metro.includes("No hay");
  const hasShuttle = t.shuttle && !t.shuttle.includes("No oficial");

  let transport_hint = "";
  if (hasMetro) transport_hint = `Metro: ${t.metro}. `;
  else if (hasShuttle) transport_hint = `${t.shuttle}. `;

  return `${festival.shortName} ${YEAR} ${festival.venue}, ${festival.city}: ${transport_hint}Carpooling desde ${firstCity.city} (${firstCity.km} km, ${firstCity.price}/asiento). Sin comisión de plataforma.`;
}

function generateKeywords(festival) {
  const fn = festival.shortName.toLowerCase();
  const fc = festival.city.toLowerCase();
  return [
    `como llegar ${fn} ${YEAR}`,
    `${fn} transporte`,
    `${fn} como llegar`,
    `${fn} bus`,
    `${fn} carpooling`,
    `cómo ir a ${fn}`,
    `${fn} ${fc} como llegar`,
    `transporte ${fn} ${YEAR}`,
    ...festival.mainCities.map(c => `carpooling ${c.city.toLowerCase()} ${fn}`),
  ].join(", ");
}

function generatePageData(festival) {
  const isActive = ACTIVE_HOW_TO_SLUGS.has(festival.slug);
  const hasSeoOverride = EXISTING_HOW_TO_SEO.has(festival.slug);

  return {
    slug: festival.slug,
    route: `/como-llegar/${festival.slug}`,
    festivalCity: festival.city,
    festivalVenue: festival.venue,
    isActivePage: isActive,
    hasSeoOverride,
    // SEO meta
    title: generateTitle(festival),
    description: generateDescription(festival),
    keywords: generateKeywords(festival),
    geoLat: festival.lat,
    geoLng: festival.lng,
    // Transport data
    transport: festival.transport,
    // Main cities for carpooling section
    mainCities: festival.mainCities,
    // Sitemap
    priority: isActive ? "0.85" : "0.70",
    changefreq: "weekly",
    lastmod: new Date().toISOString().slice(0, 10),
  };
}

// ── Patch para seoOverrides.ts ────────────────────────────────────────────────

function generateSeoOverridesPatch(pages) {
  const missing = pages.filter(p => !p.hasSeoOverride);
  if (missing.length === 0) return "// ✅ Todas las páginas /como-llegar/ ya tienen HOW_TO_GET_THERE_SEO override\n";

  const lines = [
    "// PATCH: añadir estas entradas al objeto HOW_TO_GET_THERE_SEO en seoOverrides.ts",
    `// ${missing.length} festivales sin override`,
    "",
  ];
  for (const p of missing) {
    lines.push(`  "${p.slug}": {`);
    lines.push(`    title: \`${p.title.replace(/`/g, "\\`")}\`,`);
    lines.push(`    description: \`${p.description.replace(/`/g, "\\`")}\`,`);
    lines.push(`    keywords: \`${p.keywords.replace(/`/g, "\\`")}\`,`);
    lines.push(`  },`);
  }
  return lines.join("\n");
}

// ── Nuevas páginas pendientes (festivales sin /como-llegar/) ─────────────────

function generateMissingPages(pages) {
  return pages
    .filter(p => !p.isActivePage)
    .map(p => ({
      slug: p.slug,
      route: p.route,
      priority: "Nueva página recomendada",
      reason: `Festival ${p.festivalCity} sin página /como-llegar/ activa`,
      estimatedImpact: "Captura queries 'como llegar [festival]' con 0 clics en GSC",
      steps: [
        `1. Añadir "${p.slug}" a HOW_TO_GET_THERE_SLUGS en howToGetThereSlugs.ts`,
        `2. Añadir override en HOW_TO_GET_THERE_SEO en seoOverrides.ts (ver patch)`,
        `3. Reconstruir y prerender para generar /como-llegar/${p.slug}/index.html`,
      ],
    }));
}

// ── Sitemap ───────────────────────────────────────────────────────────────────

function generateSitemapXml(pages) {
  const active = pages.filter(p => p.isActivePage);
  const today = new Date().toISOString().slice(0, 10);
  const urls = active.map(p => `
  <url>
    <loc>${SITE_URL}${p.route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Generado por generate-como-llegar.mjs -->
  <!-- ${active.length} páginas activas /como-llegar/{festival} -->
${urls}
</urlset>`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const pages = FESTIVALS.map(generatePageData);
  const active = pages.filter(p => p.isActivePage);
  const missing = pages.filter(p => !p.isActivePage);
  const withoutSeoOverride = pages.filter(p => !p.hasSeoOverride);

  await fs.writeFile(path.join(outputDir, "como-llegar-pages.json"), JSON.stringify(pages, null, 2), "utf8");
  await fs.writeFile(path.join(outputDir, "como-llegar-sitemap.xml"), generateSitemapXml(pages), "utf8");
  await fs.writeFile(path.join(outputDir, "como-llegar-missing.json"), JSON.stringify(generateMissingPages(pages), null, 2), "utf8");
  await fs.writeFile(path.join(outputDir, "HOW_TO_GET_THERE_SEO-patch.ts"), generateSeoOverridesPatch(pages), "utf8");

  console.log("\n╔═══════════════════════════════════════════════════════╗");
  console.log("║  generate-como-llegar.mjs — RESULTADOS               ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");
  console.log(`✅ ${pages.length} festivales analizados`);
  console.log(`   Páginas activas (/como-llegar/ generadas):  ${active.length}`);
  console.log(`   Sin página /como-llegar/ todavía:           ${missing.length}`);
  console.log(`   Sin HOW_TO_GET_THERE_SEO override:          ${withoutSeoOverride.length}\n`);

  if (missing.length > 0) {
    console.log("🆕 Festivales sin página /como-llegar/ (oportunidades):");
    missing.forEach(p => console.log(`   ${p.route} (${p.festivalCity})`));
    console.log();
  }

  if (withoutSeoOverride.length > 0) {
    console.log("⚠️  Páginas activas sin override SEO (CTR subóptimo):");
    withoutSeoOverride.filter(p => p.isActivePage).forEach(p => console.log(`   ${p.route}`));
    console.log();
  }

  console.log("📁 Archivos generados:");
  console.log("   output/como-llegar-pages.json         — dataset completo");
  console.log("   output/como-llegar-sitemap.xml         — sitemap /como-llegar/");
  console.log("   output/como-llegar-missing.json        — festivales sin página");
  console.log("   output/HOW_TO_GET_THERE_SEO-patch.ts  — código para seoOverrides.ts\n");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

#!/usr/bin/env node
// Generates the 96-route table for llms-full.txt from the built SSR bundle.
// Reads ROUTE_LANDINGS from dist-ssr/entry-server.js and produces a Markdown
// table block that replaces/appends the ## Tabla de rutas section.
//
// Run AFTER build:ssr (requires dist-ssr/entry-server.js to exist).
// Called automatically from npm run prerender (added to pipeline).

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const ssrDir = path.join(webRoot, "dist-ssr");
const llmsFullPath = path.join(webRoot, "public", "llms-full.txt");

const SITE_URL = (process.env.VITE_SITE_URL ?? "https://concertride.me").replace(/\/+$/, "");

// Load SSR bundle to get ROUTE_LANDINGS
const ssrEntry = path.join(ssrDir, "entry-server.js");
if (!(await exists(ssrEntry))) {
  console.warn("[gen-llms-routes] SSR bundle not found — skipping route table generation.");
  console.warn(`  Expected: ${ssrEntry}`);
  process.exit(0);
}

const { ROUTE_SLUGS } = await import(pathToFileURL(ssrEntry).href);

// We'll rebuild from festivalLandings data since ROUTE_LANDINGS has full detail
// but we can reconstruct from ROUTE_SLUGS + the SSR module
const ssrModule = await import(pathToFileURL(ssrEntry).href);

// Build a route table directly from festival data exposed in the SSR bundle.
// ROUTE_SLUGS = ["madrid-mad-cool", ...] so we can parse origin + festival.
// But better: import FESTIVAL_LANDINGS from the same bundle if exported.
// We'll use a simpler approach: read festivalLandings.ts directly.

const festivalLandingsPath = path.resolve(webRoot, "src/lib/festivalLandings.ts");

// Since we can't import TS directly, read the dist-ssr bundle
// which has the compiled code. We'll parse the route slugs.
// Format: "{originSlug}-{festivalSlug}"
// Festival slugs from the data: mad-cool, primavera-sound, etc.

// The compiled SSR bundle should export FESTIVAL_LANDINGS indirectly.
// Let's check what's exported:
const festivalSlugs = [
  "mad-cool", "primavera-sound", "sonar", "fib", "bbk-live",
  "resurrection-fest", "arenal-sound", "medusa-festival", "vina-rock",
  "o-son-do-camino", "cala-mijas", "sonorama-ribera", "zevra-festival",
  "low-festival", "tomavistas", "cruilla"
];

// Build route info from ROUTE_SLUGS
// We need to know: originCity, festival, km, drivingTime, priceRange
// All this is in the RouteLanding objects.
// Since we can't directly import RouteLanding from entry-server.ts (it re-exports limited things),
// let's read the festivalLandings.ts source and parse it with a simpler approach.

// Actually, FESTIVAL_LANDINGS is transitively part of the SSR bundle.
// The SSR bundle compiles festivalLandings.ts → entry-server.js
// We can try importing it via dynamic path manipulation.

// Simpler: generate the table from the raw data we know:
// We'll read the TS file directly and extract using regex for the route data.

const festivalLandingsSrc = await fs.readFile(festivalLandingsPath, "utf8");

// Parse all origin cities with their data per festival
function parseFestivalOrigins() {
  const routes = [];
  const festivalBlocks = festivalLandingsSrc.split(/(?=\s*\{\s*\n\s*slug:)/);

  for (const block of festivalBlocks) {
    const slugMatch = block.match(/slug:\s*"([^"]+)"/);
    const shortNameMatch = block.match(/shortName:\s*"([^"]+)"/);
    const cityMatch = block.match(/^\s+city:\s*"([^"]+)"/m);

    if (!slugMatch || !shortNameMatch) continue;
    const festSlug = slugMatch[1];
    if (!festivalSlugs.includes(festSlug)) continue;

    const shortName = shortNameMatch[1];
    const festCity = cityMatch?.[1] ?? "";

    // Find all originCities entries
    const originCitiesMatch = block.match(/originCities:\s*\[([\s\S]*?)\],\s*\n\s*faqs:/);
    if (!originCitiesMatch) continue;

    const originsBlock = originCitiesMatch[1];
    const originEntries = originsBlock.matchAll(
      /\{\s*city:\s*"([^"]+)",\s*km:\s*(\d+),\s*drivingTime:\s*"([^"]+)",\s*concertRideRange:\s*"([^"]+)"/g
    );

    for (const m of originEntries) {
      const [, originCity, km, drivingTime, priceRange] = m;
      const originSlug = originCity.toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      routes.push({
        slug: `${originSlug}-${festSlug}`,
        originCity,
        festival: shortName,
        festCity,
        km: parseInt(km),
        drivingTime,
        priceRange,
        url: `${SITE_URL}/rutas/${originSlug}-${festSlug}`,
      });
    }
  }

  return routes;
}

const routes = parseFestivalOrigins();

if (routes.length === 0) {
  console.error("[gen-llms-routes] No routes parsed — check the festivalLandings.ts format.");
  process.exit(1);
}

// Build the Markdown table
const tableHeader = `| Ruta | Festival | Destino | km | Tiempo | Precio/asiento | URL |
|---|---|---|---:|---|---|---|`;

const tableRows = routes
  .sort((a, b) => a.festival.localeCompare(b.festival) || a.originCity.localeCompare(b.originCity))
  .map((r) =>
    `| ${r.originCity} → ${r.festival} | ${r.festival} | ${r.festCity} | ${r.km} | ${r.drivingTime} | ${r.priceRange} | ${r.url} |`
  )
  .join("\n");

const section = `\n---\n\n## Tabla completa de rutas (${routes.length} rutas)\n\nPrecio calculado como coste de combustible + peajes dividido entre los ocupantes, sin comisión de plataforma. Precios en EUR por asiento.\n\n${tableHeader}\n${tableRows}\n`;

// Read current llms-full.txt and replace/append the section
let current = await fs.readFile(llmsFullPath, "utf8");

// Remove existing route table section if present
const sectionStart = current.indexOf("\n---\n\n## Tabla completa de rutas");
if (sectionStart !== -1) {
  // Find next top-level section (## ) after this, or end of file
  const nextSection = current.indexOf("\n---\n", sectionStart + 10);
  if (nextSection !== -1) {
    current = current.slice(0, sectionStart) + current.slice(nextSection);
  } else {
    current = current.slice(0, sectionStart);
  }
}

// Append before any "For AI Systems" section or at end
const forAiIdx = current.indexOf("\n## For AI Systems");
if (forAiIdx !== -1) {
  current = current.slice(0, forAiIdx) + section + current.slice(forAiIdx);
} else {
  current = current.trimEnd() + section;
}

await fs.writeFile(llmsFullPath, current, "utf8");
console.log(`[gen-llms-routes] Updated llms-full.txt with ${routes.length} routes.`);

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

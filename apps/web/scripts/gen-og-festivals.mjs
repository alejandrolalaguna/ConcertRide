#!/usr/bin/env node
// Generates 1200×630 OG images for each festival in festivalLandings.ts.
// Output: apps/web/public/og/{slug}.png
// Uses sharp to composite SVG text layers over a dark background.
// Run: node apps/web/scripts/gen-og-festivals.mjs

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// sharp lives in the root node_modules — use pathToFileURL for Windows compat
const sharpPath = path.resolve(__dirname, "../../../node_modules/sharp/lib/index.js");
const { default: sharp } = await import(pathToFileURL(sharpPath).href);

const ogDir = path.resolve(__dirname, "../public/og");

// ── Festival data (slug, shortName, city, dates) ────────────────────────────
// Mirrored here so the script has zero TS/build dependencies.
const FESTIVALS = [
  { slug: "mad-cool",         name: "MAD COOL",         city: "Madrid",                dates: "9–11 JUL 2026" },
  { slug: "primavera-sound",  name: "PRIMAVERA SOUND",  city: "Barcelona",             dates: "28 MAY–1 JUN 2026" },
  { slug: "sonar",            name: "SÓNAR",            city: "Barcelona",             dates: "18–20 JUN 2026" },
  { slug: "fib",              name: "FIB",              city: "Benicàssim",            dates: "16–19 JUL 2026" },
  { slug: "bbk-live",         name: "BBK LIVE",         city: "Bilbao",                dates: "9–11 JUL 2026" },
  { slug: "resurrection-fest",name: "RESURRECTION FEST",city: "Viveiro",               dates: "2–5 JUL 2026" },
  { slug: "arenal-sound",     name: "ARENAL SOUND",     city: "Burriana",              dates: "30 JUL–3 AGO 2026" },
  { slug: "medusa-festival",  name: "MEDUSA",           city: "Cullera",               dates: "12–16 AGO 2026" },
  { slug: "vina-rock",        name: "VIÑA ROCK",        city: "Villarrobledo",         dates: "28–31 MAY 2026" },
  { slug: "o-son-do-camino",  name: "SON DO CAMIÑO",   city: "Santiago de Compostela",dates: "25–27 JUN 2026" },
  { slug: "cala-mijas",       name: "CALA MIJAS",       city: "Mijas",                 dates: "3–5 OCT 2026" },
  { slug: "sonorama-ribera",  name: "SONORAMA",         city: "Aranda de Duero",       dates: "6–9 AGO 2026" },
  { slug: "zevra-festival",   name: "ZEVRA",            city: "Valencia",              dates: "JUL 2026" },
  { slug: "low-festival",     name: "LOW FESTIVAL",     city: "Benidorm",              dates: "24–26 JUL 2026" },
  { slug: "tomavistas",       name: "TOMAVISTAS",       city: "Madrid",                dates: "MAY–JUN 2026" },
  { slug: "cruilla",          name: "CRUÏLLA",          city: "Barcelona",             dates: "9–11 JUL 2026" },
];

const W = 1200;
const H = 630;
const BG = "#080808";
const PRIMARY = "#dbff00";    // lime accent
const TEXT_WHITE = "#ffffff";
const TEXT_MUTED = "#888888";

function buildSvg(festival) {
  const { name, city, dates } = festival;

  // Truncate long names to prevent overflow
  const displayName = name.length > 18 ? name.slice(0, 16) + "…" : name;
  const nameFontSize = displayName.length <= 12 ? 96 : displayName.length <= 16 ? 80 : 68;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <style>
      @font-face {
        font-family: 'ArchivoBlack';
        src: local('Archivo Black'), local('Arial Black'), local('Impact');
      }
    </style>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="${BG}" />

  <!-- Top accent bar -->
  <rect x="0" y="0" width="6" height="${H}" fill="${PRIMARY}" />

  <!-- Grid lines (subtle) -->
  <line x1="60" y1="0" x2="60" y2="${H}" stroke="#1a1a1a" stroke-width="1" />
  <line x1="${W - 60}" y1="0" x2="${W - 60}" y2="${H}" stroke="#1a1a1a" stroke-width="1" />
  <line x1="0" y1="60" x2="${W}" y2="60" stroke="#1a1a1a" stroke-width="1" />
  <line x1="0" y1="${H - 60}" x2="${W}" y2="${H - 60}" stroke="#1a1a1a" stroke-width="1" />

  <!-- CARPOOLING badge -->
  <rect x="80" y="80" width="220" height="36" rx="2" fill="none" stroke="${PRIMARY}" stroke-width="1.5" />
  <text x="190" y="104" font-family="'Arial Narrow', Arial, sans-serif" font-size="13"
    font-weight="700" letter-spacing="3" fill="${PRIMARY}" text-anchor="middle">
    CARPOOLING
  </text>

  <!-- Festival name -->
  <text x="80" y="${H / 2 - 20}" font-family="'Arial Black', 'Arial', sans-serif"
    font-size="${nameFontSize}" font-weight="900" fill="${TEXT_WHITE}"
    letter-spacing="-1">
    ${escapeXml(displayName)}
  </text>

  <!-- Divider line -->
  <line x1="80" y1="${H / 2 + 30}" x2="${W - 80}" y2="${H / 2 + 30}" stroke="#222222" stroke-width="1" />

  <!-- City -->
  <text x="80" y="${H / 2 + 70}" font-family="Arial, sans-serif"
    font-size="28" font-weight="400" fill="${TEXT_MUTED}" letter-spacing="2">
    ${escapeXml(city.toUpperCase())}
  </text>

  <!-- Dates (primary color) -->
  <text x="${W - 80}" y="${H / 2 + 70}" font-family="'Courier New', monospace"
    font-size="22" font-weight="700" fill="${PRIMARY}" letter-spacing="1" text-anchor="end">
    ${escapeXml(dates)}
  </text>

  <!-- ConcertRide brand bottom right -->
  <text x="${W - 80}" y="${H - 80}" font-family="'Arial Black', Arial, sans-serif"
    font-size="20" font-weight="900" fill="${PRIMARY}" letter-spacing="2" text-anchor="end">
    CONCERTRIDE.ME
  </text>
  <text x="${W - 80}" y="${H - 54}" font-family="'Courier New', monospace"
    font-size="13" fill="${TEXT_MUTED}" letter-spacing="1" text-anchor="end">
    CARPOOLING SIN COMISIÓN
  </text>
</svg>`;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function generateOgImage(festival) {
  const svg = buildSvg(festival);
  const svgBuffer = Buffer.from(svg, "utf8");
  const outPath = path.join(ogDir, `${festival.slug}.png`);

  await sharp(svgBuffer)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outPath);

  return outPath;
}

// ── Main ─────────────────────────────────────────────────────────────────────
console.log(`[gen-og-festivals] Generating ${FESTIVALS.length} OG images...`);

await fs.mkdir(ogDir, { recursive: true });

const results = await Promise.allSettled(FESTIVALS.map(generateOgImage));

let ok = 0;
let failed = 0;
for (const [i, result] of results.entries()) {
  if (result.status === "fulfilled") {
    console.log(`  ✓ ${FESTIVALS[i].slug}.png`);
    ok++;
  } else {
    console.error(`  ✗ ${FESTIVALS[i].slug}: ${result.reason?.message ?? result.reason}`);
    failed++;
  }
}

console.log(`[gen-og-festivals] Done — ${ok} ok, ${failed} failed`);
if (failed > 0) process.exit(1);

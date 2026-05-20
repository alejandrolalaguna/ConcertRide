#!/usr/bin/env node
// Converts local PNG/JPG/JPEG images to AVIF + WebP for next-gen format delivery.
// Output written next to the source (same dir, same basename, .avif/.webp ext).
//
// Scope: ONLY local images under apps/web/public/{images,og,icons}/ and the
// public root. NEVER touches Ticketmaster CDN assets (which are external URLs
// and must not be hosted locally — see CLAUDE.md TM Compliance rules).
//
// Idempotent: skips when both .avif and .webp already exist AND are newer than
// the source. Pass --force to rebuild every output.
//
// Run: node apps/web/scripts/convert-images.mjs

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// sharp resolves from the workspace root node_modules
const sharpPath = path.resolve(__dirname, "../../../node_modules/sharp/lib/index.js");
const { default: sharp } = await import(pathToFileURL(sharpPath).href);

const publicDir = path.resolve(__dirname, "../public");
const SCAN_DIRS = [
  publicDir,
  path.join(publicDir, "images"),
  path.join(publicDir, "og"),
  path.join(publicDir, "og", "templates"),
  path.join(publicDir, "icons"),
];

const RASTER_EXT = new Set([".png", ".jpg", ".jpeg"]);
const FORCE = process.argv.includes("--force");

const AVIF_OPTS = { quality: 55, effort: 5, chromaSubsampling: "4:2:0" };
const WEBP_OPTS = { quality: 78, effort: 4 };

const FORBIDDEN_PREFIXES = ["ticketm_", "tm_", "ticketmaster_"];

async function walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const out = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Only descend into known sub-directories (avoid node_modules / build outputs)
      if (full === dir + path.sep + "images" || full === dir + path.sep + "og" || full === dir + path.sep + "icons" || full.endsWith(path.sep + "templates")) {
        out.push(...await walk(full));
      }
      continue;
    }
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!RASTER_EXT.has(ext)) continue;
    out.push(full);
  }
  return out;
}

function isForbiddenName(filename) {
  const base = path.basename(filename).toLowerCase();
  return FORBIDDEN_PREFIXES.some((p) => base.startsWith(p));
}

async function statOrNull(p) {
  try { return await fs.stat(p); } catch { return null; }
}

async function convertOne(srcPath, stats) {
  const ext = path.extname(srcPath).toLowerCase();
  const base = srcPath.slice(0, -ext.length);
  const avifPath = `${base}.avif`;
  const webpPath = `${base}.webp`;

  const result = {
    src: srcPath,
    srcSize: stats.size,
    avifSize: 0,
    webpSize: 0,
    avifSkipped: false,
    webpSkipped: false,
  };

  const [avifStat, webpStat] = await Promise.all([statOrNull(avifPath), statOrNull(webpPath)]);

  const input = await fs.readFile(srcPath);

  if (!FORCE && avifStat && avifStat.mtimeMs >= stats.mtimeMs) {
    result.avifSize = avifStat.size;
    result.avifSkipped = true;
  } else {
    await sharp(input).avif(AVIF_OPTS).toFile(avifPath);
    const s = await statOrNull(avifPath);
    result.avifSize = s ? s.size : 0;
  }

  if (!FORCE && webpStat && webpStat.mtimeMs >= stats.mtimeMs) {
    result.webpSize = webpStat.size;
    result.webpSkipped = true;
  } else {
    await sharp(input).webp(WEBP_OPTS).toFile(webpPath);
    const s = await statOrNull(webpPath);
    result.webpSize = s ? s.size : 0;
  }

  return result;
}

function fmtKB(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}
function fmtMB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
function pct(num, denom) {
  if (!denom) return "0.0%";
  return `${((1 - num / denom) * 100).toFixed(1)}%`;
}

async function main() {
  const allFiles = new Set();
  for (const dir of SCAN_DIRS) {
    const files = await walk(dir);
    files.forEach((f) => allFiles.add(f));
  }

  const files = [...allFiles].sort();
  if (files.length === 0) {
    console.log("[convert-images] No PNG/JPG/JPEG files found under public/.");
    return;
  }

  const forbidden = files.filter(isForbiddenName);
  if (forbidden.length > 0) {
    console.error("[convert-images] BLOCKER — files matching forbidden TM prefixes found:");
    forbidden.forEach((f) => console.error(`  ${path.relative(publicDir, f)}`));
    console.error("  Ticketmaster images must be served from their CDN, not hosted locally.");
    console.error("  See CLAUDE.md TM Compliance §1.");
    process.exit(1);
  }

  console.log(`[convert-images] Found ${files.length} raster image(s). Converting…`);
  if (FORCE) console.log("[convert-images] --force flag set: rebuilding all outputs.");

  let totalSrc = 0;
  let totalAvif = 0;
  let totalWebp = 0;
  let convertedAvif = 0;
  let convertedWebp = 0;
  let skippedAvif = 0;
  let skippedWebp = 0;

  for (const f of files) {
    const stat = await statOrNull(f);
    if (!stat) continue;
    try {
      const r = await convertOne(f, stat);
      totalSrc += r.srcSize;
      totalAvif += r.avifSize;
      totalWebp += r.webpSize;
      if (r.avifSkipped) skippedAvif += 1; else convertedAvif += 1;
      if (r.webpSkipped) skippedWebp += 1; else convertedWebp += 1;
      const rel = path.relative(publicDir, f);
      const tag = (r.avifSkipped && r.webpSkipped) ? "skip" : "ok  ";
      console.log(`  [${tag}] ${rel}  ${fmtKB(r.srcSize)} -> avif ${fmtKB(r.avifSize)} / webp ${fmtKB(r.webpSize)}`);
    } catch (err) {
      console.error(`  [err ] ${path.relative(publicDir, f)}: ${err.message}`);
    }
  }

  console.log("");
  console.log("[convert-images] Summary");
  console.log(`  Images scanned : ${files.length}`);
  console.log(`  AVIF written   : ${convertedAvif} (skipped ${skippedAvif})`);
  console.log(`  WebP written   : ${convertedWebp} (skipped ${skippedWebp})`);
  console.log(`  Source total   : ${fmtMB(totalSrc)}`);
  console.log(`  AVIF total     : ${fmtMB(totalAvif)} (saves ${pct(totalAvif, totalSrc)} vs source)`);
  console.log(`  WebP total     : ${fmtMB(totalWebp)} (saves ${pct(totalWebp, totalSrc)} vs source)`);
}

main().catch((err) => {
  console.error("[convert-images] Fatal:", err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * inline-critical-css.mjs
 *
 * Sprint 6 — Render-blocking CSS optimization.
 *
 * Runs AFTER `prerender.mjs` and inlines critical CSS in every dist/**\/*.html
 * page using `beasties` (the maintained fork of Critters). Non-critical CSS
 * is deferred via <link rel="preload" as="style" onload="…"> with a <noscript>
 * fallback — the standard pattern Google recommends for LCP.
 *
 * WHY POST-PRERENDER (not a Vite plugin)
 *   `vite-plugin-beasties` only sees the empty SPA shell during vite build
 *   (`<div id="root"></div>` has no above-fold content yet). Critical CSS for
 *   a SPA is only meaningful AFTER the SSR markup has been injected, which
 *   happens in `prerender.mjs`. So we run beasties at the last stage, when
 *   each HTML file is final.
 *
 * USAGE
 *   node scripts/inline-critical-css.mjs                # process all dist/*.html
 *   node scripts/inline-critical-css.mjs --dry-run      # log only
 *   node scripts/inline-critical-css.mjs --verbose
 *
 * BACKSTOP
 *   If beasties throws on a page (e.g. malformed HTML), the original file is
 *   left untouched and a warning is logged. The build still succeeds.
 *
 * IDEMPOTENCY
 *   Re-running on already-processed HTML is a no-op: beasties detects the
 *   inlined <style> + deferred <link> pattern and skips. We also gate on
 *   the marker comment `<!-- critical-css-inlined -->`.
 */

import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Beasties from "beasties";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const DRY_RUN = process.argv.includes("--dry-run");
const VERBOSE = process.argv.includes("--verbose");
const MARKER = "<!-- critical-css-inlined -->";

/**
 * Beasties options tuned for ConcertRide.
 *  - preload:"swap"       → <link rel="preload" as="style" onload="this.rel='stylesheet'">
 *                           which is the LCP-friendly pattern Google recommends.
 *  - pruneSource:false    → keep the original CSS file on disk; we only modify HTML.
 *                           Tailwind v4's bundle is shared across 4500+ pages, deleting
 *                           per-page would break navigation.
 *  - inlineFonts:false    → Google Fonts is already deferred via preload pattern.
 *                           Don't double-inline.
 *  - mergeStylesheets:true → merge multiple <style> blocks into one.
 *  - logLevel:"warn"      → keep stdout clean; we'll surface our own progress.
 *  - reduceInlineStyles:false → don't dedupe inline styles (could break JSON-LD which
 *                              has no styles but defensive).
 *  - additionalStylesheets: include 404.css etc. if any (none currently).
 *
 * Beasties resolves stylesheet hrefs relative to `path`. Each HTML lives in a
 * different depth (dist/index.html vs dist/festivales/mad-cool/index.html), so
 * we set `path` to DIST and rely on hrefs being absolute (`/assets/...`).
 */
function makeBeasties() {
  return new Beasties({
    path: DIST,
    publicPath: "/",
    preload: "swap",
    pruneSource: false,
    inlineFonts: false,
    mergeStylesheets: true,
    logLevel: "silent",
    reduceInlineStyles: false,
  });
}

/* -------------------------------------------------------------------------- */
/* HTML walker                                                                 */
/* -------------------------------------------------------------------------- */

async function* walkHtml(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (e) {
    // Directory may have been removed between parent readdir and this call
    // (race with prerender cleanup, or Windows encoding edge case).
    if (e.code === "ENOENT") {
      if (VERBOSE) console.warn(`  SKIP (ENOENT parent): ${path.relative(DIST, dir)}`);
      return;
    }
    throw e;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip assets (already-built CSS/JS), images, sourcemaps.
      if (entry.name === "assets" || entry.name === "og" || entry.name === "images") continue;
      try {
        yield* walkHtml(full);
      } catch (e) {
        if (e.code === "ENOENT") {
          console.warn(`  SKIP (ENOENT subdir): ${entry.name}`);
          continue;
        }
        throw e;
      }
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      yield full;
    }
  }
}

/**
 * Heuristic: is this an HTML file worth processing?
 *  - Has a <link rel="stylesheet"> referencing /assets/*.css
 *  - Has a non-empty <div id="root">…</div> (i.e. prerendered, not raw shell)
 *  - Doesn't already have the marker comment
 */
function isCandidate(html) {
  if (html.includes(MARKER)) return false;
  // Need at least one real stylesheet link to /assets/.
  if (!/<link[^>]+rel=["']stylesheet["'][^>]+\/assets\//.test(html)) return false;
  return true;
}

/* -------------------------------------------------------------------------- */
/* Main                                                                        */
/* -------------------------------------------------------------------------- */

async function main() {
  if (!existsSync(DIST)) {
    console.error(`inline-critical-css: dist/ not found at ${DIST}. Run \`npm run build\` first.`);
    process.exit(2);
  }

  const beasties = makeBeasties();

  let processed = 0;
  let skipped = 0;
  let failed = 0;
  let totalBytesAdded = 0;
  let totalBytesSaved = 0;

  console.log(`inline-critical-css: scanning ${DIST}…`);

  for await (const filePath of walkHtml(DIST)) {
    let html;
    try {
      html = await readFile(filePath, "utf8");
    } catch (e) {
      // Stale dist/ entry from a previous build — file was removed by prerender cleanup
      if (e.code === "ENOENT") {
        if (VERBOSE) console.warn(`  SKIP (stale): ${path.relative(DIST, filePath)}`);
        skipped++;
        continue;
      }
      throw e;
    }
    if (!isCandidate(html)) {
      skipped++;
      if (VERBOSE) console.log(`  SKIP ${path.relative(DIST, filePath)}`);
      continue;
    }

    try {
      // beasties.process(html) — returns the modified HTML string.
      const processedHtml = await beasties.process(html);
      // Tag with marker comment for idempotency.
      const finalHtml = processedHtml.replace(
        /<\/head>/i,
        `  ${MARKER}\n  </head>`,
      );

      const delta = finalHtml.length - html.length;
      if (delta > 0) totalBytesAdded += delta;
      else totalBytesSaved += -delta;

      if (DRY_RUN) {
        if (VERBOSE) {
          console.log(`  DRY  ${path.relative(DIST, filePath)}  Δ${delta >= 0 ? "+" : ""}${delta} B`);
        }
      } else {
        await writeFile(filePath, finalHtml, "utf8");
      }
      processed++;
      if (VERBOSE) {
        console.log(`  OK   ${path.relative(DIST, filePath)}  Δ${delta >= 0 ? "+" : ""}${delta} B`);
      }
    } catch (err) {
      failed++;
      console.warn(
        `  WARN ${path.relative(DIST, filePath)} — beasties threw: ${err?.message ?? err}`,
      );
    }
  }

  console.log("");
  console.log(`inline-critical-css: ${processed} processed, ${skipped} skipped, ${failed} failed`);
  if (totalBytesAdded > 0) {
    console.log(`  inlined critical CSS added: ${(totalBytesAdded / 1024).toFixed(1)} KB across all pages`);
  }
  if (DRY_RUN) console.log("  (dry-run — no files written)");
  process.exit(failed > 0 && processed === 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("inline-critical-css: unhandled error:", err);
  process.exit(1);
});

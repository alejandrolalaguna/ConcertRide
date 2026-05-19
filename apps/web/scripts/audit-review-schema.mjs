#!/usr/bin/env node
/**
 * Review / AggregateRating schema coverage audit — Sprint 9 / Tarea A.
 *
 * Walks every prerendered `.html` under apps/web/dist/, extracts every
 * `<script type="application/ld+json">` block, and detects:
 *
 *   - presence of any node with @type === "Review"
 *   - presence of any node with @type === "AggregateRating"
 *     (top-level OR nested under aggregateRating: { ... } on another entity)
 *
 * Pages are bucketed into a page type based on their URL path, and for
 * each bucket we report:
 *
 *   - total pages scanned
 *   - pages with Review schema (count + %)
 *   - pages with AggregateRating schema (count + %)
 *
 * Output:
 *   - Human-readable summary to stdout
 *   - JSON report at apps/web/scripts/reports/review-schema-{YYYY-MM-DD}.json
 *
 * Exit code:
 *   - 0 always (informational audit, does not gate CI)
 *
 * Usage:
 *   node apps/web/scripts/audit-review-schema.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");
const reportsDir = path.resolve(__dirname, "reports");

const today = new Date().toISOString().slice(0, 10);
const reportPath = path.join(reportsDir, `review-schema-${today}.json`);

/**
 * Classify a URL path into a coarse page type bucket.
 * Order matters — more specific patterns first.
 */
function pageTypeOf(urlPath) {
  if (urlPath === "/" || urlPath === "/index" || urlPath === "/home") return "home";
  if (urlPath.startsWith("/festivales-en/")) return "region";
  if (urlPath.startsWith("/festivales-genero/")) return "genre";
  if (urlPath.startsWith("/calendario-festivales")) return "calendar";
  if (urlPath.startsWith("/festivales/") && /\/guia$/.test(urlPath)) return "festival_guide";
  if (urlPath.startsWith("/festivales/")) return "festival";
  if (urlPath.startsWith("/conciertos/")) return "city";
  if (urlPath.startsWith("/artistas/")) return "artist";
  if (urlPath.startsWith("/recintos/")) return "venue";
  if (urlPath.startsWith("/rutas/")) return "route";
  if (urlPath.startsWith("/como-llegar/")) return "howto";
  if (urlPath.startsWith("/blog/")) return "blog";
  if (urlPath.startsWith("/pilar/") || urlPath.startsWith("/pillar/") || urlPath.startsWith("/guia/")) return "pillar";
  if (urlPath.startsWith("/datos") || urlPath.startsWith("/dataset")) return "dataset";
  if (urlPath.startsWith("/comparativa/")) return "comparativa";
  if (urlPath.startsWith("/autor/")) return "author";
  return "other";
}

async function* walkHtml(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err && (err.code === "ENOENT" || err.code === "ENOTDIR")) return;
    throw err;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkHtml(full);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      yield full;
    }
  }
}

function relUrlFromHtmlPath(htmlPath) {
  const rel = path.relative(distDir, htmlPath).replace(/\\/g, "/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return "/" + rel.slice(0, -"/index.html".length);
  if (rel.endsWith(".html")) return "/" + rel.slice(0, -".html".length);
  return "/" + rel;
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    blocks.push(m[1].trim());
  }
  return blocks;
}

/**
 * Walk every nested value of a JSON-LD payload looking for the given @type.
 * Also matches AggregateRating embedded as the value of an `aggregateRating`
 * property (very common: Service/Organization/LocalBusiness with embedded
 * AggregateRating).
 */
function hasTypeAnywhere(node, targetType) {
  if (!node || typeof node !== "object") return false;
  if (Array.isArray(node)) {
    return node.some((child) => hasTypeAnywhere(child, targetType));
  }
  const t = node["@type"];
  if (t === targetType) return true;
  if (Array.isArray(t) && t.includes(targetType)) return true;
  // Treat `aggregateRating: { ... }` as an AggregateRating presence signal
  // even if the inner object omits @type (we still flag, but unlikely).
  if (targetType === "AggregateRating" && node.aggregateRating) {
    return true;
  }
  for (const key of Object.keys(node)) {
    const v = node[key];
    if (v && typeof v === "object" && hasTypeAnywhere(v, targetType)) return true;
  }
  return false;
}

async function main() {
  await fs.mkdir(reportsDir, { recursive: true });

  // Verify dist exists
  try {
    const stat = await fs.stat(distDir);
    if (!stat.isDirectory()) {
      console.error(`dist directory not found at ${distDir}`);
      process.exit(0);
    }
  } catch {
    console.error(`dist directory not found at ${distDir} — run \`npm run build\` first.`);
    process.exit(0);
  }

  /** @type {Map<string, { total: number, withReview: number, withAggregate: number, sampleWithReview: string[], sampleWithoutReview: string[] }>} */
  const buckets = new Map();
  const ensureBucket = (key) => {
    if (!buckets.has(key)) {
      buckets.set(key, {
        total: 0,
        withReview: 0,
        withAggregate: 0,
        sampleWithReview: [],
        sampleWithoutReview: [],
      });
    }
    return buckets.get(key);
  };

  let filesScanned = 0;
  let filesWithReview = 0;
  let filesWithAggregate = 0;
  let parseErrors = 0;

  for await (const htmlPath of walkHtml(distDir)) {
    filesScanned += 1;
    const url = relUrlFromHtmlPath(htmlPath);
    const bucket = ensureBucket(pageTypeOf(url));
    bucket.total += 1;

    const html = await fs.readFile(htmlPath, "utf8");
    const blocks = extractJsonLdBlocks(html);

    let pageHasReview = false;
    let pageHasAggregate = false;

    for (const raw of blocks) {
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        parseErrors += 1;
        continue;
      }
      if (!pageHasReview && hasTypeAnywhere(parsed, "Review")) pageHasReview = true;
      if (!pageHasAggregate && hasTypeAnywhere(parsed, "AggregateRating")) pageHasAggregate = true;
      if (pageHasReview && pageHasAggregate) break;
    }

    if (pageHasReview) {
      bucket.withReview += 1;
      filesWithReview += 1;
      if (bucket.sampleWithReview.length < 3) bucket.sampleWithReview.push(url);
    } else if (bucket.sampleWithoutReview.length < 3) {
      bucket.sampleWithoutReview.push(url);
    }
    if (pageHasAggregate) {
      bucket.withAggregate += 1;
      filesWithAggregate += 1;
    }
  }

  // Build report
  const byType = {};
  for (const [type, stats] of [...buckets.entries()].sort()) {
    const pctReview = stats.total ? ((stats.withReview / stats.total) * 100).toFixed(1) : "0.0";
    const pctAggregate = stats.total ? ((stats.withAggregate / stats.total) * 100).toFixed(1) : "0.0";
    byType[type] = {
      total: stats.total,
      withReview: stats.withReview,
      pctReview: Number(pctReview),
      withAggregateRating: stats.withAggregate,
      pctAggregateRating: Number(pctAggregate),
      sampleWithReview: stats.sampleWithReview,
      sampleWithoutReview: stats.sampleWithoutReview,
    };
  }

  const report = {
    generatedAt: new Date().toISOString(),
    distDir: path.relative(path.resolve(__dirname, "..", ".."), distDir).replace(/\\/g, "/"),
    summary: {
      filesScanned,
      filesWithReview,
      filesWithAggregateRating: filesWithAggregate,
      pctReview: filesScanned ? Number(((filesWithReview / filesScanned) * 100).toFixed(1)) : 0,
      pctAggregateRating: filesScanned ? Number(((filesWithAggregate / filesScanned) * 100).toFixed(1)) : 0,
      parseErrors,
    },
    byPageType: byType,
  };

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

  // Pretty print summary
  console.log("");
  console.log("Review / AggregateRating schema coverage audit");
  console.log("==============================================");
  console.log(`Scanned: ${filesScanned} HTML files in ${path.relative(process.cwd(), distDir)}`);
  console.log(`With Review schema:           ${filesWithReview} (${report.summary.pctReview}%)`);
  console.log(`With AggregateRating schema:  ${filesWithAggregate} (${report.summary.pctAggregateRating}%)`);
  if (parseErrors > 0) console.log(`JSON parse errors:            ${parseErrors}`);
  console.log("");
  console.log("By page type:");
  const pad = (s, n) => String(s).padEnd(n);
  console.log(
    pad("type", 18) +
      pad("total", 8) +
      pad("review", 8) +
      pad("%rev", 8) +
      pad("aggregate", 12) +
      pad("%agg", 8),
  );
  console.log("-".repeat(62));
  for (const [type, stats] of Object.entries(byType)) {
    console.log(
      pad(type, 18) +
        pad(stats.total, 8) +
        pad(stats.withReview, 8) +
        pad(`${stats.pctReview}%`, 8) +
        pad(stats.withAggregateRating, 12) +
        pad(`${stats.pctAggregateRating}%`, 8),
    );
  }
  console.log("");
  console.log(`JSON report: ${path.relative(process.cwd(), reportPath)}`);
}

main().catch((err) => {
  console.error("audit-review-schema failed:", err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Schema integrity audit — Sprint 7 / Tarea A.
 *
 * Reads every prerendered `.html` under apps/web/dist/, extracts every
 * `<script type="application/ld+json">` block, parses each one, and reports:
 *
 *   1. JSON parse errors (with URL + snippet).
 *   2. Duplicates within the same page:
 *      - same `@type` + `@id`
 *      - same `name` + `url` pair on two different objects
 *   3. Common schema errors:
 *      - `Offer.price` as a string (Google rejects it; must be a number)
 *      - `Offer.price` set but `priceCurrency` missing
 *      - `@type: Event` without `startDate`
 *      - `@type: Article` (or NewsArticle / BlogPosting) without `author`
 *      - `@type: BreadcrumbList` without `itemListElement` (or empty array)
 *
 * Output:
 *   - Human-readable summary to stdout
 *   - JSON report at apps/web/scripts/reports/schema-integrity.json
 *
 * Exit code:
 *   - 0 if no parse errors and no critical schema errors found
 *   - 1 otherwise (so it can gate CI/build pipelines)
 *
 * Usage:
 *   node apps/web/scripts/audit-schema-integrity.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");
const reportsDir = path.resolve(__dirname, "reports");
const reportPath = path.join(reportsDir, "schema-integrity.json");

/** @typedef {{ url: string, severity: "error" | "warning", code: string, message: string, snippet?: string }} Finding */

/** @type {Finding[]} */
const findings = [];
let filesScanned = 0;
let schemasParsed = 0;
let schemasFailed = 0;

const ARTICLE_TYPES = new Set([
  "Article",
  "NewsArticle",
  "BlogPosting",
  "TechArticle",
  "ScholarlyArticle",
  "Report",
]);

async function* walkHtml(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    // Some build outputs include transient/empty dirs or symlinks that
    // disappear between enumeration and recursion. Skip those rather than
    // aborting the whole audit.
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
 * Yields every "schema-like" object reachable from a parsed JSON-LD payload.
 * Handles top-level arrays, top-level objects, and `@graph` arrays.
 */
function* iterateSchemas(payload) {
  if (Array.isArray(payload)) {
    for (const node of payload) yield* iterateSchemas(node);
    return;
  }
  if (!payload || typeof payload !== "object") return;

  if (Array.isArray(payload["@graph"])) {
    for (const node of payload["@graph"]) yield* iterateSchemas(node);
    return;
  }
  yield payload;
}

/**
 * Yields every nested object that exposes an Offer-like shape (has a `price`
 * field). Used to validate Offer.price / priceCurrency without depending on
 * @type which is sometimes omitted on inlined Offer fragments.
 */
function* iterateOfferLike(obj) {
  if (!obj || typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    for (const item of obj) yield* iterateOfferLike(item);
    return;
  }
  if ("price" in obj) yield obj;
  for (const key of Object.keys(obj)) {
    const v = obj[key];
    if (v && typeof v === "object") yield* iterateOfferLike(v);
  }
}

function pushFinding(url, severity, code, message, snippet) {
  findings.push({ url, severity, code, message, snippet });
}

function snippetOf(raw) {
  const cleaned = raw.replace(/\s+/g, " ").trim();
  return cleaned.length > 240 ? cleaned.slice(0, 240) + "…" : cleaned;
}

function validateBlock(url, blockIndex, raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    schemasFailed += 1;
    pushFinding(
      url,
      "error",
      "JSON_PARSE",
      `Block #${blockIndex}: invalid JSON — ${err.message}`,
      snippetOf(raw),
    );
    return;
  }
  schemasParsed += 1;

  /** keys for in-page duplicate detection */
  const byTypeId = new Map(); // `${type}::${@id}` -> first index seen
  const byNameUrl = new Map(); // `${name}::${url}` -> first index seen

  let schemaIndex = -1;
  for (const node of iterateSchemas(parsed)) {
    schemaIndex += 1;
    const t = node["@type"];
    const types = Array.isArray(t) ? t : [t];

    // Duplicate detection — @type + @id pair
    if (node["@id"]) {
      const key = `${types.join("|")}::${node["@id"]}`;
      if (byTypeId.has(key)) {
        pushFinding(
          url,
          "error",
          "DUPLICATE_TYPE_ID",
          `Block #${blockIndex} node #${schemaIndex}: duplicate (@type=${types.join("|")}, @id=${node["@id"]}) — first seen at node #${byTypeId.get(key)}`,
        );
      } else {
        byTypeId.set(key, schemaIndex);
      }
    }

    // Duplicate detection — name + url pair
    if (typeof node.name === "string" && typeof node.url === "string") {
      const key = `${node.name}::${node.url}`;
      if (byNameUrl.has(key)) {
        pushFinding(
          url,
          "warning",
          "DUPLICATE_NAME_URL",
          `Block #${blockIndex} node #${schemaIndex}: duplicate (name="${node.name}", url=${node.url}) — first seen at node #${byNameUrl.get(key)}`,
        );
      } else {
        byNameUrl.set(key, schemaIndex);
      }
    }

    // Event without startDate
    if (types.includes("Event") || types.includes("MusicEvent") || types.includes("Festival")) {
      if (!node.startDate) {
        pushFinding(
          url,
          "error",
          "EVENT_NO_STARTDATE",
          `Block #${blockIndex} node #${schemaIndex}: @type=${types.join("|")} missing startDate`,
        );
      }
    }

    // Article without author
    const isArticleType = types.some((tt) => ARTICLE_TYPES.has(tt));
    if (isArticleType) {
      if (!node.author) {
        pushFinding(
          url,
          "error",
          "ARTICLE_NO_AUTHOR",
          `Block #${blockIndex} node #${schemaIndex}: @type=${types.join("|")} missing author`,
        );
      }
    }

    // BreadcrumbList without items
    if (types.includes("BreadcrumbList")) {
      const items = node.itemListElement;
      if (!Array.isArray(items) || items.length === 0) {
        pushFinding(
          url,
          "error",
          "BREADCRUMB_NO_ITEMS",
          `Block #${blockIndex} node #${schemaIndex}: BreadcrumbList missing itemListElement (or empty)`,
        );
      }
    }
  }

  // Offer.price validation — independent walk so it catches inline Offers
  let offerIndex = -1;
  for (const offer of iterateOfferLike(parsed)) {
    offerIndex += 1;
    const price = offer.price;
    if (price === undefined || price === null) continue;

    if (typeof price === "string") {
      pushFinding(
        url,
        "error",
        "OFFER_PRICE_STRING",
        `Block #${blockIndex} offer #${offerIndex}: price is a string ("${price}") — must be a number per schema.org`,
      );
    }
    if (!offer.priceCurrency) {
      pushFinding(
        url,
        "error",
        "OFFER_NO_CURRENCY",
        `Block #${blockIndex} offer #${offerIndex}: price=${JSON.stringify(price)} present but priceCurrency missing`,
      );
    }
  }
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  const stat = await fs.stat(distDir).catch(() => null);
  if (!stat || !stat.isDirectory()) {
    console.error(`[schema-integrity] dist/ not found at ${distDir} — run \`npm run build\` first.`);
    process.exit(2);
  }

  for await (const htmlPath of walkHtml(distDir)) {
    filesScanned += 1;
    const url = relUrlFromHtmlPath(htmlPath);
    const html = await fs.readFile(htmlPath, "utf8");
    const blocks = extractJsonLdBlocks(html);
    blocks.forEach((raw, idx) => validateBlock(url, idx, raw));
  }

  // Aggregate
  const counts = findings.reduce((acc, f) => {
    acc[f.code] = (acc[f.code] || 0) + 1;
    return acc;
  }, {});
  const errorCount = findings.filter((f) => f.severity === "error").length;
  const warningCount = findings.filter((f) => f.severity === "warning").length;

  const report = {
    generatedAt: new Date().toISOString(),
    filesScanned,
    schemasParsed,
    schemasFailed,
    errorCount,
    warningCount,
    countsByCode: counts,
    findings,
  };

  await ensureDir(reportsDir);
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

  // Console summary
  console.log("");
  console.log("Schema integrity audit");
  console.log("──────────────────────");
  console.log(`HTML files scanned:   ${filesScanned}`);
  console.log(`JSON-LD blocks parsed: ${schemasParsed}`);
  console.log(`JSON-LD blocks failed: ${schemasFailed}`);
  console.log(`Errors:                ${errorCount}`);
  console.log(`Warnings:              ${warningCount}`);
  console.log("");

  const codes = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  if (codes.length > 0) {
    console.log("Top error codes:");
    for (const code of codes.slice(0, 10)) {
      console.log(`  ${counts[code].toString().padStart(5)}  ${code}`);
    }
    console.log("");
  }

  // Top 5 findings (errors first, then warnings)
  const sortedFindings = [...findings].sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === "error" ? -1 : 1;
    return 0;
  });
  if (sortedFindings.length > 0) {
    console.log("Top 5 findings:");
    for (const f of sortedFindings.slice(0, 5)) {
      console.log(`  [${f.severity.toUpperCase()}] ${f.code} @ ${f.url}`);
      console.log(`         ${f.message}`);
      if (f.snippet) console.log(`         snippet: ${f.snippet}`);
    }
    console.log("");
  } else {
    console.log("No findings — schemas look clean.");
  }

  console.log(`Full report: ${path.relative(process.cwd(), reportPath)}`);

  process.exit(errorCount > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("[schema-integrity] fatal:", err);
  process.exit(2);
});

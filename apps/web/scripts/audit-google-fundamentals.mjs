#!/usr/bin/env node
/**
 * audit-google-fundamentals.mjs
 *
 * Audit alineado con las tres guías oficiales de Google:
 *   - https://developers.google.com/search/docs/fundamentals/seo-starter-guide
 *   - https://developers.google.com/search/docs/fundamentals/do-i-need-seo
 *   - https://developers.google.com/search/docs/fundamentals/get-started
 *
 * Chequea (sobre dist/ si existe; si no, sobre los .tsx en src/):
 *   1. H1 único por página (>= 1, <= 1).
 *   2. Title length 30-65 chars + unicidad.
 *   3. Description length 70-160 chars.
 *   4. Alt text en TODAS las <img> (excepto decorativas con role="presentation"
 *      o aria-hidden="true" o alt="" explícito).
 *   5. Anchor text descriptivo: ningún <a> ni <Link> cuyo texto visible sea
 *      SÓLO uno de: "aquí", "click aquí", "leer más", "ver más", "más info",
 *      "más información", "haz clic", "here", "click here", "more".
 *   6. URLs sin IDs numéricos crudos como segmento principal de path
 *      (preferir slugs). Excluidos /rides/:id, /concerts/:id (detalle interno).
 *
 * Output: warnings agrupados por categoría + count + sample paths.
 *
 * Exit code: SIEMPRE 0 (informativo). Solo no-cero si crashea el script.
 *
 * Uso:
 *   node apps/web/scripts/audit-google-fundamentals.mjs
 *   node apps/web/scripts/audit-google-fundamentals.mjs --verbose
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const distDir = path.join(ROOT, "dist");
const srcDir = path.join(ROOT, "src");
const reportsDir = path.join(__dirname, "reports");
const VERBOSE = process.argv.includes("--verbose");

// ─── Thresholds (extracted from Google guidelines + industry consensus) ──
const TITLE_MIN = 30;
const TITLE_MAX = 65;
const DESC_MIN = 70;
const DESC_MAX = 160;

// Generic anchor phrases (lowercased + trimmed equality match).
const GENERIC_ANCHORS = new Set([
  "aquí",
  "click aquí",
  "haz clic",
  "haz clic aquí",
  "pulsa aquí",
  "leer más",
  "ver más",
  "más info",
  "más información",
  "here",
  "click here",
  "more",
  "read more",
  "learn more",
]);

// Paths that legitimately use numeric IDs (detail pages — internal app, not
// SEO landings; they should noindex anyway and this audit shouldn't bark).
const NUMERIC_ID_EXEMPT = [
  /^\/rides\//,
  /^\/concerts\/[^/]+$/, // /concerts/:id (slug-or-id; SPA detail page)
  /^\/profile\//,
  /^\/squads\//,
  /^\/mensajes\//,
  /^\/api\//,
];

const buckets = {
  "h1: missing": [],
  "h1: multiple": [],
  "title: too short": [],
  "title: too long": [],
  "title: missing": [],
  "title: duplicate": [],
  "description: too short": [],
  "description: too long": [],
  "description: missing": [],
  "img: missing alt": [],
  "anchor: generic text": [],
  "url: numeric id segment": [],
};

let filesChecked = 0;

// ─── HTML utility helpers ───────────────────────────────────────────────
function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function extractTitle(html) {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return m ? decodeEntities(m[1].trim()) : null;
}

function extractMeta(html, name) {
  const re = new RegExp(
    `<meta\\s+(?:[^>]*?\\s)?(?:name|property)=["']${name}["'][^>]*>`,
    "i",
  );
  const tag = re.exec(html);
  if (!tag) return null;
  const cm = /content=(["'])([\s\S]*?)\1/i.exec(tag[0]);
  return cm ? decodeEntities(cm[2]) : null;
}

function countH1(html) {
  // Count opening <h1> tags (excludes self-closed since h1 doesn't self-close).
  const matches = html.match(/<h1[\s>]/gi);
  return matches ? matches.length : 0;
}

function extractAnchors(html) {
  // Return array of { href, text } for <a> tags. Skips obvious nav links via
  // role check (still reported if generic — nav often is fine but let's see).
  const out = [];
  const re = /<a\s+([^>]*?)>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1];
    const inner = m[2];
    const hrefM = /\bhref\s*=\s*["']([^"']+)["']/i.exec(attrs);
    const ariaM = /\baria-label\s*=\s*["']([^"']+)["']/i.exec(attrs);
    const text = stripTags(decodeEntities(inner));
    out.push({
      href: hrefM ? hrefM[1] : null,
      text,
      ariaLabel: ariaM ? ariaM[1] : null,
    });
  }
  return out;
}

function extractImgs(html) {
  const out = [];
  const re = /<img\s+([^>]*?)\/?>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1];
    const altM = /\balt\s*=\s*["']([^"']*)["']/i.exec(attrs);
    const roleM = /\brole\s*=\s*["']([^"']+)["']/i.exec(attrs);
    const ariaHiddenM = /\baria-hidden\s*=\s*["']true["']/i.exec(attrs);
    const srcM = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(attrs);
    out.push({
      hasAlt: !!altM,
      alt: altM ? altM[1] : null,
      role: roleM ? roleM[1] : null,
      decorative: !!ariaHiddenM || (roleM && roleM[1] === "presentation"),
      src: srcM ? srcM[1] : null,
    });
  }
  return out;
}

function htmlToRoutePath(filePath) {
  const rel = path.relative(distDir, filePath).replace(/\\/g, "/");
  const stripped = rel.replace(/\/?index\.html$/, "");
  return stripped === "" ? "/" : `/${stripped}`;
}

function hasNumericIdSegment(routePath) {
  if (NUMERIC_ID_EXEMPT.some((re) => re.test(routePath))) return false;
  // Split path into segments; flag if any non-final segment is purely numeric
  // (final detail IDs are exempt; only middle path segments are concerning).
  const segs = routePath.split("/").filter(Boolean);
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i];
    // Pure 4+ digit segment that's not a known year-yyyy slug (we allow 2026)
    if (/^\d{4,}$/.test(seg) && !/^(20\d{2}|19\d{2})$/.test(seg)) {
      return true;
    }
    // Numeric ID with hyphen prefix (e.g. /post-12345) at non-final position
    if (i < segs.length - 1 && /^\d{6,}$/.test(seg)) return true;
  }
  return false;
}

// ─── Walk dist/ ─────────────────────────────────────────────────────────
async function* walkHtml(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (e) {
    if (e.code === "ENOENT") return;
    throw e;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      try {
        yield* walkHtml(full);
      } catch (e) {
        if (e.code === "ENOENT") continue;
        throw e;
      }
    } else if (entry.name === "index.html") {
      yield full;
    }
  }
}

// ─── Per-file validation ────────────────────────────────────────────────
const titlesSeen = new Map(); // title -> first-route

function validateHtml(routePath, html) {
  // (1) H1 count
  const h1Count = countH1(html);
  if (h1Count === 0) buckets["h1: missing"].push(routePath);
  else if (h1Count > 1) buckets["h1: multiple"].push(`${routePath} (${h1Count})`);

  // (2) Title length + uniqueness
  const title = extractTitle(html);
  if (!title) {
    buckets["title: missing"].push(routePath);
  } else {
    if (title.length < TITLE_MIN) {
      buckets["title: too short"].push(`${routePath} (${title.length})`);
    } else if (title.length > TITLE_MAX) {
      buckets["title: too long"].push(`${routePath} (${title.length})`);
    }
    const norm = title.trim().toLowerCase();
    if (titlesSeen.has(norm)) {
      buckets["title: duplicate"].push(
        `${routePath} == ${titlesSeen.get(norm)}`,
      );
    } else {
      titlesSeen.set(norm, routePath);
    }
  }

  // (3) Description length
  const desc = extractMeta(html, "description");
  if (!desc) {
    buckets["description: missing"].push(routePath);
  } else {
    if (desc.length < DESC_MIN) {
      buckets["description: too short"].push(`${routePath} (${desc.length})`);
    } else if (desc.length > DESC_MAX) {
      buckets["description: too long"].push(`${routePath} (${desc.length})`);
    }
  }

  // (4) Image alt text
  const imgs = extractImgs(html);
  for (const img of imgs) {
    if (img.decorative) continue;
    if (!img.hasAlt) {
      buckets["img: missing alt"].push(`${routePath} src=${img.src || "?"}`);
    }
    // empty alt="" without role=presentation/aria-hidden is suspicious but
    // sometimes intentional (e.g. icons inside aria-labeled buttons); we only
    // flag when alt is missing entirely.
  }

  // (5) Anchor text
  const anchors = extractAnchors(html);
  for (const a of anchors) {
    if (!a.text) continue; // icon-only links use aria-label, fine
    const norm = a.text.toLowerCase().trim();
    if (GENERIC_ANCHORS.has(norm)) {
      // If aria-label adds context, it's OK; flag only when no aria-label.
      if (!a.ariaLabel) {
        buckets["anchor: generic text"].push(
          `${routePath} "${a.text}" → ${a.href || "?"}`,
        );
      }
    }
  }

  // (6) URL structure
  if (hasNumericIdSegment(routePath)) {
    buckets["url: numeric id segment"].push(routePath);
  }
}

// ─── Source-mode fallback (no dist/) ────────────────────────────────────
// Best-effort: scan .tsx in src/pages and flag generic anchor literal text.
async function fallbackScanSrc() {
  const pagesDir = path.join(srcDir, "pages");
  let entries;
  try {
    entries = await fs.readdir(pagesDir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (!e.isFile() || !e.name.endsWith(".tsx")) continue;
    const file = path.join(pagesDir, e.name);
    const src = await fs.readFile(file, "utf8");
    filesChecked++;
    // Count <h1 occurrences in JSX
    const h1Open = (src.match(/<h1[\s>]/g) || []).length;
    if (h1Open === 0) {
      buckets["h1: missing"].push(`src/pages/${e.name}`);
    } else if (h1Open > 1) {
      buckets["h1: multiple"].push(`src/pages/${e.name} (${h1Open})`);
    }
    // Detect generic anchor literals: ">Aquí<" etc.
    const reAnchor = /<(?:a|Link)\b[^>]*>([^<]+)<\/(?:a|Link)>/gi;
    let m;
    while ((m = reAnchor.exec(src)) !== null) {
      const text = m[1].trim();
      if (GENERIC_ANCHORS.has(text.toLowerCase())) {
        buckets["anchor: generic text"].push(`src/pages/${e.name} "${text}"`);
      }
    }
  }
}

// ─── Main ───────────────────────────────────────────────────────────────
async function main() {
  let mode;
  try {
    await fs.access(distDir);
    mode = "dist";
  } catch {
    mode = "src";
  }

  if (mode === "dist") {
    for await (const file of walkHtml(distDir)) {
      const html = await fs.readFile(file, "utf8");
      filesChecked++;
      validateHtml(htmlToRoutePath(file), html);
    }
  } else {
    console.log(
      "[audit-google-fundamentals] dist/ no encontrado — auditando .tsx fuente (modo fallback)",
    );
    await fallbackScanSrc();
  }

  // ─── Report ──────────────────────────────────────────────────────────
  let totalWarnings = 0;
  for (const v of Object.values(buckets)) totalWarnings += v.length;

  console.log(
    `\n=== audit-google-fundamentals — ${filesChecked} files, ${totalWarnings} warning(s) ===`,
  );
  console.log(`Mode: ${mode}`);

  const order = [
    "h1: missing",
    "h1: multiple",
    "title: missing",
    "title: too short",
    "title: too long",
    "title: duplicate",
    "description: missing",
    "description: too short",
    "description: too long",
    "img: missing alt",
    "anchor: generic text",
    "url: numeric id segment",
  ];

  for (const key of order) {
    const arr = buckets[key];
    if (arr.length === 0) continue;
    const sample = arr.slice(0, VERBOSE ? 20 : 5);
    console.log(`\n[${key}] ${arr.length}`);
    for (const item of sample) console.log(`  - ${item}`);
    if (arr.length > sample.length) {
      console.log(`  … +${arr.length - sample.length} more`);
    }
  }

  if (totalWarnings === 0) {
    console.log("\nno blocking issues found.");
  } else {
    console.log(
      `\nReminder: this audit is informational. Exit 0 always (no CI gate).`,
    );
  }

  // Write JSON report for downstream tooling.
  try {
    await fs.mkdir(reportsDir, { recursive: true });
    const today = new Date().toISOString().slice(0, 10);
    const reportPath = path.join(
      reportsDir,
      `google-fundamentals-${today}.json`,
    );
    const report = {
      generatedAt: new Date().toISOString(),
      mode,
      filesChecked,
      totalWarnings,
      thresholds: { TITLE_MIN, TITLE_MAX, DESC_MIN, DESC_MAX },
      buckets,
    };
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
    if (VERBOSE) console.log(`\nReport: ${path.relative(ROOT, reportPath)}`);
  } catch (err) {
    console.warn(`[audit-google-fundamentals] could not write report: ${err.message}`);
  }
}

main().catch((err) => {
  console.error("[audit-google-fundamentals] crashed:", err);
  process.exit(1);
});

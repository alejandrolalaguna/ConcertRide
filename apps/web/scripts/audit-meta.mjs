#!/usr/bin/env node
// Audits all prerendered HTML files for SEO meta-tag hygiene.
// Checks:
//   - <title> length: 40-65 chars (< 40 warns, > 65 errors)
//   - <meta name="description"> length: 120-160 chars (< 120 warns, > 160 errors)
//   - <link rel="canonical"> present and absolute
//   - At least one <h1>
//   - BreadcrumbList schema present on indexable pages (skips noindex pages)
//   - <meta name="robots"> noindex absent on pages that should be indexable
//
// Pages are classified from their file path:
//   - "indexable" SEO landings: /festivales, /conciertos, /rutas, /artistas,
//     /recintos, /festivales-en, /festivales-genero, /calendario-festivales,
//     /como-llegar, /blog, plus the homepage
//   - "noindex": auth + Phase 1+2+3 social surfaces (these are SPA-only and
//     not in the prerender ROUTES, so they shouldn't appear here at all —
//     if they do, that's a leak we want to flag)
//
// Exits 1 ONLY for blocking categories:
//   - private/social routes leaked into prerender output
//   - missing <title> entirely
//   - missing <link rel="canonical">
//   - SEO landing with noindex robots meta (regression)
// Length-of-tag issues (title>65, desc>160, missing breadcrumb, etc.)
// are reported as warnings — they're worth tracking but shouldn't break
// CI when the curated overrides corpus is migrated incrementally.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");

const errors = [];
const warnings = [];
let filesChecked = 0;

const TITLE_MIN = 40;
const TITLE_MAX = 65;
const DESC_MIN = 120;
const DESC_MAX = 160;

// Path prefixes that should never appear in dist/. If they do, prerender.mjs
// is leaking private/social routes into the indexable bundle.
const FORBIDDEN_PREFIXES = [
  "/crew",
  "/feed",
  "/memorias",
  "/squads",
  "/profile",
  "/mis-viajes",
  "/favoritos",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/admin",
  "/mensajes",
];

async function* walkHtml(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkHtml(full);
    } else if (entry.name === "index.html") {
      yield full;
    }
  }
}

function htmlToRoutePath(filePath) {
  const rel = path.relative(distDir, filePath).replace(/\\/g, "/");
  // dist/foo/bar/index.html → /foo/bar (or "/" for the root)
  const stripped = rel.replace(/\/?index\.html$/, "");
  return stripped === "" ? "/" : `/${stripped}`;
}

// Decode HTML entities in attribute values so length checks match what
// Google sees. Cheap subset — covers the entities our pages actually emit.
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

function extractTitle(html) {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return m ? decodeEntities(m[1].trim()) : null;
}

function extractMeta(html, name) {
  // Match <meta name="x" content="y"> or <meta property="x" content="y">,
  // attributes in any order.
  const re = new RegExp(
    `<meta\\s+(?:[^>]*?\\s)?(?:name|property)=["']${name}["'][^>]*>`,
    "i",
  );
  const tag = re.exec(html);
  if (!tag) return null;
  const cm = /content=["']([^"']*)["']/i.exec(tag[0]);
  return cm ? decodeEntities(cm[1]) : null;
}

function hasH1(html) {
  return /<h1[\s>]/i.test(html);
}

function hasCanonical(html) {
  const m = /<link\s+(?:[^>]*?\s)?rel=["']canonical["'][^>]*>/i.exec(html);
  if (!m) return null;
  const hm = /href=["']([^"']+)["']/i.exec(m[0]);
  return hm ? hm[1] : null;
}

function hasBreadcrumbSchema(html) {
  // We only need to know whether ANY ld+json block declares a BreadcrumbList.
  // Cheaper than parsing each block when most landings emit several schemas.
  return /"@type"\s*:\s*"BreadcrumbList"/.test(html);
}

function isIndexable(routePath, robotsContent) {
  if (robotsContent && /noindex/i.test(robotsContent)) return false;
  // Pages that legitimately don't need a BreadcrumbList because they're the
  // homepage or thin marker routes we don't crawl-shape.
  if (routePath === "/") return true;
  return true;
}

function validate(filePath, html) {
  const routePath = htmlToRoutePath(filePath);

  // 1. Forbidden private/social prefix leaked into prerender output
  for (const prefix of FORBIDDEN_PREFIXES) {
    if (routePath === prefix || routePath.startsWith(prefix + "/")) {
      errors.push(`${routePath} :: forbidden private route prerendered into dist/`);
      return;
    }
  }

  const title = extractTitle(html);
  const desc = extractMeta(html, "description");
  const canonical = hasCanonical(html);
  const robots = extractMeta(html, "robots");
  const h1 = hasH1(html);

  // 2. Title hygiene
  if (!title) {
    errors.push(`${routePath} :: missing <title>`);
  } else {
    if (title.length > TITLE_MAX) {
      // Length-cap warnings flag opportunities for CTR optimisation but
      // they do not block CI — the curated overrides corpus is being
      // migrated incrementally.
      warnings.push(`${routePath} :: title ${title.length} chars > ${TITLE_MAX} — "${title.slice(0, 70)}…"`);
    } else if (title.length < TITLE_MIN) {
      warnings.push(`${routePath} :: title ${title.length} chars < ${TITLE_MIN} — "${title}"`);
    }
  }

  // 3. Description hygiene
  if (!desc) {
    warnings.push(`${routePath} :: missing meta description`);
  } else {
    if (desc.length > DESC_MAX) {
      warnings.push(`${routePath} :: description ${desc.length} chars > ${DESC_MAX}`);
    } else if (desc.length < DESC_MIN) {
      warnings.push(`${routePath} :: description ${desc.length} chars < ${DESC_MIN}`);
    }
  }

  // 4. Canonical
  if (!canonical) {
    errors.push(`${routePath} :: missing <link rel="canonical">`);
  } else if (!canonical.startsWith("https://")) {
    errors.push(`${routePath} :: canonical not absolute — "${canonical}"`);
  }

  // 5. H1
  if (!h1) {
    warnings.push(`${routePath} :: no <h1> tag found`);
  }

  // 6. BreadcrumbList for indexable non-home pages
  if (isIndexable(routePath, robots) && routePath !== "/") {
    if (!hasBreadcrumbSchema(html)) {
      warnings.push(`${routePath} :: indexable page without BreadcrumbList schema`);
    }
  }

  // 7. If a page declares noindex but lives under an SEO prefix, flag it —
  // the user may have accidentally noindexed an indexable landing.
  if (robots && /noindex/i.test(robots)) {
    const seoPrefixes = [
      "/festivales",
      "/conciertos",
      "/rutas",
      "/artistas",
      "/recintos",
      "/festivales-en",
      "/festivales-genero",
      "/calendario-festivales",
      "/como-llegar",
      "/blog",
    ];
    if (seoPrefixes.some((p) => routePath.startsWith(p))) {
      errors.push(`${routePath} :: SEO landing has noindex robots meta`);
    }
  }
}

async function main() {
  try {
    await fs.access(distDir);
  } catch {
    console.error(`[audit-meta] dist/ not found at ${distDir}. Run \`npm run build\` first.`);
    process.exit(1);
  }

  for await (const file of walkHtml(distDir)) {
    const html = await fs.readFile(file, "utf8");
    filesChecked += 1;
    validate(file, html);
  }

  console.log(`[audit-meta] ${filesChecked} HTML files checked`);

  // Aggregate warning counts by category so the long tail of overrides
  // doesn't drown the actionable signals.
  if (warnings.length > 0) {
    const buckets = {
      "title > max": 0,
      "title < min": 0,
      "description > max": 0,
      "description < min": 0,
      "missing description": 0,
      "missing breadcrumb": 0,
      "no h1": 0,
      "other": 0,
    };
    for (const w of warnings) {
      if (/title \d+ chars > /.test(w)) buckets["title > max"]++;
      else if (/title \d+ chars < /.test(w)) buckets["title < min"]++;
      else if (/description \d+ chars > /.test(w)) buckets["description > max"]++;
      else if (/description \d+ chars < /.test(w)) buckets["description < min"]++;
      else if (/missing meta description/.test(w)) buckets["missing description"]++;
      else if (/without BreadcrumbList/.test(w)) buckets["missing breadcrumb"]++;
      else if (/no <h1>/.test(w)) buckets["no h1"]++;
      else buckets["other"]++;
    }
    console.log(`[audit-meta] ${warnings.length} warning(s):`);
    for (const [k, v] of Object.entries(buckets)) {
      if (v > 0) console.log(`  ⚠ ${v.toString().padStart(4)} · ${k}`);
    }
    console.log(`  (sample first 8 warnings:)`);
    for (const w of warnings.slice(0, 8)) console.log(`     ${w}`);
  }
  if (errors.length > 0) {
    console.error(`[audit-meta] ${errors.length} error(s):`);
    for (const e of errors.slice(0, 50)) console.error(`  ✗ ${e}`);
    if (errors.length > 50) console.error(`  … and ${errors.length - 50} more`);
    process.exit(1);
  }
  console.log("[audit-meta] ✓ no blocking issues");
}

main().catch((err) => {
  console.error("[audit-meta] crashed:", err);
  process.exit(1);
});

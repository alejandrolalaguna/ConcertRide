#!/usr/bin/env node
/**
 * audit-dead-internal-links.mjs  (added 2026-07-29 — GSC §AD)
 *
 * Fails the build if any HARD-CODED internal link in apps/web/src points to a
 * programmatic slug that does NOT exist. This is the guardrail that would have
 * caught the ~18 dead /festivales//rutas//recintos//blog links that fed GSC
 * "No se ha encontrado (404)" (87). The existing audit-internal-links.mjs only
 * finds MISSING links (gaps); this one finds BROKEN links (dead targets).
 *
 * Ground truth = the prerendered dist/ tree (what actually deploys), so there
 * are ZERO inventory-parsing false positives. Only LITERAL slugs are checked;
 * links with a `${...}` interpolation are skipped (can't statically resolve).
 *
 * Usage: node apps/web/scripts/audit-dead-internal-links.mjs
 *   (run AFTER `vite build` + prerender so dist/ is populated)
 *   Exit 0 = clean, Exit 1 = dead links found.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");

// Programmatic path types that are prerendered as dist/<type>/<slug>/index.html.
// If a type's dist dir is absent (not prerendered in this build) it is SKIPPED
// rather than flagged, so a partial build never yields false positives.
const TYPES = [
  "festivales",
  "rutas",
  "recintos",
  "artistas",
  "blog",
  "festivales-en",
  "festivales-genero",
  "calendario-festivales",
  "como-llegar",
];

if (!fs.existsSync(DIST)) {
  console.error("[audit-dead-internal-links] dist/ not found — run the build first.");
  process.exit(1);
}

// ── Build the valid-slug set per type from the prerendered dist tree ────────
const validSlugs = {};
const availableTypes = [];
for (const type of TYPES) {
  const dir = path.join(DIST, type);
  if (!fs.existsSync(dir)) continue;
  availableTypes.push(type);
  validSlugs[type] = new Set(
    fs.readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name),
  );
}

// ── Collect all source files ────────────────────────────────────────────────
function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(ts|tsx)$/.test(e.name)) acc.push(p);
  }
  return acc;
}
const files = walk(SRC);

// ── Scan for literal internal links: to="/type/slug", to:"/type/slug",
//    href="/type/slug", to={`/type/slug`} (no ${ interpolation) ──────────────
const typeAlt = availableTypes.join("|");
const linkRe = new RegExp(
  `(?:to|href)\\s*[:=]\\s*\\{?\\s*["'\`](/(?:${typeAlt})/([a-z0-9-]+))["'\`]`,
  "g",
);

const dead = [];
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  let m;
  while ((m = linkRe.exec(src)) !== null) {
    const full = m[1];
    const [, type, slug] = full.match(/^\/([^/]+)\/([a-z0-9-]+)$/) ?? [];
    if (!type || !slug) continue;
    if (!validSlugs[type]?.has(slug)) {
      const line = src.slice(0, m.index).split("\n").length;
      dead.push({ file: path.relative(ROOT, file), line, link: full });
    }
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
console.log(`\n=== Dead internal-link audit ===`);
console.log(`Types validated against dist/: ${availableTypes.join(", ")}`);
console.log(`Source files scanned: ${files.length}`);
if (dead.length === 0) {
  console.log(`\n✅ No dead internal links found.\n`);
  process.exit(0);
}
console.error(`\n❌ ${dead.length} dead internal link(s) — target slug missing from dist/:\n`);
for (const d of dead) {
  console.error(`  ${d.file}:${d.line}  →  ${d.link}`);
}
console.error(
  `\nFix each: repoint to a real slug (verify the target 200s), or remove the link.\n` +
  `Remember: /rutas/ is city×festival ONLY — never city↔city or city↔venue.\n`,
);
process.exit(1);

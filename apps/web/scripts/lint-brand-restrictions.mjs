#!/usr/bin/env node
/**
 * lint-brand-restrictions.mjs
 *
 * Enforces the brand-restriction rule in CLAUDE.md: the disabled competitor
 * brand must NEVER appear in product-visible content. This script scans:
 *   - apps/web/src/**\/*.{ts,tsx,md}
 *   - apps/web/public/llms.txt
 *
 * Exits 1 on any non-whitelisted match. Output: file:line:content.
 *
 * Whitelist mechanisms (so legitimate technical refs don't block CI):
 *   1. Line-level: any line containing "// ALLOWED_BRAND_MENTION:" or
 *      "// LEGACY:" is skipped.
 *   2. File-level: any file whose first 30 lines contain the marker
 *      "ALLOWED_BRAND_MENTIONS_FILE" (without leading slash chars) is skipped.
 *   3. The lint script itself is always whitelisted (the regex below references
 *      the brand by design, so it would self-trigger otherwise).
 *
 * Run manually:
 *   node apps/web/scripts/lint-brand-restrictions.mjs
 *
 * Add to package.json:
 *   "lint:brand": "node scripts/lint-brand-restrictions.mjs"
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(webRoot, "..", "..");

// ── Patterns ────────────────────────────────────────────────────────────────
// Match the prohibited brand (case-insensitive) in three common renderings.
// Word-boundary anchored so we don't flag unrelated substrings.
const BANNED = [
  /\bblablacar\b/i,
  /\bbla\s*bla\s*car\b/i,
  /\bbla-bla-car\b/i,
];

// Line-level whitelist markers (case-insensitive).
const LINE_WHITELIST = /\/\/\s*(ALLOWED_BRAND_MENTION|LEGACY):/i;

// File-level whitelist marker (must appear in first 30 lines of the file).
const FILE_WHITELIST = /ALLOWED_BRAND_MENTIONS_FILE/;

// ── Targets ─────────────────────────────────────────────────────────────────
const TARGETS = [
  { root: path.join(webRoot, "src"), exts: new Set([".ts", ".tsx", ".md"]) },
  { root: path.join(webRoot, "public", "llms.txt"), exts: null /* single file */ },
];

// Files to always skip (the lint script must not lint itself; it carries the
// brand string in its own regex by necessity).
const ALWAYS_SKIP = new Set([
  path.normalize(__filename),
]);

// ── Walker ──────────────────────────────────────────────────────────────────
function walk(dir, exts, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return;
    throw err;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      // Skip dev-only folders defensively.
      if (ent.name === "node_modules" || ent.name === "dist" || ent.name === "dist-ssr") continue;
      walk(full, exts, out);
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase();
      if (exts.has(ext)) out.push(full);
    }
  }
}

const files = [];
for (const t of TARGETS) {
  if (t.exts === null) {
    if (fs.existsSync(t.root)) files.push(t.root);
  } else {
    walk(t.root, t.exts, files);
  }
}

// ── Scan ────────────────────────────────────────────────────────────────────
let totalMatches = 0;
let totalWhitelisted = 0;
const findings = [];

for (const file of files) {
  if (ALWAYS_SKIP.has(path.normalize(file))) continue;
  let content;
  try {
    content = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }

  const lines = content.split(/\r?\n/);

  // File-level whitelist check on first 30 lines.
  const headerSlice = lines.slice(0, 30).join("\n");
  if (FILE_WHITELIST.test(headerSlice)) {
    // Count whitelisted matches for reporting transparency.
    for (const line of lines) {
      if (BANNED.some((re) => re.test(line))) totalWhitelisted++;
    }
    continue;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!BANNED.some((re) => re.test(line))) continue;
    if (LINE_WHITELIST.test(line)) {
      totalWhitelisted++;
      continue;
    }
    totalMatches++;
    findings.push({
      file: path.relative(repoRoot, file),
      line: i + 1,
      content: line.trim().slice(0, 200),
    });
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
if (findings.length === 0) {
  console.log(
    `[lint:brand] PASS — scanned ${files.length} file(s). ` +
      `0 prohibited brand mentions. ${totalWhitelisted} whitelisted reference(s) skipped.`,
  );
  process.exit(0);
}

console.error(`[lint:brand] FAIL — ${findings.length} prohibited brand mention(s) found:`);
console.error("");
for (const f of findings) {
  console.error(`  ${f.file}:${f.line}:${f.content}`);
}
console.error("");
console.error(
  "Fix: replace with 'otras plataformas de carpooling' or 'plataformas de carpooling generalistas'.\n" +
    "If the mention is legitimately required (e.g. legacy migration code, lint regex itself),\n" +
    "add '// ALLOWED_BRAND_MENTION: <reason>' or '// LEGACY: <reason>' to that exact line,\n" +
    "or 'ALLOWED_BRAND_MENTIONS_FILE' in the first 30 lines of the file.\n" +
    "See CLAUDE.md > 'Brand Restrictions' for policy.",
);
process.exit(1);

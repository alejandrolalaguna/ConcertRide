#!/usr/bin/env node
/**
 * Validates the build-generated agent files in dist/ (written by
 * prerender.mjs → markdown-artifacts.mjs):
 *   1. llms.txt follows llmstxt.org (H1, blockquote summary, H2 link sections)
 *      and every link it or ai.txt contains resolves (a `.md` link to a page in
 *      dist/_md/catalog.json, anything else to a prerendered page or asset).
 *   2. ai.txt has the required ai-txt fields (H1, Website:, Permissions,
 *      Restrictions).
 *   3. None of the three files carries a traction claim or the disabled
 *      competitor brand (CLAUDE.md).
 *   4. Site-wide rendered link check: every internal link in the <main> of
 *      every page (read from the markdown packs) points at a page that exists.
 *      Unlike audit-dead-internal-links (source literals), this sees links
 *      built at render time — it caught `/festivales/sonorama`, `/buscar`…
 * Run after `npm run build:web`.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const distDir = path.join(webRoot, "dist");
const SITE = "https://concertride.me";

const errors = [];
const read = (f) => fs.readFile(path.join(distDir, f), "utf8");
const exists = (p) => fs.access(p).then(() => true, () => false);

// Same phrasing CLAUDE.md "Traction Claims" bans, plus the disabled brand.
const FORBIDDEN = [
  /\b\d[\d.,]*\+?\s*(viajeros|usuarios|fans|pasajeros|conductores)\s+(registrad|activ|verificad)/i,
  /\+\s?\d[\d.,]*\s*(fans|viajeros|usuarios)/i,
  /\b\d{1,3}(?:[.,]\d{3})+\s*\+?\s*(viajeros|usuarios|pasajeros|travellers|viatgers|viajes publicados|viajes realizados)/i,
  /usuarios uni[eé]ndose/i,
  /bla\s*bla\s*car/i,
];

const { md } = await import(pathToFileURL(path.join(webRoot, "dist-ssr", "entry-server.js")).href);
const catalog = JSON.parse(await read("_md/catalog.json"));
const mdPaths = new Set(catalog.pages.map((p) => p.path));
const skipped = md.MD_SKIPPED.map((s) => new RegExp(`^${s.path.replace(/:[^/]+/g, "[^/]+").replace(/\*/g, "$^")}$`));

const htmlPaths = new Set();
async function walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full);
    else if (e.name === "index.html") {
      const rel = "/" + path.relative(distDir, path.dirname(full)).replace(/\\/g, "/");
      htmlPaths.add(rel === "/" ? "/" : rel.replace(/\/$/, ""));
    }
  }
}
await walk(distDir);

function normalise(url) {
  const u = new URL(url.replace(/[.,;:]+$/, ""));
  return decodeURIComponent(u.pathname).replace(/\/+$/, "") || "/";
}

/** null when `p` resolves; otherwise the reason it does not. */
async function deadReason(p) {
  if (p.startsWith("/api/") || p.startsWith("/.well-known/")) return null;
  if (/\.[a-z0-9]{2,5}$/i.test(p)) {
    if (p.endsWith(".md")) {
      const base = p === "/index.md" ? "/" : p.slice(0, -3);
      return mdPaths.has(base) || md.resolveMdRoute(base)?.source === "concert-db" ? null : "no markdown version";
    }
    return (await exists(path.join(distDir, p))) ? null : "missing asset";
  }
  if (mdPaths.has(p) || htmlPaths.has(p)) return null;
  const route = md.resolveMdRoute(p);
  if (route?.source === "concert-db") return null;
  if (route) return "content URL that was not generated (wrong slug?)";
  if (skipped.some((re) => re.test(p))) return null; // real SPA-only route (/publish, /login…)
  return "unknown route (404)";
}

function checkForbidden(name, content) {
  content.split("\n").forEach((line, i) => {
    for (const re of FORBIDDEN) {
      if (re.test(line)) errors.push(`${name}:${i + 1} forbidden claim/brand → ${line.trim().slice(0, 120)}`);
    }
  });
}

const SITE_URL_RE = /https:\/\/concertride\.me\/[^\s)>"\]`,]*/g;

// ── 1–3: agent files ────────────────────────────────────────────────────────
const llms = await read("llms.txt");
if (!/^# .+/.test(llms)) errors.push("llms.txt: must start with an H1");
if (!/^> .+/m.test(llms)) errors.push("llms.txt: missing blockquote summary");
if ((llms.match(/^## /gm) ?? []).length < 3) errors.push("llms.txt: expected ≥3 H2 link sections");

for (const [name, content, strict] of [
  ["llms.txt", llms, true],
  ["ai.txt", await read("ai.txt"), true],
  ["llms-full.txt", await read("llms-full.txt"), false],
]) {
  checkForbidden(name, content);
  const urls = new Set(content.match(SITE_URL_RE) ?? []);
  if (strict) {
    for (const url of urls) {
      if (/[{}<]|%7B/.test(url)) continue; // documented URL templates
      const reason = await deadReason(normalise(url));
      if (reason) errors.push(`${name}: ${url} → ${reason}`);
    }
  }
  console.log(`✓ ${name}: ${content.length} chars, ${urls.size} unique site URLs`);
}

const ai = await read("ai.txt");
for (const req of [/^# (?!ai\.txt).+/m, /^Website: https:\/\//m, /^## Permissions\n- /m, /^## Restrictions\n- /m]) {
  if (!req.test(ai)) errors.push(`ai.txt: missing required element ${req}`);
}

// ── 4: rendered internal links of every page ───────────────────────────────
const dead = new Map(); // target → { reason, from: Set }
const packDir = path.join(distDir, "_md", "p");
let linkCount = 0;
for (const f of await fs.readdir(packDir)) {
  const pack = JSON.parse(await fs.readFile(path.join(packDir, f), "utf8"));
  for (const [from, [markdown]] of Object.entries(pack)) {
    for (const m of markdown.matchAll(/\]\((https:\/\/concertride\.me\/[^)\s]*)\)/g)) {
      linkCount++;
      const target = normalise(m[1]);
      if (dead.has(target)) {
        dead.get(target).from.add(from);
        continue;
      }
      const reason = await deadReason(target);
      if (reason) dead.set(target, { reason, from: new Set([from]) });
    }
  }
}
for (const [target, { reason, from }] of dead) {
  errors.push(`dead internal link ${target} (${reason}) — on ${from.size} page(s), e.g. ${[...from][0]}`);
}
console.log(`✓ rendered links: ${linkCount} internal links across ${mdPaths.size} pages, ${dead.size} dead target(s)`);

if (errors.length) {
  console.error(`\n❌ ${errors.length} error(s):`);
  for (const e of errors.slice(0, 60)) console.error(`   ✗ ${e}`);
  process.exit(1);
}
console.log(`\n✅ Agent files valid (${mdPaths.size} pages in the markdown catalog). Post-deploy: curl -sI ${SITE}/index.md`);

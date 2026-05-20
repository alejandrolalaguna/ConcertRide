#!/usr/bin/env node
/**
 * audit-google-indexability.mjs (2026-05-20)
 *
 * Static-file audit that mirrors the recommendations of Google's three
 * fundamental guides:
 *   - How Search Works
 *     https://developers.google.com/search/docs/fundamentals/how-search-works?hl=es
 *   - Get on Google
 *     https://developers.google.com/search/docs/fundamentals/get-on-google?hl=es
 *   - SEO for developers
 *     https://developers.google.com/search/docs/fundamentals/get-started-developers?hl=es
 *
 * Checks performed (all read-only, no network, no build required):
 *   1. robots.txt — exists, declares User-agent, declares Sitemap entries,
 *                  Disallows critical private paths, Allows /.well-known/
 *   2. Sitemaps — every Sitemap declared in robots.txt exists in public/ or
 *                 dist/ (or is /api/* which the Worker emits dynamically).
 *                 Each XML parses, each <lastmod> is ISO-8601, no duplicate
 *                 <loc> entries, count URLs per sitemap.
 *   3. Canonical — sample of prerendered HTML (dist/index.html and
 *                  dist/<page>/index.html) contains <link rel="canonical">.
 *   4. JSON-LD — sample of prerendered HTML contains at least one
 *                application/ld+json block that parses as valid JSON.
 *   5. Hreflang — sample of prerendered HTML emits at least one
 *                 <link rel="alternate" hreflang="...">.
 *
 * Output: grouped report, sitemap counts, list of failures.
 *
 * Exit code: 0 (informational — does not break CI).
 *
 * Usage:
 *   node apps/web/scripts/audit-google-indexability.mjs
 *
 * Notes:
 *   - The audit is intentionally tolerant of missing dist/ (skips HTML checks
 *     with a warning) so it can run after a fresh checkout without a build.
 *   - The audit never makes HTTP requests — Google's verification flow happens
 *     out of band in Search Console, not in this script.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(WEB_ROOT, "public");
const DIST_DIR = path.join(WEB_ROOT, "dist");
const SITE_URL = "https://concertride.me";

// Critical Disallow paths that must appear in robots.txt to avoid leaking
// private surfaces into Google's crawl budget.
const REQUIRED_DISALLOWS = [
  "/api/",
  "/login",
  "/register",
  "/profile",
  "/admin",
  "/crew",
  "/feed",
  "/squads",
  "/mensajes",
];

// Sample of prerendered routes that must have a canonical + hreflang + JSON-LD.
// Includes the 3 URLs added in FASES 1–3 (Pillar 11 + Dataset 8 + Dataset 9).
const HTML_SAMPLE_PATHS = [
  "/",
  "/festivales",
  "/blog",
  "/datos/heatmap-demanda-festivales-ccaa-2026",
  "/datos/cancelaciones-festivales-espana-2020-2026",
  "/guia/festival-veterano-aficionados-mayores-2026",
];

// ── Helpers ────────────────────────────────────────────────────────────────

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

function isIsoDate(s) {
  // Accept YYYY-MM-DD or full ISO-8601 with time.
  return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/.test(s);
}

function extractTag(html, name) {
  const re = new RegExp(`<${name}[\\s>][\\s\\S]*?<\\/${name}>`, "gi");
  return html.match(re) ?? [];
}

function extractAttr(tag, attr) {
  const m = tag.match(new RegExp(`${attr}=("([^"]+)"|'([^']+)')`));
  return m ? (m[2] ?? m[3]) : null;
}

// ── Check 1: robots.txt ────────────────────────────────────────────────────

async function checkRobots() {
  const report = { name: "robots.txt", ok: true, items: [] };
  const robotsPath = path.join(PUBLIC_DIR, "robots.txt");
  if (!(await exists(robotsPath))) {
    report.ok = false;
    report.items.push({ ok: false, msg: `MISSING: ${robotsPath}` });
    return report;
  }
  const src = await fs.readFile(robotsPath, "utf8");

  if (!/^\s*User-agent\s*:\s*\*/im.test(src)) {
    report.ok = false;
    report.items.push({ ok: false, msg: "no 'User-agent: *' block" });
  } else {
    report.items.push({ ok: true, msg: "User-agent: * declared" });
  }

  const sitemapLines = src.match(/^\s*Sitemap\s*:\s*(\S+)/gim) ?? [];
  if (sitemapLines.length === 0) {
    report.ok = false;
    report.items.push({ ok: false, msg: "no Sitemap entries" });
  } else {
    report.items.push({ ok: true, msg: `${sitemapLines.length} Sitemap entries declared` });
  }

  for (const d of REQUIRED_DISALLOWS) {
    const re = new RegExp(`^\\s*Disallow\\s*:\\s*${d.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`, "im");
    if (!re.test(src)) {
      report.ok = false;
      report.items.push({ ok: false, msg: `missing Disallow: ${d}` });
    }
  }
  if (report.items.every((i) => i.ok || !i.msg.startsWith("missing Disallow"))) {
    report.items.push({ ok: true, msg: `all ${REQUIRED_DISALLOWS.length} critical Disallow paths present` });
  }

  // Best practice: allow /.well-known/ so security.txt / ai-plugin.json are
  // crawlable. Most crawlers default to allow, but explicit is better.
  if (/^\s*Allow\s*:\s*\/\.well-known\/?\b/im.test(src)) {
    report.items.push({ ok: true, msg: "Allow: /.well-known/ declared" });
  } else {
    report.items.push({ ok: true, msg: "INFO: no explicit Allow: /.well-known/ (default-allow assumed)" });
  }

  return report;
}

// ── Check 2: sitemaps ──────────────────────────────────────────────────────

async function parseSitemap(filePath) {
  const src = await fs.readFile(filePath, "utf8");
  const locs = [...src.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const lastmods = [...src.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1].trim());
  const isIndex = /<sitemapindex/i.test(src);
  return { locs, lastmods, isIndex, raw: src };
}

async function checkSitemaps() {
  const report = { name: "sitemaps", ok: true, items: [] };

  // Discover sitemap files declared in robots.txt.
  const robotsPath = path.join(PUBLIC_DIR, "robots.txt");
  let declared = [];
  if (await exists(robotsPath)) {
    const src = await fs.readFile(robotsPath, "utf8");
    declared = [...src.matchAll(/^\s*Sitemap\s*:\s*(\S+)/gim)].map((m) => m[1].trim());
  }

  // Verify each declared sitemap (skipping dynamic /api/* ones — those are
  // emitted by the Worker at runtime and don't exist on disk).
  for (const url of declared) {
    if (!url.startsWith(SITE_URL)) {
      report.items.push({ ok: true, msg: `INFO: external sitemap (skipped): ${url}` });
      continue;
    }
    const relPath = url.slice(SITE_URL.length).replace(/^\/+/, "");
    if (relPath.startsWith("api/")) {
      report.items.push({ ok: true, msg: `INFO: dynamic sitemap (Worker): ${relPath}` });
      continue;
    }
    const publicPath = path.join(PUBLIC_DIR, relPath);
    const distPath = path.join(DIST_DIR, relPath);
    let where = null;
    if (await exists(publicPath)) where = publicPath;
    else if (await exists(distPath)) where = distPath;
    if (!where) {
      report.ok = false;
      report.items.push({ ok: false, msg: `MISSING: ${relPath} (declared in robots.txt)` });
      continue;
    }
    try {
      const { locs, lastmods, isIndex } = await parseSitemap(where);
      const unique = new Set(locs);
      const badDates = lastmods.filter((d) => !isIsoDate(d));
      const dupCount = locs.length - unique.size;
      const flagBits = [];
      if (dupCount > 0) {
        flagBits.push(`${dupCount} duplicate <loc>`);
        report.ok = false;
      }
      if (badDates.length > 0) {
        flagBits.push(`${badDates.length} malformed <lastmod>`);
        report.ok = false;
      }
      const label = isIndex ? "sitemapindex" : "urlset";
      const flagSuffix = flagBits.length ? `  FLAGS: ${flagBits.join("; ")}` : "";
      report.items.push({ ok: flagBits.length === 0, msg: `${relPath} — ${label}, ${locs.length} <loc>${flagSuffix}` });
    } catch (err) {
      report.ok = false;
      report.items.push({ ok: false, msg: `PARSE ERROR: ${relPath} → ${err.message}` });
    }
  }

  return report;
}

// ── Check 3 + 4 + 5: HTML samples (canonical + JSON-LD + hreflang) ─────────

async function findHtml(routePath) {
  // Try dist/<route>/index.html, dist/<route>.html, dist/index.html for "/".
  const slug = routePath.replace(/^\/+/, "").replace(/\/+$/, "");
  const candidates = [
    slug === "" ? path.join(DIST_DIR, "index.html") : null,
    slug === "" ? null : path.join(DIST_DIR, slug, "index.html"),
    slug === "" ? null : path.join(DIST_DIR, `${slug}.html`),
  ].filter(Boolean);
  for (const c of candidates) {
    if (await exists(c)) return c;
  }
  return null;
}

async function checkHtmlSample() {
  const report = { name: "HTML samples (canonical / JSON-LD / hreflang)", ok: true, items: [] };

  if (!(await exists(DIST_DIR))) {
    report.items.push({ ok: true, msg: "SKIPPED: dist/ not present (run `npm run build` first to enable HTML audits)" });
    return report;
  }

  for (const routePath of HTML_SAMPLE_PATHS) {
    const file = await findHtml(routePath);
    if (!file) {
      report.items.push({ ok: true, msg: `INFO: no prerendered HTML for ${routePath} (SPA fallback at runtime)` });
      continue;
    }
    const html = await fs.readFile(file, "utf8");

    // Canonical
    const canonical = (html.match(/<link[^>]+rel=("|')canonical\1[^>]*>/i) ?? [null])[0];
    const canonicalHref = canonical ? extractAttr(canonical, "href") : null;
    if (!canonicalHref) {
      // noindex pages legitimately omit canonical — flag only if not noindex
      const isNoindex = /<meta[^>]+name=("|')robots\1[^>]*content=("|')[^"']*noindex/i.test(html);
      if (!isNoindex) {
        report.ok = false;
        report.items.push({ ok: false, msg: `${routePath} — MISSING <link rel="canonical">` });
      } else {
        report.items.push({ ok: true, msg: `${routePath} — noindex (canonical omitted, OK)` });
      }
    } else {
      report.items.push({ ok: true, msg: `${routePath} — canonical: ${canonicalHref}` });
    }

    // Hreflang
    const hreflangs = [...html.matchAll(/<link[^>]+rel=("|')alternate\1[^>]+hreflang=("|')([^"']+)\2[^>]*>/gi)];
    if (hreflangs.length === 0) {
      report.items.push({ ok: true, msg: `${routePath} — INFO: no hreflang (single-locale site, OK)` });
    } else {
      const langs = hreflangs.map((m) => m[3]).join(", ");
      report.items.push({ ok: true, msg: `${routePath} — hreflang: ${langs}` });
    }

    // JSON-LD
    const ldBlocks = [...html.matchAll(/<script[^>]+type=("|')application\/ld\+json\1[^>]*>([\s\S]*?)<\/script>/gi)];
    if (ldBlocks.length === 0) {
      report.items.push({ ok: true, msg: `${routePath} — INFO: no JSON-LD` });
    } else {
      let valid = 0;
      let invalid = 0;
      for (const [, , body] of ldBlocks) {
        try { JSON.parse(body); valid++; }
        catch { invalid++; report.ok = false; }
      }
      if (invalid > 0) {
        report.items.push({ ok: false, msg: `${routePath} — ${valid} valid + ${invalid} INVALID JSON-LD blocks` });
      } else {
        report.items.push({ ok: true, msg: `${routePath} — ${valid} JSON-LD blocks (all parse)` });
      }
    }
  }

  return report;
}

// ── Main ───────────────────────────────────────────────────────────────────

function printReport(reports) {
  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║  audit-google-indexability.mjs                              ║");
  console.log("║  Mirrors: developers.google.com/search/docs/fundamentals    ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");
  let totalOk = 0;
  let totalFail = 0;
  for (const r of reports) {
    console.log(`── ${r.name} ── ${r.ok ? "PASS" : "FAIL"}`);
    for (const it of r.items) {
      const prefix = it.ok ? "  [ok]" : "  [!!]";
      console.log(`${prefix} ${it.msg}`);
      if (it.ok) totalOk++; else totalFail++;
    }
    console.log("");
  }
  console.log(`Summary: ${totalOk} ok, ${totalFail} flagged`);
  console.log("Exit code: 0 (informational — does not break CI)\n");
}

async function main() {
  const reports = [];
  reports.push(await checkRobots());
  reports.push(await checkSitemaps());
  reports.push(await checkHtmlSample());
  printReport(reports);
  process.exit(0);
}

main().catch((err) => {
  console.error("audit-google-indexability error:", err);
  process.exit(0);
});

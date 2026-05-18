#!/usr/bin/env node
/**
 * audit-cwv-static.mjs
 *
 * Static Core Web Vitals audit. Parses prerendered HTML in dist/ and flags
 * patterns known to harm LCP, INP, or CLS. This is NOT a runtime Lighthouse
 * replacement — it cannot measure actual paint timings — but it catches
 * structural mistakes (no width/height on hero img, render-blocking CSS, etc.)
 * that account for the vast majority of CWV regressions in static SPAs.
 *
 * USAGE
 *   node scripts/audit-cwv-static.mjs                 # audit + write report
 *   node scripts/audit-cwv-static.mjs --verbose       # log every check
 *
 * SAMPLING
 *   One representative HTML per page type (8 pages total), so the run is fast
 *   (<1 s) and reproducible. Edit SAMPLE_PAGES to add coverage.
 *
 * OUTPUT
 *   stdout summary + scripts/reports/cwv-static-YYYY-MM-DD.json
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const REPORTS = path.join(__dirname, "reports");
const VERBOSE = process.argv.includes("--verbose");

/** One representative page per type. Edit if dist/ paths drift. */
const SAMPLE_PAGES = [
  { type: "home", path: "index.html" },
  { type: "festival", path: "festivales/mad-cool/index.html" },
  { type: "route", path: "rutas/madrid-mad-cool/index.html" },
  { type: "blog", path: "blog/alternativa-carpooling-festivales-espana/index.html" },
  { type: "artist", path: "artistas/aitana/index.html" },
  { type: "venue", path: "recintos/bilbao-arena/index.html" },
  { type: "city", path: "conciertos/madrid/index.html" },
  { type: "dataset", path: "datos/index.html" },
  { type: "pillar", path: "guia-transporte-festivales/index.html" },
];

/* -------------------------------------------------------------------------- */
/* Pattern detectors — each returns { count, samples?, risk }                  */
/* -------------------------------------------------------------------------- */

/**
 * <head> region (everything from <head> up to first </head>).
 */
function getHead(html) {
  const m = html.match(/<head[\s\S]*?<\/head>/i);
  return m ? m[0] : "";
}

/**
 * Body region for above-the-fold parsing (first 25 kB after </head>).
 * LCP elements live early in the DOM, so sampling the head of <body> catches them.
 */
function getAboveFold(html) {
  const endHead = html.search(/<\/head>/i);
  if (endHead < 0) return html.slice(0, 25_000);
  return html.slice(endHead, endHead + 25_000);
}

/** Extracts all <img ...> tags from a region. */
function extractImgs(region) {
  return [...region.matchAll(/<img\s+[^>]*>/gi)].map((m) => m[0]);
}

/** Whether an <img> tag has both `width` and `height` attributes. */
function hasDims(tag) {
  return /\bwidth\s*=/.test(tag) && /\bheight\s*=/.test(tag);
}

/** Whether an <img> tag has `loading="lazy"`. */
function isLazy(tag) {
  return /\bloading\s*=\s*["']?lazy/i.test(tag);
}

/** Whether an <img> tag has `loading="eager"` or `fetchpriority="high"`. */
function isEagerHero(tag) {
  return (
    /\bloading\s*=\s*["']?eager/i.test(tag) ||
    /\bfetchpriority\s*=\s*["']?high/i.test(tag)
  );
}

/** LCP: imgs without dims (any region). */
function auditImgDims(html) {
  const imgs = extractImgs(html);
  const bad = imgs.filter((t) => !hasDims(t));
  return {
    count: bad.length,
    total: imgs.length,
    samples: bad.slice(0, 3),
    risk: bad.length > 0 ? "CLS+LCP" : null,
  };
}

/** LCP: above-the-fold imgs that ARE lazy (the first 2 should be eager). */
function auditLazyAboveFold(html) {
  const region = getAboveFold(html);
  const imgs = extractImgs(region);
  const firstTwo = imgs.slice(0, 2);
  const wrong = firstTwo.filter((t) => isLazy(t) && !isEagerHero(t));
  return {
    count: wrong.length,
    total: firstTwo.length,
    samples: wrong.slice(0, 2),
    risk: wrong.length > 0 ? "LCP" : null,
  };
}

/** LCP: imgs after fold (index >= 2) that are NOT lazy. */
function auditEagerBelowFold(html) {
  const imgs = extractImgs(html);
  // Treat imgs beyond first 2 as below-fold (rough heuristic).
  const belowFold = imgs.slice(2);
  const wrong = belowFold.filter((t) => !isLazy(t) && !isEagerHero(t));
  return {
    count: wrong.length,
    total: belowFold.length,
    samples: wrong.slice(0, 2),
    risk: wrong.length > 0 ? "LCP" : null,
  };
}

/** LCP: self-hosted font files referenced via @font-face but NOT preloaded. */
function auditFontPreload(html) {
  const head = getHead(html);
  // Look for any <link rel="preload" as="font">
  const preloadCount = (head.match(/<link[^>]+rel=["']preload["'][^>]+as=["']font["']/gi) || [])
    .length;
  // Look for <link rel="stylesheet"> URLs hinting at @font-face (e.g., /fonts/, woff2 in code)
  const stylesheetCount = (head.match(/<link[^>]+rel=["']stylesheet["']/gi) || []).length;
  // If there are stylesheets AND zero font preloads, flag as MEDIUM risk.
  const risk = stylesheetCount > 0 && preloadCount === 0 ? "LCP" : null;
  return { preloadCount, stylesheetCount, risk };
}

/** LCP: render-blocking <link rel="stylesheet"> without media="print" defer pattern.
 *
 * Counts ONLY links that actually block first paint. Excludes:
 *  - <link rel="preload" as="style"> with onload swap (Sprint 6 / beasties pattern)
 *  - <noscript><link rel="stylesheet"></noscript> fallbacks (only loaded with JS off)
 *  - rel="stylesheet" tokens that appear inside an onload="…" attribute value
 *    (substring of a swap handler like onload="this.rel='stylesheet'")
 *  - media="print" deferred pattern
 */
function auditRenderBlockingCss(html) {
  let head = getHead(html);
  // Strip <noscript>…</noscript> blocks — these never block paint with JS enabled.
  head = head.replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
  const allLinks = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);
  // Keep only those whose rel ATTRIBUTE (not any substring) equals "stylesheet".
  // We isolate the rel attribute and check its exact value.
  const stylesheetLinks = allLinks.filter((l) => {
    const m = l.match(/\brel\s*=\s*(["'])([^"']+)\1/i);
    if (!m) return false;
    return m[2].trim().toLowerCase() === "stylesheet";
  });
  // Defer patterns considered non-blocking:
  //  - media="print" onload="this.media='all'"
  //  - rel="preload" as="style" + onload swap (handled above by rel filter)
  const deferred = stylesheetLinks.filter((l) => /\bmedia\s*=\s*["']print["']/i.test(l));
  const blocking = stylesheetLinks.length - deferred.length;
  return {
    count: blocking,
    total: stylesheetLinks.length,
    samples: stylesheetLinks.filter((l) => !/\bmedia\s*=\s*["']print["']/i.test(l)).slice(0, 3),
    risk: blocking > 2 ? "LCP" : null,
  };
}

/** INP (limited static): inline onClick handlers + total JS preloads. */
function auditInteractivityWeight(html) {
  const inlineHandlers = (html.match(/\son[A-Z][a-z]+\s*=/g) || []).length;
  const head = getHead(html);
  const modulePreloads = (head.match(/<link[^>]+rel=["']modulepreload["']/gi) || []).length;
  const scriptTags = (html.match(/<script\b/gi) || []).length;
  return {
    inlineHandlers,
    modulePreloads,
    scriptTags,
    risk: modulePreloads > 30 || scriptTags > 8 ? "INP" : null,
  };
}

/** CLS: <iframe> without explicit dims. Also <video>/<embed>. */
function auditMediaDims(html) {
  const tags = [
    ...html.matchAll(/<iframe\s+[^>]*>/gi),
    ...html.matchAll(/<video\s+[^>]*>/gi),
    ...html.matchAll(/<embed\s+[^>]*>/gi),
  ].map((m) => m[0]);
  const bad = tags.filter((t) => !hasDims(t));
  return {
    count: bad.length,
    total: tags.length,
    samples: bad.slice(0, 2),
    risk: bad.length > 0 ? "CLS" : null,
  };
}

/** File size in kB. Pages much over 100 kB tend to have lower CWV. */
function fileSizeKb(filePath) {
  try {
    return Math.round((statSync(filePath).size / 1024) * 10) / 10;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Audit driver                                                                */
/* -------------------------------------------------------------------------- */

async function auditPage(sample) {
  const filePath = path.join(DIST, sample.path);
  if (!existsSync(filePath)) {
    return { ...sample, error: "FILE_NOT_FOUND", filePath };
  }
  const html = await readFile(filePath, "utf-8");
  const sizeKb = fileSizeKb(filePath);
  const findings = {
    imgDims: auditImgDims(html),
    lazyAboveFold: auditLazyAboveFold(html),
    eagerBelowFold: auditEagerBelowFold(html),
    fontPreload: auditFontPreload(html),
    renderBlockingCss: auditRenderBlockingCss(html),
    interactivityWeight: auditInteractivityWeight(html),
    mediaDims: auditMediaDims(html),
  };

  // Count how many risks fired
  const risks = Object.entries(findings)
    .filter(([, v]) => v.risk)
    .map(([k, v]) => ({ check: k, risk: v.risk, count: v.count ?? 0 }));

  return { ...sample, filePath, sizeKb, findings, risks };
}

function summarize(results) {
  // Aggregate counts of each problem across all pages.
  const buckets = {
    "imgDims (CLS+LCP)": 0,
    "lazyAboveFold (LCP)": 0,
    "eagerBelowFold (LCP)": 0,
    "fontPreload (LCP)": 0,
    "renderBlockingCss (LCP)": 0,
    "interactivityWeight (INP)": 0,
    "mediaDims (CLS)": 0,
  };
  for (const r of results) {
    if (r.error) continue;
    if (r.findings.imgDims.count > 0) buckets["imgDims (CLS+LCP)"] += r.findings.imgDims.count;
    if (r.findings.lazyAboveFold.count > 0) buckets["lazyAboveFold (LCP)"] += r.findings.lazyAboveFold.count;
    if (r.findings.eagerBelowFold.count > 0) buckets["eagerBelowFold (LCP)"] += r.findings.eagerBelowFold.count;
    if (r.findings.fontPreload.risk) buckets["fontPreload (LCP)"] += 1;
    if (r.findings.renderBlockingCss.count > 2) buckets["renderBlockingCss (LCP)"] += r.findings.renderBlockingCss.count;
    if (r.findings.interactivityWeight.risk) buckets["interactivityWeight (INP)"] += 1;
    if (r.findings.mediaDims.count > 0) buckets["mediaDims (CLS)"] += r.findings.mediaDims.count;
  }

  // Build top-N recommendations sorted by aggregate count.
  const sorted = Object.entries(buckets)
    .filter(([, n]) => n > 0)
    .sort(([, a], [, b]) => b - a);

  const recommendations = sorted.slice(0, 5).map(([check, count], i) => {
    const rec = RECOMMENDATIONS[check.split(" ")[0]];
    return {
      rank: i + 1,
      check,
      occurrences: count,
      action: rec ?? "Inspect manually.",
    };
  });

  return { buckets, recommendations };
}

const RECOMMENDATIONS = {
  imgDims:
    "Add explicit width/height attributes to all <img> tags (or use CSS aspect-ratio) — eliminates layout shift and lets the browser reserve space for the LCP element.",
  lazyAboveFold:
    "Hero/above-fold <img> must use loading=\"eager\" and fetchpriority=\"high\". Lazy-loading the LCP element is the #1 cause of poor LCP scores.",
  eagerBelowFold:
    "Below-fold <img> tags should use loading=\"lazy\" so they don't compete with the LCP element for bandwidth.",
  fontPreload:
    "Add <link rel=\"preload\" as=\"font\" type=\"font/woff2\" crossorigin> for the primary display font (Archivo Black) and body font (Inter). Saves ~200–400 ms LCP on slow networks.",
  renderBlockingCss:
    "Inline critical CSS in <head> and defer non-critical with media=\"print\" onload=\"this.media='all'\". More than 2 blocking stylesheets predicts LCP > 2.5 s on 4G.",
  interactivityWeight:
    "Audit the JS bundle: too many modulepreloads or script tags inflate INP. Code-split routes more aggressively and lazy-load below-fold widgets.",
  mediaDims:
    "Add explicit width/height to <iframe>/<video>/<embed>. Otherwise the browser cannot reserve space → layout shift on load.",
};

async function main() {
  if (!existsSync(DIST)) {
    console.error(`audit-cwv: dist/ not found at ${DIST}. Run \`npm run build\` first.`);
    process.exit(2);
  }

  console.log(`audit-cwv: auditing ${SAMPLE_PAGES.length} representative pages...`);
  const results = [];
  for (const sample of SAMPLE_PAGES) {
    const r = await auditPage(sample);
    results.push(r);
    if (r.error) {
      console.warn(`  [${sample.type}] ${sample.path} — ${r.error}`);
      continue;
    }
    const tags = r.risks.length === 0 ? "OK" : r.risks.map((x) => x.risk).join(",");
    console.log(`  [${sample.type.padEnd(8)}] ${sample.path}  ${r.sizeKb} kB  ${tags}`);
    if (VERBOSE) {
      for (const [check, val] of Object.entries(r.findings)) {
        if (val.risk) console.log(`     - ${check}: ${val.risk} (count=${val.count ?? "n/a"})`);
      }
    }
  }

  const summary = summarize(results);

  console.log("\naudit-cwv: aggregate findings");
  for (const [bucket, n] of Object.entries(summary.buckets)) {
    if (n > 0) console.log(`  ${bucket}: ${n} occurrences`);
  }

  console.log("\naudit-cwv: top recommendations");
  if (summary.recommendations.length === 0) {
    console.log("  (no actionable issues across sampled pages)");
  } else {
    for (const rec of summary.recommendations) {
      console.log(`  ${rec.rank}. [${rec.check}] x${rec.occurrences}`);
      console.log(`     → ${rec.action}`);
    }
  }

  await mkdir(REPORTS, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const reportPath = path.join(REPORTS, `cwv-static-${today}.json`);
  await writeFile(
    reportPath,
    JSON.stringify(
      {
        date: today,
        sampleCount: SAMPLE_PAGES.length,
        results,
        summary,
      },
      null,
      2,
    ),
  );

  console.log(`\naudit-cwv: report saved to ${reportPath}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("audit-cwv: unhandled error:", err);
  process.exit(1);
});

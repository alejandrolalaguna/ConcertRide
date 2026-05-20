#!/usr/bin/env node
/**
 * audit-headings-and-alt.mjs
 *
 * Audita .tsx en apps/web/src/{pages,components} contra dos reglas
 * derivadas de Google SEO Starter Guide + WCAG 2.2:
 *
 *   1) Heading hierarchy:
 *        - Cada página debería tener exactamente 1 <h1>
 *          (cuenta agregada; h1 en ramas mutuamente exclusivas como
 *          early-returns de error/404 no se considera violación porque
 *          este script es heurístico — flagged como "info" no como "error").
 *        - No saltos h2 → h4 ni h3 → h5 (consecutivos en el código).
 *
 *   2) Alt text en <img>:
 *        - Toda <img> debe tener atributo alt (vacío o no vacío).
 *        - Si alt="" → debe ir acompañado de aria-hidden="true" o
 *          role="presentation" (decorativa, ok).
 *        - alt="imagen"/"foto"/"picture"/"preview" → warning genérico.
 *
 * Output:
 *   apps/web/scripts/reports/headings-alt-YYYY-MM-DD.json
 *
 * Exit code: SIEMPRE 0 (informativo).
 *
 * Uso:
 *   node apps/web/scripts/audit-headings-and-alt.mjs
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const srcDir = path.join(ROOT, "src");
const reportsDir = path.join(__dirname, "reports");

const TODAY = new Date().toISOString().slice(0, 10);

// ──────────────────────────────────────────────────────────────────
// File walking
// ──────────────────────────────────────────────────────────────────
async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      out.push(full);
    }
  }
  return out;
}

function relPath(p) {
  return path.relative(ROOT, p).replace(/\\/g, "/");
}

// ──────────────────────────────────────────────────────────────────
// Heading audit
// ──────────────────────────────────────────────────────────────────
const H1_REGEX = /<(?:motion\.)?h1\b/g;
const H2_REGEX = /<(?:motion\.)?h2\b/g;
const H3_REGEX = /<(?:motion\.)?h3\b/g;
const H4_REGEX = /<(?:motion\.)?h4\b/g;
const H5_REGEX = /<(?:motion\.)?h5\b/g;
const HEADING_LINE_REGEX = /<(?:motion\.)?h([1-6])\b/g;

function auditHeadings(src) {
  const h1Count = (src.match(H1_REGEX) ?? []).length;
  const h2Count = (src.match(H2_REGEX) ?? []).length;
  const h3Count = (src.match(H3_REGEX) ?? []).length;
  const h4Count = (src.match(H4_REGEX) ?? []).length;
  const h5Count = (src.match(H5_REGEX) ?? []).length;

  // Detect sequential level jumps in source order
  const levels = [];
  let m;
  HEADING_LINE_REGEX.lastIndex = 0;
  while ((m = HEADING_LINE_REGEX.exec(src)) !== null) {
    levels.push(parseInt(m[1], 10));
  }
  const jumps = [];
  for (let i = 1; i < levels.length; i++) {
    const prev = levels[i - 1];
    const curr = levels[i];
    if (curr > prev + 1) {
      jumps.push({ from: prev, to: curr });
    }
  }

  return { h1Count, h2Count, h3Count, h4Count, h5Count, jumps };
}

// ──────────────────────────────────────────────────────────────────
// Img / alt audit
// ──────────────────────────────────────────────────────────────────
// Capture <img ...>...</img> or <img ... /> opening tag attrs
const IMG_TAG_REGEX = /<img\b([^>]*?)\/?>/gs;

const GENERIC_ALT_VALUES = new Set([
  "imagen",
  "foto",
  "picture",
  "image",
  "photo",
  "preview",
  "img",
  "alt",
]);

function auditImgs(src) {
  const issues = [];
  let m;
  IMG_TAG_REGEX.lastIndex = 0;
  while ((m = IMG_TAG_REGEX.exec(src)) !== null) {
    const attrs = m[1];
    const hasAlt = /\balt\s*=/.test(attrs);
    const ariaHidden = /\baria-hidden\s*=\s*["']?true["']?|\baria-hidden\b(?!\s*=\s*["']?false)/.test(attrs);
    const rolePresentation = /\brole\s*=\s*["']presentation["']/.test(attrs);

    if (!hasAlt) {
      issues.push({ kind: "no-alt", attrsPreview: attrs.slice(0, 80).replace(/\s+/g, " ").trim() });
      continue;
    }

    // Extract alt value
    const altMatch = attrs.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/);
    if (!altMatch) continue;
    const altLiteral = altMatch[1] ?? altMatch[2];
    const altIsEmpty = altLiteral === "";

    if (altIsEmpty && !ariaHidden && !rolePresentation) {
      issues.push({ kind: "empty-alt-without-aria-hidden", attrsPreview: attrs.slice(0, 80).replace(/\s+/g, " ").trim() });
      continue;
    }

    if (altLiteral !== undefined && altLiteral !== "" && GENERIC_ALT_VALUES.has(altLiteral.trim().toLowerCase())) {
      issues.push({ kind: "generic-alt", altValue: altLiteral, attrsPreview: attrs.slice(0, 80).replace(/\s+/g, " ").trim() });
    }
  }
  return issues;
}

// ──────────────────────────────────────────────────────────────────
// Run
// ──────────────────────────────────────────────────────────────────
async function main() {
  const targets = [
    path.join(srcDir, "pages"),
    path.join(srcDir, "components"),
  ];
  const allFiles = [];
  for (const t of targets) {
    try {
      allFiles.push(...(await walk(t)));
    } catch {}
  }

  const report = {
    generatedAt: new Date().toISOString(),
    scanned: allFiles.length,
    headings: {
      missingH1: [],
      multipleH1: [],
      levelJumps: [],
    },
    imgs: {
      noAlt: [],
      emptyAltWithoutAriaHidden: [],
      genericAlt: [],
    },
  };

  for (const file of allFiles) {
    const src = await fs.readFile(file, "utf8");
    const rel = relPath(file);

    // Headings — only flag for pages/, components are fragments and may
    // legitimately have 0 h1 (used inside a page).
    const isPage = rel.startsWith("src/pages/");
    const h = auditHeadings(src);
    if (isPage) {
      if (h.h1Count === 0) {
        report.headings.missingH1.push({ file: rel });
      } else if (h.h1Count > 1) {
        report.headings.multipleH1.push({ file: rel, count: h.h1Count, note: "may be in mutually-exclusive branches" });
      }
    }
    if (h.jumps.length > 0) {
      report.headings.levelJumps.push({ file: rel, jumps: h.jumps });
    }

    // Imgs
    const imgIssues = auditImgs(src);
    for (const issue of imgIssues) {
      if (issue.kind === "no-alt") {
        report.imgs.noAlt.push({ file: rel, attrs: issue.attrsPreview });
      } else if (issue.kind === "empty-alt-without-aria-hidden") {
        report.imgs.emptyAltWithoutAriaHidden.push({ file: rel, attrs: issue.attrsPreview });
      } else if (issue.kind === "generic-alt") {
        report.imgs.genericAlt.push({ file: rel, altValue: issue.altValue, attrs: issue.attrsPreview });
      }
    }
  }

  await fs.mkdir(reportsDir, { recursive: true });
  const outFile = path.join(reportsDir, `headings-alt-${TODAY}.json`);
  await fs.writeFile(outFile, JSON.stringify(report, null, 2), "utf8");

  // Summary to stdout
  console.log(`[audit-headings-and-alt] scanned ${allFiles.length} .tsx files`);
  console.log(`  pages missing <h1>:                ${report.headings.missingH1.length}`);
  console.log(`  pages with >1 <h1> (may be ok):    ${report.headings.multipleH1.length}`);
  console.log(`  files with heading level jumps:    ${report.headings.levelJumps.length}`);
  console.log(`  <img> without alt:                 ${report.imgs.noAlt.length}`);
  console.log(`  alt="" missing aria-hidden:        ${report.imgs.emptyAltWithoutAriaHidden.length}`);
  console.log(`  generic alt (imagen/foto/etc):     ${report.imgs.genericAlt.length}`);
  console.log(`  report written: ${path.relative(ROOT, outFile).replace(/\\/g, "/")}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[audit-headings-and-alt] crash:", err);
  process.exit(1);
});

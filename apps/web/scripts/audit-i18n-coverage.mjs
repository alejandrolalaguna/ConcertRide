#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// audit-i18n-coverage.mjs — heuristic i18n gap finder for INTERACTIVE surfaces
//
// Flags string literals that contain Spanish-specific characters (¿ ¡ ñ, accented
// vowels) and are NOT routed through the i18n `t(...)` helper. It is an AUDIT
// tool (not a CI gate): it reports file:line so a human can decide.
//
// Scope: it deliberately SKIPS the programmatic SEO content (festival / artist /
// city / blog / dataset / guide landings, schema generators, the locale files
// themselves). Those pages stay in Spanish on purpose — translating them would
// multiply the Cloudflare asset manifest and is frozen for SEO reasons. The goal
// here is only to catch untranslated copy in the APP / interactive UI.
//
// Usage:  node apps/web/scripts/audit-i18n-coverage.mjs
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(fileURLToPath(new URL(".", import.meta.url)), "..", "src");

// Files/dirs whose Spanish strings are intentional (SEO content, data, locales).
// Substring match against the POSIX-style relative path.
const EXCLUDE = [
  "locales/",
  ".test.",
  "components/landing/", // landing sections = SEO marketing copy (Spanish by design)
  "seoConfig",
  "seoOverrides",
  "seoEvents",
  "schemaGenerators",
  "brandEntity",
  "blogPosts",
  "Landing", // *LandingPage.tsx + lib/*Landings.ts (festival/artist/city/route/...)
  "Dataset", // Dataset*Page.tsx
  "Datos", // DatosPage.tsx
  "Guia", // Guia*Page.tsx (SEO guides)
  "Glosario",
  "Faq", // FaqPage (SEO FAQ content)
  "HowItWorks", // marketing/SEO page
  "HowToGetThere", // SEO transport pages
  "FestivalGuide",
  "primarySources",
  "testimonials",
  "quotableAnswerDerive",
  "autoLinking",
  "internalLinkingRules",
  "PillarGuia",
  "Prensa",
  "SalaPrensa",
  "AcercaDe",
  "AvisoLegal",
  "Privacidad",
  "Cookies",
  "Terminos",
  "Contacto",
  "ComoFunciona",
  "Comparativa",
  "Alternativas",
  "MejorCarpooling",
  "ViajeCompartido",
  "CompartirCoche",
  "CompartirGastos",
  "IrJuntos",
  "CocheCompartido",
  "ViajeEnGrupo",
  "HacerPina",
  "AutorEquipo",
];

const SPANISH = /[ñ¿¡áéíóúü]/i;

// Markers that indicate a line feeds SEO meta / JSON-LD / structured data —
// those strings are intentionally Spanish and must NOT be flagged.
const SEO_MARKERS = /useSeoMeta|useSeoEnhancements|"@type"|headline|datePublished|canonical|ogImage|priceCurrency|addressLocality|jsonLd|schema|description:|abstract:|metaDescription|seoTitle/i;

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (name.endsWith(".tsx")) out.push(full);
  }
  return out;
}

const findings = [];
for (const file of walk(SRC)) {
  const rel = relative(SRC, file).split(sep).join("/");
  if (EXCLUDE.some((ex) => rel.includes(ex))) continue;

  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return;
    // Skip SEO/meta/schema lines — their Spanish is intentional.
    if (SEO_MARKERS.test(line)) return;
    // Only plain quoted strings (template literals are ~always SEO meta / dynamic).
    const strings = line.match(/"[^"]*"|'[^']*'/g) || [];
    for (const s of strings) {
      if (!SPANISH.test(s)) continue;
      // Skip if this line already routes through t( … ) or is a className/import.
      if (/\bt\(/.test(line)) continue;
      if (/className=|import |from "|from '/.test(line)) continue;
      findings.push({ rel, line: i + 1, text: s.slice(0, 70) });
      break; // one finding per line is enough
    }
  });
}

if (findings.length === 0) {
  console.log("[audit-i18n] PASS — no untranslated Spanish strings found in interactive surfaces.");
  process.exit(0);
}

// Group by file for a scannable report.
const byFile = new Map();
for (const f of findings) {
  if (!byFile.has(f.rel)) byFile.set(f.rel, []);
  byFile.get(f.rel).push(f);
}
console.log(`[audit-i18n] ${findings.length} candidate string(s) without t() across ${byFile.size} file(s):\n`);
for (const [rel, items] of [...byFile.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${rel}  (${items.length})`);
  for (const it of items.slice(0, 8)) console.log(`    L${it.line}: ${it.text}`);
  if (items.length > 8) console.log(`    … +${items.length - 8} more`);
}
console.log("\nNote: heuristic — review each. SEO/landing content is excluded by design.");
// Audit tool: exit 0 so it never blocks a build/CI by itself.
process.exit(0);

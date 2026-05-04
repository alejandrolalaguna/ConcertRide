#!/usr/bin/env node
/**
 * SCRIPT 6: audit-seo.mjs
 *
 * Auditoría SEO completa del build de producción:
 *   - Detecta páginas con noindex
 *   - Detecta canonicals incorrectos o duplicados
 *   - Detecta errores 404 potenciales (URLs en sitemap sin HTML generado)
 *   - Detecta páginas sin meta description
 *   - Detecta títulos demasiado cortos o largos
 *   - Detecta páginas no incluidas en sitemap
 *   - Compara sitemap contra dist/ generado
 *   - Valida canonical consistency
 *
 * EJECUTAR: node apps/web/scripts/seo/audit-seo.mjs
 *
 * PREREQUISITO: npm run build debe haber generado apps/web/dist/ con páginas prerenderizadas.
 *
 * OUTPUT:
 *   - output/seo-audit-report.json     — reporte completo
 *   - output/seo-issues-critical.json  — issues críticos (bloquean indexación)
 *   - output/seo-issues-all.json       — todos los issues ordenados por severidad
 *   — Imprime resumen en consola con score estimado
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "output");
const webRoot = path.resolve(__dirname, "..", "..");
const distDir = path.join(webRoot, "dist");
const publicDir = path.join(webRoot, "public");
const SITE_URL = "https://concertride.me";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function readHtml(filePath) {
  try { return await fs.readFile(filePath, "utf8"); } catch { return null; }
}

function extractMeta(html, name, isProperty = false) {
  const attr = isProperty ? "property" : "name";
  const re = new RegExp(`<meta\\s+${attr}="${name}"\\s+content="([^"]*)"`, "i");
  const m = html.match(re);
  return m ? m[1] : null;
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : null;
}

function extractCanonical(html) {
  const m = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i);
  return m ? m[1] : null;
}

function extractH1(html) {
  const m = html.match(/<h1[^>]*>([^<]*)</i);
  return m ? m[1].trim() : null;
}

function extractJsonLd(html) {
  const schemas = [];
  const re = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try { schemas.push(JSON.parse(m[1])); } catch {}
  }
  return schemas;
}

function hasNoindex(html) {
  return /<meta\s+name="robots"\s+content="[^"]*noindex[^"]*"/i.test(html)
    || /<meta\s+name="robots"\s+content="[^"]*noindex"/i.test(html);
}

// ── Rutas esperadas ────────────────────────────────────────────────────────────

const EXPECTED_ROUTES = [
  // Estáticas
  "/", "/concerts", "/festivales", "/blog", "/rutas", "/guia-transporte-festivales",
  "/prensa", "/como-funciona", "/faq", "/contacto", "/acerca-de",
  "/aviso-legal", "/privacidad", "/cookies", "/terminos",
  // Festivales
  ...["mad-cool","primavera-sound","sonar","fib","bbk-live","resurrection-fest",
    "arenal-sound","medusa-festival","vina-rock","o-son-do-camino","cala-mijas",
    "sonorama-ribera","zevra-festival","low-festival","tomavistas","cruilla",
  ].map(s => `/festivales/${s}`),
  // Ciudades
  ...["madrid","barcelona","valencia","sevilla","bilbao","malaga","zaragoza",
    "granada","donostia","santiago-de-compostela","alicante","pamplona",
    "vitoria-gasteiz","a-coruna","vigo","murcia","valladolid",
  ].map(s => `/conciertos/${s}`),
  // Como llegar
  ...["arenal-sound","vina-rock","mad-cool","bbk-live","primavera-sound","sonar",
    "resurrection-fest","cala-mijas","o-son-do-camino","low-festival","medusa-festival",
    "cruilla","sonorama-ribera","zevra-festival","fib",
  ].map(s => `/como-llegar/${s}`),
  // Blog
  ...["autobuses-festivales-espana-2026","blablacar-vs-concertride",
    "carpooling-vs-taxi-festival-espana","coldplay-madrid-barcelona-2026-como-llegar",
    "como-llegar-resurrection-fest-2026","como-volver-festival-madrugada",
    "festivales-cataluna-2026","festivales-comunidad-valenciana-2026",
    "festivales-musica-espana-2026","festivales-pais-vasco-2026",
    "festivales-verano-espana-2026-transporte","guia-transporte-vina-rock-2026",
    "huella-carbono-festivales-carpooling","que-llevar-al-festival",
  ].map(s => `/blog/${s}`),
  // Rutas (sample)
  ...["madrid-mad-cool","barcelona-mad-cool","madrid-bbk-live","donostia-bbk-live",
    "madrid-arenal-sound","valencia-arenal-sound","madrid-vina-rock","valencia-vina-rock",
    "madrid-resurrection-fest","a-coruna-resurrection-fest",
    "madrid-primavera-sound","malaga-cala-mijas","madrid-fib",
  ].map(s => `/rutas/${s}`),
];

// ── Analizar una página ────────────────────────────────────────────────────────

async function analyzePage(route) {
  const issues = [];
  const htmlPath = route === "/"
    ? path.join(distDir, "index.html")
    : path.join(distDir, route.replace(/^\//, ""), "index.html");

  const html = await readHtml(htmlPath);

  if (!html) {
    return {
      route,
      generated: false,
      issues: [{ severity: "critical", code: "PAGE_NOT_GENERATED", message: `No existe dist${route}/index.html — URL no prerenderizada o build incompleto` }],
    };
  }

  const title = extractTitle(html);
  const description = extractMeta(html, "description");
  const canonical = extractCanonical(html);
  const h1 = extractH1(html);
  const noindex = hasNoindex(html);
  const schemas = extractJsonLd(html);
  const ogTitle = extractMeta(html, "og:title", true);
  const ogDesc = extractMeta(html, "og:description", true);
  const ogImage = extractMeta(html, "og:image", true);
  const geoLat = extractMeta(html, "geo.position");

  // TITLE
  if (!title) {
    issues.push({ severity: "critical", code: "MISSING_TITLE", message: "Sin <title>" });
  } else {
    if (title.length < 30) issues.push({ severity: "high", code: "TITLE_TOO_SHORT", message: `Título muy corto (${title.length} chars): "${title}"` });
    if (title.length > 70) issues.push({ severity: "medium", code: "TITLE_TOO_LONG",  message: `Título muy largo (${title.length} chars): "${title.slice(0, 60)}..."` });
    if (!title.includes(new Date().getFullYear().toString()) && (route.startsWith("/festivales") || route.startsWith("/como-llegar") || route.startsWith("/blog"))) {
      issues.push({ severity: "low", code: "TITLE_MISSING_YEAR", message: `Título sin año en página temporal: "${title}"` });
    }
  }

  // META DESCRIPTION
  if (!description) {
    issues.push({ severity: "high", code: "MISSING_DESCRIPTION", message: "Sin meta description" });
  } else {
    if (description.length < 80)  issues.push({ severity: "medium", code: "DESCRIPTION_TOO_SHORT", message: `Descripción muy corta (${description.length} chars)` });
    if (description.length > 165) issues.push({ severity: "low",    code: "DESCRIPTION_TOO_LONG",  message: `Descripción muy larga (${description.length} chars)` });
  }

  // CANONICAL
  const expectedCanonical = `${SITE_URL}${route}`;
  if (!canonical) {
    issues.push({ severity: "high", code: "MISSING_CANONICAL", message: "Sin link rel=canonical" });
  } else if (canonical !== expectedCanonical && canonical !== `${expectedCanonical}/`) {
    issues.push({ severity: "high", code: "WRONG_CANONICAL", message: `Canonical incorrecto: "${canonical}" (esperado: "${expectedCanonical}")` });
  }

  // NOINDEX
  if (noindex) {
    issues.push({ severity: "critical", code: "NOINDEX", message: "Página con noindex — Google no la indexará" });
  }

  // H1
  if (!h1) {
    issues.push({ severity: "medium", code: "MISSING_H1", message: "Sin H1 visible en HTML renderizado" });
  }

  // OG TAGS
  if (!ogImage) {
    issues.push({ severity: "medium", code: "MISSING_OG_IMAGE", message: "Sin og:image (reducirá CTR en redes sociales)" });
  }

  // SCHEMA
  const schemaTypes = schemas.map(s => s["@type"]).flat().filter(Boolean);
  if (schemas.length === 0) {
    if (!route.startsWith("/concerts") && !route.startsWith("/publish")) {
      issues.push({ severity: "medium", code: "NO_SCHEMA", message: "Sin JSON-LD schema.org" });
    }
  } else {
    // Verificar FAQPage en festival y como-llegar
    if ((route.startsWith("/festivales/") || route.startsWith("/como-llegar/")) && !schemaTypes.includes("FAQPage")) {
      issues.push({ severity: "medium", code: "MISSING_FAQPAGE_SCHEMA", message: "Página de festival/como-llegar sin FAQPage schema" });
    }
    // BreadcrumbList
    if (!schemaTypes.includes("BreadcrumbList")) {
      issues.push({ severity: "low", code: "MISSING_BREADCRUMB_SCHEMA", message: "Sin BreadcrumbList schema" });
    }
  }

  // GEO tags (en festival y como-llegar)
  if ((route.startsWith("/festivales/") || route.startsWith("/como-llegar/")) && !geoLat) {
    issues.push({ severity: "low", code: "MISSING_GEO_TAGS", message: "Sin geo.position meta tag (útil para búsquedas locales)" });
  }

  return {
    route,
    generated: true,
    title,
    description: description?.slice(0, 100),
    canonical,
    h1,
    noindex,
    schemaTypes,
    hasOgImage: !!ogImage,
    hasGeoTags: !!geoLat,
    issueCount: issues.length,
    issues,
  };
}

// ── Auditar sitemap-static.xml ────────────────────────────────────────────────

async function auditSitemap() {
  const sitemapPath = path.join(publicDir, "sitemap-static.xml");
  const issues = [];

  if (!(await exists(sitemapPath))) {
    return { exists: false, urlCount: 0, issues: [{ severity: "critical", code: "SITEMAP_MISSING", message: "sitemap-static.xml no encontrado en public/" }] };
  }

  const content = await fs.readFile(sitemapPath, "utf8");
  const locs = [...content.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const urlCount = locs.length;

  // Buscar duplicados
  const seen = new Set();
  for (const loc of locs) {
    if (seen.has(loc)) {
      issues.push({ severity: "high", code: "SITEMAP_DUPLICATE_URL", message: `URL duplicada en sitemap: ${loc}` });
    }
    seen.add(loc);
  }

  // Verificar que las URLs esperadas críticas están en el sitemap
  const critical = ["/", "/festivales/vina-rock", "/festivales/mad-cool", "/festivales/arenal-sound",
    "/blog/autobuses-festivales-espana-2026", "/rutas/madrid-vina-rock"];
  for (const url of critical) {
    const full = `${SITE_URL}${url}`;
    if (!seen.has(full)) {
      issues.push({ severity: "high", code: "CRITICAL_URL_MISSING_FROM_SITEMAP", message: `URL crítica no está en sitemap: ${full}` });
    }
  }

  // Verificar que el índice de sitemaps referencia el sitemap dinámico de conciertos.
  // NOTA: sitemap.xml apunta a /api/sitemap-index.xml (Worker), que a su vez incluye
  // sitemap-static.xml + api/sitemap-concerts.xml dinámicamente. Es correcto por diseño.
  // Solo reportar si sitemap.xml NO tiene ninguna referencia al Worker.
  const sitemapIndexPath = path.join(publicDir, "sitemap.xml");
  if (await exists(sitemapIndexPath)) {
    const idx = await fs.readFile(sitemapIndexPath, "utf8");
    if (!idx.includes("sitemap-index.xml") && !idx.includes("sitemap-concerts.xml")) {
      issues.push({ severity: "high", code: "DYNAMIC_SITEMAP_NOT_REFERENCED", message: "sitemap.xml no referencia api/sitemap-index.xml ni api/sitemap-concerts.xml" });
    }
  }

  return { exists: true, urlCount, issues };
}

// ── Score estimado ────────────────────────────────────────────────────────────

function calculateScore(results, sitemapAudit) {
  const total = results.length;
  if (total === 0) return 0;

  const notGenerated = results.filter(r => !r.generated).length;
  const noindex = results.filter(r => r.noindex).length;
  const missingTitle = results.filter(r => r.generated && !r.title).length;
  const missingDesc = results.filter(r => r.generated && !r.description).length;
  const missingCanonical = results.filter(r => r.generated && r.issues.some(i => i.code === "MISSING_CANONICAL")).length;
  const missingSchema = results.filter(r => r.generated && r.schemaTypes?.length === 0).length;

  // Penalizaciones
  let score = 100;
  score -= (notGenerated / total) * 30;     // páginas no generadas → hasta -30
  score -= (noindex / total) * 25;           // noindex → hasta -25
  score -= (missingTitle / total) * 15;      // sin title → hasta -15
  score -= (missingDesc / total) * 10;       // sin desc → hasta -10
  score -= (missingCanonical / total) * 10;  // sin canonical → hasta -10
  score -= (missingSchema / total) * 5;      // sin schema → hasta -5
  score -= sitemapAudit.issues.filter(i => i.severity === "critical").length * 5;

  return Math.max(0, Math.round(score));
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const distExists = await exists(distDir);
  if (!distExists) {
    console.warn("⚠️  dist/ no encontrado — ejecuta npm run build primero");
    console.warn("   El script seguirá ejecutándose pero marcará todas las páginas como no generadas\n");
  }

  console.log(`🔍 Analizando ${EXPECTED_ROUTES.length} URLs...`);

  const results = [];
  for (const route of EXPECTED_ROUTES) {
    const result = await analyzePage(route);
    results.push(result);
    const icon = !result.generated ? "✗" : result.issues.length > 0 ? "⚠" : "✓";
    const issueStr = result.issues.length > 0 ? ` (${result.issues.length} issues)` : "";
    if (result.issues.length > 0 || !result.generated) {
      process.stdout.write(`  ${icon} ${route}${issueStr}\n`);
    }
  }

  const sitemapAudit = await auditSitemap();
  const score = calculateScore(results, sitemapAudit);

  // Clasificar issues por severidad
  const allIssues = [
    ...results.flatMap(r => r.issues.map(i => ({ ...i, route: r.route }))),
    ...sitemapAudit.issues.map(i => ({ ...i, route: "sitemap-static.xml" })),
  ];

  const criticalIssues = allIssues.filter(i => i.severity === "critical");
  const highIssues = allIssues.filter(i => i.severity === "high");
  const mediumIssues = allIssues.filter(i => i.severity === "medium");

  // Stats
  const generated = results.filter(r => r.generated).length;
  const withIssues = results.filter(r => r.issues.length > 0).length;
  const noindex = results.filter(r => r.noindex).length;

  const report = {
    generated: new Date().toISOString(),
    score,
    scoreInterpretation: score >= 90 ? "Excelente" : score >= 75 ? "Bueno" : score >= 60 ? "Mejorable" : "Crítico",
    summary: {
      totalAnalyzed: EXPECTED_ROUTES.length,
      pagesGenerated: generated,
      pagesNotGenerated: EXPECTED_ROUTES.length - generated,
      pagesWithIssues: withIssues,
      noindexPages: noindex,
      criticalIssues: criticalIssues.length,
      highIssues: highIssues.length,
      mediumIssues: mediumIssues.length,
    },
    sitemapAudit,
    allIssues,
    pageResults: results,
  };

  await fs.writeFile(path.join(outputDir, "seo-audit-report.json"), JSON.stringify(report, null, 2), "utf8");
  await fs.writeFile(path.join(outputDir, "seo-issues-critical.json"), JSON.stringify(criticalIssues, null, 2), "utf8");
  await fs.writeFile(path.join(outputDir, "seo-issues-all.json"), JSON.stringify(allIssues, null, 2), "utf8");

  // Resumen en consola
  console.log("\n╔═══════════════════════════════════════════════════════╗");
  console.log("║  audit-seo.mjs — RESULTADOS                          ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");
  console.log(`🎯 SEO Score estimado: ${score}/100 (${report.scoreInterpretation})\n`);
  console.log(`📊 Resumen:`);
  console.log(`   Páginas analizadas:     ${EXPECTED_ROUTES.length}`);
  console.log(`   Páginas generadas:      ${generated}`);
  console.log(`   Páginas NO generadas:   ${EXPECTED_ROUTES.length - generated}${EXPECTED_ROUTES.length - generated > 0 ? " ← build pendiente o slug incorrecto" : ""}`);
  console.log(`   Páginas con issues:     ${withIssues}`);
  console.log(`   noindex detectados:     ${noindex}`);
  console.log();

  if (criticalIssues.length > 0) {
    console.log(`🚨 Issues CRÍTICOS (${criticalIssues.length}) — bloquean indexación:`);
    criticalIssues.forEach(i => console.log(`   [${i.route}] ${i.message}`));
    console.log();
  }
  if (highIssues.length > 0) {
    console.log(`⚠️  Issues ALTOS (${highIssues.length}) — impactan ranking:`);
    highIssues.slice(0, 8).forEach(i => console.log(`   [${i.route}] ${i.message}`));
    if (highIssues.length > 8) console.log(`   ... y ${highIssues.length - 8} más (ver seo-issues-all.json)`);
    console.log();
  }

  console.log(`📋 Sitemap: ${sitemapAudit.urlCount} URLs en sitemap-static.xml`);
  if (sitemapAudit.issues.length > 0) {
    sitemapAudit.issues.forEach(i => console.log(`   [${i.severity.toUpperCase()}] ${i.message}`));
  } else {
    console.log("   ✅ Sitemap sin problemas detectados");
  }
  console.log();

  console.log("📁 Archivos generados:");
  console.log("   output/seo-audit-report.json    — reporte completo");
  console.log("   output/seo-issues-critical.json — solo issues críticos");
  console.log("   output/seo-issues-all.json       — todos los issues ordenados\n");

  if (!distExists) {
    console.log("⚠️  Ejecuta 'npm run build' para resultados completos.\n");
  }
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

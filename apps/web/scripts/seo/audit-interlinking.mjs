#!/usr/bin/env node
/**
 * SCRIPT 5: audit-interlinking.mjs
 *
 * Audita el interlinking interno del sitio:
 *   - Detecta páginas huérfanas (sin links entrantes)
 *   - Analiza páginas sin links salientes
 *   - Verifica que relatedFestivals, relatedLinks, relatedPosts apunten a URLs válidas
 *   - Propone anchor text optimizado para las páginas sin cobertura
 *   - Genera un grafo de enlaces internos en JSON
 *
 * EJECUTAR: node apps/web/scripts/seo/audit-interlinking.mjs
 *
 * OUTPUT:
 *   - output/interlinking-audit.json   (reporte completo)
 *   - output/orphan-pages.json         (páginas sin links entrantes)
 *   - output/broken-internal-links.json (links que apuntan a slugs inexistentes)
 *   - output/interlinking-suggestions.json (sugerencias de enlaces a añadir)
 *
 * IMPORTANTE: Este script NO modifica ficheros existentes. Solo analiza y reporta.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "output");

// ── Inventario completo de URLs del sitio ─────────────────────────────────────

const FESTIVAL_SLUGS = [
  "mad-cool", "primavera-sound", "sonar", "fib", "bbk-live", "resurrection-fest",
  "arenal-sound", "medusa-festival", "vina-rock", "o-son-do-camino", "cala-mijas",
  "sonorama-ribera", "zevra-festival", "low-festival", "tomavistas", "cruilla",
];

const CITY_SLUGS = [
  "madrid", "barcelona", "valencia", "sevilla", "bilbao", "malaga", "zaragoza",
  "granada", "donostia", "santiago-de-compostela", "alicante", "pamplona",
  "vitoria-gasteiz", "a-coruna", "vigo", "murcia", "valladolid",
];

const HOW_TO_GET_THERE_SLUGS = [
  "arenal-sound", "vina-rock", "mad-cool", "bbk-live", "primavera-sound",
  "sonar", "resurrection-fest", "cala-mijas", "o-son-do-camino",
  "low-festival", "medusa-festival", "cruilla", "sonorama-ribera",
  "zevra-festival", "fib",
];

const BLOG_SLUGS = [
  "autobuses-festivales-espana-2026",
  "blablacar-vs-concertride",
  "carpooling-vs-taxi-festival-espana",
  "coldplay-madrid-barcelona-2026-como-llegar",
  "como-llegar-resurrection-fest-2026",
  "como-volver-festival-madrugada",
  "festivales-cataluna-2026",
  "festivales-comunidad-valenciana-2026",
  "festivales-musica-espana-2026",
  "festivales-pais-vasco-2026",
  "festivales-verano-espana-2026-transporte",
  "guia-transporte-vina-rock-2026",
  "huella-carbono-festivales-carpooling",
  "que-llevar-al-festival",
];

const ROUTE_SLUGS_ACTIVE = [
  "madrid-mad-cool", "barcelona-mad-cool", "valencia-mad-cool", "zaragoza-mad-cool",
  "madrid-primavera-sound", "madrid-sonar", "madrid-bbk-live", "donostia-bbk-live",
  "santander-bbk-live", "vitoria-gasteiz-bbk-live", "pamplona-bbk-live",
  "madrid-arenal-sound", "valencia-arenal-sound", "barcelona-arenal-sound",
  "zaragoza-arenal-sound", "alicante-arenal-sound",
  "madrid-vina-rock", "valencia-vina-rock", "alicante-vina-rock",
  "albacete-vina-rock", "sevilla-vina-rock",
  "madrid-resurrection-fest", "a-coruna-resurrection-fest", "vigo-resurrection-fest",
  "bilbao-resurrection-fest",
  "malaga-cala-mijas", "madrid-cala-mijas",
  "madrid-fib", "barcelona-fib", "valencia-fib",
  "madrid-o-son-do-camino",
  "madrid-sonorama-ribera", "burgos-sonorama-ribera", "valladolid-sonorama-ribera",
  "madrid-medusa-festival", "valencia-medusa-festival", "alicante-medusa-festival",
  "madrid-low-festival", "alicante-low-festival", "valencia-low-festival",
];

// ── Grafo de enlaces conocidos (extraído de los datos de las páginas) ─────────
// Espejo de: relatedFestivals, relatedLinks, relatedPosts, interlinking blocks

const KNOWN_LINKS = {
  // Festival → Festival (relatedFestivals) + Como Llegar + Conciertos ciudad
  "festivales/mad-cool":          ["festivales/tomavistas", "festivales/sonorama-ribera", "festivales/primavera-sound", "como-llegar/mad-cool", "conciertos/madrid"],
  "festivales/primavera-sound":   ["festivales/sonar", "festivales/cruilla", "como-llegar/primavera-sound", "conciertos/barcelona"],
  "festivales/sonar":             ["festivales/primavera-sound", "festivales/cruilla", "como-llegar/sonar", "conciertos/barcelona"],
  "festivales/fib":               ["festivales/arenal-sound", "festivales/medusa-festival", "festivales/low-festival", "como-llegar/fib", "conciertos/valencia"],
  "festivales/bbk-live":          ["festivales/resurrection-fest", "festivales/sonorama-ribera", "como-llegar/bbk-live", "conciertos/bilbao"],
  "festivales/resurrection-fest": ["festivales/o-son-do-camino", "festivales/sonorama-ribera", "como-llegar/resurrection-fest", "conciertos/a-coruna"],
  "festivales/arenal-sound":      ["festivales/medusa-festival", "festivales/fib", "festivales/low-festival", "como-llegar/arenal-sound", "conciertos/valencia"],
  "festivales/medusa-festival":   ["festivales/arenal-sound", "festivales/fib", "festivales/low-festival", "como-llegar/medusa-festival", "conciertos/valencia"],
  "festivales/vina-rock":         ["festivales/mad-cool", "festivales/resurrection-fest", "como-llegar/vina-rock", "conciertos/madrid"],
  "festivales/o-son-do-camino":   ["festivales/resurrection-fest", "festivales/sonorama-ribera", "como-llegar/o-son-do-camino", "conciertos/santiago-de-compostela"],
  "festivales/cala-mijas":        ["festivales/arenal-sound", "festivales/medusa-festival", "como-llegar/cala-mijas", "conciertos/malaga"],
  "festivales/sonorama-ribera":   ["festivales/mad-cool", "festivales/tomavistas", "como-llegar/sonorama-ribera", "conciertos/valladolid"],
  "festivales/low-festival":      ["festivales/arenal-sound", "festivales/fib", "festivales/medusa-festival", "como-llegar/low-festival", "conciertos/alicante"],
  "festivales/zevra-festival":    ["como-llegar/zevra-festival", "conciertos/valencia"],
  "festivales/tomavistas":        ["festivales/mad-cool", "conciertos/madrid"],
  "festivales/cruilla":           ["festivales/primavera-sound", "festivales/sonar", "como-llegar/cruilla", "conciertos/barcelona"],

  // Blog → Festival + Como Llegar + Conciertos
  "blog/guia-transporte-vina-rock-2026":         ["festivales/vina-rock", "como-llegar/vina-rock", "rutas/madrid-vina-rock", "rutas/valencia-vina-rock", "rutas/alicante-vina-rock"],
  "blog/como-llegar-resurrection-fest-2026":     ["festivales/resurrection-fest", "como-llegar/resurrection-fest", "rutas/madrid-resurrection-fest", "rutas/a-coruna-resurrection-fest", "rutas/vigo-resurrection-fest"],
  "blog/autobuses-festivales-espana-2026":       ["festivales/vina-rock", "festivales/arenal-sound", "festivales/bbk-live", "festivales/mad-cool", "festivales/primavera-sound", "como-llegar/vina-rock", "como-llegar/arenal-sound", "como-llegar/bbk-live", "como-llegar/primavera-sound", "como-llegar/sonar", "como-llegar/fib"],
  "blog/coldplay-madrid-barcelona-2026-como-llegar": ["conciertos/madrid", "conciertos/barcelona"],
  "blog/como-volver-festival-madrugada":         ["como-llegar/vina-rock", "como-llegar/arenal-sound", "como-llegar/bbk-live", "como-llegar/mad-cool", "como-llegar/resurrection-fest", "como-llegar/low-festival", "como-llegar/medusa-festival"],
  "blog/festivales-musica-espana-2026":          ["festivales/mad-cool", "festivales/primavera-sound", "festivales/bbk-live", "como-llegar/sonar", "como-llegar/cruilla", "como-llegar/sonorama-ribera", "como-llegar/o-son-do-camino"],
  "blog/festivales-verano-espana-2026-transporte": ["festivales/arenal-sound", "festivales/medusa-festival", "festivales/fib", "blog/coldplay-madrid-barcelona-2026-como-llegar", "blog/como-llegar-resurrection-fest-2026", "como-llegar/cala-mijas", "como-llegar/zevra-festival", "conciertos/sevilla", "conciertos/zaragoza", "conciertos/granada", "conciertos/pamplona", "conciertos/vigo"],
  "blog/festivales-comunidad-valenciana-2026":   ["festivales/arenal-sound", "festivales/medusa-festival", "festivales/fib", "festivales/zevra-festival", "conciertos/valencia", "conciertos/alicante", "conciertos/murcia"],
  "blog/blablacar-vs-concertride":               ["blog/carpooling-vs-taxi-festival-espana"],
  "blog/carpooling-vs-taxi-festival-espana":     [],
  "blog/huella-carbono-festivales-carpooling":   [],
  "blog/que-llevar-al-festival":                 ["blog/coldplay-madrid-barcelona-2026-como-llegar"],
  "blog/festivales-pais-vasco-2026":             ["festivales/bbk-live", "conciertos/bilbao", "conciertos/donostia", "conciertos/vitoria-gasteiz"],
  "blog/festivales-cataluna-2026":               ["festivales/primavera-sound", "festivales/sonar", "festivales/cruilla", "conciertos/barcelona"],

  // Como-llegar → Festival + Rutas + Conciertos
  "como-llegar/vina-rock":         ["festivales/vina-rock", "rutas/madrid-vina-rock", "rutas/valencia-vina-rock", "rutas/alicante-vina-rock", "conciertos/madrid"],
  "como-llegar/mad-cool":          ["festivales/mad-cool", "rutas/madrid-mad-cool", "rutas/barcelona-mad-cool", "rutas/valencia-mad-cool", "conciertos/madrid"],
  "como-llegar/bbk-live":          ["festivales/bbk-live", "rutas/madrid-bbk-live", "rutas/donostia-bbk-live", "rutas/santander-bbk-live", "conciertos/bilbao"],
  "como-llegar/arenal-sound":      ["festivales/arenal-sound", "rutas/valencia-arenal-sound", "rutas/madrid-arenal-sound", "conciertos/valencia"],
  "como-llegar/primavera-sound":   ["festivales/primavera-sound", "rutas/madrid-primavera-sound", "conciertos/barcelona"],
  "como-llegar/resurrection-fest": ["festivales/resurrection-fest", "rutas/madrid-resurrection-fest", "rutas/a-coruna-resurrection-fest", "conciertos/a-coruna"],
  "como-llegar/cala-mijas":        ["festivales/cala-mijas", "rutas/malaga-cala-mijas", "rutas/madrid-cala-mijas", "conciertos/malaga"],
  "como-llegar/sonar":             ["festivales/sonar", "rutas/madrid-sonar", "conciertos/barcelona"],
  "como-llegar/fib":               ["festivales/fib", "rutas/madrid-fib", "rutas/barcelona-fib", "rutas/valencia-fib", "conciertos/valencia"],
  "como-llegar/low-festival":      ["festivales/low-festival", "rutas/alicante-low-festival", "rutas/madrid-low-festival", "conciertos/alicante"],
  "como-llegar/medusa-festival":   ["festivales/medusa-festival", "rutas/valencia-medusa-festival", "rutas/madrid-medusa-festival", "conciertos/valencia"],
  "como-llegar/cruilla":           ["festivales/cruilla", "conciertos/barcelona"],
  "como-llegar/sonorama-ribera":   ["festivales/sonorama-ribera", "rutas/madrid-sonorama-ribera", "rutas/burgos-sonorama-ribera", "conciertos/valladolid"],
  "como-llegar/zevra-festival":    ["festivales/zevra-festival", "conciertos/valencia"],
  "como-llegar/o-son-do-camino":   ["festivales/o-son-do-camino", "rutas/madrid-o-son-do-camino", "conciertos/santiago-de-compostela"],
};

// ── Construir inventario de URLs ──────────────────────────────────────────────

function buildInventory() {
  const all = new Map();
  const add = (url, type) => all.set(url, { url, type, inboundLinks: [], outboundLinks: [] });

  FESTIVAL_SLUGS.forEach(s   => add(`festivales/${s}`,    "festival"));
  CITY_SLUGS.forEach(s       => add(`conciertos/${s}`,    "city"));
  HOW_TO_GET_THERE_SLUGS.forEach(s => add(`como-llegar/${s}`, "como-llegar"));
  BLOG_SLUGS.forEach(s       => add(`blog/${s}`,          "blog"));
  ROUTE_SLUGS_ACTIVE.forEach(s => add(`rutas/${s}`,       "route"));

  return all;
}

// ── Analizar links ────────────────────────────────────────────────────────────

function analyzeLinks(inventory) {
  const broken = [];
  const sourceToTargets = new Map();

  // Procesar KNOWN_LINKS
  for (const [source, targets] of Object.entries(KNOWN_LINKS)) {
    if (!sourceToTargets.has(source)) sourceToTargets.set(source, new Set());
    for (const target of targets) {
      sourceToTargets.get(source).add(target);

      if (inventory.has(target)) {
        inventory.get(target).inboundLinks.push(source);
      } else {
        broken.push({ source, target, reason: "target URL not found in inventory" });
      }
    }
  }

  // Propagar outboundLinks
  for (const [source, targets] of sourceToTargets) {
    if (inventory.has(source)) {
      inventory.get(source).outboundLinks = [...targets];
    }
  }

  return { broken };
}

// ── Detectar huérfanas ────────────────────────────────────────────────────────

function findOrphans(inventory) {
  const orphans = [];
  for (const [url, data] of inventory) {
    if (data.inboundLinks.length === 0) {
      orphans.push({
        url,
        type: data.type,
        outboundLinks: data.outboundLinks.length,
        risk: data.type === "route" ? "medium" : data.type === "blog" ? "high" : "critical",
      });
    }
  }
  return orphans.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return (order[a.risk] ?? 3) - (order[b.risk] ?? 3);
  });
}

// ── Detectar páginas sin links salientes ──────────────────────────────────────

function findNoOutbound(inventory) {
  const result = [];
  for (const [url, data] of inventory) {
    if (data.outboundLinks.length === 0 && !url.startsWith("rutas/")) {
      result.push({ url, type: data.type, inboundLinks: data.inboundLinks.length });
    }
  }
  return result;
}

// ── Generar sugerencias de interlinking ──────────────────────────────────────

function generateSuggestions(inventory) {
  const suggestions = [];
  const year = new Date().getFullYear();

  for (const [url, data] of inventory) {
    const missing = [];

    // Blog sin link a festivales relacionados
    if (data.type === "blog" && data.outboundLinks.length < 3) {
      const slug = url.replace("blog/", "");
      if (slug.includes("vina-rock") && !data.outboundLinks.includes("festivales/vina-rock")) {
        missing.push({ target: "festivales/vina-rock", anchor: `Viña Rock ${year}`, priority: "high" });
        missing.push({ target: "como-llegar/vina-rock", anchor: "Cómo llegar a Viña Rock", priority: "high" });
      }
      if (slug.includes("resurrection") && !data.outboundLinks.includes("festivales/resurrection-fest")) {
        missing.push({ target: "festivales/resurrection-fest", anchor: `Resurrection Fest ${year}`, priority: "high" });
        missing.push({ target: "como-llegar/resurrection-fest", anchor: "Cómo llegar a Resurrection Fest", priority: "high" });
      }
      if (slug.includes("autobuses") && !data.outboundLinks.includes("como-llegar/mad-cool")) {
        missing.push({ target: "como-llegar/mad-cool", anchor: "Cómo llegar a Mad Cool", priority: "medium" });
        missing.push({ target: "como-llegar/bbk-live", anchor: "Cómo llegar a BBK Live", priority: "medium" });
        missing.push({ target: "como-llegar/arenal-sound", anchor: "Cómo llegar a Arenal Sound", priority: "medium" });
      }
    }

    // Como-llegar sin link a rutas del festival
    if (data.type === "como-llegar" && data.outboundLinks.length < 2) {
      const festSlug = url.replace("como-llegar/", "");
      const relatedRoutes = ROUTE_SLUGS_ACTIVE.filter(r => r.endsWith(`-${festSlug}`)).slice(0, 3);
      for (const route of relatedRoutes) {
        const origin = route.replace(`-${festSlug}`, "").replace(/-/g, " ");
        missing.push({ target: `rutas/${route}`, anchor: `Carpooling desde ${origin}`, priority: "high" });
      }
    }

    // Festivales sin link a blog relacionado
    if (data.type === "festival") {
      const festSlug = url.replace("festivales/", "");
      const relatedBlogs = BLOG_SLUGS.filter(b => b.includes(festSlug.replace("-", "")));
      for (const blog of relatedBlogs) {
        if (!data.outboundLinks.includes(`blog/${blog}`)) {
          missing.push({ target: `blog/${blog}`, anchor: "Guía de transporte", priority: "medium" });
        }
      }
    }

    if (missing.length > 0) {
      suggestions.push({ page: url, type: data.type, suggestedLinks: missing });
    }
  }

  return suggestions;
}

// ── Anchor text recomendado ───────────────────────────────────────────────────

function generateAnchorTextGuide() {
  const year = new Date().getFullYear();
  return {
    festivals: FESTIVAL_SLUGS.map(slug => ({
      slug,
      recommendedAnchors: [
        slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        `${slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())} ${year}`,
        `Carpooling a ${slug.replace(/-/g, " ")}`,
        `Cómo llegar a ${slug.replace(/-/g, " ")}`,
      ],
    })),
    note: "Priorizar anclas con 'cómo llegar', 'carpooling' y año — coinciden con queries GSC de alto volumen",
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const inventory = buildInventory();
  const { broken } = analyzeLinks(inventory);
  const orphans = findOrphans(inventory);
  const noOutbound = findNoOutbound(inventory);
  const suggestions = generateSuggestions(inventory);
  const anchorGuide = generateAnchorTextGuide();

  // Estadísticas
  const stats = {
    totalPages: inventory.size,
    byType: {
      festivals:    FESTIVAL_SLUGS.length,
      cities:       CITY_SLUGS.length,
      "como-llegar": HOW_TO_GET_THERE_SLUGS.length,
      blog:         BLOG_SLUGS.length,
      routes:       ROUTE_SLUGS_ACTIVE.length,
    },
    orphanPages:    orphans.length,
    brokenLinks:    broken.length,
    noOutbound:     noOutbound.length,
    pagesWithSuggestions: suggestions.length,
  };

  const fullReport = {
    generated: new Date().toISOString(),
    stats,
    orphanPages: orphans,
    brokenInternalLinks: broken,
    pagesWithoutOutbound: noOutbound,
    suggestions,
    anchorTextGuide: anchorGuide,
    inventoryByInboundLinks: [...inventory.entries()]
      .map(([url, d]) => ({ url, type: d.type, inbound: d.inboundLinks.length, outbound: d.outboundLinks.length }))
      .sort((a, b) => a.inbound - b.inbound),
  };

  await fs.writeFile(path.join(outputDir, "interlinking-audit.json"), JSON.stringify(fullReport, null, 2), "utf8");
  await fs.writeFile(path.join(outputDir, "orphan-pages.json"), JSON.stringify(orphans, null, 2), "utf8");
  await fs.writeFile(path.join(outputDir, "broken-internal-links.json"), JSON.stringify(broken, null, 2), "utf8");
  await fs.writeFile(path.join(outputDir, "interlinking-suggestions.json"), JSON.stringify(suggestions, null, 2), "utf8");

  // Consola
  console.log("\n╔═══════════════════════════════════════════════════════╗");
  console.log("║  audit-interlinking.mjs — RESULTADOS                 ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");
  console.log(`📊 Inventario: ${stats.totalPages} páginas analizadas`);
  Object.entries(stats.byType).forEach(([k, v]) => console.log(`   ${k.padEnd(15)} ${v} páginas`));
  console.log();

  if (orphans.length > 0) {
    const critical = orphans.filter(o => o.risk === "critical");
    const high = orphans.filter(o => o.risk === "high");
    console.log(`🚨 Páginas HUÉRFANAS (sin links entrantes): ${orphans.length}`);
    if (critical.length) { console.log(`   CRÍTICO: ${critical.length}`); critical.forEach(o => console.log(`     - ${o.url}`)); }
    if (high.length)     { console.log(`   ALTO:    ${high.length}`); high.slice(0, 5).forEach(o => console.log(`     - ${o.url}`)); }
    console.log();
  } else {
    console.log("✅ No hay páginas huérfanas\n");
  }

  if (broken.length > 0) {
    console.log(`⚠️  Links rotos internos: ${broken.length}`);
    broken.slice(0, 5).forEach(b => console.log(`   ${b.source} → ${b.target} (no existe)`));
    console.log();
  } else {
    console.log("✅ No hay links internos rotos\n");
  }

  if (noOutbound.length > 0) {
    console.log(`📄 Páginas sin links salientes: ${noOutbound.length}`);
    noOutbound.slice(0, 5).forEach(p => console.log(`   ${p.url} (${p.type})`));
    console.log();
  }

  if (suggestions.length > 0) {
    console.log(`💡 Sugerencias de interlinking: ${suggestions.length} páginas`);
    suggestions.slice(0, 3).forEach(s => {
      console.log(`   ${s.page}: ${s.suggestedLinks.length} links sugeridos`);
    });
    console.log();
  }

  console.log("📁 Archivos generados:");
  console.log("   output/interlinking-audit.json     — reporte completo");
  console.log("   output/orphan-pages.json            — páginas huérfanas");
  console.log("   output/broken-internal-links.json   — links rotos");
  console.log("   output/interlinking-suggestions.json — sugerencias\n");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

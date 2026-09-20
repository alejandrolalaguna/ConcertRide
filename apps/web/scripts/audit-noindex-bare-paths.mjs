#!/usr/bin/env node
/**
 * audit-noindex-bare-paths — guardrail de §AD.6 / §AK.
 *
 * En Cloudflare `_headers`, un patrón `/x/*` **NO** matchea el path desnudo
 * `/x`. Si `/x/*` sirve `X-Robots-Tag: noindex` pero no existe regla bare `/x`,
 * entonces `/x` se sirve SIN noindex.
 *
 * Mientras ese path esté `Disallow`-eado en robots.txt da igual (Google no lo
 * rastrea). El problema aparece en cuanto se quita el Disallow — que es
 * exactamente lo que hizo §AF.3 con `/rides` y `/drivers` el 2026-09-16 para
 * que su noindex fuese visible. El resultado fue que los paths bare quedaron
 * rastreables, sin asset en dist/ y sin noindex → SPA-shell con el canonical de
 * la HOME, el patrón §AG.2 que costó el hub de /artistas.
 *
 * Este script falla el build si encuentra un wildcard con noindex cuyo path
 * bare NO está cubierto ni por una regla bare en `_headers` ni por un
 * `Disallow` en robots.txt.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const headersPath = resolve(here, "../public/_headers");
const robotsPath = resolve(here, "../public/robots.txt");

const headers = readFileSync(headersPath, "utf8");
const robots = readFileSync(robotsPath, "utf8");

const disallowed = robots
  .split("\n")
  .filter((l) => /^Disallow:/i.test(l))
  .map((l) => l.replace(/^Disallow:/i, "").trim())
  .filter(Boolean);

// Un path está cubierto por robots si alguna regla Disallow es prefijo suyo.
const blockedByRobots = (p) =>
  disallowed.some((d) => {
    const base = d.replace(/\/$/, "");
    return p === base || p.startsWith(`${base}/`);
  });

const blocks = headers.split(/\n(?=\/)/);
const allPaths = [];
const noindexWildcards = [];
for (const b of blocks) {
  const p = b.split("\n")[0].trim();
  if (!p.startsWith("/")) continue;
  allPaths.push(p);
  if (/X-Robots-Tag:\s*noindex/i.test(b) && p.endsWith("/*")) noindexWildcards.push(p);
}

const gaps = [];
for (const w of noindexWildcards) {
  const bare = w.slice(0, -2);
  if (!bare || bare === "") continue; // "/*" global, no aplica
  if (allPaths.includes(bare)) continue; // tiene regla bare explícita
  if (blockedByRobots(bare)) continue; // robots lo tapa: inalcanzable, inocuo
  gaps.push({ wildcard: w, bare });
}

console.log("\n=== Audit noindex bare-paths (§AD.6 / §AK) ===");
console.log(`Wildcards con noindex: ${noindexWildcards.length}`);

if (gaps.length > 0) {
  console.error(`\n❌ ${gaps.length} path(s) bare sin noindex Y sin Disallow:\n`);
  for (const g of gaps) {
    console.error(`   ${g.wildcard} existe, pero '${g.bare}' NO tiene regla bare`);
    console.error(`   → '${g.bare}' es rastreable y se sirve sin noindex (SPA-shell`);
    console.error(`     con el canonical de la home, patrón §AG.2).`);
    console.error(`   Fix: añadir un bloque '${g.bare}' en apps/web/public/_headers.\n`);
  }
  process.exit(1);
}

console.log("✅ Ningún path bare queda rastreable sin su noindex.\n");

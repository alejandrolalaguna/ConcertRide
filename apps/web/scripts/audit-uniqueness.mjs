#!/usr/bin/env node
/**
 * audit-uniqueness.mjs
 *
 * Mide similitud de contenido entre páginas programáticas prerenderizadas
 * (rutas, festivales, ciudades, blog) usando TF-IDF + cosine similarity.
 *
 * Output:
 *  - apps/web/scripts/reports/uniqueness-YYYY-MM-DD.json
 *  - apps/web/scripts/reports/uniqueness-YYYY-MM-DD.csv
 *  - resumen por stdout
 *
 * Uso:
 *   node apps/web/scripts/audit-uniqueness.mjs
 *
 * Requiere `npm run build` ejecutado previamente (apps/web/dist/ existente).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const REPORTS_DIR = path.join(__dirname, "reports");

if (!fs.existsSync(DIST)) {
  console.error(
    `[audit-uniqueness] ERROR: ${DIST} no existe. Ejecuta \`npm run build\` antes.`
  );
  process.exit(1);
}

const STOPWORDS = new Set([
  "el", "la", "los", "las", "de", "del", "en", "para", "con", "un", "una",
  "y", "o", "que", "a", "al", "se", "su", "sus", "es", "son", "este", "esta",
  "estos", "estas", "lo", "le", "les", "como", "más", "mas", "pero", "por",
  "qué", "que", "cuál", "cual", "cuáles", "cuales", "tu", "tus", "te", "ti",
  "mi", "mis", "me", "yo", "tú", "él", "ella", "ellos", "ellas", "nosotros",
  "vosotros", "ser", "estar", "haber", "han", "ha", "hay", "fue", "fueron",
  "será", "sera", "siendo", "sido", "soy", "eres", "está", "estan", "están",
  "the", "and", "of", "to", "in", "for", "is", "on", "at", "by", "from"
]);

const TOP_K = 5;

// ---------- HTML → texto visible ----------
function extractVisibleText(html) {
  let s = html;
  // Eliminar JSON-LD y scripts
  s = s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
  s = s.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ");
  // Quitar nav, header, footer (chrome común)
  s = s.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, " ");
  s = s.replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, " ");
  s = s.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, " ");
  // Quitar atributos (alt, title, etc. también se descartan al quitar tags)
  s = s.replace(/<[^>]+>/g, " ");
  // Decode HTML entities básicos
  s = s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/&#\d+;/g, " ");
  // Normalizar espacios
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

function tokenize(text) {
  // lowercase + sólo letras unicode + dígitos; split por non-word
  const lower = text.toLowerCase();
  const raw = lower.split(/[^a-z0-9áéíóúñü]+/i).filter(Boolean);
  return raw.filter((t) => t.length >= 3 && !STOPWORDS.has(t) && !/^\d+$/.test(t));
}

// ---------- carga del cluster ----------
function listHtmlFiles(dir, limit = Infinity) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (results.length >= limit) break;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      const idx = path.join(full, "index.html");
      if (fs.existsSync(idx)) results.push(idx);
    } else if (ent.isFile() && ent.name.endsWith(".html")) {
      results.push(full);
    }
  }
  return results;
}

function urlFromPath(filePath, distRoot) {
  const rel = path.relative(distRoot, filePath).split(path.sep).join("/");
  // /rutas/foo/index.html → /rutas/foo
  return "/" + rel.replace(/\/index\.html$/, "").replace(/\.html$/, "");
}

// ---------- TF-IDF ----------
function buildTfIdf(docs) {
  // docs: array of { tokens: string[] }
  const N = docs.length;
  const df = new Map(); // term -> doc freq
  const tfArr = new Array(N); // tf maps por doc
  for (let i = 0; i < N; i++) {
    const tf = new Map();
    for (const t of docs[i].tokens) tf.set(t, (tf.get(t) || 0) + 1);
    tfArr[i] = tf;
    for (const t of tf.keys()) df.set(t, (df.get(t) || 0) + 1);
  }

  // Vocab estable
  const vocab = Array.from(df.keys());
  const termIdx = new Map(vocab.map((t, i) => [t, i]));
  const idf = new Float32Array(vocab.length);
  for (let i = 0; i < vocab.length; i++) {
    idf[i] = Math.log((1 + N) / (1 + df.get(vocab[i]))) + 1;
  }

  // Vectores sparse: arrays paralelos {idx: Int32Array, val: Float32Array}
  const vectors = new Array(N);
  const norms = new Float32Array(N);
  for (let d = 0; d < N; d++) {
    const tf = tfArr[d];
    const total = docs[d].tokens.length || 1;
    const len = tf.size;
    const idxs = new Int32Array(len);
    const vals = new Float32Array(len);
    let k = 0;
    let normSq = 0;
    for (const [term, c] of tf) {
      const ti = termIdx.get(term);
      const w = (c / total) * idf[ti];
      idxs[k] = ti;
      vals[k] = w;
      normSq += w * w;
      k++;
    }
    // Ordenar por idx (acelera intersección)
    const order = Array.from({ length: len }, (_, i) => i).sort(
      (a, b) => idxs[a] - idxs[b]
    );
    const sIdx = new Int32Array(len);
    const sVal = new Float32Array(len);
    for (let j = 0; j < len; j++) {
      sIdx[j] = idxs[order[j]];
      sVal[j] = vals[order[j]];
    }
    vectors[d] = { idx: sIdx, val: sVal };
    norms[d] = Math.sqrt(normSq) || 1;
  }
  return { vectors, norms, vocabSize: vocab.length };
}

function cosine(a, b, na, nb) {
  // a, b son sparse ordenados por idx
  let i = 0,
    j = 0,
    dot = 0;
  const ai = a.idx,
    av = a.val,
    bi = b.idx,
    bv = b.val;
  const aL = ai.length,
    bL = bi.length;
  while (i < aL && j < bL) {
    const x = ai[i];
    const y = bi[j];
    if (x === y) {
      dot += av[i] * bv[j];
      i++;
      j++;
    } else if (x < y) i++;
    else j++;
  }
  return dot / (na * nb);
}

// ---------- procesado por cluster ----------
function processCluster(name, files, distRoot) {
  console.log(`\n[${name}] cargando ${files.length} docs…`);
  const docs = [];
  for (const f of files) {
    const html = fs.readFileSync(f, "utf8");
    const text = extractVisibleText(html);
    const tokens = tokenize(text);
    docs.push({
      url: urlFromPath(f, distRoot),
      wordCount: tokens.length,
      tokens,
    });
  }

  const t0 = Date.now();
  const { vectors, norms } = buildTfIdf(docs);
  const t1 = Date.now();
  console.log(`[${name}] TF-IDF construido en ${t1 - t0}ms`);

  const N = docs.length;
  const results = new Array(N);

  // Para cada doc, calcular cosine vs todos los siblings y guardar topK + media
  for (let i = 0; i < N; i++) {
    const sims = new Float32Array(N);
    let sum = 0;
    for (let j = 0; j < N; j++) {
      if (i === j) {
        sims[j] = 0;
        continue;
      }
      const s = cosine(vectors[i], vectors[j], norms[i], norms[j]);
      sims[j] = s;
      sum += s;
    }
    const mean = N > 1 ? sum / (N - 1) : 0;

    // top-K
    const top = [];
    for (let j = 0; j < N; j++) {
      if (j === i) continue;
      if (top.length < TOP_K) {
        top.push({ idx: j, score: sims[j] });
        top.sort((a, b) => b.score - a.score);
      } else if (sims[j] > top[top.length - 1].score) {
        top[top.length - 1] = { idx: j, score: sims[j] };
        top.sort((a, b) => b.score - a.score);
      }
    }

    results[i] = {
      url: docs[i].url,
      type: name,
      wordCount: docs[i].wordCount,
      meanSimilarity: +mean.toFixed(4),
      uniquenessScore: +(1 - mean).toFixed(4),
      topSimilar: top.map((t) => ({
        url: docs[t.idx].url,
        score: +t.score.toFixed(4),
      })),
    };

    if ((i + 1) % 500 === 0 || i === N - 1) {
      const elapsed = ((Date.now() - t1) / 1000).toFixed(1);
      console.log(`[${name}] ${i + 1}/${N} (${elapsed}s)`);
    }
  }
  const t2 = Date.now();
  console.log(`[${name}] similitudes calculadas en ${((t2 - t1) / 1000).toFixed(1)}s`);
  return results;
}

// ---------- main ----------
const CLUSTERS = [
  { name: "rutas", dir: path.join(DIST, "rutas") },
  { name: "festivales", dir: path.join(DIST, "festivales") },
  { name: "conciertos", dir: path.join(DIST, "conciertos") },
  { name: "blog", dir: path.join(DIST, "blog") },
];

fs.mkdirSync(REPORTS_DIR, { recursive: true });
const gitignorePath = path.join(REPORTS_DIR, ".gitignore");
if (!fs.existsSync(gitignorePath)) {
  fs.writeFileSync(gitignorePath, "*\n!.gitignore\n");
}

const allResults = [];
for (const c of CLUSTERS) {
  const files = listHtmlFiles(c.dir);
  if (files.length === 0) {
    console.log(`[${c.name}] sin archivos, salto`);
    continue;
  }
  const res = processCluster(c.name, files, DIST);
  allResults.push({ cluster: c.name, results: res });
}

// ---------- output ----------
const today = new Date().toISOString().slice(0, 10);
const jsonPath = path.join(REPORTS_DIR, `uniqueness-${today}.json`);
const csvPath = path.join(REPORTS_DIR, `uniqueness-${today}.csv`);

fs.writeFileSync(jsonPath, JSON.stringify(allResults, null, 2));

const csvLines = [
  "url,type,wordCount,uniquenessScore,meanSim,topSimilarUrl,topSimilarScore",
];
for (const { results } of allResults) {
  for (const r of results) {
    const top = r.topSimilar[0] || { url: "", score: 0 };
    csvLines.push(
      [
        r.url,
        r.type,
        r.wordCount,
        r.uniquenessScore,
        r.meanSimilarity,
        top.url,
        top.score,
      ]
        .map((v) => (typeof v === "string" && v.includes(",") ? `"${v}"` : v))
        .join(",")
    );
  }
}
fs.writeFileSync(csvPath, csvLines.join("\n"));

console.log(`\n===== RESUMEN =====`);
console.log(`JSON: ${jsonPath}`);
console.log(`CSV:  ${csvPath}`);

const buckets = [
  { label: "<30%", min: 0, max: 0.3 },
  { label: "30-50%", min: 0.3, max: 0.5 },
  { label: "50-70%", min: 0.5, max: 0.7 },
  { label: ">70%", min: 0.7, max: 1.01 },
];

const lowUniqueRoutesCount = { total: 0 };

for (const { cluster, results } of allResults) {
  console.log(`\n--- Cluster: ${cluster} (${results.length} docs) ---`);
  const dist = buckets.map((b) => ({
    label: b.label,
    count: results.filter(
      (r) => r.uniquenessScore >= b.min && r.uniquenessScore < b.max
    ).length,
  }));
  for (const d of dist) console.log(`  uniqueness ${d.label.padEnd(7)}: ${d.count}`);

  if (cluster === "rutas") {
    lowUniqueRoutesCount.total = results.filter((r) => r.uniquenessScore < 0.3).length;
  }

  // top-10 peores
  const sorted = [...results].sort(
    (a, b) => a.uniquenessScore - b.uniquenessScore
  );
  console.log(`  Top-10 peores (más duplicadas):`);
  for (const r of sorted.slice(0, 10)) {
    console.log(
      `    ${r.uniquenessScore.toFixed(3)}  wc=${r.wordCount}  ${r.url}  ~  ${
        r.topSimilar[0]?.url || ""
      } (${r.topSimilar[0]?.score?.toFixed(3) || "-"})`
    );
  }
}

console.log(`\n[decisión preliminar] rutas con uniqueness <30%: ${lowUniqueRoutesCount.total}`);

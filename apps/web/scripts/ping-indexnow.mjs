#!/usr/bin/env node
/**
 * ping-indexnow.mjs
 *
 * Notifies the IndexNow API (Bing, Yandex, Seznam, Naver) of URLs that may
 * have changed since the last build. ChatGPT Search uses the Bing index, so
 * this is the fastest path to AI-Overview / ChatGPT visibility after a deploy.
 *
 * USAGE
 *   INDEXNOW_KEY=<32-char-key> node scripts/ping-indexnow.mjs            # full ingest
 *   INDEXNOW_KEY=<32-char-key> node scripts/ping-indexnow.mjs --dry-run  # show only
 *
 * The companion `npm run indexnow:ping` script wraps this.
 *
 * SETUP
 *   1. Generate a key (32 hex chars): https://www.bing.com/indexnow
 *   2. Create `apps/web/public/<INDEXNOW_KEY>.txt` whose content is the key itself
 *      (this is how IndexNow proves you own the domain).
 *   3. Export INDEXNOW_KEY (locally) or store in Cloudflare via wrangler secret.
 *
 * SAFETY
 *   - This is NOT hooked to `npm run build`. Rate limits are generous but the
 *     spec discourages duplicate submissions; run only after substantial content
 *     change (new festivals, new blog wave, schema overhaul).
 *   - Spec caps at 10,000 URLs per request — script enforces this.
 *
 * EXIT CODES
 *   0 success / dry-run
 *   1 missing INDEXNOW_KEY (when not dry-run)
 *   2 sitemap parse error
 *   3 API non-2xx response
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const REPORTS = path.join(__dirname, "reports");

const SITE = "https://concertride.me";
const HOST = "concertride.me";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

const DRY_RUN = process.argv.includes("--dry-run");
const KEY = process.env.INDEXNOW_KEY?.trim();

/**
 * Extracts <loc>https://...</loc> URLs from a sitemap XML file.
 */
async function extractUrlsFromSitemap(filePath) {
  if (!existsSync(filePath)) return [];
  const xml = await readFile(filePath, "utf-8");
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  return matches.filter((u) => u.startsWith("http"));
}

/**
 * Reads sitemap index files and recursively pulls every page <loc>.
 * A URL is treated as a "child sitemap" (not a page) if its path ends in `.xml`.
 */
async function collectAllUrls() {
  const allUrls = new Set();
  const seenSitemaps = new Set();

  /** @param {string} filePath */
  async function processFile(filePath) {
    if (seenSitemaps.has(filePath)) return;
    seenSitemaps.add(filePath);
    const urls = await extractUrlsFromSitemap(filePath);
    for (const u of urls) {
      if (u.endsWith(".xml")) {
        // child sitemap — recurse into the corresponding local file in dist/
        const fileName = u.split("/").pop();
        if (!fileName) continue;
        await processFile(path.join(DIST, fileName));
      } else {
        allUrls.add(u);
      }
    }
  }

  await processFile(path.join(DIST, "sitemap-index.xml"));
  await processFile(path.join(DIST, "sitemap.xml"));

  return [...allUrls];
}

/**
 * Splits URLs into chunks of at most maxSize (10,000 per IndexNow spec).
 */
function chunk(arr, maxSize = 10_000) {
  const out = [];
  for (let i = 0; i < arr.length; i += maxSize) out.push(arr.slice(i, i + maxSize));
  return out;
}

async function submitBatch(urls, key) {
  const body = {
    host: HOST,
    key,
    keyLocation: `${SITE}/${key}.txt`,
    urlList: urls,
  };
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  return { status: res.status, ok: res.ok || res.status === 202 };
}

async function main() {
  console.log("indexnow: collecting URLs from dist/ sitemaps...");
  if (!existsSync(DIST)) {
    console.error(`indexnow: dist/ not found at ${DIST}. Run \`npm run build\` first.`);
    process.exit(2);
  }

  const urls = await collectAllUrls();
  console.log(`indexnow: collected ${urls.length} unique URLs.`);

  if (urls.length === 0) {
    console.error("indexnow: no URLs found — sitemap parse error?");
    process.exit(2);
  }

  if (DRY_RUN) {
    console.log("indexnow: --dry-run, NOT submitting. Sample of first 10:");
    for (const u of urls.slice(0, 10)) console.log("  -", u);
    process.exit(0);
  }

  if (!KEY) {
    console.error("indexnow: INDEXNOW_KEY env var is required (or pass --dry-run).");
    console.error("indexnow: generate at https://www.bing.com/indexnow then `set INDEXNOW_KEY=...` (Windows) or `export INDEXNOW_KEY=...` (POSIX).");
    process.exit(1);
  }

  // Verify the key.txt file exists in dist/ — otherwise IndexNow will silently reject.
  const keyTxtPath = path.join(DIST, `${KEY}.txt`);
  if (!existsSync(keyTxtPath)) {
    console.warn(`indexnow: WARN — ${keyTxtPath} does NOT exist.`);
    console.warn(`indexnow: IndexNow requires GET ${SITE}/${KEY}.txt to return the literal key.`);
    console.warn(`indexnow: Create apps/web/public/${KEY}.txt with content "${KEY}" and rebuild.`);
  }

  const batches = chunk(urls, 10_000);
  const results = [];
  let totalSubmitted = 0;
  let hadFailure = false;

  for (const [i, batch] of batches.entries()) {
    console.log(`indexnow: submitting batch ${i + 1}/${batches.length} (${batch.length} URLs)...`);
    try {
      const { status, ok } = await submitBatch(batch, KEY);
      results.push({ batch: i + 1, size: batch.length, status, ok });
      if (ok) {
        totalSubmitted += batch.length;
        console.log(`indexnow:   status ${status} OK`);
      } else {
        hadFailure = true;
        console.warn(`indexnow:   status ${status} NOT OK`);
      }
    } catch (err) {
      hadFailure = true;
      console.error(`indexnow:   error:`, err.message);
      results.push({ batch: i + 1, size: batch.length, status: 0, ok: false, error: err.message });
    }
  }

  await mkdir(REPORTS, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const reportPath = path.join(REPORTS, `indexnow-${today}.json`);
  await writeFile(
    reportPath,
    JSON.stringify(
      { date: today, totalUrls: urls.length, totalSubmitted, batches: results },
      null,
      2,
    ),
  );

  console.log(`indexnow: done. Submitted ${totalSubmitted}/${urls.length} URLs.`);
  console.log(`indexnow: report saved to ${reportPath}`);
  process.exit(hadFailure ? 3 : 0);
}

main().catch((err) => {
  console.error("indexnow: unhandled error:", err);
  process.exit(2);
});

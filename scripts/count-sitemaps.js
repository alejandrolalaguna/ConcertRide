#!/usr/bin/env node
// Count <url> entries in sitemap XML files under apps/web/dist and
// compare with previous run stored at apps/web/dist/sitemap-counts.json

import fs from 'fs';
import path from 'path';
import glob from 'glob';

const DIST = path.join(process.cwd(), 'apps', 'web', 'dist');
const OUT_JSON = path.join(DIST, 'sitemap-counts.json');

function countUrlsInFile(filePath) {
  try {
    const s = fs.readFileSync(filePath, 'utf8');
    // count <url> occurrences (simple and robust enough)
    const matches = s.match(/<url>/g);
    return matches ? matches.length : 0;
  } catch (err) {
    return 0;
  }
}

function main() {
  if (!fs.existsSync(DIST)) {
    console.error(`dist folder not found: ${DIST}`);
    process.exit(2);
  }

  const files = glob.sync(path.join(DIST, 'sitemap*.xml'))
    .concat(glob.sync(path.join(DIST, 'sitemap-*.xml')))
    .concat(glob.sync(path.join(DIST, 'sitemap.xml')))
    .filter(Boolean);

  if (files.length === 0) {
    console.error('No sitemap XML files found under apps/web/dist');
    process.exit(1);
  }

  const counts = {};
  let total = 0;
  for (const f of files) {
    const name = path.basename(f);
    const c = countUrlsInFile(f);
    counts[name] = c;
    total += c;
  }

  const now = new Date().toISOString();
  const report = { generatedAt: now, total, files: counts };

  let prev = null;
  if (fs.existsSync(OUT_JSON)) {
    try {
      prev = JSON.parse(fs.readFileSync(OUT_JSON, 'utf8'));
    } catch (err) {
      prev = null;
    }
  }

  console.log('Sitemap counts:');
  for (const [k, v] of Object.entries(counts)) {
    const prevV = prev && prev.files && prev.files[k] ? prev.files[k] : null;
    const diff = prevV == null ? ' (new)' : ` (${v - prevV >= 0 ? '+' : ''}${v - prevV})`;
    console.log(` - ${k}: ${v}${diff}`);
  }
  console.log(`Total URLs: ${total}${prev && typeof prev.total === 'number' ? ` (prev ${prev.total}, diff ${total - prev.total >= 0 ? '+' : ''}${total - prev.total})` : ''}`);

  try {
    fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), 'utf8');
    console.log(`Wrote report to ${OUT_JSON}`);
  } catch (err) {
    console.error('Failed to write output JSON', err);
  }
}

main();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

function extractMeta(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                    html.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  return {
    title: titleMatch ? titleMatch[1] : null,
    desc: descMatch ? descMatch[1] : null,
  };
}

const issues = [];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.name === 'index.html') {
      const rel = '/' + path.relative(distDir, fullPath).replace(/\\/g, '/').replace(/\/?index\.html$/, '');
      const html = fs.readFileSync(fullPath, 'utf8');
      const { title, desc } = extractMeta(html);
      const tl = title ? title.length : 0;
      const dl = desc ? desc.length : 0;
      if (tl > 65 || tl < 40 || dl > 160 || dl < 120) {
        issues.push({ rel, tl, dl, title, desc });
      }
    }
  }
}

scanDir(distDir);

// Group by second segment (first path segment after /)
const byPrefix = {};
for (const issue of issues) {
  const parts = issue.rel.split('/').filter(Boolean);
  const prefix = parts[0] || 'root';
  if (!byPrefix[prefix]) byPrefix[prefix] = { titleOver: [], titleUnder: [], descOver: [], descUnder: [], all: [] };
  byPrefix[prefix].all.push(issue);
  if (issue.tl > 65) byPrefix[prefix].titleOver.push(issue);
  if (issue.tl < 40) byPrefix[prefix].titleUnder.push(issue);
  if (issue.dl > 160) byPrefix[prefix].descOver.push(issue);
  if (issue.dl < 120) byPrefix[prefix].descUnder.push(issue);
}

console.log('Total issues:', issues.length);
console.log('\n=== By prefix ===');
for (const [p, g] of Object.entries(byPrefix).sort((a, b) => b[1].all.length - a[1].all.length)) {
  console.log(`\n/${p}: ${g.all.length} total (t>65:${g.titleOver.length} t<40:${g.titleUnder.length} d>160:${g.descOver.length} d<120:${g.descUnder.length})`);
  if (g.titleOver.length > 0) {
    console.log('  Title > 65 samples:');
    g.titleOver.slice(0, 3).forEach(i => console.log(`    ${i.rel} [${i.tl}]: ${i.title}`));
  }
  if (g.descOver.length > 0) {
    console.log('  Desc > 160 samples:');
    g.descOver.slice(0, 3).forEach(i => console.log(`    ${i.rel} [${i.dl}]: ${i.desc}`));
  }
  if (g.titleUnder.length > 0) {
    console.log('  Title < 40 samples:');
    g.titleUnder.slice(0, 3).forEach(i => console.log(`    ${i.rel} [${i.tl}]: ${i.title}`));
  }
  if (g.descUnder.length > 0) {
    console.log('  Desc < 120 samples:');
    g.descUnder.slice(0, 3).forEach(i => console.log(`    ${i.rel} [${i.dl}]: ${i.desc}`));
  }
}

// Also print full lists for the biggest categories
console.log('\n\n=== Full title > 65 list ===');
issues.filter(i => i.tl > 65).forEach(i => console.log(`  ${i.rel} [${i.tl}]: ${i.title}`));

console.log('\n\n=== Full desc > 160 list ===');
issues.filter(i => i.dl > 160).forEach(i => console.log(`  ${i.rel} [${i.dl}]: ${i.desc?.slice(0, 120)}`));

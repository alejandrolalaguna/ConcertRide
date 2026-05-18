#!/usr/bin/env node
/**
 * audit-internal-links.mjs
 *
 * Audit DEEP de internal linking entre los 4 tipos de páginas:
 *   1. Blog → Festival   (relatedLinks en blogPosts.ts apuntando a /festivales/{slug})
 *   2. City → Routes     (calendarLandings.ts no tiene relatedLinks aún → reportamos gap)
 *   3. Artist → Festival (relatedFestivals[] en artistLandings.ts)
 *   4. Festival → Routes (revisión sanity — suele estar ok porque ROUTE_LANDINGS deriva de FESTIVAL_LANDINGS)
 *
 * El script parsea las fuentes TS (no el HTML prerenderizado) y detecta:
 *   - Menciones de nombres de festivales en `excerpt`/`lede` de un post sin link a `/festivales/{slug}`.
 *   - Cities/Calendar landings con < 3 routes salientes enlazadas.
 *   - Artists con `upcomingConcerts` cuyo venue/festival no está en `relatedFestivals`.
 *
 * Output:
 *   - apps/web/scripts/reports/internal-links-YYYY-MM-DD.json
 *   - Resumen por stdout (top 20 gaps).
 *
 * Uso: node apps/web/scripts/audit-internal-links.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const LIB = path.join(ROOT, "src", "lib");
const REPORTS_DIR = path.join(__dirname, "reports");
const DIST_RUTAS = path.join(ROOT, "dist", "rutas");

if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

const today = new Date().toISOString().slice(0, 10);

// ─── Source readers (regex-based, no TS compiler) ───────────────────────
function readSource(name) {
  const p = path.join(LIB, name);
  if (!fs.existsSync(p)) {
    console.error(`[audit-internal-links] Missing source: ${p}`);
    process.exit(1);
  }
  return fs.readFileSync(p, "utf8");
}

const blogSrc = readSource("blogPosts.ts");
const festivalSrc = readSource("festivalLandings.ts");
const artistSrc = readSource("artistLandings.ts");
const calendarSrc = readSource("calendarLandings.ts");
const citySrc = readSource("cityLandings.ts");

// ─── Festival index (slug → {name, shortName, city, citySlug}) ──────────
// Block-scan: each festival entry starts at `slug: "xxx",`. Capture up to next `slug:` or end.
function indexFestivals(src) {
  const out = {};
  const blockRe = /\{\s*slug:\s*"([a-z0-9-]+)",[\s\S]*?(?=\{\s*slug:\s*"[a-z0-9-]+"|export const FESTIVAL_LANDINGS_BY_SLUG)/g;
  let m;
  while ((m = blockRe.exec(src)) !== null) {
    const block = m[0];
    const slug = m[1];
    const nameM = block.match(/\bname:\s*"([^"]+)"/);
    const shortM = block.match(/\bshortName:\s*"([^"]+)"/);
    const cityM = block.match(/\bcity:\s*"([^"]+)"/);
    const citySlugM = block.match(/\bcitySlug:\s*"([^"]+)"/);
    if (!nameM) continue;
    out[slug] = {
      slug,
      name: nameM[1],
      shortName: shortM ? shortM[1] : nameM[1],
      city: cityM ? cityM[1] : null,
      citySlug: citySlugM ? citySlugM[1] : null,
    };
  }
  return out;
}
const FESTIVALS = indexFestivals(festivalSrc);
const FESTIVAL_SLUGS = Object.keys(FESTIVALS);

// Build name → slug map (longest-first to prefer "Mad Cool Festival" over "Mad Cool")
function buildNameToSlug() {
  const candidates = [];
  for (const f of Object.values(FESTIVALS)) {
    const names = new Set([f.name, f.shortName]);
    // Conservative strip: only kill trailing year, do NOT strip "Festival"/"Fest" because
    // that turns "Festival de Música de Vigo" into "Vigo", causing massive false positives
    // against any blog post that mentions the city Vigo.
    for (const n of [...names]) {
      const stripped = n.replace(/\s+\d{4}$/, "").trim();
      if (stripped.length >= 6 && stripped !== n) names.add(stripped);
    }
    for (const n of names) {
      if (!n || n.length < 6) continue;
      candidates.push({ name: n, slug: f.slug });
    }
  }
  // Sort longest-first
  candidates.sort((a, b) => b.name.length - a.name.length);
  return candidates;
}
const NAME_TO_SLUG = buildNameToSlug();

// ─── Blog posts parsing ─────────────────────────────────────────────────
function parseBlogPosts(src) {
  const posts = [];
  // Each post is an object inside the BLOG_POSTS array. We find slugs and grab a window after each.
  const slugRe = /^\s{2}\{\s*\n\s+slug:\s*"([a-z0-9-]+)"/gm;
  const slugs = [];
  let m;
  while ((m = slugRe.exec(src)) !== null) {
    slugs.push({ slug: m[1], start: m.index });
  }
  for (let i = 0; i < slugs.length; i++) {
    const start = slugs[i].start;
    const end = i + 1 < slugs.length ? slugs[i + 1].start : src.length;
    const block = src.slice(start, end);
    const slug = slugs[i].slug;
    const excerptM = block.match(/\bexcerpt:\s*\n?\s*"((?:[^"\\]|\\.)*)"/);
    const ledeM = block.match(/\blede:\s*\n?\s*"((?:[^"\\]|\\.)*)"/);
    const titleM = block.match(/\btitle:\s*"((?:[^"\\]|\\.)*)"/);
    // Capture all `to:` URLs in relatedLinks block
    const relatedBlockM = block.match(/relatedLinks:\s*\[([\s\S]*?)\]\s*,/);
    const relatedTos = [];
    if (relatedBlockM) {
      const inner = relatedBlockM[1];
      const toRe = /to:\s*"([^"]+)"/g;
      let tm;
      while ((tm = toRe.exec(inner)) !== null) relatedTos.push(tm[1]);
    }
    const hasRelatedLinks = !!relatedBlockM;
    posts.push({
      slug,
      title: titleM ? titleM[1] : "",
      excerpt: excerptM ? excerptM[1] : "",
      lede: ledeM ? ledeM[1] : "",
      relatedTos,
      hasRelatedLinks,
      blockStart: start,
      blockEnd: end,
    });
  }
  // Filter disabled
  const disabledRe = /DISABLED_BLOG_SLUGS:[\s\S]*?new Set\(\[([\s\S]*?)\]\)/;
  const dm = src.match(disabledRe);
  const disabled = new Set();
  if (dm) {
    const innerRe = /"([a-z0-9-]+)"/g;
    let dmm;
    while ((dmm = innerRe.exec(dm[1])) !== null) disabled.add(dmm[1]);
  }
  return { posts: posts.filter((p) => !disabled.has(p.slug)), disabled };
}
const { posts: BLOG_POSTS_PARSED, disabled: DISABLED_BLOG_SLUGS } = parseBlogPosts(blogSrc);

// ─── Artist landings parsing ────────────────────────────────────────────
function parseArtists(src) {
  const out = [];
  const blockRe = /\{\s*slug:\s*"([a-z0-9-]+)",\s*\n\s*name:\s*"([^"]+)",[\s\S]*?(?=\n\s*\{\s*slug:\s*"[a-z0-9-]+",\s*\n\s*name:|export const ARTIST_LANDINGS_BY_SLUG|^\];)/gm;
  let m;
  while ((m = blockRe.exec(src)) !== null) {
    const block = m[0];
    const slug = m[1];
    const name = m[2];
    // Concerts venues + cities
    const concertsM = block.match(/upcomingConcerts:\s*\[([\s\S]*?)\],?\s*\n\s*relatedFestivals/);
    const concerts = [];
    if (concertsM) {
      const inner = concertsM[1];
      const cityRe = /\bcity:\s*"([^"]+)"/g;
      const venueRe = /\bvenue:\s*"([^"]+)"/g;
      const cities = [];
      const venues = [];
      let cm;
      while ((cm = cityRe.exec(inner)) !== null) cities.push(cm[1]);
      let vm;
      while ((vm = venueRe.exec(inner)) !== null) venues.push(vm[1]);
      for (let i = 0; i < Math.max(cities.length, venues.length); i++) {
        concerts.push({ city: cities[i] || null, venue: venues[i] || null });
      }
    }
    const blurbM = block.match(/\bblurb:\s*\n?\s*"((?:[^"\\]|\\.)*)"/);
    // relatedFestivals
    const rfM = block.match(/relatedFestivals:\s*\[([\s\S]*?)\]/);
    const relatedFestivals = [];
    if (rfM) {
      const rRe = /"([a-z0-9-]+)"/g;
      let rm;
      while ((rm = rRe.exec(rfM[1])) !== null) relatedFestivals.push(rm[1]);
    }
    out.push({
      slug,
      name,
      blurb: blurbM ? blurbM[1] : "",
      concerts,
      relatedFestivals,
      blockStart: m.index,
      blockEnd: m.index + block.length,
    });
  }
  return out;
}
const ARTISTS_PARSED = parseArtists(artistSrc);

// ─── Calendar landings parsing ──────────────────────────────────────────
function parseCalendar(src) {
  const out = [];
  const blockRe = /\{\s*\n\s*slug:\s*"([a-z0-9-]+)",[\s\S]*?(?=\n\s*\{\s*\n\s*slug:\s*"[a-z0-9-]+",|export const CALENDAR_LANDINGS_BY_SLUG)/g;
  let m;
  while ((m = blockRe.exec(src)) !== null) {
    const block = m[0];
    const slug = m[1];
    const festivalSlugsM = block.match(/festivalSlugs:\s*\[([\s\S]*?)\]/);
    const festivalSlugs = [];
    if (festivalSlugsM) {
      const fRe = /"([a-z0-9-]+)"/g;
      let fm;
      while ((fm = fRe.exec(festivalSlugsM[1])) !== null) festivalSlugs.push(fm[1]);
    }
    const monthM = block.match(/\bmonth:\s*"([^"]+)"/);
    // relatedLinks (may not exist yet)
    const relatedM = block.match(/relatedLinks:\s*\[([\s\S]*?)\]/);
    const relatedTos = [];
    if (relatedM) {
      const tRe = /to:\s*"([^"]+)"/g;
      let tm;
      while ((tm = tRe.exec(relatedM[1])) !== null) relatedTos.push(tm[1]);
    }
    out.push({
      slug,
      month: monthM ? monthM[1] : "",
      festivalSlugs,
      relatedTos,
      hasRelatedLinks: !!relatedM,
      blockStart: m.index,
      blockEnd: m.index + block.length,
    });
  }
  return out;
}
const CALENDAR_PARSED = parseCalendar(calendarSrc);

// ─── City landings parsing (slug + city + display) ──────────────────────
function parseCities(src) {
  const out = [];
  const blockRe = /\{\s*\n\s*slug:\s*"([a-z0-9-]+)",\s*\n\s*city:\s*"([^"]+)",[\s\S]*?(?=\n\s*\{\s*\n\s*slug:\s*"[a-z0-9-]+",|export const CITY_LANDINGS_BY_SLUG)/g;
  let m;
  while ((m = blockRe.exec(src)) !== null) {
    out.push({ slug: m[1], city: m[2] });
  }
  return out;
}
const CITIES_PARSED = parseCities(citySrc);

// ─── Available routes from /dist/rutas/ ─────────────────────────────────
const AVAILABLE_ROUTE_SLUGS = (() => {
  if (!fs.existsSync(DIST_RUTAS)) return [];
  return fs.readdirSync(DIST_RUTAS).filter((d) => /^[a-z0-9-]+$/.test(d));
})();

function routesFromCity(citySlug) {
  // route slug = `{origin-city-slug}-{festival-slug}`
  // We need routes whose prefix matches citySlug- and the suffix is a known festival slug.
  const out = [];
  for (const r of AVAILABLE_ROUTE_SLUGS) {
    if (!r.startsWith(citySlug + "-")) continue;
    const tail = r.slice(citySlug.length + 1);
    if (FESTIVAL_SLUGS.includes(tail)) {
      out.push({ slug: r, festivalSlug: tail });
    }
  }
  return out;
}

// ─── Detection: Blog → Festival gaps ────────────────────────────────────
function findBlogFestivalGaps() {
  const gaps = [];
  for (const post of BLOG_POSTS_PARSED) {
    const haystack = (post.excerpt + " \n " + post.lede + " \n " + post.title).toLowerCase();
    if (!haystack.trim()) continue;
    const linkedFestivalSlugs = new Set(
      post.relatedTos
        .filter((to) => to.startsWith("/festivales/"))
        .map((to) => to.replace("/festivales/", ""))
    );
    const mentioned = new Set();
    const usedRanges = []; // avoid double-counting "Mad Cool" inside "Mad Cool Festival"
    for (const c of NAME_TO_SLUG) {
      const lower = c.name.toLowerCase();
      let idx = 0;
      while ((idx = haystack.indexOf(lower, idx)) !== -1) {
        const before = idx === 0 ? " " : haystack[idx - 1];
        const after = idx + lower.length >= haystack.length ? " " : haystack[idx + lower.length];
        const isWordBoundary = !/[a-zñáéíóúü0-9]/i.test(before) && !/[a-zñáéíóúü0-9]/i.test(after);
        const overlap = usedRanges.some(([s, e]) => idx < e && idx + lower.length > s);
        if (isWordBoundary && !overlap) {
          mentioned.add(c.slug);
          usedRanges.push([idx, idx + lower.length]);
        }
        idx += lower.length;
      }
    }
    const missing = [...mentioned].filter((s) => !linkedFestivalSlugs.has(s));
    if (missing.length > 0) {
      gaps.push({
        postSlug: post.slug,
        mentioned: [...mentioned],
        linked: [...linkedFestivalSlugs],
        missing,
      });
    }
  }
  return gaps;
}
const BLOG_FESTIVAL_GAPS = findBlogFestivalGaps();

// ─── Detection: City/Calendar → Routes gaps ─────────────────────────────
function findCalendarRouteGaps() {
  // calendar entries don't have a city → check festivalSlugs covered by relatedLinks
  const gaps = [];
  for (const cal of CALENDAR_PARSED) {
    const linkedRoutes = cal.relatedTos.filter((to) => to.startsWith("/rutas/")).length;
    if (linkedRoutes < 3) {
      gaps.push({
        calendarSlug: cal.slug,
        month: cal.month,
        currentRouteCount: linkedRoutes,
        festivalSlugs: cal.festivalSlugs,
      });
    }
  }
  return gaps;
}
const CALENDAR_ROUTE_GAPS = findCalendarRouteGaps();

// City landings: count linked routes from CityLandingPage perspective — informational only
function findCityRouteCoverage() {
  return CITIES_PARSED.map((c) => ({
    citySlug: c.slug,
    city: c.city,
    availableRoutes: routesFromCity(c.slug).length,
  })).filter((c) => c.availableRoutes < 3);
}
const CITY_ROUTE_COVERAGE = findCityRouteCoverage();

// ─── Detection: Artist → Festival gaps ──────────────────────────────────
function findArtistFestivalGaps() {
  const gaps = [];
  for (const artist of ARTISTS_PARSED) {
    const haystack = (
      artist.blurb +
      " " +
      artist.concerts.map((c) => `${c.city} ${c.venue}`).join(" ")
    ).toLowerCase();
    const linkedSet = new Set(artist.relatedFestivals);
    const mentioned = new Set();
    const usedRanges = [];
    for (const c of NAME_TO_SLUG) {
      const lower = c.name.toLowerCase();
      let idx = 0;
      while ((idx = haystack.indexOf(lower, idx)) !== -1) {
        const before = idx === 0 ? " " : haystack[idx - 1];
        const after = idx + lower.length >= haystack.length ? " " : haystack[idx + lower.length];
        const isWordBoundary = !/[a-zñáéíóúü0-9]/i.test(before) && !/[a-zñáéíóúü0-9]/i.test(after);
        const overlap = usedRanges.some(([s, e]) => idx < e && idx + lower.length > s);
        if (isWordBoundary && !overlap) {
          mentioned.add(c.slug);
          usedRanges.push([idx, idx + lower.length]);
        }
        idx += lower.length;
      }
    }
    const missing = [...mentioned].filter((s) => !linkedSet.has(s));
    if (missing.length > 0) {
      gaps.push({
        artistSlug: artist.slug,
        name: artist.name,
        linked: [...linkedSet],
        missing,
      });
    }
  }
  return gaps;
}
const ARTIST_FESTIVAL_GAPS = findArtistFestivalGaps();

// ─── Summary ────────────────────────────────────────────────────────────
const report = {
  generatedAt: new Date().toISOString(),
  counts: {
    festivals: FESTIVAL_SLUGS.length,
    blogPosts: BLOG_POSTS_PARSED.length,
    artists: ARTISTS_PARSED.length,
    calendar: CALENDAR_PARSED.length,
    cities: CITIES_PARSED.length,
    availableRoutes: AVAILABLE_ROUTE_SLUGS.length,
    disabledBlogSlugs: [...DISABLED_BLOG_SLUGS],
  },
  blogFestivalGaps: {
    total: BLOG_FESTIVAL_GAPS.length,
    totalMissingLinks: BLOG_FESTIVAL_GAPS.reduce((a, g) => a + g.missing.length, 0),
    items: BLOG_FESTIVAL_GAPS,
  },
  calendarRouteGaps: {
    total: CALENDAR_ROUTE_GAPS.length,
    items: CALENDAR_ROUTE_GAPS,
  },
  cityRouteCoverage: {
    total: CITY_ROUTE_COVERAGE.length,
    items: CITY_ROUTE_COVERAGE,
  },
  artistFestivalGaps: {
    total: ARTIST_FESTIVAL_GAPS.length,
    totalMissingLinks: ARTIST_FESTIVAL_GAPS.reduce((a, g) => a + g.missing.length, 0),
    items: ARTIST_FESTIVAL_GAPS,
  },
};

const reportPath = path.join(REPORTS_DIR, `internal-links-${today}.json`);
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");

// ─── Stdout summary ─────────────────────────────────────────────────────
console.log(`\n=== Internal Linking Audit — ${today} ===`);
console.log(
  `Festivals: ${report.counts.festivals} | Blog: ${report.counts.blogPosts} | Artists: ${report.counts.artists} | Calendar: ${report.counts.calendar} | Cities: ${report.counts.cities} | Routes(dist): ${report.counts.availableRoutes}`
);
console.log(
  `\n[Blog → Festival] ${report.blogFestivalGaps.total} posts with gaps, ${report.blogFestivalGaps.totalMissingLinks} missing links total.`
);
const topBlog = [...BLOG_FESTIVAL_GAPS]
  .sort((a, b) => b.missing.length - a.missing.length)
  .slice(0, 20);
for (const g of topBlog) {
  console.log(`  - ${g.postSlug} → missing: ${g.missing.join(", ")}`);
}

console.log(
  `\n[Calendar → Routes] ${report.calendarRouteGaps.total} calendar entries with < 3 outgoing route links.`
);
for (const c of CALENDAR_ROUTE_GAPS.slice(0, 20)) {
  console.log(`  - ${c.calendarSlug} (${c.month}) — ${c.currentRouteCount} route links`);
}

console.log(
  `\n[Cities < 3 available routes] ${report.cityRouteCoverage.total} cities (informational).`
);
for (const c of CITY_ROUTE_COVERAGE.slice(0, 10)) {
  console.log(`  - ${c.citySlug} (${c.city}) — ${c.availableRoutes} routes`);
}

console.log(
  `\n[Artist → Festival] ${report.artistFestivalGaps.total} artists with gaps, ${report.artistFestivalGaps.totalMissingLinks} missing links total.`
);
const topArtist = [...ARTIST_FESTIVAL_GAPS]
  .sort((a, b) => b.missing.length - a.missing.length)
  .slice(0, 20);
for (const g of topArtist) {
  console.log(`  - ${g.artistSlug} (${g.name}) → missing: ${g.missing.join(", ")}`);
}

console.log(`\nReport written to: ${path.relative(process.cwd(), reportPath)}\n`);

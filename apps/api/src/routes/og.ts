import { Hono } from "hono";
import type { HonoEnv } from "../types";
import { ROUTE_LANDINGS } from "../../../web/src/lib/routeLandings";
import { FESTIVAL_LANDINGS_BY_SLUG } from "../../../web/src/lib/festivalLandings";
// Note: festival variant looks up FESTIVAL_LANDINGS_BY_SLUG; route variant
// gets festival metadata via landing.festival inline (no extra lookup).

const route = new Hono<HonoEnv>();

// Dynamic OG card per route (origin city → festival). 1200×630 SVG, edge
// cached. Same pattern as /api/memories/:id/share-image.svg — no
// rasterization in the Worker.
route.get("/route/:slug.svg", (c) => {
  const slug = c.req.param("slug");
  const landing = ROUTE_LANDINGS.find((r) => r.slug === slug);
  if (!landing) return c.text("not found", 404);
  // Per-festival accent color is derived deterministically from the slug
  // hash so each festival gets a stable identity even though the data
  // model doesn't carry an explicit `heroColor` yet.
  const heroColor = colorFromSlug(landing.festival.slug);
  const heroFg = isDarkColor(heroColor) ? "#f0f0f4" : "#060608";
  const priceRange = landing.originData.concertRideRange;
  const km = landing.originData.km;
  const time = landing.originData.drivingTime;
  const year = new Date(landing.festival.startDate).getFullYear();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#060608"/>
      <stop offset="100%" stop-color="#0e0e14"/>
    </linearGradient>
    <radialGradient id="glow" cx="0%" cy="0%" r="80%">
      <stop offset="0%" stop-color="${heroColor}" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="${heroColor}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="6" fill="${heroColor}"/>
  <text x="60" y="80" font-family="ui-monospace, SFMono-Regular, monospace" font-size="20" font-weight="700" fill="#7a7a8e" letter-spacing="6">CR · ROUTE · ${year}</text>
  <rect x="990" y="50" width="160" height="44" fill="${heroColor}"/>
  <text x="1070" y="80" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, monospace" font-size="22" font-weight="800" fill="${heroFg}" letter-spacing="4">${escapeXml(priceRange).toUpperCase()}</text>
  <text x="60" y="220" font-family="Archivo Black, Impact, sans-serif" font-size="78" font-weight="900" fill="#f0f0f4">${escapeXml(landing.originCity).toUpperCase()}</text>
  <text x="60" y="290" font-family="Archivo Black, Impact, sans-serif" font-size="48" font-weight="900" fill="${heroColor}">→ ${escapeXml(landing.festival.shortName).toUpperCase()}</text>
  <line x1="60" y1="500" x2="1140" y2="500" stroke="#252530" stroke-width="2"/>
  <text x="60" y="555" font-family="ui-monospace, SFMono-Regular, monospace" font-size="22" font-weight="700" fill="#7a7a8e" letter-spacing="6">${km} KM · ${escapeXml(time).toUpperCase()} · 0% COMISIÓN</text>
  <text x="1140" y="555" text-anchor="end" font-family="ui-monospace, SFMono-Regular, monospace" font-size="22" font-weight="700" fill="${heroColor}" letter-spacing="4">CONCERTRIDE.ME</text>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      // 7d cache — route data changes very rarely.
      "cache-control": "public, max-age=604800, s-maxage=604800",
    },
  });
});

// Same pattern for festivals.
route.get("/festival/:slug.svg", (c) => {
  const slug = c.req.param("slug");
  const festival = slug ? FESTIVAL_LANDINGS_BY_SLUG[slug] : undefined;
  if (!festival) return c.text("not found", 404);
  const heroColor = colorFromSlug(festival.slug);
  const heroFg = isDarkColor(heroColor) ? "#f0f0f4" : "#060608";
  const year = new Date(festival.startDate).getFullYear();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#060608"/>
      <stop offset="100%" stop-color="#0e0e14"/>
    </linearGradient>
    <radialGradient id="glow" cx="100%" cy="0%" r="100%">
      <stop offset="0%" stop-color="${heroColor}" stop-opacity="0.4"/>
      <stop offset="60%" stop-color="${heroColor}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="624" width="1200" height="6" fill="${heroColor}"/>
  <text x="60" y="80" font-family="ui-monospace, SFMono-Regular, monospace" font-size="20" font-weight="700" fill="#7a7a8e" letter-spacing="6">CR · FESTIVAL · ${year}</text>
  <text x="60" y="260" font-family="Archivo Black, Impact, sans-serif" font-size="120" font-weight="900" fill="#f0f0f4">${escapeXml(festival.shortName).toUpperCase()}</text>
  <text x="60" y="340" font-family="ui-monospace, SFMono-Regular, monospace" font-size="32" font-weight="700" fill="${heroColor}" letter-spacing="2">${escapeXml(festival.city).toUpperCase()} · ${escapeXml(festival.venue).toUpperCase()}</text>
  <line x1="60" y1="500" x2="1140" y2="500" stroke="#252530" stroke-width="2"/>
  <text x="60" y="555" font-family="ui-monospace, SFMono-Regular, monospace" font-size="22" font-weight="700" fill="#7a7a8e" letter-spacing="6">CARPOOLING DESDE 3€/ASIENTO · 0% COMISIÓN</text>
  <text x="1140" y="555" text-anchor="end" font-family="ui-monospace, SFMono-Regular, monospace" font-size="22" font-weight="700" fill="${heroColor}" letter-spacing="4">CONCERTRIDE.ME</text>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=604800, s-maxage=604800",
    },
  });
});

// Brand-consistent palette: lime, orange, pink, teal, violet, amber.
// Same set used in apps/web/src/index.css. Stable by slug hash.
const PALETTE = ["#dbff00", "#ff4f00", "#f759ab", "#00e5c8", "#9b59f7", "#ffb347"];
function colorFromSlug(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length]!;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isDarkColor(hex: string): boolean {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.replace("#", ""));
  if (!m) return false;
  const n = parseInt(m[1]!, 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 128;
}

export default route;

// Programmatic route pages: /rutas/[origin-city-slug]-[festival-slug]
// Each page targets long-tail queries like:
//   "carpooling Madrid Mad Cool", "viaje compartido Valencia Primavera Sound"
//
// Data is derived 100% from festivalLandings.ts — no duplication.
// A RouteLanding is generated for every (originCity × festival) pair,
// subject to the distance gate (see DISTANCE GATE section below).

import { FESTIVAL_LANDINGS, type FestivalLanding, type OriginCity } from "./festivalLandings";
import { CITY_LANDINGS } from "./cityLandings";

export interface RouteLanding {
  /** URL-safe slug: "madrid-mad-cool" */
  slug: string;
  originCity: string;
  originCitySlug: string;
  festival: FestivalLanding;
  originData: OriginCity;
}

function cityToSlug(city: string): string {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─────────────────────────────────────────────────────────────────────────────
// Distance gate (tightened 2026-05-21)
// ─────────────────────────────────────────────────────────────────────────────
// Skip route pages where origin↔festival straight-line >700 km, because no
// carpooling driver realistically does a single-leg trip that long (a 700 km
// straight line is roughly 945 km of road and ~10 h of driving). Primary
// effects:
//   - Removing Canarias↔mainland and Baleares↔mainland combinations where
//     there's no ferry-bundled context (also handled by ISLAND_*_SLUGS).
//   - Keeping route-page asset count safely under Cloudflare Workers' Free
//     plan limit of 20,000 files per manifest. With 199 festivals × ~116
//     cities the unbounded set would be ~20k routes; capping at 700 km
//     straight brings it down to ~18.1k routes (~19.9k total dist/ assets).
//
// Two layers of defence:
//   1. Hard cross-sea exclusion via ISLAND_*_SLUGS sets (works even if lat/lng
//      were missing on one side).
//   2. Haversine >700 km check (catches any future case we forgot to enumerate).
//
// Reviewers can override either layer by adding `${citySlug}|${festivalSlug}`
// to DISTANCE_GATE_ALLOWLIST (e.g. once we publish ferry+drive bundles).
// All currently-curated festival.originCities are <700 km from their festival
// (verified 2026-05-21 via scripts/_measure-route-buckets.mjs).
const MAX_ROUTE_STRAIGHT_KM = 700;

// CityLanding slugs known to be on islands (no road link to mainland).
const ISLAND_CITY_SLUGS = new Set<string>([
  "palma",                      // Mallorca
  "ibiza",                      // Ibiza
  "las-palmas-de-gran-canaria", // Gran Canaria
  "santa-cruz-de-tenerife",     // Tenerife
]);

// FestivalLanding slugs known to be on islands.
const ISLAND_FESTIVAL_SLUGS = new Set<string>([
  "mallorca-live-festival", // Mallorca (Baleares)
  "granca-live-fest",       // Gran Canaria (Canarias)
]);

// Same-archipelago island↔island pairs are kept; cross-archipelago is filtered.
const ARCHIPELAGO_OF = new Map<string, "baleares" | "canarias">([
  ["palma", "baleares"],
  ["ibiza", "baleares"],
  ["mallorca-live-festival", "baleares"],
  ["las-palmas-de-gran-canaria", "canarias"],
  ["santa-cruz-de-tenerife", "canarias"],
  ["granca-live-fest", "canarias"],
]);

const DISTANCE_GATE_ALLOWLIST = new Set<string>([
  // Add `${citySlug}|${festivalSlug}` entries here to override the filter.
  // (empty for now)
]);

function isCrossSeaCombo(originCitySlug: string, festivalSlug: string): boolean {
  const cityIsIsland = ISLAND_CITY_SLUGS.has(originCitySlug);
  const festivalIsIsland = ISLAND_FESTIVAL_SLUGS.has(festivalSlug);
  if (!cityIsIsland && !festivalIsIsland) return false;
  if (cityIsIsland && festivalIsIsland) {
    return ARCHIPELAGO_OF.get(originCitySlug) !== ARCHIPELAGO_OF.get(festivalSlug);
  }
  return true;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildRoutes(): RouteLanding[] {
  const routes: RouteLanding[] = [];
  for (const festival of FESTIVAL_LANDINGS) {
    // Merge explicit originCities from the festival with the canonical CITY_LANDINGS
    const seen = new Set<string>();
    // First, add the explicit originCities (trusted data) — still subject to
    // the distance gate (cross-sea or >700 km combos are dropped).
    for (const oc of festival.originCities) {
      const originSlug = cityToSlug(oc.city);
      seen.add(originSlug);
      const pairKey = `${originSlug}|${festival.slug}`;
      if (!DISTANCE_GATE_ALLOWLIST.has(pairKey)) {
        if (isCrossSeaCombo(originSlug, festival.slug)) continue;
        // OriginCity has no lat/lng — look up CITY_LANDINGS where available.
        const cityLanding = CITY_LANDINGS.find(
          (c) => cityToSlug(c.display || c.city) === originSlug,
        );
        if (cityLanding) {
          const straightKm = haversineKm(cityLanding.lat, cityLanding.lng, festival.lat, festival.lng);
          if (straightKm > MAX_ROUTE_STRAIGHT_KM) continue;
        }
      }
      routes.push({
        slug: `${originSlug}-${festival.slug}`,
        originCity: oc.city,
        originCitySlug: originSlug,
        festival,
        originData: oc,
      });
    }

    // Then, augment with canonical city landings to scale the number of routes.
    // We only add cities not already present in the festival originCities to avoid duplicates.
    for (const c of CITY_LANDINGS) {
      // Use the canonical slug from cityLandings (not re-derived from display),
      // so route slugs stay consistent with seoOverrides and sitemap entries.
      const originSlug = c.slug;
      if (seen.has(originSlug)) continue;
      seen.add(originSlug);
      const pairKey = `${originSlug}|${festival.slug}`;
      // Distance gate: skip cross-sea combos unless explicitly allowlisted.
      if (!DISTANCE_GATE_ALLOWLIST.has(pairKey) && isCrossSeaCombo(originSlug, festival.slug)) {
        continue;
      }
      // Estimate distance using Haversine formula from city coords to festival coords.
      const straightKm = haversineKm(c.lat, c.lng, festival.lat, festival.lng);
      // Skip implausibly-long single-leg drives (>700 km straight-line).
      if (straightKm > MAX_ROUTE_STRAIGHT_KM && !DISTANCE_GATE_ALLOWLIST.has(pairKey)) {
        continue;
      }
      // Road distance ≈ straight-line × 1.35 for Spain
      const km = Math.round(straightKm * 1.35);
      // Driving time at ~90 km/h average (motorways + urban)
      const hours = km / 90;
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      const drivingTime = h > 0 ? `${h}h ${m > 0 ? m + "min" : ""}`.trim() : `${m}min`;
      // Price estimate: €0.04/km per seat (fuel + wear ÷ 3 passengers)
      const priceMin = Math.max(3, Math.round(km * 0.04));
      const priceMax = Math.max(5, Math.round(km * 0.06));
      const concertRideRange = `${priceMin}–${priceMax} €/asiento`;
      const oc: OriginCity = {
        city: c.display || c.city,
        km,
        drivingTime,
        concertRideRange,
      };
      routes.push({
        slug: `${originSlug}-${festival.slug}`,
        originCity: oc.city,
        originCitySlug: originSlug,
        festival,
        originData: oc,
      });
    }
  }
  return routes;
}

export const ROUTE_LANDINGS: RouteLanding[] = buildRoutes();
export const ROUTE_LANDINGS_BY_SLUG: Record<string, RouteLanding> = Object.fromEntries(
  ROUTE_LANDINGS.map((r) => [r.slug, r]),
);
export const ROUTE_SLUGS = ROUTE_LANDINGS.map((r) => r.slug);

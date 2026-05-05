// Programmatic route pages: /rutas/[origin-city-slug]-[festival-slug]
// Each page targets long-tail queries like:
//   "carpooling Madrid Mad Cool", "viaje compartido Valencia Primavera Sound"
//
// Data is derived 100% from festivalLandings.ts — no duplication.
// A RouteLanding is generated for every (originCity × festival) pair.

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
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildRoutes(): RouteLanding[] {
  const routes: RouteLanding[] = [];
  for (const festival of FESTIVAL_LANDINGS) {
    // Merge explicit originCities from the festival with the canonical CITY_LANDINGS
    const seen = new Set<string>();
    // First, add the explicit originCities (trusted data)
    for (const oc of festival.originCities) {
      const originSlug = cityToSlug(oc.city);
      seen.add(originSlug);
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
      const originSlug = cityToSlug(c.display || c.city);
      if (seen.has(originSlug)) continue;
      seen.add(originSlug);
      // Estimate distance using Haversine formula from city coords to festival coords.
      const R = 6371;
      const dLat = ((festival.lat - c.lat) * Math.PI) / 180;
      const dLng = ((festival.lng - c.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((c.lat * Math.PI) / 180) *
          Math.cos((festival.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const straightKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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

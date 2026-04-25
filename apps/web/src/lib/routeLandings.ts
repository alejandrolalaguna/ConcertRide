// Programmatic route pages: /rutas/[origin-city-slug]-[festival-slug]
// Each page targets long-tail queries like:
//   "carpooling Madrid Mad Cool", "viaje compartido Valencia Primavera Sound"
//
// Data is derived 100% from festivalLandings.ts — no duplication.
// A RouteLanding is generated for every (originCity × festival) pair.

import { FESTIVAL_LANDINGS, type FestivalLanding, type OriginCity } from "./festivalLandings";

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
    for (const oc of festival.originCities) {
      const originSlug = cityToSlug(oc.city);
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

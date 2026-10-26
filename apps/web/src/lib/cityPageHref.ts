// `/conciertos/:city` exists only for the cities in CITY_LANDINGS. Festivals
// and venues carry a `citySlug` for every town, so linking it blindly produced
// internal links to non-existent pages (/conciertos/benicassim, /conciertos/
// lalin… — 21 targets, ~700 links, caught by scripts/test-llms-crawlability).
// Every `/conciertos/${citySlug}` link must go through this helper.

import { CITY_LANDINGS } from "./cityLandings";

const CITY_SLUGS = new Set(CITY_LANDINGS.map((c) => c.slug));

/** `/conciertos/<slug>` when that city page exists, otherwise null. */
export function cityPageHref(citySlug: string | undefined | null): string | null {
  return citySlug && CITY_SLUGS.has(citySlug) ? `/conciertos/${citySlug}` : null;
}

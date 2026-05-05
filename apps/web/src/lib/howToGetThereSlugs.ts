/**
 * HOW_TO_GET_THERE_SLUGS.ts
 * 
 * Defines which festivals should get dedicated "cómo llegar" (how to get there) pages.
 * These pages are optimized for queries like:
 * - "arenal sound como llegar"
 * - "bbk live como llegar"
 * - "mad cool como llegar"
 * - "[festival] transporte"
 * - "cómo ir a [festival]"
 */

import { FESTIVAL_LANDINGS } from "./festivalLandings";

// Export a comprehensive list of festival slugs for which we want a
// dedicated "/como-llegar/<festival>" page. For scale (and to reach the
// target page counts) we include every festival defined in
// `FESTIVAL_LANDINGS`. This intentionally expands the set of transport
// guide pages so prerender will produce a how-to page per festival.
export const HOW_TO_GET_THERE_SLUGS = FESTIVAL_LANDINGS.map((f) => f.slug);
export const HOW_TO_GET_THERE_SLUGS_EXPORT = HOW_TO_GET_THERE_SLUGS;

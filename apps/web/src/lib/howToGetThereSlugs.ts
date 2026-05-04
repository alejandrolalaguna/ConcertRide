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

// Festivals with dedicated "cómo llegar" pages
// These are high-traffic festivals that deserve dedicated transport guides
export const HOW_TO_GET_THERE_SLUGS = [
  "arenal-sound",           // GSC: "arenal sound como llegar" top query
  "vina-rock",              // GSC: "viña rock buses" top query
  "mad-cool",               // GSC: "mad cool como llegar"
  "bbk-live",               // GSC: "bbk live como llegar"
  "primavera-sound",        // GSC: "primavera sound como llegar"
  "sonar",                  // GSC: "sonar barcelona como llegar"
  "resurrection-fest",      // GSC: "resurrection fest viajes"
  "cala-mijas",             // GSC: "cala mijas festival 2026"
  "azkena-rock",            // Rock festival high engagement
  "o-son-do-camino",        // GSC: "o son do camino como llegar"
  "low-festival",           // Growing festival
  "medusa-festival",        // Beach festival
  "cruilla",                // Barcelona major
  "sonorama-ribera",        // Aranda de Duero traffic
  "zevra-festival",         // GSC: "zevra festival bus"
  "fib",                    // Classic festival, high traffic
].filter(slug => FESTIVAL_LANDINGS.some(f => f.slug === slug)); // Verify exists

export const HOW_TO_GET_THERE_SLUGS_EXPORT = HOW_TO_GET_THERE_SLUGS;

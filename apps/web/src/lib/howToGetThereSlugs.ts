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
  "arenal-sound",           // 141 implied traffic from user data
  "vina-rock",              // 141 impresiones en GSC
  "mad-cool",               // Major festival
  "bbk-live",               // Major festival
  "primavera-sound",        // Major festival
  "sónar",                  // Major festival
  "resurrection-fest",      // Metal-focused, high engagement
  "cala-mijas",             // Growing festival
  "azkena-rock",            // Rock festival
  "o-son-do-camiño",        // Galician major festival
  "low-festival",           // Rising festival
  "medusa-festival",        // Beach festival
  "cruïlla",                // Barcelona major
  "interestelar-sevilla",   // Andalusian major
  "viñarock",               // Already has traffic
].filter(slug => FESTIVAL_LANDINGS.some(f => f.slug === slug)); // Verify exists

export const HOW_TO_GET_THERE_SLUGS_EXPORT = HOW_TO_GET_THERE_SLUGS;

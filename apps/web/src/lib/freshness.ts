/**
 * Freshness helpers for editorial content.
 *
 * Google's Helpful Content guidance treats `dateModified` and visible "last
 * reviewed" signals as quality indicators for time-sensitive topics (prices,
 * dates, route data, transport availability). This module centralises the
 * staleness threshold + the user-facing date formatter so pages render a
 * consistent "Última revisión" string.
 *
 * Usage:
 *   import { isFresh, formatLastReviewed } from "@/lib/freshness";
 *
 *   const reviewed = "2026-05-20";
 *   formatLastReviewed(reviewed); // "20 de mayo de 2026"
 *   isFresh(reviewed);            // true (within 12 months)
 *
 * Both helpers are pure and SSR-safe.
 */

/**
 * Returns true if `dateModified` is within `maxAgeMonths` of the current date.
 *
 * @param dateModified  ISO date string (YYYY-MM-DD or full ISO timestamp).
 * @param maxAgeMonths  Maximum staleness window in months. Default: 12.
 *                      Use 6 for transport pricing / route pages, 12 for
 *                      pillars / datasets / blog posts, 24 for evergreen
 *                      reference content.
 */
export function isFresh(
  dateModified: string,
  maxAgeMonths: number = 12,
): boolean {
  const modified = new Date(dateModified);
  if (Number.isNaN(modified.getTime())) return false;
  const now = new Date();
  const ageMs = now.getTime() - modified.getTime();
  if (ageMs < 0) return true; // future-dated → treat as fresh
  // Average month length (365.25 / 12) ≈ 30.44 days. Avoids leap-year drift.
  const ageMonths = ageMs / (1000 * 60 * 60 * 24 * 30.44);
  return ageMonths <= maxAgeMonths;
}

/**
 * Renders a date string in es-ES locale ("20 de mayo de 2026"). If the input
 * is unparseable, returns the original string unchanged so the UI does not
 * break on bad data.
 */
export function formatLastReviewed(dateModified: string): string {
  const d = new Date(dateModified);
  if (Number.isNaN(d.getTime())) return dateModified;
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ConcertRide — locale registry
//
// Add a new language in three steps:
//   1. Create `<code>.ts` exporting a `Dict`-shaped object (mirror es.ts).
//   2. Register it in DICTIONARIES + LOCALES below.
//   3. Add its display name to the `language` namespace in every dictionary.
// ─────────────────────────────────────────────────────────────────────────────

import { es, type Dict } from "./es";
import { ca } from "./ca";
import { en } from "./en";

export type Locale = "es" | "ca" | "en";

export const DEFAULT_LOCALE: Locale = "es";

// Ordered list used to render the language switcher.
export const LOCALES: Locale[] = ["es", "ca", "en"];

export const DICTIONARIES: Record<Locale, Dict> = { es, ca, en };

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

export type { Dict };

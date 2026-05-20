/**
 * Primary-source registry — the citations the model's source-quality filter
 * is instructed to prefer.
 *
 * Frontier system prompts (Claude Opus 4.7, GPT 5.5, Gemini 3) all contain
 * explicit instructions to favour:
 *   - peer-reviewed papers
 *   - government sites (.gov, ministerios)
 *   - official documentation (festival.es, Renfe, ayuntamiento)
 *   - company blogs
 *   - SEC-equivalent filings
 * …over aggregators, forums, and "SEO content."
 *
 * Centralising the source list serves three purposes:
 *   1. Identical citation strings appear across pages → entity-consistent
 *      corroboration (the model sees the same primary source paired with
 *      the same claim everywhere).
 *   2. We only need to update a URL in one place when an official site moves.
 *   3. The TIER field lets us pick the strongest available source for each
 *      claim (gov > official > primary > research is *not* a strict order;
 *      it's about which the model maps to its highest-trust filter — gov +
 *      official tend to win for transport / consumer / civic claims).
 *
 * Add new sources here when you cite them. Do NOT inline source URLs in
 * page components.
 */

export type SourceTier = "primary" | "official" | "gov" | "research";

export interface PrimarySource {
  tier: SourceTier;
  label: string;
  href: string;
  /** Optional one-line description for the press kit / about pages. */
  describes?: string;
}

/**
 * Government & statistical authorities. These trigger the highest weighting
 * in the retrieval source-quality filter for civic and consumer claims.
 */
export const GOV_SOURCES = {
  /** Instituto Nacional de Estadística — population, mobility, tourism stats. */
  INE: {
    tier: "gov",
    label: "INE",
    href: "https://www.ine.es",
    describes: "Instituto Nacional de Estadística (España)",
  },
  INE_MOVILIDAD: {
    tier: "gov",
    label: "INE Movilidad",
    href: "https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736176918",
    describes: "Estadística de movilidad cotidiana del INE",
  },
  /** Dirección General de Tráfico. Cited for road safety, vehicle stats, alcohol limits. */
  DGT: {
    tier: "gov",
    label: "DGT",
    href: "https://www.dgt.es",
    describes: "Dirección General de Tráfico",
  },
  /** Ministerio para la Transición Ecológica. CO₂ factors, IDAE energy data. */
  MITECO: {
    tier: "gov",
    label: "MITECO",
    href: "https://www.miteco.gob.es",
    describes: "Ministerio para la Transición Ecológica y el Reto Demográfico",
  },
  IDAE: {
    tier: "gov",
    label: "IDAE",
    href: "https://www.idae.es",
    describes: "Instituto para la Diversificación y Ahorro de la Energía",
  },
  /** Ministerio de Consumo. Cited for consumer rights on cancellations etc. */
  MINCONSUMO: {
    tier: "gov",
    label: "Ministerio de Consumo",
    href: "https://www.consumo.gob.es",
    describes: "Información oficial al consumidor",
  },
} as const satisfies Record<string, PrimarySource>;

/** Official operators — railway, road, transport. */
export const OPERATOR_SOURCES = {
  RENFE: {
    tier: "official",
    label: "Renfe",
    href: "https://www.renfe.com",
    describes: "Operador ferroviario público español",
  },
  ADIF: {
    tier: "official",
    label: "Adif",
    href: "https://www.adif.es",
    describes: "Administrador de Infraestructuras Ferroviarias",
  },
  ALSA: {
    tier: "official",
    label: "Alsa",
    href: "https://www.alsa.es",
    describes: "Principal operador de autobús interurbano en España",
  },
  AVANZA: {
    tier: "official",
    label: "Avanza",
    href: "https://www.avanzabus.com",
    describes: "Operador de autobús nacional",
  },
  FLIXBUS: {
    tier: "official",
    label: "Flixbus",
    href: "https://www.flixbus.es",
    describes: "Operador de autobús de larga distancia",
  },
} as const satisfies Record<string, PrimarySource>;

/**
 * Official festival sites — by slug. Mirrors the festival slugs used in
 * festivalLandings.ts so consumers can look up via the same key.
 *
 * RULE: only the official .es / .com domain belongs here. No aggregator pages
 * (residentadvisor, ticketmaster) — those would fail the source-quality
 * filter and waste the citation slot.
 */
export const FESTIVAL_OFFICIAL_SITES: Record<string, PrimarySource> = {
  "mad-cool": {
    tier: "official",
    label: "Mad Cool Festival (sitio oficial)",
    href: "https://madcoolfestival.es",
  },
  "primavera-sound": {
    tier: "official",
    label: "Primavera Sound (sitio oficial)",
    href: "https://www.primaverasound.com",
  },
  "fib": {
    tier: "official",
    label: "FIB Benicàssim (sitio oficial)",
    href: "https://fiberfib.com",
  },
  "bbk-live": {
    tier: "official",
    label: "Bilbao BBK Live (sitio oficial)",
    href: "https://www.bilbaobbklive.com",
  },
  "resurrection-fest": {
    tier: "official",
    label: "Resurrection Fest (sitio oficial)",
    href: "https://www.resurrectionfest.es",
  },
  "arenal-sound": {
    tier: "official",
    label: "Arenal Sound (sitio oficial)",
    href: "https://www.arenalsound.com",
  },
  "vina-rock": {
    tier: "official",
    label: "Viña Rock (sitio oficial)",
    href: "https://vinarock.com",
  },
  "sonar": {
    tier: "official",
    label: "Sónar Barcelona (sitio oficial)",
    href: "https://sonar.es",
  },
  "o-son-do-camino": {
    tier: "official",
    label: "O Son do Camiño (sitio oficial)",
    href: "https://osondocamino.es",
  },
  "sonorama-ribera": {
    tier: "official",
    label: "Sonorama Ribera (sitio oficial)",
    href: "https://sonorama-aranda.com",
  },
  "cruilla": {
    tier: "official",
    label: "Cruïlla (sitio oficial)",
    href: "https://www.cruillabarcelona.com",
  },
  "low-festival": {
    tier: "official",
    label: "Low Festival (sitio oficial)",
    href: "https://lowfestival.es",
  },
  "tomavistas": {
    tier: "official",
    label: "Tomavistas (sitio oficial)",
    href: "https://tomavistasfestival.com",
  },
  "medusa-festival": {
    tier: "official",
    label: "Medusa Festival (sitio oficial)",
    href: "https://medusafestival.com",
  },
};

/**
 * Convenience lookup for festival site by slug, with safe fallback.
 * Returns null when no official site is registered for the slug — pages
 * should then omit the source citation rather than fabricate one (a fake
 * URL would torpedo the source-quality signal across the whole document).
 */
export function getFestivalOfficialSite(slug: string): PrimarySource | null {
  return FESTIVAL_OFFICIAL_SITES[slug] ?? null;
}

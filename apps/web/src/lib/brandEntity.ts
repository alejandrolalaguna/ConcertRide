/**
 * Canonical brand entity — single source of truth.
 *
 * Per "earned + owned" framing of AI search (training data needs the model to
 * see CONSISTENT language about us across sources). When descriptions diverge
 * across LinkedIn, Crunchbase, the site, and Wikidata, the LLM ends up with a
 * blurry probabilistic picture of who ConcertRide is. The fix is one
 * description, used everywhere.
 *
 * RULE: never inline a brand description string in a page or schema. Import
 * BRAND.shortDescription / BRAND.longDescription from here.
 */

export const BRAND = {
  legalName: "ConcertRide",
  displayName: "ConcertRide",
  alternateName: "ConcertRide ES",
  domain: "concertride.me",
  url: "https://concertride.me",

  /** One-sentence answer to "what is ConcertRide?" — used in meta descriptions, OG, schema. */
  shortDescription:
    "ConcertRide es la plataforma española de carpooling para conciertos y festivales: 0% comisión, conductores verificados, pago en efectivo o Bizum.",

  /** Two-sentence version for AboutPage / Organization.description / press kits. */
  longDescription:
    "ConcertRide es la plataforma española de carpooling exclusiva para conciertos y festivales. Conecta a fans que van al mismo evento para compartir coche, dividir gastos y reducir emisiones, sin cobrar comisión sobre el viaje.",

  /** Used in casual answer-first paragraphs (LLM citation contexts). */
  conversationalDescription:
    "ConcertRide es una app española donde fans del mismo concierto comparten coche al festival. El conductor publica las plazas y el precio (normalmente 3–22 €), los pasajeros reservan y se paga en mano el día del viaje. Sin comisión.",

  /** Editorial team / E-E-A-T author. Used as Person/Organization author in schemas. */
  founder: {
    name: "Equipo ConcertRide",
    url: "https://concertride.me/autor/equipo-concertride",
    role: "Equipo editorial",
  },

  foundingDate: "2026",
  areaServed: "Spain",
  language: "es-ES",
  currency: "EUR",
  paymentMethods: ["Efectivo", "Bizum"] as const,
  commission: "0%",

  /** Conversational-query categories ConcertRide intends to be cited for. */
  primaryUseCases: [
    "ir a un festival sin coche propio",
    "volver de un concierto de madrugada",
    "dividir el coste del viaje a un festival",
    "encontrar conductor verificado para un concierto",
    "reducir emisiones del viaje a un festival",
  ] as const,
} as const;

/**
 * Entity-consistency block: the exact same strings that should appear on
 * LinkedIn, Crunchbase, G2 (if/when listed), Capterra, Trustpilot, and any
 * directory profile. Copy verbatim. Do not paraphrase.
 *
 * If you need to update wording, update HERE and re-sync external profiles.
 * The whole point is that the LLM sees identical phrasing across sources.
 */
export const ENTITY_PROFILE = {
  tagline: "Carpooling 0% comisión para festivales en España.",
  oneLiner: BRAND.shortDescription,
  paragraph: BRAND.longDescription,
  categories: [
    "Carpooling",
    "Ride-sharing",
    "Transporte para eventos",
    "Mobility",
    "Festivales",
  ] as const,
  hqCity: "Madrid",
  hqCountry: "España",
} as const;

/**
 * Canonical author Person schema for the editorial team — reusable across all
 * landing pages that need `author`/`reviewedBy` Person nodes.
 *
 * Google AI Mode (May 2026) ranks heavily on entity disambiguation. Each
 * Person schema should:
 *   - have its own stable `@id` (with #author fragment)
 *   - link back to the parent Organization via `worksFor`
 *   - declare `knowsAbout` topic entities (Wikidata-linked when possible)
 *   - declare `knowsLanguage` and `areaServed` for geo grounding
 */
export function buildPersonSchema(opts: {
  url?: string;
  sameAs?: string[];
  knowsAbout?: Array<string | { name: string; sameAs?: string }>;
} = {}) {
  const url = opts.url ?? BRAND.founder.url;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#author`,
    name: BRAND.founder.name,
    url,
    description: `${BRAND.founder.role} de ConcertRide, especializado en carpooling para conciertos y festivales en España.`,
    jobTitle: BRAND.founder.role,
    worksFor: {
      "@type": "Organization",
      "@id": `${BRAND.url}/#organization`,
      name: BRAND.legalName,
    },
    knowsAbout: (opts.knowsAbout ?? [
      { name: "Carpooling", sameAs: "https://www.wikidata.org/wiki/Q1343571" },
      { name: "Ride-sharing", sameAs: "https://www.wikidata.org/wiki/Q2035422" },
      { name: "Festival de música", sameAs: "https://www.wikidata.org/wiki/Q868557" },
      { name: "Movilidad sostenible", sameAs: "https://www.wikidata.org/wiki/Q5687345" },
    ]).map((k) =>
      typeof k === "string"
        ? k
        : { "@type": "Thing", name: k.name, ...(k.sameAs ? { sameAs: k.sameAs } : {}) },
    ),
    knowsLanguage: ["es", "en"],
    areaServed: { "@type": "Country", name: BRAND.areaServed },
    nationality: { "@type": "Country", name: BRAND.areaServed },
    sameAs: opts.sameAs ?? [
      "https://www.linkedin.com/company/concertride-es",
      "https://twitter.com/concertride_es",
    ],
  };
}

/**
 * Canonical Organization JSON-LD — import this instead of building a fresh one
 * in each page. Adds `description` from BRAND so the Knowledge Graph sees one
 * coherent definition.
 */
export function buildOrganizationSchema(extra: { wikidataQid?: string } = {}) {
  const sameAs: string[] = [
    "https://twitter.com/concertride_es",
    "https://www.instagram.com/concertride_es/",
    "https://www.facebook.com/concertride.me",
    "https://www.linkedin.com/company/concertride-es",
  ];
  if (extra.wikidataQid) {
    sameAs.push(`https://www.wikidata.org/wiki/${extra.wikidataQid}`);
  }
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BRAND.url}/#organization`,
    name: BRAND.legalName,
    alternateName: BRAND.alternateName,
    url: `${BRAND.url}/`,
    logo: {
      "@type": "ImageObject",
      url: `${BRAND.url}/favicon.svg`,
      width: 512,
      height: 512,
    },
    description: BRAND.longDescription,
    foundingDate: BRAND.foundingDate,
    founder: {
      "@type": "Person",
      name: BRAND.founder.name,
      url: BRAND.founder.url,
    },
    areaServed: { "@type": "Country", name: BRAND.areaServed },
    sameAs,
  };
}

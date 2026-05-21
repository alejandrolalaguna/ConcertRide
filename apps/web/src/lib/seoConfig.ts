/**
 * SEO Configuration for ConcertRide ES
 * Centralized configuration for meta tags, schema markup, and SEO best practices
 * Last updated: 2026-05-20
 *
 * Brand descriptions resolve to BRAND in brandEntity.ts so every page,
 * schema, OG tag, and external directory profile reads identically.
 * Entity consistency is the lever that gets an LLM to recognise us as one
 * coherent thing rather than five blurry probabilistic clusters.
 */

import { BRAND } from "./brandEntity";

export const SEO_CONFIG = {
  site: {
    name: "ConcertRide ES",
    url: "https://concertride.me",
    description: BRAND.shortDescription,
    language: "es-ES",
    defaultLocale: "es-ES",
    author: "Equipo ConcertRide",
    /**
     * Canonical author URL — points to the founder's E-E-A-T author page.
     * Used by schemaGenerators / BlogPostPage to populate `author.url` on
     * BlogPosting / NewsArticle / Person JSON-LD so AI Overviews can resolve
     * the byline to a real, schema-marked-up Person entity.
     */
    authorUrl: "https://concertride.me/autor/equipo-concertride",
    contactEmail: "help@concertride.me",
  },

  // Primary keywords for SEO optimization
  keywords: {
    primary: [
      "carpooling conciertos españa",
      "carpooling festivales españa",
      "transporte compartido festivales",
      "viajes compartidos música",
      "viaje compartido festival música españa",
      "coche compartido conciertos",
      "alternativa carpooling festivales",
      "ride-sharing eventos musicales españa",
    ],
    year_specific: [
      "carpooling festivales españa 2026",
      "festivales españa 2026 transporte",
      "viaje compartido festival 2026",
      "carpooling festival verano 2026",
      "transporte festivales 2026",
      "cómo ir a festivales 2026",
    ],
    long_tail: [
      // Transport intents
      "cómo ir barato a conciertos",
      "transporte a festivales españoles sin coche",
      "cómo volver de un festival de madrugada",
      "alternativa taxi festival",
      "autobús festival madrugada alternativa",
      "ir a festival sin coche propio",
      // Festival-specific
      "carpooling mad cool madrid 2026",
      "carpooling primavera sound barcelona 2026",
      "viaje compartido bbk live bilbao 2026",
      "carpooling arenal sound burriana 2026",
      "viaje compartido viña rock 2026",
      "carpooling sonar barcelona 2026",
      "transporte fib benicassim 2026",
      "carpooling resurrection fest viveiro 2026",
      "cómo llegar al mad cool sin metro",
      "bus primavera sound barcelona",
      "lanzadera bbk live bilbao",
      // City-based
      "viaje compartido barcelona conciertos",
      "carpooling madrid festivales",
      "coche compartido valencia conciertos",
      "transporte sevilla conciertos verano",
      // Sustainability
      "huella carbono festival carpooling",
      "festival sostenible transporte compartido",
      "reducir emisiones festival música",
      // Competitor displacement
      "alternativa carpooling festivales",
      "carpooling festival música",
      "carpooling sin comisión festivales",
      // Pricing intents
      "precio carpooling festival españa",
      "cuánto cuesta ir a festival en coche",
      "dividir gastos concierto",
    ],
    brand: [
      "concertride",
      "concert ride",
      "concertride.me",
      "concertride carpooling",
    ],
  },

  // Open Graph defaults
  og: {
    type: "website",
    locale: "es_ES",
    siteName: "ConcertRide ES",
    image: "https://concertride.me/og/home.png",
    imageWidth: 1200,
    imageHeight: 630,
    imageType: "image/png",
  },

  // Twitter Card config
  twitter: {
    card: "summary_large_image",
    site: "@concertride_es",
    creator: "@concertride_es",
  },

  /**
   * Wikidata Q-ID for ConcertRide entity.
   * TODO: Set once the Wikidata entity is created — see apps/web/docs/wikidata-entity-setup.md
   * Until populated, the Wikidata URL is NOT injected into Organization.sameAs to avoid 404 dead links.
   * Format: "Q123456789"
   */
  wikidataQid: "" as string,

  // Schema markup organization
  schema: {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://concertride.me/#organization",
      name: "ConcertRide ES",
      url: "https://concertride.me/",
      logo: {
        "@type": "ImageObject",
        url: "https://concertride.me/favicon.svg",
        width: 512,
        height: 512,
      },
      description: BRAND.longDescription,
      foundingDate: "2026",
      areaServed: {
        "@type": "Country",
        name: "Spain",
      },
      // sameAs: external identity references for Knowledge Graph disambiguation.
      // TODO: Add Wikidata Q-ID once entity is created — see apps/web/docs/wikidata-entity-setup.md
      // TODO: Add GitHub org URL once the public org is set up.
      sameAs: [
        "https://twitter.com/concertride_es",
        "https://www.instagram.com/concertride_es/",
        "https://www.facebook.com/concertride.me",
        "https://www.linkedin.com/company/concertride-es",
      ],
    },

    onlinebusiness: {
      "@context": "https://schema.org",
      // NOTE: "OnlineBusiness" is NOT a valid schema.org @type — Google rejects it.
      // Use LocalBusiness instead (still valid for web-only services).
      "@type": "LocalBusiness",
      "@id": "https://concertride.me/#onlinebusiness",
      name: "ConcertRide ES",
      url: "https://concertride.me/",
      currenciesAccepted: "EUR",
      paymentAccepted: "Cash, Bizum",
      areaServed: {
        "@type": "Country",
        name: "Spain",
      },
    },
  },

  // Social media handles
  social: {
    twitter: "@concertride_es",
    instagram: "@concertride_es",
    facebook: "concertride.me",
    linkedin: "concertride-es",
  },

  // Legal pages routes
  legal: {
    privacy: "/privacidad",
    terms: "/terminos",
    cookies: "/cookies",
    legal: "/aviso-legal",
  },

  // Robots.txt configuration
  robots: {
    allow: ["/"],
    disallow: ["/api/", "/_*"],
    sitemaps: [
      "https://concertride.me/sitemap.xml",
    ],
  },

  // Core Web Vitals targets (Lighthouse)
  // Updated to 2026 Google thresholds: LCP "Good" lowered from 2.5s → 2.0s (March 2026 core update)
  cwv_targets: {
    lcp: 2000, // milliseconds — Google 2026 "Good" threshold (was 2500 before March 2026)
    inp: 200,  // milliseconds — Equal ranking signal alongside LCP and CLS since March 2026
    cls: 0.1,  // score
  },

  // AI crawler permissions (robots.txt)
  ai_crawlers: {
    gptbot: "allowed", // OpenAI training
    "chatgpt-user": "allowed", // OpenAI real-time browsing
    claudebot: "allowed", // Anthropic training
    perplexitybot: "allowed", // Perplexity search
    "google-extended": "allowed", // Gemini training
    ccbot: "allowed", // Common Crawl
    bytespider: "allowed", // ByteDance training
  },

  // Page-specific defaults
  pages: {
    home: {
      title: "ConcertRide · Carpooling conciertos y festivales España",
      description: "Carpooling para conciertos y festivales en España. Sin comisión, conductores verificados. Publica un viaje o busca uno en 2 minutos. Pago en efectivo o Bizum.",
      keywords: "carpooling conciertos españa, viaje compartido festivales, coche compartido concierto, carpooling festivales 2026, sin comisión",
    },
    concerts: {
      title: "Conciertos España 2026 · Carpooling disponible | ConcertRide",
      description: "Busca conciertos y festivales en España 2026. Encuentra carpooling para ir a los eventos que te interesan: pop, rock, indie, electrónica y más. Sin comisión.",
      keywords: "conciertos españa 2026, próximos conciertos españa, carpooling conciertos, viaje compartido concierto, festivales 2026 españa",
    },
    publish: {
      title: "Publicar viaje a concierto o festival · ConcertRide",
      description: "Publica tu viaje a un concierto o festival. Busca pasajeros y divide gastos. Sin comisiones, el 100 % va a ti. Pago en efectivo o Bizum el día del viaje.",
      keywords: "publicar viaje carpooling, ofrecer plaza coche concierto, conductor carpooling festival, cómo publicar carpooling concierto",
    },
  },

  // Tracking & Analytics — GSC verified via Cloudflare DNS record
  analytics: {
    googleSiteVerification: "verified-via-cloudflare-dns",
  },
} as const;

// Export individual configs for convenience
export const SITE_URL = SEO_CONFIG.site.url;
export const SITE_NAME = SEO_CONFIG.site.name;
export const CONTACT_EMAIL = SEO_CONFIG.site.contactEmail;

/**
 * Get page-specific SEO metadata
 * @param pageName - Name of the page
 * @returns Page metadata object with title, description, keywords
 */
export function getPageSeo(pageName: keyof typeof SEO_CONFIG.pages) {
  return SEO_CONFIG.pages[pageName] || SEO_CONFIG.pages.home;
}

/**
 * Build schema.org markup for a page
 * @param schemaType - Type of schema to include
 * @returns Schema object ready for JSON-LD
 *
 * When `schemaType === "organization"` and `SEO_CONFIG.wikidataQid` is non-empty,
 * the Wikidata URL is appended to `sameAs` so Google's Knowledge Graph can resolve
 * ConcertRide to a single canonical entity.
 */
export function buildSchema(schemaType: keyof typeof SEO_CONFIG.schema) {
  const base = SEO_CONFIG.schema[schemaType];
  if (schemaType === "organization" && SEO_CONFIG.wikidataQid) {
    const wikidataUrl = `https://www.wikidata.org/wiki/${SEO_CONFIG.wikidataQid}`;
    const orgBase = base as typeof SEO_CONFIG.schema.organization;
    return {
      ...orgBase,
      sameAs: [...orgBase.sameAs, wikidataUrl],
    };
  }
  return base;
}

/**
 * Get AI crawler policy for robots.txt
 * @returns Object with crawler names and their permission status
 */
export function getAiCrawlerPolicy() {
  return SEO_CONFIG.ai_crawlers;
}

/** Maps Spanish region names to ISO 3166-2 codes for geo meta tags */
export const REGION_ISO: Record<string, string> = {
  "Comunidad de Madrid": "ES-MD",
  "Cataluña": "ES-CT",
  "Comunidad Valenciana": "ES-VC",
  "País Vasco": "ES-PV",
  "Andalucía": "ES-AN",
  "Galicia": "ES-GA",
  "Castilla y León": "ES-CL",
  "Castilla-La Mancha": "ES-CM",
  "Aragón": "ES-AR",
  "Navarra": "ES-NC",
  "Cantabria": "ES-CB",
  "Asturias": "ES-AS",
  "Extremadura": "ES-EX",
  "La Rioja": "ES-RI",
  "Murcia": "ES-MC",
  "Islas Baleares": "ES-IB",
  "Islas Canarias": "ES-CN",
};

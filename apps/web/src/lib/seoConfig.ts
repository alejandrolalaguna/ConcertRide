/**
 * SEO Configuration for ConcertRide ES
 * Centralized configuration for meta tags, schema markup, and SEO best practices
 * Last updated: 2026-04-25
 */

export const SEO_CONFIG = {
  site: {
    name: "ConcertRide ES",
    url: "https://concertride.me",
    description: "Carpooling para conciertos en España. Comparte coche, divide gastos y llega seguro.",
    language: "es-ES",
    defaultLocale: "es-ES",
    author: "Alejandro Lalaguna",
    contactEmail: "alejandrolalaguna@gmail.com",
  },

  // Primary keywords for SEO optimization
  keywords: {
    primary: [
      "carpooling conciertos españa",
      "transporte compartido festivales",
      "viajes compartidos música",
      "alternativa carpooling festivales",
      "ride-sharing españa",
    ],
    long_tail: [
      "cómo ir barato a conciertos",
      "transporte a festivales españoles",
      "carpooling mad cool madrid",
      "viaje compartido barcelona conciertos",
      "transporte primavera sound",
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
      description: "ConcertRide ES es la plataforma española de carpooling exclusiva para conciertos y festivales.",
      foundingDate: "2026",
      areaServed: {
        "@type": "Country",
        name: "Spain",
      },
      sameAs: [
        "https://twitter.com/concertride_es",
        "https://www.instagram.com/concertride_es/",
        "https://www.facebook.com/concertride.me",
        "https://www.linkedin.com/company/concertride-es",
      ],
    },

    onlinebusiness: {
      "@context": "https://schema.org",
      "@type": "OnlineBusiness",
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
  cwv_targets: {
    lcp: 2500, // milliseconds
    inp: 200, // milliseconds
    cls: 0.1, // score
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
      title: "ConcertRide ES — Carpooling para conciertos en España",
      description: "Carpooling para conciertos en España. Comparte coche, divide gastos y llega seguro. Publica un viaje o busca uno en 2 minutos. Gratis, sin comisiones.",
      keywords: "carpooling, conciertos, españa, transporte, compartido",
    },
    concerts: {
      title: "Explorar conciertos y viajes compartidos | ConcertRide ES",
      description: "Busca conciertos y festivales en España, encuentra viajes compartidos a los eventos que te interesan.",
      keywords: "conciertos, festivales, viajes, españa, carpooling",
    },
    publish: {
      title: "Publicar un viaje — ConcertRide ES",
      description: "Publica tu viaje a un concierto, busca pasajeros y reduce costos. Sin comisiones, pago directo.",
      keywords: "publicar viaje, ofertar carpooling, conductor",
    },
  },

  // Tracking & Analytics
  analytics: {
    googleSiteVerification: "REPLACE_WITH_GSC_TOKEN",
    bingVerification: "REPLACE_WITH_BING_TOKEN",
    yandexVerification: "REPLACE_WITH_YANDEX_TOKEN",
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
 */
export function buildSchema(schemaType: keyof typeof SEO_CONFIG.schema) {
  return SEO_CONFIG.schema[schemaType];
}

/**
 * Get AI crawler policy for robots.txt
 * @returns Object with crawler names and their permission status
 */
export function getAiCrawlerPolicy() {
  return SEO_CONFIG.ai_crawlers;
}

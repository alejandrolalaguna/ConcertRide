/**
 * Schema.org JSON-LD generators — helps generate structured data
 * for breadcrumbs, FAQs, events, etc.
 */

export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>,
  siteUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.name,
      item: crumb.url.startsWith("http") ? crumb.url : `${siteUrl}${crumb.url}`,
    })),
  };
}

export function generateFAQSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function generateTouristTripSchema({
  festivalName,
  origin,
  destination,
  startDate,
  endDate,
  price,
  driver,
}: {
  festivalName: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  price: number;
  driver: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `Viaje compartido a ${festivalName} desde ${origin}`,
    description: `Carpooling desde ${origin} a ${destination} para asistir a ${festivalName}.`,
    touristAttraction: {
      "@type": "EventVenue",
      name: festivalName,
      addressCountry: "ES",
    },
    itinerary: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Place",
            name: origin,
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Place",
            name: destination,
          },
        },
      ],
    },
    startDate,
    endDate,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "EUR",
    },
    provider: {
      "@type": "Person",
      name: driver,
    },
  };
}

/**
 * Full TouristTrip schema for a route landing page (/rutas/{origin}-{festival}).
 *
 * Emits a complete JSON-LD with:
 *  - tripOrigin (Place, origin city)
 *  - tripDestination (Place, festival venue + city)
 *  - itinerary (ordered ItemList of origin -> destination Places)
 *  - offers (numeric price/maxPrice in EUR, InStock, validFrom/validThrough)
 *  - subjectOf (MusicEvent ref to the festival with startDate/endDate/location)
 *  - provider (ConcertRide Organization @id)
 *
 * Numeric prices (NOT "12 €" strings) so Google accepts the Offer node.
 */
export function generateTouristTripFromRoute({
  originCity,
  festival,
  km,
  drivingTime,
  priceRange,
  priceMin,
  priceMax,
  routeSlug,
  siteUrl,
}: {
  originCity: string;
  festival: {
    name: string;
    shortName: string;
    slug: string;
    city: string;
    region: string;
    venue: string;
    venueAddress: string;
    lat: number;
    lng: number;
    startDate: string;
    endDate: string;
  };
  km: number;
  drivingTime: string;
  priceRange: string;
  priceMin: number;
  priceMax: number;
  routeSlug: string;
  siteUrl: string;
}) {
  const routeUrl = `${siteUrl}/rutas/${routeSlug}`;
  const originPlace = {
    "@type": "Place",
    name: originCity,
    address: {
      "@type": "PostalAddress",
      addressLocality: originCity,
      addressCountry: "ES",
    },
  };
  const destinationPlace = {
    "@type": "Place",
    name: festival.venue,
    address: {
      "@type": "PostalAddress",
      streetAddress: festival.venueAddress,
      addressLocality: festival.city,
      addressRegion: festival.region,
      addressCountry: "ES",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: festival.lat,
      longitude: festival.lng,
    },
  };

  // validThrough = the festival end date (offer is meaningful only up to that date).
  // Fall back to +1 year from now if endDate is malformed.
  const validThrough = (() => {
    const d = new Date(festival.endDate);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
    const fallback = new Date();
    fallback.setFullYear(fallback.getFullYear() + 1);
    return fallback.toISOString();
  })();

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${routeUrl}#trip`,
    name: `Carpooling ${originCity} → ${festival.name}`,
    description: `Viaje compartido de ${originCity} a ${festival.name} (${festival.venue}, ${festival.city}). ${km} km, ${drivingTime}, desde ${priceRange}/asiento sin comisión.`,
    url: routeUrl,
    inLanguage: "es-ES",
    touristType: {
      "@type": "Audience",
      audienceType: "Aficionados a la música",
      geographicArea: { "@type": "Country", name: "Spain" },
    },
    tripOrigin: originPlace,
    tripDestination: destinationPlace,
    itinerary: [
      { ...originPlace },
      { ...destinationPlace },
    ],
    provider: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "ConcertRide",
      url: siteUrl,
    },
    subjectOf: {
      "@type": "MusicEvent",
      "@id": `${siteUrl}/festivales/${festival.slug}#event`,
      name: festival.name,
      startDate: festival.startDate,
      endDate: festival.endDate,
      location: destinationPlace,
    },
    offers: {
      "@type": "Offer",
      price: priceMin,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
      validThrough,
      url: routeUrl,
      priceSpecification: {
        "@type": "PriceSpecification",
        price: priceMin,
        minPrice: priceMin,
        maxPrice: priceMax,
        priceCurrency: "EUR",
      },
    },
  };
}

export function generateEventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  organizer,
  image,
  url,
  offers = null,
}: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: { name: string; city: string; country: string };
  organizer: string;
  image?: string;
  url: string;
  offers?: { name: string; url: string } | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name,
    description,
    image: image || "https://concertride.me/og/home.png",
    startDate,
    endDate,
    eventAttendanceMode: "OfflineEventAttendanceMode",
    eventStatus: "EventScheduled",
    location: {
      "@type": "Place",
      name: location.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: location.city,
        addressCountry: location.country,
      },
    },
    organizer: {
      "@type": "Organization",
      name: organizer,
    },
    url,
    ...(offers && {
      offers: {
        "@type": "Offer",
        url: offers.url,
        price: 0,
        priceCurrency: "EUR",
        availability: "https://schema.org/PreOrder",
        validFrom: new Date().toISOString(),
      },
    }),
  };
}

export function generateLocalBusinessSchema({
  name,
  description,
  address,
  phone,
  image,
  url,
  rating,
  reviewCount,
}: {
  name: string;
  description: string;
  address: { street: string; city: string; postalCode: string; country: string };
  phone: string;
  image: string;
  url: string;
  rating?: number;
  reviewCount?: number;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    image,
    telephone: phone,
    url,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
  };

  if (rating && reviewCount) {
    schema["aggregateRating"] = {
      "@type": "AggregateRating",
      ratingValue: String(rating.toFixed(1)),
      reviewCount,
    };
  }

  return schema;
}

/**
 * Standard Speakable cssSelector set — apply to any page where we want voice
 * assistants and AI Overviews to extract the most quotable, factual text.
 * Matches: page h1, lede paragraph (.lede), explicitly marked quotables
 * ([data-quotable]) and the .speakable utility class.
 */
export const STANDARD_SPEAKABLE_SELECTORS = [
  "h1",
  ".lede",
  "[data-quotable]",
  ".speakable",
] as const;

/**
 * SpeakableSpecification — marks page sections readable by voice assistants
 * and GEO AI engines (Google SGE, Perplexity, etc.).
 * Pass CSS selectors that wrap the most factual, quotable content.
 * Use generateSpeakableSchema() for full WebPage+Speakable nodes.
 */
export function generateSpeakableSpecification(
  cssSelectors: readonly string[] = STANDARD_SPEAKABLE_SELECTORS,
) {
  return {
    "@type": "SpeakableSpecification",
    cssSelector: [...cssSelectors],
  };
}

/**
 * Convenience: returns the `speakable` sub-property to inline inside an
 * existing Article, WebPage, CollectionPage or Dataset JSON-LD schema.
 * Uses the standard ConcertRide Speakable selector set.
 */
export function speakableSubProperty(cssSelectors: readonly string[] = STANDARD_SPEAKABLE_SELECTORS) {
  return {
    "@type": "SpeakableSpecification" as const,
    cssSelector: [...cssSelectors],
  };
}

/**
 * Standalone WebPage + SpeakableSpecification schema for a single answer-first
 * block (used by <SpeakableAnswerBlock />). Targets one specific DOM region
 * via a CSS id selector, which gives AI engines a tight quotable region rather
 * than the whole page.
 */
export function generateSpeakableAnswerSchema({
  pageUrl,
  schemaId,
  name,
  description,
}: {
  pageUrl: string;
  schemaId: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#${schemaId}`,
    url: pageUrl,
    name,
    description,
    inLanguage: "es-ES",
    mainEntityOfPage: { "@id": pageUrl },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [`#${schemaId} .speakable`, `#${schemaId} h2`],
    },
  };
}

/**
 * WebSite + SearchAction schema for the home page.
 * Enables Google Sitelinks Search Box and signals the site's search endpoint.
 */
export function generateWebSiteSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "ConcertRide ES",
    description: "Carpooling para conciertos y festivales en España",
    inLanguage: "es-ES",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/concerts?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Service schema for route pages (/rutas/:route).
 * Describes the carpooling service between two locations with pricing.
 */
export function generateServiceSchema({
  originCity,
  festivalShortName,
  festivalName,
  routeSlug,
  priceMin,
  priceMax,
  siteUrl,
}: {
  originCity: string;
  festivalShortName: string;
  festivalName: string;
  routeSlug: string;
  priceMin: string | number;
  priceMax: string | number;
  siteUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/rutas/${routeSlug}#service`,
    name: `Carpooling ${originCity} → ${festivalShortName}`,
    description: `Servicio de coche compartido de ${originCity} a ${festivalName}. Sin comisión (0%). Conductores verificados. Pago en efectivo o Bizum.`,
    serviceType: "Carpooling",
    url: `${siteUrl}/rutas/${routeSlug}`,
    provider: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "ConcertRide ES",
    },
    areaServed: {
      "@type": "Country",
      name: "España",
      sameAs: "https://www.wikidata.org/wiki/Q29",
    },
    offers: {
      "@type": "Offer",
      name: `Asiento carpooling ${originCity} → ${festivalShortName}`,
      price: priceMin,
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: priceMin,
        maxPrice: priceMax,
        priceCurrency: "EUR",
        unitText: "por asiento",
      },
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/rutas/${routeSlug}`,
    },
  };
}

/**
 * Generic AggregateRating subnode generator — pass a list of reviews and get
 * the schema.org/AggregateRating object back. Returns `null` when there are
 * fewer than `minCount` reviews (default 3) — Google flags AggregateRating
 * with too few reviews as low-quality UGC.
 *
 * Designed to be embedded inside another entity (Service, Organization,
 * MusicEvent, MusicGroup, Place, LocalBusiness…) under the `aggregateRating`
 * property. NOT a top-level @context'd schema.
 */
export function generateAggregateRatingSchema(
  reviews: Array<{ rating: number }>,
  opts: { minCount?: number } = {},
) {
  const minCount = opts.minCount ?? 3;
  if (!reviews || reviews.length < minCount) return null;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  const avg = sum / reviews.length;
  return {
    "@type": "AggregateRating",
    ratingValue: avg.toFixed(2),
    reviewCount: reviews.length,
    bestRating: "5",
    worstRating: "1",
  };
}

/**
 * Builds a list of individual @type:Review nodes from testimonial data,
 * each pointed at the entity passed in `itemReviewedId`.
 *
 * Each Review has:
 *  - reviewRating (Rating, numeric value 1–5)
 *  - author (Person)
 *  - reviewBody, datePublished, name
 *  - itemReviewed (the parent entity by @id)
 *
 * Returns an empty array if `reviews` is empty/null.
 */
export function generateReviewSchemas(opts: {
  itemReviewedId: string;
  itemReviewedType?: string; // e.g. "MusicEvent", "MusicGroup", "Place", "Service"
  itemReviewedName: string;
  reviews: Array<{ quote: string; name: string; concert: string; date: string; rating: number }>;
}): object[] {
  if (!opts.reviews || opts.reviews.length === 0) return [];
  const type = opts.itemReviewedType ?? "Service";
  return opts.reviews.map((r) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(r.rating),
      bestRating: "5",
      worstRating: "1",
    },
    author: { "@type": "Person", name: r.name },
    datePublished: r.date,
    reviewBody: r.quote,
    name: `Experiencia ConcertRide · ${r.concert}`,
    itemReviewed: {
      "@type": type,
      "@id": opts.itemReviewedId,
      name: opts.itemReviewedName,
    },
  }));
}

/**
 * AggregateRating + individual Review schema for the homepage Service entity.
 *
 * Google requires individual Review nodes when you include AggregateRating
 * on a non-product/non-business entity. We attach them to the /#service
 * entity so the schema is valid and eligible for rich snippets.
 *
 * Pass the full TESTIMONIALS array and the TESTIMONIALS_AGGREGATE object
 * from lib/testimonials.ts.
 */
export function generateServiceReviewSchema({
  siteUrl,
  aggregate,
  reviews,
}: {
  siteUrl: string;
  aggregate: { ratingValue: string; reviewCount: number; bestRating: string; worstRating: string };
  reviews: Array<{
    quote: string;
    name: string;
    city: string;
    concert: string;
    date: string;
    rating: number;
  }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/#service`,
    name: "ConcertRide · Carpooling para conciertos y festivales",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: aggregate.ratingValue,
      reviewCount: aggregate.reviewCount,
      bestRating: aggregate.bestRating,
      worstRating: aggregate.worstRating,
    },
    review: reviews.map((r) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(r.rating),
        bestRating: "5",
        worstRating: "1",
      },
      author: {
        "@type": "Person",
        name: r.name,
      },
      datePublished: r.date,
      reviewBody: r.quote,
      name: `Experiencia ConcertRide · ${r.concert}`,
    })),
  };
}

/**
 * HowTo schema for /como-llegar/[slug] pages.
 *
 * Eligible for Google's "step-by-step" rich result in SERPs. Each step is a
 * HowToStep with a position, name, and text. We construct steps dynamically
 * from the FestivalLanding data (no inventions): transport mix, origin
 * cities, official shuttle, distance/price estimates.
 *
 * Keep steps short and instructive so AI engines can quote them verbatim.
 */
export interface HowToStep {
  name: string;       // e.g. "Salir desde Madrid centro"
  text: string;       // detailed instruction
  url?: string;       // optional URL (destination, route page, etc.)
}

export function generateHowToSchema(opts: {
  name: string;             // e.g. "Cómo llegar a Mad Cool 2026"
  description: string;      // one-line summary
  totalTime?: string;       // ISO 8601 duration, e.g. "PT2H30M"
  estimatedCost?: { currency: string; value: string };  // e.g. €5
  steps: HowToStep[];
  pageUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    inLanguage: "es-ES",
    mainEntityOfPage: { "@id": opts.pageUrl },
    ...(opts.totalTime ? { totalTime: opts.totalTime } : {}),
    ...(opts.estimatedCost
      ? {
          estimatedCost: {
            "@type": "MonetaryAmount",
            currency: opts.estimatedCost.currency,
            value: opts.estimatedCost.value,
          },
        }
      : {}),
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : {}),
    })),
  };
}

/**
 * TripAction schema for route pages (/rutas/:route).
 * Describes a carpooling trip action between two locations.
 */
export function generateTripActionSchema(
  origin: string,
  destination: string,
  routeName: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "TripAction",
    name: routeName,
    fromLocation: {
      "@type": "Place",
      name: origin,
      address: {
        "@type": "PostalAddress",
        addressLocality: origin,
        addressCountry: "ES",
      },
    },
    toLocation: {
      "@type": "Place",
      name: destination,
      address: {
        "@type": "PostalAddress",
        addressLocality: destination,
        addressCountry: "ES",
      },
    },
    provider: {
      "@type": "Organization",
      name: "ConcertRide",
    },
  };
}

/** Speakable schema — signals to AI Overviews / voice assistants which text sections
 *  to extract as atomic answers. Apply to the intro paragraph + FAQ sections of festival pages.
 *  cssSelector targets the first paragraph after h1 + all FAQ answer paragraphs.
 */
export function generateSpeakableSchema(pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [
        ".speakable-intro",
        ".faq-answer",
        "h1 + p",
        "[data-speakable]",
      ],
    },
    url: pageUrl,
  };
}

/** Author Person schema — E-E-A-T signal for blog posts.
 *  Named authors with LinkedIn sameAs dramatically improve AI citation rates.
 */
export function generateAuthorSchema({
  name,
  url,
  sameAs = [],
  jobTitle = "Editor de contenido",
}: {
  name: string;
  url: string;
  sameAs?: string[];
  jobTitle?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
    jobTitle,
    worksFor: {
      "@type": "Organization",
      name: "ConcertRide",
      url: "https://concertride.me",
    },
    ...(sameAs.length > 0 && { sameAs }),
  };
}

/** BusTrip schema for transport comparison tables — makes ConcertRide comparisons
 *  machine-readable by AI tools querying "transport options to [festival]".
 */
export function generateBusTripSchema({
  provider,
  origin,
  destination,
  departureTime,
  price,
  notes,
}: {
  provider: string;
  origin: string;
  destination: string;
  departureTime?: string;
  price: number;
  notes?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BusTrip",
    name: `${provider}: ${origin} → ${destination}`,
    busName: provider,
    departureBusStop: {
      "@type": "BusStop",
      name: origin,
      address: { "@type": "PostalAddress", addressLocality: origin, addressCountry: "ES" },
    },
    arrivalBusStop: {
      "@type": "BusStop",
      name: destination,
      address: { "@type": "PostalAddress", addressLocality: destination, addressCountry: "ES" },
    },
    ...(departureTime && { departureTime }),
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    ...(notes && { description: notes }),
  };
}

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
 * SpeakableSpecification — marks page sections readable by voice assistants
 * and GEO AI engines (Google SGE, Perplexity, etc.).
 * Pass CSS selectors that wrap the most factual, quotable content.
 */
export function generateSpeakableSchema(cssSelectors: string[] = ["h1", ".speakable", "p:first-of-type"]) {
  return {
    "@type": "SpeakableSpecification",
    cssSelector: cssSelectors,
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

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
    image: image || "https://via.placeholder.com/1200x630?text=" + encodeURIComponent(name),
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
        price: "0",
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
  const schema = {
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

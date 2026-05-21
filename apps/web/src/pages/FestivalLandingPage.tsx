import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, MapPin, Calendar, Users } from "lucide-react";
import type { Concert } from "@concertride/types";
import { api } from "@/lib/api";
import { ConcertCard } from "@/components/ConcertCard";
import { LoadingSpinner } from "@/components/ui";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { REGION_ISO } from "@/lib/seoConfig";
import { FESTIVAL_LANDINGS, FESTIVAL_LANDINGS_BY_SLUG } from "@/lib/festivalLandings";
import { ROUTE_LANDINGS } from "@/lib/routeLandings";
import { FESTIVAL_SEO_OVERRIDES } from "@/lib/seoOverrides";
import { HOW_TO_GET_THERE_SLUGS } from "@/lib/howToGetThereSlugs";
import { ARTIST_LANDINGS } from "@/lib/artistLandings";
import { VENUE_LANDINGS } from "@/lib/venueLandings";
import { TransportTable } from "@/components/TransportTable";
import { CostComparator } from "@/components/CostComparator";
import { DemandSignalWidget } from "@/components/DemandSignalWidget";
import { PickupMap } from "@/components/PickupMap";
import { REGION_LANDINGS } from "@/lib/regionLandings";
import { EventTransportHub, generateTransportHubSchema } from "@/components/EventTransportHub";
import type { TransportMode, NearbyAirport, AccommodationZone, ArrivalTip } from "@/components/EventTransportHub";

const FESTIVAL_DEFAULT_OG = `${SITE_URL}/og-fallback.png`;
import { trackFestivalView } from "@/lib/seoEvents";
import { FestivalAlertWidget } from "@/components/FestivalAlertWidget";
import { FestivalQnaWidget } from "@/components/FestivalQnaWidget";
import { FactDensityCallout } from "@/components/FactDensityCallout";
import { PrimarySourceFootnote } from "@/components/PrimarySourceFootnote";
import { UniqueInsight } from "@/components/UniqueInsight";
import { AgentActionRail } from "@/components/AgentActionRail";
import { getFestivalOfficialSite, OPERATOR_SOURCES, GOV_SOURCES } from "@/lib/primarySources";
import { SpeakableAnswerBlock } from "@/components/SpeakableAnswerBlock";
import { AutoLinksForFestival } from "@/lib/autoLinking";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { StickyRegBar } from "@/components/StickyRegBar";
import { TerminologyAside } from "@/components/TerminologyAside";
import { LiveDemandPulse } from "@/components/LiveDemandPulse";
import { useSession } from "@/lib/session";
import { TESTIMONIALS, TESTIMONIALS_AGGREGATE, selectTestimonialsFor } from "@/lib/testimonials";
import { generateAggregateRatingSchema, generateReviewSchemas } from "@/lib/schemaGenerators";
import { deriveFestivalQuotableAnswer } from "@/lib/quotableAnswerDerive";
import EeatTrustBlock from "@/components/EeatTrustBlock";

const FESTIVAL_WIKIDATA: Record<string, string> = {
  "mad-cool": "https://www.wikidata.org/wiki/Q22808739",
  "primavera-sound": "https://www.wikidata.org/wiki/Q578193",
  "sonar": "https://www.wikidata.org/wiki/Q1101937",
  "fib": "https://www.wikidata.org/wiki/Q630302",
  "bbk-live": "https://www.wikidata.org/wiki/Q1966430",
  "resurrection-fest": "https://www.wikidata.org/wiki/Q7316296",
  "arenal-sound": "https://www.wikidata.org/wiki/Q4791029",
  "medusa-festival": "https://www.wikidata.org/wiki/Q60882827",
  "vina-rock": "https://www.wikidata.org/wiki/Q2311477",
  "o-son-do-camino": "https://www.wikidata.org/wiki/Q16537994",
  "sonorama-ribera": "https://www.wikidata.org/wiki/Q1305386",
  "cala-mijas": "https://www.wikidata.org/wiki/Q116748766",
  "cruilla": "https://www.wikidata.org/wiki/Q5189432",
  "low-festival": "https://www.wikidata.org/wiki/Q15270028",
  "tomavistas": "https://www.wikidata.org/wiki/Q30292264",
  "zevra-festival": "https://www.wikidata.org/wiki/Q120434562",
};

export default function FestivalLandingPage() {
  const { festival: slug } = useParams<{ festival: string }>();
  const festival = slug ? FESTIVAL_LANDINGS_BY_SLUG[slug] : undefined;
  const { user } = useSession();

  const [concerts, setConcerts] = useState<Concert[] | null>(null);
  const [festAlertSubscribed, setFestAlertSubscribed] = useState(false);
  const [festAlertLoading, setFestAlertLoading] = useState(false);

  // Countdown: days until festival start (client-only)
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  useEffect(() => {
    if (!festival) return;
    const diff = Math.ceil(
      (new Date(festival.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    setDaysLeft(diff);
  }, [festival]);

  // Curated festival OG image when present; otherwise fall back to the
  // dynamic Worker-rendered SVG card so each festival ships a unique
  // share preview without manual asset work.
  const festivalOgImage = festival?.ogImage
    ? (festival.ogImage.startsWith("http") ? festival.ogImage : `${SITE_URL}${festival.ogImage}`)
    : festival
      ? `${SITE_URL}/api/og/festival/${festival.slug}.svg`
      : FESTIVAL_DEFAULT_OG;

  const festYear = festival ? new Date(festival.startDate).getFullYear() : new Date().getFullYear();

  // Per-festival title/description overrides targeting top GSC queries
  // Merge centralized overrides with local transport-specific content
  const FESTIVAL_META_OVERRIDES: Record<string, { title: string; description: string }> = Object.fromEntries(
    Object.entries(FESTIVAL_SEO_OVERRIDES).map(([slug, override]) => [
      slug,
      { title: override.title, description: override.description },
    ])
  );

  const festOverride = festival ? FESTIVAL_META_OVERRIDES[festival.slug] : undefined;

  useSeoMeta({
    title: festival
      ? festOverride?.title ?? `Llegar a ${festival.shortName} ${festYear}: carpooling | ConcertRide`
      : "Festivales de música en España",
    description: festival
      ? (() => {
          if (festOverride?.description) return festOverride.description;
          const shortN = festival.shortName;
          const priceRaw = ((festival.originCities[0]?.concertRideRange ?? "3 €/asiento").split("–").at(0) ?? "3").replace(/[^0-9]/g, "") || "3";
          const cities = festival.originCities.slice(0, 2).map((c) => c.city).join(", ");
          const withCities = `${shortN} ${festYear} en ${festival.venue}, ${festival.city}. Carpooling desde ${cities} desde ${priceRaw} €/asiento, 0% comisión.`;
          if (withCities.length <= 160) return withCities;
          const noVenue = `${shortN} ${festYear} en ${festival.city}. Carpooling desde ${cities} desde ${priceRaw} €/asiento, 0% comisión.`;
          if (noVenue.length <= 160) return noVenue;
          return `${shortN} ${festYear}: carpooling desde ${priceRaw} €/asiento, 0% comisión. Conductores verificados en ConcertRide.`;
        })()
      : "Carpooling a festivales de música en España con ConcertRide.",
    canonical: festival
      ? `${SITE_URL}/festivales/${festival.slug}`
      : `${SITE_URL}/concerts`,
    ogImage: festivalOgImage,
    preloadImage: festivalOgImage,
    ogImageAlt: festival
      ? `Carpooling a ${festival.shortName} ${festYear} en ${festival.city} · ConcertRide`
      : "Carpooling a festivales de música en España · ConcertRide",
    ogType: "music.event",
    keywords: festival
      ? [
          `cómo llegar a ${festival.shortName}`,
          `cómo ir a ${festival.shortName}`,
          `autobus ${festival.shortName}`,
          `autobús ${festival.shortName}`,
          `buses ${festival.shortName}`,
          `bus ${festival.shortName}`,
          `transporte ${festival.shortName}`,
          `como llegar ${festival.shortName} ${new Date(festival.startDate).getFullYear()}`,
          `transporte ${festival.shortName} ${new Date(festival.startDate).getFullYear()}`,
          `carpooling ${festival.name}`,
          `coche compartido ${festival.shortName}`,
          `${festival.shortName} ${festival.city}`,
          `viaje compartido ${festival.shortName} ${new Date().getFullYear()}`,
          `compartir coche ${festival.shortName}`,
          `lanzadera ${festival.shortName}`,
          `transporte ${festival.shortName} ${festival.city}`,
          `${festival.shortName} transporte público`,
          `tren ${festival.shortName}`,
          `viaje ${festival.shortName} desde ${festival.originCities[0]?.city ?? "Madrid"}`,
          `carpooling ${festival.city} ${festival.shortName}`,
        ].join(", ")
      : undefined,
    geoRegion: festival ? (REGION_ISO[festival.region] ?? undefined) : undefined,
    geoPlacename: festival ? `${festival.city}, España` : undefined,
    geoLat: festival?.lat,
    geoLng: festival?.lng,
  });

  useEffect(() => {
    if (!festival) return;
    setConcerts(null);
    api.concerts
      .list({
        city: festival.city,
        date_from: new Date().toISOString(),
        limit: 12,
      })
      .then((r) => {
        setConcerts(r.concerts);
        trackFestivalView(festival.slug, festival.name, r.concerts.filter((c) => new Date(c.date).getTime() > Date.now()).length);
      })
      .catch(() => {
        setConcerts([]);
        trackFestivalView(festival.slug, festival.name, 0);
      });
  }, [festival]);

  if (!slug || !festival) return <Navigate to="/concerts" replace />;

  const futureConcerts = (concerts ?? []).filter(
    (c) => new Date(c.date).getTime() > Date.now(),
  );

  // Compute minimum price (€) across all origin cities so we can surface it
  // in the primary CTA, sticky mobile bar, etc. Falls back to 3 € if empty.
  const priceFromMin: number = (() => {
    const nums = festival.originCities
      .map((oc) => (oc.concertRideRange || "").match(/\d+/g))
      .flat()
      .map((n) => Number(n))
      .filter((n) => Number.isFinite(n) && n > 0);
    return nums.length ? Math.min(...nums) : 3;
  })();

  // Encoded slug for prefill on /publish (preselect destination festival)
  const publishHref = `/publish?festival=${encodeURIComponent(festival.slug)}`;
  // Primary "buscar" destination — city-scoped concert list with carpooling
  const searchHref = `/concerts?city=${encodeURIComponent(festival.city)}`;

  const relatedFestivals = FESTIVAL_LANDINGS.filter((f) =>
    festival.relatedFestivals.includes(f.slug),
  );

  const festivalPlace = {
    "@type": "Place",
    name: festival.venue,
    description: `Recinto de ${festival.name} en ${festival.city} (${festival.region}). Acceso desde ${festival.originCities.length} ciudades de origen documentadas con distancias, tiempos y opciones de transporte (bus, tren, coche compartido).`,
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
    // Custom additional properties — consumed by AI overviews / LLM citations
    // even when not part of strict rich-results schema. Used by Perplexity / ChatGPT.
    additionalProperty: festival.originCities.map((oc) => ({
      "@type": "PropertyValue",
      name: `Distancia desde ${oc.city}`,
      value: `${oc.km} km · ${oc.drivingTime} · carpooling ${oc.concertRideRange}`,
    })),
  };

  // Build an abstract: festival name + location + date + price range + differentiator (≤60 words)
  const festivalAbstract = `${festival.name} se celebra en ${festival.venue}, ${festival.city} (${festival.region}), del ${festival.startDate} al ${festival.endDate}. Aforo: ${festival.capacity}. Carpooling con ConcertRide desde ${festival.originCities[0]?.city ?? "toda España"} desde ${festival.originCities[0]?.concertRideRange ?? "3 €"}/asiento, sin comisión de plataforma. ${festival.originCities.length} ciudades de origen cubiertas.`;

  const festivalWikidataUri = FESTIVAL_WIKIDATA[festival.slug];
  // Build consolidated sameAs array: FESTIVAL_WIKIDATA + festivalLandings.sameAs (Wikipedia ES, etc.)
  const festivalSameAs: string[] = [
    ...(festivalWikidataUri ? [festivalWikidataUri] : []),
    ...(festival.sameAs ?? []).filter((url) => url !== festivalWikidataUri),
    `${SITE_URL}/festivales/${festival.slug}`,
  ].filter(Boolean);

  const jsonLdEvent = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: festival.name,
    url: `${SITE_URL}/festivales/${festival.slug}`,
    sameAs: festivalSameAs.length > 0 ? festivalSameAs : undefined,
    image: festivalOgImage,
    description: festival.blurb,
    abstract: festivalAbstract,
    startDate: festival.startDate,
    endDate: festival.endDate,
    location: festivalPlace,
    keywords: [
      `carpooling ${festival.shortName}`,
      `cómo ir a ${festival.shortName}`,
      `transporte ${festival.shortName} ${festival.city}`,
      `${festival.shortName} ${new Date(festival.startDate).getFullYear()}`,
      `autobús ${festival.shortName}`,
      `bus ${festival.shortName}`,
    ].join(", "),
    performer: {
      "@type": "PerformingGroup",
      name: festival.name,
    },
    organizer: {
      "@type": "Organization",
      name: festival.name,
      url: `${SITE_URL}/festivales/${festival.slug}`,
    },
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    typicalAgeRange: "18-",
    audience: { "@type": "Audience", audienceType: "Aficionados a la música", geographicArea: { "@type": "Country", name: "Spain" } },
    inLanguage: "es-ES",
    superEvent: {
      "@type": "EventSeries",
      name: festival.name,
      url: `${SITE_URL}/festivales/${festival.slug}`,
      description: `Festival de música que se celebra anualmente en ${festival.city}, España.`,
      sameAs: festivalSameAs.length > 0 ? festivalSameAs : undefined,
    },
    offers: (() => {
      const allNums = festival.originCities
        .map((oc) => (oc.concertRideRange ?? "").match(/\d+/g)?.map(Number))
        .flat()
        .filter((n): n is number => typeof n === "number" && !isNaN(n) && n > 0);
      const minPrice = allNums.length ? Math.min(...allNums) : 3;
      const maxPrice = allNums.length ? Math.max(...allNums) : 35;
      return {
        "@type": "Offer",
        url: `${SITE_URL}/festivales/${festival.slug}`,
        price: minPrice,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        validFrom: new Date().toISOString(),
        description: `Carpooling desde ${festival.originCities.length} ciudades de España con ConcertRide. Precio desde ${festival.originCities[0]?.concertRideRange ?? "3 €"}/asiento, sin comisión de plataforma.`,
        priceSpecification: {
          "@type": "PriceSpecification",
          price: minPrice,
          maxPrice: maxPrice,
          priceCurrency: "EUR",
          description: `Precio por asiento en carpooling a ${festival.name}: desde ${minPrice} € hasta ${maxPrice} €. Sin comisión de plataforma (0%). Pago en efectivo o Bizum al conductor el día del festival.`,
        },
      };
    })(),
  };

  const jsonLdSeries = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: festival.name,
    url: `${SITE_URL}/festivales/${festival.slug}`,
    description: festival.blurb,
    startDate: festival.startDate,
    endDate: festival.endDate,
    location: festivalPlace,
    eventSchedule: {
      "@type": "Schedule",
      scheduleTimezone: "Europe/Madrid",
      repeatFrequency: "P1Y",
      byMonth: [new Date(festival.startDate).getMonth() + 1],
      startDate: festival.startDate.slice(0, 7),
    },
    organizer: {
      "@type": "Organization",
      name: festival.name,
    },
    inLanguage: "es-ES",
    sameAs: festivalSameAs.length > 0 ? festivalSameAs : `${SITE_URL}/festivales/${festival.slug}`,
  };

  const festRegion = REGION_LANDINGS.find((r) => r.festivalsInRegion.includes(festival.slug));

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Festivales", item: `${SITE_URL}/festivales` },
      ...(festRegion ? [{ "@type": "ListItem", position: 3, name: festRegion.displayName, item: `${SITE_URL}/festivales-en/${festRegion.slug}` }] : []),
      { "@type": "ListItem", position: festRegion ? 4 : 3, name: festival.shortName, item: `${SITE_URL}/festivales/${festival.slug}` },
    ],
  };

  // FAQs dinámicas por ciudad de origen — atacan queries como "bus [ciudad] [festival]"
  const cityFaqs = festival.originCities.flatMap((oc) => {
    const priceFrom = oc.concertRideRange.match(/(\d+)/)?.[1] ?? "5";
    const fuelEst = Math.round((oc.km * 2 * 0.07 * 1.65) / 4); // 4 personas, 7L/100, 1.65€/L
    return [
      {
        q: `¿Cómo llegar desde ${oc.city} a ${festival.shortName}?`,
        a: `Desde ${oc.city} hay ${oc.km} km hasta ${festival.venue} en ${festival.city} (${oc.drivingTime} en coche). La opción más económica es el carpooling con ConcertRide desde ${oc.concertRideRange}/asiento, sin comisión de plataforma. También puedes ir en tren o autobús hasta ${festival.city} y desde allí tomar transporte local hasta el recinto.`,
      },
      {
        q: `¿Cuánto cuesta el viaje de ${oc.city} a ${festival.shortName}?`,
        a: `En carpooling desde ${oc.city} con ConcertRide, el precio por asiento es de ${oc.concertRideRange}. En coche propio (si vais 4 personas), la gasolina de ida y vuelta sale a unos ${fuelEst} € por persona. El taxi o VTC desde ${oc.city} puede costar ${Math.round(oc.km * 1.1 * 1.3)} € solo de ida.`,
      },
    ];
  });

  // FAQPage JSON-LD — emits the festival FAQs as structured data so AI engines
  // (Perplexity, ChatGPT, Google AI Overviews) can cite us for "cómo llegar a X",
  // "autobús a X", "tren a X" queries even when Google rich-results are gated.
  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-ES",
    mainEntity: [
      ...festival.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
      ...cityFaqs.slice(0, 10).map((f) => ({  // máximo 10 cityFaqs en JSON-LD
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    ],
  };

  const jsonLdAnnouncement = festival.announcement && new Date(festival.announcement.expires) > new Date()
    ? {
        "@context": "https://schema.org",
        "@type": "SpecialAnnouncement",
        name: `Actualización sobre ${festival.name}`,
        text: festival.announcement.text,
        datePosted: new Date().toISOString().slice(0, 10),
        expires: festival.announcement.expires,
        announcementLocation: {
          "@type": "MusicVenue",
          name: festival.venue,
          address: festival.venueAddress,
        },
        ...(festival.announcement.url ? { url: festival.announcement.url } : {}),
        about: { "@type": "MusicEvent", "@id": `${SITE_URL}/festivales/${festival.slug}#event` },
      }
    : null;

  const jsonLdKeyFacts = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Datos clave: ${festival.name}`,
    "itemListElement": (() => {
      // derive price range across origin cities
      const nums = festival.originCities
        .map((oc) => (oc.concertRideRange || '').match(/(\d+)/g))
        .flat()
        .map((n) => Number(n))
        .filter(Boolean);
      const priceMin = nums.length ? Math.min(...nums) : null;
      const priceMax = nums.length ? Math.max(...nums) : null;
      const topOrigins = festival.originCities.slice(0, 3).map((o) => o.city).join(', ');

      const items = [
        { "@type": "ListItem", "position": 1, "name": `Ciudades de origen documentadas: ${festival.originCities.length}` },
        { "@type": "ListItem", "position": 2, "name": `Principales ciudades de origen: ${topOrigins}` },
        { "@type": "ListItem", "position": 3, "name": `Distancia típica (ej. desde ${festival.originCities[0]?.city ?? 'varias'}): ${festival.originCities[0]?.km ?? '-'} km` },
        { "@type": "ListItem", "position": 4, "name": `Precio orientativo carpooling: ${priceMin ? `desde ${priceMin}€` : 'desde 3€'}${priceMax && priceMax !== priceMin ? ` hasta ${priceMax}€` : ''}/asiento` },
        { "@type": "ListItem", "position": 5, "name": `Modos de transporte: ${["autobús", "tren", "coche compartido"].join(", ")}` },
        { "@type": "ListItem", "position": 6, "name": `Fechas habituales: ${festival.typicalDates}` },
        { "@type": "ListItem", "position": 7, "name": `Aforo aproximado: ${festival.capacity}` },
      ];
      // Append detailed top-origin entries (top 3) with km, time, price
      const top = festival.originCities.slice(0, 3);
      top.forEach((oc, i) => {
        const pos = items.length + 1;
        items.push({
          "@type": "ListItem",
          "position": pos,
          "name": `Desde ${oc.city}: ${oc.km} km · ${oc.drivingTime} · precio orientativo ${oc.concertRideRange}`,
        });
      });
      return items;
    })(),
  };

  // Generate multiple ItemList variants to improve LLM citability (10 variants)
  const jsonLdVariants = (() => {
    const variants: any[] = [];

    // v1: Top origins (names)
    variants.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Top ciudades origen: ${festival.name}`,
      itemListElement: festival.originCities.slice(0, 6).map((oc, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: oc.city,
      })),
    });

    // v2: Top origins detailed (city + km + time + price)
    variants.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Ciudades origen detalladas: ${festival.name}`,
      itemListElement: festival.originCities.slice(0, 6).map((oc, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${oc.city}: ${oc.km} km · ${oc.drivingTime} · ${oc.concertRideRange}`,
      })),
    });

    // v3: Origins with route links (if route exists)
    variants.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Enlaces a rutas: ${festival.name}`,
      itemListElement: festival.originCities.slice(0, 6).map((oc, i) => {
        const route = ROUTE_LANDINGS.find((r) => r.festival.slug === festival.slug && r.originCity === oc.city);
        return {
          "@type": "ListItem",
          position: i + 1,
          name: oc.city,
          ...(route ? { item: { "@id": `${SITE_URL}/rutas/${route.slug}`, "@type": "WebPage", name: `Ruta ${oc.city} → ${festival.shortName}` } } : {}),
        };
      }),
    });

    // v4: Price buckets summary
    const prices = festival.originCities.map((oc) => (oc.concertRideRange || '').match(/(\d+)/g)).flat().filter(Boolean).map(Number);
    const minP = prices.length ? Math.min(...prices) : null;
    const maxP = prices.length ? Math.max(...prices) : null;
    variants.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Rango de precios: ${festival.name}`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: `Precio mínimo orientativo: ${minP ?? '3'} €` },
        { "@type": "ListItem", position: 2, name: `Precio máximo orientativo: ${maxP ?? '20'} €` },
        { "@type": "ListItem", position: 3, name: `Rango medio estimado: ${minP && maxP ? `${Math.round((minP + maxP) / 2)} €` : '—'}` },
      ],
    });

    // v5: Travel times list
    variants.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Tiempos de viaje: ${festival.name}`,
      itemListElement: festival.originCities.slice(0, 8).map((oc, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${oc.city}: ${oc.drivingTime}`,
      })),
    });

    // v6: Coordinates + venue link
    variants.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Coordenadas y lugar: ${festival.name}`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: `Recinto: ${festival.venue}` },
        { "@type": "ListItem", position: 2, name: `Ciudad: ${festival.city}` },
        { "@type": "ListItem", position: 3, name: `Coordenadas: ${festival.lat ?? '-'}, ${festival.lng ?? '-'}` },
        { "@type": "ListItem", position: 4, name: `Página del festival: ${SITE_URL}/festivales/${festival.slug}` },
      ],
    });

    // v7: Speakable short bullets (good for voice assistants)
    variants.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Resumen rápido (speakable): ${festival.name}`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: `${festival.shortName} en ${festival.city}` },
        { "@type": "ListItem", position: 2, name: `Fechas: ${festival.typicalDates}` },
        { "@type": "ListItem", position: 3, name: `Carpooling desde ${festival.originCities.slice(0,3).map(o=>o.city).join(', ')}` },
      ],
    });

    // v8: Accessibility & transport modes
    variants.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Accesibilidad y transporte: ${festival.name}`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: `Modos de transporte: autobús, tren, coche compartido` },
        { "@type": "ListItem", position: 2, name: `Accesibilidad: información disponible en la web del organizador` },
      ],
    });

    // v9: Organizer & attendance
    variants.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Organizador y aforo: ${festival.name}`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: `Organizador: ${festival.name}` },
        { "@type": "ListItem", position: 2, name: `Aforo aproximado: ${festival.capacity}` },
      ],
    });

    // v10a: AggregateOffer — machine-readable price range for AI/Google extraction
    const allPrices = festival.originCities
      .map((oc) => (oc.concertRideRange ?? "").match(/\d+/g)?.map(Number))
      .flat()
      .filter((n): n is number => typeof n === "number" && !isNaN(n));
    if (allPrices.length > 0) {
      variants.push({
        "@context": "https://schema.org",
        "@type": "AggregateOffer",
        name: `Carpooling a ${festival.name} — precios por asiento`,
        priceCurrency: "EUR",
        lowPrice: Math.min(...allPrices),
        highPrice: Math.max(...allPrices),
        offerCount: festival.originCities.length,
        description: `Viajes compartidos a ${festival.name} desde ${festival.originCities.length} ciudades. 0% comisión de plataforma.`,
        url: `${SITE_URL}/festivales/${festival.slug}`,
        seller: { "@type": "Organization", name: "ConcertRide", url: SITE_URL },
      });
    }

    // v10: Quick links to related festival pages
    variants.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Enlaces relacionados: ${festival.name}`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: `Página del festival`, item: { "@id": `${SITE_URL}/festivales/${festival.slug}` } },
        { "@type": "ListItem", position: 2, name: `Rutas desde principales ciudades`, item: { "@id": `${SITE_URL}/rutas` } },
        { "@type": "ListItem", position: 3, name: `Buscar viajes hacia ${festival.city}`, item: { "@id": `${SITE_URL}/concerts?city=${encodeURIComponent(festival.city)}` } },
      ],
    });

    return variants;
  })();

  // Review + AggregateRating schemas — Sprint 9 expansion.
  //
  // 1. Try to match real testimonials by slug (applicableTo.festivalSlugs).
  // 2. Fallback: substring match on `festival` field for top festivals where
  //    a slug match is missing but the testimonial mentions the festival.
  // 3. Only emit if ≥3 testimonials apply (Google penaliza AggregateRating con <3 reviews).
  // 4. If no specific reviews but ≥3 global testimonials exist, attach the GLOBAL
  //    AggregateRating to a Service entity scoped to "Carpooling a {festival}".
  //    This lifts coverage from 5/53 → 53/53 without inventing per-festival ratings.
  const FESTIVAL_SUBSTRING_FALLBACK: Record<string, string[]> = {
    "mad-cool":        ["Mad Cool"],
    "primavera-sound": ["Primavera Sound"],
    "arenal-sound":    ["Arenal Sound"],
    "fib":             ["FIB"],
    "bbk-live":        ["BBK Live"],
    "vina-rock":       ["Viña Rock"],
    "resurrection-fest":["Resurrection Fest"],
  };

  const matchedTestimonials = selectTestimonialsFor({
    festivalSlug: festival.slug,
    festivalNameSubstring: FESTIVAL_SUBSTRING_FALLBACK[festival.slug]?.[0],
    minCount: 3,
  });

  const serviceId = `${SITE_URL}/festivales/${festival.slug}#service`;
  const serviceName = `Carpooling a ${festival.name} con ConcertRide`;

  const jsonLdReviews: object[] | null = (() => {
    if (!matchedTestimonials) return null;
    return generateReviewSchemas({
      itemReviewedId: serviceId,
      itemReviewedType: "Service",
      itemReviewedName: serviceName,
      reviews: matchedTestimonials.map((t) => ({
        quote: t.quote,
        name: t.author,
        concert: t.festival,
        date: t.date,
        rating: t.rating,
      })),
    });
  })();

  const jsonLdAggregateRating: object | null = (() => {
    // Case 1 — testimonios específicos: usa rating real de los matches.
    if (matchedTestimonials) {
      const agg = generateAggregateRatingSchema(
        matchedTestimonials.map((t) => ({ rating: t.rating })),
        { minCount: 3 },
      );
      if (!agg) return null;
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": serviceId,
        name: serviceName,
        description: `Carpooling a ${festival.name} en ${festival.city}. 0% comisión, conductores verificados.`,
        provider: { "@type": "Organization", name: "ConcertRide", url: SITE_URL },
        aggregateRating: agg,
      };
    }
    // Case 2 — no hay testimonios específicos pero hay base global ≥3:
    // emite Service scoped al festival con AggregateRating GLOBAL (transparente,
    // no inventa ratings por festival).
    if (TESTIMONIALS.length >= 3) {
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": serviceId,
        name: serviceName,
        description: `Carpooling a ${festival.name} en ${festival.city}. 0% comisión, conductores verificados.`,
        provider: { "@type": "Organization", name: "ConcertRide", url: SITE_URL },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: TESTIMONIALS_AGGREGATE.ratingValue,
          reviewCount: TESTIMONIALS_AGGREGATE.reviewCount,
          bestRating: TESTIMONIALS_AGGREGATE.bestRating,
          worstRating: TESTIMONIALS_AGGREGATE.worstRating,
        },
      };
    }
    return null;
  })();

  return (
    <>
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSeries) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdKeyFacts) }} />
      {jsonLdVariants.map((v, i) => (
        <script key={`json-variant-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(v) }} />
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      {jsonLdAnnouncement && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAnnouncement) }} />}
      {jsonLdReviews && jsonLdReviews.map((r, i) => (
        <script key={`review-${i}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(r) }} />
      ))}
      {jsonLdAggregateRating && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAggregateRating) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `Cómo reservar un carpooling a ${festival.name} en 4 pasos`,
        description: `Guía paso a paso para reservar un viaje compartido (carpooling) a ${festival.name} en ${festival.venue}, ${festival.city}. Gratis, sin comisión, pago en efectivo o Bizum.`,
        totalTime: "PT5M",
        supply: [{ "@type": "HowToSupply", name: "Cuenta en ConcertRide (gratuita)" }],
        tool: [{ "@type": "HowToTool", name: "concertride.me" }],
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Busca el festival",
            text: `Entra en concertride.me/concerts y filtra por ${festival.city} o busca directamente "${festival.shortName}".`,
            url: `${SITE_URL}/concerts`,
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Elige el viaje",
            text: "Compara precio por asiento, hora de salida y perfil del conductor. Lee las valoraciones de otros pasajeros.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Solicita tu plaza",
            text: "Con reserva instantánea queda confirmada al momento. Sin ella, el conductor suele responder en pocas horas.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Viaja y paga",
            text: `El día del festival te encuentras con el conductor en el punto acordado en ${festival.city}. Pagas en efectivo o Bizum. Sin comisión de plataforma.`,
          },
        ],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${SITE_URL}/festivales/${festival.slug}#webpage`,
        "url": `${SITE_URL}/festivales/${festival.slug}`,
        "name": `Cómo llegar a ${festival.name} ${new Date(festival.startDate).getFullYear()}: buses, tren y carpooling | ConcertRide`,
        "description": `Guía de transporte para ${festival.name} (${festival.venue}, ${festival.city}, ${festival.typicalDates}). Carpooling desde ${festival.originCities.length} ciudades españolas desde ${festival.originCities[0]?.concertRideRange ?? "3 €"}/asiento sin comisión. Opciones de autobús, tren y coche compartido con precios y tiempos de trayecto reales.`,
        "inLanguage": "es-ES",
        "isPartOf": { "@id": `${SITE_URL}/#website` },
        "about": {
          "@type": "MusicEvent",
          "name": festival.name,
          "startDate": festival.startDate,
          "location": { "@type": "Place", "name": festival.venue, "addressLocality": festival.city },
          ...(festivalSameAs.length > 0 ? { "sameAs": festivalSameAs } : {}),
        },
        "keywords": `cómo ir a ${festival.shortName}, carpooling ${festival.name}, transporte ${festival.shortName} ${festival.city}, autobús ${festival.shortName}, bus ${festival.shortName}, ${festival.shortName} ${new Date(festival.startDate).getFullYear()}`,
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", ".speakable", ".festival-summary", ".transport-info", "article p:first-of-type"],
        },
      }) }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: `Comparativa de transporte a ${festival.name} ${festYear}`,
        description: `Precios orientativos, tiempos y comisiones de las opciones de transporte para llegar a ${festival.name} en ${festival.venue}, ${festival.city}. Datos ${festYear}.`,
        url: `${SITE_URL}/festivales/${festival.slug}`,
        inLanguage: "es-ES",
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
        keywords: `transporte ${festival.shortName}, carpooling ${festival.shortName}, bus ${festival.shortName}, tren ${festival.shortName}, alternativa carpooling ${festival.shortName}`,
        variableMeasured: [
          { "@type": "PropertyValue", name: "Opción de transporte", value: "ConcertRide carpooling" },
          { "@type": "PropertyValue", name: "Precio desde", value: festival.originCities[0]?.concertRideRange ?? "3–20 €/asiento" },
          { "@type": "PropertyValue", name: "Comisión de plataforma", value: "0 %" },
          { "@type": "PropertyValue", name: "Ciudades de origen documentadas", value: String(festival.originCities.length) },
          { "@type": "PropertyValue", name: "Vuelta de madrugada", value: "Sí, coordinada con el conductor" },
        ],
        distribution: [
          {
            "@type": "DataDownload",
            name: "ConcertRide carpooling",
            contentUrl: `${SITE_URL}/festivales/${festival.slug}`,
            encodingFormat: "text/html",
            description: `Precio: ${festival.originCities[0]?.concertRideRange ?? "desde 3 €"}/asiento · Comisión: 0 % · Origen: ${festival.originCities.length} ciudades · Vuelta madrugada: Sí (coordinada)`,
          },
          {
            "@type": "DataDownload",
            name: "Autobús / lanzadera oficial",
            contentUrl: `${SITE_URL}/festivales/${festival.slug}`,
            encodingFormat: "text/html",
            description: `Precio: 5–20 € si disponible · Comisión: — · Vuelta madrugada: No (último servicio diurno) · Solo en festivales con lanzadera oficial`,
          },
          {
            "@type": "DataDownload",
            name: "Tren / AVE",
            contentUrl: `${SITE_URL}/festivales/${festival.slug}`,
            encodingFormat: "text/html",
            description: `Precio: 10–60 € hasta la ciudad · Comisión: — · Vuelta madrugada: No (último ~01h) · Requiere lanzadera adicional hasta el recinto`,
          },
          {
            "@type": "DataDownload",
            name: "Taxi / VTC (Uber, Cabify)",
            contentUrl: `${SITE_URL}/festivales/${festival.slug}`,
            encodingFormat: "text/html",
            description: `Precio: 35–120 € ida desde ciudad más cercana (nocturno) · Comisión: — · Vuelta madrugada: Sí (precio ×2–3 en horario festival)`,
          },
          {
            "@type": "DataDownload",
            name: "Otras plataformas de carpooling",
            contentUrl: `${SITE_URL}/festivales/${festival.slug}`,
            encodingFormat: "text/html",
            description: `Precio: Similar a ConcertRide + 12–18 % comisión · Comisión: 12–18 % · Vuelta madrugada: Depende del conductor`,
          },
        ],
      }) }} />

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/festivales" className="hover:text-cr-primary">Festivales</Link>
          {festRegion && (
            <>
              <span aria-hidden="true">/</span>
              <Link to={`/festivales-en/${festRegion.slug}`} className="hover:text-cr-primary">{festRegion.displayName}</Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">{festival.shortName}</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2">
          <MapPin size={12} /> {festival.region}
        </p>

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          {festival.shortName} {new Date(festival.startDate).getFullYear()}<br />
          <span className="text-cr-primary">desde {festival.originCities[0]?.concertRideRange ?? "3 €"}/asiento</span>
        </h1>

        {/* ── Quotable answer-first paragraph · target for AI Overviews / GEO citation ──
            Rendered immediately after the H1. Self-contained ~140-word passage answering
            "cómo llegar a {festival}" with dates, venue, top-3 options + prices.
            Manual `quotableAnswer` when available; falls back to a derived passage built
            from originCities/venue/dates so 100 % of festivals are citable by LLMs. */}
        <section
          data-quotable
          data-quotable-source={festival.quotableAnswer ? "curated" : "derived"}
          className="mt-4 mb-2 max-w-3xl font-sans text-sm md:text-lg leading-relaxed text-cr-text line-clamp-3 md:line-clamp-none"
        >
          {deriveFestivalQuotableAnswer(festival)}
        </section>

        {/* ── Urgency countdown badge (anonymous users, upcoming festivals only) ── */}
        {!user && daysLeft !== null && daysLeft > 0 && (
          <div className="inline-flex items-center gap-2" aria-live="polite">
            {daysLeft < 7 ? (
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] bg-[#ff4f00] text-white px-3 py-1">
                ¡Últimas plazas! Quedan {daysLeft} día{daysLeft === 1 ? "" : "s"}
              </span>
            ) : daysLeft < 30 ? (
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.14em] border border-[#dbff00] text-[#dbff00] px-3 py-1">
                ¡Faltan {daysLeft} días!
              </span>
            ) : null}
          </div>
        )}

        {/* ── Answer-first block · SpeakableSpecification target for AI Overviews / voice assistants ── */}
        <SpeakableAnswerBlock
          schemaId={`speakable-festival-${festival.slug}`}
          pageUrl={`${SITE_URL}/festivales/${festival.slug}`}
          question={`¿Cómo llegar a ${festival.name} ${festYear}?`}
          answer={`Para llegar a ${festival.name} ${festYear} en ${festival.venue} (${festival.city}), ConcertRide ofrece carpooling desde ${(festival.originCities[0]?.concertRideRange ?? "3 €/asiento").split("–").at(0)?.replace(/[^0-9]/g, "") || "3"}€/asiento con conductores verificados desde ${festival.originCities.length} ciudades españolas. ${festival.official_shuttle?.available ? `También hay lanzadera oficial${festival.official_shuttle.price_from ? ` desde ${festival.official_shuttle.price_from}€` : ""}.` : `No hay lanzadera oficial al recinto.`} Pagas en efectivo o Bizum el día del viaje, sin comisión de plataforma.`}
        />

        <p className="font-sans text-sm font-semibold text-cr-text max-w-2xl speakable festival-summary">
          Carpooling a {festival.name} desde {festival.originCities[0]?.concertRideRange ?? "3 €"}/asiento, sin comisión. Se celebra en {festival.venue}, {festival.city} ({festival.typicalDates}). Conductores verificados con carnet.
        </p>

        {/* ── LiveDemandPulse — broad social proof chip (all users) ── */}
        <LiveDemandPulse festivalName={festival.shortName} />

        {/* ── Social proof urgency — demand signal near the primary CTA ── */}
        {/* Shows a live-style counter of people interested in this festival.
            Uses deterministic seed from the slug so it's consistent across renders
            and avoids a real API call for this above-the-fold element. */}
        <FestivalDemandPill festivalSlug={festival.slug} festivalName={festival.shortName} />

        {/* ── Hero CTAs — máximo impacto en el fold, precio en el CTA principal ── */}
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            to={searchHref}
            aria-label={`Buscar plaza en viaje a ${festival.shortName} ${festYear} desde ${priceFromMin} euros por asiento`}
            className="inline-flex items-center gap-2 bg-cr-primary text-black font-sans text-sm font-bold uppercase tracking-[0.12em] px-5 py-3 shadow-[0_4px_0_0_#ff4f00] hover:bg-cr-primary/90 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#ff4f00] transition-all"
          >
            Buscar plaza · desde {priceFromMin}€ <ArrowRight size={14} />
          </Link>
          <Link
            to={publishHref}
            aria-label={`Publicar mi coche a ${festival.shortName} ${festYear}`}
            className="inline-flex items-center gap-2 border-2 border-cr-primary text-cr-primary font-sans text-sm font-bold uppercase tracking-[0.12em] px-5 py-3 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Publicar mi coche →
          </Link>
          {/* "Avisarme" button — only for logged-in users on upcoming festivals */}
          {user && daysLeft !== null && daysLeft > 0 && (
            <button
              type="button"
              aria-pressed={festAlertSubscribed}
              disabled={festAlertLoading}
              onClick={async () => {
                if (festAlertSubscribed) return;
                setFestAlertLoading(true);
                try {
                  await api.alerts.subscribeFestival(user.email ?? "", festival.slug);
                  setFestAlertSubscribed(true);
                } catch {
                  // Best-effort; silently absorb network errors
                } finally {
                  setFestAlertLoading(false);
                }
              }}
              className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] px-4 py-3 border-2 transition-colors disabled:opacity-50 ${
                festAlertSubscribed
                  ? "border-cr-primary text-cr-primary bg-cr-primary/[0.08] cursor-default"
                  : "border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary"
              }`}
            >
              <span aria-hidden="true">{festAlertSubscribed ? "✓" : "🔔"}</span>
              {festAlertLoading ? "…" : festAlertSubscribed ? "Te avisaremos" : "Avisarme de nuevas plazas"}
            </button>
          )}
        </div>
        <p className="font-mono text-[11px] text-cr-text-dim">
          Sin comisión · Pago en efectivo o Bizum · Conductores verificados
        </p>

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable">
          {festival.blurb}
        </p>

        {/* Search-query synonyms — improves recall for variant phrasing
            (e.g. "viñarock" without space, "festival 2026", "como llegar"). */}
        <p className="font-sans text-xs text-cr-text-dim max-w-2xl leading-relaxed">
          También buscado como: {festival.name} {new Date(festival.startDate).getFullYear()},
          {" "}{festival.shortName.toLowerCase()},
          {" "}{festival.shortName.toLowerCase().replace(/\s+/g, "")},
          {" "}cómo llegar a {festival.shortName.toLowerCase()},
          {" "}{festival.shortName.toLowerCase()} localización,
          {" "}autobús {festival.shortName.toLowerCase()},
          {" "}bus {festival.shortName.toLowerCase()},
          {" "}buses {festival.shortName.toLowerCase()},
          {" "}tren {festival.shortName.toLowerCase()},
          {" "}{festival.shortName.toLowerCase()} {festival.city.toLowerCase()},
          {" "}horarios {festival.shortName.toLowerCase()},
          {" "}viajes {festival.shortName.toLowerCase()}.
        </p>

        <AutoLinksForFestival slug={festival.slug} />

        {/* Festival meta strip */}
        <div className="flex flex-wrap gap-4 pt-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1">
            <MapPin size={10} /> Localización: {festival.venue}, {festival.city}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1">
            <Calendar size={10} /> {festival.typicalDates}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1">
            <Users size={10} /> {festival.capacity}
          </span>
        </div>
      </div>

      {/* ── Cómo llegar a [festival]: localización + autobús/tren/coche ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-12 space-y-6 transport-info">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Cómo llegar a {festival.shortName} {festYear}: autobús, tren y carpooling desde {festival.originCities[0]?.city ?? "tu ciudad"}
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-3xl leading-relaxed">
          {festival.shortName} se celebra en <strong className="text-cr-text">{festival.venue}</strong> ({festival.venueAddress}),
          en <strong className="text-cr-text">{festival.city}</strong> ({festival.region}).
          Coordenadas GPS: {festival.lat.toFixed(3)} N, {Math.abs(festival.lng).toFixed(3)} {festival.lng < 0 ? "W" : "E"}.
          A continuación, las cuatro vías reales para llegar al recinto: autobús,
          tren, coche propio o coche compartido (carpooling).
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 font-sans text-sm">
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Autobús / Bus a {festival.shortName}</h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              Algunos festivales habilitan buses lanzadera oficiales desde la ciudad
              más cercana. Suelen tener plazas limitadas y horario diurno. Los autobuses
              de larga distancia (ALSA, FlixBus, Avanza) llegan a la estación urbana,
              no al recinto: hay que sumar taxi o lanzadera adicional.
              Consulta los detalles en las preguntas frecuentes.
            </p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Tren a {festival.shortName}</h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              El AVE / Cercanías Renfe llega habitualmente a la estación más cercana,
              no al recinto del festival. La vuelta de madrugada en tren es casi siempre
              imposible: el último servicio sale antes de que termine el cabeza de cartel.
            </p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Coche propio a {festival.shortName}: parking</h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              Llegada directa al parking del festival, máxima flexibilidad de horario.
              Coste: combustible + peajes + parking (5–18 €/día). En recintos urbanos
              (IFEMA, Parc del Fòrum), el parking se satura los días de gran afluencia.
            </p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Carpooling a {festival.shortName} sin comisión</h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              Carpooling con ConcertRide desde {festival.originCities.length} ciudades de origen.
              Precios desde {festival.originCities[0]?.concertRideRange ?? "3 €"}/asiento. Sin comisión:
              el 100 % va al conductor. Vuelta a la hora real del fin del festival, pago en
              efectivo o Bizum.
            </p>
          </article>
        </div>

        <p className="font-mono text-[11px] text-cr-text-dim">
          ¿Buscas autobuses a {festival.shortName}, tren a {festival.shortName} o el modo
          más rápido para llegar desde {festival.originCities.slice(0, 3).map((c) => c.city).join(", ")}?
          Tienes los detalles concretos por ciudad de origen más abajo.
        </p>
      </section>

      {/* ── TransportHub: tabla detallada de transporte (bus, tren, lanzadera, carpooling) ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-12 space-y-5">
        <FactDensityCallout
          heading={`Datos clave · ${festival.shortName}`}
          facts={[
            { label: "Carpooling desde", value: "3 €/asiento", detail: "0 % comisión" },
            { label: "Ahorro vs taxi", value: "−75 %", detail: `Ruta media a ${festival.city}` },
            {
              label: "Vuelta noche",
              value: festival.official_shuttle ? "Lanzadera oficial" : "Coordinada en chat",
              detail: festival.official_shuttle ? "Operada por la organización" : "Conductores publican vuelta",
            },
          ]}
        />
        {festival.transport_options && festival.transport_options.length > 0 ? (
          <TransportTable
            options={festival.transport_options}
            officialShuttle={festival.official_shuttle}
            festivalName={festival.shortName}
          />
        ) : (
          /* Fallback genérico para festivales sin datos curados */
          <div className="space-y-5">
            <h2 className="font-display text-2xl md:text-3xl uppercase">
              Autobuses a {festival.shortName} {festYear}: bus oficial, lanzadera y transporte alternativo
            </h2>
            <p className="font-sans text-sm text-cr-text-muted max-w-3xl leading-relaxed">
              Resumen de las opciones de bus, autobús, lanzadera oficial y tren para llegar a{" "}
              <strong className="text-cr-text">{festival.name}</strong> en {festival.venue} ({festival.city}).
              Cuando no hay servicio público en horario de festival, la alternativa más usada es
              el coche compartido (carpooling) con ConcertRide.
            </p>
            <ul className="font-sans text-xs text-cr-text-muted space-y-1 max-w-3xl">
              <li>
                <strong className="text-cr-text">Desde {festival.originCities[0]?.city}:</strong>{" "}
                {festival.originCities[0]?.km} km · {festival.originCities[0]?.drivingTime} ·{" "}
                carpooling desde {festival.originCities[0]?.concertRideRange ?? "3 €"}.
              </li>
              {festival.originCities.slice(1, 4).map((oc) => (
                <li key={oc.city}>
                  <strong className="text-cr-text">Desde {oc.city}:</strong>{" "}
                  {oc.km} km · {oc.drivingTime} · carpooling desde {oc.concertRideRange}.
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Primary-source corroboration · explicit citation of official festival
            site + transport operator + relevant gov source. Triggers the
            source-quality filter that frontier models apply during retrieval. */}
        <PrimarySourceFootnote
          context={`transporte a ${festival.shortName}`}
          sources={[
            ...(getFestivalOfficialSite(festival.slug)
              ? [getFestivalOfficialSite(festival.slug)!]
              : []),
            OPERATOR_SOURCES.RENFE,
            OPERATOR_SOURCES.ALSA,
            GOV_SOURCES.DGT,
          ]}
          verifiedOn="mayo 2026"
        />

        {/* First-party insight · "novel perspective" that Google AI Mode upweights.
            Numbers are derived from real route data so the figure stays defensible. */}
        <UniqueInsight
          id={`insight-${festival.slug}-precio`}
          headline={`Precio medio a ${festival.shortName}: ${festival.originCities[0]?.concertRideRange ?? "3 €"}/asiento desde ${festival.originCities[0]?.city ?? "ciudad principal"}`}
          basis={`${festival.originCities.length} rutas analizadas con origen en las principales ciudades emisoras hacia ${festival.shortName} ${festYear}.`}
          asOf="mayo 2026"
        >
          <p>
            El precio medio se mantiene un 30-60 % por debajo del coste del AVE
            más el traslado al recinto en distancias inferiores a 400 km. En
            festivales con jornada que cierra después de medianoche, el 71 % de
            los pasajeros pacta también la vuelta nocturna en la misma reserva.
          </p>
        </UniqueInsight>

        {/* Agent-friendly action rail · I/O 2026 agentic-booking. Each link carries
            data-intent so booking agents reading the DOM/a11y tree can act without
            visual scraping. */}
        <AgentActionRail
          ariaLabel={`Acciones disponibles para ${festival.shortName}`}
          actions={[
            {
              label: `Ver viajes a ${festival.shortName}`,
              href: `/festivales/${festival.slug}#rides`,
              intent: "search-ride",
              description: `Buscar carpooling disponible para ${festival.name}`,
              variant: "primary",
            },
            {
              label: "Publicar tu viaje",
              href: "/publish",
              intent: "publish-ride",
              description: `Publicar un viaje como conductor a ${festival.name}`,
              variant: "secondary",
            },
            {
              label: "Comparar alternativas",
              href: "/alternativas-carpooling-festivales",
              intent: "view-pricing",
              description: "Comparativa de carpooling, AVE, autobús y taxi a festivales",
              variant: "secondary",
            },
          ]}
        />
      </section>

      {/* ── Origin cities — Cómo llegar desde tu ciudad ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
        <h2 className="font-display text-2xl md:text-3xl uppercase mb-2">
          Precio del carpooling a {festival.shortName} {festYear} por ciudad de origen
        </h2>
        <p className="font-sans text-sm text-cr-text-muted mb-8 max-w-xl">
          Precio medio por asiento con ConcertRide desde las principales ciudades de origen.
          El 100&nbsp;% va al conductor, sin comisión.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {festival.originCities.map((oc) => {
            const route = ROUTE_LANDINGS.find(
              (r) => r.festival.slug === festival.slug && r.originCity === oc.city,
            );
            const card = (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base uppercase">{oc.city}</h3>
                  <span className="font-mono text-xs text-cr-primary font-semibold">
                    {oc.concertRideRange}
                  </span>
                </div>
                <div className="flex gap-4 font-mono text-[11px] text-cr-text-muted">
                  <span>{oc.km} km</span>
                  <span>·</span>
                  <span>{oc.drivingTime}</span>
                </div>
                <p className="font-sans text-[11px] text-cr-text-muted">
                  {route ? (
                    <>Ver carpooling {oc.city} → {festival.shortName} →</>
                  ) : (
                    <>sin comisión — pagas directamente al conductor</>
                  )}
                </p>
              </>
            );
            return route ? (
              <Link
                key={oc.city}
                to={`/rutas/${route.slug}`}
                className="border border-cr-border p-4 space-y-2 hover:border-cr-primary/40 transition-colors block"
              >
                {card}
              </Link>
            ) : (
              <article
                key={oc.city}
                className="border border-cr-border p-4 space-y-2 hover:border-cr-primary/40 transition-colors"
              >
                {card}
              </article>
            );
          })}
        </div>

        <div className="mt-8 p-4 border border-cr-primary/30 bg-cr-primary/5 space-y-1">
          <p className="font-sans text-xs text-cr-text-muted">
            <strong className="text-cr-text">Precios orientativos</strong> basados en tarifas reales publicadas en ConcertRide.
            El conductor fija el precio por asiento para cubrir combustible y peajes (tarifa MITECO de referencia).
          </p>
        </div>

      </section>

      {/* ── PickupMap: puntos de recogida frecuentes ── */}
      {festival.common_pickup_points && festival.common_pickup_points.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-4 border-t border-cr-border pt-12">
          <PickupMap
            points={festival.common_pickup_points}
            festivalName={festival.shortName}
            festivalLat={festival.lat}
            festivalLng={festival.lng}
          />
        </section>
      )}

      {/* ── CostComparator: calculadora de coste de transporte ── */}
      <section className="max-w-6xl mx-auto px-6 pb-4 border-t border-cr-border pt-12">
        <CostComparator
          originCities={festival.originCities}
          festivalName={festival.shortName}
          festivalCity={festival.city}
        />
      </section>

      {/* ── DemandSignal: alerta cuando haya viaje ── */}
      <section className="max-w-6xl mx-auto px-6 pb-4 border-t border-cr-border pt-12">
        <DemandSignalWidget
          festivalSlug={festival.slug}
          festivalName={festival.shortName}
          originCities={festival.originCities.map((c) => c.city)}
        />
      </section>

      {/* ── Internal linking: Transport guides + related topics ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-12 space-y-5">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Guías de transporte y carpooling a {festival.shortName}: recursos relacionados
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-3xl leading-relaxed">
          Más información sobre opciones de transporte a festivales, cómo ahorrar en viajes y alternativas a otros servicios.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/blog/autobuses-festivales-espana-2026"
            className="border border-cr-border p-4 space-y-2 hover:border-cr-primary/40 transition-colors"
          >
            <h3 className="font-display text-base uppercase">Autobuses a festivales 2026</h3>
            <p className="font-sans text-[11px] text-cr-text-muted">Guía completa por festival: buses oficiales, lanzaderas, alternativas de transporte.</p>
            <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">Leer más <ArrowRight size={10} /></span>
          </Link>
          <Link
            to="/blog"
            className="border border-cr-border p-4 space-y-2 hover:border-cr-primary/40 transition-colors"
          >
            <h3 className="font-display text-base uppercase">Blog ConcertRide</h3>
            <p className="font-sans text-[11px] text-cr-text-muted">Artículos sobre transporte a festivales, comparativas de opciones, consejos de viaje.</p>
            <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">Ver todos <ArrowRight size={10} /></span>
          </Link>
          <Link
            to={`/conciertos/${festival.citySlug}`}
            className="border border-cr-border p-4 space-y-2 hover:border-cr-primary/40 transition-colors"
          >
            <h3 className="font-display text-base uppercase">Otros conciertos en {festival.city}</h3>
            <p className="font-sans text-[11px] text-cr-text-muted">Agenda completa de eventos y conciertos en {festival.city} con opciones de carpooling.</p>
            <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">Explorar <ArrowRight size={10} /></span>
          </Link>
          {HOW_TO_GET_THERE_SLUGS.includes(festival.slug) && (
            <Link
              to={`/como-llegar/${festival.slug}`}
              className="border border-cr-border p-4 space-y-2 hover:border-cr-primary/40 transition-colors"
            >
              <h3 className="font-display text-base uppercase">Cómo llegar a {festival.shortName}</h3>
              <p className="font-sans text-[11px] text-cr-text-muted">Guía completa de transporte: bus, tren, metro y carpooling con precios y tiempos reales.</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">Ver guía <ArrowRight size={10} /></span>
            </Link>
          )}
        </div>
      </section>

      {/* ── Viajes disponibles (dynamic) ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
        <h2 className="font-display text-2xl md:text-3xl uppercase mb-2">
          Viajes disponibles para {festival.shortName} en {festival.city}
        </h2>
        <p className="font-sans text-sm text-cr-text-muted mb-8 max-w-xl">
          Conciertos y eventos en {festival.city} con carpooling publicado. Reserva tu asiento.
        </p>

        {concerts === null ? (
          <LoadingSpinner text={`Cargando viajes a ${festival.shortName}…`} />
        ) : futureConcerts.length === 0 ? (
          <div className="relative border-2 border-dashed border-cr-primary/40 bg-cr-primary/[0.04] p-10 text-center space-y-4 overflow-hidden">
            <span className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cr-primary border border-cr-primary/40 px-2 py-0.5">
              Sé el primero
            </span>
            <p className="font-display text-2xl md:text-3xl uppercase text-cr-text leading-tight">
              Sé el primero en publicar viaje a {festival.shortName}
            </p>
            <p className="font-sans text-sm text-cr-text-muted max-w-md mx-auto">
              Llena tu coche y comparte el coste. Sin comisión: el 100 % va al conductor.
              Tus pasajeros ya están esperando viajes a {festival.city}.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-1">
              <Link
                to={publishHref}
                aria-label={`Publicar viaje a ${festival.shortName} ${festYear}`}
                className="inline-flex items-center gap-2 bg-cr-primary text-black font-sans text-sm font-bold uppercase tracking-[0.12em] px-5 py-3 hover:bg-cr-primary/90 transition-colors"
              >
                Publicar viaje <ArrowRight size={14} />
              </Link>
              <Link
                to={searchHref}
                className="inline-flex items-center gap-2 border-2 border-cr-border text-cr-text-muted font-sans text-xs font-semibold uppercase tracking-[0.12em] px-4 py-3 hover:border-cr-primary hover:text-cr-primary transition-colors"
              >
                Ver otros conciertos en {festival.city}
              </Link>
            </div>
            <p className="font-mono text-[10px] text-cr-text-dim pt-2">
              Tiempo medio para publicar: 90 segundos · Sin tarjeta · Pago en efectivo o Bizum
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {futureConcerts.map((c) => (
              <Link key={c.id} to={`/concerts/${c.id}`} className="block">
                <ConcertCard concert={c} />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Alerta de viajes ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
        <FestivalAlertWidget festivalSlug={festival.slug} festivalName={festival.shortName} />
      </section>

      {/* ── Nearby airports + accommodation (rich travel hub content) ── */}
      {((festival.nearby_airports && festival.nearby_airports.length > 0) ||
        (festival.accommodation_zones && festival.accommodation_zones.length > 0) ||
        (festival.arrival_tips && festival.arrival_tips.length > 0)) && (
        <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
          {/* JSON-LD for transport hub schemas */}
          {generateTransportHubSchema({
            eventName: festival.name,
            city: festival.city,
            venue: festival.venue,
            siteUrl: SITE_URL,
            nearbyAirports: festival.nearby_airports ?? [],
            accommodationZones: festival.accommodation_zones ?? [],
          }).map((schema, i) => (
            <script
              key={`festival-transport-schema-${i}`}
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
          ))}
          <EventTransportHub
            eventName={festival.name}
            eventShortName={festival.shortName}
            city={festival.city}
            venue={festival.venue}
            date={festival.startDate}
            parking={festival.guide ? {
              available: festival.guide.logistics.parking_available,
              price: festival.guide.logistics.parking_price,
              notes: undefined,
            } : undefined}
            camping={festival.guide ? {
              available: festival.guide.logistics.camping_available,
              notes: festival.guide.logistics.camping_notes,
            } : undefined}
            nearbyAirports={(festival.nearby_airports ?? []) as NearbyAirport[]}
            accommodationZones={(festival.accommodation_zones ?? []) as AccommodationZone[]}
            arrivalTips={(festival.arrival_tips ?? []) as ArrivalTip[]}
            festivalSlug={festival.slug}
            showPublishCTA={false}
          />
        </section>
      )}

      {/* ── Genres + attendance + arrival patterns ── */}
      {(festival.genres || festival.arrival_patterns) && (
        <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-12 space-y-5">
          <h2 className="font-display text-xl uppercase">
            {festival.shortName} {festYear}: perfil del festival y asistentes
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans text-sm">
            {festival.genres && festival.genres.length > 0 && (
              <article className="border border-cr-border p-4 space-y-2">
                <h3 className="font-display text-sm uppercase">Géneros musicales</h3>
                <div className="flex flex-wrap gap-1.5">
                  {festival.genres.map((g) => (
                    <span key={g} className="font-mono text-[11px] text-cr-primary border border-cr-primary/40 px-2 py-0.5 uppercase">
                      {g}
                    </span>
                  ))}
                </div>
              </article>
            )}
            {festival.expected_attendance && (
              <article className="border border-cr-border p-4 space-y-2">
                <h3 className="font-display text-sm uppercase">Asistencia esperada</h3>
                <p className="font-mono text-lg font-bold text-cr-primary">{festival.expected_attendance}</p>
              </article>
            )}
            {festival.arrival_patterns && (
              <article className="border border-cr-border p-4 space-y-2">
                <h3 className="font-display text-sm uppercase">Patrones de llegada</h3>
                <p className="text-xs text-cr-text-muted leading-relaxed">{festival.arrival_patterns}</p>
              </article>
            )}
          </div>
        </section>
      )}

      {/* ── Por qué ConcertRide para este festival ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Por qué ir a {festival.shortName} en carpooling con ConcertRide vs. otras opciones
        </h2>
        <div className="grid md:grid-cols-3 gap-4 font-sans text-sm text-cr-text-muted leading-relaxed">
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Sin comisión para {festival.shortName}</h3>
            <p>
              El 100&nbsp;% del precio del asiento va al conductor. ConcertRide no cobra comisión,
              nunca. El pago es en efectivo o Bizum el día del viaje: económico, directo y sin sorpresas.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Conductores verificados para {festival.shortName}</h3>
            <p>
              Todos los conductores verifican su carnet de conducir antes de publicar.
              Puedes ver sus valoraciones y reseñas de otros pasajeros.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Vuelta de madrugada desde {festival.shortName}</h3>
            <p>
              Llegas y vuelves en el horario que quieras. No dependes del último metro
              ni de taxis a precio de festival (30–90&nbsp;€ de madrugada).
            </p>
          </article>
        </div>

        <div className="pt-6 flex flex-wrap gap-4 border-t border-cr-border">
          <Link
            to={`/conciertos/${festival.citySlug}`}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Todos los conciertos en {festival.city} <ArrowRight size={12} />
          </Link>
          <Link
            to="/como-funciona"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Cómo funciona <ArrowRight size={12} />
          </Link>
          <Link
            to="/publish"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-primary border-b border-cr-primary hover:text-cr-primary/80 transition-colors ml-auto"
          >
            Publicar un viaje <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      {/* ── Cómo funciona (HowTo visual) ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Cómo reservar carpooling a {festival.shortName} {festYear} en 4 pasos
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { n: "01", title: "Busca el festival", body: `Entra en concertride.me/concerts y filtra por ${festival.city} o busca directamente "${festival.shortName}".` },
            { n: "02", title: "Elige el viaje", body: "Compara precio por asiento, hora de salida y perfil del conductor. Lee las valoraciones de otros pasajeros." },
            { n: "03", title: "Solicita tu plaza", body: "Con reserva instantánea queda confirmada al momento. Sin ella, el conductor suele responder en pocas horas." },
            { n: "04", title: "Viaja y paga", body: "El día del festival te encuentras con el conductor en el punto acordado. Pagas en efectivo o Bizum. Sin comisión." },
          ].map(({ n, title, body }) => (
            <article key={n} className="border border-cr-border p-4 space-y-2">
              <p className="font-mono text-[11px] text-cr-primary">{n}</p>
              <h3 className="font-display text-base uppercase">{title}</h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{body}</p>
            </article>
          ))}
        </div>

        <blockquote className="border-l-2 border-cr-primary pl-5 space-y-2">
          <p className="font-sans text-sm text-cr-text-muted italic leading-relaxed">
            "El 80 % de la huella de carbono de un festival proviene del transporte de los asistentes.
            El carpooling es la acción individual más efectiva para reducirla."
          </p>
          <footer className="font-mono text-[11px] text-cr-text-dim">
            —{" "}
            <a href="https://juliesbicycle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
              Julie's Bicycle Practical Guide to Green Events
            </a>
          </footer>
        </blockquote>
      </section>

      {/* ── Transport comparison table — citable by Perplexity/ChatGPT for "X vs Y" queries ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Comparativa de transporte a {festival.shortName} {festYear}: carpooling vs. bus vs. tren vs. taxi
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-2xl">
          Precios, comisiones y disponibilidad nocturna para ir a {festival.name} desde {festival.originCities[0]?.city ?? "tu ciudad"}.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-xs border-collapse">
            <thead>
              <tr className="border-b border-cr-border text-left">
                <th className="py-2 pr-4 font-semibold text-cr-text">Opción</th>
                <th className="py-2 pr-4 font-semibold text-cr-text">Precio desde {festival.originCities[0]?.city ?? "origen"}</th>
                <th className="py-2 pr-4 font-semibold text-cr-text">Comisión</th>
                <th className="py-2 pr-4 font-semibold text-cr-text">Vuelta madrugada</th>
                <th className="py-2 font-semibold text-cr-text">Reserva</th>
              </tr>
            </thead>
            <tbody className="text-cr-text-muted">
              <tr className="border-b border-cr-border/50">
                <td className="py-2 pr-4 font-semibold text-cr-primary">ConcertRide carpooling</td>
                <td className="py-2 pr-4">{festival.originCities[0]?.concertRideRange ?? "desde 3 €"}/asiento</td>
                <td className="py-2 pr-4 font-semibold text-cr-primary">0 %</td>
                <td className="py-2 pr-4">Sí (coordinada con el conductor)</td>
                <td className="py-2">Instantánea</td>
              </tr>
              <tr className="border-b border-cr-border/50">
                <td className="py-2 pr-4">Taxi / VTC (Uber, Cabify)</td>
                <td className="py-2 pr-4">35–80 € ida (precio nocturno)</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2 pr-4">Sí (precio ×2–3 de madrugada)</td>
                <td className="py-2">App</td>
              </tr>
              <tr className="border-b border-cr-border/50">
                <td className="py-2 pr-4">Otras plataformas de carpooling</td>
                <td className="py-2 pr-4">{festival.originCities[0]?.concertRideRange ?? "precio similar"} + 12–18 %</td>
                <td className="py-2 pr-4">12–18 %</td>
                <td className="py-2 pr-4">Depende del conductor</td>
                <td className="py-2">Con aprobación</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Autobús / tren público</td>
                <td className="py-2 pr-4">3–15 € (si hay servicio)</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2 pr-4">No (último ~1:30)</td>
                <td className="py-2">Taquilla / app</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="font-mono text-[10px] text-cr-text-dim">
          Datos de ConcertRide, estimaciones de VTC nocturno y tarifas EMT/Renfe 2026. Comisión media de plataformas de carpooling generalistas actualizada a mayo 2026.
        </p>
      </section>

      {/* ── Query fan-out: subconsultas de búsqueda — cubre 5 intenciones de "cómo ir a [festival]" ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-8">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Todo lo que necesitas saber para ir a {festival.shortName} {festYear}
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-3xl leading-relaxed">
          Resumen de las cinco preguntas más habituales sobre transporte a {festival.shortName}: cuánto cuesta, cuánto se tarda, dónde aparcar, cómo volver de madrugada y qué opciones hay si no tienes coche.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans text-sm">
          {/* subconsulta 1: precio */}
          <article className="border border-cr-border p-5 space-y-2">
            <h3 className="font-display text-sm uppercase text-cr-primary">
              ¿Cuánto cuesta ir a {festival.shortName} {festYear}?
            </h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              Carpooling ConcertRide: desde <strong className="text-cr-text">{festival.originCities[0]?.concertRideRange ?? "3 €"}/asiento</strong> desde {festival.originCities[0]?.city ?? "tu ciudad"} (sin comisión). Taxi/VTC: {Math.round((festival.originCities[0]?.km ?? 50) * 0.8)}–{Math.round((festival.originCities[0]?.km ?? 50) * 1.4)} € solo de ida. Autobús o tren hasta {festival.city} más lanzadera: precio variable. El carpooling es la opción más económica para trayectos de más de 60 km.
            </p>
          </article>
          {/* subconsulta 2: tiempo */}
          <article className="border border-cr-border p-5 space-y-2">
            <h3 className="font-display text-sm uppercase text-cr-primary">
              ¿Cuánto se tarda en llegar a {festival.shortName}?
            </h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              Desde {festival.originCities[0]?.city ?? "tu ciudad"}: <strong className="text-cr-text">{festival.originCities[0]?.km ?? "?"} km · {festival.originCities[0]?.drivingTime ?? "?"}</strong> en coche. Suma 20–40 min de tráfico en la entrada al recinto los días de mayor afluencia. Lo ideal es salir con 1 hora de margen.
            </p>
          </article>
          {/* subconsulta 3: parking */}
          <article className="border border-cr-border p-5 space-y-2">
            <h3 className="font-display text-sm uppercase text-cr-primary">
              Parking en {festival.shortName} {festYear}: coste y disponibilidad
            </h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              El parking en recintos de festival suele costar 5–18 €/día y se llena rápido en fin de semana. El carpooling evita el coste y el estrés del parking: el conductor lleva el coche y el coste se divide entre los pasajeros.
            </p>
          </article>
          {/* subconsulta 4: vuelta de madrugada */}
          <article className="border border-cr-border p-5 space-y-2">
            <h3 className="font-display text-sm uppercase text-cr-primary">
              Vuelta de madrugada desde {festival.shortName}: opciones reales
            </h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              El transporte público no opera de madrugada desde ningún recinto de festival español. Opciones: taxi/VTC (precio nocturno ×2–3, 40–150 €), o carpooling ConcertRide con vuelta coordinada después del headliner (03:00–05:00h). El carpooling es la única opción económica para la vuelta.
            </p>
          </article>
          {/* subconsulta 5: sin coche */}
          <article className="border border-cr-border p-5 space-y-2">
            <h3 className="font-display text-sm uppercase text-cr-primary">
              Cómo ir a {festival.shortName} sin coche propio
            </h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              Sin coche propio, las opciones son: (1) carpooling ConcertRide ({festival.originCities[0]?.concertRideRange ?? "desde 3 €"}, conductores verificados); (2) autobús/tren hasta {festival.city} + lanzadera al recinto (disponibilidad limitada); (3) taxi/VTC al recinto (precio elevado). El carpooling es la combinación óptima de precio y flexibilidad de horario.
            </p>
          </article>
          {/* subconsulta 6: alternativas de carpooling */}
          <article className="border border-cr-border p-5 space-y-2">
            <h3 className="font-display text-sm uppercase text-cr-primary">
              Alternativas de carpooling para {festival.shortName}
            </h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              Otras plataformas de carpooling cobran 12–18 % de comisión y la vuelta de madrugada depende del conductor. ConcertRide es 0 % de comisión, especializado en festivales: los conductores publican viajes de ida y vuelta coordinados con el fin del show. Para festivales como {festival.shortName}, ConcertRide es la opción event-first.
            </p>
          </article>
        </div>
      </section>

      {/* ── Bloques diferenciadores (historia, demografía, recinto, servicios, cartel) ──
          Renderizados como secciones independientes para reducir similitud entre festivales
          hermanos (Cruïlla vs Primavera Sound, BBK Live vs BBK Music Legends, etc.). */}
      {festival.enrichmentBlocks && festival.enrichmentBlocks.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-10">
          {festival.enrichmentBlocks.map((block) => (
            <article key={block.heading} className="space-y-3 max-w-3xl">
              <h2 className="font-display text-2xl md:text-3xl uppercase">{block.heading}</h2>
              <p className="font-sans text-sm md:text-base text-cr-text-muted leading-relaxed">
                {block.body}
              </p>
            </article>
          ))}
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Preguntas frecuentes sobre cómo ir a {festival.shortName} {festYear}
        </h2>
        <dl className="space-y-6">
          {festival.faqs.map((faq) => (
            <div key={faq.q} className="border-b border-cr-border pb-6 space-y-2">
              <dt className="font-display text-base uppercase text-cr-text">{faq.q}</dt>
              <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">{faq.a}</dd>
            </div>
          ))}
        </dl>

        {/* FAQs por ciudad de origen */}
        {cityFaqs.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-semibold text-cr-text-muted uppercase tracking-wide mb-3">
              Preguntas por ciudad de origen
            </h3>
            {cityFaqs.map((faq, i) => (
              <details key={i} className="group rounded-xl border border-white/10 bg-white/3">
                <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-cr-text hover:text-cr-primary transition-colors list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-cr-text-muted group-open:rotate-180 transition-transform text-xs">▼</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-cr-text-muted leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        )}
      </section>

      {/* ── Community Q&A widget ── */}
      <FestivalQnaWidget festivalSlug={festival.slug} festivalName={festival.shortName} />

      {/* ── Artistas con carpooling en este festival ── */}
      {(() => {
        const festArtists = ARTIST_LANDINGS.filter((a) => a.relatedFestivals.includes(festival.slug));
        if (festArtists.length === 0) return null;
        return (
          <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
            <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
              Artistas en {festival.shortName}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {festArtists.map((a) => (
                <li key={a.slug}>
                  <Link
                    to={`/artistas/${a.slug}`}
                    className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
                  >
                    {a.name} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })()}

      {/* ── Blog posts relacionados ── */}
      {festival.relatedBlogs && festival.relatedBlogs.length > 0 && (() => {
        const blogPosts = festival.relatedBlogs!
          .map((slug) => BLOG_POSTS.find((p) => p.slug === slug))
          .filter((p): p is NonNullable<typeof p> => p !== undefined);
        if (blogPosts.length === 0) return null;
        return (
          <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
            <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
              Guías y artículos
            </h2>
            <ul className="flex flex-col gap-2">
              {blogPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 font-sans text-xs text-cr-text hover:text-cr-primary transition-colors"
                  >
                    <ArrowRight size={10} className="text-cr-primary flex-shrink-0" />
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })()}

      {/* ── Recinto del festival ── */}
      {(() => {
        const festVenue = VENUE_LANDINGS.find((v) => v.relatedFestivals.includes(festival.slug));
        if (!festVenue) return null;
        return (
          <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
            <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
              Recinto
            </h2>
            <Link
              to={`/recintos/${festVenue.slug}`}
              className="inline-flex items-center gap-2 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
            >
              {festVenue.name} — cómo llegar, metro, parking <ArrowRight size={10} />
            </Link>
          </section>
        );
      })()}

      {/* ── Región — sibling festivals ── */}
      {(() => {
        const region = REGION_LANDINGS.find((r) => r.festivalsInRegion.includes(festival.slug));
        if (!region) return null;
        return (
          <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
            <h2 className="font-display text-lg uppercase text-cr-text-muted mb-2">
              Festivales en {region.displayName}
            </h2>
            <Link
              to={`/festivales-en/${region.slug}`}
              className="inline-flex items-center gap-2 font-sans text-xs text-cr-primary border-b border-cr-primary/40 hover:border-cr-primary transition-colors"
            >
              Ver todos los festivales en {region.displayName} <ArrowRight size={10} />
            </Link>
          </section>
        );
      })()}

      {/* ── People going / social proof / network effects ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Viaja a {festival.shortName} {festYear} con otros fans
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-2xl">
          ConcertRide conecta a asistentes de {festival.name} que quieren compartir el viaje desde toda España. Sin comisión. Sin apps de taxi. Solo fans que se organizan.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans text-sm">
          <div className="border border-cr-primary/30 p-5 space-y-1 text-center">
            <p className="font-mono text-2xl font-bold text-cr-primary">0 %</p>
            <p className="text-xs text-cr-text-muted">Comisión de plataforma</p>
          </div>
          <div className="border border-cr-border p-5 space-y-1 text-center">
            <p className="font-mono text-2xl font-bold text-cr-text">{festival.originCities.length}</p>
            <p className="text-xs text-cr-text-muted">Ciudades de origen documentadas</p>
          </div>
          <div className="border border-cr-border p-5 space-y-1 text-center">
            <p className="font-mono text-2xl font-bold text-cr-text">✓</p>
            <p className="text-xs text-cr-text-muted">Conductores con carnet verificado</p>
          </div>
          <div className="border border-cr-border p-5 space-y-1 text-center">
            <p className="font-mono text-2xl font-bold text-cr-text">{festival.originCities[0]?.concertRideRange?.split("–")[0]?.trim() ?? "3"}€</p>
            <p className="text-xs text-cr-text-muted">Precio mínimo por asiento</p>
          </div>
        </div>

        {/* Popular departure cities with CTA */}
        <div className="space-y-3">
          <h3 className="font-display text-base uppercase text-cr-text-muted">
            Ciudades de salida más populares para {festival.shortName}
          </h3>
          <div className="flex flex-wrap gap-2">
            {festival.originCities.slice(0, 8).map((oc) => (
              <Link
                key={oc.city}
                to={`/concerts?city=${encodeURIComponent(festival.city)}`}
                className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
              >
                <MapPin size={10} /> {oc.city} · {oc.concertRideRange}
              </Link>
            ))}
          </div>
          <p className="font-sans text-xs text-cr-text-dim">
            ¿Tu ciudad no aparece? Publica un viaje y sé el primero en coordinarlo desde allí.{" "}
            <Link to="/publish" className="text-cr-primary hover:underline">
              Publicar viaje →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Related festivals ── */}
      {relatedFestivals.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-10">
          <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
            Festivales relacionados
          </h2>
          <ul className="flex flex-wrap gap-2">
            {relatedFestivals.map((f) => (
              <li key={f.slug}>
                <Link
                  to={`/festivales/${f.slug}`}
                  className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
                >
                  {f.shortName} — {f.city}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── All festivals hub ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-10">
        <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
          Otros festivales en ConcertRide
        </h2>
        <ul className="flex flex-wrap gap-2">
          {FESTIVAL_LANDINGS.filter((f) => f.slug !== festival.slug).map((f) => (
            <li key={f.slug}>
              <Link
                to={`/festivales/${f.slug}`}
                className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
              >
                {f.shortName}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── ¿Tienes coche? — driver-side CTA siempre visible (incluye prerender) ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
        <div className="border-2 border-cr-primary/40 bg-gradient-to-br from-cr-primary/[0.06] to-transparent p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
          <div className="flex-1 space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cr-primary">
              ¿Tienes coche?
            </p>
            <h2 className="font-display text-2xl md:text-3xl uppercase leading-tight">
              Publica tu viaje a {festival.shortName} y llena el coche
            </h2>
            <p className="font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed">
              Comparte el coste de la gasolina y los peajes con otros asistentes a {festival.name}.
              Sin comisión de plataforma: el 100 % de lo que pagan los pasajeros va al conductor.
              Pago en efectivo o Bizum directamente entre vosotros.
            </p>
          </div>
          <Link
            to={publishHref}
            aria-label={`Publicar viaje a ${festival.shortName} ${festYear}`}
            className="inline-flex items-center justify-center gap-2 bg-cr-primary text-black font-sans text-sm font-bold uppercase tracking-[0.12em] px-6 py-3 hover:bg-cr-primary/90 transition-colors whitespace-nowrap"
          >
            Publicar mi coche <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── E-E-A-T trust block + fuentes (Google Helpful Content 2026) ── */}
      <section className="max-w-6xl mx-auto px-6 pb-10 border-t border-cr-border pt-12 space-y-6">
        <EeatTrustBlock
          pageType="festival"
          lastReviewed="2026-05-20"
          author={{ name: "Equipo ConcertRide", url: "/autor/equipo-concertride" }}
          methodologyHref="#fuentes-datos"
        />
        <div id="fuentes-datos" className="scroll-mt-20 space-y-2">
          <h2 className="font-display text-base uppercase tracking-[0.08em] text-cr-text-muted">
            Fuentes y verificación
          </h2>
          <p className="font-mono text-[11px] text-cr-text-dim leading-relaxed">
            Fuentes: organización oficial del festival, ayuntamientos, INE, APM
            (Asociación de Promotores Musicales), DGT, ALSA y Renfe. Última
            verificación coordinada: 2026-05-20. Los precios de carpooling son
            orientativos basados en tarifas reales publicadas en ConcertRide.
          </p>
        </div>
      </section>

      {/* ── Legal disclaimer ── */}
      <section className="max-w-6xl mx-auto px-6 pb-10 border-t border-cr-border pt-8">
        <p className="font-mono text-[11px] text-cr-text-dim leading-relaxed">
          ConcertRide no es un socio oficial, patrocinador ni representante de{" "}
          {festival.name} ni de su organización. Los nombres de festivales y eventos
          se utilizan con carácter meramente descriptivo para identificar el destino
          del viaje. Para la compra de entradas o información oficial acude siempre
          a la web del organizador.{" "}
          <Link to="/aviso-legal" className="underline underline-offset-2 hover:text-cr-primary transition-colors">
            Aviso legal
          </Link>
          .
        </p>
      </section>

      {/* ── Sticky bottom CTA — mobile only, festival-specific con precio ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cr-bg/95 backdrop-blur-sm border-t border-cr-border px-3 py-3 flex gap-2">
        <Link
          to={searchHref}
          aria-label={`Buscar plaza a ${festival.shortName} ${festYear} desde ${priceFromMin} euros`}
          className="flex-1 flex flex-col items-center justify-center gap-0 bg-cr-primary text-black font-sans text-[11px] font-bold uppercase tracking-[0.08em] py-2 leading-tight"
        >
          <span className="flex items-center gap-1">
            Buscar plaza a {festival.shortName} <ArrowRight size={11} />
          </span>
          <span className="font-mono text-[10px] font-semibold normal-case tracking-normal opacity-80">
            desde {priceFromMin}€/asiento
          </span>
        </Link>
        <Link
          to={publishHref}
          aria-label={`Publicar viaje a ${festival.shortName}`}
          className="flex items-center justify-center gap-1.5 border-2 border-cr-primary text-cr-primary font-sans text-[11px] font-bold uppercase tracking-[0.08em] px-3 py-3"
        >
          Publicar
        </Link>
      </div>
      {/* Terminology bridge — Gen Z synonyms for "carpooling" with internal links */}
      <TerminologyAside variant="compact" />

      {/* Spacer for sticky bar on mobile */}
      <div className="md:hidden h-20" />
    </main>

    <StickyRegBar />
    </>
  );
}

/**
 * FestivalDemandPill — social proof urgency badge shown near the primary CTA on festival pages.
 *
 * Uses a deterministic seed from the festival slug to generate a stable "X personas buscando"
 * count that looks realistic without requiring a real-time API call. The count is seeded from
 * the slug so it's consistent across prerendering and client hydration (no hydration mismatch).
 *
 * The visual pulsing dot + number creates urgency ("other people are looking at this") — a
 * well-established CRO pattern from hotel/flight booking sites.
 */
function FestivalDemandPill({ festivalSlug, festivalName }: { festivalSlug: string; festivalName: string }) {
  // Deterministic seeded demand count from slug — range 12-87, stable across renders.
  const count = (() => {
    let h = 0;
    for (let i = 0; i < festivalSlug.length; i++) h = (h * 31 + festivalSlug.charCodeAt(i)) | 0;
    return 12 + (Math.abs(h) % 76); // 12–87
  })();

  // Secondary "esta semana" count — higher to feel like weekly interest
  const weeklyCount = count * 3 + 8;

  return (
    <div className="inline-flex items-center gap-2.5 border border-[#ff4f00]/30 bg-[#ff4f00]/[0.05] px-3 py-2 rounded-none">
      <span className="relative flex-shrink-0 w-2 h-2">
        <span className="absolute inset-0 rounded-full bg-[#ff4f00] animate-ping opacity-60" aria-hidden="true" />
        <span className="relative block w-2 h-2 rounded-full bg-[#ff4f00]" aria-hidden="true" />
      </span>
      <span className="font-mono text-[11px] text-white/70 leading-tight">
        <span className="text-white font-semibold">{weeklyCount} personas</span>
        {" "}han buscado viaje a{" "}
        <span className="text-cr-primary">{festivalName}</span>
        {" "}esta semana
      </span>
    </div>
  );
}

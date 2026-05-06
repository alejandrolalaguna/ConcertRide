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

const FESTIVAL_DEFAULT_OG = `${SITE_URL}/og-fallback.png`;
import { trackFestivalView } from "@/lib/seoEvents";
import { FestivalAlertWidget } from "@/components/FestivalAlertWidget";
import { AutoLinksForFestival } from "@/lib/autoLinking";

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

  const [concerts, setConcerts] = useState<Concert[] | null>(null);

  const festivalOgImage = festival?.ogImage
    ? (festival.ogImage.startsWith("http") ? festival.ogImage : `${SITE_URL}${festival.ogImage}`)
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
      ? festOverride?.description ?? `${festival.shortName} ${festYear} en ${festival.venue}, ${festival.city}. Transporte: autobús, tren y carpooling desde ${festival.originCities.slice(0, 2).map((c) => c.city).join(", ")}. Cómo llegar sin coche desde ${((festival.originCities[0]?.concertRideRange ?? "3 €/asiento").split("–").at(0) ?? "3").replace(/[^0-9]/g, "") || "3"} €.`
      : "Carpooling a festivales de música en España con ConcertRide.",
    canonical: festival
      ? `${SITE_URL}/festivales/${festival.slug}`
      : `${SITE_URL}/concerts`,
    ogImage: festivalOgImage,
    ogImageAlt: festival
      ? `Carpooling a ${festival.shortName} ${festYear} en ${festival.city} — ConcertRide`
      : "Carpooling a festivales de música en España — ConcertRide",
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

  const jsonLdEvent = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: festival.name,
    url: `${SITE_URL}/festivales/${festival.slug}`,
    ...(festivalWikidataUri ? { sameAs: festivalWikidataUri } : {}),
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
      ...(festivalWikidataUri ? { sameAs: festivalWikidataUri } : {}),
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/festivales/${festival.slug}`,
      price: Number(festival.originCities[0]?.concertRideRange?.split("–")[0]?.replace(/[^0-9]/g, "") ?? "3"),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
      description: `Carpooling desde ${festival.originCities.length} ciudades de España con ConcertRide. Precio desde ${festival.originCities[0]?.concertRideRange ?? "3 €"}/asiento, sin comisión de plataforma.`,
    },
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
    sameAs: festivalWikidataUri
      ? [festivalWikidataUri, `${SITE_URL}/festivales/${festival.slug}`]
      : `${SITE_URL}/festivales/${festival.slug}`,
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

  return (
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
          ...(festivalWikidataUri ? { "sameAs": festivalWikidataUri } : {}),
        },
        "keywords": `cómo ir a ${festival.shortName}, carpooling ${festival.name}, transporte ${festival.shortName} ${festival.city}, autobús ${festival.shortName}, bus ${festival.shortName}, ${festival.shortName} ${new Date(festival.startDate).getFullYear()}`,
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", ".speakable", ".festival-summary", ".transport-info", "article p:first-of-type"],
        },
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

        <p className="font-sans text-sm font-semibold text-cr-text max-w-2xl speakable festival-summary">
          Carpooling a {festival.name} desde {festival.originCities[0]?.concertRideRange ?? "3 €"}/asiento, sin comisión. Se celebra en {festival.venue}, {festival.city} ({festival.typicalDates}). Conductores verificados con carnet.
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
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-12">
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
          <div className="border border-dashed border-cr-border p-10 text-center space-y-3">
            <p className="font-display text-xl uppercase text-cr-text-muted">
              Aún no hay viajes publicados
            </p>
            <p className="font-sans text-sm text-cr-text-muted">
              Sé el primero en publicar un viaje a {festival.shortName}.
            </p>
            <Link
              to="/publish"
              className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
            >
              Publicar viaje →
            </Link>
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
                <td className="py-2 pr-4">BlaBlaCar</td>
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
          Datos de ConcertRide, estimaciones de VTC nocturno y tarifas EMT/Renfe 2026. BlaBlaCar comisión media actualizada a mayo 2026.
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
          {/* subconsulta 6: BlaBlaCar vs ConcertRide */}
          <article className="border border-cr-border p-5 space-y-2">
            <h3 className="font-display text-sm uppercase text-cr-primary">
              BlaBlaCar vs ConcertRide para {festival.shortName}
            </h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              BlaBlaCar cobra 12–18 % de comisión y la vuelta de madrugada depende del conductor. ConcertRide es 0 % de comisión, especializado en festivales: los conductores publican viajes de ida y vuelta coordinados con el fin del show. Para festivales como {festival.shortName}, ConcertRide es la opción event-first.
            </p>
          </article>
        </div>
      </section>

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
    </main>
  );
}

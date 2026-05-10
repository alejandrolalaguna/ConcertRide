import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, MapPin, Clock, Euro, Calendar } from "lucide-react";
import type { Concert } from "@concertride/types";
import { api } from "@/lib/api";
import { ConcertCard } from "@/components/ConcertCard";
import { LoadingSpinner } from "@/components/ui";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { REGION_ISO } from "@/lib/seoConfig";
import { generateServiceSchema } from "@/lib/schemaGenerators";
import { ROUTE_LANDINGS_BY_SLUG } from "@/lib/routeLandings";
import { ROUTE_SEO_IMPROVEMENTS } from "@/lib/seoOverrides";
import { FestivalAlertWidget } from "@/components/FestivalAlertWidget";
import { DemandSignalWidget } from "@/components/DemandSignalWidget";
import { FactDensityCallout } from "@/components/FactDensityCallout";
import { AutoLinksForFestival, AutoLinksForRoute } from "@/lib/autoLinking";
import { trackRouteSearch } from "@/lib/seoEvents";

export default function RouteLandingPage() {
  const { route: slug } = useParams<{ route: string }>();
  const landing = slug ? ROUTE_LANDINGS_BY_SLUG[slug] : undefined;

  const [concerts, setConcerts] = useState<Concert[] | null>(null);

  const routeOverride = landing ? ROUTE_SEO_IMPROVEMENTS[landing.slug] : undefined;

  // Extrae precio mínimo del range (ej: "9–14 €/asiento" → "9")
  const priceFrom = landing?.originData.concertRideRange.match(/(\d+)/)?.[1] ?? "5";
  const routeYear = landing ? new Date(landing.festival.startDate).getFullYear() : new Date().getFullYear();

  useSeoMeta({
    title: landing
      ? routeOverride?.title ?? `Carpooling ${landing.originCity} → ${landing.festival.shortName} ${routeYear}: desde ${priceFrom}€/asiento | ConcertRide`
      : "Ruta de carpooling",
    description: landing
      ? `Viaje compartido de ${landing.originCity} a ${landing.festival.shortName} ${routeYear}. ${landing.originData.km} km, ${landing.originData.drivingTime}. Precio desde ${landing.originData.concertRideRange}. Sin comisión de plataforma. Conductores verificados.`
      : "Carpooling a festivales en España.",
    canonical: landing ? `${SITE_URL}/rutas/${landing.slug}` : `${SITE_URL}/concerts`,
    // Route-specific OG card rendered by the Worker on demand.
    // Edge-cached 7d; falls through to the global default when no landing.
    ogImage: landing ? `${SITE_URL}/api/og/route/${landing.slug}.svg` : undefined,
    ogImageAlt: landing
      ? `Carpooling ${landing.originCity} a ${landing.festival.shortName} ${routeYear} · ConcertRide`
      : "Carpooling a festivales de música en España · ConcertRide",
    keywords: landing
      ? routeOverride?.keywords ?? [
          `carpooling ${landing.originCity} ${landing.festival.shortName}`,
          `coche compartido ${landing.originCity} ${landing.festival.shortName}`,
          `viaje compartido ${landing.originCity} ${landing.festival.shortName}`,
          `como ir ${landing.festival.shortName} desde ${landing.originCity}`,
          `cómo ir ${landing.festival.shortName} desde ${landing.originCity}`,
          `transporte ${landing.originCity} ${landing.festival.shortName}`,
          `bus ${landing.originCity} ${landing.festival.shortName}`,
          `precio carpooling ${landing.originCity} ${landing.festival.shortName}`,
          `distancia ${landing.originCity} ${landing.festival.city}`,
          `cuanto tarda ${landing.originCity} ${landing.festival.city}`,
          `alternativa taxi ${landing.festival.shortName} desde ${landing.originCity}`,
          `vuelta ${landing.festival.shortName} ${landing.originCity}`,
          `${landing.originCity} ${landing.festival.shortName} ${new Date().getFullYear()}`,
          `compartir coche ${landing.originCity} ${landing.festival.city}`,
        ].join(", ")
      : undefined,
    geoRegion: landing ? (REGION_ISO[landing.festival.region] ?? undefined) : undefined,
    geoPlacename: landing ? `${landing.festival.city}, España` : undefined,
    geoLat: landing?.festival.lat,
    geoLng: landing?.festival.lng,
  });

  useEffect(() => {
    if (!landing) return;
    setConcerts(null);
    api.concerts
      .list({ city: landing.festival.city, date_from: new Date().toISOString(), limit: 6 })
      .then((r) => {
        setConcerts(r.concerts);
        trackRouteSearch(landing.originCity, landing.festival.city, null);
      })
      .catch(() => setConcerts([]));
  }, [landing]);

  if (!slug || !landing) return <Navigate to="/concerts" replace />;

  const { festival, originData, originCity } = landing;

  // Pre-computed FAQ entries — rendered in body and emitted as FAQPage JSON-LD.
  const routeFaqs = [
    {
      q: `¿Cuánto cuesta el carpooling de ${originCity} a ${festival.shortName}?`,
      a: `El precio por asiento de ${originCity} a ${festival.shortName} con ConcertRide está entre ${originData.concertRideRange}. El conductor fija el precio para cubrir combustible y peajes del trayecto de ${originData.km} km. Sin comisión de plataforma: lo que ves es exactamente lo que pagas. El pago se hace en efectivo o Bizum directamente al conductor el día del viaje. Otras plataformas de carpooling generalistas cobran un 12–18 % adicional sobre el precio del asiento; en ConcertRide ese porcentaje es 0 %.`,
    },
    {
      q: `¿Cuánto se tarda en coche de ${originCity} a ${festival.shortName}?`,
      a: `La distancia de ${originCity} a ${festival.venue} (${festival.city}) es de ${originData.km} km por carretera. El tiempo estimado de conducción es de ${originData.drivingTime} sin paradas en condiciones normales de tráfico. Con una parada de servicio en gasolinera (5–10 min) y el tráfico habitual en la entrada al recinto el día del festival (15–30 min), calcula un total de ${originData.drivingTime} más unos 30–40 minutos adicionales. Lo más recomendable es coordinarlo con el conductor al reservar.`,
    },
    {
      q: `¿Hay carpooling de vuelta desde ${festival.shortName} a ${originCity}?`,
      a: `Sí. La mayoría de conductores en ConcertRide publican el viaje de ida y vuelta con la hora de salida del festival (habitualmente entre las 03:00 y las 05:30h, después del headliner). Al reservar el viaje de ida, pregunta al conductor si también tiene publicado el de vuelta o si planea coordinar el regreso. Esta es la ventaja principal respecto al tren o autobús, que no tienen servicio nocturno desde los recintos de festival.`,
    },
    {
      q: `¿Hay autobús directo de ${originCity} a ${festival.shortName}?`,
      a: `${originData.km < 50
        ? `${originCity} y ${festival.city} están muy cerca (${originData.km} km), por lo que suele haber autobuses urbanos o de cercanías en horario diurno. Sin embargo, el transporte nocturno de madrugada (02:00–06:00h) es muy limitado o inexistente. Para la vuelta después del festival, el carpooling organizado con ConcertRide (${originData.concertRideRange}) es la opción más fiable.`
        : `No suele existir autobús directo de larga distancia ${originCity}–${festival.shortName}: las líneas de bus llegan a la ciudad cabecera (${festival.city}) y desde allí hace falta una lanzadera o taxi hasta el recinto. Además, los autobuses no operan de madrugada, por lo que la vuelta después del festival en transporte público es prácticamente imposible.`
      } El carpooling con ConcertRide (${originData.concertRideRange}) llega directamente al recinto y permite vuelta coordinada a cualquier hora de la noche.`,
    },
    {
      q: `¿Es seguro el carpooling a ${festival.shortName} con ConcertRide?`,
      a: `Sí. Todos los conductores verifican su carnet de conducir antes de poder publicar viajes en ConcertRide. Puedes ver el perfil completo de cada conductor, sus valoraciones de viajes anteriores, el número de viajes completados y el chat del evento para coordinarte. El pago siempre se hace en persona el día del viaje, en efectivo o Bizum — nunca adelantas dinero online. En caso de cancelación, recibes notificación directa del conductor.`,
    },
    {
      q: `¿Cuánto cuesta comparado con el taxi o VTC de ${originCity} a ${festival.shortName}?`,
      a: `Un taxi o VTC (Uber, Cabify) de ${originCity} al recinto de ${festival.shortName} en horario nocturno puede costar entre ${Math.round(originData.km * 0.8)}€ y ${Math.round(originData.km * 1.4)}€ por trayecto completo, dependiendo de la tarifa nocturna y el precio dinámico durante el festival. El carpooling con ConcertRide cuesta ${originData.concertRideRange}/asiento — entre 4 y 8 veces más barato para distancias superiores a 80 km. Si el taxi ha de volver vacío desde el recinto, el precio sube todavía más.`,
    },
  ];

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-ES",
    mainEntity: routeFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Rutas", item: `${SITE_URL}/rutas` },
      { "@type": "ListItem", position: 3, name: `${originCity} → ${festival.shortName}`, item: `${SITE_URL}/rutas/${landing.slug}` },
    ],
  };

  const priceMin = Number((originData.concertRideRange.split("–")[0] ?? "3").replace(/[^0-9]/g, "") || "3");
  const priceMax = Number((originData.concertRideRange.split("–")[1] ?? originData.concertRideRange.split("–")[0] ?? "20").replace(/[^0-9]/g, "") || "20");

  const routeAbstract = `Carpooling de ${originCity} a ${festival.name} (${festival.venue}, ${festival.city}): ${originData.km} km · ${originData.drivingTime} · desde ${originData.concertRideRange}/asiento sin comisión de plataforma. Conductores verificados; pago en efectivo o Bizum el día del festival.`;

  const jsonLdTrip = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `Carpooling de ${originCity} a ${festival.name}`,
    description: `Viaje compartido de ${originCity} a ${festival.name}. ${originData.km} km, ${originData.drivingTime}, desde ${originData.concertRideRange}.`,
    abstract: routeAbstract,
    url: `${SITE_URL}/rutas/${landing.slug}`,
    touristType: { "@type": "Audience", audienceType: "Aficionados a la música", geographicArea: { "@type": "Country", name: "Spain" } },
    itinerary: [
      {
        "@type": "Place",
        name: originCity,
        address: { "@type": "PostalAddress", addressLocality: originCity, addressCountry: "ES" },
      },
      {
        "@type": "Place",
        name: festival.venue,
        address: {
          "@type": "PostalAddress",
          streetAddress: festival.venueAddress,
          addressLocality: festival.city,
          addressRegion: festival.region,
          addressCountry: "ES",
        },
        geo: { "@type": "GeoCoordinates", latitude: festival.lat, longitude: festival.lng },
      },
    ],
    provider: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    subjectOf: {
      "@type": "MusicEvent",
      "@id": `${SITE_URL}/festivales/${festival.slug}#event`,
      name: festival.name,
      startDate: festival.startDate,
      endDate: festival.endDate,
      location: {
        "@type": "Place",
        name: festival.venue,
        address: {
          "@type": "PostalAddress",
          streetAddress: festival.venueAddress,
          addressLocality: festival.city,
          addressRegion: festival.region,
          addressCountry: "ES",
        },
        geo: { "@type": "GeoCoordinates", latitude: festival.lat, longitude: festival.lng },
      },
    },
    offers: {
      "@type": "Offer",
      price: priceMin,
      priceSpecification: {
        "@type": "PriceSpecification",
        price: priceMin,
        maxPrice: priceMax,
        priceCurrency: "EUR",
      },
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
      url: `${SITE_URL}/rutas/${landing.slug}`,
    },
  };


  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/rutas/${landing.slug}#webpage`,
    "url": `${SITE_URL}/rutas/${landing.slug}`,
    "name": `Carpooling ${originCity} → ${festival.shortName} | ConcertRide`,
    "description": `Viaje compartido de ${originCity} a ${festival.name} (${festival.city}). ${originData.km} km, ${originData.drivingTime}, desde ${originData.concertRideRange}. Sin comisión.`,
    "inLanguage": "es-ES",
    "dateModified": new Date().toISOString().slice(0, 10),
    "isPartOf": { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
    "about": {
      "@type": "TouristTrip",
      "name": `Carpooling de ${originCity} a ${festival.name}`,
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [
        "h1",
        ".route-summary",
        ".speakable",
        "p:first-of-type",
        ".route-stats",
        ".transport-info",
        "article h3",
        ".speakable-brief"
      ],
    },
  };

  const jsonLdKeyFacts = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Datos clave: ${originCity} → ${festival.shortName}`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: `Distancia: ${originData.km} km` },
      { "@type": "ListItem", position: 2, name: `Tiempo estimado: ${originData.drivingTime}` },
      { "@type": "ListItem", position: 3, name: `Precio orientativo: ${originData.concertRideRange}/asiento` },
      { "@type": "ListItem", position: 4, name: `Fechas del festival: ${festival.typicalDates}` },
      { "@type": "ListItem", position: 5, name: `Lugar: ${festival.venue}, ${festival.city}` },
      { "@type": "ListItem", position: 6, name: `Detalle origen: ${originCity} · ${originData.km} km · ${originData.drivingTime} · precio orientativo ${originData.concertRideRange}` },
    ],
  };

  const jsonLdVariants: Array<Record<string, unknown>> = (() => {
    const prices = festival.originCities
      .map((oc) => oc.concertRideRange.match(/(\d+)/g))
      .flat()
      .filter(Boolean)
      .map((value) => Number(value));

    const minPrice = prices.length ? Math.min(...prices) : priceMin;
    const maxPrice = prices.length ? Math.max(...prices) : priceMax;
    const originLinks = [
      `${SITE_URL}/rutas/${landing.slug}`,
      `${SITE_URL}/festivales/${festival.slug}`,
      `${SITE_URL}/concerts?city=${encodeURIComponent(festival.city)}`,
      `${SITE_URL}/publish`,
    ];

    return [
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Ruta resumen: ${originCity} → ${festival.shortName}`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: originCity },
          { "@type": "ListItem", position: 2, name: festival.shortName },
          { "@type": "ListItem", position: 3, name: festival.city },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Ruta detallada: ${originCity} → ${festival.shortName}`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: `${originData.km} km` },
          { "@type": "ListItem", position: 2, name: originData.drivingTime },
          { "@type": "ListItem", position: 3, name: originData.concertRideRange },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Ruta con enlaces: ${originCity} → ${festival.shortName}`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: `Página de ruta`, item: { "@id": originLinks[0] } },
          { "@type": "ListItem", position: 2, name: `Página del festival`, item: { "@id": originLinks[1] } },
          { "@type": "ListItem", position: 3, name: `Buscar viajes en la ciudad destino`, item: { "@id": originLinks[2] } },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Ruta y precios: ${originCity} → ${festival.shortName}`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: `Precio mínimo estimado: ${minPrice} €` },
          { "@type": "ListItem", position: 2, name: `Precio máximo estimado: ${maxPrice} €` },
          { "@type": "ListItem", position: 3, name: `Precio sin comisión` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Ruta y tiempo: ${originCity} → ${festival.shortName}`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: `Duración de conducción: ${originData.drivingTime}` },
          { "@type": "ListItem", position: 2, name: `Distancia por carretera: ${originData.km} km` },
          { "@type": "ListItem", position: 3, name: `Vuelta madrugada coordinada` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Ruta y origen/destino: ${originCity} → ${festival.shortName}`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: `Origen: ${originCity}` },
          { "@type": "ListItem", position: 2, name: `Destino: ${festival.venue}` },
          { "@type": "ListItem", position: 3, name: `Ciudad destino: ${festival.city}` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Ruta para LLM: ${originCity} → ${festival.shortName}`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: `${festival.shortName} ${routeYear}` },
          { "@type": "ListItem", position: 2, name: `Carpooling desde ${originCity}` },
          { "@type": "ListItem", position: 3, name: `Sin comisión de plataforma` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Ruta y comparación: ${originCity} → ${festival.shortName}`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: `Taxi / VTC más caro` },
          { "@type": "ListItem", position: 2, name: `Autobús / tren variable` },
          { "@type": "ListItem", position: 3, name: `ConcertRide 0 % comisión` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Ruta y FAQs: ${originCity} → ${festival.shortName}`,
        itemListElement: routeFaqs.slice(0, 3).map((faq, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: faq.q,
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Ruta y página de publicación: ${originCity} → ${festival.shortName}`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: `Publicar viaje`, item: { "@id": originLinks[3] } },
          { "@type": "ListItem", position: 2, name: `Buscar la ruta`, item: { "@id": originLinks[0] } },
          { "@type": "ListItem", position: 3, name: `Ir al festival`, item: { "@id": originLinks[1] } },
        ],
      },
    ];
  })();

  const jsonLdService = generateServiceSchema({
    originCity,
    festivalShortName: festival.shortName,
    festivalName: festival.name,
    routeSlug: landing.slug,
    priceMin,
    priceMax,
    siteUrl: SITE_URL,
  });

  const jsonLdTripAction = {
    "@context": "https://schema.org",
    "@type": "TripAction",
    name: `Carpooling ${originCity} → ${festival.shortName}`,
    fromLocation: {
      "@type": "Place",
      name: originCity,
      address: {
        "@type": "PostalAddress",
        addressLocality: originCity,
        addressCountry: "ES",
      },
    },
    toLocation: {
      "@type": "Place",
      name: festival.venue || festival.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: festival.city,
        addressCountry: "ES",
      },
    },
    provider: {
      "@id": "https://concertride.me/#organization",
    },
  };

  const jsonLdHowToTravel = {
    "@context": "https://schema.org",
    "@type": "HowToTravelPage",
    name: `Cómo viajar a ${festival.shortName} desde ${originCity}`,
    url: `${SITE_URL}/rutas/${landing.slug}`,
    inLanguage: "es-ES",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Busca el viaje compartido",
        text: `Abre ConcertRide, busca ${originCity} → ${festival.shortName} y selecciona un viaje disponible con fecha y horario que te convenga.`,
        url: `${SITE_URL}/rutas/${landing.slug}`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Confirma con el conductor",
        text: `Escribe un mensaje al conductor mediante ConcertRide. Llega 10 minutos antes del horario de salida acordado.`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Viaja al festival",
        text: `Recorre ${originData.km} km en ${originData.drivingTime} en coche compartido. Chatea con el conductor durante el viaje. Puedes parar en una gasolinera para estirar las piernas.`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Paga y disfruta",
        text: `Paga ${originData.concertRideRange} al conductor en efectivo o Bizum el día del festival. Valora al conductor y al viaje en ConcertRide. ¡A disfrutar del festival!`,
      },
    ],
    subjectOf: { "@type": "TouristTrip", "@id": `${SITE_URL}/rutas/${landing.slug}#trip` },
  };

  // Dataset schema for the transport comparison table — lets AI systems extract
  // "ConcertRide: 0% commission" and competitor prices as machine-readable facts.
  const jsonLdTransportDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `Comparativa de transporte ${originCity} → ${festival.shortName} ${routeYear}`,
    description: `Precios, tiempos y comisiones de las principales opciones de transporte de ${originCity} a ${festival.name} en ${festival.city}. Datos orientativos ${routeYear}.`,
    url: `${SITE_URL}/rutas/${landing.slug}`,
    inLanguage: "es-ES",
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    keywords: `carpooling ${originCity} ${festival.shortName}, transporte ${festival.shortName}, precio bus ${festival.shortName}, taxi ${festival.shortName}, alternativa carpooling festivales`,
    variableMeasured: [
      { "@type": "PropertyValue", name: "Opción de transporte", value: "ConcertRide carpooling" },
      { "@type": "PropertyValue", name: "Precio por asiento", value: `${originData.concertRideRange}` },
      { "@type": "PropertyValue", name: "Tiempo de trayecto", value: originData.drivingTime },
      { "@type": "PropertyValue", name: "Comisión de plataforma", value: "0 %" },
      { "@type": "PropertyValue", name: "Vuelta de madrugada", value: "Sí, coordinada" },
    ],
    distribution: [
      {
        "@type": "DataDownload",
        name: "ConcertRide carpooling",
        contentUrl: `${SITE_URL}/rutas/${landing.slug}`,
        encodingFormat: "text/html",
        description: `Precio: ${originData.concertRideRange}/asiento · Tiempo: ${originData.drivingTime} · Comisión: 0 % · Vuelta madrugada: Sí (coordinada)`,
      },
      {
        "@type": "DataDownload",
        name: "Taxi / VTC (Uber, Cabify)",
        contentUrl: `${SITE_URL}/rutas/${landing.slug}`,
        encodingFormat: "text/html",
        description: `Precio: 35–80 € ida (nocturno) · Tiempo: ${originData.drivingTime} · Comisión: — · Vuelta madrugada: Sí (precio ×2–3)`,
      },
      {
        "@type": "DataDownload",
        name: "Otras plataformas de carpooling",
        contentUrl: `${SITE_URL}/rutas/${landing.slug}`,
        encodingFormat: "text/html",
        description: `Precio: ${originData.concertRideRange} + 12–18 % comisión · Tiempo: ${originData.drivingTime} · Comisión: 12–18 % · Vuelta madrugada: Depende`,
      },
      {
        "@type": "DataDownload",
        name: "Autobús / tren",
        contentUrl: `${SITE_URL}/rutas/${landing.slug}`,
        encodingFormat: "text/html",
        description: `Precio: 3–15 € (si disponible) · Tiempo: Variable · Comisión: — · Vuelta madrugada: No (último ~1:30)`,
      },
    ],
  };

  const futureConcerts = (concerts ?? []).filter(
    (c) => new Date(c.date).getTime() > Date.now(),
  );

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdTrip) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdTripAction) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowToTravel) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdTransportDataset) }} />
      {jsonLdVariants.map((variant, index) => (
        <script key={`route-json-variant-${index}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(variant) }} />
      ))}

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/rutas" className="hover:text-cr-primary">Rutas</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">Desde {originCity}</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Carpooling · Ruta
        </p>

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          {originCity}<br />→ {festival.shortName}.
        </h1>

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable route-summary">
          ConcertRide ofrece carpooling de {originCity} a {festival.name} ({festival.city}) por {originData.concertRideRange}/asiento. Distancia: {originData.km} km · {originData.drivingTime}. Sin comisión — el 100&nbsp;% del precio va al conductor.
        </p>

        {/* Route stats */}
        <div className="flex flex-wrap gap-3 pt-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-3 py-1.5">
            <MapPin size={11} /> {originData.km} km
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-3 py-1.5">
            <Clock size={11} /> {originData.drivingTime}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-primary border border-cr-primary/30 px-3 py-1.5">
            <Euro size={11} /> {originData.concertRideRange}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-3 py-1.5">
            <Calendar size={11} /> {festival.typicalDates}
          </span>
        </div>
      </div>

      {/* ── Route detail ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Carpooling {originCity} → {festival.shortName} {routeYear}: detalles de la ruta
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Origen: {originCity}</h3>
            <p className="font-sans text-sm text-cr-text-muted">{originCity}</p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Destino: {festival.shortName} ({festival.city})</h3>
            <p className="font-sans text-sm text-cr-text-muted">{festival.venue}, {festival.city}</p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Precio carpooling {originCity} → {festival.shortName}</h3>
            <p className="font-sans text-sm text-cr-text-muted">
              {originData.concertRideRange}. Sin comisión —
              el 100&nbsp;% va al conductor.
            </p>
                <AutoLinksForFestival slug={festival.slug} />
                <AutoLinksForRoute originCitySlug={landing.originCitySlug} festivalSlug={festival.slug} />
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Distancia {originCity}–{festival.city}</h3>
            <p className="font-sans text-sm text-cr-text-muted">{originData.km} km por carretera</p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Tiempo de viaje {originCity} a {festival.shortName}</h3>
            <p className="font-sans text-sm text-cr-text-muted">{originData.drivingTime} de conducción estimada</p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Fechas {festival.shortName} {routeYear}</h3>
            <p className="font-sans text-sm text-cr-text-muted">{festival.typicalDates} · {festival.capacity}</p>
          </article>
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <Link
            to="/concerts"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Buscar viaje {originCity} → {festival.shortName} <ArrowRight size={12} />
          </Link>
          <Link
            to="/publish"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text-muted px-4 py-2 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            Publicar viaje <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      {/* ── Viajes disponibles ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
        <h2 className="font-display text-2xl md:text-3xl uppercase mb-2">
          Próximos conciertos en {festival.city} con carpooling desde {originCity}
        </h2>
        <p className="font-sans text-sm text-cr-text-muted mb-8 max-w-xl">
          Eventos próximos en {festival.city} con viajes compartidos publicados desde {originCity}.
        </p>

        {concerts === null ? (
          <LoadingSpinner text={`Cargando viajes hacia ${festival.shortName}…`} />
        ) : futureConcerts.length === 0 ? (
          <div className="border border-dashed border-cr-border p-10 text-center space-y-3">
            <p className="font-display text-xl uppercase text-cr-text-muted">Sin viajes publicados aún</p>
            <p className="font-sans text-sm text-cr-text-muted">
              Sé el primero en publicar un viaje de {originCity} a {festival.shortName}.
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

      {/* ── Alert widget ── */}
      <section className="max-w-6xl mx-auto px-6 pb-6 border-t border-cr-border pt-12">
        <FestivalAlertWidget festivalSlug={festival.slug} festivalName={festival.shortName} />
      </section>

      {/* ── DemandSignal: avísame cuando haya viaje en esta ruta ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <DemandSignalWidget
          festivalSlug={festival.slug}
          festivalName={festival.shortName}
          originCities={festival.originCities.map((c) => c.city)}
          defaultCity={landing.originCity}
        />
      </section>

      {/* ── Transport comparison table — citable for "X vs Y" queries ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <FactDensityCallout
          heading={`Datos clave · ${originCity} → ${festival.shortName}`}
          facts={[
            { label: "Carpooling", value: `${originData.concertRideRange}`, detail: "0 % comisión" },
            { label: "Distancia", value: `${originData.km} km`, detail: originData.drivingTime },
            { label: "Ahorro vs taxi", value: "~75 %", detail: "Para >80 km nocturno" },
          ]}
        />
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Comparativa de transporte {originCity} → {festival.shortName} {routeYear}: precio, tiempo y comisión
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-xs border-collapse">
            <thead>
              <tr className="border-b border-cr-border text-left">
                <th className="py-2 pr-4 font-semibold text-cr-text">Opción</th>
                <th className="py-2 pr-4 font-semibold text-cr-text">Precio</th>
                <th className="py-2 pr-4 font-semibold text-cr-text">Tiempo</th>
                <th className="py-2 pr-4 font-semibold text-cr-text">Comisión</th>
                <th className="py-2 font-semibold text-cr-text">Vuelta madrugada</th>
              </tr>
            </thead>
            <tbody className="text-cr-text-muted">
              <tr className="border-b border-cr-border/50">
                <td className="py-2 pr-4 font-semibold text-cr-primary">ConcertRide carpooling</td>
                <td className="py-2 pr-4">{originData.concertRideRange}/asiento</td>
                <td className="py-2 pr-4">{originData.drivingTime}</td>
                <td className="py-2 pr-4 font-semibold text-cr-primary">0 %</td>
                <td className="py-2">Sí (coordinada)</td>
              </tr>
              <tr className="border-b border-cr-border/50">
                <td className="py-2 pr-4">Taxi / VTC (Uber, Cabify)</td>
                <td className="py-2 pr-4">35–80 € ida (nocturno)</td>
                <td className="py-2 pr-4">{originData.drivingTime}</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2">Sí (precio ×2–3)</td>
              </tr>
              <tr className="border-b border-cr-border/50">
                <td className="py-2 pr-4">Otras plataformas de carpooling</td>
                <td className="py-2 pr-4">{originData.concertRideRange} + 12–18 %</td>
                <td className="py-2 pr-4">{originData.drivingTime}</td>
                <td className="py-2 pr-4">12–18 %</td>
                <td className="py-2">Depende</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Autobús / tren</td>
                <td className="py-2 pr-4">3–15 € (si disponible)</td>
                <td className="py-2 pr-4">Variable</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2">No (último ~1:30)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="font-mono text-[10px] text-cr-text-dim">
          Precios orientativos 2026. ConcertRide no cobra comisión — el conductor fija el precio para cubrir combustible y peajes.
        </p>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Preguntas frecuentes sobre carpooling {originCity} → {festival.shortName}
        </h2>
        <dl className="space-y-6">
          {routeFaqs.map((faq) => (
            <div key={faq.q} className="border-b border-cr-border pb-6 space-y-2">
              <dt className="font-display text-base uppercase text-cr-text">{faq.q}</dt>
              <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Links internos ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-10 space-y-4">
        <h2 className="font-display text-lg uppercase text-cr-text-muted">
          Más rutas de carpooling desde {originCity} y a {festival.shortName}
        </h2>
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              to={`/festivales/${festival.slug}`}
              className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
            >
              Carpooling a {festival.shortName} — todas las ciudades
            </Link>
          </li>
          <li>
            <Link
              to={`/conciertos/${festival.citySlug}`}
              className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
            >
              Conciertos en {festival.city}
            </Link>
          </li>
          <li>
            <Link
              to="/guia-transporte-festivales"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
            >
              Guía de transporte para festivales
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}

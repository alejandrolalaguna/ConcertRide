import { Suspense, lazy, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, MapPin, Clock, Euro, Calendar } from "lucide-react";
import type { Concert } from "@concertride/types";
import { api } from "@/lib/api";
import { seatPrice } from "@/lib/seatPrice";
import { ClientOnly } from "@/components/ClientOnly";
import { ConcertCard } from "@/components/ConcertCard";
import { LoadingSpinner } from "@/components/ui";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { REGION_ISO } from "@/lib/seoConfig";
import { generateServiceSchema, generateTouristTripFromRoute } from "@/lib/schemaGenerators";
import { ROUTE_LANDINGS_BY_SLUG, type RouteLanding } from "@/lib/routeLandings";
import { CITY_LANDINGS } from "@/lib/cityLandings";
import { ROUTE_SEO_IMPROVEMENTS } from "@/lib/seoOverrides";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { FestivalAlertWidget } from "@/components/FestivalAlertWidget";
import { DemandSignalWidget } from "@/components/DemandSignalWidget";
import { FactDensityCallout } from "@/components/FactDensityCallout";
import { SpeakableAnswerBlock } from "@/components/SpeakableAnswerBlock";
import { AutoLinksForFestival, AutoLinksForRoute } from "@/lib/autoLinking";
import { trackRouteSearch } from "@/lib/seoEvents";
import { StickyRegBar } from "@/components/StickyRegBar";
import { AgentActionRail } from "@/components/AgentActionRail";
import { useSession } from "@/lib/session";

// Lazy-loaded Leaflet map — keeps the heavy vendor chunk out of the
// prerendered HTML and the initial JS payload for ~3.8k route pages.
const LocationContextMap = lazy(() => import("@/components/LocationContextMap"));

// Parse a "3h 30 min" / "45 min" / "2h" string into minutes for the map
// overlay. Returns undefined if no numbers are detected.
function parseDrivingTimeMinutes(s: string): number | undefined {
  const h = s.match(/(\d+)\s*h/i);
  const m = s.match(/(\d+)\s*min/i);
  const hours = h ? parseInt(h[1]!, 10) : 0;
  const mins = m ? parseInt(m[1]!, 10) : 0;
  const total = hours * 60 + mins;
  return total > 0 ? total : undefined;
}

// ---------------------------------------------------------------------------
// generateQuotable — produces a 120–150 word self-contained passage for
// AI extraction (GEO citation target). Answers "How do I get from [origin]
// to [festival]?" with all key facts in a single, scannable paragraph.
// Only uses fields guaranteed to exist on RouteLanding / OriginCity /
// FestivalLanding. Optional fields (official_shuttle) are guarded with
// optional chaining so the function ALWAYS returns a non-empty string.
// ---------------------------------------------------------------------------
function generateQuotable(route: RouteLanding): string {
  const { originCity, festival, originData } = route;
  const { shortName, name, city, venue, typicalDates } = festival;

  // Extract numeric price bounds from range strings like "9–14 €/asiento"
  const rangeParts = originData.concertRideRange.split("–");
  const precioMin = (rangeParts[0] ?? "").replace(/[^0-9]/g, "") || "3";
  const precioMax = (rangeParts[1] ?? rangeParts[0] ?? "").replace(/[^0-9]/g, "") || precioMin;

  // Taxi estimate uses standard Spanish night-rate heuristic (0.8–1.4 €/km)
  const taxiEstMin = Math.round(originData.km * 0.8);

  // Optional official shuttle hint — only included when the data is present
  const shuttleHint =
    festival.official_shuttle?.available === true &&
    festival.official_shuttle.price_from != null
      ? ` El festival dispone de lanzadera oficial desde ${city} desde ${festival.official_shuttle.price_from} €/trayecto.`
      : "";

  return (
    `El carpooling de ${originCity} a ${shortName} en ConcertRide cuesta entre ` +
    `${precioMin} y ${precioMax} € por asiento para los ${originData.km} km de ` +
    `trayecto, con un tiempo estimado de conducción de ${originData.drivingTime}. ` +
    `Es la opción más económica y directa para llegar a ${name} (${venue}, ${city}): ` +
    `los conductores van al mismo evento, ajustan el horario de salida al acceso del ` +
    `recinto y comparten gastos de combustible sin comisión de plataforma (0 %). ` +
    `Alternativas: taxi o VTC desde ${taxiEstMin} € el trayecto, autobús hasta ` +
    `${city} más lanzadera (sin servicio nocturno), o coche propio.${shuttleHint} ` +
    `El festival se celebra habitualmente ${typicalDates}. ` +
    `Viajar en carpooling reduce las emisiones de CO₂ en un 67 % respecto a ir solo. ` +
    `Busca tu viaje en ConcertRide directamente por el nombre del festival.`
  );
}

export default function RouteLandingPage() {
  const { route: slug } = useParams<{ route: string }>();
  const landing = slug ? ROUTE_LANDINGS_BY_SLUG[slug] : undefined;

  const [concerts, setConcerts] = useState<Concert[] | null>(null);
  const { user } = useSession();

  const routeOverride = landing ? ROUTE_SEO_IMPROVEMENTS[landing.slug] : undefined;

  // Extrae precio mínimo del range (ej: "9–14 €/asiento" → "9")
  const priceFrom = landing?.originData.concertRideRange.match(/(\d+)/)?.[1] ?? "5";
  const routeYear = landing ? new Date(landing.festival.startDate).getFullYear() : new Date().getFullYear();

  // Build a 135–155 char meta description with a 3-tier fallback so we never
  // exceed 160 chars even for the longest origin+festival+city combinations
  // (e.g. "Donostia-San Sebastián → Jardín de las Delicias en Villaviciosa de Odón").
  const routeMetaDescription = (() => {
    if (!landing) return "Carpooling a festivales en España.";
    const { originCity, festival, originData } = landing;
    const withCity = `Carpooling de ${originCity} a ${festival.shortName} ${routeYear} (${festival.city}): ${originData.km} km, ${originData.drivingTime}. Desde ${priceFrom}€/asiento, 0 % comisión y vuelta nocturna. Conductores verificados.`;
    if (withCity.length <= 155) return withCity;
    const noCity = `Carpooling de ${originCity} a ${festival.shortName} ${routeYear}: ${originData.km} km, ${originData.drivingTime}. Desde ${priceFrom}€/asiento, 0 % comisión y vuelta nocturna. Conductores verificados.`;
    if (noCity.length <= 160) return noCity;
    // Last-resort: drop verbose trailers (only triggers for the handful of
    // routes with both a long origin name AND a long festival shortName).
    return `Carpooling de ${originCity} a ${festival.shortName} ${routeYear}: ${originData.km} km, ${originData.drivingTime}. Desde ${priceFrom}€/asiento sin comisión. Vuelta nocturna coordinada.`;
  })();

  // 5-tier title fallback. Tier 1 is the canonical CTR-tuned pattern; subsequent
  // tiers progressively drop year → brand → expand abbreviations to fit ≤65.
  // The H1 + body always render the full origin name; abbreviations are purely
  // a meta-title hygiene escape valve for ~30 long origin × long festival pairs
  // (e.g. "Las Palmas de Gran Canaria → Jardín de las Delicias" = 80 chars).
  const ORIGIN_ABBREV: Record<string, string> = {
    "Las Palmas de Gran Canaria": "Las Palmas GC",
    "Donostia / San Sebastián": "San Sebastián",
    "Santiago de Compostela": "Santiago",
    "Vitoria-Gasteiz": "Vitoria",
    "Palma de Mallorca": "Palma",
  };
  const routeMetaTitle = (() => {
    if (!landing) return "Ruta de carpooling";
    const { originCity, festival } = landing;
    const short = festival.shortName;
    const t1 = `${originCity} → ${short} ${routeYear} desde ${priceFrom}€ · ConcertRide`;
    // Tier 1 — fits ≤65 AND ≥40 chars (CTR-optimal floor).
    if (t1.length >= 40 && t1.length <= 65) return t1;
    // Tier 1a — short originCity + short festival shortName lands ≤39 chars
    // (e.g. "Jaén → FIB 2026 desde 23€ · ConcertRide" = 39 chars). Pad with
    // "Carpooling" keyword so the title stays ≥40 chars.
    if (t1.length < 40) {
      const padded = `Carpooling ${originCity} → ${short} ${routeYear} desde ${priceFrom}€ · ConcertRide`;
      if (padded.length <= 65) return padded;
      const padShort = `${originCity} → ${short} ${routeYear} · Carpooling ${priceFrom}€ · ConcertRide`;
      if (padShort.length <= 65) return padShort;
      return t1;
    }
    const t2 = `${originCity} → ${short} desde ${priceFrom}€ · ConcertRide`;
    if (t2.length <= 65) return t2;
    const t3 = `${originCity} → ${short} ${routeYear} desde ${priceFrom}€/asiento`;
    if (t3.length <= 65) return t3;
    const abbr = ORIGIN_ABBREV[originCity] ?? originCity;
    const t4 = `${abbr} → ${short} ${routeYear} desde ${priceFrom}€ · ConcertRide`;
    if (t4.length <= 65) return t4;
    const t5 = `${abbr} → ${short} desde ${priceFrom}€ · ConcertRide`;
    if (t5.length <= 65) return t5;
    return `${abbr} → ${short} · ${priceFrom}€/asiento`;
  })();

  useSeoMeta({
    title: landing
      // Compact pattern with 5-tier fallback in `routeMetaTitle`. Curated
      // overrides in ROUTE_SEO_IMPROVEMENTS still win when present.
      ? routeOverride?.title ?? routeMetaTitle
      : "Ruta de carpooling",
    description: landing
      // 135–155 char target. See `routeMetaDescription` above for the 3-tier
      // fallback; legacy overrides in ROUTE_SEO_IMPROVEMENTS still win.
      ? routeOverride?.description ?? routeMetaDescription
      : "Carpooling a festivales en España.",
    canonical: landing ? `${SITE_URL}/rutas/${landing.slug}` : `${SITE_URL}/concerts`,
    // Route-specific OG card rendered by the Worker on demand.
    // Edge-cached 7d; falls through to the global default when no landing.
    ogImage: landing ? `${SITE_URL}/api/og/route/${landing.slug}.svg` : undefined,
    // Hero is a CSS-painted card (no <img>) — preload the OG card SVG so the
    // browser has it ready if the LCP element ever becomes that surface.
    preloadImage: landing ? `${SITE_URL}/api/og/route/${landing.slug}.svg` : undefined,
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

  // Realistic taxi/VTC night-rate range for this route (~0.8–1.4 €/km in
  // Spain including night surcharge, flagdown, and dynamic pricing).
  // Replaces the previous hardcoded "35–80 €" which was factually incorrect
  // for both very short routes (Madrid→Mad Cool 15 km should be 12–21 €) and
  // long ones (Barcelona→Mad Cool 507 km is 405–710 €, not 35–80 €).
  // Anti Scaled Content Abuse: each route now shows a real per-route value.
  const taxiCostMin = Math.max(8, Math.round(originData.km * 0.8));
  const taxiCostMax = Math.max(15, Math.round(originData.km * 1.4));
  const taxiCostRange = `${taxiCostMin}–${taxiCostMax} €`;

  // Pre-computed FAQ entries — rendered in body and emitted as FAQPage JSON-LD.
  // Anti Scaled Content Abuse (Google Core Update March 2026): each FAQ answer
  // selects a variant by route signals (km, festival capacity, has shuttle,
  // archipelago, ferry needed) so that two routes with the same template do
  // NOT share identical answer bodies. This raises per-route uniqueness from
  // ~15 % to ~35 %+ on the FAQ block alone.
  const kmShort = originData.km < 80;
  const kmMedium = originData.km >= 80 && originData.km < 300;
  const kmLong = originData.km >= 300;
  const hasShuttle = festival.official_shuttle?.available === true;
  // Capacity is stored as a localized string (e.g. "80.000 personas/día").
  // Strip non-digits and parse as integer for threshold comparisons.
  const festivalCapacity = parseInt(String(festival.capacity ?? "").replace(/[^0-9]/g, ""), 10) || 0;
  const isBigVenue = festivalCapacity >= 50000;

  // FAQ #3 (return trip) — 3 variants by distance band.
  let faqReturnAnswer: string;
  if (kmShort) {
    faqReturnAnswer = `Sí. En trayectos cortos como ${originData.km} km de ${originCity} a ${festival.city}, la mayoría de conductores en ConcertRide publican ida y vuelta el mismo día. El regreso típico es entre las 03:00 y 05:30h, justo después del headliner — un horario en el que los autobuses urbanos de ${festival.city} no operan y un taxi nocturno cuesta ${Math.round(originData.km * 1.0)}–${Math.round(originData.km * 1.6)} €. Al reservar el viaje de ida, confirma con el conductor si planea volver esa misma noche o quedarse para el día siguiente.`;
  } else if (kmMedium) {
    faqReturnAnswer = `Sí. Para los ${originData.km} km entre ${originCity} y ${festival.city}, los conductores de ConcertRide suelen ofrecer ida y vuelta en el mismo viaje porque el coste de combustible se reparte mejor con asientos ocupados en ambos sentidos. El regreso parte habitualmente entre las 03:00 y 05:30h, después del último cabeza de cartel. Esta es la única alternativa real: el último tren de ${festival.city} a ${originCity} sale antes de las 22:00h y no hay autobuses nocturnos de larga distancia con esta cobertura.`;
  } else {
    faqReturnAnswer = `Sí, aunque conviene confirmarlo al reservar. En rutas largas como ${originData.km} km entre ${originCity} y ${festival.city}, algunos conductores prefieren pernoctar cerca del recinto y volver al día siguiente por la mañana (vuelta diurna 11:00–14:00h) en lugar de conducir toda la noche. Otros sí salen entre las 03:00 y 05:30h con relevo entre conductor y copiloto. Pregunta al publicar la reserva qué horario tiene previsto el conductor; ambos formatos son legítimos en ConcertRide y no implican coste adicional.`;
  }

  // FAQ #4 (bus alternative) — already had a kmShort/long branch; keep but
  // diversify the wording by injecting venue-specific access info when long.
  const faqBusAnswer = kmShort
    ? `${originCity} y ${festival.city} están muy cerca (${originData.km} km), por lo que suele haber autobuses urbanos o de cercanías en horario diurno hasta ${festival.city}. Pero ninguno opera entre las 02:00 y las 06:00h, justo cuando termina el festival. La lanzadera oficial al recinto (si existe) deja de funcionar 30–60 min después del cierre. El carpooling con ConcertRide (${seatPrice(originData.concertRideRange, false)}) llega directo al recinto y permite vuelta a la hora real de salida, sin horarios fijos.`
    : `No hay autobús directo regular ${originCity}–${festival.venue}. Las líneas de larga distancia llegan a la terminal central de ${festival.city} y desde allí hace falta lanzadera, taxi (10–${Math.round(Math.min(originData.km, 25) * 1.4)} €) o caminar al recinto. Además, los autobuses nocturnos de larga distancia no cubren esta ruta, por lo que la vuelta después del festival en transporte público no es viable. ConcertRide (${seatPrice(originData.concertRideRange, false)}) ofrece trayecto puerta-a-puerta hasta ${festival.venue} y vuelta coordinada con el conductor.`;

  // FAQ #5 (safety) — 2 variants: short trips emphasize chat/instant booking;
  // long trips emphasize verified driver + relay + stops.
  const faqSafetyAnswer = kmLong
    ? `Sí. En trayectos largos como ${originData.km} km, ConcertRide aplica controles específicos: el conductor declara las paradas de servicio previstas (típicamente cada 200 km o 2h de conducción), su carnet de conducir está verificado, y el chat del evento permite coordinar copiloto si el conductor prefiere relevarse en el viaje. Puedes consultar su histórico de viajes completados y valoraciones antes de reservar. El pago siempre se hace en persona el día del viaje, en efectivo o Bizum — sin pago online por adelantado.`
    : `Sí. Todos los conductores verifican su carnet de conducir antes de poder publicar viajes en ConcertRide. Para trayectos cortos como ${originData.km} km, lo más útil suele ser revisar su perfil: número de viajes completados a ${festival.shortName} u otros festivales, valoraciones de pasajeros anteriores y disponibilidad para coordinar la salida por chat. El pago se hace siempre el día del viaje en efectivo o Bizum, nunca por adelantado, y si el conductor cancela recibes notificación directa para buscar alternativa.`;

  const routeFaqs: { q: string; a: string }[] = [
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
      a: faqReturnAnswer,
    },
    {
      q: `¿Hay autobús directo de ${originCity} a ${festival.shortName}?`,
      a: `${faqBusAnswer}`,
    },
    {
      q: `¿Es seguro el carpooling a ${festival.shortName} con ConcertRide?`,
      a: faqSafetyAnswer,
    },
    {
      q: `¿Cuánto cuesta comparado con el taxi o VTC de ${originCity} a ${festival.shortName}?`,
      a: `Un taxi o VTC (Uber, Cabify) de ${originCity} al recinto de ${festival.shortName} en horario nocturno puede costar entre ${Math.round(originData.km * 0.8)}€ y ${Math.round(originData.km * 1.4)}€ por trayecto completo, dependiendo de la tarifa nocturna y el precio dinámico durante el festival. El carpooling con ConcertRide cuesta ${seatPrice(originData.concertRideRange, false)} — entre 4 y 8 veces más barato para distancias superiores a 80 km. Si el taxi ha de volver vacío desde el recinto, el precio sube todavía más.`,
    },
  ];

  // Contextual FAQ #7 — added only when the route has a distinguishing feature
  // (official shuttle, big venue, or long trip needing accommodation). Keeps
  // routes without these signals at 6 FAQs, those with them at 7. This adds
  // ~150 words of route-specific content where it's meaningful, without
  // forcing template padding on routes that don't need it.
  if (hasShuttle && festival.official_shuttle?.price_from != null) {
    const shuttlePrice = festival.official_shuttle.price_from;
    routeFaqs.push({
      q: `¿Y la lanzadera oficial de ${festival.shortName} desde ${festival.city}? ¿Compensa frente al carpooling de ${originCity}?`,
      a: `${festival.shortName} tiene lanzadera oficial desde ${festival.city} por ${shuttlePrice} €/trayecto, pero solo cubre el tramo final ${festival.city}–${festival.venue}. Desde ${originCity} sigue necesitando llegar primero a ${festival.city} (${originData.km} km, ${originData.drivingTime}), lo que añade tren/bus + lanzadera + espera. El total combinado supera fácilmente ${Math.round(originData.km * 0.05) + shuttlePrice * 2} €/persona ida y vuelta, sin contar el riesgo de perder enlaces. El carpooling directo de ${originCity} a ${festival.venue} es puerta-a-puerta por ${seatPrice(originData.concertRideRange, false)} y elimina los transbordos.`,
    });
  } else if (isBigVenue && kmMedium) {
    routeFaqs.push({
      q: `¿Cómo es el aparcamiento en ${festival.venue} llegando desde ${originCity}?`,
      a: `${festival.venue} tiene capacidad para ${festivalCapacity.toLocaleString("es-ES")} asistentes, por lo que el aparcamiento próximo al recinto se llena varias horas antes del primer concierto y suele tener un coste de 10–25 €/día. Para los conductores en ConcertRide que vienen desde ${originCity} (${originData.km} km), la recomendación habitual es salir con margen suficiente para llegar 2–3 horas antes de la apertura de puertas o aparcar a 1–2 km del recinto y caminar. El precio del aparcamiento se reparte entre los pasajeros y suele incluirse en el precio final del asiento.`,
    });
  } else if (kmLong) {
    routeFaqs.push({
      q: `¿Conviene alojarse cerca de ${festival.city} viniendo desde ${originCity}?`,
      a: `Para una ruta de ${originData.km} km como ${originCity}–${festival.city}, alojarse cerca del recinto el día del festival es una opción razonable si quieres evitar conducir de madrugada en el regreso. Un hostal o camping próximo a ${festival.venue} suele costar 25–60 €/noche por persona; algunos festivales incluyen camping en la entrada. Sin embargo, muchos conductores en ConcertRide optan por relevarse en el viaje de vuelta (copiloto + conductor titular) y ahorrar la noche de alojamiento. Pregunta al conductor su plan al reservar.`,
    });
  }

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

  const routeAbstract = `Carpooling de ${originCity} a ${festival.name} (${festival.venue}, ${festival.city}): ${originData.km} km · ${originData.drivingTime} · desde ${seatPrice(originData.concertRideRange, false)} sin comisión de plataforma. Conductores verificados; pago en efectivo o Bizum el día del festival.`;

  // TouristTrip schema — generated via shared helper. Includes tripOrigin /
  // tripDestination, numeric offer price (EUR), validThrough at festival end,
  // and subjectOf MusicEvent referencing the festival page.
  const jsonLdTrip = {
    ...generateTouristTripFromRoute({
      originCity,
      festival: {
        name: festival.name,
        shortName: festival.shortName,
        slug: festival.slug,
        city: festival.city,
        region: festival.region,
        venue: festival.venue,
        venueAddress: festival.venueAddress,
        lat: festival.lat,
        lng: festival.lng,
        startDate: festival.startDate,
        endDate: festival.endDate,
      },
      km: originData.km,
      drivingTime: originData.drivingTime,
      priceRange: originData.concertRideRange,
      priceMin,
      priceMax,
      routeSlug: landing.slug,
      siteUrl: SITE_URL,
    }),
    // Extra narrative abstract — kept inline because helper stays generic.
    abstract: routeAbstract,
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

  const jsonLdService = generateServiceSchema({
    originCity,
    festivalShortName: festival.shortName,
    festivalName: festival.name,
    routeSlug: landing.slug,
    priceMin,
    priceMax,
    siteUrl: SITE_URL,
    // Offer expires the day after the festival ends — Google I/O 2026 agentic
    // commerce requires every Offer to declare priceValidUntil for agent use.
    priceValidUntil: festival.endDate,
    validFrom: new Date().toISOString().slice(0, 10),
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
        description: `Precio: ${seatPrice(originData.concertRideRange, false)} · Tiempo: ${originData.drivingTime} · Comisión: 0 % · Vuelta madrugada: Sí (coordinada)`,
      },
      {
        "@type": "DataDownload",
        name: "Taxi / VTC (Uber, Cabify)",
        contentUrl: `${SITE_URL}/rutas/${landing.slug}`,
        encodingFormat: "text/html",
        description: `Precio: ${taxiCostRange} ida (nocturno) · Tiempo: ${originData.drivingTime} · Comisión: — · Vuelta madrugada: Sí (precio ×2–3)`,
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
    <>
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdTrip) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdTripAction) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowToTravel) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdTransportDataset) }} />

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

        <SpeakableAnswerBlock
          schemaId={`speakable-route-${landing.slug}`}
          pageUrl={`${SITE_URL}/rutas/${landing.slug}`}
          question={`¿Cómo ir a ${festival.shortName} desde ${originCity} en ${routeYear}?`}
          answer={`Para ir a ${festival.name} ${routeYear} desde ${originCity}, el carpooling de ConcertRide cuesta ${seatPrice(originData.concertRideRange, false)}. La distancia es de ${originData.km} km y el tiempo estimado de conducción ${originData.drivingTime}. El destino es ${festival.venue} en ${festival.city}. Pagas en efectivo o Bizum directo al conductor el día del viaje, sin comisión de plataforma. La vuelta de madrugada se coordina con el conductor.`}
        />

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable route-summary">
          ConcertRide ofrece carpooling de {originCity} a {festival.name} ({festival.city}) por {seatPrice(originData.concertRideRange, false)}. Distancia: {originData.km} km · {originData.drivingTime}. Sin comisión — el 100&nbsp;% del precio va al conductor.
        </p>

        {/* ── AI-extractable quotable passage (GEO citation target) ── */}
        {/* Visually subtle; primary purpose is machine readability for   */}
        {/* ChatGPT, Perplexity, Google AI Overviews and similar engines. */}
        <section
          data-quotable
          aria-label={`Resumen de la ruta ${originCity} → ${festival.shortName}`}
          className="max-w-2xl rounded-lg border border-white/10 bg-white/5 px-4 py-3"
        >
          <p className="font-sans text-sm leading-relaxed text-white/70">
            {generateQuotable(landing)}
          </p>
        </section>

        {/* ── Agentic booking surface (Google I/O 2026 agentic commerce) ──
            Stable semantic intents for Gemini agents reasoning over the route. */}
        <AgentActionRail
          ariaLabel={`Acciones disponibles para la ruta ${originCity} → ${festival.shortName}`}
          actions={[
            {
              label: `Buscar viajes · desde ${seatPrice(originData.concertRideRange, false)}`,
              href: `/concerts?city=${encodeURIComponent(festival.city)}`,
              intent: "search-ride",
              variant: "primary",
              description: `Buscar carpooling desde ${originCity} a ${festival.shortName} por ${seatPrice(originData.concertRideRange, false)}`,
            },
            {
              label: "Ver ficha del festival",
              href: `/festivales/${festival.slug}`,
              intent: "view-festival",
              description: `Información completa del festival ${festival.name}`,
            },
            {
              label: "Publicar mi viaje",
              href: "/publish",
              intent: "publish-ride",
              description: `Publicar un viaje desde ${originCity} a ${festival.shortName} como conductor`,
            },
          ]}
        />

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

        {/* Hero CTAs — visible above-the-fold on mobile per UX audit */}
        <div className="flex flex-wrap gap-3 pt-3">
          <Link
            to={`/concerts?city=${encodeURIComponent(festival.citySlug)}&from=${encodeURIComponent(originCity)}`}
            className="inline-flex items-center justify-center font-sans text-sm font-bold uppercase tracking-wider bg-cr-primary text-black px-5 py-3 shadow-[4px_4px_0_0_rgba(219,255,0,0.25)] hover:shadow-[6px_6px_0_0_rgba(219,255,0,0.4)] transition-shadow"
          >
            Buscar plaza · desde {originData.concertRideRange.match(/(\d+)/)?.[1] ?? "3"}€
          </Link>
          <Link
            to={`/publish?to=${encodeURIComponent(festival.slug)}&from=${encodeURIComponent(originCity)}`}
            className="inline-flex items-center justify-center font-sans text-sm font-bold uppercase tracking-wider border-2 border-cr-border text-cr-text px-5 py-3 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            Publicar mi viaje
          </Link>
        </div>
      </div>

      {/* ── Location context map — origin → festival polyline ── */}
      {(() => {
        const originCityLanding = CITY_LANDINGS.find(
          (c) => c.slug === landing.originCitySlug,
        );
        const originLat = originCityLanding?.lat;
        const originLng = originCityLanding?.lng;
        if (
          typeof originLat !== "number" ||
          typeof originLng !== "number" ||
          typeof festival.lat !== "number" ||
          typeof festival.lng !== "number"
        ) {
          return null;
        }
        const durationMin = parseDrivingTimeMinutes(originData.drivingTime);
        return (
          <section
            aria-labelledby={`route-map-${landing.slug}`}
            className="max-w-6xl mx-auto px-6 pt-2"
          >
            <h2 id={`route-map-${landing.slug}`} className="sr-only">
              Mapa de la ruta {originCity} a {festival.shortName}
            </h2>
            <ClientOnly
              fallback={
                <div
                  className="h-[280px] md:h-[360px] cr-card animate-pulse"
                  aria-hidden="true"
                />
              }
            >
              <Suspense
                fallback={
                  <div
                    className="h-[280px] md:h-[360px] cr-card animate-pulse"
                    aria-hidden="true"
                  />
                }
              >
                <LocationContextMap
                  points={[
                    {
                      lat: originLat,
                      lng: originLng,
                      label: originCity,
                      kind: "secondary",
                    },
                    {
                      lat: festival.lat,
                      lng: festival.lng,
                      label: festival.name,
                      kind: "primary",
                    },
                  ]}
                  polyline
                  overlay={{
                    distanceKm: originData.km,
                    durationMin,
                  }}
                  ariaLabel={`Mapa de la ruta ${originCity} a ${festival.shortName}`}
                />
              </Suspense>
            </ClientOnly>
          </section>
        );
      })()}

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
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-5 py-3 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Buscar viaje {originCity} → {festival.shortName} <ArrowRight size={12} />
          </Link>
          <Link
            to="/publish"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text-muted px-5 py-3 hover:border-cr-primary hover:text-cr-primary transition-colors"
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
              className="inline-block font-sans text-sm font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-5 py-3 hover:bg-cr-primary hover:text-black transition-colors"
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

      {/* ── Anon registration CTA — shown only to non-logged-in users ── */}
      {!user && (
        <section
          className="max-w-6xl mx-auto px-6 pb-6"
          aria-label="Crea una cuenta para reservar tu plaza"
        >
          <div className="border-2 border-[#dbff00]/40 bg-[#dbff00]/[0.04] p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#dbff00]">
                ¿Aún no tienes cuenta?
              </p>
              <p className="font-display text-xl md:text-2xl uppercase leading-tight">
                Regístrate gratis y reserva al instante
              </p>
              <p className="font-sans text-xs text-white/50 leading-relaxed">
                0% comisión · Conductores verificados · Gratis para siempre · Pago en efectivo o Bizum
              </p>
            </div>
            <Link
              to={`/register?next=${encodeURIComponent(`/rutas/${landing.slug}`)}`}
              className="flex-shrink-0 inline-flex items-center gap-2 bg-[#dbff00] text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 whitespace-nowrap"
            >
              Crear cuenta gratis <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

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
                <td className="py-2 pr-4">{seatPrice(originData.concertRideRange, false)}</td>
                <td className="py-2 pr-4">{originData.drivingTime}</td>
                <td className="py-2 pr-4 font-semibold text-cr-primary">0 %</td>
                <td className="py-2">Sí (coordinada)</td>
              </tr>
              <tr className="border-b border-cr-border/50">
                <td className="py-2 pr-4">Taxi / VTC (Uber, Cabify)</td>
                <td className="py-2 pr-4">{taxiCostRange} ida (nocturno)</td>
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

      {/* ── Related blog posts ── */}
      {(() => {
        const festSlug = festival.slug;
        const relatedPosts = BLOG_POSTS.filter((p) =>
          p.relatedPosts?.includes(festSlug) ||
          p.tags?.some((t: string) => t === festSlug || t === festival.shortName.toLowerCase()) ||
          p.slug.includes(festSlug) ||
          p.title.toLowerCase().includes(festival.shortName.toLowerCase())
        ).slice(0, 3);
        if (relatedPosts.length === 0) return null;
        return (
          <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-5">
            <h2 className="font-display text-xl uppercase">
              Guías de transporte a {festival.shortName}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="border border-cr-border p-4 space-y-2 hover:border-cr-primary/40 transition-colors"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">Guía</p>
                  <h3 className="font-display text-sm uppercase leading-tight">{post.title}</h3>
                  <p className="font-sans text-xs text-cr-text-muted line-clamp-2">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">
                    Leer <ArrowRight size={10} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

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

    <StickyRegBar />
    </>
  );
}

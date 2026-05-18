import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, MapPin, Music2 } from "lucide-react";
import type { Concert } from "@concertride/types";
import { api } from "@/lib/api";
import { ConcertCard } from "@/components/ConcertCard";
import { LoadingSpinner } from "@/components/ui";
import { FactDensityCallout } from "@/components/FactDensityCallout";
import { SpeakableAnswerBlock } from "@/components/SpeakableAnswerBlock";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { REGION_ISO } from "@/lib/seoConfig";
import { CITY_LANDINGS, CITY_LANDINGS_BY_SLUG } from "@/lib/cityLandings";
import { FESTIVAL_LANDINGS } from "@/lib/festivalLandings";
import { ROUTE_LANDINGS } from "@/lib/routeLandings";
import { CITY_SEO_IMPROVEMENTS } from "@/lib/seoOverrides";
import { trackCityView } from "@/lib/seoEvents";
import { AutoLinksForCity } from "@/lib/autoLinking";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { StickyRegBar } from "@/components/StickyRegBar";
import { useSession } from "@/lib/session";

const CITY_WIKIDATA: Record<string, string> = {
  "Madrid": "https://www.wikidata.org/wiki/Q2807",
  "Barcelona": "https://www.wikidata.org/wiki/Q1492",
  "Valencia": "https://www.wikidata.org/wiki/Q8818",
  "Sevilla": "https://www.wikidata.org/wiki/Q8717",
  "Bilbao": "https://www.wikidata.org/wiki/Q8692",
  "Málaga": "https://www.wikidata.org/wiki/Q8862",
  "Zaragoza": "https://www.wikidata.org/wiki/Q10305",
  "Granada": "https://www.wikidata.org/wiki/Q8811",
  "Donostia": "https://www.wikidata.org/wiki/Q10313",
  "Donostia / San Sebastián": "https://www.wikidata.org/wiki/Q10313",
  "Santiago de Compostela": "https://www.wikidata.org/wiki/Q8823",
  "Alicante": "https://www.wikidata.org/wiki/Q11959",
  "Pamplona": "https://www.wikidata.org/wiki/Q10282",
  "Pamplona / Iruña": "https://www.wikidata.org/wiki/Q10282",
  "Vitoria-Gasteiz": "https://www.wikidata.org/wiki/Q10330",
  "A Coruña": "https://www.wikidata.org/wiki/Q8757",
  "Vigo": "https://www.wikidata.org/wiki/Q8745",
  "Murcia": "https://www.wikidata.org/wiki/Q12225",
  "Valladolid": "https://www.wikidata.org/wiki/Q8748",
};

export default function CityLandingPage() {
  const params = useParams<{ city?: string; year?: string }>();
  const { city: cityParam, year: yearParam } = params;
  const { user } = useSession();

  // Support both /conciertos/:city and /conciertos/:city/:year and /conciertos/:city-:year
  const { baseSlug, pageYear } = useMemo(() => {
    const defaultYear = new Date().getFullYear();
    // Case A: /conciertos/:city/:year
    if (cityParam && yearParam && /^20\d{2}$/.test(yearParam)) {
      return { baseSlug: cityParam, pageYear: Number(yearParam) };
    }
    // Case B: /conciertos/:city where city may be 'sevilla-2026'
    if (cityParam) {
      const m = cityParam.match(/^(.+)-(20\d{2})$/);
      if (m) return { baseSlug: m[1], pageYear: Number(m[2]) };
      return { baseSlug: cityParam, pageYear: defaultYear };
    }
    return { baseSlug: undefined as string | undefined, pageYear: defaultYear };
  }, [cityParam, yearParam]);

  const landing = baseSlug ? CITY_LANDINGS_BY_SLUG[baseSlug] : undefined;

  const [concerts, setConcerts] = useState<Concert[] | null>(null);

  const year = pageYear;
  const nextYear = year + 1;

  // Per-city title/description overrides targeting top GSC queries
  const CITY_META_OVERRIDES: Record<string, { title: string; description: string; keywords?: string }> = {
    sevilla: {
      title: `Conciertos Sevilla ${year}: La Cartuja, FIBES + carpooling | ConcertRide`,
      description: `Conciertos en Sevilla ${year}: La Cartuja (60.000 pl.), FIBES, Interestelar Fest, Icónica Fest. Carpooling sin comisión desde 3 €/asiento. Conductores verificados.`,
      keywords: `conciertos en Sevilla ${year}, conciertos Sevilla ${nextYear}, conciertos Sevilla ${nextYear + 1}, próximos conciertos Sevilla, conciertos música Sevilla, conciertos y recitales Sevilla, agenda musical Sevilla, concierto Sevilla, sevilla concierto, música en Sevilla, Interestelar Sevilla, Icónica Sevilla Fest, carpooling Sevilla festivales, festivales en Sevilla`,
    },
    donostia: {
      title: `Conciertos Donostia ${year}: Jazzaldia + carpooling | ConcertRide`,
      description: `Conciertos en Donostia ${year}: Jazzaldia (julio), Donostia Arena, Anoeta. Carpooling sin comisión a BBK Live (4–7 €) y Azkena Rock (4–7 €). Desde 4 €/asiento.`,
      keywords: `conciertos Donostia ${year}, conciertos en Donostia ${year}, conciertos San Sebastián ${year}, conciertos en donostia 2026, conciertos en San Sebastián, conciertos en donosti ${year}, san sebastian conciertos, conciertos san sebastian, Jazzaldia ${year}, carpooling BBK Live desde Donostia`,
    },
    alicante: {
      title: `Conciertos Alicante ${year}: Plaza Toros, festivales | ConcertRide`,
      description: `Conciertos en Alicante ${year}: Plaza de Toros, ADDA. Carpooling a Low Festival Benidorm, Arenal Sound y Viña Rock. Desde 3 €/asiento. Sin comisión.`,
      keywords: `conciertos en Alicante ${year}, conciertos Alicante ${nextYear}, plaza de toros alicante conciertos ${year}, conciertos plaza toros alicante ${year}, carpooling Alicante festivales`,
    },
    bilbao: {
      title: `Conciertos Bilbao ${year}: BBK Live, carpooling | ConcertRide`,
      description: `Conciertos en Bilbao ${year}: BBK Live (Kobetamendi), Bilbao Arena, Euskalduna. Carpooling desde Santander, Vitoria (4–6 €) y Madrid (11–16 €). Sin comisión.`,
      keywords: `conciertos Bilbao ${year}, conciertos en Bilbao ${nextYear}, BBK Live ${year}, Kobetamendi, bilbao concert, como llegar BBK Live Bilbao, carpooling Bilbao festivales`,
    },
    zaragoza: {
      title: `Conciertos Zaragoza ${year}: Príncipe Felipe + carpooling | ConcertRide`,
      description: `Conciertos en Zaragoza ${year}: Pabellón Príncipe Felipe, Sala López, Pirineos Sur. Carpooling a Mad Cool (9–13 €) y Primavera Sound (8–12 €). Sin comisión.`,
      keywords: `conciertos en Zaragoza ${year}, próximos conciertos Zaragoza, conciertos Zaragoza ${nextYear}, conciertos zaragoza ${nextYear + 1}, próximos conciertos en zaragoza, conciertos 2025 Zaragoza, Pabellón Príncipe Felipe, carpooling Zaragoza festivales`,
    },
    madrid: {
      title: `Conciertos Madrid ${year}: WiZink, IFEMA, carpooling | ConcertRide`,
      description: `Conciertos en Madrid ${year}: WiZink Center, Vistalegre, IFEMA (Mad Cool), Caja Mágica. Carpooling desde toda España, desde 4 €/asiento. Sin comisión.`,
      keywords: `conciertos en Madrid ${year}, conciertos Madrid ${nextYear}, próximos conciertos Madrid, WiZink Center ${year}, Mad Cool Madrid, IFEMA conciertos, carpooling Madrid festivales, cómo llegar conciertos Madrid`,
    },
    barcelona: {
      title: `Conciertos Barcelona ${year}: Primavera Sound, Sónar | ConcertRide`,
      description: `Conciertos en Barcelona ${year}: Primavera Sound (Fòrum), Sónar (Fira Montjuïc), Cruïlla (Fòrum, julio). Carpooling desde Madrid (14–22 €). Sin comisión.`,
      keywords: `conciertos en Barcelona ${year}, conciertos Barcelona ${nextYear}, Primavera Sound ${year}, Sónar Barcelona, Cruïlla ${year}, carpooling Barcelona festivales, Palau Sant Jordi conciertos`,
    },
    valencia: {
      title: `Conciertos Valencia ${year}: Zevra, Arenal Sound | ConcertRide`,
      description: `Conciertos en Valencia ${year}: Zevra Festival (La Marina), Arenal Sound, Medusa, FIB. Carpooling desde 3 €/asiento. Sin comisión de plataforma.`,
      keywords: `conciertos en Valencia ${year}, conciertos Valencia ${nextYear}, Zevra Festival Valencia, Arenal Sound Valencia, Medusa Festival Valencia, carpooling Valencia festivales, festivales cerca Valencia`,
    },
    malaga: {
      title: `Conciertos Málaga ${year}: Cala Mijas, carpooling | ConcertRide`,
      description: `Conciertos en Málaga ${year}: Cala Mijas Fest (Cortijo de Torres), Marenostrum (Fuengirola), Andalucía Big. Carpooling desde Sevilla (6–9 €). Sin comisión.`,
      keywords: `conciertos en Málaga ${year}, Cala Mijas ${year}, Cortijo de Torres Málaga, carpooling Málaga festivales, festivales Málaga Costa del Sol`,
    },
    "a-coruna": {
      title: `Conciertos A Coruña ${year}: Resurrection Fest | ConcertRide`,
      description: `Conciertos en A Coruña ${year}: Coliseum, Palexco. Carpooling a Resurrection Fest (10–14 €) y O Son do Camiño (8–12 €). Sin comisión de plataforma.`,
      keywords: `conciertos en A Coruña ${year}, Resurrection Fest carpooling, carpooling A Coruña Viveiro, O Son do Camiño carpooling, Coliseum A Coruña conciertos`,
    },
    pamplona: {
      title: `Conciertos Pamplona ${year}: Navarra Arena, festivales | ConcertRide`,
      description: `Conciertos en Pamplona ${year}: Navarra Arena, Anaitasuna. Carpooling a BBK Live (5–8 €), Azkena Rock (4–7 €) y Mad Cool (11–16 €). Sin comisión.`,
      keywords: `conciertos en Pamplona ${year}, conciertos Pamplona Navarra, Navarra Arena, carpooling Pamplona festivales, BBK Live desde Pamplona`,
    },
    "vitoria-gasteiz": {
      title: `Conciertos Vitoria-Gasteiz ${year}: Azkena Rock | ConcertRide`,
      description: `Conciertos en Vitoria-Gasteiz ${year}: Azkena Rock (Mendizabala), Iradier Arena. Carpooling a BBK Live (3–6 €) y Sonorama (7–11 €). Sin comisión.`,
      keywords: `conciertos en Vitoria ${year}, Azkena Rock ${year}, Mendizabala conciertos, carpooling Vitoria-Gasteiz festivales, BBK Live desde Vitoria`,
    },
    vigo: {
      title: `Conciertos Vigo ${year}: Resurrection Fest, festivales | ConcertRide`,
      description: `Conciertos en Vigo ${year}: Auditorio Mar de Vigo, Pabellón Multiusos. Carpooling a Resurrection Fest (12–16 €) y O Son do Camiño (8–12 €). Sin comisión.`,
      keywords: `conciertos en Vigo ${year}, Resurrection Fest desde Vigo, O Son do Camiño Vigo, Auditorio Mar de Vigo conciertos, carpooling Vigo festivales`,
    },
    murcia: {
      title: `Conciertos Murcia ${year}: SOS 4.8 + carpooling | ConcertRide`,
      description: `Conciertos en Murcia ${year}: SOS 4.8 Festival, Auditorio Víctor Villegas. Carpooling a Medusa (8–12 €), Arenal Sound (10–14 €) y Viña Rock (6–9 €). Sin comisión.`,
      keywords: `conciertos en Murcia ${year}, conciertos Murcia ${nextYear}, conciertos murcia ${nextYear + 1}, proximos conciertos en murcia, agenda conciertos murcia, concierto murcia, SOS 4.8 Murcia, Auditorio Víctor Villegas, carpooling Murcia festivales, Medusa Festival desde Murcia`,
    },
    valladolid: {
      title: `Conciertos Valladolid ${year}: Sonorama, festivales | ConcertRide`,
      description: `Conciertos en Valladolid ${year}: Plaza de Toros, Pabellón Pisuerga. Carpooling a Sonorama Ribera (8–12 €) y Mad Cool Madrid (8–12 €). Sin comisión.`,
      keywords: `conciertos en Valladolid ${year}, Sonorama Ribera desde Valladolid, carpooling Valladolid festivales, Plaza de Toros Valladolid conciertos`,
    },
    granada: {
      title: `Conciertos Granada ${year}: Granada Sound, festivales | ConcertRide`,
      description: `Conciertos en Granada ${year}: Granada Sound (Cortijo del Conde, septiembre). Carpooling a Cala Mijas (6–9 €) e Interestelar Sevilla (8–12 €). Sin comisión.`,
      keywords: `conciertos en Granada ${year}, Granada Sound ${year}, Cortijo del Conde, carpooling Granada festivales, Cala Mijas desde Granada`,
    },
    "santiago-de-compostela": {
      title: `Conciertos Santiago ${year}: O Son do Camiño | ConcertRide`,
      description: `Conciertos en Santiago ${year}: O Son do Camiño (Monte do Gozo, 18–20 jun). Carpooling desde A Coruña (10–12 €), Vigo (12–15 €), Madrid (20–30 €). Sin comisión.`,
      keywords: `conciertos en Santiago de Compostela ${year}, O Son do Camiño ${year}, Monte do Gozo, carpooling Santiago festivales, A Coruña Santiago carpooling`,
    },
  };

  const cityOverride = landing ? (CITY_SEO_IMPROVEMENTS[landing.slug] || CITY_META_OVERRIDES[landing.slug]) : undefined;

  useSeoMeta({
    title: landing
      ? cityOverride?.title ?? `Conciertos en ${landing.display} ${year}: carpooling | ConcertRide`
      : "Conciertos por ciudad",
    description: landing
      // Front-load price + city in first 50 words for AI extraction. The
      // overrides above for top cities can stay verbose; the generic
      // fallback is the AI-optimised baseline for every other city.
      // 3-tier guard so the meta never overflows 160 chars for cities with
      // long venue names (e.g. "Palacio de los Deportes de Guadalajara").
      ? cityOverride?.description ?? (() => {
          const t1 = `Carpooling a conciertos en ${landing.display} ${year} desde 3 €/asiento, 0% comisión. Próximos eventos en ${landing.venues.slice(0, 2).join(", ")} y más. Conductores verificados.`;
          if (t1.length <= 160) return t1;
          const t2 = `Carpooling a conciertos en ${landing.display} ${year} desde 3 €/asiento, 0% comisión. Eventos en ${landing.venues[0] ?? landing.display}. Conductores verificados.`;
          if (t2.length <= 160) return t2;
          return `Carpooling a conciertos en ${landing.display} ${year} desde 3 €/asiento. 0% comisión, conductores verificados, vuelta nocturna coordinada.`;
        })()
      : "Explora conciertos por ciudad en España.",
    canonical: landing
      ? `${SITE_URL}/conciertos/${landing.slug}`
      : `${SITE_URL}/concerts`,
    keywords: landing
      ? cityOverride?.keywords ?? `conciertos en ${landing.display} ${year}, conciertos ${landing.display} ${nextYear}, agenda musical ${landing.display} ${year}, próximos conciertos ${landing.display}, conciertos música ${landing.display}, como ir a conciertos ${landing.display}, festivales ${landing.display}, carpooling ${landing.display} ${year}, coche compartido concierto ${landing.display}, cómo ir al concierto ${landing.display}, carpooling concierto ${landing.display}, viaje compartido ${landing.display} ${year}`
      : undefined,
    ogImageAlt: landing
      ? `Conciertos y carpooling en ${landing.display} ${year} · ConcertRide`
      : "Conciertos por ciudad en España · ConcertRide",
    geoRegion: landing ? (REGION_ISO[landing.region] ?? undefined) : undefined,
    geoPlacename: landing ? `${landing.display}, España` : undefined,
    geoLat: landing?.lat,
    geoLng: landing?.lng,
  });

  useEffect(() => {
    if (!landing) return;
    setConcerts(null);
    api.concerts
      .list({
        city: landing.city,
        date_from: new Date().toISOString(),
        limit: 50,
      })
      .then((r) => {
        setConcerts(r.concerts);
        trackCityView(landing.slug, landing.display, r.concerts.filter((c) => new Date(c.date).getTime() > Date.now()).length);
      })
      .catch(() => {
        setConcerts([]);
        trackCityView(landing.slug, landing.display, 0);
      });
  }, [landing]);

  // Computed inside the component but stable for the same city.
  const cityFaqs = useMemo(() => {
    if (!landing) return [];
    const cityFestivalsCount = FESTIVAL_LANDINGS.filter((f) => f.citySlug === landing.slug).length;
    const routesFromCount = ROUTE_LANDINGS.filter((r) => r.originCitySlug === landing.slug).length;
    return [
      {
        q: `¿Qué conciertos hay en ${landing.display} en ${year} y ${nextYear}?`,
        a: `Los próximos conciertos en ${landing.display} para ${year} y ${nextYear} cubren los principales recintos de la ciudad: ${landing.venues.slice(0, 3).join(", ")}${landing.venues.length > 3 ? " y otros" : ""}. La agenda concentra giras nacionales e internacionales de pop, rock, indie, electrónica y urbano. Consulta la lista actualizada al inicio de esta página o explora todos los conciertos en concertride.me/concerts.`,
      },
      {
        q: `¿Cómo ir al concierto en ${landing.display} sin coche?`,
        a: `Para llegar a un concierto en ${landing.display} sin coche propio tienes tres opciones: 1) Transporte público urbano (metro, bus o tranvía), válido hasta el último servicio nocturno. 2) Taxi o VTC (Uber, Cabify, Bolt), con tarifa nocturna a partir de las 22:00–23:00. 3) Coche compartido (carpooling) con ConcertRide, que conecta a asistentes desde otras ciudades de España con conductores que ya van al recinto, con vuelta flexible.${routesFromCount > 0 ? ` Desde ${landing.display} hay ${routesFromCount} rutas de carpooling activas a festivales nacionales.` : ""}`,
      },
      {
        q: `¿Hay festivales en ${landing.display}?`,
        a: cityFestivalsCount > 0
          ? `Sí. ${landing.display} acoge ${cityFestivalsCount === 1 ? "1 festival" : `${cityFestivalsCount} festivales`} listados en ConcertRide: ${FESTIVAL_LANDINGS.filter((f) => f.citySlug === landing.slug).map((f) => f.shortName).join(", ")}. Consulta la sección "Festivales en ${landing.display}" más abajo para ver fechas, recintos y opciones de carpooling.`
          : `${landing.display} es un punto de origen frecuente para viajes a festivales nacionales (Mad Cool, Primavera Sound, Sonorama, Cala Mijas, Arenal Sound y otros). Consulta la sección "Carpooling desde ${landing.display}" más abajo.`,
      },
      {
        q: `¿Cuánto cuesta el carpooling para ir a un concierto en ${landing.display}?`,
        a: `El precio del coche compartido a ${landing.display} depende de la distancia: entre 3 y 8 € por asiento para trayectos de menos de 200 km y entre 10 y 20 € para distancias más largas (Madrid, Barcelona). En ConcertRide el conductor cobra solo el coste de combustible y peajes, sin comisión de plataforma. El pago es en efectivo o Bizum el día del viaje.`,
      },
      {
        q: `¿Hay parking gratuito en los recintos de conciertos en ${landing.display}?`,
        a: `La mayoría de grandes recintos en ${landing.display} (palacios de deportes, estadios, ferias de exposiciones) tienen parking propio de pago, con precios de 5–15 € por noche. Los recintos en el centro suelen carecer de parking propio y requieren aparcar en la calle o en aparcamientos públicos cercanos. Venir en coche compartido con ConcertRide evita el coste y el estrés del parking: el conductor lleva el coche y los pasajeros se dividen los gastos.`,
      },
      {
        q: `¿Es seguro el coche compartido para ir a conciertos en ${landing.display}?`,
        a: `Sí. En ConcertRide todos los conductores verifican su carnet de conducir antes de publicar un viaje. Puedes ver el perfil completo del conductor, sus valoraciones de otros pasajeros y comunicarte por chat antes del viaje. El pago siempre es en persona el día del evento — nunca adelantas dinero online. El modelo de gastos compartidos sin comisión está reconocido como legal en España por el Tribunal Supremo desde 2017.`,
      },
    ];
  }, [landing, year, nextYear]);

  const cityJsonLdVariants: Array<Record<string, unknown>> = useMemo(() => {
    if (!landing) return [];

    const cityFestivals = FESTIVAL_LANDINGS.filter((f) => f.citySlug === landing.slug).slice(0, 6);
    const cityRoutes = ROUTE_LANDINGS.filter((r) => r.originCitySlug === landing.slug).slice(0, 6);
    const topVenues = landing.venues.slice(0, 5);
    const originCoords = { lat: landing.lat, lng: landing.lng };

    return [
      // CollectionPage = the canonical "this URL is a curated list of concerts
      // in a city" hint to crawlers. Pairs with the BreadcrumbList already
      // emitted by the layout. Required for the audit gap closed.
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/conciertos/${landing.slug}#page`,
        url: `${SITE_URL}/conciertos/${landing.slug}`,
        name: `Conciertos y festivales en ${landing.display} ${year}`,
        description: `Agenda de conciertos en ${landing.display} con carpooling sin comisión.`,
        inLanguage: "es-ES",
        about: {
          "@type": "Place",
          name: landing.display,
          containedInPlace: { "@type": "Country", name: "España" },
        },
      },
      // LocalBusiness gives ConcertRide a local entity anchor per city —
      // even though we're a digital service, the social-coordination layer
      // is genuinely place-bound and Google now rewards local entity hints
      // for "carpooling [city]" SERPs.
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/conciertos/${landing.slug}#localbusiness`,
        name: `ConcertRide · ${landing.display}`,
        url: `${SITE_URL}/conciertos/${landing.slug}`,
        areaServed: {
          "@type": "City",
          name: landing.display,
          address: { "@type": "PostalAddress", addressLocality: landing.display, addressCountry: "ES" },
        },
        geo: { "@type": "GeoCoordinates", latitude: landing.lat, longitude: landing.lng },
        priceRange: "€3-€20",
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Resumen de ciudad: ${landing.display}`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: landing.display },
          { "@type": "ListItem", position: 2, name: landing.region },
          { "@type": "ListItem", position: 3, name: `${year}` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Recintos en ${landing.display}`,
        itemListElement: topVenues.map((venue, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: venue,
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Festivales en ${landing.display}`,
        itemListElement: cityFestivals.map((festival, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: festival.shortName,
          item: { "@id": `${SITE_URL}/festivales/${festival.slug}`, "@type": "WebPage", name: festival.name },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Rutas desde ${landing.display}`,
        itemListElement: cityRoutes.map((route, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${route.originCity} → ${route.festival.shortName}`,
          item: { "@id": `${SITE_URL}/rutas/${route.slug}`, "@type": "WebPage" },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Transporte y accesos: ${landing.display}`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: `Transporte público: metro, bus y taxi` },
          { "@type": "ListItem", position: 2, name: `Carpooling sin comisión` },
          { "@type": "ListItem", position: 3, name: `Vuelta nocturna coordinada` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Preguntas frecuentes: ${landing.display}`,
        itemListElement: cityFaqs.slice(0, 5).map((faq, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: faq.q,
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Coordenadas de ${landing.display}`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: `Latitud: ${originCoords.lat}` },
          { "@type": "ListItem", position: 2, name: `Longitud: ${originCoords.lng}` },
          { "@type": "ListItem", position: 3, name: `Wikidata: ${CITY_WIKIDATA[landing.display] ?? CITY_WIKIDATA[landing.slug] ?? 'n/d'}` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Agenda rápida ${landing.display} ${year}`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: `Conciertos en ${landing.display} ${year}` },
          { "@type": "ListItem", position: 2, name: `Conciertos en ${landing.display} ${nextYear}` },
          { "@type": "ListItem", position: 3, name: `Carpooling desde ${landing.display}` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Enlaces de ciudad: ${landing.display}`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: `Página ciudad`, item: { "@id": `${SITE_URL}/conciertos/${landing.slug}` } },
          { "@type": "ListItem", position: 2, name: `Buscar viajes`, item: { "@id": `${SITE_URL}/concerts` } },
          { "@type": "ListItem", position: 3, name: `Publicar viaje`, item: { "@id": `${SITE_URL}/publish` } },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Resumen LLM ${landing.display}`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: `${landing.display}, ${landing.region}` },
          { "@type": "ListItem", position: 2, name: `${cityFestivals.length} festivales destacados` },
          { "@type": "ListItem", position: 3, name: `${cityRoutes.length} rutas de carpooling` },
        ],
      },
    ];
  }, [landing, cityFaqs, year, nextYear]);

  if (!baseSlug || !landing) return <Navigate to="/concerts" replace />;

  const futureConcerts = (concerts ?? []).filter(
    (c) => new Date(c.date).getTime() > Date.now(),
  );

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Conciertos en ${landing.display}`,
            url: `${SITE_URL}/conciertos/${landing.slug}`,
            inLanguage: "es-ES",
            dateModified: new Date().toISOString().slice(0, 10),
            description: landing.blurb,
            about: {
              "@type": "Place",
              name: landing.display,
              address: {
                "@type": "PostalAddress",
                addressLocality: landing.display,
                addressRegion: landing.region,
                addressCountry: "ES",
              },
            },
            isPartOf: {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              name: "ConcertRide",
              url: SITE_URL,
            },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: futureConcerts.length,
              itemListElement: futureConcerts.slice(0, 20).map((c, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${SITE_URL}/concerts/${c.id}`,
                name: `${c.artist} · ${c.venue.name}`,
              })),
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Conciertos", item: `${SITE_URL}/concerts` },
              {
                "@type": "ListItem",
                position: 3,
                name: `Conciertos en ${landing.display}`,
                item: `${SITE_URL}/conciertos/${landing.slug}`,
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            inLanguage: "es-ES",
            mainEntity: cityFaqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `${SITE_URL}/conciertos/${landing.slug}#localbusiness`,
            name: `ConcertRide · Carpooling para conciertos en ${landing.display}`,
            description: landing.blurb,
            url: `${SITE_URL}/conciertos/${landing.slug}`,
            logo: `${SITE_URL}/favicon.svg`,
            image: `${SITE_URL}/og/home.png`,
            priceRange: "€3–€35",
            currenciesAccepted: "EUR",
            paymentAccepted: "Cash, Bizum",
            geo: {
              "@type": "GeoCoordinates",
              latitude: landing.lat,
              longitude: landing.lng,
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: landing.display,
              addressRegion: landing.region,
              addressCountry: "ES",
            },
            areaServed: {
              "@type": "City",
              name: landing.display,
              sameAs: CITY_WIKIDATA[landing.display] ?? `https://www.wikidata.org/wiki/Special:Search/${encodeURIComponent(landing.display)}`,
            },
            sameAs: [
              "https://twitter.com/concertride_es",
              "https://www.instagram.com/concertride_es/",
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${SITE_URL}/conciertos/${landing.slug}#webpage`,
            "url": `${SITE_URL}/conciertos/${landing.slug}`,
            "name": `Conciertos en ${landing.display} ${year} — Cómo llegar | ConcertRide`,
            "description": `Agenda de conciertos en ${landing.display} (${landing.region}) para ${year} y ${nextYear}: ${landing.venues.slice(0, 3).join(", ")}${landing.venues.length > 3 ? " y más recintos" : ""}. Carpooling sin comisión desde cualquier ciudad de España. Precio medio 3–20 €/asiento según distancia. Conductores verificados con carnet de conducir.`,
            "inLanguage": "es-ES",
            "keywords": `conciertos en ${landing.display}, conciertos ${landing.display} ${year}, próximos conciertos ${landing.display}, carpooling ${landing.display}, cómo ir al concierto ${landing.display}`,
            "about": {
              "@type": "Place",
              "name": landing.display,
              "addressRegion": landing.region,
              "addressCountry": "ES",
              ...(CITY_WIKIDATA[landing.display] ? { "sameAs": CITY_WIKIDATA[landing.display] } : {}),
            },
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": ["h1", ".speakable", ".city-summary", ".transport-info", "article p:first-of-type", "dt", "dd"],
            },
            "isPartOf": { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "ConcertRide", url: SITE_URL },
            "dateModified": new Date().toISOString().slice(0, 10),
          }),
        }}
      />
      {cityJsonLdVariants.map((variant, index) => (
        <script
          key={`city-json-variant-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(variant) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Trip",
            "@id": `${SITE_URL}/conciertos/${landing.slug}#tourist-trip`,
            name: `Carpooling a conciertos y festivales desde ${landing.display}`,
            description: `Viaje compartido desde ${landing.display} a los principales festivales y conciertos de España. Precio desde ${(() => {
              const prices = ROUTE_LANDINGS
                .filter((r) => r.originCitySlug === landing.slug)
                .map((r) => Number(r.originData.concertRideRange.match(/(\d+)/)?.[1] ?? ""))
                .filter((n) => Number.isFinite(n) && n > 0);
              return prices.length > 0 ? Math.min(...prices) : 3;
            })()} €/asiento. 0% comisión. Conductores verificados.`,
            inLanguage: "es-ES",
            touristType: { "@type": "Audience", audienceType: "Festival goers", geographicArea: { "@type": "Place", name: landing.display } },
            itinerary: {
              "@type": "ItemList",
              itemListElement: ROUTE_LANDINGS
                .filter((r) => r.originCitySlug === landing.slug)
                .slice(0, 5)
                .map((r, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  item: {
                    "@type": "Place",
                    name: r.festival.shortName,
                    address: { "@type": "PostalAddress", addressLocality: r.festival.city, addressCountry: "ES" },
                  },
                })),
            },
            offers: {
              "@type": "Offer",
              price: (() => {
                const prices = ROUTE_LANDINGS
                  .filter((r) => r.originCitySlug === landing.slug)
                  .map((r) => Number(r.originData.concertRideRange.match(/(\d+)/)?.[1] ?? ""))
                  .filter((n) => Number.isFinite(n) && n > 0);
                return prices.length > 0 ? Math.min(...prices) : 3;
              })(),
              priceCurrency: "EUR",
              seller: { "@type": "Organization", name: "ConcertRide", url: SITE_URL },
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowToTravelPage",
            name: `Cómo ir a conciertos en ${landing.display}`,
            url: `${SITE_URL}/conciertos/${landing.slug}`,
            inLanguage: "es-ES",
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: "Elige el festival o concierto",
                text: `Busca un concierto o festival en ${landing.display}. ConcertRide ofrece carpooling tanto para eventos locales como para festivales nacionales a los que ir desde ${landing.display}.`,
                url: `${SITE_URL}/conciertos/${landing.slug}`,
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: "Busca tu viaje compartido",
                text: `Abre ConcertRide, selecciona el concierto o festival y filtra por fecha. Verás todos los viajes publicados desde ${landing.display} y otras ciudades cercanas. Compara precio, horario y valoración del conductor.`,
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: "Reserva y viaja",
                text: `Confirma con el conductor mediante mensajes privados en ConcertRide. Presenta te el día del viaje en el lugar acordado. Disfruta del viaje y llega seguro al evento.`,
              },
              {
                "@type": "HowToStep",
                position: 4,
                name: "Paga y vuelve",
                text: `Paga al conductor en efectivo o Bizum el día del viaje. Valora tu experiencia. Busca un viaje de vuelta a ${landing.display} para el día siguiente si lo necesitas.`,
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: `Comparativa de transporte a conciertos en ${landing.display} ${year}`,
            description: `Precios, comisiones y disponibilidad nocturna de las opciones de transporte para llegar a conciertos y festivales en ${landing.display}. Datos orientativos ${year}.`,
            url: `${SITE_URL}/conciertos/${landing.slug}`,
            inLanguage: "es-ES",
            license: "https://creativecommons.org/licenses/by/4.0/",
            creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
            keywords: `transporte conciertos ${landing.display}, carpooling ${landing.display}, alternativa carpooling, taxi concierto ${landing.display}`,
            variableMeasured: [
              { "@type": "PropertyValue", name: "Opción de transporte", value: "ConcertRide carpooling" },
              { "@type": "PropertyValue", name: "Precio orientativo", value: "3–35 €/asiento" },
              { "@type": "PropertyValue", name: "Comisión de plataforma", value: "0 %" },
              { "@type": "PropertyValue", name: "Vuelta de madrugada", value: "Sí, coordinada" },
              { "@type": "PropertyValue", name: "Reserva anticipada", value: "Recomendada" },
            ],
            distribution: [
              {
                "@type": "DataDownload",
                name: "ConcertRide carpooling",
                contentUrl: `${SITE_URL}/conciertos/${landing.slug}`,
                encodingFormat: "text/html",
                description: `Precio: 3–35 €/asiento · Comisión: 0 % · Vuelta madrugada: Sí, coordinada · Reserva: Recomendada`,
              },
              {
                "@type": "DataDownload",
                name: "Otras plataformas de carpooling",
                contentUrl: `${SITE_URL}/conciertos/${landing.slug}`,
                encodingFormat: "text/html",
                description: `Precio: Similar a ConcertRide · Comisión: 12–18 % · Vuelta madrugada: Variable · Reserva: Recomendada`,
              },
              {
                "@type": "DataDownload",
                name: "Taxi / VTC",
                contentUrl: `${SITE_URL}/conciertos/${landing.slug}`,
                encodingFormat: "text/html",
                description: `Precio: 30–80 €/trayecto · Comisión: — · Vuelta madrugada: Sí (sobrecargo nocturno) · Reserva: No necesaria`,
              },
              {
                "@type": "DataDownload",
                name: "Autobús interurbano",
                contentUrl: `${SITE_URL}/conciertos/${landing.slug}`,
                encodingFormat: "text/html",
                description: `Precio: 5–20 € · Comisión: — · Vuelta madrugada: No (último ~23h) · Reserva: Recomendada`,
              },
              {
                "@type": "DataDownload",
                name: "Tren / AVE",
                contentUrl: `${SITE_URL}/conciertos/${landing.slug}`,
                encodingFormat: "text/html",
                description: `Precio: 10–60 € · Comisión: — · Vuelta madrugada: No (último ~01h) · Reserva: Obligatoria`,
              },
            ],
          }),
        }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav
          aria-label="Breadcrumb"
          className="font-mono text-[11px] text-cr-text-dim flex items-center gap-2"
        >
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/concerts" className="hover:text-cr-primary">Conciertos</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">{landing.display}</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2">
          <MapPin size={12} /> {landing.region}
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Conciertos en {landing.display} {year}.
        </h1>

        {(() => {
          const cityFestivalsForSpeakable = FESTIVAL_LANDINGS.filter((f) => f.citySlug === landing.slug);
          const nearbyFestivalsForSpeakable = FESTIVAL_LANDINGS.filter(
            (f) => f.citySlug !== landing.slug && f.originCities.some((oc) => oc.city === landing.display || oc.city === landing.city),
          );
          const festivalsForAnswer = (cityFestivalsForSpeakable.length > 0 ? cityFestivalsForSpeakable : nearbyFestivalsForSpeakable).slice(0, 3);
          const festivalNames = festivalsForAnswer.map((f) => f.shortName).join(", ");
          const venuesForAnswer = landing.venues.slice(0, 3).join(", ");
          const priceCandidates = ROUTE_LANDINGS
            .filter((r) => r.originCitySlug === landing.slug)
            .map((r) => Number(r.originData.concertRideRange.match(/(\d+)/)?.[1] ?? ""))
            .filter((n) => Number.isFinite(n) && n > 0);
          const minPrice = priceCandidates.length > 0 ? Math.min(...priceCandidates) : 3;
          const answerParts = [
            `En ${landing.display} ${year} hay conciertos y festivales programados`,
            venuesForAnswer ? ` en recintos como ${venuesForAnswer}.` : ".",
            ` ConcertRide ofrece carpooling desde ${minPrice} €/asiento`,
            festivalNames ? ` a festivales próximos como ${festivalNames}.` : " a festivales por toda España.",
            ` El pago se hace directo al conductor en efectivo o Bizum, sin comisión de plataforma. Conductores verificados con carnet de conducir y vuelta de madrugada coordinada.`,
          ];
          return (
            <SpeakableAnswerBlock
              schemaId={`speakable-city-${landing.slug}`}
              pageUrl={`${SITE_URL}/conciertos/${landing.slug}`}
              question={`¿Qué conciertos y festivales hay en ${landing.display} ${year}?`}
              answer={answerParts.join("")}
            />
          );
        })()}

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable">
          {landing.blurb}
        </p>

        {landing.venues.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {landing.venues.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1"
              >
                <Music2 size={10} /> {v}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-3">
          <Link
            to={`/concerts?city=${encodeURIComponent(landing.slug)}`}
            className="inline-flex items-center justify-center font-sans text-sm font-bold uppercase tracking-wider bg-cr-primary text-black px-5 py-3 shadow-[4px_4px_0_0_rgba(219,255,0,0.25)] hover:shadow-[6px_6px_0_0_rgba(219,255,0,0.4)] transition-shadow"
          >
            Buscar carpooling en {landing.display}
          </Link>
          <Link
            to="/publish"
            className="inline-flex items-center justify-center font-sans text-sm font-bold uppercase tracking-wider border-2 border-cr-border text-cr-text px-5 py-3 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            Publicar mi viaje
          </Link>
        </div>

        <AutoLinksForCity slug={landing.slug} />
      </div>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="font-display text-xl md:text-2xl uppercase mb-6">
          Próximos conciertos en {landing.display} {year}: agenda actualizada
        </h2>
        {concerts === null ? (
          <LoadingSpinner text={`Cargando conciertos en ${landing.display}…`} />
        ) : futureConcerts.length === 0 ? (
          <div className="border border-dashed border-cr-border p-10 text-center space-y-3">
            <p className="font-display text-xl uppercase text-cr-text-muted">
              Sin conciertos programados ahora mismo
            </p>
            <p className="font-sans text-sm text-cr-text-dim">
              Pronto añadiremos eventos. Mientras tanto:
            </p>
            <Link
              to="/concerts"
              className="inline-block font-sans text-sm font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-5 py-3 hover:bg-cr-primary hover:text-black transition-colors"
            >
              Ver todos los conciertos →
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

      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-12 space-y-6">
        <FactDensityCallout
          heading={`Datos clave · ${landing.display} ${year}`}
          facts={[
            { label: "Carpooling desde", value: "3 €/asiento", detail: "0 % comisión" },
            { label: "Próximos eventos", value: `${landing.venues.length} recintos`, detail: landing.venues.slice(0, 2).join(" · ") },
            { label: "Cobertura", value: "Toda España", detail: "Vuelta nocturna coordinada" },
          ]}
        />
        <h2 className="font-display text-xl md:text-2xl uppercase">
          Transporte para conciertos en {landing.display}: carpooling, bus, tren y taxi
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-3xl speakable">
          Comparativa real de precios y disponibilidad para llegar a conciertos y festivales desde {landing.display} {year}. El carpooling sin comisión es la opción más económica para distancias largas y la única con vuelta de madrugada coordinada.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-xs text-cr-text-muted border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-4 font-semibold text-cr-text uppercase tracking-[0.1em]">Opción</th>
                <th className="text-left py-2 pr-4 font-semibold text-cr-text uppercase tracking-[0.1em]">Precio típico</th>
                <th className="text-left py-2 pr-4 font-semibold text-cr-text uppercase tracking-[0.1em]">Comisión</th>
                <th className="text-left py-2 pr-4 font-semibold text-cr-text uppercase tracking-[0.1em]">Vuelta madrugada</th>
                <th className="text-left py-2 font-semibold text-cr-text uppercase tracking-[0.1em]">Reserva anticipada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border">
              <tr>
                <td className="py-2 pr-4 font-semibold text-cr-primary">ConcertRide</td>
                <td className="py-2 pr-4">3–35 €/asiento</td>
                <td className="py-2 pr-4 text-green-400">0 %</td>
                <td className="py-2 pr-4 text-green-400">Sí, coordinada</td>
                <td className="py-2">Recomendada</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Otras plataformas de carpooling</td>
                <td className="py-2 pr-4">Precio similar</td>
                <td className="py-2 pr-4 text-yellow-400">12–18 %</td>
                <td className="py-2 pr-4">Variable</td>
                <td className="py-2">Recomendada</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Taxi / VTC</td>
                <td className="py-2 pr-4">30–80 €/trayecto</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2 pr-4 text-yellow-400">Sí (sobrecargo)</td>
                <td className="py-2">No necesaria</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Autobús interurbano</td>
                <td className="py-2 pr-4">5–20 €</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2 pr-4 text-red-400">No (último ~23h)</td>
                <td className="py-2">Recomendada</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Tren / AVE</td>
                <td className="py-2 pr-4">10–60 €</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2 pr-4 text-red-400">No (último ~01h)</td>
                <td className="py-2">Obligatoria</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-xl md:text-2xl uppercase">
          Cómo reservar carpooling a conciertos en {landing.display} {year}: paso a paso
        </h2>
        <div className="grid md:grid-cols-3 gap-4 font-sans text-sm text-cr-text-muted leading-relaxed">
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">1. Busca el concierto en {landing.display}</h3>
            <p>
              Encuentra el evento al que vas en esta página. Cada ficha muestra cuántos viajes
              compartidos están ya publicados desde distintas ciudades de España.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">2. Elige carpooling a {landing.display}</h3>
            <p>
              Revisa precio por plaza, vibe (party/chill/mixed) y la valoración del conductor.
              Puedes ver qué otros pasajeros ya están confirmados.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">3. Viaja y paga al llegar a {landing.display}</h3>
            <p>
              Pagas al conductor en efectivo o Bizum el día del viaje. Recibes un recordatorio
              24h antes con la hora y el punto de encuentro.
            </p>
          </article>
        </div>

        <div className="pt-6 flex flex-wrap gap-4 border-t border-cr-border">
          <Link
            to="/concerts"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Ver todas las ciudades <ArrowRight size={12} />
          </Link>
          <Link
            to="/como-funciona"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Cómo funciona <ArrowRight size={12} />
          </Link>
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors ml-auto"
          >
            FAQ <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      {/* Festival hub for this city — rich cards for SEO + UX */}
      {(() => {
        const cityFestivals = FESTIVAL_LANDINGS.filter((f) => f.citySlug === landing.slug);
        const nearbyFestivals = FESTIVAL_LANDINGS.filter(
          (f) => f.citySlug !== landing.slug && f.originCities.some((oc) => oc.city === landing.display || oc.city === landing.city),
        ).slice(0, 3);

        if (cityFestivals.length === 0 && nearbyFestivals.length === 0) return null;
        return (
          <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-8">
            {cityFestivals.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl md:text-2xl uppercase">
                  Festivales en {landing.display} {year}: guías de transporte y carpooling
                </h2>
                <p className="font-sans text-sm text-cr-text-muted max-w-2xl">
                  Festivales que se celebran en {landing.display} este año. Haz clic para ver opciones de carpooling, bus y tren desde toda España.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cityFestivals.map((f) => (
                    <Link
                      key={f.slug}
                      to={`/festivales/${f.slug}`}
                      className="border border-cr-border p-5 space-y-3 hover:border-cr-primary/40 transition-colors"
                    >
                      <div>
                        <h3 className="font-display text-base uppercase">{f.shortName}</h3>
                        <p className="font-mono text-[11px] text-cr-text-muted">{f.typicalDates}</p>
                      </div>
                      <p className="font-sans text-xs text-cr-text-muted leading-relaxed line-clamp-2">
                        {f.blurb.slice(0, 120)}…
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-cr-primary">
                          Desde {f.originCities[0]?.concertRideRange ?? "3 €"}/asiento
                        </span>
                        <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">
                          Ver guía <ArrowRight size={10} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {nearbyFestivals.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-display text-xl uppercase">
                  Festivales cercanos: carpooling desde {landing.display}
                </h2>
                <p className="font-sans text-sm text-cr-text-muted max-w-2xl">
                  Festivales a los que ir desde {landing.display}. Conductores de {landing.display} ya publican viajes.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nearbyFestivals.map((f) => {
                    const fromHere = f.originCities.find(
                      (oc) => oc.city === landing.display || oc.city === landing.city,
                    );
                    return (
                      <Link
                        key={f.slug}
                        to={`/festivales/${f.slug}`}
                        className="border border-cr-border p-5 space-y-3 hover:border-cr-primary/40 transition-colors"
                      >
                        <div>
                          <h3 className="font-display text-base uppercase">{f.shortName}</h3>
                          <p className="font-mono text-[11px] text-cr-text-muted">{f.city} · {f.typicalDates}</p>
                        </div>
                        {fromHere && (
                          <div className="flex gap-3 font-mono text-[11px] text-cr-text-muted">
                            <span>{fromHere.km} km</span>
                            <span>·</span>
                            <span>{fromHere.drivingTime}</span>
                            <span>·</span>
                            <span className="text-cr-primary">{fromHere.concertRideRange}</span>
                          </div>
                        )}
                        <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">
                          Carpooling desde {landing.display} <ArrowRight size={10} />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        );
      })()}

      {/* Carpooling routes from this city → festivals — rich cards for high-intent SEO */}
      {(() => {
        const routesFromCity = ROUTE_LANDINGS.filter(
          (r) => r.originCitySlug === landing.slug,
        );
        if (routesFromCity.length === 0) return null;
        return (
          <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-5">
            <h2 className="font-display text-xl md:text-2xl uppercase">
              Rutas de carpooling desde {landing.display} a festivales {year}
            </h2>
            <p className="font-sans text-sm text-cr-text-muted max-w-2xl">
              Viajes compartidos publicados por conductores de {landing.display} hacia los principales festivales de España.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {routesFromCity.slice(0, 9).map((r) => (
                <Link
                  key={r.slug}
                  to={`/rutas/${r.slug}`}
                  className="border border-cr-border p-4 space-y-2 hover:border-cr-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-sm uppercase leading-tight">
                      {landing.display} → {r.festival.shortName}
                    </h3>
                    <span className="font-mono text-[11px] text-cr-primary shrink-0">
                      {r.originData?.concertRideRange ?? "desde 5 €"}
                    </span>
                  </div>
                  <div className="flex gap-3 font-mono text-[11px] text-cr-text-muted">
                    {r.originData?.km && <span>{r.originData.km} km</span>}
                    {r.originData?.km && <span>·</span>}
                    {r.originData?.drivingTime && <span>{r.originData.drivingTime}</span>}
                  </div>
                  <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">
                    Ver ruta <ArrowRight size={10} />
                  </span>
                </Link>
              ))}
            </div>
            {routesFromCity.length > 9 && (
              <p className="font-mono text-[11px] text-cr-text-dim">
                +{routesFromCity.length - 9} rutas más disponibles. <Link to="/rutas" className="text-cr-primary hover:underline">Ver todas las rutas →</Link>
              </p>
            )}
          </section>
        );
      })()}

      {/* ── FAQ — preguntas frecuentes sobre conciertos en la ciudad ── */}
      {cityFaqs.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Preguntas frecuentes sobre conciertos y carpooling en {landing.display} {year}
          </h2>
          <dl className="space-y-6">
            {cityFaqs.map((f) => (
              <div key={f.q} className="border-b border-cr-border pb-6 space-y-2">
                <dt className="font-display text-base uppercase text-cr-text">{f.q}</dt>
                <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Related blog posts — surface transport guides for this city */}
      {(() => {
        const cityName = landing.display.toLowerCase();
        const relatedPosts = BLOG_POSTS.filter((p) =>
          p.tags?.some((t: string) => t.toLowerCase().includes(cityName)) ||
          p.title.toLowerCase().includes(cityName) ||
          p.slug.includes(landing.slug)
        ).slice(0, 3);
        if (relatedPosts.length === 0) return null;
        return (
          <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-5">
            <h2 className="font-display text-xl md:text-2xl uppercase">
              Guías de transporte desde {landing.display}
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

      {/* Internal link hub to other city landings — helps SEO crawl + user nav */}
      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-10">
        <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
          Otras ciudades
        </h2>
        <ul className="flex flex-wrap gap-2">
          {CITY_LANDINGS.filter((c) => c.slug !== landing.slug).map((c) => (
            <li key={c.slug}>
              <Link
                to={`/conciertos/${c.slug}`}
                className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
              >
                {c.display}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Anon conversion CTA — visible only to non-logged-in users */}
      {!user && (
        <section
          className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-10"
          aria-label={`Encuentra carpooling para conciertos en ${landing.display}`}
        >
          <div className="border border-[#dbff00]/30 bg-[#dbff00]/5 p-6 md:p-8 space-y-4 text-center">
            <h2 className="font-display text-2xl md:text-3xl uppercase">
              ¿Buscas transporte para tu próximo concierto en {landing.display}?
            </h2>
            <p className="font-sans text-sm text-cr-text-muted max-w-xl mx-auto leading-relaxed">
              Encuentra carpooling gratis en ConcertRide. 0% comisión, conductores verificados,
              vuelta de madrugada coordinada.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Link
                to="/concerts"
                className="inline-flex items-center justify-center bg-[#dbff00] text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
              >
                Ver rutas disponibles
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-cr-border text-cr-text-muted px-6 py-3 hover:border-[#dbff00] hover:text-[#dbff00] transition-colors"
              >
                Crear cuenta gratis
              </Link>
            </div>
          </div>
        </section>
      )}

      <StickyRegBar />
    </main>
  );
}

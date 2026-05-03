import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, MapPin, Music2 } from "lucide-react";
import type { Concert } from "@concertride/types";
import { api } from "@/lib/api";
import { ConcertCard } from "@/components/ConcertCard";
import { LoadingSpinner } from "@/components/ui";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { REGION_ISO } from "@/lib/seoConfig";
import { CITY_LANDINGS, CITY_LANDINGS_BY_SLUG } from "@/lib/cityLandings";
import { FESTIVAL_LANDINGS } from "@/lib/festivalLandings";
import { ROUTE_LANDINGS } from "@/lib/routeLandings";
import { trackCityView } from "@/lib/seoEvents";

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
  const { city: slug } = useParams<{ city: string }>();
  const landing = slug ? CITY_LANDINGS_BY_SLUG[slug] : undefined;

  const [concerts, setConcerts] = useState<Concert[] | null>(null);

  const year = new Date().getFullYear();
  const nextYear = year + 1;

  // Per-city title/description overrides targeting top GSC queries
  const CITY_META_OVERRIDES: Record<string, { title: string; description: string; keywords?: string }> = {
    sevilla: {
      title: `Conciertos en Sevilla ${year}–${nextYear}: música, festivales y carpooling | ConcertRide`,
      description: `Próximos conciertos en Sevilla ${year}: La Cartuja (60.000 plazas), FIBES, Interestelar Sevilla, Icónica Fest. Carpooling sin comisión desde 3 €/asiento. Conductores verificados.`,
      keywords: `conciertos en Sevilla ${year}, conciertos Sevilla ${nextYear}, conciertos música Sevilla, conciertos y recitales Sevilla, próximos conciertos Sevilla, agenda musical Sevilla, concierto Sevilla, conciertos sevilla 2026, sevilla concierto, música en Sevilla, Interestelar Sevilla, Icónica Sevilla Fest, carpooling Sevilla festivales`,
    },
    donostia: {
      title: `Conciertos en Donostia ${year}: Jazzaldia, festivales y carpooling | ConcertRide`,
      description: `Próximos conciertos en Donostia–San Sebastián ${year}: Jazzaldia, Donostia Arena, Anoeta. Carpooling sin comisión a BBK Live (100 km) y Azkena Rock (100 km). Desde 4 €/asiento.`,
      keywords: `conciertos en Donostia ${year}, conciertos Donostia ${year}, conciertos San Sebastián ${year}, conciertos en donostia 2026, conciertos en San Sebastián, Jazzaldia ${year}, música en Donostia, carpooling BBK Live desde Donostia`,
    },
    alicante: {
      title: `Conciertos en Alicante ${year}: Plaza de Toros, festivales y carpooling | ConcertRide`,
      description: `Próximos conciertos en Alicante ${year}: Plaza de Toros, ADDA. Carpooling a Low Festival Benidorm (45 km), Arenal Sound (115 km), Viña Rock (165 km). Desde 3 €/asiento.`,
      keywords: `conciertos en Alicante ${year}, conciertos Alicante ${nextYear}, plaza de toros alicante conciertos ${year}, conciertos plaza toros alicante ${year}, carpooling Alicante festivales`,
    },
    bilbao: {
      title: `Conciertos en Bilbao ${year}: BBK Live, Kobetamendi y carpooling | ConcertRide`,
      description: `Conciertos en Bilbao ${year}: BBK Live (Kobetamendi, 9–11 jul), Bilbao Arena, Euskalduna. Carpooling desde Santander (4–7 €), Vitoria (4–6 €), Madrid (11–16 €). Sin comisión.`,
      keywords: `conciertos Bilbao ${year}, conciertos en Bilbao ${nextYear}, BBK Live ${year}, Kobetamendi, bilbao concert, como llegar BBK Live Bilbao, carpooling Bilbao festivales`,
    },
    zaragoza: {
      title: `Conciertos en Zaragoza ${year}: próximos conciertos y carpooling | ConcertRide`,
      description: `Próximos conciertos en Zaragoza ${year}: Pabellón Príncipe Felipe, Sala López, Pirineos Sur. Carpooling a Mad Cool (9–13 €), Primavera Sound (8–12 €), Arenal Sound (8–12 €). Sin comisión.`,
      keywords: `conciertos en Zaragoza ${year}, próximos conciertos Zaragoza, conciertos 2025 Zaragoza, conciertos Zaragoza ${nextYear}, Pabellón Príncipe Felipe, carpooling Zaragoza festivales`,
    },
    madrid: {
      title: `Conciertos en Madrid ${year}–${nextYear}: WiZink, IFEMA y carpooling | ConcertRide`,
      description: `Próximos conciertos en Madrid ${year}: WiZink Center, Vistalegre, IFEMA (Mad Cool), Caja Mágica. Carpooling sin comisión desde toda España. Desde 4 €/asiento, conductores verificados.`,
      keywords: `conciertos en Madrid ${year}, conciertos Madrid ${nextYear}, próximos conciertos Madrid, WiZink Center ${year}, Mad Cool Madrid, IFEMA conciertos, carpooling Madrid festivales, cómo llegar conciertos Madrid`,
    },
    barcelona: {
      title: `Conciertos en Barcelona ${year}: Primavera Sound, Sónar, Cruïlla | ConcertRide`,
      description: `Próximos conciertos en Barcelona ${year}: Primavera Sound (Fòrum, 28 may–1 jun), Sónar (Fira Montjuïc, 18–20 jun), Cruïlla (Fòrum, 9–12 jul). Carpooling desde Madrid (14–22 €). Sin comisión.`,
      keywords: `conciertos en Barcelona ${year}, conciertos Barcelona ${nextYear}, Primavera Sound ${year}, Sónar Barcelona, Cruïlla ${year}, carpooling Barcelona festivales, Palau Sant Jordi conciertos`,
    },
    valencia: {
      title: `Conciertos en Valencia ${year}: Zevra, Medusa, Arenal Sound | ConcertRide`,
      description: `Próximos conciertos en Valencia ${year}: Zevra Festival (La Marina), Arenal Sound (Burriana, 55 km), Medusa (Cullera, 40 km), FIB (Benicàssim, 75 km). Carpooling desde 3 €/asiento. Sin comisión.`,
      keywords: `conciertos en Valencia ${year}, conciertos Valencia ${nextYear}, Zevra Festival Valencia, Arenal Sound Valencia, Medusa Festival Valencia, carpooling Valencia festivales, festivales cerca Valencia`,
    },
    malaga: {
      title: `Conciertos en Málaga ${year}: Cala Mijas, La Cartuja y carpooling | ConcertRide`,
      description: `Próximos conciertos en Málaga ${year}: Cala Mijas Fest (Cortijo de Torres, 2–4 oct), Marenostrum (Fuengirola), Andalucía Big. Carpooling desde Sevilla (6–9 €), Madrid (12–16 €). Sin comisión.`,
      keywords: `conciertos en Málaga ${year}, Cala Mijas ${year}, Cortijo de Torres Málaga, carpooling Málaga festivales, festivales Málaga Costa del Sol`,
    },
    "a-coruna": {
      title: `Conciertos en A Coruña ${year}: Resurrection Fest y carpooling | ConcertRide`,
      description: `Próximos conciertos en A Coruña ${year}: Coliseum, Palexco. Carpooling a Resurrection Fest en Viveiro (100 km, 10–14 €) y O Son do Camiño en Santiago (85 km, 8–12 €). Sin comisión.`,
      keywords: `conciertos en A Coruña ${year}, Resurrection Fest carpooling, carpooling A Coruña Viveiro, O Son do Camiño carpooling, Coliseum A Coruña conciertos`,
    },
    pamplona: {
      title: `Conciertos en Pamplona ${year}: Navarra Arena y carpooling festivales | ConcertRide`,
      description: `Próximos conciertos en Pamplona ${year}: Navarra Arena (12.500), Anaitasuna. Carpooling a BBK Live (155 km, 5–8 €), Azkena Rock (95 km, 4–7 €), Mad Cool (390 km, 11–16 €). Sin comisión.`,
      keywords: `conciertos en Pamplona ${year}, conciertos Pamplona Navarra, Navarra Arena, carpooling Pamplona festivales, BBK Live desde Pamplona`,
    },
    "vitoria-gasteiz": {
      title: `Conciertos en Vitoria-Gasteiz ${year}: Azkena Rock y carpooling | ConcertRide`,
      description: `Próximos conciertos en Vitoria-Gasteiz ${year}: Azkena Rock Festival (Mendizabala, jun), Iradier Arena. Carpooling a BBK Live (65 km, 3–6 €), Sonorama (185 km, 7–11 €). Sin comisión.`,
      keywords: `conciertos en Vitoria ${year}, Azkena Rock ${year}, Mendizabala conciertos, carpooling Vitoria-Gasteiz festivales, BBK Live desde Vitoria`,
    },
    vigo: {
      title: `Conciertos en Vigo ${year}: carpooling Resurrection Fest y festivales | ConcertRide`,
      description: `Próximos conciertos en Vigo ${year}: Auditorio Mar de Vigo, Pabellón Multiusos. Carpooling a Resurrection Fest (200 km, 12–16 €), O Son do Camiño en Santiago (90 km, 8–12 €). Sin comisión.`,
      keywords: `conciertos en Vigo ${year}, Resurrection Fest desde Vigo, O Son do Camiño Vigo, Auditorio Mar de Vigo conciertos, carpooling Vigo festivales`,
    },
    murcia: {
      title: `Conciertos en Murcia ${year}: SOS 4.8, Medusa y carpooling | ConcertRide`,
      description: `Próximos conciertos en Murcia ${year}: SOS 4.8, Auditorio Víctor Villegas. Carpooling a Medusa (180 km, 8–12 €), Arenal Sound (250 km, 10–14 €), Viña Rock (155 km, 6–9 €). Sin comisión.`,
      keywords: `conciertos en Murcia ${year}, SOS 4.8 Murcia, Auditorio Víctor Villegas, carpooling Murcia festivales, Medusa Festival desde Murcia`,
    },
    valladolid: {
      title: `Conciertos en Valladolid ${year}: Sonorama y carpooling festivales | ConcertRide`,
      description: `Próximos conciertos en Valladolid ${year}: Plaza de Toros, Pabellón Pisuerga. Carpooling a Sonorama Ribera (100 km, 8–12 €), Mad Cool Madrid (200 km, 8–12 €). Sin comisión.`,
      keywords: `conciertos en Valladolid ${year}, Sonorama Ribera desde Valladolid, carpooling Valladolid festivales, Plaza de Toros Valladolid conciertos`,
    },
    granada: {
      title: `Conciertos en Granada ${year}: Granada Sound y carpooling | ConcertRide`,
      description: `Próximos conciertos en Granada ${year}: Granada Sound (Cortijo del Conde, septiembre). Carpooling a Cala Mijas (170 km, 6–9 €), Interestelar Sevilla (250 km, 8–12 €). Sin comisión.`,
      keywords: `conciertos en Granada ${year}, Granada Sound ${year}, Cortijo del Conde, carpooling Granada festivales, Cala Mijas desde Granada`,
    },
    "santiago-de-compostela": {
      title: `Conciertos en Santiago de Compostela ${year}: O Son do Camiño | ConcertRide`,
      description: `Próximos conciertos en Santiago ${year}: O Son do Camiño (Monte do Gozo, 18–20 jun, 90.000+). Carpooling desde A Coruña (10–12 €), Vigo (12–15 €), Madrid (20–30 €). Sin comisión.`,
      keywords: `conciertos en Santiago de Compostela ${year}, O Son do Camiño ${year}, Monte do Gozo, carpooling Santiago festivales, A Coruña Santiago carpooling`,
    },
  };

  const cityOverride = landing ? CITY_META_OVERRIDES[landing.slug] : undefined;

  useSeoMeta({
    title: landing
      ? cityOverride?.title ?? `Conciertos en ${landing.display} ${year}–${nextYear} — Carpooling sin comisión | ConcertRide`
      : "Conciertos por ciudad",
    description: landing
      ? cityOverride?.description ?? `Conciertos y festivales en ${landing.display} ${year}: ${landing.venues.slice(0, 2).join(", ")} y más. Carpooling sin comisión desde 3 €/asiento. Conductores verificados.`
      : "Explora conciertos por ciudad en España.",
    canonical: landing
      ? `${SITE_URL}/conciertos/${landing.slug}`
      : `${SITE_URL}/concerts`,
    keywords: landing
      ? cityOverride?.keywords ?? `conciertos en ${landing.display} ${year}, conciertos ${landing.display} ${nextYear}, agenda musical ${landing.display} ${year}, próximos conciertos ${landing.display}, conciertos música ${landing.display}, como ir a conciertos ${landing.display}, festivales ${landing.display}, carpooling ${landing.display} ${year}, coche compartido concierto ${landing.display}, cómo ir al concierto ${landing.display}, carpooling concierto ${landing.display}, viaje compartido ${landing.display} ${year}`
      : undefined,
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
        a: `Sí. En ConcertRide todos los conductores verifican su carnet de conducir antes de publicar un viaje. Puedes ver el perfil completo del conductor, sus valoraciones de otros pasajeros y comunicarte por chat antes del viaje. El pago siempre es en persona el día del evento — nunca adelantas dinero online. El modelo de gastos compartidos sin comisión está reconocido como legal en España por el Tribunal Supremo (caso BlaBlaCar, 2017).`,
      },
    ];
  }, [landing, year, nextYear]);

  if (!slug || !landing) return <Navigate to="/concerts" replace />;

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
                name: `${c.artist} — ${c.venue.name}`,
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
            name: `ConcertRide — Carpooling para conciertos en ${landing.display}`,
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
      </div>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="font-display text-xl md:text-2xl uppercase mb-6">
          Próximos conciertos en {landing.display}
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
              className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
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

      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-xl md:text-2xl uppercase">
          Cómo ir a un concierto en {landing.display}
        </h2>
        <div className="grid md:grid-cols-3 gap-4 font-sans text-sm text-cr-text-muted leading-relaxed">
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">1. Busca el concierto</h3>
            <p>
              Encuentra el evento al que vas en esta página. Cada ficha muestra cuántos viajes
              compartidos están ya publicados desde distintas ciudades de España.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">2. Elige un viaje</h3>
            <p>
              Revisa precio por plaza, vibe (party/chill/mixed) y la valoración del conductor.
              Puedes ver qué otros pasajeros ya están confirmados.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">3. Llega juntos</h3>
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

      {/* Festival hub for this city — internal linking to festival pages */}
      {(() => {
        const cityFestivals = FESTIVAL_LANDINGS.filter((f) => f.citySlug === landing.slug);
        if (cityFestivals.length === 0) return null;
        return (
          <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
            <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
              Festivales en {landing.display}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {cityFestivals.map((f) => (
                <li key={f.slug}>
                  <Link
                    to={`/festivales/${f.slug}`}
                    className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
                  >
                    Cómo ir a {f.shortName} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })()}

      {/* Carpooling routes from this city → festivals — high-intent SEO internal links */}
      {(() => {
        const routesFromCity = ROUTE_LANDINGS.filter(
          (r) => r.originCitySlug === landing.slug,
        );
        if (routesFromCity.length === 0) return null;
        return (
          <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
            <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
              Carpooling desde {landing.display} a festivales
            </h2>
            <ul className="flex flex-wrap gap-2">
              {routesFromCity.map((r) => (
                <li key={r.slug}>
                  <Link
                    to={`/rutas/${r.slug}`}
                    className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
                  >
                    {landing.display} → {r.festival.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })()}

      {/* ── FAQ — preguntas frecuentes sobre conciertos en la ciudad ── */}
      {cityFaqs.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Preguntas frecuentes — Conciertos en {landing.display}
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
    </main>
  );
}

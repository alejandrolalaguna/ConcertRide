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
import { ROUTE_LANDINGS_BY_SLUG } from "@/lib/routeLandings";
import { ROUTE_SEO_IMPROVEMENTS } from "@/lib/seoOverrides";
import { FestivalAlertWidget } from "@/components/FestivalAlertWidget";
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
      a: `El precio por asiento de ${originCity} a ${festival.shortName} está entre ${originData.concertRideRange}. El conductor fija el precio para cubrir combustible y peajes. Sin comisión: lo que ves es lo que pagas, en efectivo o Bizum el día del viaje.`,
    },
    {
      q: `¿Cuánto se tarda en coche de ${originCity} a ${festival.shortName}?`,
      a: `La distancia es de ${originData.km} km. El tiempo estimado de conducción es de ${originData.drivingTime} sin paradas. Con pausa de servicio y tráfico en la entrada al recinto, cuenta aproximadamente 30 min extra.`,
    },
    {
      q: `¿Hay carpooling de vuelta desde ${festival.shortName} a ${originCity}?`,
      a: `Sí. La mayoría de conductores publican el viaje de ida y vuelta. Busca en ConcertRide filtrando por "${festival.city}" y verás los viajes con hora de salida del festival.`,
    },
    {
      q: `¿Hay autobús directo de ${originCity} a ${festival.shortName}?`,
      a: `${originData.km < 50 ? `${originCity} y ${festival.city} están muy cerca (${originData.km} km), por lo que casi siempre hay autobuses urbanos o de cercanías que conectan ambas localidades en horario diurno.` : `No suele existir autobús directo de larga distancia ${originCity}–${festival.shortName}: las líneas de bus llegan a la ciudad cabecera del festival (${festival.city}) y de ahí hace falta lanzadera o taxi al recinto.`} El carpooling con ConcertRide (${originData.concertRideRange}) llega directamente al recinto y permite vuelta a cualquier hora.`,
    },
    {
      q: `¿Es seguro el carpooling a ${festival.shortName} con ConcertRide?`,
      a: `Todos los conductores verifican su carnet de conducir antes de publicar. Puedes ver su perfil completo, valoraciones de otros pasajeros y el chat del evento. El pago siempre es en persona — nunca adelantas dinero.`,
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
    subjectOf: { "@type": "MusicEvent", "@id": `${SITE_URL}/festivales/${festival.slug}#event` },
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
      "cssSelector": ["h1", ".route-summary", ".speakable", "p:first-of-type"],
    },
  };

  const jsonLdService = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/rutas/${landing.slug}#service`,
    name: `Carpooling ${originCity} → ${festival.shortName}`,
    description: `Servicio de coche compartido de ${originCity} a ${festival.name}. Sin comisión (0%). Conductores verificados. Pago en efectivo o Bizum.`,
    serviceType: "Carpooling",
    url: `${SITE_URL}/rutas/${landing.slug}`,
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ConcertRide ES",
    },
    areaServed: {
      "@type": "Country",
      name: "España",
      sameAs: "https://www.wikidata.org/wiki/Q29",
    },
    offers: {
      "@type": "Offer",
      name: `Asiento carpooling ${originCity} → ${festival.shortName}`,
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
      url: `${SITE_URL}/rutas/${landing.slug}`,
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

  const futureConcerts = (concerts ?? []).filter(
    (c) => new Date(c.date).getTime() > Date.now(),
  );

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdTrip) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowToTravel) }} />

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
          Detalles de la ruta
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Origen</h3>
            <p className="font-sans text-sm text-cr-text-muted">{originCity}</p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Destino</h3>
            <p className="font-sans text-sm text-cr-text-muted">{festival.venue}, {festival.city}</p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Precio estimado</h3>
            <p className="font-sans text-sm text-cr-text-muted">
              {originData.concertRideRange}. Sin comisión —
              el 100&nbsp;% va al conductor.
            </p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Distancia</h3>
            <p className="font-sans text-sm text-cr-text-muted">{originData.km} km por carretera</p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Tiempo</h3>
            <p className="font-sans text-sm text-cr-text-muted">{originData.drivingTime} de conducción estimada</p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Festival</h3>
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
          Conciertos en {festival.city}
        </h2>
        <p className="font-sans text-sm text-cr-text-muted mb-8 max-w-xl">
          Eventos próximos en {festival.city} con viajes desde {originCity}.
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
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
        <FestivalAlertWidget festivalSlug={festival.slug} festivalName={festival.shortName} />
      </section>

      {/* ── Transport comparison table — citable for "X vs Y" queries ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Comparativa de transporte {originCity} → {festival.shortName}
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
                <td className="py-2 pr-4">BlaBlaCar</td>
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
          Preguntas frecuentes
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
          Más información
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

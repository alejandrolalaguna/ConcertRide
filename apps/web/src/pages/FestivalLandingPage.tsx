import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, MapPin, Calendar, Users } from "lucide-react";
import type { Concert } from "@concertride/types";
import { api } from "@/lib/api";
import { ConcertCard } from "@/components/ConcertCard";
import { LoadingSpinner } from "@/components/ui";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { FESTIVAL_LANDINGS, FESTIVAL_LANDINGS_BY_SLUG } from "@/lib/festivalLandings";
import { ROUTE_LANDINGS } from "@/lib/routeLandings";

const FESTIVAL_DEFAULT_OG = `${SITE_URL}/og-fallback.png`;
import { trackFestivalView } from "@/lib/seoEvents";
import { FestivalAlertWidget } from "@/components/FestivalAlertWidget";

export default function FestivalLandingPage() {
  const { festival: slug } = useParams<{ festival: string }>();
  const festival = slug ? FESTIVAL_LANDINGS_BY_SLUG[slug] : undefined;

  const [concerts, setConcerts] = useState<Concert[] | null>(null);

  const festivalOgImage = festival?.ogImage ?? FESTIVAL_DEFAULT_OG;

  useSeoMeta({
    title: festival
      ? `Cómo ir a ${festival.shortName} ${new Date().getFullYear()} — Carpooling desde toda España`
      : "Festivales de música en España",
    description: festival
      ? `Carpooling a ${festival.name} desde ${festival.originCities.slice(0, 3).map((c) => c.city).join(", ")} y más ciudades. Precios desde ${festival.originCities[0]?.concertRideRange ?? "3 €"}/asiento. Sin taxi, sin comisión. Conductores verificados.`
      : "Carpooling a festivales de música en España con ConcertRide.",
    canonical: festival
      ? `${SITE_URL}/festivales/${festival.slug}`
      : `${SITE_URL}/concerts`,
    ogImage: festivalOgImage,
    ogType: "music.event",
    keywords: festival
      ? `cómo ir a ${festival.shortName}, cómo llegar a ${festival.shortName}, transporte ${festival.shortName}, carpooling ${festival.name}, coche compartido ${festival.shortName}, ${festival.shortName} ${festival.city}, viaje compartido ${festival.shortName} 2026, compartir coche ${festival.shortName}, alternativa taxi ${festival.shortName}, ir a ${festival.shortName} sin coche, precio carpooling ${festival.shortName}`
      : undefined,
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

  const jsonLdEvent = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: festival.name,
    url: `${SITE_URL}/festivales/${festival.slug}`,
    image: festivalOgImage,
    description: festival.blurb,
    startDate: festival.startDate,
    endDate: festival.endDate,
    location: festivalPlace,
    performer: {
      "@type": "PerformingGroup",
      name: festival.name,
    },
    organizer: {
      "@type": "Organization",
      name: festival.name,
    },
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    typicalAgeRange: "18-",
    inLanguage: "es",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/festivales/${festival.slug}`,
      price: festival.originCities[0]?.concertRideRange?.split("–")[0]?.replace(/[^0-9]/g, "") ?? "3",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString(),
      description: "Carpooling desde toda España con ConcertRide",
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
      repeatFrequency: "P1Y",
    },
    organizer: {
      "@type": "Organization",
      name: festival.name,
    },
    inLanguage: "es",
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Conciertos y festivales", item: `${SITE_URL}/concerts` },
      {
        "@type": "ListItem",
        position: 3,
        name: festival.name,
        item: `${SITE_URL}/festivales/${festival.slug}`,
      },
    ],
  };

  // FAQPage JSON-LD — emits the festival FAQs as structured data so AI engines
  // (Perplexity, ChatGPT, Google AI Overviews) can cite us for "cómo llegar a X",
  // "autobús a X", "tren a X" queries even when Google rich-results are gated.
  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-ES",
    mainEntity: festival.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSeries) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/concerts" className="hover:text-cr-primary">Conciertos</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">{festival.shortName}</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2">
          <MapPin size={12} /> {festival.region}
        </p>

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Cómo ir a<br />{festival.shortName} {new Date(festival.startDate).getFullYear()}.
        </h1>

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed">
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
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Cómo llegar a {festival.shortName}: localización y transporte
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
            <h3 className="font-display text-base uppercase text-cr-primary">Autobús / Bus</h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              Algunos festivales habilitan buses lanzadera oficiales desde la ciudad
              más cercana. Suelen tener plazas limitadas y horario diurno. Los autobuses
              de larga distancia (ALSA, FlixBus, Avanza) llegan a la estación urbana,
              no al recinto: hay que sumar taxi o lanzadera adicional.
              Consulta los detalles en las preguntas frecuentes.
            </p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Tren</h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              El AVE / Cercanías Renfe llega habitualmente a la estación más cercana,
              no al recinto del festival. La vuelta de madrugada en tren es casi siempre
              imposible: el último servicio sale antes de que termine el cabeza de cartel.
            </p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Coche propio</h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              Llegada directa al parking del festival, máxima flexibilidad de horario.
              Coste: combustible + peajes + parking (5–18 €/día). En recintos urbanos
              (IFEMA, Parc del Fòrum), el parking se satura los días de gran afluencia.
            </p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Coche compartido</h3>
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

      {/* ── Bus / autobús / tren targeted block — single source of truth for transport queries. ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-12 space-y-5">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Autobuses a {festival.shortName} {new Date(festival.startDate).getFullYear()}: bus, lanzadera y alternativas
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-3xl leading-relaxed">
          Resumen de las opciones de bus, autobús, lanzadera oficial y tren para llegar a{" "}
          <strong className="text-cr-text">{festival.name}</strong> en {festival.venue} ({festival.city}).
          Cuando no hay servicio público en horario de festival, la alternativa más usada es
          el coche compartido (carpooling) con ConcertRide.
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">
              ¿Hay autobús oficial a {festival.shortName}?
            </h3>
            <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
              Algunos festivales operan lanzaderas oficiales desde la ciudad cabecera
              ({festival.originCities[0]?.city}). Suelen funcionar en franjas de
              entrada y de regreso pero con plazas limitadas y sin cobertura nocturna
              completa. Mira los detalles ciudad por ciudad en las preguntas frecuentes.
            </p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">
              ¿Hay tren a {festival.shortName}?
            </h3>
            <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
              Renfe (AVE, Cercanías o Media Distancia) llega a la estación de{" "}
              {festival.city}, no al recinto. Hay que sumar lanzadera, taxi o
              caminata. La vuelta de madrugada en tren es prácticamente imposible
              en cualquier festival español.
            </p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">
              {festival.shortName} localización y dirección
            </h3>
            <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
              Dirección exacta: {festival.venueAddress}. Coordenadas GPS:{" "}
              {festival.lat.toFixed(4)}, {festival.lng.toFixed(4)}. Región:{" "}
              {festival.region}.
            </p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">
              Horarios de {festival.shortName}
            </h3>
            <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
              Fechas: {festival.typicalDates}. Los horarios de cada jornada se publican
              normalmente 2–4 semanas antes. La mayoría de festivales abren el recinto
              entre las 17:00 y las 19:00 y los conciertos terminan entre la 1:00 y
              las 5:00 de la madrugada.
            </p>
          </article>
        </div>

        <ul className="font-sans text-xs text-cr-text-muted space-y-1 max-w-3xl">
          <li>
            <strong className="text-cr-text">Autobús desde {festival.originCities[0]?.city}:</strong>{" "}
            {festival.originCities[0]?.km} km · {festival.originCities[0]?.drivingTime} ·{" "}
            carpooling desde {festival.originCities[0]?.concertRideRange ?? "3 €"}.
          </li>
          {festival.originCities.slice(1, 4).map((oc) => (
            <li key={oc.city}>
              <strong className="text-cr-text">Bus / coche desde {oc.city}:</strong>{" "}
              {oc.km} km · {oc.drivingTime} · carpooling desde {oc.concertRideRange}.
            </li>
          ))}
        </ul>
      </section>

      {/* ── Origin cities — Cómo llegar desde tu ciudad ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
        <h2 className="font-display text-2xl md:text-3xl uppercase mb-2">
          Precios de carpooling a {festival.shortName}
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

      {/* ── Viajes disponibles (dynamic) ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
        <h2 className="font-display text-2xl md:text-3xl uppercase mb-2">
          Viajes disponibles en {festival.city}
        </h2>
        <p className="font-sans text-sm text-cr-text-muted mb-8 max-w-xl">
          Conciertos y eventos en {festival.city} con viajes compartidos publicados.
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
          Por qué ir a {festival.shortName} con ConcertRide
        </h2>
        <div className="grid md:grid-cols-3 gap-4 font-sans text-sm text-cr-text-muted leading-relaxed">
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Sin intermediarios</h3>
            <p>
              El 100&nbsp;% del precio del asiento va al conductor. ConcertRide no cobra comisión,
              nunca. El pago es en efectivo o Bizum el día del viaje: económico, directo y sin sorpresas.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Conductores verificados</h3>
            <p>
              Todos los conductores verifican su carnet de conducir antes de publicar.
              Puedes ver sus valoraciones y reseñas de otros pasajeros.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Horario flexible</h3>
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
          Cómo reservar un viaje a {festival.shortName} en 4 pasos
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

      {/* ── FAQ ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Preguntas frecuentes — {festival.shortName}
        </h2>
        <dl className="space-y-6">
          {festival.faqs.map((faq) => (
            <div key={faq.q} className="border-b border-cr-border pb-6 space-y-2">
              <dt className="font-display text-base uppercase text-cr-text">{faq.q}</dt>
              <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">{faq.a}</dd>
            </div>
          ))}
        </dl>
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

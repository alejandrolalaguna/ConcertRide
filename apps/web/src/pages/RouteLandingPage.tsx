import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, MapPin, Clock, Euro, Calendar } from "lucide-react";
import type { Concert } from "@concertride/types";
import { api } from "@/lib/api";
import { ConcertCard } from "@/components/ConcertCard";
import { LoadingSpinner } from "@/components/ui";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ROUTE_LANDINGS_BY_SLUG } from "@/lib/routeLandings";
import { FestivalAlertWidget } from "@/components/FestivalAlertWidget";
import { trackRouteSearch } from "@/lib/seoEvents";

export default function RouteLandingPage() {
  const { route: slug } = useParams<{ route: string }>();
  const landing = slug ? ROUTE_LANDINGS_BY_SLUG[slug] : undefined;

  const [concerts, setConcerts] = useState<Concert[] | null>(null);

  useSeoMeta({
    title: landing
      ? `Carpooling ${landing.originCity} → ${landing.festival.shortName} 2026 — Viaje compartido`
      : "Ruta de carpooling",
    description: landing
      ? `Viaje compartido de ${landing.originCity} a ${landing.festival.name}. ${landing.originData.km} km · ${landing.originData.drivingTime} · desde ${landing.originData.concertRideRange}. Sin comisión, conductores verificados.`
      : "Carpooling a festivales en España.",
    canonical: landing ? `${SITE_URL}/rutas/${landing.slug}` : `${SITE_URL}/concerts`,
    keywords: landing
      ? `carpooling ${landing.originCity} ${landing.festival.shortName}, coche compartido ${landing.originCity} ${landing.festival.shortName}, viaje compartido ${landing.originCity} ${landing.festival.shortName}, cómo ir ${landing.festival.shortName} desde ${landing.originCity}`
      : undefined,
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

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Rutas", item: `${SITE_URL}/rutas` },
      { "@type": "ListItem", position: 3, name: `${originCity} → ${festival.shortName}`, item: `${SITE_URL}/rutas/${landing.slug}` },
    ],
  };

  const jsonLdTrip = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `Carpooling de ${originCity} a ${festival.name}`,
    description: `Viaje compartido de ${originCity} a ${festival.name}. ${originData.km} km, ${originData.drivingTime}, desde ${originData.concertRideRange}.`,
    url: `${SITE_URL}/rutas/${landing.slug}`,
    touristType: "Aficionados a la música",
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
    offers: {
      "@type": "Offer",
      price: (originData.concertRideRange.split("–")[0] ?? "3").replace(/[^0-9]/g, "") || "3",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/rutas/${landing.slug}`,
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `¿Cuánto cuesta el carpooling de ${originCity} a ${festival.shortName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `El precio por asiento de ${originCity} a ${festival.shortName} está entre ${originData.concertRideRange}. El conductor fija el precio para cubrir combustible y peajes sin obtener beneficio económico.`,
        },
      },
      {
        "@type": "Question",
        name: `¿Cuánto se tarda en coche de ${originCity} a ${festival.shortName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `La distancia de ${originCity} a ${festival.venue} es de aproximadamente ${originData.km} km. El tiempo estimado de conducción es de ${originData.drivingTime} sin paradas.`,
        },
      },
      {
        "@type": "Question",
        name: `¿Hay carpooling de vuelta desde ${festival.shortName} a ${originCity}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sí. Los conductores que publican el viaje de ida suelen publicar también el de vuelta, con salida entre 30 y 60 minutos después del fin del festival. Busca en ConcertRide filtrando por "${festival.city}" y marca la opción "con regreso".`,
        },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/festivales/${festival.slug}`} className="hover:text-cr-primary">{festival.shortName}</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">Desde {originCity}</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Carpooling · Ruta
        </p>

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          {originCity}<br />→ {festival.shortName}.
        </h1>

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed">
          Viaje compartido de {originCity} a {festival.name} ({festival.city}).
          Comparte coche, divide gastos y llega al festival sin taxi ni comisiones.
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
              {originData.concertRideRange} por asiento. Sin comisión —
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

      {/* ── FAQ ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Preguntas frecuentes
        </h2>
        <dl className="space-y-6">
          {[
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
              q: `¿Es seguro el carpooling a ${festival.shortName} con ConcertRide?`,
              a: `Todos los conductores verifican su carnet de conducir antes de publicar. Puedes ver su perfil completo, valoraciones de otros pasajeros y el chat del evento. El pago siempre es en persona — nunca adelantas dinero.`,
            },
          ].map((faq) => (
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

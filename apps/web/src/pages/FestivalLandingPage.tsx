import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, MapPin, Calendar, Users } from "lucide-react";
import type { Concert } from "@concertride/types";
import { api } from "@/lib/api";
import { ConcertCard } from "@/components/ConcertCard";
import { LoadingSpinner } from "@/components/ui";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { FESTIVAL_LANDINGS, FESTIVAL_LANDINGS_BY_SLUG } from "@/lib/festivalLandings";

export default function FestivalLandingPage() {
  const { festival: slug } = useParams<{ festival: string }>();
  const festival = slug ? FESTIVAL_LANDINGS_BY_SLUG[slug] : undefined;

  const [concerts, setConcerts] = useState<Concert[] | null>(null);

  useSeoMeta({
    title: festival
      ? `Cómo ir a ${festival.shortName} 2026 — Carpooling desde toda España`
      : "Festivales de música en España",
    description: festival
      ? `Carpooling a ${festival.name} desde ${festival.originCities.slice(0, 3).map((c) => c.city).join(", ")} y más ciudades. Precios desde ${festival.originCities[0]?.concertRideRange ?? "3 €"}/asiento. Sin taxi, sin comisión. Conductores verificados.`
      : "Carpooling a festivales de música en España con ConcertRide.",
    canonical: festival
      ? `https://concertride.es/festivales/${festival.slug}`
      : "https://concertride.es/concerts",
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
      .then((r) => setConcerts(r.concerts))
      .catch(() => setConcerts([]));
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
  };

  const jsonLdEvent = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: festival.name,
    url: `https://concertride.es/festivales/${festival.slug}`,
    description: festival.blurb,
    location: festivalPlace,
    organizer: {
      "@type": "Organization",
      name: festival.name,
    },
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    typicalAgeRange: "18-",
    inLanguage: "es",
  };

  const jsonLdSeries = {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: festival.name,
    url: `https://concertride.es/festivales/${festival.slug}`,
    description: festival.blurb,
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

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: festival.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://concertride.es/" },
      { "@type": "ListItem", position: 2, name: "Festivales", item: "https://concertride.es/concerts" },
      {
        "@type": "ListItem",
        position: 3,
        name: festival.name,
        item: `https://concertride.es/festivales/${festival.slug}`,
      },
    ],
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEvent) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSeries) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

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
          Cómo ir a<br />{festival.shortName}.
        </h1>

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed">
          {festival.blurb}
        </p>

        {/* Festival meta strip */}
        <div className="flex flex-wrap gap-4 pt-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1">
            <MapPin size={10} /> {festival.venue}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1">
            <Calendar size={10} /> {festival.typicalDates}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1">
            <Users size={10} /> {festival.capacity}
          </span>
        </div>
      </div>

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
          {festival.originCities.map((oc) => (
            <article
              key={oc.city}
              className="border border-cr-border p-4 space-y-2 hover:border-cr-primary/40 transition-colors"
            >
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
                frente a ~{Math.round(oc.km / 10 + 20)}–{Math.round(oc.km / 7 + 25)} € en taxi/VTC
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 p-4 border border-cr-primary/30 bg-cr-primary/5 space-y-1">
          <p className="font-sans text-xs text-cr-text-muted">
            <strong className="text-cr-text">Precios orientativos</strong> basados en tarifas reales publicadas en ConcertRide.
            El conductor fija el precio por asiento para cubrir combustible y peajes (tarifa MITECO de referencia).
          </p>
        </div>

        {/* Comparison: ConcertRide vs alternatives */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left border border-cr-border font-sans text-xs">
            <caption className="text-left font-sans text-[11px] text-cr-text-muted mb-2 pb-2">
              Comparativa de opciones de transporte a {festival.shortName}
            </caption>
            <thead>
              <tr className="border-b border-cr-border">
                <th className="py-2 px-3 font-semibold text-cr-text-muted uppercase tracking-wide">Opción</th>
                <th className="py-2 px-3 font-semibold text-cr-text-muted uppercase tracking-wide">Precio (ciudad cercana)</th>
                <th className="py-2 px-3 font-semibold text-cr-text-muted uppercase tracking-wide">Horario vuelta</th>
                <th className="py-2 px-3 font-semibold text-cr-text-muted uppercase tracking-wide">Reserva</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border">
              <tr className="bg-cr-primary/5">
                <td className="py-2 px-3 font-semibold text-cr-primary">ConcertRide</td>
                <td className="py-2 px-3 text-cr-text">{festival.originCities[0]?.concertRideRange ?? "3–15 €"}</td>
                <td className="py-2 px-3 text-cr-text">Flexible (acuerdo con el conductor)</td>
                <td className="py-2 px-3 text-cr-text">Gratuito, sin comisión</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-cr-text-muted">Taxi / VTC</td>
                <td className="py-2 px-3 text-cr-text-muted">30–90 € (ida)</td>
                <td className="py-2 px-3 text-cr-text-muted">Bajo demanda, caro de noche</td>
                <td className="py-2 px-3 text-cr-text-muted">App (Uber, Cabify, taxi)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-cr-text-muted">Autobús / tren</td>
                <td className="py-2 px-3 text-cr-text-muted">10–40 € (si existe)</td>
                <td className="py-2 px-3 text-cr-text-muted">Horarios fijos, escasos de noche</td>
                <td className="py-2 px-3 text-cr-text-muted">Renfe / empresa regional</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-cr-text-muted">Shuttle oficial festival</td>
                <td className="py-2 px-3 text-cr-text-muted">10–25 € (si hay)</td>
                <td className="py-2 px-3 text-cr-text-muted">Horarios limitados</td>
                <td className="py-2 px-3 text-cr-text-muted">Web del festival (se agota)</td>
              </tr>
            </tbody>
          </table>
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

      {/* ── Por qué ConcertRide para este festival ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Por qué ir a {festival.shortName} con ConcertRide
        </h2>
        <div className="grid md:grid-cols-3 gap-4 font-sans text-sm text-cr-text-muted leading-relaxed">
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Sin intermediarios</h3>
            <p>
              El 100&nbsp;% del precio del asiento va al conductor. ConcertRide no cobra comisión.
              El pago es en efectivo o Bizum el día del viaje.
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
              ni de taxis a precio de festival.
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
    </main>
  );
}

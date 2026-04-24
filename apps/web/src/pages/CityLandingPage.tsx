import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, MapPin, Music2 } from "lucide-react";
import type { Concert } from "@concertride/types";
import { api } from "@/lib/api";
import { ConcertCard } from "@/components/ConcertCard";
import { LoadingSpinner } from "@/components/ui";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { CITY_LANDINGS, CITY_LANDINGS_BY_SLUG } from "@/lib/cityLandings";
import { FESTIVAL_LANDINGS } from "@/lib/festivalLandings";

export default function CityLandingPage() {
  const { city: slug } = useParams<{ city: string }>();
  const landing = slug ? CITY_LANDINGS_BY_SLUG[slug] : undefined;

  const [concerts, setConcerts] = useState<Concert[] | null>(null);

  useSeoMeta({
    title: landing ? `Conciertos en ${landing.display} 2026` : "Conciertos por ciudad",
    description: landing
      ? `Todos los conciertos y festivales en ${landing.display}: ${landing.venues.slice(0, 3).join(", ")} y más. Carpooling para llegar desde cualquier ciudad de España, sin taxi ni comisiones.`
      : "Explora conciertos por ciudad en España.",
    canonical: landing
      ? `https://concertride.es/conciertos/${landing.slug}`
      : "https://concertride.es/concerts",
    keywords: landing
      ? `conciertos ${landing.display}, festivales ${landing.display}, carpooling ${landing.display}, coche compartido ${landing.display}, cómo ir al concierto ${landing.display}`
      : undefined,
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
      .then((r) => setConcerts(r.concerts))
      .catch(() => setConcerts([]));
  }, [landing]);

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
            url: `https://concertride.es/conciertos/${landing.slug}`,
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
              "@id": "https://concertride.es/#website",
              name: "ConcertRide ES",
              url: "https://concertride.es",
            },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: futureConcerts.length,
              itemListElement: futureConcerts.slice(0, 20).map((c, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://concertride.es/concerts/${c.id}`,
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
              { "@type": "ListItem", position: 1, name: "Inicio", item: "https://concertride.es/" },
              { "@type": "ListItem", position: 2, name: "Conciertos", item: "https://concertride.es/concerts" },
              {
                "@type": "ListItem",
                position: 3,
                name: landing.display,
                item: `https://concertride.es/conciertos/${landing.slug}`,
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
          Conciertos en {landing.display}.
        </h1>
        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed">
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
          Próximos conciertos
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

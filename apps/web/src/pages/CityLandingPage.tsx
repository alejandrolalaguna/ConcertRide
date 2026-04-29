import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, MapPin, Music2 } from "lucide-react";
import type { Concert } from "@concertride/types";
import { api } from "@/lib/api";
import { ConcertCard } from "@/components/ConcertCard";
import { LoadingSpinner } from "@/components/ui";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { CITY_LANDINGS, CITY_LANDINGS_BY_SLUG } from "@/lib/cityLandings";
import { FESTIVAL_LANDINGS } from "@/lib/festivalLandings";
import { ROUTE_LANDINGS } from "@/lib/routeLandings";
import { trackCityView } from "@/lib/seoEvents";

export default function CityLandingPage() {
  const { city: slug } = useParams<{ city: string }>();
  const landing = slug ? CITY_LANDINGS_BY_SLUG[slug] : undefined;

  const [concerts, setConcerts] = useState<Concert[] | null>(null);

  const year = new Date().getFullYear();
  const nextYear = year + 1;
  useSeoMeta({
    title: landing ? `Conciertos en ${landing.display} ${year}–${nextYear}` : "Conciertos por ciudad",
    description: landing
      ? `Próximos conciertos en ${landing.display} ${year} y ${nextYear}: ${landing.venues.slice(0, 3).join(", ")} y más. Carpooling para llegar desde cualquier ciudad de España, sin taxi ni comisiones.`
      : "Explora conciertos por ciudad en España.",
    canonical: landing
      ? `${SITE_URL}/conciertos/${landing.slug}`
      : `${SITE_URL}/concerts`,
    keywords: landing
      ? `conciertos en ${landing.display}, conciertos ${landing.display} ${year}, conciertos ${landing.display} ${nextYear}, próximos conciertos ${landing.display}, próximos conciertos en ${landing.display}, conciertos música ${landing.display}, conciertos y recitales ${landing.display}, concierto ${landing.display}, ${landing.display} concert, música ${landing.display}, festivales ${landing.display}, carpooling ${landing.display}, coche compartido ${landing.display}, cómo ir al concierto ${landing.display}`
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
              name: "ConcertRide ES",
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
                name: landing.display,
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
            "@type": "OnlineBusiness",
            "@id": `${SITE_URL}/conciertos/${landing.slug}#onlinebusiness`,
            name: `ConcertRide — Carpooling para conciertos en ${landing.display}`,
            description: landing.blurb,
            url: `${SITE_URL}/conciertos/${landing.slug}`,
            logo: `${SITE_URL}/favicon.svg`,
            image: `${SITE_URL}/og/home.png`,
            priceRange: "€3–€35",
            currenciesAccepted: "EUR",
            paymentAccepted: "Cash, Bizum",
            areaServed: {
              "@type": "City",
              name: landing.display,
              sameAs: `https://www.wikidata.org/wiki/Special:Search/${encodeURIComponent(landing.display)}`,
            },
            sameAs: [
              "https://twitter.com/concertride_es",
              "https://www.instagram.com/concertride_es/",
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
        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed">
          {landing.blurb}
        </p>

        <p className="font-sans text-xs text-cr-text-dim max-w-2xl leading-relaxed">
          También conocido como: conciertos {landing.display} {year}, conciertos {landing.display} {nextYear},
          próximos conciertos en {landing.display}, concierto {landing.display}, {landing.display} concierto,
          conciertos música {landing.display}, conciertos y recitales {landing.display}, música en {landing.display}.
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

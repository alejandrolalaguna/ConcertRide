import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Concert, Ride } from "@concertride/types";
import { api } from "@/lib/api";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { concertStatus } from "@/components/ConcertCard";
import { Hero } from "@/components/landing/Hero";
import { StatsBar } from "@/components/StatsBar";
import { HorizontalCarousel } from "@/components/landing/HorizontalCarousel";
import { HowItWorks } from "@/components/HowItWorks";
import { AdhocRidesSection } from "@/components/landing/AdhocRidesSection";
import { MapSection } from "@/components/landing/MapSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { IntelligencePrompts } from "@/components/IntelligencePrompts";
import { DemandSignalsBoard } from "@/components/DemandSignalsBoard";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { PastConcertsSection } from "@/components/landing/PastConcertsSection";

export default function LandingPage() {
  useSeoMeta({
    title: "ConcertRide · Carpooling para conciertos y festivales en España",
    // ≤160 chars, price + commission + flagship festivals up front for AI extraction.
    description:
      "Carpooling a conciertos y festivales en España desde 3 €/asiento, 0 % comisión. Mad Cool, Primavera Sound, Sónar, BBK Live. Conductores verificados.",
    canonical: `${SITE_URL}/`,
    keywords: "carpooling conciertos España, viajes compartidos festivales, autobuses festivales españa, bus festivales 2026, transporte a conciertos, coche compartido música, ride-sharing festivales, conciertos en madrid, conciertos en barcelona, conciertos en sevilla, conciertos en bilbao 2026, conciertos en donostia 2026, conciertos en zaragoza, viña rock buses, arenal sound como llegar, bbk santander, mad cool carpooling, primavera sound viaje compartido, deja tu coche en casa festival, carpooling sin comisiones, volver festival madrugada, ir al festival sin coche",
    ogType: "website",
    ogImageAlt: "ConcertRide: carpooling sin comisión a conciertos y festivales en España · Mad Cool, Primavera Sound, BBK Live",
  });

  const [concerts, setConcerts] = useState<Concert[] | null>(null);
  const [rides, setRides] = useState<Ride[] | null>(null);

  useEffect(() => {
    Promise.all([api.concerts.list({ limit: 50, date_from: new Date().toISOString() }), api.rides.list({})])
      .then(([c, r]) => {
        setConcerts(c.concerts);
        setRides(r.rides);
      })
      .catch(() => {
        setConcerts([]);
        setRides([]);
      });
  }, []);

  // Solo los 10 conciertos futuros más próximos. Hard date check — the server's
  // `date_from` uses lexicographic comparison which can leak same-day concerts
  // whose UTC instant has already passed when mixed with `+02:00` timezones.
  const activeConcerts = useMemo(() => {
    const nowMs = Date.now();
    const futuros = (concerts ?? [])
      .filter((c) => {
        const t = new Date(c.date).getTime();
        return Number.isFinite(t) && t > nowMs && concertStatus(c.date) === "upcoming";
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return futuros.slice(0, 10);
  }, [concerts]);

  // Mapa: conciertos próximos (90 días) + viajes activos con plazas para esos conciertos
  const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
  const mapConcerts = useMemo(() => {
    const nowMs = Date.now();
    const cutoffMs = nowMs + NINETY_DAYS_MS;
    return (concerts ?? [])
      .filter((c) => {
        const t = new Date(c.date).getTime();
        return t >= nowMs && t <= cutoffMs;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 20);
  }, [concerts]);

  const mapRides = useMemo(() => {
    const nearConcertIds = new Set(mapConcerts.map((c) => c.id));
    return (rides ?? []).filter(
      (r) => r.seats_left > 0 && r.status === "active" && nearConcertIds.has(r.concert_id),
    );
  }, [mapConcerts, rides]);

  return (
    <main id="main" className="bg-cr-bg text-cr-text">
      {/* Landing-level JSON-LD graph. The homepage already emits the site-wide
          Organization/WebSite in index.html; here we define the /#service entity
          (referenced by CollectionPage/Blog about fields across the site) and
          add an ItemList of upcoming concerts for LLMs + rich results crawlers. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": `${SITE_URL}/#service`,
            name: "ConcertRide · Carpooling para conciertos y festivales",
            description: "Plataforma española de carpooling exclusiva para conciertos y festivales de música. Conecta conductores y pasajeros que van al mismo evento. 0 % de comisión, conductores verificados, pago en efectivo o Bizum.",
            serviceType: "Carpooling",
            provider: { "@id": `${SITE_URL}/#organization` },
            areaServed: { "@type": "Country", name: "Spain", sameAs: "https://www.wikidata.org/wiki/Q29" },
            availableChannel: {
              "@type": "ServiceChannel",
              serviceUrl: SITE_URL,
              availableLanguage: ["Spanish", "es"],
            },
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "EUR",
              priceSpecification: {
                "@type": "PriceSpecification",
                description: "Sin comisión de plataforma — el precio lo fija el conductor para cubrir combustible y peajes",
              },
              seller: { "@id": `${SITE_URL}/#organization` },
            },
          }),
        }}
      />
      {activeConcerts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Próximos conciertos con viajes compartidos en España",
              itemListOrder: "https://schema.org/ItemListOrderAscending",
              numberOfItems: activeConcerts.length,
              itemListElement: activeConcerts.slice(0, 10).map((c, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${SITE_URL}/concerts/${c.id}`,
                name: `${c.artist} · ${c.venue.name}, ${c.venue.city}`,
              })),
            }),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Guías cómo llegar a festivales de música en España",
            description: "Guías de transporte con bus lanzadera, tren, metro y carpooling para los festivales más grandes de España",
            numberOfItems: 16,
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Cómo llegar a Mad Cool", url: `${SITE_URL}/como-llegar/mad-cool` },
              { "@type": "ListItem", position: 2, name: "Cómo llegar a Primavera Sound", url: `${SITE_URL}/como-llegar/primavera-sound` },
              { "@type": "ListItem", position: 3, name: "Cómo llegar a Viña Rock", url: `${SITE_URL}/como-llegar/vina-rock` },
              { "@type": "ListItem", position: 4, name: "Cómo llegar a BBK Live", url: `${SITE_URL}/como-llegar/bbk-live` },
              { "@type": "ListItem", position: 5, name: "Cómo llegar a Arenal Sound", url: `${SITE_URL}/como-llegar/arenal-sound` },
              { "@type": "ListItem", position: 6, name: "Cómo llegar a Resurrection Fest", url: `${SITE_URL}/como-llegar/resurrection-fest` },
              { "@type": "ListItem", position: 7, name: "Cómo llegar a FIB Benicàssim", url: `${SITE_URL}/como-llegar/fib` },
              { "@type": "ListItem", position: 8, name: "Cómo llegar a Medusa Festival", url: `${SITE_URL}/como-llegar/medusa-festival` },
              { "@type": "ListItem", position: 9, name: "Cómo llegar a Sónar", url: `${SITE_URL}/como-llegar/sonar` },
              { "@type": "ListItem", position: 10, name: "Cómo llegar a O Son do Camiño", url: `${SITE_URL}/como-llegar/o-son-do-camino` },
              { "@type": "ListItem", position: 11, name: "Cómo llegar a Cala Mijas", url: `${SITE_URL}/como-llegar/cala-mijas` },
              { "@type": "ListItem", position: 12, name: "Cómo llegar a Sonorama Ribera", url: `${SITE_URL}/como-llegar/sonorama-ribera` },
              { "@type": "ListItem", position: 13, name: "Cómo llegar a Zevra Festival", url: `${SITE_URL}/como-llegar/zevra-festival` },
              { "@type": "ListItem", position: 14, name: "Cómo llegar a Low Festival", url: `${SITE_URL}/como-llegar/low-festival` },
              { "@type": "ListItem", position: 15, name: "Cómo llegar a Cruïlla Barcelona", url: `${SITE_URL}/como-llegar/cruilla` },
              { "@type": "ListItem", position: 16, name: "Cómo llegar a Tomavistas Madrid", url: `${SITE_URL}/como-llegar/tomavistas` },
            ],
          }),
        }}
      />
      <Hero />
      <StatsBar />
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <IntelligencePrompts />
      </section>
      <section className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
        <DemandSignalsBoard limit={6} />
      </section>
      <section className="mx-auto max-w-3xl px-4 pb-8 sm:px-6">
        <LiveActivityFeed limit={8} layout="card" emptyMessage="Aún silencio. Sé el primero en publicar un viaje." />
      </section>
      {activeConcerts.length > 0 && <HorizontalCarousel concerts={activeConcerts} />}
      <HowItWorks />
      <AdhocRidesSection />
      {mapConcerts.length > 0 && <MapSection concerts={mapConcerts} rides={mapRides} />}
      <TrustSection />

      {/* Industry authority quotes — Princeton GEO Method 3 (Quotation Addition) */}
      <section className="border-t border-cr-border bg-cr-bg">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-6">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Fuentes y contexto
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <blockquote className="space-y-3 border-l-2 border-cr-primary/30 pl-4">
              <p className="font-sans text-sm text-cr-text-muted italic leading-relaxed">
                "El transporte de los asistentes supone el 80&nbsp;% de la huella de carbono de un festival.
                El carpooling es la acción individual más efectiva para reducirla."
              </p>
              <footer className="font-mono text-[10px] text-cr-text-dim">
                —{" "}
                <a href="https://juliesbicycle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
                  Julie's Bicycle Green Events Guide
                </a>
              </footer>
            </blockquote>
            <blockquote className="space-y-3 border-l-2 border-cr-primary/30 pl-4">
              <p className="font-sans text-sm text-cr-text-muted italic leading-relaxed">
                "España celebró más de 1.000 festivales con más de 25 millones de asistentes en 2024
                y una facturación que superó los 600 millones de euros."
              </p>
              <footer className="font-mono text-[10px] text-cr-text-dim">
                —{" "}
                <a href="https://www.apmusicales.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
                  Asociación de Promotores Musicales (APM)
                </a>
                , Informe 2024
              </footer>
            </blockquote>
            <blockquote className="space-y-3 border-l-2 border-cr-primary/30 pl-4">
              <p className="font-sans text-sm text-cr-text-muted italic leading-relaxed">
                "España figura entre los cinco mercados de música en vivo con mayor crecimiento
                de Europa en 2023–2024."
              </p>
              <footer className="font-mono text-[10px] text-cr-text-dim">
                —{" "}
                <a href="https://www.pollstar.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
                  Pollstar
                </a>
                , ranking europeo de música en directo
              </footer>
            </blockquote>
            <blockquote className="space-y-3 border-l-2 border-cr-primary/30 pl-4">
              <p className="font-sans text-sm text-cr-text-muted italic leading-relaxed">
                "El coche compartido puede reducir las emisiones de CO₂ por kilómetro y pasajero
                entre un 50&nbsp;% y un 75&nbsp;% frente al vehículo privado con un solo ocupante."
              </p>
              <footer className="font-mono text-[10px] text-cr-text-dim">
                —{" "}
                <a href="https://www.eea.europa.eu/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
                  European Environment Agency (EEA)
                </a>
                , Transport and Environment Report
              </footer>
            </blockquote>
            <blockquote className="space-y-3 border-l-2 border-cr-primary/30 pl-4">
              <p className="font-sans text-sm text-cr-text-muted italic leading-relaxed">
                "El Tribunal Supremo de España estableció en 2017 que el carpooling sin ánimo
                de lucro es legal: el conductor solo puede recuperar los gastos del viaje."
              </p>
              <footer className="font-mono text-[10px] text-cr-text-dim">
                —{" "}
                <a href="https://www.poderjudicial.es/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
                  Tribunal Supremo de España
                </a>
                , Sentencia 2017 (STS 3145/2017)
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Tabla comparativa de transporte — GEO citable ── */}
      <section aria-labelledby="comparativa-title" className="border-t border-cr-border bg-cr-bg">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-6">
          <header className="space-y-2">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
              Comparativa
            </p>
            <h2 id="comparativa-title" className="font-display text-2xl md:text-3xl uppercase leading-tight">
              ¿Cuánto cuesta llegar a un festival en España?
            </h2>
            <p className="font-sans text-sm text-cr-text-muted">
              Precios orientativos para trayectos de 150–300&nbsp;km (ej. Madrid → festival).
            </p>
          </header>

          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans border-collapse">
              <thead>
                <tr className="border-b border-cr-border">
                  <th className="text-left py-3 pr-6 font-semibold text-cr-text text-xs uppercase tracking-[0.1em]">Opción</th>
                  <th className="text-right py-3 px-4 font-semibold text-cr-text text-xs uppercase tracking-[0.1em]">Precio/persona</th>
                  <th className="text-right py-3 px-4 font-semibold text-cr-text text-xs uppercase tracking-[0.1em]">Comisión</th>
                  <th className="text-left py-3 pl-4 font-semibold text-cr-text text-xs uppercase tracking-[0.1em]">Vuelta de madrugada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cr-border">
                <tr className="bg-cr-primary/5">
                  <td className="py-3 pr-6 font-semibold text-cr-primary">ConcertRide</td>
                  <td className="py-3 px-4 text-right text-cr-text">5 – 20&nbsp;€</td>
                  <td className="py-3 px-4 text-right text-cr-primary font-semibold">0&nbsp;%</td>
                  <td className="py-3 pl-4 text-cr-text-muted">Sí, pactada con el conductor</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 text-cr-text">Otras plataformas</td>
                  <td className="py-3 px-4 text-right text-cr-text">8 – 25&nbsp;€</td>
                  <td className="py-3 px-4 text-right text-cr-text-muted">13–18&nbsp;%</td>
                  <td className="py-3 pl-4 text-cr-text-muted">Limitada (horarios fijos)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 text-cr-text">Bus oficial festival</td>
                  <td className="py-3 px-4 text-right text-cr-text">10 – 35&nbsp;€</td>
                  <td className="py-3 px-4 text-right text-cr-text-muted">Incluida</td>
                  <td className="py-3 pl-4 text-cr-text-muted">Solo última lanzadera</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 text-cr-text">Tren + bus</td>
                  <td className="py-3 px-4 text-right text-cr-text">15 – 50&nbsp;€</td>
                  <td className="py-3 px-4 text-right text-cr-text-muted">—</td>
                  <td className="py-3 pl-4 text-cr-text-muted">No (último tren nocturno)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 text-cr-text">Taxi / VTC</td>
                  <td className="py-3 px-4 text-right text-cr-text">40 – 120&nbsp;€</td>
                  <td className="py-3 px-4 text-right text-cr-text-muted">Incluida</td>
                  <td className="py-3 pl-4 text-cr-text-muted">Sí, pero precio elevado</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="font-mono text-[10px] text-cr-text-dim">
            Precios estimados para rutas de 150–300&nbsp;km (p. ej. Madrid–Albacete, Madrid–Valencia).
          </p>
        </div>
      </section>

      {/* ── Content hub — internal linking para SEO ── */}
      <section className="border-t border-cr-border bg-cr-bg">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-10">
          <div className="space-y-2">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
              Guías y recursos
            </p>
            <h2 className="font-display text-2xl md:text-3xl uppercase">
              Todo lo que necesitas saber
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Guía transporte */}
            <Link
              to="/guia-transporte-festivales"
              className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">Guía</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">
                Guía de transporte para festivales
              </h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
                Carpooling, lanzaderas, tren o taxi: cuándo usar cada opción y cómo ahorrar en el trayecto.
              </p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">
                Leer <ArrowRight size={11} />
              </span>
            </Link>

            {/* Vuelta madrugada */}
            <Link
              to="/blog/como-volver-festival-madrugada"
              className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">Guía</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">
                Cómo volver de un festival de madrugada
              </h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
                El último metro sale a la 1:30 y el festival acaba a las 2:30. Opciones reales sin pagar 90&nbsp;€ de taxi.
              </p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">
                Leer <ArrowRight size={11} />
              </span>
            </Link>

            {/* Rutas top */}
            <Link
              to="/rutas/madrid-mad-cool"
              className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">Ruta</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">
                Carpooling Madrid → Mad Cool
              </h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
                Precios, tiempo de conducción y horarios de vuelta para la ruta más popular a Mad Cool 2026.
              </p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">
                Ver ruta <ArrowRight size={11} />
              </span>
            </Link>

            <Link
              to="/rutas/madrid-primavera-sound"
              className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">Ruta</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">
                Carpooling Madrid → Primavera Sound
              </h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
                Madrid–Barcelona en coche compartido: 620 km, ~5 h 30 min, desde 14&nbsp;€/asiento.
              </p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">
                Ver ruta <ArrowRight size={11} />
              </span>
            </Link>

            <Link
              to="/como-funciona-carpooling"
              className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">Guía</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">
                Qué es el carpooling para conciertos
              </h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
                Respuesta directa, pasos numerados y comparación con taxi y autobús para entenderlo en un minuto.
              </p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">
                Leer <ArrowRight size={11} />
              </span>
            </Link>

            {/* <Link
              to="/comparativa/concertride-vs-blablacar"
              className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">Comparativa</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">
                ConcertRide vs BlaBlaCar
              </h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
                Comisión, especialización, pago y vuelta de madrugada: por qué ConcertRide encaja mejor en festivales.
              </p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">
                Leer <ArrowRight size={11} />
              </span>
            </Link> */}

            <Link
              to="/comparativa/carpooling-vs-taxi-festival"
              className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">Comparativa</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">
                Carpooling vs taxi en festivales
              </h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
                Un taxi de ida y vuelta supera los 50&nbsp;€. El carpooling sale entre 3 y 20&nbsp;€ por asiento según distancia.
              </p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">
                Leer <ArrowRight size={11} />
              </span>
            </Link>

            {/* Blog index */}
            <Link
              to="/blog"
              className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">Blog</p>
                <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">
                  Más artículos y guías
                </h3>
                <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
                  Comparativas, datos de sostenibilidad y todo lo que necesitas para ir a un festival en España.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary mt-3">
                Ver blog <ArrowRight size={11} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}

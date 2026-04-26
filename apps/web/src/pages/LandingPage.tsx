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
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { PastConcertsSection } from "@/components/landing/PastConcertsSection";

export default function LandingPage() {
  useSeoMeta({
    title: "ConcertRide ES — Carpooling para conciertos en España | Viajes compartidos",
    description:
      "Carpooling para conciertos en España. Comparte coche, divide gastos y llega seguro. Publica un viaje o busca uno en 2 minutos. Gratis, sin comisiones.",
    canonical: `${SITE_URL}/`,
    keywords: "carpooling conciertos España, viajes compartidos festivales, transporte a conciertos, coche compartido música, ride-sharing festivales, deja tu coche en casa festival, compartir coche festival España, carpooling sin comisiones, volver festival madrugada, movilidad sostenible festival, compartir gastos festival, ir al festival sin coche",
    ogType: "website",
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
          Organization/WebSite in index.html; here we add an ItemList of the
          upcoming concerts so LLMs + rich results crawlers can parse the
          inventory without rendering React. */}
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
                name: `${c.artist} — ${c.venue.name}, ${c.venue.city}`,
              })),
            }),
          }}
        />
      )}
      <Hero />
      <StatsBar />
      {activeConcerts.length > 0 && <HorizontalCarousel concerts={activeConcerts} />}
      <HowItWorks />
      <AdhocRidesSection />
      {mapConcerts.length > 0 && <MapSection concerts={mapConcerts} rides={mapRides} />}
      <TrustSection />

      {/* Industry authority quotes — Princeton GEO Method 3 (Quotation Addition) */}
      <section className="border-t border-cr-border bg-cr-bg">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 grid md:grid-cols-3 gap-6">
          <blockquote className="space-y-3">
            <p className="font-sans text-sm text-cr-text-muted italic leading-relaxed">
              "El transporte de los asistentes supone el 80 % de la huella de carbono de un festival.
              El carpooling es la acción individual más efectiva para reducirla."
            </p>
            <footer className="font-mono text-[10px] text-cr-text-dim">
              —{" "}
              <a href="https://juliesbicycle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
                Julie's Bicycle Green Events Guide
              </a>
            </footer>
          </blockquote>
          <blockquote className="space-y-3">
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
          <blockquote className="space-y-3">
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

      <TestimonialsSection />
      <FinalCTA />
    </main>
  );
}

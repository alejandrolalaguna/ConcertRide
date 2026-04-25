import { useEffect, useMemo, useState } from "react";
import type { Concert, Ride } from "@concertride/types";
import { api } from "@/lib/api";
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

const THREE_WEEKS_MS = 21 * 24 * 60 * 60 * 1000;
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

function concertStatus(date: string): "upcoming" | "passed" | "archived" {
  const diff = Date.now() - new Date(date).getTime();
  if (diff < 0) return "upcoming";
  if (diff < THREE_WEEKS_MS) return "passed";
  return "archived";
}

export function LandingPageIsland() {
  const [concerts, setConcerts] = useState<Concert[] | null>(null);
  const [rides, setRides] = useState<Ride[] | null>(null);

  useEffect(() => {
    Promise.all([
      api.concerts.list({ limit: 50, date_from: new Date().toISOString() }),
      api.rides.list({}),
    ])
      .then(([c, r]) => {
        setConcerts(c.concerts);
        setRides(r.rides);
      })
      .catch(() => {
        setConcerts([]);
        setRides([]);
      });
  }, []);

  const activeConcerts = useMemo(() => {
    const nowMs = Date.now();
    return (concerts ?? [])
      .filter((c) => {
        const t = new Date(c.date).getTime();
        return Number.isFinite(t) && t > nowMs && concertStatus(c.date) === "upcoming";
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 10);
  }, [concerts]);

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
      <Hero />
      <StatsBar />
      {activeConcerts.length > 0 && <HorizontalCarousel concerts={activeConcerts} />}
      <HowItWorks />
      <AdhocRidesSection />
      {mapConcerts.length > 0 && <MapSection concerts={mapConcerts} rides={mapRides} />}
      <TrustSection />

      <section className="border-t border-cr-border bg-cr-bg">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 grid md:grid-cols-3 gap-6">
          <blockquote className="space-y-3">
            <p className="font-sans text-sm text-cr-text-muted italic leading-relaxed">
              "El transporte de los asistentes supone el 80 % de la huella de carbono de un festival.
              El carpooling es la acción individual más efectiva para reducirla."
            </p>
            <footer className="font-mono text-[10px] text-cr-text-muted">
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
            <footer className="font-mono text-[10px] text-cr-text-muted">
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
            <footer className="font-mono text-[10px] text-cr-text-muted">
              —{" "}
              <a href="https://www.pollstar.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
                Pollstar
              </a>
              , ranking europeo de música en directo
            </footer>
          </blockquote>
        </div>
      </section>

      <TestimonialsSection />
      <FinalCTA />
    </main>
  );
}

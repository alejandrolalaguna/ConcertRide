import { useEffect, useMemo, useState } from "react";
import type { Concert, Ride } from "@concertride/types";
import { api } from "@/lib/api";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { concertStatus } from "@/components/ConcertCard";
import { Hero } from "@/components/landing/Hero";
import { StatsBar } from "@/components/StatsBar";
import { HorizontalCarousel } from "@/components/landing/HorizontalCarousel";
import { HowItWorks } from "@/components/HowItWorks";
import { AdhocRidesSection } from "@/components/landing/AdhocRidesSection";
import { MapSection } from "@/components/landing/MapSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { PastConcertsSection } from "@/components/landing/PastConcertsSection";

export default function LandingPage() {
  useSeoMeta({
    title: "ConcertRide ES — Comparte el viaje al concierto | España",
    description:
      "Encuentra o publica un viaje compartido para conciertos en España. Divide el coste, viaja seguro y llega al show. BlaBlaCar para conciertos.",
    canonical: "https://concertride.es/",
    ogType: "website",
  });

  const [concerts, setConcerts] = useState<Concert[] | null>(null);
  const [rides, setRides] = useState<Ride[] | null>(null);

  useEffect(() => {
    Promise.all([api.concerts.list({ limit: 50 }), api.rides.list({})])
      .then(([c, r]) => {
        setConcerts(c.concerts);
        setRides(r.rides);
      })
      .catch(() => {
        setConcerts([]);
        setRides([]);
      });
  }, []);

  // Solo los 10 conciertos futuros más próximos
  const activeConcerts = useMemo(() => {
    const futuros = (concerts ?? [])
      .filter((c) => concertStatus(c.date) !== "archived")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return futuros.slice(0, 10);
  }, [concerts]);

  return (
    <main id="main" className="bg-cr-bg text-cr-text">
      <Hero />
      <StatsBar />
      {activeConcerts.length > 0 && <HorizontalCarousel concerts={activeConcerts} />}
      <HowItWorks />
      <AdhocRidesSection />
      {activeConcerts.length > 0 && rides && (
        <MapSection concerts={activeConcerts} rides={rides} />
      )}
      <TrustSection />
      {/* Eliminada la sección de conciertos pasados */}
      <FinalCTA />
    </main>
  );
}

import { Navigate } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { useSession } from "@/lib/session";
import { MemoryArchive } from "@/components/MemoryArchive";
import { TravelStatsCard } from "@/components/TravelStatsCard";
import { FestivalHistoryList } from "@/components/FestivalHistoryList";

export default function MemoriasPage() {
  const { user, loading } = useSession();

  useSeoMeta({
    title: "Mis recuerdos · ConcertRide",
    description: "Tu archivo de viajes a conciertos: recap por año, vibe cards y stats.",
    canonical: `${SITE_URL}/memorias`,
    noindex: true,
  });

  if (!loading && !user) return <Navigate to="/login?next=/memorias" replace />;
  if (loading || !user) return null;

  return (
    <main id="main" className="min-h-dvh bg-cr-bg pt-14 text-cr-text">
      <header className="border-b border-cr-border px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cr-text-muted">
            archivo personal
          </p>
          <h1 className="mt-2 font-display text-4xl uppercase leading-tight">Mis recuerdos</h1>
          <p className="mt-2 max-w-prose text-sm text-cr-text-muted">
            Cada viaje completado se convierte en una vibe card para compartir o guardar.
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6">
        <TravelStatsCard year={new Date().getUTCFullYear()} />
        <FestivalHistoryList />
        <MemoryArchive userScope />
      </div>
    </main>
  );
}

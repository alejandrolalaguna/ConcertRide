import { Suspense, lazy } from "react";
import type { Concert, Ride } from "@concertride/types";
import { PulsingDot } from "@/components/LoadingStates";

const MapView = lazy(() => import("@/components/MapView"));

interface Props {
  concerts: Concert[];
  rides: Ride[];
}

export function MapSection({ concerts, rides }: Props) {
  return (
    <section aria-labelledby="map-title" className="space-y-5 border-t border-cr-border">
      <header className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 space-y-4">
        <div className="flex items-center gap-3">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            En vivo
          </p>
          <PulsingDot label="En tiempo real" />
        </div>
        <div className="flex items-end justify-between gap-4">
          <h2
            id="map-title"
            className="font-display text-3xl md:text-5xl uppercase leading-[0.95]"
          >
            Viajes activos
            <br />
            ahora mismo.
          </h2>
          <div className="font-mono text-xs text-cr-text-muted text-right hidden sm:block pb-1">
            <p>
              <span className="text-cr-primary font-semibold">{concerts.length}</span> conciertos
            </p>
            <p>
              <span className="text-cr-secondary font-semibold">{rides.length}</span> viajes
            </p>
          </div>
        </div>
        <p className="font-mono text-xs text-cr-text-dim max-w-md">
          Filtra por ciudad. Haz clic en un concierto para ver los viajes disponibles.
        </p>
      </header>

      <Suspense
        fallback={
          <div
            aria-hidden="true"
            className="h-[60vh] min-h-[420px] w-full bg-cr-surface border-y border-cr-border flex items-center justify-center"
          >
            <PulsingDot label="Cargando mapa" />
          </div>
        }
      >
        <MapView concerts={concerts} rides={rides} />
      </Suspense>
    </section>
  );
}

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
      <header className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 space-y-3">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          En vivo
        </p>
        <div className="flex items-end justify-between gap-4">
          <h2 id="map-title" className="font-display text-3xl md:text-5xl uppercase leading-[0.95]">
            Viajes activos
            <br />
            ahora mismo.
          </h2>
          <PulsingDot label="En tiempo real" />
        </div>
      </header>

      <Suspense
        fallback={
          <div
            aria-hidden="true"
            className="h-[60vh] w-full bg-cr-surface border-y border-cr-border flex items-center justify-center"
          >
            <div className="font-mono text-xs text-cr-text-muted">
              <PulsingDot label="Cargando mapa" />
            </div>
          </div>
        }
      >
        <MapView concerts={concerts} rides={rides} />
      </Suspense>
    </section>
  );
}

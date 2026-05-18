import { Suspense, lazy } from "react";
import type { Concert, Ride } from "@concertride/types";
import { PulsingDot } from "@/components/LoadingStates";
import { MapPin, Navigation } from "lucide-react";

const MapView = lazy(() => import("@/components/MapView"));

interface Props {
  concerts: Concert[];
  rides: Ride[];
}

export function MapSection({ concerts, rides }: Props) {
  return (
    <section aria-labelledby="map-title" className="relative overflow-hidden" style={{ backgroundColor: "#080808" }}>
      {/* Subtle background: aerial city lights */}
      <img
        aria-hidden="true"
        src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&q=50&auto=format&fit=crop"
        alt=""
        width={1400}
        height={800}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.05] pointer-events-none"
      />
      {/* Top lime bloom */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(219,255,0,0.06) 0%, transparent 65%)" }}
      />

      {/* Header */}
      <header className="relative max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-8 space-y-6">
        {/* Top row — live indicator + counts */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <PulsingDot label="En tiempo real" />
            <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.18em]">
              En vivo
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 border border-white/[0.08] bg-white/[0.02] px-3 py-1.5">
              <MapPin size={11} className="text-[#dbff00]" aria-hidden="true" />
              <span className="font-mono text-[10px] text-white/50">
                <span className="text-[#dbff00] font-semibold">{concerts.length}</span>
                {" "}conciertos
              </span>
            </div>
            <div className="flex items-center gap-1.5 border border-white/[0.08] bg-white/[0.02] px-3 py-1.5">
              <Navigation size={11} className="text-[#ff4f00]" aria-hidden="true" />
              <span className="font-mono text-[10px] text-white/50">
                <span className="text-[#ff4f00] font-semibold">{rides.length}</span>
                {" "}viajes activos
              </span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div>
          <h2
            id="map-title"
            className="font-display text-4xl lg:text-6xl uppercase tracking-tight leading-[0.88]"
          >
            Viajes activos
            <br />
            <span className="text-[#dbff00]">ahora mismo.</span>
          </h2>
          <p className="font-mono text-xs text-white/30 mt-4 max-w-md">
            Filtra por ciudad. Haz clic en un concierto para ver los viajes disponibles.
          </p>
        </div>

        {/* Scan divider */}
        <div
          aria-hidden="true"
          className="h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(219,255,0,0.25) 30%, rgba(219,255,0,0.5) 50%, rgba(219,255,0,0.25) 70%, transparent)" }}
        />
      </header>

      {/* Map */}
      <div className="relative">
        {/* Top fade into map */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-8 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, #080808, transparent)" }}
        />
        <Suspense
          fallback={
            <div
              aria-hidden="true"
              className="h-[60vh] min-h-[420px] w-full flex items-center justify-center"
              style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div className="flex flex-col items-center gap-3">
                <PulsingDot label="Cargando mapa" />
                <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">
                  Cargando mapa
                </span>
              </div>
            </div>
          }
        >
          <MapView concerts={concerts} rides={rides} />
        </Suspense>
        {/* Bottom fade out of map */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-12 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to top, #080808, transparent)" }}
        />
      </div>
    </section>
  );
}

import { useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { Concert, Ride } from "@concertride/types";
import { formatDay } from "@/lib/format";
import "./MapView.css";

const SPAIN_CENTER: [number, number] = [40.4168, -3.7038];
const SPAIN_BOUNDS: L.LatLngBoundsLiteral = [
  [35.9, -9.5],
  [43.8, 4.4],
];

// CartoDB Dark Matter — natively dark tiles, no CSS hack needed.
// Attribution required: OSM ODbL + CARTO terms.
const TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const concertIcon = L.divIcon({
  className: "cr-marker-wrapper",
  html: '<span class="cr-marker-concert" aria-hidden="true"></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const originIcon = L.divIcon({
  className: "cr-marker-wrapper",
  html: '<span class="cr-marker-origin" aria-hidden="true"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface Props {
  concerts: Concert[];
  rides: Ride[];
}

function CloseOnMapClick({
  onClose,
  skipRef,
}: {
  onClose: () => void;
  skipRef: React.RefObject<number>;
}) {
  useMapEvents({
    click: () => {
      if (Date.now() - (skipRef.current ?? 0) > 80) onClose();
    },
  });
  return null;
}

export default function MapView({ concerts, rides }: Props) {
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const justOpenedRef = useRef<number>(0);

  const cities = useMemo(() => {
    const set = new Set(concerts.map((c) => c.venue.city));
    return Array.from(set).sort();
  }, [concerts]);

  const visibleConcerts = useMemo(() => {
    if (!activeCity) return concerts;
    return concerts.filter((c) => c.venue.city === activeCity);
  }, [concerts, activeCity]);

  const visibleOrigins = useMemo(() => {
    if (!activeCity) return rides;
    const visibleIds = new Set(visibleConcerts.map((c) => c.id));
    return rides.filter((r) => visibleIds.has(r.concert_id));
  }, [rides, visibleConcerts, activeCity]);

  const ridesByConcert = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of rides) map[r.concert_id] = (map[r.concert_id] ?? 0) + 1;
    return map;
  }, [rides]);

  return (
    <div className="cr-map relative h-[60vh] min-h-[420px] w-full border-y border-cr-border">
      <MapContainer
        center={SPAIN_CENTER}
        zoom={6}
        maxBounds={SPAIN_BOUNDS}
        minZoom={5}
        maxZoom={12}
        scrollWheelZoom={false}
        attributionControl
        className="h-full w-full"
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} subdomains="abcd" />
        <CloseOnMapClick
          onClose={() => setSelectedConcert(null)}
          skipRef={justOpenedRef}
        />

        {visibleConcerts.map((c) => (
          <Marker
            key={c.id}
            position={[c.venue.lat, c.venue.lng]}
            icon={concertIcon}
            title={`${c.artist} — ${c.venue.city}`}
            eventHandlers={{
              click: () => {
                justOpenedRef.current = Date.now();
                setSelectedConcert(c);
              },
            }}
          />
        ))}

        {visibleOrigins.map((r) => (
          <Marker
            key={r.id}
            position={[r.origin_lat, r.origin_lng]}
            icon={originIcon}
            title={`Salida desde ${r.origin_city}`}
          />
        ))}
      </MapContainer>

      {/* City filter chips */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap gap-1.5 pointer-events-none">
        <div className="pointer-events-auto flex flex-wrap gap-1.5">
          <FilterChip active={activeCity === null} onClick={() => setActiveCity(null)}>
            Todos
          </FilterChip>
          {cities.map((city) => (
            <FilterChip
              key={city}
              active={activeCity === city}
              onClick={() => setActiveCity(city)}
            >
              {city}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute bottom-8 left-3 z-[1000] pointer-events-none">
        <div className="bg-cr-bg/85 backdrop-blur border border-cr-border/60 px-3 py-1.5 font-mono text-[10px] flex gap-3">
          <span>
            <span className="text-cr-primary font-semibold">{visibleConcerts.length}</span>{" "}
            <span className="text-cr-text-muted">conciertos</span>
          </span>
          <span className="text-cr-border">·</span>
          <span>
            <span className="text-cr-secondary font-semibold">{visibleOrigins.length}</span>{" "}
            <span className="text-cr-text-muted">viajes</span>
          </span>
        </div>
      </div>

      {/* Concert detail popup */}
      {selectedConcert && (
        <div className="absolute bottom-3 right-3 z-[1000] w-[min(300px,calc(100vw-24px))] bg-cr-surface/96 backdrop-blur-md border border-cr-border pointer-events-auto shadow-[0_0_32px_rgba(0,0,0,0.8)]">
          <button
            type="button"
            onClick={() => setSelectedConcert(null)}
            className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center font-mono text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>

          {selectedConcert.image_url && (
            <div className="h-28 overflow-hidden">
              <img
                src={selectedConcert.image_url}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 h-28 bg-gradient-to-b from-transparent to-cr-surface/80" />
            </div>
          )}

          <div className="p-4 space-y-2">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-cr-primary flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cr-primary inline-block animate-pulse" />
              {ridesByConcert[selectedConcert.id] ?? 0} viajes activos
            </p>
            <h3 className="font-display text-xl uppercase leading-tight pr-6">
              {selectedConcert.artist}
            </h3>
            <p className="font-mono text-[11px] text-cr-text-muted">
              {selectedConcert.venue.name}
            </p>
            <p className="font-mono text-[11px] text-cr-text-muted">
              {formatDay(selectedConcert.date)}
              {selectedConcert.price_min != null && (
                <span className="text-cr-secondary ml-2">· desde €{selectedConcert.price_min}</span>
              )}
            </p>
            <a
              href={`/concerts/${selectedConcert.id}`}
              className="mt-2 w-full flex items-center justify-center font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black py-2.5 hover:bg-cr-primary/90 transition-colors"
            >
              Ver viajes →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] px-2.5 py-1 border transition-colors ${
        active
          ? "bg-cr-primary text-black border-cr-primary"
          : "bg-cr-bg/85 backdrop-blur text-cr-text-muted border-cr-border hover:border-cr-primary hover:text-cr-primary"
      }`}
    >
      {children}
    </button>
  );
}

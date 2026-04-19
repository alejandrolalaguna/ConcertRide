import { useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { Concert, Ride } from "@concertride/types";
import { formatDay } from "@/lib/format";
import "./MapView.css";

const SPAIN_CENTER: [number, number] = [40.4168, -3.7038];
const SPAIN_BOUNDS: L.LatLngBoundsLiteral = [
  [35.9, -9.5],
  [43.8, 4.4],
];

const concertIcon = L.divIcon({
  className: "cr-marker-wrapper",
  html: '<span class="cr-marker-concert" aria-hidden="true"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const originIcon = L.divIcon({
  className: "cr-marker-wrapper",
  html: '<span class="cr-marker-origin" aria-hidden="true"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface Props {
  concerts: Concert[];
  rides: Ride[];
}

export default function MapView({ concerts, rides }: Props) {
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);

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

  return (
    <div className="cr-map relative h-[60vh] w-full border-y border-cr-border">
      <MapContainer
        center={SPAIN_CENTER}
        zoom={6}
        maxBounds={SPAIN_BOUNDS}
        minZoom={5}
        scrollWheelZoom={false}
        attributionControl
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {visibleConcerts.map((c) => (
          <Marker
            key={c.id}
            position={[c.venue.lat, c.venue.lng]}
            icon={concertIcon}
            title={`${c.artist} — ${c.venue.city}`}
            eventHandlers={{ click: () => setSelectedConcert(c) }}
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

      <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2 pointer-events-none">
        <div className="pointer-events-auto flex flex-wrap gap-2">
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

      {selectedConcert && (
        <div className="absolute bottom-3 left-3 right-3 md:left-auto md:right-3 md:w-80 bg-cr-surface/95 backdrop-blur-md border border-cr-border p-4 space-y-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setSelectedConcert(null)}
            className="absolute top-2 right-2 font-mono text-xs text-cr-text-muted hover:text-cr-primary"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-primary">
            Viajes activos
          </p>
          <h3 className="font-display text-lg uppercase leading-tight pr-6 truncate">
            {selectedConcert.artist}
          </h3>
          <p className="font-mono text-xs text-cr-text-muted">
            {selectedConcert.venue.name} · {formatDay(selectedConcert.date)}
          </p>
          <p className="font-mono text-xs text-cr-primary">
            {selectedConcert.active_rides_count} viajes · desde €{selectedConcert.price_min ?? "?"}
          </p>
          <a
            href={`/concerts/${selectedConcert.id}`}
            className="inline-block mt-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text hover:text-cr-primary border-b border-cr-primary/40 pb-0.5"
          >
            Ver viajes →
          </a>
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
      className={`font-sans text-[11px] font-semibold uppercase tracking-[0.12em] px-3 py-1.5 border transition-colors ${
        active
          ? "bg-cr-primary text-black border-cr-primary"
          : "bg-cr-surface/80 backdrop-blur text-cr-text-muted border-cr-border hover:border-cr-primary hover:text-cr-primary"
      }`}
    >
      {children}
    </button>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, ZoomControl, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import type { Concert, Ride } from "@concertride/types";
import { formatDay, formatTime } from "@/lib/format";
import "./MapView.css";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

const SPAIN_CENTER: [number, number] = [40.4168, -3.7038];
const SPAIN_BOUNDS: L.LatLngBoundsLiteral = [
  [35.9, -9.5],
  [43.8, 4.4],
];

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

function CtrlScrollZoom() {
  const map = useMap();
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    containerRef.current = map.getContainer();
    const el = containerRef.current;

    function onWheel(e: WheelEvent) {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -1 : 1;
        map.setZoom(map.getZoom() + delta, { animate: true });
      }
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [map]);

  return null;
}

function CtrlHint() {
  const map = useMap();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = map.getContainer();
    function onWheel(e: WheelEvent) {
      if (!e.ctrlKey) {
        setVisible(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setVisible(false), 1500);
      }
    }
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, [map]);

  if (!visible) return null;
  return (
    <div className="absolute inset-0 z-[999] flex items-center justify-center pointer-events-none">
      <div className="bg-cr-bg/90 backdrop-blur border border-cr-border px-4 py-2 font-mono text-xs text-cr-text-muted">
        Mantén <kbd className="font-sans text-[10px] border border-cr-border px-1 py-0.5 text-cr-primary">Ctrl</kbd> para hacer zoom
      </div>
    </div>
  );
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
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const justOpenedRef = useRef<number>(0);

  function closeAll() {
    setSelectedConcert(null);
    setSelectedRide(null);
  }
  function openConcert(c: Concert) {
    justOpenedRef.current = Date.now();
    setSelectedRide(null);
    setSelectedConcert(c);
  }
  function openRide(r: Ride) {
    justOpenedRef.current = Date.now();
    setSelectedConcert(null);
    setSelectedRide(r);
  }

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
    const map: Record<string, Ride[]> = {};
    for (const r of rides) {
      const existing = map[r.concert_id];
      if (!existing) { map[r.concert_id] = [r]; } else { existing.push(r); }
    }
    return map;
  }, [rides]);

  const concertRides: Ride[] = selectedConcert ? (ridesByConcert[selectedConcert.id] ?? []) : [];
  const rideConcert: Concert | null = selectedRide
    ? (concerts.find((c) => c.id === selectedRide.concert_id) ?? null)
    : null;

  return (
    <div className="cr-map relative h-[60vh] min-h-[420px] w-full border-y border-cr-border">
      <MapContainer
        center={SPAIN_CENTER}
        zoom={6}
        maxBounds={SPAIN_BOUNDS}
        minZoom={5}
        maxZoom={14}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl
        className="h-full w-full"
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} subdomains="abcd" />
        <ZoomControl position="topright" />
        <CtrlScrollZoom />
        <CtrlHint />
        <CloseOnMapClick onClose={closeAll} skipRef={justOpenedRef} />

        {visibleConcerts.map((c) => (
          <Marker
            key={c.id}
            position={[c.venue.lat, c.venue.lng]}
            icon={concertIcon}
            title={`${c.artist} — ${c.venue.city}`}
            eventHandlers={{ click: () => openConcert(c) }}
          />
        ))}

        {visibleOrigins.map((r) => (
          <Marker
            key={r.id}
            position={[r.origin_lat, r.origin_lng]}
            icon={originIcon}
            title={`${r.origin_city} → ${r.concert.venue.city} · €${r.price_per_seat} · ${r.seats_left} plaza${r.seats_left === 1 ? "" : "s"}`}
            eventHandlers={{ click: () => openRide(r) }}
          />
        ))}
      </MapContainer>

      <div className="absolute top-3 left-3 z-[1000] pointer-events-auto">
        <label className="sr-only" htmlFor="map-city-filter">Ciudad</label>
        <select
          id="map-city-filter"
          value={activeCity ?? ""}
          onChange={(e) => setActiveCity(e.target.value || null)}
          className="bg-cr-bg/90 backdrop-blur border border-cr-border text-cr-text font-sans text-[11px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 pr-7 hover:border-cr-primary focus:border-cr-primary focus:outline-none transition-colors [color-scheme:dark]"
        >
          <option value="">Todas las ciudades</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

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

      {selectedRide && (
        <div className="absolute bottom-3 right-3 z-[1000] w-[min(300px,calc(100vw-24px))] bg-cr-surface/96 backdrop-blur-md border border-cr-border pointer-events-auto shadow-[0_0_32px_rgba(0,0,0,0.8)]">
          <button
            type="button"
            onClick={closeAll}
            className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center font-mono text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>

          <div className="p-4 space-y-3">
            <div className="space-y-0.5">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-cr-secondary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cr-secondary inline-block" />
                Salida desde {selectedRide.origin_city}
              </p>
              <h3 className="font-display text-xl uppercase leading-tight pr-6">
                {selectedRide.concert.artist}
              </h3>
              <p className="font-mono text-[11px] text-cr-text-muted">
                {selectedRide.concert.venue.name} · {formatDay(selectedRide.concert.date)}
              </p>
            </div>

            <dl className="grid grid-cols-3 gap-2 border-t border-dashed border-cr-border pt-3">
              <div>
                <dt className="font-sans text-[9px] font-semibold uppercase tracking-[0.1em] text-cr-text-muted">Precio</dt>
                <dd className="font-mono text-sm text-cr-primary mt-0.5">€{selectedRide.price_per_seat}</dd>
              </div>
              <div>
                <dt className="font-sans text-[9px] font-semibold uppercase tracking-[0.1em] text-cr-text-muted">Plazas</dt>
                <dd className="font-mono text-sm text-cr-text mt-0.5">{selectedRide.seats_left}</dd>
              </div>
              <div>
                <dt className="font-sans text-[9px] font-semibold uppercase tracking-[0.1em] text-cr-text-muted">Salida</dt>
                <dd className="font-mono text-[11px] text-cr-text mt-0.5">{formatTime(selectedRide.departure_time)}</dd>
              </div>
            </dl>

            <p className="font-mono text-[11px] text-cr-text-muted">
              Conductor: <span className="text-cr-text">{selectedRide.driver.name}</span>
              {selectedRide.instant_booking && (
                <span className="ml-2 font-sans text-[9px] font-semibold uppercase tracking-[0.1em] bg-cr-primary text-black px-1.5 py-0.5">
                  Instant
                </span>
              )}
            </p>

            <div className="flex gap-2 pt-1">
              <a
                href={`/rides/${selectedRide.id}`}
                className="flex-1 flex items-center justify-center font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black py-2.5 hover:bg-cr-primary/90 transition-colors"
              >
                Ver viaje →
              </a>
              {rideConcert && (
                <a
                  href={`/concerts/${rideConcert.id}`}
                  className="px-3 flex items-center justify-center font-sans text-xs font-semibold uppercase tracking-[0.1em] border border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary transition-colors"
                >
                  Concierto
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedConcert && (
        <div className="absolute bottom-3 right-3 z-[1000] w-[min(320px,calc(100vw-24px))] bg-cr-surface/96 backdrop-blur-md border border-cr-border pointer-events-auto shadow-[0_0_32px_rgba(0,0,0,0.8)] flex flex-col max-h-[min(480px,55vh)]">
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={closeAll}
              className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center font-mono text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
              aria-label="Cerrar"
            >
              ✕
            </button>

            {selectedConcert.image_url && (
              <div className="h-24 overflow-hidden">
                <img
                  src={selectedConcert.image_url}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 h-24 bg-gradient-to-b from-transparent to-cr-surface/90" />
              </div>
            )}

            <div className="p-4 pb-2 space-y-0.5">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-cr-primary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cr-primary inline-block animate-pulse" />
                {concertRides.length} viaje{concertRides.length === 1 ? "" : "s"} con plazas
              </p>
              <h3 className="font-display text-xl uppercase leading-tight pr-6">
                {selectedConcert.artist}
              </h3>
              <p className="font-mono text-[11px] text-cr-text-muted">
                {selectedConcert.venue.name} · {formatDay(selectedConcert.date)}
              </p>
            </div>
          </div>

          {concertRides.length > 0 ? (
            <ul className="flex-1 overflow-y-auto divide-y divide-cr-border border-t border-cr-border">
              {concertRides.map((r) => (
                <li key={r.id}>
                  <a
                    href={`/rides/${r.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-cr-surface-2 transition-colors group"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <p className="font-sans text-xs font-semibold text-cr-text group-hover:text-cr-primary transition-colors truncate">
                        {r.origin_city}
                        {r.origin_city !== selectedConcert.venue.city && (
                          <span className="text-cr-text-muted font-normal"> → {selectedConcert.venue.city}</span>
                        )}
                      </p>
                      <p className="font-mono text-[10px] text-cr-text-muted">
                        {formatTime(r.departure_time)} · {r.driver.name}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right space-y-0.5">
                      <p className="font-mono text-sm text-cr-primary leading-none">€{r.price_per_seat}</p>
                      <p className="font-mono text-[10px] text-cr-text-muted">
                        {r.seats_left} plaza{r.seats_left === 1 ? "" : "s"}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 font-mono text-xs text-cr-text-muted border-t border-cr-border">
              Sin viajes disponibles.
            </p>
          )}

          <div className="flex-shrink-0 border-t border-cr-border p-3">
            <a
              href={`/concerts/${selectedConcert.id}`}
              className="w-full flex items-center justify-center font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black py-2.5 hover:bg-cr-primary/90 transition-colors"
            >
              Ver concierto completo →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

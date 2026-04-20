import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { Ride } from "@concertride/types";
import "./MapView.css";

const TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const originIcon = L.divIcon({
  className: "cr-marker-wrapper",
  html: '<span class="cr-marker-origin" aria-hidden="true"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const venueIcon = L.divIcon({
  className: "cr-marker-wrapper",
  html: '<span class="cr-marker-concert" aria-hidden="true"></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

interface Props {
  ride: Ride;
}

export default function RideRouteMap({ ride }: Props) {
  const origin: [number, number] = [ride.origin_lat, ride.origin_lng];
  const venue: [number, number] = [ride.concert.venue.lat, ride.concert.venue.lng];
  const bounds = L.latLngBounds([origin, venue]).pad(0.35);

  return (
    <div className="cr-map border border-cr-border overflow-hidden">
      {/* Route info bar */}
      <div className="flex items-center gap-0 font-mono text-xs border-b border-cr-border bg-cr-surface">
        <div className="flex items-center gap-2 px-4 py-2.5 flex-1 min-w-0">
          <span className="w-2 h-2 rounded-full bg-cr-secondary flex-shrink-0 shadow-[0_0_6px_rgba(255,79,0,0.7)]" />
          <span className="text-cr-text truncate">{ride.origin_address || ride.origin_city}</span>
        </div>
        <div className="px-2 text-cr-text-dim flex-shrink-0">→</div>
        <div className="flex items-center gap-2 px-4 py-2.5 flex-1 min-w-0 justify-end">
          <span className="text-cr-text truncate text-right">{ride.concert.venue.name}</span>
          <span className="w-2 h-2 rounded-full bg-cr-primary flex-shrink-0 shadow-[0_0_6px_rgba(219,255,0,0.7)]" />
        </div>
      </div>

      <div className="relative h-[300px] w-full">
        <MapContainer
          bounds={bounds}
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl
          className="h-full w-full"
        >
          <TileLayer url={TILE_URL} attribution={TILE_ATTR} subdomains="abcd" />
          <Marker position={origin} icon={originIcon} title="Punto de recogida" />
          <Marker position={venue} icon={venueIcon} title={ride.concert.venue.name} />
          <Polyline
            positions={[origin, venue]}
            pathOptions={{
              color: "#FF4F00",
              weight: 2.5,
              opacity: 0.85,
              dashArray: "8 6",
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
}

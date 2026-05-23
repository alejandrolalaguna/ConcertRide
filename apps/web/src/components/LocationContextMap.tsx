// Reusable static-context map for landing pages (venue + route).
// Renders 1..N markers (primary = yellow pulse / secondary = orange pulse),
// optionally connects exactly 2 points with a dashed orange polyline.

import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "./MapView.css";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

const TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const primaryIcon = L.divIcon({
  className: "cr-marker-wrapper",
  html: '<span class="cr-marker-concert" aria-hidden="true"></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});
const secondaryIcon = L.divIcon({
  className: "cr-marker-wrapper",
  html: '<span class="cr-marker-origin" aria-hidden="true"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export type MapPoint = {
  lat: number;
  lng: number;
  label?: string;
  kind: "primary" | "secondary";
};

export type MapOverlay = {
  distanceKm?: number;
  durationMin?: number;
  label?: string;
};

interface Props {
  points: MapPoint[];
  polyline?: boolean;
  overlay?: MapOverlay;
  height?: string;
  ariaLabel: string;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m} min`;
}

function formatOverlay(overlay: MapOverlay): string {
  const parts: string[] = [];
  if (typeof overlay.distanceKm === "number") parts.push(`${overlay.distanceKm} km`);
  if (typeof overlay.durationMin === "number") parts.push(formatDuration(overlay.durationMin));
  if (overlay.label) parts.push(overlay.label);
  return parts.join(" · ");
}

export default function LocationContextMap({
  points,
  polyline = false,
  overlay,
  height = "h-[280px] md:h-[360px]",
  ariaLabel,
}: Props) {
  if (points.length === 0) return null;

  const first = points[0]!;
  const center: [number, number] = [first.lat, first.lng];

  // For 2+ points use bounds; for 1 just center+zoom.
  const bounds = points.length >= 2
    ? L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number])).pad(0.25)
    : undefined;

  const overlayText = overlay ? formatOverlay(overlay) : "";

  return (
    <div className={`cr-map relative ${height} w-full border border-cr-border overflow-hidden`}>
      <MapContainer
        center={center}
        zoom={points.length === 1 ? 12 : undefined}
        bounds={bounds}
        boundsOptions={{ padding: [40, 40] }}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        aria-label={ariaLabel}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
        {polyline && points.length === 2 && (
          <Polyline
            positions={[
              [points[0]!.lat, points[0]!.lng],
              [points[1]!.lat, points[1]!.lng],
            ]}
            pathOptions={{ color: "#ff4f00", weight: 2.5, opacity: 0.85, dashArray: "6 4" }}
          />
        )}
        {points.map((p, i) => (
          <Marker
            key={i}
            position={[p.lat, p.lng]}
            icon={p.kind === "primary" ? primaryIcon : secondaryIcon}
            title={p.label}
          />
        ))}
      </MapContainer>

      {overlay && overlayText && (
        <div className="absolute bottom-3 left-3 z-[400] pointer-events-none">
          <div className="bg-cr-bg/90 backdrop-blur border border-cr-border/60 px-3 py-1.5 font-mono text-[11px] text-cr-text">
            {overlayText}
          </div>
        </div>
      )}
    </div>
  );
}

import { useNavigate, Link } from "react-router-dom";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import type { Concert, Ride } from "@concertride/types";
import "./MapView.css";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

const TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const venueIcon = L.divIcon({
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
  concert: Concert;
  rides: Ride[];
}

export default function ConcertRidesMap({ concert, rides }: Props) {
  const navigate = useNavigate();

  if (rides.length === 0) {
    return (
      <div className="cr-card p-6 text-center space-y-2">
        <p className="font-display text-lg uppercase">Sin viajes todavía</p>
        <p className="font-mono text-xs text-cr-text-muted">
          Sé el primero en publicar uno para {concert.artist}
        </p>
        <Link to={`/publicar?concert=${concert.id}`} className="cr-btn-primary mt-2 inline-block">
          Publicar viaje
        </Link>
      </div>
    );
  }

  if (typeof concert.venue.lat !== "number" || typeof concert.venue.lng !== "number") {
    return null;
  }

  const venue: [number, number] = [concert.venue.lat, concert.venue.lng];
  const validRides = rides.filter(
    (r) => typeof r.origin_lat === "number" && typeof r.origin_lng === "number",
  );

  const points: [number, number][] = [
    venue,
    ...validRides.map((r) => [r.origin_lat, r.origin_lng] as [number, number]),
  ];
  const bounds = L.latLngBounds(points).pad(0.2);

  return (
    <div className="cr-map border border-cr-border overflow-hidden">
      <div className="relative h-[360px] md:h-[480px] w-full">
        <MapContainer
          bounds={bounds}
          boundsOptions={{ padding: [40, 40] }}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          aria-label={`Mapa de ${concert.artist}: viajes hacia ${concert.venue.name}`}
        >
          <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
          <Marker position={venue} icon={venueIcon} title={concert.venue.name} />
          {validRides.map((r) => (
            <Marker
              key={r.id}
              position={[r.origin_lat, r.origin_lng]}
              icon={originIcon}
              title={`${r.origin_city} → ${concert.venue.city}`}
              eventHandlers={{
                click: () => navigate(`/rides/${r.id}`),
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

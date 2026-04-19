import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { Ride } from "@concertride/types";
import "./MapView.css";

const originIcon = L.divIcon({
  className: "cr-marker-wrapper",
  html: '<span class="cr-marker-origin" aria-hidden="true"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const venueIcon = L.divIcon({
  className: "cr-marker-wrapper",
  html: '<span class="cr-marker-concert" aria-hidden="true"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface Props {
  ride: Ride;
}

export default function RideRouteMap({ ride }: Props) {
  const origin: [number, number] = [ride.origin_lat, ride.origin_lng];
  const venue: [number, number] = [ride.concert.venue.lat, ride.concert.venue.lng];

  const bounds = L.latLngBounds([origin, venue]).pad(0.3);

  return (
    <div className="cr-map relative h-[320px] w-full border border-cr-border">
      <MapContainer
        bounds={bounds}
        scrollWheelZoom={false}
        attributionControl
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={origin} icon={originIcon} title="Punto de recogida" />
        <Marker position={venue} icon={venueIcon} title={ride.concert.venue.name} />
        <Polyline
          positions={[origin, venue]}
          pathOptions={{
            color: "#FF4F00",
            weight: 3,
            opacity: 0.9,
            dashArray: "6 6",
          }}
        />
      </MapContainer>
    </div>
  );
}

import { useEffect, useRef } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
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

const SPAIN_CENTER: [number, number] = [40.4168, -3.7038];

const originIcon = L.divIcon({
  className: "cr-marker-wrapper",
  html: '<span class="cr-marker-origin" aria-hidden="true"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

interface Props {
  lat: number | null;
  lng: number | null;
  onChange: (next: { lat: number; lng: number }) => void;
  initialCenter?: [number, number];
}

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function ExternalSync({ lat, lng }: { lat: number | null; lng: number | null }) {
  const map = useMap();
  useEffect(() => {
    if (lat === null || lng === null) return;
    map.flyTo([lat, lng], Math.max(map.getZoom(), 12), { animate: true, duration: 0.4 });
  }, [lat, lng, map]);
  return null;
}

export default function OriginPickerMap({ lat, lng, onChange, initialCenter }: Props) {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const hasInitial = lat !== null && lng !== null;
  const center: [number, number] = hasInitial
    ? [lat as number, lng as number]
    : initialCenter ?? SPAIN_CENTER;
  const zoom = hasInitial ? 13 : 5.5;

  useEffect(() => {
    if (hasInitial) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    try {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onChangeRef.current({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {},
        { enableHighAccuracy: false, timeout: 5000 },
      );
    } catch {
      // Geolocation blocked — silently fall back.
    }
  }, [hasInitial]);

  return (
    <div className="cr-map border border-cr-border overflow-hidden">
      <div className="relative h-[320px] w-full">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          aria-label="Selecciona el punto de recogida en el mapa"
        >
          <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
          <ClickHandler
            onPick={(la, ln) => onChangeRef.current({ lat: la, lng: ln })}
          />
          <ExternalSync lat={lat} lng={lng} />
          {hasInitial && (
            <Marker
              position={[lat as number, lng as number]}
              icon={originIcon}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const m = e.target as L.Marker;
                  const p = m.getLatLng();
                  onChangeRef.current({ lat: p.lat, lng: p.lng });
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      <p className="font-mono text-[10px] text-cr-text-muted px-3 py-2 border-t border-cr-border bg-cr-surface">
        Arrastra el marcador para ajustar el punto exacto de recogida.
      </p>
    </div>
  );
}

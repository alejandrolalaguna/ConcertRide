import { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap, Marker as MapMarker, LngLat } from "maplibre-gl";
import { OSM_RASTER_STYLE, SPAIN_CENTER } from "@/lib/mapStyle";
import { mapTransformRequest } from "@/lib/mapTransformRequest";
import { hasWebGL } from "@/lib/webglSupport";
import MapAttribution from "./MapAttribution";
import "./MapView.css";

interface Props {
  lat: number | null;
  lng: number | null;
  onChange: (next: { lat: number; lng: number }) => void;
  initialCenter?: [number, number];
}

function makeOriginMarkerElement(): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "cr-marker-wrapper";
  const inner = document.createElement("span");
  inner.className = "cr-marker-origin";
  inner.setAttribute("aria-hidden", "true");
  wrap.appendChild(inner);
  return wrap;
}

export default function OriginPickerMap({ lat, lng, onChange, initialCenter }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<MapMarker | null>(null);
  // Keep latest onChange in a ref so the init effect can read it without
  // re-running. Init must only run once per mount.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // ---- Init map once ----
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!hasWebGL()) return; // jsdom / unsupported browsers — skip MapLibre

    const startCenter: [number, number] =
      lat !== null && lng !== null
        ? [lng, lat]
        : initialCenter ?? SPAIN_CENTER;
    const startZoom = lat !== null && lng !== null ? 13 : 5.5;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_RASTER_STYLE,
      center: startCenter,
      zoom: startZoom,
      attributionControl: false,
      transformRequest: mapTransformRequest,
    });
    mapRef.current = map;

    const marker = new maplibregl.Marker({
      element: makeOriginMarkerElement(),
      draggable: true,
    })
      .setLngLat(startCenter)
      .addTo(map);
    markerRef.current = marker;

    marker.on("dragend", () => {
      const pos = marker.getLngLat();
      onChangeRef.current({ lat: pos.lat, lng: pos.lng });
    });

    map.on("click", (e) => {
      const ll = e.lngLat as LngLat;
      marker.setLngLat(ll);
      onChangeRef.current({ lat: ll.lat, lng: ll.lng });
    });

    // ---- Geolocation: only if no initial coords supplied ----
    if (lat === null || lng === null) {
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        try {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              if (!mapRef.current || !markerRef.current) return;
              const detectedLat = position.coords.latitude;
              const detectedLng = position.coords.longitude;
              mapRef.current.flyTo({
                center: [detectedLng, detectedLat],
                zoom: 13,
                animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
              });
              markerRef.current.setLngLat([detectedLng, detectedLat]);
              onChangeRef.current({ lat: detectedLat, lng: detectedLng });
            },
            () => {
              // Permission denied or timeout — keep current default center.
            },
            { enableHighAccuracy: false, timeout: 5000 },
          );
        } catch {
          // Geolocation API blocked — silently fall back to default center.
        }
      }
    }

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Sync external lat/lng changes into the marker (e.g. when origin_city
  // dropdown is changed and the parent updates coords). ----
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    if (lat === null || lng === null) return;
    const current = markerRef.current.getLngLat();
    if (Math.abs(current.lat - lat) < 1e-6 && Math.abs(current.lng - lng) < 1e-6) return;
    markerRef.current.setLngLat([lng, lat]);
    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: Math.max(mapRef.current.getZoom(), 12),
      animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, [lat, lng]);

  return (
    <div className="cr-map border border-cr-border overflow-hidden">
      <div className="relative h-[320px] w-full">
        <div
          ref={containerRef}
          className="absolute inset-0"
          aria-label="Selecciona el punto de recogida en el mapa"
          role="region"
        />
        <MapAttribution />
      </div>
      <p className="font-mono text-[10px] text-cr-text-muted px-3 py-2 border-t border-cr-border bg-cr-surface">
        Arrastra el marcador para ajustar el punto exacto de recogida.
      </p>
    </div>
  );
}

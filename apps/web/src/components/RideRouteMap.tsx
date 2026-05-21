import { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap, LngLatBounds } from "maplibre-gl";
import type { Ride } from "@concertride/types";
import { OSM_RASTER_STYLE } from "@/lib/mapStyle";
import { mapTransformRequest } from "@/lib/mapTransformRequest";
import { hasWebGL } from "@/lib/webglSupport";
import MapAttribution from "./MapAttribution";
import "./MapView.css";

interface Props {
  ride: Ride;
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

function makeVenueMarkerElement(): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "cr-marker-wrapper";
  const inner = document.createElement("span");
  inner.className = "cr-marker-concert";
  inner.setAttribute("aria-hidden", "true");
  wrap.appendChild(inner);
  return wrap;
}

export default function RideRouteMap({ ride }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!hasWebGL()) return;

    const origin: [number, number] = [ride.origin_lng, ride.origin_lat];
    const venue: [number, number] = [ride.concert.venue.lng, ride.concert.venue.lat];
    const bounds = new LngLatBounds(origin, origin).extend(venue);

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_RASTER_STYLE,
      bounds,
      fitBoundsOptions: { padding: 50, animate: false },
      scrollZoom: false,
      attributionControl: false,
      transformRequest: mapTransformRequest,
    });

    map.on("load", () => {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [origin, venue],
          },
        },
      });
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#ff4f00",
          "line-width": 2.5,
          "line-opacity": 0.85,
          "line-dasharray": [3, 2],
        },
      });
    });

    new maplibregl.Marker({ element: makeOriginMarkerElement() }).setLngLat(origin).addTo(map);
    new maplibregl.Marker({ element: makeVenueMarkerElement() }).setLngLat(venue).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <div
          ref={containerRef}
          className="absolute inset-0"
          aria-label={`Mapa de la ruta: ${ride.origin_city} a ${ride.concert.venue.name}`}
          role="region"
        />
        <MapAttribution />
      </div>
    </div>
  );
}

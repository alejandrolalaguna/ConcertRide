// Reusable static-context map for landing pages (venue + route).
// Renders 1..N markers (primary = yellow pulse / secondary = orange pulse),
// optionally connects exactly 2 points with a dashed orange polyline, and can
// show a small distance/duration overlay in the bottom-left corner.
//
// Designed for prerendered SPA pages — all MapLibre work is inside useEffect,
// nothing at module scope. Lazy-load this component with React.lazy.

import { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap, LngLatBounds } from "maplibre-gl";
import { OSM_RASTER_STYLE } from "@/lib/mapStyle";
import { mapTransformRequest } from "@/lib/mapTransformRequest";
import { hasWebGL } from "@/lib/webglSupport";
import MapAttribution from "./MapAttribution";
import "./MapView.css";

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

function makeMarkerElement(kind: MapPoint["kind"], label?: string): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "cr-marker-wrapper";
  const inner = document.createElement("span");
  inner.className = kind === "primary" ? "cr-marker-concert" : "cr-marker-origin";
  inner.setAttribute("aria-hidden", "true");
  wrap.appendChild(inner);
  if (label) wrap.setAttribute("title", label);
  return wrap;
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!hasWebGL()) return;
    if (points.length === 0) return;

    const first = points[0]!;
    const initOpts: maplibregl.MapOptions = {
      container: containerRef.current,
      style: OSM_RASTER_STYLE,
      scrollZoom: false,
      attributionControl: false,
      transformRequest: mapTransformRequest,
    };

    if (points.length === 1) {
      initOpts.center = [first.lng, first.lat];
      initOpts.zoom = 12;
    } else {
      const bounds = new LngLatBounds([first.lng, first.lat], [first.lng, first.lat]);
      for (const p of points.slice(1)) bounds.extend([p.lng, p.lat]);
      initOpts.bounds = bounds;
      initOpts.fitBoundsOptions = { padding: 60, animate: false };
    }

    const map = new maplibregl.Map(initOpts);
    mapRef.current = map;

    // Dashed orange route line — only when exactly 2 points + polyline=true.
    // Same paint as RideRouteMap.tsx for visual consistency.
    if (polyline && points.length === 2) {
      const a = points[0]!;
      const b = points[1]!;
      map.on("load", () => {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [
                [a.lng, a.lat],
                [b.lng, b.lat],
              ],
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
    }

    for (const p of points) {
      new maplibregl.Marker({ element: makeMarkerElement(p.kind, p.label) })
        .setLngLat([p.lng, p.lat])
        .addTo(map);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // Intentionally run once — landing pages render with static point data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overlayText = overlay ? formatOverlay(overlay) : "";

  return (
    <div className={`cr-map relative ${height} w-full border border-cr-border overflow-hidden`}>
      <div
        ref={containerRef}
        className="absolute inset-0"
        aria-label={ariaLabel}
        role="region"
      />
      <MapAttribution />

      {overlay && overlayText && (
        <div className="absolute bottom-3 left-3 z-[2] pointer-events-none">
          <div className="bg-cr-bg/90 backdrop-blur border border-cr-border/60 px-3 py-1.5 font-mono text-[11px] text-cr-text">
            {overlayText}
          </div>
        </div>
      )}
    </div>
  );
}

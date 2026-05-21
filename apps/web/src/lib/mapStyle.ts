// MapLibre style spec — OpenStreetMap raster tiles with dark CSS overlay.
// We use OSM directly (no API key, free). Dark aesthetic is achieved with a
// CSS `filter` on the canvas (see MapView.css). Required:
// - User-Agent set via transformRequest (mapTransformRequest.ts)
// - Attribution visible (MapAttribution.tsx) — clickable to /copyright

import type { StyleSpecification } from "maplibre-gl";

export const OSM_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "osm-tiles",
      type: "raster",
      source: "osm",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
};

// Spain bounds for default map viewport
export const SPAIN_CENTER: [number, number] = [-3.7038, 40.4168];
export const SPAIN_BOUNDS: [[number, number], [number, number]] = [
  [-9.5, 35.9],
  [4.4, 43.8],
];

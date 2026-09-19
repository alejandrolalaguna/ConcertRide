/**
 * Teselas de mapa — fuente única para todos los mapas Leaflet.
 *
 * Con `VITE_CARTO_API_KEY` (apps/web/.env.local, gitignored; también necesaria
 * en el entorno de build) se usan las teselas oscuras de CARTO. Sin clave, las
 * de OpenStreetMap con un filtro CSS oscuro (`.cr-osm-dark`).
 *
 * CARTO devuelve un PNG con la marca «API KEY REQUIRED» si falta la clave,
 * así que nunca se emite la URL de CARTO sin ella.
 */
const CARTO_KEY: string | undefined = (import.meta.env.VITE_CARTO_API_KEY as string | undefined)?.trim() || undefined;

export const TILES_PROVIDER: "carto" | "osm" = CARTO_KEY ? "carto" : "osm";

export const TILE_URL = CARTO_KEY
  ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?key=${encodeURIComponent(CARTO_KEY)}`
  : "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

export const TILE_SUBDOMAINS = CARTO_KEY ? "abcd" : undefined;

export const TILE_ATTR = CARTO_KEY
  ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** Clase a añadir al contenedor del mapa: oscurece las teselas OSM por CSS. */
export const TILE_DARK_CLASS = CARTO_KEY ? "" : "cr-osm-dark";

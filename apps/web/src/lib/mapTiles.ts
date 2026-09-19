/**
 * Teselas de mapa — fuente única para todos los mapas Leaflet.
 *
 * CARTO exige una API key: sin ella devuelve un PNG con la marca
 * «API KEY REQUIRED». La clave se lee de `VITE_CARTO_API_KEY`
 * (apps/web/.env.local, gitignored; también debe existir en el entorno donde
 * se ejecute el build). Si falta, se usan teselas de OpenStreetMap con un
 * filtro CSS oscuro (`.cr-osm-dark`, ver MapView.css) para no romper el mapa.
 */
const CARTO_KEY: string | undefined = (import.meta.env.VITE_CARTO_API_KEY as string | undefined)?.trim() || undefined;

export const TILE_URL = CARTO_KEY
  ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png?key=${encodeURIComponent(CARTO_KEY)}`
  : "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

/** CARTO usa subdominios a–d; OSM no. */
export const TILE_SUBDOMAINS = CARTO_KEY ? "abcd" : undefined;

export const TILE_ATTR = CARTO_KEY
  ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/** Clase para el contenedor del mapa: oscurece las teselas OSM del fallback. */
export const TILE_DARK_CLASS = CARTO_KEY ? "" : "cr-osm-dark";

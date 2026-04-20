import { useState } from "react";
import { LocateFixed } from "lucide-react";
import type { Vibe } from "@concertride/types";

export interface FilterState {
  origin_city: string;
  max_price: string;
  vibe: Vibe | "";
  round_trip: "any" | "yes" | "no";
  no_smoking: boolean;
  near_lat: number | null;
  near_lng: number | null;
  radius_km: number;
}

export const EMPTY_FILTERS: FilterState = {
  origin_city: "",
  max_price: "",
  vibe: "",
  round_trip: "any",
  no_smoking: false,
  near_lat: null,
  near_lng: null,
  radius_km: 30,
};

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
  cities: string[];
  sticky?: boolean;
}

export function FilterBar({ value, onChange, cities, sticky = true }: Props) {
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");

  function set<K extends keyof FilterState>(key: K, v: FilterState[K]) {
    onChange({ ...value, [key]: v });
  }

  function toggleNearMe() {
    if (value.near_lat !== null) {
      onChange({ ...value, near_lat: null, near_lng: null });
      return;
    }
    if (!navigator.geolocation) {
      setLocError("Tu navegador no soporta geolocalización.");
      return;
    }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ ...value, near_lat: pos.coords.latitude, near_lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocError("No se pudo obtener tu ubicación.");
        setLocating(false);
      },
    );
  }

  const fieldCls =
    "bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-2.5 font-sans text-sm text-cr-text placeholder:text-cr-text-dim transition-colors [color-scheme:dark]";

  const hasActiveFilters =
    value.origin_city || value.max_price || value.vibe || value.round_trip !== "any" || value.no_smoking || value.near_lat !== null;

  return (
    <div
      className={
        sticky
          ? "sticky top-0 z-30 bg-cr-bg/95 backdrop-blur supports-[backdrop-filter]:bg-cr-bg/80"
          : ""
      }
    >
      <form
        role="search"
        aria-label="Filtrar viajes"
        className="flex flex-wrap gap-2 px-4 md:px-6 py-3 border-b border-cr-border"
      >
        <label className="flex-1 min-w-[140px]">
          <span className="sr-only">Ciudad de origen</span>
          <select
            value={value.origin_city}
            onChange={(e) => set("origin_city", e.target.value)}
            disabled={value.near_lat !== null}
            className={`${fieldCls} w-full disabled:opacity-40`}
          >
            <option value="">Origen · todos</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>

        <label className="w-[120px]">
          <span className="sr-only">Precio máximo</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={500}
            value={value.max_price}
            onChange={(e) => set("max_price", e.target.value)}
            placeholder="Máx. €"
            className={`${fieldCls} w-full font-mono`}
          />
        </label>

        <label className="w-[120px]">
          <span className="sr-only">Vibe</span>
          <select
            value={value.vibe}
            onChange={(e) => set("vibe", e.target.value as Vibe | "")}
            className={`${fieldCls} w-full`}
          >
            <option value="">Vibe</option>
            <option value="party">Party</option>
            <option value="mixed">Mixed</option>
            <option value="chill">Chill</option>
          </select>
        </label>

        <label className="w-[140px]">
          <span className="sr-only">Ida y vuelta</span>
          <select
            value={value.round_trip}
            onChange={(e) => set("round_trip", e.target.value as "any" | "yes" | "no")}
            className={`${fieldCls} w-full`}
          >
            <option value="any">Ida (y vuelta)</option>
            <option value="yes">Ida y vuelta</option>
            <option value="no">Solo ida</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => set("no_smoking", !value.no_smoking)}
          title={value.no_smoking ? "Quitar filtro no fumadores" : "Solo viajes sin fumadores"}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-2 font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
            value.no_smoking
              ? "border-cr-primary bg-cr-primary/[0.08] text-cr-primary"
              : "border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary"
          }`}
        >
          🚭 No fumar
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleNearMe}
            disabled={locating}
            title={value.near_lat !== null ? "Desactivar filtro por ubicación" : "Buscar salidas cerca de mí"}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-2 font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-colors disabled:opacity-40 ${
              value.near_lat !== null
                ? "border-cr-primary bg-cr-primary/[0.08] text-cr-primary"
                : "border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary"
            }`}
          >
            <LocateFixed size={13} aria-hidden="true" />
            {locating ? "…" : value.near_lat !== null ? "Cerca de mí" : "Cerca de mí"}
          </button>

          {value.near_lat !== null && (
            <select
              value={value.radius_km}
              onChange={(e) => set("radius_km", Number(e.target.value))}
              aria-label="Radio de búsqueda"
              className="bg-cr-surface border-2 border-cr-primary outline-none px-2 py-2.5 font-mono text-xs text-cr-primary [color-scheme:dark]"
            >
              <option value={10}>10 km</option>
              <option value={30}>30 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
              <option value={200}>200 km</option>
            </select>
          )}
        </div>

        {locError && (
          <p className="w-full font-mono text-[10px] text-cr-secondary px-1">{locError}</p>
        )}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => { onChange(EMPTY_FILTERS); setLocError(""); }}
            className="font-sans text-xs uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary px-3 py-2.5 border-2 border-transparent hover:border-cr-border transition-colors"
          >
            Limpiar
          </button>
        )}
      </form>
    </div>
  );
}

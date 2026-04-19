import type { Vibe } from "@concertride/types";

export interface FilterState {
  origin_city: string;
  max_price: string;
  vibe: Vibe | "";
  round_trip: "any" | "yes" | "no";
}

export const EMPTY_FILTERS: FilterState = {
  origin_city: "",
  max_price: "",
  vibe: "",
  round_trip: "any",
};

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
  cities: string[];
  sticky?: boolean;
}

export function FilterBar({ value, onChange, cities, sticky = true }: Props) {
  function set<K extends keyof FilterState>(key: K, v: FilterState[K]) {
    onChange({ ...value, [key]: v });
  }

  const fieldCls =
    "bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-2.5 font-sans text-sm text-cr-text placeholder:text-cr-text-dim transition-colors [color-scheme:dark]";

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
            className={`${fieldCls} w-full`}
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

        {(value.origin_city || value.max_price || value.vibe || value.round_trip !== "any") && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="font-sans text-xs uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary px-3 py-2.5 border-2 border-transparent hover:border-cr-border transition-colors"
          >
            Limpiar
          </button>
        )}
      </form>
    </div>
  );
}

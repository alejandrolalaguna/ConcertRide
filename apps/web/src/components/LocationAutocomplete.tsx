import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2, X } from "lucide-react";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

export interface LocationValue {
  name: string;
  lat: number;
  lng: number;
}

interface Props {
  value: LocationValue | null;
  onChange: (loc: LocationValue | null) => void;
  placeholder?: string;
  label?: string;
  quickCities?: LocationValue[];
}

function extractCityName(result: NominatimResult): string {
  const a = result.address;
  return a.city ?? a.town ?? a.village ?? a.municipality ?? a.county ?? a.state ?? result.display_name.split(",")[0] ?? result.display_name;
}

export function LocationAutocomplete({ value, onChange, placeholder = "Ej: Getafe, Lleida, Ourense…", label, quickCities }: Props) {
  const [query, setQuery] = useState(value?.name ?? "");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(value?.name ?? "");
  }, [value?.name]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    if (trimmed.length < 2 || value?.name === trimmed) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("q", trimmed);
        url.searchParams.set("format", "json");
        url.searchParams.set("addressdetails", "1");
        url.searchParams.set("countrycodes", "es");
        url.searchParams.set("featuretype", "city");
        url.searchParams.set("limit", "7");
        const res = await fetch(url.toString(), {
          headers: { "Accept-Language": "es", "User-Agent": "ConcertRide/1.0" },
        });
        const data: NominatimResult[] = await res.json();
        setResults(data);
        setOpen(data.length > 0);
        setActiveIdx(-1);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  function selectResult(r: NominatimResult) {
    const name = extractCityName(r);
    onChange({ name, lat: parseFloat(r.lat), lng: parseFloat(r.lon) });
    setQuery(name);
    setOpen(false);
    setResults([]);
  }

  function selectQuick(loc: LocationValue) {
    onChange(loc);
    setQuery(loc.name);
    setOpen(false);
    setResults([]);
  }

  function clear() {
    onChange(null);
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); const r = results[activeIdx]; if (r) selectResult(r); }
    if (e.key === "Escape") { setOpen(false); }
  }

  const isConfirmed = !!value;
  const showQuickCities = quickCities && quickCities.length > 0 && !isConfirmed && query.length === 0;

  return (
    <div ref={containerRef} className="relative space-y-2">
      {/* Quick city chips — shown only when nothing is selected and input is empty */}
      {showQuickCities && (
        <div className="flex flex-wrap gap-1.5">
          {quickCities!.map((city) => (
            <button
              key={city.name}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); selectQuick(city); }}
              className="px-2.5 py-1 text-xs font-sans font-medium border border-cr-border text-cr-text-dim hover:border-cr-primary hover:text-cr-primary transition-colors bg-transparent"
            >
              {city.name}
            </button>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className={`flex items-center gap-2 w-full bg-cr-surface border-2 px-3 py-3 transition-colors ${isConfirmed ? "border-cr-primary" : "border-cr-border focus-within:border-cr-primary"}`}>
        {loading
          ? <Loader2 className="w-4 h-4 text-cr-text-dim shrink-0 animate-spin" />
          : <MapPin className={`w-4 h-4 shrink-0 ${isConfirmed ? "text-cr-primary" : "text-cr-text-dim"}`} />
        }
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); if (value) onChange(null); }}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent outline-none font-sans text-sm text-cr-text placeholder:text-cr-text-dim min-w-0"
          aria-label={label}
          aria-autocomplete="list"
          aria-expanded={open}
          role="combobox"
        />
        {query.length > 0 && (
          <button type="button" onClick={clear} className="shrink-0 text-cr-text-dim hover:text-cr-text transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete dropdown */}
      {open && results.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 top-full left-0 right-0 mt-0.5 bg-cr-surface border-2 border-cr-border shadow-[4px_4px_0px_0px_#DBFF00] max-h-64 overflow-y-auto"
        >
          {results.map((r, i) => {
            const city = extractCityName(r);
            const parts = r.display_name.split(",").slice(1, 3).join(",").trim();
            return (
              <li
                key={r.place_id}
                role="option"
                aria-selected={i === activeIdx}
                onMouseDown={(e) => { e.preventDefault(); selectResult(r); }}
                onMouseEnter={() => setActiveIdx(i)}
                className={`flex items-start gap-2.5 px-3 py-2.5 cursor-pointer transition-colors ${i === activeIdx ? "bg-cr-primary text-cr-bg" : "hover:bg-white/5 text-cr-text"}`}
              >
                <MapPin className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${i === activeIdx ? "text-cr-bg" : "text-cr-primary"}`} />
                <span className="min-w-0">
                  <span className="font-sans text-sm font-medium block">{city}</span>
                  {parts && <span className={`font-sans text-xs block truncate ${i === activeIdx ? "text-cr-bg/70" : "text-cr-text-dim"}`}>{parts}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

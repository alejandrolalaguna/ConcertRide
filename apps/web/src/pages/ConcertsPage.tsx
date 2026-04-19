import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Clock, Zap } from "lucide-react";
import type { Concert } from "@concertride/types";
import { api } from "@/lib/api";
import { ConcertCard, concertStatus } from "@/components/ConcertCard";
import { SPANISH_CITIES } from "@/lib/constants";
import { LoadingSpinner } from "@/components/ui";

const GENRES = [
  "Festival",
  "Pop",
  "Rock",
  "Indie",
  "Reggaetón",
  "Electrónica",
  "Jazz",
  "Hip-Hop",
  "Flamenco",
  "Metal",
];

type Tab = "active" | "past";

interface Filters {
  city: string;
  dateFrom: string;
  dateTo: string;
  artist: string;
  genre: string;
}

const EMPTY_FILTERS: Filters = { city: "", dateFrom: "", dateTo: "", artist: "", genre: "" };

function hasActiveFilters(f: Filters) {
  return Object.values(f).some(Boolean);
}

// ISO datetime strings the API expects
const NOW_ISO = new Date().toISOString();
const THREE_WEEKS_AGO_ISO = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString();

export default function ConcertsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [concerts, setConcerts] = useState<Concert[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const tab: Tab = searchParams.get("tab") === "past" ? "past" : "active";

  // Debounce artist search to avoid firing on every keystroke
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedArtist, setDebouncedArtist] = useState("");

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedArtist(filters.artist), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters.artist]);

  const fetchConcerts = useCallback(() => {
    setLoading(true);
    setConcerts(null);

    // Tab drives the base date bounds; user's dateFrom/dateTo override within that range
    const baseDateFrom = tab === "past" ? THREE_WEEKS_AGO_ISO : undefined;
    const baseDateTo = tab === "past" ? NOW_ISO : undefined;

    const params = {
      limit: 100,
      city: filters.city || undefined,
      artist: debouncedArtist || undefined,
      date_from: filters.dateFrom
        ? new Date(filters.dateFrom).toISOString()
        : baseDateFrom,
      date_to: filters.dateTo
        ? new Date(filters.dateTo + "T23:59:59").toISOString()
        : baseDateTo,
    };

    api.concerts
      .list(params)
      .then((r) => setConcerts(r.concerts))
      .catch(() => setConcerts([]))
      .finally(() => setLoading(false));
  }, [tab, filters.city, filters.dateFrom, filters.dateTo, debouncedArtist]);

  useEffect(() => {
    fetchConcerts();
  }, [fetchConcerts]);

  function setFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  function setTab(t: Tab) {
    setSearchParams(t === "past" ? { tab: "past" } : {}, { replace: true });
    setFilters(EMPTY_FILTERS);
  }

  // Genre is not in ConcertsQuery — applied client-side after API returns
  const filtered = useMemo(
    () =>
      filters.genre
        ? (concerts ?? []).filter((c) =>
            (c.genre ?? "").toLowerCase().includes(filters.genre.toLowerCase()),
          )
        : (concerts ?? []),
    [concerts, filters.genre],
  );

  // Active/past split for tab counts (use concertStatus on whatever came back)
  const activeCount = useMemo(
    () => (concerts ?? []).filter((c) => concertStatus(c.date) !== "archived").length,
    [concerts],
  );
  const pastCount = useMemo(
    () => (concerts ?? []).filter((c) => concertStatus(c.date) === "archived").length,
    [concerts],
  );

  return (
    <div className="min-h-screen bg-cr-bg text-cr-text pt-16">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Explorar
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
            Todos los
            <br />
            conciertos.
          </h1>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`inline-flex items-center gap-2 px-4 py-2 border font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
              hasActiveFilters(filters) || showFilters
                ? "border-cr-primary text-cr-primary bg-cr-primary/5"
                : "border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary"
            }`}
          >
            <SlidersHorizontal size={13} />
            Filtrar
            {hasActiveFilters(filters) && (
              <span className="bg-cr-primary text-black w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Artist search — sent as API param */}
        <input
          type="search"
          placeholder="Buscar artista o festival…"
          value={filters.artist}
          onChange={(e) => setFilter("artist", e.target.value)}
          className="w-full bg-cr-surface border border-cr-border px-4 py-3 font-mono text-sm text-cr-text placeholder:text-cr-text-dim focus:outline-none focus:border-cr-primary transition-colors"
        />

        {/* Filter panel */}
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border border-cr-border bg-cr-surface">
            <div className="space-y-1.5">
              <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                Ciudad
              </label>
              <select
                value={filters.city}
                onChange={(e) => setFilter("city", e.target.value)}
                className="w-full bg-cr-surface-2 border border-cr-border px-3 py-2 font-mono text-xs text-cr-text focus:outline-none focus:border-cr-primary [color-scheme:dark]"
              >
                <option value="">Todas</option>
                {SPANISH_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                Género
              </label>
              <select
                value={filters.genre}
                onChange={(e) => setFilter("genre", e.target.value)}
                className="w-full bg-cr-surface-2 border border-cr-border px-3 py-2 font-mono text-xs text-cr-text focus:outline-none focus:border-cr-primary [color-scheme:dark]"
              >
                <option value="">Todos</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                Desde
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilter("dateFrom", e.target.value)}
                className="w-full bg-cr-surface-2 border border-cr-border px-3 py-2 font-mono text-xs text-cr-text focus:outline-none focus:border-cr-primary [color-scheme:dark]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                Hasta
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilter("dateTo", e.target.value)}
                className="w-full bg-cr-surface-2 border border-cr-border px-3 py-2 font-mono text-xs text-cr-text focus:outline-none focus:border-cr-primary [color-scheme:dark]"
              />
            </div>

            {hasActiveFilters(filters) && (
              <button
                onClick={() => setFilters(EMPTY_FILTERS)}
                className="col-span-2 md:col-span-4 inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted hover:text-cr-primary transition-colors"
              >
                <X size={12} />
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-0 border-b border-cr-border">
          <button
            onClick={() => setTab("active")}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-b-2 -mb-px transition-colors ${
              tab === "active"
                ? "border-cr-primary text-cr-primary"
                : "border-transparent text-cr-text-muted hover:text-cr-text"
            }`}
          >
            <Zap size={12} />
            Próximos
            {!loading && activeCount > 0 && (
              <span className="font-mono text-[10px] text-cr-text-dim">({activeCount})</span>
            )}
          </button>
          <button
            onClick={() => setTab("past")}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-b-2 -mb-px transition-colors ${
              tab === "past"
                ? "border-cr-primary text-cr-primary"
                : "border-transparent text-cr-text-muted hover:text-cr-text"
            }`}
          >
            <Clock size={12} />
            Pasados
            {!loading && pastCount > 0 && (
              <span className="font-mono text-[10px] text-cr-text-dim">({pastCount})</span>
            )}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        {loading ? (
          <LoadingSpinner text="Cargando conciertos…" />
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-2xl uppercase text-cr-text-muted mb-2">
              Sin resultados
            </p>
            <p className="font-sans text-sm text-cr-text-dim">
              Prueba a cambiar los filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c) => (
              <Link key={c.id} to={`/concerts/${c.id}`} className="block">
                <ConcertCard concert={c} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

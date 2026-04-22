import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SlidersHorizontal, Sparkles, X, Clock, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import type { Concert } from "@concertride/types";
import { api } from "@/lib/api";
import { ConcertCard } from "@/components/ConcertCard";
import { LoadingSpinner } from "@/components/ui";

const PAGE_SIZE = 24;
// Past tab: show concerts from up to 3 months ago
const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000;

type Tab = "active" | "past";

interface Filters {
  city: string;
  dateFrom: string;
  dateTo: string;
  artist: string;
  genre: string;
  festival: boolean;
}

const EMPTY_FILTERS: Filters = {
  city: "",
  dateFrom: "",
  dateTo: "",
  artist: "",
  genre: "",
  festival: false,
};

function hasActiveFilters(f: Filters) {
  return Object.values(f).some(Boolean);
}

const BREADCRUMB_CONCERTS_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://concertride.es/" },
    { "@type": "ListItem", position: 2, name: "Conciertos", item: "https://concertride.es/concerts" },
  ],
});

export default function ConcertsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [concerts, setConcerts] = useState<Concert[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [facets, setFacets] = useState<{ genres: string[]; cities: string[] }>({ genres: [], cities: [] });
  const tab: Tab = searchParams.get("tab") === "past" ? "past" : "active";
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    api.concerts
      .facets()
      .then(setFacets)
      .catch(() => setFacets({ genres: [], cities: [] }));
  }, []);

  const dynamicTitle = useMemo(() => {
    if (!hasActiveFilters(filters)) return "Conciertos y festivales en España";
    const parts: string[] = [];
    if (filters.artist) parts.push(`de ${filters.artist}`);
    if (filters.city) parts.push(`en ${filters.city}`);
    if (filters.genre) parts.push(filters.genre);
    return `Conciertos ${parts.join(" ")}`.trim();
  }, [filters]);

  useSeoMeta({
    title: dynamicTitle,
    description: filters.city
      ? `Todos los conciertos y festivales en ${filters.city}. Encuentra viajes compartidos baratos desde cualquier ciudad con ConcertRide ES.`
      : "Todos los conciertos y festivales de música en España. Encuentra viajes compartidos baratos para llegar al show desde Madrid, Barcelona, Valencia, Sevilla y más.",
    canonical: "https://concertride.es/concerts",
    keywords: `conciertos ${filters.city || "España"}, festivales música, carpooling conciertos, viajes compartidos, ${filters.genre || "música en directo"}`,
  });

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
    // Compute fresh dates on every fetch — not at module load time
    const nowISO = new Date().toISOString();
    const threeMonthsAgoISO = new Date(Date.now() - THREE_MONTHS_MS).toISOString();

    setLoading(true);
    setConcerts(null);

    const baseDateFrom = tab === "past" ? threeMonthsAgoISO : nowISO;
    const baseDateTo = tab === "past" ? nowISO : undefined;

    const params = {
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      city: filters.city || undefined,
      artist: debouncedArtist || undefined,
      genre: filters.genre || undefined,
      festival: filters.festival || undefined,
      date_from: filters.dateFrom
        ? tab === "active" && new Date(filters.dateFrom) < new Date()
          ? nowISO
          : new Date(filters.dateFrom).toISOString()
        : baseDateFrom,
      date_to: filters.dateTo
        ? new Date(filters.dateTo + "T23:59:59").toISOString()
        : baseDateTo,
    };

    api.concerts
      .list(params)
      .then((r) => {
        setConcerts(r.concerts);
        setTotal(r.total);
      })
      .catch(() => {
        setConcerts([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [tab, page, filters.city, filters.genre, filters.festival, filters.dateFrom, filters.dateTo, debouncedArtist]);

  useEffect(() => {
    fetchConcerts();
    // Scroll to grid top when page changes (not on initial load)
    if (page > 1) gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [fetchConcerts, page]);

  function setFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  }

  function setTab(t: Tab) {
    setSearchParams(t === "past" ? { tab: "past" } : {}, { replace: true });
    setFilters(EMPTY_FILTERS);
    setPage(1);
  }

  function goToPage(p: number) {
    setPage(p);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const pageConcerts = concerts ?? [];
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-cr-bg text-cr-text pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: BREADCRUMB_CONCERTS_JSON_LD }}
      />
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("festival", !filters.festival)}
              aria-pressed={filters.festival}
              className={`inline-flex items-center gap-2 px-4 py-2 border font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                filters.festival
                  ? "border-cr-secondary text-cr-secondary bg-cr-secondary/10"
                  : "border-cr-border text-cr-text-muted hover:border-cr-secondary hover:text-cr-secondary"
              }`}
            >
              <Sparkles size={13} />
              Solo festivales
            </button>
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
                {facets.cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
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
                disabled={facets.genres.length === 0}
                className="w-full bg-cr-surface-2 border border-cr-border px-3 py-2 font-mono text-xs text-cr-text focus:outline-none focus:border-cr-primary [color-scheme:dark] disabled:opacity-50"
              >
                <option value="">Todos</option>
                {facets.genres.map((g) => (
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
                onClick={() => { setFilters(EMPTY_FILTERS); setPage(1); }}
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
            {!loading && tab === "active" && total > 0 && (
              <span className="font-mono text-[10px] text-cr-text-dim">({total})</span>
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
            {!loading && tab === "past" && total > 0 && (
              <span className="font-mono text-[10px] text-cr-text-dim">({total})</span>
            )}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div ref={gridRef} className="max-w-6xl mx-auto px-6 pb-24">
        {loading ? (
          <LoadingSpinner text="Cargando conciertos…" />
        ) : pageConcerts.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-2xl uppercase text-cr-text-muted mb-2">
              Sin resultados
            </p>
            <p className="font-sans text-sm text-cr-text-dim">
              Prueba a cambiar los filtros.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pageConcerts.map((c) => (
                <Link key={c.id} to={`/concerts/${c.id}`} className="block">
                  <ConcertCard concert={c} />
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 px-3 py-2 border border-cr-border font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted hover:border-cr-primary hover:text-cr-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={13} />
                  Anterior
                </button>

                <span className="font-mono text-xs text-cr-text-muted">
                  <span className="text-cr-text font-semibold">{page}</span>
                  {" "}/{" "}
                  {totalPages}
                </span>

                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-2 border border-cr-border font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted hover:border-cr-primary hover:text-cr-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                  <ChevronRight size={13} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

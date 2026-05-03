import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { SlidersHorizontal, Sparkles, X, Clock, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import type { Concert } from "@concertride/types";
import { api } from "@/lib/api";
import { ConcertCard } from "@/components/ConcertCard";
import { LoadingSpinner } from "@/components/ui";

const PAGE_SIZE = 24;
// Past tab: show concerts from up to 3 months ago
const TWO_MONTHS_MS = 60 * 24 * 60 * 60 * 1000;

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
    { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Conciertos", item: `${SITE_URL}/concerts` },
  ],
});

const WEBPAGE_CONCERTS_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/concerts#webpage`,
  url: `${SITE_URL}/concerts`,
  name: "Conciertos y festivales en España con carpooling | ConcertRide",
  description: "Directorio de conciertos en España con viajes compartidos disponibles. Filtra por ciudad, artista o fecha. Sin comisión, conductores verificados.",
  inLanguage: "es-ES",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#service` },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".speakable"],
  },
});

export default function ConcertsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [concerts, setConcerts] = useState<Concert[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [filters, setFilters] = useState<Filters>(() => {
    const q = searchParams.get("q") ?? "";
    const city = searchParams.get("city") ?? "";
    const genre = searchParams.get("genre") ?? "";
    return { ...EMPTY_FILTERS, artist: q, city, genre };
  });
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
    const year = new Date().getFullYear();
    if (!hasActiveFilters(filters)) return `Conciertos y festivales en España ${year} | ConcertRide`;
    const parts: string[] = [];
    if (filters.artist) parts.push(`de ${filters.artist}`);
    if (filters.city) parts.push(`en ${filters.city}`);
    if (filters.genre) parts.push(filters.genre);
    return `Conciertos ${parts.join(" ")} ${year} | ConcertRide`.trim();
  }, [filters]);

  useSeoMeta({
    title: dynamicTitle,
    description: filters.city
      ? `Conciertos y festivales en ${filters.city} ${new Date().getFullYear()}. Carpooling sin comisión para llegar al show — conductores verificados, pago en efectivo o Bizum.`
      : `Conciertos en España ${new Date().getFullYear()} con carpooling disponible. Mad Cool, Primavera Sound, Arenal Sound y más. Sin comisión, sin taxi. ConcertRide.`,
    canonical: `${SITE_URL}/concerts`,
    keywords: [
      `conciertos en España ${new Date().getFullYear()}`,
      `conciertos ${filters.city || "España"}`,
      "conciertos música España",
      "carpooling conciertos España",
      "viajes compartidos conciertos",
      "coche compartido festival España",
      "carpooling festival España",
      "conciertos sin taxi",
      "transporte compartido conciertos",
      "cómo ir al concierto en coche compartido",
      filters.genre ? `conciertos ${filters.genre} España` : "festivales música España",
      "carpooling sin comisión España",
      "BlaBlaCar conciertos alternativa",
      `conciertos ${new Date().getFullYear()} ${new Date().getFullYear() + 1}`,
    ].filter(Boolean).join(", "),
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
    const twoMonthsAgoISO = new Date(Date.now() - TWO_MONTHS_MS).toISOString();

    setLoading(true);
    setConcerts(null);

    const baseDateFrom = tab === "past" ? twoMonthsAgoISO : nowISO;
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

    setLoadError(false);
    api.concerts
      .list(params)
      .then((r) => {
        setConcerts(r.concerts);
        setTotal(r.total);
      })
      .catch(() => {
        setConcerts([]);
        setTotal(0);
        setLoadError(true);
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: WEBPAGE_CONCERTS_JSON_LD }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: BREADCRUMB_CONCERTS_JSON_LD }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Conciertos y festivales en España con carpooling",
            description: "Listado de conciertos y festivales en España con viajes compartidos disponibles en ConcertRide.",
            url: `${SITE_URL}/concerts`,
            numberOfItems: total,
            itemListOrder: "https://schema.org/ItemListOrderAscending",
            itemListElement: (concerts ?? []).slice(0, 20).map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/concerts/${c.id}`,
              name: `${c.artist} — ${c.venue?.name ?? ""}`,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "¿Qué es ConcertRide?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "ConcertRide es la primera plataforma española de carpooling exclusiva para conciertos y festivales. Conecta conductores y pasajeros que van al mismo evento, sin comisión y con conductores verificados.",
                },
              },
              {
                "@type": "Question",
                name: "¿Cómo busco un viaje compartido a un concierto?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Introduce el nombre del artista, la ciudad o el festival en el buscador. Verás todos los viajes disponibles con precio, origen y valoraciones del conductor. El pago se hace en efectivo o Bizum el día del viaje.",
                },
              },
              {
                "@type": "Question",
                name: "¿Cuánto cuesta un viaje compartido a un concierto en España?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Los precios típicos van de 3 a 20 € por asiento según la distancia. Los conductores fijan el precio para cubrir combustible y peajes. ConcertRide no cobra comisión ni cargos de servicio.",
                },
              },
            ],
          }),
        }}
      />
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">Conciertos</span>
        </nav>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Explorar
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
              Todos los
              <br />
              conciertos.
            </h1>
            <p className="font-sans text-sm text-cr-text-muted max-w-2xl leading-relaxed speakable mt-3">
              ConcertRide es la plataforma española de carpooling exclusiva para conciertos y festivales. Busca viajes compartidos a más de 50 festivales y miles de conciertos en España — sin comisión, sin taxi, con conductores verificados.
            </p>
          </div>
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
        ) : loadError ? (
          <div className="py-24 text-center">
            <p className="font-display text-2xl uppercase text-cr-text-muted mb-2">Error al cargar</p>
            <p className="font-sans text-sm text-cr-text-dim">No se pudieron cargar los conciertos. Inténtalo de nuevo.</p>
          </div>
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

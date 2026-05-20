import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { SlidersHorizontal, Sparkles, X, Clock, Zap, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { Concert } from "@concertride/types";
import { api } from "@/lib/api";
import { ConcertCard } from "@/components/ConcertCard";
import { LoadingSpinner } from "@/components/ui";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";

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
      ? `Conciertos en ${filters.city} ${new Date().getFullYear()}: Mad Cool, Primavera Sound, Arenal Sound. Carpooling desde 3–7 €/asiento sin comisión. Conductores verificados.`
      : `Conciertos en España ${new Date().getFullYear()} con carpooling desde 3–7 €/asiento. Mad Cool, Primavera Sound, Arenal Sound, FIB. Sin comisión, pago efectivo/Bizum.`,
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
      "carpooling conciertos alternativa",
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
    trackEvent(ANALYTICS_EVENTS.CONCERT_SEARCH_FILTER_APPLIED, {
      filter_type: String(key),
      filter_value: typeof value === "string" ? value : String(value),
    });
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
    <main id="main" className="min-h-screen bg-cr-bg text-cr-text pt-16">
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
              name: `${c.artist} · ${c.venue?.name ?? ""}`,
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
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          aria-label="Breadcrumb"
          className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2"
        >
          <Link to="/" className="hover:text-cr-primary transition-colors">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">Conciertos</span>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-primary mb-3">
            Explorar
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92] tracking-tight">
                Todos los
                <br />
                conciertos.
              </h1>
              <p className="font-sans text-sm text-cr-text-muted max-w-2xl leading-relaxed speakable mt-3">
                La plataforma española de carpooling exclusiva para conciertos y festivales. Sin comisión, sin taxi, conductores verificados.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setFilter("festival", !filters.festival)}
                aria-pressed={filters.festival}
                aria-label={filters.festival ? "Mostrar todos los conciertos (quitar filtro festivales)" : "Filtrar solo festivales"}
                className={`inline-flex items-center gap-2 h-9 px-4 border font-mono text-[11px] font-bold uppercase tracking-[0.1em] transition-colors ${
                  filters.festival
                    ? "border-cr-secondary text-cr-secondary bg-cr-secondary/10"
                    : "border-cr-border text-cr-text-muted hover:border-cr-secondary hover:text-cr-secondary"
                }`}
              >
                <Sparkles size={12} aria-hidden="true" />
                Festivales
              </button>
              <button
                onClick={() => setShowFilters((v) => !v)}
                aria-expanded={showFilters}
                aria-controls="concerts-filters"
                aria-label={hasActiveFilters(filters) ? `Filtros activos (${Object.values(filters).filter(Boolean).length}). Abrir panel de filtros` : "Abrir panel de filtros"}
                className={`inline-flex items-center gap-2 h-9 px-4 border font-mono text-[11px] font-bold uppercase tracking-[0.1em] transition-colors ${
                  hasActiveFilters(filters) || showFilters
                    ? "border-cr-primary text-cr-primary bg-cr-primary/5"
                    : "border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary"
                }`}
              >
                <SlidersHorizontal size={12} />
                Filtrar
                {hasActiveFilters(filters) && (
                  <span className="bg-cr-primary text-black w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                    {Object.values(filters).filter(Boolean).length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Artist search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative"
        >
          <label htmlFor="concerts-search" className="sr-only">Buscar artista o festival</label>
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" aria-hidden="true" />
          <input
            id="concerts-search"
            type="search"
            placeholder="Buscar artista o festival…"
            value={filters.artist}
            onChange={(e) => setFilter("artist", e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.08] pl-10 pr-4 py-3 font-mono text-sm text-cr-text placeholder:text-white/20 focus:outline-none focus:border-cr-primary focus:shadow-[0_0_12px_rgb(219_255_0/0.1)] transition-all duration-150"
          />
        </motion.div>

        {/* Filter panel — animated */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              id="concerts-filters"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <fieldset className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border border-white/[0.08] bg-white/[0.02]">
                <legend className="sr-only">Filtros de búsqueda de conciertos</legend>

                <div className="space-y-1.5">
                  <label htmlFor="filter-city" className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                    Ciudad
                  </label>
                  <select
                    id="filter-city"
                    value={filters.city}
                    onChange={(e) => setFilter("city", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.1] px-3 py-2 font-mono text-xs text-cr-text focus:outline-none focus:border-cr-primary [color-scheme:dark] transition-colors"
                  >
                    <option value="">Todas</option>
                    {facets.cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="filter-genre" className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                    Género
                  </label>
                  <select
                    id="filter-genre"
                    value={filters.genre}
                    onChange={(e) => setFilter("genre", e.target.value)}
                    disabled={facets.genres.length === 0}
                    className="w-full bg-white/[0.04] border border-white/[0.1] px-3 py-2 font-mono text-xs text-cr-text focus:outline-none focus:border-cr-primary [color-scheme:dark] disabled:opacity-50 transition-colors"
                  >
                    <option value="">Todos</option>
                    {facets.genres.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="filter-date-from" className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                    Desde
                  </label>
                  <input
                    id="filter-date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilter("dateFrom", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.1] px-3 py-2 font-mono text-xs text-cr-text focus:outline-none focus:border-cr-primary [color-scheme:dark] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="filter-date-to" className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                    Hasta
                  </label>
                  <input
                    id="filter-date-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilter("dateTo", e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.1] px-3 py-2 font-mono text-xs text-cr-text focus:outline-none focus:border-cr-primary [color-scheme:dark] transition-colors"
                  />
                </div>

                {hasActiveFilters(filters) && (
                  <button
                    onClick={() => { setFilters(EMPTY_FILTERS); setPage(1); }}
                    aria-label="Limpiar todos los filtros activos"
                    className="col-span-2 md:col-span-4 inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-white/30 hover:text-cr-primary transition-colors"
                  >
                    <X size={11} aria-hidden="true" />
                    Limpiar filtros
                  </button>
                )}
              </fieldset>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div role="tablist" aria-label="Ver conciertos por fecha" className="relative flex gap-0 border-b border-cr-border">
          {["active", "past"].map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t as Tab)}
              className={`relative inline-flex items-center gap-1.5 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
                tab === t
                  ? "text-cr-primary"
                  : "text-cr-text-muted hover:text-cr-text"
              }`}
            >
              {t === "active" ? <Zap size={11} aria-hidden="true" /> : <Clock size={11} aria-hidden="true" />}
              {t === "active" ? "Próximos" : "Pasados"}
              {!loading && tab === t && total > 0 && (
                <span className="font-mono text-[10px] text-cr-text-dim" aria-label={`${total} conciertos`}>({total})</span>
              )}
              {tab === t && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-cr-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  aria-hidden="true"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div ref={gridRef} className="max-w-6xl mx-auto px-6 pb-24">
        {loading ? (
          <div aria-live="polite" aria-atomic="true" aria-busy="true">
            <LoadingSpinner text="Cargando conciertos…" />
          </div>
        ) : loadError ? (
          <div className="py-24 text-center" role="alert">
            <p className="font-display text-2xl uppercase text-cr-text-muted mb-2">Error al cargar</p>
            <p className="font-sans text-sm text-cr-text-dim">No se pudieron cargar los conciertos. Inténtalo de nuevo.</p>
          </div>
        ) : pageConcerts.length === 0 ? (
          <div className="py-24 text-center" role="status" aria-live="polite" aria-atomic="true">
            <p className="font-display text-2xl uppercase text-cr-text-muted mb-2">
              Sin resultados
            </p>
            <p className="font-sans text-sm text-cr-text-dim">
              No hemos encontrado conciertos con esos filtros. Prueba a cambiar la ciudad, el artista o el género.
            </p>
          </div>
        ) : (
          <>
            <motion.ul
              role="list"
              aria-label={`${total} conciertos encontrados`}
              aria-live="polite"
              aria-atomic="false"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {pageConcerts.map((c) => (
                <motion.li
                  key={c.id}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  <Link to={`/concerts/${c.id}`} className="block">
                    <ConcertCard concert={c} />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

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
    </main>
  );
}

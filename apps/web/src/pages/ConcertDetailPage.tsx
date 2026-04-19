import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, MapPin, Music2 } from "lucide-react";
import type { Concert, Ride, Vibe } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/format";
import { TicketCard } from "@/components/TicketCard";
import { TicketCardSkeleton } from "@/components/LoadingStates";
import { FilterBar, EMPTY_FILTERS, type FilterState } from "@/components/FilterBar";

function hueFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

export default function ConcertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [concert, setConcert] = useState<Concert | null>(null);
  const [rides, setRides] = useState<Ride[] | null>(null);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setConcert(null);
    setRides(null);
    setError(null);

    Promise.all([api.concerts.get(id), api.rides.list({ concert_id: id })])
      .then(([c, r]) => {
        setConcert(c);
        setRides(r.rides);
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 404) setError("concert_not_found");
        else setError("load_failed");
      });
  }, [id]);

  const cities = useMemo(() => {
    if (!rides) return [];
    return Array.from(new Set(rides.map((r) => r.origin_city))).sort();
  }, [rides]);

  const visible = useMemo(() => {
    if (!rides) return [];
    return rides.filter((r) => {
      if (filters.origin_city && r.origin_city !== filters.origin_city) return false;
      if (filters.max_price && r.price_per_seat > Number(filters.max_price)) return false;
      if (filters.vibe && r.vibe !== (filters.vibe as Vibe)) return false;
      if (filters.round_trip === "yes" && !r.round_trip) return false;
      if (filters.round_trip === "no" && r.round_trip) return false;
      return true;
    });
  }, [rides, filters]);

  useEffect(() => {
    if (!concert) return;
    document.title = `Viajes a ${concert.artist} en ${concert.venue.name} — ConcertRide ES`;
  }, [concert]);

  if (error === "concert_not_found") {
    return (
      <main className="min-h-dvh flex items-center justify-center px-6 bg-cr-bg">
        <div className="text-center space-y-4 max-w-md">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-secondary">
            404
          </p>
          <h1 className="font-display text-3xl uppercase">Concierto no encontrado</h1>
          <p className="font-sans text-sm text-cr-text-muted">
            Igual se agotó o nunca existió. Vuelve al directorio.
          </p>
          <Link
            to="/"
            className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-primary border-b border-cr-primary pb-0.5"
          >
            ← Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const hue = concert ? hueFromString(concert.artist) : 0;

  return (
    <main id="main" className="bg-cr-bg text-cr-text min-h-dvh">
      {concert && <JsonLdEvent concert={concert} />}

      <section
        className="relative overflow-hidden border-b border-cr-border"
        style={{
          background: concert
            ? `radial-gradient(circle at 30% 20%, hsl(${hue} 60% 10%), #080808 70%)`
            : "#080808",
        }}
      >
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-cr-bg via-cr-bg/50 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            <ArrowLeft size={14} /> Volver
          </button>

          {concert ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
                Concierto · {concert.genre ?? "Música en vivo"}
              </p>
              <h1 className="font-display uppercase text-4xl md:text-7xl leading-[0.95]">
                {concert.artist}
              </h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-cr-text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={12} aria-hidden="true" />
                  {concert.venue.name} · {concert.venue.city}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={12} aria-hidden="true" />
                  {formatDate(concert.date)} · {formatTime(concert.date)}
                </span>
                {concert.price_min !== null && (
                  <span className="inline-flex items-center gap-1.5">
                    <Music2 size={12} aria-hidden="true" />
                    Entradas desde €{concert.price_min}
                  </span>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="h-24 w-3/4 bg-cr-surface-2 cr-shimmer" />
          )}
        </div>
      </section>

      <FilterBar value={filters} onChange={setFilters} cities={cities} />

      <section className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <header className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-xl uppercase tracking-wide">
            Viajes disponibles
          </h2>
          <p className="font-mono text-xs text-cr-text-muted">
            {rides ? `${visible.length} / ${rides.length}` : "…"}
          </p>
        </header>

        {!rides && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <TicketCardSkeleton />
            <TicketCardSkeleton />
            <TicketCardSkeleton />
          </div>
        )}

        {rides && visible.length === 0 && (
          <div className="border border-dashed border-cr-border p-10 text-center space-y-4">
            <p className="font-display text-xl uppercase">
              {rides.length === 0 ? "Nadie ha publicado viajes todavía." : "Ningún viaje cumple los filtros."}
            </p>
            <p className="font-sans text-sm text-cr-text-muted">
              {rides.length === 0
                ? "Sé el primero en abrir tu coche. Divide el coste y llena el viaje."
                : "Prueba a relajar el precio máximo o la ciudad de origen."}
            </p>
            {rides.length === 0 && (
              <Link
                to="/publish"
                className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
              >
                Publicar un viaje
              </Link>
            )}
          </div>
        )}

        {rides && visible.length > 0 && (
          <motion.ol
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
            }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-4"
          >
            {visible.map((ride) => (
              <motion.li
                key={ride.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                }}
              >
                <TicketCard
                  ride={ride}
                  onClick={() => navigate(`/rides/${ride.id}`)}
                />
              </motion.li>
            ))}
          </motion.ol>
        )}
      </section>
    </main>
  );
}

function JsonLdEvent({ concert }: { concert: Concert }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: concert.name,
    performer: { "@type": "MusicGroup", name: concert.artist },
    startDate: concert.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: concert.venue.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: concert.venue.city,
        addressCountry: "ES",
        streetAddress: concert.venue.address,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: concert.venue.lat,
        longitude: concert.venue.lng,
      },
    },
    ...(concert.price_min !== null && {
      offers: {
        "@type": "Offer",
        price: String(concert.price_min),
        priceCurrency: "EUR",
      },
    }),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

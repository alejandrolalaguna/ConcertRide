import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Link2, MapPin, Music2, Star, Users } from "lucide-react";
import { concertShareUrl } from "@/lib/utm";

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
import type { Concert, DemandSignal, Ride, Vibe } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { formatDate, formatTime } from "@/lib/format";
import { concertStatus } from "@/components/ConcertCard";
import { TicketCard } from "@/components/TicketCard";
import { TicketCardSkeleton } from "@/components/LoadingStates";
import { FilterBar, EMPTY_FILTERS, type FilterState } from "@/components/FilterBar";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ConcertPoster } from "@/components/ConcertPoster";
import { ConcertChatSection } from "@/components/ConcertChatSection";

function hueFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

export default function ConcertDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSession();
  const [concert, setConcert] = useState<Concert | null>(null);
  const [rides, setRides] = useState<Ride[] | null>(null);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [error, setError] = useState<string | null>(null);
  const [demand, setDemand] = useState<DemandSignal | null>(null);
  const [demandLoading, setDemandLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useSeoMeta({
    title: concert
      ? `Viajes a ${concert.artist} en ${concert.venue.name} — ConcertRide ES`
      : "Concierto — ConcertRide ES",
    description: concert
      ? `Viaje compartido para ver a ${concert.artist} en ${concert.venue.name} (${concert.venue.city}). Carpooling desde cualquier ciudad, sin comisión, conductores verificados. Divide el coste con otros fans.`
      : "Encuentra un viaje compartido para ir al concierto en España.",
    canonical: id ? `${SITE_URL}/concerts/${id}` : undefined,
    keywords: concert
      ? `${concert.artist}, cómo ir a ${concert.artist}, viaje compartido ${concert.artist}, carpooling ${concert.venue.city}, transporte ${concert.artist} ${concert.venue.city}, coche compartido ${concert.venue.name}, concierto ${concert.venue.city} 2026, ${concert.genre ?? "conciertos"} España, compartir coche ${concert.venue.city}`
      : undefined,
    ogImage: concert?.image_url ?? undefined,
  });

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
    api.concerts.getInterest(id).then(setDemand).catch(() => {});
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
      if (filters.near_lat !== null && filters.near_lng !== null) {
        const dist = haversineKm(filters.near_lat, filters.near_lng, r.origin_lat, r.origin_lng);
        if (dist > filters.radius_km) return false;
      }
      if (filters.no_smoking && r.smoking_policy !== "no") return false;
      return true;
    });
  }, [rides, filters]);

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
  const isPast = concert ? concertStatus(concert.date) !== "upcoming" : false;

  return (
    <main id="main" className="bg-cr-bg text-cr-text min-h-dvh">
      {concert && <JsonLdEvent concert={concert} />}
      {concert && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Conciertos", item: `${SITE_URL}/concerts` },
                { "@type": "ListItem", position: 3, name: concert.artist, item: `${SITE_URL}/concerts/${concert.id}` },
              ],
            }),
          }}
        />
      )}

      <section
        className="relative overflow-hidden border-b border-cr-border min-h-[280px] md:min-h-[360px]"
        style={{
          background: concert && !concert.image_url
            ? undefined
            : concert?.image_url
              ? "#080808"
              : `radial-gradient(circle at 30% 20%, hsl(${hue} 60% 10%), #080808 70%)`,
        }}
      >
        {/* Background poster (procedural) when no real image is available */}
        {concert && !concert.image_url && (
          <div aria-hidden="true" className="absolute inset-0 opacity-70">
            <ConcertPoster concert={concert} />
          </div>
        )}
        {/* Real image as backdrop when available */}
        {concert?.image_url && (
          <img
            src={concert.image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-cr-bg via-cr-bg/70 to-cr-bg/30" />
        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              <ArrowLeft size={14} /> Volver
            </button>
            {concert && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const campaign = concert.artist.toLowerCase().replace(/\s+/g, "-").slice(0, 30);
                    const url = concertShareUrl(concert.id, campaign, "whatsapp");
                    const text = `🎶 ${concert.artist} en ${concert.venue.city}. ¿Nos organizamos un viaje? ${url}`;
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(text)}`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                  title="Compartir por WhatsApp"
                  className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
                >
                  <span aria-hidden="true">💬</span> WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const campaign = concert.artist.toLowerCase().replace(/\s+/g, "-").slice(0, 30);
                    const url = concertShareUrl(concert.id, campaign, "copy");
                    navigator.clipboard.writeText(url).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    });
                  }}
                  className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
                >
                  <Link2 size={14} aria-hidden="true" />
                  {copied ? "¡Copiado!" : "Copiar enlace"}
                </button>
              </div>
            )}
          </div>

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

              {/* Favorites — this concert, the artist, the city */}
              <div className="flex flex-wrap gap-2 pt-1">
                <FavoriteButton
                  kind="concert"
                  targetId={concert.id}
                  label={`${concert.artist} — ${concert.venue.city}`}
                  variant="pill"
                  promptLoginOnAnon
                />
                <FavoriteButton
                  kind="artist"
                  targetId={concert.artist}
                  label={concert.artist}
                  variant="pill"
                  promptLoginOnAnon
                  className="!text-[11px]"
                />
                <FavoriteButton
                  kind="city"
                  targetId={concert.venue.city}
                  label={concert.venue.city}
                  variant="pill"
                  promptLoginOnAnon
                />
              </div>

              {concert.lineup && (
                <div className="pt-2">
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted mb-1">
                    Cartel
                  </p>
                  <p className="font-mono text-sm text-cr-text leading-relaxed">
                    {concert.lineup}
                  </p>
                </div>
              )}

              {(concert.official_url || concert.ticketmaster_url) && (
                <div className="pt-1 flex flex-wrap gap-2">
                  {concert.official_url && (
                    <a
                      href={concert.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.1em] border-2 border-cr-primary text-cr-primary hover:bg-cr-primary/10 px-3 py-1.5 transition-colors"
                    >
                      Web oficial / entradas →
                    </a>
                  )}
                  {concert.ticketmaster_url && (
                    <a
                      href={concert.ticketmaster_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.1em] border border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary px-3 py-1.5 transition-colors"
                    >
                      <span aria-hidden="true" className="text-[10px] font-mono text-cr-text-dim">TM</span>
                      Ticketmaster →
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="h-24 w-3/4 bg-cr-surface-2 cr-shimmer" />
          )}
        </div>
      </section>

      <FilterBar value={filters} onChange={setFilters} cities={cities} />

      <section className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        {demand !== null && !isPast && (
          <div className="flex items-center justify-between gap-4 border border-dashed border-cr-border p-4">
            <div className="flex items-center gap-3">
              <Users size={16} className="text-cr-primary" aria-hidden="true" />
              <p className="font-mono text-sm text-cr-text">
                {demand.count > 0 ? (
                  <>
                    <span className="text-cr-primary font-semibold">{demand.count}</span>
                    {" "}persona{demand.count === 1 ? "" : "s"} busca{demand.count === 1 ? "" : "n"} viaje
                  </>
                ) : (
                  <span className="text-cr-text-muted">Nadie busca viaje todavía</span>
                )}
              </p>
            </div>
            {user ? (
              <button
                type="button"
                disabled={demandLoading}
                onClick={async () => {
                  setDemandLoading(true);
                  try {
                    const updated = await api.concerts.toggleInterest(id!);
                    setDemand(updated);
                  } finally {
                    setDemandLoading(false);
                  }
                }}
                className={`font-sans text-xs font-semibold uppercase tracking-[0.1em] px-4 py-2 border-2 transition-colors disabled:opacity-40 ${
                  demand.user_has_signaled
                    ? "border-cr-primary bg-cr-primary text-black"
                    : "border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary"
                }`}
              >
                {demandLoading ? "…" : demand.user_has_signaled ? "Apuntado" : "Necesito un viaje"}
              </button>
            ) : (
              <Link
                to={`/login?next=${encodeURIComponent(`/concerts/${id}`)}`}
                className="font-sans text-xs font-semibold uppercase tracking-[0.1em] px-4 py-2 border-2 border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary transition-colors"
              >
                Necesito un viaje
              </Link>
            )}
          </div>
        )}

        <header className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-xl uppercase tracking-wide">
            {isPast ? "Viajes realizados" : "Viajes disponibles"}
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
              {rides.length === 0
                ? isPast
                  ? "No se publicaron viajes para este concierto."
                  : "Nadie ha publicado viajes todavía."
                : "Ningún viaje cumple los filtros."}
            </p>
            <p className="font-sans text-sm text-cr-text-muted">
              {rides.length === 0
                ? isPast
                  ? "Este concierto ya tuvo lugar."
                  : "Sé el primero en abrir tu coche. Divide el coste y llena el viaje."
                : "Prueba a relajar el precio máximo o la ciudad de origen."}
            </p>
            {rides.length === 0 && !isPast && (
              <Link
                to={`/publish?concert=${concert!.id}`}
                className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
              >
                Publicar un viaje
              </Link>
            )}
          </div>
        )}

        {rides && visible.length > 0 && (
          <>
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

            {isPast && (
              <div className="border border-cr-primary/30 bg-cr-primary/[0.04] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-1.5">
                    <Star size={12} aria-hidden="true" />
                    ¿Fuiste a este concierto?
                  </p>
                  <p className="font-sans text-sm text-cr-text-muted">
                    Entra en tu viaje y valora al conductor.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {visible.slice(0, 3).map((ride) => (
                    <Link
                      key={ride.id}
                      to={`/rides/${ride.id}`}
                      className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.1em] border border-cr-primary text-cr-primary px-3 py-2 hover:bg-cr-primary hover:text-black transition-colors"
                    >
                      Desde {ride.origin_city}
                    </Link>
                  ))}
                  {visible.length > 3 && (
                    <span className="font-mono text-xs text-cr-text-muted self-center">
                      +{visible.length - 3} más
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {concert && !isPast && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <ConcertChatSection concertId={concert.id} artist={concert.artist} />
        </section>
      )}
    </main>
  );
}

function JsonLdEvent({ concert }: { concert: Concert }) {
  const startMs = new Date(concert.date).getTime();
  const endDate = Number.isFinite(startMs)
    ? new Date(startMs + 3 * 60 * 60 * 1000).toISOString()
    : undefined;
  const url = `${SITE_URL}/concerts/${concert.id}`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: concert.name,
    url,
    description: `Concierto de ${concert.artist} en ${concert.venue.name} (${concert.venue.city}). Encuentra viajes compartidos desde toda España en ConcertRide.`,
    performer: {
      "@type": "MusicGroup",
      name: concert.artist,
    },
    organizer: {
      "@type": "Organization",
      name: "ConcertRide ES",
      url: `${SITE_URL}/`,
    },
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
  };

  if (endDate) jsonLd.endDate = endDate;
  if (concert.image_url) jsonLd.image = [concert.image_url];

  if (concert.price_min !== null) {
    jsonLd.offers = {
      "@type": "Offer",
      price: String(concert.price_min),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: concert.official_url ?? concert.ticketmaster_url ?? url,
      validFrom: new Date().toISOString(),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

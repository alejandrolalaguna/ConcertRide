import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const ConcertRidesMap = lazy(() => import("@/components/ConcertRidesMap"));
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Calendar, Link2, MapPin, Music2, Star, Users, X } from "lucide-react";
import { concertShareUrl } from "@/lib/utm";
import { cfImage } from "@/lib/imageUrl";
import { VENUE_LANDINGS } from "@/lib/venueLandings";
import { FESTIVAL_LANDINGS } from "@/lib/festivalLandings";
import { EventTransportHub, generateTransportHubSchema } from "@/components/EventTransportHub";
import type { TransportMode } from "@/components/EventTransportHub";

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
// Re-exported as alias for helper component typing
type ConcertEntity = Concert;
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
import { AnticipationStrip } from "@/components/AnticipationStrip";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { CrewAvatars } from "@/components/CrewAvatars";
import { useCrew } from "@/lib/crew";
import { SquadsForConcert } from "@/components/SquadsForConcert";
import { computeMusicMatch } from "@/lib/musicMatch";
import { FactDensityCallout } from "@/components/FactDensityCallout";
import { AgentActionRail } from "@/components/AgentActionRail";
import { StickyRegBar } from "@/components/StickyRegBar";
import { useI18n } from "@/lib/i18n";

function hueFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

export default function ConcertDetailPage() {
  const { t } = useI18n();
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
  const [alertSubscribed, setAlertSubscribed] = useState(false);
  const [alertLoading, setAlertLoading] = useState(false);

  // Cheapest ride for this concert (if any) drives the title CTR + the
  // Spanish meta description's price hook. ConcertRide's own pricing
  // (3–20 €/asiento range) — not Ticketmaster ticket prices.
  const cheapestRide = rides && rides.length > 0
    ? rides.reduce((min, r) => (r.price_per_seat < min.price_per_seat ? r : min), rides[0]!)
    : null;
  const priceFrom = cheapestRide?.price_per_seat ?? null;
  // Trimmed to ≤160 chars including the price anchor for AI extraction.
  // Generic fallback "desde 3€" mirrors the value range surfaced site-wide.
  const cdpDesc = concert
    ? (priceFrom !== null
        ? `Carpooling a ${concert.artist} en ${concert.venue.city}: desde ${priceFrom} €/asiento, 0% comisión, conductores verificados. Divide el coste y llega sin taxi.`
        : `Carpooling a ${concert.artist} en ${concert.venue.city}: desde 3 €/asiento, 0% comisión, conductores verificados. Divide el coste y llega sin taxi.`)
    : "Encuentra un viaje compartido para ir al concierto en España.";

  useSeoMeta({
    title: concert
      ? `${concert.artist} ${concert.venue.city} ${new Date(concert.date).getFullYear()} · Carpooling | ConcertRide`
      : "Concierto · ConcertRide",
    description: cdpDesc,
    canonical: id ? `${SITE_URL}/concerts/${id}` : undefined,
    keywords: concert
      ? `${concert.artist} ${concert.venue.city} ${new Date(concert.date).getFullYear()}, carpooling ${concert.artist}, viaje compartido ${concert.artist}, cómo ir a ${concert.artist}, transporte ${concert.artist} ${concert.venue.city}, coche compartido ${concert.venue.name}, concierto ${concert.venue.city} ${new Date(concert.date).getFullYear()}, ${concert.genre ?? "conciertos"} España, compartir coche ${concert.venue.city}, carpooling concierto ${concert.venue.city}`
      : undefined,
    ogImage: concert?.image_url ?? undefined,
    ogType: "website",
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

  const { crew } = useCrew();
  const crewIds = useMemo(() => new Set(crew.map((c) => c.user.id)), [crew]);

  // Crew-weighted trust + music match scoring. We sort the visible
  // rides so that:
  //  1. Crew drivers always surface first (regardless of price)
  //  2. Within the rest, higher music compatibility wins
  //  3. Tie-break on price (cheaper first) so the UX stays predictable
  // The user can still ignore this sort by applying explicit filters.
  const visible = useMemo(() => {
    if (!rides) return [];
    const filtered = rides.filter((r) => {
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
    if (!user) return filtered;
    return filtered
      .map((r) => {
        const isCrew = crewIds.has(r.driver_id);
        const match = computeMusicMatch(user, r.driver);
        // Crew gets +200 baseline so it always sorts above non-crew, then
        // music score (0..100) layered on top.
        const score = (isCrew ? 200 : 0) + match.score;
        return { ride: r, score };
      })
      .sort((a, b) => b.score - a.score || a.ride.price_per_seat - b.ride.price_per_seat)
      .map((entry) => entry.ride);
  }, [rides, filters, user, crewIds]);

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
            {t("concertDetail.backHome")}
          </Link>
        </div>
      </main>
    );
  }

  const hue = concert ? hueFromString(concert.artist) : 0;
  const isPast = concert ? concertStatus(concert.date) !== "upcoming" : false;

  const jsonLdWebPage = concert ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/concerts/${concert.id}#webpage`,
    "url": `${SITE_URL}/concerts/${concert.id}`,
    "name": `${concert.artist} en ${concert.venue?.name || concert.venue?.city} — Carpooling | ConcertRide`,
    "description": `Viaje compartido a ${concert.artist} en ${concert.venue?.name || concert.venue?.city}. Busca o publica carpooling para este concierto en ConcertRide.`,
    "inLanguage": "es-ES",
    "isPartOf": { "@id": `${SITE_URL}/#website` },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".speakable", "article p:first-of-type"]
    }
  } : null;

  return (
    <>
    <main id="main" className="bg-cr-bg text-cr-text min-h-dvh">
      {concert && <JsonLdEvent concert={concert} carpoolingPriceFrom={priceFrom} />}
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
      {jsonLdWebPage && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />}
      {concert && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              inLanguage: "es-ES",
              mainEntity: [
                {
                  "@type": "Question",
                  name: `¿Cómo llegar a ${concert.venue.name} en ${concert.venue.city}?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `${concert.venue.name} está en ${concert.venue.city}${concert.venue.address ? ` (${concert.venue.address})` : ""}. Las opciones de transporte incluyen transporte público (metro, bus), taxi/VTC y carpooling con ConcertRide desde toda España. El carpooling es la opción más flexible para quienes vienen de otra ciudad.`,
                  },
                },
                {
                  "@type": "Question",
                  name: `¿Cómo reservo un viaje compartido a ${concert.artist} en ${concert.venue.city}?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Busca viajes disponibles en esta página, elige el que mejor te encaje por precio y ciudad de origen, y contacta al conductor. El pago se hace en efectivo o Bizum el día del viaje.",
                  },
                },
                {
                  "@type": "Question",
                  name: `¿Cuánto cuesta el carpooling a ${concert.artist}?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `Los conductores en ConcertRide fijan un precio para cubrir combustible y peajes: típicamente 3–8 € desde ciudades cercanas y 10–20 € desde ciudades a más de 200 km. ConcertRide no cobra comisión — el 100 % va al conductor. Pago en efectivo o Bizum el día del viaje.`,
                  },
                },
                {
                  "@type": "Question",
                  name: "¿Son seguros los conductores en ConcertRide?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Sí. Todos los conductores verifican su carnet de conducir antes de publicar viajes. Puedes ver valoraciones y reseñas de viajes anteriores en el perfil de cada conductor.",
                  },
                },
                {
                  "@type": "Question",
                  name: "¿Puedo volver con el mismo conductor después del concierto?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Sí, si el conductor publica también el viaje de vuelta. Puedes consultarlo en el chat directo con el conductor al reservar el viaje de ida.",
                  },
                },
                {
                  "@type": "Question",
                  name: `¿Hay parking en ${concert.venue.name}?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `La disponibilidad de parking varía según el recinto. Consulta la web oficial de ${concert.venue.name} o de la promotora. El carpooling con ConcertRide evita el coste y el estrés del parking: el conductor se encarga del vehículo y el coste se divide entre todos los pasajeros.`,
                  },
                },
                {
                  "@type": "Question",
                  name: `¿Cuál es la opción más barata para ir a ${concert.artist} en ${concert.venue.city}?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `El carpooling con ConcertRide suele ser la opción más económica para trayectos de más de 50 km: entre 3 y 20 € por asiento sin comisión. El transporte público (metro/bus) es más barato para distancias cortas dentro de la ciudad. El taxi/VTC puede costar 3–5 veces más, especialmente de madrugada.`,
                  },
                },
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
            src={cfImage(concert.image_url, { width: 1200, height: 630, quality: 75 })}
            srcSet={`${cfImage(concert.image_url, { width: 800, height: 420, quality: 75 })} 800w, ${cfImage(concert.image_url, { width: 1200, height: 630, quality: 75 })} 1200w`}
            sizes="100vw"
            alt={`${concert.artist} en ${concert.venue?.name ?? concert.venue?.city ?? ""}${concert.ticketmaster_url ? " — imagen © Ticketmaster" : ""}`}
            title={concert.ticketmaster_url ? "Imagen del evento © Ticketmaster®" : undefined}
            fetchPriority="high"
            loading="eager"
            width={1200}
            height={630}
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
              <ArrowLeft size={14} /> {t("concertDetail.back")}
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
                  title={t("concertDetail.shareWhatsApp")}
                  className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
                >
                  <span aria-hidden="true">💬</span> {t("concertDetail.whatsapp")}
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
                  {copied ? t("concertDetail.copied") : t("concertDetail.copyLink")}
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
              <h1
                className="font-display uppercase text-4xl md:text-7xl leading-[0.95] cr-vt-card"
                style={{ "--cr-vt-name": `concert-card-${concert.id}` } as CSSProperties}
              >
                {concert.artist} — {concert.venue?.city ?? concert.venue?.name} {new Date(concert.date).getFullYear()}
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

              {/* ── Agentic surface (Google I/O 2026 agentic commerce) ──
                  Three primary intents exposed as a stable nav with semantic
                  data-agent-action / data-intent so Gemini agents can plan
                  multi-step booking (find ride → view ride → buy ticket). */}
              <AgentActionRail
                ariaLabel={`Acciones disponibles para ${concert.artist} en ${concert.venue.city}`}
                actions={[
                  {
                    label: "Buscar carpooling",
                    href: `/concerts?city=${encodeURIComponent(concert.venue.city)}`,
                    intent: "search-ride",
                    variant: "primary",
                    description: `Buscar viajes compartidos disponibles a ${concert.venue.city} para este concierto`,
                  },
                  ...(concert.ticketmaster_url
                    ? [{
                        label: "Comprar entrada",
                        href: concert.ticketmaster_url,
                        intent: "buy-ticket" as const,
                        description: `Comprar entrada para ${concert.artist} en Ticketmaster`,
                      }]
                    : []),
                  {
                    label: "Publicar mi viaje",
                    href: "/publish",
                    intent: "publish-ride",
                    description: "Publicar un viaje compartido como conductor",
                  },
                ]}
              />

              {concert.lineup && (
                <div className="pt-2">
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted mb-1">
                    Cartel
                  </p>
                  <p className="font-mono text-sm text-cr-text leading-relaxed speakable">
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
                      title="Comprar entradas en Ticketmaster® (abre en nueva pestaña)"
                      className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.1em] border border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary px-3 py-1.5 transition-colors"
                    >
                      <span aria-hidden="true" className="text-[10px] font-mono text-cr-text-dim">TM</span>
                      Entradas en Ticketmaster® →
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

      {concert && (
        <AnticipationStrip
          concertId={concert.id}
          date={concert.date}
          artist={concert.artist}
        />
      )}

      {concert && <CrewAttendingForConcert concertId={concert.id} />}

      {concert && !isPast && <SquadsForConcert concertId={concert.id} artist={concert.artist} />}

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

        <header className="flex items-baseline justify-between gap-4 flex-wrap">
          <h2 className="font-display text-xl uppercase tracking-wide">
            {isPast ? "Viajes realizados" : "Viajes disponibles"}
          </h2>
          <div className="flex items-center gap-3">
            {/* Alert button — only for logged-in users on upcoming concerts */}
            {user && !isPast && concert && (
              <button
                type="button"
                aria-pressed={alertSubscribed}
                disabled={alertLoading}
                onClick={async () => {
                  if (alertSubscribed) return;
                  setAlertLoading(true);
                  try {
                    await api.alerts.subscribeConcert(concert.id);
                    setAlertSubscribed(true);
                  } catch {
                    // Best-effort; silently absorb network errors
                  } finally {
                    setAlertLoading(false);
                  }
                }}
                className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] px-3 py-1.5 border transition-colors disabled:opacity-50 ${
                  alertSubscribed
                    ? "border-cr-primary text-cr-primary bg-cr-primary/[0.08] cursor-default"
                    : "border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary"
                }`}
              >
                <span aria-hidden="true">{alertSubscribed ? "✓" : "🔔"}</span>
                {alertLoading ? "…" : alertSubscribed ? "Te avisaremos" : "Avisarme de nuevas plazas"}
              </button>
            )}
            <p className="font-mono text-xs text-cr-text-muted">
              {rides ? `${visible.length} / ${rides.length}` : "…"}
            </p>
          </div>
        </header>

        {!rides && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <TicketCardSkeleton />
            <TicketCardSkeleton />
            <TicketCardSkeleton />
          </div>
        )}

        {rides && visible.length === 0 && (
          rides.length === 0 && !isPast && concert ? (
            <div className="border-2 border-cr-border bg-cr-surface p-6 md:p-8 text-center space-y-3">
              <p className="font-display text-2xl uppercase">Aún no hay viajes</p>
              <p className="font-mono text-xs text-cr-text-muted max-w-md mx-auto">
                Sé tú quien lo monte. Publica un viaje y arrastra a tu crew hasta {concert.venue.name}.
              </p>
              <Link
                to={`/publish?concert=${concert.id}`}
                className="cr-btn-primary mt-2 inline-flex items-center gap-2"
              >
                Publicar viaje →
              </Link>
            </div>
          ) : (
            <div className="border border-dashed border-cr-border p-10 text-center space-y-4">
              <p className="font-display text-xl uppercase">
                {rides.length === 0
                  ? "No se publicaron viajes para este concierto."
                  : "Ningún viaje cumple los filtros."}
              </p>
              <p className="font-sans text-sm text-cr-text-muted">
                {rides.length === 0
                  ? "Este concierto ya tuvo lugar."
                  : "Prueba a relajar el precio máximo o la ciudad de origen."}
              </p>
            </div>
          )
        )}

        {/* Anon inline CTA — visible only to non-logged-in users when rides exist */}
        {!user && rides && visible.length > 0 && !isPast && (
          <div
            className="bg-[#dbff00] text-black p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            role="region"
            aria-label="Reserva tu plaza en carpooling"
          >
            <p className="font-sans text-sm font-semibold leading-snug">
              Reserva tu plaza en carpooling · Gratis · 0% comisión
            </p>
            <Link
              to={`/register?next=${encodeURIComponent(`/concerts/${id}`)}`}
              className="flex-shrink-0 inline-flex items-center gap-1.5 bg-black text-[#dbff00] font-sans font-semibold uppercase tracking-[0.12em] text-xs px-5 py-2.5 hover:bg-[#111] transition-colors whitespace-nowrap"
            >
              Crear cuenta gratis <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>
        )}

        {rides && visible.length > 0 && (
          <>
            <LayoutGroup>
              <motion.ol
                layout
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
                }}
                className="grid grid-cols-1 xl:grid-cols-2 gap-4"
              >
                {visible.map((ride) => {
                  const isCrewDriver = crewIds.has(ride.driver_id);
                  return (
                    <motion.li
                      key={ride.id}
                      layout
                      layoutId={`ride-${ride.id}`}
                      variants={{
                        hidden: { opacity: 0, y: 16 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                      }}
                      className="relative"
                    >
                      {isCrewDriver && (
                        <span
                          className="absolute -top-2 left-3 z-10 inline-flex items-center gap-1 border-2 border-cr-primary bg-cr-primary px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-cr-text-inverse shadow-[0_0_18px_rgb(212_247_0/0.45)]"
                          title="Conductor de tu crew"
                        >
                          ★ tu crew
                        </span>
                      )}
                      <TicketCard
                        ride={ride}
                        onClick={() => navigate(`/rides/${ride.id}`)}
                      />
                    </motion.li>
                  );
                })}
              </motion.ol>
            </LayoutGroup>

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

      {concert &&
        typeof concert.venue.lat === "number" &&
        typeof concert.venue.lng === "number" && (
          <section
            className="max-w-6xl mx-auto px-6 pb-16 space-y-5"
            aria-labelledby="concert-rides-map-heading"
          >
            <header className="space-y-2">
              <h2
                id="concert-rides-map-heading"
                className="font-display text-2xl uppercase"
              >
                Mapa de viajes
              </h2>
              <p className="font-sans text-sm text-cr-text-muted max-w-2xl leading-relaxed">
                Visualiza desde dónde salen los viajes hacia {concert.venue.name}.
              </p>
            </header>
            <Suspense
              fallback={
                <div
                  className="h-[360px] md:h-[480px] cr-card animate-pulse"
                  aria-hidden="true"
                />
              }
            >
              <ConcertRidesMap concert={concert} rides={rides ?? []} />
            </Suspense>
          </section>
        )}

      {concert && !isPast && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <ConcertChatSection concertId={concert.id} artist={concert.artist} />
        </section>
      )}

      {concert && !isPast && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <LiveActivityFeed scope="concert" concertId={concert.id} limit={10} emptyMessage={t("concertDetail.feedEmpty", { artist: concert.artist })} />
        </section>
      )}

      {/* ── Transport Hub: how to get there ── */}
      {concert && <ConcertTransportSection concert={concert} />}

      {concert && !isPast && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <EmbedSnippet concertId={concert.id} />
        </section>
      )}

      {/* Sticky post-view nudge for anonymous users — shown after 8s scroll engagement */}
      {!user && concert && !isPast && (
        <AnonNudgeBanner
          artistName={concert.artist}
          city={concert.venue.city}
          concertId={concert.id}
          ridesCount={rides?.length ?? 0}
        />
      )}
    </main>

    <StickyRegBar />
    </>
  );
}

/**
 * ConcertTransportSection — renders transport hub + related context for a concert.
 * Uses venue data from VENUE_LANDINGS when available; generates generic content otherwise.
 */
function ConcertTransportSection({ concert }: { concert: ConcertEntity }) {
  if (!concert) return null;

  const venueLanding = VENUE_LANDINGS.find(
    (v) =>
      v.name.toLowerCase().includes(concert.venue.name?.toLowerCase() ?? "") ||
      v.city.toLowerCase() === concert.venue.city?.toLowerCase(),
  );

  // Build transport modes from venue data or generic defaults
  const transportModes: TransportMode[] = [];

  if (venueLanding?.transport.metro) {
    transportModes.push({
      type: "local",
      title: `Metro / transporte urbano`,
      summary: `${venueLanding.transport.metro}. La opción más rápida para residentes en ${concert.venue.city}.`,
      notes: "El metro se colapsa en la salida de conciertos nocturnos. Colas de 20–40 min habituales.",
    });
  }
  if (venueLanding?.transport.bus) {
    transportModes.push({
      type: "bus",
      title: "Bus urbano",
      summary: venueLanding.transport.bus,
    });
  }

  // Carpooling is always present and recommended
  const originCities = venueLanding?.originCities ?? [];
  const firstOrigin = originCities[0];
  transportModes.push({
    type: "carpooling",
    title: "Carpooling ConcertRide · sin comisión",
    summary: `Viaje compartido con conductor verificado desde tu ciudad. ${firstOrigin ? `Desde ${firstOrigin.city}: ${firstOrigin.km} km · ${firstOrigin.drivingTime} · ${firstOrigin.concertRideRange}.` : "El 100 % del precio va al conductor — sin comisión de plataforma."}`,
    price: firstOrigin?.concertRideRange ?? "desde 3 €/asiento",
    notes: "Vuelta coordenada con el conductor a la hora real de fin del concierto. Pago en efectivo o Bizum.",
    recommended: true,
  });

  transportModes.push({
    type: "car",
    title: "Coche propio · parking",
    summary: venueLanding?.transport.parking
      ? venueLanding.transport.parking
      : `Consulta parking disponibles cerca de ${concert.venue.name} en la web del recinto.`,
    notes: "En días de concierto los aparcamientos cercanos suelen llenarse. Llega con 45–60 min de antelación.",
  });

  // Related festivals in the same city
  const relatedFestivals = FESTIVAL_LANDINGS.filter(
    (f) => f.city.toLowerCase() === concert.venue.city?.toLowerCase(),
  ).slice(0, 3);

  // Generate JSON-LD for transport hub
  const transportSchemas = generateTransportHubSchema({
    eventName: concert.artist,
    city: concert.venue.city ?? "",
    venue: concert.venue.name ?? concert.venue.city ?? "",
    siteUrl: SITE_URL,
    transportModes,
    nearbyAirports: [],
    accommodationZones: [],
  });

  const year = new Date(concert.date).getFullYear();

  return (
    <>
      {transportSchemas.map((schema, i) => (
        <script
          key={`transport-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ── Transport Hub ── */}
      <section
        className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12"
        aria-labelledby="concert-transport-heading"
      >
        <h2
          id="concert-transport-heading"
          className="font-display text-2xl md:text-3xl uppercase mb-6"
        >
          Cómo llegar a {concert.artist} en {concert.venue.name ?? concert.venue.city}: transporte y carpooling
        </h2>
        <p className="font-sans text-sm text-cr-text-muted mb-8 max-w-2xl leading-relaxed speakable">
          {concert.artist} actúa en <strong className="text-cr-text">{concert.venue.name}</strong>,{" "}
          {concert.venue.city}
          {concert.venue.address ? ` (${concert.venue.address})` : ""}.
          {" "}A continuación, las opciones de transporte para llegar al concierto.
        </p>

        <EventTransportHub
          eventName={concert.artist}
          eventShortName={concert.artist}
          city={concert.venue.city ?? ""}
          venue={concert.venue.name ?? ""}
          date={concert.date}
          transportModes={transportModes}
          concertId={concert.id}
          showPublishCTA={true}
        />

        {/* Origin cities from venue data */}
        {originCities.length > 0 && (
          <div className="mt-10 space-y-4">
            <h3 className="font-display text-xl uppercase">
              Precio del carpooling a {concert.venue.name} por ciudad de origen
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 font-sans text-sm">
              {originCities.map((oc) => (
                <article key={oc.city} className="border border-cr-border p-4 space-y-2 hover:border-cr-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm uppercase">{oc.city}</span>
                    <span className="font-mono text-xs text-cr-primary font-semibold">{oc.concertRideRange}</span>
                  </div>
                  <div className="flex gap-3 font-mono text-[11px] text-cr-text-muted">
                    <span>{oc.km} km</span>
                    <span>·</span>
                    <span>{oc.drivingTime}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Why ConcertRide for this concert ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Por qué ir a {concert.artist} en carpooling con ConcertRide
        </h2>
        <div className="grid md:grid-cols-3 gap-4 font-sans text-sm text-cr-text-muted">
          <article className="space-y-2">
            <h3 className="font-display text-sm uppercase text-cr-primary">0 % comisión</h3>
            <p>El 100 % del precio va al conductor. Sin intermediarios. Pago en efectivo o Bizum el día del viaje.</p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-sm uppercase text-cr-primary">Conductores verificados</h3>
            <p>Todos verifican su carnet de conducir antes de publicar. Lee sus valoraciones de viajes anteriores.</p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-sm uppercase text-cr-primary">Vuelta coordinada</h3>
            <p>No dependes del último metro. El conductor se adapta al horario real del concierto.</p>
          </article>
        </div>
      </section>

      {/* ── Transport comparison table ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-5">
        <FactDensityCallout
          heading={`Datos clave · ${concert.artist} ${concert.venue.city}`}
          facts={[
            { label: "Carpooling desde", value: "3 €/asiento", detail: "0 % comisión" },
            { label: "Vuelta nocturna", value: "Coordinada", detail: "Chat directo con el conductor" },
            { label: "Conductores", value: "Verificados", detail: "Carnet + identidad" },
          ]}
        />
        <h2 className="font-display text-2xl uppercase">
          Comparativa: cómo ir a {concert.artist} en {concert.venue.city}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-xs border-collapse">
            <thead>
              <tr className="border-b border-cr-border text-left">
                <th className="py-2 pr-4 font-semibold text-cr-text">Opción</th>
                <th className="py-2 pr-4 font-semibold text-cr-text">Precio</th>
                <th className="py-2 pr-4 font-semibold text-cr-text">Comisión</th>
                <th className="py-2 pr-4 font-semibold text-cr-text">Vuelta nocturna</th>
                <th className="py-2 font-semibold text-cr-text">Reserva</th>
              </tr>
            </thead>
            <tbody className="text-cr-text-muted">
              <tr className="border-b border-cr-border/50">
                <td className="py-2 pr-4 font-semibold text-cr-primary">ConcertRide carpooling</td>
                <td className="py-2 pr-4">{firstOrigin?.concertRideRange ?? "desde 3 €"}/asiento</td>
                <td className="py-2 pr-4 font-semibold text-cr-primary">0 %</td>
                <td className="py-2 pr-4">Sí (coordenada con el conductor)</td>
                <td className="py-2">Instantánea</td>
              </tr>
              <tr className="border-b border-cr-border/50">
                <td className="py-2 pr-4">Taxi / VTC (Uber, Cabify)</td>
                <td className="py-2 pr-4">30–90 € (precio nocturno)</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2 pr-4">Sí (precio ×2–3 de madrugada)</td>
                <td className="py-2">App</td>
              </tr>
              <tr className="border-b border-cr-border/50">
                <td className="py-2 pr-4">Otras plataformas de carpooling</td>
                <td className="py-2 pr-4">{firstOrigin?.concertRideRange ?? "precio similar"} + 12–18 %</td>
                <td className="py-2 pr-4">12–18 %</td>
                <td className="py-2 pr-4">Depende del conductor</td>
                <td className="py-2">Con aprobación</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Metro / bus público</td>
                <td className="py-2 pr-4">1,5–4 € (dentro de {concert.venue.city})</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2 pr-4">No (último ~1:30 en la mayoría de ciudades)</td>
                <td className="py-2">Tarjeta de transporte</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Related festivals in same city ── */}
      {relatedFestivals.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-5">
          <h2 className="font-display text-2xl uppercase">
            Otros festivales en {concert.venue.city} {year}
          </h2>
          <p className="font-sans text-sm text-cr-text-muted max-w-xl">
            Si disfrutas de la música en vivo en {concert.venue.city}, estos festivales pueden interesarte.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans text-sm">
            {relatedFestivals.map((f) => (
              <Link
                key={f.slug}
                to={`/festivales/${f.slug}`}
                className="border border-cr-border p-4 space-y-2 hover:border-cr-primary/40 transition-colors"
              >
                <h3 className="font-display text-sm uppercase">{f.shortName}</h3>
                <p className="font-mono text-[11px] text-cr-text-muted">{f.typicalDates}</p>
                <p className="text-xs text-cr-text-muted leading-relaxed line-clamp-2">{f.blurb.slice(0, 100)}…</p>
                <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">
                  Ver carpooling <ArrowRight size={10} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Social proof / network effect ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-5">
        <h2 className="font-display text-2xl uppercase">
          Viaja a {concert.artist} con otros fans
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 font-sans text-sm">
          <div className="border border-dashed border-cr-border p-5 space-y-2 text-center">
            <p className="font-mono text-2xl font-bold text-cr-primary">0 %</p>
            <p className="font-sans text-xs text-cr-text-muted">Comisión de plataforma</p>
          </div>
          <div className="border border-dashed border-cr-border p-5 space-y-2 text-center">
            <p className="font-mono text-2xl font-bold text-cr-primary">100 %</p>
            <p className="font-sans text-xs text-cr-text-muted">Del precio al conductor</p>
          </div>
          <div className="border border-dashed border-cr-border p-5 space-y-2 text-center">
            <p className="font-mono text-2xl font-bold text-cr-primary">✓</p>
            <p className="font-sans text-xs text-cr-text-muted">Conductores con carnet verificado</p>
          </div>
        </div>
        <blockquote className="border-l-2 border-cr-primary pl-5 space-y-1 mt-4">
          <p className="font-sans text-sm text-cr-text-muted italic">
            "El 80 % de la huella de carbono de un concierto proviene del transporte de los asistentes. El carpooling es la acción más efectiva para reducirla."
          </p>
          <footer className="font-mono text-[10px] text-cr-text-dim">
            — <a href="https://juliesbicycle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">Julie's Bicycle</a>
          </footer>
        </blockquote>
      </section>
    </>
  );
}

function EmbedSnippet({ concertId }: { concertId: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const snippet = `<iframe\n  src="${SITE_URL}/widget/concert/${concertId}"\n  width="100%"\n  height="320"\n  frameborder="0"\n  style="border-radius:4px;"\n  title="Viajes compartidos · ConcertRide"\n></iframe>`;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-dim hover:text-cr-text-muted transition-colors"
      >
        ¿Eres promotora? Incrusta los viajes en tu web →
      </button>
    );
  }

  return (
    <div className="border border-dashed border-cr-border p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
            Widget para tu web
          </p>
          <p className="font-mono text-[11px] text-cr-text-dim mt-1">
            Copia este código HTML en tu web para mostrar los viajes disponibles en tiempo real.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="font-mono text-[11px] text-cr-text-dim hover:text-cr-text transition-colors"
          aria-label="Cerrar"
        >✕</button>
      </div>
      <pre className="bg-cr-surface border border-cr-border p-3 font-mono text-[11px] text-cr-text-muted overflow-x-auto whitespace-pre-wrap break-all">
        {snippet}
      </pre>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(snippet).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }}
        className="font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary px-4 py-2 transition-colors"
      >
        {copied ? "¡Copiado!" : "Copiar snippet"}
      </button>
    </div>
  );
}

/**
 * AnonNudgeBanner — sticky bottom banner shown to non-logged-in users after they've
 * spent time on a concert detail page. Non-intrusive: appears after 8 s, has a dismiss
 * button, and stores the dismissed state in sessionStorage so it doesn't re-appear
 * on the same page view.
 */
function AnonNudgeBanner({
  artistName,
  city,
  concertId,
  ridesCount,
}: {
  artistName: string;
  city: string;
  concertId: string;
  ridesCount: number;
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Don't show if already dismissed in this session for this concert
    const key = `nudge_dismissed_${concertId}`;
    if (sessionStorage.getItem(key)) return;

    // Appear after 8 seconds of page visit (engagement signal)
    timerRef.current = setTimeout(() => setVisible(true), 8000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [concertId]);

  function dismiss() {
    setDismissed(true);
    sessionStorage.setItem(`nudge_dismissed_${concertId}`, "1");
  }

  const ridesLabel = ridesCount > 0
    ? `${ridesCount} viaje${ridesCount === 1 ? "" : "s"} disponible${ridesCount === 1 ? "" : "s"}`
    : "Sé el primero en publicar";

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          role="complementary"
          aria-label="Notificación: encuentra viaje a este concierto"
          className="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-4"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="relative max-w-xl mx-auto flex items-center gap-4 bg-[#111] border border-cr-primary/40 shadow-[0_0_40px_rgba(219,255,0,0.15)] px-5 py-4"
            style={{ pointerEvents: "auto" }}
          >
            {/* Lime left accent */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-cr-primary" aria-hidden="true" />

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="font-display text-sm uppercase leading-tight truncate">
                ¿Quieres ir a{" "}
                <span className="text-cr-primary">{artistName}</span>{" "}
                en {city}?
              </p>
              <p className="font-mono text-[10px] text-white/45">
                {ridesLabel} · Registro gratis en 30 segundos
              </p>
            </div>

            {/* CTA */}
            <Link
              to={`/register?next=${encodeURIComponent(`/concerts/${concertId}`)}`}
              className="flex-shrink-0 cr-btn-shine inline-flex items-center gap-1.5 bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.1em] text-xs px-4 py-2.5 hover:bg-[#c8ec00] transition-colors duration-150 whitespace-nowrap"
            >
              Encontrar viaje gratis
            </Link>

            {/* Dismiss */}
            <button
              type="button"
              onClick={dismiss}
              aria-label="Cerrar notificación"
              className="flex-shrink-0 p-1 text-white/30 hover:text-white/70 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function JsonLdEvent({ concert, carpoolingPriceFrom }: { concert: Concert; carpoolingPriceFrom: number | null }) {
  const startMs = new Date(concert.date).getTime();
  const endDate = Number.isFinite(startMs)
    ? new Date(startMs + 3 * 60 * 60 * 1000).toISOString()
    : undefined;
  const url = `${SITE_URL}/concerts/${concert.id}`;

  const eventName = (concert.name || concert.artist || "").trim();
  const venueName = concert.venue.name?.trim() || concert.venue.city?.trim() || "";
  const venueCity = concert.venue.city?.trim() || "";

  // Skip rendering if required GSC fields are missing
  if (!eventName || !concert.date || !venueName || !venueCity) return null;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: eventName,
    url,
    description: `Concierto de ${concert.artist} en ${venueName} (${venueCity}). Encuentra viajes compartidos desde toda España en ConcertRide.`,
    performer: {
      "@type": "MusicGroup",
      name: concert.artist,
    },
    organizer: {
      "@type": "Organization",
      name: "ConcertRide",
      url: `${SITE_URL}/`,
    },
    startDate: concert.date,
    dateModified: new Date().toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: venueName,
      address: {
        "@type": "PostalAddress",
        addressLocality: venueCity,
        addressCountry: "ES",
        ...(concert.venue.address?.trim() ? { streetAddress: concert.venue.address.trim() } : {}),
      },
      ...(concert.venue.lat && concert.venue.lng ? {
        geo: {
          "@type": "GeoCoordinates",
          latitude: concert.venue.lat,
          longitude: concert.venue.lng,
        },
      } : {}),
    },
  };

  if (endDate) jsonLd.endDate = endDate;
  if (concert.image_url) jsonLd.image = [concert.image_url];

  // Build offers array: carpooling offer first (our data, always present),
  // then event ticket offer when price_min is available from Ticketmaster.
  // Note: carpooling prices are ConcertRide's own data, not Ticketmaster data.
  // Ticketmaster link-back is mandatory per ToS when ticketmaster_url is present.
  const offersArray: Record<string, unknown>[] = [];

  // Offer 1: ConcertRide carpooling seats (our own pricing data)
  const carpoolingPrice = carpoolingPriceFrom ?? 3; // fallback to platform minimum
  offersArray.push({
    "@type": "Offer",
    name: `Carpooling a ${eventName} desde ${venueCity} — ConcertRide`,
    description: `Viaje compartido en coche: ${carpoolingPrice} €/asiento, 0% comisión, conductores verificados.`,
    price: carpoolingPrice,
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url,
    validFrom: new Date().toISOString(),
    seller: {
      "@type": "Organization",
      name: "ConcertRide",
      url: `${SITE_URL}/`,
    },
  });

  // Offer 2: Event tickets (Ticketmaster data) — only when available
  if (concert.price_min !== null) {
    offersArray.push({
      "@type": "Offer",
      name: `Entradas — ${eventName}`,
      price: concert.price_min,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      // Ticketmaster link-back is mandatory per ToS when ticketmaster_url is present
      url: concert.official_url ?? concert.ticketmaster_url ?? url,
      validFrom: new Date().toISOString(),
      priceSpecification: {
        "@type": "PriceSpecification",
        price: concert.price_min,
        priceCurrency: "EUR",
        unitText: "por entrada",
      },
    });
  }

  jsonLd.offers = offersArray.length === 1 ? offersArray[0] : offersArray;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}


function CrewAttendingForConcert({ concertId }: { concertId: string }) {
  const { crew } = useCrew();
  const [attending, setAttending] = useState<Array<{ id: string; name: string; avatar_url: string | null }>>([]);

  useEffect(() => {
    if (!crew.length) {
      setAttending([]);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const res = await api.crew.attending(concertId);
        if (!cancelled) {
          setAttending(
            res.crew.map((c) => ({ id: c.user.id, name: c.user.name, avatar_url: c.user.avatar_url })),
          );
        }
      } catch {
        if (!cancelled) setAttending([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [concertId, crew.length]);

  if (!attending.length) return null;
  return (
    <section className="bg-cr-surface-2 border-y border-cr-border px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center gap-3">
        <CrewAvatars
          size="sm"
          people={attending}
          label={`${attending.length} de tu crew ${attending.length === 1 ? "va" : "van"}`}
        />
      </div>
    </section>
  );
}

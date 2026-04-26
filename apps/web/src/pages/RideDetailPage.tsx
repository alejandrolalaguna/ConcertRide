import { Suspense, lazy, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { motion } from "motion/react";
import { ArrowLeft, Check, CheckCheck, Clock, Link2, MapPin, Minus, Music, Plus } from "lucide-react";
import type { Luggage, PaymentMethod, Ride, RideRequest, SmokingPolicy } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { rideShareUrl } from "@/lib/utm";
import { track } from "@/lib/observability";
import { ReportButton } from "@/components/ReportButton";

const LUGGAGE_LABEL: Record<Luggage, string> = {
  none: "Sin equipaje",
  small: "Bolso pequeño",
  backpack: "Mochila",
  cabin: "Maleta cabina",
  large: "Maleta grande",
  extra: "Extra",
};

const SMOKING_LABEL: Record<SmokingPolicy, string> = {
  no: "🚭 No fumar",
  yes: "🚬 Fumadores OK",
};

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cash: "💵 Efectivo",
  bizum: "📱 Bizum",
  cash_or_bizum: "💵 Efectivo o 📱 Bizum",
};

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "💵 Efectivo" },
  { value: "bizum", label: "📱 Bizum" },
];
import { formatDate, formatTime } from "@/lib/format";
import { useSession } from "@/lib/session";
import { TrustBadge } from "@/components/TrustBadge";
import { VibeBadge } from "@/components/VibeBadge";
import { DriverProfileMini } from "@/components/DriverProfileMini";
import { PulsingDot } from "@/components/LoadingStates";
import { DriverInbox } from "@/components/DriverInbox";
import { DriverRideActions } from "@/components/DriverRideActions";
import { RideChatSection } from "@/components/RideChatSection";
import { RideReviewsSection } from "@/components/RideReviewsSection";

const RideRouteMap = lazy(() => import("@/components/RideRouteMap"));

type ReserveState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; request: RideRequest }
  | { status: "error"; message: string };

export default function RideDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useSession();
  const [ride, setRide] = useState<Ride | null>(null);
  const [error, setError] = useState<string | null>(null);

  useSeoMeta({
    title: ride
      ? `Viaje a ${ride.concert.artist} desde ${ride.origin_city} — ConcertRide ES`
      : "Viaje compartido — ConcertRide ES",
    description: ride
      ? `Viaje compartido desde ${ride.origin_city} hasta ${ride.concert.venue.city} para ver a ${ride.concert.artist}. ${ride.seats_left} plaza${ride.seats_left === 1 ? "" : "s"} disponible${ride.seats_left === 1 ? "" : "s"} a €${ride.price_per_seat}/asiento.`
      : "Encuentra un viaje compartido para conciertos en España.",
    canonical: id ? `${SITE_URL}/rides/${id}` : undefined,
    keywords: ride
      ? `viaje compartido ${ride.origin_city}, carpooling ${ride.concert.artist}, coche compartido ${ride.concert.venue.city}`
      : undefined,
    ogImage: ride?.concert.image_url ?? undefined,
  });
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState("");
  const [luggage, setLuggage] = useState<Luggage>("none");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [reserve, setReserve] = useState<ReserveState>({ status: "idle" });
  const [completing, setCompleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [myRequest, setMyRequest] = useState<RideRequest | null>(null);
  const [cancellingMine, setCancellingMine] = useState(false);
  const [confirmedPassengers, setConfirmedPassengers] = useState<
    Array<{ id: string; name: string; initial: string; seats: number }>
  >([]);
  const [checklist, setChecklist] = useState<import("@concertride/types").RideChecklistItem[]>([]);

  useEffect(() => {
    if (!id) return;
    setRide(null);
    setError(null);
    api.rides
      .get(id)
      .then(setRide)
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 404) setError("ride_not_found");
        else setError("load_failed");
      });
  }, [id]);

  // Load my own request (if any) + the list of confirmed passengers. Both
  // refresh whenever the user/ride combination changes.
  useEffect(() => {
    if (!id || !user) {
      setMyRequest(null);
      return;
    }
    api.rides.getMyRequest(id).then((r) => setMyRequest(r.request)).catch(() => {});
  }, [id, user]);

  useEffect(() => {
    if (!id) return;
    api.rides
      .confirmedPassengers(id)
      .then((r) => setConfirmedPassengers(r.passengers))
      .catch(() => setConfirmedPassengers([]));
  }, [id, myRequest?.status]);

  useEffect(() => {
    if (!id) return;
    api.rides
      .listChecklist(id)
      .then((r) => setChecklist(r.items))
      .catch(() => setChecklist([]));
  }, [id]);

  if (error === "load_failed") {
    return (
      <main className="min-h-dvh flex items-center justify-center px-6 bg-cr-bg">
        <div className="text-center space-y-4 max-w-md">
          <p className="font-display text-3xl uppercase text-cr-text-muted">Error al cargar</p>
          <p className="font-sans text-sm text-cr-text-dim">No se pudo cargar el viaje. Inténtalo de nuevo.</p>
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

  if (error === "ride_not_found") {
    return (
      <main className="min-h-dvh flex items-center justify-center px-6 bg-cr-bg">
        <div className="text-center space-y-4 max-w-md">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-secondary">
            404
          </p>
          <h1 className="font-display text-3xl uppercase">Viaje no encontrado</h1>
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

  if (!ride) {
    return (
      <main className="min-h-dvh bg-cr-bg flex items-center justify-center">
        <PulsingDot label="Cargando viaje" />
      </main>
    );
  }

  const isDriver = !!user && ride.driver_id === user.id;
  const isFull = ride.seats_left === 0;
  const maxSeats = Math.max(1, ride.seats_left);
  const isCompleted = ride.status === "completed";
  const driverAlreadyConfirmed = ride.completion_confirmed_by === "driver" || ride.completion_confirmed_by === "both";
  const canConfirmComplete =
    !!user &&
    !isCompleted &&
    (ride.status === "active" || ride.status === "full") &&
    isDriver;

  function handleShare() {
    if (!ride) return;
    const campaign = ride.concert.artist.toLowerCase().replace(/\s+/g, "-").slice(0, 30);
    const url = rideShareUrl(ride.id, campaign, "copy");
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleShareWhatsApp() {
    if (!ride) return;
    const campaign = ride.concert.artist.toLowerCase().replace(/\s+/g, "-").slice(0, 30);
    const url = rideShareUrl(ride.id, campaign, "whatsapp");
    const text = `🎶 Voy al concierto de ${ride.concert.artist} desde ${ride.origin_city}. ¿Te vienes? ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  async function handleConfirmComplete() {
    if (!ride) return;
    setCompleting(true);
    try {
      const updated = await api.rides.confirmComplete(ride.id);
      setRide(updated);
    } finally {
      setCompleting(false);
    }
  }

  async function handleRevokeComplete() {
    if (!ride) return;
    setCompleting(true);
    try {
      const updated = await api.rides.revokeComplete(ride.id);
      setRide(updated);
    } finally {
      setCompleting(false);
    }
  }

  async function submitReserve(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ride) return;
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(`/rides/${ride.id}`)}`);
      return;
    }
    setReserve({ status: "submitting" });
    try {
      const effectivePayment = ride.accepted_payment === "cash" ? "cash" : paymentMethod;
      const payload = {
        seats,
        message: message.trim() || undefined,
        luggage,
        payment_method: effectivePayment,
      };
      const req = ride.instant_booking
        ? await api.rides.bookInstant(ride.id, payload)
        : await api.rides.requestSeat(ride.id, payload);
      setReserve({ status: "success", request: req });
      setMyRequest(req);
      track(ride.instant_booking ? "seat_booked_instant" : "seat_requested", {
        ride_id: ride.id,
        concert_id: ride.concert_id,
        seats: payload.seats,
        price_total: payload.seats * ride.price_per_seat,
      });
    } catch (err) {
      setReserve({
        status: "error",
        message: err instanceof Error ? err.message : "Algo falló",
      });
    }
  }

  return (
    <main id="main" className="bg-cr-bg text-cr-text min-h-dvh">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Conciertos", item: `${SITE_URL}/concerts` },
              ...(ride ? [
                { "@type": "ListItem", position: 3, name: ride.concert.artist, item: `${SITE_URL}/concerts/${ride.concert.id}` },
                { "@type": "ListItem", position: 4, name: `Viaje desde ${ride.origin_city}`, item: `${SITE_URL}/rides/${ride.id}` },
              ] : []),
            ],
          }),
        }}
      />
      {ride && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Trip",
              "@id": `${SITE_URL}/rides/${ride.id}`,
              name: `Viaje compartido desde ${ride.origin_city} a ${ride.concert.venue.city} para ${ride.concert.artist}`,
              description: `Carpooling desde ${ride.origin_city} hasta ${ride.concert.venue.name} (${ride.concert.venue.city}) para el concierto de ${ride.concert.artist}. ${ride.seats_left} plaza${ride.seats_left === 1 ? "" : "s"} disponible${ride.seats_left === 1 ? "" : "s"}.`,
              url: `${SITE_URL}/rides/${ride.id}`,
              departureTime: ride.departure_time,
              provider: { "@id": `${SITE_URL}/#organization` },
              itinerary: [
                {
                  "@type": "Place",
                  name: ride.origin_city,
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: ride.origin_city,
                    addressCountry: "ES",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: ride.origin_lat,
                    longitude: ride.origin_lng,
                  },
                },
                {
                  "@type": "Place",
                  name: ride.concert.venue.name,
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: ride.concert.venue.city,
                    addressCountry: "ES",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: ride.concert.venue.lat,
                    longitude: ride.concert.venue.lng,
                  },
                },
              ],
              offers: {
                "@type": "Offer",
                price: String(ride.price_per_seat),
                priceCurrency: "EUR",
                availability:
                  ride.seats_left > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/SoldOut",
                url: `${SITE_URL}/rides/${ride.id}`,
              },
            }),
          }}
        />
      )}
      <div className="max-w-4xl mx-auto px-6 py-10 md:py-16 space-y-10">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            <ArrowLeft size={14} /> Volver
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              title="Compartir por WhatsApp"
              className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              <span aria-hidden="true">💬</span> WhatsApp
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              <Link2 size={14} aria-hidden="true" />
              {copied ? "¡Copiado!" : "Copiar enlace"}
            </button>
          </div>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative bg-cr-surface border border-cr-border"
        >
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-6 md:p-8 space-y-5 min-w-0">
              <div className="space-y-1">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
                  Viaje · {ride.origin_city} → {ride.concert.venue.city}
                </p>
                <Link to={`/concerts/${ride.concert.id}`} className="block group">
                  <h1 className="font-display uppercase text-3xl md:text-5xl leading-[0.95] group-hover:text-cr-primary transition-colors">
                    {ride.concert.artist}
                  </h1>
                </Link>
                <p className="font-sans text-sm text-cr-text-muted">
                  {ride.concert.venue.name} · {formatDate(ride.concert.date)}
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-4 border-t border-dashed border-cr-border pt-4">
                <div>
                  <dt className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted">
                    Origen
                  </dt>
                  <dd className="font-sans text-sm text-cr-text mt-1 flex items-center gap-1.5">
                    <MapPin size={11} aria-hidden="true" />
                    {ride.origin_address}
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted">
                    Salida
                  </dt>
                  <dd className="font-sans text-sm text-cr-text mt-1 flex items-center gap-1.5">
                    <Clock size={11} aria-hidden="true" />
                    {formatDate(ride.departure_time)} · {formatTime(ride.departure_time)}
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted">
                    Vuelta
                  </dt>
                  <dd className="font-sans text-sm text-cr-text mt-1">
                    {ride.round_trip && ride.return_time
                      ? `${formatDate(ride.return_time)} · ${formatTime(ride.return_time)}`
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted">
                    Coche
                  </dt>
                  <dd className="font-sans text-sm text-cr-text mt-1">
                    {ride.driver.car_model
                      ? `${ride.driver.car_model}${ride.driver.car_color ? ` · ${ride.driver.car_color}` : ""}`
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted">
                    Fumar
                  </dt>
                  <dd className="font-sans text-sm text-cr-text mt-1">
                    {SMOKING_LABEL[ride.smoking_policy]}
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted">
                    Equipaje máx.
                  </dt>
                  <dd className="font-sans text-sm text-cr-text mt-1">
                    🧳 {LUGGAGE_LABEL[ride.max_luggage]}
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted">
                    Pago aceptado
                  </dt>
                  <dd className="font-sans text-sm text-cr-text mt-1">
                    {PAYMENT_LABEL[ride.accepted_payment]}
                  </dd>
                </div>
              </dl>

              {ride.notes && (
                <div className="border-t border-dashed border-cr-border pt-4">
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted mb-1">
                    Notas del conductor
                  </p>
                  <p className="font-sans text-sm text-cr-text leading-relaxed">{ride.notes}</p>
                </div>
              )}

              <div className="border-t border-dashed border-cr-border pt-4">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted mb-3">
                  Conductor
                </p>
                <DriverProfileMini driver={ride.driver} />
                {user && user.id !== ride.driver_id && (
                  <div className="pt-2">
                    <ReportButton targetUserId={ride.driver_id} rideId={ride.id} variant="inline" />
                  </div>
                )}
              </div>
            </div>

            <div className="relative md:w-56 md:border-l md:border-dashed md:border-cr-border border-t md:border-t-0 border-dashed border-cr-border p-6 md:p-8 flex md:flex-col justify-between gap-4">
              <div>
                <p className="font-mono text-4xl text-cr-primary leading-none">€{ride.price_per_seat}</p>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted mt-1">
                  /asiento
                </p>
                {ride.price_negotiable && (
                  <span className="inline-block mt-2 font-sans text-xs font-semibold uppercase tracking-[0.08em] border border-cr-primary text-cr-primary px-1.5 py-0.5">
                    Negociable
                  </span>
                )}
              </div>
              <div className="flex md:flex-col md:items-start items-end gap-2">
                <p className="font-sans text-sm text-cr-text">
                  {ride.seats_left} plaza{ride.seats_left === 1 ? "" : "s"}
                </p>
                <VibeBadge vibe={ride.vibe} />
                {ride.playlist_url && (
                  <a
                    href={ride.playlist_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary"
                  >
                    <Music size={12} aria-hidden="true" />
                    Playlist
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.article>

        {confirmedPassengers.length > 0 && (
          <section aria-labelledby="passengers-title" className="space-y-3">
            <h2
              id="passengers-title"
              className="font-display text-sm uppercase tracking-wide text-cr-text-muted"
            >
              Quién va
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {confirmedPassengers.slice(0, 5).map((p) => (
                  <Link
                    key={p.id}
                    to={`/drivers/${p.id}`}
                    title={p.name}
                    className="w-9 h-9 rounded-full bg-cr-primary text-black font-display text-sm flex items-center justify-center border-2 border-cr-bg hover:z-10 hover:scale-110 transition-transform"
                    aria-label={`Perfil de ${p.name}`}
                  >
                    {p.initial}
                  </Link>
                ))}
                {confirmedPassengers.length > 5 && (
                  <span className="w-9 h-9 rounded-full bg-cr-surface-2 text-cr-text font-mono text-xs flex items-center justify-center border-2 border-cr-bg">
                    +{confirmedPassengers.length - 5}
                  </span>
                )}
              </div>
              <p className="font-sans text-sm text-cr-text-muted">
                {confirmedPassengers.length === 1 ? (
                  <>
                    <span className="text-cr-text font-semibold">{confirmedPassengers[0]?.name}</span> va en este viaje.
                  </>
                ) : confirmedPassengers.length === 2 ? (
                  <>
                    <span className="text-cr-text font-semibold">{confirmedPassengers[0]?.name}</span> y{" "}
                    <span className="text-cr-text font-semibold">{confirmedPassengers[1]?.name}</span> van en este viaje.
                  </>
                ) : (
                  <>
                    <span className="text-cr-text font-semibold">{confirmedPassengers[0]?.name}</span>,{" "}
                    <span className="text-cr-text font-semibold">{confirmedPassengers[1]?.name}</span> y{" "}
                    <span className="text-cr-text font-semibold">{confirmedPassengers.length - 2} más</span> van en este viaje.
                  </>
                )}
              </p>
            </div>
          </section>
        )}

        {checklist.length > 0 && (
          <section aria-labelledby="checklist-title" className="space-y-3">
            <h2
              id="checklist-title"
              className="font-display text-sm uppercase tracking-wide text-cr-text-muted"
            >
              Pre-viaje
            </h2>
            <div className="space-y-2">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded border border-cr-border bg-cr-surface-2 cursor-pointer hover:border-cr-primary/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.status === "confirmed"}
                    onChange={() => {
                      if (item.status === "pending" && ride) {
                        api.rides
                          .confirmChecklistItem(ride.id, item.id)
                          .then(() => {
                            setChecklist((prev) =>
                              prev.map((c) =>
                                c.id === item.id
                                  ? { ...c, status: "confirmed" as const, confirmed_at: new Date().toISOString() }
                                  : c,
                              ),
                            );
                          })
                          .catch(() => {});
                      }
                    }}
                    className="w-5 h-5 rounded border-cr-text-muted cursor-pointer accent-cr-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-cr-text-muted uppercase tracking-wide">
                      {item.item_type === "pickup_location" && "Punto de recogida"}
                      {item.item_type === "pickup_time" && "Hora de recogida"}
                      {item.item_type === "driver_phone" && "Teléfono del driver"}
                      {item.item_type === "luggage_confirmation" && "Confirmación de equipaje"}
                    </p>
                    {item.value && (
                      <p className="text-sm text-cr-text mt-0.5 truncate">{item.value}</p>
                    )}
                  </div>
                  {item.status === "confirmed" && (
                    <span className="text-cr-primary font-semibold">✓</span>
                  )}
                </label>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="route-title" className="space-y-3">
          <h2 id="route-title" className="font-display text-sm uppercase tracking-wide text-cr-text-muted">
            Ruta
          </h2>
          <Suspense
            fallback={
              <div className="h-[320px] bg-cr-surface border border-cr-border flex items-center justify-center">
                <PulsingDot label="Cargando mapa" />
              </div>
            }
          >
            <RideRouteMap ride={ride} />
          </Suspense>
          <p className="font-mono text-[11px] text-cr-text-dim">
            {ride.origin_city} <span className="text-cr-secondary">→</span> {ride.concert.venue.city}
          </p>
        </section>

        {isDriver ? (
          <>
            <DriverInbox
              ride={ride}
              onRequestUpdated={(fresh) => setRide(fresh)}
            />
            {!isCompleted && ride.status !== "cancelled" && (
              <DriverRideActions ride={ride} onUpdated={(r) => setRide(r)} />
            )}
            {ride.status === "cancelled" && (
              <section className="border-2 border-cr-secondary/60 bg-cr-secondary/10 p-5 space-y-2">
                <p className="font-display text-base uppercase text-cr-secondary">Viaje cancelado</p>
                <p className="font-sans text-xs text-cr-text-muted">
                  Las reservas pendientes y confirmadas fueron canceladas y se notificó a los pasajeros.
                </p>
              </section>
            )}
          </>
        ) : !user && !sessionLoading ? (
          <section className="border border-dashed border-cr-border p-6 md:p-8 text-center space-y-4">
            <p className="font-display text-lg uppercase">Inicia sesión para reservar</p>
            <p className="font-sans text-sm text-cr-text-muted">
              Tarda menos de 1 minuto. Volverás a esta página tras entrar o registrarte.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to={`/login?next=${encodeURIComponent(`/rides/${ride.id}`)}`}
                className="inline-flex items-center justify-center bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
              >
                Entrar
              </Link>
              <Link
                to={`/register?next=${encodeURIComponent(`/rides/${ride.id}`)}`}
                className="inline-flex items-center justify-center font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-cr-border text-cr-text hover:border-cr-primary hover:text-cr-primary px-6 py-3 transition-colors"
              >
                Crear cuenta
              </Link>
            </div>
          </section>
        ) : user ? (
          <section
            aria-labelledby="reserve-title"
            className="bg-cr-surface border border-cr-border p-6 md:p-8 space-y-5"
          >
            <header className="space-y-1">
              <h2 id="reserve-title" className="font-display text-lg uppercase tracking-wide">
                {ride.instant_booking ? "Reserva instantánea" : "Reservar asiento"}
              </h2>
              <p className="font-mono text-xs text-cr-text-muted">
                {ride.instant_booking
                  ? "Tu plaza queda confirmada al instante. Pago en efectivo al conductor."
                  : "Pago en efectivo al conductor. El conductor confirma tu solicitud."}
              </p>
              {ride.instant_booking && (
                <span className="inline-block font-sans text-[10px] font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-2 py-0.5">
                  Confirmación inmediata
                </span>
              )}
              {ride.price_negotiable && (
                <span className="inline-block font-sans text-[10px] font-semibold uppercase tracking-[0.12em] border border-cr-primary text-cr-primary px-2 py-0.5">
                  Precio negociable
                </span>
              )}
            </header>

            {myRequest && (myRequest.status === "pending" || myRequest.status === "confirmed") ? (
              <div className="border border-cr-primary/40 bg-cr-primary/[0.06] p-5 space-y-4">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary inline-flex items-center gap-2">
                  <Check size={14} aria-hidden="true" />
                  {myRequest.status === "confirmed" ? "Plaza confirmada" : "Solicitud pendiente"}
                </p>
                <p className="font-sans text-sm text-cr-text">
                  {myRequest.status === "confirmed" ? (
                    <>
                      <span className="font-mono text-cr-primary">{myRequest.seats}</span>{" "}
                      plaza{myRequest.seats === 1 ? "" : "s"} confirmada{myRequest.seats === 1 ? "" : "s"} con {ride.driver.name}. Nos vemos en el viaje.
                    </>
                  ) : (
                    <>
                      Pediste <span className="font-mono text-cr-primary">{myRequest.seats}</span>{" "}
                      plaza{myRequest.seats === 1 ? "" : "s"} a {ride.driver.name}. Te avisamos cuando confirme.
                    </>
                  )}
                </p>
                <button
                  type="button"
                  disabled={cancellingMine}
                  onClick={async () => {
                    if (!confirm("¿Cancelar tu reserva? Se libera la plaza para otros pasajeros.")) return;
                    setCancellingMine(true);
                    try {
                      const updated = await api.rides.updateRequest(ride.id, myRequest.id, "cancelled");
                      setMyRequest(updated);
                      // Refresh ride to reflect freed seats
                      const fresh = await api.rides.get(ride.id);
                      setRide(fresh);
                      setReserve({ status: "idle" });
                    } catch {
                      // silent — keep state
                    } finally {
                      setCancellingMine(false);
                    }
                  }}
                  className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text-muted hover:border-cr-secondary hover:text-cr-secondary px-3 py-1.5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  {cancellingMine ? "Cancelando…" : "Cancelar reserva"}
                </button>
              </div>
            ) : myRequest && myRequest.status === "rejected" ? (
              <div className="border border-dashed border-cr-border p-5 space-y-2">
                <p className="font-sans text-sm font-semibold text-cr-text">Solicitud rechazada</p>
                <p className="font-sans text-xs text-cr-text-muted">
                  {ride.driver.name} no pudo aceptar tu plaza. Hay más viajes a este concierto.
                </p>
              </div>
            ) : reserve.status === "success" ? (
              <div className="border border-cr-primary/40 bg-cr-primary/[0.06] p-5 space-y-3">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary inline-flex items-center gap-2">
                  <Check size={14} aria-hidden="true" /> Solicitud enviada
                </p>
                <p className="font-sans text-sm text-cr-text">
                  {ride.instant_booking ? (
                    <>
                      <span className="font-mono text-cr-primary">{reserve.request.seats}</span>{" "}
                      plaza{reserve.request.seats === 1 ? "" : "s"} confirmada{reserve.request.seats === 1 ? "" : "s"} con {ride.driver.name}. Nos vemos en el viaje.
                    </>
                  ) : (
                    <>
                      Pedimos <span className="font-mono text-cr-primary">{reserve.request.seats}</span>{" "}
                      plaza{reserve.request.seats === 1 ? "" : "s"} a {ride.driver.name}. Te avisamos cuando confirme.
                    </>
                  )}
                </p>
              </div>
            ) : isFull ? (
              <div className="border border-dashed border-cr-border p-5">
                <p className="font-display uppercase">Viaje completo</p>
                <p className="font-sans text-sm text-cr-text-muted mt-1">
                  Puedes publicar otro viaje desde {ride.origin_city}.
                </p>
              </div>
            ) : (
              <form onSubmit={submitReserve} className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="seats"
                    className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted"
                  >
                    ¿Cuántos asientos?
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Restar un asiento"
                      onClick={() => setSeats((s) => Math.max(1, s - 1))}
                      className="w-9 h-9 flex items-center justify-center bg-cr-surface-2 border border-cr-border hover:border-cr-primary hover:text-cr-primary transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span id="seats" className="font-mono text-2xl text-cr-primary w-10 text-center">
                      {seats}
                    </span>
                    <button
                      type="button"
                      aria-label="Sumar un asiento"
                      onClick={() => setSeats((s) => Math.min(maxSeats, s + 1))}
                      className="w-9 h-9 flex items-center justify-center bg-cr-surface-2 border border-cr-border hover:border-cr-primary hover:text-cr-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                      disabled={seats >= maxSeats}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                    Equipaje
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(
                      [
                        { value: "none", label: "Sin equipaje" },
                        { value: "small", label: "Bolso pequeño" },
                        { value: "backpack", label: "Mochila" },
                        { value: "cabin", label: "Maleta cabina" },
                        { value: "large", label: "Maleta grande" },
                        { value: "extra", label: "Extra (instrumento…)" },
                      ] as { value: Luggage; label: string }[]
                    ).map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setLuggage(value)}
                        className={`py-2 px-3 font-sans text-xs font-semibold uppercase tracking-[0.08em] border-2 text-left transition-colors ${
                          luggage === value
                            ? "border-cr-primary text-cr-primary bg-cr-primary/5"
                            : "border-cr-border text-cr-text-muted hover:border-cr-primary/50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {ride.accepted_payment !== "cash" && (
                  <div className="space-y-2">
                    <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                      ¿Cómo pagas?
                    </span>
                    <div className="flex gap-2">
                      {PAYMENT_OPTIONS.filter(
                        (o) =>
                          ride.accepted_payment === "cash_or_bizum" ||
                          o.value === ride.accepted_payment,
                      ).map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setPaymentMethod(value)}
                          className={`flex-1 py-2 px-3 font-sans text-xs font-semibold uppercase tracking-[0.08em] border-2 transition-colors ${
                            paymentMethod === value
                              ? "border-cr-primary text-cr-primary bg-cr-primary/5"
                              : "border-cr-border text-cr-text-muted hover:border-cr-primary/50"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <label className="block space-y-2">
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                    {ride.price_negotiable ? "Tu propuesta al conductor" : "Mensaje al conductor (opcional)"}
                  </span>
                  {ride.price_negotiable && (
                    <p className="font-mono text-[11px] text-cr-primary">
                      Este viaje acepta negociación de precio. Indica aquí tu oferta y el conductor decidirá.
                    </p>
                  )}
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder={
                      ride.price_negotiable
                        ? "Ej: Ofrezco €10 por plaza, somos 2, somos puntuales…"
                        : "Soy puntual, no fumo, llevo mochila pequeña…"
                    }
                    className={`w-full bg-cr-bg border-2 outline-none px-3 py-2 font-sans text-sm text-cr-text placeholder:text-cr-text-dim transition-colors ${
                      ride.price_negotiable ? "border-cr-primary/50 focus:border-cr-primary" : "border-cr-border focus:border-cr-primary"
                    }`}
                  />
                </label>

                <div className="flex items-center justify-between gap-4 pt-2 border-t border-dashed border-cr-border">
                  <p className="font-mono text-sm">
                    Total <span className="text-cr-primary">€{seats * ride.price_per_seat}</span>
                    <span className="text-cr-text-dim">
                      {" "}
                      · {seats} × €{ride.price_per_seat}
                    </span>
                  </p>
                  <button
                    type="submit"
                    disabled={reserve.status === "submitting"}
                    className="bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {reserve.status === "submitting"
                    ? "Enviando…"
                    : ride.instant_booking
                    ? "Reservar ahora"
                    : "Reservar asiento"}
                  </button>
                </div>

                {reserve.status === "error" && (
                  <p className="font-mono text-xs text-cr-secondary">{reserve.message}</p>
                )}
              </form>
            )}
          </section>
        ) : null}

        {isCompleted && (
          <div className="border border-cr-primary/40 bg-cr-primary/[0.06] p-5 flex items-center gap-3">
            <CheckCheck size={18} className="text-cr-primary shrink-0" aria-hidden="true" />
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary">
                Viaje completado
              </p>
              <p className="font-sans text-xs text-cr-text-muted mt-0.5">
                ¡Gracias por viajar con ConcertRide! Puedes dejar una valoración abajo.
              </p>
            </div>
          </div>
        )}

        {canConfirmComplete && (
          <section className="border border-dashed border-cr-border p-5 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCheck size={16} className="text-cr-text-muted mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-sans text-sm font-semibold text-cr-text">
                  {driverAlreadyConfirmed ? "Esperando confirmación del pasajero" : "¿El viaje ya terminó?"}
                </p>
                <p className="font-sans text-xs text-cr-text-muted mt-0.5">
                  {driverAlreadyConfirmed
                    ? "Confirmaste el viaje. En cuanto el pasajero confirme, se marcará como completado."
                    : "Confirma que el viaje se realizó. El pasajero también podrá confirmarlo para dejarlo como completado."}
                </p>
              </div>
            </div>
            {!driverAlreadyConfirmed ? (
              <button
                type="button"
                onClick={handleConfirmComplete}
                disabled={completing}
                className="font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary/10 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                {completing ? "Confirmando…" : "Confirmar viaje completado"}
              </button>
            ) : (
              isDriver && (
                <button
                  type="button"
                  onClick={handleRevokeComplete}
                  disabled={completing}
                  className="font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text-muted px-4 py-2 hover:border-cr-secondary hover:text-cr-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  {completing ? "Cancelando…" : "Cancelar confirmación"}
                </button>
              )
            )}
          </section>
        )}

        {user && <RideChatSection ride={ride} currentUser={user} />}

        <RideReviewsSection ride={ride} currentUser={user ?? null} />
      </div>
    </main>
  );
}

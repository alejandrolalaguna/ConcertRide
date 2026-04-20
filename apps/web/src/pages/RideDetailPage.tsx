import { Suspense, lazy, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { motion } from "motion/react";
import { ArrowLeft, Check, Clock, MapPin, Minus, Music, Plus } from "lucide-react";
import type { Luggage, Ride, RideRequest, SmokingPolicy } from "@concertride/types";
import { api, ApiError } from "@/lib/api";

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
import { formatDate, formatTime } from "@/lib/format";
import { useSession } from "@/lib/session";
import { TrustBadge } from "@/components/TrustBadge";
import { VibeBadge } from "@/components/VibeBadge";
import { PulsingDot } from "@/components/LoadingStates";
import { DriverInbox } from "@/components/DriverInbox";
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
    canonical: id ? `https://concertride.es/rides/${id}` : undefined,
    ogType: "article",
  });
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState("");
  const [luggage, setLuggage] = useState<Luggage>("none");
  const [reserve, setReserve] = useState<ReserveState>({ status: "idle" });

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

  async function submitReserve(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ride) return;
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(`/rides/${ride.id}`)}`);
      return;
    }
    setReserve({ status: "submitting" });
    try {
      const req = await api.rides.requestSeat(ride.id, {
        seats,
        message: message.trim() || undefined,
        luggage,
      });
      setReserve({ status: "success", request: req });
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
              { "@type": "ListItem", position: 1, name: "Inicio", item: "https://concertride.es/" },
              { "@type": "ListItem", position: 2, name: "Conciertos", item: "https://concertride.es/concerts" },
              ...(ride ? [
                { "@type": "ListItem", position: 3, name: ride.concert.artist, item: `https://concertride.es/concerts/${ride.concert.id}` },
                { "@type": "ListItem", position: 4, name: `Viaje desde ${ride.origin_city}`, item: `https://concertride.es/rides/${ride.id}` },
              ] : []),
            ],
          }),
        }}
      />
      <div className="max-w-4xl mx-auto px-6 py-10 md:py-16 space-y-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
        >
          <ArrowLeft size={14} /> Volver
        </button>

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
                <p className="font-mono text-xs text-cr-text-muted">
                  {ride.concert.venue.name} · {formatDate(ride.concert.date)}
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm border-t border-dashed border-cr-border pt-4">
                <div>
                  <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                    Origen
                  </dt>
                  <dd className="font-mono text-xs text-cr-text mt-1 flex items-center gap-1.5">
                    <MapPin size={10} aria-hidden="true" />
                    {ride.origin_address}
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                    Salida
                  </dt>
                  <dd className="font-mono text-xs text-cr-text mt-1 flex items-center gap-1.5">
                    <Clock size={10} aria-hidden="true" />
                    {formatDate(ride.departure_time)} · {formatTime(ride.departure_time)}
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                    Vuelta
                  </dt>
                  <dd className="font-mono text-xs text-cr-text mt-1">
                    {ride.round_trip && ride.return_time
                      ? `${formatDate(ride.return_time)} · ${formatTime(ride.return_time)}`
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                    Coche
                  </dt>
                  <dd className="font-mono text-xs text-cr-text mt-1">
                    {ride.driver.car_model
                      ? `${ride.driver.car_model}${ride.driver.car_color ? ` · ${ride.driver.car_color}` : ""}`
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                    Fumar
                  </dt>
                  <dd className="font-mono text-xs text-cr-text mt-1">
                    {SMOKING_LABEL[ride.smoking_policy]}
                  </dd>
                </div>
                <div>
                  <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                    Equipaje máx.
                  </dt>
                  <dd className="font-mono text-xs text-cr-text mt-1">
                    🧳 {LUGGAGE_LABEL[ride.max_luggage]}
                  </dd>
                </div>
              </dl>

              {ride.notes && (
                <div className="border-t border-dashed border-cr-border pt-4">
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted mb-1">
                    Notas del conductor
                  </p>
                  <p className="font-sans text-sm text-cr-text leading-relaxed">{ride.notes}</p>
                </div>
              )}

              <div className="border-t border-dashed border-cr-border pt-4">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted mb-3">
                  Conductor
                </p>
                <TrustBadge user={ride.driver} />
              </div>
            </div>

            <div className="relative md:w-56 md:border-l md:border-dashed md:border-cr-border border-t md:border-t-0 border-dashed border-cr-border p-6 md:p-8 flex md:flex-col justify-between gap-4">
              <div>
                <p className="font-mono text-4xl text-cr-primary leading-none">€{ride.price_per_seat}</p>
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted mt-1">
                  /asiento
                </p>
              </div>
              <div className="flex md:flex-col md:items-start items-end gap-2">
                <p className="font-mono text-sm text-cr-text">
                  {ride.seats_left} plaza{ride.seats_left === 1 ? "" : "s"}
                </p>
                <VibeBadge vibe={ride.vibe} />
                {ride.playlist_url && (
                  <a
                    href={ride.playlist_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted hover:text-cr-primary"
                  >
                    <Music size={12} aria-hidden="true" />
                    Playlist
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.article>

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
          <DriverInbox
            ride={ride}
            onRequestUpdated={(fresh) => setRide(fresh)}
          />
        ) : !user && !sessionLoading ? (
          <section className="border border-dashed border-cr-border p-6 md:p-8 text-center space-y-4">
            <p className="font-display text-lg uppercase">Inicia sesión para reservar</p>
            <p className="font-sans text-sm text-cr-text-muted">
              Te mandamos un enlace mágico, sin contraseñas. Vuelves a esta página al confirmar.
            </p>
            <Link
              to={`/login?next=${encodeURIComponent(`/rides/${ride.id}`)}`}
              className="inline-flex items-center justify-center bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
            >
              Entrar
            </Link>
          </section>
        ) : user ? (
          <section
            aria-labelledby="reserve-title"
            className="bg-cr-surface border border-cr-border p-6 md:p-8 space-y-5"
          >
            <header className="space-y-1">
              <h2 id="reserve-title" className="font-display text-lg uppercase tracking-wide">
                Reservar asiento
              </h2>
              <p className="font-mono text-xs text-cr-text-muted">
                Pago en efectivo al conductor. El conductor confirma tu solicitud.
              </p>
            </header>

            {reserve.status === "success" ? (
              <div className="border border-cr-primary/40 bg-cr-primary/[0.06] p-5 space-y-3">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary inline-flex items-center gap-2">
                  <Check size={14} aria-hidden="true" /> Solicitud enviada
                </p>
                <p className="font-sans text-sm text-cr-text">
                  Pedimos <span className="font-mono text-cr-primary">{reserve.request.seats}</span>{" "}
                  plaza{reserve.request.seats === 1 ? "" : "s"} a {ride.driver.name}. Te avisamos
                  cuando confirme.
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

                <label className="block space-y-2">
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                    Mensaje al conductor (opcional)
                  </span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Soy puntual, no fumo, llevo mochila pequeña…"
                    className="w-full bg-cr-bg border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-2 font-sans text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
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
                    {reserve.status === "submitting" ? "Enviando…" : "Reservar asiento"}
                  </button>
                </div>

                {reserve.status === "error" && (
                  <p className="font-mono text-xs text-cr-secondary">{reserve.message}</p>
                )}
              </form>
            )}
          </section>
        ) : null}

        <RideReviewsSection ride={ride} currentUser={user ?? null} />
      </div>
    </main>
  );
}

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ShieldCheck, Star } from "lucide-react";
import type { Review, Ride, User } from "@concertride/types";
import { api } from "@/lib/api";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { VibeBadge } from "@/components/VibeBadge";
import { PulsingDot } from "@/components/LoadingStates";
import { initials, formatDate, formatDay } from "@/lib/format";
import { ReportButton } from "@/components/ReportButton";
import { useSession } from "@/lib/session";

type PublicUser = Omit<User, "email">;

export default function DriverProfilePage() {
  const { user: currentUser } = useSession();
  const { id } = useParams<{ id: string }>();
  const [driver, setDriver] = useState<PublicUser | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState(false);

  useSeoMeta({
    title: driver
      ? `${driver.name} — Conductor en ConcertRide ES`
      : "Perfil de conductor — ConcertRide ES",
    description: driver
      ? `${driver.name} ha hecho ${driver.rides_given} viajes en ConcertRide. Valoración: ${driver.rating.toFixed(1)}/5.`
      : "Conductor en ConcertRide ES.",
    canonical: id ? `${SITE_URL}/drivers/${id}` : undefined,
    ogImage: driver?.avatar_url ?? undefined,
    ogType: "article",
  });

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.users.get(id),
      api.rides.list({ driver_id: id }),
      api.users.listReviews(id),
    ])
      .then(([user, ridesRes, reviewsRes]) => {
        setDriver(user);
        setRides(ridesRes.rides);
        setReviews(reviewsRes.reviews);
      })
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return (
      <main className="min-h-dvh flex items-center justify-center px-6 bg-cr-bg">
        <div className="text-center space-y-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-secondary">404</p>
          <h1 className="font-display text-3xl uppercase">Conductor no encontrado</h1>
          <Link to="/" className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-primary border-b border-cr-primary pb-0.5">
            ← Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  if (!driver) {
    return (
      <main className="min-h-dvh bg-cr-bg flex items-center justify-center">
        <PulsingDot label="Cargando perfil" />
      </main>
    );
  }

  const upcomingRides = rides.filter((r) => r.status === "active" || r.status === "full");
  const completedRides = rides.filter((r) => r.status === "completed");
  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

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
              { "@type": "ListItem", position: 2, name: "Conductores", item: `${SITE_URL}/drivers` },
              { "@type": "ListItem", position: 3, name: driver.name, item: `${SITE_URL}/drivers/${driver.id}` },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            url: `${SITE_URL}/drivers/${driver.id}`,
            mainEntity: {
              "@type": "Person",
              "@id": `${SITE_URL}/drivers/${driver.id}`,
              name: driver.name,
              image: driver.avatar_url ?? undefined,
              url: `${SITE_URL}/drivers/${driver.id}`,
              description: `Conductor en ConcertRide ES con ${driver.rides_given} viajes realizados.`,
              memberOf: { "@id": `${SITE_URL}/#organization` },
              ...(driver.home_city && {
                homeLocation: {
                  "@type": "Place",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: driver.home_city,
                    addressCountry: "ES",
                  },
                },
              }),
              ...(driver.rating_count > 0 && {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: driver.rating.toFixed(1),
                  reviewCount: driver.rating_count,
                  bestRating: "5",
                  worstRating: "1",
                },
                review: reviews.slice(0, 5).map((r) => ({
                  "@type": "Review",
                  author: {
                    "@type": "Person",
                    name: r.reviewer?.name ?? "Usuario",
                  },
                  datePublished: r.created_at,
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: r.rating,
                    bestRating: "5",
                    worstRating: "1",
                  },
                  ...(r.comment && { reviewBody: r.comment }),
                })),
              }),
            },
          }),
        }}
      />
      <div className="max-w-3xl mx-auto px-6 py-10 md:py-16 space-y-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
        >
          <ArrowLeft size={14} /> Volver
        </Link>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start gap-5"
        >
          <div className="w-20 h-20 rounded-full bg-cr-primary text-black font-display text-3xl flex items-center justify-center shrink-0">
            {initials(driver.name)}
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-3xl md:text-4xl uppercase leading-tight">{driver.name}</h1>
              {driver.license_verified && (
                <span
                  className="inline-flex items-center gap-1 font-sans text-[10px] font-semibold uppercase tracking-[0.1em] bg-cr-primary text-black px-1.5 py-0.5"
                  title="Carnet de conducir verificado"
                >
                  <ShieldCheck size={10} strokeWidth={3} aria-hidden="true" />
                  Verificado
                </span>
              )}
            </div>
            {driver.home_city && (
              <p className="font-mono text-xs text-cr-text-muted">{driver.home_city}</p>
            )}
            <div className="flex items-center gap-4 flex-wrap pt-1">
              <div className="flex items-center gap-1">
                <Star size={12} className="fill-cr-primary text-cr-primary" aria-hidden="true" />
                <span className="font-mono text-sm text-cr-primary">{driver.rating.toFixed(1)}</span>
                {driver.rating_count > 0 && (
                  <span className="font-mono text-xs text-cr-text-dim">({driver.rating_count})</span>
                )}
              </div>
              <span className="font-mono text-xs text-cr-text-muted">{driver.rides_given} viajes dados</span>
              {driver.smoker === false && <span className="font-mono text-xs">🚭 No fumador</span>}
              {driver.car_model && (
                <span className="font-mono text-xs text-cr-text-muted">
                  {driver.car_model}{driver.car_color ? ` · ${driver.car_color}` : ""}
                </span>
              )}
            </div>
            {currentUser && currentUser.id !== driver.id && (
              <div className="pt-2">
                <ReportButton targetUserId={driver.id} variant="inline" />
              </div>
            )}
          </div>
        </motion.header>

        {/* Stats bar */}
        <dl className="grid grid-cols-3 gap-px bg-cr-border border border-cr-border">
          <div className="bg-cr-surface px-4 py-4 text-center">
            <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted mb-1">Viajes dados</dt>
            <dd className="font-mono text-2xl text-cr-primary">{driver.rides_given}</dd>
          </div>
          <div className="bg-cr-surface px-4 py-4 text-center">
            <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted mb-1">Valoración</dt>
            <dd className="font-mono text-2xl text-cr-primary">
              {avgRating !== null ? avgRating.toFixed(1) : driver.rating.toFixed(1)}
            </dd>
          </div>
          <div className="bg-cr-surface px-4 py-4 text-center">
            <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted mb-1">Reseñas</dt>
            <dd className="font-mono text-2xl text-cr-text">{reviews.length}</dd>
          </div>
        </dl>

        {/* Upcoming rides */}
        {upcomingRides.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary border-b border-cr-border pb-2">
              Próximos viajes
            </h2>
            <ul className="space-y-3">
              {upcomingRides.map((ride) => (
                <li key={ride.id}>
                  <Link
                    to={`/rides/${ride.id}`}
                    className="block bg-cr-surface border border-cr-border hover:border-cr-primary transition-colors p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-display text-base uppercase leading-tight truncate">
                          {ride.concert.artist}
                        </p>
                        <p className="font-mono text-[11px] text-cr-text-muted mt-0.5">
                          {ride.origin_city} → {ride.concert.venue.city} · {formatDate(ride.departure_time)}
                        </p>
                      </div>
                      <div className="text-right shrink-0 space-y-1">
                        <p className="font-mono text-sm text-cr-primary">€{ride.price_per_seat}/plaza</p>
                        <VibeBadge vibe={ride.vibe} />
                        <p className="font-mono text-[11px] text-cr-text-muted">
                          {ride.seats_left} libre{ride.seats_left === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Completed rides history */}
        {completedRides.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted border-b border-cr-border pb-2">
              Historial de viajes completados
            </h2>
            <ul className="space-y-1">
              {completedRides.slice(0, 5).map((ride) => (
                <li key={ride.id} className="flex items-center justify-between py-1.5 border-b border-dashed border-cr-border last:border-0">
                  <span className="font-sans text-xs text-cr-text">{ride.concert.artist}</span>
                  <span className="font-mono text-[11px] text-cr-text-dim">
                    {ride.origin_city} → {ride.concert.venue.city}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary border-b border-cr-border pb-2">
              Valoraciones ({reviews.length})
            </h2>
            <ul className="space-y-3">
              {reviews.map((r) => (
                <li key={r.id} className="bg-cr-surface border border-cr-border p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-cr-border text-cr-text-muted font-display text-xs flex items-center justify-center shrink-0">
                        {initials(r.reviewer.name)}
                      </div>
                      <span className="font-sans text-xs font-semibold text-cr-text">{r.reviewer.name}</span>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={11}
                          className={n <= r.rating ? "fill-cr-primary stroke-cr-primary" : "stroke-cr-border fill-transparent"}
                        />
                      ))}
                    </div>
                  </div>
                  {r.comment && (
                    <p className="font-mono text-xs text-cr-text-muted leading-relaxed">{r.comment}</p>
                  )}
                  <p className="font-mono text-[10px] text-cr-text-dim">{formatDay(r.created_at)}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {upcomingRides.length === 0 && completedRides.length === 0 && reviews.length === 0 && (
          <p className="font-mono text-sm text-cr-text-dim text-center py-8">
            Este conductor aún no tiene viajes publicados.
          </p>
        )}
      </div>
    </main>
  );
}

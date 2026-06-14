import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Car, Music2, TicketCheck } from "lucide-react";
import type { Ride, RideRequest } from "@concertride/types";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { useI18n } from "@/lib/i18n";
import { formatDate, formatTime } from "@/lib/format";
import { LoadingSpinner } from "@/components/ui";

type PassengerRequest = RideRequest & { ride: Ride };
type Tab = "upcoming" | "past";

export default function MyRidesPage() {
  const { t } = useI18n();
  const { user, loading: sessionLoading } = useSession();
  const [driverRides, setDriverRides] = useState<Ride[]>([]);
  const [passengerRequests, setPassengerRequests] = useState<PassengerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [tab, setTab] = useState<Tab>("upcoming");

  useSeoMeta({
    title: "Mis viajes",
    description: "Tus reservas de pasajero y viajes publicados como conductor en ConcertRide.",
    canonical: `${SITE_URL}/mis-viajes`,
    noindex: true,
  });

  useEffect(() => {
    if (sessionLoading || !user) return;
    setLoading(true);
    setLoadError(false);
    api.rides
      .listMine()
      .then((r) => {
        setDriverRides(r.driver_rides);
        setPassengerRequests(r.passenger_requests);
      })
      .catch(() => {
        setDriverRides([]);
        setPassengerRequests([]);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }, [user, sessionLoading]);

  // Partition by upcoming / past based on departure_time
  const nowMs = Date.now();
  const { upcomingDriver, pastDriver, upcomingPassenger, pastPassenger } = useMemo(() => {
    const isUpcoming = (iso: string) => new Date(iso).getTime() >= nowMs;
    return {
      upcomingDriver: driverRides.filter((r) => isUpcoming(r.departure_time)),
      pastDriver: driverRides.filter((r) => !isUpcoming(r.departure_time)),
      upcomingPassenger: passengerRequests.filter((r) => isUpcoming(r.ride.departure_time)),
      pastPassenger: passengerRequests.filter((r) => !isUpcoming(r.ride.departure_time)),
    };
  }, [driverRides, passengerRequests, nowMs]);

  if (sessionLoading) return <LoadingSpinner text={t("myRides.loading")} />;
  if (!user) return <Navigate to="/login?next=/mis-viajes" replace />;

  const currentDriver = tab === "upcoming" ? upcomingDriver : pastDriver;
  const currentPassenger = tab === "upcoming" ? upcomingPassenger : pastPassenger;
  const isEmpty = currentDriver.length === 0 && currentPassenger.length === 0;

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-16">
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          {t("myRides.eyebrow")}
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          {t("myRides.title")}
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="flex gap-0 border-b border-cr-border">
          {(
            [
              { id: "upcoming" as Tab, label: t("myRides.tabUpcoming") },
              { id: "past" as Tab, label: t("myRides.tabPast") },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                // Keep the freshly-filtered list in view (lists can be long).
                if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-b-2 -mb-px transition-colors ${
                tab === id
                  ? "border-cr-primary text-cr-primary"
                  : "border-transparent text-cr-text-muted hover:text-cr-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24 pt-8 space-y-12">
        {loading ? (
          <LoadingSpinner text={t("myRides.loadingList")} />
        ) : loadError ? (
          <div className="py-24 text-center space-y-2">
            <p className="font-display text-2xl uppercase text-cr-text-muted">{t("myRides.errorTitle")}</p>
            <p className="font-sans text-sm text-cr-text-dim">{t("myRides.errorBody")}</p>
          </div>
        ) : isEmpty ? (
          <div className="border border-dashed border-cr-border p-10 text-center space-y-3">
            <p className="font-display text-2xl uppercase text-cr-text-muted">
              {tab === "upcoming" ? t("myRides.emptyUpcomingTitle") : t("myRides.emptyPastTitle")}
            </p>
            <p className="font-sans text-sm text-cr-text-dim">
              {tab === "upcoming"
                ? t("myRides.emptyUpcomingBody")
                : t("myRides.emptyPastBody")}
            </p>
            {tab === "upcoming" && (
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Link
                  to="/publish"
                  className="font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-4 py-2 border-2 border-black"
                >
                  {t("myRides.publishRide")}
                </Link>
                <Link
                  to="/concerts"
                  className="font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text hover:border-cr-primary hover:text-cr-primary px-4 py-2 transition-colors"
                >
                  {t("myRides.exploreConcerts")}
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            {currentPassenger.length > 0 && (
              <section className="space-y-4">
                <header className="flex items-center gap-2 border-b border-cr-border pb-2">
                  <TicketCheck size={14} className="text-cr-text-muted" />
                  <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
                    {t("myRides.passengerSection")}
                  </h2>
                  <span className="ml-auto font-mono text-xs text-cr-text-muted">
                    {currentPassenger.length}
                  </span>
                </header>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentPassenger.map((req) => (
                    <PassengerRow key={req.id} req={req} />
                  ))}
                </ul>
              </section>
            )}

            {currentDriver.length > 0 && (
              <section className="space-y-4">
                <header className="flex items-center gap-2 border-b border-cr-border pb-2">
                  <Car size={14} className="text-cr-text-muted" />
                  <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
                    {t("myRides.driverSection")}
                  </h2>
                  <span className="ml-auto font-mono text-xs text-cr-text-muted">
                    {currentDriver.length}
                  </span>
                </header>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentDriver.map((ride) => (
                    <DriverRow key={ride.id} ride={ride} />
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function StatusPill({ status }: { status: string }) {
  const { t } = useI18n();
  const tone =
    status === "confirmed" || status === "active"
      ? "text-cr-primary border-cr-primary"
      : status === "full" || status === "pending"
        ? "text-cr-text-muted border-cr-border"
        : status === "completed"
          ? "text-cr-text border-cr-border bg-cr-border/10"
          : "text-cr-secondary border-cr-secondary";
  const label: Record<string, string> = {
    pending: t("myRides.statusPending"),
    confirmed: t("myRides.statusConfirmed"),
    rejected: t("myRides.statusRejected"),
    cancelled: t("myRides.statusCancelled"),
    active: t("myRides.statusActive"),
    full: t("myRides.statusFull"),
    completed: t("myRides.statusCompleted"),
  };
  return (
    <span
      className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] border px-2 py-0.5 ${tone}`}
    >
      {label[status] ?? status}
    </span>
  );
}

function PassengerRow({ req }: { req: PassengerRequest }) {
  const { t } = useI18n();
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-cr-border bg-cr-surface hover:border-cr-primary/50 transition-colors"
    >
      <Link to={`/rides/${req.ride.id}`} className="block p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-display text-base uppercase leading-tight line-clamp-1 inline-flex items-center gap-2">
              <Music2 size={13} className="text-cr-text-muted shrink-0" aria-hidden="true" />
              {req.ride.concert.artist}
            </p>
            <p className="font-mono text-[11px] text-cr-text-muted mt-0.5">
              {req.ride.origin_city} → {req.ride.concert.venue.city}
            </p>
          </div>
          <StatusPill status={req.status} />
        </div>
        <p className="font-mono text-xs text-cr-text">
          {formatDate(req.ride.departure_time)} · {formatTime(req.ride.departure_time)}
        </p>
        <p className="font-mono text-[11px] text-cr-text-dim">
          {req.seats === 1
            ? t("myRides.passengerSeatsSingular", { total: req.ride.price_per_seat * req.seats })
            : t("myRides.passengerSeatsPlural", { count: req.seats, total: req.ride.price_per_seat * req.seats })}
        </p>
      </Link>
    </motion.li>
  );
}

function DriverRow({ ride }: { ride: Ride }) {
  const { t } = useI18n();
  const booked = ride.seats_total - ride.seats_left;
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-cr-border bg-cr-surface hover:border-cr-primary/50 transition-colors"
    >
      <Link to={`/rides/${ride.id}`} className="block p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-display text-base uppercase leading-tight line-clamp-1 inline-flex items-center gap-2">
              <Music2 size={13} className="text-cr-text-muted shrink-0" aria-hidden="true" />
              {ride.concert.artist}
            </p>
            <p className="font-mono text-[11px] text-cr-text-muted mt-0.5">
              {ride.origin_city} → {ride.concert.venue.city}
            </p>
          </div>
          <StatusPill status={ride.status} />
        </div>
        <p className="font-mono text-xs text-cr-text">
          {formatDate(ride.departure_time)} · {formatTime(ride.departure_time)}
        </p>
        <p className="font-mono text-[11px] text-cr-text-dim">
          {t("myRides.driverSeats", { booked, total: ride.seats_total, price: ride.price_per_seat })}
        </p>
      </Link>
    </motion.li>
  );
}

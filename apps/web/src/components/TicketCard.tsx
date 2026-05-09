import { motion } from "motion/react";
import { Music, Users, Zap, ChevronRight } from "lucide-react";
import type { Luggage, Ride } from "@concertride/types";
import { formatDay, formatTime, initials } from "@/lib/format";
import { VibeBadge } from "./VibeBadge";
import { HotRidesBadge } from "./HotRidesBadge";
import { SocialProofText } from "./SocialProofText";

const LUGGAGE_LABEL: Record<Luggage, string> = {
  none: "Sin equipaje",
  small: "Bolso pequeño",
  backpack: "Mochila",
  cabin: "Maleta cabina",
  large: "Maleta grande",
  extra: "Extra",
};

interface Props {
  ride: Ride;
  onClick?: () => void;
}

export function TicketCard({ ride, onClick }: Props) {
  const { concert, driver } = ride;
  const label = `Viaje de ${ride.origin_city} a ${concert.artist} el ${formatDay(concert.date)}`;
  const isFull = ride.seats_left === 0;
  const isLastSeat = ride.seats_left === 1;

  return (
    <motion.article
      whileHover={{ y: -4, transition: { duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] } }}
      aria-label={label}
      onClick={onClick}
      className="group relative flex overflow-hidden bg-cr-surface border border-cr-border hover:border-cr-primary/30 transition-[border-color,box-shadow] duration-200 hover:shadow-[0_16px_48px_rgb(0_0_0/0.6),0_0_0_1px_rgb(212_247_0/0.06)] cursor-pointer"
    >
      {/* Left accent bar — color-coded by vibe */}
      <div
        className={`w-1 flex-shrink-0 ${
          ride.vibe === "party"
            ? "bg-cr-secondary"
            : ride.vibe === "mixed"
            ? "bg-cr-primary"
            : "bg-cr-border-mid"
        }`}
      />

      {/* Main left content */}
      <div className="flex-1 p-5 space-y-4 min-w-0">
        {/* Route label */}
        <div className="flex items-center gap-2">
          <span className="cr-overline text-cr-primary">{ride.origin_city}</span>
          <ChevronRight size={10} className="text-cr-text-dim flex-shrink-0" />
          <span className="cr-overline text-cr-text-muted">{concert.venue.city}</span>
        </div>

        {/* Artist + venue */}
        <div className="space-y-1">
          <h3 className="font-display text-xl uppercase leading-tight tracking-tight truncate">
            {concert.artist}
          </h3>
          <p className="font-sans text-sm text-cr-text-muted truncate">
            {concert.venue.name}
          </p>
          <p className="font-mono text-xs text-cr-text-dim">
            {formatDay(concert.date)} · salida {formatTime(ride.departure_time)}
          </p>
        </div>

        {/* Driver row */}
        <div className="flex items-center gap-3 pt-1">
          <div
            aria-hidden="true"
            className="w-9 h-9 flex-shrink-0 bg-cr-surface-3 border border-cr-border-mid flex items-center justify-center font-display text-xs font-black text-cr-primary"
          >
            {initials(driver.name)}
          </div>
          <div className="leading-tight min-w-0">
            <p className="font-sans text-sm font-medium text-cr-text truncate flex items-center gap-1.5">
              {driver.name}
              {driver.verified && (
                <span
                  className="w-4 h-4 bg-cr-primary/20 text-cr-primary inline-flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  aria-label="Verificado"
                >
                  ✓
                </span>
              )}
            </p>
            <p className="font-mono text-xs text-cr-text-muted flex items-center gap-1.5">
              {driver.rating_count >= 3 && (
                <span className="text-cr-primary font-semibold">
                  ★ {driver.rating.toFixed(1)}
                  <span className="text-cr-text-dim font-normal ml-1">({driver.rating_count})</span>
                </span>
              )}
              {driver.rating_count >= 3 && <span className="text-cr-text-dim">·</span>}
              <span>{driver.rides_given} viajes</span>
            </p>
          </div>
        </div>

        {/* Extras row */}
        <div className="flex items-center gap-3 text-cr-text-dim font-mono text-xs pt-1">
          <span title={ride.smoking_policy === "no" ? "No fumar" : "Fumadores"}>
            {ride.smoking_policy === "no" ? "🚭" : "🚬"}
          </span>
          {ride.max_luggage !== "extra" && (
            <span title={LUGGAGE_LABEL[ride.max_luggage]}>
              🧳 {LUGGAGE_LABEL[ride.max_luggage]}
            </span>
          )}
          {ride.playlist_url && (
            <a
              href={ride.playlist_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Playlist del viaje"
              className="flex items-center gap-1 text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              <Music size={11} />
              <span className="text-[10px]">Playlist</span>
            </a>
          )}
        </div>
      </div>

      {/* Perforation divider */}
      <div className="relative w-0 flex-shrink-0 my-0">
        <div className="absolute inset-y-0 left-0 border-l border-dashed border-cr-border-mid" />
        <span
          aria-hidden="true"
          className="absolute -left-[6px] -top-[6px] w-[12px] h-[12px] rounded-full bg-cr-bg border border-cr-border-mid"
        />
        <span
          aria-hidden="true"
          className="absolute -left-[6px] -bottom-[6px] w-[12px] h-[12px] rounded-full bg-cr-bg border border-cr-border-mid"
        />
      </div>

      {/* Right stub — price + seats */}
      <div className="w-[130px] flex-shrink-0 p-5 flex flex-col justify-between gap-4 relative overflow-hidden">
        {/* Subtle ambient glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-cr-primary/0 to-cr-primary/0 group-hover:from-cr-primary/[0.03] transition-all duration-300" />

        {/* Price */}
        <div className="relative">
          <p className="font-mono text-[2.75rem] leading-none text-cr-primary font-bold tracking-tight">
            €{ride.price_per_seat}
          </p>
          <p className="font-mono text-[10px] text-cr-text-dim uppercase tracking-[0.1em] mt-1">
            / asiento
          </p>
        </div>

        {/* Seats + badges */}
        <div className="relative space-y-2">
          <p
            className={`font-mono text-sm font-semibold flex items-center gap-1.5 ${
              isFull
                ? "text-cr-text-dim line-through"
                : isLastSeat
                ? "text-cr-secondary"
                : "text-cr-text-muted"
            }`}
          >
            <Users size={12} aria-hidden="true" />
            {isFull
              ? "Completo"
              : `${ride.seats_left} plaza${ride.seats_left === 1 ? "" : "s"}`}
          </p>

          <div className="flex flex-wrap gap-1.5">
            <VibeBadge vibe={ride.vibe} />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {ride.instant_booking && (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-black bg-cr-primary px-2 py-0.5 uppercase tracking-[0.08em]">
                <Zap size={8} strokeWidth={3} className="fill-black" />
                Instante
              </span>
            )}
            {ride.price_negotiable && (
              <span className="inline-flex font-mono text-[10px] font-semibold text-cr-primary border border-cr-primary/50 bg-cr-primary/[0.06] px-2 py-0.5 uppercase tracking-[0.08em]">
                Negociable
              </span>
            )}
          </div>

          <HotRidesBadge
            seatsTaken={ride.seats_total - ride.seats_left}
            seatsTotal={ride.seats_total}
          />
          <SocialProofText
            seatsTaken={ride.seats_total - ride.seats_left}
            seatsTotal={ride.seats_total}
          />
        </div>
      </div>
    </motion.article>
  );
}

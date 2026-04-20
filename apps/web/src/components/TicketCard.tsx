import { motion } from "motion/react";
import { Music, Users } from "lucide-react";
import type { Luggage, Ride } from "@concertride/types";
import { formatDay, formatTime, initials } from "@/lib/format";
import { VibeBadge } from "./VibeBadge";

const LUGGAGE_LABEL: Record<Luggage, string> = {
  none: "Sin equipaje",
  small: "Bolso pequeño",
  backpack: "Mochila máx.",
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

  return (
    <motion.article
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      aria-label={label}
      onClick={onClick}
      className="group relative flex bg-cr-surface border border-cr-border hover:border-cr-primary/40 transition-colors cursor-pointer"
    >
      <div className="flex-1 p-5 space-y-3 min-w-0">
        <span className="inline-block font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-primary">
          De · {ride.origin_city}
        </span>

        <div className="space-y-1">
          <h3 className="font-display text-lg uppercase leading-tight truncate">
            {concert.artist}
          </h3>
          <p className="font-mono text-xs text-cr-text-muted truncate">
            {concert.venue.name} · {concert.venue.city}
          </p>
          <p className="font-mono text-xs text-cr-text-dim">
            {formatDay(concert.date)} · salida {formatTime(ride.departure_time)}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <div
            aria-hidden="true"
            className="w-9 h-9 rounded-full bg-cr-surface-2 border border-cr-border flex items-center justify-center font-mono text-[11px] text-cr-text"
          >
            {initials(driver.name)}
          </div>
          <div className="leading-tight">
            <p className="text-xs text-cr-text flex items-center gap-1">
              {driver.name}
              {driver.verified && (
                <span className="text-cr-primary" aria-label="Perfil verificado">
                  ✓
                </span>
              )}
            </p>
            <p className="font-mono text-[11px] text-cr-primary">
              ★ {driver.rating.toFixed(1)}
              <span className="text-cr-text-dim"> · {driver.rides_given} viajes</span>
            </p>
          </div>
        </div>
      </div>

      <div className="relative w-px bg-transparent border-l border-dashed border-cr-border mx-1 my-0">
        <span
          aria-hidden="true"
          className="absolute -left-[7px] -top-[7px] w-3 h-3 rounded-full bg-cr-bg border border-cr-border"
        />
        <span
          aria-hidden="true"
          className="absolute -left-[7px] -bottom-[7px] w-3 h-3 rounded-full bg-cr-bg border border-cr-border"
        />
      </div>

      <div className="w-32 p-5 flex flex-col justify-between gap-4">
        <div>
          <p className="font-mono text-3xl text-cr-primary leading-none">€{ride.price_per_seat}</p>
          <p className="font-sans text-[10px] font-semibold text-cr-text-muted uppercase tracking-[0.08em] mt-1">
            /asiento
          </p>
        </div>

        <div className="space-y-1.5">
          <p className="font-mono text-xs text-cr-text-muted flex items-center gap-1.5">
            <Users size={12} aria-hidden="true" />
            {ride.seats_left} plaza{ride.seats_left === 1 ? "" : "s"}
          </p>
          <VibeBadge vibe={ride.vibe} />
          <p className="font-mono text-[10px] text-cr-text-dim">
            {ride.smoking_policy === "no" ? "🚭" : "🚬"}{" "}
            {ride.smoking_policy === "no" ? "No fumar" : "Fumadores"}
          </p>
          {ride.max_luggage !== "extra" && (
            <p className="font-mono text-[10px] text-cr-text-dim truncate">
              🧳 {LUGGAGE_LABEL[ride.max_luggage]}
            </p>
          )}
        </div>
      </div>

      {ride.playlist_url && (
        <a
          href={ride.playlist_url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label="Playlist del viaje"
          className="absolute bottom-2 right-2 text-cr-text-muted hover:text-cr-primary transition-colors"
        >
          <Music size={14} />
        </a>
      )}
    </motion.article>
  );
}

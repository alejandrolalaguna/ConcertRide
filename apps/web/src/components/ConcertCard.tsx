import { motion } from "motion/react";
import type { Concert } from "@concertride/types";
import { formatDay } from "@/lib/format";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const THREE_WEEKS_MS = 21 * 24 * 60 * 60 * 1000;

export function concertStatus(date: string): "upcoming" | "passed" | "archived" {
  const diff = Date.now() - new Date(date).getTime();
  if (diff < 0) return "upcoming";
  if (diff < THREE_WEEKS_MS) return "passed";
  return "archived";
}

export function isPastConcert(date: string) {
  return Date.now() - new Date(date).getTime() >= ONE_WEEK_MS;
}

function hueFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

interface Props {
  concert: Concert;
  className?: string;
  onClick?: () => void;
}

export function ConcertCard({ concert, className = "", onClick }: Props) {
  const hue = hueFromString(concert.artist);
  const status = concertStatus(concert.date);

  return (
    <motion.article
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      aria-label={`${concert.artist} en ${concert.venue.name}, ${formatDay(concert.date)}`}
      onClick={onClick}
      className={`group relative overflow-hidden bg-cr-surface border border-cr-border hover:border-cr-primary/40 transition-colors cursor-pointer ${status !== "upcoming" ? "opacity-60" : ""} ${className}`}
    >
      {status === "passed" && (
        <div className="absolute top-3 left-3 z-10 bg-cr-secondary/90 text-white font-mono text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
          PASSED
        </div>
      )}
      <div className="aspect-[4/3] relative overflow-hidden">
        {concert.image_url ? (
          <img
            src={concert.image_url}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 30% 20%, hsl(${hue} 60% 10%), #080808 70%)`,
            }}
          >
            <span className="font-display text-[160px] leading-none text-cr-border/60 select-none">
              {concert.artist[0]}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-cr-bg via-cr-bg/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-4 space-y-1.5">
          <h3 className="font-display text-xl md:text-2xl uppercase leading-[1.05] line-clamp-2">
            {concert.artist}
          </h3>
          <p className="font-mono text-xs text-cr-text-muted line-clamp-1">
            {concert.venue.name} · {formatDay(concert.date)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 border-t border-cr-border">
        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
          {concert.venue.city}
        </span>
        <div className="flex items-center gap-2">
          {(concert.demand_count ?? 0) > 0 && (
            <span className="font-mono text-[10px] text-cr-secondary" title="Personas buscando viaje">
              {concert.demand_count} demanda
            </span>
          )}
          {concert.active_rides_count > 0 && (
            <span className="font-mono text-xs text-cr-primary">
              {concert.active_rides_count} viajes
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

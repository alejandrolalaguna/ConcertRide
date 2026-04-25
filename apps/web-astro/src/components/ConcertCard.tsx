import type { Concert } from "@concertride/types";
import { formatDay } from "@/lib/format";
import { parseGenreTags } from "@/lib/genre";
import { ConcertPoster } from "./ConcertPoster";

const THREE_WEEKS_MS = 21 * 24 * 60 * 60 * 1000;

function concertStatus(date: string): "upcoming" | "passed" | "archived" {
  const diff = Date.now() - new Date(date).getTime();
  if (diff < 0) return "upcoming";
  if (diff < THREE_WEEKS_MS) return "passed";
  return "archived";
}

interface Props {
  concert: Concert;
  className?: string;
}

export function ConcertCard({ concert, className = "" }: Props) {
  const status = concertStatus(concert.date);
  const tags = parseGenreTags(concert.genre).slice(0, 2);
  const ridesCount = concert.active_rides_count;
  const hasRides = ridesCount > 0;

  return (
    <article
      aria-label={`${concert.artist} en ${concert.venue.name}, ${formatDay(concert.date)}`}
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
            alt={`${concert.artist} — ${concert.venue.name}, ${concert.venue.city}`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <ConcertPoster concert={concert} className="transition-transform duration-300 group-hover:scale-[1.02]" />
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

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-3 pt-3">
          {tags.map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] uppercase tracking-[0.1em] text-cr-text-muted border border-cr-border px-1.5 py-0.5"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between p-3 border-t border-cr-border mt-3">
        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
          {concert.venue.city}
        </span>
        <div className="flex items-center gap-2">
          {(concert.demand_count ?? 0) > 0 && (
            <span className="font-mono text-[10px] text-cr-secondary" title="Personas buscando viaje">
              {concert.demand_count} demanda
            </span>
          )}
          <span
            className={`font-mono text-xs ${hasRides ? "text-cr-primary" : "text-cr-text-muted"}`}
          >
            {hasRides ? `${ridesCount} viaje${ridesCount === 1 ? "" : "s"}` : "Sin viajes"}
          </span>
        </div>
      </div>
    </article>
  );
}

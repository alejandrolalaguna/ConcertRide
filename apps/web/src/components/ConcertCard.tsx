import { motion } from "motion/react";
import React from "react";
import type { Concert } from "@concertride/types";
import { formatDay } from "@/lib/format";
import { parseGenreTags } from "@/lib/genre";
import { FavoriteButton } from "./FavoriteButton";
import { ConcertPoster } from "./ConcertPoster";
import { cfImage } from "@/lib/imageUrl";

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

interface Props {
  concert: Concert;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
}

function ConcertCardComponent({ concert, className = "", onClick, priority = false }: Props) {
  const status = concertStatus(concert.date);
  const tags = parseGenreTags(concert.genre).slice(0, 2);
  const ridesCount = concert.active_rides_count;
  const hasRides = ridesCount > 0;

  return (
    <motion.article
      whileHover={{ y: -6, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] } }}
      aria-label={`${concert.artist} en ${concert.venue.name}, ${formatDay(concert.date)}`}
      onClick={onClick}
      className={`group relative overflow-hidden bg-cr-surface border border-cr-border cursor-pointer transition-[border-color,box-shadow] duration-200 hover:border-cr-primary/30 hover:shadow-[0_20px_60px_rgb(0_0_0/0.7),0_0_0_1px_rgb(212_247_0/0.08)] ${status !== "upcoming" ? "opacity-50 saturate-50" : ""} ${className}`}
    >
      {/* PASSED label */}
      {status === "passed" && (
        <div className="absolute top-0 left-0 z-20 bg-cr-secondary text-white font-mono text-[9px] font-bold uppercase tracking-[0.18em] px-2.5 py-1">
          PASADO
        </div>
      )}

      {/* Favorite — top-right overlay */}
      {status === "upcoming" && (
        <div className="absolute top-3 right-3 z-20">
          <FavoriteButton
            kind="concert"
            targetId={concert.id}
            label={`${concert.artist} — ${concert.venue.city}`}
            size="sm"
          />
        </div>
      )}

      {/* Image / poster */}
      <div className="aspect-[3/4] relative overflow-hidden">
        {concert.image_url ? (
          <img
            src={cfImage(concert.image_url, { width: 400, height: 533, quality: 80 })}
            srcSet={`${cfImage(concert.image_url, { width: 400, height: 533, quality: 75 })} 400w, ${cfImage(concert.image_url, { width: 700, height: 933, quality: 75 })} 700w`}
            sizes="(max-width: 768px) 78vw, 400px"
            alt={`${concert.artist} — ${concert.venue.name}, ${concert.venue.city}`}
            width={400}
            height={533}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <ConcertPoster
            concert={concert}
            className="transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}

        {/* Deep cinematic overlay — heavier vignette, editorial feel */}
        <div className="absolute inset-0 bg-gradient-to-t from-cr-bg via-cr-bg/50 to-transparent" />
        {/* Side vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-cr-bg/20 via-transparent to-cr-bg/20" />

        {/* Ambient primary glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-cr-primary/0 to-transparent opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300" />

        {/* Genre tags — floating on image */}
        {tags.length > 0 && (
          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1">
            {tags.map((t) => (
              <span
                key={t}
                className="font-mono text-[9px] uppercase tracking-[0.12em] text-cr-text-muted bg-cr-bg/80 backdrop-blur-sm border border-cr-border px-2 py-0.5"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Bottom content overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 space-y-2">
          <h3 className="font-display text-2xl uppercase leading-[1] tracking-tight line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {concert.artist}
          </h3>
          <p className="font-mono text-[11px] text-cr-text-muted line-clamp-1">
            {concert.venue.name}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-cr-surface border-t border-cr-border">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted">
            {concert.venue.city}
          </p>
          <p className="font-sans text-xs text-cr-text font-medium mt-0.5">
            {formatDay(concert.date)}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {(concert.demand_count ?? 0) > 0 && (
            <span className="font-mono text-[10px] text-cr-secondary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cr-secondary animate-pulse" />
              {concert.demand_count} buscan
            </span>
          )}
          <span
            className={`font-mono text-xs font-semibold transition-colors ${
              hasRides
                ? "text-cr-primary"
                : "text-cr-text-dim"
            }`}
          >
            {hasRides
              ? `${ridesCount} viaje${ridesCount === 1 ? "" : "s"}`
              : "Sin viajes"}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export const ConcertCard = React.memo(ConcertCardComponent);

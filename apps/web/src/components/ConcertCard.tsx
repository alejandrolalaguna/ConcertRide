import React, { useEffect, useRef } from "react";
import type { Concert } from "@concertride/types";
import { formatDay } from "@/lib/format";
import { parseGenreTags } from "@/lib/genre";
import { FavoriteButton } from "./FavoriteButton";
import { ConcertPoster } from "./ConcertPoster";
import { cfImage } from "@/lib/imageUrl";
import { attachTilt } from "@/fx/tilt";

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

/**
 * La tarjeta. Se reserva para lo que tiene imagen: el póster 3:4 llega del CDN
 * de Ticketmaster tal cual (sin proxy, sin reproceso — `cfImage` devuelve las
 * URLs externas intactas).
 *
 * Materia: inclinación ±6° con puntero fino (fx/tilt.ts, 0 dependencias), la
 * placa despierta al hover (scale + saturate) y la CTA vive en opacity 0 hasta
 * que te acercas. Sin blur, sin degradados sobre texto, un solo acento.
 *
 * API intacta: la consumen páginas fuera del alcance del rediseño.
 */
function ConcertCardComponent({ concert, className = "", onClick, priority = false }: Props) {
  const status = concertStatus(concert.date);
  const tags = parseGenreTags(concert.genre).slice(0, 2);
  const ridesCount = concert.active_rides_count;
  const hasRides = ridesCount > 0;
  const demand = concert.demand_count ?? 0;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || status !== "upcoming") return;
    return attachTilt(el);
  }, [status]);

  return (
    <article
      ref={ref}
      aria-label={`${concert.artist} en ${concert.venue.name}, ${formatDay(concert.date)}`}
      onClick={onClick}
      className={`cr-tilt group relative overflow-hidden bg-cr-surface border border-cr-border cursor-pointer transition-[border-color] duration-[var(--dur-2)] hover:border-cr-border-mid ${
        status !== "upcoming" ? "opacity-50 saturate-50" : ""
      } ${className}`}
    >
      {status === "passed" && (
        <div className="absolute top-0 left-0 z-20 bg-cr-secondary text-cr-text-inverse cr-label px-2.5 py-1">
          PASADO
        </div>
      )}

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

      {/* Póster */}
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
            className="cr-plate absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <ConcertPoster concert={concert} className="cr-plate" />
        )}

        {/* Velo: opaco abajo, casi nada en el centro, algo arriba (sostiene los tags) */}
        <div aria-hidden="true" className="cr-scrim-up absolute inset-0" />

        {/* Género: etiqueta sólida, sin blur */}
        {tags.length > 0 && (
          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1">
            {tags.map((tg) => (
              <span key={tg} className="cr-label bg-cr-bg text-cr-text-muted border border-cr-border px-2 py-0.5">
                {tg}
              </span>
            ))}
          </div>
        )}

        {/* Titular sobre el póster */}
        <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2">
          <h3 className="font-display text-display-s md:text-[1.625rem] leading-[0.95] line-clamp-2 text-cr-text">
            {concert.artist}
          </h3>
          <p className="text-[12px] text-cr-text-muted line-clamp-1">{concert.venue.name}</p>
        </div>
      </div>

      {/* Registro inferior: ciudad · fecha · viajes */}
      <div className="grid grid-cols-[1fr_auto] items-end gap-3 px-4 py-3 border-t border-cr-border bg-cr-surface">
        <div className="min-w-0">
          <p className="cr-label text-cr-text-muted">{concert.venue.city}</p>
          <p className="text-[13px] font-medium text-cr-text mt-0.5 cr-tabular">{formatDay(concert.date)}</p>
        </div>

        <div className="flex flex-col items-end gap-1">
          {demand > 0 && (
            <span className="cr-label text-cr-secondary inline-flex items-center gap-1.5" aria-label={`${demand} personas buscan viaje`}>
              <span className="cr-live-dot" aria-hidden="true" />
              <span aria-hidden="true" className="cr-tabular">{demand} buscan</span>
            </span>
          )}
          <span
            aria-label={hasRides ? `${ridesCount} viaje${ridesCount === 1 ? "" : "s"} disponible${ridesCount === 1 ? "" : "s"}` : "Sin viajes disponibles"}
            className={`cr-label cr-tabular ${hasRides ? "text-cr-primary" : "text-cr-text-muted"}`}
          >
            {hasRides ? `${ridesCount} viaje${ridesCount === 1 ? "" : "s"}` : "Sin viajes"}
          </span>
        </div>
      </div>

      {/* CTA diferida: limpia en reposo, entra al acercarse. Sin hover, siempre visible. */}
      {status === "upcoming" && (
        <span
          aria-hidden="true"
          className="cr-deferred absolute bottom-[3.75rem] right-4 z-10 inline-flex items-center gap-1.5 bg-cr-primary text-cr-text-inverse cr-label px-2.5 py-1.5"
        >
          {hasRides ? "Ver viajes" : "Pedir viaje"} →
        </span>
      )}
    </article>
  );
}

export const ConcertCard = React.memo(ConcertCardComponent);

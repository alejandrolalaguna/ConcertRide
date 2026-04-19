import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import type { Concert } from "@concertride/types";
import { formatDay } from "@/lib/format";

interface Props {
  concerts: Concert[];
}

function hueFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

function PastConcertRow({ concert }: { concert: Concert }) {
  const hue = hueFromString(concert.artist);
  return (
    <Link
      to={`/concerts/${concert.id}`}
      className="flex items-center gap-4 p-4 border border-cr-border hover:border-cr-border/60 hover:bg-cr-surface transition-colors group"
    >
      <div
        className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-xl font-display"
        style={{
          background: `radial-gradient(circle at 30% 20%, hsl(${hue} 40% 8%), #0e0e0e 70%)`,
        }}
      >
        {concert.image_url ? (
          <img
            src={concert.image_url}
            alt=""
            className="w-full h-full object-cover opacity-50"
          />
        ) : (
          <span className="text-cr-text-dim/40 font-display text-2xl leading-none select-none">
            {concert.artist[0]}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm uppercase leading-tight text-cr-text-muted group-hover:text-cr-text transition-colors line-clamp-1">
          {concert.artist}
        </p>
        <p className="font-mono text-[11px] text-cr-text-dim mt-0.5 line-clamp-1">
          {concert.venue.name} · {concert.venue.city}
        </p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="font-mono text-[11px] text-cr-text-dim">{formatDay(concert.date)}</p>
        {concert.active_rides_count > 0 && (
          <p className="font-mono text-[10px] text-cr-text-dim/60 mt-0.5">
            {concert.active_rides_count} viajes
          </p>
        )}
      </div>
      <div className="flex-shrink-0 bg-cr-surface-2 border border-cr-border px-2 py-0.5">
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-cr-text-dim">
          PAST
        </span>
      </div>
    </Link>
  );
}

export function PastConcertsSection({ concerts }: Props) {
  const visible = concerts.slice(0, 10);

  return (
    <section aria-labelledby="past-title" className="bg-cr-bg text-cr-text border-t border-cr-border">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div className="space-y-2">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-text-dim flex items-center gap-1.5">
              <Clock size={11} />
              Historial
            </p>
            <h2
              id="past-title"
              className="font-display text-3xl md:text-4xl uppercase leading-[0.95] text-cr-text-muted"
            >
              Conciertos
              <br />
              pasados.
            </h2>
          </div>
          <Link
            to="/concerts?tab=past"
            className="hidden md:inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-dim hover:text-cr-text-muted transition-colors"
          >
            Ver todos
          </Link>
        </div>

        <div className="space-y-px">
          {visible.map((c) => (
            <PastConcertRow key={c.id} concert={c} />
          ))}
        </div>

        {concerts.length > 10 && (
          <div className="mt-6 text-center">
            <Link
              to="/concerts?tab=past"
              className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-dim hover:text-cr-text-muted transition-colors"
            >
              Ver {concerts.length - 10} más →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

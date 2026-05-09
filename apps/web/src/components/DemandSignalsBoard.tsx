import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { DemandPrediction } from "@concertride/types";
import { api } from "@/lib/api";
import { CountdownBadge } from "./CountdownBadge";

// Surfaces concerts where many people said "voy" but few rides exist —
// the perfect prompt for potential drivers ("12 going, only 1 car —
// publish yours and fill it").
export function DemandSignalsBoard({ limit = 6, layout = "card" }: { limit?: number; layout?: "card" | "inline" }) {
  const [items, setItems] = useState<DemandPrediction[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await api.stats.demand(limit);
        if (!cancelled) setItems(res.items);
      } catch {
        if (!cancelled) setItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  if (!items || items.length === 0) return null;

  const wrapperClass = layout === "card"
    ? "border-2 border-cr-secondary/50 bg-gradient-to-br from-cr-bg via-cr-surface-2 to-cr-bg"
    : "border-y border-cr-border";

  return (
    <section
      aria-label="Conciertos con demanda alta sin coches"
      className={wrapperClass}
    >
      <header className="flex items-baseline justify-between gap-3 border-b border-cr-border px-5 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cr-secondary">
            🔥 Demanda alta · pocos coches
          </p>
          <h2 className="mt-1 font-display text-xl uppercase">Publica un viaje y se llena</h2>
        </div>
        <Link
          to="/publish"
          className="border-2 border-cr-secondary bg-cr-secondary px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white"
        >
          + Publicar
        </Link>
      </header>
      <ul className="grid gap-3 px-5 py-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <li key={p.concert.id}>
            <Link
              to={`/concerts/${p.concert.id}`}
              className="block border-2 border-cr-border bg-cr-bg p-3 transition hover:border-cr-secondary"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-base uppercase leading-tight">{p.concert.artist}</p>
                <span
                  title={`Urgencia ${p.urgency}/100`}
                  className={`flex-shrink-0 border-2 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] ${
                    p.urgency >= 70
                      ? "border-cr-secondary bg-cr-secondary text-white"
                      : p.urgency >= 40
                        ? "border-cr-secondary text-cr-secondary"
                        : "border-cr-border text-cr-text-muted"
                  }`}
                >
                  {p.urgency >= 70 ? "URGENTE" : p.urgency >= 40 ? "ALTA" : "MEDIA"}
                </span>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-cr-text-muted">
                {p.concert.venue.city}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="font-display text-cr-primary">{p.going_count}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-muted">van</span>
                <span className="text-cr-text-dim">·</span>
                <span className="font-display text-cr-text">{p.active_rides}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-muted">
                  {p.active_rides === 1 ? "coche" : "coches"}
                </span>
              </div>
              <div className="mt-2">
                <CountdownBadge target={p.concert.date} size="sm" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { useEffect, useState } from "react";
import type { TravelStats } from "@concertride/types";
import { api } from "@/lib/api";
import { CrewAvatars } from "./CrewAvatars";

interface Props {
  // 0 = all-time. Defaults to current year.
  year?: number;
  className?: string;
}

const VIBE_LABEL = { party: "Party", chill: "Chill", mixed: "Mixed" } as const;
const VIBE_EMOJI = { party: "🔥", chill: "🌙", mixed: "✨" } as const;

export function TravelStatsCard({ year = new Date().getUTCFullYear(), className }: Props) {
  const [stats, setStats] = useState<TravelStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const s = await api.stats.me(year);
        if (!cancelled) setStats(s);
      } catch {
        if (!cancelled) setStats(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [year]);

  if (loading) return <p className="font-mono text-xs text-cr-text-muted">Cargando stats…</p>;
  if (!stats) return null;
  const total = stats.rides_as_driver + stats.rides_as_passenger;
  if (total === 0) return null;

  const dominantVibe = (Object.entries(stats.vibe_distribution).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "mixed") as keyof typeof VIBE_LABEL;

  return (
    <section
      aria-label={`Stats ${year || "all-time"}`}
      className={`overflow-hidden border-2 border-cr-primary bg-gradient-to-br from-cr-bg via-cr-surface-2 to-cr-bg ${className ?? ""}`}
    >
      <header className="flex items-baseline justify-between border-b border-cr-border px-5 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cr-primary">
          Recap {year === 0 ? "all-time" : year}
        </p>
        <span className="font-display text-lg uppercase">{total} viaje{total === 1 ? "" : "s"}</span>
      </header>

      <dl className="grid grid-cols-2 gap-px bg-cr-border md:grid-cols-4">
        <Stat label="Conducidos" value={stats.rides_as_driver} />
        <Stat label="Pasajero" value={stats.rides_as_passenger} />
        <Stat label="Km totales" value={stats.total_km > 0 ? `${stats.total_km.toLocaleString("es-ES")}` : "—"} />
        <Stat label="CO₂ ahorrado" value={stats.co2_saved_kg > 0 ? `${stats.co2_saved_kg} kg` : "—"} highlight />
      </dl>

      <div className="grid gap-4 px-5 py-4 md:grid-cols-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-dim">
            artistas únicos
          </p>
          <p className="mt-1 font-display text-2xl uppercase">{stats.unique_artists.length}</p>
          {stats.top_artist && (
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-cr-primary">
              top · {stats.top_artist}
            </p>
          )}
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-dim">
            ciudades
          </p>
          <p className="mt-1 font-display text-2xl uppercase">{stats.unique_cities.length}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-dim">
            vibe dominante
          </p>
          <p className="mt-1 font-display text-2xl uppercase">
            {VIBE_EMOJI[dominantVibe]} {VIBE_LABEL[dominantVibe]}
          </p>
        </div>
      </div>

      {stats.top_crew.length > 0 && (
        <div className="border-t border-cr-border bg-cr-bg/50 px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted">
            crew más frecuente
          </p>
          <div className="mt-2">
            <CrewAvatars
              size="md"
              clickable
              people={stats.top_crew.map((c) => ({
                id: c.user_id,
                name: c.name,
                avatar_url: c.avatar_url,
              }))}
              label={`${stats.top_crew[0]?.name} · ${stats.top_crew[0]?.rides_together} viaje${stats.top_crew[0]?.rides_together === 1 ? "" : "s"}`}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`bg-cr-bg px-4 py-3 ${highlight ? "ring-1 ring-cr-primary/40" : ""}`}>
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted">{label}</dt>
      <dd className={`mt-1 font-display text-2xl uppercase ${highlight ? "text-cr-primary" : "text-cr-text"}`}>
        {value}
      </dd>
    </div>
  );
}

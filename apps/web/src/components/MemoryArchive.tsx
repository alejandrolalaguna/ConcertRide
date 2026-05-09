import { useEffect, useMemo, useState } from "react";
import type { TripMemory } from "@concertride/types";
import { api } from "@/lib/api";
import { TripVibeCard } from "./TripVibeCard";

interface Props {
  // When set, fetch only this user's memories (own profile). Otherwise
  // shows the public concert-scoped feed via concertId.
  userScope?: boolean;
  concertId?: string;
}

interface YearGroup {
  year: number;
  memories: TripMemory[];
  totalDistance: number;
  uniqueArtists: number;
  topVibe: TripMemory["vibe"];
}

function groupByYear(memories: TripMemory[]): YearGroup[] {
  const buckets = new Map<number, TripMemory[]>();
  for (const m of memories) {
    const y = new Date(m.created_at).getUTCFullYear();
    if (!buckets.has(y)) buckets.set(y, []);
    buckets.get(y)!.push(m);
  }
  return Array.from(buckets.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, list]) => {
      const vibeCount: Record<string, number> = {};
      let totalDistance = 0;
      const artists = new Set<string>();
      for (const m of list) {
        vibeCount[m.vibe] = (vibeCount[m.vibe] ?? 0) + 1;
        totalDistance += m.distance_km ?? 0;
        artists.add(m.concert_artist);
      }
      const topVibe = (Object.entries(vibeCount).sort((a, b) => b[1] - a[1])[0]?.[0] as TripMemory["vibe"]) ?? "mixed";
      return {
        year,
        memories: list.sort((a, b) => b.created_at.localeCompare(a.created_at)),
        totalDistance: Math.round(totalDistance),
        uniqueArtists: artists.size,
        topVibe,
      };
    });
}

export function MemoryArchive({ userScope = true, concertId }: Props) {
  const [memories, setMemories] = useState<TripMemory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = userScope
          ? await api.memories.mine()
          : concertId
            ? await api.memories.forConcert(concertId)
            : { memories: [] };
        if (!cancelled) setMemories(res.memories);
      } catch {
        if (!cancelled) setMemories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userScope, concertId]);

  const groups = useMemo(() => groupByYear(memories), [memories]);

  if (loading) {
    return (
      <p className="font-mono text-xs text-cr-text-muted">Cargando archivo…</p>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="border-2 border-dashed border-cr-border bg-cr-surface-2 p-6 text-center">
        <p className="font-display text-lg uppercase">Sin recuerdos todavía</p>
        <p className="mt-1 text-xs text-cr-text-muted">
          Tras un viaje completado, podrás generar una vibe card para compartir.
        </p>
      </div>
    );
  }

  async function shareMemory(m: TripMemory) {
    const url = typeof window !== "undefined" ? `${window.location.origin}/memorias/${m.id}` : `/memorias/${m.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: m.title, text: m.caption ?? `${m.concert_artist} · ${m.origin_city}`, url });
        await api.memories.share(m.id);
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      await api.memories.share(m.id);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-10">
      {groups.map((g) => (
        <section key={g.year}>
          <header className="border-b border-cr-border pb-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cr-text-muted">
              recap
            </p>
            <h2 className="mt-1 font-display text-3xl uppercase tracking-tight">
              {g.year}
              <span className="ml-3 align-middle font-mono text-xs uppercase tracking-[0.14em] text-cr-text-muted">
                {g.memories.length} viaje{g.memories.length === 1 ? "" : "s"} · {g.uniqueArtists} artista{g.uniqueArtists === 1 ? "" : "s"}
                {g.totalDistance > 0 ? ` · ${g.totalDistance} km` : ""} · vibe {g.topVibe}
              </span>
            </h2>
          </header>
          <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {g.memories.map((m) => (
              <li key={m.id}>
                <TripVibeCard memory={m} shareable onShare={() => shareMemory(m)} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

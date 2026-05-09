import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Concert, Favorite } from "@concertride/types";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useFavorites } from "@/lib/favorites";
import { useCrew } from "@/lib/crew";
import { CountdownBadge } from "./CountdownBadge";

// "Predictive" surface — derived purely from existing data:
//   1. concerts by artists the viewer has favourited
//   2. concerts in the viewer's home city in the next 60 days
//   3. concerts where members of the viewer's crew said "voy"
//
// All client-side composition. We avoid an LLM call: the data is enough.

interface Prompt {
  kind: "favourite_artist" | "home_city" | "crew_going";
  concert: Concert;
  reason: string;
}

export function IntelligencePrompts() {
  const { user } = useSession();
  const { favorites } = useFavorites();
  const { crew } = useCrew();
  const [upcoming, setUpcoming] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [crewByConcert, setCrewByConcert] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const oneYearOut = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString();
        const res = await api.concerts.list({
          date_from: new Date().toISOString(),
          date_to: oneYearOut,
          limit: 80,
        });
        if (!cancelled) setUpcoming(res.concerts);
      } catch {
        if (!cancelled) setUpcoming([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // For each concert, fetch the count of crew members going (best-effort).
  useEffect(() => {
    if (!user || crew.length === 0 || upcoming.length === 0) {
      setCrewByConcert({});
      return;
    }
    let cancelled = false;
    const sample = upcoming.slice(0, 24);
    void (async () => {
      const out: Record<string, number> = {};
      await Promise.all(
        sample.map(async (c) => {
          try {
            const r = await api.crew.attending(c.id);
            if (r.crew.length > 0) out[c.id] = r.crew.length;
          } catch {
            /* ignore */
          }
        }),
      );
      if (!cancelled) setCrewByConcert(out);
    })();
    return () => {
      cancelled = true;
    };
  }, [upcoming, crew.length, user?.id]);

  const prompts = useMemo<Prompt[]>(() => {
    if (!user || upcoming.length === 0) return [];
    const seen = new Set<string>();
    const out: Prompt[] = [];

    const fbArtist = new Set(
      favorites
        .filter((f: Favorite) => f.kind === "artist")
        .map((f) => f.label.toLowerCase()),
    );
    for (const c of upcoming) {
      if (out.length >= 6) break;
      if (seen.has(c.id)) continue;
      if (fbArtist.has(c.artist.toLowerCase())) {
        seen.add(c.id);
        out.push({ kind: "favourite_artist", concert: c, reason: `Sigues a ${c.artist}` });
      }
    }

    for (const [concertId, count] of Object.entries(crewByConcert)) {
      if (out.length >= 8) break;
      if (seen.has(concertId)) continue;
      const c = upcoming.find((x) => x.id === concertId);
      if (!c) continue;
      seen.add(concertId);
      out.push({
        kind: "crew_going",
        concert: c,
        reason: `${count} de tu crew ${count === 1 ? "va" : "van"}`,
      });
    }

    if (user.home_city) {
      const home = user.home_city.toLowerCase();
      for (const c of upcoming) {
        if (out.length >= 10) break;
        if (seen.has(c.id)) continue;
        if (c.venue?.city?.toLowerCase() === home) {
          seen.add(c.id);
          out.push({ kind: "home_city", concert: c, reason: `En ${user.home_city}` });
        }
      }
    }

    return out;
  }, [user, upcoming, favorites, crewByConcert]);

  if (loading || !user || prompts.length === 0) return null;

  return (
    <section
      aria-label="Recomendaciones inteligentes"
      className="border-2 border-cr-primary/40 bg-gradient-to-br from-cr-bg via-cr-surface-2 to-cr-bg p-5"
    >
      <header className="flex items-baseline justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cr-primary">
            Para ti
          </p>
          <h2 className="mt-1 font-display text-2xl uppercase">Próximos eventos que te encajan</h2>
        </div>
      </header>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.slice(0, 6).map(({ concert, reason, kind }) => (
          <li key={concert.id}>
            <Link
              to={`/concerts/${concert.id}`}
              className="block border-2 border-cr-border bg-cr-surface-2 p-3 transition hover:border-cr-primary"
            >
              <div className="flex items-center gap-2">
                <span aria-hidden className="text-base">
                  {kind === "favourite_artist" ? "💚" : kind === "crew_going" ? "👯" : "📍"}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted">
                  {reason}
                </span>
              </div>
              <p className="mt-2 font-display text-base uppercase leading-tight">
                {concert.artist}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-cr-text-muted">
                {concert.venue.city}
              </p>
              <div className="mt-2">
                <CountdownBadge target={concert.date} size="sm" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

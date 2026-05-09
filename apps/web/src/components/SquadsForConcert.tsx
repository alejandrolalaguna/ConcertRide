import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Squad } from "@concertride/types";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { SquadCard } from "./SquadCard";

interface Props {
  concertId: string;
  artist: string;
}

export function SquadsForConcert({ concertId, artist }: Props) {
  const { user } = useSession();
  const [squads, setSquads] = useState<Squad[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await api.squads.forConcert(concertId);
        if (!cancelled) setSquads(res.items);
      } catch {
        if (!cancelled) setSquads([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [concertId]);

  if (squads === null) return null;

  return (
    <section
      aria-label="Squads de este evento"
      className="border-y border-cr-border bg-cr-surface-2/40"
    >
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cr-text-muted">
              Squads · {artist}
            </p>
            <h2 className="mt-1 font-display text-xl uppercase">
              {squads.length > 0 ? "Grupos organizándose" : "Crea el primer squad"}
            </h2>
          </div>
          <Link
            to={user ? `/squads/new?concert=${encodeURIComponent(concertId)}` : `/login?next=/squads/new?concert=${encodeURIComponent(concertId)}`}
            className="border-2 border-cr-primary px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-cr-primary hover:bg-cr-primary hover:text-cr-text-inverse"
          >
            + Crear squad
          </Link>
        </div>
        {squads.length > 0 ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {squads.map((s) => (
              <li key={s.id}>
                <SquadCard squad={s} href={`/squads/join/${s.invite_code}`} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 max-w-prose text-sm text-cr-text-muted">
            Un squad junta varios coches para el mismo evento. Coordinas pickup, playlist, y los recoges a todos.
          </p>
        )}
      </div>
    </section>
  );
}

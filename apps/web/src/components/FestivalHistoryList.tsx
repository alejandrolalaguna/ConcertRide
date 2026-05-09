import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { FestivalHistoryEntry } from "@concertride/types";
import { api } from "@/lib/api";

export function FestivalHistoryList() {
  const [items, setItems] = useState<FestivalHistoryEntry[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await api.stats.festivalHistory();
        if (!cancelled) setItems(res.items);
      } catch {
        if (!cancelled) setItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (items === null) return null;
  if (items.length === 0) return null;

  return (
    <section>
      <header className="border-b border-cr-border pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cr-text-muted">
          historial
        </p>
        <h2 className="mt-1 font-display text-3xl uppercase tracking-tight">Festivales que has visto</h2>
      </header>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => {
          const firstYear = new Date(f.first_attended).getUTCFullYear();
          const lastYear = new Date(f.last_attended).getUTCFullYear();
          const yearLabel = firstYear === lastYear ? `${firstYear}` : `${firstYear}–${lastYear}`;
          return (
            <li key={f.slug}>
              <Link
                to={`/festivales/${f.slug}`}
                className="block border-2 border-cr-border bg-cr-surface-2 p-4 transition hover:border-cr-primary"
              >
                <p className="font-display text-lg uppercase leading-tight">{f.name}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted">
                  {f.times_attended}× edición{f.times_attended === 1 ? "" : "es"} · {yearLabel}
                </p>
                {f.memories.length > 0 && (
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-cr-primary">
                    📸 {f.memories.length} {f.memories.length === 1 ? "recuerdo" : "recuerdos"}
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

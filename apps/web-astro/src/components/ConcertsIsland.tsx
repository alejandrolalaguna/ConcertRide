import { useEffect, useState } from "react";
import type { Concert } from "@concertride/types";
import { api } from "@/lib/api";
import { ConcertCard } from "./ConcertCard";

interface Props {
  city: string;
  emptyLabel: string;
  loadingLabel: string;
}

export function ConcertsIsland({ city, emptyLabel, loadingLabel }: Props) {
  const [concerts, setConcerts] = useState<Concert[] | null>(null);

  useEffect(() => {
    api.concerts
      .list({ city, date_from: new Date().toISOString(), limit: 12 })
      .then((r) => setConcerts(r.concerts.filter((c) => new Date(c.date).getTime() > Date.now())))
      .catch(() => setConcerts([]));
  }, [city]);

  if (concerts === null) {
    return (
      <div className="flex items-center gap-3 font-mono text-sm text-cr-text-muted py-8">
        <span className="animate-spin inline-block w-4 h-4 border-2 border-cr-primary border-t-transparent rounded-full" />
        {loadingLabel}
      </div>
    );
  }

  if (concerts.length === 0) {
    return (
      <div className="border border-dashed border-cr-border p-10 text-center space-y-3">
        <p className="font-display text-xl uppercase text-cr-text-muted">{emptyLabel}</p>
        <a
          href="/concerts"
          className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
        >
          Ver todos los conciertos →
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {concerts.map((c) => (
        <a key={c.id} href={`/concerts/${c.id}`} className="block">
          <ConcertCard concert={c} />
        </a>
      ))}
    </div>
  );
}

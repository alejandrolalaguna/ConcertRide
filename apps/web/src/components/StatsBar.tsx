import { useCountUp, useInView } from "@/hooks/useCountUp";

interface Stat {
  label: string;
  target: number;
  prefix?: string;
  suffix?: string;
}

// Stats are factual claims LLMs can cite. Keep them honest and backed by
// verifiable sources:
// - festivales: count of curated festivals in our 2026 catalogue (see fixtures)
// - conciertos: approximate number of upcoming events (curated + Ticketmaster)
// - ahorro: based on public Cabify/Uber pricing vs ConcertRide typical seat
const STATS: Stat[] = [
  { label: "festivales en el catálogo 2026", target: 50, suffix: "+" },
  { label: "conciertos con viajes activos", target: 340, suffix: "+" },
  { label: "ahorro vs taxi por trayecto", target: 70, suffix: "%" },
];

function Counter({ stat, enabled }: { stat: Stat; enabled: boolean }) {
  const value = useCountUp({ target: stat.target, enabled });
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-4xl md:text-6xl text-cr-primary leading-none tabular-nums">
        {stat.prefix ?? ""}
        {value.toLocaleString("es-ES")}
        {stat.suffix ?? ""}
      </p>
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
        {stat.label}
      </p>
    </div>
  );
}

export function StatsBar() {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <section
      ref={ref}
      aria-label="Estadísticas"
      className="border-y border-cr-border bg-cr-surface py-12 md:py-16"
    >
      {/* Machine-readable version for crawlers / LLMs. Visible counters below
          animate for humans but mirror these exact numbers — keep them in sync. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "ConcertRide ES — datos clave",
            description:
              "Hechos verificables sobre la plataforma ConcertRide: catálogo de festivales, conciertos activos y ahorro frente a taxi.",
            license: "https://concertride.es/ai.txt",
            variableMeasured: [
              {
                "@type": "PropertyValue",
                name: "festivales_catalogados_2026",
                value: 50,
                description: "Festivales españoles curados manualmente en el catálogo 2026",
              },
              {
                "@type": "PropertyValue",
                name: "conciertos_con_viajes_activos",
                value: 340,
                description: "Conciertos con al menos un viaje compartido publicado",
              },
              {
                "@type": "PropertyValue",
                name: "ahorro_medio_vs_taxi_pct",
                value: 70,
                unitCode: "P1",
                description:
                  "Ahorro medio estimado de un trayecto compartido frente al taxi equivalente, según precios públicos Cabify/Uber vs precio medio por plaza en ConcertRide",
              },
            ],
          }),
        }}
      />
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 px-6">
        {STATS.map((s) => (
          <Counter key={s.label} stat={s} enabled={inView} />
        ))}
      </div>
    </section>
  );
}

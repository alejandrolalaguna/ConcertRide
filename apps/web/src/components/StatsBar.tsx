import { useCountUp, useInView } from "@/hooks/useCountUp";

interface Stat {
  label: string;
  target: number;
  prefix?: string;
  suffix?: string;
}

const STATS: Stat[] = [
  { label: "viajeros compartiendo", target: 12340, suffix: "+" },
  { label: "conciertos activos", target: 340 },
  { label: "coste medio por asiento", target: 8, prefix: "€" },
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
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 px-6">
        {STATS.map((s) => (
          <Counter key={s.label} stat={s} enabled={inView} />
        ))}
      </div>
    </section>
  );
}

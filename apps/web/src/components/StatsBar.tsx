import { useCountUp, useInView } from "@/hooks/useCountUp";

interface Stat {
  label: string;
  target: number;
  prefix?: string;
  suffix?: string;
}

const STATS: Stat[] = [
  { label: "festivales en el catálogo 2026", target: 33, suffix: "+" },
  { label: "ciudades cubiertas en España", target: 72, suffix: "+" },
  { label: "ahorro estimado vs taxi y bus", target: 60, suffix: "%" },
  { label: "comisión de plataforma", target: 0, prefix: "", suffix: "%" },
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
      aria-label="Estadísticas de ConcertRide"
      className="border-y border-cr-border bg-cr-surface py-12 md:py-16"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-cr-border px-0">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`bg-cr-surface px-6 py-8 ${i === STATS.length - 1 ? "border-l-2 border-cr-primary" : ""}`}
          >
            <Counter stat={s} enabled={inView} />
          </div>
        ))}
      </div>
    </section>
  );
}

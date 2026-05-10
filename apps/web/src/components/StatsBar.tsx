import { motion } from "motion/react";
import { useCountUp, useInView } from "@/hooks/useCountUp";

interface Stat {
  label: string;
  target: number;
  prefix?: string;
  suffix?: string;
  accent?: boolean;
}

const STATS: Stat[] = [
  { label: "festivales en el catálogo 2026", target: 33, suffix: "+" },
  { label: "ciudades cubiertas en España",   target: 72, suffix: "+" },
  { label: "ahorro estimado* vs taxi y bus", target: 60, suffix: "%" },
  { label: "comisión de plataforma",         target: 0,  suffix: "%", accent: true },
];

function Counter({ stat, enabled, index }: { stat: Stat; enabled: boolean; index: number }) {
  const value = useCountUp({ target: stat.target, enabled });
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={enabled ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3"
    >
      <p
        className="font-display text-5xl md:text-7xl leading-none tabular-nums tracking-tight"
        style={{
          color: stat.accent ? "#dbff00" : "#f0f0f4",
          textShadow: stat.accent
            ? "0 0 40px rgba(219,255,0,0.5), 0 0 80px rgba(219,255,0,0.25)"
            : "none",
        }}
      >
        {stat.prefix ?? ""}
        {value.toLocaleString("es-ES")}
        {stat.suffix ?? ""}
      </p>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
        {stat.label}
      </p>
    </motion.div>
  );
}

export function StatsBar() {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <section
      ref={ref}
      aria-label="Estadísticas de ConcertRide"
      className="relative overflow-hidden border-y border-white/[0.06]"
    >
      {/* Crowd photo — slightly more visible */}
      <img
        aria-hidden="true"
        src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1400&q=60&auto=format&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.12] pointer-events-none"
      />
      {/* Gradient overlays */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#080808]/90 via-[#0a0a0a]/70 to-[#080808]/90 pointer-events-none" />
      {/* Lime atmospheric glow bottom-left */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[50vw] h-[200px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 0% 100%, rgba(219,255,0,0.07) 0%, transparent 70%)" }}
      />
      {/* Orange glow top-right */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[40vw] h-[150px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(255,79,0,0.05) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04]">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="relative bg-[#080808] px-8 py-10 md:py-14 overflow-hidden group"
          >
            {/* Hover lime glow */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(219,255,0,0.06) 0%, transparent 60%)" }}
            />
            {/* Hover top line accent */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: s.accent ? "linear-gradient(to right, transparent, #dbff00, transparent)" : "linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)" }}
            />
            {/* Left border accent on last stat */}
            {i === STATS.length - 1 && (
              <div
                aria-hidden="true"
                className="absolute left-0 top-4 bottom-4 w-[2px]"
                style={{ background: "linear-gradient(to bottom, transparent, #dbff00, transparent)" }}
              />
            )}
            <Counter stat={s} enabled={inView} index={i} />
          </div>
        ))}
      </div>
      {/* Footnote for estimated stat */}
      <p className="relative max-w-6xl mx-auto px-8 py-2 font-mono text-[9px] text-white/20">
        * Ahorro estimado en rutas de 100–300 km respecto a taxi particular y autobús de línea regular. Cálculo basado en tarifas medias 2025 (CNMC, MITMA).
      </p>
    </section>
  );
}

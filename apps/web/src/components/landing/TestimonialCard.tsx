import { motion } from "motion/react";
import { initials } from "@/lib/format";

export interface Testimonial {
  quote: string;
  name: string;
  city: string;
  concert: string;
}

export function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  const t = testimonial;
  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative bg-cr-surface border border-cr-border p-6 space-y-5 h-full flex flex-col"
    >
      <span
        aria-hidden="true"
        className="absolute -top-4 left-6 font-display text-7xl leading-none text-cr-primary/40"
      >
        &ldquo;
      </span>
      <span
        aria-hidden="true"
        className="absolute top-3 right-3 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-text-dim"
      >
        #{String(index + 1).padStart(2, "0")}
      </span>

      <blockquote className="font-sans text-sm text-cr-text leading-relaxed pt-4">
        {t.quote}
      </blockquote>

      <p className="font-mono text-[11px] text-cr-text-muted mt-auto">
        Viaje a <span className="text-cr-primary">{t.concert}</span>
      </p>

      <figcaption className="flex items-center justify-between pt-4 border-t border-dashed border-cr-border">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="w-9 h-9 rounded-full bg-cr-surface-2 border border-cr-border grid place-items-center font-mono text-[11px] text-cr-text"
          >
            {initials(t.name)}
          </div>
          <div className="leading-tight">
            <p className="text-xs text-cr-text">{t.name}</p>
            <p className="font-mono text-[10px] text-cr-text-muted">{t.city}</p>
          </div>
        </div>
        <div className="text-right leading-tight">
          <span className="font-mono text-[10px] text-cr-primary border border-cr-primary/30 px-2 py-0.5">
            Verificado
          </span>
        </div>
      </figcaption>
    </motion.figure>
  );
}

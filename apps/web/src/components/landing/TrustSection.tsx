import { Check, MessageSquare } from "lucide-react";

const TRUST_POINTS = [
  "Perfil verificado con DNI",
  "Conductores con carnet verificado",
  "Sin comisiones de plataforma",
];

export function TrustSection() {
  return (
    <section
      aria-labelledby="trust-title"
      className="py-20 md:py-28 px-6 border-t border-cr-border"
    >
      <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
        <header className="space-y-3 max-w-2xl">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Social proof
          </p>
          <h2 id="trust-title" className="font-display text-3xl md:text-5xl uppercase leading-[0.95]">
            Gente de verdad.
            <br />
            Viajes de verdad.
          </h2>
        </header>

        <div className="border border-dashed border-cr-border p-10 md:p-16 flex flex-col items-center gap-4 text-center">
          <MessageSquare size={28} className="text-cr-text-dim" aria-hidden="true" />
          <p className="font-sans text-sm text-cr-text-muted max-w-sm leading-relaxed">
            Sé el primero en compartir tu experiencia. Las valoraciones de usuarios reales aparecerán aquí.
          </p>
          <a
            href="/concerts"
            className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-primary border border-cr-primary/40 px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Buscar viaje →
          </a>
        </div>

        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-dashed border-cr-border pt-8">
          {TRUST_POINTS.map((point) => (
            <li
              key={point}
              className="flex items-center gap-2 font-sans text-xs text-cr-text-muted"
            >
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-cr-primary/15 text-cr-primary">
                <Check size={10} strokeWidth={3} aria-hidden="true" />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

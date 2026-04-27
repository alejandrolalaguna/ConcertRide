import { MessageSquare } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section aria-labelledby="testimonials-title" className="border-t border-cr-border">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-10">
        <header className="space-y-3">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Comunidad
          </p>
          <h2
            id="testimonials-title"
            className="font-display text-3xl md:text-5xl uppercase leading-[0.95]"
          >
            Lo que dicen<br />los usuarios.
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
      </div>
    </section>
  );
}

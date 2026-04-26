import { Check } from "lucide-react";
import { TestimonialCard, type Testimonial } from "./TestimonialCard";

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Fui desde Valencia al Palau Sant Jordi por 20€ ida y vuelta. Playlist colaborativa y conocí a dos personas increíbles.",
    name: "Elena Ruiz",
    city: "Valencia",
    concert: "C. Tangana",
  },
  {
    quote:
      "Llevar el coche medio vacío era una locura. Ahora cubro gasolina y peajes con tres personas majas. Viajé a Mad Cool sin pisar el tren.",
    name: "Adrián López",
    city: "Zaragoza",
    concert: "Mad Cool Festival",
  },
  {
    quote:
      "La vibe chill de verdad existe. De Sevilla a Málaga escuchando el álbum del concierto. Llegué sin estrés y lista para saltar.",
    name: "Claudia Sánchez",
    city: "Sevilla",
    concert: "Bad Bunny",
  },
];

const TRUST_POINTS = [
  "Perfil verificado con DNI",
  "Conductores con valoraciones reales",
  "Seguro de viaje incluido",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
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

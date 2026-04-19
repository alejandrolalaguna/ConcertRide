import { Calendar, Car, Music } from "lucide-react";
import { useInView } from "@/hooks/useCountUp";

const STEPS = [
  {
    n: "01",
    icon: Calendar,
    title: "Elige el concierto",
    body: "Busca por artista o ciudad. Ve los viajes activos al momento.",
  },
  {
    n: "02",
    icon: Car,
    title: "Encuentra o publica un viaje",
    body: "Reserva tu asiento o abre tu coche al resto. Divide el coste.",
  },
  {
    n: "03",
    icon: Music,
    title: "A rockear juntos",
    body: "Playlist compartida, vibes elegidos, y al recinto a tiempo.",
  },
];

export function HowItWorks() {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <section
      ref={ref}
      aria-label="Cómo funciona"
      className="relative py-20 md:py-28 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 md:mb-16 space-y-3">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Cómo funciona
          </p>
          <h2 className="font-display text-3xl md:text-5xl uppercase leading-[0.95]">
            Tres pasos
            <br />
            hasta el show.
          </h2>
        </header>

        <div className="relative">
          <span
            aria-hidden="true"
            className="hidden md:block absolute top-[52px] left-0 right-0 h-px bg-cr-border overflow-hidden"
          >
            <span
              className="block h-full bg-cr-primary origin-left transition-transform duration-[900ms] ease-out"
              style={{ transform: `scaleX(${inView ? 1 : 0})` }}
            />
          </span>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.n}
                  className="space-y-4 transition-all duration-500 ease-out"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${i * 80}ms`,
                  }}
                >
                  <p className="font-mono text-5xl md:text-6xl text-cr-primary leading-none">
                    {step.n}
                  </p>
                  <div className="flex items-center gap-2 text-cr-text-muted">
                    <Icon size={18} aria-hidden="true" />
                    <h3 className="font-display text-base uppercase tracking-wide text-cr-text">
                      {step.title}
                    </h3>
                  </div>
                  <p className="font-sans text-sm text-cr-text-muted max-w-[28ch] leading-relaxed">
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

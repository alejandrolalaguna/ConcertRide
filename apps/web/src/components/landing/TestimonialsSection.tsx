import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  festival: string;
  rating: number;
  initial: string;
  savings: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote: "Ahorré 40€ yendo al Sónar desde Madrid. El conductor puso la playlist perfecta y llegamos antes de que abriera el recinto. El taxi de vuelta habría sido 60€ más.",
    author: "Sara M.",
    location: "Madrid",
    festival: "Sónar 2025",
    rating: 5,
    initial: "S",
    savings: "Ahorro: ~100€",
  },
  {
    id: "2",
    quote: "Fuimos 4 al Arenal Sound desde Valencia: 22€ por persona ida y vuelta. Sin comisiones, sin líos. La vuelta de madrugada fue lo mejor del festival.",
    author: "Dani R.",
    location: "Valencia",
    festival: "Arenal Sound 2025",
    rating: 5,
    initial: "D",
    savings: "Ahorro: ~50€/persona",
  },
  {
    id: "3",
    quote: "Publiqué mi coche a Mad Cool desde Bilbao y cubrí gasolina y peajes entre los 3 pasajeros. El viaje me salió gratis y encima hice 3 amigos.",
    author: "Irene S.",
    location: "Bilbao",
    festival: "Mad Cool 2025",
    rating: 5,
    initial: "I",
    savings: "Coste conductor: 0€",
  },
  {
    id: "4",
    quote: "Primera vez en Primavera Sound viniendo de Zaragoza. En ConcertRide encontré un viaje por 28€. El AVE costaba 80€ solo de ida. Sin duda la mejor opción.",
    author: "Jorge B.",
    location: "Zaragoza",
    festival: "Primavera Sound 2025",
    rating: 4.9,
    initial: "J",
    savings: "Ahorro vs AVE: ~100€",
  },
  {
    id: "5",
    quote: "El conductor del viaje a BBK tenía la misma playlist que yo. Llegamos amigos. 18€ por asiento desde Vitoria. Esto no pasa en el AVE.",
    author: "Paula G.",
    location: "Vitoria",
    festival: "BBK Live 2025",
    rating: 5,
    initial: "P",
    savings: "Precio: 18€",
  },
  {
    id: "6",
    quote: "Resurrection Fest desde A Coruña. En tren eran 4 transbordos y 55€. En ConcertRide, 2 horas de coche con gente del mismo rollo por 20€. No hay color.",
    author: "Marcos L.",
    location: "A Coruña",
    festival: "Resurrection Fest 2025",
    rating: 5,
    initial: "M",
    savings: "Ahorro vs tren: 35€",
  },
  {
    id: "7",
    quote: "Conducí a 3 personas a Viña Rock desde Madrid. Cubrí peajes (26€) y gasolina (18€) — salí gratis y con la gasolina llena para volver.",
    author: "Rubén A.",
    location: "Madrid",
    festival: "Viña Rock 2025",
    rating: 5,
    initial: "R",
    savings: "Coste conductor: 0€",
  },
  {
    id: "8",
    quote: "Tres festivales este verano con ConcertRide. Total ahorrado vs taxi: 180€. Con ese dinero me compré otra entrada de Mad Cool.",
    author: "Ana C.",
    location: "Sevilla",
    festival: "Mad Cool + Sónar + BBK 2025",
    rating: 5,
    initial: "A",
    savings: "Ahorro total: 180€",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={11}
          className={n <= Math.round(rating) ? "fill-cr-primary text-cr-primary" : "text-cr-border fill-cr-border"}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(id);
  }, [autoplay]);

  const prev = () => {
    setAutoplay(false);
    setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };
  const next = () => {
    setAutoplay(false);
    setIdx((i) => (i + 1) % TESTIMONIALS.length);
  };

  const t = TESTIMONIALS[idx]!;

  return (
    <section aria-labelledby="testimonials-title" className="border-t border-cr-border py-16 md:py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="space-y-2">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Testimonios
          </p>
          <h2 id="testimonials-title" className="font-display text-2xl md:text-4xl uppercase leading-tight">
            Lo dicen quienes ya viajaron.
          </h2>
        </header>

        <div className="relative min-h-[200px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <Stars rating={t.rating} />
                <span className="flex-shrink-0 font-mono text-[11px] font-semibold text-cr-primary border border-cr-primary/30 bg-cr-primary/8 px-2 py-0.5 leading-tight">
                  {t.savings}
                </span>
              </div>
              <blockquote>
                <p className="font-display text-xl md:text-2xl uppercase leading-snug text-cr-text">
                  "{t.quote}"
                </p>
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-full bg-cr-primary flex items-center justify-center font-display font-black text-black text-sm"
                  aria-hidden="true"
                >
                  {t.initial}
                </span>
                <span className="font-sans text-sm text-cr-text-muted">
                  <strong className="text-cr-text font-semibold">{t.author}</strong>
                  {" · "}{t.location}
                  {" · "}<span className="text-cr-primary">{t.festival}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={prev}
            aria-label="Testimonio anterior"
            className="w-9 h-9 border border-cr-border flex items-center justify-center text-cr-text-muted hover:border-cr-primary hover:text-cr-primary transition-colors text-lg font-mono"
          >
            ←
          </button>
          <div className="flex gap-1.5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setAutoplay(false); setIdx(i); }}
                aria-label={`Testimonio ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? "bg-cr-primary" : "bg-cr-border"}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Testimonio siguiente"
            className="w-9 h-9 border border-cr-border flex items-center justify-center text-cr-text-muted hover:border-cr-primary hover:text-cr-primary transition-colors text-lg font-mono"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

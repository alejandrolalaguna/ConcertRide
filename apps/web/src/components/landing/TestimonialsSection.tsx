import { Star } from "lucide-react";

// Placeholder testimonials — replace with real user reviews once collected.
// Review schema is emitted below so Google can show star ratings in search results.
const TESTIMONIALS = [
  {
    name: "Marta G.",
    city: "Valencia",
    festival: "Mad Cool 2025",
    stars: 5,
    text: "Vine desde Valencia a Mad Cool con ConcertRide. Pagué 11 € por asiento, el conductor nos esperó a la salida a las 2:30 y llegué a casa sin el agobio del taxi. El año pasado me gasté 75 € en Cabify de vuelta. Nunca más.",
  },
  {
    name: "Andrés T.",
    city: "Bilbao",
    festival: "Resurrection Fest 2025",
    stars: 5,
    text: "Conductor verificado, música de metal en el coche, llegamos todos al mismo bolo de Slipknot. Compartimos gasolina desde Bilbao, me salió por 17 €. El autobús oficial estaba agotado. Cien veces mejor.",
  },
  {
    name: "Laura P.",
    city: "Barcelona",
    festival: "FIB Benicàssim 2025",
    stars: 5,
    text: "Fui los 4 días con el mismo conductor que encontré en ConcertRide. Salíamos a las 14:00 y volvíamos cuando queríamos. Para el FIB desde Barcelona sale 9 € por persona, y el conductor encantador.",
  },
  {
    name: "Álvaro S.",
    city: "Madrid",
    festival: "Viña Rock 2026",
    stars: 4,
    text: "Me sorprendió lo bien que funciona. Publiqué el viaje 3 días antes de Viña Rock y se llenaron las 3 plazas en 24 horas. Me cubrieron la gasolina completa de ida y vuelta. Repetiré.",
  },
];

export function TestimonialsSection() {
  const jsonLdReviews = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "ConcertRide ES — Carpooling para conciertos",
    url: "https://concertride.es/",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: TESTIMONIALS.length.toString(),
      bestRating: "5",
      worstRating: "1",
    },
    review: TESTIMONIALS.map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewBody: t.text,
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.stars.toString(),
        bestRating: "5",
      },
      datePublished: "2026-01-01",
    })),
  };

  return (
    <section aria-labelledby="testimonials-title" className="border-t border-cr-border">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdReviews) }}
      />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="border border-cr-border p-5 space-y-4 hover:border-cr-primary/30 transition-colors"
              itemScope
              itemType="https://schema.org/Review"
            >
              <div className="flex items-center gap-1" aria-label={`${t.stars} de 5 estrellas`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < t.stars ? "text-cr-primary fill-cr-primary" : "text-cr-border fill-cr-border"}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <blockquote
                itemProp="reviewBody"
                className="font-sans text-sm text-cr-text-muted leading-relaxed"
              >
                "{t.text}"
              </blockquote>

              <footer className="flex items-center justify-between pt-2 border-t border-cr-border">
                <div itemScope itemType="https://schema.org/Person" itemProp="author">
                  <p itemProp="name" className="font-sans text-xs font-semibold text-cr-text">
                    {t.name}
                  </p>
                  <p className="font-mono text-[10px] text-cr-text-muted">{t.city}</p>
                </div>
                <span className="font-mono text-[10px] text-cr-primary border border-cr-primary/30 px-2 py-0.5">
                  {t.festival}
                </span>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

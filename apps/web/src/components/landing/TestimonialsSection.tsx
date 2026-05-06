import { TESTIMONIALS, TESTIMONIALS_AGGREGATE } from "@/lib/testimonials";
import { generateServiceReviewSchema } from "@/lib/schemaGenerators";
import { SITE_URL } from "@/lib/siteUrl";
import { TestimonialCard } from "./TestimonialCard";

export function TestimonialsSection() {
  const reviewSchema = generateServiceReviewSchema({
    siteUrl: SITE_URL,
    aggregate: TESTIMONIALS_AGGREGATE,
    reviews: TESTIMONIALS,
  });

  return (
    <section aria-labelledby="testimonials-title" className="border-t border-cr-border">
      {/* Review + AggregateRating schema — attached to the /#service entity */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
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
          {/* Aggregate rating summary — visible for humans and crawlers */}
          <p className="font-sans text-sm text-cr-text-muted">
            <span className="text-cr-primary font-semibold">{TESTIMONIALS_AGGREGATE.ratingValue} / 5</span>
            {" "}— valoración media de{" "}
            <span className="text-cr-primary font-semibold">{TESTIMONIALS_AGGREGATE.reviewCount}</span>{" "}
            usuarios verificados
          </p>
        </header>

        {/* Responsive grid: 1 col → 2 cols → 3 cols */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a
            href="/concerts"
            className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-primary border border-cr-primary/40 px-5 py-2.5 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Buscar mi viaje →
          </a>
          <p className="font-mono text-[10px] text-cr-text-dim">
            Sin comisión · Conductores verificados · Pago en efectivo o Bizum
          </p>
        </div>
      </div>
    </section>
  );
}

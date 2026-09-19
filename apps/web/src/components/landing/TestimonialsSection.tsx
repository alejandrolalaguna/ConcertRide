import { TESTIMONIALS } from "@/lib/testimonials";
import { useI18n } from "@/lib/i18n";
import { Register, SectionHead } from "@/components/system";

function Stars({ rating }: { rating: number }) {
  const { t } = useI18n();
  return (
    <span className="cr-label text-cr-primary" aria-label={t("home.testimonialsStarsAria", { rating })}>
      <span aria-hidden="true">{"★".repeat(Math.round(rating))}</span>
    </span>
  );
}

/**
 * Testimonios (lib/testimonials.ts, la misma fuente que alimenta el schema
 * Review de la página). Registro sobrio: cita, autor, ruta y valoración. Sin
 * avatares de colores ni cifras de ahorro que no podamos demostrar.
 */
export function TestimonialsSection() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="testimonials-title" id="testimonials" className="px-6 py-[var(--rhythm-2)] border-t border-cr-border">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <SectionHead
          id="testimonials-title"
          eyebrow={t("home.testimonialsEyebrow")}
          title={
            <>
              {t("home.testimonialsTitleLine1")}
              <br />
              <span className="text-cr-text-muted">{t("home.testimonialsTitleLine2")}</span>
            </>
          }
          scan="words"
        />
        <Register as="ul" data-scan="rise" data-scan-children="">
          {TESTIMONIALS.map((item) => (
            <li key={item.id} className="cr-register__row !items-start">
              <blockquote className="cr-register__title !col-span-7 !transform-none">
                <p className="text-lead text-cr-text leading-snug max-w-[40ch]">“{item.quote}”</p>
              </blockquote>
              <div className="cr-register__desc !col-span-3 flex flex-col gap-1">
                <p className="text-sm font-medium text-cr-text">{item.author}</p>
                <p className="cr-label text-cr-text-muted">
                  {item.route} · {item.festival}
                </p>
              </div>
              <div className="cr-register__action">
                <Stars rating={item.rating} />
              </div>
            </li>
          ))}
        </Register>
      </div>
    </section>
  );
}

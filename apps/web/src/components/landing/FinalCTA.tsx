import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/**
 * Cierre. Sin foto, sin anillos, sin orbes: el titular a tamaño de cartel y
 * un solo CTA primario. Las condiciones van en una fila de etiquetas.
 */
export function FinalCTA() {
  const { locale } = useI18n();
  const en = locale === "en";
  const CONDITIONS = en
    ? ["No credit card", "Free", "No fees", "Cancel anytime"]
    : ["Sin tarjeta de crédito", "Gratis", "Sin comisiones", "Cancela cuando quieras"];

  return (
    <section aria-labelledby="final-cta" className="cr-noise relative overflow-hidden border-t border-cr-border">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-16 py-[var(--rhythm-3)] grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
        <h2 id="final-cta" data-scan="words" className="lg:col-span-8 font-display text-display-xl max-w-[12ch]">
          {en ? "Your next" : "Tu próximo"}
          <br />
          <span className="text-cr-primary">{en ? "show is waiting." : "concierto te espera."}</span>
        </h2>

        <div className="lg:col-span-4 flex flex-col gap-6 lg:pb-3">
          <p className="cr-prose text-lead text-cr-text-muted">
            {en
              ? "Sign up in thirty seconds and find a seat to your next festival. Or publish yours and fill the car."
              : "Regístrate en treinta segundos y encuentra asiento para tu próximo festival. O publica el tuyo y llena el coche."}
          </p>
          <div className="flex flex-col gap-3">
            <a href="/register" className="cr-btn-primary cr-btn-shine group">
              {en ? "Create free account" : "Crear cuenta gratis"}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a href="/concerts" className="cr-link cr-label text-cr-text-muted hover:text-cr-text self-start">
              {en ? "Browse rides without signing up" : "Buscar viajes sin registrarme"}
            </a>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 border-t border-cr-border pt-5" aria-label={en ? "Conditions" : "Condiciones"}>
            {CONDITIONS.map((c) => (
              <li key={c} className="cr-label text-cr-text-muted flex items-center gap-2">
                <span className="w-1.5 h-px bg-cr-primary" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { Register, RegisterRow, SectionHead } from "@/components/system";

/**
 * Para conductores. El sitio tiene pocos viajes publicados: esta sección es
 * la que tiene que convertir a quien tiene coche. Titular grande, tres
 * argumentos en registro, un solo CTA primario.
 */
export function DriverCTA() {
  const { locale } = useI18n();
  const en = locale === "en";

  const BENEFITS = en
    ? [
        { n: "01", title: "Get your fuel back", body: "Split the cost between passengers. The trip ends up close to free for you." },
        { n: "02", title: "Good company", body: "Fans heading to the same show. The conversation just happens." },
        { n: "03", title: "You set the rules", body: "Price per seat, number of passengers, stops, luggage. Nobody else decides." },
      ]
    : [
        { n: "01", title: "Recupera la gasolina", body: "Divide el coste entre los pasajeros. El viaje te sale casi gratis." },
        { n: "02", title: "Buena compañía", body: "Fans que van al mismo concierto. La charla sale sola." },
        { n: "03", title: "Tú pones las reglas", body: "Precio por asiento, plazas, paradas, equipaje. No decide nadie más." },
      ];

  return (
    <section aria-labelledby="driver-cta-title" id="conductores" className="px-6 py-[var(--rhythm-3)] border-t border-cr-border">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-6 flex flex-col gap-8">
          <SectionHead
            id="driver-cta-title"
            eyebrow={en ? "For drivers" : "Para conductores"}
            size="l"
            title={
              <>
                {en ? "Your car." : "Tu coche."}
                <br />
                <span className="text-cr-primary">{en ? "Your trip." : "Tu viaje."}</span>
                <br />
                {en ? "Your rules." : "Tus reglas."}
              </>
            }
            scan="words"
          />
          <p className="cr-prose text-lead text-cr-text-muted">
            {en
              ? "Post your trip to the show in two minutes. Choose how many passengers, the price per seat and whether you want stops. You pay nothing to us."
              : "Publica tu viaje al concierto en dos minutos. Elige cuántos pasajeros, el precio del asiento y si quieres paradas. A nosotros no nos pagas nada."}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link to="/register" className="cr-btn-primary cr-btn-shine group">
              {en ? "Create account & publish" : "Crear cuenta y publicar"}
              <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link to="/publish" className="cr-link cr-label text-cr-text-muted hover:text-cr-text">
              {en ? "I already have an account" : "Ya tengo cuenta"}
            </Link>
          </div>
        </div>

        <Register as="ol" className="lg:col-span-6" data-scan="rise" data-scan-children="">
          {BENEFITS.map((b) => (
            <li key={b.n}>
              <RegisterRow n={b.n} title={b.title} description={b.body} />
            </li>
          ))}
        </Register>
      </div>
    </section>
  );
}

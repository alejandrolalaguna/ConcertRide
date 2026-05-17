import { Link } from "react-router-dom";
import { ArrowRight, Search, Ticket, ShieldCheck } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

const STEPS = [
  {
    number: 1,
    icon: Search,
    title: "Busca tu festival o concierto",
    description:
      "Usa nuestro buscador para encontrar tu evento. Puedes filtrar por ciudad, fecha o género musical.",
    cta: { label: "Ir al buscador", to: "/conciertos" } as const,
  },
  {
    number: 2,
    icon: Ticket,
    title: "Elige tu plaza de carpooling",
    description:
      "Compara conductores verificados: precio por asiento, ciudad de origen, hora de salida y valoraciones de otros pasajeros. El pago es en efectivo o Bizum el día del viaje — sin adelantos, sin comisión.",
    cta: null,
  },
  {
    number: 3,
    icon: ShieldCheck,
    title: "Conoce a tu conductor",
    description:
      "Todos los conductores han verificado su carnet de conducir. Puedes leer sus reseñas, ver su historial de viajes y chatear antes de confirmar.",
    cta: null,
  },
] as const;

export default function BienvenidaPage() {
  useSeoMeta({
    title: "¡Bienvenido/a a ConcertRide!",
    description: "Empieza a usar ConcertRide: busca festivales, elige tu plaza de carpooling y conoce a tu conductor.",
    canonical: `${SITE_URL}/bienvenida`,
    noindex: true,
  });

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text flex items-start justify-center">
      {/* Schema: WebPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${SITE_URL}/bienvenida#webpage`,
            url: `${SITE_URL}/bienvenida`,
            name: "Bienvenida a ConcertRide",
            description:
              "Página de bienvenida post-registro de ConcertRide. Guía en 3 pasos para reservar tu primer carpooling a un festival.",
            inLanguage: "es-ES",
            isPartOf: { "@id": `${SITE_URL}/#website` },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Bienvenida", item: `${SITE_URL}/bienvenida` },
              ],
            },
          }),
        }}
      />

      <div className="relative w-full max-w-2xl px-6 pt-24 pb-20 md:pt-32">
        {/* Background atmosphere */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(219,255,0,0.07) 0%, transparent 65%)",
          }}
        />

        {/* Header */}
        <header className="relative space-y-4 mb-12 text-center">
          {/* Confetti badge */}
          <div
            className="inline-flex items-center gap-2 border border-[#dbff00]/30 bg-[#dbff00]/[0.07] px-4 py-2"
            aria-label="Registro completado"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#dbff00] animate-pulse flex-shrink-0" aria-hidden="true" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#dbff00]">
              Registro completado
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl uppercase leading-[0.92]">
            ¡Bienvenido/a a<br />
            <span className="text-[#dbff00]">ConcertRide!</span>
          </h1>

          <p className="font-sans text-sm text-white/60 max-w-md mx-auto leading-relaxed">
            Ya eres parte de los{" "}
            <strong className="text-white/90 font-semibold">4.200+ viajeros</strong>{" "}
            que van a festivales sin pagar comisiones.
          </p>
        </header>

        {/* Wizard steps */}
        <div
          className="relative space-y-6 mb-12"
          role="list"
          aria-label="Pasos para tu primer viaje"
        >
          {/* Vertical connector line */}
          <div
            aria-hidden="true"
            className="absolute left-[1.875rem] top-10 bottom-10 w-px bg-white/[0.06]"
          />

          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.number}
                role="listitem"
                className="relative flex gap-5 bg-white/[0.02] border border-white/[0.07] p-5 hover:border-white/[0.14] transition-colors"
              >
                {/* Step number + icon */}
                <div
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-[#dbff00]/30 bg-[#dbff00]/[0.07]"
                  aria-hidden="true"
                >
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    className="text-[#dbff00]"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  {/* Step label */}
                  <p
                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30"
                    aria-label={`Paso ${step.number}`}
                  >
                    Paso {step.number}
                  </p>

                  <h2 className="font-sans text-base font-semibold text-white/90 leading-snug">
                    {step.title}
                  </h2>

                  <p className="font-sans text-sm text-white/50 leading-relaxed">
                    {step.description}
                  </p>

                  {step.cta && (
                    <Link
                      to={step.cta.to}
                      className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-[#dbff00] hover:opacity-80 transition-opacity mt-1"
                    >
                      {step.cta.label}
                      <ArrowRight size={12} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="mb-8 h-px"
          style={{ background: "linear-gradient(to right, rgba(219,255,0,0.3), transparent)" }}
        />

        {/* Final CTA */}
        <div className="text-center space-y-4">
          <Link
            to="/conciertos"
            className="inline-flex items-center gap-2 w-full justify-center bg-[#dbff00] text-black font-sans font-semibold uppercase tracking-[0.14em] text-sm border-2 border-black px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
          >
            Buscar mi primer viaje
            <ArrowRight size={16} aria-hidden="true" />
          </Link>

          <p className="font-sans text-xs text-white/30 leading-relaxed">
            O empieza explorando los{" "}
            <Link
              to="/festivales"
              className="text-white/50 underline underline-offset-2 hover:text-[#dbff00] transition-colors"
            >
              festivales del año
            </Link>
            {" "}y{" "}
            <Link
              to="/artistas"
              className="text-white/50 underline underline-offset-2 hover:text-[#dbff00] transition-colors"
            >
              artistas en España
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

import { Check, TrendingUp, Leaf, Users } from "lucide-react";

const TRUST_POINTS = [
  "Perfil verificado con DNI",
  "Conductores con carnet verificado",
  "Sin comisiones de plataforma",
];

const SECTOR_STATS = [
  {
    icon: Users,
    figure: "+25M",
    label: "asistentes a festivales en España en 2024",
    source: "APM 2024",
    sourceUrl: "https://www.apmusicales.com/",
  },
  {
    icon: TrendingUp,
    figure: "1.000+",
    label: "festivales celebrados en España en 2024",
    source: "APM 2024",
    sourceUrl: "https://www.apmusicales.com/",
  },
  {
    icon: Leaf,
    figure: "80%",
    label: "de la huella de carbono de un festival viene del transporte de asistentes",
    source: "Julie's Bicycle",
    sourceUrl: "https://juliesbicycle.com/",
  },
];

const FAQ_ITEMS = [
  {
    question: "¿Es gratis usar ConcertRide?",
    answer:
      "Sí. ConcertRide no cobra comisión ni al conductor ni al pasajero. El precio lo fija el conductor para cubrir gasolina y peajes; el pago se hace directamente en efectivo o Bizum.",
  },
  {
    question: "¿Cómo se verifican los conductores?",
    answer:
      "Cada conductor sube una foto del carnet de conducir y verifica su identidad con DNI. El equipo de ConcertRide revisa manualmente cada perfil antes de activarlo.",
  },
  {
    question: "¿Qué pasa si el conductor cancela el viaje?",
    answer:
      "Recibes una notificación inmediata y puedes buscar otro viaje disponible. Como el pago es presencial (efectivo o Bizum) no hay cargos automáticos que gestionar.",
  },
  {
    question: "¿Puedo publicar un viaje si voy en coche al festival?",
    answer:
      "Sí. Publicas tu ruta, fecha, hora de salida y el precio por asiento. Los pasajeros te solicitan plaza y tú decides aceptar. Cubre gasolina y peajes sin perder dinero.",
  },
  {
    question: "¿ConcertRide cubre toda España?",
    answer:
      "Sí. La plataforma opera en todo el territorio español. Las rutas más activas conectan Madrid, Barcelona, Valencia, Bilbao, Sevilla y Zaragoza con los festivales más grandes del año.",
  },
];

export function TrustSection() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };

  return (
    <section
      aria-labelledby="trust-title"
      className="py-20 md:py-28 px-6 border-t border-cr-border"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-6xl mx-auto space-y-16">
        {/* ── Sector stats ── */}
        <div className="space-y-8">
          <header className="space-y-3 max-w-2xl">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
              El sector en cifras
            </p>
            <h2
              id="trust-title"
              className="font-display text-3xl md:text-5xl uppercase leading-[0.95]"
            >
              España lidera<br />el turismo festivalero.
            </h2>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-xl">
              El mercado de música en vivo en España es uno de los cinco con mayor crecimiento
              en Europa. El reto está en llegar sin gastar el doble del ticket en transporte.
            </p>
          </header>

          <dl className="grid sm:grid-cols-3 gap-px bg-cr-border">
            {SECTOR_STATS.map(({ icon: Icon, figure, label, source, sourceUrl }) => (
              <div
                key={figure}
                className="bg-cr-bg p-8 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <Icon size={18} className="text-cr-primary" aria-hidden="true" />
                  <dt className="font-display text-4xl md:text-5xl text-cr-text leading-none">
                    {figure}
                  </dt>
                  <dd className="font-sans text-sm text-cr-text-muted leading-relaxed">
                    {label}
                  </dd>
                </div>
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-cr-text-dim hover:text-cr-primary transition-colors"
                >
                  Fuente: {source} ↗
                </a>
              </div>
            ))}
          </dl>
        </div>

        {/* ── FAQ — FAQPage schema + GEO ── */}
        <div className="space-y-6">
          <header className="space-y-2">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
              Preguntas frecuentes
            </p>
            <h3 className="font-display text-2xl md:text-3xl uppercase leading-tight">
              Todo lo que necesitas saber antes de reservar
            </h3>
          </header>

          <div className="divide-y divide-cr-border border border-cr-border">
            {FAQ_ITEMS.map(({ question, answer }) => (
              <details key={question} className="group">
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none select-none hover:bg-white/[0.02] transition-colors">
                  <span className="font-sans text-sm font-medium text-cr-text leading-snug">
                    {question}
                  </span>
                  <span
                    className="flex-shrink-0 w-5 h-5 border border-cr-border flex items-center justify-center text-cr-text-dim group-open:rotate-45 transition-transform duration-200"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="px-6 pb-5 pt-1 font-sans text-sm text-cr-text-muted leading-relaxed">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* ── Trust badges ── */}
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

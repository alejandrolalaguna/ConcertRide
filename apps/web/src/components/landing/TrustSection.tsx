import { Check, TrendingUp, Leaf, Users, MapPin, Music2, Zap, ShieldCheck } from "lucide-react";

const PLATFORM_STATS = [
  { icon: MapPin, value: "+30", label: "Festivales cubiertos", sublabel: "temporada 2026" },
  { icon: Music2, value: "0%", label: "Comisión de plataforma", sublabel: "precio justo garantizado" },
  { icon: ShieldCheck, value: "100%", label: "Conductores verificados", sublabel: "DNI + carnet de conducir" },
  { icon: Zap, value: "<2 min", label: "Para publicar un viaje", sublabel: "sin complicaciones" },
] as const;

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
    question: "¿Cuánto cuesta un viaje en ConcertRide?",
    answer:
      "El precio lo fija el conductor según la distancia y el coste de gasolina. En rutas cortas (50–100 km) ronda los 5–12 €/asiento. En rutas largas (300–600 km) puede llegar a 15–30 €. ConcertRide no añade comisión, así que el precio es siempre más bajo que en otras plataformas.",
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
  {
    question: "¿Puedo viajar con mis amigos en el mismo coche?",
    answer:
      "Sí, puedes solicitar varias plazas en un mismo viaje si el conductor tiene asientos disponibles. Coordínate con tu grupo antes de solicitar para ir todos juntos.",
  },
  {
    question: "¿Qué documentos necesito para registrarme?",
    answer:
      "Solo necesitas un email y, si vas a conducir, una foto del carnet de conducir y DNI para la verificación. Los pasajeros solo necesitan crear una cuenta gratuita.",
  },
  {
    question: "¿Cómo se hace el pago?",
    answer:
      "El pago se realiza directamente al conductor el día del viaje, en efectivo o por Bizum. ConcertRide no gestiona cobros ni retiene dinero — sin comisiones, sin sorpresas.",
  },
  {
    question: "¿Es seguro viajar en ConcertRide?",
    answer:
      "Todos los conductores están verificados con DNI y carnet de conducir. Los perfiles incluyen foto, valoraciones de otros usuarios y un historial de viajes. Además, puedes comunicarte directamente con el conductor antes de confirmar.",
  },
  {
    question: "¿Puedo cancelar mi reserva?",
    answer:
      "Sí, puedes cancelar desde tu perfil. Al ser el pago presencial, no hay cargos automáticos. Avisa al conductor con la mayor antelación posible para que pueda buscar otro pasajero.",
  },
  {
    question: "¿Qué ocurre si llego tarde al punto de recogida?",
    answer:
      "Coordínate con el conductor por el chat de la plataforma. En ConcertRide los conductores suelen tener margen de 5–10 minutos, pero recuerda que también tienen festival que no quieren perderse.",
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
      className="relative py-20 md:py-28 px-6 border-t border-white/[0.06] overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Subtle background image */}
      <img
        aria-hidden="true"
        src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1400&q=50&auto=format&fit=crop"
        alt=""
        width={1400}
        height={800}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.04] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(219,255,0,0.05) 0%, transparent 60%)" }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="relative max-w-6xl mx-auto space-y-16">

        {/* ── Platform metrics — números de ConcertRide ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.04]">
          {PLATFORM_STATS.map(({ icon: Icon, value, label, sublabel }) => (
            <div key={label} className="bg-[#0a0a0a] px-6 py-8 flex flex-col gap-3 group hover:bg-[#0f0f0f] transition-colors duration-200">
              <Icon size={16} className="text-cr-primary" aria-hidden="true" />
              <p
                className="font-display text-3xl md:text-5xl text-cr-primary leading-none"
                style={{ textShadow: "0 0 24px rgba(219,255,0,0.3)" }}
              >
                {value}
              </p>
              <p className="font-sans text-sm font-semibold text-cr-text leading-tight">{label}</p>
              <p className="font-mono text-[10px] text-cr-text-dim uppercase tracking-[0.14em]">{sublabel}</p>
            </div>
          ))}
        </div>

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

          <dl className="grid sm:grid-cols-3 gap-px bg-white/[0.04]">
            {SECTOR_STATS.map(({ icon: Icon, figure, label, source, sourceUrl }) => (
              <div
                key={figure}
                className="bg-[#0a0a0a] p-8 space-y-3 flex flex-col justify-between group hover:bg-[#0f0f0f] transition-colors duration-200 relative overflow-hidden"
              >
                {/* Subtle hover glow */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(219,255,0,0.04) 0%, transparent 60%)" }}
                />
                <div className="space-y-2 relative">
                  <Icon size={18} className="text-cr-primary" aria-hidden="true" />
                  <dt
                    className="font-display text-4xl md:text-5xl text-cr-text leading-none"
                    style={{ textShadow: "0 0 40px rgba(219,255,0,0.15)" }}
                  >
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
                  className="font-mono text-[10px] text-cr-text-dim hover:text-cr-primary transition-colors relative"
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

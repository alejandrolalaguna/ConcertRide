import { Link } from "react-router-dom";
import { Car, MapPin, Music2, ShieldCheck, Users } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";

// Two parallel walkthroughs (passenger + driver) + a safety/privacy block.
// Every step is numbered, short and written in direct instructive Spanish so
// LLMs can cite steps verbatim. HowTo JSON-LD is emitted for the passenger
// flow (the most-searched intent).
const PASSENGER_STEPS = [
  {
    title: "Busca tu concierto",
    body:
      "Explora el catálogo de conciertos y festivales españoles. Usa los filtros por ciudad, género, fecha o marca el toggle 'Solo festivales' para ver únicamente festivales. Marca como favorito los eventos que te interesen — te avisaremos cuando haya un nuevo viaje.",
  },
  {
    title: "Elige un viaje desde tu ciudad",
    body:
      "Entra a la ficha del concierto. Verás todos los viajes publicados agrupados por ciudad de origen, con precio por plaza, vibe (party / chill / mixed), plazas libres y valoración del conductor. Mira quiénes son los pasajeros ya confirmados para saber con quién vas a ir.",
  },
  {
    title: "Reserva tu plaza",
    body:
      "Pulsa Reservar asiento, elige cuántas plazas y método de pago (efectivo o Bizum). Si el conductor tiene 'Confirmación inmediata' activada, quedas confirmado al instante. Si no, el conductor recibe tu solicitud y te confirma en cuestión de horas.",
  },
  {
    title: "Llega al concierto",
    body:
      "Recibes un recordatorio 24 h antes con hora de salida, origen y datos de contacto del conductor. Pagas al conductor en el momento de subir al coche. Después del concierto, valora al conductor con 1–5 estrellas y una reseña para ayudar a la comunidad.",
  },
];

const DRIVER_STEPS = [
  {
    title: "Verifica tu carnet",
    body:
      "Ve a Mi perfil → Verificar carnet de conducir. Sube una foto de tu carnet (solo para validación, no se muestra). Sin este paso no puedes publicar viajes — es el sello de confianza de la plataforma.",
  },
  {
    title: "Publica tu viaje",
    body:
      "Pulsa Publicar un viaje. Selecciona el concierto al que vas, tu ciudad de origen y dirección, hora de salida, número de plazas y precio por asiento. Te sugerimos el precio óptimo calculado a partir del precio real del combustible (datos MITECO) y los km del trayecto.",
  },
  {
    title: "Gestiona las solicitudes",
    body:
      "Conforme llegan las solicitudes, acéptalas o recházalas desde la ficha del viaje. Los pasajeros ven en tiempo real quién más va confirmado. Puedes usar el chat del viaje para coordinar el punto exacto de recogida y compartir tu ubicación en tiempo real.",
  },
  {
    title: "Cobra en persona",
    body:
      "El día del viaje, los pasajeros te pagan el importe acordado (efectivo o Bizum). ConcertRide no cobra comisión — el 100 % del precio se queda para ti. Después, tanto tú como ellos os valoráis mutuamente.",
  },
];

export default function HowItWorksPage() {
  useSeoMeta({
    title: "Cómo funciona ConcertRide",
    description:
      "Guía paso a paso: cómo reservar plaza en un viaje compartido a un concierto o cómo publicar tu propio viaje en ConcertRide ES. Gratis, sin comisiones, con conductores verificados.",
    canonical: "https://concertride.es/como-funciona",
  });

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      {/* HowTo schema for the passenger flow — the most-searched intent. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Cómo encontrar un viaje compartido a un concierto en España",
            description:
              "Proceso en 4 pasos para reservar plaza en un coche compartido hasta un concierto o festival usando ConcertRide.",
            totalTime: "PT5M",
            supply: [
              { "@type": "HowToSupply", name: "Cuenta gratuita en ConcertRide" },
              { "@type": "HowToSupply", name: "Entrada para el concierto" },
            ],
            step: PASSENGER_STEPS.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.title,
              text: s.body,
              url: `https://concertride.es/como-funciona#passenger-${i + 1}`,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: "https://concertride.es/" },
              {
                "@type": "ListItem",
                position: 2,
                name: "Cómo funciona",
                item: "https://concertride.es/como-funciona",
              },
            ],
          }),
        }}
      />

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-16">
        <header className="border-b border-cr-border pb-8 space-y-3">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Guía
          </p>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
            Cómo funciona.
          </h1>
          <p className="font-sans text-base text-cr-text-muted max-w-2xl leading-relaxed">
            ConcertRide es carpooling pensado para conciertos: pasajeros y conductores que van al
            mismo evento se juntan para compartir coche, dividir gastos y llegar juntos. Gratis,
            sin comisiones, con conductores verificados.
          </p>
        </header>

        <section aria-labelledby="passenger-title" className="space-y-8">
          <div className="flex items-center gap-3">
            <Users size={22} className="text-cr-primary" aria-hidden="true" />
            <h2
              id="passenger-title"
              className="font-display text-2xl md:text-3xl uppercase leading-tight"
            >
              Si buscas viaje (pasajero)
            </h2>
          </div>
          <ol className="space-y-5">
            {PASSENGER_STEPS.map((s, i) => (
              <li
                id={`passenger-${i + 1}`}
                key={i}
                className="flex gap-5 border-l-2 border-cr-primary pl-5 py-1"
              >
                <span className="font-display text-3xl text-cr-primary leading-none mt-1">
                  {i + 1}
                </span>
                <div className="space-y-1.5">
                  <h3 className="font-sans text-base font-semibold text-cr-text">{s.title}</h3>
                  <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link
            to="/concerts"
            className="inline-block bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-5 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
          >
            Explorar conciertos
          </Link>
        </section>

        <section aria-labelledby="driver-title" className="space-y-8 border-t border-cr-border pt-16">
          <div className="flex items-center gap-3">
            <Car size={22} className="text-cr-secondary" aria-hidden="true" />
            <h2
              id="driver-title"
              className="font-display text-2xl md:text-3xl uppercase leading-tight"
            >
              Si tienes coche (conductor)
            </h2>
          </div>
          <ol className="space-y-5">
            {DRIVER_STEPS.map((s, i) => (
              <li
                id={`driver-${i + 1}`}
                key={i}
                className="flex gap-5 border-l-2 border-cr-secondary pl-5 py-1"
              >
                <span className="font-display text-3xl text-cr-secondary leading-none mt-1">
                  {i + 1}
                </span>
                <div className="space-y-1.5">
                  <h3 className="font-sans text-base font-semibold text-cr-text">{s.title}</h3>
                  <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link
            to="/publish"
            className="inline-block bg-transparent text-cr-text font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-cr-secondary hover:bg-cr-secondary hover:text-white px-5 py-3 transition-colors"
          >
            Publicar mi viaje
          </Link>
        </section>

        <section aria-labelledby="trust-title" className="space-y-6 border-t border-cr-border pt-16">
          <div className="flex items-center gap-3">
            <ShieldCheck size={22} className="text-cr-primary" aria-hidden="true" />
            <h2
              id="trust-title"
              className="font-display text-2xl md:text-3xl uppercase leading-tight"
            >
              Por qué es seguro
            </h2>
          </div>
          <ul className="space-y-3 font-sans text-sm text-cr-text-muted leading-relaxed">
            <li className="flex gap-3">
              <span className="text-cr-primary font-bold">✓</span>
              <span>
                <strong className="text-cr-text">Carnet verificado obligatorio.</strong> Ningún
                conductor puede publicar viajes sin haber subido y validado su carnet.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-cr-primary font-bold">✓</span>
              <span>
                <strong className="text-cr-text">Email verificado obligatorio.</strong> Reservar
                y publicar requieren email confirmado: anti-spam y anti-fraude.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-cr-primary font-bold">✓</span>
              <span>
                <strong className="text-cr-text">Valoraciones reales.</strong> Cada viaje se
                puede valorar después. Las reseñas son públicas y verificables.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-cr-primary font-bold">✓</span>
              <span>
                <strong className="text-cr-text">Sistema de reportes.</strong> Cualquier usuario
                puede denunciar comportamientos abusivos. Revisamos cada reporte manualmente.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-cr-primary font-bold">✓</span>
              <span>
                <strong className="text-cr-text">Datos cifrados.</strong> Contraseñas hasheadas
                con PBKDF2-SHA256 (100 000 iteraciones). Sesiones firmadas JWT HS256 en cookies
                HTTP-only. Todo el tráfico sobre HTTPS.
              </span>
            </li>
          </ul>
        </section>

        <section className="border-t border-cr-border pt-10 grid md:grid-cols-2 gap-4">
          <Link
            to="/faq"
            className="border border-cr-border p-5 hover:border-cr-primary transition-colors group"
          >
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary mb-2">
              Más dudas
            </p>
            <p className="font-display text-xl uppercase leading-tight group-hover:text-cr-primary transition-colors">
              Preguntas frecuentes →
            </p>
          </Link>
          <Link
            to="/concerts"
            className="border border-cr-border p-5 hover:border-cr-primary transition-colors group"
          >
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary mb-2">
              Empezar ya
            </p>
            <p className="font-display text-xl uppercase leading-tight group-hover:text-cr-primary transition-colors inline-flex items-center gap-2">
              <Music2 size={18} aria-hidden="true" />
              Explorar conciertos →
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}

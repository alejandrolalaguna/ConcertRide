import { Link } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";

export default function AcercaDePage() {
  useSeoMeta({
    title: "Acerca de ConcertRide ES — Carpooling para conciertos en España",
    description:
      "Qué es ConcertRide, por qué existe y cómo funciona el carpooling para conciertos en España. Alternativa sin comisión al taxi y a BlaBlaCar para ir a festivales.",
    canonical: "https://concertride.es/acerca-de",
    keywords:
      "qué es ConcertRide, sobre ConcertRide, carpooling conciertos España, alternativa BlaBlaCar festivales, plataforma viajes compartidos conciertos, sin comisión carpooling, misión ConcertRide",
  });

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Acerca de ConcertRide ES",
            url: "https://concertride.es/acerca-de",
            inLanguage: "es-ES",
            datePublished: "2026-04-10",
            dateModified: "2026-04-24",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: "https://concertride.es/" },
                { "@type": "ListItem", position: 2, name: "Acerca de", item: "https://concertride.es/acerca-de" },
              ],
            },
            mainEntity: {
              "@type": "Organization",
              "@id": "https://concertride.es/#organization",
              name: "ConcertRide ES",
              url: "https://concertride.es",
              foundingDate: "2026",
              areaServed: { "@type": "Country", name: "Spain" },
              knowsAbout: [
                "Carpooling",
                "Conciertos en España",
                "Festivales de música",
                "Transporte compartido",
                "Movilidad sostenible",
              ],
              description:
                "Plataforma de viajes compartidos exclusiva para conciertos y festivales en España. Sin comisiones, con conductores verificados. Alternativa gratuita al taxi o BlaBlaCar para llegar a festivales de música.",
              sameAs: [
                "https://twitter.com/concertride_es",
                "https://www.instagram.com/concertride_es/",
              ],
            },
          }),
        }}
      />

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 space-y-12">
        <header className="border-b border-cr-border pb-8 space-y-3">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            La plataforma
          </p>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
            Llegar al concierto no debería ser el problema.
          </h1>
        </header>

        <section className="space-y-4 font-sans text-base text-cr-text-muted leading-relaxed">
          <p>
            <strong className="text-cr-text">ConcertRide</strong> nació para resolver un problema
            muy concreto: <strong className="text-cr-primary">el transporte a festivales y conciertos en España es caro, estresante y en ocasiones imposible</strong>. Según la{" "}
            <a href="https://www.apmusicales.com/" target="_blank" rel="noopener noreferrer" className="text-cr-primary underline underline-offset-2">
              Asociación de Promotores Musicales (APM)
            </a>
            , España celebró más de 1.000 festivales con más de 25 millones de asistentes en 2024 — y el problema del transporte sigue sin resolverse. Los taxis cobran 30–60 € por trayecto, el transporte público raramente cubre los horarios de madrugada (23:00–02:00) y los trenes no llegan a recintos como Arenal Sound en Burriana, Resurrection Fest en Viveiro o Mad Cool en IFEMA.
          </p>
          <p>
            Al mismo tiempo, <strong className="text-cr-text">miles de personas van al mismo evento en coche con asientos vacíos</strong>. Compartir ese coche reduce el coste por persona entre un 50 y un 75 %, reduce el tráfico, y mejora la experiencia: llegas con gente que va al mismo show.
          </p>
          <blockquote className="border-l-2 border-cr-primary pl-4 my-4">
            <p className="font-sans text-sm text-cr-text-muted italic leading-relaxed">
              "El transporte de los asistentes supone el 80 % de la huella de carbono de un festival de música.
              El carpooling es la acción individual más efectiva para reducirla."
            </p>
            <footer className="font-mono text-[11px] text-cr-text-dim mt-1">
              — <a href="https://juliesbicycle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
                Julie's Bicycle Practical Guide to Green Events
              </a>
            </footer>
          </blockquote>
          <p>
            La solución no es nueva — BlaBlaCar demostró que el carpooling funciona para trayectos ciudad-a-ciudad genéricos (cobra entre el 12 y el 18 % de comisión al pasajero). Pero ir a un concierto es diferente: hay una hora precisa de llegada, un recinto específico, un tipo de música compartida y una conversación que nace antes de subir al coche. <strong className="text-cr-text">ConcertRide está diseñada para ese contexto específico</strong>, sin comisión, con conductores verificados y pago en persona.
          </p>
        </section>

        <section className="space-y-4 border-t border-cr-border pt-8">
          <h2 className="font-display text-2xl md:text-3xl uppercase leading-tight">
            Principios
          </h2>
          <dl className="space-y-5 font-sans text-sm text-cr-text-muted leading-relaxed">
            <div>
              <dt className="font-semibold text-cr-primary mb-1">Sin comisiones.</dt>
              <dd>
                El 100 % del precio por asiento va al conductor. ConcertRide nunca cobrará al
                pasajero ni al conductor por usar la plataforma. Si algún día hay ingresos, será
                mediante partnerships con festivales (visibilidad), no comisiones.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-cr-primary mb-1">Conductor = vecino, no taxista.</dt>
              <dd>
                La ley española prohíbe lucrarse con los asientos privados del coche. El precio
                que sugerimos cubre combustible + peajes. Punto. Esto protege legalmente al
                conductor y mantiene los precios muy por debajo del taxi.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-cr-primary mb-1">Confianza con reglas claras.</dt>
              <dd>
                Carnet verificado obligatorio para conducir. Email verificado obligatorio para
                publicar o reservar. Reseñas públicas después de cada viaje. Botón de reportar en
                cada perfil. Eliminación de cuenta en un clic (RGPD).
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-cr-primary mb-1">Sin publicidad invasiva, sin trackers.</dt>
              <dd>
                Una cookie estrictamente necesaria (sesión) y una analítica anónima opcional
                alojada en Europa (PostHog EU), solo si la aceptas. No hay Google Analytics, ni
                píxeles de Facebook, ni trackers cruzados.
              </dd>
            </div>
          </dl>
        </section>

        <section className="space-y-4 border-t border-cr-border pt-8">
          <h2 className="font-display text-2xl md:text-3xl uppercase leading-tight">
            Tecnología
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            ConcertRide está construido sobre infraestructura edge — Cloudflare Workers (backend),
            Turso (SQLite distribuido), Resend (emails), VAPID Web Push (notificaciones). Frontend
            en React + Vite + Tailwind, con Progressive Web App instalable. Sentry para errores,
            PostHog EU para analítica (opt-in). Todo en la UE.
          </p>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Contraseñas hasheadas con PBKDF2-SHA256 (100 000 iteraciones). Sesiones JWT HS256 en
            cookies HTTP-only. CSP estricta, HSTS con preload, rate limiting en todos los POST.
          </p>
        </section>

        <section className="border-t border-cr-border pt-8 grid md:grid-cols-2 gap-4">
          <Link
            to="/como-funciona"
            className="border border-cr-border p-5 hover:border-cr-primary transition-colors group"
          >
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary mb-2">
              Paso a paso
            </p>
            <p className="font-display text-xl uppercase leading-tight group-hover:text-cr-primary transition-colors">
              Cómo funciona →
            </p>
          </Link>
          <Link
            to="/guia-transporte-festivales"
            className="border border-cr-border p-5 hover:border-cr-primary transition-colors group"
          >
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary mb-2">
              Todas las opciones
            </p>
            <p className="font-display text-xl uppercase leading-tight group-hover:text-cr-primary transition-colors">
              Guía de transporte →
            </p>
          </Link>
          <Link
            to="/contacto"
            className="border border-cr-border p-5 hover:border-cr-primary transition-colors group"
          >
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary mb-2">
              Habla con nosotros
            </p>
            <p className="font-display text-xl uppercase leading-tight group-hover:text-cr-primary transition-colors">
              Contactar →
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}

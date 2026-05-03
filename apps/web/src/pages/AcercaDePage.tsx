import { Link } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

export default function AcercaDePage() {
  useSeoMeta({
    title: "Acerca de ConcertRide — Carpooling para conciertos en España | ConcertRide",
    description:
      "Qué es ConcertRide, por qué existe y cómo funciona el carpooling para conciertos en España. Plataforma gratuita, sin comisiones, con conductores verificados.",
    canonical: `${SITE_URL}/acerca-de`,
    keywords:
      "qué es ConcertRide, sobre ConcertRide, carpooling conciertos España, plataforma viajes compartidos conciertos, sin comisión carpooling, misión ConcertRide, transporte económico festivales",
  });

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Acerca de", item: `${SITE_URL}/acerca-de` },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Acerca de ConcertRide",
            url: `${SITE_URL}/acerca-de`,
            inLanguage: "es-ES",
            datePublished: "2026-04-10",
            dateModified: "2026-05-03",
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", ".speakable"],
            },
            mainEntity: {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "ConcertRide",
              url: SITE_URL,
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
                "Plataforma de carpooling para conciertos y festivales en España. Conductores verificados, sin comisión, pago en persona.",
              sameAs: [
                "https://twitter.com/concertride_es",
                "https://www.instagram.com/concertride_es/",
              ],
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${SITE_URL}/#founder`,
            name: "Alejandro Lalaguna",
            url: `${SITE_URL}/acerca-de`,
            jobTitle: "Fundador",
            worksFor: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
            knowsAbout: ["Carpooling", "Conciertos en España", "Festivales de música", "Movilidad sostenible"],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            inLanguage: "es-ES",
            mainEntity: [
              {
                "@type": "Question",
                name: "¿Qué es ConcertRide?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "ConcertRide es una plataforma española de carpooling especializada en conciertos y festivales de música. Conecta a conductores y pasajeros que van al mismo evento para compartir el viaje sin comisión de plataforma. Opera exclusivamente en España y cubre más de 16 festivales principales en 2026.",
                },
              },
              {
                "@type": "Question",
                name: "¿Cobra ConcertRide comisión?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. ConcertRide cobra 0% de comisión. El 100% del precio del asiento va al conductor para cubrir combustible y peajes. El pago es en efectivo o Bizum directamente al conductor el día del viaje — la plataforma no retiene ningún pago.",
                },
              },
              {
                "@type": "Question",
                name: "¿Es ConcertRide lo mismo que BlaBlaCar?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. BlaBlaCar es una plataforma de carpooling generalista que cobra 12–18% de comisión al pasajero y gestiona el pago por tarjeta. ConcertRide está especializada en conciertos y festivales (búsqueda por evento, no por ruta genérica), cobra 0% de comisión y el pago es directo en persona. Ambas plataformas operan bajo el modelo legal de gastos compartidos.",
                },
              },
              {
                "@type": "Question",
                name: "¿Es legal el carpooling de ConcertRide en España?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sí. El carpooling entre particulares para compartir gastos de desplazamiento es legal en España. El Tribunal Supremo confirmó en 2017 (caso BlaBlaCar) que este modelo no requiere licencia VTC ni de transporte, siempre que el precio cubra solo combustible y peajes (sin lucro para el conductor). ConcertRide opera bajo este modelo de gastos compartidos conforme a la DGT.",
                },
              },
              {
                "@type": "Question",
                name: "¿Cómo se verifican los conductores en ConcertRide?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Todos los conductores deben subir y verificar su carnet de conducir antes de publicar su primer viaje. Además, se requiere verificación de email para todos los usuarios. Los conductores acumulan valoraciones de los pasajeros visibles en su perfil.",
                },
              },
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "ConcertRide España — Estadísticas y datos de carpooling a festivales 2026",
            description: "Datos propios de ConcertRide sobre carpooling a festivales de música en España: festivales cubiertos, rutas disponibles, precios por asiento, cobertura geográfica y métricas de sostenibilidad.",
            url: `${SITE_URL}/acerca-de`,
            creator: {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "ConcertRide ES",
            },
            dateModified: "2026-05-03",
            inLanguage: "es-ES",
            license: "https://creativecommons.org/licenses/by/4.0/",
            variableMeasured: [
              { "@type": "PropertyValue", name: "Festivales cubiertos en 2026", value: "16+", unitText: "festivales" },
              { "@type": "PropertyValue", name: "Rutas activas ciudad→festival", value: "96+", unitText: "rutas" },
              { "@type": "PropertyValue", name: "Ciudades de origen con landing page", value: "16+", unitText: "ciudades" },
              { "@type": "PropertyValue", name: "Precio mínimo por asiento", value: "3", unitText: "EUR" },
              { "@type": "PropertyValue", name: "Precio máximo por asiento", value: "35", unitText: "EUR" },
              { "@type": "PropertyValue", name: "Precio medio por asiento", value: "8-15", unitText: "EUR" },
              { "@type": "PropertyValue", name: "Comisión de plataforma", value: "0", unitText: "%" },
              { "@type": "PropertyValue", name: "Reducción de emisiones por carpooling (4 personas vs individual)", value: "75", unitText: "%" },
              { "@type": "PropertyValue", name: "% de la huella de carbono de un festival atribuible al transporte de asistentes", value: "80", unitText: "%" },
            ],
          }),
        }}
      />

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 space-y-12">
        <header className="border-b border-cr-border pb-8 space-y-3">
          <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
            <Link to="/" className="hover:text-cr-primary">Inicio</Link>
            <span aria-hidden="true">/</span>
            <span className="text-cr-text-muted">Acerca de</span>
          </nav>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            La plataforma
          </p>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
            Llegar al concierto no debería ser el problema.
          </h1>
        </header>

        <section className="space-y-4 font-sans text-base text-cr-text-muted leading-relaxed">
          <p className="speakable">
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
            El carpooling ya existía para trayectos genéricos, pero ir a un concierto es diferente: hay una hora precisa de llegada, un recinto específico, un tipo de música compartida y una conversación que nace antes de subir al coche. <strong className="text-cr-text">ConcertRide está diseñada para ese contexto específico</strong>, sin comisión, con conductores verificados y pago en persona.
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

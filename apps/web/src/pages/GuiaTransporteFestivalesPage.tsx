import { Link } from "react-router-dom";
import { ArrowRight, Bus, Car, Train, Zap } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { FESTIVAL_LANDINGS } from "@/lib/festivalLandings";

const GUIDE_FAQS = [
  {
    q: "¿Cuál es la forma más barata de ir a un festival en España?",
    a: "El carpooling entre particulares. Dividir la gasolina entre 3–4 personas sale a 3–20 €/asiento según la distancia — una de las opciones más económicas disponibles. ConcertRide conecta a fans que van al mismo evento para compartir el viaje sin comisiones ni intermediarios.",
  },
  {
    q: "¿Cómo volver de un festival de madrugada?",
    a: "Con ConcertRide, acuerdas la hora de vuelta con el conductor antes del viaje. La mayoría de los conductores publican viajes de ida y vuelta (el concierto acaba a las 2:00, salimos a las 2:30). No dependes del metro (que cierra) ni de taxis de madrugada (x3 precio). Es la solución más usada por los que vienen de fuera de la ciudad del festival.",
  },
  {
    q: "¿Son fiables los autobuses organizados a festivales?",
    a: "Existen operadoras privadas que ofrecen autobuses a algunos festivales. Son una opción válida para trayectos concretos desde grandes ciudades, aunque tienen horarios fijos y suelen agotarse. La desventaja: solo ofrecen origen-destino predefinido, el horario de vuelta es fijo, y en temporada alta puede no quedar plaza. El carpooling es más flexible y generalmente más económico.",
  },
  {
    q: "¿Es mejor el carpooling o el transporte público para ir a un festival?",
    a: "Depende del festival. Si el recinto está bien comunicado en metro (Parc del Fòrum para Primavera Sound, Fira Gran Via para Sónar), el transporte público es válido para la ida. Pero para la vuelta de madrugada y para festivales en recintos alejados (IFEMA, Kobetamendi, Arenal Sound en Burriana, Resurrection Fest en Viveiro) el carpooling es la única opción práctica.",
  },
  {
    q: "¿Cuánto contamina ir a un festival en coche?",
    a: "Un coche individual emite ~150 g CO₂/km. Compartido entre 4 personas, la emisión por pasajero baja a ~37 g CO₂/km — un 75 % menos. Según el Julie's Bicycle Practical Guide to Green Events (referencia estándar del sector), el 80 % de la huella de carbono de un festival proviene del transporte de los asistentes. La Agencia Europea de Medio Ambiente (EEA) confirma que el coche compartido es la forma más eficiente de reducir emisiones del transporte personal en distancias de 50–500 km. Compartir coche con ConcertRide es la acción individual más impactante para reducir tu huella en un festival.",
  },
  {
    q: "¿Qué pasa con el parking en los festivales grandes de España?",
    a: "El parking de IFEMA (Mad Cool, Tomavistas) cuesta 12–18 €/día y se satura desde primera hora. Kobetamendi (BBK Live) tiene acceso muy limitado. El Parc del Fòrum (Primavera Sound) no tiene parking masivo. La alternativa es aparcar en polígonos cercanos o, mejor, llegar en carpooling con alguien que conozca el aparcamiento o que te deje en la puerta.",
  },
];

export default function GuiaTransporteFestivalesPage() {
  useSeoMeta({
    title: `Guía de transporte para festivales de España ${new Date().getFullYear()}`,
    description:
      "Cómo llegar a los festivales de música en España sin taxi, sin agobios y sin pagar de más. Carpooling, buses, transporte público y todo lo que necesitas saber para 2026.",
    canonical: `${SITE_URL}/guia-transporte-festivales`,
    keywords:
      "transporte festivales España, cómo ir al festival sin coche, alternativa taxi festival España, autobús festival España, carpooling festival, guía transporte festival 2026, volver festival madrugada, cómo llegar festival España, movilidad sostenible festival, deja tu coche en casa festival, festival sin coche propio, transporte nocturno festival",
  });

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Guía de transporte para festivales de España 2026",
    description:
      "Guía completa: todas las opciones para llegar a los festivales de música en España en 2026 — carpooling, autobuses organizados, transporte público y consejos para volver de madrugada.",
    url: `${SITE_URL}/guia-transporte-festivales`,
    inLanguage: "es-ES",
    author: {
      "@type": "Organization",
      name: "ConcertRide ES",
      url: SITE_URL,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    datePublished: "2026-04-24",
    dateModified: "2026-04-25",
    mainEntityOfPage: `${SITE_URL}/guia-transporte-festivales`,
    about: {
      "@type": "Thing",
      name: "Transporte para festivales de música en España",
    },
  };

  const jsonLdHowToPassenger = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cómo encontrar carpooling para un festival en España",
    description: "Proceso en 4 pasos para reservar un viaje compartido a un festival de música en España usando ConcertRide.",
    totalTime: "PT5M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "8-15" },
    step: [
      { "@type": "HowToStep", position: 1, name: "Buscar el festival", text: "Entra en concertride.me/concerts y busca el festival por nombre o selecciona la landing page del festival (e.g. concertride.me/festivales/mad-cool). Verás todos los viajes disponibles agrupados por ciudad de origen." },
      { "@type": "HowToStep", position: 2, name: "Elegir un viaje desde tu ciudad", text: "Filtra por tu ciudad de origen. Compara precios por asiento, vibe (tranquilo/fiestero), plazas libres y valoración del conductor. Mira quiénes son los pasajeros ya confirmados." },
      { "@type": "HowToStep", position: 3, name: "Reservar tu plaza", text: "Pulsa 'Reservar asiento' y selecciona el número de plazas. Si el conductor tiene reserva instantánea, quedas confirmado al instante. Si no, el conductor revisa tu solicitud en horas." },
      { "@type": "HowToStep", position: 4, name: "Viajar y pagar", text: "El día del festival, el conductor te recoge en el punto acordado. Pagas directamente en efectivo o Bizum al conductor — sin comisión de plataforma. Acuerda también la hora de vuelta." },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GUIDE_FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guía de transporte para festivales",
        item: `${SITE_URL}/guia-transporte-festivales`,
      },
    ],
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowToPassenger) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* ── Hero ── */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-6 space-y-4 border-b border-cr-border">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span>Guía de transporte</span>
        </nav>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Guía completa · Edición 2026
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Cómo llegar a<br />los festivales<br />sin pagar de más.
        </h1>
        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed">
          Taxi, autobús organizado, metro, carpooling… Cada festival tiene su mejor opción.
          Esta guía compara todas las alternativas para que llegues al concierto, y vuelvas de madrugada,
          sin sustos en el precio ni en el horario.
        </p>
      </div>

      {/* ── Opciones de transporte ── */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <h2 className="font-display text-3xl md:text-4xl uppercase">
          Todas las opciones de transporte a festivales en España
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          {/* Carpooling */}
          <article className="border border-cr-primary p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Car size={18} className="text-cr-primary" />
              <h3 className="font-display text-lg uppercase text-cr-primary">Carpooling (ConcertRide)</h3>
            </div>
            <ul className="font-sans text-sm text-cr-text-muted space-y-1.5 leading-relaxed">
              <li>✓ Sale desde tu calle o barrio</li>
              <li>✓ Horario de vuelta pactado con el conductor</li>
              <li>✓ Sin comisión — pagas al conductor en persona</li>
              <li>✓ Funciona para cualquier festival, incluso rurales</li>
              <li>✓ Desde 3 € (ciudad cercana) hasta 20 € (500+ km)</li>
              <li>✗ Necesitas registrarte y acordar con el conductor</li>
            </ul>
            <p className="font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3">
              Precio medio: <strong className="text-cr-text">8–15 €/asiento</strong>
            </p>
          </article>

          {/* Bus organizado */}
          <article className="border border-cr-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Bus size={18} className="text-cr-text-muted" />
              <h3 className="font-display text-lg uppercase">Autobús de festival</h3>
            </div>
            <p className="font-sans text-[11px] text-cr-text-muted italic">Autocares organizados por operadoras privadas</p>
            <ul className="font-sans text-sm text-cr-text-muted space-y-1.5 leading-relaxed">
              <li>✓ Salida garantizada desde tu ciudad</li>
              <li>✓ Cómodo para no conducir</li>
              <li>✗ Solo desde ciudades concretas (Madrid, BCN, Bilbao…)</li>
              <li>✗ Horario de vuelta fijo (aunque el último bolo no haya acabado)</li>
              <li>✗ Se agota semanas antes del festival</li>
              <li>✗ Precio más alto que carpooling</li>
            </ul>
            <p className="font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3">
              Precio medio: <strong className="text-cr-text">15–35 €/asiento</strong>
            </p>
          </article>

          {/* Transporte público */}
          <article className="border border-cr-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Train size={18} className="text-cr-text-muted" />
              <h3 className="font-display text-lg uppercase">Transporte público</h3>
            </div>
            <p className="font-sans text-[11px] text-cr-text-muted italic">Metro, Cercanías, EMT, lanzaderas gratuitas</p>
            <ul className="font-sans text-sm text-cr-text-muted space-y-1.5 leading-relaxed">
              <li>✓ Barato o gratuito (lanzaderas)</li>
              <li>✓ Ideal para recintos bien comunicados (Fòrum BCN, Fira Montjuïc)</li>
              <li>✗ Metro cierra a la 1:30 (Madrid), 2:00 (Barcelona)</li>
              <li>✗ No llega a festivales rurales (Viveiro, Burriana, Villarrobledo)</li>
              <li>✗ Masificación extrema a la salida</li>
              <li>✗ No existe de vuelta en la madrugada</li>
            </ul>
            <p className="font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3">
              Precio medio: <strong className="text-cr-text">0–5 € (si existe)</strong>
            </p>
          </article>

          {/* Taxi / VTC */}
          <article className="border border-cr-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-cr-text-muted" />
              <h3 className="font-display text-lg uppercase">Taxi / VTC</h3>
            </div>
            <p className="font-sans text-[11px] text-cr-text-muted italic">Plataformas VTC y taxi convencional</p>
            <ul className="font-sans text-sm text-cr-text-muted space-y-1.5 leading-relaxed">
              <li>✓ Disponible a cualquier hora</li>
              <li>✓ Puerta a puerta</li>
              <li>✗ Precio x2–x3 en noches de festival</li>
              <li>✗ 30–90 € de media para la vuelta de madrugada</li>
              <li>✗ Largas esperas a la salida del festival</li>
              <li>✗ Zonas de recogida congestionadas</li>
            </ul>
            <p className="font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3">
              Precio medio vuelta de madrugada: <strong className="text-cr-text">40–90 €</strong>
            </p>
          </article>
        </div>
      </section>

      {/* ── El problema de volver de madrugada ── */}
      <section className="max-w-4xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-3xl md:text-4xl uppercase">
          El problema de volver de noche
        </h2>
        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          La mayoría de los festivales y conciertos terminan entre la 1:00 y las 4:00 de la mañana. En ese momento:
        </p>
        <ul className="font-sans text-sm text-cr-text-muted space-y-2 leading-relaxed list-none">
          <li className="flex gap-2">
            <span className="text-cr-secondary font-bold shrink-0">·</span>
            El metro de Madrid cierra a la 1:30 (ampliado a las 2:00–2:30 en noches de festival).
          </li>
          <li className="flex gap-2">
            <span className="text-cr-secondary font-bold shrink-0">·</span>
            Los autobuses nocturnos (búhos en Madrid, nitbus en Barcelona) no llegan a los recintos de festival.
          </li>
          <li className="flex gap-2">
            <span className="text-cr-secondary font-bold shrink-0">·</span>
            Taxis y VTC multiplican por 2–3 el precio en horario de madrugada con alta demanda.
          </li>
          <li className="flex gap-2">
            <span className="text-cr-secondary font-bold shrink-0">·</span>
            Los buses de festival tienen horario de vuelta fijo que no siempre coincide con el final del festival.
          </li>
        </ul>
        <div className="p-5 border border-cr-primary/30 bg-cr-primary/5 space-y-2">
          <p className="font-display text-base uppercase text-cr-primary">La solución: carpooling de vuelta pactado</p>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Con ConcertRide, acuerdas con el conductor <em>antes del festival</em> a qué hora volváis.
            «Salimos cuando acabe el último bolo, sobre las 2:30» es la instrucción más habitual.
            El conductor espera en el punto acordado y os lleváis a casa. Precio de vuelta: igual que la ida.
          </p>
        </div>
        <Link
          to="/concerts"
          className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
        >
          Buscar viaje de vuelta <ArrowRight size={12} />
        </Link>
      </section>

      {/* ── Sostenibilidad ── */}
      <section className="max-w-4xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-3xl md:text-4xl uppercase">
          Festivales y sostenibilidad: el transporte importa
        </h2>
        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          El 80% de la huella de carbono de un festival de música proviene del transporte de los asistentes,
          no del escenario ni la producción. Cada coche que lleva 4 personas al festival en lugar de ir solo
          elimina 3 vehículos de la carretera y reduce las emisiones por persona un 75%.
        </p>

        {/* Princeton Method 3: Expert quotation */}
        <blockquote className="border-l-2 border-cr-primary pl-5 space-y-2">
          <p className="font-sans text-sm text-cr-text-muted italic leading-relaxed">
            "El transporte de los asistentes supone el 80 % de la huella de carbono de un festival de música.
            El carpooling es la acción individual más efectiva para reducirla."
          </p>
          <footer className="font-mono text-[11px] text-cr-text-dim">
            — <a href="https://juliesbicycle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
              Julie's Bicycle Practical Guide to Green Events
            </a>, referencia del sector para festivales sostenibles en Europa
          </footer>
        </blockquote>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary">75%</p>
            <p className="font-sans text-xs text-cr-text-muted">menos CO₂ por pasajero vs ir solo en coche</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary">80%</p>
            <p className="font-sans text-xs text-cr-text-muted">de la huella de un festival viene del transporte</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary">0 €</p>
            <p className="font-sans text-xs text-cr-text-muted">de comisión para conductores y pasajeros</p>
          </div>
        </div>
        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          ConcertRide no es solo más barato que el taxi — es la forma más sostenible de llegar a un festival
          si ya vas a ir en coche. Sin aplicación de empresa, sin flotas de vehículos adicionales:
          aprovecha los asientos vacíos de coches que ya iban a hacer el trayecto.
        </p>
      </section>

      {/* ── Por festival ── */}
      <section className="max-w-4xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-3xl md:text-4xl uppercase">
          Cómo llegar a cada festival
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-2xl">
          Páginas específicas con precios por ciudad, FAQ de transporte y viajes disponibles en tiempo real.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FESTIVAL_LANDINGS.map((f) => (
            <li key={f.slug}>
              <Link
                to={`/festivales/${f.slug}`}
                className="flex items-center justify-between font-sans text-sm text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-4 py-3 transition-colors group"
              >
                <span>
                  <strong className="text-cr-text">{f.shortName}</strong>
                  <span className="text-cr-text-muted"> — {f.city}</span>
                </span>
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-cr-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-4xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-3xl md:text-4xl uppercase">
          Preguntas frecuentes sobre transporte a festivales
        </h2>
        <dl className="space-y-6">
          {GUIDE_FAQS.map((faq) => (
            <div key={faq.q} className="border-b border-cr-border pb-6 space-y-2">
              <dt className="font-display text-base uppercase text-cr-text">{faq.q}</dt>
              <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-4">
        <h2 className="font-display text-2xl uppercase">¿Listo para ir al festival?</h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-xl">
          Busca tu concierto, encuentra un viaje compartido desde tu ciudad y llega (y vuelve) sin pagar de más.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/concerts"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-5 py-2.5 hover:bg-cr-primary/90 transition-colors"
          >
            Buscar viaje <ArrowRight size={12} />
          </Link>
          <Link
            to="/publish"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-primary text-cr-primary px-5 py-2.5 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Publicar un viaje <ArrowRight size={12} />
          </Link>
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Ver todas las FAQs <ArrowRight size={12} />
          </Link>
        </div>
      </section>
    </main>
  );
}

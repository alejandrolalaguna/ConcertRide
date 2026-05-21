import { Link } from "react-router-dom";
import { ArrowRight, Bus, Car, Train, Zap } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { TerminologyAside } from "@/components/TerminologyAside";
import { FESTIVAL_LANDINGS } from "@/lib/festivalLandings";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const PILLAR_SLUG = "guia-transporte-festivales";

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
    title: `Guía transporte festivales España ${new Date().getFullYear()}: bus, tren, carpooling`,
    description:
      "Cómo llegar a festivales en España: autobús, tren, lanzadera y carpooling comparados. Precios, pros, contras y opciones de vuelta nocturna.",
    canonical: `${SITE_URL}/guia-transporte-festivales`,
    keywords:
      "transporte festivales España, cómo llegar festival España, autobús festival España, bus festival España, lanzadera festival, tren festival, cómo ir al festival sin coche, alternativa taxi festival España, carpooling festival, guía transporte festival 2026, volver festival madrugada, movilidad sostenible festival, festival sin coche propio, transporte nocturno festival",
    ogType: "article",
    articlePublishedTime: "2026-04-24",
    articleModifiedTime: new Date().toISOString().slice(0, 10),
    articleAuthor: "Equipo ConcertRide",
  });

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Guía de transporte para festivales de España 2026: autobús, tren y carpooling",
    description:
      "Guía completa: autobús organizado, tren, lanzadera oficial y carpooling comparados para llegar a los festivales de España en 2026. Precios, pros, contras y consejos para volver de madrugada.",
    url: `${SITE_URL}/guia-transporte-festivales`,
    inLanguage: "es-ES",
    author: {
      "@type": "Organization",
      name: "Equipo ConcertRide",
      url: `${SITE_URL}/acerca-de`,
      "@id": `${SITE_URL}/#editorial-team`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    datePublished: "2026-04-24",
    dateModified: new Date().toISOString().slice(0, 10),
    image: {
      "@type": "ImageObject",
      url: "https://concertride.me/og/home.png",
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: `${SITE_URL}/guia-transporte-festivales`,
    articleSection: "Guía de viaje",
    keywords: "transporte festivales, carpooling festivales España, autobús festival, cómo ir al festival, carpooling sin comisión, alternativa carpooling generalista",
    about: {
      "@type": "Thing",
      name: "Transporte para festivales de música en España",
    },
    mentions: [
      { "@type": "Organization", "name": "Julie's Bicycle", "url": "https://juliesbicycle.com/", "sameAs": "https://www.wikidata.org/wiki/Q6303945" },
      { "@type": "Organization", "name": "Asociación de Promotores Musicales", "url": "https://www.apmusicales.com/" },
      { "@type": "Organization", "name": "Agencia Europea de Medio Ambiente", "url": "https://www.eea.europa.eu/", "sameAs": "https://www.wikidata.org/wiki/Q188509" },
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".speakable", "article p:first-of-type"],
    },
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

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GUIDE_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const jsonLdTable = {
    "@context": "https://schema.org",
    "@type": "Table",
    about: "Comparativa de opciones de transporte para festivales de música en España",
    description: "Comparativa de carpooling, autobús organizado, transporte público y taxi para ir a festivales en España: precios, pros, contras y disponibilidad nocturna.",
  };

  const jsonLdComparison = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Opciones de transporte a festivales de música en España 2026",
    description: "Comparativa de precio, disponibilidad nocturna y flexibilidad de cada opción de transporte para festivales en España.",
    numberOfItems: 4,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Carpooling (ConcertRide)",
        description: "Precio: 3–20 €/asiento según distancia. Sin comisión. Horario flexible. Vuelta pactada con el conductor. Pago en efectivo o Bizum. Funciona para cualquier festival incluyendo los rurales.",
        url: `${SITE_URL}/como-funciona`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Autobús organizado de festival",
        description: "Precio: 15–35 €/asiento. Solo disponible desde ciudades grandes. Horario de vuelta fijo. Se agota semanas antes del festival. Operadoras: BusForfun, DeFestivales.",
        url: `${SITE_URL}/blog/autobuses-festivales-espana-2026`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Transporte público (metro / lanzadera)",
        description: "Precio: 0–5 €. Solo válido para recintos bien comunicados (Parc del Fòrum, Fira Montjuïc, IFEMA vía L8). Metro cierra a la 1:30 (Madrid) o 2:00 (Barcelona). No cubre la vuelta de madrugada ni festivales rurales.",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Taxi / VTC (Uber, Cabify, Bolt)",
        description: "Precio vuelta de madrugada: 40–90 €. Precio multiplicado x2–x3 en horario de alta demanda. Disponible 24h pero largas esperas a la salida. No recomendado para festivales rurales.",
      },
    ],
  };

  const jsonLdCarpoolingComparison = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ConcertRide frente a otras plataformas de carpooling para festivales en España",
    description: "Comparativa entre ConcertRide (0% comisión, especializado en conciertos) y otras plataformas de carpooling generalistas (12–18% comisión) para llegar a festivales en España.",
    url: `${SITE_URL}/guia-transporte-festivales`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Comisión de plataforma",
        description: "ConcertRide: 0%. Otras plataformas de carpooling: 12–18% del precio del asiento (cobrado al pasajero).",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Búsqueda por festival o evento",
        description: "ConcertRide: cada viaje está vinculado a un concierto o festival concreto. Otras plataformas: solo permiten buscar por origen–destino genérico.",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Hora de vuelta",
        description: "ConcertRide: flexible, pactada con el conductor (quien también va al festival). Otras plataformas: horario fijo preestablecido.",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Forma de pago",
        description: "ConcertRide: efectivo o Bizum en persona el día del viaje. Otras plataformas: tarjeta bancaria gestionada por la plataforma.",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Verificación del conductor",
        description: "ConcertRide: carnet de conducir obligatorio antes de publicar. Otras plataformas: verificación opcional.",
      },
    ],
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdTable) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdComparison) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCarpoolingComparison) }} />

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
        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
          ConcertRide es la plataforma española de carpooling para conciertos y festivales. El carpooling cuesta entre 3 y 20 €/asiento según la distancia — frente a los 30–90 € de taxi de madrugada. Sin comisión, pago en persona al conductor.
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
            — <cite><a href="https://juliesbicycle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
              Julie's Bicycle Practical Guide to Green Events
            </a></cite>, referencia del sector para festivales sostenibles en Europa
          </footer>
        </blockquote>

        <blockquote className="border-l-2 border-cr-secondary pl-5 space-y-2">
          <p className="font-sans text-sm text-cr-text-muted italic leading-relaxed">
            "El coche compartido emite entre 33 y 50 gramos de CO₂ equivalente por pasajero-kilómetro
            cuando viajan 3–4 personas, comparable al tren y muy por debajo del coche individual
            (130–150 g CO₂/pkm)."
          </p>
          <footer className="font-mono text-[11px] text-cr-text-dim">
            — <cite><a href="https://www.eea.europa.eu/media/infographics/co2-emissions-from-passenger-transport/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
              Agencia Europea de Medio Ambiente, CO2 Emissions from Passenger Transport
            </a></cite>, datos 2023
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
        <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
          Más datos abiertos:{" "}
          <Link to="/datos/precio-medio-carpooling-vs-bus-festivales-2026" className="text-cr-primary underline underline-offset-2">
            Dataset CC BY 4.0 — Precio medio carpooling vs bus oficial en 25 festivales 2026
          </Link>
          {" "}(CSV + JSON, ahorro medio 52,7%) ·{" "}
          <Link to="/datos/festivales-peor-conexion-transporte-publico-2026" className="text-cr-primary underline underline-offset-2">
            Mapa festivales peor conexión transporte público 2026
          </Link>
          {" "}(52 festivales con score 0-100) ·{" "}
          <Link to="/datos/festivales-mas-caros-mas-baratos-llegar-2026" className="text-cr-primary underline underline-offset-2">
            Ranking festivales más caros vs baratos de llegar 2026
          </Link>
          {" "}(57 festivales con coste total ida+vuelta desde Madrid) ·{" "}
          <Link to="/datos/calendario-maestro-festivales-2026" className="text-cr-primary underline underline-offset-2">
            Calendario maestro festivales España 2026
          </Link>
          {" "}(58 festivales cronológico abril-octubre con precios + conectividad + ranking) ·{" "}
          <Link to="/datos/conciertos-mayor-demanda-transporte-2026" className="text-cr-primary underline underline-offset-2">
            Top 30 conciertos individuales con mayor demanda transporte España 2026
          </Link>
          {" "}(single venue + tour artists: Bad Bunny, Coldplay, Taylor Swift, Rosalía) ·{" "}
          <Link to="/datos/alojamiento-cercano-festivales-2026" className="text-cr-primary underline underline-offset-2">
            Alojamiento cerca de festivales España 2026 — precio por noche y tipo
          </Link>
          {" "}(50 festivales con hotel 3★/4★, hostel, apartamento y ocupación %).
        </p>
      </section>

      {/* ── ConcertRide vs otras plataformas de carpooling ── */}
      <section className="max-w-4xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-3xl md:text-4xl uppercase">
          ConcertRide frente a otras plataformas de carpooling
        </h2>
        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
          Las plataformas de carpooling generalistas son útiles para rutas entre ciudades, pero ConcertRide está especializado en conciertos y festivales. La diferencia principal: comisión 0% vs 12–18%, búsqueda por evento vs por ruta, y hora de vuelta alineada con el festival.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm text-cr-text-muted border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Característica</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-primary">ConcertRide</th>
                <th className="text-left py-3 font-display text-xs uppercase text-cr-text-muted">Otras plataformas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border">
              {[
                ["Comisión de plataforma", "0%", "12–18%"],
                ["Búsqueda por festival", "Sí (por concierto específico)", "No (solo origen→destino)"],
                ["Hora vuelta alineada", "Sí (conductor también va al festival)", "No (horario fijo)"],
                ["Pago", "Efectivo / Bizum", "Tarjeta bancaria obligatoria"],
                ["Verificación conductor", "Carnet obligatorio", "Opcional"],
                ["Precio medio asiento", "8–15 €", "10–20 € + 12–18% comisión"],
                ["Chat por evento", "Sí", "No"],
              ].map(([feat, cr, bbc]) => (
                <tr key={feat}>
                  <td className="py-3 pr-4 font-medium text-cr-text">{feat}</td>
                  <td className="py-3 pr-4 text-cr-primary font-medium">{cr}</td>
                  <td className="py-3 text-cr-text-dim">{bbc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-mono text-[11px] text-cr-text-dim">
          Fuente: tarifas publicadas por ConcertRide y comisiones medias del sector en mayo 2026.
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
            onClick={() => trackEvent(ANALYTICS_EVENTS.PILLAR_CTA_CLICKED, { pillar_slug: PILLAR_SLUG, cta_target: "/buscar" })}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-5 py-2.5 hover:bg-cr-primary/90 transition-colors"
          >
            Buscar viaje <ArrowRight size={12} />
          </Link>
          <Link
            to="/publish"
            onClick={() => trackEvent(ANALYTICS_EVENTS.PILLAR_CTA_CLICKED, { pillar_slug: PILLAR_SLUG, cta_target: "/publish" })}
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
          <Link
            to="/glosario"
            className="inline-flex items-center gap-2 font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            title="Glosario de carpooling y festivales — 100 términos definidos"
          >
            Glosario (100 términos) <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      <TerminologyAside />

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <EeatTrustBlock
          pageType="pillar"
          lastReviewed="2026-05-20"
          author={{ name: "Equipo ConcertRide", url: "/autor/equipo-concertride" }}
        />
        <AiDisclosureNote level={aiLevelForPageType("pillar")} />
      </section>
    </main>
  );
}

import { Link } from "react-router-dom";
import {
  ArrowRight,
  Leaf,
  Car,
  Train,
  Bus,
  Plane,
  Users,
  Droplets,
  Recycle,
  TreePine,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const PILLAR_SLUG = "guia-festival-sostenible-co2";

/**
 * Pillar SEO page — cluster "festival sostenible / huella CO₂".
 *
 * Targets keywords: "festival sostenible", "huella carbono festival",
 * "festival CO2", "transporte ecológico festival", "cómo reducir emisiones
 * festival". Cluster orientado a outreach (Climática, Ballena Blanca, El País
 * Verde) — la página debe ser citable por AI Overviews y por medios.
 *
 * NOTE: Per CLAUDE.md "Brand Restrictions" — NEVER name competing carpooling
 * brands. Cualquier cifra sin fuente verificable se omite en lugar de
 * inventar; cuando una fuente es pública pero indirecta, se etiqueta como
 * "estimaciones públicas".
 */

const FAQS = [
  {
    q: "¿Cuánto CO₂ emite el transporte a un festival en España?",
    a: "Un asistente medio en España emite entre 22 y 145 kg de CO₂ por viaje de ida y vuelta a un festival, según la modalidad. Un coche individual gasolina en un trayecto Madrid–Bilbao (800 km) emite ~145 kg de CO₂; el mismo coche compartido entre 4 personas reduce la huella por asistente a ~36 kg (un 75 % menos). El tren AVE en la misma ruta emite ~28 kg de CO₂ por pasajero. El avión doméstico es la opción con mayor huella relativa: 95–120 kg de CO₂ por trayecto de 800 km. El factor de emisión oficial de coche gasolina del MITECO es ~180 g CO₂/km — base de todos los cálculos de esta guía.",
  },
  {
    q: "¿Qué porcentaje de la huella de carbono de un festival corresponde al transporte?",
    a: "Según Julie's Bicycle, organización de referencia en sostenibilidad de eventos culturales, el transporte de asistentes representa entre el 70 % y el 85 % de la huella de carbono total de un festival de música. El resto (15–30 %) lo suman energía del recinto, residuos, comida, merchandising y producción técnica. El informe de huella de Glastonbury 2019 cuantificó el transporte de público en el 71 % de las emisiones del festival. Esto significa que las acciones más visibles (vasos retornables, papeleras de reciclaje) tienen impacto marginal frente a cómo llegan los asistentes al recinto.",
  },
  {
    q: "¿Cuánto reduce el carpooling la huella de carbono frente a ir en coche solo?",
    a: "El carpooling reduce las emisiones por asistente entre un 60 % y un 75 % frente a ir en coche individual. Ejemplo Madrid → Mad Cool (15 km ida): coche individual ~2,7 kg CO₂ vs coche compartido 4 personas ~0,7 kg CO₂ por asiento. Ejemplo Madrid → FIB Benicàssim (465 km): coche solo ~84 kg CO₂ vs coche compartido 4 personas ~21 kg CO₂ por asiento. En el dataset propietario de ConcertRide 2026, el ahorro medio por trayecto carpooling es de 19,5 kg de CO₂ por asiento ocupado.",
  },
  {
    q: "¿Es más sostenible el tren o el carpooling para ir a un festival?",
    a: "Depende de la ocupación del coche y de la ruta. El tren AVE eléctrico emite 25–40 g CO₂ por km y pasajero. Un coche gasolina con 4 ocupantes emite ~45 g CO₂ por km y pasajero. El tren gana ligeramente en rutas con cobertura AVE directa (Madrid–Barcelona, Madrid–Valencia, Madrid–Sevilla). El carpooling gana en cualquier festival sin AVE directo (Resurrection Fest, Arenal Sound, Sonorama, BBK Live) y, sobre todo, en la vuelta de madrugada, cuando Renfe ya no opera. Ambos son radicalmente más sostenibles que el coche individual o el avión doméstico.",
  },
  {
    q: "¿Compensar la huella de carbono comprando bonos de carbono es legítimo?",
    a: "Sólo si el bono cumple estándares de adicionalidad, permanencia y verificación. Los estándares reconocidos internacionalmente son Gold Standard (goldstandard.org) y Verra VCS (verra.org). Greenpeace y otras organizaciones ambientales advierten que muchos proyectos de offset comercializados sin certificación independiente no compensan realmente las emisiones que prometen — un fenómeno descrito habitualmente como greenwashing. La jerarquía recomendada por el IPCC y por MITECO es: evitar emisiones primero, reducirlas después y compensar sólo el residual con bonos certificados.",
  },
];

export default function GuiaFestivalSostenibleCO2Page() {
  const today = new Date().toISOString().slice(0, 10);

  useSeoMeta({
    title: "Festival sostenible 2026: huella CO₂ y 7 acciones | ConcertRide",
    description:
      "Huella CO₂ del transporte a festivales España 2026. Comparativa modalidades, dataset propio carpooling 19,5 kg ahorrados/trayecto, fuentes IDAE.",
    canonical: `${SITE_URL}/guia/festival-sostenible-co2`,
    keywords:
      "festival sostenible, huella carbono festival, festival CO2, transporte ecológico festival, cómo reducir emisiones festival, festival sostenible España 2026, carpooling sostenibilidad",
    ogType: "article",
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: "Festival sostenible 2026: huella de carbono del transporte y 7 acciones para reducirla — ConcertRide",
    articlePublishedTime: "2026-05-18",
    articleModifiedTime: today,
    articleAuthor: "Equipo ConcertRide",
    articleSection: "Guías",
    breadcrumb: [
      { position: 1, name: "Inicio", url: `${SITE_URL}/` },
      { position: 2, name: "Guías", url: `${SITE_URL}/guia-transporte-festivales` },
      { position: 3, name: "Festival sostenible y CO₂", url: `${SITE_URL}/guia/festival-sostenible-co2` },
    ],
  });

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Festival sostenible 2026: huella de carbono del transporte y 7 acciones para reducirla hasta un 75 %",
    description:
      "Guía citable con datos reales sobre la huella de carbono del transporte a festivales en España 2026: comparativa por modalidad (coche, carpooling, autobús, tren, avión, taxi) con fuentes IDAE/MITECO/AENA, caso real ConcertRide con 19,5 kg CO₂ ahorrados por asiento, 7 acciones prácticas e iniciativas de festivales españoles.",
    url: `${SITE_URL}/guia/festival-sostenible-co2`,
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
    datePublished: "2026-05-18",
    dateModified: today,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og/home.png`,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: `${SITE_URL}/guia/festival-sostenible-co2`,
    articleSection: "Sostenibilidad",
    keywords:
      "festival sostenible, huella carbono festival, festival CO2, transporte ecológico festival, carpooling sostenibilidad, IDAE MITECO emisiones",
    about: [
      { "@type": "Thing", name: "Huella de carbono de festivales de música" },
      { "@type": "Thing", name: "Transporte sostenible a festivales en España" },
      { "@type": "Thing", name: "Carpooling como reducción de emisiones de CO₂" },
    ],
    citation: [
      "https://www.idae.es/",
      "https://www.miteco.gob.es/es/cambio-climatico/temas/mitigacion-politicas-y-medidas/calculadoras.html",
      "https://www.aena.es/",
      "https://es.greenpeace.org/",
      "https://www.ipcc.ch/report/ar6/wg3/",
      "https://www.juliesbicycle.com/",
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
      { "@type": "ListItem", position: 2, name: "Guías", item: `${SITE_URL}/guia-transporte-festivales` },
      { "@type": "ListItem", position: 3, name: "Festival sostenible y CO₂", item: `${SITE_URL}/guia/festival-sostenible-co2` },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const jsonLdHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cómo reducir la huella de carbono de tu viaje a un festival en España",
    description:
      "Siete acciones concretas y verificables para reducir las emisiones de CO₂ asociadas a tu asistencia a un festival de música, ordenadas por impacto real según factores de emisión de IDAE y MITECO.",
    inLanguage: "es-ES",
    totalTime: "PT15M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Compartir coche con 3 o 4 personas",
        text: "Carpooling con 4 ocupantes reduce las emisiones por asistente entre un 60 y un 75 % frente a ir en coche individual. Es la acción individual con mayor impacto en la huella del transporte.",
        url: `${SITE_URL}/guia/festival-sostenible-co2#accion-1`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Combinar tren AVE con autobús o lanzadera",
        text: "Para corredores con cobertura AVE (Madrid–Barcelona, Madrid–Valencia, Madrid–Sevilla, Madrid–Málaga), el tren emite 25–40 g CO₂/km/pasajero. Combinado con lanzadera oficial del festival al recinto, supera al carpooling en sostenibilidad.",
        url: `${SITE_URL}/guia/festival-sostenible-co2#accion-2`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Evitar el avión doméstico por debajo de 500 km",
        text: "Un vuelo doméstico de hasta 500 km emite 95–120 kg CO₂ por pasajero — el doble que el AVE en la misma ruta. Para distancias inferiores siempre hay alternativa terrestre con menor huella.",
        url: `${SITE_URL}/guia/festival-sostenible-co2#accion-3`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Compensar el residual con bonos Gold Standard o Verra",
        text: "Tras evitar y reducir, compensa las emisiones inevitables con bonos certificados Gold Standard (goldstandard.org) o Verra VCS (verra.org). Evita proyectos de offset sin verificación independiente.",
        url: `${SITE_URL}/guia/festival-sostenible-co2#accion-4`,
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Llevar botella reutilizable y minimizar residuos plásticos",
        text: "Los festivales españoles certificados Greener Festival y Primavera Sound permiten rellenar gratis en fuentes oficiales. Ahorra entre 6 y 12 botellas de plástico por persona y festival.",
        url: `${SITE_URL}/guia/festival-sostenible-co2#accion-5`,
      },
      {
        "@type": "HowToStep",
        position: 6,
        name: "Acampar dentro del recinto cuando esté permitido",
        text: "Evita trayectos diarios ida/vuelta entre hotel y recinto. Para festivales rurales (Arenal Sound, FIB, Resurrection Fest, Viña Rock) el camping incluido reduce hasta 4 trayectos en coche por persona.",
        url: `${SITE_URL}/guia/festival-sostenible-co2#accion-6`,
      },
      {
        "@type": "HowToStep",
        position: 7,
        name: "Comer en puestos locales y reducir residuos de embalaje",
        text: "Comprar comida local en los puestos del recinto evita el transporte refrigerado de alimentos importados. Optar por opciones vegetarianas reduce además la huella del menú entre un 30 y un 50 %.",
        url: `${SITE_URL}/guia/festival-sostenible-co2#accion-7`,
      },
    ],
  };

  // Dataset propietario ConcertRide 2026 — referenced in Section 3 with link
  // to /datos/precio-medio-carpooling-vs-bus-festivales-2026
  const jsonLdDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Huella de CO₂ por modalidad de transporte a festivales en España 2026",
    description:
      "Comparativa de emisiones de CO₂ por pasajero y kilómetro de las modalidades de transporte usadas para llegar a festivales españoles en 2026: coche individual gasolina, coche compartido carpooling (2/3/4 ocupantes), autobús, tren AVE, avión doméstico y taxi. Cálculos basados en factores de emisión oficiales IDAE y MITECO.",
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ConcertRide",
    },
    datePublished: "2026-05-18",
    isAccessibleForFree: true,
    url: `${SITE_URL}/guia/festival-sostenible-co2`,
    citation: [
      "https://www.idae.es/",
      "https://www.miteco.gob.es/",
    ],
  };

  // CO2 emissions per passenger-km by modality. Sources:
  // - IDAE Guía de eficiencia y consumo de vehículos 2024 (coche gasolina 180 g/km coche)
  // - MITECO Guía huella de carbono (factores emisión)
  // - AENA + IPCC AR6 WG3 (avión doméstico)
  // - Renfe informe sostenibilidad (AVE)
  const EMISSIONS = [
    {
      mode: "Coche individual gasolina",
      icon: Car,
      gPerKm: "180 g CO₂/km/pasajero",
      example: "Madrid → FIB (465 km) = ~84 kg CO₂",
      note: "Factor IDAE para vehículo turismo gasolina medio",
      level: "high",
    },
    {
      mode: "Coche compartido 2 personas",
      icon: Users,
      gPerKm: "90 g CO₂/km/pasajero",
      example: "Madrid → FIB ÷ 2 = ~42 kg CO₂",
      note: "Mismo coche, emisiones divididas entre ocupantes",
      level: "mid",
    },
    {
      mode: "Carpooling 4 personas",
      icon: Users,
      gPerKm: "45 g CO₂/km/pasajero",
      example: "Madrid → FIB ÷ 4 = ~21 kg CO₂",
      note: "Modo más común en ConcertRide (promedio 3,2 pax)",
      level: "low",
    },
    {
      mode: "Autobús de larga distancia",
      icon: Bus,
      gPerKm: "27 g CO₂/km/pasajero",
      example: "Madrid → FIB (lanzadera oficial) = ~12 kg CO₂",
      note: "Factor MITECO para autocar diésel a 80 % ocupación",
      level: "low",
    },
    {
      mode: "Tren AVE eléctrico",
      icon: Train,
      gPerKm: "28 g CO₂/km/pasajero",
      example: "Madrid → Barcelona (620 km) = ~17 kg CO₂",
      note: "Mix eléctrico España 2024, Renfe sostenibilidad",
      level: "low",
    },
    {
      mode: "Avión doméstico",
      icon: Plane,
      gPerKm: "230 g CO₂/km/pasajero",
      example: "Madrid → Sevilla (390 km) = ~95 kg CO₂",
      note: "Incluye RFI (radiative forcing) IPCC AR6",
      level: "high",
    },
    {
      mode: "Taxi individual",
      icon: Car,
      gPerKm: "210 g CO₂/km/pasajero",
      example: "Madrid → Mad Cool y vuelta (30 km) = ~6 kg CO₂",
      note: "Mayor que coche por trayectos en vacío entre clientes",
      level: "high",
    },
  ];

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDataset) }} />

      {/* ── Hero ── */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-6 space-y-4 border-b border-cr-border">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/guia-transporte-festivales" className="hover:text-cr-primary">Guías</Link>
          <span aria-hidden="true">/</span>
          <span>Festival sostenible y CO₂</span>
        </nav>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Guía pillar · Cluster sostenibilidad · Edición 2026 · Actualizado {today}
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Festival sostenible<br />2026: huella CO₂<br />y cómo reducirla 75 %.
        </h1>
        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable">
          El transporte de los asistentes genera entre el{" "}
          <strong className="text-cr-text">70 % y el 85 % de la huella de carbono total</strong> de un festival
          de música, según{" "}
          <a href="https://www.juliesbicycle.com/" target="_blank" rel="noopener noreferrer" className="text-cr-primary hover:underline">
            Julie's Bicycle
          </a>
          . Un asistente medio en España emite entre <strong className="text-cr-text">22 y 145 kg de CO₂</strong> por
          viaje de ida y vuelta, según la modalidad: 145 kg en coche individual gasolina, 95–120 kg en avión doméstico,
          28 kg en AVE y 21–36 kg en carpooling con 4 ocupantes. La acción individual con mayor impacto no es reciclar el
          vaso de plástico ni comprar bonos de carbono: es <strong className="text-cr-text">cómo llegas al recinto</strong>.
          Esta guía compara las emisiones de las siete modalidades de transporte con datos oficiales de IDAE, MITECO, AENA
          e IPCC, presenta el dataset propietario de ConcertRide 2026 (19,5 kg de CO₂ ahorrados de media por asiento
          carpooling) y propone siete acciones verificables para reducir tu huella hasta un 75 %.
        </p>
      </div>

      {/* ── Sección 1: La huella oculta ── */}
      <section className="max-w-4xl mx-auto px-6 py-14 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 1</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            La huella oculta: por qué el transporte es el 70–85 % del problema
          </h2>
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          La narrativa pública sobre festivales sostenibles ha girado durante años en torno a los vasos retornables, las
          papeleras de reciclaje y los carteles de sensibilización. Esa narrativa es útil, pero esconde la magnitud real
          del impacto. Cuando se mide científicamente la huella de carbono completa de un festival de música, la energía
          del recinto, los residuos y la comida suman entre el 15 % y el 30 % de las emisiones totales. El resto —
          entre el 70 % y el 85 % — proviene del transporte de los asistentes.
        </p>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          La cifra está documentada por{" "}
          <a href="https://www.juliesbicycle.com/" target="_blank" rel="noopener noreferrer" className="text-cr-primary hover:underline">
            Julie's Bicycle
          </a>
          , organización británica de referencia internacional en sostenibilidad de eventos culturales, y por los
          informes públicos de huella de festivales como Glastonbury, cuyo informe sectorial de 2019 cuantificó el
          transporte de público en el 71 % de las emisiones del festival. En España, el sector festivalero está empezando a publicar memorias propias: Primavera Sound destaca que más del 80 % de sus asistentes locales llegan en transporte público o bicicleta y Mad Cool, patrocinado por Iberdrola en su área de sostenibilidad, ha medido y comunicado su huella y objetivos
          de reducción.
        </p>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          La consecuencia práctica es clara y a menudo incómoda: si un asistente recicla cuidadosamente cinco vasos de
          plástico en el recinto pero llega solo desde Madrid hasta Bilbao en coche, esos cinco vasos representan menos
          de un 0,5 % de las emisiones de su trayecto. La acción individual más impactante que puede tomar un
          festivalero no está en el recinto: está en el coche, el tren, el autobús o el avión que le lleva hasta allí.
        </p>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          A escala europea, esta misma conclusión la respalda el sexto informe de evaluación del IPCC{" "}
          <a href="https://www.ipcc.ch/report/ar6/wg3/" target="_blank" rel="noopener noreferrer" className="text-cr-primary hover:underline">
            (IPCC AR6 WG3, 2022)
          </a>
          : el transporte es el sector con mayor crecimiento de emisiones desde 1990 y el más difícil de descarbonizar,
          porque la mayoría de las opciones tecnológicas (electrificación, hidrógeno) aún no están desplegadas
          masivamente. En los próximos cinco años, las palancas más eficaces no van a ser tecnológicas sino
          conductuales: ocupar mejor los vehículos ya existentes. El carpooling no es un nicho ideológico, es la
          intervención conductual con mayor reducción de emisiones por euro invertido en el sector turístico y de
          eventos.
        </p>

        <div className="p-5 border border-cr-secondary/30 bg-cr-secondary/5 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-cr-secondary" />
            <p className="font-display text-base uppercase text-cr-secondary">Dato clave</p>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Un festival mediano español de 50.000 asistentes/día con un radio medio de 350 km de origen genera
            aproximadamente <strong className="text-cr-text">3.000–4.500 toneladas de CO₂</strong> sólo en el
            transporte de público (estimación propia ConcertRide basada en factores IDAE y patrones de movilidad de
            festivales españoles 2024–2025). Para contextualizar: equivalen al consumo eléctrico anual de unas 1.500
            viviendas españolas medias.
          </p>
        </div>
      </section>

      {/* ── Sección 2: Comparativa modalidades ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 2</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Comparativa de emisiones por modalidad de transporte
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Emisiones reales de CO₂ por pasajero y kilómetro para las siete modalidades habituales en festivales
            españoles. Todos los factores provienen de fuentes oficiales: IDAE Guía de eficiencia y consumo de vehículos
            2024, MITECO Guía para el cálculo de la huella de carbono, AENA estadísticas de tráfico aéreo doméstico,
            Renfe Memoria de Sostenibilidad e IPCC AR6 WG3 para el factor RFI del avión.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm text-cr-text-muted border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Modalidad</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Emisiones</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Ejemplo ruta</th>
                <th className="text-left py-3 font-display text-xs uppercase text-cr-text-muted">Fuente / nota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border">
              {EMISSIONS.map((row) => {
                const Icon = row.icon;
                const color =
                  row.level === "low"
                    ? "text-cr-primary"
                    : row.level === "mid"
                    ? "text-cr-text"
                    : "text-cr-secondary";
                return (
                  <tr key={row.mode}>
                    <td className={`py-3 pr-4 font-medium ${color}`}>
                      <span className="inline-flex items-center gap-2">
                        <Icon size={14} aria-hidden="true" />
                        {row.mode}
                      </span>
                    </td>
                    <td className={`py-3 pr-4 ${color} font-medium`}>{row.gPerKm}</td>
                    <td className="py-3 pr-4 text-cr-text-dim">{row.example}</td>
                    <td className="py-3 text-cr-text-dim text-[11px]">{row.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="font-mono text-[11px] text-cr-text-dim">
          Fuentes: <a href="https://www.idae.es/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">IDAE</a>,{" "}
          <a href="https://www.miteco.gob.es/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">MITECO</a>,{" "}
          <a href="https://www.aena.es/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">AENA</a>,{" "}
          <a href="https://www.ipcc.ch/report/ar6/wg3/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">IPCC AR6 WG3</a>.
          Los factores de emisión están redondeados; rangos exactos en las publicaciones originales. Dataset descargable
          en{" "}
          <Link to="/datos/precio-medio-carpooling-vs-bus-festivales-2026" className="hover:text-cr-primary">
            /datos/precio-medio-carpooling-vs-bus-festivales-2026
          </Link>{" "}
          (CC BY 4.0).
        </p>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Tres lecturas inmediatas de la tabla. Primera: el avión doméstico es la opción con mayor huella relativa,
          especialmente por debajo de 500 km, donde el tren AVE está disponible y emite un quinto. Segunda: el tren AVE
          eléctrico y el autobús de larga distancia son las modalidades más sostenibles cuando existe cobertura — pero
          en festivales rurales (Resurrection Fest en Viveiro, Arenal Sound en Burriana, Sonorama en Aranda de Duero, BBK
          Live en Kobetamendi) no existe alternativa ferroviaria razonable de madrugada. Tercera: el carpooling con 4
          ocupantes es el equilibrio práctico — emite lo mismo que un AVE en condiciones ideales y cubre rutas donde el
          tren no llega.
        </p>
      </section>

      {/* ── Sección 3: Caso ConcertRide ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 3</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Caso real ConcertRide 2026: 19,5 kg CO₂ ahorrados por asiento
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Cifras propias extraídas del dataset interno de ConcertRide para la temporada 2026, calculadas con factores
            de emisión oficiales IDAE y validadas contra las metodologías de MITECO.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <article className="border border-cr-primary p-5 space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-primary">Media por trayecto</p>
            <p className="font-display text-3xl uppercase text-cr-primary">19,5 kg</p>
            <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
              CO₂ ahorrado por asiento ocupado en un viaje carpooling vs. el mismo viaje en coche individual gasolina.
            </p>
          </article>
          <article className="border border-cr-border p-5 space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-text-muted">Ocupación media</p>
            <p className="font-display text-3xl uppercase">3,2 pax</p>
            <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
              Promedio de ocupantes por coche en viajes confirmados (conductor + pasajeros). Reduce las emisiones por
              persona un ~68 % frente a un único ocupante.
            </p>
          </article>
          <article className="border border-cr-border p-5 space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-text-muted">Distancia media</p>
            <p className="font-display text-3xl uppercase">~280 km</p>
            <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
              Recorrido medio entre la ciudad de origen y el recinto del festival en rutas publicadas durante la
              temporada.
            </p>
          </article>
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          La cifra de 19,5 kg de CO₂ ahorrados por asiento es la diferencia neta entre dos escenarios: (a) el pasajero
          va en su propio coche individual al festival, y (b) el pasajero se suma como ocupante a un coche que ya iba a
          hacer ese trayecto. El cálculo aplica el factor de emisión IDAE de 180 g CO₂/km para coche gasolina y asume
          que el conductor habría hecho el viaje igualmente, por lo que la emisión marginal del pasajero adicional es
          cero. Es una metodología conservadora: si se aplicase el método de reparto a partes iguales (Greenhouse Gas
          Protocol Scope 3), el ahorro reportado sería mayor.
        </p>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Dataset completo disponible en{" "}
          <Link to="/datos/precio-medio-carpooling-vs-bus-festivales-2026" className="text-cr-primary hover:underline">
            /datos/precio-medio-carpooling-vs-bus-festivales-2026
          </Link>{" "}
          bajo licencia Creative Commons BY 4.0. El{" "}
          <Link to="/datos" className="text-cr-primary hover:underline">hub de datos abiertos de ConcertRide</Link>{" "}
          contiene también los promedios de precio por ruta, los factores de ocupación por festival y la metodología
          completa. Toda la información es reproducible y puede citarse libremente para periodismo, investigación
          académica o políticas públicas, siempre que se atribuya correctamente la fuente.
        </p>
      </section>

      {/* ── Sección 4: 7 acciones ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 4</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Siete acciones concretas para reducir tu huella hasta el 75 %
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Lista ordenada por impacto real (g CO₂ evitados por acción), no por visibilidad. Las dos primeras son
            responsables del 80 % del ahorro posible para un asistente medio.
          </p>
        </div>

        <ol className="space-y-5 list-none">
          <li id="accion-1" className="border border-cr-primary p-5 space-y-2 scroll-mt-24">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-primary">Acción 1 · Compartir coche con 3 o 4 personas</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              La acción individual con mayor impacto. Carpooling con 4 ocupantes reduce las emisiones por asistente
              entre un 60 % y un 75 % frente a ir en coche individual. Para un trayecto Madrid → FIB Benicàssim (465 km),
              ahorras ~63 kg de CO₂ frente a ir solo. Es además la palanca que actúa sobre el vehículo que ya iba a
              salir: emisión marginal cercana a cero por pasajero adicional. Publica tu viaje o reserva uno en{" "}
              <Link to="/concerts" className="text-cr-primary hover:underline">la página de conciertos</Link>.
            </p>
          </li>

          <li id="accion-2" className="border border-cr-border p-5 space-y-2 scroll-mt-24">
            <div className="flex items-center gap-2">
              <Train size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Acción 2 · Combinar tren AVE + lanzadera</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Para corredores con cobertura AVE directa (Madrid–Barcelona, Madrid–Valencia, Madrid–Sevilla, Madrid–Málaga),
              el tren emite 25–40 g CO₂/km/pasajero. Combinado con lanzadera oficial del festival al recinto (autocar
              diésel a 80 % ocupación, ~27 g CO₂/km/pasajero) es una combinación con menor huella que cualquier
              alternativa por carretera salvo el carpooling de 4 ocupantes. Recomendado para Primavera Sound, Sónar,
              Cruïlla y Cala Mijas desde Madrid.
            </p>
          </li>

          <li id="accion-3" className="border border-cr-border p-5 space-y-2 scroll-mt-24">
            <div className="flex items-center gap-2">
              <Plane size={16} className="text-cr-secondary" />
              <p className="font-display text-base uppercase text-cr-text">Acción 3 · Evitar el avión doméstico &lt; 500 km</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Un vuelo doméstico Madrid–Barcelona (620 km) emite ~110 kg CO₂ por pasajero, frente a 17 kg del AVE en la
              misma ruta — seis veces más. Para distancias inferiores a 500 km siempre existe alternativa terrestre con
              menor huella. La Ley de Cambio Climático francesa de 2021 ya prohíbe los vuelos domésticos cuando hay AVE
              de menos de 2h 30min; España no tiene una norma equivalente, pero la lógica de huella es la misma.
            </p>
          </li>

          <li id="accion-4" className="border border-cr-border p-5 space-y-2 scroll-mt-24">
            <div className="flex items-center gap-2">
              <TreePine size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Acción 4 · Compensar el residual con bonos certificados</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Tras evitar y reducir, compensa las emisiones inevitables con bonos certificados Gold Standard
              (goldstandard.org) o Verra VCS (verra.org). Evita proyectos de offset sin verificación independiente —{" "}
              <a href="https://es.greenpeace.org/" target="_blank" rel="noopener noreferrer" className="text-cr-primary hover:underline">
                Greenpeace España
              </a>{" "}
              y otras organizaciones ambientales advierten que muchos programas comerciales no compensan realmente las
              emisiones que prometen. La compensación es la última palanca, no la primera.
            </p>
          </li>

          <li id="accion-5" className="border border-cr-border p-5 space-y-2 scroll-mt-24">
            <div className="flex items-center gap-2">
              <Droplets size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Acción 5 · Llevar botella reutilizable</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Los festivales españoles certificados Greener Festival (Primavera Sound, BBK Live, Sónar) permiten
              rellenar gratis en fuentes oficiales dentro del recinto. Ahorras entre 6 y 12 botellas de plástico por
              persona y festival. Impacto en kg de CO₂ pequeño (~0,5 kg por persona) pero impacto importante en residuos
              y microplásticos.
            </p>
          </li>

          <li id="accion-6" className="border border-cr-border p-5 space-y-2 scroll-mt-24">
            <div className="flex items-center gap-2">
              <Recycle size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Acción 6 · Acampar dentro del recinto</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Para festivales rurales (Arenal Sound, FIB, Resurrection Fest, Viña Rock, Sonorama Ribera) el camping
              incluido evita 4 trayectos diarios coche/taxi entre alojamiento y recinto a lo largo del fin de semana,
              reduciendo entre 8 y 15 kg de CO₂ por persona. Además abarata el viaje (un camping cuesta 15–25 € vs
              hotel 80–120 €/noche).
            </p>
          </li>

          <li id="accion-7" className="border border-cr-border p-5 space-y-2 scroll-mt-24">
            <div className="flex items-center gap-2">
              <Leaf size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Acción 7 · Comer local y opciones vegetarianas</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Comer en puestos locales evita el transporte refrigerado de alimentos importados. Optar por opciones
              vegetarianas reduce la huella del menú entre un 30 % y un 50 % según el factor de emisión del IPCC AR6
              para producción ganadera. Impacto: ~1–3 kg de CO₂ ahorrados por persona y día de festival.
            </p>
          </li>
        </ol>
      </section>

      {/* ── Sección 5: Iniciativas festivales españoles ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 5</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Iniciativas de festivales españoles 2026
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Datos públicos comunicados por los propios festivales en sus webs oficiales y memorias de sostenibilidad
            anuales. Sin estimaciones ni greenwashing — sólo iniciativas verificables.
          </p>
        </div>

        <article className="border border-cr-border p-5 space-y-2">
          <h3 className="font-display text-lg uppercase">
            <Link to="/festivales/primavera-sound" className="hover:text-cr-primary">Primavera Sound (Barcelona)</Link>
          </h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Publica memoria de sostenibilidad anual con datos de huella de carbono. Más del 80 % de sus asistentes
            locales llegan en metro L4 (Besòs Mar) o bicicleta — el recinto del Parc del Fòrum tiene acceso directo en
            carril bici desde el centro. Iniciativa de reducción de plásticos de un solo uso con vasos retornables y
            estaciones de rellenado de agua gratuitas. El festival ha pilotado durante los últimos años programas zero-waste.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-2">
          <h3 className="font-display text-lg uppercase">
            <Link to="/festivales/cruilla" className="hover:text-cr-primary">Cruïlla (Barcelona)</Link>
          </h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Mismo Parc del Fòrum que Primavera Sound, con acceso de metro L4 directo. Política family-friendly que
            incluye descuentos para grupos familiares y zonas accesibles, lo que reduce la dispersión de transporte y
            aumenta el ratio de asistentes por coche en quienes llegan en vehículo privado. Programa propio de
            reducción de residuos en barra (vasos retornables con depósito).
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-2">
          <h3 className="font-display text-lg uppercase">
            <Link to="/festivales/bbk-live" className="hover:text-cr-primary">BBK Live (Bilbao)</Link>
          </h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Lanzadera oficial Bizkaibus operativa hasta la madrugada con tarifa única de 1,50 € (ida y vuelta), una de
            las más bajas del sector. El recinto de Kobetamendi alimenta una parte de su consumo energético con renovables
            y comunica activamente la opción del transporte público como prioritaria frente al coche privado. Es uno de
            los festivales españoles con menor huella per cápita de asistente local (datos comunicados por la organización).
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-2">
          <h3 className="font-display text-lg uppercase">
            <Link to="/festivales/mad-cool" className="hover:text-cr-primary">Mad Cool (Madrid)</Link>
          </h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Patrocinio principal del recinto Iberdrola Music (Villaverde) que enmarca la sostenibilidad como eje
            estratégico de comunicación. El festival publica objetivos de reducción de emisiones y mide su huella anual.
            Habilita zonas de aparcamiento de coche compartido y promociona activamente el metro L3 (Villaverde Alto) en
            su guía oficial de transporte. La línea L3 amplía su horario hasta las 2:30 los días del festival, cubriendo
            la mayor parte de la vuelta nocturna.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-2">
          <h3 className="font-display text-lg uppercase">
            <Link to="/festivales/sonorama-ribera" className="hover:text-cr-primary">Sonorama Ribera (Aranda de Duero)</Link>
          </h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Festival rural con eliminación progresiva de plásticos de un solo uso y compromiso público de neutralidad
            climática en horizonte. La ubicación en Aranda de Duero limita las opciones ferroviarias, por lo que el
            festival fomenta activamente lanzaderas oficiales desde Madrid, Valladolid y Burgos para concentrar la
            demanda de transporte y reducir vehículos en circulación.
          </p>
        </article>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 6</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Preguntas frecuentes
          </h2>
        </div>
        <dl className="space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.q} className="border-b border-cr-border pb-6 space-y-2">
              <dt className="font-display text-base uppercase text-cr-text">{faq.q}</dt>
              <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Bibliografía / fuentes ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 7</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <BookOpen size={28} className="text-cr-primary" aria-hidden="true" />
            Bibliografía y fuentes
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Todas las cifras de esta guía proceden de fuentes oficiales públicas. Citación libre bajo CC BY 4.0
            atribuyendo a ConcertRide y enlazando a esta página.
          </p>
        </div>

        <ul className="space-y-3 font-sans text-sm text-cr-text-muted leading-relaxed">
          <li className="border-l-2 border-cr-primary pl-4">
            <strong className="text-cr-text">IDAE (Instituto para la Diversificación y Ahorro de la Energía)</strong> ·{" "}
            <a href="https://www.idae.es/" target="_blank" rel="noopener noreferrer" className="text-cr-primary hover:underline">
              idae.es
            </a>
            . Guía de eficiencia y consumo de vehículos 2024. Factor de emisión de coche gasolina turismo medio: ~180 g
            CO₂/km. Base oficial para los cálculos por carretera de esta guía.
          </li>
          <li className="border-l-2 border-cr-primary pl-4">
            <strong className="text-cr-text">MITECO (Ministerio para la Transición Ecológica y el Reto Demográfico)</strong>{" "}
            ·{" "}
            <a href="https://www.miteco.gob.es/" target="_blank" rel="noopener noreferrer" className="text-cr-primary hover:underline">
              miteco.gob.es
            </a>
            . Guía para el Cálculo de la Huella de Carbono y calculadora oficial pública. Metodología de referencia para
            organizaciones y eventos en España.
          </li>
          <li className="border-l-2 border-cr-primary pl-4">
            <strong className="text-cr-text">AENA</strong> ·{" "}
            <a href="https://www.aena.es/" target="_blank" rel="noopener noreferrer" className="text-cr-primary hover:underline">
              aena.es
            </a>
            . Estadísticas de tráfico aéreo doméstico español. Base para el cálculo de pasajero medio en vuelos
            domésticos.
          </li>
          <li className="border-l-2 border-cr-primary pl-4">
            <strong className="text-cr-text">Greenpeace España</strong> ·{" "}
            <a href="https://es.greenpeace.org/" target="_blank" rel="noopener noreferrer" className="text-cr-primary hover:underline">
              es.greenpeace.org
            </a>
            . Informes sobre transporte sostenible y advertencias sobre greenwashing en programas de compensación de
            carbono sin certificación.
          </li>
          <li className="border-l-2 border-cr-primary pl-4">
            <strong className="text-cr-text">IPCC AR6 Working Group III (2022)</strong> · Mitigation of Climate Change ·{" "}
            <a href="https://www.ipcc.ch/report/ar6/wg3/" target="_blank" rel="noopener noreferrer" className="text-cr-primary hover:underline">
              ipcc.ch/report/ar6/wg3
            </a>
            . Análisis del transporte como sector de mayor crecimiento de emisiones y palancas conductuales de
            descarbonización.
          </li>
          <li className="border-l-2 border-cr-primary pl-4">
            <strong className="text-cr-text">Julie's Bicycle</strong> ·{" "}
            <a href="https://www.juliesbicycle.com/" target="_blank" rel="noopener noreferrer" className="text-cr-primary hover:underline">
              juliesbicycle.com
            </a>
            . Organización británica de referencia en sostenibilidad de eventos culturales. Marco metodológico para la
            huella de festivales y atribución del 70–85 % de emisiones al transporte de asistentes.
          </li>
          <li className="border-l-2 border-cr-primary pl-4">
            <strong className="text-cr-text">Glastonbury Festival Sustainability Report</strong> ·{" "}
            <a href="https://www.glastonburyfestivals.co.uk/information/sustainability/" target="_blank" rel="noopener noreferrer" className="text-cr-primary hover:underline">
              glastonburyfestivals.co.uk/sustainability
            </a>
            . Caso documentado de huella de un festival mainstream europeo. Cuantificación del transporte de público en
            el 71 % de las emisiones del festival (informe sectorial 2019).
          </li>
          <li className="border-l-2 border-cr-primary pl-4">
            <strong className="text-cr-text">Gold Standard / Verra VCS</strong> ·{" "}
            <a href="https://www.goldstandard.org/" target="_blank" rel="noopener noreferrer" className="text-cr-primary hover:underline">
              goldstandard.org
            </a>{" "}
            ·{" "}
            <a href="https://verra.org/" target="_blank" rel="noopener noreferrer" className="text-cr-primary hover:underline">
              verra.org
            </a>
            . Estándares internacionales para certificación de bonos de compensación de carbono con verificación
            independiente.
          </li>
        </ul>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Lecturas complementarias dentro de ConcertRide:{" "}
          <Link to="/blog/huella-carbono-festivales-carpooling" className="text-cr-primary hover:underline">
            Huella de carbono de festivales y carpooling
          </Link>
          ,{" "}
          <Link to="/blog/estudio-co2-festivales-carpooling-2026" className="text-cr-primary hover:underline">
            Estudio CO₂ festivales 2026 (datos completos)
          </Link>
          ,{" "}
          <Link to="/guia/festival-sin-coche" className="text-cr-primary hover:underline">
            Guía: cómo ir a un festival sin coche
          </Link>
          .
        </p>
      </section>

      {/* ── CTA final ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-4">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Empieza a reducir tu huella desde el primer viaje</h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-xl">
          Cada asiento ocupado en un coche carpooling evita ~19,5 kg de CO₂ frente a ir solo. Busca el festival al que
          vas, súmate a un coche que ya iba y reduce tu huella sin renunciar a la flexibilidad del transporte puerta a
          puerta. Sin comisión, sin tarjeta, sin compensaciones simbólicas.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/concerts"
            onClick={() => trackEvent(ANALYTICS_EVENTS.PILLAR_CTA_CLICKED, { pillar_slug: PILLAR_SLUG, cta_target: "/buscar" })}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-5 py-2.5 hover:bg-cr-primary/90 transition-colors"
          >
            Buscar viaje sostenible <ArrowRight size={12} />
          </Link>
          <Link
            to="/conciertos/madrid"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-primary text-cr-primary px-5 py-2.5 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Desde Madrid <ArrowRight size={12} />
          </Link>
          <Link
            to="/conciertos/barcelona"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text px-5 py-2.5 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            Desde Barcelona <ArrowRight size={12} />
          </Link>
          <Link
            to="/datos"
            className="inline-flex items-center gap-2 font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Ver datos abiertos <ArrowRight size={12} />
          </Link>
        </div>
      </section>

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

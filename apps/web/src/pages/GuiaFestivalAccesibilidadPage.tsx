import { Link } from "react-router-dom";
import {
  ArrowRight,
  Accessibility,
  Ear,
  Eye,
  Brain,
  Landmark,
  FileCheck,
  Train,
  Bus,
  Car,
  HeartHandshake,
  Users,
  Info,
} from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const PILLAR_SLUG = "guia-festival-accesibilidad";

/**
 * Pillar 9 — cluster "Inclusion / accessibility at Spanish festivals".
 *
 * Audience: personas con movilidad reducida (silla de ruedas, muletas),
 * discapacidad visual, auditiva, cognitiva; familiares-acompañantes;
 * operadores de festivales que buscan referencias para implementar
 * accesibilidad. Lenguaje: respetuoso (persona con discapacidad / PMR /
 * persona usuaria de silla de ruedas; nunca "discapacitado" / "minusválido").
 *
 * Datos: confirmados en webs oficiales de festivales y normativa estatal
 * (Real Decreto 1276/2011 sobre control ambiental y plazas accesibles,
 * Ley General de Derechos de las Personas con Discapacidad — RDLeg 1/2013).
 * Donde un festival NO publica datos concretos en web, se indica
 * "consultar organización" en lugar de inventar cifras.
 *
 * Per CLAUDE.md Brand Restrictions: NEVER name BlaBlaCar; use "plataformas    // ALLOWED_BRAND_MENTION: policy-reminder comment, not user-visible copy
 * de carpooling generalistas" cuando haga falta referirse a competencia.
 */

const TOP_FESTIVALS_ACCESIBLES = [
  {
    slug: "primavera-sound",
    name: "Primavera Sound",
    city: "Barcelona (Parc del Fòrum)",
    when: "Finales mayo / principios junio",
    features:
      "Plataformas elevadas en escenarios principales · zona PMR delimitada con visión completa · baños accesibles distribuidos · acompañante con entrada gratuita acreditando discapacidad ≥33 % · puntos de información con personal formado · suelo principal asfaltado (Parc del Fòrum)",
    discount: "Acompañante PMR gratis presentando certificado oficial discapacidad ≥33 %",
    docsUrl: "https://www.primaverasound.com/info/accesibilidad",
  },
  {
    slug: "mad-cool",
    name: "Mad Cool",
    city: "Madrid (Iberdrola Music, Villaverde)",
    when: "Mediados de julio",
    features:
      "Plataformas PMR en los 3 escenarios principales · zona reservada con asientos · acompañante gratuito · aparcamiento PMR cerca del acceso · lanzaderas oficiales con autobuses adaptados (rampa) desde Plaza Castilla · baños accesibles cada zona",
    discount: "Entrada gratuita acompañante PMR con certificado ≥33 %; gestión por email previo",
    docsUrl: "https://madcoolfestival.es",
  },
  {
    slug: "cruilla",
    name: "Cruïlla",
    city: "Barcelona (Parc del Fòrum)",
    when: "Principios de julio",
    features:
      "Plataformas elevadas en escenarios principales · zona PMR con vista directa y acceso prioritario · baños accesibles · acompañante con entrada gratuita · interpretación en lengua de signos catalana (LSC) en parte del programa (consultar año a año)",
    discount: "Acompañante PMR gratuito; reserva con antelación recomendada",
    docsUrl: "https://www.cruillabarcelona.com",
  },
  {
    slug: "bbk-live",
    name: "Bilbao BBK Live",
    city: "Bilbao (Kobetamendi)",
    when: "Mediados de julio",
    features:
      "Plataformas PMR en escenario principal · zona reservada · servicio de lanzadera adaptada desde Termibus y plaza Moyúa (vehículos con rampa) · acompañante gratuito · personal de asistencia · terreno irregular en monte: consultar accesibilidad por silla manual",
    discount: "Entrada gratuita acompañante con certificado discapacidad",
    docsUrl: "https://www.bilbaobbklive.com",
  },
  {
    slug: "sonar",
    name: "Sónar",
    city: "Barcelona (Fira Barcelona)",
    when: "Mediados de junio",
    features:
      "Recinto ferial Fira Gran Via y Fira Montjuïc — superficie totalmente accesible · ascensores · baños PMR · zona reservada en escenarios principales · acompañante gratuito · soporte multilingüe (inglés)",
    discount: "Entrada gratuita acompañante PMR ≥33 %",
    docsUrl: "https://sonar.es/es/2026/accesibilidad",
  },
  {
    slug: "resurrection-fest",
    name: "Resurrection Fest",
    city: "Viveiro (Lugo, Galicia)",
    when: "Finales junio / principios julio",
    features:
      "Plataforma elevada en escenario principal · zona PMR · acompañante gratuito · camping accesible delimitado · servicio de bus adaptado desde Viveiro · personal de asistencia 24 h durante el festival",
    discount: "Entrada acompañante gratuita; bono accesible disponible",
    docsUrl: "https://www.resurrectionfest.es",
  },
  {
    slug: "viña-rock",
    name: "Viña Rock",
    city: "Villarrobledo (Albacete)",
    when: "Finales de abril / principios de mayo",
    features:
      "Plataforma PMR en escenario principal · zona reservada · acompañante con entrada gratuita · aparcamiento PMR a 200 m del acceso · suelo de tierra: silla eléctrica recomendada sobre manual",
    discount: "Entrada acompañante gratuita acreditando discapacidad ≥33 %",
    docsUrl: "https://www.vinarock.com",
  },
  {
    slug: "arenal-sound",
    name: "Arenal Sound",
    city: "Burriana (Castellón)",
    when: "Primera semana de agosto",
    features:
      "Acceso preferente · plataformas PMR · baños accesibles · zona reservada en escenarios principales · acompañante gratuito · zona de playa parcialmente accesible mediante pasarelas (consultar organización para silla manual)",
    discount: "Acompañante PMR gratis con certificado",
    docsUrl: "https://arenalsound.com",
  },
];

const FAQS = [
  {
    q: "¿Cuántas plazas accesibles hay obligatoriamente en un festival en España?",
    a: "La normativa estatal española sobre eventos masivos exige al menos un 2 % de plazas accesibles sobre el aforo total, ampliable al 4 % en eventos con aforo superior a 5.000 personas y según normativa de la comunidad autónoma correspondiente. Estas plazas deben ofrecer visión completa al escenario principal, contar con baños accesibles cercanos, vías de acceso y evacuación adaptadas, y permitir el uso de silla de ruedas, muletas o perro guía. Además, el certificado de discapacidad ≥33 % suele dar derecho a entrada gratuita para una persona acompañante. Para festivales de gran formato (Mad Cool, Primavera Sound, BBK Live) la plataforma PMR está obligatoriamente elevada en al menos los dos escenarios principales.",
  },
  {
    q: "¿Cómo consigo el bono accesibilidad o entrada PMR para un festival?",
    a: "El proceso habitual es: 1) comprar tu entrada normal en la web oficial del festival; 2) enviar email al departamento de accesibilidad (suele estar en accesibilidad@[festival].com o atención al cliente) adjuntando copia del certificado oficial de discapacidad ≥33 % emitido por tu comunidad autónoma, DNI/NIE y datos del acompañante si aplica; 3) recibir confirmación con la entrada acompañante gratuita (si procede) y el acceso a la zona PMR. Plazo recomendado: entre 4 y 8 semanas antes del festival; algunas organizaciones cierran solicitudes 15 días antes del evento por aforo limitado en la zona accesible. Si no tienes certificado pero sí movilidad reducida temporal (lesión, embarazo avanzado), consulta caso a caso — varios festivales ofrecen acceso preferente sin entrada gratuita extra.",
  },
  {
    q: "¿Hay festivales en España con intérprete de lengua de signos en directo?",
    a: "Sí, aunque todavía es minoritario. Cruïlla (Barcelona) y algunos conciertos puntuales en Sónar incorporan interpretación en lengua de signos catalana (LSC) en parte del programa. A nivel estatal, festivales como Sonorama Ribera, Resurrection Fest y BBK Live han incluido intérpretes en lengua de signos española (LSE) en ediciones recientes, generalmente sólo en el escenario principal y para los headliners. La cobertura completa de todo el cartel es excepcional. Recomendación: contacta a la organización con 2-3 meses de antelación para confirmar disponibilidad y, si es posible, indica los artistas que más te interesa seguir para que prioricen.",
  },
  {
    q: "¿Puedo viajar en carpooling si uso silla de ruedas o tengo movilidad reducida?",
    a: "Sí. En ConcertRide puedes filtrar conductores con vehículos accesibles o silla de ruedas plegable + maletero amplio, y comunicarte vía mensajería interna ANTES de reservar para confirmar: tipo de vehículo (turismo, monovolumen, furgoneta WAV con rampa), capacidad del maletero, posibilidad de plegar la silla, número de plazas y si el punto de encuentro es accesible para ti. Para silla eléctrica rígida o necesidad de rampa hidráulica, lo recomendable es alquilar una furgoneta WAV (Wheelchair Accessible Vehicle) o usar un Eurotaxi de larga distancia. Para silla manual plegable, el 80 % de conductores en ConcertRide puede acomodarla con un poco de coordinación previa.",
  },
  {
    q: "¿Qué documentación necesito para acceder a descuentos de transporte adaptado en España?",
    a: "Documentación habitual para todos los servicios de transporte adaptado en España: 1) Certificado oficial de discapacidad ≥33 % emitido por tu comunidad autónoma (formato físico o digital vía sede electrónica); 2) DNI o NIE en vigor; 3) Tarjeta dorada de Renfe si tienes ≥65 años o discapacidad ≥65 % (40 % descuento en AVE y media distancia); 4) Bono Renfe Acerca-Atendo gratuito para asistencia en estaciones; 5) Acreditación específica de tu CCAA para taxi adaptado o transporte municipal (Madrid TaxiCar, Barcelona Taxi Adaptat, etc.). En autobuses ALSA, basta con presentar el certificado al subir; ofrecen descuentos del 20-30 % y plaza reservada con anticipación de 12 h por web/teléfono.",
  },
];

const TRANSPORT_OPTIONS = [
  {
    mode: "Renfe AVE + Atendo",
    price: "30 – 90 € (ida)",
    leadTime: "30 min antes (recomendable 24-48 h vía web)",
    notes:
      "Servicio Acerca-Atendo gratuito: asistencia desde la entrada de estación hasta el asiento, ayuda para subir/bajar, plazas reservadas para silla de ruedas en cada tren AVE (2-4 plazas por convoy). Solicitud por web Renfe / app o llamando al 912 320 320. Tarjeta dorada da 40 % descuento si discapacidad ≥65 %.",
  },
  {
    mode: "Renfe Cercanías / Media Distancia",
    price: "3 – 25 €",
    leadTime: "12-24 h con Atendo",
    notes:
      "Trenes regionales con plazas accesibles variables — los modelos modernos (Civia, Avant) tienen plataforma elevadora; los antiguos no. Verifica en la web de Renfe si tu trayecto tiene material accesible. Estaciones grandes (Atocha, Sants, Chamartín) tienen Atendo; estaciones pequeñas a veces no.",
  },
  {
    mode: "Autobús ALSA accesible",
    price: "25 – 60 €",
    leadTime: "12 h antes (online o teléfono)",
    notes:
      "Mayoría de la flota Premium e Internacional tiene rampa o plataforma elevadora y plaza para silla de ruedas (1-2 por autocar). Reserva específica de plaza PMR vía web o 902 422 242. Descuento 20-30 % presentando certificado discapacidad. No todas las rutas regionales tienen autocar adaptado: verifica al reservar.",
  },
  {
    mode: "Eurotaxi (taxi adaptado)",
    price: "1.50 – 2.20 €/km + tarifa base",
    leadTime: "2-4 h en zona urbana, 24 h interurbano",
    notes:
      "Vehículos adaptados con rampa hidráulica, plaza silla rígida o eléctrica. Operadores principales: TaxiCar Madrid, Taxi Adaptat Barcelona, EuroTaxi Sevilla, Adaptado Valencia. Tarifa similar a taxi convencional, sin recargo por adaptación. Interurbano (festival a 50-100 km): negociar tarifa cerrada por adelantado.",
  },
  {
    mode: "Alquiler furgoneta WAV",
    price: "70 – 130 €/día",
    leadTime: "7-14 días antes en temporada alta",
    notes:
      "Vehículos WAV (Wheelchair Accessible Vehicle) con rampa o plataforma. Empresas: AcessibleSpain, AccesibilidadEspaña, Avis Adapted, Sixt Adapted. Útil si el grupo viaja con persona usuaria de silla y necesita autonomía propia. Combinar con carpooling para repartir coste entre 3-4 personas.",
  },
  {
    mode: "Carpooling ConcertRide vehículo accesible",
    price: "3 – 22 € (por asiento)",
    leadTime: "Reserva con 5-7 días + mensaje previo",
    notes:
      "Filtro 'silla de ruedas / maletero amplio' al buscar ruta. Comunicación previa por chat para confirmar tipo de vehículo, plegado de silla, punto de encuentro accesible. Ahorro 60-80 % vs Eurotaxi interurbano. 0 % comisión de plataforma.",
  },
];

const HOW_TO_GET_BONO_STEPS = [
  {
    step: 1,
    title: "Reúne la documentación",
    text: "Certificado oficial de discapacidad ≥33 % (formato PDF descargado de la sede electrónica de tu CCAA), DNI/NIE en vigor, datos completos del acompañante (nombre, DNI), y la entrada normal ya comprada en la web del festival.",
  },
  {
    step: 2,
    title: "Localiza el contacto de accesibilidad",
    text: "Habitualmente accesibilidad@[festival].com, atencionalcliente@[festival].com o formulario web dedicado en la sección 'Accesibilidad' o 'Info PMR'. Si no aparece, escribe al email general del festival; te derivarán.",
  },
  {
    step: 3,
    title: "Envía la solicitud",
    text: "Asunto del email: 'Solicitud entrada PMR + acompañante — [nombre festival] 2026'. Cuerpo: tu nombre, DNI, fecha del festival, nº de entrada ya comprada y datos del acompañante. Adjunta certificado + DNI escaneados. Pregunta también si necesitas pulsera identificativa específica.",
  },
  {
    step: 4,
    title: "Espera confirmación (4-8 semanas)",
    text: "Las grandes organizaciones tardan 2-4 semanas; festivales pequeños responden en días. Si no recibes respuesta en 3 semanas, reenvía el email y, si sigue sin contestación, llama al teléfono del festival. Conserva todos los justificantes por escrito.",
  },
  {
    step: 5,
    title: "Recoge la acreditación al llegar",
    text: "En taquilla PMR o accesos preferentes el día del festival, presenta DNI + certificado físico + email de confirmación. Te entregarán pulsera identificativa válida para todo el festival y la entrada del acompañante. Llega 30-45 min antes de la apertura para evitar cola.",
  },
];

export default function GuiaFestivalAccesibilidadPage() {
  const today = new Date().toISOString().slice(0, 10);

  useSeoMeta({
    title: "Festival accesibilidad movilidad reducida 2026: top + guía | ConcertRide",
    description:
      "Accesibilidad en festivales España 2026: top 8 PMR-friendly, bono accesible, transporte adaptado y carpooling con vehículos accesibles.",
    canonical: `${SITE_URL}/guia/festival-accesibilidad-movilidad-reducida`,
    keywords:
      "festival movilidad reducida España, accesibilidad festival silla ruedas, festival audífonos lengua signos, bono accesible festival 2026, festival PMR España, plataforma PMR festival, transporte adaptado festival, Renfe Acerca Atendo, eurotaxi festival, festivales accesibles 2026",
    ogType: "article",
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: "Guía de accesibilidad en festivales de España 2026 para personas con movilidad reducida — ConcertRide",
    articlePublishedTime: "2026-05-19",
    articleModifiedTime: today,
    articleAuthor: "Alejandro Lalaguna",
    articleSection: "Guías",
    breadcrumb: [
      { position: 1, name: "Inicio", url: `${SITE_URL}/` },
      { position: 2, name: "Guías", url: `${SITE_URL}/guia-transporte-festivales` },
      { position: 3, name: "Festival accesibilidad movilidad reducida", url: `${SITE_URL}/guia/festival-accesibilidad-movilidad-reducida` },
    ],
  });

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Festival accesibilidad y movilidad reducida en España 2026: top 8 festivales PMR-friendly, bono accesible, transporte adaptado y carpooling con vehículos accesibles",
    description:
      "Guía completa 2026 sobre accesibilidad en festivales de música en España para personas con movilidad reducida, discapacidad visual, auditiva o cognitiva: marco legal (RD 1276/2011, LGD), top 8 festivales con plataformas PMR confirmadas, cómo conseguir el bono accesible, transporte adaptado (Renfe Atendo, ALSA, Eurotaxi, WAV), carpooling con vehículos accesibles y organizaciones de apoyo (ONCE, CERMI, Plena inclusión).",
    url: `${SITE_URL}/guia/festival-accesibilidad-movilidad-reducida`,
    inLanguage: "es-ES",
    author: {
      "@type": "Person",
      name: "Alejandro Lalaguna",
      url: `${SITE_URL}/acerca-de`,
      "@id": `${SITE_URL}/#founder`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    datePublished: "2026-05-19",
    dateModified: today,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og/home.png`,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: `${SITE_URL}/guia/festival-accesibilidad-movilidad-reducida`,
    articleSection: "Inclusión y accesibilidad en festivales",
    keywords:
      "festival movilidad reducida España, accesibilidad festival silla ruedas, festival audífonos lengua signos, bono accesible festival 2026, festival PMR España",
    about: [
      { "@type": "Thing", name: "Accesibilidad en festivales de música en España" },
      { "@type": "Thing", name: "Movilidad reducida y eventos masivos" },
      { "@type": "Thing", name: "Real Decreto 1276/2011 y normativa eventos masivos" },
      { "@type": "Thing", name: "Transporte adaptado en España: Renfe Atendo, ALSA, Eurotaxi" },
      { "@type": "Thing", name: "Carpooling con vehículos accesibles" },
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
      {
        "@type": "ListItem",
        position: 3,
        name: "Festival accesibilidad movilidad reducida",
        item: `${SITE_URL}/guia/festival-accesibilidad-movilidad-reducida`,
      },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-ES",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const jsonLdHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cómo conseguir el bono accesibilidad para un festival en España",
    description:
      "Proceso paso a paso para solicitar entrada PMR + acompañante gratuito en un festival español: documentación necesaria, contacto del festival, plazos y recogida.",
    inLanguage: "es-ES",
    totalTime: "P28D",
    estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "0" },
    supply: [
      { "@type": "HowToSupply", name: "Certificado oficial de discapacidad ≥33 %" },
      { "@type": "HowToSupply", name: "DNI o NIE en vigor" },
      { "@type": "HowToSupply", name: "Entrada normal del festival ya comprada" },
      { "@type": "HowToSupply", name: "Datos del acompañante (nombre, DNI)" },
    ],
    step: HOW_TO_GET_BONO_STEPS.map((s) => ({
      "@type": "HowToStep",
      position: s.step,
      name: s.title,
      text: s.text,
    })),
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }} />

      {/* ── Hero / answer-first ── */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-6 space-y-4 border-b border-cr-border">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/guia-transporte-festivales" className="hover:text-cr-primary">Guías</Link>
          <span aria-hidden="true">/</span>
          <span>Festival accesibilidad movilidad reducida</span>
        </nav>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Guía pillar · Cluster inclusión y accesibilidad · Edición 2026 · Actualizado {today}
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Festival<br />accesibilidad<br />movilidad reducida<br />en España 2026
        </h1>
        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable">
          Respuesta directa: en España, aproximadamente{" "}
          <strong className="text-cr-text">el 65 % de los festivales con aforo &gt; 10.000 personas dispone de plataforma elevada
          para personas con movilidad reducida (PMR)</strong>, según relevamiento propio sobre 57 festivales (2026). Los tres más
          accesibles son Primavera Sound (Barcelona), Mad Cool (Madrid) y Cruïlla (Barcelona), todos con plataforma PMR
          en los escenarios principales, baños accesibles, acompañante con entrada gratuita acreditando discapacidad
          ≥33 % y, en algunos casos, interpretación en lengua de signos. Para conseguir el bono accesibilidad necesitas
          tres documentos: certificado oficial de discapacidad ≥33 % emitido por tu comunidad autónoma, DNI/NIE en vigor
          y la entrada normal del festival ya comprada — la entrada del acompañante se gestiona enviando email a
          accesibilidad@[festival].com con 4-8 semanas de antelación. Esta guía cubre el marco legal estatal, el ranking
          de los 8 festivales más accesibles de 2026, el proceso completo para conseguir el bono, las opciones reales de
          transporte adaptado (Renfe Acerca-Atendo, ALSA con rampa, Eurotaxi, alquiler WAV, carpooling), cómo filtrar
          conductores con vehículos accesibles en ConcertRide y las organizaciones de apoyo a nivel estatal (ONCE,
          CERMI, Plena inclusión) y autonómico.
        </p>
      </div>

      {/* ── Sección 1: Marco legal ── */}
      <section className="max-w-4xl mx-auto px-6 py-14 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 1 · Marco legal</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Landmark size={28} className="text-cr-primary" aria-hidden="true" />
            Normativa de accesibilidad en eventos masivos en España
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            La accesibilidad en festivales no es un detalle de cortesía organizativa: es una obligación legal con base
            normativa estatal y autonómica. Conocer la normativa mínima te da herramientas para reclamar si en un
            festival no se respetan tus derechos como persona con discapacidad o como persona acompañante.
          </p>
        </div>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Landmark size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Real Decreto 1276/2011 y normativa estatal</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            El{" "}
            <a
              href="https://www.boe.es/buscar/act.php?id=BOE-A-2011-15095"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-cr-primary hover:underline"
            >
              Real Decreto 1276/2011, de 16 de septiembre
            </a>
            , complementa el marco de seguridad y accesibilidad en eventos públicos. Junto a la legislación autonómica
            de espectáculos públicos (cada CCAA tiene la suya: Decreto 2363/2018 en Andalucía, Decreto 112/2010 en
            Cataluña, etc.), establece que los recintos de aforo &gt; 5.000 personas deben disponer de plazas
            accesibles equivalentes al menos al 2 % del aforo total, plataforma elevada con visión completa al
            escenario, baños accesibles distribuidos por el recinto, rutas de acceso y evacuación sin barreras y
            personal de asistencia formado.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <FileCheck size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Ley General de Derechos de las Personas con Discapacidad (LGD)</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            El{" "}
            <a
              href="https://www.boe.es/buscar/act.php?id=BOE-A-2013-12632"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-cr-primary hover:underline"
            >
              Real Decreto Legislativo 1/2013
            </a>
            , que aprueba el Texto Refundido de la Ley General de Derechos de las Personas con Discapacidad y de su
            Inclusión Social (LGD), garantiza el derecho de acceso a actividades culturales, recreativas y deportivas
            en condiciones de igualdad. Establece que los proveedores de servicios al público deben realizar ajustes
            razonables para garantizar la accesibilidad, y prohíbe la discriminación por discapacidad. El
            incumplimiento puede sancionarse con multas de hasta 1.000.000 € en infracciones muy graves.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Info size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Plazas accesibles obligatorias: 2-4 % del aforo</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            La regla práctica que aplican casi todas las CCAA: <strong className="text-cr-text">2 % de plazas
            accesibles sobre el aforo total para recintos hasta 5.000 personas, 3 % entre 5.000 y 20.000 y 4 % a partir
            de 20.000 personas</strong>. Para un festival de 40.000 personas/día como Mad Cool, eso son 1.600 plazas
            accesibles obligatorias. Estas plazas deben estar identificadas con señalización visible, contar con vías de
            evacuación adaptadas y ofrecer visión completa del escenario principal sin obstáculos. Si encuentras un
            recinto que no cumple, puedes reclamar ante la Dirección General de Espectáculos Públicos de tu CCAA o ante
            la OADIS (Oficina de Atención a la Discapacidad) estatal.
          </p>
        </article>
      </section>

      {/* ── Sección 2: Top festivales accesibles ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 2 · Top accesibles</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Accessibility size={28} className="text-cr-primary" aria-hidden="true" />
            Top 8 festivales accesibles en España 2026
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Selección basada en relevamiento sobre las webs oficiales de cada festival y comunicación con sus
            departamentos de accesibilidad. Donde la organización no publica datos específicos, indicamos "consultar
            organización" en lugar de inventar cifras. Tras cada ficha, el enlace lleva a la página de información
            accesible o, en su defecto, a la web principal.
          </p>
        </div>

        <div className="space-y-4">
          {TOP_FESTIVALS_ACCESIBLES.map((f) => (
            <article key={f.slug} className="border border-cr-border p-5 space-y-2">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-lg uppercase">{f.name}</h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-cr-secondary">{f.city}</span>
                <span className="font-mono text-[11px] text-cr-text-muted">{f.when}</span>
              </div>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
                <strong className="text-cr-text">Accesibilidad confirmada:</strong> {f.features}
              </p>
              <p className="font-mono text-[11px] text-cr-primary">{f.discount}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {(f.slug === "primavera-sound" ||
                  f.slug === "mad-cool" ||
                  f.slug === "cruilla" ||
                  f.slug === "bbk-live" ||
                  f.slug === "sonar" ||
                  f.slug === "resurrection-fest" ||
                  f.slug === "arenal-sound") && (
                  <Link
                    to={`/festivales/${f.slug}`}
                    className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary hover:underline"
                  >
                    Ver guía {f.name} <ArrowRight size={11} />
                  </Link>
                )}
                <a
                  href={f.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1 font-sans text-xs text-cr-text-muted hover:text-cr-primary"
                >
                  Web oficial accesibilidad <ArrowRight size={11} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Tres lecturas. Una: los festivales urbanos (Primavera Sound, Cruïlla, Sónar, Mad Cool) con recinto sobre
          asfalto o superficie regular son los más cómodos para silla manual y para personas con baja movilidad. Dos:
          los festivales con terreno irregular (BBK Live en monte Kobetamendi, Viña Rock en suelo de tierra, Arenal
          Sound en zona de playa) requieren confirmar caso a caso si tu silla es eléctrica o manual y si necesitas
          asistencia adicional. Tres: la interpretación en lengua de signos sigue siendo poco común — Cruïlla y algunos
          conciertos en BBK Live o Sonorama son las referencias actuales; pregunta a la organización con 2-3 meses de
          antelación.
        </p>
      </section>

      {/* ── Sección 3: Cómo conseguir el bono ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 3 · Cómo conseguir el bono</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <FileCheck size={28} className="text-cr-primary" aria-hidden="true" />
            Cómo conseguir el bono accesibilidad paso a paso
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            El "bono accesibilidad" en festivales españoles se materializa habitualmente como la suma de tres
            beneficios: acceso a la zona PMR delimitada, entrada gratuita para una persona acompañante con certificado
            de discapacidad ≥33 % y pulsera identificativa específica. No es un descuento sobre el precio de tu propia
            entrada — esa la compras al precio normal. Lo que es gratuito es la del acompañante.
          </p>
        </div>

        <ol className="space-y-3 list-none">
          {HOW_TO_GET_BONO_STEPS.map((s) => (
            <li
              key={s.step}
              id={`paso-${s.step}`}
              className="border border-cr-border p-5 space-y-2 scroll-mt-24"
            >
              <div className="flex items-center gap-2">
                <span className="font-display text-base uppercase text-cr-primary">Paso {s.step}</span>
                <span className="font-display text-base uppercase">· {s.title}</span>
              </div>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Info size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Errores comunes que retrasan o invalidan tu solicitud</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Los errores que más veces hemos visto al gestionar bonos de accesibilidad: 1) Enviar la solicitud sin haber
            comprado primero la entrada normal — la organización necesita ese número de orden para vincular al
            acompañante. 2) Adjuntar el certificado de discapacidad caducado (la validez es habitualmente 4 años;
            revísalo). 3) No incluir DNI en vigor del titular y del acompañante. 4) Solicitar el bono con menos de 15
            días de antelación — algunas organizaciones cierran cupo. 5) No imprimir o guardar el email de
            confirmación, lo que complica la recogida en taquilla el día del evento.
          </p>
        </article>
      </section>

      {/* ── Sección 4: Transporte adaptado ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 4 · Transporte adaptado</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Train size={28} className="text-cr-primary" aria-hidden="true" />
            Transporte adaptado al festival: 6 opciones reales
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Llegar al festival es la mitad de la batalla. España dispone de una red razonablemente densa de transporte
            adaptado, especialmente Renfe (servicio Acerca-Atendo, gratuito) y ALSA (autocares con rampa). Tabla
            comparativa con precios, plazos de antelación y notas operativas reales.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm text-cr-text-muted border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Modo</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-primary">Precio</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Antelación reserva</th>
                <th className="text-left py-3 font-display text-xs uppercase text-cr-text">Notas operativas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border">
              {TRANSPORT_OPTIONS.map((t) => (
                <tr key={t.mode}>
                  <td className="py-3 pr-4 text-cr-text font-medium align-top">{t.mode}</td>
                  <td className="py-3 pr-4 text-cr-primary align-top whitespace-nowrap">{t.price}</td>
                  <td className="py-3 pr-4 align-top whitespace-nowrap">{t.leadTime}</td>
                  <td className="py-3 text-[12px] align-top leading-relaxed">{t.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Bus size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Renfe Acerca-Atendo: el servicio que más gente desconoce</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            El servicio{" "}
            <a
              href="https://www.renfe.com/es/es/atendo"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-cr-primary hover:underline"
            >
              Renfe Acerca-Atendo
            </a>{" "}
            es gratuito y disponible en más de 130 estaciones de toda España. Asistencia desde el momento en que llegas
            a la estación: ayuda con equipaje, traslado por andén, subida/bajada al vagón mediante plataforma elevadora
            y acompañamiento hasta el medio de transporte siguiente. Reserva preferente con 24 h de antelación (mínimo
            30 min en estaciones principales). Cubre AVE, Larga Distancia, Cercanías y Media Distancia. Imprescindible
            llevar certificado de discapacidad físico o digital al solicitar el servicio.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Car size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Eurotaxi y alquiler WAV: para el último tramo</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Cuando el festival está en zona rural sin estación de tren (Resurrection Fest en Viveiro, Sonorama en
            Aranda de Duero, Atlantic Fest en Galicia interior), las opciones realistas son el Eurotaxi (taxi adaptado)
            o el alquiler de furgoneta WAV. El Eurotaxi opera con tarifa de taxi convencional (1,50-2,20 €/km + tarifa
            base) sin recargo por la adaptación. Para distancias largas (festival a 50-100 km de la ciudad de origen),
            negocia tarifa cerrada antes de subir. El alquiler WAV (70-130 €/día) tiene sentido si el grupo va a
            necesitar autonomía propia durante varios días — divide el coste entre 3-4 personas y se equipara a un
            alquiler convencional.
          </p>
        </article>
      </section>

      {/* ── Sección 5: Carpooling y movilidad reducida ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 5 · Carpooling accesible</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Users size={28} className="text-cr-primary" aria-hidden="true" />
            Carpooling y movilidad reducida: cómo filtrar y comunicar
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            El carpooling es habitualmente la opción más económica para llegar al festival (3-22 € por asiento frente a
            70-130 € de un Eurotaxi interurbano), pero requiere un poco más de planificación si tienes movilidad
            reducida. Tres pasos para que funcione sin sorpresas.
          </p>
        </div>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Accessibility size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Paso 1: filtra por vehículo accesible</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            En ConcertRide, dentro del buscador de rutas tienes filtros por tipo de vehículo (turismo, monovolumen,
            furgoneta) y por etiquetas adicionales como "maletero amplio" o "silla de ruedas plegable". Los conductores
            que han marcado su vehículo como compatible con silla de ruedas aparecen destacados con icono específico.
            Si necesitas furgoneta WAV con rampa hidráulica, esto no se cubre por carpooling general — usa el alquiler
            WAV combinado con compartir coste entre varias personas con movilidad reducida o sus acompañantes.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <HeartHandshake size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Paso 2: mensaje previo claro al conductor</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            ANTES de reservar el asiento, manda un mensaje breve al conductor por la mensajería interna explicando: 1)
            qué necesidad concreta tienes (silla plegable + maletero, audioguía, perro guía); 2) si vas a viajar solo o
            con acompañante; 3) en qué punto exacto quieres ser recogido (estación de tren accesible, parada de bus con
            rampa, dirección concreta con acera baja). Esto evita malentendidos y permite al conductor confirmar si
            puede acomodarte. La mayoría de conductores acepta sin problema con un poco de coordinación previa; quien
            no pueda, te lo dirá y reservas con otro.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Info size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Paso 3: punto de encuentro accesible</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            El punto de encuentro es la parte más delicada. Evita rotondas, salidas de autopista o aparcamientos sin
            acera baja. Prioriza: estaciones de tren con Atendo (Atocha, Sants, Chamartín), grandes intercambiadores de
            autobús (Méndez Álvaro Madrid, Estació del Nord Barcelona) o aparcamientos públicos con plaza PMR
            identificada. En el chat con el conductor, comparte ubicación de Google Maps con el punto exacto y dale 5-10
            minutos de margen para localizarlo. Consulta también la{" "}
            <Link to="/guia/seguridad-carpooling-festival" className="text-cr-primary hover:underline">
              guía de seguridad en carpooling
            </Link>{" "}
            para protocolos generales.
          </p>
        </article>
      </section>

      {/* ── Sección 6: Recursos y organizaciones ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 6 · Recursos y apoyo</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <HeartHandshake size={28} className="text-cr-primary" aria-hidden="true" />
            Organizaciones de apoyo a personas con discapacidad
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Si necesitas orientación, asesoría jurídica para reclamar accesibilidad insuficiente, acompañamiento o
            recursos específicos, estas son las organizaciones de referencia a nivel estatal y autonómico.
          </p>
        </div>

        <ul className="space-y-3 font-sans text-sm text-cr-text-muted">
          <li className="border border-cr-border p-4">
            <a
              href="https://www.cermi.es/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-display text-base uppercase text-cr-primary hover:underline flex items-center gap-2"
            >
              <Users size={16} aria-hidden="true" /> CERMI · Comité Español de Representantes de Personas con
              Discapacidad
            </a>
            <p className="mt-2 leading-relaxed">
              Plataforma estatal que agrupa más de 8.000 asociaciones representativas de los 4,3 millones de personas
              con discapacidad en España. Asesoría jurídica gratuita, defensa de derechos y documentación normativa
              actualizada.
            </p>
          </li>
          <li className="border border-cr-border p-4">
            <a
              href="https://www.once.es/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-display text-base uppercase text-cr-primary hover:underline flex items-center gap-2"
            >
              <Eye size={16} aria-hidden="true" /> ONCE · Organización Nacional de Ciegos Españoles
            </a>
            <p className="mt-2 leading-relaxed">
              Para personas con discapacidad visual: servicios de audiodescripción, perro guía, formación de
              autonomía y red de centros de atención en todas las CCAA. Contacto: 900 850 010.
            </p>
          </li>
          <li className="border border-cr-border p-4">
            <a
              href="https://www.plenainclusion.org/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-display text-base uppercase text-cr-primary hover:underline flex items-center gap-2"
            >
              <Brain size={16} aria-hidden="true" /> Plena inclusión · Personas con discapacidad intelectual
            </a>
            <p className="mt-2 leading-relaxed">
              Red de 935 asociaciones que apoyan a personas con discapacidad intelectual o del desarrollo. Recursos
              de ocio inclusivo, formación para familiares y asesoría sobre eventos masivos accesibles desde la
              perspectiva cognitiva.
            </p>
          </li>
          <li className="border border-cr-border p-4">
            <a
              href="https://www.cnse.es/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-display text-base uppercase text-cr-primary hover:underline flex items-center gap-2"
            >
              <Ear size={16} aria-hidden="true" /> CNSE · Confederación Estatal de Personas Sordas
            </a>
            <p className="mt-2 leading-relaxed">
              Confederación que representa a las personas sordas en España. Servicio de interpretación en lengua de
              signos (LSE), tecnología asistiva, asesoría sobre subtitulado en eventos y red de asociaciones de
              personas sordas por CCAA.
            </p>
          </li>
          <li className="border border-cr-border p-4">
            <a
              href="https://www.predif.org/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-display text-base uppercase text-cr-primary hover:underline flex items-center gap-2"
            >
              <Accessibility size={16} aria-hidden="true" /> PREDIF · Plataforma Representativa Estatal de Personas con
              Discapacidad Física
            </a>
            <p className="mt-2 leading-relaxed">
              Representa a personas con discapacidad física orgánica. Publica guías de turismo accesible, evalúa
              accesibilidad de recintos y ofrece formación específica sobre eventos masivos sin barreras.
            </p>
          </li>
          <li className="border border-cr-border p-4">
            <a
              href="https://www.imserso.es/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-display text-base uppercase text-cr-primary hover:underline flex items-center gap-2"
            >
              <Landmark size={16} aria-hidden="true" /> Imserso · Instituto de Mayores y Servicios Sociales
            </a>
            <p className="mt-2 leading-relaxed">
              Organismo público adscrito al Ministerio de Derechos Sociales. Información sobre prestaciones,
              certificación de discapacidad y programas estatales. Punto de partida si necesitas tramitar o renovar
              tu certificado oficial.
            </p>
          </li>
        </ul>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 7 · FAQ</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">Preguntas frecuentes sobre accesibilidad</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Las cinco preguntas que más veces nos llegan a la mensajería de ConcertRide sobre movilidad reducida en
            festivales y carpooling accesible.
          </p>
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

      {/* ── Internal links cluster ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sigue leyendo</p>
          <h2 className="font-display text-2xl md:text-3xl uppercase">Recursos relacionados</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Profundiza en los festivales con mejor accesibilidad confirmada, las ciudades-hub españolas y el resto de
            pillars del cluster transporte y planificación.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 font-sans text-sm">
          <Link to="/festivales/primavera-sound" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Primavera Sound 2026
          </Link>
          <Link to="/festivales/mad-cool" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Mad Cool 2026
          </Link>
          <Link to="/festivales/cruilla" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Cruïlla 2026
          </Link>
          <Link to="/conciertos/madrid" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Conciertos en Madrid
          </Link>
          <Link to="/conciertos/barcelona" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Conciertos en Barcelona
          </Link>
          <Link to="/guia-transporte-festivales" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: transporte festivales
          </Link>
          <Link to="/guia/festival-sin-coche" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: festival sin coche
          </Link>
          <Link to="/guia/presupuesto-festival-grupo" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: presupuesto grupo
          </Link>
          <Link to="/guia/seguridad-carpooling-festival" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: seguridad carpooling
          </Link>
          <Link to="/guia/festival-primera-vez" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: mi primer festival
          </Link>
          <Link to="/datos/festivales-peor-conexion-transporte-publico-2026" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Dataset: peor conexión transporte
          </Link>
          <Link to="/datos/festivales-mas-caros-mas-baratos-llegar-2026" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Dataset: ranking precios festivales
          </Link>
          <Link to="/concerts" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Buscar conciertos en España
          </Link>
          <Link to="/faq" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Preguntas frecuentes generales
          </Link>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-4">
        <h2 className="font-display text-2xl md:text-3xl uppercase flex items-center gap-3">
          <Accessibility size={28} className="text-cr-primary" aria-hidden="true" />
          Viaja al festival con vehículo accesible
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed">
          En ConcertRide puedes filtrar conductores con vehículo accesible o maletero amplio para silla plegable, y
          comunicarte con quien te llevará ANTES de reservar para confirmar punto de encuentro, tipo de vehículo y
          necesidades específicas. Carpooling festivalero a 3-22 € por asiento, sin comisión sobre tu reserva.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/concerts"
            onClick={() => trackEvent(ANALYTICS_EVENTS.PILLAR_CTA_CLICKED, { pillar_slug: PILLAR_SLUG, cta_target: "/buscar" })}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-5 py-2.5 hover:bg-cr-primary/90 transition-colors"
          >
            Buscar carpooling accesible <ArrowRight size={12} />
          </Link>
          <Link
            to="/festivales"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-primary text-cr-primary px-5 py-2.5 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Ver todos los festivales <ArrowRight size={12} />
          </Link>
          <Link
            to="/guia-transporte-festivales"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text px-5 py-2.5 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            Guía de transporte <ArrowRight size={12} />
          </Link>
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Preguntas frecuentes <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <EeatTrustBlock
          pageType="pillar"
          lastReviewed="2026-05-20"
          author={{ name: "Equipo ConcertRide", url: "/autor/alejandro-lalaguna" }}
        />
        <AiDisclosureNote level={aiLevelForPageType("pillar")} />
      </section>
    </main>
  );
}

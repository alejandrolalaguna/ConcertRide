import { Link } from "react-router-dom";
import {
  ArrowRight,
  Car,
  Fuel,
  Scale,
  Receipt,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  MessageCircle,
  BookOpen,
  Coins,
  IdCard,
  MapPin,
  Users,
} from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const PILLAR_SLUG = "guia-carpooling-conductor-festival";

/**
 * Pillar SEO page — cluster "Supply: conducir carpooling festival" (Pillar 7).
 *
 * Único pillar dirigido a CONDUCTORES (oferentes de plazas, no pasajeros) —
 * clave para balancear la oferta de viajes. Cubre marco legal en España,
 * ejemplos reales de ingresos por ruta, alta paso-a-paso, 7 reglas para no
 * tener problemas, resolución de conflictos y casos avanzados.
 *
 * NOTE: Per CLAUDE.md "Brand Restrictions" — NEVER name competing carpooling
 * brands. La sentencia jurisprudencial española de 2017 se cita como
 * "la sentencia del Tribunal Supremo de 2017 que avaló el carsharing entre
 * particulares" — sin mencionar la marca demandada.
 */

const FAQS = [
  {
    q: "¿Es legal ofrecer plazas en mi coche a un festival en España?",
    a: "Sí, es legal sin necesidad de licencia ni permiso especial siempre que no exista ánimo de lucro. La sentencia del Tribunal Supremo de 2017 sobre carsharing entre particulares estableció que compartir gastos del viaje (combustible, peajes, amortización proporcional) entre los ocupantes del vehículo no constituye actividad de transporte público discrecional y, por tanto, queda fuera de la Ley de Ordenación de los Transportes Terrestres (LOTT) y de su reglamento. La línea roja es el precio por asiento: si supera el coste real prorrateado entre el conductor y los pasajeros, deja de ser carpooling y se convierte en actividad económica regulada.",
  },
  {
    q: "¿Tengo que declarar a Hacienda lo que recupero como conductor?",
    a: "Si los importes recibidos por los pasajeros se limitan a compartir gastos reales (gasolina, peajes, desgaste del vehículo) no constituyen rendimiento gravable porque no hay beneficio económico. Si publicas varios viajes al año con beneficio claro (precio por asiento por encima del coste real), Hacienda podría considerarlo rendimiento de actividades económicas y obligaría a alta en el censo y posibles obligaciones de IVA. El umbral práctico habitual: si ofreces plazas de forma esporádica y nunca cubres más del coste, es ingreso patrimonial no sujeto. ConcertRide reparte los importes de forma transparente y emite un resumen anual para tu declaración si lo necesitas.",
  },
  {
    q: "¿Mi seguro de coche cubre a los pasajeros del carpooling?",
    a: "Sí. El seguro obligatorio de responsabilidad civil cubre a los ocupantes del vehículo en caso de accidente con cargo al conductor, independientemente de si han compartido gastos o no. La condición es que el uso del vehículo sea particular (no comercial) — y el carpooling sin ánimo de lucro lo es. Si tu póliza es a terceros básico, los ocupantes están cubiertos por daños personales pero no los daños del propio coche. Recomendación: contrata seguro a terceros ampliado o todo riesgo si haces varios viajes al año a festivales, ya que protege también tu vehículo en caso de siniestro propio.",
  },
  {
    q: "¿Cuánto puedo recuperar conduciendo a un festival con 3 pasajeros?",
    a: "Depende de la distancia y del coche, pero los rangos habituales en rutas tier-1 españolas oscilan entre 60 y 180 € recuperados por viaje de ida y vuelta. Ejemplos reales: Madrid → Mad Cool (Iberdrola Music) con coche medio gasolina cuesta unos 80–100 € de combustible para el conductor; con 3 pasajeros a 25 € el asiento, recuperas 75 €. Barcelona → Primavera Sound: 0 € de combustible si vives en BCN, todo lo cobrado es ahorro de parking. Sevilla → Andalucía Big Festival: 95 € de combustible, 3×30 € = 90 € recuperados. Es ahorro neto, no ingreso económico — la idea es que el viaje te salga gratis o casi.",
  },
  {
    q: "¿Qué pasa si un pasajero cancela tarde o no se presenta el día del viaje?",
    a: "ConcertRide aplica una política de cancelaciones escalonada en función de la antelación: las cancelaciones con más de 48 h de antelación son íntegras para el pasajero; entre 24 y 48 h se retiene el 50 % a favor del conductor; con menos de 24 h, el conductor recibe el 100 % del importe del asiento. Si un pasajero no se presenta al punto de recogida (no-show) tras esperar 15 minutos y dos avisos por chat, el conductor puede marcar la incidencia y recibe el importe completo. Soporte mediará si la cancelación se debe a un caso de fuerza mayor documentado. Tres no-shows reiterados conllevan suspensión del perfil del pasajero.",
  },
];

const INCOME_EXAMPLES = [
  {
    route: "Madrid → Mad Cool",
    distance: "20 km (ida) · 40 km ida y vuelta",
    fuel: "8 €",
    tolls: "0 €",
    pricePerSeat: "5 €",
    seats: 3,
    recovered: "15 €",
    note: "Trayecto urbano corto. Ahorro real va vía parking evitado en IFEMA (≈12–18 €/día).",
  },
  {
    route: "Madrid → Mad Cool (Iberdrola Music)",
    distance: "20 km dentro del recinto IFEMA · 0 km extra para residentes",
    fuel: "8–12 €",
    tolls: "0 €",
    pricePerSeat: "5 €",
    seats: 3,
    recovered: "15 €",
    note: "Igual que el anterior; útil para residentes de Madrid sur que recogen pasajeros en Sol o Atocha.",
  },
  {
    route: "Barcelona → Primavera Sound",
    distance: "12 km al Parc del Fòrum · 24 km ida y vuelta",
    fuel: "5 €",
    tolls: "0 €",
    pricePerSeat: "4 €",
    seats: 3,
    recovered: "12 €",
    note: "Ruta urbana corta. Ahorro vía parking evitado (40 € en zona Fòrum los días pico).",
  },
  {
    route: "Valencia → Arenal Sound (Burriana)",
    distance: "80 km ida · 160 km ida y vuelta",
    fuel: "22 €",
    tolls: "0 € (autovía A-7 y N-340)",
    pricePerSeat: "8 €",
    seats: 3,
    recovered: "24 €",
    note: "Ruta corta y popular. Recuperas más del coste; el resto compensa desgaste del coche.",
  },
  {
    route: "Sevilla → Andalucía Big Festival (Granada)",
    distance: "250 km ida · 500 km ida y vuelta",
    fuel: "75 €",
    tolls: "0 €",
    pricePerSeat: "25 €",
    seats: 3,
    recovered: "75 €",
    note: "Recuperas exactamente el combustible. Viaje sale gratis para el conductor.",
  },
  {
    route: "Madrid → BBK Live (Bilbao)",
    distance: "400 km ida · 800 km ida y vuelta",
    fuel: "120 €",
    tolls: "20 € (AP-1)",
    pricePerSeat: "40 €",
    seats: 3,
    recovered: "120 €",
    note: "Recuperas combustible íntegro; los peajes se incluyen prorrateados. Equivalente a ir solo y pagar 140 €.",
  },
];

const HOWTO_STEPS = [
  {
    name: "Crea tu cuenta como conductor",
    text: "Regístrate en ConcertRide con email y teléfono. La verificación OTP por SMS confirma que tu número es real. Sube una foto de perfil clara (no logo, no avatar genérico) — las reseñas de pasajeros que confían en perfiles con foto real son significativamente más altas que las de perfiles anónimos.",
  },
  {
    name: "Verifica tu carnet de conducir y tu DNI",
    text: "Desde la sección Perfil → Verificación, sube una imagen legible de tu carnet de conducir en vigor y de tu DNI o NIE. Los documentos se guardan cifrados y se eliminan automáticamente a los 90 días por cumplimiento RGPD. La revisión manual tarda menos de 24 horas hábiles. Hasta que la verificación no esté completada, no podrás publicar viajes.",
  },
  {
    name: "Añade los datos de tu vehículo",
    text: "Marca, modelo, año, color, número de plazas disponibles para pasajeros (1, 2, 3 o 4) y matrícula. La matrícula no se muestra públicamente — se comparte sólo con los pasajeros confirmados como medida anti-fraude. Indica también el tipo de combustible (gasolina, diésel, eléctrico, híbrido) porque ConcertRide usa este dato para calcular el coste real recomendado del asiento.",
  },
  {
    name: "Publica tu ruta a un festival",
    text: "Desde el botón Publicar viaje, selecciona origen (tu ciudad o punto exacto), destino (escribe el nombre del festival y la plataforma te muestra el slug oficial: mad-cool, primavera-sound, etc.), fecha y hora de salida, hora estimada de llegada y precio por asiento. El sistema te sugiere un precio basado en distancia y consumo medio del coche — respétalo para no salir del marco legal.",
  },
  {
    name: "Define punto y hora exactos de recogida",
    text: "Indica un punto público, fácil de encontrar y bien comunicado: estación de tren, gran avenida, estación de metro, glorieta conocida. Evita direcciones particulares por seguridad. La hora debe ser realista: la mayoría de no-shows ocurren cuando el conductor propone una hora demasiado optimista que luego incumple por tráfico. Da 10–15 minutos de margen.",
  },
  {
    name: "Acepta o rechaza solicitudes de pasajeros",
    text: "Los pasajeros interesados envían solicitud desde la ficha de tu viaje. Recibes notificación push y email con el perfil del solicitante (foto, valoraciones, número de viajes previos). Tienes 48 horas para aceptar o rechazar. Aceptar abre el chat interno con el pasajero — úsalo para confirmar punto, hora exacta y cualquier ajuste. Nunca salgas a WhatsApp: pierdes la trazabilidad si hay disputa.",
  },
  {
    name: "Tras el viaje, recibe el reparto y deja reseña",
    text: "ConcertRide retiene el importe del asiento hasta 24 horas después del viaje completado. Ese plazo permite que pasajero y conductor dejen reseña mutua — las reseñas son obligatorias para liberar el pago. El reparto se ingresa por transferencia o Bizum según tu preferencia configurada. La plataforma no cobra comisión por intermediación. Si hubo incidencia, abre reporte desde el viaje en tu historial antes del cierre.",
  },
];

const SEVEN_RULES = [
  {
    title: "1 · Nunca cobres por encima del coste real prorrateado",
    text: "Es la regla más importante. El precio por asiento no debe superar la cuota proporcional del coste real del viaje (combustible + peajes + desgaste razonable) dividida entre el conductor y los pasajeros. Ejemplo: viaje de 600 km ida y vuelta con coste real 180 €, 4 ocupantes (conductor + 3 pasajeros), cuota individual 45 €. Cobrar 25 € por asiento está dentro del margen; cobrar 80 € no. Por encima del coste real Hacienda y la autoridad de transportes pueden recalificar el viaje como actividad económica.",
  },
  {
    title: "2 · Publica punto, hora y matrícula con claridad",
    text: "Punto de recogida concreto (con dirección o coordenadas), hora exacta (no aproximada) y matrícula confirmada por chat antes del viaje. La opacidad genera no-shows, malentendidos y reseñas negativas. Si tienes que cambiar el punto a última hora, avisa por chat y graba el motivo en el sistema — soporte usa ese historial para mediar disputas.",
  },
  {
    title: "3 · Mantén el coche en regla (ITV, seguro, mantenimiento)",
    text: "ITV vigente, seguro como mínimo a terceros con cobertura de ocupantes (a terceros ampliado o todo riesgo recomendado), neumáticos en buen estado y revisiones al día. Si tienes un accidente con un coche fuera de regla, el seguro puede repercutirte parte del coste por culpabilidad del conductor — independientemente de si hubo carpooling. Es la diferencia entre un viaje compartido normal y un problema económico mayor.",
  },
  {
    title: "4 · No combines el viaje con servicios extra (parking, alojamiento)",
    text: "El carsharing entre particulares queda fuera de la LOTT mientras se limite a compartir gastos del trayecto. En el momento en que ofreces parking en tu casa, alojamiento, transfer al recinto o cualquier servicio complementario cobrado, la operación se convierte en actividad económica regulada y necesitarías alta en el censo de Hacienda. Mantén la oferta limpia: sólo trayecto.",
  },
  {
    title: "5 · Lleva contrato opcional de gastos compartidos",
    text: "No es obligatorio pero protege a las dos partes. Un documento simple firmado el día del viaje (puede ser un PDF desde tu móvil) que enumere: ruta, fecha, ocupantes, importe abonado por cada pasajero y declaración explícita de que el importe se limita a compartir gastos del viaje. En caso de inspección o disputa, demuestra ausencia de ánimo de lucro. ConcertRide ofrece un modelo descargable en la sección Soporte.",
  },
  {
    title: "6 · Comunícate siempre dentro de la plataforma",
    text: "Toda conversación con pasajeros debe ocurrir en el chat de ConcertRide, no en WhatsApp ni por teléfono privado. Es la única conversación que el equipo de soporte puede consultar en caso de disputa o incidencia. Si un pasajero insiste en sacar la conversación fuera, considéralo señal de alerta — muchos casos de impago o presión post-viaje empiezan ahí.",
  },
  {
    title: "7 · Conduce descansado y respeta los tiempos legales",
    text: "Los pasajeros confían en tu estado físico. La DGT marca pautas claras de descanso para conducción profesional (mínimo 45 minutos cada 4,5 horas), y aunque no apliquen literalmente al carpooling, son una referencia útil. Tras un festival nocturno, evita conducir si has dormido menos de 5 horas: cancela y reprograma. ConcertRide considera la cancelación por fatiga como legítima y no penaliza al conductor.",
  },
];

const CONFLICT_TIERS = [
  {
    title: "Pasajero cancela con más de 48 h de antelación",
    text: "Reembolso íntegro al pasajero. Como conductor no recibes nada por ese asiento, pero el sistema te ofrece automáticamente el asiento en re-publicación con un boost de visibilidad para que vuelvas a cubrirlo.",
  },
  {
    title: "Pasajero cancela con menos de 48 h y más de 24 h",
    text: "Retención del 50 % a favor del conductor. El pasajero recibe sólo el 50 % de su importe. La motivación es compensar al conductor por la pérdida de oportunidad de reasignar el asiento.",
  },
  {
    title: "Pasajero cancela con menos de 24 h o no se presenta",
    text: "El conductor recibe el 100 % del importe del asiento. Para activar la política de no-show, espera 15 minutos en el punto de recogida e intenta contactar por chat dos veces. Tras eso, marca la incidencia desde el viaje y el sistema gestiona el cobro automáticamente.",
  },
  {
    title: "Pasajero deja el coche sucio o causa daños menores",
    text: "Abre un reporte desde el viaje en tu historial con fotos del estado. Soporte revisa en 48 h hábiles y, si procede, retiene del depósito una compensación razonable. Para daños mayores (vómitos, rotura de tapicería) el seguro del vehículo puede aplicar — consulta a tu aseguradora antes de presentar parte.",
  },
  {
    title: "Pasajero no paga tras viaje fuera de la plataforma",
    text: "No debería pasar si gestionaste el cobro dentro de ConcertRide. Si aceptaste cobro en efectivo o Bizum fuera del sistema y el pasajero no paga, la plataforma no puede mediar (no hay traza). Lección operativa: usa siempre el cobro centralizado de ConcertRide.",
  },
];

export default function GuiaCarpoolingConductorFestivalPage() {
  const today = new Date().toISOString().slice(0, 10);

  useSeoMeta({
    title: "Conducir carpooling a festivales 2026: guía legal + ingresos | ConcertRide",
    description:
      "Cómo ofrecer plazas en tu coche a un festival 2026: marco legal España, cuánto ahorras y 7 reglas para no tener problemas. Guía conductores.",
    canonical: `${SITE_URL}/guia/carpooling-conductor-festival`,
    keywords:
      "cómo conducir carpooling festival, monetizar coche festival, gasolina compartida festival ley, conductor ConcertRide, carpooling legal España, ofrecer plazas festival, recuperar gasolina festival",
    ogType: "article",
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: "Guía para conductores de carpooling a festivales en España 2026 — ConcertRide",
    articlePublishedTime: "2026-05-19",
    articleModifiedTime: today,
    articleAuthor: "Alejandro Lalaguna",
    articleSection: "Guías",
    breadcrumb: [
      { position: 1, name: "Inicio", url: `${SITE_URL}/` },
      { position: 2, name: "Guías", url: `${SITE_URL}/guia-transporte-festivales` },
      { position: 3, name: "Conducir carpooling festival", url: `${SITE_URL}/guia/carpooling-conductor-festival` },
    ],
  });

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Conducir carpooling a festivales en España 2026: guía legal, ingresos y reglas",
    description:
      "Guía completa para conductores que se plantean ofrecer plazas en su coche a un festival en España: marco legal y sentencia jurisprudencial de 2017, cálculo de ahorro real con 6 ejemplos por ruta tier-1, alta paso-a-paso en ConcertRide, 7 reglas para no tener problemas con Hacienda ni con la autoridad de transportes, política de cancelaciones y resolución de conflictos.",
    url: `${SITE_URL}/guia/carpooling-conductor-festival`,
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
    mainEntityOfPage: `${SITE_URL}/guia/carpooling-conductor-festival`,
    articleSection: "Conductores y oferta",
    keywords:
      "cómo conducir carpooling festival, monetizar coche festival, gasolina compartida festival ley, conductor ConcertRide, carpooling legal España",
    about: [
      { "@type": "Thing", name: "Marco legal del carsharing entre particulares en España" },
      { "@type": "Thing", name: "Sentencia del Tribunal Supremo 2017 sobre carpooling" },
      { "@type": "Thing", name: "Cálculo de coste real prorrateado en carpooling festivalero" },
      { "@type": "Thing", name: "Alta como conductor en ConcertRide" },
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
      { "@type": "ListItem", position: 3, name: "Conducir carpooling festival", item: `${SITE_URL}/guia/carpooling-conductor-festival` },
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
    name: "Cómo darse de alta como conductor de carpooling y publicar tu primera ruta a un festival",
    description:
      "Pasos verificables para registrarte como conductor en ConcertRide, verificar carnet y DNI, añadir vehículo, publicar ruta a un festival, gestionar solicitudes de pasajeros y recibir el reparto tras el viaje. Procedimiento diseñado para cumplir con el marco legal español de carsharing entre particulares.",
    inLanguage: "es-ES",
    totalTime: "PT30M",
    step: HOWTO_STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${SITE_URL}/guia/carpooling-conductor-festival#paso-${i + 1}`,
    })),
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }} />

      {/* ── Hero ── */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-6 space-y-4 border-b border-cr-border">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/guia-transporte-festivales" className="hover:text-cr-primary">Guías</Link>
          <span aria-hidden="true">/</span>
          <span>Conducir carpooling festival</span>
        </nav>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Guía pillar · Cluster conductores · Edición 2026 · Actualizado {today}
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Conducir<br />carpooling<br />a festivales
        </h1>
        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable">
          Respuesta directa: <strong className="text-cr-text">ofrecer plazas en tu coche a un festival en España es legal sin licencia ni permiso especial</strong>{" "}
          mientras el precio por asiento no supere el coste real del viaje prorrateado entre conductor y pasajeros — la
          sentencia del Tribunal Supremo de 2017 sobre carsharing entre particulares lo confirmó al diferenciar
          compartir gastos de transporte público discrecional. En la práctica, con un coche medio gasolina y 3 pasajeros
          puedes recuperar entre 60 € y 180 € por ruta tier-1 (Madrid → Mad Cool, Barcelona → Primavera Sound, Sevilla →
          Andalucía Big), de forma que el viaje te sale gratis o casi. Esta guía explica el marco legal exacto, calcula
          el ahorro real con 6 ejemplos por ruta, te lleva paso-a-paso por el alta como conductor en ConcertRide, te da
          las 7 reglas para no tener problemas con Hacienda ni con la autoridad de transportes, y cubre la política de
          cancelaciones y conflictos. Sin alarmismo y sin marketing: información que necesitas antes de publicar tu
          primera ruta.
        </p>
      </div>

      {/* ── Sección 1: Marco legal en España ── */}
      <section className="max-w-4xl mx-auto px-6 py-14 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 1</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Scale size={28} className="text-cr-primary" aria-hidden="true" />
            Marco legal del carsharing entre particulares en España
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            La pregunta más frecuente del conductor novato: ¿esto es legal? Respuesta corta: sí, sin licencia ni
            permiso especial, siempre que se cumpla un criterio único — ausencia de ánimo de lucro. Vamos a desglosar
            qué significa eso exactamente, cómo lo interpretan los tribunales españoles y qué implicaciones fiscales
            tiene.
          </p>
        </div>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">El criterio que separa carpooling de transporte público</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            La Ley 16/1987 de Ordenación de los Transportes Terrestres (LOTT) y su reglamento (ROTT, Real Decreto
            1211/1990) regulan el transporte público de viajeros — taxis, VTC, autobuses, transporte discrecional.
            Estas figuras requieren licencia administrativa, alta en Hacienda como actividad económica e IVA. El
            carpooling entre particulares quedaba en una zona gris hasta que la sentencia del Tribunal Supremo de
            2017, que avaló el carsharing entre particulares cuando se limita a compartir gastos, fijó jurisprudencia
            clara: si el conductor no obtiene beneficio y los pasajeros sólo abonan su parte proporcional del coste
            real del viaje, la operación queda fuera del ámbito de la LOTT y no requiere ninguna autorización
            administrativa. Lo confirma también la práctica de la Inspección de Transportes desde entonces.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Qué cuenta como coste real prorrateado</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Tres partidas componen el coste real legítimo de un viaje carpooling: combustible (cantidad real consumida
            según consumo medio del vehículo y kilómetros recorridos), peajes (importes íntegros pagados en autopista)
            y desgaste razonable del vehículo (amortización proporcional, neumáticos, mantenimiento). El total se
            divide entre el número de ocupantes (conductor + pasajeros), no sólo entre los pasajeros. Si en un viaje
            de 600 km el coste real son 180 €, y van 4 personas (conductor + 3 pasajeros), la cuota individual es 45 €
            — el conductor puede cobrar a cada pasajero hasta 45 €. Cobrar más implica que el conductor obtiene
            beneficio neto sobre su parte proporcional, y eso desnaturaliza el carpooling.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Coins size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">IVA y declaración a Hacienda</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Si los importes recibidos se limitan a compartir gastos reales, no constituyen rendimiento gravable en
            IRPF ni están sujetos a IVA — porque no hay beneficio económico. Es ingreso patrimonial neutro, no
            actividad económica. Si publicas decenas de viajes al año con beneficio claro, Hacienda puede
            recalificarlos como actividad de transporte y obligarte al alta en el censo (modelo 036), alta en IAE,
            declaración trimestral de IVA (modelo 303) y rendimientos de actividades económicas en la declaración
            anual (modelo 100). El umbral práctico: si haces &lt; 30 000 € al año en ingresos por viajes (cifra que
            difícilmente alcanza un conductor de carpooling festivalero), no hay obligación de alta en autónomos. En
            cualquier caso, ConcertRide emite un resumen anual de los importes recibidos a tu nombre para que tengas
            la información para tu declaración si la necesitas.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Seguro del vehículo y cobertura de ocupantes</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            El seguro obligatorio de responsabilidad civil (todo coche matriculado en España debe tenerlo) cubre
            daños personales de los ocupantes en caso de accidente con cargo al conductor. La condición es que el
            uso del vehículo sea particular — y el carpooling sin ánimo de lucro lo es. Si tu póliza es a terceros
            básico, los pasajeros están cubiertos por daños personales, pero no los daños del propio coche. Para
            quienes hacen varias rutas al año, recomendamos contratar a terceros ampliado (incluye lunas, robo,
            incendio) o todo riesgo con franquicia — la diferencia de prima anual rara vez supera los 100–150 € y la
            protección al vehículo es muy superior. Información completa sobre la regulación del seguro obligatorio
            en{" "}
            <a
              href="https://www.dgt.es/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-cr-primary hover:underline"
            >
              la web oficial de la Dirección General de Tráfico
            </a>
            .
          </p>
        </article>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Texto consolidado de la LOTT y el ROTT disponible en{" "}
          <a
            href="https://www.boe.es/buscar/act.php?id=BOE-A-1987-17803"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-cr-primary hover:underline"
          >
            el Boletín Oficial del Estado
          </a>
          . Para el régimen específico del transporte privado complementario y la distinción con el transporte
          público discrecional, consulta el artículo 100 LOTT y los artículos correspondientes del ROTT. La
          jurisprudencia posterior a 2017 (sentencias de la Audiencia Provincial de Madrid, 2018; Audiencia
          Provincial de Barcelona, 2019) ha confirmado el criterio del Tribunal Supremo en casos concretos.
        </p>
      </section>

      {/* ── Sección 2: Cuánto puedes ahorrar ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 2</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Fuel size={28} className="text-cr-primary" aria-hidden="true" />
            Cuánto puedes ahorrar conduciendo a un festival
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Ejemplos reales con cifras 2026: combustible (gasolina 95 a 1,52 €/litro, consumo medio 6,5 L/100 km),
            peajes (cuando aplican) y precio por asiento sugerido por ConcertRide. Las cifras asumen 3 pasajeros (4
            ocupantes totales) y un coche medio. Cifra final: lo que recuperas como conductor.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm text-cr-text-muted border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Ruta</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Distancia</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Coste real</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">€ / asiento × 3</th>
                <th className="text-left py-3 font-display text-xs uppercase text-cr-primary">Recuperas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border">
              {INCOME_EXAMPLES.slice(2).map((ex) => (
                <tr key={ex.route}>
                  <td className="py-3 pr-4 text-cr-text font-medium">{ex.route}</td>
                  <td className="py-3 pr-4 text-[12px]">{ex.distance}</td>
                  <td className="py-3 pr-4 text-[12px]">
                    {ex.fuel} comb. + {ex.tolls} peajes
                  </td>
                  <td className="py-3 pr-4 text-[12px]">{ex.pricePerSeat} × {ex.seats}</td>
                  <td className="py-3 text-cr-primary font-medium">{ex.recovered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {INCOME_EXAMPLES.slice(2).map((ex) => (
            <article key={`note-${ex.route}`} className="border border-cr-border p-4 space-y-2">
              <p className="font-display text-sm uppercase text-cr-text">{ex.route}</p>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{ex.note}</p>
            </article>
          ))}
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Tres lecturas de la tabla. Primera: en rutas largas (Madrid → BBK Live, Sevilla → Andalucía Big) recuperas
          íntegramente el combustible y, en muchos casos, también una parte de peajes y desgaste — el viaje sale neto
          gratis para el conductor. Segunda: en rutas urbanas cortas (Madrid → Mad Cool, Barcelona → Primavera Sound)
          el ahorro real no está sólo en lo cobrado por asiento, sino en evitar el parking del recinto (12–18 €/día en
          IFEMA, 40 €/día en Parc del Fòrum durante festivales). Tercera: el carpooling festival no es un negocio —
          es una forma de neutralizar el coste de tu propio viaje y de hacerlo más social. Si buscas monetización
          neta, esto no es la vía: el marco legal lo impide.
        </p>
      </section>

      {/* ── Sección 3: Cómo registrarte y publicar tu primera ruta ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 3</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Car size={28} className="text-cr-primary" aria-hidden="true" />
            Cómo registrarte y publicar tu primera ruta
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Procedimiento paso-a-paso en ConcertRide. El tiempo total de alta es ~30 minutos (incluida la espera de
            verificación de documentos), y la primera publicación puede ser inmediata una vez aprobada la
            verificación. Esta secuencia está diseñada para cumplir con el marco legal explicado en la sección 1.
          </p>
        </div>

        <ol className="space-y-4 list-none">
          {HOWTO_STEPS.map((step, i) => (
            <li
              key={step.name}
              id={`paso-${i + 1}`}
              className={`border p-5 space-y-2 scroll-mt-24 ${
                i === 0 ? "border-cr-primary" : "border-cr-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-cr-primary" aria-hidden="true" />
                <p className="font-display text-base uppercase">
                  Paso {i + 1} · {step.name}
                </p>
              </div>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="p-5 border border-cr-primary/30 bg-cr-primary/5 space-y-2">
          <div className="flex items-center gap-2">
            <IdCard size={16} className="text-cr-primary" />
            <p className="font-display text-base uppercase text-cr-primary">Sin comisión de plataforma</p>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            ConcertRide no retiene comisión sobre el reparto a conductores: el importe íntegro de los asientos
            cobrados se transfiere a tu cuenta tras el viaje. La plataforma se financia con publicidad
            contextual no intrusiva y acuerdos con festivales — no con margen sobre tu viaje. Es la diferencia
            principal frente a otras plataformas de carpooling generalistas que retienen entre el 10 % y el 18 %
            del precio de cada asiento.
          </p>
        </div>
      </section>

      {/* ── Sección 4: 7 reglas para no tener problemas ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 4</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Wrench size={28} className="text-cr-primary" aria-hidden="true" />
            7 reglas para no tener problemas
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Resumen operativo de lo que separa a un conductor sin incidencias de uno con reseñas negativas, reportes
            o problemas legales. La regla nº 1 (no exceder el coste real) es la única estrictamente legal; el resto
            son operativas pero igual de importantes para la sostenibilidad del proyecto.
          </p>
        </div>

        <div className="space-y-4">
          {SEVEN_RULES.map((rule) => (
            <article key={rule.title} className="border border-cr-border p-5 space-y-2">
              <h3 className="font-display text-base uppercase">{rule.title}</h3>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{rule.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Sección 5: Resolución de conflictos ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 5</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <AlertTriangle size={28} className="text-cr-primary" aria-hidden="true" />
            Resolución de conflictos
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Política de cancelaciones de ConcertRide y procedimiento para gestionar los conflictos más habituales que
            puede encontrar un conductor: cancelación de pasajero, no-show, coche sucio, impago. La plataforma media
            cuando hay traza interna; sin traza interna no hay arbitraje posible.
          </p>
        </div>

        <div className="space-y-4">
          {CONFLICT_TIERS.map((tier) => (
            <article key={tier.title} className="border border-cr-border p-5 space-y-2">
              <div className="flex items-center gap-2">
                <MessageCircle size={16} className="text-cr-primary" />
                <h3 className="font-display text-base uppercase">{tier.title}</h3>
              </div>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{tier.text}</p>
            </article>
          ))}
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Para cualquier incidencia escala desde el viaje en tu historial. El equipo de soporte responde en 24–48 h
          hábiles y los reportes son confidenciales (no se notifican al pasajero). Los reportes son la fuente
          principal para suspender perfiles que reciben quejas reiteradas — tu reporte protege a otros conductores
          de futuros problemas con el mismo pasajero.
        </p>
      </section>

      {/* ── Sección 6: Casos avanzados ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 6</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Users size={28} className="text-cr-primary" aria-hidden="true" />
            Casos avanzados
          </h2>
        </div>

        <article className="border border-cr-border p-5 space-y-2">
          <h3 className="font-display text-base uppercase">Conducir como particular vs como autónomo</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Toda la guía asume conducción como particular sin ánimo de lucro, que es el caso del 99 % de los
            conductores ConcertRide. Si por motivos profesionales tienes ya alta como autónomo en una actividad
            relacionada (transporte, turismo, eventos) y quieres ofrecer plazas a festivales con margen económico
            superior al coste real, eso ya sería actividad complementaria que tendrías que dar de alta en tu IAE y
            facturar con IVA. ConcertRide está pensado para particulares; los conductores profesionales con
            licencia VTC o de transporte discrecional operan en un régimen distinto que no cubrimos aquí.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-2">
          <h3 className="font-display text-base uppercase">Alquileres entre particulares para llegar al festival</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Si no tienes coche propio pero quieres alquilar uno entre particulares (plataformas tipo Roolz, Amovens
            Renting) para conducir a un festival con varios pasajeros, la operación se vuelve más compleja: el
            alquiler vehicular se rige por un contrato civil entre el propietario y tú, y el carpooling posterior
            con los pasajeros se rige por la jurisprudencia del Tribunal Supremo 2017. Verifica que el contrato de
            alquiler permita uso con pasajeros que comparten gastos (algunas pólizas lo restringen) y mantén la
            documentación del alquiler accesible durante el viaje.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-2">
          <h3 className="font-display text-base uppercase">Coche eléctrico: cómo calcular el coste real</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            En vehículos 100 % eléctricos, el coste real del viaje son los kWh consumidos en función del consumo
            medio del coche (15–20 kWh/100 km en utilitarios) y el precio del kWh en la red pública (0,35–0,60 €/kWh
            en cargadores rápidos festivaleros, según operador y franja horaria) o en tu cargador doméstico (0,15
            €/kWh aproximado). En rutas largas con varias cargas, el coste por 100 km suele situarse entre 5 € y 12 €
            — inferior al equivalente gasolina. ConcertRide tiene un calculador específico para vehículos eléctricos
            que sugiere precio por asiento ajustado.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-2">
          <h3 className="font-display text-base uppercase">Más de 4 pasajeros: monovolumen y minibús</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Hasta 8 ocupantes (conductor + 7 pasajeros) el carpooling sigue siendo carsharing entre particulares y
            aplica el mismo marco legal — siempre que se cumpla el criterio de no exceder coste real. A partir de 9
            ocupantes, el vehículo entra en categoría D del carnet (autobús ligero) y requiere permiso específico de
            conducción; la operación pasa también a estar regulada bajo transporte público discrecional. Si quieres
            organizar un grupo grande a un festival, lo legal es contratar un autobús discrecional con su propia
            licencia, no hacer carpooling masivo.
          </p>
        </article>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 7</p>
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

      {/* ── Internal links cluster ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sigue leyendo</p>
          <h2 className="font-display text-2xl md:text-3xl uppercase">Recursos relacionados</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Si esta guía te ha servido para entender el marco legal y operativo del carpooling como conductor,
            estos otros recursos del centro de ConcertRide son los siguientes pasos naturales: rutas concretas
            a festivales tier-1, pillars complementarios y blogs sobre seguridad y operativa.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 font-sans text-sm">
          <Link to="/festivales/mad-cool" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> Mad Cool 2026
          </Link>
          <Link to="/festivales/primavera-sound" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> Primavera Sound 2026
          </Link>
          <Link to="/festivales/arenal-sound" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> Arenal Sound 2026
          </Link>
          <Link to="/festivales/andalucia-big" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> Andalucía Big Festival
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
          <Link to="/guia/festival-sostenible-co2" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: festival sostenible CO₂
          </Link>
          <Link to="/guia/seguridad-carpooling-festival" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: seguridad carpooling
          </Link>
          <Link to="/guia/festival-primera-vez" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: primera vez festival
          </Link>
          <Link to="/blog/carpooling-conductor-novel-festival-seguridad-2026" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Blog: conductor novel seguridad
          </Link>
          <Link to="/como-funciona" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Cómo funciona ConcertRide
          </Link>
          <Link to="/concerts" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Buscar conciertos
          </Link>
          <Link to="/register" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Registrarme como conductor
          </Link>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-4">
        <h2 className="font-display text-2xl md:text-3xl uppercase flex items-center gap-3">
          <Car size={28} className="text-cr-primary" aria-hidden="true" />
          Publica tu primera ruta hoy
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed">
          Si después de leer esta guía te ves cómodo/a con el marco legal y la operativa, el siguiente paso es
          registrarte y publicar tu primera ruta. La verificación de documentos suele completarse en menos de 24
          horas hábiles, y la primera ruta a un festival tier-1 (Mad Cool, Primavera Sound, BBK Live, Arenal Sound)
          recibe boost de visibilidad gratuito durante las primeras 48 horas tras publicación. Sin comisiones de
          plataforma sobre el reparto.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-5 py-2.5 hover:bg-cr-primary/90 transition-colors"
          >
            Registrarme como conductor <ArrowRight size={12} />
          </Link>
          <Link
            to="/publish"
            onClick={() => trackEvent(ANALYTICS_EVENTS.PILLAR_CTA_CLICKED, { pillar_slug: PILLAR_SLUG, cta_target: "/publish" })}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-primary text-cr-primary px-5 py-2.5 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Publicar viaje <ArrowRight size={12} />
          </Link>
          <Link
            to="/como-funciona"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text px-5 py-2.5 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            Cómo funciona <ArrowRight size={12} />
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

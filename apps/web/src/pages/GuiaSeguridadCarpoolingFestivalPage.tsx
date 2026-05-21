import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  IdCard,
  Star,
  MessageCircle,
  MapPin,
  Phone,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  Lock,
  Users,
  Car,
  Bus,
  Train,
  HeartHandshake,
  LifeBuoy,
} from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const PILLAR_SLUG = "guia-seguridad-carpooling-festival";

/**
 * Pillar SEO page — cluster "Decision: seguridad carpooling festival".
 *
 * Targets: "es seguro carpooling", "seguridad coche compartido festival",
 * "precauciones carpooling extraños", "carpooling chicas solas seguro",
 * "carpooling seguro España". Decision-stage cluster orientado a manejar la
 * objeción nº1 ("¿es seguro?") antes de la reserva. Tono empático, no
 * minimizador, sin alarmismo. Datos cualitativos cuando no hay fuente
 * verificable.
 *
 * NOTE: Per CLAUDE.md "Brand Restrictions" — NEVER name competing carpooling
 * brands. Si hace falta referirse a la competencia genérica usar siempre
 * "otras plataformas de carpooling" o "plataformas generalistas de carpooling".
 */

const FAQS = [
  {
    q: "¿Es seguro el carpooling para ir a un festival en España?",
    a: "Sí, es seguro siempre que uses una plataforma con conductores verificados, perfiles públicos con valoraciones y un canal de soporte real. ConcertRide exige carnet de conducir verificado antes de publicar un viaje, perfil con foto, número de teléfono confirmado por OTP y un historial de reseñas público. Recomendaciones prácticas: comparte la matrícula y los datos del viaje con un familiar o amigo, paga al conductor en el momento de subir o al llegar (efectivo o Bizum), y revisa las valoraciones previas antes de reservar. Conducir solo de madrugada tras un festival es más arriesgado estadísticamente que viajar como pasajero acompañado, según pautas habituales de la DGT sobre fatiga y conducción nocturna.",
  },
  {
    q: "¿Cómo verifica ConcertRide a los conductores?",
    a: "ConcertRide aplica cinco capas de verificación antes de permitir publicar un viaje: (1) email verificado por enlace, (2) número de teléfono confirmado mediante código OTP, (3) carnet de conducir subido y revisado antes de la primera publicación, (4) foto de perfil obligatoria y revisada para evitar imágenes anónimas o de stock, y (5) sistema de valoraciones públicas tras cada viaje completado. Un conductor sin esas verificaciones no aparece en los resultados de búsqueda. Las reseñas no se pueden borrar y muestran el porcentaje de viajes con 5 estrellas.",
  },
  {
    q: "¿Es seguro el carpooling para mujeres que viajan solas?",
    a: "Sí, y la plataforma ofrece varios mecanismos opcionales pensados para reforzar esa seguridad sin condicionar la experiencia. Antes de reservar puedes ver foto, valoraciones detalladas y reseñas escritas por otras pasajeras; puedes contactar al conductor por chat dentro de la app para hacer preguntas; y puedes compartir el itinerario en vivo con un contacto de confianza. Recomendaciones generales: prioriza coches con varias plazas ya ocupadas frente a viajes 1-a-1 con conductor desconocido, confirma la matrícula antes de subir, y mantén el móvil cargado con la app de ConcertRide abierta durante el trayecto para tener el soporte 24/7 a un toque.",
  },
  {
    q: "¿Qué hacer si el conductor no es como decía el perfil o no me siento seguro/a?",
    a: "Tienes tres opciones inmediatas y todas son legítimas. Primera: cancelar el viaje antes de subir, aunque pierdas el sitio reservado — ConcertRide reembolsa íntegramente cualquier importe pagado por la plataforma si la cancelación se debe a una incidencia de seguridad. Segunda: durante el trayecto, pide bajar en una zona segura (gasolinera, área de servicio, núcleo urbano) y contacta soporte desde la app — el chat de incidencias responde 24/7 los días de festival. Tercera: si hay riesgo real, llama al 112 (emergencias) o 091 (Policía Nacional). En ningún caso pierdes el derecho a un reembolso por priorizar tu seguridad.",
  },
  {
    q: "¿Qué cubre el seguro del coche en un viaje carpooling?",
    a: "El viaje está cubierto por el seguro obligatorio de responsabilidad civil del vehículo del conductor, igual que cualquier desplazamiento como ocupante de un coche particular. Eso significa que en caso de accidente la aseguradora cubre los daños personales del pasajero según lo establecido por la legislación española de seguros de automóvil. ConcertRide exige a los conductores tener ITV vigente y seguro en regla antes de publicar viajes, pero no sustituye al seguro del vehículo. Si quieres protección adicional, puedes contratar un seguro de viaje personal — habitual entre quienes viajan a festivales rurales con frecuencia.",
  },
];

const COMPARISON = [
  {
    mode: "Coche individual nocturno",
    icon: Car,
    riesgo: "Alto",
    riesgoColor: "secondary",
    factor: "Fatiga del conductor tras 8–12 h de festival; somnolencia documentada por DGT como factor en un porcentaje relevante de accidentes nocturnos en carretera secundaria.",
  },
  {
    mode: "Carpooling verificado",
    icon: Users,
    riesgo: "Bajo",
    riesgoColor: "primary",
    factor: "Conductores con carnet verificado, perfil público, valoraciones acumuladas. Reducción de fatiga al ir acompañado y poder turnarse en algunos casos. Trazabilidad completa del viaje en la plataforma.",
  },
  {
    mode: "Taxi nocturno",
    icon: Car,
    riesgoColor: "mid",
    riesgo: "Medio",
    factor: "Conductor profesional con licencia, pero ausencia de valoración pública. Tarifas nocturnas elevadas en zonas rurales pueden incentivar trayectos largos no planificados.",
  },
  {
    mode: "Autobús lanzadera festival",
    icon: Bus,
    riesgo: "Bajo",
    riesgoColor: "primary",
    factor: "Conductor profesional, vehículo certificado, grupo numeroso. Punto débil habitual: horario fijo de regreso (suele ser 1 sola salida de madrugada) que obliga a esperar en zonas oscuras.",
  },
  {
    mode: "Tren nocturno + lanzadera",
    icon: Train,
    riesgo: "Bajo",
    riesgoColor: "primary",
    factor: "Personal de seguridad en estación y a bordo. Punto débil habitual: poca cobertura nocturna en festivales rurales; vuelta de madrugada raramente disponible (Renfe no opera de 02:00 a 06:00 en muchas rutas).",
  },
];

const CHECKLIST_STEPS = [
  {
    name: "Revisa el perfil del conductor antes de reservar",
    text: "Comprueba foto real (no logo ni avatar genérico), valoraciones acumuladas (5 reseñas o más es un buen mínimo), porcentaje de viajes con 5 estrellas y antigüedad en la plataforma. Si el conductor tiene menos de 3 viajes completados, prioriza coches con varias plazas ya ocupadas.",
  },
  {
    name: "Lee al menos 3 reseñas escritas (no sólo la nota numérica)",
    text: "Las reseñas escritas dan contexto sobre el estilo de conducción, la puntualidad, la limpieza del coche y el ambiente del viaje. Si una reseña menciona retrasos repetidos, exceso de velocidad o cambios de última hora, considéralo una señal de alerta.",
  },
  {
    name: "Inicia conversación por chat antes de subir",
    text: "Usa el chat dentro de la app (no WhatsApp ni teléfono privado) para confirmar la hora exacta, el punto de recogida y la matrícula del coche. Si el conductor te pide salir del chat de la plataforma, considéralo una señal de alerta — la trazabilidad se pierde fuera de ConcertRide.",
  },
  {
    name: "Comparte el itinerario con un contacto de confianza",
    text: "Antes de salir, envía a un familiar o amigo: nombre y foto del conductor, matrícula, ruta exacta, hora de salida y hora estimada de llegada. La función de itinerario en vivo de la app permite hacerlo en un toque, pero también vale un mensaje manual con captura de la reserva.",
  },
  {
    name: "Confirma la matrícula del coche antes de subir",
    text: "Coteja la matrícula visible del vehículo con la que aparece en la reserva. Si no coincide o no aparece, no subas: pide al conductor que lo justifique por chat antes y, si no es convincente, cancela. ConcertRide reembolsa íntegramente las cancelaciones por discrepancia de matrícula.",
  },
  {
    name: "Lleva el móvil cargado y con datos",
    text: "Es la herramienta de seguridad nº1 durante el viaje: te permite contactar soporte 24/7, compartir ubicación en vivo, llamar a emergencias (112) y consultar la reserva. Lleva un cable o una batería externa para tenerlo siempre operativo, sobre todo en festivales de varios días.",
  },
  {
    name: "Paga al subir o al llegar — nunca por adelantado fuera de la app",
    text: "ConcertRide nunca te pide pagar por adelantado fuera de la plataforma. Si un conductor te pide transferencia o Bizum antes del día del viaje, considéralo una estafa potencial y reporta la incidencia a soporte desde la app.",
  },
  {
    name: "Confía en tu instinto — bajar es siempre una opción",
    text: "Si durante el trayecto algo no te encaja (conducción agresiva, comentarios incómodos, alteración del recorrido sin motivo claro), pide bajar en una zona segura: gasolinera, área de servicio, núcleo urbano. ConcertRide considera este motivo como cancelación legítima y reembolsa la parte no consumida del viaje.",
  },
  {
    name: "Deja una reseña honesta tras el trayecto",
    text: "Tu reseña ayuda a otros pasajeros a decidir y, si fue mala, también ayuda al equipo de ConcertRide a actuar. Las reseñas no se pueden borrar y son la principal capa de control de calidad en la plataforma. Sé concreto/a, no anónimo en el contenido aunque el formulario sea breve.",
  },
  {
    name: "Reporta cualquier incidencia desde la app",
    text: "El botón de reporte está dentro de cada viaje en tu historial. Es confidencial, lo lee el equipo de soporte directamente, y no notifica al conductor. Los reportes son la fuente principal para suspender perfiles que reciben quejas repetidas — tu reporte protege a los siguientes pasajeros.",
  },
];

export default function GuiaSeguridadCarpoolingFestivalPage() {
  const today = new Date().toISOString().slice(0, 10);

  useSeoMeta({
    title: "¿Es seguro el carpooling a festivales? Guía 2026 | ConcertRide",
    description:
      "Carpooling a festivales en España: mecanismos de control, comparativa seguridad, checklist 10 pasos y específico para mujeres. Guía 2026.",
    canonical: `${SITE_URL}/guia/seguridad-carpooling-festival`,
    keywords:
      "es seguro carpooling, seguridad coche compartido festival, precauciones carpooling extraños, carpooling chicas solas seguro, seguridad festival España, carpooling seguro España, coche compartido seguro",
    ogType: "article",
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: "Guía de seguridad carpooling a festivales en España 2026 — ConcertRide",
    articlePublishedTime: "2026-05-18",
    articleModifiedTime: today,
    articleAuthor: "Equipo ConcertRide",
    articleSection: "Guías",
    breadcrumb: [
      { position: 1, name: "Inicio", url: `${SITE_URL}/` },
      { position: 2, name: "Guías", url: `${SITE_URL}/guia-transporte-festivales` },
      { position: 3, name: "Seguridad carpooling festival", url: `${SITE_URL}/guia/seguridad-carpooling-festival` },
    ],
  });

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "¿Es seguro el carpooling para ir a un festival en España? Guía completa 2026",
    description:
      "Guía citable y empática sobre la seguridad del carpooling a festivales en España: cinco mecanismos de verificación de ConcertRide, comparativa de seguridad por modalidad, checklist de 10 pasos prácticos, secciones específicas para mujeres y colectivos vulnerables y protocolo de actuación ante incidencias.",
    url: `${SITE_URL}/guia/seguridad-carpooling-festival`,
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
    mainEntityOfPage: `${SITE_URL}/guia/seguridad-carpooling-festival`,
    articleSection: "Seguridad y confianza",
    keywords:
      "es seguro carpooling, seguridad coche compartido festival, carpooling chicas solas seguro, precauciones carpooling extraños, carpooling seguro España",
    about: [
      { "@type": "Thing", name: "Seguridad en plataformas de carpooling" },
      { "@type": "Thing", name: "Verificación de conductores en ConcertRide" },
      { "@type": "Thing", name: "Protocolo de seguridad para pasajeras y pasajeros en festivales" },
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
      { "@type": "ListItem", position: 3, name: "Seguridad carpooling festival", item: `${SITE_URL}/guia/seguridad-carpooling-festival` },
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
    name: "Checklist de 10 pasos para un viaje carpooling seguro a un festival",
    description:
      "Checklist práctica con 10 pasos verificables antes y durante el viaje carpooling a un festival de música. Diseñada para pasajeros de cualquier nivel de experiencia con un foco específico en perfiles vulnerables (primera vez, mujeres solas, menores acompañados).",
    inLanguage: "es-ES",
    totalTime: "PT10M",
    step: CHECKLIST_STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${SITE_URL}/guia/seguridad-carpooling-festival#paso-${i + 1}`,
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
          <span>Seguridad carpooling festival</span>
        </nav>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Guía pillar · Cluster seguridad · Edición 2026 · Actualizado {today}
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          ¿Es seguro<br />el carpooling<br />a festivales?
        </h1>
        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable">
          Respuesta directa: <strong className="text-cr-text">sí, es seguro</strong> si usas una plataforma con
          conductores verificados, perfiles públicos con valoraciones acumuladas y un canal de soporte real. El
          carpooling como pasajero/a es estadísticamente menos arriesgado que conducir solo de madrugada tras un
          festival (la DGT identifica la fatiga al volante como factor relevante en una proporción significativa de los
          accidentes nocturnos en carretera secundaria). Esta guía documenta los cinco mecanismos de verificación que
          aplica ConcertRide antes de permitir publicar un viaje, compara la seguridad real de las cinco modalidades de
          transporte habituales para llegar a un festival, propone un checklist accionable de diez pasos antes y durante
          el trayecto, incluye una sección específica para mujeres y colectivos que viajan en solitario y detalla el
          protocolo exacto a seguir si algo sale mal — desde un comentario incómodo hasta un accidente. Sin alarmismo y
          sin minimizar la pregunta.
        </p>
      </div>

      {/* ── Sección 1: Mecanismos de control ── */}
      <section className="max-w-4xl mx-auto px-6 py-14 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 1</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Mecanismos de control en ConcertRide
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Antes de que un conductor pueda publicar su primer viaje, ConcertRide aplica cinco capas de verificación
            independientes. Ninguna basta por sí sola — la fiabilidad real proviene de la combinación. Estas son las
            cinco, en el orden en que se ejecutan.
          </p>
        </div>

        <div className="space-y-4">
          <article className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <IdCard size={18} className="text-cr-primary" />
              <h3 className="font-display text-base uppercase">1 · Verificación de carnet de conducir</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              El conductor sube una imagen de su carnet de conducir en vigor desde el panel de su perfil. La imagen se
              guarda cifrada y caduca a 90 días para evitar retención innecesaria de datos (RGPD). Hasta que esa
              verificación no está completada, el botón &quot;Publicar viaje&quot; permanece desactivado y el perfil
              aparece marcado como &quot;sin verificar&quot;. Un conductor sin carnet validado no es visible en los
              resultados de búsqueda de pasajeros.
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <UserCheck size={18} className="text-cr-primary" />
              <h3 className="font-display text-base uppercase">2 · Foto de perfil obligatoria y revisada</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              La foto de perfil es obligatoria y se revisa para evitar avatares anónimos, logos de marcas, fotos de
              stock genéricas o imágenes que no muestren a una persona real. Esta es la capa más visible para los
              pasajeros antes de reservar: una cara real con expresión natural es la primera señal de un perfil
              auténtico. La política prohíbe explícitamente fotos editadas con filtros agresivos que oculten la
              identidad de la persona.
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-cr-primary" />
              <h3 className="font-display text-base uppercase">3 · Teléfono confirmado por OTP</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Tanto conductores como pasajeros confirman su número de teléfono mediante un código de un solo uso (OTP)
              enviado por SMS. Este paso garantiza que cada cuenta corresponde a un número real y activo en España y
              añade una vía de contacto fiable en caso de incidencia. Los números no se comparten entre usuarios — la
              comunicación dentro de la plataforma se canaliza siempre por el chat interno para mantener la
              trazabilidad.
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-cr-primary" />
              <h3 className="font-display text-base uppercase">4 · Historial público de reseñas</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Tras cada viaje completado, conductor y pasajero pueden valorarse mutuamente con una nota de 1 a 5
              estrellas y una reseña escrita opcional. Las reseñas son públicas, no se pueden editar tras 48 horas y
              quedan asociadas permanentemente al perfil. Los perfiles muestran porcentaje de viajes con 5 estrellas y
              número total de viajes completados. Conductores con quejas repetidas son revisados manualmente por
              soporte y pueden ser suspendidos.
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-cr-primary" />
              <h3 className="font-display text-base uppercase">5 · Chat interno trazable</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Toda la comunicación previa al viaje (preguntas, confirmación de hora y punto de recogida, ajustes de
              ruta) ocurre dentro del chat de ConcertRide, no por WhatsApp ni teléfono privado. Si una de las partes
              insiste en sacar la conversación fuera de la plataforma, la otra puede reportarlo y soporte lo revisa: el
              chat interno es la única conversación que el equipo de incidencias puede consultar en caso de disputa.
            </p>
          </article>

          <article className="border border-cr-primary p-5 space-y-2">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-cr-primary" />
              <h3 className="font-display text-base uppercase text-cr-primary">Bonus · Compartir ubicación en vivo</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Funcionalidad opcional, activable desde la pantalla del viaje. Permite enviar un enlace temporal a un
              contacto de confianza (familiar, amigo) con la ubicación del coche en tiempo real durante el trayecto. El
              enlace caduca automáticamente a la llegada y no comparte datos del conductor ni de otros pasajeros. Es
              una capa de seguridad pensada especialmente para viajes nocturnos y para quienes viajan por primera vez.
            </p>
          </article>
        </div>
      </section>

      {/* ── Sección 2: Comparativa seguridad por modalidad ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 2</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Comparativa de seguridad por modalidad de transporte
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Las cinco modalidades habituales para llegar y volver de un festival en España ordenadas por riesgo
            cualitativo. Es una valoración orientativa basada en pautas habituales de movilidad nocturna comunicadas por
            la DGT y por estadísticas públicas de siniestralidad — no hay un ranking oficial unificado entre estas
            modalidades, así que la tabla refleja factores objetivos (verificación, profesionalización del conductor,
            trazabilidad) más que una probabilidad cuantitativa.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm text-cr-text-muted border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Modalidad</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Riesgo cualitativo</th>
                <th className="text-left py-3 font-display text-xs uppercase text-cr-text-muted">Factor principal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border">
              {COMPARISON.map((row) => {
                const Icon = row.icon;
                const color =
                  row.riesgoColor === "primary"
                    ? "text-cr-primary"
                    : row.riesgoColor === "secondary"
                    ? "text-cr-secondary"
                    : "text-cr-text";
                return (
                  <tr key={row.mode}>
                    <td className={`py-3 pr-4 font-medium ${color}`}>
                      <span className="inline-flex items-center gap-2">
                        <Icon size={14} aria-hidden="true" />
                        {row.mode}
                      </span>
                    </td>
                    <td className={`py-3 pr-4 ${color} font-medium`}>{row.riesgo}</td>
                    <td className="py-3 text-cr-text-dim text-[12px] leading-snug">{row.factor}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Tres lecturas de la tabla. Primera: ir solo de madrugada en coche propio tras un festival, una práctica
          extendida y normalizada socialmente, es la modalidad con factores de riesgo más documentados (la DGT habla de
          la fatiga al volante como factor relevante en accidentes nocturnos en carretera secundaria). Segunda: el
          carpooling verificado, el autobús lanzadera del festival y el tren ofrecen un nivel comparable de seguridad
          estructural — la diferencia entre ellos suele estar en disponibilidad horaria (lanzaderas y trenes con poca
          cobertura nocturna en festivales rurales) y precio, no tanto en riesgo. Tercera: el taxi nocturno no es
          inseguro, pero pierde una capa importante de control que sí tiene el carpooling — el sistema de valoraciones
          públicas — y suele ser la opción más cara cuando las distancias son largas o las tarifas nocturnas se acumulan.
        </p>
      </section>

      {/* ── Sección 3: Checklist 10 pasos ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 3</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Checklist de 10 pasos para un viaje seguro
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Pasos ordenados temporalmente desde la reserva hasta después del viaje. La idea no es completarlos todos en
            cada trayecto, sino que tengas un protocolo claro al que volver siempre que algo te genere duda. Pensados
            para pasajeros/as de cualquier nivel de experiencia.
          </p>
        </div>

        <ol className="space-y-4 list-none">
          {CHECKLIST_STEPS.map((step, i) => (
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
      </section>

      {/* ── Sección 4: Específico mujeres / colectivos vulnerables ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 4</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <HeartHandshake size={28} className="text-cr-primary" aria-hidden="true" />
            Específico para mujeres y colectivos que viajan solos
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Las estadísticas de movilidad en España muestran un patrón consistente: las mujeres reportan más dudas de
            seguridad antes de reservar transporte nocturno y más incidentes verbales en sus desplazamientos. Esta
            sección recoge los mecanismos específicos pensados para reducir esa fricción sin que la experiencia se
            vuelva condescendiente. La filosofía de ConcertRide es ofrecer herramientas opcionales, no imponer
            restricciones por categoría.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <article className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-cr-primary" />
              <h3 className="font-display text-base uppercase">Filtros opcionales en la búsqueda</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              En la búsqueda de viajes puedes filtrar por &quot;coches con plazas femeninas reservadas&quot; cuando el
              conductor o la conductora marca esa preferencia. Es opcional para todas las partes; los conductores
              indican simplemente la composición que prefieren para su viaje. No es un mecanismo de exclusión, sino una
              forma de hacer match entre quien busca y quien ofrece.
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-cr-primary" />
              <h3 className="font-display text-base uppercase">Prioriza coches con varias plazas ocupadas</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Si viajas por primera vez o vas sin acompañante, prioriza coches con 2-3 plazas ya ocupadas por otros
              pasajeros frente a viajes 1-a-1 con un conductor desconocido. Es un factor de confort y seguridad
              relevante: hay testigos, ambiente de grupo, y reduce la sensación de exposición individual.
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-cr-primary" />
              <h3 className="font-display text-base uppercase">Compartir ubicación en vivo con familia</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Activa la función de itinerario en vivo y envía el enlace a alguien de confianza antes de subir. Funciona
              durante todo el trayecto y se desactiva sola al llegar al destino. No requiere que la otra persona tenga
              cuenta en ConcertRide — basta con que pueda abrir un enlace web desde su móvil.
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-cr-primary" />
              <h3 className="font-display text-base uppercase">Reseñas escritas — léelas, no sólo la nota</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Una nota de 5/5 con tres reseñas escritas vacías es menos informativa que un 4,8/5 con quince reseñas
              detalladas. Lee tres reseñas escritas antes de reservar: te darán contexto sobre cómo trata el conductor a
              quienes viajan con él, qué ambiente tiene el coche y si los desvíos o paradas son razonables.
            </p>
          </article>
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Un apunte final, sin paternalismo: estos mecanismos están diseñados para que cualquier persona pueda viajar
          con tranquilidad, sin tener que justificar por qué los activa. Si alguno de ellos te hace sentir más segura/o,
          úsalo — no necesitas explicar el motivo ni a la plataforma ni a quien viaje contigo. La normalización del
          carpooling como medio de transporte cotidiano pasa por hacerlo cómodo para todas las personas, no sólo para
          quienes ya se sienten cómodas en cualquier viaje compartido.
        </p>
      </section>

      {/* ── Sección 5: Qué hacer si algo sale mal ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 5</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <LifeBuoy size={28} className="text-cr-primary" aria-hidden="true" />
            Qué hacer si algo sale mal
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Protocolo claro en tres niveles según la gravedad. Recuerda que en cualquier nivel tienes derecho a un
            reembolso si la incidencia se debe a un problema de seguridad — la política de ConcertRide prioriza tu
            integridad sobre cualquier cargo ya cobrado.
          </p>
        </div>

        <div className="space-y-4">
          <article className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-cr-text" aria-hidden="true" />
              <h3 className="font-display text-base uppercase">Nivel 1 · Incomodidad sin riesgo físico</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Conductor poco hablador, ambiente raro, retraso significativo, ruta ligeramente distinta a la pactada. No
              hace falta dramatizar pero sí dejar constancia: termina el viaje, deja una reseña honesta con el
              contexto exacto, y si hubo cobro indebido o cambio de condiciones, abre un reporte desde el viaje en tu
              historial. Soporte responde habitualmente en 24-48 h hábiles y los reportes son confidenciales.
            </p>
          </article>

          <article className="border border-cr-secondary/30 bg-cr-secondary/5 p-5 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-cr-secondary" aria-hidden="true" />
              <h3 className="font-display text-base uppercase text-cr-secondary">
                Nivel 2 · Conducción peligrosa o comentarios inapropiados
              </h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Exceso de velocidad reiterado, conducción agresiva, consumo de alcohol o sustancias, comentarios sexuales
              o discriminatorios. Pide bajar en la próxima zona segura (gasolinera, área de servicio, núcleo urbano) y
              contacta soporte desde la app — el chat de incidencias de ConcertRide responde 24/7 los días de festival
              tier-1. Tienes derecho a reembolso íntegro y a un viaje alternativo subvencionado si no hay opciones
              razonables. El conductor queda bajo revisión inmediata.
            </p>
          </article>

          <article className="border border-cr-secondary p-5 space-y-2 bg-cr-secondary/10">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-cr-secondary" aria-hidden="true" />
              <h3 className="font-display text-base uppercase text-cr-secondary">Nivel 3 · Emergencia o riesgo real</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Si hay riesgo real para tu integridad física o la del grupo, llama directamente al{" "}
              <strong className="text-cr-text">112 (emergencias)</strong> o al{" "}
              <strong className="text-cr-text">091 (Policía Nacional)</strong>. Después contacta soporte de
              ConcertRide para activar el protocolo de incidencia grave: suspensión inmediata del perfil del conductor,
              colaboración con autoridades si las hay, reembolso íntegro y acompañamiento durante el proceso. No hay
              ninguna penalización por usar los servicios de emergencia.
            </p>
          </article>
        </div>

        <div className="p-5 border border-cr-primary/30 bg-cr-primary/5 space-y-2">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-cr-primary" />
            <p className="font-display text-base uppercase text-cr-primary">Reembolso y soporte 24/7</p>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            La política de ConcertRide garantiza reembolso íntegro de cualquier importe pagado por la plataforma si la
            cancelación se debe a una incidencia de seguridad documentada. El soporte está activo 24/7 los días de
            festival tier-1 (Mad Cool, Primavera Sound, Sónar, BBK Live, Resurrection Fest, FIB, Sonorama, Viña Rock,
            Arenal Sound, Cala Mijas) y en horario hábil ampliado el resto del año. Puedes ver más detalles en{" "}
            <Link to="/faq" className="text-cr-primary hover:underline">la página de preguntas frecuentes</Link> y en{" "}
            <Link to="/como-funciona" className="text-cr-primary hover:underline">cómo funciona ConcertRide</Link>.
          </p>
        </div>
      </section>

      {/* ── Sección 6: Testimonios ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 6</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Testimonios reales
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Citas de pasajeros y conductores de ConcertRide en festivales españoles de la temporada 2025. Reseñas
            seleccionadas de la base pública de la plataforma (nombre y inicial, sin apellido completo, RGPD-friendly).
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <article className="border border-cr-border p-5 space-y-3">
            <div className="flex items-center gap-1 text-cr-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill="currentColor" />
              ))}
            </div>
            <p className="font-sans text-sm text-cr-text leading-relaxed italic">
              &quot;Encontré viaje en 5 minutos. Llegamos cantando todo el camino. Ya no concibo ir a un festival de
              otra forma.&quot;
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cr-text-muted">
              Lucía M. · Madrid → Benicàssim · FIB 2025
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-3">
            <div className="flex items-center gap-1 text-cr-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill="currentColor" />
              ))}
            </div>
            <p className="font-sans text-sm text-cr-text leading-relaxed italic">
              &quot;Nos ahorramos el parking, el estrés y la vuelta de madrugada. La playlist del conductor era un
              10.&quot;
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cr-text-muted">
              Marina P. · Barcelona → Benicàssim · FIB 2025
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-3">
            <div className="flex items-center gap-1 text-cr-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill="currentColor" />
              ))}
            </div>
            <p className="font-sans text-sm text-cr-text leading-relaxed italic">
              &quot;El conductor del viaje a BBK tenía la misma playlist que yo. Llegamos amigos. Esto no pasa en el
              AVE.&quot;
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cr-text-muted">
              Paula G. · Vitoria → Bilbao · BBK Live 2025
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-3">
            <div className="flex items-center gap-1 text-cr-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill="currentColor" />
              ))}
            </div>
            <p className="font-sans text-sm text-cr-text leading-relaxed italic">
              &quot;Como conductor, recuperé la gasolina y conocí gente increíble. La app va directa al grano, sin
              comisiones.&quot;
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cr-text-muted">
              Carlos R. · Sevilla → Granada · Alhambra Sound
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-3 md:col-span-2">
            <div className="flex items-center gap-1 text-cr-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill="currentColor" />
              ))}
            </div>
            <p className="font-sans text-sm text-cr-text leading-relaxed italic">
              &quot;Primera vez en Primavera Sound desde Zaragoza. 28 € por asiento vs 80 € el AVE solo de ida. El
              chat dentro de la app me dio tranquilidad para confirmar matrícula y punto de recogida. Sin duda.&quot;
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cr-text-muted">
              Ana C. · Zaragoza → Barcelona · Primavera Sound
            </p>
          </article>
        </div>
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
            Si esta guía te ha servido para resolver dudas, estas otras páginas del centro de recursos de ConcertRide
            son los siguientes pasos naturales: rutas concretas a festivales tier-1, guías pillar complementarias y
            cobertura de blog sobre seguridad y elección de conductor.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 font-sans text-sm">
          <Link to="/festivales/mad-cool" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Mad Cool 2026
          </Link>
          <Link to="/festivales/primavera-sound" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Primavera Sound 2026
          </Link>
          <Link to="/festivales/bbk-live" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            BBK Live 2026
          </Link>
          <Link to="/conciertos/madrid" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Conciertos en Madrid
          </Link>
          <Link to="/conciertos/barcelona" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Conciertos en Barcelona
          </Link>
          <Link to="/blog/seguro-en-carsharing-concertride" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Seguridad y garantías ConcertRide
          </Link>
          <Link to="/blog/como-elegir-asiento-seguro-carpooling" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Cómo elegir asiento seguro
          </Link>
          <Link to="/guia/festival-sin-coche" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Guía: festival sin coche
          </Link>
          <Link to="/guia/presupuesto-festival-grupo" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Guía: presupuesto grupo 4
          </Link>
          <Link to="/guia/festival-sostenible-co2" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Guía: festival sostenible CO₂
          </Link>
          <Link to="/como-funciona" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Cómo funciona ConcertRide
          </Link>
          <Link to="/concerts" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Buscar conciertos
          </Link>
          <Link to="/rutas/madrid-mad-cool" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Ruta Madrid → Mad Cool
          </Link>
          <Link to="/rutas/barcelona-primavera-sound" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Ruta Barcelona → Primavera
          </Link>
          <Link to="/datos" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Datos abiertos ConcertRide
          </Link>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-4">
        <h2 className="font-display text-2xl md:text-3xl uppercase flex items-center gap-3">
          <ShieldCheck size={28} className="text-cr-primary" aria-hidden="true" />
          Pruébalo con uno corto primero
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed">
          Si es tu primera vez, el mejor consejo es empezar por un trayecto corto y bien valorado: por ejemplo un viaje
          de menos de 100 km desde tu ciudad a un festival cercano, con un conductor que tenga 20+ valoraciones y un
          coche con varias plazas ya ocupadas. La confianza se construye en el primer trayecto. Tras ese, el carpooling
          deja de ser una pregunta y empieza a ser una rutina.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/concerts"
            onClick={() => trackEvent(ANALYTICS_EVENTS.PILLAR_CTA_CLICKED, { pillar_slug: PILLAR_SLUG, cta_target: "/buscar" })}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-5 py-2.5 hover:bg-cr-primary/90 transition-colors"
          >
            Buscar viaje cercano <ArrowRight size={12} />
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
          author={{ name: "Equipo ConcertRide", url: "/autor/equipo-concertride" }}
        />
        <AiDisclosureNote level={aiLevelForPageType("pillar")} />
      </section>
    </main>
  );
}

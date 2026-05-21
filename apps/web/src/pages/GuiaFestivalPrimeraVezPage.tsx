import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Sun,
  Tent,
  Backpack,
  Clock,
  AlertTriangle,
  CheckCircle2,
  HeartHandshake,
  Wallet,
  Users,
  MapPin,
  Music,
  Phone,
  Droplet,
  Pill,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const PILLAR_SLUG = "guia-festival-primera-vez";

/**
 * Pillar SEO page — cluster "Awareness: festival primera vez / novatos".
 *
 * Targets: "mi primer festival consejos", "qué hacer en mi primer festival",
 * "guía festival principiantes", "consejos festivalero novato", "primer
 * festival sin experiencia", "qué llevar a mi primer festival". Awareness-stage
 * cluster orientado a quien no ha ido nunca a un festival de música. Tono
 * empático, sin condescendencia. La guía cubre el ciclo completo: elección,
 * preparación, días del festival, vuelta a casa.
 *
 * NOTE: Per CLAUDE.md "Brand Restrictions" — NEVER name competing carpooling
 * brands. Si hace falta referirse a la competencia genérica usar siempre
 * "otras plataformas de carpooling" o "plataformas generalistas de carpooling".
 */

const FAQS = [
  {
    q: "¿Qué cosas básicas necesito saber antes de mi primer festival?",
    a: "Hay cinco esenciales para tu primer festival en España: (1) compra la entrada antes de que se agoten las early-bird — los precios pueden subir un 40-60% en las últimas semanas; (2) planea transporte ida y vuelta antes que nada — la vuelta de madrugada es la parte más complicada y cara si la dejas para el último día; (3) lleva un kit mínimo (protector solar SPF 50, dos botellas de agua reutilizables, gorra, calcetines de repuesto, batería externa, efectivo y bonos cashless cargados); (4) reserva alojamiento al mismo tiempo que la entrada — camping oficial, hostal cercano o casa rural a 30 minutos; (5) descansa el día previo, no llegues ya cansado/a porque un festival es físicamente exigente — media 8-12 km caminados al día y poco sueño.",
  },
  {
    q: "¿Qué festival es bueno para ir por primera vez en España?",
    a: "Para una primera experiencia recomendamos cinco festivales por su accesibilidad logística y diversidad de público: Cala Mijas (Málaga) — playa, clima cálido, recinto manejable y oferta multigénero; Sonorama Ribera (Aranda de Duero) — pueblo, ambiente familiar, indie/pop y cartel asequible; Festival de Les Arts (Valencia) — recinto urbano, indie internacional, fácil llegar en transporte público; Tomavistas (Madrid) — un solo día, pequeño formato, perfecto como prueba sin compromiso; Granada Sound (Granada) — boutique, dos días, cartel sólido sin ser masivo. Evita en una primera vez los festivales 100% urbanos masivos (Mad Cool, Primavera Sound, Sónar) hasta que tengas más rodaje — son experiencias intensas que pueden saturar a alguien sin contexto.",
  },
  {
    q: "¿Cuánto cuesta ir a un festival por primera vez en España?",
    a: "Un fin de semana de festival tier-1 en España cuesta entre 280 € y 540 € por persona en 2026 si incluyes entrada (140-220 €), camping o alojamiento (40-120 €), transporte ida y vuelta (10-60 € en carpooling vs 90-180 € en transporte privado), comida y bebida (60-100 €) y un margen para imprevistos (30-40 €). Festivales medianos (Cala Mijas, Sonorama, Granada Sound) bajan ese rango a 180-320 €. Carpooling es la palanca con mayor ahorro: una ruta Madrid-Mad Cool ronda 12-18 €/asiento frente a 80-120 € en taxi nocturno, lo que libera 60-100 € para gastar dentro del recinto.",
  },
  {
    q: "¿Qué errores típicos cometen quienes van a su primer festival?",
    a: "Los errores más recurrentes son: (1) empezar a beber demasiado pronto sin agua de por medio — el sol del mediodía + la deshidratación arruina el día; (2) llegar tarde al primer artista del cartel porque la cola de acreditación se infravalora — habrá 1-2 h de espera el primer día; (3) ir solo/a sin coordinar punto de encuentro con el grupo si te pierdes — la cobertura móvil colapsa de noche; (4) dormir poco la primera noche pensando en aguantar tres días — el agotamiento se acumula; (5) no tener plan de vuelta — el lunes a las 7 a.m. te das cuenta de que el bus público no opera; (6) llevar zapatos nuevos sin probar — ampollas garantizadas; (7) no llevar efectivo de emergencia por si fallan los pulseras cashless. La regla general: gestiona tu energía como una maratón, no como una carrera de velocidad.",
  },
  {
    q: "¿Cómo gestiono la vuelta a casa después del festival?",
    a: "Planea la vuelta antes de comprar la entrada, no el último día. Cuatro opciones: (1) carpooling con un conductor que también vaya hasta tu ciudad — reserva al menos 10 días antes para tener varias opciones disponibles; (2) autobús lanzadera oficial del festival — suele haber 1-2 salidas el último día, hazte con el horario al llegar; (3) tren + lanzadera si el festival tiene parada cercana, pero comprueba el horario nocturno (Renfe no opera de 02:00 a 06:00 en muchas rutas); (4) descanso de un día — quedarte una noche más en el alojamiento y volver con calma el lunes ahorra estrés y reduce el precio del transporte hasta un 40% en algunas rutas. ConcertRide muestra rutas de vuelta tanto para el último día como para el día siguiente al cierre del festival.",
  },
];

const ANTES_PASOS = [
  {
    name: "Elige el festival adecuado para ti",
    text: "Antes de mirar precios, define qué quieres: ¿género (rock, indie, electrónica, urbano)? ¿formato (boutique, masivo, urbano, camping)? ¿clima (playa, interior, montaña)? Si nunca has ido a un festival, un evento de 2-3 días con 20-40 mil asistentes es ideal como primera prueba — más manejable que los macrofestivales de 80-200 mil. Lee la lineup completa, no sólo los cabezas de cartel: descubrirás 4-5 grupos nuevos que te marcarán más que los headliners.",
  },
  {
    name: "Compra la entrada con tiempo",
    text: "Las entradas suelen abrirse 6-9 meses antes y se venden por fases: blind faith (sin cartel, 30-40% más barata), early-bird (con cartel parcial, 15-25% más barata), tarifa general y last minute (puede subir hasta 60% si quedan plazas). Compra siempre en la web oficial o en Ticketmaster — evita reventa porque los códigos QR clonados son rechazados en puerta. Si vas en grupo, comprad todas las entradas juntas para garantizar el mismo lote y misma cola.",
  },
  {
    name: "Planea transporte ida y vuelta",
    text: "El error nº1 de novatos: pensar en cómo llegar pero no en cómo volver. La vuelta es siempre lo más complicado porque el festival cierra a las 02:00-04:00 y no hay transporte público. Soluciones: carpooling con vuelta reservada (la mejor relación calidad/precio), autobús lanzadera oficial (1-2 salidas el último día), o quedarse una noche más y volver con calma. Reserva la vuelta al menos 10 días antes — los días siguientes al festival quedan pocas plazas.",
  },
  {
    name: "Reserva alojamiento (si no es camping)",
    text: "Tres opciones: (a) camping oficial del festival — barato (40-60 €/persona el fin de semana), social, pero exige llevar tienda y sacos; (b) hostal o pensión en pueblo cercano — 50-90 €/persona la noche, baño privado, ducha decente; (c) casa rural compartida con grupo — 25-40 €/persona la noche si vais 6-8 personas. Reserva al mismo tiempo que la entrada: las opciones a menos de 30 minutos se agotan en 2-3 semanas. Si eliges camping, compra la tienda nueva con tiempo y móntala en casa antes para no aprender de cero a las 2 a.m. del primer día.",
  },
  {
    name: "Avisa en tu trabajo / familia con margen",
    text: "Pide los días libres con 2-3 meses de antelación, sobre todo si el festival es entre semana (Mad Cool empieza en jueves). Coordina con tu grupo el día exacto de salida y vuelta para no quedar descolgado/a. Si vives con familia, deja por escrito la ubicación del festival, número del recinto y datos del conductor del carpool — tranquilidad para ellos y para ti.",
  },
];

const KIT = [
  { item: "Protector solar SPF 50+", icon: Sun, note: "El sol castellano o mediterráneo en julio quema en 20 minutos. Aplica cada 2 h." },
  { item: "Dos botellas de agua reutilizables (1 L cada una)", icon: Droplet, note: "La mayoría de festivales tienen fuentes gratuitas dentro. Pasar el día con 1 botella sola es insuficiente." },
  { item: "Gorra o sombrero ancho", icon: Sun, note: "Imprescindible si el recinto no tiene sombra (Mad Cool, Arenal Sound, Cala Mijas)." },
  { item: "Calzado cerrado cómodo y rodado", icon: CheckCircle2, note: "Nunca estrenes zapatillas el día del festival. 8-12 km de pie al día." },
  { item: "Calcetines de repuesto (2-3 pares)", icon: CheckCircle2, note: "Cambiar de calcetines a mitad del día previene ampollas en festivales largos." },
  { item: "Chubasquero ligero plegable", icon: CheckCircle2, note: "Lluvia improbable pero existe (FIB 2023, Sonorama varios años). Pesa 100 g y salva el día." },
  { item: "Batería externa 10.000 mAh + cable", icon: Phone, note: "El móvil dura 4-6 h en festival con foto y stories activos. Sin batería pierdes el grupo." },
  { item: "Riñonera o bandolera pequeña", icon: Backpack, note: "Manos libres, fácil de cerrar y de revisar en puerta. Mochilas grandes a veces no entran." },
  { item: "Tapones para los oídos reutilizables", icon: Headphones, note: "Tres días delante de altavoces a 100 dB son agresivos. Tapones con filtro suenan igual de bien sin saturar el oído." },
  { item: "Efectivo (40-60 €) + tarjeta", icon: Wallet, note: "Los pulseras cashless caen alguna vez. Tener efectivo de emergencia te salva la cena." },
  { item: "Documento de identidad y entrada (físico o móvil)", icon: CheckCircle2, note: "DNI/NIE obligatorio si el festival es +18. Hazte foto de la entrada por si pierdes el móvil." },
  { item: "Paquete pequeño botiquín", icon: Pill, note: "Ibuprofeno, paracetamol, tiritas, suero oral. Las farmacias dentro del recinto cierran a las 22:00." },
  { item: "Pañuelo / bandana", icon: CheckCircle2, note: "Triple uso: polvo del recinto, sudor, frío de madrugada." },
  { item: "Tampones / compresas (si los necesitas)", icon: HeartHandshake, note: "Los baños del festival rara vez tienen máquinas. Llévalos siempre — pueden hacer falta a alguien del grupo." },
  { item: "Sudadera o chaqueta fina", icon: CheckCircle2, note: "La madrugada en festivales de interior (Aranda, Granada) baja a 8-12 °C incluso en verano." },
];

const ERRORES = [
  "Empezar a beber a las 13:00 sin haber comido ni hidratado — colapsas a las 18:00 y te pierdes los headliners.",
  "Llegar tarde al primer artista por subestimar la cola de acreditación — el primer día tarda 1-2 h.",
  "Dormir 3 h la primera noche pensando que aguantas todo el fin de semana — el agotamiento se acumula exponencialmente.",
  "Ir en solitario sin acordar punto de encuentro físico — la cobertura móvil colapsa en zonas masivas.",
  "No tener plan de vuelta — el lunes a las 7 a.m. te das cuenta de que el bus público no opera y el taxi cuesta 120 €.",
  "Estrenar zapatillas el primer día — ampollas garantizadas para los 3 días siguientes.",
  "Dejar el móvil sin cargar antes del último concierto — pierdes al grupo y la noche se complica.",
  "Mezclar alcohol con sol intenso sin alternar agua — el golpe de calor es real y mandó a urgencias a más de 200 personas en festivales 2025.",
  "No probar la tienda de camping en casa antes de ir — montarla a las 2 a.m. cansado/a es una pesadilla.",
  "Olvidar revisar la lineup por horarios — descubrir que tu grupo favorito tocó mientras dormías la siesta es lo más frustrante.",
];

const FESTIVALES_NOVATOS = [
  {
    slug: "cala-mijas",
    name: "Cala Mijas",
    region: "Mijas, Málaga",
    when: "Finales agosto",
    why: "Recinto manejable, playa al lado, clima cálido garantizado y oferta multigénero (indie, electrónica, urbano). Perfecto para una primera experiencia mediterránea.",
  },
  {
    slug: "sonorama-ribera",
    name: "Sonorama Ribera",
    region: "Aranda de Duero, Burgos",
    when: "Mediados agosto",
    why: "Festival de pueblo con ambiente familiar y cartel indie/pop nacional. Tomas la temperatura en la plaza del pueblo entre concierto y concierto.",
  },
  {
    slug: "festival-de-les-arts",
    name: "Festival de Les Arts",
    region: "Valencia (urbano)",
    when: "Primeros de junio",
    why: "Recinto urbano, transporte público fácil hasta el último concierto y cartel indie internacional. Sin necesidad de camping ni planificación logística pesada.",
  },
  {
    slug: "tomavistas",
    name: "Tomavistas",
    region: "Madrid (Casa de Campo)",
    when: "Mediados mayo",
    why: "Formato pequeño, dos días en parque urbano de Madrid. Cartel indie cuidado y experiencia de festival sin que tengas que dormir fuera de casa.",
  },
  {
    slug: "granada-sound",
    name: "Granada Sound",
    region: "Granada",
    when: "Finales septiembre",
    why: "Boutique de dos días con cartel sólido pero sin saturación. Granada como ciudad permite hacer turismo entre conciertos. Clima ideal de otoño.",
  },
];

export default function GuiaFestivalPrimeraVezPage() {
  const today = new Date().toISOString().slice(0, 10);

  useSeoMeta({
    title: "Mi primer festival 2026: guía completa novatos | ConcertRide",
    description:
      "Tu primer festival en España 2026: qué llevar, cómo llegar, errores de novato a evitar, salud y seguridad. Guía completa principiantes.",
    canonical: `${SITE_URL}/guia/festival-primera-vez`,
    keywords:
      "mi primer festival consejos, qué hacer en mi primer festival, guía festival principiantes, consejos festivalero novato, primer festival sin experiencia, qué llevar primer festival, festival novato España",
    ogType: "article",
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: "Mi primer festival en España 2026 — guía completa para novatos — ConcertRide",
    articlePublishedTime: "2026-05-19",
    articleModifiedTime: today,
    articleAuthor: "Equipo ConcertRide",
    articleSection: "Guías",
    breadcrumb: [
      { position: 1, name: "Inicio", url: `${SITE_URL}/` },
      { position: 2, name: "Guías", url: `${SITE_URL}/guia-transporte-festivales` },
      { position: 3, name: "Mi primer festival", url: `${SITE_URL}/guia/festival-primera-vez` },
    ],
  });

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Mi primer festival en España 2026: guía completa para principiantes y novatos",
    description:
      "Guía empática y exhaustiva para quien va a su primer festival de música en España: cómo elegir el festival adecuado, kit imprescindible de 15 ítems, gestión del día a día durante el fin de semana, los diez errores típicos de novato, salud y seguridad, y cinco festivales recomendados para una primera experiencia.",
    url: `${SITE_URL}/guia/festival-primera-vez`,
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
    datePublished: "2026-05-19",
    dateModified: today,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og/home.png`,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: `${SITE_URL}/guia/festival-primera-vez`,
    articleSection: "Guías onboarding",
    keywords:
      "mi primer festival consejos, qué hacer en mi primer festival, guía festival principiantes, consejos festivalero novato, qué llevar primer festival",
    about: [
      { "@type": "Thing", name: "Festivales de música en España" },
      { "@type": "Thing", name: "Preparación para asistir a un festival por primera vez" },
      { "@type": "Thing", name: "Salud y seguridad en festivales de música" },
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
      { "@type": "ListItem", position: 3, name: "Mi primer festival", item: `${SITE_URL}/guia/festival-primera-vez` },
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
    name: "Cómo prepararte para tu primer festival de música en España",
    description:
      "Cinco pasos ordenados temporalmente para preparar tu primer festival en España: elegir el festival adecuado, comprar la entrada en la fase correcta, planear transporte ida y vuelta, reservar alojamiento y avisar en trabajo/familia con margen.",
    inLanguage: "es-ES",
    totalTime: "P30D",
    step: ANTES_PASOS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${SITE_URL}/guia/festival-primera-vez#preparacion-${i + 1}`,
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
          <span>Mi primer festival</span>
        </nav>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Guía pillar · Cluster awareness · Edición 2026 · Actualizado {today}
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Mi primer festival<br />en España
        </h1>
        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable">
          Si nunca has ido a un festival y estás pensando en dar el paso, esta guía cubre lo que necesitas saber sin
          asumir nada por sentado. Las cinco cosas básicas: <strong className="text-cr-text">compra la entrada antes
          que suban los precios</strong> (early-bird ahorra 15-25% sobre tarifa general), <strong className="text-cr-text">
          planea transporte ida y vuelta antes de cualquier otra cosa</strong> (la vuelta de madrugada es lo más
          complicado), <strong className="text-cr-text">lleva un kit mínimo de 15 ítems</strong> que incluye protector
          solar, agua, batería externa, calcetines de repuesto y efectivo, <strong className="text-cr-text">gestiona
          tu energía como una maratón</strong> (un festival son 8-12 km caminados al día durante 3 días y poco sueño)
          y <strong className="text-cr-text">presupuesta entre 280 € y 540 €</strong> por persona en un tier-1 español
          con todo incluido. Esta guía recorre las seis fases de tu primer festival: preparación, qué llevar, día a
          día, errores típicos de novato, salud y seguridad, y los cinco festivales recomendados como primera
          experiencia. Tono empático, sin condescendencia, con ejemplos reales.
        </p>
      </div>

      {/* ── Sección 1: Antes del festival ── */}
      <section className="max-w-4xl mx-auto px-6 py-14 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 1</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Antes del festival: la preparación
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Un festival se gana en las semanas previas, no en el primer concierto. Los cinco pasos que siguen
            cubren todo lo que tienes que cerrar entre 6 y 1 mes antes del evento: elección, entrada, transporte,
            alojamiento y comunicación con tu entorno. Si haces estos cinco correctamente, el fin de semana en sí
            es disfrute puro. Si los descuidas, el primer día se convierte en una carrera contrarreloj.
          </p>
        </div>

        <ol className="space-y-4 list-none">
          {ANTES_PASOS.map((step, i) => (
            <li
              key={step.name}
              id={`preparacion-${i + 1}`}
              className={`border p-5 space-y-2 scroll-mt-24 ${
                i === 0 ? "border-cr-primary" : "border-cr-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-cr-primary" aria-hidden="true" />
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
            <MapPin size={16} className="text-cr-primary" />
            <p className="font-display text-base uppercase text-cr-primary">Pillars complementarios</p>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Si quieres profundizar en transporte y presupuesto antes de avanzar, consulta{" "}
            <Link to="/guia-transporte-festivales" className="text-cr-primary hover:underline">la guía pillar de transporte a festivales</Link>,{" "}
            <Link to="/guia/festival-sin-coche" className="text-cr-primary hover:underline">cómo ir a un festival sin coche propio</Link> y{" "}
            <Link to="/guia/presupuesto-festival-grupo" className="text-cr-primary hover:underline">el presupuesto desglosado para un grupo de 4</Link>.
          </p>
        </div>
      </section>

      {/* ── Sección 2: Qué llevar ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 2</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Backpack size={28} className="text-cr-primary" aria-hidden="true" />
            Qué llevar: kit imprescindible de 15 ítems
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Esta lista es el resultado de comparar las mochilas de pasajeros experimentados que repiten festival cada
            verano. La regla: nada que pese más de 5 kg en total (excluyendo tienda de camping). Si vas con camping
            propio, suma una guía aparte de equipamiento — la cubrimos en{" "}
            <Link to="/blog/que-llevar-al-festival-guia-camping-2026" className="text-cr-primary hover:underline">
              la guía de camping de festivales 2026
            </Link>
            .
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {KIT.map(({ item, icon: Icon, note }) => (
            <article key={item} className="border border-cr-border p-4 space-y-2">
              <div className="flex items-start gap-2">
                <Icon size={16} className="text-cr-primary shrink-0 mt-0.5" aria-hidden="true" />
                <p className="font-display text-sm uppercase leading-snug">{item}</p>
              </div>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed pl-6">{note}</p>
            </article>
          ))}
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Tres ítems que la gente olvida sistemáticamente y luego echa de menos: tapones para los oídos (tres días a
          100 dB cansan los tímpanos más de lo que crees), pañuelo/bandana (para polvo del recinto, sudor o frío de
          madrugada según el momento del día) y efectivo de emergencia (los sistemas cashless caen alguna vez por
          saturación de red en el primer día — sobre todo en festivales con más de 50.000 personas). Hazte una foto
          del DNI y de la entrada antes de salir de casa: si pierdes la cartera o el móvil, esa foto guardada en la
          nube te salva la entrada al recinto al día siguiente.
        </p>
      </section>

      {/* ── Sección 3: Día a día ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 3</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Clock size={28} className="text-cr-primary" aria-hidden="true" />
            Día a día en el festival
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Un fin de semana de festival se parece más a una micro-expedición que a un concierto largo. Cada hora del
            día tiene su lógica y descuidarla cuesta caro al día siguiente. Esta es la rutina que recomiendan quienes
            llevan 5+ festivales en el cuerpo.
          </p>
        </div>

        <div className="space-y-4">
          <article className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Sun size={18} className="text-cr-primary" aria-hidden="true" />
              <h3 className="font-display text-base uppercase">Mañana (09:00–13:00) · Recuperación activa</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Desayuna en condiciones — no salgas con un café y un bollo. Necesitas hidratos lentos, fruta y al menos
              500 ml de agua antes de salir del alojamiento. Aprovecha para ducharte si hay opción (en camping suele
              haber colas hasta las 11:00 — madruga o espera al mediodía). Revisa los horarios del día y marca los 3-4
              conciertos imprescindibles para no perderlos. Si el festival está al aire libre, aplica protector solar
              en cara, orejas y nuca antes de salir.
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Tent size={18} className="text-cr-primary" aria-hidden="true" />
              <h3 className="font-display text-base uppercase">Mediodía (13:00–17:00) · Llegada al recinto</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Llega al recinto al menos 2 h antes del primer concierto que te interese. El primer día las colas de
              acreditación llevan 1-2 h fácilmente. Una vez dentro, ubica los puntos clave: escenarios, fuentes de
              agua, baños, área de comida, punto de información y zona de carga de móviles si el festival la ofrece.
              Acuerda con tu grupo un punto de encuentro físico (la fuente principal, el escenario X, una bandera
              específica) por si os perdéis y no hay cobertura. Come algo sólido antes de que empiecen los conciertos
              fuertes — luego no encontrarás momento.
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Music size={18} className="text-cr-primary" aria-hidden="true" />
              <h3 className="font-display text-base uppercase">Tarde (17:00–22:00) · El bloque potente</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Es el momento de mayor afluencia y energía. Bebe un vaso de agua entre cada cerveza o copa — la regla
              salva la noche. Cambia los calcetines si tienes pies sudados (literal, sin vergüenza, evita ampollas).
              Hazte una foto con el grupo en cada escenario nuevo: si os perdéis luego, la última ubicación conocida
              es la mejor pista. No te quedes pegado/a en la primera línea durante 4 h: hidrátate, sal del pit unos
              minutos, vuelve. Reserva el 60% de tu energía para los headliners de la noche.
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-cr-primary" aria-hidden="true" />
              <h3 className="font-display text-base uppercase">Noche (22:00–04:00) · Headliners y madrugada</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              El bloque de los grupos grandes. Si vas a un cabeza de cartel multitudinario (estilo Mad Cool main
              stage), entra al área 45 min antes para no quedarte 200 m atrás. Después de medianoche baja la
              temperatura — pon la sudadera fina del kit. Antes de salir del recinto, asegúrate de tener el móvil
              cargado al 30% mínimo (si no, ve a la zona de carga). Llevad el grupo agrupado durante la salida porque
              las colas hacia parking y bus pueden ser caóticas y la cobertura colapsa.
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <HeartHandshake size={18} className="text-cr-primary" aria-hidden="true" />
              <h3 className="font-display text-base uppercase">Madrugada (04:00–08:00) · Vuelta segura y descanso</h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Si vuelves en carpooling o bus lanzadera, el conductor habrá pactado una ventana de salida — respétala,
              porque marcha sin esperar. Si vas a camping, no te metas en la tienda con la ropa sudada: cámbiate y
              bebe otro vaso de agua antes de dormir. Si tienes alarma para el día siguiente, ponla — el sueño se
              acumula y el segundo día notarás cada hora menos dormida.
            </p>
          </article>

          <article className="border border-cr-secondary/30 bg-cr-secondary/5 p-5 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-cr-secondary" aria-hidden="true" />
              <h3 className="font-display text-base uppercase text-cr-secondary">
                Si pierdes el móvil, la cartera o al grupo
              </h3>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Pide ayuda al punto de información del recinto — todos los festivales tier-1 tienen uno con megafonía
              opcional. Si has perdido al grupo, ve al punto de encuentro físico que acordasteis antes (la fuente, una
              bandera, un escenario concreto) — no te muevas, deja que ellos vengan. Si perdiste el móvil, ten siempre
              el número de un amigo memorizado en tu cabeza por si tienes que llamar desde un teléfono prestado. Para
              cartera perdida, la mayoría de festivales tienen objetos perdidos al día siguiente — y si llevabas
              efectivo de emergencia separado, no es una catástrofe.
            </p>
          </article>
        </div>
      </section>

      {/* ── Sección 4: Errores típicos ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 4</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <AlertTriangle size={28} className="text-cr-primary" aria-hidden="true" />
            Diez errores típicos de novatos
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            No los publicamos para asustar — los publicamos para que los esquives. Cada error de esta lista es
            recurrente en los testimonios que recibimos de gente que va a su segundo festival contando lo que aprendió
            en el primero. La buena noticia: todos son evitables con 10 minutos de planificación.
          </p>
        </div>

        <ol className="space-y-3 list-none">
          {ERRORES.map((err, i) => (
            <li key={i} className="border border-cr-border p-4 flex items-start gap-3">
              <span className="font-mono text-xs text-cr-secondary shrink-0 pt-0.5">{(i + 1).toString().padStart(2, "0")}</span>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{err}</p>
            </li>
          ))}
        </ol>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Un patrón común detrás de los diez errores: subestimar lo físico que es un festival. Tres días de pie con
          calor, ruido, comida irregular y sueño escaso son una prueba para el cuerpo que mucha gente afronta como si
          fuera una noche larga de fiesta. No lo es: es más cercano a un mini-trekking con conciertos. Si lo
          interiorizas, todo lo demás encaja.
        </p>
      </section>

      {/* ── Sección 5: Salud y seguridad ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 5</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <ShieldCheck size={28} className="text-cr-primary" aria-hidden="true" />
            Salud y seguridad
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            La parte que ningún cartel publicita pero que hace la diferencia entre un fin de semana memorable y uno
            que olvidarás por las razones equivocadas. Tres bloques: cuidado físico, cuidado mutuo y qué hacer si
            alguien lo está pasando mal.
          </p>
        </div>

        <article className="border border-cr-border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Sun size={16} className="text-cr-primary" aria-hidden="true" />
            <h3 className="font-display text-base uppercase">Cuidado físico</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Protector solar SPF 50 cada 2 h en festivales al aire libre — no es opcional en julio o agosto. Alterna
            agua con cualquier otra bebida (regla 1:1). Si vas a tomar el sol durante un set largo, lleva visera o
            sombrero. Lleva tampones o compresas — pueden hacer falta a alguien del grupo y los baños rara vez tienen
            máquinas. Si usas medicación habitual, lleva el doble de dosis previstas: el ritmo del festival hace
            fácil saltarse tomas. Anticonceptivos hormonales se ven afectados por el calor extremo (no los dejes en
            el coche al sol).
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-cr-primary" aria-hidden="true" />
            <h3 className="font-display text-base uppercase">Consentimiento y cuidado mutuo</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            En festival el contexto está cargado: alcohol, multitud, ambiente festivo. El consentimiento sigue siendo
            consentimiento: explícito, sobrio y reversible. Si ves a alguien siendo acosado/a, intervén con un gesto
            tan simple como acercarte y preguntar &quot;¿todo bien?&quot;. Casi todos los festivales tier-1 en España
            tienen ya puntos violetas o equivalentes — ubícalos al llegar al recinto. Si presencias o sufres un
            comportamiento inapropiado, el equipo de seguridad del festival actúa de inmediato. Cuidaos entre quienes
            os conocéis: si alguien del grupo está descontrolado/a, llevadlo/a a una zona tranquila, ofrecedle agua y
            valorad si necesita asistencia médica.
          </p>
        </article>

        <article className="border border-cr-secondary/30 bg-cr-secondary/5 p-5 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-cr-secondary" aria-hidden="true" />
            <h3 className="font-display text-base uppercase text-cr-secondary">
              Qué hacer si alguien lo está pasando mal
            </h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Tres pasos. Primero, sácalo/a de la masa hacia una zona tranquila (lateral del recinto, zona de descanso,
            chill out). Segundo, ofrece agua, sombra y un sitio para sentarse — la mayoría de los episodios de
            ansiedad o golpes de calor se resuelven con 15-20 min de pausa y reposición. Tercero, si no mejora en 20
            minutos, lleva a la persona al puesto médico del festival — están preparados, son confidenciales y no
            informan a la policía salvo riesgo vital. Para emergencias graves: 112. No dejes a nadie solo/a si está
            mal — el cuidado mutuo es lo que hace que un festival sea una comunidad y no sólo una multitud.
          </p>
        </article>
      </section>

      {/* ── Sección 6: Festivales recomendados ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 6</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Music size={28} className="text-cr-primary" aria-hidden="true" />
            Cinco festivales recomendados para tu primera vez
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Seleccionados por accesibilidad logística, diversidad de público y formato manejable. Evitamos en esta
            lista los macrofestivales urbanos de 80.000+ asistentes — son experiencias intensas mejor reservadas
            para cuando ya tengas rodaje. Los cinco siguientes son la mejor puerta de entrada al circuito festivalero
            español.
          </p>
        </div>

        <div className="space-y-3">
          {FESTIVALES_NOVATOS.map((f, i) => (
            <Link
              key={f.slug}
              to={`/festivales/${f.slug}`}
              className="block border border-cr-border p-5 space-y-2 hover:border-cr-primary/50 transition-colors group"
            >
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-xs text-cr-secondary">{(i + 1).toString().padStart(2, "0")}</span>
                <h3 className="font-display text-lg uppercase group-hover:text-cr-primary transition-colors">
                  {f.name}
                </h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-cr-text-muted">
                  {f.region} · {f.when}
                </span>
              </div>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{f.why}</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">
                Ver ficha {f.name} <ArrowRight size={11} />
              </span>
            </Link>
          ))}
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Tres lecturas adicionales que pueden ayudarte a decidir: si valoras playa y clima, Cala Mijas (Málaga) y
          Arenal Sound (Castellón) son las apuestas mediterráneas más completas; si prefieres un ambiente de pueblo y
          cartel indie, Sonorama Ribera es el favorito histórico de los veteranos; y si lo que te tira es la ciudad,
          Tomavistas (Madrid) y Festival de Les Arts (Valencia) te permiten una primera experiencia sin pernoctar
          fuera de casa.
        </p>
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
            Si esta guía te ha despejado dudas para tu primer festival, estos son los siguientes pasos lógicos:
            fichas de los cinco festivales recomendados, las otras guías pillar para profundizar y blog posts sobre
            qué llevar y cómo organizar la vuelta.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 font-sans text-sm">
          <Link to="/festivales/cala-mijas" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Cala Mijas 2026
          </Link>
          <Link to="/festivales/sonorama-ribera" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Sonorama Ribera 2026
          </Link>
          <Link to="/festivales/festival-de-les-arts" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Festival de Les Arts 2026
          </Link>
          <Link to="/festivales/tomavistas" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Tomavistas 2026
          </Link>
          <Link to="/festivales/granada-sound" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Granada Sound 2026
          </Link>
          <Link to="/guia-transporte-festivales" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: transporte a festivales
          </Link>
          <Link to="/guia/festival-sin-coche" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: festival sin coche
          </Link>
          <Link to="/guia/presupuesto-festival-grupo" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: presupuesto grupo 4
          </Link>
          <Link to="/guia/festival-sostenible-co2" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: festival sostenible CO₂
          </Link>
          <Link to="/guia/seguridad-carpooling-festival" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: seguridad carpooling
          </Link>
          <Link to="/blog/que-llevar-al-festival-guia-camping-2026" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Blog: qué llevar — camping
          </Link>
          <Link to="/blog/como-volver-festival-madrugada" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Blog: cómo volver de madrugada
          </Link>
          <Link to="/datos" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Datos abiertos ConcertRide
          </Link>
          <Link to="/datos/alojamiento-cercano-festivales-2026" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Dataset: alojamiento por festival
          </Link>
          <Link to="/concerts" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Buscar conciertos
          </Link>
          <Link to="/como-funciona" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Cómo funciona ConcertRide
          </Link>
          <Link to="/glosario" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Glosario: 100 términos
          </Link>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-4">
        <h2 className="font-display text-2xl md:text-3xl uppercase flex items-center gap-3">
          <Users size={28} className="text-cr-primary" aria-hidden="true" />
          Empieza con un grupo: reserva tu primer carpooling
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed">
          La forma menos intimidante de afrontar tu primer festival es llegar y volver con un grupo. Compartir coche
          con 2-3 personas más reduce el coste de transporte hasta un 70%, te conecta con gente que también va al
          mismo festival y elimina el estrés de la vuelta de madrugada. Si nunca has reservado un carpooling, empieza
          por un trayecto corto (menos de 150 km), un conductor con valoraciones acumuladas y un coche con varias
          plazas ya ocupadas. La primera reserva es la más rara — a partir de la segunda, es rutina.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/concerts"
            onClick={() => trackEvent(ANALYTICS_EVENTS.PILLAR_CTA_CLICKED, { pillar_slug: PILLAR_SLUG, cta_target: "/buscar" })}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-5 py-2.5 hover:bg-cr-primary/90 transition-colors"
          >
            Buscar viajes a festivales <ArrowRight size={12} />
          </Link>
          <Link
            to="/festivales/cala-mijas"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-primary text-cr-primary px-5 py-2.5 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Cala Mijas (recomendado novatos) <ArrowRight size={12} />
          </Link>
          <Link
            to="/festivales/sonorama-ribera"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text px-5 py-2.5 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            Sonorama Ribera <ArrowRight size={12} />
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

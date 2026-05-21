import { Link } from "react-router-dom";
import {
  ArrowRight,
  Crown,
  Wallet,
  Clock,
  Sparkles,
  Music,
  HeartHandshake,
  Users,
  Coffee,
  ShieldCheck,
  Calendar,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const PILLAR_SLUG = "guia-festival-veterano";

/**
 * Pillar SEO page — cluster "Festivalero veterano / mayor de 35 años".
 *
 * Targets: "festivales para mayores de 35", "festivales 40 años España",
 * "festival adulto España", "festival con VIP España", "festival sin
 * adolescentes España", "festival rock clásico España", "carpooling adultos".
 *
 * Awareness/middle-funnel cluster orientado al público 35-60 años que vuelve a
 * festivales tras pausa familiar o que se incorpora por primera vez como
 * adulto. Combina nostalgia + practicidad (logística, comodidades, VIP).
 *
 * NOTE: Per CLAUDE.md "Brand Restrictions" — NEVER name competing carpooling
 * brands. Si hace falta referirse a la competencia genérica usar siempre
 * "otras plataformas de carpooling generalistas".
 */

const FAQS = [
  {
    q: "¿Cuál es el mejor festival para mayores de 35 años en España?",
    a: "Para una experiencia 35+ recomendamos cinco festivales por su cartel, comodidades y formato adulto: BBK Music Legends (Sondika, Bilbao, junio) — clásicos del rock y pop internacional con escenario único y horarios civilizados que terminan sobre la 01:00; Sonorama Ribera (Aranda de Duero, mediados de agosto) — pueblo, ambiente intergeneracional y cartel indie/nostalgia 90s; Cap Roig Festival (Calella de Palafrugell, julio-agosto) — anfiteatro al aire libre con butaca asignada, sesiones de 90 minutos y cartel cuidado; Starlite Marbella (julio-agosto) — formato premium con cena, butaca y artistas de gira mundial; Tío Pepe Festival (Jerez, julio) — boutique en bodega con público adulto y aforo limitado. Si te interesa rock clásico al aire libre, BBK Music Legends es la apuesta más clara; si prefieres butaca y cena, Cap Roig o Starlite son la referencia.",
  },
  {
    q: "¿Cuánto cuesta un pase VIP en festivales españoles?",
    a: "Los pases VIP en festivales españoles tier-1 oscilan entre 150 € y 400 € por día en 2026 según el evento y el nivel de paquete. Lo que suelen incluir: acceso a zonas elevadas con vista al escenario principal, baños privados o cabinas premium, barra de bebidas y/o food incluido, fast lane de entrada, parking VIP a 200-500 metros y, en algunos casos (Mad Cool, Primavera Sound, Cala Mijas), zonas con sombra y asientos. Mad Cool ofrece pases desde unos 180 €/día con upgrades hasta paquetes Diamond superiores a 1.000 € el fin de semana. Cap Roig y Starlite Marbella incluyen butaca asignada en todos sus tickets — no manejan VIP en el sentido de festivales masivos. Antes de comprar VIP, comprueba qué incluye realmente y compara con el coste de tu lista de comodidades por separado.",
  },
  {
    q: "¿Se puede ir a festivales con niños mayores de 12 años?",
    a: "Sí, pero depende mucho del festival. La mayoría de festivales españoles permiten menores acompañados de un adulto responsable, aunque las normas varían: BBK Music Legends y Sonorama Ribera son los más family-friendly con áreas específicas y descuentos para menores de 16 años; Cap Roig admite niños desde edad temprana con butacas reservadas; Cala Mijas y Tío Pepe Festival son tolerantes pero sin actividades específicas para menores; festivales urbanos masivos (Mad Cool, Primavera Sound) son legalmente accesibles pero menos cómodos por la densidad y los horarios nocturnos. Para 12-15 años recomendamos festivales boutique con cartel diurno y final antes de la medianoche; para 16+ años funcionan formatos más amplios. Lleva siempre identificación del menor, autorización paterna si no asistes los dos progenitores y protección auditiva.",
  },
  {
    q: "¿Qué festivales tienen menos ruido y horarios más razonables?",
    a: "Los festivales boutique y de formato butaca son los que ofrecen horarios más razonables para público adulto. Cap Roig Festival (Calella de Palafrugell) cierra sobre la medianoche con sesiones únicas de 90 minutos en anfiteatro al aire libre; Starlite Marbella programa actuaciones entre las 22:00 y la 01:00 en formato cena-concierto; Tío Pepe Festival (Jerez) opera en bodega con final sobre la 01:00; Cap Roig y Festival Pirineos Sur (Lanuza) tienen niveles de sonido más bajos por su formato natural y aforo limitado; BBK Music Legends cierra sobre la 01:00 con un único escenario y sin solapamientos de horarios. Si buscas evitar madrugadas, prioriza festivales con escenario único, butaca o anfiteatro: la combinación reduce el ruido percibido y los desplazamientos dentro del recinto.",
  },
  {
    q: "¿Cómo encontrar carpooling con adultos en festivales?",
    a: "Tres pistas concretas: (1) filtra los viajes por origen y festival en ConcertRide y revisa la foto y bio del conductor — los perfiles más completos suelen indicar edad, profesión u otros festivales previos; (2) lee las valoraciones acumuladas — un conductor 35+ con 10+ valoraciones positivas en festivales como BBK Music Legends, Sonorama o Cap Roig probablemente atrae pasajeros de perfil similar; (3) publica tu propia ruta si tienes coche y describe tu perfil en la bio (música que pondrás en el viaje, hora de salida, no fumadores). En festivales con cartel orientado a 35+ (Cap Roig, BBK Music Legends, Tío Pepe) el público de carpooling es naturalmente más adulto que en festivales tipo Arenal Sound o O Son do Camiño. El ahorro frente a gasolina solo es de 25-35 € por asiento en rutas de 300-500 km, y el ambiente del coche tiende a ser más conversacional y puntual.",
  },
];

const FESTIVALES_35 = [
  {
    slug: "bbk-music-legends",
    name: "BBK Music Legends",
    region: "Sondika, Bilbao (Vizcaya)",
    when: "Mediados de junio",
    profile: "Clásicos del rock y pop internacional",
    why: "Escenario único, sin solapamientos de horarios, cierre sobre la 01:00 y carteles construidos sobre grandes nombres del rock clásico (Deep Purple, Status Quo, Bryan Adams). Recinto manejable, buen acceso desde Bilbao en transporte público y carpooling y zona VIP con sombra.",
  },
  {
    slug: "sonorama-ribera",
    name: "Sonorama Ribera",
    region: "Aranda de Duero, Burgos",
    when: "Mediados de agosto",
    profile: "Indie + nostalgia 90s/2000s",
    why: "Festival de pueblo con ambiente intergeneracional. La programación combina indie nacional reciente con bandas de los 90 y los 2000 que llenan plaza. Aranda de Duero ofrece alojamiento variado y la oferta gastronómica es de las mejores del circuito.",
  },
  {
    slug: "cala-mijas",
    name: "Cala Mijas",
    region: "Mijas, Málaga",
    when: "Finales de agosto",
    profile: "Pop premium y headliners internacionales",
    why: "Playa, clima estable, cartel con grandes nombres de pop y rock contemporáneo, infraestructura nueva y opciones VIP que incluyen sombra y baños privados. El público mezcla franjas de edad y la oferta gastronómica supera la media de festivales playeros.",
  },
  {
    slug: "mad-cool",
    name: "Mad Cool",
    region: "Iberdrola Music, Villaverde, Madrid",
    when: "Primera quincena de julio",
    profile: "Rock y pop internacional con paquetes VIP completos",
    why: "El festival con la oferta VIP más desarrollada de España: desde pases premium con barra incluida hasta paquetes Diamond con zona elevada, sombra estructurada y catering. Cartel orientado a 30-55 años (Pearl Jam, The Killers, Foo Fighters en ediciones recientes).",
  },
  {
    slug: "cap-roig-festival",
    name: "Cap Roig Festival",
    region: "Calella de Palafrugell, Girona",
    when: "Julio-agosto (un mes completo)",
    profile: "Cartel cuidado en anfiteatro al aire libre con butaca",
    why: "Formato butaca-concierto en anfiteatro frente al Mediterráneo. Una actuación por noche, duración 90 minutos, cierre antes de la medianoche. Cartel ecléctico (jazz, pop adulto, clásica cruzada). La opción más adulta y tranquila del circuito catalán.",
  },
  {
    slug: "fib",
    name: "Festival Internacional de Benicàssim (FIB)",
    region: "Benicàssim, Castellón",
    when: "Mediados de julio",
    profile: "Festival histórico con cartel mixto",
    why: "Uno de los festivales veteranos de Europa, en activo desde 1995. El cartel combina cabezas internacionales con bandas indie y electrónica. Pese al perfil joven dominante, sigue atrayendo público que va desde los 90 y mantiene opciones de glamping y zonas VIP.",
  },
  {
    slug: "pirineos-sur",
    name: "Pirineos Sur",
    region: "Lanuza, Huesca",
    when: "Segunda quincena de julio",
    profile: "World music y fusión",
    why: "Escenario flotante sobre el embalse de Lanuza en el Pirineo aragonés. Niveles de sonido contenidos, cartel internacional de músicas del mundo y un público naturalmente 30-60. Ideal para combinar festival con turismo de montaña y termalismo en Panticosa.",
  },
  {
    slug: "starlite-marbella",
    name: "Starlite Occident",
    region: "Marbella, Málaga",
    when: "Julio-agosto",
    profile: "Premium VIP en cantera al aire libre",
    why: "Formato cena-concierto con butaca o mesa, actuaciones entre las 22:00 y la 01:00, cartel orientado a grandes nombres del pop, jazz y latin. El paquete VIP incluye acceso a zonas de restauración premium y aparcamiento próximo.",
  },
  {
    slug: "tio-pepe-festival",
    name: "Tío Pepe Festival",
    region: "Jerez de la Frontera, Cádiz",
    when: "Julio",
    profile: "Boutique en bodega histórica",
    why: "Aforo limitado en patios de la bodega González Byass, butaca asignada y cartel que mezcla artistas españoles consagrados con propuestas internacionales en formato íntimo. Combinable con turismo enológico y final sobre la 01:00.",
  },
  {
    slug: "stone-music",
    name: "Festival Stone & Music",
    region: "Mérida, Badajoz",
    when: "Julio-agosto",
    profile: "Anfiteatro romano",
    why: "Conciertos en el Teatro Romano de Mérida — uno de los escenarios más singulares del circuito europeo. Cartel premium con butaca, una actuación por noche y duración contenida. Combinable con turismo cultural por Extremadura.",
  },
];

const VIP_PASOS = [
  {
    name: "Valora tu presupuesto total del fin de semana",
    text: "Antes de mirar paquetes VIP, calcula el coste total del festival con tarifa general: entrada, alojamiento, transporte y comida fuera del recinto. Un fin de semana en un tier-1 español ronda 320-540 € por persona en formato estándar. Sumar 150-400 €/día de VIP puede duplicar el coste, así que el cálculo merece honesto.",
  },
  {
    name: "Compara lo que incluye el pase VIP vs comprarlo por separado",
    text: "Algunos paquetes VIP incluyen comida y bebida en bandeja por valor 50-80 €/día, otros solo zona privilegiada de visión. Si lo que valoras es sombra, baños y barra rápida, calcula cuánto te costaría: 4 cervezas a 7 € + comida media 15 € = 43 € por sesión. Si el VIP cuesta 180 € por encima del general, el cálculo de equivalencia rara vez sale a favor a no ser que también te interese la zona de visión.",
  },
  {
    name: "Decide entre VIP de 1 día o VIP de todos los días",
    text: "Una estrategia mixta funciona muy bien para audiencia 35+: tarifa general dos días + VIP el día del cartel que más te interesa (normalmente el sábado con los cabezas grandes). Reservas la inversión para el momento más exigente físicamente — los conciertos largos al sol o las multitudes densas — y disfrutas los otros días en formato relajado. Otra opción: VIP en pareja sumando los dos pases iguales para compartir zona.",
  },
];

export default function GuiaFestivalVeteranoPage() {
  const today = new Date().toISOString().slice(0, 10);

  useSeoMeta({
    title: "Festivales para mayores de 35 años en España 2026 [Guía]",
    description:
      "Top 10 festivales 35+ friendly en España 2026: pases VIP desde 150€, horarios razonables, carpooling adulto y ahorro real frente al taxi. Guía 2026.",
    canonical: `${SITE_URL}/guia/festival-veterano-aficionados-mayores-2026`,
    keywords:
      "festivales para mayores de 35, festivales 40 años España, festival adulto España, festival con VIP España, festival sin adolescentes, festival rock clásico España, carpooling adultos",
    ogType: "article",
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: "Festivales para mayores de 35 años en España 2026 — guía completa adulto — ConcertRide",
    articlePublishedTime: "2026-05-20",
    articleModifiedTime: today,
    articleAuthor: "Equipo ConcertRide",
    articleSection: "Guías",
    breadcrumb: [
      { position: 1, name: "Inicio", url: `${SITE_URL}/` },
      { position: 2, name: "Guías", url: `${SITE_URL}/guia-transporte-festivales` },
      { position: 3, name: "Festival veterano 2026", url: `${SITE_URL}/guia/festival-veterano-aficionados-mayores-2026` },
    ],
  });

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Festivales para mayores de 35 años en España 2026: guía completa para festivaleros veteranos y aficionados adultos",
    description:
      "Guía 2026 para festivaleros 35+ en España: por qué ha crecido la audiencia adulta, top 10 festivales 35+ friendly (BBK Music Legends, Sonorama Ribera, Cap Roig, Mad Cool, Cala Mijas, Starlite, Tío Pepe, Stone & Music, Pirineos Sur, FIB), diferencias respecto a festivales 18-25, análisis de los paquetes VIP y por qué el carpooling adulto funciona mejor.",
    url: `${SITE_URL}/guia/festival-veterano-aficionados-mayores-2026`,
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
    datePublished: "2026-05-20",
    dateModified: today,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og/home.png`,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: `${SITE_URL}/guia/festival-veterano-aficionados-mayores-2026`,
    articleSection: "Guías festivales adulto",
    keywords:
      "festivales para mayores de 35, festival adulto España, festival con VIP, festival rock clásico, carpooling adultos, festivaleros veteranos",
    about: [
      { "@type": "Thing", name: "Festivales de música en España" },
      { "@type": "Thing", name: "Festivales para público adulto 35-60 años" },
      { "@type": "Thing", name: "Paquetes VIP en festivales" },
      { "@type": "Thing", name: "Carpooling para conciertos y festivales" },
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".lede", "[data-quotable]", ".speakable"],
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
        name: "Festival veterano 2026",
        item: `${SITE_URL}/guia/festival-veterano-aficionados-mayores-2026`,
      },
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
    name: "Cómo decidir si comprar un pase VIP en un festival español",
    description:
      "Tres pasos ordenados para evaluar si un paquete VIP en un festival español tier-1 (Mad Cool, Primavera Sound, Cala Mijas, BBK Music Legends) compensa frente a la tarifa general: valorar presupuesto total, comparar lo incluido vs comprarlo por separado y decidir entre VIP de un día o VIP de todos los días.",
    inLanguage: "es-ES",
    totalTime: "P3D",
    step: VIP_PASOS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${SITE_URL}/guia/festival-veterano-aficionados-mayores-2026#vip-${i + 1}`,
    })),
  };

  const jsonLdSpeakable = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Festivales para mayores de 35 años en España 2026",
    url: `${SITE_URL}/guia/festival-veterano-aficionados-mayores-2026`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".lede", "[data-quotable]", ".speakable"],
    },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSpeakable) }} />

      {/* ── Hero ── */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-6 space-y-4 border-b border-cr-border">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/guia-transporte-festivales" className="hover:text-cr-primary">Guías</Link>
          <span aria-hidden="true">/</span>
          <span>Festival veterano 2026</span>
        </nav>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Guía pillar · Cluster festivaleros 35+ · Edición 2026 · Actualizado {today}
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Festivales<br />para mayores de 35
        </h1>
        <p
          className="lede font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable"
          data-quotable="true"
        >
          <strong className="text-cr-text">El segmento 35-60 años representa hoy entre un 25% y un 35% del público en
          festivales españoles tier-1</strong>, según los informes anuales de la{" "}
          <a
            href="https://apmusicales.com/"
            rel="noopener noreferrer"
            target="_blank"
            className="text-cr-primary hover:underline"
          >
            APM (Asociación de Promotores Musicales)
          </a>
          . Cinco festivales especialmente 35+ friendly en 2026:{" "}
          <Link to="/festivales/bbk-music-legends" className="text-cr-primary hover:underline">BBK Music Legends</Link>{" "}
          (rock clásico, Bilbao),{" "}
          <Link to="/festivales/sonorama-ribera" className="text-cr-primary hover:underline">Sonorama Ribera</Link>{" "}
          (nostalgia 90s, Aranda),{" "}
          <Link to="/festivales/cap-roig-festival" className="text-cr-primary hover:underline">Cap Roig</Link>{" "}
          (butaca al aire libre, Girona),{" "}
          <Link to="/festivales/cala-mijas" className="text-cr-primary hover:underline">Cala Mijas</Link>{" "}
          (pop premium, Málaga) y{" "}
          <Link to="/festivales/mad-cool" className="text-cr-primary hover:underline">Mad Cool</Link>{" "}
          (cartel internacional + VIP, Iberdrola Music Madrid). El{" "}
          <strong className="text-cr-text">carpooling adulto ahorra 25-35 € por asiento</strong> frente a gasolina solo
          en rutas de 300-500 km y reduce el estrés logístico de la vuelta de madrugada.
        </p>
      </div>

      {/* ── Sección 1: Por qué creció audiencia 35+ ── */}
      <section className="max-w-4xl mx-auto px-6 py-14 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 1</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Users size={28} className="text-cr-primary" aria-hidden="true" />
            Por qué ha crecido la audiencia 35+ en festivales
          </h2>
        </div>

        <p className="font-sans text-sm md:text-base text-cr-text-muted leading-relaxed max-w-2xl speakable">
          El crecimiento de la audiencia adulta en festivales españoles no es anécdota: los informes de la{" "}
          <a
            href="https://apmusicales.com/"
            rel="noopener noreferrer"
            target="_blank"
            className="text-cr-primary hover:underline"
          >
            APM (Asociación de Promotores Musicales)
          </a>
          {" "}han documentado una transición sostenida en los últimos diez años. Varios factores explican el cambio.
        </p>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          <strong className="text-cr-text">Poder adquisitivo</strong>. El público 35-60 tiene capacidad para pagar entradas
          de 140-220 €, paquetes VIP de 150-400 €/día y alojamiento de hotel en lugar de tienda de camping. Eso ha
          generado un mercado de oferta paralelo (zonas premium, glamping, butaca asignada) que diez años atrás era
          marginal y hoy es columna vertebral del ingreso de muchos festivales.
        </p>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          <strong className="text-cr-text">Nostalgia 80s, 90s y 2000s</strong>. Las giras de reunión de bandas con 25-40
          años de carrera (Deep Purple, Bryan Adams, The Cure, Pearl Jam, Foo Fighters, Estopa, Hombres G, Coldplay)
          atraen a quien tenía 15-25 años cuando esos grupos despuntaron. Festivales como BBK Music Legends han hecho de
          la nostalgia su tesis editorial completa: un solo escenario, sin solapamientos, cierre civilizado y nombres
          que llenan estadios desde hace décadas.
        </p>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          <strong className="text-cr-text">Reactivación post-pandemia</strong>. Entre 2022 y 2024 el público adulto volvió
          a llenar festivales que había abandonado durante la fase familiar (hijos pequeños, hipoteca, agenda profesional
          densa). El estudio del{" "}
          <a
            href="https://www.ine.es/"
            rel="noopener noreferrer"
            target="_blank"
            className="text-cr-primary hover:underline"
          >
            Instituto Nacional de Estadística (INE)
          </a>
          {" "}sobre prácticas culturales 2023-2024 muestra que la asistencia a conciertos en franjas 35-54 años creció
          de forma sostenida respecto al periodo pre-2020.
        </p>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          <strong className="text-cr-text">Ofertas VIP que reducen las fricciones físicas</strong>. Los baños privados,
          el fast lane, la barra premium y las zonas con sombra resuelven los tres puntos que más penalizaban al público
          adulto en festival: cola de servicios, aglomeración en barra y exposición prolongada al sol. Con un pase VIP,
          un festival de 3 días deja de ser una resistencia física para convertirse en una experiencia comparable a un
          ciclo de conciertos con butaca.
        </p>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          <strong className="text-cr-text">Festivales con cartel mixto</strong>. Mad Cool, Primavera Sound, Cala Mijas o
          FIB programan deliberadamente cabezas internacionales con base de público 35-55 (Pearl Jam, The Killers, Lana
          Del Rey) junto a propuestas indie y urbanas más jóvenes. El cartel mixto permite a familias o grupos
          intergeneracionales coincidir en el mismo evento, algo impensable en festivales monolíticos. Y a la inversa:
          la audiencia adolescente más joven está migrando progresivamente al streaming y al concierto único, lo que
          libera espacio para públicos adultos en festivales tradicionalmente percibidos como juveniles.
        </p>
      </section>

      {/* ── Sección 2: Top 10 festivales 35+ ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 2</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Music size={28} className="text-cr-primary" aria-hidden="true" />
            Top 10 festivales 35+ friendly en España 2026
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Seleccionados por tres criterios: cartel orientado al público adulto, comodidades reales (VIP, butaca,
            sombra, alojamiento variado) y horarios razonables. Ordenados por accesibilidad para alguien que vuelve a
            festivales o que se incorpora por primera vez como adulto.
          </p>
        </div>

        <div className="space-y-3">
          {FESTIVALES_35.map((f, i) => (
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
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-cr-primary">{f.profile}</p>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{f.why}</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">
                Ver ficha {f.name} <ArrowRight size={11} />
              </span>
            </Link>
          ))}
        </div>

        <div className="p-5 border border-cr-primary/30 bg-cr-primary/5 space-y-2">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-cr-primary" />
            <p className="font-display text-base uppercase text-cr-primary">Pillars complementarios</p>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Si quieres profundizar antes de elegir tu festival adulto, consulta{" "}
            <Link to="/guia/festival-internacional-espana" className="text-cr-primary hover:underline">la guía pillar de festivales internacionales en España</Link>,{" "}
            <Link to="/guia/festival-accesibilidad-movilidad-reducida" className="text-cr-primary hover:underline">la guía de accesibilidad y movilidad reducida</Link>{" "}
            o el calendario completo en{" "}
            <Link to="/datos/calendario-maestro-festivales-2026" className="text-cr-primary hover:underline">/datos/calendario-maestro-festivales-2026</Link>
            .
          </p>
        </div>
      </section>

      {/* ── Sección 3: Diferencias con festivales 18-25 ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 3</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Clock size={28} className="text-cr-primary" aria-hidden="true" />
            Diferencias respecto a festivales 18-25
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Un festival 35+ friendly no es un festival juvenil con un escenario silenciado. Son productos diseñados
            desde el principio para una audiencia con expectativas, presupuesto y resistencia física distintas. Estas
            son las diferencias que te encontrarás en la práctica.
          </p>
        </div>

        <article className="border border-cr-border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-cr-primary" aria-hidden="true" />
            <h3 className="font-display text-base uppercase">Horarios</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Festivales 35+ friendly (BBK Music Legends, Cap Roig, Tío Pepe, Starlite) cierran entre las 01:00 y las
            02:00. Festivales juveniles tipo Arenal Sound, Medusa o O Son do Camiño no paran hasta las 06:00. La
            diferencia no es solo el final: los conciertos potentes del cartel adulto suelen estar entre las 21:00 y la
            00:00, mientras que en festivales juveniles los headliners empiezan a las 02:00. Para quien tiene 40 años y
            trabaja el lunes, no tener que aguantar hasta el amanecer para ver al cabeza de cartel cambia la experiencia
            por completo.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Music size={16} className="text-cr-primary" aria-hidden="true" />
            <h3 className="font-display text-base uppercase">Tipo de cartel</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Festivales 35+ programan rock clásico (Deep Purple, Bryan Adams), pop adulto (Coldplay, Pearl Jam), indie
            con trayectoria (Vetusta Morla, Iván Ferreiro, Love of Lesbian), nostalgia 90s (Hombres G, Estopa) o jazz/
            world music (Pirineos Sur, Cap Roig). Festivales 18-25 priorizan reguetón, trap, EDM y pop urbano (Bizarrap,
            Quevedo, Aitana, J Balvin). Hay festivales mixtos (Mad Cool, Cala Mijas, FIB, Primavera Sound) que combinan
            ambos universos y son los más interesantes para grupos intergeneracionales.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Crown size={16} className="text-cr-primary" aria-hidden="true" />
            <h3 className="font-display text-base uppercase">Paquetes VIP y comodidades</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            La oferta VIP es desproporcionadamente más desarrollada en festivales 35+ y mixtos. Mad Cool, Primavera
            Sound, Cala Mijas, BBK Music Legends y Cap Roig tienen líneas completas de paquetes premium que pueden
            triplicar el precio del pase general. Festivales juveniles tipo Arenal Sound o Medusa apenas tienen oferta
            VIP — la demanda no compensa. Si lo que valoras son baños limpios, sombra, fast lane y barra rápida,
            asegúrate antes de comprar de que el festival que eliges tiene esa oferta.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-cr-primary" aria-hidden="true" />
            <h3 className="font-display text-base uppercase">Ubicación y alojamiento</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Festivales 35+ suelen estar en entornos urbanos accesibles (Bilbao, Madrid, Marbella, Jerez, Mérida) con
            alojamiento de hotel o casa rural disponible a menos de 15 minutos. Festivales juveniles operan en zonas
            costeras remotas con camping masivo como única opción real (Arenal Sound, Medusa, Reggaeton Beach Festival).
            Para audiencia adulta el coste de un hotel 3-4* en pueblo cercano (60-110 €/noche) compensa frente a la
            incomodidad de la tienda. Sonorama Ribera es el mejor ejemplo de festival adulto sin opción urbana pero con
            oferta de casas rurales y hoteles en Aranda de Duero a 10 minutos.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Coffee size={16} className="text-cr-primary" aria-hidden="true" />
            <h3 className="font-display text-base uppercase">Gastronomía y bebida</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            La oferta culinaria de festivales 35+ va claramente más allá del food truck básico: Cap Roig incluye opción
            de cena pre-concierto, Starlite Marbella opera en formato cena con mesa, Tío Pepe combina con cata de vinos
            de la bodega y Cala Mijas tiene oferta de restauración cuidada (asador, sushi, vegano). El público adulto
            paga más por una comida decente y los festivales lo saben. En festivales juveniles la oferta sigue siendo
            mayoritariamente pizza, hamburguesa y kebab a precios de festival (10-14 € la ración).
          </p>
        </article>
      </section>

      {/* ── Sección 4: VIP packages ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 4</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Crown size={28} className="text-cr-primary" aria-hidden="true" />
            Paquetes VIP: ¿vale la pena pagar más?
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            La pregunta no es si el VIP es caro — claramente lo es — sino si los 150-400 € extra por día se traducen en
            valor real para tu perfil. Te lo desglosamos.
          </p>
        </div>

        <article className="border border-cr-border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-cr-primary" aria-hidden="true" />
            <h3 className="font-display text-base uppercase">Rangos de precio reales 2026</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Los paquetes VIP en festivales españoles tier-1 se mueven en estos rangos en 2026:{" "}
            <strong className="text-cr-text">Mad Cool</strong> desde 180 €/día (VIP básico) hasta más de 1.000 € fin de
            semana en paquetes Diamond con zona elevada, sombra estructurada y catering; <strong className="text-cr-text">
            Primavera Sound</strong> entre 200 € y 450 €/día con barra incluida en algunos niveles; <strong className="text-cr-text">
            Cala Mijas</strong> entre 150 € y 350 €/día con sombra y baños privados; <strong className="text-cr-text">
            BBK Music Legends</strong> entre 120 € y 250 €/día (más asequible por escenario único); <strong className="text-cr-text">
            Cap Roig y Starlite</strong> no tienen VIP en sentido estricto — el ticket general ya incluye butaca asignada
            (rango 60-180 €/sesión).
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-cr-primary" aria-hidden="true" />
            <h3 className="font-display text-base uppercase">Qué incluye típicamente un pase VIP</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Acceso a zona privada con visión elevada del escenario principal; baños privados o cabinas premium con
            menor cola; barra de bebidas exclusiva, en algunos casos con bebida incluida o con catering completo; fast
            lane de entrada al recinto (ahorra 1-2 h el primer día); parking VIP a menos de 500 metros del recinto;
            zona de descanso con sombra y asientos; en niveles altos (Diamond, Platinum), pulseras cashless precargadas,
            acceso a backstage o meet and greet con algunos artistas. Lo que no incluye casi nunca: alojamiento (eso es
            un paquete travel diferente), traslado al recinto desde el alojamiento, ni tickets para días no contratados.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-cr-primary" aria-hidden="true" />
            <h3 className="font-display text-base uppercase">Cálculo: ¿compensa frente a gestión propia?</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Un cálculo realista para un festival tier-1 de 3 días: tarifa general (~180 €) + alojamiento hotel cercano
            (3 noches × 90 € = 270 €) + carpooling ida/vuelta (~25 €) + comida y bebida fuera del recinto (~120 €) +
            barra y comida dentro del recinto (~180 €) = aprox. 775 € por persona. Misma persona en formato VIP:
            paquete VIP 3 días (~600 €) + alojamiento (270 €) + carpooling (25 €) + comida dentro (~50 €, incluida
            parte) = aprox. 945 €. El sobreprecio del VIP supone 170 € por persona a cambio de zona privada, fast lane,
            baños premium y sombra. <strong className="text-cr-text">Compensa si</strong> el cartel principal te
            interesa de verdad los tres días, viajas en pareja o grupo (compartís zona privada), o tienes alguna
            limitación física que la zona general agravaría. <strong className="text-cr-text">No compensa si</strong>
            {" "}solo te interesa el cabeza de cartel del sábado o si tu prioridad es socializar con público diverso —
            las zonas VIP suelen ser pequeñas y aisladas.
          </p>
        </article>

        <ol className="space-y-4 list-none">
          {VIP_PASOS.map((step, i) => (
            <li
              key={step.name}
              id={`vip-${i + 1}`}
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
      </section>

      {/* ── Sección 5: Carpooling con adultos ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 5</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <HeartHandshake size={28} className="text-cr-primary" aria-hidden="true" />
            Carpooling con adultos: por qué funciona mejor
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            El carpooling entre adultos comparte la misma lógica de fondo que entre veinteañeros — repartir gasto y
            reducir CO₂ — pero la dinámica práctica es radicalmente distinta. Quienes lo han probado lo describen como
            un viaje civilizado más cercano a un coche compartido entre compañeros de trabajo que a un autobús festivo.
          </p>
        </div>

        <article className="border border-cr-border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-cr-primary" aria-hidden="true" />
            <h3 className="font-display text-base uppercase">Puntualidad y compromiso</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Pasajeros 35+ tienden a respetar horarios pactados con bastante más fiabilidad. La regla no escrita es
            llegar 5 minutos antes del horario de recogida, avisar con horas (no minutos) si surge un retraso, y no
            cancelar la víspera salvo emergencia real. Si vas a un festival con plan de trabajo el lunes, esa
            puntualidad es lo que distingue una vuelta tranquila de una pesadilla logística.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-cr-primary" aria-hidden="true" />
            <h3 className="font-display text-base uppercase">Ahorro real</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            En una ruta tipo Madrid-BBK Music Legends (~400 km) un conductor solo gasta unos 90-110 € en gasolina y
            peajes ida y vuelta. Compartido a 4 personas, el coste cae a 22-28 € por asiento. En rutas más cortas como
            Madrid-Sonorama (~160 km) la cifra baja a 10-14 €/asiento. La diferencia entre carpooling y solo es de 25-35
            € por trayecto, y entre carpooling y bus oficial entre 5 y 20 € — pero con la ventaja de horario flexible y
            puerta a puerta.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-cr-primary" aria-hidden="true" />
            <h3 className="font-display text-base uppercase">Conversación adulta y ambiente</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Compartir 4-5 horas de viaje con tres personas adultas que también van a Cap Roig, Sonorama o BBK Music
            Legends crea naturalmente una conversación de cierto nivel: gustos musicales acumulados, recuerdos de
            festivales, recomendaciones de gastronomía local. Para muchos pasajeros 35+ ese trayecto se ha convertido
            en parte de la experiencia, no en un mero traslado. Si te interesa buscar conductor o pasajeros con tu
            perfil de edad, entra a{" "}
            <Link to="/buscar" className="text-cr-primary hover:underline">/buscar</Link>{" "}
            y filtra por festival. Si tienes coche y prefieres organizar tu propia ruta con plazas vacías, publícala en{" "}
            <Link to="/publish" className="text-cr-primary hover:underline">/publish</Link>{" "}
            y describe tu perfil en la bio.
          </p>
        </article>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 6</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">Preguntas frecuentes</h2>
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
            Fichas de los diez festivales recomendados, otras guías pillar para profundizar y datasets con precios y
            calendario completos.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 font-sans text-sm">
          <Link to="/festivales/bbk-music-legends" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            BBK Music Legends 2026
          </Link>
          <Link to="/festivales/sonorama-ribera" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Sonorama Ribera 2026
          </Link>
          <Link to="/festivales/cala-mijas" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Cala Mijas 2026
          </Link>
          <Link to="/festivales/mad-cool" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Mad Cool 2026
          </Link>
          <Link to="/festivales/cap-roig-festival" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Cap Roig Festival 2026
          </Link>
          <Link to="/festivales/fib" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            FIB Benicàssim 2026
          </Link>
          <Link to="/festivales/pirineos-sur" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pirineos Sur 2026
          </Link>
          <Link to="/festivales/starlite-marbella" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Starlite Marbella 2026
          </Link>
          <Link to="/festivales/tio-pepe-festival" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Tío Pepe Festival 2026
          </Link>
          <Link to="/festivales/stone-music" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Stone & Music 2026
          </Link>
          <Link to="/conciertos/bilbao" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Conciertos Bilbao
          </Link>
          <Link to="/conciertos/madrid" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Conciertos Madrid
          </Link>
          <Link to="/conciertos/marbella" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Conciertos Marbella
          </Link>
          <Link to="/conciertos/jerez-de-la-frontera" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Conciertos Jerez
          </Link>
          <Link to="/datos/calendario-maestro-festivales-2026" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Dataset: calendario completo 2026
          </Link>
          <Link to="/datos/festivales-mas-caros-mas-baratos-llegar-2026" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Dataset: ranking precios 2026
          </Link>
          <Link to="/datos/alojamiento-cercano-festivales-2026" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Dataset: alojamiento por festival
          </Link>
          <Link to="/guia-transporte-festivales" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: transporte a festivales
          </Link>
          <Link to="/guia/presupuesto-festival-grupo" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: presupuesto grupo de 4
          </Link>
          <Link to="/guia/festival-internacional-espana" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: festivales internacionales en España
          </Link>
          <Link to="/guia/festival-accesibilidad-movilidad-reducida" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: accesibilidad y movilidad reducida
          </Link>
          <Link to="/guia/festival-sostenible-co2" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: festival sostenible CO₂
          </Link>
          <Link to="/festivales" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Todos los festivales 2026
          </Link>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-4">
        <h2 className="font-display text-2xl md:text-3xl uppercase flex items-center gap-3">
          <Users size={28} className="text-cr-primary" aria-hidden="true" />
          Carpooling adulto: el último filtro de tu fin de semana
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed">
          Si has decidido qué festival vas a ver y has decidido si te interesa o no el paquete VIP, la última pieza es
          el trayecto. Compartir coche con otros pasajeros 35+ es la forma más eficiente de llegar a un festival
          español hoy: ahorras 25-35 € respecto a ir solo en coche, evitas el caos del transporte público de madrugada,
          conoces a gente con tu mismo plan y reduces la huella de CO₂ del trayecto. Reserva tu ruta o publica la tuya
          con plazas vacías — la primera reserva es la única rara; a partir de la segunda, es rutina.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/publish"
            onClick={() => trackEvent(ANALYTICS_EVENTS.PILLAR_CTA_CLICKED, { pillar_slug: PILLAR_SLUG, cta_target: "/publish" })}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-5 py-2.5 hover:bg-cr-primary/90 transition-colors"
          >
            Publicar mi viaje <ArrowRight size={12} />
          </Link>
          <Link
            to="/festivales"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-primary text-cr-primary px-5 py-2.5 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Ver todos los festivales 2026 <ArrowRight size={12} />
          </Link>
          <Link
            to="/festivales/bbk-music-legends"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text px-5 py-2.5 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            BBK Music Legends (35+ insignia) <ArrowRight size={12} />
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

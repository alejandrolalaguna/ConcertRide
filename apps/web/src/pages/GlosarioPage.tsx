import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * Glosario de carpooling y festivales de música.
 * SSR-safe: no window/document usage.
 */

interface GlosEntry {
  term: string;
  slug: string;
  definition: string;
  category: "carpooling" | "festival" | "legal" | "plataforma";
}

const GLOSARIO: GlosEntry[] = [
  // ── Carpooling / transporte ──────────────────────────────────────────────────
  {
    term: "Carpooling",
    slug: "carpooling",
    category: "carpooling",
    definition:
      "Modalidad de transporte compartido en la que un conductor lleva a uno o varios pasajeros en su propio vehículo y reparte los gastos del trayecto (combustible, peajes) entre los ocupantes. El objetivo es reducir costes, emisiones de CO₂ y el número de vehículos en circulación. En España el Tribunal Supremo lo reconoció como legal en 2017 siempre que no haya lucro para el conductor.",
  },
  {
    term: "Ride-sharing",
    slug: "ride-sharing",
    category: "carpooling",
    definition:
      "Término anglosajón equivalente al carpooling: compartir un viaje en coche entre varias personas que van en la misma dirección. A diferencia del car-sharing, en el ride-sharing el conductor lleva a pasajeros a un destino concreto y no alquila el vehículo. Se usa especialmente en contextos de festivales y conciertos cuando el destino es un evento específico.",
  },
  {
    term: "Car-sharing",
    slug: "car-sharing",
    category: "carpooling",
    definition:
      "Alquiler de vehículo por horas o días a través de una plataforma (por ejemplo, Getaround o Share Now). El usuario toma un coche sin conductor y lo devuelve después. Es diferente del carpooling o ride-sharing, en el que el coche lo conduce el propietario y los pasajeros acompañan y comparten gastos sin alquilar el vehículo.",
  },
  {
    term: "Conductor verificado",
    slug: "conductor-verificado",
    category: "carpooling",
    definition:
      "Conductor que ha acreditado su carnet de conducir vigente en la plataforma de carpooling antes de publicar un viaje. En ConcertRide todos los conductores pasan por este proceso. La verificación garantiza que el conductor tiene licencia válida y reduce el riesgo para los pasajeros. El carnet se valida mediante foto del documento oficial.",
  },
  {
    term: "Plaza",
    slug: "plaza",
    category: "carpooling",
    definition:
      "Cada uno de los asientos disponibles para pasajeros en un coche compartido. El conductor indica cuántas plazas ofrece al publicar el viaje (generalmente 1–4). Cuando todas las plazas están ocupadas, el viaje aparece como completo. En ConcertRide se puede reservar una o varias plazas para grupos de amigos.",
  },
  {
    term: "Asiento",
    slug: "asiento",
    category: "carpooling",
    definition:
      "Sinónimo de plaza en el contexto del carpooling. El precio del carpooling se expresa por asiento (por ejemplo, 9–13 €/asiento), siendo el coste proporcional que cada pasajero aporta al conductor para cubrir combustible y peajes del trayecto. El conductor fija el precio por asiento antes de publicar el viaje.",
  },
  {
    term: "Comisión de plataforma",
    slug: "comision-de-plataforma",
    category: "plataforma",
    definition:
      "Porcentaje que cobra una plataforma digital sobre el precio del viaje de carpooling como tarifa por el servicio. Las plataformas de carpooling generalistas cobran entre un 12 y un 18 % del precio del trayecto como comisión. ConcertRide cobra un 0 % de comisión: el importe íntegro va al conductor y el pago se hace en efectivo o Bizum el día del viaje.",
  },
  {
    term: "Punto de encuentro",
    slug: "punto-de-encuentro",
    category: "carpooling",
    definition:
      "Lugar acordado entre el conductor y los pasajeros para la recogida antes del viaje. Puede ser una estación de metro, un parking, una plaza conocida o una dirección concreta. El conductor propone el punto al publicar el viaje o lo acuerda por chat privado. En ConcertRide, el punto de encuentro se confirma el día anterior al viaje.",
  },
  {
    term: "Lanzadera",
    slug: "lanzadera",
    category: "carpooling",
    definition:
      "Autobús o minibús habilitado por el festival o por operadores privados para trasladar a los asistentes desde una ciudad o estación próxima hasta el recinto del festival. Las lanzaderas tienen horarios fijos y plazas limitadas. Festivales como BBK Live ofrecen lanzadera gratuita desde el centro de Bilbao; otros como el FIB la ofrecen desde Castellón de pago. Para quienes vienen de ciudades más lejanas, el carpooling con ConcertRide es la alternativa a combinar bus + lanzadera.",
  },
  {
    term: "Kilómetros compartidos",
    slug: "kilometros-compartidos",
    category: "carpooling",
    definition:
      "Métrica de sostenibilidad que mide los kilómetros que cada pasajero recorre en carpooling en lugar de hacerlo solo. Por ejemplo, si cuatro personas viajan juntas 400 km, los kilómetros compartidos son 400 × 3 = 1.200 km (los que cada uno de los 3 pasajeros habría recorrido en un coche propio). En ConcertRide se muestra el total acumulado de la plataforma como indicador de impacto ambiental.",
  },
  {
    term: "CO₂ ahorrado",
    slug: "co2-ahorrado",
    category: "carpooling",
    definition:
      "Reducción de emisiones de dióxido de carbono (CO₂) gracias al carpooling. Un coche mediano emite alrededor de 120 g de CO₂ por km. Si cuatro personas comparten el viaje en lugar de ir cada una en su propio coche, el ahorro es de 120 g × km × 3 coches no utilizados. El carpooling a un festival de música puede evitar entre 30 y 120 kg de CO₂ por grupo dependiendo de la distancia.",
  },
  {
    term: "Coste de combustible",
    slug: "coste-de-combustible",
    category: "carpooling",
    definition:
      "Importe del combustible consumido en el trayecto, calculado a partir del precio medio de gasolina o gasóleo y el consumo del vehículo (habitualmente 6–7 litros/100 km). El precio del asiento en ConcertRide cubre exclusivamente los gastos de combustible y peajes divididos entre los ocupantes, sin ningún margen de beneficio para el conductor.",
  },
  {
    term: "Tarifa MITECO",
    slug: "tarifa-miteco",
    category: "legal",
    definition:
      "Tarifa de referencia publicada anualmente por el Ministerio para la Transición Ecológica y el Reto Demográfico (MITECO) que establece el coste kilométrico estándar para el cálculo de gastos de combustible y peajes en desplazamientos. Los conductores de carpooling en ConcertRide la utilizan como referencia para fijar el precio del asiento de forma legal.",
  },
  {
    term: "Vuelta de madrugada",
    slug: "vuelta-de-madrugada",
    category: "carpooling",
    definition:
      "Viaje de regreso coordinado al terminar un concierto o festival, habitualmente entre las 2:00 y las 6:00 de la madrugada. Los festivales acaban cuando el transporte público ya no funciona. El carpooling con ConcertRide resuelve este problema: el conductor y los pasajeros acuerdan antes del viaje la hora de salida de vuelta, adaptándola a la hora real de finalización del último bolo.",
  },
  // ── Festival / música ────────────────────────────────────────────────────────
  {
    term: "Festival de música",
    slug: "festival-de-musica",
    category: "festival",
    definition:
      "Evento de varios días de duración en el que actúan múltiples artistas en uno o varios escenarios, habitualmente al aire libre. Los festivales de música en España congregan entre 10.000 y 80.000 asistentes al día. Los más conocidos son Mad Cool (Madrid), Primavera Sound (Barcelona), Arenal Sound (Burriana) y BBK Live (Bilbao). La logística de transporte es especialmente importante porque la mayoría se celebran en recintos alejados de los centros urbanos.",
  },
  {
    term: "Festival multitudinario",
    slug: "festival-multitudinario",
    category: "festival",
    definition:
      "Festival con una asistencia diaria superior a las 40.000 personas. En España, los festivales multitudinarios son Mad Cool (80.000/día), Medusa (60.000/día), Primavera Sound (60.000/día), Arenal Sound (50.000–60.000/día) y FIB (45.000/día). Estos eventos requieren una planificación especial del transporte de acceso y de vuelta.",
  },
  {
    term: "Recinto",
    slug: "recinto",
    category: "festival",
    definition:
      "Espacio físico donde se celebra el festival o el concierto. Puede ser un estadio, un parque, una feria de exposiciones, una playa, un monte o un espacio habilitado especialmente para el evento. En ConcertRide cada festival tiene su propio recinto documentado con dirección exacta, coordenadas GPS y opciones de acceso.",
  },
  {
    term: "Aforo",
    slug: "aforo",
    category: "festival",
    definition:
      "Número máximo de personas que pueden estar simultáneamente en el recinto de un festival o concierto. El aforo lo establece la licencia municipal del evento y puede variar de un día para otro. Cuando el festival alcanza el aforo, se cierra el acceso temporal. En ConcertRide se indica el aforo de los festivales principales para contexto.",
  },
  {
    term: "Line-up",
    slug: "line-up",
    category: "festival",
    definition:
      "Lista completa de artistas confirmados para actuar en un festival. El line-up se publica generalmente en fases: primero los cabezas de cartel (headliners), luego los artistas de segundo y tercer nivel. La publicación del line-up activa la compra anticipada de entradas y la organización de carpooling en ConcertRide, ya que los fans conocen con antelación a qué festival quieren ir.",
  },
  {
    term: "Cartel",
    slug: "cartel",
    category: "festival",
    definition:
      "Sinónimo de line-up en el contexto de los festivales españoles. Hace referencia al conjunto de artistas que actuarán en el festival. Se habla de 'cartel potente' cuando incluye artistas de primera línea internacional, y de 'cartel renovado' cuando el festival incorpora artistas nuevos o menos conocidos junto a los nombres habituales.",
  },
  {
    term: "Headliner",
    slug: "headliner",
    category: "festival",
    definition:
      "Artista principal de un festival, que actúa en el escenario más grande y en el horario de máxima audiencia (habitualmente entre las 22:00 y las 2:00). Los headliners son los artistas de mayor caché del cartel y los que más influyen en las ventas de entradas. Ejemplos recientes: Coldplay, Taylor Swift, Rosalía, The Weeknd. La actuación del headliner determina la hora de salida de vuelta en el carpooling.",
  },
  {
    term: "Afterparty",
    slug: "afterparty",
    category: "festival",
    definition:
      "Fiesta organizada después de un concierto o de la jornada de un festival, habitualmente en una discoteca, sala de música o espacio habilitado ad hoc. Las afterparties de los festivales grandes suelen terminar entre las 6:00 y las 8:00 de la mañana. En ConcertRide se pueden coordinar viajes de vuelta desde la afterparty, aunque los horarios extremos limitan las opciones de carpooling.",
  },
  {
    term: "Acampada",
    slug: "acampada",
    category: "festival",
    definition:
      "Zona habilitada dentro o próxima al recinto del festival para que los asistentes monten sus tiendas y pernocten durante todos los días del evento. Los festivales con acampada (Viña Rock, Medusa, Arenal Sound, FIB) permiten a los asistentes de otras ciudades alojarse sin coste de hotel. El carpooling con ConcertRide es especialmente útil para llegar con todo el equipo de camping directamente al recinto.",
  },
  {
    term: "Glamping",
    slug: "glamping",
    category: "festival",
    definition:
      "Modalidad de acampada de lujo en un festival, con tiendas pre-montadas, colchones, cargadores USB y a veces duchas privadas. Es una alternativa al camping tradicional para quienes quieren comodidad sin contratar hotel. Festivales como Starlite o Cala Mijas ofrecen paquetes de glamping. El transporte de ida suele incluirse en el pack o se combina con carpooling.",
  },
  {
    term: "Preventa",
    slug: "preventa",
    category: "festival",
    definition:
      "Venta anticipada de entradas para un festival o concierto antes de que comience la venta general. Las preventas suelen ofrecer precios inferiores a los de la venta normal y se agotan en pocas horas para los festivales más populares. Es habitual que los fans que compran en preventa también empiecen a buscar carpooling con ConcertRide en ese mismo momento para organizar el transporte.",
  },
  {
    term: "Reventa",
    slug: "reventa",
    category: "festival",
    definition:
      "Venta de entradas ya adquiridas a un precio superior al original, habitualmente cuando el evento está agotado. En España la reventa especulativa de entradas está regulada y en algunos casos prohibida. Plataformas como Ticketmaster ofrecen reventa oficial con precios controlados. ConcertRide gestiona el transporte, no las entradas: si compras en reventa, nosotros te llevamos.",
  },
  {
    term: "Wristband",
    slug: "wristband",
    category: "festival",
    definition:
      "Pulsera de control de acceso que se entrega a los asistentes al festival. Sustituye a la entrada de papel y permite entrar y salir del recinto durante todos los días del festival. Suele tener chip RFID que registra los accesos y en festivales cashless también actúa como método de pago. Se coloca en el primer acceso y no se puede retirar hasta el final del festival.",
  },
  {
    term: "Cashless",
    slug: "cashless",
    category: "festival",
    definition:
      "Sistema de pago sin efectivo en el interior del recinto de un festival. Los asistentes cargan dinero en el chip de la pulsera (wristband) y pagan barras y tiendas con solo acercar la muñeca al lector. El efectivo queda fuera del circuito interior del festival, aunque en ConcertRide el pago del asiento al conductor se realiza siempre en efectivo o Bizum el día del viaje.",
  },
  {
    term: "Booking",
    slug: "booking",
    category: "festival",
    definition:
      "Contratación de artistas para actuar en un festival. El proceso de booking lo llevan a cabo los promotores y managers de los festivales, que negocian con las agencias representantes de los artistas el caché (precio de actuación), el rider técnico (requisitos de sonido y escenario) y las fechas. El éxito del booking determina la calidad del line-up y, en parte, el volumen de asistentes.",
  },
  {
    term: "Promotora",
    slug: "promotora",
    category: "festival",
    definition:
      "Empresa que organiza conciertos y festivales: contrata artistas, gestiona el recinto, vende entradas y coordina todos los aspectos logísticos del evento. En España las principales promotoras son Live Nation, FIB Events, Primavera Sound Organization y Do LaB. Son las responsables de la habilitación de accesos y transporte público oficial al festival.",
  },
  {
    term: "Cacheado",
    slug: "cacheado",
    category: "festival",
    definition:
      "Término coloquial español para referirse al caché de un artista: el precio que cobra por actuar. Un artista 'muy cacheado' cobra mucho. En el contexto de los festivales, el caché de los headliners internacionales puede superar el millón de euros por actuación, lo que determina el precio de las entradas y el presupuesto general del festival.",
  },
  // ── Legal / plataforma ───────────────────────────────────────────────────────
  {
    term: "Cost-sharing",
    slug: "cost-sharing",
    category: "legal",
    definition:
      "Modelo legal de carpooling en el que el conductor comparte los gastos del viaje con los pasajeros sin obtener beneficio económico. El conductor cobra únicamente lo necesario para cubrir combustible, peajes y desgaste del vehículo (calculado a partir de la tarifa MITECO). Este modelo fue declarado legal en España por el Tribunal Supremo en 2017 y es el que aplica ConcertRide.",
  },
  {
    term: "Seguro de viaje compartido",
    slug: "seguro-de-viaje-compartido",
    category: "legal",
    definition:
      "Cobertura de seguro que aplica a los pasajeros de un viaje de carpooling. En España, el seguro obligatorio del vehículo cubre a todos los ocupantes en caso de accidente. Sin embargo, algunos servicios de carpooling ofrecen seguros adicionales para cubrir responsabilidad civil ampliada o gastos médicos. ConcertRide recomienda que los conductores tengan su seguro de automóvil al día con cobertura a terceros.",
  },
  {
    term: "Abono",
    slug: "abono",
    category: "festival",
    definition:
      "Entrada que da acceso a todos los días de un festival. También llamado 'pase multijornada' o 'full pass'. El abono suele ser más económico que comprar entradas diarias por separado. Para los asistentes que utilizan ConcertRide, el abono facilita organizar el transporte de varios días con el mismo conductor.",
  },
  {
    term: "Plataforma festival-specific",
    slug: "plataforma-festival-specific",
    category: "plataforma",
    definition:
      "Plataforma de carpooling especializada exclusivamente en conciertos y festivales, con búsqueda por festival, fecha y recinto. Al contrario que las plataformas generalistas (que incluyen rutas de largo recorrido sin vinculación a eventos), una plataforma festival-specific como ConcertRide adapta los horarios, los puntos de encuentro y la vuelta a los tiempos reales del concierto. Esto permite organizar la vuelta de madrugada de forma coordinada.",
  },
  {
    term: "Plataforma de carpooling generalista",
    slug: "plataforma-carpooling-generalista",
    category: "plataforma",
    definition:
      "Plataforma de carpooling que conecta conductores y pasajeros para cualquier tipo de trayecto, no solo festivales. Ofrecen rutas de larga distancia, pero no están optimizadas para el contexto festival (vuelta de madrugada, equipaje de camping, horarios variables). Cobran comisiones de entre el 12 y el 18 % sobre el precio del trayecto.",
  },
  {
    term: "DNI / Documento Nacional de Identidad",
    slug: "dni",
    category: "legal",
    definition:
      "Documento oficial de identificación personal en España. Se exige en la entrada de la mayoría de festivales para verificar que la entrada corresponde al titular o para el control de acceso en general. En ConcertRide, el DNI del conductor se verifica como parte del proceso de validación del carnet de conducir. Los pasajeros no necesitan compartir su DNI.",
  },
];

const CATEGORIES = [
  { id: "carpooling", label: "Carpooling y transporte" },
  { id: "festival", label: "Festivales y música" },
  { id: "legal", label: "Marco legal" },
  { id: "plataforma", label: "Plataformas" },
] as const;

const PAGE_TITLE = "Glosario de carpooling y festivales | ConcertRide";
const PAGE_DESC =
  "Definiciones de los términos clave del carpooling a festivales en España: conductor verificado, lanzadera, cashless, abono, headliner y más.";

export default function GlosarioPage() {
  useSeoMeta({
    title: PAGE_TITLE,
    description: PAGE_DESC,
    canonical: `${SITE_URL}/glosario`,
    keywords:
      "glosario carpooling, términos carpooling festival, qué es carpooling, qué es ride-sharing, lanzadera festival, cashless festival, conductor verificado, abono festival, carpooling España",
    ogImageAlt: "Glosario de carpooling y festivales de música · ConcertRide",
  });

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Glosario de carpooling y festivales de música | ConcertRide",
    description: PAGE_DESC,
    url: `${SITE_URL}/glosario`,
    numberOfItems: GLOSARIO.length,
    itemListElement: GLOSARIO.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "DefinedTerm",
        "@id": `${SITE_URL}/glosario#${entry.slug}`,
        name: entry.term,
        description: entry.definition,
        inDefinedTermSet: `${SITE_URL}/glosario`,
      },
    })),
  };

  const jsonLdDefinedTermSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${SITE_URL}/glosario`,
    name: "Glosario ConcertRide: carpooling y festivales",
    description: PAGE_DESC,
    url: `${SITE_URL}/glosario`,
    inLanguage: "es-ES",
    hasDefinedTerm: GLOSARIO.map((entry) => ({
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/glosario#${entry.slug}`,
      name: entry.term,
      description: entry.definition,
      termCode: entry.slug,
    })),
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Glosario", item: `${SITE_URL}/glosario` },
    ],
  };

  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/glosario#webpage`,
    url: `${SITE_URL}/glosario`,
    name: PAGE_TITLE,
    description: PAGE_DESC,
    inLanguage: "es-ES",
    dateModified: new Date().toISOString().slice(0, 10),
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable", "h3", "dd"],
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-ES",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué es el carpooling a festivales?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El carpooling a festivales es compartir coche con otros asistentes al mismo festival, dividiendo los gastos de combustible y peajes. El conductor lleva a uno o varios pasajeros y cobra solo lo que cuesta el viaje sin margen de beneficio. ConcertRide es la plataforma española especializada en este modelo, con 0% de comisión y conductores verificados.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuál es la diferencia entre carpooling y car-sharing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El carpooling (ride-sharing) implica que el conductor lleva a pasajeros en su propio coche y reparte los gastos del trayecto. El car-sharing es el alquiler de un coche sin conductor por horas o días, donde el usuario conduce él mismo un vehículo ajeno. En festivales se usa principalmente el carpooling.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué es una lanzadera de festival?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Una lanzadera de festival es un autobús habilitado por la organización del evento para trasladar a los asistentes desde una ciudad o estación próxima hasta el recinto. Tiene horarios fijos y plazas limitadas. Algunos festivales como BBK Live (Bilbao) ofrecen lanzadera gratuita incluida en la entrada; otros como el FIB la cobran por separado. ConcertRide es la alternativa cuando no hay lanzadera desde tu ciudad.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué significa cashless en un festival?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El cashless en un festival es un sistema de pago sin efectivo en el interior del recinto. Los asistentes cargan dinero en el chip de la pulsera de acceso (wristband) y pagan barras y tiendas acercando la muñeca al lector. El efectivo queda fuera del festival, aunque el pago del carpooling con ConcertRide se hace siempre en efectivo o Bizum directamente al conductor el día del viaje.",
        },
      },
      {
        "@type": "Question",
        name: "¿Es legal el carpooling en España?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. El carpooling en régimen de cost-sharing (compartir gastos sin lucro para el conductor) es legal en España desde la sentencia del Tribunal Supremo de 2017. El conductor solo puede cobrar lo necesario para cubrir combustible y peajes del viaje, calculado según la tarifa MITECO. ConcertRide opera exclusivamente bajo este modelo: 0% de comisión y pago directo al conductor.",
        },
      },
    ],
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDefinedTermSet) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-8 space-y-4">
        <nav
          aria-label="Breadcrumb"
          className="font-mono text-[11px] text-cr-text-dim flex items-center gap-2"
        >
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">Glosario</span>
        </nav>

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92] speakable">
          Glosario de carpooling y festivales.
        </h1>

        <p className="speakable font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed">
          Definiciones de los {GLOSARIO.length} términos más usados cuando organizas el transporte a un festival de música en España.
          Desde qué es el carpooling hasta el significado de cashless, headliner, lanzadera o conductor verificado.
        </p>

        {/* Category index */}
        <div className="flex flex-wrap gap-2 pt-2">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em] border border-cr-border px-3 py-1.5 text-cr-text-muted hover:border-cr-primary hover:text-cr-primary transition-colors"
            >
              {cat.label}
            </a>
          ))}
        </div>
      </div>

      {/* Glossary by category */}
      {CATEGORIES.map((cat) => {
        const entries = GLOSARIO.filter((e) => e.category === cat.id);
        if (entries.length === 0) return null;
        return (
          <section
            key={cat.id}
            id={cat.id}
            className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6"
          >
            <h2 className="font-display text-2xl md:text-3xl uppercase">
              {cat.label}
            </h2>
            <dl className="space-y-0 divide-y divide-cr-border">
              {entries.map((entry) => (
                <div key={entry.slug} id={entry.slug} className="py-6 space-y-2 scroll-mt-20">
                  <dt className="font-display text-lg md:text-xl uppercase text-cr-text">
                    {entry.term}
                  </dt>
                  <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
                    {entry.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}

      {/* FAQ section */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Preguntas frecuentes sobre el glosario de carpooling
        </h2>
        <dl className="space-y-6">
          {[
            {
              q: "¿Qué es el carpooling a festivales?",
              a: "El carpooling a festivales es compartir coche con otros asistentes al mismo festival, dividiendo los gastos de combustible y peajes. El conductor lleva a uno o varios pasajeros y cobra solo lo que cuesta el viaje sin margen de beneficio. ConcertRide es la plataforma española especializada en este modelo, con 0% de comisión y conductores verificados.",
            },
            {
              q: "¿Cuál es la diferencia entre carpooling y car-sharing?",
              a: "El carpooling implica que el conductor lleva a pasajeros en su propio coche y reparte los gastos del trayecto. El car-sharing es el alquiler de un coche sin conductor por horas o días. En festivales se usa principalmente el carpooling, ya que el destino es específico y el grupo va junto.",
            },
            {
              q: "¿Qué es una lanzadera de festival?",
              a: "Una lanzadera de festival es un autobús habilitado por la organización del evento para trasladar a los asistentes desde una ciudad o estación próxima hasta el recinto. Tiene horarios fijos y plazas limitadas. ConcertRide es la alternativa cuando no hay lanzadera desde tu ciudad de origen.",
            },
            {
              q: "¿Qué significa cashless en un festival?",
              a: "El cashless en un festival es un sistema de pago sin efectivo en el interior del recinto. Los asistentes cargan dinero en el chip de su pulsera de acceso y pagan barras y tiendas acercando la muñeca al lector. El pago del carpooling con ConcertRide se hace siempre en efectivo o Bizum directamente al conductor.",
            },
            {
              q: "¿Es legal el carpooling en España?",
              a: "Sí. El carpooling en régimen de cost-sharing (compartir gastos sin lucro para el conductor) es legal en España desde la sentencia del Tribunal Supremo de 2017. El conductor solo puede cobrar lo necesario para cubrir combustible y peajes, calculado según la tarifa MITECO. ConcertRide opera bajo este modelo: 0% de comisión.",
            },
          ].map((faq) => (
            <div key={faq.q} className="border-b border-cr-border pb-6 space-y-2">
              <dt className="font-display text-base uppercase text-cr-text">{faq.q}</dt>
              <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-4">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          ¿Ya tienes clara la teoría? Organiza tu viaje.
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed">
          Encuentra un carpooling a tu próximo festival: 0% comisión, conductores verificados,
          vuelta de madrugada coordinada.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/concerts"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-6 py-3 hover:bg-cr-primary/90 transition-colors"
          >
            Buscar viaje <ArrowRight size={14} />
          </Link>
          <Link
            to="/como-funciona"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text-muted px-6 py-3 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            Cómo funciona
          </Link>
        </div>
      </section>

      {/* Internal links */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-10 space-y-4">
        <h2 className="font-display text-lg uppercase text-cr-text-muted">
          Más recursos de ConcertRide
        </h2>
        <ul className="flex flex-wrap gap-2">
          {[
            { to: "/festivales", label: "Festivales" },
            { to: "/como-funciona-carpooling", label: "Cómo funciona el carpooling" },
            { to: "/faq", label: "Preguntas frecuentes" },
            { to: "/datos", label: "Datos y estadísticas" },
            { to: "/blog", label: "Blog" },
            { to: "/aviso-legal", label: "Aviso legal" },
          ].map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

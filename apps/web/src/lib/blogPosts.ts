// Blog posts — single source of truth for the editorial content engine.
// New posts are added by appending to BLOG_POSTS. The prerender script
// reads BLOG_SLUGS from the SSR bundle so /blog/<slug> URLs are statically
// generated at build time and indexable by Google with full HTML.
//
// Each post is hand-written Spanish prose targeting a specific search-intent
// gap identified in the SEO audit. Body is structured Markdown-ish JSX
// (rendered by BlogPostPage), not raw markdown — keeps the bundle simple
// without an extra MDX/markdown pipeline.

export interface BlogSection {
  /** H2 heading */
  heading: string;
  /** Paragraphs in this section. Plain prose. */
  paragraphs: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
  /** Optional Q&A items rendered as <dl> + emitted as FAQPage JSON-LD if at the end of the post. */
  faqs?: { q: string; a: string }[];
}

export interface BlogPost {
  slug: string;
  title: string;
  /** Short H1 — used on the post page hero (the SEO title is `title`). */
  h1: string;
  /** Meta description — also lead paragraph. */
  excerpt: string;
  category: "comparativas" | "guias" | "sostenibilidad" | "novedades";
  tags: string[];
  publishedAt: string; // ISO date
  updatedAt?: string;
  author: string;
  /** ~ minutes to read (calculated rough estimate). */
  readingMinutes: number;
  /** Hero subtitle, 1–2 sentences. */
  lede: string;
  sections: BlogSection[];
  /** FAQs — extracted into FAQPage JSON-LD. */
  faqs?: { q: string; a: string }[];
  /** Internal links emitted at the end of the post for link-juice distribution. */
  relatedLinks?: { label: string; to: string }[];
  /** Slug of related posts shown at the bottom. */
  relatedPosts?: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "blablacar-vs-concertride",
    title: "BlaBlaCar vs ConcertRide 2026: ¿qué app de carpooling te conviene para festivales?",
    h1: "BlaBlaCar vs ConcertRide: comparativa para ir a conciertos en España",
    excerpt:
      "Comparativa real entre BlaBlaCar y ConcertRide para llegar a festivales: comisiones, tiempos de espera, perfil de usuario, política de cancelación y precio por asiento. Te decimos cuándo te conviene cada una.",
    category: "comparativas",
    tags: ["BlaBlaCar", "carpooling", "festivales", "comparativa"],
    publishedAt: "2026-04-25T09:00:00.000Z",
    author: "Equipo ConcertRide",
    readingMinutes: 7,
    lede:
      "Si vas a un festival este verano y dudas entre BlaBlaCar y ConcertRide, esta comparativa va al grano. Sin clickbait y sin pelotas: cada plataforma encaja en un escenario distinto.",
    sections: [
      {
        heading: "Comisiones: la diferencia más visible",
        paragraphs: [
          "BlaBlaCar cobra comisión de servicio al pasajero (entre el 15 % y el 25 % según la ruta). En un viaje Madrid → Mad Cool de 18 €, el pasajero paga unos 22 € reales y el conductor recibe los 18 € íntegros del precio publicado.",
          "ConcertRide no cobra comisión. El precio que ves es el precio que pagas, en efectivo o Bizum, directamente al conductor el día del viaje. El 100 % va al conductor.",
        ],
      },
      {
        heading: "Perfil de usuario: rutas largas vs eventos concretos",
        paragraphs: [
          "BlaBlaCar es generalista: cubre cualquier ruta entre dos ciudades, con miles de viajes diarios. Es la herramienta lógica si vives en una ruta troncal (Madrid–Barcelona, Valencia–Madrid) y necesitas movilidad cualquier día.",
          "ConcertRide está especializado en eventos. Cada viaje está vinculado a un concierto o festival concreto, así que sabes que tu compañero de coche también va al show. Mejor para llegar la noche del evento, peor para una mudanza de un domingo cualquiera.",
        ],
      },
      {
        heading: "Vuelta de madrugada: aquí gana ConcertRide",
        paragraphs: [
          "El gran problema del transporte público a festivales es la vuelta. El último metro de Madrid sale a las 1:30 y un Mad Cool acaba a las 2:30 — es físicamente imposible volver sin coche o taxi (y los taxis cuestan 30–90 € a esas horas).",
          "BlaBlaCar tiene pocos viajes de vuelta a esas horas porque sus conductores no están casados con el evento. ConcertRide sí: los conductores publican explícitamente el viaje de vuelta tras el festival, y el match es alto.",
        ],
      },
      {
        heading: "Cancelaciones y reembolsos",
        paragraphs: [
          "BlaBlaCar tiene políticas de reembolso estrictas con escalas de tiempo. Funciona bien porque el pago es en plataforma.",
          "En ConcertRide el pago es en persona, así que las cancelaciones se gestionan por chat directo. Ventaja: cero fricción si te cae un imprevisto. Desventaja: depende del entendimiento entre conductor y pasajero (recomendamos avisar con 24 h de antelación).",
        ],
      },
      {
        heading: "Tabla resumen",
        paragraphs: [
          "Aquí tienes los criterios condensados para que decidas en 30 segundos.",
        ],
        bullets: [
          "Comisión: BlaBlaCar 15–25 % · ConcertRide 0 %",
          "Vuelta de madrugada: BlaBlaCar limitada · ConcertRide alta disponibilidad para festivales",
          "Verificación: ambas verifican identidad y carnet",
          "Pago: BlaBlaCar en plataforma · ConcertRide en efectivo/Bizum al conductor",
          "Cobertura: BlaBlaCar global · ConcertRide solo España, solo eventos",
          "Reservar instantánea: ambas (cuando el conductor lo activa)",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Es legal el carpooling sin licencia VTC?",
        a: "Sí. Tanto BlaBlaCar como ConcertRide operan bajo la figura de gastos compartidos: el conductor no obtiene beneficio, solo cubre combustible y peajes. La sentencia del Tribunal Supremo (caso BlaBlaCar 2017) lo dejó claro: no es transporte profesional, no requiere licencia VTC ni de taxi.",
      },
      {
        q: "¿Cuál es más barato a un festival concreto?",
        a: "Para Mad Cool, Primavera Sound, Sónar y la mayoría de festivales españoles, ConcertRide sale 15–25 % más barato porque no cobra comisión. La diferencia se nota más en distancias largas (Madrid → Barcelona, por ejemplo).",
      },
      {
        q: "¿Puedo usar las dos a la vez?",
        a: "Claro. Mucha gente busca primero en ConcertRide (porque le interesa que el otro vaya al mismo festival) y, si no encuentra, busca en BlaBlaCar como alternativa.",
      },
    ],
    relatedLinks: [
      { label: "Cómo volver de un festival de madrugada", to: "/blog/como-volver-festival-madrugada" },
      { label: "Guía de transporte para festivales en España", to: "/guia-transporte-festivales" },
      { label: "Carpooling a Mad Cool 2026", to: "/festivales/mad-cool" },
      { label: "Carpooling a Primavera Sound 2026", to: "/festivales/primavera-sound" },
    ],
    relatedPosts: ["como-volver-festival-madrugada", "huella-carbono-festivales-carpooling"],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "como-volver-festival-madrugada",
    title: "Cómo volver de un festival de madrugada (sin taxi a 90 €)",
    h1: "Cómo volver de un festival de madrugada en España",
    excerpt:
      "El último metro sale a las 1:30 y el festival acaba a las 2:30. Aquí tienes las opciones reales para volver: carpooling, lanzaderas oficiales, autobús nocturno o taxi compartido. Precios, ventajas y trampas.",
    category: "guias",
    tags: ["transporte", "festivales", "vuelta", "madrugada"],
    publishedAt: "2026-04-25T09:30:00.000Z",
    author: "Equipo ConcertRide",
    readingMinutes: 6,
    lede:
      "El 80 % de los problemas de un festival no son la cola de los baños — son volver a casa. Si te has visto a las 3 am con el móvil al 5 % buscando un taxi, esta guía es para ti.",
    sections: [
      {
        heading: "Las 4 opciones reales (y cuándo usar cada una)",
        paragraphs: [
          "Para la mayoría de festivales españoles, las opciones realistas para volver entre la 1 y las 5 am son: carpooling, lanzadera oficial del festival, autobús urbano nocturno (\"búho\") y taxi/VTC. El tren rara vez funciona a esas horas.",
        ],
        bullets: [
          "Carpooling: 5–25 €. Sin esperas si reservas antes. Sale del recinto.",
          "Lanzadera oficial: 5–15 €. Sale solo de un par de hubs urbanos. Puede tener 30–60 min de cola.",
          "Búho urbano: 1,50–3 €. Solo dentro del área metropolitana del recinto. No conecta con otras ciudades.",
          "Taxi/VTC: 30–90 € en madrugada (festival = tarifa nocturna + recargo de evento). Casi imposible encontrar uno entre las 2 y las 4 am.",
        ],
      },
      {
        heading: "Por qué el carpooling es la opción más estable",
        paragraphs: [
          "El carpooling tiene una ventaja invisible: la plaza está reservada antes del festival. No dependes de que aparezca un taxi ni de hacer cola con otros 200 sudados a las 3 am.",
          "El conductor también va al festival, así que el horario de salida está alineado con el final real del show — no con un horario teórico de bus que sale a las 23:30 y te obliga a perderte el cabeza de cartel.",
          "En ConcertRide la mayoría de viajes incluyen vuelta. Cuando publicas el viaje de ida, el conductor suele añadir el de regreso al recinto (con punto de encuentro fijo y hora aproximada).",
        ],
      },
      {
        heading: "Trampas a evitar",
        paragraphs: [
          "No te fíes del “Uber/Cabify llega en 5 min” a las 2:30 am en un festival: la app puede mostrarte un coche, pero la cola virtual oculta tiempos reales de 45–90 min en eventos masivos. La oferta cae a cero.",
          "Cuidado también con el “taxi pirata” en la salida del recinto: ofrecen tarifas planas a 100 € y muchas veces no son legales. Si vas a coger taxi, hazlo desde una parada oficial dentro del recinto o llamando a la central.",
        ],
      },
      {
        heading: "Checklist antes del festival",
        paragraphs: [
          "Si todavía no has resuelto la vuelta y faltan menos de 48 h, sigue estos pasos:",
        ],
        bullets: [
          "1. Busca tu festival en concertride.me y filtra por “con regreso incluido”.",
          "2. Si no encuentras, mira BlaBlaCar (rutas troncales con horario nocturno).",
          "3. Si tampoco, reserva la lanzadera oficial del festival (siempre cobran solo a la salida).",
          "4. Como último recurso, comparte taxi entre 4: divide el coste, evita el caos.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Hay metro o tren la noche de un festival grande?",
        a: "Casi nunca. Mad Cool, Primavera Sound, Sónar y BBK Live acaban después de la última conexión de transporte público. La excepción es Sónar de Día, que sí cierra dentro del horario del metro de Barcelona.",
      },
      {
        q: "¿Cuánto cuesta un taxi del festival a Madrid centro de madrugada?",
        a: "Entre 30 € (Mad Cool → Sol) y 90 € (Mad Cool → Tres Cantos), con tarifa nocturna y recargo de evento. Si lo compartes con 3 más, el coste por persona se acerca al de un carpooling.",
      },
      {
        q: "¿Qué pasa si el conductor del carpooling se va antes de que termine el show?",
        a: "El acuerdo es claro antes de viajar: el conductor publica una hora estimada de salida (suele ser entre 30 min y 1 h después de que acabe el cabeza de cartel). Si necesitas quedarte hasta el último DJ, busca un viaje con horario más tardío.",
      },
    ],
    relatedLinks: [
      { label: "Guía de transporte para festivales en España", to: "/guia-transporte-festivales" },
      { label: "BlaBlaCar vs ConcertRide", to: "/blog/blablacar-vs-concertride" },
      { label: "Carpooling a Mad Cool", to: "/festivales/mad-cool" },
    ],
    relatedPosts: ["blablacar-vs-concertride", "huella-carbono-festivales-carpooling"],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "huella-carbono-festivales-carpooling",
    title: "Huella de carbono de un festival: por qué el carpooling es la acción más efectiva",
    h1: "Huella de carbono y festivales: lo que el carpooling cambia de verdad",
    excerpt:
      "El 80 % de las emisiones de un festival vienen del transporte de los asistentes. Compartir coche reduce esas emisiones hasta un 75 % por persona. Datos, fuentes y cálculo paso a paso.",
    category: "sostenibilidad",
    tags: ["sostenibilidad", "huella de carbono", "festivales", "carpooling"],
    publishedAt: "2026-04-25T10:00:00.000Z",
    author: "Equipo ConcertRide",
    readingMinutes: 8,
    lede:
      "Si te preocupa el impacto ambiental de ir a un festival, hay una decisión que pesa más que reciclar el vaso de plástico o llevar fiambrera. La forma de llegar al recinto es el factor número uno.",
    sections: [
      {
        heading: "El reparto real de las emisiones de un festival",
        paragraphs: [
          "Según Julie's Bicycle (referencia del sector en eventos sostenibles), entre el 70 % y el 85 % de la huella de carbono de un festival proviene del transporte de los asistentes. La energía del recinto, la comida y los residuos suman el resto.",
          "Esto significa que las medidas sostenibles más visibles (bombillas LED, vasos retornables, papeleras de reciclaje) tienen un impacto marginal comparado con cómo llegan los 50.000 asistentes al recinto.",
        ],
      },
      {
        heading: "Cuánto reduce el carpooling: el cálculo",
        paragraphs: [
          "Un coche compartido entre 4 personas reduce las emisiones por pasajero en un 75 % comparado con 4 coches con un solo ocupante. Es matemática simple: el combustible se reparte.",
          "Un Madrid → Mad Cool (75 km ida y vuelta) emite unos 12 kg de CO₂ con un coche medio. En solitario, son 12 kg por persona; compartido entre 4, son 3 kg por persona.",
          "Para un festival de 50.000 personas con un 30 % de asistentes en coche solo, mover ese tercio a carpooling de 4 ahorraría unas 110 toneladas de CO₂ por evento. El equivalente a 50 vuelos Madrid–Barcelona.",
        ],
      },
      {
        heading: "Por qué el coche compartido le gana al transporte público en festivales",
        paragraphs: [
          "El transporte público parece la opción ecológica obvia, pero en festivales suele perder la pelea por dos razones:",
        ],
        bullets: [
          "Cobertura: la mayoría de recintos están fuera de la red de cercanías o metro. Un autobús lanzadera puntual emite menos por persona que un coche compartido, pero solo si va lleno.",
          "Hora de vuelta: el último cercanías sale antes de que acabe el festival. Si te obliga a coger taxi para volver, las emisiones se disparan: un taxi vacío de vuelta dobla el impacto.",
        ],
      },
      {
        heading: "Cómo medirlo: la calculadora MITECO",
        paragraphs: [
          "Si quieres calcular tu huella exacta, el Ministerio para la Transición Ecológica (MITECO) publica un factor oficial de emisión por km y tipo de vehículo. Para un coche diésel medio: 158 g CO₂/km. Para gasolina: 145 g/km.",
          "Con esos datos, una calculadora rápida es: (km del viaje × factor) ÷ ocupantes. Es el mismo cálculo que usamos en ConcertRide para mostrar el ahorro al pasajero al confirmar la reserva.",
        ],
      },
      {
        heading: "Más allá del CO₂: el ruido y el tráfico local",
        paragraphs: [
          "Reducir coches en el acceso al festival también beneficia a los vecinos del recinto. Mad Cool en Villaverde, Primavera Sound en Parc del Fòrum y Sónar en Fira son zonas residenciales: cada coche menos en las salidas reduce ruido nocturno y atascos.",
          "Algunos festivales han empezado a premiar a los grupos que llegan en coche compartido (descuentos en consumiciones, entrada anticipada al recinto). Pregunta al festival si lo ofrecen.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Coche eléctrico o coche compartido: qué emite menos?",
        a: "Para una distancia típica de festival (50–200 km), un coche compartido de 4 personas con un coche de combustión medio emite menos por persona que un eléctrico con un solo ocupante. La ocupación pesa más que el tipo de motor.",
      },
      {
        q: "¿El tren no es lo más sostenible?",
        a: "Sí, cuando existe y llega al recinto. El problema es la última milla y el horario nocturno. Si el tren llega al recinto y tienes vuelta antes de que acabe el festival, gana al carpooling. Si no, el coche compartido suele ser mejor que el tren + taxi.",
      },
      {
        q: "¿Hay alguna fuente oficial de estos datos?",
        a: "Sí. Julie's Bicycle (juliesbicycle.com) publica guías específicas para festivales. La Asociación de Promotores Musicales (APM) y MITECO publican datos para España. El factor oficial de emisión por km de coche está en la Guía MITECO de huella de carbono.",
      },
    ],
    relatedLinks: [
      { label: "BlaBlaCar vs ConcertRide", to: "/blog/blablacar-vs-concertride" },
      { label: "Cómo volver de un festival de madrugada", to: "/blog/como-volver-festival-madrugada" },
      { label: "Guía de transporte para festivales", to: "/guia-transporte-festivales" },
    ],
    relatedPosts: ["blablacar-vs-concertride", "como-volver-festival-madrugada"],
  },
];

export const BLOG_POSTS_BY_SLUG: Record<string, BlogPost> = Object.fromEntries(
  BLOG_POSTS.map((p) => [p.slug, p]),
);

export const BLOG_SLUGS = BLOG_POSTS.map((p) => p.slug);

export const BLOG_CATEGORIES: Array<{ slug: BlogPost["category"]; label: string }> = [
  { slug: "comparativas", label: "Comparativas" },
  { slug: "guias", label: "Guías" },
  { slug: "sostenibilidad", label: "Sostenibilidad" },
  { slug: "novedades", label: "Novedades" },
];

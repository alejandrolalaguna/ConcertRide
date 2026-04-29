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
    slug: "autobuses-festivales-espana-2026",
    title: "Autobuses a festivales de España 2026: guía completa por festival",
    h1: "Autobuses a festivales de España 2026: cómo llegar a Viña Rock, Arenal Sound, BBK Live, Mad Cool y más",
    excerpt:
      "¿Hay autobús a Viña Rock? ¿Bus oficial a Arenal Sound? ¿Lanzadera a BBK Live? Esta guía recoge, festival por festival, las opciones reales de bus, autobús, tren y coche compartido para 2026 — con horarios, precios, salidas y trampas a evitar.",
    category: "guias",
    tags: ["autobuses", "buses", "transporte", "festivales", "carpooling", "lanzadera"],
    publishedAt: "2026-04-29T09:00:00.000Z",
    author: "Equipo ConcertRide",
    readingMinutes: 9,
    lede:
      "Buscas \"autobuses Viñarock\", \"bus Arenal Sound\", \"lanzadera BBK Live\" o \"viajes Resurrection Fest\" y nadie te da una respuesta clara. Aquí tienes la guía honesta — qué bus existe, qué bus es oficial, cuál es lanzadera, cuál es privado y dónde queda el carpooling.",
    sections: [
      {
        heading: "Tres tipos de autobús a un festival (no son lo mismo)",
        paragraphs: [
          "Antes de buscar tu festival es importante distinguir las tres categorías de bus que aparecen mezcladas en redes sociales y resultados de búsqueda:",
        ],
        bullets: [
          "Bus / autobús oficial del festival: organizado por la promotora, suele salir desde la estación de autobuses de la ciudad cabecera (Albacete, Castellón, Bilbao centro). Plazas limitadas, horario fijo, no opera de madrugada normalmente.",
          "Autobús de larga distancia (ALSA, Avanza, FlixBus): líneas regulares de transporte público interurbano. Llegan a la ciudad más cercana al recinto, no al festival. Hay que sumar lanzadera o taxi adicional.",
          "Autobús privado (operador no oficial): ofrecido por agencias o promotoras alternativas, salidas desde Madrid Méndez Álvaro, Nuevos Ministerios, Barcelona Sants. Plaza con vuelta a hora fija (suele ser las 6:00 del último día). Precio 35–55 €.",
        ],
      },
      {
        heading: "Viña Rock 2026 (Villarrobledo, Albacete) — autobuses y bus",
        paragraphs: [
          "Viña Rock 2026 (30 abril–3 mayo) en La Pulgosa, Villarrobledo, no tiene autobús directo desde Madrid: las consultas \"autobuses Viña Rock\", \"bus Viñarock\" o \"viajes Viña Rock\" se resuelven con cuatro caminos reales.",
        ],
        bullets: [
          "Bus lanzadera oficial Albacete–Villarrobledo (50 km, 40 min): sale de la estación de autobuses de Albacete cada 1–2 horas los días de festival, hasta aproximadamente la 1:00. Plaza no garantizada las horas punta.",
          "Autobús privado Madrid–Viña Rock: operadores no oficiales, 35–55 €, salidas desde Méndez Álvaro y Nuevos Ministerios, vuelta a hora fija sin flexibilidad.",
          "Tren AVE Madrid/Valencia–Albacete (15–45 €) + bus lanzadera del festival: 1h 30 min en tren, 40 min en bus. Funciona bien para la ida, no para la vuelta de madrugada.",
          "Coche compartido por ConcertRide desde Madrid (6–9 €), Valencia (6–9 €), Albacete (3–5 €), Alicante (5–8 €) o Cuenca (4–6 €): llegada directa a La Pulgosa y vuelta cuando termine el cabeza de cartel.",
        ],
      },
      {
        heading: "Arenal Sound 2026 (Burriana, Castellón) — bus, tren y autobús",
        paragraphs: [
          "Arenal Sound 2026 (29 julio–2 agosto) se celebra en la playa de Burriana. El recinto está a 2 km del centro de Burriana, 10 km de Castellón ciudad y 65 km de Valencia. La búsqueda \"como ir al Arenal Sound\" recibe estas opciones:",
        ],
        bullets: [
          "Bus lanzadera Castellón–Burriana del festival (10 km, 20 min): sale de la estación de autobuses de Castellón en franjas de entrada y salida. Plazas limitadas.",
          "Tren Cercanías Renfe C6 Valencia–Castellón de la Plana (45–60 min, 4–8 €): no llega a la playa, requiere taxi (10–15 €) o lanzadera adicional. Sin servicio nocturno desde Castellón después de las 23:00 — la vuelta de madrugada es imposible.",
          "Autobuses de larga distancia Madrid–Castellón / Barcelona–Castellón (ALSA): 15–25 €, llegan a Castellón ciudad, no al festival.",
          "Coche compartido por ConcertRide desde Burriana (2–4 €), Castellón (3–5 €), Valencia (3–6 €), Barcelona (8–12 €), Madrid (12–17 €) o Alicante (4–7 €): llegada directa al recinto con todo el equipo de camping.",
        ],
      },
      {
        heading: "BBK Live 2026 (Kobetamendi, Bilbao) — lanzadera y bus de larga distancia",
        paragraphs: [
          "Bilbao BBK Live 2026 (9–11 julio) es uno de los pocos festivales con buen servicio de bus dentro de Bilbao gracias a su lanzadera oficial:",
        ],
        bullets: [
          "Lanzadera oficial BBK Live: sale desde plaza Moyúa y la estación de Abando con frecuencia de 15 minutos. Precio incluido en la entrada. Sube hasta el monte Kobetamendi.",
          "Autobús ALSA Madrid–Bilbao Termibús (20–35 €, 5–6h): llega a 5 km del festival, hay que sumar shuttle u taxi.",
          "Tren Renfe Santander–Bilbao (8–15 €, 2h): último servicio antes de las 22:00, no sirve para volver del festival. Viaje BBK Santander solo viable en coche o carpooling.",
          "Coche compartido (carpooling) por ConcertRide desde Donostia (4–7 €), Vitoria (3–6 €), Pamplona (5–8 €), Santander (4–7 €), Burgos (5–8 €) o Madrid (11–16 €): llegada al centro de Bilbao, donde se enlaza con la lanzadera oficial.",
        ],
      },
      {
        heading: "Mad Cool 2026 (IFEMA, Madrid) — metro y carpooling",
        paragraphs: [
          "Mad Cool no opera buses oficiales propios. La opción de transporte público directo es la línea 8 del Metro de Madrid (estación Feria de Madrid), que amplía servicio hasta las 2:00–2:30 en noches de festival. Los autobuses nocturnos N1 y N6 cubren la Avenida de América y Canillejas pero no paran en IFEMA. Los lanzaderas privadas que aparecen en redes sociales son iniciativas no oficiales. El carpooling con ConcertRide desde Toledo (4–7 €), Guadalajara (3–6 €), Segovia (4–7 €), Valencia (10–14 €), Zaragoza (9–13 €) o Barcelona (15–20 €) es la opción más utilizada por asistentes de fuera de Madrid.",
        ],
      },
      {
        heading: "Resurrection Fest 2026 (Viveiro, Lugo) — el caso extremo",
        paragraphs: [
          "Resurrection Fest 2026 (25–28 junio) es probablemente el festival español más dependiente del coche compartido. Viveiro es una pequeña ciudad de la costa lucense sin AVE, sin aeropuerto cercano (lo más próximo: Santiago a 2h 30 min) y con apenas 2–3 frecuencias diarias de bus ALSA desde A Coruña, Lugo y Oviedo. No hay servicio nocturno. La búsqueda \"viajes Resurrection Fest\" lleva sí o sí al carpooling: los grupos de fans del metal organizan viajes desde A Coruña (4–7 €), Vigo (6–9 €), Santiago (6–9 €), Oviedo (6–9 €), Bilbao (10–15 €) y Madrid (16–22 €) ya como tradición del festival.",
        ],
      },
      {
        heading: "Otros festivales con buses y lanzaderas relevantes 2026",
        paragraphs: [
          "Resumen rápido de los principales festivales españoles y su servicio de bus oficial:",
        ],
        bullets: [
          "Sonorama Ribera (Aranda de Duero): bus Madrid–Aranda La Sepulvedana (10–15 €), no opera de madrugada. Sin shuttle oficial.",
          "O Son do Camiño (Santiago): lanzadera oficial desde el centro de Santiago hasta Monte do Gozo. 5 km.",
          "Cala Mijas Fest (Málaga): sin shuttle oficial. Taxi 25–40 € desde Málaga centro al Cortijo de Torres.",
          "Medusa Festival (Cullera): lanzadera del festival desde estación Joaquín Sorolla Valencia y Xàtiva. Plazas limitadas.",
          "Low Festival (Benidorm): TRAM L1 Alicante–Benidorm (1h 20 min) hasta medianoche. Sin shuttle oficial.",
          "FIB (Benicàssim): tren Cercanías Renfe Castellón–Benicàssim (5 min) y lanzadera al recinto.",
          "Sónar (Barcelona): metro L1 Espanya y autobús urbano. Servicio amplio en Sónar de Día.",
          "Cruïlla (Barcelona): metro L4 El Maresme-Fòrum a 5 min del recinto. Buen transporte público nocturno.",
          "Primavera Sound (Barcelona): metro L4 Besòs Mar al Parc del Fòrum. Saturación habitual de madrugada.",
          "Zevra Festival (Valencia): metro L4 La Marina (servicio ampliado hasta 1:00–2:00) y EMT 19/95.",
        ],
      },
      {
        heading: "Cuándo elegir bus, cuándo elegir coche compartido",
        paragraphs: [
          "El bus oficial gana al carpooling en tres casos: 1) cuando la lanzadera es gratuita o barata y sale hasta tarde (BBK Live, Cruïlla); 2) cuando el recinto está dentro del área metropolitana con metro nocturno (Sónar, Zevra, Mad Cool con limitaciones); 3) cuando la salida del festival es temprana (festivales de día, conciertos en estadio).",
          "El coche compartido gana al bus en tres casos opuestos: 1) cuando el recinto está fuera de la red de transporte público (Viña Rock, Resurrection Fest, Sonorama, Cala Mijas); 2) cuando la vuelta es después de medianoche (que es la mayoría); 3) cuando vienes de otra provincia y el tren + lanzadera + taxi suma más de 20 € por trayecto.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Hay autobús oficial a Viña Rock desde Madrid?",
        a: "No existe un bus oficial directo del festival Madrid–Viña Rock. Hay autobuses privados (operadores no oficiales) que salen de Méndez Álvaro y Nuevos Ministerios por 35–55 € con vuelta a hora fija. La alternativa más flexible y económica es el carpooling con ConcertRide (6–9 €/asiento). Detalles completos en concertride.me/festivales/vina-rock.",
      },
      {
        q: "¿Hay tren al recinto del Arenal Sound?",
        a: "No. El tren Cercanías C6 Valencia–Castellón llega a la estación de Castellón de la Plana, a 10 km del recinto. Hay que añadir bus lanzadera o taxi adicional. Sin servicio nocturno: la vuelta de madrugada en tren es imposible. Detalles en concertride.me/festivales/arenal-sound.",
      },
      {
        q: "¿Cuánto cuesta la lanzadera oficial del BBK Live?",
        a: "La lanzadera oficial del BBK Live (Bilbao centro → Kobetamendi) está incluida en el precio de la entrada al festival, sin coste adicional. Sale desde plaza Moyúa y la estación de Abando con frecuencia de 15 minutos durante toda la jornada del festival.",
      },
      {
        q: "¿Hay bus desde Santander a BBK Live?",
        a: "El bus ALSA Santander–Bilbao Termibús (1h 30 min, 6–15 €) opera varias veces al día pero no en horarios nocturnos. Para volver del festival a Santander de madrugada hay que ir en coche compartido o particular. Más detalles en concertride.me/rutas/santander-bbk-live.",
      },
      {
        q: "¿Es seguro el carpooling para ir a un festival?",
        a: "ConcertRide verifica el carnet de conducir de todos los conductores antes de publicar viajes. Cada conductor tiene perfil con valoraciones de pasajeros anteriores. El pago es directo conductor-pasajero (efectivo o Bizum) sin intermediarios y sin comisión de plataforma.",
      },
    ],
    relatedLinks: [
      { label: "Cómo volver de un festival de madrugada", to: "/blog/como-volver-festival-madrugada" },
      { label: "Guía de transporte para festivales", to: "/guia-transporte-festivales" },
      { label: "Cómo ir a Viña Rock", to: "/festivales/vina-rock" },
      { label: "Cómo ir a Arenal Sound", to: "/festivales/arenal-sound" },
      { label: "Cómo ir a BBK Live", to: "/festivales/bbk-live" },
      { label: "Cómo ir a Mad Cool", to: "/festivales/mad-cool" },
      { label: "Cómo ir a Resurrection Fest", to: "/festivales/resurrection-fest" },
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
          "2. Si no encuentras, busca lanzadera oficial del festival o autobús nocturno.",
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
      { label: "Carpooling a Mad Cool", to: "/festivales/mad-cool" },
    ],
    relatedPosts: ["huella-carbono-festivales-carpooling"],
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
      { label: "Cómo volver de un festival de madrugada", to: "/blog/como-volver-festival-madrugada" },
      { label: "Guía de transporte para festivales", to: "/guia-transporte-festivales" },
    ],
    relatedPosts: ["como-volver-festival-madrugada"],
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

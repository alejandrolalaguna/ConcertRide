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
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "blablacar-vs-concertride",
    title: "BlaBlaCar vs ConcertRide 2026: ¿qué app te conviene para ir a festivales?",
    h1: "BlaBlaCar vs ConcertRide para festivales: diferencias clave en 2026",
    excerpt:
      "BlaBlaCar es la plataforma de carpooling más conocida en España, pero ConcertRide es la alternativa especializada en conciertos y festivales. ¿Cuál da mejores resultados para ir a Mad Cool, Primavera Sound o Arenal Sound? Comparamos precios, experiencia y fiabilidad.",
    category: "comparativas",
    tags: ["blablacar", "comparativa", "carpooling", "festivales", "alternativa blablacar"],
    publishedAt: "2026-04-15T09:00:00.000Z",
    author: "Equipo ConcertRide",
    readingMinutes: 6,
    lede:
      "Buscas carpooling para un festival y dudas entre BlaBlaCar y ConcertRide. No son iguales: una es genérica y cobra comisión, la otra es especializada en eventos y es gratuita. Aquí tienes la comparativa honesta.",
    sections: [
      {
        heading: "La diferencia fundamental: generalista vs. especializado",
        paragraphs: [
          "BlaBlaCar es una plataforma generalista de viaje compartido que cubre cualquier trayecto entre ciudades: trabajo, familia, viajes de ocio. Es útil cuando necesitas ir de Madrid a Barcelona cualquier día. Su modelo se basa en cobrar una comisión del 15–20 % sobre el precio que paga el pasajero.",
          "ConcertRide nació exclusivamente para conciertos y festivales. Los viajes están vinculados a un evento concreto, lo que significa que conductor y pasajeros van al mismo lugar, a la misma hora, y tienen el mismo plan de vuelta. Sin comisión: el 100 % del precio va al conductor.",
        ],
      },
      {
        heading: "Precio: comisión vs. sin comisión",
        paragraphs: [
          "En BlaBlaCar, si un conductor pone 10 € por plaza, tú pagas entre 11,50 y 12 € (comisión incluida). En viajes de larga distancia como Madrid–Benicàssim (FIB) o Madrid–Barcelona (Primavera Sound), esa comisión puede superar los 3–4 € por trayecto.",
          "En ConcertRide no hay comisión. Lo que fija el conductor es lo que pagas — en efectivo o Bizum el día del viaje. Para un grupo de amigos que va y vuelve del festival, el ahorro acumulado puede ser de 15–25 € por persona.",
        ],
        bullets: [
          "BlaBlaCar: conductor pone 10 € → pasajero paga ~12 € (comisión ~15-20 %)",
          "ConcertRide: conductor pone 10 € → pasajero paga 10 € (sin comisión)",
          "Pago en BlaBlaCar: tarjeta online antes del viaje",
          "Pago en ConcertRide: efectivo o Bizum al conductor el día del evento",
        ],
      },
      {
        heading: "Oferta de viajes a festivales: ¿dónde hay más?",
        paragraphs: [
          "BlaBlaCar tiene más usuarios en total, pero su buscador no filtra por festival. Para encontrar viajes a, por ejemplo, el Arenal Sound en Burriana, tienes que buscar «Castellón» o «Burriana» y filtrar manualmente por fecha — a menudo entre viajes de trabajo o turismo que no tienen nada que ver.",
          "ConcertRide agrupa los viajes por concierto y festival. Buscas «Arenal Sound» y ves todos los viajes publicados para ese evento, desde cualquier origen, con fecha y hora ajustadas al festival. La oferta es más pequeña en número total, pero 100 % relevante.",
        ],
      },
      {
        heading: "Verificación de conductores",
        paragraphs: [
          "BlaBlaCar verifica el perfil del conductor mediante documentación de identidad y valoraciones de viajes anteriores. Es un sistema maduro con millones de valoraciones acumuladas.",
          "ConcertRide verifica el carnet de conducir de los conductores antes de que puedan publicar viajes. Al ser una plataforma más pequeña y especializada, el sistema de valoraciones está en crecimiento, pero la verificación del carnet es obligatoria desde el primer viaje.",
        ],
      },
      {
        heading: "¿Cuándo usar BlaBlaCar y cuándo ConcertRide?",
        paragraphs: [
          "Usa BlaBlaCar si necesitas un trayecto interurbano genérico: Madrid a Sevilla un martes cualquiera, vuelta de un puente desde casa de tus padres, etc. Su red de conductores es amplia y encontrarás viajes casi siempre.",
          "Usa ConcertRide si vas a un concierto o festival. Los conductores ya van al mismo evento, la coordinación de horarios es automática, no hay comisión y el pago es directo. Para festivales como Mad Cool, Primavera Sound, Arenal Sound, FIB, BBK Live o Resurrection Fest, es la opción más eficiente.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Es BlaBlaCar gratis para los pasajeros?",
        a: "No. BlaBlaCar cobra una comisión de servicio del 15–20 % sobre el precio del viaje que paga el pasajero. El conductor recibe el precio base que ha fijado.",
      },
      {
        q: "¿ConcertRide cobra comisión?",
        a: "No. ConcertRide es completamente gratuito, sin comisiones para conductores ni pasajeros. El pago se realiza directamente entre conductor y pasajero (efectivo o Bizum) el día del viaje.",
      },
      {
        q: "¿Puedo encontrar viajes a festivales en BlaBlaCar?",
        a: "Sí, pero el buscador es genérico: tienes que buscar por ciudad de destino y filtrar por fecha. Los resultados mezclan viajes a festivales con viajes de trabajo o turismo. ConcertRide agrupa los viajes directamente por festival.",
      },
      {
        q: "¿Cuál tiene más viajes disponibles?",
        a: "BlaBlaCar tiene más usuarios en total. ConcertRide tiene menos viajes en total pero todos son relevantes para conciertos y festivales — no hay ruido de viajes no relacionados.",
      },
    ],
    relatedLinks: [
      { label: "Carpooling al Mad Cool Festival", to: "/festivales/mad-cool" },
      { label: "Carpooling al Primavera Sound", to: "/festivales/primavera-sound" },
      { label: "Cómo volver de un festival de madrugada", to: "/blog/como-volver-festival-madrugada" },
      { label: "Guía de transporte para festivales en España", to: "/guia-transporte-festivales" },
    ],
    relatedPosts: ["autobuses-festivales-espana-2026", "como-volver-festival-madrugada"],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "que-llevar-al-festival",
    title: "Qué llevar al festival: lista completa 2026 (para los que van en coche)",
    h1: "Qué llevar al festival: la lista definitiva para 2026",
    excerpt:
      "¿Tiket comprado, pero no sabes qué meter en la mochila? Esta lista cubre todo lo que necesitas para un festival de uno, dos o varios días: equipaje, comida, documentación, ropa y los imprescindibles si vas en coche compartido.",
    category: "guias",
    tags: ["qué llevar", "mochila", "festival", "equipo", "camping", "lista"],
    publishedAt: "2026-05-01T09:00:00.000Z",
    author: "Equipo ConcertRide",
    readingMinutes: 7,
    lede:
      "La diferencia entre un festival que recuerdas con cariño y uno que recuerdas con ampollas suele estar en la mochila. Aquí tienes la lista honesta — sin los 20 objetos que no vas a usar.",
    sections: [
      {
        heading: "Los imprescindibles (que se olvidan el 30 % de las veces)",
        paragraphs: [
          "Antes de entrar en detalles, estos son los objetos que más gente olvida y que arruinan el día si faltan:",
        ],
        bullets: [
          "Entrada o código QR descargado sin conexión (capturas de pantalla en el carrete, no solo en el email).",
          "DNI o pasaporte — sin él no entras si hay control de acceso.",
          "Tarjeta bancaria física — los festivales con pago cashless o pulsera recargable no aceptan siempre Apple/Google Pay.",
          "Auriculares de espuma (protección auditiva) — reducen el riesgo de daño auditivo sin quitar sonido.",
          "Cargador portátil (powerbank) cargado al 100 % el día anterior.",
          "Dinero en efectivo — para el conductor del carpooling y para los puestos de street food sin TPV.",
        ],
      },
      {
        heading: "Ropa: la regla de las capas y el calzado correcto",
        paragraphs: [
          "La mayoría de festivaleros sobre-empacan ropa y sub-empacan calzado cómodo. La regla práctica: para un festival de verano de 3 días, 2–3 camisetas, 1 capa media (sudadera ligera o camisa de manga larga), y 1 chubasquero compacto. Los festivales nocturnos bajan hasta los 15 °C incluso en julio en zonas de interior.",
          "El calzado es el factor número uno de bienestar. Si el recinto es exterior con terreno de tierra o hierba, las zapatillas de running son mejor opción que las botas de trabajo o las Converse. Lleva calcetines extra — los calcetines secos cambian el día.",
        ],
        bullets: [
          "Festival de día (1 día): camiseta + pantalón corto + zapatillas + gorra o sombrero.",
          "Festival nocturno verano (1–2 días): añade sudadera ligera + chubasquero.",
          "Festival con acampada (3+ días): añade chubasquero impermeable + ropa térmica ligera para la madrugada.",
          "Evita: jeans (pesan, tardan en secar), sandalias de plataforma, ropa nueva sin estrenar.",
        ],
      },
      {
        heading: "Lo que llevar en la mochila de día (mochila pequeña, 10–20 L)",
        paragraphs: [
          "La mochila que entra al recinto debe ser ligera. La mayoría de festivales tienen límite de tamaño (35x40 cm aprox.) y lo revisan. Lo que debe ir dentro:",
        ],
        bullets: [
          "Agua (botella vacía rellenable — muchos festivales tienen puntos de agua gratis).",
          "Protección solar SPF 50+ — el olvido más caro en festividales de verano.",
          "Analgésico (ibuprofeno o paracetamol) + tiritas + alcohol en gel.",
          "Tapones para los oídos (el equivalente a 30 dB de reducción).",
          "Powerbank + cable USB-C/Lightning.",
          "Dinero en efectivo (20–50 €) + tarjeta.",
          "Gorra o pañuelo para el sol.",
          "Impermeable plegable ultraligero (100 g, cabe en un bolsillo).",
        ],
      },
      {
        heading: "Si el festival tiene camping: lo que cambia",
        paragraphs: [
          "Para festivales con acampada (Resurrection Fest, Arenal Sound, Viña Rock, FIB, Medusa) necesitas equipaje extra. Si vas en coche compartido, es fundamental acordar con el conductor qué entra en el maletero antes del día del festival.",
        ],
        bullets: [
          "Tienda de campaña (2x2 m mínimo, impermeable 1500 mm HH o más).",
          "Saco de dormir (válido hasta 10 °C en verano, aunque parezca mucho).",
          "Esterilla o colchoneta hinchable.",
          "Linterna frontal (las pilas no se consumen con el móvil).",
          "Cerrojo para cremallera de tienda (disuasorio contra robos menores).",
          "Bolsa de basura grande (para guardar el equipo mojado y no ensuciar el coche de vuelta).",
        ],
      },
      {
        heading: "Lo que NO llevar (y que te quitarán en la entrada)",
        paragraphs: [
          "Cada festival tiene su propia lista de objetos prohibidos, pero estos son los más comunes:",
        ],
        bullets: [
          "Botellas de cristal o latas (permitidas en algunos, prohibidas en la mayoría).",
          "Paraguas con varillas metálicas (aceptan chubasqueros, no paraguas).",
          "Sillas plegables con altura (suelen prohibir las que bloquean visión).",
          "Cámaras con objetivo desmontable o zoom > 10 cm (prensa acreditada).",
          "Drones sin acreditación.",
          "Alcohol propio en grandes festivales (en recinto queda precintado o confiscado).",
        ],
      },
      {
        heading: "Lista específica si vas en coche compartido (ConcertRide)",
        paragraphs: [
          "Si llegas al festival en carpooling hay dos reglas de oro: confirma con el conductor el punto de encuentro y la hora exacta, y ten el dinero del viaje preparado en efectivo o Bizum antes de salir de casa.",
          "Para el maletero compartido, acuerda de antemano cuántos bultos caben. Un coche estándar con 4 personas y acampada solo admite mochilas medianas (40–50 L) si el maletero se reparte entre todos.",
        ],
        bullets: [
          "Precio del viaje en efectivo o Bizum listo (no le hagas esperar a que saques del cajero).",
          "Punto de encuentro guardado en Google Maps sin conexión.",
          "Número de teléfono del conductor guardado (el chat de ConcertRide funciona sin datos si tienes WiFi).",
          "Mochila de maletero: no más de 40–50 L si vais 4 con acampada.",
          "Mochila de cabina (la que llevas a tu lado en el coche): lo que necesitas los primeros 30 min en el recinto.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Qué ropa llevar a un festival de verano en España?",
        a: "Para festivales de verano diurnos: camiseta, pantalón corto, zapatillas cómodas, gorra y protección solar. Para festivales nocturnos o de varios días añade una sudadera ligera y un chubasquero compacto — las noches en festivales de interior bajan hasta 12–15 °C incluso en julio.",
      },
      {
        q: "¿Puedo llevar comida al festival?",
        a: "Depende del festival. La mayoría permiten snacks envasados y sándwiches, pero no bebidas alcohólicas ni comida que requiera cocinar. Siempre es válido llevar barritas energéticas, fruta y bocadillos para ahorrarte en los puestos de comida.",
      },
      {
        q: "¿Qué llevo si voy en coche compartido a un festival de acampada?",
        a: "Acuerda con el conductor el espacio de maletero antes del día. Con 4 personas y acampada, lo práctico es una mochila grande (50–60 L) para el camping y una pequeña (10–20 L) para llevar al recinto. Ten el dinero del viaje preparado — efectivo o Bizum — para entregárselo al conductor al llegar.",
      },
      {
        q: "¿Qué no puedo llevar a un festival?",
        a: "Los objetos más frecuentemente prohibidos son: botellas de cristal, paraguas con varillas metálicas, latas (en algunos festivales), cámaras con objetivo desmontable, drones y sillas que bloqueen la visión de otros asistentes. Consulta siempre las normas específicas del festival antes de hacer la maleta.",
      },
    ],
    relatedLinks: [
      { label: "Cómo volver de un festival de madrugada", to: "/blog/como-volver-festival-madrugada" },
      { label: "Guía de transporte para festivales en España", to: "/guia-transporte-festivales" },
      { label: "Autobuses a festivales de España 2026", to: "/blog/autobuses-festivales-espana-2026" },
      { label: "Carpooling a Mad Cool", to: "/festivales/mad-cool" },
      { label: "Carpooling a Primavera Sound", to: "/festivales/primavera-sound" },
      { label: "Carpooling a Arenal Sound", to: "/festivales/arenal-sound" },
    ],
    relatedPosts: ["como-volver-festival-madrugada", "autobuses-festivales-espana-2026"],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: "festivales-musica-espana-2026",
    title: "Festivales de música en España 2026: fechas, ciudades y cómo llegar",
    h1: "Festivales de música en España 2026: la guía completa",
    excerpt:
      "Mad Cool, Primavera Sound, Sónar, FIB, BBK Live, Arenal Sound, Viña Rock y 40 festivales más. Fechas confirmadas, ciudad y recinto, precio de entrada aproximado y la mejor forma de llegar a cada uno sin pagar un taxi de 90 €.",
    category: "guias",
    tags: ["festivales 2026", "festivales España", "agenda festivales", "fechas", "Mad Cool", "Primavera Sound"],
    publishedAt: "2026-05-01T10:00:00.000Z",
    author: "Equipo ConcertRide",
    readingMinutes: 10,
    lede:
      "El verano de 2026 tiene agenda. Repasamos los principales festivales de música en España, con fechas confirmadas, recinto, ciudad y las opciones reales de transporte para cada uno.",
    sections: [
      {
        heading: "Mayo 2026: el inicio de la temporada",
        paragraphs: [
          "La temporada de festivales de verano arranca en mayo con dos grandes citas en Madrid y Barcelona:",
        ],
        bullets: [
          "Viña Rock 2026 — 30 abril–3 mayo — Villarrobledo (Albacete). Festival de punk, metal y rock en La Pulgosa. Uno de los más veteranos de España, con entrada desde 35 €/día. Cómo llegar: carpooling desde Albacete (3–5 €), Madrid (6–9 €) o Valencia (6–9 €).",
          "Tomavistas 2026 — 15–17 mayo — Madrid (Recinto Ferial de la Casa de Campo). Festival indie y pop en la Casa de Campo. Metro línea 10 (Lago) o coche compartido desde Toledo, Guadalajara o Segovia.",
          "Primavera Sound 2026 — 28 mayo–1 junio — Barcelona (Parc del Fòrum). El festival de indie y alternativo más influyente de Europa. Metro L4 Besòs Mar + 10 min a pie. Carpooling desde Madrid (15–20 €), Valencia (10–14 €), Zaragoza (8–12 €).",
        ],
      },
      {
        heading: "Junio 2026: el mes más denso",
        paragraphs: [
          "Junio concentra los festivales de mayor componente electrónico y rock alternativo:",
        ],
        bullets: [
          "Sónar 2026 — 18–20 junio — Barcelona (Fira de Barcelona + Fira Gran Via). Referencia mundial de música avanzada. Metro L1 Espanya (Sónar de Día) y L9 Fira (Sónar de Noche). Carpooling desde Madrid o Valencia desde 15 €.",
          "O Son do Camiño 2026 — 18–20 junio — Santiago de Compostela (Monte do Gozo). Festival de rock e indie con lanzadera oficial desde el centro de Santiago.",
          "Resurrection Fest 2026 — 25–28 junio — Viveiro (Lugo). El festival de metal más importante de España. Sin transporte público nocturno: el carpooling desde A Coruña (4–7 €), Oviedo (6–9 €), Bilbao (10–15 €) o Madrid (16–22 €) es prácticamente la única opción.",
        ],
      },
      {
        heading: "Julio 2026: el pico de la temporada",
        paragraphs: [
          "Julio es el mes con mayor concentración de grandes festivales. Muchos se solapan en fechas, lo que crea una demanda altísima de transporte:",
        ],
        bullets: [
          "Mad Cool Festival 2026 — 9–11 julio — Madrid (IFEMA). Festival de rock e indie, 80.000 asistentes diarios. Metro L8 Feria de Madrid (con ampliación de horario). Carpooling desde Toledo (4–7 €), Barcelona (15–20 €), Valencia (10–14 €).",
          "BBK Live 2026 — 9–11 julio — Bilbao (Kobetamendi). Lanzadera oficial desde Plaza Moyúa (incluida en entrada). Carpooling desde Madrid (12–16 €), Donostia (4–7 €), Pamplona (5–8 €).",
          "FIB Benicàssim 2026 — 16–19 julio — Benicàssim (Castellón). Cercanías Renfe Castellón–Benicàssim (5 min) + lanzadera al recinto. Carpooling desde Valencia (4–6 €), Madrid (10–14 €).",
          "Low Festival 2026 — 24–26 julio — Benidorm. TRAM L1 Alicante–Benidorm hasta medianoche. Carpooling desde Alicante (3–5 €), Valencia (5–8 €).",
          "Arenal Sound 2026 — 29 julio–2 agosto — Burriana (Castellón). Sin tren al recinto. Lanzadera oficial desde Castellón ciudad. Carpooling desde Valencia (3–6 €), Barcelona (8–12 €), Madrid (12–17 €).",
          "Cruïlla 2026 — 9–12 julio — Barcelona (Parc del Fòrum). Metro L4 El Maresme-Fòrum a 5 min. Buen transporte público.",
        ],
      },
      {
        heading: "Agosto 2026: festivales de largo recorrido",
        paragraphs: [
          "En agosto continúan los festivales de varios días con alta demanda de camping y transporte:",
        ],
        bullets: [
          "Medusa Festival 2026 — 12–16 agosto — Cullera (Valencia). Lanzadera oficial desde Xàtiva y Joaquín Sorolla. Carpooling desde Valencia (3–5 €), Madrid (10–14 €).",
          "Sonorama Ribera 2026 — 6–9 agosto — Aranda de Duero (Burgos). Bus ALSA Madrid–Aranda (10–15 €, no nocturno). Carpooling desde Madrid (6–9 €), Burgos (3–5 €), Zaragoza (7–10 €).",
        ],
      },
      {
        heading: "Octubre 2026: el final de temporada",
        paragraphs: [
          "La temporada cierra con Cala Mijas, uno de los festivales de mayor crecimiento reciente:",
        ],
        bullets: [
          "Cala Mijas 2026 — 2–4 octubre — Mijas (Málaga). Sin transporte público al recinto. Taxi desde Málaga centro: 25–40 €. Carpooling desde Málaga (5–8 €), Sevilla (8–12 €), Granada (5–8 €).",
        ],
      },
      {
        heading: "Cómo organizar el transporte a los festivales de 2026",
        paragraphs: [
          "El transporte sigue siendo el mayor problema no resuelto de los festivales españoles. La mayoría de recintos están fuera del área metropolitana, los servicios nocturnos terminan antes del cabeza de cartel y los taxis cuestan entre 50 y 90 € en madrugada.",
          "Las tres opciones reales, ordenadas por comodidad para volver de madrugada:",
        ],
        bullets: [
          "Coche compartido (carpooling): llega y sale del recinto a cualquier hora. 3–22 € según distancia. Reserva con 2–4 semanas de antelación para festivales grandes.",
          "Lanzadera oficial del festival: disponible en BBK Live (gratuita), Medusa, FIB, O Son do Camiño. Sale a horas fijas, puede tener cola de 30–60 min en las salidas.",
          "Transporte público: solo práctico en festivales con metro o cercanías (Sónar, Primavera Sound, Cruïlla, Low Festival). Falla en las madrugadas para el 80 % de los festivales.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Cuándo es el Primavera Sound 2026?",
        a: "Primavera Sound 2026 se celebra del 28 de mayo al 1 de junio en el Parc del Fòrum de Barcelona. La edición de 2026 mantiene el formato de 5 días con escenarios en el recinto del mar.",
      },
      {
        q: "¿Cuándo es el Mad Cool 2026?",
        a: "Mad Cool Festival 2026 está previsto para el 9, 10 y 11 de julio en IFEMA Madrid. El acceso es por metro línea 8 (estación Feria de Madrid) o carpooling.",
      },
      {
        q: "¿Cuál es el festival de música más grande de España?",
        a: "Mad Cool Festival y Primavera Sound son los festivales más grandes de España en aforo, con 70.000–80.000 asistentes diarios. BBK Live, FIB y Arenal Sound siguen con 50.000–60.000. Resurrection Fest es el de mayor reputación internacional en el circuito de metal.",
      },
      {
        q: "¿Cómo llegar a los festivales de España sin coche propio?",
        a: "Las opciones varían por festival. Para recintos dentro de ciudades (Sónar, Cruïlla, Low Festival) el metro o TRAM llega al recinto. Para los que están fuera de la ciudad (Viña Rock, Resurrection Fest, Sonorama, Cala Mijas) el coche compartido con ConcertRide es la opción más flexible y económica (3–22 € según distancia).",
      },
      {
        q: "¿Hay festivales de música en España en otoño?",
        a: "Sí. Cala Mijas (octubre, Málaga) es el más destacado del calendario de otoño de 2026. Otros festivales de formato sala o pequeño aforo en Madrid y Barcelona también tienen agenda de otoño, aunque no son al aire libre.",
      },
    ],
    relatedLinks: [
      { label: "Carpooling al Mad Cool Festival", to: "/festivales/mad-cool" },
      { label: "Carpooling al Primavera Sound", to: "/festivales/primavera-sound" },
      { label: "Carpooling al BBK Live Bilbao", to: "/festivales/bbk-live" },
      { label: "Carpooling al Arenal Sound", to: "/festivales/arenal-sound" },
      { label: "Carpooling al Resurrection Fest", to: "/festivales/resurrection-fest" },
      { label: "Guía de transporte para festivales", to: "/guia-transporte-festivales" },
      { label: "Autobuses a festivales España 2026", to: "/blog/autobuses-festivales-espana-2026" },
    ],
    relatedPosts: ["autobuses-festivales-espana-2026", "que-llevar-al-festival"],
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

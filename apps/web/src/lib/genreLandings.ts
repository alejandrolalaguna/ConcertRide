import { FESTIVAL_LANDINGS_BY_SLUG } from "./festivalLandings";

export interface GenreLanding {
  slug: string;
  name: string;                // display name, e.g. "Rock"
  nameFull: string;            // "Festivales de rock en España"
  emoji: string;
  blurb: string;              // 60–120 words, citable by AI overviews
  festivalSlugs: string[];    // ordered by relevance
  relatedGenres: string[];    // for internal linking
  faqs: Array<{ q: string; a: string }>;
}

export const GENRE_LANDINGS: GenreLanding[] = [
  {
    slug: "rock",
    name: "Rock",
    nameFull: "Festivales de rock en España",
    emoji: "🎸",
    blurb:
      "España acoge cada año algunos de los mejores festivales de rock del mundo. Desde el clásico Viña Rock en Villarrobledo (Albacete), con 50.000 asistentes y 30 años de historia punk, rock alternativo y metal, hasta el BBK Live de Bilbao (pop-rock internacional) y el Mad Cool de Madrid (rock e indie de primer nivel). El Resurrection Fest en Viveiro (Lugo) es la meca del metal pesado español. Carpooling con ConcertRide desde cualquier ciudad española, sin comisión.",
    festivalSlugs: [
      "vina-rock",
      "mad-cool",
      "bbk-live",
      "resurrection-fest",
      "sonorama-ribera",
      "fib",
      "low-festival",
      "o-son-do-camino",
      "atlantic-fest",
      "bbk-music-legends",
    ],
    relatedGenres: ["metal", "indie", "pop"],
    faqs: [
      {
        q: "¿Cuál es el mejor festival de rock en España en 2026?",
        a: "Los festivales de rock más destacados en España para 2026 son: Mad Cool (Madrid, julio, rock/indie internacional), Viña Rock (Albacete, mayo, punk/rock alternativo/metal, 50.000 asistentes), BBK Live (Bilbao, julio, pop-rock), Resurrection Fest (Viveiro, junio, metal) y Sonorama Ribera (Aranda de Duero, agosto, pop-rock en español). Para transporte sin comisión a cualquiera de ellos, ConcertRide cubre carpooling desde las principales ciudades españolas.",
      },
      {
        q: "¿Cómo llegar a los festivales de rock en España?",
        a: "La mayoría de los grandes festivales de rock en España (Viña Rock, Resurrection Fest, Mad Cool, Sonorama) se celebran en recintos con transporte público limitado o nulo en horarios de madrugada. La opción más usada por los asistentes es el carpooling: compartir coche con otros fans del festival mediante ConcertRide, que conecta conductores y pasajeros sin cobrar comisión. Los precios oscilan entre 3 y 18 €/asiento según la distancia.",
      },
      {
        q: "¿Hay festivales de rock gratis en España?",
        a: "Algunos municipios organizan conciertos de rock gratuitos en fiestas locales, pero los grandes festivales de rock en España (Mad Cool, Viña Rock, BBK Live, Resurrection Fest) requieren entrada de pago (40–150 €/día o abono de varios días). Sonorama Ribera en Aranda de Duero tiene zona de conciertos gratuita en el centro de la ciudad, aunque el recinto principal tiene acceso con abono.",
      },
      {
        q: "¿Cuándo son los festivales de rock en España 2026?",
        a: "El calendario de festivales de rock en España 2026 arranca en mayo (Viña Rock, 30 abril–3 mayo), continúa en junio (Resurrection Fest, 25–28 junio), se concentra en julio (Mad Cool 9–11 jul, BBK Live 9–11 jul, FIB 16–19 jul, Low Festival 24–26 jul) y culmina en agosto (Sonorama 6–9 ago). El otoño tiene opciones más reducidas.",
      },
    ],
  },
  {
    slug: "indie",
    name: "Indie",
    nameFull: "Festivales indie en España",
    emoji: "🎵",
    blurb:
      "El circuito indie en España es uno de los más activos de Europa. Primavera Sound en Barcelona es referencia global con 210.000 asistentes en cuatro días, carteles eclécticos y capacidad para descubrir artistas emergentes junto a cabezas de cartel internacionales. Sonorama Ribera en Aranda de Duero es el festival de pop/rock en español más querido del panorama independiente. FIB en Benicàssim y Mad Cool en Madrid completan el cuadro. Todos con carpooling sin comisión desde ConcertRide.",
    festivalSlugs: [
      "primavera-sound",
      "mad-cool",
      "fib",
      "sonorama-ribera",
      "low-festival",
      "tomavistas",
      "sos-48",
      "bbk-live",
      "granada-sound",
      "metropoli-gijon",
    ],
    relatedGenres: ["rock", "pop", "alternativo"],
    faqs: [
      {
        q: "¿Cuál es el festival indie más importante en España?",
        a: "Primavera Sound (Barcelona, mayo–junio) es el festival indie más importante de España y uno de los top del mundo, con 210.000 asistentes en cuatro días y carteles que combinan artistas emergentes con cabezas de cartel de primera línea. Sonorama Ribera (Aranda de Duero, agosto) es el más querido del indie en español. Mad Cool (Madrid, julio) ocupa el segundo lugar en términos de cartel internacional.",
      },
      {
        q: "¿Cuánto cuesta el carpooling a festivales indie en España?",
        a: "Con ConcertRide, el carpooling a festivales indie en España cuesta entre 3 y 20 €/asiento según distancia: Madrid a Primavera Sound 15–20 €, Madrid a Sonorama Ribera 10–14 €, Valencia a FIB 5–8 €, Bilbao a Mad Cool 11–16 €, Madrid a Low Festival 12–17 €. El 100 % va al conductor, sin comisión de plataforma.",
      },
      {
        q: "¿Qué festivales indie hay en España en verano 2026?",
        a: "El verano 2026 concentra los principales festivales indie de España: Primavera Sound (Barcelona, 28 mayo–1 jun), Tomavistas (Madrid, 15–17 mayo), FIB (Benicàssim, 16–19 jul), Mad Cool (Madrid, 9–11 jul), Low Festival (Benidorm, 24–26 jul), Sonorama Ribera (Aranda de Duero, 6–9 ago), Granada Sound (Granada, septiembre). Todos con transporte compartido disponible en ConcertRide.",
      },
    ],
  },
  {
    slug: "electronica",
    name: "Electrónica",
    nameFull: "Festivales de música electrónica en España",
    emoji: "🎛️",
    blurb:
      "España es el epicentro europeo de la música electrónica de verano. Medusa Festival en Cullera (Valencia) reúne a 120.000 personas en una semana con los mejores DJs del mundo. Sónar en Barcelona combina electrónica de vanguardia con instalaciones de arte digital desde 1994. Zevra Festival en El Ejido crece como referente del techno y house del sureste. Arenal Sound en Burriana mezcla electrónica con indie. Todos con carpooling sin comisión desde ConcertRide.",
    festivalSlugs: [
      "medusa-festival",
      "sonar",
      "zevra-festival",
      "arenal-sound",
      "cala-mijas",
      "mallorca-live-festival",
    ],
    relatedGenres: ["dance", "techno", "house"],
    faqs: [
      {
        q: "¿Cuál es el mejor festival de música electrónica en España?",
        a: "Los mejores festivales de electrónica en España en 2026 son: Medusa Festival (Cullera, Valencia, agosto, techno/house/EDM, 120.000 asistentes), Sónar (Barcelona, junio, electrónica experimental y de vanguardia), Zevra Festival (El Ejido, Almería, techno y house), Arenal Sound (Burriana, agosto, mezcla indie + electrónica), Cala Mijas (Málaga, octubre, música electrónica en formato íntimo).",
      },
      {
        q: "¿Cómo llegar a Medusa Festival sin coche?",
        a: "Medusa Festival en Cullera (Valencia) no tiene acceso en transporte público regular en horarios nocturnos. Las opciones son: (1) Autobús lanzadera oficial del festival desde Valencia ciudad (precio 10–15€ ida/vuelta), (2) Taxi/VTC desde Valencia (30–50€ por coche), (3) Carpooling con ConcertRide desde Valencia (3–6€/asiento), Madrid (12–17€/asiento), Barcelona (12–17€/asiento) o Murcia (5–8€/asiento). El coche compartido es la opción más económica para quienes vienen de fuera de Valencia.",
      },
      {
        q: "¿Hay festivales de electrónica en Madrid en 2026?",
        a: "Madrid no tiene un festival de electrónica equivalente a Medusa o Sónar en 2026. Los principales eventos de electrónica en Madrid son de club y sala (Fabrik, Mondo Disko, Sala But), no al aire libre de varios días. Los madrileños que quieren festivales de electrónica se desplazan a Medusa (Valencia, 12–16 agosto), Sónar (Barcelona, 18–20 junio) o Arenal Sound (Burriana, 29 jul–2 ago). ConcertRide cubre carpooling desde Madrid a todos ellos.",
      },
    ],
  },
  {
    slug: "reggaeton",
    name: "Reggaetón & Urbano",
    nameFull: "Festivales de reggaetón y música urbana en España",
    emoji: "🔥",
    blurb:
      "El reggaetón y la música urbana latina han conquistado los festivales de verano españoles. Reggaeton Beach Festival en Salou (Tarragona) concentra cada julio a los principales artistas del género urbano latino. Vive Latino en Zaragoza (septiembre 2026) trae la primera edición europea del histórico festival mexicano. Artistas como Bad Bunny, J Balvin, Anuel AA, Karol G o Peso Pluma agotan entradas en horas en venues españoles. ConcertRide cubre el carpooling a todos estos eventos.",
    festivalSlugs: [
      "reggaeton-beach-festival",
      "vive-latino",
      "mallorca-live-festival",
      "arenal-sound",
      "medusa-festival",
    ],
    relatedGenres: ["urbano", "latin", "pop"],
    faqs: [
      {
        q: "¿Cuál es el mayor festival de reggaetón en España?",
        a: "El Reggaeton Beach Festival (RBF) en Salou (Tarragona) es el mayor festival de reggaetón en España, con ediciones anuales en julio que reúnen a 50.000+ asistentes y carteles con los artistas del género urbano latino de mayor popularidad internacional. En 2026 se celebra el 31 julio–2 agosto en Salou. ConcertRide opera carpooling desde Barcelona (100 km, 5–8€/asiento), Madrid (550 km, 15–20€), Valencia (200 km, 6–10€) y Zaragoza (250 km, 8–12€).",
      },
      {
        q: "¿Hay festivales de música latina en España en 2026?",
        a: "Sí, varios: Reggaeton Beach Festival (Salou, 31 jul–2 ago), Vive Latino España (Zaragoza, 4–5 sept, primera edición europea del festival mexicano fundado en 1998), Arenal Sound (Burriana, 29 jul–2 ago, mezcla indie/electro/urbano), Mallorca Live Festival (Calvià, mayo, pop y urbano). Artistas latinoamericanos también actúan en fechas individuales en el WiZink Center, Palau Sant Jordi y estadios de fútbol.",
      },
      {
        q: "¿Cuánto cuesta ir al Reggaeton Beach Festival desde Barcelona?",
        a: "Desde Barcelona al Reggaeton Beach Festival en Salou hay 100 km (aprox. 1 h en coche). Con ConcertRide, el carpooling cuesta 4–7 €/asiento (precio que cubre combustible y peaje del conductor). El tren de Renfe Barcelona–Salou/Port Aventura cuesta 5–15 €/trayecto, pero el último tren nocturno sale antes de que terminen los conciertos. El carpooling de vuelta es la opción más flexible y económica.",
      },
    ],
  },
  {
    slug: "metal",
    name: "Metal",
    nameFull: "Festivales de metal en España",
    emoji: "🤘",
    blurb:
      "España tiene una escena metal consolidada con un festival de referencia internacional: Resurrection Fest en Viveiro (Galicia), que desde 2006 congrega a 40.000 metaleros por día con bandas de talla mundial. Viña Rock en Albacete, aunque más amplio en géneros, tiene una tradición fuerte de metal y punk. BBK Music Legends en Bilbao cubre el rock clásico de los 70–80. Atlantic Fest en Ponteceso (Galicia) combina metal con indie y folk. Todos accesibles por carpooling sin comisión.",
    festivalSlugs: [
      "resurrection-fest",
      "vina-rock",
      "atlantic-fest",
      "bbk-music-legends",
    ],
    relatedGenres: ["rock", "punk", "hardcore"],
    faqs: [
      {
        q: "¿Cuál es el mejor festival de metal en España?",
        a: "Resurrection Fest en Viveiro (Galicia) es el festival de metal más importante de España y uno de los más respetados de Europa. Se celebra la última semana de junio (edición 2026: 25–28 junio) con 40.000 asistentes/día y bandas de metal, hardcore, punk y rock pesado de primera línea mundial. Viveiro no tiene transporte público a esas horas; el carpooling con ConcertRide desde A Coruña, Oviedo, Bilbao o Madrid es la opción más usada.",
      },
      {
        q: "¿Cómo llegar a Resurrection Fest en Viveiro?",
        a: "Viveiro (Lugo, Galicia) está mal comunicado en transporte público: el tren más cercano es la estación de Lugo (100 km). Las opciones reales son: (1) Autobús oficial del festival desde A Coruña y Lugo (precio variable, comprar con anticipación en la web del festival), (2) Coche propio, (3) Carpooling con ConcertRide desde A Coruña (80 km, 5–8€/asiento), Oviedo (220 km, 8–12€), Bilbao (390 km, 12–17€) o Madrid (590 km, 16–22€).",
      },
      {
        q: "¿Hay festivales de metal en el norte de España?",
        a: "Sí, el norte concentra los mejores festivales de metal en España: Resurrection Fest (Viveiro, Galicia, junio, el más grande), Atlantic Fest (Ponteceso, Galicia, julio, metal e indie), BBK Music Legends (Sondika, Bilbao, junio, rock clásico 70–80). El noroeste (Galicia, Asturias) tiene la escena metal más activa de España. ConcertRide cubre rutas de carpooling entre todas las ciudades del norte para estos festivales.",
      },
    ],
  },
  {
    slug: "pop",
    name: "Pop",
    nameFull: "Festivales de pop en España",
    emoji: "🌟",
    blurb:
      "Los festivales de pop en España aúnan artistas nacionales e internacionales del mainstream para audiencias masivas. Mad Cool en Madrid reúne 80.000 personas/día con carteles de rock y pop de primer nivel. FIB en Benicàssim es el festival de pop/indie internacional más veterano del Mediterráneo español. Starlite Marbella combina pop clásico y pop internacional en un entorno único de lujo. Metrópoli Gijón, Granada Sound y Les Arts Valencia completan el mapa estival. Carpooling sin comisión con ConcertRide.",
    festivalSlugs: [
      "mad-cool",
      "fib",
      "mallorca-live-festival",
      "starlite-marbella",
      "metropoli-gijon",
      "granada-sound",
      "festival-de-les-arts",
      "arenal-sound",
      "sos-48",
      "tomavistas",
      "marenostrum-fuengirola",
    ],
    relatedGenres: ["indie", "rock", "urbano"],
    faqs: [
      {
        q: "¿Cuáles son los festivales de pop más grandes de España?",
        a: "Los festivales de pop más masivos de España en 2026 son: Mad Cool (Madrid, julio, 80.000/día), FIB (Benicàssim, julio, 45.000/día), Arenal Sound (Burriana, agosto, 50.000/día), Mallorca Live (Calvià, mayo, 25.000/día), Granada Sound (Granada, septiembre, 25.000/día), Metrópoli Gijón (Gijón, julio, 30.000/día) y Festival de les Arts (Valencia, mayo, 25.000/día). Todos operan con carpooling sin comisión en ConcertRide.",
      },
      {
        q: "¿Hay festivales de pop en España en septiembre?",
        a: "Septiembre tiene varios festivales de pop en España: Vive Latino (Zaragoza, 4–5 sept), Granada Sound (Granada, 25–27 sept) y Cala Mijas (Málaga, 2–4 oct). La temporada alta de festivales en España es mayo–agosto, pero septiembre ofrece alternativas con precios de entrada y carpooling más ajustados y menos aforo.",
      },
    ],
  },
  {
    slug: "world-music",
    name: "World Music",
    nameFull: "Festivales de world music en España",
    emoji: "🌍",
    blurb:
      "España acoge festivales de world music únicos en el panorama europeo. Pirineos Sur en el embalse de Lanuza (Huesca) es referente mundial con su escenario flotante y programación de música africana, latinoamericana y mediterránea. Festival de Ortigueira en Galicia es el mayor festival de música celta del mundo hispano. Jazzaldia en Donostia-San Sebastián combina jazz con world music en un entorno incomparable. Cruïlla Barcelona mezcla world music, reggae y pop en el Fòrum. ConcertRide cubre el transporte a todos.",
    festivalSlugs: [
      "pirineos-sur",
      "festival-ortigueira",
      "jazzaldia",
      "cruilla",
      "portamerica",
      "tio-pepe-festival",
    ],
    relatedGenres: ["folk", "jazz", "flamenco"],
    faqs: [
      {
        q: "¿Cuál es el mejor festival de world music en España?",
        a: "Pirineos Sur (Sallent de Gállego, Huesca, julio) es el festival de world music más reconocido internacionalmente de España, con su escenario flotante sobre el embalse de Lanuza y programación de música africana, latinoamericana y mediterránea desde 1992. El Festival de Ortigueira (Galicia, julio) es el más grande de música celta. Jazzaldia en Donostia (julio) es el festival de jazz y world music más prestigioso del norte.",
      },
      {
        q: "¿Cómo llegar a Pirineos Sur en Sallent de Gállego?",
        a: "Sallent de Gállego (Huesca, Pirineo aragonés) está a 75 km de Huesca y 175 km de Zaragoza, sin transporte público nocturno. Las opciones de transporte son: coche propio (recomendado, parking habilitado en el pueblo) o carpooling con ConcertRide desde Huesca (desde 4–7€/asiento), Zaragoza (desde 6–9€), Barcelona (desde 14–19€) o Madrid (desde 16–22€). La carretera de acceso (HU-V-7002) puede colapsar en horario de llegada los días de mayor afluencia.",
      },
    ],
  },
  {
    slug: "folk-flamenco",
    name: "Folk & Flamenco",
    nameFull: "Festivales de folk y flamenco en España",
    emoji: "🪗",
    blurb:
      "España es tierra de raíces musicales únicas. El Festival de Ortigueira en Galicia es el mayor festival de gaitas y música celta del mundo hispanohablante, con 80.000 asistentes en cuatro días. El Tío Pepe Festival en Jerez de la Frontera pone en valor el flamenco y el pop clásico en el entorno único de las bodegas González Byass. PortAmérica en Catoira (Pontevedra) mezcla folk, pop latinoamericano y alternativo en un entorno natural gallego. Carpooling sin comisión con ConcertRide.",
    festivalSlugs: [
      "festival-ortigueira",
      "tio-pepe-festival",
      "portamerica",
      "pirineos-sur",
    ],
    relatedGenres: ["world-music", "tradicional", "roots"],
    faqs: [
      {
        q: "¿Cuál es el festival de gaitas más importante de España?",
        a: "El Festival Internacional del Mundo Celta de Ortigueira (A Coruña, Galicia) es el mayor festival de música celta y gaitas del mundo hispanohablante, declarado Bien de Interés Cultural. Se celebra el segundo fin de semana de julio con 80.000 asistentes y artistas de Galicia, Irlanda, Escocia, Bretaña, Asturias, Gales y Cornualles. ConcertRide opera carpooling desde A Coruña (60 km, 3–5€/asiento), Ferrol (40 km), Santiago de Compostela (100 km) y Oviedo (260 km).",
      },
      {
        q: "¿Dónde ver flamenco en festival en España?",
        a: "El Tío Pepe Festival en Jerez de la Frontera (Cádiz, junio–septiembre) programa flamenco junto a pop clásico en el marco de las bodegas González Byass. La Bienal de Flamenco de Sevilla (años pares) es el mayor festival de flamenco del mundo. El Festival de Jerez (febrero) es referente del flamenco puro. Para transporte a Jerez desde Sevilla (90 km) o Cádiz (35 km), ConcertRide ofrece carpooling desde 3–6€/asiento.",
      },
    ],
  },
  {
    slug: "jazz",
    name: "Jazz",
    nameFull: "Festivales de jazz en España",
    emoji: "🎷",
    blurb:
      "España cuenta con uno de los circuitos de jazz más prestigiosos de Europa. Heineken Jazzaldia en Donostia–San Sebastián, fundado en 1966, es el festival de jazz más antiguo del Estado y el segundo más veterano de Europa, con más de 150.000 asistentes anuales y escenarios al aire libre en la Plaza de la Trinidad, Plaza de Sarriegi y la playa de la Zurriola. El Festival de Jazz de Madrid (noviembre) y el Festival Internacional de Jazz de Barcelona (octubre–diciembre) cierran la temporada con cartel internacional. Carpooling sin comisión con ConcertRide desde cualquier ciudad española.",
    festivalSlugs: [
      "jazzaldia",
      "tio-pepe-festival",
      "pirineos-sur",
      "cruilla",
    ],
    relatedGenres: ["world-music", "folk-flamenco", "indie"],
    faqs: [
      {
        q: "¿Cuál es el festival de jazz más importante de España?",
        a: "Heineken Jazzaldia en Donostia–San Sebastián (julio, edición 61ª en 2026) es el festival de jazz más importante de España y el segundo más veterano de Europa (fundado en 1966). Atrae a más de 150.000 asistentes anuales con artistas de la talla de Wynton Marsalis, Pat Metheny, Diana Krall, Branford Marsalis o Esperanza Spalding. La mayoría de los escenarios son al aire libre y gratuitos (Plaza de la Trinidad, Plaza de Sarriegi, playa de la Zurriola).",
      },
      {
        q: "¿Cómo llegar al Jazzaldia desde Bilbao o Madrid?",
        a: "Bilbao–Donostia son 100 km (1h por la AP-8); con ConcertRide el carpooling cuesta 4–7€/asiento, frente a 18–30€ del bus PESA o 12–25€ del Euskotren con trasbordo. Madrid–Donostia son 460 km (4h 30 min por la A-1 y AP-15); el carpooling cuesta 13–18€/asiento, frente a 30–80€ del Alvia Renfe (5h 15 min) o 25–55€ del bus ALSA (6h). Donostia tiene aparcamiento muy limitado en julio, por lo que el coche compartido es la opción más práctica.",
      },
      {
        q: "¿Hay festivales de jazz gratuitos en España?",
        a: "Sí. Heineken Jazzaldia ofrece escenarios gratuitos cada noche durante toda la semana (Plaza de la Trinidad y playa de la Zurriola programan artistas internacionales sin entrada). El Festival de Jazz de San Javier (Murcia, julio) y el Getxo Jazz (Vizcaya, julio) también tienen sesiones gratuitas en plazas públicas. Para los conciertos de pago, los precios oscilan entre 25 y 80 € según artista. Carpooling con ConcertRide reduce el coste total del viaje un 60–75 % frente a alternativas.",
      },
      {
        q: "¿Cuándo son los festivales de jazz en España 2026?",
        a: "El calendario de festivales de jazz en España 2026 se concentra en verano y otoño: Jazzaldia Donostia (21–26 julio, 61ª edición), Getxo Jazz (Vizcaya, julio), Festival de Jazz de San Javier (Murcia, julio–agosto), Festival Internacional de Jazz de Barcelona (octubre–diciembre, programación distribuida en 2 meses) y Festival de Jazz de Madrid (noviembre). Pirineos Sur (Sallent de Gállego, julio) incluye habitualmente artistas de jazz en su programación de world music.",
      },
      {
        q: "¿Cuánto cuesta el carpooling a festivales de jazz en España?",
        a: "Con ConcertRide, el carpooling a festivales de jazz cuesta entre 3 y 18 €/asiento según distancia: Bilbao–Jazzaldia Donostia 4–7€, Pamplona–Jazzaldia 4–7€, Madrid–Jazzaldia 13–18€, Sevilla–Tío Pepe Jerez 3–6€, Zaragoza–Pirineos Sur 6–9€, Madrid–Cruïlla Barcelona 15–20€. El 100 % del importe va al conductor, sin comisión de plataforma, frente al 12–18 % que cobran otras plataformas de carpooling generalistas.",
      },
    ],
  },
];

export const GENRE_LANDINGS_BY_SLUG: Record<string, GenreLanding> = Object.fromEntries(
  GENRE_LANDINGS.map((g) => [g.slug, g])
);

export const GENRE_SLUGS = GENRE_LANDINGS.map((g) => g.slug);

// Helper: get festivals for a genre, resolved from FESTIVAL_LANDINGS_BY_SLUG
export function getGenreFestivals(genre: GenreLanding) {
  return genre.festivalSlugs
    .map((s) => FESTIVAL_LANDINGS_BY_SLUG[s])
    .filter(Boolean);
}

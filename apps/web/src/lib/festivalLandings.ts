// Festival-specific landing pages at /festivales/:slug.
// Each entry targets "cómo ir a [Festival]" queries with per-city logistics data,
// festival-specific FAQs, and schema.org Event metadata.

export interface OriginCity {
  city: string;
  km: number;
  drivingTime: string;      // "3h 30 min"
  concertRideRange: string; // "9–14 €/asiento"
}

export interface FestivalFaq {
  q: string;
  a: string;
}

export interface FestivalLanding {
  slug: string;
  name: string;             // full official name
  shortName: string;        // for H1 / inline refs
  city: string;             // canonical city (matches venues.city)
  citySlug: string;         // /conciertos/{citySlug}
  region: string;
  venue: string;
  venueAddress: string;
  lat: number;
  lng: number;
  startDate: string;        // ISO 8601, e.g. "2026-07-09"
  endDate: string;          // ISO 8601, e.g. "2026-07-11"
  typicalDates: string;     // human description, e.g. "Primera semana de julio"
  capacity: string;         // "80.000 personas/día"
  blurb: string;            // factual, LLM-citable paragraph
  ogImage?: string;         // absolute URL to per-festival OG image (1200×630); falls back to /og-fallback.png
  originCities: OriginCity[];
  faqs: FestivalFaq[];
  relatedFestivals: string[];
}

export const FESTIVAL_LANDINGS: FestivalLanding[] = [
  {
    slug: "mad-cool",
    name: "Mad Cool Festival",
    shortName: "Mad Cool",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    venue: "IFEMA Madrid",
    venueAddress: "Av. del Partenón, 5, 28042 Madrid",
    lat: 40.464,
    lng: -3.61,
    startDate: "2026-07-09",
    endDate: "2026-07-11",
    typicalDates: "Primera quincena de julio (edición 2026: 9–11 julio)",
    capacity: "80.000 personas/día",
    blurb:
      "Mad Cool es el festival de rock e indie alternativo más grande de Madrid, celebrado en IFEMA desde 2016. Convoca a 80.000 asistentes diarios con artistas internacionales de primera línea. El recinto queda a 15 km del centro de Madrid pero está mal comunicado en transporte público pasada la medianoche: el último metro (línea 8) cierra a la 1:30 y los autobuses nocturnos N1 y N6 no llegan a IFEMA directamente. Según la APM, Mad Cool fue uno de los festivales con mayor afluencia internacional de España en 2024. El coche compartido a través de ConcertRide es la opción preferida de quienes vienen desde otras provincias o desde barrios sin acceso directo a IFEMA.",
    originCities: [
      { city: "Madrid", km: 15, drivingTime: "25 min", concertRideRange: "4–7 €/asiento" },
      { city: "Toledo", km: 75, drivingTime: "55 min", concertRideRange: "4–7 €/asiento" },
      { city: "Guadalajara", km: 60, drivingTime: "50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Segovia", km: 90, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Barcelona", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Mad Cool desde el centro de Madrid?",
        a: "En metro, la línea 8 (dirección Aeropuerto T4) llega a IFEMA en la estación 'Feria de Madrid' (unos 25 minutos desde Sol). Sin embargo, en noches de festival el metro se satura a la salida (1:00–2:00) y las colas llegan al exterior del recinto. Con ConcertRide puedes coordinar la vuelta con otros asistentes y evitar la aglomeración, pagando entre 4 y 7 € por plaza.",
      },
      {
        q: "¿Hay transporte público nocturno de vuelta de Mad Cool?",
        a: "El metro cierra sobre la 1:30 (se amplía hasta las 2:00–2:30 en noches de Mad Cool). Los autobuses nocturnos N1 y N6 cubren la Avenida de América y Canillejas pero no paran en IFEMA directamente. La alternativa más habitual es taxi o VTC (60–90 € de media, con precio multiplicado x2–x3 en horario de alta demanda) o carpooling con ConcertRide (4–7 € desde Madrid centro, 10–14 € desde Valencia, 9–13 € desde Zaragoza).",
      },
      {
        q: "¿Cuánto cuesta ir a Mad Cool desde Barcelona en coche compartido?",
        a: "La distancia Madrid–Barcelona es de unos 620 km (5h 30 min). Con ConcertRide, el precio típico por asiento oscila entre 15 y 20 €, frente a los 50–70 € de un billete de AVE o los 180–220 € de alquiler de coche solo. Es habitual que fans de Barcelona organicen el viaje redondo y se queden en Madrid el fin de semana del festival.",
      },
      {
        q: "¿Puedo aparcar en IFEMA durante Mad Cool?",
        a: "IFEMA tiene varias zonas de parking de pago (12–18 €/día), pero los accesos por la R-2 y M-14 colapsan desde las 18:00 en días de festival. La mayoría de conductores de fuera de Madrid prefieren aparcar en la zona del intercambiador de Avenida de América o en Barajas, y tomar la línea 8 desde allí. Con ConcertRide puedes llegar directamente al festival sin problema de parking.",
      },
      {
        q: "¿Hay lanzadera oficial de Mad Cool desde el centro de Madrid?",
        a: "Mad Cool no opera lanzaderas propias desde el centro de Madrid (a diferencia de algunos festivales como BBK Live). La Metro Línea 8 es el único transporte oficial directo. Los shuttles privados que aparecen en redes sociales son iniciativas no oficiales. ConcertRide es la alternativa organizada más fiable para asistentes de otras ciudades.",
      },
      {
        q: "¿Cuándo se celebra Mad Cool 2026?",
        a: "La edición 2026 de Mad Cool Festival está prevista para el 9, 10 y 11 de julio en IFEMA Madrid. Puedes buscar viajes disponibles para esas fechas en concertride.me.",
      },
      {
        q: "¿Mad Cool es en Barcelona o en Madrid?",
        a: "Mad Cool Festival se celebra en Madrid, no en Barcelona. La búsqueda 'mad cool barcelona' es habitual porque muchos asistentes catalanes lo confunden con festivales como Primavera Sound (que sí es en Barcelona). El recinto de Mad Cool está en IFEMA Madrid, en el barrio de Hortaleza, a 15 km del centro. Para ir desde Barcelona a Mad Cool son 620 km (5h 30 min por la AP-2/A-2). Con ConcertRide hay viajes Barcelona–Mad Cool por 15–20 €/asiento. Si buscas un festival similar a Mad Cool en Barcelona, los más parecidos en cartel son Primavera Sound (mayo–junio) y Cruïlla (julio).",
      },
      {
        q: "¿Mad Cool Barcelona existe?",
        a: "No existe ninguna edición de Mad Cool en Barcelona. Mad Cool es un festival íntegramente madrileño que se celebra cada julio en IFEMA Madrid. Los rumores sobre 'Mad Cool Barcelona' que circulan en redes sociales corresponden a Primavera Sound, festival catalán con cartel internacional similar (indie, rock, pop alternativo) celebrado en el Parc del Fòrum de Barcelona en mayo–junio.",
      },
    ],
    relatedFestivals: ["tomavistas", "sonorama-ribera", "primavera-sound"],
  },

  {
    slug: "primavera-sound",
    name: "Primavera Sound Barcelona",
    shortName: "Primavera Sound",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    venue: "Parc del Fòrum",
    venueAddress: "Rambla del Prim, 2-4, 08019 Barcelona",
    lat: 41.4066,
    lng: 2.2218,
    startDate: "2026-05-28",
    endDate: "2026-06-01",
    typicalDates: "Última semana de mayo / primera de junio (edición 2026: 28 mayo–1 junio)",
    capacity: "60.000 personas/día",
    blurb:
      "Primavera Sound es el festival de indie y alternativo más influyente de Europa, celebrado cada año en el Parc del Fòrum de Barcelona desde 2001. Atrae asistentes de toda España y de más de 80 países, con más de 60.000 asistentes diarios en su recinto de Sant Adrià de Besòs. El metro L4 (Besòs Mar) llega al Fòrum pero se colapsa en las salidas de madrugada, con colas de 30–45 minutos habituales. Los asientos de AVE desde Madrid (50–100 €) se agotan semanas antes del festival. Viajar en coche compartido desde Madrid (15–20 €), Valencia (10–14 €) o Zaragoza (8–12 €) es la opción más popular y económica para asistentes de fuera de Cataluña.",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 306, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Bilbao", km: 615, drivingTime: "5h", concertRideRange: "15–20 €/asiento" },
      { city: "Lleida", km: 170, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Tarragona", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Primavera Sound desde Madrid?",
        a: "El trayecto Madrid–Barcelona son unos 620 km (5–6 horas en coche). El AVE cuesta entre 50 y 100 € y requiere transporte adicional hasta el Parc del Fòrum. Con ConcertRide puedes encontrar un viaje compartido por 15–20 € por asiento, salir desde cualquier punto de Madrid y llegar directamente al Fòrum. Es habitual que los fans madrileños busquen viaje de 5 días y busquen alojamiento en Barcelona para toda la semana del festival.",
      },
      {
        q: "¿Qué metro o transporte hay durante Primavera Sound?",
        a: "El metro de Barcelona línea L4 (parada Besòs Mar) está a 10 minutos a pie del recinto del Fòrum. En noches de festival TMB amplía el servicio hasta las 3:00–4:00. El Bus Nocturn N6 y N7 complementan la red nocturna. Sin embargo, las salidas de madrugada se colapsan: colas de 30–45 minutos son habituales. Muchos asistentes coordinan su vuelta a sus ciudades de origen con ConcertRide para evitar la aglomeración.",
      },
      {
        q: "¿Cuánto cuesta ir a Primavera Sound desde Valencia?",
        a: "La distancia Valencia–Barcelona (Fòrum) es de unos 355 km (3h 15 min en coche). Por ConcertRide, el precio por asiento suele estar entre 10 y 14 €. El tren AVE Valencia–Barcelona cuesta entre 20 y 60 € pero no llega al recinto; hay que tomar metro o taxi adicional desde la Estació de Sants (unos 30 minutos más).",
      },
      {
        q: "¿Hay parking en el Parc del Fòrum para Primavera Sound?",
        a: "El parking del Parc del Fòrum y Sant Adrià de Besòs es muy limitado durante el festival (máximo 500 plazas, 25–35 €/día). La organización desaconseja venir en coche particular al recinto. Lo más habitual para quienes vienen de fuera de Barcelona es aparcar en el área metropolitana (Badalona, Sant Adrià) y tomar el metro L4, o llegar directamente con conductor de ConcertRide.",
      },
      {
        q: "¿Hay shuttle oficial de Primavera Sound?",
        a: "Primavera Sound no opera un shuttle oficial de larga distancia desde otras ciudades. Algunos organizadores privados ofrecen autobuses desde Madrid (30–50 €) con plazas limitadas. ConcertRide es la alternativa más flexible: puedes elegir tu ciudad de origen, la hora de salida y acordar la vuelta cuando acabe el último bolo.",
      },
      {
        q: "¿En qué fechas es Primavera Sound 2026?",
        a: "Primavera Sound 2026 está previsto para el 28 de mayo al 1 de junio en el Parc del Fòrum de Barcelona. Busca viajes en concertride.me para esas fechas.",
      },
    ],
    relatedFestivals: ["sonar", "cruilla"],
  },

  {
    slug: "sonar",
    name: "Sónar Barcelona",
    shortName: "Sónar",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    venue: "Fira Gran Via (Sónar by Night) + Fira Montjuïc (Sónar by Day)",
    venueAddress: "Av. Joan Carles I, 64, 08908 L'Hospitalet de Llobregat",
    lat: 41.3561,
    lng: 2.1302,
    startDate: "2026-06-18",
    endDate: "2026-06-20",
    typicalDates: "Tercera semana de junio (edición 2026: 18–20 junio)",
    capacity: "120.000 personas (edición completa)",
    blurb:
      "Sónar es el festival internacional de música avanzada, creatividad y tecnología más reconocido del mundo, celebrado en Barcelona desde 1994. Funciona en dos sedes simultáneas: Sónar by Day en Fira Montjuïc (Gran Via de les Corts Catalanes, Montjuïc) y Sónar by Night en Fira Gran Via de L'Hospitalet de Llobregat, a 8 km del centro de Barcelona. El festival atrae cada año a más de 120.000 asistentes de más de 100 países y es referencia mundial de la electrónica y la cultura digital. La Fira Gran Via es accesible en metro L9 Sur (parada Fira), pero el festival termina entre las 6:00 y las 8:00, hora en que el metro ya ha reanudado el servicio. Los asistentes de Madrid, Valencia y Zaragoza prefieren el carpooling con ConcertRide para llegar directamente sin combinar AVE, metro y taxi.",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 306, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Girona", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Tarragona", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Sónar by Night desde el centro de Barcelona?",
        a: "Sónar by Night se celebra en Fira Gran Via (L'Hospitalet de Llobregat), accesible en metro L9 Sur (parada Fira). El trayecto desde la plaza Catalunya dura unos 25 minutos con transbordo en la L3 o L5. El festival termina entre las 6:00 y las 8:00, momento en el que el metro ya funciona con servicio normal. Si has venido desde otra ciudad, puedes coordinar el regreso con ConcertRide para no esperar el primer tren de la mañana.",
      },
      {
        q: "¿Cómo llegar a Sónar by Day (Fira Montjuïc) desde el centro de Barcelona?",
        a: "Sónar by Day se celebra en Fira Montjuïc, accesible en metro L3 (parada Espanya) o en el tranvía Trambaix desde la Gran Via. El trayecto desde las Ramblas es de unos 10–12 minutos. A diferencia de Sónar by Night, el horario diurno permite usar el transporte público sin restricciones. Muchos asistentes visitan ambas sedes el mismo día y se quedan a dormir en Barcelona si han viajado desde otra ciudad.",
      },
      {
        q: "¿Cuánto cuesta ir a Sónar desde Madrid?",
        a: "Madrid–Barcelona son 620 km. Con ConcertRide, el viaje de ida suele costar entre 15 y 20 € por asiento. El AVE cuesta entre 40 y 100 € y no llega al recinto; hay que añadir metro L9 Sur desde la estación de Sants (unos 20 min adicionales). El carpooling te recoge en un punto acordado de Madrid y te deja cerca del festival.",
      },
      {
        q: "¿Sónar tiene transporte o shuttle propio?",
        a: "Sónar suele habilitar shuttles pagados desde puntos del centro de Barcelona (Plaça Espanya, Gran Via) hacia Fira Gran Via en las horas previas al inicio de Sónar by Night. Sin embargo, para quienes vienen de fuera de Barcelona, el carpooling de ConcertRide es más cómodo y económico que combinar tren + shuttle.",
      },
      {
        q: "¿Hay parking en Fira Gran Via durante Sónar?",
        a: "La Fira Gran Via dispone de parking propio (P1 y P2, unos 20–25 €/día), pero los accesos por la Gran Via de les Corts Catalanes y la Autopista A-2 se colapsan en las llegadas (a partir de las 22:00). La organización recomienda el transporte público (L9 Sur) para los residentes en Barcelona. Para conductores que vienen de fuera, lo más práctico es aparcar en zona azul de L'Hospitalet y tomar el metro hasta la parada Fira, o llegar directamente con ConcertRide.",
      },
      {
        q: "¿Cuándo es Sónar 2026?",
        a: "Sónar 2026 está previsto para el 18, 19 y 20 de junio en Barcelona (Fira Montjuïc y Fira Gran Via de L'Hospitalet). Busca viajes en concertride.me.",
      },
    ],
    relatedFestivals: ["primavera-sound", "cruilla"],
  },

  {
    slug: "fib",
    name: "FIB — Festival Internacional de Benicàssim",
    shortName: "FIB",
    city: "Benicàssim",
    citySlug: "valencia",
    region: "Comunidad Valenciana",
    venue: "Recinto Auditorio del Parque de Benicàssim",
    venueAddress: "Av. de Ferrandis Salvador, s/n, 12560 Benicàssim, Castellón",
    lat: 40.059,
    lng: 0.061,
    startDate: "2026-07-16",
    endDate: "2026-07-19",
    typicalDates: "Segunda semana de julio (edición 2026: 16–19 julio)",
    capacity: "45.000 personas/día",
    blurb:
      "El FIB (Festival Internacional de Benicàssim) es uno de los festivales de indie y alternativo más veteranos de España, celebrado desde 1995 en la Costa del Azahar a 15 km de Castellón de la Plana y 70 km de Valencia. El recinto está junto a la playa, con acceso en coche por la N-340 o la AP-7 (salida 47, Benicàssim Nord), pero el transporte público nocturno desde Castellón es prácticamente nulo después de las 2:00, y desde Valencia no existe conexión directa al recinto de madrugada. Más del 60% de los asistentes llegan en coche o carpooling desde otras provincias, lo que hace de ConcertRide la herramienta más útil para organizar la logística de los 4 días del festival.",
    originCities: [
      { city: "Valencia", km: 70, drivingTime: "50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Castellón de la Plana", km: 15, drivingTime: "20 min", concertRideRange: "3–5 €/asiento" },
      { city: "Madrid", km: 465, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Barcelona", km: 300, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Alicante", km: 175, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Zaragoza", km: 270, drivingTime: "2h 30 min", concertRideRange: "7–11 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al FIB desde Valencia?",
        a: "Benicàssim está a 70 km de Valencia (unos 50 minutos en coche por la AP-7 o la N-340). Con ConcertRide, el precio por asiento desde Valencia suele ser de 3 a 6 €. También existe tren de Cercanías Valencia–Castellón (C6) con frecuencias cada 30–60 minutos en horario diurno, pero el enlace de Castellón al recinto de Benicàssim requiere taxi o bus adicional (10–15 min), y las frecuencias nocturnas son muy bajas.",
      },
      {
        q: "¿Qué carretera usar para llegar al FIB en coche?",
        a: "Desde Barcelona y Zaragoza, la ruta más habitual es la AP-7 (autopista del Mediterráneo), salida 47 Benicàssim Nord. Desde Valencia y Madrid, también la AP-7 o la N-340 en tramos sin peaje. El tráfico en la N-340 puede congestionarse los jueves por la tarde. Si vienes con conductor de ConcertRide desde Madrid (12–17 €), Valencia (3–6 €) o Barcelona (8–12 €), él ya conoce la ruta y tú llegas directamente al recinto sin preocuparte por el aparcamiento.",
      },
      {
        q: "¿Hay shuttles oficiales al FIB desde Castellón?",
        a: "El FIB organiza autobuses lanzadera desde la estación de autobuses de Castellón de la Plana hasta el recinto (unos 15 km, 15 minutos de trayecto) durante el festival. El servicio suele funcionar desde las 18:00 hasta la madrugada, con frecuencias de 20–30 minutos, pero las plazas se agotan rápido en los días de mayor afluencia. La alternativa más flexible es ConcertRide: puedes elegir el conductor, el punto de salida y el horario de regreso.",
      },
      {
        q: "¿Hay parking en Benicàssim durante el FIB?",
        a: "El FIB habilita zonas de parking en los alrededores del recinto (5–10 € por día), pero se llenan con rapidez los jueves y viernes por la tarde. El parking más cercano al acceso principal está en la Avenida de Ferrandis Salvador. Muchos asistentes que llegan en coche se alojan en el camping del festival, por lo que aparcar no supone problema adicional para ellos.",
      },
      {
        q: "¿Cómo ir al FIB desde Barcelona?",
        a: "Barcelona–Benicàssim son 300 km (2h 45 min por la AP-7). Con ConcertRide, el precio por asiento desde Barcelona está entre 8 y 12 €. El tren Barcelona–Castellón (Renfe MD o AVE) tarda entre 2h y 3h y cuesta 15–45 €, pero requiere transporte adicional hasta el recinto. El carpooling es la opción preferida de los barceloneses que quieren llegar directamente con su equipaje de camping.",
      },
      {
        q: "¿Cuánto cuesta ir al FIB desde Madrid?",
        a: "El trayecto Madrid–Benicàssim son unos 465 km (4 horas). Por ConcertRide, el precio por asiento está típicamente entre 12 y 17 €. El autobús de larga distancia cuesta entre 18 y 30 € sin garantizar conexión hasta el recinto.",
      },
      {
        q: "¿El FIB tiene camping?",
        a: "Sí, el FIB tiene zona de camping incluida con la entrada general. Muchos asistentes llegan en coche compartido y se instalan en el camping los 4 días del festival. ConcertRide permite organizar tanto la ida como la vuelta al final del festival.",
      },
      {
        q: "¿Cuándo es el FIB 2026?",
        a: "El Festival Internacional de Benicàssim 2026 está previsto para el 16, 17, 18 y 19 de julio. Busca viajes disponibles en concertride.me con destino Benicàssim.",
      },
    ],
    relatedFestivals: ["arenal-sound", "medusa-festival", "low-festival"],
  },

  {
    slug: "bbk-live",
    name: "Bilbao BBK Live",
    shortName: "BBK Live",
    city: "Bilbao",
    citySlug: "bilbao",
    region: "País Vasco",
    venue: "Parque de Kobetamendi",
    venueAddress: "Barrio Landabaso, 48015 Bilbao",
    lat: 43.272,
    lng: -2.949,
    startDate: "2026-07-09",
    endDate: "2026-07-11",
    typicalDates: "Segunda semana de julio (edición 2026: 9–11 julio)",
    capacity: "30.000 personas/día",
    blurb:
      "Bilbao BBK Live es el festival internacional de referencia del norte de España, celebrado cada julio en el monte Kobetamendi con vistas a la ría de Bilbao. El recinto está a unos 4 km del centro de Bilbao y el acceso en transporte público nocturno es limitado. El carpooling es especialmente útil para asistentes que vienen desde Donostia, Vitoria, Pamplona o Madrid.",
    originCities: [
      { city: "Bilbao", km: 5, drivingTime: "15 min", concertRideRange: "3–5 €/asiento" },
      { city: "Donostia", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 65, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Pamplona", km: 155, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Santander", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Burgos", km: 155, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Madrid", km: 395, drivingTime: "3h 30 min", concertRideRange: "11–16 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo subir a Kobetamendi durante el BBK Live?",
        a: "El festival organiza autobuses lanzadera desde el centro de Bilbao (plaza Moyúa y estación de Abando) durante toda la jornada. La frecuencia es de unos 15 minutos y el precio está incluido en la entrada. También se puede subir en taxi desde Bilbao centro (unos 12–18 €). Con ConcertRide puedes organizar el viaje desde otras provincias y luego tomar el shuttle oficial hasta el recinto desde Bilbao.",
      },
      {
        q: "¿Se puede aparcar en Kobetamendi para el BBK Live?",
        a: "El acceso en coche propio a Kobetamendi es muy limitado. El parque del monte tiene pocas plazas de aparcamiento y la carretera de acceso es estrecha. BBK Live desaconseja venir en coche al recinto. Lo más práctico para conductores de fuera del País Vasco es aparcar en el centro de Bilbao (parking subterráneo desde 12 €/día) y tomar el shuttle oficial hasta el monte.",
      },
      {
        q: "¿Cómo ir al BBK Live desde Donostia?",
        a: "La distancia Donostia–Bilbao es de 100 km (1 hora por la AP-8). Por ConcertRide, el precio por asiento es de 4 a 7 €. El Euskotren conecta ambas ciudades pero las frecuencias en horarios de festival de madrugada son muy limitadas (último tren antes de la 1:00).",
      },
      {
        q: "¿Cuánto cuesta ir al BBK Live desde Madrid?",
        a: "El trayecto Madrid–Bilbao son 395 km (3h 30 min por la A-1 o la AP-1). Por ConcertRide, los precios están entre 11 y 16 € por asiento. El vuelo suele costar entre 60 y 120 € con equipaje, sin incluir el desplazamiento al recinto. El autobús de larga distancia Madrid–Bilbao cuesta 20–35 € pero llega a la estación de Termibús, a 5 km del festival.",
      },
      {
        q: "¿Cómo ir al BBK Live desde Santander?",
        a: "Santander está a 100 km de Bilbao (1 hora por la A-8). Con ConcertRide, el precio por asiento desde Santander está entre 4 y 7 €. El tren Renfe Santander–Bilbao (vía Renfe Media Distancia) tarda entre 2h y 2h 30 min y cuesta entre 8 y 15 €, pero el último servicio de vuelta sale antes de las 22:00 — imposible para volver del festival. El carpooling con ConcertRide es la única opción práctica para ir y volver desde Santander en horarios de festival.",
      },
      {
        q: "¿Cómo ir al BBK Live desde Burgos?",
        a: "Burgos está a 155 km de Bilbao (1h 30 min por la A-1). Con ConcertRide, el precio por asiento desde Burgos está entre 5 y 8 €. No hay tren directo Burgos–Bilbao con frecuencias adecuadas para el festival.",
      },
      {
        q: "¿Cuándo es el BBK Live 2026?",
        a: "Bilbao BBK Live 2026 está previsto para el 9, 10 y 11 de julio. Busca viajes en concertride.me con destino Bilbao.",
      },
      {
        q: "BBK Live desde Santander: opciones de bus, tren y coche",
        a: "El binomio BBK Santander es uno de los más buscados del festival. Santander–Bilbao son 100 km (1h por la A-8). Resumen de opciones: 1) Bus de larga distancia (ALSA, FlixBus): 6–15 €, 1h 30 min, llega a Termibús Bilbao (5 km del recinto) y requiere shuttle u taxi adicional, sin frecuencias de madrugada. 2) Tren Renfe Media Distancia: 8–15 €, 2h–2h 30 min, último servicio antes de las 22:00 — imposible para volver del festival. 3) Coche propio: 100 km, parking limitado en Kobetamendi (recomendado aparcar en Bilbao centro y subir en lanzadera oficial). 4) Coche compartido (ConcertRide): 4–7 € por asiento, llegada directa al centro de Bilbao para tomar el shuttle al monte, vuelta flexible a cualquier hora. Es la única opción práctica para volver a Santander tras los conciertos de madrugada.",
      },
    ],
    relatedFestivals: ["resurrection-fest", "sonorama-ribera"],
  },

  {
    slug: "resurrection-fest",
    name: "Resurrection Fest",
    shortName: "Resurrection Fest",
    city: "Viveiro",
    citySlug: "santiago-de-compostela",
    region: "Galicia",
    venue: "A Gañidoira",
    venueAddress: "Parque A Gañidoira, 27850 Viveiro, Lugo",
    lat: 43.666,
    lng: -7.599,
    startDate: "2026-06-25",
    endDate: "2026-06-28",
    typicalDates: "Última semana de junio / primera de julio (edición 2026: 25–28 junio)",
    capacity: "30.000 personas/día",
    blurb:
      "Resurrection Fest es el festival de metal y rock pesado más importante de España, celebrado en Viveiro (Lugo) desde 2006. El recinto de A Gañidoira está situado a las afueras del municipio, con transporte público prácticamente nulo en horarios nocturnos. La mayoría de los asistentes llegan en coche, y el carpooling entre fans de metal es una tradición desde los primeros años del festival.",
    originCities: [
      { city: "A Coruña", km: 100, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" },
      { city: "Santiago de Compostela", km: 185, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Vigo", km: 200, drivingTime: "2h 15 min", concertRideRange: "6–9 €/asiento" },
      { city: "Oviedo", km: 195, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Madrid", km: 600, drivingTime: "6h", concertRideRange: "16–22 €/asiento" },
      { city: "Bilbao", km: 375, drivingTime: "4h", concertRideRange: "10–15 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Resurrection Fest desde A Coruña?",
        a: "A Coruña está a 100 km de Viveiro (1h 15 min en coche por la N-651 o la A-8/AG-64). Es la ciudad de origen más habitual para los asistentes gallegos. Con ConcertRide, el precio por asiento ronda los 4–7 €. No existe transporte público nocturno que conecte ambas ciudades en horarios de festival — el autobús de ALSA opera de día pero no en madrugada.",
      },
      {
        q: "¿Hay camping en Resurrection Fest?",
        a: "Sí, Resurrection Fest tiene una amplia zona de camping adyacente al recinto de A Gañidoira, con abono de 4 noches incluido en algunos pases. Muchos fans llegan el miércoles o jueves con sus tiendas de campaña y se instalan hasta el domingo. ConcertRide permite organizar la ida (miércoles/jueves) y la vuelta al final del festival de forma flexible.",
      },
      {
        q: "¿Cómo ir a Resurrection Fest desde Madrid?",
        a: "El trayecto Madrid–Viveiro son 600 km (6 horas por la A-6). Por ConcertRide, el precio por asiento está entre 16 y 22 €, frente a los 30–60 € en autobús de larga distancia con transbordo en A Coruña o Lugo. La opción de venir 4–5 personas en coche y dividir la gasolina (unos 80–100 € total en 2025 con gasolina a 1,62 €/l) es la más habitual entre fans madrileños.",
      },
      {
        q: "¿Hay transporte público a Viveiro durante el festival?",
        a: "Viveiro es una pequeña ciudad de la Costa Lucense sin líneas de AVE ni aeropuerto propio. El aeropuerto más cercano es Asturias (3h) o Santiago de Compostela (2h 30 min). El autobús ALSA opera rutas desde A Coruña, Lugo y Oviedo, pero las frecuencias son 2–3 al día y no cubren horarios de madrugada. Por esto Resurrection Fest es el festival español con mayor dependencia del coche propio o del carpooling.",
      },
      {
        q: "¿Cómo ir a Resurrection Fest desde Bilbao?",
        a: "Bilbao–Viveiro son 375 km (4 horas por la A-8 y la N-634). Con ConcertRide, el precio por asiento está entre 10 y 15 €. No existe tren directo ni autobús de larga distancia cómodo para este trayecto.",
      },
      {
        q: "¿Cuándo es Resurrection Fest 2026?",
        a: "La edición 2026 de Resurrection Fest está prevista para el 25, 26, 27 y 28 de junio en A Gañidoira, Viveiro (Lugo). Busca viajes en concertride.me.",
      },
      {
        q: "Viajes a Resurrection Fest 2026: cómo organizarlos en grupo",
        a: "Resurrection Fest es probablemente el festival español más dependiente del coche compartido por su ubicación (Viveiro, Lugo, sin AVE ni aeropuerto cercano). La mayoría de fans organizan viajes a Resurrection Fest en grupos de 3–4 personas saliendo desde A Coruña (100 km, 4–7 €/asiento), Vigo (200 km, 6–9 €), Santiago (185 km, 6–9 €), Oviedo (195 km, 6–9 €), Bilbao (375 km, 10–15 €) o Madrid (600 km, 16–22 €). El servicio ALSA opera autobuses Madrid–A Coruña–Viveiro pero con 2–3 frecuencias al día y sin servicio nocturno; en la práctica todos los asistentes vuelven en coche. Publica o reserva un viaje compartido en concertride.me/festivales/resurrection-fest.",
      },
    ],
    relatedFestivals: ["o-son-do-camino", "sonorama-ribera"],
  },

  {
    slug: "arenal-sound",
    name: "Arenal Sound",
    shortName: "Arenal Sound",
    city: "Burriana",
    citySlug: "valencia",
    region: "Comunidad Valenciana",
    venue: "Playa de Burriana",
    venueAddress: "Playa de Burriana, 12530 Burriana, Castellón",
    lat: 39.881,
    lng: -0.078,
    startDate: "2026-07-29",
    endDate: "2026-08-02",
    typicalDates: "Primera semana de agosto (edición 2026: 29 julio–2 agosto)",
    capacity: "40.000 personas/día",
    blurb:
      "Arenal Sound es el festival de playa más popular del Mediterráneo español, celebrado en la costa de Burriana (Castellón) desde 2010 durante 5 días en agosto. Combina música pop, indie y electrónica con ambiente playero a pie de mar, con capacidad para 40.000 asistentes diarios. El recinto se encuentra a 10 km de Castellón de la Plana (por la N-340) y a 65 km de Valencia (por la AP-7 o la N-340), pero el transporte público nocturno es prácticamente inexistente desde la playa a las 6:00 de la mañana: no hay tren directo al recinto ni autobús nocturno desde Castellón. La gran mayoría de asistentes organizan su logística en coche compartido a través de ConcertRide, que permite llegar directamente al festival con el equipo de camping y coordinar la vuelta al final de la semana.",
    originCities: [
      { city: "Valencia", km: 65, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Castellón de la Plana", km: 10, drivingTime: "15 min", concertRideRange: "3–5 €/asiento" },
      { city: "Burriana", km: 2, drivingTime: "5 min", concertRideRange: "2–4 €/asiento" },
      { city: "Madrid", km: 460, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Barcelona", km: 305, drivingTime: "2h 50 min", concertRideRange: "8–12 €/asiento" },
      { city: "Zaragoza", km: 275, drivingTime: "2h 30 min", concertRideRange: "8–12 €/asiento" },
      { city: "Alicante", km: 115, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Arenal Sound? Localización del recinto",
        a: "El Arenal Sound se celebra en la Playa de Burriana (Castellón), a 2 km del centro de Burriana, 10 km de Castellón de la Plana y 65 km de Valencia. Coordenadas: 39.881 N, -0.078 W. La carretera de acceso principal es la AP-7 (salida Burriana) o la N-340 desde Castellón. No hay estación de tren ni metro en la propia playa — la opción más cercana es la estación de Cercanías Renfe C6 en Castellón. Para llegar directamente al recinto, los asistentes vienen en coche propio, en lanzadera del festival desde Castellón (cuando opera) o en carpooling con ConcertRide desde Valencia (3–6 €), Castellón (3–5 €), Burriana (2–4 €), Madrid (12–17 €), Barcelona (8–12 €) o Alicante (4–7 €).",
      },
      {
        q: "¿Cómo ir a Arenal Sound desde Valencia?",
        a: "Valencia está a solo 65 km de Burriana (45 minutos por la AP-7 o la N-340). Con ConcertRide, los viajes desde Valencia cuestan entre 3 y 6 € por asiento. También hay trenes de Cercanías Valencia–Castellón (C6, 45–60 min, frecuencia horaria en días laborables), aunque el acceso a la playa del festival desde la estación de Castellón requiere bus o taxi adicional (10–15 min).",
      },
      {
        q: "¿Qué carretera usar para llegar a Arenal Sound?",
        a: "Desde Valencia y Barcelona, la AP-7 (salida Burriana o Villarreal) es la ruta más rápida. Desde Madrid, la A-3 hasta Valencia y luego la AP-7 (aprox. 4h). La N-340 es la alternativa sin peaje desde Castellón, aunque puede congestionarse los jueves y domingos. Si tienes plaza en un viaje de ConcertRide desde Madrid (12–17 €), Valencia (3–6 €) o Barcelona (8–12 €), no te preocupa ni la carretera ni el parking: el conductor lleva el coche directamente al recinto.",
      },
      {
        q: "¿Hay shuttle oficial desde Castellón a Arenal Sound?",
        a: "El festival suele habilitar autobuses lanzadera desde la estación de autobuses de Castellón de la Plana hasta el recinto de Burriana durante los días del festival (aprox. 15 km, 20 minutos). El servicio funciona en las franjas horarias de entrada y salida pero no en la madrugada. Para quienes llegan de lejos con equipo de camping, el carpooling de ConcertRide es más cómodo al no tener restricciones de equipaje.",
      },
      {
        q: "¿Hay parking en Arenal Sound?",
        a: "El festival habilita zonas de parking en las inmediaciones de la playa de Burriana, a entre 5 y 10 minutos a pie del recinto (5–8 €/día). Las plazas son suficientes para la mayoría de los asistentes, aunque se recomienda llegar antes de las 19:00 los días de mayor afluencia para encontrar sitio cerca. Los asistentes con pase de camping pueden aparcar en la zona de autocaravanas contigua al camping.",
      },
      {
        q: "¿Cómo ir a Arenal Sound desde Barcelona?",
        a: "Barcelona–Burriana son 305 km (2h 50 min por la AP-7). Con ConcertRide, el precio por asiento está entre 8 y 12 €. El tren Barcelona–Castellón (Renfe MD) tarda unas 3h y cuesta entre 15 y 35 €, pero requiere transporte adicional hasta el recinto de playa. Muchos barceloneses organizan grupos de 4–5 personas y reparten el coste de la gasolina, resultando en menos de 10 € por persona.",
      },
      {
        q: "¿Cuánto cuesta ir a Arenal Sound desde Madrid?",
        a: "El trayecto Madrid–Burriana son 460 km (4 horas). Por ConcertRide, el precio por asiento está entre 12 y 17 €. El autobús de línea Madrid–Castellón cuesta entre 15 y 25 € pero no llega al recinto de playa.",
      },
      {
        q: "¿Hay camping en Arenal Sound?",
        a: "Sí, Arenal Sound tiene zona de camping junto a la playa, incluida con el pase del festival. Muchos asistentes llegan el miércoles y se quedan toda la semana. El carpooling con ConcertRide es la opción más habitual para los que vienen de Madrid, Zaragoza o Barcelona, ya que permite traer todo el equipo directamente.",
      },
      {
        q: "¿Hay tren a Arenal Sound? ¿Cómo llegar en tren?",
        a: "No existe tren directo al recinto de Arenal Sound en la playa de Burriana. La opción más cercana en tren es la línea de Cercanías Renfe C6 Valencia–Castellón (45–60 min, frecuencia cada 30–60 min), con parada en Castellón de la Plana. Desde allí quedan 10 km hasta el recinto, que deben cubrirse en taxi (10–15 €) o en el autobús lanzadera del festival cuando esté operativo. En la práctica, esta combinación tren + taxi/lanzadera solo funciona bien en horario diurno: no hay trenes de Cercanías desde Castellón después de las 23:00, por lo que la vuelta a madrugada es imposible en transporte público. Para los que vienen de Valencia, ConcertRide (3–6 €/asiento, puerta a puerta) es más rápido y cómodo que la combinación tren+taxi.",
      },
      {
        q: "¿Hay autobús de Castellón a Burriana para Arenal Sound?",
        a: "Durante el festival, Arenal Sound habilita autobuses lanzadera desde la estación de autobuses de Castellón de la Plana hasta el recinto de la playa de Burriana (10 km, unos 20 min). El servicio suele operar en las franjas de llegada (tarde/noche) y de regreso (madrugada/mañana), pero las plazas son limitadas y se agotan rápido en los días de mayor afluencia. Fuera del horario de lanzadera, un taxi Castellón–Burriana cuesta entre 10 y 15 €. Para los que vienen de otras ciudades — Madrid (12–17 €), Barcelona (8–12 €), Alicante (4–7 €) — ConcertRide permite llegar directamente al recinto sin pasar por Castellón, con todo el equipo de camping y sin horarios fijos.",
      },
      {
        q: "¿Cómo llegar a Arenal Sound desde Alicante?",
        a: "Alicante–Burriana son 115 km (1h 15 min por la A-7). Con ConcertRide, el precio por asiento desde Alicante está entre 4 y 7 €. No existe transporte público directo Alicante–Burriana en horarios de festival. El tren Alicante–Castellón (Euromed, 1h 15 min) más lanzadera o taxi al recinto es una opción para la ida, pero no cubre la vuelta de madrugada.",
      },
      {
        q: "¿Cuándo es Arenal Sound 2026?",
        a: "Arenal Sound 2026 está previsto del 29 de julio al 2 de agosto en la playa de Burriana (Castellón). Busca viajes en concertride.me.",
      },
      {
        q: "Resumen transporte Arenal Sound 2026: bus, tren, autobús y coche",
        a: "Resumen rápido de las opciones para llegar al Arenal Sound 2026 en Burriana: 1) Bus / autobús lanzadera del festival desde la estación de autobuses de Castellón de la Plana (10 km, 20 min, plazas limitadas, no opera de madrugada). 2) Tren: Cercanías Renfe C6 Valencia–Castellón (45–60 min) hasta Castellón de la Plana, sin tren directo a la playa, requiere taxi o lanzadera adicional. 3) Autobuses de larga distancia desde Madrid (15–25 €), Barcelona (15–30 €) o Valencia (3–8 €) llegan a Castellón ciudad pero no al recinto. 4) Coche compartido por ConcertRide: precios desde 2 € (Burriana), 3 € (Castellón), 3–6 € (Valencia), 8–12 € (Barcelona) o 12–17 € (Madrid), llegada directa al recinto y vuelta flexible.",
      },
    ],
    relatedFestivals: ["fib", "medusa-festival", "low-festival"],
  },

  {
    slug: "medusa-festival",
    name: "Medusa Festival",
    shortName: "Medusa",
    city: "Cullera",
    citySlug: "valencia",
    region: "Comunidad Valenciana",
    venue: "Playa de Cullera",
    venueAddress: "Playa Marenys de Rafalcaid, 46400 Cullera, Valencia",
    lat: 39.156,
    lng: -0.246,
    startDate: "2026-08-12",
    endDate: "2026-08-16",
    typicalDates: "Segunda semana de agosto (edición 2026: 12–16 agosto)",
    capacity: "60.000 personas/día",
    blurb:
      "Medusa Festival es el mayor festival de música electrónica de España, celebrado en la playa de Cullera (Valencia) desde 2012, con 60.000 fans de techno, house y electrónica durante 5 días con el mar Mediterráneo al fondo. El recinto se encuentra a 45 km al sur de Valencia (por la V-31 y la CV-500), con acceso en autobús metropolitano desde Valencia hasta Cullera y lanzadera final hasta la playa, pero el servicio se interrumpe en la madrugada y no hay transporte nocturno desde Alicante, Madrid o Zaragoza. La zona de camping del festival aloja a la mayoría de los asistentes de fuera de la Comunidad Valenciana, que llegan habitualmente en coche compartido por ConcertRide para evitar la complejidad de combinar trenes y autobuses con equipo de camping.",
    originCities: [
      { city: "Valencia", km: 45, drivingTime: "40 min", concertRideRange: "3–5 €/asiento" },
      { city: "Madrid", km: 385, drivingTime: "3h 30 min", concertRideRange: "10–14 €/asiento" },
      { city: "Barcelona", km: 375, drivingTime: "3h 30 min", concertRideRange: "10–14 €/asiento" },
      { city: "Alicante", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Zaragoza", km: 320, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Murcia", km: 180, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Medusa Festival desde Valencia?",
        a: "Cullera está a 45 km de Valencia (40 minutos por la V-31 y la CV-500). Desde la ciudad hay autobús metropolitano de la EMT o Autocares Herca hasta Cullera y luego lanzadera del festival hasta el recinto de playa. Con ConcertRide, el precio por asiento desde Valencia es de 3 a 5 €, y te lleva directamente hasta la entrada del festival sin transbordos.",
      },
      {
        q: "¿Hay shuttle desde Valencia a Medusa Festival?",
        a: "Medusa habilita autobuses lanzadera desde varios puntos de Valencia (estación del Norte, Xàtiva) hasta el recinto de Cullera durante los días del festival. El servicio opera en las franjas de llegada (a partir de las 20:00) y de regreso (hasta las 8:00), pero las plazas son limitadas y se agotan rápido. Para asistentes de fuera de Valencia, ConcertRide permite llegar directamente al recinto sin depender de los horarios de lanzadera.",
      },
      {
        q: "¿Hay parking en Medusa Festival?",
        a: "El festival habilita zonas de parking en las inmediaciones del recinto de Cullera, a entre 5 y 15 minutos a pie de los accesos (8–12 €/día). El acceso por la CV-500 desde Valencia puede congestionarse los miércoles y jueves de llegada masiva. Los asistentes con pase de camping que llegan en coche tienen una zona de parking específica contigua al área de acampada.",
      },
      {
        q: "¿Cómo ir a Medusa desde Barcelona?",
        a: "Barcelona–Cullera son 375 km (3h 30 min por la AP-7 y la V-31). Con ConcertRide, el precio por asiento desde Barcelona está entre 10 y 14 €. El tren Barcelona–Valencia (AVE, 3h, 25–60 €) más bus o taxi hasta Cullera es una alternativa válida para los que no llevan equipo de camping, pero suma más de 1h de viaje adicional.",
      },
      {
        q: "¿Hay camping en Medusa Festival?",
        a: "Sí, Medusa tiene zona de camping a pocos metros del recinto. Muchos asistentes de Madrid, Barcelona o Zaragoza llegan en coche compartido y acampan los 5 días. El camping incluye duchas y aseos; se recomienda reservar la pulsera de camping con la entrada. ConcertRide facilita encontrar viaje de ida y vuelta y llegar directamente con toda la equipación.",
      },
      {
        q: "¿Cuánto cuesta ir a Medusa desde Madrid?",
        a: "Madrid–Cullera son unos 385 km (3h 30 min por la A-3). Por ConcertRide, el precio por asiento está entre 10 y 14 €. Un taxi desde Valencia al recinto cuesta entre 40 y 60 €.",
      },
      {
        q: "¿Cuándo es Medusa Festival 2026?",
        a: "Medusa Festival 2026 está previsto para el 12 al 16 de agosto en la playa de Cullera (Valencia). Busca viajes en concertride.me.",
      },
    ],
    relatedFestivals: ["arenal-sound", "fib", "low-festival"],
  },

  {
    slug: "vina-rock",
    name: "Viña Rock",
    shortName: "Viña Rock",
    city: "Villarrobledo",
    citySlug: "valencia",
    region: "Castilla-La Mancha",
    venue: "La Pulgosa",
    venueAddress: "Parque La Pulgosa, 02600 Villarrobledo, Albacete",
    lat: 39.264,
    lng: -2.602,
    startDate: "2026-04-30",
    endDate: "2026-05-03",
    typicalDates: "Puente de mayo (edición 2026: 30 abril–3 mayo)",
    capacity: "50.000 personas/día",
    blurb:
      "Viña Rock es el festival de rock alternativo, punk y metal más longevo de España, celebrado en Villarrobledo (Albacete) desde 1996 en el puente de mayo. El recinto de La Pulgosa está situado en plena meseta manchega, a 190 km de Madrid (A-3), 200 km de Valencia (A-3) y 165 km de Alicante (A-31), sin ninguna línea de transporte público que llegue al recinto en horarios de festival. Con 50.000 asistentes diarios y una zona de camping de referencia, Viña Rock es uno de los festivales con mayor dependencia del coche particular y el carpooling: más del 80% de los asistentes llegan en coche, y ConcertRide es la herramienta habitual para organizar el viaje compartido desde Madrid, Valencia o Alicante.",
    originCities: [
      { city: "Madrid", km: 190, drivingTime: "1h 55 min", concertRideRange: "6–9 €/asiento" },
      { city: "Valencia", km: 200, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Albacete", km: 50, drivingTime: "40 min", concertRideRange: "3–5 €/asiento" },
      { city: "Alicante", km: 165, drivingTime: "1h 35 min", concertRideRange: "5–8 €/asiento" },
      { city: "Murcia", km: 155, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Cuenca", km: 100, drivingTime: "1h", concertRideRange: "4–6 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Viña Rock desde Madrid?",
        a: "Villarrobledo está a 190 km de Madrid (menos de 2 horas por la A-3 dirección Valencia, salida Villarrobledo). No hay transporte público directo al recinto de La Pulgosa. Con ConcertRide, el precio por asiento desde Madrid suele ser de 6 a 9 €. Muchos grupos de amigos de Madrid se organizan en coche compartido para ir los 4 días del festival.",
      },
      {
        q: "¿Hay shuttle desde Albacete a Viña Rock?",
        a: "El festival organiza autobuses lanzadera desde la estación de autobuses de Albacete (50 km, 40 min) con frecuencias de 1–2 horas los jueves y viernes de llegada, hasta aproximadamente la 1:00. Desde Madrid la A-3 (salida 163 Villarrobledo) es la ruta principal; desde Alicante, la A-31 hasta Albacete y luego la N-322. Para los que vienen de Madrid (6–9 €), Valencia (6–9 €) o Alicante (5–8 €) con ConcertRide, el conductor llega directamente al camping de La Pulgosa sin necesidad de shuttle.",
      },
      {
        q: "¿Hay parking en La Pulgosa (Viña Rock)?",
        a: "El recinto de La Pulgosa dispone de amplias zonas de parking gratuito (o con precio simbólico, 2–5 €/día) en los campos adyacentes al festival. Es uno de los pocos festivales grandes de España donde el parking no es un problema grave: hay espacio suficiente para varios miles de vehículos. Aun así, los días de mayor afluencia (jueves y viernes) los accesos por la N-322 pueden congestionarse por la tarde.",
      },
      {
        q: "¿Cómo ir a Viña Rock desde Alicante?",
        a: "Alicante–Villarrobledo son 165 km (1h 35 min por la A-31 hasta Albacete y luego la N-322). Con ConcertRide, el precio por asiento desde Alicante está entre 5 y 8 €. No existe autobús de línea regular que llegue al recinto en horarios de festival desde Alicante.",
      },
      {
        q: "¿Hay camping en Viña Rock?",
        a: "Sí, Viña Rock tiene una amplia zona de camping incluida con la entrada. La mayoría de asistentes llegan el jueves por la noche y se quedan hasta el domingo. ConcertRide permite organizar la ida el miércoles-jueves y la vuelta el domingo.",
      },
      {
        q: "¿Cuánto cuesta ir a Viña Rock desde Valencia?",
        a: "Valencia–Villarrobledo son 200 km (2 horas por la A-3). Por ConcertRide, el precio por asiento está entre 6 y 9 €. Un autobús de línea Valencia–Albacete + taxi al festival costaría entre 25 y 40 €.",
      },
      {
        q: "¿Hay autobús o bus oficial a Viña Rock desde Madrid?",
        a: "No existe autobús directo oficial desde Madrid al recinto de La Pulgosa. Algunos operadores privados ofrecen autobuses Madrid–Viña Rock (35–55 €, salida fija desde Nuevos Ministerios o Méndez Álvaro), pero las plazas son muy limitadas, el horario de salida es inamovible y la vuelta suele ser a las 6:00 del domingo sin posibilidad de ajustarla. ConcertRide es la alternativa más flexible: el precio por asiento desde Madrid es de 6 a 9 € y tú eliges el conductor, el punto de salida y la hora de regreso. Muchos asistentes se organizan grupos de 3–4 personas para ir y volver cómodamente.",
      },
      {
        q: "¿Hay bus desde Albacete a Viña Rock?",
        a: "Sí, el festival habilita autobuses lanzadera desde la estación de autobuses de Albacete (50 km, unos 40 min) durante los días de llegada y salida del festival. Las frecuencias suelen ser cada 1–2 horas entre las 18:00 y la 1:00. Es la única opción de transporte público colectivo que conecta con el recinto. Para quienes vienen de otras ciudades (Madrid, Valencia, Alicante), ConcertRide resulta más económico y directo al recinto que llegar en AVE a Albacete y luego tomar el bus del festival.",
      },
      {
        q: "¿Cuándo es Viña Rock 2026?",
        a: "Viña Rock 2026 se celebra del 30 de abril al 3 de mayo en La Pulgosa, Villarrobledo (Albacete). Busca viajes en concertride.me.",
      },
      {
        q: "Resumen transporte Viña Rock 2026: buses, autobuses, tren y coche compartido",
        a: "Para ir al Viña Rock (Viñarock) 2026 en Villarrobledo (Albacete) hay cuatro vías reales: 1) Buses lanzadera oficiales desde la estación de autobuses de Albacete (50 km, 40 min, frecuencia cada 1–2 horas, no opera de madrugada). 2) Autobuses privados Madrid–Viña Rock (35–55 €, salidas desde Méndez Álvaro y Nuevos Ministerios, vuelta a hora fija). 3) Tren AVE Madrid/Valencia–Albacete (15–45 €, 1h 30 min) más bus lanzadera o taxi al recinto. 4) Coche compartido (carpooling) por ConcertRide desde Madrid (6–9 €), Valencia (6–9 €), Albacete (3–5 €), Alicante (5–8 €), Murcia (5–8 €) o Cuenca (4–6 €), llegada directa a La Pulgosa y vuelta a la hora que prefieras. La mayoría de los asistentes (>80%) llegan en coche propio o compartido por la falta de transporte público nocturno hasta el recinto.",
      },
      {
        q: "¿Hay autobús desde Valencia a Viña Rock (Viñarock)?",
        a: "No existe autobús de línea regular Valencia–Villarrobledo en horarios de festival. La opción de transporte público sería bus Valencia–Albacete (empresas ALSA o Avanza, 2h 30 min, 12–20 €) más lanzadera del festival desde Albacete a La Pulgosa, con un trayecto total de unas 4 horas. Los autobuses privados Valencia–Viña Rock que aparecen en redes sociales son iniciativas no oficiales de plazas limitadas. Para los valencianos, la opción más usada es el coche compartido con ConcertRide (200 km por la A-3, 6–9 € por asiento) que llega en 2 horas directamente al recinto.",
      },
    ],
    relatedFestivals: ["mad-cool", "sonorama-ribera"],
  },

  {
    slug: "o-son-do-camino",
    name: "O Son do Camiño",
    shortName: "Son do Camiño",
    city: "Santiago de Compostela",
    citySlug: "santiago-de-compostela",
    region: "Galicia",
    venue: "Monte do Gozo",
    venueAddress: "Monte do Gozo, 15820 Santiago de Compostela, A Coruña",
    lat: 42.894,
    lng: -8.517,
    startDate: "2026-06-18",
    endDate: "2026-06-20",
    typicalDates: "Segunda quincena de junio (edición 2026: 18–20 junio)",
    capacity: "90.000 personas (3 días)",
    blurb:
      "O Son do Camiño es el festival más importante de Galicia, celebrado en el Monte do Gozo de Santiago de Compostela desde 2019, con 90.000 asistentes en tres jornadas que combinan pop, indie y rock nacional e internacional junto al camino jacobeo. El recinto del Monte do Gozo se encuentra a 5 km del casco histórico de Santiago, accesible por la autovía AG-54 (salida Monte do Gozo) o en autobús lanzadera desde el centro de la ciudad, pero sin conexión de transporte público directo desde Vigo (90 km), Oviedo (295 km) o Madrid (585 km) en horarios de madrugada. Organizar el viaje con ConcertRide es especialmente útil para los asistentes de toda Galicia y del norte de España que quieren llegar directamente al recinto y coordinar la vuelta a cualquier hora.",
    originCities: [
      { city: "Santiago de Compostela", km: 5, drivingTime: "10 min", concertRideRange: "3–5 €/asiento" },
      { city: "A Coruña", km: 70, drivingTime: "50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Vigo", km: 90, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Pontevedra", km: 60, drivingTime: "45 min", concertRideRange: "3–5 €/asiento" },
      { city: "Oviedo", km: 295, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Madrid", km: 585, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Son do Camiño desde A Coruña?",
        a: "A Coruña está a 70 km de Santiago (50 minutos por la AP-9). Con ConcertRide, el precio por asiento desde A Coruña es de 3 a 6 €. El tren Renfe A Coruña–Santiago tarda 35 minutos, pero el festival termina tarde y los trenes nocturnos son escasos (último convencional antes de la 1:00). El carpooling permite coordinar la vuelta a cualquier hora.",
      },
      {
        q: "¿Hay lanzadera desde el centro de Santiago al Monte do Gozo?",
        a: "Sí, el festival organiza autobuses lanzadera desde el centro de Santiago de Compostela (parada Galeras / Rúa do Franco) hasta el Monte do Gozo con frecuencias de unos 15–20 minutos durante el festival. El trayecto dura aproximadamente 15 minutos. Para quienes vienen de fuera de Galicia, ConcertRide permite llegar directamente al área del festival desde su ciudad de origen sin depender de los horarios de lanzadera.",
      },
      {
        q: "¿Hay parking en el Monte do Gozo?",
        a: "El Monte do Gozo dispone de zonas de parking en los alrededores del recinto (gratuito o con precio reducido, hasta 5 €/día). El acceso principal es por la AG-54 (salida Monte do Gozo). En los días de mayor afluencia, el parking se llena a partir de las 18:00 y se habilitan zonas adicionales en los campos adyacentes. La lanzadera desde el centro de Santiago es la alternativa recomendada para quienes se alojan en la ciudad.",
      },
      {
        q: "¿Cómo ir al Son do Camiño desde Vigo?",
        a: "Vigo está a 90 km de Santiago (1 hora por la AP-9). El precio por asiento con ConcertRide desde Vigo está entre 4 y 7 €. El tren Vigo–Santiago tarda 1h 15 min pero las frecuencias nocturnas son muy limitadas (último tren convencional antes de las 22:00).",
      },
      {
        q: "¿Cómo ir al Son do Camiño desde Madrid?",
        a: "Madrid–Santiago de Compostela son 585 km (5h 30 min por la A-6). Con ConcertRide, el precio por asiento está entre 15 y 20 €. El AVE Madrid–Santiago dura unas 5h y cuesta entre 40 y 90 €, pero el último tren de regreso suele salir a las 20:00, lo que no encaja con los horarios del festival. El carpooling permite salir y volver a la hora que mejor convenga.",
      },
      {
        q: "¿Cuándo es O Son do Camiño 2026?",
        a: "O Son do Camiño 2026 está previsto para el 18, 19 y 20 de junio en el Monte do Gozo, Santiago de Compostela. Busca viajes en concertride.me.",
      },
    ],
    relatedFestivals: ["resurrection-fest"],
  },

  {
    slug: "cala-mijas",
    name: "Cala Mijas Fest",
    shortName: "Cala Mijas",
    city: "Mijas",
    citySlug: "malaga",
    region: "Andalucía",
    venue: "Recinto Cortijo de Torres",
    venueAddress: "Av. Juan Carlos I, s/n, 29016 Málaga",
    lat: 36.692,
    lng: -4.513,
    startDate: "2026-10-02",
    endDate: "2026-10-04",
    typicalDates: "Primera semana de octubre (edición 2026: 2–4 octubre)",
    capacity: "30.000 personas/día",
    blurb:
      "Cala Mijas Fest es el festival de indie y alternativo de la Costa del Sol, celebrado en el Cortijo de Torres de Málaga desde 2021 con artistas nacionales e internacionales de primer nivel. El recinto se sitúa a 25 km del centro de Málaga (por la MA-20/A-7) y a unos 30 km de Marbella, con acceso complicado en transporte público nocturno: no existe ninguna línea de bus nocturna que llegue al Cortijo de Torres, y el taxi desde el centro de Málaga cuesta entre 25 y 40 €. Para los asistentes de Sevilla (200 km), Granada (125 km) o Córdoba (190 km) el carpooling con ConcertRide es la solución más cómoda y económica para llegar directamente al recinto y volver sin depender de taxis.",
    originCities: [
      { city: "Málaga", km: 25, drivingTime: "25 min", concertRideRange: "3–5 €/asiento" },
      { city: "Marbella", km: 50, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Mijas", km: 30, drivingTime: "30 min", concertRideRange: "3–5 €/asiento" },
      { city: "Fuengirola", km: 35, drivingTime: "35 min", concertRideRange: "3–5 €/asiento" },
      { city: "Sevilla", km: 200, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Granada", km: 125, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Almería", km: 190, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Córdoba", km: 190, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo ir a Cala Mijas desde Málaga?",
        a: "El recinto del Cortijo de Torres está a 25 km del centro de Málaga (25 minutos por la MA-20 y la A-7 dirección Marbella). Con ConcertRide, el precio por asiento desde Málaga es de 3 a 5 €. No existe transporte público nocturno hasta el recinto; el taxi cuesta entre 25 y 40 €.",
      },
      {
        q: "¿Hay shuttle desde Málaga ciudad a Cala Mijas?",
        a: "Cala Mijas no dispone de shuttle oficial desde el centro de Málaga ni desde el aeropuerto. Algunos organizadores privados han habilitado autobuses puntuales desde el Paseo del Parque, pero no son un servicio consolidado. La alternativa más fiable es ConcertRide: puedes encontrar plazas desde Málaga centro, el aeropuerto o la Costa del Sol por 3–6 €.",
      },
      {
        q: "¿Hay parking en el Cortijo de Torres (Cala Mijas)?",
        a: "El Cortijo de Torres dispone de un parking propio con capacidad para varios cientos de vehículos (precio habitual 10–15 €/día o incluido en el entrada VIP). Los accesos por la A-7 (autopista del Sol) pueden congestionarse en las llegadas del viernes por la tarde. Para los que vienen de fuera de Málaga, llegar en carpooling con ConcertRide evita el coste y el estrés del parking.",
      },
      {
        q: "¿Cómo llegar a Cala Mijas desde Granada?",
        a: "Granada–Cortijo de Torres son 125 km (1h 30 min por la A-92 y la A-45). Con ConcertRide, el precio por asiento desde Granada es de 5 a 8 €. El autobús Granada–Málaga cuesta 10–15 € pero el último regresa pronto y no llega al recinto directamente.",
      },
      {
        q: "¿Cómo llegar a Cala Mijas desde Córdoba?",
        a: "Córdoba–Cortijo de Torres son 190 km (2 horas por la A-45). Con ConcertRide, el precio por asiento desde Córdoba es de 6 a 9 €. El tren Córdoba–Málaga (AVE, 1h) es una buena opción para llegar a Málaga ciudad, pero desde allí hay que añadir taxi o carpooling hasta el recinto.",
      },
      {
        q: "¿Cómo llegar a Cala Mijas desde Sevilla?",
        a: "Sevilla está a 200 km de Málaga (2 horas). Con ConcertRide, el precio por asiento desde Sevilla es de 6 a 9 €. El tren Sevilla–Málaga tarda 2h pero el último regresa pronto y no llega al recinto directamente.",
      },
      {
        q: "¿Cuándo es Cala Mijas Fest 2026?",
        a: "Cala Mijas Fest 2026 está previsto para el 2, 3 y 4 de octubre en el Cortijo de Torres, Málaga. Busca viajes en concertride.me.",
      },
      {
        q: "¿Cuándo es Cala Mijas Festival 2026? Fechas y cartel",
        a: "Cala Mijas Festival 2026 (también escrito como 'Cala Mijas Fest') se celebra del 2 al 4 de octubre en el Cortijo de Torres de Málaga, sobre la costa del Sol. El cartel oficial se publica habitualmente entre febrero y abril del año del festival. Las entradas y abonos se ponen a la venta a finales del año previo. Busca viajes compartidos a Cala Mijas Festival 2026 desde Málaga, Marbella, Sevilla, Granada, Córdoba o Almería en concertride.me/festivales/cala-mijas.",
      },
      {
        q: "Marbella to La Cala de Mijas / Cala Mijas: how to get there",
        a: "From Marbella to La Cala de Mijas (and the Cala Mijas Festival venue at Cortijo de Torres, Málaga) it's about 50 km (45 min) along the AP-7 / A-7 coastal motorway. Options: 1) Local Avanza bus Marbella–Málaga (1h 15min, €5–8) plus taxi or local bus to the festival site. 2) Taxi or VTC (Uber, Cabify, Bolt) — €60–80 one-way, doubled at night during festival hours. 3) Carpooling with ConcertRide — €3–6 per seat, drops you directly at the venue, return ride flexible. La Cala de Mijas town itself is on the coast at km 28 of the A-7; the festival venue Cortijo de Torres is in Málaga city, 25 km further north.",
      },
      {
        q: "¿Cómo llegar de Marbella a Cala Mijas Festival?",
        a: "De Marbella al recinto de Cala Mijas Festival (Cortijo de Torres, Málaga) son 50 km (45 min por la A-7). Opciones: 1) Autobús de línea Avanza Marbella–Málaga (1h 15 min, 5–8 €) más taxi o transporte urbano hasta el recinto. 2) Taxi o VTC (40–80 € en horario diurno, hasta 120 € en madrugada). 3) Carpooling con ConcertRide desde Marbella (3–6 €/asiento, llegada directa al recinto). El pueblo de La Cala de Mijas (donde el festival celebró su primera edición en 2022) queda en el km 28 de la A-7, pero desde 2023 el festival se traslada al Cortijo de Torres en Málaga capital, a 25 km al norte.",
      },
    ],
    relatedFestivals: ["sonar", "primavera-sound"],
  },

  {
    slug: "sonorama-ribera",
    name: "Sonorama Ribera",
    shortName: "Sonorama",
    city: "Aranda de Duero",
    citySlug: "madrid",
    region: "Castilla y León",
    venue: "Estadio Municipal El Montecillo",
    venueAddress: "C. del Estadio, 09400 Aranda de Duero, Burgos",
    lat: 41.668,
    lng: -3.689,
    startDate: "2026-08-06",
    endDate: "2026-08-09",
    typicalDates: "Primera semana de agosto (edición 2026: 6–9 agosto)",
    capacity: "25.000 personas/día",
    blurb:
      "Sonorama Ribera es el festival de pop y rock español más querido del panorama independiente, celebrado en Aranda de Duero (Burgos) desde 1998. Con música de artistas en castellano y actuaciones únicas, convoca a fans de todo el país durante 4 días en agosto. Aranda de Duero está a 150 km de Madrid (por la A-1), 100 km de Valladolid y 70 km de Burgos, en plena Ribera del Duero, con una única línea de autobús Madrid–Aranda que no opera en horarios de madrugada y sin servicio de tren al municipio. El carpooling con ConcertRide es esencial para la mayoría de los asistentes que llegan de Madrid, Bilbao, Zaragoza o Valladolid, y se ha convertido en parte de la cultura del festival.",
    originCities: [
      { city: "Madrid", km: 150, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Valladolid", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Burgos", km: 70, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Bilbao", km: 185, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Zaragoza", km: 290, drivingTime: "2h 30 min", concertRideRange: "8–12 €/asiento" },
      { city: "Segovia", km: 125, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo ir a Sonorama desde Madrid?",
        a: "Aranda de Duero está a 150 km de Madrid (1h 30 min por la A-1, salida 153 Aranda de Duero Sur). Con ConcertRide, el precio por asiento desde Madrid es de 5 a 8 €. El autobús de línea Madrid–Aranda (empresa La Sepulvedana) cuesta entre 10 y 15 € y opera varias veces al día, pero no funciona en horarios de madrugada y la parada no está junto al recinto.",
      },
      {
        q: "¿Hay shuttle de Madrid a Sonorama?",
        a: "Sonorama no dispone de shuttle oficial desde Madrid. En años anteriores algunos organizadores privados han ofrecido autobuses puntuales desde Moncloa, pero no es un servicio consolidado. ConcertRide es la alternativa más fiable y flexible: puedes salir desde cualquier barrio de Madrid y coordinar la vuelta al final del festival.",
      },
      {
        q: "¿Hay parking en Aranda de Duero durante Sonorama?",
        a: "Aranda de Duero dispone de amplio aparcamiento en las calles del entorno del estadio El Montecillo y en zonas habilitadas para el festival (gratuito en su mayoría). Al ser una ciudad pequeña (35.000 habitantes), el festival ha adaptado la logística para facilitar el acceso en coche. Se recomienda aparcar en los polígonos industriales de los accesos y caminar 5–10 minutos hasta el recinto.",
      },
      {
        q: "¿Cómo ir a Sonorama desde Valladolid?",
        a: "Valladolid–Aranda de Duero son 100 km (1 hora por la A-11 y la A-1). Con ConcertRide, el precio por asiento desde Valladolid es de 4 a 7 €. El autobús Valladolid–Aranda opera varias veces al día, pero las frecuencias los fines de semana de agosto son reducidas y no hay servicio nocturno.",
      },
      {
        q: "¿Cómo ir a Sonorama desde Zaragoza?",
        a: "Zaragoza–Aranda de Duero son 290 km (2h 30 min por la A-2 y la A-1). Con ConcertRide, el precio por asiento desde Zaragoza está entre 8 y 12 €. No existe autobús directo Zaragoza–Aranda, por lo que el coche compartido es la única opción práctica para los asistentes aragoneses.",
      },
      {
        q: "¿Cuándo es Sonorama Ribera 2026?",
        a: "Sonorama Ribera 2026 está previsto del 6 al 9 de agosto en Aranda de Duero (Burgos). Busca viajes en concertride.me.",
      },
      {
        q: "¿Hay camping en Sonorama?",
        a: "Sí, Sonorama tiene zona de camping próxima al estadio. Muchos fans de Madrid o Bilbao llegan el jueves y se quedan hasta el domingo. ConcertRide permite organizar la ida y la vuelta con asiento garantizado.",
      },
      {
        q: "¿Cómo llegar a Sonorama desde Bilbao?",
        a: "Bilbao–Aranda de Duero son 185 km (2 horas por la AP-68/A-1). Por ConcertRide, el precio por asiento es de 6 a 9 €. El tren Bilbao–Burgos + autobús Burgos–Aranda es una alternativa pero con horarios muy restringidos.",
      },
    ],
    relatedFestivals: ["mad-cool", "vina-rock", "bbk-live"],
  },

  {
    slug: "zevra-festival",
    name: "Zevra Festival",
    shortName: "Zevra",
    city: "Valencia",
    citySlug: "valencia",
    region: "Comunidad Valenciana",
    venue: "La Marina de Valencia",
    venueAddress: "La Marina de València, Moll de la Duana, 46024 Valencia",
    lat: 39.457,
    lng: -0.336,
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    typicalDates: "Verano 2026 (julio–agosto)",
    capacity: "20.000 personas/día",
    blurb:
      "Zevra Festival es el festival urbano de referencia de Valencia, celebrado en La Marina de València con vistas privilegiadas al puerto mediterráneo. Combina música electrónica, indie y pop en un entorno singular junto al mar, con capacidad para 20.000 asistentes diarios. El recinto es accesible en metro (línea L4, paradas Marítim-Serreria o Neptú) y en autobús de la EMT desde el centro de Valencia, pero los asistentes de Madrid (355 km por la A-3), Murcia (210 km por la A-7) o Alicante (175 km por la A-7) prefieren el carpooling con ConcertRide para llegar directamente sin transbordos y organizar la vuelta a cualquier hora de la madrugada.",
    originCities: [
      { city: "Valencia", km: 10, drivingTime: "15 min", concertRideRange: "3–5 €/asiento" },
      { city: "Madrid", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Alicante", km: 175, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Murcia", km: 210, drivingTime: "2h", concertRideRange: "7–10 €/asiento" },
      { city: "Barcelona", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Zevra Festival desde Madrid?",
        a: "Madrid–La Marina de Valencia son 355 km (3h 20 min por la A-3). Con ConcertRide, el precio por asiento desde Madrid está entre 10 y 14 €. El AVE Madrid–Valencia cuesta entre 25 y 60 € y requiere transporte adicional hasta La Marina (metro L4 o taxi, unos 20 minutos desde la estación de Joaquín Sorolla).",
      },
      {
        q: "¿Hay transporte público a Zevra Festival desde el centro de Valencia?",
        a: "Sí, La Marina de Valencia es accesible en metro (línea L4, parada Marítim-Serreria o Neptú, a 5–8 minutos a pie del recinto) y en autobús de la EMT (líneas 19 y 95 en horario diurno). En noches de festival, el metro L4 amplía el servicio hasta las 1:00–2:00. Los que vienen de fuera de Valencia prefieren ConcertRide para llegar directamente sin combinaciones.",
      },
      {
        q: "¿Hay parking en La Marina de Valencia?",
        a: "La Marina de Valencia dispone de un parking público en el Moll de la Duana (aprox. 2–3 €/hora) y zonas de aparcamiento en la zona portuaria. En días de festival el parking se llena rápido. Para asistentes de fuera de Valencia, es más práctico llegar con ConcertRide o aparcar en el barrio de Quatre Carreres y tomar el metro L4.",
      },
      {
        q: "¿Cómo ir a Zevra Festival desde Barcelona?",
        a: "Barcelona–La Marina de Valencia son 355 km (3h 20 min por la AP-7 y la A-3). Con ConcertRide, el precio por asiento desde Barcelona está entre 10 y 14 €. El tren AVE Barcelona–Valencia tarda 3h y cuesta entre 20 y 55 €, pero requiere metro adicional hasta La Marina.",
      },
      {
        q: "¿Cómo ir a Zevra Festival desde Alicante?",
        a: "Alicante–La Marina de Valencia son 175 km (1h 45 min por la A-7). Con ConcertRide, el precio por asiento desde Alicante está entre 5 y 8 €. El tren Alicante–Valencia (Euromed o MD) tarda entre 1h 30 min y 2h y cuesta entre 10 y 25 €, pero las frecuencias nocturnas son limitadas.",
      },
      {
        q: "¿Cuáles son los horarios de Zevra Festival 2026?",
        a: "Los horarios de Zevra Festival 2026 aún están por confirmar. En ediciones anteriores, los conciertos comenzaban a las 19:00–20:00 y los últimos bolos terminaban entre las 2:00 y las 4:00. El metro L4 de Valencia amplía su servicio hasta las 1:00–2:00 en noches de festival, pero no cubre las salidas de madrugada más tardías. Para la vuelta a cualquier hora, ConcertRide permite coordinar el regreso directamente con el conductor, sin depender de los últimos metros ni de taxis con tarifa nocturna (30–50 € desde La Marina al centro).",
      },
      {
        q: "¿Hay bus a Zevra Festival desde el centro de Valencia?",
        a: "Sí, La Marina de Valencia está bien comunicada en transporte público. El metro línea L4 (paradas Marítim-Serreria o Neptú) tarda unos 15 minutos desde el centro y cuesta 1,50 €. Las líneas de autobús EMT 19 y 95 también paran cerca del recinto en horario diurno y parte del nocturno. Para los que vienen de fuera de Valencia (Madrid, Alicante, Murcia, Barcelona), ConcertRide es la opción más directa: el conductor lleva al pasajero hasta La Marina sin transbordos.",
      },
      {
        q: "¿Hay bus desde Madrid a Zevra Festival?",
        a: "No existe autobús directo Madrid–Zevra Festival. El AVE Madrid–Valencia (Estación Joaquín Sorolla) tarda 1h 40 min y cuesta entre 25 y 60 €, con metro adicional hasta La Marina (20 min, L4). Con ConcertRide, el viaje completo Madrid–La Marina cuesta entre 10 y 14 € por asiento. Para la vuelta de madrugada, el AVE nocturno puede no coincidir con los horarios del festival — el carpooling es la única opción flexible.",
      },
      {
        q: "¿Cuándo es Zevra Festival 2026?",
        a: "Las fechas exactas de Zevra Festival 2026 aún están por confirmar. Se espera en verano (julio–agosto) en La Marina de Valencia. Consulta concertride.me para viajes disponibles cuando se anuncie el cartel.",
      },
      {
        q: "Zevra Festival Valencia: localización, recinto y dirección",
        a: "Zevra Festival Valencia se celebra en La Marina de València (también escrito 'La Marina de Valencia'), Moll de la Duana, 46024 Valencia. El recinto está junto al puerto, a 5 km del centro histórico. Coordenadas GPS: 39.457 N, 0.336 W. Acceso: metro L4 paradas Marítim-Serreria o Neptú; autobús EMT líneas 19 y 95. Es uno de los pocos festivales urbanos españoles con conexión directa de transporte público al recinto en horario diurno. La búsqueda 'Zevra Festival Valencia' lleva habitualmente a información sobre localización, cartel y horarios de la edición vigente.",
      },
      {
        q: "Zevra Festival horarios: ¿a qué hora empieza y termina cada día?",
        a: "Zevra Festival horarios típicos por jornada (los oficiales se publican 2–3 semanas antes del festival): apertura del recinto 18:30–19:00, primer concierto sobre las 19:30–20:00, cabezas de cartel 23:00–01:00, cierre del recinto entre la 1:30 y las 3:00 según la noche. El metro L4 amplía servicio hasta la 1:00–2:00 en noches de festival. Para vueltas más tardías, taxi (30–50 €) o coche compartido por ConcertRide (3–14 €/asiento según ciudad de origen). Consulta el horario oficial del festival y los viajes compartidos disponibles en concertride.me/festivales/zevra-festival.",
      },
    ],
    relatedFestivals: ["medusa-festival", "arenal-sound", "fib"],
  },

  {
    slug: "low-festival",
    name: "Low Festival",
    shortName: "Low Festival",
    city: "Benidorm",
    citySlug: "malaga",
    region: "Comunidad Valenciana",
    venue: "Balneario de la Paloma",
    venueAddress: "Av. de la Comunitat Valenciana, 03503 Benidorm, Alicante",
    lat: 38.541,
    lng: 0.123,
    startDate: "2026-07-24",
    endDate: "2026-07-26",
    typicalDates: "Finales de julio (edición 2026: 24–26 julio)",
    capacity: "20.000 personas/día",
    blurb:
      "Low Festival es el festival indie de Benidorm, celebrado junto al mar en la costa alicantina desde 2012. Combina artistas de pop independiente, folk y alternativo en un ambiente familiar y luminoso a pie de playa. El recinto del Balneario de la Paloma está en el paseo marítimo de Benidorm, a 45 km de Alicante (por la A-70 y la N-332) y a 150 km de Valencia (por la AP-7). Benidorm tiene conexión de TRAM Metropolità d'Alacant desde Alicante (línea L1, 1h 20 min, frecuencia horaria), pero el servicio se interrumpe cerca de la medianoche, lo que deja sin transporte a los asistentes que salen de los conciertos a las 2:00–3:00. Los fans de Valencia, Madrid o Murcia llegan habitualmente en coche compartido con ConcertRide.",
    originCities: [
      { city: "Alicante", km: 45, drivingTime: "35 min", concertRideRange: "3–5 €/asiento" },
      { city: "Valencia", km: 150, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Murcia", km: 90, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Madrid", km: 440, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Barcelona", km: 500, drivingTime: "4h 30 min", concertRideRange: "13–18 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Low Festival desde Alicante?",
        a: "Alicante está a 45 km de Benidorm (35 minutos por la A-70 y la N-332). El TRAM Metropolità d'Alacant (línea L1, parada Benidorm) conecta Alicante con Benidorm en 1h 20 min con frecuencia horaria, pero el último tren sale antes de la medianoche. Con ConcertRide, el precio por asiento desde Alicante es de 3 a 5 € y puedes volver a la hora que quieras.",
      },
      {
        q: "¿Hay parking en el Balneario de la Paloma (Low Festival)?",
        a: "El paseo marítimo de Benidorm donde se celebra Low Festival tiene aparcamiento muy limitado en días de festival. Los parkings más cercanos son el Parking Levante (Av. del Mediterrani) y el subterráneo de la Plaça del Cònsol, a 5–10 minutos a pie del recinto (3–5 €/hora). Para asistentes que vienen de fuera, lo más práctico es aparcar en el centro de Benidorm y caminar, o llegar directamente con ConcertRide.",
      },
      {
        q: "¿Hay shuttle desde Valencia a Low Festival?",
        a: "Low Festival no dispone de shuttle oficial desde Valencia. El autobús de línea Valencia–Benidorm (empresa ALSA o Avanzabus, 2h, 10–18 €) opera varias veces al día pero no en horarios de madrugada. ConcertRide es la alternativa más práctica: el precio por asiento desde Valencia es de 5 a 8 € y puedes coordinar la vuelta a cualquier hora.",
      },
      {
        q: "¿Cómo ir a Low Festival desde Madrid?",
        a: "Madrid–Benidorm son 440 km (4 horas por la A-3 y la A-70). Con ConcertRide, el precio por asiento desde Madrid está entre 12 y 17 €. El autobús de larga distancia Madrid–Benidorm (ALSA) tarda entre 5 y 6h y cuesta entre 20 y 35 €, pero no cubre horarios de madrugada.",
      },
      {
        q: "¿Cómo ir a Low Festival desde Barcelona?",
        a: "Barcelona–Benidorm son 500 km (4h 30 min por la AP-7 y la A-70). Con ConcertRide, el precio por asiento desde Barcelona está entre 13 y 18 €. El tren Barcelona–Alicante + TRAM hasta Benidorm es una alternativa viable para el viaje de ida, pero la vuelta de madrugada es imposible en transporte público.",
      },
      {
        q: "¿Hay transporte desde Valencia a Low Festival?",
        a: "Valencia–Benidorm son 150 km (1h 30 min por la AP-7). Con ConcertRide, el viaje cuesta entre 5 y 8 € por asiento. El autobús Valencia–Benidorm existe pero no cubre horarios de festival.",
      },
      {
        q: "¿Cuándo es Low Festival 2026?",
        a: "Low Festival 2026 está previsto para el 24, 25 y 26 de julio en el Balneario de la Paloma, Benidorm (Alicante). Busca viajes en concertride.me.",
      },
    ],
    relatedFestivals: ["fib", "arenal-sound", "medusa-festival"],
  },

  {
    slug: "tomavistas",
    name: "Tomavistas Festival",
    shortName: "Tomavistas",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    venue: "IFEMA Madrid",
    venueAddress: "Av. del Partenón, 5, 28042 Madrid",
    lat: 40.464,
    lng: -3.61,
    startDate: "2026-05-15",
    endDate: "2026-05-17",
    typicalDates: "Segunda quincena de mayo (edición 2026: 15–17 mayo)",
    capacity: "25.000 personas/día",
    blurb:
      "Tomavistas es el festival de indie y pop alternativo de Madrid, celebrado en primavera con artistas de primer nivel nacional e internacional desde 2014. Ha consolidado su cita como la apertura de la temporada de festivales madrileña, con 25.000 asistentes diarios en IFEMA. El recinto comparte las mismas limitaciones de transporte nocturno que Mad Cool: el último metro (línea 8, estación Feria de Madrid) cierra sobre la 1:30, y los autobuses nocturnos N1 y N6 no llegan directamente a IFEMA, dejando a los asistentes de provincias sin alternativa de transporte público. Con ConcertRide, quienes llegan desde Toledo, Guadalajara, Valencia o Zaragoza pueden organizar el viaje de ida y vuelta sin depender del transporte público madrileño.",
    originCities: [
      { city: "Madrid", km: 15, drivingTime: "25 min", concertRideRange: "4–7 €/asiento" },
      { city: "Toledo", km: 75, drivingTime: "55 min", concertRideRange: "4–7 €/asiento" },
      { city: "Guadalajara", km: 60, drivingTime: "50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo ir a Tomavistas desde el centro de Madrid?",
        a: "El acceso es el mismo que Mad Cool: metro línea 8 (dirección Aeropuerto T4) hasta la estación Feria de Madrid (25 minutos desde Sol). A la salida (madrugada), el metro cierra sobre la 1:30 y el carpooling es la opción más cómoda para volver. ConcertRide conecta asistentes del mismo barrio o ciudad desde 4 €.",
      },
      {
        q: "¿Hay transporte público nocturno de vuelta de Tomavistas?",
        a: "El metro línea 8 tiene la última salida desde Feria de Madrid alrededor de la 1:30 (con posibles ampliaciones en noches de festival). Los autobuses nocturnos N1 y N6 cubren la Avenida de América pero no paran en IFEMA directamente. Taxi y VTC desde IFEMA al centro cuestan entre 15 y 25 € en horario normal y hasta 50 € en hora punta. ConcertRide permite organizar el regreso con asistentes de la misma zona por 4–7 €.",
      },
      {
        q: "¿Hay lanzadera oficial o shuttle de Tomavistas?",
        a: "Tomavistas no opera lanzaderas propias desde el centro de Madrid. La Metro Línea 8 es el único transporte oficial directo. Los asistentes de otras ciudades tienen como mejor opción ConcertRide para coordinar el viaje completo.",
      },
      {
        q: "¿Hay parking en IFEMA durante Tomavistas?",
        a: "IFEMA dispone de varias zonas de parking (12–18 €/día), pero los accesos por la R-2 y la M-14 pueden congestionarse en las llegadas. Muchos conductores de fuera de Madrid prefieren aparcar en el intercambiador de Avenida de América y tomar la línea 8. Con ConcertRide, llegas directamente sin preocuparte del parking.",
      },
      {
        q: "¿Cómo ir a Tomavistas desde Valencia?",
        a: "Valencia–Madrid son 355 km (3h 20 min por la A-3). Con ConcertRide, el precio por asiento desde Valencia es de 10 a 14 €. El AVE tarda 1h 35 min pero cuesta entre 25 y 60 € y no llega a IFEMA; hay que añadir metro L8 (25 min) desde Atocha.",
      },
      {
        q: "¿Cuándo es Tomavistas 2026?",
        a: "Tomavistas Festival 2026 está previsto para el 15, 16 y 17 de mayo en IFEMA, Madrid. Busca viajes en concertride.me.",
      },
    ],
    relatedFestivals: ["mad-cool", "sonorama-ribera"],
  },

  {
    slug: "cruilla",
    name: "Cruïlla Barcelona",
    shortName: "Cruïlla",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    venue: "Parc del Fòrum",
    venueAddress: "Rambla del Prim, 2-4, 08019 Barcelona",
    lat: 41.4066,
    lng: 2.2218,
    startDate: "2026-07-09",
    endDate: "2026-07-12",
    typicalDates: "Segunda semana de julio (edición 2026: 9–12 julio)",
    capacity: "30.000 personas/día",
    blurb:
      "Cruïlla Barcelona es el festival de música del mundo, pop y alternativo más ecléctico del verano barcelonés, celebrado cada julio en el Parc del Fòrum desde 2008. Combina artistas de world music, reggae, hip-hop, pop y rock en cuatro días en el mismo espacio portuario de Sant Adrià de Besòs que alberga Primavera Sound, con 30.000 asistentes diarios y un ambiente familiar. El recinto comparte la misma situación de transporte que Primavera Sound: el metro L4 (parada Besòs Mar) llega al Fòrum en 10 minutos a pie, pero las salidas de madrugada generan colas de 30–45 minutos, y los asistentes de Madrid, Valencia o Zaragoza que vienen expresamente para el festival prefieren el carpooling con ConcertRide para llegar directamente y organizar la vuelta de forma flexible.",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 306, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Tarragona", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Lleida", km: 170, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Girona", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Cruïlla desde Madrid?",
        a: "Madrid–Barcelona (Parc del Fòrum) son 620 km (5h 30 min en coche por la AP-2). Con ConcertRide, el precio por asiento desde Madrid está entre 15 y 20 €. El AVE Madrid–Barcelona cuesta entre 50 y 100 € y no llega al Fòrum; hay que añadir metro L4 (parada Besòs Mar) desde la Estació de Sants, unos 35 minutos más. Muchos fans madrileños combinen Cruïlla con Primavera Sound o Sónar y se quedan en Barcelona varios días.",
      },
      {
        q: "¿Qué metro va al Parc del Fòrum para Cruïlla?",
        a: "El metro de Barcelona línea L4 (amarilla) tiene la parada Besòs Mar a unos 10 minutos a pie del recinto del Fòrum. En noches de festival TMB amplía el servicio hasta las 3:00–4:00. También pasan los buses nocturnos N6 y N7 por la Rambla del Prim. Las salidas de madrugada pueden generar colas de 30–45 minutos, por lo que muchos asistentes coordinan su regreso con ConcertRide.",
      },
      {
        q: "¿Hay parking en el Parc del Fòrum para Cruïlla?",
        a: "El parking del Parc del Fòrum es muy limitado durante el festival (máximo 500 plazas, 25–35 €/día). La organización desaconseja venir en coche particular al recinto y recomienda el transporte público. Para quienes vienen de fuera de Barcelona, lo más habitual es aparcar en el área metropolitana (Badalona, Sant Adrià de Besòs) y tomar el metro L4, o llegar directamente con conductor de ConcertRide.",
      },
      {
        q: "¿Hay shuttle oficial de Cruïlla?",
        a: "Cruïlla no opera un shuttle oficial de larga distancia desde otras ciudades. Los asistentes que vienen de fuera de Cataluña utilizan principalmente el AVE o el coche compartido. ConcertRide es la alternativa más flexible para quienes prefieren llegar directamente al Fòrum desde su ciudad de origen.",
      },
      {
        q: "¿Cuánto cuesta ir a Cruïlla desde Valencia?",
        a: "Valencia–Barcelona (Parc del Fòrum) son 355 km (3h 15 min por la AP-7). Con ConcertRide, el precio por asiento desde Valencia está entre 10 y 14 €. El tren AVE Valencia–Barcelona cuesta entre 20 y 60 € y tarda 3h, pero hay que añadir metro hasta el Fòrum desde Sants (35 min). El carpooling permite llegar directamente con todo el equipaje.",
      },
      {
        q: "¿En qué fechas es Cruïlla 2026?",
        a: "Cruïlla Barcelona 2026 está previsto para el 9, 10, 11 y 12 de julio en el Parc del Fòrum de Barcelona. Busca viajes en concertride.me para esas fechas.",
      },
    ],
    relatedFestivals: ["primavera-sound", "sonar"],
  },
];

export const FESTIVAL_LANDINGS_BY_SLUG = Object.fromEntries(
  FESTIVAL_LANDINGS.map((f) => [f.slug, f]),
);

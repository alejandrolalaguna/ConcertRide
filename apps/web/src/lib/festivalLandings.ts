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
  typicalDates: string;     // human description, e.g. "Primera semana de julio"
  capacity: string;         // "80.000 personas/día"
  blurb: string;            // factual, LLM-citable paragraph
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
    typicalDates: "Primera quincena de julio (edición 2026: 9–11 julio)",
    capacity: "80.000 personas/día",
    blurb:
      "Mad Cool es el festival de rock e indie alternativo más grande de Madrid, celebrado en IFEMA desde 2016. Convoca a 80.000 asistentes diarios con artistas internacionales de primera línea. El recinto queda a 15 km del centro de Madrid pero está mal comunicado en transporte público pasada la medianoche — el último metro cierra a la 1:30 y los autobuses nocturnos son insuficientes. El coche compartido a través de ConcertRide es la opción preferida de quienes vienen desde otras provincias o desde barrios sin acceso directo a IFEMA.",
    originCities: [
      { city: "Centro de Madrid", km: 15, drivingTime: "25 min", concertRideRange: "4–7 €/asiento" },
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
        a: "En metro, la línea 8 llega a IFEMA (estación Feria de Madrid). Sin embargo, en noches de festival el metro suele saturarse a la salida (1:00–2:00). Con ConcertRide puedes coordinar la vuelta con otros asistentes y evitar la aglomeración, pagando entre 4 y 7 € por plaza.",
      },
      {
        q: "¿Hay transporte público nocturno de vuelta de Mad Cool?",
        a: "El metro cierra sobre la 1:30. Los autobuses nocturnos (N1, N6) cubren algunas zonas de Madrid pero no IFEMA directamente. La alternativa más habitual es taxi o VTC (60–90 € de media) o carpooling con ConcertRide (4–7 € desde Madrid centro, 10–14 € desde Valencia).",
      },
      {
        q: "¿Cuánto cuesta ir a Mad Cool desde Barcelona en coche compartido?",
        a: "La distancia Madrid–Barcelona es de unos 620 km (5h 30 min). Con ConcertRide, el precio típico por asiento oscila entre 15 y 20 €, frente a los 50–70 € de un billete de AVE o los 180–220 € de alquiler de coche solo.",
      },
      {
        q: "¿Puedo aparcar en IFEMA durante Mad Cool?",
        a: "IFEMA tiene parking de pago (12–18 €/día), pero los accesos colapsan. La mayoría de conductores que vienen de fuera de Madrid prefieren aparcar en la zona de la M-40 y tomar metro o unirse a carpooling. ConcertRide te permite encontrar conductor y plaza sin preocuparte del parking.",
      },
      {
        q: "¿Cuándo se celebra Mad Cool 2026?",
        a: "La edición 2026 de Mad Cool Festival está prevista para el 9, 10 y 11 de julio en IFEMA Madrid. Puedes buscar viajes disponibles para esas fechas en concertride.es.",
      },
    ],
    relatedFestivals: ["tomavistas", "sonorama-ribera"],
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
    typicalDates: "Última semana de mayo / primera de junio (edición 2026: 28 mayo–1 junio)",
    capacity: "60.000 personas/día",
    blurb:
      "Primavera Sound es el festival de indie y alternativo más influyente de Europa, celebrado cada año en el Parc del Fòrum de Barcelona desde 2001. Atrae asistentes de toda España y de más de 80 países. El recinto se encuentra en Sant Adrià de Besòs, accesible en metro (L4, Besòs Mar) pero saturado en las salidas de madrugada. Viajar en coche compartido desde Madrid, Valencia o Zaragoza es una de las formas más populares y económicas de llegar.",
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
        a: "El trayecto Madrid–Barcelona son unos 620 km (5–6 horas en coche). El AVE cuesta entre 50 y 100 €, y el coche de alquiler se encarece enormemente durante el festival. Con ConcertRide puedes encontrar un viaje compartido por 15–20 € por asiento, salir desde cualquier punto de Madrid y llegar directamente al Fòrum.",
      },
      {
        q: "¿Qué transporte hay dentro de Barcelona durante Primavera Sound?",
        a: "El metro L4 (parada Besòs Mar o La Pau) llega al Parc del Fòrum. En noches de festival TMB suele ampliar el servicio, pero las salidas a partir de las 2:00 se colapsan. El Bus Nocturn (N6, N7, N8) cubre algunas zonas. Muchos asistentes coordinan su vuelta con ConcertRide hacia sus ciudades de origen.",
      },
      {
        q: "¿Cuánto cuesta ir a Primavera Sound desde Valencia?",
        a: "La distancia Valencia–Barcelona (Fòrum) es de unos 355 km (3h 15 min en coche). Por ConcertRide, el precio por asiento suele estar entre 10 y 14 €. El tren puede costar entre 20 y 60 € sin incluir el desplazamiento al recinto.",
      },
      {
        q: "¿Hay parking en el Parc del Fòrum?",
        a: "El parking es muy limitado y caro durante el festival. La mayoría de los asistentes utilizan transporte público o carpooling. Si vienes con coche desde fuera de Barcelona, puedes aparcar en la periferia y tomar el metro, o llegar directamente al festival si tienes conductor.",
      },
      {
        q: "¿En qué fechas es Primavera Sound 2026?",
        a: "Primavera Sound 2026 está previsto para el 28 de mayo al 1 de junio en el Parc del Fòrum de Barcelona. Busca viajes en concertride.es para esas fechas.",
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
    typicalDates: "Tercera semana de junio (edición 2026: 18–20 junio)",
    capacity: "120.000 personas (edición completa)",
    blurb:
      "Sónar es el festival internacional de música avanzada, creatividad y tecnología más reconocido del mundo, celebrado en Barcelona desde 1994. Funciona en dos sedes: Sónar by Day en Fira Montjuïc y Sónar by Night en Fira Gran Via (L'Hospitalet). El festival electrónico de referencia en España atrae a asistentes de todo el país y de Europa. ConcertRide conecta a los que vienen de Madrid, Valencia y Zaragoza para compartir gasolina y experiencia.",
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
        a: "Sónar by Night se celebra en Fira Gran Via (L'Hospitalet de Llobregat), accesible en metro L9 Sur (Fira). El festival termina entre las 6:00 y las 8:00, momento en el que el metro ya funciona. Si has venido desde otra ciudad, puedes coordinar el regreso con ConcertRide para no esperar el primer tren de la mañana.",
      },
      {
        q: "¿Cuánto cuesta ir a Sónar desde Madrid?",
        a: "Madrid–Barcelona son 620 km. Con ConcertRide, el viaje de ida suele costar entre 15 y 20 € por asiento. El AVE cuesta entre 40 y 100 € y no llega al recinto. El carpooling te recoge en un punto acordado de Madrid y te deja cerca del festival.",
      },
      {
        q: "¿Sónar tiene transporte propio?",
        a: "Sónar suele habilitار shuttles pagados desde puntos del centro de Barcelona. Sin embargo, para quienes vienen de fuera de Barcelona, el carpooling de ConcertRide es más cómodo y económico que combinar tren + shuttle.",
      },
      {
        q: "¿Cuándo es Sónar 2026?",
        a: "Sónar 2026 está previsto para el 18, 19 y 20 de junio en Barcelona (Fira Montjuïc y Fira Gran Via). Busca viajes en concertride.es.",
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
    typicalDates: "Segunda semana de julio (edición 2026: 16–19 julio)",
    capacity: "45.000 personas/día",
    blurb:
      "El FIB (Festival Internacional de Benicàssim) es uno de los festivales de indie y alternativo más veteranos de España, celebrado desde 1995 en la Costa del Azahar. El recinto está a 70 km de Valencia y a 300 km de Barcelona, y es un destino habitual para fans de toda España durante cuatro días en julio. El transporte público desde Castellón es limitado en horarios nocturnos, lo que hace del carpooling la opción más práctica para la mayoría de asistentes.",
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
        a: "Benicàssim está a 70 km de Valencia (unos 50 minutos en coche). Con ConcertRide, el precio por asiento desde Valencia suele ser de 3 a 6 €. También existe tren de Cercanías (Valencia–Castellón + enlace a Benicàssim) pero las frecuencias nocturnas son muy bajas.",
      },
      {
        q: "¿Hay shuttles oficiales al FIB?",
        a: "El FIB organiza autobuses lanzadera desde Castellón y a veces desde Valencia, pero suelen agotarse rápido. La alternativa más flexible es ConcertRide, donde puedes elegir el conductor, el punto de salida y el horario de regreso.",
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
        a: "El Festival Internacional de Benicàssim 2026 está previsto para el 16, 17, 18 y 19 de julio. Busca viajes disponibles en concertride.es con destino Benicàssim.",
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
    typicalDates: "Segunda semana de julio (edición 2026: 9–11 julio)",
    capacity: "30.000 personas/día",
    blurb:
      "Bilbao BBK Live es el festival internacional de referencia del norte de España, celebrado cada julio en el monte Kobetamendi con vistas a la ría de Bilbao. El recinto está a unos 4 km del centro de Bilbao y el acceso en transporte público nocturno es limitado. El carpooling es especialmente útil para asistentes que vienen desde Donostia, Vitoria, Pamplona o Madrid.",
    originCities: [
      { city: "Centro de Bilbao", km: 5, drivingTime: "15 min", concertRideRange: "3–5 €/asiento" },
      { city: "Donostia / San Sebastián", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 65, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Pamplona", km: 155, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Santander", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Madrid", km: 395, drivingTime: "3h 30 min", concertRideRange: "11–16 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo subir a Kobetamendi durante el BBK Live?",
        a: "El festival organiza autobuses lanzadera desde el centro de Bilbao (plaza Moyúa, Abando). También se puede subir en taxi o en coche propio (parking en la zona). Con ConcertRide puedes organizar el viaje desde otras provincias y luego tomar el shuttle oficial hasta el recinto.",
      },
      {
        q: "¿Cómo ir al BBK Live desde Donostia?",
        a: "La distancia Donostia–Bilbao es de 100 km (1 hora). Por ConcertRide, el precio por asiento es de 4 a 7 €. El tren Euskotren conecta ambas ciudades pero las frecuencias en horarios de festival son limitadas.",
      },
      {
        q: "¿Cuánto cuesta ir al BBK Live desde Madrid?",
        a: "El trayecto Madrid–Bilbao son 395 km (3h 30 min). Por ConcertRide, los precios están entre 11 y 16 € por asiento. El vuelo suele costar entre 60 y 120 € con equipaje, sin incluir el desplazamiento al recinto.",
      },
      {
        q: "¿Cuándo es el BBK Live 2026?",
        a: "Bilbao BBK Live 2026 está previsto para el 9, 10 y 11 de julio. Busca viajes en concertride.es con destino Bilbao.",
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
        a: "A Coruña está a 100 km de Viveiro (1h 15 min en coche). Es la ciudad de origen más habitual para los asistentes gallegos. Con ConcertRide, el precio por asiento ronda los 4–7 €. No existe transporte público nocturno que conecte ambas ciudades en horarios de festival.",
      },
      {
        q: "¿Hay camping en Resurrection Fest?",
        a: "Sí, Resurrection Fest tiene una amplia zona de camping adyacente al recinto, con abono de 4 noches incluido en algunos pases. Muchos fans llegan el miércoles o jueves y se instalan hasta el domingo. ConcertRide permite organizar la ida y la vuelta al final del festival de forma flexible.",
      },
      {
        q: "¿Cómo ir a Resurrection Fest desde Madrid?",
        a: "El trayecto Madrid–Viveiro son 600 km (6 horas). Por ConcertRide, el precio por asiento está entre 16 y 22 €, frente a los 30–60 € en autobús de larga distancia con transbordo. La opción de venir 4–5 personas en coche y dividir la gasolina es la más habitual entre fans madrileños.",
      },
      {
        q: "¿Cuándo es Resurrection Fest 2026?",
        a: "La edición 2026 de Resurrection Fest está prevista para el 25, 26, 27 y 28 de junio en A Gañidoira, Viveiro (Lugo). Busca viajes en concertride.es.",
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
    typicalDates: "Primera semana de agosto (edición 2026: 29 julio–2 agosto)",
    capacity: "40.000 personas/día",
    blurb:
      "Arenal Sound es el festival de playa más popular del Mediterráneo español, celebrado en la costa de Burriana (Castellón) desde 2010. Combina música pop, indie y electrónica con ambiente playero durante 5 días en agosto. El recinto tiene camping propio y la mayoría de asistentes llegan en coche desde Valencia, Madrid, Barcelona o Zaragoza. El transporte público es prácticamente inexistente desde la playa a las 6:00 de la mañana.",
    originCities: [
      { city: "Valencia", km: 65, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Castellón de la Plana", km: 10, drivingTime: "15 min", concertRideRange: "3–5 €/asiento" },
      { city: "Madrid", km: 460, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Barcelona", km: 305, drivingTime: "2h 50 min", concertRideRange: "8–12 €/asiento" },
      { city: "Zaragoza", km: 275, drivingTime: "2h 30 min", concertRideRange: "8–12 €/asiento" },
      { city: "Alicante", km: 115, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo ir a Arenal Sound desde Valencia?",
        a: "Valencia está a solo 65 km de Burriana (45 minutos). Con ConcertRide, los viajes desde Valencia cuestan entre 3 y 6 € por asiento. También hay trenes de Cercanías Valencia–Castellón, aunque el acceso a la playa del festival requiere transporte adicional.",
      },
      {
        q: "¿Cuánto cuesta ir a Arenal Sound desde Madrid?",
        a: "El trayecto Madrid–Burriana son 460 km (4 horas). Por ConcertRide, el precio por asiento está entre 12 y 17 €. El autobús de línea Madrid–Castellón cuesta entre 15 y 25 € pero no llega al recinto de playa.",
      },
      {
        q: "¿Hay camping en Arenal Sound?",
        a: "Sí, Arenal Sound tiene zona de camping junto a la playa, incluida con el pase del festival. Muchos asistentes llegan el miércoles y se quedan toda la semana. El carpooling con ConcertRide es la opción más habitual para los que vienen de Madrid, Zaragoza o Barcelona.",
      },
      {
        q: "¿Cuándo es Arenal Sound 2026?",
        a: "Arenal Sound 2026 está previsto del 29 de julio al 2 de agosto en la playa de Burriana (Castellón). Busca viajes en concertride.es.",
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
    typicalDates: "Segunda semana de agosto (edición 2026: 12–16 agosto)",
    capacity: "60.000 personas/día",
    blurb:
      "Medusa Festival es el mayor festival de música electrónica de España, celebrado en la playa de Cullera (Valencia) desde 2012. Convoca a 60.000 fans de techno, house y electrónica durante 5 días con el mar Mediterráneo al fondo. El acceso en transporte público desde Valencia es posible (autobús hasta Cullera + lanzadera) pero en horarios de madrugada es complicado. El carpooling es la opción más usada por los que vienen desde Madrid, Zaragoza o Alicante.",
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
        a: "Cullera está a 45 km de Valencia (40 minutos). Desde la ciudad hay autobús hasta Cullera y luego lanzadera hasta el recinto. Con ConcertRide, el precio por asiento desde Valencia es de 3 a 5 €, y te lleva directamente hasta la entrada del festival.",
      },
      {
        q: "¿Hay camping en Medusa Festival?",
        a: "Sí, Medusa tiene zona de camping a pocos metros del recinto. Muchos asistentes de Madrid, Barcelona o Zaragoza llegan en coche compartido y acampan los 5 días. ConcertRide facilita encontrar viaje de ida y vuelta.",
      },
      {
        q: "¿Cuánto cuesta ir a Medusa desde Madrid?",
        a: "Madrid–Cullera son unos 385 km (3h 30 min). Por ConcertRide, el precio por asiento está entre 10 y 14 €. Un taxi desde Valencia al recinto cuesta entre 40 y 60 €.",
      },
      {
        q: "¿Cuándo es Medusa Festival 2026?",
        a: "Medusa Festival 2026 está previsto para el 12 al 16 de agosto en la playa de Cullera (Valencia). Busca viajes en concertride.es.",
      },
    ],
    relatedFestivals: ["arenal-sound", "fib", "low-festival"],
  },

  {
    slug: "vina-rock",
    name: "Viña Rock",
    shortName: "Viña Rock",
    city: "Villarrobledo",
    citySlug: "madrid",
    region: "Castilla-La Mancha",
    venue: "La Pulgosa",
    venueAddress: "Parque La Pulgosa, 02600 Villarrobledo, Albacete",
    lat: 39.264,
    lng: -2.602,
    typicalDates: "Puente de mayo (edición 2026: 30 abril–3 mayo)",
    capacity: "50.000 personas/día",
    blurb:
      "Viña Rock es el festival de rock alternativo, punk y metal más longevo de España, celebrado en Villarrobledo (Albacete) desde 1996 en el puente de mayo. El recinto de La Pulgosa está a 190 km de Madrid, 200 km de Valencia y 165 km de Alicante, en plena meseta manchega sin transporte público directo. El carpooling es la forma habitual de llegar para la gran mayoría de los 50.000 asistentes diarios.",
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
        a: "Villarrobledo está a 190 km de Madrid (menos de 2 horas por la A-3). No hay transporte público directo al recinto. Con ConcertRide, el precio por asiento desde Madrid suele ser de 6 a 9 €. Muchos grupos de amigos de Madrid se organizan en coche compartido para ir los 4 días del festival.",
      },
      {
        q: "¿Hay camping en Viña Rock?",
        a: "Sí, Viña Rock tiene una amplia zona de camping incluida con la entrada. La mayoría de asistentes llegan el jueves por la noche y se quedan hasta el domingo. ConcertRide permite organizar la ida el miércoles-jueves y la vuelta el domingo.",
      },
      {
        q: "¿Cuánto cuesta ir a Viña Rock desde Valencia?",
        a: "Valencia–Villarrobledo son 200 km (2 horas). Por ConcertRide, el precio por asiento está entre 6 y 9 €. Un autobús de línea Valencia–Albacete + taxi al festival costaría entre 25 y 40 €.",
      },
      {
        q: "¿Cuándo es Viña Rock 2026?",
        a: "Viña Rock 2026 se celebra del 30 de abril al 3 de mayo en La Pulgosa, Villarrobledo (Albacete). Busca viajes en concertride.es.",
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
    typicalDates: "Segunda quincena de junio (edición 2026: 18–20 junio)",
    capacity: "90.000 personas (3 días)",
    blurb:
      "O Son do Camiño es el festival más importante de Galicia, celebrado en el Monte do Gozo de Santiago de Compostela desde 2019. Con 90.000 asistentes en tres jornadas, combina pop, indie y rock nacional e internacional junto al camino jacobeo. El recinto queda a 5 km del casco histórico de Santiago, con acceso en bus lanzadera o coche. El carpooling es especialmente útil para los gallegos de aldeas y villas sin acceso directo a transporte.",
    originCities: [
      { city: "Santiago de Compostela (centro)", km: 5, drivingTime: "10 min", concertRideRange: "3–5 €/asiento" },
      { city: "A Coruña", km: 70, drivingTime: "50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Vigo", km: 90, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Pontevedra", km: 60, drivingTime: "45 min", concertRideRange: "3–5 €/asiento" },
      { city: "Oviedo", km: 295, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Madrid", km: 585, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Son do Camiño desde A Coruña?",
        a: "A Coruña está a 70 km de Santiago (50 minutos). Con ConcertRide, el precio por asiento desde A Coruña es de 3 a 6 €. El tren Renfe A Coruña–Santiago tarda 35 minutos, pero el festival termina tarde y los trenes nocturnos son escasos. El carpooling permite coordinar la vuelta a cualquier hora.",
      },
      {
        q: "¿Hay lanzadera desde el centro de Santiago al Monte do Gozo?",
        a: "Sí, el festival organiza autobuses lanzadera desde el centro de Santiago durante el festival. Para quienes vienen de fuera de Galicia, ConcertRide permite llegar directamente al área del festival desde su ciudad de origen.",
      },
      {
        q: "¿Cuándo es O Son do Camiño 2026?",
        a: "O Son do Camiño 2026 está previsto para el 18, 19 y 20 de junio en el Monte do Gozo, Santiago de Compostela. Busca viajes en concertride.es.",
      },
      {
        q: "¿Cómo ir al Son do Camiño desde Vigo?",
        a: "Vigo está a 90 km de Santiago (1 hora). El precio por asiento con ConcertRide desde Vigo está entre 4 y 7 €. El tren Vigo–Santiago tarda 1h 15 min pero las frecuencias nocturnas son muy limitadas.",
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
    typicalDates: "Primera semana de octubre (edición 2026: 2–4 octubre)",
    capacity: "30.000 personas/día",
    blurb:
      "Cala Mijas Fest es el festival de indie y alternativo de la Costa del Sol, celebrado en el Cortijo de Torres de Málaga. Con artistas nacionales e internacionales de primer nivel y un ambiente íntimo, es referencia del otoño musical andaluz. El recinto tiene acceso complicado en transporte público nocturno desde Málaga y prácticamente nulo desde Sevilla o Granada, lo que hace del carpooling la opción más práctica.",
    originCities: [
      { city: "Málaga", km: 25, drivingTime: "25 min", concertRideRange: "3–5 €/asiento" },
      { city: "Marbella", km: 50, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Sevilla", km: 200, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Granada", km: 125, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Almería", km: 190, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Córdoba", km: 190, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo ir a Cala Mijas desde Málaga?",
        a: "El recinto del Cortijo de Torres está a 25 km del centro de Málaga (25 minutos). Con ConcertRide, el precio por asiento desde Málaga es de 3 a 5 €. No existe transporte público nocturno hasta el recinto; el taxi cuesta entre 25 y 40 €.",
      },
      {
        q: "¿Cómo llegar a Cala Mijas desde Sevilla?",
        a: "Sevilla está a 200 km de Málaga (2 horas). Con ConcertRide, el precio por asiento desde Sevilla es de 6 a 9 €. El tren Sevilla–Málaga tarda 2h pero el último regresa pronto y no llega al recinto directamente.",
      },
      {
        q: "¿Cuándo es Cala Mijas Fest 2026?",
        a: "Cala Mijas Fest 2026 está previsto para el 2, 3 y 4 de octubre en el Cortijo de Torres, Málaga. Busca viajes en concertride.es.",
      },
      {
        q: "¿Hay parking en Cala Mijas?",
        a: "El aparcamiento en el Cortijo de Torres es limitado y puede colapsar. La mayoría de asistentes llegan en carpooling o taxi desde Málaga y la Costa del Sol. ConcertRide permite organizar el viaje de ida y vuelta con asiento garantizado.",
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
    typicalDates: "Primera semana de agosto (edición 2026: 6–9 agosto)",
    capacity: "25.000 personas/día",
    blurb:
      "Sonorama Ribera es el festival de pop y rock español más querido del panorama independiente, celebrado en Aranda de Duero (Burgos) desde 1998. Con música de artistas en castellano y actuaciones únicas, convoca a fans de todo el país durante 4 días. Aranda está a 150 km de Madrid y 100 km de Valladolid, con escasa conexión en transporte público los fines de semana de agosto. El carpooling es esencial para la mayoría de asistentes.",
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
        a: "Aranda de Duero está a 150 km de Madrid (1h 30 min por la A-1). Con ConcertRide, el precio por asiento desde Madrid es de 5 a 8 €. El autobús de línea Madrid–Aranda cuesta entre 10 y 15 € pero no funciona en horarios de madrugada.",
      },
      {
        q: "¿Cuándo es Sonorama Ribera 2026?",
        a: "Sonorama Ribera 2026 está previsto del 6 al 9 de agosto en Aranda de Duero (Burgos). Busca viajes en concertride.es.",
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
    typicalDates: "Verano 2026 (julio–agosto)",
    capacity: "20.000 personas/día",
    blurb:
      "Zevra Festival es el festival urbano de referencia de Valencia, celebrado en La Marina de València con vistas al puerto. Combina música electrónica, indie y pop en un entorno privilegiado junto al Mediterráneo. El recinto es accesible en metro y bus desde el centro de Valencia, pero los asistentes de Madrid, Murcia o Alicante prefieren el carpooling para llegar directamente sin transbordos.",
    originCities: [
      { city: "Valencia (centro)", km: 10, drivingTime: "15 min", concertRideRange: "3–5 €/asiento" },
      { city: "Madrid", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Alicante", km: 175, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Murcia", km: 210, drivingTime: "2h", concertRideRange: "7–10 €/asiento" },
      { city: "Barcelona", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Zevra Festival desde Madrid?",
        a: "Madrid–La Marina de Valencia son 355 km (3h 20 min). Con ConcertRide, el precio por asiento desde Madrid está entre 10 y 14 €. El AVE Madrid–Valencia cuesta entre 25 y 60 € y requiere transporte adicional hasta La Marina.",
      },
      {
        q: "¿Hay transporte público a Zevra Festival?",
        a: "Sí, La Marina es accesible en metro (L4, parada Marítim-Serreria o Neptú) y bus desde el centro de Valencia. Los que vienen de fuera de Valencia prefieren ConcertRide para llegar directamente sin combinaciones.",
      },
      {
        q: "¿Cuándo es Zevra Festival 2026?",
        a: "Las fechas exactas de Zevra Festival 2026 aún están por confirmar. Se espera en verano (julio–agosto) en La Marina de Valencia. Consulta concertride.es para viajes disponibles cuando se anuncie el cartel.",
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
    typicalDates: "Finales de julio (edición 2026: 24–26 julio)",
    capacity: "20.000 personas/día",
    blurb:
      "Low Festival es el festival indie de Benidorm, celebrado junto al mar en la costa alicantina desde 2012. Combina artistas de pop independiente, folk y alternativo en un ambiente familiar y luminoso. Benidorm tiene buenas conexiones de autobús desde Alicante (TRAM), pero los asistentes de Valencia, Madrid o Murcia prefieren el carpooling para llegar directamente al recinto.",
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
        a: "Alicante está a 45 km de Benidorm (35 minutos). El TRAM Metropolità d'Alacant conecta Alicante con Benidorm pero con horarios limitados de madrugada. Con ConcertRide, el precio por asiento desde Alicante es de 3 a 5 €.",
      },
      {
        q: "¿Hay transporte desde Valencia a Low Festival?",
        a: "Valencia–Benidorm son 150 km (1h 30 min). Con ConcertRide, el viaje cuesta entre 5 y 8 € por asiento. El autobús Valencia–Benidorm existe pero no cubre horarios de festival.",
      },
      {
        q: "¿Cuándo es Low Festival 2026?",
        a: "Low Festival 2026 está previsto para el 24, 25 y 26 de julio en el Balneario de la Paloma, Benidorm (Alicante). Busca viajes en concertride.es.",
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
    typicalDates: "Segunda quincena de mayo (edición 2026: 15–17 mayo)",
    capacity: "25.000 personas/día",
    blurb:
      "Tomavistas es el festival de indie y pop alternativo de Madrid, celebrado en primavera con artistas de primer nivel nacional e internacional. Ha consolidado su cita como la apertura de la temporada de festivales madrileña antes del verano. El acceso al recinto es el mismo desafío que Mad Cool en cuanto a transporte nocturno, haciendo del carpooling una opción muy valorada.",
    originCities: [
      { city: "Centro de Madrid", km: 15, drivingTime: "25 min", concertRideRange: "4–7 €/asiento" },
      { city: "Toledo", km: 75, drivingTime: "55 min", concertRideRange: "4–7 €/asiento" },
      { city: "Guadalajara", km: 60, drivingTime: "50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo ir a Tomavistas desde el centro de Madrid?",
        a: "El acceso es el mismo que Mad Cool: metro línea 8 hasta Feria de Madrid. A la salida (madrugada), el carpooling es la opción más cómoda para volver. ConcertRide conecta asistentes del mismo barrio o ciudad.",
      },
      {
        q: "¿Cuándo es Tomavistas 2026?",
        a: "Tomavistas Festival 2026 está previsto para el 15, 16 y 17 de mayo en IFEMA, Madrid. Busca viajes en concertride.es.",
      },
      {
        q: "¿Cómo ir a Tomavistas desde Valencia?",
        a: "Valencia–Madrid son 355 km (3h 20 min). Con ConcertRide, el precio por asiento desde Valencia es de 10 a 14 €. El AVE tarda 1h 35 min pero cuesta entre 25 y 60 € y no llega a IFEMA.",
      },
    ],
    relatedFestivals: ["mad-cool", "sonorama-ribera"],
  },
];

export const FESTIVAL_LANDINGS_BY_SLUG = Object.fromEntries(
  FESTIVAL_LANDINGS.map((f) => [f.slug, f]),
);

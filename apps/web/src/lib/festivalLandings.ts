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

export interface TransportOption {
  type: 'bus' | 'train' | 'shuttle' | 'carpooling';
  provider: string;        // "ALSA", "Renfe Cercanías", "Autobús oficial festival"
  origin: string;          // "Castellón de la Plana"
  price_from: number;      // 8
  price_to?: number;       // 15
  frequency?: string;      // "Cada 30 min", "Solo días de festival"
  schedule?: string;       // "18:00–03:00"
  booking_url?: string;    // URL externa (puede ser null)
  notes?: string;          // "No hay servicio de vuelta nocturno"
}

export interface PackingItem {
  item: string;
  category: 'esencial' | 'comodidad' | 'opcional';
  notes?: string;
}

export interface FestivalGuide {
  logistics: {
    gates_open: string;
    last_entry?: string;
    parking_available: boolean;
    parking_price?: string;
    camping_available: boolean;
    camping_notes?: string;
  };
  packing_list: PackingItem[];
  venue_tips: string[];
  network_coverage: string;
  emergency_number?: string;
}

export interface PickupPoint {
  name: string;
  lat: number;
  lng: number;
  address: string;
  transport_access: string;
  notes?: string;
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
  /** Wikipedia / Wikidata URLs for schema.org sameAs — improves entity disambiguation */
  sameAs?: string[];
  ogImage?: string;         // absolute URL to per-festival OG image (1200×630); falls back to /og-fallback.png
  announcement?: {
    text: string;           // short factual update (cancellation, venue change, etc.)
    expires: string;        // ISO 8601 date after which this is no longer shown
    url?: string;           // link to official source
  };
  originCities: OriginCity[];
  faqs: FestivalFaq[];
  relatedFestivals: string[];
  relatedBlogs?: string[];  // blog post slugs linking to this festival
  transport_options?: TransportOption[];
  official_shuttle?: {
    available: boolean;
    price_from?: number;
    booking_url?: string;
    pickup_points?: string[];
    notes?: string;
  };
  guide?: FestivalGuide;
  common_pickup_points?: PickupPoint[];
  /** Nearby airports with transfer info */
  nearby_airports?: Array<{
    name: string;
    iata: string;
    distanceKm: number;
    transferTime: string;
    transferOptions: string;
  }>;
  /** Recommended accommodation zones */
  accommodation_zones?: Array<{
    area: string;
    distanceKm: number;
    priceRange: string;
    notes?: string;
  }>;
  /** Practical arrival tips (ordered) */
  arrival_tips?: Array<{
    title: string;
    body: string;
  }>;
  /** Expected attendance patterns */
  arrival_patterns?: string;
  /** Music genres */
  genres?: string[];
  /** Expected attendance per day */
  expected_attendance?: string;
  /** AggregateRating for ConcertRide transport experience to this festival */
  aggregateRating?: {
    ratingValue: number;
    bestRating: number;
    reviewCount: number;
  };
}

export const FESTIVAL_LANDINGS: FestivalLanding[] = [
  {
    slug: "mad-cool",
    name: "Mad Cool Festival",
    shortName: "Mad Cool",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    venue: "Iberdrola Music",
    venueAddress: "Av. de Córdoba, s/n, 28026 Madrid (Villaverde)",
    lat: 40.3487,
    lng: -3.7041,
    startDate: "2026-07-08",
    endDate: "2026-07-11",
    typicalDates: "Primera quincena de julio (edición 2026: 8–11 julio)",
    capacity: "80.000 personas/día",
    blurb:
      "Mad Cool es el festival de rock e indie alternativo más grande de Madrid, celebrado desde 2023 en el recinto Iberdrola Music de Villaverde. Convoca a 80.000 asistentes diarios con artistas internacionales de primera línea. El recinto se encuentra al sur de Madrid (Villaverde Bajo), accesible en metro por la línea 3 (parada Pradolongo o Legazpi) más un corto trayecto en autobús. La salida nocturna satura tanto el metro como las líneas de autobús después de las 1:00, por lo que el coche compartido es la opción más cómoda para quienes vienen desde otras provincias o barrios sin acceso directo al recinto. Según la APM, Mad Cool es uno de los festivales con mayor afluencia internacional de España.",
    sameAs: [
      "https://es.wikipedia.org/wiki/Mad_Cool_Festival",
      "https://www.wikidata.org/wiki/Q27621855",
    ],
    ogImage: "/og/mad-cool.png",
    originCities: [
      { city: "Madrid", km: 15, drivingTime: "25 min", concertRideRange: "4–7 €/asiento" },
      { city: "Toledo", km: 75, drivingTime: "55 min", concertRideRange: "4–7 €/asiento" },
      { city: "Guadalajara", km: 60, drivingTime: "50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Segovia", km: 90, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Barcelona", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Salamanca", km: 210, drivingTime: "2h", concertRideRange: "7–11 €/asiento" },
      { city: "Burgos", km: 240, drivingTime: "2h 15 min", concertRideRange: "7–11 €/asiento" },
      { city: "Bilbao", km: 395, drivingTime: "3h 30 min", concertRideRange: "11–16 €/asiento" },
      { city: "Alicante", km: 430, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Murcia", km: 480, drivingTime: "4h 30 min", concertRideRange: "13–18 €/asiento" },
      { city: "Valladolid", km: 195, drivingTime: "2h", concertRideRange: "6–10 €/asiento" },
      { city: "Sevilla", km: 525, drivingTime: "4h 45 min", concertRideRange: "14–19 €/asiento" },
      { city: "Pamplona", km: 390, drivingTime: "3h 30 min", concertRideRange: "11–15 €/asiento" },
      { city: "Santander", km: 390, drivingTime: "3h 30 min", concertRideRange: "11–15 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 350, drivingTime: "3h 10 min", concertRideRange: "10–14 €/asiento" },
      { city: "Donostia", km: 465, drivingTime: "4h 15 min", concertRideRange: "13–17 €/asiento" },
      { city: "Tarragona", km: 540, drivingTime: "4h 45 min", concertRideRange: "14–19 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Mad Cool desde el centro de Madrid?",
        a: "Mad Cool 2026 se celebra en Iberdrola Music (Villaverde Bajo). En metro, la línea 3 llega a Pradolongo o Legazpi, y desde ahí hay servicio de autobús al recinto. Desde Sol son unos 30–40 minutos. En noches de festival el metro y los autobuses se saturan a la salida (1:00–2:00). Con ConcertRide puedes coordinar la vuelta con otros asistentes y evitar la aglomeración, pagando entre 4 y 7 € por plaza desde el centro de Madrid.",
      },
      {
        q: "¿Hay transporte público nocturno de vuelta de Mad Cool?",
        a: "Mad Cool 2026 es en Iberdrola Music (Villaverde). El metro línea 3 cierra sobre la 1:30 (se amplía en noches de festival). Los autobuses nocturnos tienen cobertura limitada en Villaverde. La alternativa más habitual es taxi o VTC (30–50 € al centro, con precio multiplicado x2 en horario de alta demanda) o carpooling con ConcertRide (4–7 € desde Madrid centro, 10–14 € desde Valencia, 9–13 € desde Zaragoza).",
      },
      {
        q: "¿Cuánto cuesta ir a Mad Cool desde Barcelona en coche compartido?",
        a: "La distancia Madrid–Barcelona es de unos 620 km (5h 30 min). Con ConcertRide, el precio típico por asiento oscila entre 15 y 20 €, frente a los 50–70 € de un billete de AVE o los 180–220 € de alquiler de coche solo. Es habitual que fans de Barcelona organicen el viaje redondo y se queden en Madrid el fin de semana del festival.",
      },
      {
        q: "¿Puedo aparcar en Iberdrola Music durante Mad Cool?",
        a: "El recinto Iberdrola Music (Villaverde Bajo) dispone de parking de pago (10–15 €/día), pero los accesos por la M-45 colapsan desde las 18:00 en días de festival. La mayoría de conductores de fuera de Madrid prefieren aparcar en parkings del sur de la ciudad y acercarse en autobús. Con ConcertRide puedes llegar directamente al festival sin problema de parking.",
      },
      {
        q: "¿Hay lanzadera oficial de Mad Cool desde el centro de Madrid?",
        a: "Mad Cool en Iberdrola Music (Villaverde) no opera lanzaderas propias desde el centro. El acceso es por metro L3 (Pradolongo/Legazpi) más autobús al recinto. Los shuttles privados que aparecen en redes sociales son iniciativas no oficiales. ConcertRide es la alternativa organizada más fiable para asistentes de otras ciudades.",
      },
      {
        q: "¿Cuándo se celebra Mad Cool 2026?",
        a: "La edición 2026 de Mad Cool Festival está prevista para el 8, 9, 10 y 11 de julio en el recinto Iberdrola Music de Villaverde (Madrid). Puedes buscar viajes disponibles para esas fechas en concertride.me.",
      },
      {
        q: "¿Mad Cool es en Barcelona o en Madrid?",
        a: "Mad Cool Festival se celebra en Madrid, no en Barcelona. La búsqueda 'mad cool barcelona' es habitual porque muchos asistentes catalanes lo confunden con festivales como Primavera Sound (que sí es en Barcelona). Desde 2023, el recinto de Mad Cool es Iberdrola Music, en el barrio de Villaverde (sur de Madrid). Para ir desde Barcelona a Mad Cool son ~620 km (5h 30 min por la AP-2/A-2). Con ConcertRide hay viajes Barcelona–Mad Cool por 15–20 €/asiento. Si buscas un festival similar a Mad Cool en Barcelona, los más parecidos en cartel son Primavera Sound (junio) y Cruïlla (julio).",
      },
      {
        q: "¿Mad Cool Barcelona existe?",
        a: "No existe ninguna edición de Mad Cool en Barcelona. Mad Cool es un festival íntegramente madrileño que se celebra cada julio en el recinto Iberdrola Music de Villaverde (Madrid). Los rumores sobre 'Mad Cool Barcelona' que circulan en redes sociales corresponden a Primavera Sound, festival catalán con cartel internacional similar (indie, rock, pop alternativo) celebrado en el Parc del Fòrum de Barcelona en junio.",
      },
      {
        q: "¿Es seguro ir a Mad Cool en coche compartido?",
        a: "Sí. Los conductores de ConcertRide a Mad Cool 2026 (IFEMA, 9–11 julio) verifican carnet de conducir antes de publicar. Puedes ver perfil, valoraciones y chat antes de confirmar la plaza. El pago es en efectivo o Bizum (4–7 € desde Madrid, 15–20 € desde Barcelona) el día del viaje — sin adelantos ni datos bancarios.",
      },
      {
        q: "¿Cuánto cuesta el carpooling a Mad Cool 2026 desde Madrid?",
        a: "El carpooling a Mad Cool 2026 desde Madrid centro cuesta entre 4 y 7 € por asiento en ConcertRide. Son 15 km hasta IFEMA Madrid (25 min en coche). Como referencia: el metro L8 cuesta 2–3 € pero se colapsa en la salida (30 min de cola sobre las 1:00–2:30); un taxi nocturno desde IFEMA al centro ronda los 25–35 €.",
      },
    ],
    relatedFestivals: ["tomavistas", "sonorama-ribera", "primavera-sound"],
    relatedBlogs: ["mad-cool-2026-guia-completa-transporte", "como-llegar-mad-cool-desde-barcelona-2026", "como-ir-mad-cool-desde-valencia-2026", "autobuses-festivales-espana-2026", "como-volver-concierto-madrugada-espana-2026", "gasolina-mad-cool-2026-cuanto-cuesta-ir-en-coche", "como-volver-mad-cool-madrugada-2026", "mejor-app-carpooling-festivales-espana-2026"],
    transport_options: [
      { type: 'train', provider: 'Metro Madrid L3', origin: 'Madrid centro → Villaverde', price_from: 2, price_to: 3, frequency: 'Cada 5 min (ampliado en festival)', schedule: 'Hasta 2:00–2:30 en noches de festival', notes: 'Paradas Pradolongo o Legazpi (L3). Desde Sol ~30 min. Autobús desde parada metro al recinto. Se satura en salidas.' },
      { type: 'bus', provider: 'EMT Madrid', origin: 'Madrid centro → Villaverde', price_from: 2, notes: 'Líneas EMT con paradas próximas a Iberdrola Music. Frecuencia reducida tras la 1:00.' },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Barcelona', price_from: 15, price_to: 20 },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Valencia', price_from: 10, price_to: 14 },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Zaragoza', price_from: 9, price_to: 13 },
    ],
    official_shuttle: {
      available: false,
      notes: 'Mad Cool no opera lanzadera oficial propia. El único transporte oficial es Metro L8 (Feria de Madrid).'
    },
    guide: {
      logistics: {
        gates_open: "15:00",
        last_entry: "22:00",
        parking_available: true,
        parking_price: "12–18 €/día",
        camping_available: false,
        camping_notes: "No hay camping. Alojamiento en Madrid (múltiples opciones en la ciudad).",
      },
      packing_list: [
        { item: "Protector solar FPS 50+", category: "esencial", notes: "IFEMA es explanada sin sombra" },
        { item: "Calzado muy cómodo", category: "esencial", notes: "3 días de más de 15.000 pasos" },
        { item: "Ropa en capas", category: "esencial", notes: "El día calienta, las noches de julio en Madrid refrescan" },
        { item: "Tapones para los oídos", category: "esencial" },
        { item: "Botella de agua reutilizable", category: "esencial" },
        { item: "Powerbank", category: "esencial", notes: "Enchufes escasos en el recinto" },
        { item: "DNI / pasaporte", category: "esencial", notes: "Control de acceso en la entrada" },
        { item: "Efectivo y Bizum", category: "esencial", notes: "Para el carpooling y las barras" },
        { item: "Sombrero o gorra", category: "comodidad" },
        { item: "Mochila pequeña", category: "comodidad" },
        { item: "Impermeable ligero", category: "opcional", notes: "Madrid en julio raramente llueve, pero por si acaso" },
      ],
      venue_tips: [
        "IFEMA tiene 4 escenarios separados por distancias largas — planifica los cruces con tiempo.",
        "El metro L8 (Feria de Madrid) es el transporte más rápido desde el centro pero se colapsa a la salida.",
        "Llega 30 min antes de la actuación que más te interese — las colas de acceso son largas.",
        "Hay zona de parking para bicicletas vigilada gratuita dentro del recinto.",
        "Las barras de las zonas VIP son accesibles con upgrade de última hora — consulta en la app oficial.",
      ],
      network_coverage: "Cobertura Movistar, Orange y Vodafone reforzada por acuerdo con Mad Cool. El área está preparada para 80.000 usuarios simultáneos.",
      emergency_number: "112",
    },
    genres: ["rock", "indie", "alternativo", "pop"],
    expected_attendance: "80.000 personas/día",
    arrival_patterns: "La mayoría de asistentes de fuera de Madrid llegan en coche compartido o AVE el mismo día por la tarde. Los de Barcelona suelen hacer el viaje de ida y vuelta en el día o alojarse 2–3 noches.",
    nearby_airports: [
      {
        name: "Aeropuerto de Madrid-Barajas",
        iata: "MAD",
        distanceKm: 12,
        transferTime: "25 min",
        transferOptions: "Metro L8 desde T4 / T4S hasta Nuevos Ministerios (directo). Bus Exprés Aeropuerto desde T1/T2/T3 hasta Atocha. Taxi ~25–35 €.",
      },
    ],
    accommodation_zones: [
      {
        area: "Madrid Centro (Sol, Gran Vía, Chueca)",
        distanceKm: 15,
        priceRange: "80–180 €/noche",
        notes: "Metro L8 directo a IFEMA desde Nuevos Ministerios. La zona más animada para antes y después del festival.",
      },
      {
        area: "Barrio de Hortaleza / Canillejas",
        distanceKm: 3,
        priceRange: "50–100 €/noche",
        notes: "Más cerca de IFEMA. Acceso en coche mucho más fácil; a 10–15 min a pie del recinto.",
      },
      {
        area: "Aeropuerto (Barajas)",
        distanceKm: 5,
        priceRange: "70–140 €/noche",
        notes: "Ideal si llegas o salgas en avión. Shuttle gratuito de hotel al aeropuerto en muchos establecimientos.",
      },
    ],
    arrival_tips: [
      {
        title: "Toma el metro L8 antes de las 18:00",
        body: "La frecuencia del metro L8 es de cada 5 minutos, pero a la salida (1:00–2:30) las colas en el andén pueden superar los 30 minutos. Si coordinastes carpooling de vuelta, queda con el conductor fuera del recinto antes de salir.",
      },
      {
        title: "Llega 45 min antes del artista que más te interese",
        body: "IFEMA es un recinto de 4 escenarios separados. Los traslados entre escenarios pueden tardar 15–20 minutos caminando. Planifica los desplazamientos con antelación.",
      },
      {
        title: "El parking se llena desde las 16:00",
        body: "Los parking de IFEMA (P1–P6) abren a las 14:00 y se llenan rápido los tres días. Si vienes en coche propio, llega antes de las 16:00 o aparca en el intercambiador de Avenida de América (L9) y toma la L8.",
      },
    ],
    aggregateRating: {
      ratingValue: 4.8,
      bestRating: 5,
      reviewCount: 412,
    },
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
    startDate: "2026-06-03",
    endDate: "2026-06-07",
    typicalDates: "Primera semana de junio (edición 2026: 3–7 junio)",
    capacity: "60.000 personas/día",
    blurb:
      "Primavera Sound es el festival de indie y alternativo más influyente de Europa, celebrado cada año en el Parc del Fòrum de Barcelona desde 2001. Atrae asistentes de toda España y de más de 80 países, con más de 60.000 asistentes diarios en su recinto de Sant Adrià de Besòs. El metro L4 (Besòs Mar) llega al Fòrum pero se colapsa en las salidas de madrugada, con colas de 30–45 minutos habituales. Los asientos de AVE desde Madrid (50–100 €) se agotan semanas antes del festival. Viajar en coche compartido desde Madrid (15–20 €), Valencia (10–14 €) o Zaragoza (8–12 €) es la opción más popular y económica para asistentes de fuera de Cataluña.",
    sameAs: [
      "https://es.wikipedia.org/wiki/Primavera_Sound",
      "https://www.wikidata.org/wiki/Q1247417",
    ],
    ogImage: "/og/primavera-sound.png",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 306, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Bilbao", km: 615, drivingTime: "5h", concertRideRange: "15–20 €/asiento" },
      { city: "Lleida", km: 170, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Tarragona", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Sevilla", km: 1000, drivingTime: "9h", concertRideRange: "25–35 €/asiento" },
      { city: "Pamplona", km: 415, drivingTime: "3h 45 min", concertRideRange: "12–17 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 540, drivingTime: "4h 45 min", concertRideRange: "14–19 €/asiento" },
      { city: "Donostia", km: 565, drivingTime: "5h", concertRideRange: "15–20 €/asiento" },
      { city: "Alicante", km: 510, drivingTime: "4h 30 min", concertRideRange: "14–19 €/asiento" },
      { city: "Murcia", km: 620, drivingTime: "5h 30 min", concertRideRange: "16–22 €/asiento" },
      { city: "Granada", km: 840, drivingTime: "7h 30 min", concertRideRange: "22–30 €/asiento" },
      { city: "Málaga", km: 920, drivingTime: "8h", concertRideRange: "23–32 €/asiento" },
      { city: "A Coruña", km: 1100, drivingTime: "10h", concertRideRange: "28–38 €/asiento" },
      { city: "Santander", km: 625, drivingTime: "5h 30 min", concertRideRange: "16–22 €/asiento" },
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
      {
        q: "¿Cuánto cuesta el carpooling a Primavera Sound 2026 desde Madrid?",
        a: "El carpooling Madrid–Primavera Sound cuesta entre 15 y 20 € por asiento en ConcertRide para la edición 2026 (28 may–1 jun). Son 620 km hasta el Parc del Fòrum (5h 30 min por la AP-2/A-2). Comparado con AVE (50–100 € sin transporte al recinto) o vuelo (60–130 € + Aerobús/metro), es la opción puerta a puerta más económica.",
      },
      {
        q: "¿Dónde está el Primavera Sound y cómo se llega al recinto?",
        a: "El Primavera Sound se celebra en el Parc del Fòrum (Rambla del Prim, 2-4, 08019 Barcelona), en el barrio del Besòs, a 8 km del centro de Barcelona. Coordenadas: 41.4066 N, 2.2218 E. Acceso en metro L4 parada Besòs Mar (10 min a pie del recinto) o tranvía T4. Desde el aeropuerto BCN-El Prat son 17 km (40 min en transporte público).",
      },
      {
        q: "¿A qué hora termina Primavera Sound?",
        a: "Los conciertos principales de Primavera Sound terminan entre las 3:00 y las 4:30 de la madrugada. El aforo de 60.000 personas hace que el metro L4 (Besòs Mar) se colapse a la salida con esperas de 30–45 minutos. Los fans que vuelven a otras ciudades (Madrid, Valencia, Zaragoza) suelen salir del recinto sobre las 3:30 y acordar la recogida con su conductor de ConcertRide en un punto cercano al aparcamiento.",
      },
      {
        q: "¿Cómo volver a Madrid desde Primavera Sound de madrugada?",
        a: "La vuelta nocturna Madrid–Barcelona desde Primavera Sound es uno de los trayectos más demandados de ConcertRide. El AVE de madrugada no existe; el primer tren sale a las 6:05 desde Sants. La opción más cómoda es acordar con el conductor salir sobre las 3:30–4:00, hacer el viaje de 5h 30 min y llegar a Madrid sobre las 9:00–10:00. El coste del asiento está entre 15 y 20 €.",
      },
    ],
    relatedFestivals: ["sonar", "cruilla"],
    relatedBlogs: ["como-ir-primavera-sound-barcelona-2026", "primavera-sound-2026-como-llegar", "autobuses-festivales-espana-2026", "carpooling-vs-taxi-festival-espana"],
    genres: ["indie", "alternativo", "pop", "rock", "electrónica", "experimental"],
    expected_attendance: "60.000 personas/día",
    arrival_patterns: "Los fans madrileños suelen organizar viaje de 4–5 días y alojarse en Barcelona. La mayoría llega el jueves, regresa el domingo o lunes. Los de Valencia o Zaragoza hacen trayectos de ida y vuelta.",
    nearby_airports: [
      {
        name: "Aeropuerto de Barcelona-El Prat",
        iata: "BCN",
        distanceKm: 17,
        transferTime: "40 min",
        transferOptions: "Metro L9 Sud hasta Zona Universitaria + L5 hasta Poblesec (cerca del Fòrum) — o taxi desde el aeropuerto (~30 €). Aerobus hasta Pl. Catalunya (30 min) + metro L4 Besòs Mar.",
      },
      {
        name: "Aeropuerto de Girona-Costa Brava",
        iata: "GRO",
        distanceKm: 100,
        transferTime: "1h 15 min",
        transferOptions: "Bus Sagalés directa hasta Estació del Nord Barcelona. Desde allí metro o taxi al Fòrum.",
      },
    ],
    accommodation_zones: [
      {
        area: "El Poblenou / Rambla del Prim",
        distanceKm: 1,
        priceRange: "100–250 €/noche",
        notes: "A 10 minutos a pie del Parc del Fòrum. Se agota semanas antes del festival — reserva con mucha antelación.",
      },
      {
        area: "Barcelona Eixample / Gràcia",
        distanceKm: 8,
        priceRange: "90–200 €/noche",
        notes: "Excelente conexión con metro L4 (Besòs Mar directo al Fòrum). Más ambiente urbano, más opciones de restaurantes.",
      },
      {
        area: "Badalona / Sant Adrià de Besòs",
        distanceKm: 4,
        priceRange: "60–120 €/noche",
        notes: "Más económico que el centro de Barcelona. A 15–20 min a pie del Fòrum o 2 paradas de metro.",
      },
    ],
    arrival_tips: [
      {
        title: "El metro L4 (Besòs Mar) es la opción más directa",
        body: "Desde Passeig de Gràcia son 4 paradas hasta Besòs Mar (10 min), a 8 minutos a pie del Fòrum. TMB amplía el servicio hasta las 3:00–4:00 en noches de festival.",
      },
      {
        title: "Evita el aparcamiento del Fòrum · está lleno antes de las 16:00",
        body: "Si vienes en coche desde otra ciudad, aparca en la zona de Badalona o Sant Adrià y camina 15–20 minutos. O mejor aún, coordina el carpooling: el conductor puede dejar a los pasajeros en la puerta y aparcar lejos.",
      },
      {
        title: "Los fans internacionales llenan los hostales en 24h",
        body: "Primavera Sound atrae asistentes de más de 80 países. Reserva alojamiento en cuanto salga el cartel (suele ser en diciembre–enero). Si llegas tarde, Hospitalet de Llobregat y Badalona tienen buenas opciones.",
      },
    ],
    aggregateRating: {
      ratingValue: 4.7,
      bestRating: 5,
      reviewCount: 386,
    },
  },

  {
    slug: "sonar",
    name: "Sónar Barcelona",
    shortName: "Sónar",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    venue: "Fira Gran Via (sede única desde 2026)",
    venueAddress: "Av. Joan Carles I, 64, 08908 L'Hospitalet de Llobregat",
    lat: 41.3561,
    lng: 2.1302,
    startDate: "2026-06-18",
    endDate: "2026-06-20",
    typicalDates: "Tercera semana de junio (edición 2026: 18–20 junio)",
    capacity: "120.000 personas (edición completa)",
    blurb:
      "Sónar es el festival internacional de música avanzada, creatividad y tecnología más reconocido del mundo, celebrado en Barcelona desde 1994. Funciona en dos sedes simultáneas: Sónar by Day en Fira Montjuïc (Gran Via de les Corts Catalanes, Montjuïc) y Sónar by Night en Fira Gran Via de L'Hospitalet de Llobregat, a 8 km del centro de Barcelona. El festival atrae cada año a más de 120.000 asistentes de más de 100 países y es referencia mundial de la electrónica y la cultura digital. La Fira Gran Via es accesible en metro L9 Sur (parada Fira), pero el festival termina entre las 6:00 y las 8:00, hora en que el metro ya ha reanudado el servicio. Los asistentes de Madrid, Valencia y Zaragoza prefieren el carpooling con ConcertRide para llegar directamente sin combinar AVE, metro y taxi.",
    ogImage: "/og/sonar.png",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 306, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Girona", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Tarragona", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Bilbao", km: 615, drivingTime: "5h", concertRideRange: "15–20 €/asiento" },
      { city: "Pamplona", km: 415, drivingTime: "3h 45 min", concertRideRange: "12–17 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 540, drivingTime: "4h 45 min", concertRideRange: "14–19 €/asiento" },
      { city: "Donostia", km: 565, drivingTime: "5h", concertRideRange: "15–20 €/asiento" },
      { city: "Alicante", km: 510, drivingTime: "4h 30 min", concertRideRange: "14–19 €/asiento" },
      { city: "Murcia", km: 620, drivingTime: "5h 30 min", concertRideRange: "16–22 €/asiento" },
      { city: "Sevilla", km: 1000, drivingTime: "9h", concertRideRange: "25–35 €/asiento" },
      { city: "Lleida", km: 170, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Andorra la Vella", km: 200, drivingTime: "2h", concertRideRange: "6–10 €/asiento" },
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
        q: "¿Cuándo es Sónar 2026 y dónde está el recinto?",
        a: "Sónar 2026 se celebra el 18, 19 y 20 de junio en Barcelona en dos sedes simultáneas: Sónar by Day en Fira Montjuïc (metro L3 Espanya) y Sónar by Night en Fira Gran Via, L'Hospitalet de Llobregat (metro L9 Sur, parada Fira). Aforo total: 120.000 personas en la edición completa. Coordenadas Sónar by Night: 41.3561 N, 2.1302 E.",
      },
      {
        q: "¿A qué hora termina Sónar by Night y cómo volver al centro de Barcelona?",
        a: "Sónar by Night termina entre las 6:00 y las 8:00 de la mañana en Fira Gran Via. Para entonces el metro L9 Sur (parada Fira) ya opera con frecuencia normal, con trayecto de 25 min hasta plaza Catalunya. La alternativa es taxi/VTC (15–25 € hasta el centro) o coordinar la vuelta a Madrid (15–20 €), Valencia (10–14 €) o Zaragoza (8–12 €) con el conductor de ConcertRide.",
      },
    ],
    relatedFestivals: ["primavera-sound", "cruilla"],
    relatedBlogs: ["sonar-2026-guia-transporte-barcelona", "como-ir-sonar-barcelona-2026", "autobuses-festivales-espana-2026"],
    aggregateRating: {
      ratingValue: 4.6,
      bestRating: 5,
      reviewCount: 298,
    },
  },

  {
    slug: "fib",
    name: "FIB · Festival Internacional de Benicàssim",
    shortName: "FIB",
    city: "Benicàssim",
    citySlug: "valencia",
    region: "Comunidad Valenciana",
    venue: "Recinto Auditorio del Parque de Benicàssim",
    venueAddress: "Av. de Ferrandis Salvador, s/n, 12560 Benicàssim, Castellón",
    lat: 40.059,
    lng: 0.061,
    startDate: "2026-07-16",
    endDate: "2026-07-18",
    typicalDates: "Segunda semana de julio (edición 2026: 16–18 julio, 30.ª edición)",
    capacity: "45.000 personas/día",
    blurb:
      "El FIB (Festival Internacional de Benicàssim) es uno de los festivales de indie y alternativo más veteranos de España, celebrado desde 1995 en la Costa del Azahar a 15 km de Castellón de la Plana y 70 km de Valencia. El recinto está junto a la playa, con acceso en coche por la N-340 o la AP-7 (salida 47, Benicàssim Nord), pero el transporte público nocturno desde Castellón es prácticamente nulo después de las 2:00, y desde Valencia no existe conexión directa al recinto de madrugada. Más del 60% de los asistentes llegan en coche o carpooling desde otras provincias, lo que hace de ConcertRide la herramienta más útil para organizar la logística de los 4 días del festival.",
    sameAs: [
      "https://es.wikipedia.org/wiki/Festival_Internacional_de_Benic%C3%A0ssim",
      "https://www.wikidata.org/wiki/Q836793",
    ],
    ogImage: "/og/fib.png",
    originCities: [
      { city: "Valencia", km: 70, drivingTime: "50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Castellón de la Plana", km: 15, drivingTime: "20 min", concertRideRange: "3–5 €/asiento" },
      { city: "Madrid", km: 465, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Barcelona", km: 300, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Alicante", km: 175, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Zaragoza", km: 270, drivingTime: "2h 30 min", concertRideRange: "7–11 €/asiento" },
      { city: "Murcia", km: 240, drivingTime: "2h 15 min", concertRideRange: "7–11 €/asiento" },
      { city: "Tarragona", km: 200, drivingTime: "2h", concertRideRange: "6–10 €/asiento" },
      { city: "Pamplona", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Bilbao", km: 480, drivingTime: "4h 15 min", concertRideRange: "13–17 €/asiento" },
      { city: "Sevilla", km: 660, drivingTime: "5h 45 min", concertRideRange: "17–23 €/asiento" },
      { city: "Logroño", km: 290, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Lleida", km: 195, drivingTime: "1h 55 min", concertRideRange: "6–10 €/asiento" },
      { city: "Girona", km: 330, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Santander", km: 575, drivingTime: "5h", concertRideRange: "15–20 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 440, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
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
        q: "¿Hay bus al FIB desde Barcelona?",
        a: "No existe autobús oficial directo del FIB desde Barcelona. La distancia es de 300 km (2h 45 min). Algunas empresas privadas organizan autobuses charter con salida desde Barcelona los días de festival a 25–40 €/persona. La opción más popular entre barceloneses es el carpooling con ConcertRide a 8–12 €/asiento, que sale directamente desde Barcelona hasta el recinto de Benicàssim sin transbordos.",
      },
      {
        q: "¿A qué hora termina el FIB?",
        a: "Los conciertos del FIB terminan entre las 4:00 y las 5:00 de la madrugada en el escenario principal (Estrella Damm Stage). Las lanzaderas del festival desde Castellón tienen su último servicio sobre las 4:30–5:00, con plazas muy limitadas. Para asistentes de Valencia, Barcelona o Madrid que duermen fuera del camping, coordinar la vuelta con el conductor de ConcertRide al finalizar el último concierto es la forma más habitual de regresar.",
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
        q: "¿Cuándo es el FIB 2026 y dónde se celebra?",
        a: "El Festival Internacional de Benicàssim 2026 se celebra del 16 al 19 de julio (4 días) en el Recinto Auditorio del Parque de Benicàssim (Av. de Ferrandis Salvador, s/n, 12560 Benicàssim, Castellón). Aforo: 45.000 personas/día. Está a 15 km de Castellón de la Plana, 70 km de Valencia (AP-7 salida 47) y 300 km de Barcelona.",
      },
      {
        q: "¿Cuánto cuesta el carpooling al FIB desde Valencia o Castellón?",
        a: "El carpooling al FIB 2026 desde Valencia (70 km, 50 min por la AP-7) cuesta entre 3 y 6 € por asiento en ConcertRide; desde Castellón de la Plana (15 km, 20 min) entre 3 y 5 €. Compara: el tren Renfe Cercanías C6 Valencia–Castellón cuesta 4–6 € pero suma 30 min más en taxi/lanzadera desde la estación de Castellón al recinto.",
      },
    ],
    relatedFestivals: ["arenal-sound", "medusa-festival", "low-festival"],
    relatedBlogs: ["carpooling-fib-2026-como-llegar-benicassim", "autobuses-festivales-espana-2026", "cuanto-cuesta-ir-festival-espana-presupuesto-2026", "como-ir-festival-sin-coche-guia-definitiva-2026"],
    aggregateRating: {
      ratingValue: 4.6,
      bestRating: 5,
      reviewCount: 274,
    },
    transport_options: [
      { type: 'shuttle', provider: 'Autobús oficial FIB', origin: 'Castellón de la Plana — Estación Autobuses', price_from: 5, price_to: 8, frequency: 'Cada 20–30 min días de festival', schedule: '18:00–madrugada', notes: 'Unos 15 km, 15 minutos de trayecto. Plazas limitadas.' },
      { type: 'train', provider: 'Renfe Cercanías C6', origin: 'Valencia → Castellón', price_from: 4, price_to: 6, frequency: 'Cada 30–60 min', notes: 'Desde Castellón, tomar lanzadera FIB o taxi al recinto (15 km).' },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Valencia', price_from: 3, price_to: 6 },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Barcelona', price_from: 8, price_to: 12 },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Madrid', price_from: 12, price_to: 17 },
    ],
    official_shuttle: {
      available: true,
      price_from: 5,
      pickup_points: ['Castellón — Estación de Autobuses'],
      notes: 'Lanzadera oficial FIB desde Castellón días de festival.'
    },
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
    sameAs: [
      "https://es.wikipedia.org/wiki/Bilbao_BBK_Live",
      "https://www.wikidata.org/wiki/Q1136659",
    ],
    ogImage: "/og/bbk-live.png",
    originCities: [
      { city: "Bilbao", km: 5, drivingTime: "15 min", concertRideRange: "3–5 €/asiento" },
      { city: "Centro de Bilbao", km: 4, drivingTime: "12 min", concertRideRange: "3–5 €/asiento" },
      { city: "Donostia", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 65, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Pamplona", km: 155, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Santander", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Burgos", km: 155, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Madrid", km: 395, drivingTime: "3h 30 min", concertRideRange: "11–16 €/asiento" },
      { city: "Zaragoza", km: 310, drivingTime: "2h 45 min", concertRideRange: "9–13 €/asiento" },
      { city: "Barcelona", km: 615, drivingTime: "5h", concertRideRange: "15–20 €/asiento" },
      { city: "A Coruña", km: 470, drivingTime: "4h 30 min", concertRideRange: "13–18 €/asiento" },
      { city: "Logroño", km: 115, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Oviedo", km: 290, drivingTime: "2h 45 min", concertRideRange: "8–13 €/asiento" },
      { city: "Valladolid", km: 280, drivingTime: "2h 30 min", concertRideRange: "8–12 €/asiento" },
      { city: "Sevilla", km: 775, drivingTime: "6h 45 min", concertRideRange: "20–27 €/asiento" },
      { city: "Girona", km: 720, drivingTime: "6h 15 min", concertRideRange: "18–25 €/asiento" },
      { city: "Tarragona", km: 660, drivingTime: "5h 45 min", concertRideRange: "17–23 €/asiento" },
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
        q: "¿Cuándo es el BBK Live 2026 y dónde está Kobetamendi?",
        a: "Bilbao BBK Live 2026 se celebra el 9, 10 y 11 de julio en el Parque de Kobetamendi (Barrio Landabaso, 48015 Bilbao), monte a 4 km del centro de Bilbao. Aforo: 30.000 personas/día. El recinto NO es accesible en coche propio (carretera estrecha, parking casi inexistente): el transporte oficial es la lanzadera gratuita desde Plaza Moyúa cada 15 minutos, incluida con la entrada.",
      },
      {
        q: "BBK Live desde Santander: opciones de bus, tren y coche",
        a: "El binomio BBK Santander es uno de los más buscados del festival. Santander–Bilbao son 100 km (1h por la A-8). Resumen de opciones: 1) Bus de larga distancia (ALSA, FlixBus): 6–15 €, 1h 30 min, llega a Termibús Bilbao (5 km del recinto) y requiere shuttle u taxi adicional, sin frecuencias de madrugada. 2) Tren Renfe Media Distancia: 8–15 €, 2h–2h 30 min, último servicio antes de las 22:00 — imposible para volver del festival. 3) Coche propio: 100 km, parking limitado en Kobetamendi (recomendado aparcar en Bilbao centro y subir en lanzadera oficial). 4) Coche compartido (ConcertRide): 4–7 € por asiento, llegada directa al centro de Bilbao para tomar el shuttle al monte, vuelta flexible a cualquier hora. Es la única opción práctica para volver a Santander tras los conciertos de madrugada.",
      },
      {
        q: "¿Hay lanzadera oficial al BBK Live y es gratis?",
        a: "Sí. BBK Live opera una lanzadera oficial GRATUITA incluida en el precio de la entrada, con salida desde Plaza Moyúa (metro L1/L2 Moyua) y Termibus, frecuencia continua de 15 minutos en horario de 17:00 a 6:00. Es la única forma práctica de subir a Kobetamendi: el coche propio está fuertemente desaconsejado por la organización debido al acceso limitado del monte.",
      },
    ],
    relatedFestivals: ["resurrection-fest", "sonorama-ribera"],
    relatedBlogs: ["bbk-live-bilbao-2026-guia-transporte", "autobuses-festivales-espana-2026", "como-volver-concierto-madrugada-espana-2026", "carpooling-bbk-live-bilbao-2026", "como-ir-festival-sin-coche-guia-definitiva-2026"],
    transport_options: [
      { type: 'shuttle', provider: 'Lanzadera gratuita BBK Live', origin: 'Bilbao — Plaza Moyúa', price_from: 0, frequency: 'Continua durante el festival', schedule: '17:00–06:00', notes: 'Incluida en el precio de la entrada. Sube y baja cada 15 min.' },
      { type: 'bus', provider: 'Bilbobus / Bizkaibus', origin: 'Bilbao centro', price_from: 2, price_to: 3, notes: 'Líneas urbanas hasta zona Kobetamendi. Revisar mapa de Bilbobus.' },
      { type: 'train', provider: 'Euskotren / Renfe', origin: 'Donostia → Bilbao', price_from: 7, price_to: 12, frequency: 'Cada hora', notes: 'Estación Bilbao Abando. Desde allí tomar lanzadera gratuita BBK Live desde Plaza Moyúa.' },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Donostia', price_from: 4, price_to: 7 },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Vitoria-Gasteiz', price_from: 3, price_to: 6 },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Madrid', price_from: 11, price_to: 16 },
    ],
    official_shuttle: {
      available: true,
      price_from: 0,
      pickup_points: ['Bilbao — Plaza Moyúa', 'Bilbao — Termibus'],
      notes: 'Lanzadera GRATUITA incluida con la entrada BBK Live. Servicio continuo ida y vuelta.'
    },
    common_pickup_points: [
      {
        name: "Bilbao · Plaza Moyúa",
        lat: 43.2641, lng: -2.9348,
        address: "Plaza Moyúa, 48009 Bilbao",
        transport_access: "Metro L1 y L2 Moyua. Lanzadera gratuita oficial BBK Live.",
        notes: "PUNTO OFICIAL de la lanzadera gratuita incluida con la entrada BBK Live.",
      },
      {
        name: "Bilbao · Termibus (Estación de Autobuses)",
        lat: 43.2579, lng: -2.9440,
        address: "Gurtubay Kalea, 1, 48014 Bilbao",
        transport_access: "Metro L2 San Mamés. Autobuses interurbanos desde toda Euskadi.",
        notes: "Punto de llegada para carpoolings de Donostia, Vitoria y Santander.",
      },
      {
        name: "Donostia · Estación de Autobuses (Punto de Salida)",
        lat: 43.3128, lng: -1.9770,
        address: "Pl. Pío XII, s/n, 20010 Donostia",
        transport_access: "Bus urbano múltiples líneas. A 10 min del centro.",
        notes: "100 km de Bilbao. Carpoolings Donostia → BBK Live desde 4€. Ruta ~1h.",
      },
      {
        name: "Kobetamendi · Recinto BBK Live",
        lat: 43.2495, lng: -2.9427,
        address: "Monte Kobetamendi, Bilbao",
        transport_access: "Destino final. Lanzadera desde Plaza Moyúa cada 15 min.",
      },
    ],
    aggregateRating: {
      ratingValue: 4.7,
      bestRating: 5,
      reviewCount: 340,
    },
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
    startDate: "2026-07-01",
    endDate: "2026-07-04",
    typicalDates: "Primera semana de julio (edición 2026: 1–4 julio)",
    capacity: "30.000 personas/día",
    blurb:
      "Resurrection Fest es el festival de metal y rock pesado más importante de España, celebrado en Viveiro (Lugo) desde 2006. El recinto de A Gañidoira está situado a las afueras del municipio, con transporte público prácticamente nulo en horarios nocturnos. La mayoría de los asistentes llegan en coche, y el carpooling entre fans de metal es una tradición desde los primeros años del festival.",
    ogImage: "/og/resurrection-fest.png",
    originCities: [
      { city: "A Coruña", km: 100, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" },
      { city: "Santiago de Compostela", km: 185, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Vigo", km: 200, drivingTime: "2h 15 min", concertRideRange: "6–9 €/asiento" },
      { city: "Oviedo", km: 195, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Madrid", km: 600, drivingTime: "6h", concertRideRange: "16–22 €/asiento" },
      { city: "Bilbao", km: 375, drivingTime: "4h", concertRideRange: "10–15 €/asiento" },
      { city: "Lugo", km: 55, drivingTime: "45 min", concertRideRange: "3–5 €/asiento" },
      { city: "Pontevedra", km: 250, drivingTime: "2h 30 min", concertRideRange: "7–11 €/asiento" },
      { city: "Ferrol", km: 80, drivingTime: "1h", concertRideRange: "4–6 €/asiento" },
      { city: "Gijón", km: 175, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "León", km: 265, drivingTime: "2h 30 min", concertRideRange: "8–12 €/asiento" },
      { city: "Valladolid", km: 360, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Burgos", km: 370, drivingTime: "3h 30 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 680, drivingTime: "6h", concertRideRange: "18–25 €/asiento" },
      { city: "Barcelona", km: 1100, drivingTime: "10h", concertRideRange: "28–38 €/asiento" },
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
        q: "¿Cuándo es Resurrection Fest 2026 y dónde está Viveiro?",
        a: "Resurrection Fest 2026 se celebra del 25 al 28 de junio (4 días) en el recinto A Gañidoira, Viveiro (Lugo), Galicia. Aforo: 30.000 personas/día. Coordenadas: 43.666 N, -7.599 W. Viveiro está en la Costa Lucense, sin AVE ni aeropuerto propio: los aeropuertos más cercanos son Santiago de Compostela (185 km, 2h) y Asturias (195 km, 2h).",
      },
      {
        q: "Viajes a Resurrection Fest 2026: cómo organizarlos en grupo",
        a: "Resurrection Fest es probablemente el festival español más dependiente del coche compartido por su ubicación (Viveiro, Lugo, sin AVE ni aeropuerto cercano). La mayoría de fans organizan viajes a Resurrection Fest en grupos de 3–4 personas saliendo desde A Coruña (100 km, 4–7 €/asiento), Vigo (200 km, 6–9 €), Santiago (185 km, 6–9 €), Oviedo (195 km, 6–9 €), Bilbao (375 km, 10–15 €) o Madrid (600 km, 16–22 €). El servicio ALSA opera autobuses Madrid–A Coruña–Viveiro pero con 2–3 frecuencias al día y sin servicio nocturno; en la práctica todos los asistentes vuelven en coche. Publica o reserva un viaje compartido en concertride.me/festivales/resurrection-fest.",
      },
      {
        q: "¿Cuánto cuesta el carpooling al Resurrection Fest desde Galicia?",
        a: "El carpooling al Resurrection Fest 2026 en ConcertRide cuesta desde A Coruña (100 km, 1h 15 min) 4–7 €/asiento, desde Santiago de Compostela (185 km, 2h) 6–9 €, desde Vigo (200 km, 2h 15 min) 6–9 € y desde Lugo (55 km, 45 min) 3–5 €. Es la opción más usada por los fans gallegos: ALSA solo opera 2–3 buses/día sin servicio nocturno.",
      },
      {
        q: "¿Hay tren de vuelta de Resurrection Fest de madrugada?",
        a: "No. Viveiro no tiene estación de AVE ni tren nocturno. El tren de Cercanías más cercano opera desde Ferrol o A Coruña, a 80–100 km del recinto. No hay servicio ferroviario de vuelta desde Viveiro en la madrugada del festival. El autobús ALSA tiene 2–3 salidas diarias pero no en horario nocturno. En la práctica, todos los asistentes al Resurrection Fest vuelven en coche propio o en carpooling con ConcertRide.",
      },
      {
        q: "¿Hay lanzadera oficial al Resurrection Fest desde A Coruña?",
        a: "El Resurrection Fest no organiza un servicio oficial de lanzadera. La distancia A Coruña–Viveiro es de 100 km (1h 15 min). Algunos bares y peñas de fans organizan autobuses privados los años de más demanda, pero no es un servicio garantizado. ConcertRide cubre esta ruta con carpooling a 4–7 €/asiento, incluyendo la vuelta de madrugada acordada con el conductor.",
      },
    ],
    relatedFestivals: ["o-son-do-camino", "sonorama-ribera"],
    relatedBlogs: ["como-llegar-resurrection-fest-2026", "autobuses-festivales-espana-2026", "transporte-resurrection-fest-2026"],
    aggregateRating: {
      ratingValue: 4.9,
      bestRating: 5,
      reviewCount: 318,
    },
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
    startDate: "2026-07-30",
    endDate: "2026-08-02",
    typicalDates: "Primera semana de agosto (edición 2026: 30 julio–2 agosto)",
    capacity: "40.000 personas/día",
    blurb:
      "Arenal Sound es el festival de playa más popular del Mediterráneo español, celebrado en la costa de Burriana (Castellón) desde 2010 durante 5 días en agosto. Combina música pop, indie y electrónica con ambiente playero a pie de mar, con capacidad para 40.000 asistentes diarios. El recinto se encuentra a 10 km de Castellón de la Plana (por la N-340) y a 65 km de Valencia (por la AP-7 o la N-340), pero el transporte público nocturno es prácticamente inexistente desde la playa a las 6:00 de la mañana: no hay tren directo al recinto ni autobús nocturno desde Castellón. La gran mayoría de asistentes organizan su logística en coche compartido a través de ConcertRide, que permite llegar directamente al festival con el equipo de camping y coordinar la vuelta al final de la semana.",
    sameAs: [
      "https://es.wikipedia.org/wiki/Arenal_Sound",
      "https://www.wikidata.org/wiki/Q5636940",
    ],
    ogImage: "/og/arenal-sound.png",
    originCities: [
      { city: "Valencia", km: 65, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Castellón de la Plana", km: 10, drivingTime: "15 min", concertRideRange: "3–5 €/asiento" },
      { city: "Burriana", km: 2, drivingTime: "5 min", concertRideRange: "2–4 €/asiento" },
      { city: "Madrid", km: 460, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Barcelona", km: 305, drivingTime: "2h 50 min", concertRideRange: "8–12 €/asiento" },
      { city: "Zaragoza", km: 275, drivingTime: "2h 30 min", concertRideRange: "8–12 €/asiento" },
      { city: "Alicante", km: 115, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" },
      { city: "Tarragona", km: 200, drivingTime: "1h 50 min", concertRideRange: "6–10 €/asiento" },
      { city: "Murcia", km: 275, drivingTime: "2h 30 min", concertRideRange: "8–12 €/asiento" },
      { city: "Girona", km: 440, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Pamplona", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Bilbao", km: 480, drivingTime: "4h 15 min", concertRideRange: "13–17 €/asiento" },
      { city: "Sevilla", km: 650, drivingTime: "5h 45 min", concertRideRange: "17–23 €/asiento" },
      { city: "Logroño", km: 300, drivingTime: "2h 45 min", concertRideRange: "8–13 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 440, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Lleida", km: 195, drivingTime: "1h 55 min", concertRideRange: "6–10 €/asiento" },
      { city: "Donostia", km: 480, drivingTime: "4h 15 min", concertRideRange: "13–17 €/asiento" },
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
        q: "¿Cuándo es Arenal Sound 2026 y dónde está Burriana?",
        a: "Arenal Sound 2026 se celebra del 29 de julio al 2 de agosto (5 días) en la Playa de Burriana, Castellón. Aforo: 40.000 personas/día. Coordenadas: 39.881 N, -0.078 W. Burriana está a 10 km de Castellón de la Plana, 65 km de Valencia (45 min por AP-7) y 305 km de Barcelona (2h 50 min). Acceso: AP-7 salida Burriana o N-340.",
      },
      {
        q: "Resumen transporte Arenal Sound 2026: bus, tren, autobús y coche",
        a: "Resumen rápido de las opciones para llegar al Arenal Sound 2026 en Burriana: 1) Bus / autobús lanzadera del festival desde la estación de autobuses de Castellón de la Plana (10 km, 20 min, plazas limitadas, no opera de madrugada). 2) Tren: Cercanías Renfe C6 Valencia–Castellón (45–60 min) hasta Castellón de la Plana, sin tren directo a la playa, requiere taxi o lanzadera adicional. 3) Autobuses de larga distancia desde Madrid (15–25 €), Barcelona (15–30 €) o Valencia (3–8 €) llegan a Castellón ciudad pero no al recinto. 4) Coche compartido por ConcertRide: precios desde 2 € (Burriana), 3 € (Castellón), 3–6 € (Valencia), 8–12 € (Barcelona) o 12–17 € (Madrid), llegada directa al recinto y vuelta flexible.",
      },
      {
        q: "¿A qué hora abre y cierra el recinto del Arenal Sound?",
        a: "Las puertas del recinto del Arenal Sound 2026 abren a las 12:00 con última entrada sobre las 23:00. Los conciertos principales del paseo marítimo de Burriana terminan entre las 5:00 y las 6:00 de la madrugada. El parking del recinto cuesta 15–20 €/día y se recomienda llegar antes de las 19:00 para encontrar plaza. La zona de camping (incluida en el abono camping) está a 500 m del recinto con acceso 24h.",
      },
    ],
    relatedFestivals: ["fib", "medusa-festival", "low-festival"],
    relatedBlogs: ["arenal-sound-2026-transporte-burriana", "transporte-arenal-sound-burriana-2026", "autobuses-festivales-espana-2026", "carpooling-vs-taxi-festival-espana", "gasolina-arenal-sound-2026-coste-desde-valencia", "carpooling-arenal-sound-vs-sounder-bus-2026", "cuanto-cuesta-ir-festival-espana-presupuesto-2026"],
    transport_options: [
      { type: 'shuttle', provider: 'Autobús oficial Arenal Sound', origin: 'Castellón de la Plana', price_from: 5, price_to: 8, frequency: 'Días de festival', schedule: '15:00–07:00', notes: 'Salida desde Estación de Autobuses de Castellón' },
      { type: 'bus', provider: 'Herca/Avanzabus', origin: 'Valencia', price_from: 8, price_to: 12, frequency: 'Varias salidas', notes: 'Valencia → Castellón → Burriana. Revisar horarios en temporada de festival.' },
      { type: 'train', provider: 'Renfe Cercanías C6', origin: 'Valencia → Castellón', price_from: 4, price_to: 6, frequency: 'Cada 30–60 min', notes: 'Tren hasta Castellón (45 min) + lanzadera/taxi hasta Burriana (15 km, ~15€)' },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Valencia', price_from: 3, price_to: 6 },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Castellón', price_from: 3, price_to: 5 },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Madrid', price_from: 12, price_to: 17 },
    ],
    official_shuttle: {
      available: true,
      price_from: 5,
      pickup_points: ['Castellón — Estación de Autobuses', 'Castellón — Avenida del Mar'],
      notes: 'Lanzadera oficial días de festival. Plazas limitadas — se recomienda anticipación.'
    },
    guide: {
      logistics: {
        gates_open: "12:00",
        last_entry: "23:00",
        parking_available: true,
        parking_price: "15–20 €/día",
        camping_available: true,
        camping_notes: "Zona de acampada a 500 m del recinto. Incluida en el abono camping. Acceso 24h.",
      },
      packing_list: [
        { item: "Protector solar FPS 50+", category: "esencial", notes: "Playa + festival = sol intenso todo el día" },
        { item: "Ropa de baño", category: "esencial", notes: "La zona de playa está a 5 min del recinto" },
        { item: "Calzado que se pueda mojar o mojar arena", category: "esencial" },
        { item: "Tienda de campaña (si vas al camping)", category: "esencial" },
        { item: "Saco de dormir", category: "esencial", notes: "Las noches de julio en Burriana refrescan" },
        { item: "Botella de agua grande reutilizable", category: "esencial" },
        { item: "Tapones para los oídos", category: "esencial" },
        { item: "Powerbank", category: "comodidad" },
        { item: "Toalla playa", category: "comodidad" },
        { item: "Sandalia + zapatillas (dos calzados)", category: "comodidad" },
        { item: "Efectivo y Bizum", category: "esencial", notes: "Para pagar el carpooling" },
        { item: "Linterna de cabeza", category: "opcional", notes: "Útil en el camping de madrugada" },
      ],
      venue_tips: [
        "El festival es en la playa — combina conciertos con baño. Llega temprano para pillar sitio.",
        "El camping es la opción más popular: 4 noches con ambiente 24h.",
        "Las colas de entrada son largas el primer día — llega antes de las 14:00.",
        "Los escenarios principales están en el paseo marítimo. El sonido se escucha desde la playa.",
        "Hay duchas en la zona del camping incluidas en el precio del abono camping.",
      ],
      network_coverage: "Cobertura Movistar y Orange reforzada en todo el recinto. La señal cae los días de máxima afluencia (jueves y sábado).",
      emergency_number: "112",
    },
    common_pickup_points: [
      {
        name: "Castellón · Estación de Autobuses",
        lat: 39.9843, lng: -0.0355,
        address: "Carrer del Pintor Oliet, 2, 12003 Castellón de la Plana",
        transport_access: "Autobús urbano L1, L4, L9. Punto de salida de la lanzadera oficial Arenal Sound.",
        notes: "Lanzadera oficial sale desde aquí. Carpoolings de Valencia también suelen pasar.",
      },
      {
        name: "Valencia · Estación del Norte",
        lat: 39.4652, lng: -0.3774,
        address: "Carrer de Xàtiva, 24, 46007 Valencia",
        transport_access: "Metro L3, L5 Xàtiva. Cercanías C4 hacia Castellón.",
        notes: "Punto de salida más popular para carpoolings Valencia → Arenal Sound. 65 km al recinto.",
      },
      {
        name: "Valencia · Colón (Metro)",
        lat: 39.4701, lng: -0.3774,
        address: "Carrer de Jorge Juan, 19, 46004 Valencia",
        transport_access: "Metro L3, L5 Colón. Centro de Valencia.",
        notes: "Alternativa a Estación del Norte para conductores que salen del centro.",
      },
      {
        name: "Burriana · Recinto Arenal Sound",
        lat: 39.8872, lng: -0.0845,
        address: "Playa Arenal, Burriana, Castellón",
        transport_access: "Destino final en la playa. Parking de pago disponible.",
      },
    ],
    aggregateRating: {
      ratingValue: 4.8,
      bestRating: 5,
      reviewCount: 524,
    },
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
    startDate: "2026-08-13",
    endDate: "2026-08-17",
    typicalDates: "Segunda semana de agosto (edición 2026: 13–17 agosto)",
    capacity: "60.000 personas/día",
    blurb:
      "Medusa Festival es el mayor festival de música electrónica de España, celebrado en la playa de Cullera (Valencia) desde 2012, con 60.000 fans de techno, house y electrónica durante 5 días con el mar Mediterráneo al fondo. El recinto se encuentra a 45 km al sur de Valencia (por la V-31 y la CV-500), con acceso en autobús metropolitano desde Valencia hasta Cullera y lanzadera final hasta la playa, pero el servicio se interrumpe en la madrugada y no hay transporte nocturno desde Alicante, Madrid o Zaragoza. La zona de camping del festival aloja a la mayoría de los asistentes de fuera de la Comunidad Valenciana, que llegan habitualmente en coche compartido por ConcertRide para evitar la complejidad de combinar trenes y autobuses con equipo de camping.",
    ogImage: "/og/medusa-festival.png",
    originCities: [
      { city: "Valencia", km: 45, drivingTime: "40 min", concertRideRange: "3–5 €/asiento" },
      { city: "Madrid", km: 385, drivingTime: "3h 30 min", concertRideRange: "10–14 €/asiento" },
      { city: "Barcelona", km: 375, drivingTime: "3h 30 min", concertRideRange: "10–14 €/asiento" },
      { city: "Alicante", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Zaragoza", km: 320, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Murcia", km: 180, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Castellón de la Plana", km: 105, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Tarragona", km: 380, drivingTime: "3h 30 min", concertRideRange: "10–14 €/asiento" },
      { city: "Bilbao", km: 605, drivingTime: "5h 15 min", concertRideRange: "15–21 €/asiento" },
      { city: "Pamplona", km: 430, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Sevilla", km: 600, drivingTime: "5h 15 min", concertRideRange: "15–21 €/asiento" },
      { city: "Málaga", km: 590, drivingTime: "5h", concertRideRange: "15–21 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 580, drivingTime: "5h", concertRideRange: "15–20 €/asiento" },
      { city: "Logroño", km: 480, drivingTime: "4h 15 min", concertRideRange: "13–17 €/asiento" },
      { city: "Granada", km: 470, drivingTime: "4h 15 min", concertRideRange: "13–17 €/asiento" },
      { city: "Girona", km: 490, drivingTime: "4h 30 min", concertRideRange: "14–19 €/asiento" },
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
        q: "¿Cuándo es Medusa Festival 2026 y dónde está Cullera?",
        a: "Medusa Festival 2026 se celebra del 12 al 16 de agosto (5 días) en la Playa Marenys de Rafalcaid, Cullera (Valencia). Aforo: 60.000 personas/día — el mayor festival de electrónica de España. Coordenadas: 39.156 N, -0.246 W. Cullera está 45 km al sur de Valencia (40 min por la V-31 y la CV-500) y 100 km al norte de Alicante (1h por la AP-7).",
      },
      {
        q: "¿Cuánto cuesta el carpooling al Medusa Festival desde Valencia, Alicante o Madrid?",
        a: "El carpooling al Medusa Festival 2026 en ConcertRide cuesta desde Valencia (45 km, 40 min) 3–5 €/asiento, desde Alicante (100 km, 1h) 4–7 €, desde Madrid (385 km, 3h 30 min por A-3) 10–14 € y desde Barcelona (375 km, 3h 30 min por AP-7) 10–14 €. Es la única opción puerta a puerta con equipo de camping: el shuttle oficial desde Valencia tiene plazas limitadas y no opera fuera de las franjas de llegada/regreso.",
      },
    ],
    relatedFestivals: ["arenal-sound", "fib", "low-festival"],
    relatedBlogs: ["guia-transporte-vina-rock-2026", "autobuses-festivales-espana-2026", "como-volver-festival-madrugada"],
    aggregateRating: {
      ratingValue: 4.8,
      bestRating: 5,
      reviewCount: 401,
    },
  },

  {
    slug: "vina-rock",
    name: "Viña Rock",
    shortName: "Viña Rock",
    city: "Villarrobledo",
    citySlug: "madrid",
    region: "Castilla-La Mancha",
    venue: "Parque La Pulgosa",
    venueAddress: "Parque La Pulgosa, Ctra. Minaya s/n, 02600 Villarrobledo, Albacete",
    lat: 39.264,
    lng: -2.602,
    startDate: "2026-04-30",
    endDate: "2026-05-02",
    typicalDates: "Puente de mayo (edición 2026: 30 abril–2 mayo)",
    capacity: "50.000 personas/día",
    blurb:
      "Viña Rock es el festival de rock alternativo, punk y metal más longevo de España, celebrado en el Parque La Pulgosa de Villarrobledo (Albacete) desde 1996 en el puente de mayo. El recinto está situado en plena meseta manchega, a 190 km de Madrid (≈2 h por la A-3), 200 km de Valencia y 165 km de Alicante, sin ninguna línea de transporte público que llegue al recinto en horarios de festival. El único autobús / bus oficial es la lanzadera del propio festival desde la estación de autobuses de Albacete (50 km, 40 min). Los autobuses privados Madrid–Viña Rock (Viñarock) salen desde Méndez Álvaro o Nuevos Ministerios (35–55 €) con horario fijo. Con 50.000 asistentes diarios y una zona de camping de referencia, más del 80 % de los asistentes llegan en coche o en autobús; ConcertRide es la herramienta habitual para organizar el viaje compartido desde Madrid, Valencia o Alicante.",
    ogImage: "/og/vina-rock.png",
    originCities: [
      { city: "Madrid", km: 190, drivingTime: "1h 55 min", concertRideRange: "6–9 €/asiento" },
      { city: "Valencia", km: 200, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Albacete", km: 50, drivingTime: "40 min", concertRideRange: "3–5 €/asiento" },
      { city: "Alicante", km: 165, drivingTime: "1h 35 min", concertRideRange: "5–8 €/asiento" },
      { city: "Murcia", km: 155, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Cuenca", km: 100, drivingTime: "1h", concertRideRange: "4–6 €/asiento" },
      { city: "Barcelona", km: 500, drivingTime: "4h 45 min", concertRideRange: "13–18 €/asiento" },
      { city: "Sevilla", km: 430, drivingTime: "3h 45 min", concertRideRange: "12–16 €/asiento" },
      { city: "Zaragoza", km: 430, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Granada", km: 280, drivingTime: "2h 30 min", concertRideRange: "8–12 €/asiento" },
      { city: "Córdoba", km: 270, drivingTime: "2h 30 min", concertRideRange: "8–12 €/asiento" },
      { city: "Castellón de la Plana", km: 200, drivingTime: "2h", concertRideRange: "6–10 €/asiento" },
      { city: "Bilbao", km: 555, drivingTime: "5h", concertRideRange: "14–20 €/asiento" },
      { city: "Pamplona", km: 515, drivingTime: "4h 45 min", concertRideRange: "14–19 €/asiento" },
      { city: "Toledo", km: 140, drivingTime: "1h 25 min", concertRideRange: "5–8 €/asiento" },
      { city: "Valladolid", km: 305, drivingTime: "2h 45 min", concertRideRange: "9–13 €/asiento" },
      { city: "Salamanca", km: 265, drivingTime: "2h 30 min", concertRideRange: "8–12 €/asiento" },
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
        a: "Alicante–Villarrobledo son 165 km (1h 35 min por la A-31 hasta Albacete, luego N-322 hacia Villarrobledo). Con ConcertRide, el precio por asiento desde Alicante está entre 5 y 8 €. No existe autobús de línea regular Alicante–Villarrobledo en horarios de festival. La alternativa en transporte público sería tren MD Alicante–Albacete (1h 20 min, 12–20 €) más lanzadera oficial Albacete–La Pulgosa (40 min, 8–12 € si está disponible) — total unas 3h y 25–35 €. El coche compartido es más rápido y económico.",
      },
      {
        q: "¿Hay camping en Viña Rock?",
        a: "Sí. Viña Rock cuenta con una de las zonas de camping más grandes de los festivales españoles (capacidad para más de 30.000 acampados), incluida con el abono. Hay zonas Premium con duchas, parking de caravanas y servicio de furgonetas (camper). La mayoría de los asistentes llegan el miércoles tarde o jueves por la mañana y se quedan hasta el domingo. ConcertRide permite organizar ida miércoles-jueves y vuelta domingo coordinando solo dos viajes para los 4 días del puente de mayo.",
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
      {
        q: "¿Es seguro el carpooling al Viña Rock?",
        a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores antes de publicar viajes. El pago es en efectivo o Bizum el día del viaje — sin adelantos ni datos bancarios en la plataforma.",
      },
    ],
    relatedFestivals: ["mad-cool", "sonorama-ribera"],
    relatedBlogs: ["sonorama-ribera-2026-aranda-de-duero-guia", "autobuses-festivales-espana-2026"],
    transport_options: [
      { type: 'shuttle', provider: 'Autobús oficial Viña Rock', origin: 'Albacete', price_from: 8, price_to: 12, frequency: 'Días de festival', schedule: '14:00–06:00', notes: 'Plazas limitadas — comprar antes de que se agoten' },
      { type: 'bus', provider: 'ALSA', origin: 'Madrid', price_from: 14, price_to: 20, frequency: 'Varias salidas diarias', booking_url: 'https://www.alsa.es' },
      { type: 'train', provider: 'Renfe', origin: 'Madrid Atocha → Albacete', price_from: 12, price_to: 25, schedule: 'Consultar horarios Renfe', notes: 'Estación Albacete a 40 km del recinto — necesitas taxi o lanzadera desde Albacete' },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Madrid', price_from: 6, price_to: 9 },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Valencia', price_from: 6, price_to: 9 },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Alicante', price_from: 5, price_to: 8 },
    ],
    official_shuttle: {
      available: true,
      price_from: 8,
      pickup_points: ['Albacete — Estación de Autobuses', 'Albacete — Recinto Ferial'],
      notes: 'Lanzadera oficial desde Albacete incluida en algunos packs de abono. Consultar web oficial de Viña Rock.'
    },
    guide: {
      logistics: {
        gates_open: "13:00",
        last_entry: "23:00",
        parking_available: true,
        parking_price: "10–15 €/día",
        camping_available: false,
        camping_notes: "No hay zona de acampada oficial. Alojamiento en Villarrobledo (10 km) o Albacete (40 km).",
      },
      packing_list: [
        { item: "Protector solar FPS 50+", category: "esencial", notes: "La Mancha en mayo: sol directo sin sombra" },
        { item: "Ropa de abrigo / chaqueta", category: "esencial", notes: "Las noches en Villarrobledo bajan de 10°C en mayo" },
        { item: "Calzado cómodo cerrado", category: "esencial" },
        { item: "Botella de agua reutilizable", category: "esencial", notes: "Hay puntos de recarga gratuitos" },
        { item: "Tapones para los oídos", category: "esencial" },
        { item: "Powerbank", category: "comodidad" },
        { item: "Muda extra", category: "comodidad" },
        { item: "Efectivo y Bizum", category: "esencial", notes: "Para pagar el carpooling al conductor" },
        { item: "Silla plegable de camping", category: "opcional" },
        { item: "Impermeable ligero", category: "opcional" },
      ],
      venue_tips: [
        "El recinto es campo abierto — no hay zonas techadas. Lleva sombrero o gorra.",
        "Los escenarios principal y secundario están a 10 min a pie entre sí.",
        "Las colas para la barra se disparan entre actuaciones. Aprovecha los cambios de bolo.",
        "El parking gratuito está a 500 m de la entrada. Salir con coche es lento — coordina la vuelta con ConcertRide.",
        "El festival tiene zona de pérdida y encontrada en la carpa de información (entrada principal).",
      ],
      network_coverage: "Movistar y Orange tienen cobertura reforzada. Vodafone cae en momentos de alta concurrencia.",
      emergency_number: "112",
    },
    common_pickup_points: [
      {
        name: "Albacete · Estación de Autobuses",
        lat: 38.9946, lng: -1.8584,
        address: "Calle Marqués de Villores, 1, 02001 Albacete",
        transport_access: "Bus urbano L1, L3, L10. Punto de encuentro habitual para carpoolings de Madrid y Valencia.",
        notes: "40 km del recinto. Muchos conductores salen desde aquí a las 14:00–15:00.",
      },
      {
        name: "Albacete · Estación de Tren",
        lat: 38.9962, lng: -1.8585,
        address: "Pl. de la Estación, s/n, 02001 Albacete",
        transport_access: "Renfe AVE y MD desde Madrid (2h). A 5 min a pie de la estación de autobuses.",
        notes: "Punto de recogida muy popular para quienes llegan en AVE desde Madrid.",
      },
      {
        name: "Madrid · Estación de Atocha (Carpooling)",
        lat: 40.4065, lng: -3.6897,
        address: "Glorieta del Emperador Carlos V, 28045 Madrid",
        transport_access: "Metro L1 Atocha Renfe, múltiples líneas de bus.",
        notes: "Punto de salida preferido para carpoolings Madrid → Viña Rock. Coordinar por WhatsApp con el conductor.",
      },
      {
        name: "Villarrobledo · Entrada al Recinto La Pulgosa",
        lat: 39.2625, lng: -2.5974,
        address: "La Pulgosa, Villarrobledo, Albacete",
        transport_access: "Destino final. Parking gratuito disponible a 500 m.",
      },
    ],
    aggregateRating: {
      ratingValue: 4.7,
      bestRating: 5,
      reviewCount: 487,
    },
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
    ogImage: "/og/o-son-do-camino.png",
    originCities: [
      { city: "Santiago de Compostela", km: 5, drivingTime: "10 min", concertRideRange: "3–5 €/asiento" },
      { city: "A Coruña", km: 70, drivingTime: "50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Vigo", km: 90, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Pontevedra", km: 60, drivingTime: "45 min", concertRideRange: "3–5 €/asiento" },
      { city: "Oviedo", km: 295, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Madrid", km: 585, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Ferrol", km: 60, drivingTime: "50 min", concertRideRange: "3–5 €/asiento" },
      { city: "Lugo", km: 100, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "León", km: 290, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Gijón", km: 300, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Bilbao", km: 500, drivingTime: "4h 30 min", concertRideRange: "13–18 €/asiento" },
      { city: "Valladolid", km: 400, drivingTime: "3h 40 min", concertRideRange: "11–15 €/asiento" },
      { city: "Burgos", km: 410, drivingTime: "3h 45 min", concertRideRange: "11–15 €/asiento" },
      { city: "Santander", km: 480, drivingTime: "4h 15 min", concertRideRange: "13–18 €/asiento" },
      { city: "Barcelona", km: 1200, drivingTime: "11h", concertRideRange: "30–40 €/asiento" },
      { city: "Zaragoza", km: 760, drivingTime: "7h", concertRideRange: "19–27 €/asiento" },
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
      {
        q: "¿Es seguro el carpooling al O Son do Camiño?",
        a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es en efectivo o Bizum directamente al conductor el día del viaje. Sin adelantos ni datos bancarios en la plataforma.",
      },
    ],
    relatedFestivals: ["resurrection-fest"],
    relatedBlogs: ["medusa-festival-2026-cullera-transporte", "autobuses-festivales-espana-2026"],
    aggregateRating: {
      ratingValue: 4.6,
      bestRating: 5,
      reviewCount: 312,
    },
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
    ogImage: "/og/cala-mijas.png",
    originCities: [
      { city: "Málaga", km: 25, drivingTime: "25 min", concertRideRange: "3–5 €/asiento" },
      { city: "Marbella", km: 50, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Mijas", km: 30, drivingTime: "30 min", concertRideRange: "3–5 €/asiento" },
      { city: "Fuengirola", km: 35, drivingTime: "35 min", concertRideRange: "3–5 €/asiento" },
      { city: "Sevilla", km: 200, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Granada", km: 125, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Almería", km: 190, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Córdoba", km: 190, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Jaén", km: 150, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Madrid", km: 540, drivingTime: "4h 45 min", concertRideRange: "14–19 €/asiento" },
      { city: "Valencia", km: 640, drivingTime: "5h 30 min", concertRideRange: "16–22 €/asiento" },
      { city: "Cádiz", km: 200, drivingTime: "2h", concertRideRange: "6–10 €/asiento" },
      { city: "Huelva", km: 255, drivingTime: "2h 30 min", concertRideRange: "8–12 €/asiento" },
      { city: "Jerez de la Frontera", km: 220, drivingTime: "2h 10 min", concertRideRange: "7–11 €/asiento" },
      { city: "Barcelona", km: 920, drivingTime: "8h", concertRideRange: "23–32 €/asiento" },
      { city: "Badajoz", km: 430, drivingTime: "3h 45 min", concertRideRange: "12–17 €/asiento" },
      { city: "Cartagena", km: 370, drivingTime: "3h 15 min", concertRideRange: "10–15 €/asiento" },
      { city: "Logroño", km: 640, drivingTime: "5h 30 min", concertRideRange: "16–22 €/asiento" },
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
        a: "Córdoba–Cortijo de Torres (Málaga) son 190 km (2 horas por la A-45). Con ConcertRide, el precio por asiento desde Córdoba es de 6 a 9 €. El AVE Córdoba–Málaga tarda solo 50 minutos y cuesta 25–55 €, pero llega a María Zambrano (Málaga centro), a 5 km del recinto del Cortijo de Torres — desde allí hay que añadir taxi (12–18 €) o autobús urbano EMT (línea 16, 1,40 €, 25 min). El último AVE de vuelta sale antes de las 22:00, lo que descarta esta opción para una jornada completa de festival. El carpooling deja directamente en el recinto y permite vuelta a cualquier hora.",
      },
      {
        q: "¿Cómo llegar a Cala Mijas desde Sevilla?",
        a: "Sevilla–Cortijo de Torres (Málaga) son 200 km (2 horas por la A-92). Con ConcertRide, el precio por asiento desde Sevilla es de 6 a 9 €, con recogida habitual en Sevilla centro o Plaza de Armas. El tren Avant Sevilla–Málaga tarda 2h y cuesta 30–60 €, pero el último regresa de Málaga sobre las 21:30 (no compatible con los horarios del festival, que cierra a las 4:00–5:00). Además, hay que añadir taxi (25–40 €) o autobús desde Málaga María Zambrano hasta el recinto. El carpooling es la única opción que combina llegada directa al Cortijo y vuelta nocturna a Sevilla.",
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
      {
        q: "¿Es seguro el carpooling a Cala Mijas Fest?",
        a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es en efectivo o Bizum directamente al conductor el día del viaje. Sin adelantos ni datos bancarios en la plataforma.",
      },
    ],
    relatedFestivals: ["sonar", "primavera-sound"],
    relatedBlogs: ["festivales-galicia-2026-transporte", "autobuses-festivales-espana-2026"],
    aggregateRating: {
      ratingValue: 4.6,
      bestRating: 5,
      reviewCount: 218,
    },
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
    startDate: "2026-08-05",
    endDate: "2026-08-09",
    typicalDates: "Primera semana de agosto (edición 2026: 5–9 agosto)",
    capacity: "25.000 personas/día",
    blurb:
      "Sonorama Ribera es el festival de pop y rock español más querido del panorama independiente, celebrado en Aranda de Duero (Burgos) desde 1998. Con música de artistas en castellano y actuaciones únicas, convoca a fans de todo el país durante 4 días en agosto. Aranda de Duero está a 150 km de Madrid (por la A-1), 100 km de Valladolid y 70 km de Burgos, en plena Ribera del Duero, con una única línea de autobús Madrid–Aranda que no opera en horarios de madrugada y sin servicio de tren al municipio. El carpooling con ConcertRide es esencial para la mayoría de los asistentes que llegan de Madrid, Bilbao, Zaragoza o Valladolid, y se ha convertido en parte de la cultura del festival.",
    ogImage: "/og/sonorama-ribera.png",
    originCities: [
      { city: "Madrid", km: 150, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Valladolid", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Burgos", km: 70, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Bilbao", km: 185, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Zaragoza", km: 290, drivingTime: "2h 30 min", concertRideRange: "8–12 €/asiento" },
      { city: "Segovia", km: 125, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" },
      { city: "Salamanca", km: 130, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" },
      { city: "Logroño", km: 125, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" },
      { city: "Pamplona", km: 215, drivingTime: "2h", concertRideRange: "7–11 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 150, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Donostia", km: 250, drivingTime: "2h 20 min", concertRideRange: "7–11 €/asiento" },
      { city: "A Coruña", km: 530, drivingTime: "4h 45 min", concertRideRange: "14–19 €/asiento" },
      { city: "Barcelona", km: 545, drivingTime: "5h", concertRideRange: "14–20 €/asiento" },
      { city: "Santander", km: 195, drivingTime: "1h 55 min", concertRideRange: "6–10 €/asiento" },
      { city: "León", km: 175, drivingTime: "1h 45 min", concertRideRange: "6–9 €/asiento" },
      { city: "Oviedo", km: 310, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Sevilla", km: 570, drivingTime: "5h", concertRideRange: "14–20 €/asiento" },
      { city: "Granada", km: 560, drivingTime: "5h", concertRideRange: "14–20 €/asiento" },
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
        a: "Zaragoza–Aranda de Duero son 290 km (2h 30 min por la A-2 hasta Soria y luego la N-122 dirección Burgos, o por la A-2 + A-11 vía Valladolid en 3h). Con ConcertRide, el precio por asiento desde Zaragoza está entre 8 y 12 €. No existe autobús directo Zaragoza–Aranda ni conexión ferroviaria (la estación más cercana, Aranda-Montecillo, lleva cerrada al tráfico de pasajeros desde 2011). El coche compartido es la única opción práctica para los asistentes aragoneses.",
      },
      {
        q: "¿Cuándo es Sonorama Ribera 2026?",
        a: "Sonorama Ribera 2026 está previsto del 6 al 9 de agosto en Aranda de Duero (Burgos). Busca viajes en concertride.me.",
      },
      {
        q: "¿Hay camping en Sonorama Ribera?",
        a: "Sí. Sonorama dispone de zona de camping oficial habilitada por el Ayuntamiento de Aranda de Duero (Campo de fútbol municipal y campos anexos, junto al estadio El Montecillo), incluida en el abono. La capacidad es limitada — los abonos con camping suelen agotarse antes de las entradas de día. Adicionalmente, muchos asistentes alquilan apartamento o casa rural en Aranda y pueblos de la Ribera del Duero (Roa, Peñafiel, Burgos). Para esos casos, ConcertRide permite organizar viaje conjunto del grupo desde Madrid (5–8 €), Bilbao (6–9 €) o Valladolid (4–7 €).",
      },
      {
        q: "¿Cómo llegar a Sonorama desde Bilbao?",
        a: "Bilbao–Aranda de Duero son 185 km (2 horas por la AP-68/A-1). Por ConcertRide, el precio por asiento es de 6 a 9 €. El tren Bilbao–Burgos + autobús Burgos–Aranda es una alternativa pero con horarios muy restringidos.",
      },
      {
        q: "¿Es seguro el carpooling a Sonorama Ribera?",
        a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es en efectivo o Bizum directamente al conductor el día del viaje. Sin adelantos ni datos bancarios en la plataforma.",
      },
    ],
    relatedFestivals: ["mad-cool", "vina-rock", "bbk-live"],
    relatedBlogs: ["como-ir-sonorama-ribera-2026-carpooling", "autobuses-festivales-espana-2026", "cuanto-cuesta-ir-festival-espana-presupuesto-2026"],
    aggregateRating: {
      ratingValue: 4.5,
      bestRating: 5,
      reviewCount: 183,
    },
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
    ogImage: "/og/zevra-festival.png",
    originCities: [
      { city: "Valencia", km: 10, drivingTime: "15 min", concertRideRange: "3–5 €/asiento" },
      { city: "Valencia Centro", km: 5, drivingTime: "10 min", concertRideRange: "3–5 €/asiento" },
      { city: "Madrid", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Alicante", km: 175, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Murcia", km: 210, drivingTime: "2h", concertRideRange: "7–10 €/asiento" },
      { city: "Barcelona", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Castellón de la Plana", km: 75, drivingTime: "50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Zaragoza", km: 315, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Bilbao", km: 590, drivingTime: "5h 15 min", concertRideRange: "15–21 €/asiento" },
      { city: "Pamplona", km: 430, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Tarragona", km: 260, drivingTime: "2h 30 min", concertRideRange: "8–12 €/asiento" },
      { city: "Sevilla", km: 600, drivingTime: "5h 15 min", concertRideRange: "15–21 €/asiento" },
      { city: "Granada", km: 505, drivingTime: "4h 30 min", concertRideRange: "14–19 €/asiento" },
      { city: "Málaga", km: 610, drivingTime: "5h 20 min", concertRideRange: "15–21 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 575, drivingTime: "5h", concertRideRange: "15–20 €/asiento" },
      { city: "Logroño", km: 475, drivingTime: "4h 15 min", concertRideRange: "13–17 €/asiento" },
      { city: "Donostia", km: 590, drivingTime: "5h 15 min", concertRideRange: "15–21 €/asiento" },
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
      {
        q: "¿Es seguro el carpooling a Zevra Festival?",
        a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es en efectivo o Bizum directamente al conductor el día del viaje. Sin adelantos ni datos bancarios en la plataforma.",
      },
    ],
    relatedFestivals: ["medusa-festival", "arenal-sound", "fib"],
    transport_options: [
      { type: 'train', provider: 'Metrovalencia L4', origin: 'Centro de Valencia', price_from: 1, price_to: 2, frequency: 'Cada 10–15 min (ampliado en noches de festival hasta ~2:00)', schedule: '06:00–01:30 (ampliado festivos)', notes: 'Metro ligero. Paradas Marítim-Serreria o Neptú, a 5–8 min a pie del recinto.' },
      { type: 'bus', provider: 'EMT Valencia', origin: 'Centro de Valencia', price_from: 1, price_to: 2, frequency: 'Líneas 19 y 95, horario diurno y parte del nocturno', notes: 'No cubre las salidas más tardías de madrugada.' },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Madrid', price_from: 10, price_to: 14 },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Alicante', price_from: 5, price_to: 8 },
      { type: 'carpooling', provider: 'ConcertRide', origin: 'Barcelona', price_from: 10, price_to: 14 },
    ],
    official_shuttle: {
      available: false,
      notes: 'No hay lanzadera oficial. Acceso recomendado: metro L4 (Marítim-Serreria o Neptú) desde el centro de Valencia. Parking en Moll de la Duana limitado en días de festival.',
    },
    common_pickup_points: [
      {
        name: 'Valencia · Estació del Nord',
        lat: 39.4652, lng: -0.3774,
        address: 'Carrer de Xàtiva, 24, 46007 Valencia',
        transport_access: 'Metro L3, L5 Xàtiva. Cercanías C4.',
        notes: 'Punto de salida habitual para carpoolings Madrid/Alicante → Zevra.',
      },
      {
        name: 'La Marina de València · Moll de la Duana',
        lat: 39.457, lng: -0.336,
        address: 'Moll de la Duana, 46024 Valencia',
        transport_access: 'Metro L4 Marítim-Serreria (5 min a pie). Bus EMT 19 y 95.',
        notes: 'Recinto del festival. Parking público disponible (2–3 €/h).',
      },
    ],
    aggregateRating: {
      ratingValue: 4.5,
      bestRating: 5,
      reviewCount: 196,
    },
  },

  {
    slug: "low-festival",
    name: "Low Festival",
    shortName: "Low Festival",
    city: "Torrevieja",
    citySlug: "alicante",
    region: "Comunidad Valenciana",
    venue: "Recinto El Molino de Agua, Torrevieja",
    venueAddress: "Calle del Molino de Agua, 03181 Torrevieja, Alicante",
    lat: 37.9852,
    lng: -0.6873,
    startDate: "2026-07-31",
    endDate: "2026-08-02",
    typicalDates: "Finales de julio / principios de agosto (edición 2026: 31 julio–2 agosto)",
    capacity: "20.000 personas/día",
    blurb:
      "Low Festival es el festival indie de Benidorm, celebrado junto al mar en la costa alicantina desde 2012. Combina artistas de pop independiente, folk y alternativo en un ambiente familiar y luminoso a pie de playa. El recinto del Balneario de la Paloma está en el paseo marítimo de Benidorm, a 45 km de Alicante (por la A-70 y la N-332) y a 150 km de Valencia (por la AP-7). Benidorm tiene conexión de TRAM Metropolità d'Alacant desde Alicante (línea L1, 1h 20 min, frecuencia horaria), pero el servicio se interrumpe cerca de la medianoche, lo que deja sin transporte a los asistentes que salen de los conciertos a las 2:00–3:00. Los fans de Valencia, Madrid o Murcia llegan habitualmente en coche compartido con ConcertRide.",
    ogImage: "/og/low-festival.png",
    originCities: [
      { city: "Alicante", km: 45, drivingTime: "35 min", concertRideRange: "3–5 €/asiento" },
      { city: "Valencia", km: 150, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Murcia", km: 90, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Madrid", km: 440, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Barcelona", km: 500, drivingTime: "4h 30 min", concertRideRange: "13–18 €/asiento" },
      { city: "Castellón de la Plana", km: 140, drivingTime: "1h 20 min", concertRideRange: "5–8 €/asiento" },
      { city: "Zaragoza", km: 395, drivingTime: "3h 40 min", concertRideRange: "11–15 €/asiento" },
      { city: "Granada", km: 430, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Sevilla", km: 590, drivingTime: "5h 15 min", concertRideRange: "15–21 €/asiento" },
      { city: "Bilbao", km: 625, drivingTime: "5h 30 min", concertRideRange: "16–22 €/asiento" },
      { city: "Pamplona", km: 490, drivingTime: "4h 30 min", concertRideRange: "13–18 €/asiento" },
      { city: "Albacete", km: 130, drivingTime: "1h 20 min", concertRideRange: "5–8 €/asiento" },
      { city: "Toledo", km: 360, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Tarragona", km: 370, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Donostia", km: 700, drivingTime: "6h", concertRideRange: "18–25 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 590, drivingTime: "5h 15 min", concertRideRange: "15–20 €/asiento" },
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
        a: "Madrid–Benidorm son 440 km (4 horas por la A-3 hasta Valencia y luego la AP-7 / A-70). Con ConcertRide, el precio por asiento desde Madrid está entre 12 y 17 €, con recogida habitual en Atocha o Méndez Álvaro. El autobús de larga distancia Madrid–Benidorm (ALSA, vía Albacete y Alicante) tarda 5–6 h y cuesta 20–35 €, pero no cubre horarios de madrugada. No hay tren directo: Renfe AVE Madrid–Alicante (2h 25 min, 30–80 €) más TRAM L1 Alicante–Benidorm (1h 20 min, 6 €) suma 4h y 35–85 €, pero el último TRAM sale antes de la 1:00 y no permite cubrir los conciertos hasta el cierre.",
      },
      {
        q: "¿Cómo ir a Low Festival desde Barcelona?",
        a: "Barcelona–Benidorm son 500 km (4h 30 min por la AP-7 y la A-70). Con ConcertRide, el precio por asiento desde Barcelona está entre 13 y 18 €. El tren Barcelona–Alicante + TRAM hasta Benidorm es una alternativa viable para el viaje de ida, pero la vuelta de madrugada es imposible en transporte público.",
      },
      {
        q: "¿Hay transporte público desde Valencia a Low Festival?",
        a: "Valencia–Benidorm son 150 km (1h 30 min por la AP-7). Las opciones de transporte público son: 1) Tren Renfe Euromed Valencia–Alicante (1h 45 min, 20–35 €) + TRAM L1 Alicante–Benidorm (1h 20 min, 6 €), pero el último TRAM cierra antes de la 1:00 y el viaje completo supera las 3h. 2) Autobús ALSA / Avanzabus Valencia–Benidorm (2h, 10–18 €, varias salidas diarias) — no opera de madrugada. 3) Coche compartido con ConcertRide (5–8 €/asiento, llegada directa al paseo marítimo, vuelta a la hora que pactes con el conductor) es la opción más usada por los valencianos.",
      },
      {
        q: "¿Cuándo es Low Festival 2026?",
        a: "Low Festival 2026 está previsto para el 24, 25 y 26 de julio en el Balneario de la Paloma, Benidorm (Alicante). Busca viajes en concertride.me.",
      },
      {
        q: "¿Es seguro el carpooling a Low Festival?",
        a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es en efectivo o Bizum directamente al conductor el día del viaje. Sin adelantos ni datos bancarios en la plataforma.",
      },
    ],
    relatedFestivals: ["fib", "arenal-sound", "medusa-festival"],
    aggregateRating: {
      ratingValue: 4.6,
      bestRating: 5,
      reviewCount: 241,
    },
  },

  {
    slug: "tomavistas",
    name: "Tomavistas Festival",
    shortName: "Tomavistas",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    venue: "Jardines del Buen Retiro",
    venueAddress: "Paseo de la Argentina, s/n, 28009 Madrid",
    lat: 40.4153,
    lng: -3.6843,
    startDate: "2026-05-15",
    endDate: "2026-05-17",
    typicalDates: "Segunda quincena de mayo",
    capacity: "25.000 personas/día",
    announcement: {
      text: "Tomavistas Festival ha sido cancelado definitivamente. La empresa organizadora inició procedimientos de insolvencia a principios de 2026 y el festival no celebrará edición ese año ni en el futuro inmediato.",
      expires: "2027-06-01",
    },
    blurb:
      "Tomavistas fue el festival de indie y pop alternativo de Madrid, celebrado cada primavera en los Jardines del Buen Retiro desde 2014. Con artistas de primer nivel nacional e internacional y 25.000 asistentes diarios, es la apertura de la temporada de festivales madrileña. El recinto es accesible en metro (L2 parada Retiro o L9 parada Ibiza) y tiene buena comunicación con el centro de Madrid. Sin embargo, los asistentes de otras provincias — Toledo, Guadalajara, Valencia, Zaragoza — prefieren el coche compartido con ConcertRide para llegar directamente al Retiro y organizar la vuelta a cualquier hora de la madrugada, cuando el último metro puede no coincidir con el fin de los conciertos.",
    ogImage: "/og/tomavistas.png",
    originCities: [
      { city: "Madrid", km: 15, drivingTime: "25 min", concertRideRange: "4–7 €/asiento" },
      { city: "Centro de Madrid", km: 8, drivingTime: "20 min", concertRideRange: "3–6 €/asiento" },
      { city: "Toledo", km: 75, drivingTime: "55 min", concertRideRange: "4–7 €/asiento" },
      { city: "Guadalajara", km: 60, drivingTime: "50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Salamanca", km: 210, drivingTime: "2h", concertRideRange: "7–11 €/asiento" },
      { city: "Segovia", km: 90, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Valladolid", km: 195, drivingTime: "2h", concertRideRange: "6–10 €/asiento" },
      { city: "Ávila", km: 110, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" },
      { city: "Burgos", km: 240, drivingTime: "2h 15 min", concertRideRange: "7–11 €/asiento" },
      { city: "Alicante", km: 430, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Murcia", km: 480, drivingTime: "4h 30 min", concertRideRange: "13–18 €/asiento" },
      { city: "Bilbao", km: 395, drivingTime: "3h 30 min", concertRideRange: "11–16 €/asiento" },
      { city: "Pamplona", km: 390, drivingTime: "3h 30 min", concertRideRange: "11–15 €/asiento" },
      { city: "Barcelona", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Sevilla", km: 525, drivingTime: "4h 45 min", concertRideRange: "14–19 €/asiento" },
      { city: "Santander", km: 390, drivingTime: "3h 30 min", concertRideRange: "11–15 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo ir a Tomavistas desde el centro de Madrid?",
        a: "Tomavistas se celebra en los Jardines del Buen Retiro (Paseo de la Argentina). Acceso en metro: línea L2 parada Retiro (5 min a pie desde la entrada norte) o L9 parada Ibiza (8 min). Desde Sol son 15–20 minutos en metro. Con ConcertRide, los asistentes que se organizan en grupo desde barrios de Madrid (4–7 €/asiento) coordinan ida y vuelta sin depender del último metro (≈1:30).",
      },
      {
        q: "¿Hay transporte público nocturno de vuelta de Tomavistas?",
        a: "El metro de Madrid cierra a la 1:30, justo cuando termina la última actuación. Los autobuses nocturnos (búhos) N9 y N15 paran cerca del Retiro por Cibeles y Goya, con frecuencia cada 30 min. Taxi/VTC desde el Retiro al centro cuesta 8–15 € y a barrios periféricos 15–25 €. Para vuelta a Toledo (75 km), Guadalajara (60 km) o Segovia (90 km), ConcertRide es la opción más práctica: 3–7 €/asiento, sin horario rígido.",
      },
      {
        q: "¿Hay lanzadera oficial o shuttle de Tomavistas?",
        a: "Tomavistas no opera lanzaderas propias. El acceso oficial es por metro L2 (parada Retiro) o L9 (Ibiza), líneas 9, 15, 19, 20, 51 de autobús EMT, y la línea 14 que pasa por Menéndez Pelayo. Los asistentes de otras provincias (Toledo, Guadalajara, Valencia, Segovia) coordinan el viaje completo con ConcertRide, evitando combinaciones AVE + metro.",
      },
      {
        q: "¿Hay parking cerca del Retiro durante Tomavistas?",
        a: "El Retiro no tiene parking propio. Las opciones son los parkings de pago en superficie y subterráneos del entorno: Plaza de Cibeles (3 €/h), Plaza de Independencia (Puerta de Alcalá, 3 €/h), Pl. de las Cortes (2,80 €/h) o Conde de Casal (2,50 €/h). Una jornada completa cuesta entre 25 y 40 €. Para asistentes de fuera de Madrid, llegar con ConcertRide ahorra el coste del parking y la búsqueda en el centro saturado.",
      },
      {
        q: "¿Cómo ir a Tomavistas desde Valencia?",
        a: "Valencia–Madrid (Retiro) son 355 km (3h 20 min por la A-3). Con ConcertRide, el precio por asiento desde Valencia es de 10 a 14 €. El AVE Valencia–Atocha tarda 1h 35 min y cuesta 25–60 €, más metro L1 hasta Sol y L2 a Retiro (15 min). El carpooling deja directamente cerca del Retiro y permite volver a la hora que prefieras.",
      },
      {
        q: "¿Cuándo es Tomavistas 2026?",
        a: "Tomavistas Festival 2026 está previsto para el 15, 16 y 17 de mayo en los Jardines del Buen Retiro (Paseo de la Argentina, s/n, 28009 Madrid). El festival arranca habitualmente sobre las 17:00 y termina en torno a la 1:00. Busca viajes en concertride.me/festivales/tomavistas.",
      },
      {
        q: "¿Es seguro el carpooling a Tomavistas?",
        a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es en efectivo o Bizum directamente al conductor el día del viaje. Sin adelantos ni datos bancarios en la plataforma.",
      },
    ],
    relatedFestivals: ["mad-cool", "sonorama-ribera"],
    aggregateRating: {
      ratingValue: 4.5,
      bestRating: 5,
      reviewCount: 167,
    },
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
    startDate: "2026-07-08",
    endDate: "2026-07-11",
    typicalDates: "Segunda semana de julio (edición 2026: 8–11 julio)",
    capacity: "30.000 personas/día",
    blurb:
      "Cruïlla Barcelona es el festival de música del mundo, pop y alternativo más ecléctico del verano barcelonés, celebrado cada julio en el Parc del Fòrum desde 2008. Combina artistas de world music, reggae, hip-hop, pop y rock en cuatro días en el mismo espacio portuario de Sant Adrià de Besòs que alberga Primavera Sound, con 30.000 asistentes diarios y un ambiente familiar. El recinto comparte la misma situación de transporte que Primavera Sound: el metro L4 (parada Besòs Mar) llega al Fòrum en 10 minutos a pie, pero las salidas de madrugada generan colas de 30–45 minutos, y los asistentes de Madrid, Valencia o Zaragoza que vienen expresamente para el festival prefieren el carpooling con ConcertRide para llegar directamente y organizar la vuelta de forma flexible.",
    ogImage: "/og/cruilla.png",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 306, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Tarragona", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Lleida", km: 170, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Girona", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Bilbao", km: 615, drivingTime: "5h", concertRideRange: "15–20 €/asiento" },
      { city: "Pamplona", km: 415, drivingTime: "3h 45 min", concertRideRange: "12–17 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 540, drivingTime: "4h 45 min", concertRideRange: "14–19 €/asiento" },
      { city: "Donostia", km: 565, drivingTime: "5h", concertRideRange: "15–20 €/asiento" },
      { city: "Alicante", km: 510, drivingTime: "4h 30 min", concertRideRange: "14–19 €/asiento" },
      { city: "Murcia", km: 620, drivingTime: "5h 30 min", concertRideRange: "16–22 €/asiento" },
      { city: "Sevilla", km: 1000, drivingTime: "9h", concertRideRange: "25–35 €/asiento" },
      { city: "Málaga", km: 920, drivingTime: "8h", concertRideRange: "23–32 €/asiento" },
      { city: "Santander", km: 625, drivingTime: "5h 30 min", concertRideRange: "16–22 €/asiento" },
      { city: "A Coruña", km: 1100, drivingTime: "10h", concertRideRange: "28–38 €/asiento" },
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
        a: "Cruïlla no opera shuttle oficial desde otras ciudades. El acceso principal al recinto es el metro L4 (parada Besòs Mar, 10 min a pie) y los buses nocturnos N6, N7 y N11 de TMB hasta la Rambla del Prim. En el interior del recinto, el festival utiliza un sistema de microbuses gratuitos entre escenarios para facilitar el movimiento del aforo. Los asistentes que vienen de Madrid, Valencia, Zaragoza o el resto de Cataluña combinan AVE/Avant + metro L4, o coche compartido con ConcertRide para llegar directamente al recinto sin transbordos.",
      },
      {
        q: "¿Cuánto cuesta ir a Cruïlla desde Valencia?",
        a: "Valencia–Barcelona (Parc del Fòrum) son 355 km (3h 15 min por la AP-7). Con ConcertRide, el precio por asiento desde Valencia está entre 10 y 14 €, con recogida en Estació del Nord, Av. de Burjassot o cualquier barrio acordado. El tren AVE/Euromed Valencia–Barcelona Sants cuesta 20–60 €, tarda 3h y exige añadir metro L4 hasta Besòs Mar (35 min, 2,55 €) — más de 4h totales y mucho más caro. El último AVE de vuelta a Valencia sale sobre las 20:00, incompatible con los horarios del Cruïlla (cierre 3:00–4:00). El carpooling permite llegar directamente con todo el equipaje y volver cuando lo pacte el grupo.",
      },
      {
        q: "¿En qué fechas es Cruïlla 2026?",
        a: "Cruïlla Barcelona 2026 está previsto para el 9, 10, 11 y 12 de julio en el Parc del Fòrum de Barcelona. Busca viajes en concertride.me para esas fechas.",
      },
      {
        q: "¿Es seguro el carpooling a Cruïlla?",
        a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es en efectivo o Bizum directamente al conductor el día del viaje. Sin adelantos ni datos bancarios en la plataforma.",
      },
    ],
    relatedFestivals: ["primavera-sound", "sonar"],
    aggregateRating: {
      ratingValue: 4.6,
      bestRating: 5,
      reviewCount: 278,
    },
  },
  {
    slug: "vive-latino",
    name: "Vive Latino España",
    shortName: "Vive Latino",
    city: "Zaragoza",
    citySlug: "zaragoza",
    region: "Aragón",
    venue: "Recinto Expo Zaragoza",
    venueAddress: "Av. de la Economía Social y del Medioambiente, 50018 Zaragoza",
    lat: 41.6560,
    lng: -0.9380,
    startDate: "2026-09-04",
    endDate: "2026-09-05",
    typicalDates: "Primera semana de septiembre (edición 2026: 4–5 septiembre)",
    capacity: "40.000 personas/día",
    blurb: "Vive Latino España es la primera edición europea del festival de música latinoamericana más importante del mundo, fundado en México DF en 1998. Zaragoza acoge esta edición histórica el 4 y 5 de septiembre de 2026 en el Recinto Expo, con capacidad para 40.000 personas por jornada y un cartel centrado en rock alternativo, cumbia, reggaeton y pop en español. Zaragoza es el hub estratégico del festival: equidistante de Madrid (330 km), Barcelona (306 km) y Bilbao (324 km), lo que facilita el carpooling desde toda España. El Recinto Expo, sede de la Exposición Internacional de 2008, cuenta con acceso directo desde la ronda de circunvalación Z-40 y parking para más de 5.000 vehículos. Con ConcertRide, los fans desde Madrid llegan por 9–13 €/asiento, sin comisión de plataforma.",
    ogImage: "/og/vive-latino.png",
    originCities: [
      { city: "Madrid", km: 330, drivingTime: "3h 00 min", concertRideRange: "9–13 €/asiento" },
      { city: "Barcelona", km: 306, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Valencia", km: 325, drivingTime: "3h 00 min", concertRideRange: "9–13 €/asiento" },
      { city: "Bilbao", km: 324, drivingTime: "3h 00 min", concertRideRange: "9–13 €/asiento" },
      { city: "Pamplona", km: 177, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Logroño", km: 172, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Lleida", km: 153, drivingTime: "1h 30 min", concertRideRange: "4–7 €/asiento" },
      { city: "Tarragona", km: 240, drivingTime: "2h 15 min", concertRideRange: "7–11 €/asiento" },
      { city: "Teruel", km: 175, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Huesca", km: 73, drivingTime: "0h 45 min", concertRideRange: "3–5 €/asiento" },
      { city: "Burgos", km: 290, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Donostia", km: 314, drivingTime: "3h 00 min", concertRideRange: "9–13 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 265, drivingTime: "2h 30 min", concertRideRange: "8–11 €/asiento" },
      { city: "Santander", km: 390, drivingTime: "3h 30 min", concertRideRange: "11–15 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Qué es el Vive Latino España 2026?",
        a: "El Vive Latino España 2026 es la primera edición europea del festival de música latinoamericana Vive Latino, fundado en México DF en 1998 y el mayor festival de rock y pop latino del mundo. Se celebra el 4 y 5 de septiembre de 2026 en el Recinto Expo de Zaragoza, con capacidad para 40.000 personas por día y un cartel que mezcla rock alternativo, cumbia, reggaeton y pop en español.",
      },
      {
        q: "¿Cómo llegar al Vive Latino en Zaragoza desde Madrid?",
        a: "Madrid–Zaragoza son 330 km (3h en coche por la A-2/AP-2). Con ConcertRide, el precio por asiento desde Madrid está entre 9 y 13 €. El AVE Madrid–Zaragoza cuesta entre 15 y 40 € y tarda 1h 20 min, llegando a la Estación Delicias, a 5 km del Recinto Expo. El carpooling con ConcertRide ofrece llegada directa al festival desde cualquier punto de Madrid sin trasbordos ni cola de taxi.",
      },
      {
        q: "¿Cómo llegar al Vive Latino desde Barcelona?",
        a: "Barcelona–Zaragoza son 306 km (2h 45 min por la AP-2). Con ConcertRide, el precio por asiento desde Barcelona está entre 8 y 12 €. El AVE Barcelona–Zaragoza tarda 1h 40 min (15–35 €), llegando a la Estación Delicias, a 5 km del Recinto Expo. El carpooling es la opción más directa y económica para llegar al festival.",
      },
      {
        q: "¿Cómo llegar al Vive Latino desde ciudades cercanas a Zaragoza (Huesca, Teruel, Pamplona, Logroño)?",
        a: "Zaragoza es el hub central del Vive Latino España: Huesca está a solo 73 km (45 min), con ConcertRide entre 3 y 5 €/asiento. Teruel a 175 km (1h 45 min, 5–8 €). Pamplona a 177 km (1h 45 min, 5–8 €). Logroño a 172 km (1h 45 min, 5–8 €). Estas provincias tienen alta demanda de carpooling y poca oferta de transporte colectivo directo: ConcertRide es la opción principal.",
      },
      {
        q: "¿Hay transporte público al Recinto Expo desde el centro de Zaragoza?",
        a: "El Recinto Expo de Zaragoza está en el barrio de Valdespartera/Expo, a unos 5 km del centro. El autobús urbano de la ZTM (líneas al Expo) conecta la Estación Delicias con el recinto en unos 15 minutos. En noches de festival (vuelta 02:00–04:00) los autobuses nocturnos tienen frecuencia reducida; el carpooling nocturno con ConcertRide es la alternativa más práctica.",
      },
      {
        q: "¿Cuánto cuesta la entrada al Vive Latino España 2026?",
        a: "Las entradas al Vive Latino España 2026 están disponibles en la web oficial del festival. El abono de dos días oscila entre 70 y 120 €. La entrada de día está entre 45 y 70 €. El carpooling con ConcertRide añade un coste mínimo: desde Madrid, entre 9 y 13 €/asiento; desde Barcelona, entre 8 y 12 €.",
      },
      {
        q: "¿Hay acampada en el Vive Latino Zaragoza?",
        a: "El Vive Latino España 2026 en el Recinto Expo no dispone de zona de acampada oficial. Se recomienda alojamiento en hoteles del centro de Zaragoza (a 5 km del recinto) o en Airbnb. Muchos asistentes de fuera organizan el viaje de ida y vuelta en el mismo día usando ConcertRide, especialmente desde Madrid o Barcelona.",
      },
      {
        q: "¿Es mejor ir al Vive Latino en coche propio o en carpooling?",
        a: "El Recinto Expo de Zaragoza tiene parking para más de 5.000 vehículos, pero en el contexto de un festival de 40.000 personas los accesos se saturan. El carpooling con ConcertRide permite llegar en grupo, compartir gastos (gasolina + peajes por la AP-2: unos 40–55 € de Madrid a Zaragoza ida y vuelta en total) y coordinar la vuelta a la hora que el conductor y los pasajeros acuerden. El precio por asiento en ConcertRide cubre una parte proporcional del coste real.",
      },
    ],
    relatedFestivals: ["mad-cool", "primavera-sound"],
    transport_options: [
      {
        type: "carpooling",
        provider: "ConcertRide",
        origin: "Madrid",
        price_from: 9,
        price_to: 13,
        frequency: "Bajo demanda (publicar/buscar con antelación)",
        schedule: "Flexible — acordar con conductor",
        booking_url: "https://concertride.me/festivales/vive-latino",
        notes: "0% comisión. Llegada directa al Recinto Expo.",
      },
      {
        type: "carpooling",
        provider: "ConcertRide",
        origin: "Barcelona",
        price_from: 8,
        price_to: 12,
        frequency: "Bajo demanda",
        schedule: "Flexible",
        booking_url: "https://concertride.me/festivales/vive-latino",
        notes: "Alta demanda prevista desde el área metropolitana de Barcelona.",
      },
      {
        type: "train",
        provider: "Renfe AVE",
        origin: "Madrid",
        price_from: 15,
        price_to: 40,
        frequency: "Cada hora aprox.",
        schedule: "05:30–21:30 (último Madrid→Zaragoza)",
        notes: "Estación Delicias → Recinto Expo: 5 km en taxi/bus urbano. No hay trenes de vuelta después de las 23:00.",
      },
      {
        type: "train",
        provider: "Renfe AVE",
        origin: "Barcelona",
        price_from: 15,
        price_to: 35,
        frequency: "Cada 30–60 min",
        schedule: "06:00–22:00",
        notes: "Estación Sants → Zaragoza Delicias en 1h 40 min.",
      },
    ],
    aggregateRating: {
      ratingValue: 4.7,
      bestRating: 5,
      reviewCount: 195,
    },
  },
  {
    slug: "festival-de-les-arts",
    name: "Festival de les Arts",
    shortName: "Les Arts",
    city: "Valencia",
    citySlug: "valencia",
    region: "Comunidad Valenciana",
    venue: "Ciudad de las Artes y las Ciencias",
    venueAddress: "Autopista del Saler, s/n, 46013 Valencia",
    lat: 39.4547,
    lng: -0.3500,
    startDate: "2026-06-05",
    endDate: "2026-06-06",
    typicalDates: "Último fin de semana de mayo / primer fin de semana de junio",
    capacity: "25.000 personas/día",
    blurb: "El Festival de les Arts es el mayor evento musical de la Comunidad Valenciana, celebrado cada primavera en el icónico entorno de la Ciudad de las Artes y las Ciencias de Valencia. Con artistas de talla internacional y española, el festival atrae a 25.000 asistentes diarios de toda la región y de las provincias limítrofes. Con ConcertRide, los fans desde Alicante llegan por 5–8 €/asiento, sin comisión.",
    ogImage: "/og/festival-de-les-arts.png",
    originCities: [
      { city: "Madrid", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Barcelona", km: 349, drivingTime: "3h 00 min", concertRideRange: "10–14 €/asiento" },
      { city: "Alicante", km: 166, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Castellón", km: 75, drivingTime: "0h 45 min", concertRideRange: "3–5 €/asiento" },
      { city: "Murcia", km: 248, drivingTime: "2h 15 min", concertRideRange: "7–11 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h 00 min", concertRideRange: "9–13 €/asiento" },
      { city: "Tarragona", km: 255, drivingTime: "2h 15 min", concertRideRange: "7–11 €/asiento" },
      { city: "Cuenca", km: 218, drivingTime: "2h 00 min", concertRideRange: "6–10 €/asiento" },
      { city: "Albacete", km: 191, drivingTime: "1h 45 min", concertRideRange: "6–9 €/asiento" },
      { city: "Gandia", km: 65, drivingTime: "0h 45 min", concertRideRange: "3–5 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Festival de les Arts en Valencia?",
        a: "El festival se celebra en la Ciudad de las Artes y las Ciencias de Valencia. Transporte público: Metro líneas 3, 5 y 7 (parada Alameda o Àngel Guimerà, 10 min a pie); autobuses urbanos EMT 1, 19, 35 y 40 pasan por la Av. Autopista del Saler. El carpooling con ConcertRide es la opción preferida para asistentes de Alicante, Castellón, Murcia y Madrid.",
      },
      {
        q: "¿Qué artistas actúan en el Festival de les Arts 2026?",
        a: "El Festival de les Arts 2026 combina artistas de pop, indie, electrónica y música española. Los cabezas de cartel se anuncian habitualmente en enero-febrero del año del festival. Consulta la web oficial del Festival de les Arts para el lineup completo.",
      },
      {
        q: "¿Hay parking en la Ciudad de las Artes y las Ciencias para el Festival de les Arts?",
        a: "La Ciudad de las Artes y las Ciencias dispone de varios parking de pago en la zona (desde 2 €/hora). La organización recomienda llegar en transporte público (metro, autobús) o en carpooling para reducir la congestión de la Av. Autopista del Saler durante el festival.",
      },
      {
        q: "¿Cuánto cuesta ir al Festival de les Arts desde Alicante?",
        a: "Alicante–Valencia son 166 km (1h 30 min por la AP-7). Con ConcertRide, el precio por asiento desde Alicante está entre 5 y 8 €. El tren Euromed o Alaris Alicante–Valencia cuesta entre 8 y 20 € y tarda 1h 30 min, llegando a la Estació del Nord, a 15 min en metro del festival.",
      },
      {
        q: "¿Hay transporte nocturno de vuelta del Festival de les Arts?",
        a: "El metro de Valencia opera servicio ampliado hasta las 1:30–2:00 en noches de festival. Para volver de madrugada (3:00–5:00), el carpooling con ConcertRide es la opción más práctica: coordina la hora de vuelta directamente con el conductor.",
      },
    ],
    relatedFestivals: ["arenal-sound", "zevra-festival"],
    aggregateRating: {
      ratingValue: 4.7,
      bestRating: 5,
      reviewCount: 234,
    },
  },
  {
    slug: "festival-ortigueira",
    name: "Festival Internacional do Mundo Celta de Ortigueira",
    shortName: "Ortigueira",
    city: "Ortigueira",
    citySlug: "a-coruna",
    region: "Galicia",
    venue: "Alameda de Ortigueira (carpa principal y escenarios)",
    venueAddress: "Alameda Saturnino López Nogueira, 15330 Ortigueira (A Coruña)",
    lat: 43.6859,
    lng: -7.8512,
    startDate: "2026-07-09",
    endDate: "2026-07-12",
    typicalDates: "Segundo fin de semana de julio (edición 2026: 9–12 julio)",
    capacity: "100.000 asistentes acumulados (4 días, entrada gratuita)",
    blurb:
      "El Festival Internacional do Mundo Celta de Ortigueira es el mayor festival de música celta del sur de Europa, celebrado en la villa marinera de Ortigueira (A Coruña) cada segundo fin de semana de julio. Es de entrada gratuita y reúne a más de 100.000 asistentes a lo largo de cuatro días con conciertos en la Alameda y en escenarios distribuidos por el casco urbano. Ortigueira está a 100 km de A Coruña y a 30 km de Viveiro (Resurrection Fest), por lo que muchos asistentes encadenan ambos eventos. ConcertRide opera carpooling desde A Coruña, Vigo, Lugo y Madrid sin comisión.",
    ogImage: "/og-fallback.png",
    originCities: [
      { city: "A Coruña", km: 100, drivingTime: "1h 20 min", concertRideRange: "4–7 €/asiento" },
      { city: "Lugo", km: 110, drivingTime: "1h 30 min", concertRideRange: "4–7 €/asiento" },
      { city: "Vigo", km: 195, drivingTime: "2h 30 min", concertRideRange: "6–9 €/asiento" },
      { city: "Santiago de Compostela", km: 130, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Pontevedra", km: 175, drivingTime: "2h 15 min", concertRideRange: "6–9 €/asiento" },
      { city: "Ourense", km: 240, drivingTime: "3h 00 min", concertRideRange: "8–11 €/asiento" },
      { city: "Oviedo", km: 280, drivingTime: "3h 15 min", concertRideRange: "9–13 €/asiento" },
      { city: "Madrid", km: 690, drivingTime: "7h 00 min", concertRideRange: "18–25 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Es gratis el Festival de Ortigueira 2026?",
        a: "Sí. El Festival Internacional do Mundo Celta de Ortigueira es de entrada libre y gratuita en todos los escenarios. La organización se financia con patrocinios públicos (Concello de Ortigueira, Xunta de Galicia, Diputación de A Coruña) y privados. La capacidad es libre — no hay aforo cerrado por escenario.",
      },
      {
        q: "¿Cómo se llega a Ortigueira para el festival?",
        a: "Ortigueira no tiene estación de tren propia. La opción real es coche o carpooling: desde A Coruña 100 km (1h 20 min, AC-12 + AC-862), desde Lugo 110 km (1h 30 min, A-8), desde Vigo 195 km (2h 30 min). ALSA opera servicios A Coruña–Ortigueira y Lugo–Ortigueira pero con horarios limitados durante el festival. Carpooling ConcertRide desde 4 €/asiento, 0% comisión, vuelta de madrugada coordinada.",
      },
      {
        q: "¿Hay camping oficial en el Festival de Ortigueira?",
        a: "Sí. La organización habilita camping libre y gratuito en zonas señalizadas próximas al recinto durante los cuatro días del festival. Se recomienda llegar el miércoles o jueves para encontrar plaza. Hay además dos campings privados en la zona y alojamientos en Ortigueira pueblo (limitados — reservar con meses de antelación).",
      },
      {
        q: "¿Se puede combinar Ortigueira con Resurrection Fest?",
        a: "Sí. Ortigueira (9–12 jul 2026) y Resurrection Fest Viveiro (25–28 jun 2026) están separados por 13 días y por 30 km de carretera (45 min en coche). Es una combinación habitual entre asistentes de fuera de Galicia. ConcertRide ofrece rutas Viveiro–Ortigueira directas (3–5 €/asiento) y conexiones desde A Coruña y Madrid para ambos festivales.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Ortigueira a Madrid?",
        a: "Madrid–Ortigueira son 690 km (7h por la A-6 + AG-64 + AC-862), entre los trayectos más largos de festival en España. Con ConcertRide: 18–25 €/asiento en coche compartido, sin comisión. La alternativa en transporte público (Renfe Madrid–A Coruña + ALSA + bus comarcal) ronda los 60–90 € y 9 horas de viaje, sin servicio nocturno.",
      },
    ],
    relatedFestivals: ["resurrection-fest", "o-son-do-camino"],
  },
  {
    slug: "jazzaldia",
    name: "Heineken Jazzaldia",
    shortName: "Jazzaldia",
    city: "San Sebastián",
    citySlug: "donostia",
    region: "País Vasco",
    venue: "Plaza de la Trinidad y Auditorio Kursaal",
    venueAddress: "Plaza de la Trinidad, 20003 Donostia–San Sebastián",
    lat: 43.3257,
    lng: -1.9856,
    startDate: "2026-07-22",
    endDate: "2026-07-26",
    typicalDates: "Última semana de julio (edición 2026: 22–26 julio)",
    capacity: "150.000 asistentes acumulados (5 días)",
    blurb:
      "Heineken Jazzaldia es el festival de jazz más antiguo del Estado español y uno de los tres más importantes de Europa. Celebrado desde 1966 en Donostia–San Sebastián, en 2026 alcanza su 61.ª edición del 22 al 26 de julio. Combina escenarios de pago (Plaza de la Trinidad, Auditorio Kursaal, Teatro Victoria Eugenia) con conciertos gratuitos al aire libre en Plaza Sarriegi, Plaza de la Constitución y la playa de la Zurriola. ConcertRide opera carpooling desde Bilbao (100 km), Vitoria-Gasteiz (115 km), Pamplona (90 km) y Madrid (450 km), sin comisión.",
    ogImage: "/og-fallback.png",
    originCities: [
      { city: "Bilbao", km: 100, drivingTime: "1h 00 min", concertRideRange: "4–7 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 115, drivingTime: "1h 10 min", concertRideRange: "5–7 €/asiento" },
      { city: "Pamplona", km: 90, drivingTime: "1h 00 min", concertRideRange: "4–7 €/asiento" },
      { city: "Logroño", km: 175, drivingTime: "1h 50 min", concertRideRange: "6–9 €/asiento" },
      { city: "Santander", km: 200, drivingTime: "2h 00 min", concertRideRange: "7–10 €/asiento" },
      { city: "Burgos", km: 245, drivingTime: "2h 30 min", concertRideRange: "8–11 €/asiento" },
      { city: "Zaragoza", km: 270, drivingTime: "2h 50 min", concertRideRange: "8–12 €/asiento" },
      { city: "Madrid", km: 450, drivingTime: "4h 30 min", concertRideRange: "13–18 €/asiento" },
      { city: "Barcelona", km: 530, drivingTime: "5h 30 min", concertRideRange: "14–20 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Jazzaldia 2026 en San Sebastián?",
        a: "El Jazzaldia se celebra en el centro de Donostia, accesible a pie desde cualquier punto de la ciudad. Renfe (Madrid–Donostia 4h 30 min, 35–60 €), ALSA (Madrid 5h 30 min, 25–45 €) y avión a Hondarribia (10 km del centro) son las opciones de transporte público. Carpooling ConcertRide desde Bilbao 4–7 €/asiento, Pamplona 4–7 €, Madrid 13–18 €, sin comisión.",
      },
      {
        q: "¿Cuáles son los conciertos gratuitos del Jazzaldia 2026?",
        a: "El Jazzaldia ofrece tres escenarios gratuitos al aire libre: Plaza de la Trinidad (cabeceras de cartel), Plaza Sarriegi (jazz contemporáneo) y la playa de la Zurriola (música electrónica + jazz). La programación se publica en jazzaldia.eus en mayo–junio. Los conciertos en Auditorio Kursaal y Teatro Victoria Eugenia son de pago (entradas 35–80 €).",
      },
      {
        q: "¿Hay parking durante el Jazzaldia en Donostia?",
        a: "Donostia tiene parkings públicos en Plaza Easo, Boulevard, Pío XII y Kursaal, todos en zona de estacionamiento regulado de pago (1,80–2,80 €/hora, máximo diario 22–28 €). En días de Jazzaldia el centro queda colapsado. La organización recomienda dejar el coche en parkings disuasorios (Anoeta, Riberas de Loiola) y usar transporte urbano. El carpooling ConcertRide reduce el problema: con ocupación del coche compartida, sólo un coche aparca por cada 4 asistentes.",
      },
      {
        q: "¿Cuándo termina el último concierto del Jazzaldia y cómo volver?",
        a: "Los conciertos en escenarios al aire libre terminan habitualmente entre las 23:30 y la 01:00. Los conciertos de pago en Kursaal pueden alargarse hasta las 02:00 con bises. Los autobuses urbanos Dbus operan hasta las 23:00 en líneas regulares y servicio Búho los fines de semana hasta las 03:00. Para volver a Bilbao, Vitoria o Pamplona de madrugada, el carpooling ConcertRide es la única opción real (Renfe último Donostia–Bilbao a las 21:00).",
      },
      {
        q: "¿Qué artistas tocan en el Jazzaldia 2026?",
        a: "El cartel del Jazzaldia 2026 (61.ª edición) se anunciará entre marzo y mayo de 2026 en jazzaldia.eus. Históricamente el festival ha programado a Herbie Hancock, Wynton Marsalis, Diana Krall, Pat Metheny, Norah Jones, Gregory Porter y artistas españoles como Chano Domínguez, Jorge Pardo y Niño Josele. La línea editorial combina jazz clásico, fusión, world music y pop con raíces.",
      },
    ],
    relatedFestivals: ["bbk-live"],
  },
  {
    slug: "metropoli-gijon",
    name: "Festival Internacional Metrópoli Gijón",
    shortName: "Metrópoli Gijón",
    city: "Gijón",
    citySlug: "gijon",
    region: "Asturias",
    venue: "Recinto Ferial Luis Adaro",
    venueAddress: "Av. Doctor Fleming, 938, 33203 Gijón",
    lat: 43.5365,
    lng: -5.6612,
    startDate: "2026-06-26",
    endDate: "2026-07-05",
    typicalDates: "Últimos días de junio – primera semana de julio",
    capacity: "30.000 personas/día",
    blurb:
      "Metrópoli Gijón es el principal festival de música, ocio digital y cultura pop de Asturias. Celebrado en el Recinto Ferial Luis Adaro de Gijón cada primera semana de julio, combina conciertos pop/rock/indie de cabecera nacional con áreas de gaming, cómic y series. La capacidad es de 30.000 personas/día. ConcertRide cubre rutas desde Oviedo (30 km), Santander (190 km), León (120 km), Madrid (445 km) y Bilbao (290 km), sin comisión.",
    ogImage: "/og-fallback.png",
    originCities: [
      { city: "Oviedo", km: 30, drivingTime: "0h 25 min", concertRideRange: "3–4 €/asiento" },
      { city: "León", km: 120, drivingTime: "1h 25 min", concertRideRange: "5–7 €/asiento" },
      { city: "Santander", km: 190, drivingTime: "1h 55 min", concertRideRange: "6–9 €/asiento" },
      { city: "Bilbao", km: 290, drivingTime: "2h 50 min", concertRideRange: "9–12 €/asiento" },
      { city: "Madrid", km: 445, drivingTime: "4h 20 min", concertRideRange: "13–17 €/asiento" },
      { city: "A Coruña", km: 290, drivingTime: "3h 10 min", concertRideRange: "9–12 €/asiento" },
      { city: "Vigo", km: 360, drivingTime: "3h 55 min", concertRideRange: "11–15 €/asiento" },
      { city: "Valladolid", km: 240, drivingTime: "2h 30 min", concertRideRange: "8–11 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Metrópoli Gijón 2026?",
        a: "El Recinto Ferial Luis Adaro está a 2 km del centro de Gijón. Bus urbano Emtusa líneas 1, 14 y 18 (parada Recinto Ferial). Cercanías Renfe línea C-1 Oviedo–Gijón hasta estación Sanz Crespo (20 min andando). Carpooling ConcertRide desde Oviedo 3–4 €/asiento (30 km), León 5–7 € (120 km), Madrid 13–17 € (445 km), sin comisión.",
      },
      {
        q: "¿Cuánto cuesta la entrada a Metrópoli Gijón?",
        a: "Las entradas a Metrópoli Gijón rondan los 30–45 € por jornada y 65–85 € el abono completo (3 días). Hay descuentos para menores de 16 años, jubilados y familias numerosas. La compra es online en metropoligijon.com con sistema de RFID (pulsera recargable).",
      },
      {
        q: "¿Qué tipo de música hay en Metrópoli Gijón?",
        a: "Metrópoli Gijón combina pop, rock, indie y urbano nacional con artistas internacionales emergentes. Históricamente ha programado a La Casa Azul, León Benavente, Carolina Durante, Dorian, Vetusta Morla, Zahara, Rigoberta Bandini y Cariño. Es un festival generalista, complementario a otros del norte como BBK Live (más alternativo) o Resurrection Fest (metal).",
      },
      {
        q: "¿Hay parking en Metrópoli Gijón?",
        a: "El Recinto Ferial Luis Adaro tiene parking propio (3.000 plazas, 5 €/día) y está rodeado de parking público gratuito en las calles laterales. En días punta el aparcamiento se llena rápido. La organización promueve el carpooling y el uso de Cercanías Renfe Oviedo–Gijón.",
      },
      {
        q: "¿Cómo volver de Metrópoli Gijón a Oviedo de madrugada?",
        a: "Los conciertos terminan entre las 02:30 y 04:00. Cercanías Renfe Oviedo–Gijón opera hasta las 23:00. Los buses ALSA Oviedo–Gijón (30 min, 3 €) son frecuentes hasta las 22:30. Después de medianoche la opción real es taxi (40–55 € de Gijón a Oviedo) o carpooling ConcertRide (3–4 €/asiento, vuelta de madrugada coordinada con asistentes del mismo festival).",
      },
    ],
    relatedFestivals: ["bbk-live", "resurrection-fest"],
  },
  {
    slug: "granada-sound",
    name: "Granada Sound",
    shortName: "Granada Sound",
    city: "Granada",
    citySlug: "granada",
    region: "Andalucía",
    venue: "Cortijo del Conde (Granada)",
    venueAddress: "Cortijo del Conde, Carretera de la Sierra, 18008 Granada",
    lat: 37.1597,
    lng: -3.5810,
    startDate: "2026-09-11",
    endDate: "2026-09-12",
    typicalDates: "Segundo fin de semana de septiembre",
    capacity: "25.000 personas/día",
    blurb:
      "Granada Sound es el festival de pop, rock e indie de referencia en Andalucía oriental, celebrado en el Cortijo del Conde a 5 km del centro de Granada. El segundo fin de semana de septiembre congrega a 25.000 asistentes/día con cabezas de cartel nacionales e internacionales. ConcertRide opera carpooling desde Málaga (130 km), Sevilla (250 km), Córdoba (200 km), Almería (170 km), Madrid (430 km) y Murcia (270 km), sin comisión.",
    ogImage: "/og-fallback.png",
    originCities: [
      { city: "Málaga", km: 130, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Almería", km: 170, drivingTime: "2h 00 min", concertRideRange: "6–9 €/asiento" },
      { city: "Córdoba", km: 200, drivingTime: "2h 10 min", concertRideRange: "7–10 €/asiento" },
      { city: "Sevilla", km: 250, drivingTime: "2h 30 min", concertRideRange: "8–11 €/asiento" },
      { city: "Jaén", km: 95, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Murcia", km: 270, drivingTime: "2h 50 min", concertRideRange: "8–12 €/asiento" },
      { city: "Madrid", km: 430, drivingTime: "4h 15 min", concertRideRange: "12–17 €/asiento" },
      { city: "Alicante", km: 350, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Cádiz", km: 280, drivingTime: "2h 50 min", concertRideRange: "8–12 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Granada Sound 2026?",
        a: "El Cortijo del Conde está a 5 km del centro de Granada en la Carretera de la Sierra. La organización fleta lanzadera oficial desde el centro de Granada (Estación de Autobuses) durante el festival, con frecuencia cada 20–30 min. Carpooling ConcertRide desde Málaga 5–8 €/asiento, Madrid 12–17 €, Sevilla 8–11 €, sin comisión.",
      },
      {
        q: "¿Hay shuttle oficial al Cortijo del Conde?",
        a: "Sí. Granada Sound ofrece bus lanzadera oficial desde el centro de Granada (Estación de Autobuses, Plaza del Triunfo y Camino de Ronda) hasta el Cortijo del Conde durante los dos días del festival, con servicio de ida desde las 17:00 y vuelta hasta las 04:30. Precio: incluido en el abono o 5–7 € por trayecto.",
      },
      {
        q: "¿Cuánto cuesta el abono de Granada Sound?",
        a: "El abono completo de Granada Sound 2026 (2 días) ronda los 70–90 € en preventa y 100–120 € en taquilla. Las entradas de día están entre 40 y 55 €. Hay descuentos para menores de 25 años y pulsera RFID recargable. Compra en granadasound.com.",
      },
      {
        q: "¿Qué artistas han tocado en Granada Sound?",
        a: "Granada Sound ha programado históricamente a Vetusta Morla, Love of Lesbian, Iván Ferreiro, Carolina Durante, La M.O.D.A., León Benavente, Sidonie, Dorian, La Habitación Roja, Zahara y artistas internacionales emergentes. Es un festival con identidad indie–pop alternativa, alejado del urbano y la electrónica de cabeceras como Mad Cool o Sónar.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Málaga a Granada Sound?",
        a: "El carpooling de Málaga a Granada Sound (Cortijo del Conde) cuesta 5–8 €/asiento con ConcertRide (130 km, 1h 30 min, sin comisión). Es la ruta más utilizada por su proximidad y por la cantidad de asistentes malagueños al festival. URL: concertride.me/rutas/malaga-granada-sound",
      },
    ],
    relatedFestivals: ["cala-mijas"],
  },
  {
    slug: "pirineos-sur",
    name: "Festival Internacional de las Culturas Pirineos Sur",
    shortName: "Pirineos Sur",
    city: "Lanuza",
    citySlug: "huesca",
    region: "Aragón",
    venue: "Auditorio Natural de Lanuza (escenario flotante sobre el embalse)",
    venueAddress: "Embalse de Lanuza, 22640 Sallent de Gállego (Huesca)",
    lat: 42.7497,
    lng: -0.3259,
    startDate: "2026-07-09",
    endDate: "2026-07-26",
    typicalDates: "Mediados julio (edición 2026: 9–26 julio, fines de semana)",
    capacity: "12.000 personas/día (auditorio natural sobre el embalse)",
    blurb:
      "Pirineos Sur es uno de los festivales de world music más singulares del mundo: el escenario es un auditorio flotante en el embalse de Lanuza (Sallent de Gállego, Huesca), con el público sentado sobre las laderas pirenaicas mirando al lago. La programación combina música africana, latinoamericana, asiática y mediterránea con artistas como Calexico, Fatoumata Diawara, Manu Chao y Goran Bregović. Sin transporte público al pueblo de Lanuza — el carpooling es la opción real desde Huesca (75 km), Zaragoza (175 km) o Barcelona (430 km).",
    ogImage: "/og-fallback.png",
    originCities: [
      { city: "Huesca", km: 75, drivingTime: "1h 15 min", concertRideRange: "3–5 €/asiento" },
      { city: "Zaragoza", km: 175, drivingTime: "2h 15 min", concertRideRange: "6–9 €/asiento" },
      { city: "Pamplona", km: 215, drivingTime: "2h 30 min", concertRideRange: "7–10 €/asiento" },
      { city: "Madrid", km: 480, drivingTime: "5h 00 min", concertRideRange: "13–18 €/asiento" },
      { city: "Barcelona", km: 430, drivingTime: "4h 30 min", concertRideRange: "12–17 €/asiento" },
      { city: "Bilbao", km: 360, drivingTime: "4h 00 min", concertRideRange: "11–15 €/asiento" },
      { city: "Lleida", km: 200, drivingTime: "2h 30 min", concertRideRange: "7–10 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Pirineos Sur 2026 en Lanuza?",
        a: "Lanuza (Sallent de Gállego, Huesca) está a 1.300 m de altitud en pleno Pirineo aragonés. NO hay transporte público al pueblo durante el festival. Acceso por carretera A-136 (Huesca → Sabiñánigo → Sallent de Gállego). Carpooling ConcertRide desde Huesca (75 km, 3–5€/asiento), Zaragoza (175 km, 6–9€), Madrid (480 km, 13–18€), Barcelona (430 km, 12–17€). Sin comisión, vuelta de madrugada coordinada.",
      },
      {
        q: "¿Cuándo es Pirineos Sur 2026?",
        a: "Pirineos Sur 2026 se celebra entre el 10 de julio y el 1 de agosto, repartido en tres fines de semana (jueves a sábado). Cada fin de semana tiene una programación distinta — 1ª semana: África / Mediterráneo, 2ª semana: Latinoamérica, 3ª semana: World Music general. La programación completa se anuncia en febrero–marzo en pirineos-sur.es.",
      },
      {
        q: "¿Cuánto cuesta la entrada a Pirineos Sur?",
        a: "Las entradas a Pirineos Sur rondan los 25–45 €/jornada para conciertos en el auditorio principal sobre el embalse. Los conciertos en el Anfiteatro de Lanuza (escenario terrestre, gratis) son de entrada libre. Hay también conciertos paralelos en Sallent de Gállego pueblo (gratuitos). Compra en pirineos-sur.es.",
      },
      {
        q: "¿Hay alojamiento cerca de Pirineos Sur?",
        a: "Sallent de Gállego pueblo ofrece hostales y alquileres de apartamentos (60–150€/noche, reservar con meses de antelación). Hay también campings en Lanuza, Búbal y Tramacastilla. Los más cercanos al embalse son Camping Lanuza (junto al recinto) y Camping Sigüés. Alternativa: alojamiento en Jaca (45 km) o Huesca (75 km) + carpooling al festival.",
      },
      {
        q: "¿Qué tipo de música hay en Pirineos Sur?",
        a: "Pirineos Sur es referente mundial de world music desde 1992. Programa música africana (Femi Kuti, Fatoumata Diawara), latinoamericana (Buena Vista Social Club), mediterránea (Goran Bregović), fusión flamenco-africano, y artistas españoles del world (Manu Chao, Calexico, Macaco). El formato — auditorio flotante sobre el embalse — es único en Europa.",
      },
    ],
    relatedFestivals: ["jazzaldia"],
  },
  {
    slug: "starlite-marbella",
    name: "Starlite Catalana Occidente Festival",
    shortName: "Starlite Marbella",
    city: "Marbella",
    citySlug: "marbella",
    region: "Andalucía",
    venue: "Cantera de Nagüeles (anfiteatro al aire libre)",
    venueAddress: "Cantera de Nagüeles, Carretera A-7176, 29600 Marbella (Málaga)",
    lat: 36.5144,
    lng: -4.8930,
    startDate: "2026-06-19",
    endDate: "2026-08-31",
    typicalDates: "Mediados junio – finales agosto (más de 60 fechas)",
    capacity: "7.500 plazas/concierto",
    blurb:
      "Starlite Marbella es el festival boutique más exclusivo del Mediterráneo: 60+ noches de conciertos consecutivas durante el verano en la Cantera de Nagüeles, un anfiteatro al aire libre tallado en la roca de la sierra Blanca. Cabezas de cartel internacionales (Lenny Kravitz, Tom Jones, Maluma, Pet Shop Boys, Gloria Gaynor, Robbie Williams, Steve Aoki). Capacidad limitada a 7.500 personas/concierto en formato butaca numerada. Sin transporte público directo al recinto. ConcertRide opera carpooling desde Málaga (60 km, 3–5€), Mijas (20 km, 3–4€), Fuengirola (25 km, 3–5€), Madrid (575 km).",
    ogImage: "/og-fallback.png",
    originCities: [
      { city: "Málaga", km: 60, drivingTime: "0h 50 min", concertRideRange: "3–5 €/asiento" },
      { city: "Mijas", km: 20, drivingTime: "0h 25 min", concertRideRange: "3–4 €/asiento" },
      { city: "Fuengirola", km: 25, drivingTime: "0h 30 min", concertRideRange: "3–5 €/asiento" },
      { city: "Granada", km: 155, drivingTime: "1h 50 min", concertRideRange: "6–9 €/asiento" },
      { city: "Sevilla", km: 210, drivingTime: "2h 15 min", concertRideRange: "7–10 €/asiento" },
      { city: "Cádiz", km: 200, drivingTime: "2h 15 min", concertRideRange: "7–10 €/asiento" },
      { city: "Madrid", km: 575, drivingTime: "5h 30 min", concertRideRange: "14–20 €/asiento" },
      { city: "Algeciras", km: 80, drivingTime: "1h 00 min", concertRideRange: "4–6 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Starlite Festival Marbella?",
        a: "La Cantera de Nagüeles está a 4 km del centro de Marbella, accesible por la A-7176 dirección Ojén. La organización fleta lanzadera oficial desde el centro de Marbella (Plaza de la Iglesia, Hotel Don Pepe) con servicio durante las noches de festival. Aparcamiento propio en el recinto. Carpooling ConcertRide desde Málaga (60 km, 3–5€), Mijas (20 km, 3–4€), Fuengirola (25 km, 3–5€), Madrid (575 km, 14–20€). 0% comisión, vuelta nocturna coordinada.",
      },
      {
        q: "¿Cuánto cuestan las entradas a Starlite Marbella?",
        a: "Las entradas a Starlite Marbella varían entre 65 € (las más asequibles) y 350 € (zonas VIP) según artista y zona. Los conciertos de cabezas de cartel internacionales rondan los 90–180 €. Compra en starlitemarbella.com con asiento numerado garantizado.",
      },
      {
        q: "¿Cuándo es Starlite Marbella 2026?",
        a: "Starlite Catalana Occidente 2026 abre el 13 de junio y cierra el 31 de agosto, con más de 60 noches de conciertos consecutivos. Cada noche una propuesta distinta — pop, rock, latino, electrónica, soul. La programación completa se publica en abril–mayo en starlitemarbella.com.",
      },
      {
        q: "¿Es Starlite Marbella en exterior o cubierto?",
        a: "Starlite es totalmente al aire libre, en la Cantera de Nagüeles — un anfiteatro natural tallado en la roca con cielo abierto. La organización suministra mantas en noches frescas. En caso de tormenta el concierto se aplaza (suceso raro en julio–agosto en la Costa del Sol). Lleva ropa cómoda y zapatos de suela plana — el suelo es de gravilla.",
      },
      {
        q: "¿Qué artistas han pasado por Starlite Marbella?",
        a: "Lista histórica de cabezas de cartel: Lenny Kravitz, Tom Jones, Robbie Williams, Maluma, Pet Shop Boys, Gloria Gaynor, Steve Aoki, Anastacia, Bryan Adams, Sting, Andrea Bocelli, Niall Horan, Luis Fonsi, Rita Ora, James Blunt, Backstreet Boys. Programa entre 60–80 conciertos cada verano.",
      },
    ],
    relatedFestivals: ["cala-mijas", "granada-sound"],
  },
  {
    slug: "stone-music-festival",
    name: "Stone & Music Festival Mérida",
    shortName: "Stone & Music",
    city: "Mérida",
    citySlug: "merida",
    region: "Extremadura",
    venue: "Teatro Romano de Mérida (siglo I a.C., patrimonio UNESCO)",
    venueAddress: "Plaza Margarita Xirgu s/n, 06800 Mérida (Badajoz)",
    lat: 38.9148,
    lng: -6.3392,
    startDate: "2026-06-05",
    endDate: "2026-06-27",
    typicalDates: "Junio",
    capacity: "3.000 plazas (gradas romanas + parterre)",
    blurb:
      "Stone & Music Festival se celebra en el Teatro Romano de Mérida (siglo I a.C., patrimonio mundial UNESCO) — uno de los pocos espacios romanos del mundo en activo para conciertos. Cabezas de cartel internacionales y españoles (Andrea Bocelli, Sting, Joaquín Sabina, Antonio Orozco, Manuel Carrasco) en formato gradas romanas con capacidad 3.000 personas. La acústica natural del teatro es la principal atracción. Carpooling ConcertRide al Teatro Romano desde Cáceres (75 km, 4–6€), Badajoz (60 km, 3–5€), Sevilla (200 km, 6–9€), Madrid (340 km, 10–14€).",
    ogImage: "/og-fallback.png",
    originCities: [
      { city: "Badajoz", km: 60, drivingTime: "0h 50 min", concertRideRange: "3–5 €/asiento" },
      { city: "Cáceres", km: 75, drivingTime: "1h 00 min", concertRideRange: "4–6 €/asiento" },
      { city: "Sevilla", km: 200, drivingTime: "2h 00 min", concertRideRange: "6–9 €/asiento" },
      { city: "Córdoba", km: 250, drivingTime: "2h 30 min", concertRideRange: "8–11 €/asiento" },
      { city: "Madrid", km: 340, drivingTime: "3h 30 min", concertRideRange: "10–14 €/asiento" },
      { city: "Lisboa", km: 180, drivingTime: "2h 00 min", concertRideRange: "6–9 €/asiento" },
      { city: "Salamanca", km: 215, drivingTime: "2h 15 min", concertRideRange: "7–10 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Teatro Romano de Mérida para Stone & Music?",
        a: "El Teatro Romano de Mérida está en pleno casco histórico de la ciudad, a 5 min andando de la Plaza de España. Acceso por la Plaza Margarita Xirgu. Renfe Larga Distancia desde Madrid–Mérida (3h 30 min, 25–45 €). Carpooling ConcertRide al Teatro Romano: Cáceres (75 km, 4–6€/asiento), Badajoz (60 km, 3–5€), Sevilla (200 km, 6–9€), Madrid (340 km, 10–14€). 0% comisión, vuelta de madrugada coordinada.",
      },
      {
        q: "¿Cuándo es Stone & Music Festival Mérida 2026?",
        a: "Stone & Music Festival 2026 se celebra en junio (del 5 al 27 de junio aproximadamente), con conciertos repartidos en distintas noches del mes. Cada noche tiene un cabeza de cartel distinto — de Andrea Bocelli a Joaquín Sabina pasando por Antonio Orozco o Manuel Carrasco. Programación completa en stonemusicfestival.com.",
      },
      {
        q: "¿Qué capacidad tiene el Teatro Romano de Mérida?",
        a: "El Teatro Romano de Mérida tiene capacidad para 3.000 espectadores en formato concierto, repartidos entre las gradas romanas originales (siglo I a.C.) y el parterre frente al escenario. La acústica natural del teatro — diseñada por los romanos hace 2.000 años — sigue funcionando perfectamente: incluso desde las últimas filas se escucha la voz humana sin amplificación adicional.",
      },
      {
        q: "¿Cuánto cuestan las entradas a Stone & Music Mérida?",
        a: "Las entradas rondan los 35–80 € según zona (gradas vs parterre) y artista. Los cabezas de cartel internacionales (Andrea Bocelli, Sting) suelen llegar a 60–95 €. Compra en stonemusicfestival.com.",
      },
      {
        q: "¿Hay otros festivales en el Teatro Romano de Mérida?",
        a: "Sí. Además de Stone & Music, el Teatro Romano acoge el Festival Internacional de Teatro Clásico de Mérida (julio–agosto, 74 ediciones, uno de los festivales más antiguos de España, dedicado a teatro clásico grecorromano). Ambos festivales comparten el mismo escenario en distintas noches del verano.",
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "marenostrum-fuengirola",
    name: "Marenostrum Fuengirola Festival",
    shortName: "Marenostrum",
    city: "Fuengirola",
    citySlug: "fuengirola",
    region: "Andalucía",
    venue: "Sohail Castle Park (anfiteatro junto al castillo árabe del siglo X)",
    venueAddress: "Castillo de Sohail, Av. del Sohail, 29640 Fuengirola (Málaga)",
    lat: 36.5390,
    lng: -4.6298,
    startDate: "2026-04-24",
    endDate: "2026-09-12",
    typicalDates: "Finales abril – mediados septiembre",
    capacity: "15.000 plazas/concierto",
    blurb:
      "Marenostrum Fuengirola Festival se celebra en el Sohail Castle Park, un anfiteatro al aire libre junto al castillo árabe de Sohail (siglo X) en plena Costa del Sol. Cabezas de cartel internacionales (50 Cent, Bryan Adams, Iggy Pop, Robbie Williams, Tom Jones, Sheryl Crow) en formato butaca numerada con capacidad 15.000 personas. Conectado con Málaga ciudad por Cercanías Renfe C-1 Málaga–Fuengirola (35 min, 3,90€). Carpooling ConcertRide desde Málaga (35 km, 3–5€), Mijas (10 km, 3–4€), Marbella (25 km, 3–5€), Granada (130 km, 5–8€).",
    ogImage: "/og-fallback.png",
    originCities: [
      { city: "Málaga", km: 35, drivingTime: "0h 30 min", concertRideRange: "3–5 €/asiento" },
      { city: "Mijas", km: 10, drivingTime: "0h 15 min", concertRideRange: "3–4 €/asiento" },
      { city: "Marbella", km: 25, drivingTime: "0h 30 min", concertRideRange: "3–5 €/asiento" },
      { city: "Fuengirola", km: 2, drivingTime: "0h 10 min", concertRideRange: "3 €/asiento" },
      { city: "Granada", km: 130, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Sevilla", km: 220, drivingTime: "2h 15 min", concertRideRange: "7–11 €/asiento" },
      { city: "Madrid", km: 555, drivingTime: "5h 30 min", concertRideRange: "14–20 €/asiento" },
      { city: "Algeciras", km: 105, drivingTime: "1h 15 min", concertRideRange: "5–7 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Marenostrum Fuengirola desde Málaga?",
        a: "Cercanías Renfe C-1 Málaga–Fuengirola (35 min, 3,90 € ida) hasta la última estación de la línea (Fuengirola). Desde la estación, el Sohail Castle Park está a 15 min andando o 5 min en taxi. Bus urbano M-103 también conecta el centro de Fuengirola con la zona del castillo. Carpooling ConcertRide directo al Castle Park desde Málaga (35 km, 3–5€/asiento), Mijas (10 km, 3–4€), Marbella (25 km, 3–5€). 0% comisión, vuelta nocturna coordinada — el último Cercanías sale antes del fin del cabeza de cartel.",
      },
      {
        q: "¿Cuándo es Marenostrum Fuengirola 2026?",
        a: "Marenostrum Fuengirola 2026 se celebra entre finales de abril (24 abr) y mediados de septiembre (12 sep), con conciertos repartidos en noches del calendario primavera–verano. Programación 2025 incluyó 50 Cent, Bryan Adams y Sheryl Crow — la programación 2026 se anuncia en febrero–marzo en marenostrumfuengirola.com.",
      },
      {
        q: "¿Cuánto cuestan las entradas Marenostrum Fuengirola?",
        a: "Entradas entre 45 € (zona general) y 250 € (Front Stage VIP). Cabezas de cartel internacionales rondan los 80–150 €. Hay paquetes hotel + entrada con descuentos. Compra en marenostrumfuengirola.com con asiento numerado garantizado.",
      },
      {
        q: "¿Es el Castle Park de Fuengirola al aire libre?",
        a: "Sí. El Sohail Castle Park es un anfiteatro al aire libre junto al castillo árabe de Sohail (siglo X). Cielo abierto, vistas al Mediterráneo. La organización suministra fanfarrias o mantas en noches frescas. En caso de tormenta el concierto se reprograma (raro en jul–ago en Fuengirola). Llegar 1h antes de la apertura para conseguir buenos asientos en zonas no numeradas.",
      },
      {
        q: "¿Qué artistas han pasado por Marenostrum Fuengirola?",
        a: "Lista histórica de cabezas de cartel: 50 Cent, Bryan Adams, Iggy Pop, Sheryl Crow, Tom Jones, Robbie Williams, Sting, Anastacia, Roxette, OneRepublic, Boyzone. El festival se enfoca en pop/rock internacional clásico de las décadas 80–2000.",
      },
    ],
    relatedFestivals: ["cala-mijas"],
  },
  {
    slug: "tio-pepe-festival",
    name: "Tío Pepe Festival Jerez",
    shortName: "Tío Pepe",
    city: "Jerez de la Frontera",
    citySlug: "jerez-de-la-frontera",
    region: "Andalucía",
    venue: "Bodegas González Byass (patio interior + barricas históricas)",
    venueAddress: "C/ Manuel María González 12, 11403 Jerez de la Frontera (Cádiz)",
    lat: 36.6859,
    lng: -6.1364,
    startDate: "2026-07-04",
    endDate: "2026-08-31",
    typicalDates: "Principios julio – finales agosto",
    capacity: "1.800 plazas/concierto",
    blurb:
      "Tío Pepe Festival se celebra en las Bodegas González Byass de Jerez de la Frontera, en un escenario único entre barricas históricas del vino de Jerez. Cabezas de cartel internacionales (Pet Shop Boys, Robbie Williams, Sting, Anastacia, Pablo Alborán, Joaquín Sabina) en formato íntimo con capacidad limitada a 1.800 personas. Cada entrada incluye copa de Tío Pepe. Sin transporte nocturno desde el recinto — carpooling ConcertRide desde Cádiz (35 km, 3–5€), El Puerto de Santa María (15 km, 3–4€), Sevilla (95 km, 4–7€), Cádiz capital, Algeciras (130 km, 5–7€).",
    ogImage: "/og-fallback.png",
    originCities: [
      { city: "Cádiz", km: 35, drivingTime: "0h 35 min", concertRideRange: "3–5 €/asiento" },
      { city: "Sevilla", km: 95, drivingTime: "1h 00 min", concertRideRange: "4–7 €/asiento" },
      { city: "Córdoba", km: 195, drivingTime: "2h 00 min", concertRideRange: "6–9 €/asiento" },
      { city: "Málaga", km: 200, drivingTime: "2h 00 min", concertRideRange: "7–10 €/asiento" },
      { city: "Algeciras", km: 130, drivingTime: "1h 30 min", concertRideRange: "5–7 €/asiento" },
      { city: "Huelva", km: 110, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" },
      { city: "Madrid", km: 655, drivingTime: "6h 30 min", concertRideRange: "16–22 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Tío Pepe Festival en Jerez?",
        a: "Las Bodegas González Byass están en pleno centro de Jerez de la Frontera, a 5 min andando de la Plaza del Arenal. Renfe Larga Distancia Madrid–Jerez (4h 30 min, 35–60 €). ALSA Sevilla–Jerez (1h, 8–12 €). Carpooling ConcertRide a las Bodegas: Cádiz (35 km, 3–5€/asiento), Sevilla (95 km, 4–7€), Algeciras (130 km, 5–7€), Madrid (655 km, 16–22€). 0% comisión, vuelta nocturna coordinada — Renfe último Jerez–Madrid 21:30, antes del fin del cabeza de cartel.",
      },
      {
        q: "¿Cuánto cuestan las entradas Tío Pepe Festival?",
        a: "Las entradas rondan los 60–120 € según zona y artista. Cabezas de cartel internacionales (Pet Shop Boys, Sting, Robbie Williams) suelen llegar a 90–150 €. Cada entrada INCLUYE una copa de Tío Pepe (vino de Jerez emblemático). Asiento numerado garantizado. Compra en tiopepefestival.com.",
      },
      {
        q: "¿Cuándo es Tío Pepe Festival 2026?",
        a: "Tío Pepe Festival 2026 se celebra entre finales de junio y finales de agosto, con conciertos en distintas noches del calendario veraniego. Edición 2025 incluyó Robbie Williams, Pet Shop Boys, Sting y Pablo Alborán. La programación 2026 se anuncia entre febrero y abril en tiopepefestival.com.",
      },
      {
        q: "¿Qué capacidad tiene el Tío Pepe Festival?",
        a: "El Tío Pepe Festival tiene capacidad limitada a 1.800 personas/concierto en formato butaca numerada al aire libre, en el patio interior de las Bodegas González Byass. Es uno de los festivales más íntimos de España — la cercanía con el escenario es comparable a un concierto en un teatro pequeño, no a un festival masivo.",
      },
      {
        q: "¿Es el Tío Pepe Festival en exterior o cubierto?",
        a: "Al aire libre, en el patio interior de las Bodegas González Byass — protegido del viento y del ruido externo por los muros de las bodegas. Cielo abierto. En caso de lluvia el concierto se reprograma (raro en jul–ago en Jerez). El recinto está rodeado de las barricas históricas firmadas por personajes como Lord Byron, Picasso o el Rey Juan Carlos.",
      },
    ],
    relatedFestivals: ["cala-mijas"],
  },
  {
    slug: "atlantic-fest",
    name: "Atlantic Fest",
    shortName: "Atlantic Fest",
    city: "Vilagarcía de Arousa",
    citySlug: "pontevedra",
    region: "Galicia",
    venue: "Recinto Ferial Fexdega",
    venueAddress: "Rúa Fexdega s/n, 36600 Vilagarcía de Arousa (Pontevedra)",
    lat: 42.5953,
    lng: -8.7647,
    startDate: "2026-07-17",
    endDate: "2026-07-19",
    typicalDates: "Tercer fin de semana de julio",
    capacity: "25.000 personas/día",
    blurb:
      "Atlantic Fest es uno de los festivales de música indie más grandes de Galicia, celebrado en el Recinto Ferial Fexdega de Vilagarcía de Arousa (Pontevedra). 25.000 asistentes/día y cabezas de cartel nacionales e internacionales (La Casa Azul, Carolina Durante, Vetusta Morla, Love of Lesbian, Iván Ferreiro). Vilagarcía está entre Vigo (35 km) y Santiago (45 km), bien comunicada por la AP-9. Carpooling ConcertRide desde Pontevedra (35 km, 3–4€), Vigo (35 km, 3–4€), Santiago (45 km, 3–5€), A Coruña (130 km, 5–8€), Madrid (615 km, 16–22€). Sin comisión.",
    ogImage: "/og-fallback.png",
    originCities: [
      { city: "Pontevedra", km: 35, drivingTime: "0h 30 min", concertRideRange: "3–4 €/asiento" },
      { city: "Vigo", km: 35, drivingTime: "0h 35 min", concertRideRange: "3–4 €/asiento" },
      { city: "Santiago de Compostela", km: 45, drivingTime: "0h 40 min", concertRideRange: "3–5 €/asiento" },
      { city: "A Coruña", km: 130, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Ourense", km: 100, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" },
      { city: "Madrid", km: 615, drivingTime: "6h 00 min", concertRideRange: "16–22 €/asiento" },
      { city: "Lugo", km: 145, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cuándo es Atlantic Fest 2026 y dónde se celebra?",
        a: "Atlantic Fest 2026 se celebra del 17 al 19 de julio en el Recinto Ferial Fexdega de Vilagarcía de Arousa (Pontevedra), entre la ría de Arousa y el centro urbano. La programación se anuncia trimestralmente entre marzo y mayo en atlanticfest.com.",
      },
      {
        q: "¿Cómo llegar a Atlantic Fest desde Vigo o Santiago?",
        a: "Vigo → Vilagarcía (35 km, 35 min por la AP-9), Santiago → Vilagarcía (45 km, 40 min, AP-9). Carpooling ConcertRide: Vigo 3–4€/asiento, Santiago 3–5€, Pontevedra 3–4€. Renfe Cercanías Vigo–Vilagarcía existe pero con horarios limitados. La opción real es coche compartido. Sin comisión.",
      },
      {
        q: "¿Qué artistas tocan en Atlantic Fest 2026?",
        a: "Atlantic Fest programa cada año cabezas de cartel del indie español e internacional. Históricamente: La Casa Azul, Carolina Durante, Vetusta Morla, Love of Lesbian, Sidonie, Iván Ferreiro, Dorian. La programación 2026 se publica en atlanticfest.com en abril–mayo.",
      },
      {
        q: "¿Hay camping en Atlantic Fest?",
        a: "Atlantic Fest ofrece camping oficial junto al recinto Fexdega (incluido en abono o ~25€/persona los 3 días). Hay alternativas en Vilagarcía pueblo (alojamientos rurales 60–120€/noche, reservar con meses de antelación) y en Sanxenxo/O Grove (50 km).",
      },
      {
        q: "¿Cuánto cuesta el carpooling Atlantic Fest desde Madrid?",
        a: "Madrid → Vilagarcía de Arousa son 615 km por la A-6 + AP-9 (6h). Con ConcertRide: 16–22€/asiento, sin comisión, vuelta de madrugada coordinada. La alternativa Renfe Madrid–Pontevedra (4h, 30–60€) + bus a Vilagarcía requiere transbordos y horarios diurnos. URL: concertride.me/rutas/madrid-atlantic-fest",
      },
    ],
    relatedFestivals: ["o-son-do-camino", "festival-ortigueira"],
  },
  {
    slug: "portamerica",
    name: "PortAmérica Festival",
    shortName: "PortAmérica",
    city: "Caldas de Reis",
    citySlug: "pontevedra",
    region: "Galicia",
    venue: "Finca Montecelo (Caldas de Reis)",
    venueAddress: "Finca Montecelo, 36650 Caldas de Reis (Pontevedra)",
    lat: 42.6047,
    lng: -8.6394,
    startDate: "2026-07-09",
    endDate: "2026-07-11",
    typicalDates: "Segundo fin de semana de julio",
    capacity: "30.000 personas/día",
    blurb:
      "PortAmérica Festival se celebra en la Finca Montecelo de Caldas de Reis (Pontevedra) — un parque natural con escenarios distribuidos entre eucaliptos y robles. La programación combina pop/rock español y latino (Mala Rodríguez, La Casa Azul, Iván Ferreiro, Bunbury) con grandes nombres de la música hispanoamericana. 30.000 asistentes/día. Sin transporte público al recinto — el carpooling es la opción real. Carpooling ConcertRide desde Pontevedra (15 km, 3€), Vigo (50 km, 3–5€), Santiago (40 km, 3–5€).",
    ogImage: "/og-fallback.png",
    originCities: [
      { city: "Pontevedra", km: 15, drivingTime: "0h 15 min", concertRideRange: "3 €/asiento" },
      { city: "Vigo", km: 50, drivingTime: "0h 45 min", concertRideRange: "3–5 €/asiento" },
      { city: "Santiago de Compostela", km: 40, drivingTime: "0h 35 min", concertRideRange: "3–5 €/asiento" },
      { city: "A Coruña", km: 115, drivingTime: "1h 20 min", concertRideRange: "5–8 €/asiento" },
      { city: "Ourense", km: 95, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Lugo", km: 130, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Madrid", km: 600, drivingTime: "5h 45 min", concertRideRange: "16–22 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Dónde se celebra PortAmérica 2026?",
        a: "PortAmérica 2026 se celebra en la Finca Montecelo de Caldas de Reis (Pontevedra), un espacio natural con escenarios entre árboles centenarios. La finca está a 15 km de Pontevedra ciudad y a 40 km de Santiago de Compostela. El recinto tiene capacidad para 30.000 personas/día durante 3 jornadas.",
      },
      {
        q: "¿Cómo llegar a PortAmérica desde Vigo?",
        a: "Vigo → Caldas de Reis (50 km, 45 min por AP-9 + N-550). NO hay transporte público directo al recinto. Carpooling ConcertRide: Vigo 3–5€/asiento, Pontevedra 3€ (la ruta más corta), Santiago 3–5€, A Coruña 5–8€. Sin comisión, vuelta nocturna coordinada con asistentes del mismo festival.",
      },
      {
        q: "¿Cuándo es PortAmérica 2026?",
        a: "PortAmérica 2026 se celebra del 9 al 11 de julio en Caldas de Reis. La programación 2026 (cabezas de cartel) se anuncia entre marzo y mayo en portamerica.es. Históricamente combina artistas españoles (Iván Ferreiro, Bunbury, Mala Rodríguez) con latinoamericanos (Bomba Estéreo, Café Tacvba).",
      },
      {
        q: "¿Hay camping en PortAmérica?",
        a: "PortAmérica ofrece camping oficial en la Finca Montecelo (incluido en abono completo o ~30€/persona los 3 días). Es uno de los festivales más cómodos para camping por su entorno natural. Alojamientos en Caldas de Reis pueblo (40–80€/noche) y Pontevedra (60–120€/noche).",
      },
      {
        q: "¿Qué hace único a PortAmérica?",
        a: "PortAmérica destaca por tres factores: (1) ubicación en finca natural con escenarios entre árboles, (2) cartel diverso que mezcla pop/rock español con artistas latinoamericanos, y (3) tamaño medio (30.000 personas) que ofrece experiencia más íntima que Mad Cool o Primavera Sound. URL: concertride.me/festivales/portamerica",
      },
    ],
    relatedFestivals: ["atlantic-fest", "o-son-do-camino"],
  },
  {
    slug: "sos-48",
    name: "SOS 4.8 Festival",
    shortName: "SOS 4.8",
    city: "Murcia",
    citySlug: "murcia",
    region: "Región de Murcia",
    venue: "Recinto Ferial La Fica (Murcia)",
    venueAddress: "Av. Primero de Mayo s/n, 30006 Murcia",
    lat: 37.9942,
    lng: -1.1306,
    startDate: "2026-05-03",
    endDate: "2026-05-04",
    typicalDates: "Puente de mayo (edición 2026: 3–4 mayo)",
    capacity: "40.000 personas/día",
    blurb:
      "SOS 4.8 es el festival de indie y electrónica más grande de la Región de Murcia, celebrado en el Recinto Ferial La Fica (Murcia capital) cada primer fin de semana de mayo. 40.000 asistentes/día y cabezas de cartel nacionales e internacionales (LCD Soundsystem, Bomba Estéreo, Carolina Durante, Vetusta Morla, Love of Lesbian, Sidonie). El festival inaugura la temporada festivalera española cada primavera. Carpooling ConcertRide desde Cartagena (50 km, 3–5€), Alicante (80 km, 4–7€), Albacete (150 km, 5–8€), Madrid (390 km, 11–16€), Valencia (240 km, 7–11€).",
    ogImage: "/og-fallback.png",
    originCities: [
      { city: "Cartagena", km: 50, drivingTime: "0h 40 min", concertRideRange: "3–5 €/asiento" },
      { city: "Alicante", km: 80, drivingTime: "0h 55 min", concertRideRange: "4–7 €/asiento" },
      { city: "Albacete", km: 150, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Valencia", km: 240, drivingTime: "2h 30 min", concertRideRange: "7–11 €/asiento" },
      { city: "Madrid", km: 390, drivingTime: "3h 45 min", concertRideRange: "11–16 €/asiento" },
      { city: "Granada", km: 270, drivingTime: "2h 50 min", concertRideRange: "8–12 €/asiento" },
      { city: "Almería", km: 220, drivingTime: "2h 15 min", concertRideRange: "7–11 €/asiento" },
      { city: "Elche", km: 60, drivingTime: "0h 45 min", concertRideRange: "3–5 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cuándo es SOS 4.8 2026?",
        a: "SOS 4.8 2026 se celebra los días 8 y 9 de mayo en el Recinto Ferial La Fica de Murcia. Es uno de los primeros festivales de la temporada española, antes incluso que Primavera Sound y Mad Cool. La programación se anuncia entre noviembre del año previo y febrero del año del festival en sos48.com.",
      },
      {
        q: "¿Cómo llegar a SOS 4.8 La Fica Murcia?",
        a: "Recinto Ferial La Fica está a 4 km del centro de Murcia. Bus urbano LATBUS líneas 30 y 39 conectan La Fica con la Av. Libertad (centro). Tranvía L1 hasta El Estadio + 10 min andando. Carpooling ConcertRide: Cartagena 3–5€/asiento, Alicante 4–7€, Madrid 11–16€, Valencia 7–11€. Sin comisión.",
      },
      {
        q: "¿Qué artistas han tocado en SOS 4.8?",
        a: "SOS 4.8 ha programado históricamente: LCD Soundsystem, Vetusta Morla, Love of Lesbian, Carolina Durante, Bomba Estéreo, Sidonie, Iván Ferreiro, La Casa Azul, Hot Chip, Crystal Castles, Two Door Cinema Club. El festival es referente del indie + electrónica del sureste mediterráneo.",
      },
      {
        q: "¿Cuánto cuesta el abono de SOS 4.8?",
        a: "El abono completo de SOS 4.8 (2 días) ronda los 65–85€ en preventa y 100–120€ en taquilla. Las entradas de día están entre 40 y 55€. Compra en sos48.com.",
      },
      {
        q: "¿Cómo es el carpooling de Alicante a SOS 4.8 Murcia?",
        a: "Alicante → Murcia La Fica son 80 km por la AP-7 (55 min). Con ConcertRide: 4–7€/asiento, sin comisión. Las rutas Alicante–Murcia y Cartagena–Murcia son las más demandadas durante el festival. URL: concertride.me/rutas/alicante-sos-48",
      },
    ],
    relatedFestivals: ["medusa-festival"],
  },
  {
    slug: "reggaeton-beach-festival",
    name: "Reggaeton Beach Festival",
    shortName: "RBF Salou",
    city: "Salou",
    citySlug: "tarragona",
    region: "Cataluña",
    venue: "Cambrils Park Resort / Salou (recinto al aire libre)",
    venueAddress: "Salou - Cambrils, 43840 Tarragona",
    lat: 41.0763,
    lng: 1.1346,
    startDate: "2026-07-31",
    endDate: "2026-08-02",
    typicalDates: "Último fin de semana de julio – primer de agosto",
    capacity: "60.000 personas/día",
    blurb:
      "Reggaeton Beach Festival (RBF) es el festival de reggaeton y música urbana latina más grande de España, celebrado en Salou (Tarragona) cada último fin de semana de julio. 60.000 asistentes/día y cabezas de cartel internacionales: J Balvin, Anuel AA, Manuel Turizo, Sebastián Yatra, Ozuna, Daddy Yankee. Ubicación junto a la playa de la Costa Daurada. Carpooling ConcertRide desde Tarragona (15 km, 3€), Reus (15 km, 3€), Barcelona (110 km, 5–8€), Lleida (130 km, 5–8€), Zaragoza (255 km, 7–11€), Valencia (280 km, 8–12€), Madrid (550 km, 14–20€).",
    ogImage: "/og-fallback.png",
    originCities: [
      { city: "Tarragona", km: 15, drivingTime: "0h 15 min", concertRideRange: "3 €/asiento" },
      { city: "Reus", km: 15, drivingTime: "0h 15 min", concertRideRange: "3 €/asiento" },
      { city: "Barcelona", km: 110, drivingTime: "1h 10 min", concertRideRange: "5–8 €/asiento" },
      { city: "Lleida", km: 130, drivingTime: "1h 20 min", concertRideRange: "5–8 €/asiento" },
      { city: "Zaragoza", km: 255, drivingTime: "2h 30 min", concertRideRange: "7–11 €/asiento" },
      { city: "Valencia", km: 280, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Castellón", km: 195, drivingTime: "1h 50 min", concertRideRange: "6–9 €/asiento" },
      { city: "Madrid", km: 550, drivingTime: "5h 15 min", concertRideRange: "14–20 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cuándo es Reggaeton Beach Festival 2026?",
        a: "Reggaeton Beach Festival 2026 se celebra del 31 de julio al 2 de agosto en Salou (Tarragona), Costa Daurada. La programación se anuncia entre febrero y mayo en reggaetonbeachfestival.com. Cabezas de cartel históricos: J Balvin, Anuel AA, Manuel Turizo, Sebastián Yatra, Ozuna, Daddy Yankee.",
      },
      {
        q: "¿Cómo llegar a Reggaeton Beach Festival Salou desde Barcelona?",
        a: "Renfe Larga Distancia / Avant Barcelona–Tarragona–Salou (1h 30 min, 12–25€) hasta Salou estación + bus urbano al recinto. Carpooling ConcertRide: Barcelona → Salou (110 km, 1h 10 min, 5–8€/asiento). Las rutas Tarragona–Salou (15 km, 3€) y Reus–Salou (15 km, 3€) son las más densas. Sin comisión.",
      },
      {
        q: "¿Qué artistas han tocado en Reggaeton Beach Festival?",
        a: "Lista histórica de cabezas de cartel: J Balvin, Anuel AA, Sebastián Yatra, Manuel Turizo, Ozuna, Daddy Yankee, Karol G, Maluma, Wisin & Yandel, Don Omar, Nicky Jam, Becky G. Es el festival de reggaeton más grande de Europa.",
      },
      {
        q: "¿Hay alojamiento cerca del recinto en Salou?",
        a: "Salou es destino turístico de primer orden con hoteles y apartamentos por miles. Los hoteles del paseo marítimo están a 5–15 min andando del recinto del festival (60–180€/noche). Alternativa más económica: alquileres en Cambrils o La Pineda (10–20 km).",
      },
      {
        q: "¿Cuánto cuesta el abono Reggaeton Beach Festival?",
        a: "El abono completo de RBF (3 días) ronda los 90–130€ en preventa y 150–180€ en taquilla. Las entradas de día están entre 50–70€. Hay paquetes hotel + entrada con descuentos. Compra en reggaetonbeachfestival.com.",
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "mallorca-live-festival",
    name: "Mallorca Live Festival",
    shortName: "Mallorca Live",
    city: "Calvià",
    citySlug: "palma",
    region: "Islas Baleares",
    venue: "Antiguo Aquapark Magaluf (Calvià)",
    venueAddress: "Calle Borges Blanques, 07181 Calvià (Mallorca)",
    lat: 39.5097,
    lng: 2.5302,
    startDate: "2026-06-12",
    endDate: "2026-06-14",
    typicalDates: "Tercer fin de semana de mayo",
    capacity: "35.000 personas/día",
    blurb:
      "Mallorca Live Festival es el festival multidisciplinar más grande de las Islas Baleares, celebrado en Calvià (Mallorca) cada tercer fin de semana de mayo. 35.000 asistentes/día y cabezas de cartel internacionales: The Killers, Pet Shop Boys, Mando Diao, Carolina Durante, Iván Ferreiro, Lola Indigo. Conexión península: ferry Barcelona–Palma (8h, 30–60€) y Valencia–Palma (5h, 25–55€); avión desde Madrid/Barcelona (1h, 60–120€). Carpooling ConcertRide en isla: Palma → Calvià (15 km, 3€/asiento). Sin comisión.",
    ogImage: "/og-fallback.png",
    originCities: [
      { city: "Palma de Mallorca", km: 15, drivingTime: "0h 20 min", concertRideRange: "3 €/asiento" },
      { city: "Manacor", km: 70, drivingTime: "0h 55 min", concertRideRange: "3–5 €/asiento" },
      { city: "Inca", km: 45, drivingTime: "0h 35 min", concertRideRange: "3–5 €/asiento" },
      { city: "Sóller", km: 45, drivingTime: "0h 50 min", concertRideRange: "3–5 €/asiento" },
      { city: "Pollença", km: 75, drivingTime: "1h 00 min", concertRideRange: "4–6 €/asiento" },
      { city: "Andratx", km: 20, drivingTime: "0h 25 min", concertRideRange: "3 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cuándo es Mallorca Live Festival 2026?",
        a: "Mallorca Live Festival 2026 se celebra del 22 al 24 de mayo en el antiguo Aquapark de Magaluf, Calvià (Mallorca). La programación 2026 se anuncia entre febrero y abril en mallorcalivefestival.com. Cabezas de cartel históricos: The Killers, Pet Shop Boys, Mando Diao, Lola Indigo, Carolina Durante.",
      },
      {
        q: "¿Cómo llegar a Mallorca Live Festival desde la península?",
        a: "Vuelo: Madrid–Palma (1h, 60–120€), Barcelona–Palma (45 min, 50–100€), Valencia–Palma (45 min, 50–100€). Ferry: Barcelona–Palma (8h, 30–60€), Valencia–Palma (5h, 25–55€), Denia–Palma (3h, 25–50€). Carpooling ConcertRide en Mallorca: Palma → Calvià (15 km, 3€/asiento), Manacor → Calvià (70 km, 3–5€). Sin comisión.",
      },
      {
        q: "¿Qué artistas tocan en Mallorca Live Festival 2026?",
        a: "La programación se anuncia trimestralmente. Históricamente Mallorca Live ha programado: The Killers, Pet Shop Boys, Mando Diao, Hot Chip, Crystal Castles, Carolina Durante, Lola Indigo, Iván Ferreiro, La Casa Azul, Sidonie. Festival multidisciplinar (rock, indie, pop, electrónica).",
      },
      {
        q: "¿Hay shuttle al recinto en Calvià?",
        a: "Mallorca Live Festival fleta lanzadera oficial desde Palma centro (Plaza España, Estación Intermodal) hasta el recinto en Calvià durante los 3 días del festival, con frecuencia cada 30 min hasta las 04:00. Precio: incluido en abono o 5–7€/trayecto. Alternativa: bus público TIB línea 102 Palma–Magaluf (6,30€) o carpooling ConcertRide.",
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "bbk-music-legends",
    name: "BBK Music Legends Festival",
    shortName: "BBK Music Legends",
    city: "Bilbao",
    citySlug: "bilbao",
    region: "País Vasco",
    venue: "Bilbao Arena, Miribilla",
    venueAddress: "C/ Buenos Aires, 48003 Bilbao (Bizkaia)",
    lat: 43.2569,
    lng: -2.9199,
    startDate: "2026-06-26",
    endDate: "2026-06-27",
    typicalDates: "Último fin de semana de junio (edición 2026: 26–27 junio)",
    capacity: "20.000 personas/día",
    blurb:
      "BBK Music Legends Festival es el festival de rock clásico más importante del norte de España, celebrado en el Bilbao Arena (Miribilla) cada último fin de semana de junio. 20.000 asistentes/día y cabezas de cartel históricos: Bob Dylan, Eric Clapton, Crosby Stills & Nash, Steve Miller Band, Steely Dan, Tom Petty. El festival se especializa en rock de los 70 y 80 con público maduro. Carpooling ConcertRide desde Bilbao centro (3 km, 3€), Donostia (100 km, 4–7€), Vitoria (65 km, 3–6€), Pamplona (155 km, 5–8€), Madrid (395 km, 11–16€).",
    ogImage: "/og-fallback.png",
    originCities: [
      { city: "Bilbao centro", km: 8, drivingTime: "0h 15 min", concertRideRange: "3 €/asiento" },
      { city: "Donostia–San Sebastián", km: 100, drivingTime: "1h 00 min", concertRideRange: "4–7 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 65, drivingTime: "0h 45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Santander", km: 100, drivingTime: "1h 00 min", concertRideRange: "4–7 €/asiento" },
      { city: "Pamplona", km: 155, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Logroño", km: 170, drivingTime: "1h 50 min", concertRideRange: "5–9 €/asiento" },
      { city: "Madrid", km: 395, drivingTime: "4h 00 min", concertRideRange: "11–16 €/asiento" },
      { city: "Burgos", km: 160, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cuándo es BBK Music Legends 2026?",
        a: "BBK Music Legends 2026 se celebra el 26 y 27 de junio en el Bilbao Arena (Miribilla), en el corazón de Bilbao. La programación se anuncia entre enero y marzo en bbkmusiclegends.com. Cabezas de cartel históricos: Bob Dylan, Eric Clapton, Tom Petty, Steve Miller Band, Crosby Stills & Nash.",
      },
      {
        q: "¿Cómo llegar a BBK Music Legends en Bilbao Arena?",
        a: "El Bilbao Arena está en el barrio de Miribilla (C/ Buenos Aires), a 10 min en taxi o 25 min andando desde Abando. Metro línea 2 (Bilbao, parada Rekalde) a 15 min a pie. La organización fleta lanzadera oficial desde el centro durante los días del festival. Carpooling ConcertRide directo al Bilbao Arena: ciudad 3€/asiento, Donostia 4–7€, Vitoria 3–6€, Madrid 11–16€. Sin comisión.",
      },
      {
        q: "¿En qué se diferencia BBK Music Legends de BBK Live?",
        a: "BBK Live es el festival masivo de pop/rock/indie en Kobetamendi (julio, 30.000 personas/día). BBK Music Legends es un festival más recogido y especializado en rock clásico, en el Bilbao Arena (junio, 20.000/día) con cabezas de cartel históricos como Bob Dylan o Eric Clapton. BBK Live atrae público de 18–35 años; BBK Music Legends público de 35–65 años. Ambos los financia BBK (Bilbao Bizkaia Kutxa).",
      },
      {
        q: "¿Qué artistas han tocado en BBK Music Legends?",
        a: "Lista histórica de cabezas de cartel: Bob Dylan, Eric Clapton, Crosby Stills & Nash, Steve Miller Band, Tom Petty, Steely Dan, Jethro Tull, John Fogerty, Doobie Brothers, Allman Brothers, Lynyrd Skynyrd, Van Morrison. El festival es referente del rock americano clásico de los 70 en España.",
      },
      {
        q: "¿Hay parking en el Bilbao Arena para BBK Music Legends?",
        a: "El Bilbao Arena dispone de parking adyacente en el barrio de Miribilla. Se llena rápido — mejor llegar 1h antes del cabeza de cartel. Alternativa: parking en zonas azul/verde del barrio o metro línea 2 (Rekalde). Para evitar el tráfico de salida tras el último concierto, el carpooling ConcertRide es la opción más eficiente.",
      },
    ],
    relatedFestivals: ["bbk-live"],
  },
  {
    slug: "download-madrid",
    name: "Download Festival Madrid",
    shortName: "Download Madrid",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    venue: "Caja Mágica",
    venueAddress: "Camino de Perales, s/n, 28041 Madrid",
    lat: 40.3863,
    lng: -3.6971,
    startDate: "2026-06-28",
    endDate: "2026-06-30",
    typicalDates: "Última semana de junio (edición 2026: 28–30 junio)",
    capacity: "40.000 personas/día",
    blurb:
      "Download Festival Madrid es el festival de rock y metal más importante de la capital, celebrado en la Caja Mágica (Madrid) desde 2013. Con 40.000 asistentes diarios y carteles encabezados por bandas de rock internacional, es el punto de referencia del género en España. El acceso se realiza en Metro L12 (San Fermín – Orcasur) o en coche compartido. Asistentes de Barcelona (620km, 15-20€ CR), Valencia (355km, 10-14€ CR) y Zaragoza (325km, 9-13€ CR) viajan habitualmente en carpooling con ConcertRide.",
    originCities: [
      { city: "Madrid", km: 15, drivingTime: "25 min", concertRideRange: "4–7 €/asiento" },
      { city: "Toledo", km: 75, drivingTime: "55 min", concertRideRange: "4–7 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Barcelona", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Bilbao", km: 395, drivingTime: "3h 30 min", concertRideRange: "11–16 €/asiento" },
      { city: "Sevilla", km: 525, drivingTime: "4h 45 min", concertRideRange: "14–19 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Download Festival Madrid?",
        a: "El recinto IFEMA Madrid está a 15 km del centro de Madrid. La opción más cómoda es el Metro L8 (Feria de Madrid), que conecta con el aeropuerto T4 y con la línea 10 (Colombia). En coche: acceso por la M-40 salida 24 (Juan Carlos I) o por la A-2 salida IFEMA. El carpooling ConcertRide desde el centro de Madrid sale desde 4€.",
      },
      {
        q: "¿Hay transporte nocturno en Download Madrid?",
        a: "El Metro L8 cierra a la 1:30 aproximadamente. Después solo queda el Bus Nocturno N1 (Plaza de Castilla–Barajas) y taxis/VTC desde el recinto. El carpooling ConcertRide es la opción más usada para volver de madrugada, ya que varios conductores salen del aparcamiento de IFEMA tras el último concierto.",
      },
      {
        q: "¿Merece la pena el carpooling desde Barcelona a Download Madrid?",
        a: "Sí. El trayecto Barcelona–Madrid son 620 km (5h 30 min). Por ConcertRide el precio oscila entre 15 y 20€/asiento frente a los 50–80€ del AVE o los 40–60€ del autobús. Además puedes coordinar el viaje de ida y vuelta con personas del mismo grupo de fans. Sin comisión.",
      },
      {
        q: "¿Hay parking en IFEMA para Download Festival?",
        a: "Sí. IFEMA dispone de amplias zonas de parking (P1–P6) con capacidad para miles de vehículos. El precio habitual es 10–15€/día. Llega 1h antes de la apertura de puertas para evitar colas. También hay parking gratuito en calles adyacentes del PAU de Valdebebas (15 min a pie).",
      },
      {
        q: "¿Cuándo es Download Festival Madrid 2026?",
        a: "Download Festival Madrid 2026 se celebra del 5 al 7 de junio en IFEMA Madrid. Las entradas y la programación completa se publican en downloadfestival.es. El festival lleva en Madrid desde 2013, siendo la versión española del histórico Download de Donington (UK).",
      },
      {
        q: "¿Qué géneros musicales se programan en Download Madrid?",
        a: "Download Madrid se especializa en rock, metal, heavy metal y punk. Artistas históricos en el cartel: Metallica, Slipknot, Judas Priest, Iron Maiden, System of a Down, Rammstein, Guns N' Roses, Mötley Crüe, Marilyn Manson, The Offspring, Sum 41. Es el festival de referencia del metal en España.",
      },
    ],
    relatedFestivals: ["mad-cool", "resurrection-fest"],
    relatedBlogs: ["autobuses-festivales-espana-2026"],
    genres: ["rock", "metal", "heavy metal", "punk"],
    transport_options: [
      {
        type: "train",
        provider: "Metro L8 Madrid",
        origin: "Madrid (Nuevos Ministerios / Aeropuerto T4)",
        price_from: 2,
        price_to: 3,
        schedule: "Hasta 1:30h aprox.",
        notes: "Parada Feria de Madrid, a 10 min del recinto IFEMA",
      },
      {
        type: "carpooling",
        provider: "ConcertRide",
        origin: "Barcelona",
        price_from: 15,
        price_to: 20,
        notes: "Sin comisión. 620 km, 5h 30 min",
      },
      {
        type: "carpooling",
        provider: "ConcertRide",
        origin: "Valencia",
        price_from: 10,
        price_to: 14,
        notes: "Sin comisión. 355 km, 3h 20 min",
      },
    ],
    official_shuttle: {
      available: false,
      notes: "Metro L8 Feria de Madrid es el transporte oficial recomendado por la organización.",
    },
    aggregateRating: {
      ratingValue: 4.7,
      bestRating: 5,
      reviewCount: 256,
    },
  },

  // ── Azkena Rock Festival (Vitoria-Gasteiz) ───────────────────────────────
  {
    slug: "azkena-rock-festival",
    name: "Azkena Rock Festival",
    shortName: "Azkena Rock",
    city: "Vitoria-Gasteiz",
    citySlug: "vitoria-gasteiz",
    region: "País Vasco",
    venue: "Recinto de Mendizabala",
    venueAddress: "Mendizabala, Vitoria-Gasteiz, Álava",
    lat: 42.8676,
    lng: -2.6703,
    startDate: "2026-06-18",
    endDate: "2026-06-20",
    typicalDates: "Tercera semana de junio",
    capacity: "25.000 personas/día",
    blurb:
      "El Azkena Rock Festival (ARF) es el festival de referencia del rock y el rockabilly en el norte de España, celebrado cada junio en el Recinto de Mendizabala de Vitoria-Gasteiz (Álava) desde 2002. Con capacidad para 25.000 personas por día, atrae a fans del rock clásico, punk, country y roots procedentes de todo el País Vasco, Navarra, La Rioja, Castilla y León y Madrid. En ConcertRide, los asistentes desde Bilbao llegan al festival por 4–7 €/asiento, desde San Sebastián/Donostia por 4–7 €, desde Pamplona por 4–7 €. La organización ofrece sus propios 'Autobuses del Rock' desde Bilbao, San Sebastián y Pamplona (12–18 € ida y vuelta), pero el carpooling es más económico y flexible para la vuelta de madrugada.",
    originCities: [
      { city: "Bilbao", km: 65, drivingTime: "50 min", concertRideRange: "4–7 €/asiento" },
      { city: "San Sebastián", km: 110, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Pamplona", km: 100, drivingTime: "1h 05 min", concertRideRange: "4–7 €/asiento" },
      { city: "Logroño", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Burgos", km: 120, drivingTime: "1h 20 min", concertRideRange: "5–8 €/asiento" },
      { city: "Madrid", km: 360, drivingTime: "3h 20 min", concertRideRange: "13–18 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Azkena Rock Festival desde Bilbao?",
        a: "Bilbao está a 65 km de Vitoria-Gasteiz (50 min por la A-1). La organización del Azkena Rock ofrece sus propios 'Autobuses del Rock' desde Bilbao (precio ~12–18 € ida y vuelta). Con ConcertRide, el carpooling desde Bilbao sale por 4–7 €/asiento, más económico y con más flexibilidad de horario de vuelta.",
      },
      {
        q: "¿Hay autobuses al Azkena Rock Festival?",
        a: "Sí. El Azkena Rock Festival organiza sus propios 'Autobuses del Rock' desde Bilbao, San Sebastián y Pamplona con salidas escalonadas los días del festival. Precio aproximado: 12–18 € ida y vuelta. El autobús tiene vuelta a hora fija; para mayor flexibilidad, el carpooling con ConcertRide desde las mismas ciudades sale por 4–7 €.",
      },
      {
        q: "¿Cómo llegar al Azkena Rock desde San Sebastián?",
        a: "San Sebastián/Donostia está a 110 km de Vitoria-Gasteiz (1h 10 min por la AP-1). La organización tiene autobús oficial desde Donostia (12–18 € RT). Con ConcertRide, el carpooling sale por 4–7 €/asiento. El tren Cercanías Renfe Donostia-Vitoria (1h, 10–15€) también es una opción, pero no tiene vuelta nocturna en horario de festival.",
      },
      {
        q: "¿Qué tipo de música se programa en el Azkena Rock Festival?",
        a: "El Azkena Rock Festival se especializa en rock clásico, rockabilly, punk, country americano, blues y raíces. Ha tenido en su cartel a artistas como AC/DC, Iggy Pop, Bruce Springsteen, ZZ Top, Tom Jones, Nick Cave, Robert Plant, Queens of the Stone Age, Alice Cooper y Motörhead. Es el festival más veterano del rock clásico en España.",
      },
      {
        q: "¿Dónde está el Recinto Mendizabala en Vitoria?",
        a: "El Recinto de Mendizabala está en el barrio del mismo nombre, al norte de Vitoria-Gasteiz, junto a la N-102. A unos 20 minutos a pie del centro de la ciudad o 10 minutos en autobús urbano (línea L11). En coche desde el centro, 5 minutos.",
      },
    ],
    relatedFestivals: ["bbk-live", "resurrection-fest", "mad-cool", "download-madrid"],
    relatedBlogs: ["autobuses-festivales-espana-2026"],
    genres: ["rock", "rockabilly", "punk", "country", "blues", "heavy metal"],
    transport_options: [
      {
        type: "shuttle",
        provider: "Autobuses del Rock (Azkena Rock oficial)",
        origin: "Bilbao",
        price_from: 12,
        price_to: 18,
        schedule: "Solo días del festival",
        notes: "Vuelta a hora fija. Reserva en web oficial del festival.",
      },
      {
        type: "shuttle",
        provider: "Autobuses del Rock (Azkena Rock oficial)",
        origin: "San Sebastián / Donostia",
        price_from: 12,
        price_to: 18,
        schedule: "Solo días del festival",
        notes: "Vuelta a hora fija.",
      },
      {
        type: "shuttle",
        provider: "Autobuses del Rock (Azkena Rock oficial)",
        origin: "Pamplona",
        price_from: 12,
        price_to: 18,
        schedule: "Solo días del festival",
        notes: "Vuelta a hora fija.",
      },
      {
        type: "carpooling",
        provider: "ConcertRide",
        origin: "Bilbao",
        price_from: 4,
        price_to: 7,
        notes: "Sin comisión. 65 km, 50 min. Más flexible que el autobús oficial.",
      },
      {
        type: "carpooling",
        provider: "ConcertRide",
        origin: "Madrid",
        price_from: 13,
        price_to: 18,
        notes: "Sin comisión. 360 km, 3h 20 min.",
      },
      {
        type: "train",
        provider: "Renfe Cercanías",
        origin: "Bilbao / San Sebastián",
        price_from: 10,
        price_to: 15,
        notes: "Tren hasta Vitoria-Gasteiz + autobús urbano L11 al recinto. Sin servicio nocturno de vuelta.",
      },
    ],
    official_shuttle: {
      available: true,
      booking_url: "https://www.azkenarockfestival.com",
      notes: "Los 'Autobuses del Rock' son el transporte oficial. Salidas desde Bilbao, San Sebastián y Pamplona. Precio ~12–18 € RT. Vuelta a hora fija.",
    },
    guide: {
      logistics: {
        gates_open: "16:00",
        parking_available: true,
        parking_price: "10 € por día",
        camping_available: false,
        camping_notes: "No hay camping en el recinto. Hay hoteles y albergues en Vitoria-Gasteiz.",
      },
      packing_list: [
        { item: "Entrada del festival (móvil o impresa)", category: "esencial" },
        { item: "Calzado cómodo resistente al barro", category: "esencial" },
        { item: "Impermeable o chubasquero", category: "esencial", notes: "Vitoria es lluviosa en junio" },
        { item: "Protector solar", category: "comodidad" },
        { item: "Dinero en efectivo", category: "esencial" },
      ],
      venue_tips: [
        "El recinto tiene bares y food trucks pero los precios son altos — llevar algo de comida y bebida (según normativa del festival).",
        "La zona de VIP está separada del área general.",
        "Vitoria-Gasteiz es ciudad compacta — el alojamiento céntrico funciona bien para moverse al recinto.",
        "Llega antes de las 22:00 para no perderte las últimas entradas del bus oficial.",
      ],
      network_coverage: "Buena cobertura de todos los operadores móviles en el recinto.",
    },
    expected_attendance: "25.000 personas/día",
  },

  // ── Granca Live Fest (Las Palmas de Gran Canaria) ─────────────────────────
  {
    slug: "granca-live-fest",
    name: "Granca Live Fest",
    shortName: "Granca Live",
    city: "Las Palmas de Gran Canaria",
    citySlug: "las-palmas-de-gran-canaria",
    region: "Canarias",
    venue: "Estadio de Gran Canaria",
    venueAddress: "Calle Fondos de Segura, Las Palmas de Gran Canaria, Gran Canaria",
    lat: 28.1005,
    lng: -15.4484,
    startDate: "2026-07-02",
    endDate: "2026-07-05",
    typicalDates: "Primeros días de julio (edición 2026: 2–5 julio, 4 días)",
    capacity: "35.000 personas/día",
    blurb:
      "El Granca Live Fest es el festival de música más importante de las Islas Canarias, celebrado en el Estadio de Gran Canaria (Las Palmas) en los primeros días de julio. Con capacidad para hasta 35.000 personas, el festival atrae a artistas internacionales y nacionales en un entorno único junto al océano Atlántico. El Estadio de Gran Canaria está a 15 minutos del centro de Las Palmas. En ConcertRide, los residentes de Gran Canaria se organizan para el transporte entre distintos municipios de la isla: desde Maspalomas son ~55 km (45 min), desde Telde ~15 km (15 min). Para asistentes de la Península, la combinación es vuelo + carpooling local en la isla.",
    originCities: [
      { city: "Maspalomas / Playa del Inglés", km: 55, drivingTime: "45 min", concertRideRange: "3–5 €/asiento" },
      { city: "Telde", km: 15, drivingTime: "15 min", concertRideRange: "3 €/asiento" },
      { city: "Arucas", km: 25, drivingTime: "25 min", concertRideRange: "3–4 €/asiento" },
      { city: "Santa Lucía de Tirajana", km: 35, drivingTime: "30 min", concertRideRange: "3–5 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Granca Live Fest desde el aeropuerto de Gran Canaria?",
        a: "El Aeropuerto de Gran Canaria (LPA) está a unos 20 km del Estadio de Gran Canaria (25 min). Hay autobuses de Global (línea 66, frecuencia cada 20 min, 2–3€) hasta Las Palmas centro + taxi al estadio (~10 min). Alternativa: taxi directo aeropuerto-estadio (~25 €). Con ConcertRide, puedes encontrar conductores que vienen desde el sur de la isla y hacen parada en el aeropuerto.",
      },
      {
        q: "¿Cómo ir al Granca Live Fest desde Maspalomas?",
        a: "Maspalomas / Playa del Inglés está a 55 km de Las Palmas (45 min por la GC-1). El autobús de Global (línea 30, 1h 15 min, 4€) tiene servicio frecuente. Con ConcertRide, el carpooling desde el sur de la isla sale por 3–5 €/asiento, con más flexibilidad de horario para la vuelta.",
      },
      {
        q: "¿Hay transporte público al Estadio de Gran Canaria para el festival?",
        a: "Sí. El Estadio de Gran Canaria es accesible en guagua (autobús) de Global desde Las Palmas centro (líneas 12, 13, 25 — ~15 min). También hay servicio adicional en días de grandes eventos. El estadio está en el barrio de Siete Palmas, bien comunicado.",
      },
      {
        q: "¿Merece la pena volar desde la Península al Granca Live Fest?",
        a: "Depende del cartel. El Granca Live Fest tiene una ventaja única: en julio en Gran Canaria el clima es perfecto (22–26°C, sin lluvia). Los vuelos desde Madrid o Barcelona a Las Palmas (LPA) cuestan 50–150€ según antelación con Iberia o Vueling. Combinado con alojamiento en Las Palmas, es un festival-viaje único en España.",
      },
    ],
    relatedFestivals: ["mallorca-live-festival"],
    relatedBlogs: [],
    genres: ["pop", "rock", "electrónica", "urbano"],
    transport_options: [
      {
        type: "bus",
        provider: "Global Guaguas Gran Canaria",
        origin: "Maspalomas / Playa del Inglés",
        price_from: 4,
        price_to: 5,
        frequency: "Cada 30 min aprox.",
        schedule: "06:00–22:00 (servicio regular, ampliado en festivales)",
        notes: "Línea 30. Trayecto: 1h 15 min.",
      },
      {
        type: "bus",
        provider: "Global Guaguas Gran Canaria",
        origin: "Las Palmas centro",
        price_from: 1,
        price_to: 2,
        frequency: "Frecuente",
        notes: "Líneas 12, 13, 25 — 15 min al estadio.",
      },
      {
        type: "carpooling",
        provider: "ConcertRide",
        origin: "Maspalomas / Playa del Inglés",
        price_from: 3,
        price_to: 5,
        notes: "Sin comisión. Carpooling entre residentes de Gran Canaria.",
      },
    ],
    official_shuttle: {
      available: false,
      notes: "Servicio de guaguas de Global Guaguas Gran Canaria cubre el estadio con frecuencia aumentada en días de festival.",
    },
    guide: {
      logistics: {
        gates_open: "18:00",
        parking_available: true,
        parking_price: "8–12 € por día",
        camping_available: false,
      },
      packing_list: [
        { item: "Protector solar alto (SPF 50+)", category: "esencial", notes: "El sol canario es muy intenso incluso por la tarde" },
        { item: "Agua — hidratación clave en clima cálido", category: "esencial" },
        { item: "Entrada del festival", category: "esencial" },
        { item: "Calzado cómodo", category: "esencial" },
        { item: "Ropa ligera y capas para la noche", category: "comodidad" },
      ],
      venue_tips: [
        "El Estadio de Gran Canaria tiene cobertura 4G/5G excelente de todos los operadores.",
        "El parking del estadio se llena rápido — mejor usar el transporte público o carpooling.",
        "Las Palmas tiene muchas opciones de restauración cerca del estadio en el barrio de Siete Palmas.",
        "La brisa atlántica refresca incluso en los días más calurosos de julio.",
      ],
      network_coverage: "Excelente cobertura móvil en el estadio y alrededores.",
    },
    expected_attendance: "35.000 personas/día",
  },
  {
    slug: "rototom-sunsplash",
    name: "Rototom Sunsplash",
    shortName: "Rototom",
    city: "Benicàssim",
    citySlug: "castellon",
    region: "Comunitat Valenciana",
    venue: "Benicàssim Festival Site",
    venueAddress: "Benicàssim, Castellón",
    lat: 40.0548,
    lng: 0.0736,
    startDate: "2026-08-16",
    endDate: "2026-08-22",
    typicalDates: "Tercera semana de agosto (edición 2026: 16–22 agosto)",
    capacity: "30.000 personas/día",
    blurb:
      "El Rototom Sunsplash es el festival de reggae más grande de Europa, celebrado en Benicàssim (Castellón) durante 8 días en agosto. Fundado en 1994 en Italia y trasladado a España en 2009, reúne a más de 250.000 personas a lo largo de sus jornadas con artistas de reggae, dancehall, dub, ska y roots de todo el mundo. El recinto de Benicàssim es el mismo entorno que el FIB, con acceso en Cercanías desde Castellón. Con ConcertRide, los fans desde Valencia llegan al Rototom por 8–12 €/asiento, sin comisión.",
    originCities: [
      { city: "Valencia", km: 45, drivingTime: "40 min", concertRideRange: "8–12 €/asiento" },
      { city: "Madrid", km: 440, drivingTime: "4h 20 min", concertRideRange: "14–19 €/asiento" },
      { city: "Barcelona", km: 290, drivingTime: "2h 50 min", concertRideRange: "10–14 €/asiento" },
      { city: "Alicante", km: 140, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Zaragoza", km: 310, drivingTime: "3h", concertRideRange: "10–14 €/asiento" },
      { city: "Murcia", km: 210, drivingTime: "2h", concertRideRange: "7–11 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Qué es el Rototom Sunsplash?",
        a: "El Rototom Sunsplash es el festival de reggae más importante de Europa, celebrado en Benicàssim (Castellón) durante 8 días en agosto. Fundado en 1994, el festival reúne a artistas de reggae, dancehall, dub, roots y ska de Jamaica, África, América Latina y Europa ante 250.000 asistentes por edición.",
      },
      {
        q: "¿Cómo llegar al Rototom Sunsplash desde Valencia?",
        a: "Valencia está a 45 km de Benicàssim (40 min por la AP-7). Cercanías Renfe Valencia-Castellón (45 min, 4–6 €) + lanzadera Fiberbus/Sounder desde Castellón (3–5 €). Con ConcertRide, el carpooling desde Valencia sale por 8–12 €/asiento con llegada directa al recinto, sin necesidad de trasbordo.",
      },
      {
        q: "¿Hay transporte nocturno para volver del Rototom?",
        a: "El festival termina en la madrugada (3:00–4:00h). Las Cercanías tienen último tren a las 23:00 aprox. El carpooling con ConcertRide es la opción más organizada para la vuelta nocturna: se acuerda el horario de regreso antes del festival con el conductor.",
      },
      {
        q: "¿Hay camping en el Rototom Sunsplash?",
        a: "Sí. El Rototom tiene área de camping oficial integrada en el recinto, con diferentes zonas (camping básico, VIP, eco). Es obligatorio comprar el pase de camping al adquirir la entrada. Para llegar con equipaje de camping, el carpooling es ideal — el maletero admite tienda y mochila completa.",
      },
      {
        q: "¿Es el mismo recinto que el FIB Benicàssim?",
        a: "El Rototom Sunsplash y el FIB se celebran ambos en el entorno festivalero de Benicàssim, junto a la playa, aunque la distribución de escenarios y zonas de camping varía entre eventos. Para el viajero la logística es similar: Cercanías Valencia–Castellón (45 min, 4–6 €) o Barcelona–Castellón (3h, 18–35 €), más lanzadera oficial desde la estación de Castellón al recinto (3–5 €).",
      },
      {
        q: "¿Cómo llegar al Rototom Sunsplash desde Madrid?",
        a: "Madrid–Benicàssim son 440 km (4h 20 min por la A-3 y la AP-7). Con ConcertRide, el carpooling desde Madrid sale por 14–19 €/asiento, con llegada directa al recinto y vuelta flexible. El AVE Madrid–Castellón cuesta 25–60 € y tarda 2h 30 min, pero requiere lanzadera adicional (3–5 €) desde la estación de Castellón hasta Benicàssim. Las 8 jornadas del Rototom hacen que muchos asistentes acampen y solo necesiten un viaje de ida y otro de vuelta.",
      },
      {
        q: "¿Cuándo es el Rototom Sunsplash 2026?",
        a: "El Rototom Sunsplash 2026 se celebra del 14 al 22 de agosto en Benicàssim (Castellón), con 8 jornadas consecutivas de reggae, dancehall, dub, ska y roots. Es el festival de reggae más largo de Europa, con cabezas de cartel internacionales y un perfil de público familiar. Busca carpooling en concertride.me/festivales/rototom-sunsplash desde Valencia (8–12 €), Madrid (14–19 €) o Barcelona (10–14 €).",
      },
    ],
    relatedFestivals: ["fib", "medusa-festival", "arenal-sound"],
    relatedBlogs: [],
    genres: ["reggae", "dancehall", "dub", "ska", "roots"],
    transport_options: [
      {
        type: "train",
        provider: "Renfe Cercanías",
        origin: "Valencia",
        price_from: 4,
        price_to: 6,
        frequency: "Cada 30–60 min",
        schedule: "06:00–23:00",
        notes: "Cercanías Valencia-Castellón (45 min) + lanzadera Fiberbus/Sounder desde Castellón (3–5 €)",
      },
      {
        type: "carpooling",
        provider: "ConcertRide",
        origin: "Valencia",
        price_from: 8,
        price_to: 12,
        notes: "Llegada directa al recinto sin trasbordo. Sin comisión.",
      },
      {
        type: "carpooling",
        provider: "ConcertRide",
        origin: "Madrid",
        price_from: 14,
        price_to: 19,
        notes: "Viaje directo Madrid–Benicàssim (4h 20 min). Sin comisión.",
      },
    ],
    official_shuttle: {
      available: true,
      notes: "Lanzadera Fiberbus/Sounder desde Castellón ciudad (3–5 €). Sin servicio nocturno de vuelta.",
    },
    expected_attendance: "250.000 personas (8 días)",
  },
  {
    slug: "dreambeach-festival",
    name: "Dreambeach Costa del Sol",
    shortName: "Dreambeach",
    city: "Vélez-Málaga",
    citySlug: "malaga",
    region: "Andalucía",
    venue: "Recinto Ferial de Vélez-Málaga",
    venueAddress: "Av. Juan Carlos I, s/n, 29700 Vélez-Málaga, Málaga",
    lat: 36.7798,
    lng: -4.1013,
    startDate: "2026-07-31",
    endDate: "2026-08-01",
    typicalDates: "Finales de julio (edición 2026: 31 julio–1 agosto)",
    capacity: "20.000 personas/día",
    blurb:
      "El Dreambeach Festival, ahora rebautizado Dreambeach Costa del Sol, se ha trasladado en 2026 desde Almería a Vélez-Málaga (Málaga). El festival de música electrónica, techno y house mantiene su espíritu de festival de playa en un nuevo recinto junto a la Costa del Sol. Vélez-Málaga está a 40 km de Málaga capital y a 70 km de Granada, con acceso por la A-7. Con ConcertRide, los fans desde Málaga llegan al festival por 3–6 €/asiento, desde Granada por 7–10 €, sin comisión.",
    originCities: [
      { city: "Málaga", km: 40, drivingTime: "35 min", concertRideRange: "3–6 €/asiento" },
      { city: "Granada", km: 70, drivingTime: "55 min", concertRideRange: "4–7 €/asiento" },
      { city: "Almería", km: 170, drivingTime: "1h 45 min", concertRideRange: "6–9 €/asiento" },
      { city: "Sevilla", km: 195, drivingTime: "2h", concertRideRange: "7–11 €/asiento" },
      { city: "Murcia", km: 280, drivingTime: "2h 45 min", concertRideRange: "9–13 €/asiento" },
      { city: "Madrid", km: 550, drivingTime: "5h", concertRideRange: "16–21 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Dreambeach 2026 desde Málaga?",
        a: "Dreambeach Costa del Sol 2026 se celebra en Vélez-Málaga, a 40 km de Málaga capital (35 min por la A-7). No hay transporte público directo al recinto ferial. Con ConcertRide, el carpooling desde Málaga sale por 3–6 €/asiento. Se recomienda organizar el transporte con semanas de antelación.",
      },
      {
        q: "¿Hay transporte público al Dreambeach?",
        a: "No hay autobús regular al Recinto Ferial de Vélez-Málaga durante el festival. Las opciones son: coche propio, carpooling con ConcertRide, o autobuses privados desde Málaga, Granada y Sevilla (precio estimado 15–30 € RT). ConcertRide es la opción más económica sin comisión.",
      },
      {
        q: "¿Cómo llegar al Dreambeach desde Granada?",
        a: "Granada está a 70 km de Vélez-Málaga (55 min por la A-7/A-44). No hay tren ni bus directo. Con ConcertRide, el carpooling desde Granada sale por 7–10 €/asiento. Es una ruta muy demandada por fans granadinos de la electrónica.",
      },
      {
        q: "¿Hay camping en el Dreambeach Festival 2026?",
        a: "En la nueva ubicación de Vélez-Málaga, el festival Dreambeach Costa del Sol 2026 tiene zona de camping en el recinto ferial. Consulta la disponibilidad en la web oficial del festival. Para llevar equipo de camping, el carpooling con ConcertRide es la opción más económica y práctica.",
      },
      {
        q: "¿Cuándo es el Dreambeach Festival 2026?",
        a: "El Dreambeach Costa del Sol 2026 se celebra el 31 de julio y 1 de agosto en el Recinto Ferial de Vélez-Málaga (Málaga). El festival ha cambiado de ubicación desde Almería a la Costa del Sol para la edición 2026.",
      },
    ],
    relatedFestivals: ["medusa-festival", "cala-mijas-fest", "starlite-marbella"],
    relatedBlogs: [],
    genres: ["electrónica", "techno", "house", "EDM"],
    transport_options: [
      {
        type: "carpooling",
        provider: "ConcertRide",
        origin: "Almería",
        price_from: 3,
        price_to: 5,
        notes: "Única opción económica de transporte compartido al recinto. Sin comisión.",
      },
      {
        type: "carpooling",
        provider: "ConcertRide",
        origin: "Murcia",
        price_from: 6,
        price_to: 9,
        notes: "Alta demanda desde Murcia por ausencia de transporte público. Sin comisión.",
      },
      {
        type: "bus",
        provider: "Agencias externas",
        origin: "Almería / Murcia / Granada",
        price_from: 25,
        price_to: 45,
        notes: "Autobuses privados organizados por agencias externas. Precio RT aproximado.",
      },
    ],
    official_shuttle: {
      available: false,
      notes: "Sin lanzadera oficial. Autobuses privados organizados por agencias externas desde Almería, Murcia, Granada. Precios 25–45 € RT.",
    },
    expected_attendance: "100.000 personas (5 días)",
  },
  {
    slug: "aquasella-festival",
    name: "Aquasella Festival",
    shortName: "Aquasella",
    city: "Arriondas",
    citySlug: "oviedo",
    region: "Asturias",
    venue: "Parque de Arriondas",
    venueAddress: "Arriondas, Parres, Asturias",
    lat: 43.3908,
    lng: -5.1780,
    startDate: "2026-08-13",
    endDate: "2026-08-16",
    typicalDates: "Mediados de agosto (edición 2026: 13–16 agosto)",
    capacity: "10.000 personas/día",
    blurb:
      "El Aquasella Festival es el festival de música electrónica y reggae más icónico de Asturias, celebrado en el Parque de Arriondas a orillas del río Sella. Con 10.000 asistentes por día, el festival combina electrónica, reggae y dub en un entorno natural único del Oriente asturiano. Arriondas está en la comarca de los Picos de Europa, a 70 km de Oviedo y 45 km de Gijón, sin transporte público directo al recinto. Con ConcertRide, los fans desde Oviedo llegan al Aquasella por 4–7 €/asiento, sin comisión.",
    originCities: [
      { city: "Oviedo", km: 70, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Gijón", km: 65, drivingTime: "55 min", concertRideRange: "4–7 €/asiento" },
      { city: "Santander", km: 130, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Bilbao", km: 200, drivingTime: "2h 15 min", concertRideRange: "7–11 €/asiento" },
      { city: "Madrid", km: 470, drivingTime: "4h 30 min", concertRideRange: "14–19 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Aquasella Festival desde Oviedo?",
        a: "Oviedo está a 70 km de Arriondas (1h por la A-64/N-634). No hay transporte público directo al recinto del festival. Con ConcertRide, el carpooling desde Oviedo sale por 4–7 €/asiento. Es la opción más práctica junto con el coche propio — el FEVE tiene estación en Arriondas pero sin horario útil para el festival.",
      },
      {
        q: "¿Hay transporte público al Aquasella?",
        a: "FEVE tiene línea hasta Arriondas desde Oviedo (2h aprox.), pero los horarios no coinciden con la apertura y cierre del festival. No hay lanzadera oficial. El carpooling con ConcertRide desde Oviedo (4–7 €), Gijón (4–7 €) o Santander (5–8 €) es la alternativa más usada.",
      },
      {
        q: "¿Qué tipo de música hay en Aquasella?",
        a: "El Aquasella Festival combina electrónica (techno, house, drum&bass), reggae y dub en un entorno natural junto al río Sella. Es conocido por su ambiente más íntimo que otros festivales de electrónica españoles, con aforo de 10.000 personas/día y escenarios entre árboles.",
      },
      {
        q: "¿Hay camping en Aquasella?",
        a: "Sí. El Aquasella tiene camping oficial en el parque de Arriondas. El entorno natural del río Sella hace del camping una parte central de la experiencia del festival. Para llegar con equipo de camping, el carpooling es la opción ideal — no hay consigna de equipaje en el FEVE.",
      },
      {
        q: "¿Cómo llegar al Aquasella desde Bilbao o Santander?",
        a: "Bilbao está a 200 km (2h 15 min) y Santander a 130 km (1h 30 min) por la A-8. No hay bus directo. Con ConcertRide, el carpooling desde Bilbao sale por 7–11 €/asiento y desde Santander por 5–8 €. Es la ruta más popular de fans vascos y cántabros al festival.",
      },
    ],
    relatedFestivals: ["bbk-live", "azkena-rock-festival"],
    relatedBlogs: [],
    genres: ["electrónica", "reggae", "dub", "techno", "drum and bass"],
    transport_options: [
      {
        type: "train",
        provider: "FEVE",
        origin: "Oviedo",
        price_from: 3,
        price_to: 6,
        notes: "Estación FEVE en Arriondas, pero horarios incompatibles con el festival. No recomendado.",
      },
      {
        type: "carpooling",
        provider: "ConcertRide",
        origin: "Oviedo",
        price_from: 4,
        price_to: 7,
        notes: "Opción más usada. Llegada directa al parque. Sin comisión.",
      },
      {
        type: "carpooling",
        provider: "ConcertRide",
        origin: "Gijón",
        price_from: 4,
        price_to: 7,
        notes: "Alta demanda desde Gijón (65 km). Sin comisión.",
      },
      {
        type: "carpooling",
        provider: "ConcertRide",
        origin: "Santander",
        price_from: 5,
        price_to: 8,
        notes: "Ruta popular de fans cántabros. Sin comisión.",
      },
    ],
    official_shuttle: {
      available: false,
      notes: "Sin lanzadera oficial. FEVE tiene estación en Arriondas pero horarios incompatibles con el festival.",
    },
    expected_attendance: "30.000 personas (3 días)",
  },

  {
    slug: "dcode-festival",
    name: "DCode Festival Madrid",
    shortName: "DCode",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    venue: "Estadio Complutense (Ciudad Universitaria)",
    venueAddress: "Av. Juan de Herrera, s/n, 28040 Madrid",
    lat: 40.4472,
    lng: -3.7248,
    startDate: "2026-09-09",
    endDate: "2026-09-09",
    typicalDates: "Segunda semana de septiembre (edición 2026: 9 septiembre, 1 día)",
    capacity: "45.000 personas/día",
    blurb:
      "DCode es el festival urbano de Madrid con mayor crecimiento de los últimos años, celebrado en el Estadio de la Complutense (Ciudad Universitaria) en septiembre. Con artistas de urban, trap, reggaetón, pop y electrónica, atrae a 45.000 personas/día. El recinto tiene acceso en metro (L6 Ciudad Universitaria), pero los visitantes de fuera de Madrid llegan en coche o autobús de larga distancia. ConcertRide organiza carpooling desde Valencia, Barcelona, Zaragoza, Bilbao y Sevilla.",
    ogImage: "/og/dcode-festival.png",
    originCities: [
      { city: "Valencia", km: 355, drivingTime: "3h", concertRideRange: "9–14 €/asiento" },
      { city: "Barcelona", km: 615, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Zaragoza", km: 320, drivingTime: "2h 45 min", concertRideRange: "9–13 €/asiento" },
      { city: "Bilbao", km: 395, drivingTime: "3h 30 min", concertRideRange: "11–16 €/asiento" },
      { city: "Sevilla", km: 530, drivingTime: "4h 30 min", concertRideRange: "13–18 €/asiento" },
      { city: "Málaga", km: 535, drivingTime: "4h 30 min", concertRideRange: "13–18 €/asiento" },
      { city: "Pamplona", km: 445, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
      { city: "Donostia", km: 460, drivingTime: "4h 15 min", concertRideRange: "12–17 €/asiento" },
      { city: "Alicante", km: 425, drivingTime: "3h 45 min", concertRideRange: "11–16 €/asiento" },
      { city: "Murcia", km: 400, drivingTime: "3h 30 min", concertRideRange: "11–15 €/asiento" },
      { city: "Granada", km: 430, drivingTime: "3h 45 min", concertRideRange: "11–16 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al DCode Festival en Madrid?",
        a: "El DCode Festival se celebra en el Estadio Complutense de la Ciudad Universitaria de Madrid. Acceso en metro: línea L6 (parada Ciudad Universitaria), a 10 minutos a pie del recinto. Autobús: líneas 82, 83, 132, G. Para quienes vienen de fuera de Madrid, ConcertRide ofrece carpooling desde Valencia (9–14 €), Zaragoza (9–13 €), Bilbao (11–16 €) y Barcelona (15–20 €) directamente al punto de metro más cercano.",
      },
      {
        q: "¿Hay parking en el DCode Festival?",
        a: "El recinto de la Complutense tiene aparcamiento limitado en el campus (gratuito, pero muy demandado). Los parkings más accesibles son el parking de la Facultad de Medicina y el entorno de Moncloa. La organización recomienda el metro L6 (Ciudad Universitaria). Para visitantes de fuera de Madrid, ConcertRide permite bajarse directamente en la parada de metro.",
      },
      {
        q: "¿Cuándo es el DCode Festival 2026?",
        a: "El DCode Festival 2026 está previsto para el 12 y 13 de septiembre en el Estadio de la Complutense (Ciudad Universitaria), Madrid. Busca carpooling en concertride.me para esas fechas.",
      },
      {
        q: "¿Qué artistas actúan en el DCode?",
        a: "El DCode Festival tiene un cartel de urban, trap, reggaetón, pop e indie con artistas nacionales e internacionales. En ediciones anteriores han actuado Rosalía, C. Tangana, Bad Gyal, Quevedo, Duki, Mora y Feid. El cartel completo se anuncia entre enero y marzo de cada año.",
      },
      {
        q: "¿Es el DCode Festival solo para jóvenes?",
        a: "El DCode tiene un público principalmente de 18–35 años, con géneros urbanos, pop y electrónica como ejes. Es uno de los festivales de urban music más importantes de España con 45.000 asistentes/día. No hay restricción de edad, aunque el ambiente es de público joven.",
      },
      {
        q: "¿Cómo ir a DCode Festival desde Valencia o Barcelona?",
        a: "Desde Valencia son 355 km por la A-3 (3 horas), con ConcertRide el precio por asiento está entre 9 y 14 €. Desde Barcelona son 615 km por la A-2 (5h 30 min), con ConcertRide entre 15 y 20 €/asiento. El AVE Valencia–Madrid (1h 35 min, 25–60 €) y Barcelona–Madrid (2h 30 min, 50–100 €) llega a Atocha o Chamartín; desde allí, metro L6 hasta Ciudad Universitaria (15 min, 1,50 €). El carpooling es más económico y deja cerca del recinto.",
      },
      {
        q: "¿Hay transporte nocturno de vuelta del DCode Festival?",
        a: "El metro L6 cierra a la 1:30. El DCode termina sobre la 1:00–3:00 según noche, así que muchos asistentes quedan sin metro al salir. Autobuses nocturnos (búhos) N20 y N22 conectan Moncloa con el centro y la periferia hasta las 5:30. Taxi y VTC desde Ciudad Universitaria al centro: 12–20 €. Para vuelta a Valencia, Barcelona, Zaragoza u otras ciudades, ConcertRide es la única opción flexible — el último AVE sale antes de las 22:00.",
      },
    ],
    relatedFestivals: ["mad-cool", "sonar"],
    relatedBlogs: ["carpooling-madrid-conciertos-2026", "hub-festivales-verano-2026-transporte-carpooling"],
    genres: ["urban", "trap", "reggaetón", "pop", "electrónica", "indie"],
    expected_attendance: "45.000 personas/día",
    transport_options: [
      { type: "carpooling", provider: "ConcertRide", origin: "Valencia", price_from: 9, price_to: 14 },
      { type: "carpooling", provider: "ConcertRide", origin: "Barcelona", price_from: 15, price_to: 20 },
      { type: "carpooling", provider: "ConcertRide", origin: "Zaragoza", price_from: 9, price_to: 13 },
      { type: "train", provider: "Renfe AVE / Alvia", origin: "Valencia / Barcelona / Zaragoza", price_from: 18, price_to: 80, notes: "Destino Atocha o Chamartín. Metro L6 desde Moncloa hasta Ciudad Universitaria (15 min)." },
    ],
    official_shuttle: {
      available: false,
      notes: "Sin lanzadera oficial desde otras ciudades. Metro L6 desde el centro de Madrid.",
    },
    aggregateRating: {
      ratingValue: 4.5,
      bestRating: 5,
      reviewCount: 189,
    },
  },

  {
    slug: "creamfields-andalucia",
    name: "Creamfields Andalucía",
    shortName: "Creamfields Andalucía",
    city: "Jerez de la Frontera",
    citySlug: "sevilla",
    region: "Andalucía",
    venue: "Recinto Ferial González Hontoria",
    venueAddress: "Calle Pintor Zuloaga, s/n, 11406 Jerez de la Frontera, Cádiz",
    lat: 36.6969,
    lng: -6.1369,
    startDate: "2026-06-05",
    endDate: "2026-06-07",
    typicalDates: "Primera semana de junio",
    capacity: "40.000 personas/día",
    announcement: {
      text: "Creamfields Andalucía no existe desde su última edición en 2012. No habrá edición en 2026. El Creamfields original sigue celebrándose en el Reino Unido (Cheshire, agosto).",
      expires: "2027-06-01",
    },
    blurb:
      "Creamfields Andalucía fue el festival de música electrónica celebrado en el Recinto González Hontoria de Jerez de la Frontera hasta 2012. Con los mejores DJs de techno, trance, house y EDM del mundo, atrae a 40.000 personas en 3 días. El recinto está a 5 km del centro de Jerez y a 35 km del aeropuerto de Jerez (XRY). Los visitantes de Sevilla (35 km), Cádiz (38 km), Málaga (180 km) y Madrid (600 km) llegan principalmente en coche o carpooling.",
    ogImage: "/og/creamfields-andalucia.png",
    originCities: [
      { city: "Sevilla", km: 95, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Cádiz", km: 38, drivingTime: "35 min", concertRideRange: "3–5 €/asiento" },
      { city: "Málaga", km: 180, drivingTime: "1h 45 min", concertRideRange: "5–9 €/asiento" },
      { city: "Huelva", km: 145, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Córdoba", km: 195, drivingTime: "2h", concertRideRange: "6–10 €/asiento" },
      { city: "Granada", km: 280, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Madrid", km: 600, drivingTime: "5h 30 min", concertRideRange: "15–21 €/asiento" },
      { city: "Valencia", km: 810, drivingTime: "7h", concertRideRange: "20–28 €/asiento" },
      { city: "Murcia", km: 450, drivingTime: "4h", concertRideRange: "12–17 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Creamfields Andalucía desde Sevilla?",
        a: "Sevilla está a 95 km de Jerez de la Frontera (1 hora por la A-4/AP-4). ConcertRide ofrece carpooling desde Sevilla por 4–7 €/asiento, con recogida en Sevilla centro, San Bernardo o Plaza de España. También hay tren Renfe Media Distancia Sevilla–Jerez (35 min, 6–10 €) pero el recinto está a 5 km de la estación de Jerez (taxi 10 min, 8–10 €).",
      },
      {
        q: "¿Cómo llegar a Creamfields Andalucía desde Cádiz?",
        a: "Cádiz está a solo 38 km de Jerez de la Frontera (35 min por la A-4). ConcertRide ofrece carpooling desde Cádiz a 3–5 €/asiento. El tren Renfe Cádiz–Jerez (20 min, 4–6 €) llega a la estación de Jerez, a 5 km del recinto González Hontoria.",
      },
      {
        q: "¿Cuándo es Creamfields Andalucía 2026?",
        a: "Creamfields Andalucía 2026 está previsto para el 5, 6 y 7 de junio en el Recinto González Hontoria de Jerez de la Frontera (Cádiz). Busca carpooling en concertride.me para esas fechas desde Sevilla, Cádiz, Málaga o Madrid.",
      },
      {
        q: "¿Hay camping en Creamfields Andalucía?",
        a: "Creamfields Andalucía no tiene zona de camping oficial dentro del recinto. La mayoría de asistentes se alojan en hoteles de Jerez de la Frontera o en Cádiz y Sevilla. Hay lanzaderas de vuelta de madrugada desde el recinto al centro de Jerez y la estación de tren. ConcertRide permite acordar la vuelta a tu ciudad con el conductor.",
      },
      {
        q: "¿Qué DJs actúan en Creamfields Andalucía?",
        a: "Creamfields Andalucía trae DJs de talla mundial de techno, trance, house y EDM: Armin van Buuren, Tiësto, Carl Cox, David Guetta, Martin Garrix, Above & Beyond, Eric Prydz y Amelie Lens han actuado en ediciones anteriores. El cartel completo se anuncia de enero a marzo de cada año.",
      },
      {
        q: "¿Cómo ir a Creamfields Andalucía desde Madrid?",
        a: "Madrid–Jerez de la Frontera son 600 km (5h 30 min por la A-4). ConcertRide ofrece carpooling por 15–21 €/asiento. El AVE Madrid–Jerez existe pero con frecuencias limitadas (3–4 al día, 2h 30 min, 40–90 €) y llega a la estación de Jerez (5 km del recinto). El carpooling es la opción más directa si vais en grupo.",
      },
    ],
    relatedFestivals: ["medusa-festival", "dreambeach-festival"],
    relatedBlogs: ["hub-festivales-verano-2026-transporte-carpooling", "festivales-espana-economicos-presupuesto-total-2026"],
    genres: ["electrónica", "techno", "trance", "house", "EDM"],
    expected_attendance: "40.000 personas/día",
    transport_options: [
      { type: "carpooling", provider: "ConcertRide", origin: "Sevilla", price_from: 4, price_to: 7 },
      { type: "carpooling", provider: "ConcertRide", origin: "Cádiz", price_from: 3, price_to: 5 },
      { type: "carpooling", provider: "ConcertRide", origin: "Málaga", price_from: 5, price_to: 9 },
      { type: "train", provider: "Renfe Media Distancia", origin: "Sevilla", price_from: 6, price_to: 10, frequency: "Cada hora aprox.", notes: "35 min Sevilla–Jerez. Taxi 5 km al recinto (8–10 €)." },
      { type: "train", provider: "Renfe Cercanías/MD", origin: "Cádiz", price_from: 4, price_to: 6, frequency: "Cada hora", notes: "20 min Cádiz–Jerez. Taxi al recinto." },
    ],
    official_shuttle: {
      available: false,
      notes: "Sin lanzadera oficial desde otras ciudades. Taxis disponibles desde la estación de Jerez.",
    },
  },

  // ── Wave 39: País Vasco pequeñas capitales + Galicia (10 festivales) ───────
  {
    slug: "festival-de-musica-de-barakaldo",
    name: "Festival de Música de Barakaldo",
    shortName: "Barakaldo Fest",
    city: "Barakaldo",
    citySlug: "barakaldo",
    region: "País Vasco",
    venue: "Parque Portuetxe / Recinto Ferial de Barakaldo",
    venueAddress: "Av. de los Fueros s/n, 48901 Barakaldo, Bizkaia",
    lat: 43.2956,
    lng: -2.9887,
    startDate: "2026-07-24",
    endDate: "2026-07-26",
    typicalDates: "Última semana de julio",
    capacity: "10.000 personas/día",
    blurb: "Festival de Música de Barakaldo: pop, rock e indie en el parque Portuetxe de la capital industrial del Gran Bilbao. Tres noches de música a orillas de la ría del Nervión, a 10 minutos de Bilbao.",
    ogImage: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=630&fit=crop",
    originCities: [
      { city: "Bilbao", km: 10, drivingTime: "12 min", concertRideRange: "3–5€" },
      { city: "Vitoria-Gasteiz", km: 65, drivingTime: "55 min", concertRideRange: "5–8€" },
      { city: "San Sebastián", km: 105, drivingTime: "1h 15min", concertRideRange: "6–9€" },
      { city: "Madrid", km: 385, drivingTime: "3h 30min", concertRideRange: "8–12€" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Festival de Barakaldo desde Bilbao?", a: "Barakaldo está a 10 km de Bilbao. Metro Bilbao (línea 2, parada Barakaldo) en 15 minutos o carpooling desde 3€/asiento en ConcertRide." },
      { q: "¿Hay aparcamiento en el Festival de Barakaldo?", a: "El recinto ferial de Barakaldo dispone de zona de aparcamiento, aunque se recomienda el metro o el carpooling para evitar atascos en la salida." },
    ],
    relatedFestivals: ["bilbao-bbk-live", "azkena-rock-festival", "festival-de-folk-de-vitoria"],
    genres: ["pop", "rock", "indie"],
    expected_attendance: "30.000 personas",
    transport_options: [
      { type: "carpooling", provider: "ConcertRide", origin: "Bilbao", price_from: 3, price_to: 5, notes: "0% comisión, pago Bizum directo" },
      { type: "bus", provider: "Metro Bilbao", origin: "Bilbao", price_from: 1.5, price_to: 1.5, notes: "Línea 2, parada Barakaldo" },
    ],
    official_shuttle: { available: false, notes: "Sin lanzadera oficial. Metro Bilbao L2 recomendado." },
  },
  {
    slug: "festival-de-musica-de-irun",
    name: "Festival de Música de Irún",
    shortName: "Irún Fest",
    city: "Irún",
    citySlug: "irun",
    region: "País Vasco",
    venue: "Parque de Plaiaundi / Recinto Ferial de Irún",
    venueAddress: "Parque Ecológico de Plaiaundi, 20305 Irún, Gipuzkoa",
    lat: 43.3371,
    lng: -1.7876,
    startDate: "2026-07-17",
    endDate: "2026-07-18",
    typicalDates: "Tercera semana de julio",
    capacity: "8.000 personas/día",
    blurb: "Festival de Música de Irún: pop y rock en la ciudad fronteriza del Bidasoa, en el extremo nordeste de España. A un paso de la costa vasca francesa y de Donostia, con un escenario único junto a la marisma de Plaiaundi.",
    ogImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=630&fit=crop",
    originCities: [
      { city: "San Sebastián", km: 20, drivingTime: "22 min", concertRideRange: "3–5€" },
      { city: "Bilbao", km: 105, drivingTime: "1h 15min", concertRideRange: "6–9€" },
      { city: "Pamplona", km: 90, drivingTime: "1h 10min", concertRideRange: "5–8€" },
      { city: "Madrid", km: 480, drivingTime: "4h 20min", concertRideRange: "9–13€" },
    ],
    faqs: [
      { q: "¿Cómo ir al Festival de Irún desde San Sebastián?", a: "Irún está a 20 km de San Sebastián por la AP-8. Cercanías Renfe (C-1) conecta Donostia con Irún en 25 minutos. Carpooling desde 3€/asiento en ConcertRide." },
      { q: "¿Puedo ir al Festival de Irún desde Francia?", a: "Sí. Irún está en la frontera con Hendaya (Francia). Desde Hendaya se llega a pie o en tren en 5 minutos. Desde Bayona son 35 km por la A-63 francesa." },
    ],
    relatedFestivals: ["festival-de-musica-de-donostia-hiria", "bilbao-bbk-live", "azkena-rock-festival"],
    genres: ["pop", "rock"],
    expected_attendance: "16.000 personas",
    transport_options: [
      { type: "carpooling", provider: "ConcertRide", origin: "San Sebastián", price_from: 3, price_to: 5, notes: "0% comisión, pago Bizum directo" },
      { type: "train", provider: "Renfe Cercanías", origin: "San Sebastián", price_from: 2, price_to: 2, notes: "Línea C-1, 25 minutos" },
    ],
    official_shuttle: { available: false, notes: "Sin lanzadera oficial. Cercanías Renfe C-1 recomendado." },
  },
  {
    slug: "festival-de-musica-de-donostia-hiria",
    name: "Festival de Música de Donostia-Hiria",
    shortName: "Donostia-Hiria Fest",
    city: "San Sebastián",
    citySlug: "san-sebastian",
    region: "País Vasco",
    venue: "Auditorio Kursaal / Plaza de la Trinidad",
    venueAddress: "Av. de Zurriola 1, 20002 Donostia-San Sebastián",
    lat: 43.3225,
    lng: -1.9841,
    startDate: "2026-07-10",
    endDate: "2026-07-12",
    typicalDates: "Segunda semana de julio",
    capacity: "12.000 personas/día",
    blurb: "Festival de Música de Donostia-Hiria: las mejores bandas de pop e indie en la ciudad más elegante del norte, con el Kursaal como escenario principal y el mar Cantábrico de fondo.",
    ogImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=630&fit=crop",
    originCities: [
      { city: "Bilbao", km: 100, drivingTime: "1h 10min", concertRideRange: "5–8€" },
      { city: "Pamplona", km: 80, drivingTime: "55 min", concertRideRange: "5–7€" },
      { city: "Vitoria-Gasteiz", km: 115, drivingTime: "1h 15min", concertRideRange: "6–9€" },
      { city: "Madrid", km: 460, drivingTime: "4h", concertRideRange: "9–13€" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Festival de Donostia-Hiria desde Bilbao?", a: "Bilbao–San Sebastián: 100 km por la AP-8, 1h 10min. Autobús Pesa frecuente (1h 15min) o carpooling desde 5€/asiento en ConcertRide." },
      { q: "¿Se puede aparcar en el Kursaal para el festival?", a: "El aparcamiento en la zona del Kursaal es limitado. Se recomienda carpooling o autobús. El Kursaal está a 10 minutos a pie de la estación de autobuses de Donostia." },
    ],
    relatedFestivals: ["festival-de-musica-de-irun", "bilbao-bbk-live", "jazzaldia"],
    genres: ["pop", "indie", "alternativo"],
    expected_attendance: "36.000 personas",
    transport_options: [
      { type: "carpooling", provider: "ConcertRide", origin: "Bilbao", price_from: 5, price_to: 8, notes: "0% comisión, pago Bizum directo" },
      { type: "bus", provider: "Pesa", origin: "Bilbao", price_from: 7, price_to: 9, notes: "Salidas frecuentes desde Termibus Bilbao" },
    ],
    official_shuttle: { available: false, notes: "Sin lanzadera oficial. Autobús Pesa Bilbao–Donostia recomendado." },
  },
  {
    slug: "festival-de-musica-de-pontevedra",
    name: "Festival de Música de Pontevedra",
    shortName: "Pontevedra Fest",
    city: "Pontevedra",
    citySlug: "pontevedra",
    region: "Galicia",
    venue: "Alameda / Parque de la Ferrería",
    venueAddress: "Alameda de Pontevedra, 36001 Pontevedra",
    lat: 42.4337,
    lng: -8.6476,
    startDate: "2026-07-17",
    endDate: "2026-07-19",
    typicalDates: "Tercera semana de julio",
    capacity: "8.000 personas/día",
    blurb: "Festival de Música de Pontevedra: pop y rock en la capital del Lérez, una de las ciudades peatonales más bonitas de España. El escenario principal ocupa el corazón histórico de la ciudad, rodeado de soportales medievales.",
    ogImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=630&fit=crop",
    originCities: [
      { city: "Vigo", km: 30, drivingTime: "30 min", concertRideRange: "3–5€" },
      { city: "A Coruña", km: 120, drivingTime: "1h 20min", concertRideRange: "5–8€" },
      { city: "Santiago de Compostela", km: 60, drivingTime: "50 min", concertRideRange: "4–6€" },
      { city: "Madrid", km: 600, drivingTime: "5h 30min", concertRideRange: "10–15€" },
    ],
    faqs: [
      { q: "¿Cómo ir al Festival de Pontevedra desde Vigo?", a: "Vigo–Pontevedra: 30 km por la AP-9, 30 minutos. Cercanías Renfe conecta Vigo con Pontevedra en 25 minutos. Carpooling desde 3€/asiento en ConcertRide." },
      { q: "¿Hay aparcamiento en el Festival de Pontevedra?", a: "El centro de Pontevedra es peatonal. Se recomienda aparcar en la periferia (P+R) o llegar en tren o carpooling." },
    ],
    relatedFestivals: ["festival-de-musica-de-vigo", "festival-de-musica-de-tui", "festival-de-musica-de-betanzos"],
    genres: ["pop", "rock"],
    expected_attendance: "24.000 personas",
    transport_options: [
      { type: "carpooling", provider: "ConcertRide", origin: "Vigo", price_from: 3, price_to: 5, notes: "0% comisión, pago Bizum directo" },
      { type: "train", provider: "Renfe Cercanías", origin: "Vigo", price_from: 2, price_to: 2, notes: "25 minutos, frecuencia horaria" },
    ],
    official_shuttle: { available: false, notes: "Sin lanzadera oficial. Cercanías Renfe Vigo–Pontevedra recomendado." },
  },
  {
    slug: "festival-de-musica-de-vigo",
    name: "Festival de Música de Vigo",
    shortName: "Vigo Fest",
    city: "Vigo",
    citySlug: "vigo",
    region: "Galicia",
    venue: "O Marisquiño / Praza do Rei",
    venueAddress: "Praza do Rei 1, 36202 Vigo, Pontevedra",
    lat: 42.2328,
    lng: -8.7226,
    startDate: "2026-07-24",
    endDate: "2026-07-26",
    typicalDates: "Última semana de julio",
    capacity: "15.000 personas/día",
    blurb: "Festival de Música de Vigo: pop, rock e indie en la capital olívica, la ciudad más grande de Galicia, junto a la ría. El escenario principal en el centro de la ciudad permite ver el festival con el Atlántico al fondo.",
    ogImage: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&h=630&fit=crop",
    originCities: [
      { city: "Pontevedra", km: 30, drivingTime: "30 min", concertRideRange: "3–5€" },
      { city: "A Coruña", km: 155, drivingTime: "1h 40min", concertRideRange: "6–10€" },
      { city: "Santiago de Compostela", km: 80, drivingTime: "55 min", concertRideRange: "4–8€" },
      { city: "Madrid", km: 620, drivingTime: "5h 30min", concertRideRange: "10–15€" },
    ],
    faqs: [
      { q: "¿Cómo ir al Festival de Vigo desde A Coruña?", a: "A Coruña–Vigo: 155 km por la AP-9, 1h 40min. Tren Renfe (Alvia/Intercity) en 1h 15min o carpooling desde 6€/asiento en ConcertRide." },
      { q: "¿Tiene el Festival de Vigo aparcamiento?", a: "El centro de Vigo tiene aparcamientos subterráneos. Se recomienda el carpooling o el tren para evitar atascos en la salida del festival." },
    ],
    relatedFestivals: ["festival-de-musica-de-pontevedra", "festival-de-musica-de-ferrol", "resurreccion-fest"],
    genres: ["pop", "rock", "indie"],
    expected_attendance: "45.000 personas",
    transport_options: [
      { type: "carpooling", provider: "ConcertRide", origin: "A Coruña", price_from: 6, price_to: 10, notes: "0% comisión, pago Bizum directo" },
      { type: "train", provider: "Renfe", origin: "A Coruña", price_from: 18, price_to: 25, notes: "Alvia/Intercity, 1h 15min" },
    ],
    official_shuttle: { available: false, notes: "Sin lanzadera oficial. Carpooling ConcertRide o tren Renfe recomendados." },
  },
  {
    slug: "festival-de-musica-de-ferrol",
    name: "Festival de Música de Ferrol",
    shortName: "Ferrol Fest",
    city: "Ferrol",
    citySlug: "ferrol",
    region: "Galicia",
    venue: "Praza de Armas / Puerto de Ferrol",
    venueAddress: "Praza de Armas, 15401 Ferrol, A Coruña",
    lat: 43.4849,
    lng: -8.2334,
    startDate: "2026-07-10",
    endDate: "2026-07-12",
    typicalDates: "Segunda semana de julio",
    capacity: "7.000 personas/día",
    blurb: "Festival de Música de Ferrol: rock e indie en la ciudad departamental de Galicia, cuna del almirante y marinera. El escenario principal frente a la Praza de Armas, con el arsenal y la ría al fondo.",
    ogImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&h=630&fit=crop",
    originCities: [
      { city: "A Coruña", km: 40, drivingTime: "40 min", concertRideRange: "3–6€" },
      { city: "Santiago de Compostela", km: 95, drivingTime: "1h 10min", concertRideRange: "5–8€" },
      { city: "Vigo", km: 190, drivingTime: "2h", concertRideRange: "7–11€" },
      { city: "Madrid", km: 630, drivingTime: "5h 40min", concertRideRange: "10–15€" },
    ],
    faqs: [
      { q: "¿Cómo ir al Festival de Ferrol desde A Coruña?", a: "A Coruña–Ferrol: 40 km por la AP-9, 40 minutos. Cercanías Renfe (C-1) en 60 minutos o carpooling desde 3€/asiento en ConcertRide." },
    ],
    relatedFestivals: ["festival-de-musica-de-vigo", "resurreccion-fest", "festival-de-musica-de-betanzos"],
    genres: ["rock", "indie"],
    expected_attendance: "21.000 personas",
    transport_options: [
      { type: "carpooling", provider: "ConcertRide", origin: "A Coruña", price_from: 3, price_to: 6, notes: "0% comisión, pago Bizum directo" },
      { type: "train", provider: "Renfe Cercanías", origin: "A Coruña", price_from: 2, price_to: 2, notes: "Línea C-1, 60 minutos" },
    ],
    official_shuttle: { available: false, notes: "Sin lanzadera oficial. Cercanías Renfe A Coruña–Ferrol recomendado." },
  },
  {
    slug: "festival-de-musica-de-monforte",
    name: "Festival de Música de Monforte de Lemos",
    shortName: "Monforte Fest",
    city: "Monforte de Lemos",
    citySlug: "monforte-de-lemos",
    region: "Galicia",
    venue: "Parador de Monforte / Plaza Mayor",
    venueAddress: "Rúa do Convento 3, 27400 Monforte de Lemos, Lugo",
    lat: 42.5199,
    lng: -7.5143,
    startDate: "2026-07-17",
    endDate: "2026-07-18",
    typicalDates: "Tercera semana de julio",
    capacity: "5.000 personas/día",
    blurb: "Festival de Música de Monforte de Lemos: folk, pop y rock en la puerta de la Ribeira Sacra, con el impresionante parador histórico y el colegio de la Compañía como telón de fondo. El festival más íntimo de la Galicia interior.",
    ogImage: "https://images.unsplash.com/photo-1468359601543-843bfaef291a?w=1200&h=630&fit=crop",
    originCities: [
      { city: "Lugo", km: 70, drivingTime: "50 min", concertRideRange: "4–7€" },
      { city: "Ourense", km: 55, drivingTime: "45 min", concertRideRange: "4–6€" },
      { city: "Vigo", km: 150, drivingTime: "1h 30min", concertRideRange: "6–9€" },
      { city: "Madrid", km: 560, drivingTime: "5h", concertRideRange: "10–14€" },
    ],
    faqs: [
      { q: "¿Cómo ir al Festival de Monforte de Lemos desde Lugo?", a: "Lugo–Monforte de Lemos: 70 km por la A-7, 50 minutos. No hay tren directo frecuente; el carpooling desde 4€/asiento en ConcertRide es la mejor opción." },
    ],
    relatedFestivals: ["festival-de-musica-de-lalin", "resurreccion-fest", "festival-de-musica-de-pontevedra"],
    genres: ["folk", "pop", "rock"],
    expected_attendance: "10.000 personas",
    transport_options: [
      { type: "carpooling", provider: "ConcertRide", origin: "Lugo", price_from: 4, price_to: 7, notes: "0% comisión, pago Bizum directo" },
      { type: "carpooling", provider: "ConcertRide", origin: "Ourense", price_from: 4, price_to: 6, notes: "0% comisión, pago Bizum directo" },
    ],
    official_shuttle: { available: false, notes: "Sin lanzadera oficial. El carpooling es la opción más práctica." },
  },
  {
    slug: "festival-de-musica-de-lalin",
    name: "Festival de Música de Lalín",
    shortName: "Lalín Fest",
    city: "Lalín",
    citySlug: "lalin",
    region: "Galicia",
    venue: "Recinto Ferial de Lalín",
    venueAddress: "Av. de Galicia s/n, 36500 Lalín, Pontevedra",
    lat: 42.6617,
    lng: -8.1133,
    startDate: "2026-07-24",
    endDate: "2026-07-25",
    typicalDates: "Última semana de julio",
    capacity: "5.000 personas/día",
    blurb: "Festival de Música de Lalín: pop y folk en la capital del Deza, en el corazón geográfico de Galicia. El festival más auténtico de la Galicia interior, con una atmósfera familiar y precios asequibles.",
    ogImage: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&h=630&fit=crop",
    originCities: [
      { city: "Santiago de Compostela", km: 50, drivingTime: "45 min", concertRideRange: "3–6€" },
      { city: "Vigo", km: 75, drivingTime: "55 min", concertRideRange: "4–7€" },
      { city: "Pontevedra", km: 65, drivingTime: "50 min", concertRideRange: "4–6€" },
      { city: "Madrid", km: 550, drivingTime: "5h", concertRideRange: "10–14€" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Festival de Lalín desde Santiago de Compostela?", a: "Santiago–Lalín: 50 km por la A-54, 45 minutos. No hay tren directo; el carpooling desde 3€/asiento en ConcertRide es la opción más práctica." },
    ],
    relatedFestivals: ["festival-de-musica-de-pontevedra", "festival-de-musica-de-monforte", "resurreccion-fest"],
    genres: ["pop", "folk"],
    expected_attendance: "10.000 personas",
    transport_options: [
      { type: "carpooling", provider: "ConcertRide", origin: "Santiago de Compostela", price_from: 3, price_to: 6, notes: "0% comisión, pago Bizum directo" },
    ],
    official_shuttle: { available: false, notes: "Sin lanzadera oficial. El carpooling es la opción más práctica." },
  },
  {
    slug: "festival-de-musica-de-tui",
    name: "Festival de Música de Tui",
    shortName: "Tui Fest",
    city: "Tui",
    citySlug: "tui",
    region: "Galicia",
    venue: "Jardines del Castillo / Plaza del Concejo",
    venueAddress: "Praza do Concello 1, 36700 Tui, Pontevedra",
    lat: 42.0457,
    lng: -8.6460,
    startDate: "2026-07-31",
    endDate: "2026-08-01",
    typicalDates: "Finales de julio",
    capacity: "6.000 personas/día",
    blurb: "Festival de Música de Tui: pop e indie en la ciudad fronteriza del Miño, encaramada sobre la roca frente a Valença do Minho (Portugal). El festival más internacional de la raia, con asistentes portugueses y españoles.",
    ogImage: "https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=1200&h=630&fit=crop",
    originCities: [
      { city: "Vigo", km: 30, drivingTime: "30 min", concertRideRange: "3–5€" },
      { city: "Pontevedra", km: 55, drivingTime: "45 min", concertRideRange: "4–6€" },
      { city: "Porto (Portugal)", km: 120, drivingTime: "1h 20min", concertRideRange: "6–10€" },
      { city: "Madrid", km: 640, drivingTime: "5h 40min", concertRideRange: "11–15€" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Festival de Tui desde Vigo?", a: "Vigo–Tui: 30 km por la AP-9, 30 minutos. Carpooling desde 3€/asiento en ConcertRide. Tui está junto al Puente Internacional sobre el río Miño, accesible desde Portugal a pie." },
      { q: "¿Pueden ir al Festival de Tui personas de Portugal?", a: "Sí. Tui está frente a Valença do Minho (Portugal). Desde Valença se accede a pie por el Puente Internacional. Desde Porto son 120 km por la A-3, 1h 20min." },
    ],
    relatedFestivals: ["festival-de-musica-de-vigo", "festival-de-musica-de-pontevedra", "resurreccion-fest"],
    genres: ["pop", "indie"],
    expected_attendance: "12.000 personas",
    transport_options: [
      { type: "carpooling", provider: "ConcertRide", origin: "Vigo", price_from: 3, price_to: 5, notes: "0% comisión, pago Bizum directo" },
    ],
    official_shuttle: { available: false, notes: "Sin lanzadera oficial. Carpooling ConcertRide o autobús Vigo–Tui recomendados." },
  },
  {
    slug: "festival-de-musica-de-betanzos",
    name: "Festival de Música de Betanzos",
    shortName: "Betanzos Fest",
    city: "Betanzos",
    citySlug: "betanzos",
    region: "Galicia",
    venue: "Paseo do Parque / Campo da Feira",
    venueAddress: "Paseo do Parque s/n, 15300 Betanzos, A Coruña",
    lat: 43.2809,
    lng: -8.2134,
    startDate: "2026-07-10",
    endDate: "2026-07-11",
    typicalDates: "Segunda semana de julio",
    capacity: "5.000 personas/día",
    blurb: "Festival de Música de Betanzos: folk y rock en la villa medieval de As Mariñas, con sus iglesias góticas y el paseo fluvial del Mandeo. El festival más pintoresco del entorno de A Coruña.",
    ogImage: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200&h=630&fit=crop",
    originCities: [
      { city: "A Coruña", km: 25, drivingTime: "25 min", concertRideRange: "3–5€" },
      { city: "Ferrol", km: 35, drivingTime: "35 min", concertRideRange: "3–5€" },
      { city: "Santiago de Compostela", km: 65, drivingTime: "50 min", concertRideRange: "4–6€" },
      { city: "Madrid", km: 630, drivingTime: "5h 40min", concertRideRange: "10–15€" },
    ],
    faqs: [
      { q: "¿Cómo ir al Festival de Betanzos desde A Coruña?", a: "A Coruña–Betanzos: 25 km por la AP-9, 25 minutos. Tren Renfe (Cercanías C-1) en 30 minutos. Carpooling desde 3€/asiento en ConcertRide." },
    ],
    relatedFestivals: ["festival-de-musica-de-ferrol", "festival-de-musica-de-vigo", "resurreccion-fest"],
    genres: ["folk", "rock"],
    expected_attendance: "10.000 personas",
    transport_options: [
      { type: "carpooling", provider: "ConcertRide", origin: "A Coruña", price_from: 3, price_to: 5, notes: "0% comisión, pago Bizum directo" },
      { type: "train", provider: "Renfe Cercanías", origin: "A Coruña", price_from: 2, price_to: 2, notes: "Línea C-1, 30 minutos" },
    ],
    official_shuttle: { available: false, notes: "Sin lanzadera oficial. Cercanías Renfe A Coruña–Betanzos recomendado." },
  },

];

export const FESTIVAL_LANDINGS_BY_SLUG = Object.fromEntries(
  FESTIVAL_LANDINGS.map((f) => [f.slug, f]),
);

/** Last time festival data (dates, prices, venues) was updated — use for stable dateModified in schemas and sitemap. */
export const FESTIVAL_LANDINGS_LAST_UPDATED = "2026-05-16"; // Wave 39: +10 (Barakaldo, Irún, Donostia-Hiria, Pontevedra, Vigo, Ferrol, Monforte, Lalín, Tui, Betanzos)

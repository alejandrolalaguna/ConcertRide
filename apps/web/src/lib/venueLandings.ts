// Venue-specific landing pages at /recintos/:slug.
// Each entry targets "cómo llegar a [Recinto]" queries with transport logistics,
// origin-city carpooling data, venue FAQs, and schema.org Place metadata.

export interface VenueLanding {
  slug: string;
  name: string;              // official venue name
  shortName: string;         // for inline refs
  city: string;
  citySlug: string;          // matches /conciertos/:citySlug
  region: string;
  address: string;
  lat: number;
  lng: number;
  capacity: string;          // e.g. "17.000 personas"
  venueType: string;         // "Arena", "Estadio", "Recinto ferial", "Parque", "Teatro"
  transport: {
    metro?: string;          // e.g. "L7 Cartagena (500m)"
    bus?: string;            // e.g. "Líneas 43, 119"
    tren?: string;
    parking?: string;        // e.g. "Parking propio: 12€/día"
  };
  blurb: string;             // 2-3 factual sentences about transport challenges + ConcertRide context
  ogImage?: string;          // falls back to /og-fallback.png
  originCities: Array<{
    city: string;
    km: number;
    drivingTime: string;
    concertRideRange: string;
  }>;
  faqs: Array<{ q: string; a: string }>;
  relatedFestivals: string[]; // festival slugs
  quotableAnswer?: string; // 130–150 word AI-Overview-citable answer paragraph
}

export const VENUE_LANDINGS: VenueLanding[] = [
  // ── MADRID ──────────────────────────────────────────────────────────────────

  {
    slug: "wizink-center",
    name: "WiZink Center",
    quotableAnswer:
      "WiZink Center es un recinto con capacidad para 17.000 personas en Madrid, dedicado a conciertos en formato arena y giras de gran formato. Está conectado con el centro de Madrid mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L2 Ventas. Las opciones para llegar son: (1) Metro L2 Ventas (200 m) (1,50–2,50 €); (2) Autobús urbano Líneas 21, 146 (1,50–2 €); (3) Vehículo propio: Sin parking propio — zonas ORA y aparcamientos cercanos (6–10 €/día). El carpooling desde Zaragoza, Valencia, Bilbao cuesta 9–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "WiZink Center",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    address: "Av. Felipe II, s/n, 28007 Madrid",
    lat: 40.4361,
    lng: -3.6611,
    capacity: "17.000 personas",
    venueType: "Arena",
    transport: {
      metro: "L2 Ventas (200 m) · L7 Cartagena (500 m)",
      bus: "Líneas 21, 146",
      parking: "Sin parking propio — zonas ORA y aparcamientos cercanos (6–10 €/día)",
    },
    blurb:
      "El WiZink Center es el principal pabellón de conciertos de Madrid con capacidad para 17.000 personas. Está bien comunicado por metro (L2 Ventas, L7 Cartagena) pero las salidas en conciertos nocturnos colapsan entre la 1:00 y las 2:00, con colas de 30–45 minutos en acceso al andén. Asistentes de Valencia, Zaragoza o Barcelona optan habitualmente por carpooling con ConcertRide (desde 10 €/asiento) para evitar los trenes de alta velocidad y costes de alojamiento.",
    originCities: [
      { city: "Valencia", km: 358, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Barcelona", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Sevilla", km: 530, drivingTime: "5h", concertRideRange: "13–18 €/asiento" },
      { city: "Bilbao", km: 395, drivingTime: "4h", concertRideRange: "10–15 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al WiZink Center en transporte público?",
        a: "La opción más rápida es el metro: línea 2 (verde) hasta la estación Ventas, a 200 metros de la puerta principal. También puedes usar la línea 7 (naranja) bajando en Cartagena (500 m a pie). Los autobuses 21 y 146 tienen parada directa en la Avenida Felipe II. El trayecto desde Sol dura unos 10 minutos en metro.",
      },
      {
        q: "¿Cómo volver del WiZink Center de madrugada?",
        a: "El metro cierra a la 1:30 (ampliado hasta las 2:00 los fines de semana). Para conciertos que terminan entre la 1:00 y las 2:30, las opciones son: esperar el bus nocturno N1 (pasa por Ventas hacia Sol), tomar un taxi o VTC (15–25 € al centro de Madrid), o haber coordinado previamente la vuelta con tu conductor de ConcertRide, que se adapta al horario real del concierto.",
      },
      {
        q: "¿Hay parking cerca del WiZink Center?",
        a: "El WiZink Center no dispone de parking propio. Los aparcamientos más cercanos son el Parking Las Ventas (c/ Alcalá, 237) y el Parking Forum (Av. Felipe II, 8), con tarifas de 6–10 €. En días de concierto se llenan rápido, especialmente los sábados. Si vienes de otra ciudad con ConcertRide, evitas el problema del parking por completo.",
      },
      {
        q: "¿Cuánto cuesta ir al WiZink Center desde Valencia en carpooling?",
        a: "La distancia Valencia–Madrid por la A-3 es de unos 358 km (3h 20 min). Con ConcertRide el precio medio por asiento oscila entre 10 y 14 €, frente a los 30–60 € de un billete de AVE o los 90–130 € de un trayecto completo en taxi. El conductor fija el precio por asiento para cubrir combustible y peajes según la tarifa MITECO de referencia.",
      },
      {
        q: "¿Es seguro el WiZink Center para ir en transporte público de madrugada?",
        a: "La zona de Las Ventas (barrio de Ventas–Ciudad Lineal) es un área transitada y segura. La salida del recinto tiene servicio de seguridad privada y policia municipal en conciertos masivos. La estación de metro Ventas está bien iluminada. Para quienes vengan de fuera de Madrid, la opción más recomendada es el carpooling con ConcertRide, ya que el conductor espera hasta que el concierto termine antes de iniciar el regreso.",
      },
    ],
    relatedFestivals: ["mad-cool", "tomavistas"],
  },

  {
    slug: "palacio-vistalegre",
    name: "Palacio Vistalegre",
    quotableAnswer:
      "Palacio Vistalegre es un recinto con capacidad para 10.000 personas en Madrid, dedicado a conciertos en formato arena y giras de gran formato. Está conectado con el centro de Madrid mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L5 Carabanchel. Las opciones para llegar son: (1) Metro L5 Carabanchel (600 m) (1,50–2,50 €); (2) Autobús urbano Líneas 35, 56, 116 (1,50–2 €); (3) Vehículo propio: Parking Vistalegre: 8 €/día. El carpooling desde Toledo, Zaragoza, Valencia cuesta 4–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Vistalegre",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    address: "Utebo, 1, 28025 Madrid",
    lat: 40.3979,
    lng: -3.7276,
    capacity: "10.000 personas",
    venueType: "Arena",
    transport: {
      metro: "L5 Carabanchel (600 m)",
      bus: "Líneas 35, 56, 116",
      parking: "Parking Vistalegre: 8 €/día",
    },
    blurb:
      "El Palacio de los Deportes de Vistalegre es el segundo mayor pabellón de conciertos de Madrid con aforo de 10.000 personas, situado en el barrio de Carabanchel. El metro L5 (parada Carabanchel) da acceso en 15 minutos desde Gran Vía, aunque en noches de concierto la saturación del andén es notable. Para asistentes de provincias, el carpooling con ConcertRide es la alternativa habitual al AVE, ya que el recinto está a 30 minutos en coche desde los accesos sur de la A-4 y A-42.",
    originCities: [
      { city: "Toledo", km: 70, drivingTime: "50 min", concertRideRange: "4–7 €/asiento" },
      { city: "Valencia", km: 360, drivingTime: "3h 25 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 330, drivingTime: "3h 05 min", concertRideRange: "9–13 €/asiento" },
      { city: "Sevilla", km: 530, drivingTime: "5h", concertRideRange: "13–18 €/asiento" },
      { city: "Barcelona", km: 620, drivingTime: "5h 35 min", concertRideRange: "15–20 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Palacio de Vistalegre en metro?",
        a: "La parada más cercana es Carabanchel (línea 5, circular) a unos 600 metros del pabellón. Desde Gran Vía el trayecto dura aproximadamente 15 minutos. La parada Oporto (L5) también queda a 800 m si prefieres entrar por la calle Utebo desde otro ángulo.",
      },
      {
        q: "¿Hay autobús nocturno de vuelta desde Vistalegre?",
        a: "Los autobuses nocturnos más cercanos son el N16 (Carabanchel–Sol) y el N15, con frecuencia de 30 minutos. El último metro L5 sale alrededor de la 1:30 (fines de semana hasta las 2:00). Para conciertos que terminan después de las 2:00, la opción más práctica es un VTC (12–20 € al centro) o el carpooling con ConcertRide coordinado de antemano.",
      },
      {
        q: "¿Tiene parking el Palacio Vistalegre?",
        a: "Hay un parking en el propio complejo con tarifas de aproximadamente 8 €/día, aunque suele llenarse rápidamente en eventos masivos. Existen zonas ORA en los alrededores de Carabanchel con aparcamiento libre a partir de las 21:00 los laborables y todo el día en festivos y fines de semana.",
      },
      {
        q: "¿Cuánto tarda el viaje desde Zaragoza a Vistalegre en carpooling?",
        a: "Zaragoza está a unos 330 km de Madrid por la A-2/R-3 (aproximadamente 3h 05 min sin tráfico). Con ConcertRide el precio por asiento suele estar entre 9 y 13 €. El conductor habitualmente sale 4 horas antes del concierto y la vuelta se coordina según el horario de fin de espectáculo.",
      },
      {
        q: "¿Dónde está exactamente el Palacio Vistalegre? ¿Es el mismo que el WiZink Center?",
        a: "No, son recintos distintos. El WiZink Center (antiguo Palacio de los Deportes) está en Ventas (barrio de Salamanca) con capacidad para 17.000 personas. El Palacio Vistalegre está en Carabanchel, con aforo de 10.000. Dirección exacta: Utebo, 1, 28025 Madrid. Coordenadas GPS: 40.3979 N, -3.7276 W.",
      },
    ],
    relatedFestivals: ["mad-cool"],
  },

  {
    slug: "ifema-madrid",
    name: "IFEMA Madrid · Recintos de festival",
    quotableAnswer:
      "IFEMA Madrid · Recintos de festival es un recinto con capacidad para 80.000 personas/día (grandes festivales) en Madrid, dedicado a festivales al aire libre y macroconciertos. Está conectado con el centro de Madrid mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L8 Feria de Madrid. Las opciones para llegar son: (1) Metro L8 Feria de Madrid (acceso directo) (1,50–2,50 €); (2) Autobús urbano N1, N6 (nocturnos — no acceden a IFEMA directamente) (1,50–2 €); (3) Vehículo propio: Parking IFEMA: 12–18 €/día; colapsa desde las 18:00. El carpooling desde Madrid, Toledo, Zaragoza cuesta 4–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "IFEMA Madrid",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    address: "Av. del Partenón, 5, 28042 Madrid",
    lat: 40.464,
    lng: -3.61,
    capacity: "80.000 personas/día (grandes festivales)",
    venueType: "Recinto ferial",
    transport: {
      metro: "L8 Feria de Madrid (acceso directo)",
      bus: "N1, N6 (nocturnos — no acceden a IFEMA directamente)",
      parking: "Parking IFEMA: 12–18 €/día; colapsa desde las 18:00",
    },
    blurb:
      "IFEMA Madrid es el recinto ferial más grande de España, usado para macro-festivales como Mad Cool con 80.000 asistentes diarios. El metro L8 (estación Feria de Madrid) da acceso directo, pero cierra a la 1:30 y en noches de festival las colas alcanzan el exterior del pabellón. Los autobuses nocturnos N1 y N6 no paran en IFEMA directamente. Para asistentes de otras provincias, el carpooling con ConcertRide es la opción más usada: no depende del horario de metro y el conductor ajusta la vuelta al fin real del evento.",
    originCities: [
      { city: "Madrid", km: 15, drivingTime: "25 min", concertRideRange: "4–7 €/asiento" },
      { city: "Toledo", km: 75, drivingTime: "55 min", concertRideRange: "4–7 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Barcelona", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a IFEMA en metro para un festival?",
        a: "La línea 8 (rosa) para en la estación 'Feria de Madrid', con acceso directo al recinto. Desde la estación de Nuevos Ministerios el trayecto dura unos 12 minutos. El metro opera hasta la 1:30 (fines de semana hasta las 2:00), con refuerzo de frecuencia en noches de grandes festivales.",
      },
      {
        q: "¿Hay transporte nocturno de IFEMA pasada la 1:30?",
        a: "Una vez cerrado el metro, las opciones son: taxi o VTC desde la terminal T4 de Barajas (cercana a IFEMA, 20–35 € al centro de Madrid), bus nocturno N1 hasta Avenida de América (pero no llega a IFEMA directamente), o carpooling con ConcertRide coordinado de antemano. Los VTC en noches de Mad Cool pueden alcanzar precios de 60–90 € por la alta demanda.",
      },
      {
        q: "¿Puedo aparcar en IFEMA en un festival?",
        a: "IFEMA dispone de varios parkings (P1–P8) con acceso por la R-2/M-14. El precio es de 12–18 €/día según zona. En días de festival los accesos colapsan desde las 18:00 y no es raro tardar 1–2 horas para entrar y para salir. Una alternativa habitual es aparcar en las inmediaciones de Barajas (P0 o P1 aeropuerto con lanzadera) o en la zona de Canillejas y tomar el metro L8.",
      },
      {
        q: "¿Qué festivales se celebran en IFEMA Madrid?",
        a: "IFEMA acoge principalmente Mad Cool Festival (primera quincena de julio, ~80.000 asistentes/día), además de eventos puntuales de electrónica y giras de artistas internacionales. El recinto dispone de pabellones cubiertos (8.000–20.000 personas) y espacios al aire libre de mayor aforo.",
      },
      {
        q: "¿Cuánto cuesta ir a IFEMA desde Barcelona en carpooling?",
        a: "Barcelona–Madrid son 620 km por la AP-2/A-2 (5h 30 min). Con ConcertRide el precio por asiento oscila entre 15 y 20 €, frente a los 50–100 € de un billete de AVE (ida) o los 120–180 € de un coche de alquiler. Busca viajes para la fecha de tu festival en concertride.me/concerts.",
      },
    ],
    relatedFestivals: ["mad-cool"],
  },

  {
    slug: "caja-magica",
    name: "Caja Mágica",
    quotableAnswer:
      "Caja Mágica es un recinto con capacidad para 20.000 personas en Madrid, dedicado a conciertos y eventos multidisciplinares. Está conectado con el centro de Madrid mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L3 San Fermín-Orcasur. Las opciones para llegar son: (1) Metro L3 San Fermín-Orcasur (1,2 km) (1,50–2,50 €); (2) Autobús urbano Circular C1 (entrada principal) (1,50–2 €); (3) Vehículo propio: Parking exterior gratuito en días no laborables; parking de pago en eventos: 8 €. El carpooling desde Getafe, Toledo, Zaragoza cuesta 3–18 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Caja Mágica",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    address: "Camino de Perales, s/n, 28041 Madrid",
    lat: 40.3774,
    lng: -3.6997,
    capacity: "20.000 personas",
    venueType: "Complejo deportivo",
    transport: {
      metro: "L3 San Fermín-Orcasur (1,2 km)",
      bus: "Circular C1 (entrada principal)",
      parking: "Parking exterior gratuito en días no laborables; parking de pago en eventos: 8 €",
    },
    blurb:
      "La Caja Mágica es un complejo polideportivo al sur de Madrid con capacidad para hasta 20.000 personas en configuración de concierto, situado junto al río Manzanares. La parada de metro más cercana es San Fermín-Orcasur (L3), a 1,2 km, o la lanzadera C1 que conecta con la estación de metro Legazpi. En noches de evento el último metro cierra a la 1:30 y los buses nocturnos requieren transbordo. Los asistentes del sur de Madrid y de Toledo habitualmente llegan en coche compartido con ConcertRide por la A-42.",
    originCities: [
      { city: "Toledo", km: 68, drivingTime: "45 min", concertRideRange: "4–6 €/asiento" },
      { city: "Getafe", km: 12, drivingTime: "18 min", concertRideRange: "3–5 €/asiento" },
      { city: "Valencia", km: 360, drivingTime: "3h 25 min", concertRideRange: "10–14 €/asiento" },
      { city: "Sevilla", km: 525, drivingTime: "4h 55 min", concertRideRange: "13–18 €/asiento" },
      { city: "Zaragoza", km: 330, drivingTime: "3h 05 min", concertRideRange: "9–13 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a la Caja Mágica en transporte público?",
        a: "Toma la línea 3 del metro hasta San Fermín-Orcasur (final de línea) y camina 1,2 km, o sube a la lanzadera C1 desde la parada de Legazpi (L3/L6) que deja a los asistentes en la entrada principal. El trayecto desde Sol dura unos 20–25 minutos en total.",
      },
      {
        q: "¿Hay aparcamiento gratuito en la Caja Mágica?",
        a: "La Caja Mágica dispone de aparcamiento exterior que es gratuito en días no laborables fuera de eventos deportivos. En conciertos y grandes eventos se habilitan zonas de parking de pago (8 €). El acceso es por el Camino de Perales y la rotonda sur junto al Manzanares.",
      },
      {
        q: "¿Cómo volver de la Caja Mágica de madrugada?",
        a: "El metro L3 cierra a la 1:30 (fines de semana a las 2:00). Los buses nocturnos N12 y N26 cubren el pasillo de Legazpi–Orcasur pero con baja frecuencia. Para conciertos que terminan tarde, la opción más práctica es el carpooling con ConcertRide (si vienes de fuera de Madrid) o un VTC (10–18 € al centro).",
      },
      {
        q: "¿Dónde está la Caja Mágica exactamente?",
        a: "La Caja Mágica está en el distrito de Usera-Villaverde, junto al río Manzanares, en la dirección Camino de Perales s/n, 28041 Madrid. Coordenadas GPS: 40.3774 N, 3.6997 W. Desde el centro de Madrid se llega en unos 20 minutos por la A-42 o M-30.",
      },
      {
        q: "¿Cuánto cuesta el carpooling desde Toledo a la Caja Mágica?",
        a: "Toledo está a 68 km por la A-42 (45 minutos). Con ConcertRide el precio habitual es de 4–6 € por asiento, lo que lo convierte en el modo de transporte más barato desde Toledo (el autobús Alsa cuesta 8–12 € y no tiene vuelta de madrugada). Es la ruta más frecuente hacia la Caja Mágica en ConcertRide.",
      },
    ],
    relatedFestivals: ["mad-cool", "tomavistas"],
  },

  // ── BARCELONA ────────────────────────────────────────────────────────────────

  {
    slug: "palau-sant-jordi",
    name: "Palau Sant Jordi",
    quotableAnswer:
      "Palau Sant Jordi es un recinto con capacidad para 17.000 personas en Barcelona, dedicado a conciertos en formato arena y giras de gran formato. Está conectado con el centro de Barcelona mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L1 Espanya. Las opciones para llegar son: (1) Metro L1 Espanya (15 min a pie subiendo Montjuïc) (1,50–2,50 €); (2) Autobús urbano Líneas 55, 150 (1,50–2 €); (3) Vehículo propio: Parking Anella Olímpica: 10 €/día; plazas limitadas. El carpooling desde Tarragona, Girona, Zaragoza cuesta 4–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Palau Sant Jordi",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    address: "Passeig Olímpic, 5-7, 08038 Barcelona",
    lat: 41.3687,
    lng: 2.1527,
    capacity: "17.000 personas",
    venueType: "Arena",
    transport: {
      metro: "L1 Espanya (15 min a pie subiendo Montjuïc) · Funicular Paral·lel + cresta",
      bus: "Líneas 55, 150 · nocturnos N0, N6",
      parking: "Parking Anella Olímpica: 10 €/día; plazas limitadas",
    },
    blurb:
      "El Palau Sant Jordi es el principal pabellón de conciertos de Barcelona, situado en la montaña de Montjuïc dentro del Anillo Olímpico. Con 17.000 personas de aforo, el acceso más cómodo en transporte público es el metro L1 hasta Espanya y subir caminando (15 min) o tomar el Funicular de Montjuïc desde Paral·lel (L2/L3). Las salidas nocturnas colapsan en la bajada de Montjuïc, con esperas de taxi de 40–60 minutos. Para asistentes de Madrid o Valencia, el carpooling con ConcertRide supone un ahorro de 30–60 € respecto al AVE.",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 350, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 296, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Tarragona", km: 98, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Girona", km: 99, drivingTime: "1h 05 min", concertRideRange: "4–7 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Palau Sant Jordi en transporte público?",
        a: "La opción más habitual es el metro L1 (roja) hasta Espanya y luego subir caminando por la Avinguda de la Reina Maria Cristina (15 min de subida). Alternativamente, toma L2 o L3 hasta Paral·lel y el Funicular de Montjuïc (incluido en el T-Casual). El bus 55 tiene parada en Anella Olímpica y funciona hasta medianoche.",
      },
      {
        q: "¿Cómo volver del Palau Sant Jordi de madrugada?",
        a: "El metro cierra a la 0:00 los laborables y a las 2:00 los viernes y sábados. El Funicular de Montjuïc también cierra a medianoche. Los buses nocturnos N0 y N6 bajan por Espanya y Parallel pero con frecuencia de 20–30 min. Los taxis y VTC en noches de concierto se saturan en la bajada de Montjuïc con esperas de 40–60 minutos. El carpooling con ConcertRide, si vienes de fuera de Barcelona, es la opción que evita toda esta espera.",
      },
      {
        q: "¿Hay parking cerca del Palau Sant Jordi?",
        a: "El Parking Anella Olímpica tiene plazas limitadas (aprox. 10 €/día). En eventos masivos se llena antes de que empiece el concierto. Hay aparcamientos en las inmediaciones de la Plaça d'Espanya (5–8 € en parkings cubiertos) con acceso a pie por Montjuïc.",
      },
      {
        q: "¿Cuánto cuesta el carpooling Madrid–Palau Sant Jordi?",
        a: "Madrid–Barcelona son 620 km por la AP-2 (5h 30 min). Con ConcertRide el precio por asiento es de 15–20 €, frente a los 50–100 € de un billete de AVE o los 120–200 € de un alquiler de coche. Es habitual que fans de Madrid organicen el viaje redondo y se queden en Barcelona el fin de semana del concierto.",
      },
      {
        q: "¿El Palau Sant Jordi es el mismo que el Palau Blaugrana?",
        a: "No. El Palau Sant Jordi (capacidad 17.000) está en la montaña de Montjuïc, en el Anillo Olímpico. El Palau Blaugrana (7.500) está junto al Camp Nou, en Les Corts. Son recintos diferentes con acceso y transporte distintos.",
      },
    ],
    relatedFestivals: ["primavera-sound", "cruilla"],
  },

  {
    slug: "parc-del-forum",
    name: "Parc del Fòrum",
    quotableAnswer:
      "Parc del Fòrum es un recinto con capacidad para 60.000 personas (festival) en Barcelona, dedicado a festivales al aire libre y macroconciertos. Está conectado con el centro de Barcelona mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L4 Besòs Mar. Las opciones para llegar son: (1) Metro L4 Besòs Mar (acceso directo al recinto) (1,50–2,50 €); (2) Autobús urbano Tramvia T4 (parada Fòrum) (1,50–2 €); (3) Vehículo propio: Parking Fòrum: 12 €/día; acceso por Rambla Prim. El carpooling desde Tarragona, Lleida, Zaragoza cuesta 4–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Parc del Fòrum",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    address: "Rambla del Prim, 2-4, 08019 Barcelona",
    lat: 41.4066,
    lng: 2.2218,
    capacity: "60.000 personas (festival)",
    venueType: "Recinto al aire libre",
    transport: {
      metro: "L4 Besòs Mar (acceso directo al recinto)",
      bus: "Tramvia T4 (parada Fòrum) · nocturno N6",
      parking: "Parking Fòrum: 12 €/día; acceso por Rambla Prim",
    },
    blurb:
      "El Parc del Fòrum es el recinto al aire libre más grande de Barcelona, con capacidad para 60.000 personas en configuración de festival. Está situado en el extremo del Paseo Marítimo, junto a la desembocadura del Besòs. El metro L4 (estación Besòs Mar) da acceso directo, pero en noches de festival los trenes se saturan pasada la medianoche. El tramvía T4 funciona hasta las 23:00. Para quienes vengan de Madrid, Valencia o Zaragoza, el carpooling con ConcertRide es la alternativa más económica al AVE.",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 350, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 296, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Tarragona", km: 98, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Lleida", km: 170, drivingTime: "1h 40 min", concertRideRange: "5–9 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Parc del Fòrum en metro?",
        a: "Toma la línea 4 (amarilla) hasta Besòs Mar (final de línea). La salida da directamente a la entrada del recinto. El trayecto desde Barceloneta dura 10 minutos y desde Diagonal unos 20 minutos. En noches de Primavera Sound y Cruïlla el metro amplía su servicio hasta las 3:00–4:00.",
      },
      {
        q: "¿Hay lanzadera oficial al Parc del Fòrum durante los festivales?",
        a: "Durante Primavera Sound y Cruïlla se habilitan servicios de bus reforzados desde distintos puntos de la ciudad. El tramvía T4 (parada Fòrum) opera hasta las 23:00 con frecuencia alta. Consulta el servicio especial de TMB para las fechas exactas del festival.",
      },
      {
        q: "¿Cómo volver del Parc del Fòrum a las 4:00?",
        a: "En noches de festival el metro L4 amplía servicio hasta las 3:00–4:00. Fuera de ese refuerzo, los buses nocturnos N6 (Barceloneta–Sant Adrià) pasan cerca del Fòrum. Los taxis y VTC se saturan en los últimos turnos del festival, con esperas de 30–50 minutos. Si viniste en carpooling con ConcertRide, el conductor acuerda la vuelta contigo según el horario real.",
      },
      {
        q: "¿Dónde está el Parc del Fòrum exactamente?",
        a: "El Parc del Fòrum está en el extremo norte del Paseo Marítimo de Barcelona, en la Rambla del Prim 2-4, barrio de Poblenou–Diagonal Mar. Coordenadas GPS: 41.4066 N, 2.2218 E. El parking de acceso está por la Rambla del Prim.",
      },
      {
        q: "¿Cuánto cuesta ir al Parc del Fòrum desde Zaragoza en carpooling?",
        a: "Zaragoza–Barcelona son 296 km por la AP-2 (2h 45 min). Con ConcertRide el precio por asiento es de 8–12 €, una de las rutas con más viajes disponibles en la plataforma en temporada de Primavera Sound y Sónar. Es mucho más económico que el AVE Zaragoza–Barcelona (20–45 €) y flexible en horario de vuelta.",
      },
    ],
    relatedFestivals: ["primavera-sound", "sonar"],
  },

  // ── SEVILLA ──────────────────────────────────────────────────────────────────

  {
    slug: "estadio-la-cartuja",
    name: "Estadio Olímpico de La Cartuja",
    quotableAnswer:
      "Estadio Olímpico de La Cartuja es un recinto con capacidad para 57.000 personas en Sevilla, dedicado a grandes conciertos, festivales y eventos deportivos. Está conectado con el centro de Sevilla por tren de cercanías (15–25 minutos), y la estación de transporte público más cercana es tren Sin conexión ferroviaria directa — estación Santa Justa a 6 km. Las opciones para llegar son: (1) Autobús urbano Líneas C1, C2 desde Prado de San Sebastián (1,50–2 €); (2) Renfe Sin conexión ferroviaria directa — estación Santa Justa a 6 km (2–5 €); (3) Vehículo propio: Parking propio: 8–12 €/día; aparcamiento disuasorio Charco de la Pava. El carpooling desde Huelva, Cádiz, Córdoba cuesta 4–18 €/asiento. Para volver de madrugada, la opción más utilizada es el carpooling con ConcertRide, que coordina la vuelta con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "La Cartuja",
    city: "Sevilla",
    citySlug: "sevilla",
    region: "Andalucía",
    address: "Av. de los Descubrimientos, s/n, 41092 Sevilla",
    lat: 37.3963,
    lng: -6.0028,
    capacity: "57.000 personas",
    venueType: "Estadio",
    transport: {
      bus: "Líneas C1, C2 desde Prado de San Sebastián · tranvía T1 hasta Prado de San Sebastián + bus",
      tren: "Sin conexión ferroviaria directa — estación Santa Justa a 6 km",
      parking: "Parking propio: 8–12 €/día; aparcamiento disuasorio Charco de la Pava",
    },
    blurb:
      "El Estadio Olímpico de La Cartuja es el mayor recinto de espectáculos de Sevilla con 57.000 asientos. Está en la Isla de la Cartuja, a 6 km del centro de Sevilla y sin metro. El acceso en transporte público requiere combinar el tranvía T1 hasta Prado de San Sebastián y los buses C1/C2, que no tienen vuelta después de la medianoche. La ausencia de transporte público nocturno convierte el carpooling con ConcertRide en la opción más usada por asistentes de Huelva, Cádiz, Córdoba y Málaga.",
    originCities: [
      { city: "Huelva", km: 95, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Cádiz", km: 125, drivingTime: "1h 25 min", concertRideRange: "5–8 €/asiento" },
      { city: "Córdoba", km: 143, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Málaga", km: 210, drivingTime: "2h 10 min", concertRideRange: "7–11 €/asiento" },
      { city: "Madrid", km: 530, drivingTime: "5h", concertRideRange: "13–18 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Estadio de La Cartuja en transporte público?",
        a: "Toma el tranvía T1 hasta Prado de San Sebastián y allí enlaza con los autobuses C1 o C2 de TUSSAM, que van a la Isla de la Cartuja. El trayecto completo desde el centro dura unos 30–40 minutos. No hay metro en Sevilla. En eventos masivos se habilitan buses reforzados desde puntos estratégicos de la ciudad.",
      },
      {
        q: "¿Hay transporte nocturno de vuelta desde La Cartuja?",
        a: "Los buses C1 y C2 dejan de operar pasada la medianoche. Las líneas de bus nocturno de Sevilla (B1, B2, B3) cubren el centro pero no llegan a La Cartuja directamente. Las opciones post-medianoche son taxi (10–18 € al centro) o carpooling con ConcertRide. Si vienes de otra provincia, es imprescindible coordinar la vuelta de antemano.",
      },
      {
        q: "¿Tiene parking el Estadio de La Cartuja?",
        a: "Sí, el estadio dispone de parking propio con acceso por la Avenida de los Descubrimientos (8–12 €/evento). También existe un aparcamiento disuasorio en Charco de la Pava, junto al Guadalquivir, con lanzadera a pie al estadio. En conciertos masivos se recomienda llegar con 1,5–2 horas de antelación para evitar atascos en los accesos.",
      },
      {
        q: "¿Cuánto cuesta ir a La Cartuja desde Málaga en carpooling?",
        a: "Málaga–Sevilla son 210 km por la A-92 (2h 10 min). Con ConcertRide el precio habitual por asiento es de 7–11 €, frente a los 15–30 € del AVE Málaga–Sevilla (con trasbordos) o los 40–60 € de otras plataformas de carpooling con comisión incluida. El carpooling es la opción más usada para esta ruta en noches de concierto.",
      },
      {
        q: "¿El Estadio de La Cartuja tiene conexión de metro?",
        a: "No, Sevilla no tiene metro. El acceso en transporte público requiere el tranvía T1 hasta Prado de San Sebastián (en servicio hasta las 23:00 aprox.) y luego buses C1/C2. Para conciertos que terminan pasada la medianoche, el carpooling con ConcertRide o un taxi son las únicas opciones de vuelta.",
      },
    ],
    relatedFestivals: [],
  },

  // ── BILBAO ───────────────────────────────────────────────────────────────────

  {
    slug: "kobetamendi",
    name: "Kobetamendi",
    quotableAnswer:
      "Kobetamendi es un recinto con capacidad para 30.000 personas/día en Bilbao, dedicado a festivales al aire libre y macroconciertos. Está conectado con el centro de Bilbao mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L1/L2 San Ignacio o Basurto. Las opciones para llegar son: (1) Metro L1/L2 San Ignacio o Basurto (1,5–2 km del recinto) + lanzadera BBK Live (1,50–2,50 €); (2) Autobús urbano Lanzadera oficial gratuita desde Plaza Moyúa durante BBK Live (1,50–2 €); (3) Taxi/VTC al centro: 8–20 €. El carpooling desde Vitoria-Gasteiz, Santander, San Sebastián cuesta 3–16 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Kobetamendi",
    city: "Bilbao",
    citySlug: "bilbao",
    region: "País Vasco",
    address: "Monte Kobetamendi, 48015 Bilbao",
    lat: 43.2658,
    lng: -2.9354,
    capacity: "30.000 personas/día",
    venueType: "Recinto al aire libre",
    transport: {
      metro: "L1/L2 San Ignacio o Basurto (1,5–2 km del recinto) + lanzadera BBK Live",
      bus: "Lanzadera oficial gratuita desde Plaza Moyúa durante BBK Live · bus nocturno muy limitado",
    },
    blurb:
      "Kobetamendi es el monte que acoge el BBK Live Festival sobre Bilbao, con vistas panorámicas a la ría. Con 30.000 asistentes por jornada, el acceso al recinto solo es práctico en la lanzadera oficial gratuita que parte desde Plaza Moyúa (centro de Bilbao) durante el festival. No hay acceso directo en metro ni bus regular al monte. Para asistentes de Madrid, San Sebastián o Santander, el carpooling con ConcertRide es la forma más frecuente de llegar a Bilbao antes de tomar la lanzadera.",
    originCities: [
      { city: "Madrid", km: 395, drivingTime: "4h", concertRideRange: "11–16 €/asiento" },
      { city: "San Sebastián", km: 100, drivingTime: "1h 10 min", concertRideRange: "5–8 €/asiento" },
      { city: "Santander", km: 100, drivingTime: "1h 05 min", concertRideRange: "4–7 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 65, drivingTime: "50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Pamplona", km: 160, drivingTime: "1h 40 min", concertRideRange: "5–9 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Hay lanzadera oficial para BBK Live desde Kobetamendi?",
        a: "Sí. Durante el BBK Live Festival la organización habilita lanzaderas gratuitas desde la Plaza Moyúa (Bilbao centro) hasta el recinto en el monte Kobetamendi. Los autobuses salen cada 10–15 minutos a partir de las 17:00 y tienen servicio de vuelta hasta las 4:00–5:00. Es el modo de acceso recomendado para quienes se alojan en Bilbao.",
      },
      {
        q: "¿Cómo llegar a Kobetamendi en metro?",
        a: "No hay acceso en metro directamente al monte. Las paradas más cercanas son San Ignacio (L1) y Basurto (L2), ambas a 1,5–2 km del recinto. Desde allí hay que subir a pie (cuesta pronunciada) o esperar la lanzadera oficial. La mayoría de asistentes toma el metro hasta Moyúa y desde allí la lanzadera gratuita del BBK Live.",
      },
      {
        q: "¿Cuánto cuesta ir a BBK Live desde Madrid en carpooling?",
        a: "Madrid–Bilbao son 395 km por la AP-1 (4 horas). Con ConcertRide el precio por asiento oscila entre 11 y 16 €, frente a los 40–80 € del AVE Madrid–Bilbao o los 30–50 € de un autobús ALSA. Es la ruta más demandada en ConcertRide durante el BBK Live (primera semana de julio).",
      },
      {
        q: "¿Dónde está el recinto de Kobetamendi?",
        a: "Kobetamendi es un monte de 364 metros en el municipio de Bilbao, en el barrio de Uribarri. El acceso en coche es por la carretera BI-3714 (cerrada al tráfico privado durante el festival). Coordenadas del recinto: 43.2658 N, 2.9354 W. Durante BBK Live solo se puede acceder en lanzadera o andando desde el metro.",
      },
      {
        q: "¿Hay alojamiento cerca de Kobetamendi para el BBK Live?",
        a: "No hay hoteles en el monte. Los asistentes de fuera de Bilbao suelen alojarse en el centro de la ciudad (15–30 min en lanzadera al recinto). Para quienes vienen de Madrid o San Sebastián en carpooling con ConcertRide, lo habitual es alojarse 1–2 noches en Bilbao y usar la lanzadera oficial para ir al festival.",
      },
    ],
    relatedFestivals: ["bbk-live"],
  },

  // ── BARCELONA (continuación) ─────────────────────────────────────────────────

  {
    slug: "fira-barcelona",
    name: "Fira de Barcelona (Gran Via)",
    quotableAnswer:
      "Fira de Barcelona (Gran Via) es un recinto con capacidad para Variable (hasta 40.000) en Barcelona, dedicado a festivales al aire libre y macroconciertos. Está conectado con el centro de Barcelona mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L1 Europa/Fira. Las opciones para llegar son: (1) Metro L1 Europa/Fira (acceso directo) (1,50–2,50 €); (2) Autobús urbano Lanzadera Sónar Day desde Fira Montjuïc (1,50–2 €); (3) Renfe Cercanías R5/R6 (estación Europa/Fira, acceso directo) (2–5 €). El carpooling desde Tarragona, Girona, Zaragoza cuesta 4–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Fira de Barcelona",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    address: "Av. Joan Carles I, 64, 08908 L'Hospitalet de Llobregat",
    lat: 41.3559,
    lng: 2.1265,
    capacity: "Variable (hasta 40.000)",
    venueType: "Recinto ferial",
    transport: {
      metro: "L1 Europa/Fira (acceso directo) · L9 Europa/Fira (FGC)",
      tren: "Cercanías R5/R6 (estación Europa/Fira, acceso directo)",
      bus: "Lanzadera Sónar Day desde Fira Montjuïc · bus 65 (L'Hospitalet)",
    },
    blurb:
      "La Fira de Barcelona Gran Via es el mayor espacio ferial de L'Hospitalet de Llobregat, utilizado para el Sónar by Day y eventos de gran formato. El acceso es excelente en transporte público: metro L1, L9 y Cercanías R5/R6 tienen parada en Europa/Fira. La vuelta nocturna después del Sónar by Night (que se celebra en el Parc de Montjuïc) puede requerir combinar medios de transporte. Para asistentes de Madrid y Valencia, el carpooling con ConcertRide ahorra entre 30 y 80 € respecto al AVE o los autobuses.",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 350, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 296, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Tarragona", km: 98, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Girona", km: 99, drivingTime: "1h 05 min", concertRideRange: "4–7 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a la Fira de Barcelona Gran Via en metro?",
        a: "Toma la línea 1 (roja) hasta Europa/Fira o la línea 9 Sud (naranja, FGC) también hasta Europa/Fira. La Cercanías R5 y R6 también para en la misma estación. El acceso desde el centro de Barcelona dura 20–25 minutos en metro.",
      },
      {
        q: "¿Dónde está la Fira de Barcelona Gran Via? ¿Es en Barcelona o en L'Hospitalet?",
        a: "Está técnicamente en L'Hospitalet de Llobregat, aunque es prácticamente contigua a la zona de Gran Via de Barcelona. Dirección: Avenida Joan Carles I, 64, 08908 L'Hospitalet. La entrada principal por la Avenida del Paral·lel está a 5 minutos a pie de la parada de metro Europa/Fira.",
      },
      {
        q: "¿Hay lanzadera Sónar desde la Fira Barcelona?",
        a: "Durante Sónar, el Sónar by Day se celebra en la Fira Gran Via (L'Hospitalet) y el Sónar by Night en la Fira Montjuïc (Pavellons 1 y 2, cerca de Espanya). La organización habilita lanzaderas entre ambos recintos y hay buses reforzados de TMB. El billete de Sónar no incluye transporte.",
      },
      {
        q: "¿Cuánto cuesta el carpooling Valencia–Sónar (Fira de Barcelona)?",
        a: "Valencia–Barcelona son 350 km por la AP-7 (3h 15 min). Con ConcertRide el precio por asiento es de 10–14 €, frente a los 20–40 € de un billete de autobús o los 40–80 € del AVE. Sónar tiene fecha en junio y es uno de los festivales con más viajes disponibles en la plataforma.",
      },
      {
        q: "¿Puedo aparcar en la Fira de Barcelona durante el Sónar?",
        a: "La Fira Gran Via dispone de parking propio (acceso por la calle dels Jocs Olímpics). En días de Sónar la capacidad es limitada y el parking se llena rápido. Existen parkings privados en el entorno de L'Hospitalet y en la zona de Gran Via (5–12 €/día). Se recomienda llegar en metro o en carpooling.",
      },
    ],
    relatedFestivals: ["sonar"],
  },

  {
    slug: "palau-blaugrana",
    name: "Palau Blaugrana",
    quotableAnswer:
      "Palau Blaugrana es un recinto con capacidad para 7.500 personas en Barcelona, dedicado a conciertos en formato arena y giras de gran formato. Está conectado con el centro de Barcelona mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L3 Palau Reial. Las opciones para llegar son: (1) Metro L3 Palau Reial (800 m) (1,50–2,50 €); (2) Autobús urbano Líneas 7, 15, 67 (1,50–2 €); (3) Vehículo propio: Parking Camp Nou (Travessera de les Corts): 6–8 €/día. El carpooling desde Tarragona, Lleida, Zaragoza cuesta 4–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Palau Blaugrana",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    address: "Carrer d'Arístides Maillol, s/n, 08028 Barcelona",
    lat: 41.3808,
    lng: 2.1215,
    capacity: "7.500 personas",
    venueType: "Arena",
    transport: {
      metro: "L3 Palau Reial (800 m) · L5 Collblanc (600 m)",
      bus: "Líneas 7, 15, 67 · nocturnos N12, N13",
      parking: "Parking Camp Nou (Travessera de les Corts): 6–8 €/día",
    },
    blurb:
      "El Palau Blaugrana es el pabellón polideportivo del FC Barcelona junto al Camp Nou, con aforo de 7.500 personas. Es uno de los recintos de conciertos medios más activos de Barcelona, con buena conexión en metro (L3 Palau Reial, L5 Collblanc). La vuelta nocturna en metro es posible hasta la 1:30–2:00. Para quienes vienen de otras ciudades en carpooling, la zona del Camp Nou tiene buen acceso desde las rondas de Barcelona y parking cercano.",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 350, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 296, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Tarragona", km: 98, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Lleida", km: 170, drivingTime: "1h 40 min", concertRideRange: "5–9 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Palau Blaugrana en metro?",
        a: "Las opciones más cómodas son el metro L3 (verde) hasta Palau Reial (800 m a pie) o el metro L5 (azul) hasta Collblanc (600 m). Desde Plaça Catalunya el trayecto dura unos 15–20 minutos. También puedes tomar el bus 7 con parada frente al Camp Nou.",
      },
      {
        q: "¿El Palau Blaugrana es lo mismo que el Camp Nou?",
        a: "No. Son dos recintos adyacentes pero distintos. El Camp Nou es el estadio de fútbol del FC Barcelona (aforo ~99.000). El Palau Blaugrana (también llamado Palau Sant Jordi de Les Corts por confusión) es el pabellón cubierto del complejo con 7.500 asientos. Para conciertos y eventos de interior se usa el Palau Blaugrana. Dirección: Carrer d'Arístides Maillol s/n, 08028 Barcelona.",
      },
      {
        q: "¿Cómo volver del Palau Blaugrana de madrugada?",
        a: "El metro L3 y L5 operan hasta la 1:30 (fines de semana hasta las 2:00). Los buses nocturnos N12 (pasa por Diagonal–Les Corts) y N13 tienen parada en la zona. Para conciertos que terminan después de las 2:00, las opciones son taxi o VTC (10–20 € al centro de Barcelona) o carpooling con ConcertRide coordinado previamente.",
      },
      {
        q: "¿Cuánto cuesta el carpooling Zaragoza–Palau Blaugrana?",
        a: "Zaragoza–Barcelona son 296 km por la AP-2 (2h 45 min). Con ConcertRide el precio por asiento es de 8–12 €. La ruta Zaragoza–Barcelona es una de las más frecuentes en ConcertRide para conciertos en el Palau Blaugrana, el Palau Sant Jordi o el Parc del Fòrum.",
      },
      {
        q: "¿Hay parking en el Palau Blaugrana?",
        a: "El Parking Camp Nou (acceso por Travessera de les Corts o Aristides Maillol) tiene plazas disponibles a 6–8 €/día. En días de partido de fútbol y concierto simultáneos la disponibilidad es muy limitada. Existen parkings privados en las calles adyacentes de Les Corts (Joan XXIII, Trav. de les Corts) a precios similares.",
      },
    ],
    relatedFestivals: ["primavera-sound"],
  },
  // ── Wave 11: Stadium-class venues (close override→landing gap) ──────────────
  {
    slug: "estadio-santiago-bernabeu",
    name: "Estadio Santiago Bernabéu",
    quotableAnswer:
      "Estadio Santiago Bernabéu es un recinto con capacidad para 85.000 personas en Madrid, dedicado a grandes conciertos, festivales y eventos deportivos. Está conectado con el centro de Madrid mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L10 Santiago Bernabéu. Las opciones para llegar son: (1) Metro L10 Santiago Bernabéu (puerta) (1,50–2,50 €); (2) Autobús urbano Líneas 14, 27, 40, 43, 120, 147, 150 (1,50–2 €); (3) Vehículo propio: Parking propio Bernabéu Stadium (15–25 €/noche en concierto) — colapsado siempre. El carpooling desde Toledo, Guadalajara, Zaragoza cuesta 3–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Bernabéu",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    address: "Av. de Concha Espina 1, 28036 Madrid",
    lat: 40.4530,
    lng: -3.6883,
    capacity: "85.000 personas",
    venueType: "Estadio",
    transport: {
      metro: "L10 Santiago Bernabéu (puerta) · L5 Nuevos Ministerios (10 min)",
      bus: "Líneas 14, 27, 40, 43, 120, 147, 150 · Nocturnos N1, N22, N24",
      parking: "Parking propio Bernabéu Stadium (15–25 €/noche en concierto) — colapsado siempre",
    },
    blurb:
      "El Estadio Santiago Bernabéu (85.000 plazas) es el recinto del Real Madrid y, tras la reforma de 2024–2025, uno de los grandes escenarios de mega-conciertos en España. Coldplay, Bruce Springsteen, Karol G y Taylor Swift han actuado o anunciado fechas. La salida en metro L10 colapsa entre las 23:30 y las 01:00 con colas de 30–60 minutos en el andén; los buses nocturnos N1 y N22 son alternativa real. Asistentes de Barcelona, Valencia, Sevilla y Zaragoza optan masivamente por carpooling ConcertRide para evitar tener que pernoctar en Madrid.",
    originCities: [
      { city: "Barcelona", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 358, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Sevilla", km: 530, drivingTime: "5h 00 min", concertRideRange: "14–20 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h 00 min", concertRideRange: "9–13 €/asiento" },
      { city: "Bilbao", km: 395, drivingTime: "4h 00 min", concertRideRange: "11–16 €/asiento" },
      { city: "Málaga", km: 545, drivingTime: "5h 15 min", concertRideRange: "14–20 €/asiento" },
      { city: "Toledo", km: 75, drivingTime: "0h 50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Guadalajara", km: 60, drivingTime: "0h 45 min", concertRideRange: "3–5 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Estadio Santiago Bernabéu para un concierto?",
        a: "El Bernabéu tiene salida directa de Metro L10 (estación Santiago Bernabéu, puerta del estadio). L5 Nuevos Ministerios queda a 10 min andando por Paseo de la Castellana. Buses 14, 27, 40, 43, 120, 147 y 150 paran junto al estadio. Buses nocturnos N1 (Cibeles–Plaza Castilla), N22 y N24 cubren el regreso después de la 01:30. Carpooling ConcertRide desde Barcelona (15–20 €), Valencia (10–14 €), Sevilla (14–20 €), Zaragoza (9–13 €), Bilbao (11–16 €). 0% comisión, vuelta nocturna coordinada con otros fans del mismo concierto.",
      },
      {
        q: "¿Hay parking en el Bernabéu para conciertos?",
        a: "El parking propio del Bernabéu Stadium (acceso por Av. de Concha Espina o Padre Damián) tiene capacidad limitada y precio elevado en noches de concierto (15–25 €/noche). Se llena 2–3 horas antes del concierto. La alternativa real es metro L10 directo o carpooling ConcertRide al estadio (4–7 €/asiento desde el centro de Madrid). Los parkings privados de la zona Bernabéu (Padre Damián, Concha Espina) tienen precios similares y también colapsan.",
      },
      {
        q: "¿Cómo volver del Bernabéu de madrugada?",
        a: "Si el concierto termina antes de las 01:00, Metro L10 sigue operativo (último servicio aproximado 01:30 fines de semana). Para regresos posteriores: bus nocturno N1 hasta Cibeles + transbordo a otros nocturnos para llegar al sur o norte; taxi o VTC (15–35 € al centro); carpooling ConcertRide previamente coordinado para volver a Toledo, Guadalajara, Segovia o Ávila desde el propio Bernabéu sin pernoctar en Madrid.",
      },
      {
        q: "¿Qué artistas tocan en el Bernabéu en 2026?",
        a: "El Bernabéu acoge mega-giras de estadio cada verano. Artistas confirmados o esperados en 2026: Coldplay, Bruce Springsteen, Karol G, Taylor Swift, AC/DC, Mötley Crüe. La programación se anuncia entre enero y marzo del año del concierto. Capacidad por concierto: 75.000–85.000 personas según escenario y configuración.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Barcelona al Bernabéu?",
        a: "Barcelona–Madrid son 620 km por la A-2 (5h 30 min). Con ConcertRide el precio por asiento es 15–20 € — frente a 50–90 € del AVE Sants–Atocha + Metro al Bernabéu. Sin comisión, pago Bizum o efectivo el día del viaje, vuelta nocturna coordinada con otros fans que asisten al mismo concierto. URL: concertride.me/rutas/barcelona-bernabeu",
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "estadio-civitas-metropolitano",
    name: "Estadio Cívitas Metropolitano",
    quotableAnswer:
      "Estadio Cívitas Metropolitano es un recinto con capacidad para 68.000 personas en Madrid, dedicado a grandes conciertos, festivales y eventos deportivos. Está conectado con el centro de Madrid mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L7 Estadio Metropolitano. Las opciones para llegar son: (1) Metro L7 Estadio Metropolitano (puerta del estadio, 3 min andando) (1,50–2,50 €); (2) Autobús urbano Líneas 38, 140, 263 (1,50–2 €); (3) Vehículo propio: Parking Metropolitano (5–10 €/coche en concierto, capacidad 1.500 plazas). El carpooling desde Toledo, Alcalá de Henares, Zaragoza cuesta 3–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Metropolitano",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    address: "Av. Luis Aragonés s/n, 28022 Madrid",
    lat: 40.4361,
    lng: -3.5996,
    capacity: "68.000 personas",
    venueType: "Estadio",
    transport: {
      metro: "L7 Estadio Metropolitano (puerta del estadio, 3 min andando)",
      bus: "Líneas 38, 140, 263 · Nocturnos N4, N5",
      parking: "Parking Metropolitano (5–10 €/coche en concierto, capacidad 1.500 plazas)",
    },
    blurb:
      "El Estadio Cívitas Metropolitano (68.000 plazas) es el campo del Atlético de Madrid y, desde 2018, uno de los grandes recintos de mega-conciertos en la capital. Ed Sheeran, Drake, Metallica, Guns N' Roses y Bruce Springsteen son cabezas de cartel habituales del verano madrileño. La conexión Metro L7 Estadio Metropolitano (3 min andando hasta la puerta) es la opción dominante; el último Metro sale alrededor de la 01:30 los fines de semana. Carpooling ConcertRide es la alternativa para asistentes de Barcelona, Valencia, Sevilla y otros puntos peninsulares que evitan trenes nocturnos inexistentes y alojamiento caro en Madrid.",
    originCities: [
      { city: "Barcelona", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 358, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Sevilla", km: 530, drivingTime: "5h 00 min", concertRideRange: "14–20 €/asiento" },
      { city: "Bilbao", km: 395, drivingTime: "4h 00 min", concertRideRange: "11–16 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h 00 min", concertRideRange: "9–13 €/asiento" },
      { city: "Málaga", km: 545, drivingTime: "5h 15 min", concertRideRange: "14–20 €/asiento" },
      { city: "Toledo", km: 75, drivingTime: "0h 50 min", concertRideRange: "3–6 €/asiento" },
      { city: "Alcalá de Henares", km: 25, drivingTime: "0h 25 min", concertRideRange: "3–5 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Estadio Metropolitano para un concierto?",
        a: "Metro L7 Estadio Metropolitano (línea naranja, dirección Hospital del Henares) tiene salida directa al estadio (3 min andando). Cercanías Renfe línea C-1/C-7 también para en Estadio Metropolitano. Buses 38, 140 y 263 paran cerca del recinto. Carpooling ConcertRide al Metropolitano: Barcelona (15–20 €/asiento), Valencia (10–14 €), Sevilla (14–20 €), Bilbao (11–16 €), Zaragoza (9–13 €). 0% comisión, vuelta de madrugada coordinada — el Metro L7 cierra a las 01:30 los fines de semana.",
      },
      {
        q: "¿Qué artistas tocan en el Metropolitano en 2026?",
        a: "El Estadio Cívitas Metropolitano acoge giras de mega-estadio cada verano. Artistas anunciados o esperados en 2026: Ed Sheeran (+–=÷× Tour), Drake, Metallica (M72 World Tour), Guns N' Roses, Bruce Springsteen, AC/DC. Capacidad por concierto: 65.000–68.000 personas según escenario.",
      },
      {
        q: "¿Hay parking en el Metropolitano para conciertos?",
        a: "El Estadio Metropolitano tiene parking propio con 1.500 plazas (5–10 €/coche en noches de concierto). Se reserva online en metropolitano-parking.com con descuento. La capacidad es limitada — se llena 2 horas antes del cabeza de cartel. Alternativa: parking gratuito en las calles adyacentes de Coslada y San Fernando de Henares (10–15 min andando hasta el estadio) o carpooling ConcertRide directo al recinto.",
      },
      {
        q: "¿Cómo volver del Metropolitano de madrugada?",
        a: "Metro L7 (último 01:30 fines de semana) hasta el centro de Madrid. Cercanías C-1 hasta Atocha. Bus nocturno N4 hasta Plaza Castilla. Para regresos a otras ciudades de madrugada: el carpooling ConcertRide es la única opción real — no hay AVE nocturno, los autobuses ALSA cierran a las 23:00. Coordina la vuelta antes del concierto con un conductor que vaya a tu ciudad.",
      },
      {
        q: "¿Cuánto cuesta el carpooling Valencia–Metropolitano?",
        a: "Valencia–Madrid son 358 km por la A-3 (3h 20 min). Con ConcertRide el precio por asiento es 10–14 € — frente a 35–55 € del AVE Joaquín Sorolla–Atocha + Metro al Metropolitano. Sin comisión, pago Bizum o efectivo el día del viaje. URL: concertride.me/rutas/valencia-metropolitano",
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "estadi-olimpic-lluis-companys",
    name: "Estadi Olímpic Lluís Companys",
    quotableAnswer:
      "Estadi Olímpic Lluís Companys es un recinto con capacidad para 55.000 personas en Barcelona, dedicado a grandes conciertos, festivales y eventos deportivos. Está conectado con el centro de Barcelona mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L1/L3 Plaça Espanya. Las opciones para llegar son: (1) Metro L1/L3 Plaça Espanya (15 min andando + escaleras mecánicas Montjuïc) (1,50–2,50 €); (2) Autobús urbano Bus Montjuïc 50 (1,50–2 €); (3) Vehículo propio: Parking Anella Olímpica (10–15 €/coche en concierto, capacidad limitada). El carpooling desde Sabadell, Tarragona, Lleida cuesta 3–22 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Estadi Olímpic",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    address: "Passeig Olímpic 17–19, 08038 Barcelona",
    lat: 41.3647,
    lng: 2.1556,
    capacity: "55.000 personas",
    venueType: "Estadio",
    transport: {
      metro: "L1/L3 Plaça Espanya (15 min andando + escaleras mecánicas Montjuïc)",
      bus: "Bus Montjuïc 50 · Nocturno N1 (Plaça Catalunya)",
      parking: "Parking Anella Olímpica (10–15 €/coche en concierto, capacidad limitada)",
    },
    blurb:
      "El Estadi Olímpic Lluís Companys (55.000 plazas) en Montjuïc Barcelona es uno de los recintos de mega-concierto más icónicos de España. Ha acogido a Taylor Swift, Bruce Springsteen, Bad Bunny, Madonna, Imagine Dragons, U2 y Pink. El acceso por Plaça Espanya implica subir Montjuïc por escaleras mecánicas (15 min) o usar el Bus Montjuïc — el aparcamiento en la Anella Olímpica colapsa siempre. Asistentes de Madrid, Valencia, Zaragoza, Bilbao y Tarragona optan masivamente por carpooling ConcertRide para llegar directamente y coordinar la vuelta nocturna sin depender del Metro L1 (cierra hacia las 02:00).",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 296, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Bilbao", km: 625, drivingTime: "5h 30 min", concertRideRange: "16–22 €/asiento" },
      { city: "Tarragona", km: 105, drivingTime: "1h 10 min", concertRideRange: "5–8 €/asiento" },
      { city: "Lleida", km: 165, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Girona", km: 105, drivingTime: "1h 10 min", concertRideRange: "5–8 €/asiento" },
      { city: "Sabadell", km: 30, drivingTime: "0h 30 min", concertRideRange: "3–5 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Estadi Olímpic Lluís Companys de Barcelona?",
        a: "Metro L1 (Plaça Espanya) o L3 (Espanya), después subir Montjuïc por las escaleras mecánicas hasta el Anella Olímpica (15 min, gratis). El Bus Montjuïc 50 conecta Plaça Espanya con la zona del estadio. Para regresos nocturnos: bus N1 hasta Plaça Catalunya. Carpooling ConcertRide al Estadi Olímpic: Madrid (15–20 €/asiento), Valencia (10–14 €), Zaragoza (8–12 €), Tarragona (5–8 €). 0% comisión, vuelta de madrugada coordinada — el Metro L1 cierra alrededor de las 02:00 fines de semana.",
      },
      {
        q: "¿Qué artistas han tocado en el Estadi Olímpic de Barcelona?",
        a: "Lista histórica de cabezas de cartel del Estadi Olímpic: Taylor Swift (Eras Tour 2024), Bruce Springsteen (2016, 2024), Bad Bunny, Madonna (2026), Imagine Dragons, U2 (Joshua Tree 2017), Pink, Eurovisión 2002. Es uno de los recintos de mega-concierto más demandados de España junto al Bernabéu Madrid y el Metropolitano. Capacidad: 50.000–55.000 según configuración.",
      },
      {
        q: "¿Hay parking en el Estadi Olímpic Montjuïc?",
        a: "El parking de la Anella Olímpica tiene capacidad limitada y precio en noches de concierto (10–15 €/coche). Se llena 2–3 horas antes del cabeza de cartel. La organización promueve transporte público — Metro L1/L3 + escaleras mecánicas — o carpooling ConcertRide directo al recinto (la zona está restringida a vehículos durante el concierto, dejada en zonas próximas).",
      },
      {
        q: "¿Cómo volver del Estadi Olímpic de madrugada?",
        a: "Si el concierto termina antes de la 01:30: Metro L1/L3 + escaleras de Montjuïc. Después de las 02:00: bus nocturno N1 hasta Plaça Catalunya, taxi (10–20 € al centro de Barcelona), o carpooling ConcertRide previamente coordinado para volver a Madrid (15–20 €), Valencia (10–14 €), Zaragoza (8–12 €), Tarragona (5–8 €) sin pernoctar en Barcelona.",
      },
      {
        q: "¿Cuánto cuesta el carpooling Madrid–Estadi Olímpic Barcelona?",
        a: "Madrid–Barcelona son 620 km por la A-2 (5h 30 min). Con ConcertRide el precio por asiento es 15–20 € — frente a 50–90 € del AVE Atocha–Sants + Metro al estadio. Sin comisión, pago Bizum o efectivo el día del viaje, vuelta nocturna coordinada con otros fans. URL: concertride.me/rutas/madrid-estadi-olimpic",
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "roig-arena",
    name: "Roig Arena Valencia",
    quotableAnswer:
      "Roig Arena Valencia es un recinto con capacidad para 20.000 personas en Valencia, dedicado a conciertos en formato arena y giras de gran formato. Está conectado con el centro de Valencia mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L4 Tarongers. Las opciones para llegar son: (1) Metro L4 Tarongers (5 min andando) (1,50–2,50 €); (2) Autobús urbano EMT 30, 31 (1,50–2 €); (3) Vehículo propio: Parking propio en construcción (capacidad prevista 2.500 plazas). El carpooling desde Castellón, Gandia, Alicante cuesta 3–14 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Roig Arena",
    city: "Valencia",
    citySlug: "valencia",
    region: "Comunidad Valenciana",
    address: "Av. de las Cortes Valencianas, Valencia",
    lat: 39.4895,
    lng: -0.3950,
    capacity: "20.000 personas",
    venueType: "Arena",
    transport: {
      metro: "L4 Tarongers (5 min andando) · L9 Albereda (10 min)",
      bus: "EMT 30, 31",
      parking: "Parking propio en construcción (capacidad prevista 2.500 plazas)",
    },
    blurb:
      "El Roig Arena Valencia es el nuevo recinto cubierto multidisciplinar más grande de la Comunidad Valenciana, con capacidad para 20.000 personas y apertura prevista para 2026. Será sede del Valencia Basket Club y referente de los grandes conciertos cubiertos del Levante, comparable al WiZink Center Madrid o al Palau Sant Jordi Barcelona. Conectado por Metro L4 Tarongers (5 min andando) y bus EMT 30/31. Carpooling ConcertRide al Roig Arena: Madrid, Barcelona, Alicante, Castellón, Murcia y Albacete — sin comisión, pago Bizum o efectivo, vuelta nocturna coordinada.",
    originCities: [
      { city: "Madrid", km: 358, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Barcelona", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Alicante", km: 175, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Castellón", km: 75, drivingTime: "0h 50 min", concertRideRange: "3–5 €/asiento" },
      { city: "Murcia", km: 245, drivingTime: "2h 30 min", concertRideRange: "7–11 €/asiento" },
      { city: "Albacete", km: 190, drivingTime: "2h 00 min", concertRideRange: "6–9 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h 00 min", concertRideRange: "9–13 €/asiento" },
      { city: "Gandia", km: 65, drivingTime: "0h 45 min", concertRideRange: "3–5 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cuándo abre el Roig Arena Valencia?",
        a: "El Roig Arena Valencia tiene apertura prevista para 2026 como sede principal del Valencia Basket Club y recinto multidisciplinar para conciertos. Será el mayor pabellón cubierto de la Comunidad Valenciana con capacidad para 20.000 personas — comparable al WiZink Center Madrid (17.000) y al Palau Sant Jordi Barcelona (17.000). La programación de conciertos se anuncia en la web oficial roigarena.com.",
      },
      {
        q: "¿Cómo llegar al Roig Arena de Valencia?",
        a: "Metro L4 Tarongers (5 min andando hasta el recinto) o L9 Albereda (10 min andando). Bus EMT líneas 30 y 31. El Roig Arena se ubica en la Av. de las Cortes Valencianas, en el norte de la ciudad de Valencia. Carpooling ConcertRide al Roig Arena: Madrid (10–14 €/asiento), Barcelona (10–14 €), Alicante (5–8 €), Castellón (3–5 €), Murcia (7–11 €). 0% comisión.",
      },
      {
        q: "¿Hay parking en el Roig Arena?",
        a: "El Roig Arena cuenta con parking propio en construcción, con capacidad prevista de 2.500 plazas (precio estimado 8–12 €/concierto). En la fase inicial, los asistentes pueden estacionar en parkings públicos de la zona Tarongers (3–8 €/h, 12–20 €/día). La organización recomienda transporte público (Metro L4) o carpooling para evitar congestión en la Av. de las Cortes Valencianas.",
      },
      {
        q: "¿Qué tipo de eventos acoge el Roig Arena?",
        a: "El Roig Arena Valencia es un recinto multidisciplinar diseñado para baloncesto profesional (Valencia Basket Club, Euroliga), conciertos de música, eventos deportivos (boxeo, MMA, tenis indoor), espectáculos y galas de premios. La programación de conciertos abarca pop, rock, latino, electrónica y clásica con cabezas de cartel internacionales y nacionales. Comparable al WiZink Center Madrid en perfil de programación.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Alicante al Roig Arena?",
        a: "Alicante–Valencia son 175 km por la AP-7 (1h 45 min). Con ConcertRide el precio por asiento es 5–8 € — frente a 12–22 € del tren Euromed Alicante–Valencia Joaquín Sorolla + Metro al Roig Arena. Sin comisión, pago Bizum o efectivo el día del viaje. URL: concertride.me/rutas/alicante-roig-arena",
      },
    ],
    relatedFestivals: ["festival-de-les-arts", "zevra-festival"],
  },
  // ── Wave 11: Secondary major venues ──────────────────────────────────────────
  {
    slug: "fibes-sevilla",
    name: "FIBES Palacio de Exposiciones y Congresos de Sevilla",
    quotableAnswer:
      "FIBES Palacio de Exposiciones y Congresos de Sevilla es un recinto con capacidad para 9.500 personas (Pabellón Principal) en Sevilla, dedicado a festivales al aire libre y macroconciertos. Está conectado con el centro de Sevilla mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L1 Cocheras. Las opciones para llegar son: (1) Metro L1 Cocheras (15 min andando) (1,50–2,50 €); (2) Autobús urbano Tussam 27, 28 (1,50–2 €); (3) Vehículo propio: Parking propio FIBES (3–6 €/coche, capacidad 2.000 plazas). El carpooling desde Huelva, Jerez de la Frontera, Cádiz cuesta 4–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "FIBES",
    city: "Sevilla",
    citySlug: "sevilla",
    region: "Andalucía",
    address: "Av. Alcalde Luis Uruñuela 1, 41020 Sevilla",
    lat: 37.4140,
    lng: -5.9128,
    capacity: "9.500 personas (Pabellón Principal)",
    venueType: "Recinto ferial / Auditorio",
    transport: {
      metro: "L1 Cocheras (15 min andando) · Tussam línea 27 (frente al recinto)",
      bus: "Tussam 27, 28 · Nocturnos A2, A3 hasta Plaza Nueva",
      parking: "Parking propio FIBES (3–6 €/coche, capacidad 2.000 plazas)",
    },
    blurb:
      "FIBES (Fira Internacional de Bilbao Exposiciones y Congresos de Sevilla) es el segundo recinto de conciertos más importante de Sevilla tras el Estadio La Cartuja. Capacidad de 9.500 personas en el Pabellón Principal, programación regular de cabezas de cartel internacionales y españoles. Buena conexión por Tussam línea 27 desde el centro de Sevilla. Para asistentes de Cádiz, Huelva, Córdoba y Málaga, el carpooling ConcertRide es la alternativa más económica al AVE.",
    originCities: [
      { city: "Cádiz", km: 130, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Huelva", km: 95, drivingTime: "1h 00 min", concertRideRange: "4–7 €/asiento" },
      { city: "Córdoba", km: 140, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Málaga", km: 220, drivingTime: "2h 15 min", concertRideRange: "7–10 €/asiento" },
      { city: "Granada", km: 250, drivingTime: "2h 30 min", concertRideRange: "8–11 €/asiento" },
      { city: "Madrid", km: 530, drivingTime: "5h 00 min", concertRideRange: "14–20 €/asiento" },
      { city: "Jerez de la Frontera", km: 95, drivingTime: "1h 00 min", concertRideRange: "4–7 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a FIBES Sevilla?",
        a: "Tussam línea 27 conecta Plaza Nueva con FIBES (parada frente al recinto, 25 min). Metro L1 Cocheras a 15 min andando. Carpooling ConcertRide a FIBES: Cádiz (5–8 €/asiento), Huelva (4–7 €), Córdoba (5–8 €), Málaga (7–10 €), Madrid (14–20 €). 0% comisión, vuelta nocturna coordinada — Tussam nocturnos A2/A3 funcionan hasta las 02:00.",
      },
      {
        q: "¿Qué artistas tocan en FIBES Sevilla?",
        a: "FIBES programa cabezas de cartel internacionales y españoles cada año. Históricamente han pasado: Pablo Alborán, Manuel Carrasco, Joaquín Sabina, Sting, Andrea Bocelli, Rosalía. Capacidad 9.500 personas en el Pabellón Principal — formato butaca numerada o pista, según el evento.",
      },
      {
        q: "¿Hay parking en FIBES?",
        a: "FIBES tiene parking propio con 2.000 plazas (3–6 €/coche en concierto). Se llena 1–2 horas antes del cabeza de cartel. Alternativa: aparcamiento gratuito en zonas adyacentes (Av. Luis Uruñuela, Cocheras) o carpooling ConcertRide directo al recinto.",
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "bilbao-arena",
    name: "Bilbao Arena Miribilla",
    quotableAnswer:
      "Bilbao Arena Miribilla es un recinto con capacidad para 10.014 personas en Bilbao, dedicado a conciertos en formato arena y giras de gran formato. Está conectado con el centro de Bilbao mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L2 Miribilla. Las opciones para llegar son: (1) Metro L2 Miribilla (5 min andando) (1,50–2,50 €); (2) Autobús urbano Bilbobus 1, 38, 56, 71 (1,50–2 €); (3) Vehículo propio: Parking subterráneo Miribilla (3–6 €/coche). El carpooling desde Vitoria-Gasteiz, Donostia, Santander cuesta 3–22 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Bilbao Arena",
    city: "Bilbao",
    citySlug: "bilbao",
    region: "País Vasco",
    address: "Askatasuna Etorbidea 13, 48003 Bilbao",
    lat: 43.2486,
    lng: -2.9305,
    capacity: "10.014 personas",
    venueType: "Arena / Pabellón cubierto",
    transport: {
      metro: "L2 Miribilla (5 min andando)",
      bus: "Bilbobus 1, 38, 56, 71",
      parking: "Parking subterráneo Miribilla (3–6 €/coche)",
    },
    blurb:
      "Bilbao Arena Miribilla (10.000 plazas) es el principal pabellón cubierto de Bilbao y sede del Bilbao Basket. Acoge giras de cabezas de cartel españoles e internacionales (Joaquín Sabina, Pablo Alborán, Rosalía, Sting). Conexión directa con Metro L2 Miribilla y Bilbobus. Carpooling ConcertRide es la opción para asistentes de Donostia, Vitoria, Pamplona, Santander y Madrid.",
    originCities: [
      { city: "Donostia", km: 100, drivingTime: "1h 00 min", concertRideRange: "4–7 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 65, drivingTime: "0h 45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Pamplona", km: 155, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Santander", km: 100, drivingTime: "1h 00 min", concertRideRange: "4–7 €/asiento" },
      { city: "Logroño", km: 170, drivingTime: "1h 50 min", concertRideRange: "5–9 €/asiento" },
      { city: "Burgos", km: 160, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Madrid", km: 395, drivingTime: "4h 00 min", concertRideRange: "11–16 €/asiento" },
      { city: "Barcelona", km: 625, drivingTime: "5h 30 min", concertRideRange: "16–22 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Bilbao Arena Miribilla?",
        a: "Metro L2 Miribilla (5 min andando hasta el pabellón). Bilbobus líneas 1, 38, 56 y 71 paran cerca del recinto. Carpooling ConcertRide a Bilbao Arena: Donostia (4–7 €/asiento), Vitoria (3–6 €), Pamplona (5–8 €), Madrid (11–16 €), Barcelona (16–22 €). 0% comisión, vuelta nocturna coordinada — el Metro L2 cierra alrededor de las 02:00.",
      },
      {
        q: "¿Qué eventos hay en Bilbao Arena en 2026?",
        a: "Bilbao Arena programa unos 15–20 conciertos al año además de partidos de baloncesto del Bilbao Basket. Cabezas de cartel históricos: Pablo Alborán, Joaquín Sabina, Rosalía, Sting, Manuel Carrasco, Bryan Adams. La programación 2026 se anuncia trimestralmente en bilbaoarena.eus.",
      },
      {
        q: "¿Hay parking en Bilbao Arena?",
        a: "Bilbao Arena tiene parking subterráneo propio con 1.500 plazas (3–6 €/coche en concierto). En partidos y conciertos coincidentes se llena rápido. Alternativa: parking gratuito en calles adyacentes de Miribilla o carpooling ConcertRide directo al recinto.",
      },
    ],
    relatedFestivals: ["bbk-live"],
  },
  {
    slug: "pabellon-principe-felipe-zaragoza",
    name: "Pabellón Príncipe Felipe",
    quotableAnswer:
      "Pabellón Príncipe Felipe es un recinto con capacidad para 10.744 personas en Zaragoza, dedicado a conciertos en formato arena y giras de gran formato. Está conectado con el centro de Zaragoza mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro Tranvía L1 Plaza San Francisco / Plaza Aragón. Las opciones para llegar son: (1) Metro Tranvía L1 Plaza San Francisco / Plaza Aragón (15 min andando) (1,50–2,50 €); (2) Autobús urbano Líneas 21, 22, 32, 35, Ci1, Ci2 (1,50–2 €); (3) Vehículo propio: Sin parking propio — zonas ORA y aparcamientos cercanos (Plaza Pilar, San Pablo). El carpooling desde Huesca, Pamplona, Logroño cuesta 3–13 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Príncipe Felipe Zaragoza",
    city: "Zaragoza",
    citySlug: "zaragoza",
    region: "Aragón",
    address: "Av. César Augusto 30, 50003 Zaragoza",
    lat: 41.6661,
    lng: -0.8908,
    capacity: "10.744 personas",
    venueType: "Arena / Pabellón cubierto",
    transport: {
      metro: "Tranvía L1 Plaza San Francisco / Plaza Aragón (15 min andando)",
      bus: "Líneas 21, 22, 32, 35, Ci1, Ci2",
      parking: "Sin parking propio — zonas ORA y aparcamientos cercanos (Plaza Pilar, San Pablo)",
    },
    blurb:
      "El Pabellón Príncipe Felipe (10.744 plazas) es el principal recinto cubierto de Zaragoza y sede del CAI Zaragoza Basket. Programación regular de cabezas de cartel españoles e internacionales: Aitana, Dani Martín, Hombres G, Bryan Adams, Manuel Carrasco. Zaragoza es nodo estratégico equidistante entre Madrid (325 km) y Barcelona (296 km), por lo que carpooling ConcertRide es la opción habitual de asistentes de Pamplona, Huesca, Logroño y Lleida.",
    originCities: [
      { city: "Madrid", km: 325, drivingTime: "3h 00 min", concertRideRange: "9–13 €/asiento" },
      { city: "Barcelona", km: 296, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Pamplona", km: 175, drivingTime: "1h 50 min", concertRideRange: "5–8 €/asiento" },
      { city: "Huesca", km: 75, drivingTime: "0h 50 min", concertRideRange: "3–5 €/asiento" },
      { city: "Logroño", km: 175, drivingTime: "1h 50 min", concertRideRange: "5–8 €/asiento" },
      { city: "Lleida", km: 145, drivingTime: "1h 25 min", concertRideRange: "5–8 €/asiento" },
      { city: "Bilbao", km: 320, drivingTime: "3h 15 min", concertRideRange: "9–13 €/asiento" },
      { city: "Valencia", km: 325, drivingTime: "3h 00 min", concertRideRange: "9–13 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Pabellón Príncipe Felipe?",
        a: "Tranvía L1 Plaza San Francisco o Plaza Aragón (15 min andando hasta el pabellón). Buses urbanos 21, 22, 32, 35, Ci1 y Ci2 paran cerca. Carpooling ConcertRide al Príncipe Felipe: Madrid (9–13 €/asiento), Barcelona (8–12 €), Pamplona (5–8 €), Huesca (3–5 €), Logroño (5–8 €). 0% comisión.",
      },
      {
        q: "¿Qué artistas tocan en el Príncipe Felipe Zaragoza 2026?",
        a: "Conciertos confirmados en el Pabellón Príncipe Felipe Zaragoza 2026: Dani Martín DOBLE FECHA (22–23 mayo), Aitana (10 julio), Bryan Adams (14 noviembre), Hombres G (21 noviembre). La programación adicional se anuncia en zaragozaentradas.es.",
      },
      {
        q: "¿Hay parking en el Príncipe Felipe?",
        a: "El Príncipe Felipe NO tiene parking propio. La zona es ORA (estacionamiento regulado de pago, 1,15 €/hora máximo 2 horas) o parkings privados cercanos (Plaza Pilar, San Pablo, Mercado Central) a 1,80–2,80 €/hora, máximo diario 18–25 €. La alternativa real es tranvía L1 + 15 min andando, o carpooling ConcertRide directo al pabellón.",
      },
    ],
    relatedFestivals: ["vive-latino"],
  },

  // ── ZARAGOZA ─────────────────────────────────────────────────────────────────

  {
    slug: "espacio-expo-zaragoza",
    name: "Espacio Expo Zaragoza",
    quotableAnswer:
      "Espacio Expo Zaragoza es un recinto con capacidad para 30.000 personas en Zaragoza, dedicado a festivales al aire libre y macroconciertos. Está conectado con el centro de Zaragoza mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro Tranvía L1. Las opciones para llegar son: (1) Metro Tranvía L1 (parada Expo, acceso directo al recinto) (1,50–2,50 €); (2) Autobús urbano Líneas Ci1, Ci2 (1,50–2 €); (3) Vehículo propio: Parking gratuito zona Expo — amplias explanadas junto al recinto. El carpooling desde Pamplona, Barcelona, Valencia cuesta 5–13 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Espacio Expo",
    city: "Zaragoza",
    citySlug: "zaragoza",
    region: "Aragón",
    address: "Av. de Ranillas, s/n, 50018 Zaragoza",
    lat: 41.6608,
    lng: -0.9302,
    capacity: "30.000 personas",
    venueType: "Recinto al aire libre",
    transport: {
      metro: "Tranvía L1 (parada Expo, acceso directo al recinto)",
      bus: "Líneas Ci1, Ci2 · bus urbano 24",
      parking: "Parking gratuito zona Expo — amplias explanadas junto al recinto",
    },
    blurb:
      "El Espacio Expo Zaragoza es el recinto de grandes festivales y conciertos al aire libre de la capital aragonesa, con capacidad para 30.000 personas en el meandro de Ranillas. El acceso en tranvía L1 desde el centro de Zaragoza dura 12 minutos y el parking del entorno es gratuito. Zaragoza actúa como nodo estratégico equidistante entre Madrid (325 km), Barcelona (300 km) y Bilbao (320 km), lo que convierte el carpooling con ConcertRide en la opción más popular entre asistentes de las tres capitales.",
    originCities: [
      { city: "Madrid", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Barcelona", km: 300, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Bilbao", km: 320, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Valencia", km: 310, drivingTime: "2h 50 min", concertRideRange: "8–12 €/asiento" },
      { city: "Pamplona", km: 175, drivingTime: "1h 45 min", concertRideRange: "5–9 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Espacio Expo Zaragoza desde Madrid en carpooling?",
        a: "Madrid–Zaragoza son 325 km por la A-2 (3 horas sin tráfico). Con ConcertRide el precio por asiento es de 9–13 €, frente a los 25–50 € del AVE Madrid–Zaragoza. El conductor habitualmente sale 3–4 horas antes del concierto y coordina la vuelta según el horario de fin del evento. Es la ruta más demandada en ConcertRide para el Espacio Expo.",
      },
      {
        q: "¿Cómo ir al Espacio Expo en transporte público desde el centro de Zaragoza?",
        a: "El tranvía L1 de Zaragoza tiene parada 'Expo' a 5 minutos a pie del recinto. El trayecto desde la Plaza del Pilar dura unos 12 minutos. También puedes tomar los buses circulares Ci1 y Ci2 con paradas próximas. El tranvía opera hasta las 23:00 (ampliado en noches de evento) y los buses nocturnos tienen servicio limitado después de la medianoche.",
      },
      {
        q: "¿Hay parking gratuito en el Espacio Expo?",
        a: "Sí. El entorno del recinto dispone de amplias explanadas de aparcamiento gratuito junto al meandro de Ranillas, con acceso directo por la Av. de Ranillas. En eventos masivos se habilitan zonas adicionales. El parking es la opción preferida para asistentes de localidades próximas como Huesca, Logroño, Tudela o Calatayud.",
      },
      {
        q: "¿Cuánto cuesta el carpooling desde Barcelona al Espacio Expo?",
        a: "Barcelona–Zaragoza son 300 km por la AP-2 (2h 45 min). Con ConcertRide el precio por asiento es de 8–12 €, frente a los 20–40 € del AVE Barcelona–Zaragoza. Zaragoza–Barcelona es una de las rutas con más viajes disponibles en la plataforma durante los grandes festivales del Espacio Expo.",
      },
      {
        q: "¿Qué festivales y conciertos se celebran en el Espacio Expo Zaragoza?",
        a: "El Espacio Expo acoge el Vive Latino Festival (Recinto Expo, edición española, septiembre), conciertos multitudinarios de verano (Dani Martín, Aitana, Vetusta Morla) y eventos al aire libre de grandes promotoras. Con 30.000 personas de aforo, es el mayor escenario al aire libre de Aragón. La programación se anuncia en zaragozaentradas.es.",
      },
    ],
    relatedFestivals: ["vive-latino"],
  },

  // ── BARCELONA (variante slug SEO) ────────────────────────────────────────────

  {
    slug: "parc-del-forum-barcelona",
    name: "Parc del Fòrum (Barcelona)",
    quotableAnswer:
      "Parc del Fòrum (Barcelona) es un recinto con capacidad para 60.000 personas en Barcelona, dedicado a festivales al aire libre y macroconciertos. Está conectado con el centro de Barcelona mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L4 Besòs Mar. Las opciones para llegar son: (1) Metro L4 Besòs Mar (10 min a pie hasta el recinto) (1,50–2,50 €); (2) Autobús urbano H14, H16, bus 7 (1,50–2 €); (3) Vehículo propio: Parking Fòrum: 25–35 €/día, máx. 500 plazas — prácticamente inaccesible en festival. El carpooling desde Tarragona, Zaragoza, Valencia cuesta 4–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Parc del Fòrum",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    address: "Rambla del Prim, 2, 08019 Barcelona",
    lat: 41.4066,
    lng: 2.2218,
    capacity: "60.000 personas",
    venueType: "Parque / Recinto al aire libre",
    transport: {
      metro: "L4 Besòs Mar (10 min a pie hasta el recinto)",
      bus: "H14, H16, bus 7 · Tramvía T4 (parada Fòrum)",
      parking: "Parking Fòrum: 25–35 €/día, máx. 500 plazas — prácticamente inaccesible en festival",
    },
    blurb:
      "El Parc del Fòrum es el recinto de Primavera Sound y Cruïlla en Barcelona, situado en el extremo del Paseo Marítimo junto a la desembocadura del Besòs, con capacidad para 60.000 personas. El metro L4 (Besòs Mar) está a 10 minutos a pie y TMB amplía el servicio hasta las 3–4 de la madrugada durante los festivales. El parking es casi inexistente (máx. 500 plazas, 25–35 €). Para asistentes de Madrid (620 km, 15–20 € CR), Valencia (355 km, 10–14 € CR) y Zaragoza (306 km, 8–12 € CR), el carpooling con ConcertRide es la alternativa más económica.",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 306, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Bilbao", km: 615, drivingTime: "5h", concertRideRange: "15–20 €/asiento" },
      { city: "Tarragona", km: 100, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Parc del Fòrum en metro para Primavera Sound o Cruïlla?",
        a: "Toma la línea 4 (amarilla) hasta Besòs Mar, la última parada de línea. La salida da al paseo marítimo y el recinto queda a 10 minutos a pie. En noches de Primavera Sound y Cruïlla, TMB refuerza el servicio L4 hasta las 3:00–4:00. El tramvía T4 (parada Fòrum) llega hasta las 23:00 con alta frecuencia.",
      },
      {
        q: "¿Hay parking en el Parc del Fòrum?",
        a: "El Parc del Fòrum tiene parking (acceso por Rambla del Prim) con un máximo de 500 plazas y precios de 25–35 €/día en festival. Se llena antes de la apertura de puertas. La recomendación oficial de la organización de Primavera Sound y Cruïlla es llegar en transporte público (Metro L4 o tramvía T4) o en carpooling con ConcertRide.",
      },
      {
        q: "¿Cuánto cuesta el carpooling desde Madrid al Parc del Fòrum?",
        a: "Madrid–Barcelona son 620 km por la A-2 (5h 30 min). Con ConcertRide el precio por asiento es de 15–20 €, frente a los 50–100 € del AVE Atocha–Sants. Es habitual que asistentes de Madrid organicen el viaje redondo para el fin de semana de Primavera Sound y se alojen en Barcelona.",
      },
      {
        q: "¿Cómo volver del Parc del Fòrum de madrugada durante Primavera Sound?",
        a: "Durante el festival el metro L4 amplía su servicio hasta las 3:00–4:00. Fuera de ese refuerzo (o en noches de Cruïlla más cortas), los buses nocturnos N6 pasan cerca. Los VTC y taxis se saturan en los últimos turnos, con esperas de 30–50 minutos. Si viniste en carpooling con ConcertRide, el conductor coordina la vuelta contigo según el horario real del bolo.",
      },
      {
        q: "¿Cómo llegar al Parc del Fòrum desde Valencia?",
        a: "Valencia–Barcelona son 355 km por la AP-7 (3h 15 min). Con ConcertRide el precio por asiento es de 10–14 €, frente a los 20–40 € del Euromed Valencia–Sants + Metro. La ruta Valencia–Barcelona es una de las más frecuentes en ConcertRide durante Primavera Sound (junio) y Cruïlla (julio). El punto de recogida habitual es la zona de Bailèn o el aparcamiento de Gran Via con L4.",
      },
    ],
    relatedFestivals: ["primavera-sound", "cruilla"],
  },

  // ── MOVISTAR ARENA (MADRID) ──────────────────────────────────────────────────

  {
    slug: "movistar-arena",
    name: "Movistar Arena",
    quotableAnswer:
      "Movistar Arena es un recinto con capacidad para 16.291–20.000 personas en Madrid, dedicado a conciertos en formato arena y giras de gran formato. Está conectado con el centro de Madrid mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L5 Ventas. Las opciones para llegar son: (1) Metro L5 Ventas (5 min a pie) (1,50–2,50 €); (2) Autobús urbano Líneas 21, 53, 63, 106 (parada Ventas) (1,50–2 €); (3) Taxi/VTC al centro: 8–20 €. El carpooling desde Zaragoza, Valencia, Sevilla cuesta 9–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Movistar Arena",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    address: "Av. Felipe II s/n, 28009 Madrid",
    lat: 40.4321,
    lng: -3.6613,
    capacity: "16.291–20.000 personas",
    venueType: "Arena",
    transport: {
      metro: "L5 Ventas (5 min a pie) · L2 Goya (10 min a pie)",
      bus: "Líneas 21, 53, 63, 106 (parada Ventas) · Búho nocturno N6, N11",
    },
    blurb:
      "El Movistar Arena (antiguo WiZink Center) es el mayor recinto de espectáculos cubierto de Madrid, con capacidad para hasta 20.000 personas. Inaugurado en 1999 como Palacio de los Deportes, fue completamente renovado en 2015 y rebautizado como Movistar Arena en 2024 tras el nuevo acuerdo de patrocinio. Alberga las giras más importantes de artistas nacionales e internacionales: desde C. Tangana y Morat hasta Dua Lipa, Shakira o Rammstein. Con ConcertRide, los fans desde Valencia llegan al Movistar Arena por 10–14 €/asiento, desde Zaragoza por 9–13 €, sin comisión.",
    originCities: [
      { city: "Valencia", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Barcelona", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Sevilla", km: 535, drivingTime: "5h", concertRideRange: "14–19 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Movistar Arena en metro?",
        a: "El Movistar Arena está junto al estadio de Las Ventas. La parada más cercana es Ventas (Línea 5, 5 minutos a pie) o Goya (Línea 2, 10 minutos a pie). El metro de Madrid opera hasta las 1:30–2:00h los fines de semana, sin servicio de madrugada para la vuelta de conciertos tardíos.",
      },
      {
        q: "¿Tiene parking el Movistar Arena?",
        a: "Sí. Hay parkings públicos en los alrededores: Parking Sánchez Bustillo (~500 m), Parking Las Ventas y zona de aparcamiento regulado ORA en las calles próximas (~1,50 €/hora). Para conciertos multitudinarios se recomienda llegar en transporte público o carpooling.",
      },
      {
        q: "¿Cómo ir al Movistar Arena desde Valencia?",
        a: "Desde Valencia al Movistar Arena son aproximadamente 355 km (3h 20 min por la A-3). El AVE Valencia-Madrid cuesta 20–80 € más transporte interno. Con ConcertRide, el carpooling sale por 10–14 €/asiento con llegada directa a Las Ventas. Sin comisión.",
      },
      {
        q: "¿Cuándo se llama Movistar Arena y cuándo WiZink Center?",
        a: "El recinto se llamó WiZink Center de 2016 a 2024, y anteriormente Palacio de los Deportes de Madrid (1999–2015). Desde 2024 se llama Movistar Arena por el nuevo acuerdo de patrocinio con Movistar+. Es el mismo edificio en la misma dirección.",
      },
      {
        q: "¿A qué hora terminan los conciertos en el Movistar Arena?",
        a: "Los conciertos en el Movistar Arena suelen terminar entre las 22:30 y las 23:30. El metro (L5 Ventas) tiene último servicio hacia las 1:30h los fines de semana. Para grupos que vienen de otras provincias, el carpooling con ConcertRide se organiza con hora de vuelta acordada antes del evento.",
      },
    ],
    relatedFestivals: [],
  },

  // ── BIZKAIA ARENA / BEC (BARAKALDO) ─────────────────────────────────────────

  {
    slug: "bizkaia-arena-bec",
    name: "Bizkaia Arena – BEC",
    quotableAnswer:
      "Bizkaia Arena – BEC es un recinto con capacidad para 26.000 personas en Barakaldo, dedicado a conciertos en formato arena y giras de gran formato. Está conectado con el centro de Barakaldo mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L2 Ansio. Las opciones para llegar son: (1) Metro L2 Ansio (5 min a pie) — servicio frecuente desde Bilbao y San Sebastián (1,50–2,50 €); (2) Autobús urbano Bizkaibus A3247 desde Bilbao Termibus (1,50–2 €); (3) Taxi/VTC al centro: 8–20 €. El carpooling desde Vitoria, Donostia, Pamplona cuesta 3–16 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Bizkaia Arena",
    city: "Barakaldo",
    citySlug: "bilbao",
    region: "País Vasco",
    address: "Ronda de Azkue, 1, 48902 Barakaldo, Bizkaia",
    lat: 43.2965,
    lng: -2.9956,
    capacity: "26.000 personas",
    venueType: "Arena",
    transport: {
      metro: "L2 Ansio (5 min a pie) — servicio frecuente desde Bilbao y San Sebastián",
      bus: "Bizkaibus A3247 desde Bilbao Termibus",
    },
    blurb:
      "La Bizkaia Arena, integrada en el Bilbao Exhibition Centre (BEC), es el mayor pabellón cubierto de España, con capacidad para 26.000 personas. Ubicada en Barakaldo, en el área metropolitana de Bilbao, es accesible en metro (Línea 2, parada Ansio, directa). Alberga las giras más grandes que visitan el norte de España: Dua Lipa, Shakira, Rammstein, AC/DC, Beyoncé. Con ConcertRide, los fans desde Pamplona llegan a Bizkaia Arena por 5–8 €/asiento, desde Donostia por 4–7 €, sin comisión.",
    originCities: [
      { city: "Madrid", km: 395, drivingTime: "4h", concertRideRange: "11–16 €/asiento" },
      { city: "Pamplona", km: 90, drivingTime: "1h", concertRideRange: "5–8 €/asiento" },
      { city: "Donostia", km: 105, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Vitoria", km: 65, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Bizkaia Arena desde Bilbao en metro?",
        a: "El metro de Bilbao (Línea 2, Metro Bilbao) conecta el centro de Bilbao con Barakaldo directamente. La parada Ansio está a 5 minutos a pie de la Bizkaia Arena. Frecuencia de 5–10 minutos en hora punta. El último metro de madrugada sale hacia las 23:30 entre semana y 2:30 los fines de semana.",
      },
      {
        q: "¿Cómo ir a Bizkaia Arena desde San Sebastián?",
        a: "Donostia-San Sebastián está a 105 km de Barakaldo (1h 10 min por la AP-8). El metro Euskotren conecta San Sebastián con Bilbao (1h 15 min, 4–6 €) + metro L2 hasta Ansio. Con ConcertRide, el carpooling desde Donostia sale por 4–7 €/asiento con llegada directa al BEC.",
      },
      {
        q: "¿Cómo llegar a Bizkaia Arena desde Madrid?",
        a: "Madrid está a 395 km de la Bizkaia Arena (4h en coche por la A-1). Con ConcertRide, el carpooling sale por 11–16 €/asiento sin comisión. El AVE Madrid-Bilbao Abando cuesta 40–90 € + metro L2 hasta Ansio (~45 min más).",
      },
      {
        q: "¿Tiene parking Bizkaia Arena?",
        a: "Sí. El BEC tiene parking propio con 4.000 plazas (precio 3–5 €/h, máximo 21 €/día para eventos). Se llena rápido — se recomienda llegar con 90+ minutos de antelación o usar el metro L2 desde Bilbao.",
      },
      {
        q: "¿Es lo mismo Bizkaia Arena y BEC Bilbao?",
        a: "El BEC (Bilbao Exhibition Centre) es el complejo ferial de Barakaldo donde se integra la Bizkaia Arena. La Bizkaia Arena es el pabellón polivalente de 26.000 personas dentro del BEC para conciertos y eventos. A veces se usa indistintamente 'BEC Bilbao', 'Bizkaia Arena' o 'BEC Barakaldo' para referirse al mismo recinto.",
      },
    ],
    relatedFestivals: ["bbk-live", "bbk-music-legends"],
  },

  // ── ESTADIO DE MESTALLA (VALENCIA) ──────────────────────────────────────────

  {
    slug: "estadio-mestalla-valencia",
    name: "Estadio de Mestalla",
    quotableAnswer:
      "Estadio de Mestalla es un recinto con capacidad para 55.000 personas en Valencia, dedicado a grandes conciertos, festivales y eventos deportivos. Está conectado con el centro de Valencia mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L5 y L7 Aragón. Las opciones para llegar son: (1) Metro L5 y L7 Aragón (10 min a pie del estadio) (1,50–2,50 €); (2) Autobús urbano EMT Valencia líneas 10, 10A, 79 (parada Mestalla) (1,50–2 €); (3) Taxi/VTC al centro: 8–20 €. El carpooling desde Alicante, Zaragoza, Madrid cuesta 5–14 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Mestalla",
    city: "Valencia",
    citySlug: "valencia",
    region: "Comunitat Valenciana",
    address: "Av. de Suècia s/n, 46010 Valencia",
    lat: 39.4745,
    lng: -0.3583,
    capacity: "55.000 personas",
    venueType: "Estadio",
    transport: {
      metro: "L5 y L7 Aragón (10 min a pie del estadio)",
      bus: "EMT Valencia líneas 10, 10A, 79 (parada Mestalla)",
    },
    blurb:
      "El Estadio de Mestalla es el campo del Valencia CF y uno de los recintos más grandes de España para conciertos de macro-giras, con capacidad para hasta 55.000 personas. Ha albergado conciertos históricos de artistas como Ed Sheeran, Coldplay, U2, Bruce Springsteen y Taylor Swift. Está a 15 minutos del centro de Valencia, con acceso en metro (Líneas 5 y 7, parada Aragón). Con ConcertRide, los fans desde Alicante llegan al Mestalla por 5–8 €/asiento, desde Madrid por 10–14 €, sin comisión.",
    originCities: [
      { city: "Alicante", km: 175, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Madrid", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Barcelona", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 310, drivingTime: "2h 50 min", concertRideRange: "8–12 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Estadio de Mestalla en metro?",
        a: "El metro de Valencia (Metrovalencia) tiene parada Aragón en las Líneas 5 (Marítim–Torrent Avinguda) y 7 (Marítim–Aeroport). Desde la parada Aragón hay unos 10 minutos a pie hasta la puerta principal de Mestalla. El metro opera hasta las 00:00–00:30 los días de semana y hasta las 1:00 los fines de semana.",
      },
      {
        q: "¿Cómo ir a Mestalla desde Alicante?",
        a: "Alicante está a 175 km de Valencia (1h 45 min por la AP-7). El tren Cercanías Alicante-Valencia (1h 45 min, 8–15 €) llega a Valencia Nord y desde ahí metro L5 hasta Aragón. Con ConcertRide, el carpooling desde Alicante sale por 5–8 €/asiento con llegada directa al estadio. Sin comisión.",
      },
      {
        q: "¿Cómo ir a Mestalla desde Madrid?",
        a: "Madrid está a 355 km de Mestalla (3h 20 min por la A-3). El AVE Madrid-Valencia cuesta 20–80 €. Con ConcertRide, el carpooling sale por 10–14 €/asiento. La ventaja del carpooling para macro-conciertos: salida a la hora que quieras y vuelta sin depender del último tren (AVE Madrid-Valencia, último ~22:30).",
      },
      {
        q: "¿Tiene parking el Estadio de Mestalla?",
        a: "Hay parkings privados en los alrededores del estadio (Parking Mestalla, Interparking Aragón) a ~2–4 €/h. En días de macro-concierto, el aparcamiento se complica en un radio de 500 m — se recomienda aparcar en zonas más alejadas o usar el metro (parada Aragón, Línea 5/7).",
      },
      {
        q: "¿Qué conciertos se hacen en el Estadio de Mestalla?",
        a: "Mestalla acoge habitualmente las macro-giras que pasan por Valencia: Coldplay, Ed Sheeran, U2, Taylor Swift, Bruce Springsteen, Rolling Stones. Para giras de menor aforo en Valencia, el recinto habitual es el Pavelló de la Fuente de San Luis o el Roig Arena.",
      },
    ],
    relatedFestivals: [],
  },

  // ── LA ROMAREDA (ZARAGOZA) ────────────────────────────────────────────────────

  {
    slug: "estadio-la-romareda",
    name: "Estadio de La Romareda",
    quotableAnswer:
      "Estadio de La Romareda es un recinto con capacidad para 34.500 personas en Zaragoza, dedicado a grandes conciertos, festivales y eventos deportivos. Está conectado con el centro de Zaragoza mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro Tranvía línea 1 — parada Romareda. Las opciones para llegar son: (1) Metro Tranvía línea 1 — parada Romareda (frente al estadio) (1,50–2,50 €); (2) Autobús urbano Líneas 23, 30, 38 y 44 de Avanza Zaragoza (1,50–2 €); (3) Vehículo propio: Parking Romareda (sótano del estadio, 8–15 € evento). El carpooling desde Huesca, Pamplona, Logroño cuesta 3–13 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "La Romareda",
    city: "Zaragoza",
    citySlug: "zaragoza",
    region: "Aragón",
    address: "Av. de Isabel la Católica, 4, 50009 Zaragoza",
    lat: 41.6560,
    lng: -0.9054,
    capacity: "34.500 personas",
    venueType: "Estadio",
    transport: {
      metro: "Tranvía línea 1 — parada Romareda (frente al estadio)",
      bus: "Líneas 23, 30, 38 y 44 de Avanza Zaragoza",
      parking: "Parking Romareda (sótano del estadio, 8–15 € evento) · Aparcamientos en Av. de Goya",
    },
    blurb:
      "El Estadio de La Romareda es el estadio municipal de Zaragoza, con capacidad para 34.500 personas tras su última reforma. Acoge los grandes conciertos de estadio que visitan Zaragoza: Coldplay, Metallica, Rolling Stones, Bruce Springsteen. Está en el barrio homónimo, con acceso directo en tranvía (línea 1, parada Romareda). Para fans que vienen de Madrid, Barcelona, Valencia o Bilbao, ConcertRide ofrece carpooling directo con llegada a pie del estadio.",
    originCities: [
      { city: "Madrid", km: 325, drivingTime: "2h 45 min", concertRideRange: "9–13 €/asiento" },
      { city: "Barcelona", km: 306, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Valencia", km: 330, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Bilbao", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Pamplona", km: 175, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Logroño", km: 180, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Huesca", km: 72, drivingTime: "50 min", concertRideRange: "3–5 €/asiento" },
      { city: "Teruel", km: 170, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al estadio de La Romareda?",
        a: "El Estadio de La Romareda está en el barrio Romareda de Zaragoza. El acceso más cómodo es el tranvía línea 1 (parada Romareda, frente al estadio). En autobús: líneas 23, 30, 38 y 44. Parking propio disponible en días de evento (8–15 €). Para fans de Madrid, Barcelona o Valencia, ConcertRide ofrece carpooling directo hasta Zaragoza por 8–13 €/asiento.",
      },
      {
        q: "¿Qué conciertos se celebran en La Romareda de Zaragoza?",
        a: "La Romareda acoge los grandes tours de estadio que pasan por Zaragoza: Coldplay, Metallica, Rolling Stones, Bruce Springsteen, U2, AC/DC. Para eventos de menor aforo en Zaragoza, el recinto habitual es el Pabellón Príncipe Felipe (11.000 plazas) o el Espacio Expo (30.000 al aire libre).",
      },
      {
        q: "¿Cómo ir a La Romareda desde Madrid?",
        a: "Madrid–Zaragoza son 325 km (2h 45 min por la A-2). El AVE cuesta 15–55 € y tarda 1h 15 min, llegando a la estación Delicias (a 3 km del estadio, bus o taxi). Con ConcertRide, el carpooling sale por 9–13 €/asiento con llegada directa al estadio. Para grupos de 3–4 personas, el carpooling es más económico que cualquier otra opción.",
      },
      {
        q: "¿Hay parking en La Romareda?",
        a: "Sí. La Romareda tiene parking propio bajo el estadio con tarifa de 8–15 € en días de evento. También hay aparcamiento en las calles de Av. de Goya y entorno del parque Romareda. En eventos masivos se llenan pronto — se recomienda el tranvía desde el centro (10 min) o el carpooling con recogida en zona de aparcamiento.",
      },
      {
        q: "¿Cómo ir a La Romareda desde Barcelona?",
        a: "Barcelona–Zaragoza son 306 km (2h 45 min por la AP-2). El AVE cuesta 12–45 € y llega a la estación Delicias. Con ConcertRide, el carpooling desde Barcelona sale por 8–12 €/asiento. Los fans barceloneses suelen organizar viaje de ida y vuelta el mismo día para conciertos en La Romareda.",
      },
    ],
    relatedFestivals: ["dcode-festival"],
  },

  // ── ESTADIO DE GRAN CANARIA (LAS PALMAS) ──────────────────────────────────────

  {
    slug: "estadio-gran-canaria",
    name: "Estadio de Gran Canaria",
    quotableAnswer:
      "Estadio de Gran Canaria es un recinto con capacidad para 32.000 personas en Las Palmas de Gran Canaria, dedicado a grandes conciertos, festivales y eventos deportivos. Está a 5–15 km del centro de Las Palmas de Gran Canaria, accesible en autobús urbano o taxi (15–30 minutos), y la estación de transporte público más cercana es bus urbano Guagua. Las opciones para llegar son: (1) Autobús urbano Guagua (autobús Global) líneas 12, 13, 25 — parada Estadio Gran Canaria (15 min desde el centro) (1,50–2 €); (2) Vehículo propio: Parking municipal Estadio Gran Canaria (6–12 € evento); (3) Taxi/VTC al centro: 8–20 €. El carpooling desde Maspalomas, Playa del Inglés, Telde cuesta 3–7 €/asiento. Para volver de madrugada, la opción más utilizada es el carpooling con ConcertRide, que coordina la vuelta con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Estadio Gran Canaria",
    city: "Las Palmas de Gran Canaria",
    citySlug: "las-palmas-de-gran-canaria",
    region: "Canarias",
    address: "Av. Julio Luengo, s/n, 35019 Las Palmas de Gran Canaria",
    lat: 28.0997,
    lng: -15.4583,
    capacity: "32.000 personas",
    venueType: "Estadio",
    transport: {
      bus: "Guagua (autobús Global) líneas 12, 13, 25 — parada Estadio Gran Canaria (15 min desde el centro)",
      parking: "Parking municipal Estadio Gran Canaria (6–12 € evento) · Zona aparcamiento rotatorio en Av. Julio Luengo",
    },
    blurb:
      "El Estadio de Gran Canaria es el mayor recinto de conciertos de las Islas Canarias, con capacidad para 32.000 personas. Situado en el barrio de La Minilla (Las Palmas), acoge giras de artistas que incluyen España en su tour y grandes eventos insulares como el Granca Live Fest. Desde el sur de la isla (Maspalomas, Playa del Inglés), los residentes locales usan ConcertRide para el trayecto de 55 km hasta el estadio (3–6 €/asiento).",
    originCities: [
      { city: "Maspalomas", km: 55, drivingTime: "45 min", concertRideRange: "3–6 €/asiento" },
      { city: "Playa del Inglés", km: 50, drivingTime: "40 min", concertRideRange: "3–5 €/asiento" },
      { city: "Puerto Rico de Gran Canaria", km: 65, drivingTime: "55 min", concertRideRange: "4–7 €/asiento" },
      { city: "Telde", km: 20, drivingTime: "20 min", concertRideRange: "3–4 €/asiento" },
      { city: "Ingenio", km: 30, drivingTime: "25 min", concertRideRange: "3–5 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Estadio de Gran Canaria?",
        a: "El Estadio de Gran Canaria está en el barrio de La Minilla (Las Palmas). Acceso en guagua (bus Global): líneas 12, 13 y 25, parada Estadio Gran Canaria (15 min desde el centro de Las Palmas). Parking propio disponible. Desde el aeropuerto de Gran Canaria (LPA, 20 km), guagua Global línea 66 hasta el centro y transbordo, o taxi directo (20–25 €).",
      },
      {
        q: "¿Cómo ir al Estadio Gran Canaria desde el sur de la isla?",
        a: "Desde Maspalomas y Playa del Inglés, el Estadio Gran Canaria está a 50–55 km (40–45 min por la GC-1). La guagua Global línea 30 conecta el sur con Las Palmas (1h 15 min, 4€). Con ConcertRide, el carpooling entre residentes canarios sale por 3–6 €/asiento, con vuelta de madrugada acordada con el conductor.",
      },
      {
        q: "¿Qué conciertos hay en el Estadio Gran Canaria?",
        a: "El Estadio Gran Canaria acoge grandes giras que incluyen las Islas Canarias: Alejandro Sanz, Melendi, Pablo López, Dani Martín, Rozalén, Dua Lipa, y artistas latinoamericanos. También es sede del Granca Live Fest (julio). Para eventos en Las Palmas, consultar la agenda en concertride.me/concerts.",
      },
      {
        q: "¿Hay parking en el Estadio Gran Canaria?",
        a: "Sí. El Estadio Gran Canaria tiene parking municipal propio con tarifa de 6–12 € en días de evento. También hay aparcamiento en la Avenida Julio Luengo. Para asistentes del sur de la isla, la opción más cómoda es el carpooling con ConcertRide para evitar el tráfico y el parking.",
      },
    ],
    relatedFestivals: ["granca-live-fest"],
  },

  // ── ESTADIO LA ROSALEDA (MÁLAGA) ─────────────────────────────────────────────

  {
    slug: "estadio-la-rosaleda",
    name: "Estadio La Rosaleda",
    quotableAnswer:
      "Estadio La Rosaleda es un recinto con capacidad para 30.044 personas en Málaga, dedicado a grandes conciertos, festivales y eventos deportivos. Está conectado con el centro de Málaga mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro Metro de Málaga línea 2 — parada Guadalmedina. Las opciones para llegar son: (1) Metro Metro de Málaga línea 2 — parada Guadalmedina (5 min a pie) (1,50–2,50 €); (2) Autobús urbano EMT Málaga: líneas 11, 14, 36 — parada Estadio (1,50–2 €); (3) Vehículo propio: Parking Salamanca (300 m, 10–15 € evento). El carpooling desde Granada, Córdoba, Jaén cuesta 4–22 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "La Rosaleda",
    city: "Málaga",
    citySlug: "malaga",
    region: "Andalucía",
    address: "Av. de Cánovas del Castillo, 5, 29012 Málaga",
    lat: 36.7231,
    lng: -4.4408,
    capacity: "30.044 personas",
    venueType: "Estadio",
    transport: {
      metro: "Metro de Málaga línea 2 — parada Guadalmedina (5 min a pie)",
      bus: "EMT Málaga: líneas 11, 14, 36 — parada Estadio",
      parking: "Parking Salamanca (300 m, 10–15 € evento) · Aparcamiento Av. Cánovas del Castillo",
    },
    blurb:
      "El Estadio La Rosaleda es el principal estadio de Málaga capital, con capacidad para 30.044 personas. Además de los partidos del Málaga CF, acoge las grandes giras de artistas internacionales y nacionales que pasan por la Costa del Sol. Tiene acceso en metro (L2, parada Guadalmedina). Para fans de Sevilla (200 km), Granada (130 km) o Madrid (535 km), ConcertRide organiza carpooling directo al estadio.",
    originCities: [
      { city: "Sevilla", km: 200, drivingTime: "2h", concertRideRange: "6–10 €/asiento" },
      { city: "Granada", km: 130, drivingTime: "1h 30 min", concertRideRange: "4–7 €/asiento" },
      { city: "Córdoba", km: 185, drivingTime: "2h", concertRideRange: "5–9 €/asiento" },
      { city: "Madrid", km: 535, drivingTime: "4h 30 min", concertRideRange: "13–18 €/asiento" },
      { city: "Valencia", km: 640, drivingTime: "5h 30 min", concertRideRange: "16–22 €/asiento" },
      { city: "Almería", km: 210, drivingTime: "2h", concertRideRange: "6–10 €/asiento" },
      { city: "Alicante", km: 390, drivingTime: "3h 30 min", concertRideRange: "10–15 €/asiento" },
      { city: "Jaén", km: 190, drivingTime: "2h", concertRideRange: "5–9 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Estadio La Rosaleda de Málaga?",
        a: "El Estadio La Rosaleda está en el centro de Málaga, junto al río Guadalmedina. Acceso en metro: línea 2, parada Guadalmedina (5 min a pie). También autobuses EMT líneas 11, 14 y 36. Desde el aeropuerto de Málaga (AGP), el metro L2 llega directamente a Guadalmedina (25 min, 1,80 €). Parking en Av. Cánovas del Castillo.",
      },
      {
        q: "¿Qué conciertos hay en La Rosaleda de Málaga?",
        a: "La Rosaleda acoge las grandes giras que incluyen Málaga: Coldplay, Metallica, Guns N' Roses, C. Tangana, Alejandro Sanz, Melendi, Rozalén, Dani Martín. Para conciertos de menor aforo en Málaga, el recinto habitual es el Palacio de los Deportes José María Martín Carpena (11.000 plazas).",
      },
      {
        q: "¿Cómo ir a La Rosaleda desde Sevilla?",
        a: "Sevilla–Málaga son 200 km (2 horas por la A-92 o A-45). ConcertRide ofrece carpooling por 6–10 €/asiento. El AVE Sevilla–Málaga cuesta 15–40 € y tarda 1h 55 min con llegada a Málaga María Zambrano (10 min en metro hasta Guadalmedina). El carpooling es más cómodo para grupos de 3–4.",
      },
      {
        q: "¿Cómo ir a La Rosaleda desde Granada?",
        a: "Granada–Málaga son 130 km (1h 30 min por la A-44/A-45). ConcertRide ofrece carpooling por 4–7 €/asiento. El tren Granada–Málaga no existe directamente — hay que hacer transbordo en Antequera (1h 45 min total, ~15 €). El carpooling es claramente la opción más rápida y económica.",
      },
      {
        q: "¿Hay parking en La Rosaleda?",
        a: "El estadio tiene zona de aparcamiento limitada en Av. Cánovas del Castillo. El parking Salamanca (300 m, 10–15 € evento) es el más cercano. Para conciertos masivos se recomienda metro L2 o dejar el coche en el parking de María Zambrano (1h gratuita con validación) y tomar el metro hasta Guadalmedina (2 min).",
      },
    ],
    relatedFestivals: ["marenostrum-festival"],
  },

  // ── RCDE STADIUM (CORNELLÀ, BARCELONA) ───────────────────────────────────────

  {
    slug: "rcde-stadium",
    name: "RCDE Stadium",
    quotableAnswer:
      "RCDE Stadium es un recinto con capacidad para 40.500 personas en Cornellà de Llobregat, dedicado a grandes conciertos, festivales y eventos deportivos. Está conectado con el centro de Cornellà de Llobregat mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro Metro L5 — parada Cornellà Centre. Las opciones para llegar son: (1) Metro Metro L5 — parada Cornellà Centre (10 min a pie) (1,50–2,50 €); (2) Autobús urbano TMB líneas 79, L63 (1,50–2 €); (3) Vehículo propio: Parking propio estadio (10–15 € evento). El carpooling desde Tarragona, Girona, Lleida cuesta 4–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "RCDE Stadium",
    city: "Cornellà de Llobregat",
    citySlug: "barcelona",
    region: "Cataluña",
    address: "Av. del Baix Llobregat, s/n, 08940 Cornellà de Llobregat",
    lat: 41.3451,
    lng: 2.0748,
    capacity: "40.500 personas",
    venueType: "Estadio",
    transport: {
      metro: "Metro L5 — parada Cornellà Centre (10 min a pie) · FGC L8/L9 — Cornellà Riera",
      bus: "TMB líneas 79, L63 · Bus nocturno N18",
      parking: "Parking propio estadio (10–15 € evento) · Parking Sant Ildefons",
    },
    blurb:
      "El RCDE Stadium (estadio del RCD Espanyol) en Cornellà de Llobregat es el segundo estadio de fútbol de la ciudad de Barcelona y uno de los principales recintos de conciertos de gran formato en el área metropolitana. Con 40.500 plazas, acoge giras que Coldplay, U2 o Taylor Swift también llevan al Estadi Olímpic o al Palau Sant Jordi. Está muy bien comunicado por metro (L5) y FGC. ConcertRide cubre carpooling desde Madrid (15–20 €), Zaragoza (8–12 €), Valencia (10–14 €) y otras ciudades.",
    originCities: [
      { city: "Madrid", km: 615, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Zaragoza", km: 306, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Tarragona", km: 90, drivingTime: "1h", concertRideRange: "4–7 €/asiento" },
      { city: "Lleida", km: 170, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Girona", km: 100, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Pamplona", km: 415, drivingTime: "3h 45 min", concertRideRange: "12–17 €/asiento" },
      { city: "Bilbao", km: 615, drivingTime: "5h", concertRideRange: "15–20 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al RCDE Stadium en transporte público?",
        a: "El RCDE Stadium está en Cornellà de Llobregat. Acceso más cómodo: Metro L5 (parada Cornellà Centre, 10 min a pie) o FGC línea L8/L9 (parada Cornellà Riera). Desde el centro de Barcelona (Plaza España), el metro L5 tarda 12 minutos. El bus nocturno N18 cubre la vuelta de madrugada. Para fans de fuera de Barcelona, ConcertRide deja directamente en las inmediaciones del estadio.",
      },
      {
        q: "¿Qué conciertos hay en el RCDE Stadium?",
        a: "El RCDE Stadium acoge grandes giras de estadio en Barcelona cuando no están disponibles el Estadi Olímpic o el Spotify Camp Nou: Coldplay, U2, Taylor Swift, Metallica, AC/DC, Rolling Stones, Guns N' Roses. Comparte el rol de segundo estadio de conciertos de Barcelona con el Estadi Olímpic Lluís Companys.",
      },
      {
        q: "¿Cómo ir al RCDE Stadium desde Madrid?",
        a: "Madrid–Cornellà de Llobregat son 615 km (5h 30 min por la AP-2). El AVE Madrid–Barcelona Sants cuesta 30–100 € + metro L5 hasta Cornellà (15 min). Con ConcertRide, el carpooling sale por 15–20 €/asiento con llegada directa al estadio. Para grupos, el carpooling es significativamente más barato.",
      },
      {
        q: "¿Cómo ir al RCDE Stadium desde Zaragoza?",
        a: "Zaragoza–Cornellà de Llobregat son 306 km (2h 45 min por la AP-2). ConcertRide ofrece carpooling por 8–12 €/asiento. Es una de las rutas más populares para fans zaragozanos que asisten a conciertos en el área de Barcelona.",
      },
      {
        q: "¿Hay parking en el RCDE Stadium?",
        a: "Sí. El RCDE Stadium tiene parking propio con tarifa de 10–15 € en días de evento. También disponible el parking de Sant Ildefons (500 m). Para grandes conciertos, se recomienda el metro L5 o FGC para evitar la congestión de salida.",
      },
    ],
    relatedFestivals: ["primavera-sound", "cruilla"],
  },

  // ── SALA LA RIVIERA (MADRID) ─────────────────────────────────────────────────

  {
    slug: "la-riviera",
    name: "Sala La Riviera",
    quotableAnswer:
      "Sala La Riviera es un recinto con capacidad para 2.500 personas en Madrid, dedicado a conciertos y eventos multidisciplinares. Está conectado con el centro de Madrid mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L6/L10/R Príncipe Pío. Las opciones para llegar son: (1) Metro L6/L10/R Príncipe Pío (8 min a pie) (1,50–2,50 €); (2) Autobús urbano Líneas 41, 46, 75, 138 (1,50–2 €); (3) Vehículo propio: Parking Príncipe Pío (3–5 €/h). El carpooling desde Getafe, Toledo, Zaragoza cuesta 3–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "La Riviera",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    address: "Paseo Bajo de la Virgen del Puerto, s/n, 28005 Madrid",
    lat: 40.4117,
    lng: -3.7245,
    capacity: "2.500 personas",
    venueType: "Sala de conciertos",
    transport: {
      metro: "L6/L10/R Príncipe Pío (8 min a pie)",
      bus: "Líneas 41, 46, 75, 138",
      parking: "Parking Príncipe Pío (3–5 €/h) · zona azul limitada",
    },
    blurb:
      "Sala La Riviera es una histórica sala de conciertos junto al Madrid Río y al Palacio Real, con capacidad para unas 2.500 personas en configuración de concierto. Acoge giras de rock, indie, electrónica y pop nacional/internacional, además de eventos especiales al aire libre. La parada más cercana es Príncipe Pío (L6/L10/Cercanías), a 8 min andando por el Paseo Bajo de la Virgen del Puerto. Para asistentes de fuera de Madrid, el carpooling con ConcertRide es la opción más usada al ser una sala céntrica con parking limitado.",
    originCities: [
      { city: "Toledo", km: 75, drivingTime: "55 min", concertRideRange: "4–6 €/asiento" },
      { city: "Getafe", km: 18, drivingTime: "25 min", concertRideRange: "3–5 €/asiento" },
      { city: "Valencia", km: 357, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Barcelona", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a La Riviera en metro?",
        a: "La parada más cercana es Príncipe Pío (líneas 6 y 10 de metro, además de Cercanías Renfe), a unos 8 minutos andando por el Paseo Bajo de la Virgen del Puerto. Desde Sol son 12 minutos en metro (Sol → Ópera → Príncipe Pío con transbordo). También paran los autobuses 41, 46, 75 y 138 cerca del recinto.",
      },
      {
        q: "¿Hay parking cerca de La Riviera?",
        a: "El parking más práctico es el de la estación de Príncipe Pío (3–5 €/hora). Hay también zona azul limitada en el Paseo de la Virgen del Puerto, pero se llena con rapidez en noches de concierto. Si vienes de fuera de Madrid, el carpooling con ConcertRide te ahorra el problema del parking.",
      },
      {
        q: "¿Cómo volver de La Riviera de madrugada?",
        a: "El metro cierra a la 1:30 (fines de semana hasta las 2:00). Para vueltas posteriores: bus nocturno N16/N18 desde la cercana Glorieta San Vicente, taxi/VTC a Sol (8–12 €) o carpooling con ConcertRide coordinado de antemano, que se ajusta al horario real del concierto.",
      },
      {
        q: "¿Qué tipo de conciertos hay en La Riviera?",
        a: "La Riviera acoge giras de rock, indie, electrónica, pop nacional e internacional y eventos puntuales al aire libre. Es una sala de aforo medio (2.500 personas) muy demandada por bandas en formato sala (no estadio). Consulta la agenda oficial en salariviera.com.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Valencia a La Riviera?",
        a: "Valencia–Madrid son 357 km por la A-3 (3h 20 min). Con ConcertRide el precio medio por asiento es de 10–14 €, frente a 30–60 € del AVE o 90–130 € del taxi. El conductor fija el precio para cubrir combustible y peajes según la tarifa MITECO. Sin comisión, pago directo Bizum o efectivo.",
      },
    ],
    relatedFestivals: ["mad-cool", "tomavistas"],
  },

  // ── SALA APOLO (BARCELONA) ───────────────────────────────────────────────────

  {
    slug: "sala-apolo",
    name: "Sala Apolo",
    quotableAnswer:
      "Sala Apolo es un recinto con capacidad para 1.800 personas en Barcelona, dedicado a conciertos y eventos multidisciplinares. Está conectado con el centro de Barcelona mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L3 Paral. Las opciones para llegar son: (1) Metro L3 Paral (1,50–2,50 €); (2) Autobús urbano Líneas 21, 121, V11 (1,50–2 €); (3) Vehículo propio: Sin parking propio — parking BSM Paral. El carpooling desde Tarragona, Girona, Lleida cuesta 4–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Apolo",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    address: "Carrer Nou de la Rambla, 113, 08004 Barcelona",
    lat: 41.3727,
    lng: 2.1668,
    capacity: "1.800 personas",
    venueType: "Sala de conciertos",
    transport: {
      metro: "L3 Paral·lel (2 min a pie)",
      bus: "Líneas 21, 121, V11 · Bus nocturno N0, N6",
      parking: "Sin parking propio — parking BSM Paral·lel (3 €/h)",
    },
    blurb:
      "Sala Apolo es una de las salas de conciertos más emblemáticas de Barcelona, ubicada en el barrio de Poble-sec junto a la Avenida del Paral·lel. Con un aforo aproximado de 1.800 personas en formato concierto, programa rock, indie, electrónica (los míticos Nasty Mondays/Crappy Tuesdays) y giras internacionales en sala. Acceso directo en metro L3 (Paral·lel, 2 min a pie). Para asistentes de fuera de Barcelona, el carpooling con ConcertRide es la alternativa habitual al AVE.",
    originCities: [
      { city: "Tarragona", km: 100, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Girona", km: 100, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Lleida", km: 165, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 305, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Sala Apolo en metro?",
        a: "La parada más cercana es Paral·lel (L3 verde y L2 lila), a 2 minutos andando. Desde Plaça Catalunya son 8 minutos en metro (L3 directo). También paran los autobuses 21, 121 y V11 muy cerca del recinto. El bus nocturno N0 y N6 cubren la vuelta de madrugada hacia Plaça Catalunya.",
      },
      {
        q: "¿Cómo volver de Sala Apolo de madrugada?",
        a: "El metro de Barcelona cierra a las 2:00 los viernes y opera 24h los sábados (madrugada del sábado al domingo). Para conciertos entre semana, los buses nocturnos N0 y N6 cubren la vuelta a Plaça Catalunya. Taxi/VTC al centro: 8–12 €. Para asistentes de fuera de Barcelona, el carpooling con ConcertRide se coordina con el horario real del fin de concierto.",
      },
      {
        q: "¿Hay parking cerca de Sala Apolo?",
        a: "Sala Apolo no tiene parking propio. El más práctico es el BSM Paral·lel (3 €/h aproximadamente) o aparcamientos privados de Avinguda del Paral·lel. En noches de concierto se saturan rápido. Si vienes de fuera de Barcelona, el carpooling con ConcertRide es la opción más cómoda.",
      },
      {
        q: "¿Qué eventos icónicos tiene Apolo?",
        a: "Apolo es famosa por sus sesiones Nasty Mondays y Crappy Tuesdays (clubbing nocturno), además de programar giras internacionales de indie/rock/electrónica y festivales internos (Apolo Festival, Caprices Festival). Consulta agenda en sala-apolo.com.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Madrid a Sala Apolo?",
        a: "Madrid–Barcelona son 620 km por la AP-2/A-2 (5h 30 min). Con ConcertRide el precio medio por asiento es de 15–20 €, frente a 30–100 € del AVE o 120–180 € de un coche de alquiler. Sin comisión, pago directo Bizum o efectivo, vuelta nocturna coordinada con el conductor.",
      },
    ],
    relatedFestivals: ["primavera-sound", "sonar"],
  },

  // ── RAZZMATAZZ (BARCELONA) ───────────────────────────────────────────────────

  {
    slug: "razzmatazz",
    name: "Razzmatazz",
    quotableAnswer:
      "Razzmatazz es un recinto con capacidad para 2.500 personas (5 salas) en Barcelona, dedicado a conciertos y eventos multidisciplinares. Está conectado con el centro de Barcelona mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L1 Marina o Glòries. Las opciones para llegar son: (1) Metro L1 Marina o Glòries (8–10 min a pie) (1,50–2,50 €); (2) Autobús urbano Líneas 6, 7, 92, V21 (1,50–2 €); (3) Vehículo propio: Parking SABA Bolívia (3–4 €/h). El carpooling desde Tarragona, Girona, Lleida cuesta 4–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Razzmatazz",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    address: "Carrer dels Almogàvers, 122, 08018 Barcelona",
    lat: 41.3979,
    lng: 2.1937,
    capacity: "2.500 personas (5 salas)",
    venueType: "Sala de conciertos",
    transport: {
      metro: "L1 Marina o Glòries (8–10 min a pie) · L4 Bogatell (10 min)",
      bus: "Líneas 6, 7, 92, V21 · Bus nocturno N7, N8",
      parking: "Parking SABA Bolívia (3–4 €/h) · BSM Marina",
    },
    blurb:
      "Razzmatazz es la sala de conciertos más grande de Barcelona en formato no-arena, situada en el Poblenou con cinco salas independientes (Razz 1 a Razz 5) y un aforo total de unas 2.500 personas en noches de concierto. Programa rock, indie, electrónica internacional y discoteca nocturna fin de semana. Las paradas más cercanas son Marina (L1) y Bogatell (L4), a 8–10 minutos andando. Carpooling con ConcertRide desde Madrid, Valencia, Zaragoza y Tarragona.",
    originCities: [
      { city: "Tarragona", km: 100, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Girona", km: 100, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Lleida", km: 165, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 305, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Razzmatazz en metro?",
        a: "Las paradas más cercanas son Marina (L1 roja, 8 min a pie) y Glòries (L1, 10 min). La línea L4 (amarilla) en Bogatell también deja a 10 min. Desde Plaça Catalunya son 12 minutos en metro hasta Marina. Los autobuses 6, 7, 92 y V21 paran cerca del recinto.",
      },
      {
        q: "¿Hay parking cerca de Razzmatazz?",
        a: "Hay parkings privados en la zona: SABA Bolívia y BSM Marina (3–4 €/h). Es zona azul y verde, complicada en horario diurno y muy saturada en noches de concierto. Para asistentes de fuera de Barcelona el carpooling con ConcertRide deja en el Paseo Marítimo a 8 min del recinto.",
      },
      {
        q: "¿Cómo volver de Razzmatazz de madrugada?",
        a: "El metro de Barcelona opera 24 horas las noches de sábado a domingo. Viernes hasta las 2:00. Para otras noches: bus nocturno N7 y N8 cubren la vuelta a Plaça Catalunya. Taxi/VTC al centro: 10–15 €. Carpooling con ConcertRide se ajusta al horario real del fin de concierto.",
      },
      {
        q: "¿Cuántas salas tiene Razzmatazz?",
        a: "Razzmatazz tiene 5 salas independientes (Razz 1, Razz 2, Lolita, Pop Bar y Loft), cada una con programación propia: Razz 1 (aforo 1.300, indie/rock), Razz 2 (electrónica), Lolita (rock alternativo), Pop Bar (pop) y Loft (techno). El aforo total en noches de fin de semana ronda las 2.500 personas.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Valencia a Razzmatazz?",
        a: "Valencia–Barcelona son 355 km por la AP-7 (3h 15 min). Con ConcertRide el precio medio por asiento es de 10–14 €, frente a 30–60 € del Euromed o 90–130 € del taxi. Sin comisión, pago directo Bizum o efectivo.",
      },
    ],
    relatedFestivals: ["primavera-sound", "sonar", "cruilla"],
  },

  // ── SANT JORDI CLUB (BARCELONA) ──────────────────────────────────────────────

  {
    slug: "sant-jordi-club",
    name: "Sant Jordi Club",
    quotableAnswer:
      "Sant Jordi Club es un recinto con capacidad para 4.500 personas en Barcelona, dedicado a conciertos y eventos multidisciplinares. Está conectado con el centro de Barcelona mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L1/L3 Espanya + escaleras mecánicas Montjuïc. Las opciones para llegar son: (1) Metro L1/L3 Espanya + escaleras mecánicas Montjuïc (15 min) (1,50–2,50 €); (2) Autobús urbano Líneas 13, 23, 150 (Montjuïc) (1,50–2 €); (3) Vehículo propio: Parking Anella Olímpica (4 €/h). El carpooling desde Tarragona, Girona, Lleida cuesta 4–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Sant Jordi Club",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    address: "Passeig Olímpic, 5–7, 08038 Barcelona",
    lat: 41.3651,
    lng: 2.1551,
    capacity: "4.500 personas",
    venueType: "Sala de conciertos",
    transport: {
      metro: "L1/L3 Espanya + escaleras mecánicas Montjuïc (15 min)",
      bus: "Líneas 13, 23, 150 (Montjuïc)",
      parking: "Parking Anella Olímpica (4 €/h)",
    },
    blurb:
      "El Sant Jordi Club es la sala anexa al Palau Sant Jordi en Montjuïc, con capacidad para unas 4.500 personas en configuración de concierto. Comparte ubicación con el Palau Sant Jordi pero acoge giras de aforo medio (artistas que no llenan los 17.000 del Palau). Acceso vía metro L1/L3 Plaça Espanya + escaleras mecánicas hasta la Anella Olímpica (15 min). El bus 150 sube directamente. Carpooling con ConcertRide para asistentes de Madrid, Valencia, Tarragona y Zaragoza.",
    originCities: [
      { city: "Tarragona", km: 100, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Lleida", km: 165, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Girona", km: 100, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 305, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Es lo mismo el Sant Jordi Club que el Palau Sant Jordi?",
        a: "No, son recintos contiguos pero distintos. El Palau Sant Jordi tiene aforo 17.000 (grandes giras como Rosalía, Karol G, Bad Bunny). El Sant Jordi Club, anexo al Palau, tiene capacidad para 4.500 personas y acoge giras de aforo medio (artistas en sala grande, no estadio). Comparten la dirección y el acceso a Montjuïc.",
      },
      {
        q: "¿Cómo llegar al Sant Jordi Club en transporte público?",
        a: "Metro L1 (roja) o L3 (verde) hasta Plaça Espanya, después escaleras mecánicas de Montjuïc (15 min subiendo) o bus 150 directo a la Anella Olímpica. El funicular de Montjuïc desde Paral·lel (L2/L3) también es una opción.",
      },
      {
        q: "¿Hay parking en el Sant Jordi Club?",
        a: "Sí. El Parking de la Anella Olímpica está al lado del Sant Jordi Club, con tarifa de 4 €/hora aproximadamente. En noches de concierto se llena rápido. Si vienes de fuera de Barcelona, el carpooling con ConcertRide te ahorra el aparcamiento.",
      },
      {
        q: "¿Cómo volver del Sant Jordi Club de madrugada?",
        a: "El metro de Barcelona cierra a las 2:00 los viernes y opera 24h los sábados (madrugada del sábado al domingo). Bus nocturno N0 baja desde Montjuïc hacia Plaça Catalunya. Taxi/VTC al centro: 10–15 €. ConcertRide se coordina con el horario real del fin de concierto.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Madrid al Sant Jordi Club?",
        a: "Madrid–Barcelona son 620 km por la AP-2/A-2 (5h 30 min). Con ConcertRide el precio por asiento es de 15–20 €, frente a 30–100 € del AVE. Sin comisión, vuelta nocturna coordinada.",
      },
    ],
    relatedFestivals: ["primavera-sound", "cruilla"],
  },

  // ── SALA BIKINI (BARCELONA) ──────────────────────────────────────────────────

  {
    slug: "sala-bikini",
    name: "Sala Bikini",
    quotableAnswer:
      "Sala Bikini es un recinto con capacidad para 1.500 personas en Barcelona, dedicado a conciertos y eventos multidisciplinares. Está conectado con el centro de Barcelona mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L3 Maria Cristina o Les Corts. Las opciones para llegar son: (1) Metro L3 Maria Cristina o Les Corts (5–7 min a pie) (1,50–2,50 €); (2) Autobús urbano Líneas 6, 7, 33, 34, 54, 59, 66, 67, 78, H6, H8 (1,50–2 €); (3) Vehículo propio: Parking L'Illa Diagonal (3 €/h, mismo edificio). El carpooling desde Tarragona, Girona, Lleida cuesta 4–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Bikini",
    city: "Barcelona",
    citySlug: "barcelona",
    region: "Cataluña",
    address: "Av. Diagonal, 547, 08029 Barcelona",
    lat: 41.3897,
    lng: 2.1357,
    capacity: "1.500 personas",
    venueType: "Sala de conciertos",
    transport: {
      metro: "L3 Maria Cristina o Les Corts (5–7 min a pie)",
      bus: "Líneas 6, 7, 33, 34, 54, 59, 66, 67, 78, H6, H8",
      parking: "Parking L'Illa Diagonal (3 €/h, mismo edificio)",
    },
    blurb:
      "Sala Bikini es una histórica sala de conciertos de Barcelona ubicada en el centro comercial L'Illa Diagonal, con capacidad para unas 1.500 personas. Activa desde los años 50 (en su ubicación actual desde 1995), programa rock, indie, pop y jazz internacional y nacional. La parada más cercana es Maria Cristina (L3, 5 min a pie). El parking del propio L'Illa Diagonal es la opción más práctica. Carpooling con ConcertRide para asistentes de fuera de Barcelona.",
    originCities: [
      { city: "Tarragona", km: 100, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Girona", km: 100, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Lleida", km: 165, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 305, drivingTime: "2h 45 min", concertRideRange: "8–12 €/asiento" },
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Sala Bikini en metro?",
        a: "Las paradas más cercanas son Maria Cristina (L3 verde, 5 min a pie) y Les Corts (L3, 7 min). Desde Plaça Catalunya son 10 minutos en metro. La sala está dentro del centro comercial L'Illa Diagonal, en Avinguda Diagonal 547. Numerosos autobuses de Diagonal paran muy cerca.",
      },
      {
        q: "¿Hay parking en Sala Bikini?",
        a: "Sí. El parking de L'Illa Diagonal (3 €/hora) es el mismo edificio donde está Bikini, lo que lo hace muy cómodo. En noches de concierto puede saturarse pero el aforo del centro comercial absorbe bien la demanda. Si vienes de fuera de Barcelona, ConcertRide te ahorra el parking.",
      },
      {
        q: "¿Cómo volver de Sala Bikini de madrugada?",
        a: "El metro L3 cierra a las 2:00 los viernes y opera 24h los sábados. Bus nocturno N3 cubre la vuelta a Plaça Catalunya por Diagonal. Taxi/VTC al centro: 8–12 €. El carpooling con ConcertRide se coordina con el horario real del concierto.",
      },
      {
        q: "¿Qué tipo de conciertos hay en Bikini?",
        a: "Sala Bikini programa rock, indie, pop, jazz, soul y giras internacionales en formato sala mediana (1.500 personas). Es habitual ver artistas que en gira posterior llenan recintos de 4.000+ personas. Consulta agenda oficial en bikinibcn.com.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Madrid a Sala Bikini?",
        a: "Madrid–Barcelona son 620 km por la AP-2/A-2 (5h 30 min). Con ConcertRide el precio por asiento es de 15–20 €. Sin comisión, vuelta nocturna coordinada.",
      },
    ],
    relatedFestivals: ["primavera-sound", "cruilla"],
  },

  // ── PLAZA DE TOROS DE LAS VENTAS (MADRID) ────────────────────────────────────

  {
    slug: "plaza-toros-las-ventas",
    name: "Plaza de Toros de Las Ventas",
    quotableAnswer:
      "Plaza de Toros de Las Ventas es un recinto con capacidad para 23.798 personas (configuración concierto) en Madrid, dedicado a conciertos en formato arena y giras de gran formato. Está conectado con el centro de Madrid mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L2 Ventas. Las opciones para llegar son: (1) Metro L2 Ventas (acceso directo) (1,50–2,50 €); (2) Autobús urbano Líneas 12, 21, 38, 53, 74, 110, 146 (1,50–2 €); (3) Vehículo propio: Sin parking propio — Parking Forum (Av. Felipe II) 6–10€. El carpooling desde Toledo, Zaragoza, Valencia cuesta 4–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Las Ventas",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    address: "Calle de Alcalá, 237, 28028 Madrid",
    lat: 40.4322,
    lng: -3.6634,
    capacity: "23.798 personas (configuración concierto)",
    venueType: "Plaza de toros / arena al aire libre",
    transport: {
      metro: "L2 Ventas (acceso directo) · L5 Ventas",
      bus: "Líneas 12, 21, 38, 53, 74, 110, 146",
      parking: "Sin parking propio — Parking Forum (Av. Felipe II) 6–10€",
    },
    blurb:
      "La Plaza de Toros de Las Ventas (Madrid) es el principal coso taurino de España y, en verano, uno de los recintos al aire libre más usados para conciertos de gran formato en la capital. Con un aforo de unos 23.000 espectadores en configuración de concierto, ha acogido a Bruce Springsteen, Bob Dylan y giras nacionales. Acceso directo en metro L2 y L5 (parada Ventas). Sin parking propio — los aparcamientos cercanos (Forum, Las Ventas) cuestan 6–10 €. Carpooling con ConcertRide desde Valencia, Zaragoza, Barcelona y Sevilla.",
    originCities: [
      { city: "Toledo", km: 75, drivingTime: "55 min", concertRideRange: "4–7 €/asiento" },
      { city: "Valencia", km: 358, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Sevilla", km: 530, drivingTime: "5h", concertRideRange: "13–18 €/asiento" },
      { city: "Barcelona", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Bilbao", km: 395, drivingTime: "4h", concertRideRange: "10–15 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Las Ventas en metro?",
        a: "Acceso directo en metro: línea 2 (verde) y línea 5 (verde claro), parada Ventas. La salida del metro está prácticamente frente a la Puerta Grande de la plaza. Desde Sol son 10 minutos por la L2 directo. Los autobuses 21 y 146 también dejan a pocos metros.",
      },
      {
        q: "¿Hay parking cerca de Las Ventas?",
        a: "La plaza no dispone de parking propio. Los más cercanos son el Parking Forum (Av. Felipe II, 8) y el Parking Las Ventas (Alcalá 237), con tarifas de 6–10 €/día. En noches de concierto se saturan rápido. Si vienes de fuera de Madrid, el carpooling con ConcertRide evita el problema del parking.",
      },
      {
        q: "¿Hay conciertos en Las Ventas?",
        a: "Sí. Aunque su función principal es taurina, Las Ventas acoge conciertos al aire libre durante los meses de verano (mayo–septiembre), especialmente en formato grandes giras (Bruce Springsteen, Bob Dylan, Joaquín Sabina, Manuel Carrasco) con aforo de 20.000+ asistentes.",
      },
      {
        q: "¿Cómo volver de Las Ventas de madrugada?",
        a: "El metro cierra a la 1:30 (fines de semana hasta las 2:00). Para vueltas más tarde: bus nocturno N5 (Ventas–Sol), N7 o N8, taxi/VTC al centro (8–12 €). El carpooling con ConcertRide se coordina con el horario real del fin de concierto.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Barcelona a Las Ventas?",
        a: "Barcelona–Madrid son 620 km por la AP-2/A-2 (5h 30 min). Con ConcertRide el precio por asiento es de 15–20 €, frente a 30–100 € del AVE. Sin comisión, vuelta nocturna coordinada.",
      },
    ],
    relatedFestivals: ["mad-cool", "tomavistas"],
  },

  // ── AUDITORIO ROCÍO JURADO (SEVILLA) ─────────────────────────────────────────

  {
    slug: "auditorio-rocio-jurado",
    name: "Auditorio Rocío Jurado",
    quotableAnswer:
      "Auditorio Rocío Jurado es un recinto con capacidad para 12.000 personas en Sevilla, dedicado a conciertos en formato sala y eventos culturales. Está a 5–15 km del centro de Sevilla, accesible en autobús urbano o taxi (15–30 minutos), y la estación de transporte público más cercana es bus urbano Tussam C1. Las opciones para llegar son: (1) Autobús urbano Tussam C1, C2 (circulares) hasta Estadio La Cartuja (1,50–2 €); (2) Vehículo propio: Parking gratuito anexo (limitado, llegar pronto); (3) Taxi/VTC al centro: 8–20 €. El carpooling desde Huelva, Cádiz, Córdoba cuesta 4–18 €/asiento. Para volver de madrugada, la opción más utilizada es el carpooling con ConcertRide, que coordina la vuelta con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Auditorio Rocío Jurado",
    city: "Sevilla",
    citySlug: "sevilla",
    region: "Andalucía",
    address: "Camino de los Descubrimientos, s/n, Isla de la Cartuja, 41092 Sevilla",
    lat: 37.4078,
    lng: -6.0073,
    capacity: "12.000 personas",
    venueType: "Auditorio al aire libre",
    transport: {
      metro: "Sin metro directo — autobús C1/C2 desde centro",
      bus: "Tussam C1, C2 (circulares) hasta Estadio La Cartuja · 5/B",
      parking: "Parking gratuito anexo (limitado, llegar pronto)",
    },
    blurb:
      "El Auditorio Rocío Jurado (Sevilla) es un auditorio al aire libre situado en la Isla de la Cartuja, con capacidad para unas 12.000 personas. Acoge la programación estival de grandes conciertos en Sevilla (Icónica Fest, Cultura Inquieta y giras nacionales/internacionales). Sin acceso directo en metro: el autobús circular C1/C2 de Tussam conecta desde el centro hasta el Estadio La Cartuja y de ahí a pie son 5 min al auditorio. Carpooling con ConcertRide desde Huelva, Cádiz, Málaga y Córdoba.",
    originCities: [
      { city: "Huelva", km: 95, drivingTime: "1h 10 min", concertRideRange: "4–6 €/asiento" },
      { city: "Cádiz", km: 125, drivingTime: "1h 20 min", concertRideRange: "5–7 €/asiento" },
      { city: "Córdoba", km: 140, drivingTime: "1h 30 min", concertRideRange: "5–8 €/asiento" },
      { city: "Málaga", km: 210, drivingTime: "2h 10 min", concertRideRange: "7–10 €/asiento" },
      { city: "Granada", km: 250, drivingTime: "2h 30 min", concertRideRange: "8–11 €/asiento" },
      { city: "Madrid", km: 530, drivingTime: "5h", concertRideRange: "13–18 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Auditorio Rocío Jurado en transporte público?",
        a: "Desde el centro de Sevilla, los autobuses circulares C1 y C2 de Tussam llegan al Estadio La Cartuja y de ahí son 5 minutos a pie al auditorio. Las líneas 5 y B también acercan a la Isla de la Cartuja. El metro de Sevilla no llega directamente al recinto.",
      },
      {
        q: "¿Hay parking en el Auditorio Rocío Jurado?",
        a: "Sí, dispone de parking gratuito anexo con plazas limitadas. En conciertos masivos se recomienda llegar con 1 hora de antelación para asegurar plaza. Si vienes de fuera de Sevilla, el carpooling con ConcertRide te deja en la puerta.",
      },
      {
        q: "¿Qué conciertos se programan en el Auditorio Rocío Jurado?",
        a: "El Auditorio Rocío Jurado acoge la programación estival sevillana: ciclo Icónica Fest, Cultura Inquieta Sevilla y giras de artistas nacionales (Sabina, Pablo Alborán, Vetusta Morla, Estopa) e internacionales en formato al aire libre. Temporada: mayo–septiembre.",
      },
      {
        q: "¿Es lo mismo que el Estadio de La Cartuja?",
        a: "No, son recintos distintos aunque vecinos. El Estadio Olímpico de La Cartuja tiene 57.000 plazas y acoge fútbol y mega-conciertos. El Auditorio Rocío Jurado es un auditorio al aire libre de 12.000 plazas, especializado en conciertos de aforo medio. Comparten la zona de aparcamiento.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Madrid al Auditorio Rocío Jurado?",
        a: "Madrid–Sevilla son 530 km por la A-4 (5h). Con ConcertRide el precio por asiento es de 13–18 €, frente a 40–80 € del AVE o 120–180 € de un taxi. Sin comisión, vuelta nocturna coordinada con el horario real del concierto.",
      },
    ],
    relatedFestivals: ["iconica-fest"],
  },

  // ── SALA BUT (MADRID) ────────────────────────────────────────────────────────

  {
    slug: "sala-but",
    name: "Sala But",
    quotableAnswer:
      "Sala But es un recinto con capacidad para 1.500 personas en Madrid, dedicado a conciertos y eventos multidisciplinares. Está conectado con el centro de Madrid mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro L10 Alonso Martínez. Las opciones para llegar son: (1) Metro L10 Alonso Martínez (5 min) (1,50–2,50 €); (2) Autobús urbano Líneas 3, 21, 37, 40 (1,50–2 €); (3) Vehículo propio: Sin parking propio — Parking Tribunal/Bilbao (3–5 €/h). El carpooling desde Getafe, Toledo, Zaragoza cuesta 3–20 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "But",
    city: "Madrid",
    citySlug: "madrid",
    region: "Comunidad de Madrid",
    address: "Calle Barceló, 11, 28004 Madrid",
    lat: 40.4257,
    lng: -3.6987,
    capacity: "1.500 personas",
    venueType: "Sala de conciertos",
    transport: {
      metro: "L10 Alonso Martínez (5 min) · L4 Tribunal (8 min)",
      bus: "Líneas 3, 21, 37, 40 · Bus nocturno N20, N24, N26",
      parking: "Sin parking propio — Parking Tribunal/Bilbao (3–5 €/h)",
    },
    blurb:
      "Sala But (antigua sala Mondo, anteriormente Pachá y Teatro Barceló) es una de las salas de conciertos más céntricas de Madrid, ubicada en la calle Barceló (barrio Justicia/Malasaña). Con capacidad para 1.500 personas en formato concierto, programa rock, indie, pop urbano y electrónica internacional. Acceso fácil en metro L10 Alonso Martínez (5 min a pie) o L4 Tribunal (8 min). Sin parking propio. Carpooling con ConcertRide desde Toledo, Valencia, Zaragoza y Barcelona.",
    originCities: [
      { city: "Toledo", km: 72, drivingTime: "50 min", concertRideRange: "4–6 €/asiento" },
      { city: "Getafe", km: 17, drivingTime: "25 min", concertRideRange: "3–5 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Barcelona", km: 620, drivingTime: "5h 30 min", concertRideRange: "15–20 €/asiento" },
      { city: "Bilbao", km: 395, drivingTime: "4h", concertRideRange: "10–15 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Sala But en metro?",
        a: "La parada más cercana es Alonso Martínez (línea 4, 5 y 10), a 5 minutos a pie por la calle Barceló. Tribunal (L1/L10) está a 8 minutos. Desde Sol son 7 minutos en metro (Sol → Tribunal por L1 directo). Numerosos autobuses (3, 21, 37, 40) paran cerca.",
      },
      {
        q: "¿Hay parking cerca de Sala But?",
        a: "Sala But no tiene parking propio. Los aparcamientos más cercanos son el Parking Tribunal (Mejía Lequerica) y el Parking Bilbao (Plaza de Bilbao), con tarifas de 3–5 €/hora. Es zona azul de pago hasta las 21:00. Si vienes de fuera de Madrid, el carpooling con ConcertRide te ahorra el problema del parking en pleno centro.",
      },
      {
        q: "¿Cómo volver de Sala But de madrugada?",
        a: "Estás en pleno centro, lo que facilita la vuelta. El metro cierra a la 1:30 (sábados hasta las 2:00). Para más tarde: buses nocturnos N20, N24 y N26 desde Cibeles y Plaza de España. Taxi/VTC al centro: 5–8 €. ConcertRide coordina la vuelta para asistentes de fuera de Madrid.",
      },
      {
        q: "¿Qué tipo de conciertos hay en Sala But?",
        a: "Sala But (antes Mondo, antes Pachá Madrid) programa giras internacionales de rock, indie, pop urbano y electrónica. Aforo medio (1.500 personas) para artistas en formato sala. Algunas noches funciona también como club de electrónica. Consulta la agenda en salabut.com.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Valencia a Sala But?",
        a: "Valencia–Madrid son 355 km por la A-3 (3h 20 min). Con ConcertRide el precio por asiento es de 10–14 €, frente a 30–60 € del AVE. Sin comisión, pago Bizum o efectivo, vuelta nocturna coordinada.",
      },
    ],
    relatedFestivals: ["mad-cool", "tomavistas"],
  },

  // ── PLAZA DE TOROS DE VALENCIA ───────────────────────────────────────────────

  {
    slug: "plaza-toros-valencia",
    name: "Plaza de Toros de Valencia",
    quotableAnswer:
      "Plaza de Toros de Valencia es un recinto con capacidad para 10.500 personas en Valencia, dedicado a conciertos y eventos multidisciplinares. Está conectado con el centro de Valencia mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro Metro L3/L5 Xàtiva. Las opciones para llegar son: (1) Metro Metro L3/L5 Xàtiva (junto al recinto, 0 m) (1,50–2,50 €); (2) Autobús urbano EMT 13, 40, 89, 92 (1,50–2 €); (3) Renfe Renfe Estación del Norte (junto al recinto, 50 m) (2–5 €). El carpooling desde Castellón, Alicante, Murcia cuesta 3–14 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Plaza de Toros Valencia",
    city: "Valencia",
    citySlug: "valencia",
    region: "Comunidad Valenciana",
    address: "Calle Xàtiva, 28, 46004 Valencia",
    lat: 39.4664,
    lng: -0.3766,
    capacity: "10.500 personas",
    venueType: "Plaza de toros (conciertos verano)",
    transport: {
      metro: "Metro L3/L5 Xàtiva (junto al recinto, 0 m)",
      bus: "EMT 13, 40, 89, 92 · paradas en Xàtiva y Renfe Norte",
      tren: "Renfe Estación del Norte (junto al recinto, 50 m)",
      parking: "Sin parking propio — parking Plaza del Ayuntamiento (3–4 €/h)",
    },
    blurb:
      "La Plaza de Toros de Valencia es un recinto de aforo medio (10.500 personas) en pleno centro de la ciudad, junto a la Estación del Norte. Acoge la programación estival de conciertos al aire libre (Festivales Latinos Valencia, conciertos verano, formato Concert Music Festival) entre junio y septiembre. Acceso directo en metro L3/L5 Xàtiva (a pie de recinto) y Renfe Estación del Norte. Sin parking propio — usa parking Plaza del Ayuntamiento. Carpooling con ConcertRide desde Madrid, Barcelona, Alicante, Castellón y Murcia.",
    originCities: [
      { city: "Castellón", km: 75, drivingTime: "50 min", concertRideRange: "3–5 €/asiento" },
      { city: "Alicante", km: 165, drivingTime: "1h 40 min", concertRideRange: "5–8 €/asiento" },
      { city: "Murcia", km: 240, drivingTime: "2h 20 min", concertRideRange: "7–11 €/asiento" },
      { city: "Madrid", km: 358, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Barcelona", km: 350, drivingTime: "3h 20 min", concertRideRange: "10–14 €/asiento" },
      { city: "Zaragoza", km: 310, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a la Plaza de Toros de Valencia en transporte público?",
        a: "La parada de metro L3/L5 Xàtiva está literalmente junto al recinto (0 m). La Estación del Norte de Renfe está a 50 m. Los autobuses EMT 13, 40, 89 y 92 también tienen parada cercana. Desde Pl. del Ayuntamiento son 7 min andando.",
      },
      {
        q: "¿Hay parking en la Plaza de Toros de Valencia?",
        a: "El recinto no dispone de parking propio. Los más cercanos son el Parking Plaza del Ayuntamiento y el Parking Bailén (3–4 €/h), pero se llenan en conciertos. Es zona azul de pago hasta las 21:00. Si vienes de fuera, el carpooling con ConcertRide te ahorra el problema de aparcar en pleno centro de Valencia.",
      },
      {
        q: "¿Qué conciertos hay en la Plaza de Toros de Valencia?",
        a: "Programación estival al aire libre: Festivales Latinos Valencia, ciclos de conciertos de verano (junio–septiembre), giras de artistas nacionales (Manuel Carrasco, Estopa, Pablo Alborán) y latinos (Maluma, Reik, Carlos Vives). Consulta la agenda en plazatorosvalencia.com.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Madrid a la Plaza de Toros de Valencia?",
        a: "Madrid–Valencia son 358 km por la A-3 (3h 20 min). Con ConcertRide el precio por asiento oscila entre 10 y 14 €, frente a 30–60 € del AVE o 90–130 € del taxi. Sin comisión, pago Bizum o efectivo, vuelta nocturna coordinada con el horario real del concierto.",
      },
      {
        q: "¿Cómo volver de la Plaza de Toros de Valencia de madrugada?",
        a: "Estás en el centro: metro L3/L5 hasta la 1:00 (sábados hasta las 2:30), Renfe Cercanías hasta la medianoche, bus nocturno EMT N1/N9. Para vuelta a otra ciudad, ConcertRide coordina la salida con el final del concierto.",
      },
    ],
    relatedFestivals: ["festival-de-les-arts"],
  },

  // ── ESTADIO SAN MAMÉS (BILBAO) ───────────────────────────────────────────────

  {
    slug: "estadio-san-mames",
    name: "Estadio San Mamés",
    quotableAnswer:
      "Estadio San Mamés es un recinto con capacidad para 53.289 personas en Bilbao, dedicado a grandes conciertos, festivales y eventos deportivos. Está conectado con el centro de Bilbao mediante metro directo (10–20 minutos), y la estación de transporte público más cercana es Metro Metro L1/L2 San Mamés. Las opciones para llegar son: (1) Metro Metro L1/L2 San Mamés (acceso directo, 0 m) (1,50–2,50 €); (2) Autobús urbano Bilbobus A2, A3, A8, 18, 28, 38, 48, 58, 71 (1,50–2 €); (3) Renfe Renfe Cercanías C-1 / FEVE Olabeaga (10 min andando) (2–5 €). El carpooling desde Vitoria, Donostia, Santander cuesta 3–16 €/asiento. Para volver de madrugada, la opción más utilizada es el bus nocturno o el carpooling de vuelta con ConcertRide, que coordina al conductor con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "San Mamés",
    city: "Bilbao",
    citySlug: "bilbao",
    region: "País Vasco",
    address: "Rafael Moreno Pitxitxi Kalea, s/n, 48013 Bilbao",
    lat: 43.2641,
    lng: -2.9494,
    capacity: "53.289 personas",
    venueType: "Estadio (sede del Athletic Club)",
    transport: {
      metro: "Metro L1/L2 San Mamés (acceso directo, 0 m)",
      bus: "Bilbobus A2, A3, A8, 18, 28, 38, 48, 58, 71",
      tren: "Renfe Cercanías C-1 / FEVE Olabeaga (10 min andando)",
      parking: "Parking propio P1 (uso limitado en conciertos) + zonas ORA cercanas",
    },
    blurb:
      "El Estadio San Mamés (La Catedral del Athletic Club) es uno de los grandes recintos de conciertos de mega-aforo en el norte de España, con capacidad para 53.289 personas. Acoge giras internacionales (Bruce Springsteen, Bad Bunny, mega-tours) y conciertos benéficos. Acceso directo en Metro L1/L2 San Mamés (parada a pie de estadio) y Bilbobus A2/A3/A8. Cercanías Renfe C-1 (Olabeaga, 10 min andando). Carpooling con ConcertRide desde Donostia, Vitoria, Santander, Logroño, Madrid y Pamplona.",
    originCities: [
      { city: "Vitoria", km: 65, drivingTime: "50 min", concertRideRange: "3–5 €/asiento" },
      { city: "Donostia", km: 100, drivingTime: "1h 10 min", concertRideRange: "4–6 €/asiento" },
      { city: "Santander", km: 105, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" },
      { city: "Logroño", km: 145, drivingTime: "1h 35 min", concertRideRange: "5–8 €/asiento" },
      { city: "Pamplona", km: 160, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Madrid", km: 395, drivingTime: "4h", concertRideRange: "11–16 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Estadio San Mamés en metro?",
        a: "La parada de Metro Bilbao L1/L2 San Mamés tiene acceso directo al estadio (0 m). Es la mejor opción: 10 min desde Casco Viejo y 5 min desde Abando-Indalecio Prieto. Frecuencia 4–6 min en horas pico. El metro funciona hasta la 23:00 entre semana y hasta las 2:00 los fines de semana.",
      },
      {
        q: "¿Hay parking en San Mamés para conciertos?",
        a: "El parking P1 del estadio tiene aforo limitado y suele restringirse a abonados/VIP en conciertos. Las opciones son aparcamientos OLA cercanos (Pichichi, Indautxu) o el aparcamiento Pío Baroja. En conciertos masivos, recomendamos llegar 2 h antes o venir en carpooling con ConcertRide para evitar el problema.",
      },
      {
        q: "¿Qué conciertos hay en San Mamés?",
        a: "San Mamés acoge giras internacionales de mega-estadio: Bruce Springsteen (gira E Street Band), Bad Bunny, conciertos benéficos y festivales puntuales. Consulta la agenda oficial en athletic-club.eus / sanmames.eus.",
      },
      {
        q: "¿Cómo volver de San Mamés de madrugada?",
        a: "Metro L1/L2 hasta las 23:00 entre semana o hasta las 2:00 fines de semana. Bilbobus nocturnos (Gautxoris) desde Plaza Moyúa cubren el resto. Si vienes de fuera de Bilbao, ConcertRide coordina la vuelta con el horario real del concierto.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Madrid a San Mamés?",
        a: "Madrid–Bilbao son 395 km por la A-1 (4h). Con ConcertRide el precio por asiento es de 11–16 €, frente a 40–80 € del AVE o 25–35 € del bus de línea. Sin comisión, pago Bizum o efectivo, vuelta nocturna coordinada.",
      },
    ],
    relatedFestivals: ["bbk-live", "bbk-music-legends"],
  },

  // ── COLISEUM A CORUÑA ────────────────────────────────────────────────────────

  {
    slug: "coliseum-a-coruna",
    name: "Coliseum da Coruña",
    quotableAnswer:
      "Coliseum da Coruña es un recinto con capacidad para 11.000 personas en A Coruña, dedicado a conciertos en formato arena y giras de gran formato. Está conectado con el centro de A Coruña por tren de cercanías (15–25 minutos), y la estación de transporte público más cercana es tren Renfe A Coruña San Cristóbal. Las opciones para llegar son: (1) Autobús urbano Bus urbano líneas 12, 14 (1,50–2 €); (2) Renfe Renfe A Coruña San Cristóbal (15 min en bus / 5 min en taxi) (2–5 €); (3) Vehículo propio: Parking propio gratuito (800 plazas). El carpooling desde Santiago, Lugo, Pontevedra cuesta 3–22 €/asiento. Para volver de madrugada, la opción más utilizada es el carpooling con ConcertRide, que coordina la vuelta con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Coliseum A Coruña",
    city: "A Coruña",
    citySlug: "a-coruna",
    region: "Galicia",
    address: "Rúa Francisco Pérez Carballo, 2, 15008 A Coruña",
    lat: 43.3673,
    lng: -8.4039,
    capacity: "11.000 personas",
    venueType: "Pabellón multiusos",
    transport: {
      metro: "Sin metro — A Coruña no dispone de red de metro",
      bus: "Bus urbano líneas 12, 14 · paradas en Ronda de Outeiro",
      tren: "Renfe A Coruña San Cristóbal (15 min en bus / 5 min en taxi)",
      parking: "Parking propio gratuito (800 plazas)",
    },
    blurb:
      "El Coliseum da Coruña es el principal pabellón multiusos de Galicia, con capacidad para 11.000 personas y parking propio gratuito de 800 plazas. Acoge conciertos de aforo medio-grande (Manuel Carrasco, Estopa, Sebastián Yatra, Sabina, Sabina, eventos deportivos del Deportivo de A Coruña). Sin metro en la ciudad: el acceso es en bus urbano líneas 12 y 14 (Ronda de Outeiro). Carpooling con ConcertRide desde Santiago, Lugo, Vigo, Pontevedra y Ourense.",
    originCities: [
      { city: "Santiago", km: 70, drivingTime: "50 min", concertRideRange: "3–5 €/asiento" },
      { city: "Lugo", km: 100, drivingTime: "1h 10 min", concertRideRange: "4–6 €/asiento" },
      { city: "Pontevedra", km: 130, drivingTime: "1h 25 min", concertRideRange: "4–7 €/asiento" },
      { city: "Vigo", km: 160, drivingTime: "1h 40 min", concertRideRange: "5–8 €/asiento" },
      { city: "Ourense", km: 200, drivingTime: "2h", concertRideRange: "6–9 €/asiento" },
      { city: "Madrid", km: 600, drivingTime: "5h 45 min", concertRideRange: "16–22 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Coliseum da Coruña en transporte público?",
        a: "Las líneas 12 y 14 del bus urbano de A Coruña tienen paradas en Ronda de Outeiro, junto al recinto. Desde la estación de Renfe San Cristóbal son 15 min en bus o 5 min en taxi (6–8 €). El Coliseum no tiene metro porque A Coruña no dispone de red metropolitana.",
      },
      {
        q: "¿Hay parking en el Coliseum da Coruña?",
        a: "Sí, el recinto cuenta con parking propio gratuito de 800 plazas. Es una de las grandes ventajas frente a otros pabellones urbanos. Para conciertos grandes (10.000+ asistentes) llega con 1 h de antelación: las plazas más cercanas se llenan.",
      },
      {
        q: "¿Qué conciertos se programan en el Coliseum da Coruña?",
        a: "El Coliseum acoge giras nacionales (Manuel Carrasco, Estopa, Sabina, Pablo Alborán, Sebastián Yatra), internacionales en formato pabellón, eventos deportivos del Deportivo de A Coruña y eventos corporativos. Consulta la agenda en coliseumcoruna.com.",
      },
      {
        q: "¿Cómo volver del Coliseum da Coruña de madrugada?",
        a: "Las líneas 12 y 14 del bus urbano funcionan hasta las 23:00–00:00. Para vuelta posterior, taxi al centro 7–10 € o bus nocturno NA línea desde la Ronda de Outeiro. ConcertRide coordina la vuelta a otras ciudades gallegas con el horario real del concierto.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Santiago al Coliseum da Coruña?",
        a: "Santiago–A Coruña son 70 km por la AP-9 (50 min). Con ConcertRide el precio por asiento es de 3–5 €, frente a 12–18 € del bus Monbus o 7–11 € de tren Renfe. Sin comisión, pago Bizum o efectivo, vuelta nocturna coordinada.",
      },
    ],
    relatedFestivals: ["o-son-do-camino", "atlantic-fest"],
  },

  // ── AUDITORIO DE CASTRELOS (VIGO) ────────────────────────────────────────────

  {
    slug: "auditorio-castrelos",
    name: "Auditorio de Castrelos",
    quotableAnswer:
      "Auditorio de Castrelos es un recinto con capacidad para 20.000 personas (al aire libre, verano) en Vigo, dedicado a conciertos en formato sala y eventos culturales. Está conectado con el centro de Vigo por tren de cercanías (15–25 minutos), y la estación de transporte público más cercana es tren Renfe Vigo Urzáiz. Las opciones para llegar son: (1) Autobús urbano Vitrasa líneas 11, C9A, R3 (1,50–2 €); (2) Renfe Renfe Vigo Urzáiz (20 min en bus, 3,5 km) (2–5 €); (3) Vehículo propio: Parking del Parque de Castrelos (gratuito, limitado). El carpooling desde Pontevedra, Santiago, Ourense cuesta 3–22 €/asiento. Para volver de madrugada, la opción más utilizada es el carpooling con ConcertRide, que coordina la vuelta con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Castrelos",
    city: "Vigo",
    citySlug: "vigo",
    region: "Galicia",
    address: "Parque de Castrelos, s/n, 36213 Vigo",
    lat: 42.2168,
    lng: -8.7409,
    capacity: "20.000 personas (al aire libre, verano)",
    venueType: "Auditorio al aire libre",
    transport: {
      metro: "Sin metro — Vigo no dispone de red de metro",
      bus: "Vitrasa líneas 11, C9A, R3 · lanzaderas especiales en conciertos grandes",
      tren: "Renfe Vigo Urzáiz (20 min en bus, 3,5 km)",
      parking: "Parking del Parque de Castrelos (gratuito, limitado) · zonas adyacentes",
    },
    blurb:
      "El Auditorio de Castrelos es un anfiteatro al aire libre en el Parque de Castrelos de Vigo, con capacidad para hasta 20.000 personas en su configuración de conciertos. Es el principal escenario de la programación estival viguesa: ciclo Castrelos Verano, conciertos gratuitos del Concello de Vigo y eventos como O Marisquiño. Acceso en autobús Vitrasa líneas 11, C9A y R3, con lanzaderas especiales en conciertos masivos. Carpooling con ConcertRide desde Pontevedra, Santiago, A Coruña, Ourense y Porto.",
    originCities: [
      { city: "Pontevedra", km: 30, drivingTime: "30 min", concertRideRange: "3–4 €/asiento" },
      { city: "Santiago", km: 90, drivingTime: "1h", concertRideRange: "4–6 €/asiento" },
      { city: "Ourense", km: 110, drivingTime: "1h 15 min", concertRideRange: "4–7 €/asiento" },
      { city: "A Coruña", km: 160, drivingTime: "1h 40 min", concertRideRange: "5–8 €/asiento" },
      { city: "Porto (PT)", km: 150, drivingTime: "1h 35 min", concertRideRange: "5–8 €/asiento" },
      { city: "Madrid", km: 600, drivingTime: "5h 45 min", concertRideRange: "16–22 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Auditorio de Castrelos en transporte público?",
        a: "Las líneas Vitrasa 11, C9A y R3 tienen parada junto al Parque de Castrelos. Desde el centro de Vigo (Plaza Compostela) son unos 15 min en bus. En conciertos masivos (10.000+ asistentes) se habilitan lanzaderas especiales desde la estación de Urzáiz y la estación de autobuses.",
      },
      {
        q: "¿Hay parking en el Auditorio de Castrelos?",
        a: "El Parque de Castrelos dispone de aparcamientos gratuitos en sus accesos, pero su aforo es limitado y se llena en conciertos grandes. Las zonas adyacentes (Pizarro, Avenida de Castrelos) son de aparcamiento libre. Llega con 1–2 h de antelación o ven en carpooling con ConcertRide para evitar el problema.",
      },
      {
        q: "¿Qué conciertos hay en el Auditorio de Castrelos?",
        a: "Programación estival (junio–septiembre): ciclo Castrelos Verano (conciertos gratuitos del Concello de Vigo con artistas nacionales e internacionales), O Marisquiño (festival urbano), conciertos benéficos. Aforo de hasta 20.000 personas en formato al aire libre. Agenda en concello-vigo.org.",
      },
      {
        q: "¿Cuándo es la temporada del Auditorio de Castrelos?",
        a: "El Auditorio de Castrelos opera al aire libre, por lo que su temporada principal es de junio a septiembre. Fuera de esa franja, los conciertos en Vigo se trasladan al IFEVI o a salas cubiertas.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Pontevedra al Auditorio de Castrelos?",
        a: "Pontevedra–Vigo son 30 km por la AP-9 (30 min). Con ConcertRide el precio por asiento es de 3–4 €, frente a 4,30 € del bus o 6 € del tren. Sin comisión, pago Bizum o efectivo, vuelta nocturna coordinada.",
      },
    ],
    relatedFestivals: ["o-son-do-camino", "portamerica", "atlantic-fest"],
  },

  // ── MARENOSTRUM FUENGIROLA (RECINTO) ────────────────────────────────────────

  {
    slug: "marenostrum-fuengirola",
    name: "Marenostrum Fuengirola",
    quotableAnswer:
      "Marenostrum Fuengirola es un recinto con capacidad para 14.000 personas en Fuengirola, dedicado a festivales al aire libre y macroconciertos. Está conectado con el centro de Fuengirola por tren de cercanías (15–25 minutos), y la estación de transporte público más cercana es tren Renfe Cercanías C-1 Málaga–Fuengirola. Las opciones para llegar son: (1) Autobús urbano Avanza M-110 / M-220 desde Málaga (1,50–2 €); (2) Renfe Renfe Cercanías C-1 Málaga–Fuengirola (45 min desde María Zambrano) (2–5 €); (3) Vehículo propio: Sin parking propio — aparcamientos públicos Fuengirola Sur (2–4 €/día). El carpooling desde Málaga, Granada, Córdoba cuesta 3–20 €/asiento. Para volver de madrugada, la opción más utilizada es el carpooling con ConcertRide, que coordina la vuelta con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Marenostrum",
    city: "Fuengirola",
    citySlug: "malaga",
    region: "Andalucía",
    address: "Avenida del Doctor Gálvez Ginachero, s/n, 29640 Fuengirola, Málaga",
    lat: 36.5391,
    lng: -4.6253,
    capacity: "14.000 personas",
    venueType: "Recinto al aire libre (al lado del mar)",
    transport: {
      metro: "Sin metro directo — Cercanías Renfe C-1 hasta Fuengirola",
      bus: "Avanza M-110 / M-220 desde Málaga · bus urbano Fuengirola línea 1",
      tren: "Renfe Cercanías C-1 Málaga–Fuengirola (45 min desde María Zambrano)",
      parking: "Sin parking propio — aparcamientos públicos Fuengirola Sur (2–4 €/día)",
    },
    blurb:
      "El recinto Marenostrum Fuengirola es uno de los principales escenarios al aire libre de la Costa del Sol, con capacidad para 14.000 personas y vistas al mar Mediterráneo. Acoge el ciclo Marenostrum Fuengirola Castle Park (verano, 25+ artistas internacionales: Sting, Rod Stewart, Pet Shop Boys, etc.). Acceso óptimo en Renfe Cercanías C-1 desde Málaga (45 min, 4,15 €) o Avanza M-110/M-220. Sin parking propio. Carpooling con ConcertRide desde Málaga, Granada, Sevilla, Córdoba y Almería.",
    originCities: [
      { city: "Málaga", km: 30, drivingTime: "30 min", concertRideRange: "3–4 €/asiento" },
      { city: "Granada", km: 145, drivingTime: "1h 35 min", concertRideRange: "5–8 €/asiento" },
      { city: "Córdoba", km: 175, drivingTime: "1h 50 min", concertRideRange: "6–9 €/asiento" },
      { city: "Sevilla", km: 230, drivingTime: "2h 25 min", concertRideRange: "7–11 €/asiento" },
      { city: "Almería", km: 230, drivingTime: "2h 25 min", concertRideRange: "7–11 €/asiento" },
      { city: "Madrid", km: 565, drivingTime: "5h 25 min", concertRideRange: "15–20 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a Marenostrum Fuengirola en transporte público?",
        a: "La opción más rápida es la línea de Renfe Cercanías C-1 Málaga–Fuengirola (45 min desde María Zambrano, 4,15 €, frecuencia 30 min). Desde la estación Fuengirola al recinto son 15 min andando o 5 min en taxi. Desde el aeropuerto AGP, Cercanías C-1 directa en 30 min.",
      },
      {
        q: "¿Hay parking en Marenostrum Fuengirola?",
        a: "El recinto no dispone de parking propio. Los aparcamientos públicos más cercanos son Fuengirola Sur y Plaza Solbella (2–4 €/día). En conciertos masivos se llenan rápido — recomendamos llegar 2 h antes o venir en carpooling con ConcertRide desde Málaga o Granada.",
      },
      {
        q: "¿Qué conciertos hay en Marenostrum Fuengirola?",
        a: "El ciclo Marenostrum Fuengirola Castle Park programa 25+ conciertos internacionales cada verano (junio–septiembre): Sting, Rod Stewart, Pet Shop Boys, Tom Jones, Anastacia, Manuel Carrasco, David Bisbal y muchos más. Aforo de 14.000 personas. Agenda en marenostrumfuengirola.com.",
      },
      {
        q: "¿Cómo volver de Marenostrum Fuengirola de madrugada?",
        a: "Renfe Cercanías C-1 hacia Málaga funciona hasta las 23:30. Para conciertos que terminan más tarde: taxi a Málaga (40–60 €) o vuelta coordinada con ConcertRide (Málaga 3–4 €, Granada 5–8 €). Avanza M-110 a Málaga centro hasta las 00:00.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Málaga a Marenostrum Fuengirola?",
        a: "Málaga–Fuengirola son 30 km por la A-7 (30 min). Con ConcertRide el precio por asiento es de 3–4 €, frente a 4,15 € del Cercanías o 6 € del bus Avanza. Sin comisión, pago Bizum o efectivo, vuelta nocturna coordinada.",
      },
    ],
    relatedFestivals: ["marenostrum-fuengirola", "cala-mijas", "starlite-marbella"],
  },

  // ── PLAZA DE TOROS DE ZARAGOZA (LA MISERICORDIA) ─────────────────────────────

  {
    slug: "plaza-toros-zaragoza",
    name: "Plaza de Toros de Zaragoza (La Misericordia)",
    quotableAnswer:
      "Plaza de Toros de Zaragoza (La Misericordia) es un recinto con capacidad para 10.700 personas en Zaragoza, dedicado a conciertos y eventos multidisciplinares. Está conectado con el centro de Zaragoza por tren de cercanías (15–25 minutos), y la estación de transporte público más cercana es tren Renfe Zaragoza-Delicias. Las opciones para llegar son: (1) Autobús urbano Tuzsa líneas 22, 33, Ci1, Ci2 (1,50–2 €); (2) Renfe Renfe Zaragoza-Delicias (20 min andando, 1,5 km) (2–5 €); (3) Vehículo propio: Sin parking propio — Parking Plaza Toros / Parking Salduba (2–3 €/h). El carpooling desde Logroño, Pamplona, Valencia cuesta 5–13 €/asiento. Para volver de madrugada, la opción más utilizada es el carpooling con ConcertRide, que coordina la vuelta con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Plaza Toros Zaragoza",
    city: "Zaragoza",
    citySlug: "zaragoza",
    region: "Aragón",
    address: "Avenida Pablo Gargallo, 11, 50003 Zaragoza",
    lat: 41.6593,
    lng: -0.8932,
    capacity: "10.700 personas",
    venueType: "Plaza de toros (conciertos verano)",
    transport: {
      metro: "Sin metro — Zaragoza no dispone de red de metro",
      bus: "Tuzsa líneas 22, 33, Ci1, Ci2 · paradas en Av. Pablo Gargallo",
      tren: "Renfe Zaragoza-Delicias (20 min andando, 1,5 km)",
      parking: "Sin parking propio — Parking Plaza Toros / Parking Salduba (2–3 €/h)",
    },
    blurb:
      "La Plaza de Toros de La Misericordia es el principal recinto de aforo medio para conciertos al aire libre en Zaragoza, con capacidad para 10.700 personas. Acoge la programación estival (Vive Latino Zaragoza en otros recintos del Expo, conciertos verano municipales, ciclos privados). A 1,5 km de la estación Renfe Zaragoza-Delicias y bien conectada por Tuzsa (22, 33, Ci1, Ci2). Sin parking propio. Carpooling con ConcertRide desde Madrid, Barcelona, Bilbao, Valencia y Logroño.",
    originCities: [
      { city: "Logroño", km: 175, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Pamplona", km: 175, drivingTime: "1h 45 min", concertRideRange: "5–8 €/asiento" },
      { city: "Valencia", km: 310, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Madrid", km: 325, drivingTime: "3h", concertRideRange: "9–13 €/asiento" },
      { city: "Barcelona", km: 310, drivingTime: "3h 5 min", concertRideRange: "9–13 €/asiento" },
      { city: "Bilbao", km: 320, drivingTime: "3h 10 min", concertRideRange: "9–13 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar a la Plaza de Toros de Zaragoza en transporte público?",
        a: "Las líneas de bus Tuzsa 22, 33, Ci1 y Ci2 tienen parada en Avenida Pablo Gargallo, junto al recinto. Desde la estación Renfe Zaragoza-Delicias son 20 min andando o 5 min en bus línea 34. Desde Plaza España, 15 min a pie. Zaragoza no tiene metro, pero sí tranvía L1 (parada Plaza Toros, 5 min andando).",
      },
      {
        q: "¿Hay parking en la Plaza de Toros de Zaragoza?",
        a: "El recinto no dispone de parking propio. Los más cercanos son el Parking Plaza Toros y el Parking Salduba (2–3 €/h). En conciertos masivos se llenan rápido — llega con 1 h de antelación o ven en carpooling con ConcertRide para evitar el problema.",
      },
      {
        q: "¿Qué conciertos hay en la Plaza de Toros de Zaragoza?",
        a: "Programación estival al aire libre (junio–septiembre): conciertos del Ayuntamiento de Zaragoza, ciclos privados, giras de artistas nacionales (Estopa, Manuel Carrasco, Sabina, Hombres G) e internacionales en formato medio aforo. Aforo de 10.700 personas. Agenda en torozaragoza.com.",
      },
      {
        q: "¿Cómo volver de la Plaza de Toros de Zaragoza de madrugada?",
        a: "Tranvía L1 hasta la 00:00 (sábados hasta la 01:30) y buses nocturnos N1/N6 desde el centro. Taxi al centro 6–9 €. Si vienes de fuera, ConcertRide coordina la vuelta a Madrid, Barcelona, Bilbao o Valencia con el horario real del concierto.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Madrid a la Plaza de Toros de Zaragoza?",
        a: "Madrid–Zaragoza son 325 km por la A-2 (3h). Con ConcertRide el precio por asiento es de 9–13 €, frente a 25–60 € del AVE o 20–30 € del bus Avanza. Sin comisión, pago Bizum o efectivo, vuelta nocturna coordinada.",
      },
    ],
    relatedFestivals: ["vive-latino"],
  },

  // ── REALE ARENA / ESTADIO DE ANOETA (DONOSTIA) ───────────────────────────────

  {
    slug: "reale-arena-anoeta",
    name: "Reale Arena (Estadio de Anoeta)",
    quotableAnswer:
      "Reale Arena (Estadio de Anoeta) es un recinto con capacidad para 39.500 personas en Donostia-San Sebastián, dedicado a grandes conciertos, festivales y eventos deportivos. Está conectado con el centro de Donostia-San Sebastián por tren de cercanías (15–25 minutos), y la estación de transporte público más cercana es tren Renfe Cercanías E2/E3 Anoeta. Las opciones para llegar son: (1) Autobús urbano Dbus líneas 17, 26, 28, 31, 33, 36 (1,50–2 €); (2) Renfe Renfe Cercanías E2/E3 Anoeta (5 min andando) + Euskotren Anoeta (2–5 €); (3) Vehículo propio: Parking propio Anoeta (uso restringido en eventos) + Parking Illunbe a 600 m. El carpooling desde Pamplona, Bilbao, Vitoria cuesta 3–22 €/asiento. Para volver de madrugada, la opción más utilizada es el carpooling con ConcertRide, que coordina la vuelta con el horario real del concierto. ConcertRide coordina viaje, entrada y grupo en un único punto, sin comisión de plataforma.",
    shortName: "Reale Arena",
    city: "Donostia-San Sebastián",
    citySlug: "donostia",
    region: "País Vasco",
    address: "Anoeta Pasealekua, 1, 20014 Donostia-San Sebastián",
    lat: 43.3014,
    lng: -1.9736,
    capacity: "39.500 personas",
    venueType: "Estadio (sede de la Real Sociedad)",
    transport: {
      metro: "Sin metro — Donostia no dispone de red de metro",
      bus: "Dbus líneas 17, 26, 28, 31, 33, 36 · parada Anoeta",
      tren: "Renfe Cercanías E2/E3 Anoeta (5 min andando) + Euskotren Anoeta",
      parking: "Parking propio Anoeta (uso restringido en eventos) + Parking Illunbe a 600 m",
    },
    blurb:
      "El Reale Arena, conocido históricamente como Estadio de Anoeta, es el principal recinto de mega-aforo de Donostia–San Sebastián con capacidad para 39.500 personas y sede de la Real Sociedad de Fútbol. Acoge giras internacionales de gran formato (Bruce Springsteen, Bon Jovi, AC/DC, Bad Bunny) y conciertos vinculados a la programación de verano (Jazzaldia extensión, conciertos benéficos vascos). A 5 min andando de la estación de Renfe Cercanías Anoeta (líneas E2/E3 Brinkola–Donostia) y bien conectado por Dbus (17, 26, 28, 31, 33, 36). Carpooling con ConcertRide desde Bilbao, Vitoria, Pamplona, Logroño, Santander, Madrid y Barcelona.",
    originCities: [
      { city: "Pamplona", km: 80, drivingTime: "1h", concertRideRange: "3–6 €/asiento" },
      { city: "Bilbao", km: 100, drivingTime: "1h 10 min", concertRideRange: "4–7 €/asiento" },
      { city: "Vitoria", km: 100, drivingTime: "1h 5 min", concertRideRange: "4–7 €/asiento" },
      { city: "Logroño", km: 175, drivingTime: "1h 50 min", concertRideRange: "6–9 €/asiento" },
      { city: "Santander", km: 205, drivingTime: "2h 10 min", concertRideRange: "7–10 €/asiento" },
      { city: "Madrid", km: 460, drivingTime: "4h 30 min", concertRideRange: "13–18 €/asiento" },
      { city: "Barcelona", km: 575, drivingTime: "5h 30 min", concertRideRange: "16–22 €/asiento" },
    ],
    faqs: [
      {
        q: "¿Cómo llegar al Reale Arena de Anoeta en transporte público?",
        a: "El Reale Arena está a 5 min andando de la estación Renfe Cercanías Anoeta (líneas E2/E3 hacia Brinkola y Donostia) y de la parada Anoeta de Euskotren. Las líneas Dbus 17, 26, 28, 31, 33 y 36 paran junto al estadio. Donostia no tiene metro. Desde el centro (Plaza Gipuzkoa o Plaza Bilbao), unos 15 min andando o 5 min en bus.",
      },
      {
        q: "¿Hay parking en el Reale Arena para conciertos?",
        a: "El parking propio del Reale Arena tiene aforo limitado y suele restringirse a abonados de la Real Sociedad / VIP en jornadas de concierto. La alternativa más cercana es el Parking Illunbe (600 m, 2,20 €/h). En eventos de mega-aforo (Springsteen, Bad Bunny) los aparcamientos se llenan 2h antes del concierto. El carpooling con ConcertRide reduce la presión sobre el aparcamiento al concentrar 4 personas por coche.",
      },
      {
        q: "¿Qué conciertos hay en el Reale Arena en 2026?",
        a: "El Reale Arena programa anualmente 4–6 conciertos de gran formato durante mayo–agosto, fuera de la temporada futbolística. Históricamente ha acogido a Bruce Springsteen (1988, 2008, 2023), Bon Jovi, AC/DC, U2, Pink, Manuel Carrasco y giras nacionales de mega-aforo. La programación se concentra en junio–julio para coincidir con el Jazzaldia (que usa escenarios propios distintos al estadio). Agenda en realsociedad.eus.",
      },
      {
        q: "¿Cómo volver del Reale Arena de madrugada?",
        a: "Renfe Cercanías E2/E3 opera hasta las 22:30 entre semana y hasta las 0:30 los fines de semana. Euskotren opera con frecuencias reducidas tras las 23:00. Los Dbus nocturnos (Búho líneas N1, N2) cubren los principales barrios donostiarras hasta las 4:00 AM los viernes y sábados. Taxi al centro de Donostia 8–12 €. Para asistentes de Bilbao, Pamplona, Madrid o Barcelona, ConcertRide coordina la vuelta cuando termina el concierto, sin depender del horario del tren.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Bilbao al Reale Arena?",
        a: "Bilbao–Donostia (Reale Arena) son 100 km por la AP-8 (1h 10 min). Con ConcertRide el precio por asiento es de 4–7 €, frente a 18–30 € del bus PESA o 12–25 € del Euskotren con trasbordo. Sin comisión, pago Bizum o efectivo, vuelta nocturna coordinada con el horario real del concierto.",
      },
    ],
    relatedFestivals: ["jazzaldia"],
  },
];

/** Lookup map by slug for O(1) access in route components */
export const VENUE_LANDINGS_BY_SLUG: Record<string, VenueLanding> =
  Object.fromEntries(VENUE_LANDINGS.map((v) => [v.slug, v]));

/** All registered venue slugs — used for sitemap generation and prerender */
export const VENUE_SLUGS: string[] = VENUE_LANDINGS.map((v) => v.slug);

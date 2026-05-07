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
}

export const VENUE_LANDINGS: VenueLanding[] = [
  // ── MADRID ──────────────────────────────────────────────────────────────────

  {
    slug: "wizink-center",
    name: "WiZink Center",
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
    name: "IFEMA Madrid — Recintos de festival",
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
        a: "Málaga–Sevilla son 210 km por la A-92 (2h 10 min). Con ConcertRide el precio habitual por asiento es de 7–11 €, frente a los 15–30 € del AVE Málaga–Sevilla (con trasbordos) o los 40–60 € de un BlaBlaCar con comisión incluida. El carpooling es la opción más usada para esta ruta en noches de concierto.",
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
];

/** Lookup map by slug for O(1) access in route components */
export const VENUE_LANDINGS_BY_SLUG: Record<string, VenueLanding> =
  Object.fromEntries(VENUE_LANDINGS.map((v) => [v.slug, v]));

/** All registered venue slugs — used for sitemap generation and prerender */
export const VENUE_SLUGS: string[] = VENUE_LANDINGS.map((v) => v.slug);

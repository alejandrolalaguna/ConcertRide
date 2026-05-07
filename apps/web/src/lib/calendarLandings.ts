// Calendar landing pages live at /calendario-festivales/:slug
// e.g. /calendario-festivales/julio-2026
import { FESTIVAL_LANDINGS_BY_SLUG } from "./festivalLandings";

export interface CalendarLanding {
  slug: string;           // e.g. "julio-2026"
  month: string;          // "Julio"
  year: number;           // 2026
  isoMonth: string;       // "2026-07"
  festivalSlugs: string[];
  blurb: string;          // ~80 words, citable
  searchIntent: string;   // what the user is looking for
  faqs: Array<{ q: string; a: string }>;
}

export const CALENDAR_LANDINGS: CalendarLanding[] = [
  {
    slug: "mayo-2026",
    month: "Mayo",
    year: 2026,
    isoMonth: "2026-05",
    festivalSlugs: [
      "vina-rock",      // 30 abr – 3 may
      "sos-48",         // 8–10 may
      "tomavistas",     // 15–17 may
      "mallorca-live-festival", // 22–24 may
      "primavera-sound", // 28 may – 1 jun
      "festival-de-les-arts", // 28 may
    ],
    blurb:
      "Mayo 2026 es uno de los meses más intensos del calendario festivalero español, con seis festivales en apenas tres semanas. Arranca con Viña Rock en el puente de mayo (30 abr–3 may, Albacete, 50.000 asistentes de punk y rock alternativo), sigue con SOS 4.8 en Murcia (8–10 may), Tomavistas en Madrid (15–17 may, indie), Mallorca Live Festival (22–24 may) y cierra con Primavera Sound en Barcelona (28 may–1 jun, referencia indie mundial). Carpooling sin comisión con ConcertRide a todos ellos.",
    searchIntent: "festivales mayo 2026 españa",
    faqs: [
      {
        q: "¿Qué festivales hay en mayo 2026 en España?",
        a: "En mayo 2026 hay seis festivales destacados en España: Viña Rock (Albacete, 30 abr–3 may), SOS 4.8 (Murcia, 8–10 mayo), Tomavistas (Madrid, 15–17 mayo), Mallorca Live Festival (Calvià, 22–24 mayo), Festival de les Arts (Valencia, 28 mayo) y Primavera Sound (Barcelona, 28 mayo–1 junio). Todos con carpooling disponible en ConcertRide desde las principales ciudades españolas, sin comisión.",
      },
      {
        q: "¿Es buen mes mayo para ir a festivales en España?",
        a: "Sí, mayo es excelente para festivales en España: el clima es ideal (20–25°C, sin el calor extremo del verano), los festivales están menos masificados que en julio–agosto, los precios de alojamiento son menores y el repertorio de artistas es de primer nivel. El puente de mayo (1 de mayo, día festivo) concentra Viña Rock, el festival más largo de la temporada de primavera.",
      },
    ],
  },
  {
    slug: "junio-2026",
    month: "Junio",
    year: 2026,
    isoMonth: "2026-06",
    festivalSlugs: [
      "starlite-marbella",     // 13 jun – sep
      "marenostrum-fuengirola", // 15 jun
      "sonar",                 // 18–20 jun
      "o-son-do-camino",       // 18–20 jun
      "resurrection-fest",     // 25–28 jun
      "tio-pepe-festival",     // 25 jun
      "bbk-music-legends",     // 19–21 jun
    ],
    blurb:
      "Junio 2026 da el pistoletazo de salida al verano festivalero en España. Destacan Sónar en Barcelona (18–20 junio, electrónica de vanguardia, referente mundial), Resurrection Fest en Viveiro (25–28 junio, metal, 40.000 metaleros), O Son do Camiño en Santiago de Compostela (18–20 junio), Starlite Marbella (desde el 13 junio, pop internacional de lujo) y Tío Pepe Festival en Jerez (25 junio). ConcertRide cubre el carpooling a todos sin comisión.",
    searchIntent: "festivales junio 2026 españa",
    faqs: [
      {
        q: "¿Qué festivales hay en junio 2026 en España?",
        a: "Los principales festivales de junio 2026 en España son: Sónar (Barcelona, 18–20 jun, electrónica), O Son do Camiño (Santiago de Compostela, 18–20 jun, pop e indie), BBK Music Legends (Bilbao, 19–21 jun, rock clásico), Resurrection Fest (Viveiro, 25–28 jun, metal), Tío Pepe Festival (Jerez, 25 jun), Starlite Marbella (Marbella, desde 13 jun, pop internacional) y Marenostrum (Fuengirola, desde 15 jun).",
      },
      {
        q: "¿Cómo llegar a Resurrection Fest en junio 2026?",
        a: "Resurrection Fest se celebra en Viveiro (Lugo, Galicia) del 25 al 28 de junio de 2026. Viveiro no tiene tren ni autobús nocturno útil desde otras provincias. La mejor opción es carpooling con ConcertRide: desde A Coruña (80 km, 5–8€/asiento), Oviedo (220 km, 8–12€), Bilbao (390 km, 12–17€) o Madrid (590 km, 16–22€). El festival también tiene buses oficiales desde A Coruña y Lugo (comprar en web del festival con antelación).",
      },
    ],
  },
  {
    slug: "julio-2026",
    month: "Julio",
    year: 2026,
    isoMonth: "2026-07",
    festivalSlugs: [
      "mad-cool",           // 9–11 jul
      "bbk-live",           // 9–11 jul
      "cruilla",            // 9–12 jul
      "festival-ortigueira",// 9–12 jul
      "zevra-festival",     // 1 jul
      "pirineos-sur",       // 10 jul
      "fib",                // 16–19 jul
      "jazzaldia",          // 22–26 jul
      "low-festival",       // 24–26 jul
      "metropoli-gijon",    // 3 jul
      "stone-music-festival", // 10 jul
      "atlantic-fest",      // 17 jul
      "portamerica",        // 9 jul
    ],
    blurb:
      "Julio 2026 es el mes rey de los festivales en España: más de diez festivales simultáneos, los carteles más potentes del año y las temperaturas más altas. La semana del 9–12 de julio concentra Mad Cool (Madrid), BBK Live (Bilbao), Cruïlla (Barcelona) y el Festival de Ortigueira (Galicia) al mismo tiempo. El FIB en Benicàssim (16–19 julio) y Jazzaldia en Donostia (22–26 julio) completan un mes extraordinario. Carpooling sin comisión con ConcertRide.",
    searchIntent: "festivales julio 2026 españa",
    faqs: [
      {
        q: "¿Cuántos festivales hay en julio 2026 en España?",
        a: "Julio es el mes con más festivales en España: Mad Cool (Madrid, 9–11 jul), BBK Live (Bilbao, 9–11 jul), Cruïlla (Barcelona, 9–12 jul), Ortigueira (Galicia, 9–12 jul), Pirineos Sur (Huesca, 10 jul), Stone & Music (Segovia, 10 jul), PortAmérica (Catoira, 9 jul), Metrópoli Gijón (Gijón, 3–6 jul), Atlantic Fest (Ponteceso, 17 jul), FIB (Benicàssim, 16–19 jul), Jazzaldia (Donostia, 22–26 jul), Low Festival (Benidorm, 24–26 jul) y Starlite Marbella continúa desde junio.",
      },
      {
        q: "¿Qué festival es mejor en julio 2026, Mad Cool o BBK Live?",
        a: "Mad Cool (Madrid, 9–11 julio) y BBK Live (Bilbao, 9–11 julio) son ambos excelentes pero diferentes: Mad Cool tiene carteles de rock e indie internacional más grandes (80.000/día, IFEMA Madrid) y es accesible en metro (L8). BBK Live tiene un enclave único en Kobetamendi con vistas a Bilbao, ambiente más íntimo (35.000/día) y fuerte identidad local vasca. Si estás en el norte, BBK Live. Si vienes de fuera de España, Mad Cool tiene más nombre internacional.",
      },
      {
        q: "¿Hay festivales gratuitos en julio 2026 en España?",
        a: "En julio hay conciertos gratuitos en fiestas patronales y ferias municipales de muchas ciudades, pero los festivales de múltiples días con cartel internacional (Mad Cool, BBK Live, FIB, Cruïlla) requieren entrada de pago (40–180 €/día). Jazzaldia en Donostia tiene algunos conciertos gratuitos en la Playa de La Concha (la mitad del programa es gratuito). ConcertRide opera carpooling a todos ellos sin comisión.",
      },
    ],
  },
  {
    slug: "agosto-2026",
    month: "Agosto",
    year: 2026,
    isoMonth: "2026-08",
    festivalSlugs: [
      "arenal-sound",      // 29 jul – 2 ago
      "sonorama-ribera",   // 6–9 ago
      "medusa-festival",   // 12–16 ago
      "reggaeton-beach-festival", // 31 jul – 2 ago
    ],
    blurb:
      "Agosto 2026 es el mes del verano pleno festivalero: temperaturas máximas, ambiente de vacaciones y los festivales más masivos del verano en la costa mediterránea. Arenal Sound en Burriana (29 jul–2 ago, 50.000 asistentes/día, indie + electrónica junto al mar) domina el inicio. Sonorama Ribera en Aranda de Duero (6–9 ago, pop en español, el favorito del indie nacional) y Medusa Festival en Cullera (12–16 ago, 120.000 asistentes, el mayor festival de electrónica de España) completan el mes. Carpooling sin comisión.",
    searchIntent: "festivales agosto 2026 españa",
    faqs: [
      {
        q: "¿Qué festivales hay en agosto 2026 en España?",
        a: "Los principales festivales de agosto 2026 en España son: Arenal Sound (Burriana, Valencia, 29 jul–2 ago, indie y electrónica, 50.000/día), Reggaeton Beach Festival (Salou, 31 jul–2 ago), Sonorama Ribera (Aranda de Duero, 6–9 ago, pop-rock en español), Medusa Festival (Cullera, Valencia, 12–16 ago, techno y house, 120.000 asistentes, el festival de electrónica más grande de España).",
      },
      {
        q: "¿Cómo llegar a Arenal Sound en Burriana?",
        a: "Burriana (Castellón) está a 70 km de Valencia, 320 km de Madrid y 225 km de Barcelona. No hay tren nocturno al recinto desde Valencia. Las opciones son: autobús lanzadera oficial del festival desde Valencia (precio variable, comprar online), taxi VTC desde Burriana ciudad (5 km, 10–15€), o carpooling con ConcertRide: desde Valencia (3–6€/asiento), Madrid (11–16€), Barcelona (8–12€) o Murcia (6–9€). El recinto está junto al mar — aparcar es complicado los días pico.",
      },
      {
        q: "¿Medusa Festival es el mayor festival de electrónica de España?",
        a: "Sí. Medusa Festival en Cullera (Valencia, 12–16 agosto 2026) es el mayor festival de música electrónica de España por aforo, con 120.000 asistentes en cinco días y los mayores DJs del mundo de techno, house, trance y EDM. El segundo festival de electrónica más grande es Sónar (Barcelona, junio), con 130.000 asistentes totales pero en tres días. Para transporte desde Madrid, Barcelona o Murcia a Medusa, ConcertRide ofrece carpooling desde 5–17€/asiento.",
      },
    ],
  },
  {
    slug: "septiembre-2026",
    month: "Septiembre",
    year: 2026,
    isoMonth: "2026-09",
    festivalSlugs: [
      "vive-latino",    // 4–5 sep
      "granada-sound",  // 25–27 sep
    ],
    blurb:
      "Septiembre 2026 ofrece una alternativa al verano masificado con dos festivales muy distintos: Vive Latino España en Zaragoza (4–5 septiembre), la primera edición europea del festival de rock y pop latino más importante del mundo fundado en México DF en 1998, y Granada Sound en Granada (25–27 septiembre), el festival de pop, rock e indie de referencia en Andalucía oriental. Ambos con carpooling sin comisión desde ConcertRide desde cualquier punto de España.",
    searchIntent: "festivales septiembre 2026 españa",
    faqs: [
      {
        q: "¿Qué festivales hay en septiembre 2026 en España?",
        a: "En septiembre 2026 hay dos festivales de música destacados: Vive Latino España (Zaragoza, Recinto Expo, 4–5 septiembre, rock alternativo, cumbia, reggaeton y pop en español, 40.000 personas/día) y Granada Sound (Cortijo del Conde, Granada, 25–27 septiembre, pop/rock/indie, 25.000 asistentes). También continúa Starlite Marbella con conciertos individuales hasta mediados de septiembre.",
      },
      {
        q: "¿Por qué ir a un festival en septiembre en lugar de julio?",
        a: "Septiembre tiene varias ventajas sobre julio para ir a festivales en España: temperaturas más suaves (22–27°C, sin el calor extremo de agosto), precios de alojamiento más bajos, menos masificación, abonos de tren más económicos y menos tráfico en carretera. La contrapartida es que hay muchos menos festivales en septiembre que en julio–agosto. Para los que prefieren el otoño festivalero, Cala Mijas en Málaga (2–4 octubre) extiende la temporada.",
      },
    ],
  },
  {
    slug: "octubre-2026",
    month: "Octubre",
    year: 2026,
    isoMonth: "2026-10",
    festivalSlugs: [
      "cala-mijas", // 2–4 oct
    ],
    blurb:
      "Octubre cierra la temporada festivalera española 2026 con Cala Mijas en Málaga (2–4 octubre), un festival de música electrónica en formato íntimo celebrado en el Cortijo El Atabal de Málaga con DJs de culto y ambient internacional. Es la mejor opción para quienes buscan festivales de otoño en España con clima suave (20–24°C en Málaga en octubre). ConcertRide opera carpooling desde Sevilla (215 km), Granada (130 km), Madrid (540 km) y Almería (215 km).",
    searchIntent: "festivales octubre 2026 españa",
    faqs: [
      {
        q: "¿Hay festivales en octubre 2026 en España?",
        a: "Sí. Cala Mijas (Málaga, 2–4 octubre 2026) es el principal festival de música electrónica de otoño en España, con DJs internacionales de culto en formato más íntimo que los grandes festivales de verano. Fuera de Cala Mijas, octubre tiene principalmente conciertos individuales en sala en toda España. La temporada festivalera al aire libre está prácticamente cerrada en octubre en España.",
      },
      {
        q: "¿Cómo llegar a Cala Mijas en Málaga?",
        a: "Cala Mijas se celebra en el Cortijo El Atabal de Málaga, accesible por la A-357 (salida Campanillas). Desde el centro de Málaga son unos 8 km. Opciones: taxi/VTC desde Málaga (10–15€), autobús lanzadera si el festival lo habilita, o carpooling con ConcertRide desde Sevilla (215 km, 6–10€/asiento), Granada (130 km, 4–7€), Madrid (540 km, 15–20€) o Almería (215 km, 6–10€).",
      },
    ],
  },
];

export const CALENDAR_LANDINGS_BY_SLUG: Record<string, CalendarLanding> = Object.fromEntries(
  CALENDAR_LANDINGS.map((c) => [c.slug, c])
);

export const CALENDAR_SLUGS = CALENDAR_LANDINGS.map((c) => c.slug);

export function getCalendarFestivals(cal: CalendarLanding) {
  return cal.festivalSlugs
    .map((s) => FESTIVAL_LANDINGS_BY_SLUG[s])
    .filter(Boolean);
}

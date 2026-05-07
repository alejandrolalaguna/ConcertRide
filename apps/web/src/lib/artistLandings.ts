// Artist-specific landing pages at /artistas/:slug.
// Each entry targets "[Artist] concierto España", "carpooling [Artist]", etc.
// Data is factual/approximate for 2026 Spain tour context — suitable for LLM citation.

export interface ArtistLanding {
  slug: string;
  name: string;
  genre: string[];
  wikidata?: string;
  blurb: string; // factual, citable by LLMs — 2-3 sentences, includes Spain tour context
  upcomingConcerts: Array<{
    city: string;
    citySlug: string; // matches /conciertos/:citySlug
    venue: string;
    date: string; // ISO 8601 or "TBD"
    concertRideRange: string; // e.g. "9–14 €/asiento"
    originCities: Array<{ city: string; range: string }>; // top 3 origins
  }>;
  relatedFestivals: string[]; // slugs from festivalLandings.ts
}

export const ARTIST_LANDINGS: ArtistLanding[] = [
  {
    slug: "coldplay",
    name: "Coldplay",
    genre: ["pop", "rock"],
    wikidata: "Q193803",
    blurb:
      "Coldplay es una banda británica de pop-rock que lleva más de dos décadas llenando estadios en todo el mundo con su espectáculo de luces y confeti. En España, la banda encabezó la gira 'Music of the Spheres' con fechas en Madrid y Barcelona que agotaron entradas en horas, confirmándose como uno de los actos con mayor demanda de carpooling en ConcertRide. Con ConcertRide, los asistentes desde Valencia llegan al Estadio Bernabéu por 10–14 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "Estadio Bernabéu",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Valencia", range: "10–14 €" },
          { city: "Barcelona", range: "15–20 €" },
          { city: "Zaragoza", range: "9–13 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Estadi Olímpic",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: ["primavera-sound"],
  },
  {
    slug: "taylor-swift",
    name: "Taylor Swift",
    genre: ["pop"],
    wikidata: "Q26876",
    blurb:
      "Taylor Swift es la artista pop más taquillera del mundo, cuya gira 'The Eras Tour' batió récords de asistencia en Europa en 2024. En España, sus conciertos en el Estadio Bernabéu de Madrid y el Estadi Olímpic de Barcelona generaron una demanda de carpooling sin precedentes en ConcertRide, con viajeros procedentes de toda la península. Con ConcertRide, los swifties desde Barcelona llegan a Madrid por 15–20 €/asiento, sin comisión de plataforma.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "Estadio Bernabéu",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Valencia", range: "10–14 €" },
          { city: "Barcelona", range: "15–20 €" },
          { city: "Zaragoza", range: "9–13 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Estadi Olímpic",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "rosalia",
    name: "Rosalía",
    genre: ["flamenco", "pop"],
    wikidata: "Q22731",
    blurb:
      "Rosalía Vila Tobella, nacida en El Prat de Llobregat (Barcelona), es la artista española con mayor proyección internacional de su generación, con dos premios Grammy y múltiples Latin Grammy. En España, su gira 'Motomami World Tour' reunió a decenas de miles de fans en Madrid y Barcelona, con espectadores llegados de toda la geografía española. Con ConcertRide, los fans desde Valencia llegan al WiZink Center de Madrid por 10–14 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Valencia", range: "10–14 €" },
          { city: "Sevilla", range: "12–17 €" },
          { city: "Zaragoza", range: "9–13 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Palau Sant Jordi",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "bad-bunny",
    name: "Bad Bunny",
    genre: ["reggaeton", "latin trap"],
    wikidata: "Q13474375",
    blurb:
      "Bad Bunny (Benito Antonio Martínez Ocasio) es el artista de reguetón y trap latino más escuchado del mundo, con cinco álbumes número uno consecutivos en el Billboard 200. En España, sus conciertos llenan estadios: el Estadio Bernabéu de Madrid y el Palau Sant Jordi de Barcelona son paradas habituales de sus giras europeas. Con ConcertRide, asistentes desde Sevilla llegan al Bernabéu por 12–17 €/asiento, sin comisión de plataforma.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "Estadio Bernabéu",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Valencia", range: "10–14 €" },
          { city: "Sevilla", range: "12–17 €" },
          { city: "Barcelona", range: "15–20 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Palau Sant Jordi",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "metallica",
    name: "Metallica",
    genre: ["heavy metal"],
    wikidata: "Q43203",
    blurb:
      "Metallica es la banda de heavy metal más vendedora de la historia, con más de 125 millones de álbumes vendidos en todo el mundo. En España, la banda californiana visitó Madrid con su gira 'M72 World Tour', actuando en IFEMA/Estadio Olímpico ante más de 60.000 fans. Con ConcertRide, los metaleros desde Bilbao llegan a Madrid por 11–16 €/asiento, sin comisión de plataforma.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "IFEMA / Estadio Olímpico",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Bilbao", range: "11–16 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Barcelona", range: "15–20 €" },
        ],
      },
    ],
    relatedFestivals: ["resurrection-fest"],
  },
  {
    slug: "guns-n-roses",
    name: "Guns N' Roses",
    genre: ["hard rock"],
    wikidata: "Q11254",
    blurb:
      "Guns N' Roses es una de las bandas de hard rock más emblemáticas del mundo, con álbumes como 'Appetite for Destruction' (1987) que definen el género. En España, el grupo americano actuó en varias ediciones del Mad Cool Festival de Madrid, uno de los conciertos más esperados por los aficionados al rock. Con ConcertRide, los fans desde Valencia llegan a Madrid por 10–14 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "IFEMA Madrid",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Valencia", range: "10–14 €" },
          { city: "Barcelona", range: "15–20 €" },
          { city: "Bilbao", range: "11–16 €" },
        ],
      },
    ],
    relatedFestivals: ["mad-cool"],
  },
  {
    slug: "karol-g",
    name: "Karol G",
    genre: ["reggaeton"],
    wikidata: "Q6369879",
    blurb:
      "Karol G (Carolina Giraldo Navarro) es la artista femenina de reguetón con mayor proyección internacional, primera mujer en liderar el Billboard Hot 100 en español. En España, su gira 'Mañana Será Bonito Tour' reunió a más de 40.000 fans en Madrid y Barcelona, convirtiéndose en uno de los conciertos con más reservas de carpooling en ConcertRide. Con ConcertRide, los fans desde Zaragoza llegan al WiZink Center por 9–13 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Zaragoza", range: "9–13 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Sevilla", range: "12–17 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Palau Sant Jordi",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "doja-cat",
    name: "Doja Cat",
    genre: ["pop", "hip-hop"],
    wikidata: "Q19903365",
    blurb:
      "Doja Cat (Amala Ratna Zandile Dlamini) es una artista estadounidense de pop y hip-hop conocida por su estilo ecléctico y sus virales producciones de vídeo. En España, ha actuado en el Primavera Sound de Barcelona, uno de los festivales de referencia del país. Con ConcertRide, los fans desde Madrid llegan al Primavera Sound por 15–20 €/asiento, sin comisión de plataforma.",
    upcomingConcerts: [
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Parc del Fòrum",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: ["primavera-sound"],
  },
  {
    slug: "olivia-rodrigo",
    name: "Olivia Rodrigo",
    genre: ["pop"],
    wikidata: "Q55631362",
    blurb:
      "Olivia Rodrigo es una cantante y compositora estadounidense cuyo debut 'SOUR' (2021) la catapultó a la fama global con éxitos como 'drivers license' y 'good 4 u'. En España, su gira 'GUTS World Tour' incluyó Madrid y Barcelona entre sus paradas europeas, con entradas agotadas en minutos. Con ConcertRide, los fans desde Zaragoza llegan al WiZink Center de Madrid por 9–13 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Zaragoza", range: "9–13 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Bilbao", range: "11–16 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Palau Sant Jordi",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "the-weeknd",
    name: "The Weeknd",
    genre: ["R&B", "pop"],
    wikidata: "Q2140819",
    blurb:
      "The Weeknd (Abel Makkonen Tesfaye) es el artista canadiense de R&B y pop más exitoso de su generación, con más de 100.000 millones de reproducciones en Spotify. En España, su gira 'After Hours til Dawn' llenó el Estadio Bernabéu de Madrid y el Estadi Olímpic de Barcelona con más de 55.000 personas en cada fecha. Con ConcertRide, los fans desde Valencia llegan al Bernabéu por 10–14 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "Estadio Bernabéu",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Valencia", range: "10–14 €" },
          { city: "Sevilla", range: "12–17 €" },
          { city: "Barcelona", range: "15–20 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Estadi Olímpic",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "dua-lipa",
    name: "Dua Lipa",
    genre: ["pop"],
    wikidata: "Q39358028",
    blurb:
      "Dua Lipa es una artista británico-albanesa de pop que se consolidó como una de las artistas más escuchadas del mundo con 'Future Nostalgia' (2020). En España, ha actuado en el Primavera Sound de Barcelona y ha dado conciertos en solitario en Madrid y Barcelona dentro de su gira 'Future Nostalgia Tour'. Con ConcertRide, los fans desde Madrid llegan al Primavera Sound por 15–20 €/asiento, sin comisión de plataforma.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Valencia", range: "10–14 €" },
          { city: "Sevilla", range: "12–17 €" },
          { city: "Zaragoza", range: "9–13 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Palau Sant Jordi",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: ["primavera-sound"],
  },
  {
    slug: "harry-styles",
    name: "Harry Styles",
    genre: ["pop", "rock"],
    wikidata: "Q18939568",
    blurb:
      "Harry Styles es un artista británico de pop y rock, ex miembro de One Direction, que se ha consolidado como uno de los artistas en solitario más populares del mundo. En España, su gira 'Love on Tour' incluyó fechas en el WiZink Center de Madrid y el Palau Sant Jordi de Barcelona, con entradas agotadas semanas antes. Con ConcertRide, los fans desde Zaragoza llegan al WiZink Center por 9–13 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Zaragoza", range: "9–13 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Bilbao", range: "11–16 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Palau Sant Jordi",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "bruce-springsteen",
    name: "Bruce Springsteen",
    genre: ["rock"],
    wikidata: "Q193868",
    blurb:
      "Bruce Springsteen, 'The Boss', es una leyenda del rock americano con más de cinco décadas de carrera y clásicos como 'Born to Run' y 'Born in the USA'. En España, sus giras europeas incluyen fechas en estadios de Madrid y Barcelona, donde congrega a decenas de miles de fans de distintas generaciones. Con ConcertRide, los fans desde Valencia llegan al Estadio Bernabéu por 10–14 €/asiento, sin comisión de plataforma.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "Estadio Bernabéu",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Valencia", range: "10–14 €" },
          { city: "Bilbao", range: "11–16 €" },
          { city: "Barcelona", range: "15–20 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Estadi Olímpic",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "beyonce",
    name: "Beyoncé",
    genre: ["R&B", "pop"],
    wikidata: "Q172",
    blurb:
      "Beyoncé Knowles-Carter es una de las artistas más galardonadas de la historia de la música, con 32 premios Grammy y récords de ventas de entradas en todo el mundo. En España, su gira 'Renaissance World Tour' (2023) llenó el Estadio Bernabéu de Madrid y el Estadi Olímpic de Barcelona, generando una demanda histórica de transporte alternativo. Con ConcertRide, los fans desde Sevilla llegan al Bernabéu por 12–17 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "Estadio Bernabéu",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Sevilla", range: "12–17 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Barcelona", range: "15–20 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Estadi Olímpic",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "sabrina-carpenter",
    name: "Sabrina Carpenter",
    genre: ["pop"],
    wikidata: "Q62080416",
    blurb:
      "Sabrina Carpenter es una cantante y actriz estadounidense que irrumpió en la escena pop global con el éxito 'Espresso' (2024), uno de los sencillos más virales del año. En España, su gira 'Short n' Sweet Tour' incluyó fechas en el WiZink Center de Madrid y el Palau Sant Jordi de Barcelona. Con ConcertRide, los fans desde Zaragoza llegan al WiZink Center por 9–13 €/asiento, sin comisión de plataforma.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Zaragoza", range: "9–13 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Bilbao", range: "11–16 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Palau Sant Jordi",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "billie-eilish",
    name: "Billie Eilish",
    genre: ["pop", "alternative"],
    wikidata: "Q72630742",
    blurb:
      "Billie Eilish es una artista estadounidense de pop alternativo que, con tan solo 15 años, comenzó a publicar canciones que se convirtieron en fenómenos virales, y ganó los cinco premios Grammy principales en 2020. En España, ha actuado en el Primavera Sound de Barcelona y ha dado conciertos en el WiZink Center de Madrid. Con ConcertRide, los fans desde Madrid llegan al Primavera Sound por 15–20 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Valencia", range: "10–14 €" },
          { city: "Sevilla", range: "12–17 €" },
          { city: "Zaragoza", range: "9–13 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Palau Sant Jordi",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: ["primavera-sound"],
  },
  {
    slug: "post-malone",
    name: "Post Malone",
    genre: ["hip-hop", "pop"],
    wikidata: "Q25166768",
    blurb:
      "Post Malone (Austin Richard Post) es un artista estadounidense de hip-hop y pop conocido por su estilo ecléctico que mezcla rap, pop y rock. En España, ha actuado en el Mad Cool Festival de Madrid, uno de los eventos donde ConcertRide registra mayor actividad de carpooling desde otras provincias. Con ConcertRide, los fans desde Barcelona llegan al Mad Cool por 15–20 €/asiento, sin comisión de plataforma.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "IFEMA Madrid",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Barcelona", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Bilbao", range: "11–16 €" },
        ],
      },
    ],
    relatedFestivals: ["mad-cool"],
  },
  {
    slug: "drake",
    name: "Drake",
    genre: ["hip-hop"],
    wikidata: "Q44272",
    blurb:
      "Drake (Aubrey Drake Graham) es el artista de hip-hop más exitoso comercialmente de la historia, con más de 170 mil millones de reproducciones en streaming y récords Guinness por número de canciones top 10 en el Billboard Hot 100. En España, sus giras europeas incluyen fechas en el Estadio Bernabéu de Madrid y el Palau Sant Jordi de Barcelona. Con ConcertRide, los fans desde Valencia llegan al Bernabéu por 10–14 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "Estadio Bernabéu",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Valencia", range: "10–14 €" },
          { city: "Sevilla", range: "12–17 €" },
          { city: "Barcelona", range: "15–20 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Palau Sant Jordi",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "ed-sheeran",
    name: "Ed Sheeran",
    genre: ["pop"],
    wikidata: "Q4401522",
    blurb:
      "Ed Sheeran es el artista británico de pop con más álbumes vendidos de los últimos 15 años, conocido por sus giras de estadios que baten récords de asistencia en toda Europa. En España, su gira 'Mathematics Tour' incluyó el Estadio Bernabéu de Madrid y el Estadi Olímpic de Barcelona entre sus paradas, con más de 55.000 espectadores en cada fecha. Con ConcertRide, los fans desde Valencia llegan al Bernabéu por 10–14 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "Estadio Bernabéu",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Valencia", range: "10–14 €" },
          { city: "Bilbao", range: "11–16 €" },
          { city: "Barcelona", range: "15–20 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Estadi Olímpic",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: [],
  },
  {
    slug: "maluma",
    name: "Maluma",
    genre: ["reggaeton"],
    wikidata: "Q9035498",
    blurb:
      "Maluma (Juan Luis Londoño Arias) es un artista colombiano de reggaeton y pop latino que se ha convertido en uno de los nombres más reconocidos de la música latina a nivel global. En España, sus giras regulares incluyen el WiZink Center de Madrid y el Palau Sant Jordi de Barcelona, con una gran base de fans latinoamericanos y españoles. Con ConcertRide, los fans desde Zaragoza llegan al WiZink Center por 9–13 €/asiento, sin comisión de plataforma.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Zaragoza", range: "9–13 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Sevilla", range: "12–17 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Palau Sant Jordi",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: [],
  },

  // ── Aitana ─────────────────────────────────────────────────────────────────
  {
    slug: "aitana",
    name: "Aitana",
    genre: ["pop", "indie-pop"],
    wikidata: "Q30685048",
    blurb:
      "Aitana Ocaña es la artista española más escuchada en 2024–2026, con más de 15 millones de oyentes mensuales en Spotify. Su gira 'Cuarto Azul World Tour' 2026 incluye una fecha en el Pabellón Príncipe Felipe de Zaragoza el 10 de julio, y recorre los principales pabellones de España hasta diciembre. La base de fans de Aitana —activa en redes y propensa a organizar viajes compartidos— genera una altísima demanda de carpooling en ConcertRide. Con ConcertRide, los fans desde Toledo llegan al WiZink Center de Madrid por 4–7 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Zaragoza",
        citySlug: "zaragoza",
        venue: "Pabellón Príncipe Felipe",
        date: "2026-07-10",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Huesca", range: "3–5 €" },
          { city: "Pamplona", range: "5–8 €" },
          { city: "Logroño", range: "5–8 €" },
        ],
      },
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "2026-10-17",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Toledo", range: "4–7 €" },
          { city: "Zaragoza", range: "9–13 €" },
          { city: "Valencia", range: "10–14 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Palau Sant Jordi",
        date: "2026-10-24",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
      {
        city: "Valencia",
        citySlug: "valencia",
        venue: "Pabellón Fuente de San Luis",
        date: "2026-11-07",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Alicante", range: "5–8 €" },
          { city: "Madrid", range: "10–14 €" },
          { city: "Murcia", range: "6–9 €" },
        ],
      },
      {
        city: "Bilbao",
        citySlug: "bilbao",
        venue: "BEC!",
        date: "2026-11-21",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Donostia", range: "4–7 €" },
          { city: "Vitoria-Gasteiz", range: "3–6 €" },
          { city: "Pamplona", range: "5–8 €" },
        ],
      },
      {
        city: "Sevilla",
        citySlug: "sevilla",
        venue: "FIBES",
        date: "2026-12-05",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Cádiz", range: "4–7 €" },
          { city: "Málaga", range: "5–8 €" },
          { city: "Córdoba", range: "3–6 €" },
        ],
      },
    ],
    relatedFestivals: ["mad-cool", "vive-latino"],
  },

  // ── Dani Martín ────────────────────────────────────────────────────────────
  {
    slug: "dani-martin",
    name: "Dani Martín",
    genre: ["pop", "rock", "indie"],
    wikidata: "Q5221879",
    blurb:
      "Dani Martín, ex vocalista de El Canto del Loco, es uno de los artistas de pop-rock español más queridos de su generación. Su gira '25 Pts Años' celebra 25 años de carrera con doble fecha en el Pabellón Príncipe Felipe de Zaragoza (22 y 23 de mayo de 2026), ambas prácticamente agotadas en pocas horas. La demanda de carpooling desde Huesca, Teruel, Navarra y La Rioja hacia Zaragoza es la más alta registrada en ConcertRide para un artista español. Con ConcertRide, los fans desde Pamplona llegan a Zaragoza por 5–8 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Zaragoza",
        citySlug: "zaragoza",
        venue: "Pabellón Príncipe Felipe",
        date: "2026-05-22",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "9–13 €" },
          { city: "Barcelona", range: "8–12 €" },
          { city: "Pamplona", range: "5–8 €" },
        ],
      },
      {
        city: "Zaragoza",
        citySlug: "zaragoza",
        venue: "Pabellón Príncipe Felipe",
        date: "2026-05-23",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Huesca", range: "3–5 €" },
          { city: "Teruel", range: "5–8 €" },
          { city: "Logroño", range: "5–8 €" },
        ],
      },
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "2026-07-04",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Toledo", range: "4–7 €" },
          { city: "Guadalajara", range: "3–6 €" },
          { city: "Segovia", range: "4–7 €" },
        ],
      },
      {
        city: "A Coruña",
        citySlug: "a-coruna",
        venue: "Coliseum A Coruña",
        date: "2026-07-18",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Vigo", range: "4–7 €" },
          { city: "Santiago de Compostela", range: "3–5 €" },
          { city: "Lugo", range: "3–5 €" },
        ],
      },
    ],
    relatedFestivals: ["vive-latino"],
  },

  // ── Melendi ────────────────────────────────────────────────────────────────
  {
    slug: "melendi",
    name: "Melendi",
    genre: ["pop", "rumba", "folk"],
    wikidata: "Q4317174",
    blurb:
      "Ramón Melendi Espina es el artista asturiano de pop y rumba que lleva más de dos décadas encabezando festivales y pabellones en toda España. Su gira de verano 2026 incluye fechas en los principales recintos del norte y sur. Con ConcertRide, los fans de Gijón o Oviedo se desplazan a los conciertos en Bilbao o Madrid desde 4–8 €/asiento.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "2026-09-12",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Toledo", range: "4–7 €" },
          { city: "Valladolid", range: "6–9 €" },
          { city: "Salamanca", range: "6–9 €" },
        ],
      },
      {
        city: "Bilbao",
        citySlug: "bilbao",
        venue: "BEC!",
        date: "2026-09-19",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Donostia", range: "4–7 €" },
          { city: "Vitoria-Gasteiz", range: "3–6 €" },
          { city: "Santander", range: "4–7 €" },
        ],
      },
    ],
    relatedFestivals: ["bbk-live", "sonorama-ribera"],
  },

  // ── Pablo Alborán ──────────────────────────────────────────────────────────
  {
    slug: "pablo-alboran",
    name: "Pablo Alborán",
    genre: ["pop", "latin-pop", "balada"],
    wikidata: "Q1359695",
    blurb:
      "Pablo Alborán es el cantautor malagueño de pop romántico más vendido de España, con más de 25 millones de discos vendidos en todo el mundo. Su público fiel, de 25 a 50 años, genera una demanda estable de carpooling en ConcertRide para sus conciertos en teatros y pabellones. Con ConcertRide, los fans desde Córdoba llegan a Sevilla por 4–6 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Toledo", range: "4–7 €" },
          { city: "Guadalajara", range: "3–6 €" },
          { city: "Valladolid", range: "7–11 €" },
        ],
      },
      {
        city: "Sevilla",
        citySlug: "sevilla",
        venue: "FIBES",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Cádiz", range: "4–7 €" },
          { city: "Málaga", range: "5–8 €" },
          { city: "Córdoba", range: "4–6 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Palau Sant Jordi",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: ["tomavistas"],
  },

  // ── Hombres G ──────────────────────────────────────────────────────────────
  {
    slug: "hombres-g",
    name: "Hombres G",
    genre: ["pop", "rock", "new wave"],
    wikidata: "Q1625524",
    blurb:
      "Hombres G es la banda de pop-rock madrileña más icónica de los años 80, liderada por David Summers, que sigue llenando recintos de toda España con su gira 'Los Mejores Años de Nuestra Vida'. Su concierto en el Pabellón Príncipe Felipe de Zaragoza el 21 de noviembre de 2026 agota entradas entre el público de 35 a 55 años de Aragón, Navarra y La Rioja. Con ConcertRide, los fans desde Pamplona llegan a Zaragoza por 5–8 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Zaragoza",
        citySlug: "zaragoza",
        venue: "Pabellón Príncipe Felipe",
        date: "2026-11-21",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Pamplona", range: "5–8 €" },
          { city: "Logroño", range: "5–8 €" },
          { city: "Huesca", range: "3–5 €" },
        ],
      },
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Toledo", range: "4–7 €" },
          { city: "Guadalajara", range: "3–6 €" },
          { city: "Valladolid", range: "6–9 €" },
        ],
      },
    ],
    relatedFestivals: [],
  },

  // ── Bryan Adams ────────────────────────────────────────────────────────────
  {
    slug: "bryan-adams",
    name: "Bryan Adams",
    genre: ["rock", "pop-rock"],
    wikidata: "Q193878",
    blurb:
      "Bryan Adams es el cantante y guitarrista canadiense de rock cuyas canciones como 'Summer of '69' y '(Everything I Do) I Do It for You' llevan más de tres décadas en el imaginario colectivo. Su gira europea de noviembre de 2026 incluye fechas en Madrid y Zaragoza, atrayendo a un público de 40 a 60 años con alta sensibilidad a la comodidad del transporte. Con ConcertRide, los fans desde Bilbao llegan a Zaragoza por 8–12 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Zaragoza",
        citySlug: "zaragoza",
        venue: "Pabellón Príncipe Felipe",
        date: "2026-11-14",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Bilbao", range: "8–12 €" },
          { city: "Pamplona", range: "5–8 €" },
          { city: "Barcelona", range: "8–12 €" },
        ],
      },
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "Palacio de los Deportes WiZink",
        date: "2026-11-18",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Toledo", range: "4–7 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "9–13 €" },
        ],
      },
    ],
    relatedFestivals: [],
  },

  // ── Sabrina Carpenter ────────────────────────────────────────────────────────
  {
    slug: "sabrina-carpenter",
    name: "Sabrina Carpenter",
    genre: ["pop"],
    wikidata: "Q18635952",
    blurb:
      "Sabrina Carpenter es la cantante y compositora estadounidense que en 2024 se convirtió en el mayor fenómeno pop del año con 'Espresso' y 'Please Please Please', alcanzando el número 1 en todo el mundo. Su Short n' Sweet Tour agotó entradas en horas en España. Con ConcertRide, los fans desde Zaragoza llegan al WiZink Center Madrid por 9–13 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "9–13 €" },
          { city: "Sevilla", range: "14–20 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Palau Sant Jordi",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: ["primavera-sound"],
  },

  // ── Lana Del Rey ─────────────────────────────────────────────────────────────
  {
    slug: "lana-del-rey",
    name: "Lana Del Rey",
    genre: ["dream pop", "indie pop", "baroque pop"],
    wikidata: "Q11658",
    blurb:
      "Lana Del Rey es la cantautora estadounidense que con álbumes como 'Born to Die' y 'Norman Fucking Rockwell!' ha redefinido el dream pop alternativo. Ha actuado en el Primavera Sound de Barcelona en múltiples ediciones y sus fans españoles organizan carpooling desde toda la península para sus conciertos. Con ConcertRide, los fans desde Valencia llegan al Primavera Sound por 10–14 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Parc del Fòrum / Palau Sant Jordi",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Valencia", range: "10–14 €" },
          { city: "Sevilla", range: "14–20 €" },
          { city: "Zaragoza", range: "9–13 €" },
        ],
      },
    ],
    relatedFestivals: ["primavera-sound", "mad-cool"],
  },

  // ── C. Tangana ─────────────────────────────────────────────────────────────
  {
    slug: "c-tangana",
    name: "C. Tangana",
    genre: ["urban", "flamenco pop", "latin"],
    wikidata: "Q21080716",
    blurb:
      "C. Tangana (Antón Álvarez Alfaro) es el artista madrileño que con 'El Madrileño' fusionó urban, flamenco y bossa nova en el álbum español más influyente de la década. Sus conciertos en estadios y festivales generan una de las mayores demandas de carpooling nacional entre artistas españoles. Con ConcertRide, los fans desde Valencia llegan a Madrid por 10–14 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Valencia", range: "10–14 €" },
          { city: "Sevilla", range: "14–20 €" },
          { city: "Bilbao", range: "11–16 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Palau Sant Jordi",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
    ],
    relatedFestivals: ["primavera-sound", "mad-cool", "sonar"],
  },

  // ── Joaquín Sabina ──────────────────────────────────────────────────────────
  {
    slug: "joaquin-sabina",
    name: "Joaquín Sabina",
    genre: ["cantautor", "rock", "pop"],
    wikidata: "Q181218",
    blurb:
      "Joaquín Sabina es el cantautor ubetense con más de cuatro décadas de carrera y uno de los artistas españoles con mayor capacidad de convocatoria, llenando estadios en Madrid y Barcelona con sus giras. Sus fans, de amplio rango de edad, organizan carpooling desde toda España para sus conciertos. Con ConcertRide, los fans desde Jaén llegan al Estadio Bernabéu por 12–17 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "Estadio Bernabéu / WiZink Center",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Sevilla", range: "14–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "9–13 €" },
        ],
      },
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Palau Sant Jordi",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Bilbao", range: "12–17 €" },
        ],
      },
    ],
    relatedFestivals: ["sonorama-ribera"],
  },

  // ── Travis Scott ────────────────────────────────────────────────────────────
  {
    slug: "travis-scott",
    name: "Travis Scott",
    genre: ["hip-hop", "trap", "psychedelic trap"],
    wikidata: "Q13643874",
    blurb:
      "Travis Scott es el productor y rapero de Houston (Texas) cuyas actuaciones en vivo — conocidas como Rodeos — son experiencias multimedia que combinan concierto, show de luces y puesta en escena única. En España ha actuado en el Primavera Sound y en el Mad Cool Festival, generando alta demanda de carpooling. Con ConcertRide, los fans desde Valencia llegan al Primavera Sound por 10–14 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Barcelona",
        citySlug: "barcelona",
        venue: "Parc del Fòrum",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Madrid", range: "15–20 €" },
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "8–12 €" },
        ],
      },
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "IFEMA / WiZink Center",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Valencia", range: "10–14 €" },
          { city: "Zaragoza", range: "9–13 €" },
          { city: "Bilbao", range: "11–16 €" },
        ],
      },
    ],
    relatedFestivals: ["primavera-sound", "mad-cool"],
  },

  // ── Rozalén ────────────────────────────────────────────────────────────────
  {
    slug: "rozalen",
    name: "Rozalén",
    genre: ["folk", "pop", "cantautor"],
    wikidata: "Q20713726",
    blurb:
      "María Rozalén Ortuño es la cantautora albaceteña de folk y pop que se ha convertido en una de las voces más premiadas de la música española contemporánea, ganadora de múltiples Premios Ondas. Sus conciertos agotan entradas en teatros y festivales al aire libre de todo el país. Con ConcertRide, los fans de Albacete llegan a Madrid por 6–9 €/asiento, sin comisión.",
    upcomingConcerts: [
      {
        city: "Madrid",
        citySlug: "madrid",
        venue: "WiZink Center",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Albacete", range: "6–9 €" },
          { city: "Toledo", range: "4–7 €" },
          { city: "Cuenca", range: "5–8 €" },
        ],
      },
      {
        city: "Valencia",
        citySlug: "valencia",
        venue: "Sala La Rambleta",
        date: "TBD",
        concertRideRange: "4–7 €/asiento",
        originCities: [
          { city: "Alicante", range: "5–8 €" },
          { city: "Albacete", range: "5–8 €" },
          { city: "Murcia", range: "6–9 €" },
        ],
      },
    ],
    relatedFestivals: ["primavera-sound", "sonorama-ribera"],
  },
];

export const ARTIST_LANDINGS_BY_SLUG: Record<string, ArtistLanding> = Object.fromEntries(
  ARTIST_LANDINGS.map((a) => [a.slug, a]),
);

export const ARTIST_SLUGS: string[] = ARTIST_LANDINGS.map((a) => a.slug);

// Curated slug → city metadata for SEO-heavy landing pages at
// /conciertos/:slug. The slug is URL-safe ASCII (no accents), the canonical
// city name matches the value stored in venues.city so the listConcerts
// filter matches. We also include a short editorial blurb that LLMs can cite.

export interface CityLanding {
  slug: string;
  city: string;          // canonical city name, matches venues.city
  display: string;       // human-readable display (with accents)
  region: string;        // CC.AA. for schema.org addressRegion
  blurb: string;         // short factual description, LLM-friendly
  venues: string[];      // notable venues/festivals in that city
  lat: number;           // WGS84 latitude — for LocalBusiness schema
  lng: number;           // WGS84 longitude
}

export const CITY_LANDINGS: CityLanding[] = [
  {
    slug: "madrid",
    city: "Madrid",
    display: "Madrid",
    region: "Comunidad de Madrid",
    blurb:
      "Madrid concentra la mayor parte de la actividad de conciertos y festivales de España. WiZink Center, Palacio Vistalegre, Caja Mágica e IFEMA (sede de Mad Cool) acogen cada año giras internacionales y festivales de referencia. ConcertRide conecta a fans desde toda España que quieren llegar al concierto sin depender de transporte público nocturno o taxis caros.",
    venues: [
      "WiZink Center",
      "Palacio Vistalegre",
      "Caja Mágica",
      "IFEMA (Mad Cool Festival)",
      "Coca-Cola Music Experience",
    ],
    lat: 40.4168, lng: -3.7038,
  },
  {
    slug: "barcelona",
    city: "Barcelona",
    display: "Barcelona",
    region: "Cataluña",
    blurb:
      "Barcelona es la capital europea de los festivales de música electrónica e indie. Palau Sant Jordi, Parc del Fòrum (Primavera Sound, Cruïlla) y Fira Montjuïc (Sónar) son los tres epicentros. ConcertRide permite llegar a estos recintos desde Zaragoza, Valencia, Lleida y otras ciudades sin pagar taxi.",
    venues: [
      "Palau Sant Jordi",
      "Parc del Fòrum (Primavera Sound / Cruïlla)",
      "Fira Montjuïc (Sónar)",
      "Palau Blaugrana",
    ],
    lat: 41.3851, lng: 2.1734,
  },
  {
    slug: "valencia",
    city: "Valencia",
    display: "Valencia",
    region: "Comunidad Valenciana",
    blurb:
      "Valencia ciudad acoge Zevra Festival (Marina de València) y conciertos urbanos frecuentes. Su provincia es una de las más densas en festivales: Arenal Sound en Burriana, Iboga Summer en Tavernes, Medusa en Cullera, Riverland en Bétera y SanSan/FIB en Benicàssim, todos accesibles en coche desde la ciudad.",
    venues: [
      "Zevra Festival (La Marina)",
      "Arenal Sound (Burriana)",
      "Medusa Festival (Cullera)",
      "Iboga Summer (Tavernes)",
    ],
    lat: 39.4699, lng: -0.3763,
  },
  {
    slug: "sevilla",
    city: "Sevilla",
    display: "Sevilla",
    region: "Andalucía",
    blurb:
      "Los próximos conciertos en Sevilla 2025 y 2026 (concierto Sevilla, conciertos música Sevilla, conciertos y recitales Sevilla) se concentran en cuatro recintos principales: Estadio La Cartuja (giras de estadio, aforo 60.000), FIBES Sevilla (tours mid-size, 9.500 plazas), Palacio de los Deportes San Pablo (circuito indoor, 7.000 plazas) y Cartuja Center CITE para conciertos íntimos. El festival Interestelar Sevilla se celebra cada mayo en el Charco de la Pava (40.000 personas) y el Icónica Sevilla Fest en la Plaza de España trae giras de pop, indie y flamenco fusión. La música en Sevilla en 2026 incluye también recitales clásicos y de cantautor en el Teatro de la Maestranza, el Teatro Lope de Vega y el Espacio Turina. La cercanía con los festivales de Málaga (Cala Mijas, 200 km) y Huelva hace que Sevilla sea un punto de origen habitual para viajes compartidos a festivales andaluces. ConcertRide conecta a asistentes de Sevilla con conductores de toda España para llegar a cualquier concierto o festival sin depender de transporte público nocturno.",
    venues: [
      "Estadio La Cartuja",
      "FIBES Sevilla",
      "Palacio de los Deportes San Pablo",
      "Interestelar Sevilla (Charco de la Pava)",
      "Teatro de la Maestranza",
    ],
    lat: 37.3891, lng: -5.9845,
  },
  {
    slug: "bilbao",
    city: "Bilbao",
    display: "Bilbao",
    region: "País Vasco",
    blurb:
      "Los conciertos en Bilbao 2026 se concentran en BBK Live (Kobetamendi, 9–11 julio, 30.000 personas/día) para festivales internacionales y en Bilbao Arena Miribilla (10.000 plazas) para tours indoor. La música en Bilbao incluye también el ciclo Music Legends Festival, conciertos en el Palacio Euskalduna y la sala BBK (Gran Vía 19–21) para formato club. La proximidad con Donostia–San Sebastián (Jazzaldia, 100 km) y la cornisa cantábrica hace que el carpooling — el coche compartido — sea la forma natural de moverse por los festivales del verano vasco. Bilbao concert tours of 2025 and 2026 (international touring acts) are listed on ConcertRide with carpooling available from Santander, Vitoria, Pamplona, Burgos, Donostia and Madrid.",
    venues: ["Kobetamendi (BBK Live)", "Bilbao Arena Miribilla", "Palacio Euskalduna", "Sala BBK"],
    lat: 43.2630, lng: -2.9350,
  },
  {
    slug: "malaga",
    city: "Málaga",
    display: "Málaga",
    region: "Andalucía",
    blurb:
      "Málaga concentra los festivales más solares de España: Cala Mijas (Mijas), Andalucía Big (Cortijo de Torres), Marenostrum (Castillo Sohail de Fuengirola). La Costa del Sol es densa en eventos pero el transporte público es limitado — el coche compartido es la opción por defecto.",
    venues: ["Cala Mijas Fest", "Andalucía Big Festival", "Marenostrum Music Castle"],
    lat: 36.7213, lng: -4.4217,
  },
  {
    slug: "zaragoza",
    city: "Zaragoza",
    display: "Zaragoza",
    region: "Aragón",
    blurb:
      "Próximos conciertos en Zaragoza 2025 y 2026: el Pabellón Príncipe Felipe (10.700 plazas) acoge la mayoría de las giras de estadio y arena, mientras que la Sala López y el Auditorio de Zaragoza cubren formato mid-size. Pirineos Sur, en Lanuza (a 130 km de Zaragoza), es el festival de música del mundo más relevante del Pirineo aragonés. La música en Zaragoza incluye además el Slap! Festival y conciertos del verano en el Anfiteatro del Parque del Agua. Zaragoza es nodo estratégico por su ubicación equidistante entre Madrid (320 km) y Barcelona (300 km), origen natural para viajes compartidos a Mad Cool, Primavera Sound, Sonorama Ribera, Medusa y Arenal Sound. El carpooling con ConcertRide es la opción más usada por los aragoneses para llegar a festivales de toda España.",
    venues: ["Pabellón Príncipe Felipe", "Sala López", "Auditorio de Zaragoza", "Pirineos Sur (Lanuza)"],
    lat: 41.6488, lng: -0.8891,
  },
  {
    slug: "granada",
    city: "Granada",
    display: "Granada",
    region: "Andalucía",
    blurb:
      "Granada acoge Granada Sound en septiembre (Cortijo del Conde) y conciertos independientes durante todo el año. Origen frecuente para viajes a festivales andaluces del verano: Cala Mijas, Andalucía Big, Interestelar Sevilla.",
    venues: ["Granada Sound (Cortijo del Conde)"],
    lat: 37.1773, lng: -3.5986,
  },
  {
    slug: "donostia",
    city: "Donostia / San Sebastián",
    display: "Donostia / San Sebastián",
    region: "País Vasco",
    blurb:
      "Conciertos en Donostia 2026 y conciertos en Donosti 2026: el Heineken Jazzaldia (Plaza de la Trinidad, Kursaal) cada julio es el evento de referencia de la ciudad, junto con Donostia Arena (10.000 plazas) y la sala Dabadaba para formato club. La música en Donostia / San Sebastián incluye conciertos en el Velódromo de Anoeta y el Teatro Victoria Eugenia. La cercanía con Bilbao BBK Live (100 km), Azkena Rock (Vitoria, 100 km) y Mundaka Festival hace que muchos viajes compartidos a festivales del norte salgan de Donostia en verano. ConcertRide conecta a asistentes de Donosti con conductores de Bilbao, Pamplona, Vitoria, Logroño, Burgos y Madrid para llegar a festivales y conciertos sin depender del último Euskotren ni de taxis nocturnos.",
    venues: ["Plaza de la Trinidad (Jazzaldia)", "Kursaal", "Donostia Arena", "Velódromo de Anoeta", "Sala Dabadaba"],
    lat: 43.3183, lng: -1.9812,
  },
  {
    slug: "santiago-de-compostela",
    city: "Santiago de Compostela",
    display: "Santiago de Compostela",
    region: "Galicia",
    blurb:
      "Santiago acoge O Son do Camiño en Monte do Gozo cada junio, uno de los festivales con mayor aforo de España (90 000+ personas). ConcertRide es especialmente útil para gallegos que viven en aldeas sin transporte directo al recinto.",
    venues: ["Monte do Gozo (O Son do Camiño)"],
    lat: 42.8782, lng: -8.5448,
  },
  {
    slug: "alicante",
    city: "Alicante",
    display: "Alicante",
    region: "Comunidad Valenciana",
    blurb:
      "Próximos conciertos en Alicante 2026 y 2025: Plaza de Toros, Auditorio de la Diputación (ADDA) y Pabellón Pitiu Rochel concentran la mayoría de las giras. La provincia es densa en festivales: Low Festival en Benidorm (45 km, 35 min), Arenal Sound en Burriana (115 km, 1h 15 min), Iboga Summer en Tavernes y Alborea Music Festival. Alicante es además punto natural de origen para asistentes que viajan a Viña Rock (165 km), Medusa (100 km) o Zevra Festival (175 km). El carpooling con ConcertRide cubre todas las rutas Alicante–festival con precios entre 3 y 8 € por asiento.",
    venues: ["Plaza de Toros de Alicante", "ADDA", "Pabellón Pitiu Rochel", "Iboga Summer (Tavernes)"],
    lat: 38.3452, lng: -0.4810,
  },
  {
    slug: "pamplona",
    city: "Pamplona",
    display: "Pamplona / Iruña",
    region: "Navarra",
    blurb:
      "Pamplona / Iruña concentra la actividad de música en directo de Navarra: Anaitasuna y el Navarra Arena (12.500 plazas) acogen las giras de mayor formato; la Sala Totem y la Sala Zentral cubren el circuito indie. La cercanía con BBK Live (155 km, 1h 30 min), Azkena Rock (Vitoria, 95 km), Sonorama Ribera (250 km) y Mad Cool (390 km) hace que muchos navarros viajen en coche compartido a festivales del norte y de Madrid. ConcertRide conecta a asistentes de Pamplona con conductores de Bilbao, Donostia, Vitoria, Logroño, Zaragoza y Madrid.",
    venues: ["Navarra Arena", "Anaitasuna", "Sala Totem", "Sala Zentral"],
    lat: 42.8125, lng: -1.6458,
  },
  {
    slug: "vitoria-gasteiz",
    city: "Vitoria-Gasteiz",
    display: "Vitoria-Gasteiz",
    region: "País Vasco",
    blurb:
      "Vitoria-Gasteiz es referencia para el rock alternativo y el punk: Azkena Rock Festival (Mendizabala, junio, 35.000 personas/día) es el evento más reconocido. La Sala Helldorado y el Iradier Arena cubren conciertos de mid-size durante todo el año. Vitoria es origen frecuente para viajes a BBK Live (65 km, 45 min), Sonorama Ribera (185 km), Mad Cool (350 km) y festivales de Pamplona. ConcertRide es la opción más usada para volver de festivales del País Vasco y La Rioja a cualquier hora de la madrugada.",
    venues: ["Mendizabala (Azkena Rock)", "Iradier Arena", "Sala Helldorado"],
    lat: 42.8467, lng: -2.6716,
  },
  {
    slug: "a-coruna",
    city: "A Coruña",
    display: "A Coruña",
    region: "Galicia",
    blurb:
      "A Coruña es el principal punto de origen para asistentes a Resurrection Fest (100 km, 1h 15 min), el festival de metal más importante de España. La ciudad acoge además el Coliseum (10.000 plazas), Palexco y la Sala Pelícano para conciertos internacionales y nacionales. Otros festivales gallegos de referencia: O Son do Camiño (185 km a Santiago) y Festival de la Luz (Boimorto). El coche compartido con ConcertRide es la herramienta natural de los aficionados al metal y al indie gallegos para coordinar viajes a festivales de toda España.",
    venues: ["Coliseum A Coruña", "Palexco", "Sala Pelícano", "Festival de la Luz (Boimorto)"],
    lat: 43.3623, lng: -8.4115,
  },
  {
    slug: "vigo",
    city: "Vigo",
    display: "Vigo",
    region: "Galicia",
    blurb:
      "Vigo concentra la actividad musical del sur de Galicia. El Auditorio Mar de Vigo y el Pabellón Multiusos de Vigo (12.000 plazas) acogen las giras de mayor formato; las salas Rouge, La Iguana Club y Master Club cubren el circuito indie y rock. Vigo es origen para Resurrection Fest (200 km, 2h 15 min), O Son do Camiño (90 km a Santiago) y conciertos de Oporto (Portugal, 150 km). ConcertRide conecta a vigueses con conductores hacia festivales gallegos, asturianos y portugueses.",
    venues: ["Auditorio Mar de Vigo", "Pabellón Multiusos de Vigo", "Sala Rouge", "La Iguana Club"],
    lat: 42.2406, lng: -8.7207,
  },
  {
    slug: "murcia",
    city: "Murcia",
    display: "Murcia",
    region: "Región de Murcia",
    blurb:
      "Murcia acoge el WAM (World Music Awards) en febrero, R-Murcia Festival y SOS 4.8 en mayo, además de conciertos en el Auditorio Víctor Villegas, la Sala REM y la Sala Mamba. La provincia es origen para Medusa Festival (180 km, 1h 45 min), Arenal Sound (250 km, 2h 30 min) y Viña Rock (155 km, 1h 30 min). El carpooling con ConcertRide es la opción más usada para los festivales del Mediterráneo y de Castilla-La Mancha.",
    venues: ["Auditorio Víctor Villegas", "Sala REM", "Sala Mamba", "SOS 4.8"],
    lat: 37.9923, lng: -1.1307,
  },
  {
    slug: "valladolid",
    city: "Valladolid",
    display: "Valladolid",
    region: "Castilla y León",
    blurb:
      "Valladolid es punto neurálgico de Castilla y León. La Plaza de Toros, el Pabellón Polideportivo Pisuerga y la Sala Porta Caeli acogen giras nacionales e internacionales. La ciudad es origen frecuente para Sonorama Ribera (100 km, 1h a Aranda de Duero) y Mad Cool (200 km a Madrid). ConcertRide conecta a vallisoletanos con festivales de Madrid, País Vasco y La Rioja.",
    venues: ["Plaza de Toros de Valladolid", "Pabellón Pisuerga", "Sala Porta Caeli"],
    lat: 41.6523, lng: -4.7245,
  },
];

export const CITY_LANDINGS_BY_SLUG = Object.fromEntries(
  CITY_LANDINGS.map((c) => [c.slug, c]),
);

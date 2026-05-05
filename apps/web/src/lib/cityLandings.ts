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
      "Sevilla concentra la agenda de conciertos más activa del sur de España. Los cuatro recintos principales son: Estadio La Cartuja (60.000 plazas, giras de estadio), FIBES Sevilla (9.500 plazas), Palacio de los Deportes San Pablo (7.000 plazas) y Cartuja Center CITE. El festival Interestelar Sevilla (mayo, Charco de la Pava) y el Icónica Sevilla Fest (Plaza de España) son las citas anuales de referencia. Sevilla es además punto de origen para carpooling a Cala Mijas (200 km, 6–9 €) y otros festivales andaluces. ConcertRide conecta a asistentes sevillanos con conductores de toda España.",
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
      "Los conciertos en Bilbao 2026 se concentran en BBK Live (Kobetamendi, 9–11 julio, 30.000 personas/día) para festivales internacionales y en Bilbao Arena Miribilla (10.000 plazas) para tours indoor. La música en Bilbao incluye también el ciclo Music Legends Festival, conciertos en el Palacio Euskalduna y la sala BBK (Gran Vía 19–21) para formato club. La proximidad con Donostia–San Sebastián (Jazzaldia, 100 km) y la cornisa cantábrica hace que el carpooling sea la forma natural de moverse por los festivales del verano vasco. ConcertRide cubre las rutas de coche compartido desde Santander (90 km, 55 min), Vitoria-Gasteiz (65 km, 45 min), Pamplona (155 km, 1h 30 min), Burgos (160 km, 1h 30 min), Donostia (100 km, 1h) y Madrid (395 km, 4h) hacia BBK Live y otros eventos en Bilbao.",
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
  {
    slug: "toledo",
    city: "Toledo",
    display: "Toledo",
    region: "Castilla-La Mancha",
    blurb:
      "Toledo es uno de los principales orígenes de carpooling a Madrid. A solo 70 km de IFEMA (Mad Cool) y del Bernabéu, los toledanos son asistentes frecuentes a festivales y conciertos madrileños. El Recinto Ferial de Toledo acoge la Noche Mágica y conciertos de verano. ConcertRide conecta a asistentes de Toledo con conductores hacia Madrid (70 km, 50 min), Viña Rock (80 km, 55 min) y otros festivales de la zona centro.",
    venues: ["Recinto Ferial de Toledo", "Palacio de Congresos El Greco"],
    lat: 39.8628, lng: -4.0273,
  },
  {
    slug: "burgos",
    city: "Burgos",
    display: "Burgos",
    region: "Castilla y León",
    blurb:
      "Burgos concentra la actividad musical de Castilla y León norte. El Forum Evolución (4.000 plazas), la Plaza de Toros y el Auditorio de Caja Burgos acogen las principales giras. Burgos es el origen más cercano para Sonorama Ribera (80 km, 50 min a Aranda de Duero) y un nodo frecuente para BBK Live (120 km) y Resurrection Fest (420 km). ConcertRide es la opción más usada por los burgaleses para ir y volver de festivales de verano.",
    venues: ["Forum Evolución Burgos", "Plaza de Toros de Burgos", "Auditorio de Caja Burgos"],
    lat: 42.3440, lng: -3.6970,
  },
  {
    slug: "logrono",
    city: "Logroño",
    display: "Logroño",
    region: "La Rioja",
    blurb:
      "Logroño es la capital de La Rioja y punto de paso entre el País Vasco, Navarra, Aragón y Castilla. El Palacio de los Deportes Palacio de Congresos y la Plaza de Toros de Logroño acogen giras de formato medio. Los riojanos viajan frecuentemente en coche compartido a BBK Live (130 km), Sonorama Ribera (90 km a Aranda de Duero), Mad Cool (300 km) y Primavera Sound (300 km). ConcertRide conecta Logroño con todos los festivales del norte y centro de España.",
    venues: ["Palacio de los Deportes de Logroño", "Plaza de Toros de Logroño"],
    lat: 42.4660, lng: -2.4445,
  },
  {
    slug: "santander",
    city: "Santander",
    display: "Santander",
    region: "Cantabria",
    blurb:
      "Santander acoge el Palacio de Festivales de Cantabria y el festival Santander Music (agosto) con artistas internacionales. La proximidad con Bilbao (110 km) hace de Santander un origen frecuente para BBK Live y Resurrection Fest (Viveiro, 300 km). ConcertRide conecta a santanderinos con festivales del norte de España: BBK Live (4–7 €, 1h 15 min), Mad Cool (12–16 € desde Burgos), Sonorama Ribera.",
    venues: ["Palacio de Festivales de Cantabria", "Santander Music (Parque de la Meseta)"],
    lat: 43.4628, lng: -3.8052,
  },
  {
    slug: "oviedo",
    city: "Oviedo",
    display: "Oviedo",
    region: "Asturias",
    blurb:
      "Oviedo es la capital asturiana y origen natural para Resurrection Fest (Viveiro, 195 km, 2h). El Palacio de los Deportes (8.500 plazas) y la Sala Rock Café acogen giras de formato medio y grande. Los asturianos son uno de los grupos más activos en carpooling para festivales del noroeste: Resurrection Fest, O Son do Camiño (Santiago, 300 km) y BBK Live (Bilbao, 280 km). ConcertRide cubre todas estas rutas.",
    venues: ["Palacio de los Deportes de Oviedo", "Sala Rock Café"],
    lat: 43.3614, lng: -5.8493,
  },
  {
    slug: "gijon",
    city: "Gijón",
    display: "Gijón",
    region: "Asturias",
    blurb:
      "Gijón acoge el SON Estrella Galicia Festival (Recinto Ferial de Gijón, agosto) y conciertos en el Palacio de Deportes de Gijón. La ciudad es origen frecuente para viajes a Resurrection Fest (Viveiro, 225 km, 2h 30 min), BBK Live (300 km) y O Son do Camiño (320 km a Santiago). El carpooling con ConcertRide es la opción más usada para los festivales de verano del noroeste.",
    venues: ["Recinto Ferial de Gijón (SON Estrella Galicia)", "Palacio de Deportes de Gijón"],
    lat: 43.5322, lng: -5.6611,
  },
  {
    slug: "leon",
    city: "León",
    display: "León",
    region: "Castilla y León",
    blurb:
      "León es origen para festivales de Castilla y León y del norte de España. El Palacio de Deportes de León y el Auditorio Ciudad de León acogen giras de mid-size. Los leoneses viajan frecuentemente a Sonorama Ribera (160 km, 1h 30 min a Aranda de Duero), Mad Cool (350 km a Madrid) y BBK Live (280 km a Bilbao). ConcertRide conecta a leoneses con conductores de toda Castilla y del norte.",
    venues: ["Palacio de Deportes de León", "Auditorio Ciudad de León"],
    lat: 42.5987, lng: -5.5671,
  },
  {
    slug: "salamanca",
    city: "Salamanca",
    display: "Salamanca",
    region: "Castilla y León",
    blurb:
      "Salamanca tiene una de las agendas musicales más activas de Castilla y León gracias a su gran población universitaria. La Plaza de Toros La Glorieta y el Pabellón Multiusos Los Villares acogen los eventos de mayor aforo. Los salmantinos viajan habitualmente a Mad Cool (220 km a Madrid) y Sonorama Ribera (195 km). ConcertRide cubre estas rutas con precios de 6–9 € por asiento.",
    venues: ["Plaza de Toros La Glorieta", "Pabellón Multiusos Los Villares"],
    lat: 40.9701, lng: -5.6635,
  },
  {
    slug: "albacete",
    city: "Albacete",
    display: "Albacete",
    region: "Castilla-La Mancha",
    blurb:
      "Albacete es el punto de acceso principal a Viña Rock en Villarrobledo (50 km, 35 min), el festival de punk y metal más veterano de España. El IFA (Recinto Ferial) acoge conciertos y festivales locales. La lanzadera oficial del festival sale desde la estación de autobuses de Albacete. ConcertRide cubre las rutas desde Albacete a Viña Rock (3–5 €) y otros festivales de la zona centro.",
    venues: ["Recinto Ferial de Albacete (IFA)", "Villarrobledo (Viña Rock)"],
    lat: 38.9950, lng: -1.8585,
  },
  {
    slug: "castellon",
    city: "Castellón de la Plana",
    display: "Castellón",
    region: "Comunidad Valenciana",
    blurb:
      "Castellón es la ciudad más cercana a dos festivales importantes: FIB (Benicàssim, 14 km, 15 min) y Arenal Sound (Burriana, 10 km, 15 min). El Auditori i Palau de Congressos de Castelló y la Plaza de Toros acogen giras de mid-size. Los castellonenses son origen habitual para carpooling a estos dos festivales, además de Mad Cool, Primavera Sound y BBK Live. ConcertRide cubre estas rutas con los precios más competitivos.",
    venues: ["Auditori i Palau de Congressos de Castelló", "FIB (Benicàssim)", "Arenal Sound (Burriana)"],
    lat: 39.9864, lng: -0.0513,
  },
  {
    slug: "cordoba",
    city: "Córdoba",
    display: "Córdoba",
    region: "Andalucía",
    blurb:
      "Córdoba acoge el Dreambeach Villaricos (costa de Almería, 200 km) como festival de verano más cercano. El Palacio Municipal de Deportes Vista Alegre y la Plaza de Toros de los Califas son los principales recintos de conciertos. Los cordobeses viajan frecuentemente a Cala Mijas (185 km a Mijas), Sevilla (145 km) y Granada (165 km) para festivales y conciertos. ConcertRide cubre estas rutas con precios de 5–8 €.",
    venues: ["Palacio Municipal de Deportes Vista Alegre", "Plaza de Toros de los Califas"],
    lat: 37.8882, lng: -4.7794,
  },
  {
    slug: "huelva",
    city: "Huelva",
    display: "Huelva",
    region: "Andalucía",
    blurb:
      "Huelva acoge el Festival Río Babel y el Cines Cartaya durante el verano. La ciudad es punto de origen para festivales andaluces: Interestelar Sevilla (90 km), Cala Mijas (300 km) y Mad Cool (570 km a Madrid). ConcertRide conecta a onubenses con conductores hacia los principales festivales del sur de España.",
    venues: ["Estadio Nuevo Colombino (conciertos)", "Auditorio Municipal de Huelva"],
    lat: 37.2570, lng: -6.9496,
  },
  {
    slug: "almeria",
    city: "Almería",
    display: "Almería",
    region: "Andalucía",
    blurb:
      "Almería es el punto de acceso al Dreambeach Villaricos (Vera), uno de los festivales de música electrónica más grandes del Mediterráneo. El Palacio de los Deportes José Ángel Puertas y el Parque de los Cortijos de Marín acogen conciertos de verano. ConcertRide conecta a almerienses con conductores hacia Cala Mijas (190 km a Mijas), Dreambeach (70 km) y otros festivales del Mediterráneo.",
    venues: ["Palacio de los Deportes José Ángel Puertas", "Dreambeach Villaricos (Vera)"],
    lat: 36.8381, lng: -2.4597,
  },
  {
    slug: "cadiz",
    city: "Cádiz",
    display: "Cádiz",
    region: "Andalucía",
    blurb:
      "Cádiz acoge el festival Vida Loca y conciertos en el campo de fútbol Estadio Ramón de Carranza. La ciudad es origen para carpooling a Interestelar Sevilla (125 km), Cala Mijas (300 km a Mijas) y festivales del sur. ConcertRide conecta a gaditanos con conductores hacia Sevilla y Málaga para festivales de verano.",
    venues: ["Estadio Ramón de Carranza", "Sala Hidrogeno"],
    lat: 36.5271, lng: -6.2886,
  },
  {
    slug: "jaen",
    city: "Jaén",
    display: "Jaén",
    region: "Andalucía",
    blurb:
      "Jaén es un punto de paso entre Andalucía y La Mancha. El Palacio de los Deportes de Jaén y la Plaza de Toros de Jaén son los principales recintos de conciertos. Los jienenses viajan frecuentemente a Granada (95 km), Sevilla (190 km) y Cala Mijas (240 km a Mijas). ConcertRide cubre las rutas de carpooling desde Jaén hacia festivales de Andalucía y el centro de España.",
    venues: ["Palacio de los Deportes de Jaén", "Plaza de Toros de Jaén"],
    lat: 37.7796, lng: -3.7849,
  },
  {
    slug: "lleida",
    city: "Lleida",
    display: "Lleida",
    region: "Cataluña",
    blurb:
      "Lleida es el punto de partida más cercano para festivales del Pirineo catalán y aragonés. La cercanía con Barcelona (150 km) y Zaragoza (150 km) hace de Lleida un nodo natural para carpooling a Primavera Sound, Sónar y Cruïlla. ConcertRide cubre las rutas desde Lleida hacia Barcelona (8–12 €), Zaragoza (6–9 €) y festivales del norte.",
    venues: ["Camps Elisis (conciertos al aire libre)", "Teatre de la Llotja"],
    lat: 41.6176, lng: 0.6200,
  },
  {
    slug: "tarragona",
    city: "Tarragona",
    display: "Tarragona",
    region: "Cataluña",
    blurb:
      "Tarragona está a 100 km de Barcelona y es origen frecuente para viajes a Primavera Sound, Sónar y Cruïlla. El Palau d'Esports de Tarragona y el Amfiteatre Romà acogen conciertos en verano. ConcertRide conecta a tarraconenses con conductores hacia Barcelona (6–9 €, 1h) y hacia festivales de la Comunidad Valenciana.",
    venues: ["Palau d'Esports de Tarragona", "Tarraco Arena Plaça"],
    lat: 41.1189, lng: 1.2445,
  },
  {
    slug: "girona",
    city: "Girona",
    display: "Girona",
    region: "Cataluña",
    blurb:
      "Girona está a 100 km de Barcelona y es origen para festivales catalanes y del sur de Francia. El Pavelló de Fontajau y la Sala Stroika son los principales recintos locales. ConcertRide conecta a gironinos con conductores hacia Primavera Sound, Sónar y Cruïlla en Barcelona (6–9 €, 1h).",
    venues: ["Pavelló de Fontajau", "Sala Stroika"],
    lat: 41.9794, lng: 2.8214,
  },
  {
    slug: "lugo",
    city: "Lugo",
    display: "Lugo",
    region: "Galicia",
    blurb:
      "Lugo es la provincia de Galicia más cercana a Resurrection Fest (Viveiro, 80 km). Los lugaleses tienen acceso directo al festival por la LU-540. ConcertRide conecta a asistentes de Lugo con conductores que van a Resurrection Fest (4–6 €, 1h) y O Son do Camiño (Santiago, 100 km).",
    venues: ["Pazo de Feiras e Exposicións de Lugo", "Sala Welcome"],
    lat: 43.0096, lng: -7.5560,
  },
  {
    slug: "pontevedra",
    city: "Pontevedra",
    display: "Pontevedra",
    region: "Galicia",
    blurb:
      "Pontevedra está a 25 km de Vigo y es origen frecuente para viajes a Resurrection Fest (Viveiro, 220 km) y O Son do Camiño (Santiago, 55 km). La Sala Karma y el Pazo da Cultura son los principales recintos. ConcertRide conecta a pontevedreses con conductores hacia festivales del noroeste.",
    venues: ["Pazo da Cultura de Pontevedra", "Sala Karma"],
    lat: 42.4337, lng: -8.6486,
  },
  {
    slug: "badajoz",
    city: "Badajoz",
    display: "Badajoz",
    region: "Extremadura",
    blurb:
      "Badajoz es el principal nodo de Extremadura para festivales. A 400 km de Madrid y 270 km de Sevilla, los pacenses viajan frecuentemente en coche compartido a festivales del sur y del centro. El Palacio de los Deportes de Badajoz acoge giras de mid-size. ConcertRide cubre rutas desde Badajoz a Mad Cool (400 km), Cala Mijas (450 km) y Interestelar Sevilla (270 km).",
    venues: ["Palacio de los Deportes de Badajoz", "Recinto Ferial de Badajoz"],
    lat: 38.8794, lng: -6.9706,
  },
  {
    slug: "caceres",
    city: "Cáceres",
    display: "Cáceres",
    region: "Extremadura",
    blurb:
      "Cáceres es conocida por el WOMAD (World of Music, Arts and Dance), uno de los festivales de world music más importantes de España, celebrado cada mayo en la plaza mayor histórica. El Palacio de Deportes Ciudad de Cáceres acoge giras de mid-size. ConcertRide conecta a cacereños con festivales de Madrid (270 km), Sevilla (300 km) y otros eventos extremeños.",
    venues: ["Plaza Mayor de Cáceres (WOMAD)", "Palacio de Deportes Ciudad de Cáceres"],
    lat: 39.4753, lng: -6.3724,
  },
  {
    slug: "palma",
    city: "Palma",
    display: "Palma de Mallorca",
    region: "Islas Baleares",
    blurb:
      "Palma de Mallorca es la sede del mallorcaFestival y del Mallorca Live Festival (Calvià, mayo). El Velódromo Illes Balears y el Palau Municipal d'Esports de Son Moix acogen conciertos de gran formato. Para festivales en la Península, el carpooling desde el ferry Barcelona–Palma conecta a mallorquines con Primavera Sound, Sónar y otros eventos.",
    venues: ["Mallorca Live Festival (Calvià)", "Velódromo Illes Balears", "Son Moix"],
    lat: 39.5696, lng: 2.6502,
  },
  {
    slug: "cuenca",
    city: "Cuenca",
    display: "Cuenca",
    region: "Castilla-La Mancha",
    blurb:
      "Cuenca está a 165 km de Madrid y es un origen frecuente para viajes a Viña Rock (90 km, 1h 10 min) y Mad Cool (165 km, 1h 50 min). El Palacio de los Deportes San Fernando y el Auditorio de Cuenca acogen conciertos de mid-size. ConcertRide conecta a conquenses con conductores hacia Madrid y Albacete.",
    venues: ["Auditorio de Cuenca", "Palacio de Deportes San Fernando"],
    lat: 40.0704, lng: -2.1374,
  },
  {
    slug: "guadalajara",
    city: "Guadalajara",
    display: "Guadalajara",
    region: "Castilla-La Mancha",
    blurb:
      "Guadalajara está a solo 55 km de IFEMA Madrid (Mad Cool) y es uno de los orígenes más activos de carpooling hacia festivales madrileños. El Palacio de los Deportes de Guadalajara y el Auditorio del Palacio de Congresos acogen eventos de mid-size. ConcertRide cubre la ruta Guadalajara–Madrid (3–6 €, 45 min) y Guadalajara–Viña Rock (95 km, 1h 10 min).",
    venues: ["Palacio de los Deportes de Guadalajara", "Auditorio Palacio de Congresos"],
    lat: 40.6321, lng: -3.1667,
  },
  {
    slug: "segovia",
    city: "Segovia",
    display: "Segovia",
    region: "Castilla y León",
    blurb:
      "Segovia está a 90 km de Madrid y es origen frecuente para carpooling a festivales de la capital. El festival de música Hay Festival Segovia (octubre) y el Pabellón Municipal Andrés Laguna son los principales recintos. ConcertRide cubre la ruta Segovia–Madrid (4–7 €, 1h) para asistentes a Mad Cool, conciertos en el Bernabéu y el WiZink Center.",
    venues: ["Pabellón Municipal Andrés Laguna", "Hay Festival Segovia"],
    lat: 40.9429, lng: -4.1088,
  },
  {
    slug: "avila",
    city: "Ávila",
    display: "Ávila",
    region: "Castilla y León",
    blurb:
      "Ávila está a 110 km de Madrid y es punto de origen para asistentes a festivales madrileños y a Sonorama Ribera (Aranda de Duero, 120 km). El Palacio Municipal de Congresos y el Pabellón Multiusos de Ávila acogen eventos de mid-size. ConcertRide conecta a abulenses con conductores hacia Madrid y Castilla y León.",
    venues: ["Pabellón Multiusos de Ávila", "Palacio Municipal de Congresos"],
    lat: 40.6562, lng: -4.6834,
  },
];

export const CITY_LANDINGS_BY_SLUG = Object.fromEntries(
  CITY_LANDINGS.map((c) => [c.slug, c]),
);

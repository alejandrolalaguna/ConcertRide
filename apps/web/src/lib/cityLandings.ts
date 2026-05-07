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
    slug: "ourense",
    city: "Ourense",
    display: "Ourense",
    region: "Galicia",
    blurb:
      "Ourense es la capital de la provincia interior de Galicia, con buena conexión por la AG-53 hacia Santiago de Compostela (110 km) y por la A-52 hacia Vigo (105 km). Es origen natural para asistentes a O Son do Camiño (Monte do Gozo) y al Festival de Ortigueira (250 km). El Pazo dos Deportes Paco Paz y el Auditorio Municipal acogen conciertos de mid-size. ConcertRide opera carpooling desde Ourense hacia los grandes festivales gallegos y madrileños (a Mad Cool: 470 km, 4h 30 min).",
    venues: ["Pazo dos Deportes Paco Paz", "Auditorio Municipal de Ourense", "Expourense"],
    lat: 42.3406, lng: -7.8642,
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
  {
    slug: "las-palmas-de-gran-canaria",
    city: "Las Palmas de Gran Canaria",
    display: "Las Palmas de Gran Canaria",
    region: "Canarias",
    blurb:
      "Las Palmas de Gran Canaria es la capital de la provincia y la mayor ciudad de las Canarias (380.000 habitantes). Acoge la mayor parte de la oferta de conciertos del archipiélago: Gran Canaria Arena (12.000 plazas), Auditorio Alfredo Kraus (1.700), Plaza de la Música. Festival propio: Womad Las Palmas (noviembre, gratuito en el Parque Santa Catalina). Para festivales peninsulares, los canarios se desplazan en avión a Madrid o Barcelona y desde allí ConcertRide cubre el carpooling al recinto. La ruta Las Palmas–Tenerife (1h ferry o 35 min avión) es habitual entre asistentes interinsulares.",
    venues: ["Gran Canaria Arena", "Auditorio Alfredo Kraus", "Plaza de la Música", "Parque Santa Catalina (Womad Las Palmas)"],
    lat: 28.1235, lng: -15.4366,
  },
  {
    slug: "santa-cruz-de-tenerife",
    city: "Santa Cruz de Tenerife",
    display: "Santa Cruz de Tenerife",
    region: "Canarias",
    blurb:
      "Santa Cruz de Tenerife (capital de la provincia, 200.000 habitantes) concentra la actividad de conciertos del norte de Tenerife. El Auditorio Adán Martín (1.600 plazas), el Pabellón Santiago Martín (5.500) y la Plaza de España son las sedes principales. Tenerife acoge el Carnaval de Santa Cruz (febrero, segundo más grande del mundo tras Río) con conciertos urbanos masivos y gratuitos. Para festivales peninsulares, vuelo a Madrid o Barcelona + carpooling ConcertRide al recinto. Tenerife–Las Palmas: 1h en ferry, 35 min en avión.",
    venues: ["Auditorio Adán Martín", "Pabellón Santiago Martín", "Plaza de España (Carnaval)"],
    lat: 28.4636, lng: -16.2518,
  },
  {
    slug: "cartagena",
    city: "Cartagena",
    display: "Cartagena",
    region: "Región de Murcia",
    blurb:
      "Cartagena (215.000 habitantes) es la segunda ciudad de la Región de Murcia y nodo del sureste mediterráneo. Festival propio: La Mar de Músicas (julio, world music, 25 ediciones), Cartagena Jazz Festival (noviembre). Recintos: Plaza de Toros de Cartagena (12.000 plazas), Auditorio El Batel (1.400), Polideportivo Wssell de Guimbarda. Carpooling ConcertRide a Medusa Festival Cullera (175 km, 5–8€), Cala Mijas (290 km, 8–11€), Viña Rock Villarrobledo (220 km, 7–10€) y Mad Cool Madrid (445 km, 13–17€). Pago directo Bizum o efectivo, sin comisión.",
    venues: ["Plaza de Toros de Cartagena", "Auditorio El Batel", "La Mar de Músicas", "Cartagena Jazz Festival"],
    lat: 37.6063, lng: -0.9869,
  },
  {
    slug: "jerez-de-la-frontera",
    city: "Jerez de la Frontera",
    display: "Jerez de la Frontera",
    region: "Andalucía",
    blurb:
      "Jerez de la Frontera (211.000 habitantes) es la mayor ciudad de la provincia de Cádiz y referente del flamenco mundial. Festival de Jerez (febrero–marzo, flamenco, 3 semanas), Tío Pepe Festival (julio–agosto, ciclo de conciertos en las bodegas González Byass con cabezas de cartel internacionales como Pet Shop Boys o Robbie Williams). Recintos: Circuito de Jerez (capacidad festival hasta 30.000), Bodegas Tío Pepe, Teatro Villamarta. Carpooling ConcertRide a Cala Mijas Festival (235 km, 7–11€), Estadio La Cartuja Sevilla (95 km, 4–7€), Mad Cool Madrid (655 km, 16–22€). Sin comisión.",
    venues: ["Circuito de Jerez", "Bodegas Tío Pepe (Tío Pepe Festival)", "Teatro Villamarta", "Festival de Jerez"],
    lat: 36.6850, lng: -6.1261,
  },
  {
    slug: "elche",
    city: "Elche",
    display: "Elche / Elx",
    region: "Comunidad Valenciana",
    blurb:
      "Elche (235.000 habitantes) es la tercera ciudad de la Comunidad Valenciana y nodo industrial del calzado. Recintos: Pabellón Esperanza Lag (5.000 plazas), Auditorio Centro de Congresos. Festival propio: Festival Elx (julio, mediterráneo). Carpooling ConcertRide a Low Festival Benidorm (75 km, 4–7€), Arenal Sound Burriana (135 km, 5–8€), Medusa Festival Cullera (135 km, 5–8€), FIB Benicàssim (215 km, 6–9€), Mad Cool Madrid (425 km, 12–17€). Las rutas Elche–Alicante (25 km) son las más densas. 0% comisión, pago Bizum o efectivo.",
    venues: ["Pabellón Esperanza Lag", "Auditorio Centro de Congresos Ciudad de Elche", "Festival Elx"],
    lat: 38.2655, lng: -0.6987,
  },
  {
    slug: "aranda-de-duero",
    city: "Aranda de Duero",
    display: "Aranda de Duero",
    region: "Castilla y León",
    blurb:
      "Aranda de Duero (Burgos, 33.000 habitantes) es la sede de Sonorama Ribera (6–9 agosto), el festival de música más importante de Castilla y León con 75.000 asistentes/día. El recinto principal es la Plaza del Trigo y escenarios distribuidos por el centro histórico. Aranda está a 160 km de Madrid (1h 45 min, A-1) y a 75 km de Burgos. Sin estación de tren — el carpooling es la opción dominante para asistentes de fuera. Bus La Sepulvedana Madrid–Aranda (10–15€). Carpooling ConcertRide desde Madrid (5–8€), Burgos (3–6€), Valladolid (4–7€), Bilbao (5–8€). Sin comisión, vuelta de madrugada coordinada.",
    venues: ["Plaza del Trigo (Sonorama Ribera)", "Centro Histórico de Aranda (escenarios distribuidos)", "Recinto Ferial de Aranda"],
    lat: 41.6708, lng: -3.6885,
  },
  {
    slug: "burriana",
    city: "Burriana",
    display: "Burriana / Borriana",
    region: "Comunidad Valenciana",
    blurb:
      "Burriana (Castellón, 35.000 habitantes) es la sede de Arenal Sound, uno de los festivales de música pop/indie más importantes de España (29 jul–2 ago, 250.000 asistentes acumulados, 5 días). El recinto está en la Playa de Burriana, conectado con Castellón ciudad por bus lanzadera oficial (10 km, 20 min, 5–8€) y con Valencia por Cercanías Renfe C6 hasta Castellón + lanzadera. Carpooling ConcertRide directo al recinto desde Castellón (3–5€), Valencia (3–6€), Madrid (12–17€), Barcelona (8–12€). Camping oficial (Beach Camp) y libre. 0% comisión.",
    venues: ["Playa de Burriana (Arenal Sound)", "Auditorio Municipal de Burriana"],
    lat: 39.8889, lng: -0.0833,
  },
  {
    slug: "mijas",
    city: "Mijas",
    display: "Mijas",
    region: "Andalucía",
    blurb:
      "Mijas (Málaga, 88.000 habitantes) acoge Cala Mijas Festival en el Cortijo de Torres (2–4 octubre, 90.000 asistentes acumulados). El Cortijo está a 25 km del centro de Málaga y a 10 km del centro de Mijas pueblo, sin transporte público directo ni shuttle oficial — el carpooling es la opción dominante. Mijas Pueblo (blanco, en la sierra) y Mijas Costa (junto al Mediterráneo) son los dos núcleos. Carpooling ConcertRide al Cortijo de Torres desde Málaga (3–5€), Marbella (3–6€), Fuengirola (3–5€), Granada (5–8€), Sevilla (7–11€), Madrid (14–20€). Sin comisión.",
    venues: ["Cortijo de Torres (Cala Mijas Festival)", "Plaza Virgen de la Peña Mijas Pueblo", "Polideportivo Las Cañadas"],
    lat: 36.5957, lng: -4.6371,
  },
  {
    slug: "marbella",
    city: "Marbella",
    display: "Marbella",
    region: "Andalucía",
    blurb:
      "Marbella (150.000 habitantes) es uno de los grandes nodos turísticos de la Costa del Sol con eventos de music & lifestyle todo el verano: Starlite Festival (Cantera de Nagüeles, jul–ago, cabezas de cartel internacionales), Marbella Music Pavillion. Recinto principal: Cantera de Nagüeles (Starlite, 7.500 plazas, formato anfiteatro al aire libre). Carpooling ConcertRide a Cala Mijas Festival Cortijo de Torres (20 km, 3–6€), Estadio La Cartuja Sevilla (210 km, 7–10€), Mad Cool Madrid (575 km, 14–20€). Densidad alta de viajes locales (Marbella–Málaga 60 km, 3–5€). Sin comisión.",
    venues: ["Cantera de Nagüeles (Starlite Festival)", "Palacio de Ferias y Congresos de Marbella", "Plaza de Toros de Puerto Banús"],
    lat: 36.5099, lng: -4.8845,
  },
  {
    slug: "fuengirola",
    city: "Fuengirola",
    display: "Fuengirola",
    region: "Andalucía",
    blurb:
      "Fuengirola (Málaga, 84.000 habitantes) acoge Marenostrum Fuengirola Festival en el Castle Park (jul–ago, ciclo de cabezas de cartel internacionales: 50 Cent, Bryan Adams, Iggy Pop). El Castle Park (Sohail Castle Park) tiene capacidad para 15.000 personas en formato anfiteatro junto al castillo árabe de Sohail. Conectado con Málaga ciudad por Cercanías Renfe C-1 (35 min, 3,90€). Carpooling ConcertRide a Cala Mijas Festival (10 km, 3–5€) — la ruta más utilizada del Cortijo de Torres. También Marbella (25 km, 3–5€), Granada (130 km, 5–8€), Sevilla (220 km, 7–11€). 0% comisión.",
    venues: ["Sohail Castle Park (Marenostrum Fuengirola)", "Palacio de la Paz", "Pabellón Elola"],
    lat: 36.5400, lng: -4.6243,
  },
  {
    slug: "merida",
    city: "Mérida",
    display: "Mérida",
    region: "Extremadura",
    blurb:
      "Mérida (60.000 habitantes) es la capital de Extremadura y patrimonio mundial UNESCO por su conjunto arqueológico romano. Festival Internacional de Teatro Clásico de Mérida (julio–agosto, en el Teatro Romano de Mérida del siglo I a.C., 7.000 plazas) — uno de los festivales más antiguos de España (74 ediciones). Acoge también Stone & Music Festival (verano, en el mismo Teatro Romano, conciertos pop/rock con cabezas de cartel españoles e internacionales). Carpooling ConcertRide al Teatro Romano desde Cáceres (75 km, 4–6€), Badajoz (60 km, 3–5€), Sevilla (200 km, 6–9€), Madrid (340 km, 10–14€). Sin comisión.",
    venues: ["Teatro Romano de Mérida (Stone & Music Festival)", "Festival de Teatro Clásico de Mérida", "Palacio de Congresos de Mérida"],
    lat: 38.9145, lng: -6.3358,
  },
  {
    slug: "ibiza",
    city: "Ibiza",
    display: "Ibiza / Eivissa",
    region: "Islas Baleares",
    blurb:
      "Ibiza (Eivissa, 50.000 habitantes en la capital) es uno de los grandes destinos de música electrónica del mundo. Discotecas-templo: Pacha Ibiza, Ushuaïa Ibiza Beach Hotel (open-air club, capacidad 7.000), Hï Ibiza, Amnesia, DC10. Festival propio: International Music Summit (mayo, conferencia y showcases). En verano, residencias semanales de DJs como David Guetta, Calvin Harris, Marco Carola. Conexión con Península: ferry desde Barcelona (8h, 30–60€) y Valencia (5h, 25–55€), avión desde Madrid/Barcelona (1h, 60–120€). En la isla, ConcertRide opera carpooling Ibiza ciudad–Sant Antoni de Portmany (15 km), Eivissa–Es Canar, etc.",
    venues: ["Ushuaïa Ibiza", "Hï Ibiza", "Pacha Ibiza", "Amnesia", "DC10"],
    lat: 38.9067, lng: 1.4205,
  },
  {
    slug: "sabadell",
    city: "Sabadell",
    display: "Sabadell",
    region: "Cataluña",
    blurb:
      "Sabadell (215.000 habitantes) es la cuarta ciudad de Cataluña y parte del área metropolitana de Barcelona. Recintos: Pavelló Olímpic de Sabadell (5.000 plazas), Teatre La Faràndula. Conectado con Barcelona en 30 min por Renfe Cercanías (FGC y R4). Festival propio: Embassa't Festival (junio, indie/electrónica al aire libre en el Parc de Catalunya). Carpooling ConcertRide a Primavera Sound Barcelona (30 km, 3–5€), Cruïlla (30 km, 3–5€), Sónar (30 km, 3–5€), FIB Benicàssim (335 km, 9–13€). Las rutas a festivales catalanes son extremadamente densas. Sin comisión.",
    venues: ["Pavelló Olímpic de Sabadell", "Teatre La Faràndula", "Parc de Catalunya (Embassa't Festival)"],
    lat: 41.5483, lng: 2.1075,
  },
  {
    slug: "terrassa",
    city: "Terrassa",
    display: "Terrassa",
    region: "Cataluña",
    blurb:
      "Terrassa (220.000 habitantes) es la tercera ciudad de la provincia de Barcelona, nodo industrial textil y nudo ferroviario hacia el Vallès Occidental. Recintos: Centre Cultural Terrassa, Auditori Vallès. Festival propio: Festival de Jazz de Terrassa (marzo, 45 ediciones, uno de los referentes del jazz en Cataluña con figuras como Pat Metheny y Brad Mehldau). Carpooling ConcertRide a Primavera Sound Barcelona (30 km, 3–5€), Cruïlla, Sónar (30 km, 3–5€). Renfe R4 conecta con Barcelona Sants en 50 min. Sin comisión.",
    venues: ["Centre Cultural Terrassa", "Auditori Vallès", "Festival de Jazz de Terrassa"],
    lat: 41.5640, lng: 2.0078,
  },
  {
    slug: "mataro",
    city: "Mataró",
    display: "Mataró",
    region: "Cataluña",
    blurb:
      "Mataró (130.000 habitantes) es la capital del Maresme, en la costa catalana 30 km al norte de Barcelona. Recintos: Teatre Monumental, Pavelló de Mataró. Festival propio: Maresme Music Days (verano, conciertos urbanos gratuitos). Conectado con Barcelona por Renfe R1 Cercanías (40 min, 4€). Carpooling ConcertRide a Primavera Sound Barcelona (35 km, 3–5€), Cruïlla, Sónar, y al norte hacia Girona (75 km, 4–6€). Sin comisión, vuelta de madrugada coordinada — el último Cercanías Mataró–Barcelona sale antes del fin de los festivales del Fòrum.",
    venues: ["Teatre Monumental de Mataró", "Pavelló de Mataró", "Maresme Music Days"],
    lat: 41.5388, lng: 2.4449,
  },
  {
    slug: "reus",
    city: "Reus",
    display: "Reus",
    region: "Cataluña",
    blurb:
      "Reus (Tarragona, 105.000 habitantes) es la segunda ciudad de la provincia y nodo del Camp de Tarragona. Recintos: Teatre Bartrina, Pavelló Olímpic. Festival propio: Festival Trapezi (mayo, circo contemporáneo). Aeropuerto de Reus conecta con vuelos low-cost a Reino Unido y centro Europa. Carpooling ConcertRide a Primavera Sound Barcelona (110 km, 5–8€), Cruïlla (110 km, 5–8€), Sónar (110 km, 5–8€), FIB Benicàssim (190 km, 6–9€). Sin comisión, pago directo Bizum.",
    venues: ["Teatre Bartrina", "Pavelló Olímpic de Reus", "Festival Trapezi"],
    lat: 41.1561, lng: 1.1056,
  },
  {
    slug: "manresa",
    city: "Manresa",
    display: "Manresa",
    region: "Cataluña",
    blurb:
      "Manresa (Barcelona, 75.000 habitantes) es la capital del Bages, 70 km al norte de Barcelona en dirección a los Pirineos. Recintos: Kursaal de Manresa, Nou Congost. Festival propio: Hipnotik Festival (junio, hip-hop). Carpooling ConcertRide a Primavera Sound Barcelona (75 km, 4–6€), Cruïlla (75 km, 4–6€), Sónar (75 km, 4–6€), FIB Benicàssim (245 km, 7–10€), Pirineos Sur Lanuza (170 km, 6–9€). Renfe R4 conecta con Barcelona en 1h 30 min. 0% comisión.",
    venues: ["Kursaal de Manresa", "Nou Congost", "Hipnotik Festival"],
    lat: 41.7287, lng: 1.8266,
  },
  {
    slug: "huesca",
    city: "Huesca",
    display: "Huesca",
    region: "Aragón",
    blurb:
      "Huesca (53.000 habitantes) es la capital de la provincia más septentrional de Aragón, puerta de entrada al Pirineo aragonés. Festivales propios: Periferias Festival (otoño, world music), Festival Internacional de Cine de Huesca (junio). Recintos: Palacio de Congresos de Huesca, Pabellón Polideportivo. Hub clave para llegar a Pirineos Sur Festival (Lanuza, 75 km, world music en mitad del Pirineo). Carpooling ConcertRide a Vive Latino España Zaragoza (75 km, 3–5€), Mad Cool Madrid (390 km, 11–16€), Primavera Sound Barcelona (380 km, 11–16€), Pirineos Sur (75 km, 3–5€). Sin comisión.",
    venues: ["Palacio de Congresos de Huesca", "Pabellón Polideportivo", "Periferias Festival", "Festival Cine Huesca"],
    lat: 42.1401, lng: -0.4087,
  },
  {
    slug: "benidorm",
    city: "Benidorm",
    display: "Benidorm",
    region: "Comunidad Valenciana",
    blurb:
      "Benidorm (Alicante, 70.000 habitantes residentes, 350.000 en temporada alta) es la capital turística de la Costa Blanca. Acoge Low Festival (24–26 julio, indie y pop, 65.000 asistentes acumulados, recinto de la Ciudad Deportiva Guillermo Amor). También Benidorm Pride (septiembre) y Benidorm Fest (febrero, eurovisión nacional). Conectado con Alicante por Tram TRAM L1 (1h, 4€) y autovía AP-7. Carpooling ConcertRide a Low Festival desde Alicante (45 km, 3–5€), Valencia (150 km, 5–8€), Madrid (420 km, 12–17€), Barcelona (480 km, 13–18€). Sin comisión, vuelta de madrugada coordinada.",
    venues: ["Ciudad Deportiva Guillermo Amor (Low Festival)", "Plaza de Toros de Benidorm", "Auditorio Julio Iglesias"],
    lat: 38.5411, lng: -0.1226,
  },
  {
    slug: "algeciras",
    city: "Algeciras",
    display: "Algeciras",
    region: "Andalucía",
    blurb:
      "Algeciras (Cádiz, 122.000 habitantes) es el principal puerto del Estrecho de Gibraltar y nodo logístico hacia Marruecos. Festival propio: Algeciras Entre Dos Continentes (junio, world music). Recintos: Palacio de los Deportes Las Palmeras, Plaza de Toros de Las Palomas. Carpooling ConcertRide a Estadio La Cartuja Sevilla (175 km, 5–8€), Cala Mijas Festival (105 km, 5–7€), Cádiz (130 km, 5–7€), Granada (220 km, 7–10€), Madrid (660 km, 17–22€). Sin comisión, vuelta nocturna coordinada.",
    venues: ["Palacio de los Deportes Las Palmeras", "Plaza de Toros Las Palomas", "Algeciras Entre Dos Continentes"],
    lat: 36.1408, lng: -5.4527,
  },
  {
    slug: "aviles",
    city: "Avilés",
    display: "Avilés",
    region: "Asturias",
    blurb:
      "Avilés (Asturias, 78.000 habitantes) es la tercera ciudad asturiana, ribereña del estuario del Nalón, con el Centro Niemeyer (obra de Oscar Niemeyer) como ícono cultural. Recintos: Centro Niemeyer (auditorio + plaza para 8.000 personas), Plaza de España de Avilés, Pabellón Quirinal. Festival propio: AvilésAcción Festival de cortometrajes (mayo) y Celsius (literatura fantástica, julio). Conectado con Oviedo y Gijón por A-8. Carpooling ConcertRide a Metrópoli Gijón (25 km, 3–4€), BBK Live Bilbao (270 km, 9–12€), Resurrection Fest Viveiro (210 km, 7–10€), O Son do Camiño Santiago (310 km, 10–13€). Sin comisión.",
    venues: ["Centro Niemeyer (auditorio y plaza)", "Plaza de España de Avilés", "Pabellón Quirinal"],
    lat: 43.5547, lng: -5.9248,
  },
  {
    slug: "ponferrada",
    city: "Ponferrada",
    display: "Ponferrada",
    region: "Castilla y León",
    blurb:
      "Ponferrada (León, 64.000 habitantes) es la capital de El Bierzo y parada estratégica del Camino de Santiago. Recintos: Pabellón Lydia Valentín, Castillo de los Templarios (escenario en festivales urbanos). Festival propio: Festival 2 días Ponferrada (verano, indie/pop), Festival Avesedario (cultura y música). Carpooling ConcertRide a O Son do Camiño Santiago (210 km, 7–10€), Resurrection Fest Viveiro (250 km, 8–11€), BBK Live Bilbao (370 km, 11–15€), Mad Cool Madrid (390 km, 11–16€). Sin comisión.",
    venues: ["Pabellón Lydia Valentín", "Castillo de los Templarios", "Plaza Encina"],
    lat: 42.5460, lng: -6.5959,
  },
  {
    slug: "talavera-de-la-reina",
    city: "Talavera de la Reina",
    display: "Talavera de la Reina",
    region: "Castilla-La Mancha",
    blurb:
      "Talavera de la Reina (Toledo, 82.000 habitantes) es la mayor ciudad de la provincia toledana después de la propia Toledo. Recintos: Palacio de Ferias y Congresos, Plaza de Toros La Caprichosa. Festivales propios: Mondas Talavera (septiembre, fiestas mayores con conciertos urbanos), Festival Comarcal de la Cerámica. A 120 km de Madrid (1h 15 min, A-5). Carpooling ConcertRide a Mad Cool Madrid (120 km, 5–7€), Viña Rock Villarrobledo (180 km, 6–9€), Cala Mijas (475 km, 13–18€), Estadio La Cartuja Sevilla (380 km, 11–15€). Sin comisión.",
    venues: ["Palacio de Ferias y Congresos de Talavera", "Plaza de Toros La Caprichosa", "Mondas Talavera"],
    lat: 39.9624, lng: -4.8307,
  },
  {
    slug: "mostoles",
    city: "Móstoles",
    display: "Móstoles",
    region: "Comunidad de Madrid",
    blurb:
      "Móstoles (210.000 habitantes) es la segunda ciudad de la Comunidad de Madrid, parte del cinturón sur metropolitano. Recintos: Pabellón Andrés Torrejón, Teatro del Bosque. Conectado con Madrid centro por Cercanías Renfe C-5 (25 min) y Metro Sur L12 (40 min). Carpooling ConcertRide a Mad Cool IFEMA Madrid (35 km, 3–5€), Tomavistas Retiro (25 km, 3–5€), Viña Rock Villarrobledo (245 km, 7–10€), Sonorama Ribera Aranda (180 km, 6–9€). Hub natural para asistentes del sur de Madrid sin coche que evitan el centro. Sin comisión.",
    venues: ["Pabellón Andrés Torrejón", "Teatro del Bosque", "Recinto Ferial El Soto"],
    lat: 40.3220, lng: -3.8657,
  },
  {
    slug: "alcala-de-henares",
    city: "Alcalá de Henares",
    display: "Alcalá de Henares",
    region: "Comunidad de Madrid",
    blurb:
      "Alcalá de Henares (195.000 habitantes) es ciudad UNESCO Patrimonio de la Humanidad por su universidad cervantina y casco histórico. Festival propio: Festival de la Palabra (octubre), Don Juan en Alcalá (octubre, teatro), Festival Sefarad (julio). Recintos: Teatro Salón Cervantes, Plaza de Cervantes (escenario al aire libre, 8.000 personas), Recinto Ferial. Conectado con Madrid por Cercanías Renfe C-2/C-7 (35 min, 4€). Carpooling ConcertRide a Mad Cool IFEMA (25 km, 3–5€), Sonorama Ribera Aranda (130 km, 5–8€), Viña Rock Villarrobledo (240 km, 7–10€). Sin comisión.",
    venues: ["Teatro Salón Cervantes", "Plaza de Cervantes (escenarios urbanos)", "Recinto Ferial Alcalá", "Don Juan en Alcalá"],
    lat: 40.4815, lng: -3.3636,
  },
  {
    slug: "getafe",
    city: "Getafe",
    display: "Getafe",
    region: "Comunidad de Madrid",
    blurb:
      "Getafe (185.000 habitantes) es nodo del cinturón sur de Madrid con base aérea propia. Recintos: Coliseum Alfonso Pérez (estadio del Getafe CF, eventos de music & lifestyle), Pabellón Juan de la Cierva. Conectado con Madrid centro por Cercanías Renfe C-3/C-4 (20 min) y Metro Sur L12. Carpooling ConcertRide a Mad Cool IFEMA Madrid (30 km, 3–5€), Tomavistas (25 km, 3–5€), Viña Rock Villarrobledo (235 km, 7–10€), Cala Mijas (555 km, 14–20€). Sin comisión, vuelta nocturna coordinada con asistentes del mismo evento.",
    venues: ["Coliseum Alfonso Pérez", "Pabellón Juan de la Cierva", "Centro Cultural García Lorca"],
    lat: 40.3057, lng: -3.7325,
  },
  {
    slug: "gandia",
    city: "Gandia",
    display: "Gandia",
    region: "Comunidad Valenciana",
    blurb:
      "Gandia (Valencia, 75.000 habitantes) es la capital de La Safor, en la costa mediterránea 65 km al sur de Valencia. Festival propio: Polifònic Festival (julio, indie/pop, formato playa), Tu Otro Verano Music Festival. Recintos: Auditori del Raval, Pavelló Esportiu. Conectado con Valencia por Cercanías Renfe C1 (1h, 4,90€). Carpooling ConcertRide a Festival de les Arts Valencia (65 km, 3–5€), Zevra Festival La Marina (60 km, 3–5€), Medusa Festival Cullera (15 km, 3–4€), Arenal Sound Burriana (130 km, 5–8€). Hub natural para asistentes de la costa sur valenciana. Sin comisión.",
    venues: ["Auditori del Raval", "Pavelló Esportiu de Gandia", "Polifònic Festival"],
    lat: 38.9676, lng: -0.1815,
  },
];

export const CITY_LANDINGS_BY_SLUG = Object.fromEntries(
  CITY_LANDINGS.map((c) => [c.slug, c]),
);

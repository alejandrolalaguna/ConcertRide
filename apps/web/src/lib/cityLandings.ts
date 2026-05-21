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
  // ─── Wave 53 (2026-05-20): 8 cities festival/venue host ─────
  {
    slug: "fraga",
    city: "Fraga",
    display: "Fraga",
    region: "Aragón",
    blurb:
      "Fraga (Huesca, 15.000 habitantes) es la capital de la comarca del Bajo Cinca, en el límite oriental de Aragón con Cataluña. Su entorno desértico de los Monegros acoge desde 1994 el Monegros Desert Festival, uno de los referentes europeos de música electrónica al aire libre (techno, drum'n'bass, house). El recinto se monta en pleno desierto, a unos 20 km de la ciudad, sin transporte público nocturno: el carpooling es la opción por defecto. Recintos urbanos: Palacio de Congresos de Fraga, Auditorio Municipal. Conectada por A-2 (Madrid-Barcelona) y AVE Zaragoza-Lleida. Carpooling ConcertRide a Monegros Desert Festival (20 km, 3–4€), Primavera Sound Barcelona (220 km, 7–10€), Vive Latino España Zaragoza (115 km, 5–7€), Mad Cool Madrid (430 km, 12–17€). Sin comisión, vuelta nocturna coordinada con asistentes del mismo evento.",
    venues: ["Monegros Desert Festival (recinto desértico)", "Palacio de Congresos de Fraga", "Auditorio Municipal de Fraga"],
    lat: 41.5215, lng: 0.3489,
  },
  {
    slug: "bueu",
    city: "Bueu",
    display: "Bueu",
    region: "Galicia",
    blurb:
      "Bueu (Pontevedra, 12.300 habitantes) es una villa marinera de la ría de Pontevedra (Rías Baixas), en la península do Morrazo. Acoge desde 2002 el festival SonRías Baixas (agosto, 3 días, indie/rock/folk con bandas en gallego e internacionales), uno de los referentes culturales de Galicia, celebrado en el recinto de Banda do Río junto a la playa. Recintos: Auditorio de Bueu, Praza Massó, recinto SonRías Baixas. Conectada con Pontevedra (20 km, AP-9) y Vigo (35 km). Carpooling ConcertRide a SonRías Baixas (en la villa, 0–3€ rutas internas), O Son do Camiño Santiago (90 km, 4–6€), Atlantic Fest Vilagarcía (45 km, 3–5€), Festival Ortigueira (235 km, 7–10€), Resurrection Fest Viveiro (260 km, 8–11€). Sin comisión.",
    venues: ["Recinto SonRías Baixas (Banda do Río)", "Auditorio Municipal de Bueu", "Praza Massó"],
    lat: 42.3267, lng: -8.7867,
  },
  {
    slug: "arrecife",
    city: "Arrecife",
    display: "Arrecife",
    region: "Canarias",
    blurb:
      "Arrecife (Lanzarote, 64.000 habitantes) es la capital de Lanzarote y principal puerto de la isla. Acoge el Lava Live Festival (julio, indie/pop/electrónica) en un recinto frente al océano que rinde homenaje al paisaje volcánico de la isla. Recintos: Recinto Ferial de Arrecife (Lava Live), Charco de San Ginés (escenarios urbanos), Auditorio Jameos del Agua (obra de César Manrique, Haría, 30 km). Aeropuerto de Lanzarote (ACE) a 5 km. Carpooling ConcertRide cubre rutas internas en Lanzarote desde Playa Blanca (40 km, 4–6€), Puerto del Carmen (15 km, 3–4€), Costa Teguise (10 km, 3–4€) y Haría (30 km, 4–5€) hacia Lava Live Festival y conciertos del Auditorio Jameos del Agua. Sin comisión, vuelta nocturna coordinada.",
    venues: ["Recinto Ferial de Arrecife (Lava Live Festival)", "Charco de San Ginés", "Auditorio Jameos del Agua (Haría)"],
    lat: 28.9630, lng: -13.5477,
  },
  {
    slug: "salou",
    city: "Salou",
    display: "Salou",
    region: "Cataluña",
    blurb:
      "Salou (Tarragona, 28.000 habitantes residentes, 200.000 en temporada alta) es una de las capitales turísticas de la Costa Daurada, a 10 km de Tarragona y junto a PortAventura World. Acoge el Festiuet (julio, formato playa, indie/pop/electrónica) en el Parc del Carrilet, así como conciertos urbanos de verano en la Platja de Llevant. Recintos: Parc del Carrilet (Festiuet), Teatre Auditori de Salou, Plaça Europa (escenarios urbanos). Conectada con Tarragona por R16/R17 Renfe (10 min) y AP-7. Carpooling ConcertRide a Festiuet Salou (0–3€ rutas internas), Reggaeton Beach Festival Salou (en el municipio), Primavera Sound Barcelona (105 km, 5–7€), Cruïlla Barcelona (105 km, 5–7€), Vive Latino España Zaragoza (270 km, 8–11€). Sin comisión, vuelta nocturna coordinada.",
    venues: ["Parc del Carrilet (Festiuet)", "Teatre Auditori de Salou", "Platja de Llevant (escenarios urbanos)"],
    lat: 41.0763, lng: 1.1419,
  },
  {
    slug: "daroca",
    city: "Daroca",
    display: "Daroca",
    region: "Aragón",
    blurb:
      "Daroca (Zaragoza, 2.200 habitantes) es una villa medieval amurallada del sur de la provincia de Zaragoza, declarada Conjunto Histórico-Artístico. Acoge desde 1979 el Festival Internacional de Música Antigua de Daroca (agosto, música medieval, renacentista y barroca con intérpretes internacionales), uno de los festivales históricos de música antigua más respetados de España. Recintos: Colegiata de Santa María (acústica catedralicia), Iglesia de San Juan, Iglesia de San Miguel, Teatro Municipal de Daroca. A 85 km de Zaragoza por N-330 y A-23. Carpooling ConcertRide a Festival de Música Antigua de Daroca (rutas internas), Vive Latino España Zaragoza (85 km, 4–6€), Mad Cool Madrid (260 km, 8–11€), Primavera Sound Barcelona (310 km, 9–13€), Sonorama Ribera Aranda (240 km, 7–10€). Sin comisión.",
    venues: ["Colegiata de Santa María de Daroca", "Iglesia de San Juan", "Iglesia de San Miguel", "Teatro Municipal de Daroca"],
    lat: 41.1158, lng: -1.4128,
  },
  {
    slug: "barruelo-de-santullan",
    city: "Barruelo de Santullán",
    display: "Barruelo de Santullán",
    region: "Castilla y León",
    blurb:
      "Barruelo de Santullán (Palencia, 1.100 habitantes) es una antigua villa minera del norte de la provincia de Palencia, en la comarca de la Montaña Palentina. Su pasado carbonero la convirtió en uno de los enclaves industriales de Castilla y León durante el siglo XX, hoy reconvertido a turismo de naturaleza con el Centro de Interpretación de la Minería. Acoge el Veta Festival (agosto, indie/rock/folk en antiguas instalaciones mineras), un festival boutique que reivindica el patrimonio industrial. Recintos: Antiguo Pozo Calero (recinto Veta Festival), Plaza del Ayuntamiento, Centro Cultural de Barruelo. A 100 km de Palencia y 100 km de Santander por N-611. Carpooling ConcertRide a Veta Festival (rutas internas), BBK Live Bilbao (175 km, 6–9€), Sonorama Ribera Aranda (160 km, 6–8€), Mad Cool Madrid (340 km, 10–14€), Resurrection Fest Viveiro (390 km, 12–16€). Sin comisión.",
    venues: ["Antiguo Pozo Calero (Veta Festival)", "Plaza del Ayuntamiento", "Centro de Interpretación de la Minería"],
    lat: 42.9197, lng: -4.2961,
  },
  {
    slug: "villena",
    city: "Villena",
    display: "Villena",
    region: "Comunidad Valenciana",
    blurb:
      "Villena (Alicante, 34.000 habitantes) es la capital del Alto Vinalopó, en el interior norte de la provincia de Alicante, conocida por su castillo medieval y el Tesoro de Villena. Acoge desde 2006 el Leyendas del Rock Festival (agosto, 4 días, heavy metal, rock y hard rock con bandas internacionales), uno de los festivales de metal más importantes de Europa con 30.000 asistentes/día en el recinto de Villena. Recintos: Recinto Leyendas del Rock (a las afueras), Teatro Chapí (1.000 plazas, Teatro Histórico de España), Plaza de Toros, Castillo de la Atalaya (escenario en eventos puntuales). Conectada con Alicante por A-31 (60 km, 45 min) y AVE Madrid-Alicante. Carpooling ConcertRide a Leyendas del Rock (rutas internas y desde toda España, 0–25€), Low Festival Benidorm (110 km, 5–7€), Madrid (350 km, 10–14€), Valencia (110 km, 5–7€), Barcelona (440 km, 13–17€). Sin comisión, vuelta nocturna coordinada.",
    venues: ["Recinto Leyendas del Rock", "Teatro Chapí", "Plaza de Toros de Villena", "Castillo de la Atalaya"],
    lat: 38.6379, lng: -0.8651,
  },
  {
    slug: "pollenca",
    city: "Pollença",
    display: "Pollença",
    region: "Islas Baleares",
    blurb:
      "Pollença (Mallorca, 16.500 habitantes) es una villa histórica del norte de Mallorca, entre la Serra de Tramuntana y la bahía de Pollença. Acoge desde 1962 el Festival de Pollença (julio-agosto, música clásica y de cámara con intérpretes internacionales), uno de los festivales de música clásica más longevos de España, celebrado en el Claustro de Sant Domingo (acústica única). También Festival Pollença Nit (noches de jazz, agosto). Recintos: Claustro de Sant Domingo (Festival de Pollença), Església de Sant Jordi, Teatre de Pollença, Plaça Major. A 60 km de Palma por Ma-13. Carpooling ConcertRide a Festival de Pollença (rutas internas y desde Palma 60 km, 4–6€), Mallorca Live Festival (Calvià, 75 km, 5–7€), Alcúdia (8 km, 3€) y Port de Pollença (5 km, 3€). Sin comisión, vuelta nocturna coordinada.",
    venues: ["Claustro de Sant Domingo (Festival de Pollença)", "Església de Sant Jordi", "Teatre de Pollença", "Plaça Major"],
    lat: 39.8769, lng: 3.0163,
  },

  // ─── Wave 56 (2026-05-21): venues + cities ─────

  {
    slug: "crevillent",
    city: "Crevillent",
    display: "Crevillent",
    region: "Comunidad Valenciana",
    blurb:
      "Crevillent (Alicante, 28.000 habitantes) es un municipio del Baix Vinalopó conocido por la Institución Ferial Alicantina (IFA), uno de los principales recintos feriales del sur peninsular y sede de festivales masivos como FEST FESTIVAL y eventos electrónicos. La IFA cuenta con 27.000 m² cubiertos y aparcamiento para 5.000 vehículos. Recintos: IFA (Institución Ferial Alicantina), Teatro Chapí, Casa Municipal de Cultura. Conectada con Alicante por A-7/AP-7 (30 km, 25 min) y Elche por N-340 (15 km, 15 min). Carpooling ConcertRide a Low Festival Benidorm (90 km, 5–7€), Arenal Sound Burriana (220 km, 8–11€), Madrid (400 km, 12–17€), Valencia (170 km, 6–9€). Sin comisión, vuelta nocturna coordinada (los conciertos en IFA suelen acabar pasadas las 04:00).",
    venues: ["IFA (Institución Ferial Alicantina)", "Teatro Chapí", "Casa Municipal de Cultura"],
    lat: 38.2497, lng: -0.8108,
  },
  {
    slug: "velez-malaga",
    city: "Vélez-Málaga",
    display: "Vélez-Málaga",
    region: "Andalucía",
    blurb:
      "Vélez-Málaga (Málaga, 84.000 habitantes) es la capital de la Axarquía, 30 km al este de Málaga capital en plena Costa del Sol oriental. Recintos: Recinto Ferial Vélez-Málaga, Teatro del Carmen, Auditorio Marqués de Beniel. Es la zona de influencia más cercana al festival Cala Mijas (otra zona costera), Dreambeach (Villaricos) y Marenostrum Fuengirola. Conectada con Málaga por la A-7 (30 km, 30 min) y con Nerja por la N-340 (25 km). Carpooling ConcertRide a Cala Mijas Fest (60 km, 4–6€), Marenostrum Fuengirola (50 km, 3–5€), Andalucía Big Festival Málaga (35 km, 3–5€), Granada (130 km, 6–9€), Almería (180 km, 7–11€). Sin comisión, vuelta nocturna coordinada.",
    venues: ["Recinto Ferial Vélez-Málaga", "Teatro del Carmen", "Auditorio Marqués de Beniel"],
    lat: 36.7807, lng: -4.0993,
  },
  {
    slug: "sant-carles-rapita",
    city: "Sant Carles de la Ràpita",
    display: "Sant Carles de la Ràpita",
    region: "Cataluña",
    blurb:
      "Sant Carles de la Ràpita (Tarragona, 15.500 habitantes) es un municipio costero en la desembocadura del Ebro, dentro del Delta del Ebro y la comarca del Montsià. Acoge desde 2012 el Festival Eufònic Delta Ebre (sonido experimental y arte audiovisual, septiembre), distribuido entre Sant Carles, Amposta y Alcanar. Recintos: Mercat Vell, Auditori Sixto Mir, Far de la Bana, Plaça d'Espanya. Conectado con Tarragona por la AP-7/N-340 (90 km, 1h) y con Tortosa por la N-340 (25 km, 25 min). Carpooling ConcertRide a Eufònic (rutas internas Tarragona-Castellón, 3–8€), FIB Benicàssim (95 km, 5–7€), Arenal Sound (115 km, 6–9€), Cruïlla Barcelona (185 km, 7–10€), Primavera Sound Barcelona (185 km, 7–10€), Valencia (130 km, 6–9€). Sin comisión.",
    venues: ["Mercat Vell", "Auditori Sixto Mir", "Far de la Bana", "Plaça d'Espanya"],
    lat: 40.6175, lng: 0.5946,
  },
  {
    slug: "ciudad-real",
    city: "Ciudad Real",
    display: "Ciudad Real",
    region: "Castilla-La Mancha",
    blurb:
      "Ciudad Real (75.000 habitantes) es la capital de la provincia manchega, a 200 km al sur de Madrid en plena llanura. Recintos: Quijote Arena (12.000 plazas, conciertos y deporte), Antiguo Casino, Plaza de Toros de Ciudad Real, Auditorio La Granja. La ciudad acoge la programación de la Feria de Agosto (Pandorga, Virgen del Prado) con conciertos al aire libre. AVE Madrid–Sevilla en 55 minutos (estación Ciudad Real). Carpooling ConcertRide a Mad Cool Madrid (200 km, 7–11€), Vive Latino Zaragoza (525 km, 14–19€), Viña Rock Villarrobledo (105 km, 5–7€), Interestelar Sevilla (415 km, 12–17€), Granada (320 km, 10–14€). Sin comisión, vuelta nocturna coordinada.",
    venues: ["Quijote Arena", "Antiguo Casino", "Plaza de Toros de Ciudad Real", "Auditorio La Granja"],
    lat: 38.9848, lng: -3.9273,
  },
  {
    slug: "soria",
    city: "Soria",
    display: "Soria",
    region: "Castilla y León",
    blurb:
      "Soria (39.000 habitantes) es la capital de la provincia menos poblada de España, en plena meseta norte a 1.063 m de altitud. Recintos: Palacio de la Audiencia (Teatro Palacio, 700 plazas), Polideportivo San Andrés, Plaza de Toros de Soria, Pabellón Los Pajaritos. La ciudad es hub clave hacia Sonorama Ribera (Aranda de Duero, 90 km, 1h), el festival de referencia de Castilla y León. Carpooling ConcertRide a Sonorama Ribera (90 km, 4–6€), Mad Cool Madrid (230 km, 8–12€), Vive Latino Zaragoza (160 km, 6–9€), Pirineos Sur Lanuza (290 km, 10–14€), Bilbao BBK Live (240 km, 9–13€). Sin comisión, vuelta nocturna coordinada (los conciertos de Sonorama acaban pasadas las 05:00).",
    venues: ["Palacio de la Audiencia (Teatro Palacio)", "Polideportivo San Andrés", "Plaza de Toros de Soria", "Pabellón Los Pajaritos"],
    lat: 41.7665, lng: -2.4790,
  },
  {
    slug: "linares",
    city: "Linares",
    display: "Linares",
    region: "Andalucía",
    blurb:
      "Linares (Jaén, 56.000 habitantes) es la segunda ciudad de la provincia de Jaén, en pleno centro minero histórico y patria de Raphael. Recintos: Teatro Cervantes (1.000 plazas), Plaza de Toros Santa Margarita, Estadio Linarejos (Linares Deportivo), Auditorio El Pósito. La ciudad acoge el Festival Internacional de Guitarra Andrés Segovia (septiembre, música clásica) y conciertos durante la Feria y Fiestas de San Agustín (agosto). Conectada con Jaén por A-44 (50 km, 35 min) y Madrid por A-4 (290 km, 2h 45min). Carpooling ConcertRide a Interestelar Sevilla (270 km, 9–13€), Cazorla Blues (90 km, 5–7€), Andalucía Big Málaga (220 km, 8–11€), Granada (95 km, 5–7€), Madrid (290 km, 9–13€). Sin comisión.",
    venues: ["Teatro Cervantes de Linares", "Plaza de Toros Santa Margarita", "Estadio Linarejos", "Auditorio El Pósito"],
    lat: 38.0951, lng: -3.6363,
  },

  // ─── Wave 58 (2026-05-21): venues + cities ─────

  {
    slug: "jaca",
    city: "Jaca",
    display: "Jaca",
    region: "Aragón",
    blurb:
      "Jaca (Huesca, 14.000 habitantes) es la capital del Pirineo aragonés, a 820 m de altitud y puerta de la estación de esquí de Astún y Candanchú. Recintos: Palacio de Hielo de Jaca (3.000 plazas, eventos indoor), Plaza Biscós, Auditorio Casino de Jaca, Carpa del Festival Folclórico de los Pirineos. La ciudad acoge cada agosto el Festival Folclórico de los Pirineos (declarado de Interés Turístico Internacional) y la programación musical estival. Conectada con Huesca por A-23 (75 km, 1h) y con Pamplona por N-240 (110 km, 1h 30min). Carpooling ConcertRide a Pirineos Sur Lanuza (60 km, 4–6€), Mad Cool Madrid (475 km, 14–19€), Bilbao BBK Live (240 km, 9–13€), Zaragoza (155 km, 6–9€), Pamplona (110 km, 5–7€). Sin comisión, vuelta nocturna coordinada.",
    venues: ["Palacio de Hielo de Jaca", "Plaza Biscós", "Auditorio Casino de Jaca", "Carpa Festival Folclórico de los Pirineos"],
    lat: 42.5697, lng: -0.5497,
  },
  {
    slug: "cangas-de-onis",
    city: "Cangas de Onís",
    display: "Cangas de Onís",
    region: "Asturias",
    blurb:
      "Cangas de Onís (Asturias, 6.000 habitantes) es la antigua capital del Reino de Asturias y puerta de los Lagos de Covadonga y el Parque Nacional de los Picos de Europa. Recintos: Puente Romano (escenarios al aire libre), Plaza del Ayuntamiento, Polideportivo Municipal, El Bosque Sonoro (Festival Vesu). La zona acoge cada julio el Festival Aquasella en Arriondas (12 km al sur) — referente del techno y house en el norte. Carpooling ConcertRide a Aquasella Festival (12 km, 2–3€), BBK Live Bilbao (245 km, 9–13€), Resurrection Fest Viveiro (250 km, 9–13€), Oviedo (75 km, 4–6€), Santander (115 km, 5–8€), Gijón (75 km, 4–6€). Sin comisión, vuelta nocturna coordinada (los conciertos de Aquasella se alargan hasta el amanecer).",
    venues: ["Puente Romano de Cangas de Onís", "Plaza del Ayuntamiento", "Polideportivo Municipal", "El Bosque Sonoro (Festival Vesu)"],
    lat: 43.3503, lng: -5.1306,
  },
  {
    slug: "tossa-de-mar",
    city: "Tossa de Mar",
    display: "Tossa de Mar",
    region: "Cataluña",
    blurb:
      "Tossa de Mar (Girona, 5.000 habitantes) es uno de los pueblos costeros más fotografiados de la Costa Brava, con su Vila Vella amurallada del siglo XII como icono. Recintos: Castell de Tossa (escenario al aire libre con vistas al Mediterráneo), Plaza de España, Espai Cultural Ca'n Ganga, Anfiteatro Vila Vella. La villa acoge cada verano el Festival de Cine de Tossa y un ciclo de conciertos en el Castell. Conectada con Girona por GI-681 (40 km, 50min) y con Barcelona por C-32/AP-7 (95 km, 1h 15min). Carpooling ConcertRide a Cap Roig Festival Calella de Palafrugell (35 km, 3–5€), Cruïlla Barcelona (95 km, 5–8€), Sant Feliu de Guíxols (15 km, 2–3€), Lloret de Mar (12 km, 2–3€), Girona (40 km, 3–6€), Sónar Barcelona (95 km, 5–8€). Sin comisión.",
    venues: ["Castell de Tossa", "Plaza de España", "Espai Cultural Ca'n Ganga", "Anfiteatro Vila Vella"],
    lat: 41.7196, lng: 2.9320,
  },
  {
    slug: "cazorla",
    city: "Cazorla",
    display: "Cazorla",
    region: "Andalucía",
    blurb:
      "Cazorla (Jaén, 8.000 habitantes) es la puerta del Parque Natural de las Sierras de Cazorla, Segura y Las Villas, el mayor espacio protegido de España. Recintos: Plaza de Santa María (escenario natural con las ruinas de la iglesia de Santa María), Castillo de la Yedra, Plaza de Toros de Cazorla, Teatro de la Merced. La villa acoge cada julio el Cazorla Blues Festival, referente del blues en España con cuatro días de programación y artistas internacionales. Conectada con Jaén por A-319 (105 km, 1h 30min) y con Granada por A-44/A-319 (180 km, 2h 15min). Carpooling ConcertRide a Cazorla Blues (in situ, 0€), Granada Sound (180 km, 7–10€), Andalucía Big Málaga (300 km, 10–14€), Jaén (105 km, 5–7€), Linares (90 km, 5–7€), Madrid (335 km, 11–15€). Sin comisión, vuelta nocturna coordinada.",
    venues: ["Plaza de Santa María (Cazorla Blues)", "Castillo de la Yedra", "Plaza de Toros de Cazorla", "Teatro de la Merced"],
    lat: 37.9106, lng: -3.0017,
  },
  {
    slug: "rivas-vaciamadrid",
    city: "Rivas-Vaciamadrid",
    display: "Rivas-Vaciamadrid",
    region: "Comunidad de Madrid",
    blurb:
      "Rivas-Vaciamadrid (95.000 habitantes) es uno de los municipios más jóvenes del sureste de Madrid, a 15 km del centro. Recintos: Auditorio Miguel Ríos (2.000 plazas, ciclo de conciertos de verano homenaje al cantante granadino), Centro Cultural García Lorca, Sala Marcos Ana, Polideportivo Cerro del Telégrafo. La ciudad acoge cada verano el programa municipal Rivas en Vivo con artistas nacionales de pop, rock e indie. Metro Sur L9 (estaciones Rivas Urbanizaciones y Rivas Vaciamadrid) conecta con Madrid en 30 min. Carpooling ConcertRide al Auditorio Miguel Ríos (in situ), Mad Cool Madrid (12 km, 2–4€), Madrid centro (15 km, 2–4€), Alcalá de Henares (35 km, 3–5€), Toledo (90 km, 5–8€), Guadalajara (55 km, 4–7€). Sin comisión, vuelta nocturna coordinada (Metro L9 cierra a 01:30).",
    venues: ["Auditorio Miguel Ríos", "Centro Cultural García Lorca", "Sala Marcos Ana", "Polideportivo Cerro del Telégrafo"],
    lat: 40.3568, lng: -3.5198,
  },
  {
    slug: "la-roda",
    city: "La Roda",
    display: "La Roda",
    region: "Castilla-La Mancha",
    blurb:
      "La Roda (Albacete, 17.000 habitantes) es una de las localidades de referencia de la provincia de Albacete, famosa por sus miguelitos y por acoger uno de los festivales indie con más solera de Castilla-La Mancha. Recintos: Recinto Ferial de La Roda (Festival de los Sentidos, 25.000 plazas en formato festival), Plaza Mayor, Auditorio Municipal, Pabellón Polideportivo. La villa acoge cada junio el Festival de los Sentidos, referente del indie nacional desde 2008 con artistas como Vetusta Morla, Love of Lesbian o Iván Ferreiro. Conectada con Albacete por A-31 (40 km, 30min) y con Madrid por A-31/A-3 (200 km, 2h). Carpooling ConcertRide al Festival de los Sentidos (in situ), Viña Rock Villarrobledo (40 km, 3–5€), Mad Cool Madrid (200 km, 7–11€), Albacete (40 km, 3–5€), Valencia (160 km, 6–9€), Murcia (190 km, 7–10€). Sin comisión.",
    venues: ["Recinto Ferial de La Roda (Festival de los Sentidos)", "Plaza Mayor de La Roda", "Auditorio Municipal", "Pabellón Polideportivo"],
    lat: 39.2089, lng: -2.1576,
  },

  // ─── Wave 59 (2026-05-21): venues + cities ─────

  {
    slug: "andujar",
    city: "Andújar",
    display: "Andújar",
    region: "Andalucía",
    blurb:
      "Andújar (Jaén, 36.000 habitantes) es la segunda localidad más poblada de la provincia de Jaén y centro económico del valle medio del Guadalquivir. Recintos: Plaza de Toros de Andújar (5.500 plazas, conciertos de verano), Recinto Ferial Las Vistillas (Feria de Septiembre con actuaciones de pop y flamenco), Teatro Principal (650 plazas), Auditorio Pedro Escarvajal. Cada septiembre la Feria de Andújar acoge artistas de copla, flamenco-pop y reggaetón (anteriores ediciones: India Martínez, Rozalén, Estopa). Conectada con Jaén por A-32 (60 km, 45 min) y con Córdoba por A-4 (75 km, 50 min). Carpooling ConcertRide a Festival de Cante de las Minas La Unión (350 km, 14–18€), Cala Mijas (240 km, 12–15€), Granada Sound (115 km, 7–10€), Jaén (60 km, 4–7€), Córdoba (75 km, 5–8€), Sevilla (215 km, 11–14€). Sin comisión, vuelta nocturna coordinada.",
    venues: ["Plaza de Toros de Andújar", "Recinto Ferial Las Vistillas", "Teatro Principal", "Auditorio Pedro Escarvajal"],
    lat: 38.0388, lng: -4.0497,
  },
  {
    slug: "calatayud",
    city: "Calatayud",
    display: "Calatayud",
    region: "Aragón",
    blurb:
      "Calatayud (Zaragoza, 19.000 habitantes) es la segunda ciudad de la provincia de Zaragoza y nudo ferroviario entre Madrid y Zaragoza (AVE Madrid-Calatayud 1h 25 min). Recintos: Teatro Capitol (500 plazas, programación de música y teatro), Recinto Ferial Casa Mariola (Feria de San Juan y San Pedro con actuaciones de pop y flamenco), Auditorio Municipal de Música, Plaza de Toros (4.000 plazas, conciertos de verano). La ciudad acoge cada julio la Feria con conciertos al aire libre y el Festival Daroca de Música Antigua queda a 35 km (40 min) por A-2. Conectada con Zaragoza por A-2 (90 km, 55 min) y con Madrid por A-2/AVE. Carpooling ConcertRide a Monegros Desert Festival Sariñena (140 km, 8–11€), Mad Cool Madrid (240 km, 12–15€), Zaragoza centro (90 km, 5–8€), Festival Música Antigua Daroca (35 km, 3–5€), Soria (110 km, 7–10€), Pamplona (210 km, 11–14€). Sin comisión, vuelta nocturna coordinada (último AVE Madrid–Calatayud 21:25).",
    venues: ["Teatro Capitol", "Recinto Ferial Casa Mariola", "Auditorio Municipal de Música", "Plaza de Toros de Calatayud"],
    lat: 41.3528, lng: -1.6428,
  },
  {
    slug: "sant-andreu-de-la-barca",
    city: "Sant Andreu de la Barca",
    display: "Sant Andreu de la Barca",
    region: "Cataluña",
    blurb:
      "Sant Andreu de la Barca (Barcelona, 27.000 habitantes) es un municipio del Baix Llobregat a 20 km de Barcelona, conectado por Rodalies R4 (estación Sant Andreu de la Barca, 25 min al centro). Recintos: Auditori Sant Andreu de la Barca (500 plazas), Centre Cultural La Lira (350 plazas), Pavelló Esportiu Municipal (conciertos puntuales), Recinto Festes de Maig (Festa Major). El municipio acoge en mayo la Festa Major con conciertos de pop y rock catalán al aire libre. Carpooling ConcertRide a Primavera Sound Barcelona (25 km, 3–5€), Cruïlla Parc del Fòrum (28 km, 3–6€), Sónar Fira Montjuïc (22 km, 3–5€), Barcelona centro (20 km, 3–5€), Sant Jordi Club (22 km, 3–5€), Sala Salamandra L'Hospitalet (15 km, 2–4€). Sin comisión, vuelta nocturna coordinada (Rodalies R4 último Barcelona–Sant Andreu 23:30).",
    venues: ["Auditori Sant Andreu de la Barca", "Centre Cultural La Lira", "Pavelló Esportiu Municipal", "Recinto Festes de Maig"],
    lat: 41.4500, lng: 1.9667,
  },
  {
    slug: "el-escorial",
    city: "El Escorial",
    display: "El Escorial",
    region: "Comunidad de Madrid",
    blurb:
      "El Escorial (Madrid, 16.000 habitantes) es el conjunto histórico junto a San Lorenzo de El Escorial, a 50 km del centro de Madrid, sede del Real Monasterio de El Escorial (Patrimonio de la Humanidad UNESCO). Recintos: Real Coliseo Carlos III (440 plazas, teatro histórico con programación clásica), Auditorio del Centro Cultural, Teatro Variedades, Plaza de la Constitución (conciertos al aire libre durante MUSEG). La villa acoge cada agosto MUSEG, festival decano de música clásica española desde 1985, con conciertos en el monasterio y otras sedes. Conectada con Madrid por Cercanías C-3a (50 km, 1h 5 min) y por A-6/M-505 (50 km, 50 min en coche). Carpooling ConcertRide a Mad Cool Madrid (65 km, 4–7€), Madrid centro (50 km, 4–6€), WiZink Center (52 km, 4–6€), Segovia (40 km, 3–6€), Ávila (60 km, 4–7€), Salamanca (175 km, 9–12€). Sin comisión, vuelta nocturna coordinada (Cercanías C-3a último Madrid–El Escorial 23:00).",
    venues: ["Real Coliseo Carlos III", "Auditorio del Centro Cultural", "Teatro Variedades", "Plaza de la Constitución"],
    lat: 40.5828, lng: -4.1364,
  },
  {
    slug: "estepona",
    city: "Estepona",
    display: "Estepona",
    region: "Andalucía",
    blurb:
      "Estepona (Málaga, 73.000 habitantes) es uno de los municipios principales de la Costa del Sol occidental, a 80 km al oeste de Málaga capital. Recintos: Auditorio Felipe VI (1.150 plazas, programación de conciertos y teatro), Palacio de Congresos y Exposiciones, Plaza de Toros de Estepona (8.000 plazas, conciertos de verano), Anfiteatro Padre Manuel (1.500 plazas al aire libre). El municipio acoge cada verano el Estepona Summer Concerts en el Auditorio Felipe VI con artistas nacionales e internacionales. Conectada con Málaga por AP-7 (80 km, 1h) y A-7 (sin peaje, 1h 15 min). Carpooling ConcertRide a Cala Mijas Mijas (40 km, 3–6€), Marenostrum Fuengirola (50 km, 4–7€), Starlite Marbella (28 km, 3–5€), Málaga centro (80 km, 5–8€), Andalucía Big Festival (75 km, 5–8€), Reggaeton Beach Festival Marbella (28 km, 3–5€). Sin comisión, vuelta nocturna coordinada.",
    venues: ["Auditorio Felipe VI", "Palacio de Congresos y Exposiciones", "Plaza de Toros de Estepona", "Anfiteatro Padre Manuel"],
    lat: 36.4257, lng: -5.1450,
  },
  {
    slug: "manacor",
    city: "Manacor",
    display: "Manacor",
    region: "Islas Baleares",
    blurb:
      "Manacor (Mallorca, 50.000 habitantes) es el segundo municipio de Mallorca por población y centro económico del Llevant mallorquín, cuna de Rafael Nadal. Recintos: Teatre de Manacor (700 plazas, programación de teatro y música), Auditori de Manacor (380 plazas), Plaça de Sant Jaume (conciertos al aire libre durante Fires i Festes de Primavera), Pavelló Esportiu. La localidad acoge cada mayo–junio las Fires i Festes de Primavera con conciertos de pop y rock catalán, y queda a 60 km de Palma (Mallorca Live Festival, 50 min). Conectada con Palma por Ma-15 (60 km, 50 min en coche, sin tren directo). Carpooling ConcertRide a Mallorca Live Festival Calvià (75 km, 5–8€), Palma centro (60 km, 4–7€), Festival de Pollença (55 km, 4–7€), Iboga Summer Tavernes (vía ferry: no aplica), Festes de Sant Joan (in situ), Castell de Cap Roig (vía ferry: no aplica). Sin comisión, vuelta nocturna coordinada (sin tren — el coche es la opción principal).",
    venues: ["Teatre de Manacor", "Auditori de Manacor", "Plaça de Sant Jaume", "Pavelló Esportiu"],
    lat: 39.5694, lng: 3.2086,
  },
  {
    slug: "sanlucar-de-barrameda",
    city: "Sanlúcar de Barrameda",
    display: "Sanlúcar de Barrameda",
    region: "Andalucía",
    blurb:
      "Sanlúcar de Barrameda (Cádiz, 69.000 habitantes) es uno de los municipios principales de la provincia de Cádiz, en la desembocadura del Guadalquivir frente a Doñana, declarada Capital Española de la Gastronomía 2022. Recintos: Auditorio de la Merced (600 plazas, antigua iglesia rehabilitada), Plaza de Toros El Pino (10.000 plazas, conciertos de verano), Hipódromo de Bajo de Guía (carreras de caballos en playa en agosto, conciertos paralelos), Castillo de Santiago (programación cultural). La villa acoge cada agosto el Festival de Música Sacra y conciertos en el Castillo de Santiago, y queda a 25 km de Jerez (Festival de Jerez Flamenco, 30 min). Conectada con Jerez por A-480 (25 km, 30 min) y con Cádiz por A-471/AP-4 (50 km, 50 min). Carpooling ConcertRide a Festival de Jerez Flamenco (25 km, 3–5€), Cabo de Plata Barbate (60 km, 4–7€), Cádiz centro (50 km, 4–6€), Sevilla centro (105 km, 6–9€), Slap Cádiz (50 km, 4–6€), Festival Castell de Peralada (no aplica). Sin comisión, vuelta nocturna coordinada.",
    venues: ["Auditorio de la Merced", "Plaza de Toros El Pino", "Hipódromo de Bajo de Guía", "Castillo de Santiago"],
    lat: 36.7783, lng: -6.3525,
  },
  {
    slug: "lorca",
    city: "Lorca",
    display: "Lorca",
    region: "Región de Murcia",
    blurb:
      "Lorca (Murcia, 95.000 habitantes) es la tercera ciudad de la Región de Murcia, declarada Ciudad Barroca por su patrimonio. Recintos: Teatro Guerra (700 plazas, programación de música y teatro), Castillo de Lorca (programación de verano con conciertos al aire libre), Plaza de Toros de Sutullena (8.000 plazas, conciertos de verano), Auditorio Casa del Artesano. La localidad acoge cada septiembre el Festival Internacional de Folklore en el Mediterráneo y conciertos en el Castillo. Queda a 30 km de Cartagena (Rock Imperium, 25 min) y a 70 km de Murcia capital. Conectada con Murcia por A-7 (70 km, 50 min) y con Cartagena por RM-2/N-340 (30 km, 25 min). Carpooling ConcertRide a Rock Imperium Cartagena (30 km, 3–5€), SOS 4.8 Murcia (70 km, 5–8€), Costera Sur Murcia (70 km, 5–8€), Festival Cante de las Minas La Unión (50 km, 4–7€), Almería (140 km, 8–11€), Murcia centro (70 km, 5–8€). Sin comisión, vuelta nocturna coordinada.",
    venues: ["Teatro Guerra", "Castillo de Lorca", "Plaza de Toros de Sutullena", "Auditorio Casa del Artesano"],
    lat: 37.6731, lng: -1.6989,
  },

  // ─── Wave 60 (2026-05-21): venues + cities ─────

  {
    slug: "zamora",
    city: "Zamora",
    display: "Zamora",
    region: "Castilla y León",
    blurb:
      "Zamora (60.000 habitantes) es la capital de la provincia homónima en Castilla y León, conocida por su Semana Santa de Interés Turístico Internacional y por su patrimonio románico. Recintos: Teatro Principal de Zamora (700 plazas, programación de música y teatro), Auditorio Ruta de la Plata (1.200 plazas, conciertos sinfónicos), Pabellón Ángel Nieto (5.000 plazas, conciertos de gran formato) y Plaza Mayor (conciertos al aire libre del Z! Live Rock Fest en julio). La ciudad acoge cada julio el Z! Live Rock Fest (rock duro y metal nacional) y el Festival Pórtico de Zamora (septiembre, músicas del mundo). Conectada con Salamanca por A-66 (65 km, 55 min), con Valladolid por A-11 (95 km, 1h 5 min) y con Madrid por A-6/A-66 (245 km, 2h 40 min). Carpooling ConcertRide a Sonorama Ribera Aranda (155 km, 8–11€), Conexión Valladolid (95 km, 6–8€), Indyspensable Salamanca (65 km, 4–6€), Z! Live (in situ, 1–3€), Madrid centro (245 km, 12–16€) y León (140 km, 8–11€). Sin comisión, vuelta nocturna coordinada (último bus Avanza a las 22:00, AVE Zamora–Madrid hasta 21:30).",
    venues: ["Teatro Principal de Zamora", "Auditorio Ruta de la Plata", "Pabellón Ángel Nieto", "Plaza Mayor (Z! Live Rock Fest)"],
    lat: 41.5034, lng: -5.7446,
  },

  {
    slug: "areatza",
    city: "Areatza",
    display: "Areatza",
    region: "País Vasco",
    blurb:
      "Areatza (Bizkaia, 1.200 habitantes) es una pequeña villa del valle de Arratia, a los pies del Parque Natural de Gorbeia, conocida por su festival rock veraniego y sus jornadas de cerveza artesana. Recintos: Plaza Bastegieta (escenario principal del festival, conciertos al aire libre julio–agosto), Frontón Municipal (programación de invierno), Antigua Carbonería (sala alternativa). La localidad acoge cada agosto un festival rock combinado con feria de cerveza artesana vasca, con cartel mixto de bandas indie locales (Berri Txarrak, La Furia, Niña Coyote eta Chico Tornado). Conectada con Bilbao por BI-635/N-240 (35 km, 35 min) y con Vitoria por A-1/BI-3543 (50 km, 45 min). Sin servicio Renfe local; bus Bizkaibus A3923 desde Bilbao hasta las 22:00. Carpooling ConcertRide a BBK Live Kobetamendi (40 km, 3–6€), Azkena Rock Festival Vitoria (55 km, 4–7€), Bilbao centro (35 km, 3–5€), Vitoria centro (50 km, 4–6€), Donostia Jazzaldia (135 km, 8–11€) y Pamplona (155 km, 8–11€). Sin comisión, vuelta nocturna coordinada (último Bizkaibus 22:00 — el coche compartido es esencial).",
    venues: ["Plaza Bastegieta", "Frontón Municipal", "Antigua Carbonería"],
    lat: 43.0833, lng: -2.7833,
  },

  {
    slug: "vilanova-i-la-geltru",
    city: "Vilanova i la Geltrú",
    display: "Vilanova i la Geltrú",
    region: "Cataluña",
    blurb:
      "Vilanova i la Geltrú (Barcelona, 67.000 habitantes) es la capital del Garraf, ciudad costera entre Sitges y Tarragona, conocida por su Carnaval de Interés Turístico Nacional y por el festival Faraday. Recintos: Teatre Principal (700 plazas, programación municipal de teatro y música), Auditori Eduard Toldrà (450 plazas, clásica y jazz), Plaça de la Vila (conciertos al aire libre), Platja del Far (escenario principal del Faraday Festival, julio, indie y pop alternativo). La ciudad acoge cada julio el Faraday Festival y conciertos del Festival Internacional de Música Popular Tradicional. Conectada con Barcelona por C-32 (50 km, 40 min) y Rodalies R2 Sud (cada 30 min, 50 min, 4,90€); con Tarragona por C-32 (50 km, 40 min); con Sitges por C-31 (10 km, 15 min). Carpooling ConcertRide a Faraday Festival (in situ, 1–3€), Cruïlla Barcelona (50 km, 4–6€), Primavera Sound Parc del Fòrum (55 km, 4–7€), Sónar (52 km, 4–6€), Festiuet Salou (60 km, 5–7€) y Bonobus Sant Andreu (60 km, 5–7€). Sin comisión, vuelta nocturna coordinada (último Rodalies R2 23:00 — el coche compartido es ideal para vuelta de festival).",
    venues: ["Teatre Principal", "Auditori Eduard Toldrà", "Plaça de la Vila", "Platja del Far (Faraday Festival)"],
    lat: 41.2241, lng: 1.7256,
  },

  {
    slug: "la-seu-d-urgell",
    city: "La Seu d'Urgell",
    display: "La Seu d'Urgell",
    region: "Cataluña",
    blurb:
      "La Seu d'Urgell (Lleida, 12.000 habitantes) es la capital de la comarca del Alt Urgell en el Pirineo de Lleida, sede del Coprincipado de Andorra y conocida por su catedral románica y el Parc Olímpic del Segre (sede de piragüismo Barcelona '92). Recintos: Sala Sant Domènec (450 plazas, programación municipal y festivales), Plaça dels Oms (conciertos al aire libre del Connecta'l Festival cada agosto), Parc Olímpic del Segre (eventos al aire libre y festivales de verano), Auditori del Conservatori (300 plazas). La localidad acoge cada agosto el Connecta'l Festival (indie y pop catalán) y conciertos del Festival Pirineus. Conectada con Lleida por C-14 (135 km, 1h 50 min), con Andorra por N-145 (10 km, 15 min) y con Barcelona por C-16/C-14 (185 km, 2h 30 min); sin tren. Carpooling ConcertRide a Connecta'l (in situ, 1–3€), Pirineos Sur Lanuza (vía A-2: 295 km, 18–22€ — no recomendado), Animac Lleida (135 km, 7–10€), Lleida centro (135 km, 7–10€), Barcelona centro (185 km, 10–14€) y Festival de Pollença (vía ferry: no aplica). Sin comisión, vuelta nocturna coordinada (sin transporte público a Lleida después de las 20:00).",
    venues: ["Sala Sant Domènec", "Plaça dels Oms (Connecta'l Festival)", "Parc Olímpic del Segre", "Auditori del Conservatori"],
    lat: 42.3589, lng: 1.4592,
  },

  {
    slug: "barbate",
    city: "Barbate",
    display: "Barbate",
    region: "Andalucía",
    blurb:
      "Barbate (Cádiz, 22.000 habitantes) es una villa costera de la Costa de la Luz gaditana, conocida por su atún rojo de almadraba y por el festival Cabo de Plata. Recintos: Recinto Ferial Playa del Carmen (escenario principal del Cabo de Plata, cada agosto, capacidad 25.000 personas), Castillo de Santiago de Vejer (vía Vejer, conciertos al aire libre), Plaza de Toros (conciertos de verano), Mercado de Abastos rehabilitado (programación municipal). La localidad acoge cada agosto el Cabo de Plata Festival (indie y rock español, 4 días) y conciertos del Festival Castell de Cap Roig (en agosto). Conectada con Cádiz por A-48/E-5 (60 km, 50 min) y con Sevilla por AP-4/A-4 (155 km, 1h 50 min); sin tren — bus Comes desde Cádiz hasta las 21:30. Carpooling ConcertRide a Cabo de Plata (in situ, 1–3€), Slap Cádiz (60 km, 4–6€), Festival de Jerez Flamenco (65 km, 4–7€), Cádiz centro (60 km, 4–6€), Sevilla centro (155 km, 9–12€) y Sanlúcar de Barrameda (60 km, 4–7€). Sin comisión, vuelta nocturna coordinada (último bus Comes Barbate–Cádiz 21:30, no útil para vuelta de festival).",
    venues: ["Recinto Ferial Playa del Carmen (Cabo de Plata)", "Plaza de Toros", "Mercado de Abastos", "Castillo de Santiago (Vejer)"],
    lat: 36.1908, lng: -5.9203,
  },

  {
    slug: "cunit",
    city: "Cunit",
    display: "Cunit",
    region: "Cataluña",
    blurb:
      "Cunit (Tarragona, 13.000 habitantes) es una villa costera del Baix Penedès, en la Costa Daurada catalana, conocida por sus playas y por el festival Cunit Reggae. Recintos: Playa de Cunit (escenario principal del Cunit Reggae cada agosto, capacidad 8.000 personas), Plaça del Mil·lenari (conciertos al aire libre), Centre Cívic de Cunit (programación municipal, 350 plazas), Pavelló Poliesportiu Municipal. La villa acoge cada agosto el Festival Cunit Reggae (reggae, ska y dub, gratuito) y conciertos del Festival Internacional de Música del Baix Penedès. Conectada con Barcelona por C-32 (55 km, 50 min) y Rodalies R2 Sud (cada 30 min, 1h, 5,40€); con Tarragona por C-32 (45 km, 40 min); con Vilanova i la Geltrú por N-340 (10 km, 15 min). Carpooling ConcertRide a Festival Cunit Reggae (in situ, 1–3€), Faraday Festival Vilanova (10 km, 2–4€), Cruïlla Barcelona (55 km, 4–7€), Festiuet Salou (50 km, 4–6€), Rototom Sunsplash Benicàssim (175 km, 10–14€) y Tarragona centro (45 km, 3–6€). Sin comisión, vuelta nocturna coordinada (último Rodalies R2 23:00).",
    venues: ["Playa de Cunit (Cunit Reggae)", "Plaça del Mil·lenari", "Centre Cívic de Cunit", "Pavelló Poliesportiu Municipal"],
    lat: 41.1972, lng: 1.6328,
  },

  {
    slug: "ronda",
    city: "Ronda",
    display: "Ronda",
    region: "Andalucía",
    blurb:
      "Ronda (Málaga, 33.000 habitantes) es uno de los municipios más turísticos de Málaga, ciudad monumental sobre el tajo del Guadalevín, conocida por su Plaza de Toros (la más antigua de España, 1785) y por el festival Sierra Bandolera. Recintos: Plaza de Toros de Ronda (5.000 plazas, conciertos de verano e impresionante escenario), Convento de Santo Domingo (Sala de los Bandoleros, programación municipal), Alameda del Tajo (conciertos al aire libre del Sierra Bandolera cada agosto), Teatro Vicente Espinel (600 plazas, programación de teatro y música). La ciudad acoge cada agosto el Sierra Bandolera Festival (folk, rock alternativo y americana) y conciertos de la Feria de Pedro Romero (septiembre). Conectada con Málaga por A-367/A-357 (105 km, 1h 35 min), con Sevilla por A-374/A-376 (135 km, 1h 50 min) y con Marbella por A-397 (50 km, 50 min); tren MD Algeciras–Ronda 1 vez/día. Carpooling ConcertRide a Sierra Bandolera (in situ, 1–3€), Cala Mijas Festival (90 km, 5–8€), Marenostrum Fuengirola (75 km, 5–7€), Starlite Marbella (50 km, 4–6€), Málaga centro (105 km, 6–9€) y Sevilla centro (135 km, 8–11€). Sin comisión, vuelta nocturna coordinada (sin tren útil después de las 20:00).",
    venues: ["Plaza de Toros de Ronda", "Alameda del Tajo (Sierra Bandolera)", "Convento de Santo Domingo", "Teatro Vicente Espinel"],
    lat: 36.7426, lng: -5.1659,
  },

  {
    slug: "oropesa-del-mar",
    city: "Oropesa del Mar",
    display: "Oropesa del Mar",
    region: "Comunidad Valenciana",
    blurb:
      "Oropesa del Mar (Castellón, 13.000 habitantes) es una villa costera de la Costa del Azahar, conocida por la urbanización Marina d'Or y por el festival Cabezo Beach. Recintos: Playa de la Concha (escenario principal del Cabezo Beach Festival cada julio, capacidad 12.000 personas), Auditorio Cap Roig (1.000 plazas, programación municipal), Plaza de la Iglesia (conciertos al aire libre), Marina d'Or Recinto (eventos privados de gran formato). La villa acoge cada julio el Cabezo Beach Festival (urbano, reggaeton y trap) y conciertos del Festival de Música Popular de Oropesa. Conectada con Castellón por N-340/AP-7 (25 km, 25 min) y con Valencia por AP-7 (95 km, 1h); Rodalies C-6 hasta Castellón cada hora. Carpooling ConcertRide a Cabezo Beach (in situ, 1–3€), Rototom Sunsplash Benicàssim (10 km, 2–4€), Arenal Sound Burriana (45 km, 3–6€), FIB Benicàssim (10 km, 2–4€), SanSan Festival Benicàssim (10 km, 2–4€) y Valencia centro (95 km, 5–8€). Sin comisión, vuelta nocturna coordinada (último Rodalies C-6 a Valencia 22:30).",
    venues: ["Playa de la Concha (Cabezo Beach)", "Auditorio Cap Roig", "Plaza de la Iglesia", "Marina d'Or Recinto"],
    lat: 40.0867, lng: 0.1422,
  },

  // ─── Wave 61 (2026-05-21): venues + cities ─────

  {
    slug: "aranjuez",
    city: "Aranjuez",
    display: "Aranjuez",
    region: "Comunidad de Madrid",
    blurb:
      "Aranjuez (Madrid, 60.000 habitantes) es una villa real Patrimonio de la Humanidad UNESCO desde 2001, ciudad-jardín a orillas del Tajo, conocida por el Palacio Real, los Jardines del Príncipe y por su programación de música clásica en verano. Recintos: Plaza de Toros de Aranjuez (10.000 plazas, conciertos de verano), Teatro Real Carlos III (550 plazas, programación municipal), Jardines del Príncipe (conciertos al aire libre en verano), Auditorio Joaquín Rodrigo (800 plazas, ciclo Aranjuez Suena). La villa acoge cada julio el Festival Aranjuez Suena (música clásica y jazz) y la Fiesta del Motín de Aranjuez (septiembre). Conectada con Madrid por A-4 (50 km, 40 min) y Cercanías C-3 desde Atocha (50 min, 5,40€); con Toledo por A-42 (40 km, 35 min); con Cuenca por A-40 (150 km, 1h 35 min). Carpooling ConcertRide a Mad Cool (50 km, 4–6€), Tomavistas Madrid (50 km, 4–6€), DCode Festival Madrid (50 km, 4–6€), WiZink Center Madrid (50 km, 4–6€), Festival Otoño Madrid (50 km, 4–6€) y Toledo centro (40 km, 3–5€). Sin comisión, vuelta nocturna coordinada (último Cercanías C-3 23:30, no útil para vuelta de festival).",
    venues: ["Plaza de Toros de Aranjuez", "Teatro Real Carlos III", "Jardines del Príncipe", "Auditorio Joaquín Rodrigo"],
    lat: 40.0319, lng: -3.6033,
  },

  {
    slug: "sant-cugat-del-valles",
    city: "Sant Cugat del Vallès",
    display: "Sant Cugat del Vallès",
    region: "Cataluña",
    blurb:
      "Sant Cugat del Vallès (Barcelona, 92.000 habitantes) es la principal ciudad del Vallès Occidental, conurbación de Barcelona conocida por su Monasterio románico-gótico (siglos XI-XIV) y por una de las rentas per cápita más altas de Cataluña. Recintos: Teatre-Auditori Sant Cugat (818 plazas, programación de música clásica y contemporánea), Plaza del Monasterio (conciertos al aire libre en verano), Pavelló Olímpic Municipal (3.500 personas, eventos de gran formato), Casa de Cultura Sant Domènec (300 plazas, programación municipal). La ciudad acoge cada verano el Festival Petit Format y el Festival Internacional de Música de Sant Cugat (octubre). Conectada con Barcelona por C-16 (20 km, 25 min) y FGC L7/S1/S2 desde Plaça Catalunya (25 min, 2,55€); con Sabadell por C-58 (10 km, 15 min); con Terrassa por C-58 (20 km, 20 min). Carpooling ConcertRide a Cruïlla Barcelona (20 km, 2–4€), Primavera Sound (20 km, 2–4€), Sónar Barcelona (20 km, 2–4€), Palau Sant Jordi (20 km, 2–4€), Brunch Electronik Barcelona (20 km, 2–4€) y Festiuet Salou (105 km, 6–9€). Sin comisión, vuelta nocturna coordinada (último FGC Sant Cugat–Barcelona 00:15).",
    venues: ["Teatre-Auditori Sant Cugat", "Plaza del Monasterio", "Pavelló Olímpic Municipal", "Casa de Cultura Sant Domènec"],
    lat: 41.4727, lng: 2.0844,
  },

  {
    slug: "granollers",
    city: "Granollers",
    display: "Granollers",
    region: "Cataluña",
    blurb:
      "Granollers (Barcelona, 62.000 habitantes) es la capital del Vallès Oriental, ciudad textil e industrial conocida por su Mercado del Jueves (uno de los más antiguos de Cataluña, desde el siglo XIV) y por el Palau d'Esports. Recintos: Palau d'Esports de Granollers (5.500 personas, conciertos de gran formato), Teatre Auditori de Granollers (800 plazas, programación municipal), Roca Umbert Fàbrica de les Arts (1.500 plazas, espacio cultural multidisciplinar), Plaça de la Porxada (conciertos al aire libre en Fiestas de Blancos y Azules). La ciudad acoge cada septiembre las Festes Majors de Blancos y Azules (más de 200 años de historia) y el Festival Tradicionàrius en marzo. Conectada con Barcelona por AP-7/C-17 (30 km, 30 min) y Rodalies R2 Nord/R3 desde Sants (30 min, 4,90€); con Mataró por C-60 (25 km, 25 min); con Sabadell por C-59 (25 km, 25 min). Carpooling ConcertRide a Cruïlla Barcelona (30 km, 3–5€), Primavera Sound (30 km, 3–5€), Sónar Barcelona (30 km, 3–5€), Palau Sant Jordi (30 km, 3–5€), Brunch Electronik Barcelona (30 km, 3–5€) y Festiuet Salou (115 km, 6–9€). Sin comisión, vuelta nocturna coordinada (último Rodalies R2 Granollers–Barcelona 23:45).",
    venues: ["Palau d'Esports de Granollers", "Teatre Auditori de Granollers", "Roca Umbert Fàbrica de les Arts", "Plaça de la Porxada"],
    lat: 41.6082, lng: 2.2872,
  },

  {
    slug: "tarazona",
    city: "Tarazona",
    display: "Tarazona",
    region: "Aragón",
    blurb:
      "Tarazona (Zaragoza, 11.000 habitantes) es la capital de la comarca de Tarazona y el Moncayo, ciudad mudéjar al pie del Moncayo, conocida por su Catedral de Santa María (Patrimonio Mundial UNESCO desde 2001) y por el festival Tarazona Folk. Recintos: Plaza de Toros Vieja de Tarazona (5.000 plazas, una de las más antiguas de España, conciertos de verano), Teatro Bellas Artes (480 plazas, programación municipal), Plaza de la Seo (conciertos al aire libre de Tarazona Folk), Centro Cívico (300 plazas). La ciudad acoge cada agosto el Festival Tarazona Folk (music folk, world music) y las Fiestas del Cipotegato (agosto). Conectada con Zaragoza por A-68/N-122 (90 km, 1h) y bus Therpasa (1h 15 min, 9,80€); con Soria por N-122 (75 km, 55 min); con Tudela por N-121 (35 km, 30 min). Carpooling ConcertRide a Tarazona Folk (in situ, 1–3€), Vive Latino Zaragoza (90 km, 5–8€), Monegros Desert Festival (105 km, 6–9€), Sonorama Ribera Aranda (170 km, 9–13€), Veta Festival Palencia (200 km, 11–15€) y Pamplona centro (110 km, 6–9€). Sin comisión, vuelta nocturna coordinada (último bus Therpasa a Zaragoza 20:30, no útil para vuelta de festival).",
    venues: ["Plaza de Toros Vieja", "Teatro Bellas Artes", "Plaza de la Seo", "Centro Cívico"],
    lat: 41.9036, lng: -1.7233,
  },

  {
    slug: "trujillo",
    city: "Trujillo",
    display: "Trujillo",
    region: "Extremadura",
    blurb:
      "Trujillo (Cáceres, 9.000 habitantes) es una villa monumental medieval Conjunto Histórico-Artístico desde 1962, cuna de conquistadores (Francisco Pizarro, Francisco de Orellana), conocida por su Plaza Mayor renacentista y por el Festival de Teatro Clásico. Recintos: Plaza Mayor de Trujillo (1.500 personas, escenario principal del Festival de Teatro Clásico cada agosto), Castillo de Trujillo (conciertos al aire libre en verano), Iglesia de Santa María la Mayor (música sacra), Teatro Municipal Carlos Sá (450 plazas, programación municipal). La villa acoge cada agosto el Festival Trujillo Clásico (teatro y música clásica) y la Feria Nacional del Queso (abril–mayo). Conectada con Cáceres por A-58 (50 km, 35 min) y bus Mirat (45 min, 5,80€); con Mérida por N-630/A-66 (90 km, 1h); con Madrid por A-5 (250 km, 2h 30 min). Carpooling ConcertRide a Trujillo Clásico (in situ, 1–3€), WOMAD Cáceres (50 km, 3–6€), Teatro Clásico Mérida (90 km, 5–8€), Extremusika Cáceres (50 km, 3–6€), Mad Cool Madrid (250 km, 13–18€) y Cáceres centro (50 km, 3–6€). Sin comisión, vuelta nocturna coordinada (último bus Mirat a Cáceres 21:30, no útil para vuelta de festival).",
    venues: ["Plaza Mayor de Trujillo", "Castillo de Trujillo", "Iglesia de Santa María la Mayor", "Teatro Municipal Carlos Sá"],
    lat: 39.4592, lng: -5.8819,
  },

  {
    slug: "san-sebastian-de-los-reyes",
    city: "San Sebastián de los Reyes",
    display: "San Sebastián de los Reyes",
    region: "Comunidad de Madrid",
    blurb:
      "San Sebastián de los Reyes (Madrid, 90.000 habitantes), conocida popularmente como Sanse, es uno de los principales municipios del corredor norte de Madrid, conurbación con Alcobendas, conocida por sus Encierros (Fiestas del Cristo de los Remedios en agosto) y por el centro comercial Plaza Norte 2. Recintos: Teatro Auditorio Adolfo Marsillach (815 plazas, programación municipal de música y teatro), Pabellón Municipal Dehesa Boyal (4.500 personas, conciertos y deporte), Plaza de la Constitución (conciertos al aire libre en fiestas), Centro Joven Sanse (200 plazas, programación juvenil). El municipio acoge cada agosto el Festival Cristo de los Remedios (música y encierros) y conciertos del Festival Internacional de Jazz de Sanse (mayo). Conectada con Madrid por A-1 (20 km, 25 min) y Cercanías C-4 desde Atocha (30 min, 2,90€) y Metro L10 hasta Hospital Infanta Sofía (35 min, 2 €); con Alcalá de Henares por R-2 (25 km, 25 min). Carpooling ConcertRide a Mad Cool (20 km, 2–4€), Tomavistas Madrid (20 km, 2–4€), DCode Festival Madrid (20 km, 2–4€), WiZink Center Madrid (20 km, 2–4€), Festival Otoño Madrid (20 km, 2–4€) y Madrid centro (20 km, 2–4€). Sin comisión, vuelta nocturna coordinada (último metro L10 a Hospital Infanta Sofía 01:30).",
    venues: ["Teatro Auditorio Adolfo Marsillach", "Pabellón Municipal Dehesa Boyal", "Plaza de la Constitución", "Centro Joven Sanse"],
    lat: 40.5475, lng: -3.6253,
  },

  {
    slug: "algemesi",
    city: "Algemesí",
    display: "Algemesí",
    region: "Comunidad Valenciana",
    blurb:
      "Algemesí (Valencia, 28.000 habitantes) es una villa de la Ribera Alta, conocida por la Mare de Déu de la Salut (Patrimonio Inmaterial de la Humanidad UNESCO desde 2011, en septiembre) y por su Festival Internacional de Polifonía. Recintos: Auditori Municipal d'Algemesí (650 plazas, programación municipal), Plaza Mayor (conciertos al aire libre en fiestas y procesiones), Teatre Capitoli (450 plazas, programación de teatro y música), Centre Cultural Algemesí (300 plazas). La villa acoge cada septiembre la Festa de la Mare de Déu de la Salut (procesiones únicas de muixerangues y la Capella de Música) y el Festival Internacional de Música de Algemesí (julio). Conectada con Valencia por A-7/N-340 (35 km, 30 min) y Rodalies C-1 desde Estación del Norte (35 min, 4,80€); con Alzira por N-340 (8 km, 12 min); con Sueca por CV-510 (12 km, 15 min). Carpooling ConcertRide a Medusa Festival Cullera (15 km, 2–4€), Iboga Summer Tavernes (25 km, 2–4€), Arenal Sound Burriana (90 km, 5–8€), Zevra Valencia (35 km, 3–5€), Vive Latino (650 km, 28–38€) y Valencia centro (35 km, 3–5€). Sin comisión, vuelta nocturna coordinada (último Rodalies C-1 23:15).",
    venues: ["Auditori Municipal d'Algemesí", "Plaza Mayor", "Teatre Capitoli", "Centre Cultural Algemesí"],
    lat: 39.1903, lng: -0.4361,
  },

  {
    slug: "sax",
    city: "Sax",
    display: "Sax",
    region: "Comunidad Valenciana",
    blurb:
      "Sax (Alicante, 9.000 habitantes) es una villa del Alto Vinalopó, conocida por su Castillo medieval del siglo XII (sobre roca calcárea) y por las Fiestas de Moros y Cristianos (febrero). Recintos: Castillo de Sax (escenario simbólico de conciertos al aire libre en agosto), Plaza Mayor (conciertos populares en fiestas), Casa de Cultura de Sax (350 plazas, programación municipal), Plaza de Toros (3.000 plazas, conciertos en feria). La villa acoge cada febrero las Fiestas de Moros y Cristianos (declaradas Interés Turístico Internacional) y conciertos de la Feria de Sant Bertomeu (agosto). Conectada con Alicante por A-31 (45 km, 35 min) y Renfe MD Alicante–Madrid (35 min, 5,90€); con Elda–Petrer por CV-83 (8 km, 10 min); con Albacete por A-31 (135 km, 1h 20 min). Carpooling ConcertRide a Low Festival Benidorm (75 km, 5–7€), Marenostrum Fuengirola (400 km, 16–22€), Leyendas del Rock Villena (15 km, 2–4€), Son of Spain Alicante (45 km, 3–6€), Festival Internacional de Música de Mediterránea (45 km, 3–6€) y Alicante centro (45 km, 3–6€). Sin comisión, vuelta nocturna coordinada (último tren MD Sax–Alicante 21:30, no útil para vuelta de festival).",
    venues: ["Castillo de Sax", "Plaza Mayor", "Casa de Cultura de Sax", "Plaza de Toros"],
    lat: 38.5419, lng: -0.8175,
  },

];

export const CITY_LANDINGS_BY_SLUG = Object.fromEntries(
  CITY_LANDINGS.map((c) => [c.slug, c]),
);

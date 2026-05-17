// Region (Comunidad Autónoma) landing pages at /festivales-en/:slug.
// Each entry targets "festivales en [Región] 2026" queries with festival listings,
// carpooling logistics, and schema.org AdministrativeArea + FAQPage markup.

export interface RegionLanding {
  slug: string;              // URL slug for /festivales-en/:slug
  name: string;              // e.g. "Comunidad de Madrid"
  displayName: string;       // e.g. "Madrid" (short)
  isoCode: string;           // ISO 3166-2 e.g. "ES-MD"
  lat: number;               // region center
  lng: number;
  blurb: string;             // 2-3 factual sentences about festivals + carpooling in this region
  festivalsInRegion: string[]; // festival slugs from festivalLandings.ts
  mainCities: string[];      // top origin cities for carpooling in this region
  upcomingFestivalHighlight?: string; // slug of the top festival
  faqs: Array<{ q: string; a: string }>;
}

export const REGION_LANDINGS: RegionLanding[] = [
  {
    slug: "madrid",
    name: "Comunidad de Madrid",
    displayName: "Madrid",
    isoCode: "ES-MD",
    lat: 40.4168,
    lng: -3.7038,
    blurb:
      "La Comunidad de Madrid es el principal hub de festivales de España con más de 15 eventos anuales de primer nivel. Mad Cool (Iberdrola Music Villaverde, julio) y Tomavistas (Retiro, mayo) concentran la mayor asistencia. El acceso en transporte público pasada la medianoche es limitado, lo que convierte el carpooling en la opción más popular para asistentes de Valencia, Barcelona y Zaragoza.",
    festivalsInRegion: ["mad-cool", "tomavistas"],
    mainCities: ["Madrid", "Valencia", "Zaragoza", "Barcelona", "Sevilla", "Bilbao"],
    upcomingFestivalHighlight: "mad-cool",
    faqs: [
      {
        q: "¿Qué festivales hay en la Comunidad de Madrid en 2026?",
        a: "Los principales festivales de la Comunidad de Madrid en 2026 son Mad Cool Festival (Iberdrola Music Villaverde, 8–11 julio, 80.000 personas/día) y Tomavistas (Jardines del Buen Retiro, 15–17 mayo). Además, Madrid acoge múltiples conciertos de estadio en el Riyadh Air Metropolitano y el WiZink Center. Mad Cool es el festival de rock e indie alternativo más grande de Madrid y uno de los de mayor afluencia internacional de España.",
      },
      {
        q: "¿Cómo llegar a los festivales de Madrid desde Valencia?",
        a: "La distancia Valencia–Madrid es de 355 km (3h 20 min por la A-3 o el AVE en 1h 30 min). Para Mad Cool (Iberdrola Music Villaverde) o Tomavistas (Retiro), el carpooling con ConcertRide cuesta entre 10 y 14 €/asiento. El AVE Valencia–Madrid Atocha cuesta entre 25 y 70 € según antelación, pero requiere transporte adicional desde Atocha hasta Iberdrola Music (metro L3 Pradolongo o Legazpi, 30 min) o Retiro (metro Línea 2, 5 min).",
      },
      {
        q: "¿Cómo llegar a los festivales de Madrid desde Barcelona?",
        a: "Barcelona–Madrid son 620 km (5h 30 min en coche o 2h 30 min en AVE). El AVE cuesta entre 50 y 100 €; con ConcertRide el precio por asiento está entre 15 y 20 €. Para Iberdrola Music (Villaverde Bajo) desde Atocha conviene el metro L3 hasta Pradolongo o Legazpi (unos 30 min). El carpooling es especialmente popular para asistentes que quieren ir y volver del festival sin las restricciones horarias del tren.",
      },
      {
        q: "¿Cuánto cuesta el carpooling a Mad Cool desde Zaragoza?",
        a: "El trayecto Zaragoza–Madrid (Iberdrola Music Villaverde) son 325 km (3h por la A-2). Con ConcertRide, el precio por asiento oscila entre 9 y 13 €. Es el trayecto más frecuente de carpooling a Mad Cool después de Madrid–Madrid (desplazamiento urbano). El carpooling sale de la estación de Delicias o de la zona de la Gran Vía de Zaragoza.",
      },
      {
        q: "¿Hay transporte de madrugada de vuelta de Mad Cool?",
        a: "El metro de Madrid cierra sobre la 1:30 (se amplía hasta las 2:00–2:30 en noches de Mad Cool, con L3 reforzado hacia Pradolongo). Los autobuses nocturnos no tienen parada en Villaverde Bajo directa. Los taxis y VTC aplican precio x2–x3 de madrugada (60–90 €). El carpooling con ConcertRide es la única alternativa organizada para quienes vienen de otra provincia y necesitan volver cuando termine el último artista.",
      },
    ],
  },

  {
    slug: "cataluna",
    name: "Cataluña",
    displayName: "Cataluña",
    isoCode: "ES-CT",
    lat: 41.3851,
    lng: 2.1734,
    blurb:
      "Cataluña concentra los tres festivales urbanos de mayor proyección internacional de España: Primavera Sound (Parc del Fòrum, mayo–junio), Sónar (Fira Montjuïc y Gran Via de L'Hospitalet, junio) y Cruïlla (Parc del Fòrum, julio). Los tres se celebran en Barcelona y atraen asistentes de toda Europa. El metro de Barcelona llega a todos los recintos pero las salidas de madrugada se colapsan; el carpooling desde Madrid, Valencia y Zaragoza es la forma más habitual de asistir sin depender del AVE.",
    festivalsInRegion: ["primavera-sound", "sonar", "cruilla"],
    mainCities: ["Barcelona", "Madrid", "Valencia", "Zaragoza", "Bilbao"],
    upcomingFestivalHighlight: "primavera-sound",
    faqs: [
      {
        q: "¿Qué festivales hay en Cataluña en 2026?",
        a: "Los principales festivales de Cataluña en 2026 son: Primavera Sound Barcelona (Parc del Fòrum, 28 mayo–1 junio, 60.000 personas/día), Sónar (Fira Montjuïc y Fira Gran Via, 18–20 junio, 120.000 en total) y Cruïlla (Parc del Fòrum, 9–12 julio). Los tres se celebran en Barcelona o su área metropolitana y son internacionalmente reconocidos en las categorías indie/alternativo, electrónica y world music respectivamente.",
      },
      {
        q: "¿Cómo llegar a los festivales de Cataluña desde Madrid?",
        a: "Madrid–Barcelona son 620 km (5h 30 min en coche o 2h 30 min en AVE, 50–100 €). Para los tres festivales del Parc del Fòrum (Primavera Sound, Cruïlla) se toma el metro L4 hasta Besòs Mar. Para Sónar by Night en Fira Gran Via se toma L9 Sur hasta Fira. Con ConcertRide desde Madrid, el precio por asiento está entre 15 y 20 €, puerta a puerta, sin necesidad de combinar AVE + metro.",
      },
      {
        q: "¿Cuánto cuesta el carpooling a Primavera Sound desde Zaragoza?",
        a: "Zaragoza–Parc del Fòrum son 306 km (2h 45 min por la AP-2). Con ConcertRide, el precio por asiento está entre 8 y 12 €. Es el trayecto más cómodo para los aragoneses: salida desde el centro de Zaragoza y llegada directa al Fòrum, sin combinar tren y metro.",
      },
      {
        q: "¿Hay metro en los festivales de Barcelona?",
        a: "Sí. Para Primavera Sound y Cruïlla: metro L4 (Besòs Mar, a 10 min a pie del Fòrum). Para Sónar by Day en Fira Montjuïc: metro L3 (Espanya) o Trambaix. Para Sónar by Night en Fira Gran Via de L'Hospitalet: metro L9 Sur (Fira). TMB amplía el servicio nocturno en noches de festival (hasta las 3:00–4:00), pero las salidas de madrugada tienen colas de 30–45 minutos. Para quienes llegan de otras provincias, el carpooling con ConcertRide evita la espera del metro y el transbordo.",
      },
      {
        q: "¿Cuánto cuesta el carpooling a los festivales de Barcelona desde Valencia?",
        a: "Valencia–Barcelona son 355 km (3h 15 min). Con ConcertRide, el precio por asiento a Primavera Sound, Sónar o Cruïlla está entre 10 y 14 €. El tren AVE Valencia–Barcelona cuesta entre 20 y 60 € y requiere metro adicional hasta el recinto (30–40 min más). Muchos valencianos organizan fin de semana completo en Barcelona para el festival.",
      },
    ],
  },

  {
    slug: "comunidad-valenciana",
    name: "Comunidad Valenciana",
    displayName: "Valencia",
    isoCode: "ES-VC",
    lat: 39.4697,
    lng: -0.3774,
    blurb:
      "La Comunidad Valenciana tiene la mayor concentración de festivales de España con 5 festivales listados en ConcertRide: FIB (Benicàssim, julio), Arenal Sound (Burriana, agosto), Medusa Festival (Cullera, agosto), Zevra Festival (Valencia ciudad, julio) y Low Festival (Benidorm, julio). La provincia de Castellón y el litoral mediterráneo concentran la mayor actividad de verano; el transporte público nocturno es muy limitado en todos los recintos, lo que convierte el coche compartido en la opción dominante.",
    festivalsInRegion: ["fib", "arenal-sound", "medusa-festival", "zevra-festival", "low-festival"],
    mainCities: ["Valencia", "Madrid", "Barcelona", "Murcia", "Zaragoza"],
    upcomingFestivalHighlight: "arenal-sound",
    faqs: [
      {
        q: "¿Qué festivales hay en la Comunidad Valenciana en 2026?",
        a: "La Comunidad Valenciana acoge 5 festivales en ConcertRide para 2026: FIB — Festival Internacional de Benicàssim (16–19 julio, Benicàssim, 45.000 personas/día), Arenal Sound (29 julio–2 agosto, Playa de Burriana, 40.000/día), Medusa Festival (12–16 agosto, Playa de Cullera, 60.000/día), Zevra Festival (julio, La Marina de València) y Low Festival (24–26 julio, Benidorm, Alicante). Es la comunidad con mayor densidad de festivales de verano de España.",
      },
      {
        q: "¿Cómo llegar a los festivales de Valencia desde Madrid?",
        a: "Madrid–Valencia ciudad son 355 km (3h 20 min por la A-3). Para los festivales más lejanos: FIB (Benicàssim) son 465 km (4h), Arenal Sound (Burriana) 460 km (4h), Medusa (Cullera) 395 km (3h 30 min). Con ConcertRide desde Madrid, el precio por asiento es de 10–14 € a Valencia ciudad, 12–17 € a Arenal Sound y FIB, 10–15 € a Medusa. El AVE Madrid–Valencia cuesta entre 25 y 65 € pero no llega a los recintos de playa.",
      },
      {
        q: "¿Cuánto cuesta el carpooling a Arenal Sound desde Valencia?",
        a: "Valencia–Burriana (Arenal Sound) son 65 km (45 min por la AP-7). Con ConcertRide, el precio por asiento está entre 3 y 6 €. Es el trayecto más popular del festival y el más barato: más económico que un taxi (30–40 €) e igual de rápido. Muchos asistentes valencianos buscan conductor en ConcertRide para llegar al camping el miércoles antes del festival.",
      },
      {
        q: "¿Hay transporte público a los festivales valencianos?",
        a: "El transporte público nocturno es muy limitado en todos los recintos de la Comunidad Valenciana. Para FIB (Benicàssim) hay shuttle oficial desde la estación de Castellón (15 km) pero no hay conexión de madrugada. Arenal Sound (playa de Burriana) no tiene conexión nocturna desde Castellón. Medusa Festival (Cullera) no tiene transporte público nocturno. Zevra Festival en La Marina de València sí tiene metro L4 hasta Marítim-Serreria. El carpooling con ConcertRide es la solución más habitual para todos excepto Zevra.",
      },
      {
        q: "¿Qué festival es mejor, Arenal Sound o FIB?",
        a: "Arenal Sound (Burriana, playa, pop/indie/electrónica, agosto) y FIB (Benicàssim, playa, indie/alternativo, julio) son los dos festivales más veteranos de la Comunidad Valenciana. El FIB es más indie y con más artistas internacionales de primera línea; Arenal Sound tiene ambiente más festivo y orientado al pop español. Ambos están a menos de 70 km de Valencia. Con ConcertRide puedes ir a ambos sin coche propio: Valencia–FIB desde 3–6 €, Valencia–Arenal Sound desde 3–6 €/asiento.",
      },
    ],
  },

  {
    slug: "pais-vasco",
    name: "País Vasco",
    displayName: "País Vasco",
    isoCode: "ES-PV",
    lat: 43.263,
    lng: -2.935,
    blurb:
      "El País Vasco concentra su oferta de festivales en Bilbao BBK Live (Kobetamendi, julio), uno de los festivales de rock internacional más importantes del norte de España con 30.000 personas diarias. El acceso al monte Kobetamendi requiere lanzadera oficial desde el centro de Bilbao (gratuita con la entrada) o carpooling desde ciudades como Donostia, Vitoria, Pamplona, Santander y Madrid. La concentración de asistentes del norte peninsular hace del carpooling la opción predominante.",
    festivalsInRegion: ["bbk-live"],
    mainCities: ["Bilbao", "San Sebastián", "Pamplona", "Madrid", "Barcelona"],
    upcomingFestivalHighlight: "bbk-live",
    faqs: [
      {
        q: "¿Qué festivales hay en el País Vasco en 2026?",
        a: "El principal festival del País Vasco en 2026 es Bilbao BBK Live (Parque de Kobetamendi, Bilbao, 9–11 julio, 30.000 personas/día), uno de los festivales de rock e indie internacional más relevantes del norte de España. Además, el Heineken Jazzaldia en Donostia–San Sebastián (julio, Plaza de la Trinidad) es la cita de jazz más importante de la Península. El Azkena Rock Festival se celebra en Vitoria-Gasteiz (Mendizabala, junio).",
      },
      {
        q: "¿Cómo llegar al BBK Live desde Donostia?",
        a: "La distancia Donostia–Bilbao es de 100 km (1 hora por la AP-8). Con ConcertRide, el precio por asiento está entre 4 y 7 €. El Euskotren conecta ambas ciudades pero el último servicio sale antes de las 23:00, lo que hace imposible la vuelta de madrugada. Una vez en Bilbao, la lanzadera oficial gratuita sube a Kobetamendi desde Plaza Moyúa.",
      },
      {
        q: "¿Cómo llegar al BBK Live desde Madrid?",
        a: "Madrid–Bilbao son 395 km (3h 30 min por la A-1 o la AP-1). Con ConcertRide, el precio por asiento está entre 11 y 16 €. El vuelo cuesta entre 60 y 120 € con equipaje; el autobús de larga distancia cuesta 20–35 € pero llega a Termibús Bilbao (a 5 km del punto de salida de la lanzadera). El carpooling de ConcertRide te deja en el centro de Bilbao directamente.",
      },
      {
        q: "¿Cuánto cuesta el carpooling al BBK Live desde Pamplona?",
        a: "Pamplona–Bilbao son 155 km (1h 30 min por la A-15 y la A-68). Con ConcertRide, el precio por asiento está entre 5 y 8 €. El autobús ALSA opera líneas Pamplona–Bilbao (unas 2h, 10–16 €) pero sin frecuencias de madrugada para la vuelta del festival.",
      },
      {
        q: "¿Hay lanzadera oficial desde el centro de Bilbao al BBK Live?",
        a: "Sí. BBK Live organiza autobuses lanzadera gratuitos desde el centro de Bilbao (Plaza Moyúa y estación de Abando) hasta el monte Kobetamendi durante toda la jornada, con frecuencias de unos 15 minutos. El servicio está incluido en el precio de la entrada. Una vez llegues a Bilbao en carpooling con ConcertRide, la lanzadera oficial se encarga de llevarte hasta el recinto.",
      },
    ],
  },

  {
    slug: "andalucia",
    name: "Andalucía",
    displayName: "Andalucía",
    isoCode: "ES-AN",
    lat: 37.3891,
    lng: -5.9845,
    blurb:
      "Andalucía concentra su oferta de festivales en la costa malagueña: Cala Mijas (Cortijo de Torres, Málaga, 2–4 octubre) es el festival de rock internacional más relevante del sur de España en otoño. La región acoge además Interestelar Sevilla (mayo), Icónica Sevilla Fest (verano) y Marenostrum (Fuengirola, agosto). El transporte público nocturno en la Costa del Sol es muy limitado, lo que convierte el coche compartido entre asistentes de Sevilla, Granada, Córdoba y Madrid en la opción más utilizada.",
    festivalsInRegion: ["cala-mijas"],
    mainCities: ["Sevilla", "Málaga", "Granada", "Córdoba", "Madrid", "Barcelona"],
    upcomingFestivalHighlight: "cala-mijas",
    faqs: [
      {
        q: "¿Qué festivales hay en Andalucía en 2026?",
        a: "Los principales festivales de Andalucía en 2026 incluyen: Cala Mijas Festival (Cortijo de Torres, Málaga, 2–4 octubre, referencia del rock internacional en el sur), Interestelar Sevilla (Charco de la Pava, mayo), Icónica Sevilla Fest (Plaza de España, junio–julio), y Marenostrum Music Castle (Castillo Sohail, Fuengirola, agosto). Cala Mijas es el único festival andaluz listado actualmente en ConcertRide con página propia.",
      },
      {
        q: "¿Cómo llegar a Cala Mijas desde Sevilla?",
        a: "Sevilla–Cortijo de Torres (Cala Mijas) son aproximadamente 200 km (2h por la A-92 y la A-7). Con ConcertRide, el precio por asiento desde Sevilla está entre 6 y 9 €. No existe transporte público directo entre Sevilla y el recinto en horarios de festival. El carpooling es la opción habitual para los sevillanos que asisten a este festival.",
      },
      {
        q: "¿Cómo llegar a Cala Mijas desde Madrid?",
        a: "Madrid–Cortijo de Torres (Cala Mijas) son 550 km (5h por la A-4 y la A-7). Con ConcertRide, el precio por asiento desde Madrid está entre 12 y 18 €. El AVE Madrid–Málaga cuesta entre 40 y 90 € y tarda 2h 15 min hasta la estación de Málaga; desde allí hay que añadir taxi o transporte privado hasta Cortijo de Torres (unos 12 km al oeste de Málaga capital). El carpooling de ConcertRide es la opción más directa al recinto.",
      },
      {
        q: "¿Cómo llegar a Cala Mijas desde Granada?",
        a: "Granada–Cortijo de Torres son 170 km (1h 30 min por la A-92 y la A-7). Con ConcertRide, el precio por asiento desde Granada está entre 5 y 8 €. La A-92 es la vía más directa desde Granada hacia Málaga. No existe autobús nocturno con cobertura hasta el recinto.",
      },
      {
        q: "¿Cuánto cuesta el carpooling a los festivales andaluces desde Barcelona?",
        a: "Barcelona–Málaga son 1.000 km (9h en coche). Los barceloneses que asisten a Cala Mijas suelen combinar vuelo de bajo coste Barcelona–Málaga (desde 30–60 €) con carpooling local desde el aeropuerto hasta el festival (unos 15 km, 4–6 €/asiento con ConcertRide). El tren AVE Barcelona–Málaga con trasbordo en Madrid cuesta 70–150 € y tarda entre 5 y 7 horas.",
      },
    ],
  },

  {
    slug: "galicia",
    name: "Galicia",
    displayName: "Galicia",
    isoCode: "ES-GA",
    lat: 42.8782,
    lng: -8.5448,
    blurb:
      "Galicia acoge dos de los festivales más singulares de España: Resurrection Fest (Viveiro, junio), el festival de metal más importante del país con 30.000 personas diarias, y O Son do Camiño (Monte do Gozo, Santiago de Compostela, junio), uno de los festivales con mayor aforo de España con más de 90.000 asistentes. Ambos recintos carecen de transporte público nocturno, lo que hace del carpooling la solución dominante: especialmente para Resurrection Fest en Viveiro, donde el aislamiento geográfico hace que el 90% de los asistentes lleguen en coche o carpooling.",
    festivalsInRegion: ["resurrection-fest", "o-son-do-camino"],
    mainCities: ["Santiago de Compostela", "Vigo", "A Coruña", "Madrid", "Barcelona"],
    upcomingFestivalHighlight: "resurrection-fest",
    faqs: [
      {
        q: "¿Qué festivales hay en Galicia en 2026?",
        a: "Los principales festivales de Galicia en 2026 son: Resurrection Fest (A Gañidoira, Viveiro, Lugo, 25–28 junio, 30.000 personas/día), el festival de metal más importante de España, y O Son do Camiño (Monte do Gozo, Santiago de Compostela, 18–20 junio, 90.000+ asistentes), uno de los festivales de mayor aforo de la Península con cartel de pop y rock internacional. Ambos se celebran en junio y son destino habitual de asistentes de toda España.",
      },
      {
        q: "¿Cómo llegar a Resurrection Fest desde Madrid?",
        a: "Madrid–Viveiro son 600 km (6h por la A-6). Con ConcertRide, el precio por asiento está entre 16 y 22 €. No existe AVE ni aeropuerto cerca de Viveiro. El autobús ALSA Madrid–A Coruña cuesta 30–50 € pero requiere transbordo y no llega a Viveiro en horarios de madrugada. El carpooling de ConcertRide es la única opción práctica para volver del festival a cualquier hora.",
      },
      {
        q: "¿Cómo llegar a O Son do Camiño desde A Coruña?",
        a: "A Coruña–Monte do Gozo (Santiago de Compostela) son 75 km (50 min por la AP-9). Con ConcertRide, el precio por asiento está entre 3 y 6 €. El tren de Cercanías RENFE A Coruña–Santiago opera durante el día pero las frecuencias de madrugada son muy bajas. Desde Santiago ciudad hasta el Monte do Gozo hay servicio de bus urbano C10 pero no en horario nocturno de festival.",
      },
      {
        q: "¿Cuánto cuesta el carpooling a Resurrection Fest desde Bilbao?",
        a: "Bilbao–Viveiro son 375 km (4h por la A-8 y la N-634). Con ConcertRide, el precio por asiento está entre 10 y 15 €. No existe tren directo ni autobús cómodo en este trayecto. El carpooling es la única alternativa real para los asistentes del norte de España. Muchos fans del metal de Bilbao, Donostia y Santander organizan grupos de 4 personas y dividen el coste de la gasolina.",
      },
      {
        q: "¿Hay transporte público a Resurrection Fest desde Vigo?",
        a: "Vigo–Viveiro son 200 km (2h 15 min por la AP-9 y la A-8). No existe autobús directo Vigo–Viveiro en horarios de festival; ALSA opera rutas con transbordo en Santiago o Lugo pero sin frecuencias de madrugada. Con ConcertRide, el precio por asiento desde Vigo está entre 6 y 9 €, con salida coordinada con otros fans del metal y vuelta flexible al final del festival.",
      },
    ],
  },

  {
    slug: "castilla-leon",
    name: "Castilla y León",
    displayName: "Castilla y León",
    isoCode: "ES-CL",
    lat: 41.6518,
    lng: -4.7245,
    blurb:
      "Castilla y León concentra su festival de referencia en Sonorama Ribera (Aranda de Duero, Burgos, agosto), uno de los festivales de indie y pop español más queridos del circuito nacional con capacidad para 20.000 personas diarias. Aranda de Duero carece de conexión ferroviaria directa desde Madrid o Valladolid, por lo que el carpooling desde la capital (1h 45 min, 10–14 €) y desde Valladolid (1h, 8–12 €) es la opción más utilizada para asistir al festival.",
    festivalsInRegion: ["sonorama-ribera"],
    mainCities: ["Valladolid", "Burgos", "Salamanca", "Madrid", "Bilbao"],
    upcomingFestivalHighlight: "sonorama-ribera",
    faqs: [
      {
        q: "¿Qué festivales hay en Castilla y León en 2026?",
        a: "El principal festival de Castilla y León en 2026 es Sonorama Ribera (Aranda de Duero, Burgos, 6–9 agosto, 20.000 personas/día), festival de indie y pop español que cumple en 2026 su 27ª edición. Es uno de los festivales con mayor antigüedad y fidelidad de público del panorama nacional. Además, Valladolid acoge conciertos en el Pabellón Pisuerga y en la Plaza de Toros durante el verano.",
      },
      {
        q: "¿Cómo llegar a Sonorama Ribera desde Madrid?",
        a: "Madrid–Aranda de Duero son 155 km (1h 45 min por la A-1). Con ConcertRide, el precio por asiento está entre 10 y 14 €. La empresa La Sepulvedana opera autobuses Madrid–Aranda (10–15 €, 2h) pero sin servicio nocturno para la vuelta del festival. El carpooling es la opción más popular: muchos madrileños buscan conductor para el fin de semana del festival y vuelven cuando terminan los últimos conciertos.",
      },
      {
        q: "¿Cuánto cuesta el carpooling a Sonorama desde Valladolid?",
        a: "Valladolid–Aranda de Duero son 100 km (1h por la A-11). Con ConcertRide, el precio por asiento está entre 8 y 12 €. Es el trayecto de carpooling más habitual del festival después del de Madrid. Muchos vallisoletanos hacen la ida y vuelta el mismo día o se quedan en el camping del festival.",
      },
      {
        q: "¿Hay camping en Sonorama Ribera?",
        a: "Sí, Sonorama Ribera tiene zona de camping incluida con determinados tipos de abono. El recinto de Aranda de Duero tiene parking accesible y los campistas suelen llegar el jueves por la tarde. El carpooling con ConcertRide permite traer el equipo de camping directamente desde Madrid, Valladolid, Burgos o Salamanca sin depender del autobús de línea.",
      },
      {
        q: "¿Cómo ir a Sonorama Ribera desde Bilbao?",
        a: "Bilbao–Aranda de Duero son 185 km (1h 45 min por la A-1). Con ConcertRide, el precio por asiento desde Bilbao está entre 7 y 11 €. No existe tren directo Bilbao–Aranda. El autobús de larga distancia requiere transbordo en Burgos o Miranda de Ebro con frecuencias muy reducidas. El carpooling es la opción más directa y flexible.",
      },
    ],
  },

  {
    slug: "castilla-la-mancha",
    name: "Castilla-La Mancha",
    displayName: "Castilla-La Mancha",
    isoCode: "ES-CM",
    lat: 39.8623,
    lng: -2.7549,
    blurb:
      "Castilla-La Mancha acoge Viña Rock (Villarrobledo, Albacete, mayo), el festival de rock alternativo, punk y metal más grande de España por número de asistentes, con capacidad para más de 150.000 personas a lo largo de sus jornadas. El recinto está en Villarrobledo, a 50 km de Albacete, sin transporte público nocturno desde la localidad. Los organizadores habilitan lanzaderas desde Albacete y los asistentes de Madrid (220 km), Valencia (200 km) y Murcia (155 km) organizan carpooling masivo a través de ConcertRide.",
    festivalsInRegion: ["vina-rock"],
    mainCities: ["Albacete", "Toledo", "Guadalajara", "Madrid", "Valencia"],
    upcomingFestivalHighlight: "vina-rock",
    faqs: [
      {
        q: "¿Qué festivales hay en Castilla-La Mancha en 2026?",
        a: "El principal festival de Castilla-La Mancha en 2026 es Viña Rock (Villarrobledo, Albacete, mayo), el festival de rock alternativo, punk y metal más grande de España por aforo acumulado (más de 150.000 asistentes en ediciones recientes). El festival dura 3 días y tiene camping incluido. La organización habilita lanzaderas desde Albacete hasta el recinto de Villarrobledo (50 km).",
      },
      {
        q: "¿Cómo llegar a Viña Rock desde Madrid?",
        a: "Madrid–Villarrobledo son 220 km (2h por la A-3 y la N-310). Con ConcertRide, el precio por asiento está entre 6 y 9 €. Varios operadores privados ofrecen autobuses Madrid–Viñarock (35–55 €, sin reserva de asiento incluida). El carpooling con ConcertRide es más barato y flexible: puedes acordar punto de salida, hora y vuelta directamente con el conductor.",
      },
      {
        q: "¿Hay bus desde Albacete a Viña Rock?",
        a: "Sí. La organización de Viña Rock habilita autobuses lanzadera desde la estación de autobuses de Albacete hasta el recinto de Villarrobledo (50 km, unos 40 min). El servicio funciona en franjas de entrada y salida, con plazas limitadas. Para asistentes de Madrid, Valencia o Murcia, ConcertRide permite llegar directamente al recinto o a la lanzadera de Albacete sin necesidad de transbordo.",
      },
      {
        q: "¿Cuánto cuesta el carpooling a Viña Rock desde Valencia?",
        a: "Valencia–Villarrobledo son unos 200 km (1h 45 min por la A-3 y la N-310). Con ConcertRide, el precio por asiento desde Valencia está entre 6 y 9 €. Es uno de los trayectos con más demanda de carpooling en el festival, junto con Madrid–Viñarock. Muchos grupos de amigos de Valencia organizan sus grupos de 4–5 personas directamente por ConcertRide.",
      },
      {
        q: "¿Cómo llegar a Viña Rock desde Murcia?",
        a: "Murcia–Villarrobledo son 155 km (1h 30 min por la A-30 y la A-3). Con ConcertRide, el precio por asiento desde Murcia está entre 5 y 8 €. Es la tercera ciudad de origen con más asistentes al festival, después de Madrid y Valencia. El autobús de línea Murcia–Albacete existe pero requiere transbordo y no cubre horarios de madrugada.",
      },
    ],
  },

  {
    slug: "aragon",
    name: "Aragón",
    displayName: "Aragón",
    isoCode: "ES-AR",
    lat: 41.6488,
    lng: -0.8891,
    blurb:
      "Aragón es punto de cruce natural entre Madrid, Barcelona, País Vasco y Valencia gracias a su capital, Zaragoza (700.000 habitantes), y a la red A-2/AP-2. La región acoge Pirineos Sur (Sallent de Gállego, Huesca, julio) — único festival europeo con escenario flotante sobre el embalse de Lanuza — y Vive Latino España (Espacio Expo Zaragoza, septiembre). Las dos sedes carecen de transporte público nocturno hasta los recintos, por lo que el carpooling concentra el 60–70 % del tráfico de asistentes desde Madrid, Bilbao, Barcelona y Valencia. La región ahorra de media un 75 % de emisiones de CO₂ por trayecto compartido frente al vehículo individual.",
    festivalsInRegion: ["pirineos-sur", "vive-latino"],
    mainCities: ["Zaragoza", "Huesca", "Teruel", "Madrid", "Barcelona", "Bilbao"],
    upcomingFestivalHighlight: "pirineos-sur",
    faqs: [
      {
        q: "¿Qué festivales hay en Aragón en 2026?",
        a: "Los principales festivales de Aragón en 2026 son Pirineos Sur (Sallent de Gállego, Huesca, 10–25 julio, 15.000 personas/día, único en Europa con escenario flotante sobre el embalse de Lanuza) y Vive Latino España (Espacio Expo Zaragoza, 4–5 septiembre, primera edición europea del histórico festival mexicano fundado en 1998, cartel de reggaetón, rock latino y pop urbano).",
      },
      {
        q: "¿Cómo llegar a Pirineos Sur desde Zaragoza?",
        a: "Zaragoza–Sallent de Gállego son 175 km (2h 15 min por la A-23 hasta Huesca y la A-136). Con ConcertRide, el precio por asiento está entre 6 y 9 €. No existe autobús nocturno hasta Sallent de Gállego; ALSA y Avanza operan rutas Zaragoza–Jaca (95 km al sur del recinto) sin frecuencias de madrugada. El carpooling es la opción mayoritaria para los aragoneses.",
      },
      {
        q: "¿Cómo llegar a Vive Latino Zaragoza desde Madrid?",
        a: "Madrid–Espacio Expo Zaragoza son 325 km (3h por la A-2). Con ConcertRide, el precio por asiento está entre 9 y 13 €. El AVE Madrid–Zaragoza Delicias cuesta entre 25 y 70 € y tarda 1h 15 min, pero requiere taxi adicional (8–12 €) hasta el Espacio Expo. El carpooling deja directamente en el recinto, sin transbordos.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Barcelona a Zaragoza para festival?",
        a: "Barcelona–Zaragoza son 310 km (3h 5 min por la AP-2). Con ConcertRide, el precio por asiento está entre 9 y 13 €. Es uno de los trayectos con más demanda histórica del festival Vive Latino, junto con Madrid–Zaragoza. El ahorro medio en emisiones de CO₂ frente al desplazamiento individual es de 75–80 % (15 kg CO₂ por asiento en grupo de 4 frente a 60 kg en coche solo).",
      },
      {
        q: "¿Hay parking en los festivales de Aragón?",
        a: "Pirineos Sur habilita parking gratuito en Sallent de Gállego para asistentes con coche, pero el aforo es limitado y se llena en las primeras horas de jornada. Vive Latino Zaragoza cuenta con parking de pago en el Espacio Expo (5–10 €/día). Para los dos festivales, el carpooling con ConcertRide reduce la presión sobre el aparcamiento y permite llegar con margen sin colas de acceso.",
      },
    ],
  },

  {
    slug: "asturias",
    name: "Principado de Asturias",
    displayName: "Asturias",
    isoCode: "ES-AS",
    lat: 43.3614,
    lng: -5.8593,
    blurb:
      "Asturias (1 millón de habitantes, capital Oviedo) concentra su oferta festivalera en dos citas costeras: Metrópoli Gijón (Recinto Ferial Luis Adaro, julio) — uno de los festivales urbanos con mayor crecimiento del norte — y Aquasella Festival (Arriondas, julio) — referente del techno de vanguardia desde 1996, situado en plena naturaleza del oriente asturiano. La red de transporte público nocturno desde Gijón a Arriondas (60 km) es prácticamente inexistente y el carpooling concentra a asistentes de Oviedo, Santander, Bilbao y A Coruña. La A-8 conecta toda la cornisa cantábrica y es la vía principal para el tráfico compartido.",
    festivalsInRegion: ["metropoli-gijon", "aquasella-festival"],
    mainCities: ["Oviedo", "Gijón", "Avilés", "Santander", "Bilbao", "A Coruña"],
    upcomingFestivalHighlight: "metropoli-gijon",
    faqs: [
      {
        q: "¿Qué festivales hay en Asturias en 2026?",
        a: "Los principales festivales de Asturias en 2026 son Metrópoli Gijón (Recinto Ferial Luis Adaro, Gijón, 10–12 julio, 30.000 personas/día, pop e indie internacional) y Aquasella Festival (Arriondas, 16–18 julio, 12.000 personas/día, techno de vanguardia y electrónica en plena naturaleza, edición número 30 en 2026). Es la región con mejor mezcla pop-urbano + techno underground del norte de España.",
      },
      {
        q: "¿Cómo llegar a Aquasella desde Oviedo?",
        a: "Oviedo–Arriondas son 65 km (50 min por la A-64). Con ConcertRide, el precio por asiento está entre 4 y 7 €. El tren FEVE de Renfe Oviedo–Arriondas opera con frecuencias diurnas (1h 30 min de trayecto) pero el último servicio sale antes de las 22:00, lo que impide la vuelta nocturna. El carpooling es la opción dominante para los ovetenses.",
      },
      {
        q: "¿Cómo llegar a Metrópoli Gijón desde Madrid?",
        a: "Madrid–Gijón son 460 km (4h 30 min por la A-6 y la AP-66). Con ConcertRide, el precio por asiento está entre 13 y 18 €. El tren ALVIA Madrid–Gijón cuesta entre 35 y 70 € y tarda 4h 45 min; el autobús ALSA cuesta 25–40 € en unas 5h 30 min. El carpooling es la única opción puerta a puerta para llegar al Recinto Ferial Luis Adaro sin combinar con taxi o bus urbano gijonés.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Bilbao a Asturias?",
        a: "Bilbao–Gijón son 295 km (2h 50 min por la A-8). Con ConcertRide, el precio por asiento está entre 9 y 13 €. Es la ruta más usada entre dos ciudades de la cornisa cantábrica para asistir a Metrópoli o Aquasella. El ahorro medio en CO₂ es del 75 % por asiento compartido frente al vehículo individual.",
      },
      {
        q: "¿Hay transporte nocturno desde Aquasella Festival?",
        a: "No. Arriondas no tiene transporte público nocturno de vuelta a Oviedo, Gijón o Santander. El festival habilita zona de camping en el recinto (incluida con abono completo) y muchos asistentes pernoctan en la zona. Para los que prefieren volver a su ciudad, el carpooling con ConcertRide coordina la vuelta cuando termina el último DJ, sin depender del horario del tren FEVE.",
      },
    ],
  },

  {
    slug: "baleares",
    name: "Illes Balears",
    displayName: "Baleares",
    isoCode: "ES-IB",
    lat: 39.5696,
    lng: 2.6502,
    blurb:
      "Baleares (1,2 millones de habitantes, capital Palma) acoge Mallorca Live Festival (Calvià, mayo), uno de los festivales pop e indie con mayor proyección internacional del Mediterráneo, con cartel anual de 80.000 asistentes en 3 jornadas. Al ser un archipiélago, el acceso desde la Península se realiza por avión (Madrid–Palma, Barcelona–Palma, 1h de vuelo) o ferri (Barcelona/Valencia–Palma, 7–8h). El carpooling balear opera principalmente intra-isla: desde Palma hasta el recinto (Antigua Aqualand, Calvià, 18 km), y entre los principales núcleos turísticos. ConcertRide reduce el coste medio del traslado al recinto un 60 % frente al taxi (20–35 € por persona).",
    festivalsInRegion: ["mallorca-live-festival"],
    mainCities: ["Palma de Mallorca", "Inca", "Manacor", "Calvià", "Maó", "Eivissa"],
    upcomingFestivalHighlight: "mallorca-live-festival",
    faqs: [
      {
        q: "¿Qué festivales hay en Baleares en 2026?",
        a: "El principal festival de Baleares en 2026 es Mallorca Live Festival (Antiguo Aqualand, Calvià, 13–16 mayo, 25.000 personas/día, pop e indie internacional). Además, las islas acogen festivales temáticos puntuales (BCM Festival en Magaluf, eventos privados de electrónica en Ibiza y Formentera durante todo el verano), pero Mallorca Live es el único con página propia en ConcertRide y carpooling activo.",
      },
      {
        q: "¿Cómo llegar a Mallorca Live desde Palma?",
        a: "Palma–Calvià (Antiguo Aqualand) son 18 km (25 min por la Ma-1). Con ConcertRide, el precio por asiento está entre 3 y 5 €. El bus TIB línea 104 Palma–Magaluf opera durante el día (frecuencia 30 min) pero sin servicio nocturno de vuelta. El taxi cuesta 25–35 € por coche. El carpooling es la opción más económica para grupos pequeños.",
      },
      {
        q: "¿Se puede ir a Mallorca Live desde Barcelona?",
        a: "Sí, principalmente combinando avión + carpooling local. Barcelona–Palma son 1h de vuelo (40–120 € ida con Vueling, Iberia o Ryanair). El ferri Trasmediterránea Barcelona–Palma tarda 7–8h y cuesta 50–150 € con coche. Una vez en Palma, el carpooling con ConcertRide al recinto cuesta entre 3 y 5 €/asiento. El traslado completo es más rápido en avión + carpooling que en ferri con coche propio.",
      },
      {
        q: "¿Cuánto cuesta el transporte en Baleares para festivales?",
        a: "El bus TIB cubre los principales núcleos de Mallorca durante el día (1,50–8 € según trayecto) pero sin servicio nocturno desde la mayoría de festivales. El taxi en Mallorca tiene tarifas más altas que en la Península (precio mínimo 4–5 €, 1,20 €/km). Con ConcertRide, los trayectos cortos (Palma–Calvià, Palma–Magaluf) cuestan 3–5 €/asiento, frente a 25–35 € del taxi. Ahorro medio del 60–70 % por persona.",
      },
      {
        q: "¿Hay carpooling entre las islas Baleares?",
        a: "El carpooling intra-archipiélago es minoritario porque requiere ferri (Mallorca–Menorca 1h 45 min, Mallorca–Ibiza 2h 15 min) con coste adicional 30–60 € por coche. ConcertRide opera principalmente intra-isla: Palma–Calvià, Palma–Magaluf, Palma–Alcúdia. Para Menorca o Ibiza, los asistentes locales se desplazan por su propia red interna; los peninsulares vuelan a la isla destino del festival.",
      },
    ],
  },

  {
    slug: "canarias",
    name: "Canarias",
    displayName: "Canarias",
    isoCode: "ES-CN",
    lat: 28.2916,
    lng: -16.6291,
    blurb:
      "Canarias (2,2 millones de habitantes, capitales Las Palmas de Gran Canaria y Santa Cruz de Tenerife) tiene en GranCa Live Fest (Estadio de Gran Canaria, Las Palmas, junio) su festival pop más relevante, con cartel internacional y aforo medio de 30.000 personas/día. El archipiélago opera sin conexión por carretera con la Península, por lo que el carpooling canario es exclusivamente intra-isla: desde el centro de Las Palmas hasta el recinto (Estadio de Gran Canaria, barrio de Siete Palmas, 7 km) y entre los principales núcleos turísticos (Maspalomas, Playa del Inglés). El precio medio del carpooling intra-isla es de 3–6 €/asiento frente a 15–25 € del taxi. Sostenibilidad media: 70 % menos emisiones por asiento compartido.",
    festivalsInRegion: ["granca-live-fest"],
    mainCities: ["Las Palmas de Gran Canaria", "Santa Cruz de Tenerife", "Telde", "Arona", "Maspalomas", "La Laguna"],
    upcomingFestivalHighlight: "granca-live-fest",
    faqs: [
      {
        q: "¿Qué festivales hay en Canarias en 2026?",
        a: "El principal festival de Canarias en 2026 es GranCa Live Fest (Estadio de Gran Canaria, Las Palmas, 19–20 junio, 30.000 personas/día, pop e indie internacional con cabezas de cartel europeos). Tenerife acoge eventos puntuales en el Recinto Ferial de Santa Cruz, pero GranCa Live es el único festival canario con página propia en ConcertRide y carpooling activo durante las jornadas.",
      },
      {
        q: "¿Cómo llegar a GranCa Live Fest desde Las Palmas?",
        a: "Centro de Las Palmas–Estadio de Gran Canaria (Siete Palmas) son 7 km (15 min por la GC-1). Con ConcertRide, el precio por asiento está entre 3 y 5 €. Las guaguas amarillas líneas 47 y 80 conectan Plaza de la Estación con Siete Palmas durante el día (frecuencia 15–20 min) pero el servicio nocturno se reduce y no cubre la salida del estadio a las 2:00 AM. El carpooling es la opción más cómoda para la vuelta.",
      },
      {
        q: "¿Se puede ir a un festival en Canarias desde la Península?",
        a: "Sí, combinando avión + carpooling local. Madrid–Las Palmas son 2h 30 min de vuelo (50–200 € ida con Iberia, Air Europa, Ryanair o Vueling según antelación). Barcelona–Las Palmas 3h (60–220 €). Una vez en Las Palmas o Tenerife, el carpooling con ConcertRide al recinto cuesta 3–5 €/asiento, frente a 18–25 € del taxi. Muchos peninsulares aprovechan el viaje para hacer 4–5 días de turismo + festival.",
      },
      {
        q: "¿Hay carpooling entre Tenerife y Gran Canaria?",
        a: "No es habitual: el trayecto entre islas requiere ferri (Fred Olsen o Naviera Armas, 1h 30 min, 30–60 €/persona con coche) o vuelo interinsular Binter (25 min, 30–80 €). El carpooling se concentra intra-isla: Las Palmas–Estadio (GranCa Live), Santa Cruz–La Laguna, Maspalomas–Las Palmas. ConcertRide cubre las rutas urbanas con ahorro medio del 65 % frente al taxi.",
      },
      {
        q: "¿Cuánto se ahorra en CO₂ usando carpooling en Canarias?",
        a: "Un coche con 4 personas en el trayecto Las Palmas centro–Estadio (14 km ida y vuelta) emite ~3,4 kg de CO₂ en total frente a 13,6 kg si esas 4 personas usan 4 coches individuales. Ahorro medio del 75 % por asiento compartido. Para los 30.000 asistentes diarios del GranCa Live Fest, si el 40 % comparte coche se evitan aproximadamente 80 toneladas de CO₂ por jornada respecto al uso individual.",
      },
    ],
  },

  {
    slug: "cantabria",
    name: "Cantabria",
    displayName: "Cantabria",
    isoCode: "ES-CB",
    lat: 43.4623,
    lng: -3.8099,
    blurb:
      "Cantabria (584.000 habitantes, capital Santander) es paso obligado en la cornisa cantábrica entre País Vasco y Asturias gracias a la A-8. La región no tiene festivales propios con landing en ConcertRide, pero es origen y destino frecuente de carpooling para Bilbao BBK Live (95 km al este, 1h), Resurrection Fest en Viveiro (380 km al oeste, 4h) y Metrópoli Gijón (200 km al oeste, 2h). Santander es el principal nodo de carpooling cántabro y desde allí salen rutas a todos los festivales del norte peninsular. Ahorro medio del 78 % de emisiones CO₂ por asiento compartido en la ruta Santander–Bilbao.",
    festivalsInRegion: [],
    mainCities: ["Santander", "Torrelavega", "Castro Urdiales", "Laredo", "Bilbao", "Oviedo"],
    faqs: [
      {
        q: "¿Hay festivales en Cantabria en 2026?",
        a: "Cantabria no acoge en 2026 festivales de gran formato con landing propia en ConcertRide. La región sí celebra ciclos privados de verano en la Plaza Porticada de Santander, en el Palacio de Festivales y en la Plaza de Toros de Santander, pero sin landing dedicada. Los cántabros que asisten a festivales se desplazan a Bilbao BBK Live (95 km), Resurrection Fest (380 km) o Metrópoli Gijón (200 km).",
      },
      {
        q: "¿Cómo llegar al BBK Live desde Santander?",
        a: "Santander–Kobetamendi (Bilbao) son 105 km (1h 10 min por la A-8). Con ConcertRide, el precio por asiento está entre 4 y 7 €. ALSA opera autobuses Santander–Bilbao (1h 15 min, 8–15 €) pero la última salida nocturna desde Bilbao es a las 22:30, antes del final del BBK Live. El carpooling permite vuelta cuando termina el último cabeza de cartel (sobre las 2:00–3:00 AM).",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Santander a Resurrection Fest?",
        a: "Santander–Viveiro son 380 km (4h 15 min por la A-8). Con ConcertRide, el precio por asiento está entre 11 y 16 €. Es la opción más práctica para los metaleros cántabros: no existe tren directo ni autobús con frecuencia razonable, y el coche propio implica 80–100 € de combustible más peajes para una sola persona.",
      },
      {
        q: "¿Hay carpooling desde Torrelavega a festivales?",
        a: "Sí. Torrelavega (28 km de Santander, 56.000 habitantes) es el segundo origen cántabro más demandado en ConcertRide tras la capital. Los principales destinos son Bilbao BBK Live (1h 30 min, 5–8 €/asiento), Resurrection Fest (4h 30 min, 12–17 €) y Sonorama Ribera (2h 15 min, 9–13 €). Para festivales del norte, el carpooling es la opción dominante.",
      },
      {
        q: "¿Cómo llegar a Metrópoli Gijón desde Santander?",
        a: "Santander–Gijón son 200 km (1h 50 min por la A-8). Con ConcertRide, el precio por asiento está entre 6 y 9 €. El ALSA Santander–Gijón cuesta 12–20 € (2h 30 min) pero sin frecuencias nocturnas. El AVE no llega a Gijón desde Cantabria sin trasbordo en Madrid. El carpooling es la única opción puerta a puerta hasta el Recinto Ferial Luis Adaro.",
      },
    ],
  },

  {
    slug: "extremadura",
    name: "Extremadura",
    displayName: "Extremadura",
    isoCode: "ES-EX",
    lat: 39.4711,
    lng: -6.3722,
    blurb:
      "Extremadura (1 millón de habitantes, capital Mérida) acoge Stone & Music Festival (Anfiteatro Romano de Mérida, julio–septiembre), uno de los festivales más singulares de Europa al celebrarse en un anfiteatro romano del siglo I a.C. patrimonio UNESCO, con artistas pop, rock y soul internacionales. Stone & Music tiene un aforo de 3.500 personas/noche en 20 conciertos durante el verano. La región carece de red ferroviaria de alta velocidad — el AVE Madrid–Extremadura no llega aún a 2026 — y el carpooling desde Madrid (340 km, 3h 30 min), Sevilla (200 km, 2h 15 min) y Cáceres (75 km, 1h) es la opción mayoritaria. Ahorro medio 75 % CO₂ por asiento compartido.",
    festivalsInRegion: ["stone-music-festival"],
    mainCities: ["Mérida", "Badajoz", "Cáceres", "Plasencia", "Madrid", "Sevilla"],
    upcomingFestivalHighlight: "stone-music-festival",
    faqs: [
      {
        q: "¿Qué festivales hay en Extremadura en 2026?",
        a: "El principal festival de Extremadura en 2026 es Stone & Music Festival (Anfiteatro Romano de Mérida, julio a septiembre), 20 conciertos en formato íntimo (aforo 3.500/noche) celebrados en el anfiteatro romano del siglo I a.C., patrimonio UNESCO. El cartel histórico ha incluido a Pet Shop Boys, Sting, Anastacia, Tom Jones y los mejores artistas pop/rock españoles. Es uno de los festivales más singulares de Europa por el entorno arqueológico.",
      },
      {
        q: "¿Cómo llegar a Stone & Music Mérida desde Madrid?",
        a: "Madrid–Mérida son 340 km (3h 30 min por la A-5). Con ConcertRide, el precio por asiento está entre 10 y 14 €. El AVE no llega aún a Mérida (línea Madrid–Extremadura en construcción). El tren convencional Renfe Madrid–Mérida tarda 4h 30 min con trasbordo en Talavera y cuesta 35–60 €. El autobús ALSA Madrid–Mérida cuesta 20–30 € (4h). El carpooling es la opción más rápida y económica.",
      },
      {
        q: "¿Cómo llegar a Mérida desde Sevilla?",
        a: "Sevilla–Mérida son 200 km (2h 15 min por la A-66). Con ConcertRide, el precio por asiento está entre 7 y 10 €. ALSA opera Sevilla–Mérida (2h 30 min, 12–20 €) con frecuencia escasa en horario nocturno. El tren Renfe tarda 4h con trasbordo. El carpooling permite ida y vuelta el mismo día del concierto sin alojamiento adicional.",
      },
      {
        q: "¿Hay parking en el Anfiteatro Romano de Mérida?",
        a: "El acceso al recinto del Anfiteatro está restringido al tráfico rodado por su valor patrimonial. Los asistentes aparcan en parkings cercanos (Parking Conventual de Mérida, Parking Almendralejo a 800 m) por 1,50–2,50 €/h. En noches de concierto los parkings se saturan, especialmente con cabezas de cartel internacionales. El carpooling reduce la presión sobre el aparcamiento al concentrar 4 personas en un solo coche.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Cáceres a Mérida?",
        a: "Cáceres–Mérida son 75 km (1h por la A-66). Con ConcertRide, el precio por asiento está entre 3 y 6 €. Es el trayecto más popular del Stone & Music Festival entre las dos capitales extremeñas. El bus ALSA Cáceres–Mérida cuesta 6–10 € (1h 15 min) pero no opera de madrugada.",
      },
    ],
  },

  {
    slug: "la-rioja",
    name: "La Rioja",
    displayName: "La Rioja",
    isoCode: "ES-RI",
    lat: 42.4627,
    lng: -2.4449,
    blurb:
      "La Rioja (320.000 habitantes, capital Logroño) es un nodo estratégico de carpooling entre País Vasco, Aragón y Castilla y León. La región no acoge en 2026 festivales con landing propia en ConcertRide, pero es punto de origen frecuente hacia Sonorama Ribera (Aranda de Duero, 165 km, 2h), Bilbao BBK Live (140 km, 1h 30 min) y Vive Latino Zaragoza (175 km, 1h 45 min). Logroño es el principal nodo riojano y desde allí salen rutas a los principales festivales del cuadrante norte de España. El ahorro medio en emisiones de CO₂ es del 77 % por asiento compartido frente al vehículo individual.",
    festivalsInRegion: [],
    mainCities: ["Logroño", "Calahorra", "Arnedo", "Haro", "Pamplona", "Bilbao"],
    faqs: [
      {
        q: "¿Hay festivales en La Rioja en 2026?",
        a: "La Rioja no acoge en 2026 festivales de música de gran formato con landing propia en ConcertRide. La región celebra ciclos privados en la Concha del Espolón (Logroño), en la Plaza de Toros La Ribera y conciertos en bodegas dentro de la programación enoturística. Los riojanos que asisten a festivales se desplazan principalmente a Sonorama Ribera (165 km), Bilbao BBK Live (140 km), Vive Latino Zaragoza (175 km) y Pirineos Sur (210 km).",
      },
      {
        q: "¿Cómo llegar a Sonorama desde Logroño?",
        a: "Logroño–Aranda de Duero son 165 km (1h 50 min por la A-12 y la N-122). Con ConcertRide, el precio por asiento está entre 6 y 9 €. No existe tren directo Logroño–Aranda; ALSA opera autobuses con trasbordo en Miranda de Ebro o Burgos (3h–4h, 15–25 €) sin frecuencias de madrugada. El carpooling es la opción mayoritaria para los riojanos en Sonorama.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Logroño a Bilbao BBK Live?",
        a: "Logroño–Kobetamendi (Bilbao) son 140 km (1h 30 min por la AP-68). Con ConcertRide, el precio por asiento está entre 5 y 8 €. El tren Logroño–Bilbao Renfe tarda 3h con trasbordo y cuesta 18–35 €. ALSA opera Logroño–Bilbao en 1h 45 min por 11–18 € pero sin servicio para la vuelta nocturna del festival. El carpooling permite volver cuando termina el último cabeza de cartel.",
      },
      {
        q: "¿Cómo llegar a Vive Latino Zaragoza desde Logroño?",
        a: "Logroño–Espacio Expo Zaragoza son 175 km (1h 45 min por la AP-68). Con ConcertRide, el precio por asiento está entre 5 y 8 €. Es el trayecto de carpooling más demandado en La Rioja durante el primer fin de semana de septiembre por Vive Latino. ALSA opera bus directo en 2h 15 min (15–25 €) pero el último servicio sale a las 21:30.",
      },
      {
        q: "¿Hay carpooling desde Calahorra para festivales?",
        a: "Sí. Calahorra (50 km al sureste de Logroño, 24.000 habitantes) es el segundo origen riojano más frecuente en ConcertRide. Los destinos principales son Vive Latino Zaragoza (130 km, 1h 20 min, 4–7 €/asiento), Bilbao BBK Live (190 km, 2h, 6–9 €) y Sonorama Ribera (215 km, 2h 20 min, 7–10 €). Para asistentes del valle del Ebro, el carpooling es la opción dominante.",
      },
    ],
  },

  {
    slug: "murcia",
    name: "Región de Murcia",
    displayName: "Murcia",
    isoCode: "ES-MC",
    lat: 37.9922,
    lng: -1.1307,
    blurb:
      "La Región de Murcia (1,5 millones de habitantes, capital Murcia) acoge SOS 4.8 (Recinto Ferial La Fica, Murcia, mayo), uno de los festivales urbanos de indie y electrónica más reconocidos del sureste, con cartel internacional desde 2008 y un aforo de 25.000 personas/día. La región es nodo estratégico de carpooling con Valencia (240 km, 2h 15 min), Alicante (80 km, 50 min), Albacete (155 km, 1h 30 min) y Almería (220 km, 2h 15 min). El SOS 4.8 concentra el 65 % de su público en asistentes del litoral mediterráneo, donde el coche compartido es la opción dominante por la falta de transporte público nocturno hasta La Fica.",
    festivalsInRegion: ["sos-48"],
    mainCities: ["Murcia", "Cartagena", "Lorca", "Molina de Segura", "Alicante", "Albacete"],
    upcomingFestivalHighlight: "sos-48",
    faqs: [
      {
        q: "¿Qué festivales hay en la Región de Murcia en 2026?",
        a: "El principal festival de Murcia en 2026 es SOS 4.8 (Recinto Ferial La Fica, Murcia, 8–10 mayo, 25.000 personas/día, indie y electrónica internacional). Es uno de los festivales urbanos más respetados del sureste español, con cartel internacional desde 2008. Además, Cartagena acoge La Mar de Músicas (julio) y Murcia celebra ciclos privados en la Plaza de Toros durante el verano.",
      },
      {
        q: "¿Cómo llegar a SOS 4.8 desde Alicante?",
        a: "Alicante–Recinto Ferial La Fica (Murcia) son 85 km (55 min por la A-7). Con ConcertRide, el precio por asiento está entre 4 y 7 €. El tren Cercanías Renfe Alicante–Murcia tarda 1h 25 min y cuesta 9–12 €, pero la estación de Murcia del Carmen está a 4 km de La Fica (taxi adicional 7–10 €). El carpooling es puerta a puerta.",
      },
      {
        q: "¿Cómo llegar a SOS 4.8 desde Valencia?",
        a: "Valencia–Murcia son 240 km (2h 15 min por la A-7). Con ConcertRide, el precio por asiento está entre 7 y 11 €. El AVANT Renfe Valencia–Murcia tarda 2h 30 min y cuesta 30–55 €. El autobús ALSA cuesta 18–28 € (3h–3h 30 min). El carpooling es la opción más popular entre los asistentes valencianos al festival.",
      },
      {
        q: "¿Hay transporte nocturno en Murcia para festivales?",
        a: "El servicio nocturno de bus urbano de Murcia (Líneas N1, N2 búho) cubre principales arterias hasta las 3:00 AM los viernes y sábados, pero las paradas más cercanas a La Fica están a 1,5 km del recinto. El taxi del centro a La Fica cuesta 8–12 €. Para asistentes de fuera de Murcia capital, el carpooling con ConcertRide es la única opción organizada para volver al pueblo de origen tras el festival.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Cartagena a SOS 4.8?",
        a: "Cartagena–Murcia son 50 km (40 min por la A-30). Con ConcertRide, el precio por asiento está entre 3 y 6 €. Es el trayecto intra-regional más demandado del festival, junto con Lorca–Murcia (65 km, 4–7 €/asiento). El Cercanías Renfe Cartagena–Murcia opera con frecuencia diurna pero sin servicios después de las 22:30, lo que impide la vuelta nocturna.",
      },
    ],
  },

  {
    slug: "navarra",
    name: "Comunidad Foral de Navarra",
    displayName: "Navarra",
    isoCode: "ES-NC",
    lat: 42.8125,
    lng: -1.6458,
    blurb:
      "Navarra (665.000 habitantes, capital Pamplona) es uno de los principales nodos de carpooling del cuadrante noreste español. La región no acoge en 2026 festivales con landing propia en ConcertRide, pero Pamplona es origen frecuente hacia Bilbao BBK Live (155 km, 1h 30 min), Vive Latino Zaragoza (175 km, 1h 45 min), Pirineos Sur (180 km, 2h por la A-15 y A-21) y Sonorama Ribera (215 km, 2h 15 min). La AP-15 y la A-15 conectan Pamplona con Madrid (400 km, 4h) y con el corredor Bilbao–Zaragoza–Barcelona. El ahorro medio en CO₂ es del 76 % por asiento compartido en estos trayectos.",
    festivalsInRegion: [],
    mainCities: ["Pamplona", "Tudela", "Estella", "Tafalla", "Bilbao", "Zaragoza"],
    faqs: [
      {
        q: "¿Hay festivales en Navarra en 2026?",
        a: "Navarra no acoge en 2026 festivales de música de gran formato con landing propia en ConcertRide. La región celebra Flamenco On Fire en Pamplona (agosto), conciertos durante los Sanfermines (6–14 julio) y ciclos privados en el Navarra Arena. Los navarros que asisten a festivales se desplazan principalmente a Bilbao BBK Live (155 km), Vive Latino Zaragoza (175 km), Pirineos Sur (180 km) y Sonorama Ribera (215 km).",
      },
      {
        q: "¿Cómo llegar al BBK Live desde Pamplona?",
        a: "Pamplona–Kobetamendi (Bilbao) son 155 km (1h 30 min por la A-15 y la A-68). Con ConcertRide, el precio por asiento está entre 5 y 8 €. ALSA opera Pamplona–Bilbao en unas 2h por 10–16 € pero sin frecuencias para la vuelta nocturna del festival. El carpooling es la opción dominante entre los pamploneses para el BBK Live, especialmente para grupos de 3–4 personas.",
      },
      {
        q: "¿Cuánto cuesta el carpooling de Pamplona a Vive Latino?",
        a: "Pamplona–Espacio Expo Zaragoza son 175 km (1h 45 min por la AP-15 y la AP-68). Con ConcertRide, el precio por asiento está entre 5 y 8 €. Es el trayecto más demandado en Navarra durante el primer fin de semana de septiembre por Vive Latino. ALSA opera bus directo Pamplona–Zaragoza Delicias en 2h por 12–20 € pero requiere taxi adicional al Espacio Expo.",
      },
      {
        q: "¿Cómo llegar a Pirineos Sur desde Pamplona?",
        a: "Pamplona–Sallent de Gállego son 180 km (2h 10 min por la A-21 y la N-330). Con ConcertRide, el precio por asiento está entre 6 y 9 €. Es la ruta natural para acceder al Pirineo aragonés desde Navarra: no existe transporte público regular hasta Sallent de Gállego. El recorrido por la A-21 Pamplona–Jaca atraviesa paisajes pirenaicos y suele duplicar los asistentes en julio.",
      },
      {
        q: "¿Hay carpooling desde Tudela para festivales?",
        a: "Sí. Tudela (95 km al sur de Pamplona, 36.000 habitantes) es el segundo origen navarro más frecuente en ConcertRide tras la capital. Los destinos más demandados son Vive Latino Zaragoza (85 km, 50 min, 3–6 €/asiento), Bilbao BBK Live (220 km, 2h 30 min, 7–11 €) y Sonorama Ribera (165 km, 1h 50 min, 6–9 €). Para asistentes de la Ribera de Navarra, el carpooling es la opción dominante hacia Aragón.",
      },
    ],
  },
];

export const REGION_LANDINGS_BY_SLUG: Record<string, RegionLanding> = Object.fromEntries(
  REGION_LANDINGS.map((r) => [r.slug, r]),
);

export const REGION_SLUGS: string[] = REGION_LANDINGS.map((r) => r.slug);

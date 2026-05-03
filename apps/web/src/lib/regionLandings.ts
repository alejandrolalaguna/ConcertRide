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
      "La Comunidad de Madrid es el principal hub de festivales de España con más de 15 eventos anuales de primer nivel. Mad Cool (IFEMA, julio) y Tomavistas (Retiro, mayo) concentran la mayor asistencia. El acceso en transporte público pasada la medianoche es limitado, lo que convierte el carpooling en la opción más popular para asistentes de Valencia, Barcelona y Zaragoza.",
    festivalsInRegion: ["mad-cool", "tomavistas"],
    mainCities: ["Madrid", "Valencia", "Zaragoza", "Barcelona", "Sevilla", "Bilbao"],
    upcomingFestivalHighlight: "mad-cool",
    faqs: [
      {
        q: "¿Qué festivales hay en la Comunidad de Madrid en 2026?",
        a: "Los principales festivales de la Comunidad de Madrid en 2026 son Mad Cool Festival (IFEMA, 9–11 julio, 80.000 personas/día) y Tomavistas (Jardines del Buen Retiro, 15–17 mayo). Además, Madrid acoge múltiples conciertos de estadio en el Estadio Metropolitano y el WiZink Center. Mad Cool es el festival de rock e indie alternativo más grande de Madrid y uno de los de mayor afluencia internacional de España.",
      },
      {
        q: "¿Cómo llegar a los festivales de Madrid desde Valencia?",
        a: "La distancia Valencia–Madrid es de 355 km (3h 20 min por la A-3 o el AVE en 1h 30 min). Para Mad Cool (IFEMA) o Tomavistas (Retiro), el carpooling con ConcertRide cuesta entre 10 y 14 €/asiento. El AVE Valencia–Madrid Atocha cuesta entre 25 y 70 € según antelación, pero requiere transporte adicional desde Atocha hasta IFEMA (metro Línea 8, 25 min) o Retiro (metro Línea 2, 5 min).",
      },
      {
        q: "¿Cómo llegar a los festivales de Madrid desde Barcelona?",
        a: "Barcelona–Madrid son 620 km (5h 30 min en coche o 2h 30 min en AVE). El AVE cuesta entre 50 y 100 €; con ConcertRide el precio por asiento está entre 15 y 20 €. Para IFEMA desde Atocha conviene el metro Línea 8 hasta 'Feria de Madrid' (unos 25 min). El carpooling es especialmente popular para asistentes que quieren ir y volver del festival sin las restricciones horarias del tren.",
      },
      {
        q: "¿Cuánto cuesta el carpooling a Mad Cool desde Zaragoza?",
        a: "El trayecto Zaragoza–Madrid (IFEMA) son 325 km (3h por la A-2). Con ConcertRide, el precio por asiento oscila entre 9 y 13 €. Es el trayecto más frecuente de carpooling a Mad Cool después de Madrid–Madrid (desplazamiento urbano). El carpooling sale de la estación de Delicias o de la zona de la Gran Vía de Zaragoza.",
      },
      {
        q: "¿Hay transporte de madrugada de vuelta de Mad Cool?",
        a: "El metro de Madrid cierra sobre la 1:30 (se amplía hasta las 2:00–2:30 en noches de Mad Cool). Los autobuses nocturnos N1 y N6 no paran en IFEMA directamente. Los taxis y VTC aplican precio x2–x3 de madrugada (60–90 €). El carpooling con ConcertRide es la única alternativa organizada para quienes vienen de otra provincia y necesitan volver cuando termine el último artista.",
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
];

export const REGION_LANDINGS_BY_SLUG: Record<string, RegionLanding> = Object.fromEntries(
  REGION_LANDINGS.map((r) => [r.slug, r]),
);

export const REGION_SLUGS: string[] = REGION_LANDINGS.map((r) => r.slug);

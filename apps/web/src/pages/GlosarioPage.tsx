import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * Glosario de carpooling, festivales, transporte, sostenibilidad y AI.
 * SSR-safe: no window/document usage.
 *
 * 100+ términos definidos. Cada entrada emite un DefinedTerm en el
 * DefinedTermSet JSON-LD para que sea extraíble por AI Overviews,
 * ChatGPT y Perplexity como fuente de definiciones.
 */

type GlosCategory =
  | "carpooling"
  | "festival"
  | "transporte"
  | "legal"
  | "sostenibilidad"
  | "geo";

interface GlosEntry {
  term: string;
  slug: string;
  definition: string;
  category: GlosCategory;
  synonyms?: string[];
  related?: string[]; // slugs of related terms
}

const GLOSARIO: GlosEntry[] = [
  // ════════════════════════════════════════════════════════════════════════════
  // CARPOOLING
  // ════════════════════════════════════════════════════════════════════════════
  {
    term: "Carpooling",
    slug: "carpooling",
    category: "carpooling",
    synonyms: ["Ride-sharing", "Viaje compartido", "Coche compartido"],
    related: ["ride-sharing", "car-sharing", "cost-sharing", "sentencia-supremo-2017"],
    definition:
      "Modalidad de transporte compartido en la que un conductor lleva a uno o varios pasajeros en su propio vehículo y reparte los gastos del trayecto (combustible, peajes) entre los ocupantes. El objetivo es reducir costes, emisiones de CO₂ y el número de vehículos en circulación. En España el Tribunal Supremo lo reconoció como legal en 2017 siempre que no haya lucro para el conductor.",
  },
  {
    term: "Ride-sharing",
    slug: "ride-sharing",
    category: "carpooling",
    synonyms: ["Carpooling"],
    related: ["carpooling", "car-sharing"],
    definition:
      "Término anglosajón equivalente al carpooling: compartir un viaje en coche entre varias personas que van en la misma dirección. A diferencia del car-sharing, en el ride-sharing el conductor lleva a pasajeros a un destino concreto y no alquila el vehículo. Se usa especialmente en contextos de festivales y conciertos cuando el destino es un evento específico.",
  },
  {
    term: "Car-sharing",
    slug: "car-sharing",
    category: "carpooling",
    related: ["carpooling", "ride-sharing"],
    definition:
      "Alquiler de vehículo por horas o días a través de una plataforma. El usuario toma un coche sin conductor y lo devuelve después. Es diferente del carpooling o ride-sharing, en el que el coche lo conduce el propietario y los pasajeros acompañan y comparten gastos sin alquilar el vehículo.",
  },
  {
    term: "Cost-sharing",
    slug: "cost-sharing",
    category: "carpooling",
    synonyms: ["Compartir gastos"],
    related: ["sentencia-supremo-2017", "tarifa-miteco", "comision-de-plataforma"],
    definition:
      "Modelo legal de carpooling en el que el conductor comparte los gastos del viaje con los pasajeros sin obtener beneficio económico. El conductor cobra únicamente lo necesario para cubrir combustible, peajes y desgaste del vehículo (calculado a partir de la tarifa MITECO). Este modelo fue declarado legal en España por el Tribunal Supremo en 2017 y es el que aplica ConcertRide.",
  },
  {
    term: "Conductor verificado",
    slug: "conductor-verificado",
    category: "carpooling",
    related: ["dni", "carnet-de-conducir", "seguro-a-terceros"],
    definition:
      "Conductor que ha acreditado su carnet de conducir vigente en la plataforma de carpooling antes de publicar un viaje. En ConcertRide todos los conductores pasan por este proceso. La verificación garantiza que el conductor tiene licencia válida y reduce el riesgo para los pasajeros. El carnet se valida mediante foto del documento oficial.",
  },
  {
    term: "Pasajero",
    slug: "pasajero",
    category: "carpooling",
    related: ["conductor-verificado", "asiento", "plaza", "punto-de-encuentro"],
    definition:
      "Persona que reserva una plaza en el coche de otro usuario para compartir el trayecto a un festival o concierto. El pasajero paga su parte proporcional de los gastos al conductor (en efectivo o Bizum el día del viaje en ConcertRide) y se compromete a estar puntual en el punto de encuentro acordado.",
  },
  {
    term: "Conductor",
    slug: "conductor",
    category: "carpooling",
    related: ["conductor-verificado", "ruta", "asiento", "carnet-de-conducir"],
    definition:
      "Persona que publica un viaje en su propio coche y ofrece plazas a otros usuarios que van al mismo festival o concierto. Fija el precio por asiento (cubriendo solo combustible y peajes), el horario de salida y el punto de encuentro. En ConcertRide cobra al 100% sin comisión de plataforma.",
  },
  {
    term: "Plaza",
    slug: "plaza",
    category: "carpooling",
    synonyms: ["Asiento"],
    related: ["asiento", "pasajero"],
    definition:
      "Cada uno de los asientos disponibles para pasajeros en un coche compartido. El conductor indica cuántas plazas ofrece al publicar el viaje (generalmente 1–4). Cuando todas las plazas están ocupadas, el viaje aparece como completo. En ConcertRide se puede reservar una o varias plazas para grupos de amigos.",
  },
  {
    term: "Asiento",
    slug: "asiento",
    category: "carpooling",
    synonyms: ["Plaza"],
    related: ["plaza", "coste-de-combustible", "comision-de-plataforma"],
    definition:
      "Sinónimo de plaza en el contexto del carpooling. El precio del carpooling se expresa por asiento (por ejemplo, 9–13 €/asiento), siendo el coste proporcional que cada pasajero aporta al conductor para cubrir combustible y peajes del trayecto. El conductor fija el precio por asiento antes de publicar el viaje.",
  },
  {
    term: "Ruta",
    slug: "ruta",
    category: "carpooling",
    related: ["punto-de-encuentro", "conductor", "kilometros-compartidos"],
    definition:
      "Trayecto definido entre una ciudad de origen y un festival o recinto de destino. Una ruta en ConcertRide combina origen, destino, fecha y precio orientativo por asiento. Cada festival cuenta con rutas desde las principales capitales emisoras (Madrid, Barcelona, Valencia, Sevilla, Bilbao, Zaragoza) en función de la demanda.",
  },
  {
    term: "Punto de encuentro",
    slug: "punto-de-encuentro",
    category: "carpooling",
    related: ["ruta", "conductor", "pasajero"],
    definition:
      "Lugar acordado entre el conductor y los pasajeros para la recogida antes del viaje. Puede ser una estación de metro, un parking, una plaza conocida o una dirección concreta. El conductor propone el punto al publicar el viaje o lo acuerda por chat privado. En ConcertRide, el punto de encuentro se confirma el día anterior al viaje.",
  },
  {
    term: "Gastos compartidos",
    slug: "gastos-compartidos",
    category: "carpooling",
    related: ["cost-sharing", "coste-de-combustible", "tarifa-miteco"],
    definition:
      "Suma de combustible, peajes y desgaste del vehículo que se reparte entre todos los ocupantes (conductor incluido) en un viaje de carpooling. La división habitual divide el total entre el número de personas en el coche. ConcertRide aplica este reparto al precio por asiento, sin añadir margen de beneficio.",
  },
  {
    term: "Coste de combustible",
    slug: "coste-de-combustible",
    category: "carpooling",
    related: ["gastos-compartidos", "tarifa-miteco", "consumo"],
    definition:
      "Importe del combustible consumido en el trayecto, calculado a partir del precio medio de gasolina o gasóleo y el consumo del vehículo (habitualmente 6–7 litros/100 km). El precio del asiento en ConcertRide cubre exclusivamente los gastos de combustible y peajes divididos entre los ocupantes, sin ningún margen de beneficio para el conductor.",
  },
  {
    term: "Comisión de plataforma",
    slug: "comision-de-plataforma",
    category: "carpooling",
    related: ["cost-sharing", "plataforma-festival-specific"],
    definition:
      "Porcentaje que cobra una plataforma digital sobre el precio del viaje de carpooling como tarifa por el servicio. Las plataformas generalistas de carpooling cobran entre un 12 y un 18 % del precio del trayecto como comisión. ConcertRide cobra un 0 % de comisión: el importe íntegro va al conductor y el pago se hace en efectivo o Bizum el día del viaje.",
  },
  {
    term: "Vuelta de madrugada",
    slug: "vuelta-de-madrugada",
    category: "carpooling",
    related: ["lanzadera", "afterparty", "ruta"],
    definition:
      "Viaje de regreso coordinado al terminar un concierto o festival, habitualmente entre las 2:00 y las 6:00 de la madrugada. Los festivales acaban cuando el transporte público ya no funciona. El carpooling con ConcertRide resuelve este problema: el conductor y los pasajeros acuerdan antes del viaje la hora de salida de vuelta, adaptándola a la hora real de finalización del último bolo.",
  },
  {
    term: "Plataforma festival-specific",
    slug: "plataforma-festival-specific",
    category: "carpooling",
    related: ["plataforma-carpooling-generalista", "comision-de-plataforma"],
    definition:
      "Plataforma de carpooling especializada exclusivamente en conciertos y festivales, con búsqueda por festival, fecha y recinto. Al contrario que las plataformas generalistas (que incluyen rutas de largo recorrido sin vinculación a eventos), una plataforma festival-specific como ConcertRide adapta los horarios, los puntos de encuentro y la vuelta a los tiempos reales del concierto. Esto permite organizar la vuelta de madrugada de forma coordinada.",
  },
  {
    term: "Plataforma de carpooling generalista",
    slug: "plataforma-carpooling-generalista",
    category: "carpooling",
    related: ["plataforma-festival-specific", "comision-de-plataforma"],
    definition:
      "Plataforma de carpooling que conecta conductores y pasajeros para cualquier tipo de trayecto, no solo festivales. Ofrecen rutas de larga distancia, pero no están optimizadas para el contexto festival (vuelta de madrugada, equipaje de camping, horarios variables). Cobran comisiones de entre el 12 y el 18 % sobre el precio del trayecto.",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // FESTIVAL
  // ════════════════════════════════════════════════════════════════════════════
  {
    term: "Festival de música",
    slug: "festival-de-musica",
    category: "festival",
    related: ["recinto", "aforo", "line-up", "acampada"],
    definition:
      "Evento de varios días de duración en el que actúan múltiples artistas en uno o varios escenarios, habitualmente al aire libre. Los festivales de música en España congregan entre 10.000 y 80.000 asistentes al día. Los más conocidos son Mad Cool (Madrid), Primavera Sound (Barcelona), Arenal Sound (Burriana) y BBK Live (Bilbao). La logística de transporte es especialmente importante porque la mayoría se celebran en recintos alejados de los centros urbanos.",
  },
  {
    term: "Festival multitudinario",
    slug: "festival-multitudinario",
    category: "festival",
    related: ["aforo", "recinto"],
    definition:
      "Festival con una asistencia diaria superior a las 40.000 personas. En España, los festivales multitudinarios son Mad Cool (80.000/día), Medusa (60.000/día), Primavera Sound (60.000/día), Arenal Sound (50.000–60.000/día) y FIB (45.000/día). Estos eventos requieren una planificación especial del transporte de acceso y de vuelta.",
  },
  {
    term: "Recinto",
    slug: "recinto",
    category: "festival",
    synonyms: ["Venue", "Espacio"],
    related: ["aforo", "escenarios", "festival-de-musica"],
    definition:
      "Espacio físico donde se celebra el festival o el concierto. Puede ser un estadio, un parque, una feria de exposiciones, una playa, un monte o un espacio habilitado especialmente para el evento. En ConcertRide cada festival tiene su propio recinto documentado con dirección exacta, coordenadas GPS y opciones de acceso.",
  },
  {
    term: "Aforo",
    slug: "aforo",
    category: "festival",
    related: ["recinto", "festival-multitudinario"],
    definition:
      "Número máximo de personas que pueden estar simultáneamente en el recinto de un festival o concierto. El aforo lo establece la licencia municipal del evento y puede variar de un día para otro. Cuando el festival alcanza el aforo, se cierra el acceso temporal. En ConcertRide se indica el aforo de los festivales principales para contexto.",
  },
  {
    term: "Line-up",
    slug: "line-up",
    category: "festival",
    synonyms: ["Cartel"],
    related: ["cartel", "headliner", "cabeza-de-cartel", "secundario"],
    definition:
      "Lista completa de artistas confirmados para actuar en un festival. El line-up se publica generalmente en fases: primero los cabezas de cartel (headliners), luego los artistas de segundo y tercer nivel. La publicación del line-up activa la compra anticipada de entradas y la organización de carpooling en ConcertRide, ya que los fans conocen con antelación a qué festival quieren ir.",
  },
  {
    term: "Cartel",
    slug: "cartel",
    category: "festival",
    synonyms: ["Line-up"],
    related: ["line-up", "cabeza-de-cartel"],
    definition:
      "Sinónimo de line-up en el contexto de los festivales españoles. Hace referencia al conjunto de artistas que actuarán en el festival. Se habla de 'cartel potente' cuando incluye artistas de primera línea internacional, y de 'cartel renovado' cuando el festival incorpora artistas nuevos o menos conocidos junto a los nombres habituales.",
  },
  {
    term: "Headliner",
    slug: "headliner",
    category: "festival",
    synonyms: ["Cabeza de cartel"],
    related: ["cabeza-de-cartel", "secundario", "line-up", "cacheado"],
    definition:
      "Artista principal de un festival, que actúa en el escenario más grande y en el horario de máxima audiencia (habitualmente entre las 22:00 y las 2:00). Los headliners son los artistas de mayor caché del cartel y los que más influyen en las ventas de entradas. La actuación del headliner determina la hora de salida de vuelta en el carpooling.",
  },
  {
    term: "Cabeza de cartel",
    slug: "cabeza-de-cartel",
    category: "festival",
    synonyms: ["Headliner"],
    related: ["headliner", "line-up", "secundario"],
    definition:
      "Término en español equivalente a headliner. Hace referencia al artista (o grupo de artistas) que ocupa el lugar más destacado en el cartel del festival, generalmente con el nombre en mayor tamaño tipográfico y cerrando la jornada en el escenario principal. Su confirmación suele anunciarse en la primera fase del line-up.",
  },
  {
    term: "Secundario",
    slug: "secundario",
    category: "festival",
    synonyms: ["Subheadliner"],
    related: ["headliner", "cabeza-de-cartel", "escenarios"],
    definition:
      "Artista que actúa en una posición intermedia del cartel, justo antes o después del headliner, en el escenario principal o en uno de los grandes. Los secundarios son fundamentales para mantener el ritmo del festival y muchas veces atraen a tanto público como los cabezas de cartel.",
  },
  {
    term: "Escenarios",
    slug: "escenarios",
    category: "festival",
    related: ["recinto", "line-up"],
    definition:
      "Plataformas donde actúan los artistas dentro del recinto del festival. Los festivales grandes tienen entre 4 y 8 escenarios simultáneos (Mad Cool: 4, Primavera Sound: 9, FIB: 5), cada uno con un perfil musical distinto. El programa indica en qué escenario y a qué hora actúa cada artista para que el público pueda organizarse.",
  },
  {
    term: "Acampada",
    slug: "acampada",
    category: "festival",
    synonyms: ["Camping festival"],
    related: ["glamping", "abono", "festival-de-musica"],
    definition:
      "Zona habilitada dentro o próxima al recinto del festival para que los asistentes monten sus tiendas y pernocten durante todos los días del evento. Los festivales con acampada (Viña Rock, Medusa, Arenal Sound, FIB) permiten a los asistentes de otras ciudades alojarse sin coste de hotel. El carpooling con ConcertRide es especialmente útil para llegar con todo el equipo de camping directamente al recinto.",
  },
  {
    term: "Glamping",
    slug: "glamping",
    category: "festival",
    related: ["acampada", "vip"],
    definition:
      "Modalidad de acampada de lujo en un festival, con tiendas pre-montadas, colchones, cargadores USB y a veces duchas privadas. Es una alternativa al camping tradicional para quienes quieren comodidad sin contratar hotel. Festivales como Starlite o Cala Mijas ofrecen paquetes de glamping. El transporte de ida suele incluirse en el pack o se combina con carpooling.",
  },
  {
    term: "Abono",
    slug: "abono",
    category: "festival",
    synonyms: ["Pase multijornada", "Full pass"],
    related: ["bono-diario", "preventa", "wristband"],
    definition:
      "Entrada que da acceso a todos los días de un festival. También llamado 'pase multijornada' o 'full pass'. El abono suele ser más económico que comprar entradas diarias por separado. Para los asistentes que utilizan ConcertRide, el abono facilita organizar el transporte de varios días con el mismo conductor.",
  },
  {
    term: "Bono diario",
    slug: "bono-diario",
    category: "festival",
    related: ["abono", "preventa"],
    definition:
      "Entrada de un solo día para un festival multijornada. Permite asistir a un día concreto del cartel sin pagar el abono completo. Se vende cuando se confirma el programa diario, ya que cada jornada tiene un cartel propio. El precio del bono diario suele ser entre el 40 % y el 60 % del precio total del abono.",
  },
  {
    term: "VIP",
    slug: "vip",
    category: "festival",
    related: ["backstage", "glamping", "abono"],
    definition:
      "Paquete o entrada premium que incluye accesos exclusivos en un festival: zonas elevadas con visión sin obstáculos, barras dedicadas, baños privados, parking propio o catering. En España el VIP de un festival suele costar entre 200 y 600 €/día. No incluye habitualmente acceso al backstage (zona de artistas).",
  },
  {
    term: "Backstage",
    slug: "backstage",
    category: "festival",
    related: ["vip", "booking"],
    definition:
      "Zona privada del recinto situada detrás del escenario donde acceden los artistas, su equipo técnico, los promotores y la prensa acreditada. No es accesible para el público general ni siquiera con entrada VIP. En el backstage se prepara cada actuación, se realizan las pruebas de sonido y los meet-and-greet con fans.",
  },
  {
    term: "Afterparty",
    slug: "afterparty",
    category: "festival",
    related: ["vuelta-de-madrugada", "wristband"],
    definition:
      "Fiesta organizada después de un concierto o de la jornada de un festival, habitualmente en una discoteca, sala de música o espacio habilitado ad hoc. Las afterparties de los festivales grandes suelen terminar entre las 6:00 y las 8:00 de la mañana. En ConcertRide se pueden coordinar viajes de vuelta desde la afterparty, aunque los horarios extremos limitan las opciones de carpooling.",
  },
  {
    term: "Preventa",
    slug: "preventa",
    category: "festival",
    related: ["abono", "bono-diario", "reventa"],
    definition:
      "Venta anticipada de entradas para un festival o concierto antes de que comience la venta general. Las preventas suelen ofrecer precios inferiores a los de la venta normal y se agotan en pocas horas para los festivales más populares. Es habitual que los fans que compran en preventa también empiecen a buscar carpooling con ConcertRide en ese mismo momento para organizar el transporte.",
  },
  {
    term: "Reventa",
    slug: "reventa",
    category: "festival",
    related: ["preventa", "abono"],
    definition:
      "Venta de entradas ya adquiridas a un precio superior al original, habitualmente cuando el evento está agotado. En España la reventa especulativa de entradas está regulada y en algunos casos prohibida. Plataformas oficiales ofrecen reventa con precios controlados. ConcertRide gestiona el transporte, no las entradas: si compras en reventa, nosotros te llevamos.",
  },
  {
    term: "Wristband",
    slug: "wristband",
    category: "festival",
    synonyms: ["Pulsera de identificación"],
    related: ["cashless", "abono"],
    definition:
      "Pulsera de control de acceso que se entrega a los asistentes al festival. Sustituye a la entrada de papel y permite entrar y salir del recinto durante todos los días del festival. Suele tener chip RFID que registra los accesos y en festivales cashless también actúa como método de pago. Se coloca en el primer acceso y no se puede retirar hasta el final del festival.",
  },
  {
    term: "Cashless",
    slug: "cashless",
    category: "festival",
    related: ["wristband", "ferias-gastro"],
    definition:
      "Sistema de pago sin efectivo en el interior del recinto de un festival. Los asistentes cargan dinero en el chip de la pulsera (wristband) y pagan barras y tiendas con solo acercar la muñeca al lector. El efectivo queda fuera del circuito interior del festival, aunque en ConcertRide el pago del asiento al conductor se realiza siempre en efectivo o Bizum el día del viaje.",
  },
  {
    term: "Booking",
    slug: "booking",
    category: "festival",
    related: ["cacheado", "line-up", "promotora"],
    definition:
      "Contratación de artistas para actuar en un festival. El proceso de booking lo llevan a cabo los promotores y managers de los festivales, que negocian con las agencias representantes de los artistas el caché (precio de actuación), el rider técnico (requisitos de sonido y escenario) y las fechas. El éxito del booking determina la calidad del line-up y, en parte, el volumen de asistentes.",
  },
  {
    term: "Promotora",
    slug: "promotora",
    category: "festival",
    related: ["booking", "recinto"],
    definition:
      "Empresa que organiza conciertos y festivales: contrata artistas, gestiona el recinto, vende entradas y coordina todos los aspectos logísticos del evento. En España las principales promotoras son Live Nation, Last Tour, FIB Events, Primavera Sound Organization y Doctor Music. Son las responsables de la habilitación de accesos y transporte público oficial al festival.",
  },
  {
    term: "Cacheado",
    slug: "cacheado",
    category: "festival",
    related: ["booking", "headliner"],
    definition:
      "Término coloquial español para referirse al caché de un artista: el precio que cobra por actuar. Un artista 'muy cacheado' cobra mucho. En el contexto de los festivales, el caché de los headliners internacionales puede superar el millón de euros por actuación, lo que determina el precio de las entradas y el presupuesto general del festival.",
  },
  {
    term: "Ferias gastro",
    slug: "ferias-gastro",
    category: "festival",
    synonyms: ["Foodtrucks", "Zona gastro"],
    related: ["cashless", "recinto"],
    definition:
      "Zona del recinto del festival con puestos de comida (foodtrucks, barras temáticas, restaurantes pop-up) donde los asistentes pueden comer y beber durante la jornada. El precio medio de un plato en una feria gastro de festival oscila entre 9 y 15 €. El pago se hace habitualmente con cashless.",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // TRANSPORTE
  // ════════════════════════════════════════════════════════════════════════════
  {
    term: "Lanzadera",
    slug: "lanzadera",
    category: "transporte",
    synonyms: ["Bus lanzadera", "Shuttle"],
    related: ["bus-oficial", "vuelta-de-madrugada", "carpooling"],
    definition:
      "Autobús o minibús habilitado por el festival o por operadores privados para trasladar a los asistentes desde una ciudad o estación próxima hasta el recinto del festival. Las lanzaderas tienen horarios fijos y plazas limitadas. Festivales como BBK Live ofrecen lanzadera gratuita desde el centro de Bilbao; otros como el FIB la ofrecen desde Castellón de pago. Para quienes vienen de ciudades más lejanas, el carpooling es la alternativa.",
  },
  {
    term: "Bus oficial",
    slug: "bus-oficial",
    category: "transporte",
    related: ["lanzadera", "alsa", "avanza"],
    definition:
      "Autobús contratado por la organización del festival que conecta una o varias ciudades emisoras con el recinto, generalmente con varios servicios al día durante el evento. El bus oficial suele venderse en paquete con la entrada o por separado en la web del festival. Tiene horario fijo y no flexibilidad para la vuelta nocturna, a diferencia del carpooling.",
  },
  {
    term: "Tren AVE",
    slug: "tren-ave",
    category: "transporte",
    related: ["renfe", "cercanias", "lanzadera"],
    definition:
      "Servicio de alta velocidad de Renfe que conecta las principales ciudades españolas a más de 250 km/h. Para llegar a festivales como Mad Cool (desde Barcelona/Sevilla/Valencia) o BBK Live (desde Madrid), el AVE es la opción de transporte público más rápida, aunque también la más cara (40–110 €/trayecto). El AVE no opera de madrugada, por lo que la vuelta requiere alojamiento u otra solución.",
  },
  {
    term: "Cercanías",
    slug: "cercanias",
    category: "transporte",
    synonyms: ["Rodalies"],
    related: ["renfe", "metro", "tren-ave"],
    definition:
      "Red de trenes de proximidad operada por Renfe (Rodalies en Cataluña) que conecta las grandes ciudades con sus áreas metropolitanas. Útil para acceder a festivales urbanos como Primavera Sound (Cercanías Forum) o Mad Cool (Cercanías Valdebebas). Los precios son bajos (1,80–3,40 € por trayecto) pero el servicio suele finalizar entre las 23:00 y la 1:00, por lo que no cubre la vuelta de madrugada.",
  },
  {
    term: "Renfe",
    slug: "renfe",
    category: "transporte",
    related: ["tren-ave", "cercanias"],
    definition:
      "Operador público ferroviario de España. Gestiona los servicios de alta velocidad (AVE), larga distancia (Alvia, Intercity), media distancia y cercanías. Es la opción habitual de transporte público intercity para llegar a festivales. Las tarifas Promo+ con compra anticipada permiten ahorrar hasta un 70 % sobre el precio normal.",
  },
  {
    term: "ALSA",
    slug: "alsa",
    category: "transporte",
    related: ["avanza", "bus-oficial", "pesa"],
    definition:
      "Principal operador privado de autobús interurbano en España, con cobertura nacional. ALSA opera líneas regulares entre la mayoría de ciudades españolas y suele ofrecer servicios especiales (refuerzos, horarios ampliados) durante los festivales más grandes. Los billetes ALSA cuestan habitualmente entre un 30 y un 50 % menos que el tren AVE.",
  },
  {
    term: "Avanza",
    slug: "avanza",
    category: "transporte",
    related: ["alsa", "bus-oficial"],
    definition:
      "Operador privado español de autobús interurbano (Grupo Avanza). Opera principalmente en los corredores Madrid-Aragón, Madrid-Valladolid, Madrid-Cuenca y Galicia. Como ALSA, refuerza servicios durante festivales grandes en su zona de cobertura.",
  },
  {
    term: "Pesa",
    slug: "pesa",
    category: "transporte",
    related: ["alsa", "bus-oficial"],
    definition:
      "Operador de autobús privado del País Vasco. Cubre líneas entre Bilbao, San Sebastián, Vitoria y conexiones con otras provincias del norte. Es operador habitual de los servicios extra durante BBK Live (Bilbao) y Bilbao BBK Music Legends.",
  },
  {
    term: "Metro",
    slug: "metro",
    category: "transporte",
    related: ["cercanias", "nitbus"],
    definition:
      "Red de transporte subterráneo de las grandes ciudades españolas. Es la forma habitual de llegar a los recintos urbanos: Metro de Madrid (línea 4 hasta Mar de Cristal para Mad Cool), TMB Barcelona (L4 hasta Maresme para Primavera Sound). El servicio normal cierra entre las 1:30 y las 2:00, por lo que no cubre la vuelta de madrugada de los festivales.",
  },
  {
    term: "Nitbus",
    slug: "nitbus",
    category: "transporte",
    synonyms: ["Búho", "Bus nocturno"],
    related: ["metro", "vuelta-de-madrugada"],
    definition:
      "Servicio nocturno de autobús urbano en las grandes ciudades (Nitbus en Barcelona, Búho en Madrid). Cubre la franja horaria en la que el metro y los trenes de cercanías no operan (aproximadamente 1:30–6:00). Tiene frecuencia más baja que el servicio diurno (cada 30–60 minutos) y solo cubre los recintos urbanos próximos al centro.",
  },
  {
    term: "Taxi nocturno",
    slug: "taxi-nocturno",
    category: "transporte",
    related: ["vuelta-de-madrugada", "carpooling"],
    definition:
      "Servicio de taxi que opera de madrugada con tarifa nocturna recargada (entre un 20 y un 35 % superior a la diurna en España). Para la vuelta de un festival al centro de una ciudad cercana, un taxi nocturno cuesta habitualmente entre 25 y 70 €. Es la alternativa más cara al carpooling, pero la única disponible sin reserva previa cuando los demás transportes ya no operan.",
  },
  {
    term: "VTC",
    slug: "vtc",
    category: "transporte",
    related: ["taxi-nocturno", "carpooling"],
    definition:
      "Vehículo de Transporte con Conductor (Uber, Cabify, Bolt). En España requiere licencia VTC y opera con tarifa dinámica: durante la finalización de un festival multitudinario el precio puede multiplicarse por 3 o 4 sobre la tarifa base por la alta demanda simultánea de miles de asistentes. El carpooling con ConcertRide es estable en precio (sin tarifa dinámica).",
  },
  {
    term: "Parking",
    slug: "parking",
    category: "transporte",
    related: ["recinto", "ruta"],
    definition:
      "Zona de aparcamiento del recinto o sus inmediaciones. Los festivales grandes ofrecen parking propio (gratuito o de pago, 8–25 €/día) con capacidad limitada que se agota durante las primeras horas del primer día. Los conductores que llegan en carpooling con ConcertRide suelen reservar el parking del festival con antelación.",
  },
  {
    term: "Peaje",
    slug: "peaje",
    category: "transporte",
    related: ["gastos-compartidos", "coste-de-combustible"],
    definition:
      "Cuota que paga el conductor por circular por una autopista de pago en España. Forma parte de los gastos compartidos legítimos en el carpooling y se reparte entre todos los ocupantes del coche. Las rutas habituales con peaje hacia festivales son AP-7 (litoral mediterráneo) y AP-6/AP-51 (Madrid hacia el norte de Castilla).",
  },
  {
    term: "Consumo",
    slug: "consumo",
    category: "transporte",
    related: ["coste-de-combustible", "tarifa-miteco"],
    definition:
      "Cantidad de combustible que un vehículo gasta por cada 100 km recorridos, expresada en litros (gasolina/gasóleo) o kWh (eléctrico). Un coche medio en España consume entre 6 y 7 l/100 km en ruta. El conductor que publica un viaje en ConcertRide calcula el precio por asiento a partir de este consumo y del precio actual del combustible.",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // LEGAL / SEGURIDAD
  // ════════════════════════════════════════════════════════════════════════════
  {
    term: "Sentencia del Tribunal Supremo 2017",
    slug: "sentencia-supremo-2017",
    category: "legal",
    related: ["cost-sharing", "carpooling", "tarifa-miteco"],
    definition:
      "Resolución del Tribunal Supremo de España (noviembre 2017) que ratificó la legalidad del carpooling en régimen de cost-sharing entre particulares, siempre que el conductor no obtenga beneficio económico más allá de compartir los gastos del viaje (combustible, peajes, desgaste). Es el fundamento jurídico del modelo de carpooling no comercial en España.",
  },
  {
    term: "Tarifa MITECO",
    slug: "tarifa-miteco",
    category: "legal",
    related: ["cost-sharing", "coste-de-combustible", "sentencia-supremo-2017"],
    definition:
      "Tarifa de referencia publicada anualmente por el Ministerio para la Transición Ecológica y el Reto Demográfico (MITECO) que establece el coste kilométrico estándar para el cálculo de gastos de combustible y peajes en desplazamientos. Los conductores de carpooling en ConcertRide la utilizan como referencia para fijar el precio del asiento de forma legal.",
  },
  {
    term: "ITV",
    slug: "itv",
    category: "legal",
    synonyms: ["Inspección Técnica de Vehículos"],
    related: ["seguro-a-terceros", "carnet-de-conducir"],
    definition:
      "Inspección Técnica de Vehículos: revisión periódica obligatoria en España que certifica que un coche cumple los requisitos de seguridad y emisiones para circular. Los coches nuevos pasan la primera ITV a los 4 años; después, cada 2 años hasta los 10, y cada año a partir de los 10. Conducir sin ITV vigente está sancionado y puede invalidar la cobertura del seguro en caso de accidente.",
  },
  {
    term: "Seguro a terceros",
    slug: "seguro-a-terceros",
    category: "legal",
    synonyms: ["Seguro obligatorio"],
    related: ["itv", "conductor-verificado"],
    definition:
      "Seguro de automóvil obligatorio en España que cubre los daños causados a otras personas y vehículos por el conductor asegurado. Es el mínimo legal exigido para circular y cubre por defecto a todos los ocupantes del vehículo en caso de accidente. ConcertRide recomienda a sus conductores tener el seguro al día y, opcionalmente, cobertura ampliada.",
  },
  {
    term: "Carnet de conducir",
    slug: "carnet-de-conducir",
    category: "legal",
    synonyms: ["Permiso B"],
    related: ["conductor-verificado", "itv"],
    definition:
      "Documento oficial expedido por la Dirección General de Tráfico (DGT) que acredita la aptitud de una persona para conducir un vehículo. El permiso B es el habitual para turismos en España y se obtiene a partir de los 18 años. La validez del carnet se verifica al alta del conductor en ConcertRide.",
  },
  {
    term: "DNI",
    slug: "dni",
    category: "legal",
    synonyms: ["Documento Nacional de Identidad"],
    related: ["conductor-verificado", "carnet-de-conducir"],
    definition:
      "Documento oficial de identificación personal en España. Se exige en la entrada de la mayoría de festivales para verificar que la entrada corresponde al titular o para el control de acceso en general. En ConcertRide, el DNI del conductor se verifica como parte del proceso de validación del carnet de conducir. Los pasajeros no necesitan compartir su DNI con la plataforma.",
  },
  {
    term: "Consentimiento",
    slug: "consentimiento",
    category: "legal",
    related: ["dni", "rgpd"],
    definition:
      "Manifestación libre, específica e informada por la que una persona acepta el tratamiento de sus datos personales. Es la base legal habitual para tratar datos en plataformas digitales. En ConcertRide el usuario otorga consentimiento explícito al crear la cuenta y puede revocarlo en cualquier momento solicitando la eliminación de su perfil.",
  },
  {
    term: "RGPD",
    slug: "rgpd",
    category: "legal",
    synonyms: ["Reglamento General de Protección de Datos", "GDPR"],
    related: ["consentimiento", "dni"],
    definition:
      "Reglamento General de Protección de Datos (Reglamento UE 2016/679), normativa europea sobre el tratamiento de datos personales en vigor desde mayo de 2018. Otorga al usuario derechos de acceso, rectificación, supresión, oposición y portabilidad sobre sus datos. ConcertRide cumple el RGPD: los datos solo se usan para operar el servicio.",
  },
  {
    term: "Reembolso",
    slug: "reembolso",
    category: "legal",
    related: ["derecho-de-desistimiento", "comision-de-plataforma"],
    definition:
      "Devolución del importe pagado por un servicio que no se ha prestado o se ha cancelado. En carpooling, las reglas de reembolso varían: ConcertRide no procesa pagos (el pasajero paga al conductor en efectivo o Bizum el día del viaje), por lo que si el viaje se cancela antes de salir no hay importe a devolver. Si el conductor cancela, los pasajeros buscan otro viaje sin penalización.",
  },
  {
    term: "Derecho de desistimiento",
    slug: "derecho-de-desistimiento",
    category: "legal",
    related: ["reembolso", "rgpd"],
    definition:
      "Derecho del consumidor en España y la UE a cancelar un contrato a distancia (online) dentro de los 14 días siguientes sin necesidad de justificación y recuperar el importe pagado. Aplica a la mayoría de servicios online, aunque el transporte de pasajeros tiene reglas específicas. ConcertRide no exige pago anticipado al pasajero, por lo que esta cuestión es operativamente sencilla.",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // SOSTENIBILIDAD
  // ════════════════════════════════════════════════════════════════════════════
  {
    term: "Huella de carbono",
    slug: "huella-de-carbono",
    category: "sostenibilidad",
    synonyms: ["Carbon footprint"],
    related: ["co2-ahorrado", "kg-co2", "idae"],
    definition:
      "Cantidad total de gases de efecto invernadero (medidos en CO₂ equivalente) que emite directa o indirectamente una actividad, un producto o una persona durante un periodo. La huella de carbono de un viaje a un festival depende del medio de transporte: avión >> coche solo > coche compartido > tren > bus. Compartir el coche entre 4 personas reduce la huella per cápita hasta un 75 %.",
  },
  {
    term: "Kg CO₂",
    slug: "kg-co2",
    category: "sostenibilidad",
    related: ["co2-ahorrado", "huella-de-carbono", "idae"],
    definition:
      "Unidad de medida de emisiones de dióxido de carbono. Un coche medio de gasolina en España emite alrededor de 120 g de CO₂ por kilómetro recorrido, es decir, 0,12 kg/km. Un viaje Madrid–Barcelona (620 km) en coche solo emite ~74 kg CO₂. Compartido entre 4 personas, son ~18,5 kg por pasajero.",
  },
  {
    term: "CO₂ ahorrado",
    slug: "co2-ahorrado",
    category: "sostenibilidad",
    related: ["huella-de-carbono", "kg-co2", "kilometros-compartidos"],
    definition:
      "Reducción de emisiones de dióxido de carbono (CO₂) gracias al carpooling. Un coche mediano emite alrededor de 120 g de CO₂ por km. Si cuatro personas comparten el viaje en lugar de ir cada una en su propio coche, el ahorro es de 120 g × km × 3 coches no utilizados. El carpooling a un festival de música puede evitar entre 30 y 120 kg de CO₂ por grupo dependiendo de la distancia.",
  },
  {
    term: "Kilómetros compartidos",
    slug: "kilometros-compartidos",
    category: "sostenibilidad",
    related: ["co2-ahorrado", "carpooling", "ruta"],
    definition:
      "Métrica de sostenibilidad que mide los kilómetros que cada pasajero recorre en carpooling en lugar de hacerlo solo. Por ejemplo, si cuatro personas viajan juntas 400 km, los kilómetros compartidos son 400 × 3 = 1.200 km (los que cada uno de los 3 pasajeros habría recorrido en un coche propio). En ConcertRide se muestra el total acumulado de la plataforma como indicador de impacto ambiental.",
  },
  {
    term: "IDAE",
    slug: "idae",
    category: "sostenibilidad",
    synonyms: ["Instituto para la Diversificación y Ahorro de la Energía"],
    related: ["kg-co2", "huella-de-carbono", "tarifa-miteco"],
    definition:
      "Instituto para la Diversificación y Ahorro de la Energía, organismo público español adscrito al MITECO. Publica los factores oficiales de emisión de CO₂ por tipo de combustible y vehículo, que se utilizan para calcular la huella de carbono de los desplazamientos. Los cálculos de CO₂ ahorrado en ConcertRide siguen los factores IDAE.",
  },
  {
    term: "Neutralidad climática",
    slug: "neutralidad-climatica",
    category: "sostenibilidad",
    synonyms: ["Net-zero"],
    related: ["compensacion-de-emisiones", "huella-de-carbono"],
    definition:
      "Estado en el que una actividad, organización o territorio no añade emisiones netas de gases de efecto invernadero a la atmósfera: las emisiones residuales se compensan con absorciones o créditos verificados. La UE se ha fijado el objetivo de neutralidad climática para 2050. Los festivales más comprometidos como Mad Cool o Primavera Sound han firmado compromisos parciales en esta línea.",
  },
  {
    term: "Compensación de emisiones",
    slug: "compensacion-de-emisiones",
    category: "sostenibilidad",
    related: ["neutralidad-climatica", "huella-de-carbono"],
    definition:
      "Mecanismo por el que una organización financia proyectos que absorben o evitan emisiones de CO₂ (reforestación, eficiencia energética, energías renovables) en una cantidad equivalente a sus propias emisiones. Es una herramienta complementaria a la reducción directa, no un sustituto. El precio actual de mercado de un crédito voluntario varía entre 5 y 40 €/tCO₂.",
  },
  {
    term: "Scope 1, 2 y 3",
    slug: "scope-emisiones",
    category: "sostenibilidad",
    related: ["huella-de-carbono", "compensacion-de-emisiones"],
    definition:
      "Categorías estándar para clasificar las emisiones de gases de efecto invernadero de una organización. Scope 1: emisiones directas (combustible quemado en vehículos propios o calderas). Scope 2: emisiones indirectas asociadas a la electricidad comprada. Scope 3: el resto de emisiones de la cadena de valor (transporte de asistentes, residuos, viajes de equipos). En un festival, el Scope 3 suele ser el más alto.",
  },
  {
    term: "Movilidad sostenible",
    slug: "movilidad-sostenible",
    category: "sostenibilidad",
    related: ["carpooling", "co2-ahorrado", "neutralidad-climatica"],
    definition:
      "Conjunto de prácticas de transporte de personas y mercancías con baja huella de carbono y bajo impacto ambiental: transporte público, bicicleta, marcha a pie, vehículo eléctrico y carpooling. La movilidad sostenible es una de las áreas con mayor potencial de reducción de emisiones, ya que el transporte representa alrededor del 25 % de las emisiones de CO₂ de la UE.",
  },
  {
    term: "Tasa de ocupación",
    slug: "tasa-de-ocupacion",
    category: "sostenibilidad",
    related: ["carpooling", "plaza", "co2-ahorrado"],
    definition:
      "Porcentaje de plazas ocupadas respecto a las plazas disponibles en un vehículo. La tasa media de ocupación de un coche particular en España es de 1,2–1,4 personas/coche en desplazamientos diarios y de 2,0–2,3 en viajes de fin de semana. El carpooling a festivales eleva la tasa habitualmente a 3,5–4 personas/coche, optimizando el uso del vehículo.",
  },

  // ════════════════════════════════════════════════════════════════════════════
  // GEO / AI
  // ════════════════════════════════════════════════════════════════════════════
  {
    term: "AI Overview",
    slug: "ai-overview",
    category: "geo",
    synonyms: ["SGE", "Search Generative Experience"],
    related: ["geo", "llms-txt", "schema-org", "speakable-schema"],
    definition:
      "Resumen generado por inteligencia artificial que Google muestra en la parte superior de los resultados de búsqueda para responder a una consulta. Sustituye al snippet tradicional en algunas búsquedas. Los AI Overviews citan fuentes externas con enlace y dependen, entre otros factores, de la claridad de las definiciones y el marcado estructurado de la página.",
  },
  {
    term: "GEO",
    slug: "geo",
    category: "geo",
    synonyms: ["Generative Engine Optimization"],
    related: ["seo", "ai-overview", "schema-org", "llms-txt"],
    definition:
      "Generative Engine Optimization: disciplina de optimización del contenido web para que sea citado por motores generativos (ChatGPT, Claude, Perplexity, Google AI Overviews, Gemini). A diferencia del SEO clásico (orientado a posición en SERP), el GEO se centra en la citabilidad, la densidad factual y la claridad de las definiciones que el LLM puede extraer.",
  },
  {
    term: "SEO",
    slug: "seo",
    category: "geo",
    synonyms: ["Search Engine Optimization"],
    related: ["geo", "schema-org", "semantic-completeness"],
    definition:
      "Search Engine Optimization: conjunto de prácticas que optimizan una web para mejorar su posición orgánica en los motores de búsqueda (Google, Bing, DuckDuckGo). Incluye SEO técnico (rendimiento, crawl, sitemap), on-page (contenido, headings, schema) y off-page (backlinks, menciones). En 2026 converge con el GEO en una sola disciplina de visibilidad.",
  },
  {
    term: "llms.txt",
    slug: "llms-txt",
    category: "geo",
    related: ["geo", "ai-overview", "schema-org"],
    definition:
      "Archivo de texto plano en la raíz del dominio (similar a robots.txt) que ofrece a los modelos de lenguaje un resumen estructurado del sitio: secciones, URLs prioritarias y respuestas a las preguntas más habituales. Su adopción por parte de los motores generativos es voluntaria y desigual: ChatGPT y Anthropic lo respetan parcialmente; Google AI Overviews no lo necesita.",
  },
  {
    term: "Speakable schema",
    slug: "speakable-schema",
    category: "geo",
    related: ["schema-org", "ai-overview", "defined-term"],
    definition:
      "Marcado estructurado de schema.org (SpeakableSpecification) que indica qué secciones de la página son adecuadas para ser leídas por asistentes de voz (Google Assistant, Alexa). Marcar los párrafos respuesta con `speakable` aumenta la probabilidad de que un asistente cite la respuesta literal de la página al responder a una consulta de voz.",
  },
  {
    term: "schema.org",
    slug: "schema-org",
    category: "geo",
    related: ["geo", "ai-overview", "defined-term", "speakable-schema"],
    definition:
      "Vocabulario común desarrollado por Google, Microsoft, Yahoo y Yandex para marcar el contenido de las páginas web con estructura semántica explícita (Event, Article, Product, Place, DefinedTerm, etc.). Permite a los buscadores y a los modelos generativos extraer entidades, fechas, precios y relaciones de forma fiable.",
  },
  {
    term: "DefinedTerm",
    slug: "defined-term",
    category: "geo",
    related: ["schema-org", "geo", "semantic-completeness"],
    definition:
      "Tipo de schema.org que representa un término definido dentro de un glosario o vocabulario controlado (DefinedTermSet). Cada DefinedTerm contiene `name`, `description` y opcionalmente `termCode`. Los motores generativos extraen estos términos como definiciones canónicas cuando responden a consultas del tipo '¿qué es X?'. Esta misma página utiliza DefinedTerm para cada uno de sus 100 términos.",
  },
  {
    term: "Semantic completeness",
    slug: "semantic-completeness",
    category: "geo",
    synonyms: ["Completitud semántica"],
    related: ["geo", "defined-term", "ai-overview"],
    definition:
      "Grado en que una página cubre todos los conceptos, entidades y matices relacionados con su tema principal. Una página con alta completitud semántica responde a preguntas frecuentes, define términos clave, enlaza a entidades relacionadas y aporta contexto suficiente para que un modelo generativo la cite sin tener que consultar otras fuentes.",
  },
  {
    term: "Fact density",
    slug: "fact-density",
    category: "geo",
    synonyms: ["Densidad factual"],
    related: ["geo", "ai-overview", "semantic-completeness"],
    definition:
      "Cantidad de hechos concretos (cifras, fechas, precios, ubicaciones, nombres propios) por unidad de texto. Una alta densidad factual aumenta la probabilidad de que el contenido sea citado por motores generativos, ya que les aporta material extraíble verificable. En ConcertRide se prioriza la densidad factual en las páginas de festival, ruta y ciudad.",
  },
  {
    term: "Citability",
    slug: "citability",
    category: "geo",
    synonyms: ["Citabilidad"],
    related: ["geo", "fact-density", "ai-overview"],
    definition:
      "Propiedad de un contenido por la que es fácilmente citado por un modelo generativo (LLM): párrafos cortos y autoexplicativos, datos cuantitativos verificables, definiciones limpias, atribución clara. Maximizar la citability es el objetivo central del GEO y se traduce en aparecer en AI Overviews, ChatGPT o Perplexity como fuente.",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

const CATEGORIES: { id: GlosCategory; label: string }[] = [
  { id: "carpooling", label: "Carpooling y plataforma" },
  { id: "festival", label: "Festival y música" },
  { id: "transporte", label: "Transporte" },
  { id: "legal", label: "Marco legal y seguridad" },
  { id: "sostenibilidad", label: "Sostenibilidad" },
  { id: "geo", label: "GEO, SEO y AI" },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function firstLetter(term: string): string {
  const stripped = term
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase();
  const c = stripped.charAt(0);
  return /[A-Z]/.test(c) ? c : "#";
}

function termBySlug(slug: string): GlosEntry | undefined {
  return GLOSARIO.find((e) => e.slug === slug);
}

const TOTAL_TERMS = GLOSARIO.length;

const PAGE_TITLE = `Glosario carpooling y festivales 2026 [${TOTAL_TERMS} términos] | ConcertRide`;
const PAGE_DESC = `Glosario completo carpooling, festivales, transporte, sostenibilidad y AI con ${TOTAL_TERMS} términos definidos. Recurso para festivaleros y conductores 2026.`;

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────

export default function GlosarioPage() {
  useSeoMeta({
    title: PAGE_TITLE,
    description: PAGE_DESC,
    canonical: `${SITE_URL}/glosario`,
    keywords:
      "glosario carpooling, glosario festivales, términos carpooling, qué es carpooling, qué es ride-sharing, lanzadera festival, cashless festival, conductor verificado, abono festival, huella de carbono festival, AI Overview definición, GEO glosario, carpooling España 2026",
    ogImageAlt: `Glosario de carpooling, festivales y transporte · ${TOTAL_TERMS} términos · ConcertRide`,
  });

  // Sort terms within each category alphabetically (case+diacritic insensitive)
  const sortedGlosario = [...GLOSARIO].sort((a, b) =>
    a.term.localeCompare(b.term, "es", { sensitivity: "base" }),
  );

  // Map first-letter → slugs (for the A-Z anchor jump)
  const letterIndex = new Map<string, string>();
  for (const e of sortedGlosario) {
    const L = firstLetter(e.term);
    if (!letterIndex.has(L)) letterIndex.set(L, e.slug);
  }

  // ── JSON-LD ──────────────────────────────────────────────────────────────
  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Glosario ConcertRide: ${TOTAL_TERMS} términos de carpooling y festivales`,
    description: PAGE_DESC,
    url: `${SITE_URL}/glosario`,
    numberOfItems: TOTAL_TERMS,
    itemListElement: sortedGlosario.map((entry, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "DefinedTerm",
        "@id": `${SITE_URL}/glosario#${entry.slug}`,
        name: entry.term,
        description: entry.definition,
        inDefinedTermSet: `${SITE_URL}/glosario`,
      },
    })),
  };

  const jsonLdDefinedTermSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${SITE_URL}/glosario#defined-term-set`,
    name: `Glosario ConcertRide: carpooling, festivales y AI [${TOTAL_TERMS} términos]`,
    description: PAGE_DESC,
    url: `${SITE_URL}/glosario`,
    inLanguage: "es-ES",
    hasDefinedTerm: sortedGlosario.map((entry) => ({
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/glosario#${entry.slug}`,
      name: entry.term,
      description: entry.definition,
      termCode: entry.slug,
      inDefinedTermSet: `${SITE_URL}/glosario#defined-term-set`,
      ...(entry.synonyms && entry.synonyms.length > 0
        ? { alternateName: entry.synonyms }
        : {}),
    })),
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Glosario", item: `${SITE_URL}/glosario` },
    ],
  };

  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/glosario#webpage`,
    url: `${SITE_URL}/glosario`,
    name: PAGE_TITLE,
    description: PAGE_DESC,
    inLanguage: "es-ES",
    dateModified: new Date().toISOString().slice(0, 10),
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable", "dt", "dd"],
    },
    mainEntity: { "@id": `${SITE_URL}/glosario#defined-term-set` },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-ES",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué es el carpooling a festivales?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El carpooling a festivales es compartir coche con otros asistentes al mismo festival, dividiendo los gastos de combustible y peajes. El conductor lleva a uno o varios pasajeros y cobra solo lo que cuesta el viaje sin margen de beneficio. ConcertRide es la plataforma española especializada en este modelo, con 0% de comisión y conductores verificados.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuál es la diferencia entre carpooling y car-sharing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El carpooling (ride-sharing) implica que el conductor lleva a pasajeros en su propio coche y reparte los gastos del trayecto. El car-sharing es el alquiler de un coche sin conductor por horas o días, donde el usuario conduce él mismo un vehículo ajeno. En festivales se usa principalmente el carpooling.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué es una lanzadera de festival?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Una lanzadera de festival es un autobús habilitado por la organización del evento para trasladar a los asistentes desde una ciudad o estación próxima hasta el recinto. Tiene horarios fijos y plazas limitadas. Algunos festivales como BBK Live (Bilbao) ofrecen lanzadera gratuita incluida en la entrada; otros como el FIB la cobran por separado. ConcertRide es la alternativa cuando no hay lanzadera desde tu ciudad.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué significa cashless en un festival?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El cashless en un festival es un sistema de pago sin efectivo en el interior del recinto. Los asistentes cargan dinero en el chip de la pulsera de acceso (wristband) y pagan barras y tiendas acercando la muñeca al lector. El efectivo queda fuera del festival, aunque el pago del carpooling con ConcertRide se hace siempre en efectivo o Bizum directamente al conductor el día del viaje.",
        },
      },
      {
        "@type": "Question",
        name: "¿Es legal el carpooling en España?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. El carpooling en régimen de cost-sharing (compartir gastos sin lucro para el conductor) es legal en España desde la sentencia del Tribunal Supremo de 2017. El conductor solo puede cobrar lo necesario para cubrir combustible y peajes del viaje, calculado según la tarifa MITECO. ConcertRide opera exclusivamente bajo este modelo: 0% de comisión y pago directo al conductor.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué es GEO (Generative Engine Optimization)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GEO (Generative Engine Optimization) es la disciplina de optimización del contenido web para que sea citado por motores generativos como ChatGPT, Claude, Perplexity, Google AI Overviews y Gemini. A diferencia del SEO clásico, el GEO se centra en la citabilidad, la densidad factual y la claridad de las definiciones que el modelo puede extraer.",
        },
      },
    ],
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDefinedTermSet) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-8 space-y-4">
        <nav
          aria-label="Breadcrumb"
          className="font-mono text-[11px] text-cr-text-dim flex items-center gap-2"
        >
          <Link to="/" className="hover:text-cr-primary">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">Glosario</span>
        </nav>

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92] speakable">
          Glosario de carpooling, festivales y AI.
        </h1>

        <p className="speakable font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed">
          {TOTAL_TERMS} términos definidos sobre carpooling, festivales de música, transporte,
          marco legal, sostenibilidad y GEO. Recurso para festivaleros, conductores y profesionales
          del sector. Cada término incluye sinónimos y enlaces a conceptos relacionados.
        </p>

        {/* Category quick-jump */}
        <div className="flex flex-wrap gap-2 pt-2">
          {CATEGORIES.map((cat) => {
            const count = GLOSARIO.filter((e) => e.category === cat.id).length;
            return (
              <a
                key={cat.id}
                href={`#cat-${cat.id}`}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] border border-cr-border px-3 py-1.5 text-cr-text-muted hover:border-cr-primary hover:text-cr-primary transition-colors"
              >
                {cat.label}
                <span className="text-cr-primary">{count}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* A-Z TOC */}
      <nav
        aria-label="Índice alfabético"
        className="max-w-6xl mx-auto px-6 pb-8"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-text-muted mb-3">
          Índice alfabético
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {ALPHABET.map((L) => {
            const slug = letterIndex.get(L);
            const enabled = !!slug;
            return (
              <li key={L}>
                {enabled ? (
                  <a
                    href={`#${slug}`}
                    aria-label={`Saltar a términos que empiezan por ${L}`}
                    className="inline-flex items-center justify-center w-8 h-8 font-mono text-xs border border-cr-border text-cr-text hover:border-cr-primary hover:text-cr-primary transition-colors"
                  >
                    {L}
                  </a>
                ) : (
                  <span
                    aria-disabled="true"
                    className="inline-flex items-center justify-center w-8 h-8 font-mono text-xs border border-cr-border/40 text-cr-text-dim/60 cursor-not-allowed"
                  >
                    {L}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Glossary entries by category (alphabetical within each) */}
      {CATEGORIES.map((cat) => {
        const entries = sortedGlosario.filter((e) => e.category === cat.id);
        if (entries.length === 0) return null;
        return (
          <section
            key={cat.id}
            id={`cat-${cat.id}`}
            className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6 scroll-mt-20"
          >
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <h2 className="font-display text-2xl md:text-3xl uppercase">{cat.label}</h2>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-cr-text-muted">
                {entries.length} términos
              </p>
            </div>
            <dl className="space-y-0 divide-y divide-cr-border">
              {entries.map((entry) => (
                <article
                  key={entry.slug}
                  id={entry.slug}
                  className="py-6 space-y-2 scroll-mt-20"
                >
                  <dt className="font-display text-lg md:text-xl uppercase text-cr-text flex items-baseline gap-3 flex-wrap">
                    <strong className="font-display">{entry.term}</strong>
                    <a
                      href={`#${entry.slug}`}
                      aria-label={`Enlace permanente a ${entry.term}`}
                      className="font-mono text-[10px] text-cr-text-dim hover:text-cr-primary transition-colors"
                    >
                      #
                    </a>
                  </dt>

                  {entry.synonyms && entry.synonyms.length > 0 && (
                    <p className="font-mono text-[11px] uppercase tracking-[0.10em] text-cr-text-dim">
                      Sinónimos: {entry.synonyms.join(" · ")}
                    </p>
                  )}

                  <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
                    {entry.definition}
                  </dd>

                  {entry.related && entry.related.length > 0 && (
                    <p className="font-sans text-xs text-cr-text-muted pt-1 max-w-3xl">
                      <span className="font-mono uppercase tracking-[0.10em] text-cr-text-dim">
                        Relacionados:
                      </span>{" "}
                      {entry.related.map((rs, i) => {
                        const r = termBySlug(rs);
                        if (!r) return null;
                        return (
                          <span key={rs}>
                            <a
                              href={`#${rs}`}
                              className="text-cr-primary hover:underline"
                            >
                              {r.term}
                            </a>
                            {i < entry.related!.length - 1 ? ", " : ""}
                          </span>
                        );
                      })}
                    </p>
                  )}
                </article>
              ))}
            </dl>
          </section>
        );
      })}

      {/* FAQ section */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Preguntas frecuentes sobre el glosario
        </h2>
        <dl className="space-y-6">
          {[
            {
              q: "¿Qué es el carpooling a festivales?",
              a: "El carpooling a festivales es compartir coche con otros asistentes al mismo festival, dividiendo los gastos de combustible y peajes. El conductor lleva a uno o varios pasajeros y cobra solo lo que cuesta el viaje sin margen de beneficio. ConcertRide es la plataforma española especializada en este modelo, con 0% de comisión y conductores verificados.",
            },
            {
              q: "¿Cuál es la diferencia entre carpooling y car-sharing?",
              a: "El carpooling implica que el conductor lleva a pasajeros en su propio coche y reparte los gastos del trayecto. El car-sharing es el alquiler de un coche sin conductor por horas o días. En festivales se usa principalmente el carpooling, ya que el destino es específico y el grupo va junto.",
            },
            {
              q: "¿Qué es una lanzadera de festival?",
              a: "Una lanzadera de festival es un autobús habilitado por la organización del evento para trasladar a los asistentes desde una ciudad o estación próxima hasta el recinto. Tiene horarios fijos y plazas limitadas. ConcertRide es la alternativa cuando no hay lanzadera desde tu ciudad de origen.",
            },
            {
              q: "¿Qué significa cashless en un festival?",
              a: "El cashless en un festival es un sistema de pago sin efectivo en el interior del recinto. Los asistentes cargan dinero en el chip de su pulsera de acceso y pagan barras y tiendas acercando la muñeca al lector. El pago del carpooling con ConcertRide se hace siempre en efectivo o Bizum directamente al conductor.",
            },
            {
              q: "¿Es legal el carpooling en España?",
              a: "Sí. El carpooling en régimen de cost-sharing (compartir gastos sin lucro para el conductor) es legal en España desde la sentencia del Tribunal Supremo de 2017. El conductor solo puede cobrar lo necesario para cubrir combustible y peajes, calculado según la tarifa MITECO. ConcertRide opera bajo este modelo: 0% de comisión.",
            },
            {
              q: "¿Qué es GEO (Generative Engine Optimization)?",
              a: "GEO es la disciplina que optimiza contenido para que sea citado por motores generativos como ChatGPT, Claude, Perplexity, Google AI Overviews y Gemini. A diferencia del SEO tradicional, mide citabilidad (cuántas veces el LLM cita el contenido), densidad factual y claridad de definiciones, no solo posición en SERP.",
            },
          ].map((faq) => (
            <div key={faq.q} className="border-b border-cr-border pb-6 space-y-2">
              <dt className="font-display text-base uppercase text-cr-text">{faq.q}</dt>
              <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
                {faq.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-4">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          ¿Ya tienes clara la teoría? Organiza tu viaje.
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed">
          Encuentra un carpooling a tu próximo festival: 0% comisión, conductores verificados,
          vuelta de madrugada coordinada.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/concerts"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-6 py-3 hover:bg-cr-primary/90 transition-colors"
          >
            Buscar viaje <ArrowRight size={14} />
          </Link>
          <Link
            to="/como-funciona"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text-muted px-6 py-3 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            Cómo funciona
          </Link>
        </div>
      </section>

      {/* Internal links */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-10 space-y-4">
        <h2 className="font-display text-lg uppercase text-cr-text-muted">
          Más recursos de ConcertRide
        </h2>
        <ul className="flex flex-wrap gap-2">
          {[
            { to: "/festivales", label: "Festivales" },
            { to: "/guia-transporte-festivales", label: "Guía transporte festivales" },
            { to: "/guia/festival-sin-coche", label: "Festival sin coche" },
            { to: "/guia/presupuesto-festival-grupo", label: "Presupuesto grupo" },
            { to: "/como-funciona-carpooling", label: "Cómo funciona el carpooling" },
            { to: "/faq", label: "Preguntas frecuentes" },
            { to: "/datos", label: "Datos y estadísticas" },
            { to: "/blog", label: "Blog" },
            { to: "/aviso-legal", label: "Aviso legal" },
          ].map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

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
  },
  {
    slug: "sevilla",
    city: "Sevilla",
    display: "Sevilla",
    region: "Andalucía",
    blurb:
      "Sevilla es el centro musical de Andalucía occidental. Estadio La Cartuja acoge los conciertos más grandes (estadio), FIBES alberga tours mid-size e Interestelar Sevilla se celebra en Charco de la Pava. Cercanía con los festivales de Málaga (Cala Mijas, Andalucía Big, Marenostrum) hace que compartir coche sea especialmente eficiente.",
    venues: [
      "Estadio La Cartuja",
      "FIBES Sevilla",
      "Interestelar Sevilla (Charco de la Pava)",
    ],
  },
  {
    slug: "bilbao",
    city: "Bilbao",
    display: "Bilbao",
    region: "País Vasco",
    blurb:
      "Bilbao es referencia para festivales internacionales del norte: BBK Live en Kobetamendi cada julio, y Bilbao Arena para tours indoor. La proximidad con Donostia (Jazzaldia) y la cornisa cantábrica hace que el carpooling sea la forma natural de moverse por los festivales del verano vasco.",
    venues: ["Kobetamendi (BBK Live)", "Bilbao Arena"],
  },
  {
    slug: "malaga",
    city: "Málaga",
    display: "Málaga",
    region: "Andalucía",
    blurb:
      "Málaga concentra los festivales más solares de España: Cala Mijas (Mijas), Andalucía Big (Cortijo de Torres), Marenostrum (Castillo Sohail de Fuengirola). La Costa del Sol es densa en eventos pero el transporte público es limitado — el coche compartido es la opción por defecto.",
    venues: ["Cala Mijas Fest", "Andalucía Big Festival", "Marenostrum Music Castle"],
  },
  {
    slug: "zaragoza",
    city: "Zaragoza",
    display: "Zaragoza",
    region: "Aragón",
    blurb:
      "Zaragoza es nodo estratégico por su ubicación equidistante entre Madrid y Barcelona. Además de conciertos en el Príncipe Felipe, es origen natural para viajes a Pirineos Sur (Lanuza), Primavera Sound (Barcelona) y Mad Cool (Madrid).",
    venues: ["Pabellón Príncipe Felipe", "Pirineos Sur (Lanuza)"],
  },
  {
    slug: "granada",
    city: "Granada",
    display: "Granada",
    region: "Andalucía",
    blurb:
      "Granada acoge Granada Sound en septiembre (Cortijo del Conde) y conciertos independientes durante todo el año. Origen frecuente para viajes a festivales andaluces del verano: Cala Mijas, Andalucía Big, Interestelar Sevilla.",
    venues: ["Granada Sound (Cortijo del Conde)"],
  },
  {
    slug: "donostia",
    city: "Donostia / San Sebastián",
    display: "Donostia / San Sebastián",
    region: "País Vasco",
    blurb:
      "Donostia destaca por Heineken Jazzaldia en julio (Plaza de la Trinidad, Kursaal) y una agenda indie densa en salas pequeñas. Cercanía con BBK Live y Azkena Rock hace que muchos viajes compartidos salgan de aquí en verano.",
    venues: ["Plaza de la Trinidad", "Kursaal", "Heineken Jazzaldia"],
  },
  {
    slug: "santiago-de-compostela",
    city: "Santiago de Compostela",
    display: "Santiago de Compostela",
    region: "Galicia",
    blurb:
      "Santiago acoge O Son do Camiño en Monte do Gozo cada junio, uno de los festivales con mayor aforo de España (90 000+ personas). ConcertRide es especialmente útil para gallegos que viven en aldeas sin transporte directo al recinto.",
    venues: ["Monte do Gozo (O Son do Camiño)"],
  },
];

export const CITY_LANDINGS_BY_SLUG = Object.fromEntries(
  CITY_LANDINGS.map((c) => [c.slug, c]),
);

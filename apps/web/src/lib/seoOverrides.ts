/**
 * SEO_OVERRIDES.ts
 *
 * Master configuration for title/description/keyword overrides.
 * Used by FestivalLandingPage, CityLandingPage, RouteLandingPage, etc.
 *
 * PRINCIPLE: CTR optimization for GSC queries with high impressions / low clicks
 *
 * Formula for titles:
 * "[Entity] [Year]: [What] + [Differentiator] | ConcertRide"
 *
 * Example:
 * ✅ "Viña Rock 2026 + Cómo llegar: Carpooling desde 6€ | ConcertRide"
 * vs
 * ❌ "Viña Rock"
 */

const YEAR = new Date().getFullYear();
const NEXT_YEAR = YEAR + 1;

// ─────────────────────────────────────────────────────────────────────────────
// FESTIVAL TITLE/DESCRIPTION OVERRIDES
// ─────────────────────────────────────────────────────────────────────────────

export const FESTIVAL_SEO_OVERRIDES: Record<string, { title: string; description: string; keywords?: string }> = {
  "vina-rock": {
    title: `Viña Rock ${YEAR} + Bus y Carpooling: cómo llegar desde 6€ | ConcertRide`,
    description: `Viña Rock ${YEAR} La Pulgosa, Villarrobledo (Albacete): autobuses lanzadera oficiales desde Albacete. Carpooling desde Madrid (6–9€), Valencia (6–9€), Albacete (3–5€), Alicante (5–8€). Sin comisión.`,
    keywords: `viña rock ${YEAR}, viña rock buses, autobus viña rock, viñarock bus, bus viñarock, buses viña rock, como llegar viña rock, viña rock como llegar, transporte viña rock, viaje compartido viña rock, viña rock desde madrid, viña rock desde sevilla, viña rock autobús, autobuses viñarock, viña rock localización, viña rock horarios, viña rock transporte`,
  },
  "arenal-sound": {
    title: `Arenal Sound ${YEAR} + Transporte: Carpooling desde 3€ | Burriana | ConcertRide`,
    description: `Arenal Sound Burriana (Castellón) ${YEAR}: carpooling desde Valencia (65 km, 3–6€), Castellón (3–5€), Madrid (12–17€), Barcelona (8–12€). Bus lanzadera desde Castellón. Sin comisión.`,
    keywords: `arenal sound ${YEAR}, arenal sound carpooling, como llegar arenal sound, autobus castellon burriana arenal sound, autobús arenal sound, transporte arenal sound, bus arenal sound, arenal sound localización, arenal sound como llegar, arenal sound tren, arenal sound bus, viaje compartido burriana arenal sound, arenal sound desde madrid`,
  },
  "mad-cool": {
    title: `Mad Cool ${YEAR} Madrid + Cómo llegar: Carpooling desde 4€ | ConcertRide`,
    description: `Mad Cool Festival IFEMA Madrid ${YEAR} (9–11 julio): carpooling desde toda España. Barcelona (620 km, 15–20€), Valencia (355 km, 10–14€), Zaragoza (325 km, 9–13€). Desde 4€/asiento, sin comisión.`,
    keywords: `mad cool ${YEAR}, mad cool madrid carpooling, como llegar mad cool, transporte mad cool, viaje compartido mad cool, carpooling madrid ifema`,
  },
  "bbk-live": {
    title: `BBK Live ${YEAR} Bilbao + Cómo llegar: Carpooling desde 5€ | Kobetamendi | ConcertRide`,
    description: `BBK Live Kobetamendi Bilbao (9–11 julio): carpooling desde Madrid (395 km, 11–16€), Donostia (100 km, 4–7€), Vitoria (65 km, 3–6€), Santander (90 km, 5–8€). Sin comisión.`,
    keywords: `bbk live ${YEAR}, bbk live carpooling, como llegar bbk live, transporte bbk live, autobús bbk live bilbao, viaje compartido kobetamendi`,
  },
  "primavera-sound": {
    title: `Primavera Sound ${YEAR} Barcelona + Cómo ir: Carpooling desde 14€ | ConcertRide`,
    description: `Primavera Sound Parc del Fòrum Barcelona (28 may–1 jun): carpooling desde Madrid (620 km, 15–20€), Valencia (355 km, 10–14€), Zaragoza (306 km, 8–12€). Conductores verificados, sin comisión.`,
    keywords: `primavera sound ${YEAR}, primavera sound carpooling, como llegar primavera sound barcelona, transporte primavera sound, viaje compartido barcelona fòrum`,
  },
  "sonar": {
    title: `Sónar Barcelona ${YEAR} + Cómo llegar: Carpooling desde 16€ | Fira Montjuïc | ConcertRide`,
    description: `Sónar Festival Fira Montjuïc Barcelona (18–20 jun): carpooling desde Madrid (620 km, 14–22€), Valencia (355 km, 10–14€). Desde 14€/asiento, sin comisión. Electrónica, house, techno.`,
    keywords: `sonar barcelona ${YEAR}, sonar carpooling, como llegar sonar festival, transporte sonar barcelona, viaje compartido sonar fira montjuïc`,
  },
  "resurrection-fest": {
    title: `Resurrection Fest ${YEAR} Viveiro + Cómo llegar: Metal, carpooling desde 8€ | ConcertRide`,
    description: `Resurrection Fest Viveiro Galicia (jun): carpooling desde A Coruña (100 km, 4–7€), Vigo (200 km, 6–9€), Madrid (600 km, 16–22€). Metal, punk, rock. Sin comisión.`,
    keywords: `resurrection fest ${YEAR}, resurrection fest viveiro carpooling, como llegar resurrection fest, transporte metal festival, viaje compartido resurrection fest`,
  },
  "cala-mijas": {
    title: `Cala Mijas Festival ${YEAR}: cómo llegar, carpooling desde 3€ | Mijas | ConcertRide`,
    description: `Cala Mijas Fest ${YEAR} Cortijo de Torres, Mijas (Málaga): carpooling desde Málaga (60 km, 3–6€), Sevilla (200 km, 6–9€), Granada (170 km, 8–11€), Madrid (560 km, 14–20€). Sin comisión.`,
    keywords: `cala mijas festival ${YEAR}, cala mijas ${YEAR}, cala mijas carpooling, como llegar cala mijas, transporte cala mijas, cala mijas mijas málaga, cala mijas festival málaga, cortijo de torres mijas, viaje compartido cala mijas, cala mijas desde málaga`,
  },
  "azkena-rock": {
    title: `Azkena Rock Festival ${YEAR} Vitoria + Transporte: Carpooling desde 5€ | ConcertRide`,
    description: `Azkena Rock Mendizabala Vitoria-Gasteiz (junio): carpooling desde Bilbao (65 km, 3–6€), Donostia (100 km, 5–8€), Pamplona (95 km, 4–7€). Rock alternativo, punk. Sin comisión.`,
    keywords: `azkena rock ${YEAR}, azkena rock carpooling, como llegar azkena rock vitoria, transporte azkena rock, viaje compartido mendizabala`,
  },
  "o-son-do-camiño": {
    title: `O Son do Camiño ${YEAR} Santiago + Cómo llegar: Carpooling desde 8€ | 90.000+ | ConcertRide`,
    description: `O Son do Camiño Monte do Gozo Santiago (18–20 junio): carpooling desde A Coruña (70 km, 3–6€), Vigo (90 km, 4–7€), Madrid (585 km, 15–20€). 90.000+ personas. Sin comisión.`,
    keywords: `o son do camiño ${YEAR}, o son do camiño santiago carpooling, como llegar o son do camiño, transporte monte do gozo, viaje compartido santiago festival`,
  },
  "low-festival": {
    title: `Low Festival ${YEAR} Benidorm + Cómo ir: Carpooling desde 5€ | ConcertRide`,
    description: `Low Festival Benidorm ${YEAR} (agosto): carpooling desde Alicante (45 km, 5–8€), Valencia (100 km, 10–13€), Madrid (420 km, 15–20€). Indie, pop, rock. Sin comisión.`,
    keywords: `low festival benidorm ${YEAR}, low festival carpooling, como llegar low festival, transporte benidorm festival, viaje compartido low festival`,
  },
  "zevra-festival": {
    title: `Zevra Festival ${YEAR} Valencia + Bus y Carpooling: cómo llegar | ConcertRide`,
    description: `Zevra Festival ${YEAR} La Marina de Valencia: metro L4 (parada La Marina), bus EMT 19/95. Carpooling desde Madrid (16–22€), Barcelona (14–20€), Alicante (8–12€). Sin comisión.`,
    keywords: `zevra festival ${YEAR}, zevra festival bus, zevra festival horarios, zevra festival como llegar, zevra festival transporte, zevra festival metro, zevra festival valencia, zevra festival carpooling, como llegar zevra festival`,
  },
  "fib": {
    title: `FIB Benicàssim ${YEAR} + Cómo llegar: Tren, Bus, Carpooling | ConcertRide`,
    description: `FIB Festival Internacional Benicàssim ${YEAR} (16–19 julio): tren Cercanías Castellón–Benicàssim (5 min). Carpooling desde Valencia (4–7€), Madrid (10–14€), Barcelona (8–12€). Sin comisión.`,
    keywords: `fib ${YEAR}, fib benicassim ${YEAR}, fib benicàssim como llegar, fib festival tren, autobús fib, fib carpooling, festival internacional benicassim, fib transporte, como ir fib`,
  },
  "sonar": {
    title: `Sónar ${YEAR} Barcelona + Metro y Carpooling: cómo llegar | ConcertRide`,
    description: `Sónar Festival ${YEAR} Fira Montjuïc Barcelona: metro L1 Espanya. Carpooling desde Madrid (14–22€), Valencia (10–14€), Zaragoza (8–12€). Electrónica, techno, house. Sin comisión.`,
    keywords: `sonar ${YEAR}, sonar barcelona ${YEAR}, sonar como llegar, sonar barcelona metro, sonar festival transporte, sonar carpooling, como llegar sonar, sonar fira montjuic`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CITY TITLE/DESCRIPTION IMPROVEMENTS (extends existing cityLandings)
// ─────────────────────────────────────────────────────────────────────────────

export const CITY_SEO_IMPROVEMENTS: Record<string, { title: string; description: string; keywords?: string }> = {
  sevilla: {
    title: `Conciertos Sevilla ${YEAR}: Fechas, recintos + Cómo llegar en carpooling | ConcertRide`,
    description: `Próximos conciertos en Sevilla ${YEAR}: La Cartuja (60.000), FIBES (9.500), Palacio Deportes (7.000). Interestelar Sevilla, Icónica Sevilla Fest. Carpooling a festivales desde 3€/asiento sin comisión.`,
    keywords: `conciertos en Sevilla ${YEAR}, conciertos Sevilla ${NEXT_YEAR}, próximos conciertos Sevilla, La Cartuja conciertos, FIBES Sevilla, conciertos música Sevilla, carpooling Sevilla festivales, viaje compartido Sevilla concierto`,
  },
  donostia: {
    title: `Conciertos Donostia–San Sebastián ${YEAR}: Jazzaldia + Carpooling | ConcertRide`,
    description: `Conciertos en Donostia–San Sebastián ${YEAR}: Jazzaldia (julio), Donostia Arena, Kursaal. Carpooling a BBK Live (100 km, 4–7€), Azkena Rock (100 km, 4–7€) sin comisión.`,
    keywords: `conciertos Donostia ${YEAR}, conciertos San Sebastián, Jazzaldia ${YEAR}, conciertos en donostia, como llegar concierto donostia, carpooling Jazzaldia`,
  },
  alicante: {
    title: `Conciertos Alicante ${YEAR}: Plaza Toros + Carpooling a festivales | ConcertRide`,
    description: `Conciertos en Alicante ${YEAR}: Plaza de Toros, ADDA, Pitiu Rochel. Carpooling a Low Festival (45 km, 5€), Arenal Sound (115 km, 8€), Viña Rock (165 km, 10€) sin comisión.`,
    keywords: `conciertos Alicante ${YEAR}, conciertos en Alicante, próximos conciertos Alicante, Plaza Toros Alicante, carpooling Alicante festivales, viaje compartido Alicante`,
  },
  zaragoza: {
    title: `Conciertos Zaragoza ${YEAR}: Príncipe Felipe + Carpooling a Mad Cool, Primavera | ConcertRide`,
    description: `Conciertos en Zaragoza ${YEAR}: Pabellón Príncipe Felipe, Sala López. Carpooling a Mad Cool (12€), Primavera Sound (14€), Arenal Sound (10€) sin comisión desde Zaragoza.`,
    keywords: `conciertos Zaragoza ${YEAR}, conciertos en Zaragoza, próximos conciertos Zaragoza, Pabellón Príncipe Felipe, carpooling Zaragoza festivales, viajes Mad Cool desde Zaragoza`,
  },
  murcia: {
    title: `Conciertos Murcia ${YEAR}: SOS 4.8 + Carpooling a Medusa, Arenal Sound | ConcertRide`,
    description: `Conciertos en Murcia ${YEAR}: Auditorio Víctor Villegas, SOS 4.8 Festival. Carpooling a Medusa (180 km, 8€), Arenal Sound (250 km, 12€), Viña Rock (155 km, 8€) sin comisión.`,
    keywords: `conciertos Murcia ${YEAR}, conciertos en Murcia, SOS 4.8 Murcia, carpooling Murcia festivales, viaje compartido Murcia concierto`,
  },
  malaga: {
    title: `Conciertos Málaga ${YEAR}: Cala Mijas + Carpooling a festivales Costa del Sol | ConcertRide`,
    description: `Conciertos en Málaga ${YEAR}: Cala Mijas Fest (Cortijo Torres), Marenostrum (Fuengirola), Andalucía Big. Carpooling sin comisión desde Sevilla (6€), Granada (8€), Madrid (14€).`,
    keywords: `conciertos Málaga ${YEAR}, conciertos en Málaga, Cala Mijas Festival, carpooling Málaga, viaje compartido Costa del Sol, festivales Málaga`,
  },
  bilbao: {
    title: `Conciertos Bilbao ${YEAR}: BBK Live, Euskalduna + Carpooling desde toda España | ConcertRide`,
    description: `Conciertos en Bilbao ${YEAR}: BBK Live (Kobetamendi, julio), Bilbao Arena, Euskalduna. Carpooling sin comisión desde Madrid (11€), Donostia (5€), Vitoria (4€), Santander (5€).`,
    keywords: `conciertos Bilbao ${YEAR}, BBK Live Bilbao, conciertos en Bilbao, Palacio Euskalduna, carpooling Bilbao festivales, viaje compartido Bilbao`,
  },
  barcelona: {
    title: `Conciertos Barcelona ${YEAR}: Primavera Sound, Sónar, Cruïlla + Carpooling | ConcertRide`,
    description: `Conciertos en Barcelona ${YEAR}: Primavera Sound (mayo–junio), Sónar (junio), Cruïlla (julio). Carpooling sin comisión desde Madrid (22€), Valencia (14€), Zaragoza (14€).`,
    keywords: `conciertos Barcelona ${YEAR}, conciertos en Barcelona, Primavera Sound, Sónar Barcelona, carpooling Barcelona festivales, viaje compartido Barcelona`,
  },
  valencia: {
    title: `Conciertos Valencia ${YEAR}: Zevra, Arenal Sound, Medusa + Carpooling | ConcertRide`,
    description: `Conciertos en Valencia ${YEAR}: Zevra (La Marina), Arenal Sound (Burriana), Medusa (Cullera), FIB (Benicàssim). Carpooling sin comisión desde Barcelona (14€), Madrid (16€), Alicante (10€).`,
    keywords: `conciertos Valencia ${YEAR}, conciertos en Valencia, Zevra Festival, Arenal Sound Valencia, carpooling Valencia festivales, viaje compartido Valencia`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// "CÓMO LLEGAR" PAGE DESCRIPTIONS (used by HowToGetTherePage.tsx)
// ─────────────────────────────────────────────────────────────────────────────

export const HOW_TO_GET_THERE_SEO: Record<string, { title: string; description: string; keywords?: string }> = {
  "arenal-sound": {
    title: `Cómo llegar a Arenal Sound ${YEAR}: Bus, tren y carpooling | Burriana | ConcertRide`,
    description: `Guía completa Arenal Sound ${YEAR} Burriana (Castellón): bus lanzadera desde Castellón, tren Cercanías C6 Valencia–Castellón (45 min). Carpooling desde Valencia (3–6€), Madrid (12–17€). Sin comisión.`,
    keywords: `como llegar arenal sound ${YEAR}, arenal sound transporte, autobus castellon burriana arenal sound, tren arenal sound, arenal sound bus, arenal sound localización`,
  },
  "bbk-live": {
    title: `Cómo llegar a BBK Live ${YEAR}: Lanzadera, autobús, carpooling | Bilbao | ConcertRide`,
    description: `BBK Live ${YEAR} Kobetamendi Bilbao: lanzadera gratuita desde Plaza Moyúa incluida en la entrada. Carpooling desde Madrid (11–16€), Donostia (4–7€), Vitoria (3–6€). Sin comisión.`,
    keywords: `como llegar bbk live ${YEAR}, bbk live transporte, bbk live lanzadera, bbk live bus, bbk live como llegar bilbao, carpooling bbk live`,
  },
  "mad-cool": {
    title: `Cómo ir a Mad Cool ${YEAR}: Metro, bus y carpooling | IFEMA Madrid | ConcertRide`,
    description: `Mad Cool Festival ${YEAR} IFEMA Madrid: metro L8 hasta Feria de Madrid. Carpooling desde Barcelona (15–20€), Valencia (10–14€), Zaragoza (9–13€). Sin comisión de plataforma.`,
    keywords: `como llegar mad cool ${YEAR}, mad cool transporte, mad cool metro, mad cool como llegar, mad cool ifema carpooling, mad cool desde barcelona`,
  },
  "primavera-sound": {
    title: `Cómo llegar a Primavera Sound Barcelona ${YEAR}: Metro, carpooling | ConcertRide`,
    description: `Primavera Sound Barcelona ${YEAR} Parc del Fòrum: metro L4 Besòs Mar. Carpooling desde Madrid (15–20€), Valencia (10–14€), Zaragoza (8–12€). Desde 8€/asiento, sin comisión.`,
    keywords: `como llegar primavera sound ${YEAR}, primavera sound transporte, primavera sound metro barcelona, primavera sound carpooling madrid`,
  },
  "vina-rock": {
    title: `Cómo llegar a Viña Rock ${YEAR}: Bus lanzadera y carpooling | Villarrobledo | ConcertRide`,
    description: `Viña Rock ${YEAR} La Pulgosa, Villarrobledo (Albacete): bus lanzadera oficial desde Albacete (40 min). Carpooling desde Madrid (6–9€), Valencia (6–9€), Alicante (5–8€). Sin comisión.`,
    keywords: `como llegar viña rock ${YEAR}, viña rock transporte, viña rock bus, viña rock autobús, buses viña rock, viña rock carpooling, autobus viña rock, viña rock como llegar, viña rock localización`,
  },
  "cala-mijas": {
    title: `Cómo llegar a Cala Mijas Festival ${YEAR}: Transporte, carpooling | Mijas | ConcertRide`,
    description: `Cala Mijas Fest ${YEAR} Cortijo de Torres, Mijas (Málaga): sin shuttle oficial. Carpooling desde Málaga (3–6€), Fuengirola (3–5€), Sevilla (6–9€), Madrid (14–20€). Sin comisión.`,
    keywords: `como llegar cala mijas ${YEAR}, cala mijas transporte, cala mijas carpooling, cala mijas festival málaga, cortijo de torres cómo llegar`,
  },
  "resurrection-fest": {
    title: `Cómo llegar a Resurrection Fest ${YEAR}: Carpooling y transporte | Viveiro | ConcertRide`,
    description: `Resurrection Fest ${YEAR} Viveiro (Lugo): carpooling desde A Coruña (4–7€), Vigo (6–9€), Santiago (6–9€), Madrid (16–22€). Sin autobús nocturno — el carpooling es la opción principal.`,
    keywords: `como llegar resurrection fest ${YEAR}, resurrection fest transporte, resurrection fest viajes, resurrection fest carpooling, resurrection fest viveiro como llegar`,
  },
  "zevra-festival": {
    title: `Cómo llegar a Zevra Festival ${YEAR}: Metro, bus y carpooling | Valencia | ConcertRide`,
    description: `Zevra Festival ${YEAR} La Marina Valencia: metro L4 La Marina, bus EMT. Carpooling desde Madrid (16–22€), Barcelona (14–20€), Alicante (8–12€). Sin comisión.`,
    keywords: `como llegar zevra festival ${YEAR}, zevra festival bus horarios, zevra festival metro, zevra festival transporte, zevra festival valencia carpooling`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE PAGE TITLE IMPROVEMENTS
// ─────────────────────────────────────────────────────────────────────────────

export const ROUTE_SEO_IMPROVEMENTS: Record<string, { title: string; keywords?: string }> = {
  "madrid-arenal-sound": {
    title: `Carpooling Madrid → Arenal Sound ${YEAR}: Desde 12€ | 460 km | ConcertRide`,
    keywords: `carpooling madrid arenal sound, viaje compartido madrid burriana, como llegar arenal sound desde madrid`,
  },
  "madrid-bbk-live": {
    title: `Carpooling Madrid → BBK Live Bilbao ${YEAR}: Desde 11€ | 395 km | ConcertRide`,
    keywords: `carpooling madrid bbk live, viaje compartido madrid bilbao, como llegar bbk live desde madrid`,
  },
  "madrid-primavera-sound": {
    title: `Carpooling Madrid → Primavera Sound Barcelona ${YEAR}: Desde 15€ | 620 km | ConcertRide`,
    keywords: `carpooling madrid barcelona primavera sound, viaje compartido madrid barcelona festival`,
  },
  "barcelona-mad-cool": {
    title: `Carpooling Barcelona → Mad Cool Madrid ${YEAR}: Desde 15€ | 620 km | ConcertRide`,
    keywords: `carpooling barcelona madrid mad cool, viaje compartido barcelona madrid festival`,
  },
  "valencia-arenal-sound": {
    title: `Carpooling Valencia → Arenal Sound Burriana ${YEAR}: Desde 8€ | 55 km | ConcertRide`,
    keywords: `carpooling valencia arenal sound, viaje compartido valencia burriana`,
  },
};

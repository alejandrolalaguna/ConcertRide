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
    title: `Viña Rock ${YEAR} + Cómo llegar: Carpooling desde 6€ | ConcertRide`,
    description: `Viña Rock Puerto de Santa María ${YEAR} (11–13 ago): viajes compartidos desde Sevilla (85 km, 6–9€), Málaga (165 km, 10–13€), Alicante (165 km, 10–13€). Conductores verificados, sin comisión.`,
    keywords: `viña rock ${YEAR}, viña rock buses, viña rock carpooling, como llegar viña rock, transporte viña rock, viaje compartido viña rock, viña rock desde sevilla`,
  },
  "arenal-sound": {
    title: `Arenal Sound ${YEAR} + Transporte: Carpooling desde 8€ | Burriana | ConcertRide`,
    description: `Arenal Sound Burriana (Valencia) ${YEAR} (10–12 ago): carpooling desde Madrid (270 km, 15–20€), Barcelona (300 km, 18–22€), Valencia (55 km, 8–11€). Conductores verificados, sin comisión.`,
    keywords: `arenal sound carpooling, como llegar arenal sound, transporte arenal sound, autobús arenal sound, viaje compartido burriana, arenal sound desde madrid`,
  },
  "mad-cool": {
    title: `Mad Cool ${YEAR} Madrid + Cómo llegar: Carpooling desde 4€ | ConcertRide`,
    description: `Mad Cool Festival IFEMA Madrid ${YEAR} (10–12 julio): carpooling desde toda España. Barcelona (625 km, 22–28€), Valencia (315 km, 12–16€), Sevilla (530 km, 18–24€). Desde 4€/asiento, sin comisión.`,
    keywords: `mad cool ${YEAR}, mad cool madrid carpooling, como llegar mad cool, transporte mad cool, viaje compartido mad cool, carpooling madrid ifema`,
  },
  "bbk-live": {
    title: `BBK Live ${YEAR} Bilbao + Cómo llegar: Carpooling desde 5€ | Kobetamendi | ConcertRide`,
    description: `BBK Live Kobetamendi Bilbao (9–11 julio): carpooling desde Madrid (395 km, 11–16€), Donostia (100 km, 4–7€), Vitoria (65 km, 3–6€), Santander (90 km, 5–8€). Sin comisión.`,
    keywords: `bbk live ${YEAR}, bbk live carpooling, como llegar bbk live, transporte bbk live, autobús bbk live bilbao, viaje compartido kobetamendi`,
  },
  "primavera-sound": {
    title: `Primavera Sound ${YEAR} Barcelona + Cómo ir: Carpooling desde 14€ | ConcertRide`,
    description: `Primavera Sound Parc del Fòrum Barcelona (28 may–1 jun): carpooling desde Madrid (625 km, 22–28€), Valencia (315 km, 14–18€), Zaragoza (300 km, 12–16€). Conductores verificados, sin comisión.`,
    keywords: `primavera sound ${YEAR}, primavera sound carpooling, como llegar primavera sound barcelona, transporte primavera sound, viaje compartido barcelona fòrum`,
  },
  "sonar": {
    title: `Sónar Barcelona ${YEAR} + Cómo llegar: Carpooling desde 16€ | Fira Montjuïc | ConcertRide`,
    description: `Sónar Festival Fira Montjuïc Barcelona (18–20 jun): carpooling desde Madrid (625 km, 22–28€), Valencia (315 km, 14–18€). Desde 16€/asiento, sin comisión. Electrónica, house, techno.`,
    keywords: `sonar barcelona ${YEAR}, sonar carpooling, como llegar sonar festival, transporte sonar barcelona, viaje compartido sonar fira montjuïc`,
  },
  "resurrection-fest": {
    title: `Resurrection Fest ${YEAR} Viveiro + Cómo llegar: Metal, carpooling desde 8€ | ConcertRide`,
    description: `Resurrection Fest Viveiro Galicia (agosto): carpooling desde A Coruña (100 km, 8–12€), Vigo (200 km, 12–16€), Madrid (600 km, 20–28€). Metal, punk, rock. Sin comisión.`,
    keywords: `resurrection fest ${YEAR}, resurrection fest viveiro carpooling, como llegar resurrection fest, transporte metal festival, viaje compartido resurrection fest`,
  },
  "cala-mijas": {
    title: `Cala Mijas Festival ${YEAR} + Cómo llegar: Carpooling desde 6€ | Mijas | ConcertRide`,
    description: `Cala Mijas Fest Cortijo de Torres Mijas ${YEAR} (2–4 octubre): carpooling desde Sevilla (200 km, 6–9€), Málaga (60 km, 3–6€), Granada (170 km, 8–11€). Sin comisión.`,
    keywords: `cala mijas festival ${YEAR}, cala mijas carpooling, como llegar cala mijas, transporte cala mijas mijas, viaje compartido cortijo torres`,
  },
  "azkena-rock": {
    title: `Azkena Rock Festival ${YEAR} Vitoria + Transporte: Carpooling desde 5€ | ConcertRide`,
    description: `Azkena Rock Mendizabala Vitoria-Gasteiz (junio): carpooling desde Bilbao (65 km, 3–6€), Donostia (100 km, 5–8€), Pamplona (95 km, 4–7€). Rock alternativo, punk. Sin comisión.`,
    keywords: `azkena rock ${YEAR}, azkena rock carpooling, como llegar azkena rock vitoria, transporte azkena rock, viaje compartido mendizabala`,
  },
  "o-son-do-camiño": {
    title: `O Son do Camiño ${YEAR} Santiago + Cómo llegar: Carpooling desde 8€ | 90.000+ | ConcertRide`,
    description: `O Son do Camiño Monte do Gozo Santiago (18–20 junio): carpooling desde A Coruña (85 km, 8–12€), Vigo (90 km, 8–12€), Madrid (600 km, 20–28€). 90.000+ personas. Sin comisión.`,
    keywords: `o son do camiño ${YEAR}, o son do camiño santiago carpooling, como llegar o son do camiño, transporte monte do gozo, viaje compartido santiago festival`,
  },
  "low-festival": {
    title: `Low Festival ${YEAR} Benidorm + Cómo ir: Carpooling desde 5€ | ConcertRide`,
    description: `Low Festival Benidorm ${YEAR} (agosto): carpooling desde Alicante (45 km, 5–8€), Valencia (100 km, 10–13€), Madrid (420 km, 15–20€). Indie, pop, rock. Sin comisión.`,
    keywords: `low festival benidorm ${YEAR}, low festival carpooling, como llegar low festival, transporte benidorm festival, viaje compartido low festival`,
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
    title: `Cómo llegar a Arenal Sound ${YEAR}: Transporte, bus, carpooling | Burriana | ConcertRide`,
    description: `Guía completa Arenal Sound ${YEAR} Burriana: distancias desde Madrid (270 km), Barcelona (300 km), Valencia (55 km). Carpooling desde 8€, autobús, tren. Sin comisión.`,
  },
  "bbk-live": {
    title: `Cómo llegar a BBK Live ${YEAR}: Transporte, autobús, carpooling | Bilbao | ConcertRide`,
    description: `BBK Live ${YEAR} Kobetamendi Bilbao: guía transporte desde Madrid (395 km), Donostia (100 km), Vitoria (65 km). Carpooling desde 5€/asiento, sin comisión.`,
  },
  "mad-cool": {
    title: `Cómo ir a Mad Cool ${YEAR}: Transporte IFEMA Madrid, carpooling | ConcertRide`,
    description: `Mad Cool Festival ${YEAR} IFEMA Madrid: distancias y transporte desde Barcelona (625 km), Valencia (315 km), Sevilla (530 km). Carpooling desde 4€/asiento.`,
  },
  "primavera-sound": {
    title: `Cómo llegar a Primavera Sound Barcelona ${YEAR}: Transporte, carpooling | ConcertRide`,
    description: `Primavera Sound Barcelona ${YEAR} Parc del Fòrum: cómo ir desde Madrid (625 km), Valencia (315 km), Zaragoza (300 km). Carpooling desde 14€/asiento sin comisión.`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE PAGE TITLE IMPROVEMENTS
// ─────────────────────────────────────────────────────────────────────────────

export const ROUTE_SEO_IMPROVEMENTS: Record<string, { title: string; keywords?: string }> = {
  "madrid-arenal-sound": {
    title: `Carpooling Madrid → Arenal Sound ${YEAR}: Desde 11€ | 270 km | ConcertRide`,
    keywords: `carpooling madrid arenal sound, viaje compartido madrid burriana, como llegar arenal sound desde madrid`,
  },
  "madrid-bbk-live": {
    title: `Carpooling Madrid → BBK Live Bilbao ${YEAR}: Desde 11€ | 395 km | ConcertRide`,
    keywords: `carpooling madrid bbk live, viaje compartido madrid bilbao, como llegar bbk live desde madrid`,
  },
  "madrid-primavera-sound": {
    title: `Carpooling Madrid → Primavera Sound Barcelona ${YEAR}: Desde 22€ | 625 km | ConcertRide`,
    keywords: `carpooling madrid barcelona primavera sound, viaje compartido madrid barcelona festival`,
  },
  "barcelona-mad-cool": {
    title: `Carpooling Barcelona → Mad Cool Madrid ${YEAR}: Desde 22€ | 625 km | ConcertRide`,
    keywords: `carpooling barcelona madrid mad cool, viaje compartido barcelona madrid festival`,
  },
  "valencia-arenal-sound": {
    title: `Carpooling Valencia → Arenal Sound Burriana ${YEAR}: Desde 8€ | 55 km | ConcertRide`,
    keywords: `carpooling valencia arenal sound, viaje compartido valencia burriana`,
  },
};

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
    title: `Viña Rock ${YEAR}: Buses y carpooling desde 3€ — Villarrobledo | ConcertRide`,
    description: `Viña Rock ${YEAR}, La Pulgosa Villarrobledo (Albacete). Autobús oficial desde Albacete (8–12€). Carpooling desde Madrid (6–9€), Valencia (6–9€), Alicante (5–8€). Buses viñarock y lanzadera. Sin comisión.`,
    keywords: `viña rock ${YEAR}, viña rock buses, autobuses viñarock, autobus viña rock, bus viñarock, buses viñarock, bus viña rock, buses viña rock, como llegar viña rock, viña rock como llegar, transporte viña rock, viaje compartido viña rock, viña rock desde madrid, viña rock autobús, viñarock buses, viña rock localización, viña rock horarios, viña rock transporte`,
  },
  "arenal-sound": {
    title: `Arenal Sound ${YEAR}: Autobús Castellón–Burriana, carpooling desde 3€ | ConcertRide`,
    description: `Arenal Sound ${YEAR}, Playa de Burriana (Castellón). Autobús lanzadera Castellón→Burriana (5–8€, 20 min). Tren Cercanías Valencia–Castellón (45 min). Carpooling desde Valencia (3–6€), Castellón (3–5€), Madrid (12–17€), Barcelona (8–12€). Sin comisión.`,
    keywords: `arenal sound ${YEAR}, autobus castellon burriana arenal sound, autobuses castellon burriana arenal sound, bus burriana arenal sound, arenal sound como llegar, como ir al arenal sound, arenal sound localización, arenal sound tren, tren arenal sound, arenal sound bus, arenal sound autobuses, bus arenal sound, buses arenal sound, arenal sound carpooling, viaje compartido burriana arenal sound, arenal sound desde madrid`,
  },
  "mad-cool": {
    title: `Mad Cool ${YEAR} Madrid — Cómo llegar: Metro L8, carpooling desde 4€ | ConcertRide`,
    description: `Mad Cool ${YEAR}, IFEMA Madrid (9–11 jul). Metro L8 → Feria de Madrid (25 min desde Sol). Carpooling desde Barcelona (15–20€), Valencia (10–14€), Zaragoza (9–13€). Mad Cool es en Madrid (no en Barcelona). Sin comisión.`,
    keywords: `mad cool ${YEAR}, como llegar al mad cool ${YEAR}, mad cool como llegar, mad cool madrid carpooling, mad cool transporte, como ir mad cool, mad cool metro, mad cool ifema, mad cool barcelona, viaje compartido mad cool, carpooling madrid ifema`,
  },
  "bbk-live": {
    title: `BBK Live ${YEAR} Bilbao — Carpooling desde 3€ | ConcertRide`,
    description: `BBK Live ${YEAR}, Kobetamendi Bilbao. Carpooling desde Madrid (11–16€), Donostia (4–7€), Vitoria (3–6€), Santander (5–8€). Lanzadera gratuita incluida. Sin comisión.`,
    keywords: `bbk live ${YEAR}, bbk live carpooling, como llegar bbk live, transporte bbk live, autobús bbk live bilbao, viaje compartido kobetamendi`,
  },
  "primavera-sound": {
    title: `Primavera Sound ${YEAR} — Carpooling desde 8€ | ConcertRide`,
    description: `Primavera Sound ${YEAR}, Parc del Fòrum Barcelona. Carpooling desde Madrid (15–20€), Valencia (10–14€), Zaragoza (8–12€). Conductores verificados, sin comisión.`,
    keywords: `primavera sound ${YEAR}, primavera sound carpooling, como llegar primavera sound barcelona, transporte primavera sound, viaje compartido barcelona fòrum`,
  },
  "resurrection-fest": {
    title: `Resurrection Fest ${YEAR} — Carpooling desde 4€ | ConcertRide`,
    description: `Resurrection Fest ${YEAR}, Viveiro (Galicia). Carpooling desde A Coruña (4–7€), Vigo (6–9€), Madrid (16–22€). Metal y punk. Sin comisión de plataforma.`,
    keywords: `resurrection fest ${YEAR}, resurrection fest viveiro carpooling, como llegar resurrection fest, transporte metal festival, viaje compartido resurrection fest`,
  },
  "cala-mijas": {
    title: `Cala Mijas Festival ${YEAR} Málaga — Carpooling desde 3€ | ConcertRide`,
    description: `Cala Mijas Festival ${YEAR} (también: La Cala Festival, Mijas Festival), Cortijo de Torres, Mijas (Málaga). Carpooling desde Málaga (3–5€), Marbella (3–6€), Sevilla (6–9€), Granada (8–11€), Madrid (14–20€). Sin comisión.`,
    keywords: `cala mijas festival ${YEAR}, cala mijas ${YEAR}, mijas festival ${YEAR}, la cala festival ${YEAR}, cala mijas carpooling, como llegar cala mijas, transporte cala mijas, cala mijas festival málaga, cortijo de torres mijas, viaje compartido cala mijas, cala mijas desde málaga, cala de mijas festival`,
  },
  "o-son-do-camiño": {
    title: `O Son do Camiño ${YEAR} — Carpooling desde 3€ | ConcertRide`,
    description: `O Son do Camiño ${YEAR}, Monte do Gozo, Santiago. Carpooling desde A Coruña (3–6€), Vigo (4–7€), Madrid (15–20€). 90.000+ asistentes. Sin comisión.`,
    keywords: `o son do camiño ${YEAR}, o son do camiño santiago carpooling, como llegar o son do camiño, transporte monte do gozo, viaje compartido santiago festival`,
  },
  "low-festival": {
    title: `Low Festival ${YEAR} — Carpooling desde 5€ | ConcertRide`,
    description: `Low Festival ${YEAR}, Benidorm (Alicante). Carpooling desde Alicante (5–8€), Valencia (10–13€), Madrid (15–20€). Indie, pop, rock. Sin comisión.`,
    keywords: `low festival benidorm ${YEAR}, low festival carpooling, como llegar low festival, transporte benidorm festival, viaje compartido low festival`,
  },
  "zevra-festival": {
    title: `Zevra Festival ${YEAR} Valencia: horarios, bus Metro L4 y carpooling | ConcertRide`,
    description: `Zevra Festival ${YEAR}, La Marina de Valencia. Horarios: apertura 19h, cabezas de cartel 23h–01h. Metro L4 (Marítim-Serreria, 5 min). Bus EMT 19/95. Carpooling desde Madrid (10–14€), Alicante (5–8€). Sin comisión.`,
    keywords: `zevra festival ${YEAR}, zevra horarios, zevra festival horarios, zevra festival bus, zevra festival valencia, zevra festival donde es, zevra festival como llegar, zevra festival transporte, zevra festival metro, zevra festival carpooling, como llegar zevra festival`,
  },
  "fib": {
    title: `FIB Benicàssim ${YEAR} — Carpooling desde 4€ | ConcertRide`,
    description: `FIB ${YEAR}, Benicàssim (Castellón). Tren Cercanías Castellón–Benicàssim (5 min). Carpooling desde Valencia (4–7€), Madrid (10–14€), Barcelona (8–12€). Sin comisión.`,
    keywords: `fib ${YEAR}, fib benicassim ${YEAR}, fib benicàssim como llegar, fib festival tren, autobús fib, fib carpooling, festival internacional benicassim, fib transporte, como ir fib`,
  },
  "sonar": {
    title: `Sónar ${YEAR} Barcelona — Carpooling y Metro L1 | ConcertRide`,
    description: `Sónar ${YEAR}, Fira Montjuïc Barcelona. Metro L1 Espanya. Carpooling desde Madrid (14–22€), Valencia (10–14€), Zaragoza (8–12€). Electrónica. Sin comisión.`,
    keywords: `sonar ${YEAR}, sonar barcelona ${YEAR}, sonar como llegar, sonar barcelona metro, sonar festival transporte, sonar carpooling, como llegar sonar, sonar fira montjuic`,
  },
  "sonorama-ribera": {
    title: `Sonorama Ribera ${YEAR} — Carpooling desde 3€ | ConcertRide`,
    description: `Sonorama Ribera ${YEAR}, Aranda de Duero (Burgos). Carpooling desde Madrid (5–8€), Burgos (3–6€), Valladolid (4–7€). Bus La Sepulvedana (10–15€). Sin comisión.`,
    keywords: `sonorama ribera ${YEAR}, sonorama aranda de duero, sonorama ${YEAR}, como llegar sonorama ribera, transporte sonorama ribera, bus sonorama ribera, sonorama ribera carpooling, sonorama ribera desde madrid, sonorama ribera burgos`,
  },
  "medusa-festival": {
    title: `Medusa Festival ${YEAR} — Carpooling desde 3€ | ConcertRide`,
    description: `Medusa Festival ${YEAR}, Playa de Cullera (Valencia). Lanzadera oficial. Carpooling desde Valencia (3–5€), Alicante (5–8€), Madrid (15–20€). Sin comisión.`,
    keywords: `medusa festival ${YEAR}, medusa festival cullera, como llegar medusa festival, medusa festival carpooling, transporte medusa festival, medusa festival desde valencia, medusa festival lanzadera`,
  },
  "cruilla": {
    title: `Cruïlla ${YEAR} — Carpooling desde 8€ + Metro L4 | ConcertRide`,
    description: `Cruïlla ${YEAR}, Parc del Fòrum Barcelona. Metro L4 Besòs Mar. Carpooling desde Madrid (15–20€), Valencia (10–14€), Zaragoza (8–12€). Sin comisión.`,
    keywords: `cruilla barcelona ${YEAR}, cruilla festival ${YEAR}, como llegar cruilla barcelona, cruilla metro, transporte cruilla, cruilla carpooling`,
  },
  "tomavistas": {
    title: `Tomavistas ${YEAR} Madrid — Carpooling desde 9€ | ConcertRide`,
    description: `Tomavistas ${YEAR}, Jardines del Buen Retiro, Madrid. Metro L2 Retiro / L9 Ibiza. Carpooling desde Barcelona (15–20€), Valencia (10–14€), Zaragoza (9–13€). Sin comisión.`,
    keywords: `tomavistas ${YEAR}, tomavistas madrid ${YEAR}, como llegar tomavistas, tomavistas metro retiro, transporte tomavistas, tomavistas carpooling`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CITY TITLE/DESCRIPTION IMPROVEMENTS (extends existing cityLandings)
// ─────────────────────────────────────────────────────────────────────────────

export const CITY_SEO_IMPROVEMENTS: Record<string, { title: string; description: string; keywords?: string }> = {
  sevilla: {
    title: `Conciertos en Sevilla ${YEAR}–${NEXT_YEAR}: La Cartuja, FIBES y festivales | ConcertRide`,
    description: `Conciertos en Sevilla ${YEAR}: La Cartuja (60.000 plazas), FIBES (9.500), Interestelar (40.000), Icónica Fest (Plaza España). Carpooling sin comisión desde Madrid, Málaga, Cádiz. Desde 4 €/asiento.`,
    keywords: `conciertos en Sevilla ${YEAR}, conciertos Sevilla ${NEXT_YEAR}, próximos conciertos Sevilla, conciertos musica sevilla, La Cartuja Sevilla conciertos, FIBES Sevilla conciertos, Interestelar Sevilla, carpooling Sevilla festivales, viaje compartido Sevilla concierto`,
  },
  donostia: {
    title: `Conciertos Donostia–San Sebastián ${YEAR}: Jazzaldia + Carpooling | ConcertRide`,
    description: `Conciertos en Donostia–San Sebastián ${YEAR}: Jazzaldia (julio), Donostia Arena, Kursaal. Carpooling a BBK Live (100 km, 4–7€), Azkena Rock (100 km, 4–7€) sin comisión.`,
    keywords: `conciertos Donostia ${YEAR}, conciertos San Sebastián, Jazzaldia ${YEAR}, conciertos en donostia, como llegar concierto donostia, carpooling Jazzaldia`,
  },
  alicante: {
    title: `Conciertos Plaza Toros Alicante ${YEAR}: agenda y carpooling | ConcertRide`,
    description: `Conciertos en Plaza de Toros de Alicante ${YEAR}: agenda veraniega, ADDA y Pitiu Rochel. Carpooling a Low Festival Benidorm (45 km, 3–5€), Arenal Sound (115 km, 4–7€), Viña Rock (165 km, 5–8€) sin comisión.`,
    keywords: `conciertos Plaza de Toros Alicante ${YEAR}, conciertos plaza toros alicante, conciertos alicante ${YEAR}, conciertos en Alicante, próximos conciertos Alicante, carpooling Alicante festivales, viaje compartido Alicante Low Festival`,
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
  pamplona: {
    title: `Conciertos Pamplona ${YEAR}: Navarra Arena + Carpooling a BBK Live | ConcertRide`,
    description: `Conciertos en Pamplona ${YEAR}: Navarra Arena, Anaitasuna. Carpooling a BBK Live (155 km, 5–8€), Azkena Rock (95 km, 4–7€), Mad Cool Madrid (390 km, 11–16€) sin comisión.`,
    keywords: `conciertos Pamplona ${YEAR}, conciertos en Pamplona, Navarra Arena conciertos, carpooling Pamplona festivales, viaje compartido Pamplona`,
  },
  "a-coruna": {
    title: `Conciertos A Coruña ${YEAR}: Resurrection Fest + Carpooling | ConcertRide`,
    description: `Conciertos en A Coruña ${YEAR}: Coliseum, Palexco. Carpooling a Resurrection Fest Viveiro (100 km, 4–7€) y O Son do Camiño Santiago (85 km, 3–6€) sin comisión.`,
    keywords: `conciertos A Coruña ${YEAR}, conciertos en A Coruña, carpooling A Coruña Resurrection Fest, viaje compartido A Coruña`,
  },
  vigo: {
    title: `Conciertos Vigo ${YEAR}: Resurrection Fest + O Son do Camiño | ConcertRide`,
    description: `Conciertos en Vigo ${YEAR}: Mar de Vigo, Pabellón Multiusos. Carpooling a Resurrection Fest (200 km, 6–9€) y O Son do Camiño en Santiago (90 km, 4–7€) sin comisión.`,
    keywords: `conciertos Vigo ${YEAR}, conciertos en Vigo, carpooling Vigo festivales, viaje compartido Vigo Resurrection Fest`,
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
  madrid: {
    title: `Conciertos Madrid ${YEAR}: Mad Cool, Tomavistas, WiZink + Carpooling | ConcertRide`,
    description: `Conciertos en Madrid ${YEAR}: Mad Cool (IFEMA, julio), Tomavistas (Retiro, mayo), WiZink Center, Caja Mágica, Palacio Vistalegre. Carpooling sin comisión desde Barcelona (22€), Valencia (14€), Zaragoza (13€), Bilbao (16€).`,
    keywords: `conciertos Madrid ${YEAR}, conciertos en Madrid, Mad Cool Madrid, Tomavistas Madrid, WiZink Center, carpooling Madrid festivales, viaje compartido Madrid concierto, próximos conciertos Madrid`,
  },
  valladolid: {
    title: `Conciertos Valladolid ${YEAR}: Carpooling a Sonorama, Mad Cool | ConcertRide`,
    description: `Conciertos en Valladolid ${YEAR}: Sala Porta Caeli, Auditorio Miguel Delibes. Carpooling a Sonorama Ribera Aranda de Duero (60 km, 4–7€), Mad Cool Madrid (195 km, 6–10€), BBK Live Bilbao (290 km, 8–13€) sin comisión.`,
    keywords: `conciertos Valladolid ${YEAR}, conciertos en Valladolid, próximos conciertos Valladolid, carpooling Valladolid festivales, viaje compartido Valladolid Sonorama, Valladolid Mad Cool carpooling`,
  },
  burgos: {
    title: `Conciertos Burgos ${YEAR}: Sonorama Ribera + Carpooling | ConcertRide`,
    description: `Conciertos en Burgos ${YEAR}: Coliseum, Teatro Principal. Carpooling a Sonorama Ribera Aranda de Duero (75 km, 3–6€), Mad Cool Madrid (240 km, 7–11€), BBK Live Bilbao (160 km, 5–9€) sin comisión. Burgos es el punto de partida clave para llegar a Sonorama.`,
    keywords: `conciertos Burgos ${YEAR}, conciertos en Burgos, Sonorama Ribera Burgos, carpooling Burgos Sonorama, viaje compartido Burgos Aranda de Duero, Burgos festivales carpooling`,
  },
  salamanca: {
    title: `Conciertos Salamanca ${YEAR}: Carpooling a Mad Cool, Viña Rock | ConcertRide`,
    description: `Conciertos en Salamanca ${YEAR}: Multiusos Sánchez Paraíso, Palacio de Congresos. Carpooling a Mad Cool Madrid (210 km, 7–11€), Viña Rock Villarrobledo (220 km, 7–11€), BBK Live Bilbao (380 km, 11–16€) sin comisión.`,
    keywords: `conciertos Salamanca ${YEAR}, conciertos en Salamanca, próximos conciertos Salamanca, carpooling Salamanca Mad Cool, viaje compartido Salamanca festivales, Salamanca Viña Rock carpooling`,
  },
  logrono: {
    title: `Conciertos Logroño ${YEAR}: Carpooling a BBK Live, Azkena Rock | ConcertRide`,
    description: `Conciertos en Logroño ${YEAR}: Palacio de los Deportes de La Rioja, Berceo. Carpooling a BBK Live Bilbao (170 km, 5–9€), Azkena Rock Vitoria (115 km, 4–7€), Sonorama Ribera (140 km, 5–8€), Mad Cool Madrid (325 km, 9–13€) sin comisión.`,
    keywords: `conciertos Logroño ${YEAR}, conciertos en Logroño, conciertos La Rioja, carpooling Logroño BBK Live, viaje compartido Logroño Bilbao, Logroño festivales carpooling`,
  },
  santander: {
    title: `Conciertos Santander ${YEAR}: BBK Live + Carpooling al País Vasco | ConcertRide`,
    description: `Conciertos en Santander ${YEAR}: Palacio de los Deportes, Arena Santander. Carpooling a BBK Live Bilbao (100 km, 4–7€), Azkena Rock Vitoria (140 km, 5–8€), Mad Cool Madrid (395 km, 11–16€) sin comisión. Santander→Bilbao en coche compartido, la mejor opción para BBK Live.`,
    keywords: `conciertos Santander ${YEAR}, conciertos en Santander, carpooling Santander BBK Live, viaje compartido Santander Bilbao, Santander festivales carpooling, como llegar BBK Live desde Santander`,
  },
  "vitoria-gasteiz": {
    title: `Conciertos Vitoria-Gasteiz ${YEAR}: Azkena Rock + Carpooling | ConcertRide`,
    description: `Conciertos en Vitoria-Gasteiz ${YEAR}: Fernando Buesa Arena, Mendizabala (Azkena Rock Festival, junio). Carpooling a BBK Live Bilbao (65 km, 3–6€), Mad Cool Madrid (350 km, 10–14€), Donostia (100 km, 4–7€) sin comisión.`,
    keywords: `conciertos Vitoria-Gasteiz ${YEAR}, conciertos Vitoria ${YEAR}, Azkena Rock Festival, conciertos en Vitoria, carpooling Vitoria BBK Live, viaje compartido Vitoria Bilbao, Azkena Rock carpooling`,
  },
  granada: {
    title: `Conciertos Granada ${YEAR}: Carpooling a Cala Mijas, Arenal Sound | ConcertRide`,
    description: `Conciertos en Granada ${YEAR}: Palacio de los Deportes, Palacio de Exposiciones. Carpooling a Cala Mijas Málaga (125 km, 5–8€), Arenal Sound Burriana (380 km, 11–16€), Mad Cool Madrid (420 km, 12–17€) sin comisión.`,
    keywords: `conciertos Granada ${YEAR}, conciertos en Granada, próximos conciertos Granada, carpooling Granada Málaga festivales, viaje compartido Granada Cala Mijas, Granada carpooling festival`,
  },
  cordoba: {
    title: `Conciertos Córdoba ${YEAR}: Carpooling a La Cartuja, Mad Cool | ConcertRide`,
    description: `Conciertos en Córdoba ${YEAR}: Palacio de los Deportes, Gran Teatro. Carpooling a Estadio de La Cartuja Sevilla (135 km, 5–8€), Mad Cool Madrid (400 km, 11–16€), Cala Mijas Málaga (175 km, 6–10€) sin comisión.`,
    keywords: `conciertos Córdoba ${YEAR}, conciertos en Córdoba, próximos conciertos Córdoba, carpooling Córdoba Sevilla festivales, viaje compartido Córdoba La Cartuja, Córdoba carpooling`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// "CÓMO LLEGAR" PAGE DESCRIPTIONS (used by HowToGetTherePage.tsx)
// ─────────────────────────────────────────────────────────────────────────────

export const HOW_TO_GET_THERE_SEO: Record<string, { title: string; description: string; keywords?: string }> = {
  "arenal-sound": {
    title: `Cómo llegar a Arenal Sound ${YEAR}: Bus, tren y carpooling | ConcertRide`,
    description: `Guía completa Arenal Sound ${YEAR} Burriana (Castellón): bus lanzadera desde Castellón, tren Cercanías C6 Valencia–Castellón (45 min). Carpooling desde Valencia (3–6€), Madrid (12–17€). Sin comisión.`,
    keywords: `como llegar arenal sound ${YEAR}, arenal sound transporte, autobus castellon burriana arenal sound, tren arenal sound, arenal sound bus, arenal sound localización`,
  },
  "bbk-live": {
    title: `Cómo llegar a BBK Live ${YEAR}: Lanzadera, autobús, carpooling | ConcertRide`,
    description: `BBK Live ${YEAR} Kobetamendi Bilbao: lanzadera gratuita desde Plaza Moyúa incluida en la entrada. Carpooling desde Madrid (11–16€), Donostia (4–7€), Vitoria (3–6€). Sin comisión.`,
    keywords: `como llegar bbk live ${YEAR}, bbk live transporte, bbk live lanzadera, bbk live bus, bbk live como llegar bilbao, carpooling bbk live`,
  },
  "mad-cool": {
    title: `Cómo ir a Mad Cool ${YEAR}: Metro, bus y carpooling | ConcertRide`,
    description: `Mad Cool Festival ${YEAR} IFEMA Madrid: metro L8 hasta Feria de Madrid. Carpooling desde Barcelona (15–20€), Valencia (10–14€), Zaragoza (9–13€). Sin comisión de plataforma.`,
    keywords: `como llegar mad cool ${YEAR}, mad cool transporte, mad cool metro, mad cool como llegar, mad cool ifema carpooling, mad cool desde barcelona`,
  },
  "primavera-sound": {
    title: `Cómo llegar a Primavera Sound Barcelona ${YEAR}: Metro, carpooling | ConcertRide`,
    description: `Primavera Sound Barcelona ${YEAR} Parc del Fòrum: metro L4 Besòs Mar. Carpooling desde Madrid (15–20€), Valencia (10–14€), Zaragoza (8–12€). Desde 8€/asiento, sin comisión.`,
    keywords: `como llegar primavera sound ${YEAR}, primavera sound transporte, primavera sound metro barcelona, primavera sound carpooling madrid`,
  },
  "vina-rock": {
    title: `Cómo llegar a Viña Rock ${YEAR}: Bus lanzadera y carpooling | ConcertRide`,
    description: `Viña Rock ${YEAR} La Pulgosa, Villarrobledo (Albacete): bus lanzadera oficial desde Albacete (40 min). Carpooling desde Madrid (6–9€), Valencia (6–9€), Alicante (5–8€). Sin comisión.`,
    keywords: `como llegar viña rock ${YEAR}, viña rock transporte, viña rock bus, viña rock autobús, buses viña rock, viña rock carpooling, autobus viña rock, viña rock como llegar, viña rock localización`,
  },
  "cala-mijas": {
    title: `Cómo llegar a Cala Mijas Festival ${YEAR}: Carpooling y transporte | ConcertRide`,
    description: `Cala Mijas Fest ${YEAR} Cortijo de Torres, Mijas (Málaga): sin shuttle oficial. Carpooling desde Málaga (3–6€), Fuengirola (3–5€), Sevilla (6–9€), Madrid (14–20€). Sin comisión.`,
    keywords: `como llegar cala mijas ${YEAR}, cala mijas transporte, cala mijas carpooling, cala mijas festival málaga, cortijo de torres cómo llegar`,
  },
  "resurrection-fest": {
    title: `Cómo llegar a Resurrection Fest ${YEAR}: Carpooling y transporte | ConcertRide`,
    description: `Resurrection Fest ${YEAR} Viveiro (Lugo): carpooling desde A Coruña (4–7€), Vigo (6–9€), Santiago (6–9€), Madrid (16–22€). Sin autobús nocturno — el carpooling es la opción principal.`,
    keywords: `como llegar resurrection fest ${YEAR}, resurrection fest transporte, resurrection fest viajes, resurrection fest carpooling, resurrection fest viveiro como llegar`,
  },
  "zevra-festival": {
    title: `Cómo llegar a Zevra Festival ${YEAR}: Metro, bus y carpooling | ConcertRide`,
    description: `Zevra Festival ${YEAR} La Marina Valencia: metro L4 La Marina, bus EMT. Carpooling desde Madrid (16–22€), Barcelona (14–20€), Alicante (8–12€). Sin comisión.`,
    keywords: `como llegar zevra festival ${YEAR}, zevra festival bus horarios, zevra festival metro, zevra festival transporte, zevra festival valencia carpooling`,
  },
  "sonar": {
    title: `Cómo llegar a Sónar ${YEAR}: Metro L9, shuttle y carpooling | ConcertRide`,
    description: `Sónar ${YEAR} Fira Gran Via (L'Hospitalet): metro L9 Sur parada Fira. Sónar by Day en Fira Montjuïc (metro Espanya). Carpooling desde Madrid (15–20€), Valencia (10–14€), Zaragoza (8–12€). Sin comisión.`,
    keywords: `como llegar sonar barcelona ${YEAR}, sonar metro, sonar transporte, sonar barcelona metro l9, sonar fira gran via como llegar, sonar fira montjuic, carpooling sonar`,
  },
  "fib": {
    title: `Cómo llegar al FIB Benicàssim ${YEAR}: Bus, tren y carpooling | ConcertRide`,
    description: `FIB ${YEAR} Benicàssim (Castellón): bus lanzadera desde Castellón (15 km, 15 min), tren Cercanías C6 Valencia–Castellón (45 min). Carpooling desde Valencia (3–6€), Madrid (12–17€), Barcelona (8–12€). Sin comisión.`,
    keywords: `como llegar fib benicassim ${YEAR}, fib transporte, fib bus lanzadera castellon, fib tren cercanias, fib benicassim carpooling, fib como llegar`,
  },
  "low-festival": {
    title: `Cómo llegar a Low Festival Benidorm ${YEAR}: Bus, tren y carpooling | ConcertRide`,
    description: `Low Festival Benidorm ${YEAR} (agosto): tren TRAM L9 Alicante–Benidorm. Carpooling desde Alicante (45 km, 3–6€), Valencia (100 km, 8–12€), Madrid (420 km, 14–20€). Sin comisión.`,
    keywords: `como llegar low festival benidorm ${YEAR}, low festival transporte, low festival tren, low festival bus, low festival carpooling, benidorm festival como llegar`,
  },
  "cruilla": {
    title: `Cómo llegar a Cruïlla Barcelona ${YEAR}: Metro, bus y carpooling | ConcertRide`,
    description: `Cruïlla ${YEAR} Parc del Fòrum Barcelona (julio): metro L4 Besòs Mar. Carpooling desde Madrid (15–20€), Valencia (10–14€), Zaragoza (8–12€). Sin comisión.`,
    keywords: `como llegar cruilla barcelona ${YEAR}, cruilla metro, cruilla transporte, cruilla forum carpooling, cruilla barcelona como llegar`,
  },
  "sonorama-ribera": {
    title: `Cómo llegar a Sonorama Ribera ${YEAR}: Bus, tren y carpooling | ConcertRide`,
    description: `Sonorama Ribera ${YEAR} Aranda de Duero (agosto): autobús desde Burgos, tren Renfe desde Madrid–Aranda (2h). Carpooling desde Madrid (8–12€), Burgos (3–6€), Valladolid (4–7€). Sin comisión.`,
    keywords: `como llegar sonorama ribera ${YEAR}, sonorama transporte, sonorama aranda de duero bus, sonorama tren, sonorama ribera carpooling, como ir sonorama`,
  },
  "o-son-do-camino": {
    title: `Cómo llegar a O Son do Camiño ${YEAR}: Bus, tren y carpooling | ConcertRide`,
    description: `O Son do Camiño ${YEAR} Monte do Gozo, Santiago de Compostela: autobús urbano hasta Monte do Gozo, tren AVE a Santiago. Carpooling desde A Coruña (3–6€), Vigo (4–7€), Madrid (15–20€). Sin comisión.`,
    keywords: `como llegar o son do camino ${YEAR}, o son do camiño transporte, o son do camino bus santiago, o son do camiño carpooling, monte do gozo como llegar`,
  },
  "medusa-festival": {
    title: `Cómo llegar a Medusa Festival ${YEAR}: Bus, lanzadera y carpooling | ConcertRide`,
    description: `Medusa Festival ${YEAR} Playa de Cullera (Valencia): lanzadera oficial desde Valencia. Carpooling desde Valencia (45 km, 3–5€), Alicante (90 km, 5–8€), Madrid (15–20€). Sin comisión.`,
    keywords: `como llegar medusa festival ${YEAR}, medusa festival transporte, medusa festival bus, medusa festival lanzadera, medusa festival cullera como llegar, carpooling medusa festival, medusa festival desde valencia, medusa festival desde madrid, transporte medusa festival ${YEAR}`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// VENUE PAGE TITLE/DESCRIPTION OVERRIDES
// GSC-driven: target venue-specific queries with 0-click / high-impression
// ─────────────────────────────────────────────────────────────────────────────

export const VENUE_SEO_OVERRIDES: Record<string, { title: string; description: string; keywords?: string }> = {
  "estadio-la-cartuja": {
    title: `Cómo llegar al Estadio de La Cartuja Sevilla: bus, parking y carpooling | ConcertRide`,
    description: `Estadio Olímpico de La Cartuja, Sevilla (57.000 plazas). Tranvía T1 + bus C1/C2 desde centro. Parking propio 8–12 €. Sin metro. Carpooling desde Huelva (4€), Cádiz (5€), Córdoba (5€), Málaga (7€). Sin comisión.`,
    keywords: `cómo llegar estadio la cartuja sevilla, como llegar estadio olímpico sevilla, estadio la cartuja cómo llegar, aparcamiento estadio la cartuja, parking estadio la cartuja, estadio la cartuja transporte público, bus estadio la cartuja, la cartuja sevilla como llegar, carpooling estadio la cartuja, conciertos la cartuja sevilla`,
  },
  "wizink-center": {
    title: `Cómo llegar al WiZink Center Madrid: metro, bus y carpooling | ConcertRide`,
    description: `WiZink Center, Madrid (18.000 plazas). Metro L2 Ventas / L5 El Barco. Carpooling desde Barcelona (15€), Valencia (14€), Zaragoza (9€). Sin comisión. Guía completa de transporte.`,
    keywords: `como llegar wizink center, wizink center metro, wizink center cómo llegar, mapa wizink center, wizink center transporte, como ir wizink center, carpooling wizink center madrid, conciertos wizink center`,
  },
  "palacio-vistalegre": {
    title: `Cómo llegar a Vistalegre Madrid: metro, mapa y carpooling | ConcertRide`,
    description: `Palacio Vistalegre, Madrid (15.000 plazas). Metro L5 Oporto (5 min a pie) / L3 Legazpi. Bus 60, 79, 116. Carpooling desde Barcelona (15€), Valencia (10€). Sin comisión.`,
    keywords: `vista alegre como llegar, vista alegre madrid como llegar, mapa palacio vistalegre, palacio vistalegre cómo llegar, vistalegre metro, carpooling vistalegre madrid, conciertos vistalegre`,
  },
  "ifema-madrid": {
    title: `Cómo llegar a IFEMA Madrid: metro, bus y carpooling | ConcertRide`,
    description: `IFEMA Madrid — Feria de Madrid (Metro L8 El Parque, 10 min). Carpooling a Mad Cool desde Barcelona (15€), Valencia (10€), Zaragoza (9€). Sin comisión. Guía transporte.`,
    keywords: `como llegar ifema, ifema como llegar, ifema metro, ifema mad cool transporte, carpooling ifema madrid, como ir ifema mad cool, mad cool como llegar ifema`,
  },
  "kobetamendi": {
    title: `Kobetamendi Bilbao: cómo llegar al BBK Live, lanzadera y carpooling | ConcertRide`,
    description: `Kobetamendi, Bilbao (30.000 plazas). Lanzadera gratuita BBK Live desde Plaza Moyúa. Metro L1 San Ignacio. Carpooling desde Madrid (11€), Donostia (5€), Santander (4€). Sin comisión.`,
    keywords: `kobetamendi bilbao, recinto kobetamendi, como llegar kobetamendi, kobetamendi bbk live lanzadera, kobetamendi metro, carpooling kobetamendi bilbao`,
  },
  "palau-sant-jordi": {
    title: `Cómo llegar al Palau Sant Jordi Barcelona: metro, parking y carpooling | ConcertRide`,
    description: `Palau Sant Jordi, Montjuïc Barcelona (17.000 plazas). Metro L2/L3 Paral·lel + funicular. Carpooling desde Madrid (15€), Valencia (10€), Zaragoza (8€). Sin comisión.`,
    keywords: `como llegar palau sant jordi, palau sant jordi metro, donde aparcar palau sant jordi, carpooling palau sant jordi barcelona, karol g palau sant jordi transporte, conciertos palau sant jordi`,
  },
  "parc-del-forum": {
    title: `Cómo llegar al Parc del Fòrum Barcelona: metro y carpooling | ConcertRide`,
    description: `Parc del Fòrum Barcelona (Fòrum de Cultures, 75.000 plazas). Metro L4 El Maresme / Fòrum. Bus 41, 141. Carpooling desde Madrid (15€), Valencia (10€). Sin comisión.`,
    keywords: `forum barcelona como llegar, parc del forum metro, como llegar forum barcelona, carpooling parc del forum barcelona, primavera sound cruilla transporte`,
  },
  "caja-magica": {
    title: `Cómo llegar a la Caja Mágica Madrid: metro, bus y carpooling | ConcertRide`,
    description: `Caja Mágica, Madrid (27.000 plazas). Metro L3 San Fermín–Orcasur (15 min a pie) / L12 Lusitania. Bus 128, 223. Carpooling desde Barcelona (15€), Valencia (10€). Sin comisión.`,
    keywords: `como llegar caja magica madrid, caja magica metro, carpooling caja magica madrid, conciertos caja magica`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE PAGE TITLE IMPROVEMENTS
// ─────────────────────────────────────────────────────────────────────────────

export const ROUTE_SEO_IMPROVEMENTS: Record<string, { title: string; keywords?: string }> = {
  // ── Viña Rock (top GSC queries) ─────────────────────────────────────────
  "madrid-vina-rock": {
    title: `Carpooling Madrid → Viña Rock ${YEAR}: Desde 6€ | 260 km | ConcertRide`,
    keywords: `carpooling madrid viña rock, viaje compartido madrid villarrobledo, bus madrid viña rock, como ir viña rock desde madrid, transporte madrid vina rock ${YEAR}, viñarock desde madrid`,
  },
  "valencia-vina-rock": {
    title: `Carpooling Valencia → Viña Rock ${YEAR}: Desde 6€ | 255 km | ConcertRide`,
    keywords: `carpooling valencia viña rock, viaje compartido valencia viña rock, como llegar viña rock desde valencia, transporte valencia vina rock ${YEAR}`,
  },
  "alicante-vina-rock": {
    title: `Carpooling Alicante → Viña Rock ${YEAR}: Desde 5€ | 195 km | ConcertRide`,
    keywords: `carpooling alicante viña rock, viaje compartido alicante viña rock, como ir viña rock desde alicante, bus alicante viña rock`,
  },
  "albacete-vina-rock": {
    title: `Carpooling Albacete → Viña Rock ${YEAR}: Desde 3€ | 40 km | ConcertRide`,
    keywords: `carpooling albacete viña rock, bus albacete viña rock, lanzadera albacete viña rock, viaje compartido albacete villarrobledo`,
  },
  "sevilla-vina-rock": {
    title: `Carpooling Sevilla → Viña Rock ${YEAR}: Desde 9€ | 410 km | ConcertRide`,
    keywords: `carpooling sevilla viña rock, viaje compartido sevilla viña rock, como ir viña rock desde sevilla`,
  },
  // ── Arenal Sound ────────────────────────────────────────────────────────
  "madrid-arenal-sound": {
    title: `Carpooling Madrid → Arenal Sound ${YEAR}: Desde 12€ | 460 km | ConcertRide`,
    keywords: `carpooling madrid arenal sound, viaje compartido madrid burriana, como llegar arenal sound desde madrid, bus madrid arenal sound, transporte madrid arenal sound ${YEAR}`,
  },
  "valencia-arenal-sound": {
    title: `Carpooling Valencia → Arenal Sound Burriana ${YEAR}: Desde 3€ | 65 km | ConcertRide`,
    keywords: `carpooling valencia arenal sound, viaje compartido valencia burriana, autobus castellon burriana arenal sound, como ir arenal sound desde valencia`,
  },
  "barcelona-arenal-sound": {
    title: `Carpooling Barcelona → Arenal Sound ${YEAR}: Desde 8€ | 305 km | ConcertRide`,
    keywords: `carpooling barcelona arenal sound, viaje compartido barcelona burriana, como llegar arenal sound desde barcelona`,
  },
  "zaragoza-arenal-sound": {
    title: `Carpooling Zaragoza → Arenal Sound ${YEAR}: Desde 8€ | 275 km | ConcertRide`,
    keywords: `carpooling zaragoza arenal sound, viaje compartido zaragoza arenal sound, como ir arenal sound desde zaragoza`,
  },
  "alicante-arenal-sound": {
    title: `Carpooling Alicante → Arenal Sound ${YEAR}: Desde 4€ | 115 km | ConcertRide`,
    keywords: `carpooling alicante arenal sound, viaje compartido alicante burriana arenal sound`,
  },
  // ── BBK Live ────────────────────────────────────────────────────────────
  "madrid-bbk-live": {
    title: `Carpooling Madrid → BBK Live Bilbao ${YEAR}: Desde 11€ | 395 km | ConcertRide`,
    keywords: `carpooling madrid bbk live, viaje compartido madrid bilbao, como llegar bbk live desde madrid, bus madrid bbk live`,
  },
  "donostia-bbk-live": {
    title: `Carpooling Donostia → BBK Live Bilbao ${YEAR}: Desde 4€ | 100 km | ConcertRide`,
    keywords: `carpooling donostia bbk live, viaje compartido san sebastian bilbao bbk live, como ir bbk live desde donostia`,
  },
  "santander-bbk-live": {
    title: `Carpooling Santander → BBK Live ${YEAR}: Desde 4€ | 100 km | ConcertRide`,
    keywords: `carpooling santander bbk live, viaje compartido santander bilbao bbk live, como ir bbk live desde santander, bus santander bilbao bbk live`,
  },
  "vitoria-gasteiz-bbk-live": {
    title: `Carpooling Vitoria → BBK Live Bilbao ${YEAR}: Desde 3€ | 65 km | ConcertRide`,
    keywords: `carpooling vitoria bbk live, viaje compartido vitoria bilbao bbk live, como ir bbk live desde vitoria`,
  },
  "pamplona-bbk-live": {
    title: `Carpooling Pamplona → BBK Live ${YEAR}: Desde 5€ | 155 km | ConcertRide`,
    keywords: `carpooling pamplona bbk live, viaje compartido pamplona bilbao bbk live`,
  },
  // ── Resurrection Fest ───────────────────────────────────────────────────
  "madrid-resurrection-fest": {
    title: `Carpooling Madrid → Resurrection Fest ${YEAR}: Desde 16€ | 600 km | ConcertRide`,
    keywords: `carpooling madrid resurrection fest, viaje compartido madrid viveiro resurrection fest, como ir resurrection fest desde madrid, viajes resurrection fest madrid`,
  },
  "a-coruna-resurrection-fest": {
    title: `Carpooling A Coruña → Resurrection Fest ${YEAR}: Desde 4€ | 100 km | ConcertRide`,
    keywords: `carpooling a coruña resurrection fest, viaje compartido a coruña viveiro, resurrection fest desde a coruña`,
  },
  "vigo-resurrection-fest": {
    title: `Carpooling Vigo → Resurrection Fest ${YEAR}: Desde 6€ | 200 km | ConcertRide`,
    keywords: `carpooling vigo resurrection fest, viaje compartido vigo viveiro resurrection fest`,
  },
  "bilbao-resurrection-fest": {
    title: `Carpooling Bilbao → Resurrection Fest ${YEAR}: Desde 10€ | 375 km | ConcertRide`,
    keywords: `carpooling bilbao resurrection fest, viaje compartido bilbao viveiro`,
  },
  // ── Primavera Sound / Sónar / Mad Cool ─────────────────────────────────
  "madrid-primavera-sound": {
    title: `Carpooling Madrid → Primavera Sound Barcelona ${YEAR}: Desde 15€ | 620 km | ConcertRide`,
    keywords: `carpooling madrid barcelona primavera sound, viaje compartido madrid barcelona festival, como ir primavera sound desde madrid`,
  },
  "madrid-sonar": {
    title: `Carpooling Madrid → Sónar Barcelona ${YEAR}: Desde 15€ | 620 km | ConcertRide`,
    keywords: `carpooling madrid sonar barcelona, viaje compartido madrid sonar, como ir sonar desde madrid`,
  },
  "barcelona-mad-cool": {
    title: `Carpooling Barcelona → Mad Cool Madrid ${YEAR}: Desde 15€ | 620 km | ConcertRide`,
    keywords: `carpooling barcelona madrid mad cool, viaje compartido barcelona madrid festival, como ir mad cool desde barcelona`,
  },
  "valencia-mad-cool": {
    title: `Carpooling Valencia → Mad Cool Madrid ${YEAR}: Desde 10€ | 355 km | ConcertRide`,
    keywords: `carpooling valencia mad cool, viaje compartido valencia madrid mad cool, como ir mad cool desde valencia`,
  },
  "zaragoza-mad-cool": {
    title: `Carpooling Zaragoza → Mad Cool Madrid ${YEAR}: Desde 9€ | 325 km | ConcertRide`,
    keywords: `carpooling zaragoza mad cool, viaje compartido zaragoza madrid mad cool`,
  },
  // ── Cala Mijas ──────────────────────────────────────────────────────────
  "malaga-cala-mijas": {
    title: `Carpooling Málaga → Cala Mijas Festival ${YEAR}: Desde 3€ | 60 km | ConcertRide`,
    keywords: `carpooling malaga cala mijas, viaje compartido malaga cala mijas festival, como llegar cala mijas desde malaga`,
  },
  "madrid-cala-mijas": {
    title: `Carpooling Madrid → Cala Mijas Festival ${YEAR}: Desde 14€ | 560 km | ConcertRide`,
    keywords: `carpooling madrid cala mijas festival, viaje compartido madrid cala mijas, como ir cala mijas desde madrid`,
  },
  // ── FIB Benicàssim ──────────────────────────────────────────────────────
  "madrid-fib": {
    title: `Carpooling Madrid → FIB Benicàssim ${YEAR}: Desde 12€ | 465 km | ConcertRide`,
    keywords: `carpooling madrid fib benicassim, viaje compartido madrid fib, como ir fib desde madrid, fib benicassim desde madrid`,
  },
  "barcelona-fib": {
    title: `Carpooling Barcelona → FIB Benicàssim ${YEAR}: Desde 8€ | 300 km | ConcertRide`,
    keywords: `carpooling barcelona fib benicassim, viaje compartido barcelona fib, como ir fib desde barcelona`,
  },
  "valencia-fib": {
    title: `Carpooling Valencia → FIB Benicàssim ${YEAR}: Desde 3€ | 70 km | ConcertRide`,
    keywords: `carpooling valencia fib benicassim, viaje compartido valencia fib, como ir fib desde valencia`,
  },
  // ── O Son do Camiño ─────────────────────────────────────────────────────
  "madrid-o-son-do-camino": {
    title: `Carpooling Madrid → O Son do Camiño ${YEAR}: Desde 15€ | 585 km | ConcertRide`,
    keywords: `carpooling madrid o son do camiño, viaje compartido madrid santiago festival, como ir o son do camino desde madrid`,
  },
};

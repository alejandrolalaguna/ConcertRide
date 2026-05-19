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
    title: `Viña Rock ${YEAR}: Buses, horarios y carpooling 3€ | ConcertRide`,
    description: `Viña Rock ${YEAR} (30 abr–3 may, La Pulgosa Villarrobledo): bus oficial Albacete→Villarrobledo 8–12€, lanzaderas y horarios. 0% comisión, conductores verificados.`,
    keywords: `viña rock ${YEAR}, viña rock buses, autobuses viñarock, autobus viña rock, bus viñarock, buses viñarock, bus viña rock, buses viña rock, como llegar viña rock, viña rock como llegar, transporte viña rock, viaje compartido viña rock, viña rock desde madrid, viña rock autobús, viñarock buses, viña rock localización, viña rock horarios, viña rock transporte, viña rock guia oficial, lanzadera viña rock, viña rock 2026 entradas`,
  },
  "arenal-sound": {
    title: `Arenal Sound ${YEAR}: Carpooling desde 3€ | ConcertRide`,
    description: `Arenal Sound ${YEAR} (29 jul–2 ago, Playa Burriana Castellón, 250.000 asistentes): autobuses lanzadera oficial Castellón→Burriana (5–8€, 20 min, cada 30 min).`,
    keywords: `arenal sound ${YEAR}, autobus castellon burriana arenal sound, autobuses castellon burriana arenal sound, bus burriana arenal sound, arenal sound como llegar, como ir al arenal sound, arenal sound localización, arenal sound tren, tren arenal sound, arenal sound bus, arenal sound autobuses, bus arenal sound, buses arenal sound, arenal sound carpooling, viaje compartido burriana arenal sound, arenal sound desde madrid, arenal sound guia transporte, arenal sound horarios, arenal sound entradas, arenal sound 2026 cartel, arenal sound desde alicante, arenal sound autobuses castellon`,
  },
  "mad-cool": {
    title: `Mad Cool ${YEAR} Madrid: Metro L3 + Carpooling 4€ | ConcertRide`,
    description: `Mad Cool ${YEAR} (8–11 jul, Iberdrola Music Villaverde Madrid, 80.000 pers/día): Metro L3 parada Pradolongo o Legazpi + autobús al recinto (30 min desde Sol.`,
    keywords: `mad cool ${YEAR}, como llegar al mad cool ${YEAR}, mad cool como llegar, mad cool madrid carpooling, mad cool transporte, como ir mad cool, mad cool metro, mad cool iberdrola music, mad cool villaverde, mad cool barcelona, viaje compartido mad cool, carpooling madrid mad cool, mad cool entradas, mad cool cartel, mad cool fechas, mad cool 2026 horarios, mad cool desde barcelona`,
  },
  "bbk-live": {
    title: `BBK Live ${YEAR} Bilbao · Carpooling Kobetamendi | ConcertRide`,
    description: `BBK Live ${YEAR} (9–11 jul, Kobetamendi Bilbao, 30.000 pers/día): lanzadera oficial GRATUITA desde Plaza Moyúa (Metro L1 Moyua, frecuencia 10 min, hasta.`,
    keywords: `bbk live ${YEAR}, bbk live carpooling, como llegar bbk live, transporte bbk live, autobús bbk live bilbao, viaje compartido kobetamendi, bbk live lanzadera, bbk live entradas, bbk live cartel, bbk live horarios, festival bilbao ${YEAR}, bbk live desde madrid, bbk live desde donostia`,
  },
  "primavera-sound": {
    title: `Primavera Sound ${YEAR}: Metro L4 + carpooling 8€ | ConcertRide`,
    description: `Primavera Sound ${YEAR} (28 may–1 jun, Parc del Fòrum Barcelona): Metro L4 Besòs Mar / Maresme directa al recinto (cada 3 min, ampliado hasta 02:30 días de.`,
    keywords: `primavera sound ${YEAR}, primavera sound carpooling, como llegar primavera sound barcelona, transporte primavera sound, viaje compartido barcelona fòrum, primavera sound metro, primavera sound guia transporte, primavera sound entradas, primavera sound horarios, primavera sound desde madrid, primavera sound desde valencia`,
  },
  "resurrection-fest": {
    title: `Resurrection Fest ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Resurrection Fest ${YEAR} (25–28 jun, A Gañidoira Viveiro Lugo): el festival de metal más grande del sur de Europa. 0% comisión, conductores verificados.`,
    keywords: `resurrection fest ${YEAR}, resurrection fest viveiro carpooling, como llegar resurrection fest, transporte metal festival, viaje compartido resurrection fest, resurrection fest entradas, resurrection fest desde madrid, resurrection fest desde a coruña, resurrection fest cartel, festival metal galicia, resurrection fest 2026 fechas`,
  },
  "cala-mijas": {
    title: `Cala Mijas Festival ${YEAR}: Carpooling desde 3€ | ConcertRide`,
    description: `Cala Mijas Festival ${YEAR} (2–4 oct, Cortijo de Torres Mijas Málaga): SIN shuttle oficial, sin transporte público al recinto. Carpooling sin comisión desde.`,
    keywords: `cala mijas festival ${YEAR}, cala mijas ${YEAR}, mijas festival ${YEAR}, la cala festival ${YEAR}, cala mijas carpooling, como llegar cala mijas, transporte cala mijas, cala mijas festival málaga, cortijo de torres mijas, viaje compartido cala mijas, cala mijas desde málaga, cala de mijas festival, cala mijas entradas, cala mijas cartel, cala mijas shuttle, cala mijas desde sevilla`,
  },
  "o-son-do-camino": {
    title: `O Son do Camiño ${YEAR}: Carpooling desde 3€ | ConcertRide`,
    description: `O Son do Camiño ${YEAR} (18–20 jun, Monte do Gozo Santiago, 270.000 acumulados): lanzadera GRATIS desde Santiago centro hasta el recinto. Carpooling sin.`,
    keywords: `o son do camiño ${YEAR}, o son do camino ${YEAR}, o son do camiño santiago carpooling, como llegar o son do camiño, como llegar o son do camino, transporte monte do gozo, viaje compartido santiago festival, o son do camiño desde madrid, o son do camiño desde a coruña, o son do camiño desde vigo, festival galicia ${YEAR}, festival santiago compostela ${YEAR}, o son do camino entradas, o son do camino cartel ${YEAR}, monte do gozo lanzadera`,
  },
  "low-festival": {
    title: `Low Festival ${YEAR}: Carpooling desde 3€ | ConcertRide`,
    description: `Low Festival ${YEAR} (24–26 jul, Ciudad Deportiva Guillermo Amor Benidorm, 65.000 acumulados): indie/pop/rock junto al Mediterráneo. TRAM L1.`,
    keywords: `low festival benidorm ${YEAR}, low festival carpooling, como llegar low festival, transporte benidorm festival, viaje compartido low festival, low festival entradas, low festival cartel, low festival ciudad deportiva guillermo amor, festival benidorm indie, low festival fechas`,
  },
  "zevra-festival": {
    title: `Zevra Festival ${YEAR}: Carpooling desde 3€ | ConcertRide`,
    description: `Zevra Festival ${YEAR} (La Marina de Valencia): apertura 19:00, cabezas de cartel 23:00–01:00. 0% comisión, conductores verificados.`,
    keywords: `zevra festival ${YEAR}, zevra horarios, zevra festival horarios, zevra festival bus, zevra festival valencia, zevra festival donde es, zevra festival como llegar, zevra festival transporte, zevra festival metro, zevra festival carpooling, como llegar zevra festival, zevra entradas, zevra cartel, zevra desde madrid, festival valencia ${YEAR}`,
  },
  "fib": {
    title: `FIB Benicàssim ${YEAR}: Desde 4€ | ConcertRide`,
    description: `FIB ${YEAR} (16–19 jul, Benicàssim Castellón): Tren Cercanías C6 Castellón–Benicàssim (5 min, 1,75€) directo al recinto. 0% comisión, conductores verificados.`,
    keywords: `fib ${YEAR}, fib benicassim ${YEAR}, fib benicàssim como llegar, fib festival tren, autobús fib, fib carpooling, festival internacional benicassim, fib transporte, como ir fib, fib entradas, fib horarios, fib cartel, fib desde madrid, fib desde valencia, fib desde barcelona`,
  },
  "vive-latino": {
    title: `Vive Latino España ${YEAR} Zaragoza: Carpooling 5€ | ConcertRide`,
    description: `Vive Latino España ${YEAR} (4–5 sep, Recinto Expo Zaragoza, 40.000/día) — primera edición europea del festival latino más prestigioso. Carpooling sin.`,
    keywords: `vive latino españa ${YEAR}, vive latino zaragoza ${YEAR}, vive latino zaragoza septiembre, vive latino como llegar, carpooling vive latino, vive latino transporte, como ir al vive latino zaragoza, vive latino carpooling madrid, vive latino carpooling barcelona, vive latino recinto expo, vive latino zaragoza expo, vive latino entradas, vive latino cartel ${YEAR}, primera edicion europa vive latino`,
  },
  "festival-de-les-arts": {
    title: `Festival de les Arts ${YEAR} Valencia: Carpooling 3€ | ConcertRide`,
    description: `Festival de les Arts ${YEAR} (28–31 may, Ciudad de las Artes y las Ciencias Valencia, 25.000/día): Metro L3/L5/L7 parada Alameda. Carpooling sin comisión.`,
    keywords: `festival de les arts ${YEAR}, festival les arts valencia ${YEAR}, festival les arts como llegar, carpooling festival les arts, les arts transporte, como ir festival les arts, festival les arts carpooling alicante, festival les arts carpooling madrid, festival les arts entradas, festival les arts cartel ${YEAR}, ciudad artes y ciencias festival`,
  },
  "sonar": {
    title: `Sónar ${YEAR} Barcelona: Metro + Carpooling 8€ | ConcertRide`,
    description: `Sónar ${YEAR} (18–20 jun, Fira Montjuïc + Fira Gran Via Barcelona): Metro L1 Espanya (Sónar de Día, 12:00–22:00) y L9 Fira Gran Via (Sónar de Noche.`,
    keywords: `sonar ${YEAR}, sonar barcelona ${YEAR}, sonar como llegar, sonar barcelona metro, sonar festival transporte, sonar carpooling, como llegar sonar, sonar fira montjuic, sonar de dia, sonar de noche, sonar entradas, sonar fechas, festival electronica barcelona, sonar fira gran via, sonar 2026 cartel, sonar desde madrid, sonar desde valencia`,
  },
  "sonorama-ribera": {
    title: `Sonorama Ribera ${YEAR}: Carpooling DIRECTO desde 3€ | ConcertRide`,
    description: `Sonorama Ribera ${YEAR} (6–9 ago, Aranda de Duero Burgos): festival sin estación de tren. 0% comisión, conductores verificados.`,
    keywords: `sonorama ribera ${YEAR}, sonorama aranda de duero, sonorama ${YEAR}, como llegar sonorama ribera, transporte sonorama ribera, bus sonorama ribera, sonorama ribera carpooling, sonorama ribera desde madrid, sonorama ribera burgos, sonorama entradas, sonorama cartel, la sepulvedana sonorama, sonorama desde bilbao, sonorama desde valladolid`,
  },
  "medusa-festival": {
    title: `Medusa Festival ${YEAR}: Carpooling desde 3€ | ConcertRide`,
    description: `Medusa Festival ${YEAR} (12–16 ago, Playa de Cullera Valencia, 200.000 acumulados, 5 días): electrónica nocturna mediterránea con lanzadera oficial.`,
    keywords: `medusa festival ${YEAR}, medusa festival cullera, como llegar medusa festival, medusa festival carpooling, transporte medusa festival, medusa festival desde valencia, medusa festival lanzadera, medusa festival entradas, medusa festival cartel ${YEAR}, medusa playa de cullera, festival electronica valencia, medusa festival horarios`,
  },
  "cruilla": {
    title: `Cruïlla ${YEAR} Barcelona: Metro L4 + Carpooling 5€ | ConcertRide`,
    description: `Cruïlla ${YEAR} (9–12 jul, Parc del Fòrum Barcelona, 175.000 acumulados): pop/rock/electrónica con cabezas internacionales. 0% comisión, conductores verificados.`,
    keywords: `cruilla barcelona ${YEAR}, cruilla festival ${YEAR}, como llegar cruilla barcelona, cruilla metro, transporte cruilla, cruilla carpooling, cruilla entradas, cruilla cartel ${YEAR}, cruilla parc del forum, cruilla fechas, cruilla horarios`,
  },
  "tomavistas": {
    title: `Tomavistas ${YEAR}: Carpooling desde 3€ | ConcertRide`,
    description: `Tomavistas ${YEAR} (15–17 may, Jardines del Buen Retiro Madrid, 20.000/día): festival urbano indie/pop en pleno centro. 0% comisión, conductores verificados.`,
    keywords: `tomavistas ${YEAR}, tomavistas madrid ${YEAR}, como llegar tomavistas, tomavistas metro retiro, transporte tomavistas, tomavistas carpooling, tomavistas entradas, tomavistas cartel ${YEAR}, tomavistas fechas, festival retiro madrid, tomavistas jardines buen retiro`,
  },
  "festival-ortigueira": {
    title: `Festival Ortigueira ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Festival Internacional do Mundo Celta de Ortigueira ${YEAR} (9–12 jul, A Coruña). 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `festival ortigueira ${YEAR}, ortigueira ${YEAR}, festival celta ortigueira, festival ortigueira fechas, festival ortigueira gratis, ortigueira como llegar, ortigueira carpooling, festival galicia gratis ${YEAR}, mundo celta ortigueira ${YEAR}, ortigueira desde a coruña, ortigueira desde lugo, ortigueira desde madrid, festival folk celta españa`,
  },
  "jazzaldia": {
    title: `Heineken Jazzaldia ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Heineken Jazzaldia ${YEAR} (61.ª edición, 22–26 jul), Donostia–San Sebastián. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `jazzaldia ${YEAR}, heineken jazzaldia ${YEAR}, jazzaldia donostia ${YEAR}, jazzaldia san sebastian ${YEAR}, jazzaldia 61 edicion, jazzaldia plaza trinidad, jazzaldia conciertos gratis, jazzaldia carpooling, festival jazz san sebastian, festival jazz donostia, jazzaldia desde bilbao, jazzaldia desde madrid, festival jazz españa ${YEAR}, festival jazz pais vasco`,
  },
  "metropoli-gijon": {
    title: `Metrópoli Gijón: Pop+Indie + Carpooling desde 3€ | ConcertRide`,
    description: `Festival Internacional Metrópoli Gijón ${YEAR} (3–5 jul), Recinto Ferial Luis Adaro. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `metropoli gijon ${YEAR}, festival metropoli gijon ${YEAR}, metropoli gijon fechas, metropoli gijon entradas, metropoli gijon como llegar, metropoli gijon carpooling, festival pop asturias ${YEAR}, festival gijon ${YEAR}, recinto ferial luis adaro, metropoli desde oviedo, metropoli desde madrid, festival rock asturias`,
  },
  "granada-sound": {
    title: `Granada Sound ${YEAR}: Carpooling desde 5€ | ConcertRide`,
    description: `Granada Sound ${YEAR} (último fin de semana sept), Cortijo del Conde Granada. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `granada sound ${YEAR}, granada sound fechas, granada sound entradas, granada sound como llegar, granada sound carpooling, granada sound cortijo del conde, festival pop granada ${YEAR}, festival indie granada, granada sound shuttle, granada sound desde malaga, granada sound desde sevilla, festival andalucia oriental, festival granada septiembre`,
  },
  "pirineos-sur": {
    title: `Pirineos Sur ${YEAR}: Carpooling desde 3€ | ConcertRide`,
    description: `Pirineos Sur ${YEAR} (10 jul–1 ago, 3 fines de semana), Auditorio flotante de Lanuza (Sallent de Gállego, Huesca). 0% comisión, conductores verificados.`,
    keywords: `pirineos sur ${YEAR}, festival pirineos sur, festival lanuza, sallent de gallego festival, world music pirineos, escenario embalse lanuza, pirineos sur entradas, pirineos sur fechas ${YEAR}, pirineos sur como llegar, pirineos sur desde huesca, pirineos sur desde madrid, pirineos sur desde zaragoza, festival aragon ${YEAR}`,
  },
  "starlite-marbella": {
    title: `Starlite Marbella ${YEAR}: 60+ noches + Carpooling 3€ | ConcertRide`,
    description: `Starlite Catalana Occidente ${YEAR} (13 jun–31 ago, Cantera de Nagüeles Marbella). 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `starlite marbella ${YEAR}, starlite festival marbella, starlite catalana occidente, cantera de nagueles marbella, starlite entradas, starlite cabezas de cartel, festival marbella verano ${YEAR}, conciertos marbella verano, starlite shuttle, starlite como llegar, starlite desde malaga, costa del sol festivales`,
  },
  "stone-music-festival": {
    title: `Stone & Music ${YEAR} Mérida: Carpooling desde 3€ | ConcertRide`,
    description: `Stone & Music Festival ${YEAR} (jul–sep, Teatro Romano Mérida siglo I a.C.). 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `stone music festival ${YEAR}, stone music merida, festival merida teatro romano, teatro romano merida conciertos, stone music entradas, festival extremadura ${YEAR}, andrea bocelli merida, sting merida, joaquin sabina merida, conciertos teatro romano, festival merida ${YEAR}`,
  },
  "marenostrum-fuengirola": {
    title: `Marenostrum Fuengirola ${YEAR}: Carpooling 3€ | ConcertRide`,
    description: `Marenostrum Fuengirola Festival ${YEAR} (15 jun–20 ago, Sohail Castle Park anfiteatro al aire libre junto al castillo árabe del siglo X). 50 Cent, Bryan.`,
    keywords: `marenostrum fuengirola ${YEAR}, marenostrum castle park, fuengirola castle park festival, sohail castle park conciertos, marenostrum entradas, marenostrum cabezas de cartel, festival fuengirola ${YEAR}, fuengirola conciertos verano, costa del sol festivales, marenostrum como llegar, marenostrum desde malaga, cercanias malaga fuengirola`,
  },
  "tio-pepe-festival": {
    title: `Tío Pepe Festival ${YEAR} Jerez: Carpooling 3€ | ConcertRide`,
    description: `Tío Pepe Festival ${YEAR} (25 jun–31 ago, Bodegas González Byass Jerez). 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `tio pepe festival ${YEAR}, tio pepe jerez festival, bodegas gonzalez byass conciertos, festival jerez ${YEAR}, festival jerez de la frontera, tio pepe entradas, robbie williams jerez, pet shop boys jerez, sting jerez, festival cadiz ${YEAR}, jerez festival verano`,
  },
  "rototom-sunsplash": {
    title: `Rototom Sunsplash ${YEAR}: Carpooling desde 5€ | ConcertRide`,
    description: `Rototom Sunsplash ${YEAR} (14–22 ago, Benicàssim Castellón, 250.000 asistentes en 8 días): festival de reggae más grande de Europa. Fiberbus lanzadera desde.`,
    keywords: `rototom sunsplash ${YEAR}, rototom benicassim ${YEAR}, rototom como llegar, rototom carpooling, transporte rototom, rototom desde valencia, rototom desde madrid, rototom desde barcelona, rototom lanzadera, rototom fiberbus, rototom entradas, rototom cartel ${YEAR}, festival reggae benicassim, festival reggae españa ${YEAR}, rototom sunsplash benicassim`,
  },
  "dreambeach-festival": {
    title: `Dreambeach ${YEAR}: Carpooling desde 5€ | ConcertRide`,
    description: `Dreambeach Festival ${YEAR} (8–12 jul, playa Villaricos Almería, 100.000 asistentes, 5 días): festival de electrónica frente al Mediterráneo. SIN transporte.`,
    keywords: `dreambeach ${YEAR}, dreambeach festival ${YEAR}, dreambeach villaricos, dreambeach almeria, dreambeach como llegar, dreambeach carpooling, dreambeach transporte, dreambeach desde almeria, dreambeach desde murcia, dreambeach desde granada, dreambeach entradas, dreambeach cartel, festival electronica almeria, festival playa almeria ${YEAR}`,
  },
  "aquasella-festival": {
    title: `Aquasella ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Aquasella Festival ${YEAR} (10–12 jul, Parque del Sella Arriondas Asturias, 30.000 asistentes): festival de electrónica y reggae con rafting y actividades.`,
    keywords: `aquasella ${YEAR}, aquasella festival ${YEAR}, aquasella arriondas, aquasella asturias, aquasella como llegar, aquasella carpooling, aquasella transporte, aquasella desde oviedo, aquasella desde gijon, aquasella desde bilbao, aquasella entradas, aquasella cartel, festival electronica asturias, festival parque acuatico asturias`,
  },
  "dcode-festival": {
    title: `DCode Festival ${YEAR} Madrid: Urban + Carpooling 9€ | ConcertRide`,
    description: `DCode Festival ${YEAR} (12–13 sep, Estadio Complutense Ciudad Universitaria Madrid, 45.000/día): festival urban, trap, reggaetón y pop de otoño. Metro L6.`,
    keywords: `dcode festival ${YEAR}, dcode madrid ${YEAR}, dcode como llegar, dcode carpooling, dcode transporte, dcode ciudad universitaria, dcode metro, dcode entradas, dcode cartel ${YEAR}, dcode festival septiembre, festival urban madrid, festival trap madrid ${YEAR}, dcode desde valencia, dcode desde barcelona`,
  },
  "creamfields-andalucia": {
    title: `Creamfields Andalucía ${YEAR}: Carpooling desde 3€ | ConcertRide`,
    description: `Creamfields Andalucía ${YEAR} (5–7 jun, Recinto González Hontoria Jerez de la Frontera, 40.000/día): festival de electrónica, techno y trance del sur de.`,
    keywords: `creamfields andalucia ${YEAR}, creamfields jerez ${YEAR}, creamfields como llegar, creamfields carpooling, creamfields andalucia transporte, creamfields jerez de la frontera, creamfields desde sevilla, creamfields desde cadiz, creamfields desde malaga, creamfields entradas, creamfields cartel, festival electronica jerez, festival techno andalucia ${YEAR}, creamfields gonzalez hontoria`,
  },
  "atlantic-fest": {
    title: `Atlantic Fest ${YEAR}: Carpooling desde 3€ | ConcertRide`,
    description: `Atlantic Fest ${YEAR} (17–19 jul, Recinto Ferial Fexdega Vilagarcía de Arousa Pontevedra, 25.000/día): festival indie gallego con La Casa Azul, Carolina.`,
    keywords: `atlantic fest ${YEAR}, atlantic fest vilagarcia, atlantic fest fexdega, atlantic fest como llegar, atlantic fest carpooling, atlantic fest cartel ${YEAR}, atlantic fest entradas, atlantic fest desde vigo, atlantic fest desde santiago, atlantic fest desde madrid, festival indie galicia ${YEAR}, festival pontevedra julio, atlantic fest horarios, atlantic fest transporte`,
  },
  "portamerica": {
    title: `PortAmérica ${YEAR} Caldas de Reis: Carpooling 3€ | ConcertRide`,
    description: `PortAmérica Festival ${YEAR} (9–11 jul, Finca Montecelo Caldas de Reis Pontevedra, 30.000/día): pop/rock español + latino entre eucaliptos y robles. SIN.`,
    keywords: `portamerica ${YEAR}, portamerica caldas de reis, portamerica festival ${YEAR}, portamerica como llegar, portamerica carpooling, portamerica desde vigo, portamerica desde pontevedra, portamerica desde santiago, portamerica desde madrid, portamerica entradas, portamerica cartel ${YEAR}, festival galicia julio ${YEAR}, finca montecelo festival, portamerica transporte`,
  },
  "sos-48": {
    title: `SOS 4.8 ${YEAR}: Carpooling desde 3€ | ConcertRide`,
    description: `SOS 4.8 Festival ${YEAR} (8–9 may, Recinto Ferial La Fica Murcia, 40.000/día): inaugura la temporada festivalera con indie + electrónica (LCD Soundsystem.`,
    keywords: `sos 4.8 ${YEAR}, sos festival murcia ${YEAR}, sos 48 ${YEAR}, sos festival como llegar, sos 4.8 carpooling, sos festival la fica, sos 4.8 transporte, sos festival desde alicante, sos festival desde madrid, sos 4.8 entradas, sos 4.8 cartel ${YEAR}, festival indie murcia, festival electronica murcia ${YEAR}, sos 4.8 recinto ferias murcia`,
  },
  "reggaeton-beach-festival": {
    title: `Reggaeton Beach Festival ${YEAR}: Carpooling desde 3€ | ConcertRide`,
    description: `Reggaeton Beach Festival ${YEAR} (31 jul–2 ago, Salou–PortAventura Tarragona, 60.000/día): festival de reggaeton y música urbana latina más grande de España.`,
    keywords: `reggaeton beach festival ${YEAR}, reggaeton beach salou ${YEAR}, rbf salou ${YEAR}, reggaeton beach como llegar, reggaeton beach carpooling, reggaeton beach desde barcelona, reggaeton beach desde tarragona, reggaeton beach desde valencia, reggaeton beach entradas, reggaeton beach cartel ${YEAR}, festival reggaeton españa, festival urban salou, rbf carpooling, costa daurada festival ${YEAR}`,
  },
  "mallorca-live-festival": {
    title: `Mallorca Live Festival ${YEAR} Calvià: Carpooling 3€ | ConcertRide`,
    description: `Mallorca Live Festival ${YEAR} (22–24 may, Antiguo Aquapark Magaluf Calvià, 35.000/día): festival multidisciplinar de Baleares (The Killers, Pet Shop Boys.`,
    keywords: `mallorca live festival ${YEAR}, mallorca live ${YEAR}, mallorca live calvia, mallorca live magaluf, mallorca live como llegar, mallorca live carpooling, mallorca live desde palma, mallorca live ferry, mallorca live avion, mallorca live entradas, mallorca live cartel ${YEAR}, festival mallorca ${YEAR}, festival baleares ${YEAR}, mallorca live shuttle`,
  },
  "bbk-music-legends": {
    title: `BBK Music Legends ${YEAR}: Carpooling desde 3€ | ConcertRide`,
    description: `BBK Music Legends Festival ${YEAR} (19–21 jun, Recinto Atxura Sondika Bizkaia, 20.000/día): festival de rock clásico del norte con cabezas históricos (Bob.`,
    keywords: `bbk music legends ${YEAR}, bbk music legends sondika, bbk legends ${YEAR}, bbk music legends como llegar, bbk music legends carpooling, bbk music legends lanzadera, bbk music legends desde bilbao, bbk music legends desde donostia, bbk music legends desde madrid, bbk music legends entradas, bbk music legends cartel ${YEAR}, festival rock clasico bilbao, festival rock pais vasco ${YEAR}, sondika atxura`,
  },
  "download-madrid": {
    title: `Download Festival Madrid ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Download Festival Madrid ${YEAR} (5–7 jun, IFEMA Madrid, 40.000/día): festival de rock y metal de referencia en España (Metallica, Slipknot, Judas Priest.`,
    keywords: `download festival madrid ${YEAR}, download madrid ${YEAR}, download festival españa ${YEAR}, download madrid como llegar, download festival carpooling, download madrid ifema, download festival metal, download madrid desde barcelona, download madrid desde valencia, download madrid entradas, download festival cartel ${YEAR}, festival metal madrid, festival rock madrid ${YEAR}, download madrid horarios`,
  },
  "azkena-rock-festival": {
    title: `Azkena Rock Festival ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Azkena Rock Festival ${YEAR} (18–20 jun, Recinto de Mendizabala Vitoria-Gasteiz Álava, 25.000/día): festival de rock clásico, rockabilly, punk y country.`,
    keywords: `azkena rock festival ${YEAR}, azkena rock ${YEAR}, arf vitoria ${YEAR}, azkena rock como llegar, azkena rock carpooling, azkena rock mendizabala, autobuses del rock azkena, azkena rock desde bilbao, azkena rock desde donostia, azkena rock desde madrid, azkena rock entradas, azkena rock cartel ${YEAR}, festival rock vitoria, festival rockabilly españa ${YEAR}`,
  },
  "granca-live-fest": {
    title: `Granca Live Fest ${YEAR} Gran Canaria: Carpooling 3€ | ConcertRide`,
    description: `Granca Live Fest ${YEAR} (2–4 jul, Estadio de Gran Canaria Las Palmas, 35.000/día): festival principal de Canarias junto al Atlántico. Vuelo.`,
    keywords: `granca live fest ${YEAR}, granca live ${YEAR}, granca live las palmas, granca live como llegar, granca live carpooling, granca live estadio gran canaria, granca live desde maspalomas, granca live desde aeropuerto, granca live entradas, granca live cartel ${YEAR}, festival canarias ${YEAR}, festival las palmas gran canaria, festival gran canaria julio`,
  },
  // ── Wave 37: Catalunya interior + costes (10 festivales) ─────────────────
  "sonar-plus": {
    title: `Sónar+D ${YEAR} [Jun, BCN]: Carpooling Madrid 10€ | ConcertRide`,
    description: `Sónar+D ${YEAR}: conferencia y festival de música electrónica y tecnología en Barcelona (Jun). 0% comisión, conductores verificados.`,
    keywords: `sonar plus ${YEAR}, sonar+d barcelona, sonar festival transporte, como llegar sonar barcelona, carpooling sonar`,
  },
  "festival-de-musica-de-tarragona": {
    title: `Tarragona Fest ${YEAR} [Jul, Romano]: Carpooling 4€ | ConcertRide`,
    description: `Festival de Música de Tarragona ${YEAR}: pop y rock junto al Anfiteatro Romano patrimonio UNESCO. 0% comisión, conductores verificados.`,
    keywords: `festival musica tarragona ${YEAR}, tarragona fest carpooling, como llegar festival tarragona, conciertos tarragona ${YEAR}`,
  },
  "festival-de-musica-de-lleida": {
    title: `Lleida Fest ${YEAR} [Jul, Poniente]: Carpooling 4€ | ConcertRide`,
    description: `Festival de Música de Lleida ${YEAR}: pop e indie en la capital de Poniente catalán. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `festival musica lleida ${YEAR}, lleida fest carpooling, como llegar festival lleida, conciertos lleida ${YEAR}`,
  },
  "festival-de-musica-de-girona": {
    title: `Girona Fest ${YEAR} [Jul, Medieval]: Carpooling 3€ | ConcertRide`,
    description: `Festival de Música de Girona ${YEAR}: pop y rock en la ciudad medieval del río Onyar. 0% comisión, conductores verificados.`,
    keywords: `festival musica girona ${YEAR}, girona fest carpooling, como llegar festival girona, conciertos girona ${YEAR}`,
  },
  "festival-de-musica-de-manresa": {
    title: `Manresa Fest ${YEAR} [Jul, Bages]: Carpooling 3€ | ConcertRide`,
    description: `Festival de Música de Manresa ${YEAR}: pop e indie en la capital del Bages catalán. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `festival musica manresa ${YEAR}, manresa fest carpooling, como llegar festival manresa, conciertos manresa ${YEAR}`,
  },
  "festival-de-musica-de-reus": {
    title: `Reus Fest ${YEAR} [Jul, Vermut]: Carpooling 4€ | ConcertRide`,
    description: `Festival de Música de Reus ${YEAR}: pop y rock en la capital del Camp de Tarragona. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `festival musica reus ${YEAR}, reus fest carpooling, como llegar festival reus, conciertos reus ${YEAR}`,
  },
  "festival-de-musica-de-vic": {
    title: `Vic Fest ${YEAR} [Jul, Osona]: Carpooling 3€ | ConcertRide`,
    description: `Festival de Música de Vic ${YEAR}: pop e indie en la capital de Osona, en el prepirineo catalán. 0% comisión, conductores verificados.`,
    keywords: `festival musica vic ${YEAR}, vic fest carpooling, como llegar festival vic, conciertos vic osona ${YEAR}`,
  },
  "festival-de-musica-de-figueres": {
    title: `Figueres Fest ${YEAR} [Jul, Dalí]: Carpooling 4€ | ConcertRide`,
    description: `Festival de Música de Figueres ${YEAR}: pop y rock en la ciudad de Dalí y el Alt Empordà. 0% comisión, conductores verificados.`,
    keywords: `festival musica figueres ${YEAR}, figueres fest carpooling, como llegar festival figueres, conciertos figueres ${YEAR}`,
  },
  "festival-de-musica-de-mataro": {
    title: `Mataró Fest ${YEAR} [Jul, Maresme]: Carpooling 3€ | ConcertRide`,
    description: `Festival de Música de Mataró ${YEAR}: pop y rock en la capital del Maresme. Carpooling sin comisión Barcelona 3€, Madrid 10€, Valencia 7€. Pago Bizum directo.`,
    keywords: `festival musica mataro ${YEAR}, mataro fest carpooling, como llegar festival mataro, conciertos mataro ${YEAR}`,
  },
  "festival-de-musica-de-sabadell": {
    title: `Sabadell Fest ${YEAR} [Jul, Vallès]: Carpooling 3€ | ConcertRide`,
    description: `Festival de Música de Sabadell ${YEAR}: pop e indie en la capital del Vallès Occidental. 0% comisión, conductores verificados.`,
    keywords: `festival musica sabadell ${YEAR}, sabadell fest carpooling, como llegar festival sabadell, conciertos sabadell ${YEAR}`,
  },

  // ── Wave 38: Levante–Murcia + Madrid metro (10 festivales) ───────────────
  "festival-de-musica-de-alicante": {
    title: `Alicante Fest ${YEAR}: Carpooling 3€ | ConcertRide`,
    description: `Festival de Música de Alicante ${YEAR}: pop y rock bajo el Castillo de Santa Bárbara. 0% comisión, conductores verificados.`,
    keywords: `festival musica alicante ${YEAR}, alicante fest carpooling, como llegar festival alicante, conciertos alicante ${YEAR}`,
  },
  "festival-de-musica-de-elche": {
    title: `Elche Fest ${YEAR} [Jul, Palmeral]: Carpooling 3€ | ConcertRide`,
    description: `Festival de Música de Elche ${YEAR}: pop y rock en la ciudad palmeral UNESCO. Carpooling sin comisión Alicante 3€, Murcia 3€, Madrid 7€. Pago Bizum directo.`,
    keywords: `festival musica elche ${YEAR}, elche fest carpooling, como llegar festival elche, conciertos elche ${YEAR}`,
  },
  "festival-de-musica-de-murcia-pop": {
    title: `Murcia Pop ${YEAR} [Jul, Huerta]: Carpooling 3€ | ConcertRide`,
    description: `Festival Pop de Murcia ${YEAR}: los artistas de pop más actuales en el Auditorio Regional. 0% comisión, conductores verificados.`,
    keywords: `murcia pop ${YEAR}, festival pop murcia, murcia pop carpooling, como llegar murcia pop, conciertos murcia ${YEAR}`,
  },
  "festival-de-musica-de-cartagena": {
    title: `Cartagena Fest ${YEAR} [Jul, Romano]: Carpooling 3€ | ConcertRide`,
    description: `Festival de Música de Cartagena ${YEAR}: rock e indie junto al Teatro Romano del siglo I d.C. 0% comisión, conductores verificados.`,
    keywords: `festival musica cartagena ${YEAR}, cartagena fest carpooling, como llegar festival cartagena, conciertos cartagena ${YEAR}`,
  },
  "festival-de-musica-de-lorca": {
    title: `Lorca Fest ${YEAR} [Jul, Bordados]: Carpooling 3€ | ConcertRide`,
    description: `Festival de Música de Lorca ${YEAR}: pop y rock en la ciudad de los bordados y el Castillo del Sol. 0% comisión, conductores verificados.`,
    keywords: `festival musica lorca ${YEAR}, lorca fest carpooling, como llegar festival lorca, conciertos lorca ${YEAR}`,
  },
  "festival-de-jazz-de-toledo": {
    title: `Jazz Toledo ${YEAR} [Jul, Imperial]: Carpooling 3€ | ConcertRide`,
    description: `Festival de Jazz de Toledo ${YEAR}: jazz en la ciudad imperial de tres culturas. Carpooling sin comisión Madrid 3€, Guadalajara 3€, Cuenca 3€. Pago Bizum directo.`,
    keywords: `festival jazz toledo ${YEAR}, jazz toledo carpooling, como llegar festival jazz toledo, conciertos toledo ${YEAR}`,
  },
  "festival-complutense": {
    title: `Festival Complutense ${YEAR}: Carpooling 3€ | ConcertRide`,
    description: `Festival Complutense ${YEAR}: música en la ciudad de Cervantes, Alcalá de Henares. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `festival complutense ${YEAR}, festival alcala henares carpooling, como llegar festival complutense, conciertos alcala henares ${YEAR}`,
  },
  "festival-de-musica-de-leganes": {
    title: `Leganés Fest ${YEAR} [Jul, Sur Madrid]: Carpooling 3€ | ConcertRide`,
    description: `Festival de Música de Leganés ${YEAR}: rock en el sur metropolitano de Madrid. Carpooling sin comisión Madrid 3€, Toledo 3€, Guadalajara 3€. Pago Bizum directo.`,
    keywords: `festival musica leganes ${YEAR}, leganes fest carpooling, como llegar festival leganes, conciertos leganes ${YEAR}`,
  },
  "festival-de-musica-de-mostoles": {
    title: `Móstoles Fest ${YEAR} [Ago, Suroeste]: Carpooling 3€ | ConcertRide`,
    description: `Festival de Música de Móstoles ${YEAR}: pop e indie en la segunda ciudad de la Comunidad de Madrid. 0% comisión, conductores verificados.`,
    keywords: `festival musica mostoles ${YEAR}, mostoles fest carpooling, como llegar festival mostoles, conciertos mostoles ${YEAR}`,
  },
  "festival-de-musica-de-alcorcon": {
    title: `Alcorcón Fest ${YEAR} [Ago, Suroeste]: Carpooling 3€ | ConcertRide`,
    description: `Festival de Música de Alcorcón ${YEAR}: pop y rock en el suroeste del área metropolitana de Madrid. 0% comisión, conductores verificados.`,
    keywords: `festival musica alcorcon ${YEAR}, alcorcon fest carpooling, como llegar festival alcorcon, conciertos alcorcon ${YEAR}`,
  },

};

// ─────────────────────────────────────────────────────────────────────────────
// CITY TITLE/DESCRIPTION IMPROVEMENTS (extends existing cityLandings)
// ─────────────────────────────────────────────────────────────────────────────

export const CITY_SEO_IMPROVEMENTS: Record<string, { title: string; description: string; keywords?: string }> = {
  sevilla: {
    title: `Conciertos en Sevilla ${YEAR} [La Cartuja + FIBES]: carpooling 4€`,
    description: `Agenda conciertos Sevilla ${YEAR}: Estadio La Cartuja (57.000 plazas — Manuel Carrasco, Guns N' Roses), FIBES (9.500 — conciertos cubiertos), Icónica Fest.`,
    keywords: `conciertos en Sevilla ${YEAR}, conciertos Sevilla ${NEXT_YEAR}, próximos conciertos Sevilla, conciertos musica sevilla, La Cartuja Sevilla conciertos, FIBES Sevilla conciertos, Interestelar Sevilla, Icónica Sevilla Fest, carpooling Sevilla festivales, viaje compartido Sevilla concierto, conciertos sevilla agenda, conciertos sevilla 2026, agenda conciertos sevilla, concierto sevilla, musica sevilla, conciertos sevilla verano, estadio la cartuja conciertos sevilla, conciertos sevilla mayo junio, conciertos sevilla octubre`,
  },
  donostia: {
    title: `Conciertos en Donostia ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Agenda conciertos Donostia–San Sebastián ${YEAR}: Heineken Jazzaldia (22–26 jul, 61.ª edición, Plaza Trinidad y Kursaal, entrada gratuita parcial), Donostia.`,
    keywords: `conciertos Donostia ${YEAR}, conciertos San Sebastián ${YEAR}, conciertos donostia 2026, conciertos san sebastian 2026, conciertos donostia 2027, conciertos san sebastian 2027, Jazzaldia ${YEAR}, conciertos en donostia, como llegar concierto donostia, carpooling Jazzaldia, donostia arena conciertos, kursaal conciertos, victoria eugenia donostia, heineken jazzaldia entradas, agenda conciertos donostia, jazzaldia san sebastian, conciertos donostia verano, proximos conciertos donostia`,
  },
  alicante: {
    title: `Conciertos en Alicante ${YEAR} [Plaza Toros + ADDA]: 3€`,
    description: `Agenda de conciertos en Alicante ${YEAR}: Plaza de Toros Alicante (9.000 plazas, programación veraniega), ADDA (1.700) y Pabellón Pitiu Rochel. Carpooling.`,
    keywords: `conciertos Plaza de Toros Alicante ${YEAR}, conciertos plaza toros alicante, conciertos alicante ${YEAR}, conciertos en Alicante, próximos conciertos Alicante, carpooling Alicante festivales, viaje compartido Alicante Low Festival, alicante festium, agenda conciertos alicante, conciertos alicante 2026, conciertos alicante verano`,
  },
  zaragoza: {
    title: `Conciertos en Zaragoza ${YEAR} [Vive Latino + Príncipe Felipe] 5€`,
    description: `Agenda conciertos Zaragoza ${YEAR}: Dani Martín DOBLE FECHA 22–23 may (Príncipe Felipe), Aitana 10 jul, Vive Latino España 4–5 sep (Recinto Expo.`,
    keywords: `conciertos Zaragoza ${YEAR}, conciertos en Zaragoza, próximos conciertos Zaragoza, Pabellón Príncipe Felipe, Dani Martín Zaragoza, Aitana Zaragoza, Vive Latino Zaragoza, Hombres G Zaragoza, Bryan Adams Zaragoza, carpooling Zaragoza festivales, viajes Mad Cool desde Zaragoza, conciertos Zaragoza verano, agenda conciertos zaragoza, conciertos zaragoza septiembre, recinto expo zaragoza, conciertos zaragoza 2026, conciertos zaragoza 2027, agenda musical zaragoza`,
  },
  murcia: {
    title: `Conciertos en Murcia ${YEAR} [SOS 4.8 + Víctor Villegas]: 4€`,
    description: `Agenda conciertos Murcia ${YEAR}: SOS 4.8 Festival (Murcia capital, primavera), Auditorio Víctor Villegas (3.000 plazas), Plaza de Toros Murcia, Teatro.`,
    keywords: `conciertos Murcia ${YEAR}, conciertos en Murcia, SOS 4.8 Murcia, conciertos murcia 2026, conciertos murcia 2027, próximos conciertos murcia, carpooling Murcia festivales, viaje compartido Murcia concierto, conciertos murcia agenda, victor villegas murcia, murcia festivales transporte, murcia música, sos 4.8 festival murcia, conciertos murcia verano`,
  },
  malaga: {
    title: `Conciertos en Málaga ${YEAR} [Cala Mijas + Marenostrum]: 3€`,
    description: `Agenda conciertos Málaga ${YEAR}: Cala Mijas Fest (Cortijo Torres, oct, 90.000/día), Marenostrum Fuengirola (Sohail Castle Park, jul–ago, 15.000), Starlite.`,
    keywords: `conciertos Málaga ${YEAR}, conciertos en Málaga, Cala Mijas Festival, Marenostrum Fuengirola, Starlite Marbella, Martín Carpena Málaga, carpooling Málaga, viaje compartido Costa del Sol, festivales Málaga, conciertos malaga 2026, agenda conciertos malaga, malaga festivales verano, malaga conciertos costa del sol`,
  },
  pamplona: {
    title: `Conciertos en Pamplona ${YEAR} [Navarra Arena]: carpooling 4€`,
    description: `Agenda conciertos Pamplona ${YEAR}: Navarra Arena (12.000 plazas), Anaitasuna, Plaza de Toros de Pamplona, Baluarte. 0% comisión, conductores verificados.`,
    keywords: `conciertos Pamplona ${YEAR}, conciertos en Pamplona, Navarra Arena conciertos, carpooling Pamplona festivales, viaje compartido Pamplona, agenda conciertos pamplona, conciertos pamplona 2026, pamplona BBK Live, navarra conciertos`,
  },
  "a-coruna": {
    title: `Conciertos en A Coruña ${YEAR} [Coliseum + Riazor]: 3€`,
    description: `Agenda conciertos A Coruña ${YEAR}: Coliseum (10.000 plazas), Estadio de Riazor (32.000), Palexco, Pazo da Ópera. 0% comisión, conductores verificados.`,
    keywords: `conciertos A Coruña ${YEAR}, conciertos en A Coruña, carpooling A Coruña Resurrection Fest, viaje compartido A Coruña, agenda conciertos coruña, coliseum a coruña conciertos, riazor conciertos, conciertos coruña 2026, ortigueira desde coruña`,
  },
  vigo: {
    title: `Conciertos en Vigo ${YEAR} [Mar de Vigo + Travesas]: 4€`,
    description: `Agenda conciertos Vigo ${YEAR}: Mar de Vigo (recinto principal), Pabellón Multiusos das Travesas (10.000 plazas), Auditorio Mar de Vigo, Estadio de Balaídos.`,
    keywords: `conciertos Vigo ${YEAR}, conciertos en Vigo, carpooling Vigo festivales, viaje compartido Vigo Resurrection Fest, agenda conciertos vigo, mar de vigo conciertos, multiusos das travesas, conciertos vigo 2026, vigo festivales galicia, bigsound vigo`,
  },
  bilbao: {
    title: `Conciertos en Bilbao ${YEAR} [BEC + BBK Live]: carpooling 3€`,
    description: `Agenda conciertos Bilbao ${YEAR}: BEC Bilbao Exhibition Centre (Barakaldo, 18.000 plazas), Bilbao Arena Miribilla (10.000), Palacio Euskalduna, Sala BBK.`,
    keywords: `conciertos Bilbao ${YEAR}, BBK Live Bilbao, conciertos en Bilbao, BEC Bilbao Exhibition Centre, Bilbao Arena Miribilla, Palacio Euskalduna, carpooling Bilbao festivales, viaje compartido Bilbao, agenda conciertos bilbao, music legends bilbao, conciertos bilbao 2026, festival bilbao, kobetamendi bbk live`,
  },
  barcelona: {
    title: `Conciertos en Barcelona ${YEAR} [Sant Jordi, Sónar]: carpooling 5€`,
    description: `Agenda conciertos Barcelona ${YEAR}: Palau Sant Jordi (17.000), Estadi Olímpic Lluís Companys, Parc del Fòrum (Primavera Sound, Sónar, Cruïlla). Recintos.`,
    keywords: `conciertos Barcelona ${YEAR}, conciertos en Barcelona, Primavera Sound, Sónar Barcelona, Cruïlla Barcelona, Palau Sant Jordi conciertos, Estadi Olímpic Barcelona, Parc del Fòrum, razzmatazz conciertos, sala apolo barcelona, carpooling Barcelona festivales, viaje compartido Barcelona, agenda conciertos barcelona, conciertos barcelona 2026`,
  },
  valencia: {
    title: `Conciertos en Valencia ${YEAR} [Roig Arena + Zevra]: carpooling 3€`,
    description: `Agenda conciertos Valencia ${YEAR}: Roig Arena (15.600 plazas, inaugurado 2025), Zevra Festival La Marina (jul), Plaza de Toros, Auditorio Palau de la.`,
    keywords: `conciertos Valencia ${YEAR}, conciertos en Valencia, Roig Arena Valencia, Zevra Festival, Arenal Sound Valencia, carpooling Valencia festivales, viaje compartido Valencia, agenda conciertos valencia, conciertos valencia 2026, valencia festivales verano, roig arena valencia conciertos, plaza toros valencia`,
  },
  madrid: {
    title: `Conciertos en Madrid ${YEAR} [WiZink + Mad Cool]: carpooling 4€`,
    description: `Agenda conciertos Madrid ${YEAR}: WiZink Center (15.500), Mad Cool IFEMA (jul), Tomavistas Retiro (may), Palacio Vistalegre, Caja Mágica, Movistar Arena.`,
    keywords: `conciertos Madrid ${YEAR}, conciertos en Madrid, Mad Cool Madrid, Tomavistas Madrid, WiZink Center, Movistar Arena Madrid, palacio vistalegre, ifema mad cool, carpooling Madrid festivales, viaje compartido Madrid concierto, próximos conciertos Madrid, agenda conciertos madrid, conciertos madrid 2026, conciertos madrid 2027`,
  },
  valladolid: {
    title: `Conciertos en Valladolid ${YEAR} [Sonorama hub]: carpooling 4€`,
    description: `Agenda conciertos Valladolid ${YEAR}: Sala Porta Caeli, Auditorio Miguel Delibes, Polideportivo Pisuerga. 0% comisión, conductores verificados.`,
    keywords: `conciertos Valladolid ${YEAR}, conciertos en Valladolid, próximos conciertos Valladolid, Sala Porta Caeli, Auditorio Miguel Delibes, polideportivo pisuerga valladolid, sonorama desde valladolid, carpooling Valladolid festivales, viaje compartido Valladolid Sonorama, Valladolid Mad Cool carpooling, agenda conciertos valladolid, conciertos valladolid 2026`,
  },
  burgos: {
    title: `Conciertos Burgos ${YEAR} · Carpooling | ConcertRide`,
    description: `Conciertos en Burgos ${YEAR}: Coliseum, Teatro Principal. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `conciertos Burgos ${YEAR}, conciertos en Burgos, Sonorama Ribera Burgos, carpooling Burgos Sonorama, viaje compartido Burgos Aranda de Duero, Burgos festivales carpooling`,
  },
  salamanca: {
    title: `Conciertos en Salamanca ${YEAR} [Multiusos S. Paraíso]: 7€`,
    description: `Agenda conciertos Salamanca ${YEAR}: Multiusos Sánchez Paraíso (8.500 plazas), Palacio de Congresos, Plaza Mayor (conciertos al aire libre Ferias y Fiestas.`,
    keywords: `conciertos Salamanca ${YEAR}, conciertos en Salamanca, próximos conciertos Salamanca, Multiusos Sánchez Paraíso, palacio congresos salamanca, plaza mayor salamanca conciertos, ferias fiestas salamanca, carpooling Salamanca Mad Cool, viaje compartido Salamanca festivales, Salamanca Viña Rock carpooling, agenda conciertos salamanca`,
  },
  logrono: {
    title: `Conciertos Logroño ${YEAR} · Carpooling | ConcertRide`,
    description: `Conciertos en Logroño ${YEAR}: Palacio de los Deportes de La Rioja, Berceo. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `conciertos Logroño ${YEAR}, conciertos en Logroño, conciertos La Rioja, carpooling Logroño BBK Live, viaje compartido Logroño Bilbao, Logroño festivales carpooling`,
  },
  santander: {
    title: `Conciertos en Santander ${YEAR} [Arena + Palacio Deportes] 4€`,
    description: `Agenda conciertos Santander ${YEAR}: Palacio de los Deportes (6.000 plazas), Arena Santander, Palacio de Festivales de Cantabria, Plaza de Toros Cuatro.`,
    keywords: `conciertos Santander ${YEAR}, conciertos en Santander, Arena Santander, Palacio Deportes Santander, Palacio Festivales Cantabria, carpooling Santander BBK Live, viaje compartido Santander Bilbao, Santander festivales carpooling, como llegar BBK Live desde Santander, agenda conciertos santander, conciertos cantabria`,
  },
  "vitoria-gasteiz": {
    title: `Conciertos en Vitoria ${YEAR} [Azkena Rock + Buesa]: 4€`,
    description: `Agenda conciertos Vitoria-Gasteiz ${YEAR}: Fernando Buesa Arena (15.504 plazas), Recinto de Mendizabala (Azkena Rock Festival 18–20 jun, 25.000/día), Iradier.`,
    keywords: `conciertos Vitoria-Gasteiz ${YEAR}, conciertos Vitoria ${YEAR}, Azkena Rock Festival, Fernando Buesa Arena, Mendizabala Vitoria, conciertos en Vitoria, iradier arena vitoria, carpooling Vitoria BBK Live, viaje compartido Vitoria Bilbao, Azkena Rock carpooling, agenda conciertos vitoria`,
  },
  granada: {
    title: `Conciertos en Granada ${YEAR} [Palacio Deportes]: carpooling 5€`,
    description: `Agenda conciertos Granada ${YEAR}: Palacio Municipal de los Deportes (10.500 plazas), Palacio de Exposiciones y Congresos, Plaza de Toros. Festivales.`,
    keywords: `conciertos Granada ${YEAR}, conciertos en Granada, próximos conciertos Granada, Palacio Deportes Granada, Granada Sound festival, palacio exposiciones granada, plaza toros granada, carpooling Granada Málaga festivales, viaje compartido Granada Cala Mijas, Granada carpooling festival, agenda conciertos granada, conciertos granada 2026`,
  },
  cordoba: {
    title: `Conciertos en Córdoba ${YEAR} [Palacio Deportes + Gran Teatro]`,
    description: `Agenda conciertos Córdoba ${YEAR}: Palacio de los Deportes Vista Alegre (10.500 plazas), Gran Teatro de Córdoba (1.227), Plaza de Toros Los Califas, Festival.`,
    keywords: `conciertos Córdoba ${YEAR}, conciertos en Córdoba, próximos conciertos Córdoba, Palacio Deportes Vista Alegre Cordoba, Gran Teatro Córdoba, festival patios cordoba, plaza toros cordoba, carpooling Córdoba Sevilla festivales, viaje compartido Córdoba La Cartuja, Córdoba carpooling, agenda conciertos cordoba, conciertos cordoba 2026`,
  },
  "santiago-de-compostela": {
    title: `Conciertos Santiago de Compostela ${YEAR} · Carpooling | ConcertRide`,
    description: `Conciertos en Santiago de Compostela ${YEAR}: Multiusos do Sar, Auditorio de Galicia. 0% comisión, conductores verificados.`,
    keywords: `conciertos Santiago de Compostela ${YEAR}, conciertos en Santiago, O Son do Camiño Santiago, Monte do Gozo carpooling, carpooling Santiago festivales, viaje compartido Santiago Galicia, conciertos Santiago Galicia ${YEAR}`,
  },
  pontevedra: {
    title: `Conciertos Pontevedra ${YEAR} · Carpooling | ConcertRide`,
    description: `Conciertos en Pontevedra ${YEAR}: Pazo da Cultura, Recinto Ferial. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `conciertos Pontevedra ${YEAR}, conciertos en Pontevedra, carpooling Pontevedra Santiago, viaje compartido Pontevedra O Son do Camiño, Pontevedra Resurrection Fest carpooling, festivales Galicia Pontevedra`,
  },
  lugo: {
    title: `Conciertos Lugo ${YEAR} · Carpooling | ConcertRide`,
    description: `Conciertos en Lugo ${YEAR}: Pazo de Feiras e Congresos, Auditorio Gustavo Freire. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `conciertos Lugo ${YEAR}, conciertos en Lugo, Resurrection Fest desde Lugo, carpooling Lugo Viveiro, viaje compartido Lugo Galicia festivales, Caudal Fest Lugo, Lugo carpooling festival`,
  },
  oviedo: {
    title: `Conciertos en Oviedo ${YEAR} [Palacio Deportes + Campoamor] 4€`,
    description: `Agenda conciertos Oviedo ${YEAR}: Palacio de los Deportes (5.500 plazas), Teatro Campoamor (sede Premios Princesa de Asturias), Plaza de Toros Oviedo.`,
    keywords: `conciertos Oviedo ${YEAR}, conciertos en Oviedo, conciertos Asturias ${YEAR}, Palacio Deportes Oviedo, Teatro Campoamor Oviedo, auditorio principe felipe oviedo, plaza toros oviedo, carpooling Oviedo festivales, viaje compartido Oviedo Galicia, Oviedo BBK Live carpooling, Oviedo Resurrection Fest, agenda conciertos oviedo`,
  },
  gijon: {
    title: `Conciertos en Gijón ${YEAR} [Metrópoli + El Bibio]: 5€`,
    description: `Agenda conciertos Gijón ${YEAR}: Festival Internacional Metrópoli Gijón (julio), Plaza de Toros El Bibio, Palacio Deportes Mata-Jove, Teatro Jovellanos.`,
    keywords: `conciertos Gijón ${YEAR}, conciertos en Gijón, Metrópoli Gijón ${YEAR}, plaza toros el bibio gijon, palacio deportes mata jove, jovellanos gijon, carpooling Gijón festivales, viaje compartido Gijón Asturias, Gijón Resurrection Fest carpooling, agenda conciertos gijon, conciertos gijon 2026`,
  },
  castellon: {
    title: `Conciertos en Castellón ${YEAR} · ConcertRide`,
    description: `Conciertos en Castellón ${YEAR}: festivales junto a casa — Arenal Sound Burriana (10 km, lanzadera oficial 5–8€), FIB Benicàssim (15 km, Cercanías 1,75€).`,
    keywords: `conciertos Castellón ${YEAR}, conciertos en castellon, conciertos castellón 2026, agenda conciertos castellon, arenal sound castellon, fib castellon, lanzadera arenal sound, festivales castellon, castellon de la plana conciertos, castellon festivales transporte`,
  },
  tarragona: {
    title: `Conciertos en Tarragona ${YEAR} · ConcertRide`,
    description: `Conciertos en Tarragona ${YEAR}: Reggaeton Beach Festival Salou (jul), Tarraco Arena Plaça, Auditori Diputació. 0% comisión, conductores verificados.`,
    keywords: `conciertos Tarragona ${YEAR}, conciertos en tarragona, conciertos tarragona 2026, agenda conciertos tarragona, reggaeton beach festival salou, tarraco arena conciertos, tarragona festivales catalanes, salou festival, conciertos costa daurada`,
  },
  // ── Wave 9 — 26 nuevas ciudades, festival-venue cities + Canarias ─────────
  "las-palmas-de-gran-canaria": {
    title: `Conciertos en Las Palmas ${YEAR} [Gran Canaria Arena + Womad]`,
    description: `Agenda conciertos Las Palmas de Gran Canaria ${YEAR}: Gran Canaria Arena (12.000 plazas), Auditorio Alfredo Kraus (1.668), Plaza de la Música, Estadio de.`,
    keywords: `conciertos Las Palmas ${YEAR}, conciertos en gran canaria, conciertos canarias, womad las palmas, gran canaria arena conciertos, granca live fest, alfredo kraus conciertos, festivales canarias, conciertos las palmas 2026, estadio gran canaria conciertos`,
  },
  "santa-cruz-de-tenerife": {
    title: `Conciertos en Tenerife ${YEAR} [Adán Martín + Carnaval]: 0%`,
    description: `Agenda conciertos en Santa Cruz de Tenerife ${YEAR}: Auditorio Adán Martín (1.616 plazas — Calatrava), Pabellón Santiago Martín La Laguna (5.500 plazas).`,
    keywords: `conciertos Tenerife ${YEAR}, conciertos santa cruz tenerife, carnaval santa cruz tenerife, conciertos canarias, auditorio adan martin, santiago martin la laguna, festivales tenerife, agenda conciertos tenerife, conciertos tenerife 2026, tenerife festivales`,
  },
  cartagena: {
    title: `Conciertos en Cartagena ${YEAR} · ConcertRide`,
    description: `Conciertos en Cartagena ${YEAR}: La Mar de Músicas Festival (julio, world music, 25 ediciones), Cartagena Jazz Festival (noviembre), Plaza de Toros (12.000.`,
    keywords: `conciertos Cartagena ${YEAR}, conciertos en Cartagena, La Mar de Musicas Cartagena, Cartagena Jazz Festival, plaza toros cartagena, auditorio el batel, carpooling Cartagena festivales`,
  },
  "jerez-de-la-frontera": {
    title: `Conciertos en Jerez de la Frontera ${YEAR} · ConcertRide`,
    description: `Conciertos en Jerez ${YEAR}: Tío Pepe Festival (julio–agosto, Bodegas González Byass, Pet Shop Boys/Robbie Williams), Festival de Jerez flamenco (feb–mar, 3.`,
    keywords: `conciertos Jerez ${YEAR}, conciertos en jerez de la frontera, tio pepe festival jerez, festival flamenco jerez, circuito jerez conciertos, conciertos cadiz provincia, agenda conciertos jerez`,
  },
  elche: {
    title: `Conciertos en Elche ${YEAR} · Carpooling sin comisión | ConcertRide`,
    description: `Conciertos en Elche ${YEAR}: Festival Elx (julio, mediterráneo), Pabellón Esperanza Lag (5.000), Auditorio Centro de Congresos. Carpooling sin comisión a Low.`,
    keywords: `conciertos Elche ${YEAR}, conciertos en elx, festival elx, conciertos en elche 2026, conciertos alicante provincia, carpooling elche festivales, agenda conciertos elche`,
  },
  "aranda-de-duero": {
    title: `Conciertos en Aranda de Duero ${YEAR} · ConcertRide`,
    description: `Aranda de Duero (Burgos): sede de Sonorama Ribera ${YEAR} (6–9 ago, 75.000 asistentes/día). 0% comisión, conductores verificados.`,
    keywords: `Sonorama Ribera ${YEAR}, conciertos Aranda de Duero, aranda de duero sonorama, plaza del trigo sonorama, sonorama ribera carpooling, sonorama desde madrid, conciertos aranda duero burgos`,
  },
  burriana: {
    title: `Conciertos en Burriana ${YEAR} · ConcertRide`,
    description: `Burriana (Castellón): sede de Arenal Sound ${YEAR} (29 jul–2 ago, 250.000 asistentes acumulados, 5 días). 0% comisión, conductores verificados.`,
    keywords: `Arenal Sound Burriana, conciertos burriana, burriana arenal sound, playa burriana arenal sound, lanzadera arenal sound burriana, autobus castellon burriana, arenal sound desde valencia, beach camp burriana`,
  },
  mijas: {
    title: `Conciertos en Mijas ${YEAR} · Cala Mijas + carpooling | ConcertRide`,
    description: `Mijas (Málaga): sede de Cala Mijas Festival ${YEAR} (2–4 oct, Cortijo de Torres). 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `Cala Mijas Festival, conciertos en Mijas, mijas pueblo conciertos, cortijo de torres mijas, cala mijas como llegar, mijas costa del sol, carpooling mijas festival`,
  },
  marbella: {
    title: `Conciertos en Marbella ${YEAR} · ConcertRide`,
    description: `Conciertos en Marbella ${YEAR}: Starlite Festival (Cantera de Nagüeles, jul–ago, anfiteatro 7.500 plazas, cabezas de cartel internacionales todo el verano).`,
    keywords: `Starlite Festival Marbella, conciertos en Marbella, cantera de nagueles, marbella conciertos verano, conciertos costa del sol, carpooling marbella, starlite cabezas de cartel`,
  },
  fuengirola: {
    title: `Conciertos en Fuengirola ${YEAR} · ConcertRide`,
    description: `Conciertos en Fuengirola (Málaga) ${YEAR}: Marenostrum Fuengirola Festival en Sohail Castle Park (jul–ago, 15.000 plazas, 50 Cent/Bryan Adams/Iggy Pop).`,
    keywords: `Marenostrum Fuengirola, conciertos Fuengirola, sohail castle park, fuengirola castle park festival, cercanias malaga fuengirola, fuengirola cala mijas, carpooling costa del sol fuengirola`,
  },
  merida: {
    title: `Conciertos Mérida ${YEAR}: Stone & Music + carpooling | ConcertRide`,
    description: `Conciertos en Mérida ${YEAR}: Stone & Music Festival en el Teatro Romano de Mérida (siglo I a.C., 7.000 plazas, conciertos pop/rock con cabezas de cartel.`,
    keywords: `Stone Music Festival Merida, conciertos teatro romano merida, festival merida teatro clasico, conciertos extremadura, conciertos en merida 2026, carpooling merida festival`,
  },
  ibiza: {
    title: `Conciertos en Ibiza ${YEAR}: Ushuaïa, Hï + carpooling | ConcertRide`,
    description: `Eivissa/Ibiza ${YEAR}: David Guetta y Calvin Harris en residencias semanales — Ushuaïa (open-air, 7.000 plazas), Hï Ibiza, Pacha, Amnesia, DC10.`,
    keywords: `conciertos Ibiza ${YEAR}, ushuaia ibiza, hi ibiza, pacha ibiza, david guetta ibiza, calvin harris ibiza, conciertos eivissa, festivales ibiza electronica, ferry barcelona ibiza, eivissa carpooling`,
  },
  sabadell: {
    title: `Conciertos en Sabadell ${YEAR} · ConcertRide`,
    description: `Conciertos en Sabadell (Barcelona) ${YEAR}: Embassa't Festival (junio, indie/electrónica Parc de Catalunya), Pavelló Olímpic, Teatre La Faràndula. Renfe.`,
    keywords: `conciertos Sabadell, embassa't festival sabadell, pavellon olimpic sabadell, sabadell barcelona conciertos, carpooling vallés occidental, festivales catalanes sabadell`,
  },
  terrassa: {
    title: `Conciertos en Terrassa ${YEAR} · ConcertRide`,
    description: `Conciertos en Terrassa (Barcelona) ${YEAR}: Festival de Jazz de Terrassa (marzo, 45 ediciones, Pat Metheny, Brad Mehldau), Centre Cultural Terrassa, Auditori.`,
    keywords: `conciertos Terrassa, festival jazz terrassa, jazz terrassa cataluña, terrassa barcelona carpooling, terrassa centre cultural, festivales catalanes`,
  },
  mataro: {
    title: `Conciertos en Mataró ${YEAR} · Carpooling Maresme | ConcertRide`,
    description: `Conciertos en Mataró (Maresme) ${YEAR}: Teatre Monumental, Pavelló de Mataró, Maresme Music Days (verano gratuito). 0% comisión, conductores verificados.`,
    keywords: `conciertos Mataró, maresme music days, conciertos maresme, mataro barcelona carpooling, festivales costa catalana, mataro festivales`,
  },
  reus: {
    title: `Conciertos en Reus ${YEAR} · Carpooling Tarragona | ConcertRide`,
    description: `Conciertos en Reus (Tarragona) ${YEAR}: Festival Trapezi (mayo, circo contemporáneo), Teatre Bartrina, Pavelló Olímpic. 0% comisión, conductores verificados.`,
    keywords: `conciertos Reus, festival trapezi reus, conciertos tarragona provincia, teatre bartrina reus, reus barcelona carpooling, costa daurada conciertos`,
  },
  manresa: {
    title: `Conciertos en Manresa ${YEAR} · ConcertRide`,
    description: `Conciertos en Manresa (Bages, Barcelona) ${YEAR}: Hipnotik Festival (junio, hip-hop), Kursaal de Manresa, Nou Congost. 0% comisión, conductores verificados.`,
    keywords: `conciertos Manresa, hipnotik festival manresa, kursaal manresa, manresa barcelona carpooling, bages festival, festivales catalanes`,
  },
  huesca: {
    title: `Conciertos Huesca ${YEAR}: Pirineos Sur + carpooling | ConcertRide`,
    description: `Conciertos en Huesca ${YEAR}: Periferias Festival (otoño, world music), Festival Cine Huesca (junio), Palacio de Congresos, Pabellón Polideportivo. Hub para.`,
    keywords: `conciertos Huesca, periferias festival huesca, pirineos sur lanuza, festival cine huesca, huesca conciertos 2026, aragon festivales pirineo, carpooling huesca`,
  },
  benidorm: {
    title: `Conciertos en Benidorm ${YEAR} · ConcertRide`,
    description: `Conciertos en Benidorm (Alicante) ${YEAR}: Low Festival (24–26 jul, 65.000 asistentes acumulados, Ciudad Deportiva Guillermo Amor), Benidorm Fest (febrero.`,
    keywords: `conciertos Benidorm, low festival benidorm, benidorm fest, benidorm pride, ciudad deportiva guillermo amor, low festival como llegar, costa blanca festivales`,
  },
  algeciras: {
    title: `Conciertos en Algeciras ${YEAR} · ConcertRide`,
    description: `Conciertos en Algeciras (Cádiz) ${YEAR}: Algeciras Entre Dos Continentes (junio, world music), Palacio de los Deportes Las Palmeras, Plaza de Toros Las.`,
    keywords: `conciertos Algeciras, algeciras entre dos continentes, algeciras conciertos, conciertos campo gibraltar, carpooling andalucia algeciras, algeciras festivales`,
  },
  aviles: {
    title: `Conciertos Avilés ${YEAR}: Niemeyer + carpooling | ConcertRide`,
    description: `Conciertos en Avilés (Asturias) ${YEAR}: Centro Niemeyer (Oscar Niemeyer, plaza para 8.000 personas), Plaza de España, Pabellón Quirinal. Festival propio.`,
    keywords: `conciertos Avilés, centro niemeyer aviles, aviles festivales, conciertos asturias, aviles bbk live carpooling, festival celsius aviles`,
  },
  ponferrada: {
    title: `Conciertos en Ponferrada ${YEAR} · ConcertRide`,
    description: `Conciertos en Ponferrada (León) ${YEAR}: Pabellón Lydia Valentín, Castillo de los Templarios (escenario urbano), Festival 2 días Ponferrada (verano). Hub.`,
    keywords: `conciertos Ponferrada, ponferrada bierzo conciertos, castillo templarios ponferrada, festival 2 dias ponferrada, conciertos leon provincia, carpooling ponferrada galicia`,
  },
  "talavera-de-la-reina": {
    title: `Conciertos en Talavera de la Reina ${YEAR} · ConcertRide`,
    description: `Conciertos en Talavera de la Reina (Toledo) ${YEAR}: Palacio de Ferias y Congresos, Plaza de Toros La Caprichosa, Mondas Talavera (septiembre, fiestas.`,
    keywords: `conciertos Talavera de la Reina, mondas talavera, talavera reina conciertos, conciertos toledo provincia, carpooling talavera mad cool`,
  },
  mostoles: {
    title: `Conciertos en Móstoles ${YEAR} · ConcertRide`,
    description: `Conciertos en Móstoles (Madrid) ${YEAR}: Pabellón Andrés Torrejón, Teatro del Bosque. 0% comisión, conductores verificados.`,
    keywords: `conciertos Mostoles, conciertos en mostoles, mostoles madrid carpooling, mostoles mad cool, andres torrejon mostoles, cinturon sur madrid carpooling`,
  },
  "alcala-de-henares": {
    title: `Conciertos en Alcalá de Henares ${YEAR} · ConcertRide`,
    description: `Conciertos en Alcalá de Henares (Madrid) ${YEAR}: Teatro Salón Cervantes, Plaza de Cervantes (escenarios al aire libre, 8.000 personas), Festival Don Juan en.`,
    keywords: `conciertos Alcala de Henares, don juan en alcala, festival sefarad, conciertos alcala madrid, alcala henares carpooling, alcala mad cool`,
  },
  getafe: {
    title: `Conciertos en Getafe ${YEAR} · Carpooling a Mad Cool | ConcertRide`,
    description: `Conciertos en Getafe (Madrid) ${YEAR}: Coliseum Alfonso Pérez (estadio del Getafe CF, eventos music & lifestyle), Pabellón Juan de la Cierva, Centro Cultural.`,
    keywords: `conciertos Getafe, coliseum alfonso perez conciertos, getafe madrid carpooling, getafe mad cool, getafe cf eventos`,
  },
  gandia: {
    title: `Conciertos en Gandia ${YEAR} · Polifònic + carpooling | ConcertRide`,
    description: `Conciertos en Gandia (Valencia) ${YEAR}: Polifònic Festival (julio, indie/pop, formato playa), Tu Otro Verano Music Festival, Auditori del Raval, Pavelló.`,
    keywords: `conciertos Gandia, polifonic festival gandia, gandia valencia conciertos, gandia medusa festival, la safor festivales, gandia carpooling`,
  },
  leon: {
    title: `Conciertos en León ${YEAR} · Carpooling | ConcertRide`,
    description: `Conciertos en León ${YEAR}: Palacio Municipal de los Deportes, Auditorio Ciudad de León. 0% comisión, conductores verificados.`,
    keywords: `conciertos León ${YEAR}, conciertos en León, León festivales carpooling, viaje compartido León Resurrection Fest, León BBK Live carpooling, conciertos leon 2026`,
  },
  "valladolid-upgrade": {
    title: `Conciertos Valladolid ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Agenda conciertos Valladolid ${YEAR}: Sala Porta Caeli, Auditorio Miguel Delibes. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `conciertos Valladolid ${YEAR}, conciertos en Valladolid, Sonorama desde Valladolid, carpooling Valladolid festivales, valladolid bbk live carpooling, conciertos valladolid 2026`,
  },
  cadiz: {
    title: `Conciertos en Cádiz ${YEAR} · Carpooling | ConcertRide`,
    description: `Conciertos en Cádiz ${YEAR}: Gran Teatro Falla, Estadio Carranza. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `conciertos Cádiz ${YEAR}, conciertos en Cádiz, Tío Pepe Festival desde Cádiz, carpooling Cádiz festivales, cádiz sevilla concierto, conciertos cadiz 2026`,
  },
  huelva: {
    title: `Conciertos en Huelva ${YEAR} · Carpooling | ConcertRide`,
    description: `Conciertos en Huelva ${YEAR}: Palacio de los Deportes, Plaza de Toros Huelva. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `conciertos Huelva ${YEAR}, conciertos en Huelva, La Cartuja desde Huelva, carpooling Huelva festivales, conciertos huelva 2026, huelva sevilla festival`,
  },
  jaen: {
    title: `Conciertos en Jaén ${YEAR} · Carpooling | ConcertRide`,
    description: `Conciertos en Jaén ${YEAR}: Auditorio Municipal Ciudad de Jaén, Estadio de La Victoria. 0% comisión, conductores verificados.`,
    keywords: `conciertos Jaén ${YEAR}, conciertos en Jaén, Granada Sound desde Jaén, carpooling Jaén festivales, conciertos jaen 2026, jaen cala mijas carpooling`,
  },
  // ── Wave 2 — Tier 1/3 fillers (palma, almeria) ──────────────────────────────
  palma: {
    title: `Conciertos en Palma ${YEAR} [Mallorca Live + Son Moix]: 5€`,
    description: `Agenda conciertos Palma de Mallorca ${YEAR}: Mallorca Live Festival (Calvià, 12–14 jun, 50.000/día — Robbie Williams/Jamiroquai/Iggy Pop), Palau Municipal.`,
    keywords: `conciertos Palma ${YEAR}, conciertos Mallorca, mallorca live festival, palau son moix conciertos, velodromo illes balears, conciertos palma de mallorca 2026, festivales baleares, ferry barcelona palma, agenda conciertos palma, palma mallorca conciertos verano, mallorca festivales`,
  },
  almeria: {
    title: `Conciertos en Almería ${YEAR} [Dreambeach + Cala Mijas]: 4€`,
    description: `Agenda conciertos Almería ${YEAR}: Palacio de los Deportes José Ángel Puertas, Auditorio Maestro Padilla, Plaza de Toros de Almería. Dreambeach Villaricos.`,
    keywords: `conciertos Almería ${YEAR}, conciertos en Almería, Dreambeach Villaricos, dreambeach vera almeria, palacio deportes almeria, auditorio maestro padilla, conciertos almeria 2026, festivales almeria, carpooling almeria dreambeach, almeria cala mijas, agenda conciertos almeria`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// "CÓMO LLEGAR" PAGE DESCRIPTIONS (used by HowToGetTherePage.tsx)
// ─────────────────────────────────────────────────────────────────────────────

export const HOW_TO_GET_THERE_SEO: Record<string, { title: string; description: string; keywords?: string }> = {
  "arenal-sound": {
    title: `Cómo llegar a Arenal Sound ${YEAR} [Burriana]: Bus + carpooling 3€`,
    description: `Arenal Sound ${YEAR} Burriana (Castellón): bus lanzadera oficial Castellón→Burriana (5–8€, cada 30 min desde 16:00), tren Cercanías C6 Valencia–Castellón (45.`,
    keywords: `como llegar arenal sound ${YEAR}, arenal sound transporte, autobus castellon burriana arenal sound, tren arenal sound, arenal sound bus, arenal sound localización, como ir al arenal sound, arenal sound autobuses, buses arenal sound castellon, arenal sound desde valencia, arenal sound desde madrid, arenal sound shuttle, arenal sound como llegar desde castellon`,
  },
  "bbk-live": {
    title: `Cómo llegar a BBK Live ${YEAR} [Kobetamendi]: Lanzadera gratis + 3€`,
    description: `BBK Live ${YEAR} Kobetamendi Bilbao: lanzadera gratuita oficial desde Plaza Moyúa incluida en la entrada. 0% comisión, conductores verificados.`,
    keywords: `como llegar bbk live ${YEAR}, bbk live transporte, bbk live lanzadera, bbk live bus, bbk live como llegar bilbao, carpooling bbk live, bbk live kobetamendi, bbk live desde madrid, bbk live desde donostia`,
  },
  "mad-cool": {
    title: `Cómo llegar a Mad Cool ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Mad Cool Festival ${YEAR} Iberdrola Music (Villaverde Bajo, Madrid, Av. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `como llegar mad cool ${YEAR}, mad cool transporte, mad cool metro l3, mad cool como llegar, mad cool iberdrola music, mad cool villaverde, mad cool carpooling, mad cool desde barcelona, mad cool desde valencia, mad cool parking, mad cool metro pradolongo, mad cool metro legazpi`,
  },
  "primavera-sound": {
    title: `Cómo llegar a Primavera Sound ${YEAR} [Fòrum BCN]: Metro L4 + 8€`,
    description: `Primavera Sound Barcelona ${YEAR} Parc del Fòrum: metro L4 parada Besòs Mar (10 min andando). 0% comisión, conductores verificados.`,
    keywords: `como llegar primavera sound ${YEAR}, primavera sound transporte, primavera sound metro barcelona, primavera sound metro l4 besos mar, primavera sound carpooling madrid, primavera sound forum como llegar`,
  },
  "vina-rock": {
    title: `Cómo llegar a Viña Rock ${YEAR} Villarrobledo: Bus + carpooling 6€`,
    description: `Viña Rock ${YEAR} La Pulgosa, Villarrobledo (Albacete): bus lanzadera oficial Albacete→Villarrobledo (40 min, 8–12€). 0% comisión, conductores verificados.`,
    keywords: `como llegar viña rock ${YEAR}, viña rock transporte, viña rock bus, viña rock autobús, buses viña rock, viña rock carpooling, autobus viña rock, viña rock como llegar, viña rock localización, viña rock desde madrid, viña rock villarrobledo`,
  },
  "cala-mijas": {
    title: `Cómo llegar a Cala Mijas ${YEAR} Málaga: Carpooling 3€ + bus`,
    description: `Cala Mijas Fest ${YEAR} Cortijo de Torres (Mijas, Málaga): sin shuttle oficial gratuito. 0% comisión, conductores verificados.`,
    keywords: `como llegar cala mijas ${YEAR}, cala mijas transporte, cala mijas carpooling, cala mijas festival málaga, cortijo de torres cómo llegar, cala mijas desde malaga, cala mijas shuttle`,
  },
  "resurrection-fest": {
    title: `Cómo llegar a Resurrection Fest ${YEAR} [Viveiro]: Carpooling 4€`,
    description: `Resurrection Fest ${YEAR} Viveiro (Lugo, Galicia): SIN autobús nocturno — el carpooling es la opción principal de vuelta. 0% comisión, conductores verificados.`,
    keywords: `como llegar resurrection fest ${YEAR}, resurrection fest transporte, resurrection fest viajes, resurrection fest carpooling, resurrection fest viveiro como llegar, resurrection fest desde madrid, resurrection fest desde a coruña, resurrection fest nocturno`,
  },
  "zevra-festival": {
    title: `Cómo llegar a Zevra Festival ${YEAR} · Carpooling | ConcertRide`,
    description: `Zevra Festival ${YEAR} La Marina Valencia: metro L4 La Marina, bus EMT. Carpooling desde Madrid (16–22€), Barcelona (14–20€), Alicante (8–12€). Sin comisión.`,
    keywords: `como llegar zevra festival ${YEAR}, zevra festival bus horarios, zevra festival metro, zevra festival transporte, zevra festival valencia carpooling`,
  },
  "sonar": {
    title: `Cómo llegar a Sónar ${YEAR} [Fira BCN]: Metro L9 + carpooling 8€`,
    description: `Sónar ${YEAR} Fira Gran Via (L'Hospitalet): metro L9 Sur parada Fira (5 min andando). 0% comisión, conductores verificados.`,
    keywords: `como llegar sonar barcelona ${YEAR}, sonar metro, sonar transporte, sonar barcelona metro l9, sonar fira gran via como llegar, sonar fira montjuic, carpooling sonar, sonar desde madrid`,
  },
  "fib": {
    title: `Cómo llegar al FIB ${YEAR} [Benicàssim]: Bus + Cercanías + 3€`,
    description: `FIB ${YEAR} Benicàssim (Castellón): bus lanzadera Fiberbus desde Castellón (15 km, 15 min, 3–5€), tren Cercanías C6 Valencia–Castellón (45 min, 3,90€).`,
    keywords: `como llegar fib benicassim ${YEAR}, fib transporte, fib bus lanzadera castellon, fib tren cercanias, fib benicassim carpooling, fib como llegar, fiberbus, fib desde valencia`,
  },
  "low-festival": {
    title: `Cómo llegar a Low Festival ${YEAR} [Benidorm]: TRAM L9 + 3€`,
    description: `Low Festival Benidorm ${YEAR} (agosto): tren TRAM L9 Alicante–Benidorm (50 min, 3,55€). 0% comisión, conductores verificados.`,
    keywords: `como llegar low festival benidorm ${YEAR}, low festival transporte, low festival tren, low festival tram l9, low festival bus, low festival carpooling, benidorm festival como llegar, low festival desde alicante`,
  },
  "cruilla": {
    title: `Cómo llegar a Cruïlla ${YEAR} [Fòrum BCN]: Metro L4 + 8€`,
    description: `Cruïlla Barcelona ${YEAR} Parc del Fòrum (julio): metro L4 parada Besòs Mar (10 min andando). 0% comisión, conductores verificados.`,
    keywords: `como llegar cruilla barcelona ${YEAR}, cruilla metro l4, cruilla transporte, cruilla forum carpooling, cruilla barcelona como llegar, cruilla besos mar, cruilla desde madrid`,
  },
  "sonorama-ribera": {
    title: `Cómo llegar a Sonorama Ribera ${YEAR} [Aranda]: Bus + 4€`,
    description: `Sonorama Ribera ${YEAR} Aranda de Duero (agosto): ALSA Madrid→Aranda (2h, 12–18€), bus desde Burgos (1h, 6–10€), Renfe Madrid–Aranda (2h, 15–25€). Carpooling.`,
    keywords: `como llegar sonorama ribera ${YEAR}, sonorama transporte, sonorama aranda de duero bus, sonorama tren, sonorama ribera carpooling, como ir sonorama, sonorama desde madrid, alsa aranda`,
  },
  "o-son-do-camino": {
    title: `Cómo llegar a O Son do Camiño ${YEAR} · Carpooling | ConcertRide`,
    description: `O Son do Camiño ${YEAR} Monte do Gozo, Santiago de Compostela: autobús urbano hasta Monte do Gozo, tren AVE a Santiago. 0% comisión, conductores verificados.`,
    keywords: `como llegar o son do camino ${YEAR}, o son do camiño transporte, o son do camino bus santiago, o son do camiño carpooling, monte do gozo como llegar`,
  },
  "medusa-festival": {
    title: `Cómo llegar a Medusa Festival ${YEAR} [Cullera]: Lanzadera + 3€`,
    description: `Medusa Festival ${YEAR} Playa de Cullera (Valencia): lanzadera oficial desde Valencia y Gandía (5–8€). 0% comisión, conductores verificados.`,
    keywords: `como llegar medusa festival ${YEAR}, medusa festival transporte, medusa festival bus, medusa festival lanzadera, medusa festival cullera como llegar, carpooling medusa festival, medusa festival desde valencia, medusa festival desde madrid, transporte medusa festival ${YEAR}, medusa cercanias`,
  },
  "festival-ortigueira": {
    title: `Cómo llegar al Festival de Ortigueira ${YEAR} | ConcertRide`,
    description: `Festival Internacional do Mundo Celta de Ortigueira ${YEAR} (A Coruña): sin estación de tren propia. 0% comisión, conductores verificados.`,
    keywords: `como llegar festival ortigueira ${YEAR}, ortigueira transporte, festival ortigueira bus, ortigueira como ir, festival ortigueira carpooling, ortigueira camping, festival ortigueira gratis, mundo celta ortigueira como llegar`,
  },
  "jazzaldia": {
    title: `Cómo llegar al Jazzaldia ${YEAR} · Carpooling | ConcertRide`,
    description: `Heineken Jazzaldia ${YEAR} Donostia (22–26 jul): Renfe Madrid–Donostia (4h 30 min, 35–60€), ALSA (5h 30 min, 25–45€), Dbus urbano. Carpooling desde Bilbao.`,
    keywords: `como llegar jazzaldia ${YEAR}, jazzaldia transporte, jazzaldia donostia como llegar, jazzaldia san sebastian transporte, jazzaldia bus, jazzaldia carpooling, jazzaldia desde bilbao, festival jazz donostia como llegar`,
  },
  "metropoli-gijon": {
    title: `Cómo llegar a Metrópoli Gijón ${YEAR} · Carpooling | ConcertRide`,
    description: `Metrópoli Gijón ${YEAR} (Recinto Ferial Luis Adaro): bus urbano Emtusa 1/14/18, Cercanías Renfe Oviedo–Gijón hasta Sanz Crespo. Carpooling desde Oviedo (30.`,
    keywords: `como llegar metropoli gijon ${YEAR}, metropoli gijon transporte, metropoli gijon bus, metropoli gijon cercanias, metropoli gijon carpooling, recinto ferial luis adaro como llegar, metropoli desde oviedo, festival gijon transporte`,
  },
  "granada-sound": {
    title: `Cómo llegar a Granada Sound ${YEAR} · Carpooling | ConcertRide`,
    description: `Granada Sound ${YEAR} (Cortijo del Conde Granada): bus lanzadera oficial desde Estación de Autobuses (5–7€). 0% comisión, conductores verificados.`,
    keywords: `como llegar granada sound ${YEAR}, granada sound transporte, granada sound shuttle, granada sound bus, granada sound carpooling, granada sound cortijo del conde como llegar, granada sound desde malaga, granada sound desde madrid`,
  },
  "pirineos-sur": {
    title: `Cómo llegar a Pirineos Sur ${YEAR} · Carpooling | ConcertRide`,
    description: `Pirineos Sur ${YEAR} (Lanuza, Sallent de Gállego): SIN transporte público al pueblo. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `como llegar pirineos sur ${YEAR}, pirineos sur transporte, pirineos sur lanuza como llegar, sallent de gallego festival, pirineos sur carpooling, pirineos sur desde huesca, pirineos sur desde zaragoza`,
  },
  "starlite-marbella": {
    title: `Cómo llegar a Starlite Marbella ${YEAR} · Carpooling | ConcertRide`,
    description: `Starlite Marbella ${YEAR} (Cantera de Nagüeles): lanzadera oficial desde Hotel Don Pepe Marbella + Plaza de la Iglesia. 0% comisión, conductores verificados.`,
    keywords: `como llegar starlite marbella ${YEAR}, starlite transporte, cantera de nagueles como llegar, starlite shuttle marbella, starlite carpooling, starlite desde malaga, starlite desde madrid`,
  },
  "stone-music-festival": {
    title: `Cómo llegar a Stone & Music Mérida ${YEAR} | ConcertRide`,
    description: `Stone & Music Festival ${YEAR} (Teatro Romano Mérida): centro histórico, 5 min andando de Plaza España. 0% comisión, conductores verificados.`,
    keywords: `como llegar stone music merida ${YEAR}, stone music transporte, teatro romano merida como llegar, stone music carpooling, stone music desde madrid, stone music desde sevilla, festival merida transporte`,
  },
  "marenostrum-fuengirola": {
    title: `Cómo llegar a Marenostrum Fuengirola ${YEAR} | ConcertRide`,
    description: `Marenostrum Fuengirola ${YEAR} (Sohail Castle Park): Cercanías Renfe C-1 Málaga–Fuengirola (35 min, 3,90€) + 15 min andando. 0% comisión, conductores verificados.`,
    keywords: `como llegar marenostrum fuengirola ${YEAR}, marenostrum transporte, sohail castle park como llegar, fuengirola castle park, marenostrum cercanias, marenostrum carpooling, fuengirola conciertos`,
  },
  "tio-pepe-festival": {
    title: `Cómo llegar a Tío Pepe Festival ${YEAR} · Carpooling | ConcertRide`,
    description: `Tío Pepe Festival ${YEAR} (Bodegas González Byass Jerez): centro de Jerez, 5 min Plaza Arenal. 0% comisión, conductores verificados.`,
    keywords: `como llegar tio pepe festival ${YEAR}, tio pepe transporte, bodegas gonzalez byass como llegar, tio pepe jerez tren, tio pepe carpooling, tio pepe desde sevilla, tio pepe desde madrid`,
  },
  "tomavistas": {
    title: `Cómo llegar a Tomavistas ${YEAR} Madrid [Retiro]: Metro L2 + 3€`,
    description: `Tomavistas ${YEAR} Jardines del Buen Retiro Madrid (15–17 mayo): metro L2 parada Retiro o L9 Ibiza (5 min andando). 0% comisión, conductores verificados.`,
    keywords: `como llegar tomavistas ${YEAR}, tomavistas transporte, tomavistas metro retiro, tomavistas como llegar madrid, tomavistas carpooling, tomavistas desde valencia, tomavistas desde toledo, jardines retiro tomavistas`,
  },
  "rototom-sunsplash": {
    title: `Cómo llegar al Rototom ${YEAR} [Benicàssim]: Cercanías + 4€`,
    description: `Rototom Sunsplash ${YEAR} Benicàssim (Castellón, 8 días agosto): Renfe Cercanías C6 Valencia–Castellón (45 min, 4–6€) + lanzadera Fiberbus/Sounder desde.`,
    keywords: `como llegar rototom ${YEAR}, rototom transporte, rototom sunsplash benicassim, rototom cercanias renfe, rototom lanzadera castellon, rototom carpooling, rototom desde valencia, rototom desde barcelona, rototom camping`,
  },
  "atlantic-fest": {
    title: `Cómo llegar a Atlantic Fest ${YEAR} [Vilagarcía]: Carpooling 3€`,
    description: `Atlantic Fest ${YEAR} Recinto Fexdega Vilagarcía de Arousa (Pontevedra, 17–19 jul): Renfe Cercanías Vigo–Vilagarcía con horarios limitados, ALSA desde.`,
    keywords: `como llegar atlantic fest ${YEAR}, atlantic fest transporte, atlantic fest vilagarcia, atlantic fest fexdega como llegar, atlantic fest carpooling, atlantic fest desde vigo, atlantic fest desde santiago, atlantic fest renfe`,
  },
  "portamerica": {
    title: `Cómo llegar a PortAmérica ${YEAR} [Caldas de Reis]: Carpooling 3€`,
    description: `PortAmérica ${YEAR} Finca Montecelo, Caldas de Reis (Pontevedra, 9–11 jul): SIN transporte público directo al recinto — el carpooling es la opción real.`,
    keywords: `como llegar portamerica ${YEAR}, portamerica transporte, portamerica caldas de reis, portamerica finca montecelo, portamerica carpooling, portamerica desde santiago, portamerica desde vigo, portamerica camping`,
  },
  "sos-48": {
    title: `Cómo llegar a SOS 4.8 ${YEAR} [La Fica Murcia]: Bus + 3€`,
    description: `SOS 4.8 ${YEAR} Recinto Ferial La Fica, Murcia (8–9 mayo): bus urbano LATBUS líneas 30/39 desde Av. 0% comisión, conductores verificados.`,
    keywords: `como llegar sos 48 ${YEAR}, sos 4.8 transporte, sos 48 la fica murcia, sos 48 bus latbus, sos 48 tranvia, sos 48 carpooling, sos 48 desde alicante, sos 48 desde madrid, festival murcia como llegar`,
  },
  "vive-latino": {
    title: `Cómo llegar a Vive Latino ${YEAR} [Expo Zaragoza]: AVE + 9€`,
    description: `Vive Latino España ${YEAR} Recinto Expo Zaragoza (4–5 sep): AVE Madrid–Zaragoza Delicias (1h 20 min, 15–40€) + bus urbano al Expo (15 min). AVE.`,
    keywords: `como llegar vive latino ${YEAR}, vive latino zaragoza transporte, vive latino expo zaragoza, vive latino ave renfe, vive latino bus delicias, vive latino carpooling, vive latino desde madrid, vive latino desde barcelona`,
  },
  "bbk-music-legends": {
    title: `Cómo llegar a BBK Music Legends ${YEAR} [Sondika]: Lanzadera + 3€`,
    description: `BBK Music Legends ${YEAR} Recinto Atxura Sondika (Bizkaia, 19–21 jun): lanzadera oficial gratuita desde Bilbao centro (Plaza Moyúa, Termibus, Abando). Bus.`,
    keywords: `como llegar bbk music legends ${YEAR}, bbk music legends transporte, bbk music legends sondika, bbk music legends lanzadera, bbk music legends bizkaibus, bbk music legends carpooling, bbk music legends desde bilbao, bbk music legends parking`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// VENUE PAGE TITLE/DESCRIPTION OVERRIDES
// GSC-driven: target venue-specific queries with 0-click / high-impression
// ─────────────────────────────────────────────────────────────────────────────

export const VENUE_SEO_OVERRIDES: Record<string, { title: string; description: string; keywords?: string }> = {
  "estadio-la-cartuja": {
    title: `Cómo llegar al Estadio de La Cartuja Sevilla | ConcertRide`,
    description: `Estadio Olímpico de La Cartuja, Sevilla (57.000 plazas). 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `cómo llegar estadio la cartuja sevilla, como llegar estadio olímpico sevilla, estadio la cartuja cómo llegar, aparcamiento estadio la cartuja, parking estadio la cartuja, estadio la cartuja transporte público, bus estadio la cartuja, la cartuja sevilla como llegar, carpooling estadio la cartuja, conciertos la cartuja sevilla`,
  },
  "wizink-center": {
    title: `WiZink Center Madrid: Metro L2 Ventas + L7 + | ConcertRide`,
    description: `WiZink Center Madrid (18.000 plazas, Av. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `como llegar wizink center, wizink center metro, wizink center cómo llegar, mapa wizink center, wizink center transporte, como ir wizink center, carpooling wizink center madrid, conciertos wizink center, wizink center parking, wizink center metro ventas, wizink center metro l2, wizink center entradas, wizink center direccion, wizink center madrid agenda, wizink center que metro`,
  },
  "palacio-vistalegre": {
    title: `Palacio Vistalegre Madrid: Metro L5 Carabanchel + | ConcertRide`,
    description: `Palacio Vistalegre Madrid (10.000 plazas, Utebo 1, 28025 Madrid, barrio Carabanchel). 0% comisión, conductores verificados.`,
    keywords: `palacio vistalegre como llegar, palacio vistalegre metro, vista alegre como llegar, vista alegre madrid como llegar, mapa palacio vistalegre, palacio vistalegre cómo llegar, vistalegre metro, carpooling vistalegre madrid, conciertos vistalegre, palacio vistalegre metro carabanchel, como ir palacio vistalegre, vistalegre madrid metro parada, palacio vistalegre transporte, parking palacio vistalegre, palacio vistalegre direccion, como llegar vistalegre`,
  },
  "ifema-madrid": {
    title: `IFEMA Madrid: Metro L8 + Carpooling Mad Cool | ConcertRide`,
    description: `IFEMA Madrid — Feria de Madrid (Avda. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `como llegar ifema, ifema como llegar, ifema metro, ifema mad cool transporte, carpooling ifema madrid, como ir ifema mad cool, mad cool como llegar ifema, ifema metro l8, ifema feria madrid metro, como ir a ifema madrid, ifema transporte público, mad cool ifema carpooling, ifema madrid aparcamiento`,
  },
  "kobetamendi": {
    title: `Kobetamendi Bilbao: Lanzadera Gratis + Metro L1 | ConcertRide`,
    description: `Kobetamendi (30.000 plazas, BBK Live 9–11 jul ${YEAR}). 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `kobetamendi como llegar, kobetamendi bilbao como llegar, como llegar al kobetamendi, bbk live kobetamendi transporte, bbk live como llegar, kobetamendi lanzadera gratis, kobetamendi metro, kobetamendi bbk live ${YEAR}, como ir al kobetamendi, recinto kobetamendi bilbao, carpooling kobetamendi, bbk live desde madrid`,
  },
  "palau-sant-jordi": {
    title: `Cómo llegar al Palau Sant Jordi Barcelona: metro | ConcertRide`,
    description: `Palau Sant Jordi, Montjuïc Barcelona (17.000 plazas). 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `como llegar palau sant jordi, palau sant jordi metro, donde aparcar palau sant jordi, carpooling palau sant jordi barcelona, karol g palau sant jordi transporte, conciertos palau sant jordi`,
  },
  "parc-del-forum": {
    title: `Parc del Fòrum Barcelona: Metro L4 Besòs + | ConcertRide`,
    description: `Parc del Fòrum Barcelona (75.000 plazas — Primavera Sound, Cruïlla, Sónar de Noche). 0% comisión, conductores verificados.`,
    keywords: `forum barcelona como llegar, parc del forum metro, como llegar forum barcelona, parc del forum barcelona metro, carpooling parc del forum barcelona, primavera sound transporte, primavera sound metro, cruilla como llegar, sonar forum barcelona, forum metro l4, besòs mar metro forum`,
  },
  "caja-magica": {
    title: `Cómo llegar a la Caja Mágica Madrid: metro, bus y | ConcertRide`,
    description: `Caja Mágica, Madrid (27.000 plazas, sede del Mutua Madrid Open de tenis y conciertos). 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `como llegar caja magica madrid, caja magica metro, carpooling caja magica madrid, conciertos caja magica`,
  },
  "fira-barcelona": {
    title: `Cómo llegar a Fira Barcelona Montjuïc: metro | ConcertRide`,
    description: `Fira de Barcelona Montjuïc / Gran Via (Sónar Festival, MWC). 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `como llegar fira barcelona, fira montjuic como llegar, fira barcelona gran via, sonar fira barcelona transporte, fira barcelona metro, carpooling fira barcelona, fira barcelona aparcamiento, recinto sonar como llegar`,
  },
  "palau-blaugrana": {
    title: `Cómo llegar al Palau Blaugrana Barcelona: metro y | ConcertRide`,
    description: `Palau Blaugrana, Barcelona (7.500 plazas). 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `como llegar palau blaugrana, palau blaugrana metro, palau blaugrana barcelona como ir, palau blaugrana parking, carpooling palau blaugrana, conciertos palau blaugrana barcelona`,
  },
  "estadio-santiago-bernabeu": {
    title: `Estadio Santiago Bernabéu Madrid: Metro + | ConcertRide`,
    description: `Estadio Santiago Bernabéu (85.000 plazas) — sede de mega-conciertos (Coldplay, Bruce Springsteen, Karol G). 0% comisión, conductores verificados.`,
    keywords: `como llegar bernabeu, estadio bernabeu como llegar, bernabeu metro, bernabeu santiago de chamartin parking, carpooling bernabeu, bernabeu conciertos, coldplay bernabeu como llegar, bernabeu transporte nocturno`,
  },
  "estadio-civitas-metropolitano": {
    title: `Estadio Metropolitano Madrid: Metro L7 + carpooling | ConcertRide`,
    description: `Estadio Cívitas Metropolitano (68.000 plazas, sede del Atlético) — recinto para giras de mega-estadio (Ed Sheeran, Drake, Metallica, Guns N' Roses, Bruce.`,
    keywords: `como llegar estadio metropolitano, civitas metropolitano metro, estadio metropolitano madrid concierto, metropolitano l7, carpooling metropolitano, metropolitano conciertos, metallica metropolitano, ed sheeran metropolitano`,
  },
  "estadi-olimpic-lluis-companys": {
    title: `Estadi Olímpic Lluís Companys Barcelona · ConcertRide`,
    description: `Estadi Olímpic Lluís Companys (Montjuïc, 55.000 plazas) — Taylor Swift, Bruce Springsteen, Bad Bunny, Madonna. 0% comisión, conductores verificados.`,
    keywords: `como llegar estadi olimpic lluis companys, olimpic montjuic como llegar, taylor swift barcelona como llegar, bruce springsteen barcelona, montjuic metro, carpooling olimpic barcelona, estadi olimpic transporte`,
  },
  "roig-arena": {
    title: `Roig Arena Valencia: Metro + carpooling | ConcertRide`,
    description: `Roig Arena Valencia (nueva 2026, 20.000 plazas) — el mayor recinto cubierto de la Comunidad Valenciana. 0% comisión, conductores verificados.`,
    keywords: `como llegar roig arena valencia, roig arena metro, roig arena conciertos, roig arena tarongers, carpooling roig arena, roig arena 2026 conciertos, valencia nueva arena`,
  },
  "atlantic-fest": {
    title: `Cómo llegar a Atlantic Fest ${YEAR}: tren + carpooling | ConcertRide`,
    description: `Atlantic Fest ${YEAR} (Recinto Bouzas, Vilagarcía de Arousa, Pontevedra): sin transporte público directo al recinto. 0% comisión, conductores verificados.`,
    keywords: `como llegar atlantic fest ${YEAR}, atlantic fest transporte, atlantic fest vilagarcia, atlantic fest carpooling, atlantic fest desde vigo, atlantic fest desde pontevedra, atlantic fest desde santiago, festival galicia julio`,
  },
  "mallorca-live-festival": {
    title: `Cómo llegar a Mallorca Live Festival ${YEAR} | ConcertRide`,
    description: `Mallorca Live Festival ${YEAR} (Antiguo Aquapark Magaluf, Calvià): vuelo desde Madrid/Barcelona/Valencia (45 min–1h, 50–120€) o ferry Barcelona–Palma (8h.`,
    keywords: `como llegar mallorca live festival ${YEAR}, mallorca live transporte, mallorca live shuttle, mallorca live calvia como llegar, mallorca live desde palma, ferry mallorca festival, avion mallorca festival, carpooling mallorca live`,
  },
  "bbk-music-legends": {
    title: `Cómo llegar a BBK Music Legends Sondika ${YEAR} | ConcertRide`,
    description: `BBK Music Legends ${YEAR} (Recinto Atxura, Sondika, 8 km de Bilbao centro): lanzadera oficial GRATUITA desde Plaza Moyúa, Termibus y Abando durante los 3.`,
    keywords: `como llegar bbk music legends ${YEAR}, bbk music legends transporte, bbk music legends sondika, sondika recinto como llegar, bbk music legends lanzadera, bbk music legends carpooling, sondika bilbao bus`,
  },
  "sos-48": {
    title: `Cómo llegar al SOS 4.8 Murcia ${YEAR} · Carpooling | ConcertRide`,
    description: `SOS 4.8 Festival ${YEAR} (Recinto Ferias y Congresos Murcia): bus EMT líneas 1/18/39 hasta Ferias y Congresos. 0% comisión, conductores verificados.`,
    keywords: `como llegar sos 4.8 ${YEAR}, sos festival murcia transporte, sos 4.8 murcia bus, sos festival carpooling, sos 4.8 desde alicante, sos 4.8 desde madrid, festival murcia como llegar, sos 4.8 recinto ferias`,
  },
  "portamerica": {
    title: `Cómo llegar a PortAmérica ${YEAR}: coche + carpooling | ConcertRide`,
    description: `PortAmérica ${YEAR} (Caldas de Reis, Pontevedra — junto a la autopista AP-9): acceso en coche obligatorio, sin transporte público al recinto. Parking de.`,
    keywords: `como llegar portamerica ${YEAR}, portamerica caldas de reis transporte, portamerica carpooling, portamerica desde vigo, portamerica desde pontevedra, portamerica desde santiago, festival galicia julio ${YEAR}`,
  },
  "reggaeton-beach-festival": {
    title: `Cómo llegar al Reggaeton Beach Festival ${YEAR} | ConcertRide`,
    description: `Reggaeton Beach Festival ${YEAR} (Costa Daurada, Salou–PortAventura, Tarragona): tren Rodalies R15 Barcelona–Salou/PortAventura (1h 20 min, 7,65€). Bus PLANA.`,
    keywords: `como llegar reggaeton beach festival ${YEAR}, reggaeton beach salou transporte, reggaeton beach tren, reggaeton beach carpooling, salou festival como llegar, portaventura festival transporte, costa daurada festival, reggaeton beach desde barcelona, reggaeton beach desde tarragona`,
  },
  "vive-latino": {
    title: `Cómo llegar a Vive Latino España ${YEAR} · Carpooling | ConcertRide`,
    description: `Vive Latino España ${YEAR} (4–5 sep, Recinto Expo Zaragoza): tranvía línea 1 Valdespartera–Expo. 0% comisión, conductores verificados.`,
    keywords: `como llegar vive latino zaragoza ${YEAR}, vive latino transporte zaragoza, vive latino expo zaragoza, vive latino tranvia, vive latino carpooling, como ir vive latino zaragoza, vive latino desde madrid, vive latino desde barcelona, vive latino desde pamplona`,
  },
  "la-riviera": {
    title: `Sala La Riviera Madrid [P. Pío]: Carpooling 3€ | ConcertRide`,
    description: `Sala La Riviera Madrid (2.500 plazas, Paseo Bajo Virgen del Puerto, junto a Madrid Río). 0% comisión, conductores verificados.`,
    keywords: `sala la riviera madrid, conciertos la riviera, como llegar la riviera, la riviera principe pio, carpooling la riviera, la riviera metro, la riviera madrid agenda, la riviera direccion, la riviera transporte`,
  },
  "sala-apolo": {
    title: `Sala Apolo Barcelona [Paral·lel]: Carpooling | ConcertRide`,
    description: `Sala Apolo Barcelona (Poble-sec, Nou de la Rambla 113, 1.800 plazas). 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `sala apolo barcelona, conciertos apolo, como llegar apolo barcelona, apolo paral·lel metro, apolo nasty mondays, apolo crappy tuesdays, carpooling apolo barcelona, sala apolo agenda, apolo poble sec`,
  },
  "razzmatazz": {
    title: `Razzmatazz Barcelona [Poblenou]: Carpooling | ConcertRide`,
    description: `Razzmatazz Barcelona (5 salas, Almogàvers 122, Poblenou, aforo 2.500). 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `razzmatazz barcelona, conciertos razzmatazz, como llegar razzmatazz, razzmatazz metro marina, razz 1 razz 2 razzmatazz, carpooling razzmatazz, razzmatazz poblenou, razzmatazz agenda, razzmatazz parking`,
  },
  "sant-jordi-club": {
    title: `Sant Jordi Club Barcelona [Montjuïc]: Carpooling | ConcertRide`,
    description: `Sant Jordi Club Barcelona (anexo Palau Sant Jordi, Anella Olímpica Montjuïc, 4.500 plazas). 0% comisión, conductores verificados.`,
    keywords: `sant jordi club barcelona, conciertos sant jordi club, como llegar sant jordi club, sant jordi club montjuic, carpooling sant jordi club, sant jordi club agenda, sant jordi club aforo, sant jordi club parking, palau sant jordi anexo`,
  },
  "sala-bikini": {
    title: `Sala Bikini Barcelona [Diagonal]: Carpooling | ConcertRide`,
    description: `Sala Bikini Barcelona (L'Illa Diagonal, Av. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `sala bikini barcelona, conciertos bikini, como llegar bikini barcelona, bikini maria cristina, bikini illa diagonal, carpooling bikini, sala bikini agenda, bikini parking, bikini diagonal`,
  },
  "plaza-toros-las-ventas": {
    title: `Las Ventas Madrid [Conciertos ${YEAR}]: Metro L2 | ConcertRide`,
    description: `Plaza de Toros de Las Ventas (Madrid, Alcalá 237, aforo 23.000 en concierto). 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `las ventas madrid conciertos, plaza toros las ventas conciertos, como llegar las ventas, las ventas metro, las ventas aforo concierto, carpooling las ventas, las ventas ${YEAR}, las ventas verano conciertos, las ventas parking`,
  },
  "auditorio-rocio-jurado": {
    title: `Auditorio Rocío Jurado Sevilla [Cartuja]: 4€ | ConcertRide`,
    description: `Auditorio Rocío Jurado Sevilla (Isla de la Cartuja, 12.000 plazas, al aire libre). 0% comisión, conductores verificados.`,
    keywords: `auditorio rocio jurado sevilla, como llegar auditorio rocio jurado, rocio jurado cartuja sevilla, conciertos cartuja sevilla, iconica fest sevilla como llegar, carpooling auditorio rocio jurado, auditorio sevilla cartuja agenda, cultura inquieta sevilla`,
  },
  "sala-but": {
    title: `Sala But Madrid [Alonso Martínez]: Carpooling | ConcertRide`,
    description: `Sala But Madrid (antigua Mondo/Pachá, Calle Barceló 11, Justicia/Malasaña, 1.500 plazas). 0% comisión, conductores verificados.`,
    keywords: `sala but madrid, conciertos sala but, como llegar sala but, sala but alonso martinez, sala but barcelo madrid, carpooling sala but, sala but agenda, sala but parking, sala mondo madrid, sala but pacha madrid`,
  },
  "plaza-toros-valencia": {
    title: `Plaza Toros Valencia [Centro]: Metro Xàtiva | ConcertRide`,
    description: `Plaza de Toros de Valencia (Calle Xàtiva 28, 10.500 plazas, en pleno centro). 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `como llegar plaza toros valencia, plaza toros valencia metro xativa, conciertos plaza toros valencia, plaza toros valencia transporte, carpooling plaza toros valencia, festivales latinos valencia transporte, plaza toros valencia aparcamiento, concert music festival valencia`,
  },
  "estadio-san-mames": {
    title: `San Mamés Bilbao [Cómo Llegar]: Metro L1/L2 | ConcertRide`,
    description: `Estadio San Mamés Bilbao (53.289 plazas, La Catedral del Athletic) — sede de mega-conciertos (Bruce Springsteen, Bad Bunny). Metro L1/L2 San Mamés (acceso.`,
    keywords: `como llegar san mames, san mames bilbao metro, san mames concierto como llegar, estadio san mames bilbao, bruce springsteen bilbao como llegar, carpooling san mames, san mames parking, sanmames mega concierto, athletic club estadio conciertos`,
  },
  "coliseum-a-coruna": {
    title: `Coliseum A Coruña [Bus 12/14]: Parking gratis | ConcertRide`,
    description: `Coliseum da Coruña (11.000 plazas) — principal pabellón multiusos de Galicia. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `como llegar coliseum a coruna, coliseum coruña bus, conciertos coliseum a coruña, coliseum a coruna parking gratis, carpooling coliseum coruña, coliseum a coruna agenda, pabellon coliseum coruña como llegar, coliseum coruña transporte`,
  },
  "auditorio-castrelos": {
    title: `Auditorio Castrelos Vigo [Verano]: Bus 11 | ConcertRide`,
    description: `Auditorio de Castrelos Vigo (Parque de Castrelos, 20.000 plazas al aire libre, junio–septiembre). 0% comisión, conductores verificados.`,
    keywords: `como llegar auditorio castrelos, castrelos vigo bus, castrelos verano vigo, conciertos castrelos, carpooling auditorio castrelos vigo, o marisquiño como llegar, castrelos vigo agenda, parque castrelos vigo conciertos, castrelos vigo transporte`,
  },
  "marenostrum-fuengirola": {
    title: `Marenostrum Fuengirola [Cómo Llegar]: Cercanías | ConcertRide`,
    description: `Recinto Marenostrum Fuengirola (Castle Park, 14.000 plazas al aire libre, junto al mar). 0% comisión, conductores verificados.`,
    keywords: `como llegar marenostrum fuengirola, marenostrum cercanias c1, marenostrum fuengirola transporte, conciertos marenostrum castle park, carpooling marenostrum fuengirola, marenostrum desde malaga, marenostrum fuengirola aparcamiento, sting fuengirola como llegar, rod stewart fuengirola`,
  },
  "plaza-toros-zaragoza": {
    title: `Plaza Toros Zaragoza [La Misericordia]: Tranvía | ConcertRide`,
    description: `Plaza de Toros de La Misericordia Zaragoza (Av. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `como llegar plaza toros zaragoza, plaza toros zaragoza tranvia, conciertos plaza toros zaragoza, la misericordia zaragoza conciertos, carpooling plaza toros zaragoza, plaza toros zaragoza pablo gargallo, vive latino zaragoza transporte, plaza toros zaragoza aparcamiento`,
  },

  // ── Wave 36: 10 nuevos festivales (Alicante/Murcia/Toledo/Madrid Metro) ──────
  "festival-de-musica-de-alicante": {
    title: `Alicante Fest ${YEAR} [Jul, Costa Blanca]: Carpooling 3€`,
    description: `Festival de Música de Alicante ${YEAR}: pop y rock mediterráneo en el centro histórico. 0% comisión, conductores verificados.`,
    keywords: `festival musica alicante ${YEAR}, alicante fest carpooling, festival alicante verano, como llegar festival alicante, conciertos alicante ${YEAR}, festival costa blanca musica`,
  },
  "festival-de-musica-de-elche": {
    title: `Elche Fest ${YEAR} [Palmeral UNESCO, Ago]: Carpooling 3€`,
    description: `Festival de Música de Elche ${YEAR}: pop, rock y electrónica en el Palmeral Patrimonio UNESCO. Carpooling sin comisión Alicante 3€, Murcia 3€, Valencia 5€. Bizum.`,
    keywords: `festival musica elche ${YEAR}, elche fest carpooling, festival elche palmeral, como llegar festival elche, conciertos elche ${YEAR}, festival alicante provincia`,
  },
  "festival-de-musica-de-murcia-pop": {
    title: `Murcia Pop Fest ${YEAR} [Jul, Víctor Villegas]: Carpooling 3€`,
    description: `Festival Pop de Murcia ${YEAR}: pop nacional en el Auditorio Víctor Villegas. Carpooling sin comisión Alicante 3€, Cartagena 3€, Valencia 8€. 0% comisión. Bizum.`,
    keywords: `festival pop murcia ${YEAR}, murcia pop fest carpooling, festival murcia verano, como llegar festival murcia, conciertos murcia ${YEAR}, festival region murcia pop`,
  },
  "festival-de-musica-de-cartagena": {
    title: `Cartagena Fest ${YEAR} [Teatro Romano, Ago]: Carpooling 3€`,
    description: `Festival de Música de Cartagena ${YEAR}: pop y rock en el Teatro Romano. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `festival musica cartagena ${YEAR}, cartagena fest carpooling, festival cartagena teatro romano, como llegar festival cartagena, conciertos cartagena ${YEAR}, festival costa calida`,
  },
  "festival-de-musica-de-lorca": {
    title: `Lorca Fest ${YEAR} [Castillo, Jul Murcia]: Carpooling 3€`,
    description: `Festival de Música de Lorca ${YEAR}: pop y rock en el Castillo de Lorca (Murcia). Carpooling sin comisión Murcia 3€, Alicante 5€, Granada 6€. 0% comisión. Bizum.`,
    keywords: `festival musica lorca ${YEAR}, lorca fest carpooling, festival lorca castillo, como llegar festival lorca, conciertos lorca ${YEAR}, festival interior murcia`,
  },
  "festival-de-jazz-de-toledo": {
    title: `Jazz Toledo ${YEAR} [Jul, Patrimonio UNESCO]: Carpooling 4€`,
    description: `Festival de Jazz de Toledo ${YEAR}: jazz en el Teatro de Rojas y claustros medievales (Patrimonio UNESCO). 0% comisión, conductores verificados.`,
    keywords: `festival jazz toledo ${YEAR}, jazz toledo carpooling, festival jazz castilla la mancha, como llegar festival jazz toledo, conciertos toledo ${YEAR}, toledo festival verano`,
  },
  "festival-complutense": {
    title: `Complutense Fest ${YEAR} [Jun, Alcalá UNESCO]: Carpooling 3€`,
    description: `Festival Complutense ${YEAR}: música clásica y barroca en el Paraninfo Universitario de Alcalá de Henares (UNESCO). Carpooling sin comisión Madrid 3€. Bizum.`,
    keywords: `festival complutense ${YEAR}, festival clasico alcala henares, festival barroco madrid, como llegar festival alcala, conciertos alcala de henares ${YEAR}, festival universidad alcala`,
  },
  "festival-de-musica-de-leganes": {
    title: `LegaRock ${YEAR} [Jul-Ago, Sur Madrid]: Carpooling desde 3€`,
    description: `LegaRock Festival ${YEAR}: rock, indie y punk en Leganés (Madrid Metro). Carpooling sin comisión Toledo 4€, Guadalajara 4€, Segovia 5€. 0% comisión. Pago Bizum.`,
    keywords: `legarock ${YEAR}, festival rock leganes, festival indie sur madrid, como llegar legarock, conciertos leganes ${YEAR}, festival madrid metro rock, legarock festival carpooling`,
  },
  "festival-de-musica-de-mostoles": {
    title: `Móstoles Fest ${YEAR} [Jul, Metro Madrid]: Carpooling 4€`,
    description: `Festival de Música de Móstoles ${YEAR}: pop y rock en el Parque de Las Comunidades. Carpooling sin comisión Toledo 4€, Ávila 5€, Segovia 5€. 0% comisión. Bizum.`,
    keywords: `festival musica mostoles ${YEAR}, mostoles fest carpooling, festival pop mostoles, como llegar festival mostoles, conciertos mostoles ${YEAR}, festival sur madrid pop`,
  },
  "festival-de-musica-de-alcorcon": {
    title: `Alcorcón Fest ${YEAR} [Ago, Urban-Pop Metro]: Carpooling 4€`,
    description: `Festival de Música de Alcorcón ${YEAR}: urban, pop y reggaeton en el corredor oeste de Madrid. Carpooling sin comisión Ávila 5€, Toledo 4€, Segovia 4€. Bizum.`,
    keywords: `festival musica alcorcon ${YEAR}, alcorcon fest carpooling, festival urbano alcorcon, como llegar festival alcorcon, conciertos alcorcon ${YEAR}, festival madrid oeste pop`,
  },

  // ── Wave 36 pending: Andalucía Norte / Extremadura / Asturias / Cantabria / Vitoria Folk ──
  "festival-de-musica-de-jaen-pop": {
    title: `Jaén Pop Fest ${YEAR} [Jul, Olivar]: Carpooling desde 4€`,
    description: `Festival Pop de Jaén ${YEAR}: pop y rock en la capital del aceite de oliva. Carpooling sin comisión Granada 4€, Córdoba 5€, Sevilla 8€, Madrid 15€. Bizum.`,
    keywords: `festival pop jaen ${YEAR}, jaen pop fest carpooling, festival musica jaen, como llegar festival jaen, conciertos jaen ${YEAR}, festival andalucia pop jaen`,
  },
  "festival-de-musica-de-cordoba-rocks": {
    title: `Córdoba Rocks ${YEAR} [Mezquita, Verano]: Carpooling 4€`,
    description: `Festival Rock de Córdoba ${YEAR}: rock y pop junto a la Mezquita-Catedral (Patrimonio UNESCO). Carpooling sin comisión Sevilla 5€, Jaén 4€, Granada 5€. Bizum.`,
    keywords: `festival rock cordoba ${YEAR}, cordoba rocks carpooling, festival musica cordoba, como llegar festival cordoba, conciertos cordoba ${YEAR}, festival andalucia rock mezquita`,
  },
  "festival-de-musica-de-huelva-pop": {
    title: `Huelva Pop Fest ${YEAR} [Verano, Atlántico]: Carpooling 4€`,
    description: `Festival Pop de Huelva ${YEAR}: pop y rock en la ciudad de Colón y el Atlántico. Carpooling sin comisión Sevilla 4€, Faro 5€, Cádiz 6€. 0% comisión. Bizum.`,
    keywords: `festival pop huelva ${YEAR}, huelva pop fest carpooling, festival musica huelva, como llegar festival huelva, conciertos huelva ${YEAR}, festival andalucia atlantico`,
  },
  "festival-de-musica-de-badajoz": {
    title: `Badajoz Fest ${YEAR} [Verano, Extremadura]: Carpooling 4€`,
    description: `Festival de Música de Badajoz ${YEAR}: pop y rock en la capital extremeña. Carpooling sin comisión Mérida 3€, Sevilla 5€, Madrid 10€. 0% comisión. Bizum.`,
    keywords: `festival musica badajoz ${YEAR}, badajoz fest carpooling, festival extremadura badajoz, como llegar festival badajoz, conciertos badajoz ${YEAR}, festival frontera portugal`,
  },
  "festival-de-musica-de-merida": {
    title: `Mérida Fest ${YEAR} [Teatro Romano, Ago]: Carpooling 3€`,
    description: `Festival de Música de Mérida ${YEAR}: pop y rock junto al Teatro Romano (UNESCO). Carpooling sin comisión Badajoz 3€, Cáceres 4€, Sevilla 4€. 0% comisión. Bizum.`,
    keywords: `festival musica merida ${YEAR}, merida fest carpooling, festival teatro romano merida, como llegar festival merida, conciertos merida ${YEAR}, festival extremadura musica`,
  },
  "festival-de-musica-de-plasencia": {
    title: `Plasencia Fest ${YEAR} [Jun, Extremadura Norte]: Carpooling 4€`,
    description: `Festival de Música de Plasencia ${YEAR}: pop y rock en la ciudad amurallada extremeña. Carpooling sin comisión Cáceres 4€, Salamanca 5€, Madrid 12€. Bizum.`,
    keywords: `festival musica plasencia ${YEAR}, plasencia fest carpooling, festival extremadura norte, como llegar festival plasencia, conciertos plasencia ${YEAR}, festival caceres provincia`,
  },
  "festival-de-musica-de-gijon": {
    title: `Gijón Fest ${YEAR} [Verano, Costa Asturiana]: Carpooling 4€`,
    description: `Festival de Música de Gijón ${YEAR}: pop, rock e indie en el Cantábrico asturiano. Carpooling sin comisión Oviedo 4€, Santander 5€, Bilbao 7€. 0% comisión. Bizum.`,
    keywords: `festival musica gijon ${YEAR}, gijon fest carpooling, festival asturias gijon, como llegar festival gijon, conciertos gijon ${YEAR}, festival costa asturiana verano`,
  },
  "festival-de-musica-de-oviedo": {
    title: `Oviedo Fest ${YEAR} [Verano, Asturias Capital]: Carpooling 4€`,
    description: `Festival de Música de Oviedo ${YEAR}: pop y rock en la capital asturiana. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `festival musica oviedo ${YEAR}, oviedo fest carpooling, festival asturias oviedo, como llegar festival oviedo, conciertos oviedo ${YEAR}, festival norte españa capital oviedo`,
  },
  "festival-de-santander-jazz": {
    title: `Santander Jazz ${YEAR} [Verano, Cantábrico]: Carpooling 4€`,
    description: `Festival de Jazz de Santander ${YEAR}: jazz en la capital cántabra a orillas del Cantábrico. 0% comisión, conductores verificados.`,
    keywords: `festival jazz santander ${YEAR}, santander jazz carpooling, festival jazz cantabria, como llegar festival jazz santander, conciertos santander ${YEAR}, festival norte españa jazz cantabria`,
  },
  "festival-de-folk-de-vitoria": {
    title: `Folk Vitoria ${YEAR} [Verano, País Vasco]: Carpooling 3€`,
    description: `Festival de Folk de Vitoria-Gasteiz ${YEAR}: folk internacional y world music en la capital vasca. 0% comisión, conductores verificados.`,
    keywords: `festival folk vitoria ${YEAR}, vitoria folk fest carpooling, festival folk pais vasco, como llegar festival folk vitoria, conciertos vitoria ${YEAR}, festival vitoria gasteiz folk`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ARTIST PAGE TITLE/DESCRIPTION OVERRIDES
// GSC-driven: target artist+carpooling queries in position 11–20
// Formula: "[Artist] concierto España [Year]: carpooling desde [price]€ | ConcertRide"
// ─────────────────────────────────────────────────────────────────────────────

export const ARTIST_SEO_OVERRIDES: Record<string, { title: string; description: string; keywords?: string }> = {
  coldplay: {
    title: `Coldplay España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Coldplay en España ${YEAR} — Estadio Bernabéu Madrid y Estadi Olímpic Barcelona. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `carpooling coldplay españa, coldplay concierto madrid carpooling, coldplay barcelona carpooling, como llegar concierto coldplay, coldplay ${YEAR} transporte, viaje compartido coldplay españa, cómo ir al concierto de coldplay, coldplay madrid bernabeu como llegar`,
  },
  "taylor-swift": {
    title: `Taylor Swift España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Taylor Swift en España ${YEAR} — Bernabéu Madrid y Estadi Olímpic Barcelona. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `carpooling taylor swift españa, taylor swift madrid como llegar, taylor swift concierto ${YEAR} transporte, viaje compartido taylor swift, taylor swift bernabeu carpooling, como ir al concierto taylor swift sin tren, eras tour madrid carpooling`,
  },
  rosalia: {
    title: `Rosalía España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Rosalía en España ${YEAR} — Movistar Arena Madrid y Palau Sant Jordi Barcelona. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `carpooling rosalia españa, rosalia concierto madrid carpooling, rosalia wizink center como llegar, rosalia ${YEAR} transporte, viaje compartido rosalia, como ir concierto rosalia, rosalia palau sant jordi carpooling, rosalia españa ${YEAR}, rosalia concierto barcelona, rosalia motomami tour, rosalia gira ${YEAR}`,
  },
  "bad-bunny": {
    title: `Bad Bunny España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Bad Bunny en España ${YEAR} — Riyadh Air Metropolitano Madrid (30 may) y Estadi Olímpic Barcelona (22 may). 0% comisión, conductores verificados.`,
    keywords: `carpooling bad bunny españa, bad bunny concierto madrid como llegar, bad bunny ${YEAR} transporte, viaje compartido bad bunny, bad bunny bernabeu carpooling, como ir al concierto bad bunny, bad bunny palau sant jordi transporte`,
  },
  "the-weeknd": {
    title: `The Weeknd España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `The Weeknd Hurry Up Tomorrow Tour España ${YEAR} — Riyadh Air Metropolitano Madrid (28 ago). 0% comisión, conductores verificados.`,
    keywords: `carpooling the weeknd españa, the weeknd madrid como llegar, the weeknd concierto ${YEAR} transporte, viaje compartido the weeknd, the weeknd bernabeu carpooling, como ir al concierto the weeknd, the weeknd after hours tour madrid`,
  },
  "metallica-ifema": {
    title: `Metallica España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Metallica en España ${YEAR} — IFEMA Madrid (Estadio Olímpico). 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `carpooling metallica españa, metallica madrid como llegar, metallica ifema transporte, metallica ${YEAR} madrid carpooling, viaje compartido metallica, como ir al concierto metallica, metallica m72 tour madrid, metaleros carpooling madrid`,
  },
  rammstein: {
    title: `Rammstein España ${YEAR}: Carpooling desde 4€, 0% comisión`,
    description: `Rammstein en España ${YEAR} — estadios de Madrid y Barcelona. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `carpooling rammstein españa, rammstein concierto madrid carpooling, rammstein ${YEAR} transporte, viaje compartido rammstein, como llegar concierto rammstein, rammstein madrid como llegar, rammstein barcelona carpooling`,
  },
  "harry-styles": {
    title: `Harry Styles España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Harry Styles en España ${YEAR} — Movistar Arena Madrid y Palau Sant Jordi Barcelona. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `carpooling harry styles españa, harry styles madrid como llegar, harry styles wizink center carpooling, harry styles ${YEAR} transporte, viaje compartido harry styles, como ir al concierto harry styles, harry styles palau sant jordi transporte`,
  },
  "karol-g": {
    title: `Karol G España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Karol G en España ${YEAR} — Palau Sant Jordi Barcelona y Movistar Arena Madrid. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `karol g palau sant jordi, karol g wizink center como llegar, karol g españa ${YEAR}, carpooling karol g, karol g madrid como llegar, karol g ${YEAR} transporte, viaje compartido karol g, como ir al concierto karol g, karol g concierto españa`,
  },
  "dua-lipa": {
    title: `Dua Lipa España ${YEAR}: Carpooling | ConcertRide`,
    description: `Dua Lipa Radical Optimism Tour España ${YEAR} — Movistar Arena Madrid y Palau Sant Jordi Barcelona. 0% comisión, conductores verificados.`,
    keywords: `carpooling dua lipa españa, dua lipa madrid como llegar, dua lipa wizink center carpooling, dua lipa ${YEAR} transporte, viaje compartido dua lipa, como ir al concierto dua lipa, dua lipa concierto españa ${YEAR}, dua lipa radical optimism tour, dua lipa barcelona ${YEAR}, dua lipa palau sant jordi, dua lipa spain ${YEAR}`,
  },
  "billie-eilish": {
    title: `Billie Eilish España ${YEAR}: Carpooling | ConcertRide`,
    description: `Billie Eilish Hit Me Hard and Soft Tour España ${YEAR} — Movistar Arena Madrid y Palau Sant Jordi Barcelona. 0% comisión, conductores verificados.`,
    keywords: `billie eilish españa ${YEAR}, billie eilish madrid ${YEAR}, billie eilish barcelona ${YEAR}, cuando viene billie eilish a españa, billie eilish concierto españa ${YEAR}, billie eilish hit me hard tour españa, billie eilish movistar arena madrid, billie eilish palau sant jordi, como llegar concierto billie eilish, carpooling billie eilish, billie eilish spain tour ${YEAR}`,
  },
  "beyonce": {
    title: `Beyoncé concierto España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Beyoncé Cowboy Carter Tour España ${YEAR} — estadios de Madrid y Barcelona. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `carpooling beyonce españa, beyonce madrid como llegar, beyonce concierto ${YEAR} transporte, viaje compartido beyonce, cowboy carter tour madrid carpooling, como ir al concierto beyonce, beyonce españa ${YEAR}, beyonce conciertos ${YEAR}`,
  },
  // ── Artistas Españoles ──────────────────────────────────────────────────────
  "aitana": {
    title: `Aitana ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Aitana Cuarto Azul World Tour ${YEAR} — Roig Arena Valencia (21 may), Movistar Arena Madrid (17 oct), Palau Sant Jordi Barcelona (24 oct), BEC!. 0% comisión.`,
    keywords: `carpooling aitana ${YEAR}, concierto aitana madrid ${YEAR}, aitana movistar arena como llegar, aitana wizink center como llegar, aitana cuarto azul tour ${YEAR}, aitana carpooling, como llegar concierto aitana, aitana palau sant jordi carpooling, aitana bec bilbao transporte, viaje compartido aitana`,
  },
  "dani-martin": {
    title: `Dani Martín '25 Pts Años' Zaragoza ${YEAR}: desde 4€ | ConcertRide`,
    description: `Dani Martín gira '25 Pts Años' ${YEAR}: DOBLE FECHA Pabellón Príncipe Felipe Zaragoza (22 y 23 may). 0% comisión, conductores verificados.`,
    keywords: `carpooling dani martin ${YEAR}, concierto dani martin zaragoza ${YEAR}, dani martin 22 mayo zaragoza, dani martin 23 mayo zaragoza, dani martin zaragoza entradas, dani martin 25 años gira, viaje compartido dani martin zaragoza, como llegar concierto dani martin zaragoza, dani martin principe felipe zaragoza, el canto del loco ${YEAR}`,
  },
  "hombres-g": {
    title: `Hombres G Zaragoza ${YEAR}: Carpooling | ConcertRide`,
    description: `Hombres G 'Los Mejores Años de Nuestra Vida' — Pabellón Príncipe Felipe Zaragoza (21 nov ${YEAR}). 0% comisión, conductores verificados.`,
    keywords: `carpooling hombres g ${YEAR}, concierto hombres g zaragoza ${YEAR}, hombres g zaragoza noviembre, hombres g david summers ${YEAR}, hombres g los mejores años, como llegar concierto hombres g zaragoza, viaje compartido hombres g, hombres g principe felipe zaragoza, hombres g carpooling pamplona`,
  },
  "bryan-adams": {
    title: `Bryan Adams España ${YEAR}: Carpooling | ConcertRide`,
    description: `Bryan Adams gira europea ${YEAR} — Pabellón Príncipe Felipe Zaragoza (14 nov), Movistar Arena Madrid (18 nov). 0% comisión, conductores verificados.`,
    keywords: `carpooling bryan adams españa ${YEAR}, concierto bryan adams zaragoza, bryan adams madrid ${YEAR}, bryan adams zaragoza noviembre, como llegar concierto bryan adams, viaje compartido bryan adams, bryan adams principe felipe zaragoza, bryan adams wizink madrid carpooling, summer of 69 concierto ${YEAR}`,
  },
  "melendi": {
    title: `Melendi ${YEAR} [Movistar Arena + BEC! Bilbao]: Carpooling desde 4€`,
    description: `Melendi gira ${YEAR} — Movistar Arena Madrid (sept) y BEC! Bilbao (sept). 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `carpooling melendi ${YEAR}, melendi concierto madrid ${YEAR}, melendi wizink center como llegar, melendi bec bilbao carpooling, como ir concierto melendi, viaje compartido melendi, melendi gira ${YEAR}, melendi asturiano cantautor, melendi tu jardin con enanitos`,
  },
  "pablo-alboran": {
    title: `Pablo Alborán ${YEAR}: Carpooling 4€ | ConcertRide`,
    description: `Pablo Alborán gira ${YEAR} — Movistar Arena Madrid, FIBES Sevilla, Palau Sant Jordi Barcelona. 0% comisión, conductores verificados.`,
    keywords: `carpooling pablo alboran ${YEAR}, pablo alboran madrid como llegar, pablo alboran wizink center carpooling, pablo alboran ${YEAR} transporte, viaje compartido pablo alboran, como ir concierto pablo alboran, pablo alboran sevilla fibes carpooling, pablo alboran palau sant jordi, pablo alboran malagueño cantautor`,
  },
  "rozalen": {
    title: `Rozalén España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Rozalén en España ${YEAR} — Movistar Arena Madrid, Valencia. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `carpooling rozalen ${YEAR}, rozalen concierto madrid ${YEAR}, rozalen wizink center como llegar, rozalen ${YEAR} transporte, viaje compartido rozalen, como ir concierto rozalen`,
  },
  "sabrina-carpenter": {
    title: `Sabrina Carpenter España ${YEAR}: Carpooling | ConcertRide`,
    description: `Sabrina Carpenter Short n' Sweet Tour España ${YEAR} — Movistar Arena Madrid y Palau Sant Jordi Barcelona. 0% comisión, conductores verificados.`,
    keywords: `sabrina carpenter españa ${YEAR}, sabrina carpenter madrid ${YEAR}, sabrina carpenter barcelona ${YEAR}, sabrina carpenter concierto españa, sabrina carpenter short n sweet tour españa, cuando viene sabrina carpenter a españa, como llegar concierto sabrina carpenter, carpooling sabrina carpenter, sabrina carpenter movistar arena madrid, sabrina carpenter palau sant jordi, sabrina carpenter tour spain`,
  },
  "lana-del-rey": {
    title: `Lana Del Rey España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Lana Del Rey en España ${YEAR} — Parc del Fòrum / Primavera Sound Barcelona. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `carpooling lana del rey españa, lana del rey barcelona como llegar, lana del rey primavera sound carpooling, lana del rey ${YEAR} transporte, viaje compartido lana del rey, como ir concierto lana del rey`,
  },
  "c-tangana": {
    title: `C. Tangana España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `C. Tangana en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona y Sant Jordi Club. 0 % comisión, conductores verificados.`,
    keywords: `carpooling c tangana españa, c tangana madrid como llegar, c tangana wizink center carpooling, c tangana ${YEAR} transporte, viaje compartido c tangana, como ir concierto c tangana, el madrileño tour carpooling`,
  },
  "joaquin-sabina": {
    title: `Joaquín Sabina España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Joaquín Sabina en España ${YEAR} — Estadio Bernabéu Madrid y Palau Sant Jordi Barcelona. 0% comisión, conductores verificados.`,
    keywords: `carpooling joaquin sabina españa, joaquin sabina madrid como llegar, sabina concierto ${YEAR} transporte, viaje compartido joaquin sabina, como ir concierto sabina, sabina bernabeu carpooling`,
  },
  "travis-scott": {
    title: `Travis Scott España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Travis Scott Rodeo Tour España ${YEAR} — Parc del Fòrum Barcelona y IFEMA Madrid. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `carpooling travis scott españa, travis scott barcelona como llegar, travis scott mad cool carpooling, travis scott ${YEAR} transporte, viaje compartido travis scott, como ir concierto travis scott`,
  },
  "olivia-rodrigo": {
    title: `Olivia Rodrigo España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Olivia Rodrigo GUTS World Tour ${YEAR} — Palau Sant Jordi Barcelona y WiZink Center Madrid. 0% comisión, conductores verificados.`,
    keywords: `olivia rodrigo españa ${YEAR}, olivia rodrigo madrid como llegar, olivia rodrigo barcelona carpooling, olivia rodrigo guts tour madrid, olivia rodrigo wizink center, olivia rodrigo palau sant jordi, carpooling olivia rodrigo, viaje compartido olivia rodrigo, como ir concierto olivia rodrigo, olivia rodrigo entradas transporte, olivia rodrigo tour ${YEAR}`,
  },
  "post-malone": {
    title: `Post Malone España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Post Malone en España ${YEAR} — Mad Cool Madrid y Parc del Fòrum Barcelona. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `post malone madrid, post malone españa ${YEAR}, post malone madrid como llegar, post malone barcelona carpooling, post malone mad cool, carpooling post malone, viaje compartido post malone, como ir concierto post malone, post malone concierto españa`,
  },
  drake: {
    title: `Drake España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Drake en España ${YEAR} — Estadio Metropolitano Madrid y Palau Sant Jordi Barcelona. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `drake madrid, drake españa ${YEAR}, drake madrid como llegar, drake barcelona carpooling, drake concierto españa, carpooling drake, viaje compartido drake, como ir concierto drake, drake spain ${YEAR}, drake metropolitano madrid, drake palau sant jordi`,
  },
  metallica: {
    title: `Metallica España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Metallica M72 World Tour España ${YEAR} — Estadi Olímpic Barcelona y Estadio Metropolitano Madrid. 0% comisión, conductores verificados.`,
    keywords: `metallica españa ${YEAR}, metallica m72 madrid carpooling, metallica barcelona como llegar, metallica concierto españa, metallica metropolitano transporte, carpooling metallica, viaje compartido metallica, metallica tour ${YEAR}, como ir metallica madrid`,
  },
  "guns-n-roses": {
    title: `Guns N' Roses España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Guns N' Roses en España ${YEAR} — Estadio Metropolitano Madrid y Estadi Olímpic Barcelona. 0% comisión, conductores verificados.`,
    keywords: `guns n roses españa ${YEAR}, guns n roses madrid como llegar, guns n roses barcelona carpooling, gnr españa concierto, carpooling guns n roses, viaje compartido guns n roses, como ir concierto guns n roses, guns n roses tour ${YEAR}, guns n roses metropolitano`,
  },
  "ed-sheeran": {
    title: `Ed Sheeran España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Ed Sheeran +–=÷× Tour España ${YEAR} — Estadio Cívitas Metropolitano Madrid y Estadi Olímpic Barcelona. 0% comisión, conductores verificados.`,
    keywords: `ed sheeran españa ${YEAR}, ed sheeran madrid como llegar, ed sheeran barcelona carpooling, ed sheeran tour ${YEAR}, mathematics tour españa, carpooling ed sheeran, viaje compartido ed sheeran, como ir concierto ed sheeran`,
  },
  maluma: {
    title: `Maluma España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Maluma en España ${YEAR} — WiZink Center Madrid y Palau Sant Jordi Barcelona. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `maluma españa ${YEAR}, maluma madrid como llegar, maluma barcelona carpooling, maluma wizink center, maluma palau sant jordi, carpooling maluma, viaje compartido maluma, como ir concierto maluma, maluma tour ${YEAR}, reggaeton concierto madrid carpooling`,
  },
  "bruce-springsteen": {
    title: `Bruce Springsteen España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Bruce Springsteen And The E Street Band ${YEAR} — Estadi Olímpic Barcelona y Estadio Cívitas Metropolitano Madrid. 0% comisión, conductores verificados.`,
    keywords: `bruce springsteen españa ${YEAR}, bruce springsteen madrid carpooling, bruce springsteen barcelona como llegar, springsteen tour españa, the boss concierto españa, carpooling bruce springsteen, viaje compartido bruce springsteen, e street band españa, como ir concierto springsteen`,
  },
  "doja-cat": {
    title: `Doja Cat España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Doja Cat Scarlet Tour España ${YEAR} — Palau Sant Jordi Barcelona y WiZink Center Madrid. 0% comisión, conductores verificados.`,
    keywords: `doja cat españa ${YEAR}, doja cat madrid como llegar, doja cat barcelona carpooling, doja cat scarlet tour, carpooling doja cat, viaje compartido doja cat, como ir concierto doja cat, doja cat wizink center, doja cat palau sant jordi, doja cat concierto españa, doja cat madrid ${YEAR}`,
  },
  "vetusta-morla": {
    title: `Vetusta Morla España ${YEAR}: Carpooling desde 4€, 0% comisión`,
    description: `Vetusta Morla en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, La Cartuja Sevilla, Mad Cool. 0% comisión, conductores verificados.`,
    keywords: `vetusta morla ${YEAR}, vetusta morla concierto españa ${YEAR}, vetusta morla madrid como llegar, vetusta morla wizink center, vetusta morla palau sant jordi, vetusta morla la cartuja, carpooling vetusta morla, viaje compartido vetusta morla, vetusta morla tour ${YEAR}, vetusta morla mapa de los vientos, vetusta morla cabo polonio`,
  },
  estopa: {
    title: `Estopa concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Estopa en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, La Cartuja Sevilla. 0% comisión, conductores verificados.`,
    keywords: `estopa ${YEAR}, estopa concierto españa ${YEAR}, estopa madrid como llegar, estopa wizink center, estopa palau sant jordi, estopa la cartuja, carpooling estopa, viaje compartido estopa, estopa tour 25 aniversario, hermanos muñoz estopa, rumba española estopa`,
  },
  quevedo: {
    title: `Quevedo España ${YEAR}: Carpooling desde 4€, 0% comisión`,
    description: `Quevedo en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, Estadio Gran Canaria Arena Las Palmas. 0% comisión, conductores verificados.`,
    keywords: `quevedo ${YEAR}, quevedo concierto españa ${YEAR}, quevedo madrid como llegar, quevedo wizink center, quevedo palau sant jordi, quevedo gran canaria, carpooling quevedo, viaje compartido quevedo, quevedo bizarrap session 52, quevedo donde quiero estar tour, quevedo rapero canario`,
  },
  bizarrap: {
    title: `Bizarrap España ${YEAR}: Carpooling desde 4€, 0% comisión`,
    description: `Bizarrap en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, Mad Cool, Primavera Sound. 0% comisión, conductores verificados.`,
    keywords: `bizarrap ${YEAR}, bizarrap concierto españa ${YEAR}, bizarrap madrid como llegar, bizarrap wizink center, bizarrap palau sant jordi, bizarrap mad cool, bizarrap primavera sound, carpooling bizarrap, viaje compartido bizarrap, bizarrap bzrp sessions, bizarrap shakira, bizarrap quevedo`,
  },
  camilo: {
    title: `Camilo concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Camilo en España ${YEAR} — WiZink Center Madrid y Palau Sant Jordi Barcelona. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `camilo ${YEAR}, camilo concierto españa ${YEAR}, camilo madrid como llegar, camilo wizink center, camilo palau sant jordi, carpooling camilo, viaje compartido camilo, camilo de adentro pa fuera tour, camilo cantautor colombiano, vida de rico camilo`,
  },
  "manuel-carrasco": {
    title: `Manuel Carrasco España ${YEAR}: Carpooling desde 4€, 0% comisión`,
    description: `Manuel Carrasco en España ${YEAR} — La Cartuja Sevilla, WiZink Center Madrid, Stone & Music Mérida, Palau Sant Jordi. 0% comisión.`,
    keywords: `manuel carrasco ${YEAR}, manuel carrasco concierto españa, manuel carrasco la cartuja sevilla, manuel carrasco madrid wizink, manuel carrasco merida stone music, carpooling manuel carrasco, manuel carrasco gira ${YEAR}, manuel carrasco huelva, manuel carrasco bailar contigo`,
  },
  "pablo-lopez": {
    title: `Pablo López España ${YEAR}: Carpooling desde 4€, 0% comisión`,
    description: `Pablo López en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, La Cartuja Sevilla, Stone & Music Mérida. 0% comisión, conductores verificados.`,
    keywords: `pablo lopez ${YEAR}, pablo lopez concierto españa, pablo lopez wizink center, pablo lopez palau sant jordi, pablo lopez la cartuja, pablo lopez merida, carpooling pablo lopez, pablo lopez gira ${YEAR}, pablo lopez tour ${YEAR}, pablo lopez piano, pablo lopez malaga`,
  },
  "love-of-lesbian": {
    title: `Love of Lesbian España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Love of Lesbian en España ${YEAR} — Palau Sant Jordi Barcelona, WiZink Center Madrid, Cruïlla, Sonorama Ribera, Granada. 0% comisión.`,
    keywords: `love of lesbian ${YEAR}, love of lesbian concierto españa ${YEAR}, love of lesbian madrid, love of lesbian barcelona, love of lesbian palau sant jordi, love of lesbian wizink, carpooling love of lesbian, viaje compartido love of lesbian, love of lesbian gira ${YEAR}, indie pop catalan, santi balmes love of lesbian`,
  },
  "carolina-durante": {
    title: `Carolina Durante España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Carolina Durante en España ${YEAR} — WiZink Center Madrid, Sala Apolo Barcelona, Mad Cool, Sonorama Ribera, Primavera Sound, Granada. 0% comisión.`,
    keywords: `carolina durante ${YEAR}, carolina durante concierto españa ${YEAR}, carolina durante madrid wizink, carolina durante barcelona, carolina durante mad cool, carolina durante sonorama, carolina durante primavera sound, carpooling carolina durante, indie rock madrid carolina durante, diego ibañez carolina durante, cuatro chavales carolina durante`,
  },
  "lola-indigo": {
    title: `Lola Indigo España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Lola Indigo en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, La Cartuja Sevilla, Mad Cool. 0% comisión, conductores verificados.`,
    keywords: `lola indigo ${YEAR}, lola indigo concierto españa ${YEAR}, lola indigo madrid, lola indigo wizink center, lola indigo palau sant jordi, lola indigo barcelona, carpooling lola indigo, viaje compartido lola indigo, lola indigo gira ${YEAR}, mimi doblas lola indigo, akelarre lola indigo, mujer bruja lola indigo`,
  },
  saiko: {
    title: `Saiko España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Saiko en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, Pabellón Santiago Martín Tenerife. 0% comisión, conductores verificados.`,
    keywords: `saiko ${YEAR}, saiko concierto españa ${YEAR}, saiko madrid, saiko wizink center, saiko barcelona, saiko tenerife pabellon santiago martin, saiko polaris quevedo, saiko chata, carpooling saiko, viaje compartido saiko, ivan vazquez saiko, rap canario saiko`,
  },
  "anuel-aa": {
    title: `Anuel AA España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Anuel AA en España ${YEAR} — WiZink Center Madrid y Palau Sant Jordi Barcelona. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `anuel aa ${YEAR}, anuel aa concierto españa ${YEAR}, anuel aa madrid, anuel aa wizink center, anuel aa palau sant jordi, anuel aa barcelona, carpooling anuel aa, anuel aa karol g, china anuel daddy yankee, trap latino anuel aa, real hasta la muerte anuel`,
  },
  "j-balvin": {
    title: `J Balvin España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `J Balvin en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, Vive Latino España Zaragoza. 0% comisión, conductores verificados.`,
    keywords: `j balvin ${YEAR}, j balvin concierto españa ${YEAR}, j balvin madrid, j balvin wizink center, j balvin palau sant jordi, j balvin barcelona, carpooling j balvin, viaje compartido j balvin, j balvin vive latino, j balvin mi gente, jose alvaro osorio j balvin, reggaeton colombia j balvin`,
  },
  "sebastian-yatra": {
    title: `Sebastián Yatra España ${YEAR}: Carpooling 4€ | ConcertRide`,
    description: `Sebastián Yatra en España ${YEAR} — WiZink Center Madrid y Palau Sant Jordi Barcelona. 0% comisión, conductores verificados.`,
    keywords: `sebastian yatra ${YEAR}, sebastian yatra concierto españa ${YEAR}, sebastian yatra madrid, sebastian yatra wizink, sebastian yatra palau sant jordi, sebastian yatra barcelona, carpooling sebastian yatra, sebastian yatra tacones rojos, sebastian yatra robarte un beso, pop latino yatra`,
  },
  "manuel-turizo": {
    title: `Manuel Turizo España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Manuel Turizo (MTZ) en España ${YEAR} — WiZink Center Madrid y Palau Sant Jordi Barcelona. 0% comisión, conductores verificados.`,
    keywords: `manuel turizo ${YEAR}, manuel turizo concierto españa ${YEAR}, manuel turizo madrid, manuel turizo wizink, manuel turizo palau sant jordi, manuel turizo barcelona, mtz manuel turizo, manuel turizo la bachata, manuel turizo una lady como tu, carpooling manuel turizo, reggaeton colombia turizo`,
  },
  "feid": {
    title: `Feid España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Feid en España ${YEAR} — estadios y pabellones de Madrid y Barcelona. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `carpooling feid españa, feid concierto madrid carpooling, feid ${YEAR} transporte, viaje compartido feid, como ir concierto feid, feid gira ${YEAR} españa, feid tour españa`,
  },
  "rauw-alejandro": {
    title: `Rauw Alejandro ${YEAR} [WiZink + Palau + Roig]: Carpooling 4€`,
    description: `Rauw Alejandro Cosa Nuestra Tour ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, Roig Arena Valencia. 0% comisión, conductores verificados.`,
    keywords: `carpooling rauw alejandro españa, rauw alejandro madrid como llegar, rauw alejandro wizink center, rauw alejandro palau sant jordi, rauw alejandro roig arena valencia, rauw alejandro ${YEAR} transporte, viaje compartido rauw alejandro, rauw alejandro cosa nuestra tour, como ir concierto rauw alejandro, rauw alejandro gira españa ${YEAR}`,
  },
  "morat": {
    title: `Morat España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Morat en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `carpooling morat españa, morat concierto madrid ${YEAR}, morat wizink center carpooling, morat ${YEAR} transporte, viaje compartido morat, como ir concierto morat`,
  },
  "leiva": {
    title: `Leiva España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Leiva en España ${YEAR} — WiZink Center Madrid y teatros/pabellones nacionales. 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `carpooling leiva españa, leiva concierto madrid ${YEAR}, leiva wizink center carpooling, leiva ${YEAR} transporte, viaje compartido leiva, como ir concierto leiva, leiva gira ${YEAR}`,
  },
  "beret": {
    title: `Beret España ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Beret en España ${YEAR} — recintos de Madrid, Sevilla, Valencia y Barcelona. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `carpooling beret españa, beret concierto ${YEAR}, beret transporte, viaje compartido beret, como ir concierto beret, beret gira ${YEAR} españa`,
  },
  // ── Wave 2 Agent O (2026-05-11): +12 new overrides ──────────────────────────
  "antonio-orozco": {
    title: `Antonio Orozco ${YEAR} [WiZink + Cartuja]: Carpooling desde 4€`,
    description: `Antonio Orozco gira ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, Teatro Romano de Mérida y Estadio La Cartuja. 0% comisión.`,
    keywords: `antonio orozco ${YEAR}, antonio orozco concierto españa ${YEAR}, antonio orozco madrid wizink, antonio orozco palau sant jordi, antonio orozco merida teatro romano, antonio orozco la cartuja, carpooling antonio orozco, viaje compartido antonio orozco, antonio orozco gira ${YEAR}, hoy dejaste de quererme antonio orozco`,
  },
  "alejandro-sanz": {
    title: `Alejandro Sanz ${YEAR} [Bernabéu + Olímpic]: Carpooling 4€`,
    description: `Alejandro Sanz gira ${YEAR} — Estadio Santiago Bernabéu Madrid, Estadi Olímpic Lluís Companys Barcelona, Estadio La Cartuja. 0% comisión.`,
    keywords: `alejandro sanz ${YEAR}, alejandro sanz concierto españa ${YEAR}, alejandro sanz bernabeu madrid, alejandro sanz estadi olimpic barcelona, alejandro sanz la cartuja sevilla, carpooling alejandro sanz, viaje compartido alejandro sanz, alejandro sanz gira ${YEAR}, corazon partio alejandro sanz, sanz sanz tour`,
  },
  "david-bisbal": {
    title: `David Bisbal ${YEAR} [WiZink + Palau]: Carpooling desde 4€`,
    description: `David Bisbal gira ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, La Cartuja Sevilla y Cala Mijas Festival. 0% comisión, conductores verificados.`,
    keywords: `david bisbal ${YEAR}, david bisbal concierto españa ${YEAR}, david bisbal wizink center madrid, david bisbal palau sant jordi barcelona, david bisbal cala mijas, carpooling david bisbal, viaje compartido david bisbal, david bisbal gira ${YEAR}, bulería bisbal, ave maria david bisbal, operacion triunfo 2002`,
  },
  marwan: {
    title: `Marwan concierto ${YEAR} [Teatro Real]: Carpooling desde 4€`,
    description: `Marwan en España ${YEAR} — Teatro Real / Sala La Riviera Madrid, Sala Apolo / Razzmatazz Barcelona. 0% comisión, conductores verificados.`,
    keywords: `marwan ${YEAR}, marwan concierto españa ${YEAR}, marwan madrid teatro real, marwan sala la riviera, marwan sala apolo barcelona, carpooling marwan, viaje compartido marwan, marwan cantautor madrileño, marwan apuntes sobre mi paso por el invierno, marwan las cosas que no te dije, marwan gira ${YEAR}`,
  },
  "ivan-ferreiro": {
    title: `Iván Ferreiro ${YEAR} [WiZink + Mar de Vigo]: Carpooling 4€`,
    description: `Iván Ferreiro gira ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, Mar de Vigo, Atlantic Fest, PortAmérica, Mad Cool y Sonorama. 0% comisión.`,
    keywords: `ivan ferreiro ${YEAR}, ivan ferreiro concierto españa ${YEAR}, ivan ferreiro madrid wizink, ivan ferreiro mar de vigo, ivan ferreiro atlantic fest, ivan ferreiro portamerica, ivan ferreiro mad cool, ivan ferreiro sonorama, los piratas ivan ferreiro, carpooling ivan ferreiro, trinchera pop ferreiro, viaje compartido ivan ferreiro`,
  },
  "la-casa-azul": {
    title: `La Casa Azul ${YEAR} [Palau + WiZink]: Carpooling desde 4€`,
    description: `La Casa Azul gira ${YEAR} — Palau Sant Jordi / Sala Apolo Barcelona, WiZink Center / Sala La Riviera Madrid, Atlantic Fest, PortAmérica, SOS 4.8. 0% comisión.`,
    keywords: `la casa azul ${YEAR}, la casa azul concierto españa ${YEAR}, la casa azul palau sant jordi, la casa azul sala apolo, la casa azul wizink center, la casa azul atlantic fest, la casa azul mad cool, la casa azul sonorama, guille milkyway la casa azul, indie pop español la casa azul, carpooling la casa azul, la revolucion sexual la casa azul`,
  },
  sidonie: {
    title: `Sidonie ${YEAR} [Mad Cool + Sonorama]: Carpooling desde 4€`,
    description: `Sidonie gira ${YEAR} — Palau Sant Jordi Barcelona, WiZink Center Madrid, Mad Cool, Sonorama Ribera, Atlantic Fest, SOS 4.8, Granada Sound. 0% comisión.`,
    keywords: `sidonie ${YEAR}, sidonie concierto españa ${YEAR}, sidonie palau sant jordi, sidonie wizink center, sidonie mad cool, sidonie sonorama, sidonie atlantic fest, sidonie granada sound, marc ros sidonie, jes senra sidonie, indie rock español sidonie, carpooling sidonie, el incendio sidonie`,
  },
  "daddy-yankee": {
    title: `Daddy Yankee ${YEAR} [WiZink + Palau Sant Jordi]: Carpooling 4€`,
    description: `Daddy Yankee en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona y Reggaeton Beach Festival Salou. 0% comisión, conductores verificados.`,
    keywords: `daddy yankee ${YEAR}, daddy yankee concierto españa ${YEAR}, daddy yankee madrid wizink, daddy yankee palau sant jordi, daddy yankee reggaeton beach festival salou, daddy yankee gasolina, daddy yankee despacito, ramon ayala daddy yankee, carpooling daddy yankee, viaje compartido daddy yankee, big boss reggaeton`,
  },
  "ac-dc": {
    title: `AC/DC España ${YEAR} [La Cartuja + Bernabéu]: Carpooling 5€`,
    description: `AC/DC en España ${YEAR} — Estadio La Cartuja Sevilla y Estadio Bernabéu Madrid del Power Up Tour. 0% comisión, conductores verificados.`,
    keywords: `ac dc españa ${YEAR}, ac dc concierto españa ${YEAR}, ac dc la cartuja sevilla, ac dc bernabeu madrid, ac dc power up tour, acdc sevilla como llegar, acdc madrid carpooling, carpooling ac dc, viaje compartido ac dc, hard rock concierto españa, lanzadera tussam la cartuja, ac dc tour ${YEAR}`,
  },
  shakira: {
    title: `Shakira ${YEAR} [Metropolitano + Olímpic]: Carpooling 4€`,
    description: `Shakira Las Mujeres Ya No Lloran World Tour España ${YEAR} — Estadio Civitas Metropolitano Madrid y Estadi Olímpic Barcelona. 0% comisión, conductores verificados.`,
    keywords: `shakira ${YEAR}, shakira concierto españa ${YEAR}, shakira madrid metropolitano, shakira barcelona estadi olimpic, shakira las mujeres ya no lloran tour, carpooling shakira, viaje compartido shakira, shakira madrid como llegar, shakira barcelona carpooling, hips don't lie shakira, waka waka shakira, shakira gira europea ${YEAR}`,
  },
  "bad-gyal": {
    title: `Bad Gyal ${YEAR} [Palau Sant Jordi + WiZink]: Carpooling 4€`,
    description: `Bad Gyal gira ${YEAR} — Palau Sant Jordi Barcelona, WiZink Center Madrid, Primavera Sound y Cruïlla. 0% comisión, conductores verificados.`,
    keywords: `bad gyal ${YEAR}, bad gyal concierto españa ${YEAR}, bad gyal palau sant jordi, bad gyal wizink center madrid, bad gyal primavera sound, bad gyal cruilla, alba farelo bad gyal, carpooling bad gyal, viaje compartido bad gyal, fiebre bad gyal, zorra bad gyal, dancehall español bad gyal, bad gyal barcelona como llegar`,
  },
  "nicki-nicole": {
    title: `Nicki Nicole ${YEAR} [Movistar Arena + Palau]: Carpooling 4€`,
    description: `Nicki Nicole en España ${YEAR} — Movistar Arena Madrid, Palau Sant Jordi Barcelona y Primavera Sound. 0% comisión, conductores verificados.`,
    keywords: `nicki nicole ${YEAR}, nicki nicole concierto españa ${YEAR}, nicki nicole movistar arena madrid, nicki nicole palau sant jordi, nicki nicole primavera sound, nicki nicole bizarrap, wapo traketero nicki nicole, nicol cucco nicki nicole, carpooling nicki nicole, trap argentina nicki nicole, viaje compartido nicki nicole`,
  },
  // ── Wave 4 Agent U (2026-05-11): +8 new artist overrides ─────────────────────
  "imagine-dragons": {
    title: `Imagine Dragons ${YEAR} [Metropolitano+Olímpic]: Carpooling 4€`,
    description: `Imagine Dragons Loom World Tour España ${YEAR} — Estadio Cívitas Metropolitano Madrid y Estadi Olímpic Lluís Companys. 0% comisión.`,
    keywords: `imagine dragons ${YEAR}, imagine dragons concierto españa ${YEAR}, imagine dragons madrid metropolitano, imagine dragons barcelona estadi olimpic, imagine dragons loom tour, carpooling imagine dragons, viaje compartido imagine dragons, imagine dragons como llegar, radioactive imagine dragons, believer imagine dragons, thunder imagine dragons, imagine dragons mad cool`,
  },
  "iron-maiden": {
    title: `Iron Maiden ${YEAR} [Run For Your Lives Tour]: Carpooling 4€`,
    description: `Iron Maiden Run For Your Lives World Tour ${YEAR} — Estadio Cívitas Metropolitano Madrid, Estadi Olímpic Barcelona y Resurrection Fest. 0% comisión.`,
    keywords: `iron maiden ${YEAR}, iron maiden concierto españa ${YEAR}, iron maiden madrid metropolitano, iron maiden barcelona estadi olimpic, iron maiden resurrection fest viveiro, iron maiden run for your lives tour, carpooling iron maiden, viaje compartido iron maiden, iron maiden 50 aniversario, the trooper iron maiden, fear of the dark iron maiden, eddie iron maiden`,
  },
  "india-martinez": {
    title: `India Martínez ${YEAR} [FIBES+Stone Music+Starlite]: Carpooling 4€`,
    description: `India Martínez gira ${YEAR} — FIBES Sevilla, Teatro Romano Mérida (Stone & Music) y Starlite Cantera Marbella. 0% comisión, conductores verificados.`,
    keywords: `india martinez ${YEAR}, india martinez concierto españa ${YEAR}, india martinez fibes sevilla, india martinez stone music merida, india martinez starlite marbella, india martinez gira ${YEAR}, carpooling india martinez, viaje compartido india martinez, vencer al amor india martinez, india martinez flamenco pop, india martinez palmeras, india martinez camino la buena vida`,
  },
  raphael: {
    title: `Raphael ${YEAR} [WiZink+Palau+Stone Music]: Carpooling 4€`,
    description: `Raphael gira aniversario ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona y Teatro Romano de Mérida (Stone &. 0% comisión.`,
    keywords: `raphael ${YEAR}, raphael concierto españa ${YEAR}, raphael cantante madrid wizink, raphael palau sant jordi barcelona, raphael stone music merida, raphael gira aniversario, raphael miguel rafael martos, carpooling raphael, viaje compartido raphael, mi gran noche raphael, yo soy aquel raphael, como yo te amo raphael, raphael 50 aniversario`,
  },
  pignoise: {
    title: `Pignoise ${YEAR} [WiZink+Razzmatazz+Sonorama]: Carpooling 4€`,
    description: `Pignoise gira regreso ${YEAR} — WiZink Center Madrid, Sala Razzmatazz Barcelona, Sonorama Ribera Aranda de Duero. 0% comisión, conductores verificados.`,
    keywords: `pignoise ${YEAR}, pignoise concierto españa ${YEAR}, pignoise madrid wizink, pignoise razzmatazz barcelona, pignoise sonorama ribera, pignoise alvaro benito, pignoise regreso ${YEAR}, carpooling pignoise, viaje compartido pignoise, nada que perder pignoise, te entiendo pignoise, tres palabras pignoise, pop punk español pignoise`,
  },
  amaia: {
    title: `Amaia ${YEAR} [WiZink+Apolo+Baluarte]: Carpooling desde 4€`,
    description: `Amaia Romero gira ${YEAR} — WiZink Center Madrid, Sala Apolo Barcelona, Baluarte Pamplona, Mad Cool, Sonorama y Primavera. 0% comisión.`,
    keywords: `amaia ${YEAR}, amaia concierto españa ${YEAR}, amaia romero madrid, amaia wizink center, amaia sala apolo barcelona, amaia baluarte pamplona, amaia ot 2017, amaia eurovision 2018, carpooling amaia, viaje compartido amaia, pero no pasa nada amaia, cuando no se quien soy amaia, amaia mad cool, amaia primavera sound`,
  },
  "nathy-peluso": {
    title: `Nathy Peluso ${YEAR} [GRASA Tour WiZink+Palau]: Carpooling 4€`,
    description: `Nathy Peluso GRASA Tour ${YEAR} — WiZink Center Madrid y Palau Sant Jordi Barcelona, además de Mad Cool y Primavera Sound. 0% comisión, conductores verificados.`,
    keywords: `nathy peluso ${YEAR}, nathy peluso concierto españa ${YEAR}, nathy peluso madrid wizink, nathy peluso palau sant jordi, nathy peluso grasa tour, nathy peluso mad cool, nathy peluso primavera sound, carpooling nathy peluso, viaje compartido nathy peluso, nathy peluso latin grammy, nathy peluso argentina, businesswoman nathy peluso, calambre nathy peluso`,
  },
  "rels-b": {
    title: `Rels B ${YEAR} [AFTERPARTY Tour Movistar+Palau]: Carpooling 4€`,
    description: `Rels B AFTERPARTY Tour ${YEAR} — Movistar Arena Madrid, Palau Sant Jordi Barcelona, Mallorca Live Festival y Reggaeton Beach Festival. 0% comisión.`,
    keywords: `rels b ${YEAR}, rels b concierto españa ${YEAR}, rels b madrid movistar arena, rels b palau sant jordi barcelona, rels b mallorca live, rels b reggaeton beach festival, rels b afterparty tour, daniel heredia rels b, carpooling rels b, viaje compartido rels b, a mi rels b, la luna y yo rels b, como dormiste rels b, rap mallorca rels b`,
  },

  // ── Wave 36: Catalan scene + Fuel Fandango ───────────────────────────────
  "fuel-fandango": {
    title: `Fuel Fandango ${YEAR} [Flamenco-Electro, Sónar]: Carpooling 4€`,
    description: `Fuel Fandango ${YEAR} — Sónar BCN, FIB, Primavera Sound. Dúo granadino flamenco-electrónico. Carpooling Sevilla 12€, Valencia 10€, Madrid 15€. 0% comisión. Bizum.`,
    keywords: `fuel fandango ${YEAR}, fuel fandango concierto españa, fuel fandango sonar barcelona, fuel fandango fib, fuel fandango primavera sound, fuel fandango flamenco electronico, carpooling fuel fandango, como ir concierto fuel fandango`,
  },
  "los-piratas": {
    title: `Los Piratas ${YEAR} [Indie Rock, La Riviera]: Carpooling 4€`,
    description: `Los Piratas ${YEAR} — La Riviera Madrid, Sonorama Ribera. Indie rock asturiano pionero, Omega. Carpooling Oviedo 7€, Gijón 7€, Valladolid 5€. 0% comisión. Bizum.`,
    keywords: `los piratas ${YEAR}, los piratas concierto españa, los piratas madrid la riviera, los piratas sonorama, los piratas omega album, los piratas indie rock asturiano, carpooling los piratas, como ir concierto los piratas`,
  },
  standstill: {
    title: `Standstill ${YEAR} [Punk-Rock BCN, Primavera Sound]: 4€`,
    description: `Standstill ${YEAR} — Primavera Sound BCN, Razzmatazz. Punk-rock/hardcore barcelonés. Carpooling Valencia 10€, Zaragoza 9€, Madrid 15€. 0% comisión. Bizum.`,
    keywords: `standstill ${YEAR}, standstill concierto españa, standstill primavera sound barcelona, standstill razzmatazz, standstill hardcore punk rock catalan, carpooling standstill, como ir concierto standstill barcelona`,
  },
  "els-amics-de-les-arts": {
    title: `Els Amics de les Arts ${YEAR} [Cruïlla + FIB]: Carpooling 3€`,
    description: `Els Amics de les Arts ${YEAR} — Cruïlla BCN, FIB Benicàssim. Indie pop catalán, Ja Som a la Tardor. Carpooling Girona 3€, Tarragona 3€, Valencia 7€. Sin comisión.`,
    keywords: `els amics de les arts ${YEAR}, els amics de les arts concierto, els amics de les arts cruilla barcelona, els amics de les arts fib, els amics de les arts indie catalan, carpooling els amics de les arts, com anar concert els amics les arts`,
  },
  manel: {
    title: `Manel ${YEAR} [Primavera Sound + FIB]: Carpooling 3€`,
    description: `Manel ${YEAR} — Primavera Sound BCN, FIB Benicàssim, Cruïlla. Indie folk pop catalán. Carpooling Girona 3€, Lleida 5€, Valencia 8€. 0% comisión. Bizum.`,
    keywords: `manel ${YEAR}, manel concierto españa, manel primavera sound barcelona, manel fib benicassim, manel cruilla, manel indie folk catalan, manel els millors professors europeus, carpooling manel, como ir concierto manel barcelona`,
  },
  mishima: {
    title: `Mishima ${YEAR} [Primavera Sound BCN + Apolo]: Carpooling 3€`,
    description: `Mishima ${YEAR} — Primavera Sound BCN, Sala Apolo, FIB. Indie rock catalán, L'Edat d'Or. Carpooling Girona 3€, Tarragona 3€, Valencia 8€. 0% comisión. Bizum.`,
    keywords: `mishima ${YEAR}, mishima concierto españa, mishima primavera sound barcelona, mishima sala apolo, mishima indie rock catalan, mishima l edat d or, carpooling mishima, como ir concierto mishima barcelona`,
  },
  "sopa-de-cabra": {
    title: `Sopa de Cabra ${YEAR} [Canet Rock + Gira]: Carpooling 3€`,
    description: `Sopa de Cabra ${YEAR} — Canet Rock, Palau Sant Jordi BCN. Rock catalán de Girona, El meu avi. Carpooling Girona 3€, Tarragona 3€, Lleida 5€. 0% comisión. Bizum.`,
    keywords: `sopa de cabra ${YEAR}, sopa de cabra concierto españa, sopa de cabra canet rock, sopa de cabra palau sant jordi, sopa de cabra rock catalan girona, sopa de cabra el meu avi, carpooling sopa de cabra, como ir concierto sopa de cabra`,
  },
  "the-tyets": {
    title: `The Tyets ${YEAR} [Primavera Sound BCN]: Carpooling 3€`,
    description: `The Tyets ${YEAR} — Primavera Sound BCN, Cruïlla. Pop urbano catalán viral, Castellers. Carpooling Girona 3€, Tarragona 3€, Valencia 8€. 0% comisión. Bizum.`,
    keywords: `the tyets ${YEAR}, the tyets concierto españa, the tyets primavera sound barcelona, the tyets cruilla, the tyets pop urbano catalan, the tyets castellers, carpooling the tyets, como ir concierto the tyets barcelona`,
  },
  "oques-grasses": {
    title: `Oques Grasses ${YEAR} [Rototom + Cruïlla]: Carpooling 3€`,
    description: `Oques Grasses ${YEAR} — Rototom Sunsplash, Cruïlla BCN, FIB. Reggae-ska catalán de Granollers. Carpooling Girona 3€, Tarragona 3€, Valencia 7€. 0% comisión. Bizum.`,
    keywords: `oques grasses ${YEAR}, oques grasses concierto españa, oques grasses rototom sunsplash, oques grasses cruilla barcelona, oques grasses fib, oques grasses reggae ska catalan, carpooling oques grasses, como ir concierto oques grasses`,
  },
  txarango: {
    title: `Txarango ${YEAR} [Cruïlla + Folk Catalans]: Carpooling 3€`,
    description: `Txarango ${YEAR} — Cruïlla BCN, Mercat de Música Viva, Canet Rock. 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `txarango ${YEAR}, txarango concierto españa, txarango cruilla barcelona, txarango mercat musica viva, txarango canet rock, txarango folk catalan rumba, txarango som la gent, carpooling txarango, como ir concierto txarango`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE PAGE TITLE IMPROVEMENTS
// ─────────────────────────────────────────────────────────────────────────────

export const ROUTE_SEO_IMPROVEMENTS: Record<string, { title: string; description?: string; keywords?: string }> = {
  // ── Viña Rock (top GSC queries) ─────────────────────────────────────────
  "madrid-vina-rock": {
    title: `Carpooling Madrid → Viña Rock ${YEAR} [Villarrobledo]: 6€, 3h`,
    description: `Carpooling Madrid → Viña Rock ${YEAR}: 260 km, 3h por A-31, desde 6€/asiento sin comisión. Ruta directa Madrid–Villarrobledo, vuelta de madrugada coordinada.`,
    keywords: `carpooling madrid viña rock, viaje compartido madrid villarrobledo, bus madrid viña rock, como ir viña rock desde madrid, transporte madrid vina rock ${YEAR}, viñarock desde madrid`,
  },
  "valencia-vina-rock": {
    title: `Carpooling Valencia → Viña Rock ${YEAR} [Albacete]: 6€, 2h45`,
    description: `Carpooling Valencia → Viña Rock ${YEAR}: 255 km, 2h 45 min por A-3+A-31, desde 6€/asiento sin comisión. Lanzadera al recinto La Pulgosa, vuelta coordinada.`,
    keywords: `carpooling valencia viña rock, viaje compartido valencia viña rock, como llegar viña rock desde valencia, transporte valencia vina rock ${YEAR}`,
  },
  "alicante-vina-rock": {
    title: `Cómo ir a Viña Rock desde Alicante ${YEAR}: 2h, 195km, 5€`,
    description: `Cómo ir a Viña Rock desde Alicante ${YEAR}: 195 km, 2h por A-31, carpooling desde 5€/asiento sin comisión. Salidas coordinadas + vuelta de madrugada al centro.`,
    keywords: `carpooling alicante viña rock, viaje compartido alicante viña rock, como ir viña rock desde alicante, bus alicante viña rock`,
  },
  "albacete-vina-rock": {
    title: `Cómo ir a Viña Rock desde Albacete ${YEAR}: 30min, 40km, 3€`,
    description: `Cómo ir a Viña Rock desde Albacete ${YEAR}: 40 km, 30 min por A-31, carpooling desde 3€/asiento. Alternativa a bus regional y lanzadera nocturna, sin comisión.`,
    keywords: `carpooling albacete viña rock, bus albacete viña rock, lanzadera albacete viña rock, viaje compartido albacete villarrobledo`,
  },
  "sevilla-vina-rock": {
    title: `Carpooling Sevilla → Viña Rock ${YEAR}: 9€, 410 km`,
    keywords: `carpooling sevilla viña rock, viaje compartido sevilla viña rock, como ir viña rock desde sevilla`,
  },
  // ── Arenal Sound ────────────────────────────────────────────────────────
  "madrid-arenal-sound": {
    title: `Carpooling Madrid → Arenal Sound ${YEAR} [Burriana]: 12€, 460km`,
    description: `Carpooling Madrid → Arenal Sound ${YEAR}: 460 km, 4h 30 min por A-3, desde 12€/asiento sin comisión. Más barato que bus (35€+) y AVE (60€+).`,
    keywords: `carpooling madrid arenal sound, viaje compartido madrid burriana, como llegar arenal sound desde madrid, bus madrid arenal sound, transporte madrid arenal sound ${YEAR}`,
  },
  "valencia-arenal-sound": {
    title: `Cómo ir a Arenal Sound desde Valencia ${YEAR}: 50min, 65km, 3€`,
    description: `Cómo ir a Arenal Sound desde Valencia ${YEAR}: 65 km, 50 min por AP-7, carpooling desde 3€/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling valencia arenal sound, viaje compartido valencia burriana, autobus castellon burriana arenal sound, como ir arenal sound desde valencia`,
  },
  "barcelona-arenal-sound": {
    title: `Carpooling Barcelona → Arenal Sound ${YEAR} [Castellón]: 8€, 3h`,
    description: `Carpooling Barcelona → Arenal Sound ${YEAR}: 305 km, 3h por AP-7, desde 8€/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling barcelona arenal sound, viaje compartido barcelona burriana, como llegar arenal sound desde barcelona`,
  },
  "zaragoza-arenal-sound": {
    title: `Carpooling Zaragoza → Arenal Sound ${YEAR}: 8€, 275 km`,
    keywords: `carpooling zaragoza arenal sound, viaje compartido zaragoza arenal sound, como ir arenal sound desde zaragoza`,
  },
  "alicante-arenal-sound": {
    title: `Carpooling Alicante → Arenal Sound ${YEAR}: 4€, 115 km`,
    keywords: `carpooling alicante arenal sound, viaje compartido alicante burriana arenal sound`,
  },
  // ── BBK Live ────────────────────────────────────────────────────────────
  "madrid-bbk-live": {
    title: `Carpooling Madrid → BBK Live ${YEAR} [Bilbao]: desde 11€, 4h`,
    description: `Carpooling Madrid → BBK Live ${YEAR}: 395 km, 4h por A-1+AP-68, desde 11€/asiento sin comisión. Más económico que AVE (60€+) y bus (30€+) a Kobetamendi.`,
    keywords: `carpooling madrid bbk live, viaje compartido madrid bilbao, como llegar bbk live desde madrid, bus madrid bbk live`,
  },
  "bilbao-bbk-live": {
    title: `Cómo ir a BBK Live desde Bilbao ${YEAR}: 15min, 5km, desde 3€`,
    description: `Cómo ir a BBK Live desde Bilbao ${YEAR}: 5 km al monte Kobetamendi, 15 min en coche, carpooling desde 3€/asiento. Lanzadera oficial desde Moyúa + bus BizkaiBus.`,
    keywords: `carpooling centro bilbao bbk live, viaje compartido bilbao kobetamendi, lanzadera bbk live moyua, bbk live como llegar desde bilbao, bilbao centro festival`,
  },
  "barcelona-bbk-live": {
    title: `Carpooling Barcelona → BBK Live ${YEAR} [Bilbao]: 12€, 5h, 510km`,
    description: `Carpooling Barcelona → BBK Live ${YEAR}: 510 km, 5h por AP-2+AP-68, desde 12€/asiento sin comisión. Mucho más barato que AVE (80€+) y bus nocturno a Kobetamendi.`,
    keywords: `carpooling barcelona bbk live, viaje compartido barcelona bilbao bbk live, como ir bbk live desde barcelona, bbk live desde barcelona`,
  },
  "donostia-bbk-live": {
    title: `Cómo ir a BBK Live desde Donostia ${YEAR}: 1h10, 100km, 4€`,
    description: `Cómo ir a BBK Live desde Donostia ${YEAR}: 100 km, 1h 10 min por A-8, carpooling desde 4€/asiento sin comisión. Más rápido que tren EuskoTren (1h 40 min) y bus.`,
    keywords: `carpooling donostia bbk live, viaje compartido san sebastian bilbao bbk live, como ir bbk live desde donostia`,
  },
  "santander-bbk-live": {
    title: `Cómo ir a BBK Live desde Santander ${YEAR}: 1h10, 100km, 4€`,
    description: `Cómo ir a BBK Live desde Santander ${YEAR}: 100 km, 1h 10 min por A-8, carpooling desde 4€/asiento sin comisión. Vuelta de madrugada coordinada a Cantabria.`,
    keywords: `carpooling santander bbk live, viaje compartido santander bilbao bbk live, como ir bbk live desde santander, bus santander bilbao bbk live`,
  },
  "vitoria-gasteiz-bbk-live": {
    title: `Carpooling Vitoria → BBK Live Bilbao ${YEAR}: 3€, 65 km`,
    keywords: `carpooling vitoria bbk live, viaje compartido vitoria bilbao bbk live, como ir bbk live desde vitoria`,
  },
  "pamplona-bbk-live": {
    title: `Carpooling Pamplona → BBK Live ${YEAR}: 5€, 155 km`,
    keywords: `carpooling pamplona bbk live, viaje compartido pamplona bilbao bbk live`,
  },
  // ── Resurrection Fest ───────────────────────────────────────────────────
  "a-coruna-resurrection-fest": {
    title: `Cómo ir a Resurrection Fest desde A Coruña ${YEAR}: 1h10, 100km, 4€`,
    description: `Cómo ir a Resurrection Fest desde A Coruña ${YEAR}: 100 km, 1h 10 min por AG-64, carpooling desde 4€/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling a coruña resurrection fest, viaje compartido a coruña viveiro, resurrection fest desde a coruña`,
  },
  "vigo-resurrection-fest": {
    title: `Cómo ir a Resurrection Fest desde Vigo ${YEAR}: 2h15, 200km, 6€`,
    description: `Cómo ir a Resurrection Fest desde Vigo ${YEAR}: 200 km, 2h 15 min por AP-9+AG-64, carpooling desde 6€/asiento sin comisión. Más rápido que bus a Viveiro.`,
    keywords: `carpooling vigo resurrection fest, viaje compartido vigo viveiro resurrection fest`,
  },
  "bilbao-resurrection-fest": {
    title: `Carpooling Bilbao → Resurrection Fest ${YEAR} [Galicia]: 10€, 4h`,
    description: `Carpooling Bilbao → Resurrection Fest ${YEAR}: 375 km, 4h por A-8+AG-64, desde 10€/asiento sin comisión. Vuelta de madrugada coordinada Bilbao–Viveiro.`,
    keywords: `carpooling bilbao resurrection fest, viaje compartido bilbao viveiro`,
  },
  // ── Primavera Sound / Sónar / Mad Cool ─────────────────────────────────
  "madrid-mad-cool": {
    title: `Cómo ir a Mad Cool desde Madrid ${YEAR}: 25min, 15km, desde 4€`,
    description: `Cómo ir a Mad Cool desde Madrid ${YEAR}: 15 km a IFEMA Iberdrola Music, 25 min, carpooling desde 4€/asiento. 0% comisión, conductores verificados.`,
    keywords: `carpooling madrid mad cool, viaje compartido madrid mad cool, como ir mad cool desde madrid centro, metro mad cool ifema, lanzadera mad cool madrid, mad cool desde madrid ${YEAR}`,
  },
  "madrid-primavera-sound": {
    title: `Madrid → Primavera Sound ${YEAR}: Carpooling 15€ vs bus/tren [BCN]`,
    description: `Carpooling Madrid → Primavera Sound ${YEAR}: 620 km, 5h 30 min por A-2, desde 15€/asiento sin comisión. Comparativa frente a AVE (60–100€) y bus nocturno (45€+).`,
    keywords: `carpooling madrid barcelona primavera sound, viaje compartido madrid barcelona festival, como ir primavera sound desde madrid`,
  },
  "barcelona-primavera-sound": {
    title: `Cómo ir a Primavera Sound desde Barcelona ${YEAR}: 15min, 8km, 3€`,
    description: `Cómo ir a Primavera Sound desde Barcelona ${YEAR}: 8 km al Parc del Fòrum, 15 min, carpooling desde 3€/asiento. 0% comisión, conductores verificados.`,
    keywords: `carpooling barcelona primavera sound, viaje compartido barcelona forum primavera, como ir primavera sound desde barcelona centro, primavera sound forum lanzadera, primavera sound bcn ${YEAR}`,
  },
  "valencia-primavera-sound": {
    title: `Carpooling Valencia → Primavera Sound ${YEAR} [BCN]: 10€, 3h15`,
    description: `Carpooling Valencia → Primavera Sound ${YEAR}: 355 km, 3h 15 min por AP-7, desde 10€/asiento sin comisión. Más económico que Euromed (50€+) y bus a Barcelona.`,
    keywords: `carpooling valencia primavera sound, viaje compartido valencia barcelona primavera sound, primavera sound desde valencia, valencia barcelona festival ${YEAR}`,
  },
  "madrid-sonar": {
    title: `Carpooling Madrid → Sónar Barcelona ${YEAR} [620km]: 15€, 5h30`,
    description: `Carpooling Madrid → Sónar ${YEAR}: 620 km, 5h 30 min por A-2 a Fira Montjuïc, desde 15€/asiento sin comisión. Comparativa frente a AVE (60–100€) y vuelo+metro.`,
    keywords: `carpooling madrid sonar barcelona, viaje compartido madrid sonar, como ir sonar desde madrid`,
  },
  "barcelona-sonar": {
    title: `Cómo ir a Sónar desde Barcelona ${YEAR}: 15min, 8km, desde 3€`,
    description: `Cómo ir a Sónar desde Barcelona ${YEAR}: 8 km a Fira Montjuïc + Gran Via, 15 min, carpooling desde 3€/asiento. 0% comisión, conductores verificados.`,
    keywords: `carpooling barcelona sonar, viaje compartido barcelona sonar festival, como ir sonar desde barcelona centro, sonar fira montjuic lanzadera, sonar bcn ${YEAR}`,
  },
  "barcelona-mad-cool": {
    title: `Carpooling Barcelona → Mad Cool ${YEAR} [Madrid]: 15€, 5h30, 620km`,
    description: `Carpooling Barcelona → Mad Cool ${YEAR}: 620 km, 5h 30 min por A-2 a IFEMA Madrid, desde 15€/asiento sin comisión. Más económico que AVE (60–100€) y vuelo.`,
    keywords: `carpooling barcelona madrid mad cool, viaje compartido barcelona madrid festival, como ir mad cool desde barcelona`,
  },
  "zaragoza-mad-cool": {
    title: `Carpooling Zaragoza → Mad Cool ${YEAR} [Madrid]: desde 9€, 3h`,
    description: `Carpooling Zaragoza → Mad Cool ${YEAR}: 325 km, 3h por A-2, desde 9€/asiento sin comisión. Más barato que AVE (40€+) y bus regular a IFEMA, vuelta coordinada.`,
    keywords: `carpooling zaragoza mad cool, viaje compartido zaragoza madrid mad cool`,
  },
  // ── Cala Mijas ──────────────────────────────────────────────────────────
  "malaga-cala-mijas": {
    title: `Cómo ir a Cala Mijas desde Málaga ${YEAR}: 45min, 60km, desde 3€`,
    description: `Cómo ir a Cala Mijas desde Málaga ${YEAR}: 60 km, 45 min por AP-7, carpooling desde 3€/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling malaga cala mijas, viaje compartido malaga cala mijas festival, como llegar cala mijas desde malaga`,
  },
  "madrid-cala-mijas": {
    title: `Carpooling Madrid → Cala Mijas Festival ${YEAR}: 14€, 560 km`,
    keywords: `carpooling madrid cala mijas festival, viaje compartido madrid cala mijas, como ir cala mijas desde madrid`,
  },
  // ── FIB Benicàssim ──────────────────────────────────────────────────────
  "madrid-fib": {
    title: `Carpooling Madrid → FIB ${YEAR} [Benicàssim]: desde 12€, 4h30`,
    description: `Carpooling Madrid → FIB Benicàssim ${YEAR}: 465 km, 4h 30 min por A-3+AP-7, desde 12€/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling madrid fib benicassim, viaje compartido madrid fib, como ir fib desde madrid, fib benicassim desde madrid`,
  },
  "barcelona-fib": {
    title: `Carpooling Barcelona → FIB ${YEAR} [Benicàssim]: desde 8€, 3h`,
    description: `Carpooling Barcelona → FIB ${YEAR}: 300 km, 3h por AP-7 costera, desde 8€/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling barcelona fib benicassim, viaje compartido barcelona fib, como ir fib desde barcelona`,
  },
  "valencia-fib": {
    title: `Cómo ir a FIB desde Valencia ${YEAR}: 50min, 70km, desde 3€`,
    description: `Cómo ir a FIB Benicàssim desde Valencia ${YEAR}: 70 km, 50 min por AP-7, carpooling desde 3€/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling valencia fib benicassim, viaje compartido valencia fib, como ir fib desde valencia`,
  },
  // ── O Son do Camiño ─────────────────────────────────────────────────────
  "a-coruna-o-son-do-camino": {
    title: `Carpooling A Coruña → O Son do Camiño ${YEAR}: 3€, 75 km`,
    keywords: `carpooling a coruña o son do camiño, viaje compartido a coruña santiago festival, como ir o son do camino desde a coruña, monte do gozo desde a coruña`,
  },
  "vigo-o-son-do-camino": {
    title: `Vigo → O Son do Camiño Santiago ${YEAR} desde 4€ · ConcertRide`,
    description: `Carpooling de Vigo a O Son do Camiño Santiago ${YEAR} (Monte do Gozo, 90 km, 1h 30 min). 0% comisión, conductores verificados.`,
    keywords: `vigo o son do camino carpooling, vigo santiago festival viaje compartido, vigo o son do camino ${YEAR}, carpooling galicia festival santiago, carpooling vigo o son do camiño, viaje compartido vigo santiago festival, como ir o son do camino desde vigo, o son do camiño desde vigo`,
  },
  "ourense-o-son-do-camino": {
    title: `Carpooling Ourense → O Son do Camiño ${YEAR}: 5€, 110 km`,
    keywords: `carpooling ourense o son do camiño, viaje compartido ourense santiago festival, como ir o son do camino desde ourense`,
  },
  "oviedo-o-son-do-camino": {
    title: `Carpooling Oviedo → O Son do Camiño ${YEAR}: 9€, 295 km`,
    keywords: `carpooling oviedo o son do camiño, viaje compartido oviedo santiago festival, como ir o son do camino desde oviedo, asturias santiago festival`,
  },
  // ── Sonorama Ribera (más rutas) ─────────────────────────────────────────
  "burgos-sonorama-ribera": {
    title: `Carpooling Burgos → Sonorama Ribera ${YEAR}: 3€, 75 km`,
    keywords: `carpooling burgos sonorama ribera, viaje compartido burgos aranda de duero, sonorama desde burgos, como ir sonorama ribera desde burgos`,
  },
  "bilbao-sonorama-ribera": {
    title: `Carpooling Bilbao → Sonorama Ribera ${YEAR}: 5€, 165 km`,
    keywords: `carpooling bilbao sonorama ribera, viaje compartido bilbao aranda sonorama, sonorama desde bilbao, como ir sonorama ribera desde bilbao`,
  },
  "zaragoza-sonorama-ribera": {
    title: `Carpooling Zaragoza → Sonorama Ribera ${YEAR}: 9€, 320 km`,
    keywords: `carpooling zaragoza sonorama ribera, viaje compartido zaragoza aranda de duero sonorama, sonorama desde zaragoza`,
  },
  // ── Medusa Festival local hub ───────────────────────────────────────────
  "valencia-medusa-festival": {
    title: `Carpooling Valencia → Medusa Festival Cullera ${YEAR}: 3€, 60 km`,
    keywords: `carpooling valencia medusa festival, viaje compartido valencia cullera medusa, como ir medusa festival desde valencia, medusa festival lanzadera valencia, medusa cullera desde valencia`,
  },
  // ── FIB desde Alicante (mediterráneo sur) ──────────────────────────────
  "alicante-fib": {
    title: `Carpooling Alicante → FIB Benicàssim ${YEAR}: 5€, 195 km`,
    keywords: `carpooling alicante fib benicassim, viaje compartido alicante fib, como ir fib desde alicante, fib desde alicante`,
  },
  // ── Medusa Festival ─────────────────────────────────────────────────────────
  "murcia-vina-rock": {
    title: `Carpooling Murcia → Viña Rock ${YEAR}: 8€, 155 km`,
    keywords: `carpooling murcia viña rock, viaje compartido murcia villarrobledo, como ir viña rock desde murcia, bus murcia viña rock`,
  },
  // ── Primavera Sound (más ciudades) ─────────────────────────────────────────
  "zaragoza-primavera-sound": {
    title: `Carpooling Zaragoza → Primavera Sound Barcelona ${YEAR}: 8€, 296 km`,
    keywords: `carpooling zaragoza primavera sound, viaje compartido zaragoza barcelona primavera sound, como ir primavera sound desde zaragoza`,
  },
  "bilbao-primavera-sound": {
    title: `Carpooling Bilbao → Primavera Sound Barcelona ${YEAR}: 12€, 510 km`,
    keywords: `carpooling bilbao primavera sound, viaje compartido bilbao barcelona festival, como ir primavera sound desde bilbao`,
  },
  // ── Mad Cool (más ciudades) ─────────────────────────────────────────────────
  "sevilla-mad-cool": {
    title: `Carpooling Sevilla → Mad Cool Madrid ${YEAR}: 10€, 530 km`,
    keywords: `carpooling sevilla mad cool, viaje compartido sevilla madrid mad cool, como ir mad cool desde sevilla, mad cool desde sevilla transporte, carpooling andalucia mad cool`,
  },
  "bilbao-mad-cool": {
    title: `Carpooling Bilbao → Mad Cool Madrid ${YEAR}: 11€, 395 km`,
    keywords: `carpooling bilbao mad cool, viaje compartido bilbao madrid mad cool, como ir mad cool desde bilbao`,
  },
  // ── Sónar (más ciudades) ────────────────────────────────────────────────────
  "zaragoza-sonar": {
    title: `Carpooling Zaragoza → Sónar BCN ${YEAR} [296km]: 8€, 2h45`,
    description: `Carpooling Zaragoza → Sónar Barcelona ${YEAR}: 296 km, 2h 45 min por AP-2, desde 8€/asiento sin comisión a Fira Montjuïc. Más rápido que AVE (40€+) y bus.`,
    keywords: `carpooling zaragoza sonar, viaje compartido zaragoza barcelona sonar, como ir sonar desde zaragoza`,
  },
  "valencia-sonar": {
    title: `Carpooling Valencia → Sónar BCN ${YEAR} [355km]: 10€, 3h15`,
    description: `Carpooling Valencia → Sónar Barcelona ${YEAR}: 355 km, 3h 15 min por AP-7, desde 10€/asiento sin comisión a Fira Montjuïc + Gran Via. Vuelta coordinada de.`,
    keywords: `carpooling valencia sonar barcelona, viaje compartido valencia sonar, como ir sonar desde valencia`,
  },
  // ── Cruïlla ─────────────────────────────────────────────────────────────────
  "madrid-cruilla": {
    title: `Carpooling Madrid → Cruïlla Barcelona ${YEAR}: 15€, 620 km`,
    keywords: `carpooling madrid cruilla, viaje compartido madrid barcelona cruilla, como ir cruilla desde madrid, transporte madrid cruilla ${YEAR}`,
  },
  "valencia-cruilla": {
    title: `Carpooling Valencia → Cruïlla Barcelona ${YEAR}: 10€, 355 km`,
    keywords: `carpooling valencia cruilla barcelona, viaje compartido valencia cruilla, como ir cruilla desde valencia`,
  },
  "zaragoza-cruilla": {
    title: `Carpooling Zaragoza → Cruïlla Barcelona ${YEAR}: 8€, 296 km`,
    keywords: `carpooling zaragoza cruilla, viaje compartido zaragoza barcelona cruilla, como ir cruilla desde zaragoza`,
  },
  // ── Tomavistas ──────────────────────────────────────────────────────────────
  "barcelona-tomavistas": {
    title: `Carpooling Barcelona → Tomavistas Madrid ${YEAR}: 15€, 620 km`,
    keywords: `carpooling barcelona tomavistas, viaje compartido barcelona madrid tomavistas, como ir tomavistas desde barcelona`,
  },
  "valencia-tomavistas": {
    title: `Carpooling Valencia → Tomavistas Madrid ${YEAR}: 10€, 355 km`,
    keywords: `carpooling valencia tomavistas madrid, viaje compartido valencia tomavistas, como ir tomavistas desde valencia`,
  },
  "zaragoza-tomavistas": {
    title: `Carpooling Zaragoza → Tomavistas Madrid ${YEAR}: 9€, 325 km`,
    keywords: `carpooling zaragoza tomavistas, viaje compartido zaragoza madrid tomavistas`,
  },
  // ── Low Festival ────────────────────────────────────────────────────────────
  "madrid-low-festival": {
    title: `Carpooling Madrid → Low Festival Benidorm ${YEAR}: 14€, 420 km`,
    keywords: `carpooling madrid low festival benidorm, viaje compartido madrid benidorm low festival, como ir low festival desde madrid`,
  },
  "barcelona-low-festival": {
    title: `Carpooling Barcelona → Low Festival Benidorm ${YEAR}: 12€, 480 km`,
    keywords: `carpooling barcelona low festival benidorm, viaje compartido barcelona benidorm, como ir low festival desde barcelona`,
  },
  "valencia-low-festival": {
    title: `Carpooling Valencia → Low Festival Benidorm ${YEAR}: 8€, 150 km`,
    keywords: `carpooling valencia low festival benidorm, viaje compartido valencia benidorm low festival, como ir low festival desde valencia`,
  },
  // ── Cala Mijas (más ciudades) ───────────────────────────────────────────────
  "sevilla-cala-mijas": {
    title: `Carpooling Sevilla → Cala Mijas ${YEAR} [Málaga]: desde 7€, 2h15`,
    description: `Carpooling Sevilla → Cala Mijas ${YEAR}: 215 km, 2h 15 min por A-92, desde 7€/asiento sin comisión a Mijas Costa. Más barato que bus directo y vuelta coordinada.`,
    keywords: `carpooling sevilla cala mijas, viaje compartido sevilla mijas festival, como ir cala mijas desde sevilla`,
  },
  "granada-cala-mijas": {
    title: `Carpooling Granada → Cala Mijas Festival ${YEAR}: 5€, 125 km`,
    keywords: `carpooling granada cala mijas, viaje compartido granada cala mijas festival, como ir cala mijas desde granada`,
  },
  // ── Sonorama Ribera (más ciudades) ─────────────────────────────────────────
  "valladolid-sonorama-ribera": {
    title: `Carpooling Valladolid → Sonorama Ribera ${YEAR}: 4€, 95 km`,
    keywords: `carpooling valladolid sonorama ribera, viaje compartido valladolid aranda sonorama, como ir sonorama desde valladolid`,
  },
  // ── Resurrection Fest (más ciudades) ────────────────────────────────────────
  "donostia-resurrection-fest": {
    title: `Carpooling Donostia → Resurrection Fest ${YEAR}: 10€, 430 km`,
    keywords: `carpooling donostia resurrection fest, viaje compartido san sebastian viveiro resurrection fest`,
  },
  // ── Vive Latino Zaragoza ─────────────────────────────────────────────────────
  "madrid-vive-latino": {
    title: `Carpooling Madrid → Vive Latino Zaragoza ${YEAR}: 9€, 330 km`,
    keywords: `carpooling madrid vive latino zaragoza, viaje compartido madrid zaragoza vive latino, como ir vive latino desde madrid, transporte vive latino madrid ${YEAR}`,
  },
  "barcelona-vive-latino": {
    title: `Carpooling Barcelona → Vive Latino Zaragoza ${YEAR}: 8€, 306 km`,
    keywords: `carpooling barcelona vive latino zaragoza, viaje compartido barcelona zaragoza vive latino, como ir vive latino desde barcelona`,
  },
  "valencia-vive-latino": {
    title: `Carpooling Valencia → Vive Latino Zaragoza ${YEAR}: 9€, 325 km`,
    keywords: `carpooling valencia vive latino zaragoza, viaje compartido valencia zaragoza vive latino, como ir vive latino desde valencia`,
  },
  "bilbao-vive-latino": {
    title: `Carpooling Bilbao → Vive Latino Zaragoza ${YEAR}: 9€, 324 km`,
    keywords: `carpooling bilbao vive latino zaragoza, viaje compartido bilbao zaragoza vive latino, como ir vive latino desde bilbao`,
  },
  "pamplona-vive-latino": {
    title: `Carpooling Pamplona → Vive Latino Zaragoza ${YEAR}: 5€, 177 km`,
    keywords: `carpooling pamplona vive latino zaragoza, viaje compartido pamplona zaragoza vive latino, vive latino desde pamplona`,
  },
  // ── Festival de les Arts Valencia ────────────────────────────────────────────
  "madrid-festival-de-les-arts": {
    title: `Carpooling Madrid → Festival de les Arts Valencia: 10€, 355 km`,
    keywords: `carpooling madrid festival les arts valencia, viaje compartido madrid valencia festival les arts, como ir festival les arts desde madrid`,
  },
  "alicante-festival-de-les-arts": {
    title: `Carpooling Alicante → Festival de les Arts Valencia: 5€, 166 km`,
    keywords: `carpooling alicante festival les arts, viaje compartido alicante valencia festival les arts, como ir festival les arts desde alicante`,
  },
  "barcelona-festival-de-les-arts": {
    title: `Carpooling Barcelona → Festival de les Arts Valencia: 10€, 349 km`,
    keywords: `carpooling barcelona festival les arts valencia, viaje compartido barcelona valencia festival les arts, festival les arts desde barcelona`,
  },
  "murcia-festival-de-les-arts": {
    title: `Carpooling Murcia → Festival de les Arts Valencia: 7€, 248 km`,
    keywords: `carpooling murcia festival les arts, viaje compartido murcia valencia festival les arts, festival les arts desde murcia`,
  },
  // ── Mad Cool desde Andalucía ──────────────────────────────────────────────────
  "malaga-mad-cool": {
    title: `Carpooling Málaga → Mad Cool Madrid ${YEAR}: 14€, 545 km`,
    keywords: `carpooling malaga mad cool, viaje compartido malaga madrid mad cool, como ir mad cool desde malaga, mad cool desde malaga, carpooling andalucia mad cool`,
  },
  "cadiz-mad-cool": {
    title: `Carpooling Cádiz → Mad Cool Madrid ${YEAR}: 12€, 650 km`,
    keywords: `carpooling cadiz mad cool, viaje compartido cadiz madrid mad cool, como ir mad cool desde cadiz, mad cool cadiz transporte`,
  },
  "granada-mad-cool": {
    title: `Carpooling Granada → Mad Cool Madrid ${YEAR}: 12€, 435 km`,
    keywords: `carpooling granada mad cool, viaje compartido granada madrid mad cool, como ir mad cool desde granada, mad cool granada carpooling`,
  },
  // ── Medusa Festival desde más ciudades ───────────────────────────────────────
  "alicante-medusa-festival": {
    title: `Carpooling Alicante → Medusa Festival Cullera ${YEAR}: 5€, 90 km`,
    keywords: `carpooling alicante medusa festival, viaje compartido alicante cullera medusa, como ir medusa festival desde alicante, medusa festival desde alicante`,
  },
  "murcia-medusa-festival": {
    title: `Carpooling Murcia → Medusa Festival Cullera ${YEAR}: 5€, 175 km`,
    keywords: `carpooling murcia medusa festival, viaje compartido murcia cullera medusa, como ir medusa festival desde murcia`,
  },
  "zaragoza-medusa-festival": {
    title: `Carpooling Zaragoza → Medusa Festival Cullera ${YEAR}: 10€, 345 km`,
    keywords: `carpooling zaragoza medusa festival, viaje compartido zaragoza cullera medusa, como ir medusa festival desde zaragoza`,
  },
  // ── Cala Mijas desde más ciudades ──────────────────────────────────────────
  "cadiz-cala-mijas": {
    title: `Carpooling Cádiz → Cala Mijas Festival ${YEAR}: 8€, 235 km`,
    keywords: `carpooling cadiz cala mijas, viaje compartido cadiz mijas festival, como ir cala mijas desde cadiz`,
  },
  "cordoba-cala-mijas": {
    title: `Carpooling Córdoba → Cala Mijas Festival ${YEAR}: 6€, 175 km`,
    keywords: `carpooling cordoba cala mijas, viaje compartido cordoba cala mijas festival, cala mijas desde cordoba`,
  },
  // ── Festival de Ortigueira (Galicia, gratuito) ─────────────────────────
  "a-coruna-festival-ortigueira": {
    title: `Carpooling A Coruña → Festival Ortigueira ${YEAR}: 4€, 100 km`,
    keywords: `carpooling a coruña festival ortigueira, viaje compartido a coruña ortigueira, como ir ortigueira desde a coruña, festival celta ortigueira a coruña`,
  },
  "lugo-festival-ortigueira": {
    title: `Carpooling Lugo → Festival Ortigueira ${YEAR}: 4€, 110 km`,
    keywords: `carpooling lugo festival ortigueira, viaje compartido lugo ortigueira, como ir ortigueira desde lugo, festival celta lugo`,
  },
  "vigo-festival-ortigueira": {
    title: `Carpooling Vigo → Festival Ortigueira ${YEAR}: 6€, 195 km`,
    keywords: `carpooling vigo festival ortigueira, viaje compartido vigo ortigueira, como ir ortigueira desde vigo, festival celta vigo`,
  },
  "santiago-de-compostela-festival-ortigueira": {
    title: `Carpooling Santiago → Festival Ortigueira ${YEAR}: 5€, 130 km`,
    keywords: `carpooling santiago festival ortigueira, viaje compartido santiago ortigueira, como ir ortigueira desde santiago, ortigueira desde compostela`,
  },
  "pontevedra-festival-ortigueira": {
    title: `Carpooling Pontevedra → Festival Ortigueira ${YEAR}: 6€, 175 km`,
    keywords: `carpooling pontevedra festival ortigueira, viaje compartido pontevedra ortigueira`,
  },
  "ourense-festival-ortigueira": {
    title: `Carpooling Ourense → Festival Ortigueira ${YEAR}: 8€, 240 km`,
    keywords: `carpooling ourense festival ortigueira, viaje compartido ourense ortigueira, ortigueira desde ourense`,
  },
  "oviedo-festival-ortigueira": {
    title: `Carpooling Oviedo → Festival Ortigueira ${YEAR}: 9€, 280 km`,
    keywords: `carpooling oviedo festival ortigueira, viaje compartido oviedo ortigueira, asturias ortigueira festival`,
  },
  "madrid-festival-ortigueira": {
    title: `Carpooling Madrid → Festival Ortigueira ${YEAR}: 18€, 690 km`,
    keywords: `carpooling madrid festival ortigueira, viaje compartido madrid ortigueira, como ir ortigueira desde madrid, festival celta madrid ortigueira`,
  },
  // ── Heineken Jazzaldia (Donostia–San Sebastián) ─────────────────────────
  "bilbao-jazzaldia": {
    title: `Carpooling Bilbao → Jazzaldia ${YEAR}: 4€, 100 km`,
    keywords: `carpooling bilbao jazzaldia, viaje compartido bilbao donostia jazzaldia, como ir jazzaldia desde bilbao, festival jazz bilbao donostia`,
  },
  "vitoria-gasteiz-jazzaldia": {
    title: `Carpooling Vitoria → Jazzaldia ${YEAR}: 5€, 115 km`,
    keywords: `carpooling vitoria jazzaldia, viaje compartido vitoria donostia jazzaldia, jazzaldia desde vitoria`,
  },
  "pamplona-jazzaldia": {
    title: `Carpooling Pamplona → Jazzaldia ${YEAR}: 4€, 90 km`,
    keywords: `carpooling pamplona jazzaldia, viaje compartido pamplona donostia jazzaldia, jazzaldia desde pamplona`,
  },
  "logrono-jazzaldia": {
    title: `Carpooling Logroño → Jazzaldia ${YEAR}: 6€, 175 km`,
    keywords: `carpooling logroño jazzaldia, viaje compartido logroño donostia jazzaldia, jazzaldia desde logroño`,
  },
  "santander-jazzaldia": {
    title: `Carpooling Santander → Jazzaldia ${YEAR}: 7€, 200 km`,
    keywords: `carpooling santander jazzaldia, viaje compartido santander donostia jazzaldia, jazzaldia desde santander`,
  },
  "burgos-jazzaldia": {
    title: `Carpooling Burgos → Jazzaldia ${YEAR}: 8€, 245 km`,
    keywords: `carpooling burgos jazzaldia, viaje compartido burgos donostia jazzaldia, jazzaldia desde burgos`,
  },
  "zaragoza-jazzaldia": {
    title: `Carpooling Zaragoza → Jazzaldia ${YEAR}: 8€, 270 km`,
    keywords: `carpooling zaragoza jazzaldia, viaje compartido zaragoza donostia jazzaldia, jazzaldia desde zaragoza`,
  },
  "madrid-jazzaldia": {
    title: `Carpooling Madrid → Jazzaldia ${YEAR}: 13€, 450 km`,
    keywords: `carpooling madrid jazzaldia, viaje compartido madrid donostia jazzaldia, como ir jazzaldia desde madrid, festival jazz madrid donostia`,
  },
  "barcelona-jazzaldia": {
    title: `Carpooling Barcelona → Jazzaldia ${YEAR}: 14€, 530 km`,
    keywords: `carpooling barcelona jazzaldia, viaje compartido barcelona donostia jazzaldia, jazzaldia desde barcelona`,
  },
  // ── Metrópoli Gijón ─────────────────────────────────────────────────────
  "oviedo-metropoli-gijon": {
    title: `Carpooling Oviedo → Metrópoli Gijón ${YEAR}: 3€, 30 km`,
    keywords: `carpooling oviedo metropoli gijon, viaje compartido oviedo gijon metropoli, metropoli desde oviedo, festival gijon desde oviedo`,
  },
  "leon-metropoli-gijon": {
    title: `Carpooling León → Metrópoli Gijón ${YEAR}: 5€, 120 km`,
    keywords: `carpooling leon metropoli gijon, viaje compartido leon gijon metropoli, metropoli desde leon`,
  },
  "santander-metropoli-gijon": {
    title: `Carpooling Santander → Metrópoli Gijón ${YEAR}: 6€, 190 km`,
    keywords: `carpooling santander metropoli gijon, viaje compartido santander gijon metropoli, metropoli desde santander`,
  },
  "bilbao-metropoli-gijon": {
    title: `Carpooling Bilbao → Metrópoli Gijón ${YEAR}: 9€, 290 km`,
    keywords: `carpooling bilbao metropoli gijon, viaje compartido bilbao gijon metropoli, metropoli desde bilbao`,
  },
  "valladolid-metropoli-gijon": {
    title: `Carpooling Valladolid → Metrópoli Gijón ${YEAR}: 8€, 240 km`,
    keywords: `carpooling valladolid metropoli gijon, viaje compartido valladolid gijon metropoli`,
  },
  "a-coruna-metropoli-gijon": {
    title: `Carpooling A Coruña → Metrópoli Gijón ${YEAR}: 9€, 290 km`,
    keywords: `carpooling a coruña metropoli gijon, viaje compartido a coruña gijon metropoli`,
  },
  "vigo-metropoli-gijon": {
    title: `Carpooling Vigo → Metrópoli Gijón ${YEAR}: 11€, 360 km`,
    keywords: `carpooling vigo metropoli gijon, viaje compartido vigo gijon metropoli`,
  },
  "madrid-metropoli-gijon": {
    title: `Carpooling Madrid → Metrópoli Gijón ${YEAR}: 13€, 445 km`,
    keywords: `carpooling madrid metropoli gijon, viaje compartido madrid gijon metropoli, como ir metropoli desde madrid, festival gijon desde madrid`,
  },
  // ── Granada Sound ───────────────────────────────────────────────────────
  "malaga-granada-sound": {
    title: `Carpooling Málaga → Granada Sound ${YEAR}: 5€, 130 km`,
    keywords: `carpooling malaga granada sound, viaje compartido malaga granada sound, como ir granada sound desde malaga, festival granada desde malaga`,
  },
  "almeria-granada-sound": {
    title: `Carpooling Almería → Granada Sound ${YEAR}: 6€, 170 km`,
    keywords: `carpooling almeria granada sound, viaje compartido almeria granada sound, granada sound desde almeria`,
  },
  "cordoba-granada-sound": {
    title: `Carpooling Córdoba → Granada Sound ${YEAR}: 7€, 200 km`,
    keywords: `carpooling cordoba granada sound, viaje compartido cordoba granada sound, granada sound desde cordoba`,
  },
  "sevilla-granada-sound": {
    title: `Carpooling Sevilla → Granada Sound ${YEAR}: 8€, 250 km`,
    keywords: `carpooling sevilla granada sound, viaje compartido sevilla granada sound, como ir granada sound desde sevilla, festival andalucia oriental`,
  },
  "jaen-granada-sound": {
    title: `Carpooling Jaén → Granada Sound ${YEAR}: 4€, 95 km`,
    keywords: `carpooling jaen granada sound, viaje compartido jaen granada sound, granada sound desde jaen`,
  },
  "murcia-granada-sound": {
    title: `Carpooling Murcia → Granada Sound ${YEAR}: 8€, 270 km`,
    keywords: `carpooling murcia granada sound, viaje compartido murcia granada sound, granada sound desde murcia`,
  },
  "alicante-granada-sound": {
    title: `Carpooling Alicante → Granada Sound ${YEAR}: 10€, 350 km`,
    keywords: `carpooling alicante granada sound, viaje compartido alicante granada sound, granada sound desde alicante`,
  },
  "cadiz-granada-sound": {
    title: `Carpooling Cádiz → Granada Sound ${YEAR}: 8€, 280 km`,
    keywords: `carpooling cadiz granada sound, viaje compartido cadiz granada sound, granada sound desde cadiz`,
  },
  "madrid-granada-sound": {
    title: `Carpooling Madrid → Granada Sound ${YEAR}: 12€, 430 km`,
    keywords: `carpooling madrid granada sound, viaje compartido madrid granada sound, como ir granada sound desde madrid, festival indie granada desde madrid`,
  },
  // ── GSC-driven — high-impression routes that lacked overrides ─────────────
  "castellon-de-la-plana-arenal-sound": {
    title: `Carpooling Castellón → Arenal Sound ${YEAR}: 3€, 10 km`,
    keywords: `carpooling castellon arenal sound, autobus castellon de la plana arenal sound, viaje compartido castellon burriana, como ir arenal sound desde castellon, castellon de la plana burriana lanzadera, arenal sound bus castellon`,
  },
  "donostia-san-sebastian-bbk-live": {
    title: `Carpooling Donostia–San Sebastián → BBK Live ${YEAR}: 4€, 100 km`,
    keywords: `carpooling donostia san sebastian bbk live, viaje compartido san sebastian bilbao bbk live, como ir bbk live desde donostia, bbk live desde san sebastian, donostia bilbao carpooling`,
  },
  "centro-de-bilbao-bbk-live": {
    title: `Carpooling Centro Bilbao → BBK Live Kobetamendi ${YEAR}: 3€, 4 km`,
    keywords: `carpooling centro bilbao bbk live, viaje compartido bilbao centro kobetamendi, lanzadera bbk live moyua, bbk live como llegar desde bilbao, bilbao centro festival`,
  },
  "valencia-centro-zevra-festival": {
    title: `Carpooling Valencia Centro → Zevra Festival ${YEAR}: 3€, 5 km`,
    keywords: `carpooling valencia centro zevra festival, viaje compartido valencia ciudad la marina zevra, zevra desde valencia centro, marina valencia carpooling`,
  },
  // Catalan/Aragón hubs missing overrides
  "lleida-cruilla": {
    title: `Carpooling Lleida → Cruïlla Barcelona ${YEAR}: 5€, 165 km`,
    keywords: `carpooling lleida cruilla, viaje compartido lleida barcelona cruilla, como ir cruilla desde lleida, lleida festival barcelona`,
  },
  "lleida-primavera-sound": {
    title: `Carpooling Lleida → Primavera Sound ${YEAR}: 5€, 165 km`,
    keywords: `carpooling lleida primavera sound, viaje compartido lleida barcelona primavera sound, primavera sound desde lleida`,
  },
  "girona-cruilla": {
    title: `Carpooling Girona → Cruïlla Barcelona ${YEAR}: 4€, 105 km`,
    keywords: `carpooling girona cruilla, viaje compartido girona barcelona cruilla, como ir cruilla desde girona, girona festival barcelona`,
  },
  "girona-sonar": {
    title: `Girona → Sónar Barcelona ${YEAR} desde 5€ · ConcertRide`,
    description: `Carpooling de Girona a Sónar Barcelona ${YEAR} (Fira Montjuïc + Gran Via, 100 km, 1h 15 min). 0% comisión, conductores verificados.`,
    keywords: `girona sonar barcelona carpooling, girona sonar festival viaje compartido, girona sonar ${YEAR}, carpooling girona festival barcelona, carpooling girona sonar, viaje compartido girona barcelona sonar, sonar desde girona, girona electronica festival`,
  },
  "girona-primavera-sound": {
    title: `Carpooling Girona → Primavera Sound ${YEAR}: 4€, 105 km`,
    keywords: `carpooling girona primavera sound, viaje compartido girona barcelona primavera sound, primavera sound desde girona`,
  },
  "girona-o-son-do-camino": {
    title: `Carpooling Girona → O Son do Camiño ${YEAR} desde 22€ · ConcertRide`,
    keywords: `carpooling girona o son do camino, viaje compartido girona santiago festival, como ir o son do camino desde girona`,
  },
  // Cuenca / Castilla-La Mancha
  "cuenca-vina-rock": {
    title: `Cuenca → Viña Rock ${YEAR}: carpooling 2h desde 5€ | ConcertRide`,
    description: `Carpooling de Cuenca a Viña Rock ${YEAR} (La Pulgosa Villarrobledo, 200 km, 2h 10 min). 0% comisión, conductores verificados.`,
    keywords: `cuenca vina rock carpooling, cuenca villarrobledo festival viaje compartido, cuenca vina rock ${YEAR}, carpooling castilla la mancha festival, carpooling cuenca vina rock, viaje compartido cuenca villarrobledo, viña rock desde cuenca, como ir viña rock desde cuenca, bus cuenca viña rock`,
  },
  "toledo-fib": {
    title: `Carpooling Toledo → FIB Benicàssim ${YEAR}: 11€, 470 km`,
    keywords: `carpooling toledo fib benicassim, viaje compartido toledo fib, fib desde toledo`,
  },
  "segovia-sonorama-ribera": {
    title: `Carpooling Segovia → Sonorama Ribera ${YEAR}: 5€, 130 km`,
    keywords: `carpooling segovia sonorama ribera, viaje compartido segovia aranda de duero, sonorama desde segovia`,
  },
  // Andalucía routes missing overrides
  "fuengirola-cala-mijas": {
    title: `Carpooling Fuengirola → Cala Mijas Festival ${YEAR}: 3€, 10 km`,
    keywords: `carpooling fuengirola cala mijas, viaje compartido fuengirola mijas festival, como ir cala mijas desde fuengirola, fuengirola cala mijas bus`,
  },
  "marbella-cala-mijas": {
    title: `Carpooling Marbella → Cala Mijas Festival ${YEAR}: 3€, 20 km`,
    keywords: `carpooling marbella cala mijas, viaje compartido marbella mijas festival, como ir cala mijas desde marbella`,
  },
  "almeria-cala-mijas": {
    title: `Carpooling Almería → Cala Mijas Festival ${YEAR}: 7€, 200 km`,
    keywords: `carpooling almeria cala mijas, viaje compartido almeria cala mijas, cala mijas desde almeria`,
  },
  "cartagena-cala-mijas": {
    title: `Carpooling Cartagena → Cala Mijas Festival ${YEAR}: 8€, 290 km`,
    keywords: `carpooling cartagena cala mijas, viaje compartido cartagena mijas festival, cala mijas desde cartagena`,
  },
  "granada-resurrection-fest": {
    title: `Carpooling Granada → Resurrection Fest ${YEAR}: 25€, 990 km`,
    keywords: `carpooling granada resurrection fest, viaje compartido granada viveiro, resurrection fest desde granada`,
  },
  "granada-primavera-sound": {
    title: `Carpooling Granada → Primavera Sound ${YEAR}: 25€, 870 km`,
    keywords: `carpooling granada primavera sound, viaje compartido granada barcelona primavera sound, primavera sound desde granada`,
  },
  // Cantabria / La Rioja routes
  "santander-arenal-sound": {
    title: `Carpooling Santander → Arenal Sound ${YEAR}: 18€, 660 km`,
    keywords: `carpooling santander arenal sound, viaje compartido santander burriana, arenal sound desde santander`,
  },
  "santander-sonar": {
    title: `Carpooling Santander → Sónar Barcelona ${YEAR}: 18€, 720 km`,
    keywords: `carpooling santander sonar, viaje compartido santander barcelona sonar, sonar desde santander`,
  },
  "logrono-medusa-festival": {
    title: `Carpooling Logroño → Medusa Festival ${YEAR}: 12€, 470 km`,
    keywords: `carpooling logroño medusa festival, viaje compartido logroño cullera medusa, medusa festival desde logroño`,
  },
  "logrono-o-son-do-camino": {
    title: `Carpooling Logroño → O Son do Camiño ${YEAR}: 18€, 685 km`,
    keywords: `carpooling logroño o son do camino, viaje compartido logroño santiago festival, o son do camiño desde logroño`,
  },
  "burgos-resurrection-fest": {
    title: `Carpooling Burgos → Resurrection Fest ${YEAR}: 13€, 480 km`,
    keywords: `carpooling burgos resurrection fest, viaje compartido burgos viveiro, resurrection fest desde burgos`,
  },
  // Asturias outbound (oviedo to multiple festivals)
  "oviedo-bbk-live": {
    title: `Carpooling Oviedo → BBK Live Bilbao ${YEAR}: 9€, 305 km`,
    keywords: `carpooling oviedo bbk live, viaje compartido oviedo bilbao bbk live, bbk live desde oviedo, asturias bbk live`,
  },
  "oviedo-resurrection-fest": {
    title: `Carpooling Oviedo → Resurrection Fest ${YEAR}: 7€, 190 km`,
    keywords: `carpooling oviedo resurrection fest, viaje compartido oviedo viveiro, resurrection fest desde oviedo, asturias resurrection fest`,
  },
  // Extremadura → Mediterranean
  "caceres-arenal-sound": {
    title: `Carpooling Cáceres → Arenal Sound ${YEAR}: 18€, 690 km`,
    keywords: `carpooling caceres arenal sound, viaje compartido caceres burriana, arenal sound desde caceres`,
  },
  // Galicia local hub
  "pontevedra-o-son-do-camino": {
    title: `Carpooling Pontevedra → O Son do Camiño ${YEAR}: 3€, 55 km`,
    keywords: `carpooling pontevedra o son do camino, viaje compartido pontevedra santiago festival, o son do camino desde pontevedra, monte do gozo desde pontevedra`,
  },
  "pontevedra-mad-cool": {
    title: `Carpooling Pontevedra → Mad Cool Madrid ${YEAR}: 18€, 600 km`,
    keywords: `carpooling pontevedra mad cool, viaje compartido pontevedra madrid mad cool, mad cool desde pontevedra`,
  },
  // Levante hubs
  "alicante-bbk-live": {
    title: `Carpooling Alicante → BBK Live ${YEAR}: 18€, 770 km`,
    keywords: `carpooling alicante bbk live, viaje compartido alicante bilbao bbk live, bbk live desde alicante`,
  },
  "pamplona-zevra-festival": {
    title: `Carpooling Pamplona → Zevra Festival Valencia ${YEAR}: 13€, 500 km`,
    keywords: `carpooling pamplona zevra festival, viaje compartido pamplona valencia zevra, zevra desde pamplona`,
  },
  // ── Wave 9: routes from the 26 new origin cities ─────────────────────────
  // Aranda de Duero (Sonorama venue) → other festivals
  "aranda-de-duero-mad-cool": {
    title: `Carpooling Aranda → Mad Cool Madrid ${YEAR}: 6€, 160 km`,
    keywords: `carpooling aranda de duero mad cool, viaje compartido aranda madrid mad cool, aranda mad cool, sonorama aranda mad cool`,
  },
  // Mijas as origin (Cala Mijas is local — but Mijas → other Andalucía festivals)
  "mijas-granada-sound": {
    title: `Carpooling Mijas → Granada Sound ${YEAR}: 5€, 145 km`,
    keywords: `carpooling mijas granada sound, viaje compartido mijas granada festival, mijas granada sound`,
  },
  "mijas-mad-cool": {
    title: `Carpooling Mijas → Mad Cool Madrid ${YEAR}: 14€, 575 km`,
    keywords: `carpooling mijas mad cool, viaje compartido mijas madrid, mijas mad cool desde costa del sol`,
  },
  // Marbella as origin
  "marbella-granada-sound": {
    title: `Carpooling Marbella → Granada Sound ${YEAR}: 5€, 155 km`,
    keywords: `carpooling marbella granada sound, viaje compartido marbella granada festival, marbella granada sound`,
  },
  "marbella-mad-cool": {
    title: `Carpooling Marbella → Mad Cool Madrid ${YEAR}: 15€, 575 km`,
    keywords: `carpooling marbella mad cool, viaje compartido marbella madrid mad cool, mad cool desde marbella, costa del sol mad cool`,
  },
  // Fuengirola as origin
  "fuengirola-granada-sound": {
    title: `Carpooling Fuengirola → Granada Sound ${YEAR}: 5€, 140 km`,
    keywords: `carpooling fuengirola granada sound, viaje compartido fuengirola granada festival, fuengirola granada sound`,
  },
  "fuengirola-mad-cool": {
    title: `Carpooling Fuengirola → Mad Cool Madrid ${YEAR}: 15€, 555 km`,
    keywords: `carpooling fuengirola mad cool, viaje compartido fuengirola madrid mad cool, mad cool desde fuengirola`,
  },
  // Jerez de la Frontera as origin
  "jerez-de-la-frontera-cala-mijas": {
    title: `Carpooling Jerez → Cala Mijas Festival ${YEAR}: 7€, 235 km`,
    keywords: `carpooling jerez cala mijas, viaje compartido jerez mijas festival, cala mijas desde jerez de la frontera`,
  },
  "jerez-de-la-frontera-granada-sound": {
    title: `Carpooling Jerez → Granada Sound ${YEAR}: 9€, 320 km`,
    keywords: `carpooling jerez granada sound, viaje compartido jerez granada festival, jerez granada sound`,
  },
  "jerez-de-la-frontera-mad-cool": {
    title: `Carpooling Jerez → Mad Cool Madrid ${YEAR}: 16€, 655 km`,
    keywords: `carpooling jerez mad cool, viaje compartido jerez madrid mad cool, mad cool desde jerez de la frontera`,
  },
  // Cartagena as origin
  "cartagena-medusa-festival": {
    title: `Carpooling Cartagena → Medusa Festival Cullera ${YEAR}: 6€, 175 km`,
    keywords: `carpooling cartagena medusa festival, viaje compartido cartagena cullera medusa, medusa festival desde cartagena`,
  },
  "cartagena-vina-rock": {
    title: `Carpooling Cartagena → Viña Rock ${YEAR}: 7€, 220 km`,
    keywords: `carpooling cartagena vina rock, viaje compartido cartagena villarrobledo, viña rock desde cartagena`,
  },
  "cartagena-mad-cool": {
    title: `Carpooling Cartagena → Mad Cool Madrid ${YEAR}: 13€, 445 km`,
    keywords: `carpooling cartagena mad cool, viaje compartido cartagena madrid mad cool, mad cool desde cartagena`,
  },
  // Elche as origin
  "elche-low-festival": {
    title: `Carpooling Elche → Low Festival Benidorm ${YEAR}: 4€, 75 km`,
    keywords: `carpooling elche low festival, viaje compartido elche benidorm low festival, low festival desde elche`,
  },
  "elche-arenal-sound": {
    title: `Carpooling Elche → Arenal Sound ${YEAR}: 5€, 135 km`,
    keywords: `carpooling elche arenal sound, viaje compartido elche burriana arenal, arenal sound desde elche`,
  },
  "elche-medusa-festival": {
    title: `Carpooling Elche → Medusa Festival Cullera ${YEAR}: 5€, 135 km`,
    keywords: `carpooling elche medusa festival, viaje compartido elche cullera medusa, medusa desde elche`,
  },
  "elche-mad-cool": {
    title: `Carpooling Elche → Mad Cool Madrid ${YEAR}: 12€, 425 km`,
    keywords: `carpooling elche mad cool, viaje compartido elche madrid mad cool, mad cool desde elche`,
  },
  // Benidorm as origin (besides Low Festival which is local)
  "benidorm-low-festival": {
    title: `Carpooling Benidorm → Low Festival ${YEAR} desde 3€ · ConcertRide`,
    keywords: `carpooling benidorm low festival, viaje compartido benidorm low festival, low festival desde benidorm centro`,
  },
  "benidorm-arenal-sound": {
    title: `Carpooling Benidorm → Arenal Sound Burriana ${YEAR}: 5€, 175 km`,
    keywords: `carpooling benidorm arenal sound, viaje compartido benidorm burriana, arenal sound desde benidorm`,
  },
  "benidorm-medusa-festival": {
    title: `Carpooling Benidorm → Medusa Festival Cullera ${YEAR}: 4€, 125 km`,
    keywords: `carpooling benidorm medusa festival, viaje compartido benidorm cullera, medusa desde benidorm`,
  },
  // Madrid metro suburbs → festivals
  "mostoles-mad-cool": {
    title: `Carpooling Móstoles → Mad Cool Madrid ${YEAR}: 3€, 35 km`,
    keywords: `carpooling mostoles mad cool, viaje compartido mostoles ifema, mad cool desde mostoles, mostoles madrid carpooling`,
  },
  "mostoles-vina-rock": {
    title: `Carpooling Móstoles → Viña Rock ${YEAR}: 7€, 245 km`,
    keywords: `carpooling mostoles vina rock, viaje compartido mostoles villarrobledo, viña rock desde mostoles`,
  },
  "alcala-de-henares-mad-cool": {
    title: `Carpooling Alcalá → Mad Cool Madrid ${YEAR}: 3€, 25 km`,
    keywords: `carpooling alcala de henares mad cool, viaje compartido alcala ifema mad cool, mad cool desde alcala henares`,
  },
  "alcala-de-henares-sonorama-ribera": {
    title: `Carpooling Alcalá → Sonorama Ribera ${YEAR}: 5€, 130 km`,
    keywords: `carpooling alcala de henares sonorama, viaje compartido alcala aranda sonorama, sonorama desde alcala henares`,
  },
  "getafe-mad-cool": {
    title: `Carpooling Getafe → Mad Cool Madrid ${YEAR}: 3€, 30 km`,
    keywords: `carpooling getafe mad cool, viaje compartido getafe ifema, mad cool desde getafe, getafe madrid carpooling festival`,
  },
  "getafe-vina-rock": {
    title: `Carpooling Getafe → Viña Rock ${YEAR}: 7€, 235 km`,
    keywords: `carpooling getafe vina rock, viaje compartido getafe villarrobledo, viña rock desde getafe`,
  },
  // Catalonia metro suburbs → festivals
  "sabadell-primavera-sound": {
    title: `Carpooling Sabadell → Primavera Sound ${YEAR}: 3€, 30 km`,
    keywords: `carpooling sabadell primavera sound, viaje compartido sabadell barcelona forum, primavera sound desde sabadell`,
  },
  "sabadell-cruilla": {
    title: `Carpooling Sabadell → Cruïlla Barcelona ${YEAR}: 3€, 30 km`,
    keywords: `carpooling sabadell cruilla, viaje compartido sabadell cruilla forum, cruilla desde sabadell`,
  },
  "sabadell-sonar": {
    title: `Carpooling Sabadell → Sónar Barcelona ${YEAR}: 3€, 30 km`,
    keywords: `carpooling sabadell sonar, viaje compartido sabadell montjuic, sonar desde sabadell`,
  },
  "terrassa-primavera-sound": {
    title: `Carpooling Terrassa → Primavera Sound ${YEAR}: 3€, 30 km`,
    keywords: `carpooling terrassa primavera sound, viaje compartido terrassa barcelona forum, primavera sound desde terrassa`,
  },
  "terrassa-cruilla": {
    title: `Carpooling Terrassa → Cruïlla Barcelona ${YEAR}: 3€, 30 km`,
    keywords: `carpooling terrassa cruilla, viaje compartido terrassa cruilla, cruilla desde terrassa`,
  },
  "terrassa-sonar": {
    title: `Carpooling Terrassa → Sónar Barcelona ${YEAR}: 3€, 30 km`,
    keywords: `carpooling terrassa sonar, viaje compartido terrassa montjuic, sonar desde terrassa`,
  },
  "mataro-primavera-sound": {
    title: `Carpooling Mataró → Primavera Sound ${YEAR}: 3€, 35 km`,
    keywords: `carpooling mataro primavera sound, viaje compartido mataro forum, primavera sound desde mataro`,
  },
  "mataro-cruilla": {
    title: `Carpooling Mataró → Cruïlla ${YEAR}: 3€, 35 km`,
    keywords: `carpooling mataro cruilla, viaje compartido mataro cruilla, cruilla desde mataro`,
  },
  "reus-primavera-sound": {
    title: `Carpooling Reus → Primavera Sound ${YEAR}: 5€, 110 km`,
    keywords: `carpooling reus primavera sound, viaje compartido reus barcelona, primavera sound desde reus`,
  },
  "reus-fib": {
    title: `Carpooling Reus → FIB Benicàssim ${YEAR}: 6€, 190 km`,
    keywords: `carpooling reus fib benicassim, viaje compartido reus fib, fib desde reus`,
  },
  "manresa-primavera-sound": {
    title: `Carpooling Manresa → Primavera Sound ${YEAR}: 4€, 75 km`,
    keywords: `carpooling manresa primavera sound, viaje compartido manresa forum, primavera sound desde manresa`,
  },
  // Huesca → Aragón / Pirineos
  "huesca-vive-latino": {
    title: `Carpooling Huesca → Vive Latino Zaragoza ${YEAR}: 3€, 75 km`,
    keywords: `carpooling huesca vive latino, viaje compartido huesca zaragoza, vive latino desde huesca`,
  },
  "huesca-mad-cool": {
    title: `Carpooling Huesca → Mad Cool Madrid ${YEAR}: 11€, 390 km`,
    keywords: `carpooling huesca mad cool, viaje compartido huesca madrid, mad cool desde huesca`,
  },
  "huesca-primavera-sound": {
    title: `Carpooling Huesca → Primavera Sound Barcelona ${YEAR}: 11€, 380 km`,
    keywords: `carpooling huesca primavera sound, viaje compartido huesca barcelona, primavera sound desde huesca`,
  },
  // Algeciras → Andalucía festivals
  "algeciras-cala-mijas": {
    title: `Carpooling Algeciras → Cala Mijas Festival ${YEAR}: 5€, 105 km`,
    keywords: `carpooling algeciras cala mijas, viaje compartido algeciras mijas festival, cala mijas desde algeciras`,
  },
  // Avilés → norte
  "aviles-metropoli-gijon": {
    title: `Carpooling Avilés → Metrópoli Gijón ${YEAR}: 3€, 25 km`,
    keywords: `carpooling aviles metropoli gijon, viaje compartido aviles gijon, metropoli desde aviles`,
  },
  "aviles-bbk-live": {
    title: `Carpooling Avilés → BBK Live ${YEAR}: 9€, 270 km`,
    keywords: `carpooling aviles bbk live, viaje compartido aviles bilbao, bbk live desde aviles`,
  },
  // Ponferrada → Galicia / norte
  "ponferrada-o-son-do-camino": {
    title: `Carpooling Ponferrada → O Son do Camiño ${YEAR}: 7€, 210 km`,
    keywords: `carpooling ponferrada o son do camino, viaje compartido ponferrada santiago, o son do camino desde ponferrada`,
  },
  "ponferrada-resurrection-fest": {
    title: `Carpooling Ponferrada → Resurrection Fest ${YEAR}: 8€, 250 km`,
    keywords: `carpooling ponferrada resurrection fest, viaje compartido ponferrada viveiro, resurrection fest desde ponferrada`,
  },
  // Talavera de la Reina → festivales
  "talavera-de-la-reina-mad-cool": {
    title: `Carpooling Talavera → Mad Cool Madrid ${YEAR}: 5€, 120 km`,
    keywords: `carpooling talavera mad cool, viaje compartido talavera madrid mad cool, mad cool desde talavera de la reina`,
  },
  "talavera-de-la-reina-vina-rock": {
    title: `Carpooling Talavera → Viña Rock ${YEAR}: 6€, 180 km`,
    keywords: `carpooling talavera vina rock, viaje compartido talavera villarrobledo, viña rock desde talavera`,
  },
  // Gandia → Levante
  "gandia-medusa-festival": {
    title: `Carpooling Gandia → Medusa Festival Cullera ${YEAR}: 3€, 15 km`,
    keywords: `carpooling gandia medusa festival, viaje compartido gandia cullera medusa, medusa desde gandia`,
  },
  "gandia-arenal-sound": {
    title: `Carpooling Gandia → Arenal Sound Burriana ${YEAR}: 5€, 130 km`,
    keywords: `carpooling gandia arenal sound, viaje compartido gandia burriana, arenal sound desde gandia`,
  },
  "gandia-festival-de-les-arts": {
    title: `Carpooling Gandia → Festival de les Arts Valencia ${YEAR}: 3€, 65 km`,
    keywords: `carpooling gandia festival les arts, viaje compartido gandia valencia, festival les arts desde gandia`,
  },
  // Mérida → festivales
  "merida-cala-mijas": {
    title: `Carpooling Mérida → Cala Mijas Festival ${YEAR}: 13€, 480 km`,
    keywords: `carpooling merida cala mijas, viaje compartido merida mijas festival, cala mijas desde merida`,
  },
  "merida-mad-cool": {
    title: `Carpooling Mérida → Mad Cool Madrid ${YEAR}: 10€, 340 km`,
    keywords: `carpooling merida mad cool, viaje compartido merida madrid, mad cool desde merida`,
  },
  // ── Wave 10: routes for 5 new festivals ───────────────────────────────────
  // Pirineos Sur (Lanuza)
  "huesca-pirineos-sur": {
    title: `Carpooling Huesca → Pirineos Sur ${YEAR}: 3€, 75 km`,
    keywords: `carpooling huesca pirineos sur, viaje compartido huesca lanuza, pirineos sur desde huesca, sallent de gallego desde huesca`,
  },
  "zaragoza-pirineos-sur": {
    title: `Carpooling Zaragoza → Pirineos Sur ${YEAR}: 6€, 175 km`,
    keywords: `carpooling zaragoza pirineos sur, viaje compartido zaragoza lanuza, pirineos sur desde zaragoza, festival lanuza desde zaragoza`,
  },
  "pamplona-pirineos-sur": {
    title: `Carpooling Pamplona → Pirineos Sur ${YEAR}: 7€, 215 km`,
    keywords: `carpooling pamplona pirineos sur, viaje compartido pamplona lanuza, pirineos sur desde pamplona`,
  },
  "madrid-pirineos-sur": {
    title: `Carpooling Madrid → Pirineos Sur ${YEAR}: 13€, 480 km`,
    keywords: `carpooling madrid pirineos sur, viaje compartido madrid lanuza pirineos sur, pirineos sur desde madrid, festival aragon desde madrid`,
  },
  "barcelona-pirineos-sur": {
    title: `Carpooling Barcelona → Pirineos Sur ${YEAR}: 12€, 430 km`,
    keywords: `carpooling barcelona pirineos sur, viaje compartido barcelona lanuza, pirineos sur desde barcelona`,
  },
  "lleida-pirineos-sur": {
    title: `Carpooling Lleida → Pirineos Sur ${YEAR}: 7€, 200 km`,
    keywords: `carpooling lleida pirineos sur, viaje compartido lleida lanuza, pirineos sur desde lleida`,
  },
  "bilbao-pirineos-sur": {
    title: `Carpooling Bilbao → Pirineos Sur ${YEAR}: 11€, 360 km`,
    keywords: `carpooling bilbao pirineos sur, viaje compartido bilbao lanuza, pirineos sur desde bilbao`,
  },
  // Starlite Marbella
  "malaga-starlite-marbella": {
    title: `Carpooling Málaga → Starlite Marbella ${YEAR}: 3€, 60 km`,
    keywords: `carpooling malaga starlite marbella, viaje compartido malaga marbella, starlite desde malaga, cantera de nagueles desde malaga`,
  },
  "mijas-starlite-marbella": {
    title: `Carpooling Mijas → Starlite Marbella ${YEAR}: 3€, 20 km`,
    keywords: `carpooling mijas starlite marbella, viaje compartido mijas marbella, starlite desde mijas`,
  },
  "fuengirola-starlite-marbella": {
    title: `Carpooling Fuengirola → Starlite Marbella ${YEAR}: 3€, 25 km`,
    keywords: `carpooling fuengirola starlite marbella, viaje compartido fuengirola marbella, starlite desde fuengirola`,
  },
  "granada-starlite-marbella": {
    title: `Carpooling Granada → Starlite Marbella ${YEAR}: 6€, 155 km`,
    keywords: `carpooling granada starlite marbella, viaje compartido granada marbella, starlite desde granada`,
  },
  "sevilla-starlite-marbella": {
    title: `Carpooling Sevilla → Starlite Marbella ${YEAR}: 7€, 210 km`,
    keywords: `carpooling sevilla starlite marbella, viaje compartido sevilla marbella, starlite desde sevilla, costa del sol festival desde sevilla`,
  },
  "madrid-starlite-marbella": {
    title: `Carpooling Madrid → Starlite Marbella ${YEAR}: 14€, 575 km`,
    keywords: `carpooling madrid starlite marbella, viaje compartido madrid marbella, starlite desde madrid, costa del sol desde madrid`,
  },
  "algeciras-starlite-marbella": {
    title: `Carpooling Algeciras → Starlite Marbella ${YEAR}: 4€, 80 km`,
    keywords: `carpooling algeciras starlite marbella, viaje compartido algeciras marbella, starlite desde algeciras`,
  },
  // Stone & Music Mérida
  "caceres-stone-music-festival": {
    title: `Carpooling Cáceres → Stone & Music Mérida ${YEAR}: 4€, 75 km`,
    keywords: `carpooling caceres stone music merida, viaje compartido caceres merida festival, stone music desde caceres, teatro romano merida desde caceres`,
  },
  "badajoz-stone-music-festival": {
    title: `Carpooling Badajoz → Stone & Music Mérida ${YEAR}: 3€, 60 km`,
    keywords: `carpooling badajoz stone music merida, viaje compartido badajoz merida festival, stone music desde badajoz`,
  },
  "sevilla-stone-music-festival": {
    title: `Carpooling Sevilla → Stone & Music Mérida ${YEAR}: 6€, 200 km`,
    keywords: `carpooling sevilla stone music merida, viaje compartido sevilla merida, stone music desde sevilla, teatro romano merida desde sevilla`,
  },
  "madrid-stone-music-festival": {
    title: `Carpooling Madrid → Stone & Music Mérida ${YEAR}: 10€, 340 km`,
    keywords: `carpooling madrid stone music merida, viaje compartido madrid merida festival, stone music desde madrid, teatro romano merida desde madrid`,
  },
  "salamanca-stone-music-festival": {
    title: `Carpooling Salamanca → Stone & Music Mérida ${YEAR}: 7€, 215 km`,
    keywords: `carpooling salamanca stone music merida, viaje compartido salamanca merida, stone music desde salamanca`,
  },
  "cordoba-stone-music-festival": {
    title: `Carpooling Córdoba → Stone & Music Mérida ${YEAR}: 8€, 250 km`,
    keywords: `carpooling cordoba stone music merida, viaje compartido cordoba merida festival, stone music desde cordoba`,
  },
  // Marenostrum Fuengirola
  "malaga-marenostrum-fuengirola": {
    title: `Carpooling Málaga → Marenostrum Fuengirola ${YEAR}: 3€, 35 km`,
    keywords: `carpooling malaga marenostrum fuengirola, viaje compartido malaga fuengirola castle park, marenostrum desde malaga, sohail castle park desde malaga`,
  },
  "mijas-marenostrum-fuengirola": {
    title: `Carpooling Mijas → Marenostrum Fuengirola ${YEAR}: 3€, 10 km`,
    keywords: `carpooling mijas marenostrum fuengirola, viaje compartido mijas fuengirola, marenostrum desde mijas`,
  },
  "marbella-marenostrum-fuengirola": {
    title: `Carpooling Marbella → Marenostrum Fuengirola ${YEAR}: 3€, 25 km`,
    keywords: `carpooling marbella marenostrum fuengirola, viaje compartido marbella fuengirola, marenostrum desde marbella`,
  },
  "granada-marenostrum-fuengirola": {
    title: `Carpooling Granada → Marenostrum Fuengirola ${YEAR}: 5€, 130 km`,
    keywords: `carpooling granada marenostrum fuengirola, viaje compartido granada fuengirola, marenostrum desde granada`,
  },
  "sevilla-marenostrum-fuengirola": {
    title: `Carpooling Sevilla → Marenostrum Fuengirola ${YEAR}: 7€, 220 km`,
    keywords: `carpooling sevilla marenostrum fuengirola, viaje compartido sevilla fuengirola, marenostrum desde sevilla`,
  },
  "madrid-marenostrum-fuengirola": {
    title: `Carpooling Madrid → Marenostrum Fuengirola ${YEAR}: 14€, 555 km`,
    keywords: `carpooling madrid marenostrum fuengirola, viaje compartido madrid fuengirola, marenostrum desde madrid`,
  },
  "algeciras-marenostrum-fuengirola": {
    title: `Carpooling Algeciras → Marenostrum Fuengirola ${YEAR}: 5€, 105 km`,
    keywords: `carpooling algeciras marenostrum fuengirola, viaje compartido algeciras fuengirola, marenostrum desde algeciras`,
  },
  // Tío Pepe Festival Jerez
  "cadiz-tio-pepe-festival": {
    title: `Carpooling Cádiz → Tío Pepe Festival Jerez ${YEAR}: 3€, 35 km`,
    keywords: `carpooling cadiz tio pepe festival, viaje compartido cadiz jerez, tio pepe desde cadiz, bodegas gonzalez byass desde cadiz`,
  },
  "sevilla-tio-pepe-festival": {
    title: `Carpooling Sevilla → Tío Pepe Festival Jerez ${YEAR}: 4€, 95 km`,
    keywords: `carpooling sevilla tio pepe festival, viaje compartido sevilla jerez festival, tio pepe desde sevilla`,
  },
  "huelva-tio-pepe-festival": {
    title: `Carpooling Huelva → Tío Pepe Festival Jerez ${YEAR}: 4€, 110 km`,
    keywords: `carpooling huelva tio pepe festival, viaje compartido huelva jerez, tio pepe desde huelva`,
  },
  "cordoba-tio-pepe-festival": {
    title: `Carpooling Córdoba → Tío Pepe Festival Jerez ${YEAR}: 6€, 195 km`,
    keywords: `carpooling cordoba tio pepe festival, viaje compartido cordoba jerez, tio pepe desde cordoba`,
  },
  "malaga-tio-pepe-festival": {
    title: `Carpooling Málaga → Tío Pepe Festival Jerez ${YEAR}: 7€, 200 km`,
    keywords: `carpooling malaga tio pepe festival, viaje compartido malaga jerez, tio pepe desde malaga`,
  },
  "algeciras-tio-pepe-festival": {
    title: `Carpooling Algeciras → Tío Pepe Festival Jerez ${YEAR}: 5€, 130 km`,
    keywords: `carpooling algeciras tio pepe festival, viaje compartido algeciras jerez, tio pepe desde algeciras`,
  },
  "madrid-tio-pepe-festival": {
    title: `Carpooling Madrid → Tío Pepe Festival Jerez ${YEAR}: 16€, 655 km`,
    keywords: `carpooling madrid tio pepe festival, viaje compartido madrid jerez, tio pepe desde madrid, festival jerez desde madrid`,
  },
  "donostia-mad-cool": {
    title: `Donostia → Mad Cool Madrid ${YEAR} desde 13€ · ConcertRide`,
    description: `Carpooling de Donostia a Mad Cool Festival ${YEAR} (IFEMA Madrid, 465 km, 4h 15 min). 0% comisión, conductores verificados.`,
    keywords: `donostia mad cool carpooling, donostia ifema madrid viaje compartido, san sebastian mad cool transporte, donostia mad cool ${YEAR}, viaje compartido donostia madrid festival`,
  },
  "cordoba-bbk-live": {
    title: `Córdoba → BBK Live Bilbao ${YEAR} desde 9€ · ConcertRide`,
    description: `Carpooling de Córdoba a BBK Live Bilbao ${YEAR} (Kobetamendi, 535 km, 4h 45 min). 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `cordoba bbk live carpooling, cordoba bilbao festival viaje compartido, cordoba bbk live ${YEAR}, carpooling cordoba andalucia festival bilbao`,
  },
  "gijon-bbk-live": {
    title: `Gijón → BBK Live Bilbao ${YEAR} desde 9€ · ConcertRide`,
    description: `Carpooling de Gijón a BBK Live Bilbao ${YEAR} (Kobetamendi, 290 km, 3h). 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `gijon bbk live carpooling, gijon bilbao festival viaje compartido, gijon bbk live ${YEAR}, carpooling asturias festival bilbao, gijon bbk 2026`,
  },
  "leon-resurrection-fest": {
    title: `León → Resurrection Fest Viveiro ${YEAR} desde 11€ · ConcertRide`,
    description: `Carpooling de León a Resurrection Fest Viveiro ${YEAR} (A Gañidoira, 400 km, 4h 15 min). 0% comisión, conductores verificados.`,
    keywords: `leon resurrection fest carpooling, leon viveiro festival viaje compartido, leon resurrection fest ${YEAR}, carpooling castilla leon festival metal`,
  },
  "logrono-sonorama-ribera": {
    title: `Logroño → Sonorama Ribera Aranda ${YEAR} desde 4€ · ConcertRide`,
    description: `Carpooling de Logroño a Sonorama Ribera Aranda de Duero ${YEAR} (120 km, 1h 20 min). 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `logrono sonorama ribera carpooling, logrono aranda de duero festival viaje compartido, logrono sonorama ${YEAR}, carpooling la rioja festival aranda`,
  },
  "avila-mad-cool": {
    title: `Ávila → Mad Cool Madrid ${YEAR} desde 4€ · ConcertRide`,
    description: `Carpooling de Ávila a Mad Cool Festival ${YEAR} (IFEMA Madrid, 110 km, 1h 10 min). 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `avila mad cool carpooling, avila ifema madrid festival viaje compartido, avila mad cool ${YEAR}, carpooling castilla festival madrid`,
  },
  "valladolid-bbk-live": {
    title: `Valladolid → BBK Live Bilbao ${YEAR} desde 8€ · ConcertRide`,
    description: `Carpooling de Valladolid a BBK Live Bilbao ${YEAR} (Kobetamendi, 290 km, 3h). 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`,
    keywords: `valladolid bbk live carpooling, valladolid bilbao festival viaje compartido, valladolid bbk live ${YEAR}, carpooling castilla festival bilbao`,
  },
  "almeria-resurrection-fest": {
    title: `Almería → Resurrection Fest Viveiro ${YEAR} desde 17€ · ConcertRide`,
    description: `Carpooling de Almería a Resurrection Fest Viveiro ${YEAR} (A Gañidoira, 890 km, 8h 30 min). 0% comisión, conductores verificados.`,
    keywords: `almeria resurrection fest carpooling, almeria viveiro festival viaje compartido, almeria resurrection fest ${YEAR}, carpooling andalucia festival metal galicia`,
  },
  "santander-primavera-sound": {
    title: `Santander → Primavera Sound ${YEAR} desde 14€ · ConcertRide`,
    description: `Carpooling de Santander a Primavera Sound Barcelona ${YEAR} (Parc del Fòrum, 600 km, 5h 30 min). 0% comisión, conductores verificados.`,
    keywords: `santander primavera sound carpooling, santander barcelona festival viaje compartido, santander primavera sound ${YEAR}, carpooling cantabria festival barcelona`,
  },
  "burgos-bbk-live": {
    title: `Burgos → BBK Live Bilbao ${YEAR} desde 5€ · ConcertRide`,
    description: `Carpooling de Burgos a BBK Live Bilbao ${YEAR} (Kobetamendi, 160 km, 1h 30 min). 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `burgos bbk live carpooling, burgos bilbao festival viaje compartido, burgos bbk live ${YEAR}, carpooling castilla festival bilbao`,
  },
  "tarragona-mad-cool": {
    title: `Tarragona → Mad Cool Madrid ${YEAR} desde 12€ · ConcertRide`,
    description: `Carpooling de Tarragona a Mad Cool Festival ${YEAR} (IFEMA Madrid, 550 km, 5h 30 min). 0% comisión, conductores verificados.`,
    keywords: `tarragona mad cool carpooling, tarragona madrid festival viaje compartido, tarragona mad cool ${YEAR}, carpooling cataluña festival madrid`,
  },
  // ── Wave 2: 30 new routes for 14 freshly-added festivals ─────────────────
  // ── Atlantic Fest (Vilagarcía de Arousa, Galicia) ───────────────────────
  "vigo-atlantic-fest": {
    title: `Cómo ir a Atlantic Fest desde Vigo ${YEAR}: 35min, 35km, 3€`,
    description: `Cómo ir a Atlantic Fest desde Vigo ${YEAR}: 35 km, 35 min por AP-9, carpooling desde 3€/asiento sin comisión a Recinto Fexdega Vilagarcía. Vuelta nocturna.`,
    keywords: `carpooling vigo atlantic fest, viaje compartido vigo vilagarcia arousa, atlantic fest desde vigo, como ir atlantic fest desde vigo`,
  },
  "santiago-de-compostela-atlantic-fest": {
    title: `Carpooling Santiago → Atlantic Fest ${YEAR}: 40min, 45km, 4€`,
    description: `Carpooling Santiago → Atlantic Fest ${YEAR}: 45 km, 40 min por AP-9, desde 4€/asiento sin comisión a Vilagarcía de Arousa. 0% comisión, conductores verificados.`,
    keywords: `carpooling santiago atlantic fest, viaje compartido santiago vilagarcia, atlantic fest desde santiago, como ir atlantic fest desde santiago`,
  },
  "a-coruna-atlantic-fest": {
    title: `Carpooling A Coruña → Atlantic Fest ${YEAR} [Vilagarcía]: 6€, 1h30`,
    description: `Carpooling A Coruña → Atlantic Fest ${YEAR}: 130 km, 1h 30 min por AP-9, desde 6€/asiento sin comisión a Recinto Fexdega Vilagarcía. Vuelta nocturna coordinada.`,
    keywords: `carpooling a coruña atlantic fest, viaje compartido a coruña vilagarcia arousa, atlantic fest desde a coruña, como ir atlantic fest desde a coruña`,
  },
  // ── PortAmérica (Caldas de Reis, Galicia) ───────────────────────────────
  "pontevedra-portamerica": {
    title: `Cómo ir a PortAmérica desde Pontevedra ${YEAR}: 15min, 15km, 3€`,
    description: `Cómo ir a PortAmérica desde Pontevedra ${YEAR}: 15 km, 15 min por N-550, carpooling desde 3€/asiento sin comisión a Finca Montecelo (Caldas de Reis). Sin.`,
    keywords: `carpooling pontevedra portamerica, viaje compartido pontevedra caldas de reis, portamerica desde pontevedra, como ir portamerica desde pontevedra`,
  },
  "vigo-portamerica": {
    title: `Cómo ir a PortAmérica desde Vigo ${YEAR}: 45min, 50km, 4€`,
    description: `Cómo ir a PortAmérica desde Vigo ${YEAR}: 50 km, 45 min por AP-9, carpooling desde 4€/asiento sin comisión a Finca Montecelo Caldas de Reis. Sin bus al.`,
    keywords: `carpooling vigo portamerica, viaje compartido vigo caldas de reis, portamerica desde vigo, como ir portamerica desde vigo, festival galicia desde vigo`,
  },
  "santiago-de-compostela-portamerica": {
    title: `Carpooling Santiago → PortAmérica ${YEAR}: 35min, 40km, 4€`,
    description: `Carpooling Santiago → PortAmérica ${YEAR}: 40 km, 35 min por AP-9, desde 4€/asiento sin comisión a Finca Montecelo (Caldas de Reis). Vuelta de madrugada.`,
    keywords: `carpooling santiago portamerica, viaje compartido santiago caldas de reis, portamerica desde santiago, como ir portamerica desde santiago`,
  },
  // ── SOS 4.8 (Recinto Ferial La Fica, Murcia) ────────────────────────────
  "cartagena-sos-48": {
    title: `Cómo ir a SOS 4.8 desde Cartagena ${YEAR}: 40min, 50km, 4€`,
    description: `Cómo ir a SOS 4.8 Murcia desde Cartagena ${YEAR}: 50 km, 40 min por A-30, carpooling desde 4€/asiento sin comisión al Recinto Ferial La Fica. Vuelta nocturna.`,
    keywords: `carpooling cartagena sos 48, viaje compartido cartagena la fica murcia, sos 48 desde cartagena, como ir sos 4.8 desde cartagena`,
  },
  "alicante-sos-48": {
    title: `Cómo ir a SOS 4.8 Murcia desde Alicante ${YEAR}: 55min, 80km, 5€`,
    description: `Cómo ir a SOS 4.8 Murcia desde Alicante ${YEAR}: 80 km, 55 min por AP-7, carpooling desde 5€/asiento sin comisión al Recinto Ferial La Fica. Vuelta de.`,
    keywords: `carpooling alicante sos 48, viaje compartido alicante la fica murcia, sos 48 desde alicante, como ir sos 4.8 desde alicante`,
  },
  "valencia-sos-48": {
    title: `Carpooling Valencia → SOS 4.8 Murcia ${YEAR}: 8€, 2h30, 240km`,
    description: `Carpooling Valencia → SOS 4.8 Murcia ${YEAR}: 240 km, 2h 30 min por AP-7, desde 8€/asiento sin comisión al Recinto Ferial La Fica. Más barato que tren.`,
    keywords: `carpooling valencia sos 48, viaje compartido valencia la fica murcia, sos 48 desde valencia, como ir sos 4.8 desde valencia, transporte valencia sos 48 murcia`,
  },
  "madrid-sos-48": {
    title: `Carpooling Madrid → SOS 4.8 Murcia ${YEAR} [La Fica]: 12€, 3h45`,
    description: `Carpooling Madrid → SOS 4.8 Murcia ${YEAR}: 390 km, 3h 45 min por A-3+A-30, desde 12€/asiento sin comisión al Recinto Ferial La Fica. Más económico que AVE+bus.`,
    keywords: `carpooling madrid sos 48, viaje compartido madrid la fica murcia, sos 48 desde madrid, como ir sos 4.8 desde madrid, transporte madrid sos 48 murcia`,
  },
  // ── Reggaeton Beach Festival (Salou, Tarragona) ─────────────────────────
  "tarragona-reggaeton-beach-festival": {
    title: `Cómo ir a Reggaeton Beach Salou desde Tarragona ${YEAR}: 15min, 3€`,
    description: `Cómo ir a Reggaeton Beach Salou desde Tarragona ${YEAR}: 15 km, 15 min por N-340, carpooling desde 3€/asiento sin comisión a la Costa Daurada. Vuelta.`,
    keywords: `carpooling tarragona reggaeton beach, viaje compartido tarragona salou rbf, reggaeton beach desde tarragona, como ir reggaeton beach festival desde tarragona`,
  },
  "barcelona-reggaeton-beach-festival": {
    title: `Carpooling Barcelona → RBF Salou ${YEAR}: 6€, 1h10, 110km`,
    description: `Carpooling Barcelona → Reggaeton Beach Festival Salou ${YEAR}: 110 km, 1h 10 min por AP-7, desde 6€/asiento sin comisión a la Costa Daurada. Más barato que.`,
    keywords: `carpooling barcelona reggaeton beach, viaje compartido barcelona salou rbf, reggaeton beach desde barcelona, como ir reggaeton beach festival desde barcelona`,
  },
  "valencia-reggaeton-beach-festival": {
    title: `Carpooling Valencia → RBF Salou ${YEAR}: 9€, 2h45, 280km`,
    description: `Carpooling Valencia → Reggaeton Beach Festival Salou ${YEAR}: 280 km, 2h 45 min por AP-7, desde 9€/asiento sin comisión a Salou Costa Daurada. Vuelta coordinada.`,
    keywords: `carpooling valencia reggaeton beach, viaje compartido valencia salou rbf, reggaeton beach desde valencia, como ir reggaeton beach festival desde valencia`,
  },
  "madrid-reggaeton-beach-festival": {
    title: `Carpooling Madrid → RBF Salou ${YEAR} [Tarragona]: 16€, 5h15`,
    description: `Carpooling Madrid → Reggaeton Beach Festival Salou ${YEAR}: 550 km, 5h 15 min por A-2+AP-7, desde 16€/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling madrid reggaeton beach, viaje compartido madrid salou rbf, reggaeton beach desde madrid, como ir reggaeton beach festival desde madrid`,
  },
  // ── Mallorca Live Festival (Calvià, Mallorca) ───────────────────────────
  "palma-de-mallorca-mallorca-live-festival": {
    title: `Cómo ir a Mallorca Live desde Palma ${YEAR}: 20min, 15km, 3€`,
    description: `Cómo ir a Mallorca Live Festival desde Palma ${YEAR}: 15 km, 20 min por Ma-1 a Calvià, carpooling desde 3€/asiento sin comisión. Alternativa a lanzadera.`,
    keywords: `carpooling palma mallorca live festival, viaje compartido palma calvia magaluf, mallorca live desde palma, como ir mallorca live festival desde palma`,
  },
  // ── BBK Music Legends (Sondika, Bizkaia) ────────────────────────────────
  "bilbao-bbk-music-legends": {
    title: `Cómo ir a BBK Music Legends desde Bilbao ${YEAR}: 15min, 8km, 3€`,
    description: `Cómo ir a BBK Music Legends desde Bilbao ${YEAR}: 8 km al Recinto Atxura Sondika, 15 min, carpooling desde 3€/asiento sin comisión. Alternativa a lanzadera.`,
    keywords: `carpooling bilbao bbk music legends, viaje compartido bilbao sondika, bbk music legends desde bilbao, como ir bbk music legends desde bilbao centro`,
  },
  "donostia-san-sebastian-bbk-music-legends": {
    title: `Carpooling Donostia → BBK Music Legends ${YEAR}: 5€, 1h, 100km`,
    description: `Carpooling Donostia → BBK Music Legends ${YEAR}: 100 km, 1h por A-8, desde 5€/asiento sin comisión al Recinto Atxura Sondika. 0% comisión, conductores verificados.`,
    keywords: `carpooling donostia bbk music legends, viaje compartido san sebastian sondika, bbk music legends desde donostia`,
  },
  "vitoria-gasteiz-bbk-music-legends": {
    title: `Carpooling Vitoria → BBK Music Legends ${YEAR}: 4€, 45min, 65km`,
    description: `Carpooling Vitoria-Gasteiz → BBK Music Legends ${YEAR}: 65 km, 45 min por AP-68, desde 4€/asiento sin comisión al Recinto Atxura Sondika (Bizkaia). Vuelta.`,
    keywords: `carpooling vitoria bbk music legends, viaje compartido vitoria sondika, bbk music legends desde vitoria gasteiz`,
  },
  "madrid-bbk-music-legends": {
    title: `Carpooling Madrid → BBK Music Legends ${YEAR} [Sondika]: 13€, 4h`,
    description: `Carpooling Madrid → BBK Music Legends ${YEAR}: 395 km, 4h por A-1+AP-68, desde 13€/asiento sin comisión a Sondika (Bilbao). 0% comisión, conductores verificados.`,
    keywords: `carpooling madrid bbk music legends, viaje compartido madrid sondika bilbao, bbk music legends desde madrid, festival rock clasico bilbao madrid`,
  },
  // ── Download Festival Madrid (IFEMA) ────────────────────────────────────
  "madrid-download-madrid": {
    title: `Cómo ir a Download Festival desde Madrid ${YEAR}: 25min, 15km, 5€`,
    description: `Cómo ir a Download Festival Madrid ${YEAR}: 15 km a IFEMA Madrid, 25 min, carpooling desde 5€/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling madrid download festival, viaje compartido madrid ifema download, download festival madrid centro, como ir download festival desde madrid`,
  },
  "valencia-download-madrid": {
    title: `Carpooling Valencia → Download Madrid ${YEAR}: 11€, 3h20, 355km`,
    description: `Carpooling Valencia → Download Festival Madrid ${YEAR}: 355 km, 3h 20 min por A-3 a IFEMA, desde 11€/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling valencia download festival, viaje compartido valencia ifema download madrid, download festival desde valencia`,
  },
  "barcelona-download-madrid": {
    title: `Carpooling Barcelona → Download Madrid ${YEAR}: 16€, 5h30, 620km`,
    description: `Carpooling Barcelona → Download Festival Madrid ${YEAR}: 620 km, 5h 30 min por A-2 a IFEMA, desde 16€/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling barcelona download festival, viaje compartido barcelona ifema download madrid, download festival desde barcelona`,
  },
  // ── Azkena Rock Festival (Vitoria-Gasteiz) ──────────────────────────────
  "bilbao-azkena-rock-festival": {
    title: `Cómo ir a Azkena Rock desde Bilbao ${YEAR}: 50min, 65km, 5€`,
    description: `Cómo ir a Azkena Rock desde Bilbao ${YEAR}: 65 km, 50 min por A-1 a Recinto Mendizabala Vitoria, carpooling desde 5€/asiento sin comisión. Alternativa al.`,
    keywords: `carpooling bilbao azkena rock, viaje compartido bilbao vitoria mendizabala, azkena rock desde bilbao, como ir azkena rock festival desde bilbao`,
  },
  "madrid-azkena-rock-festival": {
    title: `Carpooling Madrid → Azkena Rock ${YEAR} [Vitoria]: 14€, 3h20`,
    description: `Carpooling Madrid → Azkena Rock Festival ${YEAR}: 360 km, 3h 20 min por A-1 al Recinto Mendizabala Vitoria, desde 14€/asiento sin comisión. Más barato que AVE+bus.`,
    keywords: `carpooling madrid azkena rock, viaje compartido madrid vitoria mendizabala, azkena rock desde madrid, como ir azkena rock festival desde madrid`,
  },
  "pamplona-azkena-rock-festival": {
    title: `Cómo ir a Azkena Rock desde Pamplona ${YEAR}: 1h05, 100km, 5€`,
    description: `Cómo ir a Azkena Rock desde Pamplona ${YEAR}: 100 km, 1h 05 min por AP-15+AP-1, carpooling desde 5€/asiento sin comisión a Recinto Mendizabala Vitoria.`,
    keywords: `carpooling pamplona azkena rock, viaje compartido pamplona vitoria mendizabala, azkena rock desde pamplona`,
  },
  // ── Rototom Sunsplash (Benicàssim) ──────────────────────────────────────
  "valencia-rototom-sunsplash": {
    title: `Cómo ir a Rototom desde Valencia ${YEAR}: 40min, 45km, 9€`,
    description: `Cómo ir a Rototom Sunsplash desde Valencia ${YEAR}: 45 km, 40 min por AP-7, carpooling desde 9€/asiento sin comisión a Benicàssim. Más cómodo que Cercanías.`,
    keywords: `carpooling valencia rototom sunsplash, viaje compartido valencia benicassim rototom, rototom desde valencia, como ir rototom desde valencia`,
  },
  // ── Dreambeach Festival (Villaricos, Almería) ───────────────────────────
  "almeria-dreambeach-festival": {
    title: `Cómo ir a Dreambeach desde Almería ${YEAR}: 50min, 60km, 4€`,
    description: `Cómo ir a Dreambeach Festival desde Almería ${YEAR}: 60 km, 50 min por A-7 a Villaricos, carpooling desde 4€/asiento sin comisión. Sin transporte público al.`,
    keywords: `carpooling almeria dreambeach festival, viaje compartido almeria villaricos dreambeach, dreambeach desde almeria, como ir dreambeach festival desde almeria`,
  },
  // ── Aquasella Festival (Arriondas, Asturias) ────────────────────────────
  "oviedo-aquasella-festival": {
    title: `Cómo ir a Aquasella desde Oviedo ${YEAR}: 1h, 70km, 5€`,
    description: `Cómo ir a Aquasella Festival desde Oviedo ${YEAR}: 70 km, 1h por A-64+N-634 al Parque de Arriondas, carpooling desde 5€/asiento sin comisión. Alternativa al.`,
    keywords: `carpooling oviedo aquasella festival, viaje compartido oviedo arriondas aquasella, aquasella desde oviedo, como ir aquasella festival desde oviedo`,
  },
  // ── DCode Festival Madrid (Ciudad Universitaria) ────────────────────────
  "madrid-dcode-festival": {
    title: `Cómo ir a DCode desde Madrid ${YEAR}: 25min, 15km, 5€`,
    description: `Cómo ir a DCode Festival Madrid ${YEAR}: 15 km al Estadio Complutense, 25 min, carpooling desde 5€/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling madrid dcode festival, viaje compartido madrid complutense dcode, dcode desde madrid centro, como ir dcode festival desde madrid`,
  },
  // ── Creamfields Andalucía (Jerez de la Frontera) ────────────────────────
  "sevilla-creamfields-andalucia": {
    title: `Carpooling Sevilla → Creamfields Jerez ${YEAR}: 5€, 1h, 95km`,
    description: `Carpooling Sevilla → Creamfields Andalucía ${YEAR}: 95 km, 1h por A-4 al Recinto González Hontoria Jerez, desde 5€/asiento sin comisión. Más barato que.`,
    keywords: `carpooling sevilla creamfields andalucia, viaje compartido sevilla jerez creamfields, creamfields desde sevilla, como ir creamfields festival desde sevilla`,
  },


  // ── Wave 36 routes: rutas por ciudad para los 10 nuevos festivales ──────
  // Jaén Pop routes
  "madrid-festival-de-musica-de-jaen-pop": {
    title: `Carpooling Madrid → Festival Jaén Pop ${YEAR} · ConcertRide`,
    description: `Madrid → Festival de Música de Jaén Pop ${YEAR}: carpooling sin comisión desde 9€/asiento. 385 km por A-4, 3h30. 0% comisión. Pago Bizum.`,
    keywords: `carpooling madrid festival jaen pop, viaje compartido madrid jaen concierto, como llegar festival jaen desde madrid, transporte madrid jaen festival ${YEAR}`,
  },
  "granada-festival-de-musica-de-jaen-pop": {
    title: `Carpooling Granada → Festival Jaén Pop ${YEAR} · ConcertRide`,
    description: `Granada → Festival de Música de Jaén Pop ${YEAR}: carpooling sin comisión desde 5€/asiento. 95 km por A-316, 1h. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling granada festival jaen pop, viaje compartido granada jaen festival, como ir festival jaen pop desde granada, transporte granada jaen ${YEAR}`,
  },
  "cordoba-festival-de-musica-de-jaen-pop": {
    title: `Carpooling Córdoba → Festival Jaén Pop ${YEAR} · ConcertRide`,
    description: `Córdoba → Festival de Música de Jaén Pop ${YEAR}: carpooling sin comisión desde 4€/asiento. 105 km por A-45, 1h10. 0% comisión. Pago Bizum.`,
    keywords: `carpooling cordoba festival jaen pop, viaje compartido cordoba jaen festival, como llegar festival jaen pop desde cordoba, transporte cordoba jaen ${YEAR}`,
  },

  // Córdoba Rocks routes
  "madrid-festival-de-musica-de-cordoba-rocks": {
    title: `Carpooling Madrid → Córdoba Rocks ${YEAR} [Desde 9€] | ConcertRide`,
    description: `Madrid → Festival Córdoba Rocks ${YEAR}: carpooling sin comisión desde 9€/asiento. 400 km por A-4, 3h30. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling madrid cordoba rocks, viaje compartido madrid cordoba festival, como llegar cordoba rocks desde madrid, transporte madrid cordoba festival ${YEAR}`,
  },
  "sevilla-festival-de-musica-de-cordoba-rocks": {
    title: `Carpooling Sevilla → Córdoba Rocks ${YEAR} [Desde 4€] | ConcertRide`,
    description: `Sevilla → Festival Córdoba Rocks ${YEAR}: carpooling sin comisión desde 4€/asiento. 140 km por A-4, 1h30. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling sevilla cordoba rocks, viaje compartido sevilla cordoba festival, como ir cordoba rocks desde sevilla, transporte sevilla cordoba ${YEAR}`,
  },
  "malaga-festival-de-musica-de-cordoba-rocks": {
    title: `Carpooling Málaga → Córdoba Rocks ${YEAR} [Desde 5€] | ConcertRide`,
    description: `Málaga → Festival Córdoba Rocks ${YEAR}: carpooling sin comisión desde 5€/asiento. 170 km por A-45, 1h45. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling malaga cordoba rocks, viaje compartido malaga cordoba festival, como llegar cordoba rocks desde malaga, transporte malaga cordoba ${YEAR}`,
  },

  // Huelva Pop routes
  "madrid-festival-de-musica-de-huelva-pop": {
    title: `Carpooling Madrid → Festival Huelva Pop ${YEAR} · ConcertRide`,
    description: `Madrid → Festival de Música de Huelva Pop ${YEAR}: carpooling sin comisión desde 11€/asiento. 640 km por A-4+A-49, 5h30. 0% comisión. Pago Bizum.`,
    keywords: `carpooling madrid festival huelva pop, viaje compartido madrid huelva concierto, como llegar festival huelva desde madrid, transporte madrid huelva festival ${YEAR}`,
  },
  "sevilla-festival-de-musica-de-huelva-pop": {
    title: `Carpooling Sevilla → Festival Huelva Pop ${YEAR} · ConcertRide`,
    description: `Sevilla → Festival de Música de Huelva Pop ${YEAR}: carpooling sin comisión desde 4€/asiento. 94 km por A-49, 1h. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling sevilla festival huelva pop, viaje compartido sevilla huelva festival, como ir festival huelva pop desde sevilla, transporte sevilla huelva ${YEAR}`,
  },
  "cadiz-festival-de-musica-de-huelva-pop": {
    title: `Carpooling Cádiz → Festival Huelva Pop ${YEAR} · ConcertRide`,
    description: `Cádiz → Festival de Música de Huelva Pop ${YEAR}: carpooling sin comisión desde 5€/asiento. 200 km por A-48+A-49, 2h. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling cadiz festival huelva pop, viaje compartido cadiz huelva festival, como llegar festival huelva pop desde cadiz, transporte cadiz huelva ${YEAR}`,
  },

  // Badajoz routes
  "madrid-festival-de-musica-de-badajoz": {
    title: `Carpooling Madrid → Festival Badajoz ${YEAR} · ConcertRide`,
    description: `Madrid → Festival de Música de Badajoz ${YEAR}: carpooling sin comisión desde 8€/asiento. 400 km por A-5, 3h30. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling madrid festival badajoz, viaje compartido madrid badajoz concierto, como llegar festival badajoz desde madrid, transporte madrid badajoz festival ${YEAR}`,
  },
  "sevilla-festival-de-musica-de-badajoz": {
    title: `Carpooling Sevilla → Festival Badajoz ${YEAR} · ConcertRide`,
    description: `Sevilla → Festival de Música de Badajoz ${YEAR}: carpooling sin comisión desde 5€/asiento. 220 km por A-66, 2h. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling sevilla festival badajoz, viaje compartido sevilla badajoz festival, como ir festival badajoz desde sevilla, transporte sevilla badajoz ${YEAR}`,
  },
  "caceres-festival-de-musica-de-badajoz": {
    title: `Carpooling Cáceres → Festival Badajoz ${YEAR} · ConcertRide`,
    description: `Cáceres → Festival de Música de Badajoz ${YEAR}: carpooling sin comisión desde 4€/asiento. 90 km por A-66, 1h. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling caceres festival badajoz, viaje compartido caceres badajoz festival, como llegar festival badajoz desde caceres, transporte caceres badajoz ${YEAR}`,
  },

  // Mérida routes
  "madrid-festival-de-musica-de-merida": {
    title: `Carpooling Madrid → Festival Mérida ${YEAR} [Desde 7€] | ConcertRide`,
    description: `Madrid → Festival de Música de Mérida ${YEAR}: carpooling sin comisión desde 7€/asiento. 350 km por A-5, 3h. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling madrid festival merida, viaje compartido madrid merida concierto, como llegar festival merida desde madrid, transporte madrid merida festival ${YEAR}`,
  },
  "sevilla-festival-de-musica-de-merida": {
    title: `Carpooling Sevilla → Festival Mérida ${YEAR} · ConcertRide`,
    description: `Sevilla → Festival de Música de Mérida ${YEAR}: carpooling sin comisión desde 5€/asiento. 190 km por A-66, 1h45. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling sevilla festival merida, viaje compartido sevilla merida festival, como ir festival merida desde sevilla, transporte sevilla merida ${YEAR}`,
  },
  "badajoz-festival-de-musica-de-merida": {
    title: `Carpooling Badajoz → Festival Mérida ${YEAR} · ConcertRide`,
    description: `Badajoz → Festival de Música de Mérida ${YEAR}: carpooling sin comisión desde 3€/asiento. 62 km por A-5, 40 min. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling badajoz festival merida, viaje compartido badajoz merida festival, como llegar festival merida desde badajoz, transporte badajoz merida ${YEAR}`,
  },

  // Plasencia routes
  "madrid-festival-de-musica-de-plasencia": {
    title: `Carpooling Madrid → Festival Plasencia ${YEAR} · ConcertRide`,
    description: `Madrid → Festival de Música de Plasencia ${YEAR}: carpooling sin comisión desde 7€/asiento. 300 km por A-5, 2h30. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling madrid festival plasencia, viaje compartido madrid plasencia concierto, como llegar festival plasencia desde madrid, transporte madrid plasencia festival ${YEAR}`,
  },
  "salamanca-festival-de-musica-de-plasencia": {
    title: `Carpooling Salamanca → Festival Plasencia ${YEAR} · ConcertRide`,
    description: `Salamanca → Festival de Música de Plasencia ${YEAR}: carpooling sin comisión desde 4€/asiento. 140 km por A-66, 1h20. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling salamanca festival plasencia, viaje compartido salamanca plasencia festival, como ir festival plasencia desde salamanca, transporte salamanca plasencia ${YEAR}`,
  },
  "caceres-festival-de-musica-de-plasencia": {
    title: `Carpooling Cáceres → Festival Plasencia ${YEAR} · ConcertRide`,
    description: `Cáceres → Festival de Música de Plasencia ${YEAR}: carpooling sin comisión desde 3€/asiento. 84 km por A-66, 55 min. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling caceres festival plasencia, viaje compartido caceres plasencia festival, como llegar festival plasencia desde caceres, transporte caceres plasencia ${YEAR}`,
  },

  // Gijón routes
  "madrid-festival-de-musica-de-gijon": {
    title: `Carpooling Madrid → Festival Gijón ${YEAR} [Desde 9€] | ConcertRide`,
    description: `Madrid → Festival de Música de Gijón ${YEAR}: carpooling sin comisión desde 9€/asiento. 450 km por A-1+AP-66, 4h. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling madrid festival gijon, viaje compartido madrid gijon concierto, como llegar festival gijon desde madrid, transporte madrid gijon festival ${YEAR}`,
  },
  "oviedo-festival-de-musica-de-gijon": {
    title: `Carpooling Oviedo → Festival Gijón ${YEAR} [Desde 3€] | ConcertRide`,
    description: `Oviedo → Festival de Música de Gijón ${YEAR}: carpooling sin comisión desde 3€/asiento. 30 km por A-66, 25 min. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling oviedo festival gijon, viaje compartido oviedo gijon festival, como ir festival gijon desde oviedo, transporte oviedo gijon ${YEAR}`,
  },
  "santander-festival-de-musica-de-gijon": {
    title: `Carpooling Santander → Festival Gijón ${YEAR} · ConcertRide`,
    description: `Santander → Festival de Música de Gijón ${YEAR}: carpooling sin comisión desde 5€/asiento. 185 km por A-8, 1h50. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling santander festival gijon, viaje compartido santander gijon festival, como llegar festival gijon desde santander, transporte santander gijon ${YEAR}`,
  },

  // Oviedo routes
  "madrid-festival-de-musica-de-oviedo": {
    title: `Carpooling Madrid → Festival Oviedo ${YEAR} [Desde 9€] | ConcertRide`,
    description: `Madrid → Festival de Música de Oviedo ${YEAR}: carpooling sin comisión desde 9€/asiento. 440 km por A-1+AP-66, 4h. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling madrid festival oviedo, viaje compartido madrid oviedo concierto, como llegar festival oviedo desde madrid, transporte madrid oviedo festival ${YEAR}`,
  },
  "bilbao-festival-de-musica-de-oviedo": {
    title: `Carpooling Bilbao → Festival Oviedo ${YEAR} [Desde 6€] | ConcertRide`,
    description: `Bilbao → Festival de Música de Oviedo ${YEAR}: carpooling sin comisión desde 6€/asiento. 300 km por A-8, 2h45. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling bilbao festival oviedo, viaje compartido bilbao oviedo festival, como ir festival oviedo desde bilbao, transporte bilbao oviedo ${YEAR}`,
  },
  "gijon-festival-de-musica-de-oviedo": {
    title: `Carpooling Gijón → Festival Oviedo ${YEAR} [Desde 3€] | ConcertRide`,
    description: `Gijón → Festival de Música de Oviedo ${YEAR}: carpooling sin comisión desde 3€/asiento. 30 km por A-66, 25 min. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling gijon festival oviedo, viaje compartido gijon oviedo festival, como llegar festival oviedo desde gijon, transporte gijon oviedo ${YEAR}`,
  },

  // Santander Jazz routes
  "madrid-festival-de-santander-jazz": {
    title: `Carpooling Madrid → Jazz Santander ${YEAR} [Desde 9€] | ConcertRide`,
    description: `Madrid → Festival de Jazz de Santander ${YEAR}: carpooling sin comisión desde 9€/asiento. 395 km por A-1, 3h30. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling madrid festival santander jazz, viaje compartido madrid santander jazz, como llegar festival jazz santander desde madrid, transporte madrid santander ${YEAR}`,
  },
  "bilbao-festival-de-santander-jazz": {
    title: `Carpooling Bilbao → Jazz Santander ${YEAR} [Desde 4€] | ConcertRide`,
    description: `Bilbao → Festival de Jazz de Santander ${YEAR}: carpooling sin comisión desde 4€/asiento. 110 km por A-8, 1h10. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling bilbao festival santander jazz, viaje compartido bilbao santander jazz, como ir jazz santander desde bilbao, transporte bilbao santander ${YEAR}`,
  },
  "burgos-festival-de-santander-jazz": {
    title: `Carpooling Burgos → Jazz Santander ${YEAR} [Desde 4€] | ConcertRide`,
    description: `Burgos → Festival de Jazz de Santander ${YEAR}: carpooling sin comisión desde 4€/asiento. 155 km por A-1, 1h30. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling burgos festival santander jazz, viaje compartido burgos santander jazz, como llegar jazz santander desde burgos, transporte burgos santander ${YEAR}`,
  },

  // Folk Vitoria-Gasteiz routes
  "madrid-festival-de-folk-de-vitoria": {
    title: `Carpooling Madrid → Folk Vitoria ${YEAR} [Desde 9€] | ConcertRide`,
    description: `Madrid → Festival de Folk de Vitoria-Gasteiz ${YEAR}: carpooling sin comisión desde 9€/asiento. 365 km por A-1, 3h15. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling madrid festival folk vitoria, viaje compartido madrid vitoria folk, como llegar festival folk vitoria desde madrid, transporte madrid vitoria-gasteiz ${YEAR}`,
  },
  "bilbao-festival-de-folk-de-vitoria": {
    title: `Carpooling Bilbao → Folk Vitoria ${YEAR} [Desde 3€] | ConcertRide`,
    description: `Bilbao → Festival de Folk de Vitoria-Gasteiz ${YEAR}: carpooling sin comisión desde 3€/asiento. 65 km por A-68, 45 min. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling bilbao festival folk vitoria, viaje compartido bilbao vitoria gasteiz folk, como ir festival folk vitoria desde bilbao, transporte bilbao vitoria ${YEAR}`,
  },
  "pamplona-festival-de-folk-de-vitoria": {
    title: `Carpooling Pamplona → Folk Vitoria ${YEAR} [Desde 4€] | ConcertRide`,
    description: `Pamplona → Festival de Folk de Vitoria-Gasteiz ${YEAR}: carpooling sin comisión desde 4€/asiento. 90 km por A-12+AP-1, 55 min. 0% comisión. Pago Bizum directo.`,
    keywords: `carpooling pamplona festival folk vitoria, viaje compartido pamplona vitoria folk, como llegar festival folk vitoria desde pamplona, transporte pamplona vitoria-gasteiz ${YEAR}`,
  },
  // ── Wave 37: Catalunya interior + costes (10 festivals × 3 routes = 30 routes) ─
  "madrid-sonar-plus": {
    title: `Coche Madrid→Sónar+ ${YEAR} [Desde 10€] — ConcertRide`,
    description: `Madrid → Sónar+ Barcelona: 620 km por AP-2, 5 h 30 min, desde 10 €/asiento sin comisión. La vanguardia electrónica y digital del Sónar al alcance desde Madrid.`,
    keywords: `carpooling madrid sonar plus, viaje compartido madrid sonar barcelona`,
  },
  "valencia-sonar-plus": {
    title: `Viaje Valencia→Sónar+ ${YEAR} [Desde 6€] — ConcertRide`,
    description: `Valencia → Sónar+ Barcelona: 360 km por AP-7, 3 h 30 min, desde 6 €/asiento sin comisión. El festival de electrónica más innovador de Europa desde Valencia.`,
    keywords: `carpooling valencia sonar plus, viaje compartido valencia sonar barcelona`,
  },
  "zaragoza-sonar-plus": {
    title: `Carpooling Zaragoza→Sónar+ ${YEAR} [Desde 5€] — ConcertRide`,
    description: `Zaragoza → Sónar+ Barcelona: 300 km por AP-2, 2 h 45 min, desde 5 €/asiento sin comisión. Aragón al festival de electrónica más esperado del verano.`,
    keywords: `carpooling zaragoza sonar plus, viaje compartido zaragoza sonar barcelona`,
  },
  "madrid-festival-de-musica-de-tarragona": {
    title: `Viaje Madrid→Festival Tarragona ${YEAR} [Desde 9€] — ConcertRide`,
    description: `Madrid → Festival de Música de Tarragona: 555 km por AP-2, 5 h, desde 9 €/asiento sin comisión. Pop y rock junto al Anfiteatro Romano de Tarragona.`,
    keywords: `carpooling madrid festival tarragona, viaje compartido madrid tarragona festival`,
  },
  "barcelona-festival-de-musica-de-tarragona": {
    title: `Coche Barcelona→Festival Tarragona ${YEAR} [Desde 4€] — ConcertRide`,
    description: `Barcelona → Festival Tarragona: 100 km por AP-7, 1 h, desde 4 €/asiento sin comisión. El festival más cercano a Barcelona con escenario romano único.`,
    keywords: `carpooling barcelona festival tarragona, viaje compartido barcelona tarragona festival`,
  },
  "zaragoza-festival-de-musica-de-tarragona": {
    title: `Viaje Zaragoza→Festival Tarragona ${YEAR} [Desde 5€] — ConcertRide`,
    description: `Zaragoza → Festival Tarragona: 250 km por A-2+AP-7, 2 h 20 min, desde 5 €/asiento sin comisión. Aragón al festival mediterráneo de Tarragona.`,
    keywords: `carpooling zaragoza festival tarragona, viaje compartido zaragoza tarragona festival`,
  },
  "madrid-festival-de-musica-de-lleida": {
    title: `Coche Madrid→Festival Lleida ${YEAR} [Desde 8€] — ConcertRide`,
    description: `Madrid → Festival de Música de Lleida: 470 km por A-2+AP-2, 4 h 15 min, desde 8 €/asiento sin comisión. El festival de la capital de Poniente catalán.`,
    keywords: `carpooling madrid festival lleida, viaje compartido madrid lleida festival musica`,
  },
  "barcelona-festival-de-musica-de-lleida": {
    title: `Viaje Barcelona→Festival Lleida ${YEAR} [Desde 4€] — ConcertRide`,
    description: `Barcelona → Festival Lleida: 170 km por A-2, 1 h 30 min, desde 4 €/asiento sin comisión. El festival más auténtico del interior catalán desde Barcelona.`,
    keywords: `carpooling barcelona festival lleida, viaje compartido barcelona lleida festival`,
  },
  "zaragoza-festival-de-musica-de-lleida": {
    title: `Carpooling Zaragoza→Festival Lleida ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Zaragoza → Festival Lleida: 150 km por A-2, 1 h 30 min, desde 3 €/asiento sin comisión. Vecinos de Aragón y Cataluña comparten ruta al festival de Lleida.`,
    keywords: `carpooling zaragoza festival lleida, viaje compartido zaragoza lleida festival`,
  },
  "madrid-festival-de-musica-de-girona": {
    title: `Viaje Madrid→Festival Girona ${YEAR} [Desde 10€] — ConcertRide`,
    description: `Madrid → Festival de Música de Girona: 740 km por AP-2+AP-7, 6 h 30 min, desde 10 €/asiento sin comisión. El festival de la ciudad medieval del río Onyar.`,
    keywords: `carpooling madrid festival girona, viaje compartido madrid girona festival`,
  },
  "barcelona-festival-de-musica-de-girona": {
    title: `Coche Barcelona→Festival Girona ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Barcelona → Festival Girona: 100 km por AP-7, 1 h, desde 3 €/asiento sin comisión. El festival más fácil de alcanzar desde Barcelona.`,
    keywords: `carpooling barcelona festival girona, viaje compartido barcelona girona festival`,
  },
  "valencia-festival-de-musica-de-girona": {
    title: `Viaje Valencia→Festival Girona ${YEAR} [Desde 8€] — ConcertRide`,
    description: `Valencia → Festival Girona: 500 km por AP-7, 4 h 30 min, desde 8 €/asiento sin comisión. Levante al festival de la ciudad medieval de Cataluña.`,
    keywords: `carpooling valencia festival girona, viaje compartido valencia girona festival`,
  },
  "madrid-festival-de-musica-de-manresa": {
    title: `Coche Madrid→Festival Manresa ${YEAR} [Desde 8€] — ConcertRide`,
    description: `Madrid → Festival de Música de Manresa: 520 km por AP-2, 4 h 40 min, desde 8 €/asiento sin comisión. El festival del corazón del Bages, junto al río Cardener.`,
    keywords: `carpooling madrid festival manresa, viaje compartido madrid manresa festival`,
  },
  "barcelona-festival-de-musica-de-manresa": {
    title: `Viaje Barcelona→Festival Manresa ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Barcelona → Festival Manresa: 70 km por C-16, 1 h, desde 3 €/asiento sin comisión. El festival del Bages a solo 1 hora de la Sagrada Familia.`,
    keywords: `carpooling barcelona festival manresa, viaje compartido barcelona manresa festival`,
  },
  "zaragoza-festival-de-musica-de-manresa": {
    title: `Carpooling Zaragoza→Festival Manresa ${YEAR}: — ConcertRide`,
    description: `Zaragoza → Festival Manresa: 250 km por A-2+C-16, 2 h 30 min, desde 5 €/asiento sin comisión. Festival de interior catalán desde Aragón.`,
    keywords: `carpooling zaragoza festival manresa, viaje compartido zaragoza manresa festival`,
  },
  "madrid-festival-de-musica-de-reus": {
    title: `Viaje Madrid→Festival Reus ${YEAR} [Desde 9€] — ConcertRide`,
    description: `Madrid → Festival de Música de Reus: 560 km por AP-2+AP-7, 5 h, desde 9 €/asiento sin comisión. El festival de la ciudad del vermut catalán.`,
    keywords: `carpooling madrid festival reus, viaje compartido madrid reus festival`,
  },
  "barcelona-festival-de-musica-de-reus": {
    title: `Coche Barcelona→Festival Reus ${YEAR} [Desde 4€] — ConcertRide`,
    description: `Barcelona → Festival Reus: 110 km por AP-7, 1 h 10 min, desde 4 €/asiento sin comisión. El festival de la capital del Camp de Tarragona.`,
    keywords: `carpooling barcelona festival reus, viaje compartido barcelona reus festival`,
  },
  "valencia-festival-de-musica-de-reus": {
    title: `Viaje Valencia→Festival Reus ${YEAR} [Desde 6€] — ConcertRide`,
    description: `Valencia → Festival Reus: 260 km por AP-7, 2 h 30 min, desde 6 €/asiento sin comisión. El festival mediterráneo más próximo desde Levante.`,
    keywords: `carpooling valencia festival reus, viaje compartido valencia reus tarragona festival`,
  },
  "madrid-festival-de-musica-de-vic": {
    title: `Coche Madrid→Festival Vic ${YEAR} [Desde 9€] — ConcertRide`,
    description: `Madrid → Festival de Música de Vic: 590 km por AP-2+C-17, 5 h 15 min, desde 9 €/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling madrid festival vic, viaje compartido madrid vic osona festival`,
  },
  "barcelona-festival-de-musica-de-vic": {
    title: `Viaje Barcelona→Festival Vic ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Barcelona → Festival Vic: 65 km por C-17, 55 min, desde 3 €/asiento sin comisión. El festival del prepirineo catalán más cercano a Barcelona.`,
    keywords: `carpooling barcelona festival vic, viaje compartido barcelona vic osona festival`,
  },
  "girona-festival-de-musica-de-vic": {
    title: `Carpooling Girona→Festival Vic ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Girona → Festival Vic: 60 km por C-25, 50 min, desde 3 €/asiento sin comisión. El festival de Osona a un paso de las Comarcas Gironines.`,
    keywords: `carpooling girona festival vic, viaje compartido girona vic festival`,
  },
  "madrid-festival-de-musica-de-figueres": {
    title: `Viaje Madrid→Festival Figueres ${YEAR} [Desde 11€] — ConcertRide`,
    description: `Madrid → Festival de Música de Figueres: 780 km por AP-2+AP-7, 6 h 45 min, desde 11 €/asiento sin comisión. El festival de la ciudad de Dalí y el Empordà.`,
    keywords: `carpooling madrid festival figueres, viaje compartido madrid figueres festival`,
  },
  "barcelona-festival-de-musica-de-figueres": {
    title: `Coche Barcelona→Festival Figueres ${YEAR} [Desde 4€] — ConcertRide`,
    description: `Barcelona → Festival Figueres: 140 km por AP-7, 1 h 20 min, desde 4 €/asiento sin comisión. El festival de la ciudad de Dalí desde la costa.`,
    keywords: `carpooling barcelona festival figueres, viaje compartido barcelona figueres festival`,
  },
  "girona-festival-de-musica-de-figueres": {
    title: `Viaje Girona→Festival Figueres ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Girona → Festival Figueres: 40 km por AP-7, 35 min, desde 3 €/asiento sin comisión. El vecino del Empordà a menos de media hora de la capital provincial.`,
    keywords: `carpooling girona festival figueres, viaje compartido girona figueres festival`,
  },
  "madrid-festival-de-musica-de-mataro": {
    title: `Coche Madrid→Festival Mataró ${YEAR} [Desde 10€] — ConcertRide`,
    description: `Madrid → Festival de Música de Mataró: 650 km por AP-2+AP-7, 5 h 45 min, desde 10 €/asiento sin comisión. El festival del Maresme, con el Mediterráneo al fondo.`,
    keywords: `carpooling madrid festival mataro, viaje compartido madrid mataro maresme festival`,
  },
  "barcelona-festival-de-musica-de-mataro": {
    title: `Viaje Barcelona→Festival Mataró ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Barcelona → Festival Mataró: 30 km por C-32, 30 min, desde 3 €/asiento sin comisión. El festival de playa más cercano a Barcelona.`,
    keywords: `carpooling barcelona festival mataro, viaje compartido barcelona mataro festival`,
  },
  "valencia-festival-de-musica-de-mataro": {
    title: `Carpooling Valencia→Festival Mataró ${YEAR} [Desde 7€] — ConcertRide`,
    description: `Valencia → Festival Mataró: 400 km por AP-7, 3 h 40 min, desde 7 €/asiento sin comisión. Levante al festival mediterráneo del Maresme.`,
    keywords: `carpooling valencia festival mataro, viaje compartido valencia mataro festival`,
  },
  "madrid-festival-de-musica-de-sabadell": {
    title: `Viaje Madrid→Festival Sabadell ${YEAR} [Desde 9€] — ConcertRide`,
    description: `Madrid → Festival de Música de Sabadell: 600 km por AP-2, 5 h 20 min, desde 9 €/asiento sin comisión. El festival de la capital del Vallès Occidental.`,
    keywords: `carpooling madrid festival sabadell, viaje compartido madrid sabadell festival`,
  },
  "barcelona-festival-de-musica-de-sabadell": {
    title: `Coche Barcelona→Festival Sabadell ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Barcelona → Festival Sabadell: 25 km por C-58, 30 min, desde 3 €/asiento sin comisión. El festival del Vallès Occidental a un paso de Barcelona.`,
    keywords: `carpooling barcelona festival sabadell, viaje compartido barcelona sabadell festival`,
  },
  "zaragoza-festival-de-musica-de-sabadell": {
    title: `Viaje Zaragoza→Festival Sabadell ${YEAR} [Desde 5€] — ConcertRide`,
    description: `Zaragoza → Festival Sabadell: 310 km por A-2, 2 h 50 min, desde 5 €/asiento sin comisión. El festival del Vallès Occidental desde Aragón.`,
    keywords: `carpooling zaragoza festival sabadell, viaje compartido zaragoza sabadell festival`,
  },

  // ── Wave 38: Levante–Murcia + Madrid metro (10 festivals × 3 routes = 30 routes) ─
  "madrid-festival-de-musica-de-alicante": {
    title: `Viaje Madrid→Festival Alicante ${YEAR} [Desde 7€] — ConcertRide`,
    description: `Madrid → Festival de Música de Alicante: 420 km por A-31, 3 h 40 min, desde 7 €/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling madrid festival alicante, viaje compartido madrid alicante festival`,
  },
  "barcelona-festival-de-musica-de-alicante": {
    title: `Coche Barcelona→Festival Alicante ${YEAR} [Desde 9€] — ConcertRide`,
    description: `Barcelona → Festival Alicante: 530 km por AP-7, 4 h 40 min, desde 9 €/asiento sin comisión. El festival mediterráneo de Alicante desde la Ciudad Condal.`,
    keywords: `carpooling barcelona festival alicante, viaje compartido barcelona alicante festival`,
  },
  "murcia-festival-de-musica-de-alicante": {
    title: `Carpooling Murcia→Festival Alicante ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Murcia → Festival Alicante: 80 km por A-7, 50 min, desde 3 €/asiento sin comisión. El festival de la Costa Blanca a un paso de la Región de Murcia.`,
    keywords: `carpooling murcia festival alicante, viaje compartido murcia alicante festival`,
  },
  "madrid-festival-de-musica-de-elche": {
    title: `Viaje Madrid→Festival Elche ${YEAR} [Desde 7€] — ConcertRide`,
    description: `Madrid → Festival de Música de Elche: 410 km por A-31, 3 h 40 min, desde 7 €/asiento sin comisión. El festival de la ciudad palmeral UNESCO.`,
    keywords: `carpooling madrid festival elche, viaje compartido madrid elche festival, palmeral elche`,
  },
  "alicante-festival-de-musica-de-elche": {
    title: `Coche Alicante→Festival Elche ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Alicante → Festival Elche: 25 km por AP-7, 20 min, desde 3 €/asiento sin comisión. El festival de la ciudad palmeral patrimonio de la Humanidad.`,
    keywords: `carpooling alicante festival elche, viaje compartido alicante elche festival`,
  },
  "murcia-festival-de-musica-de-elche": {
    title: `Viaje Murcia→Festival Elche ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Murcia → Festival Elche: 70 km por A-7, 50 min, desde 3 €/asiento sin comisión. El festival de la ciudad palmeral desde la Región de Murcia.`,
    keywords: `carpooling murcia festival elche, viaje compartido murcia elche festival`,
  },
  "madrid-festival-de-musica-de-murcia-pop": {
    title: `Coche Madrid→Murcia Pop ${YEAR} [Desde 7€] — ConcertRide`,
    description: `Madrid → Festival Pop de Murcia: 400 km por A-30, 3 h 30 min, desde 7 €/asiento sin comisión. El pop más actual en la ciudad de la huerta murciana.`,
    keywords: `carpooling madrid murcia pop, viaje compartido madrid murcia festival pop`,
  },
  "alicante-festival-de-musica-de-murcia-pop": {
    title: `Viaje Alicante→Murcia Pop ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Alicante → Murcia Pop: 85 km por A-7, 55 min, desde 3 €/asiento sin comisión. El festival pop de Murcia a menos de 1 hora desde la Costa Blanca.`,
    keywords: `carpooling alicante murcia pop, viaje compartido alicante murcia festival pop`,
  },
  "valencia-festival-de-musica-de-murcia-pop": {
    title: `Coche Valencia→Murcia Pop ${YEAR} [Desde 5€] — ConcertRide`,
    description: `Valencia → Murcia Pop: 250 km por A-7, 2 h 20 min, desde 5 €/asiento sin comisión. El festival pop más destacado del Sureste desde Valencia.`,
    keywords: `carpooling valencia murcia pop, viaje compartido valencia murcia festival pop`,
  },
  "madrid-festival-de-musica-de-cartagena": {
    title: `Viaje Madrid→Festival Cartagena ${YEAR} [Desde 8€] — ConcertRide`,
    description: `Madrid → Festival de Música de Cartagena: 450 km por A-30, 4 h, desde 8 €/asiento sin comisión. El festival de la ciudad del Mar Menor y el teatro romano.`,
    keywords: `carpooling madrid festival cartagena, viaje compartido madrid cartagena murcia festival`,
  },
  "alicante-festival-de-musica-de-cartagena": {
    title: `Coche Alicante→Festival Cartagena ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Alicante → Festival Cartagena: 90 km por A-7, 1 h, desde 3 €/asiento sin comisión. El festival de la ciudad portuaria levantina.`,
    keywords: `carpooling alicante festival cartagena, viaje compartido alicante cartagena festival`,
  },
  "murcia-festival-de-musica-de-cartagena": {
    title: `Viaje Murcia→Festival Cartagena ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Murcia → Festival Cartagena: 55 km por A-30, 45 min, desde 3 €/asiento sin comisión. El festival de la ciudad portuaria a un paso de la capital regional.`,
    keywords: `carpooling murcia festival cartagena, viaje compartido murcia cartagena festival`,
  },
  "madrid-festival-de-musica-de-lorca": {
    title: `Coche Madrid→Festival Lorca ${YEAR} [Desde 8€] — ConcertRide`,
    description: `Madrid → Festival de Música de Lorca: 430 km por A-30, 3 h 50 min, desde 8 €/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling madrid festival lorca, viaje compartido madrid lorca murcia festival`,
  },
  "murcia-festival-de-musica-de-lorca": {
    title: `Viaje Murcia→Festival Lorca ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Murcia → Festival Lorca: 65 km por A-7, 50 min, desde 3 €/asiento sin comisión. El festival de la Lorca artesanal a un paso de la capital murciana.`,
    keywords: `carpooling murcia festival lorca, viaje compartido murcia lorca festival`,
  },
  "granada-festival-de-musica-de-lorca": {
    title: `Carpooling Granada→Festival Lorca ${YEAR} [Desde 4€] — ConcertRide`,
    description: `Granada → Festival Lorca: 130 km por A-92, 1 h 20 min, desde 4 €/asiento sin comisión. El festival del Sureste desde la capital de la Alhambra.`,
    keywords: `carpooling granada festival lorca, viaje compartido granada lorca festival`,
  },
  "madrid-festival-de-jazz-de-toledo": {
    title: `Viaje Madrid→Jazz Toledo ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Madrid → Festival de Jazz de Toledo: 70 km por A-42, 50 min, desde 3 €/asiento sin comisión. Jazz en la ciudad imperial de tres culturas.`,
    keywords: `carpooling madrid jazz toledo, viaje compartido madrid toledo festival jazz`,
  },
  "guadalajara-festival-de-jazz-de-toledo": {
    title: `Coche Guadalajara→Jazz Toledo ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Guadalajara → Festival de Jazz de Toledo: 90 km por A-2+A-42, 1 h, desde 3 €/asiento sin comisión. Jazz en la ciudad imperial desde la Alcarria.`,
    keywords: `carpooling guadalajara jazz toledo, viaje compartido guadalajara toledo festival jazz`,
  },
  "cuenca-festival-de-jazz-de-toledo": {
    title: `Viaje Cuenca→Jazz Toledo ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Cuenca → Festival de Jazz de Toledo: 150 km por A-40+A-42, 1 h 30 min, desde 3 €/asiento sin comisión. De las Casas Colgadas al jazz en la ciudad imperial.`,
    keywords: `carpooling cuenca jazz toledo, viaje compartido cuenca toledo festival jazz`,
  },
  "madrid-festival-complutense": {
    title: `Coche Madrid→Festival Complutense ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Madrid → Festival Complutense (Alcalá de Henares): 35 km por A-2, 35 min, desde 3 €/asiento sin comisión. El festival universitario de la ciudad de Cervantes.`,
    keywords: `carpooling madrid festival complutense, viaje compartido madrid alcala henares festival`,
  },
  "guadalajara-festival-complutense": {
    title: `Viaje Guadalajara→Festival Complutense ${YEAR}: — ConcertRide`,
    description: `Guadalajara → Festival Complutense Alcalá: 55 km por A-2, 50 min, desde 3 €/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling guadalajara festival complutense, viaje compartido guadalajara alcala festival`,
  },
  "segovia-festival-complutense": {
    title: `Coche Segovia→Festival Complutense ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Segovia → Festival Complutense Alcalá: 110 km por A-1+A-2, 1 h 10 min, desde 3 €/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling segovia festival complutense, viaje compartido segovia alcala festival`,
  },
  "madrid-festival-de-musica-de-leganes": {
    title: `Coche Madrid→Leganés Fest ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Madrid → Festival de Música de Leganés: 15 km por M-45, 20 min, desde 3 €/asiento sin comisión. El festival de rock del sur metropolitano de Madrid.`,
    keywords: `carpooling madrid festival leganes, viaje compartido madrid leganes festival`,
  },
  "toledo-festival-de-musica-de-leganes": {
    title: `Viaje Toledo→Festival Leganés ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Toledo → Festival de Música de Leganés: 70 km por A-42, 55 min, desde 3 €/asiento sin comisión. El festival del sur de Madrid desde la ciudad imperial.`,
    keywords: `carpooling toledo festival leganes, viaje compartido toledo leganes festival`,
  },
  "guadalajara-festival-de-musica-de-leganes": {
    title: `Coche Guadalajara→Festival Leganés ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Guadalajara → Festival de Música de Leganés: 70 km por A-2+M-45, 55 min, desde 3 €/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling guadalajara festival leganes, viaje compartido guadalajara leganes festival`,
  },
  "madrid-festival-de-musica-de-mostoles": {
    title: `Viaje Madrid→Festival Móstoles ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Madrid → Festival de Música de Móstoles: 20 km por A-5, 25 min, desde 3 €/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling madrid festival mostoles, viaje compartido madrid mostoles festival`,
  },
  "toledo-festival-de-musica-de-mostoles": {
    title: `Coche Toledo→Festival Móstoles ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Toledo → Festival de Música de Móstoles: 65 km por A-42+A-5, 55 min, desde 3 €/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling toledo festival mostoles, viaje compartido toledo mostoles festival`,
  },
  "avila-festival-de-musica-de-mostoles": {
    title: `Viaje Ávila→Festival Móstoles ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Ávila → Festival de Música de Móstoles: 110 km por A-5, 1 h 10 min, desde 3 €/asiento sin comisión. 0% comisión, conductores verificados.`,
    keywords: `carpooling avila festival mostoles, viaje compartido avila mostoles festival`,
  },
  "madrid-festival-de-musica-de-alcorcon": {
    title: `Coche Madrid→Festival Alcorcón ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Madrid → Festival de Música de Alcorcón: 15 km por M-506, 20 min, desde 3 €/asiento sin comisión. El festival del sur de Madrid a 20 minutos del centro.`,
    keywords: `carpooling madrid festival alcorcon, viaje compartido madrid alcorcon festival`,
  },
  "toledo-festival-de-musica-de-alcorcon": {
    title: `Viaje Toledo→Festival Alcorcón ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Toledo → Festival de Música de Alcorcón: 65 km por A-42, 55 min, desde 3 €/asiento sin comisión. El festival del suroeste madrileño desde la ciudad imperial.`,
    keywords: `carpooling toledo festival alcorcon, viaje compartido toledo alcorcon festival`,
  },
  "segovia-festival-de-musica-de-alcorcon": {
    title: `Coche Segovia→Festival Alcorcón ${YEAR} [Desde 3€] — ConcertRide`,
    description: `Segovia → Festival de Música de Alcorcón: 95 km por A-6+M-506, 1 h, desde 3 €/asiento sin comisión. Del Acueducto al festival del suroeste de Madrid.`,
    keywords: `carpooling segovia festival alcorcon, viaje compartido segovia alcorcon festival`,
  },

  // ── Wave 2026-05-17: 50 overrides ricos — matriz Ciudad×Festival ────────────

  // ── Madrid × festivales ────────────────────────────────────────────────────
  "madrid-download-festival": {
    title: `Madrid → Download Festival España ${YEAR} desde 5€ · ConcertRide`,
    description: `Carpooling Madrid → Download Festival España ${YEAR} (Recinto IFEMA, 15 km, 25 min por M-40). 0% comisión, conductores verificados.`,
    keywords: `carpooling madrid download festival, viaje compartido madrid download metal, como ir download festival desde madrid, download festival madrid transporte, download festival ifema desde madrid`,
  },
  "madrid-dcode": {
    title: `Madrid → DCode Festival ${YEAR}: desde 4€ · 15min | ConcertRide`,
    description: `Carpooling Madrid → DCode ${YEAR} (Ciudad Universitaria, 8 km, 15 min por M-30). 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `carpooling madrid dcode festival, viaje compartido madrid dcode, como ir dcode desde madrid, dcode festival transporte madrid, dcode ciudad universitaria carpooling`,
  },
  "madrid-o-son-do-camino": {
    title: `Madrid → O Son do Camiño ${YEAR}: desde 15€ · 5h45 | ConcertRide`,
    description: `Carpooling Madrid → O Son do Camiño ${YEAR} (Monte do Gozo, Santiago de Compostela, 585 km, 5h 45 min por A-6). 0% comisión, conductores verificados.`,
    keywords: `carpooling madrid o son do camino, viaje compartido madrid santiago festival, como ir o son do camiño desde madrid, transporte madrid o son do camino ${YEAR}, madrid monte do gozo festival`,
  },
  "madrid-sonorama-ribera": {
    title: `Madrid → Sonorama Ribera ${YEAR} desde 8€ · ConcertRide`,
    description: `Carpooling Madrid → Sonorama Ribera ${YEAR} (Aranda de Duero, 160 km, 1h 45 min por A-1). 0% comisión, conductores verificados.`,
    keywords: `carpooling madrid sonorama ribera, viaje compartido madrid aranda de duero sonorama, como ir sonorama desde madrid, madrid aranda festival indie, transporte madrid sonorama ${YEAR}`,
  },
  "madrid-medusa-festival": {
    title: `Madrid → Medusa Festival ${YEAR} desde 15€ · ConcertRide`,
    description: `Carpooling Madrid → Medusa Festival ${YEAR} (Playa de Cullera, 390 km, 3h 50 min por A-3). 0% comisión, conductores verificados.`,
    keywords: `carpooling madrid medusa festival, viaje compartido madrid cullera medusa, como ir medusa festival desde madrid, transporte madrid medusa ${YEAR}, madrid cullera festival electronica`,
  },
  "madrid-resurrection-fest": {
    title: `Madrid → Resurrection Fest ${YEAR} desde 16€ · ConcertRide`,
    description: `Carpooling Madrid → Resurrection Fest ${YEAR} (Viveiro, Lugo, 600 km, 7h por A-6). 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `carpooling madrid resurrection fest, viaje compartido madrid viveiro resurrection fest, como ir resurrection fest desde madrid, transporte madrid resurrection ${YEAR}, madrid viveiro metal festival`,
  },

  // ── Barcelona × festivales ─────────────────────────────────────────────────
  "barcelona-vina-rock": {
    title: `Barcelona → Viña Rock ${YEAR} desde 17€ · ConcertRide`,
    description: `Carpooling Barcelona → Viña Rock ${YEAR} (La Pulgosa, Villarrobledo, 640 km, 5h 30 min por AP-2+A-31). 0% comisión, conductores verificados.`,
    keywords: `carpooling barcelona viña rock, viaje compartido barcelona villarrobledo, como ir viña rock desde barcelona, transporte barcelona vina rock ${YEAR}, barcelona villarrobledo festival`,
  },
  "barcelona-o-son-do-camino": {
    title: `Barcelona → O Son do Camiño ${YEAR} desde 22€ · ConcertRide`,
    description: `Carpooling Barcelona → O Son do Camiño ${YEAR} (Monte do Gozo, Santiago, 1.050 km, 10h por AP-2+A-6). 0% comisión, conductores verificados.`,
    keywords: `carpooling barcelona o son do camino, viaje compartido barcelona santiago festival, como ir o son do camino desde barcelona, transporte barcelona monte do gozo`,
  },
  "barcelona-medusa-festival": {
    title: `Barcelona → Medusa Festival ${YEAR} desde 10€ · ConcertRide`,
    description: `Carpooling Barcelona → Medusa Festival ${YEAR} (Playa de Cullera, 305 km, 3h por AP-7). 0% comisión, conductores verificados.`,
    keywords: `carpooling barcelona medusa festival, viaje compartido barcelona cullera, como ir medusa desde barcelona, transporte barcelona medusa ${YEAR}, barcelona cullera electronica`,
  },
  "barcelona-resurrection-fest": {
    title: `Barcelona → Resurrection Fest ${YEAR} desde 18€ · ConcertRide`,
    description: `Carpooling Barcelona → Resurrection Fest ${YEAR} (Viveiro, Lugo, 890 km, 9h por AP-2+A-6). 0% comisión, conductores verificados.`,
    keywords: `carpooling barcelona resurrection fest, viaje compartido barcelona viveiro, como ir resurrection fest desde barcelona, transporte barcelona resurrection ${YEAR}`,
  },

  // ── Valencia × festivales ──────────────────────────────────────────────────
  "valencia-mad-cool": {
    title: `Valencia → Mad Cool ${YEAR}: desde 10€ · 3h20 · IFEMA | ConcertRide`,
    description: `Carpooling Valencia → Mad Cool ${YEAR} (IFEMA Iberdrola Music, Madrid, 355 km, 3h 20 min por A-3). 0% comisión, conductores verificados.`,
    keywords: `carpooling valencia mad cool, viaje compartido valencia madrid mad cool, como ir mad cool desde valencia, transporte valencia mad cool ${YEAR}, valencia madrid festival verano`,
  },
  "valencia-bbk-live": {
    title: `Valencia → BBK Live ${YEAR}: desde 16€ · 5h45 · Bilbao | ConcertRide`,
    description: `Carpooling Valencia → BBK Live ${YEAR} (Kobetamendi, Bilbao, 615 km, 5h 45 min por AP-7+AP-68). 0% comisión, conductores verificados.`,
    keywords: `carpooling valencia bbk live, viaje compartido valencia bilbao bbk live, como ir bbk live desde valencia, transporte valencia bbk ${YEAR}`,
  },
  "valencia-resurrection-fest": {
    title: `Valencia → Resurrection Fest ${YEAR} desde 20€ · ConcertRide`,
    description: `Carpooling Valencia → Resurrection Fest ${YEAR} (Viveiro, Lugo, 800 km, 8h por A-3+A-6). 0% comisión, conductores verificados.`,
    keywords: `carpooling valencia resurrection fest, viaje compartido valencia viveiro, como ir resurrection fest desde valencia, transporte valencia resurrection`,
  },
  "valencia-sonorama-ribera": {
    title: `Valencia → Sonorama Ribera ${YEAR} desde 12€ · ConcertRide`,
    description: `Carpooling Valencia → Sonorama Ribera ${YEAR} (Aranda de Duero, 425 km, 3h 30 min por A-3+A-1). 0% comisión, conductores verificados.`,
    keywords: `carpooling valencia sonorama ribera, viaje compartido valencia aranda sonorama, como ir sonorama desde valencia, transporte valencia sonorama`,
  },

  // ── Sevilla × festivales ────────────────────────────────────────────────────
  "sevilla-bbk-live": {
    title: `Sevilla → BBK Live ${YEAR}: desde 18€ · 7h · Bilbao | ConcertRide`,
    description: `Carpooling Sevilla → BBK Live ${YEAR} (Kobetamendi, Bilbao, 875 km, 7h por A-4+A-1). 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `carpooling sevilla bbk live, viaje compartido sevilla bilbao bbk live, como ir bbk live desde sevilla, transporte sevilla bbk live ${YEAR}`,
  },
  "sevilla-primavera-sound": {
    title: `Sevilla → Primavera Sound ${YEAR} desde 20€ · ConcertRide`,
    description: `Carpooling Sevilla → Primavera Sound ${YEAR} (Parc del Fòrum, Barcelona, 1.000 km, 7h por A-4+AP-7). 0% comisión, conductores verificados.`,
    keywords: `carpooling sevilla primavera sound, viaje compartido sevilla barcelona primavera sound, como ir primavera sound desde sevilla, transporte sevilla primavera`,
  },
  "sevilla-sonar": {
    title: `Sevilla → Sónar ${YEAR}: desde 20€ · 7h · Barcelona | ConcertRide`,
    description: `Carpooling Sevilla → Sónar ${YEAR} (Fira Montjuïc + Gran Via, Barcelona, 1.000 km, 7h por A-4+AP-7). 0% comisión, conductores verificados.`,
    keywords: `carpooling sevilla sonar barcelona, viaje compartido sevilla sonar, como ir sonar desde sevilla, transporte sevilla sonar ${YEAR}`,
  },
  "sevilla-arenal-sound": {
    title: `Sevilla → Arenal Sound ${YEAR} desde 18€ · ConcertRide`,
    description: `Carpooling Sevilla → Arenal Sound ${YEAR} (Burriana, Castellón, 660 km, 6h por A-4+AP-7). 0% comisión, conductores verificados.`,
    keywords: `carpooling sevilla arenal sound, viaje compartido sevilla burriana arenal sound, como ir arenal sound desde sevilla, transporte sevilla arenal`,
  },
  "sevilla-fib": {
    title: `Sevilla → FIB Benicàssim ${YEAR} desde 18€ · ConcertRide`,
    description: `Carpooling Sevilla → FIB Benicàssim ${YEAR} (Benicàssim, Castellón, 690 km, 6h 30 min por A-4+AP-7). 0% comisión, conductores verificados.`,
    keywords: `carpooling sevilla fib benicassim, viaje compartido sevilla fib, como ir fib desde sevilla, transporte sevilla fib ${YEAR}, sevilla benicassim festival`,
  },
  "sevilla-resurrection-fest": {
    title: `Sevilla → Resurrection Fest ${YEAR} desde 22€ · ConcertRide`,
    description: `Carpooling Sevilla → Resurrection Fest ${YEAR} (Viveiro, Lugo, 870 km, 9h por A-66+A-6). 0% comisión, conductores verificados.`,
    keywords: `carpooling sevilla resurrection fest, viaje compartido sevilla viveiro, como ir resurrection fest desde sevilla, transporte sevilla resurrection`,
  },
  "sevilla-medusa-festival": {
    title: `Sevilla → Medusa Festival ${YEAR} desde 18€ · ConcertRide`,
    description: `Carpooling Sevilla → Medusa Festival ${YEAR} (Playa de Cullera, 680 km, 6h por A-4+A-3). 0% comisión, conductores verificados.`,
    keywords: `carpooling sevilla medusa festival, viaje compartido sevilla cullera medusa, como ir medusa desde sevilla, transporte sevilla medusa`,
  },

  // ── Bilbao × festivales ──────────────────────────────────────────────────────
  "bilbao-fib": {
    title: `Bilbao → FIB Benicàssim ${YEAR} desde 14€ · ConcertRide`,
    description: `Carpooling Bilbao → FIB Benicàssim ${YEAR} (Benicàssim, Castellón, 510 km, 4h 30 min por AP-68+AP-7). 0% comisión, conductores verificados.`,
    keywords: `carpooling bilbao fib benicassim, viaje compartido bilbao fib, como ir fib desde bilbao, transporte bilbao fib ${YEAR}, bilbao benicassim festival`,
  },
  "bilbao-arenal-sound": {
    title: `Bilbao → Arenal Sound ${YEAR} desde 14€ · ConcertRide`,
    description: `Carpooling Bilbao → Arenal Sound ${YEAR} (Burriana, Castellón, 530 km, 4h 30 min por AP-68+AP-7). 0% comisión, conductores verificados.`,
    keywords: `carpooling bilbao arenal sound, viaje compartido bilbao burriana arenal sound, como ir arenal sound desde bilbao, transporte bilbao arenal`,
  },
  "bilbao-vina-rock": {
    title: `Bilbao → Viña Rock ${YEAR} desde 12€ · ConcertRide`,
    description: `Carpooling Bilbao → Viña Rock ${YEAR} (La Pulgosa, Villarrobledo, 445 km, 3h 30 min por A-1+A-31). 0% comisión, conductores verificados.`,
    keywords: `carpooling bilbao viña rock, viaje compartido bilbao villarrobledo, como ir viña rock desde bilbao, transporte bilbao vina rock ${YEAR}`,
  },
  "bilbao-medusa-festival": {
    title: `Bilbao → Medusa Festival ${YEAR} desde 16€ · ConcertRide`,
    description: `Carpooling Bilbao → Medusa Festival ${YEAR} (Playa de Cullera, 590 km, 5h por AP-68+AP-7). 0% comisión, conductores verificados.`,
    keywords: `carpooling bilbao medusa festival, viaje compartido bilbao cullera medusa, como ir medusa desde bilbao, transporte bilbao medusa`,
  },
  "bilbao-o-son-do-camino": {
    title: `Bilbao → O Son do Camiño ${YEAR} desde 12€ · ConcertRide`,
    description: `Carpooling Bilbao → O Son do Camiño ${YEAR} (Monte do Gozo, Santiago, 460 km, 4h por A-8+AP-9). 0% comisión, conductores verificados.`,
    keywords: `carpooling bilbao o son do camino, viaje compartido bilbao santiago festival, como ir o son do camino desde bilbao, transporte bilbao monte do gozo`,
  },
  "bilbao-sonar": {
    title: `Bilbao → Sónar ${YEAR}: desde 12€ · 4h45 · Barcelona | ConcertRide`,
    description: `Carpooling Bilbao → Sónar ${YEAR} (Fira Montjuïc + Gran Via, Barcelona, 510 km, 4h 45 min por AP-68+AP-2). 0% comisión, conductores verificados.`,
    keywords: `carpooling bilbao sonar barcelona, viaje compartido bilbao sonar, como ir sonar desde bilbao, transporte bilbao sonar ${YEAR}`,
  },

  // ── Zaragoza × festivales ──────────────────────────────────────────────────
  "zaragoza-bbk-live": {
    title: `Zaragoza → BBK Live ${YEAR}: desde 10€ · 3h · Bilbao | ConcertRide`,
    description: `Carpooling Zaragoza → BBK Live ${YEAR} (Kobetamendi, Bilbao, 324 km, 3h por AP-68). 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `carpooling zaragoza bbk live, viaje compartido zaragoza bilbao bbk live, como ir bbk live desde zaragoza, transporte zaragoza bbk ${YEAR}`,
  },
  "zaragoza-fib": {
    title: `Zaragoza → FIB Benicàssim ${YEAR} desde 9€ · ConcertRide`,
    description: `Carpooling Zaragoza → FIB Benicàssim ${YEAR} (Benicàssim, Castellón, 320 km, 2h 30 min por AP-7). 0% comisión, conductores verificados.`,
    keywords: `carpooling zaragoza fib benicassim, viaje compartido zaragoza fib, como ir fib desde zaragoza, transporte zaragoza fib ${YEAR}`,
  },
  "zaragoza-vina-rock": {
    title: `Zaragoza → Viña Rock ${YEAR} desde 12€ · ConcertRide`,
    description: `Carpooling Zaragoza → Viña Rock ${YEAR} (La Pulgosa, Villarrobledo, 440 km, 4h por A-23+A-31). 0% comisión, conductores verificados.`,
    keywords: `carpooling zaragoza viña rock, viaje compartido zaragoza villarrobledo, como ir viña rock desde zaragoza, transporte zaragoza vina rock ${YEAR}`,
  },
  "zaragoza-resurrection-fest": {
    title: `Zaragoza → Resurrection Fest ${YEAR} desde 18€ · ConcertRide`,
    description: `Carpooling Zaragoza → Resurrection Fest ${YEAR} (Viveiro, Lugo, 660 km, 6h por A-2+A-6). 0% comisión, conductores verificados.`,
    keywords: `carpooling zaragoza resurrection fest, viaje compartido zaragoza viveiro, como ir resurrection fest desde zaragoza, transporte zaragoza resurrection`,
  },
  "zaragoza-o-son-do-camino": {
    title: `Zaragoza → O Son do Camiño ${YEAR} desde 18€ · ConcertRide`,
    description: `Carpooling Zaragoza → O Son do Camiño ${YEAR} (Monte do Gozo, Santiago, 680 km, 5h 45 min por AP-2+A-6). 0% comisión, conductores verificados.`,
    keywords: `carpooling zaragoza o son do camino, viaje compartido zaragoza santiago festival, como ir o son do camino desde zaragoza, transporte zaragoza monte do gozo`,
  },

  // ── Málaga × festivales ────────────────────────────────────────────────────
  "malaga-primavera-sound": {
    title: `Málaga → Primavera Sound ${YEAR} desde 22€ · ConcertRide`,
    description: `Carpooling Málaga → Primavera Sound ${YEAR} (Parc del Fòrum, Barcelona, 1.005 km, 8h por A-45+AP-7). 0% comisión, conductores verificados.`,
    keywords: `carpooling malaga primavera sound, viaje compartido malaga barcelona primavera sound, como ir primavera sound desde malaga, transporte malaga primavera`,
  },
  "malaga-sonar": {
    title: `Málaga → Sónar ${YEAR}: desde 22€ · 8h · Barcelona | ConcertRide`,
    description: `Carpooling Málaga → Sónar ${YEAR} (Fira Montjuïc + Gran Via, Barcelona, 1.005 km, 8h por A-45+AP-7). 0% comisión, conductores verificados.`,
    keywords: `carpooling malaga sonar barcelona, viaje compartido malaga sonar, como ir sonar desde malaga, transporte malaga sonar ${YEAR}`,
  },
  "malaga-bbk-live": {
    title: `Málaga → BBK Live ${YEAR}: desde 22€ · 8h30 · Bilbao | ConcertRide`,
    description: `Carpooling Málaga → BBK Live ${YEAR} (Kobetamendi, Bilbao, 890 km, 8h 30 min por A-92+A-1). 0% comisión, conductores verificados.`,
    keywords: `carpooling malaga bbk live, viaje compartido malaga bilbao bbk live, como ir bbk live desde malaga, transporte malaga bbk`,
  },
  "malaga-arenal-sound": {
    title: `Málaga → Arenal Sound ${YEAR} desde 16€ · ConcertRide`,
    description: `Carpooling Málaga → Arenal Sound ${YEAR} (Burriana, Castellón, 615 km, 5h 30 min por AP-7). 0% comisión, conductores verificados.`,
    keywords: `carpooling malaga arenal sound, viaje compartido malaga burriana arenal sound, como ir arenal sound desde malaga, transporte malaga arenal`,
  },
  "malaga-resurrection-fest": {
    title: `Málaga → Resurrection Fest ${YEAR} desde 24€ · ConcertRide`,
    description: `Carpooling Málaga → Resurrection Fest ${YEAR} (Viveiro, Lugo, 990 km, 10h por A-45+A-6). 0% comisión, conductores verificados.`,
    keywords: `carpooling malaga resurrection fest, viaje compartido malaga viveiro, como ir resurrection fest desde malaga, transporte malaga resurrection`,
  },
  "malaga-fib": {
    title: `Málaga → FIB Benicàssim ${YEAR} desde 16€ · ConcertRide`,
    description: `Carpooling Málaga → FIB Benicàssim ${YEAR} (Benicàssim, Castellón, 608 km, 5h 30 min por AP-7). 0% comisión, conductores verificados.`,
    keywords: `carpooling malaga fib benicassim, viaje compartido malaga fib, como ir fib desde malaga, transporte malaga fib ${YEAR}`,
  },
  "malaga-medusa-festival": {
    title: `Málaga → Medusa Festival ${YEAR} desde 16€ · ConcertRide`,
    description: `Carpooling Málaga → Medusa Festival ${YEAR} (Playa de Cullera, 590 km, 5h por A-7). 0 % comisión, vuelta nocturna y conductores verificados en ConcertRide.`,
    keywords: `carpooling malaga medusa festival, viaje compartido malaga cullera medusa, como ir medusa desde malaga, transporte malaga medusa`,
  },

};

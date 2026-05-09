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
    title: `Viña Rock ${YEAR} [Guía Oficial]: Buses, horarios y carpooling 3€ | ConcertRide`,
    description: `Viña Rock ${YEAR} (30 abr–3 may, La Pulgosa Villarrobledo): bus oficial Albacete→Villarrobledo 8–12€, lanzaderas y horarios. Carpooling desde Madrid (6–9€), Valencia (6–9€), Alicante (5–8€), Cuenca (4–6€). Vuelta de madrugada coordinada. Sin comisión, 0% intermediarios — pago directo al conductor.`,
    keywords: `viña rock ${YEAR}, viña rock buses, autobuses viñarock, autobus viña rock, bus viñarock, buses viñarock, bus viña rock, buses viña rock, como llegar viña rock, viña rock como llegar, transporte viña rock, viaje compartido viña rock, viña rock desde madrid, viña rock autobús, viñarock buses, viña rock localización, viña rock horarios, viña rock transporte, viña rock guia oficial, lanzadera viña rock, viña rock 2026 entradas`,
  },
  "arenal-sound": {
    title: `Arenal Sound ${YEAR} [29 Jul–2 Ago Burriana]: Bus Lanzadera + Carpooling 3€ | ConcertRide`,
    description: `Arenal Sound ${YEAR} (29 jul–2 ago, Playa Burriana Castellón, 250.000 asistentes): bus lanzadera oficial Castellón→Burriana (5–8€, 20 min, frecuencia 30 min) y tren Cercanías C6 Valencia–Castellón (45 min, 3,90€). Carpooling sin comisión desde Valencia (3–6€), Castellón (3–5€), Madrid (12–17€), Barcelona (8–12€), Alicante (4–7€), Zaragoza (8–12€). Vuelta de madrugada coordinada. 0% intermediarios.`,
    keywords: `arenal sound ${YEAR}, autobus castellon burriana arenal sound, autobuses castellon burriana arenal sound, bus burriana arenal sound, arenal sound como llegar, como ir al arenal sound, arenal sound localización, arenal sound tren, tren arenal sound, arenal sound bus, arenal sound autobuses, bus arenal sound, buses arenal sound, arenal sound carpooling, viaje compartido burriana arenal sound, arenal sound desde madrid, arenal sound guia transporte, arenal sound horarios, arenal sound entradas, arenal sound 2026 cartel, arenal sound desde alicante, arenal sound autobuses castellon`,
  },
  "mad-cool": {
    title: `Mad Cool ${YEAR} Madrid [9–11 jul IFEMA]: Metro L8 + Carpooling 4€ | ConcertRide`,
    description: `Mad Cool ${YEAR} (9–11 jul, IFEMA Madrid, 80.000 pers/día): Metro L8 Feria de Madrid (25 min desde Sol, ampliado hasta 02:30). Carpooling sin comisión desde Barcelona (15–20€), Valencia (10–14€), Zaragoza (9–13€), Sevilla (14–20€), Bilbao (11–16€). Vuelta nocturna coordinada. Pago Bizum o efectivo, 0% comisión.`,
    keywords: `mad cool ${YEAR}, como llegar al mad cool ${YEAR}, mad cool como llegar, mad cool madrid carpooling, mad cool transporte, como ir mad cool, mad cool metro, mad cool ifema, mad cool barcelona, viaje compartido mad cool, carpooling madrid ifema, mad cool entradas, mad cool cartel, mad cool fechas, mad cool 2026 horarios, mad cool desde barcelona`,
  },
  "bbk-live": {
    title: `BBK Live ${YEAR} Bilbao [Lanzadera Gratis + Carpooling 3€] | ConcertRide`,
    description: `BBK Live ${YEAR} (9–11 jul, Kobetamendi Bilbao, 30.000 pers/día): lanzadera oficial GRATUITA desde Plaza Moyúa (Metro L1 Moyua, frecuencia 10 min, hasta 04:30). Carpooling desde Madrid (11–16€), Donostia (4–7€), Vitoria (3–6€), Santander (5–8€), Pamplona (5–8€). Sin comisión.`,
    keywords: `bbk live ${YEAR}, bbk live carpooling, como llegar bbk live, transporte bbk live, autobús bbk live bilbao, viaje compartido kobetamendi, bbk live lanzadera, bbk live entradas, bbk live cartel, bbk live horarios, festival bilbao ${YEAR}, bbk live desde madrid, bbk live desde donostia`,
  },
  "primavera-sound": {
    title: `Primavera Sound ${YEAR} [Guía Transporte]: Metro L4 + carpooling 8€ | ConcertRide`,
    description: `Primavera Sound ${YEAR} (28 may–1 jun, Parc del Fòrum Barcelona): Metro L4 Besòs Mar / Maresme directa al recinto (cada 3 min, ampliado hasta 02:30 días de festival). Carpooling sin comisión desde Madrid (15–20€), Valencia (10–14€), Zaragoza (8–12€), Bilbao (16–22€). Conductores verificados, vuelta nocturna coordinada.`,
    keywords: `primavera sound ${YEAR}, primavera sound carpooling, como llegar primavera sound barcelona, transporte primavera sound, viaje compartido barcelona fòrum, primavera sound metro, primavera sound guia transporte, primavera sound entradas, primavera sound horarios, primavera sound desde madrid, primavera sound desde valencia`,
  },
  "resurrection-fest": {
    title: `Resurrection Fest ${YEAR} [Festival Metal Galicia]: Carpooling desde 4€ sin comisión | ConcertRide`,
    description: `Resurrection Fest ${YEAR} (25–28 jun, A Gañidoira Viveiro Lugo): el festival de metal más grande del sur de Europa. Sin tren directo, ALSA Madrid–Viveiro 7–8h (~40€). Carpooling desde A Coruña (4–7€, 100 km), Vigo (6–9€), Bilbao (12–17€), Madrid (16–22€). Vuelta de madrugada coordinada. Sin comisión.`,
    keywords: `resurrection fest ${YEAR}, resurrection fest viveiro carpooling, como llegar resurrection fest, transporte metal festival, viaje compartido resurrection fest, resurrection fest entradas, resurrection fest desde madrid, resurrection fest desde a coruña, resurrection fest cartel, festival metal galicia, resurrection fest 2026 fechas`,
  },
  "cala-mijas": {
    title: `Cala Mijas Festival ${YEAR} [Sin Shuttle Oficial]: Carpooling desde 3€ | ConcertRide`,
    description: `Cala Mijas Festival ${YEAR} (2–4 oct, Cortijo de Torres Mijas Málaga): SIN shuttle oficial, sin transporte público al recinto. Carpooling sin comisión desde Málaga (3–5€, 25 km), Marbella (3–6€), Fuengirola (3–5€), Sevilla (7–11€), Granada (5–8€, 130 km), Madrid (14–20€). Vuelta de madrugada coordinada — la única opción real.`,
    keywords: `cala mijas festival ${YEAR}, cala mijas ${YEAR}, mijas festival ${YEAR}, la cala festival ${YEAR}, cala mijas carpooling, como llegar cala mijas, transporte cala mijas, cala mijas festival málaga, cortijo de torres mijas, viaje compartido cala mijas, cala mijas desde málaga, cala de mijas festival, cala mijas entradas, cala mijas cartel, cala mijas shuttle, cala mijas desde sevilla`,
  },
  "o-son-do-camino": {
    title: `O Son do Camiño ${YEAR} Santiago [18–20 jun Monte do Gozo]: Lanzadera + Carpooling 3€ | ConcertRide`,
    description: `O Son do Camiño ${YEAR} (18–20 jun, Monte do Gozo Santiago, 270.000 acumulados): lanzadera GRATIS desde Santiago centro hasta el recinto. Carpooling sin comisión desde A Coruña (3–6€, 75 km), Vigo (4–7€, 90 km), Ourense (5–8€, 110 km), Pontevedra (3–5€), Lugo (4–7€), Madrid (15–20€). Vuelta de madrugada coordinada.`,
    keywords: `o son do camiño ${YEAR}, o son do camino ${YEAR}, o son do camiño santiago carpooling, como llegar o son do camiño, como llegar o son do camino, transporte monte do gozo, viaje compartido santiago festival, o son do camiño desde madrid, o son do camiño desde a coruña, o son do camiño desde vigo, festival galicia ${YEAR}, festival santiago compostela ${YEAR}, o son do camino entradas, o son do camino cartel ${YEAR}, monte do gozo lanzadera`,
  },
  "low-festival": {
    title: `Low Festival ${YEAR} Benidorm [24–26 jul]: Indie + Pop + Carpooling 3€ | ConcertRide`,
    description: `Low Festival ${YEAR} (24–26 jul, Ciudad Deportiva Guillermo Amor Benidorm, 65.000 acumulados): indie/pop/rock junto al Mediterráneo. TRAM L1 Alicante–Benidorm (1h, 4€). Carpooling sin comisión desde Benidorm centro (3€), Alicante (5–8€), Elche (4–7€), Valencia (5–8€), Madrid (15–20€). Vuelta nocturna coordinada — el TRAM cierra antes del cabeza de cartel.`,
    keywords: `low festival benidorm ${YEAR}, low festival carpooling, como llegar low festival, transporte benidorm festival, viaje compartido low festival, low festival entradas, low festival cartel, low festival ciudad deportiva guillermo amor, festival benidorm indie, low festival fechas`,
  },
  "zevra-festival": {
    title: `[Guía 2026] Zevra Festival Valencia La Marina: Metro L4 + Carpooling desde 3€ | ConcertRide`,
    description: `Zevra Festival ${YEAR} (La Marina de Valencia): apertura 19:00, cabezas de cartel 23:00–01:00. Metro L4 Marítim-Serreria (5 min andando) y bus EMT 19/95. Carpooling sin comisión desde Madrid (10–14€, 355 km), Alicante (5–8€, 175 km), Castellón (3–5€), Murcia (7–11€). Vuelta nocturna coordinada.`,
    keywords: `zevra festival ${YEAR}, zevra horarios, zevra festival horarios, zevra festival bus, zevra festival valencia, zevra festival donde es, zevra festival como llegar, zevra festival transporte, zevra festival metro, zevra festival carpooling, como llegar zevra festival, zevra entradas, zevra cartel, zevra desde madrid, festival valencia ${YEAR}`,
  },
  "fib": {
    title: `FIB Benicàssim ${YEAR} [Tren + Bus + Carpooling]: Desde 4€ | ConcertRide`,
    description: `FIB ${YEAR} (16–19 jul, Benicàssim Castellón): Tren Cercanías C6 Castellón–Benicàssim (5 min, 1,75€) directo al recinto. Carpooling desde Valencia (4–7€, 70 km), Madrid (10–14€), Barcelona (8–12€), Alicante (5–8€). Vuelta nocturna coordinada — el último Cercanías sale a 23:30. Sin comisión.`,
    keywords: `fib ${YEAR}, fib benicassim ${YEAR}, fib benicàssim como llegar, fib festival tren, autobús fib, fib carpooling, festival internacional benicassim, fib transporte, como ir fib, fib entradas, fib horarios, fib cartel, fib desde madrid, fib desde valencia, fib desde barcelona`,
  },
  "vive-latino": {
    title: `Vive Latino España ${YEAR} Zaragoza [4–5 sep Recinto Expo]: Carpooling 5€ | ConcertRide`,
    description: `Vive Latino España ${YEAR} (4–5 sep, Recinto Expo Zaragoza, 40.000/día) — primera edición europea del festival latino más prestigioso. Carpooling sin comisión desde Madrid (9–13€, 3h), Barcelona (8–12€, 2h 45min), Pamplona (5–8€), Huesca (3–5€), Bilbao (9–13€), Valencia (9–13€). Vuelta nocturna coordinada con asistentes del mismo festival.`,
    keywords: `vive latino españa ${YEAR}, vive latino zaragoza ${YEAR}, vive latino zaragoza septiembre, vive latino como llegar, carpooling vive latino, vive latino transporte, como ir al vive latino zaragoza, vive latino carpooling madrid, vive latino carpooling barcelona, vive latino recinto expo, vive latino zaragoza expo, vive latino entradas, vive latino cartel ${YEAR}, primera edicion europa vive latino`,
  },
  "festival-de-les-arts": {
    title: `Festival de les Arts ${YEAR} Valencia [28–31 may Ciudad Artes y Ciencias]: Carpooling 3€ | ConcertRide`,
    description: `Festival de les Arts ${YEAR} (28–31 may, Ciudad de las Artes y las Ciencias Valencia, 25.000/día): Metro L3/L5/L7 parada Alameda. Carpooling sin comisión desde Alicante (5–8€), Castellón (3–5€), Gandia (3–5€), Madrid (10–14€), Murcia (7–11€), Tarragona (7–11€). Vuelta nocturna coordinada — Metro Valencia hasta 02:00.`,
    keywords: `festival de les arts ${YEAR}, festival les arts valencia ${YEAR}, festival les arts como llegar, carpooling festival les arts, les arts transporte, como ir festival les arts, festival les arts carpooling alicante, festival les arts carpooling madrid, festival les arts entradas, festival les arts cartel ${YEAR}, ciudad artes y ciencias festival`,
  },
  "sonar": {
    title: `[ELECTRÓNICA] Sónar ${YEAR} Barcelona [18–20 Jun, Fira Montjuïc]: Metro + Carpooling 8€ | ConcertRide`,
    description: `Sónar ${YEAR} (18–20 jun, Fira Montjuïc + Fira Gran Via Barcelona): Metro L1 Espanya (Sónar de Día, 12:00–22:00) y L9 Fira Gran Via (Sónar de Noche, 22:00–08:00). Carpooling sin comisión desde Madrid (14–22€), Valencia (10–14€), Zaragoza (8–12€), Bilbao (16–22€), Sevilla (17–25€). El festival de electrónica más prestigioso de Europa. Vuelta nocturna coordinada.`,
    keywords: `sonar ${YEAR}, sonar barcelona ${YEAR}, sonar como llegar, sonar barcelona metro, sonar festival transporte, sonar carpooling, como llegar sonar, sonar fira montjuic, sonar de dia, sonar de noche, sonar entradas, sonar fechas, festival electronica barcelona, sonar fira gran via, sonar 2026 cartel, sonar desde madrid, sonar desde valencia`,
  },
  "sonorama-ribera": {
    title: `Sonorama Ribera ${YEAR} [Guía Aranda de Duero]: Carpooling DIRECTO desde 3€ | ConcertRide`,
    description: `Sonorama Ribera ${YEAR} (6–9 ago, Aranda de Duero Burgos): festival sin estación de tren. Bus La Sepulvedana Madrid–Aranda (1h 45 min, 10–15€). Carpooling sin comisión desde Madrid (5–8€, 160 km), Burgos (3–6€, 75 km), Valladolid (4–7€), Bilbao (5–8€), Zaragoza (9–12€). Vuelta de madrugada coordinada.`,
    keywords: `sonorama ribera ${YEAR}, sonorama aranda de duero, sonorama ${YEAR}, como llegar sonorama ribera, transporte sonorama ribera, bus sonorama ribera, sonorama ribera carpooling, sonorama ribera desde madrid, sonorama ribera burgos, sonorama entradas, sonorama cartel, la sepulvedana sonorama, sonorama desde bilbao, sonorama desde valladolid`,
  },
  "medusa-festival": {
    title: `Medusa Festival ${YEAR} Cullera [12–16 ago]: Electrónica 5 días + Carpooling 3€ | ConcertRide`,
    description: `Medusa Festival ${YEAR} (12–16 ago, Playa de Cullera Valencia, 200.000 acumulados, 5 días): electrónica nocturna mediterránea con lanzadera oficial Valencia–Cullera. Carpooling sin comisión desde Valencia (3–5€), Gandia (3–4€), Alicante (5–7€), Castellón (5–8€), Madrid (15–20€), Barcelona (10–14€). Vuelta nocturna coordinada.`,
    keywords: `medusa festival ${YEAR}, medusa festival cullera, como llegar medusa festival, medusa festival carpooling, transporte medusa festival, medusa festival desde valencia, medusa festival lanzadera, medusa festival entradas, medusa festival cartel ${YEAR}, medusa playa de cullera, festival electronica valencia, medusa festival horarios`,
  },
  "cruilla": {
    title: `Cruïlla ${YEAR} Barcelona [9–12 jul Parc del Fòrum]: Metro L4 + Carpooling 5€ | ConcertRide`,
    description: `Cruïlla ${YEAR} (9–12 jul, Parc del Fòrum Barcelona, 175.000 acumulados): pop/rock/electrónica con cabezas internacionales. Metro L4 Besòs Mar / Maresme directo al recinto. Carpooling sin comisión desde Madrid (15–20€), Valencia (10–14€), Zaragoza (8–12€), Tarragona (5–8€), Sabadell (3–5€), Mataró (3–5€). Vuelta de madrugada coordinada.`,
    keywords: `cruilla barcelona ${YEAR}, cruilla festival ${YEAR}, como llegar cruilla barcelona, cruilla metro, transporte cruilla, cruilla carpooling, cruilla entradas, cruilla cartel ${YEAR}, cruilla parc del forum, cruilla fechas, cruilla horarios`,
  },
  "tomavistas": {
    title: `Tomavistas ${YEAR} Madrid [15–17 may El Retiro]: Indie + Metro L2 + Carpooling 3€ | ConcertRide`,
    description: `Tomavistas ${YEAR} (15–17 may, Jardines del Buen Retiro Madrid, 20.000/día): festival urbano indie/pop en pleno centro. Metro L2 Retiro / L9 Ibiza directo al recinto. Carpooling sin comisión desde Móstoles (3–5€), Alcalá de Henares (3–5€), Barcelona (15–20€), Valencia (10–14€), Zaragoza (9–13€). Pago Bizum o efectivo.`,
    keywords: `tomavistas ${YEAR}, tomavistas madrid ${YEAR}, como llegar tomavistas, tomavistas metro retiro, transporte tomavistas, tomavistas carpooling, tomavistas entradas, tomavistas cartel ${YEAR}, tomavistas fechas, festival retiro madrid, tomavistas jardines buen retiro`,
  },
  "festival-ortigueira": {
    title: `[Entrada Gratis + 100.000 Asistentes] Festival Ortigueira ${YEAR}: Carpooling desde 4€ | ConcertRide`,
    description: `Festival Internacional do Mundo Celta de Ortigueira ${YEAR} (9–12 jul, A Coruña). Entrada gratuita, 100.000 asistentes acumulados. Sin estación de tren — carpooling desde A Coruña (100 km, 4–7€), Lugo (110 km, 4–7€), Vigo (195 km, 6–9€), Madrid (690 km, 18–25€). Sin comisión.`,
    keywords: `festival ortigueira ${YEAR}, ortigueira ${YEAR}, festival celta ortigueira, festival ortigueira fechas, festival ortigueira gratis, ortigueira como llegar, ortigueira carpooling, festival galicia gratis ${YEAR}, mundo celta ortigueira ${YEAR}, ortigueira desde a coruña, ortigueira desde lugo, ortigueira desde madrid, festival folk celta españa`,
  },
  "jazzaldia": {
    title: `Heineken Jazzaldia ${YEAR} San Sebastián · Cómo llegar: carpooling desde 4€ | ConcertRide`,
    description: `Heineken Jazzaldia ${YEAR} (61.ª edición, 22–26 jul), Donostia–San Sebastián. Plaza Trinidad, Kursaal, Plaza Sarriegi (gratis) y Zurriola. Carpooling desde Bilbao (100 km, 4–7€), Pamplona (90 km, 4–7€), Vitoria (115 km, 5–7€), Madrid (450 km, 13–18€), Barcelona (530 km, 14–20€). Sin comisión.`,
    keywords: `jazzaldia ${YEAR}, heineken jazzaldia ${YEAR}, jazzaldia donostia ${YEAR}, jazzaldia san sebastian ${YEAR}, jazzaldia 61 edicion, jazzaldia plaza trinidad, jazzaldia conciertos gratis, jazzaldia carpooling, festival jazz san sebastian, festival jazz donostia, jazzaldia desde bilbao, jazzaldia desde madrid, festival jazz españa ${YEAR}, festival jazz pais vasco`,
  },
  "metropoli-gijon": {
    title: `[Guía ${YEAR}] Metrópoli Gijón: Pop+Indie + Carpooling desde 3€ | ConcertRide`,
    description: `Festival Internacional Metrópoli Gijón ${YEAR} (3–5 jul), Recinto Ferial Luis Adaro. 30.000 personas/día, música pop/rock/indie + gaming + cómic. Cercanías Renfe Oviedo–Gijón. Carpooling desde Oviedo (30 km, 3–4€), León (120 km, 5–7€), Madrid (445 km, 13–17€), Bilbao (290 km, 9–12€). Sin comisión.`,
    keywords: `metropoli gijon ${YEAR}, festival metropoli gijon ${YEAR}, metropoli gijon fechas, metropoli gijon entradas, metropoli gijon como llegar, metropoli gijon carpooling, festival pop asturias ${YEAR}, festival gijon ${YEAR}, recinto ferial luis adaro, metropoli desde oviedo, metropoli desde madrid, festival rock asturias`,
  },
  "granada-sound": {
    title: `Granada Sound ${YEAR}: Cómo llegar al Cortijo del Conde, carpooling desde 5€ | ConcertRide`,
    description: `Granada Sound ${YEAR} (último fin de semana sept), Cortijo del Conde Granada. 25.000 personas/día. Bus lanzadera oficial desde Estación de Autobuses (5–7€). Carpooling desde Málaga (130 km, 5–8€), Sevilla (250 km, 8–11€), Madrid (430 km, 12–17€), Almería (170 km, 6–9€), Jaén (95 km, 4–7€). Sin comisión.`,
    keywords: `granada sound ${YEAR}, granada sound fechas, granada sound entradas, granada sound como llegar, granada sound carpooling, granada sound cortijo del conde, festival pop granada ${YEAR}, festival indie granada, granada sound shuttle, granada sound desde malaga, granada sound desde sevilla, festival andalucia oriental, festival granada septiembre`,
  },
  "pirineos-sur": {
    title: `Pirineos Sur ${YEAR} [Lanuza] · World music sobre el embalse | Carpooling 3€ | ConcertRide`,
    description: `Pirineos Sur ${YEAR} (10 jul–1 ago, 3 fines de semana), Auditorio flotante de Lanuza (Sallent de Gállego, Huesca). World music con escenario sobre el embalse pirenaico — único en Europa. Sin transporte público al pueblo. Carpooling sin comisión desde Huesca (75 km, 3–5€), Zaragoza (175 km, 6–9€), Madrid (480 km, 13–18€), Barcelona (430 km, 12–17€). Vuelta de madrugada coordinada.`,
    keywords: `pirineos sur ${YEAR}, festival pirineos sur, festival lanuza, sallent de gallego festival, world music pirineos, escenario embalse lanuza, pirineos sur entradas, pirineos sur fechas ${YEAR}, pirineos sur como llegar, pirineos sur desde huesca, pirineos sur desde madrid, pirineos sur desde zaragoza, festival aragon ${YEAR}`,
  },
  "starlite-marbella": {
    title: `Starlite Marbella ${YEAR} [Cantera Nagüeles]: 60+ noches conciertos | ConcertRide`,
    description: `Starlite Catalana Occidente ${YEAR} (13 jun–31 ago, Cantera de Nagüeles Marbella). 60+ noches de conciertos consecutivas en anfiteatro al aire libre tallado en la roca (7.500 plazas). Lenny Kravitz, Tom Jones, Maluma, Pet Shop Boys, Robbie Williams. Carpooling sin comisión desde Málaga (60 km, 3–5€), Mijas (20 km, 3–4€), Fuengirola (25 km, 3–5€), Madrid (575 km, 14–20€). Vuelta nocturna coordinada.`,
    keywords: `starlite marbella ${YEAR}, starlite festival marbella, starlite catalana occidente, cantera de nagueles marbella, starlite entradas, starlite cabezas de cartel, festival marbella verano ${YEAR}, conciertos marbella verano, starlite shuttle, starlite como llegar, starlite desde malaga, costa del sol festivales`,
  },
  "stone-music-festival": {
    title: `Stone & Music ${YEAR} Mérida [Teatro Romano UNESCO] | Carpooling 3€ | ConcertRide`,
    description: `Stone & Music Festival ${YEAR} (jul–sep, Teatro Romano Mérida siglo I a.C.). Conciertos en uno de los pocos espacios romanos en activo del mundo (3.000 plazas). Andrea Bocelli, Sting, Joaquín Sabina, Antonio Orozco, Manuel Carrasco. Carpooling sin comisión desde Cáceres (75 km, 4–6€), Badajoz (60 km, 3–5€), Sevilla (200 km, 6–9€), Madrid (340 km, 10–14€). 0% comisión.`,
    keywords: `stone music festival ${YEAR}, stone music merida, festival merida teatro romano, teatro romano merida conciertos, stone music entradas, festival extremadura ${YEAR}, andrea bocelli merida, sting merida, joaquin sabina merida, conciertos teatro romano, festival merida ${YEAR}`,
  },
  "marenostrum-fuengirola": {
    title: `Marenostrum Fuengirola ${YEAR} [Castle Park]: Carpooling 3€ | ConcertRide`,
    description: `Marenostrum Fuengirola Festival ${YEAR} (15 jun–20 ago, Sohail Castle Park anfiteatro al aire libre junto al castillo árabe del siglo X). 50 Cent, Bryan Adams, Iggy Pop, Tom Jones, Sheryl Crow, Robbie Williams. 15.000 plazas/concierto. Cercanías Renfe C-1 Málaga–Fuengirola (35 min). Carpooling sin comisión desde Málaga (35 km, 3–5€), Mijas (10 km, 3–4€), Marbella (25 km, 3–5€), Granada (130 km, 5–8€).`,
    keywords: `marenostrum fuengirola ${YEAR}, marenostrum castle park, fuengirola castle park festival, sohail castle park conciertos, marenostrum entradas, marenostrum cabezas de cartel, festival fuengirola ${YEAR}, fuengirola conciertos verano, costa del sol festivales, marenostrum como llegar, marenostrum desde malaga, cercanias malaga fuengirola`,
  },
  "tio-pepe-festival": {
    title: `Tío Pepe Festival ${YEAR} Jerez [Bodegas González Byass]: Carpooling 3€ | ConcertRide`,
    description: `Tío Pepe Festival ${YEAR} (25 jun–31 ago, Bodegas González Byass Jerez). Festival íntimo (1.800 plazas) en patio entre barricas históricas del vino de Jerez. Robbie Williams, Pet Shop Boys, Sting, Anastacia, Pablo Alborán, Joaquín Sabina. Entrada incluye copa de Tío Pepe. Carpooling sin comisión desde Cádiz (35 km, 3–5€), Sevilla (95 km, 4–7€), Algeciras (130 km, 5–7€), Madrid (655 km, 16–22€).`,
    keywords: `tio pepe festival ${YEAR}, tio pepe jerez festival, bodegas gonzalez byass conciertos, festival jerez ${YEAR}, festival jerez de la frontera, tio pepe entradas, robbie williams jerez, pet shop boys jerez, sting jerez, festival cadiz ${YEAR}, jerez festival verano`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CITY TITLE/DESCRIPTION IMPROVEMENTS (extends existing cityLandings)
// ─────────────────────────────────────────────────────────────────────────────

export const CITY_SEO_IMPROVEMENTS: Record<string, { title: string; description: string; keywords?: string }> = {
  sevilla: {
    title: `Conciertos en Sevilla ${YEAR} [La Cartuja, FIBES, Icónica + Carpooling 4€] | ConcertRide`,
    description: `Agenda conciertos Sevilla ${YEAR}: Estadio La Cartuja (57.000 plazas — Manuel Carrasco, Guns N' Roses), FIBES (9.500 — conciertos cubiertos), Icónica Fest Plaza España (mayo–jun), Interestelar Charco de la Pava. Carpooling sin comisión desde Cádiz (4€), Huelva (4€), Córdoba (5€), Málaga (7€), Madrid (14€), Granada (8€). Pago Bizum, vuelta de madrugada coordinada.`,
    keywords: `conciertos en Sevilla ${YEAR}, conciertos Sevilla ${NEXT_YEAR}, próximos conciertos Sevilla, conciertos musica sevilla, La Cartuja Sevilla conciertos, FIBES Sevilla conciertos, Interestelar Sevilla, Icónica Sevilla Fest, carpooling Sevilla festivales, viaje compartido Sevilla concierto, conciertos sevilla agenda, conciertos sevilla 2026, agenda conciertos sevilla, concierto sevilla, musica sevilla, conciertos sevilla verano, estadio la cartuja conciertos sevilla, conciertos sevilla mayo junio, conciertos sevilla octubre`,
  },
  donostia: {
    title: `Conciertos en Donostia ${YEAR} [Jazzaldia 22–26 Jul + Carpooling 4€] | ConcertRide`,
    description: `Conciertos en Donostia–San Sebastián ${YEAR}: Heineken Jazzaldia (22–26 jul, 61.ª edición, Plaza Trinidad y Kursaal, entrada gratuita parcial), Donostia Arena (9.000 plazas), Auditorio Kursaal, Teatro Victoria Eugenia. Carpooling sin comisión a BBK Live Bilbao (100 km, 4–7€), Pamplona (90 km, 4–7€), Vitoria (100 km, 4–7€). Pago Bizum.`,
    keywords: `conciertos Donostia ${YEAR}, conciertos San Sebastián, Jazzaldia ${YEAR}, conciertos en donostia, como llegar concierto donostia, carpooling Jazzaldia, conciertos donostia 2026, donostia arena conciertos, kursaal conciertos, victoria eugenia donostia, heineken jazzaldia entradas, agenda conciertos donostia, conciertos san sebastian 2026, jazzaldia san sebastian, conciertos donostia verano`,
  },
  alicante: {
    title: `Conciertos en Alicante ${YEAR} [Plaza Toros + Festivales + Carpooling 3€] | ConcertRide`,
    description: `Agenda de conciertos en Alicante ${YEAR}: Plaza de Toros Alicante (9.000 plazas, programación veraniega), ADDA (1.700) y Pabellón Pitiu Rochel. Carpooling sin comisión a Low Festival Benidorm (45 km, 3–5€), Arenal Sound (115 km, 4–7€), Viña Rock (195 km, 5–8€), Medusa Festival (90 km, 5–7€). Pago directo Bizum o efectivo.`,
    keywords: `conciertos Plaza de Toros Alicante ${YEAR}, conciertos plaza toros alicante, conciertos alicante ${YEAR}, conciertos en Alicante, próximos conciertos Alicante, carpooling Alicante festivales, viaje compartido Alicante Low Festival, alicante festium, agenda conciertos alicante, conciertos alicante 2026, conciertos alicante verano`,
  },
  zaragoza: {
    title: `Conciertos en Zaragoza ${YEAR} [Dani Martín, Vive Latino, Bryan Adams + Carpooling] | ConcertRide`,
    description: `Agenda conciertos Zaragoza ${YEAR}: Dani Martín DOBLE FECHA 22–23 may (Príncipe Felipe), Aitana 10 jul, Vive Latino España 4–5 sep (Recinto Expo, 40.000/día), Bryan Adams 14 nov, Hombres G 21 nov. Carpooling sin comisión desde Madrid (9€, 3h AVE o 3,5h coche), Barcelona (8€, 2h 45min), Pamplona (5€), Valencia (9€), Bilbao (9€). Pago Bizum.`,
    keywords: `conciertos Zaragoza ${YEAR}, conciertos en Zaragoza, próximos conciertos Zaragoza, Pabellón Príncipe Felipe, Dani Martín Zaragoza, Aitana Zaragoza, Vive Latino Zaragoza, Hombres G Zaragoza, Bryan Adams Zaragoza, carpooling Zaragoza festivales, viajes Mad Cool desde Zaragoza, conciertos Zaragoza verano, agenda conciertos zaragoza, conciertos zaragoza septiembre, recinto expo zaragoza, conciertos zaragoza 2026, conciertos zaragoza 2027, agenda musical zaragoza`,
  },
  murcia: {
    title: `Conciertos en Murcia ${YEAR} [SOS 4.8, Víctor Villegas + Carpooling 4€] | ConcertRide`,
    description: `Agenda conciertos Murcia ${YEAR}: SOS 4.8 Festival (Murcia capital, primavera), Auditorio Víctor Villegas (3.000 plazas), Plaza de Toros Murcia, Teatro Romea. Carpooling sin comisión a Medusa Festival Cullera (175 km, 5–8€), Arenal Sound Burriana (250 km, 7–11€), Viña Rock Villarrobledo (155 km, 5–8€), Cala Mijas Málaga (270 km, 8–12€). Pago Bizum, vuelta coordinada.`,
    keywords: `conciertos Murcia ${YEAR}, conciertos en Murcia, SOS 4.8 Murcia, conciertos murcia 2026, conciertos murcia 2027, próximos conciertos murcia, carpooling Murcia festivales, viaje compartido Murcia concierto, conciertos murcia agenda, victor villegas murcia, murcia festivales transporte, murcia musica, sos 4.8 festival murcia, conciertos murcia verano`,
  },
  malaga: {
    title: `Conciertos en Málaga ${YEAR} [Cala Mijas + Marenostrum + Carpooling 3€] | ConcertRide`,
    description: `Conciertos en Málaga ${YEAR}: Cala Mijas Fest (Cortijo Torres, oct), Marenostrum Fuengirola (Castle Park, jul–ago), Festival Granada Sound (130 km, 5–8€), Andalucía Big Festival. Carpooling sin comisión desde Sevilla (6€), Granada (8€), Córdoba (5€), Cádiz (8€), Madrid (14€). Pago Bizum o efectivo.`,
    keywords: `conciertos Málaga ${YEAR}, conciertos en Málaga, Cala Mijas Festival, carpooling Málaga, viaje compartido Costa del Sol, festivales Málaga, conciertos malaga 2026, marenostrum fuengirola, agenda conciertos malaga, malaga festivales verano, malaga conciertos costa del sol`,
  },
  pamplona: {
    title: `Conciertos en Pamplona ${YEAR} [Navarra Arena + Carpooling 4€] | ConcertRide`,
    description: `Conciertos en Pamplona ${YEAR}: Navarra Arena (12.000 plazas), Anaitasuna, Plaza de Toros de Pamplona. Carpooling sin comisión a BBK Live Bilbao (155 km, 5–8€), Jazzaldia Donostia (90 km, 4–7€), Azkena Rock Vitoria (95 km, 4–7€), Mad Cool Madrid (390 km, 11–16€), Vive Latino Zaragoza (177 km, 5–8€). Pago Bizum.`,
    keywords: `conciertos Pamplona ${YEAR}, conciertos en Pamplona, Navarra Arena conciertos, carpooling Pamplona festivales, viaje compartido Pamplona, agenda conciertos pamplona, conciertos pamplona 2026, pamplona BBK Live, navarra conciertos`,
  },
  "a-coruna": {
    title: `Conciertos en A Coruña ${YEAR} [Resurrection Fest + Ortigueira + Carpooling 3€] | ConcertRide`,
    description: `Conciertos en A Coruña ${YEAR}: Coliseum (10.000 plazas), Palexco, Estadio de Riazor. Festivales gallegos accesibles desde A Coruña: Festival de Ortigueira (100 km, 4–7€/asiento, gratis), Resurrection Fest Viveiro (100 km, 4–7€), O Son do Camiño Santiago (75 km, 3–6€). Carpooling sin comisión, pago Bizum o efectivo, vuelta de madrugada coordinada.`,
    keywords: `conciertos A Coruña ${YEAR}, conciertos en A Coruña, carpooling A Coruña Resurrection Fest, viaje compartido A Coruña, agenda conciertos coruña, coliseum a coruña conciertos, riazor conciertos, conciertos coruña 2026, ortigueira desde coruña`,
  },
  vigo: {
    title: `Conciertos en Vigo ${YEAR} [Resurrection Fest + O Son do Camiño + Carpooling 4€] | ConcertRide`,
    description: `Conciertos en Vigo ${YEAR}: Mar de Vigo (recinto principal), Pabellón Multiusos das Travesas, Auditorio Mar de Vigo. Festivales gallegos accesibles: Resurrection Fest Viveiro (200 km, 6–9€), O Son do Camiño Santiago (90 km, 4–7€), Festival de Ortigueira (195 km, 6–9€), Bigsound Vigo (callejero, gratis). Carpooling sin comisión desde A Coruña (4€), Pontevedra (3€), Madrid (16€). Pago Bizum.`,
    keywords: `conciertos Vigo ${YEAR}, conciertos en Vigo, carpooling Vigo festivales, viaje compartido Vigo Resurrection Fest, agenda conciertos vigo, mar de vigo conciertos, multiusos das travesas, conciertos vigo 2026, vigo festivales galicia, bigsound vigo`,
  },
  bilbao: {
    title: `Conciertos en Bilbao ${YEAR} [BBK Live + Euskalduna + Carpooling 3€] | ConcertRide`,
    description: `Conciertos en Bilbao ${YEAR}: BBK Live (Kobetamendi, 9–11 jul, 30.000 pers/día), Bilbao Arena Miribilla (10.000), Palacio Euskalduna, Sala BBK. Music Legends Festival (jul). Carpooling sin comisión desde Madrid (11–16€), Donostia (4–7€), Vitoria (3–6€), Santander (4–7€), Pamplona (5–8€), Burgos (5–8€). Lanzadera gratis al BBK Live.`,
    keywords: `conciertos Bilbao ${YEAR}, BBK Live Bilbao, conciertos en Bilbao, Palacio Euskalduna, carpooling Bilbao festivales, viaje compartido Bilbao, agenda conciertos bilbao, bilbao arena miribilla, music legends bilbao, conciertos bilbao 2026, festival bilbao`,
  },
  barcelona: {
    title: `[${YEAR}] Conciertos Barcelona: Primavera Sound, Sónar, Cruïlla + Carpooling desde 5€ | ConcertRide`,
    description: `Conciertos en Barcelona ${YEAR}: Primavera Sound (mayo–junio), Sónar (junio), Cruïlla (julio). Carpooling sin comisión desde Madrid (22€), Valencia (14€), Zaragoza (14€).`,
    keywords: `conciertos Barcelona ${YEAR}, conciertos en Barcelona, Primavera Sound, Sónar Barcelona, carpooling Barcelona festivales, viaje compartido Barcelona`,
  },
  valencia: {
    title: `Conciertos en Valencia ${YEAR} [Zevra + Arenal Sound + Medusa + Carpooling 3€] | ConcertRide`,
    description: `Conciertos en Valencia ${YEAR}: Zevra Festival (La Marina, jul), Arenal Sound (Burriana, 65 km), Medusa Festival (Cullera, 60 km), FIB (Benicàssim, 75 km). Recintos urbanos: Roig Arena, Plaza de Toros Valencia, Auditorio Palau Música. Carpooling sin comisión desde Barcelona (10–14€), Madrid (10–14€), Alicante (5–8€), Castellón (3–5€). Pago Bizum o efectivo.`,
    keywords: `conciertos Valencia ${YEAR}, conciertos en Valencia, Zevra Festival, Arenal Sound Valencia, carpooling Valencia festivales, viaje compartido Valencia, agenda conciertos valencia, conciertos valencia 2026, valencia festivales verano, roig arena valencia`,
  },
  madrid: {
    title: `[${YEAR}] Conciertos Madrid: Mad Cool, Tomavistas, WiZink + Carpooling desde 4€ | ConcertRide`,
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
  "santiago-de-compostela": {
    title: `Conciertos Santiago de Compostela ${YEAR}: O Son do Camiño + Carpooling | ConcertRide`,
    description: `Conciertos en Santiago de Compostela ${YEAR}: Multiusos do Sar, Auditorio de Galicia. Festival principal: O Son do Camiño (Monte do Gozo, 18–20 jun, 90.000 asistentes). Carpooling desde A Coruña (75 km, 3–6€), Vigo (90 km, 4–7€), Pontevedra (55 km, 3–5€), Ourense (110 km, 5–8€), Oviedo (295 km, 9–12€), Madrid (585 km, 15–20€) sin comisión.`,
    keywords: `conciertos Santiago de Compostela ${YEAR}, conciertos en Santiago, O Son do Camiño Santiago, Monte do Gozo carpooling, carpooling Santiago festivales, viaje compartido Santiago Galicia, conciertos Santiago Galicia ${YEAR}`,
  },
  pontevedra: {
    title: `Conciertos Pontevedra ${YEAR}: Carpooling a O Son do Camiño y Resurrection Fest | ConcertRide`,
    description: `Conciertos en Pontevedra ${YEAR}: Pazo da Cultura, Recinto Ferial. Carpooling a O Son do Camiño Santiago (55 km, 3–5€), Resurrection Fest Viveiro (180 km, 6–9€), Atlantic Fest Vilagarcía (35 km, 3–5€) sin comisión.`,
    keywords: `conciertos Pontevedra ${YEAR}, conciertos en Pontevedra, carpooling Pontevedra Santiago, viaje compartido Pontevedra O Son do Camiño, Pontevedra Resurrection Fest carpooling, festivales Galicia Pontevedra`,
  },
  lugo: {
    title: `Conciertos Lugo ${YEAR}: Carpooling a Resurrection Fest y O Son do Camiño | ConcertRide`,
    description: `Conciertos en Lugo ${YEAR}: Pazo de Feiras e Congresos, Auditorio Gustavo Freire. Lugo es la ciudad gallega más cercana a Resurrection Fest Viveiro (95 km, 4–7€). Carpooling a O Son do Camiño Santiago (105 km, 4–7€), Caudal Fest Lugo (en la propia ciudad) sin comisión.`,
    keywords: `conciertos Lugo ${YEAR}, conciertos en Lugo, Resurrection Fest desde Lugo, carpooling Lugo Viveiro, viaje compartido Lugo Galicia festivales, Caudal Fest Lugo, Lugo carpooling festival`,
  },
  oviedo: {
    title: `Conciertos Oviedo ${YEAR}: Carpooling a O Son do Camiño y Resurrection Fest | ConcertRide`,
    description: `Conciertos en Oviedo ${YEAR}: Palacio de los Deportes, Teatro Campoamor, Plaza de Toros. Carpooling a O Son do Camiño Santiago (295 km, 9–12€), Resurrection Fest Viveiro (190 km, 7–10€), BBK Live Bilbao (305 km, 9–13€), Mad Cool Madrid (450 km, 13–18€) sin comisión.`,
    keywords: `conciertos Oviedo ${YEAR}, conciertos en Oviedo, conciertos Asturias ${YEAR}, carpooling Oviedo festivales, viaje compartido Oviedo Galicia, Oviedo BBK Live carpooling, Oviedo Resurrection Fest`,
  },
  gijon: {
    title: `Conciertos Gijón ${YEAR}: Metrópoli Gijón + Carpooling a festivales | ConcertRide`,
    description: `Conciertos en Gijón ${YEAR}: Festival Internacional Metrópoli Gijón (julio), Plaza de Toros El Bibio. Carpooling a Resurrection Fest Viveiro (180 km, 6–9€), BBK Live Bilbao (290 km, 9–13€), O Son do Camiño Santiago (310 km, 9–13€) sin comisión.`,
    keywords: `conciertos Gijón ${YEAR}, conciertos en Gijón, Metrópoli Gijón ${YEAR}, carpooling Gijón festivales, viaje compartido Gijón Asturias, Gijón Resurrection Fest carpooling`,
  },
  castellon: {
    title: `Conciertos en Castellón ${YEAR} [Arenal Sound + FIB + Carpooling 3€] | ConcertRide`,
    description: `Conciertos en Castellón ${YEAR}: festivales junto a casa — Arenal Sound Burriana (10 km, lanzadera oficial 5–8€), FIB Benicàssim (15 km, Cercanías 1,75€). Recintos urbanos: Auditori i Palau de Congressos, Plaza de Toros Castellón. Carpooling sin comisión desde Valencia (3–5€), Madrid (12–17€), Barcelona (8–12€), Tarragona (5–8€). Pago Bizum o efectivo.`,
    keywords: `conciertos Castellón ${YEAR}, conciertos en castellon, conciertos castellón 2026, agenda conciertos castellon, arenal sound castellon, fib castellon, lanzadera arenal sound, festivales castellon, castellon de la plana conciertos, castellon festivales transporte`,
  },
  tarragona: {
    title: `Conciertos en Tarragona ${YEAR} [Reggaeton Beach + Carpooling a Barcelona] | ConcertRide`,
    description: `Conciertos en Tarragona ${YEAR}: Reggaeton Beach Festival Salou (jul), Tarraco Arena Plaça, Auditori Diputació. Carpooling sin comisión a Cruïlla Barcelona (105 km, 5–8€), Sónar (105 km, 5–8€), Primavera Sound (105 km, 5–8€), FIB Benicàssim (200 km, 6–9€). Pago Bizum o efectivo, vuelta nocturna coordinada.`,
    keywords: `conciertos Tarragona ${YEAR}, conciertos en tarragona, conciertos tarragona 2026, agenda conciertos tarragona, reggaeton beach festival salou, tarraco arena conciertos, tarragona festivales catalanes, salou festival, conciertos costa daurada`,
  },
  // ── Wave 9 — 26 nuevas ciudades, festival-venue cities + Canarias ─────────
  "las-palmas-de-gran-canaria": {
    title: `Conciertos en Las Palmas de Gran Canaria ${YEAR} [Womad + Festivales + Carpooling] | ConcertRide`,
    description: `Conciertos en Las Palmas ${YEAR}: Gran Canaria Arena (12.000 plazas), Auditorio Alfredo Kraus, Plaza de la Música. Festival propio: Womad Las Palmas (noviembre, gratuito Parque Santa Catalina). Para festivales peninsulares: vuelo a Madrid/Barcelona + carpooling ConcertRide al recinto. Ferry interinsular a Tenerife (1h) o avión (35 min). 0% comisión.`,
    keywords: `conciertos Las Palmas ${YEAR}, conciertos en gran canaria, conciertos canarias, womad las palmas, gran canaria arena conciertos, alfredo kraus conciertos, festivales canarias, conciertos las palmas 2026`,
  },
  "santa-cruz-de-tenerife": {
    title: `Conciertos en Santa Cruz de Tenerife ${YEAR} [Carnaval + Festivales] | ConcertRide`,
    description: `Conciertos en Santa Cruz de Tenerife ${YEAR}: Auditorio Adán Martín, Pabellón Santiago Martín (5.500 plazas), Plaza de España. Carnaval de Santa Cruz (febrero, segundo más grande del mundo, conciertos urbanos masivos gratuitos). Para festivales peninsulares: vuelo a Madrid/Barcelona + carpooling ConcertRide. Ferry o avión a Las Palmas. Sin comisión.`,
    keywords: `conciertos Tenerife ${YEAR}, conciertos santa cruz tenerife, carnaval santa cruz tenerife, conciertos canarias, auditorio adan martin, festivales tenerife, agenda conciertos tenerife`,
  },
  cartagena: {
    title: `Conciertos en Cartagena ${YEAR} [La Mar de Músicas + Carpooling 5€] | ConcertRide`,
    description: `Conciertos en Cartagena ${YEAR}: La Mar de Músicas Festival (julio, world music, 25 ediciones), Cartagena Jazz Festival (noviembre), Plaza de Toros (12.000 plazas), Auditorio El Batel. Carpooling sin comisión a Medusa Festival Cullera (175 km, 5–8€), Cala Mijas (290 km, 8–11€), Viña Rock (220 km, 7–10€), Mad Cool Madrid (445 km, 13–17€). Pago Bizum.`,
    keywords: `conciertos Cartagena ${YEAR}, conciertos en Cartagena, La Mar de Musicas Cartagena, Cartagena Jazz Festival, plaza toros cartagena, auditorio el batel, carpooling Cartagena festivales`,
  },
  "jerez-de-la-frontera": {
    title: `Conciertos en Jerez de la Frontera ${YEAR} [Tío Pepe Festival + Carpooling] | ConcertRide`,
    description: `Conciertos en Jerez ${YEAR}: Tío Pepe Festival (julio–agosto, Bodegas González Byass, Pet Shop Boys/Robbie Williams), Festival de Jerez flamenco (feb–mar, 3 semanas), Circuito de Jerez (festival, hasta 30.000 personas), Teatro Villamarta. Carpooling ConcertRide a La Cartuja Sevilla (95 km, 4–7€), Cala Mijas (235 km, 7–11€), Mad Cool Madrid (655 km, 16–22€). Sin comisión.`,
    keywords: `conciertos Jerez ${YEAR}, conciertos en jerez de la frontera, tio pepe festival jerez, festival flamenco jerez, circuito jerez conciertos, conciertos cadiz provincia, agenda conciertos jerez`,
  },
  elche: {
    title: `Conciertos en Elche ${YEAR} [Festival Elx + Carpooling 4€] | ConcertRide`,
    description: `Conciertos en Elche ${YEAR}: Festival Elx (julio, mediterráneo), Pabellón Esperanza Lag (5.000), Auditorio Centro de Congresos. Carpooling sin comisión a Low Festival Benidorm (75 km, 4–7€), Arenal Sound Burriana (135 km, 5–8€), Medusa Cullera (135 km, 5–8€), FIB Benicàssim (215 km, 6–9€). Densidad alta de viajes Elche–Alicante (25 km, 3–4€). Pago Bizum o efectivo.`,
    keywords: `conciertos Elche ${YEAR}, conciertos en elx, festival elx, conciertos en elche 2026, conciertos alicante provincia, carpooling elche festivales, agenda conciertos elche`,
  },
  "aranda-de-duero": {
    title: `Conciertos en Aranda de Duero ${YEAR} [Sonorama Ribera + Carpooling] | ConcertRide`,
    description: `Aranda de Duero (Burgos): sede de Sonorama Ribera ${YEAR} (6–9 ago, 75.000 asistentes/día). Plaza del Trigo y casco histórico. Sin estación de tren — carpooling es la opción dominante. Bus La Sepulvedana Madrid–Aranda (10–15€). Carpooling ConcertRide desde Madrid (5–8€, 160 km), Burgos (3–6€), Valladolid (4–7€), Bilbao (5–8€), Zaragoza (9–12€). Vuelta de madrugada coordinada. 0% comisión.`,
    keywords: `Sonorama Ribera ${YEAR}, conciertos Aranda de Duero, aranda de duero sonorama, plaza del trigo sonorama, sonorama ribera carpooling, sonorama desde madrid, conciertos aranda duero burgos`,
  },
  burriana: {
    title: `Conciertos en Burriana ${YEAR} [Arenal Sound + Lanzadera + Carpooling] | ConcertRide`,
    description: `Burriana (Castellón): sede de Arenal Sound ${YEAR} (29 jul–2 ago, 250.000 asistentes acumulados, 5 días). Recinto en la Playa de Burriana. Bus lanzadera oficial Castellón→Burriana (5–8€, 20 min) y Cercanías Renfe C6 Valencia–Castellón + lanzadera. Carpooling ConcertRide directo al recinto: Castellón (3–5€), Valencia (3–6€), Madrid (12–17€), Barcelona (8–12€), Alicante (4–7€). Camping oficial Beach Camp + libre. Sin comisión.`,
    keywords: `Arenal Sound Burriana, conciertos burriana, burriana arenal sound, playa burriana arenal sound, lanzadera arenal sound burriana, autobus castellon burriana, arenal sound desde valencia, beach camp burriana`,
  },
  mijas: {
    title: `Conciertos en Mijas ${YEAR} [Cala Mijas Festival + Carpooling 3€] | ConcertRide`,
    description: `Mijas (Málaga): sede de Cala Mijas Festival ${YEAR} (2–4 oct, Cortijo de Torres). 90.000 asistentes acumulados. Sin shuttle oficial al Cortijo — carpooling es la opción dominante. Carpooling ConcertRide al Cortijo de Torres desde Málaga (3–5€, 25 km), Marbella (3–6€, 20 km), Fuengirola (3–5€, 10 km), Granada (5–8€, 130 km), Sevilla (7–11€), Madrid (14–20€). 0% comisión, vuelta nocturna coordinada.`,
    keywords: `Cala Mijas Festival, conciertos en Mijas, mijas pueblo conciertos, cortijo de torres mijas, cala mijas como llegar, mijas costa del sol, carpooling mijas festival`,
  },
  marbella: {
    title: `Conciertos en Marbella ${YEAR} [Starlite Festival + Carpooling Costa del Sol] | ConcertRide`,
    description: `Conciertos en Marbella ${YEAR}: Starlite Festival (Cantera de Nagüeles, jul–ago, anfiteatro 7.500 plazas, cabezas de cartel internacionales todo el verano). Marbella Music Pavillion. Carpooling ConcertRide a Cala Mijas Cortijo de Torres (20 km, 3–6€), La Cartuja Sevilla (210 km, 7–10€), Mad Cool Madrid (575 km, 14–20€). Densidad alta Marbella–Málaga (60 km, 3–5€). 0% comisión.`,
    keywords: `Starlite Festival Marbella, conciertos en Marbella, cantera de nagueles, marbella conciertos verano, conciertos costa del sol, carpooling marbella, starlite cabezas de cartel`,
  },
  fuengirola: {
    title: `Conciertos en Fuengirola ${YEAR} [Marenostrum Castle Park + Carpooling] | ConcertRide`,
    description: `Conciertos en Fuengirola (Málaga) ${YEAR}: Marenostrum Fuengirola Festival en Sohail Castle Park (jul–ago, 15.000 plazas, 50 Cent/Bryan Adams/Iggy Pop). Cercanías Renfe C-1 Málaga–Fuengirola (35 min). Carpooling ConcertRide a Cala Mijas Cortijo de Torres (10 km, 3–5€) — la ruta más utilizada. Marbella (25 km, 3–5€), Granada (130 km, 5–8€), Sevilla (220 km, 7–11€). Sin comisión.`,
    keywords: `Marenostrum Fuengirola, conciertos Fuengirola, sohail castle park, fuengirola castle park festival, cercanias malaga fuengirola, fuengirola cala mijas, carpooling costa del sol fuengirola`,
  },
  merida: {
    title: `Conciertos en Mérida ${YEAR} [Stone & Music Teatro Romano + Carpooling] | ConcertRide`,
    description: `Conciertos en Mérida ${YEAR}: Stone & Music Festival en el Teatro Romano de Mérida (siglo I a.C., 7.000 plazas, conciertos pop/rock con cabezas de cartel internacionales). Festival Internacional de Teatro Clásico (jul–ago, 74 ediciones). Carpooling ConcertRide al Teatro Romano desde Cáceres (75 km, 4–6€), Badajoz (60 km, 3–5€), Sevilla (200 km, 6–9€), Madrid (340 km, 10–14€). Sin comisión.`,
    keywords: `Stone Music Festival Merida, conciertos teatro romano merida, festival merida teatro clasico, conciertos extremadura, conciertos en merida 2026, carpooling merida festival`,
  },
  ibiza: {
    title: `Conciertos en Ibiza ${YEAR} [Ushuaïa, Hï, Pacha + Carpooling Eivissa] | ConcertRide`,
    description: `Eivissa/Ibiza ${YEAR}: David Guetta y Calvin Harris en residencias semanales — Ushuaïa (open-air, 7.000 plazas), Hï Ibiza, Pacha, Amnesia, DC10. International Music Summit (mayo). Conexión península: ferry Barcelona (8h, 30–60€) y Valencia (5h, 25–55€); avión Madrid/Barcelona (1h, 60–120€). Carpooling ConcertRide en isla: Eivissa–Sant Antoni (15 km), Ibiza ciudad–Es Canar. Sin comisión.`,
    keywords: `conciertos Ibiza ${YEAR}, ushuaia ibiza, hi ibiza, pacha ibiza, david guetta ibiza, calvin harris ibiza, conciertos eivissa, festivales ibiza electronica, ferry barcelona ibiza, eivissa carpooling`,
  },
  sabadell: {
    title: `Conciertos en Sabadell ${YEAR} [Embassa't + Carpooling a Barcelona 3€] | ConcertRide`,
    description: `Conciertos en Sabadell (Barcelona) ${YEAR}: Embassa't Festival (junio, indie/electrónica Parc de Catalunya), Pavelló Olímpic, Teatre La Faràndula. Renfe Cercanías Sabadell–Barcelona (30 min). Carpooling sin comisión a Primavera Sound (30 km, 3–5€), Cruïlla, Sónar (30 km, 3–5€), FIB (335 km, 9–13€). Pago Bizum o efectivo, vuelta nocturna.`,
    keywords: `conciertos Sabadell, embassa't festival sabadell, pavellon olimpic sabadell, sabadell barcelona conciertos, carpooling vallés occidental, festivales catalanes sabadell`,
  },
  terrassa: {
    title: `Conciertos en Terrassa ${YEAR} [Festival de Jazz + Carpooling a Barcelona] | ConcertRide`,
    description: `Conciertos en Terrassa (Barcelona) ${YEAR}: Festival de Jazz de Terrassa (marzo, 45 ediciones, Pat Metheny, Brad Mehldau), Centre Cultural Terrassa, Auditori Vallès. Renfe R4 Terrassa–Barcelona (50 min). Carpooling ConcertRide a Primavera Sound (30 km, 3–5€), Cruïlla, Sónar (30 km, 3–5€). Sin comisión.`,
    keywords: `conciertos Terrassa, festival jazz terrassa, jazz terrassa cataluña, terrassa barcelona carpooling, terrassa centre cultural, festivales catalanes`,
  },
  mataro: {
    title: `Conciertos en Mataró ${YEAR} [Maresme + Carpooling a Barcelona 3€] | ConcertRide`,
    description: `Conciertos en Mataró (Maresme) ${YEAR}: Teatre Monumental, Pavelló de Mataró, Maresme Music Days (verano gratuito). Renfe R1 Cercanías Mataró–Barcelona (40 min, 4€). Carpooling ConcertRide a Primavera Sound Barcelona (35 km, 3–5€), Cruïlla, Sónar, Girona (75 km, 4–6€). Vuelta nocturna coordinada — el último Cercanías sale antes del fin de los festivales del Fòrum. Sin comisión.`,
    keywords: `conciertos Mataró, maresme music days, conciertos maresme, mataro barcelona carpooling, festivales costa catalana, mataro festivales`,
  },
  reus: {
    title: `Conciertos en Reus ${YEAR} [Trapezi + Carpooling a Barcelona] | ConcertRide`,
    description: `Conciertos en Reus (Tarragona) ${YEAR}: Festival Trapezi (mayo, circo contemporáneo), Teatre Bartrina, Pavelló Olímpic. Aeropuerto de Reus con vuelos low-cost. Carpooling ConcertRide a Primavera Sound Barcelona (110 km, 5–8€), Cruïlla (110 km, 5–8€), Sónar (110 km, 5–8€), FIB Benicàssim (190 km, 6–9€). Sin comisión, pago Bizum.`,
    keywords: `conciertos Reus, festival trapezi reus, conciertos tarragona provincia, teatre bartrina reus, reus barcelona carpooling, costa daurada conciertos`,
  },
  manresa: {
    title: `Conciertos en Manresa ${YEAR} [Hipnotik + Carpooling Barcelona y Pirineos] | ConcertRide`,
    description: `Conciertos en Manresa (Bages, Barcelona) ${YEAR}: Hipnotik Festival (junio, hip-hop), Kursaal de Manresa, Nou Congost. Renfe R4 Manresa–Barcelona (1h 30 min). Carpooling ConcertRide a Primavera Sound (75 km, 4–6€), Cruïlla, Sónar (75 km, 4–6€), Pirineos Sur Lanuza (170 km, 6–9€), FIB Benicàssim (245 km, 7–10€). Sin comisión.`,
    keywords: `conciertos Manresa, hipnotik festival manresa, kursaal manresa, manresa barcelona carpooling, bages festival, festivales catalanes`,
  },
  huesca: {
    title: `Conciertos en Huesca ${YEAR} [Periferias + Pirineos Sur + Carpooling] | ConcertRide`,
    description: `Conciertos en Huesca ${YEAR}: Periferias Festival (otoño, world music), Festival Cine Huesca (junio), Palacio de Congresos, Pabellón Polideportivo. Hub para Pirineos Sur Festival (Lanuza, 75 km, world music en mitad del Pirineo). Carpooling ConcertRide a Vive Latino España Zaragoza (75 km, 3–5€), Pirineos Sur (75 km, 3–5€), Mad Cool Madrid (390 km, 11–16€), Primavera Sound Barcelona (380 km, 11–16€). Sin comisión.`,
    keywords: `conciertos Huesca, periferias festival huesca, pirineos sur lanuza, festival cine huesca, huesca conciertos 2026, aragon festivales pirineo, carpooling huesca`,
  },
  benidorm: {
    title: `Conciertos en Benidorm ${YEAR} [Low Festival + Benidorm Fest + Carpooling 3€] | ConcertRide`,
    description: `Conciertos en Benidorm (Alicante) ${YEAR}: Low Festival (24–26 jul, 65.000 asistentes acumulados, Ciudad Deportiva Guillermo Amor), Benidorm Fest (febrero, eurovisión nacional), Benidorm Pride (septiembre). TRAM L1 Alicante–Benidorm (1h, 4€). Carpooling ConcertRide al Low Festival desde Alicante (45 km, 3–5€), Valencia (150 km, 5–8€), Madrid (420 km, 12–17€), Barcelona (480 km, 13–18€). Sin comisión, vuelta nocturna.`,
    keywords: `conciertos Benidorm, low festival benidorm, benidorm fest, benidorm pride, ciudad deportiva guillermo amor, low festival como llegar, costa blanca festivales`,
  },
  algeciras: {
    title: `Conciertos en Algeciras ${YEAR} [Entre Dos Continentes + Carpooling] | ConcertRide`,
    description: `Conciertos en Algeciras (Cádiz) ${YEAR}: Algeciras Entre Dos Continentes (junio, world music), Palacio de los Deportes Las Palmeras, Plaza de Toros Las Palomas. Carpooling ConcertRide a La Cartuja Sevilla (175 km, 5–8€), Cala Mijas Festival (105 km, 5–7€), Cádiz (130 km, 5–7€), Granada (220 km, 7–10€), Mad Cool Madrid (660 km, 17–22€). Sin comisión, vuelta nocturna.`,
    keywords: `conciertos Algeciras, algeciras entre dos continentes, algeciras conciertos, conciertos campo gibraltar, carpooling andalucia algeciras, algeciras festivales`,
  },
  aviles: {
    title: `Conciertos en Avilés ${YEAR} [Centro Niemeyer + Carpooling Asturias] | ConcertRide`,
    description: `Conciertos en Avilés (Asturias) ${YEAR}: Centro Niemeyer (Oscar Niemeyer, plaza para 8.000 personas), Plaza de España, Pabellón Quirinal. Festival propio: Celsius (julio, literatura fantástica). Carpooling ConcertRide a Metrópoli Gijón (25 km, 3–4€), BBK Live Bilbao (270 km, 9–12€), Resurrection Fest Viveiro (210 km, 7–10€), O Son do Camiño Santiago (310 km, 10–13€). Sin comisión.`,
    keywords: `conciertos Avilés, centro niemeyer aviles, aviles festivales, conciertos asturias, aviles bbk live carpooling, festival celsius aviles`,
  },
  ponferrada: {
    title: `Conciertos en Ponferrada ${YEAR} [Bierzo + Carpooling Galicia y Madrid] | ConcertRide`,
    description: `Conciertos en Ponferrada (León) ${YEAR}: Pabellón Lydia Valentín, Castillo de los Templarios (escenario urbano), Festival 2 días Ponferrada (verano). Hub estratégico de El Bierzo. Carpooling ConcertRide a O Son do Camiño Santiago (210 km, 7–10€), Resurrection Fest Viveiro (250 km, 8–11€), BBK Live Bilbao (370 km, 11–15€), Mad Cool Madrid (390 km, 11–16€). Sin comisión.`,
    keywords: `conciertos Ponferrada, ponferrada bierzo conciertos, castillo templarios ponferrada, festival 2 dias ponferrada, conciertos leon provincia, carpooling ponferrada galicia`,
  },
  "talavera-de-la-reina": {
    title: `Conciertos en Talavera de la Reina ${YEAR} [Mondas + Carpooling 5€] | ConcertRide`,
    description: `Conciertos en Talavera de la Reina (Toledo) ${YEAR}: Palacio de Ferias y Congresos, Plaza de Toros La Caprichosa, Mondas Talavera (septiembre, fiestas mayores con conciertos urbanos). A 120 km de Madrid (1h 15 min, A-5). Carpooling ConcertRide a Mad Cool Madrid (120 km, 5–7€), Viña Rock Villarrobledo (180 km, 6–9€), Cala Mijas (475 km, 13–18€), La Cartuja Sevilla (380 km, 11–15€). Sin comisión.`,
    keywords: `conciertos Talavera de la Reina, mondas talavera, talavera reina conciertos, conciertos toledo provincia, carpooling talavera mad cool`,
  },
  mostoles: {
    title: `Conciertos en Móstoles ${YEAR} [Carpooling a Mad Cool y Tomavistas 3€] | ConcertRide`,
    description: `Conciertos en Móstoles (Madrid) ${YEAR}: Pabellón Andrés Torrejón, Teatro del Bosque. Cercanías Renfe C-5 (25 min) y Metro Sur L12. Hub de carpooling para asistentes del cinturón sur de Madrid. Carpooling ConcertRide a Mad Cool IFEMA (35 km, 3–5€), Tomavistas Retiro (25 km, 3–5€), Viña Rock Villarrobledo (245 km, 7–10€), Sonorama Aranda (180 km, 6–9€). Sin comisión.`,
    keywords: `conciertos Mostoles, conciertos en mostoles, mostoles madrid carpooling, mostoles mad cool, andres torrejon mostoles, cinturon sur madrid carpooling`,
  },
  "alcala-de-henares": {
    title: `Conciertos en Alcalá de Henares ${YEAR} [Don Juan + Carpooling Mad Cool] | ConcertRide`,
    description: `Conciertos en Alcalá de Henares (Madrid) ${YEAR}: Teatro Salón Cervantes, Plaza de Cervantes (escenarios al aire libre, 8.000 personas), Festival Don Juan en Alcalá (octubre), Festival Sefarad (julio), Festival de la Palabra. Cercanías Renfe C-2/C-7 (35 min, 4€). Carpooling ConcertRide a Mad Cool IFEMA (25 km, 3–5€), Sonorama Aranda (130 km, 5–8€), Viña Rock Villarrobledo (240 km, 7–10€). Sin comisión.`,
    keywords: `conciertos Alcala de Henares, don juan en alcala, festival sefarad, conciertos alcala madrid, alcala henares carpooling, alcala mad cool`,
  },
  getafe: {
    title: `Conciertos en Getafe ${YEAR} [Coliseum + Carpooling Madrid 3€] | ConcertRide`,
    description: `Conciertos en Getafe (Madrid) ${YEAR}: Coliseum Alfonso Pérez (estadio del Getafe CF, eventos music & lifestyle), Pabellón Juan de la Cierva, Centro Cultural García Lorca. Cercanías C-3/C-4 (20 min) y Metro Sur L12. Carpooling ConcertRide a Mad Cool IFEMA (30 km, 3–5€), Tomavistas (25 km, 3–5€), Viña Rock Villarrobledo (235 km, 7–10€), Cala Mijas (555 km, 14–20€). Sin comisión.`,
    keywords: `conciertos Getafe, coliseum alfonso perez conciertos, getafe madrid carpooling, getafe mad cool, getafe cf eventos`,
  },
  gandia: {
    title: `Conciertos en Gandia ${YEAR} [Polifònic + Carpooling La Safor] | ConcertRide`,
    description: `Conciertos en Gandia (Valencia) ${YEAR}: Polifònic Festival (julio, indie/pop, formato playa), Tu Otro Verano Music Festival, Auditori del Raval, Pavelló Esportiu. Cercanías Renfe C1 Valencia–Gandia (1h, 4,90€). Carpooling ConcertRide a Festival de les Arts Valencia (65 km, 3–5€), Zevra Festival La Marina (60 km, 3–5€), Medusa Cullera (15 km, 3–4€), Arenal Sound Burriana (130 km, 5–8€). Sin comisión.`,
    keywords: `conciertos Gandia, polifonic festival gandia, gandia valencia conciertos, gandia medusa festival, la safor festivales, gandia carpooling`,
  },
  leon: {
    title: `Conciertos en León ${YEAR}: Carpooling a Sonorama y Resurrection Fest | ConcertRide`,
    description: `Conciertos en León ${YEAR}: Palacio Municipal de los Deportes, Auditorio Ciudad de León. Carpooling a Resurrection Fest Viveiro (400 km, 11–16€), Sonorama Ribera Aranda (280 km, 8–12€), BBK Live Bilbao (350 km, 10–14€), Mad Cool Madrid (330 km, 9–14€) sin comisión.`,
    keywords: `conciertos León ${YEAR}, conciertos en León, León festivales carpooling, viaje compartido León Resurrection Fest, León BBK Live carpooling, conciertos leon 2026`,
  },
  "valladolid-upgrade": {
    title: `Conciertos Valladolid ${YEAR}: Sonorama + BBK Live + Carpooling desde 4€ | ConcertRide`,
    description: `Agenda conciertos Valladolid ${YEAR}: Sala Porta Caeli, Auditorio Miguel Delibes. Carpooling a Sonorama Ribera (60 km, 4–7€), BBK Live (290 km, 8–13€), Mad Cool (195 km, 6–10€) sin comisión. Valladolid es el hub ideal para Sonorama Ribera.`,
    keywords: `conciertos Valladolid ${YEAR}, conciertos en Valladolid, Sonorama desde Valladolid, carpooling Valladolid festivales, valladolid bbk live carpooling, conciertos valladolid 2026`,
  },
  cadiz: {
    title: `Conciertos en Cádiz ${YEAR}: Carpooling a Tío Pepe Festival y La Cartuja | ConcertRide`,
    description: `Conciertos en Cádiz ${YEAR}: Gran Teatro Falla, Estadio Carranza. Carpooling a Tío Pepe Festival Jerez (35 km, 3–5€), Estadio La Cartuja Sevilla (125 km, 5–8€), Cala Mijas Málaga (180 km, 6–9€), Mad Cool Madrid (660 km, 16–22€) sin comisión.`,
    keywords: `conciertos Cádiz ${YEAR}, conciertos en Cádiz, Tío Pepe Festival desde Cádiz, carpooling Cádiz festivales, cádiz sevilla concierto, conciertos cadiz 2026`,
  },
  huelva: {
    title: `Conciertos en Huelva ${YEAR}: Carpooling a Cala Mijas y La Cartuja Sevilla | ConcertRide`,
    description: `Conciertos en Huelva ${YEAR}: Palacio de los Deportes, Plaza de Toros Huelva. Carpooling a Estadio La Cartuja Sevilla (85 km, 4–6€), Cala Mijas Málaga (220 km, 7–10€), Mad Cool Madrid (565 km, 14–20€) sin comisión.`,
    keywords: `conciertos Huelva ${YEAR}, conciertos en Huelva, La Cartuja desde Huelva, carpooling Huelva festivales, conciertos huelva 2026, huelva sevilla festival`,
  },
  jaen: {
    title: `Conciertos en Jaén ${YEAR}: Carpooling a Granada Sound y Cala Mijas | ConcertRide`,
    description: `Conciertos en Jaén ${YEAR}: Auditorio Municipal Ciudad de Jaén, Estadio de La Victoria. Carpooling a Granada Sound (95 km, 4–7€), Cala Mijas Málaga (160 km, 5–8€), Estadio La Cartuja Sevilla (180 km, 6–9€), Mad Cool Madrid (380 km, 11–16€) sin comisión.`,
    keywords: `conciertos Jaén ${YEAR}, conciertos en Jaén, Granada Sound desde Jaén, carpooling Jaén festivales, conciertos jaen 2026, jaen cala mijas carpooling`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// "CÓMO LLEGAR" PAGE DESCRIPTIONS (used by HowToGetTherePage.tsx)
// ─────────────────────────────────────────────────────────────────────────────

export const HOW_TO_GET_THERE_SEO: Record<string, { title: string; description: string; keywords?: string }> = {
  "arenal-sound": {
    title: `Cómo llegar a Arenal Sound ${YEAR} [Buses Castellón, Tren y Carpooling] | ConcertRide`,
    description: `Guía completa Arenal Sound ${YEAR} Burriana (Castellón): bus lanzadera oficial Castellón→Burriana (5–8€, cada 30 min desde 16:00), tren Cercanías C6 Valencia–Castellón (45 min, 3,90€ + bus local). Carpooling sin comisión desde Valencia (3–6€), Castellón (3–5€), Alicante (4–7€), Madrid (12–17€), Barcelona (8–12€). Vuelta de madrugada coordinada.`,
    keywords: `como llegar arenal sound ${YEAR}, arenal sound transporte, autobus castellon burriana arenal sound, tren arenal sound, arenal sound bus, arenal sound localización, como ir al arenal sound, arenal sound autobuses, buses arenal sound castellon, arenal sound desde valencia, arenal sound desde madrid, arenal sound shuttle, arenal sound como llegar desde castellon`,
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
  "festival-ortigueira": {
    title: `Cómo llegar al Festival de Ortigueira ${YEAR}: bus, coche y carpooling | ConcertRide`,
    description: `Festival Internacional do Mundo Celta de Ortigueira ${YEAR} (A Coruña): sin estación de tren propia. ALSA desde A Coruña/Lugo + carpooling ConcertRide desde A Coruña (100 km, 4–7€), Lugo (110 km, 4–7€), Vigo (195 km, 6–9€), Madrid (690 km, 18–25€). Camping libre y gratuito. Sin comisión.`,
    keywords: `como llegar festival ortigueira ${YEAR}, ortigueira transporte, festival ortigueira bus, ortigueira como ir, festival ortigueira carpooling, ortigueira camping, festival ortigueira gratis, mundo celta ortigueira como llegar`,
  },
  "jazzaldia": {
    title: `Cómo llegar al Jazzaldia ${YEAR} San Sebastián: bus, tren y carpooling | ConcertRide`,
    description: `Heineken Jazzaldia ${YEAR} Donostia (22–26 jul): Renfe Madrid–Donostia (4h 30 min, 35–60€), ALSA (5h 30 min, 25–45€), Dbus urbano. Carpooling desde Bilbao (100 km, 4–7€), Pamplona (90 km, 4–7€), Madrid (450 km, 13–18€). Sin comisión.`,
    keywords: `como llegar jazzaldia ${YEAR}, jazzaldia transporte, jazzaldia donostia como llegar, jazzaldia san sebastian transporte, jazzaldia bus, jazzaldia carpooling, jazzaldia desde bilbao, festival jazz donostia como llegar`,
  },
  "metropoli-gijon": {
    title: `Cómo llegar a Metrópoli Gijón ${YEAR}: bus, Cercanías y carpooling | ConcertRide`,
    description: `Metrópoli Gijón ${YEAR} (Recinto Ferial Luis Adaro): bus urbano Emtusa 1/14/18, Cercanías Renfe Oviedo–Gijón hasta Sanz Crespo. Carpooling desde Oviedo (30 km, 3–4€), León (120 km, 5–7€), Madrid (445 km, 13–17€). Sin comisión.`,
    keywords: `como llegar metropoli gijon ${YEAR}, metropoli gijon transporte, metropoli gijon bus, metropoli gijon cercanias, metropoli gijon carpooling, recinto ferial luis adaro como llegar, metropoli desde oviedo, festival gijon transporte`,
  },
  "granada-sound": {
    title: `Cómo llegar a Granada Sound ${YEAR}: shuttle, bus y carpooling | ConcertRide`,
    description: `Granada Sound ${YEAR} (Cortijo del Conde Granada): bus lanzadera oficial desde Estación de Autobuses (5–7€). Carpooling desde Málaga (130 km, 5–8€), Sevilla (250 km, 8–11€), Madrid (430 km, 12–17€), Jaén (95 km, 4–7€). Sin comisión.`,
    keywords: `como llegar granada sound ${YEAR}, granada sound transporte, granada sound shuttle, granada sound bus, granada sound carpooling, granada sound cortijo del conde como llegar, granada sound desde malaga, granada sound desde madrid`,
  },
  "pirineos-sur": {
    title: `Cómo llegar a Pirineos Sur ${YEAR}: carretera + carpooling | ConcertRide`,
    description: `Pirineos Sur ${YEAR} (Lanuza, Sallent de Gállego): SIN transporte público al pueblo. Acceso por A-136 desde Huesca → Sabiñánigo. Carpooling ConcertRide desde Huesca (75 km, 3–5€), Zaragoza (175 km, 6–9€), Madrid (480 km, 13–18€), Barcelona (430 km, 12–17€). Sin comisión.`,
    keywords: `como llegar pirineos sur ${YEAR}, pirineos sur transporte, pirineos sur lanuza como llegar, sallent de gallego festival, pirineos sur carpooling, pirineos sur desde huesca, pirineos sur desde zaragoza`,
  },
  "starlite-marbella": {
    title: `Cómo llegar a Starlite Marbella ${YEAR}: lanzadera y carpooling | ConcertRide`,
    description: `Starlite Marbella ${YEAR} (Cantera de Nagüeles): lanzadera oficial desde Hotel Don Pepe Marbella + Plaza de la Iglesia. Aparcamiento en el recinto. Carpooling ConcertRide desde Málaga (60 km, 3–5€), Mijas (20 km, 3–4€), Fuengirola (25 km, 3–5€), Madrid (575 km, 14–20€). Sin comisión.`,
    keywords: `como llegar starlite marbella ${YEAR}, starlite transporte, cantera de nagueles como llegar, starlite shuttle marbella, starlite carpooling, starlite desde malaga, starlite desde madrid`,
  },
  "stone-music-festival": {
    title: `Cómo llegar a Stone & Music Mérida ${YEAR}: tren + carpooling | ConcertRide`,
    description: `Stone & Music Festival ${YEAR} (Teatro Romano Mérida): centro histórico, 5 min andando de Plaza España. Renfe Madrid–Mérida (3h 30 min, 25–45€). Carpooling ConcertRide desde Cáceres (75 km, 4–6€), Badajoz (60 km, 3–5€), Sevilla (200 km, 6–9€), Madrid (340 km, 10–14€). Sin comisión.`,
    keywords: `como llegar stone music merida ${YEAR}, stone music transporte, teatro romano merida como llegar, stone music carpooling, stone music desde madrid, stone music desde sevilla, festival merida transporte`,
  },
  "marenostrum-fuengirola": {
    title: `Cómo llegar a Marenostrum Fuengirola ${YEAR}: Cercanías + carpooling | ConcertRide`,
    description: `Marenostrum Fuengirola ${YEAR} (Sohail Castle Park): Cercanías Renfe C-1 Málaga–Fuengirola (35 min, 3,90€) + 15 min andando. Carpooling ConcertRide desde Málaga (35 km, 3–5€), Mijas (10 km, 3–4€), Marbella (25 km, 3–5€), Granada (130 km, 5–8€). Sin comisión.`,
    keywords: `como llegar marenostrum fuengirola ${YEAR}, marenostrum transporte, sohail castle park como llegar, fuengirola castle park, marenostrum cercanias, marenostrum carpooling, fuengirola conciertos`,
  },
  "tio-pepe-festival": {
    title: `Cómo llegar a Tío Pepe Festival ${YEAR}: tren + carpooling | ConcertRide`,
    description: `Tío Pepe Festival ${YEAR} (Bodegas González Byass Jerez): centro de Jerez, 5 min Plaza Arenal. Renfe Madrid–Jerez (4h 30 min, 35–60€). ALSA Sevilla–Jerez (1h, 8–12€). Carpooling ConcertRide desde Cádiz (35 km, 3–5€), Sevilla (95 km, 4–7€), Algeciras (130 km, 5–7€), Madrid (655 km, 16–22€). Sin comisión.`,
    keywords: `como llegar tio pepe festival ${YEAR}, tio pepe transporte, bodegas gonzalez byass como llegar, tio pepe jerez tren, tio pepe carpooling, tio pepe desde sevilla, tio pepe desde madrid`,
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
    title: `WiZink Center Madrid [Cómo Llegar ${YEAR}]: Metro L2/L5, parking y carpooling | ConcertRide`,
    description: `WiZink Center Madrid (18.000 plazas, Av. Felipe II): Metro L2 Goya o L5 El Barco (5 min andando), bus 21/26/53/74. Parking propio 12–18€/noche. Carpooling sin comisión desde Barcelona (15€), Valencia (14€), Zaragoza (9€), Sevilla (14€), Bilbao (11€). Vuelta nocturna coordinada con asistentes del mismo concierto.`,
    keywords: `como llegar wizink center, wizink center metro, wizink center cómo llegar, mapa wizink center, wizink center transporte, como ir wizink center, carpooling wizink center madrid, conciertos wizink center, wizink center parking, wizink center metro goya, wizink center entradas, wizink center direccion, wizink center madrid agenda`,
  },
  "palacio-vistalegre": {
    title: `Palacio Vistalegre Madrid [Cómo Llegar]: Metro L5 Oporto + Carpooling | ConcertRide`,
    description: `Palacio Vistalegre Madrid (15.000 plazas, Avda. de los Poblados). Metro L5 parada Oporto (5 min a pie) o L3 Legazpi (10 min). Bus 60, 79, 116. Sin parking propio — aparca en calles adyacentes (gratuito). Carpooling sin comisión desde Barcelona (15–20€), Valencia (10–14€), Bilbao (11–16€), Zaragoza (9–13€). Vuelta nocturna coordinada.`,
    keywords: `vista alegre como llegar, vista alegre madrid como llegar, mapa palacio vistalegre, palacio vistalegre cómo llegar, vistalegre metro, carpooling vistalegre madrid, conciertos vistalegre, palacio vistalegre metro oporto, como ir palacio vistalegre, vistalegre madrid metro parada, palacio vistalegre transporte, parking palacio vistalegre, palacio vistalegre direccion`,
  },
  "ifema-madrid": {
    title: `IFEMA Madrid [Cómo Llegar]: Metro L8 + Carpooling Mad Cool desde 9€ | ConcertRide`,
    description: `IFEMA Madrid — Feria de Madrid (Avda. del Parque). Metro L8 parada El Parque (10 min desde Nuevos Ministerios). Bus 101, 104, 122. Parking gratuito P1/P2 (limitado, llega 1h antes). Carpooling a Mad Cool sin comisión desde Barcelona (15–20€), Valencia (10–14€), Zaragoza (9–13€), Bilbao (11–16€), Sevilla (14–20€). Vuelta nocturna coordinada.`,
    keywords: `como llegar ifema, ifema como llegar, ifema metro, ifema mad cool transporte, carpooling ifema madrid, como ir ifema mad cool, mad cool como llegar ifema, ifema metro l8, ifema feria madrid metro, como ir a ifema madrid, ifema transporte publico, mad cool ifema carpooling, ifema madrid aparcamiento`,
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
  "fira-barcelona": {
    title: `Cómo llegar a Fira Barcelona Montjuïc: metro, Sónar y carpooling | ConcertRide`,
    description: `Fira de Barcelona Montjuïc / Gran Via (Sónar Festival, MWC). Metro L1/L3 Espanya (Montjuïc) o L9 Fira (Gran Via). Carpooling desde Madrid (15–20€), Valencia (10–14€), Zaragoza (8–12€). Sin comisión, vuelta de madrugada coordinada.`,
    keywords: `como llegar fira barcelona, fira montjuic como llegar, fira barcelona gran via, sonar fira barcelona transporte, fira barcelona metro, carpooling fira barcelona, fira barcelona aparcamiento, recinto sonar como llegar`,
  },
  "palau-blaugrana": {
    title: `Cómo llegar al Palau Blaugrana Barcelona: metro y carpooling | ConcertRide`,
    description: `Palau Blaugrana, Barcelona (7.500 plazas). Metro L3 Palau Reial (10 min a pie) / Tranvía T1/T2 Palau Reial. Bus H8, 54, 75. Carpooling desde Madrid (15–20€), Valencia (10–14€), Zaragoza (8–12€). Sin comisión.`,
    keywords: `como llegar palau blaugrana, palau blaugrana metro, palau blaugrana barcelona como ir, palau blaugrana parking, carpooling palau blaugrana, conciertos palau blaugrana barcelona`,
  },
  "estadio-santiago-bernabeu": {
    title: `Estadio Santiago Bernabéu Madrid [Cómo Llegar]: Metro + carpooling | ConcertRide`,
    description: `Estadio Santiago Bernabéu (85.000 plazas) — sede de mega-conciertos (Coldplay, Bruce Springsteen, Karol G). Metro L10 Santiago Bernabéu (puerta) o L5 Nuevos Ministerios. Bus 14, 27, 40, 43, 120, 147, 150. Bus nocturno N1, N22, N24. Carpooling sin comisión desde Barcelona (15€), Valencia (14€), Sevilla (14€), Zaragoza (9€). Pago Bizum o efectivo.`,
    keywords: `como llegar bernabeu, estadio bernabeu como llegar, bernabeu metro, bernabeu santiago de chamartin parking, carpooling bernabeu, bernabeu conciertos, coldplay bernabeu como llegar, bernabeu transporte nocturno`,
  },
  "estadio-civitas-metropolitano": {
    title: `Estadio Metropolitano Madrid [Cómo Llegar]: Metro L7 + carpooling | ConcertRide`,
    description: `Estadio Cívitas Metropolitano (68.000 plazas, sede del Atlético) — recinto para giras de mega-estadio (Ed Sheeran, Drake, Metallica, Guns N' Roses, Bruce Springsteen). Metro L7 Estadio Metropolitano (3 min a pie). Cercanías Renfe C-1/C-7 Metropolitano. Carpooling sin comisión desde Barcelona (15€), Valencia (14€), Sevilla (14€), Bilbao (11€). Vuelta nocturna coordinada.`,
    keywords: `como llegar estadio metropolitano, civitas metropolitano metro, estadio metropolitano madrid concierto, metropolitano l7, carpooling metropolitano, metropolitano conciertos, metallica metropolitano, ed sheeran metropolitano`,
  },
  "estadi-olimpic-lluis-companys": {
    title: `Estadi Olímpic Lluís Companys Barcelona [Cómo Llegar] | ConcertRide`,
    description: `Estadi Olímpic Lluís Companys (Montjuïc, 55.000 plazas) — Taylor Swift, Bruce Springsteen, Bad Bunny, Madonna. Metro L1/L3 Plaça Espanya + escaleras mecánicas Montjuïc, o autobús turístico. Bus nocturno N1 hasta Plaça Catalunya. Carpooling sin comisión desde Madrid (15–20€), Valencia (10–14€), Zaragoza (8–12€). Pago directo Bizum o efectivo.`,
    keywords: `como llegar estadi olimpic lluis companys, olimpic montjuic como llegar, taylor swift barcelona como llegar, bruce springsteen barcelona, montjuic metro, carpooling olimpic barcelona, estadi olimpic transporte`,
  },
  "roig-arena": {
    title: `Roig Arena Valencia [Cómo Llegar]: Metro + carpooling | ConcertRide`,
    description: `Roig Arena Valencia (nueva 2026, 20.000 plazas) — el mayor recinto cubierto de la Comunidad Valenciana. Metro L4 Tarongers o L9 Albereda. Bus EMT 30, 31. Carpooling sin comisión desde Madrid (10–14€), Barcelona (10–14€), Alicante (5–8€), Castellón (3–5€), Murcia (7–11€). Pago Bizum o efectivo, vuelta nocturna coordinada.`,
    keywords: `como llegar roig arena valencia, roig arena metro, roig arena conciertos, roig arena tarongers, carpooling roig arena, roig arena 2026 conciertos, valencia nueva arena`,
  },
  "atlantic-fest": {
    title: `Cómo llegar a Atlantic Fest ${YEAR}: tren + carpooling | ConcertRide`,
    description: `Atlantic Fest ${YEAR} (Recinto Bouzas, Vilagarcía de Arousa, Pontevedra): sin transporte público directo al recinto. Renfe Vigo–Vilagarcía (40 min, 5–7€). Carpooling ConcertRide desde Vigo (35 km, 3–5€), Pontevedra (25 km, 3–5€), A Coruña (95 km, 4–7€), Santiago (65 km, 3–5€), Ourense (95 km, 4–7€). Sin comisión. Vuelta de madrugada coordinada.`,
    keywords: `como llegar atlantic fest ${YEAR}, atlantic fest transporte, atlantic fest vilagarcia, atlantic fest carpooling, atlantic fest desde vigo, atlantic fest desde pontevedra, atlantic fest desde santiago, festival galicia julio`,
  },
  "mallorca-live-festival": {
    title: `Cómo llegar a Mallorca Live Festival ${YEAR}: avión + ferry + carpooling | ConcertRide`,
    description: `Mallorca Live Festival ${YEAR} (Antiguo Aquapark Magaluf, Calvià): vuelo desde Madrid/Barcelona/Valencia (45 min–1h, 50–120€) o ferry Barcelona–Palma (8h, 30–60€). En la isla: carpooling ConcertRide Palma→Calvià (15 km, 3€/asiento), lanzadera oficial desde Plaza España. Bus TIB línea 102 Palma–Magaluf (6,30€). Sin comisión.`,
    keywords: `como llegar mallorca live festival ${YEAR}, mallorca live transporte, mallorca live shuttle, mallorca live calvia como llegar, mallorca live desde palma, ferry mallorca festival, avion mallorca festival, carpooling mallorca live`,
  },
  "bbk-music-legends": {
    title: `Cómo llegar a BBK Music Legends Sondika ${YEAR}: lanzadera + carpooling | ConcertRide`,
    description: `BBK Music Legends ${YEAR} (Recinto Atxura, Sondika, 8 km de Bilbao centro): lanzadera oficial GRATUITA desde Plaza Moyúa, Termibus y Abando durante los 3 días. Bizkaibus A3247. Parking propio gratuito (3.000 plazas). Carpooling ConcertRide desde Bilbao 3€, Donostia 4–7€, Vitoria 3–6€, Madrid 11–16€. Sin comisión.`,
    keywords: `como llegar bbk music legends ${YEAR}, bbk music legends transporte, bbk music legends sondika, sondika recinto como llegar, bbk music legends lanzadera, bbk music legends carpooling, sondika bilbao bus`,
  },
  "sos-48": {
    title: `Cómo llegar al SOS 4.8 Murcia ${YEAR}: bus + carpooling | ConcertRide`,
    description: `SOS 4.8 Festival ${YEAR} (Recinto Ferias y Congresos Murcia): bus EMT líneas 1/18/39 hasta Ferias y Congresos. Sin tren al recinto. Carpooling ConcertRide desde Alicante (80 km, 4–6€), Valencia (250 km, 7–11€), Madrid (400 km, 11–16€), Cartagena (50 km, 3–5€), Almería (200 km, 6–10€). Sin comisión.`,
    keywords: `como llegar sos 4.8 ${YEAR}, sos festival murcia transporte, sos 4.8 murcia bus, sos festival carpooling, sos 4.8 desde alicante, sos 4.8 desde madrid, festival murcia como llegar, sos 4.8 recinto ferias`,
  },
  "portamerica": {
    title: `Cómo llegar a PortAmérica ${YEAR}: coche + carpooling | ConcertRide`,
    description: `PortAmérica ${YEAR} (Caldas de Reis, Pontevedra — junto a la autopista AP-9): acceso en coche obligatorio, sin transporte público al recinto. Parking de festival 5–10€. Carpooling ConcertRide desde Vigo (40 km, 3–5€), Pontevedra (20 km, 3–4€), Santiago (40 km, 3–5€), A Coruña (100 km, 4–7€), Madrid (600 km, 16–22€). Sin comisión.`,
    keywords: `como llegar portamerica ${YEAR}, portamerica caldas de reis transporte, portamerica carpooling, portamerica desde vigo, portamerica desde pontevedra, portamerica desde santiago, festival galicia julio ${YEAR}`,
  },
  "reggaeton-beach-festival": {
    title: `Cómo llegar al Reggaeton Beach Festival ${YEAR}: Salou bus + carpooling | ConcertRide`,
    description: `Reggaeton Beach Festival ${YEAR} (Costa Daurada, Salou–PortAventura, Tarragona): tren Rodalies R15 Barcelona–Salou/PortAventura (1h 20 min, 7,65€). Bus PLANA desde Tarragona (25 min). Carpooling ConcertRide desde Barcelona (100 km, 5–8€), Tarragona (15 km, 3–4€), Valencia (180 km, 6–9€), Madrid (530 km, 13–18€). Sin comisión.`,
    keywords: `como llegar reggaeton beach festival ${YEAR}, reggaeton beach salou transporte, reggaeton beach tren, reggaeton beach carpooling, salou festival como llegar, portaventura festival transporte, costa daurada festival, reggaeton beach desde barcelona, reggaeton beach desde tarragona`,
  },
  "vive-latino": {
    title: `Cómo llegar a Vive Latino España ${YEAR} Zaragoza: metro + carpooling | ConcertRide`,
    description: `Vive Latino España ${YEAR} (4–5 sep, Recinto Expo Zaragoza): tranvía línea 1 Valdespartera–Expo. Metro Zaragoza no cubre el Expo — usar tranvía o lanzadera oficial. Carpooling ConcertRide desde Madrid (9–13€, 3h 20min), Barcelona (8–12€, 2h 45min), Valencia (9–13€, 3h), Pamplona (5–8€), Huesca (3–5€). Sin comisión.`,
    keywords: `como llegar vive latino zaragoza ${YEAR}, vive latino transporte zaragoza, vive latino expo zaragoza, vive latino tranvia, vive latino carpooling, como ir vive latino zaragoza, vive latino desde madrid, vive latino desde barcelona, vive latino desde pamplona`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ARTIST PAGE TITLE/DESCRIPTION OVERRIDES
// GSC-driven: target artist+carpooling queries in position 11–20
// Formula: "[Artist] concierto España [Year]: carpooling desde [price]€ | ConcertRide"
// ─────────────────────────────────────────────────────────────────────────────

export const ARTIST_SEO_OVERRIDES: Record<string, { title: string; description: string; keywords?: string }> = {
  coldplay: {
    title: `Coldplay concierto España ${YEAR}: carpooling desde 4€ sin comisión | ConcertRide`,
    description: `Coldplay en España ${YEAR} — Estadio Bernabéu Madrid y Estadi Olímpic Barcelona. Carpooling desde Valencia (10–14€), Barcelona (15–20€), Zaragoza (9–13€). 0% comisión, conductores verificados. Cómo llegar al concierto de Coldplay sin AVE.`,
    keywords: `carpooling coldplay españa, coldplay concierto madrid carpooling, coldplay barcelona carpooling, como llegar concierto coldplay, coldplay ${YEAR} transporte, viaje compartido coldplay españa, cómo ir al concierto de coldplay, coldplay madrid bernabeu como llegar`,
  },
  "taylor-swift": {
    title: `Taylor Swift concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Taylor Swift en España ${YEAR} — Bernabéu Madrid y Estadi Olímpic Barcelona. Carpooling desde Valencia (10–14€), Barcelona (15–20€). Conductores verificados, 0% comisión. La opción más barata y cómoda para las Swifties.`,
    keywords: `carpooling taylor swift españa, taylor swift madrid como llegar, taylor swift concierto ${YEAR} transporte, viaje compartido taylor swift, taylor swift bernabeu carpooling, como ir al concierto taylor swift sin tren, eras tour madrid carpooling`,
  },
  rosalia: {
    title: `Rosalía España ${YEAR} [Motomami World Tour]: Carpooling WiZink + Palau desde 4€`,
    description: `Rosalía en España ${YEAR} — WiZink Center Madrid y Palau Sant Jordi Barcelona. Carpooling sin comisión desde Valencia (10–14€), Sevilla (12–17€), Zaragoza (9–13€), Bilbao (11–16€). La artista española más global — carpooling directo al recinto. 0% comisión, pago Bizum.`,
    keywords: `carpooling rosalia españa, rosalia concierto madrid carpooling, rosalia wizink center como llegar, rosalia ${YEAR} transporte, viaje compartido rosalia, como ir concierto rosalia, rosalia palau sant jordi carpooling, rosalia españa ${YEAR}, rosalia concierto barcelona, rosalia motomami tour, rosalia gira ${YEAR}`,
  },
  "bad-bunny": {
    title: `Bad Bunny concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Bad Bunny en España ${YEAR} — Estadio Bernabéu Madrid y Palau Sant Jordi Barcelona. Carpooling desde Valencia (10–14€), Sevilla (12–17€), Barcelona (15–20€). Sin comisión, conductores verificados con carnet.`,
    keywords: `carpooling bad bunny españa, bad bunny concierto madrid como llegar, bad bunny ${YEAR} transporte, viaje compartido bad bunny, bad bunny bernabeu carpooling, como ir al concierto bad bunny, bad bunny palau sant jordi transporte`,
  },
  "the-weeknd": {
    title: `The Weeknd concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `The Weeknd en España ${YEAR} — Estadio Bernabéu Madrid y Estadi Olímpic Barcelona. Carpooling desde Valencia (10–14€), Sevilla (12–17€). 0% comisión, vuelta coordinada con el conductor.`,
    keywords: `carpooling the weeknd españa, the weeknd madrid como llegar, the weeknd concierto ${YEAR} transporte, viaje compartido the weeknd, the weeknd bernabeu carpooling, como ir al concierto the weeknd, the weeknd after hours tour madrid`,
  },
  "metallica-ifema": {
    title: `Metallica concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Metallica en España ${YEAR} — IFEMA Madrid (Estadio Olímpico). Carpooling desde Bilbao (11–16€), Valencia (10–14€), Barcelona (15–20€). Metro L8 + lanzadera. 0% comisión. La opción más metal para llegar.`,
    keywords: `carpooling metallica españa, metallica madrid como llegar, metallica ifema transporte, metallica ${YEAR} madrid carpooling, viaje compartido metallica, como ir al concierto metallica, metallica m72 tour madrid, metaleros carpooling madrid`,
  },
  rammstein: {
    title: `Rammstein concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Rammstein en España ${YEAR} — estadios de Madrid y Barcelona. Carpooling desde Valencia (10–14€), Bilbao (11–16€), Zaragoza (9–13€). 0% comisión, conductores verificados. Vuelta coordinada con fin del espectáculo.`,
    keywords: `carpooling rammstein españa, rammstein concierto madrid carpooling, rammstein ${YEAR} transporte, viaje compartido rammstein, como llegar concierto rammstein, rammstein madrid como llegar, rammstein barcelona carpooling`,
  },
  "harry-styles": {
    title: `Harry Styles concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Harry Styles en España ${YEAR} — WiZink Center Madrid y Palau Sant Jordi Barcelona. Carpooling desde Zaragoza (9–13€), Valencia (10–14€), Bilbao (11–16€). 0% comisión, pago en Bizum. Love on Tour, sin colas de metro.`,
    keywords: `carpooling harry styles españa, harry styles madrid como llegar, harry styles wizink center carpooling, harry styles ${YEAR} transporte, viaje compartido harry styles, como ir al concierto harry styles, harry styles palau sant jordi transporte`,
  },
  "karol-g": {
    title: `Karol G España ${YEAR} [Palau Sant Jordi + WiZink]: Carpooling desde 4€ sin comisión`,
    description: `Karol G en España ${YEAR} — Palau Sant Jordi Barcelona y WiZink Center Madrid. Carpooling sin comisión desde Zaragoza (9–13€), Valencia (10–14€), Sevilla (12–17€). Conductores verificados, vuelta de madrugada coordinada. Pago Bizum o efectivo.`,
    keywords: `karol g palau sant jordi, karol g wizink center como llegar, karol g españa ${YEAR}, carpooling karol g, karol g madrid como llegar, karol g ${YEAR} transporte, viaje compartido karol g, como ir al concierto karol g, karol g concierto españa`,
  },
  "dua-lipa": {
    title: `Dua Lipa España ${YEAR} [Radical Optimism Tour]: Carpooling WiZink + Palau desde 4€`,
    description: `Dua Lipa Radical Optimism Tour España ${YEAR} — WiZink Center Madrid y Palau Sant Jordi Barcelona. Carpooling sin comisión desde Valencia (10–14€), Sevilla (12–17€), Zaragoza (9–13€), Bilbao (11–16€). Conductores verificados, vuelta de madrugada coordinada. 0% comisión, pago Bizum.`,
    keywords: `carpooling dua lipa españa, dua lipa madrid como llegar, dua lipa wizink center carpooling, dua lipa ${YEAR} transporte, viaje compartido dua lipa, como ir al concierto dua lipa, dua lipa concierto españa ${YEAR}, dua lipa radical optimism tour, dua lipa barcelona ${YEAR}, dua lipa palau sant jordi, dua lipa spain ${YEAR}`,
  },
  "billie-eilish": {
    title: `Billie Eilish España ${YEAR} [Hit Me Hard Tour]: Carpooling WiZink + Palau Sant Jordi desde 4€`,
    description: `Billie Eilish Hit Me Hard and Soft Tour España ${YEAR} — WiZink Center Madrid y Palau Sant Jordi Barcelona. Carpooling sin comisión desde Valencia (10–14€), Zaragoza (9–13€), Bilbao (11–16€). Conductores verificados, vuelta de madrugada coordinada. 0% comisión, pago Bizum.`,
    keywords: `billie eilish en españa ${YEAR}, billie eilish madrid ${YEAR}, billie eilish wizink center como llegar, billie eilish palau sant jordi carpooling, billie eilish hit me hard tour, carpooling billie eilish, viaje compartido billie eilish, como ir concierto billie eilish, billie eilish concierto españa ${YEAR}, cuando viene billie eilish a españa, billie eilish spain ${YEAR}`,
  },
  "beyonce": {
    title: `Beyoncé concierto España ${YEAR} [Cowboy Carter Tour]: Carpooling estadio desde 4€`,
    description: `Beyoncé Cowboy Carter Tour España ${YEAR} — estadios de Madrid y Barcelona. Carpooling sin comisión desde Valencia (10–14€), Sevilla (12–17€), Barcelona (15–20€). Conductores verificados con carnet, vuelta de madrugada coordinada. 0% comisión.`,
    keywords: `carpooling beyonce españa, beyonce madrid como llegar, beyonce concierto ${YEAR} transporte, viaje compartido beyonce, cowboy carter tour madrid carpooling, como ir al concierto beyonce, beyonce españa ${YEAR}, beyonce conciertos ${YEAR}`,
  },
  // ── Artistas Españoles ──────────────────────────────────────────────────────
  "aitana": {
    title: `Aitana concierto ${YEAR}: carpooling al WiZink Center, Palau Sant Jordi y BEC! | ConcertRide`,
    description: `Aitana ALPHA Tour ${YEAR} — WiZink Center Madrid (oct), Palau Sant Jordi Barcelona (oct), BEC! Bilbao (nov), FIBES Sevilla (dic). Carpooling desde Toledo (4–7€), Zaragoza (9–13€), Valencia (10–14€). 0% comisión.`,
    keywords: `carpooling aitana ${YEAR}, concierto aitana madrid ${YEAR}, aitana wizink center como llegar, aitana alpha tour ${YEAR}, aitana carpooling, como llegar concierto aitana, aitana palau sant jordi carpooling, aitana bec bilbao transporte, viaje compartido aitana`,
  },
  "dani-martin": {
    title: `Dani Martín '25 Pts Años' Zaragoza ${YEAR}: doble fecha 22–23 mayo · carpooling desde 4€ | ConcertRide`,
    description: `Dani Martín gira '25 Pts Años' ${YEAR}: DOBLE FECHA Pabellón Príncipe Felipe Zaragoza (22 y 23 may). Entradas agotadas. Carpooling desde Madrid (9–13€), Pamplona (5–8€), Huesca (3–5€), Logroño (5–8€). 0% comisión.`,
    keywords: `carpooling dani martin ${YEAR}, concierto dani martin zaragoza ${YEAR}, dani martin 22 mayo zaragoza, dani martin 23 mayo zaragoza, dani martin zaragoza entradas, dani martin 25 años gira, viaje compartido dani martin zaragoza, como llegar concierto dani martin zaragoza, dani martin principe felipe zaragoza, el canto del loco ${YEAR}`,
  },
  "hombres-g": {
    title: `Hombres G Zaragoza ${YEAR}: carpooling al concierto 21 nov Príncipe Felipe | ConcertRide`,
    description: `Hombres G 'Los Mejores Años de Nuestra Vida' — Pabellón Príncipe Felipe Zaragoza (21 nov ${YEAR}). Carpooling desde Pamplona (5–8€), Logroño (5–8€), Huesca (3–5€), Madrid (9–13€). 0% comisión, conductores verificados.`,
    keywords: `carpooling hombres g ${YEAR}, concierto hombres g zaragoza ${YEAR}, hombres g zaragoza noviembre, hombres g david summers ${YEAR}, hombres g los mejores años, como llegar concierto hombres g zaragoza, viaje compartido hombres g, hombres g principe felipe zaragoza, hombres g carpooling pamplona`,
  },
  "bryan-adams": {
    title: `Bryan Adams España ${YEAR}: carpooling Zaragoza (14 nov) y Madrid (18 nov) | ConcertRide`,
    description: `Bryan Adams gira europea ${YEAR} — Pabellón Príncipe Felipe Zaragoza (14 nov), WiZink Center Madrid (18 nov). Carpooling desde Bilbao (8–12€), Pamplona (5–8€), Barcelona (8–12€), Toledo (4–7€). 0% comisión.`,
    keywords: `carpooling bryan adams españa ${YEAR}, concierto bryan adams zaragoza, bryan adams madrid ${YEAR}, bryan adams zaragoza noviembre, como llegar concierto bryan adams, viaje compartido bryan adams, bryan adams principe felipe zaragoza, bryan adams wizink madrid carpooling, summer of 69 concierto ${YEAR}`,
  },
  "melendi": {
    title: `Melendi concierto España ${YEAR}: carpooling al WiZink Center y BEC! | ConcertRide`,
    description: `Melendi Gira ${YEAR} — WiZink Center Madrid (sept), BEC! Bilbao (sept). Carpooling desde Toledo (4–7€), Donostia (4–7€), Vitoria (3–6€). 0% comisión, conductores verificados.`,
    keywords: `carpooling melendi ${YEAR}, melendi concierto madrid ${YEAR}, melendi wizink center como llegar, melendi bec bilbao carpooling, como ir concierto melendi, viaje compartido melendi, melendi gira ${YEAR}`,
  },
  "pablo-alboran": {
    title: `Pablo Alborán concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Pablo Alborán en España ${YEAR} — WiZink Center Madrid, FIBES Sevilla, Palau Sant Jordi Barcelona. Carpooling desde Toledo (4–7€), Córdoba (4–6€), Málaga (5–8€), Valencia (10–14€). 0% comisión.`,
    keywords: `carpooling pablo alboran ${YEAR}, pablo alboran madrid como llegar, pablo alboran wizink center carpooling, pablo alboran ${YEAR} transporte, viaje compartido pablo alboran, como ir concierto pablo alboran, pablo alboran sevilla fibes carpooling`,
  },
  "rozalen": {
    title: `Rozalén concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Rozalén en España ${YEAR} — WiZink Center Madrid, Valencia. Carpooling desde Albacete (6–9€), Toledo (4–7€), Cuenca (5–8€), Alicante (5–8€). 0% comisión, conductores verificados.`,
    keywords: `carpooling rozalen ${YEAR}, rozalen concierto madrid ${YEAR}, rozalen wizink center como llegar, rozalen ${YEAR} transporte, viaje compartido rozalen, como ir concierto rozalen`,
  },
  "sabrina-carpenter": {
    title: `Sabrina Carpenter España ${YEAR} [Short n' Sweet Tour]: Carpooling WiZink desde 4€`,
    description: `Sabrina Carpenter Short n' Sweet Tour España ${YEAR} — WiZink Center Madrid y Palau Sant Jordi Barcelona. Carpooling sin comisión desde Zaragoza (9–13€), Valencia (10–14€), Sevilla (12–17€). Conductores verificados, vuelta de madrugada coordinada. 0% comisión.`,
    keywords: `sabrina carpenter españa, sabrina carpenter madrid como llegar, sabrina carpenter ${YEAR}, sabrina carpenter wizink center carpooling, sabrina carpenter short n sweet tour, carpooling sabrina carpenter, viaje compartido sabrina carpenter, sabrina carpenter concierto madrid, sabrina carpenter spain ${YEAR}, sabrina carpenter barcelona ${YEAR}`,
  },
  "lana-del-rey": {
    title: `Lana Del Rey concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Lana Del Rey en España ${YEAR} — Parc del Fòrum Barcelona y WiZink Center Madrid. Carpooling desde Madrid (15–20€), Valencia (10–14€), Zaragoza (8–12€). 0% comisión, conductores verificados.`,
    keywords: `carpooling lana del rey españa, lana del rey barcelona como llegar, lana del rey primavera sound carpooling, lana del rey ${YEAR} transporte, viaje compartido lana del rey, como ir concierto lana del rey`,
  },
  "c-tangana": {
    title: `C. Tangana concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `C. Tangana El Madrileño — WiZink Center Madrid y Palau Sant Jordi Barcelona. Carpooling desde Valencia (10–14€), Sevilla (14–20€), Bilbao (11–16€). 0% comisión, conductores verificados.`,
    keywords: `carpooling c tangana españa, c tangana madrid como llegar, c tangana wizink center carpooling, c tangana ${YEAR} transporte, viaje compartido c tangana, como ir concierto c tangana, el madrileño tour carpooling`,
  },
  "joaquin-sabina": {
    title: `Joaquín Sabina concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Joaquín Sabina en España ${YEAR} — Estadio Bernabéu Madrid y Palau Sant Jordi Barcelona. Carpooling desde Sevilla (14–20€), Valencia (10–14€), Zaragoza (9–13€). 0% comisión, conductores verificados.`,
    keywords: `carpooling joaquin sabina españa, joaquin sabina madrid como llegar, sabina concierto ${YEAR} transporte, viaje compartido joaquin sabina, como ir concierto sabina, sabina bernabeu carpooling`,
  },
  "travis-scott": {
    title: `Travis Scott concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Travis Scott Rodeo Tour España ${YEAR} — Parc del Fòrum Barcelona y IFEMA Madrid. Carpooling desde Madrid (15–20€), Valencia (10–14€), Zaragoza (8–12€). 0% comisión, conductores verificados.`,
    keywords: `carpooling travis scott españa, travis scott barcelona como llegar, travis scott mad cool carpooling, travis scott ${YEAR} transporte, viaje compartido travis scott, como ir concierto travis scott`,
  },
  "olivia-rodrigo": {
    title: `Olivia Rodrigo España ${YEAR}: cómo llegar al concierto, carpooling desde 4€ | ConcertRide`,
    description: `Olivia Rodrigo GUTS World Tour ${YEAR} — Palau Sant Jordi Barcelona y WiZink Center Madrid. Carpooling sin comisión desde Valencia (10–14€), Zaragoza (9–13€), Sevilla (14–20€). Pago en Bizum o efectivo, conductores verificados, vuelta de madrugada coordinada.`,
    keywords: `olivia rodrigo españa ${YEAR}, olivia rodrigo madrid como llegar, olivia rodrigo barcelona carpooling, olivia rodrigo guts tour madrid, olivia rodrigo wizink center, olivia rodrigo palau sant jordi, carpooling olivia rodrigo, viaje compartido olivia rodrigo, como ir concierto olivia rodrigo, olivia rodrigo entradas transporte, olivia rodrigo tour ${YEAR}`,
  },
  "post-malone": {
    title: `Post Malone España ${YEAR} [Mad Cool + Palau Sant Jordi]: Carpooling desde 4€`,
    description: `Post Malone en España ${YEAR} — Mad Cool Madrid y Parc del Fòrum Barcelona. Carpooling sin comisión desde Valencia (10–14€), Zaragoza (8–12€), Sevilla (14–20€). Conductores verificados, vuelta nocturna coordinada. Pago Bizum o efectivo.`,
    keywords: `post malone madrid, post malone españa ${YEAR}, post malone madrid como llegar, post malone barcelona carpooling, post malone mad cool, carpooling post malone, viaje compartido post malone, como ir concierto post malone, post malone concierto españa`,
  },
  drake: {
    title: `Drake España ${YEAR} [Metropolitano Madrid + Palau Sant Jordi]: Carpooling desde 4€`,
    description: `Drake en España ${YEAR} — Estadio Metropolitano Madrid y Palau Sant Jordi Barcelona. Carpooling sin comisión desde Valencia (10–14€), Zaragoza (8–12€), Sevilla (14–20€). Conductores verificados, vuelta de madrugada coordinada. 0% comisión.`,
    keywords: `drake madrid, drake españa ${YEAR}, drake madrid como llegar, drake barcelona carpooling, drake concierto españa, carpooling drake, viaje compartido drake, como ir concierto drake, drake spain ${YEAR}, drake metropolitano madrid, drake palau sant jordi`,
  },
  metallica: {
    title: `Metallica España ${YEAR}: carpooling al M72 World Tour desde 4€ | ConcertRide`,
    description: `Metallica M72 World Tour España ${YEAR} — Estadi Olímpic Barcelona y Estadio Metropolitano Madrid. Carpooling desde Valencia (10–14€), Zaragoza (9–13€), Bilbao (11–16€). 0% comisión, perfil del conductor verificado, vuelta de madrugada incluida.`,
    keywords: `metallica españa ${YEAR}, metallica m72 madrid carpooling, metallica barcelona como llegar, metallica concierto españa, metallica metropolitano transporte, carpooling metallica, viaje compartido metallica, metallica tour ${YEAR}, como ir metallica madrid`,
  },
  "guns-n-roses": {
    title: `Guns N' Roses España ${YEAR}: carpooling al concierto desde 4€ | ConcertRide`,
    description: `Guns N' Roses en España ${YEAR} — Estadio Metropolitano Madrid y Estadi Olímpic Barcelona. Carpooling desde Valencia (10–14€), Zaragoza (8–12€), Sevilla (14–20€). 0% comisión, conductores verificados, pago Bizum o efectivo.`,
    keywords: `guns n roses españa ${YEAR}, guns n roses madrid como llegar, guns n roses barcelona carpooling, gnr españa concierto, carpooling guns n roses, viaje compartido guns n roses, como ir concierto guns n roses, guns n roses tour ${YEAR}, guns n roses metropolitano`,
  },
  "ed-sheeran": {
    title: `Ed Sheeran España ${YEAR}: carpooling al concierto desde 4€ | ConcertRide`,
    description: `Ed Sheeran +–=÷× Tour España ${YEAR} — Estadio Cívitas Metropolitano Madrid y Estadi Olímpic Barcelona. Carpooling desde Valencia (10–14€), Zaragoza (8–12€), Bilbao (11–16€). 0% comisión, conductores verificados, vuelta de madrugada coordinada.`,
    keywords: `ed sheeran españa ${YEAR}, ed sheeran madrid como llegar, ed sheeran barcelona carpooling, ed sheeran tour ${YEAR}, mathematics tour españa, carpooling ed sheeran, viaje compartido ed sheeran, como ir concierto ed sheeran`,
  },
  maluma: {
    title: `Maluma España ${YEAR}: carpooling al concierto desde 4€ | ConcertRide`,
    description: `Maluma en España ${YEAR} — WiZink Center Madrid y Palau Sant Jordi Barcelona. Carpooling desde Valencia (10–14€), Sevilla (14–20€), Zaragoza (9–13€). 0% comisión, pago Bizum o efectivo, conductores verificados, vuelta nocturna.`,
    keywords: `maluma españa ${YEAR}, maluma madrid como llegar, maluma barcelona carpooling, maluma wizink center, maluma palau sant jordi, carpooling maluma, viaje compartido maluma, como ir concierto maluma, maluma tour ${YEAR}, reggaeton concierto madrid carpooling`,
  },
  "bruce-springsteen": {
    title: `Bruce Springsteen España ${YEAR}: carpooling al Boss desde 4€ | ConcertRide`,
    description: `Bruce Springsteen And The E Street Band ${YEAR} — Estadi Olímpic Barcelona y Estadio Cívitas Metropolitano Madrid. Carpooling desde Valencia (10–14€), Zaragoza (8–12€), Bilbao (11–16€). 0% comisión, vuelta de madrugada coordinada con otros fans.`,
    keywords: `bruce springsteen españa ${YEAR}, bruce springsteen madrid carpooling, bruce springsteen barcelona como llegar, springsteen tour españa, the boss concierto españa, carpooling bruce springsteen, viaje compartido bruce springsteen, e street band españa, como ir concierto springsteen`,
  },
  "doja-cat": {
    title: `Doja Cat España ${YEAR} [Scarlet Tour Palau Sant Jordi + WiZink]: Carpooling desde 4€`,
    description: `Doja Cat Scarlet Tour España ${YEAR} — Palau Sant Jordi Barcelona y WiZink Center Madrid. Carpooling sin comisión desde Valencia (10–14€), Zaragoza (8–12€), Sevilla (14–20€), Bilbao (11–16€). 0% comisión, pago Bizum o efectivo, conductores verificados, vuelta coordinada.`,
    keywords: `doja cat españa ${YEAR}, doja cat madrid como llegar, doja cat barcelona carpooling, doja cat scarlet tour, carpooling doja cat, viaje compartido doja cat, como ir concierto doja cat, doja cat wizink center, doja cat palau sant jordi, doja cat concierto españa, doja cat madrid ${YEAR}`,
  },
  "vetusta-morla": {
    title: `Vetusta Morla concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Vetusta Morla en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, La Cartuja Sevilla, Mad Cool. La banda indie española más grande. Carpooling sin comisión desde Valencia (10–14€), Zaragoza (9–13€), Sevilla (14–20€), Bilbao (11–16€), Granada (12–17€). 0% comisión, pago Bizum, vuelta de madrugada coordinada con otros fans.`,
    keywords: `vetusta morla ${YEAR}, vetusta morla concierto españa ${YEAR}, vetusta morla madrid como llegar, vetusta morla wizink center, vetusta morla palau sant jordi, vetusta morla la cartuja, carpooling vetusta morla, viaje compartido vetusta morla, vetusta morla tour ${YEAR}, vetusta morla mapa de los vientos, vetusta morla cabo polonio`,
  },
  estopa: {
    title: `Estopa concierto España ${YEAR}: carpooling desde 4€, 0% comisión | ConcertRide`,
    description: `Estopa en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, La Cartuja Sevilla. Los hermanos Muñoz vuelven con gira nacional 25 aniversario. Carpooling sin comisión desde Valencia (10–14€), Zaragoza (9–13€), Bilbao (11–16€), Sevilla (14–20€). 0% comisión, pago Bizum o efectivo. Cantando rumba española.`,
    keywords: `estopa ${YEAR}, estopa concierto españa ${YEAR}, estopa madrid como llegar, estopa wizink center, estopa palau sant jordi, estopa la cartuja, carpooling estopa, viaje compartido estopa, estopa tour 25 aniversario, hermanos muñoz estopa, rumba española estopa`,
  },
  quevedo: {
    title: `Quevedo concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Quevedo en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, Estadio Gran Canaria Arena Las Palmas. El rapero canario más exitoso. Carpooling sin comisión desde Valencia (10–14€), Sevilla (14–20€), Zaragoza (9–13€), Las Palmas. 0% comisión, pago Bizum, conductores verificados.`,
    keywords: `quevedo ${YEAR}, quevedo concierto españa ${YEAR}, quevedo madrid como llegar, quevedo wizink center, quevedo palau sant jordi, quevedo gran canaria, carpooling quevedo, viaje compartido quevedo, quevedo bizarrap session 52, quevedo donde quiero estar tour, quevedo rapero canario`,
  },
  bizarrap: {
    title: `Bizarrap concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Bizarrap en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, Mad Cool, Primavera Sound. El productor argentino #1 mundial con sus BZRP Music Sessions. Carpooling sin comisión desde Valencia (10–14€), Zaragoza (9–13€), Sevilla (14–20€). 0% comisión, pago Bizum o efectivo.`,
    keywords: `bizarrap ${YEAR}, bizarrap concierto españa ${YEAR}, bizarrap madrid como llegar, bizarrap wizink center, bizarrap palau sant jordi, bizarrap mad cool, bizarrap primavera sound, carpooling bizarrap, viaje compartido bizarrap, bizarrap bzrp sessions, bizarrap shakira, bizarrap quevedo`,
  },
  camilo: {
    title: `Camilo concierto España ${YEAR}: carpooling desde 4€, 0% comisión | ConcertRide`,
    description: `Camilo en España ${YEAR} — WiZink Center Madrid y Palau Sant Jordi Barcelona. Cantautor colombiano de pop latino. Carpooling sin comisión desde Valencia (10–14€), Sevilla (14–20€), Zaragoza (9–13€), Bilbao (11–16€). 0% comisión, pago Bizum, vuelta nocturna coordinada con otros fans.`,
    keywords: `camilo ${YEAR}, camilo concierto españa ${YEAR}, camilo madrid como llegar, camilo wizink center, camilo palau sant jordi, carpooling camilo, viaje compartido camilo, camilo de adentro pa fuera tour, camilo cantautor colombiano, vida de rico camilo`,
  },
  "manuel-carrasco": {
    title: `Manuel Carrasco concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Manuel Carrasco en España ${YEAR} — La Cartuja Sevilla, WiZink Center Madrid, Stone & Music Mérida, Palau Sant Jordi Barcelona. El artista andaluz más exitoso de su generación. Carpooling sin comisión desde Huelva (4–7€), Cádiz (5–8€), Córdoba (5–8€), Málaga (7–10€), Madrid (14–20€). 0% comisión.`,
    keywords: `manuel carrasco ${YEAR}, manuel carrasco concierto españa, manuel carrasco la cartuja sevilla, manuel carrasco madrid wizink, manuel carrasco merida stone music, carpooling manuel carrasco, manuel carrasco gira ${YEAR}, manuel carrasco huelva, manuel carrasco bailar contigo`,
  },
  "pablo-lopez": {
    title: `Pablo López concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Pablo López en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, La Cartuja Sevilla, Stone & Music Mérida. El malagueño cantautor de pop. Carpooling sin comisión desde Málaga (3–5€ a Marenostrum/Cala Mijas), Valencia (10–14€), Zaragoza (9–13€), Madrid (14–20€). 0% comisión, pago Bizum o efectivo.`,
    keywords: `pablo lopez ${YEAR}, pablo lopez concierto españa, pablo lopez wizink center, pablo lopez palau sant jordi, pablo lopez la cartuja, pablo lopez merida, carpooling pablo lopez, pablo lopez gira ${YEAR}, pablo lopez tour ${YEAR}, pablo lopez piano, pablo lopez malaga`,
  },
  "love-of-lesbian": {
    title: `Love of Lesbian concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Love of Lesbian en España ${YEAR} — Palau Sant Jordi Barcelona, WiZink Center Madrid, Cruïlla, Sonorama Ribera, Granada Sound. La banda indie pop catalana más popular. Carpooling sin comisión desde Madrid (15–20€), Valencia (10–14€), Tarragona (5–8€), Zaragoza (8–12€). Pago Bizum o efectivo, 0% comisión.`,
    keywords: `love of lesbian ${YEAR}, love of lesbian concierto españa ${YEAR}, love of lesbian madrid, love of lesbian barcelona, love of lesbian palau sant jordi, love of lesbian wizink, carpooling love of lesbian, viaje compartido love of lesbian, love of lesbian gira ${YEAR}, indie pop catalan, santi balmes love of lesbian`,
  },
  "carolina-durante": {
    title: `Carolina Durante concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Carolina Durante en España ${YEAR} — WiZink Center Madrid, Sala Apolo Barcelona, Mad Cool, Sonorama Ribera, Primavera Sound, Granada Sound. La banda madrileña de indie rock más relevante de la nueva escena. Carpooling sin comisión desde Valencia (10–14€), Zaragoza (9–13€), Bilbao (11–16€), Sevilla (14–20€). 0% comisión.`,
    keywords: `carolina durante ${YEAR}, carolina durante concierto españa ${YEAR}, carolina durante madrid wizink, carolina durante barcelona, carolina durante mad cool, carolina durante sonorama, carolina durante primavera sound, carpooling carolina durante, indie rock madrid carolina durante, diego ibañez carolina durante, cuatro chavales carolina durante`,
  },
  "lola-indigo": {
    title: `Lola Indigo concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Lola Indigo en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, La Cartuja Sevilla, Mad Cool. La cantante española de pop urbano (OT 2017). Carpooling sin comisión desde Valencia (10–14€), Sevilla (14–20€), Zaragoza (9–13€), Madrid (14–20€). 0% comisión, pago Bizum.`,
    keywords: `lola indigo ${YEAR}, lola indigo concierto españa ${YEAR}, lola indigo madrid, lola indigo wizink center, lola indigo palau sant jordi, lola indigo barcelona, carpooling lola indigo, viaje compartido lola indigo, lola indigo gira ${YEAR}, mimi doblas lola indigo, akelarre lola indigo, mujer bruja lola indigo`,
  },
  saiko: {
    title: `Saiko concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Saiko en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, Pabellón Santiago Martín Tenerife. El rapero canario nacido en La Laguna. Carpooling sin comisión desde Valencia (10–14€), Sevilla (14–20€), Zaragoza (9–13€), Madrid (14–20€). En Tenerife: Santa Cruz centro → Pabellón Santiago Martín (3–4€). 0% comisión.`,
    keywords: `saiko ${YEAR}, saiko concierto españa ${YEAR}, saiko madrid, saiko wizink center, saiko barcelona, saiko tenerife pabellon santiago martin, saiko polaris quevedo, saiko chata, carpooling saiko, viaje compartido saiko, ivan vazquez saiko, rap canario saiko`,
  },
  "anuel-aa": {
    title: `Anuel AA concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Anuel AA en España ${YEAR} — WiZink Center Madrid y Palau Sant Jordi Barcelona. El rapero puertorriqueño de trap latino. Carpooling sin comisión desde Valencia (10–14€), Sevilla (14–20€), Zaragoza (9–13€), Madrid (14–20€). 0% comisión, pago Bizum o efectivo.`,
    keywords: `anuel aa ${YEAR}, anuel aa concierto españa ${YEAR}, anuel aa madrid, anuel aa wizink center, anuel aa palau sant jordi, anuel aa barcelona, carpooling anuel aa, anuel aa karol g, china anuel daddy yankee, trap latino anuel aa, real hasta la muerte anuel`,
  },
  "j-balvin": {
    title: `J Balvin concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `J Balvin en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, Vive Latino España Zaragoza. El cantante colombiano de reggaetón. Carpooling sin comisión desde Valencia (10–14€), Sevilla (14–20€), Zaragoza (9–13€), Tarragona (5–8€). 0% comisión.`,
    keywords: `j balvin ${YEAR}, j balvin concierto españa ${YEAR}, j balvin madrid, j balvin wizink center, j balvin palau sant jordi, j balvin barcelona, carpooling j balvin, viaje compartido j balvin, j balvin vive latino, j balvin mi gente, jose alvaro osorio j balvin, reggaeton colombia j balvin`,
  },
  "sebastian-yatra": {
    title: `Sebastián Yatra concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Sebastián Yatra en España ${YEAR} — WiZink Center Madrid y Palau Sant Jordi Barcelona. El cantante colombiano de pop latino (Tacones Rojos). Carpooling sin comisión desde Valencia (10–14€), Sevilla (14–20€), Zaragoza (9–13€), Madrid (14–20€). 0% comisión, pago Bizum.`,
    keywords: `sebastian yatra ${YEAR}, sebastian yatra concierto españa ${YEAR}, sebastian yatra madrid, sebastian yatra wizink, sebastian yatra palau sant jordi, sebastian yatra barcelona, carpooling sebastian yatra, sebastian yatra tacones rojos, sebastian yatra robarte un beso, pop latino yatra`,
  },
  "manuel-turizo": {
    title: `Manuel Turizo concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Manuel Turizo (MTZ) en España ${YEAR} — WiZink Center Madrid y Palau Sant Jordi Barcelona. El cantante colombiano (La Bachata, Una Lady Como Tú). Carpooling sin comisión desde Valencia (10–14€), Sevilla (14–20€), Zaragoza (9–13€), Tarragona (5–8€). 0% comisión, pago Bizum.`,
    keywords: `manuel turizo ${YEAR}, manuel turizo concierto españa ${YEAR}, manuel turizo madrid, manuel turizo wizink, manuel turizo palau sant jordi, manuel turizo barcelona, mtz manuel turizo, manuel turizo la bachata, manuel turizo una lady como tu, carpooling manuel turizo, reggaeton colombia turizo`,
  },
  "feid": {
    title: `Feid concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Feid en España ${YEAR} — estadios y pabellones de Madrid y Barcelona. Carpooling sin comisión desde Valencia (10–14€), Sevilla (12–17€), Zaragoza (9–13€). Conductores verificados, vuelta de madrugada coordinada. 0% comisión.`,
    keywords: `carpooling feid españa, feid concierto madrid carpooling, feid ${YEAR} transporte, viaje compartido feid, como ir concierto feid, feid gira ${YEAR} españa, feid tour españa`,
  },
  "rauw-alejandro": {
    title: `Rauw Alejandro España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Rauw Alejandro en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona, Roig Arena Valencia. Carpooling sin comisión desde Valencia (10–14€), Sevilla (12–17€), Zaragoza (9–13€). 0% comisión, conductores verificados.`,
    keywords: `carpooling rauw alejandro españa, rauw alejandro madrid como llegar, rauw alejandro ${YEAR} transporte, viaje compartido rauw alejandro, como ir concierto rauw alejandro, rauw alejandro gira españa ${YEAR}`,
  },
  "morat": {
    title: `Morat España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Morat en España ${YEAR} — WiZink Center Madrid, Palau Sant Jordi Barcelona. Carpooling sin comisión desde Valencia (10–14€), Bilbao (11–16€), Zaragoza (9–13€). 0% comisión.`,
    keywords: `carpooling morat españa, morat concierto madrid ${YEAR}, morat wizink center carpooling, morat ${YEAR} transporte, viaje compartido morat, como ir concierto morat`,
  },
  "leiva": {
    title: `Leiva concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Leiva en España ${YEAR} — WiZink Center Madrid y teatros/pabellones nacionales. Carpooling sin comisión desde Toledo (4–7€), Zaragoza (9–13€), Valencia (10–14€), Sevilla (12–17€). 0% comisión, conductores verificados.`,
    keywords: `carpooling leiva españa, leiva concierto madrid ${YEAR}, leiva wizink center carpooling, leiva ${YEAR} transporte, viaje compartido leiva, como ir concierto leiva, leiva gira ${YEAR}`,
  },
  "beret": {
    title: `Beret concierto España ${YEAR}: carpooling desde 4€ | ConcertRide`,
    description: `Beret en España ${YEAR} — recintos de Madrid, Sevilla, Valencia y Barcelona. Carpooling sin comisión desde Córdoba (4–6€), Cádiz (5–7€), Almería (6–9€), Málaga (5–8€). 0% comisión, conductores verificados.`,
    keywords: `carpooling beret españa, beret concierto ${YEAR}, beret transporte, viaje compartido beret, como ir concierto beret, beret gira ${YEAR} españa`,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE PAGE TITLE IMPROVEMENTS
// ─────────────────────────────────────────────────────────────────────────────

export const ROUTE_SEO_IMPROVEMENTS: Record<string, { title: string; description?: string; keywords?: string }> = {
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
  "a-coruna-o-son-do-camino": {
    title: `Carpooling A Coruña → O Son do Camiño ${YEAR}: Desde 3€ | 75 km | ConcertRide`,
    keywords: `carpooling a coruña o son do camiño, viaje compartido a coruña santiago festival, como ir o son do camino desde a coruña, monte do gozo desde a coruña`,
  },
  "vigo-o-son-do-camino": {
    title: `Vigo → O Son do Camiño Santiago ${YEAR}: carpooling 1h 30 min desde 4€ | ConcertRide`,
    description: `Carpooling de Vigo a O Son do Camiño Santiago ${YEAR} (Monte do Gozo, 90 km, 1h 30 min). Precio estimado: 4–7€/asiento sin comisión. Lanzadera gratuita desde Santiago centro al Monte do Gozo. Vuelta de madrugada coordinada. 0% comisión.`,
    keywords: `vigo o son do camino carpooling, vigo santiago festival viaje compartido, vigo o son do camino ${YEAR}, carpooling galicia festival santiago, carpooling vigo o son do camiño, viaje compartido vigo santiago festival, como ir o son do camino desde vigo, o son do camiño desde vigo`,
  },
  "ourense-o-son-do-camino": {
    title: `Carpooling Ourense → O Son do Camiño ${YEAR}: Desde 5€ | 110 km | ConcertRide`,
    keywords: `carpooling ourense o son do camiño, viaje compartido ourense santiago festival, como ir o son do camino desde ourense`,
  },
  "oviedo-o-son-do-camino": {
    title: `Carpooling Oviedo → O Son do Camiño ${YEAR}: Desde 9€ | 295 km | ConcertRide`,
    keywords: `carpooling oviedo o son do camiño, viaje compartido oviedo santiago festival, como ir o son do camino desde oviedo, asturias santiago festival`,
  },
  // ── Sonorama Ribera (más rutas) ─────────────────────────────────────────
  "burgos-sonorama-ribera": {
    title: `Carpooling Burgos → Sonorama Ribera ${YEAR}: Desde 3€ | 75 km | ConcertRide`,
    keywords: `carpooling burgos sonorama ribera, viaje compartido burgos aranda de duero, sonorama desde burgos, como ir sonorama ribera desde burgos`,
  },
  "bilbao-sonorama-ribera": {
    title: `Carpooling Bilbao → Sonorama Ribera ${YEAR}: Desde 5€ | 165 km | ConcertRide`,
    keywords: `carpooling bilbao sonorama ribera, viaje compartido bilbao aranda sonorama, sonorama desde bilbao, como ir sonorama ribera desde bilbao`,
  },
  "zaragoza-sonorama-ribera": {
    title: `Carpooling Zaragoza → Sonorama Ribera ${YEAR}: Desde 9€ | 320 km | ConcertRide`,
    keywords: `carpooling zaragoza sonorama ribera, viaje compartido zaragoza aranda de duero sonorama, sonorama desde zaragoza`,
  },
  // ── Medusa Festival local hub ───────────────────────────────────────────
  "valencia-medusa-festival": {
    title: `Carpooling Valencia → Medusa Festival Cullera ${YEAR}: Desde 3€ | 60 km | ConcertRide`,
    keywords: `carpooling valencia medusa festival, viaje compartido valencia cullera medusa, como ir medusa festival desde valencia, medusa festival lanzadera valencia, medusa cullera desde valencia`,
  },
  // ── FIB desde Alicante (mediterráneo sur) ──────────────────────────────
  "alicante-fib": {
    title: `Carpooling Alicante → FIB Benicàssim ${YEAR}: Desde 5€ | 195 km | ConcertRide`,
    keywords: `carpooling alicante fib benicassim, viaje compartido alicante fib, como ir fib desde alicante, fib desde alicante`,
  },
  // ── Medusa Festival ─────────────────────────────────────────────────────────
  "madrid-medusa-festival": {
    title: `Carpooling Madrid → Medusa Festival Cullera ${YEAR}: Desde 15€ | 390 km | ConcertRide`,
    keywords: `carpooling madrid medusa festival, viaje compartido madrid cullera medusa, como ir medusa festival desde madrid, transporte madrid medusa ${YEAR}`,
  },
  "barcelona-medusa-festival": {
    title: `Carpooling Barcelona → Medusa Festival Cullera ${YEAR}: Desde 10€ | 305 km | ConcertRide`,
    keywords: `carpooling barcelona medusa festival, viaje compartido barcelona cullera, como ir medusa festival desde barcelona, medusa festival desde barcelona`,
  },
  "murcia-vina-rock": {
    title: `Carpooling Murcia → Viña Rock ${YEAR}: Desde 8€ | 155 km | ConcertRide`,
    keywords: `carpooling murcia viña rock, viaje compartido murcia villarrobledo, como ir viña rock desde murcia, bus murcia viña rock`,
  },
  // ── Primavera Sound (más ciudades) ─────────────────────────────────────────
  "zaragoza-primavera-sound": {
    title: `Carpooling Zaragoza → Primavera Sound Barcelona ${YEAR}: Desde 8€ | 296 km | ConcertRide`,
    keywords: `carpooling zaragoza primavera sound, viaje compartido zaragoza barcelona primavera sound, como ir primavera sound desde zaragoza`,
  },
  "bilbao-primavera-sound": {
    title: `Carpooling Bilbao → Primavera Sound Barcelona ${YEAR}: Desde 12€ | 510 km | ConcertRide`,
    keywords: `carpooling bilbao primavera sound, viaje compartido bilbao barcelona festival, como ir primavera sound desde bilbao`,
  },
  // ── Mad Cool (más ciudades) ─────────────────────────────────────────────────
  "sevilla-mad-cool": {
    title: `Carpooling Sevilla → Mad Cool Madrid ${YEAR}: Desde 10€ | 530 km | ConcertRide`,
    keywords: `carpooling sevilla mad cool, viaje compartido sevilla madrid mad cool, como ir mad cool desde sevilla, mad cool desde sevilla transporte, carpooling andalucia mad cool`,
  },
  "bilbao-mad-cool": {
    title: `Carpooling Bilbao → Mad Cool Madrid ${YEAR}: Desde 11€ | 395 km | ConcertRide`,
    keywords: `carpooling bilbao mad cool, viaje compartido bilbao madrid mad cool, como ir mad cool desde bilbao`,
  },
  // ── Sónar (más ciudades) ────────────────────────────────────────────────────
  "zaragoza-sonar": {
    title: `Carpooling Zaragoza → Sónar Barcelona ${YEAR}: Desde 8€ | 296 km | ConcertRide`,
    keywords: `carpooling zaragoza sonar, viaje compartido zaragoza barcelona sonar, como ir sonar desde zaragoza`,
  },
  "valencia-sonar": {
    title: `Carpooling Valencia → Sónar Barcelona ${YEAR}: Desde 10€ | 355 km | ConcertRide`,
    keywords: `carpooling valencia sonar barcelona, viaje compartido valencia sonar, como ir sonar desde valencia`,
  },
  // ── Cruïlla ─────────────────────────────────────────────────────────────────
  "madrid-cruilla": {
    title: `Carpooling Madrid → Cruïlla Barcelona ${YEAR}: Desde 15€ | 620 km | ConcertRide`,
    keywords: `carpooling madrid cruilla, viaje compartido madrid barcelona cruilla, como ir cruilla desde madrid, transporte madrid cruilla ${YEAR}`,
  },
  "valencia-cruilla": {
    title: `Carpooling Valencia → Cruïlla Barcelona ${YEAR}: Desde 10€ | 355 km | ConcertRide`,
    keywords: `carpooling valencia cruilla barcelona, viaje compartido valencia cruilla, como ir cruilla desde valencia`,
  },
  "zaragoza-cruilla": {
    title: `Carpooling Zaragoza → Cruïlla Barcelona ${YEAR}: Desde 8€ | 296 km | ConcertRide`,
    keywords: `carpooling zaragoza cruilla, viaje compartido zaragoza barcelona cruilla, como ir cruilla desde zaragoza`,
  },
  // ── Tomavistas ──────────────────────────────────────────────────────────────
  "barcelona-tomavistas": {
    title: `Carpooling Barcelona → Tomavistas Madrid ${YEAR}: Desde 15€ | 620 km | ConcertRide`,
    keywords: `carpooling barcelona tomavistas, viaje compartido barcelona madrid tomavistas, como ir tomavistas desde barcelona`,
  },
  "valencia-tomavistas": {
    title: `Carpooling Valencia → Tomavistas Madrid ${YEAR}: Desde 10€ | 355 km | ConcertRide`,
    keywords: `carpooling valencia tomavistas madrid, viaje compartido valencia tomavistas, como ir tomavistas desde valencia`,
  },
  "zaragoza-tomavistas": {
    title: `Carpooling Zaragoza → Tomavistas Madrid ${YEAR}: Desde 9€ | 325 km | ConcertRide`,
    keywords: `carpooling zaragoza tomavistas, viaje compartido zaragoza madrid tomavistas`,
  },
  // ── Low Festival ────────────────────────────────────────────────────────────
  "madrid-low-festival": {
    title: `Carpooling Madrid → Low Festival Benidorm ${YEAR}: Desde 14€ | 420 km | ConcertRide`,
    keywords: `carpooling madrid low festival benidorm, viaje compartido madrid benidorm low festival, como ir low festival desde madrid`,
  },
  "barcelona-low-festival": {
    title: `Carpooling Barcelona → Low Festival Benidorm ${YEAR}: Desde 12€ | 480 km | ConcertRide`,
    keywords: `carpooling barcelona low festival benidorm, viaje compartido barcelona benidorm, como ir low festival desde barcelona`,
  },
  "valencia-low-festival": {
    title: `Carpooling Valencia → Low Festival Benidorm ${YEAR}: Desde 8€ | 150 km | ConcertRide`,
    keywords: `carpooling valencia low festival benidorm, viaje compartido valencia benidorm low festival, como ir low festival desde valencia`,
  },
  // ── Cala Mijas (más ciudades) ───────────────────────────────────────────────
  "sevilla-cala-mijas": {
    title: `Carpooling Sevilla → Cala Mijas Festival ${YEAR}: Desde 7€ | 215 km | ConcertRide`,
    keywords: `carpooling sevilla cala mijas, viaje compartido sevilla mijas festival, como ir cala mijas desde sevilla`,
  },
  "granada-cala-mijas": {
    title: `Carpooling Granada → Cala Mijas Festival ${YEAR}: Desde 5€ | 125 km | ConcertRide`,
    keywords: `carpooling granada cala mijas, viaje compartido granada cala mijas festival, como ir cala mijas desde granada`,
  },
  // ── Sonorama Ribera (más ciudades) ─────────────────────────────────────────
  "madrid-sonorama-ribera": {
    title: `Carpooling Madrid → Sonorama Ribera ${YEAR}: Desde 8€ | 160 km | ConcertRide`,
    keywords: `carpooling madrid sonorama ribera, viaje compartido madrid aranda de duero sonorama, como ir sonorama desde madrid`,
  },
  "valladolid-sonorama-ribera": {
    title: `Carpooling Valladolid → Sonorama Ribera ${YEAR}: Desde 4€ | 95 km | ConcertRide`,
    keywords: `carpooling valladolid sonorama ribera, viaje compartido valladolid aranda sonorama, como ir sonorama desde valladolid`,
  },
  // ── Resurrection Fest (más ciudades) ────────────────────────────────────────
  "barcelona-resurrection-fest": {
    title: `Carpooling Barcelona → Resurrection Fest ${YEAR}: Desde 18€ | 890 km | ConcertRide`,
    keywords: `carpooling barcelona resurrection fest, viaje compartido barcelona viveiro resurrection fest, como ir resurrection fest desde barcelona`,
  },
  "donostia-resurrection-fest": {
    title: `Carpooling Donostia → Resurrection Fest ${YEAR}: Desde 10€ | 430 km | ConcertRide`,
    keywords: `carpooling donostia resurrection fest, viaje compartido san sebastian viveiro resurrection fest`,
  },
  // ── Vive Latino Zaragoza ─────────────────────────────────────────────────────
  "madrid-vive-latino": {
    title: `Carpooling Madrid → Vive Latino Zaragoza ${YEAR}: Desde 9€ | 330 km | ConcertRide`,
    keywords: `carpooling madrid vive latino zaragoza, viaje compartido madrid zaragoza vive latino, como ir vive latino desde madrid, transporte vive latino madrid ${YEAR}`,
  },
  "barcelona-vive-latino": {
    title: `Carpooling Barcelona → Vive Latino Zaragoza ${YEAR}: Desde 8€ | 306 km | ConcertRide`,
    keywords: `carpooling barcelona vive latino zaragoza, viaje compartido barcelona zaragoza vive latino, como ir vive latino desde barcelona`,
  },
  "valencia-vive-latino": {
    title: `Carpooling Valencia → Vive Latino Zaragoza ${YEAR}: Desde 9€ | 325 km | ConcertRide`,
    keywords: `carpooling valencia vive latino zaragoza, viaje compartido valencia zaragoza vive latino, como ir vive latino desde valencia`,
  },
  "bilbao-vive-latino": {
    title: `Carpooling Bilbao → Vive Latino Zaragoza ${YEAR}: Desde 9€ | 324 km | ConcertRide`,
    keywords: `carpooling bilbao vive latino zaragoza, viaje compartido bilbao zaragoza vive latino, como ir vive latino desde bilbao`,
  },
  "pamplona-vive-latino": {
    title: `Carpooling Pamplona → Vive Latino Zaragoza ${YEAR}: Desde 5€ | 177 km | ConcertRide`,
    keywords: `carpooling pamplona vive latino zaragoza, viaje compartido pamplona zaragoza vive latino, vive latino desde pamplona`,
  },
  // ── Festival de les Arts Valencia ────────────────────────────────────────────
  "madrid-festival-de-les-arts": {
    title: `Carpooling Madrid → Festival de les Arts Valencia ${YEAR}: Desde 10€ | 355 km | ConcertRide`,
    keywords: `carpooling madrid festival les arts valencia, viaje compartido madrid valencia festival les arts, como ir festival les arts desde madrid`,
  },
  "alicante-festival-de-les-arts": {
    title: `Carpooling Alicante → Festival de les Arts Valencia ${YEAR}: Desde 5€ | 166 km | ConcertRide`,
    keywords: `carpooling alicante festival les arts, viaje compartido alicante valencia festival les arts, como ir festival les arts desde alicante`,
  },
  "barcelona-festival-de-les-arts": {
    title: `Carpooling Barcelona → Festival de les Arts Valencia ${YEAR}: Desde 10€ | 349 km | ConcertRide`,
    keywords: `carpooling barcelona festival les arts valencia, viaje compartido barcelona valencia festival les arts, festival les arts desde barcelona`,
  },
  "murcia-festival-de-les-arts": {
    title: `Carpooling Murcia → Festival de les Arts Valencia ${YEAR}: Desde 7€ | 248 km | ConcertRide`,
    keywords: `carpooling murcia festival les arts, viaje compartido murcia valencia festival les arts, festival les arts desde murcia`,
  },
  // ── Mad Cool desde Andalucía ──────────────────────────────────────────────────
  "malaga-mad-cool": {
    title: `Carpooling Málaga → Mad Cool Madrid ${YEAR}: Desde 14€ | 545 km | ConcertRide`,
    keywords: `carpooling malaga mad cool, viaje compartido malaga madrid mad cool, como ir mad cool desde malaga, mad cool desde malaga, carpooling andalucia mad cool`,
  },
  "cadiz-mad-cool": {
    title: `Carpooling Cádiz → Mad Cool Madrid ${YEAR}: Desde 12€ | 650 km | ConcertRide`,
    keywords: `carpooling cadiz mad cool, viaje compartido cadiz madrid mad cool, como ir mad cool desde cadiz, mad cool cadiz transporte`,
  },
  "granada-mad-cool": {
    title: `Carpooling Granada → Mad Cool Madrid ${YEAR}: Desde 12€ | 435 km | ConcertRide`,
    keywords: `carpooling granada mad cool, viaje compartido granada madrid mad cool, como ir mad cool desde granada, mad cool granada carpooling`,
  },
  // ── Medusa Festival desde más ciudades ───────────────────────────────────────
  "alicante-medusa-festival": {
    title: `Carpooling Alicante → Medusa Festival Cullera ${YEAR}: Desde 5€ | 90 km | ConcertRide`,
    keywords: `carpooling alicante medusa festival, viaje compartido alicante cullera medusa, como ir medusa festival desde alicante, medusa festival desde alicante`,
  },
  "murcia-medusa-festival": {
    title: `Carpooling Murcia → Medusa Festival Cullera ${YEAR}: Desde 5€ | 175 km | ConcertRide`,
    keywords: `carpooling murcia medusa festival, viaje compartido murcia cullera medusa, como ir medusa festival desde murcia`,
  },
  "zaragoza-medusa-festival": {
    title: `Carpooling Zaragoza → Medusa Festival Cullera ${YEAR}: Desde 10€ | 345 km | ConcertRide`,
    keywords: `carpooling zaragoza medusa festival, viaje compartido zaragoza cullera medusa, como ir medusa festival desde zaragoza`,
  },
  // ── Cala Mijas desde más ciudades ──────────────────────────────────────────
  "cadiz-cala-mijas": {
    title: `Carpooling Cádiz → Cala Mijas Festival ${YEAR}: Desde 8€ | 235 km | ConcertRide`,
    keywords: `carpooling cadiz cala mijas, viaje compartido cadiz mijas festival, como ir cala mijas desde cadiz`,
  },
  "cordoba-cala-mijas": {
    title: `Carpooling Córdoba → Cala Mijas Festival ${YEAR}: Desde 6€ | 175 km | ConcertRide`,
    keywords: `carpooling cordoba cala mijas, viaje compartido cordoba cala mijas festival, cala mijas desde cordoba`,
  },
  // ── Festival de Ortigueira (Galicia, gratuito) ─────────────────────────
  "a-coruna-festival-ortigueira": {
    title: `Carpooling A Coruña → Festival Ortigueira ${YEAR}: Desde 4€ | 100 km | ConcertRide`,
    keywords: `carpooling a coruña festival ortigueira, viaje compartido a coruña ortigueira, como ir ortigueira desde a coruña, festival celta ortigueira a coruña`,
  },
  "lugo-festival-ortigueira": {
    title: `Carpooling Lugo → Festival Ortigueira ${YEAR}: Desde 4€ | 110 km | ConcertRide`,
    keywords: `carpooling lugo festival ortigueira, viaje compartido lugo ortigueira, como ir ortigueira desde lugo, festival celta lugo`,
  },
  "vigo-festival-ortigueira": {
    title: `Carpooling Vigo → Festival Ortigueira ${YEAR}: Desde 6€ | 195 km | ConcertRide`,
    keywords: `carpooling vigo festival ortigueira, viaje compartido vigo ortigueira, como ir ortigueira desde vigo, festival celta vigo`,
  },
  "santiago-de-compostela-festival-ortigueira": {
    title: `Carpooling Santiago → Festival Ortigueira ${YEAR}: Desde 5€ | 130 km | ConcertRide`,
    keywords: `carpooling santiago festival ortigueira, viaje compartido santiago ortigueira, como ir ortigueira desde santiago, ortigueira desde compostela`,
  },
  "pontevedra-festival-ortigueira": {
    title: `Carpooling Pontevedra → Festival Ortigueira ${YEAR}: Desde 6€ | 175 km | ConcertRide`,
    keywords: `carpooling pontevedra festival ortigueira, viaje compartido pontevedra ortigueira`,
  },
  "ourense-festival-ortigueira": {
    title: `Carpooling Ourense → Festival Ortigueira ${YEAR}: Desde 8€ | 240 km | ConcertRide`,
    keywords: `carpooling ourense festival ortigueira, viaje compartido ourense ortigueira, ortigueira desde ourense`,
  },
  "oviedo-festival-ortigueira": {
    title: `Carpooling Oviedo → Festival Ortigueira ${YEAR}: Desde 9€ | 280 km | ConcertRide`,
    keywords: `carpooling oviedo festival ortigueira, viaje compartido oviedo ortigueira, asturias ortigueira festival`,
  },
  "madrid-festival-ortigueira": {
    title: `Carpooling Madrid → Festival Ortigueira ${YEAR}: Desde 18€ | 690 km | ConcertRide`,
    keywords: `carpooling madrid festival ortigueira, viaje compartido madrid ortigueira, como ir ortigueira desde madrid, festival celta madrid ortigueira`,
  },
  // ── Heineken Jazzaldia (Donostia–San Sebastián) ─────────────────────────
  "bilbao-jazzaldia": {
    title: `Carpooling Bilbao → Jazzaldia ${YEAR}: Desde 4€ | 100 km | ConcertRide`,
    keywords: `carpooling bilbao jazzaldia, viaje compartido bilbao donostia jazzaldia, como ir jazzaldia desde bilbao, festival jazz bilbao donostia`,
  },
  "vitoria-gasteiz-jazzaldia": {
    title: `Carpooling Vitoria → Jazzaldia ${YEAR}: Desde 5€ | 115 km | ConcertRide`,
    keywords: `carpooling vitoria jazzaldia, viaje compartido vitoria donostia jazzaldia, jazzaldia desde vitoria`,
  },
  "pamplona-jazzaldia": {
    title: `Carpooling Pamplona → Jazzaldia ${YEAR}: Desde 4€ | 90 km | ConcertRide`,
    keywords: `carpooling pamplona jazzaldia, viaje compartido pamplona donostia jazzaldia, jazzaldia desde pamplona`,
  },
  "logrono-jazzaldia": {
    title: `Carpooling Logroño → Jazzaldia ${YEAR}: Desde 6€ | 175 km | ConcertRide`,
    keywords: `carpooling logroño jazzaldia, viaje compartido logroño donostia jazzaldia, jazzaldia desde logroño`,
  },
  "santander-jazzaldia": {
    title: `Carpooling Santander → Jazzaldia ${YEAR}: Desde 7€ | 200 km | ConcertRide`,
    keywords: `carpooling santander jazzaldia, viaje compartido santander donostia jazzaldia, jazzaldia desde santander`,
  },
  "burgos-jazzaldia": {
    title: `Carpooling Burgos → Jazzaldia ${YEAR}: Desde 8€ | 245 km | ConcertRide`,
    keywords: `carpooling burgos jazzaldia, viaje compartido burgos donostia jazzaldia, jazzaldia desde burgos`,
  },
  "zaragoza-jazzaldia": {
    title: `Carpooling Zaragoza → Jazzaldia ${YEAR}: Desde 8€ | 270 km | ConcertRide`,
    keywords: `carpooling zaragoza jazzaldia, viaje compartido zaragoza donostia jazzaldia, jazzaldia desde zaragoza`,
  },
  "madrid-jazzaldia": {
    title: `Carpooling Madrid → Jazzaldia ${YEAR}: Desde 13€ | 450 km | ConcertRide`,
    keywords: `carpooling madrid jazzaldia, viaje compartido madrid donostia jazzaldia, como ir jazzaldia desde madrid, festival jazz madrid donostia`,
  },
  "barcelona-jazzaldia": {
    title: `Carpooling Barcelona → Jazzaldia ${YEAR}: Desde 14€ | 530 km | ConcertRide`,
    keywords: `carpooling barcelona jazzaldia, viaje compartido barcelona donostia jazzaldia, jazzaldia desde barcelona`,
  },
  // ── Metrópoli Gijón ─────────────────────────────────────────────────────
  "oviedo-metropoli-gijon": {
    title: `Carpooling Oviedo → Metrópoli Gijón ${YEAR}: Desde 3€ | 30 km | ConcertRide`,
    keywords: `carpooling oviedo metropoli gijon, viaje compartido oviedo gijon metropoli, metropoli desde oviedo, festival gijon desde oviedo`,
  },
  "leon-metropoli-gijon": {
    title: `Carpooling León → Metrópoli Gijón ${YEAR}: Desde 5€ | 120 km | ConcertRide`,
    keywords: `carpooling leon metropoli gijon, viaje compartido leon gijon metropoli, metropoli desde leon`,
  },
  "santander-metropoli-gijon": {
    title: `Carpooling Santander → Metrópoli Gijón ${YEAR}: Desde 6€ | 190 km | ConcertRide`,
    keywords: `carpooling santander metropoli gijon, viaje compartido santander gijon metropoli, metropoli desde santander`,
  },
  "bilbao-metropoli-gijon": {
    title: `Carpooling Bilbao → Metrópoli Gijón ${YEAR}: Desde 9€ | 290 km | ConcertRide`,
    keywords: `carpooling bilbao metropoli gijon, viaje compartido bilbao gijon metropoli, metropoli desde bilbao`,
  },
  "valladolid-metropoli-gijon": {
    title: `Carpooling Valladolid → Metrópoli Gijón ${YEAR}: Desde 8€ | 240 km | ConcertRide`,
    keywords: `carpooling valladolid metropoli gijon, viaje compartido valladolid gijon metropoli`,
  },
  "a-coruna-metropoli-gijon": {
    title: `Carpooling A Coruña → Metrópoli Gijón ${YEAR}: Desde 9€ | 290 km | ConcertRide`,
    keywords: `carpooling a coruña metropoli gijon, viaje compartido a coruña gijon metropoli`,
  },
  "vigo-metropoli-gijon": {
    title: `Carpooling Vigo → Metrópoli Gijón ${YEAR}: Desde 11€ | 360 km | ConcertRide`,
    keywords: `carpooling vigo metropoli gijon, viaje compartido vigo gijon metropoli`,
  },
  "madrid-metropoli-gijon": {
    title: `Carpooling Madrid → Metrópoli Gijón ${YEAR}: Desde 13€ | 445 km | ConcertRide`,
    keywords: `carpooling madrid metropoli gijon, viaje compartido madrid gijon metropoli, como ir metropoli desde madrid, festival gijon desde madrid`,
  },
  // ── Granada Sound ───────────────────────────────────────────────────────
  "malaga-granada-sound": {
    title: `Carpooling Málaga → Granada Sound ${YEAR}: Desde 5€ | 130 km | ConcertRide`,
    keywords: `carpooling malaga granada sound, viaje compartido malaga granada sound, como ir granada sound desde malaga, festival granada desde malaga`,
  },
  "almeria-granada-sound": {
    title: `Carpooling Almería → Granada Sound ${YEAR}: Desde 6€ | 170 km | ConcertRide`,
    keywords: `carpooling almeria granada sound, viaje compartido almeria granada sound, granada sound desde almeria`,
  },
  "cordoba-granada-sound": {
    title: `Carpooling Córdoba → Granada Sound ${YEAR}: Desde 7€ | 200 km | ConcertRide`,
    keywords: `carpooling cordoba granada sound, viaje compartido cordoba granada sound, granada sound desde cordoba`,
  },
  "sevilla-granada-sound": {
    title: `Carpooling Sevilla → Granada Sound ${YEAR}: Desde 8€ | 250 km | ConcertRide`,
    keywords: `carpooling sevilla granada sound, viaje compartido sevilla granada sound, como ir granada sound desde sevilla, festival andalucia oriental`,
  },
  "jaen-granada-sound": {
    title: `Carpooling Jaén → Granada Sound ${YEAR}: Desde 4€ | 95 km | ConcertRide`,
    keywords: `carpooling jaen granada sound, viaje compartido jaen granada sound, granada sound desde jaen`,
  },
  "murcia-granada-sound": {
    title: `Carpooling Murcia → Granada Sound ${YEAR}: Desde 8€ | 270 km | ConcertRide`,
    keywords: `carpooling murcia granada sound, viaje compartido murcia granada sound, granada sound desde murcia`,
  },
  "alicante-granada-sound": {
    title: `Carpooling Alicante → Granada Sound ${YEAR}: Desde 10€ | 350 km | ConcertRide`,
    keywords: `carpooling alicante granada sound, viaje compartido alicante granada sound, granada sound desde alicante`,
  },
  "cadiz-granada-sound": {
    title: `Carpooling Cádiz → Granada Sound ${YEAR}: Desde 8€ | 280 km | ConcertRide`,
    keywords: `carpooling cadiz granada sound, viaje compartido cadiz granada sound, granada sound desde cadiz`,
  },
  "madrid-granada-sound": {
    title: `Carpooling Madrid → Granada Sound ${YEAR}: Desde 12€ | 430 km | ConcertRide`,
    keywords: `carpooling madrid granada sound, viaje compartido madrid granada sound, como ir granada sound desde madrid, festival indie granada desde madrid`,
  },
  // ── GSC-driven — high-impression routes that lacked overrides ─────────────
  "castellon-de-la-plana-arenal-sound": {
    title: `Carpooling Castellón → Arenal Sound ${YEAR}: Desde 3€ | 10 km | ConcertRide`,
    keywords: `carpooling castellon arenal sound, autobus castellon de la plana arenal sound, viaje compartido castellon burriana, como ir arenal sound desde castellon, castellon de la plana burriana lanzadera, arenal sound bus castellon`,
  },
  "donostia-san-sebastian-bbk-live": {
    title: `Carpooling Donostia–San Sebastián → BBK Live ${YEAR}: Desde 4€ | 100 km | ConcertRide`,
    keywords: `carpooling donostia san sebastian bbk live, viaje compartido san sebastian bilbao bbk live, como ir bbk live desde donostia, bbk live desde san sebastian, donostia bilbao carpooling`,
  },
  "centro-de-bilbao-bbk-live": {
    title: `Carpooling Centro Bilbao → BBK Live Kobetamendi ${YEAR}: Desde 3€ | 4 km | ConcertRide`,
    keywords: `carpooling centro bilbao bbk live, viaje compartido bilbao centro kobetamendi, lanzadera bbk live moyua, bbk live como llegar desde bilbao, bilbao centro festival`,
  },
  "valencia-centro-zevra-festival": {
    title: `Carpooling Valencia Centro → Zevra Festival ${YEAR}: Desde 3€ | 5 km | ConcertRide`,
    keywords: `carpooling valencia centro zevra festival, viaje compartido valencia ciudad la marina zevra, zevra desde valencia centro, marina valencia carpooling`,
  },
  // Catalan/Aragón hubs missing overrides
  "lleida-cruilla": {
    title: `Carpooling Lleida → Cruïlla Barcelona ${YEAR}: Desde 5€ | 165 km | ConcertRide`,
    keywords: `carpooling lleida cruilla, viaje compartido lleida barcelona cruilla, como ir cruilla desde lleida, lleida festival barcelona`,
  },
  "lleida-primavera-sound": {
    title: `Carpooling Lleida → Primavera Sound ${YEAR}: Desde 5€ | 165 km | ConcertRide`,
    keywords: `carpooling lleida primavera sound, viaje compartido lleida barcelona primavera sound, primavera sound desde lleida`,
  },
  "girona-cruilla": {
    title: `Carpooling Girona → Cruïlla Barcelona ${YEAR}: Desde 4€ | 105 km | ConcertRide`,
    keywords: `carpooling girona cruilla, viaje compartido girona barcelona cruilla, como ir cruilla desde girona, girona festival barcelona`,
  },
  "girona-sonar": {
    title: `Girona → Sónar Barcelona ${YEAR}: carpooling 1h 15 min desde 5€ | ConcertRide`,
    description: `Carpooling de Girona a Sónar Barcelona ${YEAR} (Fira Montjuïc + Gran Via, 100 km, 1h 15 min). Precio estimado: 5–8€/asiento sin comisión. También tren desde Girona a Barcelona Sants (40 min, 14€). Metro L9 al recinto. 0% comisión.`,
    keywords: `girona sonar barcelona carpooling, girona sonar festival viaje compartido, girona sonar ${YEAR}, carpooling girona festival barcelona, carpooling girona sonar, viaje compartido girona barcelona sonar, sonar desde girona, girona electronica festival`,
  },
  "girona-primavera-sound": {
    title: `Carpooling Girona → Primavera Sound ${YEAR}: Desde 4€ | 105 km | ConcertRide`,
    keywords: `carpooling girona primavera sound, viaje compartido girona barcelona primavera sound, primavera sound desde girona`,
  },
  "girona-o-son-do-camino": {
    title: `Carpooling Girona → O Son do Camiño ${YEAR}: Desde 22€ | 1.030 km | ConcertRide`,
    keywords: `carpooling girona o son do camino, viaje compartido girona santiago festival, como ir o son do camino desde girona`,
  },
  // Cuenca / Castilla-La Mancha
  "cuenca-vina-rock": {
    title: `Cuenca → Viña Rock ${YEAR}: carpooling 2h desde 5€ | ConcertRide`,
    description: `Carpooling de Cuenca a Viña Rock ${YEAR} (La Pulgosa Villarrobledo, 200 km, 2h 10 min). Precio estimado: 5–8€/asiento sin comisión. Ruta directa por la A-40. Vuelta de madrugada coordinada. 0% comisión.`,
    keywords: `cuenca vina rock carpooling, cuenca villarrobledo festival viaje compartido, cuenca vina rock ${YEAR}, carpooling castilla la mancha festival, carpooling cuenca vina rock, viaje compartido cuenca villarrobledo, viña rock desde cuenca, como ir viña rock desde cuenca, bus cuenca viña rock`,
  },
  "toledo-fib": {
    title: `Carpooling Toledo → FIB Benicàssim ${YEAR}: Desde 11€ | 470 km | ConcertRide`,
    keywords: `carpooling toledo fib benicassim, viaje compartido toledo fib, fib desde toledo`,
  },
  "segovia-sonorama-ribera": {
    title: `Carpooling Segovia → Sonorama Ribera ${YEAR}: Desde 5€ | 130 km | ConcertRide`,
    keywords: `carpooling segovia sonorama ribera, viaje compartido segovia aranda de duero, sonorama desde segovia`,
  },
  // Andalucía routes missing overrides
  "fuengirola-cala-mijas": {
    title: `Carpooling Fuengirola → Cala Mijas Festival ${YEAR}: Desde 3€ | 10 km | ConcertRide`,
    keywords: `carpooling fuengirola cala mijas, viaje compartido fuengirola mijas festival, como ir cala mijas desde fuengirola, fuengirola cala mijas bus`,
  },
  "marbella-cala-mijas": {
    title: `Carpooling Marbella → Cala Mijas Festival ${YEAR}: Desde 3€ | 20 km | ConcertRide`,
    keywords: `carpooling marbella cala mijas, viaje compartido marbella mijas festival, como ir cala mijas desde marbella`,
  },
  "almeria-cala-mijas": {
    title: `Carpooling Almería → Cala Mijas Festival ${YEAR}: Desde 7€ | 200 km | ConcertRide`,
    keywords: `carpooling almeria cala mijas, viaje compartido almeria cala mijas, cala mijas desde almeria`,
  },
  "cartagena-cala-mijas": {
    title: `Carpooling Cartagena → Cala Mijas Festival ${YEAR}: Desde 8€ | 290 km | ConcertRide`,
    keywords: `carpooling cartagena cala mijas, viaje compartido cartagena mijas festival, cala mijas desde cartagena`,
  },
  "granada-resurrection-fest": {
    title: `Carpooling Granada → Resurrection Fest ${YEAR}: Desde 25€ | 990 km | ConcertRide`,
    keywords: `carpooling granada resurrection fest, viaje compartido granada viveiro, resurrection fest desde granada`,
  },
  "granada-primavera-sound": {
    title: `Carpooling Granada → Primavera Sound ${YEAR}: Desde 25€ | 870 km | ConcertRide`,
    keywords: `carpooling granada primavera sound, viaje compartido granada barcelona primavera sound, primavera sound desde granada`,
  },
  // Cantabria / La Rioja routes
  "santander-arenal-sound": {
    title: `Carpooling Santander → Arenal Sound ${YEAR}: Desde 18€ | 660 km | ConcertRide`,
    keywords: `carpooling santander arenal sound, viaje compartido santander burriana, arenal sound desde santander`,
  },
  "santander-sonar": {
    title: `Carpooling Santander → Sónar Barcelona ${YEAR}: Desde 18€ | 720 km | ConcertRide`,
    keywords: `carpooling santander sonar, viaje compartido santander barcelona sonar, sonar desde santander`,
  },
  "logrono-medusa-festival": {
    title: `Carpooling Logroño → Medusa Festival ${YEAR}: Desde 12€ | 470 km | ConcertRide`,
    keywords: `carpooling logroño medusa festival, viaje compartido logroño cullera medusa, medusa festival desde logroño`,
  },
  "logrono-o-son-do-camino": {
    title: `Carpooling Logroño → O Son do Camiño ${YEAR}: Desde 18€ | 685 km | ConcertRide`,
    keywords: `carpooling logroño o son do camino, viaje compartido logroño santiago festival, o son do camiño desde logroño`,
  },
  "burgos-resurrection-fest": {
    title: `Carpooling Burgos → Resurrection Fest ${YEAR}: Desde 13€ | 480 km | ConcertRide`,
    keywords: `carpooling burgos resurrection fest, viaje compartido burgos viveiro, resurrection fest desde burgos`,
  },
  // Asturias outbound (oviedo to multiple festivals)
  "oviedo-bbk-live": {
    title: `Carpooling Oviedo → BBK Live Bilbao ${YEAR}: Desde 9€ | 305 km | ConcertRide`,
    keywords: `carpooling oviedo bbk live, viaje compartido oviedo bilbao bbk live, bbk live desde oviedo, asturias bbk live`,
  },
  "oviedo-resurrection-fest": {
    title: `Carpooling Oviedo → Resurrection Fest ${YEAR}: Desde 7€ | 190 km | ConcertRide`,
    keywords: `carpooling oviedo resurrection fest, viaje compartido oviedo viveiro, resurrection fest desde oviedo, asturias resurrection fest`,
  },
  // Extremadura → Mediterranean
  "caceres-arenal-sound": {
    title: `Carpooling Cáceres → Arenal Sound ${YEAR}: Desde 18€ | 690 km | ConcertRide`,
    keywords: `carpooling caceres arenal sound, viaje compartido caceres burriana, arenal sound desde caceres`,
  },
  // Galicia local hub
  "pontevedra-o-son-do-camino": {
    title: `Carpooling Pontevedra → O Son do Camiño ${YEAR}: Desde 3€ | 55 km | ConcertRide`,
    keywords: `carpooling pontevedra o son do camino, viaje compartido pontevedra santiago festival, o son do camino desde pontevedra, monte do gozo desde pontevedra`,
  },
  "pontevedra-mad-cool": {
    title: `Carpooling Pontevedra → Mad Cool Madrid ${YEAR}: Desde 18€ | 600 km | ConcertRide`,
    keywords: `carpooling pontevedra mad cool, viaje compartido pontevedra madrid mad cool, mad cool desde pontevedra`,
  },
  // Levante hubs
  "valencia-bbk-live": {
    title: `Carpooling Valencia → BBK Live ${YEAR}: Desde 16€ | 615 km | ConcertRide`,
    keywords: `carpooling valencia bbk live, viaje compartido valencia bilbao bbk live, bbk live desde valencia`,
  },
  "alicante-bbk-live": {
    title: `Carpooling Alicante → BBK Live ${YEAR}: Desde 18€ | 770 km | ConcertRide`,
    keywords: `carpooling alicante bbk live, viaje compartido alicante bilbao bbk live, bbk live desde alicante`,
  },
  "pamplona-zevra-festival": {
    title: `Carpooling Pamplona → Zevra Festival Valencia ${YEAR}: Desde 13€ | 500 km | ConcertRide`,
    keywords: `carpooling pamplona zevra festival, viaje compartido pamplona valencia zevra, zevra desde pamplona`,
  },
  // ── Wave 9: routes from the 26 new origin cities ─────────────────────────
  // Aranda de Duero (Sonorama venue) → other festivals
  "aranda-de-duero-mad-cool": {
    title: `Carpooling Aranda → Mad Cool Madrid ${YEAR}: Desde 6€ | 160 km | ConcertRide`,
    keywords: `carpooling aranda de duero mad cool, viaje compartido aranda madrid mad cool, aranda mad cool, sonorama aranda mad cool`,
  },
  // Mijas as origin (Cala Mijas is local — but Mijas → other Andalucía festivals)
  "mijas-granada-sound": {
    title: `Carpooling Mijas → Granada Sound ${YEAR}: Desde 5€ | 145 km | ConcertRide`,
    keywords: `carpooling mijas granada sound, viaje compartido mijas granada festival, mijas granada sound`,
  },
  "mijas-mad-cool": {
    title: `Carpooling Mijas → Mad Cool Madrid ${YEAR}: Desde 14€ | 575 km | ConcertRide`,
    keywords: `carpooling mijas mad cool, viaje compartido mijas madrid, mijas mad cool desde costa del sol`,
  },
  // Marbella as origin
  "marbella-granada-sound": {
    title: `Carpooling Marbella → Granada Sound ${YEAR}: Desde 5€ | 155 km | ConcertRide`,
    keywords: `carpooling marbella granada sound, viaje compartido marbella granada festival, marbella granada sound`,
  },
  "marbella-mad-cool": {
    title: `Carpooling Marbella → Mad Cool Madrid ${YEAR}: Desde 15€ | 575 km | ConcertRide`,
    keywords: `carpooling marbella mad cool, viaje compartido marbella madrid mad cool, mad cool desde marbella, costa del sol mad cool`,
  },
  // Fuengirola as origin
  "fuengirola-granada-sound": {
    title: `Carpooling Fuengirola → Granada Sound ${YEAR}: Desde 5€ | 140 km | ConcertRide`,
    keywords: `carpooling fuengirola granada sound, viaje compartido fuengirola granada festival, fuengirola granada sound`,
  },
  "fuengirola-mad-cool": {
    title: `Carpooling Fuengirola → Mad Cool Madrid ${YEAR}: Desde 15€ | 555 km | ConcertRide`,
    keywords: `carpooling fuengirola mad cool, viaje compartido fuengirola madrid mad cool, mad cool desde fuengirola`,
  },
  // Jerez de la Frontera as origin
  "jerez-de-la-frontera-cala-mijas": {
    title: `Carpooling Jerez → Cala Mijas Festival ${YEAR}: Desde 7€ | 235 km | ConcertRide`,
    keywords: `carpooling jerez cala mijas, viaje compartido jerez mijas festival, cala mijas desde jerez de la frontera`,
  },
  "jerez-de-la-frontera-granada-sound": {
    title: `Carpooling Jerez → Granada Sound ${YEAR}: Desde 9€ | 320 km | ConcertRide`,
    keywords: `carpooling jerez granada sound, viaje compartido jerez granada festival, jerez granada sound`,
  },
  "jerez-de-la-frontera-mad-cool": {
    title: `Carpooling Jerez → Mad Cool Madrid ${YEAR}: Desde 16€ | 655 km | ConcertRide`,
    keywords: `carpooling jerez mad cool, viaje compartido jerez madrid mad cool, mad cool desde jerez de la frontera`,
  },
  // Cartagena as origin
  "cartagena-medusa-festival": {
    title: `Carpooling Cartagena → Medusa Festival Cullera ${YEAR}: Desde 6€ | 175 km | ConcertRide`,
    keywords: `carpooling cartagena medusa festival, viaje compartido cartagena cullera medusa, medusa festival desde cartagena`,
  },
  "cartagena-vina-rock": {
    title: `Carpooling Cartagena → Viña Rock ${YEAR}: Desde 7€ | 220 km | ConcertRide`,
    keywords: `carpooling cartagena vina rock, viaje compartido cartagena villarrobledo, viña rock desde cartagena`,
  },
  "cartagena-mad-cool": {
    title: `Carpooling Cartagena → Mad Cool Madrid ${YEAR}: Desde 13€ | 445 km | ConcertRide`,
    keywords: `carpooling cartagena mad cool, viaje compartido cartagena madrid mad cool, mad cool desde cartagena`,
  },
  // Elche as origin
  "elche-low-festival": {
    title: `Carpooling Elche → Low Festival Benidorm ${YEAR}: Desde 4€ | 75 km | ConcertRide`,
    keywords: `carpooling elche low festival, viaje compartido elche benidorm low festival, low festival desde elche`,
  },
  "elche-arenal-sound": {
    title: `Carpooling Elche → Arenal Sound ${YEAR}: Desde 5€ | 135 km | ConcertRide`,
    keywords: `carpooling elche arenal sound, viaje compartido elche burriana arenal, arenal sound desde elche`,
  },
  "elche-medusa-festival": {
    title: `Carpooling Elche → Medusa Festival Cullera ${YEAR}: Desde 5€ | 135 km | ConcertRide`,
    keywords: `carpooling elche medusa festival, viaje compartido elche cullera medusa, medusa desde elche`,
  },
  "elche-mad-cool": {
    title: `Carpooling Elche → Mad Cool Madrid ${YEAR}: Desde 12€ | 425 km | ConcertRide`,
    keywords: `carpooling elche mad cool, viaje compartido elche madrid mad cool, mad cool desde elche`,
  },
  // Benidorm as origin (besides Low Festival which is local)
  "benidorm-low-festival": {
    title: `Carpooling Benidorm → Low Festival ${YEAR}: Desde 3€ | 5 km local | ConcertRide`,
    keywords: `carpooling benidorm low festival, viaje compartido benidorm low festival, low festival desde benidorm centro`,
  },
  "benidorm-arenal-sound": {
    title: `Carpooling Benidorm → Arenal Sound Burriana ${YEAR}: Desde 5€ | 175 km | ConcertRide`,
    keywords: `carpooling benidorm arenal sound, viaje compartido benidorm burriana, arenal sound desde benidorm`,
  },
  "benidorm-medusa-festival": {
    title: `Carpooling Benidorm → Medusa Festival Cullera ${YEAR}: Desde 4€ | 125 km | ConcertRide`,
    keywords: `carpooling benidorm medusa festival, viaje compartido benidorm cullera, medusa desde benidorm`,
  },
  // Madrid metro suburbs → festivals
  "mostoles-mad-cool": {
    title: `Carpooling Móstoles → Mad Cool Madrid ${YEAR}: Desde 3€ | 35 km | ConcertRide`,
    keywords: `carpooling mostoles mad cool, viaje compartido mostoles ifema, mad cool desde mostoles, mostoles madrid carpooling`,
  },
  "mostoles-vina-rock": {
    title: `Carpooling Móstoles → Viña Rock ${YEAR}: Desde 7€ | 245 km | ConcertRide`,
    keywords: `carpooling mostoles vina rock, viaje compartido mostoles villarrobledo, viña rock desde mostoles`,
  },
  "alcala-de-henares-mad-cool": {
    title: `Carpooling Alcalá → Mad Cool Madrid ${YEAR}: Desde 3€ | 25 km | ConcertRide`,
    keywords: `carpooling alcala de henares mad cool, viaje compartido alcala ifema mad cool, mad cool desde alcala henares`,
  },
  "alcala-de-henares-sonorama-ribera": {
    title: `Carpooling Alcalá → Sonorama Ribera ${YEAR}: Desde 5€ | 130 km | ConcertRide`,
    keywords: `carpooling alcala de henares sonorama, viaje compartido alcala aranda sonorama, sonorama desde alcala henares`,
  },
  "getafe-mad-cool": {
    title: `Carpooling Getafe → Mad Cool Madrid ${YEAR}: Desde 3€ | 30 km | ConcertRide`,
    keywords: `carpooling getafe mad cool, viaje compartido getafe ifema, mad cool desde getafe, getafe madrid carpooling festival`,
  },
  "getafe-vina-rock": {
    title: `Carpooling Getafe → Viña Rock ${YEAR}: Desde 7€ | 235 km | ConcertRide`,
    keywords: `carpooling getafe vina rock, viaje compartido getafe villarrobledo, viña rock desde getafe`,
  },
  // Catalonia metro suburbs → festivals
  "sabadell-primavera-sound": {
    title: `Carpooling Sabadell → Primavera Sound ${YEAR}: Desde 3€ | 30 km | ConcertRide`,
    keywords: `carpooling sabadell primavera sound, viaje compartido sabadell barcelona forum, primavera sound desde sabadell`,
  },
  "sabadell-cruilla": {
    title: `Carpooling Sabadell → Cruïlla Barcelona ${YEAR}: Desde 3€ | 30 km | ConcertRide`,
    keywords: `carpooling sabadell cruilla, viaje compartido sabadell cruilla forum, cruilla desde sabadell`,
  },
  "sabadell-sonar": {
    title: `Carpooling Sabadell → Sónar Barcelona ${YEAR}: Desde 3€ | 30 km | ConcertRide`,
    keywords: `carpooling sabadell sonar, viaje compartido sabadell montjuic, sonar desde sabadell`,
  },
  "terrassa-primavera-sound": {
    title: `Carpooling Terrassa → Primavera Sound ${YEAR}: Desde 3€ | 30 km | ConcertRide`,
    keywords: `carpooling terrassa primavera sound, viaje compartido terrassa barcelona forum, primavera sound desde terrassa`,
  },
  "terrassa-cruilla": {
    title: `Carpooling Terrassa → Cruïlla Barcelona ${YEAR}: Desde 3€ | 30 km | ConcertRide`,
    keywords: `carpooling terrassa cruilla, viaje compartido terrassa cruilla, cruilla desde terrassa`,
  },
  "terrassa-sonar": {
    title: `Carpooling Terrassa → Sónar Barcelona ${YEAR}: Desde 3€ | 30 km | ConcertRide`,
    keywords: `carpooling terrassa sonar, viaje compartido terrassa montjuic, sonar desde terrassa`,
  },
  "mataro-primavera-sound": {
    title: `Carpooling Mataró → Primavera Sound ${YEAR}: Desde 3€ | 35 km | ConcertRide`,
    keywords: `carpooling mataro primavera sound, viaje compartido mataro forum, primavera sound desde mataro`,
  },
  "mataro-cruilla": {
    title: `Carpooling Mataró → Cruïlla ${YEAR}: Desde 3€ | 35 km | ConcertRide`,
    keywords: `carpooling mataro cruilla, viaje compartido mataro cruilla, cruilla desde mataro`,
  },
  "reus-primavera-sound": {
    title: `Carpooling Reus → Primavera Sound ${YEAR}: Desde 5€ | 110 km | ConcertRide`,
    keywords: `carpooling reus primavera sound, viaje compartido reus barcelona, primavera sound desde reus`,
  },
  "reus-fib": {
    title: `Carpooling Reus → FIB Benicàssim ${YEAR}: Desde 6€ | 190 km | ConcertRide`,
    keywords: `carpooling reus fib benicassim, viaje compartido reus fib, fib desde reus`,
  },
  "manresa-primavera-sound": {
    title: `Carpooling Manresa → Primavera Sound ${YEAR}: Desde 4€ | 75 km | ConcertRide`,
    keywords: `carpooling manresa primavera sound, viaje compartido manresa forum, primavera sound desde manresa`,
  },
  // Huesca → Aragón / Pirineos
  "huesca-vive-latino": {
    title: `Carpooling Huesca → Vive Latino Zaragoza ${YEAR}: Desde 3€ | 75 km | ConcertRide`,
    keywords: `carpooling huesca vive latino, viaje compartido huesca zaragoza, vive latino desde huesca`,
  },
  "huesca-mad-cool": {
    title: `Carpooling Huesca → Mad Cool Madrid ${YEAR}: Desde 11€ | 390 km | ConcertRide`,
    keywords: `carpooling huesca mad cool, viaje compartido huesca madrid, mad cool desde huesca`,
  },
  "huesca-primavera-sound": {
    title: `Carpooling Huesca → Primavera Sound Barcelona ${YEAR}: Desde 11€ | 380 km | ConcertRide`,
    keywords: `carpooling huesca primavera sound, viaje compartido huesca barcelona, primavera sound desde huesca`,
  },
  // Algeciras → Andalucía festivals
  "algeciras-cala-mijas": {
    title: `Carpooling Algeciras → Cala Mijas Festival ${YEAR}: Desde 5€ | 105 km | ConcertRide`,
    keywords: `carpooling algeciras cala mijas, viaje compartido algeciras mijas festival, cala mijas desde algeciras`,
  },
  // Avilés → norte
  "aviles-metropoli-gijon": {
    title: `Carpooling Avilés → Metrópoli Gijón ${YEAR}: Desde 3€ | 25 km | ConcertRide`,
    keywords: `carpooling aviles metropoli gijon, viaje compartido aviles gijon, metropoli desde aviles`,
  },
  "aviles-bbk-live": {
    title: `Carpooling Avilés → BBK Live ${YEAR}: Desde 9€ | 270 km | ConcertRide`,
    keywords: `carpooling aviles bbk live, viaje compartido aviles bilbao, bbk live desde aviles`,
  },
  // Ponferrada → Galicia / norte
  "ponferrada-o-son-do-camino": {
    title: `Carpooling Ponferrada → O Son do Camiño ${YEAR}: Desde 7€ | 210 km | ConcertRide`,
    keywords: `carpooling ponferrada o son do camino, viaje compartido ponferrada santiago, o son do camino desde ponferrada`,
  },
  "ponferrada-resurrection-fest": {
    title: `Carpooling Ponferrada → Resurrection Fest ${YEAR}: Desde 8€ | 250 km | ConcertRide`,
    keywords: `carpooling ponferrada resurrection fest, viaje compartido ponferrada viveiro, resurrection fest desde ponferrada`,
  },
  // Talavera de la Reina → festivales
  "talavera-de-la-reina-mad-cool": {
    title: `Carpooling Talavera → Mad Cool Madrid ${YEAR}: Desde 5€ | 120 km | ConcertRide`,
    keywords: `carpooling talavera mad cool, viaje compartido talavera madrid mad cool, mad cool desde talavera de la reina`,
  },
  "talavera-de-la-reina-vina-rock": {
    title: `Carpooling Talavera → Viña Rock ${YEAR}: Desde 6€ | 180 km | ConcertRide`,
    keywords: `carpooling talavera vina rock, viaje compartido talavera villarrobledo, viña rock desde talavera`,
  },
  // Gandia → Levante
  "gandia-medusa-festival": {
    title: `Carpooling Gandia → Medusa Festival Cullera ${YEAR}: Desde 3€ | 15 km | ConcertRide`,
    keywords: `carpooling gandia medusa festival, viaje compartido gandia cullera medusa, medusa desde gandia`,
  },
  "gandia-arenal-sound": {
    title: `Carpooling Gandia → Arenal Sound Burriana ${YEAR}: Desde 5€ | 130 km | ConcertRide`,
    keywords: `carpooling gandia arenal sound, viaje compartido gandia burriana, arenal sound desde gandia`,
  },
  "gandia-festival-de-les-arts": {
    title: `Carpooling Gandia → Festival de les Arts Valencia ${YEAR}: Desde 3€ | 65 km | ConcertRide`,
    keywords: `carpooling gandia festival les arts, viaje compartido gandia valencia, festival les arts desde gandia`,
  },
  // Mérida → festivales
  "merida-cala-mijas": {
    title: `Carpooling Mérida → Cala Mijas Festival ${YEAR}: Desde 13€ | 480 km | ConcertRide`,
    keywords: `carpooling merida cala mijas, viaje compartido merida mijas festival, cala mijas desde merida`,
  },
  "merida-mad-cool": {
    title: `Carpooling Mérida → Mad Cool Madrid ${YEAR}: Desde 10€ | 340 km | ConcertRide`,
    keywords: `carpooling merida mad cool, viaje compartido merida madrid, mad cool desde merida`,
  },
  // ── Wave 10: routes for 5 new festivals ───────────────────────────────────
  // Pirineos Sur (Lanuza)
  "huesca-pirineos-sur": {
    title: `Carpooling Huesca → Pirineos Sur ${YEAR}: Desde 3€ | 75 km | ConcertRide`,
    keywords: `carpooling huesca pirineos sur, viaje compartido huesca lanuza, pirineos sur desde huesca, sallent de gallego desde huesca`,
  },
  "zaragoza-pirineos-sur": {
    title: `Carpooling Zaragoza → Pirineos Sur ${YEAR}: Desde 6€ | 175 km | ConcertRide`,
    keywords: `carpooling zaragoza pirineos sur, viaje compartido zaragoza lanuza, pirineos sur desde zaragoza, festival lanuza desde zaragoza`,
  },
  "pamplona-pirineos-sur": {
    title: `Carpooling Pamplona → Pirineos Sur ${YEAR}: Desde 7€ | 215 km | ConcertRide`,
    keywords: `carpooling pamplona pirineos sur, viaje compartido pamplona lanuza, pirineos sur desde pamplona`,
  },
  "madrid-pirineos-sur": {
    title: `Carpooling Madrid → Pirineos Sur ${YEAR}: Desde 13€ | 480 km | ConcertRide`,
    keywords: `carpooling madrid pirineos sur, viaje compartido madrid lanuza pirineos sur, pirineos sur desde madrid, festival aragon desde madrid`,
  },
  "barcelona-pirineos-sur": {
    title: `Carpooling Barcelona → Pirineos Sur ${YEAR}: Desde 12€ | 430 km | ConcertRide`,
    keywords: `carpooling barcelona pirineos sur, viaje compartido barcelona lanuza, pirineos sur desde barcelona`,
  },
  "lleida-pirineos-sur": {
    title: `Carpooling Lleida → Pirineos Sur ${YEAR}: Desde 7€ | 200 km | ConcertRide`,
    keywords: `carpooling lleida pirineos sur, viaje compartido lleida lanuza, pirineos sur desde lleida`,
  },
  "bilbao-pirineos-sur": {
    title: `Carpooling Bilbao → Pirineos Sur ${YEAR}: Desde 11€ | 360 km | ConcertRide`,
    keywords: `carpooling bilbao pirineos sur, viaje compartido bilbao lanuza, pirineos sur desde bilbao`,
  },
  // Starlite Marbella
  "malaga-starlite-marbella": {
    title: `Carpooling Málaga → Starlite Marbella ${YEAR}: Desde 3€ | 60 km | ConcertRide`,
    keywords: `carpooling malaga starlite marbella, viaje compartido malaga marbella, starlite desde malaga, cantera de nagueles desde malaga`,
  },
  "mijas-starlite-marbella": {
    title: `Carpooling Mijas → Starlite Marbella ${YEAR}: Desde 3€ | 20 km | ConcertRide`,
    keywords: `carpooling mijas starlite marbella, viaje compartido mijas marbella, starlite desde mijas`,
  },
  "fuengirola-starlite-marbella": {
    title: `Carpooling Fuengirola → Starlite Marbella ${YEAR}: Desde 3€ | 25 km | ConcertRide`,
    keywords: `carpooling fuengirola starlite marbella, viaje compartido fuengirola marbella, starlite desde fuengirola`,
  },
  "granada-starlite-marbella": {
    title: `Carpooling Granada → Starlite Marbella ${YEAR}: Desde 6€ | 155 km | ConcertRide`,
    keywords: `carpooling granada starlite marbella, viaje compartido granada marbella, starlite desde granada`,
  },
  "sevilla-starlite-marbella": {
    title: `Carpooling Sevilla → Starlite Marbella ${YEAR}: Desde 7€ | 210 km | ConcertRide`,
    keywords: `carpooling sevilla starlite marbella, viaje compartido sevilla marbella, starlite desde sevilla, costa del sol festival desde sevilla`,
  },
  "madrid-starlite-marbella": {
    title: `Carpooling Madrid → Starlite Marbella ${YEAR}: Desde 14€ | 575 km | ConcertRide`,
    keywords: `carpooling madrid starlite marbella, viaje compartido madrid marbella, starlite desde madrid, costa del sol desde madrid`,
  },
  "algeciras-starlite-marbella": {
    title: `Carpooling Algeciras → Starlite Marbella ${YEAR}: Desde 4€ | 80 km | ConcertRide`,
    keywords: `carpooling algeciras starlite marbella, viaje compartido algeciras marbella, starlite desde algeciras`,
  },
  // Stone & Music Mérida
  "caceres-stone-music-festival": {
    title: `Carpooling Cáceres → Stone & Music Mérida ${YEAR}: Desde 4€ | 75 km | ConcertRide`,
    keywords: `carpooling caceres stone music merida, viaje compartido caceres merida festival, stone music desde caceres, teatro romano merida desde caceres`,
  },
  "badajoz-stone-music-festival": {
    title: `Carpooling Badajoz → Stone & Music Mérida ${YEAR}: Desde 3€ | 60 km | ConcertRide`,
    keywords: `carpooling badajoz stone music merida, viaje compartido badajoz merida festival, stone music desde badajoz`,
  },
  "sevilla-stone-music-festival": {
    title: `Carpooling Sevilla → Stone & Music Mérida ${YEAR}: Desde 6€ | 200 km | ConcertRide`,
    keywords: `carpooling sevilla stone music merida, viaje compartido sevilla merida, stone music desde sevilla, teatro romano merida desde sevilla`,
  },
  "madrid-stone-music-festival": {
    title: `Carpooling Madrid → Stone & Music Mérida ${YEAR}: Desde 10€ | 340 km | ConcertRide`,
    keywords: `carpooling madrid stone music merida, viaje compartido madrid merida festival, stone music desde madrid, teatro romano merida desde madrid`,
  },
  "salamanca-stone-music-festival": {
    title: `Carpooling Salamanca → Stone & Music Mérida ${YEAR}: Desde 7€ | 215 km | ConcertRide`,
    keywords: `carpooling salamanca stone music merida, viaje compartido salamanca merida, stone music desde salamanca`,
  },
  "cordoba-stone-music-festival": {
    title: `Carpooling Córdoba → Stone & Music Mérida ${YEAR}: Desde 8€ | 250 km | ConcertRide`,
    keywords: `carpooling cordoba stone music merida, viaje compartido cordoba merida festival, stone music desde cordoba`,
  },
  // Marenostrum Fuengirola
  "malaga-marenostrum-fuengirola": {
    title: `Carpooling Málaga → Marenostrum Fuengirola ${YEAR}: Desde 3€ | 35 km | ConcertRide`,
    keywords: `carpooling malaga marenostrum fuengirola, viaje compartido malaga fuengirola castle park, marenostrum desde malaga, sohail castle park desde malaga`,
  },
  "mijas-marenostrum-fuengirola": {
    title: `Carpooling Mijas → Marenostrum Fuengirola ${YEAR}: Desde 3€ | 10 km | ConcertRide`,
    keywords: `carpooling mijas marenostrum fuengirola, viaje compartido mijas fuengirola, marenostrum desde mijas`,
  },
  "marbella-marenostrum-fuengirola": {
    title: `Carpooling Marbella → Marenostrum Fuengirola ${YEAR}: Desde 3€ | 25 km | ConcertRide`,
    keywords: `carpooling marbella marenostrum fuengirola, viaje compartido marbella fuengirola, marenostrum desde marbella`,
  },
  "granada-marenostrum-fuengirola": {
    title: `Carpooling Granada → Marenostrum Fuengirola ${YEAR}: Desde 5€ | 130 km | ConcertRide`,
    keywords: `carpooling granada marenostrum fuengirola, viaje compartido granada fuengirola, marenostrum desde granada`,
  },
  "sevilla-marenostrum-fuengirola": {
    title: `Carpooling Sevilla → Marenostrum Fuengirola ${YEAR}: Desde 7€ | 220 km | ConcertRide`,
    keywords: `carpooling sevilla marenostrum fuengirola, viaje compartido sevilla fuengirola, marenostrum desde sevilla`,
  },
  "madrid-marenostrum-fuengirola": {
    title: `Carpooling Madrid → Marenostrum Fuengirola ${YEAR}: Desde 14€ | 555 km | ConcertRide`,
    keywords: `carpooling madrid marenostrum fuengirola, viaje compartido madrid fuengirola, marenostrum desde madrid`,
  },
  "algeciras-marenostrum-fuengirola": {
    title: `Carpooling Algeciras → Marenostrum Fuengirola ${YEAR}: Desde 5€ | 105 km | ConcertRide`,
    keywords: `carpooling algeciras marenostrum fuengirola, viaje compartido algeciras fuengirola, marenostrum desde algeciras`,
  },
  // Tío Pepe Festival Jerez
  "cadiz-tio-pepe-festival": {
    title: `Carpooling Cádiz → Tío Pepe Festival Jerez ${YEAR}: Desde 3€ | 35 km | ConcertRide`,
    keywords: `carpooling cadiz tio pepe festival, viaje compartido cadiz jerez, tio pepe desde cadiz, bodegas gonzalez byass desde cadiz`,
  },
  "sevilla-tio-pepe-festival": {
    title: `Carpooling Sevilla → Tío Pepe Festival Jerez ${YEAR}: Desde 4€ | 95 km | ConcertRide`,
    keywords: `carpooling sevilla tio pepe festival, viaje compartido sevilla jerez festival, tio pepe desde sevilla`,
  },
  "huelva-tio-pepe-festival": {
    title: `Carpooling Huelva → Tío Pepe Festival Jerez ${YEAR}: Desde 4€ | 110 km | ConcertRide`,
    keywords: `carpooling huelva tio pepe festival, viaje compartido huelva jerez, tio pepe desde huelva`,
  },
  "cordoba-tio-pepe-festival": {
    title: `Carpooling Córdoba → Tío Pepe Festival Jerez ${YEAR}: Desde 6€ | 195 km | ConcertRide`,
    keywords: `carpooling cordoba tio pepe festival, viaje compartido cordoba jerez, tio pepe desde cordoba`,
  },
  "malaga-tio-pepe-festival": {
    title: `Carpooling Málaga → Tío Pepe Festival Jerez ${YEAR}: Desde 7€ | 200 km | ConcertRide`,
    keywords: `carpooling malaga tio pepe festival, viaje compartido malaga jerez, tio pepe desde malaga`,
  },
  "algeciras-tio-pepe-festival": {
    title: `Carpooling Algeciras → Tío Pepe Festival Jerez ${YEAR}: Desde 5€ | 130 km | ConcertRide`,
    keywords: `carpooling algeciras tio pepe festival, viaje compartido algeciras jerez, tio pepe desde algeciras`,
  },
  "madrid-tio-pepe-festival": {
    title: `Carpooling Madrid → Tío Pepe Festival Jerez ${YEAR}: Desde 16€ | 655 km | ConcertRide`,
    keywords: `carpooling madrid tio pepe festival, viaje compartido madrid jerez, tio pepe desde madrid, festival jerez desde madrid`,
  },
  "donostia-mad-cool": {
    title: `Donostia → Mad Cool Madrid ${YEAR}: carpooling 4h 15 min desde 13€ | ConcertRide`,
    description: `Carpooling de Donostia a Mad Cool Festival ${YEAR} (IFEMA Madrid, 465 km, 4h 15 min). Precio estimado: 13–17€/asiento sin comisión. Salida recomendada: mañana del primer día. Vuelta de madrugada coordinada con otros festivaleros de Donostia. Pago Bizum o efectivo.`,
    keywords: `donostia mad cool carpooling, donostia ifema madrid viaje compartido, san sebastian mad cool transporte, donostia mad cool ${YEAR}, viaje compartido donostia madrid festival`,
  },
  "malaga-primavera-sound": {
    title: `Málaga → Primavera Sound Barcelona ${YEAR}: carpooling 5h 30 min desde 16€ | ConcertRide`,
    description: `Carpooling de Málaga a Primavera Sound Barcelona ${YEAR} (Parc del Fòrum, 990 km, 8h o AVE 5h 30 min). Precio estimado: 16–22€/asiento sin comisión. Vía Madrid o Zaragoza. Vuelta de madrugada coordinada. Pago Bizum o efectivo.`,
    keywords: `malaga primavera sound carpooling, malaga barcelona festival viaje compartido, malaga primavera sound ${YEAR}, carpooling malaga cataluña festival`,
  },
  "cordoba-bbk-live": {
    title: `Córdoba → BBK Live Bilbao ${YEAR}: carpooling 3h 45 min desde 9€ | ConcertRide`,
    description: `Carpooling de Córdoba a BBK Live Bilbao ${YEAR} (Kobetamendi, 535 km, 4h 45 min). Precio estimado: 9–13€/asiento sin comisión. Vía Madrid o Burgos. Lanzadera gratuita BBK en Bilbao. Vuelta coordinada. 0% comisión.`,
    keywords: `cordoba bbk live carpooling, cordoba bilbao festival viaje compartido, cordoba bbk live ${YEAR}, carpooling cordoba andalucia festival bilbao`,
  },
  "gijon-bbk-live": {
    title: `Gijón → BBK Live Bilbao ${YEAR}: carpooling 3h desde 9€ | ConcertRide`,
    description: `Carpooling de Gijón a BBK Live Bilbao ${YEAR} (Kobetamendi, 290 km, 3h). Precio estimado: 9–13€/asiento sin comisión. Ruta por la autovía del Cantábrico A-8. Lanzadera BBK gratuita en Bilbao. Vuelta de madrugada coordinada. 0% comisión.`,
    keywords: `gijon bbk live carpooling, gijon bilbao festival viaje compartido, gijon bbk live ${YEAR}, carpooling asturias festival bilbao, gijon bbk 2026`,
  },
  "leon-resurrection-fest": {
    title: `León → Resurrection Fest Viveiro ${YEAR}: carpooling 4h desde 11€ | ConcertRide`,
    description: `Carpooling de León a Resurrection Fest Viveiro ${YEAR} (A Gañidoira, 400 km, 4h 15 min). Precio estimado: 11–16€/asiento sin comisión. Sin tren directo a Viveiro — el carpooling es la única opción práctica. Vuelta de madrugada coordinada. 0% comisión.`,
    keywords: `leon resurrection fest carpooling, leon viveiro festival viaje compartido, leon resurrection fest ${YEAR}, carpooling castilla leon festival metal`,
  },
  "logrono-sonorama-ribera": {
    title: `Logroño → Sonorama Ribera Aranda ${YEAR}: carpooling 1h 20 min desde 4€ | ConcertRide`,
    description: `Carpooling de Logroño a Sonorama Ribera Aranda de Duero ${YEAR} (120 km, 1h 20 min). Precio estimado: 4–7€/asiento sin comisión. Sin tren a Aranda — bus La Sepulvedana alternativa. Vuelta de madrugada coordinada. 0% comisión.`,
    keywords: `logrono sonorama ribera carpooling, logrono aranda de duero festival viaje compartido, logrono sonorama ${YEAR}, carpooling la rioja festival aranda`,
  },
  "avila-mad-cool": {
    title: `Ávila → Mad Cool Madrid ${YEAR}: carpooling 1h 10 min desde 4€ | ConcertRide`,
    description: `Carpooling de Ávila a Mad Cool Festival ${YEAR} (IFEMA Madrid, 110 km, 1h 10 min). Precio estimado: 4–7€/asiento sin comisión. La ciudad más cercana a Madrid en la meseta — ideal para festivaleros del interior. Vuelta de madrugada coordinada. 0% comisión.`,
    keywords: `avila mad cool carpooling, avila ifema madrid festival viaje compartido, avila mad cool ${YEAR}, carpooling castilla festival madrid`,
  },
  "valladolid-bbk-live": {
    title: `Valladolid → BBK Live Bilbao ${YEAR}: carpooling 3h desde 8€ | ConcertRide`,
    description: `Carpooling de Valladolid a BBK Live Bilbao ${YEAR} (Kobetamendi, 290 km, 3h). Precio estimado: 8–13€/asiento sin comisión. Ruta por Burgos–Miranda de Ebro. Lanzadera BBK gratuita en Bilbao. Vuelta de madrugada coordinada. 0% comisión.`,
    keywords: `valladolid bbk live carpooling, valladolid bilbao festival viaje compartido, valladolid bbk live ${YEAR}, carpooling castilla festival bilbao`,
  },
  "almeria-resurrection-fest": {
    title: `Almería → Resurrection Fest Viveiro ${YEAR}: carpooling 8h desde 17€ | ConcertRide`,
    description: `Carpooling de Almería a Resurrection Fest Viveiro ${YEAR} (A Gañidoira, 890 km, 8h 30 min). Precio estimado: 17–24€/asiento sin comisión. Ruta larga pero la más económica para metaleros de Almería. Vuelta de madrugada coordinada. 0% comisión.`,
    keywords: `almeria resurrection fest carpooling, almeria viveiro festival viaje compartido, almeria resurrection fest ${YEAR}, carpooling andalucia festival metal galicia`,
  },
  "santander-primavera-sound": {
    title: `Santander → Primavera Sound Barcelona ${YEAR}: carpooling 5h desde 14€ | ConcertRide`,
    description: `Carpooling de Santander a Primavera Sound Barcelona ${YEAR} (Parc del Fòrum, 600 km, 5h 30 min). Precio estimado: 14–20€/asiento sin comisión. Ruta por Zaragoza. Metro L4 al recinto. Vuelta de madrugada coordinada. 0% comisión.`,
    keywords: `santander primavera sound carpooling, santander barcelona festival viaje compartido, santander primavera sound ${YEAR}, carpooling cantabria festival barcelona`,
  },
  "burgos-bbk-live": {
    title: `Burgos → BBK Live Bilbao ${YEAR}: carpooling 1h 30 min desde 5€ | ConcertRide`,
    description: `Carpooling de Burgos a BBK Live Bilbao ${YEAR} (Kobetamendi, 160 km, 1h 30 min). Precio estimado: 5–8€/asiento sin comisión. La opción más económica de la Meseta Norte para BBK Live. Lanzadera BBK gratuita en Bilbao. Vuelta coordinada. 0% comisión.`,
    keywords: `burgos bbk live carpooling, burgos bilbao festival viaje compartido, burgos bbk live ${YEAR}, carpooling castilla festival bilbao`,
  },
  "tarragona-mad-cool": {
    title: `Tarragona → Mad Cool Madrid ${YEAR}: carpooling 5h 30 min desde 12€ | ConcertRide`,
    description: `Carpooling de Tarragona a Mad Cool Festival ${YEAR} (IFEMA Madrid, 550 km, 5h 30 min). Precio estimado: 12–17€/asiento sin comisión. Ruta por Zaragoza. Metro L8 al recinto IFEMA. Vuelta de madrugada coordinada. 0% comisión.`,
    keywords: `tarragona mad cool carpooling, tarragona madrid festival viaje compartido, tarragona mad cool ${YEAR}, carpooling cataluña festival madrid`,
  },
};

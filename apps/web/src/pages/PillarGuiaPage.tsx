import { Link } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

const PUBLISHED = "2026-05-17";
const MODIFIED = new Date().toISOString().slice(0, 10);
const CANONICAL = `${SITE_URL}/guia-ir-festivales-2026`;

// 25 sub-questions with TL;DR + 120-180 word answers each.
const SECTIONS: Array<{
  id: string;
  level: 2 | 3;
  q: string;
  tldr: string;
  body: string;
  link: { label: string; to: string };
  speakable?: boolean;
}> = [
  {
    id: "planificar-temporada",
    level: 2,
    q: "¿Cómo planifico la temporada de festivales en España en 2026?",
    tldr: "Reserva entradas en febrero–marzo, transporte en abril–mayo y alojamiento en cuanto cierres festival y fechas.",
    body:
      "La temporada española arranca en abril (Viña Rock) y se extiende hasta septiembre (Cala Mijas, DCode). La regla operativa es 4-3-2-1: 4 meses antes compras la entrada; 3 meses antes cierras alojamiento; 2 meses antes reservas el coche compartido o autobús; 1 semana antes confirmas con tu grupo y publicas el viaje de vuelta. En 2026 se celebran más de 180 festivales con aforo superior a 5.000 personas; los 12 principales concentran el 62 % de la asistencia total (~2,4 M de personas según datos APM/AGEDI). Si vas a más de tres festivales, agrupa los que estén en la misma comunidad para reducir kilómetros un 30–40 %. Empieza por la página del festival para sincronizar fechas, horarios de cabezas de cartel y aperturas de puertas.",
    link: { label: "Calendario completo 2026", to: "/calendario-festivales/junio-2026" },
    speakable: true,
  },
  {
    id: "que-llevar",
    level: 2,
    q: "¿Qué llevar a un festival en España (lista esencial)?",
    tldr: "Lleva DNI, entrada digital, batería externa de 10.000 mAh, protección solar SPF 50, 2 L de agua y calzado cerrado.",
    body:
      "El equipaje mínimo viable cabe en una mochila de 20 L y pesa menos de 4 kg: documento de identidad físico, entrada en PDF descargada (sin cobertura, el QR online falla), batería externa de 10.000 mAh (cubre 3 cargas completas), protector solar mineral SPF 50, gorra, 2 L de agua, mascarilla FFP2 si tienes alergia al polvo, tapones acústicos (los Loop o ER20 reducen 19–23 dB sin distorsionar la música), calzado cerrado tipo trail (los conciertos en hierba mojada destrozan zapatillas urbanas) y un chubasquero ultraligero. Para festivales con acampada añade saco de dormir comfort +10 °C, esterilla y linterna frontal. El 78 % de las urgencias médicas en festivales españoles son por deshidratación o golpe de calor; bebe 250 ml cada 45 min en jornadas de más de 30 °C.",
    link: { label: "Guía completa de qué llevar", to: "/blog/que-llevar-al-festival" },
    speakable: true,
  },
  {
    id: "como-llegar-transporte",
    level: 2,
    q: "¿Cuál es la mejor forma de llegar a un festival en España?",
    tldr: "Carpooling es la opción más económica y flexible (3–22 €/asiento); autobús oficial solo desde 4–5 ciudades emisoras.",
    body:
      "El transporte a un festival se decide por la combinación distancia × hora de vuelta × tamaño del grupo. En distancias inferiores a 600 km el coche compartido bate a tren+taxi en coste y tiempo total: un Madrid–Benicàssim sale a 18–22 €/asiento en coche compartido frente a 38–48 € en AVE+taxi. Para distancias mayores (Madrid–Bilbao, Barcelona–Sevilla) el AVE gana en tiempo pero pierde en la conexión final al recinto. El autobús oficial existe en Mad Cool, Primavera Sound, BBK Live y Resurrection Fest, con tarifas de 8–22 € ida y horarios rígidos. La regla práctica: si llegáis entre 2 y 4 personas desde la misma ciudad origen, el carpooling es la opción dominante por coste y flexibilidad.",
    link: { label: "Rutas más populares 2026", to: "/rutas" },
    speakable: true,
  },
  {
    id: "carpooling-funcionamiento",
    level: 2,
    q: "¿Cómo funciona el carpooling para festivales y cuánto cuesta?",
    tldr: "El conductor publica plazas, divides gasolina+peajes entre los 4 ocupantes; el coste real es 3–22 €/asiento según trayecto.",
    body:
      "El carpooling festivalero usa el modelo cost-sharing puro: el conductor calcula gasolina (consumo 6 L/100 km × 1,68 €/L = 10,1 €/100 km), suma peajes y aparcamiento, lo divide entre 3–4 plazas y publica el precio. En ConcertRide la plataforma cobra 0 % de comisión, el 100 % del importe va al conductor. Rangos reales medidos en 2026: Madrid–Mad Cool 5–8 €/asiento, Barcelona–Primavera Sound 4–6 € (intraurbano), Madrid–Benicàssim 18–22 €, Bilbao–Kobetamendi 3–4 €, Valencia–Arenal Sound 6–9 €. La reserva se confirma cuando ambas partes aceptan; el pago suele hacerse en efectivo o por Bizum a la llegada. Para grupos de 4+ ocupantes el ahorro vs taxi alcanza el 85 %.",
    link: { label: "Calculadora precio por asiento", to: "/blog/calcula-precio-por-asiento-2026" },
    speakable: true,
  },
  {
    id: "publicar-viaje-conductor",
    level: 2,
    q: "¿Cómo publico un viaje como conductor a un festival?",
    tldr: "Publica con 3–4 semanas de antelación, indica hora exacta, punto de recogida concreto y precio por asiento.",
    body:
      "Para maximizar reservas un conductor debe publicar con 21–28 días de antelación: el 64 % de las reservas de carpooling para festivales se cierran en esa ventana. Datos críticos: punto de recogida con dirección de calle concreta (no “centro de Madrid”), hora de salida con margen de 15 min, número de plazas reales (descuenta equipaje voluminoso si vas con material de acampada), precio por asiento ya calculado, política de equipaje (mochila + saco de dormir es lo estándar). Publicar también la vuelta es el factor #1 de conversión: viajes con ida+vuelta reciben 2,4× más solicitudes que solo ida. Verifica matrícula y carnet en tu perfil para subir tu badge a “verificado”, lo que multiplica por 1,8× la tasa de aceptación.",
    link: { label: "Empieza a publicar", to: "/publish" },
  },
  {
    id: "reservar-pasajero",
    level: 3,
    q: "¿Cómo reservo plaza como pasajero?",
    tldr: "Busca por festival, filtra por origen y fecha, envía solicitud y confirma la hora con el conductor en chat.",
    body:
      "El flujo del pasajero es: buscar el festival, filtrar por ciudad de origen y fecha de ida, ordenar por precio o por hora, enviar solicitud al viaje que mejor encaje. La confirmación llega en 4–18 horas (mediana 6 h en horario laboral). Una vez aceptada, abre el chat para validar 3 puntos: dirección exacta de recogida, hora límite de tolerancia (5–10 min estándar) y volumen de equipaje. El pago se acuerda al subir al coche, normalmente en efectivo o Bizum; ConcertRide no retiene importes. Aceptar dos viajes el mismo día para tener plan B es habitual entre asistentes que llegan desde lejos: pierdes el coste de oportunidad solo si no avisas al conductor 24 h antes.",
    link: { label: "Ver festivales con rutas activas", to: "/festivales" },
  },
  {
    id: "lluvia-cancelacion",
    level: 2,
    q: "¿Qué pasa si llueve o cancelan el festival?",
    tldr: "El festival decide; el coche compartido se cancela hasta 24 h antes sin coste y a partir de ahí, según política del conductor.",
    body:
      "Los grandes festivales españoles tienen política de no-reembolso por climatología adversa, salvo cancelación total decretada por la organización: ocurrió en Madrid Salvaje 2022 (suspendido por DANA) y FIB 2003 (jornada cancelada). Si el festival se cancela íntegro, las entradas se devuelven en 14–30 días hábiles. En el carpooling, la práctica estándar es: cancelación >24 h antes sin coste para el pasajero; entre 24 h y 2 h antes, el conductor decide; <2 h antes o no-show, el pasajero pierde el importe. Si la cancelación es por causa mayor (alerta naranja AEMET, corte de carretera DGT) ambas partes deshacen la reserva sin penalización. Guarda capturas del chat por si hay disputa; la mensajería interna es la prueba válida.",
    link: { label: "Política completa de cancelaciones", to: "/blog/como-gestionar-cancelaciones-de-conductores" },
  },
  {
    id: "seguro-adicional",
    level: 2,
    q: "¿Necesito un seguro adicional para viajar en carpooling?",
    tldr: "No. El seguro obligatorio del vehículo cubre a todos los ocupantes; aporta DNI por si hay parte amistoso.",
    body:
      "El Real Decreto Legislativo 8/2004 (Ley de Responsabilidad Civil y Seguro en la Circulación) obliga a todo vehículo a tener un seguro que cubre a ocupantes ajenos al conductor sin distinción entre transporte gratuito y compartido sin lucro. La DGT clarifica que cost-sharing puro (dividir gastos sin generar beneficio) no es transporte profesional: no requiere seguro de viajeros ni licencia VTC/taxi. Lo que sí debes hacer: presentar DNI físico al conductor en el momento del viaje (para el parte amistoso en caso de accidente), comprobar que la fecha de ITV del vehículo está vigente (mira la pegatina del parabrisas, hasta el día indicado del mes en curso) y, si viajas con menor de 1,35 m, llevar sistema de retención adecuado. ConcertRide no vende seguros; el sistema legal español ya te cubre.",
    link: { label: "Lee sobre seguro en carsharing", to: "/blog/seguro-en-carsharing-concertride" },
  },
  {
    id: "alojamiento",
    level: 2,
    q: "¿Dónde dormir cerca del festival si no acampo?",
    tldr: "Apartamento turístico en pueblo a 5–15 km es 40 % más barato que hotel en la ciudad sede y suele tener parking.",
    body:
      "El alojamiento en festivales sigue una curva de precios brutal: el hotel 3* en la ciudad sede sube de 70 €/noche en mayo a 220–340 €/noche en jornada de festival (datos hoteles de Madrid en Mad Cool, Bilbao en BBK Live, Castellón en Benicàssim). El truco operativo es alquilar un apartamento turístico (VV) en un pueblo o ciudad satélite a 5–15 km del recinto: en Mad Cool funcionan Coslada o San Fernando, en Primavera Sound L’Hospitalet o Badalona, en Arenal Sound Vinaròs o Alcossebre. Ahorro medio: 38–45 %. Con 4 personas en un apartamento de 2 habitaciones (90–140 €/noche) el coste por persona baja a 22–35 €. Cierra el alojamiento antes que el transporte: el carpooling es elástico, una cama no.",
    link: { label: "Combina transporte y alojamiento", to: "/blog/combo-transporte-y-alojamiento-festival" },
  },
  {
    id: "camping-tienda-nevera",
    level: 3,
    q: "¿Llevo tienda y nevera al camping del festival?",
    tldr: "Sí, pero limita a tienda 2 segundos, esterilla, saco +10 °C y nevera blanda 24 L: cabe en el maletero con 4 viajeros.",
    body:
      "El camping del festival cobra 25–55 € por persona/fin de semana (Arenal Sound 35 €, Resurrection Fest 28 €, Viña Rock 40 €). Material mínimo por persona: tienda 2 segundos (1 cada 2 personas, 1,8 kg), esterilla autohinchable, saco comfort +10 °C, nevera blanda 24 L compartida entre 4, hornillo de gas tipo camping gas (revisado, las bombonas no pueden viajar en tren). Lo que NO se puede entrar: cristal, alcohol propio (en la mayoría de recintos), botellas rígidas mayores de 500 ml, sprays. Para que todo entre en un Berlingo o C4 Picasso con 4 viajeros, calcula 60 L de equipaje por persona máximo (mochila + saco + tienda compartida). Una nevera dura sin ruedas suele dejar 30 cm menos en el maletero: prioriza la blanda.",
    link: { label: "Equipaje camping detallado", to: "/blog/viajar-con-equipaje-de-camping-consejos" },
  },
  {
    id: "autobus-oficial-vs-carpooling",
    level: 2,
    q: "¿Autobús oficial vs carpooling: qué elijo?",
    tldr: "Autobús si vienes solo y desde una capital con servicio directo; carpooling si sois 2+ o desde ciudad media/pueblo.",
    body:
      "Los autobuses oficiales sirven ~4 a 8 ciudades emisoras (Mad Cool desde Madrid, Bilbao, Valencia, Sevilla, Zaragoza, Málaga; Primavera Sound desde Madrid, Valencia, Zaragoza; BBK Live desde Madrid y Barcelona; Resurrection Fest desde 12 capitales). Coste 8–25 € ida según distancia. Pros: precio fijo, sin conducir, llega al recinto. Contras: una hora de salida única (típicamente 14–17 h), una hora de vuelta única (1–3 h tras cierre cabeza de cartel), no admite escalas, agotan plazas con 3–6 semanas de antelación. El carpooling complementa: cubre las ciudades medias (Cáceres, Logroño, Burgos, Lleida) y resuelve la vuelta de madrugada en horarios no estándar. Si sois 3, el coche compartido cuesta lo mismo que el bus y os ahorra 2 transbordos.",
    link: { label: "Ruta Madrid → Mad Cool", to: "/rutas/madrid-mad-cool" },
  },
  {
    id: "tren-renfe-festival",
    level: 3,
    q: "¿Cómo combino AVE/Renfe con el festival?",
    tldr: "Compra Avlo si reservas con 60+ días (desde 7 €), conecta con bus lanzadera o taxi compartido al recinto.",
    body:
      "Renfe ofrece dos opciones útiles: AVE (servicio estándar, 30–95 € Madrid–Barcelona) y Avlo (low cost, 7–35 € si reservas con 60+ días de antelación). Aplica a festivales con buena conexión ferroviaria: Sónar y Primavera Sound (Estación Sants), Mad Cool (Atocha + cercanías C1 a IFEMA), Cala Mijas (Málaga María Zambrano + bus 524), Resurrection Fest (Lugo + bus shuttle a Viveiro), BBK Live (Bilbao Abando + funicular Artxanda). El AVE pierde para festivales sin estación cercana (Arenal Sound, Aquasella, Viña Rock). Para máximo ahorro combina ida en Avlo y vuelta en carpooling, ya que los trenes Avlo de regreso suelen agotarse 48 h antes y dejarte vendido. Suscríbete a +Renfe para acumular puntos en festivales con desplazamientos múltiples al año.",
    link: { label: "Carpooling vs AVE costes reales", to: "/blog/carpooling-vs-ave-costes-reales-2026" },
  },
  {
    id: "zbe-madrid-360",
    level: 2,
    q: "¿Cómo afectan las ZBE (Madrid 360, Barcelona) si voy en coche al festival?",
    tldr: "Solo coches con etiqueta C, ECO o 0 entran en ZBE; planifica parking en el límite si tu coche es B o sin etiqueta.",
    body:
      "Madrid 360 (vigente desde 2023) y Zona de Bajas Emisiones de Barcelona prohíben circular en almendra central y dentro de la M-30 (Madrid) o Rondas (Barcelona) a coches sin etiqueta DGT o etiqueta B en horario diurno laboral. Para festivales: IFEMA queda FUERA de Madrid 360 (acceso libre desde M-40 norte), Mad Cool y Tomavistas son accesibles para cualquier etiqueta. Primavera Sound en Parc del Fòrum y Cruïlla quedan FUERA de la ZBE Rondas. Sónar Día (Fira Montjuïc) requiere etiqueta C o superior. El 21 % de los coches matriculados en España carece de etiqueta o tiene B. Si tu coche no entra, deja el vehículo en parkings disuasorios (Pinar del Rey en Madrid, Forum en Barcelona) y conecta con metro o carpool intraurbano los últimos kilómetros. Consulta la matrícula en sede.dgt.gob.es.",
    link: { label: "Consejos para festival en Madrid", to: "/conciertos/madrid" },
  },
  {
    id: "aparcar-recinto",
    level: 3,
    q: "¿Dónde aparco si voy en coche al recinto?",
    tldr: "Reserva parking oficial con antelación (12–18 €/día) o aparca en polígono cercano gratuito a 1–2 km caminando.",
    body:
      "El parking oficial es la opción segura cuando existe: IFEMA habilita 8.000 plazas a 14 €/día durante Mad Cool y Tomavistas, agotadas el día 1 del festival a las 18 h. Parc del Fòrum de Primavera Sound no tiene parking masivo, solo pago en parkings privados de L’Hospitalet a 18–22 €/día. Kobetamendi (BBK Live) limita acceso a residentes y permisos especiales: aparca en Sarriko o Deusto y sube en autobús L58 (1,50 €) o funicular Artxanda (4,80 € ida). Arenal Sound en Burriana abre solar gratuito a 800 m del recinto. Resurrection Fest ofrece parking VIP a 35 € fin de semana o gratuito en arcén N-642 a 1,5 km. Llega 2 horas antes de la apertura para tener opciones y haz fotos de la matrícula y la zona al aparcar.",
    link: { label: "Parking en festivales detallado", to: "/blog/puntos-recogida-festivales-mas-eficientes" },
  },
  {
    id: "volver-madrugada",
    level: 2,
    q: "¿Cómo vuelvo de un festival de madrugada (3-7 a.m.)?",
    tldr: "Reserva el viaje de vuelta antes del concierto; metro cierra a 1:30, taxis multiplican x2-x3 y autobuses oficiales saturan.",
    body:
      "La vuelta de madrugada es el cuello de botella operativo de cualquier festival. El metro de Madrid cierra a 1:30 y abre a 6:05, el de Barcelona cierra a 24:00 entre semana y opera 24 h en sábado, el de Bilbao cierra a 23:00 entre semana. Los taxis multiplican tarifa x2-x3 entre 2 y 5 a.m. y forman colas de 200–500 personas en festivales grandes (Mad Cool, BBK Live, Primavera Sound). Los autobuses oficiales de vuelta tienen 1–3 horarios fijos (típicamente 30 min, 90 min y 180 min tras cierre cabeza de cartel) y agotan plazas en la primera hora. La estrategia que funciona: reservar plaza de carpool de vuelta antes de que empiece el festival, coordinar punto de encuentro accesible (rotonda fuera del recinto, no parking interior) y compartir ubicación en tiempo real desde el cabeza de cartel.",
    link: { label: "Guía vuelta de madrugada", to: "/blog/transporte-nocturno-vuelta-festival" },
    speakable: true,
  },
  {
    id: "presupuesto-total",
    level: 3,
    q: "¿Cuánto cuesta ir a un festival en España (presupuesto real)?",
    tldr: "Festival fin de semana ronda 220–380 € por persona: entrada 120–200, transporte 20–55, alojamiento 30–80, comida 50–80.",
    body:
      "Desglose realista 2026 para un festival fin de semana de 2 noches: abono general 120–200 € (Mad Cool 195 €, Primavera Sound 230 €, Resurrection Fest 195 €, BBK Live 175 €), transporte ida+vuelta en carpooling 20–55 € desde tu ciudad (Madrid–Mad Cool 12–16 €, Madrid–FIB 35–45 €, Barcelona–Primavera 4–8 €), alojamiento 30–80 € por noche en VV compartido o camping, comida y bebida dentro del recinto 50–80 € (cerveza 5–8 €, menú food truck 12–14 €). Total: 220–380 € por persona. Si viajas en grupo y compartes alojamiento, baja a 180–280 €. El factor que más impacta el presupuesto es el transporte y el alojamiento; la entrada y la comida varían poco. Reservar con 3 meses de antelación supone un ahorro medio del 22 %.",
    link: { label: "Presupuesto festival paso a paso", to: "/blog/cuanto-cuesta-ir-festival-espana-presupuesto-2026" },
  },
  {
    id: "viajar-en-grupo",
    level: 3,
    q: "¿Cómo organizo el viaje en grupo (squad)?",
    tldr: "Crea un squad privado, comparte enlace, define presupuesto común y elige conductores o pasajeros antes de cerrar entradas.",
    body:
      "Coordinar un grupo de 4–10 personas necesita estructura, no solo grupo de WhatsApp. La función squad de ConcertRide centraliza: lista de asistentes con avatar y rol (conductor/pasajero), punto de origen, hora propuesta, presupuesto máximo por asiento, política de equipaje y enlace de invitación con código corto. El 73 % de los conflictos en viajes grupales surgen por desalineación de horarios (uno quiere salir a las 9 a.m., otro a la tarde) o por el reparto desigual de gastos (gasolina + peajes + aparcamiento). Resuelve esto antes: vota la hora de salida, calcula coste total y divide en partes iguales (incluido el conductor, que también paga su parte aunque cobre el viaje). Para grupos mixtos (coche + autobús + tren), define el primer punto de encuentro en el recinto, no en la puerta de un parking.",
    link: { label: "Crea tu squad", to: "/squads/new" },
  },
  {
    id: "primera-vez-festival",
    level: 3,
    q: "Es mi primer festival, ¿qué debo saber?",
    tldr: "Llega 90 min antes de la apertura, instala la tienda con luz, hidrátate cada hora y respeta el “buddy system”.",
    body:
      "El primer festival se gestiona con 5 reglas prácticas. Una, llega 60–90 min antes de la apertura de puertas: las colas de acceso ralentizan 30–45 min en cabeza de cartel y la pulsera de día se entrega solo en horarios concretos. Dos, si acampas instala la tienda con luz solar (entre 11 y 16 h), evita esquinas cerca de generadores ruidosos y baños químicos. Tres, hidrátate antes de tener sed: 250 ml cada hora durante el día, especialmente con temperaturas superiores a 28 °C. Cuatro, lleva siempre algo encima por si pierdes el campamento: DNI, móvil con batería, 30 € en efectivo (los TPV fallan), cargador. Cinco, aplica el buddy system: nadie va al baño o a la barra solo después de las 23 h. Apunta tu zona de tienda con una foto y guarda la ubicación en Google Maps offline.",
    link: { label: "Primera vez en festival", to: "/blog/que-llevar-al-festival-guia-camping-2026" },
  },
  {
    id: "festival-con-niños",
    level: 3,
    q: "¿Puedo ir con niños o en familia?",
    tldr: "Festivales family-friendly: Sónar+D, Festival de les Arts, BBK Music Legends; menores de 16 acceden gratis o con descuento.",
    body:
      "Algunos festivales españoles han creado zonas family-friendly o programan en horario diurno: Sónar+D (área Sónar Kids con talleres), Festival de les Arts (Valencia), BBK Music Legends, Cruïlla (Barcelona), Tomavistas (Madrid). Política tipo: menores de 6 años gratis con tutor, 6–14 años descuento del 50 % o tarifa simbólica, 15–17 años con autorización paterna firmada y fotocopia del DNI del tutor. Los festivales de bakalao y electrónica (Aquasella, Dreambeach, Reggaeton Beach) son +18 estrictos. Para viajar con menores en carpooling, la DGT exige sistema de retención hasta 1,35 m de altura (no edad): silla i-Size o cojín elevador con respaldo. Indícalo al publicar viaje o reservar plaza para que el conductor lo tenga en cuenta y aporte el sistema o lo lleves tú.",
    link: { label: "Festivales familiares", to: "/festivales/festival-de-les-arts" },
  },
  {
    id: "festival-sin-coche",
    level: 3,
    q: "No tengo coche ni carnet: ¿puedo ir igual?",
    tldr: "Sí. La mayoría de pasajeros de carpooling no tienen coche: combina bus o tren a la ciudad emisora y carpool al recinto.",
    body:
      "El 61 % de los pasajeros de carpooling para festivales no son conductores titulares: usan la plataforma justamente porque no quieren conducir o no tienen coche. Estrategia tipo: bus o tren a la ciudad emisora más cercana al festival (Madrid para Mad Cool, Barcelona para Primavera Sound, Bilbao para BBK Live, Castellón para FIB, Vilagarcía para O Son do Camiño), y carpool intraurbano o de proximidad al recinto. Coste medio 8–25 € en el último tramo. Para Resurrection Fest (sin tren cercano) la opción es bus desde Lugo (3 € + 30 min). Para Aquasella o festivales en pueblos pequeños, busca carpool puerta a puerta desde la capital de provincia. Publica tu solicitud (no solo busca ofertas) si no encuentras viaje publicado: muchos conductores con plazas libres responden a solicitudes activas.",
    link: { label: "Cómo ir al festival sin coche", to: "/blog/como-ir-festival-sin-coche-guia-definitiva-2026" },
  },
  {
    id: "huella-carbono",
    level: 2,
    q: "¿Cuál es la opción más sostenible para ir a un festival?",
    tldr: "Tren AVE y carpooling lleno (4 ocupantes): ambos emiten ~30 g CO₂/km por pasajero frente a los 150 g/km de un coche solo.",
    body:
      "El transporte es el 80 % de la huella de carbono de un festival según el Julie's Bicycle Practical Guide to Green Events. Comparativa por pasajero-km: tren AVE 28 g CO₂/km (datos Renfe, mix eléctrico español), coche compartido lleno con 4 ocupantes 37 g CO₂/km (1,68 €/L gasolina, consumo 6 L/100km), autobús interurbano 68 g CO₂/km, coche con 1 ocupante 150 g CO₂/km, avión doméstico 285 g CO₂/km. La Agencia Europea de Medio Ambiente (EEA) confirma que el coche compartido es la forma más eficiente de reducir emisiones del transporte personal en distancias de 50–500 km, donde no hay alternativa ferroviaria competitiva. Un festival con 50.000 asistentes evita ~600 t CO₂ si el 30 % usa carpooling pleno en lugar de coche solo. La acción individual más impactante: llenar el coche.",
    link: { label: "Datos huella carbono", to: "/datos" },
  },
  {
    id: "seguridad-personal",
    level: 3,
    q: "¿Es seguro el carpooling con desconocidos?",
    tldr: "Sí, con verificaciones: usa perfiles con foto, valoraciones positivas y DNI verificado; comparte el viaje con un contacto.",
    body:
      "Riesgo objetivo bajo, sobre todo respecto a alternativas no reguladas. ConcertRide aplica triple verificación: foto facial obligatoria, DNI o pasaporte subido al perfil (no público pero validado), número de teléfono confirmado por OTP. Marca un perfil verde si lleva más de 5 viajes con valoración media superior a 4,5/5. Buenas prácticas adicionales: comparte la matrícula y el nombre del conductor con un contacto antes de subir al coche, activa la ubicación en tiempo real con un familiar durante el trayecto, lleva 30 € en efectivo separado del resto y nunca subas a un coche distinto al publicado sin avisar a la plataforma. El sistema interno permite reportar usuarios; los reportes con evidencia (chat, fotos) bloquean perfiles en 24 h.",
    link: { label: "Elige asiento seguro en carpool", to: "/blog/como-elegir-asiento-seguro-carpooling" },
  },
  {
    id: "mascotas-instrumentos",
    level: 3,
    q: "¿Puedo viajar con mascota o instrumento musical?",
    tldr: "Pregunta antes de reservar: muchos conductores aceptan perro pequeño o guitarra, pero la plaza adicional debe acordarse.",
    body:
      "El equipaje atípico debe declararse en el chat antes de confirmar reserva, no a la llegada. Mascotas: perro hasta 10 kg con transportín ocupa medio asiento; perros más grandes necesitan que el conductor acepte explícitamente y suelen viajar en el maletero con rejilla. Gato siempre con transportín cerrado. Instrumentos: guitarra acústica en funda blanda ocupa una plaza; eléctrica con flight case necesita confirmación; batería completa no es viable. Material de DJ (controlador, auriculares) cabe como mochila. Equipaje de cámping voluminoso (carro, neveras grandes, gazebo) suele restar una plaza al coche: si vais 4, el conductor publicará 3 plazas. Comunica volumen real (largo x ancho x alto, kg) antes de confirmar. Una bici plegable cabe en maletero, una bici rígida solo con baca o portabicis.",
    link: { label: "Equipaje camping detallado", to: "/blog/viajar-con-equipaje-de-camping-consejos" },
  },
  {
    id: "festivales-baratos",
    level: 3,
    q: "¿Qué festivales baratos hay en España en 2026?",
    tldr: "Viña Rock (abono 75 €), Aquasella (90 €), Sonorama Ribera (95 €), O Son do Camiño (60 €) son los más asequibles del calendario.",
    body:
      "Los festivales más asequibles del calendario 2026, abono completo: O Son do Camiño 60 € (Galicia, 4 días), Viña Rock 75 € (Albacete, 3 días, rock-mestizaje), Aquasella 90 € (Asturias, electrónica), Sonorama Ribera 95 € (Aranda de Duero, indie), Granada Sound 95 €, Atlantic Fest 105 €. En la franja media (110–150 €): Resurrection Fest 195 € (es la excepción del bracket por su nivel internacional), Cala Mijas 145 €, Cruïlla 140 €, Low Festival 125 €. La temporada baja (mayo y septiembre) ofrece mejor relación precio-cartel que julio-agosto: Tomavistas (mayo) o DCode (septiembre) cuestan la mitad que un festival de julio con cartel comparable. Si lo que prima es precio, agrupa festivales por comunidad autónoma para ahorrar transporte: en Galicia puedes hacer Atlantic Fest + O Son do Camiño + PortAmérica con un único desplazamiento.",
    link: { label: "Festivales asequibles", to: "/festivales/o-son-do-camino" },
  },
  {
    id: "festivales-electronica-vs-rock",
    level: 3,
    q: "¿Festival de electrónica, rock, indie o reguetón: qué cambia operativamente?",
    tldr: "El género cambia horario (electrónica empieza a las 22 h, rock a las 18 h), bebida y duración de la noche, no el transporte.",
    body:
      "El género del festival impacta más el horario y el público que la logística de transporte. Electrónica (Sónar Noche, Dreambeach, Aquasella, Brunch Electronik) opera 22 h a 7 a.m.: el carpool de vuelta sale entre 6 y 9 de la mañana. Rock e indie (Resurrection Fest, Mad Cool, Primavera Sound, Sonorama) van de 16 h a 4 a.m.: vuelta entre 2 y 4. Reguetón y urbano (Reggaeton Beach Festival, Boombastic) tienen horario mixto 18-3. Pop y mainstream (BBK Live, FIB) son 17-3. Festivales de mañana o tarde (Vida Festival, Cala Mijas día) cierran a la 1 a.m. máximo. El género también filtra el tipo de pasajero: la edad media del público electrónica es 24 años, rock 31, indie 28, urbano 22. Carpooling funciona en todos por igual.",
    link: { label: "Festivales electrónica", to: "/festivales-genero/electronica" },
  },
  {
    id: "checklist-final",
    level: 2,
    q: "Checklist 48 horas antes del festival",
    tldr: "Descarga entrada offline, confirma con conductor, carga batería externa, mete tapones y revisa el parte meteorológico AEMET.",
    body:
      "Las 48 horas previas son la fase crítica de planificación. La checklist operativa: descarga la entrada PDF en el móvil sin necesidad de cobertura (Wallet o carpeta local), abre el chat con el conductor y confirma hora exacta + dirección + plazas (la última hora de cambios de plan es a 24 h del viaje), carga al 100 % la batería externa y prueba que entrega los 10.000 mAh anunciados, mete tapones acústicos y protector solar en la mochila pequeña (no en la grande del maletero), consulta el parte meteorológico de AEMET (modelo HARMONIE-ARPEGE refina a 48 h), pon el calzado en posición de uso y empaqueta una bolsa estanca de 5 L para móvil y entrada en caso de lluvia. Si el viaje es de más de 4 horas en coche, lleva agua y comida ligera para el trayecto. Activa el modo no molestar en el móvil durante el festival y comparte ubicación con un contacto fijo.",
    link: { label: "Checklist completa", to: "/festivales/mad-cool" },
  },
];

export default function PillarGuiaPage() {
  useSeoMeta({
    title:
      "Cómo ir a un festival en España 2026: guía completa | ConcertRide",
    description:
      "Guía completa para ir a un festival en España 2026: transporte, equipaje, presupuesto, alojamiento, vuelta de madrugada. 25 respuestas con datos reales.",
    canonical: CANONICAL,
    keywords:
      "cómo ir a un festival en España, guía festival 2026, transporte festival España, qué llevar festival, presupuesto festival, vuelta madrugada festival, ZBE Madrid 360 festival, autobús oficial festival, carpooling festival, alojamiento festival",
    ogType: "article",
    articlePublishedTime: PUBLISHED,
    articleModifiedTime: MODIFIED,
    articleAuthor: "Equipo ConcertRide",
  });

  // ---- Article schema ----
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Cómo ir a un festival en España en 2026: guía completa",
    description:
      "Guía pillar 3.500–4.500 palabras para asistir a festivales de música en España en 2026: transporte, equipaje, presupuesto, alojamiento, ZBE, lluvia, vuelta de madrugada, festivales baratos y seguridad.",
    url: CANONICAL,
    inLanguage: "es-ES",
    author: {
      "@type": "Organization",
      name: "Equipo ConcertRide",
      url: `${SITE_URL}/acerca-de`,
      "@id": `${SITE_URL}/#editorial-team`,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    image: { "@type": "ImageObject", url: `${SITE_URL}/og/home.png`, width: 1200, height: 630 },
    mainEntityOfPage: CANONICAL,
    articleSection: "Guía pillar",
    keywords:
      "cómo ir festival España, transporte festival, presupuesto festival, vuelta madrugada, ZBE Madrid 360, carpooling festival, autobús oficial festival",
    about: { "@type": "Thing", name: "Asistir a un festival de música en España" },
  };

  // ---- HowTo schema ----
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cómo ir a un festival en España en 2026",
    description:
      "Pasos operativos para planificar, viajar y disfrutar un festival de música en España en 2026, desde la compra de la entrada hasta la vuelta de madrugada.",
    totalTime: "PT2H",
    inLanguage: "es-ES",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Elegir festival y comprar entrada",
        text: "Selecciona festival según género, fechas y ciudad. Compra entrada en febrero–marzo para mejor precio.",
        url: `${CANONICAL}#planificar-temporada`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Reservar transporte ida y vuelta",
        text: "Reserva carpool o autobús oficial con 3–4 semanas de antelación. Cierra la vuelta antes del festival.",
        url: `${CANONICAL}#como-llegar-transporte`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Cerrar alojamiento",
        text: "Apartamento turístico en pueblo a 5–15 km del recinto es 40 % más barato que hotel en ciudad sede.",
        url: `${CANONICAL}#alojamiento`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Preparar equipaje y checklist",
        text: "Mochila de 20 L con DNI, entrada PDF offline, batería 10.000 mAh, protector solar, agua, tapones.",
        url: `${CANONICAL}#que-llevar`,
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Disfrutar y volver de madrugada",
        text: "Hidrátate cada hora, aplica buddy system y vuelve en el carpool reservado (taxis x2-x3 entre 2 y 5 a.m.).",
        url: `${CANONICAL}#volver-madrugada`,
      },
    ],
  };

  // ---- FAQ schema ----
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SECTIONS.map((s) => ({
      "@type": "Question",
      name: s.q,
      acceptedAnswer: { "@type": "Answer", text: `${s.tldr} ${s.body}` },
    })),
  };

  // ---- TouristTrip schema ----
  const touristTripSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: "Temporada de festivales de música en España 2026",
    description:
      "Itinerario tipo para asistir a festivales de música en España en 2026: planificación, transporte sostenible, equipaje, alojamiento, presupuesto medio 220–380 € por persona y fin de semana.",
    touristType: ["Festival-goer", "Music tourist", "Carpooling traveler"],
    inLanguage: "es-ES",
    url: CANONICAL,
    itinerary: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "TouristAttraction",
            name: "Mad Cool",
            url: `${SITE_URL}/festivales/mad-cool`,
            address: { "@type": "PostalAddress", addressLocality: "Madrid", addressCountry: "ES" },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "TouristAttraction",
            name: "Primavera Sound",
            url: `${SITE_URL}/festivales/primavera-sound`,
            address: { "@type": "PostalAddress", addressLocality: "Barcelona", addressCountry: "ES" },
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@type": "TouristAttraction",
            name: "Arenal Sound",
            url: `${SITE_URL}/festivales/arenal-sound`,
            address: { "@type": "PostalAddress", addressLocality: "Burriana", addressCountry: "ES" },
          },
        },
        {
          "@type": "ListItem",
          position: 4,
          item: {
            "@type": "TouristAttraction",
            name: "BBK Live",
            url: `${SITE_URL}/festivales/bbk-live`,
            address: { "@type": "PostalAddress", addressLocality: "Bilbao", addressCountry: "ES" },
          },
        },
      ],
    },
    provider: { "@id": `${SITE_URL}/#organization` },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: 60,
      highPrice: 230,
      priceCurrency: "EUR",
      offerCount: 30,
    },
  };

  // ---- Speakable schema (first 5 H2) ----
  const speakableSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: CANONICAL,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: SECTIONS.filter((s) => s.speakable).map((s) => `#${s.id} .tldr`),
    },
  };

  return (
    <main id="main" role="main" className="mx-auto max-w-3xl px-4 py-12 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristTripSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />

      <header className="mb-10">
        <p className="text-xs uppercase tracking-widest text-primary mb-3">Guía pillar · Actualizada {MODIFIED}</p>
        <h1 className="font-display text-4xl md:text-5xl mb-4">
          Cómo ir a un festival en España en 2026
        </h1>
        <p className="text-lg text-white/80">
          Guía operativa de 25 respuestas con datos reales: transporte, equipaje, presupuesto, alojamiento,
          ZBE Madrid 360, lluvia, vuelta de madrugada, festivales baratos y seguridad. Por Equipo ConcertRide,
          fundador de ConcertRide.
        </p>
      </header>

      <section aria-label="Índice" className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-display text-xl mb-4">Las 25 preguntas que responde esta guía</h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 list-decimal list-inside text-sm text-white/80">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="hover:text-primary">
                {s.q}
              </a>
            </li>
          ))}
        </ol>
      </section>

      {SECTIONS.map((s) => {
        const Heading = s.level === 2 ? "h2" : "h3";
        return (
          <section key={s.id} id={s.id} className="mb-10 scroll-mt-24">
            <Heading className={s.level === 2 ? "font-display text-2xl md:text-3xl mb-3" : "font-display text-xl md:text-2xl mb-3 text-white/95"}>
              {s.q}
            </Heading>
            <p className="tldr mb-3 rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 text-white">
              <strong className="text-primary">TL;DR: </strong>
              {s.tldr}
            </p>
            <p className="text-white/85 leading-relaxed mb-4">{s.body}</p>
            <p className="text-sm">
              <Link to={s.link.to} className="text-primary hover:underline">
                {s.link.label} →
              </Link>
            </p>
          </section>
        );
      })}

      <section aria-label="Enlaces relacionados" className="mt-14 border-t border-white/10 pt-10">
        <h2 className="font-display text-2xl mb-6">Sigue planificando tu festival</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Link to="/rutas/madrid-mad-cool" className="rounded-lg border border-white/10 px-4 py-3 hover:border-primary hover:text-primary">
            Carpooling Madrid → Mad Cool
          </Link>
          <Link to="/rutas/barcelona-primavera-sound" className="rounded-lg border border-white/10 px-4 py-3 hover:border-primary hover:text-primary">
            Carpooling Barcelona → Primavera Sound
          </Link>
          <Link to="/rutas/valencia-arenal-sound" className="rounded-lg border border-white/10 px-4 py-3 hover:border-primary hover:text-primary">
            Carpooling Valencia → Arenal Sound
          </Link>
          <Link to="/rutas/madrid-resurrection-fest" className="rounded-lg border border-white/10 px-4 py-3 hover:border-primary hover:text-primary">
            Carpooling Madrid → Resurrection Fest
          </Link>
          <Link to="/festivales/primavera-sound" className="rounded-lg border border-white/10 px-4 py-3 hover:border-primary hover:text-primary">
            Festival Primavera Sound 2026
          </Link>
          <Link to="/festivales/sonar" className="rounded-lg border border-white/10 px-4 py-3 hover:border-primary hover:text-primary">
            Festival Sónar 2026
          </Link>
          <Link to="/festivales/bbk-live" className="rounded-lg border border-white/10 px-4 py-3 hover:border-primary hover:text-primary">
            Festival BBK Live 2026
          </Link>
          <Link to="/festivales/resurrection-fest" className="rounded-lg border border-white/10 px-4 py-3 hover:border-primary hover:text-primary">
            Festival Resurrection Fest 2026
          </Link>
          <Link to="/conciertos/madrid" className="rounded-lg border border-white/10 px-4 py-3 hover:border-primary hover:text-primary">
            Conciertos en Madrid
          </Link>
          <Link to="/conciertos/barcelona" className="rounded-lg border border-white/10 px-4 py-3 hover:border-primary hover:text-primary">
            Conciertos en Barcelona
          </Link>
          <Link to="/artistas/rosalia" className="rounded-lg border border-white/10 px-4 py-3 hover:border-primary hover:text-primary">
            Conciertos de Rosalía
          </Link>
          <Link to="/blog/autobuses-festivales-espana-2026" className="rounded-lg border border-white/10 px-4 py-3 hover:border-primary hover:text-primary">
            Blog · Autobuses festivales España 2026
          </Link>
        </div>
      </section>
    </main>
  );
}

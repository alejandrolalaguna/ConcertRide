import { Link } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * /faq — Hub central de preguntas frecuentes (Sprint 10).
 *
 * Mantra: cada respuesta es un "claim citable" para LLMs (Perplexity, ChatGPT,
 * Gemini, AI Overviews). Respuestas declarativas, < 90 palabras, factuales.
 *
 * Cobertura: 8 clusters × ~10 Q&As = ~80 Q&As totales. UI: <details>/<summary>
 * nativo HTML para evitar JS (mejor LCP / accesibilidad por defecto).
 *
 * Schema: FAQPage JSON-LD único con todas las Q&As. Google deprecated FAQ
 * rich-results en mayo 2024, pero sigue siendo señal semántica y AI Overviews
 * lo extraen.
 */

type Faq = { q: string; a: string; id: string };
type Cluster = { id: string; title: string; intro?: string; items: Faq[] };

const CLUSTERS: Cluster[] = [
  {
    id: "carpooling",
    title: "Sobre carpooling",
    intro: "Qué es ConcertRide, cómo funciona, comisión 0%, seguro, verificación y cancelaciones.",
    items: [
      {
        id: "que-es-concertride",
        q: "¿Qué es ConcertRide?",
        a: "ConcertRide es una plataforma española de carpooling (coche compartido) exclusiva para conciertos y festivales. Conecta a fans que van al mismo evento para compartir coche, dividir gastos y llegar juntos. Es gratis, sin comisiones y sin publicidad.",
      },
      {
        id: "que-es-carpooling",
        q: "¿Qué es el carpooling y cómo funciona?",
        a: "Carpooling es compartir coche entre particulares para hacer un mismo trayecto. El conductor publica su viaje (origen, destino, hora, precio por asiento) y los pasajeros reservan plaza. El precio cubre solo combustible y peajes — no es una actividad lucrativa por ley.",
      },
      {
        id: "como-funciona-pasajero",
        q: "¿Cómo funciona para un pasajero?",
        a: "1) Busca el concierto al que vas. 2) Elige un viaje publicado desde tu ciudad de origen. 3) Envía una solicitud (o reserva al instante si está activada). 4) Paga al conductor en efectivo o Bizum cuando te recoja. Recibirás un email y una notificación push 24 h antes del viaje.",
      },
      {
        id: "como-funciona-conductor",
        q: "¿Cómo funciona para un conductor?",
        a: "1) Verifica tu carnet en Mi perfil. 2) Pulsa Publicar un viaje, selecciona el concierto, tu origen y tu hora de salida. 3) Fija el precio por asiento y el número de plazas. 4) Acepta o rechaza las solicitudes de los pasajeros. Puedes cancelar o editar el viaje hasta el último momento.",
      },
      {
        id: "comision-0",
        q: "¿Cuánto cobra ConcertRide de comisión?",
        a: "0%. ConcertRide no cobra comisión a conductores ni pasajeros. El 100 % del precio del asiento (3–22 € según distancia) va al conductor. Las plataformas de carpooling generalistas cobran entre el 10 % y el 18 % por trayecto.",
      },
      {
        id: "es-gratis",
        q: "¿ConcertRide es realmente gratis?",
        a: "Sí. Crear cuenta, publicar un viaje y reservar plaza son acciones 100% gratuitas. Solo pagas al conductor el precio por asiento que él fija (típicamente 3–22 €) para cubrir gasolina y peajes. No hay suscripciones, no hay tarjetas, no hay cargos ocultos.",
      },
      {
        id: "como-cancelar-reserva",
        q: "¿Puedo cancelar mi reserva?",
        a: "Sí, en cualquier momento antes de la salida. Ve a Mis viajes → selecciona la reserva → pulsa Cancelar reserva. Notificamos al conductor y la plaza vuelve a estar disponible. Como el pago se hace en persona, no hay reembolsos que gestionar a través de la plataforma.",
      },
      {
        id: "que-pasa-si-conductor-cancela",
        q: "¿Qué pasa si el conductor cancela el viaje?",
        a: "Te enviamos email y notificación push inmediatamente. La reserva se cancela automáticamente. No has pagado nada por anticipado, así que no hay reembolso que gestionar. Puedes buscar otro viaje al mismo concierto en la misma ficha en segundos.",
      },
      {
        id: "es-seguro",
        q: "¿Es seguro viajar con ConcertRide?",
        a: "Sí. Todos los conductores verifican carnet de conducir antes de publicar. Cada perfil muestra valoración media, número de viajes y reseñas de pasajeros anteriores. El email está verificado. Hay sistema de reportes 24/7 y suspensión por incumplimiento grave.",
      },
      {
        id: "necesito-cuenta",
        q: "¿Tengo que crear cuenta para usar la plataforma?",
        a: "No para explorar conciertos y ver viajes. Sí para publicar un viaje o reservar plaza (necesitamos tu email verificado). El registro es gratis y solo pide nombre + email + contraseña + aceptar los términos. Sin tarjeta de crédito, sin verificación de teléfono obligatoria.",
      },
      {
        id: "edad-minima",
        q: "¿Cuál es la edad mínima para usar ConcertRide?",
        a: "18 años para registrarse como conductor o pasajero. Los menores de 18 deben viajar acompañados de un tutor que sea el titular de la reserva. Esta política protege tanto a usuarios como conductores frente a responsabilidades legales.",
      },
      {
        id: "cuantos-festivales",
        q: "¿A cuántos festivales y conciertos puedo ir?",
        a: "Tenemos datos de 50+ festivales españoles (Mad Cool, Primavera Sound, Sónar, FIB, BBK Live, Resurrection Fest, Arenal Sound, Viña Rock, Cala Mijas, Sonorama, Zevra y más) y miles de conciertos individuales en toda España (Ticketmaster Discovery API v2).",
      },
      {
        id: "alternativa-taxi",
        q: "¿Es ConcertRide una alternativa al taxi después de un concierto?",
        a: "Sí. Los conciertos terminan entre las 23:00 y las 02:00, cuando el transporte público es escaso y los taxis nocturnos cuestan 30–60 € por trayecto. Con ConcertRide, varios fans comparten el viaje de vuelta — precio típico 8–15 € por asiento desde ciudades cercanas.",
      },
      {
        id: "diferencia-otras-plataformas",
        q: "¿En qué se diferencia ConcertRide de otras plataformas de carpooling?",
        a: "ConcertRide está diseñada exclusivamente para conciertos y festivales. El viaje está sincronizado con el horario del evento, ves a qué concierto van los otros pasajeros (vibe matching), accedes al chat del concierto antes de reservar y el 100 % del precio va al conductor (0 % de comisión). Las plataformas generalistas no tienen catálogo de festivales ni filtros por evento.",
      },
      {
        id: "horarios-festival",
        q: "¿Los viajes coinciden con los horarios del festival?",
        a: "Sí. Esa es la razón principal de existir de ConcertRide. Al publicar un viaje, el conductor selecciona el concierto desde el catálogo y el sistema sugiere horarios de ida (hora de apertura ± 2 h) y vuelta (cierre + 30 min). Los pasajeros filtran por hora de salida y deciden.",
      },
    ],
  },

  {
    id: "rutas-precios",
    title: "Sobre rutas y precios",
    intro: "Cómo se calcula el precio, top rutas, qué incluye, propinas y métodos de pago.",
    items: [
      {
        id: "como-se-calcula-precio",
        q: "¿Cómo se calcula el precio por asiento?",
        a: "El conductor fija el precio basándose en kilómetros × precio actual del combustible (datos del MITECO, Ministerio para la Transición Ecológica) ÷ número de plazas. El sistema sugiere el precio justo. Por ley, el precio total cobrado no puede superar el coste proporcional del viaje.",
      },
      {
        id: "que-incluye-precio",
        q: "¿Qué incluye el precio del asiento?",
        a: "Combustible y peajes proporcionales al pasajero. NO incluye: entrada al festival, comida, hotel, parking del recinto, taxi local al punto de recogida. ConcertRide cubre solo el trayecto en coche desde el origen hasta el recinto (y vuelta si aplica).",
      },
      {
        id: "rango-precios",
        q: "¿Cuánto cuesta un asiento de carpooling a un festival?",
        a: "Rango típico 2026: 3–22 € por asiento. Trayectos cortos (<100 km) sobre 3–8 €. Medios (100–300 km) sobre 8–15 €. Largos (>300 km) sobre 15–22 €. Furgoneta compartida con 7 plazas baja el precio incluso desde 300 km a 3–8 €/persona.",
      },
      {
        id: "metodos-pago",
        q: "¿Cómo se paga al conductor?",
        a: "Efectivo o Bizum, directamente al conductor el día del viaje. ConcertRide no intermedia ningún pago. No hay tarjeta de crédito, no hay comisión de pasarela, no hay cargos diferidos. El precio que ves es el que pagas en mano.",
      },
      {
        id: "propina",
        q: "¿Se da propina al conductor?",
        a: "No es práctica habitual en el carpooling español. El conductor ya cubre sus gastos con el precio del asiento. Si quieres mostrar agradecimiento, lo mejor es dejar una reseña 5★ en su perfil — es lo que más le ayuda a conseguir más pasajeros en futuros viajes.",
      },
      {
        id: "rutas-mas-populares",
        q: "¿Cuáles son las rutas de carpooling más populares?",
        a: "Top 5 rutas 2026: Madrid → Mad Cool (5 €), Madrid → Primavera Sound Barcelona (35 €), Valencia → Arenal Sound (8 €), Bilbao → BBK Live (4 €), Madrid → Resurrection Fest Viveiro (45 €). Ver listado completo en /rutas.",
      },
      {
        id: "ruta-no-disponible",
        q: "¿Qué hago si no hay viajes en mi ruta?",
        a: "Activa el botón 'Me interesa un viaje' en la ficha del concierto. Esto registra tu demanda, se muestra a posibles conductores (contador 'X personas buscan viaje') y te notifica por email y push cuando alguien publica viaje desde tu ciudad.",
      },
      {
        id: "precio-mas-barato",
        q: "¿Cuál es el carpooling más barato a un festival?",
        a: "Trayectos urbanos cortos (10–50 km) salen por 3–5 € por asiento. Ejemplos: Madrid centro → IFEMA Mad Cool (4 €), Bilbao centro → Kobetamendi BBK Live (4 €), Valencia centro → Arenal Sound Burriana (8 €).",
      },
      {
        id: "divisa-aceptada",
        q: "¿Solo se aceptan euros?",
        a: "Sí. ConcertRide opera exclusivamente en España y todos los precios están en EUR. Bizum y efectivo son métodos de pago españoles. No tenemos cambio automático de divisa porque no operamos fuera del territorio nacional.",
      },
      {
        id: "comparativa-bus-tren",
        q: "¿Carpooling es más barato que bus o tren?",
        a: "Casi siempre sí. Ejemplo Madrid → Resurrection Fest (550 km): bus organizado 60–80 €, tren AVE Renfe 90–130 € (sin combinación directa), carpooling ConcertRide 30–45 €. Para festivales rurales (Resurrection, Viña Rock, Sonorama) el carpooling es la única opción asequible.",
      },
      {
        id: "carpooling-grupo",
        q: "¿Puedo reservar varias plazas para mi grupo?",
        a: "Sí, si el conductor publica plazas suficientes. Indica en el chat del viaje cuántos sois. Algunos conductores ofrecen descuento por reservas de grupo (ej. 3+ plazas = -1 €/plaza). Para grupos grandes (5+), busca viajes en furgoneta de 7–9 plazas.",
      },
      {
        id: "ida-vuelta",
        q: "¿Puedo reservar ida y vuelta a un festival?",
        a: "Sí. Hay tres opciones: (1) el mismo conductor ofrece viaje de ida + vuelta y reservas ambas plazas; (2) reservas plazas en dos viajes distintos (un conductor para ida, otro para vuelta); (3) compartes contacto con el conductor durante el festival para coordinar la vuelta in situ.",
      },
      {
        id: "extras-equipaje",
        q: "¿Puedo llevar mucho equipaje a un festival?",
        a: "Depende del conductor y del coche. Cada viaje indica el espacio disponible para equipaje (pequeño / mediano / grande). Para festivales con camping (Arenal, Viña Rock, Resurrection) busca explícitamente 'equipaje camping aceptado'. Comparte mochila + tienda + sacos con tu grupo para no sobrecargar el maletero.",
      },
      {
        id: "precio-festival-internacional",
        q: "¿Puedo usar ConcertRide para ir a festivales fuera de España?",
        a: "No actualmente. ConcertRide opera exclusivamente para conciertos y festivales en territorio español. Para festivales fronterizos (sur de Francia, norte de Portugal) algunos conductores ofrecen rutas internacionales puntuales, pero no es nuestra cobertura principal.",
      },
      {
        id: "calculadora-precio",
        q: "¿Hay una calculadora de precio justo del carpooling?",
        a: "Sí. Cuando publicas viaje, el formulario sugiere el precio basándose en km × precio combustible MITECO ÷ plazas. También puedes consultar precios medios por ruta en /datos (dataset abierto CC BY 4.0 con 57 festivales españoles y sus rutas).",
      },
    ],
  },

  {
    id: "festivales",
    title: "Sobre festivales",
    intro: "Qué festivales cubrimos, calendario 2026 y géneros incluidos.",
    items: [
      {
        id: "festivales-cubiertos",
        q: "¿A qué festivales cubre ConcertRide?",
        a: "50+ festivales españoles 2026 con rutas activas: Mad Cool, Primavera Sound, Sónar, FIB, BBK Live, Arenal Sound, Viña Rock, Resurrection Fest, Cala Mijas, Sonorama, Low Festival, Cruïlla, Tomavistas, Medusa, Reggaeton Beach, Pirineos Sur, Starlite, Atlantic Fest, Vive Latino, Les Arts y más.",
      },
      {
        id: "como-eligen-festivales",
        q: "¿Cómo se eligen los festivales del catálogo?",
        a: "Tres criterios: (1) tamaño (>5.000 asistentes/día), (2) accesibilidad complicada (recinto rural o ciudad pequeña con transporte público limitado), (3) demanda activa de usuarios. Festivales con menos del 1 % de búsquedas anuales no se incluyen para evitar páginas vacías.",
      },
      {
        id: "festivales-2026",
        q: "¿Qué festivales hay en 2026 en España?",
        a: "Calendario destacado 2026: Mad Cool 9–11 julio (Madrid), Primavera Sound 28 mayo–1 junio (Barcelona), Sónar 18–20 junio (Barcelona), BBK Live 9–11 julio (Bilbao), Arenal Sound 28 jul–3 ago (Burriana), Viña Rock 30 abr–3 may (Villarrobledo), FIB 16–19 julio (Benicàssim), Resurrection Fest 1–4 julio (Viveiro).",
      },
      {
        id: "festivales-por-mes",
        q: "¿Qué festivales hay cada mes en España?",
        a: "Abril–mayo: Viña Rock, SOS 4.8. Junio: Primavera Sound, Sónar, Download Madrid. Julio: Mad Cool, BBK Live, Resurrection, FIB, Bilbao Bizkaia Live. Agosto: Arenal Sound, Sonorama, Reggaeton Beach Salou, Cala Mijas. Septiembre: DCode, Vive Latino, Stone&Music.",
      },
      {
        id: "festivales-gratis",
        q: "¿Hay festivales gratuitos en España en 2026?",
        a: "Sí. Algunos festivales municipales (Tomavistas Madrid, fiestas patronales) son parcial o totalmente gratis. Otros tienen jornadas o conciertos abiertos. Consulta cada ficha en /festivales para ver precio de entrada confirmado por el organizador.",
      },
      {
        id: "festivales-rock",
        q: "¿Qué festivales de rock cubre ConcertRide?",
        a: "Resurrection Fest (metal, Viveiro), Viña Rock (rock/punk/hip-hop, Villarrobledo), Download Madrid (rock/metal), Azkena Rock (Vitoria), Stone&Music (Mérida), Atlantic Fest (Vilagarcía). Ver listado completo por género en /festivales-genero/rock.",
      },
      {
        id: "festivales-electronica",
        q: "¿Y festivales de electrónica?",
        a: "Sónar Barcelona, Medusa Festival (Cullera), Aquasella (Asturias), Dreambeach (Almería), DGTL Barcelona, Reggaeton Beach Salou. Ver listado completo en /festivales-genero/electronica.",
      },
      {
        id: "festivales-indie",
        q: "¿Qué festivales indie hay?",
        a: "Primavera Sound (Barcelona), Mad Cool (Madrid), Tomavistas (Madrid), Cala Mijas (Málaga), Cruïlla (Barcelona), Low Festival (Benidorm), Bilbao BBK Live, Sonorama Ribera (Aranda de Duero), Atlantic Fest (Galicia). Ver /festivales-genero/indie.",
      },
      {
        id: "festivales-pop-latino",
        q: "¿Hay festivales de pop latino y reggaeton?",
        a: "Sí: Reggaeton Beach Salou, Vive Latino Zaragoza, Starlite Marbella (mezcla pop/latino con grandes artistas). También conciertos individuales de artistas latinos en estadios (Bizarrap, Bad Bunny, Quevedo, Anuel AA).",
      },
      {
        id: "festivales-jazz-blues",
        q: "¿Festivales de jazz y blues?",
        a: "Festival de Jazz de San Sebastián (Heineken Jazzaldia), Festival de Jazz de Vitoria, Pirineos Sur, Festival de Cap Roig. Para muchos es necesario carpooling porque están en localidades pequeñas con poca conexión nocturna.",
      },
      {
        id: "festivales-canarias-baleares",
        q: "¿Cubrís festivales en Canarias y Baleares?",
        a: "Sí parcialmente. En Canarias: festivales urbanos en Las Palmas y Santa Cruz de Tenerife. En Baleares: Mallorca Live Festival, festivales en Ibiza. Para estas islas el carpooling cubre el trayecto desde el aeropuerto/puerto al recinto, no el viaje en avión/barco.",
      },
      {
        id: "tickets-festival",
        q: "¿Vendéis entradas para los festivales?",
        a: "No directamente. ConcertRide es plataforma de transporte, no ticketing. En cada ficha de festival incluimos enlace a Ticketmaster (cuando hay entrada disponible vía API Discovery v2) y a la web oficial del festival. Compra las entradas en sus canales oficiales.",
      },
      {
        id: "festival-cancelado",
        q: "¿Qué pasa con mi viaje si el festival se cancela o se pospone?",
        a: "El conductor puede cancelar el viaje sin penalización. Te notificamos por email y push. Si el festival se reprograma, el conductor suele reabrir el viaje para la nueva fecha — recibirás alerta para reservar otra vez. Como el pago es en persona, no hay reembolso que gestionar.",
      },
      {
        id: "festival-info-oficial",
        q: "¿La información de festivales es oficial?",
        a: "Sí. Datos de eventos provienen de Ticketmaster Discovery API v2 (fechas, recintos, precios desde Ticketmaster) más datos públicos del organizador (cartel, géneros, capacidad). Ningún dato es inventado. Cada ficha enlaza a Ticketmaster y a la web oficial del festival.",
      },
      {
        id: "festivales-eco",
        q: "¿Qué festivales tienen certificación de sostenibilidad?",
        a: "Primavera Sound (ISO 20121), Cruïlla (Reduce CO₂), BBK Live (programa GreenEvent), Resurrection Fest (programa de reciclaje). El carpooling reduce hasta un 75 % la huella CO₂ del transporte de cada asistente vs ir solo en coche.",
      },
    ],
  },

  {
    id: "conductores",
    title: "Sobre conductores",
    intro: "Cómo publicar viaje, marco legal, ingresos y resolución de conflictos.",
    items: [
      {
        id: "como-ser-conductor",
        q: "¿Cómo me convierto en conductor en ConcertRide?",
        a: "1) Crea cuenta con email verificado. 2) Sube foto de tu carnet de conducir en Mi perfil → Verificación. 3) Espera 24–48 h a la validación manual. 4) Cuando esté aprobado, pulsa 'Publicar un viaje' y completa origen, destino, hora, plazas y precio.",
      },
      {
        id: "requisitos-conductor",
        q: "¿Qué requisitos hay para conducir?",
        a: "Mayoría de edad, carnet B válido, vehículo asegurado a todo riesgo o terceros ampliado con cobertura para pasajeros, ITV en regla. ConcertRide no verifica el seguro ni la ITV — es responsabilidad del conductor cumplir con la normativa vigente.",
      },
      {
        id: "marco-legal-carpooling",
        q: "¿El carpooling es legal en España?",
        a: "Sí, regulado por la Ley de Ordenación de los Transportes Terrestres (LOTT) y la Sentencia TJUE C-434/15 (Asociación Profesional Élite Taxi). Mientras el conductor no obtenga beneficio (precio ≤ coste proporcional combustible+peajes), no requiere licencia VTC ni de transporte público.",
      },
      {
        id: "puedo-ganar-dinero",
        q: "¿Puedo ganar dinero llevando gente a conciertos?",
        a: "No legalmente. Por ley, el conductor solo puede cobrar el coste proporcional del viaje (combustible + peajes ÷ plazas). El objetivo es compartir gastos, no obtener beneficio. Si ya ibas al festival, los pasajeros te cubren la gasolina y el viaje te sale prácticamente gratis.",
      },
      {
        id: "cuanto-gana-conductor",
        q: "¿Cuánto recibe el conductor por viaje?",
        a: "El 100 % del precio que pagan los pasajeros (sin comisión de plataforma). Ejemplo: 3 pasajeros × 10 €/asiento = 30 € para el conductor, justo lo necesario para cubrir 200 km de combustible. Sin beneficio neto, en línea con la ley de carpooling no lucrativo.",
      },
      {
        id: "seguro-pasajeros",
        q: "¿Mi seguro cubre a los pasajeros de carpooling?",
        a: "El seguro obligatorio a terceros cubre lesiones de los pasajeros en caso de accidente del conductor. Para cobertura completa (daños propios, asistencia carretera) hace falta póliza a todo riesgo. ConcertRide recomienda revisar tu póliza con tu compañía antes de publicar.",
      },
      {
        id: "que-pasa-no-show",
        q: "¿Qué hago si un pasajero no se presenta (no-show)?",
        a: "Repórtalo desde el viaje: Mi viaje → Pasajero → Reportar → No-show. La plaza queda registrada como no-show en su histórico (afecta a su tasa de aceptación futura). Si tienes su contacto, intenta contactarlo antes de salir. Tras 15 min de espera puedes partir sin penalización.",
      },
      {
        id: "puedo-rechazar-pasajeros",
        q: "¿Puedo rechazar pasajeros?",
        a: "Sí. Como conductor, puedes aprobar o rechazar cada solicitud individualmente sin justificar. No están permitidos rechazos por discriminación (género, origen, orientación, religión, discapacidad) — esos casos son reportables y suponen suspensión.",
      },
      {
        id: "punto-recogida",
        q: "¿Dónde recojo a los pasajeros?",
        a: "En el punto que indiques al publicar el viaje. Recomendaciones: estaciones de transporte (metro/cercanías/AVE), gasolineras a la salida de la ciudad, plazas céntricas. Evita calles estrechas o sin parking. Avisa por chat 30 min antes con ubicación exacta y matrícula del coche.",
      },
      {
        id: "cancelar-viaje",
        q: "¿Puedo cancelar un viaje publicado?",
        a: "Sí, hasta el último momento. Notificamos automáticamente a los pasajeros con reserva. Cancelaciones repetidas afectan tu valoración. Si cancelas en las 24 h previas avisa también por chat con la justificación — los pasajeros agradecen tener tiempo para buscar alternativa.",
      },
    ],
  },

  {
    id: "seguridad",
    title: "Sobre seguridad",
    intro: "Verificación de identidad, reseñas, soporte y opciones para colectivos.",
    items: [
      {
        id: "verificacion-identidad",
        q: "¿Cómo verificáis la identidad del conductor?",
        a: "Tres capas: (1) email verificado obligatorio; (2) foto del carnet de conducir validada manualmente antes del primer viaje; (3) sistema de valoraciones públicas 1–5 estrellas con reseñas de pasajeros. El nombre y foto del conductor están visibles en su perfil público.",
      },
      {
        id: "ver-resenas-conductor",
        q: "¿Puedo ver las reseñas del conductor antes de reservar?",
        a: "Sí. Cada perfil de conductor muestra: valoración media, número total de viajes, distribución de estrellas, últimas 10 reseñas escritas por pasajeros, idiomas que habla y modelo de coche. Toda información necesaria para decidir antes de pulsar Reservar.",
      },
      {
        id: "como-reportar",
        q: "¿Cómo reporto un problema con otro usuario?",
        a: "Botón Reportar en el perfil del usuario o en el chat del viaje. Selecciona motivo (estafa, acoso, no-show, conducción peligrosa, spam, otro) y añade detalles. Revisamos cada reporte manualmente en menos de 24 h. Casos graves implican suspensión inmediata.",
      },
      {
        id: "soporte-24-7",
        q: "¿Hay soporte 24/7?",
        a: "Soporte por email (help@concertride.me) con respuesta en 24 h. Para incidencias urgentes durante un viaje activo (accidente, emergencia, abandono) existe línea de atención por chat in-app con respuesta en menos de 30 min en horario nocturno de fines de semana.",
      },
      {
        id: "viajar-sola-mujeres",
        q: "¿Es seguro para mujeres viajar solas en ConcertRide?",
        a: "Sí. Recomendaciones: filtra por conductores con 5+ reseñas previas y valoración ≥ 4,5★; comparte tu ubicación en tiempo real con un contacto de confianza (función disponible); elige asientos en viajes ya parcialmente llenos. Reporta cualquier comportamiento inapropiado de inmediato.",
      },
      {
        id: "accesibilidad-discapacidad",
        q: "¿Hay viajes accesibles para personas con movilidad reducida?",
        a: "Algunos conductores indican 'accesible silla de ruedas' o 'plaza con espacio extra'. Filtra por esa opción en la búsqueda. También puedes contactar al conductor por chat antes de reservar para confirmar requisitos específicos (rampa, espacio maletero, asistencia subiendo).",
      },
      {
        id: "viajar-con-mascota",
        q: "¿Puedo viajar con mascota?",
        a: "Solo si el conductor lo permite explícitamente (icono mascota en su perfil o aviso en el chat). Pregunta antes de reservar — algunos conductores tienen alergias o cargo extra por limpieza posterior. Las mascotas guía/asistencia están permitidas siempre por ley.",
      },
      {
        id: "datos-personales-seguridad",
        q: "¿Qué datos míos ve el conductor antes de reservar?",
        a: "Tu nombre, foto de perfil (si subiste una), número de viajes previos como pasajero y valoración media. NO ve: tu teléfono, email, dirección postal, contraseña. El intercambio de contacto (Bizum, WhatsApp) ocurre solo después de que ambos confirméis la reserva.",
      },
      {
        id: "incidente-en-viaje",
        q: "¿Qué hago si tengo un incidente durante el viaje?",
        a: "1) Si hay emergencia (accidente, agresión), llama al 112. 2) Reporta el incidente desde la app cuanto puedas, con descripción y fotos si las hay. 3) Pide datos del conductor (matrícula, DNI si procede). Revisamos cada caso grave en menos de 12 h y tomamos medidas en función de la evidencia.",
      },
      {
        id: "perfil-falso",
        q: "¿Cómo detectáis perfiles falsos?",
        a: "Tres filtros: (1) email verificado obligatorio en registro; (2) carnet de conducir validado manualmente para publicar viajes; (3) detección automática de patrones sospechosos (registro masivo desde misma IP, fotos genéricas, mismo texto en varios perfiles). Reporta perfiles sospechosos.",
      },
    ],
  },

  {
    id: "sostenibilidad",
    title: "Sobre sostenibilidad",
    intro: "CO₂ ahorrado, certificaciones y movilidad sostenible a festivales.",
    items: [
      {
        id: "cuanto-co2-ahorra",
        q: "¿Cuánto CO₂ ahorra el carpooling vs ir solo en coche?",
        a: "Hasta un 75 % menos CO₂ por pasajero (Julie's Bicycle Practical Guide to Green Events). Un coche con 4 personas emite ~40 g CO₂/km/pasajero vs ~160 g CO₂/km/persona en coche en solitario. En un viaje de 300 km son ~36 kg CO₂ ahorrados por pasajero vs solo.",
      },
      {
        id: "comparado-tren",
        q: "¿Es el carpooling tan ecológico como ir en tren?",
        a: "Coche compartido con 4 personas equivale aproximadamente a un viaje en tren convencional en CO₂ por pasajero. AVE Renfe gana en eficiencia (alimentado con mix eléctrico parcial renovable). Para destinos sin estación de tren cercana (Resurrection, Arenal Sound, Viña Rock), carpooling es la opción más sostenible disponible.",
      },
      {
        id: "festival-huella-carbono",
        q: "¿Qué porcentaje de la huella de un festival es transporte?",
        a: "El 80 % de la huella de carbono de un festival proviene del transporte de los asistentes (Julie's Bicycle, A Greener Festival, ISO 20121). Por eso plataformas como ConcertRide tienen un impacto medible: cada viaje compartido elimina 1–3 coches de la carretera por trayecto.",
      },
      {
        id: "concertride-datos-co2",
        q: "¿ConcertRide publica datos de CO₂ ahorrado?",
        a: "Sí. Cada viaje muestra estimación de CO₂ ahorrado vs cada pasajero yendo solo. Los datos agregados anuales se publican en /datos (dataset CC BY 4.0) y en el informe anual de sala-de-prensa. Datos verificados con factores de emisión IDAE actualizados.",
      },
      {
        id: "concertride-eco-friendly",
        q: "¿ConcertRide cuenta con alguna certificación ecológica?",
        a: "Estamos en proceso de adhesión a A Greener Festival y ISO 20121 Event Sustainability. Como plataforma digital sin oficinas físicas y servidor 100 % en Cloudflare (renovables certificados), nuestra propia huella operativa es <0,01 % del total que ayudamos a evitar entre usuarios.",
      },
    ],
  },

  {
    id: "empresa",
    title: "Sobre la empresa",
    intro: "Quién está detrás de ConcertRide, cuándo se fundó y datos abiertos.",
    items: [
      {
        id: "quien-funda-concertride",
        q: "¿Quién fundó ConcertRide?",
        a: "Equipo ConcertRide (Zaragoza, España), ingeniero y fan de festivales españoles desde 2010. Fundó ConcertRide en 2026 tras 15 años yendo a Mad Cool, Primavera Sound, Sónar, BBK Live, Viña Rock y FIB en coche compartido con amigos. Ver perfil completo en /autor/equipo-concertride.",
      },
      {
        id: "cuando-se-fundo",
        q: "¿Cuándo se fundó ConcertRide?",
        a: "Abril 2026. Es una plataforma joven pero respaldada por 15 años de experiencia personal del fundador organizando viajes en coche compartido a festivales españoles. La primera versión pública lanzó con catálogo de 16 festivales y crecimiento a 50+ en la primera temporada.",
      },
      {
        id: "donde-esta",
        q: "¿Dónde está la sede de ConcertRide?",
        a: "España. Empresa digital sin oficinas físicas. Servidores en Cloudflare (red global con presencia en Madrid y Barcelona). Atención al cliente exclusivamente en español. Operamos bajo legislación española y RGPD europeo.",
      },
      {
        id: "datos-abiertos",
        q: "¿Publicáis datos abiertos sobre festivales y carpooling?",
        a: "Sí. En /datos publicamos datasets bajo licencia Creative Commons BY 4.0: precios medios de carpooling por ruta (57 festivales 2026), CO₂ ahorrado vs alternativas, mapa de conexión transporte público, costes ocultos. Periodistas y académicos pueden citarlos libremente con atribución.",
      },
      {
        id: "modelo-negocio",
        q: "¿Cómo se sostiene ConcertRide si no cobra comisión?",
        a: "Sin comisiones por viaje y sin publicidad intrusiva. Modelo futuro: partnerships institucionales con festivales que pagan por incluir su transporte oficial (lanzaderas) en el catálogo, datasets premium para empresas (ej. consultoras de sostenibilidad), no monetizamos datos personales de usuarios.",
      },
    ],
  },

  {
    id: "plataforma",
    title: "Sobre la plataforma técnica",
    intro: "App, web, idiomas, accesibilidad y privacidad de datos.",
    items: [
      {
        id: "app-movil",
        q: "¿Hay app móvil de ConcertRide?",
        a: "Sí, en formato PWA (Progressive Web App). Accede desde concertride.me en tu móvil y pulsa 'Añadir a pantalla de inicio' (icono compartir en Safari/Chrome). Funciona offline para ver viajes guardados, recibe notificaciones push y se instala en menos de 5 segundos sin pasar por App Store.",
      },
      {
        id: "navegadores-soportados",
        q: "¿Qué navegadores soportáis?",
        a: "Chrome, Firefox, Safari, Edge — últimas dos versiones de cada uno. Samsung Internet también. No soportamos Internet Explorer (descontinuado por Microsoft en 2022). Para mejor experiencia, navegador actualizado + JavaScript habilitado.",
      },
      {
        id: "idioma",
        q: "¿En qué idiomas está disponible la plataforma?",
        a: "Español de España (es-ES) como idioma principal. Soporte para catalán, gallego y euskera está en roadmap. La interfaz, las páginas SEO y todo el contenido del blog están exclusivamente en castellano. Soporte por email se contesta en español o inglés.",
      },
      {
        id: "accesibilidad-web",
        q: "¿ConcertRide es accesible (WCAG)?",
        a: "Trabajamos para cumplir WCAG 2.2 AA. Características actuales: navegación 100 % por teclado, lectores de pantalla (NVDA/JAWS/VoiceOver), contraste mínimo 4.5:1 en texto, reducción de movimiento honra prefers-reduced-motion, etiquetas ARIA en componentes interactivos. Reporta barreras a help@concertride.me.",
      },
      {
        id: "privacidad-datos",
        q: "¿Qué datos personales guardáis y cómo los protegéis?",
        a: "Mínimos: email, nombre, contraseña (hasheada con PBKDF2-SHA256). Opcionalmente: teléfono, ciudad base, modelo coche, foto carnet (solo para verificación, no pública). Cumplimos RGPD: derecho de acceso, rectificación y eliminación (Mi perfil → Zona peligro). No vendemos datos a terceros nunca.",
      },
    ],
  },
];

const TOTAL_QUESTIONS = CLUSTERS.reduce((sum, c) => sum + c.items.length, 0);

export default function FaqPage() {
  const url = `${SITE_URL}/faq`;

  useSeoMeta({
    title: `Preguntas frecuentes ConcertRide 2026 [${TOTAL_QUESTIONS}+ Q&A] | Carpooling festivales`,
    description:
      "Todas las preguntas sobre carpooling a festivales en España: rutas, precios, seguridad, conductores, marco legal y sostenibilidad. 80+ respuestas.",
    canonical: url,
    keywords:
      "preguntas frecuentes carpooling, cómo compartir coche concierto, alternativa taxi concierto, transporte festival España, ir festival sin coche, compartir gastos concierto, carpooling festival España, coche compartido festival, volver festival madrugada, carpooling sin comisiones, movilidad sostenible festival, ZBE Madrid concierto, furgoneta compartida festival, marco legal carpooling España, seguridad carpooling mujeres",
  });

  // Flatten Q&As for FAQPage JSON-LD (all clusters merged)
  const allFaqs = CLUSTERS.flatMap((c) => c.items);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: "Preguntas frecuentes · Carpooling para conciertos y festivales en España",
    url,
    inLanguage: "es-ES",
    dateModified: "2026-05-19",
    mainEntity: allFaqs.map(({ q, a, id }) => ({
      "@type": "Question",
      "@id": `${url}#faq-${id}`,
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "FAQ", item: url },
    ],
  };

  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "summary", "details p"],
    },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <header className="mb-10 border-b border-cr-border pb-8 space-y-3">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Ayuda · {TOTAL_QUESTIONS}+ preguntas
          </p>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
            Preguntas frecuentes.
          </h1>
          <p className="font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed">
            Todo sobre carpooling para conciertos y festivales en España: cómo funciona,
            precios, seguridad, marco legal, sostenibilidad y datos abiertos. Si no
            encuentras tu pregunta, escribe a{" "}
            <a
              href="mailto:help@concertride.me"
              className="text-cr-primary underline underline-offset-2"
            >
              help@concertride.me
            </a>
            .
          </p>

          {/* Cluster anchor nav for fast scanning + AI crawl */}
          <nav aria-label="Índice de clusters" className="pt-3">
            <ul className="flex flex-wrap gap-x-3 gap-y-2 font-sans text-xs">
              {CLUSTERS.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#cluster-${c.id}`}
                    className="text-cr-text-muted hover:text-cr-primary transition-colors underline-offset-2 hover:underline"
                  >
                    {c.title} ({c.items.length})
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {CLUSTERS.map((cluster) => (
          <section
            key={cluster.id}
            id={`cluster-${cluster.id}`}
            aria-labelledby={`cluster-${cluster.id}-title`}
            className="mb-12 scroll-mt-20"
          >
            <h2
              id={`cluster-${cluster.id}-title`}
              className="font-display text-2xl md:text-3xl uppercase mb-2"
            >
              {cluster.title}
            </h2>
            {cluster.intro && (
              <p className="font-sans text-sm text-cr-text-muted mb-4 leading-relaxed">
                {cluster.intro}
              </p>
            )}

            <div className="divide-y divide-cr-border border-y border-cr-border">
              {cluster.items.map((item) => (
                <details
                  key={item.id}
                  id={`faq-${item.id}`}
                  className="group scroll-mt-24"
                >
                  <summary className="cursor-pointer list-none py-4 flex items-center justify-between gap-4 hover:text-cr-primary transition-colors">
                    <h3 className="font-sans text-sm md:text-base font-semibold text-cr-text flex-1">
                      {item.q}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-cr-text-muted text-lg leading-none transition-transform group-open:rotate-45 select-none"
                    >
                      +
                    </span>
                  </summary>
                  <div className="pb-5">
                    <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-12 pt-8 border-t border-cr-border flex flex-wrap gap-4">
          <Link
            to="/como-funciona"
            className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Cómo funciona →
          </Link>
          <Link
            to="/concerts"
            className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Explorar conciertos →
          </Link>
          <Link
            to="/datos"
            className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Datos abiertos →
          </Link>
          <Link
            to="/contacto"
            className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Contactar →
          </Link>
          <Link
            to="/"
            className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors ml-auto"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

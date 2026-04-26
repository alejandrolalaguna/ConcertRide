/**
 * SEO prerender middleware for Cloudflare Workers.
 *
 * When a search bot (Googlebot, Bingbot, etc.) requests a SPA route, it gets
 * the raw index.html which has no per-page <title>, <meta>, or body content —
 * just the generic homepage values and a loading spinner.
 *
 * This middleware intercepts those requests and returns a fully-rendered HTML
 * document with correct head tags AND static body content (H1, H2, H3, text,
 * JSON-LD) so Google can index the actual content without executing JavaScript.
 *
 * Real users get the untouched SPA shell for best performance (no rewriting).
 */

import type { Context, Next } from "hono";
import type { HonoEnv } from "../types";
import { getSiteUrl } from "./siteUrl";

const SITE_NAME = "ConcertRide ES";

const SEARCH_BOTS =
  /Googlebot|bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|Exabot|facebot|ia_archiver|AhrefsBot|SemrushBot|MJ12bot|DotBot|Applebot|LinkedInBot|Twitterbot|facebookexternalhit|WhatsApp|Slackbot|TelegramBot|Discordbot|OAI-SearchBot|PerplexityBot|anthropic-ai|Google-Extended|GPTBot|ChatGPT-User|CCBot|ClaudeBot/i;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── Static route table ──────────────────────────────────────────────────────
function buildStaticRoutes(base: string): Record<string, { title: string; description: string; canonical: string; h1: string; body: string }> {
  return {
    "/": {
      title: `${SITE_NAME} — Carpooling para conciertos en España`,
      description: "Carpooling para conciertos en España. Comparte coche, divide gastos y llega seguro. Publica un viaje o busca uno en 2 minutos. Gratis, sin comisiones.",
      canonical: `${base}/`,
      h1: "Carpooling para conciertos en España",
      body: `<p>ConcertRide es la plataforma de viaje compartido especializada en conciertos y festivales en España. Conectamos conductores y pasajeros que van al mismo evento. Sin comisiones, conductores verificados, pago directo.</p>
<h2>¿Cómo funciona?</h2>
<ol>
  <li><strong>Busca tu concierto</strong> — encuentra el evento en el que quieres compartir coche.</li>
  <li><strong>Elige o publica un viaje</strong> — reserva una plaza o abre tu coche a otros fans.</li>
  <li><strong>Llega juntos</strong> — pagas en efectivo o Bizum directamente al conductor el día del viaje.</li>
</ol>
<h2>Festivales con viajes compartidos disponibles</h2>
<ul>
  <li><a href="${base}/festivales/mad-cool">Carpooling al Mad Cool Festival Madrid</a></li>
  <li><a href="${base}/festivales/primavera-sound">Carpooling al Primavera Sound Barcelona</a></li>
  <li><a href="${base}/festivales/sonar">Carpooling al Sónar Barcelona</a></li>
  <li><a href="${base}/festivales/fib">Carpooling al FIB Benicàssim</a></li>
  <li><a href="${base}/festivales/bbk-live">Carpooling al BBK Live Bilbao</a></li>
  <li><a href="${base}/festivales/arenal-sound">Carpooling al Arenal Sound</a></li>
</ul>`,
    },
    "/concerts": {
      title: `Conciertos en España 2026 — Carpooling sin comisiones | ${SITE_NAME}`,
      description: "Directorio de conciertos en España con viajes compartidos disponibles. Filtra por ciudad, artista o fecha. Sin comisión. ConcertRide.",
      canonical: `${base}/concerts`,
      h1: "Conciertos en España con carpooling disponible",
      body: `<p>Encuentra todos los conciertos y festivales en España donde puedes compartir coche con otros asistentes. Gratis, sin comisión, conductores verificados.</p>
<h2>Ciudades con más conciertos</h2>
<ul>
  <li><a href="${base}/conciertos/madrid">Conciertos en Madrid</a></li>
  <li><a href="${base}/conciertos/barcelona">Conciertos en Barcelona</a></li>
  <li><a href="${base}/conciertos/valencia">Conciertos en Valencia</a></li>
  <li><a href="${base}/conciertos/sevilla">Conciertos en Sevilla</a></li>
  <li><a href="${base}/conciertos/bilbao">Conciertos en Bilbao</a></li>
</ul>`,
    },
    "/festivales": {
      title: `Carpooling para festivales de música en España 2026 — ${SITE_NAME}`,
      description: "Viajes compartidos a los festivales más grandes de España: Mad Cool, Primavera Sound, Sónar, FIB, BBK Live y más. Sin taxi, sin comisión.",
      canonical: `${base}/festivales`,
      h1: "Festivales de música en España con viaje compartido",
      body: `<p>Encuentra o publica un viaje compartido a los principales festivales de música en España. Sin comisión, conductores verificados, pago directo al conductor.</p>
<h2>Festivales de verano 2026</h2>
<ul>
  <li><a href="${base}/festivales/mad-cool">Mad Cool Festival — Madrid — 9–11 julio 2026</a></li>
  <li><a href="${base}/festivales/primavera-sound">Primavera Sound — Barcelona — 28 mayo–1 junio 2026</a></li>
  <li><a href="${base}/festivales/sonar">Sónar — Barcelona — 18–20 junio 2026</a></li>
  <li><a href="${base}/festivales/fib">FIB Benicàssim — 16–19 julio 2026</a></li>
  <li><a href="${base}/festivales/bbk-live">BBK Live — Bilbao — 9–11 julio 2026</a></li>
  <li><a href="${base}/festivales/arenal-sound">Arenal Sound — Burriana — 29 jul–2 ago 2026</a></li>
  <li><a href="${base}/festivales/medusa-festival">Medusa Festival — Cullera — 12–16 agosto 2026</a></li>
  <li><a href="${base}/festivales/vina-rock">Viña Rock — Villarrobledo — 30 abr–3 mayo 2026</a></li>
  <li><a href="${base}/festivales/resurrection-fest">Resurrection Fest — Viveiro — 25–28 junio 2026</a></li>
  <li><a href="${base}/festivales/o-son-do-camino">O Son do Camiño — Santiago — 18–20 junio 2026</a></li>
  <li><a href="${base}/festivales/sonorama-ribera">Sonorama Ribera — Aranda de Duero — 6–9 agosto 2026</a></li>
  <li><a href="${base}/festivales/cala-mijas">Cala Mijas — Mijas — 2–4 octubre 2026</a></li>
  <li><a href="${base}/festivales/low-festival">Low Festival — Benidorm — 24–26 julio 2026</a></li>
  <li><a href="${base}/festivales/tomavistas">Tomavistas — Madrid — 15–17 mayo 2026</a></li>
  <li><a href="${base}/festivales/cruilla">Cruïlla — Barcelona — 9–12 julio 2026</a></li>
</ul>`,
    },
    "/guia-transporte-festivales": {
      title: `Guía de transporte para festivales de música en España — ${SITE_NAME}`,
      description: "Cómo llegar a los principales festivales de España en coche compartido. Precios, tiempos y consejos para Mad Cool, Primavera Sound, Sónar y más.",
      canonical: `${base}/guia-transporte-festivales`,
      h1: "Guía de transporte para festivales en España",
      body: `<p>Cómo llegar a los principales festivales de música en España: opciones de transporte, precios reales de carpooling, y consejos para no quedarte tirado de madrugada.</p>
<h2>Por qué el carpooling es la mejor opción para festivales</h2>
<p>El transporte público rara vez cubre el horario real de los festivales — el último metro sale antes de que acabe el cabeza de cartel. Un taxi de madrugada puede costar 30–90 € por trayecto. El carpooling con ConcertRide sale por 4–20 € dependiendo de la distancia, y el conductor también va al festival.</p>
<h2>Festivales por ciudad</h2>
<ul>
  <li><a href="${base}/festivales/mad-cool">Cómo ir al Mad Cool en coche compartido — Madrid</a></li>
  <li><a href="${base}/festivales/primavera-sound">Cómo ir al Primavera Sound en coche compartido — Barcelona</a></li>
  <li><a href="${base}/festivales/sonar">Cómo ir al Sónar en coche compartido — Barcelona</a></li>
  <li><a href="${base}/festivales/bbk-live">Cómo ir al BBK Live en coche compartido — Bilbao</a></li>
</ul>`,
    },
    "/como-funciona": {
      title: `Cómo funciona el carpooling para conciertos — ${SITE_NAME}`,
      description: "Publica o reserva un viaje compartido a un concierto en 2 minutos. Sin comisión, conductores verificados, pago directo al conductor.",
      canonical: `${base}/como-funciona`,
      h1: "Cómo funciona el carpooling para conciertos",
      body: `<p>ConcertRide conecta conductores y pasajeros que van al mismo concierto o festival. El proceso es simple, gratis y sin comisiones.</p>
<h2>Para pasajeros</h2>
<ol>
  <li>Busca tu concierto en ConcertRide.</li>
  <li>Elige un viaje por precio, hora de salida y perfil del conductor.</li>
  <li>Solicita tu plaza. Con reserva instantánea se confirma al momento.</li>
  <li>El día del evento, te reúnes con el conductor y pagas en efectivo o Bizum.</li>
</ol>
<h2>Para conductores</h2>
<ol>
  <li>Crea una cuenta y verifica tu carnet de conducir.</li>
  <li>Publica un viaje: elige el concierto, el punto de salida, las plazas y el precio.</li>
  <li>Acepta solicitudes (o activa reserva instantánea para confirmación automática).</li>
  <li>Cobra directamente a los pasajeros el día del viaje. ConcertRide no cobra comisión.</li>
</ol>
<h2>Preguntas frecuentes</h2>
<dl>
  <dt>¿Es legal el carpooling sin licencia VTC?</dt>
  <dd>Sí. Operar bajo la figura de gastos compartidos sin beneficio económico está reconocido por el Tribunal Supremo español (sentencia 2017, caso BlaBlaCar).</dd>
  <dt>¿ConcertRide cobra comisión?</dt>
  <dd>No. Registrarse, buscar y publicar viajes es completamente gratuito. El 100 % del precio del asiento va al conductor.</dd>
</dl>`,
    },
    "/faq": {
      title: `Preguntas frecuentes sobre carpooling a conciertos — ${SITE_NAME}`,
      description: "Respuestas a las preguntas más frecuentes sobre ConcertRide: seguridad, pagos, cancelaciones y más.",
      canonical: `${base}/faq`,
      h1: "Preguntas frecuentes — ConcertRide",
      body: `<dl>
  <dt>¿Es seguro compartir coche con desconocidos para ir a un concierto?</dt>
  <dd>Todos los conductores verifican su carnet de conducir antes de publicar. Puedes ver las valoraciones de otros pasajeros antes de reservar.</dd>
  <dt>¿Cómo se paga en ConcertRide?</dt>
  <dd>El pago es en efectivo o Bizum directamente al conductor el día del viaje. ConcertRide no gestiona pagos ni cobra comisión.</dd>
  <dt>¿Qué pasa si el conductor cancela?</dt>
  <dd>El conductor avisa por el chat de la plataforma. Puedes buscar otro viaje o publicar tú mismo una solicitud.</dd>
  <dt>¿Puedo reservar la vuelta también?</dt>
  <dd>Sí. Muchos conductores publican el viaje de ida y vuelta juntos. Filtra por "con regreso incluido" al buscar.</dd>
</dl>`,
    },
    "/publish": {
      title: `Publicar un viaje a un concierto — ${SITE_NAME}`,
      description: "Abre tu coche a un concierto o festival y comparte gastos con otros fans. Publica gratis en 2 minutos.",
      canonical: `${base}/publish`,
      h1: "Publica un viaje a un concierto — gratis, sin comisión",
      body: `<p>¿Vas a un concierto o festival en coche? Ofrece plazas a otros fans, divide el coste del combustible y llega acompañado. Publicar es gratis y sin comisión.</p>
<h2>Cómo publicar en 3 pasos</h2>
<ol>
  <li>Crea una cuenta y verifica tu carnet.</li>
  <li>Elige el concierto, indica hora de salida, plazas disponibles y precio por asiento.</li>
  <li>Espera solicitudes o activa reserva instantánea para confirmar automáticamente.</li>
</ol>`,
    },
    "/acerca-de": {
      title: `Acerca de ConcertRide — Carpooling para la cultura en España`,
      description: "ConcertRide es la plataforma española de carpooling para conciertos y festivales. Sin comisiones, sin intermediarios, conductores verificados.",
      canonical: `${base}/acerca-de`,
      h1: "Acerca de ConcertRide",
      body: `<p>ConcertRide es la plataforma española de viaje compartido exclusiva para conciertos y festivales. Fundada en 2026, conecta conductores y pasajeros que van al mismo evento para compartir gastos de desplazamiento. Sin comisiones, sin intermediarios.</p>
<h2>Nuestra misión</h2>
<p>Que nadie se quede sin ir a un concierto por falta de transporte o por no poder pagar un taxi. Y que el 80 % de las emisiones de carbono que genera el transporte de asistentes a festivales empiece a reducirse.</p>`,
    },
    "/contacto": {
      title: `Contacto — ${SITE_NAME}`,
      description: "Ponte en contacto con el equipo de ConcertRide.",
      canonical: `${base}/contacto`,
      h1: "Contacto",
      body: `<p>¿Tienes alguna pregunta o sugerencia? Escríbenos y te responderemos lo antes posible.</p>`,
    },
    "/blog": {
      title: `Blog — Carpooling a conciertos y festivales en España | ${SITE_NAME}`,
      description: "Artículos, guías y comparativas sobre carpooling para conciertos y festivales en España. ConcertRide.",
      canonical: `${base}/blog`,
      h1: "Blog de ConcertRide — Carpooling para conciertos",
      body: `<p>Guías, comparativas y consejos para ir a conciertos y festivales en coche compartido.</p>
<h2>Últimos artículos</h2>
<ul>
  <li><a href="${base}/blog/blablacar-vs-concertride">BlaBlaCar vs ConcertRide 2026: ¿qué app te conviene para festivales?</a></li>
  <li><a href="${base}/blog/como-volver-festival-madrugada">Cómo volver de un festival de madrugada (sin taxi a 90 €)</a></li>
  <li><a href="${base}/blog/huella-carbono-festivales-carpooling">Huella de carbono de un festival: por qué el carpooling es la acción más efectiva</a></li>
</ul>`,
    },
    "/prensa": {
      title: `Prensa — ${SITE_NAME}`,
      description: "Sala de prensa de ConcertRide. Contacto para medios, notas de prensa y recursos gráficos.",
      canonical: `${base}/prensa`,
      h1: "Sala de prensa — ConcertRide",
      body: `<p>ConcertRide es la plataforma española de carpooling exclusiva para conciertos y festivales. Para peticiones de prensa, contacta con nosotros.</p>`,
    },
    "/aviso-legal": {
      title: `Aviso Legal — ${SITE_NAME}`,
      description: "Aviso legal de ConcertRide ES. Información sobre el titular, condiciones de uso y responsabilidad.",
      canonical: `${base}/aviso-legal`,
      h1: "Aviso Legal",
      body: `<p>Información legal sobre ConcertRide ES y las condiciones de uso de la plataforma.</p>`,
    },
    "/privacidad": {
      title: `Política de Privacidad — ${SITE_NAME}`,
      description: "Política de privacidad de ConcertRide ES. Cómo recogemos, usamos y protegemos tus datos personales.",
      canonical: `${base}/privacidad`,
      h1: "Política de Privacidad",
      body: `<p>Información sobre el tratamiento de datos personales en ConcertRide ES según el RGPD y la LOPDGDD.</p>`,
    },
    "/cookies": {
      title: `Política de Cookies — ${SITE_NAME}`,
      description: "Política de cookies de ConcertRide ES. Qué cookies usamos y cómo puedes gestionarlas.",
      canonical: `${base}/cookies`,
      h1: "Política de Cookies",
      body: `<p>Información sobre el uso de cookies en ConcertRide ES y cómo puedes configurar tus preferencias.</p>`,
    },
    "/terminos": {
      title: `Términos y Condiciones — ${SITE_NAME}`,
      description: "Términos y condiciones de uso de ConcertRide ES. Reglas para conductores y pasajeros.",
      canonical: `${base}/terminos`,
      h1: "Términos y Condiciones de Uso",
      body: `<p>Condiciones que rigen el uso de ConcertRide ES por parte de conductores y pasajeros.</p>`,
    },
    "/rutas": {
      title: `Rutas de carpooling a festivales en España | ${SITE_NAME}`,
      description: "Todas las rutas de coche compartido disponibles para festivales en España. Busca tu trayecto por ciudad de origen y festival de destino.",
      canonical: `${base}/rutas`,
      h1: "Rutas de carpooling a festivales en España",
      body: `<p>Busca viajes compartidos de tu ciudad al festival. Rutas disponibles desde Madrid, Barcelona, Valencia, Sevilla, Bilbao y más ciudades a todos los grandes festivales de España.</p>
<h2>Rutas más populares</h2>
<ul>
  <li><a href="${base}/rutas/madrid-mad-cool">Carpooling Madrid → Mad Cool Festival</a></li>
  <li><a href="${base}/rutas/madrid-primavera-sound">Carpooling Madrid → Primavera Sound Barcelona</a></li>
  <li><a href="${base}/rutas/barcelona-primavera-sound">Carpooling Barcelona → Primavera Sound</a></li>
  <li><a href="${base}/rutas/valencia-primavera-sound">Carpooling Valencia → Primavera Sound Barcelona</a></li>
  <li><a href="${base}/rutas/madrid-sonar">Carpooling Madrid → Sónar Barcelona</a></li>
  <li><a href="${base}/rutas/madrid-bbk-live">Carpooling Madrid → BBK Live Bilbao</a></li>
  <li><a href="${base}/rutas/madrid-arenal-sound">Carpooling Madrid → Arenal Sound</a></li>
  <li><a href="${base}/rutas/valencia-arenal-sound">Carpooling Valencia → Arenal Sound</a></li>
</ul>`,
    },
  };
}

// ── Festival data ───────────────────────────────────────────────────────────
interface FestivalData {
  name: string;
  shortName: string;
  city: string;
  venue: string;
  venueAddress: string;
  dates: string;
  startDate: string;
  endDate: string;
  priceFrom: string;
  blurb: string;
  originCities: { city: string; km: number; drivingTime: string; range: string }[];
  faqs: { q: string; a: string }[];
}

const FESTIVALS: Record<string, FestivalData> = {
  "mad-cool": {
    name: "Mad Cool Festival",
    shortName: "Mad Cool",
    city: "Madrid",
    venue: "IFEMA Madrid",
    venueAddress: "Av. del Partenón, 5, 28042 Madrid",
    dates: "9–11 julio 2026",
    startDate: "2026-07-09",
    endDate: "2026-07-11",
    priceFrom: "4",
    blurb: "Mad Cool es el festival de rock e indie alternativo más grande de Madrid, celebrado en IFEMA desde 2016. Convoca a 80.000 asistentes diarios. El recinto queda a 15 km del centro pero el transporte nocturno es limitado: el metro cierra a la 1:30 y los taxis cuestan 60–90 €. ConcertRide es la alternativa preferida de quienes vienen desde otras provincias.",
    originCities: [
      { city: "Centro de Madrid", km: 15, drivingTime: "25 min", range: "4–7 €/asiento" },
      { city: "Toledo", km: 75, drivingTime: "55 min", range: "4–7 €/asiento" },
      { city: "Guadalajara", km: 60, drivingTime: "50 min", range: "3–6 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 20 min", range: "10–14 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", range: "9–13 €/asiento" },
      { city: "Barcelona", km: 620, drivingTime: "5h 30 min", range: "15–20 €/asiento" },
    ],
    faqs: [
      { q: "¿Cuánto cuesta compartir coche al Mad Cool?", a: "Los precios los fijan los conductores, normalmente entre 4 y 7 € desde Madrid centro, y hasta 20 € desde Barcelona o Bilbao." },
      { q: "¿Cómo llegar a Mad Cool desde el centro de Madrid?", a: "En metro (línea 8 hasta 'Feria de Madrid', ~25 min) o en coche compartido con ConcertRide (4–7 € desde Madrid centro). El metro se satura a la salida; el carpooling te evita las colas." },
      { q: "¿Hay transporte nocturno de vuelta de Mad Cool?", a: "El metro cierra sobre la 1:30 (se amplía en noches de festival hasta las 2:00–2:30). Los taxis cuestan 60–90 €. Con ConcertRide puedes reservar la vuelta desde 4–7 € desde Madrid." },
      { q: "¿Cuándo se celebra Mad Cool 2026?", a: "La edición 2026 de Mad Cool Festival está prevista para el 9, 10 y 11 de julio en IFEMA Madrid." },
    ],
  },
  "primavera-sound": {
    name: "Primavera Sound Barcelona",
    shortName: "Primavera Sound",
    city: "Barcelona",
    venue: "Parc del Fòrum",
    venueAddress: "Rambla del Prim, 2-4, 08019 Barcelona",
    dates: "28 mayo–1 junio 2026",
    startDate: "2026-05-28",
    endDate: "2026-06-01",
    priceFrom: "5",
    blurb: "Primavera Sound es el festival de indie y alternativo más influyente de Europa, celebrado en el Parc del Fòrum de Barcelona. Atrae asistentes de toda España y más de 80 países. El metro L4 llega al Fòrum pero se colapsa en las salidas de madrugada. Los asientos de AVE desde Madrid se agotan semanas antes.",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", range: "15–20 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", range: "10–14 €/asiento" },
      { city: "Zaragoza", km: 306, drivingTime: "2h 45 min", range: "8–12 €/asiento" },
      { city: "Bilbao", km: 615, drivingTime: "5h", range: "15–20 €/asiento" },
      { city: "Lleida", km: 170, drivingTime: "1h 45 min", range: "5–8 €/asiento" },
      { city: "Tarragona", km: 100, drivingTime: "1h", range: "4–7 €/asiento" },
    ],
    faqs: [
      { q: "¿Cuánto cuesta un viaje compartido al Primavera Sound desde Madrid?", a: "Normalmente entre 15 y 20 € por trayecto desde Madrid, según el conductor. Desde Valencia, entre 10 y 14 €." },
      { q: "¿Puedo encontrar viaje de vuelta también?", a: "Sí, puedes buscar viajes de vuelta desde Barcelona al terminar el festival. Muchos conductores publican el viaje redondo." },
      { q: "¿Con cuánta antelación debo reservar?", a: "Recomendamos reservar con al menos 2 semanas de antelación, especialmente para trayectos largos como Madrid–Barcelona." },
      { q: "¿ConcertRide cobra comisión?", a: "No. ConcertRide es completamente gratuito, sin comisiones para conductores ni pasajeros." },
    ],
  },
  "sonar": {
    name: "Sónar Festival",
    shortName: "Sónar",
    city: "Barcelona",
    venue: "Fira de Barcelona",
    venueAddress: "Av. Reina Maria Cristina, s/n, 08004 Barcelona",
    dates: "18–20 junio 2026",
    startDate: "2026-06-18",
    endDate: "2026-06-20",
    priceFrom: "5",
    blurb: "Sónar es el festival de referencia de música avanzada y tecnología creativa, con dos sedes: Sónar de Día en Fira Montjuïc y Sónar de Noche en Fira Gran Via (L'Hospitalet). El transporte entre sedes y el acceso nocturno hacen del coche compartido la opción más práctica.",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", range: "15–20 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 30 min", range: "10–14 €/asiento" },
      { city: "Zaragoza", km: 306, drivingTime: "2h 45 min", range: "8–12 €/asiento" },
      { city: "Lleida", km: 170, drivingTime: "1h 45 min", range: "5–8 €/asiento" },
    ],
    faqs: [
      { q: "¿Qué es Sónar de Día y Sónar de Noche?", a: "Sónar de Día se celebra en Fira Montjuïc (Barcelona centro) y acaba sobre las 22h. Sónar de Noche es en Fira Gran Via (L'Hospitalet) y va hasta las 6am. Con ConcertRide puedes coordinar el transporte para ambas sedes." },
      { q: "¿Cuánto cuesta ir al Sónar desde Madrid en coche compartido?", a: "Normalmente entre 15 y 20 € por trayecto desde Madrid, según el conductor." },
      { q: "¿Hay parking en Fira Gran Via para Sónar de Noche?", a: "Sí, pero se llena. Lo más habitual es llegar en metro (L1 hasta España o L9 hasta Europa/Fira) o en coche compartido y aparcar en los alrededores." },
    ],
  },
  "fib": {
    name: "FIB Benicàssim",
    shortName: "FIB",
    city: "Benicàssim",
    venue: "Recinte Festivaler",
    venueAddress: "Av. de Ferrandis Salvador, Benicàssim, Castellón",
    dates: "16–19 julio 2026",
    startDate: "2026-07-16",
    endDate: "2026-07-19",
    priceFrom: "6",
    blurb: "El FIB (Festival Internacional de Benicàssim) es uno de los festivales con más historia de España. Combina música indie y alternativa con el entorno mediterráneo de Benicàssim. El recinto queda lejos de las estaciones de tren, por lo que el coche compartido es la forma más cómoda de llegar.",
    originCities: [
      { city: "Madrid", km: 390, drivingTime: "3h 45 min", range: "10–14 €/asiento" },
      { city: "Barcelona", km: 230, drivingTime: "2h 15 min", range: "7–10 €/asiento" },
      { city: "Valencia", km: 75, drivingTime: "1h", range: "4–6 €/asiento" },
      { city: "Zaragoza", km: 270, drivingTime: "2h 30 min", range: "8–11 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar al FIB desde Valencia?", a: "Desde Valencia son unos 75 km (1h en coche). Con ConcertRide, el precio típico es 4–6 €/asiento. También hay autobuses directos desde Valencia capital." },
      { q: "¿Cuánto cuesta ir al FIB desde Madrid en coche compartido?", a: "Aproximadamente 390 km (3h 45 min). El precio por asiento en ConcertRide suele ser 10–14 €." },
    ],
  },
  "bbk-live": {
    name: "Bilbao BBK Live",
    shortName: "BBK Live",
    city: "Bilbao",
    venue: "Kobetamendi",
    venueAddress: "Kobetamendi, 48006 Bilbao",
    dates: "9–11 julio 2026",
    startDate: "2026-07-09",
    endDate: "2026-07-11",
    priceFrom: "5",
    blurb: "BBK Live se celebra en lo alto del monte Kobetamendi, con vistas a Bilbao. El acceso es por lanzaderas oficiales desde el centro, pero en horarios tardíos son insuficientes. El coche compartido es la mejor alternativa para quien viene de fuera del País Vasco.",
    originCities: [
      { city: "Madrid", km: 395, drivingTime: "4h", range: "12–16 €/asiento" },
      { city: "Barcelona", km: 615, drivingTime: "5h 30 min", range: "15–20 €/asiento" },
      { city: "Donostia", km: 100, drivingTime: "1h", range: "4–7 €/asiento" },
      { city: "Vitoria", km: 65, drivingTime: "50 min", range: "3–6 €/asiento" },
      { city: "Pamplona", km: 80, drivingTime: "1h", range: "4–7 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar al BBK Live desde el centro de Bilbao?", a: "Hay lanzaderas oficiales desde la Plaza Moyúa. También puedes ir en coche compartido con ConcertRide (4–7 € desde el centro)." },
      { q: "¿Cuánto cuesta ir al BBK Live desde Madrid?", a: "Unos 395 km (4h). El precio por asiento en ConcertRide es normalmente 12–16 €." },
    ],
  },
  "resurrection-fest": {
    name: "Resurrection Fest",
    shortName: "Resurrection Fest",
    city: "Viveiro",
    venue: "Recinto de Viveiro",
    venueAddress: "O Galo, 27850 Viveiro, Lugo",
    dates: "25–28 junio 2026",
    startDate: "2026-06-25",
    endDate: "2026-06-28",
    priceFrom: "8",
    blurb: "El Resurrection Fest es el mayor festival de metal de España, celebrado en Viveiro (Lugo). La ubicación remota hace que el coche compartido sea prácticamente la única opción viable para llegar desde las grandes ciudades.",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "6h", range: "16–22 €/asiento" },
      { city: "Santiago de Compostela", km: 115, drivingTime: "1h 15 min", range: "4–7 €/asiento" },
      { city: "A Coruña", km: 140, drivingTime: "1h 30 min", range: "5–8 €/asiento" },
      { city: "Oviedo", km: 130, drivingTime: "1h 30 min", range: "5–8 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Resurrection Fest desde Madrid?", a: "Son unos 620 km (6h en coche). Con ConcertRide el precio por asiento es 16–22 €. Muchos grupos organizan el viaje en van desde Madrid." },
      { q: "¿Hay transporte público al Resurrection Fest?", a: "El transporte público es muy limitado hasta Viveiro. El coche compartido es prácticamente la única opción para venir de fuera de Galicia." },
    ],
  },
  "arenal-sound": {
    name: "Arenal Sound",
    shortName: "Arenal Sound",
    city: "Burriana",
    venue: "Playa del Arenal",
    venueAddress: "Playa del Arenal, 12530 Burriana, Castellón",
    dates: "29 jul–2 ago 2026",
    startDate: "2026-07-29",
    endDate: "2026-08-02",
    priceFrom: "4",
    blurb: "Arenal Sound es el festival de pop-rock y electrónica de la costa valenciana, en la playa de Burriana. Cerca de Valencia y con gran afluencia desde toda España.",
    originCities: [
      { city: "Valencia", km: 65, drivingTime: "45 min", range: "4–6 €/asiento" },
      { city: "Madrid", km: 360, drivingTime: "3h 30 min", range: "10–14 €/asiento" },
      { city: "Barcelona", km: 190, drivingTime: "2h", range: "7–10 €/asiento" },
      { city: "Zaragoza", km: 270, drivingTime: "2h 30 min", range: "8–11 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Arenal Sound desde Valencia?", a: "Solo 65 km (45 min en coche). Con ConcertRide, el precio es 4–6 € por asiento." },
      { q: "¿Hay camping en el Arenal Sound?", a: "Sí, el festival tiene zona de camping. ConcertRide es ideal para llegar con la carpa y el equipo sin depender del transporte público." },
    ],
  },
  "medusa-festival": {
    name: "Medusa Festival",
    shortName: "Medusa",
    city: "Cullera",
    venue: "Playa de Cullera",
    venueAddress: "Playa de Cullera, 46400 Cullera, Valencia",
    dates: "12–16 agosto 2026",
    startDate: "2026-08-12",
    endDate: "2026-08-16",
    priceFrom: "5",
    blurb: "Medusa Festival es el mayor festival de música electrónica de España, con más de 300.000 asistentes en la playa de Cullera. El acceso en transporte público es muy limitado; el coche compartido es la opción dominante.",
    originCities: [
      { city: "Valencia", km: 40, drivingTime: "40 min", range: "3–5 €/asiento" },
      { city: "Madrid", km: 360, drivingTime: "3h 30 min", range: "10–14 €/asiento" },
      { city: "Barcelona", km: 370, drivingTime: "3h 40 min", range: "10–14 €/asiento" },
      { city: "Alicante", km: 130, drivingTime: "1h 20 min", range: "5–8 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Medusa Festival desde Valencia?", a: "Solo 40 km (40 min). Con ConcertRide, el precio es 3–5 €/asiento desde Valencia." },
      { q: "¿Hay parking en el Medusa Festival?", a: "Hay parking oficial de pago. Sin embargo, el acceso por carretera se colapsa. El coche compartido reduce la presión sobre el parking." },
    ],
  },
  "vina-rock": {
    name: "Viña Rock",
    shortName: "Viña Rock",
    city: "Villarrobledo",
    venue: "Recinto Viña Rock",
    venueAddress: "Ctra. de las Minas, s/n, 02600 Villarrobledo, Albacete",
    dates: "30 abr–3 mayo 2026",
    startDate: "2026-04-30",
    endDate: "2026-05-03",
    priceFrom: "5",
    blurb: "Viña Rock es el festival de referencia del rock en castellano, celebrado en Villarrobledo (Albacete). Punto de encuentro para fans de toda España.",
    originCities: [
      { city: "Madrid", km: 180, drivingTime: "1h 50 min", range: "6–9 €/asiento" },
      { city: "Valencia", km: 200, drivingTime: "2h", range: "6–9 €/asiento" },
      { city: "Murcia", km: 140, drivingTime: "1h 30 min", range: "5–8 €/asiento" },
      { city: "Albacete", km: 50, drivingTime: "40 min", range: "3–5 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Viña Rock desde Madrid?", a: "Unos 180 km (1h 50 min). Con ConcertRide, el precio es 6–9 €/asiento desde Madrid." },
    ],
  },
  "o-son-do-camino": {
    name: "O Son do Camiño",
    shortName: "O Son do Camiño",
    city: "Santiago de Compostela",
    venue: "Monte do Gozo",
    venueAddress: "Monte do Gozo, 15820 Santiago de Compostela",
    dates: "18–20 junio 2026",
    startDate: "2026-06-18",
    endDate: "2026-06-20",
    priceFrom: "8",
    blurb: "O Son do Camiño es el festival gallego con mayor aforo (90.000+ personas), celebrado en Monte do Gozo a las afueras de Santiago de Compostela. ConcertRide es especialmente útil para gallegos que viven en zonas sin transporte directo al recinto.",
    originCities: [
      { city: "A Coruña", km: 75, drivingTime: "50 min", range: "4–7 €/asiento" },
      { city: "Vigo", km: 95, drivingTime: "1h 10 min", range: "4–7 €/asiento" },
      { city: "Lugo", km: 105, drivingTime: "1h 15 min", range: "4–7 €/asiento" },
      { city: "Madrid", km: 620, drivingTime: "6h", range: "16–22 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar a O Son do Camiño desde A Coruña?", a: "Unos 75 km (50 min). Con ConcertRide el precio es 4–7 €/asiento." },
    ],
  },
  "cala-mijas": {
    name: "Cala Mijas Fest",
    shortName: "Cala Mijas",
    city: "Mijas",
    venue: "Cala Mijas",
    venueAddress: "Recinto Cala Mijas, 29650 Mijas, Málaga",
    dates: "2–4 octubre 2026",
    startDate: "2026-10-02",
    endDate: "2026-10-04",
    priceFrom: "5",
    blurb: "Cala Mijas es el festival indie y pop de otoño en la Costa del Sol, con artistas internacionales y un entorno único en la serranía malagueña.",
    originCities: [
      { city: "Málaga", km: 30, drivingTime: "35 min", range: "3–5 €/asiento" },
      { city: "Sevilla", km: 210, drivingTime: "2h 15 min", range: "7–10 €/asiento" },
      { city: "Madrid", km: 540, drivingTime: "5h 15 min", range: "14–18 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar a Cala Mijas desde Málaga?", a: "Son unos 30 km (35 min). Con ConcertRide el precio es 3–5 €/asiento desde Málaga." },
    ],
  },
  "sonorama-ribera": {
    name: "Sonorama Ribera",
    shortName: "Sonorama",
    city: "Aranda de Duero",
    venue: "El Ferial",
    venueAddress: "El Ferial, 09400 Aranda de Duero, Burgos",
    dates: "6–9 agosto 2026",
    startDate: "2026-08-06",
    endDate: "2026-08-09",
    priceFrom: "6",
    blurb: "Sonorama Ribera es el festival de indie y alternativo de la Ribera del Duero, integrado en la ciudad de Aranda. Conocido por su ambiente de barrio y su alta calidad musical.",
    originCities: [
      { city: "Madrid", km: 160, drivingTime: "1h 40 min", range: "6–9 €/asiento" },
      { city: "Valladolid", km: 100, drivingTime: "1h", range: "4–7 €/asiento" },
      { city: "Barcelona", km: 550, drivingTime: "5h", range: "14–18 €/asiento" },
      { city: "Burgos", km: 85, drivingTime: "55 min", range: "4–6 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Sonorama desde Madrid?", a: "Unos 160 km (1h 40 min). Con ConcertRide el precio es 6–9 €/asiento." },
    ],
  },
  "zevra-festival": {
    name: "Zevra Festival",
    shortName: "Zevra",
    city: "Valencia",
    venue: "La Marina de Valencia",
    venueAddress: "Marina de Valencia, 46024 Valencia",
    dates: "Verano 2026",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    priceFrom: "4",
    blurb: "Zevra Festival es el nuevo festival urbano de Valencia, en el espacio de La Marina. Combina música electrónica, pop y urbano con la gastronomía y el entorno del puerto.",
    originCities: [
      { city: "Madrid", km: 355, drivingTime: "3h 20 min", range: "10–14 €/asiento" },
      { city: "Barcelona", km: 355, drivingTime: "3h 30 min", range: "10–14 €/asiento" },
      { city: "Alicante", km: 165, drivingTime: "1h 45 min", range: "5–8 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Zevra Festival desde Madrid?", a: "Unos 355 km (3h 20 min). Con ConcertRide el precio es 10–14 €/asiento." },
    ],
  },
  "low-festival": {
    name: "Low Festival",
    shortName: "Low Festival",
    city: "Benidorm",
    venue: "Benidorm Beach",
    venueAddress: "Playa de Poniente, 03502 Benidorm, Alicante",
    dates: "24–26 julio 2026",
    startDate: "2026-07-24",
    endDate: "2026-07-26",
    priceFrom: "5",
    blurb: "Low Festival es el festival de pop-rock e indie en la playa de Benidorm. Aprovecha el entorno único de la Costa Blanca con una programación de alta calidad.",
    originCities: [
      { city: "Valencia", km: 145, drivingTime: "1h 30 min", range: "5–8 €/asiento" },
      { city: "Madrid", km: 440, drivingTime: "4h 15 min", range: "12–16 €/asiento" },
      { city: "Murcia", km: 80, drivingTime: "1h", range: "4–6 €/asiento" },
      { city: "Alicante", km: 50, drivingTime: "40 min", range: "3–5 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Low Festival desde Valencia?", a: "Unos 145 km (1h 30 min). Con ConcertRide el precio es 5–8 €/asiento." },
    ],
  },
  "tomavistas": {
    name: "Tomavistas",
    shortName: "Tomavistas",
    city: "Madrid",
    venue: "IFEMA",
    venueAddress: "IFEMA, 28042 Madrid",
    dates: "15–17 mayo 2026",
    startDate: "2026-05-15",
    endDate: "2026-05-17",
    priceFrom: "4",
    blurb: "Tomavistas es el festival de indie y alternativo de Madrid, con una programación selecta en IFEMA. Muy popular entre el público madrileño y de provincias cercanas.",
    originCities: [
      { city: "Toledo", km: 75, drivingTime: "55 min", range: "4–7 €/asiento" },
      { city: "Guadalajara", km: 60, drivingTime: "50 min", range: "3–6 €/asiento" },
      { city: "Segovia", km: 90, drivingTime: "1h 10 min", range: "4–7 €/asiento" },
    ],
    faqs: [
      { q: "¿Cuándo se celebra Tomavistas 2026?", a: "La edición 2026 está prevista para el 15, 16 y 17 de mayo en IFEMA Madrid." },
    ],
  },
  "cruilla": {
    name: "Cruïlla Barcelona",
    shortName: "Cruïlla",
    city: "Barcelona",
    venue: "Parc del Fòrum",
    venueAddress: "Rambla del Prim, 2-4, 08019 Barcelona",
    dates: "9–12 julio 2026",
    startDate: "2026-07-09",
    endDate: "2026-07-12",
    priceFrom: "5",
    blurb: "Cruïlla es el festival multicultural de Barcelona, con música de todos los géneros y un ambiente familiar único en el Parc del Fòrum.",
    originCities: [
      { city: "Madrid", km: 620, drivingTime: "5h 30 min", range: "15–20 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 30 min", range: "10–14 €/asiento" },
      { city: "Zaragoza", km: 306, drivingTime: "2h 45 min", range: "8–12 €/asiento" },
      { city: "Tarragona", km: 100, drivingTime: "1h", range: "4–7 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Cruïlla desde Madrid?", a: "Unos 620 km (5h 30 min). Con ConcertRide el precio es 15–20 €/asiento." },
    ],
  },
};

// ── City data ───────────────────────────────────────────────────────────────
interface CityData {
  name: string;
  region: string;
  blurb: string;
  venues: string[];
}

const CITIES: Record<string, CityData> = {
  madrid: { name: "Madrid", region: "Comunidad de Madrid", blurb: "Madrid concentra la mayor parte de la actividad de conciertos y festivales de España. WiZink Center, Palacio Vistalegre, Caja Mágica e IFEMA (sede de Mad Cool) acogen cada año giras internacionales y festivales de referencia.", venues: ["WiZink Center", "Palacio Vistalegre", "Caja Mágica", "IFEMA (Mad Cool Festival)"] },
  barcelona: { name: "Barcelona", region: "Cataluña", blurb: "Barcelona es la capital europea de los festivales de música electrónica e indie. Palau Sant Jordi, Parc del Fòrum (Primavera Sound, Cruïlla) y Fira Montjuïc (Sónar) son los tres epicentros.", venues: ["Palau Sant Jordi", "Parc del Fòrum (Primavera Sound / Cruïlla)", "Fira Montjuïc (Sónar)"] },
  valencia: { name: "Valencia", region: "Comunidad Valenciana", blurb: "Valencia ciudad acoge Zevra Festival y conciertos urbanos frecuentes. Su provincia concentra Arenal Sound en Burriana, Medusa en Cullera y FIB en Benicàssim.", venues: ["Zevra Festival (La Marina)", "Arenal Sound (Burriana)", "Medusa Festival (Cullera)"] },
  sevilla: { name: "Sevilla", region: "Andalucía", blurb: "Sevilla es el centro musical de Andalucía occidental. Estadio La Cartuja, FIBES e Interestelar Sevilla son los escenarios principales.", venues: ["Estadio La Cartuja", "FIBES Sevilla", "Interestelar Sevilla"] },
  bilbao: { name: "Bilbao", region: "País Vasco", blurb: "Bilbao es referencia para festivales internacionales del norte: BBK Live en Kobetamendi y Bilbao Arena para tours indoor.", venues: ["Kobetamendi (BBK Live)", "Bilbao Arena"] },
  malaga: { name: "Málaga", region: "Andalucía", blurb: "Málaga concentra los festivales más solares de España: Cala Mijas en Mijas, Andalucía Big y Marenostrum en Fuengirola.", venues: ["Cala Mijas Fest", "Andalucía Big Festival", "Marenostrum Music Castle"] },
  zaragoza: { name: "Zaragoza", region: "Aragón", blurb: "Zaragoza es nodo estratégico equidistante entre Madrid y Barcelona, y origen natural para viajes a Primavera Sound, Mad Cool y Pirineos Sur.", venues: ["Pabellón Príncipe Felipe", "Pirineos Sur (Lanuza)"] },
  granada: { name: "Granada", region: "Andalucía", blurb: "Granada acoge Granada Sound en septiembre y es origen frecuente para viajes a festivales andaluces del verano.", venues: ["Granada Sound (Cortijo del Conde)"] },
  donostia: { name: "Donostia / San Sebastián", region: "País Vasco", blurb: "Donostia destaca por Heineken Jazzaldia en julio y una agenda indie densa en salas pequeñas.", venues: ["Plaza de la Trinidad", "Kursaal", "Heineken Jazzaldia"] },
  "santiago-de-compostela": { name: "Santiago de Compostela", region: "Galicia", blurb: "Santiago acoge O Son do Camiño en Monte do Gozo cada junio, uno de los festivales con mayor aforo de España.", venues: ["Monte do Gozo (O Son do Camiño)"] },
};

// ── Blog post data ──────────────────────────────────────────────────────────
interface BlogData {
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  h1: string;
  intro: string;
}

const BLOG_POSTS: Record<string, BlogData> = {
  "blablacar-vs-concertride": {
    title: "BlaBlaCar vs ConcertRide 2026: ¿qué app de carpooling te conviene para festivales?",
    excerpt: "Comparativa real entre BlaBlaCar y ConcertRide para llegar a festivales: comisiones, tiempos de espera, perfil de usuario, política de cancelación y precio por asiento.",
    author: "Equipo ConcertRide",
    publishedAt: "2026-04-25",
    h1: "BlaBlaCar vs ConcertRide: comparativa para ir a conciertos en España",
    intro: "Si vas a un festival este verano y dudas entre BlaBlaCar y ConcertRide, esta comparativa va al grano. La diferencia principal: ConcertRide no cobra comisión (el 100% va al conductor) y cada viaje está vinculado a un concierto concreto.",
  },
  "como-volver-festival-madrugada": {
    title: "Cómo volver de un festival de madrugada (sin taxi a 90 €)",
    excerpt: "El último metro sale a las 1:30 y el festival acaba a las 2:30. Opciones reales para volver: carpooling, lanzaderas oficiales, autobús nocturno o taxi compartido.",
    author: "Equipo ConcertRide",
    publishedAt: "2026-04-25",
    h1: "Cómo volver de un festival de madrugada en España",
    intro: "El 80% de los problemas de un festival no son la cola de los baños — son volver a casa. El transporte público no llega: el último metro de Madrid sale a la 1:30 y un Mad Cool acaba a las 2:30.",
  },
  "huella-carbono-festivales-carpooling": {
    title: "Huella de carbono de un festival: por qué el carpooling es la acción más efectiva",
    excerpt: "El 80% de las emisiones de un festival vienen del transporte de los asistentes. Compartir coche reduce esas emisiones hasta un 75% por persona.",
    author: "Equipo ConcertRide",
    publishedAt: "2026-04-25",
    h1: "Huella de carbono y festivales: lo que el carpooling cambia de verdad",
    intro: "El 80% de la huella de carbono de un festival grande viene del transporte de los asistentes — no del escenario, no de los grupos, no de los vasos. Del coche que cada fan usa para llegar.",
  },
};

// ── Route landing data ──────────────────────────────────────────────────────
interface RouteData {
  originCity: string;
  festivalShortName: string;
  festivalName: string;
  festivalCity: string;
  distance: string;
  drivingTime: string;
  priceFrom: string;
}

const ROUTES: Record<string, RouteData> = {
  "madrid-mad-cool": { originCity: "Madrid", festivalShortName: "Mad Cool", festivalName: "Mad Cool Festival", festivalCity: "Madrid", distance: "15", drivingTime: "20 min", priceFrom: "4" },
  "barcelona-primavera-sound": { originCity: "Barcelona", festivalShortName: "Primavera Sound", festivalName: "Primavera Sound", festivalCity: "Barcelona", distance: "10", drivingTime: "15 min", priceFrom: "5" },
  "madrid-primavera-sound": { originCity: "Madrid", festivalShortName: "Primavera Sound", festivalName: "Primavera Sound", festivalCity: "Barcelona", distance: "620", drivingTime: "5h 30min", priceFrom: "15" },
  "valencia-primavera-sound": { originCity: "Valencia", festivalShortName: "Primavera Sound", festivalName: "Primavera Sound", festivalCity: "Barcelona", distance: "355", drivingTime: "3h 30min", priceFrom: "10" },
  "sevilla-mad-cool": { originCity: "Sevilla", festivalShortName: "Mad Cool", festivalName: "Mad Cool Festival", festivalCity: "Madrid", distance: "530", drivingTime: "5h", priceFrom: "14" },
  "bilbao-mad-cool": { originCity: "Bilbao", festivalShortName: "Mad Cool", festivalName: "Mad Cool Festival", festivalCity: "Madrid", distance: "395", drivingTime: "4h", priceFrom: "12" },
  "madrid-sonar": { originCity: "Madrid", festivalShortName: "Sónar", festivalName: "Sónar Festival", festivalCity: "Barcelona", distance: "620", drivingTime: "5h 30min", priceFrom: "15" },
  "madrid-fib": { originCity: "Madrid", festivalShortName: "FIB", festivalName: "FIB Benicàssim", festivalCity: "Benicàssim", distance: "390", drivingTime: "3h 45min", priceFrom: "10" },
  "barcelona-fib": { originCity: "Barcelona", festivalShortName: "FIB", festivalName: "FIB Benicàssim", festivalCity: "Benicàssim", distance: "230", drivingTime: "2h 15min", priceFrom: "8" },
  "madrid-bbk-live": { originCity: "Madrid", festivalShortName: "BBK Live", festivalName: "Bilbao BBK Live", festivalCity: "Bilbao", distance: "395", drivingTime: "4h", priceFrom: "12" },
  "barcelona-bbk-live": { originCity: "Barcelona", festivalShortName: "BBK Live", festivalName: "Bilbao BBK Live", festivalCity: "Bilbao", distance: "615", drivingTime: "5h 30min", priceFrom: "15" },
  "madrid-arenal-sound": { originCity: "Madrid", festivalShortName: "Arenal Sound", festivalName: "Arenal Sound", festivalCity: "Burriana", distance: "360", drivingTime: "3h 30min", priceFrom: "10" },
  "barcelona-arenal-sound": { originCity: "Barcelona", festivalShortName: "Arenal Sound", festivalName: "Arenal Sound", festivalCity: "Burriana", distance: "190", drivingTime: "2h", priceFrom: "7" },
  "valencia-arenal-sound": { originCity: "Valencia", festivalShortName: "Arenal Sound", festivalName: "Arenal Sound", festivalCity: "Burriana", distance: "65", drivingTime: "45 min", priceFrom: "4" },
  "madrid-medusa-festival": { originCity: "Madrid", festivalShortName: "Medusa", festivalName: "Medusa Festival", festivalCity: "Cullera", distance: "360", drivingTime: "3h 30min", priceFrom: "10" },
  "barcelona-medusa-festival": { originCity: "Barcelona", festivalShortName: "Medusa", festivalName: "Medusa Festival", festivalCity: "Cullera", distance: "370", drivingTime: "3h 40min", priceFrom: "10" },
  "madrid-vina-rock": { originCity: "Madrid", festivalShortName: "Viña Rock", festivalName: "Viña Rock", festivalCity: "Villarrobledo", distance: "180", drivingTime: "1h 50min", priceFrom: "6" },
  "barcelona-sonorama-ribera": { originCity: "Barcelona", festivalShortName: "Sonorama", festivalName: "Sonorama Ribera", festivalCity: "Aranda de Duero", distance: "550", drivingTime: "5h", priceFrom: "14" },
  "madrid-sonorama-ribera": { originCity: "Madrid", festivalShortName: "Sonorama", festivalName: "Sonorama Ribera", festivalCity: "Aranda de Duero", distance: "160", drivingTime: "1h 40min", priceFrom: "6" },
  "madrid-tomavistas": { originCity: "Madrid", festivalShortName: "Tomavistas", festivalName: "Tomavistas", festivalCity: "Madrid", distance: "15", drivingTime: "20 min", priceFrom: "4" },
  "barcelona-cruilla": { originCity: "Barcelona", festivalShortName: "Cruïlla", festivalName: "Cruïlla Barcelona", festivalCity: "Barcelona", distance: "10", drivingTime: "15 min", priceFrom: "5" },
  "madrid-cruilla": { originCity: "Madrid", festivalShortName: "Cruïlla", festivalName: "Cruïlla Barcelona", festivalCity: "Barcelona", distance: "620", drivingTime: "5h 30min", priceFrom: "15" },
};

// ── Body generators ─────────────────────────────────────────────────────────

function festivalBody(slug: string, f: FestivalData, base: string): string {
  const originRows = f.originCities
    .map((oc) => `<li><strong>${esc(oc.city)}</strong> — ${oc.km} km · ${esc(oc.drivingTime)} · desde <strong>${esc(oc.range)}</strong></li>`)
    .join("\n    ");

  const faqItems = f.faqs
    .map((faq) => `<dt>${esc(faq.q)}</dt>\n  <dd>${esc(faq.a)}</dd>`)
    .join("\n  ");

  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: f.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  });

  const eventJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Event",
    name: f.name,
    startDate: f.startDate,
    endDate: f.endDate,
    location: {
      "@type": "Place",
      name: f.venue,
      address: { "@type": "PostalAddress", streetAddress: f.venueAddress, addressLocality: f.city, addressCountry: "ES" },
    },
    url: `${base}/festivales/${slug}`,
    description: `Encuentra o publica un viaje compartido a ${f.name} desde cualquier ciudad de España. Sin comisión. ConcertRide.`,
    offers: { "@type": "Offer", price: f.priceFrom, priceCurrency: "EUR", availability: "https://schema.org/InStock" },
    organizer: { "@type": "Organization", name: f.name },
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
  });

  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Festivales", item: `${base}/festivales` },
      { "@type": "ListItem", position: 3, name: f.shortName, item: `${base}/festivales/${slug}` },
    ],
  });

  return `<script type="application/ld+json">${eventJsonLd}</script>
<script type="application/ld+json">${faqJsonLd}</script>
<script type="application/ld+json">${breadcrumbJsonLd}</script>
<nav aria-label="Breadcrumb"><a href="${base}/">Inicio</a> / <a href="${base}/festivales">Festivales</a> / <span>${esc(f.shortName)}</span></nav>
<p>${esc(f.blurb)}</p>
<h2>¿Cómo llegar a ${esc(f.shortName)} en coche compartido?</h2>
<p>El ${esc(f.venue)} queda en ${esc(f.city)}. El carpooling es la opción más cómoda y económica para asistentes de otras ciudades: el conductor también va al festival, así que el horario de vuelta está alineado con el fin real del show.</p>
<p><a href="${base}/como-funciona">Descubre cómo funciona ConcertRide →</a></p>
<h2>Precios de carpooling a ${esc(f.shortName)} desde distintas ciudades</h2>
<ul>
  ${originRows}
</ul>
<p><em>Precios orientativos. El conductor fija el precio por asiento. ConcertRide no cobra comisión.</em></p>
<h2>¿Por qué ir a ${esc(f.shortName)} con ConcertRide?</h2>
<ul>
  <li><strong>Sin comisión</strong> — el 100% del precio va al conductor, en efectivo o Bizum.</li>
  <li><strong>Conductores verificados</strong> — carnet comprobado y sistema de valoraciones.</li>
  <li><strong>Vuelta de madrugada</strong> — el conductor también va al festival, coordináis la vuelta.</li>
  <li><strong>Reserva instantánea</strong> — muchos conductores la activan para confirmar al momento.</li>
</ul>
<h2>Preguntas frecuentes — ${esc(f.shortName)}</h2>
<dl>
  ${faqItems}
</dl>
<p><a href="${base}/festivales">Ver todos los festivales con carpooling →</a></p>`;
}

function cityBody(slug: string, c: CityData, base: string): string {
  const venueItems = c.venues.map((v) => `<li>${esc(v)}</li>`).join("\n  ");

  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Conciertos", item: `${base}/concerts` },
      { "@type": "ListItem", position: 3, name: c.name, item: `${base}/conciertos/${slug}` },
    ],
  });

  return `<script type="application/ld+json">${breadcrumbJsonLd}</script>
<nav aria-label="Breadcrumb"><a href="${base}/">Inicio</a> / <a href="${base}/concerts">Conciertos</a> / <span>${esc(c.name)}</span></nav>
<p>${esc(c.blurb)}</p>
<h2>Recintos y festivales en ${esc(c.name)}</h2>
<ul>
  ${venueItems}
</ul>
<h2>Cómo ir a un concierto en ${esc(c.name)} con ConcertRide</h2>
<ol>
  <li>Busca el concierto al que vas en esta página.</li>
  <li>Elige un viaje por precio por asiento, ciudad de origen y perfil del conductor.</li>
  <li>Reserva tu plaza. Pagas en efectivo o Bizum directamente al conductor el día del viaje.</li>
</ol>
<p><a href="${base}/concerts">Ver todos los conciertos en España →</a></p>`;
}

function blogBody(slug: string, p: BlogData, base: string): string {
  const articleJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.excerpt,
    author: { "@type": "Organization", name: p.author },
    publisher: { "@type": "Organization", name: "ConcertRide ES", logo: { "@type": "ImageObject", url: `${base}/favicon.svg` } },
    datePublished: p.publishedAt,
    url: `${base}/blog/${slug}`,
  });

  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blog` },
      { "@type": "ListItem", position: 3, name: p.title, item: `${base}/blog/${slug}` },
    ],
  });

  return `<script type="application/ld+json">${articleJsonLd}</script>
<script type="application/ld+json">${breadcrumbJsonLd}</script>
<nav aria-label="Breadcrumb"><a href="${base}/">Inicio</a> / <a href="${base}/blog">Blog</a> / <span>${esc(p.title)}</span></nav>
<p><em>Por ${esc(p.author)} · ${p.publishedAt}</em></p>
<p>${esc(p.intro)}</p>
<p>${esc(p.excerpt)}</p>
<p><a href="${base}/concerts">Buscar conciertos con carpooling →</a></p>`;
}

function routeBody(slug: string, r: RouteData, base: string): string {
  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Festivales", item: `${base}/festivales` },
      { "@type": "ListItem", position: 3, name: `${r.originCity} → ${r.festivalShortName}`, item: `${base}/rutas/${slug}` },
    ],
  });

  const festivalSlug = slug.replace(`${slug.split("-")[0]}-`, "").replace(new RegExp(`^${r.originCity.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-`), "");

  return `<script type="application/ld+json">${breadcrumbJsonLd}</script>
<nav aria-label="Breadcrumb"><a href="${base}/">Inicio</a> / <a href="${base}/festivales">Festivales</a> / <span>${esc(r.originCity)} → ${esc(r.festivalShortName)}</span></nav>
<p>Viaje compartido de ${esc(r.originCity)} a ${esc(r.festivalName)} en ${esc(r.festivalCity)}. ${r.distance} km · ${esc(r.drivingTime)} · desde ${r.priceFrom} €/asiento con ConcertRide.</p>
<h2>Detalles del trayecto</h2>
<ul>
  <li><strong>Origen:</strong> ${esc(r.originCity)}</li>
  <li><strong>Destino:</strong> ${esc(r.festivalName)} — ${esc(r.festivalCity)}</li>
  <li><strong>Distancia:</strong> ${r.distance} km</li>
  <li><strong>Tiempo estimado:</strong> ${esc(r.drivingTime)}</li>
  <li><strong>Precio orientativo:</strong> desde ${r.priceFrom} €/asiento (sin comisión)</li>
</ul>
<h2>Por qué ir con ConcertRide</h2>
<ul>
  <li>Sin comisión — el 100% del precio va al conductor.</li>
  <li>Conductores verificados con carnet comprobado.</li>
  <li>Pago en efectivo o Bizum directamente al conductor el día del viaje.</li>
</ul>
<p><a href="${base}/festivales/${festivalSlug}">Ver todos los viajes a ${esc(r.festivalShortName)} →</a></p>`;
}

// ── Meta + body resolver ────────────────────────────────────────────────────
interface PageData {
  title: string;
  description: string;
  canonical: string;
  h1: string;
  body: string;
  ogImage?: string;
  ogType?: "website" | "article" | "music.event";
  articlePublishedTime?: string;
  articleAuthor?: string;
}

function resolvePageData(pathname: string, base: string): PageData | null {
  // Static routes — try both with and without trailing slash
  const staticRoutes = buildStaticRoutes(base);
  const pathWithoutTrailingSlash = pathname.replace(/\/$/, "");
  const pathWithTrailingSlash = pathWithoutTrailingSlash === pathname ? `${pathname}/` : pathname;

  const staticMatch = staticRoutes[pathname] ?? staticRoutes[pathWithoutTrailingSlash] ?? staticRoutes[pathWithTrailingSlash] ?? null;
  if (staticMatch) {
    return {
      title: staticMatch.title,
      description: staticMatch.description,
      canonical: staticMatch.canonical,
      h1: staticMatch.h1,
      body: staticMatch.body,
    };
  }

  // /festivales/:slug
  const festMatch = pathname.match(/^\/festivales\/([^/]+)\/?$/);
  if (festMatch) {
    const slug = festMatch[1] ?? "";
    const f = FESTIVALS[slug];
    if (!f) return null;
    const yearMatch = f.dates.match(/\d{4}/);
    const year = yearMatch ? yearMatch[0] : "2026";
    return {
      title: `Carpooling al ${f.shortName} ${year} — Cómo ir desde toda España | ${SITE_NAME}`,
      description: `Comparte coche a ${f.name} (${f.venue}, ${f.city}) ${f.dates}. Desde ${f.priceFrom} €/asiento. Sin taxi, sin comisión. Conductores verificados.`,
      canonical: `${base}/festivales/${slug}`,
      h1: `Cómo ir a ${f.shortName} en coche compartido — ${year}`,
      body: festivalBody(slug, f, base),
    };
  }

  // /conciertos/:city
  const cityMatch = pathname.match(/^\/conciertos\/([^/]+)\/?$/);
  if (cityMatch) {
    const slug = cityMatch[1] ?? "";
    const c = CITIES[slug];
    if (!c) return null;
    return {
      title: `Conciertos en ${c.name} 2026 — Carpooling sin comisiones | ${SITE_NAME}`,
      description: `Carpooling a conciertos y festivales en ${c.name} (${c.region}). Encuentra o publica un viaje compartido gratis. Sin comisiones, conductores verificados.`,
      canonical: `${base}/conciertos/${slug}`,
      h1: `Conciertos en ${c.name} — Carpooling disponible`,
      body: cityBody(slug, c, base),
    };
  }

  // /blog/:slug
  const blogMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (blogMatch) {
    const slug = blogMatch[1] ?? "";
    const p = BLOG_POSTS[slug];
    if (!p) return null;
    return {
      title: `${p.title} | ${SITE_NAME}`,
      description: p.excerpt,
      canonical: `${base}/blog/${slug}`,
      h1: p.h1,
      body: blogBody(slug, p, base),
      ogType: "article",
      articlePublishedTime: p.publishedAt,
      articleAuthor: p.author,
    };
  }

  // /rutas/:route
  const routeMatch = pathname.match(/^\/rutas\/([^/]+)\/?$/);
  if (routeMatch) {
    const slug = routeMatch[1] ?? "";
    const r = ROUTES[slug];
    if (!r) return null;
    return {
      title: `Carpooling ${r.originCity} → ${r.festivalShortName} 2026 — Viaje compartido sin comisión | ${SITE_NAME}`,
      description: `Viaje compartido de ${r.originCity} a ${r.festivalName} (${r.festivalCity}). ${r.distance} km, ${r.drivingTime}. Desde ${r.priceFrom} €/asiento. Sin comisión. Conductores verificados.`,
      canonical: `${base}/rutas/${slug}`,
      h1: `Carpooling de ${r.originCity} a ${r.festivalShortName}`,
      body: routeBody(slug, r, base),
    };
  }

  return null;
}

// ── Full HTML renderer ──────────────────────────────────────────────────────
function buildRenderedHtml(html: string, page: PageData, base: string, env?: { GSC_VERIFICATION_TOKEN?: string; BING_VERIFICATION_TOKEN?: string; YANDEX_VERIFICATION_TOKEN?: string }): string {
  const title = esc(page.title);
  const desc = esc(page.description);
  const canonical = esc(page.canonical);
  const img = esc(page.ogImage ?? `${base}/og/home.png`);

  let result = html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/<meta\s+name="description"[^>]*>/, `<meta name="description" content="${desc}"/>`)
    .replace(/<meta\s+name="robots"[^>]*>/, `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"/>`)
    .replace(/<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}"/>`)
    .replace(/<link\s+rel="alternate"\s+hreflang="es-ES"[^>]*>/, `<link rel="alternate" hreflang="es-ES" href="${canonical}"/>`)
    .replace(/<link\s+rel="alternate"\s+hreflang="x-default"[^>]*>/, `<link rel="alternate" hreflang="x-default" href="${canonical}"/>`)
    .replace(/<meta\s+property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}"/>`)
    .replace(/<meta\s+property="og:title"[^>]*>/, `<meta property="og:title" content="${title}"/>`)
    .replace(/<meta\s+property="og:description"[^>]*>/, `<meta property="og:description" content="${desc}"/>`)
    .replace(/<meta\s+property="og:image"[^>]*>/, `<meta property="og:image" content="${img}"/>`)
    .replace(/<meta\s+property="og:image:secure_url"[^>]*>/, `<meta property="og:image:secure_url" content="${img}"/>`)
    .replace(/<meta\s+property="og:image:alt"[^>]*>/, `<meta property="og:image:alt" content="${title}"/>`)
    .replace(/<meta\s+name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}"/>`)
    .replace(/<meta\s+name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${desc}"/>`)
    .replace(/<meta\s+name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${img}"/>`)
    .replace(/<meta\s+property="og:type"[^>]*>/, `<meta property="og:type" content="${esc(page.ogType ?? "website")}"/>`);

  // Search engine verification tokens — replace placeholders from env when available
  if (env?.GSC_VERIFICATION_TOKEN && env.GSC_VERIFICATION_TOKEN !== "REPLACE_WITH_GSC_TOKEN") {
    result = result.replace(/content="REPLACE_WITH_GSC_TOKEN"/, `content="${esc(env.GSC_VERIFICATION_TOKEN)}"`);
  }
  if (env?.BING_VERIFICATION_TOKEN && env.BING_VERIFICATION_TOKEN !== "REPLACE_WITH_BING_TOKEN") {
    result = result.replace(/content="REPLACE_WITH_BING_TOKEN"/, `content="${esc(env.BING_VERIFICATION_TOKEN)}"`);
  }
  if (env?.YANDEX_VERIFICATION_TOKEN && env.YANDEX_VERIFICATION_TOKEN !== "REPLACE_WITH_YANDEX_TOKEN") {
    result = result.replace(/content="REPLACE_WITH_YANDEX_TOKEN"/, `content="${esc(env.YANDEX_VERIFICATION_TOKEN)}"`);
  }

  // Article meta tags — inject before </head> when page is an article
  if (page.ogType === "article" && page.articlePublishedTime) {
    const articleMeta = [
      `<meta property="article:published_time" content="${esc(page.articlePublishedTime)}"/>`,
      page.articleAuthor ? `<meta property="article:author" content="${esc(page.articleAuthor)}"/>` : "",
      `<meta property="article:section" content="Carpooling"/>`,
      `<meta property="article:publisher" content="https://www.facebook.com/concertride.me"/>`,
    ].filter(Boolean).join("\n    ");
    result = result.replace("</head>", `    ${articleMeta}\n  </head>`);
  }

  // Inject static body content into the #root div so crawlers see real content.
  // The React app will hydrate on top of this when JS loads for real users,
  // but bots never reach that point — they only see this HTML.
  const staticBody = `<main id="main" aria-label="${title}" style="padding:1rem;font-family:sans-serif;max-width:960px;margin:0 auto">
<nav style="font-size:0.75rem;margin-bottom:1rem"><a href="${base}/">ConcertRide</a></nav>
<h1>${esc(page.h1)}</h1>
${page.body}
</main>`;

  // Whitespace-tolerant: handles `<div id="root"></div>` or with newlines/spaces inside
  result = result.replace(/<div\s+id="root">\s*<\/div>/, `<div id="root">${staticBody}</div>`);

  return result;
}

// ── Concert page data (requires store) ─────────────────────────────────────
async function resolveConcertPage(id: string, base: string, store: HonoEnv["Variables"]["store"]): Promise<PageData | null> {
  try {
    const concert = await store.getConcert(id);
    if (!concert) return null;

    const dateStr = concert.date
      ? new Date(concert.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
      : "";
    const title = `Carpooling ${esc(concert.artist)} — ${esc(concert.venue?.name ?? "")} ${dateStr ? `· ${dateStr}` : ""} | ${SITE_NAME}`;
    const description = `Viaje compartido para ir al concierto de ${concert.artist} en ${concert.venue?.name ?? ""} (${concert.venue?.city ?? ""}). Encuentra o publica un viaje. Sin comisión, conductores verificados.`;
    const canonical = `${base}/concerts/${id}`;

    const eventJsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MusicEvent",
      name: `${concert.artist} — ${concert.venue?.name ?? ""}`,
      startDate: concert.date,
      location: {
        "@type": "Place",
        name: concert.venue?.name ?? "",
        address: {
          "@type": "PostalAddress",
          addressLocality: concert.venue?.city ?? "",
          addressCountry: "ES",
        },
      },
      url: canonical,
      description,
      offers: {
        "@type": "Offer",
        url: canonical,
        price: "0",
        priceCurrency: "EUR",
        description: "Carpooling sin comisión con ConcertRide",
      },
    });

    const breadcrumbJsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "Conciertos", item: `${base}/concerts` },
        { "@type": "ListItem", position: 3, name: `${concert.artist} — ${concert.venue?.name ?? ""}`, item: canonical },
      ],
    });

    const body = `<script type="application/ld+json">${eventJsonLd}</script>
<script type="application/ld+json">${breadcrumbJsonLd}</script>
<nav aria-label="Breadcrumb"><a href="${base}/">Inicio</a> / <a href="${base}/concerts">Conciertos</a> / <span>${esc(concert.artist)}</span></nav>
<p>${esc(concert.artist)} actúa en ${esc(concert.venue?.name ?? "")}${concert.venue?.city ? `, ${esc(concert.venue.city)}` : ""}${dateStr ? ` el ${dateStr}` : ""}.</p>
<h2>Viajes compartidos a este concierto</h2>
<p>Encuentra o publica un viaje a ${esc(concert.artist)}. Sin comisión, conductores verificados. Pago en efectivo o Bizum al conductor el día del evento.</p>
<h2>¿Por qué ir con ConcertRide?</h2>
<ul>
  <li><strong>Sin comisión</strong> — el 100% del precio va al conductor.</li>
  <li><strong>Conductores verificados</strong> — carnet comprobado y sistema de valoraciones.</li>
  <li><strong>Vuelta incluida</strong> — muchos conductores publican el viaje de vuelta.</li>
</ul>
<p><a href="${base}/concerts">Ver todos los conciertos →</a></p>`;

    return {
      title,
      description,
      canonical,
      h1: `Viajes compartidos a ${concert.artist}${concert.venue?.city ? ` en ${concert.venue.city}` : ""}`,
      body,
      ogImage: concert.image_url ?? undefined,
    };
  } catch {
    return null;
  }
}

// ── Middleware ──────────────────────────────────────────────────────────────
export async function seoPrerender(c: Context<HonoEnv>, next: Next): Promise<Response | void> {
  if (
    c.req.method !== "GET" ||
    c.req.path.startsWith("/api/") ||
    c.req.path.startsWith("/.well-known/") ||
    c.req.path.match(/\.[a-z0-9]{1,6}$/i)
  ) {
    return next();
  }

  const ua = c.req.header("User-Agent") ?? "";
  if (!SEARCH_BOTS.test(ua)) {
    return next();
  }

  const base = getSiteUrl(c.env);

  // Resolve page data — concert pages need the store, everything else is static
  // Also try with trailing slash appended/removed if initial match fails
  let page: PageData | null = resolvePageData(c.req.path, base);

  if (!page) {
    // Try normalizing trailing slash
    const pathWithoutSlash = c.req.path.replace(/\/$/, "");
    const pathWithSlash = pathWithoutSlash === c.req.path ? `${c.req.path}/` : pathWithoutSlash;
    page = resolvePageData(pathWithSlash, base);
  }

  if (!page) {
    // /concerts/:id — fetch concert data from store for rich SEO
    const concertMatch = c.req.path.match(/^\/concerts\/([^/]+)\/?$/);
    if (concertMatch && c.var.store) {
      page = await resolveConcertPage(concertMatch[1] ?? "", base, c.var.store);
    }
  }

  if (!page) {
    return next();
  }

  const assetRes = await c.env.ASSETS.fetch(
    new Request(`${base}/`, { headers: c.req.raw.headers }),
  );
  if (!assetRes.ok || !assetRes.headers.get("content-type")?.includes("text/html")) {
    return next();
  }

  const html = await assetRes.text();
  const rendered = buildRenderedHtml(html, page, base, c.env);

  return new Response(rendered, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Vary": "User-Agent",
      "X-SEO-Prerender": "1",
      "Link": `<${base}/sitemap.xml>; rel="sitemap", <${base}/llms.txt>; rel="describedby", <${base}/openapi.json>; rel="service-desc"`,
    },
  });
}

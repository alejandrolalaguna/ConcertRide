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

const SITE_NAME = "ConcertRide";

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
      title: `Festivales de música España 2026: carpooling y transporte | ConcertRide`,
      description: "Viajes compartidos a los festivales más grandes de España: Mad Cool, Primavera Sound, Sónar, FIB, BBK Live y más. Sin taxi, sin comisión.",
      canonical: `${base}/festivales`,
      h1: "Festivales de música en España con viaje compartido",
      body: (() => {
        const faqJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: "es-ES",
          mainEntity: [
            {
              "@type": "Question",
              name: "¿Cuáles son los festivales más grandes de España en 2026?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Los cinco festivales más grandes de España en 2026 son: Mad Cool (Madrid, 9–11 jul), Primavera Sound (Barcelona, 28 may–1 jun), Sónar (Barcelona, 18–20 jun), BBK Live (Bilbao, 9–11 jul) y FIB Benicàssim (16–19 jul). Todos cuentan con viajes compartidos disponibles en ConcertRide.",
              },
            },
            {
              "@type": "Question",
              name: "¿Hay autobuses a los festivales de España?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Solo 8 de los 16 festivales cubiertos por ConcertRide disponen de autobús lanzadera oficial (Mad Cool, Primavera Sound, Sónar, BBK Live, Arenal Sound, Medusa, Viña Rock y O Son do Camiño). Los horarios son fijos y las plazas se agotan semanas antes. El carpooling con ConcertRide cubre todos los festivales sin horario inamovible.",
              },
            },
            {
              "@type": "Question",
              name: "¿Cuánto cuesta un carpooling a un festival de España?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "El precio de un carpooling a un festival de España oscila entre 4 € y 55 € por asiento según la distancia. Para trayectos cortos (menos de 100 km) el precio medio es 4–12 €; para larga distancia (más de 400 km) puede llegar a 40–55 €. El conductor fija el precio para cubrir combustible y peajes — ConcertRide no cobra comisión.",
              },
            },
            {
              "@type": "Question",
              name: "¿Es ConcertRide mejor que BlaBlaCar para festivales?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Para festivales, ConcertRide tiene tres ventajas clave sobre BlaBlaCar: (1) 0 % de comisión — el 100 % del precio va al conductor; (2) cada viaje está vinculado a un evento concreto, con hora de vuelta alineada al fin del show; (3) el conductor te recoge en la puerta, no en una parada genérica de carretera.",
              },
            },
          ],
        });
        const itemListJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Festivales de música en España 2026 con carpooling",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Mad Cool Festival — Madrid — 9–11 jul 2026", url: `${base}/festivales/mad-cool` },
            { "@type": "ListItem", position: 2, name: "Primavera Sound — Barcelona — 28 may–1 jun 2026", url: `${base}/festivales/primavera-sound` },
            { "@type": "ListItem", position: 3, name: "Sónar — Barcelona — 18–20 jun 2026", url: `${base}/festivales/sonar` },
            { "@type": "ListItem", position: 4, name: "FIB Benicàssim — 16–19 jul 2026", url: `${base}/festivales/fib` },
            { "@type": "ListItem", position: 5, name: "BBK Live — Bilbao — 9–11 jul 2026", url: `${base}/festivales/bbk-live` },
            { "@type": "ListItem", position: 6, name: "Resurrection Fest — Viveiro — 25–28 jun 2026", url: `${base}/festivales/resurrection-fest` },
            { "@type": "ListItem", position: 7, name: "Arenal Sound — Burriana — 29 jul–2 ago 2026", url: `${base}/festivales/arenal-sound` },
            { "@type": "ListItem", position: 8, name: "Medusa Festival — Cullera — 12–16 ago 2026", url: `${base}/festivales/medusa-festival` },
            { "@type": "ListItem", position: 9, name: "Viña Rock — Villarrobledo — 30 abr–3 may 2026", url: `${base}/festivales/vina-rock` },
            { "@type": "ListItem", position: 10, name: "O Son do Camiño — Santiago — 18–20 jun 2026", url: `${base}/festivales/o-son-do-camino` },
            { "@type": "ListItem", position: 11, name: "Sonorama Ribera — Aranda de Duero — 6–9 ago 2026", url: `${base}/festivales/sonorama-ribera` },
            { "@type": "ListItem", position: 12, name: "Cala Mijas — Mijas — 2–4 oct 2026", url: `${base}/festivales/cala-mijas` },
            { "@type": "ListItem", position: 13, name: "Low Festival — Benidorm — 24–26 jul 2026", url: `${base}/festivales/low-festival` },
            { "@type": "ListItem", position: 14, name: "Tomavistas — Madrid — 15–17 may 2026", url: `${base}/festivales/tomavistas` },
            { "@type": "ListItem", position: 15, name: "Zevra Festival — Valencia — verano 2026", url: `${base}/festivales/zevra-festival` },
            { "@type": "ListItem", position: 16, name: "Cruïlla — Barcelona — 9–12 jul 2026", url: `${base}/festivales/cruilla` },
          ],
        });
        return `<script type="application/ld+json">${faqJsonLd}</script>
<script type="application/ld+json">${itemListJsonLd}</script>
<p>ConcertRide cubre el carpooling a 16 festivales de música en España en 2026: Mad Cool (Madrid, 9–11 jul), Primavera Sound (Barcelona, 28 may–1 jun), Sónar (Barcelona, 18–20 jun), FIB (Benicàssim, 16–19 jul), BBK Live (Bilbao, 9–11 jul), Resurrection Fest (Viveiro, 25–28 jun), Arenal Sound (Burriana, 29 jul–2 ago), Medusa (Cullera, 12–16 ago), Viña Rock (Villarrobledo, 30 abr–3 may), O Son do Camiño (Santiago, 18–20 jun), Sonorama (Aranda de Duero, 6–9 ago), Cala Mijas (Mijas, 2–4 oct), Low Festival (Benidorm, 24–26 jul), Tomavistas (Madrid, 15–17 may), Zevra (Valencia) y Cruïlla (Barcelona, 9–12 jul). Precio de carpooling: 4–55 € por asiento según distancia.</p>

<h2>¿Por qué carpooling para ir a festivales?</h2>
<p>Un taxi desde Madrid a un recinto periférico cuesta 35–60 €. Con ConcertRide, el coste medio por asiento es 8–15 €. No hay comisión — el 100 % del precio va al conductor. Los autobuses lanzadera oficiales solo operan en 8 de los 16 festivales cubiertos, con horarios fijos y plazas limitadas. El carpooling sale desde tu barrio a la hora que acordáis.</p>

<h2>Transporte a festivales: opciones comparadas</h2>
<table>
  <tr><th>Opción</th><th>Precio medio (desde Madrid)</th><th>Disponibilidad nocturna</th></tr>
  <tr><td>ConcertRide carpooling</td><td>8–15 €/asiento</td><td>Sí (conductor elige hora)</td></tr>
  <tr><td>Bus lanzadera oficial</td><td>10–25 €</td><td>Solo festivales selectos</td></tr>
  <tr><td>ALSA / FlixBus</td><td>15–35 €</td><td>Sin servicio nocturno</td></tr>
  <tr><td>Taxi / Cabify</td><td>35–60 €</td><td>Sí (precio x3–4)</td></tr>
  <tr><td>BlaBlaCar</td><td>12–25 € + 12–18% comisión</td><td>Limitado</td></tr>
</table>

<h2>Festivales de primavera 2026</h2>
<ul>
  <li><a href="${base}/festivales/vina-rock">Viña Rock — Villarrobledo — 30 abr–3 may 2026</a></li>
  <li><a href="${base}/festivales/tomavistas">Tomavistas — Madrid — 15–17 may 2026</a></li>
  <li><a href="${base}/festivales/primavera-sound">Primavera Sound — Barcelona — 28 may–1 jun 2026</a></li>
</ul>

<h2>Festivales de verano 2026</h2>
<ul>
  <li><a href="${base}/festivales/sonar">Sónar — Barcelona — 18–20 jun 2026</a></li>
  <li><a href="${base}/festivales/resurrection-fest">Resurrection Fest — Viveiro — 25–28 jun 2026</a></li>
  <li><a href="${base}/festivales/o-son-do-camino">O Son do Camiño — Santiago — 18–20 jun 2026</a></li>
  <li><a href="${base}/festivales/low-festival">Low Festival — Benidorm — 24–26 jul 2026</a></li>
  <li><a href="${base}/festivales/mad-cool">Mad Cool Festival — Madrid — 9–11 jul 2026</a></li>
  <li><a href="${base}/festivales/bbk-live">BBK Live — Bilbao — 9–11 jul 2026</a></li>
  <li><a href="${base}/festivales/cruilla">Cruïlla — Barcelona — 9–12 jul 2026</a></li>
  <li><a href="${base}/festivales/fib">FIB Benicàssim — 16–19 jul 2026</a></li>
  <li><a href="${base}/festivales/arenal-sound">Arenal Sound — Burriana — 29 jul–2 ago 2026</a></li>
  <li><a href="${base}/festivales/zevra-festival">Zevra Festival — Valencia — verano 2026</a></li>
  <li><a href="${base}/festivales/sonorama-ribera">Sonorama Ribera — Aranda de Duero — 6–9 ago 2026</a></li>
  <li><a href="${base}/festivales/medusa-festival">Medusa Festival — Cullera — 12–16 ago 2026</a></li>
</ul>

<h2>Festivales de otoño 2026</h2>
<ul>
  <li><a href="${base}/festivales/cala-mijas">Cala Mijas — Mijas — 2–4 oct 2026</a></li>
</ul>

<p>Lee más en el blog: <a href="${base}/blog/carpooling-festivales-espana-2026">Guía completa de carpooling a festivales 2026</a> · <a href="${base}/guia-transporte-festivales">Guía de transporte a festivales</a></p>`;
      })(),
    },
    "/guia-transporte-festivales": {
      title: `Guía de transporte para festivales de España 2026: autobús, tren y carpooling | ${SITE_NAME}`,
      description: "Cómo llegar a los festivales de música en España: autobús organizado, tren, lanzadera oficial y carpooling comparados. Precios, pros, contras y opciones de vuelta de madrugada.",
      canonical: `${base}/guia-transporte-festivales`,
      h1: "Guía de transporte para festivales de música en España 2026",
      body: `<p>Guía completa con todas las opciones para llegar a los festivales de música en España en 2026: carpooling, autobuses organizados, transporte público y consejos para volver de madrugada sin pagar de más.</p>
<h2>Por qué el carpooling es la mejor opción para festivales</h2>
<p>El transporte público rara vez cubre el horario real de los festivales — el último metro sale antes de que acabe el cabeza de cartel. Un taxi de madrugada puede costar 30–90 € por trayecto. El carpooling con ConcertRide sale por 4–20 € dependiendo de la distancia, y el conductor también va al festival. Sin comisión, sin horario fijo, pago en efectivo o Bizum directamente al conductor.</p>
<h2>Comparativa de opciones de transporte a festivales</h2>
<ul>
  <li><strong>Carpooling (ConcertRide)</strong>: 3–20 €/asiento. Puerta a puerta, horario flexible, vuelta cuando quieras.</li>
  <li><strong>Autobús organizado</strong>: 15–35 €. Origen fijo, horario de vuelta inamovible, se agota semanas antes.</li>
  <li><strong>Transporte público</strong>: 0–5 €. Solo funciona en recintos bien comunicados (Parc del Fòrum, Fira Montjuïc). No cubre la vuelta de madrugada.</li>
  <li><strong>Taxi / VTC</strong>: 40–90 € en madrugada de festival. Precio multiplicado x2–x3 por alta demanda.</li>
</ul>
<h2>Cómo llegar a cada festival en coche compartido</h2>
<ul>
  <li><a href="${base}/festivales/mad-cool">Cómo ir al Mad Cool en coche compartido — Madrid, julio 2026</a></li>
  <li><a href="${base}/festivales/primavera-sound">Cómo ir al Primavera Sound en coche compartido — Barcelona, mayo–junio 2026</a></li>
  <li><a href="${base}/festivales/sonar">Cómo ir al Sónar en coche compartido — Barcelona, junio 2026</a></li>
  <li><a href="${base}/festivales/fib">Cómo ir al FIB en coche compartido — Benicàssim, julio 2026</a></li>
  <li><a href="${base}/festivales/bbk-live">Cómo ir al BBK Live en coche compartido — Bilbao, julio 2026</a></li>
  <li><a href="${base}/festivales/resurrection-fest">Cómo ir al Resurrection Fest en coche compartido — Viveiro, junio 2026</a></li>
  <li><a href="${base}/festivales/arenal-sound">Cómo ir al Arenal Sound en coche compartido — Burriana, julio–agosto 2026</a></li>
  <li><a href="${base}/festivales/medusa-festival">Cómo ir al Medusa Festival en coche compartido — Cullera, agosto 2026</a></li>
  <li><a href="${base}/festivales/vina-rock">Cómo ir a Viña Rock en coche compartido — Villarrobledo, mayo 2026</a></li>
  <li><a href="${base}/festivales/o-son-do-camino">Cómo ir al O Son do Camiño en coche compartido — Santiago, junio 2026</a></li>
  <li><a href="${base}/festivales/cala-mijas">Cómo ir a Cala Mijas en coche compartido — Mijas, octubre 2026</a></li>
  <li><a href="${base}/festivales/sonorama-ribera">Cómo ir al Sonorama Ribera en coche compartido — Aranda de Duero, agosto 2026</a></li>
  <li><a href="${base}/festivales/low-festival">Cómo ir al Low Festival en coche compartido — Benidorm, julio 2026</a></li>
  <li><a href="${base}/festivales/tomavistas">Cómo ir al Tomavistas en coche compartido — Madrid, mayo 2026</a></li>
  <li><a href="${base}/festivales/zevra-festival">Cómo ir al Zevra Festival en coche compartido — Valencia, verano 2026</a></li>
  <li><a href="${base}/festivales/cruilla">Cómo ir al Cruïlla en coche compartido — Barcelona, julio 2026</a></li>
</ul>
<h2>El problema de volver de noche de un festival</h2>
<p>La mayoría de festivales terminan entre la 1:00 y las 4:00. El metro de Madrid cierra a la 1:30, el de Barcelona a las 2:00. Los autobuses nocturnos (búhos en Madrid, nitbus en Barcelona) no llegan a los recintos de festival. Los taxis y VTC multiplican el precio x2–x3 en noches de alta demanda. Con ConcertRide, acuerdas la hora de vuelta con el conductor antes del festival: salís juntos cuando acabe el último bolo.</p>`,
    },
    "/como-funciona": {
      title: `Cómo funciona ConcertRide — Carpooling para conciertos | ConcertRide`,
      description: "Guía paso a paso: cómo reservar plaza en un viaje compartido a un concierto o cómo publicar tu propio viaje en ConcertRide. Gratis, sin comisiones, con conductores verificados.",
      canonical: `${base}/como-funciona`,
      h1: "Cómo funciona el carpooling para conciertos",
      body: (() => {
        const howToPassengerJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Cómo reservar un viaje compartido a un concierto en ConcertRide",
          description: "Reserva un asiento en un coche compartido para ir a un concierto o festival en España. Gratis, sin comisión.",
          totalTime: "PT2M",
          step: [
            { "@type": "HowToStep", position: 1, name: "Busca tu concierto", text: "Entra en concertride.me y busca el festival o concierto al que quieres ir.", url: `${base}/concerts` },
            { "@type": "HowToStep", position: 2, name: "Elige un viaje", text: "Filtra por ciudad de origen, precio por asiento y hora de salida. Lee el perfil del conductor y sus valoraciones." },
            { "@type": "HowToStep", position: 3, name: "Solicita tu plaza", text: "Pulsa 'Solicitar plaza'. Si el conductor tiene reserva instantánea, se confirma al momento. Si no, espera su respuesta por chat." },
            { "@type": "HowToStep", position: 4, name: "Paga el día del viaje", text: "El día del evento, te reúnes con el conductor en el punto acordado y pagas en efectivo o Bizum. ConcertRide no gestiona pagos ni cobra comisión." },
          ],
        });
        const howToDriverJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Cómo publicar un viaje a un concierto en ConcertRide",
          description: "Ofrece plazas en tu coche para un concierto o festival y comparte gastos de combustible con otros fans. Gratis.",
          totalTime: "PT3M",
          step: [
            { "@type": "HowToStep", position: 1, name: "Crea una cuenta y verifica tu carnet", text: "Regístrate en concertride.me y sube una foto de tu carnet de conducir para que otros pasajeros confíen en ti.", url: `${base}/register` },
            { "@type": "HowToStep", position: 2, name: "Publica un viaje", text: "Elige el concierto, indica el punto de recogida, el número de plazas disponibles y el precio por asiento (solo combustible y peajes)." },
            { "@type": "HowToStep", position: 3, name: "Acepta solicitudes", text: "Revisa los perfiles de los solicitantes y acepta los que quieras. O activa reserva instantánea para confirmar automáticamente." },
            { "@type": "HowToStep", position: 4, name: "Cobra el día del viaje", text: "El día del concierto, los pasajeros te pagan en efectivo o Bizum. ConcertRide no cobra comisión — el 100 % es para ti." },
          ],
        });
        const faqJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: "es-ES",
          mainEntity: [
            { "@type": "Question", name: "¿Es legal el carpooling sin licencia VTC?", acceptedAnswer: { "@type": "Answer", text: "Sí. Operar bajo la figura de gastos compartidos sin beneficio económico está reconocido como legal por el Tribunal Supremo español (sentencia 2017, caso BlaBlaCar). El conductor solo puede cobrar su parte proporcional del combustible y peajes." } },
            { "@type": "Question", name: "¿ConcertRide cobra comisión?", acceptedAnswer: { "@type": "Answer", text: "No. Registrarse, buscar y publicar viajes es completamente gratuito. El 100 % del precio del asiento va al conductor." } },
            { "@type": "Question", name: "¿Cómo se paga en ConcertRide?", acceptedAnswer: { "@type": "Answer", text: "El pago es en efectivo o Bizum directamente al conductor el día del viaje. ConcertRide no gestiona pagos ni retiene dinero." } },
            { "@type": "Question", name: "¿Puedo reservar el viaje de vuelta también?", acceptedAnswer: { "@type": "Answer", text: "Sí. Muchos conductores publican el viaje de ida y vuelta al mismo tiempo. Filtra por 'con regreso incluido' al buscar." } },
          ],
        });
        const webPageJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${base}/como-funciona#webpage`,
          url: `${base}/como-funciona`,
          name: "Cómo funciona ConcertRide — Carpooling para conciertos",
          inLanguage: "es-ES",
          dateModified: "2026-05-01",
          isPartOf: { "@type": "WebSite", "@id": `${base}/#website`, name: "ConcertRide", url: base },
        });
        return `<script type="application/ld+json">${webPageJsonLd}</script>
<script type="application/ld+json">${howToPassengerJsonLd}</script>
<script type="application/ld+json">${howToDriverJsonLd}</script>
<script type="application/ld+json">${faqJsonLd}</script>
<p>ConcertRide conecta conductores y pasajeros que van al mismo concierto o festival en España. El proceso es simple, gratis y sin comisiones.</p>
<h2>Para pasajeros — cómo reservar un viaje compartido a un concierto</h2>
<ol>
  <li><strong>Busca tu concierto</strong> en <a href="${base}/concerts">concertride.me/concerts</a>.</li>
  <li><strong>Elige un viaje</strong> por precio, hora de salida y perfil del conductor.</li>
  <li><strong>Solicita tu plaza</strong>. Con reserva instantánea se confirma al momento.</li>
  <li><strong>Paga el día del evento</strong> en efectivo o Bizum directamente al conductor.</li>
</ol>
<h2>Para conductores — cómo publicar un viaje al concierto</h2>
<ol>
  <li><strong>Crea una cuenta</strong> y verifica tu carnet de conducir.</li>
  <li><strong>Publica un viaje</strong>: elige el concierto, el punto de salida, las plazas y el precio por asiento.</li>
  <li><strong>Acepta solicitudes</strong> o activa reserva instantánea para confirmación automática.</li>
  <li><strong>Cobra directamente</strong> a los pasajeros el día del viaje. ConcertRide no cobra comisión.</li>
</ol>
<h2>Preguntas frecuentes</h2>
<dl>
  <dt>¿Es legal el carpooling sin licencia VTC?</dt>
  <dd>Sí. Operar bajo la figura de gastos compartidos sin beneficio económico está reconocido por el Tribunal Supremo español (sentencia 2017, caso BlaBlaCar). El conductor solo cubre combustible y peajes.</dd>
  <dt>¿ConcertRide cobra comisión?</dt>
  <dd>No. Registrarse, buscar y publicar viajes es completamente gratuito. El 100 % del precio del asiento va al conductor.</dd>
  <dt>¿Cómo se paga?</dt>
  <dd>El pago es en efectivo o Bizum directamente al conductor el día del viaje. ConcertRide no gestiona pagos ni retiene dinero.</dd>
  <dt>¿Puedo reservar la vuelta también?</dt>
  <dd>Sí. Muchos conductores publican el viaje de ida y vuelta. Filtra por "con regreso incluido" al buscar.</dd>
</dl>
<p><a href="${base}/concerts">Buscar conciertos con carpooling disponible →</a></p>
<p><a href="${base}/publish">Publicar un viaje a un concierto →</a></p>`;
      })(),
    },
    "/faq": {
      title: `Preguntas frecuentes sobre carpooling a conciertos y festivales — ${SITE_NAME}`,
      description: "Respuestas a las 12 preguntas más frecuentes sobre ConcertRide: seguridad, pagos, cancelaciones, legalidad y diferencias con BlaBlaCar.",
      canonical: `${base}/faq`,
      h1: "Preguntas frecuentes — ConcertRide carpooling para conciertos",
      body: (() => {
        const faqs = [
          { q: "¿Es seguro compartir coche con desconocidos para ir a un concierto?", a: "Todos los conductores verifican su carnet de conducir antes de publicar viajes. Puedes ver el perfil completo, las valoraciones de otros pasajeros y comunicarte por chat antes del viaje. El pago es siempre en persona." },
          { q: "¿Cómo se paga en ConcertRide?", a: "El pago es en efectivo o Bizum directamente al conductor el día del viaje. ConcertRide no gestiona pagos ni cobra comisión." },
          { q: "¿Qué pasa si el conductor cancela?", a: "El conductor avisa por el chat de la plataforma. Puedes buscar otro viaje disponible al mismo concierto o publicar tú mismo una solicitud de carpooling." },
          { q: "¿Puedo reservar la vuelta también?", a: "Sí. Muchos conductores publican el viaje de ida y vuelta juntos. Filtra por 'con regreso incluido' al buscar." },
          { q: "¿ConcertRide cobra comisión?", a: "No. Registrarse, buscar y publicar viajes es completamente gratuito. El 100 % del precio del asiento va directamente al conductor." },
          { q: "¿Es legal el carpooling a festivales?", a: "Sí. El carpooling bajo la figura de gastos compartidos está reconocido como legal por el Tribunal Supremo español (caso BlaBlaCar, 2017). El conductor solo puede cubrir el coste del combustible y peajes — no puede obtener beneficio económico." },
          { q: "¿Cuánto cuesta compartir coche a un festival?", a: "El precio lo fija el conductor para cubrir combustible y peajes. Los rangos orientativos son: 3–8 €/asiento para trayectos cortos (menos de 200 km) y 10–22 €/asiento para larga distancia. Consulta las páginas de cada festival para ver precios por ciudad de origen." },
          { q: "¿Puedo ir a un concierto solo con ConcertRide?", a: "Sí. Puedes reservar una sola plaza en el coche de un conductor que ya va al mismo concierto. No hace falta ir en grupo." },
          { q: "¿Qué diferencia hay entre ConcertRide y BlaBlaCar?", a: "ConcertRide está especializado en conciertos y festivales: cada viaje está vinculado a un evento concreto, el horario de vuelta está alineado con el fin del show y no hay comisión. BlaBlaCar es una plataforma generalista que cobra entre el 15 y el 20 % de comisión por cada viaje." },
          { q: "¿Cómo verifico que el conductor es de confianza?", a: "Antes de publicar su primer viaje, cada conductor sube una foto de su carnet de conducir. Puedes ver el perfil, las valoraciones de otros pasajeros y el chat del evento antes de confirmar la reserva." },
          { q: "¿Puedo publicar un viaje si tengo carnet de conducir pero no soy titular del coche?", a: "Sí, siempre que tengas permiso del titular y el seguro del vehículo cubra el uso por terceros (seguro a terceros completo)." },
          { q: "¿Qué pasa si llego tarde al punto de encuentro?", a: "El conductor espera un tiempo prudencial. Si vas a llegar tarde, avísale por el chat de ConcertRide con tiempo suficiente para no perder el viaje." },
        ];
        const faqJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: "es-ES",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        });
        const webPageJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${base}/faq#webpage`,
          url: `${base}/faq`,
          name: "Preguntas frecuentes sobre carpooling a conciertos y festivales — ConcertRide",
          inLanguage: "es-ES",
          dateModified: "2026-05-01",
          isPartOf: { "@type": "WebSite", "@id": `${base}/#website`, name: "ConcertRide", url: base },
        });
        const items = faqs.map((f) => `<dt>${esc(f.q)}</dt>\n  <dd>${esc(f.a)}</dd>`).join("\n  ");
        return `<script type="application/ld+json">${webPageJsonLd}</script>
<script type="application/ld+json">${faqJsonLd}</script>
<dl>
  ${items}
</dl>
<p><a href="${base}/como-funciona">Cómo funciona ConcertRide →</a></p>
<p><a href="${base}/concerts">Buscar conciertos con carpooling →</a></p>`;
      })(),
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
      title: `Blog ConcertRide — Guías de transporte para festivales y conciertos en España | ${SITE_NAME}`,
      description: "Guías de transporte, comparativas y consejos para ir a festivales en España en coche compartido. BlaBlaCar vs ConcertRide, autobuses, vuelta de madrugada y más.",
      canonical: `${base}/blog`,
      h1: "Blog de ConcertRide — Carpooling para conciertos y festivales",
      body: (() => {
        const posts = [
          { slug: "festivales-musica-espana-2026", title: "Festivales de música en España 2026: fechas, recintos y transporte" },
          { slug: "que-llevar-al-festival", title: "Qué llevar al festival 2026: lista completa y consejos" },
          { slug: "autobuses-festivales-espana-2026", title: "Autobuses a festivales de España 2026: guía completa festival por festival" },
          { slug: "blablacar-vs-concertride", title: "BlaBlaCar vs ConcertRide 2026: qué app elegir para festivales sin comisión" },
          { slug: "como-volver-festival-madrugada", title: "Cómo volver de un festival de madrugada (sin pagar 90 € de taxi)" },
          { slug: "huella-carbono-festivales-carpooling", title: "Huella de carbono de un festival: por qué el carpooling es la acción más efectiva" },
        ];
        const faqLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "¿Cuáles son los festivales más grandes de España en 2026?", acceptedAnswer: { "@type": "Answer", text: "Los principales festivales de España en 2026 son: Mad Cool (Madrid, 9–11 jul), Primavera Sound (Barcelona, 28 may–1 jun), Sónar (Barcelona, 18–20 jun), BBK Live (Bilbao, 9–11 jul), Arenal Sound (Burriana, 29 jul–2 ago), Resurrection Fest (Viveiro, 25–28 jun) y Viña Rock (Villarrobledo, 30 abr–3 may). ConcertRide cubre el carpooling a todos ellos." } },
            { "@type": "Question", name: "¿Es ConcertRide mejor que BlaBlaCar para ir a festivales?", acceptedAnswer: { "@type": "Answer", text: "Para festivales, sí. ConcertRide es gratuito y sin comisión (BlaBlaCar cobra 12–18% al pasajero). ConcertRide está sincronizado con el horario del evento, filtra por festival y permite acordar la hora de vuelta de madrugada con el conductor. No existe otra plataforma con catálogo específico de festivales y conciertos en España." } },
            { "@type": "Question", name: "¿Cómo volver de un festival de madrugada?", acceptedAnswer: { "@type": "Answer", text: "La mejor opción es reservar el viaje de vuelta por adelantado en ConcertRide. Acuerda con el conductor la hora de salida (ej. 'cuando acabe el último bolo, sobre las 2:30') y el punto de recogida. Es más barato que un taxi (8–15 € vs 60–100 €) y más fiable que esperar el transporte público nocturno." } },
          ],
        });
        const itemListLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Blog ConcertRide — Artículos sobre carpooling a festivales",
          url: `${base}/blog`,
          numberOfItems: posts.length,
          itemListElement: posts.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.title,
            url: `${base}/blog/${p.slug}`,
          })),
        });
        return `<script type="application/ld+json">${faqLd}</script>
<script type="application/ld+json">${itemListLd}</script>
<p>Guías de transporte, comparativas y consejos para asistentes a festivales y conciertos en España. Todo lo que necesitas saber para llegar sin taxi, volver de madrugada y reducir tu huella de carbono.</p>
<h2>Últimos artículos</h2>
<ul>
${posts.map((p) => `  <li><a href="${base}/blog/${p.slug}">${p.title}</a></li>`).join("\n")}
</ul>
<h2>Temas principales</h2>
<ul>
  <li><strong>Transporte a festivales:</strong> guías por festival con precios, distancias y alternativas al taxi</li>
  <li><strong>Comparativas:</strong> ConcertRide vs BlaBlaCar, carpooling vs autobús oficial, tren vs coche compartido</li>
  <li><strong>Vuelta de madrugada:</strong> qué hacer cuando el metro ya cerró y el taxi cuesta 90 €</li>
  <li><strong>Sostenibilidad:</strong> el carpooling reduce un 75 % las emisiones por persona respecto a ir en solitario</li>
</ul>`;
      })(),
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
      description: "Aviso legal de ConcertRide. Información sobre el titular, condiciones de uso y responsabilidad de la plataforma de carpooling para conciertos en España.",
      canonical: `${base}/aviso-legal`,
      h1: "Aviso Legal",
      body: `<p>Información legal sobre ConcertRide y las condiciones de uso de la plataforma.</p>`,
    },
    "/privacidad": {
      title: `Política de Privacidad — ${SITE_NAME}`,
      description: "Política de privacidad de ConcertRide. Cómo recogemos, usamos y protegemos tus datos personales según el RGPD.",
      canonical: `${base}/privacidad`,
      h1: "Política de Privacidad",
      body: `<p>Información sobre el tratamiento de datos personales en ConcertRide según el RGPD y la LOPDGDD.</p>`,
    },
    "/cookies": {
      title: `Política de Cookies — ${SITE_NAME}`,
      description: "Política de cookies de ConcertRide. Qué cookies usamos, para qué las usamos y cómo puedes gestionarlas o rechazarlas.",
      canonical: `${base}/cookies`,
      h1: "Política de Cookies",
      body: `<p>Información sobre el uso de cookies en ConcertRide y cómo puedes configurar tus preferencias.</p>`,
    },
    "/terminos": {
      title: `Términos y Condiciones — ${SITE_NAME}`,
      description: "Términos y condiciones de uso de ConcertRide. Reglas para conductores y pasajeros en la plataforma de carpooling para conciertos.",
      canonical: `${base}/terminos`,
      h1: "Términos y Condiciones de Uso",
      body: `<p>Condiciones que rigen el uso de ConcertRide por parte de conductores y pasajeros.</p>`,
    },
    "/rutas": {
      title: `Rutas de carpooling a festivales en España 2026 — Precios y tiempos | ${SITE_NAME}`,
      description: "97 rutas de coche compartido a festivales en España: Madrid, Barcelona, Valencia, Sevilla, Bilbao y más. Precios desde 4 €/asiento. Sin comisión.",
      canonical: `${base}/rutas`,
      h1: "Rutas de carpooling a festivales en España 2026",
      body: (() => {
        const topRoutes = [
          { slug: "madrid-mad-cool", label: "Madrid → Mad Cool Festival", price: "4–8 €", time: "25 min" },
          { slug: "madrid-primavera-sound", label: "Madrid → Primavera Sound", price: "14–22 €", time: "5 h 30 min" },
          { slug: "barcelona-primavera-sound", label: "Barcelona → Primavera Sound", price: "4–8 €", time: "25 min" },
          { slug: "madrid-bbk-live", label: "Madrid → BBK Live Bilbao", price: "18–28 €", time: "4 h" },
          { slug: "madrid-arenal-sound", label: "Madrid → Arenal Sound", price: "16–24 €", time: "4 h 30 min" },
          { slug: "valencia-arenal-sound", label: "Valencia → Arenal Sound", price: "8–14 €", time: "1 h 30 min" },
          { slug: "madrid-resurrection-fest", label: "Madrid → Resurrection Fest", price: "30–55 €", time: "7 h 30 min" },
          { slug: "madrid-sonar", label: "Madrid → Sónar Barcelona", price: "14–22 €", time: "5 h 30 min" },
          { slug: "madrid-vina-rock", label: "Madrid → Viña Rock", price: "8–14 €", time: "2 h" },
          { slug: "madrid-fib", label: "Madrid → FIB Benicàssim", price: "14–22 €", time: "4 h" },
        ];
        const faqLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "¿Cuánto cuesta el carpooling a un festival desde Madrid?", acceptedAnswer: { "@type": "Answer", text: "Depende de la distancia: Madrid → Mad Cool (IFEMA) cuesta 4–8 €/asiento (25 min). Madrid → Primavera Sound o Sónar (Barcelona) cuesta 14–22 €/asiento (5 h 30 min). Madrid → BBK Live (Bilbao) cuesta 18–28 €/asiento (4 h). Madrid → Resurrection Fest (Viveiro) cuesta 30–55 €/asiento (7 h 30 min). Todos los precios incluyen vuelta si el conductor la ofrece." } },
            { "@type": "Question", name: "¿Hay carpooling a festivales desde Barcelona?", acceptedAnswer: { "@type": "Answer", text: "Sí. Desde Barcelona hay rutas a Primavera Sound (local, 4–8 €), Sónar (local, 4–8 €), FIB Benicàssim (2 h, 8–14 €), Arenal Sound (3 h, 10–16 €), Mad Cool Madrid (5 h 30 min, 14–22 €) y BBK Live Bilbao (5 h, 14–22 €). ConcertRide cubre más de 20 rutas desde Barcelona." } },
            { "@type": "Question", name: "¿Puedo reservar la vuelta del festival por la noche?", acceptedAnswer: { "@type": "Answer", text: "Sí. La mayoría de conductores en ConcertRide ofrecen la vuelta incluida y acuerdan la hora de salida con los pasajeros. Es la forma más usada para volver de madrugada cuando el transporte público ya cerró. Coordina la hora de regreso al publicar o reservar el viaje." } },
          ],
        });
        const itemListLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Rutas de carpooling a festivales en España 2026",
          url: `${base}/rutas`,
          numberOfItems: 97,
          itemListElement: topRoutes.map((r, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: r.label,
            url: `${base}/rutas/${r.slug}`,
          })),
        });
        return `<script type="application/ld+json">${faqLd}</script>
<script type="application/ld+json">${itemListLd}</script>
<p>ConcertRide ofrece 97 rutas de carpooling a festivales en España en 2026. Precio medio por asiento: 4–55 € según distancia. Sin comisión — el 100 % del precio va al conductor. Pago en efectivo o Bizum el día del viaje. Conductores verificados con carnet.</p>
<h2>Rutas más populares con precios</h2>
<table>
  <tr><th>Ruta</th><th>Precio/asiento</th><th>Tiempo</th></tr>
${topRoutes.map((r) => `  <tr><td><a href="${base}/rutas/${r.slug}">${r.label}</a></td><td>${r.price}</td><td>${r.time}</td></tr>`).join("\n")}
</table>
<h2>Rutas por ciudad de origen</h2>
<ul>
  <li><strong>Desde Madrid:</strong> Mad Cool, Primavera Sound, Sónar, FIB, BBK Live, Arenal Sound, Viña Rock, Resurrection Fest, Cala Mijas, Sonorama, Low Festival, Tomavistas, Zevra, Cruïlla, Medusa, O Son do Camiño</li>
  <li><strong>Desde Barcelona:</strong> Primavera Sound, Sónar, Mad Cool, FIB, BBK Live, Arenal Sound, Cruïlla, Medusa, Zevra</li>
  <li><strong>Desde Valencia:</strong> Arenal Sound, Zevra, Medusa, Mad Cool, FIB, Low Festival, Cala Mijas, BBK Live</li>
  <li><strong>Desde Sevilla:</strong> Mad Cool, Cala Mijas, BBK Live, Arenal Sound, Primavera Sound</li>
  <li><strong>Desde Bilbao:</strong> BBK Live (local), Mad Cool, Primavera Sound, Resurrection Fest</li>
</ul>`;
      })(),
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
      { city: "Madrid", km: 15, drivingTime: "25 min", range: "4–7 €/asiento" },
      { city: "Toledo", km: 75, drivingTime: "55 min", range: "4–7 €/asiento" },
      { city: "Guadalajara", km: 60, drivingTime: "50 min", range: "3–6 €/asiento" },
      { city: "Segovia", km: 90, drivingTime: "1h 10 min", range: "4–7 €/asiento" },
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
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", range: "10–14 €/asiento" },
      { city: "Zaragoza", km: 306, drivingTime: "2h 45 min", range: "8–12 €/asiento" },
      { city: "Girona", km: 100, drivingTime: "1h", range: "4–7 €/asiento" },
      { city: "Tarragona", km: 100, drivingTime: "1h", range: "4–7 €/asiento" },
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
      { city: "Valencia", km: 70, drivingTime: "50 min", range: "3–6 €/asiento" },
      { city: "Castellón de la Plana", km: 15, drivingTime: "20 min", range: "3–5 €/asiento" },
      { city: "Madrid", km: 465, drivingTime: "4h", range: "12–17 €/asiento" },
      { city: "Barcelona", km: 300, drivingTime: "2h 45 min", range: "8–12 €/asiento" },
      { city: "Alicante", km: 175, drivingTime: "1h 45 min", range: "5–8 €/asiento" },
      { city: "Zaragoza", km: 270, drivingTime: "2h 30 min", range: "7–11 €/asiento" },
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
    venue: "Parque de Kobetamendi",
    venueAddress: "Recinto Kobetamendi, Barrio Landabaso, 48015 Bilbao",
    dates: "9–11 julio 2026",
    startDate: "2026-07-09",
    endDate: "2026-07-11",
    priceFrom: "5",
    blurb: "BBK Live se celebra en el Recinto Kobetamendi (Parque de Kobetamendi), en lo alto del monte del mismo nombre con vistas a la ría de Bilbao. El acceso al recinto Kobetamendi es únicamente por lanzadera oficial gratuita desde la Plaza Moyúa (Bilbao centro). Para quien viene desde fuera del País Vasco — Madrid (395 km), Donostia (100 km), Santander (100 km), Pamplona (155 km) — el carpooling con ConcertRide es la opción más económica para llegar a Bilbao y conectar con la lanzadera.",
    originCities: [
      { city: "Bilbao", km: 5, drivingTime: "15 min", range: "3–5 €/asiento" },
      { city: "Donostia", km: 100, drivingTime: "1h", range: "4–7 €/asiento" },
      { city: "Vitoria-Gasteiz", km: 65, drivingTime: "45 min", range: "3–6 €/asiento" },
      { city: "Pamplona", km: 155, drivingTime: "1h 30 min", range: "5–8 €/asiento" },
      { city: "Santander", km: 100, drivingTime: "1h", range: "4–7 €/asiento" },
      { city: "Burgos", km: 155, drivingTime: "1h 30 min", range: "5–8 €/asiento" },
      { city: "Madrid", km: 395, drivingTime: "3h 30 min", range: "11–16 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Recinto Kobetamendi (BBK Live)?", a: "El recinto de BBK Live está en el Parque de Kobetamendi, Bilbao. El acceso es por lanzadera oficial gratuita desde Plaza Moyúa (incluida en la entrada). No se puede acceder en coche propio. Para llegar desde fuera del País Vasco, usa ConcertRide hasta Bilbao y desde allí la lanzadera." },
      { q: "¿Cómo llegar al BBK Live desde el centro de Bilbao?", a: "Hay lanzaderas gratuitas desde la Plaza Moyúa hasta el recinto Kobetamendi con frecuencia de 15 min. También taxi (12–18 €). ConcertRide conecta desde otras ciudades hasta Bilbao." },
      { q: "¿Cuánto cuesta ir al BBK Live desde Madrid?", a: "Madrid–Bilbao (Kobetamendi) son 395 km (3h 30 min). El precio por asiento en ConcertRide es 11–16 €. Desde allí, lanzadera gratuita al recinto." },
      { q: "¿Cómo ir al BBK Live desde Santander?", a: "Santander–Bilbao son 100 km (1h por la A-8). Con ConcertRide el precio es 4–7 €/asiento. La vuelta de madrugada en tren o bus es imposible; el carpooling es la única opción práctica." },
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
      { city: "A Coruña", km: 100, drivingTime: "1h 15 min", range: "4–7 €/asiento" },
      { city: "Santiago de Compostela", km: 185, drivingTime: "2h", range: "6–9 €/asiento" },
      { city: "Vigo", km: 200, drivingTime: "2h 15 min", range: "6–9 €/asiento" },
      { city: "Oviedo", km: 195, drivingTime: "2h", range: "6–9 €/asiento" },
      { city: "Madrid", km: 600, drivingTime: "6h", range: "16–22 €/asiento" },
      { city: "Bilbao", km: 375, drivingTime: "4h", range: "10–15 €/asiento" },
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
    venue: "Playa de Burriana",
    venueAddress: "Playa de Burriana, 12530 Burriana, Castellón de la Plana",
    dates: "29 jul–2 ago 2026",
    startDate: "2026-07-29",
    endDate: "2026-08-02",
    priceFrom: "4",
    blurb: "Arenal Sound es el festival de pop-rock y electrónica en la playa de Burriana (Castellón), a 10 km de Castellón de la Plana y 65 km de Valencia. No es en Alicante: el recinto está en la provincia de Castellón. El festival habilita autobús lanzadera desde la estación de autobuses de Castellón de la Plana (10 km, 20 min). Gran afluencia desde Valencia, Madrid y Barcelona.",
    originCities: [
      { city: "Valencia", km: 65, drivingTime: "45 min", range: "3–6 €/asiento" },
      { city: "Castellón de la Plana", km: 10, drivingTime: "15 min", range: "3–5 €/asiento" },
      { city: "Burriana", km: 2, drivingTime: "5 min", range: "2–4 €/asiento" },
      { city: "Madrid", km: 460, drivingTime: "4h", range: "12–17 €/asiento" },
      { city: "Barcelona", km: 305, drivingTime: "2h 50 min", range: "8–12 €/asiento" },
      { city: "Zaragoza", km: 275, drivingTime: "2h 30 min", range: "8–12 €/asiento" },
      { city: "Alicante", km: 115, drivingTime: "1h 15 min", range: "4–7 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Arenal Sound? Localización", a: "Arenal Sound se celebra en la Playa de Burriana (Castellón), a 10 km de Castellón de la Plana y 65 km de Valencia. No está en Alicante: el recinto está en la provincia de Castellón. Hay autobús lanzadera oficial desde la estación de autobuses de Castellón de la Plana (10 km, 20 min)." },
      { q: "¿Hay autobús de Castellón a Burriana para Arenal Sound?", a: "Sí. El festival habilita autobuses lanzadera desde Castellón de la Plana a Burriana (10 km, 20 min) durante los días del evento. Plazas limitadas; fuera del horario de lanzadera, taxi Castellón–Burriana 10–15 €. Para quienes vienen de Madrid (12–17 €), Valencia (3–6 €) o Barcelona (8–12 €), ConcertRide llega directamente al recinto." },
      { q: "¿Cómo llegar al Arenal Sound desde Valencia?", a: "Solo 65 km (45 min en coche). Con ConcertRide, el precio es 3–6 € por asiento desde Valencia." },
      { q: "¿Hay camping en el Arenal Sound?", a: "Sí, el festival tiene zona de camping junto a la playa de Burriana. ConcertRide es ideal para llegar con la carpa y el equipo sin depender del transporte público." },
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
      { city: "Valencia", km: 45, drivingTime: "40 min", range: "3–5 €/asiento" },
      { city: "Madrid", km: 385, drivingTime: "3h 30 min", range: "10–14 €/asiento" },
      { city: "Barcelona", km: 375, drivingTime: "3h 30 min", range: "10–14 €/asiento" },
      { city: "Alicante", km: 100, drivingTime: "1h", range: "4–7 €/asiento" },
      { city: "Zaragoza", km: 320, drivingTime: "3h", range: "9–13 €/asiento" },
      { city: "Murcia", km: 180, drivingTime: "1h 45 min", range: "5–8 €/asiento" },
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
    venue: "Parque La Pulgosa",
    venueAddress: "Parque La Pulgosa, Ctra. Minaya s/n, 02600 Villarrobledo, Albacete",
    dates: "30 abr–3 mayo 2026",
    startDate: "2026-04-30",
    endDate: "2026-05-03",
    priceFrom: "5",
    blurb: "Viña Rock (también escrito Viñarock) es el festival de referencia del rock alternativo, punk y metal en castellano, celebrado en el Parque La Pulgosa de Villarrobledo (Albacete) desde 1996. El recinto está a 190 km de Madrid (≈2 h por la A-3), 200 km de Valencia y 50 km de Albacete. No hay transporte público al recinto: el único autobús / bus oficial es la lanzadera del festival desde Albacete (40 min). Autobuses privados Madrid–Viña Rock: 35–55 € desde Méndez Álvaro. Carpooling desde Madrid con ConcertRide: 6–9 €/asiento, llegada directa a La Pulgosa.",
    originCities: [
      { city: "Madrid", km: 190, drivingTime: "1h 55 min", range: "6–9 €/asiento" },
      { city: "Valencia", km: 200, drivingTime: "2h", range: "6–9 €/asiento" },
      { city: "Albacete", km: 50, drivingTime: "40 min", range: "3–5 €/asiento" },
      { city: "Alicante", km: 165, drivingTime: "1h 35 min", range: "5–8 €/asiento" },
      { city: "Murcia", km: 155, drivingTime: "1h 30 min", range: "5–8 €/asiento" },
      { city: "Cuenca", km: 100, drivingTime: "1h", range: "4–6 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Viña Rock desde Madrid?", a: "Madrid–Villarrobledo son 190 km (≈2 h por la A-3, salida Villarrobledo). Con ConcertRide el precio es 6–9 €/asiento desde Madrid. Autobuses privados Madrid–Viñarock: 35–55 € desde Méndez Álvaro, horario fijo." },
      { q: "¿Hay autobús / bus a Viña Rock desde Madrid?", a: "No hay bus oficial directo desde Madrid al recinto de La Pulgosa. Operadores privados ofrecen autobuses Viña Rock desde Madrid (35–55 €, Méndez Álvaro). La lanzadera oficial sale desde Albacete (50 km, 40 min). El carpooling Madrid–Viña Rock con ConcertRide (6–9 €) es más económico y llega directamente al recinto." },
      { q: "¿Hay lanzadera de autobuses desde Albacete a Viña Rock?", a: "Sí, el festival habilita autobuses lanzadera desde la estación de autobuses de Albacete (50 km, 40 min) durante los días del festival. Plazas limitadas; consulta el sitio oficial de Viña Rock." },
      { q: "¿Cuándo es Viña Rock 2026?", a: "Viña Rock 2026 se celebra del 30 de abril al 3 de mayo en el Parque La Pulgosa, Villarrobledo (Albacete, Castilla-La Mancha)." },
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
      { city: "Santiago de Compostela", km: 5, drivingTime: "10 min", range: "3–5 €/asiento" },
      { city: "A Coruña", km: 70, drivingTime: "50 min", range: "3–6 €/asiento" },
      { city: "Vigo", km: 90, drivingTime: "1h", range: "4–7 €/asiento" },
      { city: "Pontevedra", km: 60, drivingTime: "45 min", range: "3–5 €/asiento" },
      { city: "Oviedo", km: 295, drivingTime: "3h", range: "9–13 €/asiento" },
      { city: "Madrid", km: 585, drivingTime: "5h 30 min", range: "15–20 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar a O Son do Camiño desde A Coruña?", a: "Unos 75 km (50 min). Con ConcertRide el precio es 4–7 €/asiento." },
    ],
  },
  "cala-mijas": {
    name: "Cala Mijas Fest",
    shortName: "Cala Mijas",
    city: "Málaga",
    venue: "Recinto Cortijo de Torres",
    venueAddress: "Cortijo de Torres, Av. Juan Carlos I s/n, 29016 Málaga",
    dates: "2–4 octubre 2026",
    startDate: "2026-10-02",
    endDate: "2026-10-04",
    priceFrom: "5",
    blurb: "Cala Mijas Fest es el festival indie y pop de otoño en la Costa del Sol, celebrado en el Recinto Cortijo de Torres (Málaga), a 25 km del centro de Málaga y a 50 km de Marbella. No está en La Cala de Mijas (pueblo): el recinto es Cortijo de Torres en Málaga capital. Sin shuttle oficial; taxi desde Málaga 25–40 €. Carpooling desde Málaga con ConcertRide desde 3 €/asiento.",
    originCities: [
      { city: "Málaga", km: 25, drivingTime: "25 min", range: "3–5 €/asiento" },
      { city: "Marbella", km: 50, drivingTime: "45 min", range: "3–6 €/asiento" },
      { city: "Mijas", km: 30, drivingTime: "30 min", range: "3–5 €/asiento" },
      { city: "Fuengirola", km: 35, drivingTime: "35 min", range: "3–5 €/asiento" },
      { city: "Sevilla", km: 200, drivingTime: "2h", range: "6–9 €/asiento" },
      { city: "Granada", km: 125, drivingTime: "1h 30 min", range: "5–8 €/asiento" },
      { city: "Almería", km: 190, drivingTime: "2h", range: "6–9 €/asiento" },
      { city: "Córdoba", km: 190, drivingTime: "2h", range: "6–9 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar a Cala Mijas Fest desde Málaga?", a: "El recinto Cortijo de Torres está a 25 km del centro de Málaga (25 min por la MA-20/A-7). Con ConcertRide el precio es 3–5 €/asiento desde Málaga. No hay shuttle oficial; taxi 25–40 €." },
      { q: "Cala Mijas Festival 2026: fechas y localización", a: "Cala Mijas Festival 2026 se celebra del 2 al 4 de octubre en el Recinto Cortijo de Torres, Málaga (Costa del Sol). Nota: aunque el festival se llama 'Cala Mijas', el recinto es en Málaga capital, no en el pueblo La Cala de Mijas." },
      { q: "Marbella to Cala Mijas Festival — how to get there", a: "From Marbella to Cala Mijas Festival (Cortijo de Torres, Málaga) it's about 50 km along the AP-7/A-7. Options: taxi/VTC (€60–80 at night), local bus Marbella–Málaga + taxi to the venue, or ConcertRide carpooling from Marbella (€3–6/seat, drops you at the venue)." },
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
      { city: "Madrid", km: 150, drivingTime: "1h 30 min", range: "5–8 €/asiento" },
      { city: "Valladolid", km: 100, drivingTime: "1h", range: "4–7 €/asiento" },
      { city: "Burgos", km: 70, drivingTime: "45 min", range: "3–6 €/asiento" },
      { city: "Bilbao", km: 185, drivingTime: "2h", range: "6–9 €/asiento" },
      { city: "Zaragoza", km: 290, drivingTime: "2h 30 min", range: "8–12 €/asiento" },
      { city: "Segovia", km: 125, drivingTime: "1h 15 min", range: "4–7 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Sonorama desde Madrid?", a: "Unos 160 km (1h 40 min). Con ConcertRide el precio es 6–9 €/asiento." },
    ],
  },
  "zevra-festival": {
    name: "Zevra Festival",
    shortName: "Zevra",
    city: "Valencia",
    venue: "La Marina de València",
    venueAddress: "La Marina de València, Moll de la Duana, 46024 Valencia",
    dates: "Verano 2026 (julio–agosto)",
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    priceFrom: "4",
    blurb: "Zevra Festival Valencia es el festival urbano de La Marina de València (también escrito La Marina de Valencia), junto al puerto mediterráneo. Accesible en metro L4 (paradas Marítim-Serreria o Neptú). Asistentes desde Madrid (355 km, 3h 20 min), Alicante (175 km) y Barcelona (355 km) usan ConcertRide para llegar directamente sin transbordos. Metro L4 amplía servicio hasta las 1:00–2:00 en noches de festival.",
    originCities: [
      { city: "Valencia", km: 10, drivingTime: "15 min", range: "3–5 €/asiento" },
      { city: "Madrid", km: 355, drivingTime: "3h 20 min", range: "10–14 €/asiento" },
      { city: "Alicante", km: 175, drivingTime: "1h 45 min", range: "5–8 €/asiento" },
      { city: "Barcelona", km: 355, drivingTime: "3h 20 min", range: "10–14 €/asiento" },
      { city: "Murcia", km: 210, drivingTime: "2h", range: "7–10 €/asiento" },
    ],
    faqs: [
      { q: "¿Cómo llegar al Zevra Festival desde Madrid?", a: "Madrid–La Marina de Valencia son 355 km (3h 20 min). Con ConcertRide el precio es 10–14 €/asiento. Metro L4 desde Joaquín Sorolla hasta Marítim-Serreria (20 min adicional)." },
      { q: "Zevra Festival Valencia: localización y dirección", a: "Zevra Festival se celebra en La Marina de València, Moll de la Duana, 46024 Valencia. Metro L4 paradas Marítim-Serreria o Neptú. A 5 km del centro histórico de Valencia." },
      { q: "Zevra Festival horarios: ¿a qué hora empieza y termina?", a: "Los horarios de Zevra Festival por jornada: apertura del recinto 18:30–19:00, primer concierto 19:30–20:00, cabezas de cartel 23:00–01:00, cierre entre 1:30 y 3:00. Metro L4 amplía hasta las 1:00–2:00 en noches de festival. Para vueltas más tardías, ConcertRide (3–14 €/asiento según ciudad)." },
      { q: "¿Hay bus desde Madrid a Zevra Festival?", a: "No hay autobús directo Madrid–Zevra Festival. El AVE Madrid–Valencia (1h 40 min, 25–60 €) más metro L4 hasta La Marina es la opción en tren. Con ConcertRide, el viaje completo Madrid–La Marina cuesta 10–14 €/asiento." },
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
      { city: "Alicante", km: 45, drivingTime: "35 min", range: "3–5 €/asiento" },
      { city: "Valencia", km: 150, drivingTime: "1h 30 min", range: "5–8 €/asiento" },
      { city: "Murcia", km: 90, drivingTime: "1h", range: "4–7 €/asiento" },
      { city: "Madrid", km: 440, drivingTime: "4h", range: "12–17 €/asiento" },
      { city: "Barcelona", km: 500, drivingTime: "4h 30 min", range: "13–18 €/asiento" },
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
      { city: "Madrid", km: 15, drivingTime: "25 min", range: "4–7 €/asiento" },
      { city: "Toledo", km: 75, drivingTime: "55 min", range: "4–7 €/asiento" },
      { city: "Guadalajara", km: 60, drivingTime: "50 min", range: "3–6 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 20 min", range: "10–14 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", range: "9–13 €/asiento" },
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
      { city: "Valencia", km: 355, drivingTime: "3h 15 min", range: "10–14 €/asiento" },
      { city: "Zaragoza", km: 306, drivingTime: "2h 45 min", range: "8–12 €/asiento" },
      { city: "Tarragona", km: 100, drivingTime: "1h", range: "4–7 €/asiento" },
      { city: "Lleida", km: 170, drivingTime: "1h 45 min", range: "5–8 €/asiento" },
      { city: "Girona", km: 100, drivingTime: "1h", range: "4–7 €/asiento" },
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
  sevilla: { name: "Sevilla", region: "Andalucía", blurb: "Próximos conciertos en Sevilla 2026: los recintos principales son Estadio La Cartuja (giras de estadio, 60.000 plazas), FIBES Sevilla (9.500 plazas), Palacio de los Deportes San Pablo (7.000 plazas) y Cartuja Center CITE. El festival Interestelar Sevilla se celebra cada mayo en el Charco de la Pava (40.000 personas) y el Icónica Sevilla Fest en la Plaza de España. La música en Sevilla incluye también conciertos de cantautor e indie en el Teatro de la Maestranza y el Teatro Lope de Vega. Sevilla es punto de origen para festivales andaluces: Cala Mijas en Málaga (200 km) y Andalucía Big. ConcertRide conecta a asistentes de Sevilla con conductores de toda España.", venues: ["Estadio La Cartuja", "FIBES Sevilla", "Palacio de los Deportes San Pablo", "Interestelar Sevilla (Charco de la Pava)", "Icónica Sevilla Fest"] },
  bilbao: { name: "Bilbao", region: "País Vasco", blurb: "Bilbao es referencia para festivales internacionales del norte: BBK Live en Kobetamendi y Bilbao Arena para tours indoor.", venues: ["Kobetamendi (BBK Live)", "Bilbao Arena"] },
  malaga: { name: "Málaga", region: "Andalucía", blurb: "Málaga concentra los festivales más solares de España: Cala Mijas en Mijas, Andalucía Big y Marenostrum en Fuengirola.", venues: ["Cala Mijas Fest", "Andalucía Big Festival", "Marenostrum Music Castle"] },
  zaragoza: { name: "Zaragoza", region: "Aragón", blurb: "Zaragoza es nodo estratégico equidistante entre Madrid y Barcelona, y origen natural para viajes a Primavera Sound, Mad Cool y Pirineos Sur.", venues: ["Pabellón Príncipe Felipe", "Pirineos Sur (Lanuza)"] },
  granada: { name: "Granada", region: "Andalucía", blurb: "Granada acoge Granada Sound en septiembre y es origen frecuente para viajes a festivales andaluces del verano.", venues: ["Granada Sound (Cortijo del Conde)"] },
  donostia: { name: "Donostia / San Sebastián", region: "País Vasco", blurb: "Conciertos en Donostia 2026 y conciertos en San Sebastián 2026: el Heineken Jazzaldia (Plaza de la Trinidad / Kursaal) cada julio es el evento de referencia. Donostia Arena (10.000 plazas) acoge giras nacionales e internacionales. La música en Donostia incluye conciertos en el Velódromo de Anoeta y el Teatro Victoria Eugenia. La cercanía con BBK Live Bilbao (100 km) y Azkena Rock Vitoria (100 km) hace que muchos viajes compartidos a festivales del norte salgan de Donostia.", venues: ["Plaza de la Trinidad (Jazzaldia)", "Kursaal", "Donostia Arena", "Velódromo de Anoeta", "Sala Dabadaba"] },
  "santiago-de-compostela": { name: "Santiago de Compostela", region: "Galicia", blurb: "Santiago acoge O Son do Camiño en Monte do Gozo cada junio, uno de los festivales con mayor aforo de España.", venues: ["Monte do Gozo (O Son do Camiño)"] },
  alicante: { name: "Alicante", region: "Comunidad Valenciana", blurb: "Alicante concentra giras nacionales e internacionales en la Plaza de Toros, ADDA y Pabellón Pitiu Rochel. Provincia con Low Festival (Benidorm) y Iboga Summer (Tavernes).", venues: ["Plaza de Toros de Alicante", "ADDA", "Pabellón Pitiu Rochel"] },
  pamplona: { name: "Pamplona / Iruña", region: "Navarra", blurb: "Pamplona / Iruña concentra la actividad musical de Navarra: Navarra Arena, Anaitasuna y Sala Totem son las referencias del directo.", venues: ["Navarra Arena", "Anaitasuna", "Sala Totem"] },
  "vitoria-gasteiz": { name: "Vitoria-Gasteiz", region: "País Vasco", blurb: "Vitoria-Gasteiz es referencia para el rock alternativo: Azkena Rock Festival en Mendizabala cada junio. Iradier Arena y Sala Helldorado cubren el resto del año.", venues: ["Mendizabala (Azkena Rock)", "Iradier Arena", "Sala Helldorado"] },
  "a-coruna": { name: "A Coruña", region: "Galicia", blurb: "A Coruña es el principal punto de origen para Resurrection Fest. Coliseum, Palexco y Sala Pelícano acogen las giras internacionales.", venues: ["Coliseum A Coruña", "Palexco", "Sala Pelícano"] },
  vigo: { name: "Vigo", region: "Galicia", blurb: "Vigo concentra la actividad musical del sur de Galicia: Auditorio Mar de Vigo, Pabellón Multiusos y salas Rouge / La Iguana Club.", venues: ["Auditorio Mar de Vigo", "Pabellón Multiusos de Vigo", "Sala Rouge", "La Iguana Club"] },
  murcia: { name: "Murcia", region: "Región de Murcia", blurb: "Murcia acoge SOS 4.8, WAM y R-Murcia. Auditorio Víctor Villegas y salas REM/Mamba completan la oferta.", venues: ["Auditorio Víctor Villegas", "Sala REM", "Sala Mamba", "SOS 4.8"] },
  valladolid: { name: "Valladolid", region: "Castilla y León", blurb: "Valladolid es punto neurálgico de Castilla y León: Plaza de Toros, Pabellón Pisuerga y Sala Porta Caeli reciben giras nacionales e internacionales.", venues: ["Plaza de Toros de Valladolid", "Pabellón Pisuerga", "Sala Porta Caeli"] },
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
  "autobuses-festivales-espana-2026": {
    title: "Autobuses a festivales de España 2026: guía completa por festival",
    excerpt: "¿Hay autobús a Viña Rock? ¿Bus oficial a Arenal Sound? ¿Lanzadera a BBK Live? Esta guía recoge, festival por festival, las opciones reales de bus, autobús, tren y coche compartido para 2026.",
    author: "Equipo ConcertRide",
    publishedAt: "2026-04-29",
    h1: "Autobuses a festivales de España 2026: cómo llegar a Viña Rock, Arenal Sound, BBK Live, Mad Cool y más",
    intro: "Buscas \"autobuses Viñarock\", \"bus Arenal Sound\", \"lanzadera BBK Live\" o \"viajes Resurrection Fest\" y nadie te da una respuesta clara. Esta guía recoge festival por festival las opciones reales de bus oficial, autobús de larga distancia, tren, lanzadera y coche compartido para llegar a los festivales españoles de 2026.",
  },
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
  "que-llevar-al-festival": {
    title: "Qué llevar al festival: lista completa 2026 (para los que van en coche)",
    excerpt: "Lista completa de qué meter en la mochila para un festival de uno, dos o varios días: equipaje, ropa, documentación y lo imprescindible si vas en coche compartido.",
    author: "Equipo ConcertRide",
    publishedAt: "2026-05-01",
    h1: "Qué llevar al festival: la lista definitiva para 2026",
    intro: "La diferencia entre un festival que recuerdas con cariño y uno que recuerdas con ampollas suele estar en la mochila. Aquí tienes la lista honesta — sin los 20 objetos que no vas a usar.",
  },
  "festivales-musica-espana-2026": {
    title: "Festivales de música en España 2026: fechas, ciudades y cómo llegar",
    excerpt: "Mad Cool, Primavera Sound, Sónar, FIB, BBK Live, Arenal Sound, Viña Rock y más. Fechas confirmadas, ciudad, recinto y cómo llegar a cada uno sin taxi.",
    author: "Equipo ConcertRide",
    publishedAt: "2026-05-01",
    h1: "Festivales de música en España 2026: la guía completa",
    intro: "El verano de 2026 tiene agenda. Mad Cool, Primavera Sound, Sónar, FIB, BBK Live y más. Repasamos los principales festivales de música en España con fechas confirmadas, recinto y opciones de transporte.",
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

function cityToSlug(city: string): string {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Built dynamically from FESTIVALS so every (originCity × festival) pair gets
// a proper bot prerender — same set as routeLandings.ts, no duplication.
function buildRoutes(): Record<string, RouteData> {
  const result: Record<string, RouteData> = {};
  for (const [festSlug, f] of Object.entries(FESTIVALS)) {
    for (const oc of f.originCities) {
      const slug = `${cityToSlug(oc.city)}-${festSlug}`;
      const priceFrom = oc.range.match(/\d+/)?.[0] ?? f.priceFrom;
      result[slug] = {
        originCity: oc.city,
        festivalShortName: f.shortName,
        festivalName: f.name,
        festivalCity: f.city,
        distance: String(oc.km),
        drivingTime: oc.drivingTime,
        priceFrom,
      };
    }
  }
  return result;
}

const ROUTES: Record<string, RouteData> = buildRoutes();

// ── Body generators ─────────────────────────────────────────────────────────

// Per-festival transport summary shown answer-first before the blurb.
// Targets "autobuses [festival]", "bus [festival]", "como llegar [festival]" queries.
const FESTIVAL_TRANSPORT_SUMMARY: Record<string, string> = {
  "vina-rock": `<p><strong>Transporte a Viña Rock (Viñarock) 2026 — resumen:</strong> No hay transporte público directo al recinto de La Pulgosa. Las opciones reales son: (1) <strong>Autobús / bus lanzadera oficial</strong> desde la estación de autobuses de Albacete (50 km, 40 min, frecuencia 1–2h, no opera de madrugada); (2) <strong>Autobuses privados Madrid–Viña Rock</strong> desde Méndez Álvaro o Nuevos Ministerios (35–55 €, horario fijo); (3) <strong>Carpooling ConcertRide</strong> desde Madrid (6–9 €), Valencia (6–9 €), Alicante (5–8 €), Murcia (5–8 €) o Cuenca (4–6 €), llegada directa a La Pulgosa sin horario fijo. El coche compartido es la opción dominante: más del 80 % de los asistentes llegan en coche.</p>`,
  "arenal-sound": `<p><strong>Transporte a Arenal Sound 2026 — resumen:</strong> No hay tren ni metro al recinto de la playa. Las opciones reales son: (1) <strong>Bus lanzadera oficial</strong> desde la estación de autobuses de Castellón de la Plana (10 km, 20 min, plazas limitadas, no opera de madrugada); (2) <strong>Autobús + lanzadera</strong> desde Valencia: Cercanías C6 Valencia–Castellón (45–60 min) más lanzadera al recinto; (3) <strong>Carpooling ConcertRide</strong> desde Valencia (3–6 €), Castellón (3–5 €), Madrid (12–17 €), Barcelona (8–12 €) o Alicante (4–7 €), llegada directa a la playa.</p>`,
  "bbk-live": `<p><strong>Transporte a BBK Live 2026 — resumen:</strong> BBK Live es el único festival grande de España con <strong>lanzadera oficial gratuita</strong> desde el centro de Bilbao (Plaza Moyúa, salidas cada 15–20 min). El recinto Kobetamendi no es accesible en coche propio durante el festival. Para quienes vienen de fuera de Bilbao: carpooling ConcertRide desde Madrid (11–16 €), Santander (4–7 €), Vitoria (4–6 €), Pamplona (5–8 €) o Donostia (5–8 €).</p>`,
  "mad-cool": `<p><strong>Transporte a Mad Cool 2026 — resumen:</strong> El recinto IFEMA está a 15 km del centro de Madrid. Las opciones son: (1) <strong>Metro L8</strong> hasta parada "Feria de Madrid" (ampliado hasta las 2:30 AM); (2) <strong>Taxi / VTC</strong> desde Madrid centro (60–90 €, precio x2–3 a la salida); (3) <strong>Carpooling ConcertRide</strong> desde Madrid (4–7 €), Valencia (10–14 €), Zaragoza (9–13 €) o Barcelona (15–20 €). No existe lanzadera oficial.</p>`,
  "o-son-do-camino": `<p><strong>Transporte a O Son do Camiño 2026 — resumen:</strong> El Monte do Gozo está a 5 km de Santiago de Compostela. Opciones: (1) <strong>Lanzadera oficial</strong> desde el centro de Santiago (Rúa do Franco, cada 15–20 min); (2) <strong>Carpooling ConcertRide</strong> desde A Coruña (3–6 €), Vigo (4–7 €), Pontevedra (3–5 €) u Oviedo (9–13 €).</p>`,
  "cala-mijas": `<p><strong>Transporte a Cala Mijas Fest 2026 — resumen:</strong> El recinto es Cortijo de Torres en Málaga capital (no en La Cala de Mijas pueblo). No hay shuttle oficial ni transporte público nocturno al Cortijo de Torres. Opciones: (1) <strong>Taxi / VTC</strong> desde Málaga centro (25–40 €); (2) <strong>Carpooling ConcertRide</strong> desde Málaga (3–5 €), Marbella (3–6 €), Fuengirola (3–5 €), Sevilla (6–9 €) o Granada (5–8 €).</p>`,
  "zevra-festival": `<p><strong>Transporte a Zevra Festival 2026 — resumen:</strong> La Marina de València está a 5 km del centro histórico. Opciones: (1) <strong>Metro L4</strong> hasta Marítim-Serreria o Neptú (ampliado hasta las 1:00–2:00 AM); (2) <strong>Carpooling ConcertRide</strong> desde Madrid (10–14 €), Alicante (5–8 €), Barcelona (10–14 €) o Murcia (7–10 €). Horarios típicos: apertura 18:30, cabezas de cartel 23:00–01:00, cierre 1:30–3:00.</p>`,
  "medusa-festival": `<p><strong>Transporte a Medusa Festival 2026 — resumen:</strong> El recinto está en la playa de Cullera, 45 km al sur de Valencia. Opciones: (1) <strong>Lanzadera del festival</strong> desde estación del Norte de Valencia (opera en franjas de llegada y salida, plazas limitadas); (2) <strong>Carpooling ConcertRide</strong> desde Valencia (3–5 €), Alicante (4–7 €), Madrid (10–14 €), Barcelona (10–14 €) o Murcia (5–8 €). No hay transporte nocturno desde Alicante, Madrid o Zaragoza.</p>`,
  "resurrection-fest": `<p><strong>Transporte a Resurrection Fest 2026 — resumen:</strong> Viveiro es una villa costera de Lugo sin transporte público desde el sur. El coche compartido es la opción dominante. Carpooling ConcertRide desde Madrid (15–22 €), A Coruña (5–8 €), Vigo (8–12 €) u Oviedo (9–14 €). No existe autobús de línea Madrid–Viveiro en horarios de festival.</p>`,
};

function festivalBody(slug: string, f: FestivalData, base: string): string {
  const transportSummary = FESTIVAL_TRANSPORT_SUMMARY[slug] ?? "";

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
    "@type": "MusicEvent",
    "@id": `${base}/festivales/${slug}#event`,
    name: f.name,
    startDate: f.startDate,
    endDate: f.endDate,
    location: {
      "@type": "Place",
      name: f.venue,
      address: { "@type": "PostalAddress", streetAddress: f.venueAddress, addressLocality: f.city, addressCountry: "ES" },
    },
    url: `${base}/festivales/${slug}`,
    description: `${f.blurb} Encuentra o publica un viaje compartido a ${f.name} desde cualquier ciudad de España. Sin comisión. ConcertRide.`,
    offers: {
      "@type": "Offer",
      price: f.priceFrom,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${base}/festivales/${slug}`,
      description: `Carpooling a ${f.name} desde ${f.priceFrom} €/asiento. Sin comisión.`,
    },
    organizer: { "@type": "Organization", name: f.name },
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    superEvent: {
      "@type": "EventSeries",
      name: f.name,
      url: `${base}/festivales/${slug}`,
      description: `Festival de música que se celebra anualmente en ${f.city}, España.`,
    },
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
<script type="application/ld+json">${breadcrumbJsonLd}</script>
<nav aria-label="Breadcrumb"><a href="${base}/">Inicio</a> / <a href="${base}/festivales">Festivales</a> / <span>${esc(f.shortName)}</span></nav>
${transportSummary}<p>${esc(f.blurb)}</p>
<h2>Cómo llegar a ${esc(f.shortName)}: transporte y localización</h2>
<p>${esc(f.shortName)} se celebra en ${esc(f.venue)}, ${esc(f.city)}. Las opciones de transporte incluyen: autobús lanzadera oficial, transporte público (metro/tren) y carpooling desde distintas ciudades de España.</p>
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

  const year = new Date().getFullYear();
  const nextYear = year + 1;

  const cityFaqs = [
    {
      q: `¿Qué conciertos hay en ${c.name} en ${year} y ${nextYear}?`,
      a: `Los principales recintos de ${c.name} para conciertos son: ${c.venues.slice(0, 3).join(", ")}${c.venues.length > 3 ? " y otros" : ""}. La agenda cubre giras nacionales e internacionales de pop, rock, indie y electrónica. Consulta la lista actualizada en concertride.me/conciertos/${slug}.`,
    },
    {
      q: `¿Cómo ir a un concierto en ${c.name} en coche compartido?`,
      a: `Con ConcertRide puedes buscar viajes compartidos a conciertos en ${c.name} desde cualquier ciudad de España. Elige por precio, ciudad de origen y perfil del conductor. El pago es en efectivo o Bizum directamente al conductor el día del viaje. Sin comisión.`,
    },
    {
      q: `¿Cuánto cuesta el carpooling a ${c.name}?`,
      a: `El precio del coche compartido a ${c.name} varía según la distancia: entre 3 y 8 €/asiento para trayectos cortos (menos de 200 km) y entre 10 y 20 € para larga distancia. El conductor fija el precio para cubrir combustible y peajes, sin comisión de plataforma.`,
    },
    {
      q: `¿Es seguro el carpooling para ir a conciertos en ${c.name}?`,
      a: `Sí. En ConcertRide todos los conductores verifican su carnet de conducir antes de publicar viajes. Puedes ver el perfil, las valoraciones y comunicarte por chat antes del evento. El pago es en persona — nunca adelantas dinero.`,
    },
  ];

  const faqItems = cityFaqs
    .map((f) => `<dt>${esc(f.q)}</dt>\n  <dd>${esc(f.a)}</dd>`)
    .join("\n  ");

  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-ES",
    mainEntity: cityFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Conciertos", item: `${base}/concerts` },
      { "@type": "ListItem", position: 3, name: c.name, item: `${base}/conciertos/${slug}` },
    ],
  });

  const collectionJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Conciertos en ${c.name} ${year}–${nextYear}`,
    description: c.blurb,
    url: `${base}/conciertos/${slug}`,
    inLanguage: "es-ES",
    about: {
      "@type": "Place",
      name: c.name,
      address: { "@type": "PostalAddress", addressLocality: c.name, addressRegion: c.region, addressCountry: "ES" },
    },
    isPartOf: { "@type": "WebSite", "@id": `${base}/#website`, name: "ConcertRide", url: base },
  });

  return `<script type="application/ld+json">${breadcrumbJsonLd}</script>
<script type="application/ld+json">${collectionJsonLd}</script>
<script type="application/ld+json">${faqJsonLd}</script>
<nav aria-label="Breadcrumb"><a href="${base}/">Inicio</a> / <a href="${base}/concerts">Conciertos</a> / <span>${esc(c.name)}</span></nav>
<p>${esc(c.blurb)}</p>
<h2>Recintos y festivales en ${esc(c.name)}</h2>
<ul>
  ${venueItems}
</ul>
<h2>Cómo ir a un concierto en ${esc(c.name)} con ConcertRide</h2>
<ol>
  <li>Busca el concierto al que vas en concertride.me/conciertos/${esc(slug)}.</li>
  <li>Elige un viaje por precio, ciudad de origen y perfil del conductor.</li>
  <li>Reserva tu plaza. Pagas en efectivo o Bizum directamente al conductor el día del viaje. Sin comisión.</li>
</ol>
<h2>Preguntas frecuentes — conciertos en ${esc(c.name)}</h2>
<dl>
  ${faqItems}
</dl>
<p><a href="${base}/concerts">Ver todos los conciertos en España →</a></p>
<p><a href="${base}/festivales">Ver festivales con carpooling disponible →</a></p>`;
}

function blogBody(slug: string, p: BlogData, base: string): string {
  const articleJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.excerpt,
    author: { "@type": "Organization", name: p.author },
    publisher: { "@type": "Organization", name: "ConcertRide", logo: { "@type": "ImageObject", url: `${base}/favicon.svg` } },
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
  const festivalSlug = slug.replace(
    new RegExp(`^${r.originCity.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-`),
    "",
  );

  const routeFaqs = [
    {
      q: `¿Cuánto cuesta el carpooling de ${r.originCity} a ${r.festivalShortName}?`,
      a: `El precio por asiento de ${r.originCity} a ${r.festivalShortName} parte desde ${r.priceFrom} €. El conductor fija el precio para cubrir combustible y peajes — sin comisión de ConcertRide. El pago es en efectivo o Bizum el día del viaje.`,
    },
    {
      q: `¿Cuánto se tarda en coche de ${r.originCity} a ${r.festivalShortName}?`,
      a: `La distancia de ${r.originCity} a ${r.festivalCity} es de ${r.distance} km. El tiempo estimado de conducción es de ${r.drivingTime} sin paradas.`,
    },
    {
      q: `¿Hay carpooling de vuelta desde ${r.festivalShortName} a ${r.originCity}?`,
      a: `Sí. La mayoría de conductores publican el viaje de ida y vuelta. Busca en ConcertRide filtrando por "${r.festivalCity}" para ver los viajes con hora de salida del festival.`,
    },
    {
      q: `¿Es seguro el carpooling ${r.originCity}–${r.festivalShortName}?`,
      a: `Todos los conductores verifican su carnet antes de publicar. Puedes ver el perfil, valoraciones y chatear antes del viaje. El pago es en persona — nunca adelantas dinero.`,
    },
  ];

  const faqItems = routeFaqs.map((f) => `<dt>${esc(f.q)}</dt>\n  <dd>${esc(f.a)}</dd>`).join("\n  ");

  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-ES",
    mainEntity: routeFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  const tripJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `Carpooling de ${r.originCity} a ${r.festivalName}`,
    description: `Viaje compartido de ${r.originCity} a ${r.festivalName} (${r.festivalCity}). ${r.distance} km, ${r.drivingTime}, desde ${r.priceFrom} €/asiento. Sin comisión.`,
    url: `${base}/rutas/${slug}`,
    touristType: "Aficionados a la música",
    itinerary: [
      { "@type": "Place", name: r.originCity, address: { "@type": "PostalAddress", addressLocality: r.originCity, addressCountry: "ES" } },
      { "@type": "Place", name: r.festivalName, address: { "@type": "PostalAddress", addressLocality: r.festivalCity, addressCountry: "ES" } },
    ],
    offers: {
      "@type": "Offer",
      price: r.priceFrom,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${base}/rutas/${slug}`,
    },
  });

  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Rutas", item: `${base}/rutas` },
      { "@type": "ListItem", position: 3, name: `${r.originCity} → ${r.festivalShortName}`, item: `${base}/rutas/${slug}` },
    ],
  });

  return `<script type="application/ld+json">${breadcrumbJsonLd}</script>
<script type="application/ld+json">${tripJsonLd}</script>
<script type="application/ld+json">${faqJsonLd}</script>
<nav aria-label="Breadcrumb"><a href="${base}/">Inicio</a> / <a href="${base}/rutas">Rutas</a> / <span>${esc(r.originCity)} → ${esc(r.festivalShortName)}</span></nav>
<p>Viaje compartido de ${esc(r.originCity)} a ${esc(r.festivalName)} en ${esc(r.festivalCity)}. ${r.distance} km · ${esc(r.drivingTime)} · desde ${r.priceFrom} €/asiento con ConcertRide.</p>
<h2>Detalles del trayecto ${esc(r.originCity)} → ${esc(r.festivalShortName)}</h2>
<ul>
  <li><strong>Origen:</strong> ${esc(r.originCity)}</li>
  <li><strong>Destino:</strong> ${esc(r.festivalName)} — ${esc(r.festivalCity)}</li>
  <li><strong>Distancia:</strong> ${r.distance} km</li>
  <li><strong>Tiempo estimado:</strong> ${esc(r.drivingTime)}</li>
  <li><strong>Precio desde:</strong> ${r.priceFrom} €/asiento (sin comisión)</li>
</ul>
<h2>Por qué ir a ${esc(r.festivalShortName)} con ConcertRide</h2>
<ul>
  <li><strong>Sin comisión</strong> — el 100% del precio va al conductor.</li>
  <li><strong>Conductores verificados</strong> — carnet comprobado y valoraciones de pasajeros.</li>
  <li><strong>Vuelta del festival</strong> — acuerda la hora de regreso con el conductor antes de salir.</li>
  <li><strong>Pago en persona</strong> — efectivo o Bizum el día del viaje.</li>
</ul>
<h2>Preguntas frecuentes — carpooling ${esc(r.originCity)} a ${esc(r.festivalShortName)}</h2>
<dl>
  ${faqItems}
</dl>
<p><a href="${base}/festivales/${festivalSlug}">Ver todos los viajes a ${esc(r.festivalShortName)} →</a></p>
<p><a href="${base}/rutas">Ver todas las rutas de carpooling →</a></p>`;
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
    const originList = f.originCities.slice(0, 3).map((o) => `${o.city} (${o.range})`).join(", ");

    // Per-festival title/description overrides targeting top GSC queries
    const META_OVERRIDES: Record<string, { title: string; description: string; h1: string }> = {
      "vina-rock": {
        title: `Autobuses Viña Rock ${year}: buses, lanzadera y carpooling | ConcertRide`,
        description: `¿Hay autobús a Viña Rock ${year}? Bus lanzadera desde Albacete (50 km, 40 min). Autobuses privados Madrid–Viñarock (35–55 €). Carpooling ConcertRide desde Madrid (6–9 €/asiento). Sin comisión.`,
        h1: `Autobuses y transporte a Viña Rock ${year}`,
      },
      "arenal-sound": {
        title: `Bus Arenal Sound ${year}: autobús Castellón–Burriana y carpooling | ConcertRide`,
        description: `Autobús Castellón a Burriana Arenal Sound: lanzadera oficial desde estación Castellón (10 km, 20 min). Tren Valencia–Castellón + lanzadera. Carpooling desde Valencia (3–6 €). Sin comisión.`,
        h1: `Bus y autobús a Arenal Sound ${year} desde Castellón y Valencia`,
      },
      "cala-mijas": {
        title: `Cala Mijas Festival ${year}: transporte desde Málaga y Marbella | ConcertRide`,
        description: `Cala Mijas Fest ${year} en Cortijo de Torres, Málaga (no en La Cala de Mijas). Sin shuttle oficial. Carpooling desde Málaga (3–5 €), Marbella (3–6 €) o Fuengirola (3–5 €). 2–4 octubre 2026.`,
        h1: `Cómo ir a Cala Mijas Festival ${year}: transporte desde Málaga y Costa del Sol`,
      },
      "bbk-live": {
        title: `Cómo llegar al BBK Live ${year}: lanzadera, carpooling | ConcertRide`,
        description: `BBK Live ${year} en Kobetamendi, Bilbao. Lanzadera oficial gratuita desde Plaza Moyúa. Carpooling desde Madrid (11–16 €), Santander (4–7 €), Donostia (5–8 €). 9–11 jul 2026.`,
        h1: `Cómo llegar al BBK Live ${year}: lanzadera y carpooling`,
      },
      "zevra-festival": {
        title: `Zevra Festival ${year}: horarios, transporte y carpooling | ConcertRide`,
        description: `Zevra Festival Valencia ${year} en La Marina de València. Horarios: apertura 18:30, cabezas de cartel 23:00–01:00. Metro L4 hasta Marítim-Serreria. Carpooling desde Madrid (10–14 €).`,
        h1: `Zevra Festival ${year}: horarios y cómo llegar a La Marina de València`,
      },
    };

    const override = META_OVERRIDES[slug];
    return {
      title: override?.title ?? `Cómo llegar a ${f.shortName} ${year}: buses, tren y carpooling | ConcertRide`,
      description: override?.description ?? `${f.shortName} ${year} en ${f.venue}, ${f.city}. Transporte: autobús, tren y carpooling desde ${originList}. Cómo llegar sin coche desde ${f.priceFrom} €.`,
      canonical: `${base}/festivales/${slug}`,
      h1: override?.h1 ?? `Cómo llegar a ${f.shortName} ${year}`,
      body: festivalBody(slug, f, base),
    };
  }

  // /conciertos/:city
  const cityMatch = pathname.match(/^\/conciertos\/([^/]+)\/?$/);
  if (cityMatch) {
    const slug = cityMatch[1] ?? "";
    const c = CITIES[slug];
    if (!c) return null;
    const year = new Date().getFullYear();
    const nextYear = year + 1;

    // Per-city title/description overrides for high-impression GSC pages
    const CITY_META_OVERRIDES: Record<string, { title: string; description: string }> = {
      sevilla: {
        title: `Conciertos en Sevilla ${year}–${nextYear}: música, festivales y carpooling | ConcertRide`,
        description: `Próximos conciertos en Sevilla ${year}: La Cartuja (60.000 plazas), FIBES, Interestelar Sevilla, Icónica Fest. Carpooling sin comisión desde 3 €/asiento. Conductores verificados.`,
      },
      donostia: {
        title: `Conciertos en Donostia ${year}: Jazzaldia, festivales y carpooling | ConcertRide`,
        description: `Próximos conciertos en Donostia–San Sebastián ${year}: Jazzaldia, Donostia Arena, Anoeta. Carpooling sin comisión a BBK Live (100 km) y Azkena Rock (100 km). Desde 4 €/asiento.`,
      },
      alicante: {
        title: `Conciertos en Alicante ${year}: Plaza de Toros, festivales y carpooling | ConcertRide`,
        description: `Próximos conciertos en Alicante ${year}: Plaza de Toros, ADDA. Carpooling a Low Festival Benidorm (45 km), Arenal Sound (115 km), Viña Rock (165 km). Desde 3 €/asiento.`,
      },
      bilbao: {
        title: `Conciertos en Bilbao ${year}: BBK Live, Kobetamendi y carpooling | ConcertRide`,
        description: `Conciertos en Bilbao ${year}: BBK Live (Kobetamendi, 9–11 jul), Bilbao Arena, Euskalduna. Carpooling desde Santander (4–7 €), Vitoria (4–6 €), Madrid (11–16 €). Sin comisión.`,
      },
      zaragoza: {
        title: `Conciertos en Zaragoza ${year}: próximos conciertos y carpooling | ConcertRide`,
        description: `Próximos conciertos en Zaragoza ${year}: Pabellón Príncipe Felipe, Sala López, Pirineos Sur. Carpooling a Mad Cool (9–13 €), Primavera Sound (8–12 €), Arenal Sound (8–12 €). Sin comisión.`,
      },
    };

    const override = CITY_META_OVERRIDES[slug];
    return {
      title: override?.title ?? `Conciertos en ${c.name} ${year}–${nextYear} — Carpooling sin comisión | ConcertRide`,
      description: override?.description ?? `Conciertos y festivales en ${c.name} ${year}: ${c.venues.slice(0, 2).join(", ")} y más. Carpooling sin comisión desde 3 €/asiento. Conductores verificados.`,
      canonical: `${base}/conciertos/${slug}`,
      h1: `Conciertos en ${c.name} ${year}`,
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
      title: `Carpooling ${r.originCity} → ${r.festivalShortName} — desde ${r.priceFrom} € · ${r.drivingTime} | ConcertRide`,
      description: `Viaje compartido de ${r.originCity} a ${r.festivalName} (${r.festivalCity}). ${r.distance} km · ${r.drivingTime} · desde ${r.priceFrom} €/asiento. Sin taxi, sin comisión. Conductores verificados con carnet.`,
      canonical: `${base}/rutas/${slug}`,
      h1: `Carpooling de ${r.originCity} a ${r.festivalShortName} — desde ${r.priceFrom} €`,
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

  // Auth pages — bots get a minimal noindex response so GSC doesn't index
  // /login?next=... variants (query params are stripped for matching).
  const authPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];
  if (authPaths.includes(c.req.path)) {
    return new Response(
      `<!doctype html><html lang="es"><head><meta charset="UTF-8"/><title>Acceso — ConcertRide ES</title><meta name="robots" content="noindex, nofollow"/><link rel="canonical" href="${base}${c.req.path}"/></head><body></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "X-SEO-Prerender": "noindex" } },
    );
  }

  // Resolve page data — concert pages need the store, everything else is static
  // Also try with trailing slash appended/removed if initial match fails.
  // Use only the pathname (strip query string) so /login?next=... etc. don't
  // leak through the auth guard above or produce phantom page matches below.
  const pathname = c.req.path;
  let page: PageData | null = resolvePageData(pathname, base);

  if (!page) {
    // Try normalizing trailing slash
    const pathWithoutSlash = pathname.replace(/\/$/, "");
    const pathWithSlash = pathWithoutSlash === pathname ? `${pathname}/` : pathWithoutSlash;
    page = resolvePageData(pathWithSlash, base);
  }

  if (!page) {
    // /concerts/:id — fetch concert data from store for rich SEO
    const concertMatch = pathname.match(/^\/concerts\/([^/]+)\/?$/);
    if (concertMatch && c.var.store) {
      page = await resolveConcertPage(concertMatch[1] ?? "", base, c.var.store);
    }
  }

  if (!page) {
    // Unknown slug in a known dynamic pattern (e.g. /festivales/nonexistent-slug,
    // /conciertos/unknown-city, /blog/missing-post, /rutas/no-route).
    // Return an explicit 404 so Google does not soft-404 these as 200 shells.
    const isDynamicPattern =
      /^\/festivales\/[^/]+\/?$/.test(pathname) ||
      /^\/conciertos\/[^/]+\/?$/.test(pathname) ||
      /^\/blog\/[^/]+\/?$/.test(pathname) ||
      /^\/rutas\/[^/]+\/?$/.test(pathname);
    if (isDynamicPattern) {
      const base = getSiteUrl(c.env);
      return new Response(
        `<!doctype html><html lang="es"><head><meta charset="UTF-8"/><title>No encontrado — ConcertRide</title><meta name="robots" content="noindex, nofollow"/><link rel="canonical" href="${base}${pathname}"/></head><body><h1>Página no encontrada</h1><p><a href="${base}/">Volver al inicio</a></p></body></html>`,
        { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } },
      );
    }
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

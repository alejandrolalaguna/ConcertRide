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
      body: (() => {
        const orgJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${base}/#organization`,
          name: "ConcertRide",
          url: base,
          logo: {
            "@type": "ImageObject",
            url: `${base}/favicon.svg`,
            width: 512,
            height: 512,
          },
          description: "Plataforma española de carpooling exclusiva para conciertos y festivales. Sin comisión (0 %), conductores verificados, pago directo en efectivo o Bizum.",
          foundingDate: "2026",
          foundingLocation: { "@type": "Place", name: "España" },
          legalName: "ConcertRide ES",
          knowsAbout: ["carpooling", "festivales de música", "conciertos en España", "transporte compartido"],
          areaServed: { "@type": "Country", name: "Spain", sameAs: "https://www.wikidata.org/wiki/Q29" },
          sameAs: [
            "https://twitter.com/concertride_es",
            "https://www.instagram.com/concertride_es/",
            "https://www.facebook.com/concertride.me",
            "https://www.tiktok.com/@concertride_es",
            "https://www.linkedin.com/company/concertride-es",
            "https://www.crunchbase.com/organization/concertride-es",
            "https://www.wikidata.org/wiki/Q130455178",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "alejandrolalaguna@gmail.com",
            availableLanguage: "Spanish",
          },
        });
        const websiteJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${base}/#website`,
          url: base,
          name: "ConcertRide ES",
          description: "Carpooling para conciertos y festivales en España",
          publisher: { "@id": `${base}/#organization` },
          inLanguage: "es-ES",
          potentialAction: {
            "@type": "SearchAction",
            target: { "@type": "EntryPoint", urlTemplate: `${base}/concerts?q={search_term_string}` },
            "query-input": "required name=search_term_string",
          },
        });
        const faqJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: "es-ES",
          mainEntity: [
            { "@type": "Question", name: "¿Qué es ConcertRide?", acceptedAnswer: { "@type": "Answer", text: "ConcertRide es la plataforma española de carpooling exclusiva para conciertos y festivales. Conecta conductores con plazas libres y pasajeros que van al mismo evento. Sin comisión de plataforma — el 100 % del precio del asiento va al conductor. Conductores verificados con carnet. Pago en efectivo o Bizum el día del viaje." } },
            { "@type": "Question", name: "¿Cuánto cuesta el carpooling a un concierto en España?", acceptedAnswer: { "@type": "Answer", text: "El precio lo fija el conductor para cubrir combustible y peajes: entre 3 y 8 € para trayectos cortos (< 200 km) y entre 10 y 35 € para larga distancia. ConcertRide no cobra comisión. El precio medio es 8–15 € por asiento." } },
            { "@type": "Question", name: "¿Es ConcertRide mejor que BlaBlaCar para festivales?", acceptedAnswer: { "@type": "Answer", text: "Para festivales sí: ConcertRide cobra 0 % de comisión (BlaBlaCar cobra 12–18 %), cada viaje está vinculado al evento concreto (hora de vuelta alineada con el fin del show), y el pago es en efectivo sin tarjeta obligatoria." } },
            { "@type": "Question", name: "¿Es legal el carpooling a festivales en España?", acceptedAnswer: { "@type": "Answer", text: "Sí. El carpooling de gastos compartidos sin beneficio económico está reconocido como legal por el Tribunal Supremo español (sentencia 2017, caso BlaBlaCar). El conductor solo puede cobrar su parte proporcional del combustible y peajes." } },
          ],
        });
        const serviceJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${base}/#service`,
          name: "ConcertRide — Carpooling para conciertos y festivales",
          description: "Plataforma española de carpooling exclusiva para conciertos y festivales de música. Conecta conductores y pasajeros que van al mismo evento. 0 % de comisión, conductores verificados, pago en efectivo o Bizum.",
          serviceType: "Carpooling",
          provider: { "@id": `${base}/#organization` },
          areaServed: { "@type": "Country", name: "Spain", sameAs: "https://www.wikidata.org/wiki/Q29" },
          availableChannel: {
            "@type": "ServiceChannel",
            serviceUrl: base,
            servicePhone: "N/A",
            availableLanguage: { "@type": "Language", name: "Spanish" },
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "EUR",
            priceSpecification: { "@type": "PriceSpecification", description: "Sin comisión de plataforma — el precio lo fija el conductor para cubrir combustible y peajes" },
            seller: { "@id": `${base}/#organization` },
          },
          sameAs: "https://www.wikidata.org/wiki/Q1343571",
        });
        const homePageJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${base}/#webpage`,
          url: `${base}/`,
          name: "ConcertRide — Carpooling para conciertos en España",
          inLanguage: "es-ES",
          dateModified: "2026-05-03",
          speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable", "p:first-of-type"] },
          isPartOf: { "@type": "WebSite", "@id": `${base}/#website`, name: "ConcertRide", url: base },
          about: { "@type": "Organization", "@id": `${base}/#organization` },
        });
        return `<script type="application/ld+json">${orgJsonLd}</script>
<script type="application/ld+json">${websiteJsonLd}</script>
<script type="application/ld+json">${serviceJsonLd}</script>
<script type="application/ld+json">${faqJsonLd}</script>
<script type="application/ld+json">${homePageJsonLd}</script>
<p>ConcertRide es la plataforma de viaje compartido especializada en conciertos y festivales en España. Conectamos conductores y pasajeros que van al mismo evento. Sin comisiones, conductores verificados, pago directo.</p>
<h2>¿Cómo funciona?</h2>
<ol>
  <li><strong>Busca tu concierto</strong> — encuentra el evento en el que quieres compartir coche.</li>
  <li><strong>Elige o publica un viaje</strong> — reserva una plaza o abre tu coche a otros fans.</li>
  <li><strong>Llega juntos</strong> — pagas en efectivo o Bizum directamente al conductor el día del viaje.</li>
</ol>
<h2>Festivales con viajes compartidos disponibles</h2>
<ul>
  <li><a href="${base}/festivales/mad-cool">Carpooling al Mad Cool Festival Madrid — 9–11 jul 2026, IFEMA</a></li>
  <li><a href="${base}/festivales/primavera-sound">Carpooling al Primavera Sound Barcelona — 28 may–1 jun 2026</a></li>
  <li><a href="${base}/festivales/sonar">Carpooling al Sónar Barcelona — 18–20 jun 2026</a></li>
  <li><a href="${base}/festivales/fib">Carpooling al FIB Benicàssim — 16–19 jul 2026</a></li>
  <li><a href="${base}/festivales/bbk-live">Carpooling al BBK Live Bilbao — 9–11 jul 2026</a></li>
  <li><a href="${base}/festivales/arenal-sound">Carpooling al Arenal Sound Burriana — 29 jul–2 ago 2026</a></li>
</ul>
<h2>ConcertRide vs BlaBlaCar para festivales</h2>
<table>
  <tr><th>Característica</th><th>ConcertRide</th><th>BlaBlaCar</th></tr>
  <tr><td>Comisión</td><td>0 %</td><td>12–18 %</td></tr>
  <tr><td>Búsqueda por festival/evento</td><td>Sí</td><td>No (solo por ruta)</td></tr>
  <tr><td>Pago</td><td>Efectivo / Bizum</td><td>Tarjeta (plataforma)</td></tr>
  <tr><td>Hora vuelta alineada con show</td><td>Sí</td><td>No</td></tr>
  <tr><td>Verificación conductor</td><td>Carnet obligatorio</td><td>Opcional</td></tr>
</table>`;
      })(),
    },
    "/concerts": {
      title: `Conciertos en España 2026 — Carpooling sin comisiones | ${SITE_NAME}`,
      description: "Directorio de conciertos en España con viajes compartidos disponibles. Filtra por ciudad, artista o fecha. Sin comisión. ConcertRide.",
      canonical: `${base}/concerts`,
      h1: "Conciertos en España con carpooling disponible",
      body: (() => {
        const itemListLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Ciudades con conciertos y carpooling disponible en España 2026",
          numberOfItems: 17,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Conciertos en Madrid", url: `${base}/conciertos/madrid` },
            { "@type": "ListItem", position: 2, name: "Conciertos en Barcelona", url: `${base}/conciertos/barcelona` },
            { "@type": "ListItem", position: 3, name: "Conciertos en Valencia", url: `${base}/conciertos/valencia` },
            { "@type": "ListItem", position: 4, name: "Conciertos en Sevilla", url: `${base}/conciertos/sevilla` },
            { "@type": "ListItem", position: 5, name: "Conciertos en Bilbao", url: `${base}/conciertos/bilbao` },
            { "@type": "ListItem", position: 6, name: "Conciertos en Málaga", url: `${base}/conciertos/malaga` },
            { "@type": "ListItem", position: 7, name: "Conciertos en Zaragoza", url: `${base}/conciertos/zaragoza` },
            { "@type": "ListItem", position: 8, name: "Conciertos en Donostia", url: `${base}/conciertos/donostia` },
            { "@type": "ListItem", position: 9, name: "Conciertos en Alicante", url: `${base}/conciertos/alicante` },
            { "@type": "ListItem", position: 10, name: "Conciertos en A Coruña", url: `${base}/conciertos/a-coruna` },
            { "@type": "ListItem", position: 11, name: "Conciertos en Santiago de Compostela", url: `${base}/conciertos/santiago-de-compostela` },
            { "@type": "ListItem", position: 12, name: "Conciertos en Pamplona", url: `${base}/conciertos/pamplona` },
            { "@type": "ListItem", position: 13, name: "Conciertos en Vitoria-Gasteiz", url: `${base}/conciertos/vitoria-gasteiz` },
            { "@type": "ListItem", position: 14, name: "Conciertos en Vigo", url: `${base}/conciertos/vigo` },
            { "@type": "ListItem", position: 15, name: "Conciertos en Murcia", url: `${base}/conciertos/murcia` },
            { "@type": "ListItem", position: 16, name: "Conciertos en Valladolid", url: `${base}/conciertos/valladolid` },
            { "@type": "ListItem", position: 17, name: "Conciertos en Granada", url: `${base}/conciertos/granada` },
          ],
        });
        const faqLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "¿En qué ciudades hay conciertos con carpooling en España?", acceptedAnswer: { "@type": "Answer", text: "ConcertRide cubre conciertos y festivales en 17 ciudades españolas: Madrid, Barcelona, Valencia, Sevilla, Bilbao, Málaga, Zaragoza, Donostia, Alicante, A Coruña, Santiago de Compostela, Pamplona, Vitoria-Gasteiz, Vigo, Murcia, Valladolid y Granada. El catálogo se actualiza diariamente." } },
            { "@type": "Question", name: "¿Cuánto cuesta encontrar carpooling a un concierto en España?", acceptedAnswer: { "@type": "Answer", text: "ConcertRide es gratuito para buscar y publicar viajes. El precio del asiento lo fija el conductor para cubrir combustible: 3–8 €/asiento en distancias cortas y 10–35 € en distancias largas. No hay comisión de plataforma." } },
          ],
        });
        const breadcrumbLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
            { "@type": "ListItem", position: 2, name: "Conciertos", item: `${base}/concerts` },
          ],
        });
        return `<script type="application/ld+json">${itemListLd}</script>
<script type="application/ld+json">${faqLd}</script>
<script type="application/ld+json">${breadcrumbLd}</script>
<p>Encuentra todos los conciertos y festivales en España donde puedes compartir coche con otros asistentes. Gratis, sin comisión, conductores verificados.</p>
<h2>Ciudades con más conciertos y carpooling disponible</h2>
<ul>
  <li><a href="${base}/conciertos/madrid">Conciertos en Madrid — WiZink Center, IFEMA, Vistalegre</a></li>
  <li><a href="${base}/conciertos/barcelona">Conciertos en Barcelona — Primavera Sound, Sónar, Cruïlla (Parc del Fòrum)</a></li>
  <li><a href="${base}/conciertos/valencia">Conciertos en Valencia — Zevra Festival, Arenal Sound, Medusa</a></li>
  <li><a href="${base}/conciertos/sevilla">Conciertos en Sevilla — La Cartuja, FIBES, Interestelar</a></li>
  <li><a href="${base}/conciertos/bilbao">Conciertos en Bilbao — BBK Live (Kobetamendi), Bilbao Arena</a></li>
  <li><a href="${base}/conciertos/malaga">Conciertos en Málaga — Cala Mijas, Marenostrum, Andalucía Big</a></li>
  <li><a href="${base}/conciertos/zaragoza">Conciertos en Zaragoza — Príncipe Felipe, Pirineos Sur</a></li>
  <li><a href="${base}/conciertos/donostia">Conciertos en Donostia — Jazzaldia, Donostia Arena</a></li>
</ul>`;
      })(),
    },
    "/festivales": {
      title: `Festivales de música España 2026: carpooling y transporte | ConcertRide`,
      description: "Viajes compartidos a los festivales más grandes de España: Mad Cool, Primavera Sound, Sónar, FIB, BBK Live y más. Sin taxi, sin comisión.",
      canonical: `${base}/festivales`,
      h1: "Festivales de música en España con viaje compartido",
      body: (() => {
        const collectionPageJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${base}/festivales#webpage`,
          url: `${base}/festivales`,
          name: "Carpooling festivales música España 2026 | ConcertRide",
          description: "Directorio de 16 festivales de música en España 2026 con carpooling disponible. Mad Cool (IFEMA Madrid, 9–11 jul), Primavera Sound (Parc del Fòrum Barcelona, 28 may–1 jun), Sónar (Fira de Barcelona, 18–20 jun), BBK Live (Kobetamendi Bilbao, 9–11 jul), Arenal Sound (Burriana, 29 jul–2 ago), Viña Rock (Villarrobledo, 30 abr–3 may) y más. Precios desde 3 €/asiento sin comisión.",
          inLanguage: "es-ES",
          numberOfItems: 16,
          keywords: "festivales España 2026, carpooling festivales, Mad Cool carpooling, Primavera Sound viaje compartido, Sónar transporte, BBK Live Bilbao, Arenal Sound Burriana, Viña Rock Villarrobledo",
          datePublished: "2026-04-10",
          dateModified: "2026-05-03",
          isPartOf: { "@id": `${base}/#website` },
          about: { "@id": `${base}/#service` },
          speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable"] },
        });
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
            { "@type": "ListItem", position: 12, name: "Cala Mijas Fest — Cortijo de Torres, Málaga — 2–4 oct 2026", url: `${base}/festivales/cala-mijas` },
            { "@type": "ListItem", position: 13, name: "Low Festival — Benidorm — 24–26 jul 2026", url: `${base}/festivales/low-festival` },
            { "@type": "ListItem", position: 14, name: "Tomavistas — Madrid — 15–17 may 2026", url: `${base}/festivales/tomavistas` },
            { "@type": "ListItem", position: 15, name: "Zevra Festival — Valencia — verano 2026", url: `${base}/festivales/zevra-festival` },
            { "@type": "ListItem", position: 16, name: "Cruïlla — Barcelona — 9–12 jul 2026", url: `${base}/festivales/cruilla` },
          ],
        });
        const breadcrumbJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
            { "@type": "ListItem", position: 2, name: "Festivales", item: `${base}/festivales` },
          ],
        });
        return `<script type="application/ld+json">${collectionPageJsonLd}</script>
<script type="application/ld+json">${faqJsonLd}</script>
<script type="application/ld+json">${itemListJsonLd}</script>
<script type="application/ld+json">${breadcrumbJsonLd}</script>
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

<p>Lee más en el blog: <a href="${base}/blog/festivales-musica-espana-2026">Guía completa de carpooling a festivales 2026</a> · <a href="${base}/guia-transporte-festivales">Guía de transporte a festivales</a></p>`;
      })(),
    },
    "/guia-transporte-festivales": {
      title: `Guía de transporte para festivales de España 2026: autobús, tren y carpooling | ${SITE_NAME}`,
      description: "Cómo llegar a los festivales de música en España: autobús organizado, tren, lanzadera oficial y carpooling comparados. Precios, pros, contras y opciones de vuelta de madrugada.",
      canonical: `${base}/guia-transporte-festivales`,
      h1: "Guía de transporte para festivales de música en España 2026",
      body: (() => {
        const guideArticleJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Guía de transporte para festivales de música en España 2026",
          description: "Cómo llegar a los festivales de música en España: autobús organizado, tren, lanzadera oficial y carpooling comparados. Precios, pros, contras y opciones de vuelta de madrugada.",
          author: {
            "@type": "Person",
            name: "Alejandro Lalaguna",
            url: `${base}/acerca-de`,
            "@id": `${base}/#founder`,
          },
          publisher: { "@type": "Organization", name: "ConcertRide", "@id": `${base}/#organization`, logo: { "@type": "ImageObject", url: `${base}/favicon.svg`, width: 512, height: 512 } },
          datePublished: "2026-04-24",
          dateModified: "2026-05-03",
          url: `${base}/guia-transporte-festivales`,
          inLanguage: "es-ES",
          mainEntityOfPage: { "@type": "WebPage", "@id": `${base}/guia-transporte-festivales` },
          articleSection: "Guía de viaje",
          keywords: "transporte festivales España 2026, cómo llegar a festivales, autobús festival, carpooling festival, lanzadera festival, vuelta festival madrugada",
          about: [
            { "@type": "Thing", name: "Carpooling", sameAs: "https://www.wikidata.org/wiki/Q1343571" },
            { "@type": "Thing", name: "Festivales de música en España", sameAs: "https://www.wikidata.org/wiki/Q213492" },
          ],
          mentions: [
            { "@type": "MusicEvent", name: "Mad Cool Festival", sameAs: "https://www.madcoolfestival.es/" },
            { "@type": "MusicEvent", name: "Primavera Sound", sameAs: "https://www.primaverasound.com/" },
            { "@type": "MusicEvent", name: "Sónar", sameAs: "https://sonar.es/" },
            { "@type": "MusicEvent", name: "BBK Live", sameAs: "https://bbklive.com/" },
            { "@type": "MusicEvent", name: "Arenal Sound", sameAs: "https://arenalsound.com/" },
            { "@type": "MusicEvent", name: "Viña Rock", sameAs: "https://www.vinarock.es/" },
            { "@type": "MusicEvent", name: "Resurrection Fest", sameAs: "https://www.resurrectionfest.es/" },
            { "@type": "Organization", name: "BlaBlaCar", sameAs: "https://www.blablacar.es/" },
          ],
          speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable", "p:first-of-type"] },
        });
        const guideFaqJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: "es-ES",
          mainEntity: [
            { "@type": "Question", name: "¿Cuál es la mejor forma de ir a un festival en España?", acceptedAnswer: { "@type": "Answer", text: "Para la mayoría de festivales en España, el carpooling es la mejor opción: es 3–5 veces más barato que un taxi (3–20 € vs 40–90 €), más flexible que el autobús organizado (sin horario fijo de vuelta) y llega directamente al recinto cuando el transporte público no llega. ConcertRide ofrece carpooling sin comisión a 16 festivales desde 17 ciudades." } },
            { "@type": "Question", name: "¿Hay autobuses nocturnos a los festivales en España?", acceptedAnswer: { "@type": "Answer", text: "Los autobuses nocturnos (búho en Madrid, nitbus en Barcelona) no llegan a los recintos de festival. El metro de Madrid cierra a las 1:30, el de Barcelona a las 2:00. Para la vuelta de madrugada, el carpooling con ConcertRide es la opción más práctica: acuerdas la hora de salida directamente con el conductor." } },
            { "@type": "Question", name: "¿Cuánto cuesta el carpooling a un festival vs taxi?", acceptedAnswer: { "@type": "Answer", text: "Carpooling ConcertRide: 3–20 €/asiento según distancia. Taxi nocturno de festival: 40–90 € por trayecto (precio x2–x3 por alta demanda). El carpooling desde Madrid al Mad Cool (IFEMA) cuesta 4–8 €. El taxi equivalente cuesta 25–45 €." } },
            { "@type": "Question", name: "¿Qué festivales tienen lanzadera oficial en 2026?", acceptedAnswer: { "@type": "Answer", text: "Los festivales con lanzadera oficial en 2026 son: BBK Live (gratuita desde Plaza Moyúa, Bilbao), Viña Rock (desde Albacete), FIB (desde Castellón), Arenal Sound (desde Castellón). Mad Cool no tiene lanzadera oficial — usa Metro L8. Primavera Sound, Sónar y Cruïlla son accesibles en Metro L4." } },
          ],
        });
        const guideBreadcrumbJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
            { "@type": "ListItem", position: 2, name: "Guía de transporte a festivales", item: `${base}/guia-transporte-festivales` },
          ],
        });
        return `<script type="application/ld+json">${guideArticleJsonLd}</script>
<script type="application/ld+json">${guideFaqJsonLd}</script>
<script type="application/ld+json">${guideBreadcrumbJsonLd}</script>
<p>Guía completa con todas las opciones para llegar a los festivales de música en España en 2026: carpooling, autobuses organizados, transporte público y consejos para volver de madrugada sin pagar de más.</p>
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
<p>La mayoría de festivales terminan entre la 1:00 y las 4:00. El metro de Madrid cierra a la 1:30, el de Barcelona a las 2:00. Los autobuses nocturnos (búhos en Madrid, nitbus en Barcelona) no llegan a los recintos de festival. Los taxis y VTC multiplican el precio x2–x3 en noches de alta demanda. Con ConcertRide, acuerdas la hora de vuelta con el conductor antes del festival: salís juntos cuando acabe el último bolo.</p>`;
      })(),
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
          dateModified: "2026-05-03",
          speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2", ".speakable", "p:first-of-type"] },
          isPartOf: { "@type": "WebSite", "@id": `${base}/#website`, name: "ConcertRide", url: base },
        });
        const breadcrumbJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
            { "@type": "ListItem", position: 2, name: "Cómo funciona", item: `${base}/como-funciona` },
          ],
        });
        return `<script type="application/ld+json">${webPageJsonLd}</script>
<script type="application/ld+json">${breadcrumbJsonLd}</script>
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
      title: `FAQ — Carpooling para conciertos y festivales | ${SITE_NAME}`,
      description: "FAQ completo sobre ConcertRide: cómo compartir coche a un festival, alternativa económica para volver de noche, carpooling sin comisiones, sostenibilidad y más.",
      canonical: `${base}/faq`,
      h1: "Preguntas frecuentes — ConcertRide carpooling para conciertos",
      body: (() => {
        const faqs = [
          { q: "¿Qué es ConcertRide?", a: "ConcertRide es una plataforma española de carpooling (coche compartido) exclusiva para conciertos y festivales. Conecta a fans que van al mismo evento para compartir coche, dividir gastos y llegar juntos. Es gratis, sin comisiones y sin publicidad." },
          { q: "¿Cuánto cuesta usar ConcertRide?", a: "El uso de la plataforma es 100 % gratis tanto para conductores como para pasajeros. No cobramos comisión. Cada viaje tiene un precio por asiento que fija el conductor (típicamente 8–15 €/plaza) para cubrir combustible y peajes. Otros servicios como taxi suelen costar 30–60 € por la misma distancia." },
          { q: "¿Es seguro viajar con ConcertRide?", a: "Sí. Todos los conductores tienen que verificar su carnet de conducir antes de publicar un viaje. Puedes ver la valoración media, el número de viajes realizados y las reseñas de otros pasajeros en el perfil público del conductor. Los emails están verificados antes de poder reservar o publicar." },
          { q: "¿Cómo funciona para un pasajero?", a: "1) Busca el concierto al que vas. 2) Elige un viaje publicado desde tu ciudad de origen. 3) Envía una solicitud (o reserva al instante si está activada). 4) Paga al conductor en efectivo o Bizum cuando te recoja." },
          { q: "¿Cómo funciona para un conductor?", a: "1) Verifica tu carnet en Mi perfil. 2) Pulsa Publicar un viaje, selecciona el concierto, tu origen y tu hora de salida. 3) Fija el precio por asiento y el número de plazas. 4) Acepta o rechaza las solicitudes de los pasajeros." },
          { q: "¿A qué conciertos y festivales puedo ir?", a: "Tenemos datos de 16+ festivales españoles del año (Mad Cool, Primavera Sound, Sónar, FIB, BBK Live, Resurrection Fest, Arenal Sound, Viña Rock, Cala Mijas, Zevra, Cruïlla y más) además de miles de conciertos individuales en toda España." },
          { q: "¿En qué ciudades está disponible?", a: "Cobertura nacional en España. Orígenes y destinos en Madrid, Barcelona, Valencia, Sevilla, Bilbao, Málaga, Zaragoza, Alicante, Benidorm, Granada, Murcia, A Coruña, Santiago, Benicàssim, Villarrobledo, Aranda de Duero, entre otros." },
          { q: "¿Qué pasa si el conductor cancela el viaje?", a: "Te enviamos un email y una notificación push inmediatamente. La reserva se cancela automáticamente y tu plaza queda liberada. No has pagado nada (el pago es en persona) así que no hay reembolsos que gestionar." },
          { q: "¿Puedo cancelar mi reserva?", a: "Sí, en cualquier momento antes de la salida. Ve a Mis viajes → selecciona la reserva → pulsa Cancelar reserva. Notificamos al conductor y la plaza vuelve a estar disponible para otros pasajeros." },
          { q: "¿Pagáis a los conductores?", a: "No. ConcertRide no intermedia ningún pago. El conductor cobra a los pasajeros directamente en efectivo o Bizum el día del viaje. El precio por asiento se calcula para compartir gastos (combustible + peajes), no para lucro." },
          { q: "¿Qué ventajas tiene ConcertRide frente a otras opciones de transporte?", a: "ConcertRide es la única plataforma diseñada exclusivamente para conciertos y festivales. El viaje está sincronizado con el horario del evento, ves a qué concierto van los otros pasajeros, y el 100 % del precio del asiento va al conductor — sin comisión de ningún tipo." },
          { q: "¿Qué datos personales guardáis?", a: "Email, nombre y contraseña (hasheada con PBKDF2-SHA256) para la cuenta. Opcionalmente: teléfono, ciudad base, modelo de coche. Foto de carnet de conducir (solo para verificación, no se muestra públicamente). No vendemos datos a terceros." },
          { q: "¿Qué pasa si tengo un problema con otro usuario?", a: "Puedes reportar a un usuario o viaje desde el perfil del conductor o la ficha del viaje → botón Reportar. Elige el motivo (estafa, acoso, no-show, conducción peligrosa, spam, otro) y añade los detalles. Revisamos cada reporte manualmente." },
          { q: "¿Tengo que crear cuenta para usar la plataforma?", a: "No para explorar conciertos y ver viajes. Sí para publicar un viaje o reservar una plaza (necesitamos tu email verificado). El registro es gratis, solo pide nombre + email + contraseña + aceptar los términos." },
          { q: "¿Puedo ir a un festival sin coche propio?", a: "Sí, ese es el uso principal de ConcertRide. Busca el festival en el catálogo, elige un viaje publicado desde tu ciudad y reserva una plaza. El conductor te recoge en un punto acordado." },
          { q: "¿Cuál es la alternativa al taxi para volver de un concierto de noche?", a: "El carpooling de ConcertRide. Los conciertos suelen terminar entre las 23:00 y las 02:00, cuando el transporte público es escaso y los taxis cuestan 30–60 €. Con ConcertRide, varios fans comparten el viaje de vuelta — precio habitual 8–15 € por asiento." },
          { q: "¿Cómo compartir los gastos del viaje a un concierto?", a: "Publica un viaje en ConcertRide indicando tu ruta, hora y precio por asiento. Los pasajeros reservan y te pagan en efectivo o Bizum el día del viaje. Típicamente, 3 pasajeros a 10 € cada uno cubren la gasolina de un trayecto de 200 km." },
          { q: "¿Hay autobuses directos a los festivales de España?", a: "Pocos. Algunos festivales organizan shuttles pagados desde la ciudad más cercana, pero los horarios son limitados y se agotan. Desde ciudades más distantes no existe transporte público directo a recintos como Resurrection Fest (Viveiro), Arenal Sound (Burriana) o Viña Rock (Villarrobledo)." },
          { q: "¿ConcertRide funciona para conciertos individuales además de festivales?", a: "Sí. ConcertRide funciona para cualquier concierto en recintos con difícil acceso nocturno: WiZink Center (Madrid), Palau Sant Jordi (Barcelona), Kobetamendi (Bilbao), etc. Puedes buscar cualquier artista o sala en el catálogo." },
          { q: "¿Cómo sé que el conductor es de confianza?", a: "Tres capas de verificación: (1) email verificado obligatorio para todos los usuarios; (2) foto del carnet de conducir verificada manualmente antes del primer viaje; (3) sistema de valoraciones 1–5 estrellas con reseñas de pasajeros anteriores, visibles en el perfil público." },
          { q: "¿Cómo volver del festival de madrugada?", a: "Los festivales acaban entre la 1:00 y las 4:00 de la madrugada, cuando el metro ya cerró y los taxis cuestan 60–100 €. Con ConcertRide, publicas o buscas viaje de vuelta con antelación: acuerda la hora de salida con el conductor y te recoge en el punto pactado." },
          { q: "¿Hay autobuses organizados a los festivales y cómo se comparan con ConcertRide?", a: "Existen autobuses organizados a algunos festivales, pero solo desde ciudades concretas, con horarios fijos, y suelen agotarse semanas antes. ConcertRide sale desde tu calle, a la hora que acordáis, y cuesta entre 3 y 20 € según la distancia." },
          { q: "¿ConcertRide es más sostenible que ir en coche solo?", a: "Sí. Según el Julie's Bicycle Practical Guide to Green Events, el 80 % de la huella de carbono de un festival proviene del transporte. Un coche compartido con 4 personas emite un 75 % menos CO₂ por pasajero respecto a ir en solitario." },
          { q: "¿Qué es la Zona de Bajas Emisiones (ZBE) de Madrid y cómo afecta para ir a festivales?", a: "La ZBE de Madrid Centro restringe el acceso a coches sin etiqueta ambiental. IFEMA (Mad Cool, Tomavistas) está fuera de la ZBE, así que puedes llegar en cualquier vehículo. Muchos fans prefieren ConcertRide para evitar el parking saturado de IFEMA (12–18 €/día)." },
          { q: "¿Puedo ir al festival en grupo con una furgoneta compartida?", a: "Sí. Muchos conductores publican viajes en furgoneta de 7–9 plazas. Es la opción más económica para grupos: dividir la gasolina entre 7 personas sale a 3–8 € por persona incluso desde 300 km." },
          { q: "¿Puedo ganar dinero llevando gente a conciertos y festivales?", a: "No es para ganar dinero, sino para no perderlo. Por ley, un conductor no puede cobrar más del coste proporcional del viaje (combustible + peajes dividido entre todos). En la práctica, los pasajeros cubren la gasolina convirtiendo el viaje de 40 € en gasolina en un viaje gratis." },
          { q: "¿Qué hago si no encuentro ningún viaje a mi concierto?", a: "Activa el botón 'Me interesa un viaje' en la ficha del concierto. El sistema muestra tu demanda a posibles conductores con el contador 'X personas buscan viaje' y te notifica por email y push en cuanto alguien publique un viaje desde tu ciudad." },
          { q: "¿Por qué ConcertRide es mejor para ir a festivales que una plataforma de carpooling genérica?", a: "ConcertRide está diseñada específicamente para conciertos: el viaje está sincronizado con el horario del evento, ves a qué show van los otros pasajeros, puedes chatear en el chat del concierto y el 100 % del precio va al conductor sin comisión." },
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
          dateModified: "2026-05-03",
          speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "dt", "dd"] },
          isPartOf: { "@type": "WebSite", "@id": `${base}/#website`, name: "ConcertRide", url: base },
        });
        const breadcrumbJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
            { "@type": "ListItem", position: 2, name: "FAQ", item: `${base}/faq` },
          ],
        });
        const items = faqs.map((f) => `<dt>${esc(f.q)}</dt>\n  <dd>${esc(f.a)}</dd>`).join("\n  ");
        return `<script type="application/ld+json">${webPageJsonLd}</script>
<script type="application/ld+json">${breadcrumbJsonLd}</script>
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
      body: (() => {
        const aboutPageJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "@id": `${base}/acerca-de#webpage`,
          url: `${base}/acerca-de`,
          name: "Acerca de ConcertRide — Carpooling para conciertos y festivales en España",
          description: "ConcertRide es la plataforma española de viaje compartido exclusiva para conciertos y festivales. Fundada en 2026. Sin comisiones, sin intermediarios. Conductores verificados.",
          inLanguage: "es-ES",
          isPartOf: { "@type": "WebSite", "@id": `${base}/#website` },
          about: { "@type": "Organization", "@id": `${base}/#organization` },
          dateModified: "2026-05-03",
          speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable", "p:first-of-type"] },
        });
        const orgDetailJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${base}/#organization`,
          name: "ConcertRide",
          url: base,
          foundingDate: "2026",
          foundingLocation: { "@type": "Place", name: "España" },
          legalName: "ConcertRide ES",
          description: "Plataforma española de carpooling exclusiva para conciertos y festivales de música. 0 % de comisión. Conductores verificados con carnet. Pago directo en efectivo o Bizum.",
          knowsAbout: ["carpooling", "festivales de música", "conciertos en España", "transporte compartido", "ride-sharing", "economía colaborativa"],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Rutas de carpooling a festivales de música en España 2026",
            numberOfItems: 96,
            itemListElement: [
              { "@type": "Offer", name: "Carpooling a Mad Cool Festival (Madrid)", price: "4", priceCurrency: "EUR", url: `${base}/festivales/mad-cool` },
              { "@type": "Offer", name: "Carpooling a Primavera Sound (Barcelona)", price: "5", priceCurrency: "EUR", url: `${base}/festivales/primavera-sound` },
              { "@type": "Offer", name: "Carpooling a BBK Live (Bilbao)", price: "5", priceCurrency: "EUR", url: `${base}/festivales/bbk-live` },
              { "@type": "Offer", name: "Carpooling a Sónar (Barcelona)", price: "5", priceCurrency: "EUR", url: `${base}/festivales/sonar` },
              { "@type": "Offer", name: "Carpooling a FIB Benicàssim", price: "6", priceCurrency: "EUR", url: `${base}/festivales/fib` },
              { "@type": "Offer", name: "Carpooling a Resurrection Fest (Viveiro)", price: "8", priceCurrency: "EUR", url: `${base}/festivales/resurrection-fest` },
              { "@type": "Offer", name: "Carpooling a Arenal Sound (Castellón)", price: "4", priceCurrency: "EUR", url: `${base}/festivales/arenal-sound` },
              { "@type": "Offer", name: "Carpooling a Medusa Festival (Cullera)", price: "5", priceCurrency: "EUR", url: `${base}/festivales/medusa-festival` },
              { "@type": "Offer", name: "Carpooling a Viña Rock (Almansa)", price: "5", priceCurrency: "EUR", url: `${base}/festivales/vina-rock` },
              { "@type": "Offer", name: "Carpooling a O Son do Camiño (Santiago)", price: "8", priceCurrency: "EUR", url: `${base}/festivales/o-son-do-camino` },
              { "@type": "Offer", name: "Carpooling a Cala Mijas Fest (Málaga)", price: "5", priceCurrency: "EUR", url: `${base}/festivales/cala-mijas` },
              { "@type": "Offer", name: "Carpooling a Sonorama Ribera (Aranda de Duero)", price: "6", priceCurrency: "EUR", url: `${base}/festivales/sonorama-ribera` },
              { "@type": "Offer", name: "Carpooling a Zevra Festival (Valencia)", price: "4", priceCurrency: "EUR", url: `${base}/festivales/zevra-festival` },
              { "@type": "Offer", name: "Carpooling a Low Festival (Benidorm)", price: "5", priceCurrency: "EUR", url: `${base}/festivales/low-festival` },
              { "@type": "Offer", name: "Carpooling a Tomavistas (Madrid)", price: "4", priceCurrency: "EUR", url: `${base}/festivales/tomavistas` },
              { "@type": "Offer", name: "Carpooling a Cruïlla (Barcelona)", price: "5", priceCurrency: "EUR", url: `${base}/festivales/cruilla` },
            ],
          },
          sameAs: [
            "https://twitter.com/concertride_es",
            "https://www.instagram.com/concertride_es/",
            "https://www.facebook.com/concertride.me",
            "https://www.linkedin.com/company/concertride-es",
            "https://www.crunchbase.com/organization/concertride-es",
            "https://www.wikidata.org/wiki/Q130455178",
          ],
        });
        const breadcrumbJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
            { "@type": "ListItem", position: 2, name: "Acerca de", item: `${base}/acerca-de` },
          ],
        });
        const founderJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "@id": `${base}/#founder`,
          name: "Alejandro Lalaguna",
          url: `${base}/acerca-de`,
          jobTitle: "Fundador",
          worksFor: { "@type": "Organization", "@id": `${base}/#organization` },
          knowsAbout: ["Carpooling", "Conciertos en España", "Festivales de música", "Movilidad sostenible"],
        });
        const acercaFaqJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: "es-ES",
          mainEntity: [
            { "@type": "Question", name: "¿Qué es ConcertRide?", acceptedAnswer: { "@type": "Answer", text: "ConcertRide es una plataforma española de carpooling especializada en conciertos y festivales de música. Conecta conductores y pasajeros que van al mismo evento para compartir el viaje sin comisión de plataforma. Opera exclusivamente en España y cubre más de 16 festivales principales en 2026." } },
            { "@type": "Question", name: "¿Cobra ConcertRide comisión?", acceptedAnswer: { "@type": "Answer", text: "No. ConcertRide cobra 0% de comisión. El 100% del precio del asiento va al conductor para cubrir combustible y peajes. El pago es en efectivo o Bizum directamente al conductor el día del viaje — la plataforma no retiene ningún pago." } },
            { "@type": "Question", name: "¿Es ConcertRide lo mismo que BlaBlaCar?", acceptedAnswer: { "@type": "Answer", text: "No. BlaBlaCar es una plataforma de carpooling generalista que cobra 12–18% de comisión al pasajero y gestiona el pago por tarjeta. ConcertRide está especializada en conciertos y festivales (búsqueda por evento, no por ruta genérica), cobra 0% de comisión y el pago es directo en persona." } },
            { "@type": "Question", name: "¿Es legal el carpooling de ConcertRide en España?", acceptedAnswer: { "@type": "Answer", text: "Sí. El carpooling entre particulares para compartir gastos de desplazamiento es legal en España. El Tribunal Supremo confirmó en 2017 (caso BlaBlaCar) que este modelo no requiere licencia VTC, siempre que el precio cubra solo combustible y peajes. ConcertRide opera bajo este modelo de gastos compartidos conforme a la DGT." } },
            { "@type": "Question", name: "¿Cómo se verifican los conductores en ConcertRide?", acceptedAnswer: { "@type": "Answer", text: "Todos los conductores deben subir y verificar su carnet de conducir antes de publicar su primer viaje. Además, se requiere verificación de email para todos los usuarios. Los conductores acumulan valoraciones de los pasajeros visibles en su perfil." } },
          ],
        });
        return `<script type="application/ld+json">${aboutPageJsonLd}</script>
<script type="application/ld+json">${orgDetailJsonLd}</script>
<script type="application/ld+json">${founderJsonLd}</script>
<script type="application/ld+json">${acercaFaqJsonLd}</script>
<script type="application/ld+json">${breadcrumbJsonLd}</script>
<p>ConcertRide es la plataforma española de viaje compartido exclusiva para conciertos y festivales. Fundada en 2026, conecta conductores y pasajeros que van al mismo evento para compartir gastos de desplazamiento. Sin comisiones, sin intermediarios.</p>
<h2>Nuestra misión</h2>
<p>Que nadie se quede sin ir a un concierto por falta de transporte o por no poder pagar un taxi. Y que el 80 % de las emisiones de carbono que genera el transporte de asistentes a festivales empiece a reducirse.</p>
<h2>Cómo funciona</h2>
<p>ConcertRide conecta conductores con plazas libres y pasajeros que van al mismo concierto o festival. El conductor publica el viaje, fija el precio por asiento (solo combustible y peajes), y los pasajeros reservan. El pago es en efectivo o Bizum el día del viaje. ConcertRide no cobra comisión — el 100 % del precio va al conductor.</p>
<h2>Datos clave</h2>
<ul>
  <li>0 % de comisión de plataforma</li>
  <li>16 festivales cubiertos en 2026</li>
  <li>96+ rutas de carpooling programáticas</li>
  <li>17 ciudades con landing pages de conciertos</li>
  <li>Conductores verificados con carnet de conducir</li>
  <li>Precio medio: 8–15 € por asiento</li>
</ul>`;
      })(),
    },
    "/contacto": {
      title: `Contacto — ${SITE_NAME}`,
      description: "Ponte en contacto con el equipo de ConcertRide. Soporte para conductores, pasajeros, prensa y colaboraciones.",
      canonical: `${base}/contacto`,
      h1: "Contacto — ConcertRide",
      body: (() => {
        const contactPageJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "@id": `${base}/contacto#webpage`,
          url: `${base}/contacto`,
          name: "Contacto — ConcertRide",
          inLanguage: "es-ES",
          isPartOf: { "@type": "WebSite", "@id": `${base}/#website`, name: "ConcertRide", url: base },
          about: { "@type": "Organization", "@id": `${base}/#organization` },
        });
        const breadcrumbJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
            { "@type": "ListItem", position: 2, name: "Contacto", item: `${base}/contacto` },
          ],
        });
        return `<script type="application/ld+json">${contactPageJsonLd}</script>
<script type="application/ld+json">${breadcrumbJsonLd}</script>
<p>¿Tienes alguna pregunta o sugerencia? Escríbenos a <a href="mailto:alejandrolalaguna@gmail.com">alejandrolalaguna@gmail.com</a> y te responderemos lo antes posible.</p>
<p>Para soporte de usuarios: usa el chat en la plataforma o escríbenos por email.</p>
<p>Para medios y prensa: <a href="${base}/prensa">Sala de prensa →</a></p>`;
      })(),
    },
    "/blog": {
      title: `Blog ConcertRide — Guías de transporte para festivales y conciertos en España | ${SITE_NAME}`,
      description: "Guías de transporte, comparativas y consejos para ir a festivales en España en coche compartido. BlaBlaCar vs ConcertRide, autobuses, vuelta de madrugada y más.",
      canonical: `${base}/blog`,
      h1: "Blog de ConcertRide — Carpooling para conciertos y festivales",
      body: (() => {
        const posts = [
          { slug: "festivales-musica-espana-2026", title: "Festivales de música en España 2026: fechas, recintos y transporte", abstract: "Calendario completo de los 16 festivales de música en España en 2026: Mad Cool (Madrid, 9–11 jul), Primavera Sound (Barcelona, 28 may–1 jun), Sónar (Barcelona, 18–20 jun), BBK Live (Bilbao, 9–11 jul), Arenal Sound (Burriana, 29 jul–2 ago) y más. Fechas, recintos y opciones de carpooling desde ConcertRide." },
          { slug: "que-llevar-al-festival", title: "Qué llevar al festival 2026: lista completa y consejos", abstract: "Lista definitiva de equipaje para festivales de música en España 2026: lo imprescindible, lo que se olvida siempre y lo que debes saber si vas en carpooling. Organizada por días de duración y modo de transporte." },
          { slug: "autobuses-festivales-espana-2026", title: "Autobuses a festivales de España 2026: guía completa festival por festival", abstract: "Solo 8 de los 16 festivales españoles tienen lanzadera oficial. Guía festival por festival: qué autobús existe, si es oficial o privado, horarios, precios y cuándo el carpooling es la única alternativa real (desde 3 €/asiento)." },
          { slug: "blablacar-vs-concertride", title: "BlaBlaCar vs ConcertRide 2026: qué app elegir para festivales sin comisión", abstract: "ConcertRide cobra 0% de comisión frente al 12–18% de BlaBlaCar, permite buscar por festival concreto en lugar de por ruta genérica, y acepta pago en efectivo o Bizum sin tarjeta obligatoria. Comparativa completa con 11 criterios." },
          { slug: "como-volver-festival-madrugada", title: "Cómo volver de un festival de madrugada (sin pagar 90 € de taxi)", abstract: "El metro cierra antes de que acabe el último concierto en casi todos los festivales españoles. Un taxi de madrugada desde IFEMA o Kobetamendi cuesta 60–100 €. El carpooling con ConcertRide es la opción más fiable y económica para la vuelta — reservada antes del festival." },
          { slug: "huella-carbono-festivales-carpooling", title: "Huella de carbono de un festival: por qué el carpooling es la acción más efectiva", abstract: "El 80% de la huella de carbono de un festival proviene del transporte de asistentes. Compartir coche entre cuatro personas reduce las emisiones individuales un 75% respecto al coche en solitario — más que cualquier otra acción individual." },
        ];
        const blogLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": `${base}/blog#blog`,
          url: `${base}/blog`,
          name: "Blog ConcertRide — Carpooling, festivales y sostenibilidad",
          description: "Comparativas, guías de transporte y sostenibilidad para asistentes a festivales en España.",
          inLanguage: "es-ES",
          datePublished: "2026-04-10",
          dateModified: posts[0] ? "2026-05-01" : "2026-04-10",
          isPartOf: { "@id": `${base}/#website` },
          about: { "@id": `${base}/#service` },
          publisher: { "@id": `${base}/#organization` },
          speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable"] },
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            "@id": `${base}/blog/${p.slug}#article`,
            headline: p.title,
            url: `${base}/blog/${p.slug}`,
            abstract: p.abstract,
            inLanguage: "es-ES",
          })),
        });
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
        const breadcrumbLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${base}/blog` },
          ],
        });
        return `<script type="application/ld+json">${blogLd}</script>
<script type="application/ld+json">${faqLd}</script>
<script type="application/ld+json">${itemListLd}</script>
<script type="application/ld+json">${breadcrumbLd}</script>
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
      body: (() => {
        const webPageJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${base}/prensa#webpage`,
          url: `${base}/prensa`,
          name: "Sala de prensa — ConcertRide",
          inLanguage: "es-ES",
          isPartOf: { "@type": "WebSite", "@id": `${base}/#website`, name: "ConcertRide", url: base },
          about: { "@type": "Organization", "@id": `${base}/#organization` },
        });
        const breadcrumbJsonLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
            { "@type": "ListItem", position: 2, name: "Prensa", item: `${base}/prensa` },
          ],
        });
        return `<script type="application/ld+json">${webPageJsonLd}</script>
<script type="application/ld+json">${breadcrumbJsonLd}</script>
<p>ConcertRide es la plataforma española de carpooling exclusiva para conciertos y festivales. Para peticiones de prensa, contacta con nosotros.</p>
<h2>Datos clave de ConcertRide</h2>
<ul>
  <li>Fundada en 2026 en España</li>
  <li>16 festivales cubiertos en 2026 (Mad Cool, Primavera Sound, Sónar, BBK Live, Arenal Sound, etc.)</li>
  <li>96+ rutas de carpooling programáticas (ciudad→festival)</li>
  <li>0 % de comisión — el 100 % del precio va al conductor</li>
  <li>Pago en efectivo o Bizum (sin tarjeta obligatoria)</li>
  <li>Conductores verificados con carnet de conducir</li>
</ul>
<p>Contacto para medios: <a href="mailto:alejandrolalaguna@gmail.com">alejandrolalaguna@gmail.com</a></p>`;
      })(),
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
      description: "96 rutas de coche compartido a festivales en España: Madrid, Barcelona, Valencia, Sevilla, Bilbao y más. Precios desde 3 €/asiento. Sin comisión.",
      canonical: `${base}/rutas`,
      h1: "Rutas de carpooling a festivales en España 2026",
      body: (() => {
        const topRoutes = [
          // Mad Cool
          { slug: "madrid-mad-cool", label: "Madrid → Mad Cool Festival", price: "4–7 €", time: "25 min" },
          { slug: "toledo-mad-cool", label: "Toledo → Mad Cool Festival", price: "4–7 €", time: "55 min" },
          { slug: "guadalajara-mad-cool", label: "Guadalajara → Mad Cool Festival", price: "3–6 €", time: "50 min" },
          { slug: "segovia-mad-cool", label: "Segovia → Mad Cool Festival", price: "4–7 €", time: "1 h 10 min" },
          { slug: "valencia-mad-cool", label: "Valencia → Mad Cool Festival", price: "10–14 €", time: "3 h 20 min" },
          { slug: "zaragoza-mad-cool", label: "Zaragoza → Mad Cool Festival", price: "9–13 €", time: "3 h" },
          { slug: "barcelona-mad-cool", label: "Barcelona → Mad Cool Festival", price: "15–20 €", time: "5 h 30 min" },
          // Primavera Sound
          { slug: "madrid-primavera-sound", label: "Madrid → Primavera Sound", price: "15–20 €", time: "5 h 30 min" },
          { slug: "valencia-primavera-sound", label: "Valencia → Primavera Sound", price: "10–14 €", time: "3 h 15 min" },
          { slug: "zaragoza-primavera-sound", label: "Zaragoza → Primavera Sound", price: "8–12 €", time: "2 h 45 min" },
          { slug: "bilbao-primavera-sound", label: "Bilbao → Primavera Sound", price: "15–20 €", time: "5 h" },
          { slug: "lleida-primavera-sound", label: "Lleida → Primavera Sound", price: "5–8 €", time: "1 h 45 min" },
          { slug: "barcelona-primavera-sound", label: "Barcelona → Primavera Sound", price: "4–8 €", time: "25 min" },
          // Sónar
          { slug: "madrid-sonar", label: "Madrid → Sónar Barcelona", price: "15–20 €", time: "5 h 30 min" },
          { slug: "zaragoza-sonar", label: "Zaragoza → Sónar Barcelona", price: "8–12 €", time: "2 h 45 min" },
          { slug: "valencia-sonar", label: "Valencia → Sónar Barcelona", price: "10–14 €", time: "3 h 15 min" },
          { slug: "barcelona-sonar", label: "Barcelona → Sónar", price: "4–8 €", time: "30 min" },
          // FIB Benicàssim
          { slug: "madrid-fib", label: "Madrid → FIB Benicàssim", price: "12–18 €", time: "3 h 45 min" },
          { slug: "valencia-fib", label: "Valencia → FIB Benicàssim", price: "5–8 €", time: "1 h" },
          { slug: "barcelona-fib", label: "Barcelona → FIB Benicàssim", price: "8–14 €", time: "2 h 30 min" },
          { slug: "zaragoza-fib", label: "Zaragoza → FIB Benicàssim", price: "6–10 €", time: "2 h" },
          // BBK Live
          { slug: "madrid-bbk-live", label: "Madrid → BBK Live Bilbao", price: "18–28 €", time: "4 h" },
          { slug: "barcelona-bbk-live", label: "Barcelona → BBK Live Bilbao", price: "15–22 €", time: "5 h" },
          { slug: "san-sebastian-bbk-live", label: "San Sebastián → BBK Live Bilbao", price: "3–6 €", time: "1 h" },
          { slug: "vitoria-gasteiz-bbk-live", label: "Vitoria-Gasteiz → BBK Live Bilbao", price: "3–6 €", time: "1 h" },
          { slug: "pamplona-bbk-live", label: "Pamplona → BBK Live Bilbao", price: "5–8 €", time: "1 h 30 min" },
          { slug: "santander-bbk-live", label: "Santander → BBK Live Bilbao", price: "4–7 €", time: "1 h 15 min" },
          // Resurrection Fest
          { slug: "madrid-resurrection-fest", label: "Madrid → Resurrection Fest Viveiro", price: "30–55 €", time: "7 h 30 min" },
          { slug: "a-coruna-resurrection-fest", label: "A Coruña → Resurrection Fest Viveiro", price: "4–7 €", time: "1 h 30 min" },
          { slug: "santiago-de-compostela-resurrection-fest", label: "Santiago de Compostela → Resurrection Fest", price: "4–7 €", time: "1 h 45 min" },
          { slug: "bilbao-resurrection-fest", label: "Bilbao → Resurrection Fest Viveiro", price: "20–30 €", time: "4 h 30 min" },
          // Arenal Sound
          { slug: "madrid-arenal-sound", label: "Madrid → Arenal Sound Castellón", price: "14–22 €", time: "4 h" },
          { slug: "valencia-arenal-sound", label: "Valencia → Arenal Sound Castellón", price: "4–7 €", time: "1 h" },
          { slug: "barcelona-arenal-sound", label: "Barcelona → Arenal Sound Castellón", price: "8–14 €", time: "2 h 30 min" },
          { slug: "castellon-de-la-plana-arenal-sound", label: "Castellón → Arenal Sound", price: "3–5 €", time: "20 min" },
          { slug: "alicante-arenal-sound", label: "Alicante → Arenal Sound Castellón", price: "8–12 €", time: "2 h" },
          // Medusa Festival
          { slug: "madrid-medusa-festival", label: "Madrid → Medusa Festival Cullera", price: "12–18 €", time: "3 h 20 min" },
          { slug: "barcelona-medusa-festival", label: "Barcelona → Medusa Festival Cullera", price: "10–16 €", time: "3 h" },
          { slug: "valencia-medusa-festival", label: "Valencia → Medusa Festival Cullera", price: "4–7 €", time: "50 min" },
          { slug: "alicante-medusa-festival", label: "Alicante → Medusa Festival Cullera", price: "6–10 €", time: "1 h 45 min" },
          // Viña Rock
          { slug: "madrid-vina-rock", label: "Madrid → Viña Rock Almansa", price: "8–14 €", time: "2 h" },
          { slug: "valencia-vina-rock", label: "Valencia → Viña Rock Almansa", price: "6–10 €", time: "1 h 30 min" },
          { slug: "murcia-vina-rock", label: "Murcia → Viña Rock Almansa", price: "5–8 €", time: "1 h 15 min" },
          { slug: "alicante-vina-rock", label: "Alicante → Viña Rock Almansa", price: "5–8 €", time: "1 h 30 min" },
          // O Son do Camiño
          { slug: "madrid-o-son-do-camino", label: "Madrid → O Son do Camiño Santiago", price: "30–50 €", time: "7 h" },
          { slug: "a-coruna-o-son-do-camino", label: "A Coruña → O Son do Camiño Santiago", price: "3–5 €", time: "45 min" },
          { slug: "vigo-o-son-do-camino", label: "Vigo → O Son do Camiño Santiago", price: "4–6 €", time: "1 h" },
          { slug: "pontevedra-o-son-do-camino", label: "Pontevedra → O Son do Camiño Santiago", price: "3–5 €", time: "40 min" },
          // Cala Mijas
          { slug: "madrid-cala-mijas", label: "Madrid → Cala Mijas Fest Málaga", price: "18–28 €", time: "4 h 30 min" },
          { slug: "malaga-cala-mijas", label: "Málaga → Cala Mijas Fest", price: "3–5 €", time: "20 min" },
          { slug: "sevilla-cala-mijas", label: "Sevilla → Cala Mijas Fest Málaga", price: "6–9 €", time: "2 h" },
          { slug: "granada-cala-mijas", label: "Granada → Cala Mijas Fest Málaga", price: "5–8 €", time: "1 h 30 min" },
          { slug: "cadiz-cala-mijas", label: "Cádiz → Cala Mijas Fest Málaga", price: "6–9 €", time: "2 h" },
          // Sonorama Ribera
          { slug: "madrid-sonorama-ribera", label: "Madrid → Sonorama Ribera Aranda", price: "6–10 €", time: "1 h 30 min" },
          { slug: "valladolid-sonorama-ribera", label: "Valladolid → Sonorama Ribera Aranda", price: "4–7 €", time: "1 h" },
          { slug: "burgos-sonorama-ribera", label: "Burgos → Sonorama Ribera Aranda", price: "3–6 €", time: "1 h" },
          { slug: "zaragoza-sonorama-ribera", label: "Zaragoza → Sonorama Ribera Aranda", price: "8–12 €", time: "2 h 30 min" },
          // Zevra Festival
          { slug: "madrid-zevra-festival", label: "Madrid → Zevra Festival Valencia", price: "10–14 €", time: "3 h 20 min" },
          { slug: "barcelona-zevra-festival", label: "Barcelona → Zevra Festival Valencia", price: "10–14 €", time: "3 h" },
          { slug: "alicante-zevra-festival", label: "Alicante → Zevra Festival Valencia", price: "6–10 €", time: "1 h 30 min" },
          { slug: "murcia-zevra-festival", label: "Murcia → Zevra Festival Valencia", price: "8–12 €", time: "2 h" },
          { slug: "valencia-zevra-festival", label: "Valencia → Zevra Festival", price: "3–5 €", time: "20 min" },
          // Low Festival
          { slug: "madrid-low-festival", label: "Madrid → Low Festival Benidorm", price: "14–20 €", time: "3 h 30 min" },
          { slug: "valencia-low-festival", label: "Valencia → Low Festival Benidorm", price: "6–10 €", time: "1 h 30 min" },
          { slug: "alicante-low-festival", label: "Alicante → Low Festival Benidorm", price: "4–7 €", time: "45 min" },
          { slug: "murcia-low-festival", label: "Murcia → Low Festival Benidorm", price: "6–9 €", time: "1 h 30 min" },
          // Tomavistas
          { slug: "toledo-tomavistas", label: "Toledo → Tomavistas Madrid", price: "4–7 €", time: "55 min" },
          { slug: "segovia-tomavistas", label: "Segovia → Tomavistas Madrid", price: "4–7 €", time: "1 h 10 min" },
          { slug: "guadalajara-tomavistas", label: "Guadalajara → Tomavistas Madrid", price: "3–5 €", time: "50 min" },
          { slug: "valladolid-tomavistas", label: "Valladolid → Tomavistas Madrid", price: "6–9 €", time: "1 h 30 min" },
          // Cruïlla
          { slug: "madrid-cruilla", label: "Madrid → Cruïlla Barcelona", price: "15–20 €", time: "5 h 30 min" },
          { slug: "zaragoza-cruilla", label: "Zaragoza → Cruïlla Barcelona", price: "8–12 €", time: "2 h 45 min" },
          { slug: "tarragona-cruilla", label: "Tarragona → Cruïlla Barcelona", price: "4–7 €", time: "1 h" },
          { slug: "lleida-cruilla", label: "Lleida → Cruïlla Barcelona", price: "5–8 €", time: "1 h 45 min" },
          { slug: "barcelona-cruilla", label: "Barcelona → Cruïlla", price: "4–7 €", time: "25 min" },
        ];
        const collectionPageLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${base}/rutas#webpage`,
          url: `${base}/rutas`,
          name: "Rutas de carpooling a festivales en España 2026 | ConcertRide",
          description: "96+ rutas de viaje compartido a festivales de música en España. Sin comisión, conductores verificados.",
          inLanguage: "es-ES",
          datePublished: "2026-04-10",
          dateModified: "2026-05-03",
          isPartOf: { "@id": `${base}/#website` },
          about: { "@id": `${base}/#service` },
          speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable"] },
        });
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
          numberOfItems: 96,
          itemListElement: topRoutes.map((r, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: r.label,
            url: `${base}/rutas/${r.slug}`,
          })),
        });
        const breadcrumbLd = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
            { "@type": "ListItem", position: 2, name: "Rutas", item: `${base}/rutas` },
          ],
        });
        return `<script type="application/ld+json">${collectionPageLd}</script>
<script type="application/ld+json">${faqLd}</script>
<script type="application/ld+json">${itemListLd}</script>
<script type="application/ld+json">${breadcrumbLd}</script>
<p>ConcertRide ofrece 96 rutas de carpooling a festivales en España en 2026, cubriendo los 16 festivales más importantes desde 40+ ciudades de origen. Precio por asiento: desde 3 € (rutas locales) hasta 55 € (Resurrection Fest desde Madrid). Sin comisión de plataforma — el 100 % del precio va al conductor. Pago en efectivo o Bizum el día del viaje. Conductores verificados con carnet de conducir.</p>
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
  image?: string;
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
      { q: "¿Cómo llegar al Sonorama desde Madrid?", a: "Aranda de Duero está a 150 km de Madrid (1h 30 min por la A-1). Con ConcertRide el precio es 5–8 €/asiento. Bus La Sepulvedana Madrid–Aranda: 10–15 €, 2 veces al día." },
      { q: "¿Hay bus desde Madrid al Sonorama Ribera?", a: "Sí. El autobús La Sepulvedana Madrid–Aranda de Duero cuesta 10–15 € y tarda unas 2 horas, pero solo opera 2 veces al día y no hay servicio nocturno. El carpooling con ConcertRide (5–8 €/asiento) sale a la hora que acordáis y permite volver de madrugada." },
      { q: "¿Cómo llegar al Sonorama desde Valladolid?", a: "Valladolid–Aranda de Duero son 100 km (1h por la A-11 o N-122). Con ConcertRide el precio es 4–7 €/asiento. Es la ruta más corta al festival desde una ciudad grande." },
      { q: "¿Cuándo es el Sonorama Ribera 2026?", a: "Sonorama Ribera 2026 se celebra del 6 al 9 de agosto en El Ferial, Aranda de Duero (Burgos, Castilla y León)." },
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
      { q: "¿Cómo llegar al Low Festival desde Valencia?", a: "Benidorm está a 150 km de Valencia (1h 30 min por la AP-7). Con ConcertRide el precio es 5–8 €/asiento. No existe transporte público directo al recinto del festival." },
      { q: "¿Cómo llegar al Low Festival desde Alicante?", a: "Benidorm está a 45 km de Alicante (35 min por la AP-7). Con ConcertRide el precio es 3–5 €/asiento. Taxi desde Alicante 35–50 €. El TRAM (tranvía) Alicante–Benidorm funciona pero no conecta directamente con el recinto del festival." },
      { q: "¿Hay transporte público al Low Festival?", a: "No existe lanzadera oficial ni transporte público directo al recinto del Low Festival en Benidorm. El TRAM Alicante–Benidorm llega a la ciudad pero no al recinto. El carpooling con ConcertRide (3–17 €/asiento) es la opción más usada para quienes vienen de Alicante, Valencia y Madrid." },
      { q: "¿Cuándo es el Low Festival 2026?", a: "Low Festival 2026 se celebra del 24 al 26 de julio en la Playa de Poniente, Benidorm (Alicante)." },
    ],
  },
  "tomavistas": {
    name: "Tomavistas",
    shortName: "Tomavistas",
    city: "Madrid",
    venue: "Jardines del Buen Retiro",
    venueAddress: "Jardines del Buen Retiro, Parque del Retiro, 28009 Madrid",
    dates: "15–17 mayo 2026",
    startDate: "2026-05-15",
    endDate: "2026-05-17",
    priceFrom: "4",
    blurb: "Tomavistas es el festival de indie y alternativo de Madrid, celebrado en los Jardines del Buen Retiro (Parque del Retiro). Accesible en metro L2 (Retiro) o L9 (Ibiza). Muy popular entre el público madrileño y visitantes de provincias cercanas.",
    originCities: [
      { city: "Madrid", km: 15, drivingTime: "25 min", range: "4–7 €/asiento" },
      { city: "Toledo", km: 75, drivingTime: "55 min", range: "4–7 €/asiento" },
      { city: "Guadalajara", km: 60, drivingTime: "50 min", range: "3–6 €/asiento" },
      { city: "Valencia", km: 355, drivingTime: "3h 20 min", range: "10–14 €/asiento" },
      { city: "Zaragoza", km: 325, drivingTime: "3h", range: "9–13 €/asiento" },
    ],
    faqs: [
      { q: "¿Cuándo se celebra Tomavistas 2026?", a: "La edición 2026 de Tomavistas está prevista para el 15, 16 y 17 de mayo en los Jardines del Buen Retiro, Madrid." },
      { q: "¿Cómo llegar a Tomavistas en transporte público?", a: "Los Jardines del Buen Retiro están muy bien comunicados: metro L2 parada Retiro o L9 parada Ibiza, ambas a menos de 5 minutos a pie del recinto. La N26 es el bus nocturno de vuelta." },
      { q: "¿Hay parking en Tomavistas?", a: "No hay parking en los Jardines del Buen Retiro. El metro es la opción recomendada para residentes en Madrid. Los visitantes de fuera de Madrid usan ConcertRide para llegar directamente (10–14 € desde Valencia, 9–13 € desde Zaragoza, 15–20 € desde Barcelona)." },
      { q: "¿Cuánto cuesta ir a Tomavistas desde Valencia?", a: "Valencia–Madrid son 355 km (3h 20 min). Por ConcertRide el precio es 10–14 €/asiento. Desde Zaragoza: 325 km (3h), 9–13 €/asiento. Desde Barcelona: 620 km (5h 30 min), 15–20 €/asiento." },
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
      { q: "¿Cómo llegar al Cruïlla desde Madrid?", a: "Madrid–Barcelona (Parc del Fòrum) son 620 km (5h 30 min). Con ConcertRide el precio es 15–20 €/asiento desde Madrid. Metro L4 Besòs Mar a 10 min a pie del recinto." },
      { q: "¿Cómo llegar al Cruïlla en metro desde Barcelona?", a: "Metro L4 (línea amarilla), parada Besòs Mar. A 10 minutos a pie del Parc del Fòrum. Servicio ampliado en noches de festival hasta las 3:00–4:00." },
      { q: "¿Cuánto cuesta ir a Cruïlla desde Valencia?", a: "Valencia–Barcelona (Fòrum) son 355 km (3h 15 min). Por ConcertRide el precio es 10–14 €/asiento desde Valencia. El AVE Valencia–Barcelona cuesta 20–60 € pero no llega al recinto." },
      { q: "¿Cuándo es Cruïlla 2026?", a: "Cruïlla 2026 se celebra del 9 al 12 de julio en el Parc del Fòrum, Barcelona. Busca viajes disponibles en concertride.me." },
    ],
  },
};

// ── City data ───────────────────────────────────────────────────────────────
interface CityData {
  name: string;
  region: string;
  blurb: string;
  venues: string[];
  lat: number;
  lng: number;
}

const CITIES: Record<string, CityData> = {
  madrid: { name: "Madrid", region: "Comunidad de Madrid", blurb: "Madrid concentra la mayor parte de la actividad de conciertos y festivales de España. WiZink Center, Palacio Vistalegre, Caja Mágica e IFEMA (sede de Mad Cool) acogen cada año giras internacionales y festivales de referencia.", venues: ["WiZink Center", "Palacio Vistalegre", "Caja Mágica", "IFEMA (Mad Cool Festival)"], lat: 40.4168, lng: -3.7038 },
  barcelona: { name: "Barcelona", region: "Cataluña", blurb: "Barcelona es la capital europea de los festivales de música electrónica e indie. Palau Sant Jordi, Parc del Fòrum (Primavera Sound, Cruïlla) y Fira Montjuïc (Sónar) son los tres epicentros.", venues: ["Palau Sant Jordi", "Parc del Fòrum (Primavera Sound / Cruïlla)", "Fira Montjuïc (Sónar)"], lat: 41.3851, lng: 2.1734 },
  valencia: { name: "Valencia", region: "Comunidad Valenciana", blurb: "Valencia ciudad acoge Zevra Festival y conciertos urbanos frecuentes. Su provincia concentra Arenal Sound en Burriana, Medusa en Cullera y FIB en Benicàssim.", venues: ["Zevra Festival (La Marina)", "Arenal Sound (Burriana)", "Medusa Festival (Cullera)"], lat: 39.4699, lng: -0.3763 },
  sevilla: { name: "Sevilla", region: "Andalucía", blurb: "Próximos conciertos en Sevilla 2026: los recintos principales son Estadio La Cartuja (giras de estadio, 60.000 plazas), FIBES Sevilla (9.500 plazas), Palacio de los Deportes San Pablo (7.000 plazas) y Cartuja Center CITE. El festival Interestelar Sevilla se celebra cada mayo en el Charco de la Pava (40.000 personas) y el Icónica Sevilla Fest en la Plaza de España. La música en Sevilla incluye también conciertos de cantautor e indie en el Teatro de la Maestranza y el Teatro Lope de Vega. Sevilla es punto de origen para festivales andaluces: Cala Mijas en Málaga (200 km) y Andalucía Big. ConcertRide conecta a asistentes de Sevilla con conductores de toda España.", venues: ["Estadio La Cartuja", "FIBES Sevilla", "Palacio de los Deportes San Pablo", "Interestelar Sevilla (Charco de la Pava)", "Icónica Sevilla Fest"], lat: 37.3891, lng: -5.9845 },
  bilbao: { name: "Bilbao", region: "País Vasco", blurb: "Bilbao es referencia para festivales internacionales del norte: BBK Live en Kobetamendi y Bilbao Arena para tours indoor.", venues: ["Kobetamendi (BBK Live)", "Bilbao Arena"], lat: 43.2630, lng: -2.9340 },
  malaga: { name: "Málaga", region: "Andalucía", blurb: "Málaga concentra los festivales más solares de España: Cala Mijas en Mijas, Andalucía Big y Marenostrum en Fuengirola.", venues: ["Cala Mijas Fest", "Andalucía Big Festival", "Marenostrum Music Castle"], lat: 36.7213, lng: -4.4214 },
  zaragoza: { name: "Zaragoza", region: "Aragón", blurb: "Zaragoza es nodo estratégico equidistante entre Madrid y Barcelona, y origen natural para viajes a Primavera Sound, Mad Cool y Pirineos Sur.", venues: ["Pabellón Príncipe Felipe", "Pirineos Sur (Lanuza)"], lat: 41.6488, lng: -0.8891 },
  granada: { name: "Granada", region: "Andalucía", blurb: "Granada acoge Granada Sound en septiembre y es origen frecuente para viajes a festivales andaluces del verano.", venues: ["Granada Sound (Cortijo del Conde)"], lat: 37.1773, lng: -3.5986 },
  donostia: { name: "Donostia / San Sebastián", region: "País Vasco", blurb: "Conciertos en Donostia 2026 y conciertos en San Sebastián 2026: el Heineken Jazzaldia (Plaza de la Trinidad / Kursaal) cada julio es el evento de referencia. Donostia Arena (10.000 plazas) acoge giras nacionales e internacionales. La música en Donostia incluye conciertos en el Velódromo de Anoeta y el Teatro Victoria Eugenia. La cercanía con BBK Live Bilbao (100 km) y Azkena Rock Vitoria (100 km) hace que muchos viajes compartidos a festivales del norte salgan de Donostia.", venues: ["Plaza de la Trinidad (Jazzaldia)", "Kursaal", "Donostia Arena", "Velódromo de Anoeta", "Sala Dabadaba"], lat: 43.3183, lng: -1.9812 },
  "santiago-de-compostela": { name: "Santiago de Compostela", region: "Galicia", blurb: "Santiago acoge O Son do Camiño en Monte do Gozo cada junio, uno de los festivales con mayor aforo de España.", venues: ["Monte do Gozo (O Son do Camiño)"], lat: 42.8782, lng: -8.5448 },
  alicante: { name: "Alicante", region: "Comunidad Valenciana", blurb: "Alicante concentra giras nacionales e internacionales en la Plaza de Toros, ADDA y Pabellón Pitiu Rochel. Provincia con Low Festival (Benidorm) y Iboga Summer (Tavernes).", venues: ["Plaza de Toros de Alicante", "ADDA", "Pabellón Pitiu Rochel"], lat: 38.3452, lng: -0.4815 },
  pamplona: { name: "Pamplona / Iruña", region: "Navarra", blurb: "Pamplona / Iruña concentra la actividad musical de Navarra: Navarra Arena, Anaitasuna y Sala Totem son las referencias del directo.", venues: ["Navarra Arena", "Anaitasuna", "Sala Totem"], lat: 42.8125, lng: -1.6458 },
  "vitoria-gasteiz": { name: "Vitoria-Gasteiz", region: "País Vasco", blurb: "Vitoria-Gasteiz es referencia para el rock alternativo: Azkena Rock Festival en Mendizabala cada junio. Iradier Arena y Sala Helldorado cubren el resto del año.", venues: ["Mendizabala (Azkena Rock)", "Iradier Arena", "Sala Helldorado"], lat: 42.8467, lng: -2.6726 },
  "a-coruna": { name: "A Coruña", region: "Galicia", blurb: "A Coruña es el principal punto de origen para Resurrection Fest. Coliseum, Palexco y Sala Pelícano acogen las giras internacionales.", venues: ["Coliseum A Coruña", "Palexco", "Sala Pelícano"], lat: 43.3623, lng: -8.4115 },
  vigo: { name: "Vigo", region: "Galicia", blurb: "Vigo concentra la actividad musical del sur de Galicia: Auditorio Mar de Vigo, Pabellón Multiusos y salas Rouge / La Iguana Club.", venues: ["Auditorio Mar de Vigo", "Pabellón Multiusos de Vigo", "Sala Rouge", "La Iguana Club"], lat: 42.2328, lng: -8.7226 },
  murcia: { name: "Murcia", region: "Región de Murcia", blurb: "Murcia acoge SOS 4.8, WAM y R-Murcia. Auditorio Víctor Villegas y salas REM/Mamba completan la oferta.", venues: ["Auditorio Víctor Villegas", "Sala REM", "Sala Mamba", "SOS 4.8"], lat: 37.9922, lng: -1.1307 },
  valladolid: { name: "Valladolid", region: "Castilla y León", blurb: "Valladolid es punto neurálgico de Castilla y León: Plaza de Toros, Pabellón Pisuerga y Sala Porta Caeli reciben giras nacionales e internacionales.", venues: ["Plaza de Toros de Valladolid", "Pabellón Pisuerga", "Sala Porta Caeli"], lat: 41.6523, lng: -4.7245 },
};

// ── Blog post data ──────────────────────────────────────────────────────────
interface BlogSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  tableHtml?: string;
}

interface BlogFaq {
  q: string;
  a: string;
}

interface BlogData {
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  h1: string;
  intro: string;
  sections: BlogSection[];
  faqs?: BlogFaq[];
  relatedLinks?: { label: string; to: string }[];
  tags?: string[];
}

const BLOG_POSTS: Record<string, BlogData> = {
  "autobuses-festivales-espana-2026": {
    title: "Autobuses a festivales de España 2026: guía completa por festival",
    excerpt: "¿Hay autobús a Viña Rock? ¿Bus oficial a Arenal Sound? ¿Lanzadera a BBK Live? Esta guía recoge, festival por festival, las opciones reales de bus, autobús, tren y coche compartido para 2026.",
    author: "Equipo ConcertRide",
    publishedAt: "2026-04-29",
    updatedAt: "2026-05-03",
    tags: ["autobuses festivales España", "bus oficial festival", "lanzadera festival", "transporte festivales 2026", "carpooling festivales", "cómo llegar al festival"],
    h1: "Autobuses a festivales de España 2026: cómo llegar a Viña Rock, Arenal Sound, BBK Live, Mad Cool y más",
    intro: "Buscas «autobuses Viñarock», «bus Arenal Sound», «lanzadera BBK Live» o «viajes Resurrection Fest» y nadie te da una respuesta clara. Esta guía recoge festival por festival las opciones reales de bus oficial, autobús de larga distancia, tren, lanzadera y coche compartido para llegar a los festivales españoles de 2026.",
    sections: [
      {
        heading: "Tres tipos de autobús a un festival (no son lo mismo)",
        paragraphs: ["Antes de buscar tu festival es importante distinguir las tres categorías de bus que aparecen mezcladas en redes sociales y resultados de búsqueda:"],
        bullets: [
          "Bus oficial del festival: organizado por la promotora, suele salir desde la estación de la ciudad cabecera. Plazas limitadas, horario fijo, no opera de madrugada normalmente.",
          "Autobús de larga distancia (ALSA, Avanza, FlixBus): líneas regulares interurbanas. Llegan a la ciudad más cercana al recinto, no al festival. Hay que sumar lanzadera o taxi.",
          "Autobús privado (operador no oficial): ofrecido por agencias o promotoras alternativas, salidas desde Madrid Méndez Álvaro, Nuevos Ministerios, Barcelona Sants. Plaza con vuelta a hora fija (suele ser las 6:00 del último día). Precio 35–55 €.",
        ],
      },
      {
        heading: "Viña Rock 2026 (Villarrobledo, Albacete) — autobuses y bus",
        paragraphs: ["Viña Rock 2026 (30 abril–3 mayo) en La Pulgosa, Villarrobledo, no tiene autobús directo desde Madrid. Las opciones reales:"],
        bullets: [
          "Bus lanzadera oficial Albacete–Villarrobledo (50 km, 40 min): sale de la estación de Albacete cada 1–2 horas los días de festival, hasta aproximadamente la 1:00.",
          "Autobús privado Madrid–Viña Rock: operadores no oficiales, 35–55 €, salidas desde Méndez Álvaro y Nuevos Ministerios, vuelta a hora fija sin flexibilidad.",
          "Tren AVE Madrid/Valencia–Albacete (15–45 €) + bus lanzadera del festival: 1h 30 min en tren, 40 min en bus. Funciona para la ida, no para la vuelta de madrugada.",
          "Coche compartido por ConcertRide desde Madrid (6–9 €), Valencia (6–9 €), Albacete (3–5 €), Alicante (5–8 €) o Cuenca (4–6 €): llegada directa a La Pulgosa y vuelta cuando termine el cabeza de cartel.",
        ],
      },
      {
        heading: "Arenal Sound 2026 (Burriana, Castellón) — bus, tren y autobús",
        paragraphs: ["Arenal Sound 2026 (29 julio–2 agosto) en la playa de Burriana, 10 km de Castellón y 65 km de Valencia:"],
        bullets: [
          "Bus lanzadera Castellón–Burriana del festival (10 km, 20 min): sale de la estación de autobuses de Castellón. Plazas limitadas.",
          "Tren Cercanías Renfe C6 Valencia–Castellón (45–60 min, 4–8 €): no llega a la playa, requiere taxi (10–15 €) adicional. Sin servicio nocturno desde Castellón después de las 23:00.",
          "Autobuses de larga distancia Madrid–Castellón / Barcelona–Castellón (ALSA): 15–25 €, llegan a Castellón ciudad, no al festival.",
          "Coche compartido por ConcertRide desde Castellón (3–5 €), Valencia (3–6 €), Barcelona (8–12 €), Madrid (12–17 €) o Alicante (4–7 €): llegada directa al recinto.",
        ],
      },
      {
        heading: "BBK Live 2026 (Kobetamendi, Bilbao) — lanzadera y bus de larga distancia",
        paragraphs: ["Bilbao BBK Live 2026 (9–11 julio) es uno de los pocos festivales con buen servicio de bus dentro de Bilbao:"],
        bullets: [
          "Lanzadera oficial BBK Live: sale desde plaza Moyúa y la estación de Abando con frecuencia de 15 minutos. Precio incluido en la entrada. Sube hasta el monte Kobetamendi.",
          "Autobús ALSA Madrid–Bilbao Termibús (20–35 €, 5–6h): llega a 5 km del festival, hay que sumar shuttle o taxi.",
          "Tren Renfe Santander–Bilbao (8–15 €, 2h): último servicio antes de las 22:00. La vuelta de festival en tren no es viable.",
          "Coche compartido por ConcertRide desde Donostia (4–7 €), Vitoria (3–6 €), Pamplona (5–8 €), Santander (4–7 €), Burgos (5–8 €) o Madrid (11–16 €).",
        ],
      },
      {
        heading: "Mad Cool 2026 (IFEMA, Madrid) — metro y carpooling",
        paragraphs: ["Mad Cool no opera buses oficiales propios. La opción de transporte público directo es la línea 8 del Metro de Madrid (estación Feria de Madrid), que amplía servicio hasta las 2:00–2:30 en noches de festival. Los lanzaderas privadas que aparecen en redes sociales son iniciativas no oficiales. El carpooling con ConcertRide desde Toledo (4–7 €), Guadalajara (3–6 €), Segovia (4–7 €), Valencia (10–14 €), Zaragoza (9–13 €) o Barcelona (15–20 €) es la opción más utilizada por asistentes de fuera de Madrid."],
      },
      {
        heading: "Resurrection Fest 2026 (Viveiro, Lugo) — el caso extremo",
        paragraphs: ["Resurrection Fest 2026 (25–28 junio) es el festival español más dependiente del coche compartido. Viveiro es una pequeña ciudad de la costa lucense sin AVE, sin aeropuerto cercano y con apenas 2–3 frecuencias diarias de bus ALSA. No hay servicio nocturno. El carpooling desde A Coruña (4–7 €), Vigo (6–9 €), Santiago (6–9 €), Oviedo (6–9 €), Bilbao (10–15 €) y Madrid (16–22 €) es la práctica habitual del festival."],
      },
      {
        heading: "Otros festivales con buses y lanzaderas relevantes 2026",
        paragraphs: ["Resumen rápido de los principales festivales españoles y su servicio de bus oficial:"],
        bullets: [
          "Sonorama Ribera (Aranda de Duero): bus Madrid–Aranda La Sepulvedana (10–15 €), no opera de madrugada. Sin shuttle oficial.",
          "O Son do Camiño (Santiago): lanzadera oficial desde el centro de Santiago hasta Monte do Gozo, 5 km.",
          "Cala Mijas Fest (Málaga): sin shuttle oficial. Taxi 25–40 € desde Málaga centro al Cortijo de Torres.",
          "Medusa Festival (Cullera): lanzadera del festival desde estación Joaquín Sorolla Valencia y Xàtiva. Plazas limitadas.",
          "Low Festival (Benidorm): TRAM L1 Alicante–Benidorm (1h 20 min) hasta medianoche. Sin shuttle oficial.",
          "FIB (Benicàssim): tren Cercanías Renfe Castellón–Benicàssim (5 min) y lanzadera al recinto.",
          "Sónar (Barcelona): metro L1 Espanya y autobús urbano. Servicio amplio en Sónar de Día.",
          "Cruïlla (Barcelona): metro L4 El Maresme-Fòrum a 5 min del recinto. Buen transporte público nocturno.",
          "Primavera Sound (Barcelona): metro L4 Besòs Mar al Parc del Fòrum. Saturación habitual de madrugada.",
        ],
      },
      {
        heading: "Cuándo elegir bus, cuándo elegir coche compartido",
        paragraphs: [
          "El bus oficial gana al carpooling en tres casos: 1) cuando la lanzadera es gratuita o barata y sale hasta tarde (BBK Live, Cruïlla); 2) cuando el recinto está dentro del área metropolitana con metro nocturno (Sónar, Zevra, Mad Cool con limitaciones); 3) cuando la salida del festival es temprana.",
          "El coche compartido gana al bus en tres casos opuestos: 1) cuando el recinto está fuera de la red de transporte público (Viña Rock, Resurrection Fest, Sonorama, Cala Mijas); 2) cuando la vuelta es después de medianoche (que es la mayoría); 3) cuando vienes de otra provincia y el tren + lanzadera + taxi suma más de 20 € por trayecto.",
        ],
      },
    ],
    faqs: [
      { q: "¿Hay autobús oficial a Viña Rock desde Madrid?", a: "No existe un bus oficial directo del festival Madrid–Viña Rock. Hay autobuses privados (operadores no oficiales) que salen de Méndez Álvaro y Nuevos Ministerios por 35–55 € con vuelta a hora fija. La alternativa más flexible y económica es el carpooling con ConcertRide (6–9 €/asiento)." },
      { q: "¿Hay tren al recinto del Arenal Sound?", a: "No. El tren Cercanías C6 Valencia–Castellón llega a la estación de Castellón de la Plana, a 10 km del recinto. Hay que añadir bus lanzadera o taxi adicional. Sin servicio nocturno: la vuelta de madrugada en tren es imposible." },
      { q: "¿Cuánto cuesta la lanzadera oficial del BBK Live?", a: "La lanzadera oficial del BBK Live (Bilbao centro → Kobetamendi) está incluida en el precio de la entrada al festival, sin coste adicional. Sale desde plaza Moyúa y la estación de Abando con frecuencia de 15 minutos." },
      { q: "¿Hay bus desde Santander a BBK Live?", a: "El bus ALSA Santander–Bilbao Termibús (1h 30 min, 6–15 €) opera varias veces al día pero no en horarios nocturnos. Para volver del festival a Santander de madrugada hay que ir en coche compartido o particular." },
      { q: "¿Es seguro el carpooling para ir a un festival?", a: "ConcertRide verifica el carnet de conducir de todos los conductores antes de publicar viajes. Cada conductor tiene perfil con valoraciones de pasajeros anteriores. El pago es directo conductor-pasajero (efectivo o Bizum) sin intermediarios y sin comisión de plataforma." },
    ],
    relatedLinks: [
      { label: "Guía de transporte para festivales", to: "/guia-transporte-festivales" },
      { label: "Cómo ir a Viña Rock", to: "/festivales/vina-rock" },
      { label: "Cómo ir a Arenal Sound", to: "/festivales/arenal-sound" },
      { label: "Cómo ir a BBK Live", to: "/festivales/bbk-live" },
      { label: "Cómo ir a Mad Cool", to: "/festivales/mad-cool" },
      { label: "Cómo ir a Resurrection Fest", to: "/festivales/resurrection-fest" },
    ],
  },
  "blablacar-vs-concertride": {
    title: "BlaBlaCar vs ConcertRide 2026: ¿qué app de carpooling te conviene para festivales?",
    excerpt: "Comparativa real entre BlaBlaCar y ConcertRide para llegar a festivales: comisiones, tiempos de espera, perfil de usuario, política de cancelación y precio por asiento.",
    author: "Equipo ConcertRide",
    publishedAt: "2026-04-25",
    updatedAt: "2026-05-03",
    tags: ["BlaBlaCar alternativa", "BlaBlaCar vs ConcertRide", "carpooling festivales sin comisión", "comparativa carpooling", "coche compartido festivales"],
    h1: "BlaBlaCar vs ConcertRide: comparativa para ir a conciertos en España",
    intro: "Si vas a un festival este verano y dudas entre BlaBlaCar y ConcertRide, esta comparativa va al grano. La diferencia principal: ConcertRide no cobra comisión (el 100% va al conductor) y cada viaje está vinculado a un concierto concreto.",
    sections: [
      {
        heading: "La diferencia fundamental: generalista vs. especializado",
        paragraphs: [
          "BlaBlaCar es una plataforma generalista de viaje compartido que cubre cualquier trayecto entre ciudades. Es útil cuando necesitas ir de Madrid a Barcelona cualquier día. Su modelo se basa en cobrar una comisión del 15–20 % sobre el precio que paga el pasajero.",
          "ConcertRide nació exclusivamente para conciertos y festivales. Los viajes están vinculados a un evento concreto, lo que significa que conductor y pasajeros van al mismo lugar, a la misma hora, y tienen el mismo plan de vuelta. Sin comisión: el 100 % del precio va al conductor.",
        ],
      },
      {
        heading: "Precio: comisión vs. sin comisión",
        paragraphs: [
          "En BlaBlaCar, si un conductor pone 10 € por plaza, tú pagas entre 11,50 y 12 € (comisión incluida). En viajes de larga distancia como Madrid–Benicàssim (FIB) o Madrid–Barcelona (Primavera Sound), esa comisión puede superar los 3–4 € por trayecto.",
          "En ConcertRide no hay comisión. Lo que fija el conductor es lo que pagas — en efectivo o Bizum el día del viaje. Para un grupo de amigos que va y vuelve del festival, el ahorro acumulado puede ser de 15–25 € por persona.",
        ],
        tableHtml: `<table>
  <thead>
    <tr><th></th><th>ConcertRide</th><th>BlaBlaCar</th></tr>
  </thead>
  <tbody>
    <tr><td>Comisión</td><td><strong>0 %</strong></td><td>15–20 % sobre precio del pasajero</td></tr>
    <tr><td>Ejemplo (conductor pone 10 €)</td><td><strong>Pasajero paga 10 €</strong></td><td>Pasajero paga ~11,50–12 €</td></tr>
    <tr><td>Pago</td><td>Efectivo o Bizum al conductor (el día)</td><td>Tarjeta online (antes del viaje)</td></tr>
    <tr><td>Tipo de viajes</td><td>Solo conciertos y festivales</td><td>Cualquier trayecto interurbano</td></tr>
    <tr><td>Búsqueda</td><td>Por festival o concierto</td><td>Por ciudad de origen/destino</td></tr>
    <tr><td>Vuelta coordinada</td><td>Sí (conductor también va al festival)</td><td>No garantizada</td></tr>
    <tr><td>Verificación conductor</td><td>Carnet de conducir obligatorio</td><td>Identidad + historial de valoraciones</td></tr>
    <tr><td>Cancelación pasajero</td><td>Sin coste (pago en persona)</td><td>Posibles penalizaciones por cancelación tardía</td></tr>
  </tbody>
</table>
<p><em>Datos actualizados a mayo 2026. Comisión BlaBlaCar varía según ruta y demanda.</em></p>`,
      },
      {
        heading: "Oferta de viajes a festivales: ¿dónde hay más?",
        paragraphs: [
          "BlaBlaCar tiene más usuarios en total, pero su buscador no filtra por festival. Para encontrar viajes a Arenal Sound en Burriana, tienes que buscar «Castellón» y filtrar manualmente por fecha — a menudo entre viajes de trabajo o turismo.",
          "ConcertRide agrupa los viajes por concierto y festival. Buscas «Arenal Sound» y ves todos los viajes publicados para ese evento, desde cualquier origen, con fecha y hora ajustadas al festival.",
        ],
      },
      {
        heading: "Verificación de conductores",
        paragraphs: [
          "BlaBlaCar verifica el perfil del conductor mediante documentación de identidad y valoraciones de viajes anteriores. Es un sistema maduro con millones de valoraciones acumuladas.",
          "ConcertRide verifica el carnet de conducir de los conductores antes de que puedan publicar viajes. La verificación del carnet es obligatoria desde el primer viaje.",
        ],
      },
      {
        heading: "¿Cuándo usar BlaBlaCar y cuándo ConcertRide?",
        paragraphs: [
          "Usa BlaBlaCar si necesitas un trayecto interurbano genérico: Madrid a Sevilla un martes cualquiera, vuelta de un puente desde casa de tus padres. Su red de conductores es amplia.",
          "Usa ConcertRide si vas a un concierto o festival. Los conductores ya van al mismo evento, la coordinación de horarios es automática, no hay comisión y el pago es directo. Para festivales como Mad Cool, Primavera Sound, Arenal Sound, FIB, BBK Live o Resurrection Fest, es la opción más eficiente.",
        ],
      },
    ],
    faqs: [
      { q: "¿Es BlaBlaCar gratis para los pasajeros?", a: "No. BlaBlaCar cobra una comisión de servicio del 15–20 % sobre el precio del viaje que paga el pasajero. El conductor recibe el precio base que ha fijado." },
      { q: "¿ConcertRide cobra comisión?", a: "No. ConcertRide es completamente gratuito, sin comisiones para conductores ni pasajeros. El pago se realiza directamente entre conductor y pasajero (efectivo o Bizum) el día del viaje." },
      { q: "¿Puedo encontrar viajes a festivales en BlaBlaCar?", a: "Sí, pero el buscador es genérico: tienes que buscar por ciudad de destino y filtrar por fecha. Los resultados mezclan viajes a festivales con viajes de trabajo o turismo. ConcertRide agrupa los viajes directamente por festival." },
      { q: "¿Cuál tiene más viajes disponibles?", a: "BlaBlaCar tiene más usuarios en total. ConcertRide tiene menos viajes en total pero todos son relevantes para conciertos y festivales — no hay ruido de viajes no relacionados." },
    ],
    relatedLinks: [
      { label: "Carpooling al Mad Cool Festival", to: "/festivales/mad-cool" },
      { label: "Carpooling al Primavera Sound", to: "/festivales/primavera-sound" },
      { label: "Guía de transporte para festivales", to: "/guia-transporte-festivales" },
    ],
  },
  "como-volver-festival-madrugada": {
    title: "Cómo volver de un festival de madrugada (sin taxi a 90 €)",
    excerpt: "El último metro sale a las 1:30 y el festival acaba a las 2:30. Opciones reales para volver: carpooling, lanzaderas oficiales, autobús nocturno o taxi compartido.",
    author: "Equipo ConcertRide",
    publishedAt: "2026-04-25",
    updatedAt: "2026-05-03",
    tags: ["cómo volver festival madrugada", "transporte nocturno festival", "vuelta festival", "taxi festival caro", "carpooling vuelta festival"],
    h1: "Cómo volver de un festival de madrugada en España",
    intro: "El 80% de los problemas de un festival no son la cola de los baños — son volver a casa. El transporte público no llega: el último metro de Madrid sale a la 1:30 y un Mad Cool acaba a las 2:30.",
    sections: [
      {
        heading: "Las 4 opciones reales (y cuándo usar cada una)",
        paragraphs: ["Para la mayoría de festivales españoles, las opciones realistas para volver entre la 1 y las 5 am son: carpooling, lanzadera oficial del festival, autobús urbano nocturno («búho») y taxi/VTC. El tren rara vez funciona a esas horas."],
        bullets: [
          "Carpooling: 5–25 €. Sin esperas si reservas antes. Sale del recinto.",
          "Lanzadera oficial: 5–15 €. Sale solo de un par de hubs urbanos. Puede tener 30–60 min de cola.",
          "Búho urbano: 1,50–3 €. Solo dentro del área metropolitana del recinto.",
          "Taxi/VTC: 30–90 € en madrugada (tarifa nocturna + recargo de evento). Casi imposible encontrar uno entre las 2 y las 4 am.",
        ],
      },
      {
        heading: "Por qué el carpooling es la opción más estable",
        paragraphs: [
          "El carpooling tiene una ventaja invisible: la plaza está reservada antes del festival. No dependes de que aparezca un taxi ni de hacer cola con otros 200 sudados a las 3 am.",
          "El conductor también va al festival, así que el horario de salida está alineado con el final real del show — no con un horario teórico de bus que sale a las 23:30 y te obliga a perderte el cabeza de cartel.",
          "En ConcertRide la mayoría de viajes incluyen vuelta. El conductor suele añadir el de regreso al recinto con punto de encuentro fijo y hora aproximada.",
        ],
      },
      {
        heading: "Trampas a evitar",
        paragraphs: [
          "No te fíes del «Uber/Cabify llega en 5 min» a las 2:30 am en un festival: la app puede mostrarte un coche, pero la cola virtual oculta tiempos reales de 45–90 min en eventos masivos.",
          "Cuidado también con el «taxi pirata» en la salida del recinto: ofrecen tarifas planas a 100 € y muchas veces no son legales. Si vas a coger taxi, hazlo desde una parada oficial dentro del recinto.",
        ],
      },
      {
        heading: "Checklist antes del festival",
        paragraphs: ["Si todavía no has resuelto la vuelta y faltan menos de 48 h, sigue estos pasos:"],
        bullets: [
          "1. Busca tu festival en concertride.me y filtra por «con regreso incluido».",
          "2. Si no encuentras, busca lanzadera oficial del festival o autobús nocturno.",
          "3. Si tampoco, reserva la lanzadera oficial del festival (siempre cobran solo a la salida).",
          "4. Como último recurso, comparte taxi entre 4: divide el coste, evita el caos.",
        ],
      },
    ],
    faqs: [
      { q: "¿Hay metro o tren la noche de un festival grande?", a: "Casi nunca. Mad Cool, Primavera Sound, Sónar y BBK Live acaban después de la última conexión de transporte público. La excepción es Sónar de Día, que sí cierra dentro del horario del metro de Barcelona." },
      { q: "¿Cuánto cuesta un taxi del festival a Madrid centro de madrugada?", a: "Entre 30 € (Mad Cool → Sol) y 90 € (Mad Cool → Tres Cantos), con tarifa nocturna y recargo de evento. Si lo compartes con 3 más, el coste por persona se acerca al de un carpooling." },
      { q: "¿Qué pasa si el conductor del carpooling se va antes de que termine el show?", a: "El acuerdo es claro antes de viajar: el conductor publica una hora estimada de salida (suele ser entre 30 min y 1 h después de que acabe el cabeza de cartel). Si necesitas quedarte hasta el último DJ, busca un viaje con horario más tardío." },
    ],
    relatedLinks: [
      { label: "Guía de transporte para festivales en España", to: "/guia-transporte-festivales" },
      { label: "Carpooling a Mad Cool", to: "/festivales/mad-cool" },
    ],
  },
  "huella-carbono-festivales-carpooling": {
    title: "Huella de carbono de un festival: por qué el carpooling es la acción más efectiva",
    excerpt: "El 80% de las emisiones de un festival vienen del transporte de los asistentes. Compartir coche reduce esas emisiones hasta un 75% por persona.",
    author: "Equipo ConcertRide",
    publishedAt: "2026-04-25",
    updatedAt: "2026-05-03",
    tags: ["huella carbono festival", "sostenibilidad festivales", "carpooling CO2", "emisiones transporte festival", "festival ecológico"],
    h1: "Huella de carbono y festivales: lo que el carpooling cambia de verdad",
    intro: "El 80% de la huella de carbono de un festival grande viene del transporte de los asistentes — no del escenario, no de los grupos, no de los vasos. Del coche que cada fan usa para llegar.",
    sections: [
      {
        heading: "El reparto real de las emisiones de un festival",
        paragraphs: [
          "Según Julie's Bicycle (referencia del sector en eventos sostenibles), entre el 70 % y el 85 % de la huella de carbono de un festival proviene del transporte de los asistentes. La energía del recinto, la comida y los residuos suman el resto.",
          "Esto significa que las medidas sostenibles más visibles (bombillas LED, vasos retornables, papeleras de reciclaje) tienen un impacto marginal comparado con cómo llegan los 50.000 asistentes al recinto.",
        ],
      },
      {
        heading: "Cuánto reduce el carpooling: el cálculo",
        paragraphs: [
          "Un coche compartido entre 4 personas reduce las emisiones por pasajero en un 75 % comparado con 4 coches con un solo ocupante. Es matemática simple: el combustible se reparte.",
          "Un Madrid → Mad Cool (75 km ida y vuelta) emite unos 12 kg de CO₂ con un coche medio. En solitario, son 12 kg por persona; compartido entre 4, son 3 kg por persona.",
          "Para un festival de 50.000 personas con un 30 % de asistentes en coche solo, mover ese tercio a carpooling de 4 ahorraría unas 110 toneladas de CO₂ por evento. El equivalente a 50 vuelos Madrid–Barcelona.",
        ],
      },
      {
        heading: "Por qué el coche compartido le gana al transporte público en festivales",
        paragraphs: ["El transporte público parece la opción ecológica obvia, pero en festivales suele perder la pelea por dos razones:"],
        bullets: [
          "Cobertura: la mayoría de recintos están fuera de la red de cercanías o metro. Un autobús lanzadera puntual emite menos por persona que un coche compartido, pero solo si va lleno.",
          "Hora de vuelta: el último cercanías sale antes de que acabe el festival. Si te obliga a coger taxi para volver, las emisiones se disparan: un taxi vacío de vuelta dobla el impacto.",
        ],
      },
      {
        heading: "Cómo medirlo: la calculadora MITECO",
        paragraphs: [
          "Si quieres calcular tu huella exacta, el Ministerio para la Transición Ecológica (MITECO) publica un factor oficial de emisión por km y tipo de vehículo. Para un coche diésel medio: 158 g CO₂/km. Para gasolina: 145 g/km.",
          "Con esos datos: (km del viaje × factor) ÷ ocupantes = emisión por persona.",
        ],
      },
      {
        heading: "Más allá del CO₂: el ruido y el tráfico local",
        paragraphs: [
          "Reducir coches en el acceso al festival también beneficia a los vecinos del recinto. Mad Cool en Villaverde, Primavera Sound en Parc del Fòrum y Sónar en Fira son zonas residenciales: cada coche menos en las salidas reduce ruido nocturno y atascos.",
          "Algunos festivales han empezado a premiar a los grupos que llegan en coche compartido (descuentos en consumiciones, entrada anticipada al recinto).",
        ],
      },
    ],
    faqs: [
      { q: "¿Coche eléctrico o coche compartido: qué emite menos?", a: "Para una distancia típica de festival (50–200 km), un coche compartido de 4 personas con un coche de combustión medio emite menos por persona que un eléctrico con un solo ocupante. La ocupación pesa más que el tipo de motor." },
      { q: "¿El tren no es lo más sostenible?", a: "Sí, cuando existe y llega al recinto. El problema es la última milla y el horario nocturno. Si el tren llega al recinto y tienes vuelta antes de que acabe el festival, gana al carpooling. Si no, el coche compartido suele ser mejor que el tren + taxi." },
      { q: "¿Hay alguna fuente oficial de estos datos?", a: "Sí. Julie's Bicycle (juliesbicycle.com) publica guías específicas para festivales. La Asociación de Promotores Musicales (APM) y MITECO publican datos para España. El factor oficial de emisión por km de coche está en la Guía MITECO de huella de carbono." },
    ],
    relatedLinks: [
      { label: "Cómo volver de un festival de madrugada", to: "/blog/como-volver-festival-madrugada" },
      { label: "Guía de transporte para festivales", to: "/guia-transporte-festivales" },
    ],
  },
  "que-llevar-al-festival": {
    title: "Qué llevar al festival: lista completa 2026 (para los que van en coche)",
    excerpt: "Lista completa de qué meter en la mochila para un festival de uno, dos o varios días: equipaje, ropa, documentación y lo imprescindible si vas en coche compartido.",
    author: "Equipo ConcertRide",
    publishedAt: "2026-05-01",
    updatedAt: "2026-05-03",
    tags: ["qué llevar al festival", "mochila festival", "lista festival 2026", "equipo festival", "checklist festival carpooling"],
    h1: "Qué llevar al festival: la lista definitiva para 2026",
    intro: "La diferencia entre un festival que recuerdas con cariño y uno que recuerdas con ampollas suele estar en la mochila. Aquí tienes la lista honesta — sin los 20 objetos que no vas a usar.",
    sections: [
      {
        heading: "Los imprescindibles (que se olvidan el 30 % de las veces)",
        paragraphs: ["Estos son los objetos que más gente olvida y que arruinan el día si faltan:"],
        bullets: [
          "Entrada o código QR descargado sin conexión (capturas de pantalla en el carrete, no solo en el email).",
          "DNI o pasaporte — sin él no entras si hay control de acceso.",
          "Tarjeta bancaria física — los festivales con pago cashless no aceptan siempre Apple/Google Pay.",
          "Auriculares de espuma (protección auditiva) — reducen el riesgo de daño auditivo sin quitar sonido.",
          "Cargador portátil (powerbank) cargado al 100 % el día anterior.",
          "Dinero en efectivo — para el conductor del carpooling y para los puestos de street food sin TPV.",
        ],
      },
      {
        heading: "Ropa: la regla de las capas y el calzado correcto",
        paragraphs: [
          "La mayoría de festivaleros sobre-empacan ropa y sub-empacan calzado cómodo. La regla práctica: para un festival de verano de 3 días, 2–3 camisetas, 1 capa media y 1 chubasquero compacto. Los festivales nocturnos bajan hasta los 15 °C incluso en julio en zonas de interior.",
          "El calzado es el factor número uno de bienestar. Si el recinto es exterior con terreno de tierra o hierba, las zapatillas de running son mejor opción que las botas o las Converse.",
        ],
        bullets: [
          "Festival de día (1 día): camiseta + pantalón corto + zapatillas + gorra o sombrero.",
          "Festival nocturno verano (1–2 días): añade sudadera ligera + chubasquero.",
          "Festival con acampada (3+ días): añade chubasquero impermeable + ropa térmica ligera para la madrugada.",
          "Evita: jeans (pesan, tardan en secar), sandalias de plataforma, ropa nueva sin estrenar.",
        ],
      },
      {
        heading: "Lo que llevar en la mochila de día (10–20 L)",
        paragraphs: ["La mochila que entra al recinto debe ser ligera. La mayoría de festivales tienen límite de tamaño (35x40 cm aprox.):"],
        bullets: [
          "Agua (botella vacía rellenable — muchos festivales tienen puntos de agua gratis).",
          "Protección solar SPF 50+ — el olvido más caro en festivales de verano.",
          "Analgésico (ibuprofeno o paracetamol) + tiritas + alcohol en gel.",
          "Tapones para los oídos (30 dB de reducción).",
          "Powerbank + cable USB-C/Lightning.",
          "Dinero en efectivo (20–50 €) + tarjeta.",
        ],
      },
      {
        heading: "Si el festival tiene camping: lo que cambia",
        paragraphs: ["Para festivales con acampada (Resurrection Fest, Arenal Sound, Viña Rock, FIB, Medusa) necesitas equipaje extra:"],
        bullets: [
          "Tienda de campaña (2x2 m mínimo, impermeable 1500 mm HH o más).",
          "Saco de dormir (válido hasta 10 °C en verano).",
          "Esterilla o colchoneta hinchable.",
          "Linterna frontal.",
          "Cerrojo para cremallera de tienda (disuasorio contra robos menores).",
          "Bolsa de basura grande (para guardar el equipo mojado y no ensuciar el coche de vuelta).",
        ],
      },
      {
        heading: "Lista específica si vas en coche compartido (ConcertRide)",
        paragraphs: [
          "Si llegas al festival en carpooling hay dos reglas de oro: confirma con el conductor el punto de encuentro y la hora exacta, y ten el dinero del viaje preparado en efectivo o Bizum antes de salir de casa.",
          "Para el maletero compartido, acuerda de antemano cuántos bultos caben. Un coche estándar con 4 personas y acampada solo admite mochilas medianas (40–50 L).",
        ],
        bullets: [
          "Precio del viaje en efectivo o Bizum listo (no le hagas esperar a que saques del cajero).",
          "Punto de encuentro guardado en Google Maps sin conexión.",
          "Número de teléfono del conductor guardado.",
          "Mochila de maletero: no más de 40–50 L si vais 4 con acampada.",
        ],
      },
    ],
    faqs: [
      { q: "¿Qué ropa llevar a un festival de verano en España?", a: "Para festivales de verano diurnos: camiseta, pantalón corto, zapatillas cómodas, gorra y protección solar. Para festivales nocturnos o de varios días añade una sudadera ligera y un chubasquero compacto — las noches en festivales de interior bajan hasta 12–15 °C incluso en julio." },
      { q: "¿Puedo llevar comida al festival?", a: "Depende del festival. La mayoría permiten snacks envasados y sándwiches, pero no bebidas alcohólicas ni comida que requiera cocinar. Siempre es válido llevar barritas energéticas, fruta y bocadillos para ahorrarte en los puestos de comida." },
      { q: "¿Qué llevo si voy en coche compartido a un festival de acampada?", a: "Acuerda con el conductor el espacio de maletero antes del día. Con 4 personas y acampada, lo práctico es una mochila grande (50–60 L) para el camping y una pequeña (10–20 L) para llevar al recinto. Ten el dinero del viaje preparado — efectivo o Bizum — para entregárselo al conductor al llegar." },
      { q: "¿Qué no puedo llevar a un festival?", a: "Los objetos más frecuentemente prohibidos son: botellas de cristal, paraguas con varillas metálicas, latas (en algunos festivales), cámaras con objetivo desmontable, drones y sillas que bloqueen la visión de otros asistentes." },
    ],
    relatedLinks: [
      { label: "Cómo volver de un festival de madrugada", to: "/blog/como-volver-festival-madrugada" },
      { label: "Guía de transporte para festivales en España", to: "/guia-transporte-festivales" },
      { label: "Carpooling a Mad Cool", to: "/festivales/mad-cool" },
    ],
  },
  "festivales-musica-espana-2026": {
    title: "Festivales de música en España 2026: fechas, ciudades y cómo llegar",
    excerpt: "Mad Cool, Primavera Sound, Sónar, FIB, BBK Live, Arenal Sound, Viña Rock y más. Fechas confirmadas, ciudad, recinto y cómo llegar a cada uno sin taxi.",
    author: "Equipo ConcertRide",
    publishedAt: "2026-05-01",
    updatedAt: "2026-05-03",
    tags: ["festivales música España 2026", "agenda festivales 2026", "Mad Cool 2026", "Primavera Sound 2026", "BBK Live 2026", "carpooling festivales España"],
    h1: "Festivales de música en España 2026: la guía completa",
    intro: "El verano de 2026 tiene agenda. Mad Cool, Primavera Sound, Sónar, FIB, BBK Live y más. Repasamos los principales festivales de música en España con fechas confirmadas, recinto y opciones de transporte.",
    sections: [
      {
        heading: "Mayo 2026: el inicio de la temporada",
        paragraphs: ["La temporada de festivales de verano arranca en mayo con dos grandes citas en Madrid y Barcelona:"],
        bullets: [
          "Viña Rock 2026 — 30 abril–3 mayo — Villarrobledo (Albacete). Festival de punk, metal y rock en La Pulgosa. Carpooling desde Albacete (3–5 €), Madrid (6–9 €) o Valencia (6–9 €).",
          "Tomavistas 2026 — 15–17 mayo — Madrid (Recinto Ferial de la Casa de Campo). Metro línea 10 (Lago) o coche compartido desde Toledo, Guadalajara o Segovia.",
          "Primavera Sound 2026 — 28 mayo–1 junio — Barcelona (Parc del Fòrum). Metro L4 Besòs Mar + 10 min a pie. Carpooling desde Madrid (15–20 €), Valencia (10–14 €), Zaragoza (8–12 €).",
        ],
      },
      {
        heading: "Junio 2026: el mes más denso",
        paragraphs: ["Junio concentra los festivales de mayor componente electrónico y rock alternativo:"],
        bullets: [
          "Sónar 2026 — 18–20 junio — Barcelona (Fira de Barcelona + Fira Gran Via). Metro L1 Espanya (Sónar de Día) y L9 Fira (Sónar de Noche). Carpooling desde Madrid o Valencia desde 15 €.",
          "O Son do Camiño 2026 — 18–20 junio — Santiago de Compostela (Monte do Gozo). Festival de rock e indie con lanzadera oficial desde el centro de Santiago.",
          "Resurrection Fest 2026 — 25–28 junio — Viveiro (Lugo). El festival de metal más importante de España. Sin transporte público nocturno: carpooling desde A Coruña (4–7 €), Oviedo (6–9 €), Bilbao (10–15 €) o Madrid (16–22 €).",
        ],
      },
      {
        heading: "Julio 2026: el pico de la temporada",
        paragraphs: ["Julio es el mes con mayor concentración de grandes festivales:"],
        bullets: [
          "Mad Cool Festival 2026 — 9–11 julio — Madrid (IFEMA). 80.000 asistentes diarios. Metro L8 Feria de Madrid (con ampliación de horario). Carpooling desde Toledo (4–7 €), Barcelona (15–20 €), Valencia (10–14 €).",
          "BBK Live 2026 — 9–11 julio — Bilbao (Kobetamendi). Lanzadera oficial desde Plaza Moyúa (incluida en entrada). Carpooling desde Madrid (12–16 €), Donostia (4–7 €), Pamplona (5–8 €).",
          "FIB Benicàssim 2026 — 16–19 julio — Benicàssim (Castellón). Cercanías Renfe Castellón–Benicàssim (5 min) + lanzadera al recinto. Carpooling desde Valencia (4–6 €), Madrid (10–14 €).",
          "Low Festival 2026 — 24–26 julio — Benidorm. TRAM L1 Alicante–Benidorm hasta medianoche. Carpooling desde Alicante (3–5 €), Valencia (5–8 €).",
          "Arenal Sound 2026 — 29 julio–2 agosto — Burriana (Castellón). Sin tren al recinto. Lanzadera oficial desde Castellón ciudad. Carpooling desde Valencia (3–6 €), Barcelona (8–12 €), Madrid (12–17 €).",
          "Cruïlla 2026 — 9–12 julio — Barcelona (Parc del Fòrum). Metro L4 El Maresme-Fòrum a 5 min.",
        ],
      },
      {
        heading: "Agosto 2026: festivales de largo recorrido",
        paragraphs: ["En agosto continúan los festivales de varios días con alta demanda de camping y transporte:"],
        bullets: [
          "Medusa Festival 2026 — 12–16 agosto — Cullera (Valencia). Lanzadera oficial desde Xàtiva y Joaquín Sorolla. Carpooling desde Valencia (3–5 €), Madrid (10–14 €).",
          "Sonorama Ribera 2026 — 6–9 agosto — Aranda de Duero (Burgos). Bus ALSA Madrid–Aranda (10–15 €, no nocturno). Carpooling desde Madrid (6–9 €), Burgos (3–5 €), Zaragoza (7–10 €).",
        ],
      },
      {
        heading: "Cómo organizar el transporte a los festivales de 2026",
        paragraphs: [
          "El transporte sigue siendo el mayor problema no resuelto de los festivales españoles. La mayoría de recintos están fuera del área metropolitana, los servicios nocturnos terminan antes del cabeza de cartel y los taxis cuestan entre 50 y 90 € en madrugada.",
          "Las tres opciones reales, ordenadas por comodidad para volver de madrugada:",
        ],
        bullets: [
          "Coche compartido (carpooling): llega y sale del recinto a cualquier hora. 3–22 € según distancia. Reserva con 2–4 semanas de antelación para festivales grandes.",
          "Lanzadera oficial del festival: disponible en BBK Live (gratuita), Medusa, FIB, O Son do Camiño. Sale a horas fijas, puede tener cola de 30–60 min en las salidas.",
          "Transporte público: solo práctico en festivales con metro o cercanías (Sónar, Primavera Sound, Cruïlla, Low Festival). Falla en las madrugadas para el 80 % de los festivales.",
        ],
      },
    ],
    faqs: [
      { q: "¿Cuándo es el Primavera Sound 2026?", a: "Primavera Sound 2026 se celebra del 28 de mayo al 1 de junio en el Parc del Fòrum de Barcelona." },
      { q: "¿Cuándo es el Mad Cool 2026?", a: "Mad Cool Festival 2026 está previsto para el 9, 10 y 11 de julio en IFEMA Madrid. El acceso es por metro línea 8 (estación Feria de Madrid) o carpooling." },
      { q: "¿Cuál es el festival de música más grande de España?", a: "Mad Cool Festival y Primavera Sound son los festivales más grandes de España en aforo, con 70.000–80.000 asistentes diarios. BBK Live, FIB y Arenal Sound siguen con 50.000–60.000." },
      { q: "¿Cómo llegar a los festivales de España sin coche propio?", a: "Las opciones varían por festival. Para recintos dentro de ciudades (Sónar, Cruïlla, Low Festival) el metro o TRAM llega al recinto. Para los que están fuera de la ciudad (Viña Rock, Resurrection Fest, Sonorama, Cala Mijas) el coche compartido con ConcertRide es la opción más flexible y económica (3–22 € según distancia)." },
      { q: "¿Hay festivales de música en España en otoño?", a: "Sí. Cala Mijas (octubre, Málaga) es el más destacado del calendario de otoño de 2026. Se celebra del 2 al 4 de octubre en Mijas, Málaga." },
    ],
    relatedLinks: [
      { label: "Carpooling al Mad Cool Festival", to: "/festivales/mad-cool" },
      { label: "Carpooling al Primavera Sound", to: "/festivales/primavera-sound" },
      { label: "Carpooling al BBK Live Bilbao", to: "/festivales/bbk-live" },
      { label: "Carpooling al Arenal Sound", to: "/festivales/arenal-sound" },
      { label: "Guía de transporte para festivales", to: "/guia-transporte-festivales" },
    ],
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
  priceTo: string;
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
      const priceMatches = [...oc.range.matchAll(/\d+/g)].map((m) => m[0]);
      const priceFrom = priceMatches[0] ?? f.priceFrom;
      const priceTo = priceMatches[1] ?? priceMatches[0] ?? f.priceFrom;
      result[slug] = {
        originCity: oc.city,
        festivalShortName: f.shortName,
        festivalName: f.name,
        festivalCity: f.city,
        distance: String(oc.km),
        drivingTime: oc.drivingTime,
        priceFrom,
        priceTo,
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
  "primavera-sound": `<p><strong>Transporte a Primavera Sound 2026 — resumen:</strong> El Parc del Fòrum está bien comunicado en metro L4 (parada Besòs Mar, 2 min a pie). Opciones: (1) <strong>Metro L4</strong> ampliado hasta las 5:00 AM los viernes y sábados del festival — colas habituales de 30–45 min en salida; (2) <strong>AVE desde Madrid</strong> (50–100 €, 2h 30 min, plazas agotadas semanas antes); (3) <strong>Carpooling ConcertRide</strong> desde Madrid (14–22 €, 5h 30 min), Valencia (10–14 €, 3h 15 min), Zaragoza (8–12 €, 2h 45 min) o Bilbao (12–18 €, 5h). Llegada directa a la ciudad, mayor flexibilidad de horario.</p>`,
  "sonar": `<p><strong>Transporte a Sónar 2026 — resumen:</strong> Sónar tiene dos recintos en Barcelona: Sónar de Día en Fira Montjuïc (Metro L1 Espanya o L3 Tarragona) y Sónar de Noche en Fira Gran Via (Metro L9 Europa Fira). Opciones para quienes vienen de fuera: (1) <strong>Metro y Cercanías Renfe</strong> para los recintos urbanos; (2) <strong>AVE desde Madrid</strong> (50–100 €, 2h 30 min); (3) <strong>Carpooling ConcertRide</strong> desde Madrid (14–22 €), Valencia (10–14 €), Zaragoza (8–12 €) o Girona (4–7 €). El Sónar de Noche termina a las 6:00 AM — el metro ya está operativo a esa hora.</p>`,
  "fib": `<p><strong>Transporte a FIB Benicàssim 2026 — resumen:</strong> El recinto de FIB está en la playa de Benicàssim, a 10 km de Castellón. Opciones: (1) <strong>Cercanías Renfe C6</strong> Valencia–Castellón (50 min, cada 30 min, 3,90 €) + lanzadera al recinto desde estación Castellón; (2) <strong>Autobús ALSA</strong> desde Castellón al recinto (10 km, 15–20 min, plazas limitadas); (3) <strong>Carpooling ConcertRide</strong> desde Valencia (10–15 €, 1h 15 min), Madrid (14–22 €, 4h), Barcelona (8–14 €, 2h 30 min), Alicante (6–10 €, 1h 30 min) o Zaragoza (8–12 €, 2h 45 min). La vuelta de madrugada del FIB es complicada — el último Cercanías C6 sale a la 1:30 desde Castellón. El carpooling es la opción mayoritaria para la vuelta.</p>`,
  "sonorama-ribera": `<p><strong>Transporte a Sonorama Ribera 2026 — resumen:</strong> Aranda de Duero está en Burgos, a 160 km de Madrid por la A-1. No hay tren al pueblo. Opciones: (1) <strong>Bus La Sepulvedana</strong> Madrid (Conde de Casal)–Aranda de Duero (1h 45 min, 10–15 €, sin servicio nocturno de vuelta); (2) <strong>Carpooling ConcertRide</strong> desde Madrid (10–14 €, 1h 45 min), Valladolid (8–12 €, 1h), Burgos (5–8 €, 40 min), Bilbao (8–12 €, 2h) o Zaragoza (9–13 €, 2h 30 min). La vuelta de madrugada del Sonorama (1:00–3:00 AM) no tiene transporte público — el carpooling es la única opción práctica.</p>`,
  "tomavistas": `<p><strong>Transporte a Tomavistas 2026 — resumen:</strong> Los Jardines del Buen Retiro están en pleno centro de Madrid. Opciones de transporte: (1) <strong>Metro L2</strong> parada Retiro o <strong>L9</strong> parada Ibiza (5 min a pie al recinto); (2) <strong>Autobús EMT</strong> líneas 1, 9, 10, 14, 19 (frecuencia alta durante el festival); (3) <strong>Carpooling ConcertRide</strong> para asistentes de fuera de Madrid desde Valencia (10–14 €), Zaragoza (9–13 €), Barcelona (15–20 €) o Guadalajara (3–5 €). La vuelta de madrugada del Tomavistas en el centro de Madrid es la más cómoda de todos los festivales — el metro funciona hasta las 1:30 y los Búhos nocturno cubren el resto.</p>`,
  "cruilla": `<p><strong>Transporte a Cruïlla 2026 — resumen:</strong> El Parc del Fòrum (mismo recinto que Primavera Sound) está en Sant Adrià de Besòs. Opciones: (1) <strong>Metro L4</strong> parada Besòs Mar (2 min a pie); (2) <strong>Tramvia T4/T5/T6</strong> desde Glòries o el Fòrum; (3) <strong>Carpooling ConcertRide</strong> desde Madrid (14–22 €, 5h 30 min), Valencia (10–14 €, 3h 15 min), Zaragoza (8–12 €, 2h 45 min), Tarragona (5–8 €, 1h 15 min) o Girona (5–8 €, 1h). El metro L4 se amplía hasta las 3:00 AM los días del festival.</p>`,
  "low-festival": `<p><strong>Transporte a Low Festival Benidorm 2026 — resumen:</strong> El recinto está en el Parque de Actividades de Benidorm. No hay transporte público directo al recinto. Opciones: (1) <strong>TRAM Alicante–Benidorm</strong> (L1, 45 min, 3,50 €) — la estación de Benidorm queda a 15 min a pie del recinto; (2) <strong>Bus ALSA</strong> desde Valencia (1h 45 min) o Alicante (40 min); (3) <strong>Carpooling ConcertRide</strong> desde Valencia (20–30 €, 1h 45 min), Alicante (15 €, 40 min), Madrid (18–26 €, 3h 30 min) o Barcelona (20–28 €, 4h 30 min). La vuelta de madrugada (1:00–3:00 AM) no tiene servicio público — el carpooling es la única opción práctica.</p>`,
};

const FESTIVAL_WIKIDATA: Record<string, string> = {
  "mad-cool": "https://www.wikidata.org/wiki/Q22808739",
  "primavera-sound": "https://www.wikidata.org/wiki/Q578193",
  "sonar": "https://www.wikidata.org/wiki/Q1101937",
  "fib": "https://www.wikidata.org/wiki/Q630302",
  "bbk-live": "https://www.wikidata.org/wiki/Q1966430",
  "resurrection-fest": "https://www.wikidata.org/wiki/Q7316296",
  "arenal-sound": "https://www.wikidata.org/wiki/Q4791029",
  "medusa-festival": "https://www.wikidata.org/wiki/Q60882827",
  "vina-rock": "https://www.wikidata.org/wiki/Q2311477",
  "o-son-do-camino": "https://www.wikidata.org/wiki/Q16537994",
  "sonorama-ribera": "https://www.wikidata.org/wiki/Q1305386",
  "cala-mijas": "https://www.wikidata.org/wiki/Q116748766",
  "cruilla": "https://www.wikidata.org/wiki/Q5189432",
  "low-festival": "https://www.wikidata.org/wiki/Q15270028",
  "tomavistas": "https://www.wikidata.org/wiki/Q30292264",
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

  const wikidataUri = FESTIVAL_WIKIDATA[slug];
  const festivalImage = f.image ?? `${base}/og-fallback.png`;
  const festYear = new Date(f.startDate).getFullYear();
  const festAbstract = `${f.name} se celebra en ${f.venue}, ${f.city}, del ${f.startDate} al ${f.endDate}. Carpooling con ConcertRide desde ${f.originCities[0]?.city ?? "toda España"} desde ${f.originCities[0]?.range ?? f.priceFrom + " €"}/asiento, sin comisión de plataforma. ${f.originCities.length} ciudades de origen cubiertas.`;
  const eventJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "@id": `${base}/festivales/${slug}#event`,
    name: f.name,
    startDate: f.startDate,
    endDate: f.endDate,
    image: festivalImage,
    description: `${f.blurb} Encuentra o publica un viaje compartido a ${f.name} desde cualquier ciudad de España. Sin comisión. ConcertRide.`,
    abstract: festAbstract,
    url: `${base}/festivales/${slug}`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    typicalAgeRange: "18-",
    audience: { "@type": "Audience", audienceType: "Aficionados a la música", geographicArea: { "@type": "Country", name: "Spain" } },
    ...(wikidataUri ? { sameAs: wikidataUri } : {}),
    keywords: [
      `carpooling ${f.shortName}`,
      `cómo ir a ${f.shortName}`,
      `transporte ${f.shortName} ${f.city}`,
      `${f.shortName} ${festYear}`,
      `autobús ${f.shortName}`,
      `bus ${f.shortName}`,
    ].join(", "),
    location: {
      "@type": "Place",
      name: f.venue,
      address: { "@type": "PostalAddress", streetAddress: f.venueAddress, addressLocality: f.city, addressCountry: "ES" },
      additionalProperty: f.originCities.map((oc) => ({
        "@type": "PropertyValue",
        name: `Distancia desde ${oc.city}`,
        value: `${oc.km} km · ${oc.drivingTime} · carpooling ${oc.range}`,
      })),
    },
    inLanguage: "es-ES",
    performer: { "@type": "PerformingGroup", name: f.name },
    organizer: { "@type": "Organization", name: f.name, url: `${base}/festivales/${slug}` },
    offers: {
      "@type": "Offer",
      price: f.priceFrom,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      validFrom: f.startDate,
      url: `${base}/festivales/${slug}`,
      description: `Carpooling a ${f.name} desde ${f.priceFrom} €/asiento. Sin comisión.`,
    },
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

  const howToJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Cómo reservar un carpooling a ${f.name} en 4 pasos`,
    description: `Guía paso a paso para reservar un viaje compartido a ${f.name} en ${f.venue}, ${f.city}. Gratis, sin comisión, pago en efectivo o Bizum.`,
    totalTime: "PT5M",
    step: [
      { "@type": "HowToStep", position: 1, name: "Busca el festival", text: `Entra en concertride.me y busca "${f.shortName}".`, url: `${base}/concerts` },
      { "@type": "HowToStep", position: 2, name: "Elige el viaje", text: "Compara precio, hora de salida y perfil del conductor." },
      { "@type": "HowToStep", position: 3, name: "Solicita tu plaza", text: "Con reserva instantánea se confirma al momento." },
      { "@type": "HowToStep", position: 4, name: "Viaja y paga", text: `El día del festival pagas en efectivo o Bizum directamente al conductor. Sin comisión.` },
    ],
  });

  const webPageJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${base}/festivales/${slug}#webpage`,
    url: `${base}/festivales/${slug}`,
    name: `Carpooling a ${f.name} ${new Date(f.startDate).getFullYear()} — desde ${f.priceFrom} € · sin comisión | ConcertRide`,
    inLanguage: "es-ES",
    dateModified: "2026-05-03",
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable", ".festival-summary", "p:first-of-type"] },
    isPartOf: { "@type": "WebSite", "@id": `${base}/#website`, name: "ConcertRide", url: base },
    about: { "@type": "MusicEvent", "@id": `${base}/festivales/${slug}#event` },
  });

  return `<script type="application/ld+json">${eventJsonLd}</script>
<script type="application/ld+json">${faqJsonLd}</script>
<script type="application/ld+json">${breadcrumbJsonLd}</script>
<script type="application/ld+json">${howToJsonLd}</script>
<script type="application/ld+json">${webPageJsonLd}</script>
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
<h2>Comparativa de transporte a ${esc(f.shortName)} ${festYear}</h2>
<table>
  <thead>
    <tr><th>Opción</th><th>Precio desde ${esc(f.originCities[0]?.city ?? "origen")}</th><th>Comisión</th><th>Vuelta madrugada</th><th>Reserva</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>ConcertRide carpooling</strong></td><td>${esc(f.originCities[0]?.range ?? f.priceFrom + " €")}/asiento</td><td>0 %</td><td>Sí (coordinada con el conductor)</td><td>Instantánea</td></tr>
    <tr><td>Taxi / VTC (Uber, Cabify)</td><td>35–80 € ida (precio nocturno)</td><td>—</td><td>Sí (precio x2–x3 de madrugada)</td><td>App</td></tr>
    <tr><td>BlaBlaCar</td><td>${esc(f.originCities[0]?.range ?? f.priceFrom + " €")} + 12–18 % comisión</td><td>12–18 %</td><td>Depende del conductor</td><td>Con aprobación</td></tr>
    <tr><td>Autobús / tren público</td><td>3–15 € (si hay servicio)</td><td>—</td><td>No (último servicio ~1:30)</td><td>Taquilla / app</td></tr>
  </tbody>
</table>
<p><em>Tabla elaborada con datos de ConcertRide, EMT/Renfe y estimaciones de tarificación nocturna de VTC (2026).</em></p>
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

  const CITY_FAQ_OVERRIDES: Record<string, { q: string; a: string }[]> = {
    madrid: [
      { q: "¿Qué conciertos hay en Madrid en 2026?", a: `Los principales recintos de conciertos en Madrid en 2026 son: WiZink Center (18.000 plazas), Palacio Vistalegre (15.000), Caja Mágica (50.000), IFEMA Feria de Madrid (hasta 80.000 — sede del Mad Cool Festival 9–11 jul) y Coca-Cola Music Experience. ConcertRide cubre carpooling a todos estos recintos desde otras ciudades.` },
      { q: "¿Cómo llegar al WiZink Center o a IFEMA en coche compartido?", a: "El WiZink Center está bien comunicado en metro (L4 Diego de León). Para IFEMA (Mad Cool Festival), el metro L8 llega a 'Feria de Madrid' en 25 minutos desde Sol, pero cierra a la 1:30. ConcertRide conecta a asistentes desde Barcelona, Valencia, Zaragoza y otras ciudades con conductores que van al mismo concierto en Madrid." },
      { q: "¿Cuánto cuesta el carpooling a Madrid para un concierto?", a: "Desde Barcelona: 14–22 €/asiento (620 km, 5h 30 min). Desde Valencia: 10–14 € (355 km, 3h 20 min). Desde Zaragoza: 9–13 € (325 km, 3h). Desde Sevilla: 12–18 € (530 km, 5h). Sin comisión de plataforma — el precio va íntegro al conductor." },
      { q: "¿Es seguro el carpooling para ir a conciertos en Madrid?", a: "Sí. En ConcertRide todos los conductores verifican su carnet de conducir antes de publicar viajes. Puedes ver el perfil, las valoraciones y comunicarte por chat antes del evento. El pago es en persona — nunca adelantas dinero." },
    ],
    barcelona: [
      { q: "¿Qué festivales y conciertos hay en Barcelona en 2026?", a: "Barcelona acoge tres de los mayores festivales de España en 2026: Primavera Sound (Parc del Fòrum, 28 may–1 jun, 60.000 asistentes/día), Sónar (Fira Montjuïc y Gran Via, 18–20 jun) y Cruïlla (Parc del Fòrum, 9–12 jul). Otros recintos clave: Palau Sant Jordi (17.000), Palau Blaugrana." },
      { q: "¿Hay metro al Parc del Fòrum (Primavera Sound / Cruïlla)?", a: "Sí. El metro L4 (parada Besòs Mar) conecta con el Parc del Fòrum en 2 minutos a pie. El servicio se amplía hasta las 5:00 los viernes y sábados en temporada de festival. Las colas de salida pueden ser de 30–45 minutos. El carpooling desde otras ciudades (Madrid 14–22 €, Valencia 10–14 €) llega directo al recinto." },
      { q: "¿Cuánto cuesta el carpooling a Barcelona para un concierto o festival?", a: "Desde Madrid: 14–22 €/asiento (620 km, 5h 30 min). Desde Valencia: 10–14 € (350 km, 3h 15 min). Desde Zaragoza: 8–12 € (300 km, 2h 45 min). Desde Bilbao: 12–18 € (615 km, 5h). Sin comisión de plataforma." },
      { q: "¿Es seguro el carpooling para ir a festivales en Barcelona?", a: "Sí. En ConcertRide todos los conductores verifican su carnet de conducir antes de publicar viajes. Puedes ver el perfil, las valoraciones y comunicarte por chat antes del evento. El pago es en persona — nunca adelantas dinero." },
    ],
    bilbao: [
      { q: "¿Qué conciertos y festivales hay en Bilbao en 2026?", a: "El festival principal de Bilbao en 2026 es BBK Live (Kobetamendi, 9–11 julio, 30.000 personas/día). El Bilbao Arena Miribilla (10.000 plazas) acoge tours indoor, y el Palacio Euskalduna cubre formatos más íntimos. Acceso a BBK Live solo por lanzadera oficial gratuita desde Plaza Moyúa." },
      { q: "¿Cómo llegar al BBK Live en Kobetamendi?", a: "El recinto de BBK Live (Kobetamendi) es accesible únicamente por lanzadera oficial gratuita desde Plaza Moyúa (incluida en la entrada). No se puede llegar en coche propio. Para venir desde otras ciudades: ConcertRide desde Santander (100 km, 4–7 €), Donostia (100 km, 5–8 €), Madrid (395 km, 11–16 €)." },
      { q: "¿Cuánto cuesta el carpooling a Bilbao para el BBK Live?", a: "Desde Santander: 4–7 €/asiento (100 km, 1h). Desde Vitoria-Gasteiz: 3–6 € (65 km, 45 min). Desde Pamplona: 5–8 € (155 km, 1h 30 min). Desde Madrid: 11–16 € (395 km, 3h 30 min). Sin comisión de plataforma." },
      { q: "¿Es seguro el carpooling para BBK Live?", a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es en efectivo o Bizum el día del viaje — sin riesgo económico en cancelaciones anticipadas." },
    ],
    valencia: [
      { q: "¿Qué festivales y conciertos hay en Valencia en 2026?", a: "Valencia ciudad acoge Zevra Festival (La Marina de València, verano 2026; Metro L4 Marítim-Serreria). La provincia es densa en festivales: Arenal Sound (Burriana, 55 km, 29 jul–2 ago), Medusa Festival (Cullera, 40 km, 12–16 ago) y FIB (Benicàssim, 75 km, 16–19 jul). ConcertRide cubre todas las rutas desde Valencia." },
      { q: "¿Cómo llegar al Zevra Festival en La Marina de Valencia?", a: "Metro L4, paradas Marítim-Serreria o Neptú (5–8 min a pie al recinto). El servicio se amplía hasta la 1:00–2:00 en noches de festival. El carpooling desde Madrid cuesta 10–14 €; desde Alicante 5–8 €." },
      { q: "¿Cuánto cuesta el carpooling desde Valencia a los festivales cercanos?", a: "Arenal Sound (Burriana, 55 km): 3–6 €/asiento. Medusa (Cullera, 40 km): 3–5 €. FIB (Benicàssim, 75 km): 3–6 €. Zevra Festival (La Marina, dentro de Valencia): 3–5 €. Sin comisión — precio íntegro al conductor." },
      { q: "¿Es seguro el carpooling a los festivales de Valencia?", a: "Sí. En ConcertRide todos los conductores verifican su carnet de conducir antes de publicar viajes. El pago es directo al conductor en efectivo o Bizum el día del viaje." },
    ],
    sevilla: [
      { q: "¿Qué conciertos y festivales hay en Sevilla en 2026?", a: "Los principales recintos de conciertos en Sevilla son: Estadio La Cartuja (60.000 plazas), FIBES (9.500 plazas), Palacio de los Deportes San Pablo (7.000) y Cartuja Center CITE. Festivales: Interestelar Sevilla (mayo, Charco de la Pava, 40.000 asistentes) e Icónica Sevilla Fest (Plaza de España). Sevilla es también punto de origen para Cala Mijas (200 km, 6–9 €)." },
      { q: "¿Cómo ir a Cala Mijas Fest desde Sevilla?", a: "Cala Mijas Fest 2026 (2–4 oct) se celebra en Cortijo de Torres, Málaga capital — a 200 km de Sevilla (2h por la A-92). No hay shuttle oficial. Con ConcertRide: 6–9 €/asiento desde Sevilla. No hay transporte público nocturno desde el recinto." },
      { q: "¿Cuánto cuesta el carpooling desde Sevilla a festivales de otras ciudades?", a: "A Cala Mijas (Málaga, 200 km): 6–9 €/asiento. A Mad Cool (Madrid, 530 km): 12–18 €. A Primavera Sound (Barcelona, 1.000 km): 22–30 €. A Viña Rock (Villarrobledo, 420 km): 10–15 €. Sin comisión de plataforma." },
      { q: "¿Es seguro el carpooling para ir a conciertos desde Sevilla?", a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es en efectivo o Bizum el día del viaje — nunca pagas por adelantado." },
    ],
    malaga: [
      { q: "¿Qué festivales y conciertos hay en Málaga en 2026?", a: "Málaga y su costa acogen Cala Mijas Fest (2–4 oct, Cortijo de Torres, Málaga capital), Andalucía Big Festival y Marenostrum Music Castle (Castillo Sohail de Fuengirola). No confundir: el recinto de Cala Mijas está en Málaga capital, no en La Cala de Mijas." },
      { q: "¿Dónde es exactamente el Cala Mijas Festival?", a: "Cala Mijas Fest se celebra en el Recinto Cortijo de Torres, Av. Juan Carlos I, Málaga capital (no en el pueblo La Cala de Mijas). A 25 km del centro de Málaga (25 min por la MA-20/A-7). Sin shuttle oficial — taxi 25–40 €; ConcertRide desde Málaga 3–5 €." },
      { q: "¿Cuánto cuesta el carpooling al Cala Mijas Fest?", a: "Desde Málaga centro: 3–5 €/asiento (25 km). Desde Marbella: 3–6 € (35 km). Desde Fuengirola: 3–5 € (15 km). Desde Sevilla: 6–9 € (200 km). Desde Madrid: 14–20 € (590 km). Sin comisión." },
      { q: "¿Es seguro el carpooling para ir a conciertos en Málaga?", a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores antes de publicar viajes. El pago es directo al conductor en efectivo o Bizum." },
    ],
    zaragoza: [
      { q: "¿Qué conciertos hay en Zaragoza en 2026?", a: "El Pabellón Príncipe Felipe (10.700 plazas) acoge la mayoría de giras nacionales e internacionales en Zaragoza. La Sala López y el Auditorio cubren mid-size. Pirineos Sur (Lanuza, 130 km) es el festival de música del mundo más relevante del Pirineo aragonés. Zaragoza es origen estratégico para Mad Cool (320 km), Primavera Sound (300 km) y Arenal Sound (275 km)." },
      { q: "¿Cuánto cuesta el carpooling desde Zaragoza a los festivales más importantes?", a: "A Mad Cool (Madrid, 325 km): 9–13 €/asiento. A Primavera Sound (Barcelona, 306 km): 8–12 €. A Arenal Sound (Burriana, 275 km): 8–12 €. A FIB (Benicàssim, 270 km): 7–11 €. Sin comisión de plataforma." },
      { q: "¿Cómo ir a festivales desde Zaragoza en coche compartido?", a: "Con ConcertRide buscas por festival y encuentras conductores que salen de Zaragoza o de ciudades cercanas. La posición equidistante de Zaragoza entre Madrid y Barcelona hace que haya buena oferta en ambas direcciones." },
      { q: "¿Es seguro el carpooling desde Zaragoza?", a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es en efectivo o Bizum el día del viaje." },
    ],
    "a-coruna": [
      { q: "¿Qué conciertos hay en A Coruña en 2026?", a: "A Coruña es el principal punto de origen para el Resurrection Fest (Viveiro, 100 km, 25–28 jun 2026), el festival de metal más importante de España. El Coliseum (10.000 plazas), Palexco y la Sala Pelícano acogen conciertos nacionales e internacionales durante todo el año." },
      { q: "¿Cuánto cuesta el carpooling de A Coruña al Resurrection Fest?", a: "Viveiro está a 100 km de A Coruña (1h 15 min). Con ConcertRide el precio por asiento es 4–7 €. Es el trayecto más habitual del festival: el carpooling es la única opción viable para volver de madrugada." },
      { q: "¿Hay transporte público de A Coruña a Viveiro para el Resurrection Fest?", a: "El bus ALSA A Coruña–Viveiro (2–3 frecuencias al día, 2h 30 min) no opera en horario nocturno. Para la vuelta del festival (madrugada 1:00–3:00) el carpooling con ConcertRide es la única opción práctica." },
      { q: "¿Es seguro el carpooling al Resurrection Fest?", a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es directo al conductor en efectivo o Bizum el día del viaje." },
    ],
    "santiago-de-compostela": [
      { q: "¿Qué festivales hay en Santiago de Compostela en 2026?", a: "El festival más importante con sede en Santiago es O Son do Camiño (Monte do Gozo, 18–20 jun 2026, 90.000+ asistentes). Bus urbano C10 desde el centro de la ciudad hasta el recinto. ConcertRide conecta a asistentes desde A Coruña (60 km), Vigo (90 km), Oviedo (250 km) y más." },
      { q: "¿Cómo llegar a O Son do Camiño desde Santiago?", a: "El recinto de O Son do Camiño está en Monte do Gozo, a 5 km del centro de Santiago. Bus urbano C10 desde la Rúa do Franco. También accesible en taxi (10–15 €) o con ConcertRide desde otras ciudades gallegas." },
      { q: "¿Cuánto cuesta el carpooling a O Son do Camiño?", a: "Desde A Coruña: 10–12 €/asiento (60 km, 1h 15 min). Desde Vigo: 12–15 € (90 km, 1h 30 min). Desde Oviedo: 14–18 € (250 km, 2h 30 min). Sin comisión de plataforma." },
      { q: "¿Es seguro el carpooling a O Son do Camiño?", a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es directo al conductor en efectivo o Bizum el día del viaje." },
    ],
    alicante: [
      { q: "¿Qué festivales hay cerca de Alicante en 2026?", a: "Cerca de Alicante hay varios festivales importantes: Low Festival (Benidorm, 45 km, 24–26 jul), Arenal Sound (Burriana, 115 km, 29 jul–2 ago), Medusa Festival (Cullera, 100 km, 12–16 ago) y Zevra Festival (Valencia, 175 km). ConcertRide cubre todas las rutas desde Alicante con precios entre 3 y 8 €/asiento." },
      { q: "¿Cómo llegar al Low Festival desde Alicante?", a: "Low Festival (Benidorm) está a 45 km de Alicante (35 min por la A-7). No hay transporte público nocturno al recinto. Con ConcertRide el precio es 15 €/asiento. El TRAM L1 Alicante–Benidorm opera hasta medianoche — no es válido para la vuelta de madrugada." },
      { q: "¿Cuánto cuesta el carpooling desde Alicante a festivales?", a: "A Low Festival (Benidorm, 45 km): 15 €/asiento. A Arenal Sound (Burriana, 115 km): 4–7 €. A Medusa Festival (Cullera, 100 km): 4–6 €. A Viña Rock (Villarrobledo, 165 km): 5–8 €. Sin comisión." },
      { q: "¿Es seguro el carpooling desde Alicante?", a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es en efectivo o Bizum directamente al conductor el día del viaje." },
    ],
    pamplona: [
      { q: "¿Qué festivales están cerca de Pamplona en 2026?", a: "Desde Pamplona los festivales más accesibles son: BBK Live (Bilbao, 155 km, 9–11 jul), Sonorama Ribera (Aranda de Duero, 250 km, 6–9 ago) y Mad Cool (Madrid, 390 km, 9–11 jul). Navarra Arena y Anaitasuna acogen conciertos nacionales en Pamplona ciudad." },
      { q: "¿Cuánto cuesta el carpooling desde Pamplona a BBK Live?", a: "BBK Live (Bilbao) está a 155 km de Pamplona (1h 30 min por la A-15). Con ConcertRide el precio es 5–8 €/asiento. Desde Bilbao hay lanzadera gratuita al Kobetamendi (incluida en la entrada)." },
      { q: "¿Cómo ir desde Pamplona a festivales del norte en coche compartido?", a: "ConcertRide conecta a pamploneses con conductores hacia BBK Live (5–8 €), Azkena Rock Vitoria (95 km, 4–6 €), Donostia (100 km, 4–7 €) y otros festivales del arco norte de España." },
      { q: "¿Es seguro el carpooling desde Pamplona?", a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es en efectivo o Bizum el día del viaje." },
    ],
    "vitoria-gasteiz": [
      { q: "¿Qué festivales hay cerca de Vitoria-Gasteiz en 2026?", a: "Vitoria-Gasteiz es sede del Azkena Rock Festival (Mendizabala, junio, 35.000 personas/día). A poca distancia: BBK Live Bilbao (65 km, 9–11 jul) con lanzadera gratuita al Kobetamendi. Iradier Arena y Sala Helldorado acogen conciertos durante el año." },
      { q: "¿Cuánto cuesta el carpooling de Vitoria a BBK Live?", a: "BBK Live (Bilbao) está a 65 km de Vitoria-Gasteiz (45 min). Con ConcertRide: 3–6 €/asiento. Desde Bilbao hay lanzadera gratuita al Kobetamendi incluida en la entrada." },
      { q: "¿Cómo ir a festivales del País Vasco desde Vitoria-Gasteiz?", a: "ConcertRide conecta a vitorianos con conductores hacia BBK Live (3–6 €), Donostia (80 km, 3–6 €), Sonorama Ribera (185 km, 5–8 €) y Mad Cool (350 km, 9–13 €)." },
      { q: "¿Es seguro el carpooling desde Vitoria-Gasteiz?", a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es en efectivo o Bizum el día del viaje." },
    ],
    vigo: [
      { q: "¿Qué conciertos y festivales hay cerca de Vigo en 2026?", a: "Desde Vigo los festivales más próximos son: O Son do Camiño (Santiago, 90 km, 18–20 jun) y Resurrection Fest (Viveiro, 200 km, 25–28 jun). El Auditorio Mar de Vigo (3.000 plazas) y el Pabellón Multiusos (12.000) acogen conciertos nacionales." },
      { q: "¿Cuánto cuesta el carpooling de Vigo al Resurrection Fest?", a: "Viveiro está a 200 km de Vigo (2h 15 min). Con ConcertRide el precio es 6–9 €/asiento. Sin transporte nocturno de vuelta — el carpooling es la única opción práctica para volver de madrugada." },
      { q: "¿Cómo ir desde Vigo a festivales gallegos?", a: "ConcertRide conecta a vigueses con conductores hacia Resurrection Fest (6–9 €), O Son do Camiño (12–15 €) y Festival de la Luz (Boimorto). La red de carpooling gallega es especialmente activa en festivales de metal y folk." },
      { q: "¿Es seguro el carpooling desde Vigo?", a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es en efectivo o Bizum el día del viaje." },
    ],
    murcia: [
      { q: "¿Qué festivales hay cerca de Murcia en 2026?", a: "Desde Murcia los festivales más accesibles son: Medusa Festival (Cullera, 180 km, 12–16 ago), Arenal Sound (Burriana, 250 km, 29 jul–2 ago) y Viña Rock (Villarrobledo, 155 km, 30 abr–3 may). Murcia acoge también SOS 4.8, R-Murcia Festival y el WAM." },
      { q: "¿Cuánto cuesta el carpooling desde Murcia a festivales de España?", a: "A Medusa Festival (Cullera, 180 km): 5–8 €/asiento. A Viña Rock (Villarrobledo, 155 km): 5–8 €. A Arenal Sound (Burriana, 250 km): 7–11 €. A Mad Cool (Madrid, 400 km): 10–15 €. Sin comisión." },
      { q: "¿Cómo ir al Viña Rock desde Murcia en coche compartido?", a: "Viña Rock (Villarrobledo, Albacete) está a 155 km de Murcia (1h 30 min por la A-30). Con ConcertRide: 5–8 €/asiento. No hay transporte público nocturno al recinto." },
      { q: "¿Es seguro el carpooling desde Murcia?", a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es directo al conductor en efectivo o Bizum." },
    ],
    valladolid: [
      { q: "¿Qué festivales hay cerca de Valladolid en 2026?", a: "El festival más próximo a Valladolid es Sonorama Ribera (Aranda de Duero, 100 km, 6–9 ago). Mad Cool (Madrid, 200 km) y BBK Live (Bilbao, 280 km) también son destinos habituales para el carpooling desde Valladolid. La Plaza de Toros y el Pabellón Pisuerga acogen conciertos nacionales." },
      { q: "¿Cuánto cuesta el carpooling de Valladolid al Sonorama Ribera?", a: "Sonorama Ribera (Aranda de Duero) está a 100 km de Valladolid (1h). Con ConcertRide el precio es 8–12 €/asiento. Es el festival más accesible para los vallisoletanos — más barato que el bus." },
      { q: "¿Cómo ir desde Valladolid a Madrid en coche compartido para conciertos?", a: "Madrid está a 200 km de Valladolid (1h 45 min por la A-62). Con ConcertRide: 6–10 €/asiento para conciertos en WiZink Center, Vistalegre, IFEMA (Mad Cool) o Caja Mágica." },
      { q: "¿Es seguro el carpooling desde Valladolid?", a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es en efectivo o Bizum el día del viaje." },
    ],
    granada: [
      { q: "¿Qué festivales hay cerca de Granada en 2026?", a: "Granada acoge Granada Sound (Cortijo del Conde, septiembre). La cercanía con Málaga (90 km) la convierte en punto de origen para Cala Mijas Fest (Cortijo de Torres, Málaga, 2–4 oct). Desde Granada también hay carpooling a Interestelar Sevilla (260 km) y festivales andaluces." },
      { q: "¿Cuánto cuesta el carpooling desde Granada al Cala Mijas Fest?", a: "Cala Mijas Fest (Cortijo de Torres, Málaga) está a 125 km de Granada (1h 15 min por la A-92). Con ConcertRide el precio es 5–8 €/asiento. Sin shuttle oficial al recinto." },
      { q: "¿Cómo ir desde Granada a festivales andaluces en coche compartido?", a: "ConcertRide conecta a granadinos con conductores hacia Cala Mijas (5–8 €), Interestelar Sevilla (260 km, 7–11 €) y Mad Cool (470 km, 12–18 €). Pago en efectivo o Bizum, sin comisión." },
      { q: "¿Es seguro el carpooling desde Granada?", a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es directo al conductor en efectivo o Bizum." },
    ],
    donostia: [
      { q: "¿Qué conciertos y festivales hay en Donostia en 2026?", a: "El Heineken Jazzaldia (Plaza de la Trinidad y Kursaal, julio) y Donostia Arena (10.000 plazas) son los principales eventos de música en Donostia. La cercanía con BBK Live Bilbao (100 km) hace que muchos viajes compartidos desde Donostia vayan al Kobetamendi." },
      { q: "¿Cuánto cuesta el carpooling de Donostia al BBK Live?", a: "BBK Live (Bilbao) está a 100 km de Donostia (1h por la A-8). Con ConcertRide el precio es 5–8 €/asiento. Desde Bilbao, lanzadera oficial gratuita al Kobetamendi incluida en la entrada del festival." },
      { q: "¿Cómo ir a festivales del norte de España desde Donostia?", a: "ConcertRide conecta a donostiarras con conductores hacia BBK Live (5–8 €), Azkena Rock Vitoria (100 km, 4–6 €), Sonorama Ribera (370 km, 10–15 €) y Mad Cool (450 km, 12–18 €)." },
      { q: "¿Es seguro el carpooling desde Donostia?", a: "Sí. ConcertRide verifica el carnet de conducir de todos los conductores. El pago es en efectivo o Bizum el día del viaje." },
    ],
  };

  const cityFaqs = CITY_FAQ_OVERRIDES[slug] ?? [
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

  const howToJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Cómo ir a un concierto en ${c.name} con ConcertRide`,
    description: `Guía para encontrar y reservar un carpooling a conciertos en ${c.name}. Gratis, sin comisión, pago en efectivo o Bizum.`,
    totalTime: "PT3M",
    step: [
      { "@type": "HowToStep", position: 1, name: "Busca el concierto", text: `Entra en concertride.me/conciertos/${slug} y explora los conciertos con carpooling disponible en ${c.name}.`, url: `${base}/conciertos/${slug}` },
      { "@type": "HowToStep", position: 2, name: "Elige el viaje", text: "Compara precio por asiento, ciudad de origen y perfil del conductor. Lee las valoraciones de otros pasajeros." },
      { "@type": "HowToStep", position: 3, name: "Reserva y paga", text: `El día del concierto en ${c.name} te reúnes con el conductor en el punto acordado. Pagas en efectivo o Bizum. Sin comisión.` },
    ],
  });

  const localBusinessJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${base}/conciertos/${slug}#localbusiness`,
    name: `ConcertRide — Carpooling a conciertos en ${c.name}`,
    description: c.blurb,
    url: `${base}/conciertos/${slug}`,
    inLanguage: "es-ES",
    address: {
      "@type": "PostalAddress",
      addressLocality: c.name,
      addressRegion: c.region,
      addressCountry: "ES",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: c.lat,
      longitude: c.lng,
    },
    areaServed: {
      "@type": "City",
      name: c.name,
      sameAs: `https://www.wikidata.org/wiki/Q${slug === "madrid" ? "2807" : slug === "barcelona" ? "1492" : slug === "valencia" ? "8818" : slug === "sevilla" ? "8717" : slug === "bilbao" ? "8692" : slug === "malaga" ? "8862" : slug === "zaragoza" ? "10305" : slug === "granada" ? "8811" : slug === "donostia" ? "10313" : slug === "santiago-de-compostela" ? "8823" : slug === "alicante" ? "11959" : slug === "pamplona" ? "10282" : slug === "vitoria-gasteiz" ? "10330" : slug === "a-coruna" ? "8757" : slug === "vigo" ? "8745" : slug === "murcia" ? "12225" : slug === "valladolid" ? "8748" : "0"}`,
    },
    priceRange: "3–35 €/asiento",
    currenciesAccepted: "EUR",
    paymentAccepted: "Efectivo, Bizum",
    openingHours: "Mo-Su 00:00-24:00",
    sameAs: [
      "https://twitter.com/concertride_es",
      "https://www.instagram.com/concertride_es/",
    ],
    parentOrganization: { "@type": "Organization", "@id": `${base}/#organization`, name: "ConcertRide" },
  });

  const webPageJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${base}/conciertos/${slug}#webpage`,
    url: `${base}/conciertos/${slug}`,
    name: `Conciertos en ${c.name} 2026–2027 — Carpooling sin comisión | ConcertRide`,
    inLanguage: "es-ES",
    dateModified: "2026-05-03",
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable", "p:first-of-type"] },
    isPartOf: { "@type": "WebSite", "@id": `${base}/#website`, name: "ConcertRide", url: base },
    about: { "@type": "LocalBusiness", "@id": `${base}/conciertos/${slug}#localbusiness` },
  });

  return `<script type="application/ld+json">${breadcrumbJsonLd}</script>
<script type="application/ld+json">${webPageJsonLd}</script>
<script type="application/ld+json">${localBusinessJsonLd}</script>
<script type="application/ld+json">${collectionJsonLd}</script>
<script type="application/ld+json">${faqJsonLd}</script>
<script type="application/ld+json">${howToJsonLd}</script>
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

const BLOG_ENTITY_SAME_AS: Record<string, string> = {
  "autobuses": "https://www.wikidata.org/wiki/Q928830",
  "buses": "https://www.wikidata.org/wiki/Q928830",
  "carpooling": "https://www.wikidata.org/wiki/Q1343571",
  "festivales": "https://www.wikidata.org/wiki/Q213492",
  "transporte": "https://www.wikidata.org/wiki/Q7590",
  "Mad Cool": "https://www.madcoolfestival.es/",
  "Primavera Sound": "https://www.primaverasound.com/",
  "Sónar": "https://sonar.es/",
  "BBK Live": "https://bbklive.com/",
  "Arenal Sound": "https://arenalsound.com/",
  "Viña Rock": "https://www.vinarock.es/",
  "Resurrection Fest": "https://www.resurrectionfest.es/",
  "BlaBlaCar": "https://www.blablacar.es/",
};

function blogBody(slug: string, p: BlogData, base: string): string {
  const wordCount = p.sections.reduce((acc, s) => acc + s.paragraphs.join(" ").split(/\s+/).length, 0);
  const abstract = (() => {
    const sentences = p.excerpt.split(/(?<=[.!?])\s+/);
    let result = "";
    for (const s of sentences) {
      if ((result + " " + s).trim().split(/\s+/).length > 60) break;
      result = (result + " " + s).trim();
    }
    return result || p.excerpt.slice(0, 280);
  })();
  const firstTag = p.tags && p.tags.length > 0 ? p.tags[0] : "";
  const articleJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    name: p.title,
    description: p.excerpt,
    abstract,
    wordCount,
    author: {
      "@type": "Person",
      name: p.author,
      url: `${base}/acerca-de`,
      "@id": `${base}/#founder`,
      sameAs: [
        "https://www.linkedin.com/company/concertride-es",
        "https://twitter.com/concertride_es",
      ],
    },
    publisher: { "@type": "Organization", name: "ConcertRide", "@id": `${base}/#organization`, logo: { "@type": "ImageObject", url: `${base}/favicon.svg`, width: 512, height: 512 } },
    audience: { "@type": "Audience", audienceType: "Aficionados a la música y asistentes a festivales en España", geographicArea: { "@type": "Country", name: "Spain" } },
    datePublished: p.publishedAt,
    dateModified: p.updatedAt ?? p.publishedAt,
    url: `${base}/blog/${slug}`,
    inLanguage: "es-ES",
    mainEntityOfPage: { "@type": "WebPage", "@id": `${base}/blog/${slug}` },
    isPartOf: { "@type": "Blog", "@id": `${base}/blog`, name: "Blog ConcertRide", url: `${base}/blog` },
    articleSection: "Carpooling y festivales",
    keywords: p.tags && p.tags.length > 0 ? p.tags.join(", ") : p.title,
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".speakable", "article p:first-of-type"] },
    about: firstTag
      ? { "@type": "Thing", name: firstTag, ...(BLOG_ENTITY_SAME_AS[firstTag] ? { sameAs: BLOG_ENTITY_SAME_AS[firstTag] } : {}) }
      : { "@type": "Thing", name: "Carpooling festivales España" },
    mentions: (p.tags ?? []).map((tag) => ({
      "@type": "Thing",
      name: tag,
      ...(BLOG_ENTITY_SAME_AS[tag] ? { sameAs: BLOG_ENTITY_SAME_AS[tag] } : {}),
    })),
    image: { "@type": "ImageObject", url: `${base}/og/home.png`, width: 1200, height: 630 },
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

  const faqItems = (p.faqs ?? []).map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  }));

  const faqJsonLd = faqItems.length > 0
    ? JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", inLanguage: "es-ES", mainEntity: faqItems })
    : null;

  const sectionsHtml = p.sections.map((s) => {
    const paras = s.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("\n");
    const bullets = s.bullets && s.bullets.length > 0
      ? `<ul>\n${s.bullets.map((b) => `  <li>${esc(b)}</li>`).join("\n")}\n</ul>`
      : "";
    const table = s.tableHtml ?? "";
    return `<h2>${esc(s.heading)}</h2>\n${paras}\n${bullets}\n${table}`;
  }).join("\n");

  const faqsHtml = (p.faqs ?? []).length > 0
    ? `<h2>Preguntas frecuentes</h2>\n<dl>\n${(p.faqs ?? []).map((f) => `  <dt>${esc(f.q)}</dt>\n  <dd>${esc(f.a)}</dd>`).join("\n")}\n</dl>`
    : "";

  const relatedHtml = (p.relatedLinks ?? []).length > 0
    ? `<h2>Artículos relacionados</h2>\n<ul>\n${(p.relatedLinks ?? []).map((l) => `  <li><a href="${base}${l.to}">${esc(l.label)}</a></li>`).join("\n")}\n</ul>`
    : "";

  return `<script type="application/ld+json">${articleJsonLd}</script>
<script type="application/ld+json">${breadcrumbJsonLd}</script>
${faqJsonLd ? `<script type="application/ld+json">${faqJsonLd}</script>` : ""}
<nav aria-label="Breadcrumb"><a href="${base}/">Inicio</a> / <a href="${base}/blog">Blog</a> / <span>${esc(p.title)}</span></nav>
<p><em>Por ${esc(p.author)} · ${p.publishedAt}</em></p>
<p><strong>${esc(p.intro)}</strong></p>
${sectionsHtml}
${faqsHtml}
${relatedHtml}
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

  const routeAbstractText = `Carpooling de ${r.originCity} a ${r.festivalName} (${r.festivalCity}): ${r.distance} km · ${r.drivingTime} · desde ${r.priceFrom}–${r.priceTo} €/asiento sin comisión de plataforma. Conductores verificados; pago en efectivo o Bizum el día del festival.`;

  const tripJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `Carpooling de ${r.originCity} a ${r.festivalName}`,
    description: `Viaje compartido de ${r.originCity} a ${r.festivalName} (${r.festivalCity}). ${r.distance} km, ${r.drivingTime}, desde ${r.priceFrom} €/asiento. Sin comisión.`,
    abstract: routeAbstractText,
    url: `${base}/rutas/${slug}`,
    touristType: { "@type": "Audience", audienceType: "Aficionados a la música", geographicArea: { "@type": "Country", name: "Spain" } },
    itinerary: [
      { "@type": "Place", name: r.originCity, address: { "@type": "PostalAddress", addressLocality: r.originCity, addressCountry: "ES" } },
      { "@type": "Place", name: r.festivalName, address: { "@type": "PostalAddress", addressLocality: r.festivalCity, addressCountry: "ES" } },
    ],
    provider: { "@type": "Organization", "@id": `${base}/#organization` },
    subjectOf: { "@type": "MusicEvent", "@id": `${base}/festivales/${festivalSlug}#event` },
    offers: {
      "@type": "Offer",
      price: r.priceFrom,
      priceSpecification: {
        "@type": "PriceSpecification",
        price: r.priceFrom,
        maxPrice: r.priceTo,
        priceCurrency: "EUR",
      },
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      validFrom: FESTIVALS[festivalSlug]?.startDate ?? new Date().toISOString().slice(0, 10),
      url: `${base}/rutas/${slug}`,
    },
  });

  const festivalForRoute = FESTIVALS[festivalSlug];
  const routeEventJsonLd = festivalForRoute
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MusicEvent",
        "@id": `${base}/festivales/${festivalSlug}#event`,
        name: festivalForRoute.name,
        startDate: festivalForRoute.startDate,
        endDate: festivalForRoute.endDate,
        image: festivalForRoute.image ?? `${base}/og-fallback.png`,
        description: festivalForRoute.blurb,
        url: `${base}/festivales/${festivalSlug}`,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: festivalForRoute.venue,
          address: {
            "@type": "PostalAddress",
            streetAddress: festivalForRoute.venueAddress,
            addressLocality: festivalForRoute.city,
            addressCountry: "ES",
          },
        },
        inLanguage: "es-ES",
        performer: { "@type": "PerformingGroup", name: festivalForRoute.name },
        organizer: { "@type": "Organization", name: festivalForRoute.name, url: `${base}/festivales/${festivalSlug}` },
        offers: {
          "@type": "Offer",
          price: r.priceFrom,
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          validFrom: festivalForRoute.startDate,
          url: `${base}/festivales/${festivalSlug}`,
          description: `Carpooling a ${festivalForRoute.name} desde ${r.priceFrom} €/asiento. Sin comisión.`,
        },
      })
    : null;

  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Rutas", item: `${base}/rutas` },
      { "@type": "ListItem", position: 3, name: `${r.originCity} → ${r.festivalShortName}`, item: `${base}/rutas/${slug}` },
    ],
  });

  const webPageJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${base}/rutas/${slug}#webpage`,
    url: `${base}/rutas/${slug}`,
    name: `Carpooling ${r.originCity} → ${r.festivalShortName} — desde ${r.priceFrom} € · ${r.drivingTime} | ConcertRide`,
    inLanguage: "es-ES",
    dateModified: "2026-05-03",
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".route-summary", ".speakable", "p:first-of-type"] },
    isPartOf: { "@type": "WebSite", "@id": `${base}/#website`, name: "ConcertRide", url: base },
  });

  return `<script type="application/ld+json">${breadcrumbJsonLd}</script>
<script type="application/ld+json">${webPageJsonLd}</script>
<script type="application/ld+json">${tripJsonLd}</script>
${routeEventJsonLd ? `<script type="application/ld+json">${routeEventJsonLd}</script>` : ""}
<script type="application/ld+json">${faqJsonLd}</script>
<nav aria-label="Breadcrumb"><a href="${base}/">Inicio</a> / <a href="${base}/rutas">Rutas</a> / <span>${esc(r.originCity)} → ${esc(r.festivalShortName)}</span></nav>
<p class="route-summary">Viaje compartido de ${esc(r.originCity)} a ${esc(r.festivalName)} en ${esc(r.festivalCity)}. ${r.distance} km · ${esc(r.drivingTime)} · desde ${r.priceFrom} €/asiento con ConcertRide. Sin comisión — el 100 % del precio va al conductor.</p>
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
<h2>Comparativa de transporte ${esc(r.originCity)} → ${esc(r.festivalShortName)}</h2>
<table>
  <thead>
    <tr><th>Opción</th><th>Precio estimado</th><th>Tiempo</th><th>Comisión</th><th>Vuelta madrugada</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>ConcertRide carpooling</strong></td><td>${r.priceFrom}–${r.priceTo} €/asiento</td><td>${esc(r.drivingTime)}</td><td>0 %</td><td>Sí (coordinada)</td></tr>
    <tr><td>Taxi / VTC (Uber, Cabify)</td><td>35–80 € ida (precio nocturno)</td><td>${esc(r.drivingTime)}</td><td>—</td><td>Sí (precio x2–x3)</td></tr>
    <tr><td>BlaBlaCar</td><td>${r.priceFrom}–${r.priceTo} € + 12–18 %</td><td>${esc(r.drivingTime)}</td><td>12–18 %</td><td>Depende</td></tr>
    <tr><td>Autobús / tren</td><td>3–15 € (si disponible)</td><td>Variable</td><td>—</td><td>No (último ~1:30)</td></tr>
  </tbody>
</table>
<p><em>Precios orientativos. ConcertRide cobra 0 % de comisión — el precio lo fija el conductor para cubrir combustible y peajes.</em></p>
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
  articleModifiedTime?: string;
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
      madrid: {
        title: `Conciertos en Madrid ${year}–${nextYear}: WiZink, IFEMA y carpooling | ConcertRide`,
        description: `Próximos conciertos en Madrid ${year}: WiZink Center, Vistalegre, IFEMA (Mad Cool 9–11 jul), Caja Mágica. Carpooling sin comisión desde toda España. Desde 4 €/asiento, conductores verificados.`,
      },
      barcelona: {
        title: `Conciertos en Barcelona ${year}: Primavera Sound, Sónar, Cruïlla | ConcertRide`,
        description: `Próximos conciertos en Barcelona ${year}: Primavera Sound (Fòrum, 28 may–1 jun), Sónar (Fira Montjuïc, 18–20 jun), Cruïlla (Fòrum, 9–12 jul). Carpooling desde Madrid (14–22 €). Sin comisión.`,
      },
      valencia: {
        title: `Conciertos en Valencia ${year}: Zevra, Medusa, Arenal Sound | ConcertRide`,
        description: `Próximos conciertos en Valencia ${year}: Zevra Festival (La Marina), Arenal Sound (Burriana, 55 km), Medusa (Cullera, 40 km), FIB (Benicàssim, 75 km). Carpooling desde 3 €/asiento. Sin comisión.`,
      },
      malaga: {
        title: `Conciertos en Málaga ${year}: Cala Mijas, Marenostrum y carpooling | ConcertRide`,
        description: `Próximos conciertos en Málaga ${year}: Cala Mijas Fest (Cortijo de Torres, 2–4 oct), Marenostrum (Fuengirola). Carpooling desde Sevilla (6–9 €), Madrid (12–16 €), Granada (5–8 €). Sin comisión.`,
      },
      "a-coruna": {
        title: `Conciertos en A Coruña ${year}: Resurrection Fest y carpooling | ConcertRide`,
        description: `Próximos conciertos en A Coruña ${year}: Coliseum, Palexco. Carpooling a Resurrection Fest en Viveiro (100 km, 10–14 €) y O Son do Camiño en Santiago (85 km, 8–12 €). Sin comisión.`,
      },
      pamplona: {
        title: `Conciertos en Pamplona ${year}: Navarra Arena y carpooling festivales | ConcertRide`,
        description: `Próximos conciertos en Pamplona ${year}: Navarra Arena (12.500), Anaitasuna. Carpooling a BBK Live (155 km, 5–8 €), Azkena Rock (95 km, 4–7 €), Mad Cool Madrid (390 km, 11–16 €). Sin comisión.`,
      },
      "vitoria-gasteiz": {
        title: `Conciertos en Vitoria-Gasteiz ${year}: Azkena Rock y carpooling | ConcertRide`,
        description: `Próximos conciertos en Vitoria-Gasteiz ${year}: Azkena Rock Festival (Mendizabala, jun), Iradier Arena. Carpooling a BBK Live (65 km, 3–6 €), Sonorama (185 km, 7–11 €). Sin comisión.`,
      },
      vigo: {
        title: `Conciertos en Vigo ${year}: carpooling Resurrection Fest y festivales | ConcertRide`,
        description: `Próximos conciertos en Vigo ${year}: Auditorio Mar de Vigo, Pabellón Multiusos. Carpooling a Resurrection Fest (200 km, 12–16 €), O Son do Camiño en Santiago (90 km, 8–12 €). Sin comisión.`,
      },
      murcia: {
        title: `Conciertos en Murcia ${year}: SOS 4.8, Medusa y carpooling | ConcertRide`,
        description: `Próximos conciertos en Murcia ${year}: SOS 4.8, Auditorio Víctor Villegas. Carpooling a Medusa (180 km, 8–12 €), Arenal Sound (250 km, 10–14 €), Viña Rock (155 km, 6–9 €). Sin comisión.`,
      },
      valladolid: {
        title: `Conciertos en Valladolid ${year}: Sonorama y carpooling festivales | ConcertRide`,
        description: `Próximos conciertos en Valladolid ${year}: Plaza de Toros, Pabellón Pisuerga. Carpooling a Sonorama Ribera (100 km, 8–12 €), Mad Cool Madrid (200 km, 8–12 €). Sin comisión.`,
      },
      granada: {
        title: `Conciertos en Granada ${year}: Granada Sound y carpooling | ConcertRide`,
        description: `Próximos conciertos en Granada ${year}: Granada Sound (Cortijo del Conde, septiembre). Carpooling a Cala Mijas (170 km, 6–9 €), Interestelar Sevilla (250 km, 8–12 €). Sin comisión.`,
      },
      "santiago-de-compostela": {
        title: `Conciertos en Santiago de Compostela ${year}: O Son do Camiño | ConcertRide`,
        description: `Próximos conciertos en Santiago ${year}: O Son do Camiño (Monte do Gozo, 18–20 jun, 90.000+). Carpooling desde A Coruña (10–12 €), Vigo (12–15 €), Madrid (20–30 €). Sin comisión.`,
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
      articleModifiedTime: p.updatedAt ?? p.publishedAt,
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
      `<meta property="article:modified_time" content="${esc(page.articleModifiedTime ?? page.articlePublishedTime)}"/>`,
      page.articleAuthor ? `<meta property="article:author" content="${esc(page.articleAuthor)}"/>` : "",
      `<meta property="article:section" content="Carpooling y festivales"/>`,
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

#!/usr/bin/env node
/**
 * SCRIPT 4: generate-sitemaps.mjs  (actualizado 2026-05-05)
 *
 * Genera sitemaps divididos por tipo de contenido Y los copia a public/:
 *   - public/sitemap-festivales.xml   (/festivales/{slug})
 *   - public/sitemap-artistas.xml     (/artistas/{slug})
 *   - public/sitemap-recintos.xml     (/recintos/{slug})
 *   - public/sitemap-ciudades.xml     (/conciertos/{slug})
 *   - public/sitemap-como-llegar.xml  (/como-llegar/{slug})
 *   - public/sitemap-rutas.xml        (/rutas/{slug})
 *   - public/sitemap-blog.xml         (/blog/{slug})
 *   - public/rss.xml                  (RSS 2.0 del blog)
 *   - public/sitemap.xml              (índice maestro)
 *
 * EJECUTAR (desde raíz del repo):
 *   node apps/web/scripts/seo/generate-sitemaps.mjs
 *   -- o --
 *   cd apps/web && node scripts/seo/generate-sitemaps.mjs
 *
 * NOTA: Los datos están hardcodeados (espejo de los archivos .ts)
 * para evitar problemas de imports TS → ESM.
 * Actualizar aquí cuando se añadan festivales, artistas, recintos,
 * ciudades, rutas o posts en los archivos lib/*.ts correspondientes.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "output");
const PUBLIC_DIR = path.join(__dirname, "../../public");
const SITE_URL = "https://concertride.me";
const TODAY = new Date().toISOString().slice(0, 10);
const RFC822_NOW = new Date().toUTCString();

// ── Datos espejados de lib/*.ts ───────────────────────────────────────────────
// Fuente: apps/web/src/lib/festivalLandings.ts  (51 festivales — sincronizado 2026-05-17)

const FESTIVAL_SLUGS = [
  "mad-cool", "primavera-sound", "sonar", "fib", "bbk-live", "resurrection-fest",
  "arenal-sound", "medusa-festival", "vina-rock", "o-son-do-camino", "cala-mijas",
  "sonorama-ribera", "zevra-festival", "low-festival", "tomavistas", "cruilla",
  "vive-latino", "festival-de-les-arts", "festival-ortigueira", "jazzaldia",
  "metropoli-gijon", "granada-sound", "pirineos-sur", "starlite-marbella",
  "stone-music-festival", "marenostrum-fuengirola", "tio-pepe-festival",
  "atlantic-fest", "portamerica", "sos-48", "reggaeton-beach-festival",
  "mallorca-live-festival", "bbk-music-legends", "download-madrid", "azkena-rock-festival",
  "granca-live-fest", "rototom-sunsplash", "dreambeach-festival", "aquasella-festival",
  "dcode-festival", "creamfields-andalucia", "festival-de-musica-de-barakaldo",
  "festival-de-musica-de-irun", "festival-de-musica-de-donostia-hiria",
  "festival-de-musica-de-pontevedra", "festival-de-musica-de-vigo",
  "festival-de-musica-de-ferrol", "festival-de-musica-de-monforte",
  "festival-de-musica-de-lalin", "festival-de-musica-de-tui", "festival-de-musica-de-betanzos",
];

// Festivales con imagen OG generada (los 16 originales)
const FESTIVAL_OG_IMAGES = new Set([
  "mad-cool", "primavera-sound", "sonar", "fib", "bbk-live", "resurrection-fest",
  "arenal-sound", "medusa-festival", "vina-rock", "o-son-do-camino", "cala-mijas",
  "sonorama-ribera", "zevra-festival", "low-festival", "tomavistas", "cruilla",
]);

// Fuente: apps/web/src/lib/artistLandings.ts  (67 artistas — sincronizado 2026-05-17)
const ARTIST_SLUGS = [
  "coldplay", "taylor-swift", "rosalia", "bad-bunny", "metallica",
  "guns-n-roses", "karol-g", "doja-cat", "olivia-rodrigo", "the-weeknd",
  "harry-styles", "bruce-springsteen", "beyonce", "billie-eilish", "post-malone",
  "drake", "ed-sheeran", "maluma", "aitana", "dani-martin",
  "melendi", "pablo-alboran", "hombres-g", "bryan-adams", "lana-del-rey",
  "c-tangana", "joaquin-sabina", "rozalen", "vetusta-morla", "estopa",
  "quevedo", "bizarrap", "camilo", "manuel-carrasco", "pablo-lopez",
  "love-of-lesbian", "carolina-durante", "lola-indigo", "saiko", "anuel-aa",
  "j-balvin", "sebastian-yatra", "manuel-turizo", "antonio-orozco", "alejandro-sanz",
  "david-bisbal", "marwan", "ivan-ferreiro", "la-casa-azul", "sidonie",
  "daddy-yankee", "ac-dc", "travis-scott", "shakira", "bad-gyal",
  "dua-lipa", "sabrina-carpenter", "morat", "nicki-nicole", "imagine-dragons",
  "iron-maiden", "india-martinez", "raphael", "pignoise", "amaia",
  "nathy-peluso", "rels-b",
];

// Fuente: apps/web/src/lib/venueLandings.ts  (40 recintos — sincronizado 2026-05-17)
const VENUE_SLUGS = [
  "wizink-center", "palacio-vistalegre", "ifema-madrid", "caja-magica",
  "palau-sant-jordi", "parc-del-forum", "estadio-la-cartuja", "kobetamendi",
  "fira-barcelona", "palau-blaugrana", "estadio-santiago-bernabeu", "estadio-civitas-metropolitano",
  "estadi-olimpic-lluis-companys", "roig-arena", "fibes-sevilla", "bilbao-arena",
  "pabellon-principe-felipe-zaragoza", "espacio-expo-zaragoza", "parc-del-forum-barcelona", "movistar-arena",
  "bizkaia-arena-bec", "estadio-mestalla-valencia", "estadio-la-romareda", "estadio-gran-canaria",
  "estadio-la-rosaleda", "rcde-stadium", "la-riviera", "sala-apolo",
  "razzmatazz", "sant-jordi-club", "sala-bikini", "plaza-toros-las-ventas",
  "auditorio-rocio-jurado", "sala-but", "plaza-toros-valencia", "estadio-san-mames",
  "coliseum-a-coruna", "auditorio-castrelos", "marenostrum-fuengirola", "plaza-toros-zaragoza",
];

// Fuente: apps/web/src/lib/cityLandings.ts  (44 ciudades)
const CITY_SLUGS = [
  "madrid", "barcelona", "valencia", "sevilla", "bilbao", "malaga", "zaragoza",
  "granada", "donostia", "santiago-de-compostela", "alicante", "pamplona",
  "vitoria-gasteiz", "a-coruna", "vigo", "murcia", "valladolid", "toledo",
  "burgos", "logrono", "santander", "oviedo", "gijon", "leon", "salamanca",
  "albacete", "castellon", "cordoba", "huelva", "almeria", "cadiz", "jaen",
  "lleida", "tarragona", "girona", "lugo", "pontevedra", "badajoz", "caceres",
  "palma", "cuenca", "guadalajara", "segovia", "avila",
];

// Fuente: apps/web/src/lib/festivalLandings.ts (mismo set que festivales)
const COMO_LLEGAR_SLUGS = [
  "mad-cool", "primavera-sound", "sonar", "fib", "bbk-live", "resurrection-fest",
  "arenal-sound", "medusa-festival", "vina-rock", "o-son-do-camino", "cala-mijas",
  "sonorama-ribera", "zevra-festival", "low-festival", "tomavistas", "cruilla",
];

// Rutas completas: todas las combinaciones ciudad × festival (espejo de sitemap-routes.xml antiguo)
// 44 ciudades × 16 festivales = 704 combinaciones (+ variantes especiales = 741 total)

/**
 * Quality threshold for route overrides (mirrors ROUTE_SEO_IMPROVEMENTS in seoOverrides.ts).
 * Routes listed here must meet content quality minimums to be included in sitemap-routes.xml.
 * Rules (GSC "Scaled Content Abuse" prevention, Core Update marzo 2026):
 *   - title   < 30 chars → EXCLUDED (title is too generic/empty for Google to differentiate)
 *   - description < 80 chars → EXCLUDED (thin description = thin content signal)
 *   - Routes WITHOUT an explicit override always pass (they use rich auto-generated content
 *     from RouteLandingPage which always includes km/time/price data).
 */
const ROUTE_OVERRIDES = {
  // ── Viña Rock ──────────────────────────────────────────────────────────────
  "madrid-vina-rock":    { title: "Carpooling Madrid → Viña Rock: 6€, 3h",                   description: "Carpooling Madrid → Viña Rock: 260 km, 3h por A-31, desde 6€/asiento sin comisión. Ruta directa Madrid–Villarrobledo, vuelta de madrugada coordinada." },
  "valencia-vina-rock":  { title: "Carpooling Valencia → Viña Rock: 6€, 2h45",                description: "Carpooling Valencia → Viña Rock: 255 km, 2h 45 min por A-3+A-31, desde 6€/asiento sin comisión. Lanzadera al recinto La Pulgosa, vuelta coordinada." },
  "alicante-vina-rock":  { title: "Cómo ir a Viña Rock desde Alicante: 2h, 195km, 5€",        description: "Cómo ir a Viña Rock desde Alicante: 195 km, 2h por A-31, carpooling desde 5€/asiento sin comisión. Salidas coordinadas + vuelta de madrugada al centro." },
  "albacete-vina-rock":  { title: "Cómo ir a Viña Rock desde Albacete: 30min, 40km, 3€",      description: "Cómo ir a Viña Rock desde Albacete: 40 km, 30 min por A-31, carpooling desde 3€/asiento. Alternativa a bus regional y lanzadera nocturna, sin comisión." },
  "sevilla-vina-rock":   { title: "Carpooling Sevilla → Viña Rock: 9€, 410 km",               description: null },  // no description → EXCLUIDA del sitemap
  // ── Arenal Sound ──────────────────────────────────────────────────────────
  "madrid-arenal-sound":   { title: "Carpooling Madrid → Arenal Sound: 12€, 460km",           description: "Carpooling Madrid → Arenal Sound: 460 km, 4h 30 min por A-3, desde 12€/asiento sin comisión. Más barato que bus (35€+) y AVE (60€+)." },
  "valencia-arenal-sound": { title: "Cómo ir a Arenal Sound desde Valencia: 50min, 65km, 3€", description: "Cómo ir a Arenal Sound desde Valencia: 65 km, 50 min por AP-7, carpooling desde 3€/asiento sin comisión. Lanzadera a la playa de Burriana, vuelta coordinada." },
  "barcelona-arenal-sound":{ title: "Carpooling Barcelona → Arenal Sound: 8€, 3h",            description: "Carpooling Barcelona → Arenal Sound: 305 km, 3h por AP-7, desde 8€/asiento sin comisión. Ruta costera directa Barcelona–Burriana, vuelta de madrugada coordinada." },
  "zaragoza-arenal-sound": { title: "Carpooling Zaragoza → Arenal Sound: 8€, 275 km",         description: null },  // no description → EXCLUIDA del sitemap
  "alicante-arenal-sound": { title: "Carpooling Alicante → Arenal Sound: 4€, 115 km",         description: null },  // no description → EXCLUIDA del sitemap
  // ── BBK Live ──────────────────────────────────────────────────────────────
  "madrid-bbk-live":        { title: "Carpooling Madrid → BBK Live Bilbao: desde 11€, 4h",    description: "Carpooling Madrid → BBK Live: 395 km, 4h por A-1+AP-68, desde 11€/asiento sin comisión. Más económico que AVE (60€+) y bus (30€+) a Kobetamendi." },
  "bilbao-bbk-live":        { title: "Cómo ir a BBK Live desde Bilbao: 15min, 5km, desde 3€", description: "Cómo ir a BBK Live desde Bilbao: 5 km al monte Kobetamendi, 15 min en coche, carpooling desde 3€/asiento. Lanzadera oficial desde Moyúa + bus BizkaiBus." },
  "barcelona-bbk-live":     { title: "Carpooling Barcelona → BBK Live: 12€, 5h, 510km",       description: "Carpooling Barcelona → BBK Live: 510 km, 5h por AP-2+AP-68, desde 12€/asiento sin comisión. Mucho más barato que AVE (80€+) y bus nocturno a Kobetamendi." },
  "donostia-bbk-live":      { title: "Cómo ir a BBK Live desde Donostia: 1h10, 100km, 4€",    description: "Cómo ir a BBK Live desde Donostia: 100 km, 1h 10 min por A-8, carpooling desde 4€/asiento sin comisión. Más rápido que tren EuskoTren (1h 40 min) y bus." },
  "santander-bbk-live":     { title: "Cómo ir a BBK Live desde Santander: 1h10, 100km, 4€",   description: "Cómo ir a BBK Live desde Santander: 100 km, 1h 10 min por A-8, carpooling desde 4€/asiento sin comisión. Vuelta de madrugada coordinada a Cantabria." },
  "vitoria-gasteiz-bbk-live":{ title: "Carpooling Vitoria → BBK Live Bilbao: 3€, 65 km",      description: null },  // no description → EXCLUIDA del sitemap
};

/**
 * Returns true if the route should be included in sitemap-routes.xml.
 * Logic:
 *   1. Routes WITHOUT an explicit override → always included (rich auto-generated content).
 *   2. Routes WITH override → title must be ≥ 30 chars AND description must be ≥ 80 chars.
 *      If description is null/missing → excluded (thin content risk).
 */
function routePassesQualityThreshold(slug) {
  const override = ROUTE_OVERRIDES[slug];
  if (!override) return true;  // no override = rich auto-generated content, always pass
  if (!override.description || override.description.length < 80) return false;
  if (!override.title || override.title.length < 30) return false;
  return true;
}

const ROUTE_SLUGS = (() => {
  const cities = [
    "madrid", "barcelona", "valencia", "sevilla", "bilbao", "malaga", "zaragoza",
    "granada", "donostia", "santiago-de-compostela", "alicante", "pamplona",
    "vitoria-gasteiz", "a-coruna", "vigo", "murcia", "valladolid", "toledo",
    "burgos", "logrono", "santander", "oviedo", "gijon", "leon", "salamanca",
    "albacete", "castellon", "cordoba", "huelva", "almeria", "cadiz", "jaen",
    "lleida", "tarragona", "girona", "lugo", "pontevedra", "badajoz", "caceres",
    "palma", "cuenca", "guadalajara", "segovia", "avila",
  ];
  const festivals = [
    "mad-cool", "primavera-sound", "sonar", "fib", "bbk-live", "resurrection-fest",
    "arenal-sound", "medusa-festival", "vina-rock", "o-son-do-camino", "cala-mijas",
    "sonorama-ribera", "zevra-festival", "low-festival", "tomavistas", "cruilla",
  ];
  // Generar todas las combinaciones (excluir ciudad == sede del festival para evitar thin content)
  const festivalSeats = {
    "mad-cool": "madrid", "primavera-sound": "barcelona", "sonar": "barcelona",
    "fib": "castellon", "bbk-live": "bilbao", "resurrection-fest": "lugo",
    "arenal-sound": "castellon", "medusa-festival": "valencia", "vina-rock": "albacete",
    "o-son-do-camino": "santiago-de-compostela", "cala-mijas": "malaga",
    "sonorama-ribera": "burgos", "zevra-festival": "valencia", "low-festival": "alicante",
    "tomavistas": "madrid", "cruilla": "barcelona",
  };
  const slugs = [];
  for (const city of cities) {
    for (const festival of festivals) {
      if (city !== festivalSeats[festival] && routePassesQualityThreshold(`${city}-${festival}`)) {
        slugs.push(`${city}-${festival}`);
      }
    }
  }
  return slugs;
})();

// Fuente: apps/web/src/lib/blogPosts.ts  (última actualización mayo-17)
const BLOG_POSTS = [
  { slug: "alternativa-carpooling-festivales-espana",      title: "Mejores plataformas de carpooling para festivales en España [2026]",  publishedAt: "2026-05-17" },
  { slug: "autobuses-festivales-espana-2026",              title: "Autobuses a festivales de España 2026: guía completa",                  publishedAt: "2026-04-20" },
  { slug: "como-volver-festival-madrugada",                title: "Cómo volver de un festival de madrugada",                              publishedAt: "2026-04-18" },
  { slug: "huella-carbono-festivales-carpooling",          title: "Huella de carbono en festivales: carpooling como solución",            publishedAt: "2026-04-15" },
  { slug: "que-llevar-al-festival",                        title: "Qué llevar al festival: la lista definitiva",                         publishedAt: "2026-04-05" },
  { slug: "coldplay-madrid-barcelona-2026-como-llegar",    title: "Coldplay Madrid y Barcelona 2026: cómo llegar",                       publishedAt: "2026-04-01" },
  { slug: "festivales-verano-espana-2026-transporte",      title: "Festivales de verano en España 2026: guía de transporte",             publishedAt: "2026-03-28" },
  { slug: "festivales-cataluna-2026",                      title: "Festivales de Cataluña 2026: agenda y transporte",                    publishedAt: "2026-03-25" },
  { slug: "festivales-comunidad-valenciana-2026",          title: "Festivales de la Comunitat Valenciana 2026",                          publishedAt: "2026-03-22" },
  { slug: "festivales-pais-vasco-2026",                    title: "Festivales del País Vasco 2026",                                      publishedAt: "2026-03-20" },
  { slug: "carpooling-vs-taxi-festival-espana",            title: "Carpooling vs taxi para ir a festivales en España",                   publishedAt: "2026-03-18" },
  { slug: "festivales-musica-espana-2026",                 title: "Festivales de música en España 2026: la guía definitiva",             publishedAt: "2026-03-15" },
  { slug: "guia-transporte-vina-rock-2026",                title: "Guía de transporte para Viña Rock 2026",                             publishedAt: "2026-03-12" },
  { slug: "como-llegar-resurrection-fest-2026",            title: "Cómo llegar al Resurrection Fest 2026",                              publishedAt: "2026-03-10" },
  { slug: "volver-de-madrugada-despues-de-un-festival",   title: "Cómo volver de madrugada después de un festival",                    publishedAt: "2026-03-08" },
  { slug: "carpooling-vs-ave-costes-reales-2026",          title: "Carpooling vs AVE: costes reales para ir a festivales 2026",         publishedAt: "2026-03-05" },
  { slug: "top-rutas-madrid-festivales-2026",              title: "Top rutas en coche desde Madrid a festivales 2026",                  publishedAt: "2026-03-02" },
  { slug: "que-llevar-al-festival-guia-camping-2026",      title: "Qué llevar al festival: guía de camping 2026",                       publishedAt: "2026-02-28" },
  { slug: "calcula-precio-por-asiento-2026",               title: "Cómo calcular el precio por asiento en carpooling 2026",             publishedAt: "2026-02-25" },
  { slug: "puntos-recogida-festivales-mas-eficientes",     title: "Puntos de recogida en festivales: los más eficientes",               publishedAt: "2026-02-22" },
  { slug: "viajar-con-equipaje-de-camping-consejos",       title: "Viajar con equipaje de camping: consejos prácticos",                 publishedAt: "2026-02-20" },
  { slug: "como-elegir-asiento-seguro-carpooling",         title: "Cómo elegir un asiento seguro en carpooling",                        publishedAt: "2026-02-18" },
  { slug: "mejores-fechas-para-publicar-viaje-festival",   title: "Las mejores fechas para publicar tu viaje a un festival",            publishedAt: "2026-02-15" },
  { slug: "como-gestionar-cancelaciones-de-conductores",   title: "Cómo gestionar cancelaciones de conductores en ConcertRide",         publishedAt: "2026-02-12" },
  { slug: "combo-transporte-y-alojamiento-festival",       title: "Combo transporte y alojamiento para festivales",                     publishedAt: "2026-02-10" },
  { slug: "como-organizar-viaje-grupal-festival",          title: "Cómo organizar un viaje grupal a un festival",                       publishedAt: "2026-02-08" },
  { slug: "viajar-sostenible-a-festivales-2026",           title: "Viajar de forma sostenible a festivales 2026",                       publishedAt: "2026-02-05" },
  { slug: "seguro-en-carsharing-concertride",              title: "¿Es seguro el carsharing en ConcertRide?",                          publishedAt: "2026-02-02" },
  { slug: "como-elegir-punto-de-vuelta-festival",          title: "Cómo elegir el punto de vuelta ideal en un festival",                publishedAt: "2026-01-30" },
  { slug: "pagos-y-propinas-en-carsharing-recomendaciones",title: "Pagos y propinas en carsharing: recomendaciones",                   publishedAt: "2026-01-28" },
  { slug: "gps-y-navegacion-en-rutas-de-festival",         title: "GPS y navegación en rutas de festival: consejos",                   publishedAt: "2026-01-25" },
  { slug: "accesibilidad-en-viajes-festivales",            title: "Accesibilidad en viajes a festivales",                              publishedAt: "2026-01-22" },
  { slug: "checklist-ultimo-dia-festival-vuelta",          title: "Checklist para el último día del festival y la vuelta",             publishedAt: "2026-01-20" },
  { slug: "faq-para-nuevos-usuarios-concertride",          title: "FAQ para nuevos usuarios de ConcertRide",                           publishedAt: "2026-01-18" },
  { slug: "carpooling-mad-cool-desde-madrid-2026",         title: "Carpooling a Mad Cool desde Madrid 2026",                           publishedAt: "2026-01-15" },
  { slug: "carpooling-primavera-sound-desde-zaragoza-2026",title: "Carpooling a Primavera Sound desde Zaragoza 2026",                  publishedAt: "2026-01-12" },
  { slug: "carpooling-bbk-live-desde-pamplona-2026",       title: "Carpooling a BBK Live desde Pamplona 2026",                         publishedAt: "2026-01-10" },
  { slug: "carpooling-arenal-sound-desde-valencia-2026",   title: "Carpooling a Arenal Sound desde Valencia 2026",                     publishedAt: "2026-01-08" },
  { slug: "carpooling-sonorama-desde-valladolid-2026",     title: "Carpooling a Sonorama desde Valladolid 2026",                       publishedAt: "2026-01-05" },
  { slug: "carpooling-resurrection-fest-desde-vigo-2026",  title: "Carpooling al Resurrection Fest desde Vigo 2026",                  publishedAt: "2026-01-02" },
  { slug: "carpooling-cala-mijas-desde-sevilla-2026",      title: "Carpooling a Cala Mijas desde Sevilla 2026",                        publishedAt: "2025-12-30" },
  { slug: "carpooling-o-son-do-camino-desde-a-coruna-2026",title: "Carpooling a O Son do Camiño desde A Coruña 2026",                 publishedAt: "2025-12-28" },
  { slug: "carpooling-viña-rock-desde-alicante-2026",      title: "Carpooling a Viña Rock desde Alicante 2026",                        publishedAt: "2025-12-25" },
  { slug: "carpooling-medusa-desde-murcia-2026",           title: "Carpooling a Medusa Festival desde Murcia 2026",                    publishedAt: "2025-12-22" },
  { slug: "carpooling-resurrection-fest-2026",             title: "Carpooling al Resurrection Fest 2026: guía completa",               publishedAt: "2025-12-20" },
  { slug: "transporte-bbk-live-bilbao-2026",               title: "Transporte a BBK Live Bilbao 2026",                                 publishedAt: "2025-12-18" },
  { slug: "primavera-sound-2026-como-llegar",              title: "Primavera Sound 2026: cómo llegar",                                 publishedAt: "2025-12-15" },
  { slug: "arenal-sound-2026-transporte",                  title: "Arenal Sound 2026: guía de transporte",                            publishedAt: "2025-12-12" },
  { slug: "sonar-barcelona-2026-carpooling",               title: "Sónar Barcelona 2026: opciones de carpooling",                     publishedAt: "2025-12-10" },
  { slug: "guia-transporte-conciertos-madrid-2026",        title: "Guía de transporte a conciertos en Madrid 2026",                   publishedAt: "2025-12-08" },
  { slug: "guia-transporte-conciertos-barcelona-2026",     title: "Guía de transporte a conciertos en Barcelona 2026",                publishedAt: "2025-12-05" },
  { slug: "guia-transporte-conciertos-bilbao-2026",        title: "Guía de transporte a conciertos en Bilbao 2026",                   publishedAt: "2025-12-02" },
  { slug: "guia-transporte-conciertos-sevilla-2026",       title: "Guía de transporte a conciertos en Sevilla 2026",                  publishedAt: "2025-11-30" },
  { slug: "guia-transporte-conciertos-valencia-2026",      title: "Guía de transporte a conciertos en Valencia 2026",                 publishedAt: "2025-11-28" },
  { slug: "mad-cool-2026-guia-completa",                   title: "Mad Cool 2026: guía completa de transporte",                       publishedAt: "2025-11-25" },
  { slug: "medusa-festival-2026-guia-transporte",          title: "Medusa Festival 2026: guía de transporte",                         publishedAt: "2025-11-22" },
  { slug: "vina-rock-2026-guia-completa",                  title: "Viña Rock 2026: guía completa",                                    publishedAt: "2025-11-20" },
  { slug: "fib-benicassim-2026-guia-transporte",           title: "FIB Benicàssim 2026: guía de transporte",                         publishedAt: "2025-11-18" },
  { slug: "sonorama-ribera-2026-guia-transporte",          title: "Sonorama Ribera 2026: guía de transporte",                        publishedAt: "2025-11-15" },
  { slug: "son-do-camino-2026-guia-transporte",            title: "O Son do Camiño 2026: guía de transporte",                        publishedAt: "2025-11-12" },
  { slug: "cala-mijas-2026-guia-transporte",               title: "Cala Mijas 2026: guía de transporte",                             publishedAt: "2025-11-10" },
  { slug: "low-festival-benidorm-2026-transporte",         title: "Low Festival Benidorm 2026: transporte y carpooling",              publishedAt: "2025-11-08" },
  { slug: "tomavistas-madrid-2026-transporte",             title: "Tomavistas Madrid 2026: cómo llegar",                             publishedAt: "2025-11-05" },
  { slug: "viaje-en-grupo-festival-guia-organizacion",     title: "Viaje en grupo a un festival: guía de organización",              publishedAt: "2025-11-02" },
  { slug: "festivales-gratuitos-espana-2026",              title: "Festivales gratuitos en España 2026",                             publishedAt: "2025-10-30" },
  { slug: "conciertos-en-estadios-espana-2026-transporte", title: "Conciertos en estadios en España 2026: transporte",               publishedAt: "2025-10-28" },
  // Posts añadidos en mayo 2026
  { slug: "carpooling-medusa-festival-2026",                           title: "Carpooling a Medusa Festival 2026: guía completa",                       publishedAt: "2026-05-01" },
  { slug: "carpooling-sonorama-ribera-2026",                           title: "Carpooling a Sonorama Ribera 2026",                                      publishedAt: "2026-05-01" },
  { slug: "carpooling-tomavistas-2026",                                title: "Carpooling a Tomavistas Madrid 2026",                                    publishedAt: "2026-05-02" },
  { slug: "carpooling-cruilla-2026",                                   title: "Carpooling a Cruïlla Barcelona 2026",                                    publishedAt: "2026-05-02" },
  { slug: "carpooling-fib-benicassim-2026",                            title: "Carpooling al FIB Benicàssim 2026",                                     publishedAt: "2026-05-03" },
  { slug: "carpooling-vs-tren-ave-festivales-espana-2026",             title: "Carpooling vs AVE vs tren: qué es más barato para ir a festivales",     publishedAt: "2026-05-06" },
  { slug: "como-volver-concierto-madrugada-espana-2026",               title: "Cómo volver de un concierto o festival de madrugada en España 2026",    publishedAt: "2026-05-06" },
  { slug: "guia-carpooling-festivales-comunidades-autonomas-2026",     title: "Guía de carpooling a festivales por comunidad autónoma en España 2026", publishedAt: "2026-05-06" },
  { slug: "alternativa-blablacar-festivales-espana",                  title: "Alternativa a BlaBlaCar para ir a festivales en España 2026",            publishedAt: "2026-05-06" },
  { slug: "es-seguro-carpooling-festivales",                          title: "¿Es seguro el coche compartido para ir a festivales? Guía 2026",          publishedAt: "2026-05-06" },
  { slug: "transporte-nocturno-vuelta-festival",                      title: "Transporte de vuelta de un festival de madrugada: todas las opciones 2026", publishedAt: "2026-05-06" },
  { slug: "carpooling-gratuito-festivales-sin-comision",              title: "Carpooling sin comisión para festivales en España: cómo funciona 2026",   publishedAt: "2026-05-06" },
  { slug: "taylor-swift-eras-tour-espana-carpooling",                 title: "Taylor Swift Eras Tour España: cómo llegar en carpooling",               publishedAt: "2026-05-06" },
  { slug: "preguntas-frecuentes-carpooling-festivales-espana",        title: "FAQ carpooling festivales España: 25 preguntas y respuestas reales 2026", publishedAt: "2026-05-06" },
  // Semanas 1-2 del calendario editorial mayo–julio 2026
  { slug: "carpooling-mad-cool-desde-barcelona-2026",                title: "Carpooling a Mad Cool desde Barcelona 2026: guía completa de viaje compartido", publishedAt: "2026-05-07" },
  { slug: "coldplay-madrid-2026-carpooling",                         title: "Coldplay Madrid 2026: cómo ir en carpooling al Estadio Santiago Bernabéu",      publishedAt: "2026-05-08" },
  { slug: "como-ir-sonorama-ribera-desde-madrid-2026",               title: "Cómo ir a Sonorama Ribera desde Madrid 2026: carpooling, autobús y tren",        publishedAt: "2026-05-13" },
  { slug: "bbk-live-2026-transporte-desde-donostia-pamplona-vitoria",title: "BBK Live 2026: transporte desde Donostia, Pamplona y Vitoria",                  publishedAt: "2026-05-14" },
  { slug: "que-llevar-a-un-festival-de-musica",                      title: "Qué llevar a un festival de música: lista definitiva 2026",                     publishedAt: "2026-05-07" },
  { slug: "festivales-espana-verano-2026",                            title: "Festivales en España verano 2026: agenda completa y transporte",                 publishedAt: "2026-05-07" },
  { slug: "carpooling-madrid-festivales",                             title: "Carpooling desde Madrid a festivales: guía completa 2026",                      publishedAt: "2026-05-07" },
];

// Prioridades por tipo de contenido
// changefreq diferenciado: static=yearly, blog=weekly, rutas=daily, festivales=monthly
const SEO_CONFIG = {
  festivales:   { priority: "0.85", changefreq: "monthly" },
  artistas:     { priority: "0.70", changefreq: "monthly" },
  recintos:     { priority: "0.70", changefreq: "monthly" },
  ciudades:     { priority: "0.75", changefreq: "weekly"  },
  "como-llegar":{ priority: "0.85", changefreq: "monthly" },
  guias:        { priority: "0.80", changefreq: "monthly" },
  rutas:        { priority: "0.72", changefreq: "daily"   },
  blog:         { priority: "0.75", changefreq: "weekly"  },
};

// Blog posts con prioridad alta por importancia temática
const BLOG_PRIORITY_OVERRIDES = {
  "autobuses-festivales-espana-2026":     "0.85",
  "guia-transporte-vina-rock-2026":       "0.85",
  "como-llegar-resurrection-fest-2026":   "0.85",
  "festivales-musica-espana-2026":        "0.82",
  "blablacar-vs-concertride":             "0.80",
  "carpooling-vs-taxi-festival-espana":   "0.80",
};

// ── Helpers XML ───────────────────────────────────────────────────────────────

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function urlEntry({ loc, lastmod = TODAY, changefreq, priority, imageUrl, imageTitle }) {
  const image = imageUrl ? `
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(imageTitle ?? "")}</image:title>
    </image:image>` : "";
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${image}
  </url>`;
}

function sitemapWrapper(type, urls) {
  const count = (urls.match(/<url>/g) || []).length;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- Sitemap generado por generate-sitemaps.mjs -->
  <!-- Tipo: ${type} | Actualizado: ${TODAY} | ${count} URLs -->
${urls}
</urlset>`;
}

function sitemapIndex(sitemaps) {
  const entries = sitemaps.map(s => `
  <sitemap>
    <loc>${SITE_URL}/${s.file}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Índice maestro de sitemaps — generado por generate-sitemaps.mjs -->
  <!-- Actualizado: ${TODAY} -->
${entries}
</sitemapindex>`;
}

// ── Constructores de cada sitemap ─────────────────────────────────────────────

function buildFestivalesSitemap() {
  const { priority, changefreq } = SEO_CONFIG.festivales;
  const urls = FESTIVAL_SLUGS.map(slug => {
    const hasOg = FESTIVAL_OG_IMAGES.has(slug);
    return urlEntry({
      loc: `${SITE_URL}/festivales/${slug}`,
      changefreq,
      priority,
      imageUrl:  hasOg ? `${SITE_URL}/og/${slug}.png` : undefined,
      imageTitle: hasOg ? `Carpooling a ${slug.replace(/-/g, " ")} — ConcertRide` : undefined,
    });
  }).join("");
  return sitemapWrapper("festivales", urls);
}

function buildArtistasSitemap() {
  const { priority, changefreq } = SEO_CONFIG.artistas;
  const urls = ARTIST_SLUGS.map(slug => urlEntry({
    loc: `${SITE_URL}/artistas/${slug}`,
    changefreq,
    priority,
  })).join("");
  return sitemapWrapper("artistas", urls);
}

function buildRecintosSitemap() {
  const { priority, changefreq } = SEO_CONFIG.recintos;
  const urls = VENUE_SLUGS.map(slug => urlEntry({
    loc: `${SITE_URL}/recintos/${slug}`,
    changefreq,
    priority,
  })).join("");
  return sitemapWrapper("recintos", urls);
}

function buildCiudadesSitemap() {
  const { priority, changefreq } = SEO_CONFIG.ciudades;
  // Páginas base /conciertos/:city (44 URLs)
  const baseUrls = CITY_SLUGS.map(slug => urlEntry({
    loc: `${SITE_URL}/conciertos/${slug}`,
    changefreq,
    priority,
  }));
  // Páginas con año /conciertos/:city/:year (44 × 3 = 132 URLs) — espejando sistema antiguo
  const yearUrls = [];
  for (const slug of CITY_SLUGS) {
    for (const year of ["2025", "2026", "2027"]) {
      yearUrls.push(urlEntry({
        loc: `${SITE_URL}/conciertos/${slug}/${year}`,
        changefreq: "weekly",
        priority: year === "2026" ? "0.72" : "0.60",
      }));
    }
  }
  return sitemapWrapper("ciudades (conciertos + años)", [...baseUrls, ...yearUrls].join(""));
}

function buildComoLlegarSitemap() {
  const { priority, changefreq } = SEO_CONFIG["como-llegar"];
  const urls = COMO_LLEGAR_SLUGS.map(slug => urlEntry({
    loc: `${SITE_URL}/como-llegar/${slug}`,
    changefreq,
    priority,
  })).join("");
  return sitemapWrapper("como-llegar", urls);
}

function buildGuiasSitemap() {
  const { priority, changefreq } = SEO_CONFIG.guias;
  const urls = FESTIVAL_SLUGS.map(slug => urlEntry({
    loc: `${SITE_URL}/festivales/${slug}/guia`,
    changefreq,
    priority,
  })).join("");
  return sitemapWrapper("guias-festival", urls);
}

function buildRutasSitemap() {
  const { priority, changefreq } = SEO_CONFIG.rutas;
  const urls = ROUTE_SLUGS.map(slug => urlEntry({
    loc: `${SITE_URL}/rutas/${slug}`,
    changefreq,
    priority,
  })).join("");
  return sitemapWrapper("rutas", urls);
}

function buildBlogSitemap() {
  const { priority, changefreq } = SEO_CONFIG.blog;
  const urls = BLOG_POSTS.map(({ slug, publishedAt }) => urlEntry({
    loc: `${SITE_URL}/blog/${slug}`,
    lastmod: publishedAt,
    changefreq,
    priority: BLOG_PRIORITY_OVERRIDES[slug] ?? priority,
  })).join("");
  return sitemapWrapper("blog", urls);
}

// ── RSS 2.0 ───────────────────────────────────────────────────────────────────

function buildRss() {
  const items = BLOG_POSTS.map(({ slug, title, publishedAt }) => {
    const pubDate = new Date(publishedAt).toUTCString();
    return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${SITE_URL}/blog/${slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${slug}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ConcertRide Blog — Carpooling para conciertos en España</title>
    <link>${SITE_URL}/blog</link>
    <description>Guías, consejos y noticias sobre carpooling para festivales y conciertos en España</description>
    <language>es</language>
    <lastBuildDate>${RFC822_NOW}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/android-chrome-192x192.png</url>
      <title>ConcertRide Blog</title>
      <link>${SITE_URL}/blog</link>
    </image>${items}
  </channel>
</rss>`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(PUBLIC_DIR, { recursive: true });

  // NOTE: File names MUST match what prerender.mjs generates so public/ and dist/ stay in sync.
  // prerender.mjs uses English names; this script mirrors them to avoid orphan files in dist/.
  const sitemaps = [
    { file: "sitemap-festivals.xml",        content: buildFestivalesSitemap(),  count: FESTIVAL_SLUGS.length },
    { file: "sitemap-artistas.xml",         content: buildArtistasSitemap(),    count: ARTIST_SLUGS.length   },
    { file: "sitemap-recintos.xml",         content: buildRecintosSitemap(),    count: VENUE_SLUGS.length    },
    { file: "sitemap-cities.xml",           content: buildCiudadesSitemap(),    count: CITY_SLUGS.length     },
    { file: "sitemap-how-to-get-there.xml", content: buildComoLlegarSitemap(),  count: COMO_LLEGAR_SLUGS.length },
    { file: "sitemap-routes.xml",           content: buildRutasSitemap(),       count: ROUTE_SLUGS.length    },
    { file: "sitemap-blog.xml",             content: buildBlogSitemap(),        count: BLOG_POSTS.length     },
  ];

  // El sitemap.xml maestro apunta a todos los sitemaps + el estático + concerts dinámico
  // NOTE: Must match the index generated by prerender.mjs (same files, same order).
  const masterIndex = sitemapIndex([
    { file: "sitemap-static.xml" },
    ...sitemaps.map(s => ({ file: s.file })),
    { file: "sitemap-regiones.xml" },   // generated by prerender.mjs (not by this script — no data here yet)
    { file: "sitemap-generos.xml" },    // generated by prerender.mjs
    { file: "sitemap-calendario.xml" }, // generated by prerender.mjs
    { file: "sitemap-static-others.xml" }, // generated by prerender.mjs
    { file: "api/sitemap-concerts.xml" }, // dinámico del Worker
  ]);

  // Escribir en output/ (para auditoría/git tracking)
  for (const s of sitemaps) {
    await fs.writeFile(path.join(OUTPUT_DIR, s.file), s.content, "utf8");
  }
  await fs.writeFile(path.join(OUTPUT_DIR, "sitemap-index.xml"), masterIndex, "utf8");

  // Escribir en public/ (archivos reales servidos por Cloudflare)
  for (const s of sitemaps) {
    await fs.writeFile(path.join(PUBLIC_DIR, s.file), s.content, "utf8");
  }
  await fs.writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), masterIndex, "utf8");

  // RSS feed
  const rssContent = buildRss();
  await fs.writeFile(path.join(OUTPUT_DIR, "rss.xml"), rssContent, "utf8");
  await fs.writeFile(path.join(PUBLIC_DIR, "rss.xml"), rssContent, "utf8");

  // Estadísticas
  const totalProgrammatic = sitemaps.reduce((acc, s) => acc + s.count, 0);
  const stats = {
    generated: TODAY,
    totalProgrammaticUrls: totalProgrammatic,
    breakdown: Object.fromEntries(sitemaps.map(s => [s.file, s.count])),
  };
  await fs.writeFile(path.join(OUTPUT_DIR, "sitemap-stats.json"), JSON.stringify(stats, null, 2), "utf8");

  // Resumen
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║  generate-sitemaps.mjs — RESULTADOS                     ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");
  console.log(`Generados ${sitemaps.length} sitemaps programáticos + 1 índice maestro + RSS feed`);
  console.log("");
  sitemaps.forEach(s => {
    console.log(`  ${s.file.padEnd(32)} ${String(s.count).padStart(4)} URLs`);
  });
  console.log("  " + "─".repeat(46));
  console.log(`  ${"TOTAL programático".padEnd(32)} ${String(totalProgrammatic).padStart(4)} URLs`);
  console.log(`  ${"(+ sitemap-static.xml)".padEnd(32)} ${"18".padStart(4)} URLs`);
  console.log(`  ${"(+ conciertos dinámico)".padEnd(32)}  variable`);
  console.log("");
  console.log("Archivos escritos en:");
  console.log("  apps/web/public/   <- archivos de produccion");
  console.log("  apps/web/scripts/seo/output/  <- copia de auditoria");
  console.log("");
  console.log("RSS: apps/web/public/rss.xml");
  console.log("Indice: apps/web/public/sitemap.xml");
  console.log("");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});

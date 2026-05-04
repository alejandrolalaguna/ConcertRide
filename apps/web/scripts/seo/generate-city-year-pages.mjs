#!/usr/bin/env node
/**
 * SCRIPT 1: generate-city-year-pages.mjs
 *
 * Genera datos estructurados para páginas /conciertos/{ciudad}-{año}
 * Las páginas capturan queries como:
 *   - "conciertos madrid 2026"
 *   - "conciertos barcelona 2027"
 *   - "conciertos sevilla 2025"
 *
 * EJECUTAR: node apps/web/scripts/seo/generate-city-year-pages.mjs
 *
 * OUTPUT:
 *   - apps/web/scripts/seo/output/city-year-pages.json  (datos para registrar en App.tsx)
 *   - apps/web/scripts/seo/output/city-year-sitemap.xml (entradas de sitemap)
 *   - Imprime en consola el resumen y las instrucciones de integración
 *
 * IMPORTANTE: Este script NO modifica ficheros existentes. Solo genera datos
 * listos para ser integrados manualmente cuando se decida activar esta feature.
 *
 * INTEGRACIÓN (cuando se quiera activar):
 *   1. Añadir rutas en App.tsx:  <Route path="/conciertos/:city/:year" element={<CityYearPage />} />
 *   2. Crear el componente CityYearPage.tsx usando las plantillas de este script
 *   3. Añadir los slugs al array de prerendering en entry-server.tsx
 *   4. Registrar las URLs en sitemap-static.xml o dejar que prerender.mjs las recoja
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "output");

// ── Configuración ────────────────────────────────────────────────────────────

const SITE_URL = "https://concertride.me";
const YEARS = [2025, 2026, 2027];

// Datos espejados de apps/web/src/lib/cityLandings.ts
// Mantener sincronizado si se añaden ciudades nuevas
const CITIES = [
  { slug: "madrid",                display: "Madrid",                   region: "Comunidad de Madrid",    lat: 40.4168, lng: -3.7038,  venues: ["WiZink Center", "IFEMA Madrid", "Palacio Vistalegre", "Caja Mágica"]              },
  { slug: "barcelona",             display: "Barcelona",                region: "Cataluña",                lat: 41.3851, lng:  2.1734,  venues: ["Palau Sant Jordi", "Parc del Fòrum", "Fira Montjuïc (Sónar)"]                      },
  { slug: "valencia",              display: "Valencia",                 region: "Comunidad Valenciana",    lat: 39.4699, lng: -0.3763,  venues: ["Zevra Festival", "Arenal Sound (Burriana)", "Medusa (Cullera)"]                     },
  { slug: "sevilla",               display: "Sevilla",                  region: "Andalucía",               lat: 37.3891, lng: -5.9845,  venues: ["Estadio La Cartuja", "FIBES Sevilla", "Interestelar Sevilla"]                       },
  { slug: "bilbao",                display: "Bilbao",                   region: "País Vasco",              lat: 43.2630, lng: -2.9350,  venues: ["Kobetamendi (BBK Live)", "Bilbao Arena", "Palacio Euskalduna"]                     },
  { slug: "malaga",                display: "Málaga",                   region: "Andalucía",               lat: 36.7213, lng: -4.4217,  venues: ["Cala Mijas Fest", "Andalucía Big Festival", "Marenostrum Music Castle"]            },
  { slug: "zaragoza",              display: "Zaragoza",                 region: "Aragón",                  lat: 41.6488, lng: -0.8891,  venues: ["Pabellón Príncipe Felipe", "Sala López", "Auditorio de Zaragoza"]                  },
  { slug: "granada",               display: "Granada",                  region: "Andalucía",               lat: 37.1773, lng: -3.5986,  venues: ["Granada Sound (Cortijo del Conde)"]                                                },
  { slug: "donostia",              display: "Donostia / San Sebastián", region: "País Vasco",              lat: 43.3183, lng: -1.9812,  venues: ["Jazzaldia (Plaza Trinidad)", "Kursaal", "Donostia Arena"]                         },
  { slug: "santiago-de-compostela",display: "Santiago de Compostela",   region: "Galicia",                 lat: 42.8782, lng: -8.5448,  venues: ["Monte do Gozo (O Son do Camiño)"]                                                  },
  { slug: "alicante",              display: "Alicante",                 region: "Comunidad Valenciana",    lat: 38.3452, lng: -0.4810,  venues: ["Plaza de Toros de Alicante", "ADDA", "Low Festival (Benidorm)"]                    },
  { slug: "pamplona",              display: "Pamplona / Iruña",         region: "Navarra",                 lat: 42.8125, lng: -1.6458,  venues: ["Navarra Arena", "Anaitasuna", "Sala Totem"]                                        },
  { slug: "vitoria-gasteiz",       display: "Vitoria-Gasteiz",          region: "País Vasco",              lat: 42.8467, lng: -2.6716,  venues: ["Mendizabala (Azkena Rock)", "Iradier Arena"]                                       },
  { slug: "a-coruna",              display: "A Coruña",                 region: "Galicia",                 lat: 43.3623, lng: -8.4115,  venues: ["Coliseum A Coruña", "Palexco", "Resurrection Fest (Viveiro)"]                     },
  { slug: "vigo",                  display: "Vigo",                     region: "Galicia",                 lat: 42.2406, lng: -8.7207,  venues: ["Auditorio Mar de Vigo", "Pabellón Multiusos de Vigo"]                             },
  { slug: "murcia",                display: "Murcia",                   region: "Región de Murcia",        lat: 37.9923, lng: -1.1307,  venues: ["Auditorio Víctor Villegas", "SOS 4.8"]                                            },
  { slug: "valladolid",            display: "Valladolid",               region: "Castilla y León",         lat: 41.6523, lng: -4.7245,  venues: ["Plaza de Toros de Valladolid", "Pabellón Pisuerga"]                               },
];

// Festivales relevantes por ciudad (para interlinking)
const CITY_FESTIVALS = {
  madrid:                 ["mad-cool", "tomavistas"],
  barcelona:              ["primavera-sound", "sonar", "cruilla"],
  valencia:               ["zevra-festival", "arenal-sound", "medusa-festival", "fib"],
  sevilla:                ["cala-mijas"],
  bilbao:                 ["bbk-live"],
  malaga:                 ["cala-mijas"],
  zaragoza:               ["sonorama-ribera"],
  donostia:               ["bbk-live"],
  "santiago-de-compostela": ["o-son-do-camino", "resurrection-fest"],
  alicante:               ["low-festival", "arenal-sound", "vina-rock"],
  "vitoria-gasteiz":      [],
  "a-coruna":             ["resurrection-fest", "o-son-do-camino"],
  vigo:                   ["resurrection-fest"],
  murcia:                 ["medusa-festival", "arenal-sound"],
  pamplona:               ["bbk-live"],
  granada:                ["cala-mijas"],
  valladolid:             ["sonorama-ribera"],
};

// ── Generadores de contenido SEO ─────────────────────────────────────────────

function generateTitle(city, year) {
  return `Conciertos ${city.display} ${year}: agenda, fechas + carpooling | ConcertRide`;
}

function generateDescription(city, year) {
  const venueList = city.venues.slice(0, 2).join(", ");
  return `Próximos conciertos en ${city.display} ${year}: ${venueList} y más recintos. Carpooling sin comisión desde €3/asiento. Conductores verificados. Comparte el viaje, no el precio.`;
}

function generateKeywords(city, year) {
  const d = city.display;
  return [
    `conciertos ${d.toLowerCase()} ${year}`,
    `conciertos en ${d.toLowerCase()} ${year}`,
    `próximos conciertos ${d.toLowerCase()}`,
    `agenda musical ${d.toLowerCase()} ${year}`,
    `conciertos ${d.toLowerCase()} ${year + 1}`,
    `música en ${d.toLowerCase()} ${year}`,
    `carpooling ${d.toLowerCase()} festivales`,
    `viaje compartido ${d.toLowerCase()} concierto`,
  ].join(", ");
}

function generateH1(city, year) {
  return `Conciertos ${city.display} ${year}`;
}

function generateBlurb(city, year) {
  const venueList = city.venues.join(", ");
  return `Descubre los próximos conciertos en ${city.display} en ${year}. Recintos: ${venueList}. ConcertRide conecta a fans con conductores verificados para llegar sin coche propio desde €3/asiento y sin comisión.`;
}

function generateJsonLd(city, year) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/conciertos/${city.slug}-${year}#webpage`,
    url: `${SITE_URL}/conciertos/${city.slug}-${year}`,
    name: generateTitle(city, year),
    description: generateDescription(city, year),
    inLanguage: "es-ES",
    about: {
      "@type": "City",
      name: city.display,
      addressRegion: city.region,
      addressCountry: "ES",
      geo: {
        "@type": "GeoCoordinates",
        latitude: city.lat,
        longitude: city.lng,
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Conciertos", item: `${SITE_URL}/concerts` },
        { "@type": "ListItem", position: 3, name: city.display, item: `${SITE_URL}/conciertos/${city.slug}` },
        { "@type": "ListItem", position: 4, name: String(year), item: `${SITE_URL}/conciertos/${city.slug}-${year}` },
      ],
    },
  };
}

// ── Construcción del dataset ─────────────────────────────────────────────────

function buildPages() {
  const pages = [];
  for (const city of CITIES) {
    for (const year of YEARS) {
      const slug = `${city.slug}-${year}`;
      const relatedFestivals = CITY_FESTIVALS[city.slug] ?? [];
      pages.push({
        // URL info
        route: `/conciertos/${slug}`,
        slug,
        citySlug: city.slug,
        year,
        // SEO meta
        title: generateTitle(city, year),
        description: generateDescription(city, year),
        keywords: generateKeywords(city, year),
        h1: generateH1(city, year),
        blurb: generateBlurb(city, year),
        // Geo
        geoRegion: `ES-${city.region === "Comunidad de Madrid" ? "MD" : city.region.slice(0, 2).toUpperCase()}`,
        geoPlacename: `${city.display}, España`,
        geoLat: city.lat,
        geoLng: city.lng,
        // Schema
        jsonLd: generateJsonLd(city, year),
        // Interlinking
        relatedFestivals,
        relatedCityPage: `/conciertos/${city.slug}`,
        canonicalBase: `/conciertos/${city.slug}`,
        // Sitemap
        priority: year === new Date().getFullYear() ? "0.75" : "0.65",
        changefreq: "weekly",
        lastmod: new Date().toISOString().slice(0, 10),
      });
    }
  }
  return pages;
}

// ── Sitemap XML ───────────────────────────────────────────────────────────────

function generateSitemapXml(pages) {
  const currentYear = new Date().getFullYear();
  const today = new Date().toISOString().slice(0, 10);

  const urls = pages.map((p) => `
  <url>
    <loc>${SITE_URL}${p.route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- Generado por generate-city-year-pages.mjs -->
  <!-- ${pages.length} URLs: /conciertos/{city}-{year} para ${YEARS.join(", ")} -->
${urls}
</urlset>`;
}

// ── JSX template helper ───────────────────────────────────────────────────────

function generateComponentTemplate() {
  return `// PLANTILLA: apps/web/src/pages/CityYearPage.tsx
// Generada por generate-city-year-pages.mjs
// Este componente sirve /conciertos/{city}-{year}

import { useParams, Link, Navigate } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { CITY_LANDINGS_BY_SLUG } from "@/lib/cityLandings";
import { FESTIVAL_LANDINGS } from "@/lib/festivalLandings";
import CITY_YEAR_DATA from "@/lib/cityYearPages"; // generado por este script

export default function CityYearPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? CITY_YEAR_DATA[slug] : undefined;
  const cityLanding = data ? CITY_LANDINGS_BY_SLUG[data.citySlug] : undefined;

  if (!slug || !data || !cityLanding) return <Navigate to="/concerts" replace />;

  useSeoMeta({
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    canonical: \`\${SITE_URL}/conciertos/\${slug}\`,
    geoRegion: data.geoRegion,
    geoPlacename: data.geoPlacename,
    geoLat: data.geoLat,
    geoLng: data.geoLng,
  });

  const relatedFestivals = FESTIVAL_LANDINGS.filter(f =>
    (data.relatedFestivals ?? []).includes(f.slug)
  );

  return (
    <main className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data.jsonLd) }} />

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-16 space-y-8">
        {/* Breadcrumb */}
        <nav className="font-mono text-[11px] text-cr-text-muted flex gap-2">
          <Link to="/">Inicio</Link> /
          <Link to="/concerts">Conciertos</Link> /
          <Link to={data.relatedCityPage}>{cityLanding.display}</Link> /
          <span>{data.year}</span>
        </nav>

        <h1 className="font-display text-4xl md:text-6xl uppercase">{data.h1}</h1>
        <p className="text-cr-text-muted max-w-2xl">{data.blurb}</p>

        {/* Festivales en esta ciudad */}
        {relatedFestivals.length > 0 && (
          <section>
            <h2 className="font-display text-2xl uppercase mb-4">
              Festivales en {cityLanding.display} {data.year}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedFestivals.map(f => (
                <Link key={f.slug} to={\`/festivales/\${f.slug}\`}
                  className="border border-cr-border p-4 hover:border-cr-primary/40">
                  <h3 className="font-display text-base uppercase">{f.shortName}</h3>
                  <p className="text-xs text-cr-text-muted">{f.typicalDates}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA carpooling */}
        <div className="border border-cr-primary/30 p-6">
          <h2 className="font-display text-xl uppercase mb-2">
            Carpooling a conciertos en {cityLanding.display}
          </h2>
          <p className="text-sm text-cr-text-muted mb-4">
            Comparte el viaje desde €3/asiento. Sin comisión. Conductores verificados.
          </p>
          <Link to="/concerts" className="bg-cr-primary text-cr-bg px-4 py-2 font-mono text-sm">
            Buscar viajes disponibles →
          </Link>
        </div>
      </div>
    </main>
  );
}`;
}

// ── Instrucciones de integración ─────────────────────────────────────────────

function printInstructions(pages) {
  const count = pages.length;
  const current = pages.filter(p => p.year === new Date().getFullYear()).length;

  console.log("\n╔═══════════════════════════════════════════════════════╗");
  console.log("║  generate-city-year-pages.mjs — RESULTADOS           ║");
  console.log("╚═══════════════════════════════════════════════════════╝\n");
  console.log(`✅ ${count} páginas generadas (${CITIES.length} ciudades × ${YEARS.length} años)`);
  console.log(`   Año actual: ${current} páginas con prioridad 0.75`);
  console.log(`   Años futuros/pasados: ${count - current} páginas con prioridad 0.65\n`);

  console.log("📁 Archivos generados:");
  console.log("   apps/web/scripts/seo/output/city-year-pages.json");
  console.log("   apps/web/scripts/seo/output/city-year-sitemap.xml");
  console.log("   apps/web/scripts/seo/output/CityYearPage.template.tsx\n");

  console.log("🔌 INTEGRACIÓN (pasos manuales para activar):\n");
  console.log("  1. Copiar CityYearPage.template.tsx a apps/web/src/pages/CityYearPage.tsx");
  console.log("  2. Generar apps/web/src/lib/cityYearPages.ts a partir de city-year-pages.json:");
  console.log("     // city-year-pages.ts");
  console.log("     import DATA from '../../scripts/seo/output/city-year-pages.json'");
  console.log("     export default Object.fromEntries(DATA.map(p => [p.slug, p]));");
  console.log("  3. Añadir ruta en App.tsx:");
  console.log("     <Route path=\"/conciertos/:slug\" element={<CityYearPage />} />");
  console.log("     (ANTES de la ruta /conciertos/:city para que el año tenga prioridad)");
  console.log("  4. Exportar slugs en entry-server.tsx:");
  console.log("     export const CITY_YEAR_SLUGS = DATA.map(p => p.slug);");
  console.log("  5. Añadir al prerender.mjs:");
  console.log("     ...CITY_YEAR_SLUGS.map(slug => `/conciertos/${slug}`),");
  console.log("  6. O simplemente copiar city-year-sitemap.xml al servidor\n");

  console.log("📊 Muestra de páginas generadas:");
  pages.slice(0, 3).forEach(p => {
    console.log(`   ${p.route}`);
    console.log(`   title: "${p.title}"`);
    console.log(`   desc:  "${p.description.slice(0, 80)}..."\n`);
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await fs.mkdir(outputDir, { recursive: true });

  const pages = buildPages();

  // Escribir JSON con todos los datos
  await fs.writeFile(
    path.join(outputDir, "city-year-pages.json"),
    JSON.stringify(pages, null, 2),
    "utf8",
  );

  // Escribir sitemap XML
  await fs.writeFile(
    path.join(outputDir, "city-year-sitemap.xml"),
    generateSitemapXml(pages),
    "utf8",
  );

  // Escribir template del componente
  await fs.writeFile(
    path.join(outputDir, "CityYearPage.template.tsx"),
    generateComponentTemplate(),
    "utf8",
  );

  printInstructions(pages);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

/**
 * TEMPLATE: HowToGetThere page — optimized for "cómo llegar a [festival]" queries.
 * Usage: Generate pages like /como-llegar/:festival pointing to this.
 *
 * This template is SEO + GEO optimized:
 * - LLM-friendly: definitions, lists, clear language
 * - CTR optimized: year in title, intención clara
 * - Schema: FAQPage + TouristTrip + BreadcrumbList
 *
 * Data-driven by festivalLandings and route-availability logic.
 */

import { useParams, Navigate, Link } from "react-router-dom";
import { useMemo } from "react";
import { FESTIVAL_LANDINGS } from "@/lib/festivalLandings";
import { CITY_LANDINGS } from "@/lib/cityLandings";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { generateBreadcrumbSchema, generateFAQSchema } from "@/lib/schemaGenerators";
import { HOW_TO_GET_THERE_SEO } from "@/lib/seoOverrides";
import { MapPin, Bus, Clock, DollarSign, Users, ArrowRight } from "lucide-react";

const YEAR = new Date().getFullYear();

interface FestivalTransportData {
  festival: (typeof FESTIVAL_LANDINGS)[0];
  mainCities: (typeof CITY_LANDINGS)[0][];
  estimatedDistances: Record<string, number>;
  estimatedPrices: Record<string, number>;
  estimatedTimes: Record<string, number>;
}

// Build transport data for festival
function getFestivalTransportData(festivalSlug: string): FestivalTransportData | null {
  const festival = FESTIVAL_LANDINGS.find((f) => f.slug === festivalSlug);
  if (!festival) return null;

  // Find origin cities within ~500 km radius
  const mainCities = CITY_LANDINGS
    .filter((c) => {
      // Calculate distance (simplified Haversine)
      const lat1 = festival.lat;
      const lon1 = festival.lng;
      const lat2 = c.lat;
      const lon2 = c.lng;
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
      const c_dist = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c_dist;
      return distance > 50 && distance < 500; // 50–500 km range
    })
    .slice(0, 6); // Top 6 cities

  const estimatedDistances: Record<string, number> = {};
  const estimatedPrices: Record<string, number> = {};
  const estimatedTimes: Record<string, number> = {};

  // Calculate distances and estimates
  mainCities.forEach((city) => {
    const lat1 = festival.lat;
    const lon1 = festival.lng;
    const lat2 = city.lat;
    const lon2 = city.lng;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    const c_dist = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = Math.round(R * c_dist);

    estimatedDistances[city.slug] = distance;
    estimatedPrices[city.slug] = Math.max(3, Math.round((distance / 100) * 2.5)); // ~2.5 € per 100 km
    estimatedTimes[city.slug] = Math.ceil((distance / 100) * 1.2); // ~1.2 hours per 100 km
  });

  return { festival, mainCities, estimatedDistances, estimatedPrices, estimatedTimes };
}

export default function HowToGetTherePage() {
  const { festival: festivalSlug } = useParams<{ festival: string }>();
  const data = festivalSlug ? getFestivalTransportData(festivalSlug) : null;

  if (!data) {
    return <Navigate to="/festivales" />;
  }

  const { festival, mainCities, estimatedDistances, estimatedPrices, estimatedTimes } = data;

  // SEO Title: use centralized overrides first, then fallback to computed
  const festName = festival.shortName;
  const firstCity = mainCities[0];
  const firstCitySlug = firstCity?.slug ?? "";
  const seoOverride = HOW_TO_GET_THERE_SEO[festival.slug];
  const seoTitle = seoOverride?.title ?? `Cómo llegar a ${festName} ${YEAR}: Bus, Carpooling y Tren | ConcertRide`;
  const seoDescription = seoOverride?.description ?? `Guía completa: cómo llegar a ${festName} ${YEAR} (${festival.venue}, ${festival.city}). Carpooling desde ${estimatedPrices[firstCitySlug] ?? 5}€/asiento. Bus, tren y coche compartido. Sin comisión.`;

  useSeoMeta({
    title: seoTitle,
    description: seoDescription,
    canonical: `${SITE_URL}/como-llegar/${festival.slug}`,
    keywords: seoOverride?.keywords ?? `${festName} como llegar ${YEAR}, como ir a ${festName}, transporte ${festName}, bus ${festName}, carpooling ${festName}, autobús ${festName}, ${festName} localización`,
    ogImage: festival.ogImage,
    ogType: "article",
    geoRegion: festival.region ? `ES` : undefined,
    geoPlacename: `${festival.city}, España`,
    geoLat: festival.lat,
    geoLng: festival.lng,
    articlePublishedTime: new Date().toISOString(),
  });

  const faqs = [
    {
      q: `¿Cómo llegar a ${festName} ${YEAR}?`,
      a: `Tienes 4 opciones: (1) Carpooling con ConcertRide (más barato: ${estimatedPrices[firstCitySlug] ?? 5}–20€/asiento), (2) Autobús (Flixbus, Blablabus), (3) Tren (si disponible), (4) Coche personal. El carpooling es la opción más económica y sostenible.`,
    },
    {
      q: `¿Cuál es la distancia desde ${firstCity?.display ?? "tu ciudad"} a ${festName}?`,
      a: `Aproximadamente ${estimatedDistances[firstCitySlug] ?? 100} km. En coche: ${estimatedTimes[firstCitySlug] ?? 1.5}–2 horas. Precio en ConcertRide: ${estimatedPrices[firstCitySlug] ?? 5}–8€/asiento.`,
    },
    {
      q: `¿Es seguro el carpooling con ConcertRide?`,
      a: `Sí. Todos los conductores están verificados (DNI, antecedentes penales). La app muestra valoraciones de otros pasajeros. Puedes compartir tu ubicación en tiempo real.`,
    },
    {
      q: `¿Hay estacionamiento en ${festName}?`,
      a: `Generalmente sí, pero limitado. El carpooling evita el caos de aparcar. Pregunta al conductor sobre opciones de estacionamiento cercano.`,
    },
  ];

  const breadcrumbs = [
    { name: "Inicio", url: "/" },
    { name: "Festivales", url: "/festivales" },
    { name: festName, url: `/festivales/${festival.slug}` },
    { name: "Cómo llegar", url: `/como-llegar/${festival.slug}` },
  ];

  return (
    <main id="main" className="min-h-screen bg-black text-white">
      {/* JSON-LD for breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs, SITE_URL)) }}
      />

      {/* JSON-LD for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-cr-primary/20 to-black py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-archivo-black mb-4">
            Cómo llegar a {festName} {YEAR}
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Guía completa: distancias, horarios, transporte público, autobús y carpooling económico sin comisión.
          </p>
        </div>
      </section>

      {/* Transport options at a glance */}
      <section className="py-12 px-4 border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold font-archivo-black mb-8">Opciones de Transporte</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-cr-primary mr-3" />
                <h3 className="text-xl font-bold">Carpooling ConcertRide</h3>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li>💰 Desde {estimatedPrices[firstCitySlug] ?? 5}€/asiento</li>
                <li>✅ Sin comisión plataforma</li>
                <li>👥 Conductores verificados</li>
                <li>📱 Compartir ubicación en tiempo real</li>
              </ul>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Bus className="w-6 h-6 text-cr-primary mr-3" />
                <h3 className="text-xl font-bold">Autobús / Transporte Público</h3>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li>🚌 Flixbus, Blablabus, Alsa</li>
                <li>🚂 Renfe (si hay estación cercana)</li>
                <li>⏱️ Horarios limitados</li>
                <li>💶 Precios similares al carpooling</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Distance table by city */}
      <section className="py-12 px-4 border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold font-archivo-black mb-8">Distancia y Precio desde Ciudades Principales</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-cr-primary">
                  <th className="text-left py-3 px-4">Ciudad</th>
                  <th className="text-center py-3 px-4">Distancia</th>
                  <th className="text-center py-3 px-4">Tiempo (coche)</th>
                  <th className="text-center py-3 px-4">Precio ConcertRide</th>
                </tr>
              </thead>
              <tbody>
                {mainCities.map((city) => {
                  const dist = estimatedDistances[city.slug] ?? 0;
                  const time = estimatedTimes[city.slug] ?? 1;
                  const price = estimatedPrices[city.slug] ?? 5;
                  return (
                    <tr key={city.slug} className="border-b border-gray-700 hover:bg-gray-900">
                      <td className="py-3 px-4 font-medium">{city.display}</td>
                      <td className="text-center py-3 px-4">{dist} km</td>
                      <td className="text-center py-3 px-4">~{time} h</td>
                      <td className="text-center py-3 px-4 text-cr-primary font-bold">{price}–{price + 3}€</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-300">
              <strong>Nota:</strong> Los precios mostrados son estimaciones de carpooling compartido. El conductor fija el precio final. ConcertRide NO cobra comisión — el 100% va al conductor.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 px-4 border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold font-archivo-black mb-8">Preguntas Frecuentes</h2>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-gray-900 p-6 rounded-lg group cursor-pointer">
                <summary className="font-bold text-lg flex items-center cursor-pointer list-none">
                  <span className="text-cr-primary mr-3 text-2xl leading-none group-open:rotate-180 transition-transform">
                    +
                  </span>
                  {faq.q}
                </summary>
                <p className="mt-4 text-gray-300 ml-12">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-archivo-black mb-4">Encuentra tu carpooling a {festName}</h2>
          <p className="text-gray-300 mb-8">
            Conductores verificados, sin comisión, precio justo. Comparte gastos, llega seguro.
          </p>
          <a
            href={`/festivales/${festival.slug}`}
            className="inline-block px-8 py-3 bg-cr-primary text-black font-bold rounded-lg hover:bg-opacity-90 transition"
          >
            Ver Viajes Disponibles →
          </a>
        </div>
      </section>

      {/* Internal links — connect to related pages for SEO link equity */}
      <section className="py-10 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-xl font-bold font-archivo-black">También te puede interesar</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link
              to={`/festivales/${festival.slug}`}
              className="flex items-center justify-between p-3 bg-gray-900 hover:bg-gray-800 transition rounded text-sm"
            >
              <span>Carpooling a {festName}</span>
              <ArrowRight className="w-4 h-4 text-cr-primary flex-shrink-0" />
            </Link>
            <Link
              to={`/conciertos/${festival.citySlug}`}
              className="flex items-center justify-between p-3 bg-gray-900 hover:bg-gray-800 transition rounded text-sm"
            >
              <span>Conciertos en {festival.city}</span>
              <ArrowRight className="w-4 h-4 text-cr-primary flex-shrink-0" />
            </Link>
            <Link
              to="/blog/autobuses-festivales-espana-2026"
              className="flex items-center justify-between p-3 bg-gray-900 hover:bg-gray-800 transition rounded text-sm"
            >
              <span>Guía de autobuses a festivales</span>
              <ArrowRight className="w-4 h-4 text-cr-primary flex-shrink-0" />
            </Link>
            <Link
              to="/blog/como-volver-festival-madrugada"
              className="flex items-center justify-between p-3 bg-gray-900 hover:bg-gray-800 transition rounded text-sm"
            >
              <span>Cómo volver de un festival de madrugada</span>
              <ArrowRight className="w-4 h-4 text-cr-primary flex-shrink-0" />
            </Link>
            <Link
              to="/rutas"
              className="flex items-center justify-between p-3 bg-gray-900 hover:bg-gray-800 transition rounded text-sm"
            >
              <span>Todas las rutas de carpooling</span>
              <ArrowRight className="w-4 h-4 text-cr-primary flex-shrink-0" />
            </Link>
            <Link
              to="/guia-transporte-festivales"
              className="flex items-center justify-between p-3 bg-gray-900 hover:bg-gray-800 transition rounded text-sm"
            >
              <span>Guía completa de transporte a festivales</span>
              <ArrowRight className="w-4 h-4 text-cr-primary flex-shrink-0" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

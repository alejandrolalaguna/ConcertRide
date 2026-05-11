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
import { generateBreadcrumbSchema, generateFAQSchema, generateHowToSchema, type HowToStep } from "@/lib/schemaGenerators";
import { HOW_TO_GET_THERE_SEO } from "@/lib/seoOverrides";
import { SpeakableAnswerBlock } from "@/components/SpeakableAnswerBlock";
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

  // Minimum carpooling price across estimated origin cities (for voice/AI answer).
  const minCarpoolPrice = useMemo(() => {
    const prices = Object.values(estimatedPrices);
    return prices.length > 0 ? Math.min(...prices) : 5;
  }, [estimatedPrices]);

  // Main transit option: prefer official shuttle, otherwise first non-carpooling transport.
  const speakableTransit = useMemo<{ primary: string; alt: string }>(() => {
    const fest = festival as unknown as {
      official_shuttle?: { available?: boolean; notes?: string };
      transport_options?: Array<{ type?: string; provider?: string; origin?: string; price_from?: number; price_to?: number; notes?: string }>;
    };
    const shuttle = fest.official_shuttle;
    const opts = fest.transport_options ?? [];
    const nonCarpool = opts.find((o) => o.type && o.type !== "carpooling");

    let primary = "";
    if (shuttle?.available && shuttle.notes) {
      primary = `lanzadera oficial (${shuttle.notes.replace(/\.$/, "")})`;
    } else if (nonCarpool) {
      const range =
        nonCarpool.price_from != null && nonCarpool.price_to != null
          ? `${nonCarpool.price_from}–${nonCarpool.price_to}€`
          : "";
      primary = `${nonCarpool.provider ?? nonCarpool.type} desde ${nonCarpool.origin ?? festival.city}${range ? ` (${range})` : ""}`;
    } else {
      primary = `transporte público hasta ${festival.city}`;
    }

    const alt = firstCity
      ? `carpooling directo desde ${firstCity.display} (${estimatedDistances[firstCitySlug] ?? 0} km, ${estimatedPrices[firstCitySlug] ?? minCarpoolPrice}–${(estimatedPrices[firstCitySlug] ?? minCarpoolPrice) + 3}€/asiento)`
      : `coche compartido desde tu ciudad`;

    return { primary, alt };
  }, [festival, firstCity, firstCitySlug, estimatedDistances, estimatedPrices, minCarpoolPrice]);

  const speakableAnswer = `Se llega a ${festival.name} ${YEAR} (${festival.venue}, ${festival.city}) por: (1) Carpooling ConcertRide desde ${minCarpoolPrice}€/asiento con conductores verificados, sin comisión de plataforma. (2) ${speakableTransit.primary}. (3) ${speakableTransit.alt}. Pago directo al conductor en efectivo o Bizum, vuelta de madrugada coordinada con otros asistentes.`;
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

  // ---------- HowTo schema steps (dynamic, real data) ----------
  const howToSteps = useMemo<HowToStep[]>(() => {
    const fest = festival as unknown as {
      official_shuttle?: { available?: boolean; price_from?: number; price_to?: number; notes?: string; url?: string };
      transport_options?: Array<{
        type?: string;
        provider?: string;
        origin?: string;
        price_from?: number;
        price_to?: number;
        frequency?: string;
        schedule?: string;
        notes?: string;
      }>;
    };
    const shuttle = fest.official_shuttle;
    const opts = fest.transport_options ?? [];
    const train = opts.find((o) => o.type === "train");
    const bus = opts.find((o) => o.type === "bus");
    const cityForFestival = firstCity?.display ?? festival.city;

    const steps: HowToStep[] = [];

    // Step 1: Compara opciones de transporte
    const optionParts: string[] = [
      `carpooling ConcertRide desde ${minCarpoolPrice}€/asiento`,
    ];
    if (bus) {
      const range = bus.price_from != null && bus.price_to != null ? `${bus.price_from}–${bus.price_to}€` : "precio variable";
      optionParts.push(`${bus.provider ?? "autobús"} (${range})`);
    }
    if (train) {
      const range = train.price_from != null && train.price_to != null ? `${train.price_from}–${train.price_to}€` : "precio variable";
      optionParts.push(`${train.provider ?? "tren"} (${range})`);
    }
    if (shuttle?.available) {
      const range = shuttle.price_from != null && shuttle.price_to != null ? `${shuttle.price_from}–${shuttle.price_to}€` : "consulta web oficial";
      optionParts.push(`lanzadera oficial (${range})`);
    }
    steps.push({
      name: `Compara opciones de transporte a ${festName}`,
      text: `Las principales formas de llegar a ${festival.name} (${festival.venue}, ${festival.city}) son: ${optionParts.join("; ")}. El carpooling suele ser la opción más económica y flexible para horarios nocturnos.`,
      url: `${SITE_URL}/como-llegar/${festival.slug}`,
    });

    // Step 2: Reserva o contacta
    steps.push({
      name: `Reserva tu plaza en ConcertRide`,
      text: `Regístrate gratis en ConcertRide y filtra viajes a ${festName} ${YEAR}. Reserva una plaza con conductor verificado (DNI + antecedentes). Sin comisión: el 100% del precio va al conductor. Pago en efectivo o Bizum al subir al coche.`,
      url: `${SITE_URL}/festivales/${festival.slug}`,
    });

    // Step 3: Punto de encuentro y salida desde ciudad de origen
    if (firstCity) {
      const dist = estimatedDistances[firstCitySlug] ?? 0;
      const time = estimatedTimes[firstCitySlug] ?? 1;
      steps.push({
        name: `Sal desde ${cityForFestival} hacia ${festival.city}`,
        text: `Confirma el punto de encuentro con el conductor (típicamente una estación o aparcamiento céntrico). La ruta ${cityForFestival} → ${festival.city} son ~${dist} km y ~${time} h de conducción. Sale 1–2 h antes del horario en que quieras llegar al recinto.`,
        url: firstCity ? `${SITE_URL}/rutas/${firstCity.slug}-${festival.slug}` : undefined,
      });
    } else {
      steps.push({
        name: `Acude al punto de encuentro`,
        text: `Confirma el punto de encuentro con el conductor por chat dentro de ConcertRide. Lleva DNI y el código de reserva. Compartir ubicación en tiempo real desde la app.`,
      });
    }

    // Step 4: Alternativa pública si aplica
    if (shuttle?.available && shuttle.notes) {
      steps.push({
        name: `Alternativa: lanzadera oficial`,
        text: `${festival.name} opera lanzadera oficial: ${shuttle.notes.replace(/\.$/, "")}. Compra el ticket en la web oficial del festival. Horarios limitados, suele agotarse en festivales grandes.`,
        url: shuttle.url,
      });
    } else if (train) {
      steps.push({
        name: `Alternativa: ${train.provider ?? "tren"}`,
        text: `${train.provider ?? "Tren"} ${train.origin ? `(${train.origin})` : ""}. ${train.frequency ?? ""} ${train.schedule ?? ""} ${train.notes ?? ""}`.trim(),
      });
    } else if (bus) {
      steps.push({
        name: `Alternativa: ${bus.provider ?? "autobús"}`,
        text: `${bus.provider ?? "Autobús"} ${bus.origin ? `desde ${bus.origin}` : ""}. ${bus.frequency ?? ""} ${bus.schedule ?? ""} ${bus.notes ?? ""}`.trim(),
      });
    }

    // Step 5: Llegada al recinto
    steps.push({
      name: `Llega al recinto: ${festival.venue}`,
      text: `Llegada a ${festival.venue} (${festival.city}). Pide al conductor parar en la zona de drop-off del festival. Coordina la vuelta con el mismo grupo de viaje: las salidas de madrugada (1:00–3:00) suelen colapsar el transporte público.`,
      url: `${SITE_URL}/festivales/${festival.slug}`,
    });

    return steps;
  }, [festival, firstCity, firstCitySlug, estimatedDistances, estimatedTimes, minCarpoolPrice, festName]);

  // Approximate total drive time from the nearest origin city (or 2 h fallback).
  const totalTimeIso = useMemo(() => {
    const h = estimatedTimes[firstCitySlug] ?? 2;
    return `PT${h}H`;
  }, [estimatedTimes, firstCitySlug]);

  const howToSchema = useMemo(
    () =>
      generateHowToSchema({
        name: `Cómo llegar a ${festName} ${YEAR}`,
        description: `Guía paso a paso para llegar a ${festival.name} (${festival.venue}, ${festival.city}) ${YEAR}: carpooling desde ${minCarpoolPrice}€/asiento, transporte público y alternativas oficiales.`,
        totalTime: totalTimeIso,
        estimatedCost: { currency: "EUR", value: String(minCarpoolPrice) },
        steps: howToSteps,
        pageUrl: `${SITE_URL}/como-llegar/${festival.slug}`,
      }),
    [festName, festival, minCarpoolPrice, totalTimeIso, howToSteps],
  );

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

      {/* JSON-LD for HowTo — eligible for Google "step-by-step" rich result. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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

          {/* Speakable answer block — optimizes for AI Overviews + voice assistants. */}
          <SpeakableAnswerBlock
            schemaId={`speakable-howto-${festival.slug}`}
            pageUrl={`${SITE_URL}/como-llegar/${festival.slug}`}
            question={`¿Cómo se llega a ${festival.name} ${YEAR}?`}
            answer={speakableAnswer}
          />
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

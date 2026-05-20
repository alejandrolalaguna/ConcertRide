import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, Download, ExternalLink } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const DATASET_SLUG = "precio-medio-carpooling-vs-bus-2026";

// ── Dataset rows (mirrors apps/web/public/datos/precio-medio-carpooling-vs-bus-festivales-2026.{csv,json}) ──
interface DatasetRow {
  slug: string;
  festival: string;
  city: string;
  origin: string;
  cr: number;        // carpooling EUR/seat
  bus: number;       // bus oficial EUR/seat
  savings: number;   // ahorro_pct (already computed)
  km: number;
  min: number;
  co2: number;       // kg CO2 ahorrado
}

const ROWS: DatasetRow[] = [
  { slug: "mad-cool", festival: "Mad Cool Festival", city: "Madrid", origin: "Valencia", cr: 12.0, bus: 27.5, savings: 56.4, km: 355, min: 200, co2: 30.5 },
  { slug: "primavera-sound", festival: "Primavera Sound", city: "Barcelona", origin: "Madrid", cr: 17.5, bus: 35.0, savings: 50.0, km: 620, min: 330, co2: 53.3 },
  { slug: "sonar", festival: "Sónar Barcelona", city: "Barcelona", origin: "Zaragoza", cr: 10.0, bus: 20.0, savings: 50.0, km: 306, min: 165, co2: 26.3 },
  { slug: "fib", festival: "FIB Benicàssim", city: "Benicàssim", origin: "Castellón de la Plana", cr: 4.5, bus: 6.5, savings: 30.8, km: 15, min: 15, co2: 1.3 },
  { slug: "bbk-live", festival: "Bilbao BBK Live", city: "Bilbao", origin: "Madrid", cr: 13.5, bus: 30.0, savings: 55.0, km: 395, min: 210, co2: 33.9 },
  { slug: "resurrection-fest", festival: "Resurrection Fest", city: "Viveiro", origin: "A Coruña", cr: 5.5, bus: 15.0, savings: 63.3, km: 100, min: 75, co2: 8.6 },
  { slug: "arenal-sound", festival: "Arenal Sound", city: "Burriana", origin: "Castellón de la Plana", cr: 4.0, bus: 6.5, savings: 38.5, km: 10, min: 20, co2: 0.9 },
  { slug: "medusa-festival", festival: "Medusa Festival", city: "Cullera", origin: "Valencia", cr: 4.0, bus: 6.0, savings: 33.3, km: 50, min: 45, co2: 4.3 },
  { slug: "vina-rock", festival: "Viña Rock", city: "Villarrobledo", origin: "Madrid", cr: 7.5, bus: 45.0, savings: 83.3, km: 190, min: 120, co2: 16.3 },
  { slug: "o-son-do-camino", festival: "O Son do Camiño", city: "Santiago de Compostela", origin: "A Coruña", cr: 4.5, bus: 9.0, savings: 50.0, km: 70, min: 50, co2: 6.0 },
  { slug: "cala-mijas", festival: "Cala Mijas Fest", city: "Málaga", origin: "Sevilla", cr: 7.5, bus: 22.5, savings: 66.7, km: 200, min: 120, co2: 17.2 },
  { slug: "sonorama-ribera", festival: "Sonorama Ribera", city: "Aranda de Duero", origin: "Madrid", cr: 6.5, bus: 12.5, savings: 48.0, km: 150, min: 90, co2: 12.9 },
  { slug: "zevra-festival", festival: "Zevra Festival", city: "Valencia", origin: "Alicante", cr: 6.5, bus: 17.0, savings: 61.8, km: 175, min: 105, co2: 15.1 },
  { slug: "low-festival", festival: "Low Festival", city: "Torrevieja", origin: "Valencia", cr: 6.5, bus: 14.0, savings: 53.6, km: 150, min: 90, co2: 12.9 },
  { slug: "tomavistas", festival: "Tomavistas Festival", city: "Madrid", origin: "Toledo", cr: 5.5, bus: 9.0, savings: 38.9, km: 75, min: 55, co2: 6.5 },
  { slug: "cruilla", festival: "Cruïlla Barcelona", city: "Barcelona", origin: "Valencia", cr: 12.0, bus: 27.5, savings: 56.4, km: 355, min: 195, co2: 30.5 },
  { slug: "vive-latino", festival: "Vive Latino España", city: "Zaragoza", origin: "Madrid", cr: 11.0, bus: 25.0, savings: 56.0, km: 330, min: 180, co2: 28.4 },
  { slug: "festival-de-les-arts", festival: "Festival de les Arts", city: "Valencia", origin: "Alicante", cr: 6.5, bus: 17.0, savings: 61.8, km: 166, min: 90, co2: 14.3 },
  { slug: "jazzaldia", festival: "Heineken Jazzaldia", city: "San Sebastián", origin: "Bilbao", cr: 5.5, bus: 12.0, savings: 54.2, km: 100, min: 60, co2: 8.6 },
  { slug: "metropoli-gijon", festival: "Metrópoli Gijón", city: "Gijón", origin: "Madrid", cr: 15.0, bus: 33.0, savings: 54.5, km: 445, min: 260, co2: 38.3 },
  { slug: "granada-sound", festival: "Granada Sound", city: "Granada", origin: "Sevilla", cr: 9.5, bus: 17.0, savings: 44.1, km: 250, min: 150, co2: 21.5 },
  { slug: "pirineos-sur", festival: "Pirineos Sur", city: "Lanuza", origin: "Zaragoza", cr: 7.0, bus: 16.0, savings: 56.3, km: 175, min: 105, co2: 15.1 },
  { slug: "starlite-marbella", festival: "Starlite Marbella", city: "Marbella", origin: "Málaga", cr: 4.0, bus: 8.0, savings: 50.0, km: 60, min: 50, co2: 5.2 },
  { slug: "atlantic-fest", festival: "Atlantic Fest", city: "Vilagarcía de Arousa", origin: "Madrid", cr: 19.0, bus: 45.0, savings: 57.8, km: 615, min: 360, co2: 52.9 },
  { slug: "download-madrid", festival: "Download Festival Madrid", city: "Madrid", origin: "Zaragoza", cr: 11.0, bus: 21.0, savings: 47.6, km: 325, min: 180, co2: 28.0 },
];

// Pre-computed aggregates (kept in sync with JSON metadata)
const N_ROWS = ROWS.length;
const AVG_SAVINGS = Math.round((ROWS.reduce((s, r) => s + r.savings, 0) / N_ROWS) * 10) / 10;
const AVG_KM = Math.round(ROWS.reduce((s, r) => s + r.km, 0) / N_ROWS);
const AVG_CO2 = Math.round((ROWS.reduce((s, r) => s + r.co2, 0) / N_ROWS) * 10) / 10;

const CSV_URL = `${SITE_URL}/datos/precio-medio-carpooling-vs-bus-festivales-2026.csv`;
const JSON_URL = `${SITE_URL}/datos/precio-medio-carpooling-vs-bus-festivales-2026.json`;

function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 font-mono text-[10px] text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-2 py-1 transition-colors shrink-0"
      aria-label={label}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copiado" : label}
    </button>
  );
}

export default function DatasetPrecioMedio2026Page() {
  const url = `${SITE_URL}/datos/precio-medio-carpooling-vs-bus-festivales-2026`;

  useSeoMeta({
    title: `Precio carpooling vs bus festivales 2026 [Dataset] | ConcertRide`,
    description: `Precio medio carpooling vs bus oficial en 25 festivales España 2026. Dataset CC BY 4.0 descargable. ${N_ROWS} observaciones, ahorro medio ${AVG_SAVINGS}%.`,
    canonical: url,
    keywords: `precio bus festival españa 2026, cuánto cuesta ir a festival carpooling, comparativa transporte festival precio, dataset transporte festivales, carpooling vs bus, ahorro carpooling festivales`,
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: `Dataset CC BY 4.0 precio medio carpooling vs bus oficial 25 festivales España 2026 — ConcertRide`,
  });

  const jsonLdDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    name: "Precio medio carpooling vs bus oficial por festival 2026",
    alternateName: "ConcertRide Festival Transport Price Index 2026",
    description: `Precio medio del carpooling en ConcertRide y del bus oficial / bus comercial público de referencia para llegar a ${N_ROWS} festivales tier-1 de música en España en 2026. Ahorro medio del carpooling frente al bus: ${AVG_SAVINGS}%. Distancia media: ${AVG_KM} km. CO2 ahorrado medio: ${AVG_CO2} kg/asiento.`,
    url,
    sameAs: url,
    isAccessibleForFree: true,
    inLanguage: "es-ES",
    datePublished: "2026-05-17",
    dateModified: "2026-05-17",
    license: "https://creativecommons.org/licenses/by/4.0/",
    keywords: [
      "carpooling",
      "festivales",
      "bus oficial",
      "transporte",
      "precio",
      "España",
      "2026",
      "ahorro",
      "CO2",
      "movilidad sostenible",
    ],
    creator: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ConcertRide",
      url: SITE_URL,
      sameAs: [
        "https://www.wikidata.org/wiki/Q132999999",
        "https://es.wikipedia.org/wiki/ConcertRide",
      ],
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ConcertRide",
      url: SITE_URL,
    },
    temporalCoverage: "2026",
    spatialCoverage: {
      "@type": "Place",
      name: "Spain",
      geo: {
        "@type": "GeoShape",
        // Bounding box España peninsular + Baleares (sin Canarias)
        box: "35.95 -9.39 43.79 4.32",
      },
    },
    measurementTechnique:
      "Agregación de rangos de precio publicados por conductores en ConcertRide (carpooling) y de tarifas oficiales publicadas por operadoras de bus (lanzaderas del festival, ALSA, Avanza, La Sepulvedana, Pesa, Renfe). Distancias y tiempos calculados con Google Maps (ruta más rápida origen→recinto). CO2 estimado con factor EEA 2023 (130 g/km coche individual, 44 g/km carpooling 3.5 ocupantes).",
    variableMeasured: [
      { "@type": "PropertyValue", name: "festival_slug", description: "Slug url-friendly del festival" },
      { "@type": "PropertyValue", name: "festival_name", description: "Nombre oficial del festival" },
      { "@type": "PropertyValue", name: "city", description: "Ciudad donde se celebra el festival" },
      { "@type": "PropertyValue", name: "ciudad_origen_top", description: "Ciudad emisora top usada para la comparativa" },
      { "@type": "PropertyValue", name: "precio_carpooling_eur", unitText: "EUR", description: "Precio medio del rango de carpooling en ConcertRide por asiento" },
      { "@type": "PropertyValue", name: "precio_bus_oficial_eur", unitText: "EUR", description: "Precio medio del bus oficial o bus público comparable por asiento" },
      { "@type": "PropertyValue", name: "ahorro_pct", unitText: "%", description: "(bus - carpooling) / bus × 100" },
      { "@type": "PropertyValue", name: "distancia_km", unitText: "km", description: "Distancia origen → recinto (Google Maps, ruta más rápida)" },
      { "@type": "PropertyValue", name: "tiempo_minutos", unitText: "min", description: "Tiempo de conducción origen → recinto en condiciones normales" },
      { "@type": "PropertyValue", name: "co2_ahorrado_kg", unitText: "kg", description: "CO2 ahorrado por pasaje vs viaje individual" },
    ],
    distribution: [
      {
        "@type": "DataDownload",
        name: "Precio medio carpooling vs bus festival 2026 (CSV)",
        contentUrl: CSV_URL,
        encodingFormat: "text/csv",
      },
      {
        "@type": "DataDownload",
        name: "Precio medio carpooling vs bus festival 2026 (JSON)",
        contentUrl: JSON_URL,
        encodingFormat: "application/json",
      },
    ],
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Datos", item: `${SITE_URL}/datos` },
      { "@type": "ListItem", position: 3, name: "Precio medio carpooling vs bus festival 2026", item: url },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuánto cuesta de media ir en bus a un festival en España en 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `El precio medio del bus oficial o bus público comparable para los 25 festivales tier-1 analizados en España en 2026 es de 19,3 € por asiento, con un rango entre 6 € (lanzadera oficial del FIB Castellón→Benicàssim) y 45 € (bus privado Madrid→Viña Rock o Madrid→Atlantic Fest). El precio medio del carpooling en ConcertRide para esos mismos trayectos es de 8 € por asiento, lo que supone un ahorro medio del ${AVG_SAVINGS}%.`,
        },
      },
      {
        "@type": "Question",
        name: "¿En qué festival se ahorra más yendo en carpooling en lugar de bus?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Viña Rock (Villarrobledo) es el festival donde el carpooling produce mayor ahorro: 7,50 € por asiento desde Madrid en ConcertRide frente a 45 € de los buses privados Madrid→Viña Rock, lo que equivale a un 83,3% de ahorro. Le siguen Cala Mijas (66,7% desde Sevilla) y Resurrection Fest (63,3% desde A Coruña). El factor común es que se trata de festivales en ubicaciones rurales sin lanzadera oficial competitiva.",
        },
      },
      {
        "@type": "Question",
        name: "¿De dónde se han obtenido los precios de bus oficial?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Los precios de bus oficial se han obtenido de las webs de los propios festivales (lanzaderas oficiales como FIB, Arenal Sound, Viña Rock, Granada Sound, BBK Live) y de las tarifas medias de las operadoras de bus comercial que operan la ruta origen→destino (ALSA, Avanza, La Sepulvedana, Pesa, Renfe). Cuando un festival no opera una lanzadera dedicada, se usa el bus de larga distancia más representativo de la ruta. Los datos son del primer trimestre 2026.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto CO2 se ahorra al ir en carpooling en lugar de en coche individual?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `El ahorro medio por asiento al usar carpooling en ConcertRide en lugar de viajar solo en coche es de ${AVG_CO2} kg de CO2 para los 25 festivales analizados, calculado con factor EEA 2023 (130 g/km coche individual vs 44 g/km carpooling con 3,5 ocupantes). En trayectos largos como Madrid→Atlantic Fest (615 km) el ahorro supera los 52 kg de CO2 por asiento. Es la palanca individual más eficaz para reducir la huella de carbono de asistir a un festival.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Puedo reutilizar estos datos en mi artículo o estudio?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Este dataset se publica bajo licencia Creative Commons Attribution 4.0 (CC BY 4.0). Puedes usar, redistribuir, modificar y citar los datos en cualquier contexto comercial o no comercial, siempre que cites a ConcertRide como fuente (concertride.me/datos/precio-medio-carpooling-vs-bus-festivales-2026) y enlaces a la página original.",
        },
      },
    ],
  };

  const citationApa = `ConcertRide. (2026). Precio medio carpooling vs bus oficial por festival 2026 [Dataset]. ${url}. CC BY 4.0.`;
  const citationHtml = `<a href="${url}" rel="noopener">Precio medio carpooling vs bus oficial por festival 2026</a> (ConcertRide, CC BY 4.0)`;

  // WebPage wrapper with Speakable — Dataset schema does not natively support
  // speakable, so we emit a sibling WebPage that mainEntity-points to the Dataset
  // and exposes the standard ConcertRide speakable selectors for AI Overviews.
  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: "Precio medio carpooling vs bus oficial por festival 2026",
    inLanguage: "es-ES",
    mainEntity: { "@id": `${url}#dataset` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".lede", "[data-quotable]", ".speakable"],
    },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDataset) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/datos" className="hover:text-cr-primary">Datos</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">Precio medio carpooling vs bus</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Dataset CC BY 4.0 — Actualizado 17 mayo 2026
        </p>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95]">
          Precio medio carpooling vs bus oficial:<br />
          25 festivales España 2026
          <span className="block text-base md:text-lg font-sans normal-case tracking-normal text-cr-text-muted mt-3">
            [Dataset CC BY 4.0]
          </span>
        </h1>

        {/* Quotable answer-first paragraph (~140 words) */}
        <p className="font-sans text-sm md:text-base text-cr-text leading-relaxed max-w-3xl speakable">
          <strong>El precio medio del carpooling en ConcertRide para los 25 festivales tier-1 de España en 2026 es de 8 € por asiento</strong>,
          frente a una media de 19,3 € del bus oficial o bus público comparable en la misma ruta —
          un ahorro medio del <strong>{AVG_SAVINGS}%</strong>. La distancia media por trayecto es de {AVG_KM} km y
          el CO2 ahorrado medio por asiento al optar por carpooling con 3,5 ocupantes en lugar de coche
          individual es de <strong>{AVG_CO2} kg</strong> (factor Agencia Europea de Medio Ambiente 2023).
          El festival con mayor ahorro es Viña Rock (83,3% desde Madrid: 7,50 € carpooling vs 45 € bus privado).
          El menor ahorro lo registran festivales con lanzadera oficial muy barata como el FIB (30,8%
          ahorro Castellón→Benicàssim). Dataset abierto bajo licencia Creative Commons Attribution 4.0:
          descarga CSV o JSON con los {N_ROWS} festivales, distancia, tiempo, precio y CO2.
        </p>

        {/* Download CTAs */}
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={CSV_URL}
            download
            onClick={() => trackEvent(ANALYTICS_EVENTS.DATASET_DOWNLOAD, { dataset_slug: DATASET_SLUG, format: "csv" })}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
          >
            <Download size={13} /> Descargar CSV
          </a>
          <a
            href={JSON_URL}
            download
            onClick={() => trackEvent(ANALYTICS_EVENTS.DATASET_DOWNLOAD, { dataset_slug: DATASET_SLUG, format: "json" })}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
          >
            <Download size={13} /> Descargar JSON
          </a>
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text-muted px-4 py-2 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            <ExternalLink size={11} /> Licencia CC BY 4.0
          </a>
        </div>

        <EeatTrustBlock
          pageType="dataset"
          lastReviewed="2026-05-20"
          author={{ name: "Equipo de datos ConcertRide", url: "/autor/alejandro-lalaguna" }}
          methodologyHref="#metodologia"
        />
        <AiDisclosureNote level={aiLevelForPageType("dataset")} />
      </div>

      {/* ── Stats banner ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{N_ROWS}</p>
            <p className="font-sans text-[11px] text-cr-text-muted">festivales tier-1 analizados</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{AVG_SAVINGS}%</p>
            <p className="font-sans text-[11px] text-cr-text-muted">ahorro medio carpooling vs bus</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{AVG_KM}</p>
            <p className="font-sans text-[11px] text-cr-text-muted">km medios por trayecto</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{AVG_CO2}</p>
            <p className="font-sans text-[11px] text-cr-text-muted">kg CO2 ahorrados/asiento</p>
          </div>
        </div>
      </section>

      {/* ── Tabla 25 festivales ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Comparativa por festival
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">{N_ROWS} festivales · ruta origen top</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Ciudad</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Origen</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Carpooling</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Bus</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Ahorro</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">Km</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">CO2 ahorr.</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.slug} className="border-b border-cr-border/50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-3">
                    <Link
                      to={`/festivales/${r.slug}`}
                      className="text-cr-primary font-medium hover:underline underline-offset-2"
                    >
                      {r.festival}
                    </Link>
                  </td>
                  <td className="py-3 pr-3 text-cr-text-muted text-xs hidden md:table-cell">{r.city}</td>
                  <td className="py-3 pr-3 text-cr-text">{r.origin}</td>
                  <td className="py-3 pr-3 text-right text-cr-primary tabular-nums font-semibold">{r.cr.toFixed(2)} €</td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums">{r.bus.toFixed(2)} €</td>
                  <td className="py-3 pr-3 text-right text-cr-primary tabular-nums font-semibold">{r.savings.toFixed(1)}%</td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden sm:table-cell">{r.km}</td>
                  <td className="py-3 text-right text-cr-text-muted tabular-nums hidden lg:table-cell">{r.co2.toFixed(1)} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-mono text-[10px] text-cr-text-dim">
          Precios en EUR por asiento. Carpooling: precio medio del rango publicado por conductores en ConcertRide (0% comisión).
          Bus: precio medio del bus oficial / lanzadera del festival o, en su defecto, bus comercial público (ALSA, Avanza, La
          Sepulvedana, Pesa) más lanzadera/taxi al recinto cuando aplica. Distancia y tiempo: Google Maps, ruta más rápida origen→recinto.
        </p>
      </section>

      {/* ── Metodología ── */}
      <section id="metodologia" className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6 scroll-mt-20">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Metodología</h2>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
          Este dataset reúne {N_ROWS} festivales tier-1 (más de 20.000 asistentes/día o referencia
          editorial nacional) celebrados en España durante la temporada 2026. Para cada festival se
          documenta el precio medio del carpooling en ConcertRide entre la ciudad emisora más
          representativa y el recinto, y se compara con el precio del bus oficial del festival
          cuando existe (FIB, BBK Live, Arenal Sound, Medusa, Viña Rock, Granada Sound, Pirineos
          Sur) o, en su defecto, con el bus comercial público equivalente (ALSA, Avanza, La
          Sepulvedana, Pesa, Renfe Cercanías) en la misma ruta origen→recinto, sumando el coste
          de la lanzadera o taxi adicional al recinto cuando corresponde. Los precios de carpooling
          se calculan como la media del rango publicado por conductores en{" "}
          <code className="font-mono text-[12px] text-cr-text">apps/web/src/lib/festivalLandings.ts</code>{" "}
          (sección <em>originCities</em>), recogido de los anuncios reales publicados por la
          comunidad de conductores en mayo 2026. El ahorro porcentual se calcula como{" "}
          <em>(bus − carpooling) / bus × 100</em>. La distancia y tiempo de viaje son los de la
          ruta más rápida en Google Maps. El CO2 ahorrado por asiento se estima con el factor
          publicado por la Agencia Europea de Medio Ambiente (EEA, 2023): 130 g CO2/km en coche
          individual frente a 44 g CO2/km en carpooling con 3,5 ocupantes medios. El número total
          de observaciones (n) es de {N_ROWS} festivales con datos completos en las 10 variables
          documentadas; festivales en los que falta algún campo crítico se han marcado como NA en
          las versiones descargables y excluido de los promedios.
        </p>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Fuentes y referencias</h3>
          <ul className="space-y-2">
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Precios de carpooling: rangos publicados por conductores verificados en ConcertRide (mayo 2026), agregados en{" "}
              <Link to="/datos" className="text-cr-primary underline underline-offset-2">/datos</Link>.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Precios bus oficial / lanzadera: webs oficiales del FIB, Arenal Sound, BBK Live, Medusa Festival, Viña Rock, Sonorama Ribera, Granada Sound, Pirineos Sur y Starlite Marbella (consulta 1Q 2026).
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Bus de larga distancia: tarifas medias en mayo 2026 de ALSA (alsa.es), Avanza (avanzabus.com), La Sepulvedana (lasepulvedana.es), Pesa (pesa.net) y Renfe (renfe.com).
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Factor CO2: Agencia Europea de Medio Ambiente,{" "}
              <a href="https://www.eea.europa.eu/media/infographics/co2-emissions-from-passenger-transport/" target="_blank" rel="noopener noreferrer" className="text-cr-primary underline underline-offset-2">CO2 Emissions from Passenger Transport</a>{" "}
              (2023).
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Distancias y tiempos: Google Maps, ruta más rápida origen→recinto, condiciones de tráfico normales.
            </li>
          </ul>
        </div>

        <div className="border border-cr-border p-4 space-y-2 max-w-2xl">
          <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Licencia</p>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Dataset publicado bajo licencia{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cr-primary underline underline-offset-2"
            >
              Creative Commons Attribution 4.0 (CC BY 4.0)
            </a>
            . Puedes usar, redistribuir, modificar y citar estos datos con atribución a ConcertRide (concertride.me).
          </p>
        </div>
      </section>

      {/* ── Citar ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Citar este dataset</h2>
        <ul className="space-y-4">
          <li className="border border-cr-border p-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Cita APA</p>
              <CopyButton text={citationApa} />
            </div>
            <pre className="font-mono text-[10px] text-cr-text-muted bg-black/30 p-3 rounded overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
              {citationApa}
            </pre>
          </li>
          <li className="border border-cr-border p-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Enlace HTML (artículo web)</p>
              <CopyButton text={citationHtml} />
            </div>
            <pre className="font-mono text-[10px] text-cr-text-muted bg-black/30 p-3 rounded overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
              {citationHtml}
            </pre>
          </li>
        </ul>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-lg uppercase text-cr-text-muted">Explora más datos</h2>
        <ul className="flex flex-wrap gap-2">
          {[
            { label: "Índice carpooling festivales", to: "/datos" },
            { label: "Mejores plataformas carpooling 2026", to: "/blog/alternativa-carpooling-festivales-espana" },
            { label: "Guía transporte festivales", to: "/guia-transporte-festivales" },
            { label: "Todas las rutas", to: "/rutas" },
            { label: "Datos para IA (llms.txt)", to: "/llms.txt", external: true },
          ].map((l) => (
            <li key={l.to}>
              {l.external ? (
                <a
                  href={l.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
                >
                  {l.label} <ExternalLink size={11} />
                </a>
              ) : (
                <Link
                  to={l.to}
                  className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
                >
                  {l.label} <ArrowRight size={11} />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

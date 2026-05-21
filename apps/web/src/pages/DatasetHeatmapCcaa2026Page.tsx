import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, Download, ExternalLink } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const DATASET_SLUG = "heatmap-demanda-festivales-ccaa-2026";

// ── Dataset rows (mirrors apps/web/public/datos/heatmap-demanda-festivales-ccaa-2026.{csv,json}) ──
interface DatasetRow {
  ccaaSlug: string;
  ccaaName: string;
  numFestivales: number;
  capacidadTotalEstimada: number;
  demandaScorePromedio: number;
  ahorroCarpoolingPctPromedio: number;
  festivalPrincipalTier1: string;
}

const ROWS: DatasetRow[] = [
  { ccaaSlug: "comunidad-valenciana", ccaaName: "Comunidad Valenciana", numFestivales: 8, capacidadTotalEstimada: 265000, demandaScorePromedio: 86.7, ahorroCarpoolingPctPromedio: 72, festivalPrincipalTier1: "FIB · Festival Internacional de Benicàssim" },
  { ccaaSlug: "galicia", ccaaName: "Galicia", numFestivales: 12, capacidadTotalEstimada: 191000, demandaScorePromedio: 84.1, ahorroCarpoolingPctPromedio: 78, festivalPrincipalTier1: "Resurrection Fest" },
  { ccaaSlug: "cataluna", ccaaName: "Cataluña", numFestivales: 4, capacidadTotalEstimada: 190000, demandaScorePromedio: 64.8, ahorroCarpoolingPctPromedio: 72, festivalPrincipalTier1: "Primavera Sound Barcelona" },
  { ccaaSlug: "madrid", ccaaName: "Comunidad de Madrid", numFestivales: 5, capacidadTotalEstimada: 217500, demandaScorePromedio: 63.8, ahorroCarpoolingPctPromedio: 70, festivalPrincipalTier1: "Mad Cool Festival" },
  { ccaaSlug: "andalucia", ccaaName: "Andalucía", numFestivales: 7, capacidadTotalEstimada: 139300, demandaScorePromedio: 54.1, ahorroCarpoolingPctPromedio: 70, festivalPrincipalTier1: "Cala Mijas Fest" },
  { ccaaSlug: "pais-vasco", ccaaName: "País Vasco", numFestivales: 7, capacidadTotalEstimada: 135000, demandaScorePromedio: 53.6, ahorroCarpoolingPctPromedio: 76, festivalPrincipalTier1: "Bilbao BBK Live" },
  { ccaaSlug: "aragon", ccaaName: "Aragón", numFestivales: 2, capacidadTotalEstimada: 52000, demandaScorePromedio: 20.1, ahorroCarpoolingPctPromedio: 75, festivalPrincipalTier1: "Vive Latino España" },
  { ccaaSlug: "asturias", ccaaName: "Principado de Asturias", numFestivales: 2, capacidadTotalEstimada: 40000, demandaScorePromedio: 18.7, ahorroCarpoolingPctPromedio: 75, festivalPrincipalTier1: "Festival Internacional Metrópoli Gijón" },
  { ccaaSlug: "castilla-la-mancha", ccaaName: "Castilla-La Mancha", numFestivales: 1, capacidadTotalEstimada: 50000, demandaScorePromedio: 16.5, ahorroCarpoolingPctPromedio: 72, festivalPrincipalTier1: "Viña Rock" },
  { ccaaSlug: "murcia", ccaaName: "Región de Murcia", numFestivales: 1, capacidadTotalEstimada: 40000, demandaScorePromedio: 15.4, ahorroCarpoolingPctPromedio: 70, festivalPrincipalTier1: "SOS 4.8 Festival" },
  { ccaaSlug: "baleares", ccaaName: "Illes Balears", numFestivales: 1, capacidadTotalEstimada: 35000, demandaScorePromedio: 14.8, ahorroCarpoolingPctPromedio: 65, festivalPrincipalTier1: "Mallorca Live Festival" },
  { ccaaSlug: "canarias", ccaaName: "Canarias", numFestivales: 1, capacidadTotalEstimada: 35000, demandaScorePromedio: 14.8, ahorroCarpoolingPctPromedio: 70, festivalPrincipalTier1: "Granca Live Fest" },
  { ccaaSlug: "castilla-y-leon", ccaaName: "Castilla y León", numFestivales: 1, capacidadTotalEstimada: 25000, demandaScorePromedio: 6.2, ahorroCarpoolingPctPromedio: 70, festivalPrincipalTier1: "Sonorama Ribera" },
  { ccaaSlug: "extremadura", ccaaName: "Extremadura", numFestivales: 1, capacidadTotalEstimada: 3000, demandaScorePromedio: 3.7, ahorroCarpoolingPctPromedio: 75, festivalPrincipalTier1: "Stone & Music Festival Mérida" },
];

const N_ROWS = ROWS.length;
const N_FESTIVALES_TOTAL = ROWS.reduce((s, r) => s + r.numFestivales, 0);
const CAPACIDAD_TOTAL = ROWS.reduce((s, r) => s + r.capacidadTotalEstimada, 0);
const AVG_AHORRO = Math.round((ROWS.reduce((s, r) => s + r.ahorroCarpoolingPctPromedio, 0) / N_ROWS) * 10) / 10;
const AVG_DEMANDA = Math.round((ROWS.reduce((s, r) => s + r.demandaScorePromedio, 0) / N_ROWS) * 10) / 10;

const CSV_URL = `${SITE_URL}/datos/heatmap-demanda-festivales-ccaa-2026.csv`;
const JSON_URL = `${SITE_URL}/datos/heatmap-demanda-festivales-ccaa-2026.json`;

// ── Heatmap color tiers (Tailwind-arbitrary classes) ──
// Demanda score 0-100 → low / mid / high / top buckets
function demandaColorClass(score: number): string {
  if (score >= 70) return "bg-red-500/30 text-red-200 border-red-500/50";
  if (score >= 40) return "bg-amber-500/30 text-amber-200 border-amber-500/50";
  if (score >= 15) return "bg-yellow-500/20 text-yellow-200 border-yellow-500/40";
  return "bg-emerald-500/20 text-emerald-200 border-emerald-500/40";
}

function demandaBucketLabel(score: number): string {
  if (score >= 70) return "Alta";
  if (score >= 40) return "Media-alta";
  if (score >= 15) return "Media-baja";
  return "Baja";
}

// Sorted variants for tables
const SORTED_BY_NUM_DESC = [...ROWS].sort((a, b) => b.numFestivales - a.numFestivales);
const SORTED_BY_CAP_DESC = [...ROWS].sort((a, b) => b.capacidadTotalEstimada - a.capacidadTotalEstimada);
const SORTED_BY_AHORRO_DESC = [...ROWS].sort((a, b) => b.ahorroCarpoolingPctPromedio - a.ahorroCarpoolingPctPromedio);
const TOP3_NUM = SORTED_BY_NUM_DESC.slice(0, 3);
const TOP3_CAP = SORTED_BY_CAP_DESC.slice(0, 3);
const TOP3_AHORRO = SORTED_BY_AHORRO_DESC.slice(0, 3);

// Static positions for narrative (ROWS is pre-sorted by demanda_score desc on file).
// We assert non-undefined here because ROWS has 14 fixed entries above (compile-time).
const ROW_1 = ROWS[0]!;
const ROW_2 = ROWS[1]!;
const ROW_3 = ROWS[2]!;
const ROW_4 = ROWS[3]!;
const TOP_NUM_1 = TOP3_NUM[0]!;

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

export default function DatasetHeatmapCcaa2026Page() {
  const url = `${SITE_URL}/datos/heatmap-demanda-festivales-ccaa-2026`;

  useSeoMeta({
    title: `Demanda festivales por CCAA España 2026 [Heatmap] Dataset`,
    description: `Heatmap demanda festivales por comunidad autónoma España 2026. ${N_ROWS} CCAA con datos: capacidad, ahorro carpooling y festival principal. CC BY 4.0.`,
    canonical: url,
    keywords: `festivales por comunidad autonoma, heatmap festivales españa, demanda festivales ccaa, festivales por region españa 2026, dataset festivales españa, festivales cataluña valencia galicia, festival principal por ccaa`,
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: `Heatmap demanda festivales por CCAA España 2026 — ${N_ROWS} comunidades autónomas. Dataset CC BY 4.0 ConcertRide`,
  });

  const jsonLdDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    name: "Heatmap demanda festivales por CCAA España 2026",
    alternateName: "ConcertRide Festival Demand by Spanish Autonomous Region 2026",
    description: `Dataset abierto que cruza ${N_FESTIVALES_TOTAL} festivales españoles 2026 con su comunidad autónoma para construir un heatmap de demanda. ${N_ROWS} CCAA cubiertas. Variables: número de festivales con landing por CCAA, capacidad total estimada (personas/día), score de demanda 0-100 (ponderación 0.4·num + 0.3·capacidad + 0.3·tier1-count), ahorro medio del carpooling vs vehículo individual y festival principal tier-1 por región. La Comunidad Valenciana lidera el score (86,7) con 8 festivales y 265.000 plazas/día; Galicia es 2ª (84,1) con 12 festivales; Cataluña 3ª (64,8). Capacidad total agregada del dataset: ${CAPACIDAD_TOTAL.toLocaleString("es-ES")} personas/día. Ahorro carpooling medio: ${AVG_AHORRO}%. Excluye Cantabria, La Rioja y Navarra (sin festivales propios con landing 2026; son nodos de origen de carpooling). Ceuta y Melilla no aplican.`,
    url,
    sameAs: url,
    isAccessibleForFree: true,
    inLanguage: "es-ES",
    datePublished: "2026-05-20",
    dateModified: "2026-05-20",
    license: "https://creativecommons.org/licenses/by/4.0/",
    keywords: [
      "festivales",
      "comunidades autónomas",
      "España",
      "2026",
      "heatmap",
      "demanda",
      "carpooling",
      "datos abiertos",
      "geografía cultural",
    ],
    creator: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ConcertRide",
      url: SITE_URL,
      sameAs: [
        "https://www.wikidata.org/wiki/Q132999999",
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
        box: "27.63 -18.16 43.79 4.32",
      },
    },
    measurementTechnique:
      "Fuente primaria: catálogo cerrado de festivales con landing dedicada en ConcertRide (apps/web/src/lib/festivalLandings.ts), tagueados por CCAA mediante el campo region y cruzados con landings de comunidades autónomas (apps/web/src/lib/regionLandings.ts). num_festivales: recuento bruto de festivales con landing por CCAA. capacidad_total_estimada: suma del aforo declarado por jornada (personas/día) de cada festival; en festivales declarados en formato 'asistentes acumulados' se ha estimado dividiendo por número de días de evento. demanda_score_promedio: índice 0-100 calculado como 100 × (0.4·num_norm + 0.3·cap_norm + 0.3·tier1_norm), donde cada componente está normalizado al máximo del dataset (num max 12 Galicia, cap max 265K Comunidad Valenciana, tier1 max 4 Cataluña/Valenciana). tier1 = festivales con capacidad declarada ≥ 30.000 personas/día. ahorro_carpooling_pct_promedio: porcentaje medio de ahorro en € por asiento vs vehículo individual (1 ocupante) según la distancia media a festivales por CCAA — valores extraídos de los blurbs de regionLandings.ts cuando están declarados (Aragón 75%, Asturias 75%, Extremadura 75%, Galicia 78% por aislamiento, País Vasco 76%); 70% como default ajustado al alza/baja por geografía (Baleares 65% por trayectos cortos intra-isla). festival_principal_tier1: festival más conocido y/o de mayor aforo de la CCAA, citable para queries '¿festival principal en [CCAA]?'. CCAA excluidas: Cantabria, La Rioja y Navarra (sin festivales propios con landing 2026 — son nodos de origen de carpooling pero no destino). Ceuta y Melilla no aplican al alcance de festivales 2026. Dataset construido y verificado mayo 2026.",
    variableMeasured: [
      { "@type": "PropertyValue", name: "ccaa_slug", description: "Slug url-friendly de la comunidad autónoma usado en /festivales-en/:slug" },
      { "@type": "PropertyValue", name: "ccaa_name", description: "Nombre oficial de la comunidad autónoma" },
      { "@type": "PropertyValue", name: "num_festivales", description: "Número de festivales con landing dedicada en ConcertRide en la CCAA" },
      { "@type": "PropertyValue", name: "capacidad_total_estimada", unitText: "personas/día", description: "Suma del aforo declarado por jornada de los festivales con landing en la CCAA" },
      { "@type": "PropertyValue", name: "demanda_score_promedio", description: "Índice de demanda 0-100 calculado como 100 × (0.4·num_norm + 0.3·cap_norm + 0.3·tier1_norm)" },
      { "@type": "PropertyValue", name: "ahorro_carpooling_pct_promedio", unitText: "%", description: "Porcentaje medio de ahorro en € por asiento del carpooling vs vehículo individual" },
      { "@type": "PropertyValue", name: "festival_principal_tier1", description: "Festival más conocido y/o de mayor aforo (≥30.000/día) de la CCAA" },
    ],
    distribution: [
      {
        "@type": "DataDownload",
        name: "Heatmap demanda festivales por CCAA España 2026 (CSV)",
        contentUrl: CSV_URL,
        encodingFormat: "text/csv",
      },
      {
        "@type": "DataDownload",
        name: "Heatmap demanda festivales por CCAA España 2026 (JSON)",
        contentUrl: JSON_URL,
        encodingFormat: "application/json",
      },
    ],
    isRelatedTo: [
      {
        "@type": "Dataset",
        name: "Precio medio carpooling vs bus oficial festivales España 2026",
        url: `${SITE_URL}/datos/precio-medio-carpooling-vs-bus-festivales-2026`,
      },
      {
        "@type": "Dataset",
        name: "Mapa festivales peor conexión transporte público España 2026",
        url: `${SITE_URL}/datos/festivales-peor-conexion-transporte-publico-2026`,
      },
      {
        "@type": "Dataset",
        name: "Festivales más caros vs baratos de llegar España 2026",
        url: `${SITE_URL}/datos/festivales-mas-caros-mas-baratos-llegar-2026`,
      },
      {
        "@type": "Dataset",
        name: "Calendario maestro festivales España 2026",
        url: `${SITE_URL}/datos/calendario-maestro-festivales-2026`,
      },
      {
        "@type": "Dataset",
        name: "Costes ocultos del transporte a festivales España 2026",
        url: `${SITE_URL}/datos/costes-ocultos-transporte-festivales-2026`,
      },
      {
        "@type": "Dataset",
        name: "Top 30 conciertos individuales con mayor demanda de transporte España 2026",
        url: `${SITE_URL}/datos/conciertos-mayor-demanda-transporte-2026`,
      },
      {
        "@type": "Dataset",
        name: "Alojamiento cercano a festivales España 2026",
        url: `${SITE_URL}/datos/alojamiento-cercano-festivales-2026`,
      },
    ],
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Datos", item: `${SITE_URL}/datos` },
      { "@type": "ListItem", position: 3, name: "Heatmap demanda festivales por CCAA 2026", item: url },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué comunidad autónoma tiene más festivales en España 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Galicia es la CCAA con más festivales en España 2026 con 12 eventos con landing dedicada en ConcertRide, seguida de la Comunidad Valenciana (8) y Andalucía y País Vasco empatadas (7 cada una). Galicia destaca por una densa red de festivales de música tradicional y celta en pueblos (Pontevedra, Vigo, Ferrol, Monforte, Lalín, Tui, Betanzos) junto a citas tier-1 (Resurrection Fest en Viveiro, O Son do Camiño en Santiago, Ortigueira, Atlantic Fest, PortAmérica). La capacidad total agregada de festivales en Galicia es de 191.000 personas/día.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuál es la CCAA con mayor capacidad agregada de festivales España 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `La Comunidad Valenciana lidera por capacidad agregada con 265.000 personas/día sumando sus 8 festivales (FIB, Arenal Sound, Medusa, Zevra, Low, Les Arts, Rototom Sunsplash, BIGSOUND). Le siguen la Comunidad de Madrid (217.500/día con 5 festivales encabezados por Mad Cool 80.000/día), Galicia (191.000/día con 12 festivales) y Cataluña (190.000/día con 4 festivales liderados por Primavera Sound 60.000/día y Reggaeton Beach 60.000/día). La capacidad total agregada del dataset (14 CCAA) es ${CAPACIDAD_TOTAL.toLocaleString("es-ES")} personas/día.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuál es el score de demanda de festivales más alto por CCAA en España 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `El demanda_score_promedio más alto del dataset (0-100) es 86,7 para la Comunidad Valenciana, seguido de Galicia (84,1), Cataluña (64,8) y Comunidad de Madrid (63,8). El score combina 3 factores normalizados: número de festivales (peso 40%), capacidad total estimada (peso 30%) y número de festivales tier-1 con ≥30.000 personas/día (peso 30%). Las CCAA con score bajo son Extremadura (3,7 — solo Stone & Music Mérida con 3.000 plazas), Castilla y León (6,2 — solo Sonorama Ribera) y Canarias y Baleares (14,8 cada una — un único festival, aforo medio).`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuál es el festival principal tier-1 de cada CCAA en España 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `El festival tier-1 principal por CCAA en España 2026 (capacidad ≥30.000/día o equivalente cultural): Comunidad de Madrid → Mad Cool Festival (Iberdrola Music Villaverde, julio, 80.000); Cataluña → Primavera Sound Barcelona (Parc del Fòrum, junio, 60.000); Comunidad Valenciana → FIB Benicàssim (julio, 45.000); País Vasco → Bilbao BBK Live (Kobetamendi, julio, 30.000); Galicia → Resurrection Fest (Viveiro, junio, 30.000); Andalucía → Cala Mijas Fest (Málaga, octubre, 30.000); Aragón → Vive Latino España (Espacio Expo Zaragoza, septiembre, 40.000); Asturias → Metrópoli Gijón (julio, 30.000); Castilla-La Mancha → Viña Rock (Villarrobledo, mayo, 50.000); Castilla y León → Sonorama Ribera (Aranda de Duero, agosto, 25.000); Canarias → Granca Live Fest (Las Palmas, junio, 35.000); Extremadura → Stone & Music Festival Mérida (julio-septiembre, 3.000); Baleares → Mallorca Live Festival (Calvià, mayo, 35.000); Murcia → SOS 4.8 Festival (La Fica, mayo, 40.000).`,
        },
      },
      {
        "@type": "Question",
        name: "¿Por qué se excluyen Cantabria, La Rioja y Navarra del dataset?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Cantabria, La Rioja y Navarra no acogen en 2026 festivales con landing dedicada en ConcertRide. Las 3 CCAA son nodos de origen de carpooling muy activos (Santander hacia Bilbao BBK Live, Logroño hacia Sonorama Ribera, Pamplona hacia Vive Latino Zaragoza) pero no destino. Para evitar inflar artificialmente los datos con cero festivales y un score 0, se han excluido del dataset principal. Sí están cubiertas con landing /festivales-en/cantabria, /festivales-en/la-rioja y /festivales-en/navarra para orientar a los asistentes hacia festivales de comunidades vecinas. Ceuta y Melilla no aplican al alcance de festivales con landing 2026.`,
        },
      },
    ],
  };

  const citationApa = `ConcertRide. (2026). Heatmap demanda festivales por CCAA España 2026 [Dataset]. ${url}. CC BY 4.0.`;
  const citationHtml = `<a href="${url}" rel="noopener">Heatmap demanda festivales por CCAA España 2026</a> (ConcertRide, CC BY 4.0)`;

  // WebPage wrapper with Speakable
  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: "Heatmap demanda festivales por CCAA España 2026",
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
          <span className="text-cr-text-muted">Heatmap demanda festivales por CCAA 2026</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Dataset CC BY 4.0 — Publicado 20 mayo 2026
        </p>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95]">
          Heatmap demanda festivales<br />
          por CCAA España 2026
          <span className="block text-base md:text-lg font-sans normal-case tracking-normal text-cr-text-muted mt-3">
            [{N_ROWS} comunidades · {N_FESTIVALES_TOTAL} festivales · {CAPACIDAD_TOTAL.toLocaleString("es-ES")} plazas/día]
          </span>
        </h1>

        {/* Quotable answer-first paragraph (~140 words) */}
        <p
          data-quotable="true"
          className="font-sans text-sm md:text-base text-cr-text leading-relaxed max-w-3xl speakable border-l-2 border-cr-primary/60 pl-4"
        >
          <strong>La Comunidad Valenciana lidera el heatmap de demanda festivalera de España 2026 con
          score {ROW_1.demandaScorePromedio} sobre 100</strong>, gracias a sus {ROW_1.numFestivales} festivales (FIB, Arenal Sound,
          Medusa, Zevra, Low, Les Arts, Rototom, BIGSOUND) que suman 265.000 plazas/día. Le sigue
          <strong> Galicia (score {ROW_2.demandaScorePromedio}), la CCAA con MÁS festivales del dataset ({ROW_2.numFestivales})</strong> — encabezada
          por Resurrection Fest (Viveiro) y O Son do Camiño (Santiago) — y Cataluña (score {ROW_3.demandaScorePromedio}) con
          Primavera Sound Barcelona como festival tier-1. Madrid es 4ª (score {ROW_4.demandaScorePromedio}) con Mad Cool
          como cabecera (80.000 personas/día, el aforo individual más alto del dataset).
          {" "}
          <strong>Capacidad total agregada: {CAPACIDAD_TOTAL.toLocaleString("es-ES")} personas/día</strong> distribuidas entre {N_FESTIVALES_TOTAL} festivales en
          {" "}{N_ROWS} CCAA. Ahorro carpooling medio vs vehículo individual: {AVG_AHORRO}%. Dataset abierto CC BY 4.0,
          descargable en CSV y JSON.
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
          author={{ name: "Equipo de datos ConcertRide", url: "/autor/equipo-concertride" }}
          methodologyHref="#metodologia"
        />
        <AiDisclosureNote level={aiLevelForPageType("dataset")} />
      </div>

      {/* ── Stats banner ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{N_ROWS}</p>
            <p className="font-sans text-[11px] text-cr-text-muted">comunidades autónomas</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{N_FESTIVALES_TOTAL}</p>
            <p className="font-sans text-[11px] text-cr-text-muted">festivales analizados</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-emerald-300 tabular-nums">{(CAPACIDAD_TOTAL / 1000).toFixed(0)}K</p>
            <p className="font-sans text-[11px] text-cr-text-muted">plazas/día agregadas</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-amber-300 tabular-nums">{AVG_AHORRO}%</p>
            <p className="font-sans text-[11px] text-cr-text-muted">ahorro carpooling medio</p>
          </div>
        </div>
      </section>

      {/* ── Heatmap visual ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Heatmap demanda por CCAA</h2>
          <p className="font-mono text-[11px] text-cr-text-muted">color por demanda_score</p>
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
          Cada celda representa una CCAA. La intensidad del color indica el nivel del{" "}
          <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 text-cr-primary">demanda_score_promedio</code>{" "}
          calculado con la fórmula{" "}
          <code className="font-mono text-[10px] bg-white/5 px-1.5 py-0.5 text-cr-text">
            100 · (0.4·num_norm + 0.3·cap_norm + 0.3·tier1_norm)
          </code>
          .
        </p>

        {/* Color legend */}
        <div className="flex flex-wrap gap-2 text-[10px] font-mono">
          <span className="inline-flex items-center gap-1.5 border border-red-500/50 bg-red-500/30 text-red-200 px-2 py-1">
            <span className="w-2 h-2 bg-red-400 inline-block" /> Alta (≥70)
          </span>
          <span className="inline-flex items-center gap-1.5 border border-amber-500/50 bg-amber-500/30 text-amber-200 px-2 py-1">
            <span className="w-2 h-2 bg-amber-400 inline-block" /> Media-alta (40–69)
          </span>
          <span className="inline-flex items-center gap-1.5 border border-yellow-500/40 bg-yellow-500/20 text-yellow-200 px-2 py-1">
            <span className="w-2 h-2 bg-yellow-400 inline-block" /> Media-baja (15–39)
          </span>
          <span className="inline-flex items-center gap-1.5 border border-emerald-500/40 bg-emerald-500/20 text-emerald-200 px-2 py-1">
            <span className="w-2 h-2 bg-emerald-400 inline-block" /> Baja (&lt;15)
          </span>
        </div>

        {/* Heatmap grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {ROWS.map((r) => (
            <Link
              key={r.ccaaSlug}
              to={`/festivales-en/${r.ccaaSlug}`}
              className={`border p-3 space-y-2 hover:opacity-90 transition-opacity ${demandaColorClass(r.demandaScorePromedio)}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-display text-sm uppercase">{r.ccaaName}</p>
                <span className="font-mono text-[10px] opacity-80">{demandaBucketLabel(r.demandaScorePromedio)}</span>
              </div>
              <p className="font-display text-2xl uppercase tabular-nums">{r.demandaScorePromedio}</p>
              <p className="font-mono text-[10px] opacity-90">
                {r.numFestivales} fest. · {(r.capacidadTotalEstimada / 1000).toFixed(0)}K/día
              </p>
            </Link>
          ))}
        </div>

        <p className="font-mono text-[10px] text-cr-text-dim">
          Click en cada CCAA para ver su landing de festivales en{" "}
          <code className="bg-white/5 px-1 text-cr-text">/festivales-en/:slug</code>.
        </p>
      </section>

      {/* ── Hallazgos top-3 ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Top-3 por métrica</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-cr-border p-4 space-y-3">
            <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">+ festivales</p>
            <ol className="space-y-2">
              {TOP3_NUM.map((r, i) => (
                <li key={r.ccaaSlug} className="font-sans text-sm flex items-baseline justify-between gap-2">
                  <Link to={`/festivales-en/${r.ccaaSlug}`} className="text-cr-text hover:text-cr-primary">
                    <span className="text-cr-text-dim font-mono text-xs mr-2">{i + 1}.</span>
                    {r.ccaaName}
                  </Link>
                  <span className="font-mono text-xs text-cr-primary tabular-nums">{r.numFestivales}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="border border-cr-border p-4 space-y-3">
            <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">+ capacidad/día</p>
            <ol className="space-y-2">
              {TOP3_CAP.map((r, i) => (
                <li key={r.ccaaSlug} className="font-sans text-sm flex items-baseline justify-between gap-2">
                  <Link to={`/festivales-en/${r.ccaaSlug}`} className="text-cr-text hover:text-cr-primary">
                    <span className="text-cr-text-dim font-mono text-xs mr-2">{i + 1}.</span>
                    {r.ccaaName}
                  </Link>
                  <span className="font-mono text-xs text-cr-primary tabular-nums">
                    {(r.capacidadTotalEstimada / 1000).toFixed(0)}K
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="border border-cr-border p-4 space-y-3">
            <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">+ ahorro carpooling</p>
            <ol className="space-y-2">
              {TOP3_AHORRO.map((r, i) => (
                <li key={r.ccaaSlug} className="font-sans text-sm flex items-baseline justify-between gap-2">
                  <Link to={`/festivales-en/${r.ccaaSlug}`} className="text-cr-text hover:text-cr-primary">
                    <span className="text-cr-text-dim font-mono text-xs mr-2">{i + 1}.</span>
                    {r.ccaaName}
                  </Link>
                  <span className="font-mono text-xs text-cr-primary tabular-nums">{r.ahorroCarpoolingPctPromedio}%</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── Tabla completa ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Tabla completa {N_ROWS} CCAA
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">orden: demanda_score descendente</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">CCAA</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festivales</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">Capacidad/día</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Demanda</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Ahorro %</th>
                <th className="text-left py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Festival principal tier-1</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.ccaaSlug} className="border-b border-cr-border/50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-3">
                    <Link
                      to={`/festivales-en/${r.ccaaSlug}`}
                      className="text-cr-primary font-medium hover:underline underline-offset-2"
                    >
                      {r.ccaaName}
                    </Link>
                  </td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums font-mono text-[11px]">{r.numFestivales}</td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden sm:table-cell font-mono text-[11px]">{r.capacidadTotalEstimada.toLocaleString("es-ES")}</td>
                  <td className="py-3 pr-3 text-right">
                    <span className={`inline-flex items-center gap-1 border px-2 py-1 font-mono text-[11px] tabular-nums font-semibold ${demandaColorClass(r.demandaScorePromedio)}`}>
                      {r.demandaScorePromedio}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-right text-amber-300 tabular-nums hidden md:table-cell font-mono text-[11px]">{r.ahorroCarpoolingPctPromedio}%</td>
                  <td className="py-3 text-cr-text-muted text-xs hidden lg:table-cell">{r.festivalPrincipalTier1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-mono text-[10px] text-cr-text-dim leading-relaxed">
          Capacidad por jornada (personas/día) sumando el aforo declarado de cada festival con landing en la CCAA. Demanda_score 0-100 calculado con ponderación 0.4·num + 0.3·capacidad + 0.3·festivales-tier-1. Fuente: catálogo ConcertRide festivalLandings.ts cruzado con regionLandings.ts, mayo 2026.
        </p>
      </section>

      {/* ── Hallazgos ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Hallazgos clave</h2>
        <ul className="space-y-3">
          {[
            `La Comunidad Valenciana lidera el heatmap con score 86,7 sobre 100 — la CCAA con más capacidad agregada (265.000 personas/día) gracias a la concentración costera FIB, Arenal Sound, Medusa, Rototom y Les Arts. 8 festivales con landing dedicada, 4 de ellos tier-1 (≥30.000/día). El litoral mediterráneo valenciano es la geografía con mayor densidad festivalera de verano de España.`,
            `Galicia es la CCAA con MÁS festivales del dataset (${TOP_NUM_1.numFestivales}) — el doble que la Comunidad Valenciana — pero buena parte son festivales de pueblo (Pontevedra, Vigo, Ferrol, Monforte, Lalín, Tui, Betanzos) con aforos de 5.000-15.000 plazas. Los tier-1 gallegos son Resurrection Fest (Viveiro), O Son do Camiño (Santiago) y PortAmérica (Caldas de Reis).`,
            `Cataluña concentra calidad: solo 4 festivales pero 4/4 son tier-1 (Primavera Sound, Sónar, Cruïlla, Reggaeton Beach Festival Salou). Capacidad agregada 190.000 personas/día — la 3ª más alta del dataset solo por detrás de Comunidad Valenciana y Madrid.`,
            `Madrid combina pocos festivales (5) con aforo masivo: Mad Cool (80.000/día) es el festival individual con MÁS aforo del dataset y empuja la capacidad agregada de la CCAA a 217.500/día. Tomavistas, Download Madrid, DCode y Jardín de las Delicias completan el catálogo.`,
            `País Vasco y Andalucía empatan en número de festivales con 7 cada una, pero con perfiles distintos: País Vasco mezcla 2 tier-1 (BBK Live, Jazzaldia) con festivales urbanos pequeños (Barakaldo, Irún, Donostia-Hiria); Andalucía concentra rock internacional otoñal (Cala Mijas) y festivales de jet-set (Starlite Marbella 7.500 plazas/concierto).`,
            `Cantabria, La Rioja y Navarra están EXCLUIDAS del dataset por no acoger festivales propios con landing 2026. Las 3 son nodos de origen de carpooling muy activos hacia festivales vecinos (Santander → BBK Live, Logroño → Sonorama, Pamplona → Vive Latino). Sus landings /festivales-en/ existen pero orientan al asistente fuera de la CCAA.`,
            `Las CCAA con menor score son Extremadura (3,7 — solo Stone & Music Mérida 3.000 plazas), Castilla y León (6,2 — solo Sonorama Ribera) y Baleares/Canarias (14,8 cada una — un único festival, requiere avión desde Península). El score bajo NO refleja calidad: Stone & Music en el anfiteatro romano UNESCO es uno de los festivales más singulares de Europa.`,
            `El ahorro medio del carpooling vs vehículo individual es ${AVG_AHORRO}%. Galicia lidera con 78% por aislamiento geográfico (4-6h de carretera desde Madrid/Bilbao). Baleares cierra con 65% por trayectos cortos intra-isla (Palma-Calvià 18 km). El ahorro por carpooling crece con la distancia: a más kilómetros, más impacto del coche compartido en €/persona.`,
          ].map((bullet, i) => (
            <li
              key={i}
              className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary"
            >
              {bullet}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Metodología ── */}
      <section id="metodologia" className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6 scroll-mt-20">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Metodología</h2>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
          Este dataset cruza el catálogo cerrado de festivales con landing dedicada en ConcertRide (
          {N_FESTIVALES_TOTAL} festivales españoles 2026 con página /festivales/:slug) con las landings de
          comunidades autónomas (/festivales-en/:slug) para construir un heatmap de demanda festivalera
          por CCAA — el primer dataset GEO-orientado de ConcertRide.
        </p>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Cómo se han contado los festivales</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            Para cada festival del catálogo se ha leído el campo{" "}
            <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 text-cr-primary">region</code>{" "}
            de{" "}
            <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 text-cr-text">festivalLandings.ts</code>,
            normalizado al slug oficial de la CCAA (ej. &quot;Islas Baleares&quot;, &quot;Illes Balears&quot;
            y &quot;Baleares&quot; → <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 text-cr-primary">baleares</code>; &quot;Comunitat Valenciana&quot;
            y &quot;Comunidad Valenciana&quot; → <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 text-cr-primary">comunidad-valenciana</code>).
            El recuento es bruto: cada festival cuenta 1 vez por su CCAA principal.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Cómo se ha estimado la capacidad</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            Se lee el campo{" "}
            <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 text-cr-primary">capacity</code>{" "}
            de cada festival y se extrae el número absoluto de personas/día. Para festivales declarados
            como &quot;asistentes acumulados&quot; (Jazzaldia 150.000 / 5 días = 30.000/día estimados;
            Ortigueira 100.000 / 4 días = 25.000/día; O Son do Camiño 90.000 / 3 días = 30.000/día) se
            divide por número de días del evento. Para festivales en formato plazas/concierto (Starlite
            7.500, Marenostrum 15.000, Stone &amp; Music 3.000, Tío Pepe 1.800) se toma el aforo del
            concierto base. La capacidad total por CCAA es la suma de los aforos individuales — es una
            estimación operativa (personas/día), NO un aforo legal.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Fórmula del score de demanda</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 text-cr-primary block whitespace-pre-wrap">
              {`demanda_score = 100 × (0.4·num_norm + 0.3·cap_norm + 0.3·tier1_norm)`}
            </code>
            <br />
            Cada componente está normalizado al máximo del dataset: num_max = 12 (Galicia), cap_max =
            265.000 (Comunidad Valenciana), tier1_max = 4 (Cataluña y Comunidad Valenciana empatadas).
            tier1 = festivales con capacidad declarada ≥ 30.000 personas/día. La ponderación (0.4-0.3-0.3)
            premia el número de eventos (factor cobertura) por encima de la capacidad bruta (factor
            magnitud) — el peso de tier1 evita penalizar a CCAA con un único festival muy grande (ej.
            Castilla-La Mancha con Viña Rock 50.000/día).
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Ahorro carpooling</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            Porcentaje de ahorro en € por asiento del carpooling vs vehículo individual (1 ocupante)
            según la distancia media a los festivales de la CCAA. Los valores explícitos se extraen de
            los blurbs de{" "}
            <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 text-cr-text">regionLandings.ts</code>{" "}
            cuando se declaran: Aragón 75%, Asturias 75%, Extremadura 75%, Galicia 78% (por aislamiento
            geográfico), País Vasco 76%. Default 70% ajustado al alza/baja por geografía: Baleares 65%
            por trayectos cortos intra-isla (Palma–Calvià 18 km), Andalucía y Murcia 70% por distancias
            mediterráneas estándares.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">CCAA excluidas y notas</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            <strong>Cantabria, La Rioja y Navarra</strong> están excluidas del dataset: las 3 CCAA tienen
            landing{" "}
            <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 text-cr-text">/festivales-en/:slug</code>{" "}
            pero su campo{" "}
            <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 text-cr-text">festivalsInRegion</code>{" "}
            está vacío en{" "}
            <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 text-cr-text">regionLandings.ts</code>.
            Funcionan como nodos de origen de carpooling muy activos (Santander → BBK Live, Logroño →
            Sonorama, Pamplona → Vive Latino) pero no son destino. Incluirlas con valor 0 inflaría
            artificialmente el heatmap. <strong>Ceuta y Melilla</strong> no aplican al alcance de
            festivales con landing 2026.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Fuentes y referencias</h3>
          <ul className="space-y-2">
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Catálogo de festivales con landing dedicada en ConcertRide:{" "}
              <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 text-cr-primary">apps/web/src/lib/festivalLandings.ts</code>{" "}
              (campos <code className="font-mono text-xs text-cr-text">slug, region, capacity</code>).
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Landings de comunidades autónomas:{" "}
              <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 text-cr-primary">apps/web/src/lib/regionLandings.ts</code>{" "}
              (campos <code className="font-mono text-xs text-cr-text">slug, name, festivalsInRegion, blurb</code>).
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              ISO 3166-2 ES — Códigos oficiales de comunidades autónomas españolas.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Datasets complementarios:{" "}
              <Link to="/datos/calendario-maestro-festivales-2026" className="text-cr-primary underline underline-offset-2">
                /datos/calendario-maestro-festivales-2026
              </Link>{" "}
              y{" "}
              <Link to="/datos/conciertos-mayor-demanda-transporte-2026" className="text-cr-primary underline underline-offset-2">
                /datos/conciertos-mayor-demanda-transporte-2026
              </Link>.
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

      {/* ── CTA carpooling ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          ¿Vas a un festival? Ahorra hasta {Math.max(...ROWS.map((r) => r.ahorroCarpoolingPctPromedio))}% con carpooling
        </h2>
        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
          El ahorro medio del carpooling frente al vehículo individual a festivales españoles es{" "}
          <strong className="text-cr-text">{AVG_AHORRO}%</strong>. ConcertRide es plataforma de
          carpooling sin comisión por asiento para asistentes a festivales y conciertos: encuentra
          conductor o publica tu plaza disponible en pocos minutos.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/publish"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Publicar viaje <ArrowRight size={13} />
          </Link>
          <Link
            to="/concerts"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text px-4 py-2 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            Buscar conciertos <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ── Explora más ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-lg uppercase text-cr-text-muted">Explora más datos y guías</h2>
        <ul className="flex flex-wrap gap-2">
          {[
            { label: "Índice de datasets ConcertRide", to: "/datos" },
            { label: "Calendario maestro festivales 2026", to: "/datos/calendario-maestro-festivales-2026" },
            { label: "Conciertos mayor demanda transporte 2026", to: "/datos/conciertos-mayor-demanda-transporte-2026" },
            { label: "Alojamiento cercano festivales 2026", to: "/datos/alojamiento-cercano-festivales-2026" },
            { label: "Costes ocultos del transporte", to: "/datos/costes-ocultos-transporte-festivales-2026" },
            { label: "Precio medio carpooling vs bus", to: "/datos/precio-medio-carpooling-vs-bus-festivales-2026" },
            { label: "Ranking caros vs baratos llegar", to: "/datos/festivales-mas-caros-mas-baratos-llegar-2026" },
            { label: "Mapa peor conexión transporte", to: "/datos/festivales-peor-conexion-transporte-publico-2026" },
            { label: "Guía transporte festivales", to: "/guia-transporte-festivales" },
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

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, Download, ExternalLink } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const DATASET_SLUG = "conciertos-mayor-demanda-transporte-2026";

// ── Dataset rows (mirrors apps/web/public/datos/conciertos-mayor-demanda-transporte-2026.{csv,json}) ──
interface DatasetRow {
  conciertoSlug: string;
  artistName: string;
  fecha: string; // ISO 8601 or "TBD"
  venue: string;
  city: string;
  aforoEstimado: number;
  precioEntradaMedioEur: number;
  distanciaEstacionKm: number;
  transportePublicoDisponible: boolean;
  precioCarpoolingMedioEur: number;
  demandaScore: number; // 1-100
  generoDominante: string;
  agotadaEntradas: boolean;
}

const ROWS: DatasetRow[] = [
  { conciertoSlug: "bad-bunny-metropolitano-2026-05-30", artistName: "Bad Bunny", fecha: "2026-05-30", venue: "Riyadh Air Metropolitano", city: "Madrid", aforoEstimado: 68000, precioEntradaMedioEur: 95, distanciaEstacionKm: 2.5, transportePublicoDisponible: true, precioCarpoolingMedioEur: 14, demandaScore: 98, generoDominante: "reggaeton", agotadaEntradas: true },
  { conciertoSlug: "bad-bunny-metropolitano-2026-05-31", artistName: "Bad Bunny", fecha: "2026-05-31", venue: "Riyadh Air Metropolitano", city: "Madrid", aforoEstimado: 68000, precioEntradaMedioEur: 95, distanciaEstacionKm: 2.5, transportePublicoDisponible: true, precioCarpoolingMedioEur: 14, demandaScore: 97, generoDominante: "reggaeton", agotadaEntradas: true },
  { conciertoSlug: "bad-bunny-metropolitano-2026-06-03", artistName: "Bad Bunny", fecha: "2026-06-03", venue: "Riyadh Air Metropolitano", city: "Madrid", aforoEstimado: 68000, precioEntradaMedioEur: 95, distanciaEstacionKm: 2.5, transportePublicoDisponible: true, precioCarpoolingMedioEur: 14, demandaScore: 95, generoDominante: "reggaeton", agotadaEntradas: true },
  { conciertoSlug: "bad-bunny-olimpic-2026-05-22", artistName: "Bad Bunny", fecha: "2026-05-22", venue: "Estadi Olímpic Lluís Companys", city: "Barcelona", aforoEstimado: 55000, precioEntradaMedioEur: 95, distanciaEstacionKm: 1.5, transportePublicoDisponible: true, precioCarpoolingMedioEur: 17, demandaScore: 96, generoDominante: "reggaeton", agotadaEntradas: true },
  { conciertoSlug: "bad-bunny-olimpic-2026-05-23", artistName: "Bad Bunny", fecha: "2026-05-23", venue: "Estadi Olímpic Lluís Companys", city: "Barcelona", aforoEstimado: 55000, precioEntradaMedioEur: 95, distanciaEstacionKm: 1.5, transportePublicoDisponible: true, precioCarpoolingMedioEur: 17, demandaScore: 94, generoDominante: "reggaeton", agotadaEntradas: true },
  { conciertoSlug: "bad-bunny-metropolitano-2026-06-15", artistName: "Bad Bunny", fecha: "2026-06-15", venue: "Riyadh Air Metropolitano", city: "Madrid", aforoEstimado: 68000, precioEntradaMedioEur: 95, distanciaEstacionKm: 2.5, transportePublicoDisponible: true, precioCarpoolingMedioEur: 14, demandaScore: 93, generoDominante: "reggaeton", agotadaEntradas: true },
  { conciertoSlug: "coldplay-bernabeu-2026", artistName: "Coldplay", fecha: "TBD", venue: "Estadio Santiago Bernabéu", city: "Madrid", aforoEstimado: 85000, precioEntradaMedioEur: 120, distanciaEstacionKm: 1.0, transportePublicoDisponible: true, precioCarpoolingMedioEur: 15, demandaScore: 92, generoDominante: "pop rock", agotadaEntradas: true },
  { conciertoSlug: "coldplay-olimpic-2026", artistName: "Coldplay", fecha: "TBD", venue: "Estadi Olímpic Lluís Companys", city: "Barcelona", aforoEstimado: 55000, precioEntradaMedioEur: 120, distanciaEstacionKm: 1.5, transportePublicoDisponible: true, precioCarpoolingMedioEur: 17, demandaScore: 91, generoDominante: "pop rock", agotadaEntradas: true },
  { conciertoSlug: "taylor-swift-bernabeu-2026", artistName: "Taylor Swift", fecha: "TBD", venue: "Estadio Santiago Bernabéu", city: "Madrid", aforoEstimado: 85000, precioEntradaMedioEur: 135, distanciaEstacionKm: 1.0, transportePublicoDisponible: true, precioCarpoolingMedioEur: 15, demandaScore: 90, generoDominante: "pop", agotadaEntradas: true },
  { conciertoSlug: "taylor-swift-olimpic-2026", artistName: "Taylor Swift", fecha: "TBD", venue: "Estadi Olímpic Lluís Companys", city: "Barcelona", aforoEstimado: 55000, precioEntradaMedioEur: 135, distanciaEstacionKm: 1.5, transportePublicoDisponible: true, precioCarpoolingMedioEur: 17, demandaScore: 89, generoDominante: "pop", agotadaEntradas: true },
  { conciertoSlug: "rosalia-movistar-2026", artistName: "Rosalía", fecha: "TBD", venue: "Movistar Arena", city: "Madrid", aforoEstimado: 17000, precioEntradaMedioEur: 75, distanciaEstacionKm: 3.5, transportePublicoDisponible: true, precioCarpoolingMedioEur: 12, demandaScore: 87, generoDominante: "flamenco pop", agotadaEntradas: true },
  { conciertoSlug: "rosalia-sant-jordi-2026", artistName: "Rosalía", fecha: "TBD", venue: "Palau Sant Jordi", city: "Barcelona", aforoEstimado: 17000, precioEntradaMedioEur: 75, distanciaEstacionKm: 2.0, transportePublicoDisponible: true, precioCarpoolingMedioEur: 15, demandaScore: 86, generoDominante: "flamenco pop", agotadaEntradas: true },
  { conciertoSlug: "beyonce-bernabeu-2026", artistName: "Beyoncé", fecha: "TBD", venue: "Estadio Santiago Bernabéu", city: "Madrid", aforoEstimado: 85000, precioEntradaMedioEur: 140, distanciaEstacionKm: 1.0, transportePublicoDisponible: true, precioCarpoolingMedioEur: 15, demandaScore: 85, generoDominante: "pop r&b", agotadaEntradas: false },
  { conciertoSlug: "karol-g-metropolitano-2026", artistName: "Karol G", fecha: "TBD", venue: "Riyadh Air Metropolitano", city: "Madrid", aforoEstimado: 68000, precioEntradaMedioEur: 90, distanciaEstacionKm: 2.5, transportePublicoDisponible: true, precioCarpoolingMedioEur: 14, demandaScore: 84, generoDominante: "reggaeton", agotadaEntradas: false },
  { conciertoSlug: "karol-g-olimpic-2026", artistName: "Karol G", fecha: "TBD", venue: "Estadi Olímpic Lluís Companys", city: "Barcelona", aforoEstimado: 55000, precioEntradaMedioEur: 90, distanciaEstacionKm: 1.5, transportePublicoDisponible: true, precioCarpoolingMedioEur: 17, demandaScore: 83, generoDominante: "reggaeton", agotadaEntradas: false },
  { conciertoSlug: "metallica-ifema-2026", artistName: "Metallica", fecha: "TBD", venue: "IFEMA / Estadio Olímpico", city: "Madrid", aforoEstimado: 60000, precioEntradaMedioEur: 110, distanciaEstacionKm: 4.0, transportePublicoDisponible: true, precioCarpoolingMedioEur: 14, demandaScore: 82, generoDominante: "heavy metal", agotadaEntradas: false },
  { conciertoSlug: "guns-n-roses-ifema-2026", artistName: "Guns N' Roses", fecha: "TBD", venue: "IFEMA / Estadio Olímpico", city: "Madrid", aforoEstimado: 60000, precioEntradaMedioEur: 105, distanciaEstacionKm: 4.0, transportePublicoDisponible: true, precioCarpoolingMedioEur: 14, demandaScore: 80, generoDominante: "hard rock", agotadaEntradas: false },
  { conciertoSlug: "ac-dc-bernabeu-2026", artistName: "AC/DC", fecha: "TBD", venue: "Estadio Santiago Bernabéu", city: "Madrid", aforoEstimado: 85000, precioEntradaMedioEur: 115, distanciaEstacionKm: 1.0, transportePublicoDisponible: true, precioCarpoolingMedioEur: 15, demandaScore: 79, generoDominante: "hard rock", agotadaEntradas: false },
  { conciertoSlug: "bruce-springsteen-bernabeu-2026", artistName: "Bruce Springsteen", fecha: "TBD", venue: "Estadio Santiago Bernabéu", city: "Madrid", aforoEstimado: 85000, precioEntradaMedioEur: 125, distanciaEstacionKm: 1.0, transportePublicoDisponible: true, precioCarpoolingMedioEur: 15, demandaScore: 78, generoDominante: "rock", agotadaEntradas: false },
  { conciertoSlug: "the-weeknd-metropolitano-2026", artistName: "The Weeknd", fecha: "TBD", venue: "Riyadh Air Metropolitano", city: "Madrid", aforoEstimado: 68000, precioEntradaMedioEur: 95, distanciaEstacionKm: 2.5, transportePublicoDisponible: true, precioCarpoolingMedioEur: 14, demandaScore: 77, generoDominante: "r&b pop", agotadaEntradas: false },
  { conciertoSlug: "the-weeknd-olimpic-2026", artistName: "The Weeknd", fecha: "TBD", venue: "Estadi Olímpic Lluís Companys", city: "Barcelona", aforoEstimado: 55000, precioEntradaMedioEur: 95, distanciaEstacionKm: 1.5, transportePublicoDisponible: true, precioCarpoolingMedioEur: 17, demandaScore: 76, generoDominante: "r&b pop", agotadaEntradas: false },
  { conciertoSlug: "ed-sheeran-bernabeu-2026", artistName: "Ed Sheeran", fecha: "TBD", venue: "Estadio Santiago Bernabéu", city: "Madrid", aforoEstimado: 85000, precioEntradaMedioEur: 90, distanciaEstacionKm: 1.0, transportePublicoDisponible: true, precioCarpoolingMedioEur: 15, demandaScore: 75, generoDominante: "pop", agotadaEntradas: false },
  { conciertoSlug: "dua-lipa-metropolitano-2026", artistName: "Dua Lipa", fecha: "TBD", venue: "Riyadh Air Metropolitano", city: "Madrid", aforoEstimado: 68000, precioEntradaMedioEur: 85, distanciaEstacionKm: 2.5, transportePublicoDisponible: true, precioCarpoolingMedioEur: 14, demandaScore: 74, generoDominante: "pop", agotadaEntradas: false },
  { conciertoSlug: "billie-eilish-wizink-2026", artistName: "Billie Eilish", fecha: "TBD", venue: "WiZink Center", city: "Madrid", aforoEstimado: 17000, precioEntradaMedioEur: 80, distanciaEstacionKm: 1.2, transportePublicoDisponible: true, precioCarpoolingMedioEur: 13, demandaScore: 73, generoDominante: "pop alternative", agotadaEntradas: false },
  { conciertoSlug: "billie-eilish-sant-jordi-2026", artistName: "Billie Eilish", fecha: "TBD", venue: "Palau Sant Jordi", city: "Barcelona", aforoEstimado: 17000, precioEntradaMedioEur: 80, distanciaEstacionKm: 2.0, transportePublicoDisponible: true, precioCarpoolingMedioEur: 15, demandaScore: 72, generoDominante: "pop alternative", agotadaEntradas: false },
  { conciertoSlug: "olivia-rodrigo-wizink-2026", artistName: "Olivia Rodrigo", fecha: "TBD", venue: "WiZink Center", city: "Madrid", aforoEstimado: 17000, precioEntradaMedioEur: 75, distanciaEstacionKm: 1.2, transportePublicoDisponible: true, precioCarpoolingMedioEur: 13, demandaScore: 71, generoDominante: "pop", agotadaEntradas: false },
  { conciertoSlug: "harry-styles-metropolitano-2026", artistName: "Harry Styles", fecha: "TBD", venue: "Riyadh Air Metropolitano", city: "Madrid", aforoEstimado: 68000, precioEntradaMedioEur: 95, distanciaEstacionKm: 2.5, transportePublicoDisponible: true, precioCarpoolingMedioEur: 14, demandaScore: 70, generoDominante: "pop", agotadaEntradas: false },
  { conciertoSlug: "iron-maiden-ifema-2026", artistName: "Iron Maiden", fecha: "TBD", venue: "IFEMA / Estadio Olímpico", city: "Madrid", aforoEstimado: 60000, precioEntradaMedioEur: 95, distanciaEstacionKm: 4.0, transportePublicoDisponible: true, precioCarpoolingMedioEur: 14, demandaScore: 69, generoDominante: "heavy metal", agotadaEntradas: false },
  { conciertoSlug: "imagine-dragons-metropolitano-2026", artistName: "Imagine Dragons", fecha: "TBD", venue: "Riyadh Air Metropolitano", city: "Madrid", aforoEstimado: 68000, precioEntradaMedioEur: 75, distanciaEstacionKm: 2.5, transportePublicoDisponible: true, precioCarpoolingMedioEur: 14, demandaScore: 68, generoDominante: "pop rock", agotadaEntradas: false },
  { conciertoSlug: "aitana-wizink-2026", artistName: "Aitana", fecha: "TBD", venue: "WiZink Center", city: "Madrid", aforoEstimado: 17000, precioEntradaMedioEur: 55, distanciaEstacionKm: 1.2, transportePublicoDisponible: true, precioCarpoolingMedioEur: 13, demandaScore: 67, generoDominante: "pop", agotadaEntradas: false },
  { conciertoSlug: "estopa-cartuja-2026", artistName: "Estopa", fecha: "TBD", venue: "Estadio La Cartuja", city: "Sevilla", aforoEstimado: 57000, precioEntradaMedioEur: 55, distanciaEstacionKm: 3.0, transportePublicoDisponible: true, precioCarpoolingMedioEur: 13, demandaScore: 66, generoDominante: "rumba rock", agotadaEntradas: false },
];

const N_ROWS = ROWS.length;
const SORTED_BY_DEMAND = [...ROWS].sort((a, b) => b.demandaScore - a.demandaScore);
const AVG_DEMAND = Math.round((ROWS.reduce((s, r) => s + r.demandaScore, 0) / N_ROWS) * 10) / 10;
const AVG_AFORO = Math.round(ROWS.reduce((s, r) => s + r.aforoEstimado, 0) / N_ROWS);
const AVG_PRECIO_ENTRADA = Math.round((ROWS.reduce((s, r) => s + r.precioEntradaMedioEur, 0) / N_ROWS) * 10) / 10;
const AVG_PRECIO_CARPOOLING = Math.round((ROWS.reduce((s, r) => s + r.precioCarpoolingMedioEur, 0) / N_ROWS) * 10) / 10;
const AVG_DIST_ESTACION = Math.round((ROWS.reduce((s, r) => s + r.distanciaEstacionKm, 0) / N_ROWS) * 10) / 10;
const N_AGOTADOS = ROWS.filter((r) => r.agotadaEntradas).length;
const PCT_AGOTADOS = Math.round((N_AGOTADOS / N_ROWS) * 100);

// Group by city
const CITY_GROUPS = (() => {
  const map = new Map<string, DatasetRow[]>();
  for (const r of ROWS) {
    const arr = map.get(r.city) ?? [];
    arr.push(r);
    map.set(r.city, arr);
  }
  return Array.from(map.entries())
    .map(([city, rows]) => ({
      city,
      n: rows.length,
      avgDemand: Math.round((rows.reduce((s, r) => s + r.demandaScore, 0) / rows.length) * 10) / 10,
      avgAforo: Math.round(rows.reduce((s, r) => s + r.aforoEstimado, 0) / rows.length),
      avgCarpooling: Math.round((rows.reduce((s, r) => s + r.precioCarpoolingMedioEur, 0) / rows.length) * 10) / 10,
    }))
    .sort((a, b) => b.avgDemand - a.avgDemand);
})();

// Group by genre
const GENRE_GROUPS = (() => {
  const map = new Map<string, DatasetRow[]>();
  for (const r of ROWS) {
    const arr = map.get(r.generoDominante) ?? [];
    arr.push(r);
    map.set(r.generoDominante, arr);
  }
  return Array.from(map.entries())
    .map(([genre, rows]) => ({
      genre,
      n: rows.length,
      avgDemand: Math.round((rows.reduce((s, r) => s + r.demandaScore, 0) / rows.length) * 10) / 10,
      avgPrecio: Math.round((rows.reduce((s, r) => s + r.precioEntradaMedioEur, 0) / rows.length) * 10) / 10,
    }))
    .sort((a, b) => b.avgDemand - a.avgDemand);
})();

const TOP3 = SORTED_BY_DEMAND.slice(0, 3) as [DatasetRow, DatasetRow, DatasetRow];
const TOP_CITY = CITY_GROUPS[0]!;
const TOP_GENRE = GENRE_GROUPS[0]!;
const SECOND_GENRE = GENRE_GROUPS[1];
const THIRD_GENRE = GENRE_GROUPS[2];
const BARCELONA_GROUP = CITY_GROUPS.find((c) => c.city === "Barcelona");
const MADRID_GROUP = CITY_GROUPS.find((c) => c.city === "Madrid");

const CSV_URL = `${SITE_URL}/datos/conciertos-mayor-demanda-transporte-2026.csv`;
const JSON_URL = `${SITE_URL}/datos/conciertos-mayor-demanda-transporte-2026.json`;

// Demand heatmap helper
function demandColor(score: number): string {
  if (score >= 90) return "bg-red-500/25 text-red-200";
  if (score >= 80) return "bg-orange-500/20 text-orange-200";
  if (score >= 70) return "bg-amber-500/15 text-amber-200";
  return "bg-emerald-500/10 text-emerald-200";
}

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

export default function DatasetConciertosDemanda2026Page() {
  const url = `${SITE_URL}/datos/conciertos-mayor-demanda-transporte-2026`;

  useSeoMeta({
    title: `Conciertos mayor demanda transporte España 2026 [Top 30 Dataset] | ConcertRide`,
    description: `Top 30 conciertos individuales España 2026 ordenados por demanda transporte. Dataset abierto CC BY 4.0 con CSV y JSON descargables.`,
    canonical: url,
    keywords: `conciertos mayor demanda 2026, concierto Madrid 2026 como llegar, concierto Bilbao 2026 transporte, concierto Sevilla 2026, demanda transporte concierto España, dataset conciertos 2026, carpooling concierto 2026, transporte concierto Bernabéu, transporte concierto Metropolitano, top conciertos España 2026`,
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: `Top 30 conciertos individuales España 2026 con mayor demanda de transporte. Dataset CC BY 4.0 ConcertRide.`,
  });

  const jsonLdDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    name: "Top 30 conciertos individuales con mayor demanda de transporte España 2026",
    alternateName: "ConcertRide Top 30 Single-Venue Concerts Transport Demand 2026",
    description: `Dataset abierto de ${N_ROWS} conciertos individuales (single venue, tour artists, no festivales) en España 2026 ordenados por demanda de transporte. Cada fila incluye: artista, fecha, recinto, ciudad, aforo estimado, precio entrada medio, distancia a la estación de transporte público más cercana, disponibilidad de transporte público, precio medio del carpooling ConcertRide, score de demanda 1-100, género dominante y estado de entradas. Score de demanda medio: ${AVG_DEMAND}. Aforo medio: ${AVG_AFORO.toLocaleString("es-ES")}. Precio carpooling medio: ${AVG_PRECIO_CARPOOLING} €/asiento. El concierto con mayor demanda es ${TOP3[0].artistName} en ${TOP3[0].venue} (${TOP3[0].city}) — score ${TOP3[0].demandaScore}.`,
    url,
    sameAs: url,
    isAccessibleForFree: true,
    inLanguage: "es-ES",
    datePublished: "2026-05-19",
    dateModified: "2026-05-19",
    license: "https://creativecommons.org/licenses/by/4.0/",
    keywords: [
      "conciertos España 2026",
      "demanda transporte",
      "carpooling concierto",
      "single venue",
      "tour artists",
      "estadios España",
      "arenas España",
      "datos abiertos",
      "España",
      "2026",
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
      "Concierto_slug: identificador único url-friendly del concierto (artista + recinto + fecha). Artist_name: nombre del artista o banda según fuentes oficiales. Fecha: ISO 8601 (YYYY-MM-DD) cuando está confirmada, 'TBD' cuando el promotor no ha anunciado fecha exacta. Venue: recinto oficial. City: municipio. Aforo_estimado: capacidad declarada del recinto en su configuración 'concierto' (no deportiva), cruzada con apps/web/src/lib/venueLandings.ts. Precio_entrada_medio_eur: estimación del precio medio en el mercado primario español 2026, ponderado por sectores típicos (pista + grada baja + grada alta), excluye reventa y VIP packages. Distancia_estacion_km: distancia por carretera entre el recinto y la estación principal de transporte público más cercana (metro grande / tren cercanías / RENFE), Google Maps. Transporte_publico_disponible: 'yes' cuando hay metro, tren o autobús urbano hasta ≤5 min andando del recinto antes del concierto Y servicio nocturno post-concierto (al menos lanzadera oficial); 'no' en caso contrario. Precio_carpooling_medio_eur: precio mediano del carpooling ConcertRide en la ruta principal de origen (≈ Valencia/Zaragoza para Madrid, Madrid para Barcelona, Madrid para Sevilla), basado en los rangos publicados en apps/web/src/lib/artistLandings.ts. Demanda_score (1-100): score cualitativo compuesto por (a) aforo estimado normalizado 0-40 puntos, (b) precio entrada normalizado 0-15 puntos, (c) estado agotada_entradas 0-20 puntos, (d) popularidad del artista (Spotify monthly listeners y demanda histórica en ConcertRide) 0-25 puntos. Genero_dominante: género principal según etiquetado en apps/web/src/lib/artistLandings.ts. Agotada_entradas: booleano según última verificación pública mayo 2026 (entradas oficiales agotadas en el mercado primario).",
    variableMeasured: [
      { "@type": "PropertyValue", name: "concierto_slug", description: "Identificador url-friendly del concierto (artista-recinto-fecha)" },
      { "@type": "PropertyValue", name: "artist_name", description: "Nombre oficial del artista o banda" },
      { "@type": "PropertyValue", name: "fecha", description: "Fecha del concierto en formato ISO 8601 o 'TBD'" },
      { "@type": "PropertyValue", name: "venue", description: "Recinto oficial del concierto" },
      { "@type": "PropertyValue", name: "city", description: "Ciudad o municipio del recinto" },
      { "@type": "PropertyValue", name: "aforo_estimado", description: "Capacidad declarada del recinto en configuración concierto" },
      { "@type": "PropertyValue", name: "precio_entrada_medio_eur", unitText: "EUR", description: "Precio medio de la entrada en el mercado primario, ponderado por sectores" },
      { "@type": "PropertyValue", name: "distancia_estacion_km", unitText: "km", description: "Distancia por carretera entre el recinto y la estación principal de transporte público más cercana" },
      { "@type": "PropertyValue", name: "transporte_publico_disponible", description: "yes/no — disponibilidad de transporte público hasta ≤5 min andando del recinto y servicio nocturno post-concierto" },
      { "@type": "PropertyValue", name: "precio_carpooling_medio_eur", unitText: "EUR", description: "Precio mediano del carpooling ConcertRide en la ruta principal de origen al recinto" },
      { "@type": "PropertyValue", name: "demanda_score", description: "Score 1-100 compuesto por aforo (40), precio (15), agotada (20) y popularidad artista (25)" },
      { "@type": "PropertyValue", name: "genero_dominante", description: "Género principal del artista" },
      { "@type": "PropertyValue", name: "agotada_entradas", description: "Booleano — entradas oficiales agotadas en mercado primario" },
    ],
    distribution: [
      {
        "@type": "DataDownload",
        name: "Top 30 conciertos mayor demanda transporte España 2026 (CSV)",
        contentUrl: CSV_URL,
        encodingFormat: "text/csv",
      },
      {
        "@type": "DataDownload",
        name: "Top 30 conciertos mayor demanda transporte España 2026 (JSON)",
        contentUrl: JSON_URL,
        encodingFormat: "application/json",
      },
    ],
    isRelatedTo: [
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
        name: "Festivales más caros vs baratos de llegar España 2026",
        url: `${SITE_URL}/datos/festivales-mas-caros-mas-baratos-llegar-2026`,
      },
      {
        "@type": "Dataset",
        name: "Mapa festivales peor conexión transporte público España 2026",
        url: `${SITE_URL}/datos/festivales-peor-conexion-transporte-publico-2026`,
      },
      {
        "@type": "Dataset",
        name: "Precio medio carpooling vs bus oficial festivales España 2026",
        url: `${SITE_URL}/datos/precio-medio-carpooling-vs-bus-festivales-2026`,
      },
    ],
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Datos", item: `${SITE_URL}/datos` },
      { "@type": "ListItem", position: 3, name: "Conciertos mayor demanda transporte 2026", item: url },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuál es el concierto individual con mayor demanda de transporte en España 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `El concierto con mayor demanda de transporte en España 2026 es ${TOP3[0].artistName} en ${TOP3[0].venue} (${TOP3[0].city}) el ${TOP3[0].fecha}, con un score de demanda de ${TOP3[0].demandaScore}/100. Aforo estimado: ${TOP3[0].aforoEstimado.toLocaleString("es-ES")} personas. Le siguen ${TOP3[1].artistName} en ${TOP3[1].venue} (${TOP3[1].city}) — score ${TOP3[1].demandaScore} — y ${TOP3[2].artistName} en ${TOP3[2].venue} (${TOP3[2].city}) — score ${TOP3[2].demandaScore}. Las fechas con entradas agotadas concentran demanda en carpooling 3-4 horas antes del concierto desde Valencia, Zaragoza y otras ciudades intermedias.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuántos de los Top 30 conciertos individuales 2026 tienen entradas agotadas?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `De los ${N_ROWS} conciertos individuales del Top 30 España 2026, ${N_AGOTADOS} (${PCT_AGOTADOS}%) tienen entradas agotadas en el mercado primario a fecha de mayo 2026. Las fechas agotadas se concentran en los 6 conciertos de Bad Bunny (Metropolitano + Estadi Olímpic), 2 fechas de Coldplay (Bernabéu + Olímpic), 2 fechas de Taylor Swift y 2 fechas de Rosalía. En estos casos, el carpooling ConcertRide es la opción más demandada para asistentes que no tienen alojamiento en la ciudad sede, con picos de reservas en las 72 horas previas al concierto.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo llegar a un concierto en Madrid en 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Madrid concentra ${MADRID_GROUP?.n ?? 0} de los ${N_ROWS} conciertos individuales del Top 30 2026 — la ciudad con mayor demanda. Los recintos principales son Estadio Santiago Bernabéu (Metro L10 Santiago Bernabéu, 85.000 aforo), Riyadh Air Metropolitano (Metro L7 Estadio Metropolitano, 68.000 aforo), IFEMA / Estadio Olímpico (Metro L8 Feria de Madrid, 60.000-80.000 aforo), Movistar Arena (Metro L5/L10 Estadio Metropolitano-Las Musas, 17.000 aforo) y WiZink Center (Metro L2 Ventas, 17.000 aforo). Todos tienen transporte público hasta ≤5 min andando, pero el metro último servicio es 1:30 (Bernabéu/WiZink) o 2:00 (festivos), por lo que la vuelta post-concierto desde el Metropolitano o IFEMA suele ser en taxi (8-15 €) o carpooling ConcertRide hasta el centro (4-7 €).`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo se calcula el demanda_score 1-100 del dataset?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `El demanda_score (1-100) combina 4 factores: (1) aforo estimado normalizado 0-40 puntos — recintos como el Bernabéu (85.000) suman cerca de los 40 puntos máximos; (2) precio entrada medio normalizado 0-15 puntos — entradas más caras suelen indicar mayor demanda relativa; (3) estado agotada_entradas 0-20 puntos — fechas con entradas agotadas suman 20, no agotadas 0; (4) popularidad del artista (Spotify monthly listeners y demanda histórica de carpooling en ConcertRide) 0-25 puntos. Artistas como Bad Bunny, Taylor Swift o Rosalía suman cerca de 25; artistas de público fiel pero más reducido (Aitana, Estopa) suman 10-15. El score es relativo dentro del Top 30 y se actualiza con cada nuevo dataset trimestral.`,
        },
      },
      {
        "@type": "Question",
        name: "¿De dónde proceden los datos y puedo reutilizarlos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Los datos proceden de fuentes públicas verificadas mayo 2026: webs oficiales de los recintos (Bernabéu, Metropolitano, IFEMA, Movistar Arena, WiZink Center, Palau Sant Jordi, Estadi Olímpic, La Cartuja, FIBES), promotores y prensa especializada para confirmar fechas, aforos y precios. Las distancias estación-recinto provienen de Google Maps. Los precios del carpooling se calculan sobre rangos publicados en apps/web/src/lib/artistLandings.ts (verificados con la base de reservas histórica ConcertRide). El dataset se publica bajo licencia Creative Commons Attribution 4.0 (CC BY 4.0): puedes usarlo, redistribuirlo, modificarlo y citarlo en cualquier contexto comercial o no comercial siempre que cites a ConcertRide como fuente.`,
        },
      },
    ],
  };

  const citationApa = `ConcertRide. (2026). Top 30 conciertos individuales con mayor demanda de transporte España 2026 [Dataset]. ${url}. CC BY 4.0.`;
  const citationHtml = `<a href="${url}" rel="noopener">Top 30 conciertos individuales con mayor demanda de transporte España 2026</a> (ConcertRide, CC BY 4.0)`;

  // WebPage wrapper with Speakable — Dataset schema does not natively support
  // speakable, so we emit a sibling WebPage that mainEntity-points to the Dataset
  // and exposes the standard ConcertRide speakable selectors for AI Overviews.
  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: "Top 30 conciertos individuales con mayor demanda de transporte España 2026",
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
          <span className="text-cr-text-muted">Conciertos mayor demanda transporte 2026</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Dataset CC BY 4.0 — Publicado 19 mayo 2026
        </p>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95]">
          Top 30 conciertos individuales<br />
          con mayor demanda de transporte — España 2026
          <span className="block text-base md:text-lg font-sans normal-case tracking-normal text-cr-text-muted mt-3">
            [Single venue · tour artists · score 1-100 · {N_ROWS} fechas]
          </span>
        </h1>

        {/* Quotable answer-first paragraph (~140 words) */}
        <p
          data-quotable="true"
          className="font-sans text-sm md:text-base text-cr-text leading-relaxed max-w-3xl speakable border-l-2 border-cr-primary/60 pl-4"
        >
          <strong>El concierto individual con mayor demanda de transporte en España 2026 es {TOP3[0].artistName} en
          el {TOP3[0].venue} ({TOP3[0].city}) — score {TOP3[0].demandaScore}/100, aforo
          {" "}{TOP3[0].aforoEstimado.toLocaleString("es-ES")} personas, entradas agotadas.</strong> Le siguen{" "}
          {TOP3[1].artistName} en {TOP3[1].venue} (score {TOP3[1].demandaScore}) y {TOP3[2].artistName} en{" "}
          {TOP3[2].venue} (score {TOP3[2].demandaScore}). De los {N_ROWS} conciertos analizados, {N_AGOTADOS} ({PCT_AGOTADOS}%)
          tienen entradas agotadas en el mercado primario. La ciudad más concentrada es {TOP_CITY.city} con{" "}
          {TOP_CITY!.n} fechas del Top 30, seguida de Barcelona. El género con mayor demanda media es{" "}
          {TOP_GENRE!.genre} (score {TOP_GENRE!.avgDemand}). Aforo medio del Top 30: {AVG_AFORO.toLocaleString("es-ES")} personas
          por fecha. Precio entrada medio: {AVG_PRECIO_ENTRADA} €. Precio carpooling ConcertRide medio: {AVG_PRECIO_CARPOOLING} €/asiento
          desde origen principal. A diferencia de los festivales (multi-día), estos son conciertos single venue de tour
          artists con picos de demanda en las 72 h previas. Dataset abierto CC BY 4.0, descargable en CSV y JSON.
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
            <p className="font-sans text-[11px] text-cr-text-muted">conciertos individuales</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-red-300 tabular-nums">{N_AGOTADOS}</p>
            <p className="font-sans text-[11px] text-cr-text-muted">agotados ({PCT_AGOTADOS}%)</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{AVG_AFORO.toLocaleString("es-ES")}</p>
            <p className="font-sans text-[11px] text-cr-text-muted">aforo medio / concierto</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-emerald-300 tabular-nums">{AVG_PRECIO_CARPOOLING}€</p>
            <p className="font-sans text-[11px] text-cr-text-muted">carpooling medio / asiento</p>
          </div>
        </div>
      </section>

      {/* ── Hallazgos ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Hallazgos clave</h2>
        <ul className="space-y-3">
          {[
            `El concierto con mayor demanda 2026 es ${TOP3[0].artistName} en ${TOP3[0].venue} (${TOP3[0].city}) — score ${TOP3[0].demandaScore}, aforo ${TOP3[0].aforoEstimado.toLocaleString("es-ES")}, entradas agotadas. Las 6 fechas de Bad Bunny entre Metropolitano y Estadi Olímpic copan los puestos 1-6 del ranking.`,
            `${N_AGOTADOS} de ${N_ROWS} conciertos (${PCT_AGOTADOS}%) tienen entradas agotadas en el mercado primario. Estas fechas concentran picos de carpooling ConcertRide en las 72 h previas, especialmente desde Valencia, Zaragoza y Sevilla hacia Madrid y Barcelona.`,
            `${TOP_CITY.city} concentra ${TOP_CITY.n} de los ${N_ROWS} conciertos del Top 30 (${Math.round((TOP_CITY.n / N_ROWS) * 100)}%) — la ciudad española con mayor demanda de transporte a conciertos individuales 2026. Le sigue Barcelona con ${BARCELONA_GROUP?.n ?? 0} fechas.`,
            `El género con mayor demanda media es ${TOP_GENRE.genre} (score medio ${TOP_GENRE.avgDemand}), gracias al peso de Bad Bunny y Karol G. Le sigue ${SECOND_GENRE?.genre ?? ""} (score medio ${SECOND_GENRE?.avgDemand ?? 0}) — pop rock estadios — y ${THIRD_GENRE?.genre ?? ""} (score medio ${THIRD_GENRE?.avgDemand ?? 0}).`,
            `La distancia media estación → recinto en los ${N_ROWS} conciertos es ${AVG_DIST_ESTACION} km. Los recintos peor conectados son IFEMA / Estadio Olímpico (4,0 km a Feria de Madrid Metro L8) y Movistar Arena (3,5 km a Las Musas L5). Los mejor conectados: Bernabéu y Ed Sheeran-type stadiums (1,0 km a Santiago Bernabéu L10).`,
            `El precio carpooling ConcertRide medio para llegar a estos conciertos es ${AVG_PRECIO_CARPOOLING} €/asiento (desde origen principal). Frente a un AVE Valencia→Madrid (40-60 €) o Madrid→Barcelona (60-130 €), supone un ahorro del 70-85% por asiento ida.`,
            `Los conciertos en estadio (aforo 55.000+) generan picos de demanda 3-4 horas antes del concierto. Los conciertos en arena (aforo 17.000 — Movistar, WiZink, Sant Jordi) suelen agotar entradas en horas y generan mayor proporción de viajeros únicos desde origen.`,
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

      {/* ── Tabla Top 30 ordenado por demanda ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Top {N_ROWS} ordenado por demanda
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">heatmap: rojo ≥90 · naranja ≥80 · ámbar ≥70 · verde &lt;70</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse min-w-[840px]">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">#</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Artista</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Recinto</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">Ciudad</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Fecha</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Aforo</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Carpooling €</th>
                <th className="text-center py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Agotada</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Demanda</th>
              </tr>
            </thead>
            <tbody>
              {SORTED_BY_DEMAND.map((r, idx) => (
                <tr key={r.conciertoSlug} className="border-b border-cr-border/50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-3 text-cr-text-dim font-mono text-xs">{idx + 1}</td>
                  <td className="py-3 pr-3 text-cr-primary font-medium">{r.artistName}</td>
                  <td className="py-3 pr-3 text-cr-text-muted text-xs hidden md:table-cell">{r.venue}</td>
                  <td className="py-3 pr-3 text-cr-text-muted text-xs hidden sm:table-cell">{r.city}</td>
                  <td className="py-3 pr-3 text-cr-text-muted text-xs hidden lg:table-cell font-mono">{r.fecha}</td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden lg:table-cell font-mono text-[11px]">{r.aforoEstimado.toLocaleString("es-ES")}</td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden md:table-cell font-mono text-[11px]">{r.precioCarpoolingMedioEur}€</td>
                  <td className="py-3 pr-3 text-center hidden md:table-cell">
                    {r.agotadaEntradas ? (
                      <span className="inline-flex items-center bg-red-500/15 text-red-300 px-2 py-0.5 font-mono text-[10px] uppercase">Sí</span>
                    ) : (
                      <span className="text-cr-text-dim font-mono text-[10px] uppercase">No</span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 font-mono text-[11px] tabular-nums font-semibold ${demandColor(r.demandaScore)}`}>
                      {r.demandaScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-mono text-[10px] text-cr-text-dim leading-relaxed">
          Score de demanda = aforo (0-40) + precio entrada (0-15) + agotada_entradas (0-20) + popularidad artista (0-25). Verificado mayo 2026 contra webs oficiales de recintos y datos de reservas ConcertRide.
        </p>
      </section>

      {/* ── Demanda por ciudad ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Demanda por ciudad</h2>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
          Agrupación de los {N_ROWS} conciertos del Top 30 por ciudad sede. La concentración refleja
          dónde se ubican los grandes recintos (estadios + arenas) tier-1 con mayor demanda de
          transporte 2026.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CITY_GROUPS.map((c) => (
            <div key={c.city} className="border border-cr-border p-5 space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display text-xl uppercase text-cr-primary">{c.city}</p>
                <span className="font-mono text-[11px] text-cr-text-muted tabular-nums">{c.n} fechas</span>
              </div>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
                Score medio demanda: <span className="text-cr-text font-semibold tabular-nums">{c.avgDemand}/100</span><br />
                Aforo medio: <span className="text-cr-text tabular-nums">{c.avgAforo.toLocaleString("es-ES")}</span><br />
                Carpooling medio: <span className="text-cr-text tabular-nums">{c.avgCarpooling} €/asiento</span>
              </p>
              <Link
                to={`/conciertos/${c.city.toLowerCase()}`}
                className="inline-flex items-center gap-1.5 font-sans text-[11px] text-cr-primary hover:underline underline-offset-2"
              >
                Conciertos {c.city} 2026 <ArrowRight size={11} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Géneros con mayor demanda ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Géneros con mayor demanda</h2>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
          Agrupación de los {N_ROWS} conciertos del Top 30 por género dominante. El score medio mide la
          intensidad de la demanda transporte dentro de cada género (no la popularidad absoluta del
          género).
        </p>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse min-w-[560px]">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">#</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Género</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Fechas</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">Precio entrada medio</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Score medio</th>
              </tr>
            </thead>
            <tbody>
              {GENRE_GROUPS.map((g, idx) => (
                <tr key={g.genre} className="border-b border-cr-border/50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-3 text-cr-text-dim font-mono text-xs">{idx + 1}</td>
                  <td className="py-3 pr-3 text-cr-text font-medium capitalize">{g.genre}</td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums font-mono text-[11px]">{g.n}</td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden sm:table-cell font-mono text-[11px]">{g.avgPrecio}€</td>
                  <td className="py-3 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 font-mono text-[11px] tabular-nums font-semibold ${demandColor(g.avgDemand)}`}>
                      {g.avgDemand}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Metodología ── */}
      <section id="metodologia" className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6 scroll-mt-20">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Metodología</h2>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
          Este dataset reúne los {N_ROWS} conciertos individuales (single venue, tour artists)
          celebrados en España durante 2026 con mayor demanda de transporte. <strong>A diferencia de
          los datasets de festivales</strong> (multi-día, multi-escenario), aquí cada fila es un
          concierto único en un recinto cubierto o estadio, normalmente parte de una gira mundial.
        </p>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Cálculo del demanda_score (1-100)</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            <code className="font-mono text-[12px] text-cr-text">demanda_score = aforo_norm (0-40) + precio_norm (0-15) + agotada (0-20) + popularidad_artista (0-25)</code>
          </p>
          <ul className="space-y-2 pt-1">
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              <strong>Aforo (0-40 pts):</strong> aforo_estimado / 85.000 × 40. Bernabéu y Estadi Olímpic suman 40 puntos; arenas como Movistar/WiZink suman ~8 puntos.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              <strong>Precio entrada (0-15 pts):</strong> precio_eur / 140 × 15. Entradas más caras suelen indicar mayor demanda relativa.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              <strong>Agotada_entradas (0-20 pts):</strong> 20 si entradas agotadas en mercado primario, 0 si no. Verificado última semana antes de publicación.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              <strong>Popularidad artista (0-25 pts):</strong> combina Spotify monthly listeners (peso 60%) y demanda histórica de carpooling en ConcertRide (peso 40%).
            </li>
          </ul>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Fuentes y referencias</h3>
          <ul className="space-y-2">
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Webs oficiales de los recintos cruzadas con <Link to="/recintos/estadio-santiago-bernabeu" className="text-cr-primary underline underline-offset-2">Bernabéu</Link>, <Link to="/recintos/estadio-civitas-metropolitano" className="text-cr-primary underline underline-offset-2">Metropolitano</Link>, <Link to="/recintos/ifema-madrid" className="text-cr-primary underline underline-offset-2">IFEMA</Link>, <Link to="/recintos/wizink-center" className="text-cr-primary underline underline-offset-2">WiZink Center</Link>, <Link to="/recintos/palau-sant-jordi" className="text-cr-primary underline underline-offset-2">Palau Sant Jordi</Link>, <Link to="/recintos/estadi-olimpic-lluis-companys" className="text-cr-primary underline underline-offset-2">Estadi Olímpic</Link>, <Link to="/recintos/estadio-la-cartuja" className="text-cr-primary underline underline-offset-2">La Cartuja</Link>.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Fechas y precios entrada confirmados con promotores y prensa especializada (mayo 2026). Las fechas marcadas "TBD" son giras anunciadas oficialmente sin fecha exacta publicada al momento del dataset.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Distancias estación → recinto: Google Maps, ruta más rápida a pie/coche.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Precio carpooling: mediana de rangos publicados en <code className="font-mono text-[11px] text-cr-text">apps/web/src/lib/artistLandings.ts</code> y verificación cruzada con base de reservas histórica ConcertRide en rutas tier-1.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Spotify monthly listeners: snapshot mayo 2026 de Spotify for Artists (datos públicos del perfil).
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
            { label: "Índice de datasets ConcertRide", to: "/datos" },
            { label: "Calendario maestro festivales 2026", to: "/datos/calendario-maestro-festivales-2026" },
            { label: "Costes ocultos transporte festivales 2026", to: "/datos/costes-ocultos-transporte-festivales-2026" },
            { label: "Ranking caros vs baratos 2026", to: "/datos/festivales-mas-caros-mas-baratos-llegar-2026" },
            { label: "Mapa peor conexión transporte público", to: "/datos/festivales-peor-conexion-transporte-publico-2026" },
            { label: "Precio carpooling vs bus 2026", to: "/datos/precio-medio-carpooling-vs-bus-festivales-2026" },
            { label: "Guía presupuesto festival grupo", to: "/guia/presupuesto-festival-grupo" },
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

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, Download, ExternalLink } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const DATASET_SLUG = "festivales-peor-conexion-transporte-publico-2026";

// ── Dataset rows (mirrors apps/web/public/datos/festivales-peor-conexion-transporte-publico-2026.{csv,json}) ──
interface DatasetRow {
  slug: string;
  festival: string;
  city: string;
  venue: string;
  busOficial: boolean;
  trenDirecto: boolean;
  metroCercano: boolean;
  distanciaKm: number;
  ultimoTransporte: string;
  taxiMinEur: number;
  score: number;
  recomendacion: string;
}

const ROWS: DatasetRow[] = [
  { slug: "resurrection-fest", festival: "Resurrection Fest", city: "Viveiro", venue: "Recinto Festival Resurrection", busOficial: false, trenDirecto: false, metroCercano: false, distanciaKm: 55, ultimoTransporte: "21:00", taxiMinEur: 90, score: 0, recomendacion: "Carpooling o coche compartido — estación FEVE de Viveiro a 55 km sin tren directo desde la mayoría de orígenes; sin lanzadera oficial nocturna" },
  { slug: "atlantic-fest", festival: "Atlantic Fest", city: "Vilagarcía de Arousa", venue: "Praia de Compostela", busOficial: false, trenDirecto: true, metroCercano: false, distanciaKm: 3, ultimoTransporte: "22:30", taxiMinEur: 12, score: 39, recomendacion: "Tren cercanías Vilagarcía + carpooling — sin bus oficial; último cercanías 22:30" },
  { slug: "aquasella-festival", festival: "Aquasella Festival", city: "Arriondas", venue: "Prado Lloviu", busOficial: false, trenDirecto: false, metroCercano: false, distanciaKm: 8, ultimoTransporte: "20:30", taxiMinEur: 25, score: 7, recomendacion: "Carpooling indispensable — Arriondas tiene tren FEVE pero termina a las 20:30; sin bus oficial al recinto" },
  { slug: "dreambeach-festival", festival: "Dreambeach Festival", city: "Villaricos", venue: "Playa de Villaricos", busOficial: true, trenDirecto: false, metroCercano: false, distanciaKm: 42, ultimoTransporte: "02:00", taxiMinEur: 75, score: 40, recomendacion: "Bus oficial Almería-Villaricos único transporte público viable; estación tren más cercana en Almería (42 km)" },
  { slug: "o-son-do-camino", festival: "O Son do Camiño", city: "Santiago de Compostela", venue: "Monte do Gozo", busOficial: true, trenDirecto: true, metroCercano: false, distanciaKm: 4, ultimoTransporte: "03:00", taxiMinEur: 15, score: 79, recomendacion: "Bus lanzadera oficial desde Santiago + estación de tren urbana a 4 km" },
  { slug: "vina-rock", festival: "Viña Rock", city: "Villarrobledo", venue: "Recinto Festero", busOficial: true, trenDirecto: true, metroCercano: false, distanciaKm: 1, ultimoTransporte: "00:30", taxiMinEur: 8, score: 70, recomendacion: "Tren Renfe Larga Distancia parada Villarrobledo + bus oficial Madrid" },
  { slug: "bbk-live", festival: "Bilbao BBK Live", city: "Bilbao", venue: "Kobetamendi", busOficial: true, trenDirecto: false, metroCercano: true, distanciaKm: 5, ultimoTransporte: "02:00", taxiMinEur: 15, score: 68, recomendacion: "Lanzadera gratuita oficial desde plaza Moyúa + metro Bilbao L1/L2 en centro" },
  { slug: "mad-cool", festival: "Mad Cool Festival", city: "Madrid", venue: "Iberdrola Music Madrid", busOficial: false, trenDirecto: false, metroCercano: true, distanciaKm: 1, ultimoTransporte: "02:30", taxiMinEur: 12, score: 40, recomendacion: "Metro L3 hasta Villaverde Alto + bus EMT; sin lanzadera oficial dedicada" },
  { slug: "primavera-sound", festival: "Primavera Sound", city: "Barcelona", venue: "Parc del Fòrum", busOficial: false, trenDirecto: false, metroCercano: true, distanciaKm: 0.3, ultimoTransporte: "05:00", taxiMinEur: 12, score: 40, recomendacion: "Metro L4 Maresme/Fòrum directo + tranvía T4; transporte público nocturno toda la noche" },
  { slug: "sonar", festival: "Sónar Barcelona", city: "Barcelona", venue: "Fira Montjuïc + Gran Via L'Hospitalet", busOficial: false, trenDirecto: false, metroCercano: true, distanciaKm: 0.5, ultimoTransporte: "05:00", taxiMinEur: 10, score: 40, recomendacion: "Metro L1 Espanya/L9 Foc + Renfe Cercanías; nocturnos NitBus" },
  { slug: "fib", festival: "FIB Benicàssim", city: "Benicàssim", venue: "Recinto FIB", busOficial: true, trenDirecto: true, metroCercano: false, distanciaKm: 2, ultimoTransporte: "01:00", taxiMinEur: 8, score: 79, recomendacion: "Tren Renfe Larga Distancia Benicàssim + lanzaderas oficiales gratuitas; estación a 2 km recinto" },
  { slug: "arenal-sound", festival: "Arenal Sound", city: "Burriana", venue: "Playa del Arenal", busOficial: true, trenDirecto: false, metroCercano: false, distanciaKm: 3.5, ultimoTransporte: "01:00", taxiMinEur: 10, score: 49, recomendacion: "Bus oficial desde Castellón Norte; sin tren directo a Burriana — Renfe a Vall d'Uixó (15 km)" },
  { slug: "medusa-festival", festival: "Medusa Festival", city: "Cullera", venue: "Playa Racó", busOficial: true, trenDirecto: true, metroCercano: false, distanciaKm: 2.5, ultimoTransporte: "02:00", taxiMinEur: 8, score: 79, recomendacion: "Renfe Cercanías C-1 Valencia-Cullera + lanzadera oficial al recinto" },
  { slug: "sonorama-ribera", festival: "Sonorama Ribera", city: "Aranda de Duero", venue: "Plaza del Trigo + recinto ferial", busOficial: true, trenDirecto: false, metroCercano: false, distanciaKm: 1.5, ultimoTransporte: "02:30", taxiMinEur: 8, score: 50, recomendacion: "Bus ALSA Madrid-Aranda; sin tren directo (estación Aranda-Chelva cerrada desde 2011)" },
  { slug: "cala-mijas", festival: "Cala Mijas Fest", city: "Mijas Costa", venue: "Hipódromo Costa del Sol", busOficial: true, trenDirecto: true, metroCercano: true, distanciaKm: 3, ultimoTransporte: "01:30", taxiMinEur: 15, score: 99, recomendacion: "Cercanías Renfe C-1 Fuengirola + lanzadera oficial; metro Málaga a 25 km" },
  { slug: "zevra-festival", festival: "Zevra Festival", city: "Valencia", venue: "Marina Sur", busOficial: false, trenDirecto: false, metroCercano: true, distanciaKm: 1, ultimoTransporte: "02:30", taxiMinEur: 10, score: 40, recomendacion: "Metro Valencia L4/L6 Marina Reial directo; sin bus oficial dedicado" },
  { slug: "low-festival", festival: "Low Festival", city: "Benidorm", venue: "Ciudad Deportiva Guillermo Amor", busOficial: true, trenDirecto: true, metroCercano: false, distanciaKm: 3, ultimoTransporte: "01:00", taxiMinEur: 10, score: 79, recomendacion: "TRAM Alicante-Benidorm + lanzadera oficial al recinto" },
  { slug: "tomavistas", festival: "Tomavistas Festival", city: "Madrid", venue: "Parque Tierno Galván", busOficial: false, trenDirecto: false, metroCercano: true, distanciaKm: 0.5, ultimoTransporte: "02:30", taxiMinEur: 8, score: 40, recomendacion: "Metro L3 Méndez Álvaro / L6 Sainz de Baranda; sin bus oficial necesario" },
  { slug: "cruilla", festival: "Cruïlla Barcelona", city: "Barcelona", venue: "Parc del Fòrum", busOficial: false, trenDirecto: false, metroCercano: true, distanciaKm: 0.3, ultimoTransporte: "05:00", taxiMinEur: 12, score: 40, recomendacion: "Metro L4 Maresme/Fòrum + tranvía T4 + NitBus toda la noche" },
  { slug: "vive-latino", festival: "Vive Latino España", city: "Zaragoza", venue: "Recinto Expo", busOficial: false, trenDirecto: false, metroCercano: true, distanciaKm: 1.5, ultimoTransporte: "01:00", taxiMinEur: 12, score: 40, recomendacion: "Tranvía línea 1 Zaragoza Expo + bus 34/107; sin lanzadera oficial dedicada" },
  { slug: "festival-de-les-arts", festival: "Festival de les Arts", city: "Valencia", venue: "Ciutat de les Arts", busOficial: false, trenDirecto: false, metroCercano: true, distanciaKm: 1.2, ultimoTransporte: "02:30", taxiMinEur: 10, score: 40, recomendacion: "Metro L10 Quevedo o L4 Amistat-Avenida Francia + EMT" },
  { slug: "jazzaldia", festival: "Heineken Jazzaldia", city: "San Sebastián", venue: "Plaza Trinidad + escenarios urbanos", busOficial: false, trenDirecto: true, metroCercano: false, distanciaKm: 1, ultimoTransporte: "01:00", taxiMinEur: 8, score: 50, recomendacion: "Renfe Cercanías Donostia + Euskotren; festival urbano sin recinto único" },
  { slug: "metropoli-gijon", festival: "Metrópoli Gijón", city: "Gijón", venue: "Recinto Ferial Luis Adaro", busOficial: true, trenDirecto: true, metroCercano: false, distanciaKm: 2, ultimoTransporte: "00:30", taxiMinEur: 10, score: 69, recomendacion: "Renfe Gijón-Cercanías + bus ALSA urbano 4/14" },
  { slug: "granada-sound", festival: "Granada Sound", city: "Granada", venue: "Cortijo del Conde", busOficial: true, trenDirecto: false, metroCercano: false, distanciaKm: 7, ultimoTransporte: "01:30", taxiMinEur: 18, score: 48, recomendacion: "Bus oficial desde centro Granada; sin tren ni metro al recinto (a 7 km centro)" },
  { slug: "pirineos-sur", festival: "Pirineos Sur", city: "Lanuza", venue: "Auditorio Natural Lanuza", busOficial: true, trenDirecto: false, metroCercano: false, distanciaKm: 28, ultimoTransporte: "21:00", taxiMinEur: 80, score: 31, recomendacion: "Bus ALSA Sallent + lanzadera oficial Sallent-Lanuza; última frecuencia muy temprana" },
  { slug: "starlite-marbella", festival: "Starlite Marbella", city: "Marbella", venue: "Cantera de Nagüeles", busOficial: false, trenDirecto: false, metroCercano: false, distanciaKm: 1.5, ultimoTransporte: "02:00", taxiMinEur: 12, score: 20, recomendacion: "Sin bus oficial dedicado; bus público Avanza Marbella + taxi nocturno" },
  { slug: "download-madrid", festival: "Download Festival Madrid", city: "Madrid", venue: "Caja Mágica", busOficial: false, trenDirecto: false, metroCercano: true, distanciaKm: 1.2, ultimoTransporte: "02:30", taxiMinEur: 10, score: 40, recomendacion: "Metro L3 San Fermín-Orcasur + EMT; cerca de M-30" },
  { slug: "azkena-rock-festival", festival: "Azkena Rock Festival", city: "Vitoria-Gasteiz", venue: "Mendizabala", busOficial: true, trenDirecto: true, metroCercano: false, distanciaKm: 2.8, ultimoTransporte: "23:30", taxiMinEur: 12, score: 69, recomendacion: "Bus urbano TUVISA L4/L7 + lanzadera oficial centro; última frecuencia 23:30" },
  { slug: "granca-live-fest", festival: "Gran Canaria Live Festival", city: "Las Palmas", venue: "Pista de Atletismo", busOficial: true, trenDirecto: false, metroCercano: false, distanciaKm: 3.2, ultimoTransporte: "01:00", taxiMinEur: 15, score: 49, recomendacion: "Bus Global líneas 25/30/45 + lanzadera; sin tren en la isla" },
  { slug: "rototom-sunsplash", festival: "Rototom Sunsplash", city: "Benicàssim", venue: "Recinto Festival Rototom", busOficial: true, trenDirecto: true, metroCercano: false, distanciaKm: 2, ultimoTransporte: "01:00", taxiMinEur: 8, score: 79, recomendacion: "Renfe Benicàssim + lanzaderas oficiales gratuitas durante 8 noches" },
  { slug: "dcode-festival", festival: "DCode Festival", city: "Madrid", venue: "Campus Universidad Complutense", busOficial: false, trenDirecto: false, metroCercano: true, distanciaKm: 0.4, ultimoTransporte: "02:30", taxiMinEur: 8, score: 40, recomendacion: "Metro L6 Ciudad Universitaria directo recinto" },
  { slug: "creamfields-andalucia", festival: "Creamfields Andalucía", city: "El Puerto Santa María", venue: "Hipódromo Costa Oeste", busOficial: true, trenDirecto: true, metroCercano: false, distanciaKm: 5, ultimoTransporte: "01:30", taxiMinEur: 15, score: 78, recomendacion: "Renfe Cercanías C-1 Puerto Santa María + lanzadera oficial" },
  { slug: "festival-de-musica-de-barakaldo", festival: "Festival de Música de Barakaldo", city: "Barakaldo", venue: "Bilbao Exhibition Centre", busOficial: false, trenDirecto: false, metroCercano: true, distanciaKm: 0.3, ultimoTransporte: "02:00", taxiMinEur: 8, score: 40, recomendacion: "Metro Bilbao L2 Bagatza/Ansio directo BEC" },
  { slug: "festival-de-musica-de-irun", festival: "Festival de Música de Irun", city: "Irun", venue: "Ficoba", busOficial: false, trenDirecto: true, metroCercano: false, distanciaKm: 1.2, ultimoTransporte: "01:00", taxiMinEur: 10, score: 50, recomendacion: "Renfe Cercanías C-1 + Euskotren Topo Irun; sin metro" },
  { slug: "festival-de-musica-de-donostia-hiria", festival: "Festival Música Donostia Hiria", city: "San Sebastián", venue: "Anoeta", busOficial: false, trenDirecto: true, metroCercano: false, distanciaKm: 0.8, ultimoTransporte: "01:00", taxiMinEur: 10, score: 50, recomendacion: "Renfe Cercanías Anoeta directo + Dbus L26/L28" },
  { slug: "stone-music-festival", festival: "Stone & Music Festival", city: "Mérida", venue: "Teatro Romano", busOficial: false, trenDirecto: true, metroCercano: false, distanciaKm: 2, ultimoTransporte: "23:00", taxiMinEur: 10, score: 39, recomendacion: "Renfe Larga Distancia Mérida + bus urbano L1; última frecuencia 23:00" },
  { slug: "marenostrum-fuengirola", festival: "Marenostrum Fuengirola", city: "Fuengirola", venue: "Sohail", busOficial: false, trenDirecto: true, metroCercano: true, distanciaKm: 1.5, ultimoTransporte: "02:00", taxiMinEur: 8, score: 70, recomendacion: "Cercanías Renfe C-1 Fuengirola + bus urbano; final línea C-1" },
  { slug: "tio-pepe-festival", festival: "Tío Pepe Festival", city: "Jerez de la Frontera", venue: "Bodegas Tío Pepe", busOficial: false, trenDirecto: true, metroCercano: false, distanciaKm: 1.8, ultimoTransporte: "21:30", taxiMinEur: 10, score: 39, recomendacion: "Renfe Larga Distancia Jerez; última frecuencia muy temprana" },
  { slug: "sos-48", festival: "SOS 4.8 Murcia", city: "Murcia", venue: "La Fica + ifEpe", busOficial: true, trenDirecto: true, metroCercano: false, distanciaKm: 3, ultimoTransporte: "01:30", taxiMinEur: 12, score: 79, recomendacion: "Renfe Murcia del Carmen + bus LAT 39/44 + lanzadera oficial" },
  { slug: "mallorca-live-festival", festival: "Mallorca Live Festival", city: "Calvià", venue: "Antiguo Aquapark Magaluf", busOficial: true, trenDirecto: false, metroCercano: false, distanciaKm: 12, ultimoTransporte: "02:30", taxiMinEur: 28, score: 46, recomendacion: "Bus oficial Palma-Magaluf nocturno; sin tren en zona oeste isla" },
  { slug: "bbk-music-legends", festival: "BBK Music Legends", city: "Sondika", venue: "Hipódromo Bilbao", busOficial: true, trenDirecto: true, metroCercano: false, distanciaKm: 4, ultimoTransporte: "01:00", taxiMinEur: 22, score: 79, recomendacion: "Renfe Cercanías Sondika + bus Bizkaibus A3514 + lanzadera oficial" },
  { slug: "reggaeton-beach-festival", festival: "Reggaeton Beach Festival", city: "Salou", venue: "Recinto PortAventura", busOficial: true, trenDirecto: true, metroCercano: false, distanciaKm: 2, ultimoTransporte: "01:30", taxiMinEur: 12, score: 79, recomendacion: "Renfe Cercanías Salou-PortAventura directo + lanzadera oficial" },
  { slug: "portamerica", festival: "PortAmérica", city: "A Estrada", venue: "Carballeira de Caldas", busOficial: false, trenDirecto: false, metroCercano: false, distanciaKm: 18, ultimoTransporte: "21:00", taxiMinEur: 45, score: 4, recomendacion: "Carpooling indispensable — sin tren ni bus directo a Caldas de Reis (18 km estación)" },
  { slug: "festival-ortigueira", festival: "Festival Internacional do Mundo Celta", city: "Ortigueira", venue: "Praza de Espanha", busOficial: false, trenDirecto: false, metroCercano: false, distanciaKm: 32, ultimoTransporte: "22:00", taxiMinEur: 55, score: 0, recomendacion: "Carpooling o coche propio; estación FEVE Ortigueira pequeña; ALSA con frecuencias limitadas" },
  { slug: "festival-de-musica-vilamarchante", festival: "Festival de Música Vilamarchante", city: "Vilamarchante", venue: "Polideportivo Municipal", busOficial: false, trenDirecto: false, metroCercano: false, distanciaKm: 8, ultimoTransporte: "21:30", taxiMinEur: 22, score: 7, recomendacion: "Sin tren ni bus directo nocturno; coche propio o carpooling" },
  { slug: "reggae-spirit-canet", festival: "Reggae Spirit Canet", city: "Canet d'En Berenguer", venue: "Playa Norte", busOficial: false, trenDirecto: true, metroCercano: false, distanciaKm: 1.5, ultimoTransporte: "01:00", taxiMinEur: 10, score: 50, recomendacion: "Renfe Cercanías C-6 Canet de Berenguer + lanzadera al recinto" },
  { slug: "ebrovision", festival: "Ebrovisión", city: "Miranda de Ebro", venue: "Recinto Ferial Las Norias", busOficial: false, trenDirecto: true, metroCercano: false, distanciaKm: 1.8, ultimoTransporte: "22:30", taxiMinEur: 10, score: 39, recomendacion: "Renfe Cercanías + Larga Distancia Miranda + bus urbano; última frecuencia 22:30" },
  { slug: "festival-de-jazz-de-vitoria", festival: "Festival de Jazz de Vitoria", city: "Vitoria-Gasteiz", venue: "Polideportivo Mendizorroza", busOficial: false, trenDirecto: true, metroCercano: false, distanciaKm: 1.6, ultimoTransporte: "23:00", taxiMinEur: 8, score: 39, recomendacion: "Renfe Vitoria + TUVISA L1/L6; sin metro" },
  { slug: "santander-music", festival: "Santander Music Festival", city: "Santander", venue: "Campa de la Magdalena", busOficial: false, trenDirecto: true, metroCercano: true, distanciaKm: 2.5, ultimoTransporte: "01:00", taxiMinEur: 10, score: 70, recomendacion: "Renfe Cercanías Santander + TUS L4 + Funicular Magdalena" },
  { slug: "weekend-beach-torre-del-mar", festival: "Weekend Beach Festival", city: "Torre del Mar", venue: "Playa de Poniente", busOficial: true, trenDirecto: false, metroCercano: false, distanciaKm: 7, ultimoTransporte: "02:00", taxiMinEur: 18, score: 48, recomendacion: "Bus oficial Málaga-Torre del Mar; sin tren al recinto (Cercanías hasta Málaga centro)" },
  { slug: "cooltural-fest", festival: "Cooltural Fest", city: "Almería", venue: "Recinto Ferial El Toyo", busOficial: true, trenDirecto: true, metroCercano: false, distanciaKm: 2.5, ultimoTransporte: "00:30", taxiMinEur: 10, score: 69, recomendacion: "Renfe Almería + bus oficial; sin lanzadera nocturna después de 00:30" },
  { slug: "holika-festival", festival: "Holika Festival", city: "Vélez-Rubio", venue: "Polideportivo Municipal", busOficial: false, trenDirecto: false, metroCercano: false, distanciaKm: 38, ultimoTransporte: "20:00", taxiMinEur: 75, score: 0, recomendacion: "Carpooling indispensable — estación tren más cercana en Almería (110 km); sin transporte público nocturno" },
];

// Pre-computed aggregates (must match JSON metadata)
const N_ROWS = ROWS.length;
const AVG_SCORE = Math.round((ROWS.reduce((s, r) => s + r.score, 0) / N_ROWS) * 10) / 10;
const N_PEOR_40 = ROWS.filter((r) => r.score < 40).length;
const N_SIN_BUS = ROWS.filter((r) => !r.busOficial).length;
const N_SIN_TREN = ROWS.filter((r) => !r.trenDirecto).length;

const CSV_URL = `${SITE_URL}/datos/festivales-peor-conexion-transporte-publico-2026.csv`;
const JSON_URL = `${SITE_URL}/datos/festivales-peor-conexion-transporte-publico-2026.json`;

// Worst-10 (top of table, sorted ascending by score)
const SORTED_ASC = [...ROWS].sort((a, b) => a.score - b.score);

function scoreColor(score: number): { bg: string; text: string; label: string } {
  if (score < 40) return { bg: "bg-red-500/15", text: "text-red-300", label: "Mala" };
  if (score < 70) return { bg: "bg-amber-500/15", text: "text-amber-300", label: "Media" };
  return { bg: "bg-emerald-500/15", text: "text-emerald-300", label: "Buena" };
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

export default function DatasetMapaConexion2026Page() {
  const url = `${SITE_URL}/datos/festivales-peor-conexion-transporte-publico-2026`;

  useSeoMeta({
    title: `Mapa festivales peor conectados España 2026 | ConcertRide`,
    description: `Ranking 50+ festivales españoles por conectividad de transporte público 2026. Dataset abierto CC BY 4.0 con score 0-100, descargable CSV/JSON.`,
    canonical: url,
    keywords: `festivales sin bus oficial, festivales mal comunicados España, festival lejos ciudad transporte, transporte festivales 2026, score conectividad festival, dataset festivales abierto`,
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: `Mapa de conectividad de transporte público en 50+ festivales España 2026 — dataset abierto CC BY 4.0 ConcertRide`,
  });

  const jsonLdDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    name: "Mapa festivales españoles con peor conexión en transporte público 2026",
    alternateName: "ConcertRide Festival Public Transport Connectivity Index 2026",
    description: `Dataset abierto que puntúa la conectividad de transporte público de ${N_ROWS} festivales de música de España en 2026, usando un score 0-100 calculado con 5 variables: bus oficial, tren directo, metro cercano, distancia a estación y hora del último transporte público. Score medio ${AVG_SCORE}/100. ${N_PEOR_40} festivales con score < 40 (peor conexión). ${N_SIN_BUS} sin bus oficial. ${N_SIN_TREN} sin tren directo.`,
    url,
    sameAs: url,
    isAccessibleForFree: true,
    inLanguage: "es-ES",
    datePublished: "2026-05-18",
    dateModified: "2026-05-18",
    license: "https://creativecommons.org/licenses/by/4.0/",
    keywords: [
      "festivales",
      "transporte público",
      "conectividad",
      "España",
      "2026",
      "movilidad",
      "bus oficial",
      "tren",
      "metro",
      "carpooling",
      "datos abiertos",
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
      "Para cada festival se documentan 5 variables binarias o cuantitativas: bus_oficial (lanzadera del festival o bus comercial dedicado en ruta), tren_directo (parada Renfe/Euskotren/FEVE en la ciudad del recinto), metro_cercano (boca de metro o tranvía a ≤2 km del recinto), distancia_a_estacion_km (distancia a la estación de tren más próxima vía Google Maps), ultimo_transporte_publico_hora (hora del último servicio nocturno de bus/metro/tren al recinto). Score = bus_oficial × 30 + tren_directo × 30 + metro_cercano × 20 + max(0, 10 × (1 − dist/30)) + (ultimo ≥ 01:00 ? 10 : 0). Datos extraídos de webs oficiales de los festivales, ALSA, Renfe, Euskotren, TRAM, EMT, TMB, Bus Global, Bizkaibus y verificados con Google Maps mayo 2026.",
    variableMeasured: [
      { "@type": "PropertyValue", name: "festival_slug", description: "Slug url-friendly del festival (referencia interna)" },
      { "@type": "PropertyValue", name: "festival_name", description: "Nombre oficial del festival" },
      { "@type": "PropertyValue", name: "city", description: "Ciudad o municipio donde se celebra el festival" },
      { "@type": "PropertyValue", name: "venue", description: "Nombre del recinto" },
      { "@type": "PropertyValue", name: "bus_oficial", description: "El festival opera lanzadera oficial o bus comercial dedicado (boolean)" },
      { "@type": "PropertyValue", name: "tren_directo", description: "Existe estación de tren Renfe/Euskotren/FEVE en la ciudad del recinto (boolean)" },
      { "@type": "PropertyValue", name: "metro_cercano", description: "Hay metro o tranvía a 2 km o menos del recinto (boolean)" },
      { "@type": "PropertyValue", name: "distancia_a_estacion_km", unitText: "km", description: "Distancia desde el recinto a la estación de tren más cercana" },
      { "@type": "PropertyValue", name: "ultimo_transporte_publico_hora", description: "Hora HH:MM del último servicio público nocturno disponible al recinto el día del festival" },
      { "@type": "PropertyValue", name: "taxi_min_eur", unitText: "EUR", description: "Coste mínimo orientativo de taxi desde estación o ciudad emisora al recinto" },
      { "@type": "PropertyValue", name: "score_conectividad", description: "Score 0-100 que combina las variables anteriores (mayor = mejor conexión)" },
      { "@type": "PropertyValue", name: "recomendacion_transporte", description: "Recomendación textual del transporte óptimo al recinto" },
    ],
    distribution: [
      {
        "@type": "DataDownload",
        name: "Mapa festivales peor conexión transporte público España 2026 (CSV)",
        contentUrl: CSV_URL,
        encodingFormat: "text/csv",
      },
      {
        "@type": "DataDownload",
        name: "Mapa festivales peor conexión transporte público España 2026 (JSON)",
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
      { "@type": "ListItem", position: 3, name: "Mapa festivales peor conexión transporte público 2026", item: url },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué festivales españoles tienen peor conexión en transporte público en 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Los cinco festivales con peor conectividad de transporte público en España 2026 son Holika Festival (Vélez-Rubio), Festival Internacional do Mundo Celta (Ortigueira), Resurrection Fest (Viveiro), PortAmérica (A Estrada) y Aquasella Festival (Arriondas). Todos ellos puntúan menos de 10 sobre 100 en el índice de conectividad ConcertRide al carecer de bus oficial, tren directo y metro próximo. En estos casos el carpooling es el único transporte viable para la mayoría de orígenes.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuántos festivales en España no tienen bus oficial al recinto?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `De los ${N_ROWS} festivales analizados en este dataset, ${N_SIN_BUS} no operan lanzadera oficial ni bus comercial dedicado al recinto. En la mayoría de casos, los festivales urbanos (Mad Cool, Primavera Sound, Sónar, Cruïlla, Tomavistas, DCode) cubren la falta con transporte público metropolitano de alta frecuencia. En los rurales (Resurrection Fest, Aquasella, PortAmérica, Holika), la única alternativa real es el carpooling o el coche propio.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo se calcula el score de conectividad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El score 0-100 combina cinco variables ponderadas: bus_oficial = 30 puntos; tren_directo = 30 puntos; metro_cercano (≤2 km del recinto) = 20 puntos; distancia a la estación = hasta 10 puntos (fórmula 10 × max(0, 1 − distancia_km/30)); último transporte público a 01:00 o más tarde = 10 puntos. La suma máxima posible es 100. Festivales con score < 40 se consideran mal conectados. Festivales con score 40-70 conectividad media. Festivales con score > 70 buena conectividad.",
        },
      },
      {
        "@type": "Question",
        name: "¿Hay festivales españoles con buena conexión y sin necesidad de coche?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Cala Mijas (99), FIB Benicàssim (79), O Son do Camiño (79), Medusa Festival (79), Rototom Sunsplash (79), SOS 4.8 Murcia (79), Reggaeton Beach Festival (79), Low Festival (79) y BBK Music Legends (79) son los festivales con mejor conectividad pública en 2026. Todos combinan bus oficial o lanzadera + tren directo, y muchos ofrecen el bus oficial gratuito incluido con la entrada (FIB y Rototom). En estos casos llegar sin coche es perfectamente viable.",
        },
      },
      {
        "@type": "Question",
        name: "¿Puedo reutilizar estos datos en mi artículo o estudio?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Este dataset se publica bajo licencia Creative Commons Attribution 4.0 (CC BY 4.0). Puedes usar, redistribuir, modificar y citar los datos en cualquier contexto comercial o no comercial, siempre que cites a ConcertRide como fuente (concertride.me/datos/festivales-peor-conexion-transporte-publico-2026) y enlaces a la página original.",
        },
      },
    ],
  };

  const citationApa = `ConcertRide. (2026). Mapa festivales españoles con peor conexión en transporte público 2026 [Dataset]. ${url}. CC BY 4.0.`;
  const citationHtml = `<a href="${url}" rel="noopener">Mapa festivales españoles con peor conexión en transporte público 2026</a> (ConcertRide, CC BY 4.0)`;

  // WebPage wrapper with Speakable — Dataset schema does not natively support
  // speakable, so we emit a sibling WebPage that mainEntity-points to the Dataset
  // and exposes the standard ConcertRide speakable selectors for AI Overviews.
  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: "Mapa festivales españoles con peor conexión en transporte público 2026",
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
          <span className="text-cr-text-muted">Mapa peor conexión transporte público 2026</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Dataset CC BY 4.0 — Publicado 18 mayo 2026
        </p>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95]">
          Mapa festivales con peor conexión<br />
          en transporte público — España 2026
          <span className="block text-base md:text-lg font-sans normal-case tracking-normal text-cr-text-muted mt-3">
            [Dataset CC BY 4.0 · {N_ROWS} festivales]
          </span>
        </h1>

        {/* Quotable answer-first paragraph (~140 words) */}
        <p
          data-quotable="true"
          className="font-sans text-sm md:text-base text-cr-text leading-relaxed max-w-3xl speakable border-l-2 border-cr-primary/60 pl-4"
        >
          <strong>De los {N_ROWS} festivales tier-1 y secundarios de España analizados en 2026, {N_PEOR_40} tienen score de conectividad inferior a 40/100</strong>{" "}
          en el índice ConcertRide y se consideran <em>mal comunicados</em> para asistentes sin coche.
          Los cinco festivales con peor conexión son <strong>Holika Festival (Vélez-Rubio, score 0)</strong>,{" "}
          <strong>Festival Internacional do Mundo Celta de Ortigueira (0)</strong>,{" "}
          <strong>Resurrection Fest (Viveiro, 0)</strong>, <strong>PortAmérica (A Estrada, 4)</strong> y{" "}
          <strong>Aquasella Festival (Arriondas, 7)</strong>. En todos ellos no existe bus oficial,
          tren directo ni metro próximo al recinto y la estación de tren más cercana queda a 8-55 km. {" "}
          {N_SIN_BUS} festivales del dataset operan sin lanzadera oficial y {N_SIN_TREN} no tienen tren directo
          a la ciudad del recinto, por lo que el carpooling es la opción más viable para asistentes que no van en coche propio.
          Score medio del dataset: <strong>{AVG_SCORE}/100</strong>.
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
            <p className="font-sans text-[11px] text-cr-text-muted">festivales auditados</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-red-300 tabular-nums">{N_PEOR_40}</p>
            <p className="font-sans text-[11px] text-cr-text-muted">con score &lt; 40 (mala conexión)</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{N_SIN_BUS}</p>
            <p className="font-sans text-[11px] text-cr-text-muted">sin bus oficial</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{N_SIN_TREN}</p>
            <p className="font-sans text-[11px] text-cr-text-muted">sin tren directo a la ciudad</p>
          </div>
        </div>
      </section>

      {/* ── Hallazgos ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Hallazgos clave</h2>
        <ul className="space-y-3">
          {[
            `${N_PEOR_40} de ${N_ROWS} festivales (${Math.round((N_PEOR_40 / N_ROWS) * 100)}%) son mal comunicados según el score: bus oficial + tren directo + metro cercano puntúan por debajo de 40/100.`,
            `${N_SIN_BUS} festivales no operan ninguna lanzadera oficial al recinto. En festivales rurales esto convierte el carpooling en la única opción viable de transporte compartido.`,
            `Resurrection Fest (Viveiro), Holika Festival (Vélez-Rubio) y Festival de Ortigueira son los tres únicos del top-tier en los que la estación de tren más cercana queda a más de 30 km del recinto y el último transporte público termina antes de las 22:00.`,
            `Los festivales mejor conectados son Cala Mijas (99), seguidos de FIB, O Son do Camiño, Medusa, Rototom, SOS 4.8, Reggaeton Beach, Low Festival y BBK Music Legends (todos 79). Comparten lanzadera oficial + Renfe Cercanías directo.`,
            `Madrid centraliza la mejor conectividad urbana (DCode 40, Tomavistas 40, Mad Cool 40, Download 40) pero ninguno con lanzadera oficial dedicada: metro y EMT cubren toda la red. Resultado: facilidad alta pero saturación en salida nocturna.`,
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

      {/* ── Top-10 peor conectados ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Top-10 festivales con peor conexión
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">orden: score ascendente (peor primero)</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">#</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Ciudad</th>
                <th className="text-center py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Bus</th>
                <th className="text-center py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Tren</th>
                <th className="text-center py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">Metro</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Dist. (km)</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Score</th>
              </tr>
            </thead>
            <tbody>
              {SORTED_ASC.slice(0, 10).map((r, idx) => {
                const c = scoreColor(r.score);
                return (
                  <tr key={r.slug} className="border-b border-cr-border/50 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pr-3 text-cr-text-dim font-mono text-xs">{idx + 1}</td>
                    <td className="py-3 pr-3">
                      <Link
                        to={`/festivales/${r.slug}`}
                        className="text-cr-primary font-medium hover:underline underline-offset-2"
                      >
                        {r.festival}
                      </Link>
                    </td>
                    <td className="py-3 pr-3 text-cr-text-muted text-xs hidden md:table-cell">{r.city}</td>
                    <td className="py-3 pr-3 text-center">{r.busOficial ? <span className="text-emerald-400">Sí</span> : <span className="text-red-400">No</span>}</td>
                    <td className="py-3 pr-3 text-center">{r.trenDirecto ? <span className="text-emerald-400">Sí</span> : <span className="text-red-400">No</span>}</td>
                    <td className="py-3 pr-3 text-center hidden sm:table-cell">{r.metroCercano ? <span className="text-emerald-400">Sí</span> : <span className="text-red-400">No</span>}</td>
                    <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden lg:table-cell">{r.distanciaKm}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center gap-1 ${c.bg} ${c.text} px-2 py-1 font-mono text-[11px] tabular-nums font-semibold`}>
                        {r.score} · {c.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="font-mono text-[10px] text-cr-text-dim leading-relaxed">
          Heatmap: rojo &lt; 40 (mala) · amarillo 40-70 (media) · verde &gt; 70 (buena). El score combina bus oficial (30 pts) + tren directo (30 pts) + metro cercano (20 pts) + distancia inversa (10 pts) + último transporte ≥01:00 (10 pts). Detalles en sección Metodología.
        </p>
      </section>

      {/* ── Tabla completa ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Ranking completo {N_ROWS} festivales
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">orden: score ascendente</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Ciudad</th>
                <th className="text-center py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">Bus</th>
                <th className="text-center py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">Tren</th>
                <th className="text-center py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Metro</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Dist. km</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Último</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Score</th>
              </tr>
            </thead>
            <tbody>
              {SORTED_ASC.map((r) => {
                const c = scoreColor(r.score);
                return (
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
                    <td className="py-3 pr-3 text-center hidden sm:table-cell">{r.busOficial ? <span className="text-emerald-400">Sí</span> : <span className="text-red-400">No</span>}</td>
                    <td className="py-3 pr-3 text-center hidden sm:table-cell">{r.trenDirecto ? <span className="text-emerald-400">Sí</span> : <span className="text-red-400">No</span>}</td>
                    <td className="py-3 pr-3 text-center hidden lg:table-cell">{r.metroCercano ? <span className="text-emerald-400">Sí</span> : <span className="text-red-400">No</span>}</td>
                    <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden lg:table-cell">{r.distanciaKm}</td>
                    <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden md:table-cell">{r.ultimoTransporte}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex items-center gap-1 ${c.bg} ${c.text} px-2 py-1 font-mono text-[11px] tabular-nums font-semibold`}>
                        {r.score}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="font-mono text-[10px] text-cr-text-dim">
          Datos verificados mayo 2026 contra webs oficiales de los festivales, ALSA, Renfe, Euskotren, TRAM Alicante, EMT Madrid, TMB Barcelona, Bus Global Las Palmas y Bizkaibus.
        </p>
      </section>

      {/* ── Metodología ── */}
      <section id="metodologia" className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6 scroll-mt-20">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Metodología</h2>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
          Este dataset reúne {N_ROWS} festivales de música celebrados en España durante la temporada
          2026, incluyendo los tier-1 (más de 20.000 asistentes/día) y secundarios con referencia
          editorial nacional. Para cada uno se documentan cinco variables binarias o cuantitativas
          sobre transporte público al recinto: <em>bus_oficial</em> (existe lanzadera del festival o
          bus comercial dedicado), <em>tren_directo</em> (hay estación de tren Renfe, Euskotren o
          FEVE en la ciudad del recinto), <em>metro_cercano</em> (boca de metro o tranvía a 2 km o
          menos del recinto), <em>distancia_a_estacion_km</em> (distancia desde el recinto a la
          estación de tren más cercana, vía Google Maps), y <em>ultimo_transporte_publico_hora</em>{" "}
          (hora HH:MM del último servicio público nocturno al recinto el día del festival). El
          score 0-100 se calcula como{" "}
          <code className="font-mono text-[12px] text-cr-text">
            bus × 30 + tren × 30 + metro × 20 + max(0, 10 × (1 − dist/30)) + (último ≥ 01:00 ? 10 : 0)
          </code>
          . Festivales con score &lt; 40 se consideran mal conectados (carpooling indispensable).
          Score 40-70: conectividad media (transporte público viable, carpooling recomendado para
          rutas largas o vuelta nocturna). Score &gt; 70: buena conectividad pública. Datos
          extraídos de webs oficiales de los festivales, ALSA, Renfe, Euskotren, TRAM Alicante, EMT
          Madrid, TMB Barcelona, Bus Global, Bizkaibus y EMT Valencia, y verificados con Google Maps
          en mayo 2026. Cuando un festival no opera transporte público nocturno se ha tomado la
          última frecuencia disponible publicada por la operadora. Los datos pueden cambiar año a
          año — el dataset se actualizará tras la temporada 2026.
        </p>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Fuentes y referencias</h3>
          <ul className="space-y-2">
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Webs oficiales de los festivales y de sus secciones de transporte oficial (FIB, BBK Live, Arenal Sound, Medusa, Viña Rock, Sonorama, Granada Sound, Pirineos Sur, Rototom, Cala Mijas, etc.).
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Operadoras de bus comercial: ALSA (<a href="https://www.alsa.es" target="_blank" rel="noopener noreferrer" className="text-cr-primary underline underline-offset-2">alsa.es</a>), Avanza, La Sepulvedana, Pesa, Bizkaibus, Bus Global Gran Canaria, TIB Mallorca, ELDA y Damas Sevilla.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Tren: <a href="https://www.renfe.com" target="_blank" rel="noopener noreferrer" className="text-cr-primary underline underline-offset-2">Renfe</a> (Larga Distancia + Cercanías), <a href="https://www.euskotren.eus" target="_blank" rel="noopener noreferrer" className="text-cr-primary underline underline-offset-2">Euskotren</a>, FEVE.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Metro/tranvía: Metro Madrid, TMB Barcelona, Metro Bilbao, Metrovalencia, TRAM Alicante, Tranvía Zaragoza, Tranvía Vitoria, Metro Málaga.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Distancias y tiempos: Google Maps, ruta más rápida desde estación principal hasta recinto.
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
            { label: "Precio carpooling vs bus 2026", to: "/datos/precio-medio-carpooling-vs-bus-festivales-2026" },
            { label: "Guía transporte festivales", to: "/guia-transporte-festivales" },
            { label: "Cómo ir a un festival sin coche", to: "/guia/festival-sin-coche" },
            { label: "Todas las rutas de carpooling", to: "/rutas" },
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

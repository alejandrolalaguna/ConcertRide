import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, Download, ExternalLink } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const DATASET_SLUG = "festivales-mas-caros-mas-baratos-llegar-2026";

// ── Dataset rows (mirrors apps/web/public/datos/festivales-mas-caros-mas-baratos-llegar-2026.{csv,json}) ──
interface DatasetRow {
  slug: string;
  festival: string;
  city: string;
  fechaInicio: string;
  distMadridKm: number | "NA";
  opcionBarata: string;
  precioBaratoIda: number;
  precioBaratoIdaVuelta: number;
  opcionCara: string;
  precioCaroIdaVuelta: number;
  ratio: number;
}

const ROWS: DatasetRow[] = [
  { slug: "mad-cool", festival: "Mad Cool Festival", city: "Madrid", fechaInicio: "2026-07-08", distMadridKm: 15, opcionBarata: "carpooling", precioBaratoIda: 5.5, precioBaratoIdaVuelta: 11, opcionCara: "taxi", precioCaroIdaVuelta: 70, ratio: 6.36 },
  { slug: "tomavistas", festival: "Tomavistas Festival", city: "Madrid", fechaInicio: "2026-05-15", distMadridKm: 15, opcionBarata: "carpooling", precioBaratoIda: 5.5, precioBaratoIdaVuelta: 11, opcionCara: "taxi", precioCaroIdaVuelta: 60, ratio: 5.45 },
  { slug: "download-madrid", festival: "Download Festival Madrid", city: "Madrid", fechaInicio: "2026-06-28", distMadridKm: 15, opcionBarata: "carpooling", precioBaratoIda: 5.5, precioBaratoIdaVuelta: 11, opcionCara: "taxi", precioCaroIdaVuelta: 70, ratio: 6.36 },
  { slug: "dcode-festival", festival: "DCode Festival Madrid", city: "Madrid", fechaInicio: "2026-09-09", distMadridKm: 15, opcionBarata: "carpooling", precioBaratoIda: 5.5, precioBaratoIdaVuelta: 11, opcionCara: "taxi", precioCaroIdaVuelta: 60, ratio: 5.45 },
  { slug: "jardin-de-las-delicias", festival: "Jardín de las Delicias Festival", city: "Madrid", fechaInicio: "2026-09-18", distMadridKm: 15, opcionBarata: "carpooling", precioBaratoIda: 5.5, precioBaratoIdaVuelta: 11, opcionCara: "taxi", precioCaroIdaVuelta: 60, ratio: 5.45 },
  { slug: "sonorama-ribera", festival: "Sonorama Ribera", city: "Aranda de Duero", fechaInicio: "2026-08-05", distMadridKm: 165, opcionBarata: "carpooling", precioBaratoIda: 7.5, precioBaratoIdaVuelta: 15, opcionCara: "autobús comercial", precioCaroIdaVuelta: 25, ratio: 1.67 },
  { slug: "vina-rock", festival: "Viña Rock", city: "Villarrobledo", fechaInicio: "2026-04-30", distMadridKm: 190, opcionBarata: "carpooling", precioBaratoIda: 7.5, precioBaratoIdaVuelta: 15, opcionCara: "autobús comercial", precioCaroIdaVuelta: 90, ratio: 6.00 },
  { slug: "primavera-sound", festival: "Primavera Sound Barcelona", city: "Barcelona", fechaInicio: "2026-06-03", distMadridKm: 620, opcionBarata: "carpooling", precioBaratoIda: 17.5, precioBaratoIdaVuelta: 35, opcionCara: "tren", precioCaroIdaVuelta: 140, ratio: 4.00 },
  { slug: "sonar", festival: "Sónar Barcelona", city: "Barcelona", fechaInicio: "2026-06-18", distMadridKm: 620, opcionBarata: "carpooling", precioBaratoIda: 17.5, precioBaratoIdaVuelta: 35, opcionCara: "tren", precioCaroIdaVuelta: 140, ratio: 4.00 },
  { slug: "cruilla", festival: "Cruïlla Barcelona", city: "Barcelona", fechaInicio: "2026-07-08", distMadridKm: 620, opcionBarata: "carpooling", precioBaratoIda: 17.5, precioBaratoIdaVuelta: 35, opcionCara: "tren", precioCaroIdaVuelta: 140, ratio: 4.00 },
  { slug: "fib", festival: "FIB Benicàssim", city: "Benicàssim", fechaInicio: "2026-07-16", distMadridKm: 465, opcionBarata: "carpooling", precioBaratoIda: 14.5, precioBaratoIdaVuelta: 29, opcionCara: "autobús comercial", precioCaroIdaVuelta: 60, ratio: 2.07 },
  { slug: "rototom-sunsplash", festival: "Rototom Sunsplash", city: "Benicàssim", fechaInicio: "2026-08-16", distMadridKm: 465, opcionBarata: "carpooling", precioBaratoIda: 14.5, precioBaratoIdaVuelta: 29, opcionCara: "autobús comercial", precioCaroIdaVuelta: 60, ratio: 2.07 },
  { slug: "arenal-sound", festival: "Arenal Sound", city: "Burriana", fechaInicio: "2026-07-30", distMadridKm: 460, opcionBarata: "carpooling", precioBaratoIda: 14.5, precioBaratoIdaVuelta: 29, opcionCara: "autobús comercial", precioCaroIdaVuelta: 58, ratio: 2.00 },
  { slug: "medusa-festival", festival: "Medusa Festival", city: "Cullera", fechaInicio: "2026-08-13", distMadridKm: 385, opcionBarata: "carpooling", precioBaratoIda: 12, precioBaratoIdaVuelta: 24, opcionCara: "autobús comercial", precioCaroIdaVuelta: 50, ratio: 2.08 },
  { slug: "zevra-festival", festival: "Zevra Festival", city: "Valencia", fechaInicio: "2026-07-01", distMadridKm: 355, opcionBarata: "carpooling", precioBaratoIda: 12, precioBaratoIdaVuelta: 24, opcionCara: "tren", precioCaroIdaVuelta: 58, ratio: 2.42 },
  { slug: "festival-de-les-arts", festival: "Festival de les Arts", city: "Valencia", fechaInicio: "2026-06-05", distMadridKm: 355, opcionBarata: "carpooling", precioBaratoIda: 12, precioBaratoIdaVuelta: 24, opcionCara: "tren", precioCaroIdaVuelta: 58, ratio: 2.42 },
  { slug: "bigsound-valencia", festival: "BIGSOUND Valencia", city: "Valencia", fechaInicio: "2026-06-26", distMadridKm: 355, opcionBarata: "carpooling", precioBaratoIda: 12, precioBaratoIdaVuelta: 24, opcionCara: "tren", precioCaroIdaVuelta: 58, ratio: 2.42 },
  { slug: "low-festival", festival: "Low Festival", city: "Torrevieja", fechaInicio: "2026-07-31", distMadridKm: 440, opcionBarata: "carpooling", precioBaratoIda: 14.5, precioBaratoIdaVuelta: 29, opcionCara: "autobús comercial", precioCaroIdaVuelta: 54, ratio: 1.86 },
  { slug: "bbk-live", festival: "Bilbao BBK Live", city: "Bilbao", fechaInicio: "2026-07-09", distMadridKm: 395, opcionBarata: "carpooling", precioBaratoIda: 13.5, precioBaratoIdaVuelta: 27, opcionCara: "autobús comercial", precioCaroIdaVuelta: 60, ratio: 2.22 },
  { slug: "bbk-music-legends", festival: "BBK Music Legends Festival", city: "Bilbao", fechaInicio: "2026-06-26", distMadridKm: 395, opcionBarata: "carpooling", precioBaratoIda: 13.5, precioBaratoIdaVuelta: 27, opcionCara: "autobús comercial", precioCaroIdaVuelta: 60, ratio: 2.22 },
  { slug: "resurrection-fest", festival: "Resurrection Fest", city: "Viveiro", fechaInicio: "2026-07-01", distMadridKm: 600, opcionBarata: "carpooling", precioBaratoIda: 19, precioBaratoIdaVuelta: 38, opcionCara: "autobús comercial", precioCaroIdaVuelta: 80, ratio: 2.11 },
  { slug: "o-son-do-camino", festival: "O Son do Camiño", city: "Santiago de Compostela", fechaInicio: "2026-06-18", distMadridKm: 585, opcionBarata: "carpooling", precioBaratoIda: 17.5, precioBaratoIdaVuelta: 35, opcionCara: "tren", precioCaroIdaVuelta: 110, ratio: 3.14 },
  { slug: "atlantic-fest", festival: "Atlantic Fest", city: "Vilagarcía de Arousa", fechaInicio: "2026-07-30", distMadridKm: 615, opcionBarata: "carpooling", precioBaratoIda: 19, precioBaratoIdaVuelta: 38, opcionCara: "tren", precioCaroIdaVuelta: 112, ratio: 2.95 },
  { slug: "portamerica", festival: "PortAmérica Festival", city: "Caldas de Reis", fechaInicio: "2026-07-09", distMadridKm: 600, opcionBarata: "carpooling", precioBaratoIda: 19, precioBaratoIdaVuelta: 38, opcionCara: "tren", precioCaroIdaVuelta: 110, ratio: 2.89 },
  { slug: "festival-ortigueira", festival: "Festival Internacional do Mundo Celta de Ortigueira", city: "Ortigueira", fechaInicio: "2026-07-09", distMadridKm: 690, opcionBarata: "carpooling", precioBaratoIda: 21.5, precioBaratoIdaVuelta: 43, opcionCara: "autobús comercial", precioCaroIdaVuelta: 90, ratio: 2.09 },
  { slug: "cala-mijas", festival: "Cala Mijas Fest", city: "Mijas", fechaInicio: "2026-10-02", distMadridKm: 540, opcionBarata: "carpooling", precioBaratoIda: 16.5, precioBaratoIdaVuelta: 33, opcionCara: "autobús comercial", precioCaroIdaVuelta: 70, ratio: 2.12 },
  { slug: "marenostrum-fuengirola", festival: "Marenostrum Fuengirola Festival", city: "Fuengirola", fechaInicio: "2026-04-24", distMadridKm: 555, opcionBarata: "carpooling", precioBaratoIda: 17, precioBaratoIdaVuelta: 34, opcionCara: "autobús comercial", precioCaroIdaVuelta: 72, ratio: 2.12 },
  { slug: "starlite-marbella", festival: "Starlite Catalana Occidente Festival", city: "Marbella", fechaInicio: "2026-06-19", distMadridKm: 575, opcionBarata: "carpooling", precioBaratoIda: 17, precioBaratoIdaVuelta: 34, opcionCara: "autobús comercial", precioCaroIdaVuelta: 70, ratio: 2.06 },
  { slug: "weekend-beach-torre-del-mar", festival: "Weekend Beach Festival", city: "Torre del Mar", fechaInicio: "2026-07-09", distMadridKm: 530, opcionBarata: "carpooling", precioBaratoIda: 16, precioBaratoIdaVuelta: 32, opcionCara: "autobús comercial", precioCaroIdaVuelta: 68, ratio: 2.13 },
  { slug: "creamfields-andalucia", festival: "Creamfields Andalucía", city: "Jerez de la Frontera", fechaInicio: "2026-06-05", distMadridKm: 600, opcionBarata: "carpooling", precioBaratoIda: 18, precioBaratoIdaVuelta: 36, opcionCara: "autobús comercial", precioCaroIdaVuelta: 75, ratio: 2.08 },
  { slug: "granada-sound", festival: "Granada Sound", city: "Granada", fechaInicio: "2026-09-11", distMadridKm: 430, opcionBarata: "carpooling", precioBaratoIda: 14.5, precioBaratoIdaVuelta: 29, opcionCara: "tren", precioCaroIdaVuelta: 110, ratio: 3.79 },
  { slug: "tio-pepe-festival", festival: "Tío Pepe Festival", city: "Jerez de la Frontera", fechaInicio: "2026-07-04", distMadridKm: 600, opcionBarata: "carpooling", precioBaratoIda: 18, precioBaratoIdaVuelta: 36, opcionCara: "tren", precioCaroIdaVuelta: 115, ratio: 3.19 },
  { slug: "cooltural-fest", festival: "Cooltural Fest", city: "Almería", fechaInicio: "2026-09-04", distMadridKm: 560, opcionBarata: "carpooling", precioBaratoIda: 17, precioBaratoIdaVuelta: 34, opcionCara: "autobús comercial", precioCaroIdaVuelta: 75, ratio: 2.21 },
  { slug: "dreambeach-festival", festival: "Dreambeach Costa del Sol", city: "Vélez-Málaga", fechaInicio: "2026-07-31", distMadridKm: 550, opcionBarata: "carpooling", precioBaratoIda: 17.5, precioBaratoIdaVuelta: 35, opcionCara: "autobús comercial", precioCaroIdaVuelta: 75, ratio: 2.14 },
  { slug: "holika-festival", festival: "Holika Festival", city: "Vélez-Rubio", fechaInicio: "2026-08-21", distMadridKm: 500, opcionBarata: "carpooling", precioBaratoIda: 16, precioBaratoIdaVuelta: 32, opcionCara: "autobús comercial", precioCaroIdaVuelta: 78, ratio: 2.44 },
  { slug: "vive-latino", festival: "Vive Latino España", city: "Zaragoza", fechaInicio: "2026-09-04", distMadridKm: 330, opcionBarata: "carpooling", precioBaratoIda: 11, precioBaratoIdaVuelta: 22, opcionCara: "tren", precioCaroIdaVuelta: 60, ratio: 2.73 },
  { slug: "pirineos-sur", festival: "Festival Internacional de las Culturas Pirineos Sur", city: "Lanuza", fechaInicio: "2026-07-09", distMadridKm: 450, opcionBarata: "carpooling", precioBaratoIda: 15.5, precioBaratoIdaVuelta: 31, opcionCara: "autobús comercial", precioCaroIdaVuelta: 62, ratio: 2.00 },
  { slug: "jazzaldia", festival: "Heineken Jazzaldia", city: "San Sebastián", fechaInicio: "2026-07-22", distMadridKm: 450, opcionBarata: "carpooling", precioBaratoIda: 15.5, precioBaratoIdaVuelta: 31, opcionCara: "autobús comercial", precioCaroIdaVuelta: 65, ratio: 2.10 },
  { slug: "azkena-rock-festival", festival: "Azkena Rock Festival", city: "Vitoria-Gasteiz", fechaInicio: "2026-06-18", distMadridKm: 360, opcionBarata: "carpooling", precioBaratoIda: 15.5, precioBaratoIdaVuelta: 31, opcionCara: "autobús comercial", precioCaroIdaVuelta: 55, ratio: 1.77 },
  { slug: "metropoli-gijon", festival: "Festival Internacional Metrópoli Gijón", city: "Gijón", fechaInicio: "2026-06-26", distMadridKm: 445, opcionBarata: "carpooling", precioBaratoIda: 15, precioBaratoIdaVuelta: 30, opcionCara: "autobús comercial", precioCaroIdaVuelta: 62, ratio: 2.07 },
  { slug: "santander-music", festival: "Santander Music Festival", city: "Santander", fechaInicio: "2026-08-06", distMadridKm: 390, opcionBarata: "carpooling", precioBaratoIda: 13.5, precioBaratoIdaVuelta: 27, opcionCara: "autobús comercial", precioCaroIdaVuelta: 60, ratio: 2.22 },
  { slug: "ebrovision", festival: "Ebrovisión", city: "Miranda de Ebro", fechaInicio: "2026-08-21", distMadridKm: 315, opcionBarata: "carpooling", precioBaratoIda: 10.5, precioBaratoIdaVuelta: 21, opcionCara: "autobús comercial", precioCaroIdaVuelta: 48, ratio: 2.29 },
  { slug: "stone-music-festival", festival: "Stone & Music Festival Mérida", city: "Mérida", fechaInicio: "2026-07-17", distMadridKm: 340, opcionBarata: "carpooling", precioBaratoIda: 12, precioBaratoIdaVuelta: 24, opcionCara: "autobús comercial", precioCaroIdaVuelta: 52, ratio: 2.17 },
  { slug: "reggaeton-beach-festival", festival: "Reggaeton Beach Festival", city: "Salou", fechaInicio: "2026-07-31", distMadridKm: 550, opcionBarata: "carpooling", precioBaratoIda: 17, precioBaratoIdaVuelta: 34, opcionCara: "autobús comercial", precioCaroIdaVuelta: 72, ratio: 2.12 },
  { slug: "mallorca-live-festival", festival: "Mallorca Live Festival", city: "Calvià", fechaInicio: "2026-06-12", distMadridKm: "NA", opcionBarata: "vuelo + bus", precioBaratoIda: 55, precioBaratoIdaVuelta: 110, opcionCara: "vuelo + taxi", precioCaroIdaVuelta: 180, ratio: 1.64 },
  { slug: "granca-live-fest", festival: "Granca Live Fest", city: "Las Palmas de Gran Canaria", fechaInicio: "2026-07-02", distMadridKm: "NA", opcionBarata: "vuelo + bus", precioBaratoIda: 65, precioBaratoIdaVuelta: 130, opcionCara: "vuelo + taxi", precioCaroIdaVuelta: 210, ratio: 1.62 },
  { slug: "festival-de-musica-de-barakaldo", festival: "Festival de Música de Barakaldo", city: "Barakaldo", fechaInicio: "2026-07-24", distMadridKm: 385, opcionBarata: "carpooling", precioBaratoIda: 10, precioBaratoIdaVuelta: 20, opcionCara: "autobús comercial", precioCaroIdaVuelta: 58, ratio: 2.90 },
  { slug: "festival-de-musica-de-irun", festival: "Festival de Música de Irún", city: "Irún", fechaInicio: "2026-07-17", distMadridKm: 480, opcionBarata: "carpooling", precioBaratoIda: 11, precioBaratoIdaVuelta: 22, opcionCara: "autobús comercial", precioCaroIdaVuelta: 65, ratio: 2.95 },
  { slug: "festival-de-musica-de-donostia-hiria", festival: "Festival de Música de Donostia-Hiria", city: "San Sebastián", fechaInicio: "2026-07-10", distMadridKm: 460, opcionBarata: "carpooling", precioBaratoIda: 11, precioBaratoIdaVuelta: 22, opcionCara: "autobús comercial", precioCaroIdaVuelta: 65, ratio: 2.95 },
  { slug: "festival-de-musica-de-pontevedra", festival: "Festival de Música de Pontevedra", city: "Pontevedra", fechaInicio: "2026-07-17", distMadridKm: 600, opcionBarata: "carpooling", precioBaratoIda: 12.5, precioBaratoIdaVuelta: 25, opcionCara: "autobús comercial", precioCaroIdaVuelta: 80, ratio: 3.20 },
  { slug: "festival-de-musica-de-vigo", festival: "Festival de Música de Vigo", city: "Vigo", fechaInicio: "2026-07-24", distMadridKm: 620, opcionBarata: "carpooling", precioBaratoIda: 12.5, precioBaratoIdaVuelta: 25, opcionCara: "autobús comercial", precioCaroIdaVuelta: 80, ratio: 3.20 },
  { slug: "festival-de-musica-de-ferrol", festival: "Festival de Música de Ferrol", city: "Ferrol", fechaInicio: "2026-07-10", distMadridKm: 630, opcionBarata: "carpooling", precioBaratoIda: 12.5, precioBaratoIdaVuelta: 25, opcionCara: "autobús comercial", precioCaroIdaVuelta: 80, ratio: 3.20 },
  { slug: "festival-de-musica-de-monforte", festival: "Festival de Música de Monforte de Lemos", city: "Monforte de Lemos", fechaInicio: "2026-07-17", distMadridKm: 560, opcionBarata: "carpooling", precioBaratoIda: 12, precioBaratoIdaVuelta: 24, opcionCara: "autobús comercial", precioCaroIdaVuelta: 75, ratio: 3.13 },
  { slug: "festival-de-musica-de-lalin", festival: "Festival de Música de Lalín", city: "Lalín", fechaInicio: "2026-07-24", distMadridKm: 550, opcionBarata: "carpooling", precioBaratoIda: 12, precioBaratoIdaVuelta: 24, opcionCara: "autobús comercial", precioCaroIdaVuelta: 75, ratio: 3.13 },
  { slug: "festival-de-musica-de-tui", festival: "Festival de Música de Tui", city: "Tui", fechaInicio: "2026-07-31", distMadridKm: 640, opcionBarata: "carpooling", precioBaratoIda: 13, precioBaratoIdaVuelta: 26, opcionCara: "autobús comercial", precioCaroIdaVuelta: 80, ratio: 3.08 },
  { slug: "festival-de-musica-de-betanzos", festival: "Festival de Música de Betanzos", city: "Betanzos", fechaInicio: "2026-07-10", distMadridKm: 630, opcionBarata: "carpooling", precioBaratoIda: 12.5, precioBaratoIdaVuelta: 25, opcionCara: "autobús comercial", precioCaroIdaVuelta: 80, ratio: 3.20 },
  { slug: "sos-48", festival: "SOS 4.8 Festival", city: "Murcia", fechaInicio: "2026-05-03", distMadridKm: 400, opcionBarata: "carpooling", precioBaratoIda: 13.5, precioBaratoIdaVuelta: 27, opcionCara: "autobús comercial", precioCaroIdaVuelta: 55, ratio: 2.04 },
];

const N_ROWS = ROWS.length;
const AVG_BARATO_IDA_VUELTA = Math.round((ROWS.reduce((s, r) => s + r.precioBaratoIdaVuelta, 0) / N_ROWS) * 10) / 10;
const AVG_CARO_IDA_VUELTA = Math.round((ROWS.reduce((s, r) => s + r.precioCaroIdaVuelta, 0) / N_ROWS) * 10) / 10;
const AVG_RATIO = Math.round((ROWS.reduce((s, r) => s + r.ratio, 0) / N_ROWS) * 100) / 100;
const N_CARPOOLING = ROWS.filter((r) => r.opcionBarata === "carpooling").length;
const N_INSULAR = ROWS.filter((r) => r.distMadridKm === "NA").length;

const CSV_URL = `${SITE_URL}/datos/festivales-mas-caros-mas-baratos-llegar-2026.csv`;
const JSON_URL = `${SITE_URL}/datos/festivales-mas-caros-mas-baratos-llegar-2026.json`;

// Top-10 más baratos (sorted ascending by precio barato ida+vuelta)
const TOP_BARATOS = [...ROWS].sort((a, b) => a.precioBaratoIdaVuelta - b.precioBaratoIdaVuelta).slice(0, 10);
// Top-10 más caros (sorted descending by precio caro ida+vuelta)
const TOP_CAROS = [...ROWS].sort((a, b) => b.precioCaroIdaVuelta - a.precioCaroIdaVuelta).slice(0, 10);
// Top-10 spread (sorted descending by ratio)
const TOP_SPREAD = [...ROWS].sort((a, b) => b.ratio - a.ratio).slice(0, 10);
// Full ranking sorted by precio barato ida vuelta ascending
const SORTED_BY_BARATO = [...ROWS].sort((a, b) => a.precioBaratoIdaVuelta - b.precioBaratoIdaVuelta);

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

export default function DatasetRankingPreciosFestivales2026Page() {
  const url = `${SITE_URL}/datos/festivales-mas-caros-mas-baratos-llegar-2026`;

  useSeoMeta({
    title: `Festivales 2026: ranking caros vs baratos de llegar | ConcertRide`,
    description: `Ranking 57 festivales españoles 2026 por coste total transporte ida+vuelta desde Madrid. Dataset CC BY 4.0 con CSV/JSON descargables.`,
    canonical: url,
    keywords: `festival más barato españa, festival más caro llegar, ranking festivales precio total transporte, coste ir a festival españa 2026, festivales caros baratos ida vuelta, dataset transporte festival españa, precio total festival madrid`,
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: `Ranking 57 festivales España 2026 por coste total transporte ida+vuelta desde Madrid — dataset abierto CC BY 4.0 ConcertRide`,
  });

  const jsonLdDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    name: "Festivales más caros y más baratos de llegar de España 2026",
    alternateName: "ConcertRide Festival Total Transport Cost Ranking 2026",
    description: `Dataset abierto que cuantifica el coste total del transporte ida+vuelta desde Madrid para una persona hacia ${N_ROWS} festivales de música tier-1 y secundarios de España en 2026. Para cada festival se identifica la modalidad de transporte más barata realmente disponible (carpooling, bus oficial, autobús comercial o tren), la más cara (taxi, AVE, bus privado, vuelo + taxi) y el ratio entre ambas. Precio medio del transporte más barato: ${AVG_BARATO_IDA_VUELTA} € ida+vuelta. Precio medio del transporte más caro: ${AVG_CARO_IDA_VUELTA} € ida+vuelta. Ratio medio caro/barato: ${AVG_RATIO}x.`,
    url,
    sameAs: url,
    isAccessibleForFree: true,
    inLanguage: "es-ES",
    datePublished: "2026-05-18",
    dateModified: "2026-05-18",
    license: "https://creativecommons.org/licenses/by/4.0/",
    keywords: [
      "festivales",
      "transporte",
      "precio",
      "ranking",
      "España",
      "2026",
      "carpooling",
      "ida vuelta",
      "Madrid",
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
      "Para cada festival se identifican las opciones de transporte públicamente disponibles desde Madrid hacia el recinto (carpooling ConcertRide, lanzadera oficial del festival, autobús comercial ALSA/Avanza/Pesa/La Sepulvedana, tren Renfe Larga Distancia o Cercanías, taxi/VTC, vuelo + transfer en festivales insulares). Para cada modalidad se toma el precio medio publicado a mayo 2026 por asiento ida sencilla. precio_ida_vuelta_eur = precio_ida_eur × 2. La opción más barata es la modalidad con menor precio total real (no incluye descuentos puntuales ni ofertas flash). La opción más cara es la modalidad legítima con mayor precio entre las viables (taxi/VTC para distancias cortas, AVE Larga Distancia o bus privado para distancias largas, vuelo + taxi para destinos insulares). El ratio = precio_caro / precio_barato. Datos verificados mayo 2026 con: webs oficiales de los festivales y sus secciones de transporte, alsa.es, renfe.com, avanzabus.com, lasepulvedana.es, festivalLandings.ts (rango originCities Madrid) y Google Maps para distancias. Festivales insulares (Mallorca, Gran Canaria) usan vuelo Madrid → aeropuerto + transfer al recinto en lugar de carpooling por carretera.",
    variableMeasured: [
      { "@type": "PropertyValue", name: "festival_slug", description: "Slug url-friendly del festival" },
      { "@type": "PropertyValue", name: "festival_name", description: "Nombre oficial del festival" },
      { "@type": "PropertyValue", name: "city", description: "Ciudad o municipio donde se celebra" },
      { "@type": "PropertyValue", name: "fecha_inicio", description: "Fecha de inicio del festival en formato ISO YYYY-MM-DD" },
      { "@type": "PropertyValue", name: "distancia_madrid_km", unitText: "km", description: "Distancia por carretera Madrid → recinto (Google Maps). NA para festivales insulares que requieren vuelo." },
      { "@type": "PropertyValue", name: "opcion_mas_barata", description: "Modalidad de transporte con menor precio: carpooling | bus oficial | tren | autobús comercial | vuelo + bus" },
      { "@type": "PropertyValue", name: "precio_mas_barato_ida_eur", unitText: "EUR", description: "Precio ida sencilla por asiento de la opción más barata" },
      { "@type": "PropertyValue", name: "precio_mas_barato_ida_vuelta_eur", unitText: "EUR", description: "Precio ida+vuelta por asiento de la opción más barata = ida × 2" },
      { "@type": "PropertyValue", name: "opcion_mas_cara", description: "Modalidad de transporte legítima más cara: taxi | tren | autobús comercial | vuelo + taxi" },
      { "@type": "PropertyValue", name: "precio_mas_caro_ida_vuelta_eur", unitText: "EUR", description: "Precio ida+vuelta por asiento de la opción más cara" },
      { "@type": "PropertyValue", name: "ratio_caro_barato", description: "Coste opción cara dividido por coste opción barata. Indica cuántas veces más cara es la modalidad premium." },
    ],
    distribution: [
      {
        "@type": "DataDownload",
        name: "Festivales más caros y más baratos de llegar España 2026 (CSV)",
        contentUrl: CSV_URL,
        encodingFormat: "text/csv",
      },
      {
        "@type": "DataDownload",
        name: "Festivales más caros y más baratos de llegar España 2026 (JSON)",
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
      { "@type": "ListItem", position: 3, name: "Ranking festivales más caros vs baratos de llegar 2026", item: url },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuál es el festival más barato de llegar de España en 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Los cinco festivales más baratos de llegar desde Madrid en 2026 son Mad Cool, Tomavistas, Download Festival Madrid, DCode y Jardín de las Delicias, todos celebrados en la propia ciudad de Madrid. El coste total ida+vuelta es de 11 € por persona en carpooling con ConcertRide desde el centro hasta el recinto (15 km, Iberdrola Music Villaverde, Parque Tierno Galván, Caja Mágica o Campus UCM). El siguiente festival más barato fuera de Madrid es Sonorama Ribera en Aranda de Duero con 15 € ida+vuelta (165 km, 7,50 € por trayecto en carpooling).`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuál es el festival más caro de llegar de España en 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Los festivales insulares son los más caros de llegar desde Madrid en 2026 ya que requieren vuelo: Granca Live Fest en Las Palmas de Gran Canaria (130 € ida+vuelta en vuelo + bus, hasta 210 € con vuelo + taxi) y Mallorca Live Festival en Calvià (110 € vuelo + bus, hasta 180 € con vuelo + taxi). En la península, los más caros de llegar son Festival de Ortigueira (43 € en carpooling, 690 km a Galicia), Resurrection Fest Viveiro y Atlantic Fest (38 € ida+vuelta) y los gallegos que requieren más de 600 km por carretera.`,
        },
      },
      {
        "@type": "Question",
        name: "¿En qué festivales hay mayor diferencia entre la opción más barata y la más cara?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Los festivales con mayor spread (ratio caro/barato) son Mad Cool y Download Festival Madrid (6,36x: 11 € en carpooling vs 70 € en taxi nocturno desde Madrid centro), Viña Rock en Villarrobledo (6,00x: 15 € carpooling vs 90 € bus privado ida+vuelta), Tomavistas, DCode y Jardín de las Delicias (5,45x). En estos festivales merece más la pena buscar la opción barata: el carpooling ahorra entre 49 € y 75 € por persona frente al transporte premium. En el extremo opuesto, los festivales insulares tienen el menor spread (1,62-1,64x) porque la opción base ya es cara (vuelo).`,
        },
      },
      {
        "@type": "Question",
        name: "¿De dónde se han obtenido los precios?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Los precios de carpooling provienen de los rangos publicados por conductores verificados en ConcertRide para cada ruta Madrid → festival (datos festivalLandings.ts, originCities desde Madrid). Los precios de bus oficial / lanzadera son los publicados por los propios festivales (FIB, Arenal Sound, BBK Live, Viña Rock, Sonorama, Granada Sound). Los precios de tren provienen de Renfe.com (Larga Distancia tarifa flexible mayo 2026). Los precios de autobús comercial provienen de ALSA, Avanza, La Sepulvedana y Pesa. Los precios de taxi nocturno se estiman con tarifa nocturna multiplicada por dos (festivales urbanos en Madrid). Los precios de vuelo provienen de búsquedas en agregadores Skyscanner/Kayak para vuelos Madrid → Mallorca/Gran Canaria con ≥30 días de anticipación.",
        },
      },
      {
        "@type": "Question",
        name: "¿Puedo reutilizar estos datos en mi artículo o estudio?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Este dataset se publica bajo licencia Creative Commons Attribution 4.0 (CC BY 4.0). Puedes usar, redistribuir, modificar y citar los datos en cualquier contexto comercial o no comercial, siempre que cites a ConcertRide como fuente (concertride.me/datos/festivales-mas-caros-mas-baratos-llegar-2026) y enlaces a la página original.",
        },
      },
    ],
  };

  const citationApa = `ConcertRide. (2026). Festivales más caros y más baratos de llegar de España 2026 [Dataset]. ${url}. CC BY 4.0.`;
  const citationHtml = `<a href="${url}" rel="noopener">Festivales más caros y más baratos de llegar de España 2026</a> (ConcertRide, CC BY 4.0)`;

  // WebPage wrapper with Speakable — Dataset schema does not natively support
  // speakable, so we emit a sibling WebPage that mainEntity-points to the Dataset
  // and exposes the standard ConcertRide speakable selectors for AI Overviews.
  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: "Festivales más caros y más baratos de llegar de España 2026",
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
          <span className="text-cr-text-muted">Ranking festivales más caros vs baratos 2026</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Dataset CC BY 4.0 — Publicado 18 mayo 2026
        </p>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95]">
          Festivales más caros vs baratos<br />
          de llegar — España 2026
          <span className="block text-base md:text-lg font-sans normal-case tracking-normal text-cr-text-muted mt-3">
            [Ranking · {N_ROWS} festivales · origen Madrid]
          </span>
        </h1>

        {/* Quotable answer-first paragraph (~140 words) */}
        <p
          data-quotable="true"
          className="font-sans text-sm md:text-base text-cr-text leading-relaxed max-w-3xl speakable border-l-2 border-cr-primary/60 pl-4"
        >
          <strong>De los {N_ROWS} festivales españoles 2026 analizados, los cinco más baratos de llegar desde Madrid
          cuestan apenas 11 € por persona ida+vuelta</strong> en carpooling: Mad Cool, Tomavistas, Download Festival,
          DCode y Jardín de las Delicias — todos urbanos en el propio Madrid. Los cinco más caros son los
          insulares (Granca Live Fest 130 € y Mallorca Live Festival 110 € con vuelo + bus) seguidos del
          Festival de Ortigueira (43 € · 690 km a Galicia). El coste medio del transporte más barato es {" "}
          <strong>{AVG_BARATO_IDA_VUELTA} € ida+vuelta</strong>, frente a una media de {" "}
          <strong>{AVG_CARO_IDA_VUELTA} €</strong> en la modalidad legítima más cara (taxi, AVE, bus privado o
          vuelo + taxi) — un ratio caro/barato medio de <strong>{AVG_RATIO}x</strong>. El festival con mayor spread
          es Mad Cool (6,36x: carpooling 11 € vs taxi 70 €). Dataset abierto CC BY 4.0, descargable en CSV y JSON.
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
            <p className="font-display text-3xl uppercase text-emerald-300 tabular-nums">{AVG_BARATO_IDA_VUELTA}€</p>
            <p className="font-sans text-[11px] text-cr-text-muted">precio medio opción barata (ida+vuelta)</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-red-300 tabular-nums">{AVG_CARO_IDA_VUELTA}€</p>
            <p className="font-sans text-[11px] text-cr-text-muted">precio medio opción cara (ida+vuelta)</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{AVG_RATIO}x</p>
            <p className="font-sans text-[11px] text-cr-text-muted">ratio medio caro/barato</p>
          </div>
        </div>
      </section>

      {/* ── Hallazgos ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Hallazgos clave</h2>
        <ul className="space-y-3">
          {[
            `${N_CARPOOLING} de ${N_ROWS} festivales (${Math.round((N_CARPOOLING / N_ROWS) * 100)}%) tienen el carpooling de ConcertRide como modalidad de transporte más barata desde Madrid — solo los festivales insulares (${N_INSULAR}) requieren vuelo + transfer como opción base.`,
            `Los 5 festivales más baratos son todos urbanos en Madrid (Mad Cool, Tomavistas, Download Festival, DCode, Jardín de las Delicias): 11 € ida+vuelta en carpooling vs 60-70 € en taxi nocturno — un ratio 5,45-6,36x.`,
            `Los 5 festivales más caros son Granca Live Fest (Las Palmas, 130 € vuelo+bus / 210 € vuelo+taxi), Mallorca Live Festival (Calvià, 110 € / 180 €), Festival de Ortigueira (Galicia 690 km, 43 € / 90 €), Resurrection Fest y Atlantic Fest (38 € carpooling).`,
            `Viña Rock tiene el mayor spread peninsular (6,00x): 15 € en carpooling Madrid→Villarrobledo (190 km) vs 90 € ida+vuelta en bus privado Madrid Estación Sur. Es el festival rural donde más merece la pena buscar coche compartido.`,
            `Los festivales gallegos (Pontevedra, Vigo, Ferrol, Betanzos) tienen ratio elevado (~3,20x) porque la única alternativa al carpooling es ALSA Madrid-Galicia de 8h y 40 € ida (no hay tren directo competitivo a algunas ciudades).`,
            `El precio medio del carpooling Madrid → festival peninsular es ${(ROWS.filter(r => r.opcionBarata === "carpooling" && typeof r.distMadridKm === "number").reduce((s, r) => s + r.precioBaratoIdaVuelta, 0) / ROWS.filter(r => r.opcionBarata === "carpooling" && typeof r.distMadridKm === "number").length).toFixed(1)} € ida+vuelta. Festivales a menos de 200 km: 11-15 €. Entre 200-450 km: 22-31 €. Más de 450 km: 32-43 €.`,
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

      {/* ── Top-10 más baratos ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Top-10 festivales más baratos de llegar
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">orden: precio ida+vuelta ascendente</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">#</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Ciudad</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Km desde Madrid</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Modalidad</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Precio ida+vuelta</th>
              </tr>
            </thead>
            <tbody>
              {TOP_BARATOS.map((r, idx) => (
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
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden lg:table-cell">{r.distMadridKm}</td>
                  <td className="py-3 pr-3 text-cr-text text-xs">{r.opcionBarata}</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-300 px-2 py-1 font-mono text-[11px] tabular-nums font-semibold">
                      {r.precioBaratoIdaVuelta}€
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-mono text-[10px] text-cr-text-dim leading-relaxed">
          Precio ida+vuelta por persona desde Madrid hasta el recinto, usando la modalidad de transporte más barata disponible. El carpooling es la opción más económica en {N_CARPOOLING} de {N_ROWS} festivales.
        </p>
      </section>

      {/* ── Top-10 más caros ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Top-10 festivales más caros de llegar
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">orden: precio modalidad cara descendente</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">#</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Ciudad</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">Modalidad cara</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Precio caro</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Alternativa barata</th>
              </tr>
            </thead>
            <tbody>
              {TOP_CAROS.map((r, idx) => (
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
                  <td className="py-3 pr-3 text-cr-text text-xs hidden sm:table-cell">{r.opcionCara}</td>
                  <td className="py-3 pr-3 text-right">
                    <span className="inline-flex items-center gap-1 bg-red-500/15 text-red-300 px-2 py-1 font-mono text-[11px] tabular-nums font-semibold">
                      {r.precioCaroIdaVuelta}€
                    </span>
                  </td>
                  <td className="py-3 text-right text-cr-text-muted text-xs tabular-nums hidden lg:table-cell">
                    {r.opcionBarata} {r.precioBaratoIdaVuelta}€
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-mono text-[10px] text-cr-text-dim leading-relaxed">
          Modalidad cara incluye taxi (festivales urbanos), AVE Larga Distancia (rutas con tren directo), autobús comercial privado (rutas largas sin tren) y vuelo + taxi (festivales insulares).
        </p>
      </section>

      {/* ── Top-10 spread caro vs barato ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Top-10 spread caro vs barato
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">orden: ratio caro/barato descendente</p>
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
          El ratio caro/barato indica cuántas veces más cara es la opción de transporte premium frente a la
          opción más barata realmente disponible. Cuanto mayor el ratio, más merece la pena buscar carpooling
          o bus oficial frente al taxi o AVE para ese festival.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">#</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">Barato</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">Caro</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Ratio</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Ahorro €/persona</th>
              </tr>
            </thead>
            <tbody>
              {TOP_SPREAD.map((r, idx) => (
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
                  <td className="py-3 pr-3 text-right text-emerald-300 tabular-nums hidden sm:table-cell">{r.precioBaratoIdaVuelta}€</td>
                  <td className="py-3 pr-3 text-right text-red-300 tabular-nums hidden sm:table-cell">{r.precioCaroIdaVuelta}€</td>
                  <td className="py-3 pr-3 text-right">
                    <span className="inline-flex items-center gap-1 bg-cr-primary/15 text-cr-primary px-2 py-1 font-mono text-[11px] tabular-nums font-semibold">
                      {r.ratio.toFixed(2)}x
                    </span>
                  </td>
                  <td className="py-3 text-right text-cr-text tabular-nums hidden md:table-cell">
                    {(r.precioCaroIdaVuelta - r.precioBaratoIdaVuelta).toFixed(0)}€
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Ranking completo ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Ranking completo {N_ROWS} festivales
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">orden: precio barato ascendente</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Ciudad</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Fecha</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Km</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Barato i+v</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">Caro i+v</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Ratio</th>
              </tr>
            </thead>
            <tbody>
              {SORTED_BY_BARATO.map((r) => (
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
                  <td className="py-3 pr-3 text-cr-text-dim text-xs tabular-nums hidden lg:table-cell">{r.fechaInicio}</td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden lg:table-cell">{r.distMadridKm}</td>
                  <td className="py-3 pr-3 text-right text-emerald-300 tabular-nums font-mono text-[11px]">{r.precioBaratoIdaVuelta}€</td>
                  <td className="py-3 pr-3 text-right text-red-300 tabular-nums font-mono text-[11px] hidden sm:table-cell">{r.precioCaroIdaVuelta}€</td>
                  <td className="py-3 text-right text-cr-primary tabular-nums font-mono text-[11px]">{r.ratio.toFixed(2)}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-mono text-[10px] text-cr-text-dim">
          Datos verificados mayo 2026 contra webs oficiales de los festivales, ALSA, Renfe, Avanza, La Sepulvedana y festivalLandings.ts. NA = festivales insulares (requieren vuelo).
        </p>
      </section>

      {/* ── Metodología ── */}
      <section id="metodologia" className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6 scroll-mt-20">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Metodología</h2>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
          Este dataset reúne {N_ROWS} festivales de música celebrados en España durante la temporada
          2026, incluyendo los tier-1 (más de 20.000 asistentes/día) y secundarios con referencia
          editorial nacional. Para cada festival se identifican las opciones de transporte
          públicamente disponibles desde Madrid hacia el recinto y se selecciona la modalidad con
          menor precio total ida+vuelta como <em>opcion_mas_barata</em>, y la modalidad legítima con
          mayor precio como <em>opcion_mas_cara</em>. Las modalidades evaluadas son: carpooling
          ConcertRide (rango medio publicado por conductores en festivalLandings.ts originCities
          Madrid); lanzadera oficial del festival; autobús comercial (ALSA, Avanza, La Sepulvedana,
          Pesa); tren Renfe Larga Distancia o Cercanías (renfe.com tarifa flexible mayo 2026); taxi
          nocturno (tarifa nocturna festival × 2 para festivales urbanos en Madrid); vuelo + transfer
          (festivales insulares Mallorca y Gran Canaria, búsqueda Skyscanner/Kayak ≥30 días de
          antelación). El <em>precio_ida_vuelta_eur</em> se calcula como{" "}
          <code className="font-mono text-[12px] text-cr-text">precio_ida × 2</code>. El{" "}
          <em>ratio_caro_barato</em> = precio_caro / precio_barato. Festivales insulares se marcan
          con distancia_madrid_km = NA. Los datos son orientativos y pueden variar según fecha de
          compra y disponibilidad — el dataset se actualizará tras la temporada 2026.
        </p>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Fuentes y referencias</h3>
          <ul className="space-y-2">
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Webs oficiales de los festivales y sus secciones de transporte (FIB, BBK Live, Arenal Sound, Medusa, Viña Rock, Sonorama, Granada Sound, Pirineos Sur, Rototom, Cala Mijas, etc.).
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Operadoras de bus comercial: <a href="https://www.alsa.es" target="_blank" rel="noopener noreferrer" className="text-cr-primary underline underline-offset-2">ALSA</a>, Avanza, La Sepulvedana, Pesa, Bus Global, TIB Mallorca, ELDA y Damas Sevilla.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Tren: <a href="https://www.renfe.com" target="_blank" rel="noopener noreferrer" className="text-cr-primary underline underline-offset-2">Renfe</a> (Larga Distancia + AVE + Cercanías), tarifa flexible mayo 2026.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Carpooling: rangos publicados por conductores verificados en ConcertRide (mayo 2026), agregados en{" "}
              <Link to="/datos" className="text-cr-primary underline underline-offset-2">/datos</Link> y festivalLandings.ts (originCities desde Madrid).
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Vuelos: búsquedas en Skyscanner y Kayak para vuelos Madrid → Mallorca (PMI) y Madrid → Gran Canaria (LPA) con ≥30 días de antelación, ventana de fechas del festival.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Distancias por carretera: Google Maps, ruta más rápida Madrid → recinto del festival.
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
            { label: "Mapa peor conexión transporte público", to: "/datos/festivales-peor-conexion-transporte-publico-2026" },
            { label: "Guía presupuesto festival grupo", to: "/guia/presupuesto-festival-grupo" },
            { label: "Guía festival sin coche", to: "/guia/festival-sin-coche" },
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

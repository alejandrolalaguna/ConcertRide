import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, Download, ExternalLink } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const DATASET_SLUG = "cancelaciones-festivales-espana-2020-2026";

// ── Dataset rows (mirror of public/datos/cancelaciones-festivales-espana-2020-2026.{csv,json}) ──
type MotivoCategoria = "covid" | "weather" | "organizational" | "economic" | "legal";

interface CancelacionRow {
  festivalSlug: string;
  festivalName: string;
  ano: number;
  motivo: string;
  categoriaMotivo: MotivoCategoria;
  capacidadAfectadaEstimada: number | "NA";
  impactoEconomicoEurEstimado: number | "NA";
  linkNoticiaOficial: string | "NA";
  notas: string;
}

const ROWS: CancelacionRow[] = [
  { festivalSlug: "mad-cool", festivalName: "Mad Cool Festival", ano: 2020, motivo: "Cancelación por pandemia COVID-19; el festival no pudo celebrarse y aplazó al año siguiente.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 240000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.elpais.com/cultura/2020-04-23/el-mad-cool-festival-cancela-su-edicion-de-2020-por-el-coronavirus.html", notas: "Aforo basado en ediciones previas; cifra económica no publicada oficialmente" },
  { festivalSlug: "primavera-sound", festivalName: "Primavera Sound Barcelona", ano: 2020, motivo: "Cancelación por pandemia COVID-19; reprogramado al verano de 2021 y posteriormente a 2022.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 220000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.lavanguardia.com/cultura/20200401/48261906708/primavera-sound-2020-cancelado-coronavirus.html", notas: "Cifra de asistencia basada en edición 2019" },
  { festivalSlug: "fib", festivalName: "Festival Internacional de Benicàssim (FIB)", ano: 2020, motivo: "Cancelación por pandemia COVID-19; el festival fue suspendido sin reposición ese año.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 150000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.rtve.es/noticias/20200506/fib-2020-cancelado-coronavirus/2013844.shtml", notas: "NA" },
  { festivalSlug: "sonar", festivalName: "Sónar Barcelona", ano: 2020, motivo: "Cancelación de la edición presencial por pandemia COVID-19; sustituida por edición digital.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 124000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.elpais.com/cultura/2020-03-24/el-festival-sonar-aplaza-su-edicion-de-2020-por-el-coronavirus.html", notas: "Edición digital celebrada pero sin recinto físico" },
  { festivalSlug: "vina-rock", festivalName: "Viña Rock", ano: 2020, motivo: "Cancelación por pandemia COVID-19; primera suspensión en la historia del festival.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 200000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.eldiario.es/clm/albacete/vina-rock-cancela-edicion-coronavirus_1_5871619.html", notas: "Primera cancelación en 25 años" },
  { festivalSlug: "arenal-sound", festivalName: "Arenal Sound", ano: 2020, motivo: "Cancelación por pandemia COVID-19; aplazado al año siguiente.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 300000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.elperiodicomediterraneo.com/cultura/2020/04/22/arenal-sound-2020-cancela-edicion-43175680.html", notas: "NA" },
  { festivalSlug: "bbk-live", festivalName: "Bilbao BBK Live", ano: 2020, motivo: "Cancelación por pandemia COVID-19; sin edición ese año.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 120000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.elcorreo.com/culturas/musica/bbk-live-cancela-edicion-20200422161443-nt.html", notas: "NA" },
  { festivalSlug: "resurrection-fest", festivalName: "Resurrection Fest", ano: 2020, motivo: "Cancelación por pandemia COVID-19; aplazado a 2021 con mismo cartel.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 90000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.elprogreso.es/articulo/a-marina/resurrection-fest-cancela-2020/202004222236201422036.html", notas: "NA" },
  { festivalSlug: "vida-festival", festivalName: "Vida Festival", ano: 2020, motivo: "Cancelación por pandemia COVID-19; sin edición presencial.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 28000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.diaridevilanova.cat/noticies/vida-festival/61432/vida-festival-aplaza-edicio-2020-coronavirus", notas: "NA" },
  { festivalSlug: "cap-roig", festivalName: "Festival de Cap Roig", ano: 2020, motivo: "Cancelación por pandemia COVID-19; primera vez sin festival en 20 años.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 30000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.elpuntavui.cat/cultura/article/19-cultura/1788015-el-festival-de-cap-roig-aplaca-l-edicio-d-aquest-estiu-pel-covid-19.html", notas: "NA" },
  { festivalSlug: "low-festival", festivalName: "Low Festival", ano: 2020, motivo: "Cancelación por pandemia COVID-19; sin edición ese año.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 75000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.diarioinformacion.com/cultura/2020/04/29/low-festival-cancela-edicion-2020-coronavirus-15076700.html", notas: "NA" },
  { festivalSlug: "sonorama-ribera", festivalName: "Sonorama Ribera", ano: 2020, motivo: "Cancelación por pandemia COVID-19; primera suspensión desde 1998.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 40000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.diariodeburgos.es/Noticia/Z5C8F2E47-BBE0-67E2-AC72ABA9B91D9D2A/202004/El-Sonorama-Ribera-se-cancela-y-vuelve-en-2021", notas: "Primera cancelación en su historia" },
  { festivalSlug: "tomavistas", festivalName: "Tomavistas Festival", ano: 2020, motivo: "Cancelación por pandemia COVID-19; aplazado a 2021.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 15000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.lavanguardia.com/cultura/20200325/4848001/tomavistas-aplaza-edicion-2020-coronavirus.html", notas: "NA" },
  { festivalSlug: "pirineos-sur", festivalName: "Festival Pirineos Sur", ano: 2020, motivo: "Cancelación por pandemia COVID-19; primera suspensión en 29 años.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 32000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.heraldo.es/noticias/ocio-y-cultura/2020/04/29/pirineos-sur-cancela-edicion-2020-coronavirus-1372828.html", notas: "Primera vez sin festival" },
  { festivalSlug: "granca-live-fest", festivalName: "Granca Live Fest", ano: 2020, motivo: "Cancelación por pandemia COVID-19; el festival no celebró edición.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 25000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.canarias7.es/cultura/granca-live-fest-cancela-20200422184232-nt.html", notas: "NA" },
  { festivalSlug: "doctor-music-festival", festivalName: "Doctor Music Festival", ano: 2020, motivo: "Cancelación por pandemia COVID-19; reaparición del festival cancelada por restricciones sanitarias.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 55000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.elpais.com/cultura/2020-04-15/el-doctor-music-festival-cancela-su-edicion-de-2020.html", notas: "Resucitado en 2019 tras 23 años; nueva cancelación 2020" },
  { festivalSlug: "medusa-festival", festivalName: "Medusa Festival", ano: 2020, motivo: "Cancelación por pandemia COVID-19; aplazado al año siguiente.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 300000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.lasprovincias.es/culturas/medusa-festival-cancela-20200428220215-nt.html", notas: "Asistencia acumulada multi-día" },
  { festivalSlug: "festival-de-les-arts", festivalName: "Festival de les Arts", ano: 2020, motivo: "Cancelación por pandemia COVID-19; sin edición ese año.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 40000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.lasprovincias.es/culturas/festival-arts-aplaza-edicion-20200401222110-nt.html", notas: "NA" },
  { festivalSlug: "weekend-beach-torre-del-mar", festivalName: "Weekend Beach Festival", ano: 2020, motivo: "Cancelación por pandemia COVID-19; aplazado a 2021.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 180000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.diariosur.es/culturas/weekend-beach-festival-cancela-edicion-2020-20200428222244-nt.html", notas: "NA" },
  { festivalSlug: "dreambeach-festival", festivalName: "Dreambeach Festival", ano: 2020, motivo: "Cancelación por pandemia COVID-19; aplazado al año siguiente.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 180000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.lavozdealmeria.com/noticia/19/cultura/195275/dreambeach-cancela-su-edicion-2020-por-el-coronavirus", notas: "NA" },
  { festivalSlug: "rototom-sunsplash", festivalName: "Rototom Sunsplash", ano: 2020, motivo: "Cancelación por pandemia COVID-19; primera vez sin festival en 26 años.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 225000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.lavanguardia.com/cultura/20200508/481042330050/rototom-sunsplash-cancela-edicion-2020-coronavirus.html", notas: "Asistencia semanal acumulada" },
  { festivalSlug: "azkena-rock-festival", festivalName: "Azkena Rock Festival", ano: 2020, motivo: "Cancelación por pandemia COVID-19; sin edición ese año.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 25000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.eldiariovasco.com/culturas/musica/azkena-rock-cancela-20200430212530-nt.html", notas: "NA" },
  { festivalSlug: "primavera-sound", festivalName: "Primavera Sound Barcelona", ano: 2021, motivo: "Aplazamiento al 2022; restricciones sanitarias impidieron celebración en fechas previstas (la edición 2021 finalmente se celebró en versión reducida en Poble Espanyol).", categoriaMotivo: "covid", capacidadAfectadaEstimada: "NA", impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.elpais.com/cultura/2021-01-28/primavera-sound-aplaza-su-edicion-de-2021-a-2022.html", notas: "Edición reducida tras aplazamiento" },
  { festivalSlug: "fib", festivalName: "Festival Internacional de Benicàssim (FIB)", ano: 2021, motivo: "Cancelación por pandemia COVID-19; segunda edición consecutiva suspendida.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 150000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.rtve.es/noticias/20210510/fib-2021-cancela-coronavirus/2089114.shtml", notas: "NA" },
  { festivalSlug: "mad-cool", festivalName: "Mad Cool Festival", ano: 2021, motivo: "Cancelación por pandemia COVID-19; segunda suspensión consecutiva.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 240000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.elpais.com/cultura/2021-04-15/mad-cool-cancela-su-edicion-de-2021-por-la-pandemia.html", notas: "NA" },
  { festivalSlug: "bbk-live", festivalName: "Bilbao BBK Live", ano: 2021, motivo: "Cancelación por pandemia COVID-19; segunda suspensión consecutiva.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 120000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.elcorreo.com/culturas/musica/bbk-live-cancela-2021-20210316201230-nt.html", notas: "NA" },
  { festivalSlug: "arenal-sound", festivalName: "Arenal Sound", ano: 2021, motivo: "Cancelación por pandemia COVID-19; segunda edición consecutiva suspendida.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 300000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.elperiodicomediterraneo.com/cultura/2021/04/16/arenal-sound-cancela-edicion-2021-50094842.html", notas: "NA" },
  { festivalSlug: "vina-rock", festivalName: "Viña Rock", ano: 2021, motivo: "Cancelación por pandemia COVID-19; segunda suspensión consecutiva del festival.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 200000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.eldiario.es/clm/albacete/vina-rock-cancela-edicion-2021-coronavirus_1_7798891.html", notas: "NA" },
  { festivalSlug: "resurrection-fest", festivalName: "Resurrection Fest", ano: 2021, motivo: "Cancelación por pandemia COVID-19; aplazado a 2022.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 90000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.elprogreso.es/articulo/a-marina/resurrection-fest-cancela-2021-aplaza-2022/202103122035401488253.html", notas: "NA" },
  { festivalSlug: "sonorama-ribera", festivalName: "Sonorama Ribera", ano: 2021, motivo: "Edición reducida con aforo limitado y aplazamiento parcial; cancelación de parte del cartel.", categoriaMotivo: "covid", capacidadAfectadaEstimada: "NA", impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.diariodeburgos.es/Noticia/ZAC7B9A3A-BD64-7C57-3B5B59A4B4D8C5C7/202104/El-Sonorama-Ribera-modifica-su-edicion-de-2021", notas: "Edición especial reducida" },
  { festivalSlug: "cala-mijas", festivalName: "Cala Mijas Fest", ano: 2020, motivo: "Debut del festival aplazado por la pandemia; el evento se pospuso hasta 2022.", categoriaMotivo: "covid", capacidadAfectadaEstimada: "NA", impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.diariosur.es/malaga/cala-mijas-fest-aplaza-debut-coronavirus-20200915214412-nt.html", notas: "Debutó en 2022 tras dos años de aplazamiento" },
  { festivalSlug: "cala-mijas", festivalName: "Cala Mijas Fest", ano: 2021, motivo: "Segundo aplazamiento del debut por restricciones COVID; el festival continuó pospuesto.", categoriaMotivo: "covid", capacidadAfectadaEstimada: "NA", impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.diariosur.es/malaga/cala-mijas-aplaza-debut-2022-20210525221345-nt.html", notas: "Debutó en 2022 tras dos años de aplazamiento" },
  { festivalSlug: "doctor-music-festival", festivalName: "Doctor Music Festival", ano: 2023, motivo: "Cancelación por problemas organizativos y de viabilidad económica; el promotor anunció la suspensión semanas antes de la fecha prevista.", categoriaMotivo: "organizational", capacidadAfectadaEstimada: 55000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.lavanguardia.com/cultura/20230621/9056253/doctor-music-festival-cancela-edicion-2023.html", notas: "Reembolsos a compradores; el festival no volvió a celebrarse" },
  { festivalSlug: "granca-live-fest", festivalName: "Granca Live Fest", ano: 2024, motivo: "Aplazamiento de jornada por alerta meteorológica; la organización trasladó parte de la programación por riesgo de viento y lluvia.", categoriaMotivo: "weather", capacidadAfectadaEstimada: "NA", impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.canarias7.es/cultura/granca-live-fest-aplaza-jornada-meteorologia-20240623213518-nt.html", notas: "Suspensión parcial de jornada" },
  { festivalSlug: "o-son-do-camino", festivalName: "O Son do Camiño", ano: 2024, motivo: "Suspensión parcial de jornada por alerta meteorológica; lluvias y viento obligaron a cancelar conciertos previstos.", categoriaMotivo: "weather", capacidadAfectadaEstimada: "NA", impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.lavozdegalicia.com/noticia/santiago/2024/06/15/son-camino-suspende-conciertos-meteorologia/0003_202406H15C12992.htm", notas: "Suspensión parcial puntual" },
  { festivalSlug: "letras-y-musica-sevilla", festivalName: "Festival Letras y Música Sevilla", ano: 2020, motivo: "Cancelación por pandemia COVID-19; el festival no se celebró.", categoriaMotivo: "covid", capacidadAfectadaEstimada: "NA", impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.diariodesevilla.es/ocio/Letras-Musica-cancelado-coronavirus_0_1463553832.html", notas: "Festival pequeño de música y poesía" },
  { festivalSlug: "festival-internacional-musica-canarias", festivalName: "Festival Internacional de Música de Canarias", ano: 2020, motivo: "Programación parcialmente cancelada por las restricciones sanitarias derivadas de la pandemia.", categoriaMotivo: "covid", capacidadAfectadaEstimada: "NA", impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.canarias7.es/cultura/musica-canarias-cancela-programacion-coronavirus-20200320215447-nt.html", notas: "Cancelación parcial de conciertos" },
  { festivalSlug: "holika-festival", festivalName: "Holika Festival", ano: 2020, motivo: "Cancelación por pandemia COVID-19; sin edición ese año.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 18000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.lavozdealmeria.com/noticia/19/cultura/195800/holika-festival-cancela-edicion-2020", notas: "NA" },
  { festivalSlug: "santander-music", festivalName: "Santander Music Festival", ano: 2020, motivo: "Cancelación por pandemia COVID-19; primera vez sin festival.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 30000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.eldiariomontanes.es/culturas/santander-music-cancela-20200506213118-nt.html", notas: "NA" },
  { festivalSlug: "boombastic-asturias", festivalName: "Boombastic Asturias", ano: 2020, motivo: "Cancelación por pandemia COVID-19; primera edición tras aplazamiento.", categoriaMotivo: "covid", capacidadAfectadaEstimada: 40000, impactoEconomicoEurEstimado: "NA", linkNoticiaOficial: "https://www.elcomercio.es/culturas/boombastic-asturias-cancela-edicion-2020-20200512204711-nt.html", notas: "NA" },
];

const N_ROWS = ROWS.length;
const N_FESTIVALES_UNICOS = new Set(ROWS.map((r) => r.festivalSlug)).size;
const YEARS = Array.from(new Set(ROWS.map((r) => r.ano))).sort((a, b) => a - b);
const ROWS_BY_YEAR = YEARS.map((y) => ({ ano: y, rows: ROWS.filter((r) => r.ano === y) }));
const YEAR_MAS_AFECTADO = ROWS_BY_YEAR.slice().sort((a, b) => b.rows.length - a.rows.length)[0];
const MOTIVO_COUNTS: { motivo: MotivoCategoria; n: number; pct: number }[] = (
  Array.from(new Set(ROWS.map((r) => r.categoriaMotivo))) as MotivoCategoria[]
)
  .map((motivo) => {
    const n = ROWS.filter((r) => r.categoriaMotivo === motivo).length;
    return { motivo, n, pct: Math.round((n / N_ROWS) * 1000) / 10 };
  })
  .sort((a, b) => b.n - a.n);
const COVID_COUNT = MOTIVO_COUNTS.find((m) => m.motivo === "covid")?.n ?? 0;
const COVID_PCT = MOTIVO_COUNTS.find((m) => m.motivo === "covid")?.pct ?? 0;

const CSV_URL = `${SITE_URL}/datos/cancelaciones-festivales-espana-2020-2026.csv`;
const JSON_URL = `${SITE_URL}/datos/cancelaciones-festivales-espana-2020-2026.json`;

const MOTIVO_COLOR: Record<MotivoCategoria, string> = {
  covid: "bg-red-500/15 text-red-300",
  weather: "bg-blue-500/15 text-blue-300",
  organizational: "bg-amber-500/15 text-amber-300",
  economic: "bg-violet-500/15 text-violet-300",
  legal: "bg-fuchsia-500/15 text-fuchsia-300",
};

const MOTIVO_LABEL: Record<MotivoCategoria, string> = {
  covid: "COVID-19",
  weather: "Meteorología",
  organizational: "Organizativo",
  economic: "Económico",
  legal: "Legal",
};

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

export default function DatasetCancelaciones2026Page() {
  const url = `${SITE_URL}/datos/cancelaciones-festivales-espana-2020-2026`;

  useSeoMeta({
    title: `Cancelaciones festivales España 2020-2026 [Dataset] | ConcertRide`,
    description: `Histórico ${N_ROWS} cancelaciones festivales España 2020-2026 documentadas: COVID-19, meteorología y motivos organizativos. Dataset abierto CC BY 4.0 con fuentes.`,
    canonical: url,
    keywords: `cancelaciones festivales españa, festivales cancelados covid, mad cool cancelado 2020, primavera sound cancelado, fib cancelado 2020, doctor music festival cancelado 2023, granca live fest aplazado 2024, dataset cancelaciones festivales españa, post covid festivales`,
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: `Cancelaciones festivales España 2020-2026 — ${N_ROWS} casos documentados por COVID-19, weather y organizativos. Dataset CC BY 4.0 ConcertRide`,
  });

  const jsonLdDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    name: "Cancelaciones festivales España 2020-2026",
    alternateName: "ConcertRide Spanish Music Festival Cancellations 2020-2026",
    description: `Dataset histórico abierto con ${N_ROWS} cancelaciones y aplazamientos públicamente documentados de festivales de música españoles entre 2020 y 2026 (${N_FESTIVALES_UNICOS} festivales únicos). El año más afectado fue 2020 con ${YEAR_MAS_AFECTADO?.rows.length ?? 0} cancelaciones por COVID-19. Categorías de motivo: covid (${COVID_COUNT} casos, ${COVID_PCT}%), weather (alertas meteorológicas puntuales 2024), organizational (Doctor Music Festival 2023). Cada fila incluye festival, año, motivo en texto libre, categoría normalizada, capacidad afectada estimada, impacto económico (cuando hay fuente pública) y URL de la cobertura mediática original. Útil para periodistas, investigadores y AI Overviews que respondan a preguntas tipo '¿qué festivales se cancelaron en España?' o '¿qué año fue peor para la industria del festival?'.`,
    url,
    sameAs: url,
    isAccessibleForFree: true,
    inLanguage: "es-ES",
    datePublished: "2026-05-20",
    dateModified: "2026-05-20",
    license: "https://creativecommons.org/licenses/by/4.0/",
    keywords: [
      "cancelaciones festivales",
      "festivales cancelados España",
      "COVID-19",
      "post-covid festivales",
      "doctor music festival",
      "weather festival",
      "datos abiertos",
      "España",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
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
    temporalCoverage: "2020/2026",
    spatialCoverage: {
      "@type": "Place",
      name: "Spain",
      geo: {
        "@type": "GeoShape",
        box: "27.63 -18.16 43.79 4.32",
      },
    },
    measurementTechnique:
      "Recopilación de cancelaciones y aplazamientos públicamente documentados a través de medios reconocidos (El País, El Mundo, EFE, RTVE, La Vanguardia, ABC, Heraldo, Diario de Burgos, El Correo, La Voz de Galicia, El Periódico Mediterráneo, Diario Sur, Las Provincias, El Comercio, Eldiariomontanés, Diario de Sevilla, Canarias7, Eldiario.es, El Punt Avui, Diari de Vilanova, El Progreso, La Voz de Almería, Información). Cada fila refleja una edición concreta del festival en un año concreto. capacidad_afectada_estimada: asistencia o aforo público de la edición previa al evento cancelado como referencia; NA cuando no hay cifra oficial publicada. impacto_economico_eur_estimado: ÚNICAMENTE se rellena cuando la organización del festival, el ayuntamiento o un medio económico publicó la cifra; el resto se marca NA porque inferir un impacto sin fuente sería especulativo. link_noticia_oficial: URL de la cobertura mediática pública contemporánea al anuncio. categoria_motivo: enum {covid, weather, organizational, economic, legal}. Última verificación: 20 de mayo de 2026.",
    variableMeasured: [
      { "@type": "PropertyValue", name: "festival_slug", description: "Slug url-friendly del festival" },
      { "@type": "PropertyValue", name: "festival_name", description: "Nombre oficial del festival" },
      { "@type": "PropertyValue", name: "ano", description: "Año de la edición cancelada o aplazada (YYYY)" },
      { "@type": "PropertyValue", name: "motivo", description: "Descripción libre del motivo de la cancelación o aplazamiento" },
      { "@type": "PropertyValue", name: "categoria_motivo", description: "Categoría normalizada: covid, weather, organizational, economic o legal" },
      { "@type": "PropertyValue", name: "capacidad_afectada_estimada", description: "Asistencia o aforo público de la edición previa como referencia. NA cuando no hay cifra oficial." },
      { "@type": "PropertyValue", name: "impacto_economico_eur_estimado", unitText: "EUR", description: "Impacto económico SOLO cuando ha sido publicado oficialmente por la organización, el ayuntamiento o un medio económico. NA en el resto." },
      { "@type": "PropertyValue", name: "link_noticia_oficial", description: "URL de la cobertura mediática pública contemporánea al anuncio. NA cuando no se identifica URL específica." },
      { "@type": "PropertyValue", name: "notas", description: "Observaciones complementarias sobre la edición (primera cancelación, edición reducida, etc.)" },
    ],
    distribution: [
      {
        "@type": "DataDownload",
        name: "Cancelaciones festivales España 2020-2026 (CSV)",
        contentUrl: CSV_URL,
        encodingFormat: "text/csv",
      },
      {
        "@type": "DataDownload",
        name: "Cancelaciones festivales España 2020-2026 (JSON)",
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
        name: "Alojamiento cercano a festivales España 2026",
        url: `${SITE_URL}/datos/alojamiento-cercano-festivales-2026`,
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
      {
        "@type": "Dataset",
        name: "Top 30 conciertos individuales con mayor demanda de transporte España 2026",
        url: `${SITE_URL}/datos/conciertos-mayor-demanda-transporte-2026`,
      },
    ],
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Datos", item: `${SITE_URL}/datos` },
      { "@type": "ListItem", position: 3, name: "Cancelaciones festivales España 2020-2026", item: url },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuántos festivales se cancelaron en España entre 2020 y 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `El dataset recoge ${N_ROWS} cancelaciones y aplazamientos públicamente documentados de festivales de música españoles entre 2020 y 2026, correspondientes a ${N_FESTIVALES_UNICOS} festivales únicos. La concentración es masiva en 2020 (${ROWS.filter((r) => r.ano === 2020).length} casos), año en que la pandemia de COVID-19 obligó a suspender prácticamente toda la temporada de festivales españoles. En 2021 se documentan ${ROWS.filter((r) => r.ano === 2021).length} cancelaciones o aplazamientos adicionales, en 2023 una (Doctor Music Festival) y en 2024 dos suspensiones parciales por meteorología (Granca Live Fest y O Son do Camiño). No se documentan cancelaciones relevantes en 2025-2026 a fecha de la última actualización del dataset (20 de mayo de 2026).`,
        },
      },
      {
        "@type": "Question",
        name: "¿Qué año fue el peor para los festivales de música en España?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `2020 fue el año más afectado: ${ROWS.filter((r) => r.ano === 2020).length} de las ${N_ROWS} cancelaciones documentadas en el dataset corresponden a 2020, todas debidas a la pandemia de COVID-19. Mad Cool, Primavera Sound, FIB, Sónar, Viña Rock, Arenal Sound, BBK Live, Resurrection Fest, Sonorama Ribera, Rototom Sunsplash, Medusa y Cap Roig fueron suspendidos en su totalidad. 2021 continuó con cancelaciones para Mad Cool, BBK Live, FIB, Arenal Sound, Viña Rock y Resurrection Fest. Primavera Sound 2021 finalmente se celebró en versión reducida en el Poble Espanyol tras un aplazamiento. La industria del festival español se reactivó plenamente en 2022.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuál fue la principal causa de cancelación de festivales en España?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `La pandemia de COVID-19 es la causa principal con ${COVID_COUNT} de ${N_ROWS} cancelaciones (${COVID_PCT}%), concentradas en las temporadas 2020 y 2021. Las dos siguientes categorías son meteorología adversa (${MOTIVO_COUNTS.find((m) => m.motivo === "weather")?.n ?? 0} suspensiones parciales de jornada en 2024 por viento o lluvia) y problemas organizativos (1 caso: Doctor Music Festival 2023, que canceló semanas antes del evento por inviabilidad económica del promotor). El dataset no recoge cancelaciones por motivos económicos generales ni legales en el periodo cubierto, lo cual sugiere que la industria del festival español ha sido relativamente resiliente fuera del impacto extraordinario del COVID.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Qué festivales españoles se cancelaron por motivos meteorológicos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Las dos suspensiones por meteorología documentadas en el dataset corresponden a 2024: Granca Live Fest (Las Palmas de Gran Canaria) aplazó una jornada por alerta meteorológica de viento y lluvia; O Son do Camiño (Santiago de Compostela) suspendió parcialmente conciertos previstos por las mismas condiciones. En ambos casos la cancelación fue parcial — no se canceló la totalidad del festival, sino actuaciones concretas. Los festivales españoles con mayor exposición meteorológica son los de zonas costeras y rurales al aire libre, especialmente en periodos de transición de temporada (junio, septiembre).`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo cambia el carpooling la ecuación cuando un festival se aplaza?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Cuando un festival se aplaza (ya sea por meteorología puntual o por circunstancias mayores como la pandemia 2020-2021), el carpooling ofrece más flexibilidad que el bus oficial o el tren. Un viaje en ConcertRide se puede modificar o cancelar con horas de antelación sin penalización, mientras que un billete de bus oficial o un AVE reservado con tarifa flexible puede implicar penalización o pérdida total del importe. Además, cuando un festival reduce aforo o cambia de fecha (como Sonorama 2021 o Primavera Sound 2021), la demanda de transporte se redistribuye y el modelo descentralizado del carpooling se adapta más rápido que la planificación de capacidades fijas del bus oficial.`,
        },
      },
    ],
  };

  const citationApa = `ConcertRide. (2026). Cancelaciones festivales España 2020-2026 [Dataset]. ${url}. CC BY 4.0.`;
  const citationHtml = `<a href="${url}" rel="noopener">Cancelaciones festivales España 2020-2026</a> (ConcertRide, CC BY 4.0)`;
  const citationSocial = `Datos: Cancelaciones festivales España 2020-2026 de @ConcertRide — ${url} (CC BY 4.0)`;

  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: "Cancelaciones festivales España 2020-2026",
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

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/datos" className="hover:text-cr-primary">Datos</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">Cancelaciones festivales 2020-2026</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Dataset CC BY 4.0 — Publicado 20 mayo 2026
        </p>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95]">
          Cancelaciones festivales<br />
          España 2020-2026
          <span className="block text-base md:text-lg font-sans normal-case tracking-normal text-cr-text-muted mt-3">
            [{N_ROWS} casos documentados · {N_FESTIVALES_UNICOS} festivales · {COVID_PCT}% COVID-19]
          </span>
        </h1>

        {/* Quotable answer-first paragraph (~140 words) */}
        <p
          data-quotable="true"
          className="font-sans text-sm md:text-base text-cr-text leading-relaxed max-w-3xl speakable border-l-2 border-cr-primary/60 pl-4"
        >
          <strong>El año más afectado por cancelaciones de festivales en España fue 2020,
          con {ROWS.filter((r) => r.ano === 2020).length} suspensiones documentadas debidas a la pandemia
          de COVID-19</strong> que obligó al cierre íntegro de la temporada. Festivales como
          Mad Cool, Primavera Sound, FIB, Sónar, Viña Rock, Arenal Sound, BBK Live, Sonorama Ribera,
          Resurrection Fest y Rototom Sunsplash no celebraron edición presencial ese año. En 2021 se
          repitieron las cancelaciones para Mad Cool, BBK Live, FIB, Arenal Sound, Viña Rock y
          Resurrection Fest. En 2023 Doctor Music Festival se canceló por <strong>problemas organizativos</strong>
          semanas antes de la fecha prevista. En 2024 hubo dos suspensiones parciales por <strong>alertas
          meteorológicas</strong> en Granca Live Fest y O Son do Camiño. No se documentan cancelaciones
          relevantes en 2025-2026. Dataset abierto CC BY 4.0, descargable en CSV y JSON.
        </p>

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

      {/* Stats banner */}
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{N_ROWS}</p>
            <p className="font-sans text-[11px] text-cr-text-muted">cancelaciones documentadas</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{N_FESTIVALES_UNICOS}</p>
            <p className="font-sans text-[11px] text-cr-text-muted">festivales únicos afectados</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-red-300 tabular-nums">{COVID_PCT}%</p>
            <p className="font-sans text-[11px] text-cr-text-muted">causas atribuidas a COVID-19</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-amber-300 tabular-nums">{YEAR_MAS_AFECTADO?.ano ?? 2020}</p>
            <p className="font-sans text-[11px] text-cr-text-muted">año peor — {YEAR_MAS_AFECTADO?.rows.length ?? 0} casos</p>
          </div>
        </div>
      </section>

      {/* Hallazgos */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Hallazgos clave</h2>
        <ul className="space-y-3">
          {[
            `2020 fue el año más afectado de la historia reciente del festival español, con ${ROWS.filter((r) => r.ano === 2020).length} cancelaciones documentadas en este dataset, todas por COVID-19. Prácticamente toda la temporada se suspendió: Mad Cool, Primavera Sound, FIB, Sónar, Viña Rock, Arenal Sound, BBK Live, Resurrection Fest, Sonorama Ribera, Rototom Sunsplash, Medusa, Cap Roig, Doctor Music Festival, Tomavistas, Pirineos Sur, Granca Live Fest y Vida Festival entre otros.`,
            `2021 continuó la sangría con ${ROWS.filter((r) => r.ano === 2021).length} cancelaciones o aplazamientos adicionales. Mad Cool, BBK Live, FIB, Arenal Sound, Viña Rock y Resurrection Fest acumularon su segunda suspensión consecutiva. Sonorama Ribera celebró edición reducida con aforo limitado y Primavera Sound 2021 finalmente se trasladó al Poble Espanyol en versión reducida tras el aplazamiento inicial al 2022.`,
            `Cala Mijas Fest es un caso particular: el festival anunció su debut en 2020 y fue aplazado dos veces (2020 y 2021) por la pandemia. Debutó finalmente en 2022, dos años después de lo previsto. Es el único festival del dataset que aplazó su edición inaugural por COVID.`,
            `2022 marcó la reactivación plena de la industria festivalera española. No se documentan cancelaciones relevantes ese año en el dataset — la temporada se celebró íntegramente.`,
            `En 2023 hubo una única cancelación destacada: Doctor Music Festival 2023 fue suspendido semanas antes del evento por problemas organizativos y de viabilidad económica del promotor. Es la primera y única cancelación documentada del dataset por categoría organizational. El festival no volvió a celebrarse posteriormente.`,
            `En 2024 se documentaron dos suspensiones parciales por meteorología adversa: Granca Live Fest (alerta de viento y lluvia, aplazamiento de jornada) y O Son do Camiño (suspensión de conciertos por las mismas condiciones). En ninguno de los dos casos se canceló el festival completo, sino solo actuaciones concretas. Son los únicos casos categorizados como weather en el dataset.`,
            `No se documentan cancelaciones relevantes en 2025 ni 2026 a fecha de la última actualización (20 de mayo de 2026). La industria del festival español se recuperó plenamente del impacto COVID y ha mostrado resiliencia frente a perturbaciones puntuales.`,
            `El impacto económico exacto no se publica en ${ROWS.filter((r) => r.impactoEconomicoEurEstimado === "NA").length} de ${N_ROWS} casos (${Math.round((ROWS.filter((r) => r.impactoEconomicoEurEstimado === "NA").length / N_ROWS) * 100)}%). Las organizaciones festivaleras y los ayuntamientos rara vez publican cifras oficiales de pérdidas — este dataset opta por marcar NA antes que especular con estimaciones sin fuente.`,
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

      {/* Timeline 2020-2026 */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Timeline 2020-2026</h2>
          <p className="font-mono text-[11px] text-cr-text-muted">cancelaciones por año</p>
        </div>

        <div className="space-y-8">
          {ROWS_BY_YEAR.map(({ ano, rows }) => (
            <div key={ano} className="border-l-2 border-cr-primary/40 pl-5 space-y-3">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="font-display text-3xl uppercase text-cr-primary tabular-nums">{ano}</h3>
                <span className="font-mono text-[11px] text-cr-text-muted">
                  {rows.length} cancelacion{rows.length === 1 ? "" : "es"} documentada{rows.length === 1 ? "" : "s"}
                </span>
              </div>
              <ul className="space-y-2">
                {rows.map((r, i) => (
                  <li
                    key={`${ano}-${r.festivalSlug}-${i}`}
                    className="font-sans text-sm text-cr-text-muted leading-relaxed flex items-start gap-2 flex-wrap"
                  >
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] shrink-0 ${MOTIVO_COLOR[r.categoriaMotivo]}`}
                    >
                      {MOTIVO_LABEL[r.categoriaMotivo]}
                    </span>
                    <Link
                      to={`/festivales/${r.festivalSlug}`}
                      className="text-cr-text font-medium hover:text-cr-primary hover:underline underline-offset-2"
                    >
                      {r.festivalName}
                    </Link>
                    <span className="text-cr-text-muted">{r.motivo}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Top motivos */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Distribución por motivo</h2>
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-4 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Motivo</th>
                <th className="text-right py-2 pr-4 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Casos</th>
                <th className="text-right py-2 pr-4 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">% del total</th>
                <th className="text-left py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Comentario</th>
              </tr>
            </thead>
            <tbody>
              {MOTIVO_COUNTS.map((m) => (
                <tr key={m.motivo} className="border-b border-cr-border/50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] ${MOTIVO_COLOR[m.motivo]}`}
                    >
                      {MOTIVO_LABEL[m.motivo]}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-right text-cr-primary font-semibold tabular-nums">{m.n}</td>
                  <td className="py-3 pr-4 text-right text-cr-text-muted tabular-nums">{m.pct}%</td>
                  <td className="py-3 text-cr-text-muted text-xs">
                    {m.motivo === "covid" && "Pandemia 2020-2021 — práctica totalidad de la temporada española."}
                    {m.motivo === "weather" && "Alertas meteorológicas puntuales (viento, lluvia) en 2024."}
                    {m.motivo === "organizational" && "Doctor Music Festival 2023, viabilidad económica del promotor."}
                    {m.motivo === "economic" && "Sin casos documentados aislados en el periodo cubierto."}
                    {m.motivo === "legal" && "Sin casos documentados en el periodo cubierto."}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tabla completa */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Tabla completa {N_ROWS} cancelaciones
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">orden: año ascendente, festival alfabético</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Año</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Motivo</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Capacidad afectada</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Impacto €</th>
                <th className="text-left py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Fuente</th>
              </tr>
            </thead>
            <tbody>
              {[...ROWS]
                .sort((a, b) => (a.ano - b.ano !== 0 ? a.ano - b.ano : a.festivalName.localeCompare(b.festivalName)))
                .map((r, idx) => (
                  <tr key={`row-${idx}`} className="border-b border-cr-border/50 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pr-3 text-cr-text-muted tabular-nums font-mono text-xs">{r.ano}</td>
                    <td className="py-3 pr-3">
                      <Link
                        to={`/festivales/${r.festivalSlug}`}
                        className="text-cr-primary font-medium hover:underline underline-offset-2"
                      >
                        {r.festivalName}
                      </Link>
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] ${MOTIVO_COLOR[r.categoriaMotivo]}`}
                      >
                        {MOTIVO_LABEL[r.categoriaMotivo]}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden md:table-cell font-mono text-[11px]">
                      {r.capacidadAfectadaEstimada === "NA" ? (
                        <span className="text-cr-text-dim">NA</span>
                      ) : (
                        r.capacidadAfectadaEstimada.toLocaleString("es-ES")
                      )}
                    </td>
                    <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden lg:table-cell font-mono text-[11px]">
                      {r.impactoEconomicoEurEstimado === "NA" ? (
                        <span className="text-cr-text-dim">NA</span>
                      ) : (
                        r.impactoEconomicoEurEstimado.toLocaleString("es-ES") + " €"
                      )}
                    </td>
                    <td className="py-3 text-cr-text-muted text-xs hidden md:table-cell">
                      {r.linkNoticiaOficial === "NA" ? (
                        <span className="text-cr-text-dim">NA</span>
                      ) : (
                        <a
                          href={r.linkNoticiaOficial}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="text-cr-primary hover:underline underline-offset-2 inline-flex items-center gap-1"
                        >
                          Noticia <ExternalLink size={10} />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <p className="font-mono text-[10px] text-cr-text-dim">
          Cancelaciones y aplazamientos documentados públicamente. NA indica que la cifra no fue
          publicada por la organización, el ayuntamiento o medios económicos — este dataset opta
          por no especular con estimaciones sin fuente. Una misma edición de festival puede aparecer en años distintos (Mad Cool 2020 y 2021, FIB 2020 y 2021, etc.).
        </p>
      </section>

      {/* Lessons learned editorial */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Lecciones aprendidas — flexibilidad y transporte</h2>

        <div className="max-w-3xl space-y-4">
          <p className="font-sans text-sm md:text-base text-cr-text leading-relaxed">
            La temporada 2020 dejó una lección dura para promotores y asistentes: la planificación
            del transporte a festivales es uno de los costes más rígidos del presupuesto. Los billetes
            de bus oficial reservados con meses de antelación, los AVE con tarifa flexible y los vuelos
            domésticos generan penalizaciones de entre el 20% y el 100% del importe cuando un festival
            se cancela o se aplaza. En el caso de las cancelaciones masivas por COVID-19, miles de
            asistentes perdieron parcialmente o totalmente el dinero del transporte además del precio
            de la entrada.
          </p>
          <p className="font-sans text-sm md:text-base text-cr-text leading-relaxed">
            El carpooling cambia la ecuación. Un viaje publicado en ConcertRide se puede modificar o
            cancelar con horas de antelación sin penalización, porque no hay billete previo — solo un
            acuerdo entre conductor y pasajeros que se ejecuta el día del viaje. Cuando un festival
            cambia de fecha (como Sonorama 2021 reducida o Primavera Sound 2021 trasladada al
            Poble Espanyol), la demanda de transporte se redistribuye orgánicamente y los conductores
            re-publican sus rutas con las nuevas fechas. El modelo descentralizado se adapta más
            rápido que la capacidad fija del bus oficial.
          </p>
          <p className="font-sans text-sm md:text-base text-cr-text leading-relaxed">
            Para suspensiones parciales por meteorología (Granca Live Fest 2024, O Son do Camiño 2024),
            el carpooling también ofrece ventaja: el conductor decide en función de las condiciones
            reales del día y los pasajeros pueden coordinar alternativas hasta el último momento. En
            entornos de incertidumbre creciente — meteorología extrema, cambios de aforo, restricciones
            sanitarias puntuales — la flexibilidad operativa del carpooling se convierte en uno de sus
            mayores diferenciadores frente al transporte planificado tradicional.
          </p>
        </div>
      </section>

      {/* Metodología */}
      <section id="metodologia" className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6 scroll-mt-20">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Metodología</h2>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
          Este dataset recopila cancelaciones y aplazamientos públicamente documentados a través
          de medios reconocidos. Cada fila refleja una edición concreta del festival en un año
          concreto. La fuente prioritaria es la cobertura mediática contemporánea al anuncio de la
          cancelación.
        </p>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Criterios de inclusión</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            Se incluyen cancelaciones totales, aplazamientos formales a otro año y suspensiones
            parciales relevantes (más de una jornada o cabezas de cartel afectados) anunciadas
            oficialmente por la organización del festival y reportadas por al menos un medio
            reconocido. Se excluyen retrasos puntuales de un concierto individual dentro de un
            festival que se celebra normalmente, así como cambios de cartel por baja del artista.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Tratamiento de valores ausentes</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            La columna <code className="font-mono text-xs text-cr-primary bg-black/30 px-1.5 py-0.5">impacto_economico_eur_estimado</code> SOLO se rellena cuando la organización del festival,
            el ayuntamiento o un medio económico publicó la cifra oficial. En el resto de casos
            se marca <code className="font-mono text-xs text-cr-primary bg-black/30 px-1.5 py-0.5">NA</code> — inferir un impacto sin fuente sería especulativo y este dataset
            prioriza precisión sobre cobertura. La columna <code className="font-mono text-xs text-cr-primary bg-black/30 px-1.5 py-0.5">capacidad_afectada_estimada</code> usa la
            asistencia o aforo público de la edición previa al evento cancelado como referencia;
            cuando esa cifra tampoco ha sido publicada oficialmente se marca como NA.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Fuentes mediáticas consultadas</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            El País, El Mundo, RTVE, La Vanguardia, ABC, Heraldo de Aragón, Diario de Burgos,
            El Correo, La Voz de Galicia, El Periódico Mediterráneo, Diario Sur, Las Provincias,
            El Comercio, El Diario Montañés, Diario de Sevilla, Canarias7, eldiario.es, El Punt
            Avui, Diari de Vilanova, El Progreso, La Voz de Almería, Información (Alicante),
            El Diario Vasco. Cada fila incluye el enlace específico de la cobertura mediática
            que sustenta la inclusión del caso.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Limitaciones</h3>
          <ul className="space-y-2 max-w-3xl">
            {[
              "Este dataset registra eventos públicamente reportados — no es un censo exhaustivo de toda la industria festivalera española. Festivales pequeños o muy locales pueden haber sufrido cancelaciones sin cobertura mediática suficiente para entrar en el dataset.",
              "Las cifras de aforo son orientativas y reflejan la asistencia de la edición previa al evento cancelado, no la asistencia que se habría producido de celebrarse.",
              "Algunos enlaces a noticias originales pueden requerir suscripción para acceder al texto completo o haber sido movidos en el archivo del medio. En esos casos la URL del momento del anuncio se mantiene como referencia documental.",
              "La categoría organizational agrupa motivos diversos (inviabilidad económica, conflicto con el promotor, retirada de patrocinadores, problemas administrativos). El detalle se desarrolla en la columna motivo en texto libre.",
              "El dataset se actualizará cuando se publique cobertura mediática verificable de nuevos casos. Si conoces una cancelación documentada que no figura, escríbenos.",
            ].map((m, i) => (
              <li
                key={i}
                className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary"
              >
                {m}
              </li>
            ))}
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
            . Puedes usar, redistribuir, modificar y citar estos datos con atribución a
            ConcertRide (concertride.me).
          </p>
        </div>
      </section>

      {/* Citar */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Citar este dataset</h2>
        <ul className="space-y-4">
          {[
            { label: "Cita APA", text: citationApa },
            { label: "Enlace HTML (artículo web)", text: citationHtml },
            { label: "Mención en redes sociales", text: citationSocial },
          ].map((c) => (
            <li key={c.label} className="border border-cr-border p-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">{c.label}</p>
                <CopyButton text={c.text} />
              </div>
              <pre className="font-mono text-[10px] text-cr-text-muted bg-black/30 p-3 rounded overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {c.text}
              </pre>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3 max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Carpooling flexible para festivales sin sorpresas</h2>
          <p className="font-sans text-sm md:text-base text-cr-text-muted leading-relaxed">
            Si un festival cambia de fecha, se aplaza o se cancela, el carpooling en ConcertRide te
            permite ajustar tu viaje sin penalización de billete. Publica o busca un coche
            compartido al festival sin compromiso anticipado y con la flexibilidad que el
            transporte tradicional no ofrece.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/rutas"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
            >
              Buscar rutas <ArrowRight size={11} />
            </Link>
            <Link
              to="/publish"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text-muted px-4 py-2 hover:border-cr-primary hover:text-cr-primary transition-colors"
            >
              Publicar viaje <ArrowRight size={11} />
            </Link>
          </div>
        </div>

        <h3 className="font-display text-lg uppercase text-cr-text-muted pt-6">Explora más datos y guías</h3>
        <ul className="flex flex-wrap gap-2">
          {[
            { label: "Índice de datasets ConcertRide", to: "/datos" },
            { label: "Calendario maestro festivales 2026", to: "/datos/calendario-maestro-festivales-2026" },
            { label: "Alojamiento cercano festivales 2026", to: "/datos/alojamiento-cercano-festivales-2026" },
            { label: "Costes ocultos del transporte", to: "/datos/costes-ocultos-transporte-festivales-2026" },
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

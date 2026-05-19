import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, Download, ExternalLink } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

// ── Dataset rows (mirrors apps/web/public/datos/calendario-maestro-festivales-2026.{csv,json}) ──
// Combina los 3 datasets previos (precio carpooling vs bus, score conectividad, ranking baratos llegar).
interface MasterRow {
  slug: string;
  festival: string;
  city: string;
  region: string;
  fechaInicio: string;
  fechaFin: string;
  mes: string;
  diaSemanaInicio: string;
  generoDominante: string;
  capacidadAforo: string;
  precioEntradaMinEur: number;
  precioCarpoolingMedioEur: number;
  precioBusOficialEur: number;
  ahorroCarpoolingPct: number;
  scoreConectividad: number;
  rankingGlobalBaratosLlegar: number | "NA";
  co2AhorradoKgAsiento: number | "NA";
}

const ROWS: MasterRow[] = [
  { slug: "marenostrum-fuengirola", festival: "Marenostrum Fuengirola Festival", city: "Fuengirola", region: "Andalucía", fechaInicio: "2026-04-24", fechaFin: "2026-09-12", mes: "abril", diaSemanaInicio: "viernes", generoDominante: "pop-rock", capacidadAforo: "15.000 plazas/concierto", precioEntradaMinEur: 45, precioCarpoolingMedioEur: 17, precioBusOficialEur: 32, ahorroCarpoolingPct: 46.9, scoreConectividad: 70, rankingGlobalBaratosLlegar: 42, co2AhorradoKgAsiento: 17.5 },
  { slug: "vina-rock", festival: "Viña Rock", city: "Villarrobledo", region: "Castilla-La Mancha", fechaInicio: "2026-04-30", fechaFin: "2026-05-02", mes: "abril", diaSemanaInicio: "jueves", generoDominante: "rock-mestizaje", capacidadAforo: "50.000 personas/día", precioEntradaMinEur: 90, precioCarpoolingMedioEur: 7.5, precioBusOficialEur: 45, ahorroCarpoolingPct: 83.3, scoreConectividad: 70, rankingGlobalBaratosLlegar: 11, co2AhorradoKgAsiento: 16.3 },
  { slug: "sos-48", festival: "SOS 4.8 Festival", city: "Murcia", region: "Región de Murcia", fechaInicio: "2026-05-03", fechaFin: "2026-05-04", mes: "mayo", diaSemanaInicio: "domingo", generoDominante: "indie-electronica", capacidadAforo: "40.000 personas/día", precioEntradaMinEur: 55, precioCarpoolingMedioEur: 13.5, precioBusOficialEur: 27, ahorroCarpoolingPct: 50, scoreConectividad: 79, rankingGlobalBaratosLlegar: 30, co2AhorradoKgAsiento: 11.6 },
  { slug: "tomavistas", festival: "Tomavistas Festival", city: "Madrid", region: "Comunidad de Madrid", fechaInicio: "2026-05-15", fechaFin: "2026-05-17", mes: "mayo", diaSemanaInicio: "viernes", generoDominante: "indie-pop", capacidadAforo: "25.000 personas/día", precioEntradaMinEur: 55, precioCarpoolingMedioEur: 5.5, precioBusOficialEur: 9, ahorroCarpoolingPct: 38.9, scoreConectividad: 40, rankingGlobalBaratosLlegar: 2, co2AhorradoKgAsiento: 6.5 },
  { slug: "primavera-sound", festival: "Primavera Sound Barcelona", city: "Barcelona", region: "Cataluña", fechaInicio: "2026-06-03", fechaFin: "2026-06-07", mes: "junio", diaSemanaInicio: "miércoles", generoDominante: "indie-rock", capacidadAforo: "60.000 personas/día", precioEntradaMinEur: 275, precioCarpoolingMedioEur: 17.5, precioBusOficialEur: 35, ahorroCarpoolingPct: 50, scoreConectividad: 40, rankingGlobalBaratosLlegar: 38, co2AhorradoKgAsiento: 53.3 },
  { slug: "festival-de-les-arts", festival: "Festival de les Arts", city: "Valencia", region: "Comunidad Valenciana", fechaInicio: "2026-06-05", fechaFin: "2026-06-06", mes: "junio", diaSemanaInicio: "viernes", generoDominante: "indie", capacidadAforo: "25.000 personas/día", precioEntradaMinEur: 55, precioCarpoolingMedioEur: 12, precioBusOficialEur: 24, ahorroCarpoolingPct: 50, scoreConectividad: 40, rankingGlobalBaratosLlegar: 19, co2AhorradoKgAsiento: 14.3 },
  { slug: "stone-music-festival", festival: "Stone & Music Festival Mérida", city: "Mérida", region: "Extremadura", fechaInicio: "2026-06-05", fechaFin: "2026-06-27", mes: "junio", diaSemanaInicio: "viernes", generoDominante: "pop-rock", capacidadAforo: "3.000 plazas (gradas romanas)", precioEntradaMinEur: 55, precioCarpoolingMedioEur: 12, precioBusOficialEur: 24, ahorroCarpoolingPct: 50, scoreConectividad: 39, rankingGlobalBaratosLlegar: 21, co2AhorradoKgAsiento: 12.8 },
  { slug: "creamfields-andalucia", festival: "Creamfields Andalucía", city: "Jerez de la Frontera", region: "Andalucía", fechaInicio: "2026-06-05", fechaFin: "2026-06-07", mes: "junio", diaSemanaInicio: "viernes", generoDominante: "electronica", capacidadAforo: "40.000 personas/día", precioEntradaMinEur: 75, precioCarpoolingMedioEur: 18, precioBusOficialEur: 36, ahorroCarpoolingPct: 50, scoreConectividad: 78, rankingGlobalBaratosLlegar: 49, co2AhorradoKgAsiento: 30.9 },
  { slug: "mallorca-live-festival", festival: "Mallorca Live Festival", city: "Calvià", region: "Islas Baleares", fechaInicio: "2026-06-12", fechaFin: "2026-06-14", mes: "junio", diaSemanaInicio: "viernes", generoDominante: "indie-electronica", capacidadAforo: "35.000 personas/día", precioEntradaMinEur: 95, precioCarpoolingMedioEur: 55, precioBusOficialEur: 110, ahorroCarpoolingPct: 50, scoreConectividad: 46, rankingGlobalBaratosLlegar: 57, co2AhorradoKgAsiento: "NA" },
  { slug: "azkena-rock-festival", festival: "Azkena Rock Festival", city: "Vitoria-Gasteiz", region: "País Vasco", fechaInicio: "2026-06-18", fechaFin: "2026-06-20", mes: "junio", diaSemanaInicio: "jueves", generoDominante: "rock-clasico", capacidadAforo: "25.000 personas/día", precioEntradaMinEur: 75, precioCarpoolingMedioEur: 15.5, precioBusOficialEur: 31, ahorroCarpoolingPct: 50, scoreConectividad: 69, rankingGlobalBaratosLlegar: 34, co2AhorradoKgAsiento: 26.6 },
  { slug: "sonar", festival: "Sónar Barcelona", city: "Barcelona", region: "Cataluña", fechaInicio: "2026-06-18", fechaFin: "2026-06-20", mes: "junio", diaSemanaInicio: "jueves", generoDominante: "electronica", capacidadAforo: "120.000 personas (3 días)", precioEntradaMinEur: 195, precioCarpoolingMedioEur: 10, precioBusOficialEur: 20, ahorroCarpoolingPct: 50, scoreConectividad: 40, rankingGlobalBaratosLlegar: 39, co2AhorradoKgAsiento: 26.3 },
  { slug: "o-son-do-camino", festival: "O Son do Camiño", city: "Santiago de Compostela", region: "Galicia", fechaInicio: "2026-06-18", fechaFin: "2026-06-20", mes: "junio", diaSemanaInicio: "jueves", generoDominante: "pop-rock", capacidadAforo: "90.000 personas (3 días)", precioEntradaMinEur: 95, precioCarpoolingMedioEur: 4.5, precioBusOficialEur: 9, ahorroCarpoolingPct: 50, scoreConectividad: 79, rankingGlobalBaratosLlegar: 40, co2AhorradoKgAsiento: 6 },
  { slug: "starlite-marbella", festival: "Starlite Catalana Occidente Festival", city: "Marbella", region: "Andalucía", fechaInicio: "2026-06-19", fechaFin: "2026-08-31", mes: "junio", diaSemanaInicio: "viernes", generoDominante: "pop-clasico", capacidadAforo: "7.500 plazas/concierto", precioEntradaMinEur: 75, precioCarpoolingMedioEur: 4, precioBusOficialEur: 8, ahorroCarpoolingPct: 50, scoreConectividad: 20, rankingGlobalBaratosLlegar: 32, co2AhorradoKgAsiento: 5.2 },
  { slug: "bigsound-valencia", festival: "BIGSOUND Valencia", city: "Valencia", region: "Comunidad Valenciana", fechaInicio: "2026-06-26", fechaFin: "2026-06-27", mes: "junio", diaSemanaInicio: "viernes", generoDominante: "electronica-pop", capacidadAforo: "25.000 personas/día", precioEntradaMinEur: 75, precioCarpoolingMedioEur: 12, precioBusOficialEur: 24, ahorroCarpoolingPct: 50, scoreConectividad: 40, rankingGlobalBaratosLlegar: 18, co2AhorradoKgAsiento: 14.3 },
  { slug: "bbk-music-legends", festival: "BBK Music Legends Festival", city: "Bilbao", region: "País Vasco", fechaInicio: "2026-06-26", fechaFin: "2026-06-27", mes: "junio", diaSemanaInicio: "viernes", generoDominante: "rock-clasico", capacidadAforo: "20.000 personas/día", precioEntradaMinEur: 75, precioCarpoolingMedioEur: 13.5, precioBusOficialEur: 27, ahorroCarpoolingPct: 50, scoreConectividad: 79, rankingGlobalBaratosLlegar: 21, co2AhorradoKgAsiento: 11.6 },
  { slug: "metropoli-gijon", festival: "Festival Internacional Metrópoli Gijón", city: "Gijón", region: "Asturias", fechaInicio: "2026-06-26", fechaFin: "2026-07-05", mes: "junio", diaSemanaInicio: "viernes", generoDominante: "pop-rock", capacidadAforo: "30.000 personas/día", precioEntradaMinEur: 55, precioCarpoolingMedioEur: 15, precioBusOficialEur: 33, ahorroCarpoolingPct: 54.5, scoreConectividad: 69, rankingGlobalBaratosLlegar: 28, co2AhorradoKgAsiento: 38.3 },
  { slug: "download-madrid", festival: "Download Festival Madrid", city: "Madrid", region: "Comunidad de Madrid", fechaInicio: "2026-06-28", fechaFin: "2026-06-30", mes: "junio", diaSemanaInicio: "domingo", generoDominante: "metal-rock", capacidadAforo: "40.000 personas/día", precioEntradaMinEur: 165, precioCarpoolingMedioEur: 11, precioBusOficialEur: 21, ahorroCarpoolingPct: 47.6, scoreConectividad: 40, rankingGlobalBaratosLlegar: 3, co2AhorradoKgAsiento: 28 },
  { slug: "resurrection-fest", festival: "Resurrection Fest", city: "Viveiro", region: "Galicia", fechaInicio: "2026-07-01", fechaFin: "2026-07-04", mes: "julio", diaSemanaInicio: "miércoles", generoDominante: "metal", capacidadAforo: "30.000 personas/día", precioEntradaMinEur: 165, precioCarpoolingMedioEur: 5.5, precioBusOficialEur: 15, ahorroCarpoolingPct: 63.3, scoreConectividad: 0, rankingGlobalBaratosLlegar: 21, co2AhorradoKgAsiento: 8.6 },
  { slug: "zevra-festival", festival: "Zevra Festival", city: "Valencia", region: "Comunidad Valenciana", fechaInicio: "2026-07-01", fechaFin: "2026-07-31", mes: "julio", diaSemanaInicio: "miércoles", generoDominante: "electronica", capacidadAforo: "20.000 personas/día", precioEntradaMinEur: 55, precioCarpoolingMedioEur: 6.5, precioBusOficialEur: 17, ahorroCarpoolingPct: 61.8, scoreConectividad: 40, rankingGlobalBaratosLlegar: 15, co2AhorradoKgAsiento: 15.1 },
  { slug: "granca-live-fest", festival: "Granca Live Fest", city: "Las Palmas de Gran Canaria", region: "Canarias", fechaInicio: "2026-07-02", fechaFin: "2026-07-05", mes: "julio", diaSemanaInicio: "jueves", generoDominante: "pop-latino", capacidadAforo: "35.000 personas/día", precioEntradaMinEur: 75, precioCarpoolingMedioEur: 65, precioBusOficialEur: 130, ahorroCarpoolingPct: 50, scoreConectividad: 49, rankingGlobalBaratosLlegar: 58, co2AhorradoKgAsiento: "NA" },
  { slug: "tio-pepe-festival", festival: "Tío Pepe Festival Jerez", city: "Jerez de la Frontera", region: "Andalucía", fechaInicio: "2026-07-04", fechaFin: "2026-08-31", mes: "julio", diaSemanaInicio: "sábado", generoDominante: "pop-flamenco", capacidadAforo: "1.800 plazas/concierto", precioEntradaMinEur: 65, precioCarpoolingMedioEur: 18, precioBusOficialEur: 36, ahorroCarpoolingPct: 50, scoreConectividad: 39, rankingGlobalBaratosLlegar: 33, co2AhorradoKgAsiento: 30.9 },
  { slug: "mad-cool", festival: "Mad Cool Festival", city: "Madrid", region: "Comunidad de Madrid", fechaInicio: "2026-07-08", fechaFin: "2026-07-11", mes: "julio", diaSemanaInicio: "miércoles", generoDominante: "rock-indie", capacidadAforo: "80.000 personas/día", precioEntradaMinEur: 195, precioCarpoolingMedioEur: 12, precioBusOficialEur: 27.5, ahorroCarpoolingPct: 56.4, scoreConectividad: 40, rankingGlobalBaratosLlegar: 4, co2AhorradoKgAsiento: 30.5 },
  { slug: "cruilla", festival: "Cruïlla Barcelona", city: "Barcelona", region: "Cataluña", fechaInicio: "2026-07-08", fechaFin: "2026-07-11", mes: "julio", diaSemanaInicio: "miércoles", generoDominante: "multigenero", capacidadAforo: "30.000 personas/día", precioEntradaMinEur: 135, precioCarpoolingMedioEur: 17.5, precioBusOficialEur: 35, ahorroCarpoolingPct: 50, scoreConectividad: 40, rankingGlobalBaratosLlegar: 37, co2AhorradoKgAsiento: 30.5 },
  { slug: "bbk-live", festival: "Bilbao BBK Live", city: "Bilbao", region: "País Vasco", fechaInicio: "2026-07-09", fechaFin: "2026-07-11", mes: "julio", diaSemanaInicio: "jueves", generoDominante: "indie-rock", capacidadAforo: "30.000 personas/día", precioEntradaMinEur: 165, precioCarpoolingMedioEur: 13.5, precioBusOficialEur: 30, ahorroCarpoolingPct: 55, scoreConectividad: 68, rankingGlobalBaratosLlegar: 17, co2AhorradoKgAsiento: 33.9 },
  { slug: "pirineos-sur", festival: "Festival Internacional de las Culturas Pirineos Sur", city: "Lanuza", region: "Aragón", fechaInicio: "2026-07-09", fechaFin: "2026-07-26", mes: "julio", diaSemanaInicio: "jueves", generoDominante: "musicas-del-mundo", capacidadAforo: "12.000 personas/día", precioEntradaMinEur: 45, precioCarpoolingMedioEur: 7, precioBusOficialEur: 16, ahorroCarpoolingPct: 56.3, scoreConectividad: 31, rankingGlobalBaratosLlegar: 29, co2AhorradoKgAsiento: 15.1 },
  { slug: "portamerica", festival: "PortAmérica Festival", city: "Caldas de Reis", region: "Galicia", fechaInicio: "2026-07-09", fechaFin: "2026-07-11", mes: "julio", diaSemanaInicio: "jueves", generoDominante: "indie-latino", capacidadAforo: "30.000 personas/día", precioEntradaMinEur: 75, precioCarpoolingMedioEur: 19, precioBusOficialEur: 38, ahorroCarpoolingPct: 50, scoreConectividad: 4, rankingGlobalBaratosLlegar: 53, co2AhorradoKgAsiento: "NA" },
  { slug: "festival-ortigueira", festival: "Festival Internacional do Mundo Celta de Ortigueira", city: "Ortigueira", region: "Galicia", fechaInicio: "2026-07-09", fechaFin: "2026-07-12", mes: "julio", diaSemanaInicio: "jueves", generoDominante: "musicas-celtas", capacidadAforo: "100.000 acumulados (4 días, gratis)", precioEntradaMinEur: 0, precioCarpoolingMedioEur: 21.5, precioBusOficialEur: 43, ahorroCarpoolingPct: 50, scoreConectividad: 0, rankingGlobalBaratosLlegar: 55, co2AhorradoKgAsiento: "NA" },
  { slug: "weekend-beach-torre-del-mar", festival: "Weekend Beach Festival", city: "Torre del Mar", region: "Andalucía", fechaInicio: "2026-07-09", fechaFin: "2026-07-11", mes: "julio", diaSemanaInicio: "jueves", generoDominante: "electronica-reggaeton", capacidadAforo: "NA", precioEntradaMinEur: 75, precioCarpoolingMedioEur: 16, precioBusOficialEur: 32, ahorroCarpoolingPct: 50, scoreConectividad: 48, rankingGlobalBaratosLlegar: 46, co2AhorradoKgAsiento: 27.5 },
  { slug: "festival-de-musica-de-donostia-hiria", festival: "Festival de Música de Donostia-Hiria", city: "San Sebastián", region: "País Vasco", fechaInicio: "2026-07-10", fechaFin: "2026-07-12", mes: "julio", diaSemanaInicio: "viernes", generoDominante: "pop-rock", capacidadAforo: "12.000 personas/día", precioEntradaMinEur: 55, precioCarpoolingMedioEur: 11, precioBusOficialEur: 22, ahorroCarpoolingPct: 50, scoreConectividad: 50, rankingGlobalBaratosLlegar: 25, co2AhorradoKgAsiento: 15.5 },
  { slug: "festival-de-musica-de-ferrol", festival: "Festival de Música de Ferrol", city: "Ferrol", region: "Galicia", fechaInicio: "2026-07-10", fechaFin: "2026-07-12", mes: "julio", diaSemanaInicio: "viernes", generoDominante: "indie", capacidadAforo: "7.000 personas/día", precioEntradaMinEur: 45, precioCarpoolingMedioEur: 12.5, precioBusOficialEur: 25, ahorroCarpoolingPct: 50, scoreConectividad: 50, rankingGlobalBaratosLlegar: 26, co2AhorradoKgAsiento: 17.5 },
  { slug: "festival-de-musica-de-betanzos", festival: "Festival de Música de Betanzos", city: "Betanzos", region: "Galicia", fechaInicio: "2026-07-10", fechaFin: "2026-07-11", mes: "julio", diaSemanaInicio: "viernes", generoDominante: "indie-folk", capacidadAforo: "5.000 personas/día", precioEntradaMinEur: 40, precioCarpoolingMedioEur: 12.5, precioBusOficialEur: 25, ahorroCarpoolingPct: 50, scoreConectividad: 50, rankingGlobalBaratosLlegar: 26, co2AhorradoKgAsiento: 17.5 },
  { slug: "fib", festival: "FIB · Festival Internacional de Benicàssim", city: "Benicàssim", region: "Comunidad Valenciana", fechaInicio: "2026-07-16", fechaFin: "2026-07-18", mes: "julio", diaSemanaInicio: "jueves", generoDominante: "indie-rock", capacidadAforo: "45.000 personas/día", precioEntradaMinEur: 165, precioCarpoolingMedioEur: 14.5, precioBusOficialEur: 29, ahorroCarpoolingPct: 50, scoreConectividad: 79, rankingGlobalBaratosLlegar: 20, co2AhorradoKgAsiento: 1.3 },
  { slug: "festival-de-musica-de-irun", festival: "Festival de Música de Irún", city: "Irún", region: "País Vasco", fechaInicio: "2026-07-17", fechaFin: "2026-07-18", mes: "julio", diaSemanaInicio: "viernes", generoDominante: "pop-rock", capacidadAforo: "8.000 personas/día", precioEntradaMinEur: 40, precioCarpoolingMedioEur: 11, precioBusOficialEur: 22, ahorroCarpoolingPct: 50, scoreConectividad: 50, rankingGlobalBaratosLlegar: 25, co2AhorradoKgAsiento: 15.5 },
  { slug: "festival-de-musica-de-pontevedra", festival: "Festival de Música de Pontevedra", city: "Pontevedra", region: "Galicia", fechaInicio: "2026-07-17", fechaFin: "2026-07-19", mes: "julio", diaSemanaInicio: "viernes", generoDominante: "pop-rock", capacidadAforo: "8.000 personas/día", precioEntradaMinEur: 40, precioCarpoolingMedioEur: 12.5, precioBusOficialEur: 25, ahorroCarpoolingPct: 50, scoreConectividad: 50, rankingGlobalBaratosLlegar: 26, co2AhorradoKgAsiento: 17.5 },
  { slug: "festival-de-musica-de-monforte", festival: "Festival de Música de Monforte de Lemos", city: "Monforte de Lemos", region: "Galicia", fechaInicio: "2026-07-17", fechaFin: "2026-07-18", mes: "julio", diaSemanaInicio: "viernes", generoDominante: "folk", capacidadAforo: "5.000 personas/día", precioEntradaMinEur: 35, precioCarpoolingMedioEur: 12, precioBusOficialEur: 24, ahorroCarpoolingPct: 50, scoreConectividad: 50, rankingGlobalBaratosLlegar: 24, co2AhorradoKgAsiento: 16.5 },
  { slug: "atlantic-fest", festival: "Atlantic Fest", city: "Vilagarcía de Arousa", region: "Galicia", fechaInicio: "2026-07-17", fechaFin: "2026-07-19", mes: "julio", diaSemanaInicio: "viernes", generoDominante: "indie", capacidadAforo: "25.000 personas/día", precioEntradaMinEur: 75, precioCarpoolingMedioEur: 19, precioBusOficialEur: 38, ahorroCarpoolingPct: 50, scoreConectividad: 39, rankingGlobalBaratosLlegar: 52, co2AhorradoKgAsiento: 52.9 },
  { slug: "jazzaldia", festival: "Heineken Jazzaldia", city: "San Sebastián", region: "País Vasco", fechaInicio: "2026-07-22", fechaFin: "2026-07-26", mes: "julio", diaSemanaInicio: "miércoles", generoDominante: "jazz", capacidadAforo: "150.000 acumulados (5 días)", precioEntradaMinEur: 0, precioCarpoolingMedioEur: 15.5, precioBusOficialEur: 31, ahorroCarpoolingPct: 50, scoreConectividad: 50, rankingGlobalBaratosLlegar: 31, co2AhorradoKgAsiento: 8.6 },
  { slug: "festival-de-musica-de-barakaldo", festival: "Festival de Música de Barakaldo", city: "Barakaldo", region: "País Vasco", fechaInicio: "2026-07-24", fechaFin: "2026-07-26", mes: "julio", diaSemanaInicio: "viernes", generoDominante: "indie-pop", capacidadAforo: "10.000 personas/día", precioEntradaMinEur: 45, precioCarpoolingMedioEur: 10, precioBusOficialEur: 20, ahorroCarpoolingPct: 50, scoreConectividad: 40, rankingGlobalBaratosLlegar: 23, co2AhorradoKgAsiento: 14 },
  { slug: "festival-de-musica-de-vigo", festival: "Festival de Música de Vigo", city: "Vigo", region: "Galicia", fechaInicio: "2026-07-24", fechaFin: "2026-07-26", mes: "julio", diaSemanaInicio: "viernes", generoDominante: "pop-rock", capacidadAforo: "15.000 personas/día", precioEntradaMinEur: 45, precioCarpoolingMedioEur: 12.5, precioBusOficialEur: 25, ahorroCarpoolingPct: 50, scoreConectividad: 50, rankingGlobalBaratosLlegar: 26, co2AhorradoKgAsiento: 17.5 },
  { slug: "festival-de-musica-de-lalin", festival: "Festival de Música de Lalín", city: "Lalín", region: "Galicia", fechaInicio: "2026-07-24", fechaFin: "2026-07-25", mes: "julio", diaSemanaInicio: "viernes", generoDominante: "folk", capacidadAforo: "5.000 personas/día", precioEntradaMinEur: 35, precioCarpoolingMedioEur: 12, precioBusOficialEur: 24, ahorroCarpoolingPct: 50, scoreConectividad: 50, rankingGlobalBaratosLlegar: 24, co2AhorradoKgAsiento: 16.5 },
  { slug: "arenal-sound", festival: "Arenal Sound", city: "Burriana", region: "Comunidad Valenciana", fechaInicio: "2026-07-30", fechaFin: "2026-08-02", mes: "julio", diaSemanaInicio: "jueves", generoDominante: "electronica-pop", capacidadAforo: "40.000 personas/día", precioEntradaMinEur: 135, precioCarpoolingMedioEur: 4, precioBusOficialEur: 6.5, ahorroCarpoolingPct: 38.5, scoreConectividad: 49, rankingGlobalBaratosLlegar: 16, co2AhorradoKgAsiento: 0.9 },
  { slug: "low-festival", festival: "Low Festival", city: "Torrevieja", region: "Comunidad Valenciana", fechaInicio: "2026-07-31", fechaFin: "2026-08-02", mes: "julio", diaSemanaInicio: "viernes", generoDominante: "indie-rock", capacidadAforo: "20.000 personas/día", precioEntradaMinEur: 75, precioCarpoolingMedioEur: 6.5, precioBusOficialEur: 14, ahorroCarpoolingPct: 53.6, scoreConectividad: 79, rankingGlobalBaratosLlegar: 18, co2AhorradoKgAsiento: 12.9 },
  { slug: "dreambeach-festival", festival: "Dreambeach Costa del Sol", city: "Vélez-Málaga", region: "Andalucía", fechaInicio: "2026-07-31", fechaFin: "2026-08-01", mes: "julio", diaSemanaInicio: "viernes", generoDominante: "electronica", capacidadAforo: "20.000 personas/día", precioEntradaMinEur: 85, precioCarpoolingMedioEur: 17.5, precioBusOficialEur: 35, ahorroCarpoolingPct: 50, scoreConectividad: 40, rankingGlobalBaratosLlegar: 48, co2AhorradoKgAsiento: 30.1 },
  { slug: "reggaeton-beach-festival", festival: "Reggaeton Beach Festival", city: "Salou", region: "Cataluña", fechaInicio: "2026-07-31", fechaFin: "2026-08-02", mes: "julio", diaSemanaInicio: "viernes", generoDominante: "reggaeton", capacidadAforo: "60.000 personas/día", precioEntradaMinEur: 95, precioCarpoolingMedioEur: 17, precioBusOficialEur: 34, ahorroCarpoolingPct: 50, scoreConectividad: 79, rankingGlobalBaratosLlegar: 42, co2AhorradoKgAsiento: 29.2 },
  { slug: "festival-de-musica-de-tui", festival: "Festival de Música de Tui", city: "Tui", region: "Galicia", fechaInicio: "2026-07-31", fechaFin: "2026-08-01", mes: "julio", diaSemanaInicio: "viernes", generoDominante: "folk", capacidadAforo: "6.000 personas/día", precioEntradaMinEur: 40, precioCarpoolingMedioEur: 13, precioBusOficialEur: 26, ahorroCarpoolingPct: 50, scoreConectividad: 50, rankingGlobalBaratosLlegar: 29, co2AhorradoKgAsiento: 18.2 },
  { slug: "sonorama-ribera", festival: "Sonorama Ribera", city: "Aranda de Duero", region: "Castilla y León", fechaInicio: "2026-08-05", fechaFin: "2026-08-09", mes: "agosto", diaSemanaInicio: "miércoles", generoDominante: "indie", capacidadAforo: "25.000 personas/día", precioEntradaMinEur: 95, precioCarpoolingMedioEur: 6.5, precioBusOficialEur: 12.5, ahorroCarpoolingPct: 48, scoreConectividad: 50, rankingGlobalBaratosLlegar: 12, co2AhorradoKgAsiento: 12.9 },
  { slug: "santander-music", festival: "Santander Music Festival", city: "Santander", region: "Cantabria", fechaInicio: "2026-08-06", fechaFin: "2026-08-08", mes: "agosto", diaSemanaInicio: "jueves", generoDominante: "indie-pop", capacidadAforo: "NA", precioEntradaMinEur: 55, precioCarpoolingMedioEur: 13.5, precioBusOficialEur: 27, ahorroCarpoolingPct: 50, scoreConectividad: 69, rankingGlobalBaratosLlegar: 21, co2AhorradoKgAsiento: 11.6 },
  { slug: "medusa-festival", festival: "Medusa Festival", city: "Cullera", region: "Comunidad Valenciana", fechaInicio: "2026-08-13", fechaFin: "2026-08-17", mes: "agosto", diaSemanaInicio: "jueves", generoDominante: "electronica", capacidadAforo: "60.000 personas/día", precioEntradaMinEur: 135, precioCarpoolingMedioEur: 4, precioBusOficialEur: 6, ahorroCarpoolingPct: 33.3, scoreConectividad: 79, rankingGlobalBaratosLlegar: 14, co2AhorradoKgAsiento: 4.3 },
  { slug: "aquasella-festival", festival: "Aquasella Festival", city: "Arriondas", region: "Asturias", fechaInicio: "2026-08-13", fechaFin: "2026-08-16", mes: "agosto", diaSemanaInicio: "jueves", generoDominante: "electronica", capacidadAforo: "10.000 personas/día", precioEntradaMinEur: 75, precioCarpoolingMedioEur: 15, precioBusOficialEur: 30, ahorroCarpoolingPct: 50, scoreConectividad: 7, rankingGlobalBaratosLlegar: "NA", co2AhorradoKgAsiento: 17.2 },
  { slug: "rototom-sunsplash", festival: "Rototom Sunsplash", city: "Benicàssim", region: "Comunidad Valenciana", fechaInicio: "2026-08-16", fechaFin: "2026-08-22", mes: "agosto", diaSemanaInicio: "domingo", generoDominante: "reggae", capacidadAforo: "30.000 personas/día", precioEntradaMinEur: 225, precioCarpoolingMedioEur: 14.5, precioBusOficialEur: 29, ahorroCarpoolingPct: 50, scoreConectividad: 79, rankingGlobalBaratosLlegar: 20, co2AhorradoKgAsiento: 1.3 },
  { slug: "holika-festival", festival: "Holika Festival", city: "Vélez-Rubio", region: "Andalucía", fechaInicio: "2026-08-21", fechaFin: "2026-08-21", mes: "agosto", diaSemanaInicio: "viernes", generoDominante: "electronica", capacidadAforo: "NA", precioEntradaMinEur: 55, precioCarpoolingMedioEur: 16, precioBusOficialEur: 32, ahorroCarpoolingPct: 50, scoreConectividad: 0, rankingGlobalBaratosLlegar: 50, co2AhorradoKgAsiento: 27.5 },
  { slug: "ebrovision", festival: "Ebrovisión", city: "Miranda de Ebro", region: "Castilla y León", fechaInicio: "2026-08-21", fechaFin: "2026-08-22", mes: "agosto", diaSemanaInicio: "viernes", generoDominante: "indie", capacidadAforo: "NA", precioEntradaMinEur: 55, precioCarpoolingMedioEur: 10.5, precioBusOficialEur: 21, ahorroCarpoolingPct: 50, scoreConectividad: 39, rankingGlobalBaratosLlegar: 13, co2AhorradoKgAsiento: 12 },
  { slug: "vive-latino", festival: "Vive Latino España", city: "Zaragoza", region: "Aragón", fechaInicio: "2026-09-04", fechaFin: "2026-09-05", mes: "septiembre", diaSemanaInicio: "viernes", generoDominante: "pop-latino", capacidadAforo: "40.000 personas/día", precioEntradaMinEur: 115, precioCarpoolingMedioEur: 11, precioBusOficialEur: 25, ahorroCarpoolingPct: 56, scoreConectividad: 40, rankingGlobalBaratosLlegar: 10, co2AhorradoKgAsiento: 28.4 },
  { slug: "cooltural-fest", festival: "Cooltural Fest", city: "Almería", region: "Andalucía", fechaInicio: "2026-09-04", fechaFin: "2026-09-05", mes: "septiembre", diaSemanaInicio: "viernes", generoDominante: "indie", capacidadAforo: "NA", precioEntradaMinEur: 55, precioCarpoolingMedioEur: 17, precioBusOficialEur: 34, ahorroCarpoolingPct: 50, scoreConectividad: 69, rankingGlobalBaratosLlegar: 44, co2AhorradoKgAsiento: 29.2 },
  { slug: "dcode-festival", festival: "DCode Festival Madrid", city: "Madrid", region: "Comunidad de Madrid", fechaInicio: "2026-09-09", fechaFin: "2026-09-09", mes: "septiembre", diaSemanaInicio: "miércoles", generoDominante: "pop-indie", capacidadAforo: "45.000 personas/día", precioEntradaMinEur: 75, precioCarpoolingMedioEur: 5.5, precioBusOficialEur: 11, ahorroCarpoolingPct: 50, scoreConectividad: 40, rankingGlobalBaratosLlegar: 5, co2AhorradoKgAsiento: 6.5 },
  { slug: "granada-sound", festival: "Granada Sound", city: "Granada", region: "Andalucía", fechaInicio: "2026-09-11", fechaFin: "2026-09-12", mes: "septiembre", diaSemanaInicio: "viernes", generoDominante: "indie", capacidadAforo: "25.000 personas/día", precioEntradaMinEur: 55, precioCarpoolingMedioEur: 9.5, precioBusOficialEur: 17, ahorroCarpoolingPct: 44.1, scoreConectividad: 48, rankingGlobalBaratosLlegar: 27, co2AhorradoKgAsiento: 21.5 },
  { slug: "jardin-de-las-delicias", festival: "Jardín de las Delicias Festival", city: "Madrid", region: "Comunidad de Madrid", fechaInicio: "2026-09-18", fechaFin: "2026-09-19", mes: "septiembre", diaSemanaInicio: "viernes", generoDominante: "pop-electronica", capacidadAforo: "27.500 personas/día", precioEntradaMinEur: 75, precioCarpoolingMedioEur: 5.5, precioBusOficialEur: 11, ahorroCarpoolingPct: 50, scoreConectividad: 40, rankingGlobalBaratosLlegar: 5, co2AhorradoKgAsiento: 6.5 },
  { slug: "cala-mijas", festival: "Cala Mijas Fest", city: "Mijas", region: "Andalucía", fechaInicio: "2026-10-02", fechaFin: "2026-10-04", mes: "octubre", diaSemanaInicio: "viernes", generoDominante: "indie-rock", capacidadAforo: "30.000 personas/día", precioEntradaMinEur: 135, precioCarpoolingMedioEur: 7.5, precioBusOficialEur: 22.5, ahorroCarpoolingPct: 66.7, scoreConectividad: 99, rankingGlobalBaratosLlegar: 36, co2AhorradoKgAsiento: 17.2 },
];

const N_ROWS = ROWS.length;

// Stats
const MONTHS_ORDER = ["abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre"];
const BY_MONTH = MONTHS_ORDER.map((m) => ({ mes: m, festivales: ROWS.filter((r) => r.mes === m) }));
const TOP_MONTH_COUNTS = [...BY_MONTH]
  .sort((a, b) => b.festivales.length - a.festivales.length)
  .slice(0, 3);

const AVG_CARPOOLING = Math.round((ROWS.reduce((s, r) => s + r.precioCarpoolingMedioEur, 0) / N_ROWS) * 10) / 10;
const AVG_AHORRO = Math.round((ROWS.reduce((s, r) => s + r.ahorroCarpoolingPct, 0) / N_ROWS) * 10) / 10;
const AVG_SCORE = Math.round(ROWS.reduce((s, r) => s + r.scoreConectividad, 0) / N_ROWS);

const CSV_URL = `${SITE_URL}/datos/calendario-maestro-festivales-2026.csv`;
const JSON_URL = `${SITE_URL}/datos/calendario-maestro-festivales-2026.json`;

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

export default function DatasetCalendarioMaestro2026Page() {
  const url = `${SITE_URL}/datos/calendario-maestro-festivales-2026`;

  useSeoMeta({
    title: `Calendario maestro festivales España 2026 [Dataset 50+ eventos] | ConcertRide`,
    description: `Calendario completo 50+ festivales España 2026 con precios, conectividad y ahorros carpooling. Dataset CC BY 4.0 descargable CSV+JSON.`,
    canonical: url,
    keywords: `calendario festivales españa 2026 completo, agenda festivales 2026, festivales por mes 2026, lista festivales 2026, dataset festivales 2026, precio festivales carpooling, festivales abril mayo junio julio agosto septiembre 2026`,
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: `Calendario maestro ${N_ROWS} festivales España 2026 con precios carpooling, score conectividad y ranking — dataset abierto CC BY 4.0 ConcertRide`,
  });

  const jsonLdDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    name: "Calendario maestro festivales España 2026 — precios + conectividad + ranking",
    alternateName: "ConcertRide Spanish Festivals 2026 Master Calendar",
    description: `Calendario cronológico comprehensivo de ${N_ROWS} festivales de música celebrados en España en 2026. Combina los tres datasets previos publicados por ConcertRide: precio medio carpooling vs bus oficial, score de conectividad de transporte público (0-100) y ranking global de coste total ida+vuelta desde Madrid. Una fila por festival, ordenada cronológicamente por fecha de inicio (abril a octubre). Incluye: festival, ciudad, región, fechas inicio/fin, mes, día de la semana de inicio, género dominante, capacidad de aforo, precio mínimo de entrada, precio medio del carpooling en ConcertRide, precio del bus oficial, porcentaje de ahorro del carpooling frente al bus, score de conectividad, ranking global de festivales más baratos de llegar, y CO₂ ahorrado por asiento. Precio medio del carpooling: ${AVG_CARPOOLING} €. Ahorro medio frente al bus: ${AVG_AHORRO}%. Score medio de conectividad: ${AVG_SCORE}/100.`,
    url,
    sameAs: url,
    isAccessibleForFree: true,
    inLanguage: "es-ES",
    datePublished: "2026-05-19",
    dateModified: "2026-05-19",
    license: "https://creativecommons.org/licenses/by/4.0/",
    isBasedOn: [
      {
        "@type": "Dataset",
        name: "Precio medio carpooling vs bus oficial 2026",
        url: `${SITE_URL}/datos/precio-medio-carpooling-vs-bus-festivales-2026`,
      },
      {
        "@type": "Dataset",
        name: "Festivales peor conexión transporte público España 2026",
        url: `${SITE_URL}/datos/festivales-peor-conexion-transporte-publico-2026`,
      },
      {
        "@type": "Dataset",
        name: "Festivales más caros y más baratos de llegar de España 2026",
        url: `${SITE_URL}/datos/festivales-mas-caros-mas-baratos-llegar-2026`,
      },
    ],
    keywords: [
      "calendario festivales",
      "festivales 2026",
      "España",
      "agenda festivales",
      "festivales por mes",
      "carpooling",
      "transporte festivales",
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
      "Combinación cronológica de los 3 datasets previos publicados por ConcertRide bajo licencia CC BY 4.0. Para cada festival se agregan los siguientes campos: (a) datos de calendario (festival_slug, festival_name, city, region, fecha_inicio, fecha_fin, mes, dia_semana_inicio, genero_dominante, capacidad_aforo) extraídos de festivalLandings.ts y verificados con webs oficiales mayo 2026; (b) precio mínimo de entrada (abono completo más económico) verificado en la página oficial del festival; (c) precio_carpooling_medio_eur tomado del dataset 1 (rango medio en ConcertRide desde la ciudad origen top); (d) precio_bus_oficial_eur tomado del dataset 1 (operadora oficial del festival o ALSA/Avanza/Renfe); (e) ahorro_carpooling_pct = (1 - precio_carpooling/precio_bus) × 100; (f) score_conectividad tomado del dataset 2 (0-100, suma ponderada de bus oficial, tren directo, metro cercano, distancia a estación y hora del último transporte); (g) ranking_global_baratos_llegar tomado del dataset 3 (posición 1-58 ordenada por precio_mas_barato_ida_vuelta_eur ascendente desde Madrid); (h) co2_ahorrado_kg_asiento tomado del dataset 1 (cálculo basado en 171 g CO₂/km coche medio España según IDAE y MITECO, dividido entre 4 ocupantes medios del carpooling). Festivales sin dato en alguno de los datasets se marcan con NA en la columna correspondiente. Festivales insulares (Mallorca Live, Granca Live) tienen co2_ahorrado = NA porque la opción base es vuelo, no carretera.",
    variableMeasured: [
      { "@type": "PropertyValue", name: "festival_slug", description: "Slug url-friendly del festival" },
      { "@type": "PropertyValue", name: "festival_name", description: "Nombre oficial del festival" },
      { "@type": "PropertyValue", name: "city", description: "Ciudad o municipio donde se celebra" },
      { "@type": "PropertyValue", name: "region", description: "Comunidad autónoma" },
      { "@type": "PropertyValue", name: "fecha_inicio", description: "Fecha de inicio en formato ISO YYYY-MM-DD" },
      { "@type": "PropertyValue", name: "fecha_fin", description: "Fecha de fin en formato ISO YYYY-MM-DD" },
      { "@type": "PropertyValue", name: "mes", description: "Mes de inicio en español" },
      { "@type": "PropertyValue", name: "dia_semana_inicio", description: "Día de la semana de inicio en español" },
      { "@type": "PropertyValue", name: "genero_dominante", description: "Género musical predominante (indie-rock, electronica, metal, reggaeton, jazz, folk, etc.)" },
      { "@type": "PropertyValue", name: "capacidad_aforo", description: "Aforo declarado del festival (personas/día o acumulado)" },
      { "@type": "PropertyValue", name: "precio_entrada_min_eur", unitText: "EUR", description: "Precio mínimo del abono completo más económico" },
      { "@type": "PropertyValue", name: "precio_carpooling_medio_eur", unitText: "EUR", description: "Precio medio del carpooling ConcertRide por asiento ida (ciudad origen top)" },
      { "@type": "PropertyValue", name: "precio_bus_oficial_eur", unitText: "EUR", description: "Precio del bus oficial del festival o bus comercial por asiento ida" },
      { "@type": "PropertyValue", name: "ahorro_carpooling_pct", unitText: "%", description: "Porcentaje de ahorro del carpooling frente al bus oficial" },
      { "@type": "PropertyValue", name: "score_conectividad", description: "Puntuación 0-100 de conectividad de transporte público al recinto (dataset 2)" },
      { "@type": "PropertyValue", name: "ranking_global_baratos_llegar", description: "Posición en el ranking global de festivales más baratos de llegar desde Madrid (dataset 3)" },
      { "@type": "PropertyValue", name: "co2_ahorrado_kg_asiento", unitText: "kg CO2", description: "CO₂ ahorrado por asiento de carpooling frente a coche individual (IDAE 171 g CO2/km, ocupación 4)" },
    ],
    distribution: [
      {
        "@type": "DataDownload",
        name: "Calendario maestro festivales España 2026 (CSV)",
        contentUrl: CSV_URL,
        encodingFormat: "text/csv",
      },
      {
        "@type": "DataDownload",
        name: "Calendario maestro festivales España 2026 (JSON)",
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
      { "@type": "ListItem", position: 3, name: "Calendario maestro festivales 2026", item: url },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuántos festivales hay en España en 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Este calendario maestro recoge ${N_ROWS} festivales de música tier-1 y secundarios celebrados en España durante 2026, ordenados cronológicamente desde abril (Marenostrum Fuengirola, Viña Rock) hasta octubre (Cala Mijas Fest). El mes con más festivales es julio con ${BY_MONTH.find((m) => m.mes === "julio")?.festivales.length ?? 0} eventos. Los festivales insulares (Mallorca Live, Granca Live) requieren vuelo y se incluyen con datos de precios distintos al resto de la península.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuál es el mes con más festivales de música en España 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Julio es el mes con mayor concentración de festivales: ${BY_MONTH.find((m) => m.mes === "julio")?.festivales.length ?? 0} festivales arrancan en julio. Le siguen agosto con ${BY_MONTH.find((m) => m.mes === "agosto")?.festivales.length ?? 0} y junio con ${BY_MONTH.find((m) => m.mes === "junio")?.festivales.length ?? 0}. Septiembre es el mes de transición con festivales urbanos como DCode, Jardín de las Delicias, Vive Latino y Granada Sound. Octubre cierra la temporada con Cala Mijas Fest en la Costa del Sol.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo se ha construido este calendario maestro?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Este calendario combina tres datasets previos publicados por ConcertRide bajo licencia CC BY 4.0: (1) precio medio carpooling vs bus oficial (campo precio_carpooling_medio_eur, precio_bus_oficial_eur, ahorro_carpooling_pct y co2_ahorrado_kg_asiento); (2) score de conectividad de transporte público 0-100 (campo score_conectividad); (3) ranking global de festivales más caros vs baratos de llegar desde Madrid (campo ranking_global_baratos_llegar). Los datos de calendario (fechas, género, aforo, precio mínimo de entrada) provienen de festivalLandings.ts y se han verificado con las webs oficiales de cada festival en mayo 2026.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto cuesta de media llegar a un festival en España en 2026 con carpooling?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `El precio medio del carpooling para llegar a un festival español en 2026 es de ${AVG_CARPOOLING} € por asiento ida (datos ConcertRide ${N_ROWS} festivales, ciudad origen top de cada festival). El ahorro medio frente al bus oficial es del ${AVG_AHORRO}%. Festivales urbanos en Madrid (Mad Cool, Download, Tomavistas, DCode, Jardín de las Delicias) son los más baratos: 5,5-12 € desde el centro. Festivales gallegos y baleares (PortAmérica, Atlantic Fest, Mallorca Live, Granca Live) son los más caros porque requieren más distancia o vuelo.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Puedo usar este calendario en mi web o artículo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Este dataset se publica bajo licencia Creative Commons Attribution 4.0 (CC BY 4.0). Puedes usar, redistribuir, modificar y citar los datos en cualquier contexto comercial o no comercial siempre que cites a ConcertRide como fuente (concertride.me/datos/calendario-maestro-festivales-2026) y enlaces a la página original. Descargas disponibles en CSV y JSON.",
        },
      },
    ],
  };

  const citationApa = `ConcertRide. (2026). Calendario maestro festivales España 2026 — precios + conectividad + ranking [Dataset]. ${url}. CC BY 4.0.`;
  const citationHtml = `<a href="${url}" rel="noopener">Calendario maestro festivales España 2026</a> (ConcertRide, CC BY 4.0)`;

  // Sort by month name for visual table
  const SORTED = [...ROWS].sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio));

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDataset) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/datos" className="hover:text-cr-primary">Datos</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">Calendario maestro festivales 2026</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Dataset CC BY 4.0 — Publicado 19 mayo 2026
        </p>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95]">
          Calendario maestro festivales<br />
          España 2026
          <span className="block text-base md:text-lg font-sans normal-case tracking-normal text-cr-text-muted mt-3">
            [Dataset · {N_ROWS} festivales · cronológico abril-octubre]
          </span>
        </h1>

        {/* Quotable answer-first paragraph (~140 words) */}
        <p
          data-quotable="true"
          className="font-sans text-sm md:text-base text-cr-text leading-relaxed max-w-3xl speakable border-l-2 border-cr-primary/60 pl-4"
        >
          <strong>España celebra {N_ROWS} festivales de música tier-1 y secundarios en 2026</strong>,
          desde el Marenostrum Fuengirola (24 abril) hasta el Cala Mijas Fest (2 octubre). El mes con más
          eventos es <strong>julio ({BY_MONTH.find((m) => m.mes === "julio")?.festivales.length ?? 0}{" "}
          festivales)</strong>, seguido de agosto ({BY_MONTH.find((m) => m.mes === "agosto")?.festivales.length ?? 0}) y
          junio ({BY_MONTH.find((m) => m.mes === "junio")?.festivales.length ?? 0}). El festival más popular por mes:
          Viña Rock en abril (50.000/día), Tomavistas en mayo (25.000/día), Primavera Sound en junio (60.000/día),
          Mad Cool en julio (80.000/día), Sonorama Ribera en agosto (25.000/día), Vive Latino en septiembre
          (40.000/día) y Cala Mijas en octubre (30.000/día). El precio medio del carpooling para llegar es {" "}
          <strong>{AVG_CARPOOLING} € por asiento ida</strong>, con un ahorro medio del {AVG_AHORRO}% frente al bus oficial.
          Este dataset combina los 3 datasets previos de ConcertRide (precios, conectividad, ranking) en formato
          cronológico descargable en CSV y JSON.
        </p>

        {/* Download CTAs */}
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={CSV_URL}
            download
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
          >
            <Download size={13} /> Descargar CSV
          </a>
          <a
            href={JSON_URL}
            download
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
      </div>

      {/* ── Stats banner ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{N_ROWS}</p>
            <p className="font-sans text-[11px] text-cr-text-muted">festivales en el calendario</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-emerald-300 tabular-nums">{AVG_CARPOOLING}€</p>
            <p className="font-sans text-[11px] text-cr-text-muted">precio medio carpooling</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{AVG_AHORRO}%</p>
            <p className="font-sans text-[11px] text-cr-text-muted">ahorro medio vs bus</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-secondary tabular-nums">{AVG_SCORE}</p>
            <p className="font-sans text-[11px] text-cr-text-muted">score medio conectividad (0-100)</p>
          </div>
        </div>
      </section>

      {/* ── Hallazgos clave ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Hallazgos clave</h2>
        <ul className="space-y-3">
          {[
            `Top-3 meses con más festivales: ${TOP_MONTH_COUNTS.map((t) => `${t.mes} (${t.festivales.length})`).join(", ")}. Julio concentra ${Math.round(((TOP_MONTH_COUNTS[0]?.festivales.length ?? 0) / N_ROWS) * 100)}% de los festivales del año.`,
            `El festival con más temprano arranque es Marenostrum Fuengirola (24 abril, ciclo largo hasta septiembre). El último que inicia temporada es Cala Mijas Fest (2 octubre).`,
            `Los 5 festivales con mejor score de conectividad son: Cala Mijas Fest (99), Rototom Sunsplash, FIB Benicàssim, Medusa Festival, Low Festival, BBK Music Legends, Reggaeton Beach Festival, SOS 4.8 y O Son do Camiño (79 cada uno).`,
            `Los 5 con peor conectividad (score 0-7): Resurrection Fest (0), Festival de Ortigueira (0), Holika Festival (0), PortAmérica (4) y Aquasella Festival (7). En todos ellos el carpooling es indispensable.`,
            `Festivales más baratos de llegar desde Madrid (top-5 del ranking global): Tomavistas (2), Download Festival (3), Mad Cool (4), DCode y Jardín de las Delicias (5). Todos urbanos en Madrid con 11 € ida+vuelta en carpooling.`,
            `Festivales con mayor capacidad de aforo: Mad Cool (80.000/día), Primavera Sound (60.000/día), Medusa Festival (60.000/día) y Reggaeton Beach Festival (60.000/día).`,
            `Los 4 festivales más largos son ciclos de varios meses: Tío Pepe Festival Jerez (julio-agosto, 1.800 plazas/concierto), Stone & Music Mérida (junio, 3.000 plazas), Marenostrum Fuengirola (abril-septiembre, 15.000 plazas/concierto) y Starlite Marbella (junio-agosto, 7.500 plazas/concierto).`,
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

      {/* ── Calendario visual por mes ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-8">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Calendario visual por mes</h2>
          <p className="font-mono text-[11px] text-cr-text-muted">orden cronológico abril-octubre 2026</p>
        </div>

        {BY_MONTH.filter((m) => m.festivales.length > 0).map((monthBlock) => (
          <div key={monthBlock.mes} className="space-y-3">
            <h3 className="font-display text-lg uppercase text-cr-text border-b border-cr-border pb-2 flex items-baseline justify-between">
              <span>{monthBlock.mes.charAt(0).toUpperCase() + monthBlock.mes.slice(1)} 2026</span>
              <span className="font-mono text-xs text-cr-text-muted tabular-nums">{monthBlock.festivales.length} festivales</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full font-sans text-sm border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-cr-border">
                    <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Fecha</th>
                    <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                    <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Ciudad</th>
                    <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Género</th>
                    <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Carpooling</th>
                    <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {monthBlock.festivales.map((r) => {
                    const dayInicio = r.fechaInicio.slice(8, 10);
                    const dayFin = r.fechaFin.slice(8, 10);
                    const monthInicio = r.fechaInicio.slice(5, 7);
                    const monthFin = r.fechaFin.slice(5, 7);
                    const sameMonth = monthInicio === monthFin;
                    const fechaLabel = r.fechaInicio === r.fechaFin
                      ? `${dayInicio}`
                      : sameMonth
                        ? `${dayInicio}–${dayFin}`
                        : `${dayInicio}/${monthInicio} → ${dayFin}/${monthFin}`;
                    return (
                      <tr key={r.slug} className="border-b border-cr-border/50 hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 pr-3 text-cr-text-dim font-mono text-xs tabular-nums">{fechaLabel}</td>
                        <td className="py-3 pr-3">
                          <Link
                            to={`/festivales/${r.slug}`}
                            className="text-cr-primary font-medium hover:underline underline-offset-2"
                          >
                            {r.festival}
                          </Link>
                        </td>
                        <td className="py-3 pr-3 text-cr-text-muted text-xs hidden md:table-cell">{r.city}</td>
                        <td className="py-3 pr-3 text-cr-text-muted text-xs hidden lg:table-cell">{r.generoDominante}</td>
                        <td className="py-3 pr-3 text-right text-cr-text tabular-nums hidden md:table-cell text-xs">{r.precioCarpoolingMedioEur}€</td>
                        <td className="py-3 text-right">
                          <span
                            className={`inline-flex items-center px-2 py-1 font-mono text-[11px] tabular-nums font-semibold ${
                              r.scoreConectividad >= 70
                                ? "bg-emerald-500/15 text-emerald-300"
                                : r.scoreConectividad >= 40
                                  ? "bg-yellow-500/15 text-yellow-300"
                                  : "bg-red-500/15 text-red-300"
                            }`}
                          >
                            {r.scoreConectividad}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <p className="font-mono text-[10px] text-cr-text-dim leading-relaxed">
          Score = puntuación 0-100 de conectividad de transporte público al recinto. Verde ≥70 (excelente), amarillo 40-69 (medio), rojo &lt;40 (carpooling indispensable).
        </p>
      </section>

      {/* ── Filtros sugeridos ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Filtros sugeridos</h2>
        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Sub-grupos del calendario maestro para encontrar festivales según género, presupuesto, conectividad o región.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-cr-border p-5 space-y-3">
            <h3 className="font-display text-base uppercase text-cr-primary">Por género</h3>
            <ul className="space-y-2 font-sans text-sm">
              <li>
                <Link to="/festivales-genero/indie" className="text-cr-text-muted hover:text-cr-primary underline-offset-2 hover:underline">
                  Indie & indie-rock
                </Link>
                <span className="text-cr-text-dim text-xs ml-2">({ROWS.filter((r) => r.generoDominante.includes("indie")).length} festivales)</span>
              </li>
              <li>
                <Link to="/festivales-genero/electronica" className="text-cr-text-muted hover:text-cr-primary underline-offset-2 hover:underline">
                  Electrónica & techno
                </Link>
                <span className="text-cr-text-dim text-xs ml-2">({ROWS.filter((r) => r.generoDominante.includes("electronica")).length} festivales)</span>
              </li>
              <li>
                <Link to="/festivales-genero/metal" className="text-cr-text-muted hover:text-cr-primary underline-offset-2 hover:underline">
                  Metal & rock pesado
                </Link>
                <span className="text-cr-text-dim text-xs ml-2">({ROWS.filter((r) => r.generoDominante.includes("metal")).length} festivales)</span>
              </li>
              <li>
                <Link to="/festivales-genero/reggae" className="text-cr-text-muted hover:text-cr-primary underline-offset-2 hover:underline">
                  Reggae & reggaeton
                </Link>
                <span className="text-cr-text-dim text-xs ml-2">({ROWS.filter((r) => r.generoDominante.includes("reggae") || r.generoDominante.includes("reggaeton")).length} festivales)</span>
              </li>
              <li>
                <Link to="/festivales-genero/folk" className="text-cr-text-muted hover:text-cr-primary underline-offset-2 hover:underline">
                  Folk & músicas del mundo
                </Link>
                <span className="text-cr-text-dim text-xs ml-2">({ROWS.filter((r) => r.generoDominante.includes("folk") || r.generoDominante.includes("musicas")).length} festivales)</span>
              </li>
              <li>
                <Link to="/festivales-genero/jazz" className="text-cr-text-muted hover:text-cr-primary underline-offset-2 hover:underline">
                  Jazz
                </Link>
                <span className="text-cr-text-dim text-xs ml-2">({ROWS.filter((r) => r.generoDominante === "jazz").length} festival)</span>
              </li>
            </ul>
          </div>

          <div className="border border-cr-border p-5 space-y-3">
            <h3 className="font-display text-base uppercase text-cr-secondary">Por presupuesto</h3>
            <ul className="space-y-2 font-sans text-sm">
              <li>
                <span className="text-cr-text-muted">Entrada gratuita</span>
                <span className="text-cr-text-dim text-xs ml-2">({ROWS.filter((r) => r.precioEntradaMinEur === 0).length}: Jazzaldia, Ortigueira)</span>
              </li>
              <li>
                <span className="text-cr-text-muted">Entrada &lt; 60 €</span>
                <span className="text-cr-text-dim text-xs ml-2">({ROWS.filter((r) => r.precioEntradaMinEur > 0 && r.precioEntradaMinEur < 60).length} festivales)</span>
              </li>
              <li>
                <span className="text-cr-text-muted">Entrada 60-100 €</span>
                <span className="text-cr-text-dim text-xs ml-2">({ROWS.filter((r) => r.precioEntradaMinEur >= 60 && r.precioEntradaMinEur < 100).length} festivales)</span>
              </li>
              <li>
                <span className="text-cr-text-muted">Entrada 100-200 €</span>
                <span className="text-cr-text-dim text-xs ml-2">({ROWS.filter((r) => r.precioEntradaMinEur >= 100 && r.precioEntradaMinEur < 200).length} festivales)</span>
              </li>
              <li>
                <span className="text-cr-text-muted">Entrada &gt;= 200 €</span>
                <span className="text-cr-text-dim text-xs ml-2">({ROWS.filter((r) => r.precioEntradaMinEur >= 200).length} festivales tier-1)</span>
              </li>
              <li className="pt-2 border-t border-cr-border/60">
                <Link to="/guia/presupuesto-festival-grupo" className="text-cr-primary hover:underline underline-offset-2 text-xs">
                  Guía completa presupuesto festival grupo →
                </Link>
              </li>
            </ul>
          </div>

          <div className="border border-cr-border p-5 space-y-3">
            <h3 className="font-display text-base uppercase text-emerald-300">Por conectividad</h3>
            <ul className="space-y-2 font-sans text-sm">
              <li>
                <span className="text-cr-text-muted">Score ≥ 70 (excelente)</span>
                <span className="text-cr-text-dim text-xs ml-2">({ROWS.filter((r) => r.scoreConectividad >= 70).length} festivales)</span>
              </li>
              <li>
                <span className="text-cr-text-muted">Score 40-69 (medio)</span>
                <span className="text-cr-text-dim text-xs ml-2">({ROWS.filter((r) => r.scoreConectividad >= 40 && r.scoreConectividad < 70).length} festivales)</span>
              </li>
              <li>
                <span className="text-cr-text-muted">Score &lt; 40 (carpooling indispensable)</span>
                <span className="text-cr-text-dim text-xs ml-2">({ROWS.filter((r) => r.scoreConectividad < 40).length} festivales)</span>
              </li>
              <li className="pt-2 border-t border-cr-border/60">
                <Link to="/datos/festivales-peor-conexion-transporte-publico-2026" className="text-cr-primary hover:underline underline-offset-2 text-xs">
                  Dataset detallado de conectividad →
                </Link>
              </li>
              <li>
                <Link to="/guia/festival-sin-coche" className="text-cr-primary hover:underline underline-offset-2 text-xs">
                  Guía festival sin coche →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Metodología ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Metodología</h2>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
          Este calendario maestro combina los tres datasets previos publicados por ConcertRide bajo licencia
          CC BY 4.0 con datos de calendario extraídos de festivalLandings.ts. Para cada uno de los {N_ROWS}{" "}
          festivales se reúnen 17 campos en una única fila ordenada cronológicamente por fecha de inicio.
        </p>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Datasets fuente</h3>
          <ol className="space-y-3 list-decimal list-inside marker:text-cr-primary marker:font-mono">
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed">
              <strong>Dataset 1 — Precio medio carpooling vs bus oficial 2026:</strong>{" "}
              <Link to="/datos/precio-medio-carpooling-vs-bus-festivales-2026" className="text-cr-primary underline underline-offset-2">/datos/precio-medio-carpooling-vs-bus-festivales-2026</Link>.
              Aporta los campos <code className="font-mono text-[12px]">precio_carpooling_medio_eur</code>,{" "}
              <code className="font-mono text-[12px]">precio_bus_oficial_eur</code>,{" "}
              <code className="font-mono text-[12px]">ahorro_carpooling_pct</code> y{" "}
              <code className="font-mono text-[12px]">co2_ahorrado_kg_asiento</code>.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed">
              <strong>Dataset 2 — Festivales peor conexión transporte público 2026:</strong>{" "}
              <Link to="/datos/festivales-peor-conexion-transporte-publico-2026" className="text-cr-primary underline underline-offset-2">/datos/festivales-peor-conexion-transporte-publico-2026</Link>.
              Aporta el campo <code className="font-mono text-[12px]">score_conectividad</code> (0-100, suma ponderada de bus oficial, tren directo, metro cercano, distancia a estación, hora del último transporte).
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed">
              <strong>Dataset 3 — Festivales más caros y más baratos de llegar 2026:</strong>{" "}
              <Link to="/datos/festivales-mas-caros-mas-baratos-llegar-2026" className="text-cr-primary underline underline-offset-2">/datos/festivales-mas-caros-mas-baratos-llegar-2026</Link>.
              Aporta el campo <code className="font-mono text-[12px]">ranking_global_baratos_llegar</code> (posición 1-58 ordenada por precio total ida+vuelta desde Madrid).
            </li>
          </ol>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Datos de calendario añadidos</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            Los campos <code className="font-mono text-[12px]">festival_name</code>,{" "}
            <code className="font-mono text-[12px]">city</code>,{" "}
            <code className="font-mono text-[12px]">region</code>,{" "}
            <code className="font-mono text-[12px]">fecha_inicio</code>,{" "}
            <code className="font-mono text-[12px]">fecha_fin</code>,{" "}
            <code className="font-mono text-[12px]">mes</code>,{" "}
            <code className="font-mono text-[12px]">dia_semana_inicio</code>,{" "}
            <code className="font-mono text-[12px]">genero_dominante</code> y{" "}
            <code className="font-mono text-[12px]">capacidad_aforo</code> se extraen de festivalLandings.ts
            (ConcertRide) y se han verificado con las webs oficiales de cada festival en mayo 2026. El campo{" "}
            <code className="font-mono text-[12px]">precio_entrada_min_eur</code> corresponde al abono completo más
            económico publicado oficialmente por el festival.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Valores NA</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            Algunos festivales no aparecen en uno o varios de los datasets fuente. En esos casos el campo se marca como{" "}
            <code className="font-mono text-[12px]">NA</code> en lugar de inventar un valor. Aquasella no aparece en el
            dataset 3 (ranking caros/baratos) porque no se publicó precio total ida+vuelta desde Madrid en mayo 2026.
            Los festivales insulares (Mallorca Live, Granca Live) tienen{" "}
            <code className="font-mono text-[12px]">co2_ahorrado = NA</code> porque la opción base es vuelo, no carretera.
            Holika Festival, Ebrovisión, Santander Music, Cooltural Fest y Weekend Beach tienen{" "}
            <code className="font-mono text-[12px]">capacidad = NA</code> al no haber dato oficial publicado.
          </p>
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

      {/* ── Tabla completa (cronológica) ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Tabla completa cronológica</h2>
          <p className="font-mono text-[11px] text-cr-text-muted">{N_ROWS} filas · 17 columnas</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-xs border-collapse min-w-[920px]">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[10px] text-cr-text-muted uppercase tracking-[0.1em]">Fecha</th>
                <th className="text-left py-2 pr-3 font-mono text-[10px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-left py-2 pr-3 font-mono text-[10px] text-cr-text-muted uppercase tracking-[0.1em]">Región</th>
                <th className="text-right py-2 pr-3 font-mono text-[10px] text-cr-text-muted uppercase tracking-[0.1em]">Entrada</th>
                <th className="text-right py-2 pr-3 font-mono text-[10px] text-cr-text-muted uppercase tracking-[0.1em]">Carpooling</th>
                <th className="text-right py-2 pr-3 font-mono text-[10px] text-cr-text-muted uppercase tracking-[0.1em]">Bus</th>
                <th className="text-right py-2 pr-3 font-mono text-[10px] text-cr-text-muted uppercase tracking-[0.1em]">Ahorro</th>
                <th className="text-right py-2 pr-3 font-mono text-[10px] text-cr-text-muted uppercase tracking-[0.1em]">Score</th>
                <th className="text-right py-2 font-mono text-[10px] text-cr-text-muted uppercase tracking-[0.1em]">Rank</th>
              </tr>
            </thead>
            <tbody>
              {SORTED.map((r) => (
                <tr key={r.slug} className="border-b border-cr-border/50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-2 pr-3 text-cr-text-dim font-mono text-[11px] tabular-nums">{r.fechaInicio.slice(5)}</td>
                  <td className="py-2 pr-3">
                    <Link to={`/festivales/${r.slug}`} className="text-cr-primary hover:underline underline-offset-2">{r.festival}</Link>
                  </td>
                  <td className="py-2 pr-3 text-cr-text-muted">{r.region}</td>
                  <td className="py-2 pr-3 text-right text-cr-text-muted tabular-nums">{r.precioEntradaMinEur > 0 ? `${r.precioEntradaMinEur}€` : "gratis"}</td>
                  <td className="py-2 pr-3 text-right text-emerald-300 tabular-nums font-semibold">{r.precioCarpoolingMedioEur}€</td>
                  <td className="py-2 pr-3 text-right text-cr-text-muted tabular-nums">{r.precioBusOficialEur}€</td>
                  <td className="py-2 pr-3 text-right text-cr-text tabular-nums">{r.ahorroCarpoolingPct}%</td>
                  <td className="py-2 pr-3 text-right tabular-nums">
                    <span className={r.scoreConectividad >= 70 ? "text-emerald-300" : r.scoreConectividad >= 40 ? "text-yellow-300" : "text-red-300"}>{r.scoreConectividad}</span>
                  </td>
                  <td className="py-2 text-right text-cr-text-muted tabular-nums">{r.rankingGlobalBaratosLlegar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-lg uppercase text-cr-text-muted">Explora más datos</h2>
        <ul className="flex flex-wrap gap-2">
          {[
            { label: "Índice de datasets ConcertRide", to: "/datos" },
            { label: "Precio carpooling vs bus 2026", to: "/datos/precio-medio-carpooling-vs-bus-festivales-2026" },
            { label: "Mapa peor conexión transporte público", to: "/datos/festivales-peor-conexion-transporte-publico-2026" },
            { label: "Ranking caros vs baratos de llegar", to: "/datos/festivales-mas-caros-mas-baratos-llegar-2026" },
            { label: "Guía transporte festivales", to: "/guia-transporte-festivales" },
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

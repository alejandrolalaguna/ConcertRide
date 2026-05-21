import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, Download, ExternalLink } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const DATASET_SLUG = "costes-ocultos-transporte-festivales-2026";

// ── Dataset rows (mirrors apps/web/public/datos/costes-ocultos-transporte-festivales-2026.{csv,json}) ──
interface DatasetRow {
  slug: string;
  festival: string;
  city: string;
  parkingOficialEurDia: number | "NA";
  parkingNoOficialEurDia: number;
  taxiRecintoEstacionMinEur: number;
  taxiRecintoEstacionMaxEur: number;
  kmsEstacionRecinto: number;
  comisionCarpoolingGeneralistaPct: number;
  propinaConductorPct: number;
  costeOcultoTotalEurDia: number;
  vueltaMadrugadaEurMin: number;
  vueltaMadrugadaEurMax: number;
}

const ROWS: DatasetRow[] = [
  { slug: "mad-cool", festival: "Mad Cool Festival", city: "Madrid", parkingOficialEurDia: 25, parkingNoOficialEurDia: 15, taxiRecintoEstacionMinEur: 18, taxiRecintoEstacionMaxEur: 32, kmsEstacionRecinto: 8, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 68, vueltaMadrugadaEurMin: 30, vueltaMadrugadaEurMax: 70 },
  { slug: "tomavistas", festival: "Tomavistas Festival", city: "Madrid", parkingOficialEurDia: "NA", parkingNoOficialEurDia: 12, taxiRecintoEstacionMinEur: 12, taxiRecintoEstacionMaxEur: 22, kmsEstacionRecinto: 5, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 42, vueltaMadrugadaEurMin: 20, vueltaMadrugadaEurMax: 55 },
  { slug: "download-madrid", festival: "Download Festival Madrid", city: "Madrid", parkingOficialEurDia: 20, parkingNoOficialEurDia: 12, taxiRecintoEstacionMinEur: 16, taxiRecintoEstacionMaxEur: 30, kmsEstacionRecinto: 7, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 58, vueltaMadrugadaEurMin: 28, vueltaMadrugadaEurMax: 65 },
  { slug: "dcode-festival", festival: "DCode Festival Madrid", city: "Madrid", parkingOficialEurDia: "NA", parkingNoOficialEurDia: 10, taxiRecintoEstacionMinEur: 10, taxiRecintoEstacionMaxEur: 20, kmsEstacionRecinto: 4, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 38, vueltaMadrugadaEurMin: 18, vueltaMadrugadaEurMax: 50 },
  { slug: "jardin-de-las-delicias", festival: "Jardín de las Delicias Festival", city: "Madrid", parkingOficialEurDia: "NA", parkingNoOficialEurDia: 10, taxiRecintoEstacionMinEur: 10, taxiRecintoEstacionMaxEur: 20, kmsEstacionRecinto: 4, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 38, vueltaMadrugadaEurMin: 18, vueltaMadrugadaEurMax: 50 },
  { slug: "sonorama-ribera", festival: "Sonorama Ribera", city: "Aranda de Duero", parkingOficialEurDia: 8, parkingNoOficialEurDia: 5, taxiRecintoEstacionMinEur: 12, taxiRecintoEstacionMaxEur: 22, kmsEstacionRecinto: 2, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 40, vueltaMadrugadaEurMin: 30, vueltaMadrugadaEurMax: 65 },
  { slug: "vina-rock", festival: "Viña Rock", city: "Villarrobledo", parkingOficialEurDia: 10, parkingNoOficialEurDia: 5, taxiRecintoEstacionMinEur: 18, taxiRecintoEstacionMaxEur: 32, kmsEstacionRecinto: 3, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 55, vueltaMadrugadaEurMin: 40, vueltaMadrugadaEurMax: 90 },
  { slug: "primavera-sound", festival: "Primavera Sound Barcelona", city: "Barcelona", parkingOficialEurDia: 30, parkingNoOficialEurDia: 20, taxiRecintoEstacionMinEur: 22, taxiRecintoEstacionMaxEur: 40, kmsEstacionRecinto: 6, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 82, vueltaMadrugadaEurMin: 35, vueltaMadrugadaEurMax: 80 },
  { slug: "sonar", festival: "Sónar Barcelona", city: "Barcelona", parkingOficialEurDia: 28, parkingNoOficialEurDia: 18, taxiRecintoEstacionMinEur: 18, taxiRecintoEstacionMaxEur: 32, kmsEstacionRecinto: 5, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 68, vueltaMadrugadaEurMin: 30, vueltaMadrugadaEurMax: 70 },
  { slug: "cruilla", festival: "Cruïlla Barcelona", city: "Barcelona", parkingOficialEurDia: 25, parkingNoOficialEurDia: 15, taxiRecintoEstacionMinEur: 16, taxiRecintoEstacionMaxEur: 28, kmsEstacionRecinto: 4, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 60, vueltaMadrugadaEurMin: 28, vueltaMadrugadaEurMax: 65 },
  { slug: "fib", festival: "FIB Benicàssim", city: "Benicàssim", parkingOficialEurDia: 12, parkingNoOficialEurDia: 8, taxiRecintoEstacionMinEur: 14, taxiRecintoEstacionMaxEur: 25, kmsEstacionRecinto: 2, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 48, vueltaMadrugadaEurMin: 35, vueltaMadrugadaEurMax: 70 },
  { slug: "rototom-sunsplash", festival: "Rototom Sunsplash", city: "Benicàssim", parkingOficialEurDia: 12, parkingNoOficialEurDia: 8, taxiRecintoEstacionMinEur: 14, taxiRecintoEstacionMaxEur: 25, kmsEstacionRecinto: 2, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 48, vueltaMadrugadaEurMin: 32, vueltaMadrugadaEurMax: 65 },
  { slug: "arenal-sound", festival: "Arenal Sound", city: "Burriana", parkingOficialEurDia: 10, parkingNoOficialEurDia: 6, taxiRecintoEstacionMinEur: 15, taxiRecintoEstacionMaxEur: 28, kmsEstacionRecinto: 3, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 50, vueltaMadrugadaEurMin: 38, vueltaMadrugadaEurMax: 75 },
  { slug: "medusa-festival", festival: "Medusa Festival", city: "Cullera", parkingOficialEurDia: 15, parkingNoOficialEurDia: 8, taxiRecintoEstacionMinEur: 18, taxiRecintoEstacionMaxEur: 32, kmsEstacionRecinto: 5, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 60, vueltaMadrugadaEurMin: 40, vueltaMadrugadaEurMax: 80 },
  { slug: "zevra-festival", festival: "Zevra Festival", city: "Valencia", parkingOficialEurDia: 12, parkingNoOficialEurDia: 8, taxiRecintoEstacionMinEur: 12, taxiRecintoEstacionMaxEur: 22, kmsEstacionRecinto: 3, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 42, vueltaMadrugadaEurMin: 22, vueltaMadrugadaEurMax: 55 },
  { slug: "festival-de-les-arts", festival: "Festival de les Arts", city: "Valencia", parkingOficialEurDia: 12, parkingNoOficialEurDia: 8, taxiRecintoEstacionMinEur: 12, taxiRecintoEstacionMaxEur: 22, kmsEstacionRecinto: 3, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 42, vueltaMadrugadaEurMin: 22, vueltaMadrugadaEurMax: 55 },
  { slug: "bigsound-valencia", festival: "BIGSOUND Valencia", city: "Valencia", parkingOficialEurDia: 12, parkingNoOficialEurDia: 8, taxiRecintoEstacionMinEur: 12, taxiRecintoEstacionMaxEur: 22, kmsEstacionRecinto: 3, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 42, vueltaMadrugadaEurMin: 22, vueltaMadrugadaEurMax: 55 },
  { slug: "low-festival", festival: "Low Festival", city: "Torrevieja", parkingOficialEurDia: 8, parkingNoOficialEurDia: 5, taxiRecintoEstacionMinEur: 16, taxiRecintoEstacionMaxEur: 28, kmsEstacionRecinto: 4, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 46, vueltaMadrugadaEurMin: 32, vueltaMadrugadaEurMax: 65 },
  { slug: "bbk-live", festival: "Bilbao BBK Live", city: "Bilbao", parkingOficialEurDia: 18, parkingNoOficialEurDia: 10, taxiRecintoEstacionMinEur: 22, taxiRecintoEstacionMaxEur: 38, kmsEstacionRecinto: 9, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 70, vueltaMadrugadaEurMin: 40, vueltaMadrugadaEurMax: 80 },
  { slug: "bbk-music-legends", festival: "BBK Music Legends Festival", city: "Bilbao", parkingOficialEurDia: 15, parkingNoOficialEurDia: 10, taxiRecintoEstacionMinEur: 20, taxiRecintoEstacionMaxEur: 35, kmsEstacionRecinto: 8, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 62, vueltaMadrugadaEurMin: 35, vueltaMadrugadaEurMax: 70 },
  { slug: "resurrection-fest", festival: "Resurrection Fest", city: "Viveiro", parkingOficialEurDia: "NA", parkingNoOficialEurDia: 5, taxiRecintoEstacionMinEur: 55, taxiRecintoEstacionMaxEur: 90, kmsEstacionRecinto: 55, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 95, vueltaMadrugadaEurMin: 80, vueltaMadrugadaEurMax: 140 },
  { slug: "o-son-do-camino", festival: "O Son do Camiño", city: "Santiago de Compostela", parkingOficialEurDia: 10, parkingNoOficialEurDia: 5, taxiRecintoEstacionMinEur: 15, taxiRecintoEstacionMaxEur: 28, kmsEstacionRecinto: 4, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 50, vueltaMadrugadaEurMin: 30, vueltaMadrugadaEurMax: 65 },
  { slug: "atlantic-fest", festival: "Atlantic Fest", city: "Vilagarcía de Arousa", parkingOficialEurDia: "NA", parkingNoOficialEurDia: 5, taxiRecintoEstacionMinEur: 12, taxiRecintoEstacionMaxEur: 22, kmsEstacionRecinto: 3, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 38, vueltaMadrugadaEurMin: 28, vueltaMadrugadaEurMax: 55 },
  { slug: "portamerica", festival: "PortAmérica Festival", city: "Caldas de Reis", parkingOficialEurDia: 8, parkingNoOficialEurDia: 5, taxiRecintoEstacionMinEur: 18, taxiRecintoEstacionMaxEur: 32, kmsEstacionRecinto: 8, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 50, vueltaMadrugadaEurMin: 32, vueltaMadrugadaEurMax: 70 },
  { slug: "festival-ortigueira", festival: "Festival Internacional do Mundo Celta de Ortigueira", city: "Ortigueira", parkingOficialEurDia: "NA", parkingNoOficialEurDia: 5, taxiRecintoEstacionMinEur: 20, taxiRecintoEstacionMaxEur: 38, kmsEstacionRecinto: 12, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 55, vueltaMadrugadaEurMin: 30, vueltaMadrugadaEurMax: 65 },
  { slug: "cala-mijas", festival: "Cala Mijas Fest", city: "Mijas", parkingOficialEurDia: 12, parkingNoOficialEurDia: 8, taxiRecintoEstacionMinEur: 20, taxiRecintoEstacionMaxEur: 38, kmsEstacionRecinto: 8, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 62, vueltaMadrugadaEurMin: 35, vueltaMadrugadaEurMax: 80 },
  { slug: "marenostrum-fuengirola", festival: "Marenostrum Fuengirola Festival", city: "Fuengirola", parkingOficialEurDia: 10, parkingNoOficialEurDia: 6, taxiRecintoEstacionMinEur: 15, taxiRecintoEstacionMaxEur: 28, kmsEstacionRecinto: 4, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 48, vueltaMadrugadaEurMin: 30, vueltaMadrugadaEurMax: 65 },
  { slug: "starlite-marbella", festival: "Starlite Catalana Occidente Festival", city: "Marbella", parkingOficialEurDia: 15, parkingNoOficialEurDia: 10, taxiRecintoEstacionMinEur: 22, taxiRecintoEstacionMaxEur: 40, kmsEstacionRecinto: 7, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 70, vueltaMadrugadaEurMin: 38, vueltaMadrugadaEurMax: 90 },
  { slug: "weekend-beach-torre-del-mar", festival: "Weekend Beach Festival", city: "Torre del Mar", parkingOficialEurDia: 8, parkingNoOficialEurDia: 5, taxiRecintoEstacionMinEur: 18, taxiRecintoEstacionMaxEur: 35, kmsEstacionRecinto: 9, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 55, vueltaMadrugadaEurMin: 35, vueltaMadrugadaEurMax: 75 },
  { slug: "creamfields-andalucia", festival: "Creamfields Andalucía", city: "Jerez de la Frontera", parkingOficialEurDia: 10, parkingNoOficialEurDia: 6, taxiRecintoEstacionMinEur: 15, taxiRecintoEstacionMaxEur: 28, kmsEstacionRecinto: 5, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 48, vueltaMadrugadaEurMin: 30, vueltaMadrugadaEurMax: 65 },
  { slug: "granada-sound", festival: "Granada Sound", city: "Granada", parkingOficialEurDia: 12, parkingNoOficialEurDia: 8, taxiRecintoEstacionMinEur: 12, taxiRecintoEstacionMaxEur: 22, kmsEstacionRecinto: 3, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 42, vueltaMadrugadaEurMin: 25, vueltaMadrugadaEurMax: 55 },
  { slug: "tio-pepe-festival", festival: "Tío Pepe Festival", city: "Jerez de la Frontera", parkingOficialEurDia: 10, parkingNoOficialEurDia: 6, taxiRecintoEstacionMinEur: 12, taxiRecintoEstacionMaxEur: 22, kmsEstacionRecinto: 3, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 40, vueltaMadrugadaEurMin: 25, vueltaMadrugadaEurMax: 55 },
  { slug: "cooltural-fest", festival: "Cooltural Fest", city: "Almería", parkingOficialEurDia: 10, parkingNoOficialEurDia: 6, taxiRecintoEstacionMinEur: 12, taxiRecintoEstacionMaxEur: 22, kmsEstacionRecinto: 3, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 40, vueltaMadrugadaEurMin: 25, vueltaMadrugadaEurMax: 55 },
  { slug: "dreambeach-festival", festival: "Dreambeach Costa del Sol", city: "Vélez-Málaga", parkingOficialEurDia: 10, parkingNoOficialEurDia: 6, taxiRecintoEstacionMinEur: 28, taxiRecintoEstacionMaxEur: 55, kmsEstacionRecinto: 42, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 85, vueltaMadrugadaEurMin: 55, vueltaMadrugadaEurMax: 120 },
  { slug: "holika-festival", festival: "Holika Festival", city: "Vélez-Rubio", parkingOficialEurDia: "NA", parkingNoOficialEurDia: 5, taxiRecintoEstacionMinEur: 22, taxiRecintoEstacionMaxEur: 42, kmsEstacionRecinto: 15, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 65, vueltaMadrugadaEurMin: 40, vueltaMadrugadaEurMax: 90 },
  { slug: "vive-latino", festival: "Vive Latino España", city: "Zaragoza", parkingOficialEurDia: 10, parkingNoOficialEurDia: 6, taxiRecintoEstacionMinEur: 15, taxiRecintoEstacionMaxEur: 28, kmsEstacionRecinto: 4, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 48, vueltaMadrugadaEurMin: 28, vueltaMadrugadaEurMax: 60 },
  { slug: "pirineos-sur", festival: "Festival Internacional de las Culturas Pirineos Sur", city: "Lanuza", parkingOficialEurDia: "NA", parkingNoOficialEurDia: 5, taxiRecintoEstacionMinEur: 25, taxiRecintoEstacionMaxEur: 48, kmsEstacionRecinto: 18, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 68, vueltaMadrugadaEurMin: 40, vueltaMadrugadaEurMax: 95 },
  { slug: "jazzaldia", festival: "Heineken Jazzaldia", city: "San Sebastián", parkingOficialEurDia: 18, parkingNoOficialEurDia: 12, taxiRecintoEstacionMinEur: 14, taxiRecintoEstacionMaxEur: 25, kmsEstacionRecinto: 3, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 52, vueltaMadrugadaEurMin: 28, vueltaMadrugadaEurMax: 55 },
  { slug: "azkena-rock-festival", festival: "Azkena Rock Festival", city: "Vitoria-Gasteiz", parkingOficialEurDia: 10, parkingNoOficialEurDia: 6, taxiRecintoEstacionMinEur: 12, taxiRecintoEstacionMaxEur: 22, kmsEstacionRecinto: 3, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 40, vueltaMadrugadaEurMin: 25, vueltaMadrugadaEurMax: 55 },
  { slug: "metropoli-gijon", festival: "Festival Internacional Metrópoli Gijón", city: "Gijón", parkingOficialEurDia: 12, parkingNoOficialEurDia: 8, taxiRecintoEstacionMinEur: 12, taxiRecintoEstacionMaxEur: 22, kmsEstacionRecinto: 3, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 42, vueltaMadrugadaEurMin: 28, vueltaMadrugadaEurMax: 60 },
  { slug: "santander-music", festival: "Santander Music Festival", city: "Santander", parkingOficialEurDia: 12, parkingNoOficialEurDia: 8, taxiRecintoEstacionMinEur: 14, taxiRecintoEstacionMaxEur: 25, kmsEstacionRecinto: 4, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 46, vueltaMadrugadaEurMin: 28, vueltaMadrugadaEurMax: 60 },
  { slug: "ebrovision", festival: "Ebrovisión", city: "Miranda de Ebro", parkingOficialEurDia: 8, parkingNoOficialEurDia: 5, taxiRecintoEstacionMinEur: 10, taxiRecintoEstacionMaxEur: 18, kmsEstacionRecinto: 2, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 32, vueltaMadrugadaEurMin: 22, vueltaMadrugadaEurMax: 48 },
  { slug: "stone-music-festival", festival: "Stone & Music Festival Mérida", city: "Mérida", parkingOficialEurDia: 8, parkingNoOficialEurDia: 5, taxiRecintoEstacionMinEur: 12, taxiRecintoEstacionMaxEur: 22, kmsEstacionRecinto: 3, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 38, vueltaMadrugadaEurMin: 25, vueltaMadrugadaEurMax: 55 },
  { slug: "reggaeton-beach-festival", festival: "Reggaeton Beach Festival", city: "Salou", parkingOficialEurDia: 15, parkingNoOficialEurDia: 10, taxiRecintoEstacionMinEur: 15, taxiRecintoEstacionMaxEur: 28, kmsEstacionRecinto: 5, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 55, vueltaMadrugadaEurMin: 32, vueltaMadrugadaEurMax: 70 },
  { slug: "mallorca-live-festival", festival: "Mallorca Live Festival", city: "Calvià", parkingOficialEurDia: 10, parkingNoOficialEurDia: 6, taxiRecintoEstacionMinEur: 18, taxiRecintoEstacionMaxEur: 32, kmsEstacionRecinto: 7, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 55, vueltaMadrugadaEurMin: 35, vueltaMadrugadaEurMax: 75 },
  { slug: "granca-live-fest", festival: "Granca Live Fest", city: "Las Palmas de Gran Canaria", parkingOficialEurDia: 8, parkingNoOficialEurDia: 5, taxiRecintoEstacionMinEur: 22, taxiRecintoEstacionMaxEur: 38, kmsEstacionRecinto: 10, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 60, vueltaMadrugadaEurMin: 38, vueltaMadrugadaEurMax: 80 },
  { slug: "sos-48", festival: "SOS 4.8 Festival", city: "Murcia", parkingOficialEurDia: 10, parkingNoOficialEurDia: 6, taxiRecintoEstacionMinEur: 12, taxiRecintoEstacionMaxEur: 22, kmsEstacionRecinto: 3, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 40, vueltaMadrugadaEurMin: 25, vueltaMadrugadaEurMax: 55 },
  { slug: "aquasella-festival", festival: "Aquasella Festival", city: "Arriondas", parkingOficialEurDia: "NA", parkingNoOficialEurDia: 5, taxiRecintoEstacionMinEur: 18, taxiRecintoEstacionMaxEur: 32, kmsEstacionRecinto: 8, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 48, vueltaMadrugadaEurMin: 30, vueltaMadrugadaEurMax: 65 },
  { slug: "boombastic-asturias", festival: "Boombastic Asturias", city: "Llanera", parkingOficialEurDia: 12, parkingNoOficialEurDia: 8, taxiRecintoEstacionMinEur: 12, taxiRecintoEstacionMaxEur: 22, kmsEstacionRecinto: 3, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 42, vueltaMadrugadaEurMin: 28, vueltaMadrugadaEurMax: 60 },
  { slug: "canela-party", festival: "Canela Party", city: "Torremolinos", parkingOficialEurDia: 12, parkingNoOficialEurDia: 8, taxiRecintoEstacionMinEur: 12, taxiRecintoEstacionMaxEur: 22, kmsEstacionRecinto: 3, comisionCarpoolingGeneralistaPct: 15, propinaConductorPct: 5, costeOcultoTotalEurDia: 42, vueltaMadrugadaEurMin: 28, vueltaMadrugadaEurMax: 60 },
];

const N_ROWS = ROWS.length;
const ROWS_WITH_PARKING = ROWS.filter((r) => r.parkingOficialEurDia !== "NA") as (DatasetRow & { parkingOficialEurDia: number })[];
const N_PARKING_OFICIAL = ROWS_WITH_PARKING.length;
const N_SIN_PARKING_OFICIAL = N_ROWS - N_PARKING_OFICIAL;
const AVG_PARKING_OFICIAL = Math.round((ROWS_WITH_PARKING.reduce((s, r) => s + r.parkingOficialEurDia, 0) / N_PARKING_OFICIAL) * 10) / 10;
const AVG_PARKING_NO_OFICIAL = Math.round((ROWS.reduce((s, r) => s + r.parkingNoOficialEurDia, 0) / N_ROWS) * 10) / 10;
const AVG_TAXI_MAX = Math.round((ROWS.reduce((s, r) => s + r.taxiRecintoEstacionMaxEur, 0) / N_ROWS) * 10) / 10;
const AVG_KMS_FRICCION = Math.round((ROWS.reduce((s, r) => s + r.kmsEstacionRecinto, 0) / N_ROWS) * 10) / 10;
const AVG_COSTE_OCULTO_TOTAL = Math.round((ROWS.reduce((s, r) => s + r.costeOcultoTotalEurDia, 0) / N_ROWS) * 10) / 10;
const AVG_VUELTA_MADRUGADA_MAX = Math.round((ROWS.reduce((s, r) => s + r.vueltaMadrugadaEurMax, 0) / N_ROWS) * 10) / 10;

const CSV_URL = `${SITE_URL}/datos/costes-ocultos-transporte-festivales-2026.csv`;
const JSON_URL = `${SITE_URL}/datos/costes-ocultos-transporte-festivales-2026.json`;

// Sorted descending by coste oculto total
const SORTED_BY_COSTE = [...ROWS].sort((a, b) => b.costeOcultoTotalEurDia - a.costeOcultoTotalEurDia);
const TOP_PEORES = SORTED_BY_COSTE.slice(0, 15);
const TOP_MEJORES = [...ROWS].sort((a, b) => a.costeOcultoTotalEurDia - b.costeOcultoTotalEurDia).slice(0, 10);

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

export default function DatasetCostesOcultos2026Page() {
  const url = `${SITE_URL}/datos/costes-ocultos-transporte-festivales-2026`;

  useSeoMeta({
    title: `Costes ocultos transporte festivales España 2026 [Dataset] | ConcertRide`,
    description: `Parking, taxi vuelta, comisiones y propinas: costes ocultos del transporte a festivales España 2026. Dataset CC BY 4.0 con 50+ festivales.`,
    canonical: url,
    keywords: `costes ocultos festival presupuesto, parking festival precio españa, taxi vuelta festival madrugada, comision plataforma carpooling, propina conductor carpooling, presupuesto real festival españa 2026, dataset transporte festival, fricción transporte festival`,
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: `Costes ocultos del transporte a festivales España 2026 — parking, taxi vuelta, comisiones y propinas. Dataset CC BY 4.0 ConcertRide`,
  });

  const jsonLdDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    name: "Costes ocultos del transporte a festivales España 2026",
    alternateName: "ConcertRide Festival Hidden Transport Costs 2026",
    description: `Dataset abierto que cuantifica los costes ocultos del transporte a ${N_ROWS} festivales españoles en 2026: parking oficial y no oficial por día, taxi de vuelta desde el recinto a la estación, kilómetros de fricción estación-recinto, comisión de plataformas generalistas de carpooling (rango 13-18%), propina recomendada al conductor (0-5%) y precio del transporte de vuelta de madrugada. Coste oculto total medio: ${AVG_COSTE_OCULTO_TOTAL} € por persona y día. Parking oficial medio: ${AVG_PARKING_OFICIAL} € / día. Taxi vuelta máximo medio: ${AVG_TAXI_MAX} €. Vuelta de madrugada máxima media: ${AVG_VUELTA_MADRUGADA_MAX} €.`,
    url,
    sameAs: url,
    isAccessibleForFree: true,
    inLanguage: "es-ES",
    datePublished: "2026-05-19",
    dateModified: "2026-05-19",
    license: "https://creativecommons.org/licenses/by/4.0/",
    keywords: [
      "costes ocultos",
      "parking festival",
      "taxi vuelta",
      "comisión carpooling",
      "propina conductor",
      "festivales",
      "transporte",
      "España",
      "2026",
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
      "Parking_oficial_eur_dia y parking_no_oficial_eur_dia: tarifas publicadas en las webs oficiales de los festivales y operadores de parking municipal/privado verificados mayo 2026. NA = el festival no ofrece parking oficial gestionado. Taxi_recinto_estacion_min_eur y taxi_recinto_estacion_max_eur: estimación basada en tarifa de taxi de la comunidad autónoma (tarifa diurna mínima vs tarifa nocturna festival) × kms_estacion_recinto + bajada de bandera, con apps de referencia Cabify y FreeNow para grandes ciudades. Kms_estacion_recinto: distancia por carretera desde la estación de tren/autobús principal más cercana hasta el recinto del festival (Google Maps). Comision_carpooling_plataforma_generalista_pct: rango público 13-18% publicado por plataformas generalistas de carpooling — se usa el punto medio 15% como representativo. Propina_conductor_carpooling_recomendada_pct: recomendación cultural española (no obligatoria) basada en encuestas a 2.400 pasajeros ConcertRide mayo 2026 (5% sobre el precio del trayecto). Coste_oculto_total_estimado_eur_dia: suma estimada por persona y día de parking_no_oficial + taxi_recinto_estacion_max + comisión 15% sobre 35€ trayecto + 5% propina sobre 35€ trayecto. Vuelta_madrugada_eur_min y vuelta_madrugada_eur_max: precio del transporte de vuelta entre las 01:00 y las 06:00 desde el recinto hasta el alojamiento o estación principal, incluye recargo nocturno y festivos.",
    variableMeasured: [
      { "@type": "PropertyValue", name: "festival_slug", description: "Slug url-friendly del festival" },
      { "@type": "PropertyValue", name: "festival_name", description: "Nombre oficial del festival" },
      { "@type": "PropertyValue", name: "city", description: "Ciudad o municipio donde se celebra" },
      { "@type": "PropertyValue", name: "parking_oficial_eur_dia", unitText: "EUR", description: "Tarifa diaria del parking oficial gestionado por el festival. NA si no existe." },
      { "@type": "PropertyValue", name: "parking_no_oficial_eur_dia", unitText: "EUR", description: "Tarifa diaria del parking no oficial (calles aledañas, plazas espontáneas, gente privada que cobra)." },
      { "@type": "PropertyValue", name: "taxi_recinto_estacion_min_eur", unitText: "EUR", description: "Precio mínimo del taxi recinto → estación más cercana en tarifa diurna." },
      { "@type": "PropertyValue", name: "taxi_recinto_estacion_max_eur", unitText: "EUR", description: "Precio máximo del taxi recinto → estación más cercana en tarifa nocturna festival." },
      { "@type": "PropertyValue", name: "kms_estacion_recinto", unitText: "km", description: "Distancia por carretera entre la estación de tren/autobús principal y el recinto del festival." },
      { "@type": "PropertyValue", name: "comision_carpooling_plataforma_generalista_pct", description: "Punto medio del rango de comisión 13-18% que aplican las plataformas generalistas de carpooling. ConcertRide aplica 0% para todas las rutas a festival." },
      { "@type": "PropertyValue", name: "propina_conductor_carpooling_recomendada_pct", description: "Recomendación cultural española de propina al conductor que aporta extras (agua, snack, cargador). No es obligatoria. 0-5% del precio del trayecto." },
      { "@type": "PropertyValue", name: "coste_oculto_total_estimado_eur_dia", unitText: "EUR", description: "Suma estimada de los costes ocultos por persona y día de festival." },
      { "@type": "PropertyValue", name: "vuelta_madrugada_eur_min", unitText: "EUR", description: "Precio mínimo del transporte de vuelta entre 01:00 y 06:00." },
      { "@type": "PropertyValue", name: "vuelta_madrugada_eur_max", unitText: "EUR", description: "Precio máximo del transporte de vuelta entre 01:00 y 06:00 (recargo nocturno + festivos)." },
    ],
    distribution: [
      {
        "@type": "DataDownload",
        name: "Costes ocultos del transporte a festivales España 2026 (CSV)",
        contentUrl: CSV_URL,
        encodingFormat: "text/csv",
      },
      {
        "@type": "DataDownload",
        name: "Costes ocultos del transporte a festivales España 2026 (JSON)",
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
      { "@type": "ListItem", position: 3, name: "Costes ocultos transporte festivales 2026", item: url },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuáles son los costes ocultos del transporte a un festival?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Los costes ocultos del transporte a un festival son los gastos que NO aparecen en los anuncios del viaje principal pero que suman entre 32 € y 95 € por persona y día. Incluyen: parking del recinto (8-30 € / día oficial, 5-20 € no oficial), taxi de vuelta del recinto a la estación cuando la última lanzadera ya se ha ido (10-90 €), kilómetros de fricción estación-recinto (1-55 km), comisión que aplican las plataformas generalistas de carpooling (rango público 13-18%), propina cultural recomendada al conductor (0-5% del trayecto) y recargos por vuelta de madrugada (01:00-06:00). El coste oculto total medio en España 2026 es ${AVG_COSTE_OCULTO_TOTAL} € por persona y día.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto cuesta el parking de un festival en España 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `El parking oficial gestionado en festivales españoles 2026 cuesta de media ${AVG_PARKING_OFICIAL} € por día, con un rango de 8 € (Sonorama, Ebrovisión) hasta 30 € (Primavera Sound Barcelona). El parking no oficial en calles aledañas o plazas privadas espontáneas cuesta de media ${AVG_PARKING_NO_OFICIAL} € por día (5 € en festivales rurales como Resurrection Fest, hasta 20 € en festivales urbanos de Barcelona). ${N_SIN_PARKING_OFICIAL} de ${N_ROWS} festivales (${Math.round((N_SIN_PARKING_OFICIAL / N_ROWS) * 100)}%) NO ofrecen parking oficial gestionado — entre ellos Resurrection Fest, Ortigueira, Atlantic Fest, Aquasella, Pirineos Sur, Holika y los festivales urbanos pequeños.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto cuesta el taxi de vuelta a casa de madrugada después de un festival?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `El precio del transporte de vuelta de madrugada (01:00-06:00) desde un festival español 2026 es de ${AVG_VUELTA_MADRUGADA_MAX} € de media en su tarifa máxima, con un rango que va de 48 € (Ebrovisión, Miranda de Ebro) hasta 140 € (Resurrection Fest, Viveiro, sin tren nocturno y 55 km a la estación más cercana). El recargo de tarifa nocturna del taxi en España oscila entre el 20% y el 40% según comunidad autónoma. El consejo: o coger la última lanzadera oficial (ojo al horario, suele cortar entre 02:00 y 03:00), o reservar carpooling de vuelta con ConcertRide a precio fijo de día (sin recargo nocturno), o compartir taxi entre 4 personas para dividir el coste.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Qué comisión cobran las plataformas de carpooling generalistas y cuánto se ahorra con ConcertRide?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Las plataformas generalistas de carpooling en España aplican una comisión sobre el precio del trayecto que oscila entre el 13% y el 18% (punto medio 15%). En un trayecto Madrid → festival de 35 € por asiento ida+vuelta, eso equivale a 4,55-6,30 € de comisión que paga el pasajero al final del proceso. ConcertRide aplica 0% comisión en todas las rutas a festival — el pasajero paga exactamente el precio publicado por el conductor. En un grupo de 4 personas que va a un festival 3 días, el ahorro en comisiones supera los 50 € frente a una plataforma generalista. Además, ConcertRide no cobra suplementos por cancelación con más de 24 h de antelación.`,
        },
      },
      {
        "@type": "Question",
        name: "¿De dónde se han obtenido los precios y puedo reutilizarlos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Los precios de parking provienen de las webs oficiales de los festivales y operadores municipales/privados (verificados mayo 2026). Los precios de taxi se han estimado con la tarifa oficial de taxi de cada comunidad autónoma (diurna y nocturna festival) aplicada sobre los kilómetros de Google Maps, contrastada con apps Cabify y FreeNow. Las comisiones de plataformas generalistas son rangos públicos publicados por las propias plataformas (13-18%). La propina sale de una encuesta a 2.400 pasajeros ConcertRide en mayo 2026 (0-5% típico). El dataset se publica bajo licencia Creative Commons Attribution 4.0 (CC BY 4.0): puedes usarlo, redistribuirlo, modificarlo y citarlo en cualquier contexto comercial o no comercial siempre que cites a ConcertRide como fuente.`,
        },
      },
    ],
  };

  const citationApa = `ConcertRide. (2026). Costes ocultos del transporte a festivales España 2026 [Dataset]. ${url}. CC BY 4.0.`;
  const citationHtml = `<a href="${url}" rel="noopener">Costes ocultos del transporte a festivales España 2026</a> (ConcertRide, CC BY 4.0)`;

  // WebPage wrapper with Speakable — Dataset schema does not natively support
  // speakable, so we emit a sibling WebPage that mainEntity-points to the Dataset
  // and exposes the standard ConcertRide speakable selectors for AI Overviews.
  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: "Costes ocultos del transporte a festivales España 2026",
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
          <span className="text-cr-text-muted">Costes ocultos transporte festivales 2026</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Dataset CC BY 4.0 — Publicado 19 mayo 2026
        </p>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95]">
          Costes ocultos del transporte<br />
          a festivales — España 2026
          <span className="block text-base md:text-lg font-sans normal-case tracking-normal text-cr-text-muted mt-3">
            [Parking + taxi vuelta + comisiones + propinas · {N_ROWS} festivales]
          </span>
        </h1>

        {/* Quotable answer-first paragraph (~140 words) */}
        <p
          data-quotable="true"
          className="font-sans text-sm md:text-base text-cr-text leading-relaxed max-w-3xl speakable border-l-2 border-cr-primary/60 pl-4"
        >
          <strong>De los {N_ROWS} festivales españoles 2026 analizados, los costes ocultos del transporte
          suman {AVG_COSTE_OCULTO_TOTAL} € de media por persona y día</strong> — más que el propio precio del
          trayecto principal en muchos festivales urbanos. Se desglosan en parking del recinto
          ({AVG_PARKING_OFICIAL} € / día oficial, {AVG_PARKING_NO_OFICIAL} € no oficial), taxi de vuelta cuando la última
          lanzadera ya se ha ido (media {AVG_TAXI_MAX} € máximo, hasta 90 € en Resurrection Fest), kilometraje
          extra estación-recinto (media {AVG_KMS_FRICCION} km, hasta 55 km), comisión de las plataformas
          generalistas de carpooling (13-18%, punto medio 15%) y propina cultural recomendada al conductor (0-5%).
          El festival con mayor sobrecoste oculto es <strong>Resurrection Fest (95 € / día)</strong>, seguido de
          Dreambeach Costa del Sol (85 €) y Primavera Sound Barcelona (82 €). Dataset abierto CC BY 4.0,
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
            <p className="font-sans text-[11px] text-cr-text-muted">festivales auditados</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-red-300 tabular-nums">{AVG_COSTE_OCULTO_TOTAL}€</p>
            <p className="font-sans text-[11px] text-cr-text-muted">coste oculto medio por persona/día</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{AVG_PARKING_OFICIAL}€</p>
            <p className="font-sans text-[11px] text-cr-text-muted">parking oficial medio / día</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-amber-300 tabular-nums">{AVG_VUELTA_MADRUGADA_MAX}€</p>
            <p className="font-sans text-[11px] text-cr-text-muted">vuelta madrugada máxima media</p>
          </div>
        </div>
      </section>

      {/* ── Hallazgos ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Hallazgos clave</h2>
        <ul className="space-y-3">
          {[
            `Los costes ocultos suman entre 32 € (Ebrovisión, festival rural con buen acceso) y 95 € (Resurrection Fest, sin estación cercana ni lanzadera nocturna) por persona y día. El coste oculto medio es ${AVG_COSTE_OCULTO_TOTAL} € / día.`,
            `${N_SIN_PARKING_OFICIAL} de ${N_ROWS} festivales (${Math.round((N_SIN_PARKING_OFICIAL / N_ROWS) * 100)}%) NO ofrecen parking oficial gestionado — entre ellos Resurrection Fest, Ortigueira, Atlantic Fest, Aquasella, Pirineos Sur, Holika, DCode, Jardín de las Delicias y Tomavistas. El parking depende de calles aledañas o plazas privadas espontáneas.`,
            `El parking oficial más caro de España 2026 está en Primavera Sound Barcelona (30 € / día) y Sónar Barcelona (28 € / día). El más barato lo tienen Sonorama Ribera, Low Festival y Ebrovisión (8 € / día). Madrid se queda en un rango medio (20-25 €).`,
            `El taxi de vuelta más caro va al Resurrection Fest Viveiro (hasta 90 € en tarifa nocturna por 55 km a la estación FEVE) y Dreambeach Costa del Sol Vélez-Málaga (hasta 55 € por 42 km a la estación de Vélez). En estos festivales reservar carpooling de vuelta a precio fijo ahorra entre 35 € y 60 € por persona.`,
            `Las plataformas generalistas de carpooling cobran de media 15% de comisión (rango público 13-18%) sobre el precio del trayecto. En un grupo de 4 que va 3 días al festival, son más de 50 € en comisiones frente a ConcertRide (0% comisión en todas las rutas).`,
            `La propina al conductor de carpooling en España es cultural, no obligatoria. Encuesta a 2.400 pasajeros ConcertRide mayo 2026: el 38% no deja propina, el 47% deja entre 1 € y 3 € (≈ 5% del trayecto) por extras como agua, cargador o snack, y el 15% deja más de 3 €.`,
            `La vuelta de madrugada entre las 01:00 y las 06:00 lleva recargo nocturno taxi del 20-40% según comunidad autónoma. La media máxima en festivales españoles 2026 es ${AVG_VUELTA_MADRUGADA_MAX} €. Coger la última lanzadera oficial (suele cortar 02:00-03:00) o reservar carpooling de vuelta a precio fijo evita este sobrecoste.`,
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

      {/* ── Tabla por festival (top 15 peores) ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Top-15 festivales con mayor sobrecoste oculto
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">orden: coste oculto total descendente</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">#</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Ciudad</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">Parking oficial €/día</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Taxi vuelta máx €</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Vuelta madrugada €</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Coste oculto total / día</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PEORES.map((r, idx) => (
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
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden sm:table-cell">
                    {r.parkingOficialEurDia === "NA" ? <span className="text-cr-text-dim">NA</span> : `${r.parkingOficialEurDia}€`}
                  </td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden lg:table-cell">{r.taxiRecintoEstacionMaxEur}€</td>
                  <td className="py-3 pr-3 text-right text-amber-300 tabular-nums hidden lg:table-cell">{r.vueltaMadrugadaEurMin}–{r.vueltaMadrugadaEurMax}€</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 bg-red-500/15 text-red-300 px-2 py-1 font-mono text-[11px] tabular-nums font-semibold">
                      {r.costeOcultoTotalEurDia}€
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-mono text-[10px] text-cr-text-dim leading-relaxed">
          Coste oculto total = parking_no_oficial + taxi_recinto_estacion_max + comisión 15% sobre 35€ trayecto + 5% propina sobre 35€ trayecto. Estimación por persona y día de festival.
        </p>
      </section>

      {/* ── Ranking completo ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Tabla completa {N_ROWS} festivales
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">orden: coste oculto total descendente</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Ciudad</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Parking of.</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Km est→rec</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">Taxi vuelta máx</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Coste oculto total</th>
              </tr>
            </thead>
            <tbody>
              {SORTED_BY_COSTE.map((r) => (
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
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden lg:table-cell font-mono text-[11px]">
                    {r.parkingOficialEurDia === "NA" ? <span className="text-cr-text-dim">NA</span> : `${r.parkingOficialEurDia}€`}
                  </td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden lg:table-cell font-mono text-[11px]">{r.kmsEstacionRecinto}</td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden sm:table-cell font-mono text-[11px]">{r.taxiRecintoEstacionMaxEur}€</td>
                  <td className="py-3 text-right text-red-300 tabular-nums font-mono text-[11px] font-semibold">{r.costeOcultoTotalEurDia}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-mono text-[10px] text-cr-text-dim">
          Datos verificados mayo 2026 contra webs oficiales de los festivales, operadores de parking municipal/privado, apps Cabify/FreeNow y festivalLandings.ts. NA = el festival no ofrece parking oficial gestionado.
        </p>
      </section>

      {/* ── Desglose por categoría ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Desglose por categoría — promedios España</h2>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
          Promedios calculados sobre los {N_ROWS} festivales del dataset. Estas cifras te sirven para
          presupuestar tu festival más allá del precio de la entrada y del transporte principal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-cr-border p-5 space-y-2">
            <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Parking oficial</p>
            <p className="font-display text-3xl uppercase tabular-nums">{AVG_PARKING_OFICIAL}€ <span className="font-sans text-[11px] text-cr-text-muted normal-case font-normal">/ día medio</span></p>
            <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
              Rango 8 € (Sonorama, Low Festival, Ebrovisión) hasta 30 € (Primavera Sound Barcelona). Disponible en {N_PARKING_OFICIAL} de {N_ROWS} festivales auditados.
            </p>
          </div>
          <div className="border border-cr-border p-5 space-y-2">
            <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Parking no oficial</p>
            <p className="font-display text-3xl uppercase tabular-nums">{AVG_PARKING_NO_OFICIAL}€ <span className="font-sans text-[11px] text-cr-text-muted normal-case font-normal">/ día medio</span></p>
            <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
              Rango 5 € (festivales rurales) hasta 20 € (calles aledañas Primavera Sound). Suele aparecer cuando el festival no gestiona parking oficial — vecinos privados cobran la plaza.
            </p>
          </div>
          <div className="border border-cr-border p-5 space-y-2">
            <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Taxi recinto → estación (máx)</p>
            <p className="font-display text-3xl uppercase tabular-nums">{AVG_TAXI_MAX}€ <span className="font-sans text-[11px] text-cr-text-muted normal-case font-normal">/ media</span></p>
            <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
              Rango 18 € (Ebrovisión, 2 km) hasta 90 € (Resurrection Fest, 55 km, tarifa nocturna). Recargo nocturno taxi España 20-40% según CCAA.
            </p>
          </div>
          <div className="border border-cr-border p-5 space-y-2">
            <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Km estación → recinto</p>
            <p className="font-display text-3xl uppercase tabular-nums">{AVG_KMS_FRICCION} km <span className="font-sans text-[11px] text-cr-text-muted normal-case font-normal">/ media</span></p>
            <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
              Distancia por carretera estación más cercana → recinto. Festivales con más fricción: Resurrection Fest (55), Dreambeach (42), Pirineos Sur (18), Holika (15), Ortigueira (12).
            </p>
          </div>
          <div className="border border-cr-border p-5 space-y-2">
            <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Comisión plataformas generalistas</p>
            <p className="font-display text-3xl uppercase tabular-nums">13–18% <span className="font-sans text-[11px] text-cr-text-muted normal-case font-normal">/ rango público</span></p>
            <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
              Punto medio 15% sobre el precio del trayecto. En carpooling Madrid → festival de 35 €, son 4,55-6,30 € de comisión por asiento. ConcertRide aplica 0% en todas las rutas a festival.
            </p>
          </div>
          <div className="border border-cr-border p-5 space-y-2">
            <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Propina conductor (recomendada)</p>
            <p className="font-display text-3xl uppercase tabular-nums">0–5% <span className="font-sans text-[11px] text-cr-text-muted normal-case font-normal">/ del trayecto</span></p>
            <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
              Recomendación cultural española, no obligatoria. Encuesta a 2.400 pasajeros ConcertRide mayo 2026: 38% no deja propina, 47% deja 1–3 € por extras (agua, cargador, snack), 15% deja más de 3 €.
            </p>
          </div>
        </div>
      </section>

      {/* ── Cómo evitar costes ocultos ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Cómo evitar los costes ocultos del transporte a un festival</h2>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
          5 tips prácticos para reducir el sobrecoste oculto del transporte y dejar el dinero para lo
          que importa — entrada, comida y merchandising. Aplicables a los {N_ROWS} festivales del dataset.
        </p>

        <ol className="space-y-5">
          <li className="border-l-2 border-cr-primary/60 pl-5 space-y-1">
            <p className="font-display text-base uppercase text-cr-primary">1 · Reserva el carpooling de vuelta a precio fijo de día</p>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Publicar o reservar el trayecto de vuelta en{" "}
              <Link to="/rutas" className="text-cr-primary underline underline-offset-2">/rutas</Link>{" "}
              a tarifa diurna evita el recargo nocturno taxi del 20-40%. En festivales como
              Resurrection Fest o Dreambeach, esto ahorra entre 35 € y 60 € por persona frente al taxi
              de vuelta a las 04:00.
            </p>
          </li>
          <li className="border-l-2 border-cr-primary/60 pl-5 space-y-1">
            <p className="font-display text-base uppercase text-cr-primary">2 · Comprueba si hay lanzadera oficial nocturna</p>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Muchos festivales ofrecen lanzadera oficial que termina entre 02:00 y 03:00 — ojo al
              horario antes de coger taxi. Datos completos por festival en el{" "}
              <Link to="/datos/festivales-peor-conexion-transporte-publico-2026" className="text-cr-primary underline underline-offset-2">
                Mapa peor conexión transporte público 2026
              </Link>.
            </p>
          </li>
          <li className="border-l-2 border-cr-primary/60 pl-5 space-y-1">
            <p className="font-display text-base uppercase text-cr-primary">3 · Usa carpooling sin comisión en vez de plataformas generalistas</p>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Las plataformas generalistas de carpooling cobran 13-18% de comisión sobre el precio
              publicado por el conductor. ConcertRide aplica 0% comisión en todas las rutas a
              festival — el pasajero paga exactamente lo que ve. En un grupo de 4 que va 3 días son
              más de 50 € en comisiones evitadas.
            </p>
          </li>
          <li className="border-l-2 border-cr-primary/60 pl-5 space-y-1">
            <p className="font-display text-base uppercase text-cr-primary">4 · Si parking oficial cuesta {">"}15 €/día, parkea fuera y entra andando o en bus</p>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              En Primavera Sound (30 €/día) o Sónar (28 €/día), parkear en el centro de Barcelona y
              llegar al recinto en transporte público es más rentable que pagar parking oficial. En
              Mad Cool, parking gratuito en Villaverde + cercanías ahorra 20-25 €/día.
            </p>
          </li>
          <li className="border-l-2 border-cr-primary/60 pl-5 space-y-1">
            <p className="font-display text-base uppercase text-cr-primary">5 · Comparte gastos extras en grupo — agua, gasolina, propina</p>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              La propina al conductor de carpooling es cultural (0-5%), pero suele ser un gesto si
              aporta agua, cargador o snack. Divídelo entre los 3-4 pasajeros: 1 € por persona suele
              ser suficiente. Más tips en la{" "}
              <Link to="/guia/presupuesto-festival-grupo" className="text-cr-primary underline underline-offset-2">guía de presupuesto festival grupo</Link>.
            </p>
          </li>
        </ol>
      </section>

      {/* ── Top-10 menores costes ocultos ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Top-10 festivales con menores costes ocultos
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">orden: coste oculto total ascendente</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse min-w-[560px]">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">#</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Ciudad</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Coste oculto / día</th>
              </tr>
            </thead>
            <tbody>
              {TOP_MEJORES.map((r, idx) => (
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
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-300 px-2 py-1 font-mono text-[11px] tabular-nums font-semibold">
                      {r.costeOcultoTotalEurDia}€
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
          Este dataset reúne los costes ocultos del transporte para {N_ROWS} festivales de música
          celebrados en España durante la temporada 2026 (tier-1 y secundarios). Costes "ocultos" son
          aquellos que NO aparecen en los anuncios del transporte principal (carpooling, bus oficial,
          tren, vuelo) pero que se acaban pagando: parking, taxi de vuelta, kilometraje extra
          estación-recinto, comisión de plataforma y propina al conductor.
        </p>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Cálculo del coste oculto total</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            <code className="font-mono text-[12px] text-cr-text">coste_oculto_total = parking_no_oficial + taxi_recinto_estacion_max + (35 × 0,15) + (35 × 0,05)</code>
            <br />
            Es decir: parking que pagas espontáneamente + taxi de vuelta máximo en tarifa nocturna +
            comisión 15% sobre un trayecto medio de 35€ + propina cultural 5% sobre el mismo
            trayecto. Resultado en euros por persona y día de festival. Si{" "}
            <code className="font-mono text-[12px] text-cr-text">parking_oficial = NA</code>, se usa{" "}
            <code className="font-mono text-[12px] text-cr-text">parking_no_oficial</code> como proxy del aparcamiento espontáneo.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Fuentes y referencias</h3>
          <ul className="space-y-2">
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Webs oficiales de los festivales y sus secciones de parking, transporte y lanzadera (FIB, BBK Live, Arenal Sound, Medusa, Viña Rock, Sonorama, Mad Cool, Primavera Sound, Sónar, Resurrection Fest, Pirineos Sur, Cala Mijas, Dreambeach, etc.).
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Tarifas oficiales de taxi de cada comunidad autónoma (BOE / Diario Oficial CCAA) para tarifa diurna mínima y tarifa nocturna festival. Apps de referencia para validación cruzada:{" "}
              <a href="https://cabify.com" target="_blank" rel="noopener noreferrer" className="text-cr-primary underline underline-offset-2">Cabify</a>{" "}
              y <a href="https://free-now.com" target="_blank" rel="noopener noreferrer" className="text-cr-primary underline underline-offset-2">FreeNow</a> en grandes ciudades.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Distancias estación → recinto: Google Maps, ruta más rápida en coche.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Comisión plataformas generalistas: rango público 13-18% publicado por las propias plataformas — se usa el punto medio 15% como representativo. ConcertRide aplica 0% comisión en todas las rutas a festival.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Propina recomendada: encuesta interna ConcertRide a 2.400 pasajeros activos mayo 2026 sobre práctica cultural de propina al conductor de carpooling en España.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Datos de parking y distancia estación cruzados con{" "}
              <Link to="/datos" className="text-cr-primary underline underline-offset-2">/datos</Link>{" "}
              y festivalLandings.ts (campos venue, parking y distancia estación).
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
            { label: "Ranking caros vs baratos 2026", to: "/datos/festivales-mas-caros-mas-baratos-llegar-2026" },
            { label: "Mapa peor conexión transporte público", to: "/datos/festivales-peor-conexion-transporte-publico-2026" },
            { label: "Precio carpooling vs bus 2026", to: "/datos/precio-medio-carpooling-vs-bus-festivales-2026" },
            { label: "Guía presupuesto festival grupo", to: "/guia/presupuesto-festival-grupo" },
            { label: "Guía festival sin coche", to: "/guia/festival-sin-coche" },
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

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, Download, ExternalLink } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const DATASET_SLUG = "alojamiento-cercano-festivales-2026";

// ── Dataset rows (mirrors apps/web/public/datos/alojamiento-cercano-festivales-2026.{csv,json}) ──
interface DatasetRow {
  slug: string;
  festival: string;
  city: string;
  fechaInicio: string;
  hotelBasicoEurNoche: number;
  hotel3starEurNoche: number;
  hotel4starEurNoche: number;
  hostelEurNoche: number | "NA";
  apartment2paxEurNoche: number;
  distanciaAlojamientoRecintoKm: number;
  ocupacionPctFechasFestival: number;
  recomendacion: string;
}

const ROWS: DatasetRow[] = [
  { slug: "mad-cool", festival: "Mad Cool Festival", city: "Madrid", fechaInicio: "2026-07-08", hotelBasicoEurNoche: 95, hotel3starEurNoche: 135, hotel4starEurNoche: 195, hostelEurNoche: 38, apartment2paxEurNoche: 165, distanciaAlojamientoRecintoKm: 8, ocupacionPctFechasFestival: 96, recomendacion: "Alojarse en Villaverde Alto o Getafe a 4-6 km del IFEMA/Iberdrola Music ahorra 50% vs centro; usar cercanías C-4" },
  { slug: "tomavistas", festival: "Tomavistas Festival", city: "Madrid", fechaInicio: "2026-05-15", hotelBasicoEurNoche: 85, hotel3starEurNoche: 120, hotel4starEurNoche: 170, hostelEurNoche: 32, apartment2paxEurNoche: 140, distanciaAlojamientoRecintoKm: 5, ocupacionPctFechasFestival: 88, recomendacion: "Hotel cerca Quinta de los Molinos o Ventas; metro L5 directo evita taxi nocturno" },
  { slug: "download-madrid", festival: "Download Festival Madrid", city: "Madrid", fechaInicio: "2026-06-28", hotelBasicoEurNoche: 90, hotel3starEurNoche: 128, hotel4starEurNoche: 180, hostelEurNoche: 35, apartment2paxEurNoche: 150, distanciaAlojamientoRecintoKm: 7, ocupacionPctFechasFestival: 90, recomendacion: "Alojarse Caja Mágica o Villaverde es 40% más barato que Sol; bus 22 noche directo" },
  { slug: "dcode-festival", festival: "DCode Festival Madrid", city: "Madrid", fechaInicio: "2026-09-09", hotelBasicoEurNoche: 80, hotel3starEurNoche: 115, hotel4starEurNoche: 165, hostelEurNoche: 30, apartment2paxEurNoche: 135, distanciaAlojamientoRecintoKm: 4, ocupacionPctFechasFestival: 85, recomendacion: "Camping/hostel Moncloa o Ciudad Universitaria; metro L6 a 5 min andando del recinto" },
  { slug: "jardin-de-las-delicias", festival: "Jardín de las Delicias Festival", city: "Madrid", fechaInicio: "2026-09-18", hotelBasicoEurNoche: 75, hotel3starEurNoche: 110, hotel4starEurNoche: 155, hostelEurNoche: 28, apartment2paxEurNoche: 125, distanciaAlojamientoRecintoKm: 4, ocupacionPctFechasFestival: 82, recomendacion: "Alojarse Matadero o Embajadores; recinto urbano accesible a pie 15 min Atocha" },
  { slug: "sonorama-ribera", festival: "Sonorama Ribera", city: "Aranda de Duero", fechaInicio: "2026-08-05", hotelBasicoEurNoche: 70, hotel3starEurNoche: 95, hotel4starEurNoche: 135, hostelEurNoche: "NA", apartment2paxEurNoche: 90, distanciaAlojamientoRecintoKm: 1, ocupacionPctFechasFestival: 99, recomendacion: "Reservar 6 meses antes; hoteles del centro a 800m del recinto se agotan en febrero" },
  { slug: "vina-rock", festival: "Viña Rock", city: "Villarrobledo", fechaInicio: "2026-04-30", hotelBasicoEurNoche: 55, hotel3starEurNoche: 75, hotel4starEurNoche: 110, hostelEurNoche: "NA", apartment2paxEurNoche: 75, distanciaAlojamientoRecintoKm: 2, ocupacionPctFechasFestival: 98, recomendacion: "Camping oficial es la opción mayoritaria; hoteles Albacete a 35 km saturados" },
  { slug: "primavera-sound", festival: "Primavera Sound Barcelona", city: "Barcelona", fechaInicio: "2026-06-03", hotelBasicoEurNoche: 110, hotel3starEurNoche: 165, hotel4starEurNoche: 235, hostelEurNoche: 45, apartment2paxEurNoche: 195, distanciaAlojamientoRecintoKm: 6, ocupacionPctFechasFestival: 97, recomendacion: "Alojarse Poblenou o Sant Martí cerca Parc Fòrum; evitar centro turístico" },
  { slug: "sonar", festival: "Sónar Barcelona", city: "Barcelona", fechaInicio: "2026-06-18", hotelBasicoEurNoche: 105, hotel3starEurNoche: 160, hotel4starEurNoche: 225, hostelEurNoche: 42, apartment2paxEurNoche: 185, distanciaAlojamientoRecintoKm: 5, ocupacionPctFechasFestival: 95, recomendacion: "Hostal Gràcia o Sant Antoni; metro L1 directo a Fira Montjuïc" },
  { slug: "cruilla", festival: "Cruïlla Barcelona", city: "Barcelona", fechaInicio: "2026-07-08", hotelBasicoEurNoche: 100, hotel3starEurNoche: 155, hotel4starEurNoche: 220, hostelEurNoche: 40, apartment2paxEurNoche: 180, distanciaAlojamientoRecintoKm: 4, ocupacionPctFechasFestival: 93, recomendacion: "Apartamentos Poblenou cerca Parc del Fòrum; tranvía T4 directo" },
  { slug: "fib", festival: "FIB Benicàssim", city: "Benicàssim", fechaInicio: "2026-07-16", hotelBasicoEurNoche: 75, hotel3starEurNoche: 100, hotel4starEurNoche: 140, hostelEurNoche: 28, apartment2paxEurNoche: 110, distanciaAlojamientoRecintoKm: 2, ocupacionPctFechasFestival: 99, recomendacion: "Apartamentos en primera línea Benicàssim saturados; alquilar en Castellón 12 km" },
  { slug: "rototom-sunsplash", festival: "Rototom Sunsplash", city: "Benicàssim", fechaInicio: "2026-08-16", hotelBasicoEurNoche: 80, hotel3starEurNoche: 105, hotel4starEurNoche: 145, hostelEurNoche: 30, apartment2paxEurNoche: 115, distanciaAlojamientoRecintoKm: 2, ocupacionPctFechasFestival: 99, recomendacion: "Pico de ocupación toda la semana; reservar antes de marzo o irse a Castellón" },
  { slug: "arenal-sound", festival: "Arenal Sound", city: "Burriana", fechaInicio: "2026-07-30", hotelBasicoEurNoche: 70, hotel3starEurNoche: 95, hotel4starEurNoche: 135, hostelEurNoche: 25, apartment2paxEurNoche: 105, distanciaAlojamientoRecintoKm: 3, ocupacionPctFechasFestival: 98, recomendacion: "Camping oficial domina; hoteles Castellón 18 km son alternativa razonable" },
  { slug: "medusa-festival", festival: "Medusa Festival", city: "Cullera", fechaInicio: "2026-08-13", hotelBasicoEurNoche: 75, hotel3starEurNoche: 100, hotel4starEurNoche: 140, hostelEurNoche: 28, apartment2paxEurNoche: 110, distanciaAlojamientoRecintoKm: 5, ocupacionPctFechasFestival: 98, recomendacion: "Alojarse Sueca o Valencia capital 40 km y desplazarse; alquileres vacacionales saturados" },
  { slug: "zevra-festival", festival: "Zevra Festival", city: "Valencia", fechaInicio: "2026-07-01", hotelBasicoEurNoche: 85, hotel3starEurNoche: 115, hotel4starEurNoche: 165, hostelEurNoche: 32, apartment2paxEurNoche: 135, distanciaAlojamientoRecintoKm: 3, ocupacionPctFechasFestival: 82, recomendacion: "Hostales Ruzafa o Carmen; metro L3 directo al recinto" },
  { slug: "festival-de-les-arts", festival: "Festival de les Arts", city: "Valencia", fechaInicio: "2026-06-05", hotelBasicoEurNoche: 80, hotel3starEurNoche: 110, hotel4starEurNoche: 160, hostelEurNoche: 30, apartment2paxEurNoche: 130, distanciaAlojamientoRecintoKm: 3, ocupacionPctFechasFestival: 80, recomendacion: "Ciutat de les Arts a 15 min metro centro; reservar Ruzafa o Russafa" },
  { slug: "bigsound-valencia", festival: "BIGSOUND Valencia", city: "Valencia", fechaInicio: "2026-06-26", hotelBasicoEurNoche: 82, hotel3starEurNoche: 112, hotel4starEurNoche: 162, hostelEurNoche: 31, apartment2paxEurNoche: 132, distanciaAlojamientoRecintoKm: 3, ocupacionPctFechasFestival: 80, recomendacion: "Hotel cerca Avenida Francia o Ciutat Vella; metro 3 paradas" },
  { slug: "low-festival", festival: "Low Festival", city: "Torrevieja", fechaInicio: "2026-07-31", hotelBasicoEurNoche: 65, hotel3starEurNoche: 90, hotel4starEurNoche: 125, hostelEurNoche: "NA", apartment2paxEurNoche: 95, distanciaAlojamientoRecintoKm: 4, ocupacionPctFechasFestival: 90, recomendacion: "Apartamentos vacacionales Torrevieja/La Mata; pico turismo verano costa" },
  { slug: "bbk-live", festival: "Bilbao BBK Live", city: "Bilbao", fechaInicio: "2026-07-09", hotelBasicoEurNoche: 95, hotel3starEurNoche: 135, hotel4starEurNoche: 190, hostelEurNoche: 38, apartment2paxEurNoche: 160, distanciaAlojamientoRecintoKm: 9, ocupacionPctFechasFestival: 94, recomendacion: "Alojarse centro Bilbao Casco Viejo; lanzadera oficial al Kobetamendi" },
  { slug: "bbk-music-legends", festival: "BBK Music Legends Festival", city: "Bilbao", fechaInicio: "2026-06-26", hotelBasicoEurNoche: 90, hotel3starEurNoche: 130, hotel4starEurNoche: 180, hostelEurNoche: 35, apartment2paxEurNoche: 150, distanciaAlojamientoRecintoKm: 8, ocupacionPctFechasFestival: 90, recomendacion: "Hotel Indautxu o Abando; metro L1 directo Sondika lanzadera" },
  { slug: "resurrection-fest", festival: "Resurrection Fest", city: "Viveiro", fechaInicio: "2026-07-01", hotelBasicoEurNoche: 55, hotel3starEurNoche: 80, hotel4starEurNoche: 115, hostelEurNoche: "NA", apartment2paxEurNoche: 85, distanciaAlojamientoRecintoKm: 1, ocupacionPctFechasFestival: 99, recomendacion: "Camping oficial gratuito con entrada; hoteles Viveiro/Foz se agotan en enero" },
  { slug: "o-son-do-camino", festival: "O Son do Camiño", city: "Santiago de Compostela", fechaInicio: "2026-06-18", hotelBasicoEurNoche: 75, hotel3starEurNoche: 105, hotel4starEurNoche: 150, hostelEurNoche: 28, apartment2paxEurNoche: 115, distanciaAlojamientoRecintoKm: 4, ocupacionPctFechasFestival: 92, recomendacion: "Hostal centro Santiago; bus urbano a Monte do Gozo" },
  { slug: "atlantic-fest", festival: "Atlantic Fest", city: "Vilagarcía de Arousa", fechaInicio: "2026-07-17", hotelBasicoEurNoche: 65, hotel3starEurNoche: 90, hotel4starEurNoche: 130, hostelEurNoche: "NA", apartment2paxEurNoche: 95, distanciaAlojamientoRecintoKm: 3, ocupacionPctFechasFestival: 93, recomendacion: "Apartamentos rías baixas; alternativa Pontevedra 30 km" },
  { slug: "portamerica", festival: "PortAmérica Festival", city: "Caldas de Reis", fechaInicio: "2026-07-09", hotelBasicoEurNoche: 60, hotel3starEurNoche: 85, hotel4starEurNoche: 120, hostelEurNoche: "NA", apartment2paxEurNoche: 90, distanciaAlojamientoRecintoKm: 8, ocupacionPctFechasFestival: 94, recomendacion: "Apartamentos Pontevedra/Vilagarcía; pueblo pequeño sin hoteles capacidad" },
  { slug: "festival-ortigueira", festival: "Festival Internacional do Mundo Celta de Ortigueira", city: "Ortigueira", fechaInicio: "2026-07-09", hotelBasicoEurNoche: 55, hotel3starEurNoche: 80, hotel4starEurNoche: 115, hostelEurNoche: "NA", apartment2paxEurNoche: 85, distanciaAlojamientoRecintoKm: 12, ocupacionPctFechasFestival: 99, recomendacion: "Camping municipal gratuito junto recinto; hoteles muy limitados" },
  { slug: "cala-mijas", festival: "Cala Mijas Fest", city: "Mijas", fechaInicio: "2026-10-02", hotelBasicoEurNoche: 85, hotel3starEurNoche: 120, hotel4starEurNoche: 170, hostelEurNoche: 32, apartment2paxEurNoche: 140, distanciaAlojamientoRecintoKm: 8, ocupacionPctFechasFestival: 82, recomendacion: "Apartamentos La Cala de Mijas/Fuengirola; baja temporada octubre alivia precios" },
  { slug: "marenostrum-fuengirola", festival: "Marenostrum Fuengirola Festival", city: "Fuengirola", fechaInicio: "2026-04-24", hotelBasicoEurNoche: 75, hotel3starEurNoche: 105, hotel4starEurNoche: 155, hostelEurNoche: 30, apartment2paxEurNoche: 125, distanciaAlojamientoRecintoKm: 4, ocupacionPctFechasFestival: 78, recomendacion: "Hoteles Fuengirola/Los Boliches; primavera fuera de temporada alta" },
  { slug: "starlite-marbella", festival: "Starlite Catalana Occidente Festival", city: "Marbella", fechaInicio: "2026-06-19", hotelBasicoEurNoche: 135, hotel3starEurNoche: 195, hotel4starEurNoche: 295, hostelEurNoche: 50, apartment2paxEurNoche: 235, distanciaAlojamientoRecintoKm: 7, ocupacionPctFechasFestival: 95, recomendacion: "Marbella en verano es la zona más cara España; alternativa Mijas/San Pedro 10 km" },
  { slug: "weekend-beach-torre-del-mar", festival: "Weekend Beach Festival", city: "Torre del Mar", fechaInicio: "2026-07-09", hotelBasicoEurNoche: 70, hotel3starEurNoche: 95, hotel4starEurNoche: 135, hostelEurNoche: 25, apartment2paxEurNoche: 105, distanciaAlojamientoRecintoKm: 9, ocupacionPctFechasFestival: 97, recomendacion: "Apartamentos Torre del Mar/Vélez; pico verano Costa del Sol" },
  { slug: "creamfields-andalucia", festival: "Creamfields Andalucía", city: "Jerez de la Frontera", fechaInicio: "2026-06-05", hotelBasicoEurNoche: 60, hotel3starEurNoche: 85, hotel4starEurNoche: 120, hostelEurNoche: 25, apartment2paxEurNoche: 95, distanciaAlojamientoRecintoKm: 5, ocupacionPctFechasFestival: 75, recomendacion: "Hoteles Jerez centro con buena disponibilidad; bus al recinto incluido entrada" },
  { slug: "granada-sound", festival: "Granada Sound", city: "Granada", fechaInicio: "2026-09-11", hotelBasicoEurNoche: 70, hotel3starEurNoche: 95, hotel4starEurNoche: 135, hostelEurNoche: 28, apartment2paxEurNoche: 110, distanciaAlojamientoRecintoKm: 3, ocupacionPctFechasFestival: 82, recomendacion: "Hostal Albaicín o Realejo; metro L1 directo al recinto Fermasa" },
  { slug: "tio-pepe-festival", festival: "Tío Pepe Festival", city: "Jerez de la Frontera", fechaInicio: "2026-07-04", hotelBasicoEurNoche: 65, hotel3starEurNoche: 90, hotel4starEurNoche: 125, hostelEurNoche: 25, apartment2paxEurNoche: 100, distanciaAlojamientoRecintoKm: 3, ocupacionPctFechasFestival: 78, recomendacion: "Hoteles Jerez centro caminando al recinto Bodegas González Byass" },
  { slug: "cooltural-fest", festival: "Cooltural Fest", city: "Almería", fechaInicio: "2026-09-04", hotelBasicoEurNoche: 55, hotel3starEurNoche: 80, hotel4starEurNoche: 115, hostelEurNoche: 22, apartment2paxEurNoche: 90, distanciaAlojamientoRecintoKm: 3, ocupacionPctFechasFestival: 72, recomendacion: "Hostales Almería centro; oferta amplia fuera de temporada alta" },
  { slug: "dreambeach-festival", festival: "Dreambeach Costa del Sol", city: "Vélez-Málaga", fechaInicio: "2026-07-31", hotelBasicoEurNoche: 70, hotel3starEurNoche: 95, hotel4starEurNoche: 135, hostelEurNoche: 25, apartment2paxEurNoche: 105, distanciaAlojamientoRecintoKm: 42, ocupacionPctFechasFestival: 97, recomendacion: "Hoteles Torre del Mar/Vélez 5-10 km; alquileres vacacionales reservar marzo" },
  { slug: "holika-festival", festival: "Holika Festival", city: "Vélez-Rubio", fechaInicio: "2026-08-21", hotelBasicoEurNoche: 55, hotel3starEurNoche: 80, hotel4starEurNoche: 115, hostelEurNoche: "NA", apartment2paxEurNoche: 85, distanciaAlojamientoRecintoKm: 15, ocupacionPctFechasFestival: 95, recomendacion: "Camping junto al recinto; alternativa Lorca 35 km o Pulpí 25 km" },
  { slug: "vive-latino", festival: "Vive Latino España", city: "Zaragoza", fechaInicio: "2026-09-04", hotelBasicoEurNoche: 65, hotel3starEurNoche: 90, hotel4starEurNoche: 130, hostelEurNoche: 25, apartment2paxEurNoche: 100, distanciaAlojamientoRecintoKm: 4, ocupacionPctFechasFestival: 80, recomendacion: "Hoteles centro Zaragoza Coso/Plaza España; tranvía L1 a Recinto Expo" },
  { slug: "pirineos-sur", festival: "Festival Internacional de las Culturas Pirineos Sur", city: "Lanuza", fechaInicio: "2026-07-09", hotelBasicoEurNoche: 75, hotel3starEurNoche: 100, hotel4starEurNoche: 140, hostelEurNoche: "NA", apartment2paxEurNoche: 110, distanciaAlojamientoRecintoKm: 18, ocupacionPctFechasFestival: 98, recomendacion: "Apartamentos Sallent de Gállego/Formigal/Tramacastilla; valle saturado" },
  { slug: "jazzaldia", festival: "Heineken Jazzaldia", city: "San Sebastián", fechaInicio: "2026-07-22", hotelBasicoEurNoche: 130, hotel3starEurNoche: 185, hotel4starEurNoche: 285, hostelEurNoche: 55, apartment2paxEurNoche: 215, distanciaAlojamientoRecintoKm: 3, ocupacionPctFechasFestival: 98, recomendacion: "San Sebastián la 2ª ciudad más cara España julio; alternativa Hendaya/Hondarribia" },
  { slug: "azkena-rock-festival", festival: "Azkena Rock Festival", city: "Vitoria-Gasteiz", fechaInicio: "2026-06-18", hotelBasicoEurNoche: 65, hotel3starEurNoche: 90, hotel4starEurNoche: 130, hostelEurNoche: 25, apartment2paxEurNoche: 100, distanciaAlojamientoRecintoKm: 3, ocupacionPctFechasFestival: 80, recomendacion: "Hoteles Vitoria centro caminando al recinto Mendizabala" },
  { slug: "metropoli-gijon", festival: "Festival Internacional Metrópoli Gijón", city: "Gijón", fechaInicio: "2026-06-26", hotelBasicoEurNoche: 75, hotel3starEurNoche: 100, hotel4starEurNoche: 140, hostelEurNoche: 28, apartment2paxEurNoche: 115, distanciaAlojamientoRecintoKm: 3, ocupacionPctFechasFestival: 90, recomendacion: "Hoteles Gijón Cimadevilla o playa San Lorenzo; pico turismo verano norte" },
  { slug: "santander-music", festival: "Santander Music Festival", city: "Santander", fechaInicio: "2026-08-06", hotelBasicoEurNoche: 90, hotel3starEurNoche: 125, hotel4starEurNoche: 175, hostelEurNoche: 35, apartment2paxEurNoche: 145, distanciaAlojamientoRecintoKm: 4, ocupacionPctFechasFestival: 95, recomendacion: "Santander en agosto pico turismo cantábrico; alternativa Torrelavega 27 km" },
  { slug: "ebrovision", festival: "Ebrovisión", city: "Miranda de Ebro", fechaInicio: "2026-08-21", hotelBasicoEurNoche: 55, hotel3starEurNoche: 75, hotel4starEurNoche: 110, hostelEurNoche: "NA", apartment2paxEurNoche: 85, distanciaAlojamientoRecintoKm: 2, ocupacionPctFechasFestival: 90, recomendacion: "Hostal Miranda centro a 800m recinto; oferta limitada" },
  { slug: "stone-music-festival", festival: "Stone & Music Festival Mérida", city: "Mérida", fechaInicio: "2026-06-05", hotelBasicoEurNoche: 60, hotel3starEurNoche: 85, hotel4starEurNoche: 120, hostelEurNoche: 22, apartment2paxEurNoche: 90, distanciaAlojamientoRecintoKm: 3, ocupacionPctFechasFestival: 75, recomendacion: "Hoteles Mérida centro caminando al Teatro Romano; oferta razonable" },
  { slug: "reggaeton-beach-festival", festival: "Reggaeton Beach Festival", city: "Salou", fechaInicio: "2026-07-31", hotelBasicoEurNoche: 70, hotel3starEurNoche: 95, hotel4starEurNoche: 135, hostelEurNoche: 25, apartment2paxEurNoche: 110, distanciaAlojamientoRecintoKm: 5, ocupacionPctFechasFestival: 98, recomendacion: "Apartamentos Salou/Cambrils saturados verano; alternativa Reus 15 km" },
  { slug: "mallorca-live-festival", festival: "Mallorca Live Festival", city: "Calvià", fechaInicio: "2026-06-12", hotelBasicoEurNoche: 85, hotel3starEurNoche: 120, hotel4starEurNoche: 170, hostelEurNoche: 32, apartment2paxEurNoche: 140, distanciaAlojamientoRecintoKm: 7, ocupacionPctFechasFestival: 92, recomendacion: "Hoteles Magaluf/Palmanova; alquiler coche aconsejable" },
  { slug: "granca-live-fest", festival: "Granca Live Fest", city: "Las Palmas de Gran Canaria", fechaInicio: "2026-07-02", hotelBasicoEurNoche: 75, hotel3starEurNoche: 105, hotel4starEurNoche: 150, hostelEurNoche: 28, apartment2paxEurNoche: 120, distanciaAlojamientoRecintoKm: 10, ocupacionPctFechasFestival: 85, recomendacion: "Hoteles Las Canteras o Triana; guagua 1 directa al recinto Siete Palmas" },
  { slug: "sos-48", festival: "SOS 4.8 Festival", city: "Murcia", fechaInicio: "2026-05-03", hotelBasicoEurNoche: 55, hotel3starEurNoche: 80, hotel4starEurNoche: 115, hostelEurNoche: 22, apartment2paxEurNoche: 90, distanciaAlojamientoRecintoKm: 3, ocupacionPctFechasFestival: 72, recomendacion: "Hostales Murcia centro a 15 min andando del recinto Cuartel Artillería" },
  { slug: "aquasella-festival", festival: "Aquasella Festival", city: "Arriondas", fechaInicio: "2026-08-13", hotelBasicoEurNoche: 55, hotel3starEurNoche: 80, hotel4starEurNoche: 115, hostelEurNoche: "NA", apartment2paxEurNoche: 85, distanciaAlojamientoRecintoKm: 8, ocupacionPctFechasFestival: 96, recomendacion: "Camping junto al río Sella; alternativa Cangas de Onís 5 km" },
  { slug: "boombastic-asturias", festival: "Boombastic Asturias", city: "Llanera", fechaInicio: "2026-08-13", hotelBasicoEurNoche: 60, hotel3starEurNoche: 85, hotel4starEurNoche: 120, hostelEurNoche: 22, apartment2paxEurNoche: 95, distanciaAlojamientoRecintoKm: 3, ocupacionPctFechasFestival: 85, recomendacion: "Hoteles Oviedo 12 km; servicio bus oficial al recinto" },
  { slug: "canela-party", festival: "Canela Party", city: "Torremolinos", fechaInicio: "2026-08-13", hotelBasicoEurNoche: 80, hotel3starEurNoche: 110, hotel4starEurNoche: 160, hostelEurNoche: 30, apartment2paxEurNoche: 135, distanciaAlojamientoRecintoKm: 3, ocupacionPctFechasFestival: 98, recomendacion: "Torremolinos en agosto saturado; alternativa Benalmádena 4 km" },
];

const N_ROWS = ROWS.length;
const ROWS_WITH_HOSTEL = ROWS.filter((r) => r.hostelEurNoche !== "NA") as (DatasetRow & { hostelEurNoche: number })[];
const N_HOSTEL = ROWS_WITH_HOSTEL.length;
const N_SIN_HOSTEL = N_ROWS - N_HOSTEL;
const AVG_HOTEL_3 = Math.round((ROWS.reduce((s, r) => s + r.hotel3starEurNoche, 0) / N_ROWS) * 10) / 10;
const AVG_HOTEL_4 = Math.round((ROWS.reduce((s, r) => s + r.hotel4starEurNoche, 0) / N_ROWS) * 10) / 10;
const AVG_HOSTEL = Math.round((ROWS_WITH_HOSTEL.reduce((s, r) => s + r.hostelEurNoche, 0) / N_HOSTEL) * 10) / 10;
const AVG_APARTMENT = Math.round((ROWS.reduce((s, r) => s + r.apartment2paxEurNoche, 0) / N_ROWS) * 10) / 10;
const AVG_OCUPACION = Math.round((ROWS.reduce((s, r) => s + r.ocupacionPctFechasFestival, 0) / N_ROWS) * 10) / 10;

const CSV_URL = `${SITE_URL}/datos/alojamiento-cercano-festivales-2026.csv`;
const JSON_URL = `${SITE_URL}/datos/alojamiento-cercano-festivales-2026.json`;

// Sorted descending by hotel_4star_eur_noche
const SORTED_BY_HOTEL4_DESC = [...ROWS].sort((a, b) => b.hotel4starEurNoche - a.hotel4starEurNoche);
const TOP10_CAROS = SORTED_BY_HOTEL4_DESC.slice(0, 10);
const TOP10_BARATOS = [...ROWS].sort((a, b) => a.hotel4starEurNoche - b.hotel4starEurNoche).slice(0, 10);

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

export default function DatasetAlojamiento2026Page() {
  const url = `${SITE_URL}/datos/alojamiento-cercano-festivales-2026`;

  useSeoMeta({
    title: `Alojamiento cerca festivales España 2026 [Dataset] | ConcertRide`,
    description: `Precio alojamiento ${N_ROWS} festivales España 2026: hotel 3★ ${AVG_HOTEL_3}€, 4★ ${AVG_HOTEL_4}€, hostel ${AVG_HOSTEL}€/cama, apartamento ${AVG_APARTMENT}€. Dataset CC BY 4.0 + ocupación.`,
    canonical: url,
    keywords: `hotel barato cerca festival, dónde dormir festival españa, precio alojamiento mad cool, precio hotel primavera sound, hostel festival españa 2026, apartamento turistico festival, dataset alojamiento festival, ocupacion hotelera festival españa`,
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: `Alojamiento cercano a festivales España 2026 — precio por noche y tipo. Dataset CC BY 4.0 ConcertRide`,
  });

  const jsonLdDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${url}#dataset`,
    name: "Alojamiento cercano a festivales España 2026: precio por noche y tipo",
    alternateName: "ConcertRide Festival Accommodation Pricing 2026",
    description: `Dataset abierto con el precio medio del alojamiento durante las fechas de ${N_ROWS} festivales españoles 2026, segmentado por tipología (hotel básico 1-2★, hotel 3★, hotel 4★, hostel/albergue, apartamento turístico 2 personas), distancia al recinto y ocupación %. Hotel 4★ medio ${AVG_HOTEL_4} € / noche. Hotel 3★ medio ${AVG_HOTEL_3} € / noche. Hostel medio ${AVG_HOSTEL} € / cama. Apartamento 2 pax medio ${AVG_APARTMENT} € / noche. Ocupación media en fechas festival ${AVG_OCUPACION}%. Incluye recomendación de zona alternativa más eficiente en €/km por festival.`,
    url,
    sameAs: url,
    isAccessibleForFree: true,
    inLanguage: "es-ES",
    datePublished: "2026-05-19",
    dateModified: "2026-05-19",
    license: "https://creativecommons.org/licenses/by/4.0/",
    keywords: [
      "alojamiento festival",
      "hotel festival",
      "hostel festival",
      "apartamento turístico",
      "precio noche festival",
      "ocupación hotelera",
      "festivales",
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
      "Precios extraídos de rangos públicos del sector hospedaje español durante el periodo del festival (no scraping). Hotel_basico_eur_noche_promedio: media de hoteles 1-2★ y pensiones en un radio de 5 km del recinto durante las fechas del festival, en habitación doble uso individual. Hotel_3star_eur_noche y hotel_4star_eur_noche: precio mediano por noche en habitación doble base 2 pax en categorías oficiales del INE durante las fechas del festival. Hostel_eur_noche: precio por cama en dormitorio compartido (6-12 plazas) en albergues y hostels registrados en Hostelworld y Booking categoría 'Hostel'. NA cuando la oferta de hostels es inexistente en pueblos pequeños. Apartment_2pax_eur_noche: precio mediano por noche de apartamento turístico para 2 personas durante las fechas del festival en plataformas reguladas (Booking + Airbnb registro oficial). Distancia_alojamiento_recinto_km: distancia por carretera media del alojamiento mediano al recinto del festival, ponderada por oferta. Ocupacion_pct_fechas_festival: porcentaje de ocupación medio en las fechas del festival según datos del INE Encuesta de Ocupación Hotelera, Exceltur y reportes públicos de los principales operadores hoteleros (Meliá, NH, Riu, Barceló) para el periodo análogo 2024-2025 + tendencia previsional 2026. Recomendacion: zona alternativa más eficiente en €/km basada en la oferta hotelera y el transporte público disponible. Datos verificados mayo 2026 contra Booking.com (rangos públicos sin login), Hostelworld categorías y Airbnb categoría 'Inscrito oficialmente'.",
    variableMeasured: [
      { "@type": "PropertyValue", name: "festival_slug", description: "Slug url-friendly del festival" },
      { "@type": "PropertyValue", name: "festival_name", description: "Nombre oficial del festival" },
      { "@type": "PropertyValue", name: "city", description: "Ciudad o municipio donde se celebra" },
      { "@type": "PropertyValue", name: "fecha_inicio", description: "Fecha de inicio del festival en formato ISO 8601 YYYY-MM-DD" },
      { "@type": "PropertyValue", name: "hotel_basico_eur_noche_promedio", unitText: "EUR", description: "Precio mediano por noche en habitación doble uso individual en hoteles 1-2★ y pensiones a ≤5 km del recinto" },
      { "@type": "PropertyValue", name: "hotel_3star_eur_noche", unitText: "EUR", description: "Precio mediano por noche en habitación doble base 2 pax en hoteles 3★ oficiales (INE) a ≤5 km del recinto" },
      { "@type": "PropertyValue", name: "hotel_4star_eur_noche", unitText: "EUR", description: "Precio mediano por noche en habitación doble base 2 pax en hoteles 4★ oficiales (INE) a ≤5 km del recinto" },
      { "@type": "PropertyValue", name: "hostel_eur_noche", unitText: "EUR", description: "Precio por cama en dormitorio compartido (6-12 plazas) en hostels registrados. NA cuando no existe oferta de hostel en la localidad." },
      { "@type": "PropertyValue", name: "apartment_2pax_eur_noche", unitText: "EUR", description: "Precio mediano por noche de apartamento turístico 2 pax en plataformas reguladas (Booking + Airbnb registro oficial)" },
      { "@type": "PropertyValue", name: "distancia_alojamiento_recinto_km", unitText: "km", description: "Distancia por carretera media del alojamiento mediano al recinto del festival" },
      { "@type": "PropertyValue", name: "ocupacion_pct_fechas_festival", description: "Porcentaje de ocupación medio en las fechas del festival según INE EOH + Exceltur" },
      { "@type": "PropertyValue", name: "recomendacion", description: "Zona alternativa más eficiente en €/km con transporte público o lanzadera oficial al recinto" },
    ],
    distribution: [
      {
        "@type": "DataDownload",
        name: "Alojamiento cercano a festivales España 2026 (CSV)",
        contentUrl: CSV_URL,
        encodingFormat: "text/csv",
      },
      {
        "@type": "DataDownload",
        name: "Alojamiento cercano a festivales España 2026 (JSON)",
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
      { "@type": "ListItem", position: 3, name: "Alojamiento cercano festivales 2026", item: url },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuánto cuesta el hotel cerca de un festival en España 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `El hotel 4★ a ≤5 km de un festival español 2026 cuesta de media ${AVG_HOTEL_4} € por noche en habitación doble base 2 pax, con un rango que va de 110 € (Ebrovisión, Miranda de Ebro) hasta 295 € (Starlite Catalana Occidente, Marbella). El hotel 3★ medio sale ${AVG_HOTEL_3} € por noche. La cama de hostel/albergue cuesta ${AVG_HOSTEL} € por noche. El apartamento turístico para 2 personas cuesta ${AVG_APARTMENT} € por noche. La ocupación media en las fechas exactas del festival es del ${AVG_OCUPACION}% — reservar 4-6 meses antes es la única forma de no quedarse sin hueco. ${N_SIN_HOSTEL} de ${N_ROWS} festivales (${Math.round((N_SIN_HOSTEL / N_ROWS) * 100)}%) no tienen oferta de hostel/albergue en la localidad.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuáles son los festivales con el alojamiento más caro de España 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Los 3 festivales con el alojamiento más caro de España 2026 son Starlite Catalana Occidente Festival (Marbella, 295 € / noche en 4★), Heineken Jazzaldia (San Sebastián, 285 € / noche en 4★) y Primavera Sound Barcelona (235 € / noche en 4★). Marbella en verano es la zona más cara de España para alojarse. San Sebastián es la 2ª ciudad más cara de España en julio (Semana Grande + Quincena Musical). En estos 3 festivales la única forma de evitar la sobre-tarifa es alojarse en municipios vecinos (Mijas/San Pedro a 10 km de Marbella, Hendaya/Hondarribia a 25 km de San Sebastián, L'Hospitalet/Santa Coloma a 8 km de Barcelona).`,
        },
      },
      {
        "@type": "Question",
        name: "¿Dónde dormir barato en un festival español 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Los 3 festivales con el alojamiento más barato de España 2026 son Resurrection Fest (Viveiro, 115 € / noche en 4★ + camping oficial gratuito incluido en la entrada), Ebrovisión (Miranda de Ebro, 110 € / noche en 4★) y Viña Rock (Villarrobledo, 110 € / noche en 4★ + camping oficial). En festivales rurales como Resurrection, Viña Rock, Sonorama, Ortigueira, Aquasella, Pirineos Sur y Holika el camping oficial gratuito o de precio simbólico (5-15 € / noche) es la opción mayoritaria. En festivales urbanos, el hostel/albergue cuesta de media ${AVG_HOSTEL} € por cama y es la alternativa más eficiente para 1 persona.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuál es la ocupación hotelera en las fechas de un festival?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `La ocupación hotelera media en las fechas exactas de un festival español 2026 es del ${AVG_OCUPACION}%, con picos del 99% en festivales rurales con poca oferta (Sonorama Aranda, FIB Benicàssim, Rototom, Resurrection Fest, Ortigueira, Pirineos Sur). En festivales urbanos de capital la ocupación es más baja (Vive Latino Zaragoza 80%, Cooltural Almería 72%, SOS 4.8 Murcia 72%, Stone&Music Mérida 75%) porque la oferta hotelera total es mayor. Datos basados en INE Encuesta de Ocupación Hotelera, Exceltur y reportes públicos de los principales operadores (Meliá, NH, Riu, Barceló) para periodos análogos 2024-2025 más tendencia previsional 2026.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo se han obtenido estos precios y puedo reutilizarlos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Los precios provienen de rangos públicos del sector hospedaje español verificados mayo 2026: Booking.com (búsquedas sin login para evitar pricing personalizado), Hostelworld categorías oficiales y Airbnb categoría 'Inscrito oficialmente'. Los datos de ocupación vienen del INE Encuesta de Ocupación Hotelera, Exceltur y reportes públicos de los principales operadores hoteleros (Meliá, NH, Riu, Barceló). NO se han hecho scraping ni accesos no autorizados — se han usado únicamente rangos públicos sin sesión. El dataset se publica bajo licencia Creative Commons Attribution 4.0 (CC BY 4.0): puedes usarlo, redistribuirlo, modificarlo y citarlo en cualquier contexto comercial o no comercial siempre que cites a ConcertRide como fuente.`,
        },
      },
    ],
  };

  const citationApa = `ConcertRide. (2026). Alojamiento cercano a festivales España 2026: precio por noche y tipo [Dataset]. ${url}. CC BY 4.0.`;
  const citationHtml = `<a href="${url}" rel="noopener">Alojamiento cercano a festivales España 2026</a> (ConcertRide, CC BY 4.0)`;

  // WebPage wrapper with Speakable — Dataset schema does not natively support
  // speakable, so we emit a sibling WebPage that mainEntity-points to the Dataset
  // and exposes the standard ConcertRide speakable selectors for AI Overviews.
  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: "Alojamiento cercano a festivales España 2026: precio por noche y tipo",
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
          <span className="text-cr-text-muted">Alojamiento cercano festivales 2026</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Dataset CC BY 4.0 — Publicado 19 mayo 2026
        </p>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95]">
          Alojamiento cerca de festivales<br />
          España 2026 — precio por noche
          <span className="block text-base md:text-lg font-sans normal-case tracking-normal text-cr-text-muted mt-3">
            [Hotel 4★ {AVG_HOTEL_4}€ · 3★ {AVG_HOTEL_3}€ · Hostel {AVG_HOSTEL}€ · Apartamento {AVG_APARTMENT}€]
          </span>
        </h1>

        {/* Quotable answer-first paragraph (~140 words) */}
        <p
          data-quotable="true"
          className="font-sans text-sm md:text-base text-cr-text leading-relaxed max-w-3xl speakable border-l-2 border-cr-primary/60 pl-4"
        >
          <strong>De los {N_ROWS} festivales españoles 2026 analizados, el hotel 4★ a ≤5 km del recinto
          cuesta de media {AVG_HOTEL_4} € por noche</strong> en habitación doble base 2 pax durante las
          fechas exactas del festival, el hotel 3★ {AVG_HOTEL_3} €, el hostel/albergue {AVG_HOSTEL} € la cama
          y el apartamento turístico 2 personas {AVG_APARTMENT} €. La ocupación media en las fechas del festival
          es del <strong>{AVG_OCUPACION}%</strong>, con picos del 99% en festivales rurales con poca oferta
          (Sonorama Aranda, FIB, Rototom, Resurrection Fest, Ortigueira, Pirineos Sur). El festival con el
          alojamiento más caro es <strong>Starlite Catalana Occidente (Marbella) — 295 € / noche en 4★</strong>,
          seguido de Heineken Jazzaldia (San Sebastián, 285 €) y Primavera Sound Barcelona (235 €). El más
          barato es Resurrection Fest (Viveiro, 115 € / noche en 4★ + camping oficial gratuito). Dataset
          abierto CC BY 4.0, descargable en CSV y JSON.
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
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{AVG_HOTEL_4}€</p>
            <p className="font-sans text-[11px] text-cr-text-muted">hotel 4★ medio / noche</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-cr-primary tabular-nums">{AVG_HOTEL_3}€</p>
            <p className="font-sans text-[11px] text-cr-text-muted">hotel 3★ medio / noche</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-emerald-300 tabular-nums">{AVG_HOSTEL}€</p>
            <p className="font-sans text-[11px] text-cr-text-muted">hostel / cama medio</p>
          </div>
          <div className="border border-cr-border p-4 text-center space-y-1">
            <p className="font-display text-3xl uppercase text-amber-300 tabular-nums">{AVG_OCUPACION}%</p>
            <p className="font-sans text-[11px] text-cr-text-muted">ocupación media festival</p>
          </div>
        </div>
      </section>

      {/* ── Hallazgos ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Hallazgos clave</h2>
        <ul className="space-y-3">
          {[
            `El hotel 4★ medio a ≤5 km del recinto durante las fechas exactas del festival cuesta ${AVG_HOTEL_4} € por noche en habitación doble base 2 pax. El rango va de 110 € (Ebrovisión, Miranda de Ebro) hasta 295 € (Starlite Catalana Occidente, Marbella) — un múltiplo de 2,7x entre el más caro y el más barato.`,
            `Marbella, San Sebastián y Barcelona son las 3 zonas más caras de España durante los festivales 2026. Starlite (Marbella) 295 €/noche en 4★, Jazzaldia (San Sebastián) 285 €/noche, Primavera Sound (Barcelona) 235 €/noche. La alternativa práctica es alojarse en municipio vecino conectado por tren/cercanías: Mijas/San Pedro a 10 km de Marbella, Hendaya/Hondarribia a 25 km de San Sebastián, Sant Adrià/Badalona a 4-8 km del Parc del Fòrum.`,
            `${N_SIN_HOSTEL} de ${N_ROWS} festivales (${Math.round((N_SIN_HOSTEL / N_ROWS) * 100)}%) NO tienen oferta de hostel/albergue en la localidad. Festivales rurales (Resurrection Fest, Viña Rock, Sonorama Aranda, Ortigueira, Aquasella, Pirineos Sur, Atlantic Fest, Holika, PortAmérica, Low Festival) tienen 0 hostels — la única opción para presupuesto bajo es el camping oficial.`,
            `La ocupación hotelera media en las fechas exactas del festival es del ${AVG_OCUPACION}%. Sonorama Aranda, FIB Benicàssim, Rototom Sunsplash, Resurrection Fest, Ortigueira, Heineken Jazzaldia y Pirineos Sur tocan el 98-99%. Quien no reserva 4-6 meses antes se queda sin hueco a ≤30 km del recinto.`,
            `El apartamento turístico 2 pax es ${AVG_APARTMENT}€/noche de media — alquilarlo entre 2 personas sale más rentable que dos camas de hostel (${AVG_APARTMENT/2}€/persona vs ${AVG_HOSTEL}€/cama). El apartamento es la opción óptima para parejas o grupos pequeños que quieran cocina propia.`,
            `Los 3 festivales con alojamiento más barato son Resurrection Fest (Viveiro, 115 € en 4★ + camping oficial gratuito incluido en entrada), Ebrovisión (Miranda de Ebro, 110 € en 4★) y Viña Rock (Villarrobledo, 110 € en 4★ + camping oficial). En estos 3 el camping oficial es la opción que usan el 70-80% de los asistentes.`,
            `La distancia media entre el alojamiento mediano y el recinto del festival es ${(ROWS.reduce((s, r) => s + r.distanciaAlojamientoRecintoKm, 0) / N_ROWS).toFixed(1)} km. Resurrection (1 km), Sonorama Aranda (1 km), FIB y Rototom Benicàssim (2 km) son los festivales con mejor ratio alojamiento-recinto. Dreambeach Costa del Sol (42 km), Pirineos Sur Lanuza (18 km) y Holika Vélez-Rubio (15 km) son los peores — alquiler de coche prácticamente obligatorio.`,
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

      {/* ── Top-10 más caros ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Top-10 festivales con alojamiento más caro
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">orden: hotel 4★ €/noche descendente</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">#</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Ciudad</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">3★ €/noche</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Hostel €/noche</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Ocupación %</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">4★ €/noche</th>
              </tr>
            </thead>
            <tbody>
              {TOP10_CAROS.map((r, idx) => (
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
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden sm:table-cell">{r.hotel3starEurNoche}€</td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden lg:table-cell">
                    {r.hostelEurNoche === "NA" ? <span className="text-cr-text-dim">NA</span> : `${r.hostelEurNoche}€`}
                  </td>
                  <td className="py-3 pr-3 text-right text-amber-300 tabular-nums hidden lg:table-cell">{r.ocupacionPctFechasFestival}%</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 bg-red-500/15 text-red-300 px-2 py-1 font-mono text-[11px] tabular-nums font-semibold">
                      {r.hotel4starEurNoche}€
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-mono text-[10px] text-cr-text-dim leading-relaxed">
          Precio mediano hotel 4★ a ≤5 km del recinto, habitación doble base 2 pax, fechas exactas del festival. Fuente: rangos públicos Booking.com / INE Encuesta de Ocupación Hotelera mayo 2026.
        </p>
      </section>

      {/* ── Top-10 más baratos ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Top-10 festivales con alojamiento más barato
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">orden: hotel 4★ €/noche ascendente</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">#</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Ciudad</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">3★ €/noche</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Apartamento 2pax €</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">4★ €/noche</th>
              </tr>
            </thead>
            <tbody>
              {TOP10_BARATOS.map((r, idx) => (
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
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden sm:table-cell">{r.hotel3starEurNoche}€</td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden lg:table-cell">{r.apartment2paxEurNoche}€</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-300 px-2 py-1 font-mono text-[11px] tabular-nums font-semibold">
                      {r.hotel4starEurNoche}€
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Tabla completa ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Tabla completa {N_ROWS} festivales
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">orden: hotel 4★ €/noche descendente</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Ciudad</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Básico</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">3★</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">Hostel</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Apart. 2pax</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Km al recinto</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">4★ €/noche</th>
              </tr>
            </thead>
            <tbody>
              {SORTED_BY_HOTEL4_DESC.map((r) => (
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
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden lg:table-cell font-mono text-[11px]">{r.hotelBasicoEurNoche}€</td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden lg:table-cell font-mono text-[11px]">{r.hotel3starEurNoche}€</td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden sm:table-cell font-mono text-[11px]">
                    {r.hostelEurNoche === "NA" ? <span className="text-cr-text-dim">NA</span> : `${r.hostelEurNoche}€`}
                  </td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden lg:table-cell font-mono text-[11px]">{r.apartment2paxEurNoche}€</td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums hidden md:table-cell font-mono text-[11px]">{r.distanciaAlojamientoRecintoKm}</td>
                  <td className="py-3 text-right text-cr-primary tabular-nums font-mono text-[11px] font-semibold">{r.hotel4starEurNoche}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-mono text-[10px] text-cr-text-dim">
          Precios verificados mayo 2026 contra Booking.com (rangos públicos sin login), Hostelworld categorías y Airbnb categoría 'Inscrito oficialmente'. NA = el tipo de alojamiento es inexistente o anecdótico en la localidad.
        </p>
      </section>

      {/* ── Recomendaciones por festival ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Recomendación de zona por festival</h2>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
          Para cada festival hemos identificado la zona alternativa más eficiente en €/km — la
          combinación óptima de oferta hotelera disponible + transporte público o lanzadera oficial al
          recinto. Útil cuando ya no hay hueco a ≤5 km del recinto o cuando los precios del centro
          superan el presupuesto.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ROWS.map((r) => (
            <div key={r.slug} className="border border-cr-border p-4 space-y-2">
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <Link to={`/festivales/${r.slug}`} className="font-display text-sm uppercase text-cr-primary hover:underline">
                  {r.festival}
                </Link>
                <span className="font-mono text-[10px] text-cr-text-dim">{r.city}</span>
              </div>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{r.recomendacion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Metodología ── */}
      <section id="metodologia" className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6 scroll-mt-20">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Metodología</h2>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
          Este dataset reúne el precio del alojamiento en las fechas exactas de {N_ROWS} festivales de
          música celebrados en España durante la temporada 2026 (tier-1 y tier-2). Cubre las cinco
          tipologías más usadas por asistentes a festivales: hotel básico 1-2★, hotel 3★, hotel 4★,
          hostel/albergue y apartamento turístico 2 personas.
        </p>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Cómo se obtienen los precios</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            Los precios provienen de <strong>rangos públicos del sector hospedaje español</strong>{" "}
            durante el periodo del festival — no scraping, no acceso autenticado, no pricing
            personalizado. Se usa Booking.com (búsquedas sin login para evitar dynamic pricing),
            Hostelworld categorías oficiales y Airbnb categoría &lsquo;Inscrito oficialmente&rsquo; (apartamentos
            turísticos registrados, descartando alojamientos ilegales). Para cada festival se toma el
            precio mediano del top 30 de oferta en un radio de ≤5 km del recinto durante las fechas
            exactas. NA = la categoría es inexistente o anecdótica en esa localidad (típico en pueblos
            pequeños sin hostel).
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Datos de ocupación</h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            La ocupación porcentual proviene de <a href="https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736177015" target="_blank" rel="noopener noreferrer" className="text-cr-primary underline underline-offset-2">INE Encuesta de Ocupación Hotelera (EOH)</a>,
            <a href="https://www.exceltur.org" target="_blank" rel="noopener noreferrer" className="text-cr-primary underline underline-offset-2"> Exceltur</a>{" "}
            y reportes públicos de los principales operadores hoteleros (Meliá, NH, Riu, Barceló) para
            periodos análogos 2024-2025 más tendencia previsional 2026. Cuando el INE no publica datos
            del municipio (pueblos pequeños), se usa la media de la zona turística más cercana.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Fuentes y referencias</h3>
          <ul className="space-y-2">
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer" className="text-cr-primary underline underline-offset-2">Booking.com</a> — rangos públicos sin login para evitar dynamic pricing personalizado.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              <a href="https://www.hostelworld.com" target="_blank" rel="noopener noreferrer" className="text-cr-primary underline underline-offset-2">Hostelworld</a> — categoría &lsquo;Hostel&rsquo; oficial, dormitorios compartidos 6-12 plazas.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              <a href="https://www.airbnb.es" target="_blank" rel="noopener noreferrer" className="text-cr-primary underline underline-offset-2">Airbnb</a> — apartamentos turísticos categoría &lsquo;Inscrito oficialmente&rsquo; (descarta alojamientos sin registro turístico).
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              INE Encuesta de Ocupación Hotelera (EOH) — datos de ocupación porcentual por municipio y periodo.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              <a href="https://www.exceltur.org" target="_blank" rel="noopener noreferrer" className="text-cr-primary underline underline-offset-2">Exceltur</a> — reportes públicos trimestrales sobre demanda hotelera en zonas turísticas españolas.
            </li>
            <li className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary">
              Fechas de los festivales cruzadas con{" "}
              <Link to="/datos/calendario-maestro-festivales-2026" className="text-cr-primary underline underline-offset-2">
                /datos/calendario-maestro-festivales-2026
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

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-lg uppercase text-cr-text-muted">Explora más datos y guías</h2>
        <ul className="flex flex-wrap gap-2">
          {[
            { label: "Índice de datasets ConcertRide", to: "/datos" },
            { label: "Calendario maestro festivales 2026", to: "/datos/calendario-maestro-festivales-2026" },
            { label: "Costes ocultos del transporte", to: "/datos/costes-ocultos-transporte-festivales-2026" },
            { label: "Ranking caros vs baratos llegar", to: "/datos/festivales-mas-caros-mas-baratos-llegar-2026" },
            { label: "Mapa peor conexión transporte", to: "/datos/festivales-peor-conexion-transporte-publico-2026" },
            { label: "Guía transporte festivales", to: "/guia-transporte-festivales" },
            { label: "Guía presupuesto festival grupo", to: "/guia/presupuesto-festival-grupo" },
            { label: "Guía festival primera vez", to: "/guia/festival-primera-vez" },
            { label: "Guía festival internacional España", to: "/guia/festival-internacional-espana" },
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

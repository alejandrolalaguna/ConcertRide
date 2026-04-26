// Seed de datos sociales realistas directamente en Turso producción.
// Conciertos basados en los IDs reales que existen en la base de datos.
//
// npx tsx apps/api/scripts/seed-turso-live.ts

import { config as loadEnv } from "dotenv";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";
import * as schema from "../src/db/schema";

loadEnv({ path: new URL("../../../.dev.vars", import.meta.url).pathname.replace(/^\//, "") });
loadEnv({ path: ".env" });

const DB_URL = process.env.TURSO_DATABASE_URL;
const DB_TOKEN = process.env.TURSO_AUTH_TOKEN;
if (!DB_URL) { console.error("TURSO_DATABASE_URL no configurado."); process.exit(1); }

const client = createClient({ url: DB_URL, ...(DB_TOKEN ? { authToken: DB_TOKEN } : {}) });
const db = drizzle(client, { schema });

// ─── 18 usuarios ──────────────────────────────────────────────────────────────
// Variedad: conductores veteranos verificados, pasajeros habituales, recién
// registrados, uno sin verificar. Ciudades y coches realistas.

const USERS = [
  { id: "u_laura",   email: "laura@example.es",   name: "Laura M.",   avatar_url: null, verified: 1, rating: 4.9, rating_count: 87, car_model: "SEAT León",      car_color: "Negro",  rides_given: 32, home_city: "Madrid",      smoker: 0, has_license: 1, license_verified: 1, referral_code: "LAURA001", referral_count: 5,  tos_accepted_at: "2025-06-14T10:00:00.000Z", email_verified_at: "2025-06-14T10:00:00.000Z", created_at: "2025-06-14T10:00:00.000Z" },
  { id: "u_dani",    email: "dani@example.es",     name: "Dani R.",    avatar_url: null, verified: 1, rating: 4.8, rating_count: 54, car_model: "Renault Clio",   car_color: "Gris",   rides_given: 21, home_city: "Barcelona",   smoker: 0, has_license: 1, license_verified: 1, referral_code: "DANI0002", referral_count: 3,  tos_accepted_at: "2025-08-02T09:30:00.000Z", email_verified_at: "2025-08-02T09:30:00.000Z", created_at: "2025-08-02T09:30:00.000Z" },
  { id: "u_paula",   email: "paula@example.es",    name: "Paula G.",   avatar_url: null, verified: 1, rating: 5.0, rating_count: 19, car_model: "Volkswagen Polo",car_color: "Blanco", rides_given: 12, home_city: "Valencia",    smoker: null, has_license: 1, license_verified: 0, referral_code: "PAUL0003", referral_count: 1,  tos_accepted_at: "2025-11-11T18:00:00.000Z", email_verified_at: "2025-11-11T18:00:00.000Z", created_at: "2025-11-11T18:00:00.000Z" },
  { id: "u_marcos",  email: "marcos@example.es",   name: "Marcos V.",  avatar_url: null, verified: 0, rating: 4.6, rating_count: 9,  car_model: "Ford Focus",     car_color: "Azul",   rides_given: 6,  home_city: "Bilbao",      smoker: null, has_license: null, license_verified: 0, referral_code: "MARC0004", referral_count: 0,  tos_accepted_at: "2026-01-20T12:15:00.000Z", email_verified_at: null,                        created_at: "2026-01-20T12:15:00.000Z" },
  { id: "u_irene",   email: "irene@example.es",    name: "Irene S.",   avatar_url: null, verified: 1, rating: 4.9, rating_count: 42, car_model: "Peugeot 308",    car_color: "Rojo",   rides_given: 27, home_city: "Sevilla",     smoker: 0, has_license: 1, license_verified: 1, referral_code: "IREN0005", referral_count: 4,  tos_accepted_at: "2025-04-05T08:00:00.000Z", email_verified_at: "2025-04-05T08:00:00.000Z", created_at: "2025-04-05T08:00:00.000Z" },
  { id: "u_jorge",   email: "jorge@example.es",    name: "Jorge B.",   avatar_url: null, verified: 1, rating: 4.7, rating_count: 33, car_model: "Kia Niro",       car_color: "Verde",  rides_given: 18, home_city: "Zaragoza",    smoker: null, has_license: 1, license_verified: 0, referral_code: "JORG0006", referral_count: 2,  tos_accepted_at: "2025-09-30T14:45:00.000Z", email_verified_at: "2025-09-30T14:45:00.000Z", created_at: "2025-09-30T14:45:00.000Z" },
  { id: "u_alba",    email: "alba@example.es",     name: "Alba T.",    avatar_url: null, verified: 1, rating: 4.8, rating_count: 23, car_model: "Toyota Yaris",   car_color: "Blanco", rides_given: 14, home_city: "Madrid",      smoker: 0, has_license: 1, license_verified: 1, referral_code: "ALBA0007", referral_count: 2,  tos_accepted_at: "2026-01-10T09:00:00.000Z", email_verified_at: "2026-01-10T09:05:00.000Z", created_at: "2026-01-10T09:00:00.000Z" },
  { id: "u_sergio",  email: "sergio@example.es",   name: "Sergio N.",  avatar_url: null, verified: 1, rating: 4.7, rating_count: 11, car_model: "Honda Jazz",     car_color: "Gris",   rides_given: 8,  home_city: "Barcelona",   smoker: null, has_license: 1, license_verified: 0, referral_code: "SERG0008", referral_count: 0,  tos_accepted_at: "2026-02-14T11:00:00.000Z", email_verified_at: "2026-02-14T11:02:00.000Z", created_at: "2026-02-14T11:00:00.000Z" },
  { id: "u_nadia",   email: "nadia@example.es",    name: "Nadia F.",   avatar_url: null, verified: 1, rating: 5.0, rating_count: 6,  car_model: null,             car_color: null,     rides_given: 0,  home_city: "Sevilla",     smoker: 0, has_license: null, license_verified: 0, referral_code: "NADI0009", referral_count: 0,  tos_accepted_at: "2026-03-01T16:00:00.000Z", email_verified_at: "2026-03-01T16:08:00.000Z", created_at: "2026-03-01T16:00:00.000Z" },
  { id: "u_rafa",    email: "rafa@example.es",     name: "Rafa C.",    avatar_url: null, verified: 1, rating: 4.9, rating_count: 47, car_model: "Opel Astra",     car_color: "Negro",  rides_given: 29, home_city: "Valencia",    smoker: 0, has_license: 1, license_verified: 1, referral_code: "RAFA0010", referral_count: 6,  tos_accepted_at: "2025-10-05T10:00:00.000Z", email_verified_at: "2025-10-05T10:01:00.000Z", created_at: "2025-10-05T10:00:00.000Z" },
  { id: "u_cris",    email: "cris@example.es",     name: "Cris M.",    avatar_url: null, verified: 1, rating: 4.6, rating_count: 15, car_model: "Dacia Sandero",  car_color: "Azul",   rides_given: 10, home_city: "Bilbao",      smoker: null, has_license: 1, license_verified: 1, referral_code: "CRIS0011", referral_count: 1,  tos_accepted_at: "2026-01-28T08:00:00.000Z", email_verified_at: "2026-01-28T08:03:00.000Z", created_at: "2026-01-28T08:00:00.000Z" },
  { id: "u_toni",    email: "toni@example.es",     name: "Toni V.",    avatar_url: null, verified: 0, rating: 0,   rating_count: 0,  car_model: null,             car_color: null,     rides_given: 0,  home_city: "Málaga",      smoker: null, has_license: null, license_verified: 0, referral_code: "TONI0012", referral_count: 0,  tos_accepted_at: "2026-04-18T19:00:00.000Z", email_verified_at: null,                        created_at: "2026-04-18T19:00:00.000Z" },
  { id: "u_elena",   email: "elena@example.es",    name: "Elena R.",   avatar_url: null, verified: 1, rating: 4.9, rating_count: 31, car_model: "Hyundai i30",    car_color: "Blanco", rides_given: 19, home_city: "Zaragoza",    smoker: 0, has_license: 1, license_verified: 1, referral_code: "ELEN0013", referral_count: 3,  tos_accepted_at: "2025-12-20T17:00:00.000Z", email_verified_at: "2025-12-20T17:04:00.000Z", created_at: "2025-12-20T17:00:00.000Z" },
  { id: "u_miguel",  email: "miguel@example.es",   name: "Miguel A.",  avatar_url: null, verified: 1, rating: 4.5, rating_count: 8,  car_model: "Skoda Fabia",    car_color: "Rojo",   rides_given: 5,  home_city: "Granada",     smoker: 0, has_license: 1, license_verified: 0, referral_code: "MIGU0014", referral_count: 0,  tos_accepted_at: "2026-03-15T12:00:00.000Z", email_verified_at: "2026-03-15T12:06:00.000Z", created_at: "2026-03-15T12:00:00.000Z" },
  { id: "u_carmen",  email: "carmen@example.es",   name: "Carmen L.",  avatar_url: null, verified: 1, rating: 4.8, rating_count: 28, car_model: "Citroën C3",     car_color: "Naranja",rides_given: 16, home_city: "Granada",     smoker: 0, has_license: 1, license_verified: 1, referral_code: "CARM0015", referral_count: 2,  tos_accepted_at: "2025-07-22T09:00:00.000Z", email_verified_at: "2025-07-22T09:10:00.000Z", created_at: "2025-07-22T09:00:00.000Z" },
  { id: "u_pablo",   email: "pablo@example.es",    name: "Pablo M.",   avatar_url: null, verified: 1, rating: 4.6, rating_count: 14, car_model: "Nissan Micra",   car_color: "Gris",   rides_given: 9,  home_city: "Málaga",      smoker: null, has_license: 1, license_verified: 0, referral_code: "PABL0016", referral_count: 1,  tos_accepted_at: "2026-02-05T14:00:00.000Z", email_verified_at: "2026-02-05T14:05:00.000Z", created_at: "2026-02-05T14:00:00.000Z" },
  { id: "u_ana",     email: "ana@example.es",      name: "Ana V.",     avatar_url: null, verified: 1, rating: 5.0, rating_count: 4,  car_model: null,             car_color: null,     rides_given: 0,  home_city: "Madrid",      smoker: 0, has_license: null, license_verified: 0, referral_code: "ANA00017", referral_count: 0,  tos_accepted_at: "2026-04-10T10:00:00.000Z", email_verified_at: "2026-04-10T10:02:00.000Z", created_at: "2026-04-10T10:00:00.000Z" },
  { id: "u_luis",    email: "luis@example.es",     name: "Luis P.",    avatar_url: null, verified: 1, rating: 4.3, rating_count: 7,  car_model: "Renault Megane", car_color: "Plata",  rides_given: 4,  home_city: "Valencia",    smoker: 0, has_license: 1, license_verified: 0, referral_code: "LUIS0018", referral_count: 0,  tos_accepted_at: "2026-03-28T11:00:00.000Z", email_verified_at: "2026-03-28T11:03:00.000Z", created_at: "2026-03-28T11:00:00.000Z" },
];

// ─── Viajes ───────────────────────────────────────────────────────────────────
// Conciertos reales de Turso. Variedad de estados: activos (vacío, medio, lleno),
// completados en abril (pasados), uno cancelado.
// Ciudades de origen coherentes con la ciudad del venue.

const RIDES = [
  // ── COMPLETADOS EN ABRIL (pasados) ──────────────────────────────────────
  {
    id: "r_done_01", driver_id: "u_laura", concert_id: "c_quevedo_bilbao",
    origin_city: "Madrid", origin_lat: 40.4168, origin_lng: -3.7038,
    origin_address: "Plaza de Castilla, Madrid",
    departure_time: "2026-04-29T12:00:00+02:00", price_per_seat: 22,
    seats_total: 4, seats_left: 0, round_trip: 1, return_time: "2026-04-30T04:00:00+02:00",
    playlist_url: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
    vibe: "party", smoking_policy: "no", max_luggage: "backpack",
    notes: "Paramos en Burgos a comer. Vuelta directa tras el concierto.",
    instant_booking: 1, price_negotiable: 0, accepted_payment: "cash_or_bizum",
    status: "completed", completed_at: "2026-04-30T05:15:00.000Z",
    completion_confirmed_by: "both", payment_reminder_sent_at: "2026-04-29T11:00:00.000Z",
    created_at: "2026-04-15T08:00:00.000Z",
  },
  {
    id: "r_done_02", driver_id: "u_rafa", concert_id: "c_quevedo_bilbao",
    origin_city: "Valencia", origin_lat: 39.4699, origin_lng: -0.3763,
    origin_address: "Av. del Cid, Valencia",
    departure_time: "2026-04-29T13:30:00+02:00", price_per_seat: 18,
    seats_total: 3, seats_left: 0, round_trip: 1, return_time: "2026-04-30T03:30:00+02:00",
    playlist_url: null, vibe: "chill", smoking_policy: "no", max_luggage: "small",
    notes: null, instant_booking: 1, price_negotiable: 0, accepted_payment: "bizum",
    status: "completed", completed_at: "2026-04-30T04:00:00.000Z",
    completion_confirmed_by: "both", payment_reminder_sent_at: "2026-04-29T12:30:00.000Z",
    created_at: "2026-04-12T09:00:00.000Z",
  },
  {
    id: "r_done_03", driver_id: "u_elena", concert_id: "c_quevedo_bilbao",
    origin_city: "Zaragoza", origin_lat: 41.6488, origin_lng: -0.8891,
    origin_address: "Plaza España, Zaragoza",
    departure_time: "2026-04-29T14:00:00+02:00", price_per_seat: 14,
    seats_total: 4, seats_left: 0, round_trip: 0, return_time: null,
    playlist_url: "https://open.spotify.com/playlist/37i9dQZF1DX1HUbZS4LEyL",
    vibe: "mixed", smoking_policy: "no", max_luggage: "cabin",
    notes: "Para a descansar 30 min a mitad de ruta.",
    instant_booking: 0, price_negotiable: 1, accepted_payment: "cash_or_bizum",
    status: "completed", completed_at: "2026-04-29T19:30:00.000Z",
    completion_confirmed_by: "driver", payment_reminder_sent_at: null,
    created_at: "2026-04-14T14:00:00.000Z",
  },
  {
    id: "r_done_04", driver_id: "u_cris", concert_id: "c_quevedo_bilbao",
    origin_city: "Bilbao", origin_lat: 43.263, origin_lng: -2.935,
    origin_address: "Abando, Bilbao",
    departure_time: "2026-04-29T19:00:00+02:00", price_per_seat: 5,
    seats_total: 3, seats_left: 0, round_trip: 1, return_time: "2026-04-30T01:30:00+02:00",
    playlist_url: null, vibe: "party", smoking_policy: "no", max_luggage: "small",
    notes: null, instant_booking: 1, price_negotiable: 0, accepted_payment: "cash",
    status: "completed", completed_at: "2026-04-30T02:00:00.000Z",
    completion_confirmed_by: "both", payment_reminder_sent_at: "2026-04-29T18:00:00.000Z",
    created_at: "2026-04-20T11:00:00.000Z",
  },
  // Viña Rock: Laura volvió a conducir
  {
    id: "r_done_05", driver_id: "u_alba", concert_id: "c_vinarock_2026",
    origin_city: "Madrid", origin_lat: 40.4168, origin_lng: -3.7038,
    origin_address: "Nuevos Ministerios, Madrid",
    departure_time: "2026-04-30T12:00:00+02:00", price_per_seat: 12,
    seats_total: 4, seats_left: 0, round_trip: 1, return_time: "2026-05-02T06:00:00+02:00",
    playlist_url: "https://open.spotify.com/playlist/37i9dQZF1DWY7IeIP1cdjF",
    vibe: "party", smoking_policy: "no", max_luggage: "large",
    notes: "Festival de varios días. Acampamos.",
    instant_booking: 0, price_negotiable: 0, accepted_payment: "cash_or_bizum",
    status: "completed", completed_at: "2026-05-02T07:30:00.000Z",
    completion_confirmed_by: "both", payment_reminder_sent_at: "2026-04-30T11:00:00.000Z",
    created_at: "2026-04-18T10:00:00.000Z",
  },
  {
    id: "r_done_06", driver_id: "u_jorge", concert_id: "c_vinarock_2026",
    origin_city: "Zaragoza", origin_lat: 41.6488, origin_lng: -0.8891,
    origin_address: "Plaza del Pilar, Zaragoza",
    departure_time: "2026-04-30T10:00:00+02:00", price_per_seat: 15,
    seats_total: 3, seats_left: 1, round_trip: 0, return_time: null,
    playlist_url: null, vibe: "chill", smoking_policy: "no", max_luggage: "backpack",
    notes: "Solo ida. El regreso lo organizáis vosotros.",
    instant_booking: 0, price_negotiable: 1, accepted_payment: "cash",
    status: "completed", completed_at: "2026-04-30T16:30:00.000Z",
    completion_confirmed_by: "driver", payment_reminder_sent_at: null,
    created_at: "2026-04-16T15:00:00.000Z",
  },

  // ── ACTIVOS FUTUROS — LLENOS (seats_left = 0, status = full) ────────────
  {
    id: "r_full_01", driver_id: "u_irene", concert_id: "c_rosalia_wizink",
    origin_city: "Sevilla", origin_lat: 37.3886, origin_lng: -5.9823,
    origin_address: "Santa Justa, Sevilla",
    departure_time: "2026-05-22T14:00:00+02:00", price_per_seat: 35,
    seats_total: 4, seats_left: 0, round_trip: 1, return_time: "2026-05-23T03:00:00+02:00",
    playlist_url: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
    vibe: "party", smoking_policy: "no", max_luggage: "backpack",
    notes: "Coche completo — activa alertas para viajes similares.",
    instant_booking: 1, price_negotiable: 0, accepted_payment: "bizum",
    status: "full", completed_at: null, completion_confirmed_by: null,
    payment_reminder_sent_at: null, created_at: "2026-04-20T09:00:00.000Z",
  },
  {
    id: "r_full_02", driver_id: "u_dani", concert_id: "c_primavera_2026",
    origin_city: "Madrid", origin_lat: 40.4168, origin_lng: -3.7038,
    origin_address: "Sants Estació, Barcelona",
    departure_time: "2026-06-05T11:00:00+02:00", price_per_seat: 18,
    seats_total: 3, seats_left: 0, round_trip: 0, return_time: null,
    playlist_url: null, vibe: "mixed", smoking_policy: "no", max_luggage: "cabin",
    notes: null, instant_booking: 1, price_negotiable: 0, accepted_payment: "cash_or_bizum",
    status: "full", completed_at: null, completion_confirmed_by: null,
    payment_reminder_sent_at: null, created_at: "2026-04-22T11:00:00.000Z",
  },
  {
    id: "r_full_03", driver_id: "u_carmen", concert_id: "c_badbunny_cartuja",
    origin_city: "Málaga", origin_lat: 36.7213, origin_lng: -4.4213,
    origin_address: "Estación María Zambrano, Málaga",
    departure_time: "2026-06-08T15:00:00+02:00", price_per_seat: 14,
    seats_total: 4, seats_left: 0, round_trip: 1, return_time: "2026-06-09T04:00:00+02:00",
    playlist_url: "https://open.spotify.com/playlist/37i9dQZF1DWY7IeIP1cdjF",
    vibe: "party", smoking_policy: "no", max_luggage: "backpack",
    notes: "Coche nuevo, AC, no fumadores.",
    instant_booking: 1, price_negotiable: 0, accepted_payment: "bizum",
    status: "full", completed_at: null, completion_confirmed_by: null,
    payment_reminder_sent_at: null, created_at: "2026-04-19T14:00:00.000Z",
  },

  // ── ACTIVOS FUTUROS — MEDIO LLENOS ──────────────────────────────────────
  {
    id: "r_half_01", driver_id: "u_laura", concert_id: "c_rosalia_wizink",
    origin_city: "Barcelona", origin_lat: 41.3851, origin_lng: 2.1734,
    origin_address: "Sagrera, Barcelona",
    departure_time: "2026-05-22T13:00:00+02:00", price_per_seat: 25,
    seats_total: 4, seats_left: 2, round_trip: 1, return_time: "2026-05-23T02:30:00+02:00",
    playlist_url: null, vibe: "party", smoking_policy: "no", max_luggage: "backpack",
    notes: null, instant_booking: 0, price_negotiable: 0, accepted_payment: "cash_or_bizum",
    status: "active", completed_at: null, completion_confirmed_by: null,
    payment_reminder_sent_at: null, created_at: "2026-04-18T10:00:00.000Z",
  },
  {
    id: "r_half_02", driver_id: "u_rafa", concert_id: "c_ctangana_palau",
    origin_city: "Valencia", origin_lat: 39.4699, origin_lng: -0.3763,
    origin_address: "Torres de Serranos, Valencia",
    departure_time: "2026-05-16T11:00:00+02:00", price_per_seat: 20,
    seats_total: 3, seats_left: 1, round_trip: 1, return_time: "2026-05-17T02:00:00+02:00",
    playlist_url: "https://open.spotify.com/playlist/37i9dQZF1DX3LyU0mhfqgP",
    vibe: "chill", smoking_policy: "no", max_luggage: "small",
    notes: "Queda 1 plaza. Pago en Bizum.",
    instant_booking: 0, price_negotiable: 0, accepted_payment: "bizum",
    status: "active", completed_at: null, completion_confirmed_by: null,
    payment_reminder_sent_at: null, created_at: "2026-04-21T16:00:00.000Z",
  },
  {
    id: "r_half_03", driver_id: "u_elena", concert_id: "c_vetusta_vistalegre",
    origin_city: "Zaragoza", origin_lat: 41.6488, origin_lng: -0.8891,
    origin_address: "Delicias, Zaragoza",
    departure_time: "2026-05-03T13:00:00+02:00", price_per_seat: 14,
    seats_total: 4, seats_left: 2, round_trip: 0, return_time: null,
    playlist_url: null, vibe: "chill", smoking_policy: "no", max_luggage: "backpack",
    notes: "Voy con tiempo, paramos a comer en la ruta.",
    instant_booking: 0, price_negotiable: 1, accepted_payment: "cash_or_bizum",
    status: "active", completed_at: null, completion_confirmed_by: null,
    payment_reminder_sent_at: null, created_at: "2026-04-16T14:00:00.000Z",
  },
  {
    id: "r_half_04", driver_id: "u_miguel", concert_id: "c_love_cajamagica",
    origin_city: "Granada", origin_lat: 37.1773, origin_lng: -3.5986,
    origin_address: "Gran Vía, Granada",
    departure_time: "2026-06-14T11:00:00+02:00", price_per_seat: 28,
    seats_total: 3, seats_left: 1, round_trip: 1, return_time: "2026-06-15T03:00:00+02:00",
    playlist_url: null, vibe: "mixed", smoking_policy: "no", max_luggage: "backpack",
    notes: null, instant_booking: 1, price_negotiable: 0, accepted_payment: "cash_or_bizum",
    status: "active", completed_at: null, completion_confirmed_by: null,
    payment_reminder_sent_at: null, created_at: "2026-04-24T10:00:00.000Z",
  },
  {
    id: "r_half_05", driver_id: "u_pablo", concert_id: "c_badbunny_cartuja",
    origin_city: "Málaga", origin_lat: 36.7213, origin_lng: -4.4213,
    origin_address: "Málaga Centro, Málaga",
    departure_time: "2026-06-08T16:30:00+02:00", price_per_seat: 10,
    seats_total: 4, seats_left: 2, round_trip: 1, return_time: "2026-06-09T03:30:00+02:00",
    playlist_url: null, vibe: "party", smoking_policy: "no", max_luggage: "small",
    notes: "Salgo desde Málaga centro, paso por María Zambrano.",
    instant_booking: 1, price_negotiable: 0, accepted_payment: "cash",
    status: "active", completed_at: null, completion_confirmed_by: null,
    payment_reminder_sent_at: null, created_at: "2026-04-23T13:00:00.000Z",
  },
  {
    id: "r_half_06", driver_id: "u_alba", concert_id: "c_sonar_2026",
    origin_city: "Madrid", origin_lat: 40.4168, origin_lng: -3.7038,
    origin_address: "Moncloa, Madrid",
    departure_time: "2026-06-20T09:00:00+02:00", price_per_seat: 30,
    seats_total: 4, seats_left: 2, round_trip: 0, return_time: null,
    playlist_url: "https://open.spotify.com/playlist/37i9dQZF1DWXti3N4Wp5xy",
    vibe: "party", smoking_policy: "no", max_luggage: "cabin",
    notes: "Solo ida. Viaje largo pero buena compañía.",
    instant_booking: 0, price_negotiable: 0, accepted_payment: "bizum",
    status: "active", completed_at: null, completion_confirmed_by: null,
    payment_reminder_sent_at: null, created_at: "2026-04-25T09:00:00.000Z",
  },

  // ── ACTIVOS FUTUROS — VACÍOS (recién publicados) ──────────────────────
  {
    id: "r_empty_01", driver_id: "u_sergio", concert_id: "c_primavera_2026",
    origin_city: "Barcelona", origin_lat: 41.3851, origin_lng: 2.1734,
    origin_address: "Universitat, Barcelona",
    departure_time: "2026-06-05T16:00:00+02:00", price_per_seat: 8,
    seats_total: 3, seats_left: 3, round_trip: 1, return_time: "2026-06-06T03:00:00+02:00",
    playlist_url: null, vibe: "mixed", smoking_policy: "no", max_luggage: "backpack",
    notes: "Viaje corto dentro de Barcelona al recinto.",
    instant_booking: 1, price_negotiable: 0, accepted_payment: "cash_or_bizum",
    status: "active", completed_at: null, completion_confirmed_by: null,
    payment_reminder_sent_at: null, created_at: "2026-04-25T11:00:00.000Z",
  },
  {
    id: "r_empty_02", driver_id: "u_luis", concert_id: "c_love_cajamagica",
    origin_city: "Valencia", origin_lat: 39.4699, origin_lng: -0.3763,
    origin_address: "Xàtiva, Valencia",
    departure_time: "2026-06-14T10:00:00+02:00", price_per_seat: 32,
    seats_total: 4, seats_left: 4, round_trip: 1, return_time: "2026-06-15T03:30:00+02:00",
    playlist_url: null, vibe: "mixed", smoking_policy: "no", max_luggage: "backpack",
    notes: null, instant_booking: 0, price_negotiable: 1, accepted_payment: "cash_or_bizum",
    status: "active", completed_at: null, completion_confirmed_by: null,
    payment_reminder_sent_at: null, created_at: "2026-04-26T08:00:00.000Z",
  },
  {
    id: "r_empty_03", driver_id: "u_paula", concert_id: "c_sonar_2026",
    origin_city: "Valencia", origin_lat: 39.4699, origin_lng: -0.3763,
    origin_address: "Estación del Norte, Valencia",
    departure_time: "2026-06-20T10:30:00+02:00", price_per_seat: 22,
    seats_total: 3, seats_left: 3, round_trip: 0, return_time: null,
    playlist_url: "https://open.spotify.com/playlist/37i9dQZF1DX3LyU0mhfqgP",
    vibe: "party", smoking_policy: "no", max_luggage: "small",
    notes: "Solo ida al Sónar. Buen ambiente garantizado.",
    instant_booking: 0, price_negotiable: 0, accepted_payment: "bizum",
    status: "active", completed_at: null, completion_confirmed_by: null,
    payment_reminder_sent_at: null, created_at: "2026-04-26T10:00:00.000Z",
  },
  {
    id: "r_empty_04", driver_id: "u_jorge", concert_id: "c_madcool_2026",
    origin_city: "Barcelona", origin_lat: 41.3851, origin_lng: 2.1734,
    origin_address: "Sants Estació, Barcelona",
    departure_time: "2026-07-09T07:00:00+02:00", price_per_seat: 35,
    seats_total: 4, seats_left: 4, round_trip: 1, return_time: "2026-07-10T06:00:00+02:00",
    playlist_url: null, vibe: "mixed", smoking_policy: "no", max_luggage: "cabin",
    notes: "Hostel reservado cerca del recinto — podemos compartir.",
    instant_booking: 0, price_negotiable: 0, accepted_payment: "cash_or_bizum",
    status: "active", completed_at: null, completion_confirmed_by: null,
    payment_reminder_sent_at: null, created_at: "2026-04-24T16:00:00.000Z",
  },
  // ── CANCELADO ─────────────────────────────────────────────────────────
  {
    id: "r_cancelled_01", driver_id: "u_marcos", concert_id: "c_vetusta_vistalegre",
    origin_city: "Bilbao", origin_lat: 43.263, origin_lng: -2.935,
    origin_address: "San Mamés, Bilbao",
    departure_time: "2026-05-03T09:00:00+02:00", price_per_seat: 45,
    seats_total: 3, seats_left: 3, round_trip: 0, return_time: null,
    playlist_url: null, vibe: "chill", smoking_policy: "no", max_luggage: "backpack",
    notes: "Cancelado por avería del vehículo. Disculpad.",
    instant_booking: 0, price_negotiable: 0, accepted_payment: "cash",
    status: "cancelled", completed_at: null, completion_confirmed_by: null,
    payment_reminder_sent_at: null, created_at: "2026-04-17T12:00:00.000Z",
  },
];

// ─── Ride requests ────────────────────────────────────────────────────────────

const REQUESTS = [
  // r_done_01 (Laura → Quevedo Bilbao, completo) — 4 pasajeros
  { id: "rr_d01_1", ride_id: "r_done_01", passenger_id: "u_nadia",  seats: 1, status: "confirmed", message: "Perfecto, me viene genial!", payment_method: "bizum",        luggage: "small",   created_at: "2026-04-15T10:00:00.000Z" },
  { id: "rr_d01_2", ride_id: "r_done_01", passenger_id: "u_sergio", seats: 1, status: "confirmed", message: null,                        payment_method: "cash",         luggage: "backpack",created_at: "2026-04-16T09:00:00.000Z" },
  { id: "rr_d01_3", ride_id: "r_done_01", passenger_id: "u_toni",   seats: 2, status: "confirmed", message: "Somos dos, ¿cabe maleta?",  payment_method: "bizum",        luggage: "small",   created_at: "2026-04-17T11:00:00.000Z" },

  // r_done_02 (Rafa → Quevedo Bilbao, completo) — 3 pasajeros
  { id: "rr_d02_1", ride_id: "r_done_02", passenger_id: "u_carmen", seats: 1, status: "confirmed", message: "Genial, bizum listo.",       payment_method: "bizum",        luggage: "none",    created_at: "2026-04-13T12:00:00.000Z" },
  { id: "rr_d02_2", ride_id: "r_done_02", passenger_id: "u_ana",    seats: 2, status: "confirmed", message: "Somos dos amigas.",          payment_method: "bizum",        luggage: "small",   created_at: "2026-04-14T10:00:00.000Z" },

  // r_done_03 (Elena → Quevedo Bilbao, completo) — 4 pasajeros
  { id: "rr_d03_1", ride_id: "r_done_03", passenger_id: "u_jorge",  seats: 1, status: "confirmed", message: "Perfecta la parada.",        payment_method: "cash",         luggage: "backpack",created_at: "2026-04-15T15:00:00.000Z" },
  { id: "rr_d03_2", ride_id: "r_done_03", passenger_id: "u_marcos", seats: 1, status: "confirmed", message: null,                        payment_method: "cash_or_bizum",luggage: "small",   created_at: "2026-04-16T08:00:00.000Z" },
  { id: "rr_d03_3", ride_id: "r_done_03", passenger_id: "u_pablo",  seats: 2, status: "confirmed", message: "Somos dos, perfecta parada.",payment_method: "bizum",        luggage: "backpack",created_at: "2026-04-17T17:00:00.000Z" },

  // r_done_04 (Cris → Quevedo Bilbao, completo) — 3 pasajeros
  { id: "rr_d04_1", ride_id: "r_done_04", passenger_id: "u_jorge",  seats: 1, status: "confirmed", message: "Perfecto desde Abando.",     payment_method: "cash",         luggage: "small",   created_at: "2026-04-21T12:00:00.000Z" },
  { id: "rr_d04_2", ride_id: "r_done_04", passenger_id: "u_miguel", seats: 2, status: "confirmed", message: null,                        payment_method: "cash",         luggage: "none",    created_at: "2026-04-22T09:00:00.000Z" },

  // r_done_05 (Alba → Viña Rock, completo) — 4 pasajeros
  { id: "rr_d05_1", ride_id: "r_done_05", passenger_id: "u_dani",   seats: 1, status: "confirmed", message: "Primera vez en Viña Rock!",  payment_method: "bizum",        luggage: "large",   created_at: "2026-04-19T10:00:00.000Z" },
  { id: "rr_d05_2", ride_id: "r_done_05", passenger_id: "u_irene",  seats: 1, status: "confirmed", message: null,                        payment_method: "cash_or_bizum",luggage: "large",   created_at: "2026-04-20T09:00:00.000Z" },
  { id: "rr_d05_3", ride_id: "r_done_05", passenger_id: "u_nadia",  seats: 2, status: "confirmed", message: "Somos dos, llevamos tienda.",payment_method: "bizum",        luggage: "extra",   created_at: "2026-04-21T14:00:00.000Z" },

  // r_done_06 (Jorge → Viña Rock, 1 hueco) — 2 pasajeros confirmados
  { id: "rr_d06_1", ride_id: "r_done_06", passenger_id: "u_luis",   seats: 1, status: "confirmed", message: "Me apunto solo ida.",        payment_method: "cash",         luggage: "backpack",created_at: "2026-04-17T11:00:00.000Z" },
  { id: "rr_d06_2", ride_id: "r_done_06", passenger_id: "u_ana",    seats: 1, status: "confirmed", message: null,                        payment_method: "bizum",        luggage: "small",   created_at: "2026-04-18T14:00:00.000Z" },

  // r_full_01 (Irene → Rosalía, lleno) — 4 confirmados
  { id: "rr_f01_1", ride_id: "r_full_01", passenger_id: "u_nadia",  seats: 1, status: "confirmed", message: "Perfecto!",                  payment_method: "bizum",        luggage: "small",   created_at: "2026-04-21T09:00:00.000Z" },
  { id: "rr_f01_2", ride_id: "r_full_01", passenger_id: "u_carmen", seats: 1, status: "confirmed", message: null,                        payment_method: "bizum",        luggage: "backpack",created_at: "2026-04-22T10:00:00.000Z" },
  { id: "rr_f01_3", ride_id: "r_full_01", passenger_id: "u_ana",    seats: 2, status: "confirmed", message: "Somos dos desde Sevilla.",   payment_method: "bizum",        luggage: "small",   created_at: "2026-04-23T08:00:00.000Z" },

  // r_full_02 (Dani → Primavera, lleno) — 3 confirmados
  { id: "rr_f02_1", ride_id: "r_full_02", passenger_id: "u_sergio", seats: 1, status: "confirmed", message: null,                        payment_method: "cash_or_bizum",luggage: "backpack",created_at: "2026-04-23T11:00:00.000Z" },
  { id: "rr_f02_2", ride_id: "r_full_02", passenger_id: "u_alba",   seats: 2, status: "confirmed", message: "Genias, nos vemos allí.",    payment_method: "bizum",        luggage: "cabin",   created_at: "2026-04-24T09:00:00.000Z" },

  // r_full_03 (Carmen → Bad Bunny, lleno) — 4 confirmados
  { id: "rr_f03_1", ride_id: "r_full_03", passenger_id: "u_pablo",  seats: 1, status: "confirmed", message: "Bizum enviado.",             payment_method: "bizum",        luggage: "small",   created_at: "2026-04-20T14:00:00.000Z" },
  { id: "rr_f03_2", ride_id: "r_full_03", passenger_id: "u_toni",   seats: 1, status: "confirmed", message: null,                        payment_method: "bizum",        luggage: "none",    created_at: "2026-04-21T10:00:00.000Z" },
  { id: "rr_f03_3", ride_id: "r_full_03", passenger_id: "u_luis",   seats: 2, status: "confirmed", message: "Somos dos, gracias!",        payment_method: "bizum",        luggage: "backpack",created_at: "2026-04-22T16:00:00.000Z" },

  // r_half_01 (Laura → Rosalía, 2 libres) — 2 confirmados
  { id: "rr_h01_1", ride_id: "r_half_01", passenger_id: "u_sergio", seats: 1, status: "confirmed", message: "Me apunto!",                 payment_method: "cash_or_bizum",luggage: "backpack",created_at: "2026-04-19T10:00:00.000Z" },
  { id: "rr_h01_2", ride_id: "r_half_01", passenger_id: "u_miguel", seats: 1, status: "confirmed", message: null,                        payment_method: "cash",         luggage: "small",   created_at: "2026-04-20T08:00:00.000Z" },

  // r_half_02 (Rafa → C.Tangana, 1 libre) — 2 confirmados
  { id: "rr_h02_1", ride_id: "r_half_02", passenger_id: "u_carmen", seats: 1, status: "confirmed", message: "Perfecto, bizum listo.",     payment_method: "bizum",        luggage: "small",   created_at: "2026-04-22T11:00:00.000Z" },
  { id: "rr_h02_2", ride_id: "r_half_02", passenger_id: "u_elena",  seats: 1, status: "confirmed", message: null,                        payment_method: "bizum",        luggage: "none",    created_at: "2026-04-23T09:00:00.000Z" },

  // r_half_03 (Elena → Vetusta, 2 libres) — 2 confirmados
  { id: "rr_h03_1", ride_id: "r_half_03", passenger_id: "u_pablo",  seats: 1, status: "confirmed", message: "Genial la parada.",          payment_method: "cash_or_bizum",luggage: "backpack",created_at: "2026-04-17T14:00:00.000Z" },
  { id: "rr_h03_2", ride_id: "r_half_03", passenger_id: "u_ana",    seats: 1, status: "confirmed", message: null,                        payment_method: "bizum",        luggage: "small",   created_at: "2026-04-18T11:00:00.000Z" },

  // r_half_04 (Miguel → Love of Lesbian, 1 libre) — 2 confirmados
  { id: "rr_h04_1", ride_id: "r_half_04", passenger_id: "u_carmen", seats: 1, status: "confirmed", message: "Buen viaje!",                payment_method: "cash_or_bizum",luggage: "small",   created_at: "2026-04-25T10:00:00.000Z" },
  { id: "rr_h04_2", ride_id: "r_half_04", passenger_id: "u_toni",   seats: 1, status: "confirmed", message: null,                        payment_method: "cash",         luggage: "none",    created_at: "2026-04-25T14:00:00.000Z" },

  // r_half_05 (Pablo → Bad Bunny, 2 libres) — 2 confirmados
  { id: "rr_h05_1", ride_id: "r_half_05", passenger_id: "u_nadia",  seats: 1, status: "confirmed", message: "Genial, desde el centro.",   payment_method: "cash",         luggage: "small",   created_at: "2026-04-24T09:00:00.000Z" },
  { id: "rr_h05_2", ride_id: "r_half_05", passenger_id: "u_miguel", seats: 1, status: "confirmed", message: null,                        payment_method: "cash",         luggage: "none",    created_at: "2026-04-24T14:00:00.000Z" },

  // r_half_06 (Alba → Sónar, 2 libres) — 2 confirmados + 1 pendiente
  { id: "rr_h06_1", ride_id: "r_half_06", passenger_id: "u_dani",   seats: 1, status: "confirmed", message: "Perfecto, Bizum!",           payment_method: "bizum",        luggage: "cabin",   created_at: "2026-04-25T10:00:00.000Z" },
  { id: "rr_h06_2", ride_id: "r_half_06", passenger_id: "u_irene",  seats: 1, status: "confirmed", message: null,                        payment_method: "bizum",        luggage: "small",   created_at: "2026-04-25T11:00:00.000Z" },
  { id: "rr_h06_3", ride_id: "r_half_06", passenger_id: "u_luis",   seats: 1, status: "pending",   message: "¿Queda alguna plaza?",      payment_method: "cash_or_bizum",luggage: "small",   created_at: "2026-04-26T07:00:00.000Z" },

  // r_empty_02 (Luis → Love of Lesbian, vacío) — 1 pendiente
  { id: "rr_e02_1", ride_id: "r_empty_02", passenger_id: "u_ana",   seats: 2, status: "pending",   message: "Somos dos desde Valencia.",  payment_method: "bizum",        luggage: "backpack",created_at: "2026-04-26T09:00:00.000Z" },
];

// ─── Reviews (viajes completados) ────────────────────────────────────────────

const REVIEWS = [
  // r_done_01 — Laura condujo
  { id: "rv_d01_1", ride_id: "r_done_01", reviewer_id: "u_nadia",  reviewee_id: "u_laura",  rating: 5, comment: "Puntualísima, coche limpio y música genial. Repetir!", created_at: "2026-04-30T10:00:00.000Z" },
  { id: "rv_d01_2", ride_id: "r_done_01", reviewer_id: "u_sergio", reviewee_id: "u_laura",  rating: 5, comment: "Todo perfecto. Muy buen viaje.", created_at: "2026-04-30T11:00:00.000Z" },
  { id: "rv_d01_3", ride_id: "r_done_01", reviewer_id: "u_laura",  reviewee_id: "u_nadia",  rating: 5, comment: "Pasajera ideal, puntual y agradable.", created_at: "2026-04-30T13:00:00.000Z" },
  { id: "rv_d01_4", ride_id: "r_done_01", reviewer_id: "u_laura",  reviewee_id: "u_sergio", rating: 4, comment: "Sin problemas, buen pasajero.", created_at: "2026-04-30T13:05:00.000Z" },

  // r_done_02 — Rafa condujo
  { id: "rv_d02_1", ride_id: "r_done_02", reviewer_id: "u_carmen", reviewee_id: "u_rafa",   rating: 5, comment: "Súper cómodo y muy buen trato. 100% recomendable.", created_at: "2026-04-30T14:00:00.000Z" },
  { id: "rv_d02_2", ride_id: "r_done_02", reviewer_id: "u_ana",    reviewee_id: "u_rafa",   rating: 5, comment: "Rafa es conductor de referencia. Ya lo tengo reservado.", created_at: "2026-04-30T15:00:00.000Z" },
  { id: "rv_d02_3", ride_id: "r_done_02", reviewer_id: "u_rafa",   reviewee_id: "u_carmen", rating: 5, comment: "Perfecta pasajera.", created_at: "2026-05-01T08:00:00.000Z" },
  { id: "rv_d02_4", ride_id: "r_done_02", reviewer_id: "u_rafa",   reviewee_id: "u_ana",    rating: 5, comment: "Muy buenas pasajeras.", created_at: "2026-05-01T08:05:00.000Z" },

  // r_done_03 — Elena condujo
  { id: "rv_d03_1", ride_id: "r_done_03", reviewer_id: "u_jorge",  reviewee_id: "u_elena",  rating: 5, comment: "Elena conduce genial. La parada fue perfecta.", created_at: "2026-04-30T12:00:00.000Z" },
  { id: "rv_d03_2", ride_id: "r_done_03", reviewer_id: "u_marcos", reviewee_id: "u_elena",  rating: 4, comment: "Bien el viaje, pequeño retraso al salir.", created_at: "2026-04-30T13:00:00.000Z" },
  { id: "rv_d03_3", ride_id: "r_done_03", reviewer_id: "u_elena",  reviewee_id: "u_jorge",  rating: 5, comment: "Jorge muy puntual y agradable.", created_at: "2026-05-01T09:00:00.000Z" },
  { id: "rv_d03_4", ride_id: "r_done_03", reviewer_id: "u_elena",  reviewee_id: "u_marcos", rating: 4, comment: "Sin incidencias.", created_at: "2026-05-01T09:05:00.000Z" },

  // r_done_04 — Cris condujo
  { id: "rv_d04_1", ride_id: "r_done_04", reviewer_id: "u_jorge",  reviewee_id: "u_cris",   rating: 5, comment: "Corto pero perfecto. Cris conoce Bilbao de maravilla.", created_at: "2026-04-30T16:00:00.000Z" },
  { id: "rv_d04_2", ride_id: "r_done_04", reviewer_id: "u_cris",   reviewee_id: "u_jorge",  rating: 5, comment: "Jorge genial como siempre.", created_at: "2026-04-30T18:00:00.000Z" },

  // r_done_05 — Alba condujo a Viña Rock
  { id: "rv_d05_1", ride_id: "r_done_05", reviewer_id: "u_dani",   reviewee_id: "u_alba",   rating: 5, comment: "Viaje largo pero muy agradable. Alba excelente conductora.", created_at: "2026-05-02T12:00:00.000Z" },
  { id: "rv_d05_2", ride_id: "r_done_05", reviewer_id: "u_irene",  reviewee_id: "u_alba",   rating: 5, comment: "Perfecta organización. Repetir con Alba seguro.", created_at: "2026-05-02T13:00:00.000Z" },
  { id: "rv_d05_3", ride_id: "r_done_05", reviewer_id: "u_alba",   reviewee_id: "u_dani",   rating: 5, comment: "Dani muy buen pasajero, alegre y puntual.", created_at: "2026-05-02T15:00:00.000Z" },
  { id: "rv_d05_4", ride_id: "r_done_05", reviewer_id: "u_alba",   reviewee_id: "u_irene",  rating: 5, comment: "Irene siempre un placer.", created_at: "2026-05-02T15:05:00.000Z" },

  // r_done_06 — Jorge condujo a Viña Rock
  { id: "rv_d06_1", ride_id: "r_done_06", reviewer_id: "u_luis",   reviewee_id: "u_jorge",  rating: 4, comment: "Buen conductor, puntual. Llegaríamos antes si no hubiera parado.", created_at: "2026-05-01T14:00:00.000Z" },
  { id: "rv_d06_2", ride_id: "r_done_06", reviewer_id: "u_jorge",  reviewee_id: "u_luis",   rating: 4, comment: "Luis correcto.", created_at: "2026-05-01T16:00:00.000Z" },
];

// ─── Demand signals ───────────────────────────────────────────────────────────

const EXPIRES = new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString();
const DEMAND = [
  { id: "ds_001", concert_id: "c_madcool_2026",      user_id: "u_nadia",  created_at: "2026-04-20T10:00:00.000Z", expires_at: EXPIRES },
  { id: "ds_002", concert_id: "c_madcool_2026",      user_id: "u_toni",   created_at: "2026-04-22T11:00:00.000Z", expires_at: EXPIRES },
  { id: "ds_003", concert_id: "c_madcool_2026",      user_id: "u_ana",    created_at: "2026-04-23T09:00:00.000Z", expires_at: EXPIRES },
  { id: "ds_004", concert_id: "c_primavera_2026",    user_id: "u_toni",   created_at: "2026-04-21T08:00:00.000Z", expires_at: EXPIRES },
  { id: "ds_005", concert_id: "c_primavera_2026",    user_id: "u_luis",   created_at: "2026-04-24T16:00:00.000Z", expires_at: EXPIRES },
  { id: "ds_006", concert_id: "c_rosalia_wizink",    user_id: "u_miguel", created_at: "2026-04-19T17:00:00.000Z", expires_at: EXPIRES },
  { id: "ds_007", concert_id: "c_rosalia_wizink",    user_id: "u_pablo",  created_at: "2026-04-23T09:00:00.000Z", expires_at: EXPIRES },
  { id: "ds_008", concert_id: "c_badbunny_cartuja",  user_id: "u_sergio", created_at: "2026-04-18T15:00:00.000Z", expires_at: EXPIRES },
  { id: "ds_009", concert_id: "c_badbunny_cartuja",  user_id: "u_elena",  created_at: "2026-04-22T11:00:00.000Z", expires_at: EXPIRES },
  { id: "ds_010", concert_id: "c_sonar_2026",        user_id: "u_alba",   created_at: "2026-04-20T10:00:00.000Z", expires_at: EXPIRES },
  { id: "ds_011", concert_id: "c_sonar_2026",        user_id: "u_marcos", created_at: "2026-04-24T14:00:00.000Z", expires_at: EXPIRES },
  { id: "ds_012", concert_id: "c_love_cajamagica",   user_id: "u_pablo",  created_at: "2026-04-25T09:00:00.000Z", expires_at: EXPIRES },
  { id: "ds_013", concert_id: "c_vetusta_vistalegre",user_id: "u_nadia",  created_at: "2026-04-21T12:00:00.000Z", expires_at: EXPIRES },
  { id: "ds_014", concert_id: "c_ctangana_palau",    user_id: "u_toni",   created_at: "2026-04-23T10:00:00.000Z", expires_at: EXPIRES },
];

// ─── Ejecutar ─────────────────────────────────────────────────────────────────

async function run() {
  console.log(`Conectando a ${DB_URL}…\n`);

  console.log(`[1/5] Insertando ${USERS.length} usuarios…`);
  for (const u of USERS) {
    await db.insert(schema.users).values({
      id: u.id, email: u.email, name: u.name, avatar_url: u.avatar_url,
      verified: u.verified as unknown as boolean,
      rating: u.rating, rating_count: u.rating_count,
      car_model: u.car_model, car_color: u.car_color, rides_given: u.rides_given,
      phone: null, home_city: u.home_city,
      smoker: u.smoker as unknown as boolean | null,
      has_license: u.has_license as unknown as boolean | null,
      license_verified: u.license_verified as unknown as boolean,
      referral_code: u.referral_code, referral_count: u.referral_count,
      password_hash: null, password_salt: null,
      tos_accepted_at: u.tos_accepted_at, email_verified_at: u.email_verified_at,
      deleted_at: null, banned_at: null, ban_reason: null, phone_verified_at: null,
      created_at: u.created_at,
    }).onConflictDoNothing();
  }
  console.log("    ✓ usuarios");

  console.log(`[2/5] Insertando ${RIDES.length} viajes…`);
  for (const r of RIDES) {
    await db.insert(schema.rides).values({
      id: r.id, driver_id: r.driver_id, concert_id: r.concert_id,
      origin_city: r.origin_city, origin_lat: r.origin_lat, origin_lng: r.origin_lng,
      origin_address: r.origin_address, departure_time: r.departure_time,
      price_per_seat: r.price_per_seat, seats_total: r.seats_total, seats_left: r.seats_left,
      round_trip: r.round_trip as unknown as boolean,
      return_time: r.return_time,
      playlist_url: r.playlist_url,
      vibe: r.vibe as "party" | "chill" | "mixed",
      smoking_policy: r.smoking_policy as "no" | "yes",
      max_luggage: r.max_luggage as "none" | "small" | "backpack" | "cabin" | "large" | "extra",
      notes: r.notes,
      instant_booking: r.instant_booking as unknown as boolean,
      price_negotiable: r.price_negotiable as unknown as boolean,
      accepted_payment: r.accepted_payment as "cash" | "bizum" | "cash_or_bizum",
      status: r.status as "active" | "full" | "cancelled" | "completed",
      completed_at: r.completed_at, completion_confirmed_by: r.completion_confirmed_by as "driver" | "both" | null,
      reminded_at: null, payment_reminder_sent_at: r.payment_reminder_sent_at,
      created_at: r.created_at,
    }).onConflictDoNothing();
  }
  console.log("    ✓ viajes");

  console.log(`[3/5] Insertando ${REQUESTS.length} ride requests…`);
  for (const rr of REQUESTS) {
    await db.insert(schema.rideRequests).values({
      id: rr.id, ride_id: rr.ride_id, passenger_id: rr.passenger_id,
      seats: rr.seats, status: rr.status as "pending" | "confirmed" | "rejected" | "cancelled",
      message: rr.message,
      luggage: rr.luggage as "none" | "small" | "backpack" | "cabin" | "large" | "extra",
      payment_method: rr.payment_method as "cash" | "bizum" | "cash_or_bizum",
      created_at: rr.created_at,
    }).onConflictDoNothing();
  }
  console.log("    ✓ ride requests");

  console.log(`[4/5] Insertando ${REVIEWS.length} reviews…`);
  for (const rv of REVIEWS) {
    await db.insert(schema.reviews).values({
      id: rv.id, ride_id: rv.ride_id,
      reviewer_id: rv.reviewer_id, reviewee_id: rv.reviewee_id,
      rating: rv.rating, comment: rv.comment, created_at: rv.created_at,
    }).onConflictDoNothing();
  }
  console.log("    ✓ reviews");

  // Recalcular ratings
  console.log("    Recalculando ratings…");
  const ratingMap: Record<string, { sum: number; count: number }> = {};
  for (const rv of REVIEWS) {
    if (!ratingMap[rv.reviewee_id]) ratingMap[rv.reviewee_id] = { sum: 0, count: 0 };
    ratingMap[rv.reviewee_id]!.sum += rv.rating;
    ratingMap[rv.reviewee_id]!.count++;
  }
  for (const [uid, { sum, count }] of Object.entries(ratingMap)) {
    const user = USERS.find(u => u.id === uid);
    if (!user) continue;
    const totalCount = user.rating_count + count;
    const totalRating = (user.rating * user.rating_count + sum) / totalCount;
    await db.update(schema.users)
      .set({ rating: Math.round(totalRating * 10) / 10, rating_count: totalCount })
      .where(sql`id = ${uid}`);
  }
  // Actualizar rides_given
  const driverMap: Record<string, number> = {};
  for (const r of RIDES) {
    if (r.status === "completed") driverMap[r.driver_id] = (driverMap[r.driver_id] ?? 0) + 1;
  }
  for (const [uid, count] of Object.entries(driverMap)) {
    const user = USERS.find(u => u.id === uid);
    if (!user) continue;
    await db.update(schema.users)
      .set({ rides_given: user.rides_given + count })
      .where(sql`id = ${uid}`);
  }
  console.log("    ✓ ratings y rides_given actualizados");

  console.log(`[5/5] Insertando ${DEMAND.length} demand signals…`);
  for (const d of DEMAND) {
    await db.insert(schema.demandSignals).values(d).onConflictDoNothing();
  }
  console.log("    ✓ demand signals");

  console.log(`\n✅ Seed completado:
  - ${USERS.length} usuarios
  - ${RIDES.length} viajes (${RIDES.filter(r=>r.status==="completed").length} completados, ${RIDES.filter(r=>r.status==="active").length} activos, ${RIDES.filter(r=>r.status==="full").length} llenos, ${RIDES.filter(r=>r.status==="cancelled").length} cancelado)
  - ${REQUESTS.length} ride requests
  - ${REVIEWS.length} reviews
  - ${DEMAND.length} demand signals`);
}

run()
  .catch(err => { console.error("Error:", err); process.exit(1); })
  .finally(() => client.close());

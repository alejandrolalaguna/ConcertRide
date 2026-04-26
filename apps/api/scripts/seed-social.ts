// Seed datos sociales realistas: usuarios adicionales, viajes completados en
// abril 2026, ride requests confirmadas, reviews, y demand signals.
//
// Ejecutar DESPUÉS del seed base:
//   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx apps/api/scripts/seed-social.ts
//
// Es idempotente (onConflictDoNothing en todo).

import { config as loadEnv } from "dotenv";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { sql } from "drizzle-orm";
import * as schema from "../src/db/schema";

loadEnv({ path: new URL("../../../.dev.vars", import.meta.url).pathname.replace(/^\//, "") });
loadEnv({ path: ".env" });

const url = process.env.TURSO_DATABASE_URL;
if (!url) {
  console.error("TURSO_DATABASE_URL no configurado.");
  process.exit(1);
}

const client = createClient({
  url,
  ...(process.env.TURSO_AUTH_TOKEN ? { authToken: process.env.TURSO_AUTH_TOKEN } : {}),
});
const db = drizzle(client, { schema });

// ─── Usuarios adicionales ─────────────────────────────────────────────────────
// Perfiles variados: conductores experimentados, pasajeros frecuentes,
// usuarios nuevos — todos con email_verified_at para parecer activos.

const NEW_USERS = [
  {
    id: "u_alba",
    email: "alba@example.es",
    name: "Alba T.",
    avatar_url: null,
    verified: true,
    rating: 4.8,
    rating_count: 23,
    car_model: "Toyota Yaris",
    car_color: "Blanco",
    rides_given: 14,
    phone: null,
    home_city: "Madrid",
    smoker: false,
    has_license: true,
    license_verified: true,
    referral_code: "ALBA0007",
    referral_count: 2,
    password_hash: null,
    password_salt: null,
    tos_accepted_at: "2026-01-10T09:00:00.000Z",
    email_verified_at: "2026-01-10T09:05:00.000Z",
    deleted_at: null,
    banned_at: null,
    ban_reason: null,
    phone_verified_at: null,
    created_at: "2026-01-10T09:00:00.000Z",
  },
  {
    id: "u_sergio",
    email: "sergio@example.es",
    name: "Sergio N.",
    avatar_url: null,
    verified: true,
    rating: 4.7,
    rating_count: 11,
    car_model: "Honda Jazz",
    car_color: "Gris",
    rides_given: 8,
    phone: null,
    home_city: "Barcelona",
    smoker: null,
    has_license: true,
    license_verified: false,
    referral_code: "SERG0008",
    referral_count: 0,
    password_hash: null,
    password_salt: null,
    tos_accepted_at: "2026-02-14T11:00:00.000Z",
    email_verified_at: "2026-02-14T11:02:00.000Z",
    deleted_at: null,
    banned_at: null,
    ban_reason: null,
    phone_verified_at: null,
    created_at: "2026-02-14T11:00:00.000Z",
  },
  {
    id: "u_nadia",
    email: "nadia@example.es",
    name: "Nadia F.",
    avatar_url: null,
    verified: true,
    rating: 5.0,
    rating_count: 6,
    car_model: null,
    car_color: null,
    rides_given: 0,
    phone: null,
    home_city: "Sevilla",
    smoker: false,
    has_license: null,
    license_verified: false,
    referral_code: "NADI0009",
    referral_count: 0,
    password_hash: null,
    password_salt: null,
    tos_accepted_at: "2026-03-01T16:00:00.000Z",
    email_verified_at: "2026-03-01T16:08:00.000Z",
    deleted_at: null,
    banned_at: null,
    ban_reason: null,
    phone_verified_at: null,
    created_at: "2026-03-01T16:00:00.000Z",
  },
  {
    id: "u_rafa",
    email: "rafa@example.es",
    name: "Rafa C.",
    avatar_url: null,
    verified: true,
    rating: 4.9,
    rating_count: 47,
    car_model: "Opel Astra",
    car_color: "Negro",
    rides_given: 29,
    phone: null,
    home_city: "Valencia",
    smoker: false,
    has_license: true,
    license_verified: true,
    referral_code: "RAFA0010",
    referral_count: 6,
    password_hash: null,
    password_salt: null,
    tos_accepted_at: "2025-10-05T10:00:00.000Z",
    email_verified_at: "2025-10-05T10:01:00.000Z",
    deleted_at: null,
    banned_at: null,
    ban_reason: null,
    phone_verified_at: null,
    created_at: "2025-10-05T10:00:00.000Z",
  },
  {
    id: "u_cris",
    email: "cris@example.es",
    name: "Cris M.",
    avatar_url: null,
    verified: true,
    rating: 4.6,
    rating_count: 15,
    car_model: "Dacia Sandero",
    car_color: "Azul",
    rides_given: 10,
    phone: null,
    home_city: "Bilbao",
    smoker: null,
    has_license: true,
    license_verified: true,
    referral_code: "CRIS0011",
    referral_count: 1,
    password_hash: null,
    password_salt: null,
    tos_accepted_at: "2026-01-28T08:00:00.000Z",
    email_verified_at: "2026-01-28T08:03:00.000Z",
    deleted_at: null,
    banned_at: null,
    ban_reason: null,
    phone_verified_at: null,
    created_at: "2026-01-28T08:00:00.000Z",
  },
  {
    id: "u_toni",
    email: "toni@example.es",
    name: "Toni V.",
    avatar_url: null,
    verified: false,
    rating: 0,
    rating_count: 0,
    car_model: null,
    car_color: null,
    rides_given: 0,
    phone: null,
    home_city: "Málaga",
    smoker: null,
    has_license: null,
    license_verified: false,
    referral_code: "TONI0012",
    referral_count: 0,
    password_hash: null,
    password_salt: null,
    tos_accepted_at: "2026-04-18T19:00:00.000Z",
    email_verified_at: null,
    deleted_at: null,
    banned_at: null,
    ban_reason: null,
    phone_verified_at: null,
    created_at: "2026-04-18T19:00:00.000Z",
  },
  {
    id: "u_elena",
    email: "elena@example.es",
    name: "Elena R.",
    avatar_url: null,
    verified: true,
    rating: 4.9,
    rating_count: 31,
    car_model: "Hyundai i30",
    car_color: "Blanco",
    rides_given: 19,
    phone: null,
    home_city: "Zaragoza",
    smoker: false,
    has_license: true,
    license_verified: true,
    referral_code: "ELEN0013",
    referral_count: 3,
    password_hash: null,
    password_salt: null,
    tos_accepted_at: "2025-12-20T17:00:00.000Z",
    email_verified_at: "2025-12-20T17:04:00.000Z",
    deleted_at: null,
    banned_at: null,
    ban_reason: null,
    phone_verified_at: null,
    created_at: "2025-12-20T17:00:00.000Z",
  },
  {
    id: "u_miguel",
    email: "miguel@example.es",
    name: "Miguel A.",
    avatar_url: null,
    verified: true,
    rating: 4.5,
    rating_count: 8,
    car_model: "Skoda Fabia",
    car_color: "Rojo",
    rides_given: 5,
    phone: null,
    home_city: "Granada",
    smoker: false,
    has_license: true,
    license_verified: false,
    referral_code: "MIGU0014",
    referral_count: 0,
    password_hash: null,
    password_salt: null,
    tos_accepted_at: "2026-03-15T12:00:00.000Z",
    email_verified_at: "2026-03-15T12:06:00.000Z",
    deleted_at: null,
    banned_at: null,
    ban_reason: null,
    phone_verified_at: null,
    created_at: "2026-03-15T12:00:00.000Z",
  },
];

// ─── Conciertos de abril (ya pasados) ─────────────────────────────────────────
// Usamos c_quevedo_bilbao (29 abr) ya existente para los viajes completados.
// Añadimos un concierto de principios de abril para viajes más pasados.

// Nota: el venue bilbao-arena ya existe en fixtures.
// Usamos caja-magica y palacio-vistalegre que también ya existen.

// ─── Viajes completados en abril 2026 ─────────────────────────────────────────
// Simulan actividad real del mes pasado. status="completed", completed_at pasado.

const COMPLETED_RIDES = [
  // Viaje completado: Laura llevó gente a Viña Rock (Villarrobledo) el 2 mayo
  // (lo ponemos en "abril" con fecha 30 abril que es cuando salieron)
  {
    id: "r_done_01",
    driver_id: "u_laura",
    concert_id: "c_quevedo_bilbao", // usamos el de abril que ya existe
    origin_city: "Madrid",
    origin_lat: 40.4168,
    origin_lng: -3.7038,
    origin_address: "Plaza de Castilla, Madrid",
    departure_time: "2026-04-05T15:00:00.000+02:00",
    price_per_seat: 9,
    seats_total: 4,
    seats_left: 0,
    round_trip: true,
    return_time: "2026-04-06T03:00:00.000+02:00",
    playlist_url: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
    vibe: "party" as const,
    smoking_policy: "no" as const,
    max_luggage: "backpack" as const,
    notes: "Llevo altavoz. Salimos puntuales.",
    instant_booking: false,
    price_negotiable: false,
    accepted_payment: "cash_or_bizum" as const,
    status: "completed" as const,
    completed_at: "2026-04-06T04:30:00.000Z",
    completion_confirmed_by: "both" as const,
    reminded_at: null,
    payment_reminder_sent_at: "2026-04-05T14:00:00.000Z",
    created_at: "2026-04-01T10:00:00.000Z",
  },
  // Rafa llevó gente a un concierto en Valencia — viaje corto, precio bajo
  {
    id: "r_done_02",
    driver_id: "u_rafa",
    concert_id: "c_quevedo_bilbao",
    origin_city: "Valencia",
    origin_lat: 39.4699,
    origin_lng: -0.3763,
    origin_address: "Av. del Cid, Valencia",
    departure_time: "2026-04-12T17:30:00.000+02:00",
    price_per_seat: 6,
    seats_total: 3,
    seats_left: 0,
    round_trip: true,
    return_time: "2026-04-13T01:30:00.000+02:00",
    playlist_url: null,
    vibe: "chill" as const,
    smoking_policy: "no" as const,
    max_luggage: "small" as const,
    notes: null,
    instant_booking: true,
    price_negotiable: false,
    accepted_payment: "bizum" as const,
    status: "completed" as const,
    completed_at: "2026-04-13T02:00:00.000Z",
    completion_confirmed_by: "both" as const,
    reminded_at: null,
    payment_reminder_sent_at: "2026-04-12T16:30:00.000Z",
    created_at: "2026-04-07T09:00:00.000Z",
  },
  // Elena llevó grupo a concierto desde Zaragoza a Madrid
  {
    id: "r_done_03",
    driver_id: "u_elena",
    concert_id: "c_quevedo_bilbao",
    origin_city: "Zaragoza",
    origin_lat: 41.6488,
    origin_lng: -0.8891,
    origin_address: "Plaza España, Zaragoza",
    departure_time: "2026-04-18T11:00:00.000+02:00",
    price_per_seat: 14,
    seats_total: 4,
    seats_left: 0,
    round_trip: false,
    return_time: null,
    playlist_url: "https://open.spotify.com/playlist/37i9dQZF1DX1HUbZS4LEyL",
    vibe: "mixed" as const,
    smoking_policy: "no" as const,
    max_luggage: "cabin" as const,
    notes: "Para a descansar 30 min a mitad de ruta.",
    instant_booking: false,
    price_negotiable: true,
    accepted_payment: "cash_or_bizum" as const,
    status: "completed" as const,
    completed_at: "2026-04-18T16:30:00.000Z",
    completion_confirmed_by: "driver" as const,
    reminded_at: null,
    payment_reminder_sent_at: null,
    created_at: "2026-04-10T14:00:00.000Z",
  },
  // Alba llevó gente a Quevedo en Bilbao (el 29 abril, viaje largo desde Madrid)
  {
    id: "r_done_04",
    driver_id: "u_alba",
    concert_id: "c_quevedo_bilbao",
    origin_city: "Madrid",
    origin_lat: 40.4168,
    origin_lng: -3.7038,
    origin_address: "Nuevos Ministerios, Madrid",
    departure_time: "2026-04-29T12:00:00.000+02:00",
    price_per_seat: 22,
    seats_total: 4,
    seats_left: 0,
    round_trip: true,
    return_time: "2026-04-30T04:00:00.000+02:00",
    playlist_url: "https://open.spotify.com/playlist/37i9dQZF1DWY7IeIP1cdjF",
    vibe: "party" as const,
    smoking_policy: "no" as const,
    max_luggage: "backpack" as const,
    notes: "Paramos en Burgos a comer. Vuelta directa.",
    instant_booking: true,
    price_negotiable: false,
    accepted_payment: "cash_or_bizum" as const,
    status: "completed" as const,
    completed_at: "2026-04-30T05:15:00.000Z",
    completion_confirmed_by: "both" as const,
    reminded_at: null,
    payment_reminder_sent_at: "2026-04-29T11:00:00.000Z",
    created_at: "2026-04-15T08:00:00.000Z",
  },
  // Cris llevó gente desde Bilbao — viaje corto
  {
    id: "r_done_05",
    driver_id: "u_cris",
    concert_id: "c_quevedo_bilbao",
    origin_city: "Bilbao",
    origin_lat: 43.263,
    origin_lng: -2.935,
    origin_address: "Abando, Bilbao",
    departure_time: "2026-04-29T19:00:00.000+02:00",
    price_per_seat: 5,
    seats_total: 3,
    seats_left: 0,
    round_trip: true,
    return_time: "2026-04-30T01:30:00.000+02:00",
    playlist_url: null,
    vibe: "party" as const,
    smoking_policy: "no" as const,
    max_luggage: "small" as const,
    notes: null,
    instant_booking: true,
    price_negotiable: false,
    accepted_payment: "cash" as const,
    status: "completed" as const,
    completed_at: "2026-04-30T02:00:00.000Z",
    completion_confirmed_by: "both" as const,
    reminded_at: null,
    payment_reminder_sent_at: "2026-04-29T18:00:00.000Z",
    created_at: "2026-04-20T11:00:00.000Z",
  },
  // Miguel (Granada) fue de pasajero pero también hizo un viaje como conductor
  {
    id: "r_done_06",
    driver_id: "u_miguel",
    concert_id: "c_quevedo_bilbao",
    origin_city: "Granada",
    origin_lat: 37.1773,
    origin_lng: -3.5986,
    origin_address: "Gran Vía, Granada",
    departure_time: "2026-04-22T10:00:00.000+02:00",
    price_per_seat: 28,
    seats_total: 3,
    seats_left: 1,
    round_trip: false,
    return_time: null,
    playlist_url: null,
    vibe: "chill" as const,
    smoking_policy: "no" as const,
    max_luggage: "backpack" as const,
    notes: "Primera vez que conduzco en ConcertRide, con calma.",
    instant_booking: false,
    price_negotiable: true,
    accepted_payment: "cash_or_bizum" as const,
    status: "completed" as const,
    completed_at: "2026-04-22T18:30:00.000Z",
    completion_confirmed_by: "driver" as const,
    reminded_at: null,
    payment_reminder_sent_at: null,
    created_at: "2026-04-16T15:00:00.000Z",
  },
];

// ─── Ride requests confirmadas para los viajes completados ────────────────────
const CONFIRMED_REQUESTS = [
  // r_done_01: Laura llevó a nadia + sergio (4 asientos, 0 libres → 2 pasajeros con 1 asiento c/u)
  { id: "rr_001", ride_id: "r_done_01", passenger_id: "u_nadia", seats: 1, status: "confirmed" as const, message: "Perfecto, nos vemos en el punto de salida!", payment_method: "bizum" as const, luggage: "small" as const, created_at: "2026-04-01T14:00:00.000Z" },
  { id: "rr_002", ride_id: "r_done_01", passenger_id: "u_sergio", seats: 1, status: "confirmed" as const, message: null, payment_method: "cash" as const, luggage: "backpack" as const, created_at: "2026-04-02T09:00:00.000Z" },
  { id: "rr_003", ride_id: "r_done_01", passenger_id: "u_toni", seats: 2, status: "confirmed" as const, message: "Somos dos, ¿cabe maleta pequeña?", payment_method: "bizum" as const, luggage: "small" as const, created_at: "2026-04-03T11:00:00.000Z" },

  // r_done_02: Rafa llevó a nadia + alba (3 asientos, 0 libres)
  { id: "rr_004", ride_id: "r_done_02", passenger_id: "u_nadia", seats: 1, status: "confirmed" as const, message: null, payment_method: "bizum" as const, luggage: "none" as const, created_at: "2026-04-07T12:00:00.000Z" },
  { id: "rr_005", ride_id: "r_done_02", passenger_id: "u_alba", seats: 2, status: "confirmed" as const, message: "Genial, puntualísimos!", payment_method: "bizum" as const, luggage: "small" as const, created_at: "2026-04-08T10:00:00.000Z" },

  // r_done_03: Elena llevó a jorge + marcos + paula
  { id: "rr_006", ride_id: "r_done_03", passenger_id: "u_jorge", seats: 1, status: "confirmed" as const, message: "Perfecto, me viene genial la parada.", payment_method: "cash" as const, luggage: "backpack" as const, created_at: "2026-04-10T15:00:00.000Z" },
  { id: "rr_007", ride_id: "r_done_03", passenger_id: "u_marcos", seats: 1, status: "confirmed" as const, message: null, payment_method: "cash_or_bizum" as const, luggage: "small" as const, created_at: "2026-04-11T08:00:00.000Z" },
  { id: "rr_008", ride_id: "r_done_03", passenger_id: "u_paula", seats: 2, status: "confirmed" as const, message: "Somos dos, perfecta la parada a mitad.", payment_method: "bizum" as const, luggage: "backpack" as const, created_at: "2026-04-12T17:00:00.000Z" },

  // r_done_04: Alba llevó a dani + irene + sergio
  { id: "rr_009", ride_id: "r_done_04", passenger_id: "u_dani", seats: 1, status: "confirmed" as const, message: "Primera vez yendo a Bilbao en coche, genial!", payment_method: "bizum" as const, luggage: "backpack" as const, created_at: "2026-04-15T10:00:00.000Z" },
  { id: "rr_010", ride_id: "r_done_04", passenger_id: "u_irene", seats: 1, status: "confirmed" as const, message: null, payment_method: "cash_or_bizum" as const, luggage: "small" as const, created_at: "2026-04-16T09:00:00.000Z" },
  { id: "rr_011", ride_id: "r_done_04", passenger_id: "u_nadia", seats: 2, status: "confirmed" as const, message: "Somos dos amigas, ¿hay espacio para maletas?", payment_method: "bizum" as const, luggage: "cabin" as const, created_at: "2026-04-17T14:00:00.000Z" },

  // r_done_05: Cris llevó a jorge + toni
  { id: "rr_012", ride_id: "r_done_05", passenger_id: "u_jorge", seats: 1, status: "confirmed" as const, message: "Perfecto, desde Abando me viene bien.", payment_method: "cash" as const, luggage: "small" as const, created_at: "2026-04-20T12:00:00.000Z" },
  { id: "rr_013", ride_id: "r_done_05", passenger_id: "u_toni", seats: 2, status: "confirmed" as const, message: null, payment_method: "cash" as const, luggage: "none" as const, created_at: "2026-04-21T09:00:00.000Z" },

  // r_done_06: Miguel llevó a marcos (1 asiento, quedó 1 libre)
  { id: "rr_014", ride_id: "r_done_06", passenger_id: "u_marcos", seats: 2, status: "confirmed" as const, message: "Genial, sin prisa.", payment_method: "cash_or_bizum" as const, luggage: "backpack" as const, created_at: "2026-04-16T16:00:00.000Z" },

  // r_06 (ya existente, jorge→quevedo bilbao): añadimos pasajeros
  { id: "rr_015", ride_id: "r_06", passenger_id: "u_alba", seats: 1, status: "confirmed" as const, message: "Me apunto!", payment_method: "bizum" as const, luggage: "backpack" as const, created_at: "2026-04-20T10:00:00.000Z" },
  { id: "rr_016", ride_id: "r_06", passenger_id: "u_elena", seats: 1, status: "confirmed" as const, message: null, payment_method: "cash" as const, luggage: "small" as const, created_at: "2026-04-21T08:00:00.000Z" },
  { id: "rr_017", ride_id: "r_06", passenger_id: "u_miguel", seats: 1, status: "pending" as const, message: "¿Hay sitio todavía?", payment_method: "bizum" as const, luggage: "none" as const, created_at: "2026-04-23T19:00:00.000Z" },
];

// ─── Reviews post-viaje ───────────────────────────────────────────────────────
// Pasajeros valoran al conductor y conductores valoran a pasajeros.
// Ratings altos pero realistas (4-5).

const REVIEWS = [
  // r_done_01 — Laura condujo
  { id: "rv_001", ride_id: "r_done_01", reviewer_id: "u_nadia", reviewee_id: "u_laura", rating: 5, comment: "Puntualísima, coche limpio y muy buena música. Repetir seguro.", created_at: "2026-04-06T12:00:00.000Z" },
  { id: "rv_002", ride_id: "r_done_01", reviewer_id: "u_sergio", reviewee_id: "u_laura", rating: 5, comment: "Todo perfecto. Muy agradable el viaje.", created_at: "2026-04-06T13:00:00.000Z" },
  { id: "rv_003", ride_id: "r_done_01", reviewer_id: "u_laura", reviewee_id: "u_nadia", rating: 5, comment: "Pasajera genial, puntual y muy mala.", created_at: "2026-04-07T09:00:00.000Z" },
  { id: "rv_004", ride_id: "r_done_01", reviewer_id: "u_laura", reviewee_id: "u_sergio", rating: 4, comment: "Sin problemas.", created_at: "2026-04-07T09:05:00.000Z" },

  // r_done_02 — Rafa condujo
  { id: "rv_005", ride_id: "r_done_02", reviewer_id: "u_nadia", reviewee_id: "u_rafa", rating: 5, comment: "Súper cómodo el coche y muy buen trato. 100% recomendable.", created_at: "2026-04-13T10:00:00.000Z" },
  { id: "rv_006", ride_id: "r_done_02", reviewer_id: "u_alba", reviewee_id: "u_rafa", rating: 5, comment: "Rafa es el conductor de referencia. Ya lo he reservado para el próximo.", created_at: "2026-04-13T11:00:00.000Z" },
  { id: "rv_007", ride_id: "r_done_02", reviewer_id: "u_rafa", reviewee_id: "u_nadia", rating: 5, comment: "Perfecta.", created_at: "2026-04-14T08:00:00.000Z" },
  { id: "rv_008", ride_id: "r_done_02", reviewer_id: "u_rafa", reviewee_id: "u_alba", rating: 5, comment: "Muy buena pasajera, recomendada.", created_at: "2026-04-14T08:05:00.000Z" },

  // r_done_03 — Elena condujo
  { id: "rv_009", ride_id: "r_done_03", reviewer_id: "u_jorge", reviewee_id: "u_elena", rating: 5, comment: "Elena conduce genial. La parada fue perfecta.", created_at: "2026-04-19T09:00:00.000Z" },
  { id: "rv_010", ride_id: "r_done_03", reviewer_id: "u_marcos", reviewee_id: "u_elena", rating: 4, comment: "Bien el viaje, solo un poco de retraso al salir.", created_at: "2026-04-19T10:00:00.000Z" },
  { id: "rv_011", ride_id: "r_done_03", reviewer_id: "u_elena", reviewee_id: "u_jorge", rating: 5, comment: "Jorge muy puntual y agradable.", created_at: "2026-04-20T08:00:00.000Z" },
  { id: "rv_012", ride_id: "r_done_03", reviewer_id: "u_elena", reviewee_id: "u_marcos", rating: 4, comment: "Sin problemas.", created_at: "2026-04-20T08:05:00.000Z" },

  // r_done_04 — Alba condujo (Madrid → Bilbao)
  { id: "rv_013", ride_id: "r_done_04", reviewer_id: "u_dani", reviewee_id: "u_alba", rating: 5, comment: "Viaje largo pero muy agradable. Alba es una conductora excelente.", created_at: "2026-05-01T09:00:00.000Z" },
  { id: "rv_014", ride_id: "r_done_04", reviewer_id: "u_irene", reviewee_id: "u_alba", rating: 5, comment: "Perfecta organización. La parada en Burgos fue un acierto.", created_at: "2026-05-01T10:00:00.000Z" },
  { id: "rv_015", ride_id: "r_done_04", reviewer_id: "u_alba", reviewee_id: "u_dani", rating: 5, comment: "Dani muy buen pasajero.", created_at: "2026-05-01T12:00:00.000Z" },
  { id: "rv_016", ride_id: "r_done_04", reviewer_id: "u_alba", reviewee_id: "u_irene", rating: 5, comment: "Irene siempre un placer.", created_at: "2026-05-01T12:05:00.000Z" },

  // r_done_05 — Cris condujo (local Bilbao)
  { id: "rv_017", ride_id: "r_done_05", reviewer_id: "u_jorge", reviewee_id: "u_cris", rating: 5, comment: "Corto pero perfecto. Cris conoce Bilbao de maravilla.", created_at: "2026-04-30T12:00:00.000Z" },
  { id: "rv_018", ride_id: "r_done_05", reviewer_id: "u_cris", reviewee_id: "u_jorge", rating: 5, comment: "Jorge genial.", created_at: "2026-04-30T14:00:00.000Z" },

  // r_done_06 — Miguel condujo
  { id: "rv_019", ride_id: "r_done_06", reviewer_id: "u_marcos", reviewee_id: "u_miguel", rating: 4, comment: "Buen viaje para ser la primera vez de Miguel en la app.", created_at: "2026-04-23T10:00:00.000Z" },
  { id: "rv_020", ride_id: "r_done_06", reviewer_id: "u_miguel", reviewee_id: "u_marcos", rating: 5, comment: "Marcos muy buen pasajero, sin complicaciones.", created_at: "2026-04-23T11:00:00.000Z" },
];

// ─── Demand signals — usuarios interesados en conciertos futuros ──────────────
// "Notifícame cuando haya un viaje" — genera sensación de demanda activa.

const now = new Date();
const inTwoMonths = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString();

const DEMAND_SIGNALS = [
  // Mad Cool 2026 — mucha demanda
  { id: "ds_001", concert_id: "c_madcool_2026", user_id: "u_nadia", created_at: "2026-04-10T10:00:00.000Z", expires_at: inTwoMonths },
  { id: "ds_002", concert_id: "c_madcool_2026", user_id: "u_toni", created_at: "2026-04-12T11:00:00.000Z", expires_at: inTwoMonths },
  { id: "ds_003", concert_id: "c_madcool_2026", user_id: "u_sergio", created_at: "2026-04-15T09:00:00.000Z", expires_at: inTwoMonths },
  { id: "ds_004", concert_id: "c_madcool_2026", user_id: "u_miguel", created_at: "2026-04-18T14:00:00.000Z", expires_at: inTwoMonths },

  // Primavera Sound
  { id: "ds_005", concert_id: "c_primavera_2026", user_id: "u_toni", created_at: "2026-04-11T08:00:00.000Z", expires_at: inTwoMonths },
  { id: "ds_006", concert_id: "c_primavera_2026", user_id: "u_rafa", created_at: "2026-04-14T16:00:00.000Z", expires_at: inTwoMonths },
  { id: "ds_007", concert_id: "c_primavera_2026", user_id: "u_cris", created_at: "2026-04-20T10:00:00.000Z", expires_at: inTwoMonths },

  // Rosalía WiZink
  { id: "ds_008", concert_id: "c_rosalia_wizink", user_id: "u_nadia", created_at: "2026-04-08T12:00:00.000Z", expires_at: inTwoMonths },
  { id: "ds_009", concert_id: "c_rosalia_wizink", user_id: "u_miguel", created_at: "2026-04-16T17:00:00.000Z", expires_at: inTwoMonths },
  { id: "ds_010", concert_id: "c_rosalia_wizink", user_id: "u_toni", created_at: "2026-04-22T09:00:00.000Z", expires_at: inTwoMonths },

  // Bad Bunny
  { id: "ds_011", concert_id: "c_badbunny_cartuja", user_id: "u_sergio", created_at: "2026-04-13T15:00:00.000Z", expires_at: inTwoMonths },
  { id: "ds_012", concert_id: "c_badbunny_cartuja", user_id: "u_elena", created_at: "2026-04-19T11:00:00.000Z", expires_at: inTwoMonths },

  // Sónar
  { id: "ds_013", concert_id: "c_sonar_2026", user_id: "u_alba", created_at: "2026-04-17T10:00:00.000Z", expires_at: inTwoMonths },
  { id: "ds_014", concert_id: "c_sonar_2026", user_id: "u_cris", created_at: "2026-04-21T14:00:00.000Z", expires_at: inTwoMonths },
];

// ─── Ejecutar ─────────────────────────────────────────────────────────────────

async function seedSocial() {
  console.log(`Conectando a ${url}…`);

  console.log(`Insertando ${NEW_USERS.length} usuarios nuevos…`);
  await db.insert(schema.users).values(NEW_USERS).onConflictDoNothing();

  console.log(`Insertando ${COMPLETED_RIDES.length} viajes completados…`);
  await db.insert(schema.rides).values(COMPLETED_RIDES).onConflictDoNothing();

  console.log(`Insertando ${CONFIRMED_REQUESTS.length} ride requests…`);
  await db.insert(schema.rideRequests).values(CONFIRMED_REQUESTS).onConflictDoNothing();

  console.log(`Insertando ${REVIEWS.length} reviews…`);
  await db.insert(schema.reviews).values(REVIEWS).onConflictDoNothing();

  // Actualizar rating_count y rating en usuarios que recibieron reviews
  console.log("Actualizando ratings de usuarios…");
  const ratingUpdates: Record<string, { sum: number; count: number }> = {};
  for (const r of REVIEWS) {
    if (!ratingUpdates[r.reviewee_id]) ratingUpdates[r.reviewee_id] = { sum: 0, count: 0 };
    ratingUpdates[r.reviewee_id]!.sum += r.rating;
    ratingUpdates[r.reviewee_id]!.count += 1;
  }
  for (const [userId, { sum, count }] of Object.entries(ratingUpdates)) {
    // Fetch current rating to merge with existing
    const existing = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.id, userId) });
    if (!existing) continue;
    const totalCount = existing.rating_count + count;
    const totalRating = (existing.rating * existing.rating_count + sum) / totalCount;
    await db
      .update(schema.users)
      .set({
        rating: Math.round(totalRating * 10) / 10,
        rating_count: totalCount,
      })
      .where(sql`id = ${userId}`);
  }

  // Actualizar rides_given para conductores de viajes completados
  console.log("Actualizando rides_given…");
  const driverCounts: Record<string, number> = {};
  for (const r of COMPLETED_RIDES) {
    driverCounts[r.driver_id] = (driverCounts[r.driver_id] ?? 0) + 1;
  }
  for (const [driverId, count] of Object.entries(driverCounts)) {
    const existing = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.id, driverId) });
    if (!existing) continue;
    await db
      .update(schema.users)
      .set({ rides_given: existing.rides_given + count })
      .where(sql`id = ${driverId}`);
  }

  console.log(`Insertando ${DEMAND_SIGNALS.length} demand signals…`);
  await db.insert(schema.demandSignals).values(DEMAND_SIGNALS).onConflictDoNothing();

  console.log("✓ seed-social completo");
}

seedSocial()
  .catch((err) => {
    console.error("seed-social falló:", err);
    process.exit(1);
  })
  .finally(() => {
    client.close();
  });

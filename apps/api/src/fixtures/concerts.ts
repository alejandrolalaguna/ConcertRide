import type { Concert } from "@concertride/types";
import { VENUES_BY_ID } from "./venues";

interface ConcertSeed {
  id: string;
  name: string;
  artist: string;
  venue_id: string;
  date: string;
  genre: string;
  price_min: number;
  price_max: number;
  active_rides_count: number;
}

const SEEDS: ConcertSeed[] = [
  {
    id: "c_rosalia_wizink",
    name: "ROSALÍA — Lux Tour",
    artist: "Rosalía",
    venue_id: "wizink",
    date: "2026-05-22T21:00:00.000+02:00",
    genre: "Pop / Flamenco",
    price_min: 48,
    price_max: 140,
    active_rides_count: 12,
  },
  {
    id: "c_badbunny_cartuja",
    name: "BAD BUNNY — Most Wanted Tour",
    artist: "Bad Bunny",
    venue_id: "la-cartuja",
    date: "2026-06-08T22:00:00.000+02:00",
    genre: "Reggaetón",
    price_min: 65,
    price_max: 220,
    active_rides_count: 34,
  },
  {
    id: "c_madcool_2026",
    name: "Mad Cool Festival 2026 — Day 1",
    artist: "Pearl Jam · Fontaines D.C. · Muse",
    venue_id: "mad-cool",
    date: "2026-07-09T16:00:00.000+02:00",
    genre: "Festival / Rock",
    price_min: 89,
    price_max: 189,
    active_rides_count: 58,
  },
  {
    id: "c_primavera_2026",
    name: "Primavera Sound 2026 — Friday",
    artist: "Charli XCX · LCD Soundsystem · Sabrina Carpenter",
    venue_id: "primavera",
    date: "2026-06-05T18:00:00.000+02:00",
    genre: "Festival / Indie",
    price_min: 95,
    price_max: 245,
    active_rides_count: 41,
  },
  {
    id: "c_ctangana_palau",
    name: "C. TANGANA — El Madrileño Revisited",
    artist: "C. Tangana",
    venue_id: "palau-sant-jordi",
    date: "2026-05-16T22:00:00.000+02:00",
    genre: "Pop / Urbano",
    price_min: 42,
    price_max: 120,
    active_rides_count: 9,
  },
  {
    id: "c_quevedo_bilbao",
    name: "QUEVEDO — Buenas Noches Tour",
    artist: "Quevedo",
    venue_id: "bilbao-arena",
    date: "2026-04-29T21:30:00.000+02:00",
    genre: "Reggaetón / Trap",
    price_min: 38,
    price_max: 95,
    active_rides_count: 14,
  },
  {
    id: "c_vetusta_vistalegre",
    name: "VETUSTA MORLA — Figurantes Tour",
    artist: "Vetusta Morla",
    venue_id: "palacio-vistalegre",
    date: "2026-05-03T21:00:00.000+02:00",
    genre: "Indie Rock",
    price_min: 35,
    price_max: 70,
    active_rides_count: 7,
  },
  {
    id: "c_love_cajamagica",
    name: "Love of Lesbian — 20 Aniversario",
    artist: "Love of Lesbian",
    venue_id: "caja-magica",
    date: "2026-06-14T20:30:00.000+02:00",
    genre: "Indie Pop",
    price_min: 32,
    price_max: 68,
    active_rides_count: 5,
  },
];

export const CONCERTS: Concert[] = SEEDS.map((s) => {
  const venue = VENUES_BY_ID[s.venue_id];
  if (!venue) throw new Error(`Unknown venue_id in concert seed: ${s.venue_id}`);
  return {
    id: s.id,
    name: s.name,
    artist: s.artist,
    venue_id: s.venue_id,
    venue,
    date: s.date,
    image_url: `https://picsum.photos/seed/${s.id}/800/600`,
    ticketmaster_id: null,
    ticketmaster_url: null,
    genre: s.genre,
    price_min: s.price_min,
    price_max: s.price_max,
    active_rides_count: s.active_rides_count,
  };
});

export const CONCERTS_BY_ID = Object.fromEntries(CONCERTS.map((c) => [c.id, c]));

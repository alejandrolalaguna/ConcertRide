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
  // --- target partnership festivals (GTM launch) ---
  {
    id: "c_sonar_2026",
    name: "Sónar 2026 — Noche del sábado",
    artist: "Aphex Twin · Peggy Gou · Four Tet",
    venue_id: "sonar-barcelona",
    date: "2026-06-20T22:00:00.000+02:00",
    genre: "Festival / Electrónica",
    price_min: 75,
    price_max: 195,
    active_rides_count: 22,
  },
  {
    id: "c_fib_2026",
    name: "FIB 2026 — Viernes",
    artist: "The Killers · Pulp · Arctic Monkeys",
    venue_id: "fib-benicassim",
    date: "2026-07-17T20:00:00.000+02:00",
    genre: "Festival / Indie / Rock",
    price_min: 75,
    price_max: 165,
    active_rides_count: 31,
  },
  {
    id: "c_bbk_2026",
    name: "Bilbao BBK Live 2026 — Sábado",
    artist: "Massive Attack · FKA twigs · Justice",
    venue_id: "bbk-live",
    date: "2026-07-11T19:00:00.000+02:00",
    genre: "Festival / Indie / Electrónica",
    price_min: 70,
    price_max: 170,
    active_rides_count: 19,
  },
  {
    id: "c_resurrection_2026",
    name: "Resurrection Fest 2026 — Día 2",
    artist: "Slipknot · Iron Maiden · Gojira",
    venue_id: "resurrection-viveiro",
    date: "2026-07-02T15:00:00.000+02:00",
    genre: "Festival / Metal",
    price_min: 85,
    price_max: 195,
    active_rides_count: 27,
  },
  {
    id: "c_arenal_2026",
    name: "Arenal Sound 2026 — Jueves",
    artist: "Quevedo · Saiko · Bad Gyal",
    venue_id: "arenal-sound",
    date: "2026-07-30T21:00:00.000+02:00",
    genre: "Festival / Urbano / Pop",
    price_min: 55,
    price_max: 130,
    active_rides_count: 44,
  },
  {
    id: "c_vinarock_2026",
    name: "Viña Rock 2026 — Sábado",
    artist: "Ska-P · La Polla Records · Boikot",
    venue_id: "vina-rock",
    date: "2026-05-01T18:00:00.000+02:00",
    genre: "Festival / Rock / Punk",
    price_min: 60,
    price_max: 130,
    active_rides_count: 38,
  },
  {
    id: "c_calamijas_2026",
    name: "Cala Mijas Fest 2026 — Sábado",
    artist: "Pulp · Phoenix · Fontaines D.C.",
    venue_id: "cala-mijas",
    date: "2026-08-29T19:00:00.000+02:00",
    genre: "Festival / Indie",
    price_min: 65,
    price_max: 150,
    active_rides_count: 11,
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

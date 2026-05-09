import type { Ride, TravelStats, FestivalHistoryEntry, Vibe } from "@concertride/types";
import type { StoreAdapter } from "../store/adapter";
import { FESTIVAL_LANDINGS } from "../../../web/src/lib/festivalLandings";

// Pure derivations from data the user already has access to (their rides
// + their trip memories). No new tables; recomputed on demand because the
// dataset per user is small enough.

const G_CO2_PER_KM = 120; // grams CO2 per km, average ICE car
const ASSUMED_RIDERS = 3; // we assume 3 passengers + driver, so saving 3 solo trips

// Approx route distance in km using haversine on origin + venue coords.
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function rideKm(r: Ride): number {
  if (!r.concert?.venue) return 0;
  const km = haversineKm(r.origin_lat, r.origin_lng, r.concert.venue.lat, r.concert.venue.lng);
  return r.round_trip ? km * 2 : km;
}

// Build a festival-name → slug map from the curated landings file. We
// match on artist name, festival name, and shortName — falling back to
// slug-form fingerprint for fuzzier matches.
function festivalSlugFor(concertName: string, artist: string): string | null {
  const needle = `${concertName} ${artist}`.toLowerCase();
  for (const f of FESTIVAL_LANDINGS) {
    const candidates = [f.name, f.shortName, f.slug.replace(/-/g, " ")];
    for (const c of candidates) {
      if (c && needle.includes(c.toLowerCase())) return f.slug;
    }
  }
  return null;
}

export async function computeTravelStats(
  store: StoreAdapter,
  userId: string,
  year: number = 0,
): Promise<TravelStats> {
  // 1. Rides as driver
  const driven = await store.listRides({ driver_id: userId }).catch(() => []);
  // 2. Rides as passenger (via confirmed requests)
  const reqs = await store.listRequestsByPassenger(userId).catch(() => []);
  const ridden = reqs.filter((r) => r.status === "confirmed").map((r) => r.ride);

  const inYear = (iso: string) => year === 0 || new Date(iso).getUTCFullYear() === year;

  const drivenInYear = driven.filter((r) => r.status === "completed" && inYear(r.completed_at ?? r.departure_time));
  const riddenInYear = ridden.filter((r) => r.status === "completed" && inYear(r.completed_at ?? r.departure_time));

  const allRides = [...drivenInYear, ...riddenInYear];
  const totalKm = Math.round(allRides.reduce((sum, r) => sum + rideKm(r), 0));
  const co2SavedKg = Math.round((totalKm * G_CO2_PER_KM * ASSUMED_RIDERS) / 1000);

  const artistSet = new Set<string>();
  const citySet = new Set<string>();
  const festivalSet = new Set<string>();
  const vibeDist: Record<Vibe, number> = { party: 0, chill: 0, mixed: 0 };
  const artistFreq: Record<string, number> = {};

  for (const r of allRides) {
    if (r.concert?.artist) {
      artistSet.add(r.concert.artist);
      artistFreq[r.concert.artist] = (artistFreq[r.concert.artist] ?? 0) + 1;
    }
    if (r.concert?.venue?.city) citySet.add(r.concert.venue.city);
    const fSlug = r.concert ? festivalSlugFor(r.concert.name ?? "", r.concert.artist ?? "") : null;
    if (fSlug) festivalSet.add(fSlug);
    vibeDist[r.vibe] += 1;
  }

  // Top crew — co-traveller frequency
  const crewMap = new Map<string, { user_id: string; name: string; avatar_url: string | null; rides_together: number }>();
  for (const r of drivenInYear) {
    const passengers = await store.listRequestsForRide(r.id).catch(() => []);
    for (const p of passengers) {
      if (p.status !== "confirmed") continue;
      const id = p.passenger_id;
      if (id === userId) continue;
      const existing = crewMap.get(id);
      if (existing) existing.rides_together += 1;
      else
        crewMap.set(id, {
          user_id: id,
          name: p.passenger?.name ?? "Viajero",
          avatar_url: p.passenger?.avatar_url ?? null,
          rides_together: 1,
        });
    }
  }
  for (const r of riddenInYear) {
    const id = r.driver_id;
    if (id === userId) continue;
    const existing = crewMap.get(id);
    if (existing) existing.rides_together += 1;
    else
      crewMap.set(id, {
        user_id: id,
        name: r.driver?.name ?? "Conductor",
        avatar_url: r.driver?.avatar_url ?? null,
        rides_together: 1,
      });
  }
  const topCrew = Array.from(crewMap.values())
    .sort((a, b) => b.rides_together - a.rides_together)
    .slice(0, 5);

  const topArtist = Object.entries(artistFreq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return {
    year,
    rides_as_driver: drivenInYear.length,
    rides_as_passenger: riddenInYear.length,
    total_km: totalKm,
    unique_artists: Array.from(artistSet),
    unique_cities: Array.from(citySet),
    unique_festivals: Array.from(festivalSet),
    co2_saved_kg: co2SavedKg,
    vibe_distribution: vibeDist,
    top_crew: topCrew,
    top_artist: topArtist,
  };
}

// Aggregates trip memories + completed rides per festival slug, so the
// /memorias page can show "Mad Cool — 3 ediciones, 4 vibe cards".
export async function computeFestivalHistory(
  store: StoreAdapter,
  userId: string,
): Promise<FestivalHistoryEntry[]> {
  const memories = await store.listTripMemoriesForUser(userId).catch(() => []);
  const driven = await store.listRides({ driver_id: userId }).catch(() => []);
  const reqs = await store.listRequestsByPassenger(userId).catch(() => []);
  const ridden = reqs.filter((r) => r.status === "confirmed").map((r) => r.ride);

  const buckets = new Map<string, FestivalHistoryEntry>();

  function noteAttendance(slug: string, name: string, dateISO: string) {
    const existing = buckets.get(slug);
    if (existing) {
      if (dateISO < existing.first_attended) existing.first_attended = dateISO;
      if (dateISO > existing.last_attended) existing.last_attended = dateISO;
      existing.times_attended += 1;
    } else {
      buckets.set(slug, {
        slug,
        name,
        first_attended: dateISO,
        last_attended: dateISO,
        times_attended: 1,
        memories: [],
      });
    }
  }

  // Memories carry concert metadata directly; use that first.
  for (const m of memories) {
    const slug = festivalSlugFor(m.concert_name ?? "", m.concert_artist ?? "");
    if (!slug) continue;
    const f = FESTIVAL_LANDINGS.find((x) => x.slug === slug);
    if (!f) continue;
    noteAttendance(slug, f.shortName, m.created_at);
    const bucket = buckets.get(slug);
    if (bucket) bucket.memories.push(m);
  }

  // Plus completed rides without a memory still count as attendance.
  for (const r of [...driven, ...ridden]) {
    if (r.status !== "completed") continue;
    const slug = r.concert ? festivalSlugFor(r.concert.name ?? "", r.concert.artist ?? "") : null;
    if (!slug) continue;
    const f = FESTIVAL_LANDINGS.find((x) => x.slug === slug);
    if (!f) continue;
    noteAttendance(slug, f.shortName, r.completed_at ?? r.departure_time);
  }

  return Array.from(buckets.values()).sort((a, b) => b.last_attended.localeCompare(a.last_attended));
}

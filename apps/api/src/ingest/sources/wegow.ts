import type { AdapterEnv, FetchOptions, RawConcert, SourceAdapter } from "../types";

// Wegow public REST API — discovered via JS bundle (API_URL = https://api.wegow.com/api).
// robots.txt: Allow: / for all bots. No auth required.
// Region code for Spain: "es" (from /api/regions/ endpoint).
const BASE = "https://api.wegow.com/api/events/";
const PAGE_SIZE = 100;
const THROTTLE_MS = 500; // courtesy delay between pages

interface WegowEvent {
  id: number;
  slug: string;
  title: string;
  permalink: string;
  start_date: string;
  end_date?: string;
  price?: number | null;
  image_url?: string | null;
  type: number; // 0=concert, 1=festival, 2=party, 3=session
  city?: {
    name?: string;
    country?: string;
    country_id?: number;
    iso_code?: string;
  };
  venue?: {
    name?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  artists?: {
    id: number;
    name: string;
  }[];
}

interface WegowResponse {
  events: WegowEvent[];
  next_page: number | null;
  count: number | null;
}

function normalize(ev: WegowEvent): RawConcert | null {
  const venueName = ev.venue?.name;
  const venueCity = ev.city?.name;
  if (!venueName || !venueCity || !ev.start_date) return null;

  // Only Spain events (country_id=1 or iso_code=ES) — region=es can sometimes
  // return nearby non-ES events.
  const isoCode = ev.city?.iso_code?.toUpperCase();
  const countryId = ev.city?.country_id;
  if (isoCode && isoCode !== "ES") return null;
  if (countryId && countryId !== 1) return null;

  const artist = ev.artists?.[0]?.name ?? ev.title;

  return {
    source: "wegow",
    source_event_id: String(ev.id),
    source_url: ev.permalink ?? `https://www.wegow.com/es/conciertos/${ev.slug}`,
    artist: artist.trim(),
    title: ev.title !== artist ? ev.title : null,
    venue_name: venueName.trim(),
    venue_city: venueCity,
    venue_lat: ev.venue?.latitude ?? null,
    venue_lng: ev.venue?.longitude ?? null,
    date_iso: ev.start_date,
    image_url: ev.image_url ?? null,
    price_min: ev.price ?? null,
    price_max: null,
    genre: null,
    fetched_at: new Date().toISOString(),
  };
}

export const wegow: SourceAdapter = {
  id: "wegow",
  tier: 1,
  displayName: "Wegow",
  mode: "api",
  legal: "public-api",
  async fetch(opts: FetchOptions, _env: AdapterEnv): Promise<RawConcert[]> {
    const fromDate = opts.fromDate.slice(0, 10);
    const toDate = opts.toDate.slice(0, 10);
    const all: RawConcert[] = [];
    const seen = new Set<string>();
    let page: number | null = 1;

    while (page !== null) {
      const url = new URL(BASE);
      url.searchParams.set("region", "es");
      url.searchParams.set("page", String(page));
      url.searchParams.set("page_size", String(PAGE_SIZE));
      url.searchParams.set("start_date", fromDate);
      url.searchParams.set("end_date", toDate);
      url.searchParams.set("ordering", "start_date");

      const res = await fetch(url.toString(), {
        headers: {
          "Accept": "application/json",
          "User-Agent": "ConcertRideESBot/1.0 (+https://concertride.es/bot)",
        },
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`wegow page=${page} ${res.status}: ${body.slice(0, 200)}`);
      }

      const json = (await res.json()) as WegowResponse;
      const events = json.events ?? [];

      for (const ev of events) {
        const key = String(ev.id);
        if (seen.has(key)) continue;
        seen.add(key);
        const raw = normalize(ev);
        if (raw) all.push(raw);
      }

      page = json.next_page ?? null;

      // Courtesy throttle between pages
      if (page !== null) {
        await new Promise((r) => setTimeout(r, THROTTLE_MS));
      }
    }

    return all;
  },
};

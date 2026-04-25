import type {
  AdapterEnv,
  FetchOptions,
  RawConcert,
  SourceAdapter,
} from "../types";

// https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
// DIS1035 constraint: (page * size) must be < 1000, so max 4 pages of 200.
// Fix: chunk the date range into monthly windows — each month has <200 events in ES.
const BASE = "https://app.ticketmaster.com/discovery/v2/events.json";
const PAGE_SIZE = 200;
const MAX_PAGES_PER_WINDOW = 4; // 4 × 200 = 800 < 1000 limit
// Exponential backoff delays for 429 responses (ms).
const BACKOFF_MS = [2_000, 4_000, 8_000];

interface TMResponse {
  _embedded?: {
    events?: TMEvent[];
  };
  page?: {
    totalPages?: number;
    number?: number;
  };
}

interface TMEvent {
  id: string;
  name: string;
  url?: string;
  images?: { url: string; width?: number; height?: number }[];
  dates?: {
    start?: {
      dateTime?: string;
      localDate?: string;
      localTime?: string;
      timezone?: string;
    };
  };
  classifications?: {
    segment?: { name?: string };
    genre?: { name?: string };
  }[];
  priceRanges?: {
    currency?: string;
    min?: number;
    max?: number;
  }[];
  _embedded?: {
    venues?: {
      name?: string;
      city?: { name?: string };
      location?: { latitude?: string; longitude?: string };
    }[];
    attractions?: { name?: string }[];
  };
}

function pickBestImage(imgs: TMEvent["images"]): string | null {
  if (!imgs || imgs.length === 0) return null;
  const sorted = [...imgs].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return sorted[0]?.url ?? null;
}

function normalize(ev: TMEvent): RawConcert | null {
  const venue = ev._embedded?.venues?.[0];
  const venueName = venue?.name;
  const venueCity = venue?.city?.name;
  const dateIso = ev.dates?.start?.dateTime;
  if (!venueName || !venueCity || !dateIso) return null;

  const attraction = ev._embedded?.attractions?.[0]?.name;
  const artist = (attraction ?? ev.name).trim();

  const lat = venue?.location?.latitude ? Number.parseFloat(venue.location.latitude) : null;
  const lng = venue?.location?.longitude ? Number.parseFloat(venue.location.longitude) : null;

  const price = ev.priceRanges?.find((p) => (p.currency ?? "EUR") === "EUR");
  const genre = ev.classifications?.[0]?.genre?.name ?? null;

  return {
    source: "ticketmaster",
    source_event_id: ev.id,
    source_url: ev.url ?? `https://www.ticketmaster.es/event/${ev.id}`,
    artist,
    title: ev.name && ev.name !== artist ? ev.name : null,
    venue_name: venueName,
    venue_city: venueCity,
    venue_lat: Number.isFinite(lat) ? lat : null,
    venue_lng: Number.isFinite(lng) ? lng : null,
    date_iso: dateIso,
    image_url: pickBestImage(ev.images),
    price_min: price?.min ?? null,
    price_max: price?.max ?? null,
    genre,
    fetched_at: new Date().toISOString(),
  };
}

// Split [fromDate, toDate] into month-sized windows to stay under DIS1035 limit.
function monthWindows(from: string, to: string): { start: string; end: string }[] {
  const windows: { start: string; end: string }[] = [];
  const cursor = new Date(from);
  cursor.setUTCDate(1);
  cursor.setUTCHours(0, 0, 0, 0);
  const endDate = new Date(to);

  while (cursor <= endDate) {
    const windowStart = new Date(cursor);
    // Last moment of the month.
    const windowEnd = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0, 23, 59, 59));
    windows.push({
      start: toTMDate(windowStart.toISOString()),
      end: toTMDate(windowEnd < endDate ? windowEnd.toISOString() : to),
    });
    // Advance to next month.
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return windows;
}

export const ticketmaster: SourceAdapter = {
  id: "ticketmaster",
  tier: 1,
  displayName: "Ticketmaster ES",
  mode: "api",
  legal: "public-api",
  async fetch(opts: FetchOptions, env: AdapterEnv): Promise<RawConcert[]> {
    if (!env.TICKETMASTER_API_KEY) {
      console.log("ticketmaster: skipped (no TICKETMASTER_API_KEY)");
      return [];
    }

    const all: RawConcert[] = [];
    const seen = new Set<string>(); // guard against cross-window dupes at month boundaries
    const windows = monthWindows(opts.fromDate, opts.toDate);

    for (const window of windows) {
      for (let page = 0; page < MAX_PAGES_PER_WINDOW; page++) {
        const url = new URL(BASE);
        url.searchParams.set("apikey", env.TICKETMASTER_API_KEY);
        url.searchParams.set("countryCode", "ES");
        url.searchParams.set("segmentName", "Music"); // locale=es-es breaks segmentName, so omit locale
        url.searchParams.set("size", String(PAGE_SIZE));
        url.searchParams.set("page", String(page));
        url.searchParams.set("startDateTime", window.start);
        url.searchParams.set("endDateTime", window.end);
        url.searchParams.set("sort", "date,asc");

        let res = await fetch(url.toString(), {
          headers: { "User-Agent": "ConcertRideESBot/1.0 (+https://concertride.me/bot)" },
        });
        // Exponential backoff on 429.
        for (let attempt = 0; res.status === 429 && attempt < BACKOFF_MS.length; attempt++) {
          const delay = BACKOFF_MS[attempt];
          console.warn(`ticketmaster: 429 on ${window.start} page ${page}, retrying in ${delay}ms`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          res = await fetch(url.toString(), {
            headers: { "User-Agent": "ConcertRideESBot/1.0 (+https://concertride.me/bot)" },
          });
        }
        if (res.status === 429) {
          console.warn("ticketmaster: rate limited after all retries, stopping");
          break;
        }
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          throw new Error(`ticketmaster ${res.status}: ${body.slice(0, 200)}`);
        }
        const json = (await res.json()) as TMResponse;
        const events = json._embedded?.events ?? [];
        for (const ev of events) {
          if (seen.has(ev.id)) continue;
          seen.add(ev.id);
          const raw = normalize(ev);
          if (raw) all.push(raw);
        }
        const totalPages = json.page?.totalPages ?? 0;
        if (events.length < PAGE_SIZE) break;
        if (page + 1 >= totalPages) break;
      }
    }
    return all;
  },
};

// Ticketmaster expects YYYY-MM-DDTHH:mm:ssZ (UTC, no ms).
function toTMDate(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().replace(/\.\d{3}Z$/, "Z");
}

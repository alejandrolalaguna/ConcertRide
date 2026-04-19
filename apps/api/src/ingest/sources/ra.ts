import type { AdapterEnv, FetchOptions, RawConcert, SourceAdapter } from "../types";

// RA.co public GraphQL endpoint — no auth required as of 2026-04-19.
// Spain area IDs verified via introspection: Barcelona=20, Madrid=41, Valencia=607, Bilbao=612.
// RA is electronic/club-focused; events complement Ticketmaster's mainstream coverage.
const ENDPOINT = "https://ra.co/graphql";
const PAGE_SIZE = 100; // RA doesn't document a max; 100 is a safe ceiling.
const SPAIN_AREAS = [20, 41, 607, 612]; // Barcelona, Madrid, Valencia, Bilbao

interface RAListing {
  id: string;
  event: {
    title: string;
    date: string; // ISO date string
    startTime?: string;
    venue?: {
      name?: string;
      address?: string;
      location?: { latitude?: number; longitude?: number };
    };
    images?: { filename?: string }[];
    artists?: { name?: string }[];
  } | null;
}

interface RAResponse {
  data?: {
    eventListings?: {
      data?: RAListing[];
    };
  };
  errors?: { message: string }[];
}

// RA uses a custom DateTime scalar — variables must be declared as DateTime!, not String!.
const QUERY = `
  query BackfillES($areaId: Int!, $from: DateTime!, $to: DateTime!, $page: Int!) {
    eventListings(
      filters: { areas: { eq: $areaId }, listingDate: { gte: $from, lte: $to } }
      pageSize: ${PAGE_SIZE}
      page: $page
    ) {
      data {
        id
        event {
          title
          date
          startTime
          venue {
            name
            address
            location { latitude longitude }
          }
          images { filename }
          artists { name }
        }
      }
    }
  }
`;

function parseCityFromAddress(address: string | undefined): string | null {
  if (!address) return null;
  // RA addresses are typically "Street, City, Country" — take the second-to-last segment.
  const parts = address.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) return parts[parts.length - 2] ?? null;
  return parts[0] ?? null;
}

function normalize(listing: RAListing, areaName: string): RawConcert | null {
  const ev = listing.event;
  if (!ev) return null;

  const venueName = ev.venue?.name;
  const dateIso = ev.date || ev.startTime;
  if (!venueName || !dateIso) return null;

  const venueCity = parseCityFromAddress(ev.venue?.address) ?? areaName;
  const artistName = ev.artists?.[0]?.name ?? ev.title;

  const lat = ev.venue?.location?.latitude ?? null;
  const lng = ev.venue?.location?.longitude ?? null;

  const imageFilename = ev.images?.[0]?.filename;
  const imageUrl = imageFilename ? `https://ra.co${imageFilename}` : null;

  return {
    source: "ra",
    source_event_id: listing.id,
    source_url: `https://ra.co/events/${listing.id}`,
    artist: artistName.trim(),
    title: ev.title !== artistName ? ev.title : null,
    venue_name: venueName.trim(),
    venue_city: venueCity,
    venue_lat: typeof lat === "number" ? lat : null,
    venue_lng: typeof lng === "number" ? lng : null,
    date_iso: dateIso,
    image_url: imageUrl,
    price_min: null,
    price_max: null,
    genre: "Electronic",
    fetched_at: new Date().toISOString(),
  };
}

const AREA_NAMES: Record<number, string> = {
  20: "Barcelona",
  41: "Madrid",
  607: "Valencia",
  612: "Bilbao",
};

export const ra: SourceAdapter = {
  id: "ra",
  tier: 1,
  displayName: "Resident Advisor",
  mode: "api",
  legal: "public-api",
  async fetch(opts: FetchOptions, _env: AdapterEnv): Promise<RawConcert[]> {
    // RA DateTime scalar accepts full ISO-8601 strings.
    const from = opts.fromDate.length === 10 ? `${opts.fromDate}T00:00:00.000Z` : opts.fromDate;
    const to = opts.toDate.length === 10 ? `${opts.toDate}T23:59:59.000Z` : opts.toDate;
    const all: RawConcert[] = [];
    const seen = new Set<string>(); // dedupe across areas

    for (const areaId of SPAIN_AREAS) {
      const areaName = AREA_NAMES[areaId] ?? "Spain";
      let page = 1;

      while (true) {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "ConcertRideESBot/1.0 (+https://concertride.es/bot)",
          },
          body: JSON.stringify({ query: QUERY, variables: { areaId, from, to, page } }),
        });

        if (!res.ok) {
          const body = await res.text().catch(() => "");
          throw new Error(`ra area=${areaId} page=${page} ${res.status}: ${body.slice(0, 200)}`);
        }

        const json = (await res.json()) as RAResponse;
        if (json.errors?.length) {
          throw new Error(`ra graphql errors: ${json.errors.map((e) => e.message).join("; ")}`);
        }

        const listings = json.data?.eventListings?.data ?? [];
        for (const listing of listings) {
          if (seen.has(listing.id)) continue;
          seen.add(listing.id);
          const raw = normalize(listing, areaName);
          if (raw) all.push(raw);
        }

        if (listings.length < PAGE_SIZE) break;
        page++;
      }
    }

    return all;
  },
};

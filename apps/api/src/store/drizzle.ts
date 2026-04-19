// Drizzle-backed StoreAdapter. Activated when TURSO_DATABASE_URL is set.
//
// NOTE (M4c): Queries are typed and type-check cleanly, but full runtime
// integration testing requires a real Turso instance — see
// apps/api/scripts/seed.ts for the bring-up flow.

import { createClient } from "@libsql/client/web";
import { and, desc, eq, gte, like, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import type {
  Concert,
  CreateConcertInput,
  CreateRideRequest,
  RequestStatus,
  Ride,
  RideRequest,
  User,
  Venue,
} from "@concertride/types";
import type { Env } from "../env";
import * as schema from "../db/schema";
import type { RawConcert, SourceId } from "../ingest/types";
import { computeFingerprint } from "../lib/fingerprint";
import type {
  ConcertFilters,
  CreateRequestResult,
  RideFilters,
  StoreAdapter,
  UpsertConcertResult,
} from "./adapter";

function normalizeVenueName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

interface SourceEntry {
  source: SourceId;
  source_event_id: string;
  source_url: string;
}

function mergeSources(existing: string, add: SourceEntry): string {
  let parsed: SourceEntry[] = [];
  try {
    const raw = JSON.parse(existing);
    if (Array.isArray(raw)) parsed = raw as SourceEntry[];
  } catch {
    /* fall through */
  }
  const hit = parsed.find(
    (s) => s.source === add.source && s.source_event_id === add.source_event_id,
  );
  if (!hit) parsed.push(add);
  return JSON.stringify(parsed);
}

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

type VenueRow = schema.VenueRow;
type UserRow = schema.UserRow;
type ConcertWith = schema.ConcertRow & { venue: VenueRow | null };
type RideWith = schema.RideRow & {
  driver: UserRow | null;
  concert: ConcertWith | null;
};
type RequestWith = schema.RideRequestRow & { passenger: UserRow | null };

function hydrateVenue(row: VenueRow): Venue {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    capacity: row.capacity,
    image_url: row.image_url,
  };
}

function hydrateUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatar_url: row.avatar_url,
    verified: row.verified,
    rating: row.rating,
    rating_count: row.rating_count,
    car_model: row.car_model,
    car_color: row.car_color,
    rides_given: row.rides_given,
    created_at: row.created_at,
  };
}

function hydrateConcert(row: ConcertWith, activeRidesCount = 0): Concert {
  if (!row.venue) throw new Error(`Concert ${row.id} missing venue join`);
  return {
    id: row.id,
    name: row.name,
    artist: row.artist,
    venue_id: row.venue_id,
    venue: hydrateVenue(row.venue),
    date: row.date,
    image_url: row.image_url,
    ticketmaster_id: row.ticketmaster_id,
    genre: row.genre,
    price_min: row.price_min,
    price_max: row.price_max,
    active_rides_count: activeRidesCount,
  };
}

function hydrateRide(row: RideWith): Ride {
  if (!row.driver) throw new Error(`Ride ${row.id} missing driver join`);
  if (!row.concert) throw new Error(`Ride ${row.id} missing concert join`);
  return {
    id: row.id,
    driver_id: row.driver_id,
    driver: hydrateUser(row.driver),
    concert_id: row.concert_id,
    concert: hydrateConcert(row.concert),
    origin_city: row.origin_city,
    origin_lat: row.origin_lat,
    origin_lng: row.origin_lng,
    origin_address: row.origin_address,
    departure_time: row.departure_time,
    price_per_seat: row.price_per_seat,
    seats_total: row.seats_total,
    seats_left: row.seats_left,
    round_trip: row.round_trip,
    return_time: row.return_time,
    playlist_url: row.playlist_url,
    vibe: row.vibe,
    notes: row.notes,
    status: row.status,
    created_at: row.created_at,
  };
}

function hydrateRequest(row: RequestWith): RideRequest {
  if (!row.passenger) throw new Error(`Request ${row.id} missing passenger join`);
  return {
    id: row.id,
    ride_id: row.ride_id,
    passenger_id: row.passenger_id,
    passenger: hydrateUser(row.passenger),
    seats: row.seats,
    status: row.status,
    message: row.message,
    created_at: row.created_at,
  };
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  return (
    local
      .replace(/[._-]+/g, " ")
      .trim()
      .split(/\s+/)
      .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : ""))
      .join(" ") || "Viajero"
  );
}

export class DrizzleStore implements StoreAdapter {
  constructor(private db: DrizzleDb) {}

  async getUser(id: string): Promise<User | null> {
    const row = await this.db.query.users.findFirst({ where: eq(schema.users.id, id) });
    return row ? hydrateUser(row) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const row = await this.db.query.users.findFirst({
      where: eq(schema.users.email, email.toLowerCase()),
    });
    return row ? hydrateUser(row) : null;
  }

  async upsertUserByEmail(email: string): Promise<User> {
    const existing = await this.getUserByEmail(email);
    if (existing) return existing;
    const row = {
      id: `u_${crypto.randomUUID().slice(0, 8)}`,
      email: email.toLowerCase(),
      name: nameFromEmail(email),
      avatar_url: null as string | null,
      verified: false,
      rating: 0,
      rating_count: 0,
      car_model: null as string | null,
      car_color: null as string | null,
      rides_given: 0,
      password_hash: null as string | null,
      password_salt: null as string | null,
      created_at: new Date().toISOString(),
    };
    await this.db.insert(schema.users).values(row);
    return hydrateUser(row as UserRow);
  }

  async createUserWithPassword(
    email: string,
    name: string,
    hash: string,
    salt: string,
  ): Promise<User> {
    const row = {
      id: `u_${crypto.randomUUID().slice(0, 8)}`,
      email: email.toLowerCase(),
      name,
      avatar_url: null as string | null,
      verified: false,
      rating: 0,
      rating_count: 0,
      car_model: null as string | null,
      car_color: null as string | null,
      rides_given: 0,
      password_hash: hash,
      password_salt: salt,
      created_at: new Date().toISOString(),
    };
    await this.db.insert(schema.users).values(row);
    return hydrateUser(row as UserRow);
  }

  async getPasswordHash(userId: string): Promise<{ hash: string; salt: string } | null> {
    const row = await this.db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });
    if (!row || !row.password_hash || !row.password_salt) return null;
    return { hash: row.password_hash, salt: row.password_salt };
  }

  async listVenues(): Promise<Venue[]> {
    const rows = await this.db.select().from(schema.venues).orderBy(schema.venues.name);
    return rows.map(hydrateVenue);
  }

  async ensureVenue(input: {
    name: string;
    city: string;
    lat: number | null;
    lng: number | null;
  }): Promise<Venue> {
    const normName = normalizeVenueName(input.name);
    const normCity = input.city.trim().toLowerCase();
    const all = await this.db.select().from(schema.venues);
    const match = all.find(
      (v) => normalizeVenueName(v.name) === normName && v.city.toLowerCase() === normCity,
    );
    if (match) return hydrateVenue(match);

    const id = `v_${crypto.randomUUID().slice(0, 8)}`;
    const row = {
      id,
      name: input.name,
      city: input.city,
      address: "",
      lat: input.lat ?? 0,
      lng: input.lng ?? 0,
      capacity: null,
      image_url: null,
      created_at: new Date().toISOString(),
    };
    await this.db.insert(schema.venues).values(row);
    return hydrateVenue(row);
  }

  async listConcerts(f: ConcertFilters): Promise<{ concerts: Concert[]; total: number }> {
    const clauses = [];
    if (f.artist) clauses.push(like(schema.concerts.artist, `%${f.artist}%`));
    if (f.date_from) clauses.push(gte(schema.concerts.date, f.date_from));
    if (f.date_to) clauses.push(lte(schema.concerts.date, f.date_to));
    const where = clauses.length ? and(...clauses) : undefined;

    const all = await this.db.query.concerts.findMany({
      where,
      with: { venue: true },
      orderBy: (c, { asc }) => [asc(c.date)],
    });

    const filtered = f.city
      ? all.filter((c) => c.venue?.city.toLowerCase() === f.city!.toLowerCase())
      : all;

    const total = filtered.length;
    const page = filtered
      .slice(f.offset, f.offset + f.limit)
      .map((c) => hydrateConcert(c));
    return { concerts: page, total };
  }

  async getConcert(id: string): Promise<Concert | null> {
    const row = await this.db.query.concerts.findFirst({
      where: eq(schema.concerts.id, id),
      with: { venue: true },
    });
    return row ? hydrateConcert(row) : null;
  }

  async createConcert(input: CreateConcertInput): Promise<Concert> {
    const venue = await this.ensureVenue({
      name: input.venue_name,
      city: input.venue_city,
      lat: null,
      lng: null,
    });
    const id = `c_adhoc_${crypto.randomUUID().slice(0, 8)}`;
    const fingerprint = `${input.artist.toLowerCase()}|${input.venue_city.toLowerCase()}|${input.date.slice(0, 10)}`;
    await this.db.insert(schema.concerts).values({
      id,
      name: input.name,
      artist: input.artist,
      venue_id: venue.id,
      date: input.date,
      image_url: null,
      ticketmaster_id: null,
      genre: input.genre ?? null,
      price_min: null,
      price_max: null,
      fingerprint,
      sources_json: "[]",
      created_at: new Date().toISOString(),
    });
    const row = await this.db.query.concerts.findFirst({
      where: eq(schema.concerts.id, id),
      with: { venue: true },
    });
    if (!row) throw new Error(`Concert ${id} missing after insert`);
    return hydrateConcert(row);
  }

  async upsertConcertFromIngest(
    raw: RawConcert,
    venueId: string,
  ): Promise<UpsertConcertResult> {
    const fingerprint = await computeFingerprint(raw.artist, raw.venue_city, raw.date_iso);
    const sourceRef: SourceEntry = {
      source: raw.source,
      source_event_id: raw.source_event_id,
      source_url: raw.source_url,
    };

    return await this.db.transaction(async (tx) => {
      const existing = await tx.query.concerts.findFirst({
        where: eq(schema.concerts.fingerprint, fingerprint),
      });
      if (existing) {
        const newPriceMin =
          raw.price_min !== null &&
          (existing.price_min === null || raw.price_min < existing.price_min)
            ? raw.price_min
            : existing.price_min;
        const newPriceMax =
          raw.price_max !== null &&
          (existing.price_max === null || raw.price_max > existing.price_max)
            ? raw.price_max
            : existing.price_max;
        const newImage = raw.image_url && !existing.image_url ? raw.image_url : existing.image_url;
        await tx
          .update(schema.concerts)
          .set({
            sources_json: mergeSources(existing.sources_json, sourceRef),
            price_min: newPriceMin,
            price_max: newPriceMax,
            image_url: newImage,
          })
          .where(eq(schema.concerts.id, existing.id));
        return { concert_id: existing.id, is_new: false };
      }

      const id = `c_${crypto.randomUUID().slice(0, 10)}`;
      await tx.insert(schema.concerts).values({
        id,
        name: raw.title ?? raw.artist,
        artist: raw.artist,
        venue_id: venueId,
        date: raw.date_iso,
        image_url: raw.image_url,
        ticketmaster_id: raw.source === "ticketmaster" ? raw.source_event_id : null,
        genre: raw.genre,
        price_min: raw.price_min,
        price_max: raw.price_max,
        fingerprint,
        sources_json: JSON.stringify([sourceRef]),
        created_at: new Date().toISOString(),
      });
      return { concert_id: id, is_new: true };
    });
  }

  async listRides(f: RideFilters): Promise<Ride[]> {
    const clauses = [];
    if (f.concert_id) clauses.push(eq(schema.rides.concert_id, f.concert_id));
    if (f.vibe) clauses.push(eq(schema.rides.vibe, f.vibe));
    if (f.round_trip !== undefined) clauses.push(eq(schema.rides.round_trip, f.round_trip));
    if (f.max_price !== undefined) clauses.push(lte(schema.rides.price_per_seat, f.max_price));
    const where = clauses.length ? and(...clauses) : undefined;

    const rows = await this.db.query.rides.findMany({
      where,
      with: {
        driver: true,
        concert: { with: { venue: true } },
      },
      orderBy: (r, { asc }) => [asc(r.departure_time)],
    });

    let filtered = f.origin_city
      ? rows.filter((r) => r.origin_city.toLowerCase() === f.origin_city!.toLowerCase())
      : rows;

    if (f.adhoc !== undefined) {
      filtered = filtered.filter((r) => {
        const isAdhoc =
          r.concert?.ticketmaster_id === null &&
          r.concert?.sources_json === "[]" &&
          r.concert?.id.startsWith("c_adhoc_");
        return f.adhoc ? isAdhoc : !isAdhoc;
      });
    }

    return filtered.map(hydrateRide);
  }

  async getRide(id: string): Promise<Ride | null> {
    const row = await this.db.query.rides.findFirst({
      where: eq(schema.rides.id, id),
      with: {
        driver: true,
        concert: { with: { venue: true } },
      },
    });
    return row ? hydrateRide(row) : null;
  }

  async createRide(driver: User, concert: Concert, input: CreateRideRequest): Promise<Ride> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await this.db.insert(schema.rides).values({
      id,
      driver_id: driver.id,
      concert_id: concert.id,
      origin_city: input.origin_city,
      origin_lat: input.origin_lat,
      origin_lng: input.origin_lng,
      origin_address: input.origin_address,
      departure_time: input.departure_time,
      price_per_seat: input.price_per_seat,
      seats_total: input.seats_total,
      seats_left: input.seats_total,
      round_trip: input.round_trip,
      return_time: input.return_time ?? null,
      playlist_url: input.playlist_url ?? null,
      vibe: input.vibe,
      notes: input.notes ?? null,
      status: "active",
      created_at: now,
    });
    const created = await this.getRide(id);
    if (!created) throw new Error(`Ride ${id} missing after insert`);
    return created;
  }

  async listRequestsForRide(rideId: string): Promise<RideRequest[]> {
    const rows = await this.db.query.rideRequests.findMany({
      where: eq(schema.rideRequests.ride_id, rideId),
      with: { passenger: true },
      orderBy: (r) => [desc(r.created_at)],
    });
    return rows.map(hydrateRequest);
  }

  async getRequest(id: string): Promise<RideRequest | null> {
    const row = await this.db.query.rideRequests.findFirst({
      where: eq(schema.rideRequests.id, id),
      with: { passenger: true },
    });
    return row ? hydrateRequest(row) : null;
  }

  async createRequest(
    ride: Ride,
    passenger: User,
    seats: number,
    message?: string,
  ): Promise<CreateRequestResult> {
    // Re-read ride inside a transaction so concurrent requests can't
    // double-book the last seat.
    return await this.db.transaction(async (tx) => {
      const current = await tx.query.rides.findFirst({ where: eq(schema.rides.id, ride.id) });
      if (!current) return { error: "ride_not_found" };
      if (passenger.id === current.driver_id) return { error: "cannot_request_own_ride" };
      if (current.status !== "active") return { error: "ride_not_active" };
      if (seats > current.seats_left) return { error: "not_enough_seats" };

      const existing = await tx.query.rideRequests.findFirst({
        where: and(
          eq(schema.rideRequests.ride_id, ride.id),
          eq(schema.rideRequests.passenger_id, passenger.id),
          eq(schema.rideRequests.status, "pending"),
        ),
      });
      if (existing) return { error: "already_requested" };

      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await tx.insert(schema.rideRequests).values({
        id,
        ride_id: ride.id,
        passenger_id: passenger.id,
        seats,
        status: "pending",
        message: message ?? null,
        created_at: now,
      });

      const hydrated: RideRequest = {
        id,
        ride_id: ride.id,
        passenger_id: passenger.id,
        passenger,
        seats,
        status: "pending",
        message: message ?? null,
        created_at: now,
      };
      return { request: hydrated };
    });
  }

  async updateRequestStatus(
    requestId: string,
    status: RequestStatus,
  ): Promise<RideRequest | null> {
    return await this.db.transaction(async (tx) => {
      const existing = await tx.query.rideRequests.findFirst({
        where: eq(schema.rideRequests.id, requestId),
      });
      if (!existing) return null;

      await tx
        .update(schema.rideRequests)
        .set({ status })
        .where(eq(schema.rideRequests.id, requestId));

      if (status === "confirmed" && existing.status !== "confirmed") {
        const ride = await tx.query.rides.findFirst({
          where: eq(schema.rides.id, existing.ride_id),
        });
        if (ride) {
          const seatsLeft = Math.max(0, ride.seats_left - existing.seats);
          await tx
            .update(schema.rides)
            .set({
              seats_left: seatsLeft,
              status: seatsLeft === 0 ? "full" : ride.status,
            })
            .where(eq(schema.rides.id, ride.id));
        }
      }

      const refreshed = await tx.query.rideRequests.findFirst({
        where: eq(schema.rideRequests.id, requestId),
        with: { passenger: true },
      });
      return refreshed ? hydrateRequest(refreshed) : null;
    });
  }

  async recordSource(entry: {
    source: SourceId;
    source_event_id: string;
    source_url: string;
    concert_id: string | null;
    raw_json: string;
  }): Promise<void> {
    const existing = await this.db.query.concertSources.findFirst({
      where: and(
        eq(schema.concertSources.source, entry.source),
        eq(schema.concertSources.source_event_id, entry.source_event_id),
      ),
    });
    const now = new Date().toISOString();
    if (existing) {
      await this.db
        .update(schema.concertSources)
        .set({
          source_url: entry.source_url,
          concert_id: entry.concert_id,
          raw_json: entry.raw_json,
          fetched_at: now,
        })
        .where(eq(schema.concertSources.id, existing.id));
      return;
    }
    await this.db.insert(schema.concertSources).values({
      id: `s_${crypto.randomUUID().slice(0, 10)}`,
      source: entry.source,
      source_event_id: entry.source_event_id,
      source_url: entry.source_url,
      concert_id: entry.concert_id,
      raw_json: entry.raw_json,
      fetched_at: now,
    });
  }

  async createReview(): Promise<{ error: string }> {
    throw new Error("adapter_not_implemented:createReview");
  }

  async listReviewsForRide(): Promise<never[]> {
    throw new Error("adapter_not_implemented:listReviewsForRide");
  }

  async listReviewsForUser(): Promise<never[]> {
    throw new Error("adapter_not_implemented:listReviewsForUser");
  }
}

export function createDrizzleStore(env: Env): StoreAdapter {
  const client = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });
  const db = drizzle(client, { schema });
  return new DrizzleStore(db);
}

// Expose the fingerprint util via drizzle store so M5 ingestion can dedup
// without re-importing the lib helper.
export { computeFingerprint };

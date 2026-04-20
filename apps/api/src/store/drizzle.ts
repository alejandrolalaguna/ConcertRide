// Drizzle-backed StoreAdapter. Activated when TURSO_DATABASE_URL is set.
//
// NOTE (M4c): Queries are typed and type-check cleanly, but full runtime
// integration testing requires a real Turso instance — see
// apps/api/scripts/seed.ts for the bring-up flow.

import { createClient } from "@libsql/client/web";
import { and, avg, count, desc, eq, gte, like, lte, lt, notInArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import type {
  Concert,
  CreateConcertInput,
  CreateReviewRequest,
  CreateRideRequest,
  DemandSignal,
  Message,
  RequestStatus,
  Review,
  Ride,
  RideRequest,
  UpdateProfileInput,
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

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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
    phone: row.phone ?? null,
    home_city: row.home_city ?? null,
    smoker: row.smoker ?? null,
    has_license: row.has_license ?? null,
    created_at: row.created_at,
  };
}

function hydrateConcert(row: ConcertWith, activeRidesCount = 0, demandCount?: number): Concert {
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
    ticketmaster_url: row.ticketmaster_url ?? null,
    genre: row.genre,
    price_min: row.price_min,
    price_max: row.price_max,
    active_rides_count: activeRidesCount,
    demand_count: demandCount,
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
    smoking_policy: row.smoking_policy,
    max_luggage: row.max_luggage,
    notes: row.notes,
    instant_booking: row.instant_booking,
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
    luggage: (row.luggage as RideRequest["luggage"]) ?? null,
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
    profile?: { phone?: string; home_city?: string; smoker?: boolean; has_license?: boolean },
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
      phone: profile?.phone ?? null,
      home_city: profile?.home_city ?? null,
      smoker: profile?.smoker ?? null,
      has_license: profile?.has_license ?? null,
      password_hash: hash,
      password_salt: salt,
      created_at: new Date().toISOString(),
    };
    await this.db.insert(schema.users).values(row);
    return hydrateUser(row as UserRow);
  }

  async updateUser(id: string, input: UpdateProfileInput): Promise<User | null> {
    const patch: Partial<typeof schema.users.$inferInsert> = {};
    if (input.name !== undefined) patch.name = input.name;
    if (input.phone !== undefined) patch.phone = input.phone;
    if (input.home_city !== undefined) patch.home_city = input.home_city;
    if (input.smoker !== undefined) patch.smoker = input.smoker;
    if (input.has_license !== undefined) patch.has_license = input.has_license;
    if (input.car_model !== undefined) patch.car_model = input.car_model;
    if (input.car_color !== undefined) patch.car_color = input.car_color;
    if (Object.keys(patch).length === 0) return this.getUser(id);
    await this.db.update(schema.users).set(patch).where(eq(schema.users.id, id));
    return this.getUser(id);
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
    if (f.city) clauses.push(sql`lower(${schema.venues.city}) = lower(${f.city})`);
    const where = clauses.length ? and(...clauses) : undefined;

    // COUNT query — join venues so city filter works in SQL
    const [countRow] = await this.db
      .select({ total: count() })
      .from(schema.concerts)
      .innerJoin(schema.venues, eq(schema.concerts.venue_id, schema.venues.id))
      .where(where);
    const total = countRow?.total ?? 0;

    // Page query — only fetch the requested slice
    const pageRows = await this.db.query.concerts.findMany({
      where: clauses.length ? and(...clauses) : undefined,
      with: { venue: true },
      orderBy: (c, { asc }) => [asc(c.date)],
      limit: f.limit,
      offset: f.offset,
    });

    // Batch demand counts for the current page
    const now = new Date().toISOString();
    const demandRows = pageRows.length
      ? await this.db
          .select({ concert_id: schema.demandSignals.concert_id, cnt: count() })
          .from(schema.demandSignals)
          .where(gte(schema.demandSignals.expires_at, now))
          .groupBy(schema.demandSignals.concert_id)
      : [];
    const demandMap = new Map(demandRows.map((r) => [r.concert_id, r.cnt]));

    const page = pageRows.map((c) => hydrateConcert(c, 0, demandMap.get(c.id) ?? 0));
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
      ticketmaster_url: null,
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
        const newTmUrl =
          raw.source === "ticketmaster" && !existing.ticketmaster_url
            ? raw.source_url
            : existing.ticketmaster_url;
        await tx
          .update(schema.concerts)
          .set({
            sources_json: mergeSources(existing.sources_json, sourceRef),
            price_min: newPriceMin,
            price_max: newPriceMax,
            image_url: newImage,
            ticketmaster_url: newTmUrl,
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
        ticketmaster_url: raw.source === "ticketmaster" ? raw.source_url : null,
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

    if (f.near_lat !== undefined && f.near_lng !== undefined && f.radius_km !== undefined) {
      filtered = filtered.filter(
        (r) => haversineKm(f.near_lat!, f.near_lng!, r.origin_lat, r.origin_lng) <= f.radius_km!,
      );
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
      smoking_policy: input.smoking_policy ?? "no",
      max_luggage: input.max_luggage ?? "backpack",
      notes: input.notes ?? null,
      instant_booking: input.instant_booking ?? false,
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
    luggage?: string,
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
      const luggageVal = (luggage ?? null) as RideRequest["luggage"];
      await tx.insert(schema.rideRequests).values({
        id,
        ride_id: ride.id,
        passenger_id: passenger.id,
        seats,
        status: "pending",
        message: message ?? null,
        luggage: luggageVal,
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
        luggage: luggageVal,
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

  async deletePastConcerts(beforeDate: string): Promise<number> {
    // Find concerts older than beforeDate that have no rides at all
    const concertsWithRides = await this.db
      .selectDistinct({ concert_id: schema.rides.concert_id })
      .from(schema.rides);
    const busyIds = concertsWithRides.map((r) => r.concert_id);

    const where = busyIds.length
      ? and(lt(schema.concerts.date, beforeDate), notInArray(schema.concerts.id, busyIds))
      : lt(schema.concerts.date, beforeDate);

    const toDelete = await this.db
      .select({ id: schema.concerts.id })
      .from(schema.concerts)
      .where(where);

    if (toDelete.length === 0) return 0;

    const ids = toDelete.map((r) => r.id);
    // Delete dependent rows first (FK constraints)
    await this.db.delete(schema.concertSources).where(
      notInArray(schema.concertSources.concert_id, ["__none__"]) &&
      // use the ids set
      sql`${schema.concertSources.concert_id} IN (${sql.join(ids.map((id) => sql`${id}`), sql`, `)})`,
    );
    await this.db.delete(schema.demandSignals).where(
      sql`${schema.demandSignals.concert_id} IN (${sql.join(ids.map((id) => sql`${id}`), sql`, `)})`,
    );
    await this.db.delete(schema.concerts).where(
      sql`${schema.concerts.id} IN (${sql.join(ids.map((id) => sql`${id}`), sql`, `)})`,
    );
    return ids.length;
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

  async getDemandSignal(concertId: string, userId: string | null): Promise<DemandSignal> {
    const now = new Date().toISOString();
    const rows = await this.db.query.demandSignals.findMany({
      where: and(eq(schema.demandSignals.concert_id, concertId), gte(schema.demandSignals.expires_at, now)),
    });
    const user_has_signaled = userId ? rows.some((r) => r.user_id === userId) : false;
    return { count: rows.length, user_has_signaled };
  }

  async toggleDemandSignal(concertId: string, user: User): Promise<DemandSignal> {
    const now = new Date().toISOString();
    const concert = await this.getConcert(concertId);
    const existing = await this.db.query.demandSignals.findFirst({
      where: and(
        eq(schema.demandSignals.concert_id, concertId),
        eq(schema.demandSignals.user_id, user.id),
      ),
    });
    if (existing) {
      await this.db.delete(schema.demandSignals).where(eq(schema.demandSignals.id, existing.id));
    } else {
      // Expire 48h before concert date or 48h from now, whichever is sooner
      const concertDate = concert ? new Date(concert.date) : null;
      const fortyEightHoursFromNow = new Date(Date.now() + 48 * 3600 * 1000);
      const expires =
        concertDate && concertDate < fortyEightHoursFromNow ? concertDate : fortyEightHoursFromNow;
      await this.db.insert(schema.demandSignals).values({
        id: `ds_${crypto.randomUUID().slice(0, 10)}`,
        concert_id: concertId,
        user_id: user.id,
        created_at: now,
        expires_at: expires.toISOString(),
      });
    }
    return this.getDemandSignal(concertId, user.id);
  }

  async listMessages(scope: { ride_id: string } | { concert_id: string }): Promise<Message[]> {
    const where =
      "ride_id" in scope
        ? eq(schema.messages.ride_id, scope.ride_id)
        : eq(schema.messages.concert_id, scope.concert_id);
    const rows = await this.db.query.messages.findMany({
      where,
      with: { user: true },
      orderBy: (m, { asc }) => [asc(m.created_at)],
    });
    return rows
      .filter((r) => r.user)
      .map((r) => ({
        id: r.id,
        ride_id: r.ride_id,
        concert_id: r.concert_id,
        user_id: r.user_id,
        user: hydrateUser(r.user!),
        body: r.body,
        created_at: r.created_at,
      }));
  }

  async createMessage(
    scope: { ride_id: string } | { concert_id: string },
    user: User,
    body: string,
  ): Promise<Message> {
    const id = `msg_${crypto.randomUUID().slice(0, 10)}`;
    const now = new Date().toISOString();
    await this.db.insert(schema.messages).values({
      id,
      ride_id: "ride_id" in scope ? scope.ride_id : null,
      concert_id: "concert_id" in scope ? scope.concert_id : null,
      user_id: user.id,
      body,
      created_at: now,
    });
    return {
      id,
      ride_id: "ride_id" in scope ? scope.ride_id : null,
      concert_id: "concert_id" in scope ? scope.concert_id : null,
      user_id: user.id,
      user,
      body,
      created_at: now,
    };
  }

  async isParticipant(
    scope: { ride_id: string } | { concert_id: string },
    userId: string,
  ): Promise<boolean> {
    if ("ride_id" in scope) {
      const req = await this.db.query.rideRequests.findFirst({
        where: and(
          eq(schema.rideRequests.ride_id, scope.ride_id),
          eq(schema.rideRequests.passenger_id, userId),
          eq(schema.rideRequests.status, "confirmed"),
        ),
      });
      if (req) return true;
      const ride = await this.db.query.rides.findFirst({
        where: and(eq(schema.rides.id, scope.ride_id), eq(schema.rides.driver_id, userId)),
      });
      return !!ride;
    }
    // concert scope: user must have a confirmed request on any ride for this concert
    const req = await this.db.query.rideRequests.findFirst({
      where: and(
        eq(schema.rideRequests.passenger_id, userId),
        eq(schema.rideRequests.status, "confirmed"),
      ),
    });
    if (req) {
      const ride = await this.db.query.rides.findFirst({
        where: and(
          eq(schema.rides.id, req.ride_id),
          eq(schema.rides.concert_id, scope.concert_id),
        ),
      });
      if (ride) return true;
    }
    // also check if user is a driver for any ride in this concert
    const driverRide = await this.db.query.rides.findFirst({
      where: and(
        eq(schema.rides.concert_id, scope.concert_id),
        eq(schema.rides.driver_id, userId),
      ),
    });
    return !!driverRide;
  }

  async createReview(
    ride: Ride,
    reviewer: User,
    input: CreateReviewRequest,
  ): Promise<{ review?: Review; error?: string }> {
    if (reviewer.id === input.reviewee_id) return { error: "cannot_review_yourself" };
    if (input.rating < 1 || input.rating > 5) return { error: "invalid_rating" };

    const reviewee = await this.getUser(input.reviewee_id);
    if (!reviewee) return { error: "reviewee_not_found" };

    return await this.db.transaction(async (tx) => {
      const duplicate = await tx.query.reviews.findFirst({
        where: and(
          eq(schema.reviews.ride_id, ride.id),
          eq(schema.reviews.reviewer_id, reviewer.id),
          eq(schema.reviews.reviewee_id, input.reviewee_id),
        ),
      });
      if (duplicate) return { error: "already_reviewed" };

      const id = `rev_${crypto.randomUUID().slice(0, 10)}`;
      const now = new Date().toISOString();
      await tx.insert(schema.reviews).values({
        id,
        ride_id: ride.id,
        reviewer_id: reviewer.id,
        reviewee_id: input.reviewee_id,
        rating: input.rating,
        comment: input.comment ?? null,
        created_at: now,
      });

      // Update reviewee's rolling average
      const agg = await tx
        .select({ avg: avg(schema.reviews.rating), count: count() })
        .from(schema.reviews)
        .where(eq(schema.reviews.reviewee_id, input.reviewee_id));
      const { avg: newAvg, count: newCount } = agg[0] ?? { avg: null, count: 0 };
      if (newAvg !== null) {
        await tx
          .update(schema.users)
          .set({
            rating: Math.round(Number(newAvg) * 10) / 10,
            rating_count: newCount,
          })
          .where(eq(schema.users.id, input.reviewee_id));
      }

      const review: Review = {
        id,
        ride_id: ride.id,
        reviewer_id: reviewer.id,
        reviewer,
        reviewee_id: input.reviewee_id,
        reviewee,
        rating: input.rating,
        comment: input.comment ?? null,
        created_at: now,
      };
      return { review };
    });
  }

  async listReviewsForRide(rideId: string): Promise<Review[]> {
    const rows = await this.db.query.reviews.findMany({
      where: eq(schema.reviews.ride_id, rideId),
      with: { reviewer: true, reviewee: true },
      orderBy: (r) => [desc(r.created_at)],
    });
    return rows
      .filter((r) => r.reviewer && r.reviewee)
      .map((r) => ({
        id: r.id,
        ride_id: r.ride_id,
        reviewer_id: r.reviewer_id,
        reviewer: hydrateUser(r.reviewer!),
        reviewee_id: r.reviewee_id,
        reviewee: hydrateUser(r.reviewee!),
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
      }));
  }

  async listReviewsForUser(userId: string): Promise<Review[]> {
    const rows = await this.db.query.reviews.findMany({
      where: eq(schema.reviews.reviewee_id, userId),
      with: { reviewer: true, reviewee: true },
      orderBy: (r) => [desc(r.created_at)],
    });
    return rows
      .filter((r) => r.reviewer && r.reviewee)
      .map((r) => ({
        id: r.id,
        ride_id: r.ride_id,
        reviewer_id: r.reviewer_id,
        reviewer: hydrateUser(r.reviewer!),
        reviewee_id: r.reviewee_id,
        reviewee: hydrateUser(r.reviewee!),
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
      }));
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

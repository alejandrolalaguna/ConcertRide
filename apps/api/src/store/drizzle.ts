// Drizzle-backed StoreAdapter. Activated when TURSO_DATABASE_URL is set.
//
// NOTE (M4c): Queries are typed and type-check cleanly, but full runtime
// integration testing requires a real Turso instance — see
// apps/api/scripts/seed.ts for the bring-up flow.

import { createClient } from "@libsql/client/web";
import { and, asc, avg, count, desc, eq, gte, inArray, isNull, like, lte, lt, notInArray, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import type {
  ActivityEvent,
  ActivityFeedQuery,
  ActivityFeedResponse,
  ActivityKind,
  AddPlaylistTrackRequest,
  AdminAuditAction,
  AdminAuditLogEntry,
  AnticipationStatus,
  AnticipationSummary,
  Concert,
  ConversationPreview,
  CreateConcertInput,
  CreateFestivalQnaRequest,
  CreateReviewRequest,
  CreateRideRequest,
  CreateSquadRequest,
  CreateTripMemoryRequest,
  CrewListResponse,
  CrewMember,
  DemandSignal,
  DirectMessage,
  EventAnticipation,
  Favorite,
  FavoriteKind,
  FestivalQna,
  JoinSquadRequest,
  Message,
  MessageKind,
  PlaylistTrack,
  Report,
  ReportReason,
  RequestStatus,
  Review,
  Ride,
  RideRequest,
  Squad,
  SquadRole,
  TripMemory,
  UpdateProfileInput,
  User,
  Venue,
} from "@concertride/types";
import type { Env } from "../env";
import * as schema from "../db/schema";
import type { RawConcert, SourceId } from "../ingest/types";
import { computeFingerprint } from "../lib/fingerprint";
import { genreMatches, parseGenreTags } from "../lib/genre";
import type {
  ConcertFacets,
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

function makeReferralCode(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
}

function splitPipe(value: string | null | undefined): string[] | null {
  if (!value) return null;
  const parts = value
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts : null;
}

// Minimal user shape for embedding in public responses (messages, rides, reviews).
// Never include phone, home_city, referral_code, or internal timestamps.
function hydratePublicUser(row: UserRow): User {
  return {
    id: row.id,
    email: "",
    name: row.name,
    avatar_url: row.avatar_url,
    verified: row.verified,
    license_verified: row.license_verified ?? false,
    identity_verified: row.identity_verified ?? false,
    rating: row.rating,
    rating_count: row.rating_count,
    rides_given: row.rides_given,
    car_model: row.car_model,
    car_color: row.car_color,
    smoker: row.smoker ?? null,
    has_license: row.has_license ?? null,
    phone: null,
    home_city: null,
    referral_code: null,
    referral_count: 0,
    tos_accepted_at: null,
    email_verified_at: null,
    phone_verified_at: null,
    deleted_at: null,
    banned_at: null,
    ban_reason: null,
    bio: row.bio ?? null,
    music_genres: splitPipe(row.music_genres),
    top_artists: splitPipe(row.top_artists),
    spotify_id: null,
    handle: row.handle ?? null,
    crew_count: row.crew_count ?? 0,
    created_at: row.created_at,
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
    license_verified: row.license_verified ?? false,
    identity_verified: row.identity_verified ?? false,
    referral_code: row.referral_code ?? null,
    referral_count: row.referral_count ?? 0,
    tos_accepted_at: row.tos_accepted_at ?? null,
    email_verified_at: row.email_verified_at ?? null,
    phone_verified_at: row.phone_verified_at ?? null,
    deleted_at: row.deleted_at ?? null,
    banned_at: row.banned_at ?? null,
    ban_reason: row.ban_reason ?? null,
    bio: row.bio ?? null,
    music_genres: splitPipe(row.music_genres),
    top_artists: splitPipe(row.top_artists),
    spotify_id: row.spotify_id ?? null,
    handle: row.handle ?? null,
    crew_count: row.crew_count ?? 0,
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
    official_url: row.official_url ?? null,
    lineup: row.lineup ?? null,
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
    driver: hydratePublicUser(row.driver),
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
    price_negotiable: row.price_negotiable ?? false,
    accepted_payment: (row.accepted_payment as Ride["accepted_payment"]) ?? "cash",
    status: row.status,
    completed_at: row.completed_at ?? null,
    completion_confirmed_by: (row.completion_confirmed_by as Ride["completion_confirmed_by"]) ?? null,
    reminded_at: row.reminded_at ?? null,
    payment_reminder_sent_at: row.payment_reminder_sent_at ?? null,
    created_at: row.created_at,
  };
}

function hydrateRequest(row: RequestWith): RideRequest {
  if (!row.passenger) throw new Error(`Request ${row.id} missing passenger join`);
  return {
    id: row.id,
    ride_id: row.ride_id,
    passenger_id: row.passenger_id,
    passenger: hydratePublicUser(row.passenger),
    seats: row.seats,
    status: row.status,
    message: row.message,
    luggage: (row.luggage as RideRequest["luggage"]) ?? null,
    payment_method: (row.payment_method as RideRequest["payment_method"]) ?? null,
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
      license_verified: false,
      referral_code: makeReferralCode(),
      referral_count: 0,
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
      license_verified: false,
      referral_code: makeReferralCode(),
      referral_count: 0,
      tos_accepted_at: new Date().toISOString(),
      email_verified_at: null as string | null,
      deleted_at: null as string | null,
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
    if (input.bio !== undefined) patch.bio = input.bio === null ? null : input.bio.slice(0, 200);
    if (input.music_genres !== undefined) {
      patch.music_genres = input.music_genres ? input.music_genres.join("|") : null;
    }
    if (input.top_artists !== undefined) {
      patch.top_artists = input.top_artists ? input.top_artists.slice(0, 10).join("|") : null;
    }
    if (input.handle !== undefined) {
      const next = input.handle?.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24) || null;
      patch.handle = next;
    }
    if (Object.keys(patch).length === 0) return this.getUser(id);
    await this.db.update(schema.users).set(patch).where(eq(schema.users.id, id));
    return this.getUser(id);
  }

  async useReferral(referralCode: string, _newUserId: string): Promise<void> {
    await this.db
      .update(schema.users)
      .set({ referral_count: sql`referral_count + 1` })
      .where(eq(schema.users.referral_code, referralCode));
  }

  async getPasswordHash(userId: string): Promise<{ hash: string; salt: string } | null> {
    const row = await this.db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });
    if (!row || !row.password_hash || !row.password_salt) return null;
    return { hash: row.password_hash, salt: row.password_salt };
  }

  async updatePassword(userId: string, hash: string, salt: string): Promise<void> {
    await this.db
      .update(schema.users)
      .set({ password_hash: hash, password_salt: salt })
      .where(eq(schema.users.id, userId));
  }

  async markEmailVerified(userId: string): Promise<User | null> {
    const now = new Date().toISOString();
    await this.db
      .update(schema.users)
      .set({ email_verified_at: now })
      .where(eq(schema.users.id, userId));
    return this.getUser(userId);
  }

  async deleteUser(userId: string): Promise<void> {
    const now = new Date().toISOString();
    await this.db.transaction(async (tx) => {
      // Anonymise PII + mark as deleted
      await tx
        .update(schema.users)
        .set({
          email: `deleted+${userId}@concertride.me`,
          name: "Usuario eliminado",
          avatar_url: null,
          phone: null,
          home_city: null,
          car_model: null,
          car_color: null,
          password_hash: null,
          password_salt: null,
          deleted_at: now,
        })
        .where(eq(schema.users.id, userId));
      // Cancel active rides they drive
      await tx
        .update(schema.rides)
        .set({ status: "cancelled" })
        .where(
          and(
            eq(schema.rides.driver_id, userId),
            inArray(schema.rides.status, ["active", "full"]),
          ),
        );
      // Cancel pending/confirmed requests as passenger
      await tx
        .update(schema.rideRequests)
        .set({ status: "cancelled" })
        .where(
          and(
            eq(schema.rideRequests.passenger_id, userId),
            inArray(schema.rideRequests.status, ["pending", "confirmed"]),
          ),
        );
      // Hard-delete data that can't be kept without PII
      await tx.delete(schema.pushSubscriptions).where(eq(schema.pushSubscriptions.user_id, userId));
      await tx.delete(schema.favorites).where(eq(schema.favorites.user_id, userId));
      await tx.delete(schema.demandSignals).where(eq(schema.demandSignals.user_id, userId));
    });
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
    // Clauses applied directly on the concerts table
    const concertClauses = [];
    if (f.artist) {
      concertClauses.push(
        sql`lower(${schema.concerts.artist}) like ${"%" + f.artist.toLowerCase() + "%"}`,
      );
    }
    if (f.genre) {
      // Compound genres ("Pop / Flamenco") are matched via LIKE; precise tag
      // equality is enforced post-fetch with `genreMatches` so "Pop" doesn't
      // accidentally match "K-Pop".
      concertClauses.push(
        sql`lower(${schema.concerts.genre}) like ${"%" + f.genre.toLowerCase() + "%"}`,
      );
    }
    if (f.festival) {
      concertClauses.push(sql`lower(${schema.concerts.genre}) like '%festival%'`);
    }
    if (f.date_from) concertClauses.push(gte(schema.concerts.date, f.date_from));
    if (f.date_to) concertClauses.push(lte(schema.concerts.date, f.date_to));
    const concertWhere = concertClauses.length ? and(...concertClauses) : undefined;

    // City / genre filters are refined in-memory after the join
    const cityLower = f.city ? f.city.toLowerCase() : null;
    const genreTag = f.genre ?? null;

    // COUNT with join so city filter is accurate
    const countClauses = [...concertClauses];
    if (cityLower) countClauses.push(sql`lower(${schema.venues.city}) = ${cityLower}`);
    const [countRow] = await this.db
      .select({ total: count() })
      .from(schema.concerts)
      .innerJoin(schema.venues, eq(schema.concerts.venue_id, schema.venues.id))
      .where(countClauses.length ? and(...countClauses) : undefined);
    const total = countRow?.total ?? 0;

    // Fetch a wider slice when post-filters are active
    const needsMemoryFilter = cityLower || genreTag;
    const fetchLimit = needsMemoryFilter ? Math.min((f.limit ?? 100) * 10, 500) : f.limit;
    const allRows = await this.db.query.concerts.findMany({
      where: concertWhere,
      with: { venue: true },
      orderBy: (c, { asc }) => [asc(c.date)],
      limit: fetchLimit,
      offset: needsMemoryFilter ? 0 : f.offset,
    });

    const filtered = allRows.filter((c) => {
      if (cityLower && c.venue?.city.toLowerCase() !== cityLower) return false;
      if (genreTag && !genreMatches(c.genre, genreTag)) return false;
      return true;
    });
    const pageRows = needsMemoryFilter
      ? filtered.slice(f.offset ?? 0, (f.offset ?? 0) + (f.limit ?? 100))
      : filtered;

    // Batch demand + active ride counts for the current page.
    // For past concerts (date_to <= now) also count "completed" rides so the
    // card shows real historical activity instead of always "Sin viajes".
    const now = new Date().toISOString();
    const isPastQuery = !!f.date_to && f.date_to <= now;
    const rideStatuses: ("active" | "full" | "cancelled" | "completed")[] = isPastQuery
      ? ["active", "full", "completed"]
      : ["active"];
    const pageIds = pageRows.map((c) => c.id);
    const [demandRows, rideRows] = pageIds.length
      ? await Promise.all([
          this.db
            .select({ concert_id: schema.demandSignals.concert_id, cnt: count() })
            .from(schema.demandSignals)
            .where(
              and(
                gte(schema.demandSignals.expires_at, now),
                inArray(schema.demandSignals.concert_id, pageIds),
              ),
            )
            .groupBy(schema.demandSignals.concert_id),
          this.db
            .select({ concert_id: schema.rides.concert_id, cnt: count() })
            .from(schema.rides)
            .where(
              and(
                inArray(schema.rides.concert_id, pageIds),
                inArray(schema.rides.status, rideStatuses),
              ),
            )
            .groupBy(schema.rides.concert_id),
        ])
      : [[], []];
    const demandMap = new Map(demandRows.map((r) => [r.concert_id, r.cnt]));
    const ridesMap = new Map(rideRows.map((r) => [r.concert_id, r.cnt]));

    const page = pageRows.map((c) =>
      hydrateConcert(c, ridesMap.get(c.id) ?? 0, demandMap.get(c.id) ?? 0),
    );
    return { concerts: page, total };
  }

  async listConcertFacets(): Promise<ConcertFacets> {
    // Only surface facets for upcoming/recent concerts so the filter UI
    // doesn't offer dead genres from an ancient catalogue.
    const horizon = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const rows = await this.db
      .select({
        genre: schema.concerts.genre,
        city: schema.venues.city,
      })
      .from(schema.concerts)
      .innerJoin(schema.venues, eq(schema.concerts.venue_id, schema.venues.id))
      .where(gte(schema.concerts.date, horizon));

    const genreSet = new Map<string, string>(); // lower → canonical casing
    const citySet = new Map<string, string>();
    for (const r of rows) {
      for (const tag of parseGenreTags(r.genre)) {
        const key = tag.toLowerCase();
        if (!genreSet.has(key)) genreSet.set(key, tag);
      }
      if (r.city) {
        const key = r.city.toLowerCase();
        if (!citySet.has(key)) citySet.set(key, r.city);
      }
    }
    return {
      genres: [...genreSet.values()].sort((a, b) => a.localeCompare(b, "es")),
      cities: [...citySet.values()].sort((a, b) => a.localeCompare(b, "es")),
    };
  }

  async getConcert(id: string): Promise<Concert | null> {
    const row = await this.db.query.concerts.findFirst({
      where: eq(schema.concerts.id, id),
      with: { venue: true },
    });
    if (!row) return null;
    const [ridesRow] = await this.db
      .select({ cnt: count() })
      .from(schema.rides)
      .where(
        and(eq(schema.rides.concert_id, id), inArray(schema.rides.status, ["active", "full"])),
      );
    return hydrateConcert(row, ridesRow?.cnt ?? 0);
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
      official_url: input.official_url ?? null,
      lineup: input.lineup ?? null,
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
    if (f.driver_id) clauses.push(eq(schema.rides.driver_id, f.driver_id));
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
      price_negotiable: input.price_negotiable ?? false,
      accepted_payment: input.accepted_payment ?? "cash",
      status: "active",
      created_at: now,
    });
    const created = await this.getRide(id);
    if (!created) throw new Error(`Ride ${id} missing after insert`);
    return created;
  }

  async listRidesForReminder(fromISO: string, toISO: string): Promise<Ride[]> {
    const rows = await this.db.query.rides.findMany({
      where: (r, { and: _and, gte: _gte, lte: _lte, isNull, inArray: _inArray }) =>
        _and(
          _gte(r.departure_time, fromISO),
          _lte(r.departure_time, toISO),
          isNull(r.reminded_at),
          _inArray(r.status, ["active", "full"]),
        ),
      with: { driver: true, concert: { with: { venue: true } } },
    });
    return rows.map(hydrateRide);
  }

  async markRideReminded(rideId: string): Promise<void> {
    await this.db
      .update(schema.rides)
      .set({ reminded_at: new Date().toISOString() })
      .where(eq(schema.rides.id, rideId));
  }

  async listRidesForPaymentReminder(fromISO: string, toISO: string): Promise<Ride[]> {
    const rows = await this.db.query.rides.findMany({
      where: (r, { and: _and, gte: _gte, lte: _lte, isNull, inArray: _inArray }) =>
        _and(
          _gte(r.departure_time, fromISO),
          _lte(r.departure_time, toISO),
          isNull(r.payment_reminder_sent_at),
          _inArray(r.status, ["active", "full"]),
        ),
      with: { driver: true, concert: { with: { venue: true } } },
    });
    return rows.map(hydrateRide);
  }

  async markPaymentReminderSent(rideId: string): Promise<void> {
    await this.db
      .update(schema.rides)
      .set({ payment_reminder_sent_at: new Date().toISOString() })
      .where(eq(schema.rides.id, rideId));
  }

  async cancelRide(rideId: string): Promise<Ride | null> {
    await this.db.transaction(async (tx) => {
      await tx
        .update(schema.rides)
        .set({ status: "cancelled", seats_left: 0 })
        .where(eq(schema.rides.id, rideId));
      await tx
        .update(schema.rideRequests)
        .set({ status: "cancelled" })
        .where(
          and(
            eq(schema.rideRequests.ride_id, rideId),
            inArray(schema.rideRequests.status, ["pending", "confirmed"]),
          ),
        );
    });
    return this.getRide(rideId);
  }

  async updateRide(
    rideId: string,
    patch: Partial<
      Pick<
        Ride,
        | "departure_time"
        | "return_time"
        | "price_per_seat"
        | "seats_total"
        | "notes"
        | "playlist_url"
        | "vibe"
        | "smoking_policy"
        | "max_luggage"
        | "instant_booking"
        | "price_negotiable"
        | "accepted_payment"
        | "origin_address"
      >
    >,
  ): Promise<Ride | null> {
    const row = await this.db.query.rides.findFirst({ where: eq(schema.rides.id, rideId) });
    if (!row) return null;

    const updates: Partial<typeof schema.rides.$inferInsert> = {};
    if (patch.departure_time !== undefined) updates.departure_time = patch.departure_time;
    if (patch.return_time !== undefined) updates.return_time = patch.return_time;
    if (patch.price_per_seat !== undefined) updates.price_per_seat = patch.price_per_seat;
    if (patch.notes !== undefined) updates.notes = patch.notes;
    if (patch.playlist_url !== undefined) updates.playlist_url = patch.playlist_url;
    if (patch.vibe !== undefined) updates.vibe = patch.vibe;
    if (patch.smoking_policy !== undefined) updates.smoking_policy = patch.smoking_policy;
    if (patch.max_luggage !== undefined) updates.max_luggage = patch.max_luggage;
    if (patch.instant_booking !== undefined) updates.instant_booking = patch.instant_booking;
    if (patch.price_negotiable !== undefined) updates.price_negotiable = patch.price_negotiable;
    if (patch.accepted_payment !== undefined) updates.accepted_payment = patch.accepted_payment;
    if (patch.origin_address !== undefined) updates.origin_address = patch.origin_address;
    // Seats can only grow — can't remove booked passengers
    if (patch.seats_total !== undefined && patch.seats_total >= row.seats_total) {
      const delta = patch.seats_total - row.seats_total;
      updates.seats_total = patch.seats_total;
      updates.seats_left = Math.min(patch.seats_total, row.seats_left + delta);
      if (row.status === "full" && (updates.seats_left ?? 0) > 0) {
        updates.status = "active";
      }
    }
    if (Object.keys(updates).length > 0) {
      await this.db.update(schema.rides).set(updates).where(eq(schema.rides.id, rideId));
    }
    return this.getRide(rideId);
  }

  async revokeDriverCompletion(rideId: string): Promise<Ride | null> {
    const row = await this.db.query.rides.findFirst({ where: eq(schema.rides.id, rideId) });
    if (!row) return null;
    if (row.status === "completed") return this.getRide(rideId);
    if (row.completion_confirmed_by !== "driver") return this.getRide(rideId);
    await this.db
      .update(schema.rides)
      .set({ completion_confirmed_by: null })
      .where(eq(schema.rides.id, rideId));
    return this.getRide(rideId);
  }

  async confirmRideComplete(rideId: string, confirmedBy: "driver" | "passenger"): Promise<Ride | null> {
    return await this.db.transaction(async (tx) => {
      const row = await tx.query.rides.findFirst({ where: eq(schema.rides.id, rideId) });
      if (!row) return null;

      const wasDriverOnly = row.completion_confirmed_by === "driver";
      let newConfirmedBy = row.completion_confirmed_by as string | null;
      let newStatus = row.status as string;
      let newCompletedAt = row.completed_at;

      if (confirmedBy === "driver" && !wasDriverOnly) {
        newConfirmedBy = "driver";
      } else if (confirmedBy === "passenger" && wasDriverOnly) {
        newConfirmedBy = "both";
        newStatus = "completed";
        newCompletedAt = new Date().toISOString();
        await tx.update(schema.users).set({
          rides_given: sql`${schema.users.rides_given} + 1`,
        }).where(eq(schema.users.id, row.driver_id));
      }

      await tx.update(schema.rides).set({
        completion_confirmed_by: newConfirmedBy as "driver" | "both" | null,
        status: newStatus as "active" | "full" | "cancelled" | "completed",
        completed_at: newCompletedAt,
      }).where(eq(schema.rides.id, rideId));

      const updated = await this.getRide(rideId);
      return updated;
    });
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

  async listRequestsByPassenger(
    passengerId: string,
  ): Promise<Array<RideRequest & { ride: Ride }>> {
    const rows = await this.db.query.rideRequests.findMany({
      where: eq(schema.rideRequests.passenger_id, passengerId),
      with: {
        passenger: true,
        ride: { with: { driver: true, concert: { with: { venue: true } } } },
      },
      orderBy: (r) => [desc(r.created_at)],
    });
    return rows
      .filter((r) => r.passenger && r.ride)
      .map((r) => ({
        ...hydrateRequest(r),
        ride: hydrateRide(r.ride as Parameters<typeof hydrateRide>[0]),
      }));
  }

  async createRequest(
    ride: Ride,
    passenger: User,
    seats: number,
    message?: string,
    luggage?: string,
    payment_method?: string,
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
      const paymentVal = (payment_method ?? null) as RideRequest["payment_method"];
      await tx.insert(schema.rideRequests).values({
        id,
        ride_id: ride.id,
        passenger_id: passenger.id,
        seats,
        status: "pending",
        message: message ?? null,
        luggage: luggageVal,
        payment_method: paymentVal,
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
        payment_method: paymentVal,
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

      // Take seats when newly confirming
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
      // Give seats back when a previously-confirmed seat is cancelled/rejected
      if (
        existing.status === "confirmed" &&
        (status === "cancelled" || status === "rejected")
      ) {
        const ride = await tx.query.rides.findFirst({
          where: eq(schema.rides.id, existing.ride_id),
        });
        if (ride) {
          const seatsLeft = Math.min(ride.seats_total, ride.seats_left + existing.seats);
          await tx
            .update(schema.rides)
            .set({
              seats_left: seatsLeft,
              status: ride.status === "full" && seatsLeft > 0 ? "active" : ride.status,
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

  async listFavorites(userId: string): Promise<Favorite[]> {
    const rows = await this.db
      .select()
      .from(schema.favorites)
      .where(eq(schema.favorites.user_id, userId))
      .orderBy(desc(schema.favorites.created_at));
    return rows.map((r) => ({
      id: r.id,
      kind: r.kind as FavoriteKind,
      target_id: r.target_id,
      label: r.label,
      created_at: r.created_at,
    }));
  }

  async addFavorite(
    userId: string,
    kind: FavoriteKind,
    targetId: string,
    label: string,
  ): Promise<Favorite> {
    const existing = await this.db.query.favorites.findFirst({
      where: and(
        eq(schema.favorites.user_id, userId),
        eq(schema.favorites.kind, kind),
        eq(schema.favorites.target_id, targetId),
      ),
    });
    if (existing) {
      return {
        id: existing.id,
        kind: existing.kind as FavoriteKind,
        target_id: existing.target_id,
        label: existing.label,
        created_at: existing.created_at,
      };
    }
    const id = `fav_${crypto.randomUUID().slice(0, 10)}`;
    const created_at = new Date().toISOString();
    await this.db.insert(schema.favorites).values({
      id,
      user_id: userId,
      kind,
      target_id: targetId,
      label,
      created_at,
    });
    return { id, kind, target_id: targetId, label, created_at };
  }

  async removeFavorite(userId: string, kind: FavoriteKind, targetId: string): Promise<void> {
    await this.db
      .delete(schema.favorites)
      .where(
        and(
          eq(schema.favorites.user_id, userId),
          eq(schema.favorites.kind, kind),
          eq(schema.favorites.target_id, targetId),
        ),
      );
  }

  async listFavoriteUpcomingConcerts(userId: string): Promise<Concert[]> {
    const favs = await this.db
      .select({ kind: schema.favorites.kind, target_id: schema.favorites.target_id })
      .from(schema.favorites)
      .where(eq(schema.favorites.user_id, userId));
    if (favs.length === 0) return [];

    const concertIds = favs.filter((f) => f.kind === "concert").map((f) => f.target_id);
    const artistKeys = favs.filter((f) => f.kind === "artist").map((f) => f.target_id);
    const cityKeys = favs.filter((f) => f.kind === "city").map((f) => f.target_id);

    const now = new Date().toISOString();
    const conditions = [];
    if (concertIds.length) conditions.push(inArray(schema.concerts.id, concertIds));
    if (artistKeys.length) conditions.push(inArray(sql`lower(${schema.concerts.artist})`, artistKeys));
    if (cityKeys.length) conditions.push(inArray(sql`lower(${schema.venues.city})`, cityKeys));
    if (conditions.length === 0) return [];

    const rows = await this.db
      .select({ concert: schema.concerts, venue: schema.venues })
      .from(schema.concerts)
      .innerJoin(schema.venues, eq(schema.concerts.venue_id, schema.venues.id))
      .where(and(gte(schema.concerts.date, now), or(...conditions)))
      .orderBy(schema.concerts.date);

    // Batch demand + active ride counts
    const ids = rows.map((r) => r.concert.id);
    const [demandRows, rideRows] = ids.length
      ? await Promise.all([
          this.db
            .select({ concert_id: schema.demandSignals.concert_id, cnt: count() })
            .from(schema.demandSignals)
            .where(
              and(
                gte(schema.demandSignals.expires_at, now),
                inArray(schema.demandSignals.concert_id, ids),
              ),
            )
            .groupBy(schema.demandSignals.concert_id),
          this.db
            .select({ concert_id: schema.rides.concert_id, cnt: count() })
            .from(schema.rides)
            .where(
              and(
                inArray(schema.rides.concert_id, ids),
                inArray(schema.rides.status, ["active", "full"]),
              ),
            )
            .groupBy(schema.rides.concert_id),
        ])
      : [[], []];
    const demandMap = new Map(demandRows.map((r) => [r.concert_id, r.cnt]));
    const ridesMap = new Map(rideRows.map((r) => [r.concert_id, r.cnt]));

    return rows.map((r) =>
      hydrateConcert(
        { ...r.concert, venue: r.venue },
        ridesMap.get(r.concert.id) ?? 0,
        demandMap.get(r.concert.id) ?? 0,
      ),
    );
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

  async savePushSubscription(
    userId: string,
    sub: { endpoint: string; p256dh: string; auth: string },
  ): Promise<void> {
    const existing = await this.db.query.pushSubscriptions.findFirst({
      where: eq(schema.pushSubscriptions.endpoint, sub.endpoint),
    });
    if (existing) {
      await this.db
        .update(schema.pushSubscriptions)
        .set({ user_id: userId, p256dh: sub.p256dh, auth: sub.auth })
        .where(eq(schema.pushSubscriptions.endpoint, sub.endpoint));
    } else {
      await this.db.insert(schema.pushSubscriptions).values({
        id: `ps_${crypto.randomUUID().slice(0, 10)}`,
        user_id: userId,
        endpoint: sub.endpoint,
        p256dh: sub.p256dh,
        auth: sub.auth,
        created_at: new Date().toISOString(),
      });
    }
  }

  async removePushSubscription(endpoint: string): Promise<void> {
    await this.db
      .delete(schema.pushSubscriptions)
      .where(eq(schema.pushSubscriptions.endpoint, endpoint));
  }

  async getPushSubscriptionsForUser(
    userId: string,
  ): Promise<{ endpoint: string; p256dh: string; auth: string }[]> {
    const rows = await this.db.query.pushSubscriptions.findMany({
      where: eq(schema.pushSubscriptions.user_id, userId),
    });
    return rows.map((r) => ({ endpoint: r.endpoint, p256dh: r.p256dh, auth: r.auth }));
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

  async listInterestedUsers(concertId: string): Promise<User[]> {
    const now = new Date().toISOString();
    const rows = await this.db.query.demandSignals.findMany({
      where: (d, { and, eq, gte }) => and(eq(d.concert_id, concertId), gte(d.expires_at, now)),
      with: { user: true },
    });
    return rows.filter((r) => r.user).map((r) => hydrateUser(r.user!));
  }

  async verifyLicense(userId: string): Promise<User | null> {
    await this.db
      .update(schema.users)
      .set({ license_verified: true, has_license: true })
      .where(eq(schema.users.id, userId));
    return this.getUser(userId);
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
        user: hydratePublicUser(r.user!),
        kind: (r.kind as import("@concertride/types").MessageKind) ?? "text",
        body: r.body,
        attachment_url: r.attachment_url ?? null,
        created_at: r.created_at,
      }));
  }

  async createMessage(
    scope: { ride_id: string } | { concert_id: string },
    user: User,
    body: string,
    opts?: { kind?: import("@concertride/types").MessageKind; attachment_url?: string },
  ): Promise<Message> {
    const id = `msg_${crypto.randomUUID().slice(0, 10)}`;
    const now = new Date().toISOString();
    const kind = opts?.kind ?? "text";
    const attachment_url = opts?.attachment_url ?? null;
    await this.db.insert(schema.messages).values({
      id,
      ride_id: "ride_id" in scope ? scope.ride_id : null,
      concert_id: "concert_id" in scope ? scope.concert_id : null,
      user_id: user.id,
      kind,
      body,
      attachment_url,
      created_at: now,
    });
    return {
      id,
      ride_id: "ride_id" in scope ? scope.ride_id : null,
      concert_id: "concert_id" in scope ? scope.concert_id : null,
      user_id: user.id,
      user,
      kind,
      body,
      attachment_url,
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

  async listDirectMessages(userId: string, otherUserId: string): Promise<DirectMessage[]> {
    const rows = await this.db.query.directMessages.findMany({
      where: or(
        and(eq(schema.directMessages.sender_id, userId), eq(schema.directMessages.recipient_id, otherUserId)),
        and(eq(schema.directMessages.sender_id, otherUserId), eq(schema.directMessages.recipient_id, userId)),
      ),
      with: { sender: true, recipient: true },
      orderBy: (m, { asc }) => [asc(m.created_at)],
    });
    return rows
      .filter((r) => r.sender && r.recipient)
      .map((r) => ({
        id: r.id,
        sender_id: r.sender_id,
        recipient_id: r.recipient_id,
        sender: hydratePublicUser(r.sender!),
        recipient: hydratePublicUser(r.recipient!),
        kind: (r.kind as MessageKind) ?? "text",
        body: r.body,
        attachment_url: r.attachment_url ?? null,
        created_at: r.created_at,
      }));
  }

  async createDirectMessage(
    sender: User,
    recipientId: string,
    body: string,
    opts?: { kind?: MessageKind; attachment_url?: string },
  ): Promise<DirectMessage> {
    const recipient = await this.getUser(recipientId);
    if (!recipient) throw new Error("recipient_not_found");

    const id = `dm_${crypto.randomUUID().slice(0, 10)}`;
    const now = new Date().toISOString();
    const kind = opts?.kind ?? "text";
    const attachment_url = opts?.attachment_url ?? null;

    await this.db.insert(schema.directMessages).values({
      id,
      sender_id: sender.id,
      recipient_id: recipientId,
      kind,
      body,
      attachment_url,
      created_at: now,
    });

    return { id, sender_id: sender.id, recipient_id: recipientId, sender, recipient, kind, body, attachment_url, created_at: now };
  }

  async listConversations(userId: string): Promise<ConversationPreview[]> {
    const results: ConversationPreview[] = [];

    // 1. DM conversations — get all DMs involving this user, group by other user
    const allDMs = await this.db
      .select()
      .from(schema.directMessages)
      .where(
        or(
          eq(schema.directMessages.sender_id, userId),
          eq(schema.directMessages.recipient_id, userId),
        ),
      )
      .orderBy(desc(schema.directMessages.created_at));

    // Group by other user, keep only the latest message per conversation
    const dmByOther = new Map<string, typeof allDMs[0]>();
    for (const msg of allDMs) {
      const otherId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
      if (!dmByOther.has(otherId)) dmByOther.set(otherId, msg);
    }
    for (const [otherId, msg] of dmByOther) {
      const otherUser = await this.getUser(otherId);
      if (!otherUser) continue;
      results.push({
        kind: "dm",
        other_user: hydratePublicUser(otherUser as Parameters<typeof hydratePublicUser>[0]),
        ride_id: null,
        ride_label: null,
        concert_id: null,
        concert_label: null,
        last_message_body: msg.body,
        last_message_at: msg.created_at,
        unread_count: 0,
      });
    }

    // 2. Ride chat conversations — rides where user is driver or confirmed passenger
    const driverRides = await this.db.query.rides.findMany({
      where: eq(schema.rides.driver_id, userId),
      with: { concert: true },
    });
    const confirmedReqs = await this.db.query.rideRequests.findMany({
      where: and(
        eq(schema.rideRequests.passenger_id, userId),
        eq(schema.rideRequests.status, "confirmed"),
      ),
      with: { ride: { with: { concert: true } } },
    });

    const rideSet = new Map<string, { ride: typeof driverRides[0]; concert: NonNullable<typeof driverRides[0]["concert"]> }>();
    for (const r of driverRides) {
      if (r.concert) rideSet.set(r.id, { ride: r, concert: r.concert });
    }
    for (const req of confirmedReqs) {
      if (req.ride && req.ride.concert && !rideSet.has(req.ride.id)) {
        rideSet.set(req.ride.id, { ride: req.ride as typeof driverRides[0], concert: req.ride.concert });
      }
    }

    for (const { ride, concert } of rideSet.values()) {
      const msgs = await this.db
        .select()
        .from(schema.messages)
        .where(eq(schema.messages.ride_id, ride.id))
        .orderBy(desc(schema.messages.created_at))
        .limit(1);
      if (msgs.length === 0) continue;
      const last = msgs[0]!;
      results.push({
        kind: "ride",
        other_user: null,
        ride_id: ride.id,
        ride_label: `${concert.artist} · ${new Date(ride.departure_time).toLocaleDateString("es-ES")}`,
        concert_id: concert.id,
        concert_label: concert.artist,
        last_message_body: last.body,
        last_message_at: last.created_at,
        unread_count: 0,
      });
    }

    // 3. Concert chat conversations — concerts where user has posted a message
    const concertMsgRows = await this.db
      .selectDistinct({ concert_id: schema.messages.concert_id })
      .from(schema.messages)
      .where(
        and(
          eq(schema.messages.user_id, userId),
          sql`${schema.messages.concert_id} IS NOT NULL`,
        ),
      );

    for (const { concert_id } of concertMsgRows) {
      if (!concert_id) continue;
      const concert = await this.getConcert(concert_id);
      if (!concert) continue;
      const msgs = await this.db
        .select()
        .from(schema.messages)
        .where(eq(schema.messages.concert_id, concert_id))
        .orderBy(desc(schema.messages.created_at))
        .limit(1);
      if (msgs.length === 0) continue;
      const last = msgs[0]!;
      results.push({
        kind: "concert",
        other_user: null,
        ride_id: null,
        ride_label: null,
        concert_id: concert.id,
        concert_label: concert.artist,
        last_message_body: last.body,
        last_message_at: last.created_at,
        unread_count: 0,
      });
    }

    // Sort all conversations by most recent message
    results.sort((a, b) => b.last_message_at.localeCompare(a.last_message_at));
    return results;
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
        reviewer: hydratePublicUser(r.reviewer!),
        reviewee_id: r.reviewee_id,
        reviewee: hydratePublicUser(r.reviewee!),
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
        reviewer: hydratePublicUser(r.reviewer!),
        reviewee_id: r.reviewee_id,
        reviewee: hydratePublicUser(r.reviewee!),
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
      }));
  }

  async createReport(
    reporterId: string,
    args: { target_user_id?: string; ride_id?: string; reason: ReportReason; body?: string },
  ): Promise<Report> {
    const id = `rep_${crypto.randomUUID().slice(0, 10)}`;
    const created_at = new Date().toISOString();
    await this.db.insert(schema.reports).values({
      id,
      reporter_id: reporterId,
      target_user_id: args.target_user_id ?? null,
      ride_id: args.ride_id ?? null,
      reason: args.reason,
      body: args.body ?? null,
      status: "pending",
      created_at,
    });
    return {
      id,
      reporter_id: reporterId,
      target_user_id: args.target_user_id ?? null,
      ride_id: args.ride_id ?? null,
      reason: args.reason,
      body: args.body ?? null,
      status: "pending",
      created_at,
    };
  }

  async countReportsByReporterSince(reporterId: string, sinceISO: string): Promise<number> {
    const [row] = await this.db
      .select({ cnt: count() })
      .from(schema.reports)
      .where(
        and(
          eq(schema.reports.reporter_id, reporterId),
          gte(schema.reports.created_at, sinceISO),
        ),
      );
    return row?.cnt ?? 0;
  }

  async listReportsForAdmin(filter?: {
    status?: import("@concertride/types").ReportStatus;
  }): Promise<Array<Report & { reporter: User | null; target_user: User | null }>> {
    const rows = await this.db.query.reports.findMany({
      where: filter?.status ? eq(schema.reports.status, filter.status) : undefined,
      orderBy: (r, { desc: _desc }) => [_desc(r.created_at)],
      with: { reporter: true, target_user: true },
    });
    return rows.map((r) => ({
      id: r.id,
      reporter_id: r.reporter_id,
      target_user_id: r.target_user_id,
      ride_id: r.ride_id,
      reason: r.reason as import("@concertride/types").ReportReason,
      body: r.body,
      status: r.status as import("@concertride/types").ReportStatus,
      created_at: r.created_at,
      reporter: r.reporter ? hydrateUser(r.reporter) : null,
      target_user: r.target_user ? hydrateUser(r.target_user) : null,
    }));
  }

  async updateReportStatus(
    id: string,
    status: import("@concertride/types").ReportStatus,
  ): Promise<Report | null> {
    await this.db
      .update(schema.reports)
      .set({ status })
      .where(eq(schema.reports.id, id));
    const row = await this.db.query.reports.findFirst({ where: eq(schema.reports.id, id) });
    if (!row) return null;
    return {
      id: row.id,
      reporter_id: row.reporter_id,
      target_user_id: row.target_user_id,
      ride_id: row.ride_id,
      reason: row.reason as import("@concertride/types").ReportReason,
      body: row.body,
      status: row.status as import("@concertride/types").ReportStatus,
      created_at: row.created_at,
    };
  }

  async getMyLicenseReview(userId: string): Promise<import("@concertride/types").LicenseReview | null> {
    const row = await this.db.query.licenseReviews.findFirst({
      where: eq(schema.licenseReviews.user_id, userId),
      orderBy: (t, { desc }) => [desc(t.submitted_at)],
    });
    return row ?? null;
  }

  async createLicenseReview(userId: string, fileKvKey: string): Promise<import("@concertride/types").LicenseReview> {
    const id = `lr_${crypto.randomUUID().slice(0, 10)}`;
    await this.db.insert(schema.licenseReviews).values({ id, user_id: userId, file_kv_key: fileKvKey });
    const row = await this.db.query.licenseReviews.findFirst({ where: eq(schema.licenseReviews.id, id) });
    return row as import("@concertride/types").LicenseReview;
  }

  async listLicenseReviews(
    filter?: { status?: "pending" | "approved" | "rejected" },
  ): Promise<Array<import("@concertride/types").LicenseReview & { user: import("@concertride/types").User | null }>> {
    const where = filter?.status
      ? eq(schema.licenseReviews.status, filter.status)
      : undefined;
    const rows = await this.db.query.licenseReviews.findMany({
      where,
      with: { user: true },
      orderBy: (r, { desc }) => [desc(r.submitted_at)],
    });
    return rows.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      file_kv_key: r.file_kv_key,
      status: r.status as import("@concertride/types").LicenseReviewStatus,
      rejection_reason: r.rejection_reason,
      submitted_at: r.submitted_at,
      reviewed_at: r.reviewed_at,
      user: r.user ? hydrateUser(r.user) : null,
    }));
  }

  async approveLicenseReview(
    reviewId: string,
  ): Promise<{ review: import("@concertride/types").LicenseReview; user: import("@concertride/types").User | null }> {
    const now = new Date().toISOString();
    await this.db
      .update(schema.licenseReviews)
      .set({ status: "approved", reviewed_at: now })
      .where(eq(schema.licenseReviews.id, reviewId));
    const row = await this.db.query.licenseReviews.findFirst({ where: eq(schema.licenseReviews.id, reviewId) });
    if (!row) throw new Error("license_review_not_found");
    const user = await this.verifyLicense(row.user_id);
    return {
      review: {
        id: row.id,
        user_id: row.user_id,
        file_kv_key: row.file_kv_key,
        status: "approved",
        rejection_reason: null,
        submitted_at: row.submitted_at,
        reviewed_at: now,
      },
      user,
    };
  }

  async getAdminStats(): Promise<import("./adapter").AdminStats> {
    const now = new Date().toISOString();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      totalUsers,
      verifiedEmailUsers,
      licenseVerifiedUsers,
      newLast7dUsers,
      totalActiveRides,
      totalAllRides,
      publishedLast7dRides,
      seatsAvailable,
      confirmedAllTime,
      confirmedLast7d,
      pendingBookings,
      totalConcerts,
      upcomingConcerts,
    ] = await Promise.all([
      this.db.select({ c: count() }).from(schema.users),
      this.db.select({ c: count() }).from(schema.users).where(sql`${schema.users.email_verified_at} IS NOT NULL`),
      this.db.select({ c: count() }).from(schema.users).where(eq(schema.users.license_verified, true)),
      this.db.select({ c: count() }).from(schema.users).where(gte(schema.users.created_at, sevenDaysAgo)),
      this.db.select({ c: count() }).from(schema.rides).where(eq(schema.rides.status, "active")),
      this.db.select({ c: count() }).from(schema.rides),
      this.db.select({ c: count() }).from(schema.rides).where(gte(schema.rides.created_at, sevenDaysAgo)),
      this.db.select({ s: sql<number>`COALESCE(SUM(${schema.rides.seats_left}), 0)` }).from(schema.rides).where(eq(schema.rides.status, "active")),
      this.db.select({ c: count() }).from(schema.rideRequests).where(eq(schema.rideRequests.status, "confirmed")),
      this.db.select({ c: count() }).from(schema.rideRequests).where(and(eq(schema.rideRequests.status, "confirmed"), gte(schema.rideRequests.created_at, sevenDaysAgo))),
      this.db.select({ c: count() }).from(schema.rideRequests).where(eq(schema.rideRequests.status, "pending")),
      this.db.select({ c: count() }).from(schema.concerts),
      this.db.select({ c: count() }).from(schema.concerts).where(gte(schema.concerts.date, now)),
    ]);

    const concertsWithRides = await this.db
      .selectDistinct({ concert_id: schema.rides.concert_id })
      .from(schema.rides)
      .where(eq(schema.rides.status, "active"));

    const topCitiesRows = await this.db
      .select({ city: schema.rides.origin_city, ride_count: count() })
      .from(schema.rides)
      .groupBy(schema.rides.origin_city)
      .orderBy(desc(count()))
      .limit(5);

    return {
      users: {
        total: totalUsers[0]?.c ?? 0,
        verified_email: verifiedEmailUsers[0]?.c ?? 0,
        license_verified: licenseVerifiedUsers[0]?.c ?? 0,
        new_last_7d: newLast7dUsers[0]?.c ?? 0,
      },
      rides: {
        total_active: totalActiveRides[0]?.c ?? 0,
        total_all_time: totalAllRides[0]?.c ?? 0,
        published_last_7d: publishedLast7dRides[0]?.c ?? 0,
        seats_available: Number(seatsAvailable[0]?.s ?? 0),
      },
      bookings: {
        confirmed_all_time: confirmedAllTime[0]?.c ?? 0,
        confirmed_last_7d: confirmedLast7d[0]?.c ?? 0,
        pending: pendingBookings[0]?.c ?? 0,
      },
      concerts: {
        total: totalConcerts[0]?.c ?? 0,
        upcoming: upcomingConcerts[0]?.c ?? 0,
        with_active_rides: concertsWithRides.length,
      },
      top_cities: topCitiesRows.map((r) => ({ city: r.city, ride_count: r.ride_count })),
    };
  }

  async getAdminDashboard(): Promise<import("./adapter").AdminDashboard> {
    const now = new Date().toISOString();
    const d7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const d30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const u = schema.users;
    const r = schema.rides;
    const rr = schema.rideRequests;
    const n = (rows: Array<{ c: number }>) => rows[0]?.c ?? 0;
    const s = (rows: Array<{ s: number }>) => Number(rows[0]?.s ?? 0);

    const [
      usersTotal, usersVerified, usersLicense, usersIdentity, usersPhone, usersBanned, usersHomeCity, usersNew7, usersNew30,
      ridesTotal, ridesRoundTrip, ridesSeats, ridesAvg, ridesPub7,
      bookingsTotal, reviewsTotal, reviewsAvg,
      chatMessages, directMessages, demandSignalsC, festivalDemandC, festivalAlertsC,
      eventAnticipationsC, crewConnectionsC, squadsC, squadMembersC, tripMemoriesC, activityEventsC,
      concertsTotal, concertsUpcoming, venuesC,
      reportsTotal, reportsPending, identityPending,
    ] = await Promise.all([
      this.db.select({ c: count() }).from(u),
      this.db.select({ c: count() }).from(u).where(sql`${u.email_verified_at} IS NOT NULL`),
      this.db.select({ c: count() }).from(u).where(eq(u.license_verified, true)),
      this.db.select({ c: count() }).from(u).where(eq(u.identity_verified, true)),
      this.db.select({ c: count() }).from(u).where(sql`${u.phone_verified_at} IS NOT NULL`),
      this.db.select({ c: count() }).from(u).where(sql`${u.banned_at} IS NOT NULL`),
      this.db.select({ c: count() }).from(u).where(sql`${u.home_city} IS NOT NULL`),
      this.db.select({ c: count() }).from(u).where(gte(u.created_at, d7)),
      this.db.select({ c: count() }).from(u).where(gte(u.created_at, d30)),
      this.db.select({ c: count() }).from(r),
      this.db.select({ c: count() }).from(r).where(eq(r.round_trip, true)),
      this.db.select({ s: sql<number>`COALESCE(SUM(${r.seats_left}), 0)` }).from(r).where(eq(r.status, "active")),
      this.db.select({ s: sql<number>`COALESCE(AVG(${r.price_per_seat}), 0)` }).from(r),
      this.db.select({ c: count() }).from(r).where(gte(r.created_at, d7)),
      this.db.select({ c: count() }).from(rr),
      this.db.select({ c: count() }).from(schema.reviews),
      this.db.select({ s: sql<number>`COALESCE(AVG(${schema.reviews.rating}), 0)` }).from(schema.reviews),
      this.db.select({ c: count() }).from(schema.messages),
      this.db.select({ c: count() }).from(schema.directMessages),
      this.db.select({ c: count() }).from(schema.demandSignals),
      this.db.select({ c: count() }).from(schema.festivalDemand),
      this.db.select({ c: count() }).from(schema.festivalAlerts),
      this.db.select({ c: count() }).from(schema.eventAnticipations),
      this.db.select({ c: count() }).from(schema.crewConnections),
      this.db.select({ c: count() }).from(schema.squads),
      this.db.select({ c: count() }).from(schema.squadMembers),
      this.db.select({ c: count() }).from(schema.tripMemories),
      this.db.select({ c: count() }).from(schema.activityEvents),
      this.db.select({ c: count() }).from(schema.concerts),
      this.db.select({ c: count() }).from(schema.concerts).where(gte(schema.concerts.date, now)),
      this.db.select({ c: count() }).from(schema.venues),
      this.db.select({ c: count() }).from(schema.reports),
      this.db.select({ c: count() }).from(schema.reports).where(eq(schema.reports.status, "pending")),
      this.db.select({ c: count() }).from(schema.identityReviews).where(eq(schema.identityReviews.status, "pending")),
    ]);

    const [ridesByStatus, bookingsByStatus, favByKind, licenseByStatus, activityByKind, topCities, topConcerts, signupsByDay, ridesByDay] = await Promise.all([
      this.db.select({ k: r.status, c: count() }).from(r).groupBy(r.status),
      this.db.select({ k: rr.status, c: count() }).from(rr).groupBy(rr.status),
      this.db.select({ k: schema.favorites.kind, c: count() }).from(schema.favorites).groupBy(schema.favorites.kind),
      this.db.select({ k: schema.licenseReviews.status, c: count() }).from(schema.licenseReviews).groupBy(schema.licenseReviews.status),
      this.db.select({ k: schema.activityEvents.kind, c: count() }).from(schema.activityEvents).groupBy(schema.activityEvents.kind).orderBy(desc(count())),
      this.db.select({ city: r.origin_city, ride_count: count() }).from(r).groupBy(r.origin_city).orderBy(desc(count())).limit(8),
      this.db.select({ concert_id: r.concert_id, name: schema.concerts.name, ride_count: count() }).from(r).leftJoin(schema.concerts, eq(r.concert_id, schema.concerts.id)).groupBy(r.concert_id).orderBy(desc(count())).limit(8),
      this.db.select({ date: sql<string>`substr(${u.created_at}, 1, 10)`, c: count() }).from(u).where(gte(u.created_at, d30)).groupBy(sql`substr(${u.created_at}, 1, 10)`).orderBy(asc(sql`substr(${u.created_at}, 1, 10)`)),
      this.db.select({ date: sql<string>`substr(${r.created_at}, 1, 10)`, c: count() }).from(r).where(gte(r.created_at, d30)).groupBy(sql`substr(${r.created_at}, 1, 10)`).orderBy(asc(sql`substr(${r.created_at}, 1, 10)`)),
    ]);

    const rideStatus = (st: string) => ridesByStatus.find((x) => x.k === st)?.c ?? 0;
    const bookStatus = (st: string) => bookingsByStatus.find((x) => x.k === st)?.c ?? 0;
    const favKind = (k: string) => favByKind.find((x) => x.k === k)?.c ?? 0;
    const licStatus = (st: string) => licenseByStatus.find((x) => x.k === st)?.c ?? 0;

    return {
      generated_at: new Date().toISOString(),
      users: {
        total: n(usersTotal),
        verified_email: n(usersVerified),
        unverified_email: n(usersTotal) - n(usersVerified),
        license_verified: n(usersLicense),
        identity_verified: n(usersIdentity),
        phone_verified: n(usersPhone),
        banned: n(usersBanned),
        with_home_city: n(usersHomeCity),
        new_7d: n(usersNew7),
        new_30d: n(usersNew30),
      },
      rides: {
        total: n(ridesTotal),
        active: rideStatus("active"),
        full: rideStatus("full"),
        completed: rideStatus("completed"),
        cancelled: rideStatus("cancelled"),
        round_trip: n(ridesRoundTrip),
        seats_available: s(ridesSeats),
        avg_price: Math.round(s(ridesAvg) * 100) / 100,
        published_7d: n(ridesPub7),
      },
      bookings: {
        total: n(bookingsTotal),
        pending: bookStatus("pending"),
        confirmed: bookStatus("confirmed"),
        rejected: bookStatus("rejected"),
        cancelled: bookStatus("cancelled"),
      },
      reviews: { total: n(reviewsTotal), avg_rating: Math.round(s(reviewsAvg) * 100) / 100 },
      favorites: { total: favKind("concert") + favKind("artist") + favKind("city"), concert: favKind("concert"), artist: favKind("artist"), city: favKind("city") },
      engagement: {
        chat_messages: n(chatMessages),
        direct_messages: n(directMessages),
        demand_signals: n(demandSignalsC),
        festival_demand: n(festivalDemandC),
        festival_alerts: n(festivalAlertsC),
        event_anticipations: n(eventAnticipationsC),
        crew_connections: n(crewConnectionsC),
        squads: n(squadsC),
        squad_members: n(squadMembersC),
        trip_memories: n(tripMemoriesC),
        activity_events: n(activityEventsC),
      },
      catalog: { concerts: n(concertsTotal), upcoming_concerts: n(concertsUpcoming), venues: n(venuesC) },
      moderation: {
        reports_pending: n(reportsPending),
        reports_total: n(reportsTotal),
        license_pending: licStatus("pending"),
        license_approved: licStatus("approved"),
        license_rejected: licStatus("rejected"),
        identity_pending: n(identityPending),
      },
      top_cities: topCities.map((x) => ({ city: x.city, ride_count: x.ride_count })),
      top_concerts: topConcerts.map((x) => ({ concert_id: x.concert_id, name: x.name ?? "—", ride_count: x.ride_count })),
      activity_by_kind: activityByKind.map((x) => ({ kind: x.k, count: x.c })),
      signups_by_day: signupsByDay.map((x) => ({ date: x.date, count: x.c })),
      rides_by_day: ridesByDay.map((x) => ({ date: x.date, count: x.c })),
    };
  }

  async listAdminUsers(): Promise<import("./adapter").AdminUserListItem[]> {
    const u = schema.users;
    const [users, ridesByDriver, reqByPassenger, favByUser, msgByUser, revByReviewee] = await Promise.all([
      this.db.select().from(u).orderBy(desc(u.created_at)),
      this.db.select({ id: schema.rides.driver_id, c: count() }).from(schema.rides).groupBy(schema.rides.driver_id),
      this.db.select({ id: schema.rideRequests.passenger_id, c: count() }).from(schema.rideRequests).groupBy(schema.rideRequests.passenger_id),
      this.db.select({ id: schema.favorites.user_id, c: count() }).from(schema.favorites).groupBy(schema.favorites.user_id),
      this.db.select({ id: schema.messages.user_id, c: count() }).from(schema.messages).groupBy(schema.messages.user_id),
      this.db.select({ id: schema.reviews.reviewee_id, c: count() }).from(schema.reviews).groupBy(schema.reviews.reviewee_id),
    ]);
    const toMap = (rows: Array<{ id: string; c: number }>) => new Map(rows.map((x) => [x.id, x.c]));
    const rides = toMap(ridesByDriver);
    const reqs = toMap(reqByPassenger);
    const favs = toMap(favByUser);
    const msgs = toMap(msgByUser);
    const revs = toMap(revByReviewee);
    return users.map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      avatar_url: row.avatar_url,
      email_verified: row.email_verified_at != null,
      license_verified: row.license_verified,
      identity_verified: row.identity_verified,
      phone_verified: row.phone_verified_at != null,
      banned: row.banned_at != null,
      home_city: row.home_city,
      rating: row.rating,
      created_at: row.created_at,
      rides_published: rides.get(row.id) ?? 0,
      requests_made: reqs.get(row.id) ?? 0,
      favorites_count: favs.get(row.id) ?? 0,
      messages_sent: msgs.get(row.id) ?? 0,
      reviews_received: revs.get(row.id) ?? 0,
    }));
  }

  async getAdminUserDetail(userId: string): Promise<import("./adapter").AdminUserDetail | null> {
    const user = await this.getUser(userId);
    if (!user) return null;
    const r = schema.rides;
    const [rideRows, reqRows, favRows, msgRows, revRows, antRows] = await Promise.all([
      this.db.select({
        id: r.id, concert_id: r.concert_id, concert_name: schema.concerts.name, origin_city: r.origin_city,
        status: r.status, price_per_seat: r.price_per_seat, seats_total: r.seats_total, seats_left: r.seats_left,
        departure_time: r.departure_time, created_at: r.created_at,
      }).from(r).leftJoin(schema.concerts, eq(r.concert_id, schema.concerts.id)).where(eq(r.driver_id, userId)).orderBy(desc(r.created_at)),
      this.db.select({ id: schema.rideRequests.id, ride_id: schema.rideRequests.ride_id, status: schema.rideRequests.status, seats: schema.rideRequests.seats, created_at: schema.rideRequests.created_at }).from(schema.rideRequests).where(eq(schema.rideRequests.passenger_id, userId)).orderBy(desc(schema.rideRequests.created_at)),
      this.db.select({ id: schema.favorites.id, kind: schema.favorites.kind, target_id: schema.favorites.target_id, label: schema.favorites.label, created_at: schema.favorites.created_at }).from(schema.favorites).where(eq(schema.favorites.user_id, userId)).orderBy(desc(schema.favorites.created_at)),
      this.db.select({ id: schema.messages.id, ride_id: schema.messages.ride_id, concert_id: schema.messages.concert_id, kind: schema.messages.kind, body: schema.messages.body, created_at: schema.messages.created_at }).from(schema.messages).where(eq(schema.messages.user_id, userId)).orderBy(desc(schema.messages.created_at)).limit(200),
      this.db.select({ id: schema.reviews.id, rating: schema.reviews.rating, comment: schema.reviews.comment, created_at: schema.reviews.created_at }).from(schema.reviews).where(eq(schema.reviews.reviewee_id, userId)).orderBy(desc(schema.reviews.created_at)),
      this.db.select({ id: schema.eventAnticipations.id, concert_id: schema.eventAnticipations.concert_id, status: schema.eventAnticipations.status, created_at: schema.eventAnticipations.created_at }).from(schema.eventAnticipations).where(eq(schema.eventAnticipations.user_id, userId)).orderBy(desc(schema.eventAnticipations.created_at)),
    ]);
    return {
      user,
      rides: rideRows.map((x) => ({ ...x })),
      requests: reqRows.map((x) => ({ ...x })),
      favorites: favRows.map((x) => ({ ...x })),
      messages: msgRows.map((x) => ({ ...x })),
      reviews_received: revRows.map((x) => ({ ...x })),
      anticipations: antRows.map((x) => ({ ...x })),
    };
  }

  async banUser(adminId: string, userId: string, reason: string): Promise<User | null> {
    const now = new Date().toISOString();
    await this.db.update(schema.users).set({ banned_at: now, ban_reason: reason }).where(eq(schema.users.id, userId));
    const user = await this.db.query.users.findFirst({ where: eq(schema.users.id, userId) });
    if (!user) return null;
    // Add to banned_emails so they can't re-register with the same email
    if (user.email) {
      const emailId = `be_${crypto.randomUUID().slice(0, 10)}`;
      await this.db.insert(schema.bannedEmails).values({ id: emailId, email: user.email, reason }).onConflictDoNothing();
    }
    await this.logAdminAction(adminId, "ban_user", userId, reason);
    return this.getUser(userId);
  }

  async unbanUser(adminId: string, userId: string): Promise<User | null> {
    await this.db.update(schema.users).set({ banned_at: null, ban_reason: null }).where(eq(schema.users.id, userId));
    await this.logAdminAction(adminId, "unban_user", userId);
    return this.getUser(userId);
  }

  async isEmailBanned(email: string): Promise<boolean> {
    const row = await this.db.query.bannedEmails.findFirst({
      where: eq(schema.bannedEmails.email, email.toLowerCase()),
    });
    return !!row;
  }

  async logAdminAction(
    adminId: string,
    action: AdminAuditAction,
    targetUserId?: string,
    details?: string,
  ): Promise<AdminAuditLogEntry> {
    const id = `al_${crypto.randomUUID().slice(0, 10)}`;
    await this.db.insert(schema.adminAuditLog).values({
      id,
      admin_id: adminId,
      action,
      target_user_id: targetUserId ?? null,
      details: details ?? null,
    });
    return {
      id,
      admin_id: adminId,
      action,
      target_user_id: targetUserId ?? null,
      details: details ?? null,
      created_at: new Date().toISOString(),
    };
  }

  async listAdminAuditLog(limit = 100): Promise<AdminAuditLogEntry[]> {
    const rows = await this.db.query.adminAuditLog.findMany({
      orderBy: desc(schema.adminAuditLog.created_at),
      limit,
    });
    return rows.map((r) => ({
      id: r.id,
      admin_id: r.admin_id,
      action: r.action as AdminAuditAction,
      target_user_id: r.target_user_id,
      details: r.details,
      created_at: r.created_at,
    }));
  }

  async markPhoneVerified(userId: string): Promise<User | null> {
    const now = new Date().toISOString();
    await this.db.update(schema.users).set({ phone_verified_at: now }).where(eq(schema.users.id, userId));
    return this.getUser(userId);
  }

  async rejectLicenseReview(reviewId: string, reason: string): Promise<import("@concertride/types").LicenseReview | null> {
    const now = new Date().toISOString();
    await this.db
      .update(schema.licenseReviews)
      .set({ status: "rejected", rejection_reason: reason, reviewed_at: now })
      .where(eq(schema.licenseReviews.id, reviewId));
    const row = await this.db.query.licenseReviews.findFirst({ where: eq(schema.licenseReviews.id, reviewId) });
    if (!row) return null;
    return {
      id: row.id,
      user_id: row.user_id,
      file_kv_key: row.file_kv_key,
      status: "rejected",
      rejection_reason: reason,
      submitted_at: row.submitted_at,
      reviewed_at: now,
    };
  }

  async createIdentityReview(userId: string, fileKvKey: string): Promise<import("@concertride/types").IdentityReview> {
    const id = `ir_${crypto.randomUUID().slice(0, 10)}`;
    await this.db.insert(schema.identityReviews).values({ id, user_id: userId, file_kv_key: fileKvKey });
    const row = await this.db.query.identityReviews.findFirst({ where: eq(schema.identityReviews.id, id) });
    return row as import("@concertride/types").IdentityReview;
  }

  async getMyIdentityReview(userId: string): Promise<import("@concertride/types").IdentityReview | null> {
    const row = await this.db.query.identityReviews.findFirst({
      where: eq(schema.identityReviews.user_id, userId),
      orderBy: (t, { desc }) => [desc(t.submitted_at)],
    });
    return row ?? null;
  }

  async listIdentityReviews(filter?: { status?: "pending" | "approved" | "rejected" }): Promise<Array<import("@concertride/types").IdentityReview & { user: import("@concertride/types").User | null }>> {
    const rows = await this.db.query.identityReviews.findMany({
      where: filter?.status ? eq(schema.identityReviews.status, filter.status) : undefined,
      orderBy: (t, { desc }) => [desc(t.submitted_at)],
    });
    const result = await Promise.all(
      rows.map(async (r) => ({
        ...r,
        status: r.status as import("@concertride/types").IdentityReviewStatus,
        rejection_reason: r.rejection_reason ?? null,
        reviewed_at: r.reviewed_at ?? null,
        user: await this.getUser(r.user_id),
      })),
    );
    return result;
  }

  async approveIdentityReview(reviewId: string): Promise<{ review: import("@concertride/types").IdentityReview; user: import("@concertride/types").User | null }> {
    const now = new Date().toISOString();
    await this.db
      .update(schema.identityReviews)
      .set({ status: "approved", reviewed_at: now })
      .where(eq(schema.identityReviews.id, reviewId));
    const row = await this.db.query.identityReviews.findFirst({ where: eq(schema.identityReviews.id, reviewId) });
    if (!row) throw new Error("identity_review_not_found");
    const user = await this.verifyIdentity(row.user_id);
    return {
      review: {
        id: row.id,
        user_id: row.user_id,
        file_kv_key: row.file_kv_key,
        status: "approved",
        rejection_reason: null,
        submitted_at: row.submitted_at,
        reviewed_at: now,
      },
      user,
    };
  }

  async rejectIdentityReview(reviewId: string, reason: string): Promise<import("@concertride/types").IdentityReview | null> {
    const now = new Date().toISOString();
    await this.db
      .update(schema.identityReviews)
      .set({ status: "rejected", rejection_reason: reason, reviewed_at: now })
      .where(eq(schema.identityReviews.id, reviewId));
    const row = await this.db.query.identityReviews.findFirst({ where: eq(schema.identityReviews.id, reviewId) });
    if (!row) return null;
    return {
      id: row.id,
      user_id: row.user_id,
      file_kv_key: row.file_kv_key,
      status: "rejected",
      rejection_reason: reason,
      submitted_at: row.submitted_at,
      reviewed_at: now,
    };
  }

  async verifyIdentity(userId: string): Promise<import("@concertride/types").User | null> {
    await this.db
      .update(schema.users)
      .set({ identity_verified: true })
      .where(eq(schema.users.id, userId));
    return this.getUser(userId);
  }

  async listChecklistForRide(rideId: string) {
    const rows = await this.db.query.rideChecklist.findMany({
      where: eq(schema.rideChecklist.ride_id, rideId),
      orderBy: asc(schema.rideChecklist.created_at),
    });
    return rows.map((r) => ({
      id: r.id,
      item_type: r.item_type,
      value: r.value,
      status: r.status,
      created_at: r.created_at,
      confirmed_at: r.confirmed_at,
    }));
  }

  async createChecklistItem(
    rideId: string,
    itemType: "pickup_location" | "pickup_time" | "driver_phone" | "luggage_confirmation",
    value?: string,
  ) {
    const id = `rc_${crypto.randomUUID().slice(0, 10)}`;
    const now = new Date().toISOString();
    await this.db.insert(schema.rideChecklist).values({
      id,
      ride_id: rideId,
      item_type: itemType,
      value,
      status: "pending",
      created_at: now,
    });
    const row = await this.db.query.rideChecklist.findFirst({ where: eq(schema.rideChecklist.id, id) });
    if (!row) throw new Error("Failed to create checklist item");
    return {
      id: row.id,
      item_type: row.item_type,
      value: row.value,
      status: row.status,
      created_at: row.created_at,
      confirmed_at: row.confirmed_at,
    };
  }

  async confirmChecklistItem(itemId: string) {
    const now = new Date().toISOString();
    await this.db.update(schema.rideChecklist).set({ status: "confirmed", confirmed_at: now }).where(eq(schema.rideChecklist.id, itemId));
    const row = await this.db.query.rideChecklist.findFirst({ where: eq(schema.rideChecklist.id, itemId) });
    if (!row) return null;
    return {
      id: row.id,
      item_type: row.item_type,
      value: row.value,
      status: row.status,
      created_at: row.created_at,
      confirmed_at: row.confirmed_at,
    };
  }

  // --- festival alerts ---
  async subscribeFestivalAlert(email: string, festivalSlug: string): Promise<{ created: boolean }> {
    try {
      await this.db.insert(schema.festivalAlerts).values({
        id: `fa_${crypto.randomUUID().slice(0, 10)}`,
        email,
        festival_slug: festivalSlug,
      });
      return { created: true };
    } catch {
      // Unique constraint violation — already subscribed
      return { created: false };
    }
  }

  // --- festival demand signals ---
  async registerFestivalDemand(params: {
    festival_slug: string;
    origin_city: string;
    user_id?: string;
    email?: string;
  }): Promise<{ created: boolean }> {
    const id = crypto.randomUUID();
    try {
      await this.db.insert(schema.festivalDemand).values({
        id,
        festival_slug: params.festival_slug,
        origin_city: params.origin_city,
        user_id: params.user_id ?? null,
        email: params.email ?? null,
        created_at: new Date().toISOString(),
        notified_at: null,
      });
      return { created: true };
    } catch {
      return { created: false };
    }
  }

  async getFestivalDemandCount(festival_slug: string, origin_city?: string): Promise<number> {
    const conditions = [eq(schema.festivalDemand.festival_slug, festival_slug)];
    if (origin_city) conditions.push(eq(schema.festivalDemand.origin_city, origin_city));
    const rows = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.festivalDemand)
      .where(and(...conditions));
    return rows[0]?.count ?? 0;
  }

  async notifyFestivalDemand(festival_slug: string, origin_city: string): Promise<number> {
    const pending = await this.db
      .select()
      .from(schema.festivalDemand)
      .where(
        and(
          eq(schema.festivalDemand.festival_slug, festival_slug),
          eq(schema.festivalDemand.origin_city, origin_city),
          isNull(schema.festivalDemand.notified_at),
        ),
      );
    if (pending.length === 0) return 0;
    await this.db
      .update(schema.festivalDemand)
      .set({ notified_at: new Date().toISOString() })
      .where(
        and(
          eq(schema.festivalDemand.festival_slug, festival_slug),
          eq(schema.festivalDemand.origin_city, origin_city),
          isNull(schema.festivalDemand.notified_at),
        ),
      );
    return pending.length;
  }

  async getPopularPickupPoints(city: string): Promise<Array<{
    origin_address: string;
    origin_lat: number;
    origin_lng: number;
    frequency: number;
  }>> {
    // Join rides → concerts → venues to filter by city
    const rows = await this.db
      .select({
        origin_address: schema.rides.origin_address,
        origin_lat: schema.rides.origin_lat,
        origin_lng: schema.rides.origin_lng,
        frequency: sql<number>`count(*)`,
      })
      .from(schema.rides)
      .innerJoin(schema.concerts, eq(schema.rides.concert_id, schema.concerts.id))
      .innerJoin(schema.venues, eq(schema.concerts.venue_id, schema.venues.id))
      .where(eq(schema.venues.city, city))
      .groupBy(schema.rides.origin_lat, schema.rides.origin_lng)
      .orderBy(sql`count(*) desc`)
      .limit(10);
    return rows;
  }

  // ============================================================
  // SOCIAL DENSITY (Phase 1)
  // ============================================================

  private hydrateCrewMember(row: schema.CrewConnectionRow, otherUser: User, viewerId: string, ridesTogether = 0, originConcertLabel: string | null = null): CrewMember {
    return {
      user: otherUser,
      status: row.status,
      initiated_by_me: row.requested_by === viewerId,
      origin_ride_id: row.origin_ride_id,
      origin_concert_id: row.origin_concert_id,
      origin_concert_label: originConcertLabel,
      shared_genres: otherUser.music_genres ?? [],
      shared_artists: [],
      rides_together: ridesTogether,
      connected_at: row.accepted_at ?? row.created_at,
    };
  }

  async listCrewForUser(userId: string): Promise<CrewListResponse> {
    const rows = await this.db
      .select()
      .from(schema.crewConnections)
      .where(or(eq(schema.crewConnections.a_id, userId), eq(schema.crewConnections.b_id, userId)));
    if (!rows.length) {
      return { crew: [], pending_incoming: [], pending_outgoing: [], total: 0 };
    }
    const otherIds = Array.from(new Set(rows.map((r) => (r.a_id === userId ? r.b_id : r.a_id))));
    const userRows = await this.db
      .select()
      .from(schema.users)
      .where(inArray(schema.users.id, otherIds));
    const userMap = new Map(userRows.map((u) => [u.id, hydratePublicUser(u)]));
    const accepted: CrewMember[] = [];
    const incoming: CrewMember[] = [];
    const outgoing: CrewMember[] = [];
    for (const row of rows) {
      const otherId = row.a_id === userId ? row.b_id : row.a_id;
      const other = userMap.get(otherId);
      if (!other) continue;
      const member = this.hydrateCrewMember(row, other, userId);
      if (row.status === "accepted") accepted.push(member);
      else if (row.status === "pending") {
        if (row.requested_by === userId) outgoing.push(member);
        else incoming.push(member);
      }
    }
    return { crew: accepted, pending_incoming: incoming, pending_outgoing: outgoing, total: accepted.length };
  }

  async inviteToCrew(viewer: User, otherUserId: string, opts?: { ride_id?: string }): Promise<CrewMember | null> {
    if (viewer.id === otherUserId) return null;
    const [a, b] = viewer.id < otherUserId ? [viewer.id, otherUserId] : [otherUserId, viewer.id];
    const otherRow = await this.db.query.users.findFirst({ where: eq(schema.users.id, otherUserId) });
    if (!otherRow) return null;
    const existing = await this.db.query.crewConnections.findFirst({
      where: and(eq(schema.crewConnections.a_id, a), eq(schema.crewConnections.b_id, b)),
    });
    if (existing) return this.hydrateCrewMember(existing, hydratePublicUser(otherRow), viewer.id);
    let originConcertId: string | null = null;
    if (opts?.ride_id) {
      const ride = await this.db.query.rides.findFirst({ where: eq(schema.rides.id, opts.ride_id) });
      if (ride) originConcertId = ride.concert_id;
    }
    const row: schema.CrewConnectionRow = {
      id: `cr_${crypto.randomUUID().slice(0, 10)}`,
      a_id: a,
      b_id: b,
      requested_by: viewer.id,
      status: "pending",
      origin_ride_id: opts?.ride_id ?? null,
      origin_concert_id: originConcertId,
      created_at: new Date().toISOString(),
      accepted_at: null,
    };
    await this.db.insert(schema.crewConnections).values(row);
    return this.hydrateCrewMember(row, hydratePublicUser(otherRow), viewer.id);
  }

  async acceptCrewInvite(viewerId: string, otherUserId: string): Promise<CrewMember | null> {
    const [a, b] = viewerId < otherUserId ? [viewerId, otherUserId] : [otherUserId, viewerId];
    const existing = await this.db.query.crewConnections.findFirst({
      where: and(eq(schema.crewConnections.a_id, a), eq(schema.crewConnections.b_id, b)),
    });
    if (!existing || existing.status !== "pending" || existing.requested_by === viewerId) return null;
    const now = new Date().toISOString();
    await this.db
      .update(schema.crewConnections)
      .set({ status: "accepted", accepted_at: now })
      .where(eq(schema.crewConnections.id, existing.id));
    await this.db
      .update(schema.users)
      .set({ crew_count: sql`crew_count + 1` })
      .where(inArray(schema.users.id, [a, b]));
    const otherRow = await this.db.query.users.findFirst({ where: eq(schema.users.id, otherUserId) });
    if (!otherRow) return null;
    return this.hydrateCrewMember({ ...existing, status: "accepted", accepted_at: now }, hydratePublicUser(otherRow), viewerId);
  }

  async removeCrewConnection(viewerId: string, otherUserId: string): Promise<void> {
    const [a, b] = viewerId < otherUserId ? [viewerId, otherUserId] : [otherUserId, viewerId];
    const existing = await this.db.query.crewConnections.findFirst({
      where: and(eq(schema.crewConnections.a_id, a), eq(schema.crewConnections.b_id, b)),
    });
    if (!existing) return;
    await this.db.delete(schema.crewConnections).where(eq(schema.crewConnections.id, existing.id));
    if (existing.status === "accepted") {
      await this.db
        .update(schema.users)
        .set({ crew_count: sql`max(0, crew_count - 1)` })
        .where(inArray(schema.users.id, [a, b]));
    }
  }

  async listCrewAttendingConcert(viewerId: string, concertId: string): Promise<CrewMember[]> {
    const { crew } = await this.listCrewForUser(viewerId);
    if (!crew.length) return [];
    const crewIds = crew.map((c) => c.user.id);
    const ant = await this.db
      .select({ user_id: schema.eventAnticipations.user_id })
      .from(schema.eventAnticipations)
      .where(and(eq(schema.eventAnticipations.concert_id, concertId), inArray(schema.eventAnticipations.user_id, crewIds)));
    const drivers = await this.db
      .select({ driver_id: schema.rides.driver_id })
      .from(schema.rides)
      .where(and(eq(schema.rides.concert_id, concertId), inArray(schema.rides.driver_id, crewIds)));
    const requests = await this.db
      .select({ passenger_id: schema.rideRequests.passenger_id })
      .from(schema.rideRequests)
      .innerJoin(schema.rides, eq(schema.rideRequests.ride_id, schema.rides.id))
      .where(and(eq(schema.rides.concert_id, concertId), inArray(schema.rideRequests.passenger_id, crewIds), eq(schema.rideRequests.status, "confirmed")));
    const attendingIds = new Set<string>();
    for (const r of ant) attendingIds.add(r.user_id);
    for (const r of drivers) attendingIds.add(r.driver_id);
    for (const r of requests) attendingIds.add(r.passenger_id);
    return crew.filter((c) => attendingIds.has(c.user.id));
  }

  async recordActivity(input: {
    actor: User;
    kind: ActivityKind;
    target_id?: string | null;
    concert_id?: string | null;
    city?: string | null;
    label?: string;
    metadata?: Record<string, unknown> | null;
    visibility?: "public" | "crew" | "private";
  }): Promise<ActivityEvent> {
    const row: schema.ActivityEventRow = {
      id: `ae_${crypto.randomUUID().slice(0, 10)}`,
      actor_id: input.actor.id,
      kind: input.kind,
      target_id: input.target_id ?? null,
      concert_id: input.concert_id ?? null,
      city: input.city ?? null,
      actor_name: input.actor.name,
      actor_avatar: input.actor.avatar_url,
      label: input.label ?? "",
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      visibility: input.visibility ?? "public",
      created_at: new Date().toISOString(),
    };
    await this.db.insert(schema.activityEvents).values(row);
    return {
      id: row.id,
      actor_id: row.actor_id,
      actor_name: row.actor_name,
      actor_avatar: row.actor_avatar,
      kind: row.kind as ActivityKind,
      target_id: row.target_id,
      concert_id: row.concert_id,
      concert_name: null,
      city: row.city,
      label: row.label,
      metadata: input.metadata ?? null,
      created_at: row.created_at,
    };
  }

  async listActivity(viewer: User | null, query: ActivityFeedQuery): Promise<ActivityFeedResponse> {
    const limit = Math.min(query.limit ?? 30, 100);
    const conditions: ReturnType<typeof eq>[] = [];
    if (query.scope === "self" && viewer) {
      conditions.push(eq(schema.activityEvents.actor_id, viewer.id));
    } else if (query.scope === "crew" && viewer) {
      const { crew } = await this.listCrewForUser(viewer.id);
      const ids = crew.map((c) => c.user.id);
      if (!ids.length) return { events: [], has_more: false };
      conditions.push(inArray(schema.activityEvents.actor_id, ids));
    } else {
      conditions.push(eq(schema.activityEvents.visibility, "public" as const));
      if (query.scope === "city" && query.city) {
        conditions.push(eq(schema.activityEvents.city, query.city.toLowerCase()));
      }
      if (query.scope === "concert" && query.concert_id) {
        conditions.push(eq(schema.activityEvents.concert_id, query.concert_id));
      }
    }
    if (query.before) {
      conditions.push(lt(schema.activityEvents.created_at, query.before));
    }
    const rows = await this.db
      .select()
      .from(schema.activityEvents)
      .where(and(...conditions))
      .orderBy(desc(schema.activityEvents.created_at))
      .limit(limit + 1);
    const hasMore = rows.length > limit;
    const events: ActivityEvent[] = rows.slice(0, limit).map((r) => ({
      id: r.id,
      actor_id: r.actor_id,
      actor_name: r.actor_name,
      actor_avatar: r.actor_avatar,
      kind: r.kind as ActivityKind,
      target_id: r.target_id,
      concert_id: r.concert_id,
      concert_name: null,
      city: r.city,
      label: r.label,
      metadata: r.metadata ? safeJson(r.metadata) : null,
      created_at: r.created_at,
    }));
    return { events, has_more: hasMore };
  }

  async setAnticipation(userId: string, concertId: string, status: AnticipationStatus): Promise<EventAnticipation> {
    const existing = await this.db.query.eventAnticipations.findFirst({
      where: and(eq(schema.eventAnticipations.user_id, userId), eq(schema.eventAnticipations.concert_id, concertId)),
    });
    if (existing) {
      await this.db
        .update(schema.eventAnticipations)
        .set({ status })
        .where(eq(schema.eventAnticipations.id, existing.id));
      return { ...existing, status };
    }
    const row: schema.EventAnticipationRow = {
      id: `ea_${crypto.randomUUID().slice(0, 10)}`,
      user_id: userId,
      concert_id: concertId,
      status,
      ride_id: null,
      notify_before_hours: 24,
      last_notified_at: null,
      created_at: new Date().toISOString(),
    };
    await this.db.insert(schema.eventAnticipations).values(row);
    return row;
  }

  async removeAnticipation(userId: string, concertId: string): Promise<void> {
    await this.db
      .delete(schema.eventAnticipations)
      .where(and(eq(schema.eventAnticipations.user_id, userId), eq(schema.eventAnticipations.concert_id, concertId)));
  }

  async getAnticipationSummary(concertId: string, viewerId: string | null): Promise<AnticipationSummary> {
    const rows = await this.db
      .select()
      .from(schema.eventAnticipations)
      .where(eq(schema.eventAnticipations.concert_id, concertId));
    const going = rows.filter((r) => r.status === "going");
    const maybe = rows.filter((r) => r.status === "maybe");
    const previewIds = going.slice(0, 8).map((r) => r.user_id);
    const previewUsers = previewIds.length
      ? await this.db.select().from(schema.users).where(inArray(schema.users.id, previewIds))
      : [];
    let crewAttending: AnticipationSummary["crew_attending"] = [];
    let userStatus: AnticipationStatus | null = null;
    if (viewerId) {
      const own = rows.find((r) => r.user_id === viewerId);
      if (own) userStatus = own.status;
      const { crew } = await this.listCrewForUser(viewerId);
      const crewIds = new Set(crew.map((c) => c.user.id));
      crewAttending = previewUsers
        .filter((u) => crewIds.has(u.id))
        .map((u) => ({ id: u.id, name: u.name, avatar_url: u.avatar_url }));
    }
    return {
      going_count: going.length,
      maybe_count: maybe.length,
      user_status: userStatus,
      preview: previewUsers.map((u) => ({ id: u.id, name: u.name, avatar_url: u.avatar_url })),
      crew_attending: crewAttending,
    };
  }

  async listAnticipatedConcerts(userId: string): Promise<Array<{ concert: Concert; status: AnticipationStatus }>> {
    const rows = await this.db
      .select()
      .from(schema.eventAnticipations)
      .where(eq(schema.eventAnticipations.user_id, userId));
    if (!rows.length) return [];
    const concertIds = rows.map((r) => r.concert_id);
    const concertRows = await this.db.query.concerts.findMany({
      where: inArray(schema.concerts.id, concertIds),
      with: { venue: true },
    });
    const map = new Map(concertRows.map((c) => [c.id, hydrateConcert(c as ConcertWith)]));
    return rows
      .map((r) => {
        const concert = map.get(r.concert_id);
        if (!concert) return null;
        return { concert, status: r.status };
      })
      .filter((r): r is { concert: Concert; status: AnticipationStatus } => r !== null)
      .sort((a, b) => a.concert.date.localeCompare(b.concert.date));
  }

  async createTripMemory(creator: User, input: CreateTripMemoryRequest): Promise<TripMemory | { error: string }> {
    const ride = await this.db.query.rides.findFirst({
      where: eq(schema.rides.id, input.ride_id),
      with: { concert: { with: { venue: true } } },
    });
    if (!ride || !ride.concert) return { error: "ride_not_found" };
    if (ride.driver_id !== creator.id) return { error: "only_driver_can_publish" };
    if (ride.status !== "completed") return { error: "ride_not_completed" };
    const existing = await this.db.query.tripMemories.findFirst({
      where: eq(schema.tripMemories.ride_id, input.ride_id),
    });
    if (existing) return this.hydrateTripMemory(existing, creator, ride.concert as ConcertWith);
    const row: schema.TripMemoryRow = {
      id: `tm_${crypto.randomUUID().slice(0, 10)}`,
      ride_id: input.ride_id,
      concert_id: ride.concert_id,
      created_by: creator.id,
      title: input.title?.slice(0, 80) || `${ride.origin_city} → ${ride.concert.artist}`,
      caption: input.caption?.slice(0, 280) ?? null,
      payload_json: JSON.stringify({
        vibe: ride.vibe,
        origin_city: ride.origin_city,
        destination_city: ride.concert.venue?.city ?? "",
        playlist_url: ride.playlist_url,
        hero_color: vibeHeroColor(ride.vibe),
      }),
      image_kv_key: null,
      visibility: input.visibility ?? "public",
      share_count: 0,
      created_at: new Date().toISOString(),
    };
    await this.db.insert(schema.tripMemories).values(row);
    return this.hydrateTripMemory(row, creator, ride.concert as ConcertWith);
  }

  private hydrateTripMemory(row: schema.TripMemoryRow, creator: User, concert: ConcertWith): TripMemory {
    const payload = safeJson(row.payload_json) ?? {};
    const p = payload as Record<string, unknown>;
    return {
      id: row.id,
      ride_id: row.ride_id,
      concert_id: row.concert_id,
      concert_name: concert.name,
      concert_artist: concert.artist,
      created_by: row.created_by,
      creator_name: creator.name,
      creator_avatar: creator.avatar_url,
      title: row.title,
      caption: row.caption,
      vibe: (p.vibe as Ride["vibe"]) ?? "mixed",
      origin_city: typeof p.origin_city === "string" ? p.origin_city : "",
      destination_city: typeof p.destination_city === "string" ? p.destination_city : "",
      distance_km: typeof p.distance_km === "number" ? p.distance_km : null,
      crew: Array.isArray(p.crew) ? (p.crew as TripMemory["crew"]) : [],
      playlist_url: typeof p.playlist_url === "string" ? p.playlist_url : null,
      hero_color: typeof p.hero_color === "string" ? p.hero_color : null,
      share_image_url: `/api/memories/${row.id}/share-image.svg`,
      visibility: row.visibility,
      share_count: row.share_count,
      created_at: row.created_at,
    };
  }

  async getTripMemory(id: string): Promise<TripMemory | null> {
    const row = await this.db.query.tripMemories.findFirst({ where: eq(schema.tripMemories.id, id) });
    if (!row) return null;
    const concert = await this.db.query.concerts.findFirst({
      where: eq(schema.concerts.id, row.concert_id),
      with: { venue: true },
    });
    if (!concert) return null;
    const creator = await this.getUser(row.created_by);
    if (!creator) return null;
    return this.hydrateTripMemory(row, creator, concert as ConcertWith);
  }

  async listTripMemoriesForUser(userId: string): Promise<TripMemory[]> {
    const rows = await this.db
      .select()
      .from(schema.tripMemories)
      .where(eq(schema.tripMemories.created_by, userId))
      .orderBy(desc(schema.tripMemories.created_at));
    if (!rows.length) return [];
    const concertIds = Array.from(new Set(rows.map((r) => r.concert_id)));
    const concerts = await this.db.query.concerts.findMany({
      where: inArray(schema.concerts.id, concertIds),
      with: { venue: true },
    });
    const concertMap = new Map(concerts.map((c) => [c.id, c as ConcertWith]));
    const creator = await this.getUser(userId);
    if (!creator) return [];
    return rows
      .map((r) => {
        const c = concertMap.get(r.concert_id);
        if (!c) return null;
        return this.hydrateTripMemory(r, creator, c);
      })
      .filter((m): m is TripMemory => m !== null);
  }

  async listTripMemoriesForConcert(concertId: string, limit = 12): Promise<TripMemory[]> {
    const rows = await this.db
      .select()
      .from(schema.tripMemories)
      .where(and(eq(schema.tripMemories.concert_id, concertId), eq(schema.tripMemories.visibility, "public" as const)))
      .orderBy(desc(schema.tripMemories.created_at))
      .limit(limit);
    if (!rows.length) return [];
    const concert = await this.db.query.concerts.findFirst({
      where: eq(schema.concerts.id, concertId),
      with: { venue: true },
    });
    if (!concert) return [];
    const creatorIds = Array.from(new Set(rows.map((r) => r.created_by)));
    const creators = await this.db.select().from(schema.users).where(inArray(schema.users.id, creatorIds));
    const creatorMap = new Map(creators.map((c) => [c.id, hydratePublicUser(c)]));
    return rows
      .map((r) => {
        const c = creatorMap.get(r.created_by);
        if (!c) return null;
        return this.hydrateTripMemory(r, c, concert as ConcertWith);
      })
      .filter((m): m is TripMemory => m !== null);
  }

  async incrementTripMemoryShare(id: string): Promise<void> {
    await this.db
      .update(schema.tripMemories)
      .set({ share_count: sql`share_count + 1` })
      .where(eq(schema.tripMemories.id, id));
  }

  // ============================================================
  // PHASE 1E — countdown reminders
  // ============================================================

  async listAnticipationsForCountdown(
    fromISO: string,
    toISO: string,
  ): Promise<Array<EventAnticipation & { concert: Concert; user: User }>> {
    const rows = await this.db
      .select()
      .from(schema.eventAnticipations)
      .innerJoin(schema.concerts, eq(schema.eventAnticipations.concert_id, schema.concerts.id))
      .where(
        and(
          isNull(schema.eventAnticipations.last_notified_at),
          gte(schema.concerts.date, fromISO),
          lte(schema.concerts.date, toISO),
        ),
      );
    if (!rows.length) return [];
    const userIds = Array.from(new Set(rows.map((r) => r.event_anticipations.user_id)));
    const userRows = await this.db.select().from(schema.users).where(inArray(schema.users.id, userIds));
    const userMap = new Map(userRows.map((u) => [u.id, hydrateUser(u)]));
    const venueIds = Array.from(new Set(rows.map((r) => r.concerts.venue_id)));
    const venueRows = await this.db.select().from(schema.venues).where(inArray(schema.venues.id, venueIds));
    const venueMap = new Map(venueRows.map((v) => [v.id, hydrateVenue(v)]));
    const out: Array<EventAnticipation & { concert: Concert; user: User }> = [];
    for (const r of rows) {
      const user = userMap.get(r.event_anticipations.user_id);
      const venue = venueMap.get(r.concerts.venue_id);
      if (!user || !venue) continue;
      const concert = hydrateConcert({ ...r.concerts, venue } as ConcertWith);
      out.push({ ...r.event_anticipations, concert, user });
    }
    return out;
  }

  async markAnticipationNotified(id: string): Promise<void> {
    await this.db
      .update(schema.eventAnticipations)
      .set({ last_notified_at: new Date().toISOString() })
      .where(eq(schema.eventAnticipations.id, id));
  }

  // ============================================================
  // PHASE 2.6 — Festival Q&A
  // ============================================================

  private async hydrateFestivalQna(row: schema.FestivalQnaRow): Promise<FestivalQna> {
    const u = await this.db.query.users.findFirst({ where: eq(schema.users.id, row.user_id) });
    return {
      id: row.id,
      festival_slug: row.festival_slug,
      user_id: row.user_id,
      user_name: u?.name ?? "Anónimo",
      user_avatar: u?.avatar_url ?? null,
      question: row.question,
      answer: row.answer,
      upvotes: row.upvotes,
      approved: !!row.approved_at,
      approved_at: row.approved_at,
      created_at: row.created_at,
    };
  }

  async listFestivalQnas(festivalSlug: string, opts?: { onlyApproved?: boolean; limit?: number }): Promise<FestivalQna[]> {
    const conditions = [eq(schema.festivalQnas.festival_slug, festivalSlug)];
    if (opts?.onlyApproved) {
      conditions.push(sql`${schema.festivalQnas.approved_at} is not null`);
    }
    const rows = await this.db
      .select()
      .from(schema.festivalQnas)
      .where(and(...conditions))
      .orderBy(desc(schema.festivalQnas.upvotes), desc(schema.festivalQnas.created_at))
      .limit(opts?.limit ?? 50);
    return Promise.all(rows.map((r) => this.hydrateFestivalQna(r)));
  }

  async createFestivalQna(user: User, input: CreateFestivalQnaRequest): Promise<FestivalQna> {
    const row: schema.FestivalQnaRow = {
      id: `fq_${crypto.randomUUID().slice(0, 10)}`,
      festival_slug: input.festival_slug,
      user_id: user.id,
      question: input.question.slice(0, 200),
      answer: input.answer.slice(0, 1000),
      upvotes: 0,
      approved_at: null,
      created_at: new Date().toISOString(),
    };
    await this.db.insert(schema.festivalQnas).values(row);
    return this.hydrateFestivalQna(row);
  }

  async approveFestivalQna(id: string): Promise<FestivalQna | null> {
    await this.db
      .update(schema.festivalQnas)
      .set({ approved_at: new Date().toISOString() })
      .where(eq(schema.festivalQnas.id, id));
    const row = await this.db.query.festivalQnas.findFirst({ where: eq(schema.festivalQnas.id, id) });
    return row ? this.hydrateFestivalQna(row) : null;
  }

  async upvoteFestivalQna(id: string): Promise<FestivalQna | null> {
    await this.db
      .update(schema.festivalQnas)
      .set({ upvotes: sql`upvotes + 1` })
      .where(eq(schema.festivalQnas.id, id));
    const row = await this.db.query.festivalQnas.findFirst({ where: eq(schema.festivalQnas.id, id) });
    return row ? this.hydrateFestivalQna(row) : null;
  }

  // ============================================================
  // PHASE 2.7 — Squads
  // ============================================================

  private async hydrateSquad(row: schema.SquadRow): Promise<Squad | null> {
    const concert = await this.db.query.concerts.findFirst({
      where: eq(schema.concerts.id, row.concert_id),
      with: { venue: true },
    });
    if (!concert) return null;
    const owner = await this.db.query.users.findFirst({ where: eq(schema.users.id, row.owner_id) });
    if (!owner) return null;
    const memberRows = await this.db
      .select()
      .from(schema.squadMembers)
      .where(and(eq(schema.squadMembers.squad_id, row.id), isNull(schema.squadMembers.left_at)));
    const memberIds = memberRows.map((m) => m.user_id);
    const memberUsers = memberIds.length
      ? await this.db.select().from(schema.users).where(inArray(schema.users.id, memberIds))
      : [];
    const userMap = new Map(memberUsers.map((u) => [u.id, hydratePublicUser(u)]));
    const members: Squad["members"] = [];
    for (const m of memberRows) {
      const user = userMap.get(m.user_id);
      if (!user) continue;
      members.push({ user, role: m.role, ride_id: m.ride_id, joined_at: m.joined_at });
    }
    const rideIds = Array.from(new Set(memberRows.map((m) => m.ride_id).filter((r): r is string => !!r)));
    const rideRows = rideIds.length
      ? await this.db.query.rides.findMany({
          where: inArray(schema.rides.id, rideIds),
          with: { driver: true, concert: { with: { venue: true } } },
        })
      : [];
    const rides = rideRows
      .map((r) => {
        if (!r.driver || !r.concert) return null;
        return hydrateRide(r as RideWith);
      })
      .filter((r): r is Ride => !!r);
    return {
      id: row.id,
      concert: hydrateConcert(concert as ConcertWith),
      owner: hydrateUser(owner),
      name: row.name,
      vibe_tags: row.vibe_tags ? row.vibe_tags.split("|").filter(Boolean) : [],
      visibility: row.visibility,
      invite_code: row.invite_code,
      invite_url: `/squads/join/${row.invite_code}`,
      members,
      rides,
      created_at: row.created_at,
    };
  }

  async createSquad(owner: User, input: CreateSquadRequest): Promise<Squad> {
    const id = `sq_${crypto.randomUUID().slice(0, 10)}`;
    const inviteCode = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
    const row: schema.SquadRow = {
      id,
      concert_id: input.concert_id,
      owner_id: owner.id,
      name: input.name.slice(0, 80),
      vibe_tags: input.vibe_tags?.length ? input.vibe_tags.join("|") : null,
      visibility: input.visibility ?? "private",
      invite_code: inviteCode,
      created_at: new Date().toISOString(),
    };
    await this.db.insert(schema.squads).values(row);
    await this.db.insert(schema.squadMembers).values({
      id: `sm_${crypto.randomUUID().slice(0, 10)}`,
      squad_id: id,
      user_id: owner.id,
      role: "owner",
      ride_id: null,
      joined_at: row.created_at,
      left_at: null,
    });
    const sq = await this.hydrateSquad(row);
    return sq!;
  }

  async getSquad(id: string): Promise<Squad | null> {
    const row = await this.db.query.squads.findFirst({ where: eq(schema.squads.id, id) });
    return row ? this.hydrateSquad(row) : null;
  }

  async getSquadByInvite(inviteCode: string): Promise<Squad | null> {
    const row = await this.db.query.squads.findFirst({ where: eq(schema.squads.invite_code, inviteCode) });
    return row ? this.hydrateSquad(row) : null;
  }

  async listSquadsForUser(userId: string): Promise<Squad[]> {
    const memberRows = await this.db
      .select()
      .from(schema.squadMembers)
      .where(and(eq(schema.squadMembers.user_id, userId), isNull(schema.squadMembers.left_at)));
    if (!memberRows.length) return [];
    const squadIds = Array.from(new Set(memberRows.map((m) => m.squad_id)));
    const rows = await this.db.select().from(schema.squads).where(inArray(schema.squads.id, squadIds));
    const out: Squad[] = [];
    for (const r of rows) {
      const sq = await this.hydrateSquad(r);
      if (sq) out.push(sq);
    }
    return out;
  }

  async listSquadsForConcert(concertId: string, opts?: { onlyPublic?: boolean }): Promise<Squad[]> {
    const conditions = [eq(schema.squads.concert_id, concertId)];
    if (opts?.onlyPublic) conditions.push(eq(schema.squads.visibility, "public" as const));
    const rows = await this.db.select().from(schema.squads).where(and(...conditions));
    const out: Squad[] = [];
    for (const r of rows) {
      const sq = await this.hydrateSquad(r);
      if (sq) out.push(sq);
    }
    return out;
  }

  async joinSquad(user: User, input: JoinSquadRequest): Promise<Squad | { error: string }> {
    const row = await this.db.query.squads.findFirst({ where: eq(schema.squads.invite_code, input.invite_code) });
    if (!row) return { error: "squad_not_found" };
    const existing = await this.db.query.squadMembers.findFirst({
      where: and(eq(schema.squadMembers.squad_id, row.id), eq(schema.squadMembers.user_id, user.id)),
    });
    if (existing) {
      const patch: Partial<schema.SquadMemberRow> = {};
      if (existing.left_at) {
        patch.left_at = null;
        patch.joined_at = new Date().toISOString();
      }
      if (input.ride_id !== undefined) patch.ride_id = input.ride_id ?? null;
      if (input.role) patch.role = input.role;
      if (Object.keys(patch).length) {
        await this.db.update(schema.squadMembers).set(patch).where(eq(schema.squadMembers.id, existing.id));
      }
    } else {
      await this.db.insert(schema.squadMembers).values({
        id: `sm_${crypto.randomUUID().slice(0, 10)}`,
        squad_id: row.id,
        user_id: user.id,
        role: input.role ?? "passenger",
        ride_id: input.ride_id ?? null,
        joined_at: new Date().toISOString(),
        left_at: null,
      });
    }
    const sq = await this.hydrateSquad(row);
    return sq!;
  }

  async leaveSquad(squadId: string, userId: string): Promise<void> {
    await this.db
      .update(schema.squadMembers)
      .set({ left_at: new Date().toISOString() })
      .where(and(eq(schema.squadMembers.squad_id, squadId), eq(schema.squadMembers.user_id, userId)));
  }

  async updateSquadMemberRole(squadId: string, userId: string, role: SquadRole, rideId?: string | null): Promise<void> {
    const patch: Partial<schema.SquadMemberRow> = { role };
    if (rideId !== undefined) patch.ride_id = rideId;
    await this.db
      .update(schema.squadMembers)
      .set(patch)
      .where(
        and(
          eq(schema.squadMembers.squad_id, squadId),
          eq(schema.squadMembers.user_id, userId),
          isNull(schema.squadMembers.left_at),
        ),
      );
  }

  // ============================================================
  // PHASE 2.9 — Playlist tracks
  // ============================================================

  private async hydratePlaylistTrack(row: schema.PlaylistTrackRow): Promise<PlaylistTrack> {
    const adder = await this.db.query.users.findFirst({ where: eq(schema.users.id, row.added_by) });
    return {
      id: row.id,
      ride_id: row.ride_id,
      squad_id: row.squad_id,
      added_by: row.added_by,
      added_by_name: adder?.name ?? "Anónimo",
      track_uri: row.track_uri,
      track_name: row.track_name,
      artist_name: row.artist_name,
      album_image_url: row.album_image_url,
      duration_ms: row.duration_ms,
      position: row.position,
      created_at: row.created_at,
    };
  }

  async listPlaylistTracks(scope: { ride_id: string } | { squad_id: string }): Promise<PlaylistTrack[]> {
    const cond = "ride_id" in scope
      ? eq(schema.playlistTracks.ride_id, scope.ride_id)
      : eq(schema.playlistTracks.squad_id, scope.squad_id);
    const rows = await this.db
      .select()
      .from(schema.playlistTracks)
      .where(cond)
      .orderBy(asc(schema.playlistTracks.position), asc(schema.playlistTracks.created_at));
    return Promise.all(rows.map((r) => this.hydratePlaylistTrack(r)));
  }

  async addPlaylistTrack(user: User, input: AddPlaylistTrackRequest): Promise<PlaylistTrack | { error: string }> {
    if (!input.ride_id && !input.squad_id) return { error: "scope_required" };
    if (input.ride_id && input.squad_id) return { error: "single_scope" };
    const cond = input.ride_id
      ? eq(schema.playlistTracks.ride_id, input.ride_id)
      : eq(schema.playlistTracks.squad_id, input.squad_id!);
    const siblingCount = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(schema.playlistTracks)
      .where(cond);
    const row: schema.PlaylistTrackRow = {
      id: `pt_${crypto.randomUUID().slice(0, 10)}`,
      ride_id: input.ride_id ?? null,
      squad_id: input.squad_id ?? null,
      added_by: user.id,
      track_uri: input.track_uri ?? null,
      track_name: input.track_name.slice(0, 200),
      artist_name: input.artist_name.slice(0, 200),
      album_image_url: input.album_image_url ?? null,
      duration_ms: input.duration_ms ?? null,
      position: siblingCount[0]?.count ?? 0,
      created_at: new Date().toISOString(),
    };
    await this.db.insert(schema.playlistTracks).values(row);
    return this.hydratePlaylistTrack(row);
  }

  async removePlaylistTrack(trackId: string, userId: string): Promise<void> {
    await this.db
      .delete(schema.playlistTracks)
      .where(and(eq(schema.playlistTracks.id, trackId), eq(schema.playlistTracks.added_by, userId)));
  }
}

function safeJson(value: string | null): Record<string, unknown> | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function vibeHeroColor(vibe: Ride["vibe"]): string {
  if (vibe === "party") return "#ff4f00";
  if (vibe === "chill") return "#9b59f7";
  return "#dbff00";
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

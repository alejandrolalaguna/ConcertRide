// In-memory store. State lives on a single Worker isolate and resets on cold
// starts. Used as a zero-config dev fallback when TURSO_DATABASE_URL is empty.

import type {
  Concert,
  CreateConcertInput,
  CreateReviewRequest,
  CreateRideRequest,
  RequestStatus,
  Review,
  Ride,
  RideRequest,
  User,
  Venue,
} from "@concertride/types";
import { CONCERTS, RIDES, USERS, VENUES } from "../fixtures";
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

interface MemoryConcert extends Concert {
  fingerprint: string;
  sources_json: string;
}

interface MemoryUser extends User {
  password_hash: string | null;
  password_salt: string | null;
}

interface StagingRow {
  id: string;
  source: SourceId;
  source_event_id: string;
  source_url: string;
  concert_id: string | null;
  raw_json: string;
  fetched_at: string;
}

export class MemoryStore implements StoreAdapter {
  private users: MemoryUser[] = USERS.map((u) => ({ ...u, password_hash: null, password_salt: null }));
  private venues: Venue[] = [...VENUES];
  private concerts: MemoryConcert[] = CONCERTS.map((c) => ({
    ...c,
    fingerprint: `${c.artist.toLowerCase()}|${c.venue.city.toLowerCase()}|${c.date.slice(0, 10)}`,
    sources_json: "[]",
  }));
  private rides: Ride[] = [...RIDES];
  private requests: RideRequest[] = [];
  private reviews: Review[] = [];
  private staging: StagingRow[] = [];

  async getUser(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const needle = email.toLowerCase();
    return this.users.find((u) => u.email.toLowerCase() === needle) ?? null;
  }

  async upsertUserByEmail(email: string): Promise<User> {
    const existing = await this.getUserByEmail(email);
    if (existing) return existing;
    const user: MemoryUser = {
      id: `u_${crypto.randomUUID().slice(0, 8)}`,
      email: email.toLowerCase(),
      name: nameFromEmail(email),
      avatar_url: null,
      verified: false,
      rating: 0,
      rating_count: 0,
      car_model: null,
      car_color: null,
      rides_given: 0,
      password_hash: null,
      password_salt: null,
      created_at: new Date().toISOString(),
    };
    this.users = [user, ...this.users];
    return user;
  }

  async createUserWithPassword(
    email: string,
    name: string,
    hash: string,
    salt: string,
  ): Promise<User> {
    const user: MemoryUser = {
      id: `u_${crypto.randomUUID().slice(0, 8)}`,
      email: email.toLowerCase(),
      name,
      avatar_url: null,
      verified: false,
      rating: 0,
      rating_count: 0,
      car_model: null,
      car_color: null,
      rides_given: 0,
      password_hash: hash,
      password_salt: salt,
      created_at: new Date().toISOString(),
    };
    this.users = [user, ...this.users];
    return user;
  }

  async getPasswordHash(userId: string): Promise<{ hash: string; salt: string } | null> {
    const u = this.users.find((u) => u.id === userId);
    if (!u || !u.password_hash || !u.password_salt) return null;
    return { hash: u.password_hash, salt: u.password_salt };
  }

  async listVenues(): Promise<Venue[]> {
    return this.venues;
  }

  async ensureVenue(input: {
    name: string;
    city: string;
    lat: number | null;
    lng: number | null;
  }): Promise<Venue> {
    const normName = normalizeVenueName(input.name);
    const normCity = input.city.trim().toLowerCase();
    const existing = this.venues.find(
      (v) => normalizeVenueName(v.name) === normName && v.city.toLowerCase() === normCity,
    );
    if (existing) return existing;
    const venue: Venue = {
      id: `v_${crypto.randomUUID().slice(0, 8)}`,
      name: input.name,
      city: input.city,
      address: "",
      lat: input.lat ?? 0,
      lng: input.lng ?? 0,
      capacity: null,
      image_url: null,
    };
    this.venues = [...this.venues, venue];
    return venue;
  }

  async listConcerts(f: ConcertFilters): Promise<{ concerts: Concert[]; total: number }> {
    let result = this.concerts.map((c) => this.toConcert(c));
    if (f.city) {
      const needle = f.city.toLowerCase();
      result = result.filter((c) => c.venue.city.toLowerCase() === needle);
    }
    if (f.artist) {
      const needle = f.artist.toLowerCase();
      result = result.filter((c) => c.artist.toLowerCase().includes(needle));
    }
    if (f.date_from) result = result.filter((c) => c.date >= f.date_from!);
    if (f.date_to) result = result.filter((c) => c.date <= f.date_to!);

    const total = result.length;
    const page = result.slice().sort((a, b) => a.date.localeCompare(b.date)).slice(f.offset, f.offset + f.limit);
    return { concerts: page, total };
  }

  async getConcert(id: string): Promise<Concert | null> {
    const c = this.concerts.find((c) => c.id === id);
    return c ? this.toConcert(c) : null;
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
    const concert: MemoryConcert = {
      id,
      name: input.name,
      artist: input.artist,
      venue_id: venue.id,
      venue,
      date: input.date,
      image_url: null,
      ticketmaster_id: null,
      genre: input.genre ?? null,
      price_min: null,
      price_max: null,
      active_rides_count: 0,
      fingerprint,
      sources_json: "[]",
    };
    this.concerts = [...this.concerts, concert];
    return this.toConcert(concert);
  }

  private toConcert(c: MemoryConcert): Concert {
    const { fingerprint: _fp, sources_json: _sj, ...rest } = c;
    return rest;
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
    const existing = this.concerts.find((c) => c.fingerprint === fingerprint);
    if (existing) {
      existing.sources_json = mergeSources(existing.sources_json, sourceRef);
      if (raw.price_min !== null && (existing.price_min === null || raw.price_min < existing.price_min)) {
        existing.price_min = raw.price_min;
      }
      if (raw.price_max !== null && (existing.price_max === null || raw.price_max > existing.price_max)) {
        existing.price_max = raw.price_max;
      }
      if (raw.image_url && !existing.image_url) existing.image_url = raw.image_url;
      return { concert_id: existing.id, is_new: false };
    }
    const venue = this.venues.find((v) => v.id === venueId);
    if (!venue) throw new Error(`Venue ${venueId} not found`);
    const id = `c_${crypto.randomUUID().slice(0, 10)}`;
    const concert: MemoryConcert = {
      id,
      name: raw.title ?? raw.artist,
      artist: raw.artist,
      venue_id: venueId,
      venue,
      date: raw.date_iso,
      image_url: raw.image_url,
      ticketmaster_id: raw.source === "ticketmaster" ? raw.source_event_id : null,
      genre: raw.genre,
      price_min: raw.price_min,
      price_max: raw.price_max,
      active_rides_count: 0,
      fingerprint,
      sources_json: JSON.stringify([sourceRef]),
    };
    this.concerts = [...this.concerts, concert];
    return { concert_id: id, is_new: true };
  }

  async listRides(f: RideFilters): Promise<Ride[]> {
    let result = this.rides;
    if (f.concert_id) result = result.filter((r) => r.concert_id === f.concert_id);
    if (f.origin_city) {
      const needle = f.origin_city.toLowerCase();
      result = result.filter((r) => r.origin_city.toLowerCase() === needle);
    }
    if (f.vibe) result = result.filter((r) => r.vibe === f.vibe);
    if (f.max_price !== undefined) result = result.filter((r) => r.price_per_seat <= f.max_price!);
    if (f.round_trip !== undefined) result = result.filter((r) => r.round_trip === f.round_trip);
    if (f.adhoc !== undefined) {
      const adhocIds = new Set(
        this.concerts
          .filter((c) => c.ticketmaster_id === null && c.sources_json === "[]" && c.id.startsWith("c_adhoc_"))
          .map((c) => c.id),
      );
      result = f.adhoc
        ? result.filter((r) => adhocIds.has(r.concert_id))
        : result.filter((r) => !adhocIds.has(r.concert_id));
    }
    return result.slice().sort((a, b) => a.departure_time.localeCompare(b.departure_time));
  }

  async getRide(id: string): Promise<Ride | null> {
    return this.rides.find((r) => r.id === id) ?? null;
  }

  async createRide(driver: User, concert: Concert, input: CreateRideRequest): Promise<Ride> {
    const ride: Ride = {
      id: crypto.randomUUID(),
      driver_id: driver.id,
      driver,
      concert_id: concert.id,
      concert,
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
      created_at: new Date().toISOString(),
    };
    this.rides = [ride, ...this.rides];
    return ride;
  }

  async listRequestsForRide(rideId: string): Promise<RideRequest[]> {
    return this.requests.filter((r) => r.ride_id === rideId);
  }

  async getRequest(id: string): Promise<RideRequest | null> {
    return this.requests.find((r) => r.id === id) ?? null;
  }

  async createRequest(
    ride: Ride,
    passenger: User,
    seats: number,
    message?: string,
  ): Promise<CreateRequestResult> {
    if (passenger.id === ride.driver_id) return { error: "cannot_request_own_ride" };
    if (ride.status !== "active") return { error: "ride_not_active" };
    if (seats > ride.seats_left) return { error: "not_enough_seats" };
    const existing = this.requests.find(
      (r) => r.ride_id === ride.id && r.passenger_id === passenger.id && r.status === "pending",
    );
    if (existing) return { error: "already_requested" };

    const req: RideRequest = {
      id: crypto.randomUUID(),
      ride_id: ride.id,
      passenger_id: passenger.id,
      passenger,
      seats,
      status: "pending",
      message: message ?? null,
      created_at: new Date().toISOString(),
    };
    this.requests = [req, ...this.requests];
    return { request: req };
  }

  async updateRequestStatus(
    requestId: string,
    status: RequestStatus,
  ): Promise<RideRequest | null> {
    const req = this.requests.find((r) => r.id === requestId);
    if (!req) return null;
    req.status = status;

    if (status === "confirmed") {
      const ride = this.rides.find((r) => r.id === req.ride_id);
      if (ride) {
        ride.seats_left = Math.max(0, ride.seats_left - req.seats);
        if (ride.seats_left === 0) ride.status = "full";
      }
    }
    return req;
  }

  async createReview(
    ride: Ride,
    reviewer: User,
    input: CreateReviewRequest,
  ): Promise<{ review?: Review; error?: string }> {
    if (reviewer.id === input.reviewee_id) return { error: "cannot_review_yourself" };
    const reviewee = this.users.find((u) => u.id === input.reviewee_id);
    if (!reviewee) return { error: "reviewee_not_found" };
    const duplicate = this.reviews.find(
      (r) => r.ride_id === ride.id && r.reviewer_id === reviewer.id && r.reviewee_id === input.reviewee_id,
    );
    if (duplicate) return { error: "already_reviewed" };
    if (input.rating < 1 || input.rating > 5) return { error: "invalid_rating" };

    const review: Review = {
      id: `rev_${crypto.randomUUID().slice(0, 10)}`,
      ride_id: ride.id,
      reviewer_id: reviewer.id,
      reviewer,
      reviewee_id: input.reviewee_id,
      reviewee,
      rating: input.rating,
      comment: input.comment ?? null,
      created_at: new Date().toISOString(),
    };
    this.reviews = [review, ...this.reviews];

    // Update reviewee's rolling average
    const userReviews = this.reviews.filter((r) => r.reviewee_id === input.reviewee_id);
    const avg = userReviews.reduce((s, r) => s + r.rating, 0) / userReviews.length;
    const u = this.users.find((u) => u.id === input.reviewee_id);
    if (u) {
      u.rating = Math.round(avg * 10) / 10;
      u.rating_count = userReviews.length;
    }

    return { review };
  }

  async listReviewsForRide(rideId: string): Promise<Review[]> {
    return this.reviews.filter((r) => r.ride_id === rideId);
  }

  async listReviewsForUser(userId: string): Promise<Review[]> {
    return this.reviews.filter((r) => r.reviewee_id === userId);
  }

  async recordSource(entry: {
    source: SourceId;
    source_event_id: string;
    source_url: string;
    concert_id: string | null;
    raw_json: string;
  }): Promise<void> {
    const existing = this.staging.find(
      (s) => s.source === entry.source && s.source_event_id === entry.source_event_id,
    );
    const row: StagingRow = {
      id: existing?.id ?? `s_${crypto.randomUUID().slice(0, 10)}`,
      source: entry.source,
      source_event_id: entry.source_event_id,
      source_url: entry.source_url,
      concert_id: entry.concert_id,
      raw_json: entry.raw_json,
      fetched_at: new Date().toISOString(),
    };
    if (existing) {
      this.staging = this.staging.map((s) => (s.id === existing.id ? row : s));
    } else {
      this.staging = [...this.staging, row];
    }
  }
}

// Module-level singleton so state persists across requests in the same isolate.
let instance: MemoryStore | null = null;
export function getMemoryStore(): MemoryStore {
  if (!instance) instance = new MemoryStore();
  return instance;
}

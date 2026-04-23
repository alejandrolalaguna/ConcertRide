// In-memory store. State lives on a single Worker isolate and resets on cold
// starts. Used as a zero-config dev fallback when TURSO_DATABASE_URL is empty.

import type {
  Concert,
  CreateConcertInput,
  CreateReviewRequest,
  CreateRideRequest,
  DemandSignal,
  Favorite,
  FavoriteKind,
  Message,
  Report,
  ReportReason,
  RequestStatus,
  Review,
  Ride,
  RideRequest,
  UpdateProfileInput,
  User,
  Venue,
} from "@concertride/types";
import { CONCERTS, RIDES, USERS, VENUES } from "../fixtures";
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

type LuggageVal = import("@concertride/types").Luggage | null;

interface DemandRow {
  id: string;
  concert_id: string;
  user_id: string;
  expires_at: string;
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
  private messages: Message[] = [];
  private demandSignals: DemandRow[] = [];
  private reviews: Review[] = [];
  private staging: StagingRow[] = [];
  private pushSubscriptions: Array<{ id: string; user_id: string; endpoint: string; p256dh: string; auth: string }> = [];
  private favorites: Array<Favorite & { user_id: string }> = [];
  private reports: Report[] = [];

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
      phone: null,
      home_city: null,
      smoker: null,
      has_license: null,
      license_verified: false,
      referral_code: crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase(),
      referral_count: 0,
      tos_accepted_at: null,
      deleted_at: null,
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
    profile?: { phone?: string; home_city?: string; smoker?: boolean; has_license?: boolean },
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
      phone: profile?.phone ?? null,
      home_city: profile?.home_city ?? null,
      smoker: profile?.smoker ?? null,
      has_license: profile?.has_license ?? null,
      license_verified: false,
      referral_code: crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase(),
      referral_count: 0,
      tos_accepted_at: new Date().toISOString(),
      deleted_at: null,
      password_hash: hash,
      password_salt: salt,
      created_at: new Date().toISOString(),
    };
    this.users = [user, ...this.users];
    return user;
  }

  async updateUser(id: string, input: UpdateProfileInput): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    if (input.name !== undefined) user.name = input.name;
    if (input.phone !== undefined) user.phone = input.phone;
    if (input.home_city !== undefined) user.home_city = input.home_city;
    if (input.smoker !== undefined) user.smoker = input.smoker;
    if (input.has_license !== undefined) user.has_license = input.has_license;
    if (input.car_model !== undefined) user.car_model = input.car_model;
    if (input.car_color !== undefined) user.car_color = input.car_color;
    return user;
  }

  async getPasswordHash(userId: string): Promise<{ hash: string; salt: string } | null> {
    const u = this.users.find((u) => u.id === userId);
    if (!u || !u.password_hash || !u.password_salt) return null;
    return { hash: u.password_hash, salt: u.password_salt };
  }

  async updatePassword(userId: string, hash: string, salt: string): Promise<void> {
    const u = this.users.find((u) => u.id === userId);
    if (!u) return;
    u.password_hash = hash;
    u.password_salt = salt;
  }

  async deleteUser(userId: string): Promise<void> {
    const u = this.users.find((u) => u.id === userId);
    if (!u) return;
    const now = new Date().toISOString();
    u.email = `deleted+${u.id}@concertride.es`;
    u.name = "Usuario eliminado";
    u.avatar_url = null;
    u.phone = null;
    u.home_city = null;
    u.car_model = null;
    u.car_color = null;
    u.password_hash = null;
    u.password_salt = null;
    u.deleted_at = now;
    // Cancel active rides they drive
    this.rides = this.rides.map((r) =>
      r.driver_id === userId && (r.status === "active" || r.status === "full")
        ? { ...r, status: "cancelled" as const }
        : r,
    );
    // Cancel pending/confirmed requests as passenger
    this.requests = this.requests.map((r) =>
      r.passenger_id === userId && (r.status === "pending" || r.status === "confirmed")
        ? { ...r, status: "cancelled" as const }
        : r,
    );
    this.pushSubscriptions = this.pushSubscriptions.filter((p) => p.user_id !== userId);
    this.favorites = this.favorites.filter((f) => f.user_id !== userId);
    this.demandSignals = this.demandSignals.filter((d) => d.user_id !== userId);
  }

  async useReferral(referralCode: string, _newUserId: string): Promise<void> {
    const referrer = this.users.find((u) => u.referral_code === referralCode);
    if (referrer) referrer.referral_count = (referrer.referral_count ?? 0) + 1;
  }

  async verifyLicense(userId: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return null;
    user.license_verified = true;
    user.has_license = true;
    return user;
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
    if (f.genre) {
      result = result.filter((c) => genreMatches(c.genre, f.genre!));
    }
    if (f.festival) {
      result = result.filter((c) => (c.genre ?? "").toLowerCase().includes("festival"));
    }
    if (f.date_from) result = result.filter((c) => c.date >= f.date_from!);
    if (f.date_to) result = result.filter((c) => c.date <= f.date_to!);

    const total = result.length;
    const now = new Date().toISOString();
    const page = result
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(f.offset, f.offset + f.limit)
      .map((c) => ({
        ...c,
        demand_count: this.demandSignals.filter(
          (d) => d.concert_id === c.id && d.expires_at > now,
        ).length,
      }));
    return { concerts: page, total };
  }

  async getConcert(id: string): Promise<Concert | null> {
    const c = this.concerts.find((c) => c.id === id);
    return c ? this.toConcert(c) : null;
  }

  async listConcertFacets(): Promise<ConcertFacets> {
    const horizon = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const genreSet = new Map<string, string>();
    const citySet = new Map<string, string>();
    for (const c of this.concerts) {
      if (c.date < horizon) continue;
      for (const tag of parseGenreTags(c.genre)) {
        const key = tag.toLowerCase();
        if (!genreSet.has(key)) genreSet.set(key, tag);
      }
      const venue = this.venues.find((v) => v.id === c.venue_id);
      if (venue?.city) {
        const key = venue.city.toLowerCase();
        if (!citySet.has(key)) citySet.set(key, venue.city);
      }
    }
    return {
      genres: [...genreSet.values()].sort((a, b) => a.localeCompare(b, "es")),
      cities: [...citySet.values()].sort((a, b) => a.localeCompare(b, "es")),
    };
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
      ticketmaster_url: null,
      official_url: input.official_url ?? null,
      lineup: input.lineup ?? null,
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
    // Fixtures carry a pre-baked active_rides_count; override it with the
    // live count so newly-published rides are reflected immediately.
    const live = this.rides.filter(
      (r) => r.concert_id === c.id && (r.status === "active" || r.status === "full"),
    ).length;
    return { ...rest, active_rides_count: live };
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
      if (raw.source === "ticketmaster" && !existing.ticketmaster_url) {
        existing.ticketmaster_url = raw.source_url;
      }
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
      ticketmaster_url: raw.source === "ticketmaster" ? raw.source_url : null,
      official_url: null,
      lineup: null,
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
    if (f.driver_id) result = result.filter((r) => r.driver_id === f.driver_id);
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
    if (f.near_lat !== undefined && f.near_lng !== undefined && f.radius_km !== undefined) {
      result = result.filter(
        (r) => haversineKm(f.near_lat!, f.near_lng!, r.origin_lat, r.origin_lng) <= f.radius_km!,
      );
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
      smoking_policy: input.smoking_policy ?? "no",
      max_luggage: input.max_luggage ?? "backpack",
      notes: input.notes ?? null,
      instant_booking: input.instant_booking ?? false,
      accepted_payment: input.accepted_payment ?? "cash",
      status: "active",
      completed_at: null,
      completion_confirmed_by: null,
      reminded_at: null,
      created_at: new Date().toISOString(),
    };
    this.rides = [ride, ...this.rides];
    return ride;
  }

  async listRidesForReminder(fromISO: string, toISO: string): Promise<Ride[]> {
    return this.rides.filter(
      (r) =>
        !r.reminded_at &&
        (r.status === "active" || r.status === "full") &&
        r.departure_time >= fromISO &&
        r.departure_time <= toISO,
    );
  }

  async markRideReminded(rideId: string): Promise<void> {
    const ride = this.rides.find((r) => r.id === rideId);
    if (ride) ride.reminded_at = new Date().toISOString();
  }

  async revokeDriverCompletion(rideId: string): Promise<Ride | null> {
    const ride = this.rides.find((r) => r.id === rideId);
    if (!ride) return null;
    if (ride.status === "completed") return ride;
    if (ride.completion_confirmed_by !== "driver") return ride;
    ride.completion_confirmed_by = null;
    return ride;
  }

  async confirmRideComplete(rideId: string, confirmedBy: "driver" | "passenger"): Promise<Ride | null> {
    const ride = this.rides.find((r) => r.id === rideId);
    if (!ride) return null;
    const wasDriverOnly = ride.completion_confirmed_by === "driver";
    if (confirmedBy === "driver") {
      ride.completion_confirmed_by = "driver";
    } else if (confirmedBy === "passenger" && wasDriverOnly) {
      ride.completion_confirmed_by = "both";
      ride.status = "completed";
      ride.completed_at = new Date().toISOString();
      // Increment driver's rides_given
      const driver = this.users.find((u) => u.id === ride.driver_id);
      if (driver) driver.rides_given = (driver.rides_given ?? 0) + 1;
    }
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
    luggage?: string,
    payment_method?: string,
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
      luggage: (luggage ?? null) as LuggageVal,
      payment_method: (payment_method ?? null) as import("@concertride/types").PaymentMethod | null,
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
    const prevStatus = req.status;
    req.status = status;

    const ride = this.rides.find((r) => r.id === req.ride_id);
    if (!ride) return req;

    // Transition: not-confirmed → confirmed  ⇒  take seats
    if (prevStatus !== "confirmed" && status === "confirmed") {
      ride.seats_left = Math.max(0, ride.seats_left - req.seats);
      if (ride.seats_left === 0) ride.status = "full";
    }
    // Transition: confirmed → cancelled/rejected  ⇒  give seats back
    if (prevStatus === "confirmed" && (status === "cancelled" || status === "rejected")) {
      ride.seats_left = Math.min(ride.seats_total, ride.seats_left + req.seats);
      if (ride.status === "full" && ride.seats_left > 0) ride.status = "active";
    }
    return req;
  }

  async getDemandSignal(concertId: string, userId: string | null): Promise<DemandSignal> {
    const now = new Date().toISOString();
    const active = this.demandSignals.filter(
      (d) => d.concert_id === concertId && d.expires_at >= now,
    );
    return { count: active.length, user_has_signaled: userId ? active.some((d) => d.user_id === userId) : false };
  }

  async toggleDemandSignal(concertId: string, user: User): Promise<DemandSignal> {
    const existing = this.demandSignals.find(
      (d) => d.concert_id === concertId && d.user_id === user.id,
    );
    if (existing) {
      this.demandSignals = this.demandSignals.filter((d) => d.id !== existing.id);
    } else {
      const concert = await this.getConcert(concertId);
      const concertDate = concert ? new Date(concert.date) : null;
      const fortyEightHoursFromNow = new Date(Date.now() + 48 * 3600 * 1000);
      const expires = concertDate && concertDate < fortyEightHoursFromNow ? concertDate : fortyEightHoursFromNow;
      this.demandSignals = [
        ...this.demandSignals,
        {
          id: `ds_${crypto.randomUUID().slice(0, 10)}`,
          concert_id: concertId,
          user_id: user.id,
          expires_at: expires.toISOString(),
        },
      ];
    }
    return this.getDemandSignal(concertId, user.id);
  }

  async listInterestedUsers(concertId: string): Promise<User[]> {
    const now = new Date().toISOString();
    const active = this.demandSignals.filter(
      (d) => d.concert_id === concertId && d.expires_at > now,
    );
    return active
      .map((d) => this.users.find((u) => u.id === d.user_id))
      .filter((u): u is MemoryUser => !!u)
      .map((u) => u as User);
  }

  async savePushSubscription(
    userId: string,
    sub: { endpoint: string; p256dh: string; auth: string },
  ): Promise<void> {
    const idx = this.pushSubscriptions.findIndex((s) => s.endpoint === sub.endpoint);
    if (idx >= 0) {
      const existing = this.pushSubscriptions[idx];
      if (existing) {
        this.pushSubscriptions[idx] = { ...existing, user_id: userId, p256dh: sub.p256dh, auth: sub.auth };
      }
    } else {
      this.pushSubscriptions.push({
        id: `ps_${crypto.randomUUID().slice(0, 10)}`,
        user_id: userId,
        endpoint: sub.endpoint,
        p256dh: sub.p256dh,
        auth: sub.auth,
      });
    }
  }

  async removePushSubscription(endpoint: string): Promise<void> {
    this.pushSubscriptions = this.pushSubscriptions.filter((s) => s.endpoint !== endpoint);
  }

  async getPushSubscriptionsForUser(userId: string): Promise<{ endpoint: string; p256dh: string; auth: string }[]> {
    return this.pushSubscriptions
      .filter((s) => s.user_id === userId)
      .map(({ endpoint, p256dh, auth }) => ({ endpoint, p256dh, auth }));
  }

  async listMessages(scope: { ride_id: string } | { concert_id: string }): Promise<Message[]> {
    if ("ride_id" in scope) {
      return this.messages.filter((m) => m.ride_id === scope.ride_id);
    }
    return this.messages.filter((m) => m.concert_id === scope.concert_id);
  }

  async createMessage(
    scope: { ride_id: string } | { concert_id: string },
    user: User,
    body: string,
    opts?: { kind?: import("@concertride/types").MessageKind; attachment_url?: string },
  ): Promise<Message> {
    const msg: Message = {
      id: `msg_${crypto.randomUUID().slice(0, 10)}`,
      ride_id: "ride_id" in scope ? scope.ride_id : null,
      concert_id: "concert_id" in scope ? scope.concert_id : null,
      user_id: user.id,
      user,
      kind: opts?.kind ?? "text",
      body,
      attachment_url: opts?.attachment_url ?? null,
      created_at: new Date().toISOString(),
    };
    this.messages = [...this.messages, msg];
    return msg;
  }

  async isParticipant(
    scope: { ride_id: string } | { concert_id: string },
    userId: string,
  ): Promise<boolean> {
    if ("ride_id" in scope) {
      const ride = this.rides.find((r) => r.id === scope.ride_id);
      if (ride?.driver_id === userId) return true;
      return this.requests.some(
        (r) => r.ride_id === scope.ride_id && r.passenger_id === userId && r.status === "confirmed",
      );
    }
    const concertRideIds = new Set(
      this.rides.filter((r) => r.concert_id === scope.concert_id).map((r) => r.id),
    );
    if ([...concertRideIds].some((rId) => this.rides.find((r) => r.id === rId)?.driver_id === userId)) return true;
    return this.requests.some(
      (r) => concertRideIds.has(r.ride_id) && r.passenger_id === userId && r.status === "confirmed",
    );
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

  async listFavorites(userId: string): Promise<Favorite[]> {
    return this.favorites
      .filter((f) => f.user_id === userId)
      .map(({ user_id: _u, ...rest }) => rest);
  }

  async addFavorite(
    userId: string,
    kind: FavoriteKind,
    targetId: string,
    label: string,
  ): Promise<Favorite> {
    const existing = this.favorites.find(
      (f) => f.user_id === userId && f.kind === kind && f.target_id === targetId,
    );
    if (existing) {
      const { user_id: _u, ...rest } = existing;
      return rest;
    }
    const fav = {
      id: `fav_${crypto.randomUUID().slice(0, 10)}`,
      user_id: userId,
      kind,
      target_id: targetId,
      label,
      created_at: new Date().toISOString(),
    };
    this.favorites = [...this.favorites, fav];
    const { user_id: _u, ...rest } = fav;
    return rest;
  }

  async removeFavorite(userId: string, kind: FavoriteKind, targetId: string): Promise<void> {
    this.favorites = this.favorites.filter(
      (f) => !(f.user_id === userId && f.kind === kind && f.target_id === targetId),
    );
  }

  async listFavoriteUpcomingConcerts(userId: string): Promise<Concert[]> {
    const userFavs = this.favorites.filter((f) => f.user_id === userId);
    if (userFavs.length === 0) return [];

    const concertIds = new Set(userFavs.filter((f) => f.kind === "concert").map((f) => f.target_id));
    const artistKeys = new Set(userFavs.filter((f) => f.kind === "artist").map((f) => f.target_id));
    const cityKeys = new Set(userFavs.filter((f) => f.kind === "city").map((f) => f.target_id));

    const nowISO = new Date().toISOString();
    const matching = this.concerts.filter((c) => {
      if (c.date < nowISO) return false;
      if (concertIds.has(c.id)) return true;
      if (artistKeys.has(c.artist.toLowerCase())) return true;
      const venue = this.venues.find((v) => v.id === c.venue_id);
      if (venue && cityKeys.has(venue.city.toLowerCase())) return true;
      return false;
    });

    return matching
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((c) => this.toConcert(c));
  }

  async deletePastConcerts(beforeDate: string): Promise<number> {
    const busyIds = new Set(this.rides.map((r) => r.concert_id));
    const toDelete = this.concerts.filter(
      (c) => c.date < beforeDate && !busyIds.has(c.id),
    );
    this.concerts = this.concerts.filter((c) => !toDelete.some((d) => d.id === c.id));
    return toDelete.length;
  }

  async createReport(
    reporterId: string,
    args: { target_user_id?: string; ride_id?: string; reason: ReportReason; body?: string },
  ): Promise<Report> {
    const report: Report = {
      id: `rep_${crypto.randomUUID().slice(0, 10)}`,
      reporter_id: reporterId,
      target_user_id: args.target_user_id ?? null,
      ride_id: args.ride_id ?? null,
      reason: args.reason,
      body: args.body ?? null,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    this.reports = [report, ...this.reports];
    return report;
  }

  async countReportsByReporterSince(reporterId: string, sinceISO: string): Promise<number> {
    return this.reports.filter((r) => r.reporter_id === reporterId && r.created_at >= sinceISO).length;
  }

  async listReportsForAdmin(
    filter?: { status?: import("@concertride/types").ReportStatus },
  ): Promise<Array<Report & { reporter: User | null; target_user: User | null }>> {
    let list = this.reports;
    if (filter?.status) list = list.filter((r) => r.status === filter.status);
    return list
      .slice()
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((r) => ({
        ...r,
        reporter: this.users.find((u) => u.id === r.reporter_id) ?? null,
        target_user: r.target_user_id
          ? this.users.find((u) => u.id === r.target_user_id) ?? null
          : null,
      }));
  }

  async updateReportStatus(
    id: string,
    status: import("@concertride/types").ReportStatus,
  ): Promise<Report | null> {
    const report = this.reports.find((r) => r.id === id);
    if (!report) return null;
    report.status = status;
    return report;
  }
}

// Module-level singleton so state persists across requests in the same isolate.
let instance: MemoryStore | null = null;
export function getMemoryStore(): MemoryStore {
  if (!instance) instance = new MemoryStore();
  return instance;
}

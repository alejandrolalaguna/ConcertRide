// In-memory store. State lives on a single Worker isolate and resets on cold
// starts. Used as a zero-config dev fallback when TURSO_DATABASE_URL is empty.

import type {
  ActivityEvent,
  ActivityFeedQuery,
  ActivityFeedResponse,
  ActivityKind,
  AddPlaylistTrackRequest,
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
  TripMemoryVisibility,
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
  private directMessages: DirectMessage[] = [];
  private demandSignals: DemandRow[] = [];
  private reviews: Review[] = [];
  private staging: StagingRow[] = [];
  private pushSubscriptions: Array<{ id: string; user_id: string; endpoint: string; p256dh: string; auth: string }> = [];
  private favorites: Array<Favorite & { user_id: string }> = [];
  private reports: Report[] = [];
  private licenseReviews: import("@concertride/types").LicenseReview[] = [];
  private identityReviews: import("@concertride/types").IdentityReview[] = [];
  private bannedEmails: string[] = [];
  private auditLog: import("@concertride/types").AdminAuditLogEntry[] = [];
  private rideChecklist: Record<string, {
    id: string;
    ride_id: string;
    item_type: string;
    value: string | null;
    status: string;
    created_at: string;
    confirmed_at: string | null;
  }> = {};

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
      identity_verified: false,
      referral_code: crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase(),
      referral_count: 0,
      tos_accepted_at: null,
      email_verified_at: null,
      phone_verified_at: null,
      deleted_at: null,
      banned_at: null,
      ban_reason: null,
      bio: null,
      music_genres: null,
      top_artists: null,
      spotify_id: null,
      handle: null,
      crew_count: 0,
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
      identity_verified: false,
      referral_code: crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase(),
      referral_count: 0,
      tos_accepted_at: new Date().toISOString(),
      email_verified_at: null,
      phone_verified_at: null,
      deleted_at: null,
      banned_at: null,
      ban_reason: null,
      bio: null,
      music_genres: null,
      top_artists: null,
      spotify_id: null,
      handle: null,
      crew_count: 0,
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
    if (input.bio !== undefined) user.bio = input.bio === null ? null : input.bio.slice(0, 200);
    if (input.music_genres !== undefined) user.music_genres = input.music_genres;
    if (input.top_artists !== undefined) user.top_artists = input.top_artists;
    if (input.handle !== undefined) {
      const next = input.handle?.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24) || null;
      user.handle = next;
    }
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

  async markEmailVerified(userId: string): Promise<User | null> {
    const u = this.users.find((u) => u.id === userId);
    if (!u) return null;
    u.email_verified_at = new Date().toISOString();
    return u;
  }

  async deleteUser(userId: string): Promise<void> {
    const u = this.users.find((u) => u.id === userId);
    if (!u) return;
    const now = new Date().toISOString();
    u.email = `deleted+${u.id}@concertride.me`;
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
      price_negotiable: input.price_negotiable ?? false,
      accepted_payment: input.accepted_payment ?? "cash",
      status: "active",
      completed_at: null,
      completion_confirmed_by: null,
      reminded_at: null,
      payment_reminder_sent_at: null,
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

  async listRidesForPaymentReminder(fromISO: string, toISO: string): Promise<Ride[]> {
    return this.rides.filter(
      (r) =>
        !r.payment_reminder_sent_at &&
        (r.status === "active" || r.status === "full") &&
        r.departure_time >= fromISO &&
        r.departure_time <= toISO,
    );
  }

  async markPaymentReminderSent(rideId: string): Promise<void> {
    const ride = this.rides.find((r) => r.id === rideId);
    if (ride) ride.payment_reminder_sent_at = new Date().toISOString();
  }

  async cancelRide(rideId: string): Promise<Ride | null> {
    const ride = this.rides.find((r) => r.id === rideId);
    if (!ride) return null;
    ride.status = "cancelled";
    ride.seats_left = 0;
    // Cascade: cancel any pending/confirmed requests
    this.requests = this.requests.map((r) =>
      r.ride_id === rideId && (r.status === "pending" || r.status === "confirmed")
        ? { ...r, status: "cancelled" as const }
        : r,
    );
    return ride;
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
    const ride = this.rides.find((r) => r.id === rideId);
    if (!ride) return null;
    // Seats can only grow or stay equal. If seats_total grows, seats_left
    // grows by the delta; if it stays equal, seats_left is untouched.
    if (patch.seats_total !== undefined && patch.seats_total >= ride.seats_total) {
      const delta = patch.seats_total - ride.seats_total;
      ride.seats_total = patch.seats_total;
      ride.seats_left = Math.min(ride.seats_total, ride.seats_left + delta);
      if (ride.status === "full" && ride.seats_left > 0) ride.status = "active";
    }
    if (patch.departure_time !== undefined) ride.departure_time = patch.departure_time;
    if (patch.return_time !== undefined) ride.return_time = patch.return_time;
    if (patch.price_per_seat !== undefined) ride.price_per_seat = patch.price_per_seat;
    if (patch.notes !== undefined) ride.notes = patch.notes;
    if (patch.playlist_url !== undefined) ride.playlist_url = patch.playlist_url;
    if (patch.vibe !== undefined) ride.vibe = patch.vibe;
    if (patch.smoking_policy !== undefined) ride.smoking_policy = patch.smoking_policy;
    if (patch.max_luggage !== undefined) ride.max_luggage = patch.max_luggage;
    if (patch.instant_booking !== undefined) ride.instant_booking = patch.instant_booking;
    if (patch.price_negotiable !== undefined) ride.price_negotiable = patch.price_negotiable;
    if (patch.accepted_payment !== undefined) ride.accepted_payment = patch.accepted_payment;
    if (patch.origin_address !== undefined) ride.origin_address = patch.origin_address;
    return ride;
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

  async listRequestsByPassenger(
    passengerId: string,
  ): Promise<Array<RideRequest & { ride: Ride }>> {
    return this.requests
      .filter((r) => r.passenger_id === passengerId)
      .map((r) => {
        const ride = this.rides.find((ride) => ride.id === r.ride_id);
        return ride ? { ...r, ride } : null;
      })
      .filter((r): r is RideRequest & { ride: Ride } => r !== null)
      .sort((a, b) => b.ride.departure_time.localeCompare(a.ride.departure_time));
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

  async listDirectMessages(userId: string, otherUserId: string): Promise<DirectMessage[]> {
    return this.directMessages
      .filter(
        (m) =>
          (m.sender_id === userId && m.recipient_id === otherUserId) ||
          (m.sender_id === otherUserId && m.recipient_id === userId),
      )
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
  }

  async createDirectMessage(
    sender: User,
    recipientId: string,
    body: string,
    opts?: { kind?: MessageKind; attachment_url?: string },
  ): Promise<DirectMessage> {
    const recipient = this.users.find((u) => u.id === recipientId);
    if (!recipient) throw new Error("recipient_not_found");
    const dm: DirectMessage = {
      id: `dm_${crypto.randomUUID().slice(0, 10)}`,
      sender_id: sender.id,
      recipient_id: recipientId,
      sender,
      recipient,
      kind: opts?.kind ?? "text",
      body,
      attachment_url: opts?.attachment_url ?? null,
      created_at: new Date().toISOString(),
    };
    this.directMessages = [...this.directMessages, dm];
    return dm;
  }

  async listConversations(userId: string): Promise<ConversationPreview[]> {
    const results: ConversationPreview[] = [];

    // DMs
    const dmByOther = new Map<string, DirectMessage>();
    for (const msg of [...this.directMessages].sort((a, b) => b.created_at.localeCompare(a.created_at))) {
      const otherId = msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
      if (
        (msg.sender_id === userId || msg.recipient_id === userId) &&
        !dmByOther.has(otherId)
      ) {
        dmByOther.set(otherId, msg);
      }
    }
    for (const [otherId, msg] of dmByOther) {
      const other = this.users.find((u) => u.id === otherId);
      if (!other) continue;
      results.push({
        kind: "dm",
        other_user: other,
        ride_id: null,
        ride_label: null,
        concert_id: null,
        concert_label: null,
        last_message_body: msg.body,
        last_message_at: msg.created_at,
        unread_count: 0,
      });
    }

    // Ride chats
    const myRideIds = new Set<string>();
    this.rides.filter((r) => r.driver_id === userId).forEach((r) => myRideIds.add(r.id));
    this.requests.filter((r) => r.passenger_id === userId && r.status === "confirmed").forEach((r) => myRideIds.add(r.ride_id));
    for (const rideId of myRideIds) {
      const ride = this.rides.find((r) => r.id === rideId);
      if (!ride) continue;
      const lastMsg = [...this.messages]
        .filter((m) => m.ride_id === rideId)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
      if (!lastMsg) continue;
      const concert = this.concerts.find((c) => c.id === ride.concert_id);
      results.push({
        kind: "ride",
        other_user: null,
        ride_id: ride.id,
        ride_label: concert ? `${concert.artist} · ${new Date(ride.departure_time).toLocaleDateString("es-ES")}` : ride.id,
        concert_id: ride.concert_id,
        concert_label: concert?.artist ?? null,
        last_message_body: lastMsg.body,
        last_message_at: lastMsg.created_at,
        unread_count: 0,
      });
    }

    // Concert chats
    const myConcertIds = new Set(
      this.messages.filter((m) => m.user_id === userId && m.concert_id).map((m) => m.concert_id!),
    );
    for (const concertId of myConcertIds) {
      const concert = this.concerts.find((c) => c.id === concertId);
      if (!concert) continue;
      const lastMsg = [...this.messages]
        .filter((m) => m.concert_id === concertId)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
      if (!lastMsg) continue;
      results.push({
        kind: "concert",
        other_user: null,
        ride_id: null,
        ride_label: null,
        concert_id: concert.id,
        concert_label: concert.artist,
        last_message_body: lastMsg.body,
        last_message_at: lastMsg.created_at,
        unread_count: 0,
      });
    }

    return results.sort((a, b) => b.last_message_at.localeCompare(a.last_message_at));
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

  async getAdminStats(): Promise<import("./adapter").AdminStats> {
    return {
      users: { total: this.users.length, verified_email: 0, license_verified: 0, new_last_7d: 0 },
      rides: { total_active: this.rides.filter((r) => r.status === "active").length, total_all_time: this.rides.length, published_last_7d: 0, seats_available: 0 },
      bookings: { confirmed_all_time: 0, confirmed_last_7d: 0, pending: 0 },
      concerts: { total: 0, upcoming: 0, with_active_rides: 0 },
      top_cities: [],
    };
  }

  async getAdminDashboard(): Promise<import("./adapter").AdminDashboard> {
    const now = new Date().toISOString();
    const d7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const d30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const rideStatus = (st: string) => this.rides.filter((r) => r.status === st).length;
    const reqStatus = (st: string) => this.requests.filter((r) => r.status === st).length;
    const favKind = (k: string) => this.favorites.filter((f) => f.kind === k).length;
    const lic = (st: string) => this.licenseReviews.filter((r) => r.status === st).length;
    const byDay = (rows: Array<{ created_at: string }>) => {
      const m = new Map<string, number>();
      for (const row of rows) {
        if (row.created_at < d30) continue;
        const day = row.created_at.slice(0, 10);
        m.set(day, (m.get(day) ?? 0) + 1);
      }
      return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([date, count]) => ({ date, count }));
    };
    const groupCount = <T>(rows: T[], key: (r: T) => string) => {
      const m = new Map<string, number>();
      for (const row of rows) m.set(key(row), (m.get(key(row)) ?? 0) + 1);
      return m;
    };
    const cities = [...groupCount(this.rides, (r) => r.origin_city).entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    const concertCounts = [...groupCount(this.rides, (r) => r.concert_id).entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    const concertName = (id: string) => this.concerts.find((c) => c.id === id)?.name ?? "—";
    const activityKinds = [...groupCount(this.activity, (a) => a.kind).entries()].sort((a, b) => b[1] - a[1]);
    const avgPrice = this.rides.length ? this.rides.reduce((s, r) => s + r.price_per_seat, 0) / this.rides.length : 0;
    const avgRating = this.reviews.length ? this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length : 0;

    return {
      generated_at: now,
      users: {
        total: this.users.length,
        verified_email: this.users.filter((u) => u.email_verified_at != null).length,
        unverified_email: this.users.filter((u) => u.email_verified_at == null).length,
        license_verified: this.users.filter((u) => u.license_verified).length,
        identity_verified: this.users.filter((u) => u.identity_verified).length,
        phone_verified: this.users.filter((u) => u.phone_verified_at != null).length,
        banned: this.users.filter((u) => u.banned_at != null).length,
        with_home_city: this.users.filter((u) => u.home_city != null).length,
        new_7d: this.users.filter((u) => u.created_at >= d7).length,
        new_30d: this.users.filter((u) => u.created_at >= d30).length,
      },
      rides: {
        total: this.rides.length,
        active: rideStatus("active"),
        full: rideStatus("full"),
        completed: rideStatus("completed"),
        cancelled: rideStatus("cancelled"),
        round_trip: this.rides.filter((r) => r.round_trip).length,
        seats_available: this.rides.filter((r) => r.status === "active").reduce((s, r) => s + r.seats_left, 0),
        avg_price: Math.round(avgPrice * 100) / 100,
        published_7d: this.rides.filter((r) => r.created_at >= d7).length,
      },
      bookings: {
        total: this.requests.length,
        pending: reqStatus("pending"),
        confirmed: reqStatus("confirmed"),
        rejected: reqStatus("rejected"),
        cancelled: reqStatus("cancelled"),
      },
      reviews: { total: this.reviews.length, avg_rating: Math.round(avgRating * 100) / 100 },
      favorites: { total: this.favorites.length, concert: favKind("concert"), artist: favKind("artist"), city: favKind("city") },
      engagement: {
        chat_messages: this.messages.length,
        direct_messages: this.directMessages.length,
        demand_signals: this.demandSignals.length,
        festival_demand: 0,
        festival_alerts: this.festivalAlerts.length,
        event_anticipations: this.anticipations.length,
        crew_connections: this.crew.length,
        squads: this.squadsList.length,
        squad_members: this.squadMembersList.length,
        trip_memories: this.memories.length,
        activity_events: this.activity.length,
      },
      catalog: {
        concerts: this.concerts.length,
        upcoming_concerts: this.concerts.filter((c) => c.date >= now).length,
        venues: this.venues.length,
      },
      moderation: {
        reports_pending: this.reports.filter((r) => r.status === "pending").length,
        reports_total: this.reports.length,
        license_pending: lic("pending"),
        license_approved: lic("approved"),
        license_rejected: lic("rejected"),
        identity_pending: this.identityReviews.filter((r) => r.status === "pending").length,
      },
      top_cities: cities.map(([city, ride_count]) => ({ city, ride_count })),
      top_concerts: concertCounts.map(([concert_id, ride_count]) => ({ concert_id, name: concertName(concert_id), ride_count })),
      activity_by_kind: activityKinds.map(([kind, count]) => ({ kind, count })),
      signups_by_day: byDay(this.users),
      rides_by_day: byDay(this.rides),
    };
  }

  async listAdminUsers(): Promise<import("./adapter").AdminUserListItem[]> {
    const countBy = (rows: Array<Record<string, unknown>>, field: string) => {
      const m = new Map<string, number>();
      for (const row of rows) {
        const id = row[field] as string;
        m.set(id, (m.get(id) ?? 0) + 1);
      }
      return m;
    };
    const rides = countBy(this.rides as unknown as Array<Record<string, unknown>>, "driver_id");
    const reqs = countBy(this.requests as unknown as Array<Record<string, unknown>>, "passenger_id");
    const favs = countBy(this.favorites as unknown as Array<Record<string, unknown>>, "user_id");
    const msgs = countBy(this.messages as unknown as Array<Record<string, unknown>>, "user_id");
    const revs = countBy(this.reviews as unknown as Array<Record<string, unknown>>, "reviewee_id");
    return [...this.users]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        avatar_url: u.avatar_url,
        email_verified: u.email_verified_at != null,
        license_verified: u.license_verified,
        identity_verified: u.identity_verified,
        phone_verified: u.phone_verified_at != null,
        banned: u.banned_at != null,
        home_city: u.home_city,
        rating: u.rating,
        created_at: u.created_at,
        rides_published: rides.get(u.id) ?? 0,
        requests_made: reqs.get(u.id) ?? 0,
        favorites_count: favs.get(u.id) ?? 0,
        messages_sent: msgs.get(u.id) ?? 0,
        reviews_received: revs.get(u.id) ?? 0,
      }));
  }

  async getAdminUserDetail(userId: string): Promise<import("./adapter").AdminUserDetail | null> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return null;
    const concertName = (id: string) => this.concerts.find((c) => c.id === id)?.name ?? null;
    const { password_hash: _ph, password_salt: _ps, ...publicUser } = user;
    return {
      user: publicUser as unknown as import("@concertride/types").User,
      rides: this.rides
        .filter((r) => r.driver_id === userId)
        .map((r) => ({
          id: r.id, concert_id: r.concert_id, concert_name: concertName(r.concert_id), origin_city: r.origin_city,
          status: r.status, price_per_seat: r.price_per_seat, seats_total: r.seats_total, seats_left: r.seats_left,
          departure_time: r.departure_time, created_at: r.created_at,
        })),
      requests: this.requests
        .filter((r) => r.passenger_id === userId)
        .map((r) => ({ id: r.id, ride_id: r.ride_id, status: r.status, seats: r.seats, created_at: r.created_at })),
      favorites: this.favorites
        .filter((f) => f.user_id === userId)
        .map((f) => ({ id: f.id, kind: f.kind, target_id: f.target_id, label: f.label, created_at: f.created_at })),
      messages: this.messages
        .filter((m) => m.user_id === userId)
        .map((m) => ({ id: m.id, ride_id: m.ride_id ?? null, concert_id: m.concert_id ?? null, kind: m.kind, body: m.body, created_at: m.created_at })),
      reviews_received: this.reviews
        .filter((r) => r.reviewee_id === userId)
        .map((r) => ({ id: r.id, rating: r.rating, comment: r.comment ?? null, created_at: r.created_at })),
      anticipations: this.anticipations
        .filter((a) => a.user_id === userId)
        .map((a) => ({ id: a.id, concert_id: a.concert_id, status: a.status, created_at: a.created_at })),
    };
  }

  async getAdminBreakdown(metric: string): Promise<import("./adapter").AdminBreakdown | null> {
    const LIMIT = 500;
    const now = new Date().toISOString();
    const d7 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const d30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    type Row = Record<string, string | number | null>;
    const nameOf = (id: string | null) => (id ? this.users.find((u) => u.id === id)?.name ?? id : "—");
    const emailOf = (id: string | null) => (id ? this.users.find((u) => u.id === id)?.email ?? "" : "");
    const concertName = (id: string | null) => (id ? this.concerts.find((c) => c.id === id)?.name ?? "—" : "—");
    const cmp = (a: string, b: string) => (a < b ? 1 : a > b ? -1 : 0);
    const wrap = (title: string, columns: Array<{ key: string; label: string }>, rows: Row[]) => ({
      metric, title, columns, rows: rows.slice(0, LIMIT), total: rows.length, truncated: rows.length > LIMIT,
    });

    const usersList = (title: string, pred: (u: MemoryUser) => boolean) => wrap(title, [
      { key: "name", label: "Nombre" }, { key: "email", label: "Email" }, { key: "home_city", label: "Ciudad" },
      { key: "email_ok", label: "Email ✓" }, { key: "license_ok", label: "Carné ✓" }, { key: "created_at", label: "Alta" },
    ], this.users.filter(pred).sort((a, b) => cmp(a.created_at, b.created_at)).map((u) => ({
      name: u.name, email: u.email, home_city: u.home_city, email_ok: u.email_verified_at ? "sí" : "no",
      license_ok: u.license_verified ? "sí" : "no", created_at: u.created_at,
    })));

    const ridesList = (title: string, pred: (r: Ride) => boolean, byPrice = false) => wrap(title, [
      { key: "driver", label: "Conductor" }, { key: "concert", label: "Concierto" }, { key: "origin_city", label: "Origen" },
      { key: "status", label: "Estado" }, { key: "price", label: "€/plaza" }, { key: "seats", label: "Plazas" }, { key: "departure_time", label: "Salida" },
    ], this.rides.filter(pred).sort((a, b) => byPrice ? b.price_per_seat - a.price_per_seat : cmp(a.created_at, b.created_at)).map((r) => ({
      driver: nameOf(r.driver_id), concert: concertName(r.concert_id), origin_city: r.origin_city, status: r.status,
      price: r.price_per_seat, seats: `${r.seats_left}/${r.seats_total}`, departure_time: r.departure_time,
    })));

    const requestsList = (title: string, pred: (r: RideRequest) => boolean) => wrap(title, [
      { key: "passenger", label: "Pasajero" }, { key: "email", label: "Email" }, { key: "ride_id", label: "Viaje" },
      { key: "status", label: "Estado" }, { key: "seats", label: "Plazas" }, { key: "created_at", label: "Fecha" },
    ], this.requests.filter(pred).sort((a, b) => cmp(a.created_at, b.created_at)).map((r) => ({
      passenger: nameOf(r.passenger_id), email: emailOf(r.passenger_id), ride_id: r.ride_id, status: r.status, seats: r.seats, created_at: r.created_at,
    })));

    const favoritesList = (title: string, pred: (f: { kind: string }) => boolean) => wrap(title, [
      { key: "user", label: "Usuario" }, { key: "email", label: "Email" }, { key: "kind", label: "Tipo" },
      { key: "target", label: "A qué" }, { key: "created_at", label: "Fecha" },
    ], this.favorites.filter(pred).sort((a, b) => cmp(a.created_at, b.created_at)).map((f) => ({
      user: nameOf(f.user_id), email: emailOf(f.user_id), kind: f.kind, target: f.label, created_at: f.created_at,
    })));

    const reviewsList = (title: string, byRating = false) => wrap(title, [
      { key: "reviewer", label: "Autor" }, { key: "reviewee", label: "Reseñado" }, { key: "rating", label: "★" },
      { key: "comment", label: "Comentario" }, { key: "created_at", label: "Fecha" },
    ], [...this.reviews].sort((a, b) => byRating ? b.rating - a.rating : cmp(a.created_at, b.created_at)).map((r) => ({
      reviewer: nameOf(r.reviewer_id), reviewee: nameOf(r.reviewee_id), rating: r.rating, comment: r.comment ?? "—", created_at: r.created_at,
    })));

    const reviewLikeList = (title: string, rows: Array<{ user_id: string; status: string; submitted_at: string; reviewed_at: string | null }>) => wrap(title, [
      { key: "user", label: "Usuario" }, { key: "email", label: "Email" }, { key: "status", label: "Estado" },
      { key: "submitted_at", label: "Enviado" }, { key: "reviewed_at", label: "Revisado" },
    ], rows.sort((a, b) => cmp(a.submitted_at, b.submitted_at)).map((x) => ({
      user: nameOf(x.user_id), email: emailOf(x.user_id), status: x.status, submitted_at: x.submitted_at, reviewed_at: x.reviewed_at ?? "—",
    })));

    switch (metric) {
      case "users_total": return usersList("Todos los usuarios", () => true);
      case "users_verified_email": return usersList("Usuarios con email verificado", (u) => u.email_verified_at != null);
      case "users_unverified_email": return usersList("Usuarios SIN email verificado", (u) => u.email_verified_at == null);
      case "users_license_verified": return usersList("Usuarios con carné verificado", (u) => !!u.license_verified);
      case "users_identity_verified": return usersList("Usuarios con identidad verificada", (u) => !!u.identity_verified);
      case "users_phone_verified": return usersList("Usuarios con teléfono verificado", (u) => u.phone_verified_at != null);
      case "users_banned": return usersList("Usuarios baneados", (u) => u.banned_at != null);
      case "users_with_home_city": return usersList("Usuarios con ciudad", (u) => u.home_city != null);
      case "users_new_7d": return usersList("Altas últimos 7 días", (u) => u.created_at >= d7);
      case "users_new_30d": return usersList("Altas últimos 30 días", (u) => u.created_at >= d30);
      case "rides_total": return ridesList("Todos los viajes", () => true);
      case "rides_active": return ridesList("Viajes activos", (r) => r.status === "active");
      case "rides_full": return ridesList("Viajes llenos", (r) => r.status === "full");
      case "rides_completed": return ridesList("Viajes completados", (r) => r.status === "completed");
      case "rides_cancelled": return ridesList("Viajes cancelados", (r) => r.status === "cancelled");
      case "rides_round_trip": return ridesList("Viajes ida y vuelta", (r) => !!r.round_trip);
      case "rides_seats_available": return ridesList("Viajes con plazas libres", (r) => r.status === "active" && r.seats_left > 0);
      case "rides_avg_price": return ridesList("Viajes ordenados por precio", () => true, true);
      case "rides_published_7d": return ridesList("Viajes publicados (7 días)", (r) => r.created_at >= d7);
      case "bookings_total": return requestsList("Todas las reservas", () => true);
      case "bookings_pending": return requestsList("Reservas pendientes", (r) => r.status === "pending");
      case "bookings_confirmed": return requestsList("Reservas confirmadas", (r) => r.status === "confirmed");
      case "bookings_rejected": return requestsList("Reservas rechazadas", (r) => r.status === "rejected");
      case "bookings_cancelled": return requestsList("Reservas canceladas", (r) => r.status === "cancelled");
      case "reviews_total": return reviewsList("Todas las reseñas");
      case "reviews_avg_rating": return reviewsList("Reseñas ordenadas por nota", true);
      case "favorites_total": return favoritesList("Todos los favoritos", () => true);
      case "favorites_concert": return favoritesList("Favoritos: conciertos", (f) => f.kind === "concert");
      case "favorites_artist": return favoritesList("Favoritos: artistas", (f) => f.kind === "artist");
      case "favorites_city": return favoritesList("Favoritos: ciudades", (f) => f.kind === "city");
      case "concerts": return wrap("Conciertos", [
        { key: "name", label: "Nombre" }, { key: "artist", label: "Artista" }, { key: "date", label: "Fecha" },
      ], [...this.concerts].sort((a, b) => cmp(a.date, b.date)).map((c) => ({ name: c.name, artist: c.artist, date: c.date })));
      case "upcoming_concerts": return wrap("Conciertos próximos", [
        { key: "name", label: "Nombre" }, { key: "artist", label: "Artista" }, { key: "date", label: "Fecha" },
      ], this.concerts.filter((c) => c.date >= now).sort((a, b) => cmp(b.date, a.date)).map((c) => ({ name: c.name, artist: c.artist, date: c.date })));
      case "venues": return wrap("Recintos", [
        { key: "name", label: "Nombre" }, { key: "city", label: "Ciudad" }, { key: "capacity", label: "Aforo" },
      ], [...this.venues].sort((a, b) => a.name.localeCompare(b.name)).map((v) => ({ name: v.name, city: v.city, capacity: v.capacity })));
      case "reports_total":
      case "reports_pending": return wrap(metric === "reports_pending" ? "Reportes pendientes" : "Todos los reportes", [
        { key: "reporter", label: "Reporta" }, { key: "target", label: "Reportado" }, { key: "reason", label: "Motivo" },
        { key: "status", label: "Estado" }, { key: "created_at", label: "Fecha" },
      ], this.reports.filter((r) => metric === "reports_total" || r.status === "pending").sort((a, b) => cmp(a.created_at, b.created_at)).map((r) => ({
        reporter: nameOf(r.reporter_id), target: nameOf(r.target_user_id), reason: r.reason, status: r.status, created_at: r.created_at,
      })));
      case "license_pending": return reviewLikeList("Carnés pendientes", this.licenseReviews.filter((r) => r.status === "pending"));
      case "license_approved": return reviewLikeList("Carnés aprobados", this.licenseReviews.filter((r) => r.status === "approved"));
      case "license_rejected": return reviewLikeList("Carnés rechazados", this.licenseReviews.filter((r) => r.status === "rejected"));
      case "identity_pending": return reviewLikeList("Identidad pendiente", this.identityReviews.filter((r) => r.status === "pending"));
      case "chat_messages": return wrap("Mensajes de chat", [
        { key: "user", label: "Autor" }, { key: "kind", label: "Tipo" }, { key: "body", label: "Mensaje" }, { key: "created_at", label: "Fecha" },
      ], [...this.messages].sort((a, b) => cmp(a.created_at, b.created_at)).map((m) => ({
        user: nameOf(m.user_id), kind: m.kind, body: m.body.slice(0, 80), created_at: m.created_at,
      })));
      case "direct_messages": return wrap("Mensajes directos", [
        { key: "from", label: "De" }, { key: "to", label: "Para" }, { key: "body", label: "Mensaje" }, { key: "created_at", label: "Fecha" },
      ], [...this.directMessages].sort((a, b) => cmp(a.created_at, b.created_at)).map((m) => ({
        from: nameOf(m.sender_id), to: nameOf(m.recipient_id), body: m.body.slice(0, 80), created_at: m.created_at,
      })));
      case "demand_signals": return wrap("Señales de interés", [
        { key: "user", label: "Usuario" }, { key: "concert", label: "Concierto" }, { key: "expires_at", label: "Expira" },
      ], [...this.demandSignals].sort((a, b) => cmp(a.expires_at, b.expires_at)).map((d) => ({
        user: nameOf(d.user_id), concert: concertName(d.concert_id), expires_at: d.expires_at,
      })));
      case "festival_demand": return wrap("Waitlist por festival", [
        { key: "festival_slug", label: "Festival" }, { key: "origin_city", label: "Origen" }, { key: "email", label: "Email" },
      ], []);
      case "festival_alerts": return wrap("Alertas de festival", [
        { key: "email", label: "Email" }, { key: "festival_slug", label: "Festival" }, { key: "created_at", label: "Fecha" },
      ], [...this.festivalAlerts].sort((a, b) => cmp(a.created_at, b.created_at)).map((a) => ({
        email: a.email, festival_slug: a.festival_slug, created_at: a.created_at,
      })));
      case "event_anticipations": return wrap("Asistencias (going/maybe)", [
        { key: "user", label: "Usuario" }, { key: "concert", label: "Concierto" }, { key: "status", label: "Estado" }, { key: "created_at", label: "Fecha" },
      ], [...this.anticipations].sort((a, b) => cmp(a.created_at, b.created_at)).map((a) => ({
        user: nameOf(a.user_id), concert: concertName(a.concert_id), status: a.status, created_at: a.created_at,
      })));
      case "crew_connections": return wrap("Conexiones de crew", [
        { key: "a", label: "Usuario A" }, { key: "b", label: "Usuario B" }, { key: "status", label: "Estado" }, { key: "created_at", label: "Fecha" },
      ], [...this.crew].sort((a, b) => cmp(a.created_at, b.created_at)).map((c) => ({
        a: nameOf(c.a_id), b: nameOf(c.b_id), status: c.status, created_at: c.created_at,
      })));
      case "squads": return wrap("Squads", [
        { key: "name", label: "Nombre" }, { key: "owner", label: "Dueño" }, { key: "concert", label: "Concierto" }, { key: "visibility", label: "Visibilidad" }, { key: "created_at", label: "Fecha" },
      ], [...this.squadsList].sort((a, b) => cmp(a.created_at, b.created_at)).map((s) => ({
        name: s.name, owner: nameOf(s.owner_id), concert: concertName(s.concert_id), visibility: s.visibility, created_at: s.created_at,
      })));
      case "squad_members": return wrap("Miembros de squad", [
        { key: "squad", label: "Squad" }, { key: "user", label: "Usuario" }, { key: "role", label: "Rol" }, { key: "joined_at", label: "Entró" },
      ], [...this.squadMembersList].sort((a, b) => cmp(a.joined_at, b.joined_at)).map((m) => ({
        squad: this.squadsList.find((s) => s.id === m.squad_id)?.name ?? "—", user: nameOf(m.user_id), role: m.role, joined_at: m.joined_at,
      })));
      case "trip_memories": return wrap("Trip memories", [
        { key: "title", label: "Título" }, { key: "creator", label: "Creador" }, { key: "concert", label: "Concierto" }, { key: "share_count", label: "Compartido" }, { key: "created_at", label: "Fecha" },
      ], [...this.memories].sort((a, b) => cmp(a.created_at, b.created_at)).map((m) => ({
        title: m.title, creator: nameOf(m.created_by), concert: concertName(m.concert_id), share_count: m.share_count, created_at: m.created_at,
      })));
      case "activity_events": return wrap("Eventos de actividad", [
        { key: "actor", label: "Actor" }, { key: "kind", label: "Tipo" }, { key: "label", label: "Descripción" }, { key: "created_at", label: "Fecha" },
      ], [...this.activity].sort((a, b) => cmp(a.created_at, b.created_at)).map((a) => ({
        actor: a.actor_name, kind: a.kind, label: a.label, created_at: a.created_at,
      })));
      default:
        return null;
    }
  }

  async listUsersForHomeCityNudge(createdAfterIso: string): Promise<Array<{ id: string; email: string; name: string }>> {
    return this.users
      .filter((u) => u.email_verified_at != null && u.home_city == null && u.deleted_at == null && u.banned_at == null && u.created_at >= createdAfterIso)
      .map((u) => ({ id: u.id, email: u.email, name: u.name }));
  }

  async listInactiveUsers(createdAfterIso: string): Promise<Array<{ id: string; email: string; name: string }>> {
    return this.users
      .filter((u) =>
        u.email_verified_at != null && u.deleted_at == null && u.banned_at == null && u.created_at >= createdAfterIso &&
        !this.demandSignals.some((d) => d.user_id === u.id) &&
        !this.favorites.some((f) => f.user_id === u.id) &&
        !this.rides.some((r) => r.driver_id === u.id) &&
        !this.requests.some((r) => r.passenger_id === u.id),
      )
      .map((u) => ({ id: u.id, email: u.email, name: u.name }));
  }

  async getMyLicenseReview(userId: string): Promise<import("@concertride/types").LicenseReview | null> {
    const userReviews = this.licenseReviews.filter((r) => r.user_id === userId);
    if (userReviews.length === 0) return null;
    return userReviews.sort((a, b) => b.submitted_at.localeCompare(a.submitted_at))[0]!;
  }

  async createLicenseReview(userId: string, fileKvKey: string): Promise<import("@concertride/types").LicenseReview> {
    const review: import("@concertride/types").LicenseReview = {
      id: `lr_${crypto.randomUUID().slice(0, 10)}`,
      user_id: userId,
      file_kv_key: fileKvKey,
      status: "pending",
      rejection_reason: null,
      submitted_at: new Date().toISOString(),
      reviewed_at: null,
    };
    this.licenseReviews.push(review);
    return review;
  }

  async listLicenseReviews(
    filter?: { status?: "pending" | "approved" | "rejected" },
  ): Promise<Array<import("@concertride/types").LicenseReview & { user: User | null }>> {
    const reviews = filter?.status
      ? this.licenseReviews.filter((r) => r.status === filter.status)
      : [...this.licenseReviews];
    return reviews.map((r) => ({ ...r, user: this.users.find((u) => u.id === r.user_id) ?? null }));
  }

  async approveLicenseReview(
    reviewId: string,
  ): Promise<{ review: import("@concertride/types").LicenseReview; user: User | null }> {
    const review = this.licenseReviews.find((r) => r.id === reviewId);
    if (!review) throw new Error("license_review_not_found");
    review.status = "approved";
    review.reviewed_at = new Date().toISOString();
    const user = await this.verifyLicense(review.user_id);
    return { review, user };
  }

  async rejectLicenseReview(reviewId: string, reason: string): Promise<import("@concertride/types").LicenseReview | null> {
    const review = this.licenseReviews.find((r) => r.id === reviewId);
    if (!review) return null;
    review.status = "rejected";
    review.rejection_reason = reason;
    review.reviewed_at = new Date().toISOString();
    return review;
  }

  async createIdentityReview(userId: string, fileKvKey: string): Promise<import("@concertride/types").IdentityReview> {
    const review: import("@concertride/types").IdentityReview = {
      id: `ir_${crypto.randomUUID().slice(0, 10)}`,
      user_id: userId,
      file_kv_key: fileKvKey,
      status: "pending",
      rejection_reason: null,
      submitted_at: new Date().toISOString(),
      reviewed_at: null,
    };
    this.identityReviews.push(review);
    return review;
  }

  async getMyIdentityReview(userId: string): Promise<import("@concertride/types").IdentityReview | null> {
    const reviews = this.identityReviews.filter((r) => r.user_id === userId);
    return reviews.sort((a, b) => b.submitted_at.localeCompare(a.submitted_at))[0] ?? null;
  }

  async listIdentityReviews(filter?: { status?: "pending" | "approved" | "rejected" }): Promise<Array<import("@concertride/types").IdentityReview & { user: User | null }>> {
    const reviews = filter?.status
      ? this.identityReviews.filter((r) => r.status === filter.status)
      : this.identityReviews;
    return reviews.map((r) => ({ ...r, user: this.users.find((u) => u.id === r.user_id) ?? null }));
  }

  async approveIdentityReview(reviewId: string): Promise<{ review: import("@concertride/types").IdentityReview; user: User | null }> {
    const review = this.identityReviews.find((r) => r.id === reviewId);
    if (!review) throw new Error("identity_review_not_found");
    review.status = "approved";
    review.reviewed_at = new Date().toISOString();
    const user = await this.verifyIdentity(review.user_id);
    return { review, user };
  }

  async rejectIdentityReview(reviewId: string, reason: string): Promise<import("@concertride/types").IdentityReview | null> {
    const review = this.identityReviews.find((r) => r.id === reviewId);
    if (!review) return null;
    review.status = "rejected";
    review.rejection_reason = reason;
    review.reviewed_at = new Date().toISOString();
    return review;
  }

  async verifyIdentity(userId: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return null;
    user.identity_verified = true;
    return user;
  }

  async banUser(_adminId: string, userId: string, reason: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return null;
    user.banned_at = new Date().toISOString();
    user.ban_reason = reason;
    this.bannedEmails.push(user.email.toLowerCase());
    return user;
  }

  async unbanUser(_adminId: string, userId: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return null;
    user.banned_at = null;
    user.ban_reason = null;
    this.bannedEmails = this.bannedEmails.filter((e) => e !== user.email.toLowerCase());
    return user;
  }

  async isEmailBanned(email: string): Promise<boolean> {
    return this.bannedEmails.includes(email.toLowerCase());
  }

  async logAdminAction(
    adminId: string,
    action: import("@concertride/types").AdminAuditAction,
    targetUserId?: string,
    details?: string,
  ): Promise<import("@concertride/types").AdminAuditLogEntry> {
    const entry: import("@concertride/types").AdminAuditLogEntry = {
      id: `al_${crypto.randomUUID().slice(0, 10)}`,
      admin_id: adminId,
      action,
      target_user_id: targetUserId ?? null,
      details: details ?? null,
      created_at: new Date().toISOString(),
    };
    this.auditLog.unshift(entry);
    return entry;
  }

  async listAdminAuditLog(limit = 100): Promise<import("@concertride/types").AdminAuditLogEntry[]> {
    return this.auditLog.slice(0, limit);
  }

  async markPhoneVerified(userId: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return null;
    user.phone_verified_at = new Date().toISOString();
    return user;
  }

  async listChecklistForRide(rideId: string) {
    return Object.values(this.rideChecklist)
      .filter((item) => item.ride_id === rideId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((item) => ({
        id: item.id,
        item_type: item.item_type,
        value: item.value,
        status: item.status,
        created_at: item.created_at,
        confirmed_at: item.confirmed_at,
      }));
  }

  async createChecklistItem(
    rideId: string,
    itemType: "pickup_location" | "pickup_time" | "driver_phone" | "luggage_confirmation",
    value?: string,
  ) {
    const id = `rc_${crypto.randomUUID().slice(0, 10)}`;
    const now = new Date().toISOString();
    const item = {
      id,
      ride_id: rideId,
      item_type: itemType,
      value: value ?? null,
      status: "pending" as const,
      created_at: now,
      confirmed_at: null as string | null,
    };
    this.rideChecklist[id] = item;
    return {
      id: item.id,
      item_type: item.item_type,
      value: item.value,
      status: item.status,
      created_at: item.created_at,
      confirmed_at: item.confirmed_at,
    };
  }

  async confirmChecklistItem(itemId: string) {
    const item = this.rideChecklist[itemId];
    if (!item) return null;
    const now = new Date().toISOString();
    item.status = "confirmed";
    item.confirmed_at = now;
    return {
      id: item.id,
      item_type: item.item_type,
      value: item.value,
      status: item.status,
      created_at: item.created_at,
      confirmed_at: item.confirmed_at,
    };
  }

  // --- festival alerts ---
  private festivalAlerts: Array<{ id: string; email: string; festival_slug: string; created_at: string }> = [];

  async subscribeFestivalAlert(email: string, festivalSlug: string): Promise<{ created: boolean }> {
    const exists = this.festivalAlerts.some(
      (a) => a.email === email && a.festival_slug === festivalSlug,
    );
    if (exists) return { created: false };
    this.festivalAlerts.push({
      id: `fa_${crypto.randomUUID().slice(0, 10)}`,
      email,
      festival_slug: festivalSlug,
      created_at: new Date().toISOString(),
    });
    return { created: true };
  }

  // --- popular pickup points (stub — in-memory dev only) ---
  async getPopularPickupPoints(_city: string): Promise<Array<{
    origin_address: string;
    origin_lat: number;
    origin_lng: number;
    frequency: number;
  }>> {
    return [];
  }

  // --- festival demand signals (stubs — in-memory dev only) ---
  async registerFestivalDemand(_params: {
    festival_slug: string;
    origin_city: string;
    user_id?: string;
    email?: string;
  }): Promise<{ created: boolean }> {
    return { created: true };
  }

  async getFestivalDemandCount(_festival_slug: string, _origin_city?: string): Promise<number> {
    return 0;
  }

  async notifyFestivalDemand(_festival_slug: string, _origin_city: string): Promise<number> {
    return 0;
  }

  // ============================================================
  // SOCIAL DENSITY (Phase 1) — fully implemented in memory.
  // ============================================================

  private crew: Array<{
    id: string;
    a_id: string;
    b_id: string;
    requested_by: string;
    status: "pending" | "accepted" | "blocked";
    origin_ride_id: string | null;
    origin_concert_id: string | null;
    created_at: string;
    accepted_at: string | null;
  }> = [];
  private activity: ActivityEvent[] = [];
  private anticipations: Array<{
    id: string;
    user_id: string;
    concert_id: string;
    status: AnticipationStatus;
    ride_id: string | null;
    notify_before_hours: number;
    last_notified_at: string | null;
    created_at: string;
  }> = [];
  private memories: Array<{
    id: string;
    ride_id: string;
    concert_id: string;
    created_by: string;
    title: string;
    caption: string | null;
    payload: Record<string, unknown>;
    image_kv_key: string | null;
    visibility: TripMemoryVisibility;
    share_count: number;
    created_at: string;
  }> = [];

  private orderedPair(a: string, b: string): [string, string] {
    return a < b ? [a, b] : [b, a];
  }

  private hydrateCrewMember(row: (typeof this.crew)[number], otherUser: User, viewerId: string): CrewMember {
    return {
      user: otherUser,
      status: row.status,
      initiated_by_me: row.requested_by === viewerId,
      origin_ride_id: row.origin_ride_id,
      origin_concert_id: row.origin_concert_id,
      origin_concert_label: null,
      shared_genres: otherUser.music_genres ?? [],
      shared_artists: [],
      rides_together: 0,
      connected_at: row.accepted_at ?? row.created_at,
    };
  }

  async listCrewForUser(userId: string): Promise<CrewListResponse> {
    const rows = this.crew.filter((c) => c.a_id === userId || c.b_id === userId);
    const accepted: CrewMember[] = [];
    const incoming: CrewMember[] = [];
    const outgoing: CrewMember[] = [];
    for (const row of rows) {
      const otherId = row.a_id === userId ? row.b_id : row.a_id;
      const other = this.users.find((u) => u.id === otherId);
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
    const other = this.users.find((u) => u.id === otherUserId);
    if (!other) return null;
    const [a, b] = this.orderedPair(viewer.id, otherUserId);
    const existing = this.crew.find((c) => c.a_id === a && c.b_id === b);
    if (existing) return this.hydrateCrewMember(existing, other, viewer.id);
    let originConcertId: string | null = null;
    if (opts?.ride_id) {
      const ride = this.rides.find((r) => r.id === opts.ride_id);
      if (ride) originConcertId = ride.concert_id;
    }
    const row = {
      id: `cr_${crypto.randomUUID().slice(0, 10)}`,
      a_id: a,
      b_id: b,
      requested_by: viewer.id,
      status: "pending" as const,
      origin_ride_id: opts?.ride_id ?? null,
      origin_concert_id: originConcertId,
      created_at: new Date().toISOString(),
      accepted_at: null,
    };
    this.crew.push(row);
    return this.hydrateCrewMember(row, other, viewer.id);
  }

  async acceptCrewInvite(viewerId: string, otherUserId: string): Promise<CrewMember | null> {
    const [a, b] = this.orderedPair(viewerId, otherUserId);
    const existing = this.crew.find((c) => c.a_id === a && c.b_id === b);
    if (!existing || existing.status !== "pending" || existing.requested_by === viewerId) return null;
    existing.status = "accepted";
    existing.accepted_at = new Date().toISOString();
    for (const u of this.users) {
      if (u.id === a || u.id === b) u.crew_count = (u.crew_count ?? 0) + 1;
    }
    const other = this.users.find((u) => u.id === otherUserId);
    if (!other) return null;
    return this.hydrateCrewMember(existing, other, viewerId);
  }

  async removeCrewConnection(viewerId: string, otherUserId: string): Promise<void> {
    const [a, b] = this.orderedPair(viewerId, otherUserId);
    const idx = this.crew.findIndex((c) => c.a_id === a && c.b_id === b);
    if (idx < 0) return;
    const removed = this.crew[idx]!;
    const wasAccepted = removed.status === "accepted";
    this.crew.splice(idx, 1);
    if (wasAccepted) {
      for (const u of this.users) {
        if (u.id === a || u.id === b) u.crew_count = Math.max(0, (u.crew_count ?? 0) - 1);
      }
    }
  }

  async listCrewAttendingConcert(viewerId: string, concertId: string): Promise<CrewMember[]> {
    const { crew } = await this.listCrewForUser(viewerId);
    if (!crew.length) return [];
    const crewIds = new Set(crew.map((c) => c.user.id));
    const attending = new Set<string>();
    for (const a of this.anticipations) {
      if (a.concert_id === concertId && crewIds.has(a.user_id)) attending.add(a.user_id);
    }
    for (const r of this.rides) {
      if (r.concert_id === concertId && crewIds.has(r.driver_id)) attending.add(r.driver_id);
    }
    for (const req of this.requests) {
      if (req.status !== "confirmed") continue;
      const ride = this.rides.find((r) => r.id === req.ride_id);
      if (ride && ride.concert_id === concertId && crewIds.has(req.passenger_id)) attending.add(req.passenger_id);
    }
    return crew.filter((c) => attending.has(c.user.id));
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
    const event: ActivityEvent = {
      id: `ae_${crypto.randomUUID().slice(0, 10)}`,
      actor_id: input.actor.id,
      actor_name: input.actor.name,
      actor_avatar: input.actor.avatar_url,
      kind: input.kind,
      target_id: input.target_id ?? null,
      concert_id: input.concert_id ?? null,
      concert_name: input.concert_id
        ? this.concerts.find((c) => c.id === input.concert_id)?.name ?? null
        : null,
      city: input.city ?? null,
      label: input.label ?? "",
      metadata: input.metadata ?? null,
      created_at: new Date().toISOString(),
    };
    this.activity.unshift(event);
    if (this.activity.length > 1000) this.activity.length = 1000;
    return event;
  }

  async listActivity(viewer: User | null, query: ActivityFeedQuery): Promise<ActivityFeedResponse> {
    const limit = Math.min(query.limit ?? 30, 100);
    let pool = this.activity.slice();
    if (query.scope === "self" && viewer) {
      pool = pool.filter((e) => e.actor_id === viewer.id);
    } else if (query.scope === "crew" && viewer) {
      const { crew } = await this.listCrewForUser(viewer.id);
      const ids = new Set(crew.map((c) => c.user.id));
      if (!ids.size) return { events: [], has_more: false };
      pool = pool.filter((e) => ids.has(e.actor_id));
    } else {
      if (query.scope === "city" && query.city) {
        const city = query.city.toLowerCase();
        pool = pool.filter((e) => e.city === city);
      }
      if (query.scope === "concert" && query.concert_id) {
        pool = pool.filter((e) => e.concert_id === query.concert_id);
      }
    }
    if (query.before) {
      pool = pool.filter((e) => e.created_at < query.before!);
    }
    pool.sort((a, b) => b.created_at.localeCompare(a.created_at));
    const events = pool.slice(0, limit);
    return { events, has_more: pool.length > limit };
  }

  async setAnticipation(userId: string, concertId: string, status: AnticipationStatus): Promise<EventAnticipation> {
    const existing = this.anticipations.find((a) => a.user_id === userId && a.concert_id === concertId);
    if (existing) {
      existing.status = status;
      return { ...existing };
    }
    const row = {
      id: `ea_${crypto.randomUUID().slice(0, 10)}`,
      user_id: userId,
      concert_id: concertId,
      status,
      ride_id: null,
      notify_before_hours: 24,
      last_notified_at: null,
      created_at: new Date().toISOString(),
    };
    this.anticipations.push(row);
    return { ...row };
  }

  async removeAnticipation(userId: string, concertId: string): Promise<void> {
    this.anticipations = this.anticipations.filter(
      (a) => !(a.user_id === userId && a.concert_id === concertId),
    );
  }

  async getAnticipationSummary(concertId: string, viewerId: string | null): Promise<AnticipationSummary> {
    const rows = this.anticipations.filter((a) => a.concert_id === concertId);
    const going = rows.filter((r) => r.status === "going");
    const maybe = rows.filter((r) => r.status === "maybe");
    const previewIds = going.slice(0, 8).map((r) => r.user_id);
    const previewUsers = previewIds
      .map((id) => this.users.find((u) => u.id === id))
      .filter((u): u is MemoryUser => !!u);
    let crewAttending: AnticipationSummary["crew_attending"] = [];
    let userStatus: AnticipationStatus | null = null;
    if (viewerId) {
      const own = rows.find((r) => r.user_id === viewerId);
      if (own) userStatus = own.status;
      const { crew } = await this.listCrewForUser(viewerId);
      const ids = new Set(crew.map((c) => c.user.id));
      crewAttending = previewUsers
        .filter((u) => ids.has(u.id))
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
    const items: Array<{ concert: Concert; status: AnticipationStatus }> = [];
    for (const a of this.anticipations) {
      if (a.user_id !== userId) continue;
      const concert = this.concerts.find((c) => c.id === a.concert_id);
      if (concert) items.push({ concert: concert as Concert, status: a.status });
    }
    items.sort((x, y) => x.concert.date.localeCompare(y.concert.date));
    return items;
  }

  private hydrateMemory(row: (typeof this.memories)[number]): TripMemory | null {
    const concert = this.concerts.find((c) => c.id === row.concert_id);
    const creator = this.users.find((u) => u.id === row.created_by);
    if (!concert || !creator) return null;
    const p = row.payload;
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
      vibe: ((p.vibe as Ride["vibe"]) ?? "mixed"),
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

  async createTripMemory(creator: User, input: CreateTripMemoryRequest): Promise<TripMemory | { error: string }> {
    const ride = this.rides.find((r) => r.id === input.ride_id);
    if (!ride) return { error: "ride_not_found" };
    if (ride.driver_id !== creator.id) return { error: "only_driver_can_publish" };
    if (ride.status !== "completed") return { error: "ride_not_completed" };
    const existingRow = this.memories.find((m) => m.ride_id === input.ride_id);
    if (existingRow) {
      const hydrated = this.hydrateMemory(existingRow);
      if (hydrated) return hydrated;
    }
    const concert = this.concerts.find((c) => c.id === ride.concert_id);
    const row = {
      id: `tm_${crypto.randomUUID().slice(0, 10)}`,
      ride_id: input.ride_id,
      concert_id: ride.concert_id,
      created_by: creator.id,
      title: input.title?.slice(0, 80) || `${ride.origin_city} → ${concert?.artist ?? ride.concert_id}`,
      caption: input.caption?.slice(0, 280) ?? null,
      payload: {
        vibe: ride.vibe,
        origin_city: ride.origin_city,
        destination_city: concert?.venue?.city ?? "",
        playlist_url: ride.playlist_url,
        hero_color: ride.vibe === "party" ? "#ff4f00" : ride.vibe === "chill" ? "#9b59f7" : "#dbff00",
      },
      image_kv_key: null,
      visibility: input.visibility ?? "public",
      share_count: 0,
      created_at: new Date().toISOString(),
    };
    this.memories.unshift(row);
    return this.hydrateMemory(row) ?? { error: "hydrate_failed" };
  }

  async getTripMemory(id: string): Promise<TripMemory | null> {
    const row = this.memories.find((m) => m.id === id);
    if (!row) return null;
    return this.hydrateMemory(row);
  }

  async listTripMemoriesForUser(userId: string): Promise<TripMemory[]> {
    return this.memories
      .filter((m) => m.created_by === userId)
      .map((m) => this.hydrateMemory(m))
      .filter((m): m is TripMemory => !!m);
  }

  async listTripMemoriesForConcert(concertId: string, limit = 12): Promise<TripMemory[]> {
    return this.memories
      .filter((m) => m.concert_id === concertId && m.visibility === "public")
      .slice(0, limit)
      .map((m) => this.hydrateMemory(m))
      .filter((m): m is TripMemory => !!m);
  }

  async incrementTripMemoryShare(id: string): Promise<void> {
    const row = this.memories.find((m) => m.id === id);
    if (row) row.share_count += 1;
  }

  // ============================================================
  // PHASE 1E — countdown reminders
  // ============================================================

  async listAnticipationsForCountdown(
    fromISO: string,
    toISO: string,
  ): Promise<Array<EventAnticipation & { concert: Concert; user: User }>> {
    const out: Array<EventAnticipation & { concert: Concert; user: User }> = [];
    for (const a of this.anticipations) {
      if (a.last_notified_at) continue;
      const concert = this.concerts.find((c) => c.id === a.concert_id);
      const user = this.users.find((u) => u.id === a.user_id);
      if (!concert || !user) continue;
      if (concert.date < fromISO || concert.date > toISO) continue;
      out.push({ ...a, concert: concert as Concert, user });
    }
    return out;
  }

  async markAnticipationNotified(id: string): Promise<void> {
    const row = this.anticipations.find((a) => a.id === id);
    if (row) row.last_notified_at = new Date().toISOString();
  }

  // ============================================================
  // PHASE 2.6 — Festival Q&A
  // ============================================================

  private festivalQnas: Array<{
    id: string;
    festival_slug: string;
    user_id: string;
    question: string;
    answer: string;
    upvotes: number;
    approved_at: string | null;
    created_at: string;
  }> = [];

  private hydrateFestivalQna(row: (typeof this.festivalQnas)[number]): FestivalQna {
    const u = this.users.find((x) => x.id === row.user_id);
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
    let pool = this.festivalQnas.filter((q) => q.festival_slug === festivalSlug);
    if (opts?.onlyApproved) pool = pool.filter((q) => !!q.approved_at);
    pool.sort((a, b) => b.upvotes - a.upvotes || b.created_at.localeCompare(a.created_at));
    if (opts?.limit) pool = pool.slice(0, opts.limit);
    return pool.map((q) => this.hydrateFestivalQna(q));
  }

  async createFestivalQna(user: User, input: CreateFestivalQnaRequest): Promise<FestivalQna> {
    const row = {
      id: `fq_${crypto.randomUUID().slice(0, 10)}`,
      festival_slug: input.festival_slug,
      user_id: user.id,
      question: input.question.slice(0, 200),
      answer: input.answer.slice(0, 1000),
      upvotes: 0,
      approved_at: null,
      created_at: new Date().toISOString(),
    };
    this.festivalQnas.push(row);
    return this.hydrateFestivalQna(row);
  }

  async approveFestivalQna(id: string): Promise<FestivalQna | null> {
    const row = this.festivalQnas.find((q) => q.id === id);
    if (!row) return null;
    row.approved_at = new Date().toISOString();
    return this.hydrateFestivalQna(row);
  }

  async upvoteFestivalQna(id: string): Promise<FestivalQna | null> {
    const row = this.festivalQnas.find((q) => q.id === id);
    if (!row) return null;
    row.upvotes += 1;
    return this.hydrateFestivalQna(row);
  }

  // ============================================================
  // PHASE 2.7 — Squads
  // ============================================================

  private squadsList: Array<{
    id: string;
    concert_id: string;
    owner_id: string;
    name: string;
    vibe_tags: string | null;
    visibility: "public" | "private";
    invite_code: string;
    created_at: string;
  }> = [];
  private squadMembersList: Array<{
    id: string;
    squad_id: string;
    user_id: string;
    role: SquadRole;
    ride_id: string | null;
    joined_at: string;
    left_at: string | null;
  }> = [];

  private hydrateSquad(row: (typeof this.squadsList)[number]): Squad | null {
    const concert = this.concerts.find((c) => c.id === row.concert_id);
    const owner = this.users.find((u) => u.id === row.owner_id);
    if (!concert || !owner) return null;
    const memberRows = this.squadMembersList.filter((m) => m.squad_id === row.id && !m.left_at);
    const members: Squad["members"] = [];
    for (const m of memberRows) {
      const user = this.users.find((u) => u.id === m.user_id);
      if (!user) continue;
      members.push({ user, role: m.role, ride_id: m.ride_id, joined_at: m.joined_at });
    }
    const rideIds = Array.from(new Set(memberRows.map((m) => m.ride_id).filter(Boolean) as string[]));
    const rides = rideIds
      .map((rid) => this.rides.find((r) => r.id === rid))
      .filter((r): r is Ride => !!r);
    return {
      id: row.id,
      concert: concert as Concert,
      owner,
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
    const row = {
      id,
      concert_id: input.concert_id,
      owner_id: owner.id,
      name: input.name.slice(0, 80),
      vibe_tags: input.vibe_tags?.length ? input.vibe_tags.join("|") : null,
      visibility: input.visibility ?? "private",
      invite_code: inviteCode,
      created_at: new Date().toISOString(),
    };
    this.squadsList.push(row);
    this.squadMembersList.push({
      id: `sm_${crypto.randomUUID().slice(0, 10)}`,
      squad_id: id,
      user_id: owner.id,
      role: "owner",
      ride_id: null,
      joined_at: row.created_at,
      left_at: null,
    });
    return this.hydrateSquad(row)!;
  }

  async getSquad(id: string): Promise<Squad | null> {
    const row = this.squadsList.find((s) => s.id === id);
    return row ? this.hydrateSquad(row) : null;
  }

  async getSquadByInvite(inviteCode: string): Promise<Squad | null> {
    const row = this.squadsList.find((s) => s.invite_code === inviteCode);
    return row ? this.hydrateSquad(row) : null;
  }

  async listSquadsForUser(userId: string): Promise<Squad[]> {
    const ids = this.squadMembersList
      .filter((m) => m.user_id === userId && !m.left_at)
      .map((m) => m.squad_id);
    const out: Squad[] = [];
    for (const id of ids) {
      const row = this.squadsList.find((s) => s.id === id);
      if (!row) continue;
      const sq = this.hydrateSquad(row);
      if (sq) out.push(sq);
    }
    return out;
  }

  async listSquadsForConcert(concertId: string, opts?: { onlyPublic?: boolean }): Promise<Squad[]> {
    let pool = this.squadsList.filter((s) => s.concert_id === concertId);
    if (opts?.onlyPublic) pool = pool.filter((s) => s.visibility === "public");
    return pool.map((s) => this.hydrateSquad(s)).filter((s): s is Squad => !!s);
  }

  async joinSquad(user: User, input: JoinSquadRequest): Promise<Squad | { error: string }> {
    const row = this.squadsList.find((s) => s.invite_code === input.invite_code);
    if (!row) return { error: "squad_not_found" };
    const existing = this.squadMembersList.find((m) => m.squad_id === row.id && m.user_id === user.id);
    if (existing) {
      if (existing.left_at) {
        existing.left_at = null;
        existing.joined_at = new Date().toISOString();
      }
      if (input.ride_id) existing.ride_id = input.ride_id;
      if (input.role) existing.role = input.role;
      return this.hydrateSquad(row)!;
    }
    this.squadMembersList.push({
      id: `sm_${crypto.randomUUID().slice(0, 10)}`,
      squad_id: row.id,
      user_id: user.id,
      role: input.role ?? "passenger",
      ride_id: input.ride_id ?? null,
      joined_at: new Date().toISOString(),
      left_at: null,
    });
    return this.hydrateSquad(row)!;
  }

  async leaveSquad(squadId: string, userId: string): Promise<void> {
    const m = this.squadMembersList.find((x) => x.squad_id === squadId && x.user_id === userId);
    if (m) m.left_at = new Date().toISOString();
  }

  async updateSquadMemberRole(squadId: string, userId: string, role: SquadRole, rideId?: string | null): Promise<void> {
    const m = this.squadMembersList.find((x) => x.squad_id === squadId && x.user_id === userId && !x.left_at);
    if (!m) return;
    m.role = role;
    if (rideId !== undefined) m.ride_id = rideId;
  }

  // ============================================================
  // PHASE 2.9 — Playlist tracks
  // ============================================================

  private playlistTracksList: Array<{
    id: string;
    ride_id: string | null;
    squad_id: string | null;
    added_by: string;
    track_uri: string | null;
    track_name: string;
    artist_name: string;
    album_image_url: string | null;
    duration_ms: number | null;
    position: number;
    created_at: string;
  }> = [];

  private hydratePlaylistTrack(row: (typeof this.playlistTracksList)[number]): PlaylistTrack {
    const adder = this.users.find((u) => u.id === row.added_by);
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
    const pool = this.playlistTracksList.filter((t) =>
      "ride_id" in scope ? t.ride_id === scope.ride_id : t.squad_id === scope.squad_id,
    );
    pool.sort((a, b) => a.position - b.position || a.created_at.localeCompare(b.created_at));
    return pool.map((t) => this.hydratePlaylistTrack(t));
  }

  async addPlaylistTrack(user: User, input: AddPlaylistTrackRequest): Promise<PlaylistTrack | { error: string }> {
    if (!input.ride_id && !input.squad_id) return { error: "scope_required" };
    if (input.ride_id && input.squad_id) return { error: "single_scope" };
    const sibling = this.playlistTracksList.filter((t) =>
      input.ride_id ? t.ride_id === input.ride_id : t.squad_id === input.squad_id,
    );
    const row = {
      id: `pt_${crypto.randomUUID().slice(0, 10)}`,
      ride_id: input.ride_id ?? null,
      squad_id: input.squad_id ?? null,
      added_by: user.id,
      track_uri: input.track_uri ?? null,
      track_name: input.track_name.slice(0, 200),
      artist_name: input.artist_name.slice(0, 200),
      album_image_url: input.album_image_url ?? null,
      duration_ms: input.duration_ms ?? null,
      position: sibling.length,
      created_at: new Date().toISOString(),
    };
    this.playlistTracksList.push(row);
    return this.hydratePlaylistTrack(row);
  }

  async removePlaylistTrack(trackId: string, userId: string): Promise<void> {
    const idx = this.playlistTracksList.findIndex(
      (t) => t.id === trackId && t.added_by === userId,
    );
    if (idx >= 0) this.playlistTracksList.splice(idx, 1);
  }
}

// Module-level singleton so state persists across requests in the same isolate.
let instance: MemoryStore | null = null;
export function getMemoryStore(): MemoryStore {
  if (!instance) instance = new MemoryStore();
  return instance;
}

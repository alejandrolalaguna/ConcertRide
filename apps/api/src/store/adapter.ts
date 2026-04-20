import type {
  Concert,
  CreateConcertInput,
  CreateRideRequest,
  CreateReviewRequest,
  DemandSignal,
  Message,
  RequestStatus,
  Review,
  Ride,
  RideRequest,
  UpdateProfileInput,
  User,
  Venue,
  Vibe,
} from "@concertride/types";
import type { RawConcert, SourceId } from "../ingest/types";

export interface ConcertFilters {
  city?: string;
  artist?: string;
  date_from?: string;
  date_to?: string;
  limit: number;
  offset: number;
}

export interface RideFilters {
  concert_id?: string;
  origin_city?: string;
  vibe?: Vibe;
  max_price?: number;
  round_trip?: boolean;
  adhoc?: boolean;
  near_lat?: number;
  near_lng?: number;
  radius_km?: number;
}

export type CreateRequestResult =
  | { request: RideRequest; error?: never }
  | { error: string; request?: never };

export interface ConcertSourceRef {
  source: SourceId;
  source_event_id: string;
  source_url: string;
}

export interface UpsertConcertResult {
  concert_id: string;
  is_new: boolean;
}

export interface StoreAdapter {
  // --- users ---
  getUser(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  upsertUserByEmail(email: string): Promise<User>;
  createUserWithPassword(
    email: string,
    name: string,
    hash: string,
    salt: string,
    profile?: { phone?: string; home_city?: string; smoker?: boolean; has_license?: boolean },
  ): Promise<User>;
  updateUser(id: string, input: UpdateProfileInput): Promise<User | null>;
  getPasswordHash(userId: string): Promise<{ hash: string; salt: string } | null>;

  // --- venues ---
  listVenues(): Promise<Venue[]>;
  ensureVenue(input: {
    name: string;
    city: string;
    lat: number | null;
    lng: number | null;
  }): Promise<Venue>;

  // --- concerts ---
  listConcerts(filters: ConcertFilters): Promise<{ concerts: Concert[]; total: number }>;
  getConcert(id: string): Promise<Concert | null>;
  createConcert(input: CreateConcertInput): Promise<Concert>;
  upsertConcertFromIngest(raw: RawConcert, venueId: string): Promise<UpsertConcertResult>;

  // --- rides ---
  listRides(filters: RideFilters): Promise<Ride[]>;
  getRide(id: string): Promise<Ride | null>;
  createRide(driver: User, concert: Concert, input: CreateRideRequest): Promise<Ride>;

  // --- ride requests ---
  listRequestsForRide(rideId: string): Promise<RideRequest[]>;
  getRequest(id: string): Promise<RideRequest | null>;
  createRequest(
    ride: Ride,
    passenger: User,
    seats: number,
    message?: string,
    luggage?: string,
  ): Promise<CreateRequestResult>;
  updateRequestStatus(requestId: string, status: RequestStatus): Promise<RideRequest | null>;

  // --- demand signals ---
  getDemandSignal(concertId: string, userId: string | null): Promise<DemandSignal>;
  toggleDemandSignal(concertId: string, user: User): Promise<DemandSignal>;

  // --- messages (ride thread + concert chat) ---
  listMessages(scope: { ride_id: string } | { concert_id: string }): Promise<Message[]>;
  createMessage(
    scope: { ride_id: string } | { concert_id: string },
    user: User,
    body: string,
  ): Promise<Message>;
  isParticipant(
    scope: { ride_id: string } | { concert_id: string },
    userId: string,
  ): Promise<boolean>;

  // --- reviews ---
  createReview(
    ride: Ride,
    reviewer: User,
    input: CreateReviewRequest,
  ): Promise<{ review?: Review; error?: string }>;
  listReviewsForRide(rideId: string): Promise<Review[]>;
  listReviewsForUser(userId: string): Promise<Review[]>;

  // --- ingestion staging ---
  recordSource(entry: {
    source: SourceId;
    source_event_id: string;
    source_url: string;
    concert_id: string | null;
    raw_json: string;
  }): Promise<void>;
}

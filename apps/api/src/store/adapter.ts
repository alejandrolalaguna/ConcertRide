import type {
  Concert,
  CreateConcertInput,
  CreateRideRequest,
  CreateReviewRequest,
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
  Vibe,
} from "@concertride/types";
import type { RawConcert, SourceId } from "../ingest/types";

export interface ConcertFilters {
  city?: string;
  artist?: string;
  genre?: string;
  festival?: boolean;
  date_from?: string;
  date_to?: string;
  limit: number;
  offset: number;
}

export interface ConcertFacets {
  genres: string[];
  cities: string[];
}

export interface RideFilters {
  concert_id?: string;
  origin_city?: string;
  driver_id?: string;
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
  updatePassword(userId: string, hash: string, salt: string): Promise<void>;
  markEmailVerified(userId: string): Promise<User | null>;
  // GDPR art.17 right-to-erasure. Anonymises the user (email, name, phone,
  // avatar cleared), cancels their active rides, removes push subscriptions,
  // favorites and demand signals. Reviews are kept for marketplace integrity
  // but attributed to "Usuario eliminado".
  deleteUser(userId: string): Promise<void>;
  useReferral(referralCode: string, newUserId: string): Promise<void>;
  verifyLicense(userId: string): Promise<User | null>;

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
  // Distinct, normalised genres and cities from the live concert corpus —
  // drives the dropdowns on /concerts so the filter options always match
  // what's actually in the DB.
  listConcertFacets(): Promise<ConcertFacets>;

  // --- abuse reports ---
  createReport(
    reporterId: string,
    args: { target_user_id?: string; ride_id?: string; reason: ReportReason; body?: string },
  ): Promise<Report>;
  countReportsByReporterSince(reporterId: string, sinceISO: string): Promise<number>;
  // Admin-only. Returns reports with hydrated reporter + target_user for
  // the moderation dashboard. Filter by status; defaults to all.
  listReportsForAdmin(
    filter?: { status?: import("@concertride/types").ReportStatus },
  ): Promise<
    Array<
      Report & {
        reporter: User | null;
        target_user: User | null;
      }
    >
  >;
  updateReportStatus(
    id: string,
    status: import("@concertride/types").ReportStatus,
  ): Promise<Report | null>;

  // --- favorites ---
  listFavorites(userId: string): Promise<Favorite[]>;
  addFavorite(userId: string, kind: FavoriteKind, targetId: string, label: string): Promise<Favorite>;
  removeFavorite(userId: string, kind: FavoriteKind, targetId: string): Promise<void>;
  // Upcoming concerts tied to a user's favourites — matches concerts they
  // starred directly OR concerts by a favourited artist OR in a favourited
  // venue city. Used by the /favoritos page.
  listFavoriteUpcomingConcerts(userId: string): Promise<Concert[]>;
  getConcert(id: string): Promise<Concert | null>;
  createConcert(input: CreateConcertInput): Promise<Concert>;
  upsertConcertFromIngest(raw: RawConcert, venueId: string): Promise<UpsertConcertResult>;

  // --- rides ---
  listRides(filters: RideFilters): Promise<Ride[]>;
  getRide(id: string): Promise<Ride | null>;
  createRide(driver: User, concert: Concert, input: CreateRideRequest): Promise<Ride>;
  confirmRideComplete(rideId: string, confirmedBy: "driver" | "passenger"): Promise<Ride | null>;
  // Driver revokes their own confirmation before the passenger confirms —
  // only valid while status is still active/full and confirmation === "driver".
  revokeDriverCompletion(rideId: string): Promise<Ride | null>;
  // Driver cancels the ride entirely. Cascades: any pending/confirmed
  // requests are also set to "cancelled" so the UX is consistent for
  // passengers who had booked.
  cancelRide(rideId: string): Promise<Ride | null>;
  // Update mutable fields of a ride. Only the driver should call this via
  // the route layer; the store doesn't enforce authz.
  updateRide(
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
        | "accepted_payment"
        | "origin_address"
      >
    >,
  ): Promise<Ride | null>;

  // Rides with departure_time in the given ISO window whose `reminded_at` is
  // still null. Used by the hourly cron that sends the 24h reminder email.
  listRidesForReminder(fromISO: string, toISO: string): Promise<Ride[]>;
  markRideReminded(rideId: string): Promise<void>;

  // --- ride requests ---
  listRequestsForRide(rideId: string): Promise<RideRequest[]>;
  getRequest(id: string): Promise<RideRequest | null>;
  // All requests created by a given passenger, with the associated ride
  // hydrated. Used by the "Mis viajes" page.
  listRequestsByPassenger(
    passengerId: string,
  ): Promise<Array<RideRequest & { ride: Ride }>>;
  createRequest(
    ride: Ride,
    passenger: User,
    seats: number,
    message?: string,
    luggage?: string,
    payment_method?: string,
  ): Promise<CreateRequestResult>;
  updateRequestStatus(requestId: string, status: RequestStatus): Promise<RideRequest | null>;

  // --- demand signals ---
  getDemandSignal(concertId: string, userId: string | null): Promise<DemandSignal>;
  toggleDemandSignal(concertId: string, user: User): Promise<DemandSignal>;
  listInterestedUsers(concertId: string): Promise<User[]>;

  // --- messages (ride thread + concert chat) ---
  listMessages(scope: { ride_id: string } | { concert_id: string }): Promise<Message[]>;
  createMessage(
    scope: { ride_id: string } | { concert_id: string },
    user: User,
    body: string,
    opts?: { kind?: import("@concertride/types").MessageKind; attachment_url?: string },
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

  // --- push subscriptions ---
  savePushSubscription(userId: string, sub: { endpoint: string; p256dh: string; auth: string }): Promise<void>;
  removePushSubscription(endpoint: string): Promise<void>;
  getPushSubscriptionsForUser(userId: string): Promise<{ endpoint: string; p256dh: string; auth: string }[]>;

  // --- ingestion staging ---
  recordSource(entry: {
    source: SourceId;
    source_event_id: string;
    source_url: string;
    concert_id: string | null;
    raw_json: string;
  }): Promise<void>;

  // --- maintenance ---
  // Deletes concerts whose date is before `beforeDate` and have no active rides.
  deletePastConcerts(beforeDate: string): Promise<number>;
}

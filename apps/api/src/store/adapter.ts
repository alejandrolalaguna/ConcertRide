import type {
  AdminAuditAction,
  AdminAuditLogEntry,
  Concert,
  CreateConcertInput,
  CreateRideRequest,
  CreateReviewRequest,
  DemandSignal,
  Favorite,
  FavoriteKind,
  IdentityReview,
  LicenseReview,
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

export interface AdminStats {
  users: {
    total: number;
    verified_email: number;
    license_verified: number;
    new_last_7d: number;
  };
  rides: {
    total_active: number;
    total_all_time: number;
    published_last_7d: number;
    seats_available: number;
  };
  bookings: {
    confirmed_all_time: number;
    confirmed_last_7d: number;
    pending: number;
  };
  concerts: {
    total: number;
    upcoming: number;
    with_active_rides: number;
  };
  top_cities: Array<{ city: string; ride_count: number }>;
}

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

  // --- license reviews ---
  // Stores the KV key of the uploaded document and creates a pending review.
  createLicenseReview(userId: string, fileKvKey: string): Promise<LicenseReview>;
  // User: get own latest license review (null if never submitted).
  getMyLicenseReview(userId: string): Promise<LicenseReview | null>;
  // Admin: list all reviews, optionally filtered by status.
  listLicenseReviews(filter?: { status?: "pending" | "approved" | "rejected" }): Promise<Array<LicenseReview & { user: User | null }>>;
  // Admin: approve — sets review to approved + calls verifyLicense on the user.
  approveLicenseReview(reviewId: string): Promise<{ review: LicenseReview; user: User | null }>;
  // Admin: reject — sets review to rejected with a reason.
  rejectLicenseReview(reviewId: string, reason: string): Promise<LicenseReview | null>;

  // --- identity reviews (passenger DNI/passport) ---
  createIdentityReview(userId: string, fileKvKey: string): Promise<IdentityReview>;
  getMyIdentityReview(userId: string): Promise<IdentityReview | null>;
  listIdentityReviews(filter?: { status?: "pending" | "approved" | "rejected" }): Promise<Array<IdentityReview & { user: User | null }>>;
  approveIdentityReview(reviewId: string): Promise<{ review: IdentityReview; user: User | null }>;
  rejectIdentityReview(reviewId: string, reason: string): Promise<IdentityReview | null>;
  verifyIdentity(userId: string): Promise<User | null>;

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

  // Rides with departure_time in the given ISO window whose `payment_reminder_sent_at`
  // is still null. Used by the hourly cron that sends the 1h payment reminder.
  listRidesForPaymentReminder(fromISO: string, toISO: string): Promise<Ride[]>;
  markPaymentReminderSent(rideId: string): Promise<void>;

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

  // --- admin stats ---
  getAdminStats(): Promise<AdminStats>;

  // --- ban system ---
  banUser(adminId: string, userId: string, reason: string): Promise<User | null>;
  unbanUser(adminId: string, userId: string): Promise<User | null>;
  isEmailBanned(email: string): Promise<boolean>;

  // --- admin audit log ---
  logAdminAction(
    adminId: string,
    action: AdminAuditAction,
    targetUserId?: string,
    details?: string,
  ): Promise<AdminAuditLogEntry>;
  listAdminAuditLog(limit?: number): Promise<AdminAuditLogEntry[]>;

  // --- phone verification ---
  markPhoneVerified(userId: string): Promise<User | null>;

  // --- ride checklist ---
  // Get all checklist items for a ride
  listChecklistForRide(rideId: string): Promise<Array<{ id: string; item_type: string; value: string | null; status: string; created_at: string; confirmed_at: string | null }>>;
  // Create a new checklist item
  createChecklistItem(
    rideId: string,
    itemType: "pickup_location" | "pickup_time" | "driver_phone" | "luggage_confirmation",
    value?: string,
  ): Promise<{ id: string; item_type: string; value: string | null; status: string; created_at: string; confirmed_at: string | null }>;
  // Update checklist item status to "confirmed"
  confirmChecklistItem(itemId: string): Promise<{ id: string; item_type: string; value: string | null; status: string; created_at: string; confirmed_at: string | null } | null>;

  // --- festival alerts ---
  // Subscribe an email to ride-published notifications for a festival.
  // Returns { created: true } on first subscribe, { created: false } if already subscribed.
  subscribeFestivalAlert(email: string, festivalSlug: string): Promise<{ created: boolean }>;

  // --- maintenance ---
  // Deletes concerts whose date is before `beforeDate` and have no active rides.
  deletePastConcerts(beforeDate: string): Promise<number>;
}

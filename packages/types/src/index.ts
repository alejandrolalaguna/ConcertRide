export type Vibe = "party" | "chill" | "mixed";
export type Luggage = "none" | "small" | "backpack" | "cabin" | "large" | "extra";
export type SmokingPolicy = "no" | "yes";
export type RideStatus = "active" | "full" | "cancelled" | "completed";
export type RequestStatus = "pending" | "confirmed" | "rejected" | "cancelled";
export type PaymentMethod = "cash" | "bizum" | "cash_or_bizum";

export interface Venue {
  id: string;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  capacity: number | null;
  image_url: string | null;
}

export interface Concert {
  id: string;
  name: string;
  artist: string;
  venue_id: string;
  venue: Venue;
  date: string;
  image_url: string | null;
  ticketmaster_id: string | null;
  ticketmaster_url: string | null;
  official_url: string | null;
  lineup: string | null;
  genre: string | null;
  price_min: number | null;
  price_max: number | null;
  active_rides_count: number;
  demand_count?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  verified: boolean;
  rating: number;
  rating_count: number;
  car_model: string | null;
  car_color: string | null;
  rides_given: number;
  phone: string | null;
  home_city: string | null;
  smoker: boolean | null;
  has_license: boolean | null;
  license_verified: boolean;
  identity_verified: boolean;
  referral_code: string | null;
  referral_count: number;
  tos_accepted_at: string | null;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  deleted_at: string | null;
  banned_at: string | null;
  ban_reason: string | null;
  bio: string | null;
  music_genres: string[] | null;
  top_artists: string[] | null;
  spotify_id: string | null;
  handle: string | null;
  crew_count: number;
  created_at: string;
}

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

// ── Admin dashboard (comprehensive DB overview) ────────────────────────────
// Powers the visual admin dashboard. One round-trip aggregation across every
// table so the panel can render cards + charts without N queries.
export interface AdminDashboard {
  generated_at: string;
  users: {
    total: number;
    verified_email: number;
    unverified_email: number;
    license_verified: number;
    identity_verified: number;
    phone_verified: number;
    banned: number;
    with_home_city: number;
    new_7d: number;
    new_30d: number;
  };
  rides: {
    total: number;
    active: number;
    full: number;
    completed: number;
    cancelled: number;
    round_trip: number;
    seats_available: number;
    avg_price: number;
    published_7d: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    rejected: number;
    cancelled: number;
  };
  reviews: { total: number; avg_rating: number };
  favorites: { total: number; concert: number; artist: number; city: number };
  engagement: {
    chat_messages: number;
    direct_messages: number;
    demand_signals: number;
    festival_demand: number;
    festival_alerts: number;
    event_anticipations: number;
    crew_connections: number;
    squads: number;
    squad_members: number;
    trip_memories: number;
    activity_events: number;
  };
  catalog: { concerts: number; upcoming_concerts: number; venues: number };
  moderation: {
    reports_pending: number;
    reports_total: number;
    license_pending: number;
    license_approved: number;
    license_rejected: number;
    identity_pending: number;
  };
  top_cities: Array<{ city: string; ride_count: number }>;
  top_concerts: Array<{ concert_id: string; name: string; ride_count: number }>;
  activity_by_kind: Array<{ kind: string; count: number }>;
  signups_by_day: Array<{ date: string; count: number }>;
  rides_by_day: Array<{ date: string; count: number }>;
}

// Generic drill-down for a single dashboard metric. The frontend renders
// `rows` as a table using `columns` for headers/order. Each metric maps to a
// list of the underlying records (e.g. favorites_total → every favorite with
// the user who saved it and what they saved).
export interface AdminBreakdownColumn {
  key: string;
  label: string;
}
export interface AdminBreakdown {
  metric: string;
  title: string;
  columns: AdminBreakdownColumn[];
  rows: Array<Record<string, string | number | null>>;
  total: number;
  // Set when rows were capped (rows.length < total).
  truncated?: boolean;
}

// One row per user in the admin users table, with derived activity counts.
export interface AdminUserListItem {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  email_verified: boolean;
  license_verified: boolean;
  identity_verified: boolean;
  phone_verified: boolean;
  banned: boolean;
  home_city: string | null;
  rating: number;
  created_at: string;
  rides_published: number;
  requests_made: number;
  favorites_count: number;
  messages_sent: number;
  reviews_received: number;
}

// Full per-user breakdown shown when an admin drills into a user.
export interface AdminUserDetail {
  user: User;
  rides: Array<{
    id: string;
    concert_id: string;
    concert_name: string | null;
    origin_city: string;
    status: string;
    price_per_seat: number;
    seats_total: number;
    seats_left: number;
    departure_time: string;
    created_at: string;
  }>;
  requests: Array<{ id: string; ride_id: string; status: string; seats: number; created_at: string }>;
  favorites: Array<{ id: string; kind: string; target_id: string; label: string; created_at: string }>;
  messages: Array<{
    id: string;
    ride_id: string | null;
    concert_id: string | null;
    kind: string;
    body: string;
    created_at: string;
  }>;
  reviews_received: Array<{ id: string; rating: number; comment: string | null; created_at: string }>;
  anticipations: Array<{ id: string; concert_id: string; status: string; created_at: string }>;
}

export type LicenseReviewStatus = "pending" | "approved" | "rejected";

export interface LicenseReview {
  id: string;
  user_id: string;
  file_kv_key: string;
  status: LicenseReviewStatus;
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

export type IdentityReviewStatus = "pending" | "approved" | "rejected";

export interface IdentityReview {
  id: string;
  user_id: string;
  file_kv_key: string;
  status: IdentityReviewStatus;
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

export type ReportReason = "spam" | "scam" | "harassment" | "no_show" | "unsafe" | "other";
export type ReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";

export interface Report {
  id: string;
  reporter_id: string;
  target_user_id: string | null;
  ride_id: string | null;
  reason: ReportReason;
  body: string | null;
  status: ReportStatus;
  created_at: string;
}

export interface CreateReportRequest {
  target_user_id?: string;
  ride_id?: string;
  reason: ReportReason;
  body?: string;
}

export interface UpdateProfileInput {
  name?: string;
  phone?: string | null;
  home_city?: string | null;
  smoker?: boolean | null;
  has_license?: boolean | null;
  car_model?: string | null;
  car_color?: string | null;
  bio?: string | null;
  music_genres?: string[] | null;
  top_artists?: string[] | null;
  handle?: string | null;
}

export interface Ride {
  id: string;
  driver_id: string;
  driver: User;
  concert_id: string;
  concert: Concert;
  origin_city: string;
  origin_lat: number;
  origin_lng: number;
  origin_address: string;
  departure_time: string;
  price_per_seat: number;
  seats_total: number;
  seats_left: number;
  round_trip: boolean;
  return_time: string | null;
  playlist_url: string | null;
  vibe: Vibe;
  smoking_policy: SmokingPolicy;
  max_luggage: Luggage;
  notes: string | null;
  instant_booking: boolean;
  price_negotiable: boolean;
  accepted_payment: PaymentMethod;
  status: RideStatus;
  completed_at: string | null;
  completion_confirmed_by: "driver" | "both" | null;
  reminded_at: string | null;
  payment_reminder_sent_at: string | null;
  created_at: string;
  is_participant?: boolean;
}

export interface RideRequest {
  id: string;
  ride_id: string;
  passenger_id: string;
  passenger: User;
  seats: number;
  status: RequestStatus;
  message: string | null;
  luggage: Luggage | null;
  payment_method: PaymentMethod | null;
  created_at: string;
}

export type RideChecklistItemType = "pickup_location" | "pickup_time" | "driver_phone" | "luggage_confirmation";

export interface RideChecklistItem {
  id: string;
  ride_id: string;
  item_type: RideChecklistItemType;
  value: string | null;
  status: "pending" | "confirmed";
  created_at: string;
  confirmed_at: string | null;
}

export interface DemandSignal {
  count: number;
  user_has_signaled: boolean;
}

export type MessageKind = "text" | "location" | "photo";

export interface Message {
  id: string;
  ride_id: string | null;
  concert_id: string | null;
  user_id: string;
  user: User;
  kind: MessageKind;
  body: string;
  attachment_url: string | null;
  created_at: string;
}

export interface SendMessageRequest {
  body: string;
  seats?: number;
}

export interface MessagesResponse {
  messages: Message[];
}

export interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  sender: User;
  recipient: User;
  kind: MessageKind;
  body: string;
  attachment_url: string | null;
  created_at: string;
}

export interface DirectMessagesResponse {
  messages: DirectMessage[];
}

// One entry per conversation (DM, ride chat, or concert chat) for the inbox view.
export type ConversationKind = "dm" | "ride" | "concert";

export interface ConversationPreview {
  kind: ConversationKind;
  // For DMs: the other user. For ride/concert: null.
  other_user: User | null;
  // For ride chats: the ride summary. For concert/dm: null.
  ride_id: string | null;
  ride_label: string | null;
  // For concert chats: the concert summary. For ride/dm: null.
  concert_id: string | null;
  concert_label: string | null;
  last_message_body: string;
  last_message_at: string;
  unread_count: number;
}

export interface ConversationsResponse {
  conversations: ConversationPreview[];
}

export type FavoriteKind = "concert" | "artist" | "city";

export interface Favorite {
  id: string;
  kind: FavoriteKind;
  target_id: string;
  label: string;
  created_at: string;
}

export interface FavoritesResponse {
  // Flat list — easy to index client-side with a Set for "is this favorited?"
  favorites: Favorite[];
  // Upcoming concerts the user flagged as favourite, hydrated for display
  // on the /favoritos page. Includes concerts whose artist or venue city is
  // favourited, even if the concert itself isn't directly starred.
  upcoming_concerts: Concert[];
}

export interface CreateFavoriteRequest {
  kind: FavoriteKind;
  target_id: string;
  label: string;
}

export interface Review {
  id: string;
  ride_id: string;
  reviewer_id: string;
  reviewer: User;
  reviewee_id: string;
  reviewee: User;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface CreateReviewRequest {
  reviewee_id: string;
  rating: number;
  comment?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
}

export type AdminAuditAction = "ban_user" | "unban_user" | "license_approve" | "license_reject" | "identity_approve" | "identity_reject" | "report_resolve" | "report_dismiss";

export interface AdminAuditLogEntry {
  id: string;
  admin_id: string;
  action: AdminAuditAction;
  target_user_id: string | null;
  details: string | null;
  created_at: string;
}

export interface CreateRideRequest {
  concert_id: string;
  origin_city: string;
  origin_lat: number;
  origin_lng: number;
  origin_address: string;
  departure_time: string;
  price_per_seat: number;
  seats_total: number;
  round_trip: boolean;
  return_time?: string;
  playlist_url?: string;
  vibe: Vibe;
  smoking_policy?: SmokingPolicy;
  max_luggage?: Luggage;
  notes?: string;
  instant_booking?: boolean;
  price_negotiable?: boolean;
  accepted_payment?: PaymentMethod;
}

export interface RequestSeatRequest {
  seats: number;
  message?: string;
  luggage?: Luggage;
  payment_method?: PaymentMethod;
}

export interface ConcertsQuery {
  city?: string;
  date_from?: string;
  date_to?: string;
  artist?: string;
  genre?: string;
  festival?: boolean;
  limit?: number;
  offset?: number;
}

export interface CreateConcertInput {
  artist: string;
  name: string;
  venue_name: string;
  venue_city: string;
  date: string;
  genre?: string;
  official_url?: string;
  lineup?: string;
}

export interface RidesQuery {
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

export interface ConcertsResponse {
  concerts: Concert[];
  total: number;
  page: number;
}

export interface RidesResponse {
  rides: Ride[];
  total: number;
}

export interface VenuesResponse {
  venues: Venue[];
}

export interface HealthResponse {
  status: "ok";
  timestamp: string;
  environment: "development" | "production";
}

export interface ErrorResponse {
  error: string;
  message?: string;
  path?: string;
}

// =====================================================================
// Social density types — Phase 1 (crews / activity / anticipation / memories)
// =====================================================================

export type CrewStatus = "pending" | "accepted" | "blocked";

export interface CrewMember {
  user: User;
  status: CrewStatus;
  // True when the current viewer initiated the connection.
  initiated_by_me: boolean;
  origin_ride_id: string | null;
  origin_concert_id: string | null;
  origin_concert_label: string | null;
  shared_genres: string[];
  shared_artists: string[];
  // Number of completed rides between viewer and this user.
  rides_together: number;
  connected_at: string;
}

export interface CrewListResponse {
  crew: CrewMember[];
  pending_incoming: CrewMember[];
  pending_outgoing: CrewMember[];
  total: number;
}

export interface CrewInviteRequest {
  // The other user's id.
  user_id: string;
  // Optional ride that introduced you. Used to render provenance.
  ride_id?: string;
}

export type ActivityKind =
  | "ride_published"
  | "ride_booked"
  | "ride_completed"
  | "interest_added"
  | "favorite_added"
  | "crew_invited"
  | "crew_accepted"
  | "music_updated"
  | "trip_memory_shared";

export interface ActivityEvent {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_avatar: string | null;
  kind: ActivityKind;
  target_id: string | null;
  concert_id: string | null;
  concert_name: string | null;
  city: string | null;
  label: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export type ActivityScope = "all" | "city" | "concert" | "crew" | "self";

export interface ActivityFeedQuery {
  scope?: ActivityScope;
  city?: string;
  concert_id?: string;
  limit?: number;
  before?: string;
}

export interface ActivityFeedResponse {
  events: ActivityEvent[];
  has_more: boolean;
}

export type AnticipationStatus = "going" | "maybe";

export interface EventAnticipation {
  id: string;
  user_id: string;
  concert_id: string;
  status: AnticipationStatus;
  ride_id: string | null;
  notify_before_hours: number;
  created_at: string;
}

export interface AnticipationSummary {
  going_count: number;
  maybe_count: number;
  user_status: AnticipationStatus | null;
  // Up to 8 representative attendees for avatar stack.
  preview: Array<{ id: string; name: string; avatar_url: string | null }>;
  // Subset of preview that are in the viewer's crew.
  crew_attending: Array<{ id: string; name: string; avatar_url: string | null }>;
}

export type TripMemoryVisibility = "public" | "crew" | "private";

export interface TripMemory {
  id: string;
  ride_id: string;
  concert_id: string;
  concert_name: string;
  concert_artist: string;
  created_by: string;
  creator_name: string;
  creator_avatar: string | null;
  title: string;
  caption: string | null;
  vibe: Vibe;
  origin_city: string;
  destination_city: string;
  distance_km: number | null;
  crew: Array<{ id: string; name: string; avatar_url: string | null }>;
  playlist_url: string | null;
  hero_color: string | null;
  share_image_url: string | null;
  visibility: TripMemoryVisibility;
  share_count: number;
  created_at: string;
}

export interface CreateTripMemoryRequest {
  ride_id: string;
  title?: string;
  caption?: string;
  visibility?: TripMemoryVisibility;
}

// =====================================================================
// Cultural platform — Phase 2 (festival Q&A / squads / playlists / badges)
// =====================================================================

export interface FestivalQna {
  id: string;
  festival_slug: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  question: string;
  answer: string;
  upvotes: number;
  approved: boolean;
  approved_at: string | null;
  created_at: string;
}

export interface CreateFestivalQnaRequest {
  festival_slug: string;
  question: string;
  answer: string;
}

export type SquadVisibility = "public" | "private";
export type SquadRole = "owner" | "driver" | "passenger" | "looking";

export interface SquadMember {
  user: User;
  role: SquadRole;
  ride_id: string | null;
  joined_at: string;
}

export interface Squad {
  id: string;
  concert: Concert;
  owner: User;
  name: string;
  vibe_tags: string[];
  visibility: SquadVisibility;
  invite_code: string;
  invite_url: string;
  members: SquadMember[];
  rides: Ride[];
  created_at: string;
}

export interface CreateSquadRequest {
  concert_id: string;
  name: string;
  vibe_tags?: string[];
  visibility?: SquadVisibility;
}

export interface JoinSquadRequest {
  invite_code: string;
  ride_id?: string;
  role?: SquadRole;
}

export interface PlaylistTrack {
  id: string;
  ride_id: string | null;
  squad_id: string | null;
  added_by: string;
  added_by_name: string;
  track_uri: string | null;
  track_name: string;
  artist_name: string;
  album_image_url: string | null;
  duration_ms: number | null;
  position: number;
  created_at: string;
}

export interface AddPlaylistTrackRequest {
  ride_id?: string;
  squad_id?: string;
  track_uri?: string;
  track_name: string;
  artist_name: string;
  album_image_url?: string;
  duration_ms?: number;
}

// Computed badges — derived from rides_given, rating, license_verified.
// Not persisted; the API returns them when hydrating a public profile.
export type DriverBadgeId =
  | "verified_driver"      // license + identity verified
  | "veteran"              // 25+ completed rides
  | "vibe_curator"         // average rating ≥ 4.8 with 10+ ratings
  | "festival_regular"     // 5+ rides to festivals in last 12 months
  | "early_bird"           // joined ConcertRide before 2026-01-01
  | "playlist_master";     // contributed 10+ tracks across squads

export interface DriverBadge {
  id: DriverBadgeId;
  label: string;
  description: string;
  // Optional metric backing the badge (e.g., "32 viajes" for veteran).
  metric?: string;
}

// Music compatibility between two users — used in ride listings.
export interface MusicCompatibility {
  // 0..100. >= 70 highlighted, >= 90 "ALTA AFINIDAD".
  score: number;
  shared_genres: string[];
  shared_artists: string[];
}

// =====================================================================
// Phase 3.10 — Travel stats (Spotify-Wrapped style)
// =====================================================================

export interface TravelStats {
  // Year covered. 0 means "all time".
  year: number;
  rides_as_driver: number;
  rides_as_passenger: number;
  total_km: number;
  unique_artists: string[];
  unique_cities: string[];
  unique_festivals: string[];
  // CO2 saved estimate in kg. Computed assuming 4 passengers per car
  // saving 3 individual car trips at ~120 g/km.
  co2_saved_kg: number;
  // Vibe distribution (counts per vibe).
  vibe_distribution: Record<Vibe, number>;
  // Top crew members ordered by rides_together desc.
  top_crew: Array<{ user_id: string; name: string; avatar_url: string | null; rides_together: number }>;
  // Most-played artist (from concerts the user attended).
  top_artist: string | null;
}

export interface FestivalHistoryEntry {
  // Festival slug (matches festivalLandings.ts).
  slug: string;
  // Display name.
  name: string;
  // First time the user attended (ISO date).
  first_attended: string;
  // Most recent attendance.
  last_attended: string;
  // Number of times attended (distinct concerts).
  times_attended: number;
  // Trip memories shared from this festival.
  memories: TripMemory[];
}

// =====================================================================
// Phase 3.11 — Ride demand predictions
// =====================================================================

export interface DemandPrediction {
  concert: Concert;
  // Number of users with a "going" anticipation.
  going_count: number;
  // Number of currently-active rides to this concert.
  active_rides: number;
  // Heuristic 0..100. Higher = more urgent need for new rides.
  urgency: number;
  // Cities with the most demand but no ride yet.
  underserved_cities: string[];
}

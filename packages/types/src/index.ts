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
  referral_code: string | null;
  referral_count: number;
  tos_accepted_at: string | null;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  deleted_at: string | null;
  banned_at: string | null;
  ban_reason: string | null;
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
  accepted_payment: PaymentMethod;
  status: RideStatus;
  completed_at: string | null;
  completion_confirmed_by: "driver" | "both" | null;
  reminded_at: string | null;
  created_at: string;
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

export type AdminAuditAction = "ban_user" | "unban_user" | "license_approve" | "license_reject" | "report_resolve" | "report_dismiss";

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

export type Vibe = "party" | "chill" | "mixed";
export type RideStatus = "active" | "full" | "cancelled";
export type RequestStatus = "pending" | "confirmed" | "rejected" | "cancelled";

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
  genre: string | null;
  price_min: number | null;
  price_max: number | null;
  active_rides_count: number;
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
  created_at: string;
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
  notes: string | null;
  status: RideStatus;
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
  created_at: string;
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
  notes?: string;
}

export interface RequestSeatRequest {
  seats: number;
  message?: string;
}

export interface ConcertsQuery {
  city?: string;
  date_from?: string;
  date_to?: string;
  artist?: string;
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
}

export interface RidesQuery {
  concert_id?: string;
  origin_city?: string;
  vibe?: Vibe;
  max_price?: number;
  round_trip?: boolean;
  adhoc?: boolean;
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

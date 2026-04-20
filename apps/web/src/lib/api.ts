import type {
  Concert,
  ConcertsQuery,
  ConcertsResponse,
  CreateConcertInput,
  CreateReviewRequest,
  CreateRideRequest,
  HealthResponse,
  RequestSeatRequest,
  RequestStatus,
  Review,
  ReviewsResponse,
  Ride,
  RideRequest,
  RidesQuery,
  RidesResponse,
  UpdateProfileInput,
  User,
  VenuesResponse,
} from "@concertride/types";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly path: string,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${BASE}${path}`;
  const headers: Record<string, string> = {
    accept: "application/json",
    ...(init.body ? { "content-type": "application/json" } : {}),
    ...(init.headers as Record<string, string> | undefined),
  };

  const res = await fetch(url, { ...init, headers, credentials: "include" });
  const ctype = res.headers.get("content-type") ?? "";
  const body = ctype.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      (typeof body === "object" && body && "message" in body && String(body.message)) ||
      (typeof body === "object" && body && "error" in body && String(body.error)) ||
      res.statusText;
    throw new ApiError(message, res.status, path, body);
  }
  return body as T;
}

function query(params: object) {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    usp.set(k, String(v));
  }
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

export interface AuthResponse {
  ok: true;
  user: User;
}

export interface MeResponse {
  user: User | null;
}

export const api = {
  health: () => request<HealthResponse>("/api/health"),
  auth: {
    register: (
      email: string,
      password: string,
      name: string,
      profile?: { phone?: string; home_city?: string; smoker?: boolean },
    ) =>
      request<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name, ...profile }),
      }),
    login: (email: string, password: string) =>
      request<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    me: () => request<MeResponse>("/api/auth/me"),
    updateProfile: (input: UpdateProfileInput) =>
      request<{ ok: true; user: User }>("/api/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
    logout: () => request<{ ok: true }>("/api/auth/logout", { method: "POST" }),
  },
  concerts: {
    list: (q: ConcertsQuery = {}) => request<ConcertsResponse>(`/api/concerts${query(q)}`),
    get: (id: string) => request<Concert>(`/api/concerts/${encodeURIComponent(id)}`),
    create: (input: CreateConcertInput) =>
      request<Concert>("/api/concerts", {
        method: "POST",
        body: JSON.stringify(input),
      }),
  },
  rides: {
    list: (q: RidesQuery = {}) => request<RidesResponse>(`/api/rides${query(q)}`),
    get: (id: string) => request<Ride>(`/api/rides/${encodeURIComponent(id)}`),
    create: (input: CreateRideRequest) =>
      request<Ride>("/api/rides", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    requestSeat: (rideId: string, input: RequestSeatRequest) =>
      request<RideRequest>(`/api/rides/${encodeURIComponent(rideId)}/request`, {
        method: "POST",
        body: JSON.stringify(input),
      }),
    listRequests: (rideId: string) =>
      request<{ requests: RideRequest[] }>(
        `/api/rides/${encodeURIComponent(rideId)}/requests`,
      ),
    updateRequest: (rideId: string, requestId: string, status: RequestStatus) =>
      request<RideRequest>(
        `/api/rides/${encodeURIComponent(rideId)}/request/${encodeURIComponent(requestId)}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      ),
  },
  venues: {
    list: () => request<VenuesResponse>("/api/venues"),
  },
  reviews: {
    list: (rideId: string) =>
      request<ReviewsResponse>(`/api/rides/${encodeURIComponent(rideId)}/reviews`),
    create: (rideId: string, input: CreateReviewRequest) =>
      request<Review>(`/api/rides/${encodeURIComponent(rideId)}/reviews`, {
        method: "POST",
        body: JSON.stringify(input),
      }),
  },
};

export { ApiError };

import type {
  AdminAuditLogEntry,
  AdminStats,
  Concert,
  ConcertsQuery,
  ConcertsResponse,
  CreateConcertInput,
  CreateReviewRequest,
  CreateRideRequest,
  CreateReportRequest,
  DemandSignal,
  Favorite,
  FavoriteKind,
  FavoritesResponse,
  HealthResponse,
  LicenseReview,
  Report,
  Message,
  MessagesResponse,
  RequestSeatRequest,
  RequestStatus,
  Review,
  ReviewsResponse,
  Ride,
  RideChecklistItem,
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
  const isFormData = init.body instanceof FormData;
  const headers: Record<string, string> = {
    accept: "application/json",
    ...(init.body && !isFormData ? { "content-type": "application/json" } : {}),
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
      ref?: string,
    ) =>
      request<AuthResponse>(`/api/auth/register${ref ? `?ref=${encodeURIComponent(ref)}` : ""}`, {
        method: "POST",
        body: JSON.stringify({ email, password, name, tos_accepted: true, ...profile }),
      }),
    deleteAccount: () =>
      request<{ ok: true }>("/api/auth/me", { method: "DELETE" }),
    login: (email: string, password: string) =>
      request<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    forgotPassword: (email: string) =>
      request<{ ok: true }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    resendVerification: () =>
      request<{ ok: true; already?: boolean }>("/api/auth/resend-verification", {
        method: "POST",
      }),
    resetPassword: (token: string, password: string) =>
      request<AuthResponse>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      }),
    me: () => request<MeResponse>("/api/auth/me"),
    updateProfile: (input: UpdateProfileInput) =>
      request<{ ok: true; user: User }>("/api/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
    verifyLicense: (file: File) => {
      const form = new FormData();
      form.append("document", file);
      return request<{ ok: true; status: "pending"; review_id: string }>("/api/auth/verify-license", {
        method: "POST",
        body: form,
      });
    },
    sendPhoneOtp: (phone: string) =>
      request<{ ok: true; otp?: string }>("/api/auth/send-phone-otp", {
        method: "POST",
        body: JSON.stringify({ phone }),
      }),
    verifyPhoneOtp: (otp: string) =>
      request<{ ok: true; user: User }>("/api/auth/verify-phone-otp", {
        method: "POST",
        body: JSON.stringify({ otp }),
      }),
    logout: () => request<{ ok: true }>("/api/auth/logout", { method: "POST" }),
  },
  concerts: {
    list: (q: ConcertsQuery = {}) => request<ConcertsResponse>(`/api/concerts${query(q)}`),
    facets: () => request<{ genres: string[]; cities: string[] }>("/api/concerts/facets"),
    get: (id: string) => request<Concert>(`/api/concerts/${encodeURIComponent(id)}`),
    create: (input: CreateConcertInput) =>
      request<Concert>("/api/concerts", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    getInterest: (concertId: string) =>
      request<DemandSignal>(`/api/concerts/${encodeURIComponent(concertId)}/interest`),
    toggleInterest: (concertId: string) =>
      request<DemandSignal>(`/api/concerts/${encodeURIComponent(concertId)}/interest`, {
        method: "POST",
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
    bookInstant: (rideId: string, input: RequestSeatRequest) =>
      request<RideRequest>(`/api/rides/${encodeURIComponent(rideId)}/book`, {
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
    cancel: (rideId: string) =>
      request<Ride>(`/api/rides/${encodeURIComponent(rideId)}`, { method: "DELETE" }),
    update: (
      rideId: string,
      patch: Partial<{
        departure_time: string;
        return_time: string;
        price_per_seat: number;
        seats_total: number;
        notes: string | null;
        playlist_url: string | null;
        vibe: "party" | "chill" | "mixed";
        smoking_policy: "no" | "yes";
        max_luggage: "none" | "small" | "backpack" | "cabin" | "large" | "extra";
        instant_booking: boolean;
        accepted_payment: "cash" | "bizum" | "cash_or_bizum";
        origin_address: string;
      }>,
    ) =>
      request<Ride>(`/api/rides/${encodeURIComponent(rideId)}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),
    listMine: () =>
      request<{
        driver_rides: Ride[];
        passenger_requests: Array<RideRequest & { ride: Ride }>;
      }>("/api/rides/mine"),
    confirmComplete: (rideId: string) =>
      request<Ride>(`/api/rides/${encodeURIComponent(rideId)}/complete`, { method: "POST" }),
    revokeComplete: (rideId: string) =>
      request<Ride>(`/api/rides/${encodeURIComponent(rideId)}/complete`, { method: "DELETE" }),
    getMyRequest: (rideId: string) =>
      request<{ request: RideRequest | null }>(
        `/api/rides/${encodeURIComponent(rideId)}/my-request`,
      ),
    confirmedPassengers: (rideId: string) =>
      request<{ passengers: Array<{ id: string; name: string; initial: string; seats: number }> }>(
        `/api/rides/${encodeURIComponent(rideId)}/confirmed-passengers`,
      ),
    listChecklist: (rideId: string) =>
      request<{ items: import("@concertride/types").RideChecklistItem[] }>(
        `/api/rides/${encodeURIComponent(rideId)}/checklist`,
      ),
    createChecklistItem: (
      rideId: string,
      item: { item_type: import("@concertride/types").RideChecklistItemType; value?: string },
    ) =>
      request<import("@concertride/types").RideChecklistItem>(
        `/api/rides/${encodeURIComponent(rideId)}/checklist`,
        {
          method: "POST",
          body: JSON.stringify(item),
        },
      ),
    confirmChecklistItem: (rideId: string, itemId: string) =>
      request<import("@concertride/types").RideChecklistItem>(
        `/api/rides/${encodeURIComponent(rideId)}/checklist/${encodeURIComponent(itemId)}`,
        { method: "PATCH" },
      ),
  },
  venues: {
    list: () => request<VenuesResponse>("/api/venues"),
  },
  messages: {
    listRideThread: (rideId: string) =>
      request<MessagesResponse>(`/api/rides/${encodeURIComponent(rideId)}/messages`),
    postRideThread: (
      rideId: string,
      payload: { body: string; kind?: import("@concertride/types").MessageKind; attachment_url?: string },
    ) =>
      request<Message>(`/api/rides/${encodeURIComponent(rideId)}/messages`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    listConcertChat: (concertId: string) =>
      request<MessagesResponse>(`/api/concerts/${encodeURIComponent(concertId)}/messages`),
    postConcertChat: (
      concertId: string,
      payload: { body: string; kind?: import("@concertride/types").MessageKind; attachment_url?: string },
    ) =>
      request<Message>(`/api/concerts/${encodeURIComponent(concertId)}/messages`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    uploadPhoto: (file: File) => {
      const fd = new FormData();
      fd.append("photo", file);
      return request<{ url: string }>("/api/messages/upload", { method: "POST", body: fd });
    },
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
  users: {
    get: (userId: string) =>
      request<Omit<import("@concertride/types").User, "email">>(`/api/users/${encodeURIComponent(userId)}`),
    listReviews: (userId: string) =>
      request<ReviewsResponse>(`/api/users/${encodeURIComponent(userId)}/reviews`),
  },
  fuel: {
    prices: () => request<{ gasoline95: number; diesel: number; updatedAt: string }>("/api/fuel-price"),
  },
  reports: {
    create: (input: CreateReportRequest) =>
      request<Report>("/api/reports", {
        method: "POST",
        body: JSON.stringify(input),
      }),
  },
  admin: {
    stats: () => request<AdminStats>("/api/admin/stats"),
    me: () => request<{ ok: true; user: User }>("/api/admin/me"),
    listReports: (status?: "pending" | "reviewed" | "resolved" | "dismissed") => {
      const qs = status ? `?status=${status}` : "";
      return request<{
        reports: Array<
          Report & {
            reporter: User | null;
            target_user: User | null;
          }
        >;
      }>(`/api/admin/reports${qs}`);
    },
    updateReport: (id: string, status: "pending" | "reviewed" | "resolved" | "dismissed") =>
      request<Report>(`/api/admin/reports/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    listLicenseReviews: (status?: "pending" | "approved" | "rejected") => {
      const qs = status ? `?status=${status}` : "";
      return request<{ reviews: Array<LicenseReview & { user: User | null }> }>(`/api/admin/license-reviews${qs}`);
    },
    approveLicenseReview: (id: string) =>
      request<{ ok: true; review: LicenseReview }>(`/api/admin/license-reviews/${encodeURIComponent(id)}/approve`, {
        method: "POST",
      }),
    rejectLicenseReview: (id: string, reason: string) =>
      request<{ ok: true; review: LicenseReview }>(`/api/admin/license-reviews/${encodeURIComponent(id)}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      }),
    banUser: (id: string, reason: string) =>
      request<{ ok: true; user: User }>(`/api/admin/users/${encodeURIComponent(id)}/ban`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      }),
    unbanUser: (id: string) =>
      request<{ ok: true; user: User }>(`/api/admin/users/${encodeURIComponent(id)}/unban`, {
        method: "POST",
      }),
    auditLog: (limit = 50) =>
      request<{ entries: AdminAuditLogEntry[] }>(`/api/admin/audit-log?limit=${limit}`),
  },
  favorites: {
    list: () => request<FavoritesResponse>("/api/favorites"),
    add: (kind: FavoriteKind, target_id: string, label: string) =>
      request<Favorite>("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ kind, target_id, label }),
      }),
    remove: (kind: FavoriteKind, target_id: string) =>
      request<{ ok: true }>(`/api/favorites/${kind}/${encodeURIComponent(target_id)}`, {
        method: "DELETE",
      }),
  },
};

export { ApiError };

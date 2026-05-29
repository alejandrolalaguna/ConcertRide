import type {
  ActivityFeedQuery,
  ActivityFeedResponse,
  AddPlaylistTrackRequest,
  AdminAuditLogEntry,
  AdminDashboard,
  AdminStats,
  AdminUserDetail,
  AdminUserListItem,
  AnticipationStatus,
  AnticipationSummary,
  Concert,
  ConcertsQuery,
  ConcertsResponse,
  ConversationsResponse,
  CreateConcertInput,
  CreateFestivalQnaRequest,
  CreateReviewRequest,
  CreateRideRequest,
  CreateReportRequest,
  CreateSquadRequest,
  CreateTripMemoryRequest,
  CrewListResponse,
  CrewMember,
  DemandPrediction,
  DemandSignal,
  DirectMessage,
  DirectMessagesResponse,
  DriverBadge,
  EventAnticipation,
  Favorite,
  FavoriteKind,
  FavoritesResponse,
  FestivalQna,
  HealthResponse,
  JoinSquadRequest,
  LicenseReview,
  Report,
  Message,
  MessagesResponse,
  PlaylistTrack,
  RequestSeatRequest,
  RequestStatus,
  Review,
  ReviewsResponse,
  Ride,
  RideChecklistItem,
  RideRequest,
  RidesQuery,
  RidesResponse,
  FestivalHistoryEntry,
  Squad,
  SquadRole,
  TravelStats,
  TripMemory,
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
    checkVerifyToken: (token: string) =>
      request<{ valid: boolean }>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`),
    verifyEmail: (token: string) =>
      request<{ ok: true }>("/api/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token }),
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
    myLicenseReview: () =>
      request<{ review: import("@concertride/types").LicenseReview | null }>("/api/auth/verify-license/status"),
    verifyLicense: (file: File) => {
      const form = new FormData();
      form.append("document", file);
      return request<{ ok: true; status: "pending"; review_id: string }>("/api/auth/verify-license", {
        method: "POST",
        body: form,
      });
    },
    myIdentityReview: () =>
      request<{ review: import("@concertride/types").IdentityReview | null }>("/api/auth/verify-identity/status"),
    verifyIdentity: (file: File) => {
      const form = new FormData();
      form.append("document", file);
      return request<{ ok: true; status: "pending"; review_id: string }>("/api/auth/verify-identity", {
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
    listDM: (userId: string) =>
      request<DirectMessagesResponse>(`/api/messages/dm/${encodeURIComponent(userId)}`),
    postDM: (
      userId: string,
      payload: { body: string; kind?: import("@concertride/types").MessageKind; attachment_url?: string },
    ) =>
      request<DirectMessage>(`/api/messages/dm/${encodeURIComponent(userId)}`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    listConversations: () =>
      request<ConversationsResponse>("/api/messages/conversations"),
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
    dashboard: () => request<AdminDashboard>("/api/admin/dashboard"),
    usersList: () => request<{ users: AdminUserListItem[] }>("/api/admin/users-list"),
    userDetail: (id: string) => request<AdminUserDetail>(`/api/admin/users/${encodeURIComponent(id)}/detail`),
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
    // Fetch a license document as a Blob using the panel's own authenticated
    // origin (cookie sent via credentials:"include"). Avoids a top-level <a>
    // navigation, which can hit a different host (apex vs www) where the
    // host-only cr_session cookie isn't sent → 401/404.
    fetchLicenseDoc: async (fileKvKey: string): Promise<Blob> => {
      const res = await fetch(`${BASE}/api/auth/license-doc/${encodeURIComponent(fileKvKey)}`, {
        credentials: "include",
        headers: { accept: "*/*" },
      });
      if (!res.ok) {
        let body: unknown;
        try { body = await res.json(); } catch { body = undefined; }
        throw new ApiError("No se pudo cargar el documento", res.status, "/api/auth/license-doc", body);
      }
      return res.blob();
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
  alerts: {
    subscribeFestival: (email: string, festival_slug: string) =>
      request<{ ok: true; created: boolean }>("/api/alerts/festival", {
        method: "POST",
        body: JSON.stringify({ email, festival_slug }),
      }),
    subscribeConcert: (concert_id: string) =>
      request<{ ok: true; created: boolean }>("/api/alerts", {
        method: "POST",
        body: JSON.stringify({ concert_id }),
      }),
  },
  crew: {
    list: () => request<CrewListResponse>("/api/crew"),
    invite: (user_id: string, ride_id?: string) =>
      request<CrewMember>("/api/crew/invite", {
        method: "POST",
        body: JSON.stringify({ user_id, ride_id }),
      }),
    accept: (user_id: string) =>
      request<CrewMember>(`/api/crew/${encodeURIComponent(user_id)}/accept`, { method: "POST" }),
    remove: (user_id: string) =>
      request<{ ok: true }>(`/api/crew/${encodeURIComponent(user_id)}`, { method: "DELETE" }),
    attending: (concert_id: string) =>
      request<{ crew: CrewMember[] }>(`/api/crew/attending/${encodeURIComponent(concert_id)}`),
  },
  activity: {
    list: (q: ActivityFeedQuery = {}) => request<ActivityFeedResponse>(`/api/activity${query(q)}`),
  },
  anticipations: {
    summary: (concert_id: string) =>
      request<AnticipationSummary>(`/api/anticipations/concert/${encodeURIComponent(concert_id)}`),
    set: (concert_id: string, status: AnticipationStatus) =>
      request<EventAnticipation>(`/api/anticipations/concert/${encodeURIComponent(concert_id)}`, {
        method: "POST",
        body: JSON.stringify({ status }),
      }),
    clear: (concert_id: string) =>
      request<{ ok: true }>(`/api/anticipations/concert/${encodeURIComponent(concert_id)}`, {
        method: "DELETE",
      }),
    mine: () =>
      request<{ items: Array<{ concert: Concert; status: AnticipationStatus }> }>(
        "/api/anticipations/mine",
      ),
  },
  memories: {
    create: (input: CreateTripMemoryRequest) =>
      request<TripMemory>("/api/memories", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    get: (id: string) => request<TripMemory>(`/api/memories/${encodeURIComponent(id)}`),
    share: (id: string) =>
      request<{ ok: true }>(`/api/memories/${encodeURIComponent(id)}/share`, { method: "POST" }),
    forConcert: (concert_id: string) =>
      request<{ memories: TripMemory[] }>(`/api/memories/concert/${encodeURIComponent(concert_id)}`),
    mine: () => request<{ memories: TripMemory[] }>("/api/memories/user/mine"),
  },
  festivalQnas: {
    list: (slug: string) =>
      request<{ items: FestivalQna[] }>(`/api/festival-qnas/${encodeURIComponent(slug)}`),
    create: (input: CreateFestivalQnaRequest) =>
      request<FestivalQna>("/api/festival-qnas", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    upvote: (id: string) =>
      request<FestivalQna>(`/api/festival-qnas/${encodeURIComponent(id)}/upvote`, { method: "POST" }),
    approve: (id: string) =>
      request<FestivalQna>(`/api/festival-qnas/${encodeURIComponent(id)}/approve`, { method: "POST" }),
  },
  squads: {
    mine: () => request<{ items: Squad[] }>("/api/squads/mine"),
    forConcert: (concert_id: string) =>
      request<{ items: Squad[] }>(`/api/squads/concert/${encodeURIComponent(concert_id)}`),
    byInvite: (code: string) => request<Squad>(`/api/squads/invite/${encodeURIComponent(code)}`),
    get: (id: string) => request<Squad>(`/api/squads/${encodeURIComponent(id)}`),
    create: (input: CreateSquadRequest) =>
      request<Squad>("/api/squads", { method: "POST", body: JSON.stringify(input) }),
    join: (input: JoinSquadRequest) =>
      request<Squad>("/api/squads/join", { method: "POST", body: JSON.stringify(input) }),
    leave: (id: string) =>
      request<{ ok: true }>(`/api/squads/${encodeURIComponent(id)}/me`, { method: "DELETE" }),
    updateRole: (id: string, role: SquadRole, ride_id?: string | null) =>
      request<Squad>(`/api/squads/${encodeURIComponent(id)}/me`, {
        method: "PATCH",
        body: JSON.stringify({ role, ride_id }),
      }),
  },
  playlists: {
    forRide: (ride_id: string) =>
      request<{ tracks: PlaylistTrack[] }>(`/api/playlists/ride/${encodeURIComponent(ride_id)}`),
    forSquad: (squad_id: string) =>
      request<{ tracks: PlaylistTrack[] }>(`/api/playlists/squad/${encodeURIComponent(squad_id)}`),
    add: (input: AddPlaylistTrackRequest) =>
      request<PlaylistTrack>("/api/playlists", { method: "POST", body: JSON.stringify(input) }),
    remove: (id: string) =>
      request<{ ok: true }>(`/api/playlists/${encodeURIComponent(id)}`, { method: "DELETE" }),
  },
  badges: {
    forUser: (user_id: string) =>
      request<{ badges: DriverBadge[] }>(`/api/users/${encodeURIComponent(user_id.replace(/^u_/, ""))}/badges`),
  },
  stats: {
    me: (year?: number) => request<TravelStats>(`/api/stats/me${year ? `?year=${year}` : ""}`),
    festivalHistory: () =>
      request<{ items: FestivalHistoryEntry[] }>("/api/stats/me/festival-history"),
    demand: (limit = 8) =>
      request<{ items: DemandPrediction[] }>(`/api/stats/demand?limit=${limit}`),
  },
};

export { ApiError };

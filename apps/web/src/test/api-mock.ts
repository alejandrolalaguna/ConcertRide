// Helper to construct a `vi.mock("../lib/api")` factory with sensible defaults.
// Tests can override individual methods after import:
//   import { api } from "../lib/api"; (api.rides.list as Mock).mockResolvedValueOnce(...)
//
// Usage in a test file (BEFORE any other imports of the page):
//   vi.mock("../lib/api", () => ({ api: makeApiMock({ user: someUser }) }));

import { vi } from "vitest";
import type { User } from "@concertride/types";
import { makeMockUser } from "./render";

export interface MockApiOptions {
  user?: User | null;
}

// Returns the shape that production `lib/api.ts` exports. Every method is a
// vi.fn that resolves to a sane empty/default value. Tests override specific
// methods using mockResolvedValueOnce / mockRejectedValueOnce.
export function makeApiMock(opts: MockApiOptions = {}): unknown {
  const user = opts.user === undefined ? makeMockUser() : opts.user;

  return {
    auth: {
      register: vi.fn(async () => ({ ok: true, user: user ?? makeMockUser() })),
      login: vi.fn(async () => ({ ok: true, user: user ?? makeMockUser() })),
      logout: vi.fn(async () => ({ ok: true })),
      me: vi.fn(async () => ({ user })),
      updateProfile: vi.fn(async () => ({ ok: true, user: user ?? makeMockUser() })),
      forgotPassword: vi.fn(async () => ({ ok: true })),
      resetPassword: vi.fn(async () => ({ ok: true })),
      verifyEmail: vi.fn(async () => ({ ok: true })),
      verifyLicense: vi.fn(async () => ({ ok: true, status: "pending" })),
      verifyIdentity: vi.fn(async () => ({ ok: true, status: "pending" })),
      myLicenseReview: vi.fn(async () => ({ status: "none" })),
      myIdentityReview: vi.fn(async () => ({ status: "none" })),
      sendPhoneOtp: vi.fn(async () => ({ ok: true })),
      verifyPhoneOtp: vi.fn(async () => ({ ok: true })),
      deleteAccount: vi.fn(async () => ({ ok: true })),
    },
    concerts: {
      list: vi.fn(async () => ({ concerts: [], total: 0 })),
      get: vi.fn(async () => null),
      create: vi.fn(async () => ({ concert: null })),
      toggleInterest: vi.fn(async () => ({ ok: true })),
    },
    rides: {
      list: vi.fn(async () => ({ rides: [], total: 0 })),
      get: vi.fn(async () => null),
      create: vi.fn(async () => ({ ride: { id: "r_test" } })),
      requestSeat: vi.fn(async () => ({ request: { id: "rq_test", status: "pending" } })),
      bookInstant: vi.fn(async () => ({ request: { id: "rq_test", status: "confirmed" } })),
      updateRequest: vi.fn(async () => ({ ok: true })),
      listRequests: vi.fn(async () => ({ requests: [] })),
      confirmedPassengers: vi.fn(async () => ({ passengers: [] })),
      listMine: vi.fn(async () => ({ driver_rides: [], passenger_requests: [] })),
      getMyRequest: vi.fn(async () => null),
      update: vi.fn(async () => ({ ok: true })),
      cancel: vi.fn(async () => ({ ok: true })),
      confirmComplete: vi.fn(async () => ({ ok: true })),
      listChecklist: vi.fn(async () => ({ items: [] })),
      createChecklistItem: vi.fn(async () => ({ item: { id: "ci" } })),
      confirmChecklistItem: vi.fn(async () => ({ ok: true })),
    },
    messages: {
      listRideThread: vi.fn(async () => ({ messages: [] })),
      postRideThread: vi.fn(async () => ({ message: { id: "m" } })),
      listConcertChat: vi.fn(async () => ({ messages: [] })),
      postConcertChat: vi.fn(async () => ({ message: { id: "m" } })),
      uploadPhoto: vi.fn(async () => ({ url: "/api/messages/media/x" })),
      listDM: vi.fn(async () => ({ messages: [] })),
      postDM: vi.fn(async () => ({ message: { id: "m" } })),
      listConversations: vi.fn(async () => ({ conversations: [] })),
    },
    favorites: {
      list: vi.fn(async () => ({ favorites: [], upcoming_concerts: [] })),
      add: vi.fn(async () => ({ id: "f", kind: "concert", target_id: "x", label: "x", created_at: new Date().toISOString() })),
      remove: vi.fn(async () => ({ ok: true })),
    },
    crew: {
      list: vi.fn(async () => ({ crew: [], pending_outbound: [], pending_inbound: [] })),
      invite: vi.fn(async () => ({ ok: true })),
      accept: vi.fn(async () => ({ ok: true })),
      remove: vi.fn(async () => ({ ok: true })),
      attending: vi.fn(async () => ({ users: [] })),
    },
    activity: { list: vi.fn(async () => ({ events: [] })) },
    alerts: {
      list: vi.fn(async () => ({ alerts: [] })),
      create: vi.fn(async () => ({ alert: { id: "a" } })),
      remove: vi.fn(async () => ({ ok: true })),
    },
    squads: {
      list: vi.fn(async () => ({ squads: [] })),
      create: vi.fn(async () => ({ squad: { id: "s", join_code: "ABC123" } })),
      join: vi.fn(async () => ({ ok: true })),
      remove: vi.fn(async () => ({ ok: true })),
    },
    memories: {
      list: vi.fn(async () => ({ memories: [] })),
      create: vi.fn(async () => ({ memory: { id: "tm" } })),
      update: vi.fn(async () => ({ ok: true })),
      remove: vi.fn(async () => ({ ok: true })),
    },
    playlists: {
      list: vi.fn(async () => ({ playlists: [] })),
      create: vi.fn(async () => ({ playlist: { id: "p" } })),
      addTrack: vi.fn(async () => ({ ok: true })),
      remove: vi.fn(async () => ({ ok: true })),
    },
    venues: {
      list: vi.fn(async () => ({ venues: [], total: 0 })),
    },
    users: {
      get: vi.fn(async () => null),
      badges: vi.fn(async () => ({ badges: [] })),
      reviews: vi.fn(async () => ({ reviews: [] })),
      listReviews: vi.fn(async () => ({ reviews: [] })),
    },
    reviews: {
      list: vi.fn(async () => ({ reviews: [] })),
      create: vi.fn(async () => ({ id: "rv" })),
    },
    reports: {
      create: vi.fn(async () => ({ ok: true })),
    },
    stats: {
      get: vi.fn(async () => ({ users: 0, rides: 0, concerts: 0 })),
    },
    anticipations: {
      list: vi.fn(async () => ({ anticipations: [] })),
      create: vi.fn(async () => ({ ok: true })),
    },
    festivalQnas: {
      list: vi.fn(async () => ({ qnas: [] })),
      create: vi.fn(async () => ({ ok: true })),
    },
    fuel: {
      get: vi.fn(async () => ({ price_eur_per_litre: 1.5 })),
      prices: vi.fn(async () => ({ gasoline95: 1.5, diesel: 1.4, updatedAt: new Date().toISOString() })),
    },
  };
}

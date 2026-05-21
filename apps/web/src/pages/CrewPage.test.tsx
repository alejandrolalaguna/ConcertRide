import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { apiMock, MockApiError } = vi.hoisted(() => {
  class MockApiErrorInternal extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  }
  const apiMockInternal = {
    auth: {
      register: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      me: vi.fn(),
      updateProfile: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      verifyEmail: vi.fn(),
      verifyLicense: vi.fn(),
      verifyIdentity: vi.fn(),
      myLicenseReview: vi.fn(),
      myIdentityReview: vi.fn(),
      sendPhoneOtp: vi.fn(),
      verifyPhoneOtp: vi.fn(),
      deleteAccount: vi.fn(),
    },
    concerts: { list: vi.fn(), get: vi.fn(), create: vi.fn(), toggleInterest: vi.fn() },
    rides: {
      list: vi.fn(),
      get: vi.fn(),
      create: vi.fn(),
      requestSeat: vi.fn(),
      bookInstant: vi.fn(),
      updateRequest: vi.fn(),
      listRequests: vi.fn(),
      confirmedPassengers: vi.fn(),
      listMine: vi.fn(),
      getMyRequest: vi.fn(),
      update: vi.fn(),
      cancel: vi.fn(),
      confirmComplete: vi.fn(),
      revokeComplete: vi.fn(),
      listChecklist: vi.fn(),
      createChecklistItem: vi.fn(),
      confirmChecklistItem: vi.fn(),
    },
    favorites: { list: vi.fn(), add: vi.fn(), remove: vi.fn() },
    crew: { list: vi.fn(), invite: vi.fn(), accept: vi.fn(), remove: vi.fn(), attending: vi.fn() },
    activity: { list: vi.fn() },
    alerts: { list: vi.fn(), create: vi.fn(), remove: vi.fn() },
    messages: {
      listRideThread: vi.fn(),
      postRideThread: vi.fn(),
      listConcertChat: vi.fn(),
      postConcertChat: vi.fn(),
      uploadPhoto: vi.fn(),
      listDM: vi.fn(),
      postDM: vi.fn(),
      listConversations: vi.fn(),
    },
    venues: { list: vi.fn() },
    users: { get: vi.fn(), badges: vi.fn(), reviews: vi.fn() },
    reports: { create: vi.fn() },
    stats: { get: vi.fn() },
    anticipations: { list: vi.fn(), create: vi.fn() },
    festivalQnas: { list: vi.fn(), create: vi.fn() },
    fuel: { get: vi.fn(), prices: vi.fn() },
    squads: { list: vi.fn(), create: vi.fn(), join: vi.fn(), remove: vi.fn() },
    memories: { list: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() },
    playlists: { list: vi.fn(), create: vi.fn(), addTrack: vi.fn(), remove: vi.fn() },
  };
  return { apiMock: apiMockInternal, MockApiError: MockApiErrorInternal };
});

vi.mock("../lib/api", () => ({ api: apiMock, ApiError: MockApiError }));
vi.mock("@/lib/api", () => ({ api: apiMock, ApiError: MockApiError }));

import { makeMockUser, renderWithProviders } from "../test/render";
import { CrewProvider } from "../lib/crew";
import CrewPage from "./CrewPage";

// CrewPage uses useCrew() which needs CrewProvider higher up. The default
// renderWithProviders only mounts Session + Favorites — wrap the page so it
// can talk to its own context.
function Wrap() {
  return (
    <CrewProvider>
      <CrewPage />
    </CrewProvider>
  );
}

function makeCrewMember(overrides: Record<string, unknown> = {}) {
  return {
    user: makeMockUser({ id: "u_other", name: "Maria Crew" }),
    status: "accepted" as const,
    requested_by: "u_other",
    initiated_by_me: false,
    origin_ride_id: null,
    origin_concert_id: null,
    origin_concert_label: null,
    shared_genres: ["pop", "rock"],
    shared_artists: [],
    rides_together: 0,
    connected_at: new Date().toISOString(),
    ...overrides,
  };
}

beforeEach(() => {
  (apiMock.auth.me as Mock).mockResolvedValue({
    user: makeMockUser({ id: "u_me", name: "Yo Mismo" }),
  });
  (apiMock.favorites.list as Mock).mockResolvedValue({ favorites: [], upcoming_concerts: [] });
  (apiMock.crew.list as Mock).mockResolvedValue({
    crew: [],
    pending_incoming: [],
    pending_outgoing: [],
    total: 0,
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("CrewPage", () => {
  it("renders the empty state when the user has no crew", async () => {
    await renderWithProviders(<Wrap />, { route: "/crew", waitForUser: true });
    await waitFor(() => {
      expect(screen.getByText(/Aún no tienes crew/i)).toBeInTheDocument();
    });
  });

  it("lists current accepted crew members", async () => {
    (apiMock.crew.list as Mock).mockResolvedValue({
      crew: [
        makeCrewMember({
          user: makeMockUser({ id: "u_friend1", name: "Ana Friend" }),
        }),
        makeCrewMember({
          user: makeMockUser({ id: "u_friend2", name: "Pablo Crew" }),
        }),
      ],
      pending_incoming: [],
      pending_outgoing: [],
      total: 2,
    });

    await renderWithProviders(<Wrap />, { route: "/crew", waitForUser: true });
    await waitFor(() => {
      expect(screen.getByText(/Ana Friend/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Pablo Crew/i)).toBeInTheDocument();
  });

  it("shows pending_incoming invites with an accept button", async () => {
    (apiMock.crew.list as Mock).mockResolvedValue({
      crew: [],
      pending_incoming: [
        makeCrewMember({
          user: makeMockUser({ id: "u_pending1", name: "Lola Invita" }),
          status: "pending",
        }),
      ],
      pending_outgoing: [],
      total: 0,
    });

    await renderWithProviders(<Wrap />, { route: "/crew", waitForUser: true });
    await waitFor(() => {
      expect(screen.getByText(/Lola Invita/i)).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /Aceptar/i })).toBeInTheDocument();
  });

  it("clicking Aceptar calls api.crew.accept with the user_id", async () => {
    (apiMock.crew.list as Mock).mockResolvedValue({
      crew: [],
      pending_incoming: [
        makeCrewMember({
          user: makeMockUser({ id: "u_pending1", name: "Lola Invita" }),
          status: "pending",
        }),
      ],
      pending_outgoing: [],
      total: 0,
    });
    (apiMock.crew.accept as Mock).mockResolvedValue(
      makeCrewMember({
        user: makeMockUser({ id: "u_pending1", name: "Lola Invita" }),
      }),
    );

    const user = userEvent.setup();
    await renderWithProviders(<Wrap />, { route: "/crew", waitForUser: true });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Aceptar/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /Aceptar/i }));

    await waitFor(() => {
      expect(apiMock.crew.accept).toHaveBeenCalled();
    });
    expect((apiMock.crew.accept as Mock).mock.calls[0]![0]).toBe("u_pending1");
  });

  it("lists pending_outgoing invites with a cancelar button", async () => {
    (apiMock.crew.list as Mock).mockResolvedValue({
      crew: [],
      pending_incoming: [],
      pending_outgoing: [
        makeCrewMember({
          user: makeMockUser({ id: "u_outbound", name: "Diego Sent" }),
          status: "pending",
          initiated_by_me: true,
        }),
      ],
      total: 0,
    });

    await renderWithProviders(<Wrap />, { route: "/crew", waitForUser: true });
    await waitFor(() => {
      expect(screen.getByText(/Diego Sent/i)).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
  });
});

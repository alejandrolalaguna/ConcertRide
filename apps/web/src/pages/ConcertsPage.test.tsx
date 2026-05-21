import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { screen, waitFor } from "@testing-library/react";

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
      me: vi.fn(),
      logout: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
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
    concerts: { list: vi.fn(), get: vi.fn(), create: vi.fn(), toggleInterest: vi.fn(), facets: vi.fn() },
    rides: { list: vi.fn(), get: vi.fn() },
    favorites: { list: vi.fn(), add: vi.fn(), remove: vi.fn() },
    crew: { list: vi.fn(), invite: vi.fn(), accept: vi.fn(), remove: vi.fn(), attending: vi.fn() },
    activity: { list: vi.fn() },
    alerts: { list: vi.fn(), create: vi.fn(), remove: vi.fn() },
    messages: { listConversations: vi.fn() },
    venues: { list: vi.fn() },
    users: { get: vi.fn(), badges: vi.fn(), reviews: vi.fn() },
    reports: { create: vi.fn() },
    stats: { get: vi.fn() },
    anticipations: { list: vi.fn(), create: vi.fn() },
    festivalQnas: { list: vi.fn(), create: vi.fn() },
    fuel: { get: vi.fn(), prices: vi.fn() },
    squads: { list: vi.fn() },
    memories: { list: vi.fn() },
    playlists: { list: vi.fn() },
  };
  return { apiMock: apiMockInternal, MockApiError: MockApiErrorInternal };
});

vi.mock("../lib/api", () => ({ api: apiMock, ApiError: MockApiError }));
vi.mock("@/lib/api", () => ({ api: apiMock, ApiError: MockApiError }));

import { renderWithProviders } from "../test/render";
import ConcertsPage from "./ConcertsPage";

const FIXTURE_CONCERTS = [
  {
    id: "c_rosalia",
    artist: "Rosalía",
    name: "Rosalía · LUX Tour",
    date: new Date(Date.now() + 14 * 24 * 3600_000).toISOString(),
    venue: { id: "v_wizink", name: "WiZink Center", city: "Madrid", lat: 40.4234, lng: -3.6716 },
    image_url: null,
    genre: "pop",
    ticketmaster_id: null,
    ticketmaster_url: null,
    status: "active",
    fingerprint: "x1",
    sources_json: "[]",
  },
  {
    id: "c_badbunny",
    artist: "Bad Bunny",
    name: "Bad Bunny · Most Wanted",
    date: new Date(Date.now() + 30 * 24 * 3600_000).toISOString(),
    venue: { id: "v_cartuja", name: "Estadio La Cartuja", city: "Sevilla", lat: 37.4147, lng: -5.9485 },
    image_url: null,
    genre: "reggaeton",
    ticketmaster_id: null,
    ticketmaster_url: null,
    status: "active",
    fingerprint: "x2",
    sources_json: "[]",
  },
];

beforeEach(() => {
  (apiMock.auth.me as Mock).mockResolvedValue({ user: null });
  (apiMock.favorites.list as Mock).mockResolvedValue({ favorites: [], upcoming_concerts: [] });
  (apiMock.concerts.list as Mock).mockResolvedValue({ concerts: FIXTURE_CONCERTS, total: 2 });
  (apiMock.concerts.facets as Mock).mockResolvedValue({ genres: ["pop", "reggaeton"], cities: ["Madrid", "Sevilla"] });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("ConcertsPage — fetch + listing", () => {
  it("calls api.concerts.list on mount and renders the returned concerts", async () => {
    await renderWithProviders(<ConcertsPage />, { route: "/concerts" });

    await waitFor(() => {
      expect(apiMock.concerts.list).toHaveBeenCalled();
    });

    expect(await screen.findByText(/Rosalía/i)).toBeInTheDocument();
    expect(await screen.findByText(/Bad Bunny/i)).toBeInTheDocument();
  });

  it("renders empty state when API returns no concerts", async () => {
    (apiMock.concerts.list as Mock).mockResolvedValueOnce({ concerts: [], total: 0 });

    await renderWithProviders(<ConcertsPage />, { route: "/concerts" });

    await waitFor(() => {
      expect(apiMock.concerts.list).toHaveBeenCalled();
    });

    // Empty state should NOT crash and should NOT show concert rows.
    expect(screen.queryByText(/Rosalía/i)).not.toBeInTheDocument();
  });

  it("forwards a city filter from search params into the API call", async () => {
    await renderWithProviders(<ConcertsPage />, { route: "/concerts?city=Madrid" });

    await waitFor(() => {
      expect(apiMock.concerts.list).toHaveBeenCalled();
    });

    const calls = (apiMock.concerts.list as Mock).mock.calls;
    const firstArg = calls[0]?.[0] ?? {};
    // Implementation may pass city as a top-level param or nested filter. Allow either.
    const hasCity = JSON.stringify(firstArg).toLowerCase().includes("madrid");
    expect(hasCity).toBe(true);
  });
});

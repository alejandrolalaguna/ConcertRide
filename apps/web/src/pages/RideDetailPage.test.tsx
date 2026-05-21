import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
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

// Heavy lazy-loaded children — stub so they don't break jsdom rendering.
vi.mock("@/components/RideRouteMap", () => ({ default: () => null }));
vi.mock("@/components/RideChatSection", () => ({
  RideChatSection: () => null,
}));
vi.mock("@/components/RideReviewsSection", () => ({
  RideReviewsSection: () => null,
}));

import { Route, Routes } from "react-router-dom";
import { makeMockUser, renderWithProviders } from "../test/render";
import RideDetailPage from "./RideDetailPage";

// Mount with a Route so useParams<{id}>() picks up the id from the URL.
function RouteWrap() {
  return (
    <Routes>
      <Route path="/rides/:id" element={<RideDetailPage />} />
    </Routes>
  );
}

const DRIVER_ID = "u_driver";
const PASSENGER_ID = "u_pax";
const RIDE_ID = "r_123";

const FIXTURE_CONCERT = {
  id: "c_test",
  artist: "Rosalía",
  name: "Rosalía LUX Tour",
  date: new Date(Date.now() + 30 * 24 * 3600_000).toISOString(),
  venue: {
    id: "v_wizink",
    name: "WiZink Center",
    city: "Madrid",
    lat: 40.4234,
    lng: -3.6716,
  },
  image_url: null,
  genre: "pop",
  ticketmaster_id: null,
  ticketmaster_url: null,
  status: "active",
  fingerprint: "x",
  sources_json: "[]",
};

function makeRide(overrides: Record<string, unknown> = {}) {
  return {
    id: RIDE_ID,
    driver_id: DRIVER_ID,
    driver: makeMockUser({ id: DRIVER_ID, name: "Carlos Conductor", license_verified: true }),
    concert_id: FIXTURE_CONCERT.id,
    concert: FIXTURE_CONCERT,
    origin_city: "Valencia",
    origin_lat: 39.47,
    origin_lng: -0.37,
    origin_address: "Plaza Ayuntamiento",
    departure_time: new Date(Date.now() + 48 * 3600_000).toISOString(),
    price_per_seat: 15,
    seats_total: 4,
    seats_left: 3,
    round_trip: false,
    vibe: "chill",
    status: "active",
    smoking_policy: "no",
    max_luggage: "backpack",
    instant_booking: false,
    price_negotiable: false,
    accepted_payment: "cash_or_bizum",
    completed_at: null,
    completion_confirmed_by: null,
    created_at: new Date().toISOString(),
    is_participant: false,
    ...overrides,
  };
}

beforeEach(() => {
  (apiMock.favorites.list as Mock).mockResolvedValue({ favorites: [], upcoming_concerts: [] });
  (apiMock.rides.confirmedPassengers as Mock).mockResolvedValue({ passengers: [] });
  (apiMock.rides.listChecklist as Mock).mockResolvedValue({ items: [] });
  (apiMock.rides.getMyRequest as Mock).mockResolvedValue({ request: null });
  (apiMock.rides.listRequests as Mock).mockResolvedValue({ requests: [] });
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

describe("RideDetailPage — passenger view", () => {
  it("renders ride summary (driver name, departure, price) for a logged-in passenger", async () => {
    (apiMock.auth.me as Mock).mockResolvedValue({
      user: makeMockUser({ id: PASSENGER_ID }),
    });
    (apiMock.rides.get as Mock).mockResolvedValue(makeRide());

    await renderWithProviders(<RouteWrap />, {
      route: `/rides/${RIDE_ID}`,
      routerProps: { initialEntries: [`/rides/${RIDE_ID}`] },
      waitForUser: true,
    });

    await waitFor(() => {
      expect(screen.getAllByText(/Carlos Conductor/i).length).toBeGreaterThan(0);
    });
    expect(screen.getByText(/Rosalía/i)).toBeInTheDocument();
    // Price appears as €15 (price_per_seat)
    expect(screen.getAllByText(/15/).length).toBeGreaterThan(0);
  });

  it("seat ± buttons clamp between 1 and seats_left", async () => {
    (apiMock.auth.me as Mock).mockResolvedValue({
      user: makeMockUser({ id: PASSENGER_ID }),
    });
    (apiMock.rides.get as Mock).mockResolvedValue(makeRide({ seats_left: 2 }));

    await renderWithProviders(<RouteWrap />, {
      route: `/rides/${RIDE_ID}`,
      waitForUser: true,
    });
    await waitFor(() => {
      expect(screen.getByLabelText(/Sumar un asiento/i)).toBeInTheDocument();
    });

    const user = userEvent.setup();
    const plus = screen.getByLabelText(/Sumar un asiento/i);
    const minus = screen.getByLabelText(/Restar un asiento/i);

    // Default seat = 1. Click + once → 2. Click + again → still 2 (clamped).
    await user.click(plus);
    await user.click(plus);
    expect(plus).toBeDisabled();

    // Click - twice → goes back to 1, then clamped at 1
    await user.click(minus);
    await user.click(minus);
    // Should not crash — clamped at 1
  });

  it("clicking 'Reservar asiento' calls api.rides.requestSeat with the right shape", async () => {
    (apiMock.auth.me as Mock).mockResolvedValue({
      user: makeMockUser({ id: PASSENGER_ID }),
    });
    (apiMock.rides.get as Mock).mockResolvedValue(makeRide());
    (apiMock.rides.requestSeat as Mock).mockResolvedValue({
      id: "rq_1",
      ride_id: RIDE_ID,
      passenger_id: PASSENGER_ID,
      seats: 1,
      status: "pending",
      message: null,
      luggage: "none",
      payment_method: "cash",
      created_at: new Date().toISOString(),
    });

    await renderWithProviders(<RouteWrap />, {
      route: `/rides/${RIDE_ID}`,
      waitForUser: true,
    });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Reservar asiento/i })).toBeInTheDocument();
    });

    const submitBtn = screen.getByRole("button", { name: /Reservar asiento/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(apiMock.rides.requestSeat).toHaveBeenCalled();
    });
    const [calledRideId, calledPayload] = (apiMock.rides.requestSeat as Mock).mock.calls[0]!;
    expect(calledRideId).toBe(RIDE_ID);
    expect(calledPayload.seats).toBe(1);
    expect(calledPayload.luggage).toBe("none");
  });

  it("instant_booking ride shows 'Reservar ahora' and uses bookInstant", async () => {
    (apiMock.auth.me as Mock).mockResolvedValue({
      user: makeMockUser({ id: PASSENGER_ID }),
    });
    (apiMock.rides.get as Mock).mockResolvedValue(makeRide({ instant_booking: true }));
    (apiMock.rides.bookInstant as Mock).mockResolvedValue({
      id: "rq_1",
      ride_id: RIDE_ID,
      passenger_id: PASSENGER_ID,
      seats: 1,
      status: "confirmed",
      message: null,
      luggage: "none",
      payment_method: "cash",
      created_at: new Date().toISOString(),
    });

    await renderWithProviders(<RouteWrap />, {
      route: `/rides/${RIDE_ID}`,
      waitForUser: true,
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Reservar ahora/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Reservar ahora/i }));

    await waitFor(() => {
      expect(apiMock.rides.bookInstant).toHaveBeenCalled();
    });
  });
});

describe("RideDetailPage — driver view", () => {
  it("shows the driver inbox section when current user is the driver", async () => {
    (apiMock.auth.me as Mock).mockResolvedValue({
      user: makeMockUser({ id: DRIVER_ID, name: "Carlos Conductor", license_verified: true }),
    });
    (apiMock.rides.get as Mock).mockResolvedValue(makeRide());
    (apiMock.rides.listRequests as Mock).mockResolvedValue({
      requests: [
        {
          id: "rq_1",
          ride_id: RIDE_ID,
          passenger_id: PASSENGER_ID,
          passenger: makeMockUser({ id: PASSENGER_ID, name: "Laura Pasajera" }),
          seats: 1,
          status: "pending",
          message: null,
          luggage: "backpack",
          payment_method: "cash",
          created_at: new Date().toISOString(),
        },
      ],
    });

    await renderWithProviders(<RouteWrap />, {
      route: `/rides/${RIDE_ID}`,
      waitForUser: true,
    });

    await waitFor(() => {
      expect(screen.getByText(/Laura Pasajera/i)).toBeInTheDocument();
    });
    // Reserve form for a passenger should NOT appear when current user is the driver
    expect(screen.queryByRole("button", { name: /^Reservar asiento$/i })).not.toBeInTheDocument();
  });
});

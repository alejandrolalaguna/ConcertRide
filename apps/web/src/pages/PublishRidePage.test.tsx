import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Hoisted: defined before vi.mock factories run so we can pull `api` out of
// the mocks in tests. The factory closes over apiMock by reference.
const { apiMock, MockApiError } = vi.hoisted(() => {
  class MockApiErrorInternal extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  }
  // require here so we don't pull jsdom-only deps at hoist time
  // (makeApiMock is pure: just vi.fn() wrappers)
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
    concerts: {
      list: vi.fn(),
      get: vi.fn(),
      create: vi.fn(),
      toggleInterest: vi.fn(),
    },
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
vi.mock("canvas-confetti", () => ({ default: () => {} }));

import { makeMockUser, renderWithProviders } from "../test/render";
import PublishRidePage from "./PublishRidePage";

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

beforeEach(() => {
  const mockUser = makeMockUser({ home_city: "Valencia", license_verified: true });
  (apiMock.auth.me as Mock).mockResolvedValue({ user: mockUser });
  (apiMock.favorites.list as Mock).mockResolvedValue({ favorites: [], upcoming_concerts: [] });
  (apiMock.fuel.prices as Mock).mockResolvedValue({
    gasoline95: 1.72,
    diesel: 1.62,
    updatedAt: new Date().toISOString(),
  });
  (apiMock.concerts.list as Mock).mockResolvedValue({
    concerts: [FIXTURE_CONCERT],
    total: 1,
  });
  (apiMock.rides.create as Mock).mockResolvedValue({
    id: "r_new",
    driver_id: "u_test",
    concert_id: "c_test",
    concert: FIXTURE_CONCERT,
    origin_city: "Valencia",
    origin_lat: 39.47,
    origin_lng: -0.37,
    origin_address: "Plaza",
    departure_time: new Date(Date.now() + 48 * 3600_000).toISOString(),
    price_per_seat: 15,
    seats_total: 3,
    seats_left: 3,
    round_trip: false,
    vibe: "chill",
    status: "active",
    smoking_policy: "no",
    max_luggage: "backpack",
    instant_booking: false,
    price_negotiable: false,
    accepted_payment: "cash_or_bizum",
    created_at: new Date().toISOString(),
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("PublishRidePage — step 1 (concert select)", () => {
  it("renders the concert search and manual mode toggle", async () => {
    await renderWithProviders(<PublishRidePage />, { route: "/publish", waitForUser: true });
    await waitFor(() => {
      expect(screen.getByText(/01 · Elige el concierto/i)).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /Buscar en la web/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Mi concierto no está aquí/i })).toBeInTheDocument();
  });

  it("disables continue button until a concert is selected", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<PublishRidePage />, { route: "/publish", waitForUser: true });
    await waitFor(() => {
      expect(screen.getByText(/Rosalía/i)).toBeInTheDocument();
    });
    // Continue should be disabled before selecting
    const next = screen.getByRole("button", { name: /Continuar/i });
    expect(next).toBeDisabled();

    // Click the concert to select it
    await user.click(screen.getByRole("button", { name: /Rosalía.*WiZink/i }));

    // Now the continue button enables
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Continuar/i })).not.toBeDisabled();
    });
  });
});

// jsdom's interaction with `datetime-local` inputs is finicky with
// userEvent.type — using fireEvent.change reliably triggers React's onChange.
async function fillStep2(future = new Date(Date.now() + 48 * 3600_000)) {
  const address = document.querySelector(
    'input[placeholder*="Estación Joaquín Sorolla"]',
  ) as HTMLInputElement | null;
  if (!address) throw new Error("origin_address input not found");
  fireEvent.change(address, { target: { value: "Plaza Ayuntamiento" } });

  const dt = document.querySelector('input[type="datetime-local"]') as HTMLInputElement | null;
  if (!dt) throw new Error("datetime-local input not found");
  const tz = new Date(future.getTime() - future.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  fireEvent.change(dt, { target: { value: tz } });
}

describe("PublishRidePage — full flow", () => {
  it("walks through all 3 steps and calls api.rides.create with the right shape", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<PublishRidePage />, { route: "/publish", waitForUser: true });
    await waitFor(() => {
      expect(screen.getByText(/Rosalía/i)).toBeInTheDocument();
    });

    // Step 1: pick the concert
    await user.click(screen.getByRole("button", { name: /Rosalía.*WiZink/i }));
    await user.click(screen.getByRole("button", { name: /Continuar/i }));

    // Step 2
    await waitFor(() => {
      expect(screen.getByText(/02 · Detalles del viaje/i)).toBeInTheDocument();
    });
    await fillStep2();
    await user.click(screen.getByRole("button", { name: /Continuar/i }));

    // Step 3: vibe + submit
    await waitFor(() => {
      expect(screen.getByText(/03 · Vibe check/i)).toBeInTheDocument();
    });
    // VibeSelector hides its radios with CSS — locate via name+value.
    const chillRadio = document.querySelector(
      'input[name="vibe"][value="chill"]',
    ) as HTMLInputElement | null;
    expect(chillRadio).toBeTruthy();
    fireEvent.click(chillRadio!);

    const submitBtn = screen.getByRole("button", { name: /Publicar viaje/i });
    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(apiMock.rides.create).toHaveBeenCalled();
    });
    const callArg = (apiMock.rides.create as Mock).mock.calls[0]![0] as Record<string, unknown>;
    expect(callArg.concert_id).toBe("c_test");
    expect(callArg.origin_city).toBe("Valencia");
    expect(callArg.vibe).toBe("chill");
    expect(callArg.seats_total).toBe(3);
    expect(callArg.price_per_seat).toBe(15);
    expect(typeof callArg.departure_time).toBe("string");
    expect(callArg.round_trip).toBe(false);
  });
});

describe("PublishRidePage — success screen", () => {
  it("shows WhatsApp + copy link buttons after creation", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<PublishRidePage />, { route: "/publish", waitForUser: true });
    await waitFor(() => {
      expect(screen.getByText(/Rosalía/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /Rosalía.*WiZink/i }));
    await user.click(screen.getByRole("button", { name: /Continuar/i }));

    await waitFor(() => screen.getByText(/02 · Detalles del viaje/i));
    await fillStep2();
    await user.click(screen.getByRole("button", { name: /Continuar/i }));

    await waitFor(() => screen.getByText(/03 · Vibe check/i));
    const chillRadio2 = document.querySelector(
      'input[name="vibe"][value="chill"]',
    ) as HTMLInputElement | null;
    expect(chillRadio2).toBeTruthy();
    fireEvent.click(chillRadio2!);
    const submit = screen.getByRole("button", { name: /Publicar viaje/i });
    await waitFor(() => expect(submit).not.toBeDisabled());
    await user.click(submit);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /WhatsApp/i })).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /Copiar enlace/i })).toBeInTheDocument();
  });
});

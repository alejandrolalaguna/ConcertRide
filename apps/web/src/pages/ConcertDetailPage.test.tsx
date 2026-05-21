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
    auth: { me: vi.fn(), logout: vi.fn() },
    concerts: {
      get: vi.fn(),
      list: vi.fn(),
      facets: vi.fn(),
      toggleInterest: vi.fn(),
      getInterest: vi.fn(),
    },
    rides: { list: vi.fn() },
    favorites: { list: vi.fn(), add: vi.fn(), remove: vi.fn() },
    crew: { list: vi.fn(), invite: vi.fn(), accept: vi.fn(), remove: vi.fn(), attending: vi.fn() },
    activity: { list: vi.fn() },
    alerts: { list: vi.fn(), create: vi.fn(), remove: vi.fn() },
    messages: { listConcertChat: vi.fn(), postConcertChat: vi.fn() },
    venues: { list: vi.fn() },
    users: { get: vi.fn() },
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

// motion/react animation engine needs APIs jsdom doesn't ship. Replace with
// plain DOM elements so the page renders synchronously inside the test.
vi.mock("motion/react", async () => {
  const React = await import("react");
  const pass = (props: Record<string, unknown>) => {
    const { children, as, ...rest } = props as { children?: unknown; as?: string };
    return React.createElement(as ?? "div", rest, children as never);
  };
  return {
    motion: new Proxy({} as Record<string, unknown>, { get: () => pass }),
    AnimatePresence: ({ children }: { children: unknown }) => children as never,
    LayoutGroup: ({ children }: { children: unknown }) => children as never,
  };
});

import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "../test/render";
import { CrewProvider } from "../lib/crew";
import ConcertDetailPage from "./ConcertDetailPage";

function ConcertDetailWithCrew() {
  return (
    <CrewProvider>
      <Routes>
        <Route path="/concerts/:id" element={<ConcertDetailPage />} />
      </Routes>
    </CrewProvider>
  );
}

const FIXTURE_CONCERT = {
  id: "c_test",
  artist: "Rosalía",
  name: "Rosalía · LUX Tour",
  date: new Date(Date.now() + 14 * 24 * 3600_000).toISOString(),
  venue: { id: "v_wizink", name: "WiZink Center", city: "Madrid", lat: 40.4234, lng: -3.6716 },
  image_url: null,
  genre: "pop",
  ticketmaster_id: "TM-abc",
  ticketmaster_url: "https://www.ticketmaster.es/event/abc",
  status: "active",
  fingerprint: "x",
  sources_json: "[]",
};

const FIXTURE_RIDES = [
  {
    id: "r_val_mad",
    driver_id: "u_driver1",
    driver: { id: "u_driver1", name: "Laura", handle: "laura", avatar_url: null, rating: 4.9, trips_completed: 12 },
    concert_id: "c_test",
    concert: FIXTURE_CONCERT,
    origin_city: "Valencia",
    origin_lat: 39.47,
    origin_lng: -0.37,
    origin_address: "Estación Norte",
    departure_time: new Date(Date.now() + 13 * 24 * 3600_000).toISOString(),
    price_per_seat: 18,
    seats_total: 3,
    seats_left: 2,
    round_trip: false,
    vibe: "chill",
    status: "active",
    smoking_policy: "no",
    max_luggage: "backpack",
    instant_booking: true,
    price_negotiable: false,
  },
];

beforeEach(() => {
  (apiMock.auth.me as Mock).mockResolvedValue({ user: null });
  (apiMock.favorites.list as Mock).mockResolvedValue({ favorites: [], upcoming_concerts: [] });
  (apiMock.crew.list as Mock).mockResolvedValue({ crew: [], invites: { incoming: [], outgoing: [] } });
  (apiMock.crew.attending as Mock).mockResolvedValue({ attending: [] });
  (apiMock.concerts.get as Mock).mockResolvedValue(FIXTURE_CONCERT);
  (apiMock.concerts.getInterest as Mock).mockResolvedValue({ count: 0, label: null });
  (apiMock.rides.list as Mock).mockResolvedValue({ rides: FIXTURE_RIDES });
  (apiMock.activity.list as Mock).mockResolvedValue({ events: [] });
  (apiMock.anticipations.list as Mock).mockResolvedValue({ anticipations: [] });
  (apiMock.messages.listConcertChat as Mock).mockResolvedValue({ messages: [] });
  (apiMock.squads.list as Mock).mockResolvedValue({ squads: [] });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("ConcertDetailPage — fetch concert + rides + TM compliance", () => {
  it("loads the concert and its rides from the API", async () => {
    await renderWithProviders(<ConcertDetailWithCrew />, { route: "/concerts/c_test" });

    await waitFor(() => {
      expect(apiMock.concerts.get).toHaveBeenCalledWith("c_test");
    });
    await waitFor(() => {
      expect(apiMock.rides.list).toHaveBeenCalled();
    });

    // Heading + venue + ride origin all appear (concert + rides fetched OK)
    await waitFor(() => {
      expect(screen.getAllByText(/Rosalía/i).length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText(/WiZink Center/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Valencia/i).length).toBeGreaterThan(0);
  });

  it("renders the Ticketmaster CTA when ticketmaster_url is present (TM compliance §4)", async () => {
    await renderWithProviders(<ConcertDetailWithCrew />, { route: "/concerts/c_test" });

    await waitFor(() => {
      expect(apiMock.concerts.get).toHaveBeenCalled();
    });

    // Look up by href attribute — accessible-name matching is fragile when
    // the link contains glyphs like ® or wraps an aria-hidden child.
    await waitFor(() => {
      const link = document.querySelector('a[href*="ticketmaster.es"]');
      expect(link).toBeTruthy();
    }, { timeout: 5000 });
    const link = document.querySelector('a[href*="ticketmaster.es"]');
    expect(link?.getAttribute("href")).toContain("ticketmaster.es");
  });

  it("renders empty rides gracefully when API returns no rides", async () => {
    (apiMock.rides.list as Mock).mockResolvedValueOnce({ rides: [] });

    await renderWithProviders(<ConcertDetailWithCrew />, { route: "/concerts/c_test" });

    await waitFor(() => {
      expect(apiMock.rides.list).toHaveBeenCalled();
    });

    // Page must still render the concert + venue even if no rides — no crash.
    await waitFor(() => {
      expect(screen.getAllByText(/Rosalía/i).length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText(/WiZink Center/i).length).toBeGreaterThan(0);
  });
});

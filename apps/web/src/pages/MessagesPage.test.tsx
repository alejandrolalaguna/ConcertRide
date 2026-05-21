import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import { screen, waitFor } from "@testing-library/react";

const hoisted = vi.hoisted(() => {
  const userObj = {
    id: "u_self",
    email: "self@test.es",
    name: "Yo",
    handle: null,
    phone: null,
    home_city: null,
    smoker: null,
    has_license: true,
    car_model: null,
    car_color: null,
    bio: null,
    music_genres: null,
    top_artists: null,
    avatar_url: null,
    email_verified_at: new Date().toISOString(),
    verified: true,
    license_verified: true,
    identity_verified: false,
    license_verification_status: "approved",
    identity_verification_status: null,
    banned_at: null,
    tos_accepted_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
  return {
    api: {
      auth: { me: vi.fn(async () => ({ user: userObj })) },
      messages: {
        listConversations: vi.fn(async () => ({ conversations: [] })),
      },
      favorites: { list: vi.fn(async () => ({ favorites: [], upcoming_concerts: [] })) },
    },
  };
});

vi.mock("../lib/api", () => ({
  api: hoisted.api,
  ApiError: class ApiError extends Error {
    status: number;
    constructor(status: number, msg: string) {
      super(msg);
      this.status = status;
    }
  },
}));

import MessagesPage from "./MessagesPage";
import { renderWithProviders } from "../test/render";

const apiMock = hoisted.api as unknown as {
  messages: { listConversations: Mock };
};

function dmConv(otherId: string, otherName: string, body: string) {
  return {
    kind: "dm" as const,
    other_user: {
      id: otherId,
      name: otherName,
      handle: null,
      avatar_url: null,
    },
    ride_id: null,
    ride_label: null,
    concert_id: null,
    concert_label: null,
    last_message_body: body,
    last_message_at: new Date().toISOString(),
    unread_count: 0,
  };
}

function rideConv(rideId: string, rideLabel: string, body: string) {
  return {
    kind: "ride" as const,
    other_user: null,
    ride_id: rideId,
    ride_label: rideLabel,
    concert_id: null,
    concert_label: null,
    last_message_body: body,
    last_message_at: new Date().toISOString(),
    unread_count: 0,
  };
}

describe("MessagesPage", () => {
  beforeEach(() => {
    apiMock.messages.listConversations.mockReset();
  });

  it("renders two conversations with their last message preview", async () => {
    apiMock.messages.listConversations.mockResolvedValue({
      conversations: [
        dmConv("u_alice", "Alice", "Hola, ¿vamos?"),
        rideConv("r_42", "Madrid → Mad Cool", "Salimos a las 18:00"),
      ],
    });

    await renderWithProviders(<MessagesPage />, { waitForUser: true });

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Hola, ¿vamos?")).toBeInTheDocument();
      expect(screen.getByText("Madrid → Mad Cool")).toBeInTheDocument();
      expect(screen.getByText("Salimos a las 18:00")).toBeInTheDocument();
    });
  });

  it("links DM conversations to /mensajes/:userId and ride conversations to /rides/:id", async () => {
    apiMock.messages.listConversations.mockResolvedValue({
      conversations: [
        dmConv("u_bob", "Bob", "DM preview"),
        rideConv("r_99", "Valencia → Arenal Sound", "Ride preview"),
      ],
    });

    await renderWithProviders(<MessagesPage />, { waitForUser: true });

    await waitFor(() => {
      const dmLink = screen.getByRole("link", { name: /Bob/i });
      expect(dmLink).toHaveAttribute("href", "/mensajes/u_bob");
      const rideLink = screen.getByRole("link", { name: /Valencia/i });
      expect(rideLink).toHaveAttribute("href", "/rides/r_99");
    });
  });

  it("shows the empty-state when there are no conversations", async () => {
    apiMock.messages.listConversations.mockResolvedValue({ conversations: [] });

    await renderWithProviders(<MessagesPage />, { waitForUser: true });

    await waitFor(() => {
      expect(screen.getByText(/Todavía no tienes conversaciones/i)).toBeInTheDocument();
    });
  });
});

import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const hoisted = vi.hoisted(() => {
  // Inline-construct because vi.hoisted runs before the module graph is loaded.
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
        listConcertChat: vi.fn(async () => ({ messages: [] })),
        postConcertChat: vi.fn(async () => ({ id: "m" })),
        uploadPhoto: vi.fn(async () => ({ url: "/api/messages/media/x" })),
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

import { ConcertChatSection } from "./ConcertChatSection";
import { renderWithProviders, makeMockUser } from "../test/render";

const apiMock = hoisted.api as unknown as {
  messages: {
    listConcertChat: Mock;
    postConcertChat: Mock;
    uploadPhoto: Mock;
  };
};

function makeMessage(id: string, userId: string, userName: string, body: string) {
  return {
    id,
    ride_id: null,
    concert_id: "c_test",
    user_id: userId,
    user: makeMockUser({ id: userId, name: userName }),
    kind: "text" as const,
    body,
    attachment_url: null,
    created_at: new Date().toISOString(),
  };
}

describe("ConcertChatSection", () => {
  beforeEach(() => {
    apiMock.messages.listConcertChat.mockReset();
    apiMock.messages.postConcertChat.mockReset();
    apiMock.messages.uploadPhoto.mockReset();
  });

  it("renders the messages returned by listConcertChat", async () => {
    apiMock.messages.listConcertChat.mockResolvedValue({
      messages: [
        makeMessage("m1", "u_a", "Alice", "Primer mensaje"),
        makeMessage("m2", "u_b", "Bob", "Segundo mensaje"),
      ],
    });

    await renderWithProviders(<ConcertChatSection concertId="c_test" artist="Rosalía" />, {
      waitForUser: true,
    });

    await waitFor(() => {
      expect(screen.getByText("Primer mensaje")).toBeInTheDocument();
      expect(screen.getByText("Segundo mensaje")).toBeInTheDocument();
    });
  });

  it("sends a text message via postConcertChat when the user submits", async () => {
    apiMock.messages.listConcertChat.mockResolvedValue({ messages: [] });
    apiMock.messages.postConcertChat.mockResolvedValue(
      makeMessage("m_new", "u_self", "Yo", "Hola fans"),
    );

    await renderWithProviders(<ConcertChatSection concertId="c_test" artist="Rosalía" />, {
      waitForUser: true,
    });

    await waitFor(() => expect(apiMock.messages.listConcertChat).toHaveBeenCalled());

    const input = await screen.findByPlaceholderText(/escribe un mensaje/i);
    await userEvent.type(input, "Hola fans");
    await userEvent.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    await waitFor(() => {
      expect(apiMock.messages.postConcertChat).toHaveBeenCalledWith(
        "c_test",
        expect.objectContaining({ body: "Hola fans", kind: "text" }),
      );
    });
  });

  it("uploads a photo and then posts a message with attachment_url", async () => {
    apiMock.messages.listConcertChat.mockResolvedValue({ messages: [] });
    apiMock.messages.uploadPhoto.mockResolvedValue({ url: "/api/messages/media/xyz" });
    apiMock.messages.postConcertChat.mockResolvedValue(
      makeMessage("m_new", "u_self", "Yo", "📷 Foto"),
    );

    await renderWithProviders(<ConcertChatSection concertId="c_test" artist="Rosalía" />, {
      waitForUser: true,
    });

    await waitFor(() => expect(apiMock.messages.listConcertChat).toHaveBeenCalled());

    // The hidden file input is accept image/* — we grab it directly
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement | null;
    expect(fileInput).not.toBeNull();

    const file = new File([new Uint8Array(10)], "photo.jpg", { type: "image/jpeg" });
    await userEvent.upload(fileInput!, file);

    await userEvent.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    await waitFor(() => {
      expect(apiMock.messages.uploadPhoto).toHaveBeenCalledWith(file);
      expect(apiMock.messages.postConcertChat).toHaveBeenCalledWith(
        "c_test",
        expect.objectContaining({
          attachment_url: "/api/messages/media/xyz",
          kind: "photo",
        }),
      );
    });
  });

  it("does not call postConcertChat when the body is empty and there is no attachment", async () => {
    apiMock.messages.listConcertChat.mockResolvedValue({ messages: [] });

    await renderWithProviders(<ConcertChatSection concertId="c_test" artist="Rosalía" />, {
      waitForUser: true,
    });
    await waitFor(() => expect(apiMock.messages.listConcertChat).toHaveBeenCalled());

    await userEvent.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    expect(apiMock.messages.postConcertChat).not.toHaveBeenCalled();
  });
});

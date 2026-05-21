import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";

const hoisted = vi.hoisted(() => {
  const selfUser = {
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
  const otherUser = { ...selfUser, id: "u_other", email: "other@test.es", name: "Alex" };
  return {
    selfUser,
    otherUser,
    api: {
      auth: { me: vi.fn(async () => ({ user: selfUser })) },
      users: { get: vi.fn(async () => otherUser) },
      messages: {
        listDM: vi.fn(async () => ({ messages: [] })),
        postDM: vi.fn(async () => ({ id: "dm_new" })),
        uploadPhoto: vi.fn(async () => ({ url: "/api/messages/media/x" })),
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

import DirectMessagePage from "./DirectMessagePage";
import { renderWithProviders } from "../test/render";

const apiMock = hoisted.api as unknown as {
  messages: { listDM: Mock; postDM: Mock };
};

function makeDM(id: string, senderId: string, senderName: string, body: string, created: string) {
  const sender = { id: senderId, name: senderName };
  return {
    id,
    sender_id: senderId,
    recipient_id: "x",
    sender,
    recipient: { id: "x", name: "x" },
    kind: "text" as const,
    body,
    attachment_url: null,
    created_at: created,
  };
}

describe("DirectMessagePage", () => {
  beforeEach(() => {
    apiMock.messages.listDM.mockReset();
    apiMock.messages.postDM.mockReset();
  });

  it("renders DMs in the order returned by listDM", async () => {
    apiMock.messages.listDM.mockResolvedValue({
      messages: [
        makeDM("d1", "u_self", "Yo", "Mensaje uno", "2026-05-20T10:00:00.000Z"),
        makeDM("d2", "u_other", "Alex", "Mensaje dos", "2026-05-20T10:01:00.000Z"),
        makeDM("d3", "u_self", "Yo", "Mensaje tres", "2026-05-20T10:02:00.000Z"),
      ],
    });

    await renderWithProviders(
      <Routes>
        <Route path="/mensajes/:userId" element={<DirectMessagePage />} />
      </Routes>,
      { route: "/mensajes/u_other", waitForUser: true },
    );

    await waitFor(() => {
      expect(screen.getByText("Mensaje uno")).toBeInTheDocument();
      expect(screen.getByText("Mensaje dos")).toBeInTheDocument();
      expect(screen.getByText("Mensaje tres")).toBeInTheDocument();
    });
  });

  it("calls postDM with the recipient userId when sending a message", async () => {
    apiMock.messages.listDM.mockResolvedValue({ messages: [] });
    apiMock.messages.postDM.mockResolvedValue(
      makeDM("d_new", "u_self", "Yo", "Hola Alex", new Date().toISOString()),
    );

    await renderWithProviders(
      <Routes>
        <Route path="/mensajes/:userId" element={<DirectMessagePage />} />
      </Routes>,
      { route: "/mensajes/u_other", waitForUser: true },
    );

    await waitFor(() => expect(apiMock.messages.listDM).toHaveBeenCalled());

    const input = await screen.findByPlaceholderText(/escribe un mensaje/i);
    await userEvent.type(input, "Hola Alex");
    await userEvent.click(screen.getByRole("button", { name: /enviar mensaje/i }));

    await waitFor(() => {
      expect(apiMock.messages.postDM).toHaveBeenCalledWith(
        "u_other",
        expect.objectContaining({ body: "Hola Alex", kind: "text" }),
      );
    });
  });
});

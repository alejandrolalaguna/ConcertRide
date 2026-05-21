import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../lib/api", async () => {
  const { makeApiMock } = await import("../test/api-mock");
  class ApiError extends Error {
    status: number;
    code: string;
    constructor(status: number, code: string, message: string) {
      super(message);
      this.status = status;
      this.code = code;
    }
  }
  return { api: makeApiMock({ user: null }), ApiError };
});

import { api, ApiError } from "../lib/api";
import type { makeApiMock } from "../test/api-mock";
import { renderWithProviders, makeMockUser } from "../test/render";
import RegisterPage from "./RegisterPage";

type ApiMock = ReturnType<typeof makeApiMock> & {
  auth: {
    register: ReturnType<typeof vi.fn>;
    me: ReturnType<typeof vi.fn>;
  };
};

beforeEach(() => {
  vi.clearAllMocks();
  ((api as unknown) as ApiMock).auth.me.mockResolvedValue({ user: null });
});

describe("RegisterPage", () => {
  it("renders the required fields", async () => {
    await renderWithProviders(<RegisterPage />, { route: "/register" });
    expect(await screen.findByPlaceholderText("Tu nombre")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("tu@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  it("submit button is disabled until ToS and age are accepted", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<RegisterPage />, { route: "/register" });

    const button = await screen.findByRole("button", { name: /Crear cuenta/i });
    expect(button).toBeDisabled();

    await user.type(screen.getByPlaceholderText("Tu nombre"), "Lucia");
    await user.type(screen.getByPlaceholderText("tu@email.com"), "lucia@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "Password1!");
    expect(button).toBeDisabled();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]!);
    expect(button).toBeDisabled();
    await user.click(checkboxes[1]!);
    expect(button).not.toBeDisabled();
  });

  it("submit button stays disabled when password < 8 chars", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<RegisterPage />, { route: "/register" });

    const button = await screen.findByRole("button", { name: /Crear cuenta/i });
    await user.type(screen.getByPlaceholderText("Tu nombre"), "Lucia");
    await user.type(screen.getByPlaceholderText("tu@email.com"), "lucia@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "short");
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]!);
    await user.click(checkboxes[1]!);
    expect(button).toBeDisabled();
  });

  it("calls api.auth.register with email/password/name/tos_accepted on submit", async () => {
    const user = userEvent.setup();
    const mockedUser = makeMockUser({ email: "lucia@example.com", name: "Lucia" });
    const apiMock = (api as unknown) as ApiMock;
    apiMock.auth.register.mockResolvedValueOnce({ ok: true, user: mockedUser });

    await renderWithProviders(<RegisterPage />, { route: "/register" });
    await user.type(await screen.findByPlaceholderText("Tu nombre"), "Lucia");
    await user.type(screen.getByPlaceholderText("tu@email.com"), "lucia@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "Password1!");
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]!);
    await user.click(checkboxes[1]!);
    await user.click(screen.getByRole("button", { name: /Crear cuenta/i }));

    await waitFor(() => {
      expect(apiMock.auth.register).toHaveBeenCalled();
    });
    const [email, password, name] = apiMock.auth.register.mock.calls[0]!;
    expect(email).toBe("lucia@example.com");
    expect(password).toBe("Password1!");
    expect(name).toBe("Lucia");
  });

  it("shows error message when register returns 409", async () => {
    const user = userEvent.setup();
    const apiMock = (api as unknown) as ApiMock;
    apiMock.auth.register.mockRejectedValueOnce(
      // @ts-expect-error — mocked ApiError uses (status, code, message) signature
      new ApiError(409, "email_taken", "Ya existe una cuenta con ese email"),
    );

    await renderWithProviders(<RegisterPage />, { route: "/register" });
    await user.type(await screen.findByPlaceholderText("Tu nombre"), "Lucia");
    await user.type(screen.getByPlaceholderText("tu@email.com"), "dup@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "Password1!");
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]!);
    await user.click(checkboxes[1]!);
    await user.click(screen.getByRole("button", { name: /Crear cuenta/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/Ya existe/i);
  });
});

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
import LoginPage from "./LoginPage";

type ApiMock = ReturnType<typeof makeApiMock> & {
  auth: { login: ReturnType<typeof vi.fn>; me: ReturnType<typeof vi.fn> };
};

beforeEach(() => {
  vi.clearAllMocks();
  ((api as unknown) as ApiMock).auth.me.mockResolvedValue({ user: null });
});

describe("LoginPage", () => {
  it("renders email + password inputs + submit button", async () => {
    await renderWithProviders(<LoginPage />, { route: "/login" });
    expect(await screen.findByPlaceholderText("tu@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Entrar/i })).toBeInTheDocument();
  });

  it("shows an error message when login returns 401", async () => {
    const user = userEvent.setup();
    ((api as unknown) as ApiMock).auth.login.mockRejectedValueOnce(
      // ts-ignore: the test mocks ApiError with a different (status, code, message) signature.
      // The vi.mock above replaces the real class at runtime; TS still sees the real signature.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error — mocked ApiError uses (status, code, message)
      new ApiError(401, "invalid_credentials", "Email o contraseña incorrectos"),
    );

    await renderWithProviders(<LoginPage />, { route: "/login" });
    await user.type(await screen.findByPlaceholderText("tu@email.com"), "wrong@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "badpassword");
    await user.click(screen.getByRole("button", { name: /^Entrar/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/incorrectos/i);
  });

  it("calls api.auth.login on submit", async () => {
    const user = userEvent.setup();
    const mockedUser = makeMockUser({ email: "ok@example.com" });
    ((api as unknown) as ApiMock).auth.login.mockResolvedValueOnce({ ok: true, user: mockedUser });

    await renderWithProviders(<LoginPage />, { route: "/login" });
    await user.type(await screen.findByPlaceholderText("tu@email.com"), "ok@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "Password1!");
    await user.click(screen.getByRole("button", { name: /^Entrar/i }));

    await waitFor(() => {
      expect(((api as unknown) as ApiMock).auth.login).toHaveBeenCalledWith("ok@example.com", "Password1!");
    });
  });

  it("submit button is disabled until both fields have values", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<LoginPage />, { route: "/login" });
    const button = await screen.findByRole("button", { name: /^Entrar/i });
    expect(button).toBeDisabled();

    await user.type(screen.getByPlaceholderText("tu@email.com"), "a@b.es");
    expect(button).toBeDisabled();
    await user.type(screen.getByPlaceholderText("••••••••"), "x");
    expect(button).not.toBeDisabled();
  });

  it("?next=/profile is preserved on the register link (clean path)", async () => {
    await renderWithProviders(<LoginPage />, { route: "/login?next=/profile" });
    const link = await screen.findByRole("link", { name: /Regístrate/i });
    expect(link.getAttribute("href")).toBe("/register?next=%2Fprofile");
  });

  it("?next=/login?next=/X sanitizes to '/' (does not loop)", async () => {
    await renderWithProviders(<LoginPage />, {
      route: "/login?next=/login?next=/profile",
    });
    // Register link should resolve to /register without a forwarded next (since
    // the dangerous value was rejected and next falls back to "/").
    const link = await screen.findByRole("link", { name: /Regístrate/i });
    expect(link.getAttribute("href")).toBe("/register");
  });

  it("?next=//evil.com is rejected (sanitizer drops protocol-relative URLs)", async () => {
    await renderWithProviders(<LoginPage />, { route: "/login?next=//evil.com" });
    const link = await screen.findByRole("link", { name: /Regístrate/i });
    expect(link.getAttribute("href")).toBe("/register");
  });
});

import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// usePush relies on navigator.serviceWorker.ready, which jsdom doesn't provide.
// Mocking it at module level avoids the 3s fallback timer racing test assertions.
vi.mock("../lib/usePush", () => ({
  usePush: () => ({ state: "unsupported", subscribe: async () => {}, unsubscribe: async () => {} }),
}));

// motion/react's animation engine touches APIs jsdom doesn't ship (PointerEvent,
// requestAnimationFrame with rAF cancel patterns). Replace motion components
// with plain divs so ProfilePage renders synchronously.
vi.mock("motion/react", async () => {
  const React = await import("react");
  const passthrough = (props: Record<string, unknown>) => {
    const { children, as, ...rest } = props as { children?: unknown; as?: string };
    return React.createElement(as ?? "div", rest, children as never);
  };
  return {
    motion: new Proxy({} as Record<string, unknown>, { get: () => passthrough }),
    AnimatePresence: ({ children }: { children: unknown }) => children as never,
    LayoutGroup: ({ children }: { children: unknown }) => children as never,
  };
});

// Inline user factory — pulling it from render.tsx would cycle through
// SessionProvider, which we're about to mock, causing a module-init deadlock.
function makeUser(overrides: Record<string, unknown> = {}) {
  return {
    id: "u_test",
    email: "test@example.com",
    name: "Test User",
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
    rides_given: 0,
    rides_taken: 0,
    rating: 0,
    rating_count: 0,
    ...overrides,
  };
}

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
  return { api: makeApiMock({ user: makeUser({ name: "Lucia Tester" }) as never }), ApiError };
});

// Bypass the real SessionProvider lifecycle in tests — its useEffect-based
// fetch-and-set flow doesn't settle reliably across jsdom + react-router in
// time for findByText to win. Mocking useSession lets every ProfilePage test
// start with a known logged-in user.
vi.mock("../lib/session", () => {
  let currentUser = makeUser({ name: "Lucia Tester", license_verified: false, identity_verified: false });
  return {
    useSession: () => ({
      user: currentUser,
      loading: false,
      refresh: async () => {},
      logout: async () => {},
    }),
    SessionProvider: ({ children }: { children: unknown }) => children as never,
    __setMockUser: (u: unknown) => {
      currentUser = u as typeof currentUser;
    },
  };
});

import { api } from "../lib/api";
import type { makeApiMock } from "../test/api-mock";
import { renderWithProviders, makeMockUser } from "../test/render";
import ProfilePage from "./ProfilePage";
import * as sessionModule from "../lib/session";

const setMockUser = (sessionModule as unknown as { __setMockUser: (u: unknown) => void }).__setMockUser;

type ApiMock = ReturnType<typeof makeApiMock> & {
  auth: {
    me: ReturnType<typeof vi.fn>;
    updateProfile: ReturnType<typeof vi.fn>;
    verifyLicense: ReturnType<typeof vi.fn>;
    verifyIdentity: ReturnType<typeof vi.fn>;
    myLicenseReview: ReturnType<typeof vi.fn>;
    myIdentityReview: ReturnType<typeof vi.fn>;
  };
  users: { listReviews: ReturnType<typeof vi.fn> };
  rides: { list: ReturnType<typeof vi.fn>; listMine: ReturnType<typeof vi.fn> };
};

const apiMock = (api as unknown) as ApiMock;

beforeEach(() => {
  // Don't clearAllMocks — that would also wipe the default user the factory
  // captured. Just reset call counts on the most-asserted-against fns.
  apiMock.auth.updateProfile.mockClear();
  apiMock.auth.verifyLicense.mockClear();
  setMockUser(makeMockUser({ name: "Lucia Tester", license_verified: false, identity_verified: false }));
});

describe("ProfilePage", () => {
  it("renders the bio field and shows a 200-char counter", async () => {
    await renderWithProviders(<ProfilePage />, { route: "/profile" });
    expect(await screen.findByText(/Bio \(máx 200\)/i, undefined, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.getByText("0/200")).toBeInTheDocument();
  });

  it("renders music genres field with max-8 hint", async () => {
    await renderWithProviders(<ProfilePage />, { route: "/profile" });
    expect(await screen.findByText(/Géneros.*máx 8/i)).toBeInTheDocument();
  });

  it("renders top artists field with max-10 hint", async () => {
    await renderWithProviders(<ProfilePage />, { route: "/profile" });
    expect(await screen.findByText(/Top artistas.*máx 10/i)).toBeInTheDocument();
  });

  it("calls api.auth.updateProfile when the save button is clicked", async () => {
    const user = userEvent.setup();
    apiMock.auth.updateProfile.mockResolvedValueOnce({ ok: true, user: makeMockUser() });

    await renderWithProviders(<ProfilePage />, { route: "/profile" });

    const saveButton = await screen.findByRole("button", { name: /Guardar cambios/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(apiMock.auth.updateProfile).toHaveBeenCalled();
    });
  });

  it("bio textarea slices input to 200 chars", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<ProfilePage />, { route: "/profile" });

    const heading = await screen.findByText(/Bio \(máx 200\)/i);
    const bioField = heading.parentElement!.querySelector("textarea") as HTMLTextAreaElement;
    expect(bioField).toBeTruthy();

    await user.click(bioField);
    await user.paste("a".repeat(220));

    expect(bioField.value.length).toBe(200);
  });

  it("renders the verify-license file input accepting JPG/PNG/WEBP/PDF", async () => {
    await renderWithProviders(<ProfilePage />, { route: "/profile" });
    await screen.findByText(/Verifica tu carnet de conducir/i);
    const inputs = document.querySelectorAll('input[type="file"]');
    expect(inputs.length).toBeGreaterThanOrEqual(1);
    const accept = inputs[0]!.getAttribute("accept") ?? "";
    expect(accept).toContain("image/jpeg");
    expect(accept).toContain("image/png");
    expect(accept).toContain("image/webp");
    expect(accept).toContain("application/pdf");
  });

  it("shows 'Conductor verificado' badge when user.license_verified", async () => {
    setMockUser(makeMockUser({ license_verified: true }));
    await renderWithProviders(<ProfilePage />, { route: "/profile" });
    expect(await screen.findByText(/Conductor verificado/i)).toBeInTheDocument();
    // Reset for next test
    setMockUser(makeMockUser({ name: "Lucia Tester", license_verified: false, identity_verified: false }));
  });

  it("shows 'Pendiente de aprobación' when licenseReview.status is pending", async () => {
    apiMock.auth.myLicenseReview.mockResolvedValueOnce({
      review: {
        id: "lr_1",
        user_id: "u_test",
        file_kv_key: "",
        status: "pending",
        submitted_at: new Date().toISOString(),
        reviewed_at: null,
        rejection_reason: null,
      },
    });
    await renderWithProviders(<ProfilePage />, { route: "/profile" });
    await waitFor(() => {
      expect(screen.queryByText(/Pendiente de aprobación/i)).toBeInTheDocument();
    });
  });
});

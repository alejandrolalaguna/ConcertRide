// renderWithProviders — wraps tests in the same context providers production uses.
// Strategy: tests pre-stub `api.auth.me()` (via vi.mock("../lib/api")) and we mount
// the real SessionProvider + FavoritesProvider. So tests get the same hook
// behaviour as production without us reaching into private context internals.

import type { ReactElement, ReactNode } from "react";
import { MemoryRouter, type MemoryRouterProps } from "react-router-dom";
import { render, waitFor, type RenderOptions, type RenderResult } from "@testing-library/react";
import { SessionProvider } from "../lib/session";
import { FavoritesProvider } from "../lib/favorites";
import type { User } from "@concertride/types";

export interface ProvidersOptions {
  route?: string;
  routerProps?: MemoryRouterProps;
  // When provided, indicates that you've already configured the api mock to
  // return this user from api.auth.me(). We wait for the provider to settle.
  waitForUser?: boolean;
}

export function Providers({
  children,
  route,
  routerProps,
}: ProvidersOptions & { children: ReactNode }) {
  const initialEntries = route ? [route] : ["/"];
  return (
    <MemoryRouter initialEntries={initialEntries} {...routerProps}>
      <SessionProvider>
        <FavoritesProvider>{children}</FavoritesProvider>
      </SessionProvider>
    </MemoryRouter>
  );
}

export async function renderWithProviders(
  ui: ReactElement,
  opts: ProvidersOptions & Omit<RenderOptions, "wrapper"> = {},
): Promise<RenderResult> {
  const wrapper = ({ children }: { children: ReactNode }) => <Providers {...opts}>{children}</Providers>;
  const result = render(ui, { wrapper, ...opts });
  if (opts.waitForUser) {
    // Settle the SessionProvider's initial me() call.
    await waitFor(() => {
      // Just yield a microtask — providers may have set loading=false synchronously
      // after the mocked me() resolves.
      return Promise.resolve();
    });
  }
  return result;
}

// Build a fully-populated User mock so tests don't repeat boilerplate.
export function makeMockUser(overrides: Partial<User> = {}): User {
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
  } as User;
}

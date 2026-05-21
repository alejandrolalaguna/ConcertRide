// Test helpers for integration tests. The pattern:
//  1. Build an in-process Env with just the knobs the route handlers touch.
//  2. Run requests through a thin Hono app that mirrors src/index.ts but
//     skips the Sentry wrapper (not relevant for unit-level tests).
//  3. Use a fresh MemoryStore per suite — buildTestApp() always creates a new
//     one so tests are isolated without explicit resetMemoryStore() calls.
// Keeps the blast radius small: no network, no Turso, no Resend, no wrangler.
import type { Env } from "../env";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { HonoEnv } from "../types";
import { MemoryStore } from "../store/memory";

import auth from "../routes/auth";
import concerts from "../routes/concerts";
import rides from "../routes/rides";
import venues from "../routes/venues";
import users from "../routes/users";
import fuel from "../routes/fuel";
import push from "../routes/push";
import messages from "../routes/messages";
import favorites from "../routes/favorites";
import reports from "../routes/reports";
import admin from "../routes/admin";
import alerts from "../routes/alerts";
import crews from "../routes/crews";
import activity from "../routes/activity";
import anticipations from "../routes/anticipations";
import memories from "../routes/memories";
import festivalQnas from "../routes/festival-qnas";
import squads from "../routes/squads";
import playlists from "../routes/playlists";
import stats from "../routes/stats";
import og from "../routes/og";
import ingest from "../routes/ingest";
import testMode from "../routes/test-mode";
import { rateLimit } from "../lib/ratelimit";

// In-memory fake KV that satisfies the minimum subset of KVNamespace the code
// uses (get / put / delete + expirationTtl option). Keys expire immediately
// when put with TTL=0; otherwise they persist for the life of the fake.
class FakeKV {
  private data = new Map<string, string>();
  private ttls = new Map<string, number>();
  async get(key: string): Promise<string | null> {
    const exp = this.ttls.get(key);
    if (exp !== undefined && Date.now() > exp) {
      this.data.delete(key);
      this.ttls.delete(key);
      return null;
    }
    return this.data.get(key) ?? null;
  }
  async put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void> {
    this.data.set(key, value);
    if (options?.expirationTtl) {
      this.ttls.set(key, Date.now() + options.expirationTtl * 1000);
    } else {
      this.ttls.delete(key);
    }
  }
  async delete(key: string): Promise<void> {
    this.data.delete(key);
    this.ttls.delete(key);
  }
  async list(opts?: { prefix?: string }) {
    const prefix = opts?.prefix ?? "";
    return {
      keys: [...this.data.keys()]
        .filter((name) => name.startsWith(prefix))
        .map((name) => ({ name })),
    };
  }
}

export type TestApp = ReturnType<typeof buildTestApp>;

export function buildTestApp(overrides: Partial<Env> = {}) {
  const store = new MemoryStore();
  const kv = new FakeKV();

  const env: Env = {
    TURSO_DATABASE_URL: "",
    TURSO_AUTH_TOKEN: "",
    TICKETMASTER_API_KEY: "",
    RESEND_API_KEY: "",
    JWT_SECRET: "test-secret-32bytes-hex-padded-ab",
    INGEST_SECRET: "test-ingest",
    VAPID_PUBLIC_KEY: "",
    VAPID_PRIVATE_KEY: "",
    SENTRY_DSN: "",
    SUPPORT_EMAIL: "",
    ADMIN_USER_IDS: "",
    ENVIRONMENT: "development",
    SITE_URL: "https://concertride.me",
    ASSETS: { fetch: async () => new Response("", { status: 404 }) } as unknown as Fetcher,
    CACHE: kv as unknown as KVNamespace,
    TEST_MODE: undefined,
    ...overrides,
  };

  const app = new Hono<HonoEnv>();

  app.use(
    "/api/*",
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
  );

  // Same store-injection middleware as production
  app.use("/api/*", async (c, next) => {
    c.set("store", store);
    await next();
  });

  // Universal write limiter (mirrors src/index.ts)
  const writeLimiter = rateLimit({ scope: "write", limit: 60, windowSec: 60 });
  app.use("/api/*", async (c, next) => {
    if (c.req.method === "GET" || c.req.method === "HEAD" || c.req.method === "OPTIONS") {
      return next();
    }
    return writeLimiter(c, next);
  });

  app.get("/api/health", (c) =>
    c.json({ status: "ok", timestamp: new Date().toISOString(), environment: c.env.ENVIRONMENT }),
  );

  app.route("/api/auth", auth);
  app.route("/api/concerts", concerts);
  app.route("/api/rides", rides);
  app.route("/api/venues", venues);
  app.route("/api/users", users);
  app.route("/api/fuel-price", fuel);
  app.route("/api/push", push);
  app.route("/api/messages", messages);
  app.route("/api/favorites", favorites);
  app.route("/api/reports", reports);
  app.route("/api/admin", admin);
  app.route("/api/alerts", alerts);
  app.route("/api/crew", crews);
  app.route("/api/activity", activity);
  app.route("/api/anticipations", anticipations);
  app.route("/api/memories", memories);
  app.route("/api/festival-qnas", festivalQnas);
  app.route("/api/squads", squads);
  app.route("/api/playlists", playlists);
  app.route("/api/stats", stats);
  app.route("/api/og", og);
  app.route("/api/ingest", ingest);
  app.route("/api/__test__", testMode);

  app.onError((err, c) => {
    // eslint-disable-next-line no-console
    console.error("test.onError", err);
    return c.json({ error: "internal", message: err.message }, 500);
  });

  // Fake ExecutionContext — without this, any handler that uses
  // `c.executionCtx.waitUntil(...)` throws in tests. We collect the promises
  // so flush() can await them when side effects matter.
  const pending: Promise<unknown>[] = [];
  const ctx: ExecutionContext = {
    waitUntil: (p: Promise<unknown>) => {
      pending.push(Promise.resolve(p));
    },
    passThroughOnException: () => {},
    props: {},
  };

  async function flush() {
    await Promise.allSettled(pending.splice(0));
  }

  // Helper: run a request and return { status, body, cookies }
  async function request(
    path: string,
    init: RequestInit & { cookies?: string } = {},
  ): Promise<{ status: number; body: unknown; cookies: string; headers: Headers }> {
    const headers = new Headers(init.headers);
    if (init.cookies) headers.set("cookie", init.cookies);
    if (init.body && !headers.has("content-type") && typeof init.body === "string") {
      headers.set("content-type", "application/json");
    }
    // Default IP header so rate-limit fingerprints differ per test suite.
    if (!headers.has("cf-connecting-ip")) {
      headers.set("cf-connecting-ip", `127.0.0.${Math.floor(Math.random() * 250) + 1}`);
    }
    const url = path.startsWith("http") ? path : `http://localhost${path}`;
    const req = new Request(url, { ...init, headers });
    const res = await app.fetch(req, env, ctx);
    const setCookie = res.headers.get("set-cookie") ?? "";
    const ct = res.headers.get("content-type") ?? "";
    let body: unknown;
    if (ct.includes("application/json")) {
      body = await res.json();
    } else if (ct.startsWith("image/")) {
      body = await res.arrayBuffer();
    } else {
      body = await res.text();
    }
    return { status: res.status, body, cookies: setCookie, headers: res.headers };
  }

  return { app, env, store, kv, request, flush };
}

// Extract the cr_session cookie value from a Set-Cookie header so subsequent
// requests can authenticate. Returns the raw "name=value" pair, not the full
// attribute string.
export function extractSessionCookie(setCookie: string): string {
  const match = /cr_session=[^;]+/.exec(setCookie);
  return match?.[0] ?? "";
}

// Register + login and return the cookie string. Also marks email_verified_at
// so the user can publish/reserve in subsequent tests — the real flow requires
// a KV token round-trip we don't care about at this level.
export async function registerAndLogin(
  ctx: TestApp,
  email: string,
  password = "Test1234!",
  name = "Test User",
): Promise<{ cookie: string; userId: string }> {
  const res = await ctx.request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name, tos_accepted: true }),
  });
  if (res.status !== 201) {
    throw new Error(`register failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  const cookie = extractSessionCookie(res.cookies);
  const body = res.body as { user: { id: string } };
  await ctx.store.markEmailVerified(body.user.id);
  return { cookie, userId: body.user.id };
}

// Same as registerAndLogin but with license_verified=true so the user can
// publish rides without going through the admin review queue.
export async function makeVerifiedDriver(
  ctx: TestApp,
  email: string,
  password = "Test1234!",
  name = "Driver",
): Promise<{ cookie: string; userId: string }> {
  const { cookie, userId } = await registerAndLogin(ctx, email, password, name);
  const user = await ctx.store.getUser(userId);
  if (user) {
    (user as unknown as { license_verified: boolean }).license_verified = true;
  }
  return { cookie, userId };
}

// Alias to clarify intent. A "verified passenger" is just a user with
// email_verified_at — they don't need a driver's license to request seats.
export async function makeVerifiedPassenger(
  ctx: TestApp,
  email: string,
  password = "Test1234!",
  name = "Passenger",
): Promise<{ cookie: string; userId: string }> {
  return registerAndLogin(ctx, email, password, name);
}

// Pick the first fixture concert ID from the seeded MemoryStore. Tests can
// override by passing concert_id explicitly.
export const FIXTURE_CONCERT_ID = "c_rosalia_wizink";

interface PublishRideOptions {
  concert_id?: string;
  origin_city?: string;
  origin_lat?: number;
  origin_lng?: number;
  origin_address?: string;
  departure_time?: string;
  price_per_seat?: number;
  seats_total?: number;
  vibe?: "party" | "chill" | "mixed";
  round_trip?: boolean;
  instant_booking?: boolean;
  price_negotiable?: boolean;
  accepted_payment?: "cash" | "bizum" | "cash_or_bizum";
  smoking_policy?: "no" | "yes";
  max_luggage?: "none" | "small" | "backpack" | "cabin" | "large" | "extra";
  notes?: string;
}

// Publish a ride against the given driver cookie. Sane defaults so individual
// tests only set the fields they care about.
export async function publishRide(
  ctx: TestApp,
  cookie: string,
  overrides: PublishRideOptions = {},
): Promise<{ ride: { id: string; [k: string]: unknown }; status: number; raw: unknown }> {
  const departure = new Date(Date.now() + 48 * 3600_000).toISOString();
  const res = await ctx.request("/api/rides", {
    method: "POST",
    cookies: cookie,
    body: JSON.stringify({
      concert_id: overrides.concert_id ?? FIXTURE_CONCERT_ID,
      origin_city: overrides.origin_city ?? "Valencia",
      origin_lat: overrides.origin_lat ?? 39.47,
      origin_lng: overrides.origin_lng ?? -0.37,
      origin_address: overrides.origin_address ?? "Plaza Ayuntamiento",
      departure_time: overrides.departure_time ?? departure,
      price_per_seat: overrides.price_per_seat ?? 12,
      seats_total: overrides.seats_total ?? 3,
      round_trip: overrides.round_trip ?? false,
      vibe: overrides.vibe ?? "chill",
      instant_booking: overrides.instant_booking,
      price_negotiable: overrides.price_negotiable,
      accepted_payment: overrides.accepted_payment,
      smoking_policy: overrides.smoking_policy,
      max_luggage: overrides.max_luggage,
      notes: overrides.notes,
    }),
  });
  // POST /api/rides returns the ride object directly (not wrapped in { ride }).
  // Fall back to an empty id so callers can still pattern-match on error.
  const rideBody =
    res.status === 201 && res.body && typeof res.body === "object"
      ? (res.body as { id: string; [k: string]: unknown })
      : { id: "" };
  return {
    status: res.status,
    raw: res.body,
    ride: rideBody,
  };
}

// Returns a small File-shaped object suitable for multipart upload via undici
// FormData. Caller passes the desired mime/type and contents.
export function makeUploadFile(
  name: string,
  type: string,
  contents: string | Uint8Array = "x",
): File {
  const data = typeof contents === "string" ? new TextEncoder().encode(contents) : contents;
  return new File([data], name, { type });
}

// Build a multipart body for use with ctx.request({ method: "POST", body: <FormData> }).
// Hono's c.req.parseBody() handles standard multipart/form-data; just don't set
// a content-type header — the global Request constructor sets the boundary.
export function multipart(fields: Record<string, string | File>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) {
    fd.append(k, v as string | Blob);
  }
  return fd;
}

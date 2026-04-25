// Test helpers for integration tests. The pattern:
//  1. Build an in-process Env with just the knobs the route handlers touch.
//  2. Run requests through a thin Hono app that mirrors src/index.ts but
//     skips the Sentry wrapper (not relevant for unit-level tests).
//  3. Use a fresh MemoryStore singleton per suite via resetMemoryStore().
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
import { rateLimit } from "../lib/ratelimit";

// In-memory fake KV that satisfies the minimum subset of KVNamespace the code
// uses (get / put / delete + expirationTtl option). Keys expire immediately
// when put with TTL=0; otherwise they persist for the life of the fake.
class FakeKV {
  private data = new Map<string, string>();
  async get(key: string): Promise<string | null> {
    return this.data.get(key) ?? null;
  }
  async put(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }
  async delete(key: string): Promise<void> {
    this.data.delete(key);
  }
  async list() {
    return { keys: [...this.data.keys()].map((name) => ({ name })) };
  }
}

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
  ): Promise<{ status: number; body: unknown; cookies: string }> {
    const headers = new Headers(init.headers);
    if (init.cookies) headers.set("cookie", init.cookies);
    if (init.body && !headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }
    const url = path.startsWith("http") ? path : `http://localhost${path}`;
    const req = new Request(url, { ...init, headers });
    const res = await app.fetch(req, env, ctx);
    const setCookie = res.headers.get("set-cookie") ?? "";
    const ct = res.headers.get("content-type") ?? "";
    let body: unknown;
    if (ct.includes("application/json")) {
      body = await res.json();
    } else {
      body = await res.text();
    }
    return { status: res.status, body, cookies: setCookie };
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

// Shortcut: register + login and return the cookie string. Skips ToS check?
// No — registerSchema requires tos_accepted: true, so we pass it here.
// Also marks email_verified_at so the user can publish/reserve in subsequent
// tests — the real flow requires a KV token round-trip we don't care about
// at this level.
export async function registerAndLogin(
  ctx: ReturnType<typeof buildTestApp>,
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

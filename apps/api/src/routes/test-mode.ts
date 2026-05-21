// /api/__test__/* — Playwright/E2E support endpoints.
//
// SAFETY: This module is only mounted by src/index.ts when BOTH:
//   * env.TEST_MODE === "true"
//   * env.ENVIRONMENT === "development"
// Anywhere else (any production deploy), the routes return 404.
//
// The endpoints are intentionally minimal: just enough to let E2E tests seed
// verified users, flip license flags, and inspect captured emails — without
// going through the slow real flows (email verification round-trip, admin
// approval, multipart license upload).
//
// In tests, mockSent is populated only when the email module has been mocked
// via vi.mock — which integration tests do but the real Worker does not. So
// during `wrangler dev` the mailbox endpoint reads from a separate Worker-side
// in-memory log that wraps `sendEmail` (see lib/email-test-log.ts).
import { Hono } from "hono";
import type { HonoEnv } from "../types";
import { setCookie } from "hono/cookie";
import { hashPassword } from "../lib/password";
import { signSession } from "../lib/jwt";
import { SESSION_COOKIE } from "./auth";
import { getTestEmailLog, clearTestEmailLog } from "../lib/email-test-log";

const route = new Hono<HonoEnv>();

// Hard guard: every request hits this middleware first. If TEST_MODE isn't on
// (or we're in production), pretend the entire namespace doesn't exist.
route.use("*", async (c, next) => {
  if (c.env.TEST_MODE !== "true" || c.env.ENVIRONMENT !== "development") {
    return c.json({ error: "not_found" }, 404);
  }
  return next();
});

// GET /api/__test__/emails — return captured outgoing emails.
// Optional ?since=ISO filters by timestamp.
route.get("/emails", async (c) => {
  const since = c.req.query("since");
  const all = getTestEmailLog();
  const filtered = since ? all.filter((e) => e.sentAt >= since) : all;
  return c.json({ emails: filtered, total: filtered.length });
});

// DELETE /api/__test__/emails — clear the mailbox.
route.delete("/emails", async (c) => {
  clearTestEmailLog();
  return c.json({ ok: true });
});

// POST /api/__test__/seed — create a verified user in one shot.
// Body: { email, password?, name?, license_verified?, identity_verified?, admin? }
// Returns: { user, cookie }
route.post("/seed", async (c) => {
  const body = (await c.req.json().catch(() => null)) as {
    email?: string;
    password?: string;
    name?: string;
    license_verified?: boolean;
    identity_verified?: boolean;
  } | null;
  if (!body?.email) return c.json({ error: "bad_request" }, 400);

  const password = body.password ?? "Test1234!";
  const name = body.name ?? "E2E User";

  const existing = await c.var.store.getUserByEmail(body.email);
  if (existing) {
    // Idempotent: just return the existing user + new session cookie.
    await c.var.store.markEmailVerified(existing.id);
    if (body.license_verified) {
      const u = await c.var.store.getUser(existing.id);
      if (u) (u as unknown as { license_verified: boolean }).license_verified = true;
    }
    const jwt = await signSession({ sub: existing.id, email: existing.email }, c.env.JWT_SECRET);
    setCookie(c, SESSION_COOKIE, jwt, { httpOnly: true, sameSite: "Lax", path: "/" });
    return c.json({ user: existing, seeded: false });
  }

  const { hash, salt } = await hashPassword(password);
  const user = await c.var.store.createUserWithPassword(body.email, name, hash, salt);
  await c.var.store.markEmailVerified(user.id);
  if (body.license_verified) {
    const u = await c.var.store.getUser(user.id);
    if (u) (u as unknown as { license_verified: boolean }).license_verified = true;
  }
  if (body.identity_verified) {
    const u = await c.var.store.getUser(user.id);
    if (u) (u as unknown as { identity_verified: boolean }).identity_verified = true;
  }

  const jwt = await signSession({ sub: user.id, email: user.email }, c.env.JWT_SECRET);
  setCookie(c, SESSION_COOKIE, jwt, { httpOnly: true, sameSite: "Lax", path: "/" });
  return c.json({ user, seeded: true }, 201);
});

// POST /api/__test__/verify-license — flip license_verified for a user (by email).
route.post("/verify-license", async (c) => {
  const body = (await c.req.json().catch(() => null)) as { email?: string } | null;
  if (!body?.email) return c.json({ error: "bad_request" }, 400);
  const u = await c.var.store.getUserByEmail(body.email);
  if (!u) return c.json({ error: "not_found" }, 404);
  (u as unknown as { license_verified: boolean }).license_verified = true;
  return c.json({ ok: true, user: u });
});

// POST /api/__test__/reset — empties the MemoryStore (no-op for Drizzle).
route.post("/reset", async (c) => {
  if (typeof (c.var.store as unknown as { __reset?: () => void }).__reset === "function") {
    (c.var.store as unknown as { __reset: () => void }).__reset();
  }
  clearTestEmailLog();
  return c.json({ ok: true });
});

export default route;

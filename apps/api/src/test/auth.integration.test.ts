import { describe, expect, it } from "vitest";
import { buildTestApp, extractSessionCookie, registerAndLogin } from "./helpers";

describe("POST /api/auth/register", () => {
  it("rejects when tos_accepted is missing", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "a@b.es", password: "Test1234!", name: "A" }),
    });
    expect(res.status).toBe(400);
  });

  it("rejects when tos_accepted is false", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "a@b.es", password: "Test1234!", name: "A", tos_accepted: false }),
    });
    expect(res.status).toBe(400);
  });

  it("rejects short passwords", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: "a@b.es", password: "short", name: "A", tos_accepted: true }),
    });
    expect(res.status).toBe(400);
  });

  it("creates the user, sets cookie, persists tos_accepted_at", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "ok@concertride.test",
        password: "Test1234!",
        name: "OK User",
        tos_accepted: true,
      }),
    });
    expect(res.status).toBe(201);
    const body = res.body as { ok: true; user: { id: string; email: string; tos_accepted_at: string | null } };
    expect(body.user.email).toBe("ok@concertride.test");
    expect(body.user.tos_accepted_at).toBeTruthy();
    expect(res.cookies).toContain("cr_session=");
  });

  it("rejects duplicate email with 409", async () => {
    const app = buildTestApp();
    const body = {
      email: "dup@concertride.test",
      password: "Test1234!",
      name: "Dup",
      tos_accepted: true,
    };
    const first = await app.request("/api/auth/register", { method: "POST", body: JSON.stringify(body) });
    expect(first.status).toBe(201);
    const second = await app.request("/api/auth/register", { method: "POST", body: JSON.stringify(body) });
    expect(second.status).toBe(409);
  });

  it("starts with email_verified_at = null", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "unverified@concertride.test",
        password: "Test1234!",
        name: "U",
        tos_accepted: true,
      }),
    });
    const body = res.body as { user: { email_verified_at: string | null } };
    expect(body.user.email_verified_at).toBeNull();
  });
});

describe("POST /api/auth/login", () => {
  it("succeeds with valid credentials", async () => {
    const app = buildTestApp();
    await app.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "login@concertride.test",
        password: "Test1234!",
        name: "L",
        tos_accepted: true,
      }),
    });
    const res = await app.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "login@concertride.test", password: "Test1234!" }),
    });
    expect(res.status).toBe(200);
    expect(res.cookies).toContain("cr_session=");
  });

  it("rejects wrong password with 401", async () => {
    const app = buildTestApp();
    await app.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "wrongpw@concertride.test",
        password: "Test1234!",
        name: "W",
        tos_accepted: true,
      }),
    });
    const res = await app.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "wrongpw@concertride.test", password: "wrong-password" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects non-existent email with 401 (no enumeration)", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "nobody@concertride.test", password: "anything" }),
    });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/auth/me", () => {
  it("returns null user when no cookie", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/me");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: null });
  });

  it("returns the user when authenticated", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "me@concertride.test");
    const res = await app.request("/api/auth/me", { cookies: cookie });
    expect(res.status).toBe(200);
    expect((res.body as { user: { email: string } }).user.email).toBe("me@concertride.test");
  });
});

describe("POST /api/auth/logout", () => {
  it("clears the session cookie", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/logout", { method: "POST" });
    expect(res.status).toBe(200);
    expect(res.cookies).toContain("cr_session=");
    expect(res.cookies).toMatch(/Max-Age=0|Expires=Thu, 01 Jan 1970/i);
  });
});

describe("DELETE /api/auth/me (GDPR erasure)", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/me", { method: "DELETE" });
    expect(res.status).toBe(401);
  });

  it("anonymises the user and clears the session cookie", async () => {
    const app = buildTestApp();
    const { cookie, userId } = await registerAndLogin(app, "bye@concertride.test");
    const res = await app.request("/api/auth/me", { method: "DELETE", cookies: cookie });
    expect(res.status).toBe(200);

    // After deletion the user's email has been anonymised and password removed
    const stored = await app.store.getUser(userId);
    expect(stored?.email).toMatch(/^deleted\+/);
    expect(stored?.name).toBe("Usuario eliminado");
    expect(stored?.deleted_at).toBeTruthy();
  });
});

describe("Email verification flow", () => {
  it("sets email_verified_at when the KV token is valid", async () => {
    const app = buildTestApp();
    await app.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "verify@concertride.test",
        password: "Test1234!",
        name: "V",
        tos_accepted: true,
      }),
    });
    // The register route puts a token into CACHE. We look it up and hit the verify endpoint.
    const keys = await app.kv.list();
    const tokenKey = keys.keys.find((k) => k.name.startsWith("everify:"))?.name;
    expect(tokenKey).toBeTruthy();
    const token = tokenKey!.slice("everify:".length);

    const res = await app.request(`/api/auth/verify-email?token=${token}`);
    expect(res.status).toBe(302);
    const loc = (res.body as string) || "";
    // redirect target is set via Location header but our helper doesn't expose
    // headers; we verify the user's email_verified_at was stamped.
    const user = await app.store.getUserByEmail("verify@concertride.test");
    expect(user?.email_verified_at).toBeTruthy();
    expect(loc).toBeDefined(); // redirect body is empty string in Hono
  });

  it("ignores unknown tokens gracefully", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/verify-email?token=nope");
    expect(res.status).toBe(302); // redirect to /?verify=expired
  });
});

describe("Password reset flow", () => {
  it("always returns 200 for forgot-password (no enumeration)", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "nobody@nowhere.test" }),
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("resets the password when the KV token is valid", async () => {
    const app = buildTestApp();
    await app.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "reset@concertride.test",
        password: "OldPass1!",
        name: "R",
        tos_accepted: true,
      }),
    });
    await app.request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "reset@concertride.test" }),
    });
    const keys = await app.kv.list();
    const tokenKey = keys.keys.find((k) => k.name.startsWith("pwreset:"))?.name;
    expect(tokenKey).toBeTruthy();
    const token = tokenKey!.slice("pwreset:".length);

    const res = await app.request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password: "NewPass1!" }),
    });
    expect(res.status).toBe(200);

    // New password works
    const login = await app.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "reset@concertride.test", password: "NewPass1!" }),
    });
    expect(login.status).toBe(200);
  });
});

describe("Rate limiter", () => {
  it("blocks excessive auth requests with 429", async () => {
    const app = buildTestApp();
    // authLimiter: 10/min per IP. Fire 11 quickly from the same IP.
    const headers = { "cf-connecting-ip": "198.51.100.7", "content-type": "application/json" };
    let lastStatus = 0;
    for (let i = 0; i < 12; i++) {
      const res = await app.request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "x@y.es", password: "z" }),
        headers,
      });
      lastStatus = res.status;
      if (res.status === 429) break;
    }
    expect(lastStatus).toBe(429);
  });
});

// Prevents unused-import complaints from the linter if a helper is borrowed
// later. Remove when used elsewhere.
void extractSessionCookie;

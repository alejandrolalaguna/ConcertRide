import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildTestApp,
  extractSessionCookie,
  registerAndLogin,
} from "./helpers";
import { clearSentEmails, mockSent } from "./mocks/email";

vi.mock("../lib/email", async () => {
  const mod = await import("./mocks/email");
  return mod.emailMockFactory();
});

beforeEach(() => {
  clearSentEmails();
});

describe("Password reset full flow", () => {
  it("forgot → token in KV → reset-password works, old password rejected", async () => {
    const app = buildTestApp();
    await app.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "flow-reset@concertride.test",
        password: "OldPass1!",
        name: "F",
        tos_accepted: true,
      }),
    });

    const forgot = await app.request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "flow-reset@concertride.test" }),
    });
    expect(forgot.status).toBe(200);

    await app.flush();

    const keys = await app.kv.list({ prefix: "pwreset:" });
    const tokenKey = keys.keys[0]?.name;
    expect(tokenKey).toBeTruthy();
    const token = tokenKey!.slice("pwreset:".length);

    const reset = await app.request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password: "NewSecret9!" }),
    });
    expect(reset.status).toBe(200);

    const loginOld = await app.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "flow-reset@concertride.test", password: "OldPass1!" }),
    });
    expect(loginOld.status).toBe(401);

    const loginNew = await app.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "flow-reset@concertride.test", password: "NewSecret9!" }),
    });
    expect(loginNew.status).toBe(200);
  });

  it("reset-password with unknown token returns 400", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: "deadbeefdeadbeefdeadbeefdeadbeef", password: "NewPass1!" }),
    });
    expect(res.status).toBe(400);
  });

  it("reset-password with malformed token returns 400", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: "short", password: "NewPass1!" }),
    });
    expect(res.status).toBe(400);
  });

  it("forgot-password enqueues a password_reset email when user exists", async () => {
    const app = buildTestApp();
    await app.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "reset-email@concertride.test",
        password: "OldPass1!",
        name: "RE",
        tos_accepted: true,
      }),
    });
    clearSentEmails();
    await app.request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "reset-email@concertride.test" }),
    });
    await app.flush();
    const reset = mockSent.filter((m) => m.template === "password_reset");
    expect(reset.length).toBeGreaterThanOrEqual(1);
    expect(reset[0]!.to).toBe("reset-email@concertride.test");
    expect((reset[0]!.payload as { url: string }).url).toMatch(/reset-password\?token=/);
  });

  it("forgot-password is silent for unknown email (no enumeration, no email enqueued)", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: "ghost@nowhere.test" }),
    });
    expect(res.status).toBe(200);
    await app.flush();
    const reset = mockSent.filter((m) => m.template === "password_reset");
    expect(reset).toHaveLength(0);
  });
});

describe("Verify-email error cases", () => {
  it("GET with empty token returns 400", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/verify-email?token=");
    expect(res.status).toBe(400);
  });

  it("GET with unknown token returns 400 valid:false", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/verify-email?token=zzz-not-real");
    expect(res.status).toBe(400);
    expect((res.body as { valid: boolean }).valid).toBe(false);
  });

  it("POST with no body redirects with verify=invalid", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/verify-email", { method: "POST" });
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toMatch(/verify=invalid/);
  });

  it("POST with unknown token redirects with verify=expired", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token: "nope-nope-nope" }),
    });
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toMatch(/verify=expired/);
  });
});

describe("GET /api/auth/me", () => {
  it("returns {user:null} when no cookie present", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/me");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: null });
  });

  it("returns the user when authenticated", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "auth-me@concertride.test");
    const res = await app.request("/api/auth/me", { cookies: cookie });
    expect(res.status).toBe(200);
    const body = res.body as { user: { email: string } };
    expect(body.user.email).toBe("auth-me@concertride.test");
  });

  it("returns {user:null} when cookie is garbage", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/me", { cookies: "cr_session=not-a-real-jwt" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: null });
  });
});

describe("PATCH /api/auth/profile validation", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify({ name: "Hacker" }),
    });
    expect(res.status).toBe(401);
  });

  it("accepts name within 1-80 chars", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-name@concertride.test");
    const res = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ name: "Nuevo Nombre" }),
    });
    expect(res.status).toBe(200);
    expect((res.body as { user: { name: string } }).user.name).toBe("Nuevo Nombre");
  });

  it("rejects empty name (min 1)", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-empty@concertride.test");
    const res = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ name: "" }),
    });
    expect(res.status).toBe(400);
  });

  it("rejects name over 80 chars", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-long@concertride.test");
    const res = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ name: "a".repeat(81) }),
    });
    expect(res.status).toBe(400);
  });

  it("accepts phone <= 20 chars and rejects > 20", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-phone@concertride.test");
    const ok = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ phone: "+34 666 111 222" }),
    });
    expect(ok.status).toBe(200);

    const bad = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ phone: "1".repeat(21) }),
    });
    expect(bad.status).toBe(400);
  });

  it("accepts null phone (allows unsetting)", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-null@concertride.test");
    const res = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ phone: null }),
    });
    expect(res.status).toBe(200);
  });

  it("accepts home_city <= 80, rejects > 80", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-city@concertride.test");
    const ok = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ home_city: "Madrid" }),
    });
    expect(ok.status).toBe(200);

    const bad = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ home_city: "M".repeat(81) }),
    });
    expect(bad.status).toBe(400);
  });

  it("accepts smoker bool|null", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-smoker@concertride.test");
    for (const value of [true, false, null]) {
      const res = await app.request("/api/auth/profile", {
        method: "PATCH",
        cookies: cookie,
        body: JSON.stringify({ smoker: value }),
      });
      expect(res.status).toBe(200);
    }
  });

  it("rejects smoker as a string", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-smoker-bad@concertride.test");
    const res = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ smoker: "yes" }),
    });
    expect(res.status).toBe(400);
  });

  it("accepts has_license bool|null", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-hl@concertride.test");
    for (const value of [true, false, null]) {
      const res = await app.request("/api/auth/profile", {
        method: "PATCH",
        cookies: cookie,
        body: JSON.stringify({ has_license: value }),
      });
      expect(res.status).toBe(200);
    }
  });

  it("rejects car_model > 80 chars", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-car@concertride.test");
    const ok = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ car_model: "SEAT León" }),
    });
    expect(ok.status).toBe(200);

    const bad = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ car_model: "x".repeat(81) }),
    });
    expect(bad.status).toBe(400);
  });

  it("rejects car_color > 40 chars", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-color@concertride.test");
    const bad = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ car_color: "x".repeat(41) }),
    });
    expect(bad.status).toBe(400);
  });

  it("accepts bio up to 200 chars, rejects 201", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-bio@concertride.test");
    const ok = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ bio: "a".repeat(200) }),
    });
    expect(ok.status).toBe(200);

    const bad = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ bio: "a".repeat(201) }),
    });
    expect(bad.status).toBe(400);
  });

  it("accepts up to 8 music_genres, rejects 9", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-genres@concertride.test");
    const ok = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ music_genres: ["a", "b", "c", "d", "e", "f", "g", "h"] }),
    });
    expect(ok.status).toBe(200);

    const bad = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ music_genres: ["a", "b", "c", "d", "e", "f", "g", "h", "i"] }),
    });
    expect(bad.status).toBe(400);
  });

  it("rejects music_genre item > 40 chars", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-genres-long@concertride.test");
    const bad = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ music_genres: ["x".repeat(41)] }),
    });
    expect(bad.status).toBe(400);
  });

  it("accepts up to 10 top_artists, rejects 11", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-artists@concertride.test");
    const ten = Array.from({ length: 10 }, (_, i) => `Artist ${i}`);
    const ok = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ top_artists: ten }),
    });
    expect(ok.status).toBe(200);

    const bad = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ top_artists: [...ten, "extra"] }),
    });
    expect(bad.status).toBe(400);
  });

  it("rejects top_artists item > 80 chars", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-artists-long@concertride.test");
    const bad = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ top_artists: ["a".repeat(81)] }),
    });
    expect(bad.status).toBe(400);
  });

  it("accepts handle matching /^[a-z0-9_]+$/i", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-handle@concertride.test");
    const res = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ handle: "Lucia_99" }),
    });
    expect(res.status).toBe(200);
  });

  it("rejects handle with hyphen or symbols", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-handle-bad@concertride.test");
    const res = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ handle: "lucia-99" }),
    });
    expect(res.status).toBe(400);
  });

  it("rejects handle > 24 chars", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "p-handle-long@concertride.test");
    const res = await app.request("/api/auth/profile", {
      method: "PATCH",
      cookies: cookie,
      body: JSON.stringify({ handle: "x".repeat(25) }),
    });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/logout", () => {
  it("returns 200 and a cleared cookie", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/logout", { method: "POST" });
    expect(res.status).toBe(200);
    expect(res.cookies).toContain("cr_session=");
    expect(res.cookies).toMatch(/Max-Age=0|Expires=Thu, 01 Jan 1970/i);
  });
});

describe("DELETE /api/auth/me — account deletion", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/me", { method: "DELETE" });
    expect(res.status).toBe(401);
  });

  it("anonymises the user, clears cookie, and prevents re-login", async () => {
    const app = buildTestApp();
    const { cookie, userId } = await registerAndLogin(app, "delete-me@concertride.test");

    const del = await app.request("/api/auth/me", { method: "DELETE", cookies: cookie });
    expect(del.status).toBe(200);
    expect(del.cookies).toMatch(/Max-Age=0|Expires=Thu, 01 Jan 1970/i);

    const stored = await app.store.getUser(userId);
    expect(stored?.email).toMatch(/^deleted\+/);
    expect(stored?.deleted_at).toBeTruthy();

    const login = await app.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "delete-me@concertride.test", password: "Test1234!" }),
    });
    expect(login.status).toBe(401);
  });
});

describe("Phone OTP flow", () => {
  it("send-phone-otp requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/send-phone-otp", {
      method: "POST",
      body: JSON.stringify({ phone: "+34666111222" }),
    });
    expect(res.status).toBe(401);
  });

  it("send → KV gets phone_otp:{userId} → verify completes", async () => {
    const app = buildTestApp();
    const { cookie, userId } = await registerAndLogin(app, "otp@concertride.test");

    const send = await app.request("/api/auth/send-phone-otp", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ phone: "+34666111222" }),
    });
    expect(send.status).toBe(200);
    const sendBody = send.body as { ok: boolean; otp?: string };
    expect(sendBody.ok).toBe(true);
    expect(sendBody.otp).toMatch(/^\d{6}$/);

    const stored = await app.kv.get(`phone_otp:${userId}`);
    expect(stored).toBeTruthy();

    const verify = await app.request("/api/auth/verify-phone-otp", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ otp: sendBody.otp }),
    });
    expect(verify.status).toBe(200);
    const stillStored = await app.kv.get(`phone_otp:${userId}`);
    expect(stillStored).toBeNull();
  });

  it("verify with wrong otp returns 400", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "otp-wrong@concertride.test");
    await app.request("/api/auth/send-phone-otp", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ phone: "+34666111223" }),
    });

    const verify = await app.request("/api/auth/verify-phone-otp", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ otp: "000000" }),
    });
    expect(verify.status).toBe(400);
  });

  it("verify with no OTP stored returns 410", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "otp-none@concertride.test");
    const verify = await app.request("/api/auth/verify-phone-otp", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ otp: "123456" }),
    });
    expect(verify.status).toBe(410);
  });

  it("verify with malformed otp body returns 400", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "otp-malformed@concertride.test");
    const verify = await app.request("/api/auth/verify-phone-otp", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ otp: "abc" }),
    });
    expect(verify.status).toBe(400);
  });
});

void extractSessionCookie;

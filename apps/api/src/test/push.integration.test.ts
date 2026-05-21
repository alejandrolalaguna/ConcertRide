import { describe, expect, it } from "vitest";
import { buildTestApp, registerAndLogin } from "./helpers";

describe("GET /api/push/vapid-public-key", () => {
  it("returns the configured VAPID key (empty in tests)", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/push/vapid-public-key");
    expect(res.status).toBe(200);
    expect((res.body as { key: string }).key).toBe("");
  });
});

describe("POST /api/push/subscribe", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/push/subscribe", {
      method: "POST",
      body: JSON.stringify({
        endpoint: "https://fcm.googleapis.com/fcm/send/abc",
        p256dh: "BASE64KEY",
        auth: "AUTH",
      }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects when endpoint is not a URL", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `push-${Math.random()}@cr.test`);
    const res = await app.request("/api/push/subscribe", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ endpoint: "not-a-url", p256dh: "k", auth: "a" }),
    });
    expect(res.status).toBe(400);
  });

  it("stores a subscription with a valid VAPID-shaped payload", async () => {
    const app = buildTestApp();
    const { cookie, userId } = await registerAndLogin(app, `push2-${Math.random()}@cr.test`);
    const res = await app.request("/api/push/subscribe", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({
        endpoint: "https://fcm.googleapis.com/fcm/send/xyz",
        p256dh: "BASE64KEY",
        auth: "AUTH",
      }),
    });
    expect(res.status).toBe(200);
    expect((res.body as { ok: boolean }).ok).toBe(true);
    const subs = await app.store.getPushSubscriptionsForUser(userId);
    expect(subs.length).toBe(1);
  });
});

describe("POST /api/push/unsubscribe", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/push/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ endpoint: "https://x" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects when endpoint is missing", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `push3-${Math.random()}@cr.test`);
    const res = await app.request("/api/push/unsubscribe", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it("removes a previously stored subscription", async () => {
    const app = buildTestApp();
    const { cookie, userId } = await registerAndLogin(app, `push4-${Math.random()}@cr.test`);
    const endpoint = "https://fcm.googleapis.com/fcm/send/will-be-removed";
    await app.request("/api/push/subscribe", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ endpoint, p256dh: "K", auth: "A" }),
    });
    const res = await app.request("/api/push/unsubscribe", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ endpoint }),
    });
    expect(res.status).toBe(200);
    const subs = await app.store.getPushSubscriptionsForUser(userId);
    expect(subs.length).toBe(0);
  });
});

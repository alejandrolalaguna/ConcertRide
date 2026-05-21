import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildTestApp,
  makeUploadFile,
  multipart,
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

// Tiny but valid-ish JPEG bytes (SOI + EOI markers). Big enough to be parsed
// by undici FormData but not large enough to trip the 10MB cap.
const JPEG_BYTES = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0xff, 0xd9]);

describe("POST /api/auth/verify-license", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const fd = multipart({ document: makeUploadFile("dni.jpg", "image/jpeg", JPEG_BYTES) });
    const res = await app.request("/api/auth/verify-license", { method: "POST", body: fd });
    expect(res.status).toBe(401);
  });

  it("accepts a valid JPG, returns pending, stores doc in KV with 90d TTL", async () => {
    const app = buildTestApp();
    const { cookie, userId } = await registerAndLogin(app, "license-jpg@concertride.test");

    const fd = multipart({ document: makeUploadFile("carnet.jpg", "image/jpeg", JPEG_BYTES) });
    const res = await app.request("/api/auth/verify-license", {
      method: "POST",
      cookies: cookie,
      body: fd,
    });
    expect(res.status).toBe(200);
    const body = res.body as { ok: true; status: string; review_id: string };
    expect(body.ok).toBe(true);
    expect(body.status).toBe("pending");
    expect(body.review_id).toBeTruthy();

    const keys = await app.kv.list({ prefix: `license_doc:${userId}:` });
    expect(keys.keys.length).toBe(1);
    expect(keys.keys[0]!.name).toMatch(/\.jpeg$/);
  });

  it("accepts PNG", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "license-png@concertride.test");
    const fd = multipart({ document: makeUploadFile("carnet.png", "image/png", JPEG_BYTES) });
    const res = await app.request("/api/auth/verify-license", { method: "POST", cookies: cookie, body: fd });
    expect(res.status).toBe(200);
  });

  it("accepts WEBP", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "license-webp@concertride.test");
    const fd = multipart({ document: makeUploadFile("carnet.webp", "image/webp", JPEG_BYTES) });
    const res = await app.request("/api/auth/verify-license", { method: "POST", cookies: cookie, body: fd });
    expect(res.status).toBe(200);
  });

  it("accepts PDF", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "license-pdf@concertride.test");
    const fd = multipart({ document: makeUploadFile("carnet.pdf", "application/pdf", JPEG_BYTES) });
    const res = await app.request("/api/auth/verify-license", { method: "POST", cookies: cookie, body: fd });
    expect(res.status).toBe(200);
  });

  it("rejects text/plain with 400", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "license-txt@concertride.test");
    const fd = multipart({ document: makeUploadFile("carnet.txt", "text/plain", "hola") });
    const res = await app.request("/api/auth/verify-license", { method: "POST", cookies: cookie, body: fd });
    expect(res.status).toBe(400);
  });

  it("rejects files larger than 10 MB with 400", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "license-big@concertride.test");
    const big = new Uint8Array(10 * 1024 * 1024 + 1);
    const fd = multipart({ document: makeUploadFile("big.jpg", "image/jpeg", big) });
    const res = await app.request("/api/auth/verify-license", { method: "POST", cookies: cookie, body: fd });
    expect(res.status).toBe(400);
  });

  it("rejects missing document field with 400", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "license-missing@concertride.test");
    const fd = multipart({});
    const res = await app.request("/api/auth/verify-license", { method: "POST", cookies: cookie, body: fd });
    expect(res.status).toBe(400);
  });

  it("enqueues a license_review_admin email when SUPPORT_EMAIL is configured", async () => {
    const app = buildTestApp({ SUPPORT_EMAIL: "admin@concertride.test" });
    const { cookie } = await registerAndLogin(app, "license-email@concertride.test");
    const fd = multipart({ document: makeUploadFile("carnet.jpg", "image/jpeg", JPEG_BYTES) });
    await app.request("/api/auth/verify-license", { method: "POST", cookies: cookie, body: fd });

    // The route calls the email function but does not waitUntil, so we need
    // to give the floating promise a microtask to settle.
    await new Promise((r) => setImmediate(r));

    const sent = mockSent.filter((m) => m.template === "license_review_admin");
    expect(sent.length).toBeGreaterThanOrEqual(1);
    expect(sent[0]!.to).toBe("admin@concertride.test");
  });
});

describe("GET /api/auth/verify-license/status", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/verify-license/status");
    expect(res.status).toBe(401);
  });

  it("returns review:null before any upload", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "license-status-none@concertride.test");
    const res = await app.request("/api/auth/verify-license/status", { cookies: cookie });
    expect(res.status).toBe(200);
    expect((res.body as { review: unknown }).review).toBeNull();
  });

  it("returns review with status=pending after upload", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "license-status-pending@concertride.test");
    const fd = multipart({ document: makeUploadFile("carnet.jpg", "image/jpeg", JPEG_BYTES) });
    await app.request("/api/auth/verify-license", { method: "POST", cookies: cookie, body: fd });

    const res = await app.request("/api/auth/verify-license/status", { cookies: cookie });
    expect(res.status).toBe(200);
    const body = res.body as { review: { status: string } | null };
    expect(body.review?.status).toBe("pending");
  });
});

describe("POST /api/auth/verify-identity", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const fd = multipart({ document: makeUploadFile("dni.jpg", "image/jpeg", JPEG_BYTES) });
    const res = await app.request("/api/auth/verify-identity", { method: "POST", body: fd });
    expect(res.status).toBe(401);
  });

  it("accepts a valid JPG, returns pending, stores doc in KV", async () => {
    const app = buildTestApp();
    const { cookie, userId } = await registerAndLogin(app, "identity-jpg@concertride.test");
    const fd = multipart({ document: makeUploadFile("dni.jpg", "image/jpeg", JPEG_BYTES) });
    const res = await app.request("/api/auth/verify-identity", { method: "POST", cookies: cookie, body: fd });
    expect(res.status).toBe(200);
    const body = res.body as { ok: true; status: string; review_id: string };
    expect(body.status).toBe("pending");

    const keys = await app.kv.list({ prefix: `identity_doc:${userId}:` });
    expect(keys.keys.length).toBe(1);
  });

  it("rejects text/plain", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "identity-txt@concertride.test");
    const fd = multipart({ document: makeUploadFile("dni.txt", "text/plain", "hola") });
    const res = await app.request("/api/auth/verify-identity", { method: "POST", cookies: cookie, body: fd });
    expect(res.status).toBe(400);
  });

  it("rejects files larger than 10 MB", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "identity-big@concertride.test");
    const big = new Uint8Array(10 * 1024 * 1024 + 1);
    const fd = multipart({ document: makeUploadFile("big.jpg", "image/jpeg", big) });
    const res = await app.request("/api/auth/verify-identity", { method: "POST", cookies: cookie, body: fd });
    expect(res.status).toBe(400);
  });

  it("enqueues an identity_review_admin email when SUPPORT_EMAIL is configured", async () => {
    const app = buildTestApp({ SUPPORT_EMAIL: "admin@concertride.test" });
    const { cookie } = await registerAndLogin(app, "identity-email@concertride.test");
    const fd = multipart({ document: makeUploadFile("dni.jpg", "image/jpeg", JPEG_BYTES) });
    await app.request("/api/auth/verify-identity", { method: "POST", cookies: cookie, body: fd });
    await new Promise((r) => setImmediate(r));
    const sent = mockSent.filter((m) => m.template === "identity_review_admin");
    expect(sent.length).toBeGreaterThanOrEqual(1);
    expect(sent[0]!.to).toBe("admin@concertride.test");
  });
});

describe("GET /api/auth/verify-identity/status", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/verify-identity/status");
    expect(res.status).toBe(401);
  });

  it("returns null before upload, pending after", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "identity-status@concertride.test");
    const before = await app.request("/api/auth/verify-identity/status", { cookies: cookie });
    expect((before.body as { review: unknown }).review).toBeNull();

    const fd = multipart({ document: makeUploadFile("dni.jpg", "image/jpeg", JPEG_BYTES) });
    await app.request("/api/auth/verify-identity", { method: "POST", cookies: cookie, body: fd });

    const after = await app.request("/api/auth/verify-identity/status", { cookies: cookie });
    expect((after.body as { review: { status: string } }).review.status).toBe("pending");
  });
});

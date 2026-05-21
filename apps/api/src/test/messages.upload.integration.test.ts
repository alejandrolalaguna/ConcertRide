import { describe, expect, it } from "vitest";
import { buildTestApp, makeUploadFile, multipart, registerAndLogin } from "./helpers";

describe("POST /api/messages/upload", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/messages/upload", {
      method: "POST",
      body: multipart({ photo: makeUploadFile("a.jpg", "image/jpeg", new Uint8Array([0xff, 0xd8, 0xff])) }),
    });
    expect(res.status).toBe(401);
  });

  for (const [name, mime] of [
    ["a.jpg", "image/jpeg"],
    ["a.png", "image/png"],
    ["a.webp", "image/webp"],
    ["a.gif", "image/gif"],
  ] as const) {
    it(`accepts ${mime} and returns a /api/messages/media/<id> url`, async () => {
      const app = buildTestApp();
      const { cookie } = await registerAndLogin(app, `upload-${mime.replace("/", "-")}@test.es`);
      const res = await app.request("/api/messages/upload", {
        method: "POST",
        cookies: cookie,
        body: multipart({ photo: makeUploadFile(name, mime, new Uint8Array(100)) }),
      });
      expect(res.status).toBe(201);
      const body = res.body as { url: string };
      expect(body.url).toMatch(/^\/api\/messages\/media\/[0-9a-f]+$/);
    });
  }

  it("rejects text/plain with 400", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "upload-text@test.es");
    const res = await app.request("/api/messages/upload", {
      method: "POST",
      cookies: cookie,
      body: multipart({ photo: makeUploadFile("a.txt", "text/plain", "hello") }),
    });
    expect(res.status).toBe(400);
  });

  it("rejects files over 4MB with 400", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "upload-big@test.es");
    const big = new Uint8Array(4.5 * 1024 * 1024);
    const res = await app.request("/api/messages/upload", {
      method: "POST",
      cookies: cookie,
      body: multipart({ photo: makeUploadFile("big.jpg", "image/jpeg", big) }),
    });
    expect(res.status).toBe(400);
  });

  it("rejects when no photo field is present", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "upload-missing@test.es");
    const res = await app.request("/api/messages/upload", {
      method: "POST",
      cookies: cookie,
      body: multipart({}),
    });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/messages/media/:id", () => {
  it("returns the file bytes with the original content-type after upload", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "media-get@test.es");
    const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
    const up = await app.request("/api/messages/upload", {
      method: "POST",
      cookies: cookie,
      body: multipart({ photo: makeUploadFile("p.jpg", "image/jpeg", bytes) }),
    });
    expect(up.status).toBe(201);
    const url = (up.body as { url: string }).url;

    const get = await app.request(url);
    expect(get.status).toBe(200);
    expect(get.headers.get("content-type")).toBe("image/jpeg");
    const arr = new Uint8Array(get.body as ArrayBuffer);
    expect(Array.from(arr)).toEqual(Array.from(bytes));
  });

  it("returns 404 for an unknown media id", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/messages/media/deadbeef0000");
    expect(res.status).toBe(404);
  });
});

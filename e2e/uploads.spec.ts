import { expect, test } from "@playwright/test";

const API = "http://127.0.0.1:8787";

async function isTestModeEnabled(request: import("@playwright/test").APIRequestContext): Promise<boolean> {
  const res = await request.get(`${API}/api/__test__/emails`);
  return res.status() === 200;
}

async function seedSession(
  request: import("@playwright/test").APIRequestContext,
  email: string,
): Promise<string> {
  const res = await request.post(`${API}/api/__test__/seed`, {
    data: { email, password: "Test1234!", name: "Upload User" },
    headers: { "content-type": "application/json" },
  });
  expect([200, 201]).toContain(res.status());
  const setCookie = res.headers()["set-cookie"] ?? "";
  const match = /cr_session=([^;]+)/.exec(setCookie);
  return match ? `cr_session=${match[1]}` : "";
}

test("license upload accepts a JPG", async ({ request }) => {
  const testMode = await isTestModeEnabled(request);
  test.skip(!testMode, "TEST_MODE=true required");

  const cookie = await seedSession(request, `upload-jpg-${Date.now()}@concertride.test`);

  const res = await request.post(`${API}/api/auth/verify-license`, {
    multipart: { document: { name: "carnet.jpg", mimeType: "image/jpeg", buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0xff, 0xd9]) } },
    headers: { cookie },
  });
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.status).toBe("pending");
});

test("license upload rejects text/plain with 400", async ({ request }) => {
  const testMode = await isTestModeEnabled(request);
  test.skip(!testMode, "TEST_MODE=true required");

  const cookie = await seedSession(request, `upload-txt-${Date.now()}@concertride.test`);
  const res = await request.post(`${API}/api/auth/verify-license`, {
    multipart: { document: { name: "carnet.txt", mimeType: "text/plain", buffer: Buffer.from("hola") } },
    headers: { cookie },
  });
  expect(res.status()).toBe(400);
});

test("identity upload accepts a PDF and rejects oversized files", async ({ request }) => {
  const testMode = await isTestModeEnabled(request);
  test.skip(!testMode, "TEST_MODE=true required");

  const cookie = await seedSession(request, `id-pdf-${Date.now()}@concertride.test`);

  const ok = await request.post(`${API}/api/auth/verify-identity`, {
    multipart: { document: { name: "dni.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n%test\n") } },
    headers: { cookie },
  });
  expect(ok.status()).toBe(200);

  const big = Buffer.alloc(10 * 1024 * 1024 + 1);
  const bad = await request.post(`${API}/api/auth/verify-identity`, {
    multipart: { document: { name: "big.jpg", mimeType: "image/jpeg", buffer: big } },
    headers: { cookie },
  });
  expect(bad.status()).toBe(400);
});

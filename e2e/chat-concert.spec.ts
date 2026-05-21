import { expect, test, type BrowserContext } from "@playwright/test";

const FIXTURE_CONCERT_ID = "c_rosalia_wizink";
const API = "http://127.0.0.1:8787";

// Seeds a verified user via the __test__ endpoint. Cookies are scoped by
// domain (not port), so the cookie set on the 127.0.0.1 API host is
// automatically visible to the 127.0.0.1 web host.
async function seedUser(context: BrowserContext, email: string, name: string) {
  const res = await context.request.post(`${API}/api/__test__/seed`, {
    data: { email, name, license_verified: true },
  });
  if (![200, 201].includes(res.status())) {
    throw new Error(
      `__test__/seed returned ${res.status()}. Is TEST_MODE=true in .dev.vars?`,
    );
  }
}

test.describe("Concert chat — two users converge on the same concert page", () => {
  test("user A posts and user B sees the message after reload", async ({ browser }) => {
    const ctxA = await browser.newContext();
    const ctxB = await browser.newContext();

    const stamp = Date.now();
    await seedUser(ctxA, `cc-a-${stamp}@e2e.test`, "AliceCC");
    await seedUser(ctxB, `cc-b-${stamp}@e2e.test`, "BobCC");

    const pageA = await ctxA.newPage();
    const pageB = await ctxB.newPage();

    await pageA.goto(`/concerts/${FIXTURE_CONCERT_ID}`);
    await pageB.goto(`/concerts/${FIXTURE_CONCERT_ID}`);

    const messageText = `Hola fans ${stamp}`;
    const inputA = pageA.getByPlaceholder(/escribe un mensaje/i).first();
    await expect(inputA).toBeVisible({ timeout: 15_000 });
    await inputA.fill(messageText);
    await pageA.getByRole("button", { name: /enviar mensaje/i }).first().click();

    await expect(pageA.getByText(messageText)).toBeVisible({ timeout: 10_000 });

    // B reloads and should see A's message
    await pageB.reload();
    await expect(pageB.getByText(messageText)).toBeVisible({ timeout: 15_000 });

    await ctxA.close();
    await ctxB.close();
  });

  test("user A uploads a photo and both users see it", async ({ browser }) => {
    const ctxA = await browser.newContext();
    const ctxB = await browser.newContext();

    const stamp = Date.now();
    await seedUser(ctxA, `ccpic-a-${stamp}@e2e.test`, "AlicePIC");
    await seedUser(ctxB, `ccpic-b-${stamp}@e2e.test`, "BobPIC");

    const pageA = await ctxA.newPage();
    const pageB = await ctxB.newPage();

    await pageA.goto(`/concerts/${FIXTURE_CONCERT_ID}`);
    await pageB.goto(`/concerts/${FIXTURE_CONCERT_ID}`);

    await expect(pageA.getByPlaceholder(/escribe un mensaje/i).first()).toBeVisible({
      timeout: 15_000,
    });

    // Hidden file input — we set files directly on it
    const fileInput = pageA.locator('input[type="file"][accept*="image"]').first();
    await fileInput.setInputFiles({
      name: "photo.jpg",
      mimeType: "image/jpeg",
      // Minimal JPEG byte preamble — enough for the upload route to accept it
      buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]),
    });

    await pageA.getByRole("button", { name: /enviar mensaje/i }).first().click();

    // Photo bubble renders an img inside a button with this aria-label
    await expect(
      pageA.getByRole("button", { name: /ver foto en tamaño completo/i }).first(),
    ).toBeVisible({ timeout: 15_000 });

    await pageB.reload();
    await expect(
      pageB.getByRole("button", { name: /ver foto en tamaño completo/i }).first(),
    ).toBeVisible({ timeout: 15_000 });

    await ctxA.close();
    await ctxB.close();
  });
});

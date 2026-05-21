import { expect, test } from "@playwright/test";

const API = "http://127.0.0.1:8787";

async function isTestModeEnabled(request: import("@playwright/test").APIRequestContext): Promise<boolean> {
  const res = await request.get(`${API}/api/__test__/emails`);
  return res.status() === 200;
}

async function seedAndLogin(
  request: import("@playwright/test").APIRequestContext,
  context: import("@playwright/test").BrowserContext,
  email: string,
): Promise<void> {
  const res = await request.post(`${API}/api/__test__/seed`, {
    data: { email, password: "Test1234!", name: "Profile User", license_verified: false },
    headers: { "content-type": "application/json" },
  });
  expect([200, 201]).toContain(res.status());
  // The seed response sets cr_session via Set-Cookie. Mirror it into the
  // browser context so the page is authenticated.
  const setCookie = res.headers()["set-cookie"];
  if (setCookie) {
    const match = /cr_session=([^;]+)/.exec(setCookie);
    if (match) {
      await context.addCookies([
        {
          name: "cr_session",
          value: match[1]!,
          domain: "127.0.0.1",
          path: "/",
          httpOnly: true,
          sameSite: "Lax",
        },
      ]);
    }
  }
}

test("editing the bio and saving persists across reload", async ({ page, request, context }) => {
  const testMode = await isTestModeEnabled(request);
  test.skip(!testMode, "TEST_MODE=true required for /api/__test__/seed");

  const email = `profile-${Date.now()}@concertride.test`;
  await seedAndLogin(request, context, email);

  await page.goto("/profile");
  await expect(page.getByRole("heading", { name: /Mi perfil/i })).toBeVisible({ timeout: 15_000 });

  const newBio = `E2E bio ${Date.now()}`;
  const bioField = page.locator("textarea").first();
  await bioField.fill(newBio);

  await page.getByRole("button", { name: /Guardar cambios/i }).click();
  await expect(page.getByText(/Guardado/i)).toBeVisible({ timeout: 10_000 });

  await page.reload();
  await expect(page.locator("textarea").first()).toHaveValue(newBio);
});

test("license upload shows a pending badge after submitting", async ({ page, request, context }) => {
  const testMode = await isTestModeEnabled(request);
  test.skip(!testMode, "TEST_MODE=true required for /api/__test__/seed");

  const email = `license-${Date.now()}@concertride.test`;
  await seedAndLogin(request, context, email);

  await page.goto("/profile");
  await expect(page.getByRole("heading", { name: /Mi perfil/i })).toBeVisible({ timeout: 15_000 });

  // Locate the license file input (accept includes image/jpeg + pdf).
  const fileInput = page.locator('input[type="file"][accept*="image/jpeg"]').first();
  await fileInput.setInputFiles({
    name: "carnet.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0xff, 0xd9]),
  });

  await page.getByRole("button", { name: /Confirmar y enviar/i }).first().click();
  await expect(page.getByText(/Pendiente de aprobación/i).first()).toBeVisible({ timeout: 10_000 });
});

import { expect, test } from "@playwright/test";

const API = "http://127.0.0.1:8787";

async function isTestModeEnabled(request: import("@playwright/test").APIRequestContext): Promise<boolean> {
  const res = await request.get(`${API}/api/__test__/emails`);
  return res.status() === 200;
}

test("login with wrong password shows an error", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("tu@email.com").fill("nobody-exists@concertride.test");
  await page.getByPlaceholder("••••••••").fill("WrongPass1!");
  await page.getByRole("button", { name: /^Entrar$/i }).click();
  await expect(page.getByRole("alert")).toContainText(/incorrectos/i, { timeout: 10_000 });
});

test("logout clears the session and reveals the login page", async ({ page }) => {
  const email = `logout-${Date.now()}@concertride.test`;
  const password = "TestPass123!";

  await page.goto("/register");
  await page.getByPlaceholder("Tu nombre").fill("Logout User");
  await page.getByPlaceholder("tu@email.com").fill(email);
  await page.getByPlaceholder("••••••••").fill(password);
  for (const cb of await page.getByRole("checkbox").all()) {
    await cb.check();
  }
  await page.getByRole("button", { name: /Crear cuenta/i }).click();
  await page.waitForURL((url) => !/\/register/.test(url.pathname), { timeout: 15_000 });

  await page.getByRole("button", { name: /Logout/i }).click();
  await page.getByRole("menuitem", { name: /Cerrar sesión/i }).click();

  // Cookie cleared → visiting /publish redirects to /login.
  await page.goto("/publish");
  await page.waitForURL(/\/login/, { timeout: 10_000 });
  await expect(page.getByPlaceholder("tu@email.com")).toBeVisible();
});

test("forgot-password flow sends a reset email and allows resetting", async ({ page, request }) => {
  const testMode = await isTestModeEnabled(request);
  test.skip(!testMode, "TEST_MODE=true required for mailbox capture");

  const email = `forgot-${Date.now()}@concertride.test`;
  const password = "Original1!";
  const newPassword = "NuevoSecret9!";

  // Register first so the email exists in the system.
  await page.goto("/register");
  await page.getByPlaceholder("Tu nombre").fill("Forgot User");
  await page.getByPlaceholder("tu@email.com").fill(email);
  await page.getByPlaceholder("••••••••").fill(password);
  for (const cb of await page.getByRole("checkbox").all()) {
    await cb.check();
  }
  await page.getByRole("button", { name: /Crear cuenta/i }).click();
  await page.waitForURL((url) => !/\/register/.test(url.pathname), { timeout: 15_000 });

  // Log out before requesting a reset.
  await request.post(`${API}/api/auth/logout`);
  await request.delete(`${API}/api/__test__/emails`);

  // Trigger forgot-password.
  const since = new Date().toISOString();
  await request.post(`${API}/api/auth/forgot-password`, {
    data: { email },
    headers: { "content-type": "application/json" },
  });

  // Poll the mailbox for the reset email.
  let resetEmail: { payload: { url?: string } } | undefined;
  for (let i = 0; i < 10; i++) {
    const res = await request.get(`${API}/api/__test__/emails?since=${encodeURIComponent(since)}`);
    const body = (await res.json()) as { emails: { template: string; payload: { url?: string } }[] };
    resetEmail = body.emails.find((e) => e.template === "password_reset");
    if (resetEmail) break;
    await page.waitForTimeout(500);
  }
  expect(resetEmail).toBeDefined();
  const url = resetEmail!.payload.url ?? "";
  const tokenMatch = /token=([a-f0-9]+)/.exec(url);
  expect(tokenMatch).not.toBeNull();
  const token = tokenMatch![1];

  // Reset the password directly via the API to keep this test focused on the
  // mailbox round-trip; UI for /reset-password is covered separately.
  const resetRes = await request.post(`${API}/api/auth/reset-password`, {
    data: { token, password: newPassword },
    headers: { "content-type": "application/json" },
  });
  expect(resetRes.status()).toBe(200);

  // Old password rejected, new password works.
  const loginOld = await request.post(`${API}/api/auth/login`, {
    data: { email, password },
    headers: { "content-type": "application/json" },
  });
  expect(loginOld.status()).toBe(401);

  const loginNew = await request.post(`${API}/api/auth/login`, {
    data: { email, password: newPassword },
    headers: { "content-type": "application/json" },
  });
  expect(loginNew.status()).toBe(200);
});

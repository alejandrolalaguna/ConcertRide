import { expect, test } from "@playwright/test";

test("unauthenticated /publish redirects to /login with a next hint", async ({ page }) => {
  await page.goto("/publish");
  await page.waitForURL(/\/login/, { waitUntil: "commit" });
  expect(page.url()).toContain("next=%2Fpublish");
  await expect(page.getByPlaceholder("tu@email.com")).toBeVisible();
});

test("register + login flow authenticates a user and shows them on the nav", async ({ page }) => {
  const email = `e2e-${Date.now()}@concertride.test`;
  const password = "TestPass123!";
  const name = "E2e Usuario";

  // Register — since adding GDPR-required ToS checkbox, the submit button
  // stays disabled until the user ticks it.
  await page.goto("/register");
  await page.getByPlaceholder("Tu nombre").fill(name);
  await page.getByPlaceholder("tu@email.com").fill(email);
  await page.getByPlaceholder("••••••••").fill(password);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Crear cuenta/i }).click();

  // After register the session cookie is set and we redirect to the home.
  await page.waitForURL("/", { waitUntil: "commit", timeout: 15_000 });
  await expect(page.getByRole("button", { name: /E2e/i })).toBeVisible({ timeout: 10_000 });

  // Logout via the user dropdown. click() dispatches the event but the
  // handler is async (fetches /api/auth/logout) — we wait for the nav to
  // settle into logged-out state before navigating, otherwise /login still
  // sees a stale session and instantly redirects us away.
  await page.getByRole("button", { name: /E2e/i }).click();
  await page.getByRole("menuitem", { name: /Cerrar sesión/i }).click();
  await expect(page.getByRole("button", { name: /E2e/i })).not.toBeVisible({
    timeout: 10_000,
  });

  // Log back in with the same credentials
  await page.goto("/login");
  await page.getByPlaceholder("tu@email.com").fill(email);
  await page.getByPlaceholder("••••••••").fill(password);
  await page.getByRole("button", { name: /^Entrar$/i }).click();

  await page.waitForURL("/", { waitUntil: "commit", timeout: 15_000 });
  await expect(page.getByRole("button", { name: /E2e/i })).toBeVisible({ timeout: 10_000 });
});

test("login with wrong password shows error message", async ({ page }) => {
  await page.goto("/login");
  await page.getByPlaceholder("tu@email.com").fill("noexiste@concertride.test");
  await page.getByPlaceholder("••••••••").fill("wrongpassword");
  await page.getByRole("button", { name: /^Entrar$/i }).click();
  await expect(page.getByRole("alert")).toContainText(/incorrectos/i, { timeout: 10_000 });
});

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

  // Register
  await page.goto("/register");
  await page.getByPlaceholder("Tu nombre").fill(name);
  await page.getByPlaceholder("tu@email.com").fill(email);
  await page.getByPlaceholder("••••••••").fill(password);
  await page.getByRole("button", { name: /Crear cuenta/i }).click();

  // After register the session cookie is set and we should redirect to "/"
  await page.waitForURL("/", { waitUntil: "commit", timeout: 15_000 });
  await expect(page.getByRole("button", { name: /E2e/i })).toBeVisible({ timeout: 10_000 });

  // Logout
  await page.getByRole("button", { name: /E2e/i }).click();
  await page.getByRole("button", { name: /Cerrar sesión/i }).click();

  // Login with the same credentials
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

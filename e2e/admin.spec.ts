import { expect, test } from "@playwright/test";

// These tests rely on:
//  - The dev API reading .dev.vars where ADMIN_USER_IDS=u_2a5956aa
//  - Alejandro (u_2a5956aa) existing in Turso with password qwer1234
// Both are real dev-only setup the project owner maintains.

test.describe("/admin/reports access control", () => {
  test("anonymous visitors get redirected to home (Navigate replace)", async ({ page }) => {
    await page.goto("/admin/reports");
    // AdminReportsPage calls /api/admin/me on mount; non-authed → 401 → Navigate
    await page.waitForURL("/", { waitUntil: "commit", timeout: 10_000 });
  });

  test("non-admin authed users also get bounced", async ({ page }) => {
    const email = `e2e-non-admin-${Date.now()}@concertride.test`;
    // Register a fresh non-admin user
    await page.goto("/register");
    await page.getByPlaceholder("Tu nombre").fill("Non Admin");
    await page.getByPlaceholder("tu@email.com").fill(email);
    await page.getByPlaceholder("••••••••").fill("TestPass123!");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /Crear cuenta/i }).click();
    await page.waitForURL("/", { waitUntil: "commit", timeout: 15_000 });

    // Try to reach the admin page
    await page.goto("/admin/reports");
    // AdminReportsPage → /api/admin/me → 404 → Navigate to /
    await page.waitForURL("/", { waitUntil: "commit", timeout: 10_000 });
  });

  test("alejandro@ logs in and accesses /admin/reports", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("tu@email.com").fill("alejandrolalaguna@gmail.com");
    await page.getByPlaceholder("••••••••").fill("qwer1234");
    await page.getByRole("button", { name: /^Entrar$/i }).click();

    await page.waitForURL("/", { waitUntil: "commit", timeout: 15_000 });
    await page.goto("/admin/reports");

    // Page should load and NOT redirect away
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Reportes de abuso/i,
      { timeout: 10_000 },
    );

    // Tabs visible
    await expect(page.getByRole("button", { name: /Pendientes/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Revisados/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Resueltos/i })).toBeVisible();
  });
});

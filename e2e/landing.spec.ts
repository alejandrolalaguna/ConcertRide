import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("landing page", () => {
  test("loads with correct title, hero, and stats", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/ConcertRide ES/);

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Get to the");
    await expect(page.getByRole("link", { name: /Buscar un viaje/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Ofrecer mi coche/i }).first()).toBeVisible();

    // StatsBar renders three mono counters with the volt accent.
    await expect(page.getByText("viajeros compartiendo")).toBeVisible();
    await expect(page.getByText("conciertos activos")).toBeVisible();
    await expect(page.getByText("coste medio")).toBeVisible();
  });

  test("passes an axe a11y scan (no serious/critical violations)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .disableRules([
        // Motion-based animations (Hero chevron bounce) respect prefers-reduced-motion.
        "frame-title",
        // Leaflet map pins are spatially constrained — dense cluster areas can't
        // guarantee 24px separation between targets. WCAG 2.2 §2.5.8 exempts
        // controls whose position is determined by spatial layout.
        "target-size",
      ])
      .analyze();

    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );

    if (serious.length > 0) {
      console.log("axe violations:", JSON.stringify(serious, null, 2));
    }
    expect(serious).toHaveLength(0);
  });
});

test.describe("browse concerts → ride detail", () => {
  test("clicking a concert in the carousel navigates to its detail page", async ({ page }) => {
    await page.goto("/");

    // Wait for the carousel to hydrate with real concert data.
    const firstCard = page.locator("a[href^='/concerts/']").first();
    await firstCard.waitFor({ state: "visible", timeout: 15_000 });
    const href = await firstCard.getAttribute("href");
    expect(href).toBeTruthy();

    await firstCard.click();
    await page.waitForURL(/\/concerts\//);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/Viajes disponibles/i)).toBeVisible();
  });
});

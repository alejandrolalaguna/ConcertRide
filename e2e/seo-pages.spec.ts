import { expect, test } from "@playwright/test";

// Smoke test every new SEO/GEO landing to ensure it renders, has a unique H1
// and at least one piece of the expected JSON-LD payload.

async function expectJsonLdWithType(page: import("@playwright/test").Page, type: string) {
  const scripts = await page.locator('script[type="application/ld+json"]').allInnerTexts();
  const anyMatches = scripts.some((s) => s.includes(`"@type":"${type}"`) || s.includes(`"@type": "${type}"`));
  expect(anyMatches, `expected JSON-LD block with @type ${type}`).toBe(true);
}

test.describe("FAQ page", () => {
  test("renders with FAQPage JSON-LD and toggles a question", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Preguntas frecuentes/i);
    await expectJsonLdWithType(page, "FAQPage");
    // First question expanded by default
    await expect(page.getByText(/Qué es ConcertRide/i).first()).toBeVisible();
  });
});

test.describe("Cómo funciona page", () => {
  test("renders HowTo schema + both passenger and driver flows", async ({ page }) => {
    await page.goto("/como-funciona");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Cómo funciona/i);
    await expectJsonLdWithType(page, "HowTo");
    await expect(page.getByRole("heading", { level: 2, name: /Si buscas viaje/i })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /Si tienes coche/i })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: /Por qué es seguro/i })).toBeVisible();
  });
});

test.describe("Contacto page", () => {
  test("renders with mailto and ContactPage JSON-LD", async ({ page }) => {
    await page.goto("/contacto");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Contacto/i);
    await expectJsonLdWithType(page, "ContactPage");
    await expect(
      page.getByRole("link", { name: /alejandrolalaguna@gmail.com/i }).first(),
    ).toHaveAttribute("href", /^mailto:/);
  });
});

test.describe("Acerca de page", () => {
  test("renders with AboutPage JSON-LD", async ({ page }) => {
    await page.goto("/acerca-de");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Llegar al concierto/i);
    await expectJsonLdWithType(page, "AboutPage");
  });
});

test.describe("City landing pages", () => {
  test("/conciertos/madrid renders with CollectionPage JSON-LD", async ({ page }) => {
    await page.goto("/conciertos/madrid");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Madrid/i);
    await expectJsonLdWithType(page, "CollectionPage");
    // Internal linking hub to other cities
    await expect(page.getByRole("link", { name: /Barcelona/i })).toBeVisible();
  });

  test("unknown slug redirects to /concerts", async ({ page }) => {
    await page.goto("/conciertos/atlantis");
    await page.waitForURL("/concerts", { waitUntil: "commit", timeout: 10_000 });
  });
});

test.describe("404 page", () => {
  test("unknown route shows the NotFoundPage with noindex", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Página no encontrada/i);
    // noindex meta set
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots).toMatch(/noindex/);
  });
});

test.describe("Static SEO files", () => {
  test("robots.txt, sitemap.xml, llms.txt, ai.txt all served 200", async ({ request }) => {
    for (const path of ["/robots.txt", "/sitemap.xml", "/llms.txt", "/ai.txt", "/sitemap-static.xml"]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
    }
  });
});

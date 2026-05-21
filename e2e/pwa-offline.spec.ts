import { expect, test } from "@playwright/test";

test.describe("PWA — offline fallback", () => {
  // The vite-plugin-pwa SW registers on first navigation. We give it a head
  // start by navigating once and waiting for the controller to claim the page.
  test("serves the SPA shell when navigating offline after warm-up", async ({ page, context }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Wait until the service worker is in 'activated' state. If the dev build
    // doesn't ship the SW (vite dev server only registers in prod build),
    // skip — the offline fallback is tested in build verification.
    const swReady = await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) return false;
      try {
        const reg = await navigator.serviceWorker.ready;
        return Boolean(reg?.active);
      } catch {
        return false;
      }
    });
    test.skip(!swReady, "Service worker not active in dev server build");

    await context.setOffline(true);

    // Navigate to a non-cached URL — the SW should fall back to its cached shell
    const response = await page.goto("/concerts").catch(() => null);
    expect(response).not.toBeNull();
    if (response) {
      expect(response.status()).toBeLessThan(500);
    }
    // Page should still render something — title check.
    await expect(page).toHaveTitle(/ConcertRide/);

    await context.setOffline(false);
  });
});

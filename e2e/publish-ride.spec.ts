import { expect, test, type BrowserContext } from "@playwright/test";

const FIXTURE_CONCERT_ID = "c_rosalia_wizink";
const API = "http://127.0.0.1:8787";

async function seedUser(
  context: BrowserContext,
  email: string,
  name: string,
  licenseVerified = false,
) {
  const res = await context.request.post(`${API}/api/__test__/seed`, {
    data: { email, name, license_verified: licenseVerified },
  });
  if (![200, 201].includes(res.status())) {
    throw new Error(
      `__test__/seed returned ${res.status()}. Is TEST_MODE=true in .dev.vars?`,
    );
  }
  const body = (await res.json()) as { user: { id: string } };
  return body.user.id;
}

test.describe("Publish ride flow", () => {
  test("verified driver can publish via the API and see the ride in /mis-viajes", async ({
    browser,
  }) => {
    const stamp = Date.now();
    const driverCtx = await browser.newContext();
    await seedUser(driverCtx, `pub-driver-${stamp}@e2e.test`, "Driver Publish", true);

    // Publish via the API (faster than the 3-step UI wizard, sufficient to
    // exercise the persistence path)
    const departure = new Date(Date.now() + 72 * 3600_000).toISOString();
    const pubRes = await driverCtx.request.post(`${API}/api/rides`, {
      data: {
        concert_id: FIXTURE_CONCERT_ID,
        origin_city: "Valencia",
        origin_lat: 39.47,
        origin_lng: -0.37,
        origin_address: "Plaza Ayuntamiento",
        departure_time: departure,
        price_per_seat: 14,
        seats_total: 3,
        round_trip: false,
        vibe: "chill",
      },
    });
    expect(pubRes.status()).toBe(201);
    const ride = (await pubRes.json()) as { id: string };
    expect(ride.id).toBeTruthy();

    // Verify the ride shows up on /mis-viajes for that driver.
    const page = await driverCtx.newPage();
    await page.goto("/mis-viajes");
    await page.waitForLoadState("domcontentloaded");

    // The ride id appears as a link or the artist/origin combo is visible.
    // Use a network-stable wait: poll until the page text contains the artist.
    await expect(page.getByText(/Rosalía/i).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Valencia/i).first()).toBeVisible();

    await driverCtx.close();
  });

  test("unverified driver (no license) is rejected with 403", async ({ browser }) => {
    const stamp = Date.now();
    const ctx = await browser.newContext();
    await seedUser(ctx, `pub-nolic-${stamp}@e2e.test`, "Unverified", false);

    const pubRes = await ctx.request.post(`${API}/api/rides`, {
      data: {
        concert_id: FIXTURE_CONCERT_ID,
        origin_city: "Valencia",
        origin_lat: 39.47,
        origin_lng: -0.37,
        origin_address: "Plaza Ayuntamiento",
        departure_time: new Date(Date.now() + 48 * 3600_000).toISOString(),
        price_per_seat: 14,
        seats_total: 3,
        round_trip: false,
        vibe: "chill",
      },
    });
    expect(pubRes.status()).toBe(403);
    const body = (await pubRes.json()) as { error: string };
    expect(body.error).toBe("license_not_verified");

    await ctx.close();
  });
});

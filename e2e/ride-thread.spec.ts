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

// Publish a ride directly via the API as the driver in this context.
async function publishRideAsDriver(context: BrowserContext) {
  const res = await context.request.post(`${API}/api/rides`, {
    data: {
      concert_id: FIXTURE_CONCERT_ID,
      origin_city: "Valencia",
      origin_lat: 39.47,
      origin_lng: -0.37,
      origin_address: "Plaza Ayuntamiento",
      departure_time: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      price_per_seat: 12,
      seats_total: 3,
      round_trip: false,
      vibe: "chill",
    },
  });
  if (res.status() !== 201) {
    throw new Error(`POST /api/rides failed: ${res.status()} ${await res.text()}`);
  }
  const ride = (await res.json()) as { id: string };
  return ride.id;
}

async function requestSeat(context: BrowserContext, rideId: string, seats = 1) {
  const res = await context.request.post(`${API}/api/rides/${rideId}/request`, {
    data: { seats },
  });
  if (res.status() !== 201) {
    throw new Error(`request seat failed: ${res.status()} ${await res.text()}`);
  }
  const req = (await res.json()) as { id: string };
  return req.id;
}

async function confirmRequest(context: BrowserContext, rideId: string, requestId: string) {
  const res = await context.request.patch(
    `${API}/api/rides/${rideId}/request/${requestId}`,
    { data: { status: "confirmed" } },
  );
  if (res.status() !== 200) {
    throw new Error(`confirm failed: ${res.status()} ${await res.text()}`);
  }
}

test.describe("Ride-thread chat — access control by participant status", () => {
  test("driver and confirmed passenger see the chat; pending passenger and unrelated user do not", async ({
    browser,
  }) => {
    const stamp = Date.now();

    const driverCtx = await browser.newContext();
    const passACtx = await browser.newContext();
    const passBCtx = await browser.newContext();
    const userCCtx = await browser.newContext();

    await seedUser(driverCtx, `rt-driver-${stamp}@e2e.test`, "Driver", true);
    await seedUser(passACtx, `rt-paxA-${stamp}@e2e.test`, "PaxA");
    await seedUser(passBCtx, `rt-paxB-${stamp}@e2e.test`, "PaxB");
    await seedUser(userCCtx, `rt-userC-${stamp}@e2e.test`, "UserC");

    const rideId = await publishRideAsDriver(driverCtx);
    const reqAId = await requestSeat(passACtx, rideId);
    await confirmRequest(driverCtx, rideId, reqAId);
    // Passenger B requests but the driver never confirms — stays pending.
    await requestSeat(passBCtx, rideId);

    // Driver: chat input visible
    const driverPage = await driverCtx.newPage();
    await driverPage.goto(`/rides/${rideId}`);
    await expect(
      driverPage.getByPlaceholder(/escribe un mensaje/i).first(),
    ).toBeVisible({ timeout: 15_000 });

    // Passenger A (confirmed): chat input visible
    const passAPage = await passACtx.newPage();
    await passAPage.goto(`/rides/${rideId}`);
    await expect(
      passAPage.getByPlaceholder(/escribe un mensaje/i).first(),
    ).toBeVisible({ timeout: 15_000 });

    // Passenger B (pending): chat input NOT visible
    const passBPage = await passBCtx.newPage();
    await passBPage.goto(`/rides/${rideId}`);
    // Allow the page itself to render its public ride header before asserting absence.
    await passBPage.waitForLoadState("domcontentloaded");
    await expect(
      passBPage.getByPlaceholder(/escribe un mensaje/i),
    ).toHaveCount(0, { timeout: 10_000 });

    // User C (unrelated): chat input NOT visible
    const userCPage = await userCCtx.newPage();
    await userCPage.goto(`/rides/${rideId}`);
    await userCPage.waitForLoadState("domcontentloaded");
    await expect(
      userCPage.getByPlaceholder(/escribe un mensaje/i),
    ).toHaveCount(0, { timeout: 10_000 });

    await driverCtx.close();
    await passACtx.close();
    await passBCtx.close();
    await userCCtx.close();
  });
});

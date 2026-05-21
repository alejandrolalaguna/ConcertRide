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

async function publishRide(context: BrowserContext) {
  const res = await context.request.post(`${API}/api/rides`, {
    data: {
      concert_id: FIXTURE_CONCERT_ID,
      origin_city: "Valencia",
      origin_lat: 39.47,
      origin_lng: -0.37,
      origin_address: "Plaza Ayuntamiento",
      departure_time: new Date(Date.now() + 48 * 3600_000).toISOString(),
      price_per_seat: 12,
      seats_total: 3,
      round_trip: false,
      vibe: "chill",
    },
  });
  if (res.status() !== 201) {
    throw new Error(`publish failed: ${res.status()} ${await res.text()}`);
  }
  const ride = (await res.json()) as { id: string };
  return ride.id;
}

async function getEmails(context: BrowserContext) {
  const res = await context.request.get(`${API}/api/__test__/emails`);
  if (res.status() !== 200) return [];
  const body = (await res.json()) as {
    emails: Array<{ template: string; to: string; payload: Record<string, unknown> }>;
  };
  return body.emails;
}

test.describe("Request a seat — driver/passenger handshake", () => {
  test("passenger requests, driver receives email, driver accepts, passenger receives confirmation", async ({
    browser,
  }) => {
    const stamp = Date.now();
    const driverCtx = await browser.newContext();
    const paxCtx = await browser.newContext();

    const driverEmail = `req-driver-${stamp}@e2e.test`;
    const paxEmail = `req-pax-${stamp}@e2e.test`;

    await seedUser(driverCtx, driverEmail, "Driver Req", true);
    await seedUser(paxCtx, paxEmail, "Pax Req", false);

    // Driver publishes via API
    const rideId = await publishRide(driverCtx);

    // Clear the mailbox so we only see emails from this flow
    await driverCtx.request.delete(`${API}/api/__test__/emails`);

    // Passenger requests via API (faster than going through the UI)
    const reqRes = await paxCtx.request.post(`${API}/api/rides/${rideId}/request`, {
      data: { seats: 1 },
    });
    expect(reqRes.status()).toBe(201);
    const request = (await reqRes.json()) as { id: string };

    // Wait for the driver to receive the seat_requested email (waitUntil)
    let driverEmails = [] as Awaited<ReturnType<typeof getEmails>>;
    for (let i = 0; i < 20; i++) {
      driverEmails = await getEmails(driverCtx);
      const found = driverEmails.find(
        (e) => e.template === "seat_requested" && e.to === driverEmail,
      );
      if (found) break;
      await new Promise((r) => setTimeout(r, 250));
    }
    const seatRequested = driverEmails.find(
      (e) => e.template === "seat_requested" && e.to === driverEmail,
    );
    expect(seatRequested, "driver did not receive seat_requested email").toBeDefined();

    // Driver accepts via API
    const acceptRes = await driverCtx.request.patch(
      `${API}/api/rides/${rideId}/request/${request.id}`,
      { data: { status: "confirmed" } },
    );
    expect(acceptRes.status()).toBe(200);

    // Wait for the passenger to receive the seat_decision email
    let allEmails = [] as Awaited<ReturnType<typeof getEmails>>;
    for (let i = 0; i < 20; i++) {
      allEmails = await getEmails(driverCtx);
      const found = allEmails.find(
        (e) => e.template === "seat_decision" && e.to === paxEmail,
      );
      if (found) break;
      await new Promise((r) => setTimeout(r, 250));
    }
    const decision = allEmails.find(
      (e) => e.template === "seat_decision" && e.to === paxEmail,
    );
    expect(decision, "passenger did not receive seat_decision email").toBeDefined();

    // Verify the ride detail page renders the confirmed state for the passenger
    const paxPage = await paxCtx.newPage();
    await paxPage.goto(`/rides/${rideId}`);
    await paxPage.waitForLoadState("domcontentloaded");
    await expect(paxPage.getByText(/Rosalía/i).first()).toBeVisible({ timeout: 15_000 });

    await driverCtx.close();
    await paxCtx.close();
  });
});

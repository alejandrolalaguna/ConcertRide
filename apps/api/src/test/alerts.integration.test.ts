import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildTestApp, makeVerifiedDriver, publishRide, FIXTURE_CONCERT_ID } from "./helpers";
import { clearSentEmails, sentByTemplate } from "./mocks/email";

// /api/alerts in this codebase ONLY exposes festival alerts + festival demand.
// The generic "concert/artist/city alert" endpoint described in the master
// plan is implemented via /api/concerts/:id/interest (toggleDemandSignal) and
// /api/favorites instead — covered by concerts/favorites tests. Demand-match
// emails fire when listInterestedUsers matches a freshly-published ride.

vi.mock("../lib/email", async () => {
  const mod = await import("./mocks/email");
  return mod.emailMockFactory();
});

beforeEach(() => {
  clearSentEmails();
});

describe("POST /api/alerts/festival", () => {
  it("creates a new festival email alert (201)", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/alerts/festival", {
      method: "POST",
      body: JSON.stringify({ email: "alerts1@cr.test", festival_slug: "mad-cool" }),
    });
    expect(res.status).toBe(201);
    expect((res.body as { created: boolean }).created).toBe(true);
  });

  it("is idempotent — second subscribe returns 200 created=false", async () => {
    const app = buildTestApp();
    const body = JSON.stringify({ email: "alerts2@cr.test", festival_slug: "primavera-sound" });
    const a = await app.request("/api/alerts/festival", { method: "POST", body });
    expect(a.status).toBe(201);
    const b = await app.request("/api/alerts/festival", { method: "POST", body });
    expect(b.status).toBe(200);
    expect((b.body as { created: boolean }).created).toBe(false);
  });

  it("rejects invalid festival_slug format", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/alerts/festival", {
      method: "POST",
      body: JSON.stringify({ email: "alerts3@cr.test", festival_slug: "Has Spaces!" }),
    });
    expect(res.status).toBe(400);
  });

  it("rejects malformed email", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/alerts/festival", {
      method: "POST",
      body: JSON.stringify({ email: "not-an-email", festival_slug: "mad-cool" }),
    });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/alerts/festivals/:slug/demand", () => {
  it("registers anonymous demand with origin city", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/alerts/festivals/mad-cool/demand", {
      method: "POST",
      body: JSON.stringify({ origin_city: "Valencia" }),
    });
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty("created");
  });

  it("rejects payloads without origin_city", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/alerts/festivals/mad-cool/demand", {
      method: "POST",
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/alerts/festivals/:slug/demand/count", () => {
  it("returns a numeric count (defaults to 0 in MemoryStore)", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/alerts/festivals/mad-cool/demand/count");
    expect(res.status).toBe(200);
    expect(typeof (res.body as { count: number }).count).toBe("number");
  });
});

describe("Demand-match email on ride publish", () => {
  it("fires sendDemandMatchEmail for users who signalled interest", async () => {
    const app = buildTestApp();
    // Interested passenger toggles demand signal on the concert
    const { cookie: passenger } = await makeVerifiedDriver(app, `dm-pass-${Math.random()}@cr.test`);
    const toggle = await app.request(`/api/concerts/${FIXTURE_CONCERT_ID}/interest`, {
      method: "POST",
      cookies: passenger,
    });
    expect(toggle.status).toBe(200);

    // Different driver publishes a ride to the same concert
    const { cookie: driver } = await makeVerifiedDriver(app, `dm-driver-${Math.random()}@cr.test`);
    const publish = await publishRide(app, driver);
    expect(publish.status).toBe(201);
    await app.flush();
    expect(sentByTemplate("demand_match").length).toBeGreaterThan(0);
  });
});

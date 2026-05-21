// Email assertions for the ride lifecycle. We mock lib/email so every send*
// helper records its template + recipient + payload into mockSent.
//
// The mock factory must be installed BEFORE any code path that imports lib/email
// runs, hence vi.mock at module top level.

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../lib/email", async () => (await import("./mocks/email")).emailMockFactory());

import {
  buildTestApp,
  makeVerifiedDriver,
  makeVerifiedPassenger,
  publishRide,
} from "./helpers";
import { clearSentEmails, mockSent, sentByTemplate } from "./mocks/email";

beforeEach(() => {
  clearSentEmails();
});

describe("seat_requested email", () => {
  it("fires when a passenger requests a seat", async () => {
    const app = buildTestApp();
    const { cookie: drv } = await makeVerifiedDriver(app, "em1+drv@cr.test");
    const { ride } = await publishRide(app, drv);
    const { cookie: pax } = await makeVerifiedPassenger(app, "em1+pax@cr.test");

    const res = await app.request(`/api/rides/${ride.id}/request`, {
      method: "POST",
      cookies: pax,
      body: JSON.stringify({ seats: 1 }),
    });
    expect(res.status).toBe(201);
    await app.flush();

    const sent = sentByTemplate("seat_requested");
    expect(sent.length).toBeGreaterThanOrEqual(1);
    const email = sent.find((e) => e.to === "em1+drv@cr.test");
    expect(email).toBeDefined();
    expect(email!.payload.instantBooking).toBe(false);
    expect(email!.payload.passengerName).toBeDefined();
    expect(email!.payload.artist).toBeDefined();
  });

  it("fires with instantBooking=true on instant-booking ride", async () => {
    const app = buildTestApp();
    const { cookie: drv } = await makeVerifiedDriver(app, "em2+drv@cr.test");
    const { ride } = await publishRide(app, drv, { instant_booking: true });
    const { cookie: pax } = await makeVerifiedPassenger(app, "em2+pax@cr.test");

    const res = await app.request(`/api/rides/${ride.id}/book`, {
      method: "POST",
      cookies: pax,
      body: JSON.stringify({ seats: 1 }),
    });
    expect(res.status).toBe(201);
    await app.flush();

    const sent = sentByTemplate("seat_requested").find((e) => e.to === "em2+drv@cr.test");
    expect(sent).toBeDefined();
    expect(sent!.payload.instantBooking).toBe(true);
  });
});

describe("seat_decision email", () => {
  it("fires with status=confirmed when driver accepts", async () => {
    const app = buildTestApp();
    const { cookie: drv } = await makeVerifiedDriver(app, "em3+drv@cr.test");
    const { ride } = await publishRide(app, drv);
    const { cookie: pax } = await makeVerifiedPassenger(app, "em3+pax@cr.test");

    const req = (
      await app.request(`/api/rides/${ride.id}/request`, {
        method: "POST",
        cookies: pax,
        body: JSON.stringify({ seats: 1 }),
      })
    ).body as { id: string };
    clearSentEmails();

    const accept = await app.request(`/api/rides/${ride.id}/request/${req.id}`, {
      method: "PATCH",
      cookies: drv,
      body: JSON.stringify({ status: "confirmed" }),
    });
    expect(accept.status).toBe(200);
    await app.flush();

    const sent = sentByTemplate("seat_decision").find((e) => e.to === "em3+pax@cr.test");
    expect(sent).toBeDefined();
    expect(sent!.payload.status).toBe("confirmed");
    expect(sent!.payload.passengerName).toBeDefined();
    expect(sent!.payload.driverName).toBeDefined();
    expect(sent!.payload.artist).toBeDefined();
    expect(sent!.payload.rideUrl).toContain(`/rides/${ride.id}`);
  });

  it("fires with status=rejected when driver rejects", async () => {
    const app = buildTestApp();
    const { cookie: drv } = await makeVerifiedDriver(app, "em4+drv@cr.test");
    const { ride } = await publishRide(app, drv);
    const { cookie: pax } = await makeVerifiedPassenger(app, "em4+pax@cr.test");

    const req = (
      await app.request(`/api/rides/${ride.id}/request`, {
        method: "POST",
        cookies: pax,
        body: JSON.stringify({ seats: 1 }),
      })
    ).body as { id: string };
    clearSentEmails();

    const rej = await app.request(`/api/rides/${ride.id}/request/${req.id}`, {
      method: "PATCH",
      cookies: drv,
      body: JSON.stringify({ status: "rejected" }),
    });
    expect(rej.status).toBe(200);
    await app.flush();

    const sent = sentByTemplate("seat_decision").find((e) => e.to === "em4+pax@cr.test");
    expect(sent).toBeDefined();
    expect(sent!.payload.status).toBe("rejected");
  });

  it("does NOT fire when passenger self-cancels", async () => {
    const app = buildTestApp();
    const { cookie: drv } = await makeVerifiedDriver(app, "em5+drv@cr.test");
    const { ride } = await publishRide(app, drv);
    const { cookie: pax } = await makeVerifiedPassenger(app, "em5+pax@cr.test");

    const req = (
      await app.request(`/api/rides/${ride.id}/request`, {
        method: "POST",
        cookies: pax,
        body: JSON.stringify({ seats: 1 }),
      })
    ).body as { id: string };
    clearSentEmails();

    await app.request(`/api/rides/${ride.id}/request/${req.id}`, {
      method: "PATCH",
      cookies: pax,
      body: JSON.stringify({ status: "cancelled" }),
    });
    await app.flush();

    // Passenger self-cancel sends a raw email to the driver via sendEmail, NOT
    // a seat_decision template. Verify the decision template stayed quiet.
    expect(sentByTemplate("seat_decision")).toHaveLength(0);
  });
});

describe("demand_match email on ride publish", () => {
  it("does not fire when nobody has signalled interest", async () => {
    const app = buildTestApp();
    const { cookie: drv } = await makeVerifiedDriver(app, "em6+drv@cr.test");
    await publishRide(app, drv);
    await app.flush();
    expect(sentByTemplate("demand_match")).toHaveLength(0);
  });

  it("captures basic payload shape when emails fire", async () => {
    // Smoke check on the mock itself: when ANY email fires, payload is an object
    const app = buildTestApp();
    const { cookie: drv } = await makeVerifiedDriver(app, "em7+drv@cr.test");
    const { ride } = await publishRide(app, drv);
    const { cookie: pax } = await makeVerifiedPassenger(app, "em7+pax@cr.test");
    await app.request(`/api/rides/${ride.id}/request`, {
      method: "POST",
      cookies: pax,
      body: JSON.stringify({ seats: 1 }),
    });
    await app.flush();

    expect(mockSent.length).toBeGreaterThan(0);
    for (const e of mockSent) {
      expect(typeof e.template).toBe("string");
      expect(typeof e.to).toBe("string");
      expect(typeof e.payload).toBe("object");
    }
  });
});

import { describe, expect, it } from "vitest";
import {
  buildTestApp,
  makeVerifiedDriver,
  makeVerifiedPassenger,
  publishRide,
  registerAndLogin,
} from "./helpers";

describe("GET /api/crew — shape", () => {
  it("returns { crew, pending_incoming, pending_outgoing, total }", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "crew1@cr.test");
    const res = await app.request("/api/crew", { cookies: cookie });
    expect(res.status).toBe(200);
    const body = res.body as {
      crew: unknown[];
      pending_incoming: unknown[];
      pending_outgoing: unknown[];
      total: number;
    };
    expect(Array.isArray(body.crew)).toBe(true);
    expect(Array.isArray(body.pending_incoming)).toBe(true);
    expect(Array.isArray(body.pending_outgoing)).toBe(true);
    expect(typeof body.total).toBe("number");
  });

  it("requires auth (401)", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/crew");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/crew/invite", () => {
  it("rejects inviting yourself (400 self_invite)", async () => {
    const app = buildTestApp();
    const { cookie, userId } = await registerAndLogin(app, "inv1@cr.test");
    const res = await app.request("/api/crew/invite", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ user_id: userId }),
    });
    expect(res.status).toBe(400);
    expect((res.body as { error: string }).error).toBe("self_invite");
  });

  it("rejects inviting a non-existent user (404)", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "inv2@cr.test");
    const res = await app.request("/api/crew/invite", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ user_id: "u_nope" }),
    });
    expect(res.status).toBe(404);
  });

  it("creates a pending invite and surfaces it in both users' lists", async () => {
    const app = buildTestApp();
    const { cookie: aCookie } = await registerAndLogin(app, "inv3+a@cr.test");
    const { cookie: bCookie, userId: bId } = await registerAndLogin(app, "inv3+b@cr.test");

    const invite = await app.request("/api/crew/invite", {
      method: "POST",
      cookies: aCookie,
      body: JSON.stringify({ user_id: bId }),
    });
    expect(invite.status).toBe(201);

    const aList = (await app.request("/api/crew", { cookies: aCookie })).body as {
      pending_outgoing: Array<{ user: { id: string } }>;
    };
    expect(aList.pending_outgoing).toHaveLength(1);
    expect(aList.pending_outgoing[0]!.user.id).toBe(bId);

    const bList = (await app.request("/api/crew", { cookies: bCookie })).body as {
      pending_incoming: Array<{ user: { id: string } }>;
    };
    expect(bList.pending_incoming).toHaveLength(1);
  });

  it("is idempotent — a second invite returns the same row (201)", async () => {
    const app = buildTestApp();
    const { cookie: aCookie } = await registerAndLogin(app, "inv4+a@cr.test");
    const { userId: bId } = await registerAndLogin(app, "inv4+b@cr.test");

    const first = await app.request("/api/crew/invite", {
      method: "POST",
      cookies: aCookie,
      body: JSON.stringify({ user_id: bId }),
    });
    const second = await app.request("/api/crew/invite", {
      method: "POST",
      cookies: aCookie,
      body: JSON.stringify({ user_id: bId }),
    });
    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    // Both should return the same crew member shape (id stays stable across calls)
    const aList = (await app.request("/api/crew", { cookies: aCookie })).body as {
      pending_outgoing: Array<{ user: { id: string } }>;
    };
    expect(aList.pending_outgoing).toHaveLength(1);
  });

  it("rejects bad_request when user_id is missing (400)", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "inv5@cr.test");
    const res = await app.request("/api/crew/invite", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/crew/:userId/accept", () => {
  it("accepts a pending invite and promotes it to crew on both sides", async () => {
    const app = buildTestApp();
    const { cookie: aCookie, userId: aId } = await registerAndLogin(app, "acc1+a@cr.test");
    const { cookie: bCookie, userId: bId } = await registerAndLogin(app, "acc1+b@cr.test");

    await app.request("/api/crew/invite", {
      method: "POST",
      cookies: aCookie,
      body: JSON.stringify({ user_id: bId }),
    });

    const accept = await app.request(`/api/crew/${aId}/accept`, {
      method: "POST",
      cookies: bCookie,
    });
    expect(accept.status).toBe(200);

    const aList = (await app.request("/api/crew", { cookies: aCookie })).body as {
      crew: Array<{ user: { id: string } }>;
      pending_outgoing: unknown[];
    };
    expect(aList.crew).toHaveLength(1);
    expect(aList.crew[0]!.user.id).toBe(bId);
    expect(aList.pending_outgoing).toHaveLength(0);

    const bList = (await app.request("/api/crew", { cookies: bCookie })).body as {
      crew: Array<{ user: { id: string } }>;
      pending_incoming: unknown[];
    };
    expect(bList.crew).toHaveLength(1);
    expect(bList.crew[0]!.user.id).toBe(aId);
    expect(bList.pending_incoming).toHaveLength(0);
  });

  it("cannot accept an invite the user themselves sent (404 not_found_or_not_pending)", async () => {
    const app = buildTestApp();
    const { cookie: aCookie } = await registerAndLogin(app, "acc2+a@cr.test");
    const { userId: bId } = await registerAndLogin(app, "acc2+b@cr.test");

    await app.request("/api/crew/invite", {
      method: "POST",
      cookies: aCookie,
      body: JSON.stringify({ user_id: bId }),
    });
    // A tries to accept their own outbound invite — denied
    const res = await app.request(`/api/crew/${bId}/accept`, {
      method: "POST",
      cookies: aCookie,
    });
    expect(res.status).toBe(404);
  });

  it("returns 404 when there is no pending invite to accept", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "acc3+a@cr.test");
    const { userId: bId } = await registerAndLogin(app, "acc3+b@cr.test");
    const res = await app.request(`/api/crew/${bId}/accept`, {
      method: "POST",
      cookies: cookie,
    });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/crew/:userId", () => {
  it("removes an accepted crew connection on both sides", async () => {
    const app = buildTestApp();
    const { cookie: aCookie, userId: aId } = await registerAndLogin(app, "del1+a@cr.test");
    const { cookie: bCookie, userId: bId } = await registerAndLogin(app, "del1+b@cr.test");

    await app.request("/api/crew/invite", {
      method: "POST",
      cookies: aCookie,
      body: JSON.stringify({ user_id: bId }),
    });
    await app.request(`/api/crew/${aId}/accept`, { method: "POST", cookies: bCookie });

    const del = await app.request(`/api/crew/${bId}`, { method: "DELETE", cookies: aCookie });
    expect(del.status).toBe(200);

    const aList = (await app.request("/api/crew", { cookies: aCookie })).body as { crew: unknown[] };
    const bList = (await app.request("/api/crew", { cookies: bCookie })).body as { crew: unknown[] };
    expect(aList.crew).toHaveLength(0);
    expect(bList.crew).toHaveLength(0);
  });
});

describe("GET /api/crew/attending/:concertId", () => {
  it("returns crew members who have a ride on the given concert", async () => {
    const app = buildTestApp();
    const { cookie: aCookie, userId: aId } = await registerAndLogin(app, "att1+a@cr.test");
    const { cookie: bCookie, userId: bId } = await makeVerifiedDriver(app, "att1+b@cr.test");

    // a and b become crew
    await app.request("/api/crew/invite", {
      method: "POST",
      cookies: aCookie,
      body: JSON.stringify({ user_id: bId }),
    });
    await app.request(`/api/crew/${aId}/accept`, { method: "POST", cookies: bCookie });

    // b publishes a ride to FIXTURE_CONCERT_ID
    const { ride } = await publishRide(app, bCookie);
    expect(ride.id).not.toBe("");

    // a queries attending — should see b
    const res = await app.request(`/api/crew/attending/${ride.concert_id}`, { cookies: aCookie });
    expect(res.status).toBe(200);
    const body = res.body as { crew: Array<{ user: { id: string } }> };
    expect(body.crew.length).toBeGreaterThanOrEqual(1);
    expect(body.crew.some((m) => m.user.id === bId)).toBe(true);
  });

  it("returns empty crew when no member attends the given concert", async () => {
    const app = buildTestApp();
    const { cookie: aCookie, userId: aId } = await registerAndLogin(app, "att2+a@cr.test");
    const { cookie: bCookie, userId: bId } = await makeVerifiedPassenger(app, "att2+b@cr.test");

    await app.request("/api/crew/invite", {
      method: "POST",
      cookies: aCookie,
      body: JSON.stringify({ user_id: bId }),
    });
    await app.request(`/api/crew/${aId}/accept`, { method: "POST", cookies: bCookie });

    const res = await app.request(`/api/crew/attending/c_nonexistent`, { cookies: aCookie });
    expect(res.status).toBe(200);
    expect((res.body as { crew: unknown[] }).crew).toHaveLength(0);
  });

  it("returns empty crew when viewer has no session", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/crew/attending/c_rosalia_wizink");
    expect(res.status).toBe(200);
    expect((res.body as { crew: unknown[] }).crew).toHaveLength(0);
  });
});

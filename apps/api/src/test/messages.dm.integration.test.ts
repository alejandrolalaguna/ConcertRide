import { describe, expect, it } from "vitest";
import { buildTestApp, registerAndLogin } from "./helpers";

describe("GET /api/messages/conversations", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/messages/conversations");
    expect(res.status).toBe(401);
  });

  it("returns an empty list when the user has no DMs", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "conv-empty@test.es");
    const res = await app.request("/api/messages/conversations", { cookies: cookie });
    expect(res.status).toBe(200);
    const body = res.body as { conversations: unknown[] };
    expect(body.conversations).toEqual([]);
  });

  it("lists conversations with last message preview after DMs are sent", async () => {
    const app = buildTestApp();
    const { cookie: aCookie } = await registerAndLogin(app, "convA@test.es", "Test1234!", "Alice");
    const { cookie: bCookie, userId: bId } = await registerAndLogin(app, "convB@test.es", "Test1234!", "Bob");

    const send = await app.request(`/api/messages/dm/${bId}`, {
      method: "POST",
      cookies: aCookie,
      body: JSON.stringify({ body: "Hola Bob, ¿vamos juntos?" }),
    });
    expect(send.status).toBe(201);

    const listA = await app.request("/api/messages/conversations", { cookies: aCookie });
    expect(listA.status).toBe(200);
    const bodyA = listA.body as {
      conversations: Array<{ kind: string; last_message_body: string; other_user: { id: string } | null }>;
    };
    expect(bodyA.conversations).toHaveLength(1);
    expect(bodyA.conversations[0]!.kind).toBe("dm");
    expect(bodyA.conversations[0]!.last_message_body).toContain("Hola Bob");
    expect(bodyA.conversations[0]!.other_user?.id).toBe(bId);

    const listB = await app.request("/api/messages/conversations", { cookies: bCookie });
    const bodyB = listB.body as { conversations: Array<{ last_message_body: string }> };
    expect(bodyB.conversations).toHaveLength(1);
    expect(bodyB.conversations[0]!.last_message_body).toContain("Hola Bob");
  });
});

describe("GET /api/messages/dm/:userId", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/messages/dm/u_nope");
    expect(res.status).toBe(401);
  });

  it("returns an empty list when there are no DMs between the two users", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "dm-empty-a@test.es");
    const { userId: otherId } = await registerAndLogin(app, "dm-empty-b@test.es");
    const res = await app.request(`/api/messages/dm/${otherId}`, { cookies: cookie });
    expect(res.status).toBe(200);
    expect((res.body as { messages: unknown[] }).messages).toEqual([]);
  });

  it("returns messages in chronological order", async () => {
    const app = buildTestApp();
    const { cookie: aCookie } = await registerAndLogin(app, "ord-a@test.es", "Test1234!", "Alex");
    const { cookie: bCookie, userId: bId } = await registerAndLogin(app, "ord-b@test.es", "Test1234!", "Bea");
    const { userId: aId } = { userId: (await app.store.getUserByEmail("ord-a@test.es"))!.id };

    await app.request(`/api/messages/dm/${bId}`, {
      method: "POST",
      cookies: aCookie,
      body: JSON.stringify({ body: "Primero" }),
    });
    await app.request(`/api/messages/dm/${aId}`, {
      method: "POST",
      cookies: bCookie,
      body: JSON.stringify({ body: "Segundo" }),
    });
    await app.request(`/api/messages/dm/${bId}`, {
      method: "POST",
      cookies: aCookie,
      body: JSON.stringify({ body: "Tercero" }),
    });

    const list = await app.request(`/api/messages/dm/${bId}`, { cookies: aCookie });
    expect(list.status).toBe(200);
    const body = list.body as { messages: Array<{ body: string }> };
    expect(body.messages.map((m) => m.body)).toEqual(["Primero", "Segundo", "Tercero"]);
  });
});

describe("POST /api/messages/dm/:userId", () => {
  it("rejects empty body with 400", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "empty-body-a@test.es");
    const { userId: otherId } = await registerAndLogin(app, "empty-body-b@test.es");
    const res = await app.request(`/api/messages/dm/${otherId}`, {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ body: "   " }),
    });
    expect(res.status).toBe(400);
  });

  it("rejects body over 280 chars with 400", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "long-a@test.es");
    const { userId: otherId } = await registerAndLogin(app, "long-b@test.es");
    const tooLong = "x".repeat(281);
    const res = await app.request(`/api/messages/dm/${otherId}`, {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ body: tooLong }),
    });
    expect(res.status).toBe(400);
  });

  it("rejects DMing yourself with 400", async () => {
    const app = buildTestApp();
    const { cookie, userId } = await registerAndLogin(app, "self-dm@test.es");
    const res = await app.request(`/api/messages/dm/${userId}`, {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ body: "Hola yo" }),
    });
    expect(res.status).toBe(400);
  });

  it("returns 404 when the recipient does not exist", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "ghost-sender@test.es");
    const res = await app.request("/api/messages/dm/u_does_not_exist", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ body: "Eco" }),
    });
    expect(res.status).toBe(404);
  });

  it("persists a valid DM and returns 201", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "valid-a@test.es");
    const { userId: otherId } = await registerAndLogin(app, "valid-b@test.es");
    const res = await app.request(`/api/messages/dm/${otherId}`, {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ body: "Mensaje válido" }),
    });
    expect(res.status).toBe(201);
    const msg = res.body as { body: string; kind: string };
    expect(msg.body).toBe("Mensaje válido");
    expect(msg.kind).toBe("text");

    const list = await app.request(`/api/messages/dm/${otherId}`, { cookies: cookie });
    expect((list.body as { messages: unknown[] }).messages).toHaveLength(1);
  });

  it("accepts kind=location", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "loc-a@test.es");
    const { userId: otherId } = await registerAndLogin(app, "loc-b@test.es");
    const res = await app.request(`/api/messages/dm/${otherId}`, {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ body: "40.4168,-3.7038", kind: "location" }),
    });
    expect(res.status).toBe(201);
    expect((res.body as { kind: string }).kind).toBe("location");
  });

  it("accepts attachment_url for an internal media path", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "att-a@test.es");
    const { userId: otherId } = await registerAndLogin(app, "att-b@test.es");
    const res = await app.request(`/api/messages/dm/${otherId}`, {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({
        body: "Mira la foto",
        kind: "photo",
        attachment_url: "/api/messages/media/abc123",
      }),
    });
    expect(res.status).toBe(201);
    expect((res.body as { attachment_url: string }).attachment_url).toBe(
      "/api/messages/media/abc123",
    );
  });

  it("accepts attachment_url for an absolute https URL", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "abs-a@test.es");
    const { userId: otherId } = await registerAndLogin(app, "abs-b@test.es");
    const res = await app.request(`/api/messages/dm/${otherId}`, {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({
        body: "Foto externa",
        kind: "photo",
        attachment_url: "https://example.com/photo.jpg",
      }),
    });
    expect(res.status).toBe(201);
    expect((res.body as { attachment_url: string }).attachment_url).toBe(
      "https://example.com/photo.jpg",
    );
  });
});

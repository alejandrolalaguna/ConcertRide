import { describe, expect, it } from "vitest";
import { buildTestApp, registerAndLogin, makeVerifiedDriver } from "./helpers";

describe("GET /api/festival-qnas/:slug (public)", () => {
  it("returns items array without auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/festival-qnas/mad-cool");
    expect(res.status).toBe(200);
    expect(Array.isArray((res.body as { items: unknown[] }).items)).toBe(true);
  });
});

describe("POST /api/festival-qnas", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/festival-qnas", {
      method: "POST",
      body: JSON.stringify({
        festival_slug: "mad-cool",
        question: "¿Hay parking?",
        answer: "Sí, parking gratuito junto al recinto.",
      }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects short questions", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `qna-${Math.random()}@cr.test`);
    const res = await app.request("/api/festival-qnas", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({
        festival_slug: "mad-cool",
        question: "p?",
        answer: "Una respuesta válida con suficiente longitud.",
      }),
    });
    expect(res.status).toBe(400);
  });

  it("blocks Q&As that contain URLs", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `qna2-${Math.random()}@cr.test`);
    const res = await app.request("/api/festival-qnas", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({
        festival_slug: "mad-cool",
        question: "¿Cuál es la mejor web?",
        answer: "Visita https://spam.example para más info.",
      }),
    });
    expect(res.status).toBe(400);
    expect((res.body as { error: string }).error).toBe("no_links_allowed");
  });

  it("creates a pending Q&A for a verified user", async () => {
    const app = buildTestApp();
    const { cookie } = await makeVerifiedDriver(app, `qna3-${Math.random()}@cr.test`);
    const res = await app.request("/api/festival-qnas", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({
        festival_slug: "mad-cool",
        question: "¿Hay sombra en el recinto?",
        answer: "Sí, hay varias carpas con sombra durante el día.",
      }),
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});

describe("POST /api/festival-qnas/:id/upvote", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/festival-qnas/qna_nope/upvote", { method: "POST" });
    expect(res.status).toBe(401);
  });

  it("returns 404 for unknown id", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `qnaU-${Math.random()}@cr.test`);
    const res = await app.request("/api/festival-qnas/qna_nope/upvote", {
      method: "POST",
      cookies: cookie,
    });
    expect(res.status).toBe(404);
  });
});

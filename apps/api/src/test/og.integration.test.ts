import { describe, expect, it } from "vitest";
import { buildTestApp } from "./helpers";

// The /api/og namespace only exposes:
//   GET /api/og/route/:slug.svg
//   GET /api/og/festival/:slug.svg
// There's no /api/og/home or /api/og/concerts/:id route in the codebase, so we
// validate the two endpoints that do exist and expect 404 for the others.

describe("GET /api/og/festival/:slug.svg", () => {
  it("returns 404 for unknown festival slug", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/og/festival/no-such-festival.svg");
    expect(res.status).toBe(404);
  });

  // §AL.6: este test ACEPTABA 200 o 404, así que no podía detectar que el
  // handler 404-eaba SIEMPRE. El patrón `/:slug.svg` no vincula el parámetro
  // en Hono (`param("slug")` = undefined), de modo que NINGÚN slug válido
  // devolvía imagen. Ahora se exige 200 + SVG real para un slug que existe.
  it("returns real SVG bytes for a valid festival slug", async () => {
    const { request } = buildTestApp();
    const res = await request("/api/og/festival/mad-cool.svg");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")?.startsWith("image/svg+xml")).toBe(true);
    // El helper devuelve ArrayBuffer para content-type image/*
    const body = new TextDecoder().decode(res.body as ArrayBuffer);
    expect(body.startsWith("<svg")).toBe(true);
    expect(body).toContain("MAD COOL");
  });

  it("returns real SVG bytes for a valid route slug", async () => {
    const { request } = buildTestApp();
    const res = await request("/api/og/route/madrid-mad-cool.svg");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")?.startsWith("image/svg+xml")).toBe(true);
    // El helper devuelve ArrayBuffer para content-type image/*
    const body = new TextDecoder().decode(res.body as ArrayBuffer);
    expect(body.startsWith("<svg")).toBe(true);
    expect(body).toContain("MADRID");
  });
});

describe("GET /api/og/route/:slug.svg", () => {
  it("returns 404 for unknown route slug", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/og/route/madrid-to-mars.svg");
    expect(res.status).toBe(404);
  });
});

describe("Undocumented OG paths (do not exist)", () => {
  it("GET /api/og/home is not served by this route", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/og/home");
    expect(res.status).toBe(404);
  });

  it("GET /api/og/concerts/:id is not served by this route", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/og/concerts/c_rosalia_wizink");
    expect(res.status).toBe(404);
  });
});

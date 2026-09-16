import { describe, it, expect } from "vitest";
import worker from "../index";
const env = { ENVIRONMENT: "production", SITE_URL: "https://concertride.me" } as never;
const ctx = { waitUntil: () => {}, passThroughOnException: () => {}, props: {} } as unknown as ExecutionContext;
const GB = { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" };

// Mirrors production: REAL prerendered pages self-canonical; anything else gets
// the SPA shell, which always carries the HOMEPAGE canonical.
const REAL = new Set([
  "/guia/festival-sin-coche", "/guia/presupuesto-festival-grupo",
  "/datos", "/datos/precio-medio-carpooling-vs-bus-festivales-2026",
  "/glosario", "/autor/equipo-concertride",
  "/alternativas-carpooling-festivales", "/viaje-compartido",
  "/mejor-carpooling-festivales-2026", "/guia-ir-festivales-2026",
  "/sala-de-prensa", "/comparativa/carpooling-vs-taxi-festival",
]);
const assetEnv = {
  ...(env as object),
  ASSETS: {
    fetch: async (req: Request) => {
      const p = new URL(req.url).pathname.replace(/\/$/, "") || "/";
      const canonical = REAL.has(p) ? `https://concertride.me${p}` : "https://concertride.me/";
      return new Response(`<html><head><link rel="canonical" href="${canonical}"></head><body>x</body></html>`,
        { status: 200, headers: { "content-type": "text/html" } });
    },
  },
};
async function get(p: string) {
  return await worker.fetch!(new Request(`https://concertride.me${p}`, { headers: GB }), assetEnv as never, ctx);
}

describe("PUBLIC prerendered pages must NOT 404 for bots (§AG safety)", () => {
  for (const p of REAL) {
    it(`serves ${p}`, async () => {
      expect((await get(p)).status, `${p} must not be 404`).not.toBe(404);
    });
  }
});

describe("UNKNOWN paths must 404, not clone the homepage (§AG)", () => {
  for (const p of ["/datos/zzfake", "/guia/zzfake", "/comparativa/zzfake", "/autor/zzfake",
                   "/zzfake-toplevel", "/datos/a/b/c", "/festivales/zzfake", "/rutas/zz-zz",
                   "/artistas/nobody", "/recintos/nowhere", "/concerts/c_fake123"]) {
    it(`404s ${p}`, async () => {
      expect((await get(p)).status, `${p} must be 404`).toBe(404);
    });
  }
});

describe("private SPA routes still render client-side (not 404)", () => {
  for (const p of ["/login", "/profile", "/mis-viajes", "/squads/abc", "/rides/xyz", "/memorias/1"]) {
    it(`does not 404 ${p}`, async () => {
      expect((await get(p)).status, `${p} must not be 404`).not.toBe(404);
    });
  }
});

describe("§AH: HEAD must mirror GET status (RFC 9110)", () => {
  async function head(p: string) {
    return await worker.fetch!(
      new Request(`https://concertride.me${p}`, { method: "HEAD", headers: GB }),
      assetEnv as never, ctx,
    );
  }
  const fakes = ["/festivales/zzz-fake", "/rutas/fake-fake", "/blog/nope",
                 "/concerts/c_fake123", "/artistas/nobody", "/datos/zzfake"];
  for (const p of fakes) {
    it(`HEAD ${p} is 404, not 200`, async () => {
      const res = await head(p);
      expect(res.status, `HEAD ${p} must match GET's 404`).toBe(404);
    });
  }
  it("404 carries X-Robots-Tag: noindex (not meta-only)", async () => {
    const res = await worker.fetch!(
      new Request("https://concertride.me/festivales/zzz-fake", { headers: GB }),
      assetEnv as never, ctx,
    );
    expect(res.status).toBe(404);
    expect(res.headers.get("x-robots-tag")).toContain("noindex");
  });
  it("HEAD returns no body", async () => {
    const res = await head("/festivales/zzz-fake");
    expect(await res.text()).toBe("");
  });
  it("HEAD on a real page does NOT 404", async () => {
    expect((await head("/glosario")).status).not.toBe(404);
  });
});

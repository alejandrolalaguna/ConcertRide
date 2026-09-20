// Regression tests for the GSC Coverage wave of 2026-09-16 (SKILL.md §AF).
//
// These lock in three fixes that are easy to silently undo:
//   1. www.concertride.me must 301 to the apex — both hosts are registered as
//      `custom_domain` in wrangler.jsonc, and for months BOTH served 200,
//      duplicating the whole catalogue (§AF.2).
//   2. A trailing slash must produce a **301**, not Cloudflare's asset-layer
//      **307**. A 307 is temporary, so Google keeps the slashed URL indexed
//      forever instead of consolidating it (§AF.1).
//   3. The §AE locale guard must keep working now that `run_worker_first`
//      makes the Worker run before static assets (§AF.0).
//
// The app's default export is wrapped by `Sentry.withSentry`, whose `fetch` is
// optional in the type and takes (request, env, ctx) — hence the non-null
// assertion and the stub ExecutionContext below.
import { describe, it, expect } from "vitest";
import worker from "../index";

const env = { ENVIRONMENT: "production", SITE_URL: "https://concertride.me" } as never;

const ctx = {
  waitUntil: () => {},
  passThroughOnException: () => {},
  props: {},
} as unknown as ExecutionContext;

async function fetchApp(url: string, envOverride: unknown = env): Promise<Response> {
  return await worker.fetch!(new Request(url), envOverride as never, ctx);
}

describe("canonical host + trailing slash (§AF.1, §AF.2)", () => {
  it("301s www to the apex, preserving path and query", async () => {
    const res = await fetchApp("https://www.concertride.me/festivales/mad-cool?a=1");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://concertride.me/festivales/mad-cool?a=1");
  });

  it("301s (never 307) the trailing slash", async () => {
    const res = await fetchApp("https://concertride.me/festivales/mad-cool/");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("/festivales/mad-cool");
  });

  it("upgrades http and drops www in a SINGLE hop (no redirect chain)", async () => {
    const res = await fetchApp("http://www.concertride.me/faq");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://concertride.me/faq");
  });

  it("leaves the apex root alone", async () => {
    const res = await fetchApp("https://concertride.me/");
    expect(res.status).not.toBe(301);
  });
});

describe("§AE locale guard survives run_worker_first (§AF.0)", () => {
  it("does NOT redirect the 5 translated /en pilot paths", async () => {
    for (const p of [
      "/en",
      "/en/concerts",
      "/en/festivales/mad-cool",
      "/en/festivales/primavera-sound",
      "/en/festivales/sonar",
    ]) {
      const res = await fetchApp(`https://concertride.me${p}`);
      expect(res.status, `${p} must fall through to its prerendered asset`).not.toBe(301);
    }
  });

  it("301s untranslated /en paths to the ES equivalent, preserving UTM", async () => {
    const res = await fetchApp("https://concertride.me/en/rutas/madrid-mad-cool?utm_source=x");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("/rutas/madrid-mad-cool?utm_source=x");
  });

  // §AI (2026-09-20): the locale middleware runs AFTER LEGACY_REDIRECTS, so a
  // stripped base that is itself a legacy key used to 301 twice. Measured on the
  // GSC export 2026-09-20: /en/blog/mad-cool-2026-guia-completa carried 3 clicks
  // and chained /en/X → /X → /Y. Must now be a SINGLE hop to the final target.
  it("collapses /en → legacy-key chains into one hop", async () => {
    const res = await fetchApp("https://concertride.me/en/blog/mad-cool-2026-guia-completa");
    expect(res.status).toBe(301);
    expect(
      res.headers.get("location"),
      "must land on the §AH consolidation winner directly, not the intermediate URL",
    ).toBe("/blog/madcool-2026-guia-completa");
  });

  it("does not mistake /enlaces or /encuentros for the /en prefix", async () => {
    for (const p of ["/enlaces", "/encuentros"]) {
      const res = await fetchApp(`https://concertride.me${p}`);
      const loc = res.headers.get("location") ?? "";
      expect(loc.startsWith("/laces") || loc.startsWith("/cuentros"), `${p} was wrongly stripped`).toBe(false);
    }
  });
});

// §AI (2026-09-20): 20 URLs /en/conciertos/<ciudad>/<año> con 233 clics medidos
// (merida/2027 84, fuengirola/2027 73…) caían en 404 duro: sin asset estático
// (solo se prerenderiza el año en curso) y sin entrada en el dict de bots
// CITIES de seoPrerender (17 ciudades vs 117 en cityLandings).
describe("§AI city-year sin asset 301 al padre", () => {
  it("301s a non-current year to the parent city page", async () => {
    const res = await fetchApp("https://concertride.me/conciertos/merida/2027");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("/conciertos/merida");
  });

  it("collapses the /en variant into a single hop", async () => {
    const res = await fetchApp("https://concertride.me/en/conciertos/fuengirola/2027");
    expect(res.status).toBe(301);
    // §AE strips /en first; the city-year rule then applies on the next pass.
    expect(res.headers.get("location")).toBe("/conciertos/fuengirola/2027");
  });

  it("leaves the current year alone (it has a real prerendered asset)", async () => {
    const res = await fetchApp("https://concertride.me/conciertos/merida/2026");
    expect(res.status, "current-year page must keep serving its own asset").not.toBe(301);
  });

  it("does not touch unknown city slugs", async () => {
    const res = await fetchApp("https://concertride.me/conciertos/ciudad-inventada/2027");
    expect(res.headers.get("location")).not.toBe("/conciertos/ciudad-inventada");
  });
});

describe("legacy redirects still fire (§AF.6)", () => {
  it("301s the retired author path to the collective one", async () => {
    const res = await fetchApp("https://concertride.me/autor/alejandro-lalaguna");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("/autor/equipo-concertride");
  });

  it("301s the Spanish-plural index to /concerts", async () => {
    const res = await fetchApp("https://concertride.me/conciertos");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("/concerts");
  });
});

describe("asset fallthrough still works with run_worker_first (§AF.0)", () => {
  const assetEnv = {
    ...(env as object),
    ASSETS: {
      fetch: async () =>
        new Response("<html><body>asset</body></html>", {
          status: 200,
          headers: { "content-type": "text/html" },
        }),
    },
  };

  it("serves prerendered assets (does not 404) for public SEO paths", async () => {
    for (const p of ["/concerts", "/festivales", "/blog", "/rutas", "/festivales/mad-cool"]) {
      const res = await fetchApp(`https://concertride.me${p}`, assetEnv);
      expect(res.status, `${p} should serve its asset`).toBe(200);
    }
  });

  it("answers the trailing-slash 301 WITHOUT touching the asset layer", async () => {
    // If this ever hits the asset layer again, Cloudflare's html_handling would
    // answer with its non-configurable 307 and §AF.1 would silently regress.
    let assetCalled = false;
    const spyEnv = {
      ...(env as object),
      ASSETS: {
        fetch: async () => {
          assetCalled = true;
          return new Response("x", { status: 200 });
        },
      },
    };
    const res = await fetchApp("https://concertride.me/festivales/mad-cool/", spyEnv);
    expect(res.status).toBe(301);
    expect(assetCalled, "Worker must answer the 301 itself, not defer to the asset layer").toBe(false);
  });
});

describe("§AH: near-duplicate blog consolidation", () => {
  it("301s the weaker Mad Cool guide to the higher-traffic twin", async () => {
    const res = await fetchApp("https://concertride.me/blog/mad-cool-2026-guia-completa");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("/blog/madcool-2026-guia-completa");
  });

  it("301s the shorter 'sin coche' guide to the longer twin", async () => {
    const res = await fetchApp("https://concertride.me/blog/como-ir-festival-sin-coche-guia-definitiva-2026");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("/blog/como-ir-festival-sin-coche-guia");
  });

  it("leaves the surviving twins alone", async () => {
    for (const p of ["/blog/madcool-2026-guia-completa", "/blog/como-ir-festival-sin-coche-guia"]) {
      const res = await fetchApp(`https://concertride.me${p}`);
      expect(res.status, `${p} must not redirect`).not.toBe(301);
    }
  });
});

// Markdown for agents (SKILL.md §AM): `.md` suffix, `Accept` negotiation and
// /api/md/*, served from the build-time packs through the ASSETS binding.
//
// Locks in the SEO invariants: every markdown response is noindex, browsers
// and `*/*` keep getting HTML, negotiated responses never sit in a shared
// cache, and HTML responses advertise the agent files.
import { describe, it, expect } from "vitest";
import worker from "../index";
import { mdPackAsset } from "../../../web/src/lib/md/site";

const FAQ_MD = "# Preguntas frecuentes\n\n> Todo sobre ConcertRide.\n\nCanonical: https://concertride.me/faq\nLast updated: 2026-05-21\n\n## Sobre carpooling\n";
const HOME_MD = "# Tu plan, sin coche.\n";

const packs = new Map<string, Record<string, [string, string]>>();
for (const [path, md] of [["/faq", FAQ_MD], ["/", HOME_MD]] as const) {
  const asset = mdPackAsset(path);
  packs.set(asset, { ...(packs.get(asset) ?? {}), [path]: [md, "2026-05-21"] });
}

const SHELL = '<!doctype html><html><head><title>ConcertRide</title></head><body><main id="main"></main></body></html>';

const ASSETS = {
  fetch: async (input: Request | string) => {
    const url = new URL(typeof input === "string" ? input : input.url);
    const pack = packs.get(url.pathname);
    if (pack) return new Response(JSON.stringify(pack), { headers: { "content-type": "application/json" } });
    if (url.pathname === "/_md/catalog.json") {
      return new Response(JSON.stringify({ count: 1, pages: [{ path: "/faq" }] }), { headers: { "content-type": "application/json" } });
    }
    // not_found_handling = single-page-application: every miss is the shell, 200.
    return new Response(SHELL, { headers: { "content-type": "text/html; charset=utf-8" } });
  },
};

const env = { ENVIRONMENT: "production", SITE_URL: "https://concertride.me", ASSETS } as never;
const ctx = { waitUntil: () => {}, passThroughOnException: () => {}, props: {} } as unknown as ExecutionContext;

function get(path: string, init: RequestInit = {}): Promise<Response> {
  return worker.fetch!(new Request(`https://concertride.me${path}`, init) as never, env, ctx) as Promise<Response>;
}

describe("markdown via .md suffix", () => {
  it("serves the page with the agent headers", async () => {
    const res = await get("/faq.md");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(res.headers.get("x-robots-tag")).toBe("noindex, follow");
    expect(res.headers.get("content-location")).toBe("https://concertride.me/faq");
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    expect(Number(res.headers.get("x-markdown-tokens"))).toBe(Math.ceil(FAQ_MD.length / 4));
    expect(res.headers.get("last-modified")).toBe("Thu, 21 May 2026 00:00:00 GMT");
    expect(res.headers.get("cache-control")).toMatch(/^public/);
    expect(res.headers.get("link")).toBeNull(); // never noindex + canonical (§AD)
    expect(await res.text()).toBe(FAQ_MD);
  });

  it("maps /index.md to the home page", async () => {
    const res = await get("/index.md");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe(HOME_MD);
  });

  it("HEAD mirrors GET without a body", async () => {
    const res = await get("/faq.md", { method: "HEAD" });
    expect(res.status).toBe(200);
    expect(res.headers.get("x-markdown-tokens")).toBeTruthy();
    expect(await res.text()).toBe("");
  });

  it("answers a markdown 404 (never HTML) for unknown or private pages", async () => {
    for (const p of ["/does-not-exist.md", "/festivales/zzfake.md", "/login.md", "/mensajes.md"]) {
      const res = await get(p);
      expect(res.status, p).toBe(404);
      expect(res.headers.get("content-type"), p).toBe("text/markdown; charset=utf-8");
      expect(res.headers.get("x-robots-tag"), p).toBe("noindex, follow");
    }
  });

  it("301s a legacy slug to its new .md URL in one hop", async () => {
    const res = await get("/blog/mad-cool-2026-guia-completa.md");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("/blog/madcool-2026-guia-completa.md");
  });

  it("handles CORS preflight", async () => {
    const res = await get("/faq.md", { method: "OPTIONS" });
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-methods")).toContain("GET");
  });
});

describe("markdown via Accept negotiation", () => {
  it("serves markdown when text/markdown outranks text/html", async () => {
    const res = await get("/faq", { headers: { Accept: "text/markdown, text/html;q=0.5" } });
    expect(res.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(res.headers.get("vary")).toBe("Accept");
    expect(res.headers.get("cache-control")).toMatch(/^private/);
  });

  it("keeps HTML for */*, browsers and a missing Accept", async () => {
    for (const accept of [undefined, "*/*", "text/html,application/xhtml+xml,*/*;q=0.8", "text/html, text/markdown"]) {
      const res = await get("/faq", accept ? { headers: { Accept: accept } } : {});
      expect(res.headers.get("content-type"), String(accept)).toContain("text/html");
    }
  });

  it("falls back to HTML when the path has no markdown version", async () => {
    const res = await get("/profile", { headers: { Accept: "text/markdown" } });
    expect(res.headers.get("content-type")).toContain("text/html");
  });
});

describe("/api/md", () => {
  it("serves the same markdown under /api/md/<path>", async () => {
    const res = await get("/api/md/faq");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe(FAQ_MD);
  });

  it("serves the catalog as JSON", async () => {
    const res = await get("/api/md/_catalog");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect((await res.json()) as { count: number }).toMatchObject({ count: 1 });
  });
});

describe("HTML responses advertise the agent files", () => {
  it("adds Link rel=describedby and Vary: Accept on markdown-capable pages", async () => {
    const res = await get("/faq");
    expect(res.headers.get("link")).toContain('</llms.txt>; rel="describedby"');
    expect(res.headers.get("link")).toContain("</ai.txt>");
    expect(res.headers.get("vary")).toContain("Accept");
  });

  it("keeps the internal packs private", async () => {
    const res = await get(mdPackAsset("/faq"));
    expect(res.status).toBe(404);
  });
});

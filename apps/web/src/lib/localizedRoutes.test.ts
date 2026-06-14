import { describe, expect, it } from "vitest";
import { SITE_URL } from "./siteUrl";
import {
  basePath,
  enUrl,
  esUrl,
  hreflangAlternates,
  localizeCanonical,
  LOCALIZED_PATHS,
} from "./localizedRoutes";

describe("localizedRoutes — basePath", () => {
  it("strips origin and the /en prefix to the locale-stripped base path", () => {
    expect(basePath(`${SITE_URL}/en/concerts`)).toBe("/concerts");
    expect(basePath(`${SITE_URL}/concerts`)).toBe("/concerts");
    expect(basePath(`${SITE_URL}/en`)).toBe("/");
    expect(basePath(`${SITE_URL}`)).toBe("/");
    expect(basePath("/en/festivales/mad-cool")).toBe("/festivales/mad-cool");
  });
  it("normalizes trailing slashes (except root)", () => {
    expect(basePath(`${SITE_URL}/concerts/`)).toBe("/concerts");
    expect(basePath(`${SITE_URL}/`)).toBe("/");
  });
});

describe("localizedRoutes — esUrl / enUrl", () => {
  it("builds absolute ES and EN URLs without trailing slash (root → /en)", () => {
    expect(esUrl("/concerts")).toBe(`${SITE_URL}/concerts`);
    expect(enUrl("/concerts")).toBe(`${SITE_URL}/en/concerts`);
    expect(esUrl("/")).toBe(SITE_URL);
    expect(enUrl("/")).toBe(`${SITE_URL}/en`);
  });
});

describe("localizedRoutes — localizeCanonical", () => {
  it("rewrites a self ES canonical to the /en variant", () => {
    expect(localizeCanonical(`${SITE_URL}/concerts`, "en")).toBe(`${SITE_URL}/en/concerts`);
    expect(localizeCanonical(`${SITE_URL}`, "en")).toBe(`${SITE_URL}/en`);
  });
  it("is idempotent on an already-localized URL", () => {
    expect(localizeCanonical(`${SITE_URL}/en/concerts`, "en")).toBe(`${SITE_URL}/en/concerts`);
  });
  it("leaves Spanish canonicals untouched", () => {
    expect(localizeCanonical(`${SITE_URL}/concerts`, "es")).toBe(`${SITE_URL}/concerts`);
  });
});

describe("localizedRoutes — hreflangAlternates (reciprocity)", () => {
  it("emits reciprocal es/en/x-default for a localized page (from either variant)", () => {
    const fromEs = hreflangAlternates(`${SITE_URL}/concerts`);
    const fromEn = hreflangAlternates(`${SITE_URL}/en/concerts`);
    const expected = [
      { hreflang: "es-ES", href: `${SITE_URL}/concerts` },
      { hreflang: "en", href: `${SITE_URL}/en/concerts` },
      { hreflang: "x-default", href: `${SITE_URL}/concerts` },
    ];
    expect(fromEs).toEqual(expected);
    // Reciprocity: the EN variant resolves to the identical alternate set.
    expect(fromEn).toEqual(expected);
  });

  it("x-default points to the Spanish (default) URL", () => {
    const alts = hreflangAlternates(`${SITE_URL}/concerts`) ?? [];
    const xdefault = alts.find((a) => a.hreflang === "x-default");
    expect(xdefault?.href).toBe(`${SITE_URL}/concerts`);
  });

  it("handles the home root correctly", () => {
    expect(hreflangAlternates(SITE_URL)).toEqual([
      { hreflang: "es-ES", href: SITE_URL },
      { hreflang: "en", href: `${SITE_URL}/en` },
      { hreflang: "x-default", href: SITE_URL },
    ]);
  });

  it("returns null for pages NOT in the localized set (no broken hreflang to 404s)", () => {
    // Festivals are NOT exposed yet (foundation laid, content pending) — must not
    // emit hreflang until their /en/ variant is fully translated.
    expect(hreflangAlternates(`${SITE_URL}/festivales/mad-cool`)).toBeNull();
    expect(hreflangAlternates(`${SITE_URL}/blog/whatever`)).toBeNull();
    expect(hreflangAlternates(`${SITE_URL}/rutas/madrid-mad-cool`)).toBeNull();
  });

  it("only declares pages that are actually localized", () => {
    // Guard: every path in the set must produce reciprocal alternates.
    for (const p of LOCALIZED_PATHS) {
      const canonical = p === "/" ? SITE_URL : `${SITE_URL}${p}`;
      const alts = hreflangAlternates(canonical);
      expect(alts, `expected alternates for ${p}`).not.toBeNull();
      expect(alts).toHaveLength(3);
    }
  });
});

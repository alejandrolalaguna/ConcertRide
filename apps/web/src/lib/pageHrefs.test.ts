import { describe, expect, it } from "vitest";
import { FESTIVAL_LANDINGS } from "./festivalLandings";
import { REGION_LANDINGS } from "./regionLandings";
import { CITY_LANDINGS } from "./cityLandings";
import { FESTIVAL_PAGE_SLUGS, REGION_PAGE_SLUGS, festivalPageHref, regionPageHref } from "./pageHrefs";
import { cityPageHref } from "./cityPageHref";

describe("page href helpers", () => {
  it("FESTIVAL_PAGE_SLUGS / REGION_PAGE_SLUGS mirror the data modules (regenerate pageHrefs.ts if this fails)", () => {
    expect([...FESTIVAL_PAGE_SLUGS].sort()).toEqual(FESTIVAL_LANDINGS.map((f) => f.slug).sort());
    expect([...REGION_PAGE_SLUGS].sort()).toEqual(REGION_LANDINGS.map((r) => r.slug).sort());
  });

  it("resolves aliases and falls back to the hub instead of a 404", () => {
    expect(festivalPageHref("mad-cool")).toBe("/festivales/mad-cool");
    expect(festivalPageHref("cap-roig")).toBe("/festivales/festival-castell-de-cap-roig");
    expect(festivalPageHref("no-such-festival")).toBe("/festivales");
    expect(regionPageHref("castilla-y-leon")).toBe("/festivales-en/castilla-leon");
  });

  it("only links city pages that exist", () => {
    expect(cityPageHref(CITY_LANDINGS[0]!.slug)).toBe(`/conciertos/${CITY_LANDINGS[0]!.slug}`);
    expect(cityPageHref("benicassim")).toBeNull();
    expect(cityPageHref(undefined)).toBeNull();
  });

  it("every alias target exists", () => {
    for (const slug of ["holika-festival", "cap-roig", "festival-de-jazz-de-vitoria", "festival-internacional-musica-canarias", "stone-music", "sonorama"]) {
      expect(festivalPageHref(slug)).not.toBe("/festivales");
    }
  });
});

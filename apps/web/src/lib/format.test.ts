import { describe, expect, it } from "vitest";
import { formatPrice, initials } from "./format";

describe("initials", () => {
  it("returns two uppercase letters for a two-word name", () => {
    expect(initials("Laura Martínez")).toBe("LM");
  });

  it("returns one letter for a single-word name", () => {
    expect(initials("Dani")).toBe("D");
  });

  it("handles extra whitespace and empty parts", () => {
    expect(initials("  Ana    Belén  ")).toBe("AB");
  });

  it("caps at two initials for longer names", () => {
    expect(initials("Juan Antonio de la Cruz")).toBe("JA");
  });

  it("returns empty string for empty input", () => {
    expect(initials("")).toBe("");
  });
});

describe("formatPrice", () => {
  it("rounds to whole euros and prefixes €", () => {
    expect(formatPrice(18.4)).toBe("€18");
    expect(formatPrice(18.6)).toBe("€19");
  });
});

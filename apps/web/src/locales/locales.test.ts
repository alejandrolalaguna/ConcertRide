import { describe, expect, it } from "vitest";
import { es } from "./es";
import { ca } from "./ca";
import { en } from "./en";
import { DICTIONARIES, LOCALES } from "./index";

// Flatten a nested dictionary into { "ns.key": "value" }.
function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") Object.assign(out, flatten(v as Record<string, unknown>, key));
    else if (typeof v === "string") out[key] = v;
  }
  return out;
}

// `{plural}` is a grammar helper, not a data token: Spanish pluralises both noun
// and adjective ("plazas confirmadas") while English pluralises only the noun
// ("seats confirmed"), so its occurrence count legitimately differs per language.
// We compare only DATA placeholders ({count}, {name}, {driver}, {price}, …).
const GRAMMAR_TOKENS = new Set(["plural"]);

function placeholders(value: string): string[] {
  return [...value.matchAll(/\{(\w+)\}/g)]
    .map((m) => m[1] ?? "")
    .filter((p) => !GRAMMAR_TOKENS.has(p))
    .sort();
}

const flatEs = flatten(es);
const flatCa = flatten(ca);
const flatEn = flatten(en);
const keys = Object.keys(flatEs);

describe("locale catalogue integrity", () => {
  it("registers all three locales", () => {
    expect(LOCALES).toEqual(["es", "ca", "en"]);
    expect(Object.keys(DICTIONARIES)).toEqual(["es", "ca", "en"]);
  });

  it("ca and en have exactly the same keys as es (no missing / extra)", () => {
    expect(Object.keys(flatCa).sort()).toEqual(keys.slice().sort());
    expect(Object.keys(flatEn).sort()).toEqual(keys.slice().sort());
  });

  it("interpolation placeholders match across es / ca / en for every key", () => {
    const mismatches: string[] = [];
    for (const key of keys) {
      const base = placeholders(flatEs[key] ?? "").join(",");
      const caP = placeholders(flatCa[key] ?? "").join(",");
      const enP = placeholders(flatEn[key] ?? "").join(",");
      if (caP !== base) mismatches.push(`${key}: es[${base}] vs ca[${caP}]`);
      if (enP !== base) mismatches.push(`${key}: es[${base}] vs en[${enP}]`);
    }
    expect(mismatches).toEqual([]);
  });

  it("no translated value is left empty", () => {
    const empties: string[] = [];
    for (const key of keys) {
      if (!flatCa[key]?.trim()) empties.push(`ca.${key}`);
      if (!flatEn[key]?.trim()) empties.push(`en.${key}`);
    }
    expect(empties).toEqual([]);
  });
});

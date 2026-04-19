import { describe, expect, it } from "vitest";
import { computeFingerprint } from "./fingerprint";

describe("computeFingerprint", () => {
  it("produces a stable hex sha1 for the same input", async () => {
    const a = await computeFingerprint("Rosalía", "Madrid", "2026-05-22T21:00:00.000+02:00");
    const b = await computeFingerprint("Rosalía", "Madrid", "2026-05-22T21:00:00.000+02:00");
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{40}$/);
  });

  it("is case-insensitive on artist and city", async () => {
    const a = await computeFingerprint("ROSALÍA", "MADRID", "2026-05-22T21:00:00.000+02:00");
    const b = await computeFingerprint("rosalía", "madrid", "2026-05-22T21:00:00.000+02:00");
    expect(a).toBe(b);
  });

  it("ignores the time portion of the date — same day = same fingerprint", async () => {
    const a = await computeFingerprint("Rosalía", "Madrid", "2026-05-22T21:00:00.000+02:00");
    const b = await computeFingerprint("Rosalía", "Madrid", "2026-05-22T23:30:00.000+01:00");
    expect(a).toBe(b);
  });

  it("produces different hashes for different shows", async () => {
    const a = await computeFingerprint("Rosalía", "Madrid", "2026-05-22T21:00:00.000+02:00");
    const b = await computeFingerprint("Rosalía", "Barcelona", "2026-05-22T21:00:00.000+02:00");
    const c = await computeFingerprint("Rosalía", "Madrid", "2026-05-23T21:00:00.000+02:00");
    expect(a).not.toBe(b);
    expect(a).not.toBe(c);
    expect(b).not.toBe(c);
  });
});

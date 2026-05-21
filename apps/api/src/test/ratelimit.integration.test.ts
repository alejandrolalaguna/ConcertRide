import { describe, expect, it } from "vitest";
import { buildTestApp } from "./helpers";

// The helpers' request() randomises cf-connecting-ip per call to avoid
// cross-suite interference. Tests that need the limiter to actually trip
// MUST pin the IP explicitly via the headers override.

describe("Auth limiter (rl:auth) — 10/min/IP", () => {
  it("trips on the 11th login attempt from the same IP within the window", async () => {
    const app = buildTestApp();
    const fixedIp = "203.0.113.42";
    let lastStatus = 0;
    for (let i = 0; i < 12; i++) {
      const res = await app.request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: `x${i}@cr.test`, password: "WrongPass1!" }),
        headers: { "cf-connecting-ip": fixedIp },
      });
      lastStatus = res.status;
      if (res.status === 429) break;
    }
    expect(lastStatus).toBe(429);
  });

  it("doesn't trip across different IPs", async () => {
    const app = buildTestApp();
    let any429 = false;
    for (let i = 0; i < 12; i++) {
      const res = await app.request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: `y${i}@cr.test`, password: "WrongPass1!" }),
        headers: { "cf-connecting-ip": `198.51.100.${i + 1}` },
      });
      if (res.status === 429) any429 = true;
    }
    expect(any429).toBe(false);
  });
});

describe("Write limiter (rl:write) — 60/min/IP", () => {
  it("trips on the 61st POST from the same IP within the window", async () => {
    const app = buildTestApp();
    const fixedIp = "203.0.113.99";
    let last429 = 0;
    let total = 0;
    for (let i = 0; i < 65; i++) {
      total++;
      const res = await app.request("/api/alerts/festival", {
        method: "POST",
        body: JSON.stringify({ email: `w${i}@cr.test`, festival_slug: `mad-cool-${i}` }),
        headers: { "cf-connecting-ip": fixedIp },
      });
      if (res.status === 429) {
        last429 = total;
        break;
      }
    }
    expect(last429).toBeGreaterThan(0);
    expect(last429).toBeLessThanOrEqual(61);
  });
});

describe("Write limiter does NOT throttle reads", () => {
  it("100 GETs from the same IP all succeed", async () => {
    const app = buildTestApp();
    const fixedIp = "203.0.113.150";
    let any429 = false;
    for (let i = 0; i < 100; i++) {
      const res = await app.request("/api/venues", {
        headers: { "cf-connecting-ip": fixedIp },
      });
      if (res.status === 429) any429 = true;
    }
    expect(any429).toBe(false);
  });
});

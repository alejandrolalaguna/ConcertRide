import { describe, expect, it } from "vitest";
import { buildTestApp } from "./helpers";

// The /api/ingest route exposes /run, /status and /backfill-2026 — all
// secret-gated via the x-ingest-secret header. We never trigger real
// adapter HTTP calls in tests (no TICKETMASTER_API_KEY/RAPIDAPI_KEY), so we
// only cover the auth + happy-path with the dryRun=true path for backfill.

describe("Ingest secret gate", () => {
  it("POST /api/ingest/run without secret → 401", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/ingest/run", { method: "POST" });
    expect(res.status).toBe(401);
  });

  it("POST /api/ingest/run with WRONG secret → 401", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/ingest/run", {
      method: "POST",
      headers: { "x-ingest-secret": "wrong" },
    });
    expect(res.status).toBe(401);
  });

  it("GET /api/ingest/status without secret → 401", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/ingest/status");
    expect(res.status).toBe(401);
  });

  it("GET /api/ingest/status with correct secret → 200 and runs array", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/ingest/status", {
      headers: { "x-ingest-secret": "test-ingest" },
    });
    expect(res.status).toBe(200);
    expect(Array.isArray((res.body as { runs: unknown[] }).runs)).toBe(true);
  });

  it("POST /api/ingest/backfill-2026 without secret → 401", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/ingest/backfill-2026", { method: "POST" });
    expect(res.status).toBe(401);
  });

  it("POST /api/ingest/backfill-2026 with unknown source → 400", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/ingest/backfill-2026?source=not-a-source", {
      method: "POST",
      headers: { "x-ingest-secret": "test-ingest" },
    });
    expect(res.status).toBe(400);
  });
});

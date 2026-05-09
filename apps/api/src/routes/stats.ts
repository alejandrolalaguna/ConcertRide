import { Hono } from "hono";
import type { HonoEnv } from "../types";
import { requireUser } from "../lib/identity";
import { computeFestivalHistory, computeTravelStats } from "../lib/stats";
import { predictRideDemand } from "../lib/demand-prediction";

const route = new Hono<HonoEnv>();

// Wrapped-style yearly stats. Defaults to all-time when ?year is missing.
route.get("/me", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const yearRaw = c.req.query("year");
  const year = yearRaw ? Number.parseInt(yearRaw, 10) : 0;
  const stats = await computeTravelStats(c.var.store, userOrResp.id, Number.isFinite(year) ? year : 0);
  return c.json(stats);
});

route.get("/me/festival-history", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const items = await computeFestivalHistory(c.var.store, userOrResp.id);
  return c.json({ items });
});

// Demand prediction — public read so the LandingPage CTA can surface
// even for logged-out visitors ("12 people want to go to Mad Cool but
// only 1 ride is published — be the second").
route.get("/demand", async (c) => {
  const limit = Number.parseInt(c.req.query("limit") ?? "8", 10);
  const items = await predictRideDemand(c.var.store, { limit: Number.isFinite(limit) ? limit : 8 });
  return c.json({ items });
});

export default route;

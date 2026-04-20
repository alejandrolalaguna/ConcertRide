import { Hono } from "hono";
import type { HonoEnv } from "../types";
import { fetchFuelPrices, type FuelPrices } from "../lib/fuel";

const KV_KEY = "fuel_prices_es";

const route = new Hono<HonoEnv>();

route.get("/", async (c) => {
  // Try KV cache first
  const cached = await c.env.CACHE.get(KV_KEY, "json") as FuelPrices | null;
  if (cached) {
    return c.json(cached, 200, { "Cache-Control": "public, max-age=3600" });
  }

  // Cache miss — fetch live and store for 8 days
  try {
    const prices = await fetchFuelPrices();
    c.executionCtx.waitUntil(
      c.env.CACHE.put(KV_KEY, JSON.stringify(prices), { expirationTtl: 8 * 24 * 3600 }),
    );
    return c.json(prices, 200, { "Cache-Control": "public, max-age=3600" });
  } catch (err) {
    console.error("fuel-price fetch failed:", err);
    // Fallback to reasonable hardcoded averages so the UI never breaks
    const fallback: FuelPrices = {
      gasoline95: 1.72,
      diesel: 1.62,
      updatedAt: new Date().toISOString(),
    };
    return c.json(fallback, 200, { "Cache-Control": "public, max-age=300" });
  }
});

export default route;

export { KV_KEY };

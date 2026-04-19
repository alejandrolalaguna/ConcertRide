import { Hono } from "hono";
import type { VenuesResponse } from "@concertride/types";
import type { HonoEnv } from "../types";

const route = new Hono<HonoEnv>();

route.get("/", async (c) => {
  const venues = await c.var.store.listVenues();
  const body: VenuesResponse = { venues };
  return c.json(body);
});

export default route;

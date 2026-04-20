import { Hono } from "hono";
import type { ReviewsResponse } from "@concertride/types";
import type { HonoEnv } from "../types";

const route = new Hono<HonoEnv>();

route.get("/:id/reviews", async (c) => {
  const userId = c.req.param("id");
  const reviews = await c.var.store.listReviewsForUser(userId);
  const body: ReviewsResponse = { reviews, total: reviews.length };
  return c.json(body);
});

export default route;

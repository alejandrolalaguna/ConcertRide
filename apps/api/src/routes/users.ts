import { Hono } from "hono";
import type { ReviewsResponse } from "@concertride/types";
import type { HonoEnv } from "../types";

const route = new Hono<HonoEnv>();

// Public profile routes accept the user ID without the "u_" prefix
// (e.g. GET /users/a1b2c3d4 instead of /users/u_a1b2c3d4) so internal
// ID structure is not exposed in URLs. The prefix is re-added here.
function resolveUserId(raw: string): string {
  return raw.startsWith("u_") ? raw : `u_${raw}`;
}

route.get("/:id", async (c) => {
  const user = await c.var.store.getUser(resolveUserId(c.req.param("id")));
  if (!user) return c.json({ error: "not_found" }, 404);
  // Return only fields safe for public consumption.
  // phone, home_city, referral_code, and internal timestamps are private.
  return c.json({
    id: user.id,
    name: user.name,
    avatar_url: user.avatar_url,
    verified: user.verified,
    license_verified: user.license_verified,
    rating: user.rating,
    rating_count: user.rating_count,
    rides_given: user.rides_given,
    car_model: user.car_model,
    car_color: user.car_color,
    smoker: user.smoker,
    has_license: user.has_license,
  });
});

route.get("/:id/reviews", async (c) => {
  const userId = resolveUserId(c.req.param("id"));
  const reviews = await c.var.store.listReviewsForUser(userId);
  const body: ReviewsResponse = { reviews, total: reviews.length };
  return c.json(body);
});

export default route;

import type { MiddlewareHandler } from "hono";
import type { HonoEnv } from "./types";
import { getStore } from "./store/factory";

export const storeMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  c.set("store", await getStore(c.env));
  await next();
};

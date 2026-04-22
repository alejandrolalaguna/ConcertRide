// Simple fixed-window rate limiter backed by the CACHE KV namespace.
// Bucket key = `rl:<scope>:<ip>:<window>`. Increment is best-effort (KV is
// eventually consistent) — adequate for auth brute-force throttling, not for
// strict quotas.

import type { Context, MiddlewareHandler } from "hono";
import type { HonoEnv } from "../types";

interface Options {
  scope: string;
  limit: number;
  windowSec: number;
}

function clientIp(c: Context<HonoEnv>): string {
  return (
    c.req.header("cf-connecting-ip") ||
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function rateLimit({ scope, limit, windowSec }: Options): MiddlewareHandler<HonoEnv> {
  return async (c, next) => {
    const kv = c.env.CACHE;
    if (!kv) return next(); // no KV bound (e.g. tests) — skip

    const ip = clientIp(c);
    const windowId = Math.floor(Date.now() / 1000 / windowSec);
    const key = `rl:${scope}:${ip}:${windowId}`;

    let count = 0;
    try {
      const raw = await kv.get(key);
      count = raw ? parseInt(raw, 10) || 0 : 0;
    } catch {
      return next();
    }

    if (count >= limit) {
      return c.json(
        {
          error: "rate_limited",
          message: `Demasiados intentos. Espera unos minutos e inténtalo de nuevo.`,
        },
        429,
        { "Retry-After": String(windowSec) },
      );
    }

    // Fire-and-forget increment. Two TTLs * windowSec guarantees the key
    // outlives its window; worst case a couple of extra requests slip
    // through during KV replication, which is acceptable here.
    c.executionCtx.waitUntil(
      kv.put(key, String(count + 1), { expirationTtl: windowSec * 2 }).catch(() => {}),
    );

    return next();
  };
}

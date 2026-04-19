import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import type { User } from "@concertride/types";
import type { HonoEnv } from "../types";
import { USERS_BY_ID } from "../fixtures";
import { SESSION_COOKIE } from "../routes/auth";
import { verifySession } from "./jwt";

export async function getCurrentUser(c: Context<HonoEnv>): Promise<User | null> {
  const store = c.var.store;

  const jwt = getCookie(c, SESSION_COOKIE);
  if (jwt) {
    const session = await verifySession(jwt, c.env.JWT_SECRET);
    if (session) {
      const user = (await store.getUser(session.sub)) ?? USERS_BY_ID[session.sub] ?? null;
      if (user) return user;
    }
  }

  // Dev fallback — retained so smoke tests and early-access scripts keep
  // working. Automatically disabled in production.
  if (c.env.ENVIRONMENT !== "production") {
    const devId = c.req.header("x-dev-user-id");
    if (devId) {
      return (await store.getUser(devId)) ?? USERS_BY_ID[devId] ?? null;
    }
  }

  return null;
}

export async function requireUser(c: Context<HonoEnv>): Promise<User | Response> {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json(
      {
        error: "unauthorized",
        message: "Inicia sesión para continuar",
      },
      401,
    );
  }
  return user;
}

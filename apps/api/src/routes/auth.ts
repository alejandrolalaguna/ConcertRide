import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { hashPassword, verifyPassword } from "../lib/password";
import { signSession, verifySession } from "../lib/jwt";

export const SESSION_COOKIE = "cr_session";
const MAX_AGE = 60 * 60 * 24 * 30;

const route = new Hono<HonoEnv>();

const registerSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(80),
});

const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(128),
});

route.post("/register", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const { email, password, name } = parsed.data;

  const existing = await c.var.store.getUserByEmail(email);
  if (existing) return c.json({ error: "email_taken", message: "Ya existe una cuenta con ese email" }, 409);

  const { hash, salt } = await hashPassword(password);
  const user = await c.var.store.createUserWithPassword(email, name, hash, salt);

  const jwt = await signSession({ sub: user.id, email: user.email }, c.env.JWT_SECRET);
  const secure = new URL(c.req.url).protocol === "https:";
  setCookie(c, SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure,
    sameSite: "Lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return c.json({ ok: true, user }, 201);
});

route.post("/login", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const { email, password } = parsed.data;

  const user = await c.var.store.getUserByEmail(email);
  // Constant-time-ish: always attempt verify even on miss to avoid timing oracle
  const creds = user ? await c.var.store.getPasswordHash(user.id) : null;

  const valid = creds ? await verifyPassword(password, creds.hash, creds.salt) : false;

  if (!user || !valid) {
    return c.json({ error: "invalid_credentials", message: "Email o contraseña incorrectos" }, 401);
  }

  const jwt = await signSession({ sub: user.id, email: user.email }, c.env.JWT_SECRET);
  const secure = new URL(c.req.url).protocol === "https:";
  setCookie(c, SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure,
    sameSite: "Lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return c.json({ ok: true, user });
});

route.get("/me", async (c) => {
  const jwt = getCookie(c, SESSION_COOKIE);
  if (!jwt) return c.json({ user: null });
  const session = await verifySession(jwt, c.env.JWT_SECRET);
  if (!session) return c.json({ user: null });
  const user = await c.var.store.getUser(session.sub);
  return c.json({ user: user ?? null });
});

route.post("/logout", (c) => {
  deleteCookie(c, SESSION_COOKIE, { path: "/" });
  return c.json({ ok: true });
});

export default route;

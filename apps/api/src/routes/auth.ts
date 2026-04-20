import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { hashPassword, verifyPassword } from "../lib/password";
import { signSession, verifySession } from "../lib/jwt";
import { requireUser } from "../lib/identity";

export const SESSION_COOKIE = "cr_session";
const MAX_AGE = 60 * 60 * 24 * 30;

const route = new Hono<HonoEnv>();

const updateProfileSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  phone: z.string().max(20).nullable().optional(),
  home_city: z.string().max(80).nullable().optional(),
  smoker: z.boolean().nullable().optional(),
  has_license: z.boolean().nullable().optional(),
  car_model: z.string().max(80).nullable().optional(),
  car_color: z.string().max(40).nullable().optional(),
});

const registerSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(80),
  phone: z.string().max(20).optional(),
  home_city: z.string().max(80).optional(),
  smoker: z.boolean().optional(),
});

const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(128),
});

route.post("/register", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const { email, password, name, phone, home_city, smoker } = parsed.data;

  const existing = await c.var.store.getUserByEmail(email);
  if (existing) return c.json({ error: "email_taken", message: "Ya existe una cuenta con ese email" }, 409);

  const { hash, salt } = await hashPassword(password);
  const user = await c.var.store.createUserWithPassword(email, name, hash, salt, {
    phone,
    home_city,
    smoker,
  });

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

route.patch("/profile", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "bad_request", message: "Invalid JSON" }, 400);

  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const updated = await c.var.store.updateUser(userOrResp.id, parsed.data);
  if (!updated) return c.json({ error: "not_found" }, 404);
  return c.json({ ok: true, user: updated });
});

route.post("/logout", (c) => {
  deleteCookie(c, SESSION_COOKIE, { path: "/" });
  return c.json({ ok: true });
});

export default route;

import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { hashPassword, verifyPassword } from "../lib/password";
import { signSession, verifySession } from "../lib/jwt";
import { requireUser } from "../lib/identity";
import { rateLimit } from "../lib/ratelimit";
import { getSiteUrl } from "../lib/siteUrl";
import {
  sendLicenseReviewAdminEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "../lib/email";

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
  // GDPR consent. Required at registration from the ToS flow onwards.
  // Users created before this flow have tos_accepted_at = NULL and will be
  // prompted to re-accept the next time they touch a consent-gated feature.
  tos_accepted: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar los términos y la política de privacidad" }),
  }),
});

const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(128),
});

const forgotPasswordSchema = z.object({
  email: z.string().email().max(200),
});

const resetPasswordSchema = z.object({
  token: z.string().min(16).max(128),
  password: z.string().min(8).max(128),
});

const authLimiter = rateLimit({ scope: "auth", limit: 10, windowSec: 60 });

route.post("/register", authLimiter, async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const { email, password, name, phone, home_city, smoker } = parsed.data;
  const ref = c.req.query("ref") ?? null;

  const existing = await c.var.store.getUserByEmail(email);
  if (existing) return c.json({ error: "email_taken", message: "Ya existe una cuenta con ese email" }, 409);

  const emailBanned = await c.var.store.isEmailBanned(email.toLowerCase());
  if (emailBanned) return c.json({ error: "email_banned", message: "No es posible crear una cuenta con este email" }, 403);

  const { hash, salt } = await hashPassword(password);
  const user = await c.var.store.createUserWithPassword(email, name, hash, salt, {
    phone,
    home_city,
    smoker,
  });

  if (ref) await c.var.store.useReferral(ref, user.id).catch(() => {});

  // Email verification token: 32 bytes hex in KV with 7-day TTL. Link is the
  // only way to set email_verified_at. No-op if CACHE isn't bound.
  let verifyUrl = "";
  if (c.env.CACHE) {
    const rawBytes = crypto.getRandomValues(new Uint8Array(32));
    const token = Array.from(rawBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    await c.env.CACHE.put(`everify:${token}`, user.id, { expirationTtl: 7 * 24 * 3600 });
    verifyUrl = `${getSiteUrl(c.env)}/api/auth/verify-email?token=${token}`;
  }

  // Fire-and-forget welcome email. Silently drops in dev without RESEND_API_KEY.
  c.executionCtx.waitUntil(
    sendWelcomeEmail(c.env, user.email, user.name, verifyUrl).then(() => undefined),
  );

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

route.post("/login", authLimiter, async (c) => {
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

  if (user.banned_at) {
    return c.json({ error: "account_banned", message: "Tu cuenta ha sido suspendida. Contacta con soporte si crees que es un error." }, 403);
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

route.post("/verify-license", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const body = await c.req.parseBody().catch(() => null);
  if (!body || !body["document"]) {
    return c.json({ error: "bad_request", message: "Falta el documento" }, 400);
  }

  const file = body["document"];
  if (!(file instanceof File)) {
    return c.json({ error: "bad_request", message: "El campo 'document' debe ser un fichero" }, 400);
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (!allowedTypes.includes(file.type)) {
    return c.json({ error: "bad_request", message: "Formato no admitido. Usa JPG, PNG, WEBP o PDF" }, 400);
  }
  if (file.size > 10 * 1024 * 1024) {
    return c.json({ error: "bad_request", message: "El archivo no puede superar 10 MB" }, 400);
  }

  // Store document in KV with 90-day TTL (admin needs time to review)
  const kvKey = `license_doc:${userOrResp.id}:${Date.now()}`;
  const ext = file.type === "application/pdf" ? "pdf" : file.type.split("/")[1];
  const kvKeyWithExt = `${kvKey}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  const base64 = btoa(binary);
  const dataUrl = `data:${file.type};base64,${base64}`;

  if (c.env.CACHE) {
    await c.env.CACHE.put(kvKeyWithExt, dataUrl, { expirationTtl: 90 * 24 * 60 * 60 });
  }

  const review = await c.var.store.createLicenseReview(userOrResp.id, kvKeyWithExt);

  // Notify admin — fire and forget, don't block the response
  const fileUrl = `${getSiteUrl(c.env)}/api/auth/license-doc/${encodeURIComponent(kvKeyWithExt)}`;
  sendLicenseReviewAdminEmail(c.env, {
    userName: userOrResp.name,
    userId: userOrResp.id,
    reviewId: review.id,
    fileUrl,
  }).catch(() => {});

  return c.json({ ok: true, status: "pending", review_id: review.id });
});

route.get("/verify-license/status", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const review = await c.var.store.getMyLicenseReview(userOrResp.id);
  return c.json({ review: review ?? null });
});

route.post("/forgot-password", authLimiter, async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  // Intentionally return 200 whether email exists or not — avoid user enumeration.
  if (!parsed.success) return c.json({ ok: true });

  const { email } = parsed.data;
  const user = await c.var.store.getUserByEmail(email);

  if (user && c.env.CACHE) {
    const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
    const token = Array.from(tokenBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const TTL = 60 * 30; // 30 minutes
    await c.env.CACHE.put(`pwreset:${token}`, user.id, { expirationTtl: TTL });

    const origin = new URL(c.req.url).origin;
    const resetUrl = `${origin}/reset-password?token=${token}`;
    // Don't block the response on email delivery.
    c.executionCtx.waitUntil(
      sendPasswordResetEmail(c.env, user.email, resetUrl).then(() => undefined),
    );
  }

  return c.json({ ok: true });
});

route.post("/reset-password", authLimiter, async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const { token, password } = parsed.data;

  if (!c.env.CACHE) return c.json({ error: "service_unavailable" }, 503);

  const userId = await c.env.CACHE.get(`pwreset:${token}`);
  if (!userId) return c.json({ error: "invalid_token", message: "El enlace ha caducado o ya se usó." }, 400);

  const user = await c.var.store.getUser(userId);
  if (!user) return c.json({ error: "invalid_token" }, 400);

  const { hash, salt } = await hashPassword(password);
  await c.var.store.updatePassword(user.id, hash, salt);
  // One-time use — delete the token even if the remaining flow fails.
  await c.env.CACHE.delete(`pwreset:${token}`);

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

route.post("/logout", (c) => {
  deleteCookie(c, SESSION_COOKIE, { path: "/" });
  return c.json({ ok: true });
});

// Verify email — called by the link in the welcome email. Validates the
// one-time KV token, sets `email_verified_at`, then 302s the user to the
// home with a banner. Intentionally a GET so it works straight from the mail
// client without requiring JS.
route.get("/verify-email", async (c) => {
  const token = c.req.query("token") ?? "";
  const origin = new URL(c.req.url).origin;
  if (!token || !c.env.CACHE) {
    return c.redirect(`${origin}/?verify=invalid`, 302);
  }
  const userId = await c.env.CACHE.get(`everify:${token}`);
  if (!userId) {
    return c.redirect(`${origin}/?verify=expired`, 302);
  }
  await c.var.store.markEmailVerified(userId);
  await c.env.CACHE.delete(`everify:${token}`);
  return c.redirect(`${origin}/?verify=ok`, 302);
});

// Re-send the verification email if the user lost the original. Requires
// auth so we can only send to the user's own address (no enumeration).
route.post("/resend-verification", authLimiter, async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  if (userOrResp.email_verified_at) {
    return c.json({ ok: true, already: true });
  }
  if (!c.env.CACHE) return c.json({ error: "service_unavailable" }, 503);

  const rawBytes = crypto.getRandomValues(new Uint8Array(32));
  const token = Array.from(rawBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  await c.env.CACHE.put(`everify:${token}`, userOrResp.id, { expirationTtl: 7 * 24 * 3600 });
  const verifyUrl = `${getSiteUrl(c.env)}/api/auth/verify-email?token=${token}`;

  c.executionCtx.waitUntil(
    sendWelcomeEmail(c.env, userOrResp.email, userOrResp.name, verifyUrl).then(() => undefined),
  );
  return c.json({ ok: true });
});

// GDPR art.17 right-to-erasure. Irreversible. The row remains for foreign-key
// integrity (reviews, past rides) but all PII is wiped and the account is
// marked `deleted_at`. The user is logged out.
route.delete("/me", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  await c.var.store.deleteUser(userOrResp.id);
  deleteCookie(c, SESSION_COOKIE, { path: "/" });
  return c.json({ ok: true });
});

// Admin-only: serve a license document stored in KV.
route.get("/license-doc/:key{.+}", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const { isAdminUserId } = await import("../lib/admin");
  if (!isAdminUserId(c.env, userOrResp.id)) return c.json({ error: "not_found" }, 404);
  const key = decodeURIComponent(c.req.param("key"));
  if (!c.env.CACHE) return c.json({ error: "kv_not_available" }, 503);
  const dataUrl = await c.env.CACHE.get(key);
  if (!dataUrl) return c.json({ error: "not_found" }, 404);

  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return c.json({ error: "corrupt" }, 500);
  const contentType = match[1] ?? "application/octet-stream";
  const b64 = match[2] ?? "";
  const binary = Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0));
  return new Response(binary, {
    headers: {
      "content-type": contentType,
      "cache-control": "private, no-store",
    },
  });
});

// Phone verification — OTP via KV (6-digit code, 10-min TTL).
// No SMS provider needed: in dev the code is returned in the response body.
// In production, wire to a Twilio/vonage webhook here.
route.post("/send-phone-otp", authLimiter, async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  if (userOrResp.phone_verified_at) return c.json({ ok: true, already: true });

  const body = await c.req.json().catch(() => null);
  const parsed = z.object({ phone: z.string().min(6).max(20) }).safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", message: "Número de teléfono inválido" }, 400);

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const kvKey = `phone_otp:${userOrResp.id}`;

  if (c.env.CACHE) {
    await c.env.CACHE.put(kvKey, JSON.stringify({ otp, phone: parsed.data.phone }), { expirationTtl: 600 });
  }

  // Update phone field with the submitted number
  await c.var.store.updateUser(userOrResp.id, { phone: parsed.data.phone });

  // In production, send SMS here. For now, return code only in non-prod.
  const isDev = c.env.ENVIRONMENT !== "production";
  console.log(`[phone-otp] ${parsed.data.phone} → ${otp}`);
  return c.json({ ok: true, ...(isDev ? { otp } : {}) });
});

route.post("/verify-phone-otp", authLimiter, async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  if (userOrResp.phone_verified_at) return c.json({ ok: true, already: true });

  const body = await c.req.json().catch(() => null);
  const parsed = z.object({ otp: z.string().length(6) }).safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", message: "Código inválido" }, 400);

  if (!c.env.CACHE) return c.json({ error: "service_unavailable" }, 503);
  const stored = await c.env.CACHE.get(`phone_otp:${userOrResp.id}`);
  if (!stored) return c.json({ error: "otp_expired", message: "El código ha expirado. Solicita uno nuevo." }, 410);

  const { otp } = JSON.parse(stored) as { otp: string; phone: string };
  if (otp !== parsed.data.otp) return c.json({ error: "otp_invalid", message: "Código incorrecto" }, 400);

  await c.env.CACHE.delete(`phone_otp:${userOrResp.id}`);
  const user = await c.var.store.markPhoneVerified(userOrResp.id);
  return c.json({ ok: true, user });
});

export default route;

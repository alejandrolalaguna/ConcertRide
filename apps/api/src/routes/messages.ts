import { Hono } from "hono";
import type { HonoEnv } from "../types";
import { requireUser } from "../lib/identity";

const route = new Hono<HonoEnv>();

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

// POST /api/messages/upload — stores photo in KV and returns a URL
route.post("/upload", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const body = await c.req.parseBody().catch(() => null);
  if (!body || !(body["photo"] instanceof File)) {
    return c.json({ error: "bad_request", message: "Expected multipart field 'photo'" }, 400);
  }

  const file = body["photo"] as File;
  if (!ALLOWED_TYPES.includes(file.type)) {
    return c.json({ error: "bad_request", message: "Only JPEG, PNG, WebP, and GIF are allowed" }, 400);
  }
  if (file.size > MAX_BYTES) {
    return c.json({ error: "bad_request", message: "File exceeds 4 MB limit" }, 400);
  }

  const bytes = await file.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));
  const dataUrl = `data:${file.type};base64,${base64}`;

  const id = crypto.randomUUID().replace(/-/g, "");
  await c.env.CACHE.put(`media:${id}`, dataUrl, { expirationTtl: 60 * 60 * 24 * 30 }); // 30 days

  return c.json({ url: `/api/messages/media/${id}` }, 201);
});

// GET /api/messages/media/:id — serves photo from KV
route.get("/media/:id", async (c) => {
  const id = c.req.param("id");
  const dataUrl = await c.env.CACHE.get(`media:${id}`);
  if (!dataUrl) return c.json({ error: "not_found" }, 404);

  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) return c.json({ error: "corrupt" }, 500);

  const [, mime, b64] = match;
  const raw = atob(b64!);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

  return new Response(bytes, {
    headers: {
      "Content-Type": mime!,
      "Cache-Control": "public, max-age=2592000, immutable",
    },
  });
});

export default route;

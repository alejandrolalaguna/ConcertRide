import { Hono } from "hono";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { requireUser } from "../lib/identity";

const route = new Hono<HonoEnv>();

const createSchema = z.object({
  ride_id: z.string().min(1),
  title: z.string().min(1).max(80).optional(),
  caption: z.string().max(280).optional(),
  visibility: z.enum(["public", "crew", "private"]).optional(),
});

route.post("/", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const raw = await c.req.json().catch(() => null);
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);
  const result = await c.var.store.createTripMemory(userOrResp, parsed.data);
  if ("error" in result) return c.json({ error: result.error }, 400);
  void c.var.store.recordActivity({
    actor: userOrResp,
    kind: "trip_memory_shared",
    target_id: result.id,
    concert_id: result.concert_id,
    label: `${userOrResp.name} compartió un recuerdo de ${result.concert_artist}`,
  });
  return c.json(result, 201);
});

route.get("/:id", async (c) => {
  const memory = await c.var.store.getTripMemory(c.req.param("id"));
  if (!memory) return c.json({ error: "not_found" }, 404);
  if (memory.visibility === "private") {
    const userOrResp = await requireUser(c);
    if (userOrResp instanceof Response) return userOrResp;
    if (userOrResp.id !== memory.created_by) return c.json({ error: "forbidden" }, 403);
  }
  return c.json(memory);
});

route.post("/:id/share", async (c) => {
  await c.var.store.incrementTripMemoryShare(c.req.param("id"));
  return c.json({ ok: true });
});

// 1200x630 OG/Twitter share card rendered on the fly. SVG is good enough
// for Open Graph crawlers (Facebook, X, WhatsApp) and is dramatically
// cheaper than rasterising a PNG inside the Worker.
route.get("/:id/share-image.svg", async (c) => {
  const memory = await c.var.store.getTripMemory(c.req.param("id"));
  if (!memory) return c.text("not found", 404);
  const hero = memory.hero_color ?? "#dbff00";
  const heroFg = isDarkColor(hero) ? "#f0f0f4" : "#060608";
  const vibeEmoji = memory.vibe === "party" ? "🔥" : memory.vibe === "chill" ? "🌙" : "✨";
  const vibeLabel = memory.vibe.toUpperCase();
  const route = `${memory.origin_city || "—"} → ${memory.destination_city || memory.concert_artist}`;
  const title = (memory.title || "").slice(0, 60);
  const caption = (memory.caption || "").slice(0, 140);
  const crewBadge = memory.crew.length > 0
    ? `${memory.crew.length} ${memory.crew.length === 1 ? "viajero" : "viajeros"}`
    : "ConcertRide";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#060608"/>
      <stop offset="100%" stop-color="#0e0e14"/>
    </linearGradient>
    <radialGradient id="glow" cx="0%" cy="0%" r="80%">
      <stop offset="0%" stop-color="${hero}" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="${hero}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="6" fill="${hero}"/>
  <text x="60" y="80" font-family="ui-monospace, SFMono-Regular, monospace" font-size="20" font-weight="700" fill="#7a7a8e" letter-spacing="6">CR · TRIP MEMORY</text>
  <rect x="990" y="50" width="160" height="44" fill="${hero}"/>
  <text x="1070" y="80" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, monospace" font-size="22" font-weight="800" fill="${heroFg}" letter-spacing="4">${vibeEmoji} ${escapeXml(vibeLabel)}</text>
  <text x="60" y="240" font-family="Archivo Black, Impact, sans-serif" font-size="84" font-weight="900" fill="#f0f0f4">${escapeXml(title || memory.concert_artist).toUpperCase()}</text>
  ${caption ? `<text x="60" y="310" font-family="Inter, system-ui, sans-serif" font-size="32" fill="#c9c9d4">${escapeXml(caption)}</text>` : ""}
  <text x="60" y="500" font-family="ui-monospace, SFMono-Regular, monospace" font-size="28" font-weight="700" fill="#7a7a8e" letter-spacing="6">${escapeXml(route).toUpperCase()}</text>
  <line x1="60" y1="540" x2="1140" y2="540" stroke="#252530" stroke-width="2"/>
  <text x="60" y="590" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="600" fill="#f0f0f4">@${escapeXml(memory.creator_name)}</text>
  <text x="1140" y="590" text-anchor="end" font-family="ui-monospace, SFMono-Regular, monospace" font-size="22" font-weight="700" fill="${hero}" letter-spacing="4">${escapeXml(crewBadge).toUpperCase()} · concertride.me</text>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      // 5 min edge cache; share counts update via the /share POST.
      "cache-control": "public, max-age=300, s-maxage=300",
    },
  });
});

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isDarkColor(hex: string): boolean {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.replace("#", ""));
  if (!m) return false;
  const n = parseInt(m[1]!, 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  // Perceived brightness (rec. 709 luma).
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 128;
}

route.get("/concert/:concertId", async (c) => {
  const memories = await c.var.store.listTripMemoriesForConcert(c.req.param("concertId"));
  return c.json({ memories });
});

route.get("/user/mine", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const memories = await c.var.store.listTripMemoriesForUser(userOrResp.id);
  return c.json({ memories });
});

export default route;

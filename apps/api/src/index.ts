import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import type { Env } from "./env";
import type { HonoEnv } from "./types";
import { storeMiddleware } from "./middleware";
import { dispatchScheduled } from "./ingest/scheduled";
import auth from "./routes/auth";
import concerts from "./routes/concerts";
import rides from "./routes/rides";
import venues from "./routes/venues";
import users from "./routes/users";
import fuel from "./routes/fuel";
import ingest from "./routes/ingest";
import push from "./routes/push";
import messages from "./routes/messages";
import favorites from "./routes/favorites";

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://concertride.es",
  "https://www.concertride.es",
];

const app = new Hono<HonoEnv>();

app.use("*", logger());
app.use("*", prettyJSON());

app.use(
  "/api/*",
  cors({
    origin: (origin) =>
      ALLOWED_ORIGINS.includes(origin ?? "") ? origin : null,
    credentials: true,
    maxAge: 86400,
  }),
);

app.get("/api/health", (c) =>
  c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT,
  }),
);

app.use("/api/*", storeMiddleware);

// Dynamic concerts sitemap (served under /api/ to bypass the static assets handler).
// The root /sitemap.xml is a sitemap index in public/ that references this endpoint.
app.get("/api/sitemap-concerts.xml", storeMiddleware, async (c) => {
  const BASE = "https://concertride.es";
  const today = new Date().toISOString().slice(0, 10);

  let concertUrls = "";
  try {
    const { concerts } = await c.var.store.listConcerts({
      limit: 1000,
      offset: 0,
      date_from: new Date().toISOString(),
    });
    concertUrls = concerts
      .map((concert) => {
        const lastmod = concert.date ? concert.date.slice(0, 10) : today;
        return `  <url>\n    <loc>${BASE}/concerts/${concert.id}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>`;
      })
      .join("\n");
  } catch {
    // store unavailable — serve empty dynamic sitemap (still valid XML)
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${concertUrls}\n</urlset>`;
  return c.body(xml, 200, {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
  });
});

app.route("/api/auth", auth);
app.route("/api/concerts", concerts);
app.route("/api/rides", rides);
app.route("/api/venues", venues);
app.route("/api/users", users);
app.route("/api/fuel-price", fuel);
app.route("/api/ingest", ingest);
app.route("/api/push", push);
app.route("/api/messages", messages);
app.route("/api/favorites", favorites);

app.notFound((c) => {
  if (c.req.path.startsWith("/api/")) {
    return c.json({ error: "not_found", path: c.req.path }, 404);
  }
  return c.env.ASSETS.fetch(c.req.raw);
});

app.onError((err, c) => {
  console.error("api.error", err);
  return c.json({ error: "internal", message: err.message }, 500);
});

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledController, env: Env, ctx: ExecutionContext) {
    await dispatchScheduled(event, env, ctx);
  },
} satisfies ExportedHandler<Env>;

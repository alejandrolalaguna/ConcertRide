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

app.get("/sitemap.xml", storeMiddleware, async (c) => {
  const BASE = "https://concertride.es";
  const today = new Date().toISOString().slice(0, 10);
  const STATIC_LOCS = ["/", "/concerts", "/publish", "/register", "/login", "/aviso-legal", "/privacidad", "/cookies", "/terminos"];

  let concertUrls = "";
  try {
    const { concerts } = await c.var.store.listConcerts({
      limit: 500,
      offset: 0,
      date_from: new Date().toISOString(),
    });
    concertUrls = concerts
      .map((concert) => {
        const lastmod = concert.date ? concert.date.slice(0, 10) : today;
        return `  <url>\n    <loc>${BASE}/concerts/${concert.id}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
      })
      .join("\n");
  } catch {
    // store unavailable — serve static-only sitemap
  }

  const staticUrls = STATIC_LOCS.map(
    (loc) => `  <url>\n    <loc>${BASE}${loc}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`,
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticUrls}\n${concertUrls}\n</urlset>`;
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

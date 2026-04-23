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
import reports from "./routes/reports";
import admin from "./routes/admin";
import { rateLimit } from "./lib/ratelimit";
import * as Sentry from "@sentry/cloudflare";

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

// Universal rate limit for every write (POST/PUT/PATCH/DELETE). Keeps bursts
// from bots / buggy clients bounded. Auth routes have their own stricter
// limit layered on top (10/min).
const writeLimiter = rateLimit({ scope: "write", limit: 60, windowSec: 60 });
app.use("/api/*", async (c, next) => {
  if (c.req.method === "GET" || c.req.method === "HEAD" || c.req.method === "OPTIONS") {
    return next();
  }
  return writeLimiter(c, next);
});

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
app.route("/api/reports", reports);
app.route("/api/admin", admin);

app.notFound((c) => {
  if (c.req.path.startsWith("/api/")) {
    return c.json({ error: "not_found", path: c.req.path }, 404);
  }
  return c.env.ASSETS.fetch(c.req.raw);
});

app.onError((err, c) => {
  console.error("api.error", err);
  // Best-effort forward to Sentry (Sentry.withSentry wraps captureException
  // automatically, but we also report here so the user sees the error logged
  // with their path/context).
  try {
    Sentry.captureException(err, {
      tags: { path: c.req.path, method: c.req.method },
    });
  } catch {
    // ignore
  }
  return c.json({ error: "internal", message: err.message }, 500);
});

const baseHandler: ExportedHandler<Env> = {
  fetch: app.fetch,
  async scheduled(event: ScheduledController, env: Env, ctx: ExecutionContext) {
    await dispatchScheduled(event, env, ctx);
  },
};

// Sentry.withSentry wraps every `fetch` / `scheduled` invocation so uncaught
// exceptions are reported to the project DSN. No-op when SENTRY_DSN env var
// is missing — keeps local dev silent.
export default Sentry.withSentry(
  (env: Env) => ({
    dsn: env.SENTRY_DSN,
    environment: env.ENVIRONMENT,
    tracesSampleRate: 0,
    // Strip cookies + auth headers before send so we don't ship JWTs to Sentry.
    beforeSend(event) {
      if (event.request?.cookies) delete event.request.cookies;
      if (event.request?.headers) {
        delete event.request.headers.Cookie;
        delete event.request.headers.Authorization;
      }
      return event;
    },
  }),
  baseHandler,
);

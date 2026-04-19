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

app.route("/api/auth", auth);
app.route("/api/concerts", concerts);
app.route("/api/rides", rides);
app.route("/api/venues", venues);
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

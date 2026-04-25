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
import { htmlToMarkdown, estimateTokens } from "./lib/markdown";
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

// ─── Agent Discovery Endpoints ────────────────────────────────────────────────
// These are served from the Worker (not static assets) so they get correct
// Content-Type headers and can be updated without a build.

// RFC 9727 API Catalog — application/linkset+json
app.get("/.well-known/api-catalog", (c) => {
  const catalog = {
    linkset: [
      {
        anchor: "https://concertride.es/api",
        "service-desc": [{ href: "https://concertride.es/openapi.json", type: "application/openapi+json" }],
        "service-doc": [{ href: "https://concertride.es/acerca-de" }],
        "status": [{ href: "https://concertride.es/api/health" }],
      },
    ],
  };
  return c.body(JSON.stringify(catalog), 200, {
    "Content-Type": "application/linkset+json; charset=utf-8",
    "Cache-Control": "public, max-age=86400",
    "Access-Control-Allow-Origin": "*",
  });
});

// RFC 8414 / OAuth 2.0 Authorization Server Metadata
// ConcertRide uses session cookies (not OAuth tokens) for its own UI, but
// publishing this metadata allows agents to programmatically discover
// the auth flow and future API scopes.
app.get("/.well-known/oauth-authorization-server", (c) => {
  const metadata = {
    issuer: "https://concertride.es",
    authorization_endpoint: "https://concertride.es/login",
    token_endpoint: "https://concertride.es/api/auth/login",
    jwks_uri: "https://concertride.es/.well-known/jwks.json",
    registration_endpoint: "https://concertride.es/api/auth/register",
    scopes_supported: ["openid", "profile", "email"],
    response_types_supported: ["token"],
    grant_types_supported: ["password", "client_credentials"],
    token_endpoint_auth_methods_supported: ["client_secret_post"],
    service_documentation: "https://concertride.es/acerca-de",
    ui_locales_supported: ["es-ES"],
    op_policy_uri: "https://concertride.es/privacidad",
    op_tos_uri: "https://concertride.es/terminos",
  };
  return c.body(JSON.stringify(metadata, null, 2), 200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=86400",
    "Access-Control-Allow-Origin": "*",
  });
});

// RFC 9728 OAuth Protected Resource Metadata
app.get("/.well-known/oauth-protected-resource", (c) => {
  const metadata = {
    resource: "https://concertride.es/api",
    authorization_servers: ["https://concertride.es"],
    scopes_supported: ["openid", "profile", "email"],
    bearer_methods_supported: ["header", "cookie"],
    resource_documentation: "https://concertride.es/openapi.json",
    resource_policy_uri: "https://concertride.es/privacidad",
  };
  return c.body(JSON.stringify(metadata, null, 2), 200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=86400",
    "Access-Control-Allow-Origin": "*",
  });
});

// MCP Server Card (SEP-1649 draft)
app.get("/.well-known/mcp/server-card.json", (c) => {
  const card = {
    serverInfo: {
      name: "concertride-es",
      version: "1.0.0",
      title: "ConcertRide ES",
      description: "Carpooling para conciertos y festivales en España. Sin comisiones, conductores verificados.",
      contact: { email: "alejandrolalaguna@gmail.com", url: "https://concertride.es/contacto" },
      license: { name: "Proprietary", url: "https://concertride.es/terminos" },
    },
    transport: {
      type: "streamable-http",
      endpoint: "https://concertride.es/mcp",
    },
    capabilities: {
      tools: true,
      resources: false,
      prompts: false,
    },
    tools: [
      {
        name: "search_concerts",
        description: "Busca conciertos y festivales en España disponibles en ConcertRide",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Artista, festival o ciudad" },
            city: { type: "string", description: "Ciudad de destino del concierto" },
            date_from: { type: "string", format: "date", description: "Fecha de inicio (YYYY-MM-DD)" },
          },
        },
      },
      {
        name: "search_rides",
        description: "Busca viajes compartidos disponibles para un concierto específico",
        inputSchema: {
          type: "object",
          required: ["concert_id"],
          properties: {
            concert_id: { type: "string", description: "ID del concierto" },
            origin_city: { type: "string", description: "Ciudad de origen del viaje" },
          },
        },
      },
      {
        name: "get_festival_info",
        description: "Obtiene información sobre un festival: fechas, recinto, precios de carpooling desde distintas ciudades",
        inputSchema: {
          type: "object",
          required: ["festival_slug"],
          properties: {
            festival_slug: {
              type: "string",
              enum: ["mad-cool", "primavera-sound", "sonar", "fib", "bbk-live", "resurrection-fest",
                     "arenal-sound", "medusa-festival", "vina-rock", "o-son-do-camino", "cala-mijas",
                     "sonorama-ribera", "low-festival", "tomavistas", "zevra-festival", "cruilla"],
              description: "Slug del festival",
            },
          },
        },
      },
    ],
    links: {
      homepage: "https://concertride.es",
      documentation: "https://concertride.es/como-funciona",
      openapi: "https://concertride.es/openapi.json",
      llmstxt: "https://concertride.es/llms.txt",
    },
  };
  return c.body(JSON.stringify(card, null, 2), 200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=86400",
    "Access-Control-Allow-Origin": "*",
  });
});

// Agent Skills Discovery Index (Agent Skills Discovery RFC v0.2.0)
app.get("/.well-known/agent-skills/index.json", (c) => {
  const index = {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
      {
        name: "search-concerts",
        type: "skill-md",
        description: "Search concerts and festivals in Spain available on ConcertRide",
        url: "https://concertride.es/.well-known/agent-skills/search-concerts/SKILL.md",
        digest: "sha256:0000000000000000000000000000000000000000000000000000000000000001",
      },
      {
        name: "search-rides",
        type: "skill-md",
        description: "Find carpooling rides to a specific concert or festival in Spain",
        url: "https://concertride.es/.well-known/agent-skills/search-rides/SKILL.md",
        digest: "sha256:0000000000000000000000000000000000000000000000000000000000000002",
      },
      {
        name: "get-festival-transport",
        type: "skill-md",
        description: "Get transport options and carpooling prices to any major Spanish festival",
        url: "https://concertride.es/.well-known/agent-skills/get-festival-transport/SKILL.md",
        digest: "sha256:0000000000000000000000000000000000000000000000000000000000000003",
      },
    ],
  };
  return c.body(JSON.stringify(index, null, 2), 200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=86400",
    "Access-Control-Allow-Origin": "*",
  });
});

// ─── Dynamic concerts sitemap ─────────────────────────────────────────────────
// (served under /api/ to bypass the static assets handler).
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
        return `  <url>\n    <loc>${BASE}/concerts/${concert.id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>`;
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

// Social / AI crawlers get a thin OG-enriched HTML shell for festival pages
// so WhatsApp, Twitter, LinkedIn and AI scrapers see correct title/description/image
// without needing to execute JavaScript.
const SOCIAL_BOTS = /Twitterbot|facebookexternalhit|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Discordbot|OAI-SearchBot|PerplexityBot|anthropic-ai|Google-Extended|Googlebot|Applebot/i;

const FESTIVAL_META: Record<string, { name: string; city: string; venue: string; dates: string }> = {
  "mad-cool": { name: "Mad Cool Festival", city: "Madrid", venue: "IFEMA", dates: "9–11 julio 2026" },
  "primavera-sound": { name: "Primavera Sound", city: "Barcelona", venue: "Parc del Fòrum", dates: "28 mayo–1 junio 2026" },
  "sonar": { name: "Sónar", city: "Barcelona", venue: "Fira de Barcelona", dates: "18–20 junio 2026" },
  "fib": { name: "FIB Benicàssim", city: "Benicàssim", venue: "Recinte Festivaler", dates: "16–19 julio 2026" },
  "bbk-live": { name: "Bilbao BBK Live", city: "Bilbao", venue: "Kobetamendi", dates: "9–11 julio 2026" },
  "resurrection-fest": { name: "Resurrection Fest", city: "Viveiro", venue: "Recinto de Viveiro", dates: "25–28 junio 2026" },
  "arenal-sound": { name: "Arenal Sound", city: "Burriana", venue: "Playa del Arenal", dates: "29 jul–2 ago 2026" },
  "medusa-festival": { name: "Medusa Festival", city: "Cullera", venue: "Playa de Cullera", dates: "12–16 agosto 2026" },
  "vina-rock": { name: "Viña Rock", city: "Villarrobledo", venue: "Recinto Viña Rock", dates: "30 abr–3 mayo 2026" },
  "o-son-do-camino": { name: "O Son do Camiño", city: "Santiago de Compostela", venue: "Monte do Gozo", dates: "18–20 junio 2026" },
  "cala-mijas": { name: "Cala Mijas Fest", city: "Mijas", venue: "Cala Mijas", dates: "2–4 octubre 2026" },
  "sonorama-ribera": { name: "Sonorama Ribera", city: "Aranda de Duero", venue: "El Ferial", dates: "6–9 agosto 2026" },
  "zevra-festival": { name: "Zevra Festival", city: "Valencia", venue: "La Marina de Valencia", dates: "Verano 2026" },
  "low-festival": { name: "Low Festival", city: "Benidorm", venue: "Benidorm Beach", dates: "24–26 julio 2026" },
  "tomavistas": { name: "Tomavistas", city: "Madrid", venue: "IFEMA", dates: "15–17 mayo 2026" },
  "cruilla": { name: "Cruïlla Barcelona", city: "Barcelona", venue: "Parc del Fòrum", dates: "9–12 julio 2026" },
};

app.notFound(async (c) => {
  if (c.req.path.startsWith("/api/")) {
    return c.json({ error: "not_found", path: c.req.path }, 404);
  }

  // Inject festival-specific OG meta for social/AI crawlers
  const ua = c.req.header("User-Agent") ?? "";
  const accept = c.req.header("Accept") ?? "";
  const wantsMarkdown = accept.includes("text/markdown");

  const festivalMatch = c.req.path.match(/^\/festivales\/([^/]+)$/);
  if (festivalMatch && (SOCIAL_BOTS.test(ua) || wantsMarkdown)) {
    const slug = festivalMatch[1] ?? "";
    const meta = FESTIVAL_META[slug];
    if (meta) {
      const title = `Cómo ir a ${meta.name} 2026 — Carpooling desde toda España`;
      const desc = `Carpooling a ${meta.name} (${meta.venue}, ${meta.city}) ${meta.dates}. Viajes compartidos desde cualquier ciudad. Desde 5 €/asiento. Sin taxi, sin comisión. ConcertRide.`;
      const url = `https://concertride.es/festivales/${slug}`;

      if (wantsMarkdown) {
        const markdown = [
          `# ${title}`,
          "",
          desc,
          "",
          `**Festival:** ${meta.name}`,
          `**Ciudad:** ${meta.city}`,
          `**Recinto:** ${meta.venue}`,
          `**Fechas:** ${meta.dates}`,
          "",
          `Reserva tu viaje en [ConcertRide](${url})`,
          "",
          "## Precios desde distintas ciudades",
          "- Desde ciudades cercanas: 3–8 €/asiento",
          "- Desde capitales de provincia: 8–20 €/asiento",
          "- Sin comisión de plataforma. Pago en efectivo o Bizum al conductor.",
          "",
          `Más información: ${url}`,
        ].join("\n");
        const tokens = estimateTokens(markdown);
        return new Response(markdown, {
          status: 200,
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "x-markdown-tokens": String(tokens),
            "Cache-Control": "public, max-age=3600",
            "Vary": "Accept",
          },
        });
      }

      const html = `<!doctype html><html lang="es"><head><meta charset="UTF-8"/><title>${title}</title><meta name="description" content="${desc}"/><link rel="canonical" href="${url}"/><meta property="og:type" content="website"/><meta property="og:url" content="${url}"/><meta property="og:title" content="${title}"/><meta property="og:description" content="${desc}"/><meta property="og:image" content="https://concertride.es/og/home.png"/><meta property="og:locale" content="es_ES"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${title}"/><meta name="twitter:description" content="${desc}"/><meta name="twitter:image" content="https://concertride.es/og/home.png"/></head><body><p>Cargando ConcertRide…</p><script>window.location.href="${url}"</script></body></html>`;
      return c.html(html, 200, { "Cache-Control": "public, max-age=3600" });
    }
  }

  // Markdown negotiation for all other pages (SPA HTML shell)
  if (wantsMarkdown) {
    const assetResponse = await c.env.ASSETS.fetch(c.req.raw);
    const contentType = assetResponse.headers.get("content-type") ?? "";
    if (contentType.includes("text/html")) {
      const html = await assetResponse.text();
      const markdown = htmlToMarkdown(html);
      const tokens = estimateTokens(markdown);
      return new Response(markdown, {
        status: assetResponse.status,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "x-markdown-tokens": String(tokens),
          "Cache-Control": "public, max-age=3600",
          "Vary": "Accept",
        },
      });
    }
    return assetResponse;
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

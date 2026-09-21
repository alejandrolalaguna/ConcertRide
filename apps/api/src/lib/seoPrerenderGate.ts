// ─── §AJ: lazy gate in front of seoPrerender (CPU-time budget) ──────────────
// (added 2026-09-21)
//
// `seoPrerender.ts` is a ~337 KB module that ALSO imports ARTIST/VENUE/REGION/
// GENRE/CALENDAR_LANDINGS at top level. `index.ts` registered it on `app.use("*")`
// plus ~30 explicit routes, so a plain `import` meant every cold start parsed
// and evaluated all of it — even though the very first thing the middleware does
// is `if (!SEARCH_BOTS.test(ua)) return next()`, i.e. bail for ~all human traffic.
//
// This gate replicates ONLY the cheap bail-out checks (method / path / UA) with
// zero heavy imports, and dynamically imports the real middleware exclusively
// when a request actually passes them. Human requests and asset requests now
// never pay for the prerender module at all.
//
// The regex is intentionally a duplicate of SEARCH_BOTS in seoPrerender.ts —
// importing it from there would defeat the whole purpose by pulling the module
// graph back into the top-level scope. Keep BOTH lists in sync.
import type { Context, Next } from "hono";
import type { HonoEnv } from "../types";

// MUST stay in sync with SEARCH_BOTS in ./seoPrerender.ts
const SEARCH_BOTS =
  /Googlebot|Googlebot-Extended|bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|Exabot|facebot|ia_archiver|AhrefsBot|SemrushBot|MJ12bot|DotBot|Applebot|LinkedInBot|Twitterbot|facebookexternalhit|WhatsApp|Slackbot|TelegramBot|Discordbot|OAI-SearchBot|PerplexityBot|anthropic-ai|Google-Extended|GPTBot|ChatGPT-User|CCBot|ClaudeBot|Bytespider|xai-bot|YouBot/i;

// Memoised per isolate: the first bot request pays the import, the rest reuse it.
let modPromise: Promise<typeof import("./seoPrerender")> | null = null;
function loadSeoPrerender() {
  if (!modPromise) {
    modPromise = import("./seoPrerender").catch((err) => {
      // Don't memoise a rejected promise — retry on the next bot request.
      modPromise = null;
      throw err;
    });
  }
  return modPromise;
}

export async function seoPrerenderGate(c: Context<HonoEnv>, next: Next): Promise<Response | void> {
  // Mirrors the cheap guards at the top of seoPrerender() — see §AH for why
  // HEAD is treated exactly like GET.
  const isReadMethod = c.req.method === "GET" || c.req.method === "HEAD";
  if (
    !isReadMethod ||
    c.req.path.startsWith("/api/") ||
    c.req.path.startsWith("/.well-known/") ||
    c.req.path.match(/\.[a-z0-9]{1,6}$/i)
  ) {
    return next();
  }

  if (!SEARCH_BOTS.test(c.req.header("User-Agent") ?? "")) {
    return next();
  }

  const { seoPrerender } = await loadSeoPrerender();
  return seoPrerender(c, next);
}

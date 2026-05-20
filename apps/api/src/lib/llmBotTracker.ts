/**
 * LLM-bot visibility tracker.
 *
 * Captures which AI crawler fetched which page so we can measure "AI citation
 * pulls" as a visibility metric. Per the dark-search problem in the AI-search
 * playbook: branded traffic shows up in GA, but the LLM read that triggered
 * the brand search is invisible there. This is the only place we can see it.
 *
 * Counts are written to KV asynchronously via ctx.waitUntil so the request
 * latency is unaffected. Read with `getLlmBotStats()` from an admin endpoint.
 *
 * Buckets are daily so the keyspace stays bounded:
 *   llmbot:{yyyy-mm-dd}:{bot}:{path-hash} → count
 */

import type { Context } from "hono";
import type { HonoEnv } from "../types";

interface BotClassification {
  /** Slug used as key fragment — short, lowercase. */
  bot: string;
  /** Vendor for grouping. */
  vendor: "openai" | "anthropic" | "google" | "perplexity" | "meta" | "bytedance" | "other";
  /** Whether this is a retrieval bot (live search) or a training bot. */
  kind: "retrieval" | "training" | "mixed";
}

/**
 * Classify the User-Agent. Returns null for non-LLM traffic so the caller can
 * short-circuit. Patterns ordered most-specific first.
 */
export function classifyLlmBot(userAgent: string | null | undefined): BotClassification | null {
  if (!userAgent) return null;
  const ua = userAgent;
  // OpenAI splits: SearchBot (retrieval) vs GPTBot (training) vs ChatGPT-User (browse-on-demand)
  if (/OAI-SearchBot/i.test(ua)) return { bot: "oai-searchbot", vendor: "openai", kind: "retrieval" };
  if (/ChatGPT-User/i.test(ua)) return { bot: "chatgpt-user", vendor: "openai", kind: "retrieval" };
  if (/GPTBot/i.test(ua)) return { bot: "gptbot", vendor: "openai", kind: "training" };
  // Anthropic
  if (/ClaudeBot/i.test(ua)) return { bot: "claudebot", vendor: "anthropic", kind: "training" };
  if (/Claude-Web|anthropic-ai/i.test(ua)) return { bot: "claude-web", vendor: "anthropic", kind: "retrieval" };
  // Google Gemini / AI Overviews
  if (/Google-Extended/i.test(ua)) return { bot: "google-extended", vendor: "google", kind: "training" };
  // Perplexity
  if (/PerplexityBot/i.test(ua)) return { bot: "perplexitybot", vendor: "perplexity", kind: "mixed" };
  // ByteDance / TikTok
  if (/Bytespider/i.test(ua)) return { bot: "bytespider", vendor: "bytedance", kind: "training" };
  // Meta AI
  if (/Meta-ExternalAgent/i.test(ua)) return { bot: "meta-external", vendor: "meta", kind: "training" };
  // Common Crawl — feeds multiple LLMs indirectly
  if (/CCBot/i.test(ua)) return { bot: "ccbot", vendor: "other", kind: "training" };
  // xAI Grok
  if (/xai-bot/i.test(ua)) return { bot: "xai-bot", vendor: "other", kind: "training" };
  // YouBot (You.com)
  if (/YouBot/i.test(ua)) return { bot: "youbot", vendor: "other", kind: "mixed" };
  return null;
}

function todayBucket(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Stable short hash for path. Avoids unbounded key cardinality. */
function pathHash(path: string): string {
  let h = 5381;
  for (let i = 0; i < path.length; i++) h = ((h << 5) + h + path.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/**
 * Non-blocking record. Call from any request handler. Returns the
 * classification (or null) so the caller can use it for response shaping
 * (e.g. extra schema for retrieval bots).
 */
export function recordLlmBotVisit(
  c: Context<HonoEnv>,
  userAgent: string | null | undefined,
  path: string,
): BotClassification | null {
  const cls = classifyLlmBot(userAgent);
  if (!cls) return null;
  const cache = c.env.CACHE;
  if (!cache) return cls;
  const date = todayBucket();
  const key = `llmbot:${date}:${cls.bot}:${pathHash(path)}`;
  const pathKey = `llmbotpath:${date}:${cls.bot}:${pathHash(path)}`;
  c.executionCtx.waitUntil(
    (async () => {
      try {
        const prev = await cache.get(key);
        const n = prev ? parseInt(prev, 10) + 1 : 1;
        // 35-day TTL — enough for a monthly visibility report; KV charges by row.
        await cache.put(key, String(n), { expirationTtl: 60 * 60 * 24 * 35 });
        if (!prev) {
          // First time today we see this (bot, path) — store the readable path
          // so we don't need a reverse lookup.
          await cache.put(pathKey, path.slice(0, 200), { expirationTtl: 60 * 60 * 24 * 35 });
        }
      } catch {
        // Swallow — analytics should never crash a request.
      }
    })(),
  );
  return cls;
}

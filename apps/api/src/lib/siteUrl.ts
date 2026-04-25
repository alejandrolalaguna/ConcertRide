import type { Env } from "../env";

// Resolve the public site origin from env (set in wrangler.jsonc `vars`).
// Falls back to the production default when missing — never throws.
export function getSiteUrl(env: Pick<Env, "SITE_URL">): string {
  return (env.SITE_URL ?? "").replace(/\/+$/, "") || "https://concertride.me";
}

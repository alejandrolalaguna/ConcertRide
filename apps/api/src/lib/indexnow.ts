import type { Env } from "../env";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/**
 * Pings the IndexNow API to notify Bing (+ Yandex, Seznam) of new/updated URLs.
 * ChatGPT Search uses the Bing index — this is the fastest path to ChatGPT visibility.
 *
 * Silently no-ops when INDEXNOW_KEY is not set.
 * Batch-submits up to 10,000 URLs per call per IndexNow spec.
 */
export async function pingIndexNow(env: Env, urls: string[]): Promise<void> {
  if (!env.INDEXNOW_KEY || urls.length === 0) return;

  const siteUrl = env.SITE_URL ?? "https://concertride.me";
  const keyLocation = `${siteUrl}/${env.INDEXNOW_KEY}.txt`;

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(siteUrl).hostname,
        key: env.INDEXNOW_KEY,
        keyLocation,
        urlList: urls.slice(0, 10_000),
      }),
    });
    if (res.ok || res.status === 202) {
      console.log(`indexnow: submitted ${urls.length} URLs (status ${res.status})`);
    } else {
      console.warn(`indexnow: unexpected status ${res.status}`);
    }
  } catch (err) {
    console.error("indexnow ping failed:", err);
  }
}

// Public site origin used in canonicals, OG/Twitter URLs, JSON-LD `@id`s,
// sitemap entries, and any other absolute self-reference. Override with
// `VITE_SITE_URL` at build time (no trailing slash).
export const SITE_URL: string =
  (import.meta.env?.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, "") ||
  "https://concertride.me";

export function siteUrl(path = ""): string {
  if (!path) return SITE_URL;
  return path.startsWith("/") ? `${SITE_URL}${path}` : `${SITE_URL}/${path}`;
}

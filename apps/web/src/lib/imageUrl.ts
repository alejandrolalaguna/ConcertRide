/**
 * Returns a Cloudflare Image Resizing URL for same-origin paths.
 * External absolute URLs (http/https) are returned as-is — CF Image Resizing
 * requires the "Resize images from any origin" feature to be enabled on the
 * Cloudflare plan, and most plans only support same-origin assets.
 *
 * Docs: https://developers.cloudflare.com/images/image-resizing/url-format/
 */
export function cfImage(
  src: string,
  opts: { width: number; height?: number; quality?: number; format?: "webp" | "avif" | "auto" },
): string {
  if (!src) return src;
  // External URLs (Ticketmaster CDN, etc.) — return directly, no CF proxy
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  // In dev (127.0.0.1 / localhost) the CDN proxy isn't available — return original
  if (typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location.hostname)) {
    return src;
  }
  const { width, height, quality = 80, format = "auto" } = opts;
  const params = [`width=${width}`, `quality=${quality}`, `format=${format}`];
  if (height) params.push(`height=${height}`);
  return `/cdn-cgi/image/${params.join(",")}/${src}`;
}

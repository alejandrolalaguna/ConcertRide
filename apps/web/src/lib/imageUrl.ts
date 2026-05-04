/**
 * Returns a Cloudflare Image Resizing URL for any absolute image URL.
 * Falls back to the original URL in development (localhost) since
 * Cloudflare Image Resizing only works on production edge requests.
 *
 * Docs: https://developers.cloudflare.com/images/image-resizing/url-format/
 */
export function cfImage(
  src: string,
  opts: { width: number; height?: number; quality?: number; format?: "webp" | "avif" | "auto" },
): string {
  if (!src) return src;
  // In dev (127.0.0.1 / localhost) the CDN proxy isn't available — return original
  if (typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location.hostname)) {
    return src;
  }
  const { width, height, quality = 80, format = "auto" } = opts;
  const params = [`width=${width}`, `quality=${quality}`, `format=${format}`];
  if (height) params.push(`height=${height}`);
  return `/cdn-cgi/image/${params.join(",")}/${src}`;
}

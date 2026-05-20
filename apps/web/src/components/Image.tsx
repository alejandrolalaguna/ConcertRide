import { type CSSProperties, type ImgHTMLAttributes } from "react";

/**
 * Image — picture/source wrapper that serves AVIF / WebP / PNG-JPG fallback
 * for LOCAL raster images.
 *
 * TM Compliance (CLAUDE.md §1):
 *   - NEVER transforms external URLs. If `src` starts with http:// or https://
 *     (e.g. Ticketmaster CDN, Unsplash), we render a plain <img> with no
 *     <picture> wrapper and no AVIF/WebP siblings.
 *   - NEVER transforms non-raster sources (.svg, .gif, .avif, .webp already).
 *   - The companion script `scripts/convert-images.mjs` produces the .avif and
 *     .webp siblings on the filesystem. If those files do not exist yet, the
 *     browser will silently fall back to the original via the trailing <img>.
 *
 * Usage:
 *   <Image src="/og/home.png" alt="ConcertRide" width={1200} height={630} />
 *   <Image src="https://s1.ticketm.net/x.jpg" alt="…" />   // external, no transform
 */

export interface ImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "loading"> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Lazy by default; pass "eager" or set `priority` for above-the-fold. */
  loading?: "lazy" | "eager";
  /** Forces eager loading + fetchpriority=high for hero/LCP candidates. */
  priority?: boolean;
  /** Optional responsive sizes attribute (e.g. "(min-width: 768px) 50vw, 100vw"). */
  sizes?: string;
  className?: string;
  style?: CSSProperties;
}

interface PictureSources {
  avif: string;
  webp: string;
}

const RASTER_EXT_RE = /\.(png|jpe?g)$/i;

/**
 * Returns AVIF + WebP sibling paths for a local raster src.
 * Returns null when the src is external, non-raster, or already next-gen.
 */
export function buildPictureSources(src: string): PictureSources | null {
  if (!src) return null;
  // External URLs (Ticketmaster CDN, Unsplash, etc.) — never transform.
  if (src.startsWith("http://") || src.startsWith("https://")) return null;
  // Data URIs / blob URLs — never transform.
  if (src.startsWith("data:") || src.startsWith("blob:")) return null;
  // Strip query/hash for extension test, but preserve them in the output.
  const queryIdx = src.search(/[?#]/);
  const stem = queryIdx >= 0 ? src.slice(0, queryIdx) : src;
  const suffix = queryIdx >= 0 ? src.slice(queryIdx) : "";
  if (!RASTER_EXT_RE.test(stem)) return null;
  return {
    avif: stem.replace(RASTER_EXT_RE, ".avif") + suffix,
    webp: stem.replace(RASTER_EXT_RE, ".webp") + suffix,
  };
}

export function Image({
  src,
  alt,
  width,
  height,
  loading,
  priority = false,
  sizes,
  className,
  style,
  ...rest
}: ImageProps) {
  const resolvedLoading: "lazy" | "eager" = priority ? "eager" : (loading ?? "lazy");
  const fetchPriority = priority ? "high" : undefined;
  const decoding = priority ? "sync" : "async";

  const sources = buildPictureSources(src);

  // External / non-raster: plain <img>, no <picture> wrapper.
  if (!sources) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={resolvedLoading}
        decoding={decoding}
        // React types lag behind the DOM attr; cast for fetchpriority.
        {...(fetchPriority ? ({ fetchpriority: fetchPriority } as Record<string, string>) : {})}
        sizes={sizes}
        className={className}
        style={style}
        {...rest}
      />
    );
  }

  return (
    <picture>
      <source type="image/avif" srcSet={sources.avif} sizes={sizes} />
      <source type="image/webp" srcSet={sources.webp} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={resolvedLoading}
        decoding={decoding}
        {...(fetchPriority ? ({ fetchpriority: fetchPriority } as Record<string, string>) : {})}
        sizes={sizes}
        className={className}
        style={style}
        {...rest}
      />
    </picture>
  );
}

export default Image;

import type { AnchorHTMLAttributes, ReactNode } from "react";

/**
 * ExternalLink — opinionated `<a>` for off-site links, aligned with Google's
 * Search Starter Guide rules on link rel attributes.
 *
 * Why a wrapper:
 * - Google's starter guide is explicit: untrusted content links get
 *   `rel="nofollow"`, sponsored/paid links get `rel="sponsored"`, user-
 *   generated content links get `rel="ugc"`. Free-form `<a>` lets devs
 *   forget any of these.
 * - `target="_blank"` without `rel="noopener noreferrer"` is a documented
 *   security issue (window.opener leak). The wrapper sets both.
 * - We want a single audit point: grep for `<ExternalLink>` and you have the
 *   exhaustive list of off-site references. Bare `<a href="http">` should be
 *   the exception, not the rule.
 *
 * Trust modes:
 * - "trusted"   → primary source (gov, peer-reviewed, official operator).
 *                 NO nofollow — we WANT to pass PageRank to these.
 * - "external"  → any other off-site link we link to deliberately. Followed.
 * - "untrusted" → content we don't control (forum, aggregator). Adds nofollow.
 * - "ugc"       → user-generated link (review, comment). Adds rel="ugc".
 * - "sponsored" → paid placement / affiliate. Adds rel="sponsored".
 *
 * `noopener noreferrer` is added automatically when `target="_blank"`.
 */

export type ExternalLinkTrust =
  | "trusted"
  | "external"
  | "untrusted"
  | "ugc"
  | "sponsored";

interface ExternalLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "rel" | "target"> {
  href: string;
  trust?: ExternalLinkTrust;
  /** Default true. Pass false to open in same tab. */
  openInNewTab?: boolean;
  children: ReactNode;
}

function relFor(trust: ExternalLinkTrust, newTab: boolean): string {
  const parts: string[] = [];
  if (newTab) parts.push("noopener", "noreferrer");
  switch (trust) {
    case "trusted":
      // Followed link — no nofollow. Primary-source citations belong here.
      break;
    case "external":
      // Followed external link.
      parts.push("external");
      break;
    case "untrusted":
      parts.push("nofollow");
      break;
    case "ugc":
      parts.push("ugc");
      break;
    case "sponsored":
      parts.push("sponsored");
      break;
  }
  return parts.join(" ");
}

export function ExternalLink({
  href,
  trust = "external",
  openInNewTab = true,
  children,
  ...rest
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target={openInNewTab ? "_blank" : undefined}
      rel={relFor(trust, openInNewTab)}
      data-link-trust={trust}
      {...rest}
    >
      {children}
    </a>
  );
}

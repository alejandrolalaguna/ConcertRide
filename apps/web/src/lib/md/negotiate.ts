// Markdown-for-agents — `Accept` header negotiation (RFC 9110 §12.5.1).
//
// Markdown is served only when the client ranks text/markdown STRICTLY above
// text/html. `*/*`, a missing header, or any browser/link-preview Accept string
// keeps getting HTML. Each media type takes the q of its most specific
// matching range (exact > type/* > */*).

const MARKDOWN_TYPES = ["text/markdown", "text/x-markdown"];

interface MediaRange {
  type: string;
  subtype: string;
  q: number;
}

function parseAccept(accept: string): MediaRange[] {
  const out: MediaRange[] = [];
  for (const part of accept.split(",")) {
    const [range, ...params] = part.trim().split(";");
    const [type, subtype] = (range ?? "").trim().toLowerCase().split("/");
    if (!type || !subtype) continue;
    let q = 1;
    for (const p of params) {
      const [k, v] = p.trim().split("=");
      if (k?.trim().toLowerCase() === "q") {
        const n = Number.parseFloat(v ?? "");
        q = Number.isFinite(n) ? Math.min(Math.max(n, 0), 1) : 0;
      }
    }
    out.push({ type, subtype, q });
  }
  return out;
}

function qualityOf(ranges: MediaRange[], mediaType: string): number {
  const [type, subtype] = mediaType.split("/");
  let best = -1;
  let q = 0;
  for (const r of ranges) {
    const specificity =
      r.type === type && r.subtype === subtype ? 2
      : r.type === type && r.subtype === "*" ? 1
      : r.type === "*" && r.subtype === "*" ? 0
      : -1;
    if (specificity > best) {
      best = specificity;
      q = r.q;
    }
  }
  return best < 0 ? 0 : q;
}

export function prefersMarkdown(accept: string | null | undefined): boolean {
  // Fast path: runs on every HTML request in the Worker.
  if (!accept || !accept.includes("markdown")) return false;
  const ranges = parseAccept(accept);
  const md = Math.max(...MARKDOWN_TYPES.map((t) => qualityOf(ranges, t)));
  return md > 0 && md > qualityOf(ranges, "text/html");
}

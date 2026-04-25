/**
 * Minimal HTML→Markdown converter for Markdown for Agents content negotiation.
 * Runs entirely in the Workers runtime (no DOM, no external deps).
 *
 * Spec: https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
 * When a request carries `Accept: text/markdown`, the Worker converts the HTML
 * response to Markdown and replies with `Content-Type: text/markdown; charset=utf-8`
 * plus an `x-markdown-tokens` estimate.
 */

/** Very rough token estimate: ~4 chars per token (GPT-4 average). */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/** Strip all HTML tags, decode basic entities, normalise whitespace. */
function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Convert HTML to Markdown. Handles the tags that matter for LLM consumption. */
export function htmlToMarkdown(html: string): string {
  let md = html;

  // Remove <head> entirely (scripts, styles, meta)
  md = md.replace(/<head[\s\S]*?<\/head>/gi, "");

  // Remove scripts and styles from body
  md = md.replace(/<script[\s\S]*?<\/script>/gi, "");
  md = md.replace(/<style[\s\S]*?<\/style>/gi, "");
  md = md.replace(/<noscript[\s\S]*?<\/noscript>/gi, "");

  // Headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `\n# ${stripTags(t)}\n`);
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n## ${stripTags(t)}\n`);
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n### ${stripTags(t)}\n`);
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `\n#### ${stripTags(t)}\n`);
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (_, t) => `\n##### ${stripTags(t)}\n`);
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, (_, t) => `\n###### ${stripTags(t)}\n`);

  // Paragraphs and breaks
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => `\n${stripTags(t)}\n`);
  md = md.replace(/<br\s*\/?>/gi, "\n");

  // Bold and italic
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, t) => `**${stripTags(t)}**`);
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, (_, t) => `**${stripTags(t)}**`);
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, t) => `_${stripTags(t)}_`);
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, (_, t) => `_${stripTags(t)}_`);

  // Links
  md = md.replace(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const t = stripTags(text).trim();
    if (!t) return "";
    return `[${t}](${href})`;
  });

  // Images
  md = md.replace(/<img[^>]+alt="([^"]*)"[^>]+src="([^"]*)"[^>]*\/?>/gi, (_, alt, src) =>
    alt ? `![${alt}](${src})` : "",
  );
  md = md.replace(/<img[^>]+src="([^"]*)"[^>]+alt="([^"]*)"[^>]*\/?>/gi, (_, src, alt) =>
    alt ? `![${alt}](${src})` : "",
  );

  // Lists
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `- ${stripTags(t).trim()}\n`);
  md = md.replace(/<\/ul>/gi, "\n");
  md = md.replace(/<\/ol>/gi, "\n");
  md = md.replace(/<ul[^>]*>/gi, "\n");
  md = md.replace(/<ol[^>]*>/gi, "\n");

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, t) => {
    return stripTags(t)
      .trim()
      .split("\n")
      .map((l) => `> ${l}`)
      .join("\n") + "\n";
  });

  // Horizontal rule
  md = md.replace(/<hr\s*\/?>/gi, "\n---\n");

  // Code
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_, t) => `\`${stripTags(t)}\``);
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, t) => `\`\`\`\n${stripTags(t)}\n\`\`\`\n`);

  // Tables — basic support
  md = md.replace(/<th[^>]*>([\s\S]*?)<\/th>/gi, (_, t) => `| ${stripTags(t).trim()} `);
  md = md.replace(/<td[^>]*>([\s\S]*?)<\/td>/gi, (_, t) => `| ${stripTags(t).trim()} `);
  md = md.replace(/<\/tr>/gi, "|\n");
  md = md.replace(/<tr[^>]*>/gi, "");
  md = md.replace(/<\/thead>/gi, "");
  md = md.replace(/<thead[^>]*>/gi, "");
  md = md.replace(/<\/tbody>/gi, "");
  md = md.replace(/<tbody[^>]*>/gi, "");
  md = md.replace(/<\/table>/gi, "\n");
  md = md.replace(/<table[^>]*>/gi, "\n");

  // Sections / divs / articles → just collapse
  md = md.replace(/<\/(div|section|article|main|header|footer|nav|aside)>/gi, "\n");
  md = md.replace(/<(div|section|article|main|header|footer|nav|aside)[^>]*>/gi, "");

  // Strip remaining tags
  md = md.replace(/<[^>]+>/g, "");

  // Decode entities
  md = md
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Normalise blank lines (collapse 3+ to 2)
  md = md.replace(/\n{3,}/g, "\n\n").trim();

  return md;
}

/**
 * Hono middleware: if request has `Accept: text/markdown`, fetch the normal
 * HTML response, convert it to Markdown, and reply with the correct headers.
 */
export async function markdownNegotiation(
  c: { req: { header: (h: string) => string | undefined; raw: Request }; header: (k: string, v: string) => void },
  next: () => Promise<Response>,
): Promise<Response | undefined> {
  const accept = c.req.header("accept") ?? c.req.header("Accept") ?? "";
  if (!accept.includes("text/markdown")) return undefined;

  const htmlResponse = await next();
  if (!htmlResponse) return undefined;

  const contentType = htmlResponse.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    // Not HTML — return as-is
    return htmlResponse;
  }

  const html = await htmlResponse.text();
  const markdown = htmlToMarkdown(html);
  const tokens = estimateTokens(markdown);

  return new Response(markdown, {
    status: htmlResponse.status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "x-markdown-tokens": String(tokens),
      "Cache-Control": htmlResponse.headers.get("cache-control") ?? "public, max-age=3600",
      "Vary": "Accept",
    },
  });
}

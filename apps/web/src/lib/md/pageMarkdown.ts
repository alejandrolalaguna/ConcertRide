// Markdown-for-agents — per-page document frame.
//
//   # <H1 of the page>
//
//   > <meta description>
//
//   Canonical: https://concertride.me/<path>
//   Last updated: YYYY-MM-DD
//
//   <main content>

import { mainToMarkdown } from "./htmlToMarkdown";

export interface PageMarkdownInput {
  /** SSR HTML of the page (only its <main> is used). */
  html: string;
  /** <title> without the brand suffix — used when the page has no H1. */
  title: string;
  description: string;
  canonical: string;
  lastmod: string;
  origin: string;
}

export interface PageMarkdown {
  markdown: string;
  title: string;
}

/** Short eyebrow/kicker lines above the H1 ("Carpooling · Ruta") are chrome. */
const MAX_PRE_H1_KICKER = 80;

export function buildPageMarkdown(input: PageMarkdownInput): PageMarkdown {
  const body = mainToMarkdown(input.html, { origin: input.origin });
  const blocks = body.split("\n\n");
  const h1Index = blocks.findIndex((b) => b.startsWith("# "));
  let title = input.title;
  let content = blocks;
  if (h1Index >= 0) {
    title = blocks[h1Index]!.slice(2).trim();
    const before = blocks
      .slice(0, h1Index)
      .filter((b) => b.length > MAX_PRE_H1_KICKER || b.includes("]("));
    content = [...before, ...blocks.slice(h1Index + 1)];
  }
  const header = [
    `# ${title}`,
    "",
    `> ${input.description.replace(/\s+/g, " ").trim()}`,
    "",
    `Canonical: ${input.canonical}`,
    `Last updated: ${input.lastmod}`,
  ].join("\n");
  return { markdown: `${header}\n\n${content.join("\n\n")}\n`, title };
}

/** Rough token estimate (~4 chars/token), sent as `X-Markdown-Tokens`. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

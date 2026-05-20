/**
 * Gen AI Disclosure Policy — ConcertRide
 *
 * Source of truth for which page types render `<AiDisclosureNote>` and at
 * which level. Aligned with Google's "Using AI-generated content in Search"
 * (https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)
 * and "Creating helpful, reliable, people-first content"
 * (https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
 *
 * Google does NOT require disclosure of AI assistance, but recommends adding
 * "information about how automation has been used" when it helps readers form
 * accurate expectations about authorship and methodology. We follow that
 * recommendation on editorial content (pillars / datasets / blog) and skip it
 * on product UI / navigation / legal pages where it would be misleading or
 * irrelevant.
 *
 * Three levels:
 * - "ai-assisted":              AI helped with drafting, structure, or research;
 *                               humans edited, verified facts, and approved.
 * - "ai-drafted-human-reviewed": AI produced the first draft; humans rewrote
 *                               substantively, verified facts, and approved.
 * - "fully-human":              no AI involvement → `<AiDisclosureNote>` returns
 *                               null and nothing is shown.
 *
 * Adding a new page type:
 * 1. Decide whether the content is editorial (pillar / dataset / blog / guide)
 *    or product (UI / form / interactive flow / legal).
 * 2. If editorial AND uses AI assistance → "ai-drafted-human-reviewed" (default
 *    for ConcertRide's current process).
 * 3. If product / navigation / legal / pure UI → "fully-human" (nothing is shown).
 * 4. Add the page type → level entry in `PAGE_TYPE_AI_LEVELS` below.
 * 5. Render `<AiDisclosureNote level={aiLevelForPageType("yourPageType")} />`
 *    at the end of the article body, after the conclusion and before footer
 *    links. Skip the render for "fully-human" since the component returns null.
 *
 * Changing the policy:
 * Founder discretion. If a page evolves (e.g. an originally fully-human pillar
 * starts using AI for structure), bump it to "ai-drafted-human-reviewed". If
 * a previously AI-drafted page is rewritten from scratch by a human, drop it
 * back to "fully-human".
 */

export type AiDisclosureLevel =
  | "ai-assisted"
  | "ai-drafted-human-reviewed"
  | "fully-human";

/**
 * Page type → disclosure level. Keys are short page-type identifiers used by
 * page components when calling `aiLevelForPageType()`. Add new page types here
 * rather than hard-coding levels at call sites.
 */
export const PAGE_TYPE_AI_LEVELS: Record<string, AiDisclosureLevel> = {
  // Editorial content — first draft generated with AI assistance, then
  // substantively rewritten + fact-checked + approved by the editorial team.
  pillar: "ai-drafted-human-reviewed",
  dataset: "ai-drafted-human-reviewed",
  blog: "ai-drafted-human-reviewed",

  // Programmatic SEO landing pages — built from structured data + curated
  // copy by the team. No AI generation in the visible content. The fact
  // density / quotable summaries are human-authored from internal data.
  festival: "fully-human",
  route: "fully-human",
  city: "fully-human",
  region: "fully-human",
  artist: "fully-human",
  venue: "fully-human",
  calendar: "fully-human",
  genre: "fully-human",

  // Product UI, navigation, legal — no editorial content, so no disclosure.
  legal: "fully-human",
  product: "fully-human",
};

/**
 * Returns the disclosure level for a given page type. Unknown page types fall
 * back to "fully-human" (i.e. nothing is rendered) which is the safer default
 * — better to show no claim than a misleading one.
 */
export function aiLevelForPageType(pageType: string): AiDisclosureLevel {
  return PAGE_TYPE_AI_LEVELS[pageType] ?? "fully-human";
}

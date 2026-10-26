import { describe, expect, it } from "vitest";
import { prefersMarkdown } from "./negotiate";

describe("prefersMarkdown", () => {
  it.each([
    ["text/markdown", true],
    ["text/markdown, text/html;q=0.9", true],
    ["text/markdown, */*;q=0.8", true],
    ["text/x-markdown", true],
    ["text/plain, text/markdown;q=0.9, text/html;q=0.5", true],
  ])("serves markdown for %s", (accept, expected) => {
    expect(prefersMarkdown(accept)).toBe(expected);
  });

  it.each([
    [undefined],
    [""],
    ["*/*"],
    ["text/html"],
    ["text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"],
    ["text/html, text/markdown"],
    ["text/html, text/markdown;q=0.5"],
    ["text/markdown;q=0, text/html"],
    ["text/*"],
    ["text/markdown;q=0.5, text/*;q=0.9"],
  ])("keeps HTML for %s", (accept) => {
    expect(prefersMarkdown(accept)).toBe(false);
  });
});

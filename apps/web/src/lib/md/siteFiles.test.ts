import { describe, expect, it } from "vitest";
import { buildAiTxt, buildLlmsFullTxt, buildLlmsTxt } from "./siteFiles";
import type { MdCatalogEntry } from "./site";

const entry = (path: string, section: string, lastmod = "2026-05-21"): MdCatalogEntry => ({
  path,
  section,
  lastmod,
  title: `T ${path}`,
  description: `Desc ${path}`,
  tokens: 10,
});

const catalog: MdCatalogEntry[] = [
  entry("/", "core"),
  entry("/faq", "core"),
  entry("/guia/festival-sin-coche", "guias"),
  entry("/datos", "datos"),
  entry("/festivales", "festivales"),
  entry("/festivales/mad-cool", "festivales"),
  entry("/festivales/sonar", "festivales"),
  entry("/rutas", "rutas"),
  entry("/rutas/madrid-mad-cool", "rutas"),
  entry("/rutas/toledo-mad-cool", "rutas"),
  entry("/rutas/madrid-sonar", "rutas"),
  entry("/blog/a", "blog", "2026-01-01"),
  entry("/blog/b", "blog", "2026-09-01"),
  entry("/privacidad", "legal"),
];
const input = { catalog, markdownFor: (p: string) => `# ${p}\n\nCuerpo.`, generated: "2026-10-26" };

describe("llms.txt", () => {
  const txt = buildLlmsTxt(input);

  it("follows llmstxt.org: H1, blockquote, H2 sections linking to .md", () => {
    expect(txt.startsWith("# ConcertRide\n\n> ")).toBe(true);
    expect(txt).toContain("## Páginas principales");
    expect(txt).toContain("- [T /](https://concertride.me/index.md): Desc /");
    expect(txt).toContain("(https://concertride.me/faq.md)");
    expect(txt).toContain("## Machine-readable");
    expect(txt).toContain("## Optional\n\n- [T /privacidad](https://concertride.me/privacidad.md)");
  });

  it("samples one route per festival and lists newest blog posts first", () => {
    expect(txt).toContain("rutas/madrid-mad-cool.md");
    expect(txt).toContain("rutas/madrid-sonar.md");
    expect(txt).not.toContain("rutas/toledo-mad-cool.md");
    expect(txt.indexOf("/blog/b.md")).toBeLessThan(txt.indexOf("/blog/a.md"));
  });

  it("states counts derived from the catalog, never user/traction numbers", () => {
    expect(txt).toContain("2 festivales");
    expect(txt).toContain("3 rutas origen→festival");
    expect(txt).not.toMatch(/viajeros|usuarios registrados|\+\s?\d[\d.]*\s*fans/i);
  });
});

describe("llms-full.txt", () => {
  it("concatenates pages with source comments, legal last", () => {
    const { text, included } = buildLlmsFullTxt(input);
    expect(text).toContain("Generated: 2026-10-26");
    expect(text).toContain("<!-- source: https://concertride.me/faq -->");
    expect(text.lastIndexOf("source: https://concertride.me/privacidad")).toBeGreaterThan(
      text.lastIndexOf("source: https://concertride.me/blog/"),
    );
    expect(text).not.toContain("source: https://concertride.me/rutas/");
    expect(included).toBeGreaterThan(5);
  });
});

describe("ai.txt", () => {
  const txt = buildAiTxt(input);
  it("has the required ai-txt fields", () => {
    expect(txt).toMatch(/^# ConcertRide$/m);
    expect(txt).toMatch(/^Website: https:\/\/concertride\.me$/m);
    expect(txt).toMatch(/^## Permissions\n- /m);
    expect(txt).toMatch(/^## Restrictions\n- /m);
    expect(txt).toContain("help@concertride.me");
    expect(txt).toContain("/mensajes");
  });
});

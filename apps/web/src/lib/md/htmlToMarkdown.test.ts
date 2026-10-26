import { describe, expect, it } from "vitest";
import { htmlToMarkdown, mainToMarkdown } from "./htmlToMarkdown";
import { buildPageMarkdown } from "./pageMarkdown";

const origin = "https://concertride.me";
const md = (html: string) => htmlToMarkdown(html, { origin });

describe("htmlToMarkdown", () => {
  it("converts headings, paragraphs and inline formatting", () => {
    expect(md("<h2>Precios</h2><p>Desde <strong>4 €</strong> y <em>sin</em> comisión.</p>")).toBe(
      "## Precios\n\nDesde **4 €** y _sin_ comisión.",
    );
  });

  it("absolutises internal links and keeps external ones", () => {
    expect(md('<p><a href="/rutas/madrid-mad-cool">Ruta</a> y <a href="https://www.renfe.com">Renfe</a></p>')).toBe(
      "[Ruta](https://concertride.me/rutas/madrid-mad-cool) y [Renfe](https://www.renfe.com)",
    );
  });

  it("renders in-page anchors as plain text", () => {
    expect(md('<p><a href="#faq">Ver FAQ</a></p>')).toBe("Ver FAQ");
  });

  it("renders nested and ordered lists", () => {
    expect(md("<ol><li>Uno</li><li>Dos<ul><li>a</li></ul></li></ol>")).toBe("1. Uno\n2. Dos\n   - a");
  });

  it("renders tables with a header row and escapes pipes", () => {
    expect(
      md("<table><thead><tr><th>Origen</th><th>Precio</th></tr></thead><tbody><tr><td>Madrid</td><td>4|7 €</td></tr></tbody></table>"),
    ).toBe("| Origen | Precio |\n| --- | --- |\n| Madrid | 4\\|7 € |");
  });

  it("turns FAQ accordions into heading + answer", () => {
    expect(md("<details><summary><h3>¿Es gratis?</h3><span>+</span></summary><div><p>Sí.</p></div></details>")).toBe(
      "### ¿Es gratis?\n\nSí.",
    );
  });

  it("drops chrome: scripts, svg, buttons, aria-hidden, sr-only, data-md=skip, breadcrumbs", () => {
    const out = md(
      '<script type="application/ld+json">{"a":"</div>"}</script><nav aria-label="Breadcrumb"><a href="/">Inicio</a></nav>' +
        '<svg><path d="M0"/></svg><button>Reservar</button><span aria-hidden="true">→</span>' +
        '<span class="sr-only">(nueva pestaña)</span><div data-md="skip"><p>Avísame</p></div><p>Contenido</p>',
    );
    expect(out).toBe("Contenido");
  });

  it("lists link rows and drops conversion-only CTAs", () => {
    expect(
      md('<div><a href="/festivales/mad-cool">Mad Cool</a><a href="/festivales/sonar">Sónar</a></div>'),
    ).toBe("- [Mad Cool](https://concertride.me/festivales/mad-cool)\n- [Sónar](https://concertride.me/festivales/sonar)");
    expect(md('<div><a href="/publish?to=x">Publicar</a><a href="/register">Crear cuenta</a></div><p>Fin</p>')).toBe("Fin");
  });

  it("removes headings whose section is empty", () => {
    expect(md("<h2>Mapa</h2><div></div><h2>Precios</h2><p>4 €</p><h3>Vacío</h3>")).toBe("## Precios\n\n4 €");
  });

  it("decodes entities", () => {
    expect(md("<p>Rock &amp; indie &#x27;26 &mdash; 4&nbsp;€</p>")).toBe("Rock & indie '26 — 4 €");
  });

  it("only converts <main>", () => {
    expect(mainToMarkdown('<header><p>Menú</p></header><main id="main"><p>Hola</p></main><footer>Pie</footer>', { origin })).toBe("Hola");
  });
});

describe("buildPageMarkdown", () => {
  it("frames the page with H1, summary, canonical and date, dropping the kicker", () => {
    const { markdown, title } = buildPageMarkdown({
      html: '<main><p>Carpooling · Ruta</p><h1>Madrid → Mad Cool</h1><p>Texto.</p></main>',
      title: "Fallback",
      description: "Desde 4 €/asiento.",
      canonical: "https://concertride.me/rutas/madrid-mad-cool",
      lastmod: "2026-05-21",
      origin,
    });
    expect(title).toBe("Madrid → Mad Cool");
    expect(markdown).toBe(
      "# Madrid → Mad Cool\n\n> Desde 4 €/asiento.\n\nCanonical: https://concertride.me/rutas/madrid-mad-cool\nLast updated: 2026-05-21\n\nTexto.\n",
    );
  });
});

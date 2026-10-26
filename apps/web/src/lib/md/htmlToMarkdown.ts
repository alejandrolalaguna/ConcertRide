// Markdown-for-agents — HTML → Markdown for our own prerendered pages.
//
// Input is React `renderToString` output: well-formed, quoted attributes,
// every non-void element closed. This is NOT a general-purpose HTML parser and
// must not be pointed at third-party HTML.
//
// Why convert the SSR output instead of re-rendering each page from its data
// module: the landing pages hold ~9.000 lines of templated copy in JSX. A
// parallel data→markdown renderer per page type would drift from the HTML,
// and the markdown must state exactly what the HTML states. Converting the
// page's own <main> guarantees that, and new pages are covered for free.

interface El {
  tag: string;
  attrs: Record<string, string>;
  children: Child[];
}
type Child = El | string;

const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr",
]);
const RAW_TEXT = new Set(["script", "style", "textarea", "title"]);

/** Never rendered: chrome, interactive controls, media, decorative markup. */
const SKIP = new Set([
  "script", "style", "noscript", "template", "svg", "canvas", "iframe", "video", "audio",
  "picture", "img", "button", "form", "input", "select", "textarea", "dialog", "object", "map",
  "label",
]);

const BLOCK = new Set([
  "address", "article", "aside", "blockquote", "caption", "dd", "details", "div", "dl", "dt",
  "fieldset", "figcaption", "figure", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "header",
  "hgroup", "hr", "li", "main", "nav", "ol", "p", "pre", "section", "summary", "table", "tbody",
  "td", "tfoot", "th", "thead", "tr", "ul",
]);

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", mdash: "—",
  ndash: "–", euro: "€", laquo: "«", raquo: "»", iexcl: "¡", iquest: "¿", middot: "·",
  rarr: "→", larr: "←", copy: "©", reg: "®", deg: "°", times: "×", rsquo: "’", lsquo: "‘",
  rdquo: "”", ldquo: "“", bull: "•", ordm: "º", ordf: "ª",
};

function decodeEntities(s: string): string {
  if (!s.includes("&")) return s;
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return NAMED_ENTITIES[e.toLowerCase()] ?? m;
  });
}

const TAG_RE =
  /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<![^>]*>|<\/([a-zA-Z][\w:-]*)\s*>|<([a-zA-Z][\w:-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/g;
const ATTR_RE = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function parseAttrs(src: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  if (!src) return attrs;
  ATTR_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = ATTR_RE.exec(src))) {
    attrs[m[1]!.toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return attrs;
}

export function parseHtml(html: string): El {
  const root: El = { tag: "#root", attrs: {}, children: [] };
  const stack: El[] = [root];
  TAG_RE.lastIndex = 0;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = TAG_RE.exec(html))) {
    if (m.index > last) stack[stack.length - 1]!.children.push(decodeEntities(html.slice(last, m.index)));
    last = TAG_RE.lastIndex;
    const closeTag = m[1];
    const openTag = m[2];
    if (closeTag) {
      const tag = closeTag.toLowerCase();
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i]!.tag === tag) {
          stack.length = i;
          break;
        }
      }
    } else if (openTag) {
      const tag = openTag.toLowerCase();
      const el: El = { tag, attrs: parseAttrs(m[3] ?? ""), children: [] };
      stack[stack.length - 1]!.children.push(el);
      if (RAW_TEXT.has(tag)) {
        // Skip raw text (JSON-LD, inline styles) up to the matching close tag.
        const end = html.toLowerCase().indexOf(`</${tag}`, last);
        const stop = end < 0 ? html.length : end;
        el.children.push(html.slice(last, stop));
        const close = html.indexOf(">", stop);
        last = close < 0 ? html.length : close + 1;
        TAG_RE.lastIndex = last;
      } else if (!VOID.has(tag) && !m[4]) {
        stack.push(el);
      }
    }
  }
  if (last < html.length) stack[stack.length - 1]!.children.push(decodeEntities(html.slice(last)));
  return root;
}

export function findElement(node: El, pred: (el: El) => boolean): El | null {
  for (const c of node.children) {
    if (typeof c === "string") continue;
    if (pred(c)) return c;
    const found = findElement(c, pred);
    if (found) return found;
  }
  return null;
}

function textContent(node: Child): string {
  if (typeof node === "string") return node;
  if (SKIP.has(node.tag)) return "";
  return node.children.map(textContent).join("");
}

function hasClass(el: El, cls: string): boolean {
  const c = el.attrs.class;
  return !!c && ` ${c} `.includes(` ${cls} `);
}

function isSkipped(el: El): boolean {
  if (SKIP.has(el.tag)) return true;
  if (el.attrs["aria-hidden"] === "true" || "hidden" in el.attrs) return true;
  if (el.attrs["data-md"] === "skip") return true;
  // Screen-reader-only helper text ("abre en una pestaña nueva", skip links)
  // reads as noise in markdown. Headings are kept: some sections use an
  // sr-only H2 as their only title.
  if (hasClass(el, "sr-only") && !/^h[1-6]$/.test(el.tag)) return true;
  if (el.tag === "nav") {
    // Breadcrumbs and in-page tables of contents are chrome; a nav of real
    // outbound links ("rutas relacionadas") is content.
    const label = `${el.attrs["aria-label"] ?? ""} ${el.attrs.class ?? ""}`;
    if (/breadcrumb|miga|índice|indice|contenido|toc|table of contents/i.test(label)) return true;
    const hrefs: string[] = [];
    collectHrefs(el, hrefs);
    if (hrefs.length > 0 && hrefs.filter((h) => h.startsWith("#")).length * 2 >= hrefs.length) return true;
  }
  return false;
}

function collectHrefs(el: El, out: string[]): void {
  for (const c of el.children) {
    if (typeof c === "string") continue;
    if (c.tag === "a" && c.attrs.href != null) out.push(c.attrs.href);
    collectHrefs(c, out);
  }
}

export interface ConvertOptions {
  /** Absolute site origin (no trailing slash) used to absolutise links. */
  origin: string;
}

class Converter {
  constructor(private readonly opts: ConvertOptions) {}

  absolutise(href: string): string | null {
    const h = href.trim();
    if (!h || h.startsWith("#") || /^javascript:/i.test(h)) return null;
    if (/^(mailto|tel):/i.test(h)) return h;
    if (h.startsWith("//")) return `https:${h}`;
    if (/^https?:\/\//i.test(h)) return h;
    if (h.startsWith("/")) return `${this.opts.origin}${h}`;
    return null;
  }

  inline(nodes: Child[]): string {
    let out = "";
    for (const n of nodes) out += this.inlineNode(n);
    return out;
  }

  inlineNode(n: Child): string {
    if (typeof n === "string") return n.replace(/\s+/g, " ");
    if (isSkipped(n)) return "";
    switch (n.tag) {
      case "br":
        return "\n";
      case "a": {
        const text = squash(this.inline(n.children)).replace(/([[\]])/g, "\\$1");
        if (!text) return "";
        const url = this.absolutise(n.attrs.href ?? "");
        if (!url) return text;
        return `[${text}](${url.replace(/[()\s]/g, encodeURIComponent)})`;
      }
      case "strong":
      case "b":
        return wrap(this.inline(n.children), "**");
      case "em":
      case "i":
      case "cite":
        return wrap(this.inline(n.children), "_");
      case "code":
      case "kbd":
      case "samp": {
        const t = squash(textContent(n));
        return t ? `\`${t.replace(/`/g, "'")}\`` : "";
      }
      case "s":
      case "del":
        return wrap(this.inline(n.children), "~~");
      default:
        // Block elements reached in an inline context (e.g. a <div> inside a
        // link card) degrade to space-separated inline text.
        // Tailwind `block` spans render on their own line: keep a word break
        // ("2026" + "Dataset CC BY 4.0" must not become "2026Dataset").
        return BLOCK.has(n.tag) || hasClass(n, "block")
          ? ` ${this.inline(n.children)} `
          : this.inline(n.children);
    }
  }

  /**
   * A run made only of links (CTA button rows, card grids) renders as a list,
   * one link per item, instead of `[a](x)[b](y)` glued together. Links whose
   * only purpose is conversion (sign up, publish, search) are dropped: the
   * same buttons repeat on every page and carry no information for an agent.
   * Returns null when the run is ordinary prose.
   */
  linkRow(run: Child[]): string[] | null {
    const links: El[] = [];
    for (const n of run) {
      if (typeof n === "string") {
        if (SEPARATOR_ONLY.test(n)) continue;
        return null;
      } else if (n.tag === "a" && !isSkipped(n)) {
        links.push(n);
      } else if (!isSkipped(n) && !SEPARATOR_ONLY.test(textContent(n))) {
        return null;
      }
    }
    if (!links.length) return null;
    const items: string[] = [];
    for (const a of links) {
      const md = this.inlineNode(a).trim();
      if (!md) continue;
      const url = this.absolutise(a.attrs.href ?? "");
      if (url && isConversionUrl(url, this.opts.origin)) continue;
      items.push(links.length > 1 ? `- ${md}` : md);
    }
    return items;
  }

  /** Renders a sequence of children as markdown blocks. */
  blocks(nodes: Child[]): string[] {
    const out: string[] = [];
    let run: Child[] = [];
    const flush = () => {
      if (!run.length) return;
      const links = this.linkRow(run);
      if (links) {
        if (links.length) out.push(links.join("\n"));
      } else {
        const p = paragraph(this.inline(run));
        if (p) out.push(p);
      }
      run = [];
    };
    for (const n of nodes) {
      if (typeof n !== "string" && BLOCK.has(n.tag)) {
        flush();
        if (!isSkipped(n)) out.push(...this.block(n));
      } else {
        run.push(n);
      }
    }
    flush();
    return out;
  }

  block(el: El): string[] {
    switch (el.tag) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6": {
        const t = squash(this.inline(el.children)).replace(/\*\*/g, "");
        return t ? [`${"#".repeat(Number(el.tag[1]))} ${t}`] : [];
      }
      case "p": {
        const p = paragraph(this.inline(el.children));
        return p ? [p] : [];
      }
      case "ul":
      case "ol":
        return this.list(el);
      case "table":
        return this.table(el);
      case "blockquote": {
        const inner = this.blocks(el.children).join("\n\n");
        return inner ? [inner.split("\n").map((l) => (l ? `> ${l}` : ">")).join("\n")] : [];
      }
      case "pre": {
        const t = textContent(el).replace(/\n+$/, "");
        return t.trim() ? ["```\n" + t + "\n```"] : [];
      }
      case "hr":
        return ["---"];
      case "dl":
        return this.definitionList(el);
      case "details":
        return this.details(el);
      case "summary": {
        const t = squash(this.inline(el.children));
        return t ? [`**${t}**`] : [];
      }
      case "figcaption":
      case "caption": {
        const t = squash(this.inline(el.children));
        return t ? [`_${t}_`] : [];
      }
      default:
        return this.blocks(el.children);
    }
  }

  list(el: El): string[] {
    const ordered = el.tag === "ol";
    let n = Number.parseInt(el.attrs.start ?? "1", 10) || 1;
    const items: string[] = [];
    for (const c of el.children) {
      if (typeof c === "string" || c.tag !== "li" || isSkipped(c)) continue;
      const marker = ordered ? `${n++}.` : "-";
      const pad = " ".repeat(marker.length + 1);
      const body = this.blocks(c.children).join("\n");
      if (!body.trim()) continue;
      const lines = body.split("\n");
      items.push([`${marker} ${lines[0]}`, ...lines.slice(1).map((l) => (l ? pad + l : l))].join("\n"));
    }
    return items.length ? [items.join("\n")] : [];
  }

  table(el: El): string[] {
    const rows: Array<{ cells: string[]; header: boolean }> = [];
    let caption = "";
    const walk = (node: El, inHead: boolean) => {
      for (const c of node.children) {
        if (typeof c === "string" || isSkipped(c)) continue;
        if (c.tag === "caption") caption = squash(this.inline(c.children));
        else if (c.tag === "thead") walk(c, true);
        else if (c.tag === "tbody" || c.tag === "tfoot") walk(c, false);
        else if (c.tag === "tr") {
          const cells: string[] = [];
          let allTh = true;
          for (const td of c.children) {
            if (typeof td === "string" || (td.tag !== "td" && td.tag !== "th")) continue;
            if (td.tag !== "th") allTh = false;
            const text = squash(this.inline(td.children).replace(/\n/g, " ")).replace(/\|/g, "\\|");
            const span = Number.parseInt(td.attrs.colspan ?? "1", 10) || 1;
            cells.push(text);
            for (let i = 1; i < span; i++) cells.push("");
          }
          if (cells.length) rows.push({ cells, header: inHead || (allTh && rows.length === 0) });
        }
      }
    };
    walk(el, false);
    if (!rows.length) return [];
    const width = Math.max(...rows.map((r) => r.cells.length));
    const fmt = (cells: string[]) =>
      `| ${Array.from({ length: width }, (_, i) => cells[i] ?? "").join(" | ")} |`;
    const headerRows = rows.filter((r) => r.header);
    const head = headerRows.length ? headerRows[headerRows.length - 1]!.cells : Array(width).fill("");
    const body = rows.filter((r) => !r.header);
    const lines = [fmt(head), `|${" --- |".repeat(width)}`, ...body.map((r) => fmt(r.cells))];
    return [...(caption ? [`**${caption}**`] : []), lines.join("\n")];
  }

  definitionList(el: El): string[] {
    const out: string[] = [];
    for (const c of el.children) {
      if (typeof c === "string" || isSkipped(c)) continue;
      if (c.tag === "dt") {
        const t = squash(this.inline(c.children));
        if (t) out.push(`**${t}**`);
      } else if (c.tag === "dd") {
        out.push(...this.blocks(c.children));
      } else {
        // <div> wrappers around dt/dd pairs.
        out.push(...this.definitionList(c));
      }
    }
    return out;
  }

  details(el: El): string[] {
    // FAQ accordions: <details><summary><h3>Q</h3></summary><div>A</div></details>
    const out: string[] = [];
    for (const c of el.children) {
      if (typeof c === "string") {
        const p = paragraph(c);
        if (p) out.push(p);
        continue;
      }
      if (isSkipped(c)) continue;
      if (c.tag === "summary") {
        const heading = findElement(c, (e) => /^h[1-6]$/.test(e.tag));
        if (heading) out.push(...this.block(heading));
        else {
          const t = squash(this.inline(c.children));
          if (t) out.push(`### ${t}`);
        }
      } else {
        out.push(...(BLOCK.has(c.tag) ? this.block(c) : [paragraph(this.inlineNode(c))].filter(Boolean)));
      }
    }
    return out;
  }
}

const SEPARATOR_ONLY = /^[\s·|•—–/]*$/;
const CONVERSION_PATHS = /^\/(publish|register|login|concerts)(\/?$|[?#])/;

function isConversionUrl(url: string, origin: string): boolean {
  if (!url.startsWith(origin)) return false;
  const path = url.slice(origin.length) || "/";
  return CONVERSION_PATHS.test(path) || /#(rides|viajes|buscar)$/.test(path);
}

/** Drops headings whose section ended up empty (client-only maps, lists). */
function dropEmptySections(blocks: string[]): string[] {
  const level = (b: string | undefined) => {
    const m = b ? /^(#{1,6}) /.exec(b) : null;
    return m ? m[1]!.length : 0;
  };
  const out: string[] = [];
  for (let i = blocks.length - 1; i >= 0; i--) {
    const l = level(blocks[i]);
    if (l) {
      const next = out[0];
      const nl = level(next);
      if (next === undefined || (nl && nl <= l)) continue;
    }
    out.unshift(blocks[i]!);
  }
  return out;
}

function squash(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function paragraph(s: string): string {
  return s
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .replace(/^([#>]|[-+*] |\d+\. )/, "\\$1");
}

function wrap(inner: string, mark: string): string {
  const t = inner.trim();
  if (!t) return inner;
  const lead = /^\s/.test(inner) ? " " : "";
  const trail = /\s$/.test(inner) ? " " : "";
  return `${lead}${mark}${t}${mark}${trail}`;
}

/** Converts an element subtree (e.g. the page's <main>) to markdown. */
export function elementToMarkdown(el: El, opts: ConvertOptions): string {
  const blocks = dropEmptySections(new Converter(opts).blocks(el.children));
  const out: string[] = [];
  for (const b of blocks) if (b !== out[out.length - 1]) out.push(b); // drop adjacent duplicates
  return out.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function htmlToMarkdown(html: string, opts: ConvertOptions): string {
  return elementToMarkdown(parseHtml(html), opts);
}

/**
 * Converts only the page's `<main>` (falls back to the whole fragment).
 * Nav, footer, cookie banner and modals live outside <main> in every page.
 */
export function mainToMarkdown(html: string, opts: ConvertOptions): string {
  const start = html.search(/<main[\s>]/i);
  const end = html.lastIndexOf("</main>");
  const fragment = start >= 0 && end > start ? html.slice(start, end + 7) : html;
  const root = parseHtml(fragment);
  const main = findElement(root, (e) => e.tag === "main") ?? root;
  return elementToMarkdown(main, opts);
}

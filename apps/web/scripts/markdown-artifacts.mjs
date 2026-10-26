// Markdown-for-agents — build artifacts, driven by prerender.mjs.
//
// For every prerendered page that is indexable, self-canonical and registered
// in apps/web/src/lib/md/registry.ts, converts the SSR <main> to markdown and
// writes:
//   dist/_md/p/<n>.json   — markdown packs (MD_PACK_COUNT files, hash-bucketed)
//   dist/_md/catalog.json — every page with a markdown version (served at
//                           /api/md/_catalog by the Worker)
//   dist/llms.txt, dist/llms-full.txt, dist/ai.txt
//
// Packs instead of one file per page: Workers Free caps dist/ at 20.000 files
// (CLAUDE.md §PELIGRO); 8.900 extra .md files would eat most of the margin.
// The Worker reads ONE pack per request, so packs are kept small (see the
// size report below — keep the largest under ~1 MiB).

import fs from "node:fs/promises";
import path from "node:path";

export function createMarkdownCollector({ md, distDir, siteUrl }) {
  const packs = Array.from({ length: md.MD_PACK_COUNT }, () => ({}));
  const catalog = [];
  const bodies = new Map();
  const strip = (u) => u.replace(/\/+$/, "");

  return {
    /** True when `url` gets a markdown version (and the HTML advertises it). */
    eligible(url, seo) {
      if (!seo || seo.noindex || !seo.canonical) return false;
      if (url === "/en" || url.startsWith("/en/")) return false;
      if (strip(seo.canonical) !== strip(`${siteUrl}${url === "/" ? "" : url}`)) return false;
      return md.resolveMdRoute(url) !== null;
    },

    add(url, html, seo, lastmod) {
      if (bodies.has(url)) return; // prerender ROUTES can list a URL twice
      const route = md.resolveMdRoute(url);
      const { markdown, title } = md.buildPageMarkdown({
        html,
        title: seo.title,
        description: seo.description,
        canonical: seo.canonical,
        lastmod,
        origin: siteUrl,
      });
      packs[md.mdPackIndex(url)][url] = [markdown, lastmod];
      bodies.set(url, markdown);
      // Concert pages are never bulk-listed (Ticketmaster ToS rule 5).
      if (route.source !== "concert-db") {
        catalog.push({
          path: url,
          title,
          description: seo.description,
          section: route.section,
          lastmod,
          tokens: md.estimateTokens(markdown),
        });
      }
    },

    async write() {
      const outDir = path.join(distDir, md.MD_ASSET_DIR.replace(/^\//, ""));
      await fs.rm(outDir, { recursive: true, force: true });
      await fs.mkdir(path.join(outDir, "p"), { recursive: true });
      let largest = 0;
      for (let i = 0; i < packs.length; i++) {
        const json = JSON.stringify(packs[i]);
        largest = Math.max(largest, json.length);
        await fs.writeFile(path.join(outDir, "p", `${i}.json`), json, "utf8");
      }
      await fs.writeFile(
        path.join(outDir, "catalog.json"),
        JSON.stringify({ site: siteUrl, generated: today(), count: catalog.length, pages: catalog }),
        "utf8",
      );

      const input = { catalog, markdownFor: (p) => bodies.get(p), generated: today() };
      const llms = md.buildLlmsTxt(input);
      const full = md.buildLlmsFullTxt(input);
      await fs.writeFile(path.join(distDir, "llms.txt"), llms, "utf8");
      await fs.writeFile(path.join(distDir, "llms-full.txt"), full.text, "utf8");
      await fs.writeFile(path.join(distDir, "ai.txt"), md.buildAiTxt(input), "utf8");

      const totalChars = [...bodies.values()].reduce((n, b) => n + b.length, 0);
      console.log(
        `[markdown] ${bodies.size} pages → ${packs.length} packs (${(totalChars / 1048576).toFixed(1)} MiB, largest pack ${(largest / 1024).toFixed(0)} KiB), catalog ${catalog.length}`,
      );
      console.log(
        `[markdown] llms.txt ${llms.length} chars · llms-full.txt ${full.text.length} chars (${full.included} pages, ${full.omitted} via catalog)`,
      );
      if (largest > 1_048_576) {
        console.warn(`[markdown] WARNING: largest pack > 1 MiB — raise MD_PACK_COUNT in src/lib/md/site.ts`);
      }
      if (full.text.length > 520_000) {
        console.warn(`[markdown] WARNING: llms-full.txt is ${full.text.length} chars (target ≤ 500k)`);
      }
    },
  };
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

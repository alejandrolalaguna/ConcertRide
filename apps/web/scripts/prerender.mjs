#!/usr/bin/env node
// Prerender — generates static HTML for SEO-critical routes after the
// regular Vite client build. Reads the built dist/index.html as the shell,
// runs the SSR bundle for each URL, and injects:
//   - <title> + meta description / OG / Twitter / canonical
//   - JSON-LD scripts that the page emitted via renderToString
//   - the rendered HTML into <div id="root">
//
// Falls back gracefully: any route that throws is skipped (the SPA shell
// still serves it via `not_found_handling: single-page-application`).

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, "..");
const distDir = path.join(webRoot, "dist");
const ssrDir = path.join(webRoot, "dist-ssr");

// Public site origin baked into the generated HTML — must match VITE_SITE_URL
// used at build time so canonicals/og:url/sitemap entries all agree.
const SITE_URL = (process.env.VITE_SITE_URL ?? "https://concertride.me").replace(/\/+$/, "");

// ── Load SSR bundle ─────────────────────────────────────────────────────────
const ssrEntry = path.join(ssrDir, "entry-server.js");
if (!(await exists(ssrEntry))) {
  console.error(`[prerender] SSR bundle missing at ${ssrEntry}. Did the SSR build run?`);
  process.exit(1);
}
const { render, FESTIVAL_SLUGS, CITY_SLUGS } = await import(pathToFileURL(ssrEntry).href);

// ── Read shell ──────────────────────────────────────────────────────────────
const shellPath = path.join(distDir, "index.html");
const shell = await fs.readFile(shellPath, "utf8");

// ── Routes to prerender ─────────────────────────────────────────────────────
const STATIC_ROUTES = [
  "/",
  "/concerts",
  "/festivales",
  "/guia-transporte-festivales",
  "/como-funciona",
  "/faq",
  "/contacto",
  "/acerca-de",
  "/aviso-legal",
  "/privacidad",
  "/cookies",
  "/terminos",
];

const ROUTES = [
  ...STATIC_ROUTES,
  ...FESTIVAL_SLUGS.map((slug) => `/festivales/${slug}`),
  ...CITY_SLUGS.map((slug) => `/conciertos/${slug}`),
];

console.log(`[prerender] ${ROUTES.length} routes (${FESTIVAL_SLUGS.length} festivals, ${CITY_SLUGS.length} cities)`);

let ok = 0;
let failed = 0;
const succeeded = [];

for (const url of ROUTES) {
  try {
    const { html, seo } = render(url);
    const out = injectIntoShell(shell, html, seo, url);
    const outPath = url === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, url.replace(/^\/+/, ""), "index.html");
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, out, "utf8");
    succeeded.push(url);
    ok++;
  } catch (err) {
    failed++;
    console.warn(`[prerender] FAIL ${url}: ${err?.message ?? err}`);
  }
}

console.log(`[prerender] done — ${ok} ok, ${failed} failed`);

// ── Sitemap ─────────────────────────────────────────────────────────────────
await writeSitemap(succeeded);

// ── Helpers ─────────────────────────────────────────────────────────────────
function injectIntoShell(shellHtml, bodyHtml, seo, url) {
  let out = shellHtml;

  if (seo) {
    // Replace <title>
    out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeText(seo.fullTitle)}</title>`);

    // Patch description
    out = out.replace(
      /<meta\s+name="description"[^>]*>/i,
      `<meta name="description" content="${escapeAttr(seo.description)}" />`,
    );

    // Patch canonical + alternates
    if (seo.canonical) {
      out = out.replace(
        /<link rel="canonical"[^>]*>/,
        `<link rel="canonical" href="${escapeAttr(seo.canonical)}" />`,
      );
      out = out.replace(
        /<link rel="alternate" hreflang="es-ES"[^>]*>/,
        `<link rel="alternate" hreflang="es-ES" href="${escapeAttr(seo.canonical)}" />`,
      );
      out = out.replace(
        /<link rel="alternate" hreflang="x-default"[^>]*>/,
        `<link rel="alternate" hreflang="x-default" href="${escapeAttr(seo.canonical)}" />`,
      );
    }

    // OG / Twitter — patch the obvious ones, otherwise append
    const ogUrl = seo.canonical ?? `${SITE_URL}${url}`;
    out = patchMeta(out, "og:url", ogUrl, true);
    out = patchMeta(out, "og:title", seo.ogTitle, true);
    out = patchMeta(out, "og:description", seo.ogDescription, true);
    out = patchMeta(out, "og:type", seo.ogType, true);
    if (seo.ogImage) {
      out = patchMeta(out, "og:image", seo.ogImage, true);
      out = patchMeta(out, "og:image:secure_url", seo.ogImage, true);
    }
    out = patchMeta(out, "twitter:title", seo.ogTitle, false);
    out = patchMeta(out, "twitter:description", seo.ogDescription, false);
    if (seo.ogImage) out = patchMeta(out, "twitter:image", seo.ogImage, false);

    // Keywords
    if (seo.keywords) {
      out = patchMeta(out, "keywords", seo.keywords, false);
    }

    // Robots
    out = patchMeta(
      out,
      "robots",
      seo.noindex
        ? "noindex, nofollow"
        : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      false,
    );
  }

  // Inject the rendered body. The shell uses <div id="root"></div>.
  out = out.replace(
    /<div id="root">[^]*?<\/div>/,
    `<div id="root">${bodyHtml}</div>`,
  );

  return out;
}

function patchMeta(html, name, content, isProperty) {
  const attr = isProperty ? "property" : "name";
  const re = new RegExp(`<meta\\s+${attr}="${escapeRegex(name)}"[^>]*>`, "i");
  const replacement = `<meta ${attr}="${name}" content="${escapeAttr(content)}" />`;
  if (re.test(html)) return html.replace(re, replacement);
  // Append before </head>
  return html.replace("</head>", `    ${replacement}\n  </head>`);
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escapeText(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function writeSitemap(urls) {
  const today = new Date().toISOString().slice(0, 10);
  const PRIORITY = (u) => {
    if (u === "/") return "1.0";
    if (u === "/concerts" || u === "/festivales" || u === "/guia-transporte-festivales") return "0.9";
    if (u.startsWith("/festivales/")) return "0.85";
    if (u.startsWith("/conciertos/")) return "0.8";
    if (["/como-funciona", "/faq"].includes(u)) return "0.7";
    if (["/acerca-de", "/contacto"].includes(u)) return "0.6";
    return "0.3";
  };
  const FREQ = (u) => {
    if (u === "/" || u === "/concerts") return "daily";
    if (u.startsWith("/festivales") || u.startsWith("/conciertos/")) return "weekly";
    return "monthly";
  };
  const entries = urls.map((u) => `  <url>
    <loc>${SITE_URL}${u === "/" ? "/" : u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${FREQ(u)}</changefreq>
    <priority>${PRIORITY(u)}</priority>
  </url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
  await fs.writeFile(path.join(distDir, "sitemap-static.xml"), xml, "utf8");
  console.log(`[prerender] sitemap-static.xml — ${urls.length} URLs`);
}

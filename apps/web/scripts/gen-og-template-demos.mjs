#!/usr/bin/env node
/**
 * gen-og-template-demos.mjs
 *
 * Renders the 5 OG SVG templates in apps/web/public/og/templates/ with sample
 * "demo" values, exporting each to a 1200x630 PNG. This produces one canonical
 * preview image per template — useful for designers and for verifying the
 * template renders correctly before doing a real per-page export.
 *
 * Run:
 *   node apps/web/scripts/gen-og-template-demos.mjs
 *
 * Output: apps/web/public/og/templates/{festival|route|dataset|pillar|blog}-demo.png
 *
 * Notes:
 * - System fonts substitute for Archivo Black / Inter / JetBrains Mono since
 *   librsvg does not embed webfonts. The visual is approximate but layout-correct.
 * - To export real per-page PNGs, replace the placeholders with actual values
 *   and call sharp() with the same pipeline. See og/README.md.
 */
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, "../public/og/templates");

const DEMOS = [
  {
    template: "festival-template.svg",
    output:   "festival-demo.png",
    replacements: {
      "{{FESTIVAL_NAME}}":  "MAD COOL",
      "{{FESTIVAL_DATES}}": "10–12 JUL 2026",
      "{{FESTIVAL_CITY}}":  "MADRID · IBERDROLA MUSIC",
      "{{PRICE_FROM}}":     "5",
    },
  },
  {
    template: "route-template.svg",
    output:   "route-demo.png",
    replacements: {
      "{{ORIGIN}}":   "MADRID",
      "{{DEST}}":     "MAD COOL",
      "{{DISTANCE}}": "20 KM",
      "{{TIME}}":     "25 MIN",
      "{{PRICE}}":    "5",
    },
  },
  {
    template: "dataset-template.svg",
    output:   "dataset-demo.png",
    replacements: {
      "{{DATASET_TITLE}}": "PRECIO MEDIO CARPOOLING",
      "{{DATASET_YEAR}}":  "2026",
      "{{ROW_COUNT}}":     "12 filas",
    },
  },
  {
    template: "pillar-template.svg",
    output:   "pillar-demo.png",
    replacements: {
      "{{GUIDE_TITLE}}":    "GUÍA TRANSPORTE",
      "{{GUIDE_SUBTITLE}}": "Festivales de música en España 2026",
      "{{GUIDE_TAG}}":      "PILLAR · ACTUALIZADA MAY 2026",
    },
  },
  {
    template: "blog-template.svg",
    output:   "blog-demo.png",
    replacements: {
      "{{POST_TITLE}}":    "AUTOBUSES A FESTIVALES 2026",
      "{{POST_CATEGORY}}": "GUÍAS",
      "{{POST_AUTHOR}}":   "ALEJANDRO LALAGUNA",
      "{{POST_DATE}}":     "MAY 2026",
    },
  },
];

async function main() {
  for (const { template, output, replacements } of DEMOS) {
    const srcPath = path.join(TEMPLATES_DIR, template);
    const dstPath = path.join(TEMPLATES_DIR, output);
    let svg = await fs.readFile(srcPath, "utf8");
    for (const [token, value] of Object.entries(replacements)) {
      svg = svg.split(token).join(value);
    }
    await sharp(Buffer.from(svg))
      .resize(1200, 630)
      .png({ quality: 85, compressionLevel: 9 })
      .toFile(dstPath);
    console.log("  ok:", output);
  }
  console.log("\nDone. 5 demo PNGs written to:", TEMPLATES_DIR);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});

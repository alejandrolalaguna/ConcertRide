import sharp from "sharp";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = resolve(__dirname, "..", "public");
const SVG_PATH = resolve(PUBLIC_DIR, "favicon.svg");

const svg = readFileSync(SVG_PATH);

const TARGETS = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-48x48.png", size: 48 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
  { name: "og-fallback.png", size: 1200, height: 630 },
];

async function run() {
  for (const { name, size, height } of TARGETS) {
    const out = resolve(PUBLIC_DIR, name);
    const h = height ?? size;
    await sharp(svg, { density: 384 })
      .resize(size, h, { fit: "contain", background: { r: 8, g: 8, b: 8, alpha: 1 } })
      .png({ compressionLevel: 9 })
      .toFile(out);
    console.log(`✓ ${name} (${size}x${h})`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

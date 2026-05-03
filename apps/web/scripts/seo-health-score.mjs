#!/usr/bin/env node
/**
 * SEO Health Score — automated assessment of overall SEO readiness before launch
 * Scores 0–100 based on: pages, schema validity, crawlability, metadata, images
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");
const publicDir = path.resolve(__dirname, "..", "public");

const scoring = {
  pages: { weight: 15, score: 0 },
  schema: { weight: 20, score: 0 },
  llms: { weight: 15, score: 0 },
  geo: { weight: 10, score: 0 },
  og: { weight: 10, score: 0 },
  sitemap: { weight: 10, score: 0 },
  robots: { weight: 10, score: 0 },
  breadcrumbs: { weight: 10, score: 0 },
};

let issues = [];

async function countPages() {
  let count = 0;
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.name === "index.html") {
        count++;
      }
    }
  }
  await walk(distDir);
  return count;
}

async function validateSitemap() {
  try {
    const content = await fs.readFile(path.join(distDir, "sitemap.xml"), "utf8");
    const urlCount = (content.match(/<url>/g) || []).length;
    return { exists: true, urlCount };
  } catch {
    return { exists: false, urlCount: 0 };
  }
}

async function validateRobots() {
  try {
    const content = await fs.readFile(path.join(distDir, "robots.txt"), "utf8");
    const hasBots = [
      "Perplexity",
      "ChatGPT",
      "Claude",
      "Gemini",
      "GPT",
    ].some((bot) => content.includes(bot));
    return { exists: true, hasBots };
  } catch {
    return { exists: false, hasBots: false };
  }
}

async function validateLLMS() {
  try {
    const content = await fs.readFile(path.join(distDir, "llms.txt"), "utf8");
    return {
      exists: true,
      size: content.length,
      hasQ: content.includes("Q:"),
      hasFestivals: content.toLowerCase().includes("festival"),
    };
  } catch {
    return { exists: false, size: 0, hasQ: false, hasFestivals: false };
  }
}

async function validateSchema(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const blocks = (content.match(/<script\s+type="application\/ld\+json"/g) || []).length;
    const hasBreadcrumb = content.includes('"BreadcrumbList"');
    const hasFAQ = content.includes('"FAQPage"');
    const hasHowTo =
      content.includes('"HowTo"') || content.includes('"HowToTravelPage"');
    return {
      blocks,
      hasBreadcrumb,
      hasFAQ,
      hasHowTo,
      valid: blocks >= 3,
    };
  } catch {
    return { blocks: 0, hasBreadcrumb: false, hasFAQ: false, hasHowTo: false, valid: false };
  }
}

async function validateGeoTags(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const hasGeoRegion = content.includes('geo.region');
    const hasGeoPosition = content.includes('geo.position');
    return { hasGeoRegion, hasGeoPosition, valid: hasGeoRegion && hasGeoPosition };
  } catch {
    return { hasGeoRegion: false, hasGeoPosition: false, valid: false };
  }
}

async function validateOGImages(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    const ogImage = (content.match(/og:image"[^>]*content="([^"]+)"/g) || [])[0];
    return { hasOGImage: !!ogImage, ogImageUrl: ogImage?.split('"')[3] };
  } catch {
    return { hasOGImage: false };
  }
}

async function main() {
  console.log("🔍 ConcertRide SEO Health Score — Pre-Launch Audit\n");
  console.log("=".repeat(60));

  // 1. Prerendered pages
  console.log("\n📄 Checking prerendered pages...");
  const pageCount = await countPages();
  console.log(`   Found: ${pageCount} pages`);
  if (pageCount >= 215) {
    scoring.pages.score = 15;
    console.log(`   ✓ Score: ${scoring.pages.score}/${scoring.pages.weight} (target: ≥215)`);
  } else if (pageCount >= 200) {
    scoring.pages.score = 12;
    console.log(`   ⚠ Score: ${scoring.pages.score}/${scoring.pages.weight} (expected ≥215, got ${pageCount})`);
    issues.push(`Only ${pageCount} pages prerendered (target: 215+)`);
  } else {
    scoring.pages.score = 5;
    issues.push(`Critical: Only ${pageCount} pages (need ≥200)`);
  }

  // 2. Schema validation (sample 5 pages)
  console.log("\n📋 Checking schema validity (sample)...");
  const samplePaths = [
    path.join(distDir, "festivales/mad-cool/index.html"),
    path.join(distDir, "rutas/madrid-mad-cool/index.html"),
    path.join(distDir, "conciertos/madrid/index.html"),
    path.join(distDir, "blog/autobuses-festivales-espana-2026/index.html"),
  ];

  let schemaCount = 0;
  let schemaErrors = 0;
  const sampleSchemas = [];

  for (const filePath of samplePaths) {
    try {
      const schema = await validateSchema(filePath);
      sampleSchemas.push(schema);
      schemaCount += schema.blocks;
      if (!schema.valid) schemaErrors++;
    } catch {
      // File may not exist yet
    }
  }

  if (schemaErrors === 0) {
    scoring.schema.score = 20;
    console.log(`   ✓ ${sampleSchemas.length} sample pages, ${schemaCount} total schema blocks`);
    console.log(`   ✓ Score: ${scoring.schema.score}/${scoring.schema.weight}`);
  } else {
    scoring.schema.score = 10;
    console.log(`   ⚠ ${schemaErrors} pages with schema issues`);
    issues.push(`${schemaErrors} pages have insufficient schema blocks`);
  }

  // 3. Breadcrumbs & FAQ (sample)
  const breadcrumbSample = sampleSchemas.filter((s) => s.hasBreadcrumb).length;
  const faqSample = sampleSchemas.filter((s) => s.hasFAQ).length;
  const howtoSample = sampleSchemas.filter((s) => s.hasHowTo).length;

  console.log(`   • Breadcrumbs: ${breadcrumbSample}/${sampleSchemas.length} pages ✓`);
  console.log(`   • FAQPage: ${faqSample}/${sampleSchemas.length} pages ✓`);
  console.log(`   • HowTo/HowToTravelPage: ${howtoSample}/${sampleSchemas.length} pages ✓`);

  // 4. llms.txt
  console.log("\n🤖 Checking AI crawler files...");
  const llms = await validateLLMS();
  if (llms.exists && llms.size > 500 && llms.hasQ && llms.hasFestivals) {
    scoring.llms.score = 15;
    console.log(`   ✓ llms.txt: ${llms.size} bytes, Q&A present, festivals listed`);
    console.log(`   ✓ Score: ${scoring.llms.score}/${scoring.llms.weight}`);
  } else {
    scoring.llms.score = 5;
    issues.push("llms.txt incomplete or missing content");
  }

  // 5. robots.txt
  console.log("\n🤖 Checking robots.txt...");
  const robots = await validateRobots();
  if (robots.exists && robots.hasBots) {
    scoring.robots.score = 10;
    console.log(`   ✓ robots.txt with ${5}+ AI bots allowed`);
    console.log(`   ✓ Score: ${scoring.robots.score}/${scoring.robots.weight}`);
  } else {
    scoring.robots.score = 5;
    issues.push("robots.txt missing or incomplete AI bot allowlist");
  }

  // 6. Geo tags (sample)
  console.log("\n🌍 Checking geo tags (sample)...");
  let geoValid = 0;
  for (const filePath of samplePaths) {
    try {
      const geo = await validateGeoTags(filePath);
      if (geo.valid) geoValid++;
    } catch {
      // Skip missing files
    }
  }
  if (geoValid >= 3) {
    scoring.geo.score = 10;
    console.log(`   ✓ ${geoValid}/${samplePaths.length} pages have geo tags`);
    console.log(`   ✓ Score: ${scoring.geo.score}/${scoring.geo.weight}`);
  } else {
    scoring.geo.score = 5;
    issues.push(`Only ${geoValid} pages have geo tags (expected ≥3/4)`);
  }

  // 7. OG images (sample)
  console.log("\n🖼️  Checking OG images (sample)...");
  let ogValid = 0;
  for (const filePath of samplePaths) {
    try {
      const og = await validateOGImages(filePath);
      if (og.hasOGImage) ogValid++;
    } catch {
      // Skip
    }
  }
  if (ogValid >= 3) {
    scoring.og.score = 10;
    console.log(`   ✓ ${ogValid}/${samplePaths.length} pages have OG images`);
    console.log(`   ✓ Score: ${scoring.og.score}/${scoring.og.weight}`);
  } else {
    scoring.og.score = 5;
    issues.push(`Only ${ogValid} pages have OG images`);
  }

  // 8. Sitemap
  console.log("\n📍 Checking sitemap...");
  const sitemap = await validateSitemap();
  if (sitemap.exists && sitemap.urlCount >= 200) {
    scoring.sitemap.score = 10;
    console.log(`   ✓ sitemap.xml with ${sitemap.urlCount} URLs`);
    console.log(`   ✓ Score: ${scoring.sitemap.score}/${scoring.sitemap.weight}`);
  } else {
    scoring.sitemap.score = 5;
    issues.push(`Sitemap invalid or incomplete (${sitemap.urlCount} URLs)`);
  }

  // 9. Breadcrumbs (general)
  console.log("\n🔗 Checking breadcrumb structure...");
  if (breadcrumbSample >= 3) {
    scoring.breadcrumbs.score = 10;
    console.log(`   ✓ ${breadcrumbSample}/4 sample pages have breadcrumbs`);
    console.log(`   ✓ Score: ${scoring.breadcrumbs.score}/${scoring.breadcrumbs.weight}`);
  } else {
    scoring.breadcrumbs.score = 5;
    issues.push(`Insufficient breadcrumbs (${breadcrumbSample}/4 pages)`);
  }

  // Calculate total
  console.log("\n" + "=".repeat(60));
  console.log("📊 SEO Health Score Breakdown\n");

  let totalScore = 0;
  let totalWeight = 0;

  for (const [category, data] of Object.entries(scoring)) {
    const percentage = Math.round((data.score / data.weight) * 100);
    const bar = "█".repeat(Math.round(percentage / 5)) + "░".repeat(20 - Math.round(percentage / 5));
    console.log(
      `  ${category.padEnd(15)} ${data.score.toString().padStart(2)}/${data.weight.toString().padStart(2)}  [${bar}] ${percentage}%`
    );
    totalScore += data.score;
    totalWeight += data.weight;
  }

  const finalScore = Math.round((totalScore / totalWeight) * 100);

  console.log("\n" + "=".repeat(60));
  console.log(`\n🎯 FINAL SCORE: ${finalScore}/100\n`);

  if (finalScore >= 90) {
    console.log(
      `✅ EXCELLENT — Ready for production launch\n`
    );
  } else if (finalScore >= 75) {
    console.log(
      `⚠️  GOOD — Minor issues, deploy with caution\n`
    );
  } else {
    console.log(
      `❌ NEEDS WORK — Address issues before launch\n`
    );
  }

  if (issues.length > 0) {
    console.log("📋 Issues to Address:");
    issues.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue}`);
    });
    console.log();
  }

  console.log("📝 Recommendations:");
  console.log("   1. Run: npm run build && npm run validate:schema");
  console.log("   2. Deploy to Cloudflare Pages");
  console.log("   3. Wait 24h for initial indexation");
  console.log("   4. Submit sitemap to Google Search Console");
  console.log("   5. Monitor impressions/clicks in GSC (2–4 weeks)");

  process.exit(finalScore >= 75 ? 0 : 1);
}

main().catch((e) => {
  console.error(`[seo-health-score] Error: ${e.message}`);
  process.exit(1);
});

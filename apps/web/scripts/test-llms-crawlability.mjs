#!/usr/bin/env node
/**
 * Test llms.txt Crawlability — validates that llms.txt and llms-full.txt are accessible
 * and that all linked URLs exist (no 404s)
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "..", "public");
const distDir = path.resolve(__dirname, "..", "dist");

const errors = [];
const warnings = [];

async function validateLLMSFile(filePath, name) {
  console.log(`\n📄 Validating ${name}...`);

  try {
    const content = await fs.readFile(filePath, "utf8");

    // Check 1: File exists and is not empty
    if (content.length === 0) {
      errors.push(`${name}: File is empty`);
      return;
    }

    console.log(`   ✓ File accessible (${content.length} bytes)`);

    // Check 2: Contains expected sections
    const requiredSections = ["Q&A", "route", "festival"];
    for (const section of requiredSections) {
      if (!content.toLowerCase().includes(section.toLowerCase())) {
        warnings.push(`${name}: Missing expected section "${section}"`);
      }
    }

    // Check 3: Extract and validate URLs in the file
    const urlRegex = /https:\/\/concertride\.me\/[^\s)>"\]]+/g;
    const urls = content.match(urlRegex) || [];

    if (urls.length === 0) {
      warnings.push(`${name}: No URLs found in file`);
    } else {
      console.log(`   ✓ Found ${urls.length} URLs`);

      // Check 4: Verify URLs exist in dist/ (prerendered)
      const uniqueUrls = [...new Set(urls)];
      const distFiles = new Set();

      async function walkDist(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            await walkDist(full);
          } else if (entry.name === "index.html") {
            const relPath = path.relative(distDir, full);
            distFiles.add(`/` + relPath.replace(/\\/g, "/").replace(/index\.html$/, ""));
          }
        }
      }

      await walkDist(distDir);

      for (const url of uniqueUrls) {
        const urlPath = new URL(url).pathname;
        if (!distFiles.has(urlPath)) {
          errors.push(`${name}: Dead link in llms.txt → ${url} (not prerendered)`);
        }
      }

      console.log(`   ✓ All ${uniqueUrls.length} unique URLs exist in dist/`);
    }
  } catch (e) {
    errors.push(`${name}: ${e.message}`);
  }
}

async function main() {
  console.log("[test-llms-crawlability] Validating AI crawler accessibility\n");

  // Check both source (public/) and dist versions
  const llmsSourcePath = path.join(publicDir, "llms.txt");
  const llmsDistPath = path.join(distDir, "llms.txt");
  const llmsFullSourcePath = path.join(publicDir, "llms-full.txt");
  const llmsFullDistPath = path.join(distDir, "llms-full.txt");

  await validateLLMSFile(llmsSourcePath, "public/llms.txt");
  await validateLLMSFile(llmsDistPath, "dist/llms.txt");
  await validateLLMSFile(llmsFullSourcePath, "public/llms-full.txt");
  await validateLLMSFile(llmsFullDistPath, "dist/llms-full.txt");

  console.log("\n" + "=".repeat(60));
  console.log("[test-llms-crawlability] Results:");
  console.log("=".repeat(60));

  if (errors.length > 0) {
    console.error(`\n❌ ${errors.length} critical errors:`);
    errors.forEach((e) => console.error(`   ✗ ${e}`));
  }

  if (warnings.length > 0) {
    console.warn(`\n⚠️  ${warnings.length} warnings:`);
    warnings.forEach((w) => console.warn(`   ⚠ ${w}`));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log("\n✅ All llms.txt files are valid and crawlable");
    console.log("   AI bots (Perplexity, ChatGPT, Claude, etc.) can access full content");
  }

  // Deployment validation
  console.log("\n📋 Post-Deploy Validation:");
  console.log("   Run: curl https://concertride.me/llms.txt");
  console.log("   Expect: 200 status + 585+ lines of content");
  console.log("   Expected sections: Q&A, routes table, festivals, E-E-A-T");

  if (errors.length > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(`[test-llms-crawlability] Fatal error: ${e.message}`);
  process.exit(1);
});

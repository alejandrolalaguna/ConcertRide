#!/usr/bin/env node
// Validates all JSON-LD schema blocks in the prerendered HTML files under dist/.
// Checks:
//   - Valid JSON (no syntax errors)
//   - Required @context and @type fields
//   - No serialized 'undefined' values
//   - URLs in schema are absolute (start with https://)
//   - No empty required string fields
// Exits with code 1 if any errors are found — fails the build pipeline.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");

const errors = [];
const warnings = [];
let filesChecked = 0;
let schemasChecked = 0;

async function* walkHtml(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkHtml(full);
    } else if (entry.name === "index.html") {
      yield full;
    }
  }
}

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    blocks.push(m[1].trim());
  }
  return blocks;
}

function validateSchema(jsonStr, filePath, blockIndex) {
  const fileRef = path.relative(distDir, filePath);
  let parsed;

  // Check 1: valid JSON
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    errors.push(`${fileRef} [block ${blockIndex}]: Invalid JSON — ${e.message}`);
    return;
  }

  // Check 2: serialized undefined
  if (jsonStr.includes('"undefined"') || jsonStr.includes(':undefined')) {
    errors.push(`${fileRef} [block ${blockIndex}]: Contains serialized 'undefined' value`);
  }

  // Validate a single schema object
  function validateObject(obj, path = "") {
    if (!obj || typeof obj !== "object") return;

    // Check 3: @context and @type on root objects
    if (path === "" || path.startsWith("@graph[")) {
      if (!obj["@context"] && path === "") {
        warnings.push(`${fileRef} [block ${blockIndex}]: Missing @context`);
      }
      if (!obj["@type"]) {
        errors.push(`${fileRef} [block ${blockIndex}] ${path}: Missing @type`);
      }
    }

    // Check 4: URLs must be absolute
    const urlFields = ["url", "@id", "logo", "image", "sameAs", "mainEntityOfPage"];
    for (const field of urlFields) {
      const val = obj[field];
      if (typeof val === "string" && val.length > 0) {
        if (val.startsWith("/") || (val.startsWith("http") && !val.startsWith("https://"))) {
          warnings.push(`${fileRef} [block ${blockIndex}] ${path}.${field}: URL should be absolute HTTPS — got "${val.slice(0, 60)}"`);
        }
      }
    }

    // Check 5: empty string in critical fields
    const requiredNonEmpty = ["name", "description", "url"];
    for (const field of requiredNonEmpty) {
      if (field in obj && obj[field] === "") {
        errors.push(`${fileRef} [block ${blockIndex}] ${path}.${field}: Empty string in required field`);
      }
    }

    // Check 6: HowToTravelPage structure validation
    if (obj["@type"] === "HowToTravelPage") {
      if (!Array.isArray(obj.step) || obj.step.length < 3) {
        errors.push(`${fileRef} [block ${blockIndex}]: HowToTravelPage must have ≥3 steps, got ${obj.step?.length ?? 0}`);
      } else {
        obj.step.forEach((s, i) => {
          if (s["@type"] !== "HowToStep") {
            errors.push(`${fileRef} [block ${blockIndex}] step[${i}]: Must be HowToStep, got "${s["@type"]}"`);
          }
          if (!s.position || !s.name || !s.text) {
            const missing = ["position", "name", "text"].filter(f => !s[f]).join(", ");
            errors.push(`${fileRef} [block ${blockIndex}] step[${i}]: Missing required fields: ${missing}`);
          }
        });
      }
    }

    // Recurse into nested objects
    for (const [key, val] of Object.entries(obj)) {
      if (key.startsWith("@")) continue;
      if (Array.isArray(val)) {
        val.forEach((item, i) => {
          if (item && typeof item === "object") validateObject(item, `${path}.${key}[${i}]`);
        });
      } else if (val && typeof val === "object") {
        validateObject(val, `${path}.${key}`);
      }
    }
  }

  // Handle @graph array (multiple schemas in one block)
  if (parsed["@graph"]) {
    parsed["@graph"].forEach((item, i) => validateObject(item, `@graph[${i}]`));
  } else if (Array.isArray(parsed)) {
    parsed.forEach((item, i) => validateObject(item, `[${i}]`));
  } else {
    validateObject(parsed);
  }

  schemasChecked++;
}

// Main
if (!(await fs.access(distDir).then(() => true).catch(() => false))) {
  console.error(`[validate-schema] dist/ not found at ${distDir}. Run the build first.`);
  process.exit(1);
}

for await (const htmlFile of walkHtml(distDir)) {
  const content = await fs.readFile(htmlFile, "utf8");
  const blocks = extractJsonLd(content);
  blocks.forEach((block, i) => validateSchema(block, htmlFile, i));
  filesChecked++;
}

console.log(`[validate-schema] ${filesChecked} HTML files, ${schemasChecked} schemas checked`);

if (warnings.length > 0) {
  console.warn(`\n[validate-schema] ${warnings.length} warnings:`);
  warnings.forEach((w) => console.warn(`  ⚠  ${w}`));
}

if (errors.length > 0) {
  console.error(`\n[validate-schema] ${errors.length} errors (build will fail):`);
  errors.forEach((e) => console.error(`  ✗  ${e}`));
  process.exit(1);
} else {
  console.log(`[validate-schema] ✓ All schemas valid — 0 errors${warnings.length > 0 ? `, ${warnings.length} warnings` : ""}`);
}

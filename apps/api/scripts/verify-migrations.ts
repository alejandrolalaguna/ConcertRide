#!/usr/bin/env tsx
/**
 * Verify that migrations 0011 & 0012 are applied to Turso.
 * If missing, apply them.
 */

import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

function loadEnvFile(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    content.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const [key, ...valueParts] = trimmed.split("=");
      if (key) process.env[key.trim()] = valueParts.join("=").trim();
    });
  } catch {
    // ignore if file doesn't exist
  }
}

async function main() {
  // Load env from .dev.vars and .env
  loadEnvFile(path.join(process.cwd(), ".dev.vars"));
  loadEnvFile(path.join(process.cwd(), "../../.env"));

  const dbUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!dbUrl) {
    console.error("❌ TURSO_DATABASE_URL not set");
    process.exit(1);
  }

  if (!authToken) {
    console.error("❌ TURSO_AUTH_TOKEN not set");
    process.exit(1);
  }

  console.log(`📍 Connecting to: ${dbUrl}`);

  const client = createClient({
    url: dbUrl,
    authToken: authToken,
  });

  try {
    // Check which tables exist
    console.log("\n🔍 Checking for trust & safety tables...\n");

    const result = await client.execute(`
      SELECT name FROM sqlite_master
      WHERE type='table'
      AND name IN ('license_reviews', 'banned_emails', 'admin_audit_log')
      ORDER BY name
    `);

    const existingTables = new Set(result.rows.map((row: any) => row.name));
    const requiredTables = ["admin_audit_log", "banned_emails", "license_reviews"];
    const missingTables = requiredTables.filter((t) => !existingTables.has(t));

    console.log("✅ Existing tables:");
    requiredTables.forEach((table) => {
      if (existingTables.has(table)) {
        console.log(`   ✓ ${table}`);
      }
    });

    if (missingTables.length === 0) {
      console.log("\n✅ All migration tables exist. Database is up to date.");
      process.exit(0);
    }

    console.log("\n❌ Missing tables:");
    missingTables.forEach((table) => {
      console.log(`   ✗ ${table}`);
    });

    console.log("\n⚠️  Applying missing migrations...\n");

    // Migration 0011: license_reviews
    if (missingTables.includes("license_reviews")) {
      console.log("📝 Applying 0011_magical_white_queen.sql (license_reviews)...");
      await client.execute(`
        CREATE TABLE \`license_reviews\` (
          \`id\` text PRIMARY KEY NOT NULL,
          \`user_id\` text NOT NULL,
          \`file_kv_key\` text NOT NULL,
          \`status\` text DEFAULT 'pending' NOT NULL,
          \`rejection_reason\` text,
          \`submitted_at\` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
          \`reviewed_at\` text,
          FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE no action
        )
      `);
      await client.execute(
        `CREATE INDEX \`license_reviews_user_idx\` ON \`license_reviews\` (\`user_id\`)`
      );
      await client.execute(
        `CREATE INDEX \`license_reviews_status_idx\` ON \`license_reviews\` (\`status\`)`
      );
      console.log("   ✓ license_reviews table created");
    }

    // Migration 0012: banned_emails, admin_audit_log, user columns
    if (missingTables.includes("banned_emails")) {
      console.log("📝 Applying 0012_living_spyke.sql (banned_emails & audit_log)...");

      await client.execute(`
        CREATE TABLE \`admin_audit_log\` (
          \`id\` text PRIMARY KEY NOT NULL,
          \`admin_id\` text NOT NULL,
          \`action\` text NOT NULL,
          \`target_user_id\` text,
          \`details\` text,
          \`created_at\` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
          FOREIGN KEY (\`admin_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE no action,
          FOREIGN KEY (\`target_user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE no action
        )
      `);
      await client.execute(
        `CREATE INDEX \`audit_log_admin_idx\` ON \`admin_audit_log\` (\`admin_id\`)`
      );
      await client.execute(
        `CREATE INDEX \`audit_log_target_idx\` ON \`admin_audit_log\` (\`target_user_id\`)`
      );
      await client.execute(
        `CREATE INDEX \`audit_log_created_idx\` ON \`admin_audit_log\` (\`created_at\`)`
      );
      console.log("   ✓ admin_audit_log table created");

      await client.execute(`
        CREATE TABLE \`banned_emails\` (
          \`id\` text PRIMARY KEY NOT NULL,
          \`email\` text NOT NULL,
          \`reason\` text,
          \`created_at\` text DEFAULT CURRENT_TIMESTAMP NOT NULL
        )
      `);
      await client.execute(
        `CREATE UNIQUE INDEX \`banned_emails_email_idx\` ON \`banned_emails\` (\`email\`)`
      );
      console.log("   ✓ banned_emails table created");
    }

    // Check if user columns exist and add them if missing
    console.log("📝 Checking user table columns...");
    const userTableInfo = await client.execute(`PRAGMA table_info(users)`);
    const userColumns = new Set(userTableInfo.rows.map((row: any) => row.name));

    const requiredUserCols = ["banned_at", "ban_reason", "phone_verified_at"];
    const missingUserCols = requiredUserCols.filter((col) => !userColumns.has(col));

    if (missingUserCols.length > 0) {
      console.log("   Adding missing user columns:");
      for (const col of missingUserCols) {
        await client.execute(`ALTER TABLE \`users\` ADD \`${col}\` text`);
        console.log(`   ✓ Added ${col} column`);
      }
    } else {
      console.log("   ✓ All user columns exist");
    }

    console.log("\n✅ All migrations applied successfully!");
    process.exit(0);
  } catch (err: any) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

main();

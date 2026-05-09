// One-shot migration runner — applies SQL files under apps/api/drizzle/
// that have not yet been run against the target database.
//
// Tracks applied migrations in a `_migrations` table (name TEXT PRIMARY KEY).
// Safe to re-run; files that were already applied are skipped.
//
// Usage: npx tsx apps/api/scripts/apply-migrations.ts

import { config as loadEnv } from "dotenv";
import { createClient } from "@libsql/client";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

loadEnv({ path: new URL("../../../.dev.vars", import.meta.url).pathname.replace(/^\//, "") });
loadEnv({ path: ".env" });

const url = process.env.TURSO_DATABASE_URL;
if (!url) {
  console.error("TURSO_DATABASE_URL is empty.");
  process.exit(1);
}

const client = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const MIGRATIONS_DIR = new URL("../drizzle/", import.meta.url).pathname.replace(/^\//, "");

function splitSqlStatements(sql: string): string[] {
  const out: string[] = [];
  let buf = "";
  let inSingle = false;
  let inDouble = false;
  let inBacktick = false;
  let i = 0;
  while (i < sql.length) {
    const ch = sql[i];
    const next = sql[i + 1];
    if (!inSingle && !inDouble && !inBacktick && ch === "-" && next === "-") {
      while (i < sql.length && sql[i] !== "\n") i++;
      continue;
    }
    if (!inDouble && !inBacktick && ch === "'") inSingle = !inSingle;
    else if (!inSingle && !inBacktick && ch === '"') inDouble = !inDouble;
    else if (!inSingle && !inDouble && ch === "`") inBacktick = !inBacktick;
    if (ch === ";" && !inSingle && !inDouble && !inBacktick) {
      out.push(buf);
      buf = "";
      i++;
      continue;
    }
    buf += ch;
    i++;
  }
  if (buf.trim()) out.push(buf);
  return out;
}

async function main() {
  await client.execute(
    `CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  );

  const applied = new Set(
    (await client.execute("SELECT name FROM _migrations")).rows.map((r) => String(r.name)),
  );

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`⏭  ${file} (already applied)`);
      continue;
    }
    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
    const statements = (
      sql.includes("--> statement-breakpoint")
        ? sql.split("--> statement-breakpoint")
        : splitSqlStatements(sql)
    )
      .map((s) => s.trim())
      .filter(Boolean);

    console.log(`▶  ${file} (${statements.length} statements)`);
    for (const stmt of statements) {
      try {
        await client.execute(stmt);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        // Treat "already exists" / "duplicate column" as idempotent success —
        // happens when the DB was partially migrated via earlier db:push runs.
        if (/already exists|duplicate column/i.test(msg)) {
          console.log(`   · skipped (already present): ${msg.slice(0, 80)}`);
          continue;
        }
        console.error(`   ✗ failed:`, msg);
        throw err;
      }
    }
    await client.execute({
      sql: "INSERT INTO _migrations (name) VALUES (?)",
      args: [file],
    });
    console.log(`✓  ${file}`);
  }

  console.log("\nAll migrations applied.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => client.close());

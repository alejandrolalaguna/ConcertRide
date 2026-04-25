import { createClient } from "@libsql/client/web";

const url = process.env.TURSO_DATABASE_URL;
const token = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.error("TURSO_DATABASE_URL not set");
  process.exit(1);
}

const client = createClient({ url, authToken: token });

const statements = [
  `CREATE TABLE IF NOT EXISTS \`festival_alerts\` (
    \`id\` text PRIMARY KEY NOT NULL,
    \`email\` text NOT NULL,
    \`festival_slug\` text NOT NULL,
    \`created_at\` text DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS \`festival_alerts_email_slug_uniq\` ON \`festival_alerts\` (\`email\`,\`festival_slug\`)`,
  `CREATE INDEX IF NOT EXISTS \`festival_alerts_slug_idx\` ON \`festival_alerts\` (\`festival_slug\`)`,
];

try {
  for (const stmt of statements) {
    await client.execute(stmt);
    console.log("✓", stmt.substring(0, 50) + "...");
  }
  console.log("\n✅ Migration applied successfully!");
} catch (e: any) {
  console.error("Migration failed:", e.message);
  process.exit(1);
}

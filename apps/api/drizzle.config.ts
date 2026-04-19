import { config as loadEnv } from "dotenv";
import type { Config } from "drizzle-kit";

// Load creds from repo-root .env first, then .dev.vars as a fallback. Neither
// file is committed.
loadEnv({ path: "../../.env" });
loadEnv({ path: "../../.dev.vars" });

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL ?? "",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;

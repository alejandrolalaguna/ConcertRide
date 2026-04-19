import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql";
import type { Env } from "../env";
import * as schema from "./schema";

export type DB = ReturnType<typeof createDb>;

export function createDb(env: Pick<Env, "TURSO_DATABASE_URL" | "TURSO_AUTH_TOKEN">) {
  const client = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });
  return drizzle(client, { schema });
}

export { schema };

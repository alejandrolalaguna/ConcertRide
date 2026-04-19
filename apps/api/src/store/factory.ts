import type { Env } from "../env";
import type { StoreAdapter } from "./adapter";
import { getMemoryStore } from "./memory";

interface Cache {
  key: string;
  store: StoreAdapter;
}

let cache: Cache | null = null;

export async function getStore(env: Env): Promise<StoreAdapter> {
  const key = env.TURSO_DATABASE_URL ?? "";
  if (cache && cache.key === key) return cache.store;

  let store: StoreAdapter;
  if (env.TURSO_DATABASE_URL) {
    const { createDrizzleStore } = await import("./drizzle");
    store = createDrizzleStore(env);
  } else {
    store = getMemoryStore();
  }

  cache = { key, store };
  return store;
}

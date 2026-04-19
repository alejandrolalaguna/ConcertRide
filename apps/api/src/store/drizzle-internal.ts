// Re-exports the class so Node-side scripts (seed, smoke-ingest) can instantiate
// it with a Node @libsql/client, while the Worker path continues to use the
// /web client via the public createDrizzleStore(env) factory.

export { DrizzleStore } from "./drizzle";

// Cleanup script: removes all rides, messages, ride_requests, demand_signals,
// reviews, reports, push_subscriptions, favorites, and all users except the
// given email. Concerts and venues are left untouched.
//
// Usage:
//   npx tsx apps/api/scripts/cleanup-db.ts
//   # or with explicit email:
//   KEEP_EMAIL=alejandrolalaguna@gmail.com npx tsx apps/api/scripts/cleanup-db.ts

import { config as loadEnv } from "dotenv";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { ne, notInArray } from "drizzle-orm";
import * as schema from "../src/db/schema";

loadEnv({ path: new URL("../../../.dev.vars", import.meta.url).pathname.replace(/^\//, "") });
loadEnv({ path: ".env" });

const url = process.env.TURSO_DATABASE_URL;
if (!url) {
  console.error("TURSO_DATABASE_URL is not set in .dev.vars");
  process.exit(1);
}

const KEEP_EMAIL = process.env.KEEP_EMAIL ?? "alejandrolalaguna@gmail.com";

const client = createClient({
  url,
  ...(process.env.TURSO_AUTH_TOKEN ? { authToken: process.env.TURSO_AUTH_TOKEN } : {}),
});
const db = drizzle(client, { schema });

async function cleanup() {
  console.log(`Connecting to ${url}…`);
  console.log(`Will keep user: ${KEEP_EMAIL}`);

  // 1. Find the ID of the user to keep
  const keepUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, KEEP_EMAIL),
    columns: { id: true, email: true, name: true },
  });
  if (!keepUser) {
    console.warn(`WARNING: No user found with email ${KEEP_EMAIL} — will still delete all other data.`);
  } else {
    console.log(`Keeping user: ${keepUser.name} (${keepUser.id})`);
  }

  const keepIds = keepUser ? [keepUser.id] : [];

  // 2. Delete in FK-safe order: child tables first

  console.log("Deleting push_subscriptions…");
  const ps = await db.delete(schema.pushSubscriptions).returning({ id: schema.pushSubscriptions.id });
  console.log(`  → ${ps.length} rows`);

  console.log("Deleting demand_signals…");
  const ds = await db.delete(schema.demandSignals).returning({ id: schema.demandSignals.id });
  console.log(`  → ${ds.length} rows`);

  console.log("Deleting favorites…");
  const fav = await db.delete(schema.favorites).returning({ id: schema.favorites.id });
  console.log(`  → ${fav.length} rows`);

  console.log("Deleting messages…");
  const msg = await db.delete(schema.messages).returning({ id: schema.messages.id });
  console.log(`  → ${msg.length} rows`);

  console.log("Deleting reviews…");
  const rev = await db.delete(schema.reviews).returning({ id: schema.reviews.id });
  console.log(`  → ${rev.length} rows`);

  console.log("Deleting reports…");
  const rep = await db.delete(schema.reports).returning({ id: schema.reports.id });
  console.log(`  → ${rep.length} rows`);

  console.log("Deleting ride_requests…");
  const rr = await db.delete(schema.rideRequests).returning({ id: schema.rideRequests.id });
  console.log(`  → ${rr.length} rows`);

  console.log("Deleting rides…");
  const rd = await db.delete(schema.rides).returning({ id: schema.rides.id });
  console.log(`  → ${rd.length} rows`);

  console.log("Deleting users (except keeper)…");
  const deletedUsers = keepIds.length > 0
    ? await db.delete(schema.users).where(notInArray(schema.users.id, keepIds)).returning({ id: schema.users.id, email: schema.users.email })
    : await db.delete(schema.users).returning({ id: schema.users.id, email: schema.users.email });
  console.log(`  → ${deletedUsers.length} users deleted`);
  if (deletedUsers.length > 0) {
    deletedUsers.forEach((u) => console.log(`     - ${u.email} (${u.id})`));
  }

  console.log("\n✓ Cleanup complete. Concerts and venues are untouched.");
}

cleanup()
  .catch((err) => {
    console.error("cleanup failed:", err);
    process.exit(1);
  })
  .finally(() => {
    client.close();
  });

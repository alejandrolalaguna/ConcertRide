// Read-only production monitoring snapshot.
//
//   node scripts/monitor.mjs            (run from apps/api/)
//   npm run db:monitor
//
// Loads Turso creds from repo-root .env (same as drizzle.config.ts). Shows
// real signups and their activity, EXCLUDING seed/fixture accounts
// (anything @example.*) so the report reflects actual users only.
import { config as loadEnv } from "dotenv";
import { createClient } from "@libsql/client";

loadEnv({ path: "../../.env" });
loadEnv({ path: "../../.dev.vars" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Seed accounts to hide from the report. `@example.%` covers @example.es and
// the stray @example.ess test account. Tweak here if you want to surface them.
const SEED_FILTER = "email NOT LIKE '%@example.%'";

const q = async (label, sql, args = []) => {
  try {
    const r = await db.execute({ sql, args });
    console.log(`\n=== ${label} (${r.rows.length}) ===`);
    if (r.rows.length === 0) { console.log("(vacío)"); return; }
    for (const row of r.rows) console.log(JSON.stringify(row));
  } catch (e) {
    console.log(`\n=== ${label} === ERROR: ${e.message}`);
  }
};

// Headline counts: real users vs. seed.
try {
  const total = (await db.execute("SELECT COUNT(*) AS n FROM users")).rows[0].n;
  const real = (await db.execute(`SELECT COUNT(*) AS n FROM users WHERE ${SEED_FILTER}`)).rows[0].n;
  const verified = (await db.execute(
    `SELECT COUNT(*) AS n FROM users WHERE ${SEED_FILTER} AND email_verified_at IS NOT NULL`,
  )).rows[0].n;
  console.log("=== USERS ===");
  console.log(`total=${total}  reales=${real}  seed=${total - real}  reales_verificados=${verified}`);
} catch (e) {
  console.log("USERS count ERROR:", e.message);
}

await q("USUARIOS REALES (recientes)",
  `SELECT id, email, name, verified, email_verified_at, home_city, phone_verified_at,
          rides_given, banned_at, created_at
   FROM users WHERE ${SEED_FILTER} ORDER BY created_at DESC LIMIT 100`);

// Activity, restricted to real actors (join against the seed filter where there's a user_id).
await q("RIDES de usuarios reales",
  `SELECT r.id, r.driver_id, r.origin_city, r.status, r.price_per_seat, r.seats_left, r.created_at
   FROM rides r JOIN users u ON u.id = r.driver_id
   WHERE u.email NOT LIKE '%@example.%' ORDER BY r.created_at DESC LIMIT 50`);

await q("RIDE REQUESTS de usuarios reales",
  `SELECT rr.id, rr.ride_id, rr.passenger_id, rr.seats, rr.status, rr.created_at
   FROM ride_requests rr JOIN users u ON u.id = rr.passenger_id
   WHERE u.email NOT LIKE '%@example.%' ORDER BY rr.created_at DESC LIMIT 50`);

await q("FAVORITES de usuarios reales",
  `SELECT f.id, f.user_id, f.kind, f.target_id, f.label, f.created_at
   FROM favorites f JOIN users u ON u.id = f.user_id
   WHERE u.email NOT LIKE '%@example.%' ORDER BY f.created_at DESC LIMIT 50`);

await q("DEMAND SIGNALS de usuarios reales",
  `SELECT d.id, d.concert_id, d.user_id, d.created_at, d.expires_at
   FROM demand_signals d JOIN users u ON u.id = d.user_id
   WHERE u.email NOT LIKE '%@example.%' ORDER BY d.created_at DESC LIMIT 50`);

await q("EVENT ANTICIPATIONS de usuarios reales",
  `SELECT a.id, a.user_id, a.concert_id, a.status, a.ride_id, a.created_at
   FROM event_anticipations a JOIN users u ON u.id = a.user_id
   WHERE u.email NOT LIKE '%@example.%' ORDER BY a.created_at DESC LIMIT 50`);

await q("FESTIVAL ALERTS (suscripciones email)",
  `SELECT id, email, festival_slug, created_at
   FROM festival_alerts ORDER BY created_at DESC LIMIT 50`);

await q("FESTIVAL DEMAND (waitlist festival × origen)",
  `SELECT id, festival_slug, origin_city, user_id, email, created_at, notified_at
   FROM festival_demand ORDER BY created_at DESC LIMIT 50`);

await q("LICENSE REVIEWS pendientes (usuarios reales)",
  `SELECT lr.id, lr.user_id, u.name, u.email, lr.status, lr.submitted_at
   FROM license_reviews lr JOIN users u ON u.id = lr.user_id
   WHERE lr.status = 'pending' AND u.email NOT LIKE '%@example.%'
   ORDER BY lr.submitted_at DESC LIMIT 50`);

await q("MESSAGES de usuarios reales",
  `SELECT m.id, m.ride_id, m.concert_id, m.user_id, m.kind, substr(m.body,1,60) AS body_preview, m.created_at
   FROM messages m JOIN users u ON u.id = m.user_id
   WHERE u.email NOT LIKE '%@example.%' ORDER BY m.created_at DESC LIMIT 30`);

console.log("\n=== DONE ===");
process.exit(0);

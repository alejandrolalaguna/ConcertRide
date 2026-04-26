// Deletes rides with departure_time > 2026-04-25 that are NOT completed.
// Dry-run by default. Pass --confirm to actually delete.
import { createClient } from "../../../node_modules/@libsql/client/lib-cjs/node.js";

const DRY_RUN = !process.argv.includes("--confirm");
const CUTOFF = "2026-04-25T23:59:59.000Z";

const client = createClient({
  url: "libsql://concertride-alalaguna.aws-eu-west-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY1ODY3NDQsImlkIjoiMDE5ZGE0ZDEtYWUwMS03ZTVkLTkyYzItNTk4NDViOGQ4ZDc4IiwicmlkIjoiNDAzZDM4MmMtZjlhOC00NjllLWE3OGYtMjQzY2QxYThiN2IwIn0.eSXRnQvwP6Q-fWKaJMgR8GWs7-xcJpZd9jcVyjpBAyV9qW5aaA2knF5AFrgdHax_jr2FYWJVZ3mRlMXJxRH7AA",
});

const preview = await client.execute({
  sql: `SELECT id, concert_id, origin_city, departure_time, status
        FROM rides
        WHERE departure_time > ? AND status != 'completed'
        ORDER BY departure_time`,
  args: [CUTOFF],
});

console.log(`\nViajes a eliminar (departure_time > ${CUTOFF}, status != completed): ${preview.rows.length}\n`);
for (const r of preview.rows) {
  console.log(`  ${r.departure_time}  [${r.status}]  ${r.origin_city}  id:${r.id}`);
}

if (DRY_RUN) {
  console.log("\n⚠️  DRY-RUN — no se ha borrado nada. Ejecuta con --confirm para borrar.\n");
  process.exit(0);
}

const ids = preview.rows.map(r => r.id);
const placeholders = ids.map(() => "?").join(",");

// Delete dependent rows first, then the rides themselves
const steps = [
  { table: "ride_checklist", col: "ride_id" },
  { table: "ride_requests",  col: "ride_id" },
  { table: "messages",       col: "ride_id" },
  { table: "reviews",        col: "ride_id" },
  { table: "reports",        col: "ride_id" },
];

for (const { table, col } of steps) {
  const r = await client.execute({ sql: `DELETE FROM ${table} WHERE ${col} IN (${placeholders})`, args: ids });
  console.log(`  🗑  ${table}: ${r.rowsAffected} filas eliminadas`);
}

const result = await client.execute({
  sql: `DELETE FROM rides WHERE id IN (${placeholders})`,
  args: ids,
});
console.log(`\n✅  Viajes eliminados: ${result.rowsAffected}\n`);

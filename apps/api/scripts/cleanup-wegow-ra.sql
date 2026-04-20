-- ConcertRide ES — cleanup Wegow and Resident Advisor data
-- Run this directly in Turso after deploying the schema migration.
--
-- SAFE to run multiple times (idempotent deletes).
-- Order matters: delete dependents before parents.

-- 1. Remove staging rows for wegow and ra
DELETE FROM concert_sources WHERE source IN ('wegow', 'ra');

-- 2. Remove concerts that came ONLY from wegow/ra (no ticketmaster_id, not adhoc)
--    and have no rides attached (safe to delete).
DELETE FROM concerts
WHERE ticketmaster_id IS NULL
  AND id NOT LIKE 'c_adhoc_%'
  AND NOT EXISTS (
    SELECT 1 FROM rides WHERE rides.concert_id = concerts.id
  );

-- 3. Remove venues that are now orphaned (no concert references them).
DELETE FROM venues
WHERE NOT EXISTS (
  SELECT 1 FROM concerts WHERE concerts.venue_id = venues.id
);

-- 4. Add the ticketmaster_url column if it doesn't exist yet.
--    (drizzle-kit db:push handles this, but included for direct SQL runs)
-- ALTER TABLE concerts ADD COLUMN ticketmaster_url TEXT;

-- 5. Verify: concerts remaining should all have ticketmaster_id OR be adhoc.
-- SELECT id, artist, ticketmaster_id, id LIKE 'c_adhoc_%' as is_adhoc
-- FROM concerts
-- WHERE ticketmaster_id IS NULL AND id NOT LIKE 'c_adhoc_%';
-- ^ Should return 0 rows after this cleanup.

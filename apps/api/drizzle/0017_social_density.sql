-- Phase 1 — Social density foundation.
-- Adds music identity columns to users and four new tables that turn one-off
-- rides into persistent relationships.

-- 1. Music identity + social columns on users.
ALTER TABLE `users` ADD COLUMN `bio` text;
ALTER TABLE `users` ADD COLUMN `music_genres` text;
ALTER TABLE `users` ADD COLUMN `top_artists` text;
ALTER TABLE `users` ADD COLUMN `spotify_id` text;
ALTER TABLE `users` ADD COLUMN `handle` text;
ALTER TABLE `users` ADD COLUMN `crew_count` integer NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX `users_handle_idx` ON `users` (`handle`);
CREATE UNIQUE INDEX `users_spotify_idx` ON `users` (`spotify_id`);

-- 2. Symmetric crew connections.
CREATE TABLE `crew_connections` (
  `id` text PRIMARY KEY NOT NULL,
  `a_id` text NOT NULL REFERENCES `users`(`id`),
  `b_id` text NOT NULL REFERENCES `users`(`id`),
  `requested_by` text NOT NULL REFERENCES `users`(`id`),
  `status` text NOT NULL DEFAULT 'pending',
  `origin_ride_id` text REFERENCES `rides`(`id`),
  `origin_concert_id` text REFERENCES `concerts`(`id`),
  `created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `accepted_at` text
);

CREATE UNIQUE INDEX `crew_pair_idx` ON `crew_connections` (`a_id`, `b_id`);
CREATE INDEX `crew_a_idx` ON `crew_connections` (`a_id`);
CREATE INDEX `crew_b_idx` ON `crew_connections` (`b_id`);
CREATE INDEX `crew_status_idx` ON `crew_connections` (`status`);

-- 3. Activity events (live feed).
CREATE TABLE `activity_events` (
  `id` text PRIMARY KEY NOT NULL,
  `actor_id` text NOT NULL REFERENCES `users`(`id`),
  `kind` text NOT NULL,
  `target_id` text,
  `concert_id` text REFERENCES `concerts`(`id`),
  `city` text,
  `actor_name` text NOT NULL,
  `actor_avatar` text,
  `label` text NOT NULL DEFAULT '',
  `metadata` text,
  `visibility` text NOT NULL DEFAULT 'public',
  `created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX `activity_actor_idx` ON `activity_events` (`actor_id`);
CREATE INDEX `activity_concert_idx` ON `activity_events` (`concert_id`);
CREATE INDEX `activity_city_idx` ON `activity_events` (`city`);
CREATE INDEX `activity_kind_idx` ON `activity_events` (`kind`);
CREATE INDEX `activity_created_idx` ON `activity_events` (`created_at`);

-- 4. Event anticipations (countdown / "going" signal).
CREATE TABLE `event_anticipations` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`),
  `concert_id` text NOT NULL REFERENCES `concerts`(`id`),
  `status` text NOT NULL DEFAULT 'going',
  `ride_id` text REFERENCES `rides`(`id`),
  `notify_before_hours` integer NOT NULL DEFAULT 24,
  `last_notified_at` text,
  `created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX `anticipation_user_idx` ON `event_anticipations` (`user_id`);
CREATE INDEX `anticipation_concert_idx` ON `event_anticipations` (`concert_id`);
CREATE UNIQUE INDEX `anticipation_unique_idx` ON `event_anticipations` (`user_id`, `concert_id`);

-- 5. Trip memories (post-trip vibe cards).
CREATE TABLE `trip_memories` (
  `id` text PRIMARY KEY NOT NULL,
  `ride_id` text NOT NULL REFERENCES `rides`(`id`),
  `concert_id` text NOT NULL REFERENCES `concerts`(`id`),
  `created_by` text NOT NULL REFERENCES `users`(`id`),
  `title` text NOT NULL,
  `caption` text,
  `payload_json` text NOT NULL DEFAULT '{}',
  `image_kv_key` text,
  `visibility` text NOT NULL DEFAULT 'public',
  `share_count` integer NOT NULL DEFAULT 0,
  `created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX `trip_memories_ride_idx` ON `trip_memories` (`ride_id`);
CREATE INDEX `trip_memories_concert_idx` ON `trip_memories` (`concert_id`);
CREATE INDEX `trip_memories_creator_idx` ON `trip_memories` (`created_by`);

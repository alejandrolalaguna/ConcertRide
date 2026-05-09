-- Phase 2 — Cultural platform.
-- festival_qnas: moderated community Q&A scoped to a festival slug.
-- squads + squad_members: multi-car group coordination per concert.
-- playlist_tracks: collaborative playlist for a ride or squad.

CREATE TABLE `festival_qnas` (
  `id` text PRIMARY KEY NOT NULL,
  `festival_slug` text NOT NULL,
  `user_id` text NOT NULL REFERENCES `users`(`id`),
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `upvotes` integer NOT NULL DEFAULT 0,
  `approved_at` text,
  `created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX `festival_qnas_slug_idx` ON `festival_qnas` (`festival_slug`);
CREATE INDEX `festival_qnas_approved_idx` ON `festival_qnas` (`festival_slug`, `approved_at`);

CREATE TABLE `squads` (
  `id` text PRIMARY KEY NOT NULL,
  `concert_id` text NOT NULL REFERENCES `concerts`(`id`),
  `owner_id` text NOT NULL REFERENCES `users`(`id`),
  `name` text NOT NULL,
  `vibe_tags` text,
  `visibility` text NOT NULL DEFAULT 'private',
  `invite_code` text NOT NULL,
  `created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX `squads_concert_idx` ON `squads` (`concert_id`);
CREATE INDEX `squads_owner_idx` ON `squads` (`owner_id`);
CREATE UNIQUE INDEX `squads_invite_idx` ON `squads` (`invite_code`);

CREATE TABLE `squad_members` (
  `id` text PRIMARY KEY NOT NULL,
  `squad_id` text NOT NULL REFERENCES `squads`(`id`),
  `user_id` text NOT NULL REFERENCES `users`(`id`),
  `role` text NOT NULL DEFAULT 'passenger',
  `ride_id` text REFERENCES `rides`(`id`),
  `joined_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `left_at` text
);
CREATE INDEX `squad_members_squad_idx` ON `squad_members` (`squad_id`);
CREATE INDEX `squad_members_user_idx` ON `squad_members` (`user_id`);
CREATE UNIQUE INDEX `squad_members_unique_idx` ON `squad_members` (`squad_id`, `user_id`);

CREATE TABLE `playlist_tracks` (
  `id` text PRIMARY KEY NOT NULL,
  `ride_id` text REFERENCES `rides`(`id`),
  `squad_id` text REFERENCES `squads`(`id`),
  `added_by` text NOT NULL REFERENCES `users`(`id`),
  `track_uri` text,
  `track_name` text NOT NULL,
  `artist_name` text NOT NULL,
  `album_image_url` text,
  `duration_ms` integer,
  `position` integer NOT NULL DEFAULT 0,
  `created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX `playlist_tracks_ride_idx` ON `playlist_tracks` (`ride_id`);
CREATE INDEX `playlist_tracks_squad_idx` ON `playlist_tracks` (`squad_id`);

CREATE TABLE `concert_sources` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`source_event_id` text NOT NULL,
	`source_url` text NOT NULL,
	`concert_id` text,
	`raw_json` text NOT NULL,
	`fetched_at` text NOT NULL,
	FOREIGN KEY (`concert_id`) REFERENCES `concerts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `concert_sources_source_event_idx` ON `concert_sources` (`source`,`source_event_id`);--> statement-breakpoint
CREATE TABLE `concerts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`artist` text NOT NULL,
	`venue_id` text NOT NULL,
	`date` text NOT NULL,
	`image_url` text,
	`ticketmaster_id` text,
	`genre` text,
	`price_min` real,
	`price_max` real,
	`fingerprint` text NOT NULL,
	`sources_json` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`venue_id`) REFERENCES `venues`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `concerts_fingerprint_idx` ON `concerts` (`fingerprint`);--> statement-breakpoint
CREATE INDEX `concerts_date_idx` ON `concerts` (`date`);--> statement-breakpoint
CREATE INDEX `concerts_venue_idx` ON `concerts` (`venue_id`);--> statement-breakpoint
CREATE TABLE `ride_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`ride_id` text NOT NULL,
	`passenger_id` text NOT NULL,
	`seats` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`message` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`ride_id`) REFERENCES `rides`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`passenger_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `ride_requests_ride_idx` ON `ride_requests` (`ride_id`);--> statement-breakpoint
CREATE TABLE `rides` (
	`id` text PRIMARY KEY NOT NULL,
	`driver_id` text NOT NULL,
	`concert_id` text NOT NULL,
	`origin_city` text NOT NULL,
	`origin_lat` real NOT NULL,
	`origin_lng` real NOT NULL,
	`origin_address` text NOT NULL,
	`departure_time` text NOT NULL,
	`price_per_seat` real NOT NULL,
	`seats_total` integer NOT NULL,
	`seats_left` integer NOT NULL,
	`round_trip` integer DEFAULT false NOT NULL,
	`return_time` text,
	`playlist_url` text,
	`vibe` text NOT NULL,
	`notes` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`driver_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`concert_id`) REFERENCES `concerts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `rides_concert_idx` ON `rides` (`concert_id`);--> statement-breakpoint
CREATE INDEX `rides_origin_idx` ON `rides` (`origin_city`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`avatar_url` text,
	`verified` integer DEFAULT false NOT NULL,
	`rating` real DEFAULT 0 NOT NULL,
	`rating_count` integer DEFAULT 0 NOT NULL,
	`car_model` text,
	`car_color` text,
	`rides_given` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `venues` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`capacity` integer,
	`image_url` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

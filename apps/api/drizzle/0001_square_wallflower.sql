CREATE TABLE `demand_signals` (
	`id` text PRIMARY KEY NOT NULL,
	`concert_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`concert_id`) REFERENCES `concerts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `demand_signals_concert_idx` ON `demand_signals` (`concert_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `demand_signals_unique_idx` ON `demand_signals` (`concert_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`ride_id` text,
	`concert_id` text,
	`user_id` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`ride_id`) REFERENCES `rides`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`concert_id`) REFERENCES `concerts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `messages_ride_idx` ON `messages` (`ride_id`);--> statement-breakpoint
CREATE INDEX `messages_concert_idx` ON `messages` (`concert_id`);--> statement-breakpoint
CREATE INDEX `messages_created_idx` ON `messages` (`created_at`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`ride_id` text NOT NULL,
	`reviewer_id` text NOT NULL,
	`reviewee_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`ride_id`) REFERENCES `rides`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewee_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `reviews_ride_idx` ON `reviews` (`ride_id`);--> statement-breakpoint
CREATE INDEX `reviews_reviewee_idx` ON `reviews` (`reviewee_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `reviews_unique_idx` ON `reviews` (`ride_id`,`reviewer_id`,`reviewee_id`);--> statement-breakpoint
ALTER TABLE `concerts` ADD `ticketmaster_url` text;--> statement-breakpoint
ALTER TABLE `ride_requests` ADD `luggage` text;--> statement-breakpoint
ALTER TABLE `rides` ADD `smoking_policy` text DEFAULT 'no' NOT NULL;--> statement-breakpoint
ALTER TABLE `rides` ADD `max_luggage` text DEFAULT 'backpack' NOT NULL;--> statement-breakpoint
ALTER TABLE `rides` ADD `instant_booking` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `rides` ADD `completed_at` text;--> statement-breakpoint
ALTER TABLE `rides` ADD `completion_confirmed_by` text;--> statement-breakpoint
ALTER TABLE `users` ADD `phone` text;--> statement-breakpoint
ALTER TABLE `users` ADD `home_city` text;--> statement-breakpoint
ALTER TABLE `users` ADD `smoker` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `has_license` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `password_hash` text;--> statement-breakpoint
ALTER TABLE `users` ADD `password_salt` text;
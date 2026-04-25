CREATE TABLE `festival_alerts` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`festival_slug` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `festival_alerts_email_slug_uniq` ON `festival_alerts` (`email`,`festival_slug`);--> statement-breakpoint
CREATE INDEX `festival_alerts_slug_idx` ON `festival_alerts` (`festival_slug`);--> statement-breakpoint
CREATE TABLE `ride_checklist` (
	`id` text PRIMARY KEY NOT NULL,
	`ride_id` text NOT NULL,
	`item_type` text NOT NULL,
	`value` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`confirmed_at` text,
	FOREIGN KEY (`ride_id`) REFERENCES `rides`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `ride_checklist_ride_idx` ON `ride_checklist` (`ride_id`);--> statement-breakpoint
CREATE INDEX `ride_checklist_status_idx` ON `ride_checklist` (`status`);--> statement-breakpoint
ALTER TABLE `rides` ADD `price_negotiable` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `rides` ADD `payment_reminder_sent_at` text;
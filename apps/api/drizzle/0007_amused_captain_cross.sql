CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`reporter_id` text NOT NULL,
	`target_user_id` text,
	`ride_id` text,
	`reason` text NOT NULL,
	`body` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ride_id`) REFERENCES `rides`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `reports_reporter_idx` ON `reports` (`reporter_id`);--> statement-breakpoint
CREATE INDEX `reports_target_user_idx` ON `reports` (`target_user_id`);--> statement-breakpoint
CREATE INDEX `reports_status_idx` ON `reports` (`status`);--> statement-breakpoint
ALTER TABLE `rides` ADD `reminded_at` text;--> statement-breakpoint
ALTER TABLE `users` ADD `tos_accepted_at` text;--> statement-breakpoint
ALTER TABLE `users` ADD `deleted_at` text;
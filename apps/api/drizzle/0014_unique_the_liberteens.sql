CREATE TABLE `identity_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`file_kv_key` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`rejection_reason` text,
	`submitted_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`reviewed_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `identity_reviews_user_idx` ON `identity_reviews` (`user_id`);--> statement-breakpoint
CREATE INDEX `identity_reviews_status_idx` ON `identity_reviews` (`status`);--> statement-breakpoint
ALTER TABLE `users` ADD `identity_verified` integer DEFAULT false NOT NULL;
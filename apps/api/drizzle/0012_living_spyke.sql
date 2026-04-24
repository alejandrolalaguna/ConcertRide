CREATE TABLE `admin_audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`admin_id` text NOT NULL,
	`action` text NOT NULL,
	`target_user_id` text,
	`details` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `audit_log_admin_idx` ON `admin_audit_log` (`admin_id`);--> statement-breakpoint
CREATE INDEX `audit_log_target_idx` ON `admin_audit_log` (`target_user_id`);--> statement-breakpoint
CREATE INDEX `audit_log_created_idx` ON `admin_audit_log` (`created_at`);--> statement-breakpoint
CREATE TABLE `banned_emails` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`reason` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `banned_emails_email_idx` ON `banned_emails` (`email`);--> statement-breakpoint
ALTER TABLE `users` ADD `banned_at` text;--> statement-breakpoint
ALTER TABLE `users` ADD `ban_reason` text;--> statement-breakpoint
ALTER TABLE `users` ADD `phone_verified_at` text;
ALTER TABLE `ride_requests` ADD `payment_method` text;--> statement-breakpoint
ALTER TABLE `rides` ADD `accepted_payment` text DEFAULT 'cash' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `referral_code` text;--> statement-breakpoint
ALTER TABLE `users` ADD `referral_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `users_referral_code_idx` ON `users` (`referral_code`);
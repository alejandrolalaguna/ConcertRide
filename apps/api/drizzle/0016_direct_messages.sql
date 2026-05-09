CREATE TABLE `direct_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`sender_id` text NOT NULL REFERENCES `users`(`id`),
	`recipient_id` text NOT NULL REFERENCES `users`(`id`),
	`kind` text NOT NULL DEFAULT 'text',
	`body` text NOT NULL,
	`attachment_url` text,
	`created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX `dm_sender_idx` ON `direct_messages` (`sender_id`);
CREATE INDEX `dm_recipient_idx` ON `direct_messages` (`recipient_id`);
CREATE INDEX `dm_created_idx` ON `direct_messages` (`created_at`);

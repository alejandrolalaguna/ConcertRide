ALTER TABLE `rides` ADD COLUMN `payment_reminder_sent_at` text;

CREATE INDEX `rides_payment_reminder_idx` ON `rides` (`payment_reminder_sent_at`);

CREATE TABLE `ride_checklist` (
  `id` text NOT NULL PRIMARY KEY,
  `ride_id` text NOT NULL,
  `item_type` text NOT NULL,
  `value` text,
  `status` text NOT NULL DEFAULT 'pending',
  `created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmed_at` text,
  FOREIGN KEY (`ride_id`) REFERENCES `rides` (`id`)
);

CREATE INDEX `ride_checklist_ride_idx` ON `ride_checklist` (`ride_id`);
CREATE INDEX `ride_checklist_status_idx` ON `ride_checklist` (`status`);

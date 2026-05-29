CREATE TABLE IF NOT EXISTS `festival_demand` (
  `id` text PRIMARY KEY NOT NULL,
  `festival_slug` text NOT NULL,
  `origin_city` text NOT NULL,
  `user_id` text REFERENCES `users`(`id`),
  `email` text,
  `created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notified_at` text
);

CREATE INDEX IF NOT EXISTS `festival_demand_festival_idx` ON `festival_demand` (`festival_slug`);
CREATE INDEX IF NOT EXISTS `festival_demand_city_idx` ON `festival_demand` (`festival_slug`, `origin_city`);

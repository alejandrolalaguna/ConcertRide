CREATE TABLE IF NOT EXISTS `festival_alerts` (
  `id` text PRIMARY KEY NOT NULL,
  `email` text NOT NULL,
  `festival_slug` text NOT NULL,
  `created_at` text NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS `festival_alerts_email_slug_uniq` ON `festival_alerts` (`email`, `festival_slug`);
CREATE INDEX IF NOT EXISTS `festival_alerts_slug_idx` ON `festival_alerts` (`festival_slug`);

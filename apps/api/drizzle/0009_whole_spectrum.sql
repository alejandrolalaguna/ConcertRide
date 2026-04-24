CREATE INDEX `ride_requests_passenger_idx` ON `ride_requests` (`passenger_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `ride_requests_unique_idx` ON `ride_requests` (`ride_id`,`passenger_id`);
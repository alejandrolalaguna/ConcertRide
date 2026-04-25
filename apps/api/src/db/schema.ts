import { relations, sql } from "drizzle-orm";
import { integer, real, sqliteTable, text, uniqueIndex, index } from "drizzle-orm/sqlite-core";

export const venues = sqliteTable("venues", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull().default(""),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  capacity: integer("capacity"),
  image_url: text("image_url"),
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    avatar_url: text("avatar_url"),
    verified: integer("verified", { mode: "boolean" }).notNull().default(false),
    rating: real("rating").notNull().default(0),
    rating_count: integer("rating_count").notNull().default(0),
    car_model: text("car_model"),
    car_color: text("car_color"),
    rides_given: integer("rides_given").notNull().default(0),
    phone: text("phone"),
    home_city: text("home_city"),
    smoker: integer("smoker", { mode: "boolean" }),
    has_license: integer("has_license", { mode: "boolean" }),
    license_verified: integer("license_verified", { mode: "boolean" }).notNull().default(false),
    referral_code: text("referral_code"),
    referral_count: integer("referral_count").notNull().default(0),
    password_hash: text("password_hash"),
    password_salt: text("password_salt"),
    // Timestamp of Terms & Privacy acceptance during registration. Required by
    // GDPR art.6/7 (proof of consent). Nullable for users created before the
    // ToS flow was introduced.
    tos_accepted_at: text("tos_accepted_at"),
    // Timestamp when the user clicked the verification link sent on register.
    // Null = email not verified. Soft-gates write actions (publish ride,
    // book seat) until confirmed, via a banner nudge.
    email_verified_at: text("email_verified_at"),
    // Soft-delete marker. When non-null the account is anonymised and all PII
    // stripped. We keep the row so reviews/history attributed to it stay
    // consistent for other users.
    deleted_at: text("deleted_at"),
    // Set by admin when banning. Banned users cannot login or create rides/requests.
    banned_at: text("banned_at"),
    ban_reason: text("ban_reason"),
    // Set when user verifies their phone number via OTP.
    phone_verified_at: text("phone_verified_at"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
    referralCodeIdx: uniqueIndex("users_referral_code_idx").on(t.referral_code),
  }),
);

export const concerts = sqliteTable(
  "concerts",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    artist: text("artist").notNull(),
    venue_id: text("venue_id")
      .notNull()
      .references(() => venues.id),
    date: text("date").notNull(),
    image_url: text("image_url"),
    ticketmaster_id: text("ticketmaster_id"),
    ticketmaster_url: text("ticketmaster_url"),
    // Festival/concert organiser website (e.g. https://sonar.es). Distinct from
    // ticketmaster_url because most Spanish festivals sell tickets through
    // their own platform or non-TM partners.
    official_url: text("official_url"),
    // Pipe-or-dot-separated headliners for festivals. Null for solo concerts
    // (the `artist` column already holds the performer).
    lineup: text("lineup"),
    genre: text("genre"),
    price_min: real("price_min"),
    price_max: real("price_max"),
    fingerprint: text("fingerprint").notNull(),
    sources_json: text("sources_json").notNull().default("[]"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    fingerprintIdx: uniqueIndex("concerts_fingerprint_idx").on(t.fingerprint),
    dateIdx: index("concerts_date_idx").on(t.date),
    venueIdx: index("concerts_venue_idx").on(t.venue_id),
  }),
);

export const rides = sqliteTable(
  "rides",
  {
    id: text("id").primaryKey(),
    driver_id: text("driver_id")
      .notNull()
      .references(() => users.id),
    concert_id: text("concert_id")
      .notNull()
      .references(() => concerts.id),
    origin_city: text("origin_city").notNull(),
    origin_lat: real("origin_lat").notNull(),
    origin_lng: real("origin_lng").notNull(),
    origin_address: text("origin_address").notNull(),
    departure_time: text("departure_time").notNull(),
    price_per_seat: real("price_per_seat").notNull(),
    seats_total: integer("seats_total").notNull(),
    seats_left: integer("seats_left").notNull(),
    round_trip: integer("round_trip", { mode: "boolean" }).notNull().default(false),
    return_time: text("return_time"),
    playlist_url: text("playlist_url"),
    vibe: text("vibe", { enum: ["party", "chill", "mixed"] }).notNull(),
    smoking_policy: text("smoking_policy", { enum: ["no", "yes"] }).notNull().default("no"),
    max_luggage: text("max_luggage", { enum: ["none", "small", "backpack", "cabin", "large", "extra"] }).notNull().default("backpack"),
    notes: text("notes"),
    instant_booking: integer("instant_booking", { mode: "boolean" }).notNull().default(sql`0`),
    accepted_payment: text("accepted_payment", { enum: ["cash", "bizum", "cash_or_bizum"] }).notNull().default("cash"),
    status: text("status", { enum: ["active", "full", "cancelled", "completed"] })
      .notNull()
      .default("active"),
    completed_at: text("completed_at"),
    completion_confirmed_by: text("completion_confirmed_by", { enum: ["driver", "both"] }),
    // Timestamp of the last 24h-reminder email so the cron doesn't fire twice
    // for the same ride.
    reminded_at: text("reminded_at"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    concertIdx: index("rides_concert_idx").on(t.concert_id),
    originIdx: index("rides_origin_idx").on(t.origin_city),
    driverIdx: index("rides_driver_idx").on(t.driver_id),
  }),
);

export const rideRequests = sqliteTable(
  "ride_requests",
  {
    id: text("id").primaryKey(),
    ride_id: text("ride_id")
      .notNull()
      .references(() => rides.id),
    passenger_id: text("passenger_id")
      .notNull()
      .references(() => users.id),
    seats: integer("seats").notNull(),
    status: text("status", {
      enum: ["pending", "confirmed", "rejected", "cancelled"],
    })
      .notNull()
      .default("pending"),
    message: text("message"),
    luggage: text("luggage", { enum: ["none", "small", "backpack", "cabin", "large", "extra"] }),
    payment_method: text("payment_method", { enum: ["cash", "bizum", "cash_or_bizum"] }),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    rideIdx: index("ride_requests_ride_idx").on(t.ride_id),
    passengerIdx: index("ride_requests_passenger_idx").on(t.passenger_id),
    uniqueRequest: uniqueIndex("ride_requests_unique_idx").on(t.ride_id, t.passenger_id),
  }),
);

export const demandSignals = sqliteTable(
  "demand_signals",
  {
    id: text("id").primaryKey(),
    concert_id: text("concert_id")
      .notNull()
      .references(() => concerts.id),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    expires_at: text("expires_at").notNull(),
  },
  (t) => ({
    concertIdx: index("demand_signals_concert_idx").on(t.concert_id),
    uniqueSignal: uniqueIndex("demand_signals_unique_idx").on(t.concert_id, t.user_id),
  }),
);

export const messages = sqliteTable(
  "messages",
  {
    id: text("id").primaryKey(),
    ride_id: text("ride_id").references(() => rides.id),
    concert_id: text("concert_id").references(() => concerts.id),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id),
    kind: text("kind").notNull().default("text"),
    body: text("body").notNull(),
    attachment_url: text("attachment_url"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    rideIdx: index("messages_ride_idx").on(t.ride_id),
    concertIdx: index("messages_concert_idx").on(t.concert_id),
    createdIdx: index("messages_created_idx").on(t.created_at),
  }),
);

export const reviews = sqliteTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    ride_id: text("ride_id")
      .notNull()
      .references(() => rides.id),
    reviewer_id: text("reviewer_id")
      .notNull()
      .references(() => users.id),
    reviewee_id: text("reviewee_id")
      .notNull()
      .references(() => users.id),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    rideIdx: index("reviews_ride_idx").on(t.ride_id),
    revieweeIdx: index("reviews_reviewee_idx").on(t.reviewee_id),
    uniqueReview: uniqueIndex("reviews_unique_idx").on(t.ride_id, t.reviewer_id, t.reviewee_id),
  }),
);

export const favorites = sqliteTable(
  "favorites",
  {
    id: text("id").primaryKey(),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id),
    // "concert" → target_id is a concert id
    // "artist"  → target_id is the normalised artist name (lowercased)
    // "city"    → target_id is the normalised city name (lowercased)
    kind: text("kind", { enum: ["concert", "artist", "city"] }).notNull(),
    target_id: text("target_id").notNull(),
    // Free-form display label — for artist/city this preserves proper casing
    // ("Rosalía", "Madrid") so the UI doesn't have to re-lookup.
    label: text("label").notNull(),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    userIdx: index("favorites_user_idx").on(t.user_id),
    uniqueFav: uniqueIndex("favorites_unique_idx").on(t.user_id, t.kind, t.target_id),
  }),
);

export const reports = sqliteTable(
  "reports",
  {
    id: text("id").primaryKey(),
    reporter_id: text("reporter_id")
      .notNull()
      .references(() => users.id),
    // Target may be a user, a ride, or both. At least one must be present.
    target_user_id: text("target_user_id").references(() => users.id),
    ride_id: text("ride_id").references(() => rides.id),
    reason: text("reason", {
      enum: ["spam", "scam", "harassment", "no_show", "unsafe", "other"],
    }).notNull(),
    body: text("body"),
    status: text("status", { enum: ["pending", "reviewed", "resolved", "dismissed"] })
      .notNull()
      .default("pending"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    reporterIdx: index("reports_reporter_idx").on(t.reporter_id),
    targetUserIdx: index("reports_target_user_idx").on(t.target_user_id),
    statusIdx: index("reports_status_idx").on(t.status),
  }),
);

export const pushSubscriptions = sqliteTable(
  "push_subscriptions",
  {
    id: text("id").primaryKey(),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id),
    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    userIdx: index("push_subs_user_idx").on(t.user_id),
    endpointIdx: uniqueIndex("push_subs_endpoint_idx").on(t.endpoint),
  }),
);

// Emails that can never re-register. Populated when a user is banned or
// when a deleted account is flagged for abuse. Prevents cycling through
// new accounts after a ban.
export const bannedEmails = sqliteTable(
  "banned_emails",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    reason: text("reason"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    emailIdx: uniqueIndex("banned_emails_email_idx").on(t.email),
  }),
);

// Immutable audit trail of admin actions (ban, license approve/reject, report resolve).
export const adminAuditLog = sqliteTable(
  "admin_audit_log",
  {
    id: text("id").primaryKey(),
    admin_id: text("admin_id").notNull().references(() => users.id),
    action: text("action", {
      enum: ["ban_user", "unban_user", "license_approve", "license_reject", "report_resolve", "report_dismiss"],
    }).notNull(),
    target_user_id: text("target_user_id").references(() => users.id),
    details: text("details"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    adminIdx: index("audit_log_admin_idx").on(t.admin_id),
    targetIdx: index("audit_log_target_idx").on(t.target_user_id),
    createdIdx: index("audit_log_created_idx").on(t.created_at),
  }),
);

export const licenseReviews = sqliteTable(
  "license_reviews",
  {
    id: text("id").primaryKey(),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id),
    file_kv_key: text("file_kv_key").notNull(),
    status: text("status", { enum: ["pending", "approved", "rejected"] })
      .notNull()
      .default("pending"),
    rejection_reason: text("rejection_reason"),
    submitted_at: text("submitted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    reviewed_at: text("reviewed_at"),
  },
  (t) => ({
    userIdx: index("license_reviews_user_idx").on(t.user_id),
    statusIdx: index("license_reviews_status_idx").on(t.status),
  }),
);

// Staging table for the multi-source ingestion layer (M5).
// One row per raw fetched event, pre-dedup.
export const concertSources = sqliteTable(
  "concert_sources",
  {
    id: text("id").primaryKey(),
    source: text("source").notNull(),
    source_event_id: text("source_event_id").notNull(),
    source_url: text("source_url").notNull(),
    concert_id: text("concert_id").references(() => concerts.id),
    raw_json: text("raw_json").notNull(),
    fetched_at: text("fetched_at").notNull(),
  },
  (t) => ({
    sourceEventIdx: uniqueIndex("concert_sources_source_event_idx").on(
      t.source,
      t.source_event_id,
    ),
  }),
);

// Pre-ride coordination checklist. Populated after ride request is confirmed.
// Helps passengers and drivers agree on pickup location, time, phone number, etc.
export const rideChecklist = sqliteTable(
  "ride_checklist",
  {
    id: text("id").primaryKey(),
    ride_id: text("ride_id")
      .notNull()
      .references(() => rides.id),
    item_type: text("item_type", {
      enum: ["pickup_location", "pickup_time", "driver_phone", "luggage_confirmation"],
    }).notNull(),
    // For pickup_location: address or coordinates
    // For pickup_time: ISO timestamp
    // For driver_phone: phone number
    // For luggage_confirmation: "small" | "large" | etc
    value: text("value"),
    // "pending" = not confirmed, "confirmed" = both parties agreed
    status: text("status", { enum: ["pending", "confirmed"] })
      .notNull()
      .default("pending"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    confirmed_at: text("confirmed_at"),
  },
  (t) => ({
    rideIdx: index("ride_checklist_ride_idx").on(t.ride_id),
    statusIdx: index("ride_checklist_status_idx").on(t.status),
  }),
);

// --- Relations for typed relational queries (db.query.*.findMany({ with: {...} })) ---

export const venuesRelations = relations(venues, ({ many }) => ({
  concerts: many(concerts),
}));

export const concertsRelations = relations(concerts, ({ one, many }) => ({
  venue: one(venues, { fields: [concerts.venue_id], references: [venues.id] }),
  rides: many(rides),
}));

export const usersRelations = relations(users, ({ many }) => ({
  rides: many(rides),
  requests: many(rideRequests),
}));

export const ridesRelations = relations(rides, ({ one, many }) => ({
  driver: one(users, { fields: [rides.driver_id], references: [users.id] }),
  concert: one(concerts, { fields: [rides.concert_id], references: [concerts.id] }),
  requests: many(rideRequests),
}));

export const rideRequestsRelations = relations(rideRequests, ({ one }) => ({
  ride: one(rides, { fields: [rideRequests.ride_id], references: [rides.id] }),
  passenger: one(users, { fields: [rideRequests.passenger_id], references: [users.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  ride: one(rides, { fields: [messages.ride_id], references: [rides.id] }),
  concert: one(concerts, { fields: [messages.concert_id], references: [concerts.id] }),
  user: one(users, { fields: [messages.user_id], references: [users.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  ride: one(rides, { fields: [reviews.ride_id], references: [rides.id] }),
  reviewer: one(users, { fields: [reviews.reviewer_id], references: [users.id], relationName: "reviewer" }),
  reviewee: one(users, { fields: [reviews.reviewee_id], references: [users.id], relationName: "reviewee" }),
}));

export const pushSubscriptionsRelations = relations(pushSubscriptions, ({ one }) => ({
  user: one(users, { fields: [pushSubscriptions.user_id], references: [users.id] }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, { fields: [reports.reporter_id], references: [users.id], relationName: "reporter" }),
  target_user: one(users, { fields: [reports.target_user_id], references: [users.id], relationName: "target_user" }),
  ride: one(rides, { fields: [reports.ride_id], references: [rides.id] }),
}));

export const licenseReviewsRelations = relations(licenseReviews, ({ one }) => ({
  user: one(users, { fields: [licenseReviews.user_id], references: [users.id] }),
}));

export const rideChecklistRelations = relations(rideChecklist, ({ one }) => ({
  ride: one(rides, { fields: [rideChecklist.ride_id], references: [rides.id] }),
}));

export type VenueRow = typeof venues.$inferSelect;
export type UserRow = typeof users.$inferSelect;
export type ConcertRow = typeof concerts.$inferSelect;
export type RideRow = typeof rides.$inferSelect;
export type RideRequestRow = typeof rideRequests.$inferSelect;
export type DemandSignalRow = typeof demandSignals.$inferSelect;
export type MessageRow = typeof messages.$inferSelect;
export type ReviewRow = typeof reviews.$inferSelect;
export type ConcertSourceRow = typeof concertSources.$inferSelect;
export type LicenseReviewRow = typeof licenseReviews.$inferSelect;
export type BannedEmailRow = typeof bannedEmails.$inferSelect;
export type AdminAuditLogRow = typeof adminAuditLog.$inferSelect;
export type RideChecklistRow = typeof rideChecklist.$inferSelect;

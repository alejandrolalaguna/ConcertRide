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
    identity_verified: integer("identity_verified", { mode: "boolean" }).notNull().default(false),
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
    // --- Music identity (Phase 1B) ---
    // Free-form short bio shown on the public profile + crew cards. Max 200 chars.
    bio: text("bio"),
    // Pipe-separated list of favourite music genres (e.g. "indie|rock|electronica").
    // Used for crew compatibility, route ranking, "your scene" feed sections.
    music_genres: text("music_genres"),
    // Pipe-separated list of favourite artists in display casing (e.g. "Rosalía|C. Tangana").
    // The `favorites` table is the canonical store for follows; this is a denormalised
    // top-N for fast rendering on profile cards and ride cards.
    top_artists: text("top_artists"),
    // Spotify user id (linked via OAuth). Null until the user connects.
    spotify_id: text("spotify_id"),
    // ConcertRide handle for sharing profiles ("@aitor"). Optional, lowercased, unique.
    handle: text("handle"),
    // Counter of crews this user belongs to (denormalised for fast list rendering).
    crew_count: integer("crew_count").notNull().default(0),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
    referralCodeIdx: uniqueIndex("users_referral_code_idx").on(t.referral_code),
    handleIdx: uniqueIndex("users_handle_idx").on(t.handle),
    spotifyIdx: uniqueIndex("users_spotify_idx").on(t.spotify_id),
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
    price_negotiable: integer("price_negotiable", { mode: "boolean" }).notNull().default(sql`0`),
    accepted_payment: text("accepted_payment", { enum: ["cash", "bizum", "cash_or_bizum"] }).notNull().default("cash"),
    status: text("status", { enum: ["active", "full", "cancelled", "completed"] })
      .notNull()
      .default("active"),
    completed_at: text("completed_at"),
    completion_confirmed_by: text("completion_confirmed_by", { enum: ["driver", "both"] }),
    // Timestamp of the last 24h-reminder email so the cron doesn't fire twice
    // for the same ride.
    reminded_at: text("reminded_at"),
    // Timestamp of the 1h-reminder payment confirmation so the cron doesn't fire twice
    payment_reminder_sent_at: text("payment_reminder_sent_at"),
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

export const festivalDemand = sqliteTable(
  "festival_demand",
  {
    id: text("id").primaryKey(),
    festival_slug: text("festival_slug").notNull(),
    origin_city: text("origin_city").notNull(),
    user_id: text("user_id").references(() => users.id),
    email: text("email"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    notified_at: text("notified_at"),
  },
  (t) => ({
    festivalIdx: index("festival_demand_festival_idx").on(t.festival_slug),
    cityIdx: index("festival_demand_city_idx").on(t.festival_slug, t.origin_city),
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
      enum: ["ban_user", "unban_user", "license_approve", "license_reject", "identity_approve", "identity_reject", "report_resolve", "report_dismiss"],
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

export const identityReviews = sqliteTable(
  "identity_reviews",
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
    userIdx: index("identity_reviews_user_idx").on(t.user_id),
    statusIdx: index("identity_reviews_status_idx").on(t.status),
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

export const identityReviewsRelations = relations(identityReviews, ({ one }) => ({
  user: one(users, { fields: [identityReviews.user_id], references: [users.id] }),
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
export type IdentityReviewRow = typeof identityReviews.$inferSelect;
export type BannedEmailRow = typeof bannedEmails.$inferSelect;
export type AdminAuditLogRow = typeof adminAuditLog.$inferSelect;
export type RideChecklistRow = typeof rideChecklist.$inferSelect;

export const festivalAlerts = sqliteTable(
  "festival_alerts",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    festival_slug: text("festival_slug").notNull(),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    emailSlugUniq: uniqueIndex("festival_alerts_email_slug_uniq").on(t.email, t.festival_slug),
    slugIdx: index("festival_alerts_slug_idx").on(t.festival_slug),
  }),
);

// Private 1-to-1 messages between two registered users.
// The "conversation" key is the sorted pair (min_id, max_id) so queries are symmetric.
export const directMessages = sqliteTable(
  "direct_messages",
  {
    id: text("id").primaryKey(),
    sender_id: text("sender_id")
      .notNull()
      .references(() => users.id),
    recipient_id: text("recipient_id")
      .notNull()
      .references(() => users.id),
    kind: text("kind").notNull().default("text"),
    body: text("body").notNull(),
    attachment_url: text("attachment_url"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    senderIdx: index("dm_sender_idx").on(t.sender_id),
    recipientIdx: index("dm_recipient_idx").on(t.recipient_id),
    createdIdx: index("dm_created_idx").on(t.created_at),
  }),
);

export const directMessagesRelations = relations(directMessages, ({ one }) => ({
  sender: one(users, { fields: [directMessages.sender_id], references: [users.id], relationName: "dm_sender" }),
  recipient: one(users, { fields: [directMessages.recipient_id], references: [users.id], relationName: "dm_recipient" }),
}));

export type FestivalAlertRow = typeof festivalAlerts.$inferSelect;
export type FestivalDemandRow = typeof festivalDemand.$inferSelect;
export type DirectMessageRow = typeof directMessages.$inferSelect;

// =====================================================================
// SOCIAL DENSITY LAYER (Phase 1)
//
// These tables turn one-off rides into persistent relationships. The
// north-star metric they support is "returning social coordination" —
// repeat users coordinating across multiple events.
// =====================================================================

// Symmetric "crew" relationship between two users. Stored as a single row
// with the smaller user_id in `a_id` so lookups are O(1) regardless of
// which side queries. `status` allows pending invites without a separate
// inbox table.
export const crewConnections = sqliteTable(
  "crew_connections",
  {
    id: text("id").primaryKey(),
    // Always the lexicographically smaller user_id; enforced in store layer.
    a_id: text("a_id").notNull().references(() => users.id),
    b_id: text("b_id").notNull().references(() => users.id),
    // Who initiated the connection — used to render "X invited you" copy.
    requested_by: text("requested_by").notNull().references(() => users.id),
    status: text("status", { enum: ["pending", "accepted", "blocked"] })
      .notNull()
      .default("pending"),
    // The ride that introduced these two users, if any. Powers
    // "you rode together to Mad Cool" provenance copy on the crew card.
    origin_ride_id: text("origin_ride_id").references(() => rides.id),
    origin_concert_id: text("origin_concert_id").references(() => concerts.id),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    accepted_at: text("accepted_at"),
  },
  (t) => ({
    pairIdx: uniqueIndex("crew_pair_idx").on(t.a_id, t.b_id),
    aIdx: index("crew_a_idx").on(t.a_id),
    bIdx: index("crew_b_idx").on(t.b_id),
    statusIdx: index("crew_status_idx").on(t.status),
  }),
);

// Append-only feed of social actions across the platform. Source of truth
// for the homepage "live activity" feed, the per-event activity strip,
// and crew notifications. We avoid storing sensitive bodies here — only
// references (actor + target ids) so feed queries stay cheap.
export const activityEvents = sqliteTable(
  "activity_events",
  {
    id: text("id").primaryKey(),
    actor_id: text("actor_id").notNull().references(() => users.id),
    kind: text("kind", {
      enum: [
        // Marketplace
        "ride_published",
        "ride_booked",
        "ride_completed",
        // Anticipation
        "interest_added",
        "favorite_added",
        // Social
        "crew_invited",
        "crew_accepted",
        "music_updated",
        "trip_memory_shared",
      ],
    }).notNull(),
    // Loose pointer — meaning depends on `kind`.
    // ride_*: ride id; interest/favorite: concert id; crew_*: target user id.
    target_id: text("target_id"),
    // Concert id when applicable, hoisted out for the per-event feed query.
    concert_id: text("concert_id").references(() => concerts.id),
    // City scope for the city activity feed (origin_city for rides, home_city for crew, etc.).
    city: text("city"),
    // Snapshot fields used by the renderer so we don't re-join on every read.
    // Kept short: actor display name, target label, optional metadata JSON.
    actor_name: text("actor_name").notNull(),
    actor_avatar: text("actor_avatar"),
    label: text("label").notNull().default(""),
    metadata: text("metadata"),
    visibility: text("visibility", { enum: ["public", "crew", "private"] })
      .notNull()
      .default("public"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    actorIdx: index("activity_actor_idx").on(t.actor_id),
    concertIdx: index("activity_concert_idx").on(t.concert_id),
    cityIdx: index("activity_city_idx").on(t.city),
    kindIdx: index("activity_kind_idx").on(t.kind),
    createdIdx: index("activity_created_idx").on(t.created_at),
  }),
);

// Persistent record of "I'm going" / "save the date" intent linked to a
// concert. Differs from `demandSignals` (anonymous interest) and
// `favorites` (artist/city follows) in that it expresses *attendance*
// intent and powers countdown widgets ("3 days until Mad Cool, your crew
// of 5 is going").
export const eventAnticipations = sqliteTable(
  "event_anticipations",
  {
    id: text("id").primaryKey(),
    user_id: text("user_id").notNull().references(() => users.id),
    concert_id: text("concert_id").notNull().references(() => concerts.id),
    // "going"  — confirmed attendance
    // "maybe"  — soft interest
    status: text("status", { enum: ["going", "maybe"] })
      .notNull()
      .default("going"),
    // Optional ride this anticipation is bound to. Auto-set when a passenger
    // books a seat or a driver publishes a ride.
    ride_id: text("ride_id").references(() => rides.id),
    notify_before_hours: integer("notify_before_hours").notNull().default(24),
    last_notified_at: text("last_notified_at"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    userIdx: index("anticipation_user_idx").on(t.user_id),
    concertIdx: index("anticipation_concert_idx").on(t.concert_id),
    uniquePair: uniqueIndex("anticipation_unique_idx").on(t.user_id, t.concert_id),
  }),
);

// Post-trip artefact. Generated from a completed ride and made shareable
// as a "vibe card". Owned by the driver but visible to riders so they
// can repost it. The image_kv_key references a renderable card stored
// in the CACHE KV namespace.
export const tripMemories = sqliteTable(
  "trip_memories",
  {
    id: text("id").primaryKey(),
    ride_id: text("ride_id").notNull().references(() => rides.id),
    concert_id: text("concert_id").notNull().references(() => concerts.id),
    created_by: text("created_by").notNull().references(() => users.id),
    title: text("title").notNull(),
    caption: text("caption"),
    // JSON: { vibe, distance_km, crew_ids, playlist_url, hero_color }
    payload_json: text("payload_json").notNull().default("{}"),
    // Pre-rendered share image for OG/Twitter cards. Optional — the page
    // can also render dynamically.
    image_kv_key: text("image_kv_key"),
    visibility: text("visibility", { enum: ["public", "crew", "private"] })
      .notNull()
      .default("public"),
    share_count: integer("share_count").notNull().default(0),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    rideIdx: uniqueIndex("trip_memories_ride_idx").on(t.ride_id),
    concertIdx: index("trip_memories_concert_idx").on(t.concert_id),
    createdByIdx: index("trip_memories_creator_idx").on(t.created_by),
  }),
);

export const crewConnectionsRelations = relations(crewConnections, ({ one }) => ({
  user_a: one(users, { fields: [crewConnections.a_id], references: [users.id], relationName: "crew_a" }),
  user_b: one(users, { fields: [crewConnections.b_id], references: [users.id], relationName: "crew_b" }),
  requester: one(users, { fields: [crewConnections.requested_by], references: [users.id], relationName: "crew_requester" }),
  origin_ride: one(rides, { fields: [crewConnections.origin_ride_id], references: [rides.id] }),
  origin_concert: one(concerts, { fields: [crewConnections.origin_concert_id], references: [concerts.id] }),
}));

export const activityEventsRelations = relations(activityEvents, ({ one }) => ({
  actor: one(users, { fields: [activityEvents.actor_id], references: [users.id] }),
  concert: one(concerts, { fields: [activityEvents.concert_id], references: [concerts.id] }),
}));

export const eventAnticipationsRelations = relations(eventAnticipations, ({ one }) => ({
  user: one(users, { fields: [eventAnticipations.user_id], references: [users.id] }),
  concert: one(concerts, { fields: [eventAnticipations.concert_id], references: [concerts.id] }),
  ride: one(rides, { fields: [eventAnticipations.ride_id], references: [rides.id] }),
}));

export const tripMemoriesRelations = relations(tripMemories, ({ one }) => ({
  ride: one(rides, { fields: [tripMemories.ride_id], references: [rides.id] }),
  concert: one(concerts, { fields: [tripMemories.concert_id], references: [concerts.id] }),
  creator: one(users, { fields: [tripMemories.created_by], references: [users.id] }),
}));

export type CrewConnectionRow = typeof crewConnections.$inferSelect;
export type ActivityEventRow = typeof activityEvents.$inferSelect;
export type EventAnticipationRow = typeof eventAnticipations.$inferSelect;
export type TripMemoryRow = typeof tripMemories.$inferSelect;

// =====================================================================
// CULTURAL PLATFORM LAYER (Phase 2)
// =====================================================================

// Community-submitted Q&A scoped to a festival slug. Moderated: only
// rows with `approved_at IS NOT NULL` ever surface in the FAQPage schema
// or the public list endpoint.
export const festivalQnas = sqliteTable(
  "festival_qnas",
  {
    id: text("id").primaryKey(),
    festival_slug: text("festival_slug").notNull(),
    user_id: text("user_id").notNull().references(() => users.id),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    upvotes: integer("upvotes").notNull().default(0),
    approved_at: text("approved_at"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    slugIdx: index("festival_qnas_slug_idx").on(t.festival_slug),
    approvedIdx: index("festival_qnas_approved_idx").on(t.festival_slug, t.approved_at),
  }),
);

// Squad: a multi-car coordination group around a single concert. Members
// can be drivers (each with their own ride) or passengers riding any of
// those rides. Replaces fragmented WhatsApp coordination.
export const squads = sqliteTable(
  "squads",
  {
    id: text("id").primaryKey(),
    concert_id: text("concert_id").notNull().references(() => concerts.id),
    owner_id: text("owner_id").notNull().references(() => users.id),
    name: text("name").notNull(),
    // Pipe-separated tags for vibe/genre matching across squads.
    vibe_tags: text("vibe_tags"),
    // Public squads accept anyone with the invite link; private requires owner approval.
    visibility: text("visibility", { enum: ["public", "private"] }).notNull().default("private"),
    invite_code: text("invite_code").notNull(),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    concertIdx: index("squads_concert_idx").on(t.concert_id),
    ownerIdx: index("squads_owner_idx").on(t.owner_id),
    inviteIdx: uniqueIndex("squads_invite_idx").on(t.invite_code),
  }),
);

// Membership in a squad. A user may be linked to a specific ride within
// the squad (their seat/car) or floating ("looking for car").
export const squadMembers = sqliteTable(
  "squad_members",
  {
    id: text("id").primaryKey(),
    squad_id: text("squad_id").notNull().references(() => squads.id),
    user_id: text("user_id").notNull().references(() => users.id),
    role: text("role", { enum: ["owner", "driver", "passenger", "looking"] })
      .notNull()
      .default("passenger"),
    ride_id: text("ride_id").references(() => rides.id),
    joined_at: text("joined_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    left_at: text("left_at"),
  },
  (t) => ({
    squadIdx: index("squad_members_squad_idx").on(t.squad_id),
    userIdx: index("squad_members_user_idx").on(t.user_id),
    uniqueMember: uniqueIndex("squad_members_unique_idx").on(t.squad_id, t.user_id),
  }),
);

// Collaborative playlist tracks for a ride or squad. Spotify-friendly
// schema: we store track URI/name/artist/added_by so the renderer can
// stream from any provider.
export const playlistTracks = sqliteTable(
  "playlist_tracks",
  {
    id: text("id").primaryKey(),
    // Exactly one of ride_id / squad_id must be set.
    ride_id: text("ride_id").references(() => rides.id),
    squad_id: text("squad_id").references(() => squads.id),
    added_by: text("added_by").notNull().references(() => users.id),
    track_uri: text("track_uri"),
    track_name: text("track_name").notNull(),
    artist_name: text("artist_name").notNull(),
    album_image_url: text("album_image_url"),
    duration_ms: integer("duration_ms"),
    position: integer("position").notNull().default(0),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    rideIdx: index("playlist_tracks_ride_idx").on(t.ride_id),
    squadIdx: index("playlist_tracks_squad_idx").on(t.squad_id),
  }),
);

export const festivalQnasRelations = relations(festivalQnas, ({ one }) => ({
  user: one(users, { fields: [festivalQnas.user_id], references: [users.id] }),
}));

export const squadsRelations = relations(squads, ({ one, many }) => ({
  concert: one(concerts, { fields: [squads.concert_id], references: [concerts.id] }),
  owner: one(users, { fields: [squads.owner_id], references: [users.id] }),
  members: many(squadMembers),
}));

export const squadMembersRelations = relations(squadMembers, ({ one }) => ({
  squad: one(squads, { fields: [squadMembers.squad_id], references: [squads.id] }),
  user: one(users, { fields: [squadMembers.user_id], references: [users.id] }),
  ride: one(rides, { fields: [squadMembers.ride_id], references: [rides.id] }),
}));

export const playlistTracksRelations = relations(playlistTracks, ({ one }) => ({
  ride: one(rides, { fields: [playlistTracks.ride_id], references: [rides.id] }),
  squad: one(squads, { fields: [playlistTracks.squad_id], references: [squads.id] }),
  adder: one(users, { fields: [playlistTracks.added_by], references: [users.id] }),
}));

export type FestivalQnaRow = typeof festivalQnas.$inferSelect;
export type SquadRow = typeof squads.$inferSelect;
export type SquadMemberRow = typeof squadMembers.$inferSelect;
export type PlaylistTrackRow = typeof playlistTracks.$inferSelect;

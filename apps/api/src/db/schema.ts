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
    password_hash: text("password_hash"),
    password_salt: text("password_salt"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
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
    status: text("status", { enum: ["active", "full", "cancelled"] })
      .notNull()
      .default("active"),
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    concertIdx: index("rides_concert_idx").on(t.concert_id),
    originIdx: index("rides_origin_idx").on(t.origin_city),
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
    created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    rideIdx: index("ride_requests_ride_idx").on(t.ride_id),
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

export type VenueRow = typeof venues.$inferSelect;
export type UserRow = typeof users.$inferSelect;
export type ConcertRow = typeof concerts.$inferSelect;
export type RideRow = typeof rides.$inferSelect;
export type RideRequestRow = typeof rideRequests.$inferSelect;
export type ConcertSourceRow = typeof concertSources.$inferSelect;

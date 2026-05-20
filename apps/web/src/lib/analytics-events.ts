// Central catalogue of PostHog product-analytics events used across the
// ConcertRide web app. Centralising the event names here (instead of using
// loose string literals in every page) prevents typos that fragment the
// funnel, keeps the catalog discoverable for new contributors, and gives us
// a single place to enforce property contracts.
//
// Privacy
// -------
// trackEvent() must NEVER receive PII. Use anonymised identifiers (ride_id,
// concert_id, slug, page_type) — never email, phone, name, or street
// address. The wrapper does not redact values; the contract is enforced by
// the caller and reviewed in code review.
//
// Consent
// -------
// trackEvent() is a thin wrapper around the existing consent-gated track()
// helper in lib/observability.ts. If the user has not granted analytics
// consent, PostHog is never loaded and the call becomes a silent no-op —
// no throws, no network requests.

import { track } from "./observability";

export const ANALYTICS_EVENTS = {
  // ── Search & Discovery ───────────────────────────────────────────────
  CONCERT_SEARCH_FILTER_APPLIED: "concert_search_filter_applied",
  RIDE_SEARCH_FILTER_APPLIED: "ride_search_filter_applied",
  FESTIVAL_LANDING_VIEWED: "festival_landing_viewed",
  ROUTE_LANDING_VIEWED: "route_landing_viewed",

  // ── Booking & Publishing ─────────────────────────────────────────────
  PUBLISH_RIDE_STARTED: "publish_ride_started",
  PUBLISH_RIDE_COMPLETED: "publish_ride_completed",
  REQUEST_SEAT_STARTED: "request_seat_started",
  REQUEST_SEAT_COMPLETED: "request_seat_completed",

  // ── Auth ─────────────────────────────────────────────────────────────
  USER_REGISTERED: "user_registered",
  USER_LOGIN: "user_login",
  USER_LOGOUT: "user_logout",

  // ── Social / Crew ────────────────────────────────────────────────────
  CREW_CREATED: "crew_created",
  CREW_JOINED: "crew_joined",

  // ── Content engagement ───────────────────────────────────────────────
  BLOG_POST_READ_50: "blog_post_read_50pct",
  BLOG_POST_READ_100: "blog_post_read_100pct",
  PILLAR_CTA_CLICKED: "pillar_cta_clicked",
  DATASET_DOWNLOAD: "dataset_download",

  // ── Conversion ───────────────────────────────────────────────────────
  HERO_CTA_CLICKED: "hero_cta_clicked",
  STICKY_REG_BAR_CLICKED: "sticky_reg_bar_clicked",
  FOOTER_CTA_CLICKED: "footer_cta_clicked",
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

// Properties must be primitives — PostHog flattens nested objects in ways
// that are hard to query downstream. Keep keys snake_case to match the
// existing seoEvents.ts convention.
export type AnalyticsEventProperties = Record<string, string | number | boolean | null>;

/**
 * Emit a product-analytics event. Safe to call before PostHog has loaded
 * (no-op) and before the user has granted analytics consent (no-op via the
 * underlying track() helper).
 *
 * NEVER pass PII in `props` — only IDs / slugs / page types.
 */
export function trackEvent(name: AnalyticsEventName, props?: AnalyticsEventProperties): void {
  try {
    track(name, props as Record<string, unknown> | undefined);
  } catch {
    // track() already swallows errors; this catch is defensive in case the
    // import itself is misconfigured during dev. We never want analytics
    // to break the user's session.
  }
}

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

  // ── AI surfaces (Google AI Mode / ChatGPT / Perplexity / Gemini) ─────
  // Emitted once per session when the user lands from a known AI surface
  // referrer. Lets us measure "ConcertRide cited inside an AI answer →
  // outbound click" which is the canonical AI-citation conversion metric
  // (Google I/O 2026: cited brands earn +35 % organic clicks).
  AI_REFERRAL_LANDED: "ai_referral_landed",
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

/**
 * Detect which AI surface (if any) sent the user to this page based on the
 * document.referrer and URL params. Returns a normalised slug we can pivot
 * by in PostHog or null when the referral is not from a known AI surface.
 *
 * Google AI Mode uses `udm=50` as the disambiguation parameter on
 * google.com/search (added May 2025, stable through 2026).
 * AI Overview citations preserve the original SERP referrer plus a
 * citation-tracking param — we conservatively flag them as "google_ai".
 */
export type AiSurface =
  | "google_ai_mode"
  | "google_ai_overview"
  | "chatgpt"
  | "perplexity"
  | "claude"
  | "gemini"
  | "copilot"
  | "you"
  | "phind";

export function detectAiSurface(opts: {
  referrer?: string;
  url?: string;
} = {}): AiSurface | null {
  if (typeof window === "undefined") return null;
  const ref = (opts.referrer ?? document.referrer ?? "").toLowerCase();
  const url = (opts.url ?? window.location.href ?? "").toLowerCase();

  // Google AI Mode signals: `udm=50` OR `sca_esv=ai_mode` in landing URL.
  if (/[?&]udm=50\b/.test(url) || /[?&]sca_esv=ai_mode\b/.test(url)) {
    return "google_ai_mode";
  }
  // AI Overview citation tracker (rolling change since 2025).
  if (/[?&](aiov|aip|aioai)=/.test(url) && /google\.[a-z.]+/.test(ref)) {
    return "google_ai_overview";
  }

  if (!ref) return null;
  if (/(^|\.)chatgpt\.com|chat\.openai\.com/.test(ref)) return "chatgpt";
  if (/(^|\.)perplexity\.ai/.test(ref)) return "perplexity";
  if (/(^|\.)claude\.ai/.test(ref)) return "claude";
  if (/gemini\.google\.com|bard\.google\.com/.test(ref)) return "gemini";
  if (/copilot\.microsoft\.com|copilot\.cloud\.microsoft/.test(ref)) return "copilot";
  if (/(^|\.)you\.com/.test(ref)) return "you";
  if (/(^|\.)phind\.com/.test(ref)) return "phind";
  return null;
}

const AI_REFERRAL_SESSION_KEY = "cr_ai_referral_emitted";

/**
 * Fire-and-forget: detect AI surface once per session and emit
 * `AI_REFERRAL_LANDED` with `surface` + landing `path`. Safe to call from
 * any top-level page mount; subsequent calls within the same session are
 * silent no-ops (sessionStorage de-duped).
 */
export function trackAiReferralOnce(): void {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(AI_REFERRAL_SESSION_KEY)) return;
    const surface = detectAiSurface();
    if (!surface) return;
    window.sessionStorage.setItem(AI_REFERRAL_SESSION_KEY, "1");
    trackEvent(ANALYTICS_EVENTS.AI_REFERRAL_LANDED, {
      surface,
      path: window.location.pathname,
      referrer_host: (() => {
        try {
          return new URL(document.referrer).host;
        } catch {
          return "unknown";
        }
      })(),
    });
  } catch {
    // Session storage can throw in private modes; analytics must never block.
  }
}

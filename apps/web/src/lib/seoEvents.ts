// Tipped wrappers around track() for the events we care about for SEO
// iteration (Phase 8 of the growth system: rastrea rankings + tráfico,
// mejora páginas débiles, duplica esfuerzos en ganadores).
//
// Every helper is consent-aware via track(); callers don't need to guard.
//
// ── Ownership boundary: seoEvents.ts vs analytics-events.ts ───────────────
// This module owns *SEO surfaces*: landing page-views (festival_view,
// city_view, blog_view), route search intent, the generic `cta_click` on
// marketing CTAs, and `alert_subscribe` (the honest micro-conversion on
// landings whose ride catalogue is still empty).
//
// `lib/analytics-events.ts` owns the *product funnel*: auth (register /
// login, including their failure branches), ride publishing, seat requests,
// messaging and outbound clicks. Keep new events on the correct side so the
// PostHog catalogue stays navigable and a single concept never forks into
// two series.
//
// Attribution (`attr_*`) is registered as PostHog super-properties by
// hooks/useAttribution.ts, so every event below inherits partner/UTM
// attribution automatically — never pass attribution props by hand.

import { track } from "./observability";

/**
 * The real browser pathname, including any router `basename` prefix.
 *
 * Part of our traffic is served under `basename="/en"`, and react-router's
 * `useLocation()` strips that prefix — so an `/en/festivales/mad-cool` visit
 * would be reported as `/festivales/mad-cool` and silently merge with the
 * Spanish landing in PostHog. Always use this helper for any event property
 * that carries a path.
 *
 * SSR-safe: returns an empty string when there is no `window`.
 */
export function currentPath(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname;
}

/** Domain in which a failure status is being interpreted. */
export type FailureContext =
  | "register"
  | "login"
  | "publish_ride"
  | "request_seat"
  | "message"
  | "alert";

/**
 * Map an HTTP status code to a small, stable, PII-free failure reason.
 *
 * Rationale: error *messages* are localized and can echo user input, so they
 * must never reach PostHog. Status codes are safe and give us enough
 * resolution to tell "users can't sign up" from "users don't try".
 *
 * `context` lets one status carry the right domain meaning (a 409 is
 * `email_taken` when registering but a plain `conflict` elsewhere) while
 * keeping a single mapping table.
 */
export function failureReasonFromStatus(
  status: number | null | undefined,
  context: FailureContext,
): string {
  if (status == null) return "network_error";
  switch (status) {
    case 400:
      return context === "register" ? "password_too_short" : "invalid_input";
    case 401:
      return context === "login" ? "invalid_credentials" : "unauthenticated";
    case 403:
      return "forbidden";
    case 404:
      return "not_found";
    case 409:
      switch (context) {
        case "register":
          return "email_taken";
        case "alert":
          return "already_subscribed";
        case "request_seat":
          return "already_requested";
        default:
          return "conflict";
      }
    case 410:
      return "gone";
    case 422:
      return "validation_failed";
    case 429:
      return "rate_limited";
    default:
      if (status >= 500) return "server_error";
      if (status >= 400) return "client_error";
      return "unknown";
  }
}

type CtaSurface =
  | "hero"
  | "final_cta"
  | "festival_landing"
  | "city_landing"
  | "guide"
  | "blog"
  | "ride_card"
  | "concert_detail"
  | "navbar"
  | "footer";

type CtaIntent =
  | "search_ride"
  | "publish_ride"
  | "register"
  | "login"
  | "view_concert"
  | "view_festival"
  | "view_city"
  | "subscribe_alert"
  | "share";

export function trackCta(surface: CtaSurface, intent: CtaIntent, extra?: Record<string, unknown>) {
  track("cta_click", { surface, intent, ...extra });
}

export function trackFestivalView(slug: string, name: string, futureRides?: number) {
  track("festival_view", { slug, name, future_rides: futureRides ?? null });
}

export function trackCityView(slug: string, name: string, concertCount?: number) {
  track("city_view", { slug, name, concert_count: concertCount ?? null });
}

export function trackRouteSearch(origin: string | null, destination: string | null, dateFrom?: string | null) {
  track("route_search", { origin, destination, date_from: dateFrom ?? null });
}

export function trackBlogView(slug: string, title: string) {
  track("blog_view", { slug, title });
}

/**
 * Where the alert opt-in happened. This replaces a previously unused
 * `email_hash` parameter: that argument had zero call sites and only created
 * a slot where someone could later leak a raw email into analytics.
 * `source` is the property we actually want to pivot on (hero button vs the
 * inline widget).
 */
export type AlertSubscribeSource = "hero_button" | "widget";

export function trackAlertSubscribe(
  festivalSlug: string,
  source: AlertSubscribeSource,
  extra?: Record<string, unknown>,
) {
  track("alert_subscribe", { festival: festivalSlug, source, ...extra });
}

/**
 * Failure counterpart of trackAlertSubscribe. `reason` must be a categorised
 * bucket (see failureReasonFromStatus) — never a raw error message.
 */
export function trackAlertSubscribeFailed(
  festivalSlug: string,
  source: AlertSubscribeSource,
  reason: string,
  extra?: Record<string, unknown>,
) {
  track("alert_subscribe_failed", { festival: festivalSlug, source, reason, ...extra });
}

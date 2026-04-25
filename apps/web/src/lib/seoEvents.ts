// Tipped wrappers around track() for the events we care about for SEO
// iteration (Phase 8 of the growth system: rastrea rankings + tráfico,
// mejora páginas débiles, duplica esfuerzos en ganadores).
//
// Every helper is consent-aware via track(); callers don't need to guard.

import { track } from "./observability";

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

export function trackAlertSubscribe(festivalSlug: string, email_hash?: string) {
  track("alert_subscribe", { festival: festivalSlug, email_hash: email_hash ?? null });
}

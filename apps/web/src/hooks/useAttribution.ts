import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  attributionProperties,
  captureAttribution,
  getAttribution,
} from "../lib/attribution";
import { ANALYTICS_EVENTS, trackEvent } from "../lib/analytics-events";
import { registerSuperProperties } from "../lib/observability";

/**
 * Captures inbound campaign / partner attribution (utm_*, ?ref=, gclid,
 * fbclid, referrer host) on mount and on every route change.
 *
 * Behaviour:
 *  - captureAttribution() is idempotent and first-touch-wins, so navigating
 *    internally to a param-less URL never wipes the partner attribution.
 *  - `referral_landed` fires exactly ONCE per session — captureAttribution()
 *    only returns a record on the first touch, so no extra de-dupe flag is
 *    needed here.
 *  - The record is registered as PostHog super properties (register_once) so
 *    every later conversion event (user_registered, publish_ride_completed,
 *    request_seat_completed…) carries `attr_*` automatically. This is why the
 *    conversion call sites themselves are left untouched.
 *  - Re-registers on later navigations too: a user who lands from a partner
 *    link and only accepts the cookie banner afterwards still gets the
 *    attribution attached once PostHog initialises.
 *
 * Must be rendered inside the Router (it uses useLocation).
 */
export function useAttribution(): void {
  const location = useLocation();

  useEffect(() => {
    // Returns non-null only on the very first attributed touch this session.
    const fresh = captureAttribution();

    // Always (re)register: register_once is a no-op for keys already set, and
    // queued values are replayed when PostHog inits post-consent.
    const record = fresh ?? getAttribution();
    if (record) {
      registerSuperProperties(attributionProperties(record));
    }

    if (!fresh) return;

    trackEvent(ANALYTICS_EVENTS.REFERRAL_LANDED, {
      source: fresh.utm_source,
      medium: fresh.utm_medium,
      campaign: fresh.utm_campaign,
      content: fresh.utm_content,
      term: fresh.utm_term,
      ref: fresh.ref,
      has_gclid: Boolean(fresh.gclid),
      has_fbclid: Boolean(fresh.fbclid),
      referrer_host: fresh.referrer_host,
      landing_path: fresh.landing_path,
      first_seen_at: fresh.first_seen_at,
    });
  }, [location.pathname, location.search]);
}

/**
 * Null-rendering mount point for useAttribution(), mirroring the
 * <ScrollToTop /> convention. Render once inside the Router.
 */
export function AttributionTracker(): null {
  useAttribution();
  return null;
}

// Client observability bootstrapping — Sentry for error tracking, PostHog
// for product analytics. Both are only initialised when the respective env
// var is present so that local dev stays silent.
//
// PostHog is deliberately gated behind an analytics consent flag stored in
// localStorage. Until the user accepts the cookie banner, PostHog is NOT
// loaded and no events are fired (GDPR-compliant).

import * as Sentry from "@sentry/react";
import posthog from "posthog-js";

const ANALYTICS_CONSENT_KEY = "cr_analytics_consent_v1";

export function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem(ANALYTICS_CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

export function grantAnalyticsConsent() {
  try {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, "granted");
  } catch {
    // ignore
  }
  // Lazy-init PostHog on the first consent grant in-session
  initPostHogIfAllowed();
}

export function revokeAnalyticsConsent() {
  try {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, "denied");
  } catch {
    // ignore
  }
  try {
    posthog.opt_out_capturing();
    posthog.reset(true);
  } catch {
    // PostHog not initialised yet — nothing to do
  }
}

// ── Sentry ───────────────────────────────────────────────────────────────
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return; // no-op in dev / preview without a DSN

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    // Keep the bundle light: no tracing/replay in free tier.
    tracesSampleRate: 0,
    // Strip cookies + auth headers before send.
    beforeSend(event) {
      if (event.request?.cookies) delete event.request.cookies;
      if (event.request?.headers) {
        delete event.request.headers.Cookie;
        delete event.request.headers.Authorization;
      }
      // Drop the email/name from breadcrumbs so we don't leak PII to Sentry
      if (event.user?.email) event.user.email = "[redacted]";
      if (event.user?.username) event.user.username = "[redacted]";
      return event;
    },
  });
}

// ── PostHog ──────────────────────────────────────────────────────────────
let posthogInitialised = false;

function initPostHogIfAllowed() {
  if (posthogInitialised) return;
  if (!hasAnalyticsConsent()) return;
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  if (!key) return;

  posthog.init(key, {
    api_host: (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? "https://eu.i.posthog.com",
    // We're GDPR-conservative: no session recording, no autocapture of forms.
    autocapture: false,
    capture_pageview: true,
    disable_session_recording: true,
    persistence: "localStorage",
    // EU residency
    loaded: (ph) => {
      if (import.meta.env.DEV) ph.debug(false);
    },
  });
  posthogInitialised = true;
}

// Auto-init on module load for users who already granted consent on a prior
// visit. No-op for new visitors until they accept the banner.
initPostHogIfAllowed();

// ── Unified event API ────────────────────────────────────────────────────
// Call `track()` freely; it becomes a silent no-op when consent is absent or
// PostHog wasn't initialised. This is intentional so callers never need to
// guard.
export function track(event: string, properties?: Record<string, unknown>) {
  if (!posthogInitialised) return;
  try {
    posthog.capture(event, properties);
  } catch {
    // swallow
  }
}

export function identify(userId: string, properties?: Record<string, unknown>) {
  if (!posthogInitialised) return;
  try {
    posthog.identify(userId, properties);
  } catch {
    // swallow
  }
}

export function resetIdentity() {
  if (!posthogInitialised) return;
  try {
    posthog.reset();
  } catch {
    // swallow
  }
}

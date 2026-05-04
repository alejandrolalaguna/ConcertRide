// Client observability bootstrapping — Sentry for error tracking, PostHog
// for product analytics. Both are only initialised when the respective env
// var is present so that local dev stays silent.
//
// PostHog is deliberately gated behind an analytics consent flag stored in
// localStorage. Until the user accepts the cookie banner, PostHog is NOT
// loaded and no events are fired (GDPR-compliant).

import * as Sentry from "@sentry/react";

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
// Loaded dynamically so it doesn't enter the initial JS bundle for users
// who haven't granted analytics consent yet.
let posthogInitialised = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _posthog: any = null;

async function initPostHogIfAllowed() {
  if (posthogInitialised) return;
  if (!hasAnalyticsConsent()) return;
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  if (!key) return;

  const { default: posthog } = await import("posthog-js");
  posthog.init(key, {
    api_host: (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? "https://us.i.posthog.com",
    autocapture: false,
    capture_pageview: true,
    disable_session_recording: true,
    persistence: "localStorage",
    loaded: (ph) => {
      if (import.meta.env.DEV) ph.debug(false);
    },
  });
  _posthog = posthog;
  posthogInitialised = true;
}

// Auto-init on module load for users who already granted consent on a prior visit.
initPostHogIfAllowed();

export function revokeAnalyticsConsent() {
  try {
    localStorage.setItem("cr_analytics_consent_v1", "denied");
  } catch {
    // ignore
  }
  if (_posthog) {
    try {
      _posthog.opt_out_capturing();
      _posthog.reset(true);
    } catch {
      // ignore
    }
  }
}

// ── Unified event API ────────────────────────────────────────────────────
export function track(event: string, properties?: Record<string, unknown>) {
  if (!posthogInitialised || !_posthog) return;
  try {
    _posthog.capture(event, properties);
  } catch {
    // swallow
  }
}

export function identify(userId: string, properties?: Record<string, unknown>) {
  if (!posthogInitialised || !_posthog) return;
  try {
    _posthog.identify(userId, properties);
  } catch {
    // swallow
  }
}

export function resetIdentity() {
  if (!posthogInitialised || !_posthog) return;
  try {
    _posthog.reset();
  } catch {
    // swallow
  }
}

// Inbound referral attribution — first-touch, session-scoped.
//
// Counterpart to lib/utm.ts (which BUILDS outbound share URLs). This module
// READS the utm_* / click-id params off the landing URL so partner traffic
// (e.g. tardeo.app sending ?utm_source=tardeo&utm_medium=referral&…) is
// attributable all the way to a signup or a published ride.
//
// Semantics
// ---------
// FIRST TOUCH WINS, SESSION SCOPED. The first page view of a browsing session
// that carries attribution signals is stored in sessionStorage and never
// overwritten for the rest of that session. This is why captureAttribution()
// is safe (and intended) to be called on every route change: an internal
// navigation to a param-less URL must NOT wipe the partner attribution.
//
// SSR safety
// ----------
// This codebase prerenders every landing page (entry-server.tsx +
// scripts/prerender.mjs) in a Node context with no window/document/storage.
// Every entry point here early-returns on `typeof window === "undefined"` and
// wraps storage access in try/catch (sessionStorage throws in Safari private
// mode and when cookies/storage are blocked). Nothing in this module may ever
// throw during prerender or hydration.
//
// Privacy
// -------
// Only the referrer HOSTNAME is stored, never the full referring URL (which
// can contain search queries or other PII). The record itself is first-party
// sessionStorage; sending it to PostHog stays gated behind the existing
// analytics-consent mechanism in lib/observability.ts.

export const ATTRIBUTION_STORAGE_KEY = "cr_attribution_v1";

export interface AttributionRecord {
  /** utm_source, or "referral" when only a referrer hostname was available. */
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  /** Generic partner `?ref=` param (shorthand some partners use over utm_source). */
  ref: string | null;
  /** Google Ads click id. */
  gclid: string | null;
  /** Meta click id. */
  fbclid: string | null;
  /** Hostname of document.referrer only — never the full URL. */
  referrer_host: string | null;
  /** Pathname of the first page seen this session (no query string). */
  landing_path: string;
  /** ISO-8601 timestamp of the first touch. */
  first_seen_at: string;
}

/** Keys copied verbatim from the query string into the record. */
const PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ref",
  "gclid",
  "fbclid",
] as const;

/**
 * Guard against absurd values (a malformed or hostile link stuffing a 10 KB
 * utm_campaign would otherwise blow the sessionStorage quota and pollute
 * PostHog property cardinality).
 */
const MAX_VALUE_LENGTH = 200;

function sanitise(raw: string | null): string | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, MAX_VALUE_LENGTH);
}

function readReferrerHost(): string | null {
  try {
    const ref = typeof document !== "undefined" ? document.referrer : "";
    if (!ref) return null;
    const host = new URL(ref).hostname;
    // Self-referrals are internal navigations, not acquisition signals.
    if (host === window.location.hostname) return null;
    return host || null;
  } catch {
    return null;
  }
}

/**
 * Parse attribution signals off an arbitrary search string. Exported for
 * tests; production callers should use captureAttribution().
 *
 * Returns null when the URL carries no attribution signal at all.
 */
export function parseAttribution(
  search: string,
  opts: { landingPath: string; referrerHost: string | null; now?: Date },
): AttributionRecord | null {
  let params: URLSearchParams;
  try {
    // URLSearchParams never throws on malformed input — it just yields fewer
    // pairs (e.g. "?%%%&utm_source=tardeo" still resolves utm_source). The
    // try/catch is belt-and-braces for exotic runtimes.
    params = new URLSearchParams(search);
  } catch {
    params = new URLSearchParams();
  }

  const record: AttributionRecord = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_content: null,
    utm_term: null,
    ref: null,
    gclid: null,
    fbclid: null,
    referrer_host: opts.referrerHost,
    landing_path: opts.landingPath,
    first_seen_at: (opts.now ?? new Date()).toISOString(),
  };

  let hasParamSignal = false;
  for (const key of PARAM_KEYS) {
    const value = sanitise(params.get(key));
    if (value) {
      record[key] = value;
      hasParamSignal = true;
    }
  }

  // Fallback: no utm_* / click id, but we do know where the user came from.
  // Normalise it into the same shape so downstream consumers only ever read
  // utm_source/utm_medium.
  if (!hasParamSignal) {
    if (!opts.referrerHost) return null; // direct traffic — nothing to attribute
    record.utm_source = opts.referrerHost;
    record.utm_medium = "referral";
  } else if (!record.utm_source && record.ref) {
    // `?ref=tardeo` shorthand → promote to utm_source so every consumer can
    // pivot on a single property.
    record.utm_source = record.ref;
    if (!record.utm_medium) record.utm_medium = "referral";
  }

  return record;
}

/**
 * Read the attribution stored for the current session, or null when there is
 * none (direct traffic, storage disabled, or SSR).
 */
export function getAttribution(): AttributionRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    // Minimal shape check — a record from an older schema version or a
    // corrupted value must not crash the app.
    const candidate = parsed as Partial<AttributionRecord>;
    if (typeof candidate.first_seen_at !== "string") return null;
    return candidate as AttributionRecord;
  } catch {
    return null;
  }
}

/**
 * Capture inbound attribution for this session.
 *
 * Idempotent and cheap: safe to call on every route change. Returns the newly
 * captured record ONLY on the first touch of the session; returns null when
 * attribution already existed (first-touch wins), when the URL carries no
 * signal, or when running under SSR / with storage unavailable.
 *
 * The return value is deliberately "did we just capture something new?" so
 * callers can fire a one-shot analytics event without their own de-dupe flag.
 */
export function captureAttribution(): AttributionRecord | null {
  if (typeof window === "undefined") return null;

  try {
    // First touch wins — never overwrite an existing session record.
    if (window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)) return null;
  } catch {
    // sessionStorage unavailable (private mode / blocked). We cannot persist
    // and therefore cannot guarantee first-touch semantics, so we bail rather
    // than risk emitting the landed event on every navigation.
    return null;
  }

  const record = parseAttribution(window.location.search, {
    landingPath: window.location.pathname,
    referrerHost: readReferrerHost(),
  });
  if (!record) return null;

  try {
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Quota or private mode — don't report a new capture we couldn't persist,
    // otherwise the "once per session" guarantee breaks.
    return null;
  }

  return record;
}

/**
 * Flatten the stored record into PostHog-safe primitive properties, prefixed
 * so they never collide with an event's own keys. Returns an empty object when
 * there is no attribution, so it can always be spread into a props bag.
 */
export function attributionProperties(
  record: AttributionRecord | null = getAttribution(),
): Record<string, string> {
  if (!record) return {};
  const out: Record<string, string> = {};
  const put = (key: string, value: string | null) => {
    if (value) out[key] = value;
  };
  put("attr_source", record.utm_source);
  put("attr_medium", record.utm_medium);
  put("attr_campaign", record.utm_campaign);
  put("attr_content", record.utm_content);
  put("attr_term", record.utm_term);
  put("attr_ref", record.ref);
  put("attr_gclid", record.gclid);
  put("attr_fbclid", record.fbclid);
  put("attr_referrer_host", record.referrer_host);
  put("attr_landing_path", record.landing_path);
  put("attr_first_seen_at", record.first_seen_at);
  return out;
}

/** Test-only helper: wipe the stored record. Never called in production code. */
export function clearAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
  } catch {
    // ignore
  }
}

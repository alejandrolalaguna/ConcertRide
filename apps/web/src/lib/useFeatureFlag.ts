// React hook for resolving the active variant of a feature flag.
//
// Behaviour:
//   - Logged-in user: bucketed by `user.id` (stable across devices).
//   - Anonymous user: bucketed by a persistent localStorage anon-id.
//   - SSR / non-browser: returns the flag's `defaultVariant` for the
//     server render (via the "ssr" sentinel userId), then re-evaluates on
//     the client. This avoids hydration mismatches when a flag is disabled
//     (both sides agree) and accepts a one-tick swap when an experiment is
//     live.
//
// Tracking:
//   Every resolved variant is emitted to PostHog (via `track` in
//   `observability.ts`) as `ab_variant_assigned` with `{flag, variant}`.
//   No PII is sent — the userId is never part of the event payload.

import { useEffect, useMemo, useRef } from "react";
import { getVariant, FEATURE_FLAGS } from "./featureFlags";
import type { FeatureFlagName } from "./featureFlags";
import { useSession } from "./session";

const ANON_ID_KEY = "cr_anon_id";

/** Stable per-browser anonymous identifier; created lazily. */
function getAnonId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = window.localStorage.getItem(ANON_ID_KEY);
    if (!id) {
      id = `anon_${Math.random().toString(36).slice(2)}_${Date.now()}`;
      window.localStorage.setItem(ANON_ID_KEY, id);
    }
    return id;
  } catch {
    // Private mode / Safari ITP / SSR fallback.
    return "anon_unavailable";
  }
}

/**
 * Calls `useSession()` defensively. The real hook throws when used outside
 * a `<SessionProvider>` (tests, isolated stories, certain prerender paths).
 * We mirror its behaviour but return `null` instead of throwing.
 */
function useOptionalUserId(): string | null {
  try {
    const session = useSession();
    return session.user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Resolve and (once per mount) report the variant for `flagName`.
 *
 * @example
 *   const variant = useFeatureFlag("HOMEPAGE_HERO_VARIANT");
 *   if (variant === "price_focused") return <PriceHero />;
 *   if (variant === "social_proof_focused") return <SocialHero />;
 *   return <DefaultHero />;
 */
export function useFeatureFlag(flagName: FeatureFlagName): string {
  const sessionUserId = useOptionalUserId();
  const userId = sessionUserId ?? getAnonId();

  const variant = useMemo(() => getVariant(flagName, userId), [flagName, userId]);

  // Fire the analytics event once per (flag, variant) pair per mount.
  const trackedRef = useRef<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `${flagName}:${variant}`;
    if (trackedRef.current === key) return;
    trackedRef.current = key;
    void trackVariantAssignment(flagName, variant);
  }, [flagName, variant]);

  return variant;
}

async function trackVariantAssignment(flag: string, variant: string): Promise<void> {
  if (!FEATURE_FLAGS[flag as FeatureFlagName]) return;
  try {
    const mod = await import("./observability");
    mod.track?.("ab_variant_assigned", { flag, variant });
  } catch {
    // Observability is best-effort; never break the UI for it.
  }
}

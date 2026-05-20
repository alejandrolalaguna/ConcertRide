// Lightweight, hardcoded feature-flag + A/B testing registry.
//
// Goals:
//   - Zero external dependency (no LaunchDarkly / GrowthBook for now).
//   - Deterministic bucketing: same userId + same flag → always same variant.
//   - SSR-safe: pure function, no `window` access here.
//
// To add a new flag, edit FEATURE_FLAGS below and bump `enabled: true` when
// ready to ramp. See `apps/web/docs/ab-testing-2026-05-20.md` for the full
// playbook (weights, edge cases, migration to a hosted service).

export interface FeatureFlag {
  /** Stable identifier used as both registry key and analytics property. */
  name: string;
  /** All variant names. First entry is conventionally "control". */
  variants: string[];
  /** Returned when the flag is disabled or no bucket matches. */
  defaultVariant: string;
  /** Master kill-switch. When false, every caller receives `defaultVariant`. */
  enabled: boolean;
  /**
   * Optional traffic weights (any positive numbers; normalised internally).
   * Must be same length as `variants` when provided. Defaults to uniform.
   * Example: weights:[9,1] sends 90% to variants[0], 10% to variants[1].
   */
  weights?: number[];
}

export const FEATURE_FLAGS: Record<string, FeatureFlag> = {
  HOMEPAGE_HERO_VARIANT: {
    name: "HOMEPAGE_HERO_VARIANT",
    variants: ["control", "social_proof_focused", "price_focused"],
    defaultVariant: "control",
    enabled: false,
  },
  PRICE_DISPLAY_STYLE: {
    name: "PRICE_DISPLAY_STYLE",
    variants: ["per_seat", "total_savings"],
    defaultVariant: "per_seat",
    enabled: false,
  },
  REGISTER_FORM_FIELDS: {
    name: "REGISTER_FORM_FIELDS",
    variants: ["3_field_minimal", "full_form"],
    defaultVariant: "full_form",
    enabled: false,
  },
};

/**
 * Union of registered flag names. Update this alongside `FEATURE_FLAGS`
 * when you add a new flag — TypeScript will then enforce its usage at
 * every `useFeatureFlag(...)` call site.
 */
export type FeatureFlagName =
  | "HOMEPAGE_HERO_VARIANT"
  | "PRICE_DISPLAY_STYLE"
  | "REGISTER_FORM_FIELDS";

/**
 * Deterministic 32-bit DJB2-style string hash. Stable across runs and
 * platforms; produces a non-negative integer suitable for bucketing.
 */
function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // force int32
  }
  return Math.abs(hash);
}

/**
 * Resolve which variant a given `userId` should see for `flagName`.
 *
 * Deterministic + pure: safe for SSR. Identical inputs always return the
 * same output, which means a logged-in user sees a stable experience and
 * an anonymous user keeps the same variant as long as their anon-id
 * persists in localStorage.
 *
 * When the flag is disabled OR unknown, returns the flag's `defaultVariant`
 * (or `"control"` as a final fallback).
 */
export function getVariant(flagName: FeatureFlagName, userId: string): string {
  const flag = FEATURE_FLAGS[flagName];
  if (!flag || !flag.enabled) return flag?.defaultVariant ?? "control";

  const buckets = flag.variants;
  if (buckets.length === 0) return flag.defaultVariant;

  const weights = flag.weights ?? buckets.map(() => 1);
  // Guard: misconfigured weights array — fall back to default.
  if (weights.length !== buckets.length) return flag.defaultVariant;

  let totalWeight = 0;
  for (const w of weights) totalWeight += w;
  if (totalWeight <= 0) return flag.defaultVariant;

  const hash = hashString(`${flagName}:${userId}`);
  const normalized = (hash % 10000) / 10000; // [0, 1)

  let cumulative = 0;
  for (let i = 0; i < buckets.length; i++) {
    const weight = weights[i] ?? 0;
    cumulative += weight / totalWeight;
    if (normalized < cumulative) {
      return buckets[i] ?? flag.defaultVariant;
    }
  }
  return flag.defaultVariant;
}

/**
 * Convenience: list all known flag names. Handy for admin/debug panels.
 */
export function listFlagNames(): FeatureFlagName[] {
  return Object.keys(FEATURE_FLAGS) as FeatureFlagName[];
}

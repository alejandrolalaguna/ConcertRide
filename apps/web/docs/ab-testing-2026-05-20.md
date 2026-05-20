# Feature flags + A/B testing framework

Date: 2026-05-20

## TL;DR

```tsx
import { useFeatureFlag } from "@/lib/useFeatureFlag";

function HomepageHero() {
  const variant = useFeatureFlag("HOMEPAGE_HERO_VARIANT");
  if (variant === "social_proof_focused") return <SocialProofHero />;
  if (variant === "price_focused") return <PriceHero />;
  return <DefaultHero />;
}
```

No backend, no extra dependency. The registry lives at
`apps/web/src/lib/featureFlags.ts` and the hook at
`apps/web/src/lib/useFeatureFlag.ts`.

---

## Files

| Path | Purpose |
| --- | --- |
| `apps/web/src/lib/featureFlags.ts` | Flag registry, types, deterministic `getVariant()` bucketing helper. |
| `apps/web/src/lib/useFeatureFlag.ts` | React hook. Reads `useSession` defensively, falls back to a persistent anonymous id. Tracks variant assignment via PostHog. |

---

## Initial flags (all disabled)

| Flag | Variants | Default |
| --- | --- | --- |
| `HOMEPAGE_HERO_VARIANT` | `control`, `social_proof_focused`, `price_focused` | `control` |
| `PRICE_DISPLAY_STYLE` | `per_seat`, `total_savings` | `per_seat` |
| `REGISTER_FORM_FIELDS` | `3_field_minimal`, `full_form` | `full_form` |

All ship with `enabled: false`, which means the hook returns the
`defaultVariant` for every user. Nothing changes in production until the
founder flips `enabled: true` and (optionally) sets weights.

---

## Adding a new flag

1. Edit `apps/web/src/lib/featureFlags.ts` and add an entry to the
   `FEATURE_FLAGS` object:

   ```ts
   CONCERT_CARD_LAYOUT: {
     name: "CONCERT_CARD_LAYOUT",
     variants: ["control", "compact_with_price"],
     defaultVariant: "control",
     enabled: false,
   },
   ```

2. The key (`CONCERT_CARD_LAYOUT`) is automatically added to the
   `FeatureFlagName` union — the hook is type-safe with no extra work.

3. Use it in a component:

   ```tsx
   const variant = useFeatureFlag("CONCERT_CARD_LAYOUT");
   ```

---

## Activating an experiment

```ts
HOMEPAGE_HERO_VARIANT: {
  name: "HOMEPAGE_HERO_VARIANT",
  variants: ["control", "social_proof_focused", "price_focused"],
  defaultVariant: "control",
  enabled: true,                // ← flip this
  weights: [1, 1, 1],            // ← optional, see below
},
```

Once `enabled: true` ships, every visitor is deterministically bucketed by
hash(`flagName:userId`). The same userId always sees the same variant
until you change the flag definition (variant list / weights).

---

## Weights — canary, ramp, holdout

`weights` is an array of positive numbers, one per variant, in the same
order as `variants`. They are normalised internally.

```ts
// 90 / 10 canary (most traffic stays on control)
weights: [9, 1]

// 50 / 50 split (default if omitted)
weights: [1, 1]

// 1 % holdout (3-arm test with a tiny control)
weights: [98, 1, 1]
```

If `weights.length !== variants.length` or every weight is zero, the
bucketing helper returns `defaultVariant` (safe fallback).

---

## Measuring results

Each time the hook resolves a variant for a mounted component, it fires
the PostHog event `ab_variant_assigned` with `{flag, variant}`. No PII
(no userId, no email) is sent — the `userId` only matters to the local
hashing function.

To analyse a test:

1. **Assignment counts** — `ab_variant_assigned` filtered by `flag`
   tells you the actual split. Use this to verify the hash is producing
   the bucket sizes you expect.
2. **Funnels** — build a PostHog funnel keyed on `properties.variant`
   from the assignment event, joined with downstream events (e.g.
   `ride_published`, `concert_view`, `register_completed`). Most A/B
   analyses become "which variant has the highest conversion at step
   N?".
3. **Statistical significance** — PostHog's experiments UI handles this
   for free; or export raw events and run a chi-squared test offline.

---

## SSR & hydration

The hook is SSR-safe:

- On the server `typeof window === "undefined"`, so `getAnonId()`
  returns the sentinel string `"ssr"` and `useOptionalUserId()` returns
  `null` (no SessionProvider during prerender → catch path).
- `getVariant` is pure and deterministic, so the server emits a stable
  variant for the `"ssr"` userId.
- On the client the hook re-resolves with the real user/anon id. When
  the flag is disabled (the common case), both renders return
  `defaultVariant` — no hydration mismatch.
- When the flag is enabled the variant may flip on the first client
  render. Components that render variant-specific markup should mount
  the experiment branch only after hydration or use a CSS-only
  fallback (e.g. `display:none` on the inactive branch) to avoid layout
  jank.

---

## When to migrate to a hosted service

Stay with this hardcoded registry while:

- The team flips fewer than ~5 experiments per quarter.
- All experiments fit in code review (no PMs flipping flags from a UI).
- Traffic is < ~10K MAU and Test stat-sig can be eyeballed in a
  spreadsheet.

Migrate to **GrowthBook** (open-source, self-hostable) or **PostHog
Feature Flags** (already in our stack) when any of:

- More than 10K MAU, where flag-flip latency matters more than redeploy
  speed.
- PMs / marketing want to flip flags without a code change.
- You need targeting rules beyond hash bucketing (geo, plan, cohort).
- You need a remote kill-switch for incident response.

The migration is mechanical: swap `getVariant()`'s implementation to
read from the hosted service, keep the `FeatureFlag` interface, keep
the hook signature. Components stay untouched.

---

## Edge cases & gotchas

- **No PII in event payload.** Never add the userId or email to the
  `ab_variant_assigned` properties — the helper enforces this.
- **Don't change `variants` array order without re-thinking buckets.**
  The hash maps `[0, totalWeight)` onto the variants in order. Reordering
  shuffles every user into a different variant. If you need to keep
  buckets stable while renaming, add a new flag instead.
- **Default variant always wins for misconfiguration.** Empty
  `variants`, mismatched `weights` length, or `enabled: false` all
  resolve to `defaultVariant`. There is no scenario where the hook
  returns `undefined`.
- **`useSession` outside a provider.** The hook catches the throw and
  falls back to anon-id, so it can be used in storybook / test renders
  without setting up a full SessionProvider.
- **One assignment event per mount per (flag, variant).** If a
  component remounts the event fires again. If a user switches variant
  mid-session (very rare — only when you re-roll the experiment
  config), the new variant is tracked once.

---

## Component migration

This change ships **framework only** — no production component
currently calls `useFeatureFlag`. The founder will wire flags into
specific UIs (HomepageHero, RegisterForm, RideCard pricing) at the
moment they want to test those changes.

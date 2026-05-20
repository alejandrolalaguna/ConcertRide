# Microsoft Clarity — heatmaps and session recording

Date: 2026-05-20

## What this adds

A conditionally-mounted React component, `ClarityScript`, that bootstraps
Microsoft Clarity in the browser. Clarity is a **free** analytics product
from Microsoft that complements our existing PostHog setup:

| Need | Tool |
|---|---|
| Funnels, retention cohorts, custom events, identify(userId) | **PostHog** |
| Heatmaps (clicks, scroll depth), rage-click detection, dead clicks, session replay video | **Clarity** |

PostHog tells us *what* users do; Clarity shows us *how* they struggle while
doing it. The two are designed to coexist — Clarity is render-only (no
event ingestion) and Microsoft does not charge per session or per project.

---

## Files touched

| File | Change |
|---|---|
| `apps/web/src/components/ClarityScript.tsx` | New component — graceful no-op without env var or consent. |
| `apps/web/src/main.tsx` | Mounts `<ClarityScript />` once inside the provider tree. |
| `apps/web/src/lib/observability.ts` | `grantAnalyticsConsent()` now dispatches a `cr:analytics-consent` window event so Clarity can load mid-session without a reload. |
| `.env.example` | Documents the new `VITE_CLARITY_PROJECT_ID` variable (commented). |

The component is mounted exactly once at app bootstrap. After hydration it
checks two conditions; if either fails, nothing happens and no network
request to `clarity.ms` is made.

---

## How to enable Clarity in production

1. Sign in at **https://clarity.microsoft.com** with a Microsoft account.
2. Create a new project (free, unlimited sessions). Region: pick **EU** to
   keep replay storage inside the EEA, matching our PostHog EU setup.
3. Open **Settings → Setup**. Copy the alphanumeric Project ID (it looks
   like `abc123xyz`, not a URL).
4. Set the variable in the appropriate environment:
   ```bash
   # Local dev
   echo "VITE_CLARITY_PROJECT_ID=abc123xyz" >> apps/web/.env.local

   # Cloudflare Pages / Workers (build-time)
   wrangler secret put VITE_CLARITY_PROJECT_ID   # then paste the ID
   ```
   Because Vite inlines `VITE_*` vars at build time, you must rebuild and
   redeploy after setting it (`npm run build && npm run deploy`).
5. Verify in the browser: with consent granted, DevTools → Network → filter
   by `clarity.ms` should show one request to
   `https://www.clarity.ms/tag/<your-id>`.

If `VITE_CLARITY_PROJECT_ID` is **not** set at build time, the component
returns `null` and no script tag is injected. There is no console log, no
fetch attempt, and no impact on Core Web Vitals.

---

## Privacy and GDPR

Clarity is gated behind the **same consent flag as PostHog**:
`localStorage.getItem("cr_analytics_consent_v1") === "granted"`.

Concretely:

- On first visit, the **CookieBanner** (`apps/web/src/components/CookieBanner.tsx`)
  is shown. Until the user clicks *"Aceptar todo"*, neither PostHog nor
  Clarity is loaded — `ClarityScript` returns `null`.
- When the user clicks *"Aceptar todo"*, `grantAnalyticsConsent()` writes
  `granted` to localStorage **and** dispatches the `cr:analytics-consent`
  window event. `ClarityScript` listens for this event and injects the
  Clarity tag immediately, no page reload required.
- When the user clicks *"Rechazar opcionales"*, no Clarity tag is ever
  injected. There is no "denied" event because the script was never
  loaded in the first place.
- Clarity respects the browser's **Do Not Track** signal natively and
  automatically masks form inputs marked as sensitive (`type="password"`,
  `autocomplete="cc-number"`, etc.). We do not override the mask defaults.
- Clarity is GDPR-compliant per Microsoft's Privacy Statement
  (https://privacy.microsoft.com/privacystatement) and operates as a data
  processor under our Privacy Policy (`/privacidad`).

The Cookies policy page (`/cookies`) will be updated separately to list
Clarity as an *optional* analytics tool in the same section as PostHog
once a Project ID is configured for production.

---

## Why mount in `main.tsx` instead of `index.html`

A `<script>` tag in `index.html` is static — it would either always load
(violating our consent gate) or never load. Mounting the bootstrap inside
a React component lets us:

1. Gate it on `import.meta.env.VITE_CLARITY_PROJECT_ID` (per-environment).
2. Gate it on the runtime consent flag (per-user).
3. React to consent changes via a window event listener.
4. Skip SSR/prerender entirely — Clarity only runs in the browser, never
   on the Cloudflare Worker that serves prerendered HTML to bots.

---

## Acceptance checklist

- [ ] Without `VITE_CLARITY_PROJECT_ID`, no request to `clarity.ms`
      appears in the Network tab (verified by inspecting the bundle).
- [ ] With the env var set but **before** accepting cookies, no request
      to `clarity.ms`.
- [ ] After clicking *"Aceptar todo"*, exactly one request to
      `https://www.clarity.ms/tag/<id>` appears.
- [ ] `window.clarity` is defined after consent and is a function (the
      Clarity API).
- [ ] No TypeScript errors: `npm run type-check -w apps/web`.
- [ ] No effect on the Cloudflare Worker bundle (this is a frontend-only
      change).

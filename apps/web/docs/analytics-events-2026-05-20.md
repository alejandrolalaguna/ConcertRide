# Product Analytics — Event Catalogue (PostHog)

Last reviewed: 2026-05-20. Owner: web/growth.

ConcertRide ships a consent-gated PostHog client (see
`apps/web/src/lib/observability.ts`). Until a visitor grants analytics
consent, PostHog is never loaded and all `track()` / `trackEvent()` calls
become silent no-ops.

The single source of truth for event names is
`apps/web/src/lib/analytics-events.ts` (`ANALYTICS_EVENTS` const + the
`trackEvent()` wrapper). **Do not** scatter raw string literals across
components — typos fragment the funnel and break PostHog insights.

## Catalogue

All event names are snake_case. Required keys are listed for each event;
extra properties are allowed but must remain primitive (string / number /
boolean / null) and **must never contain PII**.

### Search & Discovery
| Event | When | Properties |
| --- | --- | --- |
| `concert_search_filter_applied` | User changes any filter on `/concerts` | `filter_type`, `filter_value` |
| `ride_search_filter_applied` | Reserved for the dedicated ride search page (no UI today) | `filter_type`, `filter_value` |
| `festival_landing_viewed` | Festival landing mounts. Emitted today via the legacy `festival_view` event in `seoEvents.ts`. | `slug`, `name`, `future_rides` |
| `route_landing_viewed` | Route landing mounts. Emitted today via the legacy `route_search` event in `seoEvents.ts`. | `origin`, `destination`, `date_from` |

### Booking & Publishing
| Event | When | Properties |
| --- | --- | --- |
| `publish_ride_started` | `/publish` mounts | `source` (current pathname) |
| `publish_ride_completed` | Ride creation API resolves successfully | `ride_id`, `concert_id`, `seats` |
| `request_seat_started` | User submits the "pedir asiento" form | `ride_id` |
| `request_seat_completed` | Seat request / instant booking API resolves | `ride_id`, `seats`, `instant` |

### Auth
| Event | When | Properties |
| --- | --- | --- |
| `user_registered` | `/register` API succeeds | `method` (`"email"`), `has_ref` |
| `user_login` | `/login` API succeeds | `method` (`"email"`) |
| `user_logout` | `useSession().logout()` invoked | none |

### Social / Crew
| Event | When | Properties |
| --- | --- | --- |
| `crew_created` | `SquadCreatePage` create succeeds | `squad_id`, `concert_id`, `visibility` |
| `crew_joined` | `SquadJoinPage` join succeeds | `squad_id`, `concert_id`, `via` |

### Content engagement
| Event | When | Properties |
| --- | --- | --- |
| `blog_post_read_50pct` | Mid-article IntersectionObserver sentinel intersects | `slug` |
| `blog_post_read_100pct` | End-of-article sentinel intersects | `slug`, `time_on_page_seconds` |
| `pillar_cta_clicked` | Final CTA on any `Guia*Page` is clicked | `pillar_slug`, `cta_target` |
| `dataset_download` | CSV or JSON download anchor on any `Dataset*Page` is clicked | `dataset_slug`, `format` |

### Conversion
| Event | When | Properties |
| --- | --- | --- |
| `hero_cta_clicked` | Landing hero CTAs clicked | `variant` |
| `sticky_reg_bar_clicked` | StickyRegBar "Crear cuenta" clicked | `page_type` |
| `footer_cta_clicked` | Reserved for the footer "publish" / "register" CTAs once wired | `target` |

## How to add a new event

1. Add the name as a new key in `ANALYTICS_EVENTS` in
   `apps/web/src/lib/analytics-events.ts`.
2. Decide the required properties and document them in this file under
   the right section.
3. Import `ANALYTICS_EVENTS` + `trackEvent` from
   `@/lib/analytics-events` in the component and emit at the success
   handler (NOT on render — onMount is reserved for funnel-entry events).
4. Run `npm run type-check -w apps/web` to make sure the literal type
   inference still resolves.

## How to consult events in PostHog

- Open eu.i.posthog.com → Insights → New insight → Trends.
- Filter by event name (e.g. `publish_ride_completed`).
- Common funnels:
  - "Publish funnel": `publish_ride_started` → `publish_ride_completed`
  - "Booking funnel": `request_seat_started` → `request_seat_completed`
  - "Acquisition funnel": `hero_cta_clicked` → `user_registered` → first `request_seat_started`
- For content engagement, use `blog_post_read_50pct` and
  `blog_post_read_100pct` as proxies for engagement quality on a per-slug
  basis.

## Privacy considerations

- **Never** pass email, phone, name, IP, or street address as a property.
- Use IDs (ride_id, concert_id, squad_id) and slugs only — those are
  already published in URLs and don't carry additional re-identification
  risk.
- PostHog session recording is disabled
  (`disable_session_recording: true` in `observability.ts`) and we never
  capture autocaptured events, so the surface area is limited to the
  events catalogued above.
- All analytics traffic is gated behind explicit consent
  (`cr_analytics_consent_v1` localStorage flag). Without consent, no
  network requests are made and PostHog is never loaded.

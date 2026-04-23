export interface Env {
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string;
  TICKETMASTER_API_KEY: string;
  RESEND_API_KEY: string;
  JWT_SECRET: string;
  INGEST_SECRET: string;
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
  // Optional. When set, Sentry.withSentry wraps the Worker handler and
  // reports uncaught exceptions + onError events.
  SENTRY_DSN: string;
  // Optional. Admin address that receives new-report notifications. When
  // unset, reports are only persisted.
  SUPPORT_EMAIL: string;
  // Comma-separated list of user IDs allowed to access /admin/*. Checked
  // server-side on every admin route. Empty = no admins (admin routes 403).
  ADMIN_USER_IDS: string;
  ENVIRONMENT: "development" | "production";
  ASSETS: Fetcher;
  CACHE: KVNamespace;
}

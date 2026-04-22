export interface Env {
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string;
  TICKETMASTER_API_KEY: string;
  RESEND_API_KEY: string;
  JWT_SECRET: string;
  INGEST_SECRET: string;
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
  ENVIRONMENT: "development" | "production";
  ASSETS: Fetcher;
  CACHE: KVNamespace;
}

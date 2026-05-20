/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute, setCatchHandler } from "workbox-routing";
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { CacheableResponsePlugin } from "workbox-cacheable-response";

declare let self: ServiceWorkerGlobalScope;

// -----------------------------------------------------------------------------
// Version & cache namespaces
// -----------------------------------------------------------------------------
// Bump SW_VERSION whenever cache shape/strategy changes to invalidate old caches
// during the activate event. Workbox precache hash already busts on file change.
const SW_VERSION = "v2-2026-05-20";

const CACHE_NAMES = {
  landings: "cr-landings-v1",
  datasets: "cr-datasets-v1",
  blog: "cr-blog-v1",
  apiConcerts: "cr-api-concerts-v1",
  staticAssets: "cr-static-v1",
  ogImages: "cr-og-v1",
  fonts: "cr-fonts-v1",
  offline: "cr-offline-v1",
} as const;

// All caches that should persist across versions. Caches not in this set get
// purged in `activate` (in addition to workbox's `cleanupOutdatedCaches`).
const KNOWN_CACHES = new Set<string>(Object.values(CACHE_NAMES));

// -----------------------------------------------------------------------------
// Precache (workbox manifest) + offline fallback
// -----------------------------------------------------------------------------
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      // Force-fetch offline.html into its own cache so it's available even if
      // the precache manifest hasn't been processed yet on first install.
      const cache = await caches.open(CACHE_NAMES.offline);
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
    })(),
  );
  // Activate this SW immediately on update so users get the new cache rules
  // without having to close all tabs first.
  self.skipWaiting();
});

self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    (async () => {
      // Purge any cache not in KNOWN_CACHES (renamed/removed namespaces).
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys.map((key) => {
          if (key.startsWith("cr-") && !KNOWN_CACHES.has(key)) {
            return caches.delete(key);
          }
          return Promise.resolve(false);
        }),
      );

      // Enable navigation preload if available — speeds up network races for
      // NetworkFirst navigations.
      if ("navigationPreload" in self.registration) {
        try {
          await self.registration.navigationPreload.enable();
        } catch {
          // navigation preload is best-effort
        }
      }

      // Take control of all uncontrolled clients immediately.
      await self.clients.claim();
    })(),
  );
  // Mark SW_VERSION as referenced so unused-var lints don't complain.
  void SW_VERSION;
});

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function isSameOrigin(url: URL): boolean {
  return url.origin === self.location.origin;
}

function isHttp(url: URL): boolean {
  return url.protocol === "http:" || url.protocol === "https:";
}

// -----------------------------------------------------------------------------
// Landing pages: CacheFirst, 7 days, 200 entries
//   /festivales/*, /rutas/*, /conciertos/*, /festivales-en/*
//   Excludes: /festivales (index) only when no slug present — keep cached too
//   since listing pages rarely change.
// -----------------------------------------------------------------------------
registerRoute(
  ({ url, request }) => {
    if (!isSameOrigin(url) || request.method !== "GET") return false;
    if (request.mode !== "navigate" && request.destination !== "document") {
      // Also allow direct GETs for prerendered HTML when fetched as a sub-doc.
      if (request.destination !== "") return false;
    }
    return (
      url.pathname.startsWith("/festivales/") ||
      url.pathname.startsWith("/festivales-en/") ||
      url.pathname.startsWith("/rutas/") ||
      url.pathname.startsWith("/conciertos/")
    );
  },
  new CacheFirst({
    cacheName: CACHE_NAMES.landings,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

// -----------------------------------------------------------------------------
// Dataset pages: CacheFirst, 30 days, 30 entries
//   /datos/* (HTML pages and JSON/CSV files in /datos/)
// -----------------------------------------------------------------------------
registerRoute(
  ({ url, request }) =>
    isSameOrigin(url) &&
    request.method === "GET" &&
    url.pathname.startsWith("/datos"),
  new CacheFirst({
    cacheName: CACHE_NAMES.datasets,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

// -----------------------------------------------------------------------------
// Blog posts: NetworkFirst, 3s timeout, fallback to cache, 1 hour TTL
// -----------------------------------------------------------------------------
registerRoute(
  ({ url, request }) =>
    isSameOrigin(url) &&
    request.method === "GET" &&
    url.pathname.startsWith("/blog"),
  new NetworkFirst({
    cacheName: CACHE_NAMES.blog,
    networkTimeoutSeconds: 3,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 150,
        maxAgeSeconds: 60 * 60, // 1 hour
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

// -----------------------------------------------------------------------------
// API: read-only concerts/festivales = 5min SWR, all other API = network only.
// /api/auth/* is NEVER cached (auth flow). Write methods (POST/PUT/DELETE/PATCH)
// always hit the network because the matcher only matches GET requests.
// -----------------------------------------------------------------------------
registerRoute(
  ({ url, request }) => {
    if (!isSameOrigin(url)) return false;
    if (request.method !== "GET") return false;
    if (!url.pathname.startsWith("/api/")) return false;
    // Never cache auth, push, messages, ride mutations, user-state endpoints
    if (url.pathname.startsWith("/api/auth")) return false;
    if (url.pathname.startsWith("/api/push")) return false;
    if (url.pathname.startsWith("/api/messages")) return false;
    if (url.pathname.startsWith("/api/users/me")) return false;
    if (url.pathname.startsWith("/api/admin")) return false;
    if (url.pathname.startsWith("/api/reports")) return false;
    // Cache the listing/detail read endpoints
    return (
      url.pathname.startsWith("/api/concerts") ||
      url.pathname.startsWith("/api/festivales") ||
      url.pathname.startsWith("/api/festivals") ||
      url.pathname.startsWith("/api/venues") ||
      url.pathname.startsWith("/api/rides")
    );
  },
  new StaleWhileRevalidate({
    cacheName: CACHE_NAMES.apiConcerts,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 5, // 5 min
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

// -----------------------------------------------------------------------------
// Static assets (built JS/CSS, app images): CacheFirst, 90 days
//   Built bundles live under /assets/ (Vite hash-named, safe to cache forever).
//   Local images under /images/ and root-level branded PNGs/SVGs.
// -----------------------------------------------------------------------------
registerRoute(
  ({ url, request }) => {
    if (!isSameOrigin(url) || request.method !== "GET") return false;
    if (url.pathname.startsWith("/assets/")) return true;
    if (url.pathname.startsWith("/images/")) return true;
    // Branded icons referenced from the manifest
    return (
      url.pathname === "/favicon.svg" ||
      url.pathname === "/favicon-16x16.png" ||
      url.pathname === "/favicon-32x32.png" ||
      url.pathname === "/favicon-48x48.png" ||
      url.pathname === "/apple-touch-icon.png" ||
      url.pathname === "/android-chrome-192x192.png" ||
      url.pathname === "/android-chrome-512x512.png"
    );
  },
  new CacheFirst({
    cacheName: CACHE_NAMES.staticAssets,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 300,
        maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

// -----------------------------------------------------------------------------
// OG images: CacheFirst, 30 days
// -----------------------------------------------------------------------------
registerRoute(
  ({ url, request }) =>
    isSameOrigin(url) &&
    request.method === "GET" &&
    url.pathname.startsWith("/og/"),
  new CacheFirst({
    cacheName: CACHE_NAMES.ogImages,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

// -----------------------------------------------------------------------------
// Google Fonts (cross-origin): css + woff2, CacheFirst 1 year (woff2),
// SWR for the css index so updated font URLs eventually propagate.
// -----------------------------------------------------------------------------
registerRoute(
  ({ url, request }) =>
    isHttp(url) &&
    request.method === "GET" &&
    url.origin === "https://fonts.googleapis.com",
  new StaleWhileRevalidate({
    cacheName: CACHE_NAMES.fonts,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

registerRoute(
  ({ url, request }) =>
    isHttp(url) &&
    request.method === "GET" &&
    url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: CACHE_NAMES.fonts,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

// -----------------------------------------------------------------------------
// Offline fallback: any failed *navigation* request returns /offline.html.
// Sub-resource failures (images, scripts) just propagate the error.
// -----------------------------------------------------------------------------
setCatchHandler(async ({ event, request }) => {
  // Workbox passes the original `Request` on `event.request` for navigations.
  const req = request ?? (event as FetchEvent | undefined)?.request;
  const isNavigation =
    req?.mode === "navigate" || (req?.destination === "document" && req?.method === "GET");

  if (isNavigation) {
    const cache = await caches.open(CACHE_NAMES.offline);
    const cached = await cache.match(OFFLINE_URL);
    if (cached) return cached;
  }
  return Response.error();
});

// -----------------------------------------------------------------------------
// Push notifications (unchanged behavior)
// -----------------------------------------------------------------------------
self.addEventListener("push", (event: PushEvent) => {
  let data: { title?: string; body?: string; url?: string } = {};
  try {
    data = event.data?.json() ?? {};
  } catch {
    data = { title: "ConcertRide", body: event.data?.text() ?? "" };
  }

  const title = data.title ?? "ConcertRide";
  const options: NotificationOptions = {
    body: data.body ?? "",
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag: "concertride",
    data: { url: data.url ?? "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();
  const url: string = (event.notification.data as { url?: string })?.url ?? "/";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        return self.clients.openWindow(url);
      }),
  );
});

// -----------------------------------------------------------------------------
// Message channel: lets the page force a SW update / skip waiting on demand.
// -----------------------------------------------------------------------------
self.addEventListener("message", (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

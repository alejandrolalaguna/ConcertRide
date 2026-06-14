import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

// SSR build is enabled by setting VITE_SSR_BUILD=1 in the env. The prerender
// script builds twice: once for the browser (default), once for Node SSR
// (entry-server.tsx). Keeping a single config keeps tailwind + alias aligned
// across both.
const isSsrBuild = process.env.VITE_SSR_BUILD === "1";

// Bundle analyzer — opt-in via `ANALYZE=true vite build` (script: `build:report`).
// Generates dist/stats.html which can be opened locally or attached to CI
// artefacts. Loaded asynchronously and fail-soft so a fresh checkout without
// the optional `rollup-plugin-visualizer` dep installed still builds normally.
const analyze = process.env.ANALYZE === "true";
let visualizerPlugin: any = null;
if (analyze && !isSsrBuild) {
  try {
    const mod = await import("rollup-plugin-visualizer");
    visualizerPlugin = mod.visualizer({
      filename: "dist/stats.html",
      template: "treemap",
      gzipSize: true,
      brotliSize: true,
      open: false,
    });
  } catch {
    console.warn("[vite] ANALYZE=true but rollup-plugin-visualizer not installed; run `npm i -D rollup-plugin-visualizer` first");
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    !isSsrBuild && VitePWA({
      registerType: "autoUpdate",
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      manifest: {
        name: "ConcertRide ES",
        short_name: "ConcertRide",
        description: "Carpooling para conciertos y festivales en España",
        theme_color: "#DBFF00",
        background_color: "#080808",
        display: "standalone",
        start_url: "/",
        scope: "/",
        lang: "es",
        orientation: "portrait",
        categories: ["travel", "music", "social"],
        icons: [
          { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
          { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
          { src: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
          { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
          { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      injectManifest: {
        swSrc: "src/sw.ts",
        swDest: "dist/sw.js",
        // Precache the app shell + critical static assets. offline.html is
        // explicitly included so the SW can serve it from precache when a
        // navigation request fails. Programmatic landing pages
        // (festivales/rutas/conciertos/blog) are intentionally OUT of the
        // precache — they're handled at runtime via the workbox routes in
        // sw.ts so the precache manifest stays small for first-load cost.
        globPatterns: [
          "index.html",
          "offline.html",
          "404.html",
          "manifest.webmanifest",
          "favicon.svg",
          "favicon-16x16.png",
          "favicon-32x32.png",
          "favicon-48x48.png",
          "apple-touch-icon.png",
          "android-chrome-192x192.png",
          "android-chrome-512x512.png",
          "og/home.png",
          "og-fallback.png",
          "assets/**/*.{js,css,woff,woff2}",
        ],
        // Large programmatic pages (rutas/index.html, etc.) exceed the default 2 MiB limit.
        // Raised to 8 MiB so the service worker precache manifest includes them.
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      },
    }),
    visualizerPlugin,
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@concertride/types": path.resolve(__dirname, "../../packages/types/src/index.ts"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  },
  build: isSsrBuild
    ? {
        outDir: "dist-ssr",
        ssr: "src/entry-server.tsx",
        sourcemap: false,
        rollupOptions: {
          output: { format: "esm" },
        },
      }
    : {
        outDir: "dist",
        sourcemap: false,
        rollupOptions: {
          output: {
            manualChunks(id) {
              // maplibre-gl: only needed on map pages, kept in lazy chunk
              if (id.includes("maplibre-gl")) return "vendor-map";
              // embla-carousel: only used by carousel sections — keep it out of
              // the main chunk so non-carousel routes don't pay for it (~60 KB).
              if (id.includes("embla-carousel")) return "vendor-carousel";
              // Motion: animation library, not needed for SSR/prerendered pages
              if (id.includes("motion")) return "vendor-motion";
              // Sentry: error monitoring, split so it doesn't block page render
              if (id.includes("@sentry")) return "vendor-sentry";
              // PostHog: analytics, lazy-loaded behind consent
              if (id.includes("posthog")) return "vendor-posthog";
              // React core: shared by all chunks
              if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
                return "vendor-react";
              }
              // React Router
              if (id.includes("react-router")) return "vendor-router";
            },
          },
        },
      },
  ssr: {
    // Bundle these so the SSR output is fully self-contained — Node has no
    // browser globals these libs may touch on import.
    noExternal: ["react-router-dom", "lucide-react", "motion"],
  },
});

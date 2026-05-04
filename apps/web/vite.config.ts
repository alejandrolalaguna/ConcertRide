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
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff,woff2}"],
      },
    }),
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
              // Leaflet + react-leaflet: only needed on map pages
              if (id.includes("leaflet")) return "vendor-map";
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

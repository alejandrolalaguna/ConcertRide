// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
        "@concertride/types": "../../packages/types/src/index.ts",
      },
    },
    server: {
      proxy: {
        "/api": "http://127.0.0.1:8787",
      },
    },
  },
  site: "https://concertride.es",
});

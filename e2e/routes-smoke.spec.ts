// Smoke test: every public route in App.tsx must render without:
//   - JS console errors (React render crashes, uncaught promises)
//   - white-screen-of-death (page must produce visible content > 100 chars)
//   - HTTP 5xx
//
// This catches a whole class of regressions that unit tests miss: a missing
// import, a broken lazy() chunk, a crashed reducer, an unhandled null prop.
// Per-route assertions are intentionally minimal — we just want to know "did
// this URL show ANYTHING usable".

import { expect, test } from "@playwright/test";

const STATIC_ROUTES = [
  "/",
  "/concerts",
  "/festivales",
  "/blog",
  "/rutas",
  "/datos",
  "/datos/precio-medio-carpooling-vs-bus-festivales-2026",
  "/datos/festivales-peor-conexion-transporte-publico-2026",
  "/datos/festivales-mas-caros-mas-baratos-llegar-2026",
  "/datos/calendario-maestro-festivales-2026",
  "/datos/costes-ocultos-transporte-festivales-2026",
  "/datos/conciertos-mayor-demanda-transporte-2026",
  "/datos/alojamiento-cercano-festivales-2026",
  "/datos/cancelaciones-festivales-espana-2020-2026",
  "/datos/heatmap-demanda-festivales-ccaa-2026",
  "/guia-transporte-festivales",
  "/guia/festival-sin-coche",
  "/guia/presupuesto-festival-grupo",
  "/guia/festival-sostenible-co2",
  "/guia/seguridad-carpooling-festival",
  "/guia/festival-primera-vez",
  "/guia/carpooling-conductor-festival",
  "/guia/festival-internacional-espana",
  "/guia/festival-accesibilidad-movilidad-reducida",
  "/guia/acampada-festival-libre-vs-oficial-2026",
  "/guia/festival-veterano-aficionados-mayores-2026",
  "/guia-ir-festivales-2026",
  "/como-funciona",
  "/como-funciona-carpooling",
  "/comparativa/carpooling-vs-taxi-festival",
  "/alternativas-carpooling-festivales",
  "/mejor-carpooling-festivales-2026",
  "/viaje-compartido",
  "/compartir-coche-festival",
  "/ir-juntos-al-festival",
  "/coche-compartido-conciertos",
  "/compartir-gastos-festival",
  "/viaje-en-grupo-festival",
  "/hacer-pina-festival",
  "/prensa",
  "/sala-de-prensa",
  "/contacto",
  "/acerca-de",
  "/glosario",
  "/autor/equipo-concertride",
  "/aviso-legal",
  "/privacidad",
  "/cookies",
  "/terminos",
  "/faq",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/bienvenida",
];

const DYNAMIC_ROUTES = [
  "/concerts/c_rosalia_wizink",
  "/conciertos/madrid",
  "/conciertos/madrid/2026",
  "/festivales/mad-cool",
  "/festivales/mad-cool/guia",
  "/festivales-en/comunidad-de-madrid",
  "/festivales-genero/indie",
  "/calendario-festivales/junio-2026",
  "/artistas/rosalia",
  "/recintos/wizink-center",
  "/blog/alternativa-carpooling-festivales-espana",
  "/rutas/madrid-mad-cool",
  "/como-llegar/mad-cool",
];

// Routes that require auth — they should redirect to /login (not crash).
const AUTH_GATED = ["/publish", "/profile", "/crew", "/feed", "/mis-viajes", "/mensajes", "/favoritos", "/memorias"];

// Routes for the 404 / wildcard fallback.
const NOT_FOUND_ROUTES = ["/this-route-does-not-exist-zzz123"];

function isExpectedConsoleError(text: string): boolean {
  // Filter out warnings and known dev-only noise unrelated to a real crash.
  return (
    !/React Router Future Flag Warning/i.test(text) &&
    !/Failed to register a ServiceWorker/i.test(text) &&
    !/manifest.webmanifest/i.test(text) &&
    !/Download the React DevTools/i.test(text) &&
    !/Sentry Logger \[Warn\]/i.test(text) &&
    !/PostHog/i.test(text) &&
    !/clarity/i.test(text) &&
    // VITE dev sometimes flashes HMR-related 404s before assets settle.
    !/\[vite\].*HMR/i.test(text) &&
    !/Failed to load resource.*404/i.test(text)
  );
}

async function smokeRoute(page: import("@playwright/test").Page, route: string, opts: { allowRedirect?: boolean } = {}) {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const txt = msg.text();
      if (isExpectedConsoleError(txt)) consoleErrors.push(txt);
    }
  });
  page.on("pageerror", (err) => pageErrors.push(err.message));

  const response = await page.goto(route, { waitUntil: "domcontentloaded", timeout: 15_000 });

  // 1. HTTP-level: never 5xx. 4xx is acceptable for /404 routes.
  if (response) {
    const status = response.status();
    expect(status, `HTTP status for ${route}`).toBeLessThan(500);
  }

  // Allow a moment for client-side render + react hydration.
  await page.waitForLoadState("networkidle").catch(() => {});

  const url = page.url();
  if (!opts.allowRedirect) {
    // Ensure we actually landed on (or near) the requested route.
    const pathname = new URL(url).pathname;
    expect(pathname, `landed on ${url} (expected ${route})`).toContain(route.split("?")[0]!.replace(/\/$/, "") || "/");
  }

  // 2. Render-level: page must have rendered something visible.
  const bodyText = await page.evaluate(() => document.body.innerText ?? "");
  expect(bodyText.length, `${route} produced <100 chars of body text — white screen?`).toBeGreaterThan(100);

  // 3. No uncaught React/JS errors.
  expect(pageErrors, `pageerror events on ${route}: ${pageErrors.join(" | ")}`).toHaveLength(0);
  expect(consoleErrors, `console.error on ${route}: ${consoleErrors.join(" | ")}`).toHaveLength(0);
}

test.describe("Routes smoke — no broken pages", () => {
  for (const route of STATIC_ROUTES) {
    test(`static: ${route}`, async ({ page }) => {
      await smokeRoute(page, route);
    });
  }

  for (const route of DYNAMIC_ROUTES) {
    test(`dynamic: ${route}`, async ({ page }) => {
      await smokeRoute(page, route);
    });
  }

  for (const route of AUTH_GATED) {
    test(`auth-gated redirects: ${route}`, async ({ page }) => {
      // Auth-gated pages should either render their own gate UI or redirect to
      // /login — both are non-crash outcomes.
      await smokeRoute(page, route, { allowRedirect: true });
    });
  }

  for (const route of NOT_FOUND_ROUTES) {
    test(`404 fallback: ${route}`, async ({ page }) => {
      // 404 still renders the NotFoundPage component, so it should pass.
      await smokeRoute(page, route, { allowRedirect: true });
    });
  }
});

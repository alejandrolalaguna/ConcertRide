import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App";
import { SessionProvider } from "./lib/session";
import { FavoritesProvider } from "./lib/favorites";
import { CrewProvider } from "./lib/crew";
import { ClarityScript } from "./components/ClarityScript";
import { initSentry } from "./lib/observability";
import { initWebMCP } from "./lib/webmcp";
import { initWebVitals } from "./lib/webVitals";
import { trackAiReferralOnce } from "./lib/analytics-events";
import "./index.css";

// Initialise Sentry as early as possible so even render-phase errors are
// caught. PostHog is initialised lazily on consent from the cookie banner.
initSentry();

// Web Vitals — observers attach immediately; reporting goes through track()
// which is a no-op until analytics consent is granted.
initWebVitals();

// WebMCP — expose ConcertRide tools to AI agents via the browser.
// Must run at page load before React hydration so the browser detection
// mechanism can locate the tools.
initWebMCP();

// AI surface attribution — detect ChatGPT / Perplexity / Gemini / Google
// AI Mode / Claude / Copilot referrers ONCE per session and emit
// `ai_referral_landed`. Consent-gated downstream (no-op pre-consent).
trackAiReferralOnce();

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found in DOM");

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <FavoritesProvider>
          <CrewProvider>
            <ClarityScript />
            <App />
            <Toaster
              position="bottom-center"
              theme="dark"
              richColors={false}
              toastOptions={{
                style: {
                  background: "#0e0e12",
                  border: "1px solid #252530",
                  color: "#f0f0f4",
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "13px",
                  borderRadius: "0",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                },
                className: "cr-toast",
              }}
            />
          </CrewProvider>
        </FavoritesProvider>
      </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SessionProvider } from "./lib/session";
import { FavoritesProvider } from "./lib/favorites";
import { initSentry } from "./lib/observability";
import { initWebMCP } from "./lib/webmcp";
import "./index.css";

// Initialise Sentry as early as possible so even render-phase errors are
// caught. PostHog is initialised lazily on consent from the cookie banner.
initSentry();

// WebMCP — expose ConcertRide tools to AI agents via the browser.
// Must run at page load before React hydration so the browser detection
// mechanism can locate the tools.
initWebMCP();

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found in DOM");

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

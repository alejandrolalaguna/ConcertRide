import { useEffect, useState, type ReactNode } from "react";

// Renders `children` only after the component has mounted on the client. During
// SSR/prerender (and the very first client paint) it renders `fallback`.
//
// Use it to defer browser-only widgets — e.g. the Leaflet maps, which touch
// `window`/`document` at module import. Wrapping a `lazy()` map in <ClientOnly>
// guarantees the lazy import is never triggered during server rendering, so the
// map module (and its `window` access) never runs on the server. This prevents
// the "window is not defined" SSR error that React would otherwise capture into
// a <template data-stck="…"> (leaking local file paths) on every prerendered page.
//
// Safe with this app's createRoot mount (no hydration); also the canonical safe
// pattern under hydrateRoot.
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children : fallback}</>;
}

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll to the top of the page on every route (pathname) change.
 *
 * React Router does not restore scroll by default, so navigating from a
 * scrolled page (e.g. a long concert list) to a new route would otherwise
 * keep the previous scroll offset — making the new page appear "scrolled to
 * the bottom". We scroll on pathname change only; navigations that only change
 * the hash (`#anchor`) are left alone so in-page anchor links keep working.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return; // let the browser jump to the #anchor
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}

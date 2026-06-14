// ─────────────────────────────────────────────────────────────────────────────
// ConcertRide — i18n mechanism (lightweight, dependency-free)
//
// Why a custom solution instead of react-i18next:
//   • The app is prerendered with renderToString (entry-server.tsx) and the
//     client mounts with createRoot (NOT hydrateRoot) — the SSR HTML is fully
//     replaced on the client, so there are zero hydration-mismatch concerns and
//     we don't need an SSR-aware i18n library.
//   • Prerendered HTML must always be Spanish (SEO targets Spanish queries), so
//     on the server we hard-default to `es`. The user's chosen locale is only
//     applied client-side after mount.
//   • Keeps the bundle lean — no extra runtime dependency.
//
// Persistence: the chosen locale lives in localStorage under `cr_locale`. On the
// very first visit with no stored preference we sniff navigator.language.
// `document.documentElement.lang` is kept in sync for a11y / SEO.
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DICTIONARIES, DEFAULT_LOCALE, type Locale, isLocale } from "../locales";

const STORAGE_KEY = "cr_locale";

interface I18nContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// Resolve a dot-path key (e.g. "nav.concerts") against a nested dictionary.
function lookup(dict: unknown, key: string): string | undefined {
  const parts = key.split(".");
  let node: unknown = dict;
  for (const part of parts) {
    if (node && typeof node === "object" && part in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof node === "string" ? node : undefined;
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

// Translate a key for a given locale: active locale → default (es) → raw key.
function translate(
  locale: Locale,
  key: string,
  params?: Record<string, string | number>,
): string {
  const value =
    lookup(DICTIONARIES[locale], key) ??
    lookup(DICTIONARIES[DEFAULT_LOCALE], key) ??
    key;
  return interpolate(value, params);
}

// Determine the initial locale. Server always renders the default (Spanish).
function detectInitialLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && isLocale(stored)) return stored;
  } catch {
    /* localStorage may be unavailable (private mode, etc.) */
  }
  const nav = window.navigator?.language?.slice(0, 2).toLowerCase();
  if (nav && isLocale(nav)) return nav;
  return DEFAULT_LOCALE;
}

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  // When set (e.g. SSR/prerender of an /en/ URL, or client mount on an /en/
  // path), forces the starting locale. Without it, the client sniffs
  // localStorage/navigator and the server falls back to DEFAULT_LOCALE ('es').
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(() => initialLocale ?? detectInitialLocale());

  // Sync <html lang> for a11y and search engines.
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore persistence failures */
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string =>
      translate(locale, key, params),
    [locale],
  );

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// Fallback used when a component calls useI18n() outside an <I18nProvider>
// (e.g. isolated unit tests, or a stray render). Resolves against the default
// locale (Spanish) so behaviour matches the prerendered/SSR output; setLocale
// is a no-op. This keeps the hook safe to call anywhere without crashing.
const FALLBACK_CONTEXT: I18nContextValue = {
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key, params) => translate(DEFAULT_LOCALE, key, params),
};

export function useI18n(): I18nContextValue {
  return useContext(I18nContext) ?? FALLBACK_CONTEXT;
}

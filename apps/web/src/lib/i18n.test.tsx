import { describe, expect, it, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { I18nProvider, useI18n } from "./i18n";

const wrapper = ({ children }: { children: ReactNode }) => <I18nProvider>{children}</I18nProvider>;

beforeEach(() => {
  try {
    window.localStorage.clear();
  } catch {
    /* ignore */
  }
});

describe("i18n — t() lookup & interpolation", () => {
  it("resolves a nested dot-path key against the active dictionary", () => {
    window.localStorage.setItem("cr_locale", "es");
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.t("nav.concerts")).toBe("Conciertos");
    expect(result.current.t("language.label")).toBe("Idioma");
  });

  it("interpolates {placeholder} tokens", () => {
    window.localStorage.setItem("cr_locale", "es");
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.t("nav.trips", { count: 3 })).toBe("3 viajes");
    expect(result.current.t("nav.userMenu", { name: "Ana" })).toBe("Menú de usuario: Ana");
  });

  it("falls back to the raw key when the key is unknown", () => {
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.t("does.not.exist")).toBe("does.not.exist");
  });

  it("leaves unmatched placeholders untouched", () => {
    window.localStorage.setItem("cr_locale", "es");
    const { result } = renderHook(() => useI18n(), { wrapper });
    // {missing} has no value supplied → kept verbatim.
    expect(result.current.t("nav.userMenu", {})).toBe("Menú de usuario: {name}");
  });
});

describe("i18n — locale switching & persistence", () => {
  it("setLocale changes the active translation and persists to localStorage", () => {
    window.localStorage.setItem("cr_locale", "es");
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(result.current.t("language.label")).toBe("Idioma");

    act(() => result.current.setLocale("en"));
    expect(result.current.locale).toBe("en");
    expect(result.current.t("language.label")).toBe("Language");
    expect(window.localStorage.getItem("cr_locale")).toBe("en");
  });

  it("syncs document.documentElement.lang with the active locale", () => {
    window.localStorage.setItem("cr_locale", "es");
    const { result } = renderHook(() => useI18n(), { wrapper });
    expect(document.documentElement.lang).toBe("es");
    act(() => result.current.setLocale("ca"));
    expect(document.documentElement.lang).toBe("ca");
  });
});

describe("i18n — fallback context (no provider)", () => {
  it("useI18n() outside a provider resolves against the default locale (es)", () => {
    const { result } = renderHook(() => useI18n()); // no wrapper
    expect(result.current.locale).toBe("es");
    expect(result.current.t("nav.concerts")).toBe("Conciertos");
    // setLocale is a no-op but must not throw.
    expect(() => result.current.setLocale("en")).not.toThrow();
  });
});

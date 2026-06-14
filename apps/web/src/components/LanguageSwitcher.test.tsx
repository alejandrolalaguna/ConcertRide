import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { I18nProvider } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

function renderSwitcher() {
  return render(
    <I18nProvider>
      <LanguageSwitcher />
    </I18nProvider>,
  );
}

beforeEach(() => {
  try {
    window.localStorage.clear();
  } catch {
    /* ignore */
  }
  window.localStorage.setItem("cr_locale", "es");
});

describe("LanguageSwitcher", () => {
  it("opens the locale menu on click and lists the three locales", () => {
    renderSwitcher();
    const trigger = screen.getByRole("button", { name: /cambiar idioma/i });
    fireEvent.click(trigger);
    expect(screen.getByRole("menuitemradio", { name: /Español/ })).toBeInTheDocument();
    expect(screen.getByRole("menuitemradio", { name: /Català/ })).toBeInTheDocument();
    expect(screen.getByRole("menuitemradio", { name: /English/ })).toBeInTheDocument();
  });

  it("marks the active locale as checked", () => {
    renderSwitcher();
    fireEvent.click(screen.getByRole("button", { name: /cambiar idioma/i }));
    const es = screen.getByRole("menuitemradio", { name: /Español/ });
    expect(es).toHaveAttribute("aria-checked", "true");
  });

  it("selecting a locale persists it to localStorage and closes the menu", () => {
    renderSwitcher();
    fireEvent.click(screen.getByRole("button", { name: /cambiar idioma/i }));
    fireEvent.click(screen.getByRole("menuitemradio", { name: /English/ }));
    expect(window.localStorage.getItem("cr_locale")).toBe("en");
    // Menu closed → options no longer in the DOM.
    expect(screen.queryByRole("menuitemradio", { name: /English/ })).not.toBeInTheDocument();
  });
});

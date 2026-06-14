import { useEffect, useRef, useState } from "react";
import { Globe, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/locales";

// Compact language switcher for the top navigation bar. Renders a globe button
// that opens a small menu of available locales. The chosen locale is persisted
// by the I18nProvider (localStorage `cr_locale`).
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function choose(next: Locale) {
    setLocale(next);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("language.switcher")}
        className="inline-flex items-center gap-1.5 h-9 px-2.5 bg-cr-surface-2 border border-cr-border hover:border-cr-primary/50 text-cr-text hover:text-cr-primary transition-[border-color,color] duration-150"
      >
        <Globe size={13} aria-hidden="true" />
        <span className="font-semibold uppercase tracking-[0.1em] text-[11px]">{locale}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 min-w-[150px] bg-cr-surface border border-cr-border shadow-[var(--shadow-float)] overflow-hidden z-50"
        >
          {LOCALES.map((code) => {
            const active = code === locale;
            return (
              <button
                key={code}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => choose(code)}
                className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-left text-[12px] font-sans font-medium transition-colors duration-100 ${
                  active
                    ? "text-cr-primary bg-cr-surface-2"
                    : "text-cr-text-muted hover:bg-cr-surface-2 hover:text-cr-primary"
                }`}
              >
                <span>{t(`language.${code}`)}</span>
                {active && <Check size={12} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

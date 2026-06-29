import { useState } from "react";
import { MapPin, X, Check } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useI18n } from "@/lib/i18n";
import { SPANISH_CITIES } from "@/lib/constants";

const DISMISS_KEY = "cr_homecity_dismissed";

// Persistent, dismissible banner that asks verified users without a home_city
// for their origin city. Capturing `home_city` is the cheapest unlock for the
// origin→festival matching (only ~9% of users set it). Mirrors VerifyEmailBanner:
// global mount under TopNav, SSR-safe (returns null when there's no session).
export function HomeCityPrompt() {
  const { t } = useI18n();
  const { user, refresh } = useSession();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [city, setCity] = useState("");
  const [saving, setSaving] = useState(false);

  // Only nudge logged-in, email-verified users who haven't set a city yet.
  if (!user || !user.email_verified_at || user.home_city || dismissed) return null;

  function dismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function save() {
    if (!city) return;
    setSaving(true);
    try {
      await api.auth.updateProfile({ home_city: city });
      await refresh();
      toast.success(t("homeCity.success"));
      setDismissed(true);
    } catch {
      toast.error(t("homeCity.error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      role="region"
      aria-label={t("homeCity.regionLabel")}
      data-testid="home-city-prompt"
      className="sticky top-14 z-[88] border-b border-cr-primary/40 bg-cr-primary/10 backdrop-blur"
    >
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3 flex-wrap">
        <MapPin size={14} className="text-cr-primary flex-shrink-0" aria-hidden="true" />
        <p className="font-sans text-xs text-cr-text flex-1 min-w-[180px] leading-snug">
          <strong className="text-cr-primary">{t("homeCity.title")}</strong>{" "}
          <span className="text-cr-text-muted">{t("homeCity.body")}</span>
        </p>
        <label className="sr-only" htmlFor="home-city-select">{t("homeCity.placeholder")}</label>
        <select
          id="home-city-select"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-cr-bg border border-cr-border font-sans text-xs px-2.5 py-1.5 text-cr-text focus:outline-none focus:border-cr-primary max-w-[160px]"
        >
          <option value="">{t("homeCity.placeholder")}</option>
          {SPANISH_CITIES.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={save}
          disabled={!city || saving}
          data-testid="home-city-save"
          className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] bg-cr-primary text-black hover:bg-cr-primary/90 px-3 py-1.5 transition-colors disabled:opacity-50 inline-flex items-center gap-1"
        >
          <Check size={11} strokeWidth={3} /> {saving ? t("homeCity.saving") : t("homeCity.save")}
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="text-cr-text-muted hover:text-cr-text transition-colors"
          aria-label={t("homeCity.dismiss")}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

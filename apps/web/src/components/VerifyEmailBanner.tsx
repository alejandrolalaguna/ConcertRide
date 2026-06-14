import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { AlertCircle, Check, Mail, X } from "lucide-react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useI18n } from "@/lib/i18n";

// Single component that combines:
//  (a) A persistent "Verifica tu email" banner for logged-in users who haven't
//      clicked the link yet — with a "Reenviar" action.
//  (b) A one-shot toast when the user just clicked the link and landed on
//      the app with ?verify=ok | expired | invalid.
// Keeps the UI footprint tiny and keeps all email-verification UX in one file.
export function VerifyEmailBanner() {
  const { t } = useI18n();
  const { user, refresh } = useSession();
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  // Accept verify status from either ?verify= query param (legacy) or router state (new flow).
  const verifyStatus = params.get("verify") ?? (location.state as { verify?: string } | null)?.verify ?? null;
  const [dismissed, setDismissed] = useState(false);
  const [resending, setResending] = useState(false);
  const [resentAt, setResentAt] = useState<number | null>(null);

  // When the user lands with ?verify=ok, refresh session (email_verified_at
  // just changed server-side) and strip the param after N seconds.
  useEffect(() => {
    if (verifyStatus !== "ok") return;
    void refresh();
    const t = setTimeout(() => {
      setParams((p) => {
        const next = new URLSearchParams(p);
        next.delete("verify");
        return next;
      }, { replace: true });
    }, 4500);
    return () => clearTimeout(t);
  }, [verifyStatus, refresh, setParams]);

  async function resend() {
    setResending(true);
    try {
      await api.auth.resendVerification();
      setResentAt(Date.now());
    } catch {
      // ignore
    } finally {
      setResending(false);
    }
  }

  // Toast takes priority over the persistent banner
  if (verifyStatus === "ok") {
    return (
      <div
        role="status"
        className="fixed top-20 left-1/2 -translate-x-1/2 z-[150] bg-cr-primary text-black px-5 py-3 font-sans text-sm font-semibold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black inline-flex items-center gap-2"
      >
        <Check size={16} strokeWidth={3} /> {t("verifyBanner.verifiedToast")}
      </div>
    );
  }
  if (verifyStatus === "expired" || verifyStatus === "invalid") {
    return (
      <div
        role="alert"
        className="fixed top-20 left-1/2 -translate-x-1/2 z-[150] bg-cr-secondary text-white px-5 py-3 font-sans text-sm font-semibold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] border-2 border-black inline-flex items-center gap-2"
      >
        <AlertCircle size={16} strokeWidth={2.5} />
        {t("verifyBanner.linkExpired")}{" "}
        {user ? (
          <button
            type="button"
            onClick={resend}
            className="underline underline-offset-2 font-bold"
            disabled={resending}
          >
            {t("verifyBanner.resend")}
          </button>
        ) : (
          t("verifyBanner.loginToRequest")
        )}
      </div>
    );
  }

  // Persistent banner for logged-in + unverified
  if (!user || user.email_verified_at || dismissed) return null;

  return (
    <div
      role="region"
      aria-label={t("verifyBanner.regionLabel")}
      className="sticky top-14 z-[90] border-b border-cr-secondary/40 bg-cr-secondary/10 backdrop-blur"
    >
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <Mail size={14} className="text-cr-secondary flex-shrink-0" aria-hidden="true" />
        <p className="font-sans text-xs text-cr-text flex-1 leading-snug">
          <strong className="text-cr-secondary">{t("verifyBanner.title")}</strong>{" "}
          {t("verifyBanner.bodyBefore")}{" "}
          <code className="font-mono text-cr-text-muted">{user.email}</code>.
        </p>
        {resentAt && Date.now() - resentAt < 8000 ? (
          <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-cr-primary inline-flex items-center gap-1">
            <Check size={11} /> {t("verifyBanner.resent")}
          </span>
        ) : (
          <button
            type="button"
            onClick={resend}
            disabled={resending}
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] border border-cr-secondary text-cr-secondary hover:bg-cr-secondary hover:text-white px-3 py-1 transition-colors disabled:opacity-50"
          >
            {resending ? t("verifyBanner.sending") : t("verifyBanner.resend")}
          </button>
        )}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-cr-text-muted hover:text-cr-text transition-colors"
          aria-label={t("verifyBanner.dismiss")}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

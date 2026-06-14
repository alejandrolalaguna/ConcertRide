import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Mail } from "lucide-react";
import { api } from "@/lib/api";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { useI18n } from "@/lib/i18n";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useSeoMeta({
    title: "Recuperar contraseña",
    description: "Recupera el acceso a tu cuenta de ConcertRide.",
    canonical: `${SITE_URL}/forgot-password`,
    noindex: true,
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      await api.auth.forgotPassword(email.trim());
    } catch {
      // Endpoint always returns 200 — silently ignore transport errors
    } finally {
      setSubmitting(false);
      setSent(true);
    }
  }

  return (
    <main
      id="main"
      className="relative min-h-dvh bg-cr-bg text-cr-text flex items-start justify-center overflow-hidden"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(219,255,0,0.05) 0%, transparent 60%)" }}
      />

      <div className="relative w-full max-w-md px-6 pt-24 pb-16 md:pt-28 md:pb-20">

        {/* Back link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 hover:text-cr-primary transition-colors mb-10"
        >
          <ArrowLeft size={12} aria-hidden="true" /> {t("auth.backToLogin")}
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 space-y-4"
        >
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            {t("auth.forgotEyebrow")}
          </p>
          <h1 className="font-display text-4xl md:text-5xl uppercase leading-[0.92] tracking-tight">
            {t("auth.forgotTitleLine1")}
            <br />
            <span className="text-cr-primary">{t("auth.forgotTitleLine2")}</span>
          </h1>
          <p className="font-sans text-sm text-white/40 leading-relaxed">
            {t("auth.forgotSubtitle")}
          </p>
        </motion.header>

        {/* Lime divider */}
        <div
          aria-hidden="true"
          className="mb-8 h-px"
          style={{ background: "linear-gradient(to right, rgba(219,255,0,0.3), transparent)" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {sent ? (
            <div className="border border-cr-primary/30 bg-cr-primary/[0.06] p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cr-primary/15 flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-cr-primary" aria-hidden="true" />
                </div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-cr-primary">
                  {t("auth.forgotSentTitle")}
                </p>
              </div>
              <p className="font-sans text-sm text-white/50 leading-relaxed">
                {t("auth.forgotSentPrefix")}{" "}
                <span className="text-white/80">{email}</span>{t("auth.forgotSentSuffix")}
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-cr-primary hover:text-white transition-colors"
              >
                <ArrowLeft size={10} aria-hidden="true" /> {t("auth.backToLogin")}
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <label className="block space-y-1.5">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  {t("auth.emailLabel")}
                </span>
                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.emailPlaceholder")}
                  className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary focus:shadow-[0_0_12px_rgb(219_255_0/0.15)] outline-none px-4 py-3 font-mono text-sm text-cr-text placeholder:text-white/20 transition-all duration-150"
                />
              </label>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submitting || !email.trim()}
                  className="cr-btn-shine w-full bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.14em] text-sm px-6 py-4 hover:bg-[#c8ec00] transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none"
                >
                  {submitting ? t("auth.forgotSubmitting") : t("auth.forgotSubmit")}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </main>
  );
}

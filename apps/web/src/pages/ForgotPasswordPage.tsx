import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useSeoMeta } from "@/lib/useSeoMeta";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useSeoMeta({
    title: "Recuperar contraseña",
    description: "Recupera el acceso a tu cuenta de ConcertRide ES.",
    canonical: "https://concertride.es/forgot-password",
    noindex: true,
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      await api.auth.forgotPassword(email.trim());
    } catch {
      // Fall through — the endpoint always returns 200 on valid input,
      // so anything else is a transport issue we can silently ignore here.
    } finally {
      setSubmitting(false);
      setSent(true);
    }
  }

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
        >
          <ArrowLeft size={14} /> Volver al login
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Recuperar acceso
          </p>
          <h1 className="font-display text-4xl md:text-5xl uppercase leading-[0.95]">
            ¿Olvidaste tu
            <br />
            <span className="text-cr-primary">contraseña?</span>
          </h1>
          <p className="font-sans text-sm text-cr-text-muted">
            Te enviaremos un enlace para crear una nueva. Caduca en 30 minutos.
          </p>
        </motion.header>

        {sent ? (
          <div className="border-2 border-cr-primary bg-cr-surface p-5 space-y-2">
            <p className="font-display text-sm uppercase tracking-wide text-cr-primary">
              Revisa tu email
            </p>
            <p className="font-sans text-sm text-cr-text-muted">
              Si tu cuenta existe, te hemos enviado un enlace a <span className="text-cr-text">{email}</span>. Mira también el spam.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <label className="block space-y-2">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                Email
              </span>
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-mono text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
              />
            </label>

            <button
              type="submit"
              disabled={submitting || !email.trim()}
              className="w-full bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100 disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? "Enviando…" : "Enviar enlace"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

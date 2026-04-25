import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const { refresh } = useSession();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useSeoMeta({
    title: "Nueva contraseña",
    description: "Crea una nueva contraseña para tu cuenta de ConcertRide ES.",
    canonical: `${SITE_URL}/reset-password`,
    noindex: true,
  });

  if (!token) return <Navigate to="/forgot-password" replace />;
  if (done) return <Navigate to="/" replace />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setSubmitting(true);
    try {
      await api.auth.resetPassword(token, password);
      await refresh();
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError("El enlace ha caducado o ya se usó. Solicita uno nuevo.");
      } else {
        setError("No pudimos actualizar la contraseña. Inténtalo de nuevo.");
      }
    } finally {
      setSubmitting(false);
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
            Nueva contraseña
          </p>
          <h1 className="font-display text-4xl md:text-5xl uppercase leading-[0.95]">
            Elige una
            <br />
            <span className="text-cr-primary">nueva clave.</span>
          </h1>
        </motion.header>

        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-2">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
              Nueva contraseña
            </span>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                autoFocus
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 pr-11 font-mono text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cr-text-muted hover:text-cr-primary transition-colors"
              >
                {showPw ? <EyeOff size={16} strokeWidth={1.75} /> : <Eye size={16} strokeWidth={1.75} />}
              </button>
            </div>
          </label>

          <label className="block space-y-2">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
              Confirmar contraseña
            </span>
            <input
              type={showPw ? "text" : "password"}
              required
              autoComplete="new-password"
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repítela"
              className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-mono text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
            />
          </label>

          {error && (
            <p className="font-mono text-xs text-cr-secondary" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !password || !confirm}
            className="w-full bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100 disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? "Guardando…" : "Guardar y entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}

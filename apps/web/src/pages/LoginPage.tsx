import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff, Music, Zap, Users } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

export default function LoginPage() {
  const { user, loading, refresh } = useSession();
  const [params] = useSearchParams();
  const rawNext = params.get("next") ?? "/";
  const next =
    rawNext.startsWith("/") &&
    !rawNext.startsWith("/login") &&
    !rawNext.startsWith("/register") &&
    !rawNext.startsWith("/forgot-password") &&
    !rawNext.startsWith("/reset-password") &&
    !rawNext.startsWith("//")
      ? rawNext
      : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useSeoMeta({
    title: "Entrar",
    description: "Inicia sesión en ConcertRide para reservar viajes compartidos a conciertos o gestionar los que has publicado.",
    canonical: `${SITE_URL}/login`,
    noindex: true,
  });

  if (!loading && user) {
    return <Navigate to={next} replace />;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.auth.login(email.trim(), password);
      await refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 401
            ? "Email o contraseña incorrectos."
            : err.message,
        );
      } else {
        setError("No pudimos conectar. Prueba de nuevo.");
      }
    } finally {
      setSubmitting(false);
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
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(219,255,0,0.05) 0%, transparent 60%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[400px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 0% 100%, rgba(255,79,0,0.04) 0%, transparent 60%)" }}
      />

      {/* Centered card */}
      <div className="relative w-full max-w-md px-6 pt-24 pb-16 md:pt-28 md:pb-20">

        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 hover:text-cr-primary transition-colors mb-10"
        >
          <ArrowLeft size={12} aria-hidden="true" /> Inicio
        </Link>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 space-y-4"
        >
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Acceso
          </p>
          <h1 className="font-display text-4xl md:text-5xl uppercase leading-[0.92] tracking-tight">
            Entra en
            <br />
            <span className="text-cr-primary">ConcertRide.</span>
          </h1>
          <p className="font-sans text-sm text-white/40 leading-relaxed">
            Accede para gestionar tus viajes y reservas.
          </p>

          {/* Mini value props */}
          <div className="flex flex-wrap gap-4 pt-1">
            {[
              { icon: Zap, text: "0% comisión" },
              { icon: Users, text: "Conductores verificados" },
              { icon: Music, text: "+50 festivales" },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1.5 font-mono text-[10px] text-white/30">
                <Icon size={10} className="text-cr-primary" aria-hidden="true" />
                {text}
              </span>
            ))}
          </div>
        </motion.header>

        {/* Lime divider */}
        <div
          aria-hidden="true"
          className="mb-8 h-px"
          style={{ background: "linear-gradient(to right, rgba(219,255,0,0.3), transparent)" }}
        />

        {/* Form */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-5"
        >
          {/* Email */}
          <motion.label
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="block space-y-1.5"
          >
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
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
              className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary focus:shadow-[0_0_12px_rgb(219_255_0/0.15)] outline-none px-4 py-3 font-mono text-sm text-cr-text placeholder:text-white/20 transition-all duration-150"
            />
          </motion.label>

          {/* Password */}
          <motion.label
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="block space-y-1.5"
          >
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              Contraseña
            </span>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary focus:shadow-[0_0_12px_rgb(219_255_0/0.15)] outline-none px-4 py-3 pr-12 font-mono text-sm text-cr-text placeholder:text-white/20 transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-cr-primary transition-colors"
              >
                {showPw ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
              </button>
            </div>
          </motion.label>

          {error && (
            <p className="font-mono text-xs text-cr-secondary py-1" role="alert">
              {error}
            </p>
          )}

          <div className="text-right -mt-1">
            <Link
              to="/forgot-password"
              className="font-mono text-[10px] text-white/30 hover:text-cr-primary transition-colors uppercase tracking-[0.12em]"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={submitting || !email.trim() || !password}
              className="cr-btn-shine w-full bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.14em] text-sm px-6 py-4 hover:bg-[#c8ec00] transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none"
            >
              {submitting ? "Entrando…" : "Entrar →"}
            </button>
          </div>

          <p className="font-sans text-sm text-white/30 text-center pt-1">
            ¿Aún no tienes cuenta?{" "}
            <Link
              to={`/register${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-cr-primary underline hover:no-underline"
            >
              Regístrate gratis
            </Link>
          </p>
        </motion.form>
      </div>
    </main>
  );
}

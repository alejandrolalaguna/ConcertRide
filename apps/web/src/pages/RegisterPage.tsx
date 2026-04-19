import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";

export default function RegisterPage() {
  const { user, loading, refresh } = useSession();
  const [params] = useSearchParams();
  const next = params.get("next") ?? "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Crear cuenta — ConcertRide ES";
  }, []);

  if (!loading && user) {
    return <Navigate to={next} replace />;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.auth.register(email.trim(), password, name.trim());
      await refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 409
            ? "Ya existe una cuenta con ese email."
            : err.status === 400
              ? "Revisa los datos: la contraseña debe tener al menos 8 caracteres."
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
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
        >
          <ArrowLeft size={14} /> Inicio
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Nueva cuenta
          </p>
          <h1 className="font-display text-4xl md:text-5xl uppercase leading-[0.95]">
            Únete a
            <br />
            <span className="text-cr-primary">ConcertRide.</span>
          </h1>
        </motion.header>

        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-2">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
              Nombre
            </span>
            <input
              type="text"
              required
              autoFocus
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-sans text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
            />
          </label>

          <label className="block space-y-2">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-mono text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
            />
          </label>

          <label className="block space-y-2">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
              Contraseña <span className="text-cr-text-dim font-normal normal-case tracking-normal">(mín. 8 caracteres)</span>
            </span>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          {error && (
            <p className="font-mono text-xs text-cr-secondary" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !name.trim() || !email.trim() || password.length < 8}
            className="w-full bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100 disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? "Creando cuenta…" : "Crear cuenta"}
          </button>

          <p className="font-sans text-sm text-cr-text-muted text-center">
            ¿Ya tienes cuenta?{" "}
            <Link
              to={`/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-cr-primary underline hover:no-underline"
            >
              Entra aquí
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

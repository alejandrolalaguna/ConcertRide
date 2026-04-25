import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { SPANISH_CITIES } from "@/lib/constants";
import { useSeoMeta } from "@/lib/useSeoMeta";

export default function RegisterPage() {
  const { user, loading, refresh } = useSession();
  const [params] = useSearchParams();
  const next = params.get("next") ?? "/";
  const ref = params.get("ref") ?? undefined;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [phone, setPhone] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [smoker, setSmoker] = useState<"yes" | "no" | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useSeoMeta({
    title: "Crear cuenta gratis",
    description: "Regístrate gratis en ConcertRide ES para reservar o publicar viajes compartidos a conciertos en España. Solo email y contraseña.",
    canonical: "https://concertride.es/register",
    noindex: true,
  });

  if (!loading && user) {
    return <Navigate to={next} replace />;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) return;
    if (!tosAccepted) {
      setError("Debes aceptar los términos y la política de privacidad.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await api.auth.register(
        email.trim(),
        password,
        name.trim(),
        {
          phone: phone.trim() || undefined,
          home_city: homeCity || undefined,
          smoker: smoker === "yes" ? true : smoker === "no" ? false : undefined,
        },
        ref,
      );
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

          {/* Optional profile fields */}
          <div className="pt-2 space-y-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-text-dim">
              Perfil <span className="font-normal normal-case tracking-normal">(opcional)</span>
            </p>

            <label className="block space-y-2">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                Ciudad habitual
              </span>
              <select
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-sans text-sm text-cr-text transition-colors [color-scheme:dark]"
              >
                <option value="">Sin especificar</option>
                {SPANISH_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                Teléfono
              </span>
              <input
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-mono text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
              />
            </label>

            <div className="space-y-2">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                ¿Fumas?
              </span>
              <div className="flex gap-2">
                {(["", "no", "yes"] as const).map((val) => {
                  const label = val === "" ? "Prefiero no decir" : val === "no" ? "No fumo" : "Sí fumo";
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSmoker(val)}
                      className={`flex-1 py-2 font-sans text-xs font-semibold uppercase tracking-[0.1em] border-2 transition-colors ${
                        smoker === val
                          ? "border-cr-primary text-cr-primary bg-cr-primary/5"
                          : "border-cr-border text-cr-text-muted hover:border-cr-primary/50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={(e) => setAgeConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-cr-primary flex-shrink-0 cursor-pointer"
              required
              aria-required="true"
            />
            <span className="font-sans text-xs text-cr-text-muted leading-relaxed">
              Confirmo que tengo al menos <strong className="text-cr-text">18 años</strong> de edad.
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={tosAccepted}
              onChange={(e) => setTosAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-cr-primary flex-shrink-0 cursor-pointer"
              required
              aria-required="true"
            />
            <span className="font-sans text-xs text-cr-text-muted leading-relaxed">
              He leído y acepto los{" "}
              <Link to="/terminos" target="_blank" className="text-cr-primary underline underline-offset-2">
                términos y condiciones
              </Link>{" "}
              y la{" "}
              <Link to="/privacidad" target="_blank" className="text-cr-primary underline underline-offset-2">
                política de privacidad
              </Link>
              .
            </span>
          </label>

          {error && (
            <p className="font-mono text-xs text-cr-secondary" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !name.trim() || !email.trim() || password.length < 8 || !tosAccepted || !ageConfirmed}
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

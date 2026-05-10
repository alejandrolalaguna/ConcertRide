import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Check, Eye, EyeOff } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { SPANISH_CITIES } from "@/lib/constants";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

export default function RegisterPage() {
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
    description: "Regístrate gratis en ConcertRide para reservar o publicar viajes compartidos a conciertos en España. Solo email y contraseña.",
    canonical: `${SITE_URL}/register`,
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
    <main
      id="main"
      className="relative min-h-dvh bg-cr-bg text-cr-text flex items-start justify-center overflow-hidden"
    >
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(219,255,0,0.06) 0%, transparent 60%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[500px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 100% 100%, rgba(255,79,0,0.05) 0%, transparent 60%)" }}
      />

      {/* Centered card */}
      <div className="relative w-full max-w-lg px-6 pt-24 pb-16 md:pt-28 md:pb-20">

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
          className="mb-10 space-y-5"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-cr-primary/30 bg-cr-primary/[0.07] px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cr-primary animate-pulse flex-shrink-0" aria-hidden="true" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
              Acceso early adopter — gratis para siempre
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl uppercase leading-[0.92] tracking-tight">
            Únete a
            <br />
            <span className="text-cr-primary">ConcertRide.</span>
          </h1>

          <p className="font-sans text-sm text-white/45 leading-relaxed">
            Carpooling a festivales y conciertos en España. Sin comisión. Sin intermediarios.
          </p>

          {/* Value props */}
          <ul className="space-y-2 pt-1">
            {[
              "Viajes a Viña Rock, Arenal Sound, Mad Cool, BBK Live y más",
              "0 % comisión — pagas directamente al conductor",
              "Conductores verificados con carnet",
              "Vuelta de madrugada coordinada con el festival",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-0.5 w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-full bg-cr-primary/15 text-cr-primary">
                  <Check size={9} strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="font-sans text-xs text-white/40 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.header>

        {/* Divider */}
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
          {/* Name */}
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
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
              className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary outline-none px-4 py-3 font-sans text-sm text-cr-text placeholder:text-white/20 transition-colors duration-150"
            />
          </label>

          {/* Email */}
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary outline-none px-4 py-3 font-mono text-sm text-cr-text placeholder:text-white/20 transition-colors duration-150"
            />
          </label>

          {/* Password */}
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              Contraseña{" "}
              <span className="font-normal normal-case tracking-normal text-white/25">(mín. 8 caracteres)</span>
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
                className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary outline-none px-4 py-3 pr-12 font-mono text-sm text-cr-text placeholder:text-white/20 transition-colors duration-150"
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
          </label>

          {/* Optional profile section */}
          <div className="pt-2 space-y-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/20">
              Perfil — opcional
            </p>

            {/* City */}
            <label className="block space-y-1.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                Ciudad habitual
              </span>
              <select
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary outline-none px-4 py-3 font-sans text-sm text-cr-text transition-colors duration-150 [color-scheme:dark]"
              >
                <option value="">Sin especificar</option>
                {SPANISH_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </label>

            {/* Phone */}
            <label className="block space-y-1.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                Teléfono
              </span>
              <input
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary outline-none px-4 py-3 font-mono text-sm text-cr-text placeholder:text-white/20 transition-colors duration-150"
              />
            </label>

            {/* Smoker toggle */}
            <div className="space-y-1.5">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                ¿Fumas?
              </span>
              <div className="flex gap-2">
                {(["", "no", "yes"] as const).map((val) => {
                  const label = val === "" ? "Prefiero no decir" : val === "no" ? "No fumo" : "Sí fumo";
                  const active = smoker === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSmoker(val)}
                      className={`flex-1 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] border transition-colors duration-150 ${
                        active
                          ? "border-cr-primary text-cr-primary bg-cr-primary/[0.08]"
                          : "border-white/[0.1] text-white/30 hover:border-white/25 hover:text-white/50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="pt-1 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <span className={`mt-0.5 w-4 h-4 flex-shrink-0 border flex items-center justify-center transition-colors ${ageConfirmed ? "border-cr-primary bg-cr-primary/15" : "border-white/20 group-hover:border-white/35"}`}>
                {ageConfirmed && <Check size={9} strokeWidth={3} className="text-cr-primary" aria-hidden="true" />}
              </span>
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="sr-only"
                required
                aria-required="true"
              />
              <span className="font-sans text-xs text-white/40 leading-relaxed">
                Confirmo que tengo al menos <strong className="text-white/70 font-semibold">18 años</strong> de edad.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <span className={`mt-0.5 w-4 h-4 flex-shrink-0 border flex items-center justify-center transition-colors ${tosAccepted ? "border-cr-primary bg-cr-primary/15" : "border-white/20 group-hover:border-white/35"}`}>
                {tosAccepted && <Check size={9} strokeWidth={3} className="text-cr-primary" aria-hidden="true" />}
              </span>
              <input
                type="checkbox"
                checked={tosAccepted}
                onChange={(e) => setTosAccepted(e.target.checked)}
                className="sr-only"
                required
                aria-required="true"
              />
              <span className="font-sans text-xs text-white/40 leading-relaxed">
                He leído y acepto los{" "}
                <Link to="/terminos" target="_blank" className="text-cr-primary underline underline-offset-2 hover:no-underline">
                  términos y condiciones
                </Link>{" "}
                y la{" "}
                <Link to="/privacidad" target="_blank" className="text-cr-primary underline underline-offset-2 hover:no-underline">
                  política de privacidad
                </Link>
                .
              </span>
            </label>
          </div>

          {error && (
            <p className="font-mono text-xs text-cr-secondary py-1" role="alert">
              {error}
            </p>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !name.trim() || !email.trim() || password.length < 8 || !tosAccepted || !ageConfirmed}
              className="cr-btn-shine w-full bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.14em] text-sm px-6 py-4 hover:bg-[#c8ec00] transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none"
            >
              {submitting ? "Creando cuenta…" : "Crear cuenta gratis →"}
            </button>
          </div>

          <p className="font-sans text-sm text-white/30 text-center pt-1">
            ¿Ya tienes cuenta?{" "}
            <Link
              to={`/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-cr-primary underline hover:no-underline"
            >
              Entra aquí
            </Link>
          </p>
        </motion.form>
      </div>
    </main>
  );
}

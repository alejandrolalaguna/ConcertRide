import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Check, ChevronDown, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { SPANISH_CITIES } from "@/lib/constants";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

const TRUST_BULLETS: { title: string; detail: string }[] = [
  {
    title: "Gratis · sin tarjeta de crédito",
    detail: "Crea tu cuenta sin datos bancarios. Solo email y contraseña.",
  },
  {
    title: "Verificamos el carnet de conducir",
    detail: "Cada conductor debe subir su carnet antes de publicar el primer viaje.",
  },
  {
    title: "Pago en efectivo o Bizum directo",
    detail: "Pagas al conductor el día del viaje. Sin adelantos en la plataforma.",
  },
  {
    title: "0% comisión — ConcertRide no toca tu dinero",
    detail: "El precio que ves es el que paga el pasajero al conductor. Sin sorpresas.",
  },
  {
    title: "Cancelación sin coste antes del viaje",
    detail: "Como el pago es el día del viaje, cancelar antes no tiene coste económico.",
  },
];

// Verbatim from apps/web/src/components/landing/TestimonialsSection.tsx (id "1").
const REGISTER_TESTIMONIAL = {
  quote:
    "Encontré viaje en 5 minutos. Llegamos cantando todo el camino. Ya no concibo ir a un festival de otra forma.",
  author: "Lucía M.",
  route: "Madrid → Benicàssim",
  festival: "FIB 2025",
  savings: "~100€",
};

export default function RegisterPage() {
  const { user, loading, refresh } = useSession();
  const [params] = useSearchParams();
  const rawNext = params.get("next") ?? "";
  // Respect an explicit ?next= param (e.g. from a gated page), but fall back
  // to /bienvenida for new registrations so users get the onboarding wizard.
  const next =
    rawNext.startsWith("/") &&
    !rawNext.startsWith("/login") &&
    !rawNext.startsWith("/register") &&
    !rawNext.startsWith("/forgot-password") &&
    !rawNext.startsWith("/reset-password") &&
    !rawNext.startsWith("//")
      ? rawNext
      : "/bienvenida";
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
  // Progressive disclosure — optional profile fields hidden by default to reduce form friction.
  // Users complete the core 3-field form first; expanding is available after.
  const [showOptional, setShowOptional] = useState(false);

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

          {/* Social proof — community size + key differentiators */}
          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
            aria-label="Datos de la comunidad ConcertRide"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5" aria-hidden="true">
                {["L","M","A","J","R"].map((initial) => (
                  <span
                    key={initial}
                    className="w-6 h-6 rounded-full bg-cr-primary text-black font-display text-[10px] flex items-center justify-center border-2 border-cr-bg"
                  >
                    {initial}
                  </span>
                ))}
              </div>
              <span className="font-sans text-xs text-white/60">
                Únete a más de <strong className="text-white/90 font-semibold">4.200 viajeros</strong>
              </span>
            </div>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Ventajas principales">
              {["0% comisión", "Conductores verificados", "Gratis para siempre"].map((pill) => (
                <span
                  key={pill}
                  role="listitem"
                  className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] border border-white/[0.12] text-white/50 px-2 py-0.5"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <h1 className="font-display text-4xl md:text-5xl uppercase leading-[0.92] tracking-tight">
            Únete <span className="text-cr-primary">gratis.</span>
          </h1>

          <p className="font-sans text-sm text-white/45 leading-relaxed">
            Carpooling a festivales y conciertos en España. Sin comisión. Sin intermediarios.
          </p>

          {/* Trust signals — proof-driven, fact-dense, no vague promises */}
          <div className="pt-2 border border-white/[0.08] bg-white/[0.02] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} strokeWidth={1.5} className="text-cr-primary" aria-hidden="true" />
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Por qué confiar en ConcertRide
              </p>
            </div>
            <ul className="space-y-2.5">
              {TRUST_BULLETS.map((b) => (
                <li key={b.title} className="flex items-start gap-2.5">
                  <span className="mt-0.5 w-4 h-4 flex-shrink-0 flex items-center justify-center rounded-full bg-cr-primary/15 text-cr-primary">
                    <Check size={9} strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="font-sans text-xs leading-relaxed">
                    <span className="text-white/80 font-semibold">{b.title}</span>
                    <span className="text-white/40"> — {b.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
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
          <label htmlFor="reg-name" className="block space-y-1.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              Nombre
            </span>
            <input
              id="reg-name"
              type="text"
              required
              aria-required="true"
              autoFocus
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              aria-describedby={error ? "reg-error" : undefined}
              aria-invalid={!!error || undefined}
              className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary outline-none px-4 py-3 font-sans text-sm text-cr-text placeholder:text-white/20 transition-colors duration-150"
            />
          </label>

          {/* Email */}
          <label htmlFor="reg-email" className="block space-y-1.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              Email
            </span>
            <input
              id="reg-email"
              type="email"
              required
              aria-required="true"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              aria-describedby={error ? "reg-error" : undefined}
              aria-invalid={!!error || undefined}
              className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary outline-none px-4 py-3 font-mono text-sm text-cr-text placeholder:text-white/20 transition-colors duration-150"
            />
          </label>

          {/* Password */}
          <label htmlFor="reg-password" className="block space-y-1.5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
              Contraseña{" "}
              <span id="reg-password-hint" className="font-normal normal-case tracking-normal text-white/25">(mín. 8 caracteres)</span>
            </span>
            <div className="relative">
              <input
                id="reg-password"
                type={showPw ? "text" : "password"}
                required
                aria-required="true"
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                aria-describedby={`reg-password-hint${error ? " reg-error" : ""}`}
                aria-invalid={!!error || undefined}
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

          {/* Progressive disclosure — optional profile fields */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowOptional((v) => !v)}
              className="w-full flex items-center justify-between gap-2 py-2.5 group"
              aria-expanded={showOptional}
            >
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25 group-hover:text-white/45 transition-colors">
                Perfil opcional — mejora los resultados de matching
              </span>
              <ChevronDown
                size={14}
                aria-hidden="true"
                className={`text-white/25 group-hover:text-white/45 transition-all duration-200 ${showOptional ? "rotate-180" : "rotate-0"}`}
              />
            </button>

            <AnimatePresence initial={false}>
              {showOptional && (
                <motion.div
                  key="optional-fields"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-5 pb-1">
                    {/* City */}
                    <label htmlFor="reg-home-city" className="block space-y-1.5">
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                        Ciudad habitual
                      </span>
                      <select
                        id="reg-home-city"
                        autoComplete="address-level2"
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
                    <label htmlFor="reg-phone" className="block space-y-1.5">
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                        Teléfono
                      </span>
                      <input
                        id="reg-phone"
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+34 600 000 000"
                        className="w-full bg-white/[0.04] border border-white/[0.1] focus:border-cr-primary outline-none px-4 py-3 font-mono text-sm text-cr-text placeholder:text-white/20 transition-colors duration-150"
                      />
                    </label>

                    {/* Smoker toggle */}
                    <fieldset className="space-y-1.5 border-0 p-0 m-0">
                      <legend className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                        ¿Fumas?
                      </legend>
                      <div className="flex gap-2">
                        {(["", "no", "yes"] as const).map((val) => {
                          const label = val === "" ? "Prefiero no decir" : val === "no" ? "No fumo" : "Sí fumo";
                          const active = smoker === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setSmoker(val)}
                              aria-pressed={active}
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
                    </fieldset>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
            <p id="reg-error" className="font-mono text-xs text-cr-secondary py-1" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          {/* Submit */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={submitting || !name.trim() || !email.trim() || password.length < 8 || !tosAccepted || !ageConfirmed}
              className="cr-btn-shine w-full bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.14em] text-sm px-6 py-4 hover:bg-[#c8ec00] transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none"
            >
              {submitting ? "Creando cuenta…" : "Crear cuenta gratis →"}
            </button>
            <p className="font-sans text-[11px] text-white/40 text-center leading-relaxed">
              <Check size={10} strokeWidth={3} className="inline-block text-cr-primary mr-1 -mt-0.5" aria-hidden="true" />
              Sin compromiso. Ver viajes antes de publicar tu primero.
            </p>
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

        {/* Social proof — one verbatim testimonial reused from TestimonialsSection */}
        <motion.figure
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 border-l-2 border-cr-primary/40 pl-5 py-2 space-y-2"
        >
          <div
            className="flex gap-0.5"
            aria-label="Valoración 5 de 5 estrellas"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <span key={n} className="text-[12px] text-cr-primary" aria-hidden="true">
                ★
              </span>
            ))}
          </div>
          <blockquote className="font-sans text-sm text-white/65 leading-relaxed italic">
            “{REGISTER_TESTIMONIAL.quote}”
          </blockquote>
          <figcaption className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/35">
            — {REGISTER_TESTIMONIAL.author} · {REGISTER_TESTIMONIAL.route}
            {" · "}
            <span className="text-cr-primary">ahorró {REGISTER_TESTIMONIAL.savings}</span>
          </figcaption>
        </motion.figure>
      </div>
    </main>
  );
}

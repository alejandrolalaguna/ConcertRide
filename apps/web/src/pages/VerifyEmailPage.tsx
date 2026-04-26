import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle, Loader2, MailX, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

type Stage = "checking" | "ready" | "invalid" | "confirming" | "done";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const navigate = useNavigate();
  const { refresh } = useSession();

  const [stage, setStage] = useState<Stage>("checking");

  useSeoMeta({
    title: "Verificar email",
    description: "Confirma tu dirección de correo para activar tu cuenta en ConcertRide.",
    canonical: `${SITE_URL}/verify-email`,
    noindex: true,
  });

  // On mount: probe the token without consuming it (GET is read-only).
  useEffect(() => {
    if (!token) { setStage("invalid"); return; }
    api.auth.checkVerifyToken(token)
      .then((res) => setStage(res.valid ? "ready" : "invalid"))
      .catch(() => setStage("invalid"));
  }, [token]);

  async function confirm() {
    setStage("confirming");
    try {
      await api.auth.verifyEmail(token);
      await refresh();
      setStage("done");
      setTimeout(() => navigate("/", { replace: true, state: { verify: "ok" } }), 2200);
    } catch {
      setStage("invalid");
    }
  }

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8">

        {stage === "checking" && (
          <div className="flex flex-col items-center gap-4 py-16">
            <Loader2 size={36} className="text-cr-primary animate-spin" />
            <p className="font-sans text-sm text-cr-text-muted">Comprobando enlace…</p>
          </div>
        )}

        {stage === "ready" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-8"
          >
            <header className="space-y-3">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
                Verificación de email
              </p>
              <h1 className="font-display text-4xl md:text-5xl uppercase leading-[0.95]">
                Un paso
                <br />
                <span className="text-cr-primary">más.</span>
              </h1>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
                Pulsa el botón para confirmar tu dirección de correo y activar tu cuenta.
              </p>
            </header>

            <button
              type="button"
              onClick={confirm}
              className="w-full bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100 inline-flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} strokeWidth={2.5} />
              Confirmar mi email
            </button>
          </motion.div>
        )}

        {stage === "confirming" && (
          <div className="flex flex-col items-center gap-4 py-16">
            <Loader2 size={36} className="text-cr-primary animate-spin" />
            <p className="font-sans text-sm text-cr-text-muted">Verificando…</p>
          </div>
        )}

        {stage === "done" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-6 py-12 text-center"
          >
            <CheckCircle size={52} className="text-cr-primary" strokeWidth={1.5} />
            <div className="space-y-2">
              <p className="font-display text-2xl uppercase text-cr-primary">¡Email verificado!</p>
              <p className="font-sans text-sm text-cr-text-muted">Redirigiendo a la app…</p>
            </div>
          </motion.div>
        )}

        {stage === "invalid" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-8"
          >
            <header className="space-y-3">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-secondary">
                Enlace no válido
              </p>
              <h1 className="font-display text-4xl md:text-5xl uppercase leading-[0.95]">
                Enlace
                <br />
                <span className="text-cr-secondary">caducado.</span>
              </h1>
            </header>

            <div className="flex items-start gap-3 border-l-2 border-cr-secondary/50 pl-4 py-1">
              <MailX size={18} className="text-cr-secondary flex-shrink-0 mt-0.5" strokeWidth={1.75} />
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
                Este enlace ha caducado o ya fue utilizado. Los enlaces de verificación son de un solo uso y expiran en 7 días.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100 text-center"
              >
                Iniciar sesión y reenviar
              </Link>
              <p className="font-sans text-xs text-cr-text-dim text-center">
                Al iniciar sesión verás un banner para reenviar el email de verificación.
              </p>
            </div>
          </motion.div>
        )}

      </div>
    </main>
  );
}

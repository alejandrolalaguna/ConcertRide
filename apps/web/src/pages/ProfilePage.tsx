import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Bell, BellOff, Check, Link2, ShieldCheck, Star, TrendingUp, Upload } from "lucide-react";
import type { Review, Ride } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { usePush } from "@/lib/usePush";
import { SPANISH_CITIES } from "@/lib/constants";
import { initials, formatDay, formatDate } from "@/lib/format";
import { useSeoMeta } from "@/lib/useSeoMeta";

type Tristate = "yes" | "no" | "";

function toTristate(val: boolean | null | undefined): Tristate {
  if (val === true) return "yes";
  if (val === false) return "no";
  return "";
}

function fromTristate(val: Tristate): boolean | null {
  if (val === "yes") return true;
  if (val === "no") return false;
  return null;
}

function TristateToggle({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: Tristate;
  onChange: (v: Tristate) => void;
  options: { value: Tristate; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
        {label}
      </span>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 font-sans text-xs font-semibold uppercase tracking-[0.1em] border-2 transition-colors ${
              value === opt.value
                ? "border-cr-primary text-cr-primary bg-cr-primary/5"
                : "border-cr-border text-cr-text-muted hover:border-cr-primary/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading, refresh } = useSession();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [homeCity, setHomeCity] = useState("");
  const [smoker, setSmoker] = useState<Tristate>("");
  const [hasLicense, setHasLicense] = useState<Tristate>("");
  const [carModel, setCarModel] = useState("");
  const [carColor, setCarColor] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [refCopied, setRefCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const { state: pushState, subscribe: pushSubscribe, unsubscribe: pushUnsubscribe } = usePush();

  useSeoMeta({
    title: "Mi perfil",
    description: "Gestiona tu perfil de ConcertRide ES: datos personales, ciudad base, preferencias de viaje y vehículo.",
    canonical: "https://concertride.es/profile",
    noindex: true,
  });

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setPhone(user.phone ?? "");
    setHomeCity(user.home_city ?? "");
    setSmoker(toTristate(user.smoker));
    setHasLicense(toTristate(user.has_license));
    setCarModel(user.car_model ?? "");
    setCarColor(user.car_color ?? "");
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setReviewsLoading(true);
    api.users
      .listReviews(user.id)
      .then((r) => setReviews(r.reviews))
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    api.rides
      .list({ driver_id: user.id })
      .then((r) => setMyRides(r.rides))
      .catch(() => setMyRides([]));
  }, [user?.id]);

  if (!loading && !user) return <Navigate to="/login?next=/profile" replace />;
  if (loading || !user) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      await api.auth.updateProfile({
        name: name.trim() || undefined,
        phone: phone.trim() || null,
        home_city: homeCity || null,
        smoker: fromTristate(smoker),
        has_license: fromTristate(hasLicense),
        car_model: carModel.trim() || null,
        car_color: carColor.trim() || null,
      });
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al guardar. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-10">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-5"
        >
          <div className="w-16 h-16 rounded-full bg-cr-primary text-black font-display text-2xl flex items-center justify-center">
            {initials(user.name)}
          </div>
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
              Mi perfil
            </p>
            <h1 className="font-display text-3xl uppercase leading-tight">{user.name}</h1>
            <p className="font-mono text-xs text-cr-text-muted">{user.email}</p>
          </div>
        </motion.header>

        <dl className="flex gap-6 font-mono text-xs text-cr-text-muted border-t border-cr-border pt-6">
          <div>
            <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] mb-0.5">Viajes dados</dt>
            <dd className="text-cr-text text-base">{user.rides_given}</dd>
          </div>
          <div>
            <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] mb-0.5">Valoración</dt>
            <dd className="text-cr-primary text-base flex items-center gap-1">
              <Star size={13} className="fill-cr-primary stroke-cr-primary" />
              {user.rating.toFixed(1)}
              {user.rating_count > 0 && (
                <span className="text-cr-text-muted text-[11px]">({user.rating_count})</span>
              )}
            </dd>
          </div>
        </dl>

        {/* Driver earnings panel — only shown if user has license or has published rides */}
        {(user.has_license || myRides.length > 0) && (
          <section className="space-y-4 border border-cr-border p-5">
            <header className="flex items-center gap-2">
              <TrendingUp size={14} className="text-cr-primary" aria-hidden="true" />
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
                Panel de conductor
              </h2>
            </header>
            <dl className="grid grid-cols-3 gap-4">
              <div>
                <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted mb-1">
                  Viajes dados
                </dt>
                <dd className="font-mono text-xl text-cr-text">{user.rides_given}</dd>
              </div>
              <div>
                <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted mb-1">
                  Ganancias estimadas
                </dt>
                <dd className="font-mono text-xl text-cr-primary">
                  €{myRides
                    .filter((r) => r.status === "completed")
                    .reduce((sum, r) => sum + r.price_per_seat * (r.seats_total - r.seats_left), 0)
                    .toFixed(0)}
                </dd>
              </div>
              <div>
                <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted mb-1">
                  Plazas vendidas
                </dt>
                <dd className="font-mono text-xl text-cr-text">
                  {myRides.reduce((sum, r) => sum + (r.seats_total - r.seats_left), 0)}
                </dd>
              </div>
            </dl>

            {myRides.filter((r) => r.status === "active" || r.status === "full").length > 0 && (
              <div className="border-t border-dashed border-cr-border pt-4 space-y-2">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                  Próximos viajes
                </p>
                <ul className="space-y-2">
                  {myRides
                    .filter((r) => r.status === "active" || r.status === "full")
                    .slice(0, 3)
                    .map((r) => (
                      <li key={r.id}>
                        <Link
                          to={`/rides/${r.id}`}
                          className="flex items-center justify-between gap-4 py-2 border-b border-dashed border-cr-border last:border-0 hover:text-cr-primary transition-colors group"
                        >
                          <div className="min-w-0">
                            <p className="font-sans text-xs font-semibold text-cr-text group-hover:text-cr-primary truncate">
                              {r.concert.artist}
                            </p>
                            <p className="font-mono text-[11px] text-cr-text-muted">
                              {r.origin_city} → {r.concert.venue.city} · {formatDate(r.departure_time)}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-mono text-xs text-cr-primary">€{r.price_per_seat}/plaza</p>
                            <p className="font-mono text-[11px] text-cr-text-muted">
                              {r.seats_left}/{r.seats_total} libres
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            )}
            {user.referral_code && (
              <div className="border-t border-dashed border-cr-border pt-4 space-y-2">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                  Enlace de invitación
                  {user.referral_count >= 3 && (
                    <span className="ml-2 bg-cr-primary text-black px-1.5 py-0.5 text-[9px]">
                      ★ Embajador
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-[11px] text-cr-text bg-cr-bg border border-cr-border px-2 py-1.5 truncate">
                    {`${window.location.origin}/register?ref=${user.referral_code}`}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard
                        .writeText(`${window.location.origin}/register?ref=${user.referral_code}`)
                        .then(() => {
                          setRefCopied(true);
                          setTimeout(() => setRefCopied(false), 2000);
                        });
                    }}
                    className="shrink-0 inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
                  >
                    <Link2 size={12} aria-hidden="true" />
                    {refCopied ? "¡Copiado!" : "Copiar"}
                  </button>
                </div>
                <p className="font-mono text-[11px] text-cr-text-muted">
                  {user.referral_count} conductor{user.referral_count === 1 ? "" : "es"} invitado{user.referral_count === 1 ? "" : "s"}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Reviews received */}
        {(reviewsLoading || reviews.length > 0) && (
          <section className="space-y-3">
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary border-b border-cr-border pb-2">
              Valoraciones recibidas
            </h2>
            {reviewsLoading ? (
              <p className="font-mono text-xs text-cr-text-muted">Cargando…</p>
            ) : (
              <ul className="space-y-3">
                {reviews.map((r) => (
                  <li key={r.id} className="bg-cr-surface border border-cr-border p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-cr-border text-cr-text-muted font-display text-xs flex items-center justify-center flex-shrink-0">
                          {initials(r.reviewer.name)}
                        </div>
                        <span className="font-sans text-xs font-semibold text-cr-text">{r.reviewer.name}</span>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            size={11}
                            className={n <= r.rating ? "fill-cr-primary stroke-cr-primary" : "stroke-cr-border fill-transparent"}
                          />
                        ))}
                      </div>
                    </div>
                    {r.comment && (
                      <p className="font-mono text-xs text-cr-text-muted leading-relaxed">{r.comment}</p>
                    )}
                    <p className="font-mono text-[10px] text-cr-text-dim">{formatDay(r.created_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Push notifications */}
        {pushState !== "unsupported" && (
          <div className="flex items-center justify-between gap-4 border border-dashed border-cr-border px-4 py-3">
            <div className="flex items-center gap-2">
              {pushState === "subscribed" ? (
                <Bell size={14} className="text-cr-primary shrink-0" aria-hidden="true" />
              ) : (
                <BellOff size={14} className="text-cr-text-muted shrink-0" aria-hidden="true" />
              )}
              <div>
                <p className="font-sans text-xs font-semibold text-cr-text">
                  {pushState === "subscribed" ? "Notificaciones activadas" : "Notificaciones desactivadas"}
                </p>
                <p className="font-mono text-[11px] text-cr-text-muted">
                  {pushState === "denied"
                    ? "Bloqueadas en el navegador — actívalas en Ajustes"
                    : pushState === "subscribed"
                      ? "Recibirás avisos de solicitudes y mensajes"
                      : "Actívalas para no perderte solicitudes ni mensajes"}
                </p>
              </div>
            </div>
            {pushState !== "denied" && (
              <button
                type="button"
                onClick={pushState === "subscribed" ? pushUnsubscribe : pushSubscribe}
                disabled={pushState === "loading"}
                className={`shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.1em] border-2 px-3 py-1.5 transition-colors disabled:opacity-40 ${
                  pushState === "subscribed"
                    ? "border-cr-border text-cr-text-muted hover:border-cr-secondary hover:text-cr-secondary"
                    : "border-cr-primary text-cr-primary hover:bg-cr-primary/10"
                }`}
              >
                {pushState === "loading" ? "…" : pushState === "subscribed" ? "Desactivar" : "Activar"}
              </button>
            )}
          </div>
        )}

        <form onSubmit={submit} className="space-y-8">

          {/* Cuenta */}
          <section className="space-y-4">
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary border-b border-cr-border pb-2">
              Cuenta
            </h2>
            <label className="block space-y-2">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                Nombre
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-sans text-sm text-cr-text transition-colors"
              />
            </label>
            <label className="block space-y-2">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                Teléfono <span className="font-normal normal-case tracking-normal text-cr-text-dim">(opcional)</span>
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
          </section>

          {/* Ubicación */}
          <section className="space-y-4">
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary border-b border-cr-border pb-2">
              Ubicación
            </h2>
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
          </section>

          {/* Sobre ti */}
          <section className="space-y-4">
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary border-b border-cr-border pb-2">
              Sobre ti
            </h2>
            <TristateToggle
              label="Carnet de conducir"
              value={hasLicense}
              onChange={setHasLicense}
              options={[
                { value: "", label: "No indicado" },
                { value: "yes", label: "Sí tengo" },
                { value: "no", label: "No tengo" },
              ]}
            />
            <TristateToggle
              label="¿Fumas?"
              value={smoker}
              onChange={setSmoker}
              options={[
                { value: "", label: "No indicado" },
                { value: "no", label: "No fumo" },
                { value: "yes", label: "Sí fumo" },
              ]}
            />

            {/* License verification */}
            {user.license_verified ? (
              <div className="flex items-center gap-2 border border-cr-primary/40 bg-cr-primary/[0.06] px-4 py-3">
                <ShieldCheck size={14} className="text-cr-primary shrink-0" aria-hidden="true" />
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-primary">
                  Conductor verificado
                </p>
              </div>
            ) : (
              <div className="space-y-3 border border-dashed border-cr-border p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={14} className="text-cr-text-muted mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-sans text-xs font-semibold text-cr-text">
                      Verifica tu carnet de conducir
                    </p>
                    <p className="font-sans text-xs text-cr-text-muted mt-0.5">
                      Sube una foto del carnet (anverso). Aparecerá el badge ★ Verificado en tu perfil y en tus rides.
                    </p>
                  </div>
                </div>
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="sr-only"
                    disabled={verifying}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setVerifying(true);
                      setVerifyError(null);
                      try {
                        const res = await api.auth.verifyLicense(file);
                        await refresh();
                        if (res.user) {
                          // session refreshed — component re-renders with license_verified=true
                        }
                      } catch (err) {
                        setVerifyError(err instanceof Error ? err.message : "Error al enviar el documento");
                      } finally {
                        setVerifying(false);
                      }
                    }}
                  />
                  <span
                    className={`inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border px-4 py-2 transition-colors ${
                      verifying
                        ? "opacity-40 pointer-events-none"
                        : "hover:border-cr-primary hover:text-cr-primary cursor-pointer"
                    }`}
                  >
                    <Upload size={12} aria-hidden="true" />
                    {verifying ? "Verificando…" : "Subir carnet"}
                  </span>
                </label>
                {verifyError && (
                  <p className="font-mono text-xs text-cr-secondary">{verifyError}</p>
                )}
              </div>
            )}
          </section>

          {/* Coche */}
          <section className="space-y-4">
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary border-b border-cr-border pb-2">
              Coche <span className="font-sans font-normal normal-case tracking-normal text-cr-text-dim text-xs">(si ofreces viajes)</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="block space-y-2">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                  Modelo
                </span>
                <input
                  type="text"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  placeholder="SEAT León, Renault Clio…"
                  className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-sans text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
                />
              </label>
              <label className="block space-y-2">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                  Color
                </span>
                <input
                  type="text"
                  value={carColor}
                  onChange={(e) => setCarColor(e.target.value)}
                  placeholder="Negro, Blanco…"
                  className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-sans text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
                />
              </label>
            </div>
          </section>

          {error && (
            <p className="font-mono text-xs text-cr-secondary" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100 disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? "Guardando…" : saved ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Check size={14} /> Guardado
              </span>
            ) : "Guardar cambios"}
          </button>
        </form>
      </div>
    </main>
  );
}

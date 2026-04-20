import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { SPANISH_CITIES } from "@/lib/constants";
import { initials } from "@/lib/format";

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

  useEffect(() => {
    document.title = "Mi perfil — ConcertRide ES";
  }, []);

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
            <dd className="text-cr-primary text-base">★ {user.rating.toFixed(1)}</dd>
          </div>
        </dl>

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

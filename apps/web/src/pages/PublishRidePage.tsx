import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { ArrowLeft, ArrowRight, Check, PenLine, Search } from "lucide-react";
import type { Concert, CreateConcertInput, Luggage, Ride, SmokingPolicy, Vibe } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { SPANISH_CITIES, SPANISH_CITIES_BY_NAME } from "@/lib/constants";
import { formatDate, formatTime } from "@/lib/format";
import { useSession } from "@/lib/session";
import { VibeSelector } from "@/components/VibeSelector";
import { PulsingDot } from "@/components/LoadingStates";

type Step = 1 | 2 | 3;

interface Form {
  concert: Concert | null;
  // manual concert fields (used when concert === null + manualMode === true)
  manual_artist: string;
  manual_name: string;
  manual_venue_name: string;
  manual_venue_city: string;
  manual_date: string;
  manual_genre: string;
  origin_city: string;
  origin_address: string;
  departure_time: string;
  round_trip: boolean;
  return_time: string;
  seats_total: number;
  price_per_seat: number;
  vibe: Vibe | null;
  smoking_policy: SmokingPolicy;
  max_luggage: Luggage;
  playlist_url: string;
  notes: string;
}

const INITIAL: Form = {
  concert: null,
  manual_artist: "",
  manual_name: "",
  manual_venue_name: "",
  manual_venue_city: "",
  manual_date: "",
  manual_genre: "",
  origin_city: "",
  origin_address: "",
  departure_time: "",
  round_trip: false,
  return_time: "",
  seats_total: 3,
  price_per_seat: 15,
  vibe: null,
  smoking_policy: "no",
  max_luggage: "backpack",
  playlist_url: "",
  notes: "",
};

export default function PublishRidePage() {
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useSession();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<Form>(INITIAL);
  const [manualMode, setManualMode] = useState(false);
  const [concerts, setConcerts] = useState<Concert[] | null>(null);
  const [q, setQ] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Ride | null>(null);

  useEffect(() => {
    document.title = "Publicar un viaje — ConcertRide ES";
    api.concerts.list({ limit: 50 }).then((res) => setConcerts(res.concerts)).catch(() => setConcerts([]));
  }, []);

  const filteredConcerts = useMemo(() => {
    if (!concerts) return [];
    const needle = q.trim().toLowerCase();
    if (!needle) return concerts;
    return concerts.filter((c) =>
      [c.artist, c.name, c.venue.name, c.venue.city].some((f) => f.toLowerCase().includes(needle)),
    );
  }, [concerts, q]);

  if (!sessionLoading && !user) {
    return <Navigate to="/login?next=%2Fpublish" replace />;
  }

  const manualConcertValid =
    manualMode &&
    form.manual_artist.trim().length >= 1 &&
    form.manual_venue_name.trim().length >= 1 &&
    form.manual_venue_city.trim().length >= 1 &&
    form.manual_date.length >= 1;

  const canContinueStep1 = manualMode ? manualConcertValid : !!form.concert;
  const canContinueStep2 =
    !!form.origin_city &&
    form.origin_address.trim().length >= 3 &&
    !!form.departure_time &&
    (!form.round_trip || !!form.return_time) &&
    form.seats_total >= 1 &&
    form.seats_total <= 8 &&
    form.price_per_seat > 0;
  const canSubmit = canContinueStep2 && !!form.vibe && !submitting;

  function update<K extends keyof Form>(key: K, v: Form[K]) {
    setForm((f) => ({ ...f, [key]: v }));
  }

  function switchToManual() {
    setManualMode(true);
    setForm((f) => ({ ...f, concert: null }));
  }

  function switchToSearch() {
    setManualMode(false);
    setForm((f) => ({
      ...f,
      manual_artist: "",
      manual_name: "",
      manual_venue_name: "",
      manual_venue_city: "",
      manual_date: "",
      manual_genre: "",
    }));
  }

  async function submit() {
    if (!form.vibe) return;
    const coord = SPANISH_CITIES_BY_NAME[form.origin_city];
    if (!coord) {
      setError("Ciudad no reconocida");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      let concertId: string;

      if (manualMode) {
        const concertInput: CreateConcertInput = {
          artist: form.manual_artist.trim(),
          name: form.manual_name.trim() || form.manual_artist.trim(),
          venue_name: form.manual_venue_name.trim(),
          venue_city: form.manual_venue_city.trim(),
          date: new Date(form.manual_date).toISOString(),
          ...(form.manual_genre.trim() ? { genre: form.manual_genre.trim() } : {}),
        };
        const newConcert = await api.concerts.create(concertInput);
        concertId = newConcert.id;
      } else {
        if (!form.concert) return;
        concertId = form.concert.id;
      }

      const ride = await api.rides.create({
        concert_id: concertId,
        origin_city: coord.name,
        origin_lat: coord.lat,
        origin_lng: coord.lng,
        origin_address: form.origin_address.trim(),
        departure_time: new Date(form.departure_time).toISOString(),
        price_per_seat: form.price_per_seat,
        seats_total: form.seats_total,
        round_trip: form.round_trip,
        ...(form.round_trip && form.return_time
          ? { return_time: new Date(form.return_time).toISOString() }
          : {}),
        ...(form.playlist_url.trim() ? { playlist_url: form.playlist_url.trim() } : {}),
        vibe: form.vibe,
        smoking_policy: form.smoking_policy,
        max_luggage: form.max_luggage,
        ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
      });
      setCreated(ride);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        confetti({
          particleCount: 120,
          spread: 75,
          origin: { y: 0.45 },
          colors: ["#DBFF00", "#FF4F00", "#F5F5F5"],
        });
      }
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("Algo falló. Inténtalo otra vez.");
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    return (
      <main id="main" className="min-h-dvh bg-cr-bg text-cr-text">
        <div className="max-w-2xl mx-auto px-6 py-16 space-y-8 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2"
          >
            <Check size={14} aria-hidden="true" /> Viaje publicado
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-display uppercase text-3xl md:text-5xl leading-[0.95]"
          >
            Nos vemos
            <br />
            en el show.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: 2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block bg-cr-surface border border-cr-border text-left px-6 py-4 font-mono text-xs max-w-sm mx-auto"
          >
            <p className="text-cr-primary font-sans font-semibold tracking-[0.12em] mb-2">
              DE · {created.origin_city.toUpperCase()}
            </p>
            <p className="font-display uppercase text-lg">{created.concert.artist}</p>
            <p className="text-cr-text-muted mt-1">
              {formatDate(created.departure_time)} · {formatTime(created.departure_time)}
            </p>
            <p className="text-cr-primary mt-2">
              €{created.price_per_seat} · {created.seats_total} plazas
            </p>
          </motion.div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/rides/${created.id}`}
              className="inline-flex items-center justify-center bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
            >
              Ver mi viaje
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-transparent text-cr-text font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-cr-border hover:border-cr-primary hover:text-cr-primary px-6 py-3 transition-colors duration-150"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text">
      <div className="max-w-3xl mx-auto px-6 py-10 md:py-16 space-y-10">
        <header className="space-y-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            <ArrowLeft size={14} /> Volver
          </button>
          <div className="space-y-2">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
              Publicar un viaje
            </p>
            <h1 className="font-display uppercase text-3xl md:text-5xl leading-[0.95]">
              Abre tu coche.
              <br />
              Divide el coste.
            </h1>
          </div>
          <Stepper step={step} />
        </header>

        {step === 1 && (
          <section aria-labelledby="step1" className="space-y-5">
            <h2 id="step1" className="font-display text-lg uppercase tracking-wide">
              01 · Elige el concierto
            </h2>

            {/* Mode toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={switchToSearch}
                className={`flex items-center gap-2 px-4 py-2 border-2 font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                  !manualMode
                    ? "border-cr-primary bg-cr-primary/[0.06] text-cr-primary"
                    : "border-cr-border text-cr-text-muted hover:border-cr-text-muted"
                }`}
              >
                <Search size={13} aria-hidden="true" />
                Buscar en la web
              </button>
              <button
                type="button"
                onClick={switchToManual}
                className={`flex items-center gap-2 px-4 py-2 border-2 font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                  manualMode
                    ? "border-cr-primary bg-cr-primary/[0.06] text-cr-primary"
                    : "border-cr-border text-cr-text-muted hover:border-cr-text-muted"
                }`}
              >
                <PenLine size={13} aria-hidden="true" />
                Mi concierto no está aquí
              </button>
            </div>

            {!manualMode && (
              <>
                <label className="relative block">
                  <span className="sr-only">Buscar concierto</span>
                  <Search
                    size={14}
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-cr-text-muted"
                  />
                  <input
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Artista, recinto o ciudad"
                    className="w-full pl-9 pr-3 py-3 bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none font-sans text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
                  />
                </label>

                {!concerts && <PulsingDot label="Cargando conciertos" />}

                {concerts && filteredConcerts.length === 0 && (
                  <p className="font-mono text-xs text-cr-text-dim">
                    Sin resultados para "{q}".{" "}
                    <button
                      type="button"
                      onClick={switchToManual}
                      className="underline text-cr-primary hover:no-underline"
                    >
                      Añádelo manualmente.
                    </button>
                  </p>
                )}

                <ol className="space-y-2 max-h-[420px] overflow-auto">
                  {filteredConcerts.map((c) => {
                    const selected = form.concert?.id === c.id;
                    return (
                      <li key={c.id}>
                        <button
                          type="button"
                          onClick={() => update("concert", c)}
                          aria-pressed={selected}
                          className={`w-full text-left flex items-center justify-between gap-4 px-4 py-3 border-2 transition-colors ${
                            selected
                              ? "border-cr-primary bg-cr-primary/[0.06]"
                              : "border-cr-border hover:border-cr-text-muted bg-cr-surface"
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="font-display uppercase truncate">{c.artist}</p>
                            <p className="font-mono text-[11px] text-cr-text-muted truncate">
                              {c.venue.name} · {c.venue.city} · {formatDate(c.date)}
                            </p>
                          </div>
                          {selected && (
                            <Check size={16} className="text-cr-primary shrink-0" aria-hidden="true" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </>
            )}

            {manualMode && (
              <div className="space-y-4 border-2 border-dashed border-cr-border p-5">
                <p className="font-sans text-xs text-cr-text-muted uppercase tracking-[0.1em]">
                  Datos del concierto
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Artista *">
                    <input
                      type="text"
                      value={form.manual_artist}
                      onChange={(e) => update("manual_artist", e.target.value)}
                      placeholder="Ej: Rosalía"
                      className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-sans text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
                    />
                  </Field>

                  <Field label="Nombre del evento">
                    <input
                      type="text"
                      value={form.manual_name}
                      onChange={(e) => update("manual_name", e.target.value)}
                      placeholder="Si lo dejas vacío se usa el artista"
                      className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-sans text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
                    />
                  </Field>

                  <Field label="Recinto *">
                    <input
                      type="text"
                      value={form.manual_venue_name}
                      onChange={(e) => update("manual_venue_name", e.target.value)}
                      placeholder="Ej: Palau Sant Jordi"
                      className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-sans text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
                    />
                  </Field>

                  <Field label="Ciudad del recinto *">
                    <select
                      value={form.manual_venue_city}
                      onChange={(e) => update("manual_venue_city", e.target.value)}
                      className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-sans text-sm text-cr-text [color-scheme:dark] transition-colors"
                    >
                      <option value="">Selecciona…</option>
                      {SPANISH_CITIES.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Fecha y hora *">
                    <input
                      type="datetime-local"
                      value={form.manual_date}
                      onChange={(e) => update("manual_date", e.target.value)}
                      className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-mono text-sm text-cr-text [color-scheme:dark] transition-colors"
                    />
                  </Field>

                  <Field label="Género (opcional)">
                    <input
                      type="text"
                      value={form.manual_genre}
                      onChange={(e) => update("manual_genre", e.target.value)}
                      placeholder="Ej: Pop, Rock, Reggaeton…"
                      className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-sans text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
                    />
                  </Field>
                </div>
              </div>
            )}

            <StepNav
              canContinue={canContinueStep1}
              onBack={null}
              onNext={() => setStep(2)}
            />
          </section>
        )}

        {step === 2 && (
          <section aria-labelledby="step2" className="space-y-5">
            <h2 id="step2" className="font-display text-lg uppercase tracking-wide">
              02 · Detalles del viaje
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Ciudad de origen">
                <select
                  value={form.origin_city}
                  onChange={(e) => update("origin_city", e.target.value)}
                  className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-sans text-sm text-cr-text [color-scheme:dark] transition-colors"
                >
                  <option value="">Selecciona…</option>
                  {SPANISH_CITIES.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Dirección de recogida">
                <input
                  type="text"
                  value={form.origin_address}
                  onChange={(e) => update("origin_address", e.target.value)}
                  placeholder="Estación Joaquín Sorolla, Valencia"
                  className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-sans text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
                />
              </Field>

              <Field label="Salida">
                <input
                  type="datetime-local"
                  value={form.departure_time}
                  onChange={(e) => update("departure_time", e.target.value)}
                  className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-mono text-sm text-cr-text [color-scheme:dark] transition-colors"
                />
              </Field>

              <Field label="Precio por asiento (€)">
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={form.price_per_seat}
                  onChange={(e) => update("price_per_seat", Number(e.target.value))}
                  className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-mono text-sm text-cr-text transition-colors"
                />
              </Field>

              <Field label="Plazas disponibles">
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={form.seats_total}
                  onChange={(e) => update("seats_total", Number(e.target.value))}
                  className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-mono text-sm text-cr-text transition-colors"
                />
              </Field>

              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer pt-7">
                  <input
                    type="checkbox"
                    checked={form.round_trip}
                    onChange={(e) => update("round_trip", e.target.checked)}
                    className="accent-cr-primary"
                  />
                  <span className="font-sans text-sm">Ida y vuelta</span>
                </label>
              </div>

              {form.round_trip && (
                <Field label="Vuelta" full>
                  <input
                    type="datetime-local"
                    value={form.return_time}
                    onChange={(e) => update("return_time", e.target.value)}
                    className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-mono text-sm text-cr-text [color-scheme:dark] transition-colors"
                  />
                </Field>
              )}
            </div>

            <StepNav
              canContinue={canContinueStep2}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          </section>
        )}

        {step === 3 && (
          <section aria-labelledby="step3" className="space-y-6">
            <h2 id="step3" className="font-display text-lg uppercase tracking-wide">
              03 · Vibe check
            </h2>

            <VibeSelector value={form.vibe} onChange={(v) => update("vibe", v)} />

            <div className="space-y-2">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                Política de tabaco
              </span>
              <div className="flex gap-2">
                {(
                  [
                    { value: "no", label: "🚭 Prohibido fumar" },
                    { value: "yes", label: "🚬 Fumadores OK" },
                  ] as { value: SmokingPolicy; label: string }[]
                ).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update("smoking_policy", value)}
                    className={`px-4 py-2 border-2 font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                      form.smoking_policy === value
                        ? "border-cr-primary bg-cr-primary/[0.06] text-cr-primary"
                        : "border-cr-border text-cr-text-muted hover:border-cr-text-muted"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                Equipaje máximo permitido
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    { value: "none", label: "Sin equipaje" },
                    { value: "small", label: "Bolso pequeño" },
                    { value: "backpack", label: "Mochila" },
                    { value: "cabin", label: "Maleta cabina" },
                    { value: "large", label: "Maleta grande" },
                    { value: "extra", label: "Extra (instrumento…)" },
                  ] as { value: Luggage; label: string }[]
                ).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update("max_luggage", value)}
                    className={`py-2 px-3 font-sans text-xs font-semibold uppercase tracking-[0.08em] border-2 text-left transition-colors ${
                      form.max_luggage === value
                        ? "border-cr-primary text-cr-primary bg-cr-primary/5"
                        : "border-cr-border text-cr-text-muted hover:border-cr-primary/50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <Field label="Playlist de Spotify (opcional)">
              <input
                type="url"
                value={form.playlist_url}
                onChange={(e) => update("playlist_url", e.target.value)}
                placeholder="https://open.spotify.com/playlist/…"
                className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-mono text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
              />
            </Field>

            <Field label="Notas para pasajeros (opcional)">
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Coche con AC, no fumadores, paramos a comer en la ruta…"
                className="w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-3 font-sans text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
              />
            </Field>

            {error && <p className="font-mono text-xs text-cr-secondary">{error}</p>}

            <StepNav
              canContinue={canSubmit}
              submitting={submitting}
              onBack={() => setStep(2)}
              onNext={submit}
              finalLabel="Publicar viaje"
            />
          </section>
        )}
      </div>
    </main>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps = [
    { n: 1, label: "Concierto" },
    { n: 2, label: "Ruta" },
    { n: 3, label: "Vibe" },
  ] as const;
  return (
    <ol className="flex items-center gap-3">
      {steps.map((s, i) => {
        const active = s.n <= step;
        return (
          <li key={s.n} className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-xs w-6 h-6 inline-flex items-center justify-center border ${
                  active
                    ? "bg-cr-primary text-black border-cr-primary"
                    : "bg-transparent text-cr-text-muted border-cr-border"
                }`}
              >
                {String(s.n).padStart(2, "0")}
              </span>
              <span
                className={`font-sans text-[11px] font-semibold uppercase tracking-[0.12em] ${
                  active ? "text-cr-text" : "text-cr-text-dim"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={`flex-1 h-px ${active && step > s.n ? "bg-cr-primary" : "bg-cr-border"}`}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`space-y-2 ${full ? "md:col-span-2" : ""}`}>
      <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function StepNav({
  canContinue,
  submitting,
  onBack,
  onNext,
  finalLabel,
}: {
  canContinue: boolean;
  submitting?: boolean;
  onBack: (() => void) | null;
  onNext: () => void;
  finalLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 pt-4 border-t border-dashed border-cr-border">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-text transition-colors"
        >
          <ArrowLeft size={14} /> Atrás
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={!canContinue}
        className="inline-flex items-center gap-2 bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100 disabled:opacity-40 disabled:pointer-events-none"
      >
        {finalLabel ?? "Continuar"}
        {!submitting && <ArrowRight size={14} />}
      </button>
    </div>
  );
}

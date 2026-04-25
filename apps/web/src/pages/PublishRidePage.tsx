import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { ArrowLeft, ArrowRight, Check, PenLine, Search, Sparkles } from "lucide-react";
import type { Concert, CreateConcertInput, Luggage, PaymentMethod, Ride, SmokingPolicy, Vibe } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { SPANISH_CITIES, SPANISH_CITIES_BY_NAME } from "@/lib/constants";
import { formatDate, formatTime } from "@/lib/format";
import { useSession } from "@/lib/session";
import { track } from "@/lib/observability";
import { VibeSelector } from "@/components/VibeSelector";
import { PulsingDot } from "@/components/LoadingStates";
import { useSeoMeta } from "@/lib/useSeoMeta";

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
  instant_booking: boolean;
  price_negotiable: boolean;
  accepted_payment: PaymentMethod;
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
  instant_booking: false,
  price_negotiable: false,
  accepted_payment: "cash_or_bizum",
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
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [maxReasonablePrice, setMaxReasonablePrice] = useState<number | null>(null);
  const [autofilledFields, setAutofilledFields] = useState<string[]>([]);

  useSeoMeta({
    title: "Publicar un viaje a un concierto",
    description: "Publica gratis tu viaje compartido a un concierto o festival en España. Fija el precio por asiento y divide los gastos con otros fans.",
    canonical: "https://concertride.es/publish",
  });

  useEffect(() => {
    api.concerts.list({ limit: 50 }).then((res) => setConcerts(res.concerts)).catch(() => setConcerts([]));
  }, []);

  // Pre-fill fields from profile (only on first render, before user edits)
  useEffect(() => {
    if (!user) return;
    const filled: string[] = [];
    setForm((f) => {
      const patch: Partial<Form> = {};
      if (user.home_city && !f.origin_city) {
        patch.origin_city = user.home_city;
        filled.push(`Ciudad de origen: ${user.home_city}`);
      }
      if (user.smoker === true) {
        patch.smoking_policy = "yes";
        filled.push("Política de tabaco: fumadores OK");
      }
      return { ...f, ...patch };
    });
    if (filled.length > 0) setAutofilledFields(filled);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

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
    if (manualMode && form.manual_date && new Date(form.manual_date) < new Date()) {
      setError("La fecha del concierto no puede ser en el pasado.");
      return;
    }
    if (form.departure_time && new Date(form.departure_time) < new Date()) {
      setError("La hora de salida no puede ser en el pasado.");
      return;
    }
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
        instant_booking: form.instant_booking,
        price_negotiable: form.price_negotiable,
        accepted_payment: form.accepted_payment,
        smoking_policy: form.smoking_policy,
        max_luggage: form.max_luggage,
        ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
      });
      setCreated(ride);
      track("ride_published", {
        ride_id: ride.id,
        concert_id: ride.concert_id,
        origin_city: ride.origin_city,
        price_per_seat: ride.price_per_seat,
        seats_total: ride.seats_total,
        vibe: ride.vibe,
        adhoc: manualMode,
      });
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

        {user && !user.license_verified && (
          <section className="border-2 border-cr-secondary bg-cr-secondary/5 p-5 md:p-6 space-y-3">
            <div className="flex items-start gap-3">
              <span aria-hidden="true" className="text-lg">🛂</span>
              <div className="flex-1 space-y-1.5">
                <p className="font-sans text-sm font-semibold text-cr-text">
                  Verifica tu carnet para publicar
                </p>
                <p className="font-sans text-xs text-cr-text-muted">
                  Para mantener la confianza de la comunidad solo los conductores con carnet
                  verificado pueden publicar viajes. Tarda 30 segundos.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Link
                to="/profile"
                className="font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-secondary text-cr-secondary hover:bg-cr-secondary hover:text-white px-4 py-2 transition-colors"
              >
                Verificar carnet →
              </Link>
            </div>
          </section>
        )}

        {user && !user.car_model && (
          <section className="border border-dashed border-cr-border bg-cr-surface p-4 flex items-start gap-3">
            <span aria-hidden="true" className="text-base mt-0.5">🚗</span>
            <div className="flex-1 space-y-1">
              <p className="font-sans text-xs font-semibold text-cr-text">
                Añade tu coche al perfil para generar más confianza
              </p>
              <p className="font-sans text-xs text-cr-text-muted">
                Modelo y color aparecen en la página del viaje y ayudan a los pasajeros a identificarte en el punto de recogida.
              </p>
            </div>
            <Link
              to="/profile"
              className="shrink-0 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] border border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary px-3 py-1.5 transition-colors whitespace-nowrap"
            >
              Ir al perfil
            </Link>
          </section>
        )}

        {autofilledFields.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-cr-primary/30 bg-cr-primary/[0.04] p-4 flex items-start gap-3"
          >
            <Sparkles size={14} className="text-cr-primary mt-0.5 shrink-0" aria-hidden="true" />
            <div className="flex-1 space-y-1">
              <p className="font-sans text-xs font-semibold text-cr-primary">Rellenado automáticamente desde tu perfil</p>
              <ul className="space-y-0.5">
                {autofilledFields.map((f) => (
                  <li key={f} className="font-mono text-[11px] text-cr-text-muted">· {f}</li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setAutofilledFields([])}
              className="shrink-0 font-mono text-[11px] text-cr-text-dim hover:text-cr-text transition-colors"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </motion.section>
        )}

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
                <PriceWarning
                  pricePerSeat={form.price_per_seat}
                  suggestedPrice={suggestedPrice}
                  maxReasonablePrice={maxReasonablePrice}
                  onApplySuggested={() => suggestedPrice !== null && update("price_per_seat", suggestedPrice)}
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

            {user && (user.car_model || user.car_color) && (
              <div className="flex items-center gap-3 border border-cr-border bg-cr-surface px-4 py-3">
                <span aria-hidden="true" className="text-base">🚗</span>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-cr-text-muted">Tu vehículo</p>
                  <p className="font-sans text-sm text-cr-text truncate">
                    {[user.car_model, user.car_color].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="shrink-0 font-mono text-[11px] text-cr-text-dim hover:text-cr-primary transition-colors"
                >
                  Editar
                </Link>
              </div>
            )}

            {form.seats_total >= 1 && (
              <EarningsCalculator
                pricePerSeat={form.price_per_seat}
                seatsTotal={form.seats_total}
                originCity={form.origin_city}
                destinationCity={
                  form.concert?.venue.city ?? form.manual_venue_city ?? ""
                }
                onSuggestedPrice={setSuggestedPrice}
                onMaxReasonablePrice={setMaxReasonablePrice}
              />
            )}

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

            <div className="border border-cr-border p-4 flex items-start gap-4">
              <div className="flex-1 space-y-1">
                <p className="font-sans text-sm font-semibold text-cr-text">
                  Reserva instantánea
                </p>
                <p className="font-sans text-xs text-cr-text-muted">
                  Los pasajeros reservan sin esperar tu confirmación. Se descuenta el asiento al momento.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.instant_booking}
                onClick={() => update("instant_booking", !form.instant_booking)}
                className={`relative flex-shrink-0 w-11 h-6 border-2 transition-colors duration-150 ${
                  form.instant_booking ? "bg-cr-primary border-cr-primary" : "bg-cr-surface-2 border-cr-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-black transition-transform duration-150 ${
                    form.instant_booking ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="border border-cr-border p-4 flex items-start gap-4">
              <div className="flex-1 space-y-1">
                <p className="font-sans text-sm font-semibold text-cr-text">
                  Precio negociable
                </p>
                <p className="font-sans text-xs text-cr-text-muted">
                  Los pasajeros podrán hacerte una propuesta de precio en el mensaje al solicitar plaza. Tú decides si aceptas.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.price_negotiable}
                onClick={() => update("price_negotiable", !form.price_negotiable)}
                className={`relative flex-shrink-0 w-11 h-6 border-2 transition-colors duration-150 ${
                  form.price_negotiable ? "bg-cr-primary border-cr-primary" : "bg-cr-surface-2 border-cr-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-black transition-transform duration-150 ${
                    form.price_negotiable ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                Método de pago aceptado
              </span>
              <div className="flex gap-2 flex-wrap">
                {(
                  [
                    { value: "cash", label: "💵 Efectivo" },
                    { value: "bizum", label: "📱 Bizum" },
                    { value: "cash_or_bizum", label: "💵 / 📱 Ambos" },
                  ] as { value: PaymentMethod; label: string }[]
                ).map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update("accepted_payment", value)}
                    className={`flex-1 px-3 py-2 border-2 font-sans text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                      form.accepted_payment === value
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

// Road distance is ~20% longer than straight-line (Haversine)
const ROAD_FACTOR = 1.2;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type FuelType = "gasoline95" | "diesel";

interface FuelPrices { gasoline95: number; diesel: number; updatedAt: string; }

// Sensible Spanish-market defaults while the API loads
const DEFAULT_PRICES: FuelPrices = { gasoline95: 1.72, diesel: 1.62, updatedAt: "" };
const DEFAULT_CONSUMPTION: Record<FuelType, number> = { gasoline95: 7.0, diesel: 6.0 };

// Price thresholds as multiples of per-seat fuel cost:
// - reasonable:   up to THRESHOLD_HIGH  (fuel + wear + driver premium)  → no warning
// - high:         THRESHOLD_HIGH to THRESHOLD_VERY_HIGH                 → yellow advisory
// - very high:    above THRESHOLD_VERY_HIGH                             → orange advisory
const WEAR_MULTIPLIER = 1.20;       // +20% for tyres/maintenance
const DRIVER_PREMIUM_MULTIPLIER = 1.40; // +40% driver time/risk premium
const THRESHOLD_HIGH = WEAR_MULTIPLIER * DRIVER_PREMIUM_MULTIPLIER; // ×1.68 of fuel cost/seat
const THRESHOLD_VERY_HIGH = 2.5;    // ×2.5 of fuel cost/seat

function EarningsCalculator({
  pricePerSeat,
  seatsTotal,
  originCity,
  destinationCity,
  onSuggestedPrice,
  onMaxReasonablePrice,
}: {
  pricePerSeat: number;
  seatsTotal: number;
  originCity: string;
  destinationCity: string;
  onSuggestedPrice?: (price: number) => void;
  onMaxReasonablePrice?: (price: number) => void;
}) {
  const [fuelType, setFuelType] = useState<FuelType>("gasoline95");
  const [consumption, setConsumption] = useState<string>("7.0"); // L/100km
  const [prices, setPrices] = useState<FuelPrices>(DEFAULT_PRICES);
  const [pricesLoading, setPricesLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    api.fuel.prices()
      .then(setPrices)
      .catch(() => { /* keep defaults */ })
      .finally(() => setPricesLoading(false));
  }, []);

  // Update consumption default when fuel type changes
  useEffect(() => {
    setConsumption(String(DEFAULT_CONSUMPTION[fuelType]));
  }, [fuelType]);

  const originCoord = SPANISH_CITIES_BY_NAME[originCity];
  const destCoord = SPANISH_CITIES_BY_NAME[destinationCity];

  const straightKm = originCoord && destCoord
    ? haversineKm(originCoord.lat, originCoord.lng, destCoord.lat, destCoord.lng)
    : null;
  const roadKm = straightKm ? Math.round(straightKm * ROAD_FACTOR) : null;

  const consumptionNum = parseFloat(consumption);
  const pricePerLitre = prices[fuelType];

  const fuelCost = roadKm && !isNaN(consumptionNum) && consumptionNum > 0
    ? Math.round((roadKm * consumptionNum / 100) * pricePerLitre * 100) / 100
    : null;

  const grossEarnings = pricePerSeat * seatsTotal;
  const netEarnings = fuelCost !== null ? grossEarnings - fuelCost : null;
  const coveragePercent = fuelCost && fuelCost > 0
    ? Math.min(100, Math.round((grossEarnings / fuelCost) * 100))
    : null;

  // Emit suggested price: fuel cost split equally + 10% margin, rounded to nearest €
  useEffect(() => {
    if (!onSuggestedPrice || !fuelCost || seatsTotal < 1) return;
    const suggested = Math.max(5, Math.round((fuelCost / seatsTotal) * 1.1));
    onSuggestedPrice(suggested);
  }, [fuelCost, seatsTotal, onSuggestedPrice]);

  // Emit max reasonable price: fuel/seat × wear × driver premium, rounded up
  useEffect(() => {
    if (!onMaxReasonablePrice || !fuelCost || seatsTotal < 1) return;
    const maxReasonable = Math.round((fuelCost / seatsTotal) * THRESHOLD_HIGH);
    onMaxReasonablePrice(Math.max(maxReasonable, 5));
  }, [fuelCost, seatsTotal, onMaxReasonablePrice]);

  return (
    <div className="border-2 border-cr-primary/30 bg-cr-primary/[0.04] p-4 space-y-4">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
        Calculadora de ganancias
      </p>

      <div className="space-y-2">
        <div className="flex items-baseline gap-3 flex-wrap">
          <p className="font-mono text-3xl text-cr-primary leading-none">
            €{grossEarnings.toFixed(0)}
          </p>
          <p className="font-sans text-xs text-cr-text-muted">
            brutos · {seatsTotal} pasajero{seatsTotal === 1 ? "" : "s"} a €{pricePerSeat}/asiento
          </p>
        </div>
        {netEarnings !== null && (
          <div className="flex items-baseline gap-3 flex-wrap">
            <p className={`font-mono text-xl leading-none ${netEarnings < 0 ? "text-cr-secondary" : "text-cr-text"}`}>
              €{netEarnings.toFixed(0)}
            </p>
            <p className="font-sans text-xs text-cr-text-muted">
              netos · después de €{fuelCost!.toFixed(0)} de combustible
            </p>
          </div>
        )}
      </div>

      {/* Fuel inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
            Combustible
          </label>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value as FuelType)}
            className="w-full bg-cr-bg border border-cr-border px-2 py-1.5 font-mono text-xs text-cr-text focus:outline-none focus:border-cr-primary [color-scheme:dark]"
          >
            <option value="gasoline95">Gasolina 95</option>
            <option value="diesel">Diésel</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
            Consumo (L/100km)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            step="0.1"
            value={consumption}
            onChange={(e) => setConsumption(e.target.value)}
            className="w-full bg-cr-bg border border-cr-border px-2 py-1.5 font-mono text-xs text-cr-text focus:outline-none focus:border-cr-primary"
          />
        </div>
      </div>

      {/* Result */}
      {fuelCost !== null ? (
        <div className="space-y-1">
          <p className="font-mono text-xs text-cr-text-muted">
            Combustible estimado:{" "}
            <span className="text-cr-text">€{fuelCost.toFixed(2)}</span>
            <span className="text-cr-text-dim">
              {" "}(≈{roadKm} km · {consumptionNum}L/100km · {pricesPerLitreLabel(pricePerLitre, pricesLoading)})
            </span>
          </p>
          {coveragePercent !== null && (
            <p className="font-mono text-xs text-cr-text-muted">
              Cubre{" "}
              <span className={`font-semibold ${coveragePercent >= 100 ? "text-cr-primary" : coveragePercent >= 60 ? "text-cr-primary/70" : "text-cr-secondary"}`}>
                {coveragePercent}%
              </span>
              {" "}del coste de combustible
              {coveragePercent >= 100 && " — ¡ya sacas beneficio!"}
            </p>
          )}
        </div>
      ) : (originCity && destinationCity) ? (
        <p className="font-mono text-xs text-cr-text-dim">
          Selecciona origen y destino para ver la estimación.
        </p>
      ) : null}

      {prices.updatedAt && (
        <p className="font-mono text-[10px] text-cr-text-dim">
          Precio {fuelType === "gasoline95" ? "G95" : "Diésel"}: {pricePerLitre.toFixed(3)} €/L · Datos MITECO
        </p>
      )}
    </div>
  );
}

function pricesPerLitreLabel(price: number, loading: boolean): string {
  if (loading) return "cargando…";
  return `${price.toFixed(3)} €/L`;
}

function PriceWarning({
  pricePerSeat,
  suggestedPrice,
  maxReasonablePrice,
  onApplySuggested,
}: {
  pricePerSeat: number;
  suggestedPrice: number | null;
  maxReasonablePrice: number | null;
  onApplySuggested: () => void;
}) {
  // No data yet — just show the basic suggested price hint
  if (maxReasonablePrice === null || suggestedPrice === null) {
    return suggestedPrice !== null && pricePerSeat !== suggestedPrice ? (
      <button
        type="button"
        onClick={onApplySuggested}
        className="mt-1.5 font-mono text-[11px] text-cr-primary hover:underline text-left"
      >
        Sugerido: €{suggestedPrice} (basado en combustible) → aplicar
      </button>
    ) : suggestedPrice !== null ? (
      <p className="mt-1.5 font-mono text-[11px] text-cr-primary/70">
        ✓ Usando el precio sugerido por combustible
      </p>
    ) : null;
  }

  const fuelCostPerSeat = suggestedPrice / 1.1; // reverse the 10% margin
  const ratio = fuelCostPerSeat > 0 ? pricePerSeat / fuelCostPerSeat : 0;

  if (ratio > THRESHOLD_VERY_HIGH) {
    return (
      <div className="mt-2 border border-cr-secondary/40 bg-cr-secondary/5 px-3 py-2 space-y-1">
        <p className="font-sans text-[11px] font-semibold text-cr-secondary uppercase tracking-[0.1em]">
          Precio muy por encima del coste
        </p>
        <p className="font-mono text-[11px] text-cr-text-muted leading-relaxed">
          €{pricePerSeat}/asiento es más de {THRESHOLD_VERY_HIGH}× el coste de combustible
          estimado. La LOTT prohíbe cobrar con ánimo de lucro en viajes compartidos entre
          particulares. Considera bajar a{" "}
          <button
            type="button"
            onClick={onApplySuggested}
            className="text-cr-primary underline underline-offset-2"
          >
            €{suggestedPrice}
          </button>{" "}
          o como máximo €{maxReasonablePrice}.
        </p>
      </div>
    );
  }

  if (ratio > THRESHOLD_HIGH) {
    return (
      <div className="mt-2 border border-amber-500/30 bg-amber-500/5 px-3 py-2 space-y-1">
        <p className="font-sans text-[11px] font-semibold text-amber-400 uppercase tracking-[0.1em]">
          Precio alto — repasa que sea razonable
        </p>
        <p className="font-mono text-[11px] text-cr-text-muted leading-relaxed">
          €{pricePerSeat}/asiento cubre el combustible + un margen para desgaste y tu tiempo.
          Recuerda que la plataforma es de compartición de costes, no de transporte con
          beneficio.
        </p>
      </div>
    );
  }

  if (pricePerSeat === suggestedPrice) {
    return (
      <p className="mt-1.5 font-mono text-[11px] text-cr-primary/70">
        ✓ Usando el precio sugerido por combustible
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={onApplySuggested}
      className="mt-1.5 font-mono text-[11px] text-cr-primary hover:underline text-left"
    >
      Sugerido: €{suggestedPrice} (basado en combustible) → aplicar
    </button>
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

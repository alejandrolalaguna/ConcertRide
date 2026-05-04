import { useState, useEffect } from "react";
import { Bell, BellRing, Users, ChevronDown } from "lucide-react";

interface Props {
  festivalSlug: string;
  festivalName: string;
  originCities: string[];
  defaultCity?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export function DemandSignalWidget({ festivalSlug, festivalName, originCities, defaultCity }: Props) {
  const [selectedCity, setSelectedCity] = useState(defaultCity ?? originCities[0] ?? "");
  const [email, setEmail] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    if (!selectedCity) return;
    fetch(`${API_BASE}/api/alerts/festivals/${festivalSlug}/demand/count?origin_city=${encodeURIComponent(selectedCity)}`)
      .then((r) => r.json())
      .then((d: { count: number }) => setCount(d.count))
      .catch(() => {});
  }, [festivalSlug, selectedCity]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCity) return;
    setStatus("loading");
    try {
      const res = await fetch(`${API_BASE}/api/alerts/festivals/${festivalSlug}/demand`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin_city: selectedCity, email: email || undefined }),
        credentials: "include",
      });
      if (res.ok) {
        setStatus("success");
        setRegistered(true);
        setCount((c) => (c ?? 0) + 1);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (registered) {
    return (
      <div className="rounded-xl border border-cr-primary/30 bg-cr-primary/5 p-4 flex items-start gap-3">
        <BellRing className="text-cr-primary shrink-0 mt-0.5" size={18} />
        <div>
          <p className="text-sm font-semibold text-cr-text">¡Apuntado! Te avisamos cuando haya viaje desde {selectedCity}.</p>
          {count !== null && count > 1 && (
            <p className="text-xs text-cr-text-muted mt-1">
              <Users size={11} className="inline mr-1" />
              {count} personas esperando viaje desde {selectedCity} a {festivalName}.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/3 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <Bell className="text-cr-primary shrink-0 mt-0.5" size={18} />
        <div>
          <h3 className="text-sm font-semibold text-cr-text">¿No encuentras viaje? Avísame cuando haya.</h3>
          {count !== null && count > 0 && (
            <p className="text-xs text-cr-text-muted mt-0.5">
              <Users size={11} className="inline mr-1" />
              {count} {count === 1 ? "persona busca" : "personas buscan"} viaje desde {selectedCity} a {festivalName}
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full appearance-none rounded-lg border border-white/20 bg-cr-bg px-3 py-2 text-sm text-cr-text pr-8"
            >
              {originCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-cr-text-muted pointer-events-none" />
          </div>
          <input
            type="email"
            placeholder="tu@email.com (opcional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-white/20 bg-cr-bg px-3 py-2 text-sm text-cr-text placeholder:text-cr-text-muted"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading" || !selectedCity}
          className="w-full rounded-lg bg-cr-primary px-4 py-2.5 text-sm font-bold text-black hover:bg-cr-primary/90 disabled:opacity-50 transition-colors"
        >
          {status === "loading" ? "Guardando…" : `Avísame cuando haya viaje desde ${selectedCity}`}
        </button>
        {status === "error" && (
          <p className="text-xs text-red-400">Error al guardar. Inténtalo de nuevo.</p>
        )}
      </form>
    </div>
  );
}

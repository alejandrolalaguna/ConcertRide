import { useEffect, useState } from "react";
import type { AnticipationSummary, AnticipationStatus } from "@concertride/types";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { track } from "@/lib/observability";
import { CrewAvatars } from "./CrewAvatars";

interface Props {
  concertId: string;
  // The concert's date — drives the countdown numbers.
  date: string;
  // Optional title used in the optimistic copy ("Vas a Mad Cool 🎉").
  artist?: string;
}

function timeUntil(target: string): { days: number; hours: number } | null {
  const t = new Date(target).getTime();
  if (!Number.isFinite(t)) return null;
  const now = Date.now();
  if (t <= now) return null;
  const diff = t - now;
  const days = Math.floor(diff / (24 * 3600 * 1000));
  const hours = Math.floor((diff - days * 24 * 3600 * 1000) / (3600 * 1000));
  return { days, hours };
}

export function AnticipationStrip({ concertId, date, artist }: Props) {
  const { user } = useSession();
  const [summary, setSummary] = useState<AnticipationSummary | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const countdown = timeUntil(date);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await api.anticipations.summary(concertId);
        if (!cancelled) setSummary(res);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [concertId]);

  const total = (summary?.going_count ?? 0) + (summary?.maybe_count ?? 0);
  const userStatus: AnticipationStatus | null = summary?.user_status ?? null;
  const crewAttending = summary?.crew_attending ?? [];

  async function setStatus(status: AnticipationStatus) {
    if (!user) {
      window.location.href = `/login?next=/concerts/${encodeURIComponent(concertId)}`;
      return;
    }
    setSubmitting(true);
    const prev = summary;
    const optimistic: AnticipationSummary = summary
      ? {
          ...summary,
          user_status: status,
          going_count:
            summary.going_count +
            (status === "going" ? 1 : 0) -
            (summary.user_status === "going" ? 1 : 0),
          maybe_count:
            summary.maybe_count +
            (status === "maybe" ? 1 : 0) -
            (summary.user_status === "maybe" ? 1 : 0),
        }
      : { going_count: status === "going" ? 1 : 0, maybe_count: status === "maybe" ? 1 : 0, user_status: status, preview: [], crew_attending: [] };
    setSummary(optimistic);
    try {
      await api.anticipations.set(concertId, status);
      track("anticipation_set", { concert_id: concertId, status });
      const fresh = await api.anticipations.summary(concertId);
      setSummary(fresh);
    } catch {
      setSummary(prev);
    } finally {
      setSubmitting(false);
    }
  }

  async function clearStatus() {
    if (!user) return;
    setSubmitting(true);
    const prev = summary;
    if (summary) {
      setSummary({
        ...summary,
        user_status: null,
        going_count: summary.going_count - (summary.user_status === "going" ? 1 : 0),
        maybe_count: summary.maybe_count - (summary.user_status === "maybe" ? 1 : 0),
      });
    }
    try {
      await api.anticipations.clear(concertId);
      track("anticipation_cleared", { concert_id: concertId });
    } catch {
      setSummary(prev);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      aria-label="Asistencia"
      className="border-y border-cr-border bg-gradient-to-r from-cr-bg via-cr-surface-2 to-cr-bg px-5 py-5 sm:px-8"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          {countdown ? (
            <p className="font-display text-2xl tracking-tight text-cr-text leading-none">
              <span className="text-cr-primary">{countdown.days}</span>
              <span className="ml-1 text-sm font-mono uppercase tracking-[0.12em] text-cr-text-muted">
                días{countdown.days === 0 && countdown.hours > 0 ? ` · ${countdown.hours}h` : ""}
              </span>
            </p>
          ) : (
            <p className="font-display text-lg text-cr-text-muted leading-none">Evento pasado</p>
          )}
          {/* Vertical separator */}
          <span aria-hidden="true" className="hidden sm:block w-px h-6 bg-cr-border flex-shrink-0" />
          <div className="flex items-center gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cr-text-muted">
              <span className="text-cr-text font-semibold">{summary?.going_count ?? 0}</span>{" "}van
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cr-text-muted">
              <span className="text-cr-text font-semibold">{summary?.maybe_count ?? 0}</span>{" "}interesados
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {crewAttending.length > 0 && (
            <CrewAvatars
              size="sm"
              people={crewAttending}
              label={`${crewAttending.length} de tu crew`}
            />
          )}
          {countdown && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => (userStatus === "going" ? clearStatus() : setStatus("going"))}
                className={`inline-flex h-9 items-center gap-1 px-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition ${
                  userStatus === "going"
                    ? "border-2 border-cr-primary bg-cr-primary text-cr-text-inverse shadow-[0_0_18px_rgb(212_247_0/0.35)]"
                    : "border-2 border-cr-border bg-cr-surface-2 text-cr-text hover:border-cr-primary"
                }`}
              >
                {userStatus === "going" ? "✓ Voy" : "Voy"}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => (userStatus === "maybe" ? clearStatus() : setStatus("maybe"))}
                className={`inline-flex h-9 items-center gap-1 px-4 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition ${
                  userStatus === "maybe"
                    ? "border-2 border-cr-secondary bg-cr-secondary text-white"
                    : "border-2 border-cr-border bg-cr-surface-2 text-cr-text hover:border-cr-secondary"
                }`}
              >
                {userStatus === "maybe" ? "✓ Quizá" : "Quizá"}
              </button>
            </div>
          )}
        </div>
      </div>
      {artist && total >= 5 && (
        <p className="mx-auto mt-2 max-w-5xl text-xs text-cr-text-muted">
          {total} personas se están organizando para {artist}.
        </p>
      )}
    </section>
  );
}

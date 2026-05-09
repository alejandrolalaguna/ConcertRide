import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ActivityEvent, ActivityScope } from "@concertride/types";
import { api } from "@/lib/api";

interface Props {
  scope?: ActivityScope;
  city?: string;
  concertId?: string;
  limit?: number;
  // Show pulse + "live" indicator above the feed.
  showPulse?: boolean;
  emptyMessage?: string;
  // Full-bleed layout vs inline card.
  layout?: "card" | "inline";
}

const KIND_VERB: Record<string, { emoji: string; copy: string }> = {
  ride_published: { emoji: "🚗", copy: "publicó un viaje" },
  ride_booked: { emoji: "🎟️", copy: "reservó plaza" },
  ride_completed: { emoji: "🏁", copy: "completó un viaje" },
  interest_added: { emoji: "🔥", copy: "se apuntó" },
  favorite_added: { emoji: "💚", copy: "marcó favorito" },
  crew_invited: { emoji: "🤝", copy: "invitó a su crew" },
  crew_accepted: { emoji: "👯", copy: "se unió a una crew" },
  music_updated: { emoji: "🎶", copy: "actualizó su música" },
  trip_memory_shared: { emoji: "📸", copy: "compartió un recuerdo" },
};

function relative(ts: string): string {
  const t = new Date(ts).getTime();
  if (!Number.isFinite(t)) return "";
  const diff = Date.now() - t;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}

function initials(name: string) {
  return name.trim().split(/\s+/).map((p) => p[0] ?? "").join("").slice(0, 2).toUpperCase() || "C";
}

export function LiveActivityFeed({
  scope = "all",
  city,
  concertId,
  limit = 12,
  showPulse = true,
  emptyMessage = "Las primeras conversaciones empiezan aquí.",
  layout = "card",
}: Props) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await api.activity.list({ scope, city, concert_id: concertId, limit });
        if (!cancelled) setEvents(res.events);
      } catch {
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    // Refresh every 60s for the homepage live feed feeling.
    const id = setInterval(() => {
      void (async () => {
        try {
          const res = await api.activity.list({ scope, city, concert_id: concertId, limit });
          if (!cancelled) setEvents(res.events);
        } catch {
          /* ignore */
        }
      })();
    }, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [scope, city, concertId, limit]);

  const wrapperClass = layout === "card"
    ? "border-2 border-cr-border bg-cr-surface-2"
    : "border-t border-cr-border";

  return (
    <section aria-label="Actividad en vivo" className={wrapperClass}>
      <header className="flex items-center justify-between border-b border-cr-border px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          {showPulse && (
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cr-primary opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cr-primary" />
            </span>
          )}
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-cr-text">
            En directo · {scope === "city" && city ? city : scope === "concert" ? "este evento" : "ConcertRide"}
          </h2>
        </div>
        <Link
          to="/feed"
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-cr-text-muted hover:text-cr-primary"
        >
          ver todo →
        </Link>
      </header>
      {loading ? (
        <ul className="divide-y divide-cr-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex animate-pulse items-center gap-3 px-4 py-3 sm:px-5">
              <span className="h-8 w-8 rounded-full bg-cr-surface-3" />
              <span className="h-3 flex-1 rounded bg-cr-surface-3" />
            </li>
          ))}
        </ul>
      ) : events.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <p className="font-display text-base text-cr-text">{emptyMessage}</p>
          <p className="mt-1 text-xs text-cr-text-muted">Publica un viaje o di "voy" en un evento.</p>
        </div>
      ) : (
        <ul className="divide-y divide-cr-border">
          {events.map((ev) => {
            const meta = KIND_VERB[ev.kind] ?? { emoji: "✨", copy: "hizo algo" };
            return (
              <li key={ev.id} className="group flex items-center gap-3 px-4 py-3 sm:px-5">
                {ev.actor_avatar ? (
                  <img
                    src={ev.actor_avatar}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-cr-border"
                    loading="lazy"
                  />
                ) : (
                  <span
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-cr-primary text-[11px] font-bold uppercase text-cr-text-inverse"
                    aria-hidden
                  >
                    {initials(ev.actor_name)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-cr-text">
                    <span className="font-bold">{ev.actor_name}</span>{" "}
                    <span className="text-cr-text-muted">{meta.copy}</span>
                    {ev.label && ev.label !== `${ev.actor_name} ${meta.copy}` ? (
                      <span className="text-cr-text-muted"> · {ev.label.replace(`${ev.actor_name} `, "")}</span>
                    ) : null}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-dim">
                    {meta.emoji} {relative(ev.created_at)}{ev.city ? ` · ${ev.city}` : ""}
                  </p>
                </div>
                {ev.concert_id && (
                  <Link
                    to={`/concerts/${ev.concert_id}`}
                    className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted hover:text-cr-primary sm:inline"
                  >
                    ver →
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

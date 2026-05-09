import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import type { Squad } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { useSession } from "@/lib/session";
import { CrewAvatars } from "@/components/CrewAvatars";
import { CountdownBadge } from "@/components/CountdownBadge";
import { PlaylistPanel } from "@/components/PlaylistPanel";

export default function SquadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: sessionLoading } = useSession();
  const [squad, setSquad] = useState<Squad | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useSeoMeta({
    title: squad ? `Squad: ${squad.name} · ConcertRide` : "Squad · ConcertRide",
    description: squad
      ? `Squad de carpooling para ${squad.concert.artist}: ${squad.members.length} ${squad.members.length === 1 ? "miembro" : "miembros"}, ${squad.rides.length} ${squad.rides.length === 1 ? "coche" : "coches"}.`
      : "Coordina con tu grupo: varios coches, una sola playlist.",
    canonical: id ? `${SITE_URL}/squads/${id}` : undefined,
    noindex: true,
  });

  useEffect(() => {
    if (!id) return;
    setSquad(null);
    setError(null);
    api.squads
      .get(id)
      .then(setSquad)
      .catch((err: unknown) => {
        if (err instanceof ApiError && (err.status === 404 || err.status === 403)) setError(String(err.status));
        else setError("load_failed");
      });
  }, [id]);

  if (!sessionLoading && !user) return <Navigate to={`/login?next=/squads/${id}`} replace />;

  if (error === "404") {
    return (
      <main className="min-h-dvh bg-cr-bg pt-14 px-6 text-center">
        <p className="mt-20 font-display text-2xl uppercase text-cr-text-muted">Squad no encontrado</p>
        <Link to="/concerts" className="mt-4 inline-block text-cr-primary underline">Volver a conciertos</Link>
      </main>
    );
  }
  if (error === "403") {
    return (
      <main className="min-h-dvh bg-cr-bg pt-14 px-6 text-center">
        <p className="mt-20 font-display text-2xl uppercase text-cr-text-muted">Squad privado</p>
        <p className="mt-2 text-sm text-cr-text-dim">Pide el enlace de invitación al organizador.</p>
      </main>
    );
  }
  if (!squad || sessionLoading) {
    return <main className="min-h-dvh bg-cr-bg pt-14 px-6"><p className="mt-20 text-center text-cr-text-muted">Cargando…</p></main>;
  }

  const isMember = !!user && squad.members.some((m) => m.user.id === user.id);
  const isOwner = !!user && squad.owner.id === user.id;
  const inviteUrl = typeof window !== "undefined"
    ? `${window.location.origin}/squads/join/${squad.invite_code}`
    : `${SITE_URL}/squads/join/${squad.invite_code}`;

  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  async function leave() {
    if (!confirm("¿Salir del squad?")) return;
    try {
      await api.squads.leave(squad!.id);
      window.location.href = "/concerts";
    } catch {
      /* ignore */
    }
  }

  return (
    <main id="main" className="min-h-dvh bg-cr-bg pt-14 text-cr-text">
      <header className="border-b border-cr-border px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cr-text-muted">
            Squad · {squad.visibility === "public" ? "abierto" : "privado"}
          </p>
          <h1 className="mt-2 font-display text-4xl uppercase leading-tight">{squad.name}</h1>
          <p className="mt-2 max-w-prose text-sm text-cr-text-muted">
            🎤 <Link to={`/concerts/${squad.concert.id}`} className="underline hover:text-cr-primary">{squad.concert.artist}</Link> · {squad.concert.venue.city}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <CountdownBadge target={squad.concert.date} size="sm" />
            {squad.vibe_tags.map((t) => (
              <span key={t} className="border border-cr-border-mid px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-cr-text-muted">
                {t}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
        {(isMember || isOwner) && (
          <section className="border-2 border-cr-primary bg-cr-primary/5 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cr-text-muted">
              Enlace de invitación
            </p>
            <div className="mt-2 flex items-center gap-3">
              <code className="flex-1 truncate bg-cr-surface px-3 py-2 font-mono text-xs text-cr-text">
                {inviteUrl}
              </code>
              <button
                type="button"
                onClick={copyInvite}
                className="border-2 border-cr-primary bg-cr-primary px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-cr-text-inverse"
              >
                {copied ? "✓ Copiado" : "Copiar"}
              </button>
            </div>
          </section>
        )}

        <section>
          <h2 className="border-b border-cr-border pb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-cr-text-muted">
            Miembros · {squad.members.length}
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {squad.members.map((m) => (
              <li
                key={m.user.id}
                className="flex items-center gap-3 border-2 border-cr-border bg-cr-surface-2 p-3"
              >
                <CrewAvatars people={[{ id: m.user.id, name: m.user.name, avatar_url: m.user.avatar_url }]} size="md" clickable />
                <div className="min-w-0 flex-1">
                  <Link to={`/drivers/${m.user.id}`} className="font-display text-base hover:text-cr-primary">
                    {m.user.name}
                  </Link>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted">
                    {m.role === "owner" ? "👑 organizador" : m.role === "driver" ? "🚗 conductor" : m.role === "looking" ? "🪧 busca coche" : "🎟️ pasajero"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {squad.rides.length > 0 && (
          <section>
            <h2 className="border-b border-cr-border pb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-cr-text-muted">
              Coches · {squad.rides.length}
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {squad.rides.map((r) => (
                <li key={r.id}>
                  <Link
                    to={`/rides/${r.id}`}
                    className="block border-2 border-cr-border bg-cr-surface-2 p-3 hover:border-cr-primary"
                  >
                    <p className="font-display text-base uppercase">
                      {r.origin_city} → {r.concert.venue.city}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-muted">
                      {r.driver.name} · {r.seats_left}/{r.seats_total} libres · €{r.price_per_seat}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(isMember || isOwner) && <PlaylistPanel scope={{ squad_id: squad.id }} heading="Playlist del squad" />}

        {(isMember || isOwner) && !isOwner && (
          <section>
            <button
              type="button"
              onClick={leave}
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted hover:text-cr-secondary"
            >
              Salir del squad
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

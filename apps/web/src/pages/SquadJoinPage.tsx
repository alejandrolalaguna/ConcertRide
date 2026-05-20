import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import type { Squad } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { useSession } from "@/lib/session";
import { CrewAvatars } from "@/components/CrewAvatars";
import { CountdownBadge } from "@/components/CountdownBadge";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";

export default function SquadJoinPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user, loading: sessionLoading } = useSession();
  const [squad, setSquad] = useState<Squad | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  useSeoMeta({
    title: squad ? `Únete: ${squad.name} · ConcertRide` : "Unirme al squad · ConcertRide",
    description: squad ? `Te invitan al squad para ${squad.concert.artist}.` : "Invitación a un squad de carpooling.",
    canonical: code ? `${SITE_URL}/squads/join/${code}` : undefined,
    noindex: true,
  });

  useEffect(() => {
    if (!code) return;
    api.squads
      .byInvite(code)
      .then(setSquad)
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 404) setError("not_found");
        else setError("load_failed");
      });
  }, [code]);

  if (!sessionLoading && !user) return <Navigate to={`/login?next=/squads/join/${code}`} replace />;

  async function join() {
    if (!squad || !code) return;
    setJoining(true);
    try {
      await api.squads.join({ invite_code: code });
      trackEvent(ANALYTICS_EVENTS.CREW_JOINED, {
        squad_id: squad.id,
        concert_id: squad.concert.id,
        via: "invite_link",
      });
      navigate(`/squads/${squad.id}`);
    } catch {
      setError("join_failed");
    } finally {
      setJoining(false);
    }
  }

  if (error === "not_found") {
    return (
      <main className="min-h-dvh bg-cr-bg pt-14 px-6 text-center">
        <p className="mt-20 font-display text-2xl uppercase text-cr-text-muted">Invitación no válida</p>
        <p className="mt-2 text-sm text-cr-text-dim">Quizá el squad ya no existe o el enlace caducó.</p>
        <Link to="/concerts" className="mt-4 inline-block text-cr-primary underline">Ver conciertos</Link>
      </main>
    );
  }
  if (!squad) {
    return <main className="min-h-dvh bg-cr-bg pt-14 px-6"><p className="mt-20 text-center text-cr-text-muted">Cargando…</p></main>;
  }

  const isMember = !!user && squad.members.some((m) => m.user.id === user.id);

  return (
    <main id="main" className="min-h-dvh bg-cr-bg pt-14 text-cr-text">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cr-text-muted">
          Invitación
        </p>
        <h1 className="mt-2 font-display text-4xl uppercase leading-tight">
          Te invitan a {squad.name}
        </h1>
        <p className="mt-2 max-w-prose text-sm text-cr-text-muted">
          Squad para <strong className="text-cr-text">{squad.concert.artist}</strong> en {squad.concert.venue.city}.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <CountdownBadge target={squad.concert.date} />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted">
            {squad.members.length} {squad.members.length === 1 ? "miembro" : "miembros"} · {squad.rides.length} {squad.rides.length === 1 ? "coche" : "coches"}
          </span>
        </div>
        {squad.members.length > 0 && (
          <div className="mt-4">
            <CrewAvatars
              size="md"
              people={squad.members.slice(0, 8).map((m) => ({
                id: m.user.id,
                name: m.user.name,
                avatar_url: m.user.avatar_url,
              }))}
            />
          </div>
        )}
        <div className="mt-8 flex gap-3">
          {isMember ? (
            <Link
              to={`/squads/${squad.id}`}
              className="border-2 border-cr-primary bg-cr-primary px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cr-text-inverse"
            >
              Ya estás dentro · Abrir squad
            </Link>
          ) : (
            <button
              type="button"
              onClick={join}
              disabled={joining}
              className="border-2 border-cr-primary bg-cr-primary px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cr-text-inverse disabled:opacity-40"
            >
              {joining ? "Uniéndome…" : "Unirme al squad"}
            </button>
          )}
          <Link
            to={`/concerts/${squad.concert.id}`}
            className="border-2 border-cr-border px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cr-text-muted hover:border-cr-primary hover:text-cr-primary"
          >
            Ver evento
          </Link>
        </div>
        {error === "join_failed" && (
          <p className="mt-4 font-mono text-xs text-cr-secondary">No se pudo unir. Inténtalo de nuevo.</p>
        )}
      </div>
    </main>
  );
}

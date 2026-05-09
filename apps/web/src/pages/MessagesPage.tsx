import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, Lock, Users, ArrowRight } from "lucide-react";
import type { ConversationPreview } from "@concertride/types";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { initials } from "@/lib/format";

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function ConvRow({ conv }: { conv: ConversationPreview }) {
  const isDM = conv.kind === "dm";
  const isRide = conv.kind === "ride";

  const to = isDM
    ? `/mensajes/${conv.other_user!.id}`
    : isRide
    ? `/rides/${conv.ride_id}`
    : `/concerts/${conv.concert_id}`;

  const label = isDM
    ? conv.other_user!.name
    : isRide
    ? conv.ride_label ?? "Viaje"
    : conv.concert_label ?? "Concierto";

  const avatar = isDM ? initials(conv.other_user!.name) : isRide ? "🚗" : "🎵";
  const isEmoji = !isDM;

  const kindLabel = isDM
    ? { text: "Privado", color: "text-amber-400 border-amber-400/30 bg-amber-400/10" }
    : isRide
    ? { text: "Viaje · Privado", color: "text-amber-400 border-amber-400/30 bg-amber-400/10" }
    : { text: "Concierto · Público", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" };

  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-3 hover:bg-cr-surface-2 border-b border-cr-border transition-colors group"
    >
      <div className="flex-shrink-0 w-10 h-10 bg-cr-surface-2 border border-cr-border flex items-center justify-center font-display text-sm text-cr-primary">
        {isEmoji ? <span>{avatar}</span> : avatar}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="font-sans font-semibold text-sm text-cr-text truncate">{label}</span>
          <span className="flex-shrink-0 font-mono text-[10px] text-cr-text-dim">
            {formatRelativeTime(conv.last_message_at)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wide border px-1.5 py-0.5 flex-shrink-0 ${kindLabel.color}`}
          >
            {isDM || isRide ? <Lock size={8} /> : <Users size={8} />}
            {kindLabel.text}
          </span>
          <p className="font-mono text-[11px] text-cr-text-muted truncate">{conv.last_message_body}</p>
        </div>
      </div>

      <ArrowRight size={14} className="flex-shrink-0 text-cr-text-dim group-hover:text-cr-primary transition-colors" />
    </Link>
  );
}

export default function MessagesPage() {
  const { user, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useSeoMeta({
    title: "Mensajes — ConcertRide",
    description: "Tus conversaciones privadas, chats de viajes y chats de conciertos en ConcertRide.",
    noindex: true,
  });

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      navigate(`/login?next=${encodeURIComponent("/mensajes")}`);
      return;
    }
    api.messages
      .listConversations()
      .then((res) => setConversations(res.conversations))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user, sessionLoading, navigate]);

  return (
    <main id="main" className="max-w-2xl mx-auto px-4 pt-20 pb-16">
      <header className="mb-6 flex items-baseline justify-between gap-3">
        <div className="flex items-center gap-3">
          <MessageSquare size={20} className="text-cr-primary" />
          <h1 className="font-display text-xl uppercase tracking-wide">Mensajes</h1>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-cr-text-dim uppercase">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Público
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            Privado
          </span>
        </div>
      </header>

      <div className="border border-cr-border bg-cr-surface">
        {loading && (
          <div className="p-8 text-center font-mono text-xs text-cr-text-dim animate-pulse">
            Cargando conversaciones…
          </div>
        )}
        {!loading && error && (
          <div className="p-8 text-center font-mono text-xs text-cr-secondary">
            Error al cargar las conversaciones.
          </div>
        )}
        {!loading && !error && conversations.length === 0 && (
          <div className="p-10 text-center space-y-3">
            <p className="font-mono text-xs text-cr-text-dim">
              Todavía no tienes conversaciones.
            </p>
            <p className="font-mono text-[10px] text-cr-text-dim">
              Únete al chat de un concierto, reserva un viaje o envía un mensaje privado a otro usuario.
            </p>
            <Link
              to="/concerts"
              className="inline-flex items-center justify-center bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-xs border-2 border-black px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
            >
              Explorar conciertos
            </Link>
          </div>
        )}
        {!loading && !error && conversations.length > 0 && (
          <ul>
            {conversations.map((conv, i) => (
              <li key={i}>
                <ConvRow conv={conv} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-4 font-mono text-[10px] text-cr-text-dim text-center">
        Los mensajes privados son solo visibles para ti y el destinatario.
        Los chats de concierto son públicos para usuarios registrados.
      </p>
    </main>
  );
}

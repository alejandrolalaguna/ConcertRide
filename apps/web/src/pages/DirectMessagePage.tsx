import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import type { DirectMessage, MessageKind, User } from "@concertride/types";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { initials } from "@/lib/format";
import { ChatPanel } from "@/components/ChatPanel";

const POLL_MS = 5000;
const MAX_BACKOFF_MS = 60_000;

// Adapts DirectMessage[] to Message[] shape for ChatPanel reuse
function toMessages(dms: DirectMessage[]): import("@concertride/types").Message[] {
  return dms.map((dm) => ({
    id: dm.id,
    ride_id: null,
    concert_id: null,
    user_id: dm.sender_id,
    user: dm.sender,
    kind: dm.kind,
    body: dm.body,
    attachment_url: dm.attachment_url,
    created_at: dm.created_at,
  }));
}

export default function DirectMessagePage() {
  const { user, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const { userId: otherUserId } = useParams<{ userId: string }>();

  const [otherUser, setOtherUser] = useState<Omit<User, "email"> | null>(null);
  const [dms, setDMs] = useState<DirectMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const backoffRef = useRef(POLL_MS);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useSeoMeta({
    title: otherUser ? `Mensaje privado a ${otherUser.name} — ConcertRide` : "Mensaje privado — ConcertRide",
    description: "Conversación privada entre usuarios de ConcertRide.",
    noindex: true,
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!sessionLoading && !user) {
      navigate(`/login?next=${encodeURIComponent(`/mensajes/${otherUserId}`)}`);
    }
  }, [user, sessionLoading, navigate, otherUserId]);

  // Load other user profile
  useEffect(() => {
    if (!otherUserId) return;
    api.users.get(otherUserId).then(setOtherUser).catch(() => setLoadError(true));
  }, [otherUserId]);

  const fetchMessages = useCallback(async () => {
    if (!user || !otherUserId) return;
    try {
      const res = await api.messages.listDM(otherUserId);
      setDMs(res.messages);
    } catch {
      // keep showing existing messages
    } finally {
      setLoading(false);
    }
  }, [user, otherUserId]);

  // Initial load + polling
  useEffect(() => {
    if (!user || !otherUserId) return;

    mountedRef.current = true;
    backoffRef.current = POLL_MS;

    const schedule = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        if (!mountedRef.current || document.hidden) {
          backoffRef.current = POLL_MS;
          schedule();
          return;
        }
        try {
          await fetchMessages();
          backoffRef.current = POLL_MS;
        } catch {
          backoffRef.current = Math.min(backoffRef.current * 2, MAX_BACKOFF_MS);
        }
        if (mountedRef.current) schedule();
      }, backoffRef.current);
    };

    void fetchMessages();
    schedule();

    const onVisible = () => {
      if (!document.hidden && mountedRef.current) {
        if (timerRef.current) clearTimeout(timerRef.current);
        backoffRef.current = POLL_MS;
        void fetchMessages();
        schedule();
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [fetchMessages, user, otherUserId]);

  async function send(body: string, kind?: MessageKind, attachment_url?: string) {
    if (!otherUserId) return;
    const msg = await api.messages.postDM(otherUserId, { body, kind, attachment_url });
    setDMs((prev) => [...prev, msg]);
  }

  if (sessionLoading) return null;
  if (!user) return null;

  return (
    <main id="main" className="max-w-2xl mx-auto px-4 pt-20 pb-16">
      {/* Header */}
      <header className="mb-5 flex items-center gap-3">
        <Link
          to="/mensajes"
          className="flex items-center justify-center w-8 h-8 border border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary transition-colors"
          aria-label="Volver a mensajes"
        >
          <ArrowLeft size={14} />
        </Link>

        {otherUser && (
          <div
            aria-hidden="true"
            className="w-9 h-9 bg-cr-surface-2 border border-cr-border flex items-center justify-center font-display text-sm text-cr-primary flex-shrink-0"
          >
            {initials(otherUser.name)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-sm uppercase tracking-wide text-cr-text truncate">
              {otherUser ? otherUser.name : "…"}
            </h1>
            <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wide border border-amber-400/30 bg-amber-400/10 text-amber-400 px-1.5 py-0.5 flex-shrink-0">
              <Lock size={8} /> Privado
            </span>
          </div>
          {otherUser && (
            <Link
              to={`/drivers/${otherUser.id}`}
              className="font-mono text-[10px] text-cr-text-dim hover:text-cr-primary transition-colors"
            >
              Ver perfil →
            </Link>
          )}
        </div>
      </header>

      {loadError ? (
        <div className="border border-dashed border-cr-border p-8 text-center font-mono text-xs text-cr-secondary">
          No se pudo cargar esta conversación.
        </div>
      ) : (
        <div className="space-y-3">
          <ChatPanel
            messages={toMessages(dms)}
            loading={loading}
            forbidden={false}
            currentUserId={user.id}
            onSend={send}
          />
          <p className="font-mono text-[10px] text-cr-text-dim text-center">
            Este mensaje privado solo lo ven tú y {otherUser?.name ?? "el destinatario"}.
          </p>
        </div>
      )}
    </main>
  );
}

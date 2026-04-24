import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Message, MessageKind } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { ChatPanel } from "./ChatPanel";

interface Props {
  concertId: string;
  artist: string;
}

const POLL_MS = 5000;
const MAX_BACKOFF_MS = 60_000;

// Public concert chat — any signed-in user can read and post, no ride booking
// required. This turns the concert page into a shared hub for fans going to
// the same show and drives SEO + repeat visits.
export function ConcertChatSection({ concertId, artist }: Props) {
  const { user } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  const backoffRef = useRef(POLL_MS);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const fetchMessages = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.messages.listConcertChat(concertId);
      setMessages(res.messages);
      setForbidden(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) setForbidden(true);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [concertId, user]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

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
  }, [fetchMessages, user]);

  async function send(body: string, kind?: MessageKind, attachment_url?: string) {
    const msg = await api.messages.postConcertChat(concertId, { body, kind, attachment_url });
    setMessages((prev) => [...prev, msg]);
  }

  return (
    <section aria-labelledby="concert-chat-title" className="space-y-4">
      <header className="flex items-baseline justify-between gap-3">
        <h2 id="concert-chat-title" className="font-display text-sm uppercase tracking-wide text-cr-text-muted">
          Chat del concierto
        </h2>
        <span className="font-mono text-[10px] text-cr-text-dim uppercase">Abierto a todos los fans</span>
      </header>

      {!user ? (
        <div className="border border-dashed border-cr-border p-6 text-center space-y-3">
          <p className="font-sans text-sm text-cr-text-muted">
            Inicia sesión para unirte al chat con otros fans de {artist}.
          </p>
          <Link
            to={`/login?next=${encodeURIComponent(`/concerts/${concertId}`)}`}
            className="inline-flex items-center justify-center bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-5 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
          >
            Entrar
          </Link>
        </div>
      ) : (
        <ChatPanel
          messages={messages}
          loading={loading}
          forbidden={forbidden}
          currentUserId={user.id}
          onSend={(body, kind, attachment_url) => send(body, kind, attachment_url)}
        />
      )}
    </section>
  );
}

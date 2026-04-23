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

// Public concert chat — any signed-in user can read and post, no ride booking
// required. This turns the concert page into a shared hub for fans going to
// the same show and drives SEO + repeat visits.
export function ConcertChatSection({ concertId, artist }: Props) {
  const { user } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.messages.listConcertChat(concertId);
      setMessages(res.messages);
      setForbidden(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) setForbidden(true);
    } finally {
      setLoading(false);
    }
  }, [concertId, user]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    void fetchMessages();
    intervalRef.current = setInterval(fetchMessages, POLL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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

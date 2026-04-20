import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import type { Message } from "@concertride/types";
import { initials } from "@/lib/format";

interface Props {
  messages: Message[];
  loading: boolean;
  forbidden: boolean;
  currentUserId: string;
  onSend: (body: string) => Promise<void>;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

export function ChatPanel({ messages, loading, forbidden, currentUserId, onSend }: Props) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    setSendError("");
    try {
      await onSend(text);
      setDraft("");
    } catch {
      setSendError("No se pudo enviar. Inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  }

  if (forbidden) {
    return (
      <div className="border border-dashed border-cr-border p-6 text-center">
        <p className="font-mono text-xs text-cr-text-dim">
          Solo los viajeros confirmados pueden ver este chat.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-cr-border bg-cr-surface">
      <div className="flex-1 max-h-80 overflow-y-auto p-4 space-y-3 bg-cr-bg font-mono text-xs">
        {loading && (
          <p className="text-cr-text-dim animate-pulse">Cargando mensajes…</p>
        )}
        {!loading && messages.length === 0 && (
          <p className="text-cr-text-dim">Nadie ha escrito todavía. Sé el primero.</p>
        )}
        {messages.map((msg) => {
          const isOwn = msg.user_id === currentUserId;
          return (
            <div key={msg.id} className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
              <div
                aria-hidden="true"
                className="w-7 h-7 flex-shrink-0 bg-cr-surface-2 border border-cr-border flex items-center justify-center text-[10px] text-cr-primary font-display"
              >
                {initials(msg.user.name)}
              </div>
              <div className={`max-w-[75%] space-y-0.5 ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                <div className={`flex items-baseline gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                  <span className="text-[10px] text-cr-text-muted">{isOwn ? "Tú" : msg.user.name}</span>
                  <span className="text-[10px] text-cr-text-dim">{formatTime(msg.created_at)}</span>
                </div>
                <p
                  className={`px-3 py-2 text-xs leading-snug break-words ${
                    isOwn
                      ? "bg-cr-primary text-black"
                      : "bg-cr-surface border border-cr-border text-cr-text"
                  }`}
                >
                  {msg.body}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-cr-border p-3"
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 280))}
          placeholder="Escribe un mensaje…"
          disabled={sending}
          className="flex-1 bg-cr-bg border border-cr-border px-3 py-2 font-mono text-xs text-cr-text placeholder:text-cr-text-dim focus:outline-none focus:border-cr-primary transition-colors"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending}
          aria-label="Enviar mensaje"
          className="flex items-center justify-center w-9 h-9 bg-cr-primary text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Send size={14} />
        </button>
      </form>

      {sendError && (
        <p className="font-mono text-[10px] text-cr-secondary px-3 pb-2">{sendError}</p>
      )}
    </div>
  );
}

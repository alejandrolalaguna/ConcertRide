import { useEffect, useRef, useState } from "react";
import { MapPin, Paperclip, Send, X } from "lucide-react";
import type { Message, MessageKind } from "@concertride/types";
import { api } from "@/lib/api";
import { initials } from "@/lib/format";

interface Props {
  messages: Message[];
  loading: boolean;
  forbidden: boolean;
  currentUserId: string;
  onSend: (body: string, kind?: MessageKind, attachment_url?: string) => Promise<void>;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

const URL_RE = /https?:\/\/[^\s]+/g;

function detectUrls(text: string): string[] {
  return [...text.matchAll(URL_RE)].map((m) => m[0]);
}

function LinkPreview({ url }: { url: string }) {
  let display = url;
  try {
    const u = new URL(url);
    display = u.hostname + (u.pathname !== "/" ? u.pathname : "");
    if (display.length > 48) display = display.slice(0, 48) + "…";
  } catch {
    // keep raw url
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1.5 flex items-center gap-2 border border-cr-border bg-cr-bg px-2 py-1.5 text-[10px] text-cr-primary hover:bg-cr-surface transition-colors"
    >
      <span className="font-mono truncate">{display}</span>
      <span className="flex-shrink-0 text-cr-text-dim">↗</span>
    </a>
  );
}

// ── message bubbles ───────────────────────────────────────────────────────────

function LocationBubble({ body, isOwn }: { body: string; isOwn: boolean }) {
  // body is "lat,lng" e.g. "40.4168,-3.7038"
  const [lat, lng] = body.split(",").map(Number);
  const valid = !isNaN(lat!) && !isNaN(lng!);
  const mapsUrl = valid ? `https://maps.google.com/?q=${lat},${lng}` : "#";

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-3 py-2 text-xs leading-snug border ${
        isOwn
          ? "bg-cr-primary text-black border-black hover:bg-yellow-300"
          : "bg-cr-surface border-cr-border text-cr-text hover:bg-cr-surface-2"
      } transition-colors`}
    >
      <MapPin size={13} className="flex-shrink-0" />
      <span className="font-mono">
        {valid ? `${lat!.toFixed(5)}, ${lng!.toFixed(5)}` : body}
      </span>
      <span className="text-[10px] opacity-60">Ver mapa ↗</span>
    </a>
  );
}

function PhotoBubble({ url, isOwn }: { url: string; isOwn: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`block overflow-hidden border-2 ${isOwn ? "border-cr-primary" : "border-cr-border"}`}
        aria-label="Ver foto en tamaño completo"
      >
        <img
          src={url}
          alt="Foto del punto de encuentro"
          className="max-w-[200px] max-h-[150px] object-cover"
          loading="lazy"
        />
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white"
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
          <img
            src={url}
            alt="Foto del punto de encuentro"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

function TextBubble({ body, isOwn }: { body: string; isOwn: boolean }) {
  const urls = detectUrls(body);
  return (
    <div className={`px-3 py-2 text-xs leading-snug break-words ${
      isOwn ? "bg-cr-primary text-black" : "bg-cr-surface border border-cr-border text-cr-text"
    }`}>
      <p>{body}</p>
      {urls.map((u) => (
        <LinkPreview key={u} url={u} />
      ))}
    </div>
  );
}

// ── input area ────────────────────────────────────────────────────────────────

type PendingAttach =
  | { kind: "photo"; file: File; previewUrl: string }
  | { kind: "location"; lat: number; lng: number };

// ── main component ────────────────────────────────────────────────────────────

export function ChatPanel({ messages, loading, forbidden, currentUserId, onSend }: Props) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [pending, setPending] = useState<PendingAttach | null>(null);
  const [locating, setLocating] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function pickPhoto() {
    fileRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setPending({ kind: "photo", file, previewUrl });
    e.target.value = "";
  }

  function shareLocation() {
    if (!navigator.geolocation) {
      setSendError("Tu navegador no soporta geolocalización.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setPending({ kind: "location", lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocating(false);
        setSendError("No se pudo obtener tu ubicación.");
      },
      { timeout: 10000 },
    );
  }

  function clearPending() {
    if (pending?.kind === "photo") URL.revokeObjectURL(pending.previewUrl);
    setPending(null);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    if (!pending && !draft.trim()) return;

    setSending(true);
    setSendError("");
    try {
      if (pending?.kind === "photo") {
        const { url } = await api.messages.uploadPhoto(pending.file);
        URL.revokeObjectURL(pending.previewUrl);
        await onSend(draft.trim() || "📷 Foto", "photo", url);
      } else if (pending?.kind === "location") {
        await onSend(`${pending.lat},${pending.lng}`, "location");
      } else {
        await onSend(draft.trim(), "text");
      }
      setDraft("");
      setPending(null);
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

  const canSend = !sending && (!!draft.trim() || !!pending);

  return (
    <div className="flex flex-col border border-cr-border bg-cr-surface">
      {/* Message list */}
      <div className="flex-1 max-h-80 overflow-y-auto p-4 space-y-3 bg-cr-bg font-mono text-xs">
        {loading && <p className="text-cr-text-dim animate-pulse">Cargando mensajes…</p>}
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
                {msg.kind === "location" ? (
                  <LocationBubble body={msg.body} isOwn={isOwn} />
                ) : msg.kind === "photo" && msg.attachment_url ? (
                  <div className="space-y-1">
                    <PhotoBubble url={msg.attachment_url} isOwn={isOwn} />
                    {msg.body && msg.body !== "📷 Foto" && (
                      <p className={`px-3 py-1 text-xs ${isOwn ? "bg-cr-primary text-black" : "bg-cr-surface border border-cr-border text-cr-text"}`}>
                        {msg.body}
                      </p>
                    )}
                  </div>
                ) : (
                  <TextBubble body={msg.body} isOwn={isOwn} />
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Pending attachment preview */}
      {pending && (
        <div className="flex items-center gap-2 border-t border-cr-border bg-cr-surface-2 px-3 py-2">
          {pending.kind === "photo" && (
            <img src={pending.previewUrl} alt="preview" className="h-10 w-10 object-cover border border-cr-border" />
          )}
          {pending.kind === "location" && (
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-cr-primary">
              <MapPin size={12} />
              <span>{pending.lat.toFixed(4)}, {pending.lng.toFixed(4)}</span>
            </div>
          )}
          <button
            type="button"
            onClick={clearPending}
            className="ml-auto text-cr-text-dim hover:text-cr-secondary transition-colors"
            aria-label="Eliminar adjunto"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-cr-border p-3">
        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={onFileChange}
        />

        {/* Location button */}
        <button
          type="button"
          onClick={shareLocation}
          disabled={sending || locating}
          title="Compartir ubicación"
          aria-label="Compartir ubicación"
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 border border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <MapPin size={13} className={locating ? "animate-pulse text-cr-primary" : ""} />
        </button>

        {/* Photo button */}
        <button
          type="button"
          onClick={pickPhoto}
          disabled={sending}
          title="Adjuntar foto"
          aria-label="Adjuntar foto"
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 border border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Paperclip size={13} />
        </button>

        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 280))}
          placeholder={pending?.kind === "location" ? "Añade un comentario (opcional)…" : pending?.kind === "photo" ? "Describe la foto (opcional)…" : "Escribe un mensaje…"}
          disabled={sending}
          className="flex-1 bg-cr-bg border border-cr-border px-3 py-2 font-mono text-xs text-cr-text placeholder:text-cr-text-dim focus:outline-none focus:border-cr-primary transition-colors"
        />

        <button
          type="submit"
          disabled={!canSend}
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

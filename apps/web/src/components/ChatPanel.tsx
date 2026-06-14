import { useEffect, useRef, useState } from "react";
import { MapPin, Paperclip, Send, X, ImageIcon } from "lucide-react";
import type { Message, MessageKind } from "@concertride/types";
import { api } from "@/lib/api";
import { initials } from "@/lib/format";
import { useI18n } from "@/lib/i18n";

interface Props {
  messages: Message[];
  loading: boolean;
  forbidden: boolean;
  currentUserId: string;
  onSend: (body: string, kind?: MessageKind, attachment_url?: string) => Promise<void>;
}

// ── helpers ───────────────────────────────────────────────────────────────────

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
      className="mt-1.5 flex items-center gap-2 border border-cr-border bg-cr-bg/60 px-2.5 py-1.5 text-[10px] text-cr-primary hover:border-cr-primary/40 hover:bg-cr-surface transition-colors"
    >
      <span className="font-mono truncate">{display}</span>
      <span className="flex-shrink-0 text-cr-text-dim">↗</span>
    </a>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ name, isOwn }: { name: string; isOwn: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`w-8 h-8 flex-shrink-0 flex items-center justify-center font-display font-black text-[11px] ${
        isOwn
          ? "bg-cr-primary text-black"
          : "bg-cr-surface-3 border border-cr-border-mid text-cr-primary"
      }`}
    >
      {initials(name)}
    </div>
  );
}

// ── Message bubbles ───────────────────────────────────────────────────────────

function LocationBubble({ body, isOwn }: { body: string; isOwn: boolean }) {
  const { t } = useI18n();
  const [lat, lng] = body.split(",").map(Number);
  const valid = !isNaN(lat!) && !isNaN(lng!);
  const mapsUrl = valid ? `https://maps.google.com/?q=${lat},${lng}` : "#";

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-3.5 py-2.5 text-xs leading-snug border transition-colors ${
        isOwn
          ? "bg-cr-primary text-black border-cr-primary-dim hover:bg-yellow-300"
          : "bg-cr-surface-2 border-cr-border text-cr-text hover:border-cr-border-mid"
      }`}
    >
      <MapPin size={12} className="flex-shrink-0" />
      <span className="font-mono">
        {valid ? `${lat!.toFixed(4)}, ${lng!.toFixed(4)}` : body}
      </span>
      <span className="text-[10px] opacity-60 ml-1">{t("chat.viewMap")}</span>
    </a>
  );
}

function PhotoBubble({ url, isOwn }: { url: string; isOwn: boolean }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`block overflow-hidden border-2 transition-opacity hover:opacity-90 ${isOwn ? "border-cr-primary" : "border-cr-border-mid"}`}
        aria-label={t("chat.viewPhotoFull")}
      >
        <img
          src={url}
          alt={t("chat.photoAlt")}
          className="max-w-[200px] max-h-[150px] object-cover"
          loading="lazy"
        />
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="absolute top-5 right-5 w-10 h-10 bg-cr-surface border border-cr-border-mid text-cr-text-muted hover:text-cr-text flex items-center justify-center transition-colors"
            onClick={() => setOpen(false)}
            aria-label={t("chat.close")}
          >
            <X size={18} />
          </button>
          <img
            src={url}
            alt={t("chat.photoEnlargedAlt")}
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
    <div
      className={`px-3.5 py-2.5 text-sm leading-snug break-words font-sans ${
        isOwn
          ? "bg-cr-primary text-black"
          : "bg-cr-surface-2 border border-cr-border text-cr-text"
      }`}
    >
      <p>{body}</p>
      {urls.map((u) => (
        <LinkPreview key={u} url={u} />
      ))}
    </div>
  );
}

// ── Pending attachment preview ────────────────────────────────────────────────

type PendingAttach =
  | { kind: "photo"; file: File; previewUrl: string }
  | { kind: "location"; lat: number; lng: number };

// ── Main component ────────────────────────────────────────────────────────────

export function ChatPanel({ messages, loading, forbidden, currentUserId, onSend }: Props) {
  const { t } = useI18n();
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
      setSendError(t("chat.geoUnsupported"));
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
        setSendError(t("chat.geoFailed"));
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
      setSendError(t("chat.sendError"));
    } finally {
      setSending(false);
    }
  }

  if (forbidden) {
    return (
      <div className="border border-cr-border bg-cr-surface-2 p-8 text-center">
        <div className="w-12 h-12 bg-cr-surface-3 border border-cr-border-mid flex items-center justify-center mx-auto mb-4">
          <span className="text-cr-text-dim text-xl">🔒</span>
        </div>
        <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
          {t("chat.forbidden")}
        </p>
      </div>
    );
  }

  const canSend = !sending && (!!draft.trim() || !!pending);

  return (
    <div className="flex flex-col border border-cr-border bg-cr-surface overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-cr-border bg-cr-surface-2">
        <span className="cr-live-dot" />
        <span className="font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.14em]">
          {t("chat.headerRide")}
        </span>
        <span className="ml-auto font-mono text-[10px] text-cr-text-dim">
          {t("chat.messageCount", { count: messages.length })}
        </span>
      </div>

      {/* Message list */}
      <div className="flex-1 max-h-80 overflow-y-auto p-4 space-y-4 bg-cr-bg">
        {loading && (
          <div className="flex items-center gap-2 text-cr-text-dim font-mono text-xs animate-pulse py-4 justify-center">
            <span className="w-1 h-1 bg-cr-text-dim rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1 h-1 bg-cr-text-dim rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1 h-1 bg-cr-text-dim rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <span className="text-2xl">💬</span>
            <p className="font-sans text-sm text-cr-text-muted">
              {t("chat.emptyTitle")}
            </p>
            <p className="font-mono text-[11px] text-cr-text-dim">
              {t("chat.emptyHint")}
            </p>
          </div>
        )}
        {messages.map((msg) => {
          const isOwn = msg.user_id === currentUserId;
          return (
            <div key={msg.id} className={`flex gap-2.5 ${isOwn ? "flex-row-reverse" : ""}`}>
              <Avatar name={msg.user.name} isOwn={isOwn} />
              <div
                className={`max-w-[75%] space-y-1 flex flex-col ${
                  isOwn ? "items-end" : "items-start"
                }`}
              >
                <div className={`flex items-baseline gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                  <span className="font-sans text-[11px] font-semibold text-cr-text-muted">
                    {isOwn ? t("chat.you") : msg.user.name}
                  </span>
                  <span className="font-mono text-[10px] text-cr-text-dim">
                    {formatTime(msg.created_at)}
                  </span>
                </div>
                {msg.kind === "location" ? (
                  <LocationBubble body={msg.body} isOwn={isOwn} />
                ) : msg.kind === "photo" && msg.attachment_url ? (
                  <div className="space-y-1">
                    <PhotoBubble url={msg.attachment_url} isOwn={isOwn} />
                    {msg.body && msg.body !== "📷 Foto" && (
                      <TextBubble body={msg.body} isOwn={isOwn} />
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
        <div className="flex items-center gap-3 border-t border-cr-border bg-cr-surface-2 px-4 py-2.5">
          {pending.kind === "photo" && (
            <img
              src={pending.previewUrl}
              alt={t("chat.attachmentPreviewAlt")}
              className="h-10 w-10 object-cover border border-cr-border-mid"
            />
          )}
          {pending.kind === "location" && (
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-cr-primary">
              <MapPin size={12} />
              <span>{pending.lat.toFixed(4)}, {pending.lng.toFixed(4)}</span>
            </div>
          )}
          <button
            type="button"
            onClick={clearPending}
            className="ml-auto text-cr-text-dim hover:text-cr-secondary transition-colors"
            aria-label={t("chat.removeAttachment")}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input area */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-cr-border px-3 py-2.5 bg-cr-surface"
      >
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
          title={t("chat.shareLocation")}
          aria-label={t("chat.shareLocation")}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <MapPin
            size={13}
            className={locating ? "animate-pulse text-cr-primary" : ""}
          />
        </button>

        {/* Photo button */}
        <button
          type="button"
          onClick={pickPhoto}
          disabled={sending}
          title={t("chat.attachPhoto")}
          aria-label={t("chat.attachPhoto")}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
        >
          <ImageIcon size={13} />
        </button>

        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 280))}
          placeholder={
            pending?.kind === "location"
              ? t("chat.placeholderLocation")
              : pending?.kind === "photo"
              ? t("chat.placeholderPhoto")
              : t("chat.placeholderText")
          }
          disabled={sending}
          className="flex-1 bg-cr-surface-2 border border-cr-border px-3 py-2 font-sans text-sm text-cr-text placeholder:text-cr-text-dim focus:outline-none focus:border-cr-primary/60 focus:shadow-[0_0_0_2px_rgb(212_247_0/0.06)] transition-[border-color,box-shadow]"
        />

        <button
          type="submit"
          disabled={!canSend}
          aria-label={t("chat.sendMessage")}
          className="flex-shrink-0 flex items-center justify-center w-9 h-9 bg-cr-primary text-black hover:bg-cr-primary-dim shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 disabled:opacity-30 disabled:pointer-events-none"
        >
          <Send size={14} strokeWidth={2.5} />
        </button>
      </form>

      {sendError && (
        <p className="font-mono text-[10px] text-cr-secondary px-4 pb-2">{sendError}</p>
      )}
    </div>
  );
}

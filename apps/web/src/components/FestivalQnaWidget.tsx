import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { FestivalQna } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { track } from "@/lib/observability";
import { useI18n } from "@/lib/i18n";

interface Props {
  festivalSlug: string;
  // The festival's display name, used in the empty-state copy.
  festivalName: string;
}

export function FestivalQnaWidget({ festivalSlug, festivalName }: Props) {
  const { user } = useSession();
  const { locale } = useI18n();
  const isEn = locale === "en";
  const [items, setItems] = useState<FestivalQna[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await api.festivalQnas.list(festivalSlug);
        if (!cancelled) setItems(res.items);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [festivalSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      window.location.href = `/login?next=${encodeURIComponent(`/festivales/${festivalSlug}`)}`;
      return;
    }
    setSubmitting(true);
    setSubmitMessage(null);
    try {
      await api.festivalQnas.create({
        festival_slug: festivalSlug,
        question: question.trim(),
        answer: answer.trim(),
      });
      track("festival_qna_submitted", { festival_slug: festivalSlug });
      setSubmitMessage(isEn ? "✓ Submitted. We review it before publishing." : "✓ Enviado. Lo revisamos antes de publicarlo.");
      setQuestion("");
      setAnswer("");
      setShowForm(false);
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitMessage(
          err.status === 429
            ? (isEn ? "Too many submissions. Please wait a moment." : "Demasiados envíos. Espera un poco.")
            : err.status === 400 && /no_links_allowed/.test(String(err.message))
              ? (isEn ? "Links are not allowed in questions." : "No se permiten enlaces en las preguntas.")
              : (isEn ? "Error submitting. Please try again." : "Error al enviar. Inténtalo de nuevo."),
        );
      } else {
        setSubmitMessage(isEn ? "Error submitting. Please try again." : "Error al enviar. Inténtalo de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function upvote(id: string) {
    try {
      const updated = await api.festivalQnas.upvote(id);
      setItems((prev) => prev.map((q) => (q.id === id ? updated : q)));
      track("festival_qna_upvoted", { id });
    } catch {
      /* ignore */
    }
  }

  return (
    <section
      aria-label={isEn ? "Community questions and tips" : "Preguntas y consejos de la comunidad"}
      className="border-y border-cr-border bg-cr-surface-2"
    >
      <header className="border-b border-cr-border px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cr-text-muted">
              {isEn ? <>Community · {festivalName}</> : <>Comunidad · {festivalName}</>}
            </p>
            <h2 className="mt-1 font-display text-2xl uppercase">{isEn ? "Tips from people who've been" : "Consejos de quienes ya fueron"}</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="self-start border-2 border-cr-primary px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-cr-primary hover:bg-cr-primary hover:text-cr-text-inverse"
          >
            {showForm ? (isEn ? "Cancel" : "Cancelar") : (isEn ? "+ Share a tip" : "+ Compartir consejo")}
          </button>
        </div>
      </header>

      {showForm && (
        <form onSubmit={handleSubmit} className="border-b border-cr-border bg-cr-bg/40 px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            <label className="block">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cr-text-muted">
                {isEn ? "Question or topic" : "Pregunta o tema"}
              </span>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value.slice(0, 200))}
                required
                minLength={8}
                maxLength={200}
                placeholder={isEn ? "When's the best time to leave from Madrid?" : "¿Cuándo conviene salir desde Madrid?"}
                className="mt-1 w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-2 font-sans text-sm text-cr-text"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cr-text-muted">
                {isEn ? "Your answer / tip" : "Tu respuesta / consejo"}
              </span>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value.slice(0, 1000))}
                required
                rows={4}
                minLength={8}
                maxLength={1000}
                placeholder={isEn ? "Leaving before 2pm avoids the A-3 jam on Fridays…" : "Salir antes de las 14h evita el atasco en la A-3 los viernes…"}
                className="mt-1 w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-2 font-sans text-sm text-cr-text"
              />
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-dim">
                {answer.length}/1000 · {isEn ? "no links" : "sin enlaces"}
              </span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting || answer.length < 8}
                className="border-2 border-cr-primary bg-cr-primary px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cr-text-inverse disabled:opacity-40"
              >
                {submitting ? (isEn ? "Sending…" : "Enviando…") : (isEn ? "Submit for review" : "Enviar para revisión")}
              </button>
              {submitMessage && (
                <p className="text-xs text-cr-text-muted">{submitMessage}</p>
              )}
            </div>
          </div>
        </form>
      )}

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {loading ? (
          <p className="font-mono text-xs text-cr-text-muted">{isEn ? "Loading…" : "Cargando…"}</p>
        ) : items.length === 0 ? (
          <div className="border-2 border-dashed border-cr-border bg-cr-bg/40 p-6 text-center">
            <p className="font-display text-lg uppercase">{isEn ? "No tips yet" : "Aún sin consejos"}</p>
            <p className="mt-1 text-xs text-cr-text-muted">
              {isEn
                ? <>Be the first to share your experience getting to {festivalName}.</>
                : <>Sé el primero en contar tu experiencia llegando a {festivalName}.</>}
              {submitMessage && submitMessage.startsWith("✓") ? ` ${submitMessage}` : ""}
            </p>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {items.map((q) => (
              <li key={q.id} className="border border-cr-border bg-cr-bg/40 p-4">
                <p className="font-display text-base uppercase leading-snug">{q.question}</p>
                <p className="mt-2 text-sm text-cr-text-muted">{q.answer}</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-dim">
                    @{q.user_name}
                  </span>
                  <button
                    type="button"
                    onClick={() => upvote(q.id)}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted hover:text-cr-primary"
                  >
                    ▲ {q.upvotes}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && (
          <p className="mt-4 text-center text-xs text-cr-text-dim">
            {isEn
              ? "Answers are moderated before publishing to prevent spam."
              : "Las respuestas se moderan antes de publicarse para evitar spam."}{" "}
            <Link to="/contacto" className="underline hover:text-cr-primary">
              {isEn ? "Report content" : "Reportar contenido"}
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import type { Review, Ride, User } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { initials } from "@/lib/format";

interface Props {
  ride: Ride;
  currentUser: User | null;
}

function StarRating({
  value,
  onChange,
  readonly = false,
  size = 20,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: number;
}) {
  const [hovered, setHovered] = useState(0);
  const display = readonly ? value : (hovered || value);

  return (
    <div className="flex items-center gap-0.5" role={readonly ? undefined : "radiogroup"}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={readonly ? undefined : `${n} estrella${n !== 1 ? "s" : ""}`}
          disabled={readonly}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => !readonly && setHovered(n)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? "cursor-default" : "cursor-pointer"}
        >
          <Star
            size={size}
            strokeWidth={1.5}
            className={
              n <= display
                ? "text-cr-primary fill-cr-primary"
                : "text-cr-border"
            }
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const ini = initials(review.reviewer.name);
  return (
    <div className="flex gap-3 p-4 border border-cr-border bg-cr-surface">
      <div className="w-9 h-9 flex-shrink-0 bg-cr-surface-2 border border-cr-border flex items-center justify-center">
        {review.reviewer.avatar_url ? (
          <img
            src={review.reviewer.avatar_url}
            alt={review.reviewer.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-display text-xs text-cr-primary">{ini}</span>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs font-semibold text-cr-text">
              {review.reviewer.name}
            </span>
            <span className="font-sans text-[10px] text-cr-text-dim uppercase tracking-[0.08em]">
              sobre {review.reviewee.name}
            </span>
          </div>
          <span className="font-mono text-[10px] text-cr-text-dim flex-shrink-0">
            {formatDate(review.created_at)}
          </span>
        </div>
        <StarRating value={review.rating} readonly size={13} />
        {review.comment && (
          <p className="font-sans text-sm text-cr-text-muted leading-snug">{review.comment}</p>
        )}
      </div>
    </div>
  );
}

type FormState = "idle" | "submitting" | "done" | "error";

export function RideReviewsSection({ ride, currentUser }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // form
  const [revieweeId, setRevieweeId] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [formError, setFormError] = useState("");

  // Only participants (driver + confirmed passengers) can review.
  // is_participant comes from GET /rides/:id when the user is authenticated.
  const reviewableUsers: User[] = [];
  if (currentUser && ride.is_participant) {
    if (currentUser.id !== ride.driver_id) {
      reviewableUsers.push(ride.driver);
    }
    // passengers can't see each other unless we have the confirmed list — for now just the driver
  }

  const alreadyReviewed = (revieweeId: string) =>
    reviews.some((r) => r.reviewer_id === currentUser?.id && r.reviewee_id === revieweeId);

  useEffect(() => {
    api.reviews
      .list(ride.id)
      .then((r) => setReviews(r.reviews))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ride.id]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!revieweeId || rating < 1) return;
    setFormState("submitting");
    setFormError("");
    try {
      const rev = await api.reviews.create(ride.id, {
        reviewee_id: revieweeId,
        rating,
        comment: comment.trim() || undefined,
      });
      setReviews((prev) => [rev, ...prev]);
      setFormState("done");
      setRating(0);
      setComment("");
      setRevieweeId("");
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message === "already_reviewed"
            ? "Ya has valorado a este viajero para este viaje."
            : err.message
          : "No se pudo enviar la valoración.";
      setFormError(msg);
      setFormState("error");
    }
  }

  const concertPast = new Date(ride.concert.date) < new Date();
  const canReview = concertPast && !!currentUser && reviewableUsers.length > 0;

  return (
    <section aria-labelledby="reviews-title" className="space-y-5">
      <h2
        id="reviews-title"
        className="font-display text-sm uppercase tracking-wide text-cr-text-muted"
      >
        Valoraciones del viaje
      </h2>

      {canReview && formState !== "done" && (
        <form
          onSubmit={submitReview}
          className="bg-cr-surface border border-cr-border p-5 space-y-4"
        >
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-cr-primary">
            Deja tu valoración
          </p>

          {reviewableUsers.length > 1 && (
            <div className="space-y-1.5">
              <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                ¿A quién valoras?
              </label>
              <select
                value={revieweeId}
                onChange={(e) => setRevieweeId(e.target.value)}
                required
                className="w-full bg-cr-bg border border-cr-border px-3 py-2 font-mono text-xs text-cr-text focus:outline-none focus:border-cr-primary [color-scheme:dark]"
              >
                <option value="">Selecciona…</option>
                {reviewableUsers.map((u) => (
                  <option key={u.id} value={u.id} disabled={alreadyReviewed(u.id)}>
                    {u.name} {alreadyReviewed(u.id) ? "(ya valorado)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {reviewableUsers.length === 1 && (
            <p className="font-sans text-xs text-cr-text-muted">
              Valorando a <span className="text-cr-text font-semibold">{reviewableUsers[0]!.name}</span>
            </p>
          )}

          <div className="space-y-1.5">
            <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
              Puntuación
            </label>
            <StarRating
              value={rating}
              onChange={(v) => {
                setRating(v);
                if (reviewableUsers.length === 1) setRevieweeId(reviewableUsers[0]!.id);
              }}
              size={24}
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
              Comentario (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="Muy puntual, buen ambiente en el coche…"
              className="w-full bg-cr-bg border border-cr-border px-3 py-2 font-sans text-sm text-cr-text placeholder:text-cr-text-dim focus:outline-none focus:border-cr-primary transition-colors"
            />
          </div>

          {formError && (
            <p className="font-mono text-xs text-cr-secondary">{formError}</p>
          )}

          <button
            type="submit"
            disabled={formState === "submitting" || rating < 1}
            className="bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-xs border-2 border-black px-5 py-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 disabled:opacity-40 disabled:pointer-events-none"
          >
            {formState === "submitting" ? "Enviando…" : "Enviar valoración"}
          </button>
        </form>
      )}

      {formState === "done" && (
        <div className="border border-cr-primary/30 bg-cr-primary/5 px-4 py-3">
          <p className="font-sans text-sm text-cr-primary font-medium">
            ¡Gracias por tu valoración! Ayuda a construir la comunidad.
          </p>
        </div>
      )}

      {loading ? (
        <p className="font-mono text-xs text-cr-text-dim animate-pulse">Cargando valoraciones…</p>
      ) : reviews.length === 0 ? (
        <p className="font-mono text-xs text-cr-text-dim">
          {concertPast
            ? "Todavía no hay valoraciones para este viaje."
            : "Las valoraciones estarán disponibles después del concierto."}
        </p>
      ) : (
        <div className="space-y-2">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
    </section>
  );
}

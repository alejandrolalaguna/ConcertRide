import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import type { Concert } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { useSession } from "@/lib/session";
import { useI18n } from "@/lib/i18n";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";

const SUGGESTED_TAGS = [
  "indie",
  "rock",
  "techno",
  "pop",
  "festival",
  "noche tranquila",
  "fiesta",
  "ida y vuelta",
  "solo ida",
];

export default function SquadCreatePage() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const concertId = params.get("concert") ?? "";
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const [concert, setConcert] = useState<Concert | null>(null);
  const [name, setName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<"public" | "private">("private");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useSeoMeta({ title: "Crear squad · ConcertRide", noindex: true });

  useEffect(() => {
    if (!concertId) return;
    api.concerts
      .get(concertId)
      .then((c) => {
        setConcert(c);
        setName(t("squad.defaultName", { artist: c.artist }));
      })
      .catch(() => setError("concert_not_found"));
  }, [concertId]);

  if (!loading && !user)
    return <Navigate to={`/login?next=/squads/new${concertId ? `?concert=${concertId}` : ""}`} replace />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!concertId) {
      setError("concert_required");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const sq = await api.squads.create({
        concert_id: concertId,
        name: name.trim(),
        vibe_tags: tags,
        visibility,
      });
      trackEvent(ANALYTICS_EVENTS.CREW_CREATED, {
        squad_id: sq.id,
        concert_id: concertId,
        visibility,
      });
      toast.success(t("squad.createdToast"), {
        description: t("squad.createdToastDescription"),
      });
      navigate(`/squads/${sq.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "create_failed");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleTag(t: string) {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t].slice(0, 6)));
  }

  return (
    <main id="main" className="min-h-dvh bg-cr-bg pt-14 text-cr-text">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cr-text-muted">
          {t("squad.newSquad")}
        </p>
        <h1 className="mt-2 font-display text-4xl uppercase leading-tight">
          {concert ? t("squad.coordinateArtist", { artist: concert.artist }) : t("squad.coordinateGroup")}
        </h1>
        <p className="mt-2 max-w-prose text-sm text-cr-text-muted">
          {t("squad.createIntro")}
        </p>

        {error === "concert_not_found" && (
          <p className="mt-6 font-mono text-xs text-cr-secondary">{t("squad.concertNotFound")}</p>
        )}

        <form onSubmit={submit} className="mt-8 space-y-6">
          <label className="block">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cr-text-muted">
              {t("squad.nameLabel")}
            </span>
            <input
              type="text"
              required
              minLength={2}
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-2 font-sans text-sm text-cr-text"
            />
          </label>

          <fieldset>
            <legend className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cr-text-muted">
              {t("squad.vibeLegend")}
            </legend>
            <ul className="mt-2 flex flex-wrap gap-2">
              {SUGGESTED_TAGS.map((t) => (
                <li key={t}>
                  <button
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`border-2 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${
                      tags.includes(t)
                        ? "border-cr-primary bg-cr-primary text-cr-text-inverse"
                        : "border-cr-border text-cr-text-muted hover:border-cr-primary"
                    }`}
                  >
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset>
            <legend className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-cr-text-muted">
              {t("squad.visibilityLegend")}
            </legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {(["private", "public"] as const).map((v) => (
                <label
                  key={v}
                  className={`flex cursor-pointer flex-col gap-1 border-2 p-3 ${
                    visibility === v ? "border-cr-primary bg-cr-primary/5" : "border-cr-border"
                  }`}
                >
                  <span className="flex items-center gap-2 font-display text-sm uppercase">
                    <input
                      type="radio"
                      name="visibility"
                      value={v}
                      checked={visibility === v}
                      onChange={() => setVisibility(v)}
                      className="accent-cr-primary"
                    />
                    {v === "public" ? t("squad.visibilityPublicLabel") : t("squad.visibilityPrivateLabel")}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-muted">
                    {v === "public"
                      ? t("squad.visibilityPublicDesc")
                      : t("squad.visibilityPrivateDesc")}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={submitting || !concertId}
            className="border-2 border-cr-primary bg-cr-primary px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cr-text-inverse disabled:opacity-40"
          >
            {submitting ? t("squad.creating") : t("squad.createButton")}
          </button>
          {error && error !== "concert_not_found" && (
            <p className="font-mono text-xs text-cr-secondary">{t("squad.createError")}</p>
          )}
        </form>
      </div>
    </main>
  );
}

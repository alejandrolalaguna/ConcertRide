import { Link, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { useSession } from "@/lib/session";
import { useCrew } from "@/lib/crew";
import { useI18n } from "@/lib/i18n";
import { CrewAvatars } from "@/components/CrewAvatars";

export default function CrewPage() {
  const { user, loading } = useSession();
  const { crew, pendingIncoming, pendingOutgoing, accept, remove } = useCrew();
  const { t } = useI18n();

  async function handleAccept(userId: string) {
    try {
      await accept(userId);
      toast.success(t("crew.toastAccepted"));
    } catch {
      toast.error(t("crew.toastAcceptError"));
    }
  }

  async function handleReject(userId: string) {
    try {
      await remove(userId);
      toast(t("crew.toastRejected"));
    } catch {
      toast.error(t("crew.toastRejectError"));
    }
  }

  useSeoMeta({
    title: "Mi crew · ConcertRide",
    description: "Tu crew de festivales. La gente con la que has viajado, los que organizan los próximos eventos.",
    canonical: `${SITE_URL}/crew`,
    noindex: true,
  });

  if (!loading && !user) return <Navigate to="/login?next=/crew" replace />;
  if (loading || !user) return null;

  return (
    <main id="main" className="min-h-dvh bg-cr-bg pt-14 text-cr-text">
      <header className="border-b border-cr-border px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cr-text-muted">
            {t("crew.eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-4xl uppercase leading-tight">
            {t("crew.title")}{" "}
            <span className="text-cr-primary">{crew.length}</span>
          </h1>
          <p className="mt-2 max-w-prose text-sm text-cr-text-muted">
            {t("crew.intro")}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-10 px-4 py-10 sm:px-6">
        {pendingIncoming.length > 0 && (
          <section>
            <h2 className="border-b border-cr-border pb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">
              {t("crew.incomingHeading", { count: pendingIncoming.length })}
            </h2>
            <ul className="mt-4 grid gap-3">
              <AnimatePresence initial={false}>
                {pendingIncoming.map((m) => (
                  <motion.li
                    key={m.user.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center justify-between gap-3 border-2 border-cr-border bg-cr-surface-2 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <CrewAvatars people={[{ id: m.user.id, name: m.user.name, avatar_url: m.user.avatar_url }]} size="md" />
                      <div>
                        <p className="font-display text-base">{m.user.name}</p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-muted">
                          {t("crew.wantsToJoin")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void handleAccept(m.user.id)}
                        className="border-2 border-cr-primary bg-cr-primary px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-cr-text-inverse"
                      >
                        {t("crew.accept")}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleReject(m.user.id)}
                        className="border-2 border-cr-border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-cr-text-muted hover:border-cr-secondary hover:text-cr-secondary"
                      >
                        {t("crew.ignore")}
                      </button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </section>
        )}

        <section>
          <h2 className="border-b border-cr-border pb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-cr-text-muted">
            {t("crew.activeHeading", { count: crew.length })}
          </h2>
          {crew.length === 0 ? (
            <div className="mt-8 border-2 border-dashed border-cr-border bg-cr-surface-2 p-8 text-center">
              <p className="font-display text-xl uppercase">{t("crew.emptyTitle")}</p>
              <p className="mt-2 max-w-prose mx-auto text-sm text-cr-text-muted">
                {t("crew.emptyBody")}
              </p>
              <Link
                to="/concerts"
                className="mt-4 inline-block border-2 border-cr-primary px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cr-primary hover:bg-cr-primary hover:text-cr-text-inverse"
              >
                {t("crew.emptyCta")}
              </Link>
            </div>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {crew.map((m) => (
                <li
                  key={m.user.id}
                  className="flex items-center justify-between gap-3 border-2 border-cr-border bg-cr-surface-2 p-4"
                >
                  <div className="flex items-center gap-3">
                    <CrewAvatars people={[{ id: m.user.id, name: m.user.name, avatar_url: m.user.avatar_url }]} size="md" clickable />
                    <div>
                      <Link to={`/drivers/${m.user.id}`} className="font-display text-base hover:text-cr-primary">
                        {m.user.name}
                      </Link>
                      {m.shared_genres.length > 0 && (
                        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-muted">
                          🎶 {m.shared_genres.slice(0, 3).join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void remove(m.user.id)}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted hover:text-cr-secondary"
                  >
                    {t("crew.remove")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {pendingOutgoing.length > 0 && (
          <section>
            <h2 className="border-b border-cr-border pb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-cr-text-muted">
              {t("crew.outgoingHeading", { count: pendingOutgoing.length })}
            </h2>
            <ul className="mt-4 grid gap-2">
              {pendingOutgoing.map((m) => (
                <li
                  key={m.user.id}
                  className="flex items-center justify-between border border-dashed border-cr-border px-4 py-2"
                >
                  <span className="text-sm">{m.user.name}</span>
                  <button
                    type="button"
                    onClick={() => void remove(m.user.id)}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted hover:text-cr-secondary"
                  >
                    {t("crew.cancel")}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}

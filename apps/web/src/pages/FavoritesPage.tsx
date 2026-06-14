import { Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Heart, MapPin, Mic2, Music } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { useI18n } from "@/lib/i18n";
import { useFavorites } from "@/lib/favorites";
import { useSession } from "@/lib/session";
import { ConcertCard } from "@/components/ConcertCard";
import { LoadingSpinner } from "@/components/ui";
import { FavoriteButton } from "@/components/FavoriteButton";

type EmptySection = {
  label: string;
  emoji: string;
  to: string;
};

function SectionEmptyState({ section }: { section: EmptySection }) {
  const { t } = useI18n();
  return (
    <div className="border-2 border-cr-border bg-cr-surface p-6 text-center space-y-2">
      <div className="text-4xl" aria-hidden="true">{section.emoji}</div>
      <p className="font-display text-lg uppercase">{t("favorites.sectionEmptyTitle", { label: section.label })}</p>
      <p className="font-mono text-xs text-cr-text-muted">
        {t("favorites.sectionEmptyBody")}
      </p>
      <Link to={section.to} className="cr-btn-ghost mt-2 inline-block">{t("favorites.explore")}</Link>
    </div>
  );
}

export default function FavoritesPage() {
  const { t } = useI18n();
  const { user, loading: sessionLoading } = useSession();
  const { favorites, upcomingConcerts, loading } = useFavorites();

  useSeoMeta({
    title: "Mis favoritos",
    description: "Conciertos, artistas y ciudades que has marcado como favoritos en ConcertRide.",
    canonical: `${SITE_URL}/favoritos`,
    noindex: true,
  });

  if (sessionLoading) return <LoadingSpinner text={t("favorites.loading")} />;
  if (!user) return <Navigate to="/login?next=/favoritos" replace />;

  const artistFavs = favorites.filter((f) => f.kind === "artist");
  const cityFavs = favorites.filter((f) => f.kind === "city");
  const concertFavs = favorites.filter((f) => f.kind === "concert");
  const empty = favorites.length === 0;

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-16">
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-12 space-y-4">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-secondary">
          {t("favorites.eyebrow")}
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          {t("favorites.title")}
        </h1>
        <p className="font-sans text-sm text-cr-text-muted max-w-xl">
          {t("favorites.intro")}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24 space-y-16">
        {loading && favorites.length === 0 && <LoadingSpinner text={t("favorites.loadingList")} />}

        {empty && !loading && (
          <div className="border border-dashed border-cr-border p-10 text-center space-y-3">
            <Heart size={32} className="mx-auto text-cr-text-dim" strokeWidth={1.5} />
            <p className="font-display text-2xl uppercase text-cr-text-muted">{t("favorites.emptyTitle")}</p>
            <p className="font-sans text-sm text-cr-text-dim">
              {t("favorites.emptyBodyBefore")} <Heart size={12} className="inline text-cr-secondary" />{" "}
              {t("favorites.emptyBodyAfter")}
            </p>
            <Link
              to="/concerts"
              className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary/10 transition-colors mt-3"
            >
              {t("favorites.exploreConcerts")}
            </Link>
          </div>
        )}

        {/* Upcoming concerts matching favourites */}
        {upcomingConcerts.length > 0 && (
          <section className="space-y-4">
            <header className="flex items-baseline justify-between gap-4 border-b border-cr-border pb-2">
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
                {t("favorites.upcomingTitle")}
              </h2>
              <span className="font-mono text-xs text-cr-text-muted">
                {upcomingConcerts.length}
              </span>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingConcerts.map((c) => (
                <Link key={c.id} to={`/concerts/${c.id}`} className="block">
                  <ConcertCard concert={c} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Starred concerts */}
        {!empty && (
          <section className="space-y-4">
            <header className="flex items-center gap-2 border-b border-cr-border pb-2">
              <Music size={14} className="text-cr-text-muted" />
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
                {t("favorites.concertsHeading")}
              </h2>
              <span className="ml-auto font-mono text-xs text-cr-text-muted">{concertFavs.length}</span>
            </header>
            {concertFavs.length === 0 ? (
              <SectionEmptyState section={{ label: t("favorites.labelConcerts"), emoji: "🎟️", to: "/concerts" }} />
            ) : (
              <motion.ul className="divide-y divide-cr-border border border-cr-border">
                {concertFavs.map((f, i) => (
                  <motion.li
                    key={f.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.25 }}
                    className="flex items-center gap-3 p-3"
                  >
                    <Link
                      to={`/concerts/${f.target_id}`}
                      className="flex-1 font-sans text-sm text-cr-text hover:text-cr-primary transition-colors"
                    >
                      {f.label}
                    </Link>
                    <FavoriteButton kind="concert" targetId={f.target_id} label={f.label} size="sm" />
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </section>
        )}

        {/* Artists */}
        {!empty && (
          <section className="space-y-4">
            <header className="flex items-center gap-2 border-b border-cr-border pb-2">
              <Mic2 size={14} className="text-cr-text-muted" />
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
                {t("favorites.artistsHeading")}
              </h2>
              <span className="ml-auto font-mono text-xs text-cr-text-muted">{artistFavs.length}</span>
            </header>
            {artistFavs.length === 0 ? (
              <SectionEmptyState section={{ label: t("favorites.labelArtists"), emoji: "🎤", to: "/concerts" }} />
            ) : (
              <motion.ul className="flex flex-wrap gap-2">
                {artistFavs.map((f, i) => (
                  <motion.li
                    key={f.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.25 }}
                    className="flex items-center gap-2 border border-cr-border px-3 py-2"
                  >
                    <Link
                      to={`/concerts?artist=${encodeURIComponent(f.label)}`}
                      className="font-sans text-sm text-cr-text hover:text-cr-primary transition-colors"
                    >
                      {f.label}
                    </Link>
                    <FavoriteButton kind="artist" targetId={f.target_id} label={f.label} size="sm" />
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </section>
        )}

        {/* Cities */}
        {!empty && (
          <section className="space-y-4">
            <header className="flex items-center gap-2 border-b border-cr-border pb-2">
              <MapPin size={14} className="text-cr-text-muted" />
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
                {t("favorites.citiesHeading")}
              </h2>
              <span className="ml-auto font-mono text-xs text-cr-text-muted">{cityFavs.length}</span>
            </header>
            {cityFavs.length === 0 ? (
              <SectionEmptyState section={{ label: t("favorites.labelCities"), emoji: "📍", to: "/concerts" }} />
            ) : (
              <motion.ul className="flex flex-wrap gap-2">
                {cityFavs.map((f, i) => (
                  <motion.li
                    key={f.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.25 }}
                    className="flex items-center gap-2 border border-cr-border px-3 py-2"
                  >
                    <Link
                      to={`/concerts?city=${encodeURIComponent(f.label)}`}
                      className="font-sans text-sm text-cr-text hover:text-cr-primary transition-colors"
                    >
                      {f.label}
                    </Link>
                    <FavoriteButton kind="city" targetId={f.target_id} label={f.label} size="sm" />
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

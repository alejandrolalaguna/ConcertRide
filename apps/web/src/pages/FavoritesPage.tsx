import { Link, Navigate } from "react-router-dom";
import { Heart, MapPin, Mic2, Music } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { useFavorites } from "@/lib/favorites";
import { useSession } from "@/lib/session";
import { ConcertCard } from "@/components/ConcertCard";
import { LoadingSpinner } from "@/components/ui";
import { FavoriteButton } from "@/components/FavoriteButton";

export default function FavoritesPage() {
  const { user, loading: sessionLoading } = useSession();
  const { favorites, upcomingConcerts, loading } = useFavorites();

  useSeoMeta({
    title: "Mis favoritos",
    description: "Conciertos, artistas y ciudades que has marcado como favoritos en ConcertRide ES.",
    canonical: `${SITE_URL}/favoritos`,
    noindex: true,
  });

  if (sessionLoading) return <LoadingSpinner text="Cargando…" />;
  if (!user) return <Navigate to="/login?next=/favoritos" replace />;

  const artistFavs = favorites.filter((f) => f.kind === "artist");
  const cityFavs = favorites.filter((f) => f.kind === "city");
  const concertFavs = favorites.filter((f) => f.kind === "concert");
  const empty = favorites.length === 0;

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-16">
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-12 space-y-4">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-secondary">
          Tu colección
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Favoritos.
        </h1>
        <p className="font-sans text-sm text-cr-text-muted max-w-xl">
          Conciertos, artistas y ciudades que sigues. Cuando alguien publique un viaje a un evento que te guste, lo verás aquí arriba.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24 space-y-16">
        {loading && favorites.length === 0 && <LoadingSpinner text="Cargando favoritos…" />}

        {empty && !loading && (
          <div className="border border-dashed border-cr-border p-10 text-center space-y-3">
            <Heart size={32} className="mx-auto text-cr-text-dim" strokeWidth={1.5} />
            <p className="font-display text-2xl uppercase text-cr-text-muted">Aún no hay favoritos</p>
            <p className="font-sans text-sm text-cr-text-dim">
              Marca conciertos, artistas o ciudades con el icono <Heart size={12} className="inline text-cr-secondary" />{" "}
              y los verás aquí agrupados.
            </p>
            <Link
              to="/concerts"
              className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary/10 transition-colors mt-3"
            >
              Explorar conciertos
            </Link>
          </div>
        )}

        {/* Upcoming concerts matching favourites */}
        {upcomingConcerts.length > 0 && (
          <section className="space-y-4">
            <header className="flex items-baseline justify-between gap-4 border-b border-cr-border pb-2">
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
                Próximos que te interesan
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
        {concertFavs.length > 0 && (
          <section className="space-y-4">
            <header className="flex items-center gap-2 border-b border-cr-border pb-2">
              <Music size={14} className="text-cr-text-muted" />
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
                Conciertos
              </h2>
              <span className="ml-auto font-mono text-xs text-cr-text-muted">{concertFavs.length}</span>
            </header>
            <ul className="divide-y divide-cr-border border border-cr-border">
              {concertFavs.map((f) => (
                <li key={f.id} className="flex items-center gap-3 p-3">
                  <Link
                    to={`/concerts/${f.target_id}`}
                    className="flex-1 font-sans text-sm text-cr-text hover:text-cr-primary transition-colors"
                  >
                    {f.label}
                  </Link>
                  <FavoriteButton kind="concert" targetId={f.target_id} label={f.label} size="sm" />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Artists */}
        {artistFavs.length > 0 && (
          <section className="space-y-4">
            <header className="flex items-center gap-2 border-b border-cr-border pb-2">
              <Mic2 size={14} className="text-cr-text-muted" />
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
                Artistas
              </h2>
              <span className="ml-auto font-mono text-xs text-cr-text-muted">{artistFavs.length}</span>
            </header>
            <ul className="flex flex-wrap gap-2">
              {artistFavs.map((f) => (
                <li key={f.id} className="flex items-center gap-2 border border-cr-border px-3 py-2">
                  <Link
                    to={`/concerts?artist=${encodeURIComponent(f.label)}`}
                    className="font-sans text-sm text-cr-text hover:text-cr-primary transition-colors"
                  >
                    {f.label}
                  </Link>
                  <FavoriteButton kind="artist" targetId={f.target_id} label={f.label} size="sm" />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Cities */}
        {cityFavs.length > 0 && (
          <section className="space-y-4">
            <header className="flex items-center gap-2 border-b border-cr-border pb-2">
              <MapPin size={14} className="text-cr-text-muted" />
              <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
                Ciudades
              </h2>
              <span className="ml-auto font-mono text-xs text-cr-text-muted">{cityFavs.length}</span>
            </header>
            <ul className="flex flex-wrap gap-2">
              {cityFavs.map((f) => (
                <li key={f.id} className="flex items-center gap-2 border border-cr-border px-3 py-2">
                  <Link
                    to={`/concerts?city=${encodeURIComponent(f.label)}`}
                    className="font-sans text-sm text-cr-text hover:text-cr-primary transition-colors"
                  >
                    {f.label}
                  </Link>
                  <FavoriteButton kind="city" targetId={f.target_id} label={f.label} size="sm" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}

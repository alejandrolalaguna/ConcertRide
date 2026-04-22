import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Concert, Favorite, FavoriteKind } from "@concertride/types";
import { api } from "./api";
import { useSession } from "./session";

interface FavoritesValue {
  favorites: Favorite[];
  upcomingConcerts: Concert[];
  loading: boolean;
  has: (kind: FavoriteKind, targetId: string) => boolean;
  // Optimistically flips the state; reverts on failure. Returns the resulting
  // "is-favorited" boolean after the call, so callers can show a toast.
  toggle: (kind: FavoriteKind, targetId: string, label: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesValue | null>(null);

// Artist/city target_ids are normalised to lowercase server-side. We mirror
// that here so `has()` and `toggle()` don't need the caller to remember.
function normalise(kind: FavoriteKind, targetId: string): string {
  return kind === "concert" ? targetId : targetId.trim().toLowerCase();
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [upcomingConcerts, setUpcomingConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setUpcomingConcerts([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.favorites.list();
      setFavorites(res.favorites);
      setUpcomingConcerts(res.upcoming_concerts);
    } catch {
      // Leave previous state alone on failure
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const index = useMemo(() => {
    const set = new Set<string>();
    for (const f of favorites) set.add(`${f.kind}:${f.target_id}`);
    return set;
  }, [favorites]);

  const has = useCallback(
    (kind: FavoriteKind, targetId: string) => index.has(`${kind}:${normalise(kind, targetId)}`),
    [index],
  );

  const toggle = useCallback(
    async (kind: FavoriteKind, targetId: string, label: string): Promise<boolean> => {
      if (!user) return false;
      const id = normalise(kind, targetId);
      const key = `${kind}:${id}`;
      const currentlyFav = index.has(key);

      if (currentlyFav) {
        // Optimistic removal
        const prev = favorites;
        setFavorites((list) => list.filter((f) => !(f.kind === kind && f.target_id === id)));
        try {
          await api.favorites.remove(kind, id);
          void refresh(); // re-pull upcoming concerts
          return false;
        } catch {
          setFavorites(prev); // revert
          return true;
        }
      } else {
        // Optimistic add — we mint a temp id until the server response lands
        const temp: Favorite = {
          id: `tmp_${Math.random().toString(36).slice(2, 10)}`,
          kind,
          target_id: id,
          label,
          created_at: new Date().toISOString(),
        };
        setFavorites((list) => [temp, ...list]);
        try {
          const saved = await api.favorites.add(kind, id, label);
          setFavorites((list) => list.map((f) => (f.id === temp.id ? saved : f)));
          void refresh();
          return true;
        } catch {
          setFavorites((list) => list.filter((f) => f.id !== temp.id));
          return false;
        }
      }
    },
    [user, index, favorites, refresh],
  );

  return (
    <FavoritesContext.Provider value={{ favorites, upcomingConcerts, loading, has, toggle, refresh }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}

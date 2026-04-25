import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { User } from "@concertride/types";
import { api } from "./api";
import { identify, resetIdentity } from "./observability";

interface SessionValue {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await api.auth.me();
      setUser(res.user);
      if (res.user) {
        identify(res.user.id, {
          home_city: res.user.home_city ?? undefined,
          verified: res.user.verified,
          license_verified: res.user.license_verified,
        });
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {
      /* ignore */
    }
    setUser(null);
    resetIdentity();
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <SessionContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}

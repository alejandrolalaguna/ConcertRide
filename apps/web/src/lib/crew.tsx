import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CrewMember } from "@concertride/types";
import { api } from "./api";
import { useSession } from "./session";
import { track } from "./observability";

interface CrewValue {
  crew: CrewMember[];
  pendingIncoming: CrewMember[];
  pendingOutgoing: CrewMember[];
  total: number;
  loading: boolean;
  isCrew: (userId: string) => boolean;
  isPendingWith: (userId: string) => "incoming" | "outgoing" | null;
  invite: (userId: string, opts?: { ride_id?: string }) => Promise<CrewMember | null>;
  accept: (userId: string) => Promise<CrewMember | null>;
  remove: (userId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const CrewContext = createContext<CrewValue | null>(null);

export function CrewProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [pendingIncoming, setPendingIncoming] = useState<CrewMember[]>([]);
  const [pendingOutgoing, setPendingOutgoing] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setCrew([]);
      setPendingIncoming([]);
      setPendingOutgoing([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.crew.list();
      setCrew(res.crew);
      setPendingIncoming(res.pending_incoming);
      setPendingOutgoing(res.pending_outgoing);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const crewIndex = useMemo(() => new Set(crew.map((c) => c.user.id)), [crew]);
  const incomingIndex = useMemo(
    () => new Set(pendingIncoming.map((c) => c.user.id)),
    [pendingIncoming],
  );
  const outgoingIndex = useMemo(
    () => new Set(pendingOutgoing.map((c) => c.user.id)),
    [pendingOutgoing],
  );

  const isCrew = useCallback((userId: string) => crewIndex.has(userId), [crewIndex]);
  const isPendingWith = useCallback(
    (userId: string): "incoming" | "outgoing" | null => {
      if (incomingIndex.has(userId)) return "incoming";
      if (outgoingIndex.has(userId)) return "outgoing";
      return null;
    },
    [incomingIndex, outgoingIndex],
  );

  const invite = useCallback(
    async (userId: string, opts?: { ride_id?: string }) => {
      if (!user || userId === user.id) return null;
      try {
        const member = await api.crew.invite(userId, opts?.ride_id);
        track("crew_invite_sent", { target: userId });
        if (member.status === "accepted") {
          setCrew((prev) => [member, ...prev.filter((c) => c.user.id !== userId)]);
        } else {
          setPendingOutgoing((prev) => [member, ...prev.filter((c) => c.user.id !== userId)]);
        }
        return member;
      } catch {
        return null;
      }
    },
    [user],
  );

  const accept = useCallback(
    async (userId: string) => {
      try {
        const member = await api.crew.accept(userId);
        track("crew_invite_accepted", { target: userId });
        setPendingIncoming((prev) => prev.filter((c) => c.user.id !== userId));
        setCrew((prev) => [member, ...prev.filter((c) => c.user.id !== userId)]);
        return member;
      } catch {
        return null;
      }
    },
    [],
  );

  const remove = useCallback(async (userId: string) => {
    try {
      await api.crew.remove(userId);
      track("crew_removed", { target: userId });
      setCrew((prev) => prev.filter((c) => c.user.id !== userId));
      setPendingIncoming((prev) => prev.filter((c) => c.user.id !== userId));
      setPendingOutgoing((prev) => prev.filter((c) => c.user.id !== userId));
    } catch {
      /* ignore */
    }
  }, []);

  const value: CrewValue = {
    crew,
    pendingIncoming,
    pendingOutgoing,
    total: crew.length,
    loading,
    isCrew,
    isPendingWith,
    invite,
    accept,
    remove,
    refresh,
  };

  return <CrewContext.Provider value={value}>{children}</CrewContext.Provider>;
}

export function useCrew(): CrewValue {
  const ctx = useContext(CrewContext);
  if (!ctx) throw new Error("useCrew must be used inside <CrewProvider>");
  return ctx;
}

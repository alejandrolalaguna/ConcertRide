import { useCallback, useEffect, useRef, useState } from "react";
import type { Message, MessageKind, Ride, User } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { ChatPanel } from "./ChatPanel";

interface Props {
  ride: Ride;
  currentUser: User;
}

type Tab = "ride" | "concert";

const POLL_MS = 5000;
const MAX_BACKOFF_MS = 60_000;

function usePollingFetch(
  fetchFn: () => Promise<void>,
  deps: unknown[],
) {
  const backoffRef = useRef(POLL_MS);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const schedule = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (!mountedRef.current || document.hidden) {
        backoffRef.current = POLL_MS;
        schedule();
        return;
      }
      try {
        await fetchFn();
        backoffRef.current = POLL_MS;
      } catch {
        backoffRef.current = Math.min(backoffRef.current * 2, MAX_BACKOFF_MS);
      }
      if (mountedRef.current) schedule();
    }, backoffRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    backoffRef.current = POLL_MS;
    void fetchFn();
    schedule();

    const onVisible = () => {
      if (!document.hidden && mountedRef.current) {
        if (timerRef.current) clearTimeout(timerRef.current);
        backoffRef.current = POLL_MS;
        void fetchFn();
        schedule();
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule]);
}

export function RideChatSection({ ride, currentUser }: Props) {
  const [tab, setTab] = useState<Tab>("ride");

  const [rideMessages, setRideMessages] = useState<Message[]>([]);
  const [rideLoading, setRideLoading] = useState(true);
  const [rideForbidden, setRideForbidden] = useState(false);

  const [concertMessages, setConcertMessages] = useState<Message[]>([]);
  const [concertLoading, setConcertLoading] = useState(true);
  const [concertForbidden, setConcertForbidden] = useState(false);

  const fetchRide = useCallback(async () => {
    try {
      const res = await api.messages.listRideThread(ride.id);
      setRideMessages(res.messages);
      setRideForbidden(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) setRideForbidden(true);
      throw err;
    } finally {
      setRideLoading(false);
    }
  }, [ride.id]);

  const fetchConcert = useCallback(async () => {
    try {
      const res = await api.messages.listConcertChat(ride.concert_id);
      setConcertMessages(res.messages);
      setConcertForbidden(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) setConcertForbidden(true);
      throw err;
    } finally {
      setConcertLoading(false);
    }
  }, [ride.concert_id]);

  usePollingFetch(fetchRide, [fetchRide]);
  usePollingFetch(fetchConcert, [fetchConcert]);

  async function sendRide(body: string, kind?: MessageKind, attachment_url?: string) {
    const msg = await api.messages.postRideThread(ride.id, { body, kind, attachment_url });
    setRideMessages((prev) => [...prev, msg]);
  }

  async function sendConcert(body: string, kind?: MessageKind, attachment_url?: string) {
    const msg = await api.messages.postConcertChat(ride.concert_id, { body, kind, attachment_url });
    setConcertMessages((prev) => [...prev, msg]);
  }

  return (
    <section aria-labelledby="chat-title" className="space-y-4">
      <h2 id="chat-title" className="font-display text-sm uppercase tracking-wide text-cr-text-muted">
        Chat
      </h2>

      <div className="flex gap-0 border-b border-cr-border">
        {(
          [
            { id: "ride" as Tab, label: "Tu viaje" },
            { id: "concert" as Tab, label: "Chat del concierto" },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] border-b-2 transition-colors ${
              tab === id
                ? "border-cr-primary text-cr-primary"
                : "border-transparent text-cr-text-muted hover:text-cr-text"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "ride" && (
        <ChatPanel
          messages={rideMessages}
          loading={rideLoading}
          forbidden={rideForbidden}
          currentUserId={currentUser.id}
          onSend={(body, kind, attachment_url) => sendRide(body, kind, attachment_url)}
        />
      )}
      {tab === "concert" && (
        <ChatPanel
          messages={concertMessages}
          loading={concertLoading}
          forbidden={concertForbidden}
          currentUserId={currentUser.id}
          onSend={(body, kind, attachment_url) => sendConcert(body, kind, attachment_url)}
        />
      )}
    </section>
  );
}

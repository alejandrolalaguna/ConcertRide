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

export function RideChatSection({ ride, currentUser }: Props) {
  const [tab, setTab] = useState<Tab>("ride");

  const [rideMessages, setRideMessages] = useState<Message[]>([]);
  const [rideLoading, setRideLoading] = useState(true);
  const [rideForbidden, setRideForbidden] = useState(false);

  const [concertMessages, setConcertMessages] = useState<Message[]>([]);
  const [concertLoading, setConcertLoading] = useState(true);
  const [concertForbidden, setConcertForbidden] = useState(false);

  const rideIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const concertIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchRide = useCallback(async () => {
    try {
      const res = await api.messages.listRideThread(ride.id);
      setRideMessages(res.messages);
      setRideForbidden(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) setRideForbidden(true);
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
    } finally {
      setConcertLoading(false);
    }
  }, [ride.concert_id]);

  useEffect(() => {
    fetchRide();
    rideIntervalRef.current = setInterval(fetchRide, POLL_MS);
    return () => { if (rideIntervalRef.current) clearInterval(rideIntervalRef.current); };
  }, [fetchRide]);

  useEffect(() => {
    fetchConcert();
    concertIntervalRef.current = setInterval(fetchConcert, POLL_MS);
    return () => { if (concertIntervalRef.current) clearInterval(concertIntervalRef.current); };
  }, [fetchConcert]);

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

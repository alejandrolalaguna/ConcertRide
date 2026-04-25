import { useEffect, useState } from "react";
import { useSession } from "./session";

type PushState = "unsupported" | "denied" | "subscribed" | "unsubscribed" | "loading";

async function getVapidPublicKey(): Promise<string> {
  const res = await fetch("/api/push/vapid-public-key", { credentials: "include" });
  if (!res.ok) throw new Error("Could not fetch VAPID key");
  const data = (await res.json()) as { key: string };
  return data.key;
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const buf = new ArrayBuffer(rawData.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < rawData.length; i++) {
    view[i] = rawData.charCodeAt(i);
  }
  return buf;
}

export function usePush(): { state: PushState; subscribe: () => Promise<void>; unsubscribe: () => Promise<void> } {
  const { user } = useSession();
  const [state, setState] = useState<PushState>("loading");

  useEffect(() => {
    if (!user) { setState("unsubscribed"); return; }
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || typeof Notification === "undefined") {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }

    // Race serviceWorker.ready against a 3s timeout — in some environments
    // (disabled SW in devtools, failed registration, iOS PWA install gap) the
    // ready Promise never resolves, which would leave the button stuck in
    // "loading" forever. Falling back to "unsubscribed" lets the user click.
    let cancelled = false;
    const timeoutId = setTimeout(() => {
      if (cancelled) return;
      cancelled = true;
      setState("unsubscribed");
    }, 3000);

    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        if (cancelled) return;
        cancelled = true;
        clearTimeout(timeoutId);
        setState(sub ? "subscribed" : "unsubscribed");
      })
      .catch(() => {
        if (cancelled) return;
        cancelled = true;
        clearTimeout(timeoutId);
        setState("unsubscribed");
      });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [user]);

  async function subscribe() {
    if (!("serviceWorker" in navigator)) return;
    setState("loading");
    try {
      const vapidKey = await getVapidPublicKey();
      if (!vapidKey) { setState("unsupported"); return; }

      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      if (existing) await existing.unsubscribe();

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const json = sub.toJSON();
      const keys = json.keys as { p256dh?: string; auth?: string } | undefined;
      await fetch("/api/push/subscribe", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          p256dh: keys?.p256dh ?? "",
          auth: keys?.auth ?? "",
        }),
      });
      setState("subscribed");
    } catch {
      setState(Notification.permission === "denied" ? "denied" : "unsubscribed");
    }
  }

  async function unsubscribe() {
    if (!("serviceWorker" in navigator)) return;
    setState("loading");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setState("unsubscribed");
    } catch {
      setState("unsubscribed");
    }
  }

  return { state, subscribe, unsubscribe };
}

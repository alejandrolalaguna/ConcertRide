import type { StoreAdapter } from "../store/adapter";
import type { Env } from "../env";
import { sendWebPush, type PushPayload } from "./webpush";

const VAPID_SUBJECT = "mailto:alejandrolalaguna@gmail.com";

export async function notifyUser(
  store: StoreAdapter,
  env: Env,
  userId: string,
  payload: PushPayload,
): Promise<void> {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) return;

  const subs = await store.getPushSubscriptionsForUser(userId).catch(() => []);
  await Promise.allSettled(
    subs.map((sub) =>
      sendWebPush(sub, payload, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY, VAPID_SUBJECT),
    ),
  );
}

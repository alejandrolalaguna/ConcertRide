// Web Push via VAPID using Web Crypto API (Cloudflare Workers compatible).
// No external dependencies — uses the native crypto.subtle available in the Workers runtime.

export interface PushSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

function base64UrlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const fixed = pad ? padded + "=".repeat(4 - pad) : padded;
  return Uint8Array.from(atob(fixed), (c) => c.charCodeAt(0));
}

function base64UrlEncode(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

async function buildVapidJwt(
  audience: string,
  subject: string,
  privateKeyBase64url: string,
): Promise<string> {
  const header = { alg: "ES256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = { aud: audience, exp: now + 3600, sub: subject };

  const enc = new TextEncoder();
  const headerB64 = base64UrlEncode(enc.encode(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(enc.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const rawKey = base64UrlDecode(privateKeyBase64url);
  const key = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    enc.encode(signingInput),
  );
  return `${signingInput}.${base64UrlEncode(sig)}`;
}

async function hkdfExtractAndExpand(
  salt: Uint8Array,
  ikm: ArrayBuffer,
  info: Uint8Array,
  length: number,
): Promise<ArrayBuffer> {
  const ikmKey = await crypto.subtle.importKey("raw", ikm, { name: "HKDF" }, false, ["deriveBits"]);
  return crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt, info },
    ikmKey,
    length * 8,
  );
}

export async function sendWebPush(
  subscription: PushSubscription,
  payload: PushPayload,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string,
): Promise<{ ok: boolean; status?: number }> {
  const bodyBytes = new TextEncoder().encode(JSON.stringify(payload));

  // Generate ephemeral ECDH key pair
  const ephemeralPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"],
  ) as CryptoKeyPair;

  const ephemeralPublicKeyRaw = await crypto.subtle.exportKey("raw", ephemeralPair.publicKey) as ArrayBuffer;

  // Import receiver's public key (P-256 raw)
  const receiverPublicKey = await crypto.subtle.importKey(
    "raw",
    base64UrlDecode(subscription.p256dh),
    { name: "ECDH", namedCurve: "P-256" },
    false,
    [],
  );

  // Derive ECDH shared secret
  const sharedSecret = await crypto.subtle.deriveBits(
    { name: "ECDH", public: receiverPublicKey } as unknown as Parameters<typeof crypto.subtle.deriveBits>[0],
    ephemeralPair.privateKey,
    256,
  );

  // RFC 8291: derive PRK with auth secret
  const authSecret = base64UrlDecode(subscription.auth);
  const receiverPublicRaw = base64UrlDecode(subscription.p256dh);
  const senderPublicRaw = new Uint8Array(ephemeralPublicKeyRaw);

  const salt = crypto.getRandomValues(new Uint8Array(16));

  // ikm = HMAC-SHA256(auth_secret, ecdh_secret || receiver_pub || sender_pub)
  const ikmHmacKey = await crypto.subtle.importKey(
    "raw",
    authSecret,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const ikmData = new Uint8Array([...new Uint8Array(sharedSecret), ...receiverPublicRaw, ...senderPublicRaw]);
  const ikm = await crypto.subtle.sign({ name: "HMAC" }, ikmHmacKey, ikmData);

  // Derive content encryption key
  const keyInfo = new TextEncoder().encode("Content-Encoding: aesgcm\0");
  const nonceInfo = new TextEncoder().encode("Content-Encoding: nonce\0");

  const keyBytes = await hkdfExtractAndExpand(salt, ikm, keyInfo, 16);
  const nonceBytes = await hkdfExtractAndExpand(salt, ikm, nonceInfo, 12);

  const encKey = await crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["encrypt"]);
  const nonce = new Uint8Array(nonceBytes);

  // Pad the plaintext (2-byte length prefix + zeros)
  const padded = new Uint8Array(bodyBytes.length + 2);
  padded.set(bodyBytes, 2);

  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, encKey, padded);

  // Build VAPID auth header
  const origin = new URL(subscription.endpoint).origin;
  const jwt = await buildVapidJwt(origin, vapidSubject, vapidPrivateKey);

  try {
    const resp = await fetch(subscription.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Encoding": "aesgcm",
        "Encryption": `salt=${base64UrlEncode(salt)}`,
        "Crypto-Key": `dh=${base64UrlEncode(senderPublicRaw)};p256ecdsa=${vapidPublicKey}`,
        Authorization: `vapid t=${jwt},k=${vapidPublicKey}`,
        TTL: "86400",
      },
      body: new Uint8Array(encrypted),
    });
    return { ok: resp.ok, status: resp.status };
  } catch {
    return { ok: false };
  }
}

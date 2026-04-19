// Dev-only in-memory magic-link token store. Replaced with a Turso table in M4c.

interface Entry {
  token: string;
  email: string;
  expires_at: number;
  consumed_at: number | null;
}

let entries: Entry[] = [];
const TTL_MS = 15 * 60 * 1000;

function purge() {
  const cutoff = Date.now() - 60 * 1000;
  entries = entries.filter((e) => e.expires_at > cutoff);
}

function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export const magicLinks = {
  create(email: string): string {
    purge();
    const token = randomToken();
    entries.push({
      token,
      email: email.toLowerCase(),
      expires_at: Date.now() + TTL_MS,
      consumed_at: null,
    });
    return token;
  },

  consume(token: string): string | null {
    purge();
    const entry = entries.find((e) => e.token === token);
    if (!entry) return null;
    if (entry.consumed_at !== null) return null;
    if (entry.expires_at < Date.now()) return null;
    entry.consumed_at = Date.now();
    return entry.email;
  },
};

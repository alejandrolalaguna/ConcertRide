// PBKDF2-SHA256 password hashing — uses Web Crypto (crypto.subtle), which is
// available in both Cloudflare Workers and Node ≥ 20 without any imports.
// Salt and hash are stored as hex strings.

const ITERATIONS = 100_000;
const KEY_LENGTH = 32; // bytes → 64 hex chars

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuf(hex: string): Uint8Array {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return arr;
}

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const saltBuf = crypto.getRandomValues(new Uint8Array(16));
  const salt = bufToHex(saltBuf.buffer);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBuf.buffer, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    KEY_LENGTH * 8,
  );
  return { hash: bufToHex(derived), salt };
}

export async function verifyPassword(
  password: string,
  storedHash: string,
  storedSalt: string,
): Promise<boolean> {
  const saltBuf = hexToBuf(storedSalt);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBuf.buffer as ArrayBuffer, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    KEY_LENGTH * 8,
  );
  return bufToHex(derived) === storedHash;
}

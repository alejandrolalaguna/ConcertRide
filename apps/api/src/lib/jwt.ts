import { SignJWT, jwtVerify } from "jose";

export interface SessionClaims {
  sub: string;
  email: string;
}

const ISSUER = "concertride";

function key(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export async function signSession(claims: SessionClaims, secret: string): Promise<string> {
  return await new SignJWT({ email: claims.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setSubject(claims.sub)
    .setExpirationTime("30d")
    .sign(key(secret));
}

export async function verifySession(
  token: string,
  secret: string,
): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, key(secret), { issuer: ISSUER });
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

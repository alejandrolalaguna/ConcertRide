// Canonical fingerprint used by the ingestion pipeline (M5) to dedup a concert
// across sources. Same recipe re-used by the seed script so fixture concerts
// collide cleanly with real-ingestion rows.

export async function computeFingerprint(
  artist: string,
  venueCity: string,
  dateIso: string,
): Promise<string> {
  const day = dateIso.slice(0, 10); // YYYY-MM-DD
  const input = `${artist.trim().toLowerCase()}|${venueCity.trim().toLowerCase()}|${day}`;
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

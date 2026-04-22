// Concert genre strings in the wild are compound — Ticketmaster returns values
// like "Rock", but fixtures carry "Festival / Rock", "Pop / Flamenco",
// "Indie Pop", etc. A user picking "Rock" from a filter expects to match all of
// those. These helpers normalise compound strings into individual tags so the
// UI can render them as discrete filter options and the server can match any
// of them with a simple LIKE.

const SEPARATORS = /\s*[\/,&]\s*/;

export function parseGenreTags(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(SEPARATORS)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// Whether a DB row's raw genre string contains a given tag — case-insensitive,
// whole-tag match (so "Pop" matches "Pop / Flamenco" but not "K-Pop").
export function genreMatches(rawGenre: string | null | undefined, tag: string): boolean {
  if (!rawGenre || !tag) return false;
  const needle = tag.toLowerCase();
  return parseGenreTags(rawGenre).some((t) => t.toLowerCase() === needle);
}

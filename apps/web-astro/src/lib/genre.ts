// Mirrors apps/api/src/lib/genre.ts — keep the split rules in sync.
const SEPARATORS = /\s*[\/,&]\s*/;

export function parseGenreTags(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(SEPARATORS)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

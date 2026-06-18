// seatPrice — render a per-seat carpooling price range with EXACTLY one unit suffix.
//
// Why this exists: the source data is inconsistent. Some `concertRideRange`/`range`
// values already end in "/asiento" (e.g. "4–7 €/asiento"), others don't ("4–7 €"),
// and historically render code appended "/asiento" (or `.replace("/asiento","/seat")`)
// on top — producing the visible bug "4–7 €/asiento/asiento" (and "…/seat/seat" in EN).
//
// This helper is IDEMPOTENT: it strips any existing /asiento or /seat suffix and then
// appends the locale-correct unit exactly once. Safe to wrap around values that already
// have the unit (no-op) and around values that lack it (adds it).
export function seatPrice(range: string | null | undefined, isEn: boolean): string {
  const unit = isEn ? "/seat" : "/asiento";
  const raw = (range ?? "").trim();
  const base = raw.replace(/\s*\/\s*(asiento|seat)s?\s*$/i, "").trim();
  const price = base || (isEn ? "€3" : "3 €");
  return `${price}${unit}`;
}

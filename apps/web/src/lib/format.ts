const DATE_FMT = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const TIME_FMT = new Intl.DateTimeFormat("es-ES", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Europe/Madrid",
});

const DAY_FMT = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "short",
});

export const formatDate = (iso: string) => DATE_FMT.format(new Date(iso));
export const formatTime = (iso: string) => TIME_FMT.format(new Date(iso));
export const formatDay = (iso: string) => DAY_FMT.format(new Date(iso));
export const formatPrice = (n: number) => `€${Math.round(n)}`;

/** Strips the internal "u_" prefix to build public-facing driver profile URLs. */
export function driverPath(userId: string): string {
  return `/drivers/${userId.startsWith("u_") ? userId.slice(2) : userId}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

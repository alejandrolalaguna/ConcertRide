import { Heart } from "lucide-react";
import type { FavoriteKind } from "@concertride/types";
import { useFavorites } from "@/lib/favorites";
import { useSession } from "@/lib/session";
import { useNavigate } from "react-router-dom";

interface Props {
  kind: FavoriteKind;
  targetId: string;
  label: string;
  size?: "sm" | "md";
  variant?: "icon" | "pill";
  className?: string;
  // If set, clicking while logged out redirects to /login?next=... instead of
  // silently doing nothing. Useful in detail pages, less so on list cards.
  promptLoginOnAnon?: boolean;
}

export function FavoriteButton({
  kind,
  targetId,
  label,
  size = "md",
  variant = "icon",
  className = "",
  promptLoginOnAnon = false,
}: Props) {
  const { user } = useSession();
  const { has, toggle } = useFavorites();
  const navigate = useNavigate();

  const active = !!user && has(kind, targetId);
  const iconSize = size === "sm" ? 12 : 14;

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      if (promptLoginOnAnon) navigate(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    await toggle(kind, targetId, label);
  }

  const title = active ? "Quitar de favoritos" : "Añadir a favoritos";

  if (variant === "pill") {
    const verb = active ? "Siguiendo" : "Seguir";
    const noun = kind === "concert" ? "concierto" : kind === "artist" ? "artista" : "ciudad";
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        aria-label={title}
        title={title}
        className={`inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] border-2 px-3 py-1.5 transition-colors ${
          active
            ? "border-cr-secondary text-cr-secondary bg-cr-secondary/10"
            : "border-cr-border text-cr-text-muted hover:border-cr-secondary hover:text-cr-secondary"
        } ${className}`}
      >
        <Heart size={iconSize} fill={active ? "currentColor" : "none"} strokeWidth={2} />
        {verb} {noun}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={title}
      title={title}
      className={`inline-flex items-center justify-center w-8 h-8 border transition-colors ${
        active
          ? "border-cr-secondary bg-cr-secondary/15 text-cr-secondary"
          : "border-cr-border bg-cr-bg/80 text-cr-text-muted hover:border-cr-secondary hover:text-cr-secondary"
      } ${className}`}
    >
      <Heart size={iconSize} fill={active ? "currentColor" : "none"} strokeWidth={2} />
    </button>
  );
}

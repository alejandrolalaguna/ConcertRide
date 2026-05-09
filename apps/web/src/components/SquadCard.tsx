import { Link } from "react-router-dom";
import type { Squad } from "@concertride/types";
import { CrewAvatars } from "./CrewAvatars";

interface Props {
  squad: Squad;
  // Where the user lands when clicking the card. For their own squads → /squads/:id; for public discovery → /squads/join/:code
  href?: string;
  className?: string;
}

export function SquadCard({ squad, href, className }: Props) {
  const target = href ?? `/squads/${squad.id}`;
  const seatsAvailable = squad.rides.reduce((sum, r) => sum + r.seats_left, 0);
  const tags = squad.vibe_tags.slice(0, 4);

  return (
    <Link
      to={target}
      className={`block border-2 border-cr-border bg-cr-surface-2 p-4 transition hover:border-cr-primary hover:bg-cr-surface ${className ?? ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cr-text-muted">
            squad · {squad.visibility === "public" ? "abierto" : "privado"}
          </p>
          <h3 className="mt-1 font-display text-xl uppercase leading-tight">{squad.name}</h3>
        </div>
        <span className="rounded-full border border-cr-primary px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-cr-primary">
          {squad.members.length}
        </span>
      </div>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-cr-text-muted">
        🎤 {squad.concert.artist}
      </p>
      <div className="mt-3">
        <CrewAvatars
          size="sm"
          people={squad.members.slice(0, 5).map((m) => ({
            id: m.user.id,
            name: m.user.name,
            avatar_url: m.user.avatar_url,
          }))}
          label={
            squad.rides.length > 0
              ? `${squad.rides.length} ${squad.rides.length === 1 ? "coche" : "coches"} · ${seatsAvailable} plaza${seatsAvailable === 1 ? "" : "s"}`
              : `${squad.members.length} ${squad.members.length === 1 ? "persona" : "personas"}`
          }
        />
      </div>
      {tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <li
              key={t}
              className="border border-cr-border-mid px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-cr-text-muted"
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </Link>
  );
}

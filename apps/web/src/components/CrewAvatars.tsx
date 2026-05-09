import { Link } from "react-router-dom";
import type { CrewMember } from "@concertride/types";

export interface AvatarPerson {
  id: string;
  name: string;
  avatar_url: string | null;
}

interface Props {
  // Either pass full CrewMember objects (when you have them) or thin
  // AvatarPerson (when only id + name + avatar are available).
  crew?: CrewMember[];
  people?: AvatarPerson[];
  max?: number;
  size?: "xs" | "sm" | "md" | "lg";
  label?: string;
  clickable?: boolean;
  className?: string;
}

const SIZES: Record<NonNullable<Props["size"]>, { box: string; ring: string; text: string }> = {
  xs: { box: "h-6 w-6", ring: "ring-1", text: "text-[10px]" },
  sm: { box: "h-7 w-7", ring: "ring-2", text: "text-[11px]" },
  md: { box: "h-9 w-9", ring: "ring-2", text: "text-xs" },
  lg: { box: "h-12 w-12", ring: "ring-2", text: "text-sm" },
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "C") + (parts[1]?.[0] ?? "");
}

export function CrewAvatars({ crew, people, max = 4, size = "md", label, clickable = false, className }: Props) {
  const personList: AvatarPerson[] = people ?? (crew ?? []).map((c) => ({
    id: c.user.id,
    name: c.user.name,
    avatar_url: c.user.avatar_url,
  }));
  if (!personList.length) return null;
  const visible = personList.slice(0, max);
  const overflow = personList.length - visible.length;
  const sz = SIZES[size];

  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <div className="flex -space-x-2">
        {visible.map((user) => {
          const content = user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt=""
              className={`${sz.box} rounded-full object-cover ${sz.ring} ring-cr-bg`}
              loading="lazy"
            />
          ) : (
            <span
              className={`${sz.box} ${sz.text} ring-cr-bg ${sz.ring} inline-flex items-center justify-center rounded-full bg-cr-primary font-bold uppercase text-cr-text-inverse`}
              aria-hidden
            >
              {initials(user.name)}
            </span>
          );
          if (clickable) {
            return (
              <Link
                key={user.id}
                to={`/drivers/${user.id}`}
                title={user.name}
                className="hover:translate-y-[-2px] transition-transform"
              >
                {content}
              </Link>
            );
          }
          return (
            <span key={user.id} title={user.name}>
              {content}
            </span>
          );
        })}
        {overflow > 0 && (
          <span
            className={`${sz.box} ${sz.text} ring-cr-bg ${sz.ring} inline-flex items-center justify-center rounded-full bg-cr-surface-3 font-bold text-cr-text-muted`}
          >
            +{overflow}
          </span>
        )}
      </div>
      {label && (
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-cr-text-muted">
          {label}
        </span>
      )}
    </div>
  );
}

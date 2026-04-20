import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { useSession } from "@/lib/session";
import { initials } from "@/lib/format";

export function TopNav() {
  const { user, loading, logout } = useSession();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (loading) return null;

  const next = encodeURIComponent(location.pathname + location.search);

  return (
    <nav
      ref={ref}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 h-14 bg-cr-bg/90 backdrop-blur border-b border-cr-border font-sans text-xs"
    >
      <Link
        to="/"
        className="font-display text-sm uppercase tracking-[0.08em] hover:text-cr-primary transition-colors"
      >
        Concert<span className="text-cr-primary">Ride</span>
      </Link>
      {user ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
            className="inline-flex items-center gap-2 bg-cr-surface/85 backdrop-blur border border-cr-border hover:border-cr-primary text-cr-text hover:text-cr-primary pl-2 pr-3 py-1.5 transition-colors"
          >
            <span
              aria-hidden="true"
              className="w-6 h-6 rounded-full bg-cr-primary text-black font-mono text-[10px] flex items-center justify-center"
            >
              {initials(user.name)}
            </span>
            <span className="font-semibold uppercase tracking-[0.12em] hidden sm:inline">
              {user.name.split(" ")[0]}
            </span>
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 mt-2 min-w-[200px] bg-cr-surface border border-cr-border divide-y divide-cr-border shadow-[0_0_24px_rgb(0_0_0_/_0.6)]"
            >
              <div className="px-4 py-3 space-y-0.5">
                <p className="font-mono text-[11px] text-cr-text truncate">{user.email}</p>
                <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-cr-text-muted">
                  {user.rides_given} viajes · ★ {user.rating.toFixed(1)}
                </p>
              </div>
              <Link
                to="/publish"
                onClick={() => setOpen(false)}
                role="menuitem"
                className="flex items-center gap-2 px-4 py-2.5 hover:bg-cr-surface-2 hover:text-cr-primary"
              >
                <UserIcon size={12} aria-hidden="true" /> Publicar un viaje
              </Link>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                role="menuitem"
                className="flex items-center gap-2 px-4 py-2.5 hover:bg-cr-surface-2 hover:text-cr-primary"
              >
                <Settings size={12} aria-hidden="true" /> Mi perfil
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={async () => {
                  setOpen(false);
                  await logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-cr-surface-2 hover:text-cr-secondary"
              >
                <LogOut size={12} aria-hidden="true" /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          to={`/login${next !== "%2F" ? `?next=${next}` : ""}`}
          className="inline-flex items-center gap-1.5 bg-cr-surface/85 backdrop-blur border border-cr-border hover:border-cr-primary text-cr-text hover:text-cr-primary px-3 py-1.5 font-semibold uppercase tracking-[0.12em] transition-colors"
        >
          Entrar
        </Link>
      )}
    </nav>
  );
}

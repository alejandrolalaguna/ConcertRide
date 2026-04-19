import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";

interface Props {
  initialQuery?: string;
  initialDate?: string;
  onSubmit: (values: { q: string; date: string }) => void;
  sticky?: boolean;
}

export function SearchBar({ initialQuery = "", initialDate = "", onSubmit, sticky = true }: Props) {
  const [q, setQ] = useState(initialQuery);
  const [date, setDate] = useState(initialDate);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({ q: q.trim(), date });
  }

  return (
    <div
      className={
        sticky
          ? "sticky top-0 z-40 bg-cr-bg/95 backdrop-blur supports-[backdrop-filter]:bg-cr-bg/80"
          : ""
      }
    >
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex flex-col md:flex-row gap-2 p-3 border-b border-cr-border"
      >
        <label className="flex-1 relative">
          <span className="sr-only">Artista o ciudad</span>
          <Search
            size={14}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cr-text-muted pointer-events-none"
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Artista o ciudad"
            className="w-full pl-9 pr-3 py-3 bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none font-sans text-sm text-cr-text placeholder:text-cr-text-dim transition-colors"
          />
        </label>

        <label className="md:w-48">
          <span className="sr-only">Fecha</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-3 bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none font-mono text-sm text-cr-text [color-scheme:dark] transition-colors"
          />
        </label>

        <button
          type="submit"
          className="bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}

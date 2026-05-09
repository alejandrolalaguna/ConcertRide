import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { TripMemory } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { TripVibeCard } from "@/components/TripVibeCard";

export default function MemoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [memory, setMemory] = useState<TripMemory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.memories
      .get(id)
      .then(setMemory)
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 404) setError("not_found");
        else setError("load_failed");
      });
  }, [id]);

  // Memories with visibility !== "public" must NEVER be indexed even if the
  // crawler somehow lands on them — their content is intended for crew/owner
  // viewing only. Public memories are indexable as social proof landing.
  const memoryIsIndexable = memory?.visibility === "public";
  useSeoMeta({
    title: memory ? `${memory.title} · Recuerdo · ConcertRide` : "Recuerdo · ConcertRide",
    description: memory
      ? `${memory.creator_name} compartió un recuerdo del viaje a ${memory.concert_artist}: ${memory.caption ?? memory.title}`
      : "Recuerdo de un viaje a un concierto.",
    canonical: id ? `${SITE_URL}/memorias/${id}` : undefined,
    ogImage: memory?.share_image_url ? `${SITE_URL}${memory.share_image_url}` : undefined,
    ogType: "article",
    noindex: !memoryIsIndexable,
  });

  if (error === "not_found") {
    return (
      <main className="min-h-dvh bg-cr-bg pt-14 px-6 text-center">
        <p className="mt-20 font-display text-2xl uppercase text-cr-text-muted">Recuerdo no encontrado</p>
        <Link to="/" className="mt-4 inline-block text-cr-primary underline">Inicio</Link>
      </main>
    );
  }
  if (!memory) {
    return <main className="min-h-dvh bg-cr-bg pt-14 px-6"><p className="mt-20 text-center text-cr-text-muted">Cargando…</p></main>;
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : `${SITE_URL}/memorias/${memory!.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: memory!.title, text: memory!.caption ?? memory!.concert_artist, url });
        await api.memories.share(memory!.id);
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      await api.memories.share(memory!.id);
    } catch {
      /* ignore */
    }
  }

  return (
    <main id="main" className="min-h-dvh bg-cr-bg pt-14 text-cr-text">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted hover:text-cr-primary">
          ← ConcertRide
        </Link>
        <div className="mt-6">
          <TripVibeCard memory={memory} shareable onShare={handleShare} />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={`/concerts/${memory.concert_id}`}
            className="border-2 border-cr-primary px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cr-primary hover:bg-cr-primary hover:text-cr-text-inverse"
          >
            Ver evento
          </Link>
          <Link
            to={`/drivers/${memory.created_by}`}
            className="border-2 border-cr-border px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-cr-text-muted hover:border-cr-primary hover:text-cr-primary"
          >
            Ver autor →
          </Link>
        </div>
      </div>
    </main>
  );
}

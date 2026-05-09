import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Calendar, Clock, X } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blogPosts";

export default function BlogIndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? undefined;
  const searchQuery = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(searchQuery);

  useSeoMeta({
    title: "Blog ConcertRide · Carpooling y festivales España 2026",
    description:
      "Guías y comparativas de transporte para festivales en España 2026. Carpooling vs taxi, autobuses, huella de carbono. Viaja mejor y gasta menos.",
    canonical: `${SITE_URL}/blog`,
    keywords:
      "blog carpooling festivales 2026, guía transporte festivales españa 2026, autobuses festivales 2026, como ir a un festival sin coche, cómo volver de un festival de madrugada, alternativa blablacar festivales, carpooling sin comisión festivales, transporte concierto españa 2026, huella carbono festival carpooling, coche compartido festival verano 2026, festivales música españa 2026, que llevar al festival verano, vuelta madrugada festival carpooling, taxi festival precio alternativa, sostenibilidad festivales españa",
  });

  const sorted = useMemo(() => {
    let filtered = [...BLOG_POSTS];

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [selectedCategory, searchQuery]);

  const jsonLdBlog = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    url: `${SITE_URL}/blog`,
    name: "Blog ConcertRide · Carpooling, festivales y sostenibilidad",
    description: "Comparativas, guías de transporte y sostenibilidad para asistentes a festivales en España.",
    inLanguage: "es-ES",
    datePublished: "2026-04-10",
    dateModified: sorted[0]?.publishedAt ?? new Date().toISOString().slice(0, 10),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#service` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable"],
    },
    blogPost: sorted.map((p) => ({
      "@type": "BlogPosting",
      "@id": `${SITE_URL}/blog/${p.slug}#article`,
      headline: p.title,
      description: p.excerpt,
      abstract: p.excerpt.split(/(?<=[.!?])\s+/).slice(0, 2).join(" "),
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt,
      dateModified: p.updatedAt ?? p.publishedAt,
      author: {
        "@type": "Person",
        name: p.author,
      },
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "es-ES",
    })),
  };

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Blog ConcertRide · Guías de transporte para festivales",
    url: `${SITE_URL}/blog`,
    numberOfItems: BLOG_POSTS.length,
    itemListElement: BLOG_POSTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      description: p.excerpt,
    })),
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué es ConcertRide?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ConcertRide es la primera plataforma española de carpooling exclusiva para conciertos y festivales. Conecta conductores y pasajeros que van al mismo evento, sin comisión y con conductores verificados.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo funciona el carpooling para festivales?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El conductor publica un viaje con origen, destino (el festival), precio por asiento y plazas disponibles. El pasajero encuentra el viaje, contacta al conductor y reserva. El pago se realiza en efectivo o Bizum el día del viaje. ConcertRide no cobra comisión.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto cuesta un viaje compartido a un festival en España?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Los precios van de 3 a 20 € por asiento según la distancia. El conductor fija el precio para cubrir combustible y peajes. Es entre un 50 y un 75 % más barato que un taxi.",
        },
      },
    ],
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBlog) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">Blog</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Blog
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Carpooling festivales<br />España 2026:<br />guías y comparativas.
        </h1>
        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable">
          ConcertRide es la plataforma española de carpooling para conciertos y festivales.
          Comparativas honestas, guías prácticas y datos reales para que ir a un festival
          en España sea más barato, más sostenible y menos estresante.
        </p>
      </div>

      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                const newParams = new URLSearchParams(searchParams);
                if (e.target.value.trim()) {
                  newParams.set("search", e.target.value);
                } else {
                  newParams.delete("search");
                }
                setSearchParams(newParams);
              }}
              className="w-full px-4 py-3 bg-cr-bg border border-cr-border text-cr-text placeholder-cr-text-muted focus:outline-none focus:border-cr-primary focus:ring-1 focus:ring-cr-primary/30 font-sans text-sm"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput("");
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete("search");
                  setSearchParams(newParams);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cr-text-muted hover:text-cr-text"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete("category");
                setSearchParams(newParams);
              }}
              className={`inline-flex items-center gap-1.5 font-mono text-[11px] px-3 py-1.5 transition-colors ${
                !selectedCategory
                  ? "border border-cr-primary bg-cr-primary/10 text-cr-primary"
                  : "border border-cr-border text-cr-text-muted hover:border-cr-primary/40"
              }`}
            >
              Todas
            </button>
            {BLOG_CATEGORIES.map((cat) => {
              const count = BLOG_POSTS.filter((p) => p.category === cat.slug).length;
              if (count === 0) return null;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    if (isSelected) {
                      newParams.delete("category");
                    } else {
                      newParams.set("category", cat.slug);
                    }
                    setSearchParams(newParams);
                  }}
                  className={`inline-flex items-center gap-1.5 font-mono text-[11px] px-3 py-1.5 transition-colors ${
                    isSelected
                      ? "border border-cr-primary bg-cr-primary/10 text-cr-primary"
                      : "border border-cr-border text-cr-text-muted hover:border-cr-primary/40"
                  }`}
                >
                  {cat.label} <span className={isSelected ? "text-cr-primary" : "text-cr-text-muted"}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <ol className="space-y-8">
          {sorted.map((post) => (
            <li key={post.slug}>
              <article className="border border-cr-border p-6 hover:border-cr-primary/50 transition-colors group">
                <div className="flex flex-wrap items-center gap-3 mb-4 font-mono text-[11px] text-cr-text-muted">
                  <span className="text-cr-primary uppercase tracking-[0.12em]">
                    {BLOG_CATEGORIES.find((c) => c.slug === post.category)?.label ?? post.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={11} />
                    {new Date(post.publishedAt).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={11} />
                    {post.readingMinutes} min
                  </span>
                </div>

                <h2 className="font-display text-2xl md:text-3xl uppercase leading-tight mb-3">
                  <Link to={`/blog/${post.slug}`} className="hover:text-cr-primary transition-colors">
                    {post.title}
                  </Link>
                </h2>

                <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl mb-5">
                  {post.excerpt}
                </p>

                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-primary border-b border-cr-primary/40 hover:border-cr-primary transition-colors"
                >
                  Leer artículo <ArrowRight size={12} />
                </Link>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-10">
        <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
          Explora también
        </h2>
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link
              to="/festivales"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
            >
              Festivales 2026
            </Link>
          </li>
          <li>
            <Link
              to="/guia-transporte-festivales"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
            >
              Guía de transporte
            </Link>
          </li>
          <li>
            <Link
              to="/como-funciona"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
            >
              Cómo funciona
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}

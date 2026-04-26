import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blogPosts";

export default function BlogIndexPage() {
  useSeoMeta({
    title: "Blog ConcertRide — Carpooling, festivales y sostenibilidad",
    description:
      "Comparativas, guías de transporte y sostenibilidad para asistentes a festivales en España. Aprende a moverte mejor, gastar menos y reducir tu huella.",
    canonical: `${SITE_URL}/blog`,
    keywords:
      "blog carpooling, guía festivales España, transporte concierto, huella carbono festival, carpooling conciertos",
  });

  const sorted = [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog ConcertRide",
    url: `${SITE_URL}/blog`,
    inLanguage: "es-ES",
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: sorted.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt,
      dateModified: p.updatedAt ?? p.publishedAt,
      author: { "@type": "Organization", name: p.author },
      description: p.excerpt,
      articleSection: p.category,
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

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

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
          Carpooling,<br />festivales,<br />sostenibilidad.
        </h1>
        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed">
          Comparativas honestas, guías prácticas y datos reales para que ir a un festival
          en España sea más barato, más sostenible y menos estresante.
        </p>
      </div>

      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
        <ul className="flex flex-wrap gap-2 mb-10">
          {BLOG_CATEGORIES.map((cat) => {
            const count = BLOG_POSTS.filter((p) => p.category === cat.slug).length;
            if (count === 0) return null;
            return (
              <li key={cat.slug}>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-3 py-1.5">
                  {cat.label} <span className="text-cr-primary">{count}</span>
                </span>
              </li>
            );
          })}
        </ul>

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

import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, Calendar, Check, Clock, Copy, ArrowLeft, Share2 } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { BLOG_POSTS_BY_SLUG, BLOG_CATEGORIES } from "@/lib/blogPosts";
import { FESTIVAL_LANDINGS_BY_SLUG } from "@/lib/festivalLandings";
import { AutoLinksForFestival, AutoLinksForBlog } from "@/lib/autoLinking";
import { trackBlogView } from "@/lib/seoEvents";

function ShareCite({ url, title }: { url: string; title: string }) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCite, setCopiedCite] = useState(false);
  const year = new Date().getFullYear();
  const citation = `${title}. ConcertRide (${year}). ${url}`;

  function copyUrl() {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    });
  }
  function copyCite() {
    navigator.clipboard.writeText(citation).then(() => {
      setCopiedCite(true);
      setTimeout(() => setCopiedCite(false), 2000);
    });
  }
  const tweetText = encodeURIComponent(`${title} — vía @ConcertRide_ES ${url}`);

  return (
    <section className="border-t border-cr-border pt-8 space-y-3">
      <p className="font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.12em] flex items-center gap-2">
        <Share2 size={11} /> Compartir y citar
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={copyUrl}
          className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
        >
          {copiedUrl ? <Check size={11} /> : <Copy size={11} />}
          {copiedUrl ? "URL copiada" : "Copiar URL"}
        </button>
        <button
          onClick={copyCite}
          className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
        >
          {copiedCite ? <Check size={11} /> : <Copy size={11} />}
          {copiedCite ? "Cita copiada" : "Citar artículo"}
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
        >
          Compartir en X
        </a>
      </div>
    </section>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? BLOG_POSTS_BY_SLUG[slug] : undefined;

  // Detect if this post links to a festival how-to page (e.g. "/como-llegar/arenal-sound")
  const relatedFestivalSlug = post
    ? (post.relatedLinks ?? [])
        .map((l) => l.to)
        .find((t) => t.startsWith("/como-llegar/"))
        ?.split("/")
        .pop()
    : undefined;

  const relatedFestival = relatedFestivalSlug ? FESTIVAL_LANDINGS_BY_SLUG[relatedFestivalSlug] : undefined;

  // Only append year to title if the title doesn't already contain a 4-digit year.
  const postYear = post ? new Date(post.publishedAt).getFullYear() : null;
  const titleHasYear = post ? /\b20\d{2}\b/.test(post.title) : false;
  useSeoMeta({
    title: post
      ? titleHasYear
        ? `${post.title} | ConcertRide`
        : `${post.title} ${postYear} | ConcertRide`
      : "Artículo no encontrado",
    description: post?.excerpt,
    canonical: post ? `${SITE_URL}/blog/${post.slug}` : `${SITE_URL}/blog`,
    keywords: post?.tags.join(", "),
    ogImage: post?.coverImage?.src
      ? (post.coverImage.src.startsWith("http") ? post.coverImage.src : `${SITE_URL}${post.coverImage.src}`)
      : undefined,
    ogType: "article",
    ogImageAlt: post?.coverImage?.alt
      ?? (post ? `${post.title} — guía de transporte y carpooling — ConcertRide` : "Blog de transporte y carpooling para conciertos — ConcertRide"),
    articleAuthor: post?.author,
    articlePublishedTime: post?.publishedAt,
    articleModifiedTime: post?.updatedAt ?? post?.publishedAt,
    articleSection: post ? BLOG_CATEGORIES.find((c) => c.slug === post.category)?.label : undefined,
    articleTags: post?.tags,
    noindex: !post,
    // GEO hints when the post is explicitly about a festival/how-to page
    geoRegion: relatedFestival ? relatedFestival.region : undefined,
    geoPlacename: relatedFestival ? `${relatedFestival.city}, España` : undefined,
    geoLat: relatedFestival ? relatedFestival.lat : undefined,
    geoLng: relatedFestival ? relatedFestival.lng : undefined,
  });

  useEffect(() => {
    if (post) trackBlogView(post.slug, post.title);
  }, [post]);

  if (!slug || !post) return <Navigate to="/blog" replace />;

  const categoryLabel = BLOG_CATEGORIES.find((c) => c.slug === post.category)?.label ?? post.category;
  const url = `${SITE_URL}/blog/${post.slug}`;

  // Build a fact-rich abstract: first 2 sentences of the excerpt (≤60 words, key finding + data)
  const articleAbstract = (() => {
    const sentences = post.excerpt.split(/(?<=[.!?])\s+/);
    let abstract = "";
    for (const s of sentences) {
      if ((abstract + " " + s).trim().split(/\s+/).length > 60) break;
      abstract = (abstract + " " + s).trim();
    }
    return abstract || post.excerpt.slice(0, 280);
  })();

  // Known entity sameAs URIs for common tags
  const ENTITY_SAME_AS: Record<string, string> = {
    "autobuses": "https://www.wikidata.org/wiki/Q928830",
    "buses": "https://www.wikidata.org/wiki/Q928830",
    "carpooling": "https://www.wikidata.org/wiki/Q1343571",
    "festivales": "https://www.wikidata.org/wiki/Q213492",
    "transporte": "https://www.wikidata.org/wiki/Q7590",
    "lanzadera": "https://www.wikidata.org/wiki/Q1392594",
    "sostenibilidad": "https://www.wikidata.org/wiki/Q219416",
    "Mad Cool": "https://www.wikidata.org/wiki/Q22808739",
    "Primavera Sound": "https://www.wikidata.org/wiki/Q578193",
    "Sónar": "https://www.wikidata.org/wiki/Q1101937",
    "BBK Live": "https://www.wikidata.org/wiki/Q1966430",
    "Arenal Sound": "https://www.wikidata.org/wiki/Q4791029",
    "Viña Rock": "https://www.wikidata.org/wiki/Q2311477",
    "Resurrection Fest": "https://www.wikidata.org/wiki/Q7316296",
    "BlaBlaCar": "https://www.wikidata.org/wiki/Q2115189",
    "Sonorama": "https://www.wikidata.org/wiki/Q1305386",
    "FIB": "https://www.wikidata.org/wiki/Q630302",
    "Medusa": "https://www.wikidata.org/wiki/Q60882827",
  };

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    name: post.title,
    description: post.excerpt,
    abstract: articleAbstract,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: "es-ES",
    articleSection: categoryLabel,
    keywords: post.tags.join(", "),
    wordCount: post.sections.reduce((acc, s) => acc + s.paragraphs.join(" ").split(/\s+/).length, 0),
    author: {
      "@type": "Person",
      name: post.author?.trim() || "ConcertRide",
      url: `${SITE_URL}/acerca-de`,
      "@id": `${SITE_URL}/#founder`,
      sameAs: [
        "https://www.linkedin.com/company/concertride-es",
        "https://twitter.com/concertride_es",
      ],
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    audience: { "@type": "Audience", audienceType: "Aficionados a la música y asistentes a festivales en España", geographicArea: { "@type": "Country", name: "Spain" } },
    image: post.coverImage
      ? {
          "@type": "ImageObject",
          url: post.coverImage.src.startsWith("http") ? post.coverImage.src : `${SITE_URL}${post.coverImage.src}`,
          width: post.coverImage.width ?? 1200,
          height: post.coverImage.height ?? 630,
          caption: post.coverImage.alt,
        }
      : {
          "@type": "ImageObject",
          url: `${SITE_URL}/og/home.png`,
          width: 1200,
          height: 630,
        },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable", "article p:first-of-type"],
    },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: (post.tags ?? []).length > 0
      ? (post.tags ?? []).map((tag: string) => ({
          "@type": "Thing",
          name: tag,
          ...(ENTITY_SAME_AS[tag] ? { sameAs: ENTITY_SAME_AS[tag] } : {}),
        }))
      : { "@type": "Thing", name: "Carpooling festivales España" },
    mentions: (post.tags ?? []).map((tag: string) => ({
      "@type": "Thing",
      name: tag,
      ...(ENTITY_SAME_AS[tag] ? { sameAs: ENTITY_SAME_AS[tag] } : {}),
    })),
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const jsonLdFaq = post.faqs && post.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  const related = (post.relatedPosts ?? [])
    .map((s) => BLOG_POSTS_BY_SLUG[s])
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      {jsonLdFaq && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      )}

      {/* ── Header ── */}
      <header className="max-w-3xl mx-auto px-6 pt-10 pb-6 space-y-5">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/blog" className="hover:text-cr-primary">Blog</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted truncate">{post.title}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-cr-text-muted">
          <span className="text-cr-primary uppercase tracking-[0.12em]">{categoryLabel}</span>
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
          <span aria-hidden="true">·</span>
          <span>{post.author}</span>
        </div>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.96]">
          {post.h1}
        </h1>
      </header>

      {/* ── Cover image — first visible image, keyword-optimized alt text ── */}
      {post.coverImage && (
        <div className="max-w-3xl mx-auto px-6 pb-6">
          <img
            src={post.coverImage.src}
            alt={post.coverImage.alt}
            width={post.coverImage.width ?? 1200}
            height={post.coverImage.height ?? 630}
            loading="eager"
            decoding="async"
            className="w-full rounded-sm border border-cr-border object-cover aspect-[1200/630]"
          />
        </div>
      )}

      {/* ── Body ── */}
      <article className="max-w-3xl mx-auto px-6 pb-16 border-t border-cr-border pt-10 space-y-12">
        <p className="font-sans text-base md:text-lg text-cr-text leading-relaxed speakable">
          {post.lede}
        </p>
        {relatedFestivalSlug && <AutoLinksForFestival slug={relatedFestivalSlug} />}
        {post.sections.map((section) => (
          <section key={section.heading} className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl uppercase">
              {section.heading}
            </h2>
            {section.paragraphs.map((p, i) => (
              <p key={i} className="font-sans text-sm md:text-base text-cr-text-muted leading-relaxed">
                {p}
              </p>
            ))}
            {section.bullets && section.bullets.length > 0 && (
              <ul className="space-y-2 pt-2">
                {section.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {/* ── Auto contextual links (festival/route cross-links) ── */}
        {slug && <AutoLinksForBlog slug={slug} />}

        {/* ── FAQ ── */}
        {post.faqs && post.faqs.length > 0 && (
          <section className="space-y-6 border-t border-cr-border pt-10">
            <h2 className="font-display text-2xl md:text-3xl uppercase">Preguntas frecuentes</h2>
            <dl className="space-y-6">
              {post.faqs.map((f) => (
                <div key={f.q} className="border-b border-cr-border pb-6 space-y-2">
                  <dt className="font-display text-base uppercase text-cr-text">{f.q}</dt>
                  <dd className="font-sans text-sm text-cr-text-muted leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* ── Share / Cite ── */}
        <ShareCite url={url} title={post.title} />

        {/* ── Related links ── */}
        {post.relatedLinks && post.relatedLinks.length > 0 && (
          <section className="border-t border-cr-border pt-10 space-y-4">
            <h2 className="font-display text-lg uppercase text-cr-text-muted">Sigue leyendo</h2>
            <ul className="space-y-2">
              {post.relatedLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="inline-flex items-center gap-2 font-sans text-sm text-cr-primary border-b border-cr-primary/40 hover:border-cr-primary transition-colors"
                  >
                    {l.label} <ArrowRight size={12} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── CTA ── */}
        <section className="border border-cr-primary/40 bg-cr-primary/5 p-6 space-y-3">
          <h2 className="font-display text-xl uppercase">¿Vas a un festival este verano?</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Encuentra tu viaje compartido o publica el tuyo. Sin comisiones, pago al
            conductor en efectivo o Bizum. Conductores verificados.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/concerts"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
            >
              Buscar viaje <ArrowRight size={12} />
            </Link>
            <Link
              to="/publish"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text-muted px-4 py-2 hover:border-cr-primary hover:text-cr-primary transition-colors"
            >
              Publicar viaje <ArrowRight size={12} />
            </Link>
          </div>
        </section>

        {/* ── Related posts ── */}
        {related.length > 0 && (
          <section className="border-t border-cr-border pt-10 space-y-4">
            <h2 className="font-display text-lg uppercase text-cr-text-muted">Más artículos</h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    to={`/blog/${r.slug}`}
                    className="block border border-cr-border p-4 hover:border-cr-primary/50 transition-colors space-y-2"
                  >
                    <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.12em]">
                      {BLOG_CATEGORIES.find((c) => c.slug === r.category)?.label}
                    </p>
                    <h3 className="font-display text-base uppercase leading-tight">{r.title}</h3>
                    <p className="font-sans text-xs text-cr-text-muted leading-relaxed line-clamp-3">
                      {r.excerpt}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Back ── */}
        <div className="pt-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            <ArrowLeft size={12} /> Volver al blog
          </Link>
        </div>
      </article>
    </main>
  );
}

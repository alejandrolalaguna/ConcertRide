import { Link } from "react-router-dom";
import { ExternalLink, Mail } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blogPosts";

/**
 * Author landing page — `/autor/equipo-concertride`.
 *
 * E-E-A-T page: canonical Organization-as-author entity. Every blog post's
 * `author` field points here so Google + AI Overviews can resolve the byline
 * to a real URL with bio, knowsAbout, sameAs and editorial policy.
 */

const AUTHOR_NAME = "Equipo ConcertRide";
const AUTHOR_URL = `${SITE_URL}/autor/equipo-concertride`;
const AUTHOR_EMAIL = "help@concertride.me";

const SAME_AS = [
  "https://twitter.com/concertride_es",
  "https://www.instagram.com/concertride_es/",
  "https://www.linkedin.com/company/concertride-es",
  "https://www.facebook.com/concertride.me",
];

const KNOWS_ABOUT = [
  "Carpooling para festivales de música",
  "Movilidad festivalera en España",
  "Comparativa de transporte a festivales (bus, tren, carpooling, taxi)",
  "Sostenibilidad y huella de carbono de eventos masivos",
  "Programmatic SEO para plataformas de movilidad",
  "Datos de transporte de festivales en España",
];

/**
 * Pick the last 10 posts authored by the editorial team. Read-only on
 * `BLOG_POSTS`. Filter accepts any author string containing
 * "Equipo ConcertRide" / "ConcertRide" so future hand-signed posts also
 * appear here automatically.
 */
function getAuthoredPosts() {
  return [...BLOG_POSTS]
    .filter((p) => {
      const a = (p.author ?? "").toLowerCase();
      return (
        a.includes("equipo concertride") ||
        a === "concertride" ||
        a === "concertride team"
      );
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 10);
}

export default function AutorEquipoConcertRidePage() {
  const posts = getAuthoredPosts();

  useSeoMeta({
    title: "Equipo ConcertRide — Autores de movilidad festivalera",
    description:
      "Equipo editorial de ConcertRide. Guías de carpooling para festivales en España, comparativas de transporte y datos abiertos de movilidad festivalera 2026.",
    canonical: AUTHOR_URL,
    keywords:
      "Equipo ConcertRide, autor ConcertRide, carpooling festivales España, movilidad festivalera, autor transporte festivales",
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: `${AUTHOR_NAME} — Equipo editorial`,
    ogType: "article",
    articleAuthor: AUTHOR_NAME,
    articleSection: "Autor",
    breadcrumb: [
      { position: 1, name: "Inicio", url: `${SITE_URL}/` },
      { position: 2, name: "Autor", url: AUTHOR_URL },
      { position: 3, name: AUTHOR_NAME, url: AUTHOR_URL },
    ],
  });

  // ── JSON-LD Organization-as-author ────────────────────────────────────
  const orgAuthorSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#editorial-team`,
    name: AUTHOR_NAME,
    url: AUTHOR_URL,
    mainEntityOfPage: AUTHOR_URL,
    description:
      "Equipo editorial de ConcertRide (2026), plataforma española de carpooling para festivales y conciertos. Guías sobre movilidad festivalera, comparativas de transporte y sostenibilidad de eventos masivos en España.",
    parentOrganization: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ConcertRide ES",
      url: SITE_URL,
      sameAs: SAME_AS,
    },
    sameAs: SAME_AS,
    knowsAbout: KNOWS_ABOUT,
    knowsLanguage: ["es", "en"],
    areaServed: { "@type": "Country", name: "Spain" },
    email: `mailto:${AUTHOR_EMAIL}`,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og/home.png`,
      width: 1200,
      height: 630,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Autor", item: AUTHOR_URL },
      { "@type": "ListItem", position: 3, name: AUTHOR_NAME, item: AUTHOR_URL },
    ],
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${AUTHOR_NAME} — Autores de ConcertRide`,
    url: AUTHOR_URL,
    inLanguage: "es-ES",
    dateModified: "2026-05-20",
    mainEntity: { "@id": `${SITE_URL}/#editorial-team` },
    about: { "@id": `${SITE_URL}/#editorial-team` },
    isPartOf: { "@id": `${SITE_URL}/#website` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable"],
    },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgAuthorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 space-y-12">
        {/* ── Header / Hero ── */}
        <header className="border-b border-cr-border pb-8 space-y-4">
          <nav
            aria-label="Breadcrumb"
            className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2"
          >
            <Link to="/" className="hover:text-cr-primary">
              Inicio
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-cr-text-muted">Autor</span>
            <span aria-hidden="true">/</span>
            <span className="text-cr-text-muted">{AUTHOR_NAME}</span>
          </nav>

          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Autor verificado · E-E-A-T
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
            {/* Avatar — collective monogram on a primary-tinted disc. */}
            <div
              aria-hidden="true"
              className="w-20 h-20 rounded-full bg-cr-primary/10 border border-cr-primary/40 flex items-center justify-center shrink-0 font-display text-3xl text-cr-primary uppercase select-none"
            >
              CR
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.96]">
                {AUTHOR_NAME} — Autores en ConcertRide
              </h1>
              <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.12em]">
                Equipo editorial · Movilidad festivalera España
              </p>
            </div>
          </div>
        </header>

        {/* ── Bio ── */}
        <section className="space-y-4 font-sans text-base text-cr-text-muted leading-relaxed">
          <p className="speakable">
            <strong className="text-cr-text">{AUTHOR_NAME}</strong> es el equipo editorial detrás
            de las guías de{" "}
            <Link to="/" className="text-cr-primary hover:underline">
              ConcertRide
            </Link>
            , la plataforma española de carpooling especializada en{" "}
            <strong className="text-cr-text">festivales y conciertos</strong>. El proyecto se
            lanzó en 2026 tras comprobar que el transporte a los grandes festivales de España
            (Mad Cool, Primavera Sound, Arenal Sound, BBK Live, FIB, Resurrection Fest, Viña
            Rock) sigue resolviéndose con coches medio vacíos, taxis caros de madrugada o
            autobuses que no cubren la vuelta nocturna.
          </p>
          <p>
            El equipo combina práctica de producto y desarrollo software con un trabajo continuo
            de <strong className="text-cr-text">investigación sobre movilidad festivalera</strong>:
            recopilamos datos de rutas, precios por asiento, distancias y horarios reales de
            cada recinto y los publicamos como guías accesibles. Somos los autores de las
            comparativas de transporte y de los artículos de carpooling festival a festival
            que publicamos en este blog.
          </p>
          <p>
            Hemos asistido en conjunto a más de 15 festivales en los últimos cinco años (entre
            ellos Resurrection Fest, Sonorama, Mad Cool y Primavera Sound) y escribimos en
            español sobre carpooling, transporte público a festivales y sostenibilidad de
            eventos masivos en España. ConcertRide es 100% bootstrapped, sin comisión de
            plataforma y enfocada en datos abiertos —{" "}
            <Link to="/datos" className="text-cr-primary hover:underline">
              ver dataset CC BY 4.0
            </Link>
            .
          </p>
        </section>

        {/* ── Sobre qué escribimos ── */}
        <section className="space-y-4 border-t border-cr-border pt-8">
          <h2 className="font-display text-2xl md:text-3xl uppercase leading-tight">
            Sobre qué escribimos
          </h2>
          <dl className="grid sm:grid-cols-2 gap-5 font-sans text-sm text-cr-text-muted leading-relaxed">
            <div className="border border-cr-border p-5 space-y-2">
              <dt className="font-display text-base uppercase text-cr-primary">
                Carpooling festivalero
              </dt>
              <dd>
                Cómo funciona el coche compartido a festivales, precios por asiento (3–22 €),
                seguro, legalidad en España (Sentencia del Supremo 2017 sobre gastos
                compartidos), y la diferencia entre carpooling festivalero y una plataforma
                genérica.
              </dd>
            </div>
            <div className="border border-cr-border p-5 space-y-2">
              <dt className="font-display text-base uppercase text-cr-primary">
                Comparativas de transporte
              </dt>
              <dd>
                Autobús oficial vs lanzadera vs bus interurbano vs tren vs carpooling vs
                taxi. Tablas con precio, tiempo, horario, disponibilidad de vuelta nocturna y
                trampas comunes (&ldquo;bus al festival&rdquo; privados, lanzaderas que no son
                oficiales).
              </dd>
            </div>
            <div className="border border-cr-border p-5 space-y-2">
              <dt className="font-display text-base uppercase text-cr-primary">
                Sostenibilidad y CO₂
              </dt>
              <dd>
                Huella de carbono de un festival, peso del transporte de asistentes (~80%
                del total según Julie&apos;s Bicycle), reducción de emisiones por carpooling
                (~71% con 3,5 personas/coche vs viaje individual) y benchmarks comparados
                con UE.
              </dd>
            </div>
            <div className="border border-cr-border p-5 space-y-2">
              <dt className="font-display text-base uppercase text-cr-primary">
                Programmatic SEO de movilidad
              </dt>
              <dd>
                Cómo construimos +400 rutas, +70 ciudades, +50 festivales y +200 posts
                informativos con quality gates contra contenido duplicado. Notas técnicas
                sobre schema.org, llms.txt y indexabilidad en GSC.
              </dd>
            </div>
            <div className="border border-cr-border p-5 space-y-2">
              <dt className="font-display text-base uppercase text-cr-primary">
                Datos abiertos de transporte
              </dt>
              <dd>
                Dataset propio de ConcertRide sobre rutas activas, precios medios y
                cobertura geográfica de festivales en España, publicado bajo licencia
                Creative Commons BY 4.0 — disponible en{" "}
                <Link to="/datos" className="text-cr-primary hover:underline">
                  /datos
                </Link>
                .
              </dd>
            </div>
          </dl>
        </section>

        {/* ── Datos y metodología ── */}
        <section className="space-y-4 border-t border-cr-border pt-8">
          <h2 className="font-display text-2xl md:text-3xl uppercase leading-tight">
            Datos y metodología
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Las cifras y comparativas que aparecen en nuestros artículos provienen del dataset
            propio de ConcertRide (rutas, precios, distancias, tiempos) complementado con
            fuentes públicas: Asociación de Promotores Musicales (APM), Renfe, ALSA,
            Ticketmaster Discovery API v2, y datos abiertos de movilidad de la DGT. La
            metodología, los supuestos y las limitaciones se documentan junto al dataset.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/datos"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
            >
              Dataset CC BY 4.0 →
            </Link>
            <Link
              to="/prensa"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text-muted px-4 py-2 hover:border-cr-primary hover:text-cr-primary transition-colors"
            >
              Kit de prensa →
            </Link>
            <Link
              to="/acerca-de"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text-muted px-4 py-2 hover:border-cr-primary hover:text-cr-primary transition-colors"
            >
              Acerca de ConcertRide →
            </Link>
          </div>
        </section>

        {/* ── Cómo trabajamos el contenido (E-E-A-T expanded) ── */}
        <section className="space-y-5 border-t border-cr-border pt-8">
          <h2 className="font-display text-2xl md:text-3xl uppercase leading-tight">
            Cómo trabajamos el contenido
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Última actualización: <time dateTime="2026-05-20">20 de mayo de 2026</time>.
            Esta es nuestra política editorial pública para guías de carpooling y movilidad
            festivalera. La aplicamos en pillars, datasets, blog y comparativas.
          </p>

          <dl className="grid sm:grid-cols-2 gap-5 font-sans text-sm text-cr-text-muted leading-relaxed">
            <div className="border border-cr-border p-5 space-y-2">
              <dt className="font-display text-base uppercase text-cr-primary">
                Experiencia directa
              </dt>
              <dd>
                Nuestro equipo ha asistido a más de 15 festivales en España en los últimos
                cinco años (Resurrection Fest, Sonorama Ribera, Mad Cool, Primavera Sound,
                BBK Live, Arenal Sound, Viña Rock, FIB y otros) y ha testado decenas de
                rutas de carpooling, autobús oficial y tren a esos recintos. Las cifras y
                consejos que publicamos reflejan esa experiencia real.
              </dd>
            </div>
            <div className="border border-cr-border p-5 space-y-2">
              <dt className="font-display text-base uppercase text-cr-primary">
                Verificación de datos
              </dt>
              <dd>
                Contrastamos cada dato cuantitativo con fuentes oficiales: organización del
                festival, ayuntamientos, Renfe, ALSA, Avanza, Asociación de Promotores
                Musicales (APM), Instituto Nacional de Estadística (INE), Dirección General
                de Tráfico (DGT) y Agencia Europea de Medio Ambiente (EEA). Citamos la fuente
                cuando se trata de datos reproducibles.
              </dd>
            </div>
            <div className="border border-cr-border p-5 space-y-2">
              <dt className="font-display text-base uppercase text-cr-primary">
                Independencia editorial
              </dt>
              <dd>
                ConcertRide no recibe compensación de festivales, promotores ni ticketeras
                por aparecer ni por tener un trato editorial favorable. Usamos la API pública
                Ticketmaster Discovery v2 como fuente de datos de eventos: es una API abierta
                a desarrolladores y no implica acuerdo comercial ni patrocinio. Tampoco
                aceptamos posts patrocinados disfrazados de contenido editorial.
              </dd>
            </div>
            <div className="border border-cr-border p-5 space-y-2">
              <dt className="font-display text-base uppercase text-cr-primary">
                Uso de inteligencia artificial
              </dt>
              <dd>
                Cuando usamos asistencia de IA en investigación, estructura o primer borrador,
                lo indicamos al final del artículo con una nota de transparencia. Toda
                publicación pasa por revisión, edición y verificación humana antes de salir
                — la IA nunca publica de forma autónoma en ConcertRide.
              </dd>
            </div>
            <div className="border border-cr-border p-5 space-y-2">
              <dt className="font-display text-base uppercase text-cr-primary">
                Revisiones y actualizaciones
              </dt>
              <dd>
                Revisamos los pillars (guías largas) al menos una vez al mes y los datasets
                al menos una vez por trimestre. Las páginas de festival se actualizan cuando
                la organización publica fechas, line-up o información de transporte. La fecha
                de última revisión aparece de forma visible en cada página.
              </dd>
            </div>
            <div className="border border-cr-border p-5 space-y-2">
              <dt className="font-display text-base uppercase text-cr-primary">
                Correcciones
              </dt>
              <dd>
                Si detectas un error fáctico (precio incorrecto, distancia equivocada,
                cambio de recinto, fecha cambiada) escríbenos a{" "}
                <a
                  href={`mailto:${AUTHOR_EMAIL}`}
                  className="text-cr-primary hover:underline"
                >
                  {AUTHOR_EMAIL}
                </a>
                . Corregimos errores fácticos en menos de 48 horas y dejamos constancia
                en el `dateModified` de la página.
              </dd>
            </div>
          </dl>
        </section>

        {/* ── Conecta ── */}
        <section className="space-y-4 border-t border-cr-border pt-8">
          <h2 className="font-display text-2xl md:text-3xl uppercase leading-tight">
            Conecta
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3 font-sans text-sm">
            <li>
              <a
                href="https://www.linkedin.com/company/concertride-es"
                target="_blank"
                rel="me noopener noreferrer"
                className="flex items-center justify-between gap-2 border border-cr-border p-4 hover:border-cr-primary transition-colors group"
              >
                <span className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-muted">
                    LinkedIn
                  </span>
                  <span className="text-cr-text group-hover:text-cr-primary transition-colors">
                    /company/concertride-es
                  </span>
                </span>
                <ExternalLink size={14} className="text-cr-text-muted group-hover:text-cr-primary" />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/concertride_es"
                target="_blank"
                rel="me noopener noreferrer"
                className="flex items-center justify-between gap-2 border border-cr-border p-4 hover:border-cr-primary transition-colors group"
              >
                <span className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-muted">
                    X / Twitter
                  </span>
                  <span className="text-cr-text group-hover:text-cr-primary transition-colors">
                    @concertride_es
                  </span>
                </span>
                <ExternalLink size={14} className="text-cr-text-muted group-hover:text-cr-primary" />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/concertride_es/"
                target="_blank"
                rel="me noopener noreferrer"
                className="flex items-center justify-between gap-2 border border-cr-border p-4 hover:border-cr-primary transition-colors group"
              >
                <span className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-muted">
                    Instagram
                  </span>
                  <span className="text-cr-text group-hover:text-cr-primary transition-colors">
                    @concertride_es
                  </span>
                </span>
                <ExternalLink size={14} className="text-cr-text-muted group-hover:text-cr-primary" />
              </a>
            </li>
            <li>
              <a
                href={`mailto:${AUTHOR_EMAIL}`}
                className="flex items-center justify-between gap-2 border border-cr-border p-4 hover:border-cr-primary transition-colors group"
              >
                <span className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-muted">
                    Email
                  </span>
                  <span className="text-cr-text group-hover:text-cr-primary transition-colors">
                    {AUTHOR_EMAIL}
                  </span>
                </span>
                <Mail size={14} className="text-cr-text-muted group-hover:text-cr-primary" />
              </a>
            </li>
          </ul>
        </section>

        {/* ── Últimos posts firmados ── */}
        <section className="space-y-4 border-t border-cr-border pt-8">
          <h2 className="font-display text-2xl md:text-3xl uppercase leading-tight">
            Últimos posts firmados
          </h2>
          {posts.length === 0 ? (
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Aún no hay artículos firmados publicados.
            </p>
          ) : (
            <ul className="space-y-3">
              {posts.map((p) => {
                const categoryLabel =
                  BLOG_CATEGORIES.find((c) => c.slug === p.category)?.label ?? p.category;
                return (
                  <li key={p.slug}>
                    <Link
                      to={`/blog/${p.slug}`}
                      className="block border border-cr-border p-4 hover:border-cr-primary transition-colors group"
                    >
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-cr-text-muted mb-1">
                        <span className="text-cr-primary uppercase tracking-[0.12em]">
                          {categoryLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={p.publishedAt}>
                          {new Date(p.publishedAt).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                        <span aria-hidden="true">·</span>
                        <span>{p.readingMinutes} min</span>
                      </div>
                      <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">
                        {p.title}
                      </h3>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="pt-2">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Ver todos los artículos del blog →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

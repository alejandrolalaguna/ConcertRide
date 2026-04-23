import { Link } from "react-router-dom";
import { Mail, MessageCircleQuestion, ShieldAlert } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";

export default function ContactoPage() {
  useSeoMeta({
    title: "Contacto",
    description:
      "Contacta con el equipo de ConcertRide ES. Atendemos consultas sobre viajes compartidos a conciertos, reportes de abuso, dudas legales y partnerships con festivales.",
    canonical: "https://concertride.es/contacto",
  });

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contacto — ConcertRide ES",
            url: "https://concertride.es/contacto",
            mainEntity: {
              "@type": "Organization",
              name: "ConcertRide ES",
              email: "alejandrolalaguna@gmail.com",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: "alejandrolalaguna@gmail.com",
                areaServed: "ES",
                availableLanguage: ["es"],
              },
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: "https://concertride.es/" },
              { "@type": "ListItem", position: 2, name: "Contacto", item: "https://concertride.es/contacto" },
            ],
          }),
        }}
      />

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 space-y-12">
        <header className="border-b border-cr-border pb-8 space-y-3">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Atención al usuario
          </p>
          <h1 className="font-display text-4xl md:text-5xl uppercase leading-[0.92]">
            Contacto.
          </h1>
          <p className="font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed">
            Respondemos en 24–48 h laborables. Somos un equipo pequeño; agradecemos la paciencia.
          </p>
        </header>

        <section className="space-y-6">
          <article className="border border-cr-border bg-cr-surface p-5 space-y-2">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2">
              <Mail size={12} aria-hidden="true" /> Correo general
            </p>
            <p className="font-sans text-sm text-cr-text">
              Dudas, incidencias con viajes, partnerships, prensa.
            </p>
            <a
              href="mailto:alejandrolalaguna@gmail.com"
              className="inline-block font-mono text-cr-primary underline underline-offset-2 break-all"
            >
              alejandrolalaguna@gmail.com
            </a>
          </article>

          <article className="border border-cr-border bg-cr-surface p-5 space-y-2">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2">
              <MessageCircleQuestion size={12} aria-hidden="true" /> Preguntas frecuentes
            </p>
            <p className="font-sans text-sm text-cr-text">
              Antes de escribirnos, revisa si tu duda está resuelta en la sección de FAQ.
            </p>
            <Link
              to="/faq"
              className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text hover:border-cr-primary hover:text-cr-primary px-4 py-2 transition-colors"
            >
              Ver FAQ →
            </Link>
          </article>

          <article className="border border-cr-border bg-cr-surface p-5 space-y-2">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-secondary inline-flex items-center gap-2">
              <ShieldAlert size={12} aria-hidden="true" /> Reportar abuso
            </p>
            <p className="font-sans text-sm text-cr-text">
              Si has detectado un comportamiento abusivo, fraudulento o inseguro, usa el botón
              <em> Reportar</em> en el perfil del conductor o en la ficha del viaje. Lo revisamos
              uno a uno.
            </p>
          </article>

          <article className="border border-cr-border bg-cr-surface p-5 space-y-2">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted">
              Datos y privacidad (RGPD)
            </p>
            <p className="font-sans text-sm text-cr-text">
              Para ejercer tus derechos RGPD (acceso, rectificación, supresión, portabilidad),
              escríbenos al correo general indicando el derecho y acreditando tu identidad.
              Respondemos en el plazo legal máximo de 30 días. La supresión completa de la
              cuenta puedes hacerla tú directamente en{" "}
              <Link to="/profile" className="text-cr-primary underline underline-offset-2">
                Mi perfil → Zona peligro
              </Link>
              .
            </p>
          </article>
        </section>

        <div className="pt-8 border-t border-cr-border flex flex-wrap gap-4">
          <Link to="/faq" className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors">
            Preguntas frecuentes →
          </Link>
          <Link to="/privacidad" className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors">
            Política de privacidad →
          </Link>
          <Link to="/" className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors ml-auto">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}

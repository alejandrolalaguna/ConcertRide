# SEO Optimization Plan — Festival Pages
**ConcertRide** · Mad Cool · Primavera Sound · Sónar

---

## 🚨 Priority 0 — Fix JavaScript Rendering (Blocks Everything Else)

**Problem**: All festival pages are rendered client-side. Google's crawler only sees "Cargando…" — no H1, no headings, no body content. Every other optimization below is useless until this is fixed.

**What to implement**:
- Migrate to **SSR (Server-Side Rendering)** or **SSG (Static Site Generation)**
- Recommended frameworks: Next.js, Nuxt, or Astro
- Each festival page must return fully rendered HTML on first load — no JavaScript required to see content
- Verify fix: use `curl -A "Googlebot" https://concertride.es/festivales/mad-cool` and confirm full HTML is returned

**Impact**: 🔴 Critical — without this, nothing else works.

---

## 🔧 Global Fixes (Apply to All Festival Pages)

### Canonical URL mismatch
- Current canonical points to `https://concertride.es/festivales/mad-cool` but the live domain is `concertride.alejandrolalaguna.workers.dev`
- **Fix**: Update canonical tags to match the actual live domain, OR redirect the workers.dev domain to concertride.es and serve from there

### Meta description duplicate issue
- All pages use the same meta description template — only prices and cities differ
- **Fix**: Write a unique meta description per page (see per-page specs below)

### Missing H1 on all pages
- No H1 is present in the static HTML (it's JS-rendered)
- **Fix**: Hardcode H1 in the server-rendered HTML for each page (see per-page specs below)

### Structured data — what to keep, what to add
- ✅ Keep: SoftwareApplication, Organization, WebSite, Service, LocalBusiness schemas (already present)
- ❌ Remove: The generic ItemList of 16 festivals from individual festival pages — it dilutes relevance
- ➕ Add per page: `Event` schema + `FAQPage` schema (see per-page specs below)

### Internal linking
- Add a visible text link from the homepage and `/guia-transporte-festivales` to each festival page
- Anchor text examples: "carpooling al Mad Cool", "compartir coche al Primavera Sound", "viaje compartido al Sónar"
- Currently the only links to festival pages are in the nav — Google needs contextual body links

---

## 🎸 Page 1 — Mad Cool (`/festivales/mad-cool`)

### Target keyword
**Primary**: `transporte mad cool festival` (50 searches/mo)
**Secondary**: `carpooling mad cool`, `cómo llegar mad cool`, `compartir coche mad cool`, `mad cool coche compartido`

### SERP context
Google rewards: official festival transport pages, public transport guides, and news articles. No carpooling platform currently ranks. The angle to own: **"compartir coche al Mad Cool"** — a specific, uncontested niche within the transport SERP.

### Title tag
```
Carpooling al Mad Cool Festival 2026 | ConcertRide
```
*(53 chars — contains primary keyword angle + brand)*

### Meta description
```
Comparte coche al Mad Cool Festival desde Madrid, Toledo, Guadalajara y más ciudades. Gratis, sin comisión. Publica o encuentra tu viaje en minutos.
```
*(148 chars)*

### H1
```
Comparte coche al Mad Cool Festival 2026
```

### Page content structure (H2/H3)

**H2: ¿Cómo llegar al Mad Cool Festival en coche compartido?**
- Brief intro: why carpooling is the best option for Mad Cool (parking chaos, distance from center, cost)
- 2–3 sentences max, link to `/como-funciona`

**H2: Viajes disponibles al Mad Cool desde tu ciudad**
- This is where the dynamic ride listings live (already exists in the app)
- Add a static fallback text for when no rides are listed: "Sé el primero en publicar un viaje desde [ciudad]" with a CTA button

**H2: Ciudades de origen más populares**
- Static list (H3 per city): Madrid · Toledo · Guadalajara · Segovia · Ávila
- For each: 1 sentence on distance/time + link to search results filtered by that city

**H2: ¿Por qué ir al Mad Cool en coche compartido?**
- 3–4 bullet points: ahorra dinero, evita el parking, conoce gente, sin comisión
- Reinforce the free/no-commission differentiator

**H2: Preguntas frecuentes sobre el carpooling al Mad Cool**
*(enables FAQPage rich result)*
- Q: ¿Cuánto cuesta compartir coche al Mad Cool? → A: Los precios los fijan los conductores, normalmente entre 4 y 10 € por trayecto desde Madrid.
- Q: ¿Dónde se recogen los pasajeros? → A: El punto de recogida lo acuerdan conductor y pasajero directamente por el chat de ConcertRide.
- Q: ¿Es seguro el carpooling en ConcertRide? → A: Sí, todos los conductores están verificados y el sistema de valoraciones garantiza la confianza.
- Q: ¿Puedo publicar mi propio viaje al Mad Cool? → A: Sí, publicar un viaje es gratis y sin comisión. Solo necesitas crear una cuenta.

### Structured data to add
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Event",
      "name": "Mad Cool Festival 2026",
      "startDate": "2026-07-08",
      "endDate": "2026-07-11",
      "location": {
        "@type": "Place",
        "name": "Recinto Iberdrola Music",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Madrid",
          "addressCountry": "ES"
        }
      },
      "url": "https://concertride.es/festivales/mad-cool",
      "description": "Encuentra o publica un viaje compartido al Mad Cool Festival 2026 desde cualquier ciudad de España."
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Cuánto cuesta compartir coche al Mad Cool?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Los precios los fijan los conductores, normalmente entre 4 y 10 € por trayecto desde Madrid."
          }
        },
        {
          "@type": "Question",
          "name": "¿Dónde se recogen los pasajeros?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "El punto de recogida lo acuerdan conductor y pasajero directamente por el chat de ConcertRide."
          }
        },
        {
          "@type": "Question",
          "name": "¿Es seguro el carpooling en ConcertRide?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí, todos los conductores están verificados y el sistema de valoraciones garantiza la confianza."
          }
        },
        {
          "@type": "Question",
          "name": "¿Puedo publicar mi propio viaje al Mad Cool?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí, publicar un viaje es gratis y sin comisión. Solo necesitas crear una cuenta."
          }
        }
      ]
    }
  ]
}
```

---

## 🎶 Page 2 — Primavera Sound (`/festivales/primavera-sound`)

### Target keyword
**Primary**: `cómo llegar a primavera sound en coche` (~30 searches/mo)
**Secondary**: `compartir coche primavera sound`, `carpooling primavera sound`, `viaje compartido primavera sound barcelona`

### SERP context
Google rewards: the official Primavera Sound "how to arrive" page, parking guides (Parkimeter), and news articles. Zmove ranks for "compartir coche primavera sound" but has no dedicated festival page — just their homepage. ConcertRide's dedicated page is a direct competitive advantage.

### Title tag
```
Cómo ir a Primavera Sound en coche compartido 2026 | ConcertRide
```
*(64 chars — slightly long, trim if needed: "Carpooling Primavera Sound 2026 | ConcertRide" = 46 chars)*

### Meta description
```
Comparte coche al Primavera Sound Barcelona desde Madrid, Valencia, Zaragoza y más. Gratis, sin comisión. Encuentra tu viaje en minutos.
```
*(136 chars)*

### H1
```
Comparte coche al Primavera Sound 2026 desde toda España
```

### Page content structure (H2/H3)

**H2: ¿Cómo llegar al Primavera Sound en coche compartido?**
- Intro: Parc del Fòrum location, why carpooling beats parking in Barcelona, cost savings
- Link to `/como-funciona`

**H2: Viajes disponibles al Primavera Sound**
- Dynamic ride listings (existing)
- Static fallback CTA when empty

**H2: Ciudades de origen más populares**
- H3: Desde Madrid (620 km · ~6h) 
- H3: Desde Valencia (350 km · ~3h30)
- H3: Desde Zaragoza (300 km · ~3h)
- H3: Desde Sevilla (1.000 km · ~9h)
- 1 sentence per city + filtered search link

**H2: Aparcar en el Primavera Sound — por qué evitarlo**
- Short section: parking scarcity near Parc del Fòrum, cost, stress
- Transition: carpooling as the smarter alternative

**H2: Preguntas frecuentes sobre el carpooling al Primavera Sound**
- Q: ¿Cuánto cuesta un viaje compartido al Primavera Sound desde Madrid? → A: Normalmente entre 15 y 25 € por trayecto desde Madrid, según el conductor.
- Q: ¿Puedo encontrar viaje de vuelta también? → A: Sí, puedes buscar viajes de vuelta desde Barcelona al terminar el festival.
- Q: ¿Con cuánta antelación debo reservar? → A: Recomendamos reservar con al menos 2 semanas de antelación, especialmente para trayectos largos.
- Q: ¿ConcertRide cobra comisión? → A: No. ConcertRide es completamente gratuito, sin comisiones para conductores ni pasajeros.

### Structured data to add
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Event",
      "name": "Primavera Sound Barcelona 2026",
      "startDate": "2026-05-28",
      "endDate": "2026-06-01",
      "location": {
        "@type": "Place",
        "name": "Parc del Fòrum",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Barcelona",
          "addressCountry": "ES"
        }
      },
      "url": "https://concertride.es/festivales/primavera-sound",
      "description": "Encuentra o publica un viaje compartido al Primavera Sound Barcelona 2026 desde cualquier ciudad de España."
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Cuánto cuesta un viaje compartido al Primavera Sound desde Madrid?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Normalmente entre 15 y 25 € por trayecto desde Madrid, según el conductor."
          }
        },
        {
          "@type": "Question",
          "name": "¿Puedo encontrar viaje de vuelta también?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí, puedes buscar viajes de vuelta desde Barcelona al terminar el festival."
          }
        },
        {
          "@type": "Question",
          "name": "¿Con cuánta antelación debo reservar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Recomendamos reservar con al menos 2 semanas de antelación, especialmente para trayectos largos."
          }
        },
        {
          "@type": "Question",
          "name": "¿ConcertRide cobra comisión?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. ConcertRide es completamente gratuito, sin comisiones para conductores ni pasajeros."
          }
        }
      ]
    }
  ]
}
```

---

## 🎧 Page 3 — Sónar (`/festivales/sonar`)

### Target keyword
**Primary**: `transporte sonar barcelona` (~20 searches/mo)
**Secondary**: `carpooling sonar barcelona`, `compartir coche sonar`, `cómo llegar al sonar`

### SERP context
Google rewards: the official Sónar "cómo llegar" page (ranks #1 and #2), taxi/transfer services. Zero carpooling platforms rank. This is the most open SERP of the three — a well-structured, crawlable page from ConcertRide could rank in the top 5 with minimal competition.

### Title tag
```
Carpooling al Sónar Barcelona 2026 | ConcertRide
```
*(48 chars)*

### Meta description
```
Comparte coche al Sónar Festival de Barcelona desde Madrid, Valencia, Zaragoza y más ciudades. Gratis, sin comisión. Publica o encuentra tu viaje.
```
*(146 chars)*

### H1
```
Comparte coche al Sónar 2026 — sin comisión
```

### Page content structure (H2/H3)

**H2: ¿Cómo llegar al Sónar en coche compartido?**
- Intro: Fira de Barcelona location (L'Hospitalet), why carpooling is ideal for Sónar (urban festival, parking nightmare in L'Hospitalet)
- Link to `/como-funciona`

**H2: Viajes disponibles al Sónar Barcelona**
- Dynamic ride listings (existing)
- Static fallback CTA when empty

**H2: Ciudades de origen más populares**
- H3: Desde Madrid (~620 km · ~6h)
- H3: Desde Valencia (~350 km · ~3h30)
- H3: Desde Zaragoza (~300 km · ~3h)
- 1 sentence per city + filtered search link

**H2: Sónar de Día y Sónar de Noche — organiza tu viaje**
- Unique
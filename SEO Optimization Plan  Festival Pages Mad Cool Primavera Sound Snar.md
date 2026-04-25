# SEO Optimization Plan — Festival Pages

**ConcertRide ES** · Mad Cool · Primavera Sound · Sónar

---
## 🚨 Critical Issue: JavaScript Rendering

**Your festival pages are invisible to Google.** The crawler sees only ~80 words of static content — no H1, no H2, no body text. All content is rendered client-side via JavaScript, which Google's crawler does not reliably execute.**This is your #1 priority fix before any other optimization.** Without it, no on-page SEO work will have any effect.**Fix**: Implement **Server-Side Rendering (SSR)** or **Static Site Generation (SSG)** for all festival pages. Frameworks like Next.js, Nuxt.js, or Astro support this natively. Alternatively, use pre-rendering (e.g. Prerender.io) as a short-term workaround.

---
## 🔍 SERP Analysis & Keyword Strategy

### What Google currently shows for these keywords

**Key insight**: The SERPs are dominated by official festival pages (transport info) and generic content. **No specialized carpooling platform owns any of these keywords.** This is a wide-open opportunity — but only if your pages are crawlable.

### Primary & Secondary Keywords per Page

> ⚠️ Volumes are low — this is expected for a niche. The goal is to **own all relevant keywords in the space**, not to chase volume.

---
## 📄 Page-by-Page Optimization Plans

---
### 1. `/festivales/mad-cool` — Mad Cool Festival

#### Expected page type (from SERP)

 Google expects a **transport guide** (informational + transactional hybrid): how to get to the festival, transport options, practical info. The top results are: official festival transport page, a complete Madrid guide, and community discussions. ConcertRide's angle is **carpooling specifically** — a sub-topic not owned by anyone.

#### Current state

- ✅ Title tag is good: "Cómo ir a Mad Cool 2026 — Carpooling desde toda España"

- ✅ Meta description is solid

- ❌ No H1 rendered (JS issue)

- ❌ No body content rendered (JS issue)

- ❌ ~80 words visible to Google

#### Optimized Title (< 55 chars)

```
Carpooling Mad Cool 2026 — Comparte coche desde España
```
#### Optimized H1

```
Carpooling a Mad Cool 2026: encuentra tu viaje compartido desde cualquier ciudad
```
#### Recommended Content Structure

**H2: ¿Por qué ir a Mad Cool en coche compartido?**

- 2–3 bullet points: ahorra dinero, evita el transporte público saturado, llega directo al recinto

- Mention: gratis, sin comisión, conductores verificados

**H2: Rutas de carpooling más populares a Mad Cool**

- H3: Carpooling Madrid → Mad Cool

- H3: Carpooling Toledo → Mad Cool

- H3: Carpooling Guadalajara → Mad Cool

- H3: Carpooling Valencia → Mad Cool

- For each: distance, estimated price range, typical departure times

- Include a simple table: Origen | Distancia | Precio estimado | Duración

**H2: Cómo funciona ConcertRide para Mad Cool**

- 3-step process (icon + text): Busca tu viaje → Contacta al conductor → Comparte gastos

- CTA: "Buscar viaje a Mad Cool" / "Publicar un viaje"

**H2: Información práctica sobre Mad Cool 2026**

- Dates, venue (Iberdrola Music, Villaverde), address

- Brief note on other transport options (metro, bus) with link to official festival page

- Parking info (for drivers)

**H2: Preguntas frecuentes sobre el carpooling a Mad Cool** *(FAQ — enables rich results)*

- ¿Es seguro compartir coche a Mad Cool con ConcertRide?

- ¿Cuánto cuesta un viaje compartido a Mad Cool?

- ¿Cómo publico un viaje a Mad Cool?

- ¿Hay carpooling de vuelta desde Mad Cool?

#### Final Checklist

- [ ] Fix JavaScript rendering (SSR/SSG)

- [ ] Add H1 with primary keyword

- [ ] Add all H2/H3 structure above

- [ ] Write minimum 600 words of body content

- [ ] Add FAQ section with structured data (FAQPage schema)

- [ ] Add internal links to: homepage, /guia-transporte-festivales, other festival pages

- [ ] Update title tag to optimized version

- [ ] Add Event structured data (schema.org/Event) for Mad Cool 2026

---
### 2. `/festivales/primavera-sound` — Primavera Sound

#### Expected page type (from SERP)

 Google shows a mix of: carpooling app (Zmove), BlaBlaCar press content, parking guides, and forum threads. The intent is **transactional + informational**: users want to find a shared ride OR understand their options. ConcertRide can own the "find a carpooling ride to Primavera Sound" slot that Zmove currently occupies — but with a festival-specific page.

#### Current state

- ✅ Title tag: "Cómo ir a Primavera Sound 2026 — Carpooling desde toda España"

- ✅ Meta description is solid

- ❌ No H1 rendered (JS issue)

- ❌ No body content rendered (JS issue)

#### Optimized Title (< 55 chars)

```
Carpooling Primavera Sound 2026 — Viaje compartido BCN
```
#### Optimized H1

```
Carpooling a Primavera Sound 2026: comparte coche y llega a Barcelona sin estrés
```
#### Recommended Content Structure

**H2: ¿Por qué ir a Primavera Sound en coche compartido?**

- Key benefits: precio (15–20€ vs. tren/bus), flexibilidad horaria, sin comisión

- Mention: Parc del Fòrum location — lejos del centro, el carpooling es ideal

**H2: Rutas de carpooling más populares a Primavera Sound**

- H3: Carpooling Madrid → Primavera Sound Barcelona

- H3: Carpooling Valencia → Primavera Sound Barcelona

- H3: Carpooling Zaragoza → Primavera Sound Barcelona

- H3: Carpooling Bilbao → Primavera Sound Barcelona

- Table: Origen | Distancia | Precio estimado | Duración

**H2: Cómo funciona ConcertRide para Primavera Sound**

- 3-step process + CTA buttons

**H2: Información práctica — Primavera Sound 2026**

- Dates, venue (Parc del Fòrum, Barcelona), address

- Note on parking near Parc del Fòrum (link to parkimeter article as external reference)

- Public transport alternatives (brief, not the focus)

**H2: Preguntas frecuentes sobre el carpooling a Primavera Sound** *(FAQ)*

- ¿Cuánto cuesta el carpooling a Primavera Sound desde Madrid?

- ¿Hay viajes de vuelta desde Primavera Sound?

- ¿Es mejor el coche compartido o el tren a Primavera Sound?

- ¿Cómo aparco si voy en coche a Primavera Sound?

#### Final Checklist

- [ ] Fix JavaScript rendering (SSR/SSG)

- [ ] Add H1 with primary keyword

- [ ] Add all H2/H3 structure above

- [ ] Write minimum 600 words of body content

- [ ] Add FAQ section with FAQPage schema

- [ ] Add internal links to: homepage, /guia-transporte-festivales, /festivales/sonar, other festival pages

- [ ] Update title tag to optimized version

- [ ] Add Event structured data for Primavera Sound 2026

---
### 3. `/festivales/sonar` — Sónar Barcelona

#### Expected page type (from SERP)

 The SERP for "carpooling sonar barcelona" is largely empty of specialized content — a very open field. Google would likely serve the same type of content as the other festival pages: transport guide + carpooling platform. ConcertRide can rank #1 here with a well-structured, crawlable page.

#### Current state

- ✅ Title tag: "Cómo ir a Sónar 2026 — Carpooling desde toda España"

- ✅ Meta description is solid

- ❌ No H1 rendered (JS issue)

- ❌ No body content rendered (JS issue)

#### Optimized Title (< 55 chars)

```
Carpooling Sónar 2026 Barcelona — Comparte coche
```
#### Optimized H1

```
Carpooling a Sónar 2026: viaje compartido a Barcelona para el festival de música electrónica
```
#### Recommended Content Structure

**H2: ¿Por qué ir a Sónar en coche compartido?**

- Sónar has two venues (Sónar de Día + Sónar de Noche) — carpooling is ideal for multi-day attendees

- Price, flexibility, no commission angle

**H2: Rutas de carpooling más populares a Sónar Barcelona**

- H3: Carpooling Madrid → Sónar Barcelona

- H3: Carpooling Valencia → Sónar Barcelona

- H3: Carpooling Zaragoza → Sónar Barcelona

- Table: Origen | Distancia | Precio estimado | Duración

**H2: Cómo funciona ConcertRide para Sónar**

- 3-step process + CTA

**H2: Información práctica — Sónar 2026**

- Dates, venues (Fira Montjuïc + Fira Gran Via), addresses

- Note on public transport (metro, bus) — brief

**H2: Preguntas frecuentes sobre el carpooling a Sónar** *(FAQ)*

- ¿Cuánto cuesta el carpooling a Sónar desde Madrid?

- ¿Hay viajes a Sónar de Noche en coche compartido?

- ¿Cómo llego a Fira Gran Via en coche compartido?

#### Final Checklist

- [ ] Fix JavaScript rendering (SSR/SSG)

- [ ] Add H1 with primary keyword

- [ ] Add all H2/H3 structure above

- [ ] Write minimum 600 words of body content

- [ ] Add FAQ section with FAQPage schema

- [ ] Add internal links to: homepage, /guia-transporte-festivales, /festivales/primavera-sound, other festival pages

- [ ] Update title tag to optimized version

- [ ] Add Event structured data for Sónar 2026

---
## 🔗 Internal Linking Strategy (applies to all festival pages)

Each festival page should link to:

- **Homepage** (`/`) — anchor: "carpooling para conciertos en España"

- **Guide page** (`/guia-transporte-festivales`) — anchor: "guía de transporte para festivales"

- **Other festival pages** — cross-link all festival pages to each other

 The homepage and guide page should also link back to each festival page with keyword-rich anchors (e.g. "carpooling Mad Cool", "compartir coche Primavera Sound").

---
## 📐 Structured Data to Implement

### 1. FAQPage schema (on each festival page)

 Enables FAQ rich results in Google — increases CTR significantly.

### 2. Event schema (on each festival page)

 Signals to Google that the page is about a specific event — improves relevance for event-related queries.

### 3. WebSite + Organization schema (on homepage)

 Basic trust signals for a new domain.

---
## ⚡ Priority Order
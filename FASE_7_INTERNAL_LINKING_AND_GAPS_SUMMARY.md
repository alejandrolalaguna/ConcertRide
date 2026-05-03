# FASE 7.2–7.5 Summary: Internal Linking Strategy + Competitor Gaps

## FASE 7.2 Deliverable: Internal Linking Matrix

**File**: `FASE_7.2_INTERNAL_LINKING_MATRIX.json`

### 5 Main Page Types & Outgoing Link Topology

| Page Type | Example URL | Outbound Link Targets | Link Count |
|-----------|-------------|----------------------|-----------|
| **Festival** | `/festivales/mad-cool` | Routes (3), Cities (all origins), Blogs (2), Related Festivals (2–3) | **8–12** |
| **Route** | `/rutas/madrid-mad-cool` | Festival (1), Cities (2), Blogs (2), Alt Routes (3) | **8–10** |
| **City** | `/conciertos/barcelona` | Festivals (6), Routes (all), Blogs (2), Region (1) | **15–20** |
| **Artist** | `/artistas/rosalia` | Festivals (all appearances), Cities (unique), Blogs (2) | **8–10** |
| **Blog** | `/blog/autobuses-festivales` | In-body links (4), Related posts (3), CTA (1) | **6–8** |

### Link Juice Flow

```
Blog (content hub) 
  ↓
Festival/Route (conversion hubs)
  ↓
City/Artist (discovery hubs)
```

### Implementation Priority

1. **Immediate** (Week 1): Add festival-internal links (routes from top origin cities)
2. **Week 2**: Connect city pages to all reachable festivals
3. **Week 3**: Route page cross-linking (related routes)
4. **Week 4**: Blog contextual links (in-body prose) + related post widgets
5. **Optional**: Artist landing pages (lower volume initially)

---

## FASE 7.5 Deliverable: Competitor Gap Analysis

**File**: `FASE_7.5_COMPETITOR_ANALYSIS.md`

### Key Findings

| Aspect | Finding |
|--------|---------|
| **Commission Undercut** | 0% vs. BlaBlaCar 12%–13% = 12–13pp advantage |
| **Content Scale** | 600+ route pages (programmatic) vs. Caroster's ~20 manual events |
| **Differentiation** | Only platform combining zero commission + festival specialization |
| **Geo-SEO Depth** | Per-festival FAQs, venue data, origin city + region pages |

### 5 Exploitable Keyword Gaps

| Gap | Volume | Priority | Solution |
|-----|--------|----------|----------|
| "Alternativa BlaBlaCar festival" | 120–250/mo | **High** | Comparison blog post |
| "Carpooling 0% comisión España" | 200–400/mo | **High** | Homepage hero + PPC |
| "Transporte nocturno vuelta festival" | 80–200/mo | **Medium** | Detailed blog guide |
| "Recinto [venue] cómo llegar" | 800–1,600/mo combined | **High** | /recintos/:slug pages |
| "Artista [name] concierto transporte" | 1,500–7,500/mo combined | **Medium** | /artistas/:slug pages |

**Total Opportunity**: ~2,700–10,000 monthly searches across 5 gaps

### 3 Blog Post Outlines

1. **"Por qué ConcertRide es mejor que BlaBlaCar para festivales"**
   - Keywords: alternativa blablacar, carpooling sin comisión
   - Sections: Commission breakdown, UX for festivals, community trust
   - CTA: /publish (offer a ride)

2. **"Vuelta de festival a las 2 AM: guía de carpooling nocturno seguro"**
   - Keywords: vuelta madrugada, transporte nocturno
   - Sections: Planning, driver perspective, solo rider safety, FAQ
   - CTA: /publish + journey coordination

3. **"Carpooling vs. taxi vs. autobús: análisis de coste para festivales"**
   - Keywords: cómo llegar festival barato, precio transporte
   - Sections: Per-person cost, alternative transport, carbon footprint
   - CTA: /rutas (find rides), /festivales (browse)

---

## Quick Wins (This Week)

1. **Homepage**: Add banner/section emphasizing "0% comisión"
2. **Festival pages**: Add 3–5 top route links in hero zone
3. **Blog nav**: Add "Related Blog Posts" widget
4. **Footer**: Reorganize links (Platform → Blog → Rutas → Festivales)

---

## 6-Month Roadmap

- **May**: Deploy linking matrix (Festival ↔ Route ↔ City) + Post 1 (BlaBlaCar comparison)
- **June**: Finalize /recintos/:slug pages + Post 2 (night returns)
- **July**: Launch /artistas/:slug pages + Post 3 (cost analysis)
- **Aug–Oct**: Monitor GSC, refine meta titles for high-opportunity queries, seasonal content updates

---

## Success Metrics

- **Organic CTR**: Festival + Route pages in top 3 for "[origin] [festival]" queries
- **Blog Traffic**: 2–3K/month from "alternativa blablacar" + night transport keywords
- **Route Finder Conversions**: +20% click-through from blog → /rutas
- **Internal Link Equity**: 80% of crawl budget flowing through programmatic pages (routes, cities)

---

**Status**: Ready for implementation  
**Owner**: SEO + Frontend teams  
**Estimated Dev Time**: 10–15 sprints (matrix implementation + blog authoring + page builders)

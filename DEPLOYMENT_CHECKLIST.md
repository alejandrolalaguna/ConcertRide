# FASE 9 — Deployment Checklist & Launch Plan

**Status:** Ready for deployment  
**Target Go-Live:** [TBD — after blog posts written]  
**Risk Level:** 🟢 LOW (all FASE 7 work deployed, FASE 8–9 templates ready)

---

## Pre-Deployment (72 hours before launch)

### Code Quality & Validation

- [ ] **Build Pipeline**
  - [ ] `npm run build` completes with 0 errors
  - [ ] `npm run type-check` returns 0 TypeScript errors
  - [ ] Bundle size < 500KB (gzip)
  - [ ] No console errors in browser DevTools

- [ ] **Schema Validation**
  - [ ] `npm run validate:schema` passes all pages
  - [ ] 0 critical errors, ≤2 warnings
  - [ ] HowToTravelPage structure valid (4 steps, position/name/text required)
  - [ ] FAQPage ≥3 questions on all landing pages
  - [ ] BreadcrumbList present on all pages

- [ ] **SEO Scripts**
  - [ ] `npm run validate:llms` passes (llms.txt accessible, no dead links)
  - [ ] `npm run seo-health-score` returns ≥90 score
  - [ ] `npm run test-rich-results` completes (manual validation ready)

### Content Review

- [ ] **New Blog Posts** (3 posts for FASE 9.3)
  - [ ] Blog Post 1: "Alternativas a BlaBlaCar para festivales" (1,200–1,500 words)
    - [ ] Written & reviewed
    - [ ] Internal links added (5+ routes, 3+ festivals)
    - [ ] Tags added: `blablacar, comparativa, alternativas`
    - [ ] Category: `comparativas`
    - [ ] SEO metadata complete (title, meta description)
  
  - [ ] Blog Post 2: "Transporte nocturno vuelta festival" (1,000–1,200 words)
    - [ ] Written & reviewed
    - [ ] Internal links added (Resurrection Fest, O Son do Camiño routes)
    - [ ] Tags added: `madrugada, vuelta, seguridad`
    - [ ] Category: `guias`
    - [ ] SEO metadata complete
  
  - [ ] Blog Post 3: "Festival eco-friendly: reduce huella de carbono" (900–1,100 words)
    - [ ] Written & reviewed
    - [ ] Data sources documented (Ministerio de Transición Ecológica)
    - [ ] Internal links added (cities, festivals, sustainability blog)
    - [ ] Tags added: `carbono, eco, sostenibilidad`
    - [ ] Category: `sostenibilidad`
    - [ ] SEO metadata complete

- [ ] **Blog Posts Integration**
  - [ ] All 3 posts added to `apps/web/src/lib/blogPosts.ts`
  - [ ] Categories & tags match schema
  - [ ] `relatedPosts` field populated
  - [ ] `relatedLinks` field populated
  - [ ] No broken links in post content

### Asset Validation

- [ ] **OG Images**
  - [ ] All 16 festival OG images present in `apps/web/public/og/`
  - [ ] Dimensions: 1200×630px
  - [ ] Format: PNG, optimized
  - [ ] No placeholder images

- [ ] **Sitemaps**
  - [ ] `sitemap.xml` generated with 215+ URLs
  - [ ] `api/sitemap-concerts.xml` accessible
  - [ ] URLs are absolute HTTPS
  - [ ] No duplicate entries
  - [ ] All prerendered pages included

- [ ] **Static Files**
  - [ ] `robots.txt` includes 13+ AI bots
  - [ ] `llms.txt` (585+ lines) & `llms-full.txt` generated
  - [ ] `llms.txt` sections: Q&A, routes, festivals, E-E-A-T
  - [ ] All URLs in llms.txt point to valid prerendered pages

### Browser Testing

- [ ] **Desktop (Chrome/Firefox/Safari)**
  - [ ] Homepage loads in <3s
  - [ ] Festival page breadcrumbs visible
  - [ ] Blog filtering works (category buttons, search input)
  - [ ] OG images render in inspector
  - [ ] No 404s in Network tab

- [ ] **Mobile (iOS Safari / Chrome Mobile)**
  - [ ] Responsive layout
  - [ ] Touch targets clickable
  - [ ] No horizontal scroll
  - [ ] Images load correctly

- [ ] **Feature-Specific**
  - [ ] Route page: HowToTravelPage step guide visible
  - [ ] City page: Festival list + route hubs working
  - [ ] Festival page: "Recursos relacionados" section visible + links work
  - [ ] Blog index: Category filter + search working
  - [ ] All links (internal + external) functional

---

## Deployment Phase (Launch Day)

### Pre-Launch Final Checks (2 hours before)

- [ ] **Production Readiness**
  - [ ] All code committed to `main` branch
  - [ ] No uncommitted changes
  - [ ] CI/CD pipeline green (if applicable)
  - [ ] Cloudflare Pages build completed successfully
  - [ ] `main` branch deployed to production

- [ ] **DNS & SSL**
  - [ ] concertride.me resolves to Cloudflare Pages
  - [ ] SSL certificate valid (https:// works)
  - [ ] No mixed content warnings

- [ ] **Smoke Tests** (5 min quick validation on production)
  - [ ] curl https://concertride.me → 200 (homepage loads)
  - [ ] curl https://concertride.me/festivales/mad-cool/ → 200
  - [ ] curl https://concertride.me/rutas/madrid-mad-cool/ → 200
  - [ ] curl https://concertride.me/blog/ → 200
  - [ ] curl https://concertride.me/robots.txt → 200
  - [ ] curl https://concertride.me/llms.txt → 200 (≥585 lines)

### Launch (Go Live)

- [ ] **Deploy to Production**
  - [ ] Push final changes to main (if any)
  - [ ] Verify Cloudflare Pages shows "Deployment successful"
  - [ ] Clear Cloudflare cache (if needed)
  - [ ] Announce in team: "FASE 7–9 launched"

- [ ] **Immediate Monitoring** (30 min post-launch)
  - [ ] Monitor error tracking (Sentry / logs)
  - [ ] Check Cloudflare Analytics (requests, errors)
  - [ ] Spot-check homepage, 3 landing pages in incognito
  - [ ] Test blog filtering works live
  - [ ] Verify OG images in social share preview (Twitter/LinkedIn)

---

## Post-Deployment (24–72 hours)

### Indexation & Visibility

- [ ] **Google Search Console**
  - [ ] Property verified (if not already)
  - [ ] Sitemap submitted (sitemap.xml)
  - [ ] API sitemap submitted (api/sitemap-concerts.xml)
  - [ ] Inspection tool: Sample 3 URLs → "URL is on Google" OR "Discovered but not indexed"
  - [ ] Monitor Coverage report for errors/warnings

- [ ] **Bing Webmaster Tools**
  - [ ] Submit sitemap
  - [ ] Verify site ownership

- [ ] **URL Indexation Checks** (48h later)
  - [ ] `site:concertride.me` in Google → ≥150 pages indexed
  - [ ] `/festivales/*` category indexed
  - [ ] `/rutas/*` category indexed
  - [ ] `/blog/*` posts indexed
  - [ ] `/conciertos/*` cities indexed

### Performance Validation

- [ ] **PageSpeed Insights**
  - [ ] Homepage: LCP <2.5s, FID <100ms, CLS <0.1 → Score ≥85
  - [ ] Festival page: Score ≥80
  - [ ] Route page: Score ≥80
  - [ ] City page: Score ≥80
  - [ ] Blog post: Score ≥80
  - [ ] Record baseline scores in `docs/CWV_MONITORING_DASHBOARD.md`

- [ ] **Rich Results Test** (Google Search Console)
  - [ ] Test 5 pages: Festival, Route, City, Blog, Artist
  - [ ] HowToTravelPage valid (0 errors)
  - [ ] FAQPage valid (0 errors)
  - [ ] BreadcrumbList valid (0 errors)
  - [ ] MusicEvent valid for festival pages (0 errors)

### Metadata Validation

- [ ] **Canonical Tags**
  - [ ] `curl -s https://concertride.me/festivales/mad-cool/ | grep canonical`
  - [ ] Returns: `<link rel="canonical" href="https://concertride.me/festivales/mad-cool/" />`
  - [ ] Spot-check 3 other pages

- [ ] **Geo Meta Tags**
  - [ ] Festival pages: `geo.region` (e.g., ES-MD)
  - [ ] City pages: `geo.position` (latitude;longitude)
  - [ ] All pages: `ICBM` tag present

- [ ] **OG Tags**
  - [ ] Homepage: `og:image` → valid PNG URL
  - [ ] Festival page: `og:image` → festival-specific image (not fallback)
  - [ ] Blog post: `og:image` → blog-specific or fallback

### Manual Testing

- [ ] **Blog Filtering (Live)**
  - [ ] Visit https://concertride.me/blog/
  - [ ] Click "Guías" button → only 5 guide posts shown
  - [ ] Click "Comparativas" → only 2 comparison posts shown
  - [ ] Search "autopublicbus" → find "Autobuses a festivales" post
  - [ ] Clear filters → all 15 posts shown again

- [ ] **Internal Links**
  - [ ] Visit festival page (e.g., `/festivales/mad-cool/`)
  - [ ] Scroll to "Recursos relacionados" section
  - [ ] Click "Autobuses a festivales" link → `/blog/autobuses-festivales-espana-2026/`
  - [ ] Return and click city link → `/conciertos/madrid/`
  - [ ] Verify no 404s

- [ ] **HowToTravelPage Display**
  - [ ] Visit `/rutas/madrid-mad-cool/`
  - [ ] Open DevTools Network → filter ld+json
  - [ ] Find HowToTravelPage block → 4 HowToStep items visible in source
  - [ ] Steps: "Busca", "Confirma", "Viaja", "Paga y disfruta" ✓

### AI Engine Testing

- [ ] **Perplexity Access** (first manual test)
  - [ ] Ask: "¿Cuánto cuesta carpooling Mad Cool desde Madrid?"
  - [ ] Expect: ConcertRide mentioned + price €9–13 estimated
  - [ ] Record result in `docs/PERPLEXITY_TEST_PLAN.md`

- [ ] **llms.txt Crawlability**
  - [ ] `curl -s https://concertride.me/llms.txt | wc -l`
  - [ ] Expect: ≥585 lines
  - [ ] Verify includes routes table, festivals, Q&A sections

---

## Issues & Rollback Plan

### If Critical Issues Found

#### Issue: Pages Not Indexed (48h post-launch)
- **Symptoms:** `site:concertride.me` shows <100 pages
- **Diagnostics:** GSC Coverage report → most pages "Discovered but not indexed"
- **Resolution:**
  1. Check `robots.txt` — if blocking, update Disallow rules
  2. Check sitemap — if invalid XML, regenerate
  3. Check canonical tags — if self-referencing incorrectly, fix
  4. Submit sitemap again in GSC
  5. Wait 48h for reindexing

#### Issue: Schema Errors in GSC
- **Symptoms:** Rich Results Test shows errors on prerendered pages
- **Diagnostics:** Google Search Console > Rich Results → list affected pages
- **Resolution:**
  1. Run `npm run validate:schema` locally to identify issue
  2. Fix schema in corresponding page component
  3. Rebuild & redeploy to Cloudflare Pages
  4. Retest in GSC Rich Results Test
  5. Mark as fixed in GSC

#### Issue: Performance Degradation (LCP >4s)
- **Symptoms:** PageSpeed Insights shows LCP >4000ms
- **Diagnostics:** Chrome DevTools Lighthouse → identify slow resource
- **Resolution:**
  1. Check Cloudflare cache headers (enable caching)
  2. Optimize images (use Sharp, webp format)
  3. Lazy-load components (React.lazy + Suspense)
  4. Profile with DevTools → identify bottleneck
  5. Rollback if necessary (previous deploy in Cloudflare Pages)

#### Issue: 404 on New Blog Posts
- **Symptoms:** Blog links return 404
- **Diagnostics:** Check `apps/web/src/lib/blogPosts.ts` — slug matches file?
- **Resolution:**
  1. Verify slug matches route in App.tsx
  2. Run `npm run build` to regenerate pages
  3. Redeploy to Cloudflare Pages
  4. Test `/blog/[slug]/` URLs

### Rollback Decision Criteria

**Automatic Rollback If:**
- [ ] ≥3 pages return 500 errors
- [ ] Homepage LCP > 5000ms
- [ ] Rich Results Test shows >5 critical errors
- [ ] Blog posts create 404s
- [ ] Geo tags missing from all pages

**Manual Rollback Decision:**
- If any of above occur, review with team
- Cloudflare Pages: Click "Rollback" to previous deployment
- Notify: Team Slack + GSC (in case of indexation issues)

---

## Post-Deployment Monitoring (Week 1)

### Daily Checks

- [ ] **Day 1**
  - [ ] GSC Coverage: pages indexed trend (should be rising)
  - [ ] Cloudflare Analytics: normal traffic levels
  - [ ] Error tracking: 0 critical errors

- [ ] **Day 2–3**
  - [ ] Google: Check site:concertride.me count (expect ≥100 pages)
  - [ ] Bing: Verify indexed
  - [ ] PageSpeed Insights: Baseline scores recorded

- [ ] **Day 4–7**
  - [ ] GSC: Monitor top queries appearing
  - [ ] Google Search: Manual search for "carpooling festival españa" — verify URLs appear
  - [ ] Perplexity: Test 3 of 10 reference queries (first manual batch)

### Weekly Report Template

**Week 1 Post-Launch Summary:**

| Metric | Status | Data |
|--------|--------|------|
| Pages indexed (GSC) | ✅ | ___/215 |
| Site searches visible | ✅/⚠️/❌ | Appearing in SERPs: YES/NO |
| Avg PageSpeed score | ✅/⚠️/❌ | ___/100 |
| Perplexity citations | ⚠️ | Tested 3/10 queries, cited ___/3 |
| Critical errors | ✅ | 0 |

**Action Items for Week 2:**
- [ ] _______________________
- [ ] _______________________

---

## Sign-Off

**Deployment Coordinator:**  
Name: ________________  
Date: ________________  
Time: ________________  

**QA Lead:**  
Name: ________________  
Date: ________________  
Approval: [ ] APPROVED [ ] CONDITIONAL [ ] HOLD

**Notes:**  
________________________________________________________________________

--------

## Timeline Estimate

| Phase | Duration | End Date |
|-------|----------|----------|
| Pre-Deployment QA | 24h | [TBD] |
| Deployment | 1h | [TBD] |
| Post-Deployment Monitoring | 72h | [TBD] |
| **Total** | **~4 days** | |

---

## References

- [FASE_7_IMPLEMENTATION_SUMMARY.md](FASE_7_IMPLEMENTATION_SUMMARY.md)
- [docs/PERPLEXITY_TEST_PLAN.md](docs/PERPLEXITY_TEST_PLAN.md)
- [docs/CWV_MONITORING_DASHBOARD.md](docs/CWV_MONITORING_DASHBOARD.md)
- [Cloudflare Pages Deployment Docs](https://developers.cloudflare.com/pages/)
- [Google Search Console Help](https://support.google.com/webmasters/)

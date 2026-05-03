# FASE 8–9 Monitoring & Launch Guide

**Document Purpose:** Unified reference for all post-deployment monitoring, validation, and optimization tasks.

**Status:** All FASE 7 deployed ✅ | FASE 8–9 templates ready ✅ | Awaiting blog posts & launch

---

## Quick Start

### For SEO Team (Post-Launch)

**Week 1:**
1. Submit sitemap to Google Search Console
2. Run Perplexity manual tests (3/10 queries)
3. Monitor PageSpeed Insights (5 sample URLs)
4. Check GSC Coverage: indexation trending up?

**Month 1:**
1. Monitor: GSC impressions, CTR, avg position
2. Test: Perplexity, ChatGPT, Claude for citations
3. Measure: Core Web Vitals (target: ≥85 score)
4. Document: Findings in respective dashboards

**Month 3+:**
1. Quarterly Perplexity test plan (full 10 queries)
2. Monthly CWV review
3. Identify new keyword gaps from GSC data
4. Plan FASE 10 optimizations (venue pages, artist expansions)

### For Developers (Pre-Launch)

**Pre-Deploy:**
1. `npm run build` → 0 errors
2. `npm run validate:schema` → 0 critical errors
3. `npm run seo-health-score` → ≥90
4. `npm run validate:llms` → no dead links
5. Manual testing: blog filtering, OG previews, breadcrumbs

**Post-Deploy (First 72h):**
1. Monitor Cloudflare error logs
2. Verify Sitemap indexation in GSC
3. Run Rich Results Test (5 sample URLs)
4. Test llms.txt accessibility: `curl https://concertride.me/llms.txt`

---

## Monitoring Infrastructure

### 1. Google Search Console (GSC)

**Location:** https://search.google.com/search-console

**Key Reports to Monitor:**

#### Performance Report
- **Frequency:** Daily (auto-update)
- **Metrics:**
  - Impressions (target: 5K–10K/month by week 4)
  - Click-through rate (target: 15–20%)
  - Average position (target: <5)
  - Top queries (capture for FASE 10 optimization)

**Action:** If avg position drops below position 10, identify page → run Page Experience report

#### Coverage Report
- **Frequency:** Weekly
- **Metrics:**
  - Total indexed pages (target: ≥200 by day 7)
  - Excluded pages (should be < 20)
  - Errors/warnings (investigate immediately if >0)

**Action:** If "Discovered but not indexed" >20 pages, check robots.txt + canonicals

#### Rich Results Report
- **Frequency:** Weekly
- **Metrics:**
  - FAQPage, HowToTravelPage, BreadcrumbList detection
  - Errors (target: 0)
  - Warnings (target: 0–2)

**Action:** If errors appear, run `npm run validate:schema` locally, fix, redeploy

#### Core Web Vitals Report
- **Frequency:** Weekly (Google CrUX data)
- **Metrics:**
  - LCP (target: <2.5s in 75%+ of sessions)
  - FID (target: <100ms in 75%+ of sessions)
  - CLS (target: <0.1 in 75%+ of sessions)

**Action:** If any metric in "Poor", follow CWV_MONITORING_DASHBOARD.md

---

### 2. Perplexity Citation Tracking

**Location:** Manual testing at https://www.perplexity.ai

**Test Plan:** [docs/PERPLEXITY_TEST_PLAN.md](docs/PERPLEXITY_TEST_PLAN.md)

**Frequency:**
- Week 1–4 post-launch: Weekly (monitor ramp-up)
- Month 2–3: Bi-weekly
- Month 4+: Quarterly (scheduled in PERPLEXITY_TEST_PLAN.md)

**Key Queries to Track:**
1. "¿Cuánto cuesta carpooling a [festival]?" (price + ConcertRide)
2. "Alternativa BlaBlaCar festival" (positioning)
3. "Transporte nocturno vuelta festival" (new blog post)
4. "Carpooling 0% comisión" (differentiation)
5. "Cómo llegar a [festival]" (transport options)

**Success Metrics:**
- ≥7/10 queries cite ConcertRide (with URL)
- ≥3/10 include specific pricing from our pages
- ≥2/10 mention "sin comisión" as advantage

**Escalation:** If citation drops <70%, analyze:
- Did content change? (Update blog/landing pages)
- Did competitor improve ranking? (Check SERP position in GSC)
- Was data wrong? (Fact-check in landing pages)

---

### 3. Core Web Vitals Monitoring

**Location:** [docs/CWV_MONITORING_DASHBOARD.md](docs/CWV_MONITORING_DASHBOARD.md)

**Tools:**
- **PageSpeed Insights:** https://pagespeed.web.dev (manual, weekly)
- **Google CrUX:** GSC > Core Web Vitals (automatic, weekly)
- **DevTools Lighthouse:** Chrome DevTools (local testing)

**Sample URLs (5 to track):**
1. https://concertride.me/ (homepage) — critical
2. https://concertride.me/festivales/mad-cool/ (festival) — critical
3. https://concertride.me/rutas/madrid-mad-cool/ (route) — critical
4. https://concertride.me/conciertos/madrid/ (city) — high
5. https://concertride.me/blog/autobuses-festivales/ (blog) — high

**Targets:**
- **LCP** <2.5s (75th percentile)
- **FID** <100ms (75th percentile)
- **CLS** <0.1 (75th percentile)

**Alert Thresholds:**
- 🔴 Red: Any metric fails (LCP >4s, FID >300ms, CLS >0.25)
- 🟡 Yellow: Trending down 2+ weeks
- 🟢 Green: All "Good" for 4+ weeks

---

### 4. AI Crawler Accessibility (llms.txt)

**Script:** [apps/web/scripts/test-llms-crawlability.mjs](apps/web/scripts/test-llms-crawlability.mjs)

**Execution Frequency:** Post-deploy, then monthly

**Checks:**
1. ✅ llms.txt returns 200 (not 404)
2. ✅ File size >585 bytes (content present)
3. ✅ Contains sections: Q&A, routes, festivals, E-E-A-T
4. ✅ All URLs in file are prerendered (no dead links)

**Manual Validation:**
```bash
curl https://concertride.me/llms.txt | head -20
```
Expect: 20 lines of Q&A header + routes table

**If Fails:**
- Check `apps/web/public/llms.txt` exists
- Verify Cloudflare Pages copied file to dist/
- Check for broken URLs in file (run script)
- Redeploy if needed

---

### 5. Rich Results Validation

**Script:** [apps/web/scripts/test-rich-results.mjs](apps/web/scripts/test-rich-results.mjs)

**Manual Validation Tool:** https://search.google.com/test/rich-results

**Execution Frequency:** Post-deploy, then monthly + after schema changes

**URLs to Test (5 per page type):**
- **Festivals:** mad-cool, primavera-sound, bbk-live, sonar, resurrection-fest
- **Routes:** madrid-mad-cool, barcelona-primavera-sound, madrid-sonar, madrid-bbk-live, madrid-resurrection-fest
- **Cities:** madrid, barcelona, bilbao, valencia
- **Blogs:** autobuses-festivales, /blog (index)

**Expected Results:**
- ✅ HowToTravelPage: 4 valid HowToStep items (position/name/text required)
- ✅ FAQPage: ≥3 questions, answers not empty
- ✅ BreadcrumbList: ≥2 items, valid URLs
- ✅ MusicEvent (festivals): valid dates, location

**If Errors Found:**
1. Note error type (e.g., "step[2]: missing text")
2. Identify page component (e.g., RouteLandingPage.tsx)
3. Fix schema in component
4. `npm run validate:schema` locally
5. Rebuild & redeploy
6. Retest in Google tool

---

## SEO Health Score

**Script:** [apps/web/scripts/seo-health-score.mjs](apps/web/scripts/seo-health-score.mjs)

**Execution:** Pre-deploy, then monthly

**Scoring Breakdown:**
| Category | Weight | Target |
|----------|--------|--------|
| Prerendered pages | 15% | ≥215 |
| Schema validity | 20% | 0 errors, ≤2 warnings |
| llms.txt crawlability | 15% | ✓ accessible, no dead links |
| Geo tags | 10% | ✓ region + position |
| OG images | 10% | ✓ valid on 80%+ pages |
| Sitemap | 10% | ✓ valid, ≥200 URLs |
| robots.txt | 10% | ✓ 13+ AI bots allowed |
| Breadcrumbs | 10% | ✓ on 80%+ pages |
| **TOTAL** | **100%** | **≥90** |

**Interpretation:**
- 90–100: Excellent, ready for launch ✅
- 75–89: Good, minor issues, deploy with caution ⚠️
- <75: Needs work, address blockers before launch ❌

---

## Deployment Checklist

**Full Details:** [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

**Quick Version:**

### Pre-Deploy (72h before)
- [ ] `npm run build` → 0 errors
- [ ] `npm run validate:schema` → 0 critical
- [ ] `npm run seo-health-score` → ≥90
- [ ] All 3 new blog posts written & linked
- [ ] Browser testing: desktop + mobile
- [ ] No broken links

### Launch Day
- [ ] Final smoke tests on production
- [ ] Monitor error logs (30 min)
- [ ] Verify PageSpeed baselines
- [ ] Announce: "Deployed"

### Post-Deploy (24–72h)
- [ ] Sitemap submitted to GSC
- [ ] site:concertride.me shows ≥150 pages (48h)
- [ ] Rich Results Test: 5 pages, 0 errors
- [ ] llms.txt returns 200 with content
- [ ] First Perplexity test (3/10 queries)

---

## Month-by-Month Timeline

### Month 1 (Weeks 1–4)
- **Week 1:** Deploy FASE 7–9, submit sitemap, run Perplexity tests
- **Week 2:** Monitor indexation (site:concertride.me), baseline CWV
- **Week 3:** Review GSC performance data, identify top queries
- **Week 4:** First full Perplexity test cycle (10 queries), write summary

**Target Outcomes:**
- 150+ pages indexed
- 3–5 organic impressions/day in GSC
- ≥3 Perplexity citations working

### Month 2 (Weeks 5–8)
- **Weekly:** GSC performance report, PageSpeed check
- **Bi-weekly:** Perplexity test (5 queries)
- **End of Month:** Full Perplexity cycle (10 queries), CWV review

**Target Outcomes:**
- 200+ pages indexed
- 10–20 organic impressions/day
- ≥5 Perplexity citations, price data appearing

### Month 3 (Weeks 9–12)
- **Weekly:** GSC monitoring, CWV dashboard update
- **Monthly:** Full Perplexity test plan (10 queries)
- **End of Month:** Quarterly review + recommend FASE 10

**Target Outcomes:**
- 215+ pages indexed
- 50–100 organic impressions/day
- Consistent Perplexity citations across queries
- Identified keyword gaps for FASE 10

---

## FASE 10 Planning (Future)

Based on data from FASE 8–9 monitoring:

**Potential Optimizations:**
- Venue landing pages (`/recintos/:slug`) — capitalize on "recinto [venue] cómo llegar" keyword gap
- Artist expansion — boost artist-to-festival linking
- Region hubs — optimize regional festival clustering
- Blog content calendar — quarterly new posts based on top GSC queries
- Programmatic subdomains (optional) — city.concertride.me model

**Decision Point:** End of Month 3 (when GSC data stabilizes)

---

## Emergency Playbook

### Issue: Pages Not Indexed (GSC shows <100 pages after 48h)

**Diagnosis:**
1. GSC Coverage → "Discovered but not indexed" = likely robots.txt or canonical issue
2. Check robots.txt: `curl https://concertride.me/robots.txt | grep -i disallow`
3. Check canonical on sample page: `curl https://concertride.me/festivales/mad-cool/ | grep canonical`

**Recovery:**
1. If robots.txt blocks crawling: update, redeploy
2. If canonicals point elsewhere: fix in component, rebuild
3. Resubmit sitemap in GSC
4. Wait 24–48h for reindexation

---

### Issue: Performance Degradation (LCP >4s)

**Diagnosis:**
1. PageSpeed Insights → Lighthouse report → identify slow resource
2. Check Cloudflare cache: is cache-control header set?
3. Chrome DevTools → Network tab → which resource is slowest?

**Recovery:**
1. Enable Cloudflare caching: check _headers file
2. Optimize images: ensure Sharp compression applied
3. Lazy-load components: wrap in React.lazy()
4. If urgent: rollback previous deploy in Cloudflare Pages

---

### Issue: Schema Errors in GSC

**Diagnosis:**
1. GSC > Rich Results → list affected pages
2. Run: `npm run validate:schema` locally
3. Identify error (e.g., "missing @type", "empty field")

**Recovery:**
1. Fix schema in corresponding component (e.g., RouteLandingPage.tsx)
2. `npm run validate:schema` → verify fix
3. `npm run build` → rebuild
4. Redeploy to Cloudflare Pages
5. Retest in Google Rich Results Tool

---

## Contact & Escalation

| Issue | Owner | Action |
|-------|-------|--------|
| GSC indexation | SEO | Monitor coverage, investigate <100 pages |
| Perplexity citations | SEO | Test monthly, analyze if ≥3 queries fail |
| PageSpeed degradation | Dev | Profile, optimize, rollback if needed |
| Schema errors | Dev | Fix component, redeploy, validate |
| Blog content calendar | Marketing | Coordinate with SEO on keyword gaps |

---

## References & Tools

- **Google Search Console:** https://search.google.com/search-console
- **PageSpeed Insights:** https://pagespeed.web.dev
- **Rich Results Test:** https://search.google.com/test/rich-results
- **Perplexity AI:** https://www.perplexity.ai
- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/
- **Schema.org Reference:** https://schema.org

---

**Document Version:** 1.0  
**Last Updated:** 2026-05-03  
**Next Review:** [Date of deployment + 30 days]

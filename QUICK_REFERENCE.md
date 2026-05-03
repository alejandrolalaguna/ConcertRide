# ConcertRide FASE 7–9 Quick Reference Card

**Print this. Keep it on your desk.**

---

## 🚀 Launch Checklist (TL;DR)

```bash
# Pre-Deploy (48h before)
npm run build                 # 0 errors?
npm run type-check            # 0 errors?
npm run validate:schema       # 0 critical?
npm run seo-health-score      # ≥90?
# Manual: blog filtering works? OG images render? Breadcrumbs present?

# Deploy
# Push to Cloudflare Pages → wait for "Deployment successful"

# Post-Deploy (immediately)
curl https://concertride.me               # 200?
curl https://concertride.me/llms.txt      # 200 + 585+ lines?
# Manual: Rich Results Test 5 URLs → 0 errors?

# Day 3+
# Submit sitemap to Google Search Console
```

---

## 📊 Key Metrics to Watch (Month 1)

| Timeline | Metric | Target | Check In |
|----------|--------|--------|----------|
| **Day 1** | HTTP 200 responses | All pages | curl + browser |
| **Day 3** | GSC Sitemap indexed | Submitted | GSC Dashboard |
| **Day 7** | Pages in GSC | ≥100 | GSC Coverage |
| **Week 2** | Impressions/day | 3–5 | GSC Performance |
| **Week 3** | Indexed pages | ≥150 | GSC Coverage |
| **Week 4** | Impressions/day | 20–50 | GSC Performance |

---

## 🤖 AI Engine Testing (Month 1)

**Perplexity Manual Tests (Do 3 first week, then all 10):**

```
Q: "¿Cuánto cuesta carpooling a Mad Cool desde Madrid?"
✅ Expected: ConcertRide mentioned + price €9–13

Q: "¿Alternativa a BlaBlaCar para festivales?"
✅ Expected: ConcertRide highlighted + "sin comisión"

Q: "¿Cómo llegar a [festival] sin coche?"
✅ Expected: Carpooling option mentioned + ConcertRide

(See PERPLEXITY_TEST_PLAN.md for all 10 + detailed scoring)
```

---

## ⚡ Common Issues & Fixes

### "Pages not indexed in GSC"
**If:** `site:concertride.me` shows <100 pages after 3 days  
**Do:**
1. Check GSC Coverage report → what status?
2. If "Discovered, not indexed" → robots.txt issue
3. Run: `curl https://concertride.me/robots.txt | grep -i disallow`
4. If blocking: update Disallow rules
5. Resubmit sitemap

### "Schema errors in GSC"
**If:** Rich Results Test shows errors  
**Do:**
1. Run: `npm run validate:schema`
2. Find page with error
3. Edit component (e.g., RouteLandingPage.tsx)
4. `npm run build` → rebuild
5. Redeploy → retest

### "Slow performance (LCP >4s)"
**If:** PageSpeed Insights shows LCP >4000ms  
**Do:**
1. Chrome DevTools → Lighthouse report
2. Identify slow resource (image? JS?)
3. Optimize or lazy-load
4. Retest locally
5. If urgent: rollback deploy in Cloudflare Pages

---

## 📝 Files You'll Need

| Document | Purpose | When |
|----------|---------|------|
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Pre/during/post deploy | Launch day |
| [FASE_8_9_MONITORING_GUIDE.md](FASE_8_9_MONITORING_GUIDE.md) | Month 1–3 monitoring | Post-launch |
| [docs/PERPLEXITY_TEST_PLAN.md](docs/PERPLEXITY_TEST_PLAN.md) | AI citation testing | Weekly week 1–4, then monthly |
| [docs/CWV_MONITORING_DASHBOARD.md](docs/CWV_MONITORING_DASHBOARD.md) | Performance tracking | Weekly |
| [FASE_7_8_9_EXECUTIVE_SUMMARY.md](FASE_7_8_9_EXECUTIVE_SUMMARY.md) | What was delivered | Onboarding reference |

---

## 🔧 Scripts You'll Run

```bash
# Pre-Deploy
npm run build                      # Build everything
npm run validate:schema            # Check JSON-LD
npm run seo-health-score           # Pre-launch score
npm run validate:llms              # Check AI crawler files
npm run test-rich-results          # Rich Results validation

# Post-Deploy (manual at rich-results.google.com)
# Then:
# 1. Submit sitemap in GSC
# 2. Run Perplexity tests
# 3. Monitor PageSpeed Insights
```

---

## 📱 URLs to Monitor (PageSpeed Insights)

Add these to your weekly check (https://pagespeed.web.dev):

1. https://concertride.me/
2. https://concertride.me/festivales/mad-cool/
3. https://concertride.me/rutas/madrid-mad-cool/
4. https://concertride.me/conciertos/madrid/
5. https://concertride.me/blog/autobuses-festivales-espana-2026/

**Target:** ≥85/100 score (all green)

---

## 🎯 Success Indicators (Month 1)

- [ ] ✅ 200+ pages indexed in GSC (by day 10)
- [ ] ✅ 10–50 organic impressions/day (by week 4)
- [ ] ✅ PageSpeed ≥85 on 5 sample URLs
- [ ] ✅ ≥3 Perplexity citations working (by week 4)
- [ ] ✅ 0 critical errors in GSC/Rich Results Test
- [ ] ✅ llms.txt accessible (200 response, 585+ lines)

---

## 🚨 Emergency Contacts

| Issue | Owner | Contact |
|-------|-------|---------|
| GSC indexation / organic traffic | SEO | [Name] |
| Build failures / deployment | Dev | [Name] |
| Content / blog posts | Marketing | [Name] |
| Perplexity citations / AI ranking | SEO | [Name] |

---

## 📅 30-Day Roadmap

| Week | Focus | Owner | Deliverable |
|------|-------|-------|------------|
| Week 1 | Deploy + monitor indexation | Dev + SEO | 100+ pages indexed |
| Week 2 | GSC performance analysis | SEO | First traffic data |
| Week 3 | Full Perplexity test (10 queries) | SEO | Citation report |
| Week 4 | Month 1 summary + Month 2 plan | All | Metrics dashboard filled |

---

## 💡 Pro Tips

1. **Daily:** Check Cloudflare error logs (first week)
2. **Weekly:** Spot-check 5 URLs on PageSpeed Insights
3. **Bi-weekly:** Run Perplexity test (3 queries)
4. **Monthly:** Full Perplexity cycle (10 queries) + CWV review
5. **Save GSC data:** Export CSV monthly for historical comparison

---

## 📞 Questions?

- **How do I add a new blog post?**  
  Edit `apps/web/src/lib/blogPosts.ts`, add post, run `npm run build`

- **How do I test if the schema is valid?**  
  Run `npm run validate:schema` locally, or use https://search.google.com/test/rich-results

- **What if indexation is slow?**  
  Check GSC Coverage report, resubmit sitemap, wait 48–72h

- **How do I know if Perplexity is citing us?**  
  Open https://www.perplexity.ai, ask test queries, check citations (link to concertride.me)

---

**Last Updated:** May 3, 2026  
**Status:** Ready for deployment ✅  
**Awaiting:** 3 blog posts only

---

*Print this card. Tape it to your monitor. Use it daily for the first month.*

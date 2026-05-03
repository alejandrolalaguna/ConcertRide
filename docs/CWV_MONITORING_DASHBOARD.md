# Core Web Vitals (CWV) Monitoring Dashboard

**Purpose:** Track performance metrics that affect SEO ranking and user experience

**Monitoring Frequency:** Weekly (automated via PageSpeed Insights) + Monthly (manual review)

**Target Performance:**
- **LCP** (Largest Contentful Paint): <2.5s
- **FID** (First Input Delay): <100ms
- **CLS** (Cumulative Layout Shift): <0.1

---

## Sample URLs to Monitor

| Page Type | URL | Priority |
|-----------|-----|----------|
| Homepage | https://concertride.me/ | Critical |
| Festival | https://concertride.me/festivales/mad-cool/ | Critical |
| Route | https://concertride.me/rutas/madrid-mad-cool/ | Critical |
| City | https://concertride.me/conciertos/madrid/ | High |
| Blog | https://concertride.me/blog/autobuses-festivales-espana-2026/ | High |
| Artist | https://concertride.me/artistas/coldplay/ | Medium |

---

## Weekly Tracking (PageSpeed Insights)

### Week 1: [Date Range]

#### https://concertride.me/ (Homepage)
- **LCP:** _____ ms (Target: <2500ms)  Status: [ ] Good [ ] Needs Work  
- **FID:** _____ ms (Target: <100ms)    Status: [ ] Good [ ] Needs Work  
- **CLS:** _____ (Target: <0.1)         Status: [ ] Good [ ] Needs Work  
- **Overall Score:** ___/100
- **Issues Found:**
  - [ ] Large image not optimized
  - [ ] Render-blocking JavaScript
  - [ ] Unminified CSS
  - [ ] Other: _____________

#### https://concertride.me/festivales/mad-cool/
- **LCP:** _____ ms  Status: [ ] Good [ ] Needs Work  
- **FID:** _____ ms  Status: [ ] Good [ ] Needs Work  
- **CLS:** _____     Status: [ ] Good [ ] Needs Work  
- **Overall Score:** ___/100

#### https://concertride.me/rutas/madrid-mad-cool/
- **LCP:** _____ ms  Status: [ ] Good [ ] Needs Work  
- **FID:** _____ ms  Status: [ ] Good [ ] Needs Work  
- **CLS:** _____     Status: [ ] Good [ ] Needs Work  
- **Overall Score:** ___/100

#### https://concertride.me/conciertos/madrid/
- **LCP:** _____ ms  Status: [ ] Good [ ] Needs Work  
- **FID:** _____ ms  Status: [ ] Good [ ] Needs Work  
- **CLS:** _____     Status: [ ] Good [ ] Needs Work  
- **Overall Score:** ___/100

#### https://concertride.me/blog/autobuses-festivales-espana-2026/
- **LCP:** _____ ms  Status: [ ] Good [ ] Needs Work  
- **FID:** _____ ms  Status: [ ] Good [ ] Needs Work  
- **CLS:** _____     Status: [ ] Good [ ] Needs Work  
- **Overall Score:** ___/100

**Week 1 Summary:**
- Passing URLs: ___/5
- Failing URLs: ___/5
- Action Items: _______________________

---

### Week 2: [Date Range]

#### Homepage
- **LCP:** _____ ms  [ ] Good [ ] Needs Work | **FID:** _____ ms [ ] Good [ ] Needs Work | **CLS:** _____ [ ] Good [ ] Needs Work
- **Overall:** ___/100

#### Festival
- **LCP:** _____ ms  [ ] Good [ ] Needs Work | **FID:** _____ ms [ ] Good [ ] Needs Work | **CLS:** _____ [ ] Good [ ] Needs Work
- **Overall:** ___/100

#### Route
- **LCP:** _____ ms  [ ] Good [ ] Needs Work | **FID:** _____ ms [ ] Good [ ] Needs Work | **CLS:** _____ [ ] Good [ ] Needs Work
- **Overall:** ___/100

#### City
- **LCP:** _____ ms  [ ] Good [ ] Needs Work | **FID:** _____ ms [ ] Good [ ] Needs Work | **CLS:** _____ [ ] Good [ ] Needs Work
- **Overall:** ___/100

#### Blog
- **LCP:** _____ ms  [ ] Good [ ] Needs Work | **FID:** _____ ms [ ] Good [ ] Needs Work | **CLS:** _____ [ ] Good [ ] Needs Work
- **Overall:** ___/100

**Week 2 Summary:**
- Passing URLs: ___/5
- Improvement vs Week 1: +___ / -___ / same
- Action Items: _______________________

---

## Monthly Summary Report

### Month: [Month/Year]

| URL | LCP | FID | CLS | Score | Trend |
|-----|-----|-----|-----|-------|-------|
| Homepage | ___ ms | ___ ms | ___ | ___/100 | ↑↓→ |
| Festival | ___ ms | ___ ms | ___ | ___/100 | ↑↓→ |
| Route | ___ ms | ___ ms | ___ | ___/100 | ↑↓→ |
| City | ___ ms | ___ ms | ___ | ___/100 | ↑↓→ |
| Blog | ___ ms | ___ ms | ___ | ___/100 | ↑↓→ |
| **Average** | **___ ms** | **___ ms** | **___** | **___/100** | |

**Status:**
- [ ] All URLs "Good" (green)
- [ ] 1–2 URLs "Needs Improvement" (yellow)
- [ ] 3+ URLs "Poor" (red)

---

## Performance Optimization Log

### Issue 1: [Issue Description]

**Detected:** [Date]  
**Root Cause:** _________________________________  
**Solution Applied:** _________________________________  
**Implementation Date:** _________________________________  
**Result:** [ ] Resolved [ ] In Progress [ ] Pending

**Metric Impact:**
- LCP before: _____ ms → after: _____ ms
- FID before: _____ ms → after: _____ ms
- CLS before: _____ → after: _____

---

### Issue 2: [Issue Description]

**Detected:** [Date]  
**Root Cause:** _________________________________  
**Solution Applied:** _________________________________  
**Implementation Date:** _________________________________  
**Result:** [ ] Resolved [ ] In Progress [ ] Pending

**Metric Impact:**
- LCP before: _____ ms → after: _____ ms
- FID before: _____ ms → after: _____ ms
- CLS before: _____ → after: _____

---

## Optimization Recommendations

### Current Bottlenecks:
1. ________________________________________
2. ________________________________________
3. ________________________________________

### Quick Wins (< 1 hour to implement):
- [ ] Image optimization (Sharp already installed)
- [ ] Lazy loading components (React.lazy + Suspense)
- [ ] Font subsetting (remove unused weights)
- [ ] Other: _________________________________

### Medium Effort (1–4 hours):
- [ ] Code splitting by route
- [ ] CSS removal (unused Tailwind)
- [ ] Cache optimization (Cloudflare)
- [ ] Other: _________________________________

### Long-term (> 4 hours or architectural):
- [ ] Database query optimization
- [ ] CDN content distribution
- [ ] Edge rendering (Cloudflare Pages optimization)
- [ ] Other: _________________________________

---

## Automation & Tools

### PageSpeed Insights
- **URL:** https://pagespeed.web.dev
- **Frequency:** Weekly manual check (desktop + mobile)
- **Reporting:** Record scores in Weekly Tracking section above

### CrUX Data (Google Chrome User Experience Report)
- **Dashboard:** https://lookerstudio.google.com/c/u/0/reporting/bae73edc-4bcc-4a59-b6dd-987157127f11
- **Update Frequency:** Monthly
- **Key Metrics:** Real-world LCP, FID, CLS from actual users

### Google Search Console
- **Path:** Search Console > Core Web Vitals
- **Frequency:** Weekly auto-report
- **Action:** Flag pages with "Poor" status

---

## Alerting Rules

| Condition | Severity | Action |
|-----------|----------|--------|
| Any URL LCP > 4000ms | 🔴 Critical | Investigate immediately, create GitHub issue |
| Any URL FID > 300ms | 🔴 Critical | Investigate immediately, create GitHub issue |
| Any URL CLS > 0.25 | 🟡 Warning | Schedule optimization, not blocking |
| 50%+ URLs trending down | 🟡 Warning | Review recent changes, rollback if needed |
| All URLs "Good" for 4+ weeks | 🟢 Success | Document best practices, celebrate! |

---

## Archive (Historical Data)

### Month 1 (Post-Launch)
- Date: __________ to __________
- Average Score: ___/100
- Key Issue: _______________________
- Resolution: _______________________

### Month 2
- Date: __________ to __________
- Average Score: ___/100
- Key Issue: _______________________
- Resolution: _______________________

### Month 3
- Date: __________ to __________
- Average Score: ___/100
- Key Issue: _______________________
- Resolution: _______________________

---

## Links & Resources

- [Google PageSpeed Insights](https://pagespeed.web.dev)
- [Web.dev Performance Guide](https://web.dev/performance)
- [Vercel Web Vitals](https://vercel.com/blog/core-web-vitals)
- [Cloudflare Performance](https://www.cloudflare.com/en-gb/learning/performance/)
- [React Performance Optimization](https://react.dev/reference/react/lazy)

---

**Last Updated:** _________  
**Monitored By:** _________  
**Next Review:** _________

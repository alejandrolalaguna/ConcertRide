# SEO Implementation Guide

This directory contains SEO utilities and configuration for ConcertRide ES.

## Files

### `seoConfig.ts`
Centralized configuration for all SEO-related settings including:
- Site metadata (name, URL, description)
- Keywords (primary and long-tail)
- Open Graph and Twitter Card defaults
- Schema.org markup templates
- Social media handles
- Legal page routes
- Robots.txt configuration
- Core Web Vitals targets
- AI crawler permissions

**Usage:**
```typescript
import { SEO_CONFIG, getPageSeo, buildSchema } from '@/lib/seoConfig'

// Get page-specific SEO metadata
const pageSeo = getPageSeo('home')

// Build schema markup
const schema = buildSchema('organization')
```

### `useSeoMeta.ts` (Existing)
Hook for setting page-level meta tags (title, description, canonical).

**Usage:**
```typescript
import { useSeoMeta } from '@/lib/useSeoMeta'

export default function MyPage() {
  useSeoMeta({
    title: 'Page Title',
    description: 'Page description',
    canonical: 'https://concertride.me/page',
  })
  return <div>...</div>
}
```

### `useSeoEnhancements.ts` (New)
Hook for advanced SEO features:
- Canonical URLs
- Hreflang tags (multi-language)
- DNS prefetch
- Resource preloading
- Open Graph meta tags
- Core Web Vitals tracking
- Structured data

**Usage:**
```typescript
import { useSeoEnhancements, useSocialMetaTags } from '@/lib/useSeoEnhancements'

export default function MyPage() {
  useSeoEnhancements({
    canonical: 'https://concertride.me/page',
    preloadCritical: true,
    dnsPrefetch: true,
  })

  useSocialMetaTags({
    title: 'Page Title',
    description: 'Page description',
    image: 'https://concertride.me/og/image.png',
    url: 'https://concertride.me/page',
    type: 'article',
  })

  return <div>...</div>
}
```

## Components

### `SchemaMarkup.tsx` (New)
React components for rendering JSON-LD schema markup:

**Basic usage:**
```typescript
import { SchemaMarkup, OrganizationSchema, BreadcrumbSchema } from '@/components/SchemaMarkup'

export default function MyPage() {
  return (
    <>
      <OrganizationSchema
        name="ConcertRide ES"
        url="https://concertride.me"
        logo="https://concertride.me/logo.png"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://concertride.me', position: 1 },
          { name: 'Concerts', url: 'https://concertride.me/concerts', position: 2 },
        ]}
      />
      {/* Page content */}
    </>
  )
}
```

**Available schema helpers:**
- `SchemaMarkup` - Generic JSON-LD renderer
- `SchemaMarkupBatch` - Render multiple schemas
- `OrganizationSchema` - Organization information
- `WebSiteSchema` - Website with search action
- `BreadcrumbSchema` - Navigation breadcrumbs
- `ArticleSchema` - Blog posts and articles
- `FAQSchema` - FAQ structured data

## Best Practices

### 1. Page-Level SEO
Every page should implement basic SEO:
```typescript
export default function Page() {
  useSeoMeta({
    title: 'Page Title | ConcertRide ES',
    description: 'Page description (150-160 chars)',
    canonical: `${SITE_URL}/page-path`,
  })
  
  useSeoEnhancements({
    preloadCritical: true,
  })
  
  return <main id="main">...</main>
}
```

### 2. Schema Markup
Add appropriate schema for each page type:
- Homepage: Organization + WebSite
- Concert pages: Service + LocalBusiness
- Blog posts: Article
- FAQ: FAQPage
- Navigation: BreadcrumbList

### 3. Social Sharing
Always set Open Graph tags for better social sharing:
```typescript
useSocialMetaTags({
  title: 'Page Title',
  description: 'Description that appears in social shares',
  image: '/og/page-specific-image.png',
  url: currentPageUrl,
})
```

### 4. Meta Tags Checklist
- ✅ Title (50-60 chars, includes keyword)
- ✅ Description (150-160 chars, includes CTA)
- ✅ Canonical URL (avoid duplicates)
- ✅ Open Graph (social sharing)
- ✅ Twitter Card (social sharing)
- ✅ Mobile viewport (responsive)
- ✅ Language attribute (lang="es")

### 5. Structured Data
- Use JSON-LD format (not Microdata or RDFa)
- Always include @context and @type
- Use absolute URLs (not relative)
- Validate with: https://schema.org/validator

### 6. Performance
- Preload critical fonts
- DNS prefetch external services
- Lazy load images
- Minify CSS/JS
- Target Core Web Vitals:
  - LCP < 2.5s
  - INP < 200ms
  - CLS < 0.1

## Configuration Updates

When updating `seoConfig.ts`:
1. Update verification tokens when you have them:
   ```typescript
   analytics: {
     googleSiteVerification: "YOUR_TOKEN",
     bingVerification: "YOUR_TOKEN",
     yandexVerification: "YOUR_TOKEN",
   }
   ```

2. Add new pages to the `pages` object:
   ```typescript
   pages: {
     // ... existing pages
     newPage: {
       title: "Page Title",
       description: "Page description",
       keywords: "keyword1, keyword2",
     }
   }
   ```

3. Update social handles if they change:
   ```typescript
   social: {
     twitter: "@new_handle",
     // ...
   }
   ```

## Integration with Existing Code

These SEO utilities integrate with:
- `useSeoMeta` hook (existing)
- React Router for canonical URLs
- Tailwind CSS (no styling conflicts)
- Existing component structure

## Testing SEO

Use these free tools to test your implementation:

1. **Google Rich Results Test**
   https://search.google.com/test/rich-results

2. **Schema.org Validator**
   https://validator.schema.org/

3. **Google PageSpeed Insights**
   https://pagespeed.web.dev/

4. **Lighthouse (Chrome DevTools)**
   - Audit → SEO
   - Check Core Web Vitals

## Files Modified

- `apps/web/src/components/Footer.tsx` - Updated legal links and GDPR contact
- `apps/web/public/robots.txt` - Created crawler rules
- `apps/web/public/sitemap.xml` - Created URL index
- `apps/web/public/llms.txt` - Created AI declarations

## Next Steps

1. Replace verification tokens in `seoConfig.ts`
2. Run `npm run build` to verify no errors
3. Deploy with `npm run deploy`
4. Submit sitemap to Google Search Console
5. Monitor performance in Google Search Console

## References

- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Web Vitals](https://web.dev/vitals/)
- [React SEO Best Practices](https://ahrefs.com/blog/technical-seo/)

---

Last updated: 2026-04-25
For questions: alejandrolalaguna@gmail.com

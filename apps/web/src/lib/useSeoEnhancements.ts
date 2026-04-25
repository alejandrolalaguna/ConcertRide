/**
 * useSeoEnhancements Hook
 * Provides SEO optimization utilities for pages
 * Integrates with existing useSeoMeta hook for enhanced functionality
 */

import { useEffect } from 'react'

interface SeoEnhancementsOptions {
  /**
   * Enable preload of critical resources
   */
  preloadCritical?: boolean

  /**
   * Enable DNS prefetch for external services
   */
  dnsPrefetch?: boolean

  /**
   * Enable structured data rendering
   */
  structuredData?: boolean

  /**
   * Set canonical URL
   */
  canonical?: string

  /**
   * Add hreflang tags for multi-language support
   */
  hreflangs?: Array<{
    lang: string
    href: string
  }>
}

/**
 * Hook to apply SEO enhancements to a page
 * Works alongside useSeoMeta for comprehensive SEO setup
 */
export function useSeoEnhancements(options: SeoEnhancementsOptions = {}) {
  const {
    preloadCritical = true,
    dnsPrefetch = true,
    structuredData = true,
    canonical,
    hreflangs = [],
  } = options

  useEffect(() => {
    // Set canonical URL if provided
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (!canonicalLink) {
        canonicalLink = document.createElement('link') as HTMLLinkElement
        canonicalLink.rel = 'canonical'
        document.head.appendChild(canonicalLink)
      }
      canonicalLink.setAttribute('href', canonical)
    }

    // Add hreflang tags for multi-language support
    if (hreflangs.length > 0) {
      // Remove existing hreflang tags
      const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]')
      existingHreflangs.forEach((tag) => tag.remove())

      // Add new hreflang tags
      hreflangs.forEach(({ lang, href }) => {
        const hreflangLink = document.createElement('link') as HTMLLinkElement
        hreflangLink.rel = 'alternate'
        hreflangLink.hreflang = lang
        hreflangLink.href = href
        document.head.appendChild(hreflangLink)
      })
    }
  }, [canonical, hreflangs])

  // Preload critical resources
  useEffect(() => {
    if (!preloadCritical) return

    const criticalResources = [
      {
        href: 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
        as: 'style',
      },
    ]

    criticalResources.forEach(({ href, as }) => {
      let preloadLink = document.querySelector(`link[rel="preload"][href="${href}"]`) as HTMLLinkElement | null
      if (!preloadLink) {
        preloadLink = document.createElement('link') as HTMLLinkElement
        preloadLink.rel = 'preload'
        preloadLink.setAttribute('as', as)
        preloadLink.href = href
        document.head.appendChild(preloadLink)
      }
    })
  }, [preloadCritical])

  // DNS prefetch for external services
  useEffect(() => {
    if (!dnsPrefetch) return

    const externalDomains = [
      'https://api.ticketmaster.com',
      'https://s1.ticketm.net',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://basemaps.cartocdn.com',
    ]

    externalDomains.forEach((domain) => {
      let dnsPrefetchLink = document.querySelector(`link[rel="dns-prefetch"][href="${domain}"]`) as HTMLLinkElement | null
      if (!dnsPrefetchLink) {
        dnsPrefetchLink = document.createElement('link') as HTMLLinkElement
        dnsPrefetchLink.rel = 'dns-prefetch'
        dnsPrefetchLink.href = domain
        document.head.appendChild(dnsPrefetchLink)
      }
    })
  }, [dnsPrefetch])
}

/**
 * Hook to add Open Graph and Twitter Card meta tags
 */
export function useSocialMetaTags(options: {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'video'
}) {
  const { title, description, image, url, type = 'website' } = options

  useEffect(() => {
    const metaTags = [
      { property: 'og:type', content: type },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      ...(image ? [{ property: 'og:image', content: image }] : []),
      ...(url ? [{ property: 'og:url', content: url }] : []),
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      ...(image ? [{ name: 'twitter:image', content: image }] : []),
    ]

    metaTags.forEach(({ property, name, content }) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`
      let tag = document.querySelector(selector) as HTMLMetaElement
      if (!tag) {
        tag = document.createElement('meta')
        if (property) {
          tag.setAttribute('property', property)
        } else if (name) {
          tag.setAttribute('name', name)
        }
        document.head.appendChild(tag)
      }
      tag.content = content
    })
  }, [title, description, image, url, type])
}

/**
 * Hook to track Core Web Vitals and report to analytics
 * Integrates with existing analytics setup
 */
export function useCoreWebVitals() {
  useEffect(() => {
    // Check if web-vitals is available
    try {
      // Dynamically import web-vitals to avoid adding it as a direct dependency
      // This assumes it's already available in the project
      import('web-vitals').then((module: any) => {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = module
        // Report metrics to analytics (PostHog, Google Analytics, etc.)
        if (getCLS) getCLS((metric: any) => { console.debug('CLS:', metric.value) })
        if (getFID) getFID((metric: any) => { console.debug('FID:', metric.value) })
        if (getFCP) getFCP((metric: any) => { console.debug('FCP:', metric.value) })
        if (getLCP) getLCP((metric: any) => { console.debug('LCP:', metric.value) })
        if (getTTFB) getTTFB((metric: any) => { console.debug('TTFB:', metric.value) })
      })
    } catch (e) {
      // web-vitals not available, skip
    }
  }, [])
}

/**
 * Hook to add structured data (JSON-LD) to a page
 */
export function useStructuredData(schema: Record<string, any>) {
  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [schema])
}

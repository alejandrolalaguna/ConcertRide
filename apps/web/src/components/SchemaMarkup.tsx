/**
 * SchemaMarkup Component
 * Renders JSON-LD schema markup in the document head
 * Used for SEO structured data and AI crawler optimization
 */

import { useEffect } from 'react'

interface SchemaMarkupProps {
  schema: Record<string, any>
  type?: 'application/ld+json'
}

/**
 * Component to inject JSON-LD schema markup
 * @param schema - Schema object to render
 * @param type - MIME type (default: 'application/ld+json')
 */
export function SchemaMarkup({ schema, type = 'application/ld+json' }: SchemaMarkupProps) {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script')
    script.type = type
    script.textContent = JSON.stringify(schema)
    script.setAttribute('data-testid', `schema-${schema['@type'] || 'unknown'}`)

    // Append to head
    document.head.appendChild(script)

    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [schema, type])

  return null
}

/**
 * Batch render multiple schema markups
 * @param schemas - Array of schema objects
 */
export function SchemaMarkupBatch({ schemas }: { schemas: Record<string, any>[] }) {
  return (
    <>
      {schemas.map((schema, idx) => (
        <SchemaMarkup
          key={`${schema['@type']}-${idx}`}
          schema={schema}
        />
      ))}
    </>
  )
}

/**
 * Organization schema helper
 */
export function OrganizationSchema({ name, url, logo }: { name: string; url: string; logo: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
  }
  return <SchemaMarkup schema={schema} />
}

/**
 * WebSite schema helper (for site-wide search action)
 */
export function WebSiteSchema({ name, url }: { name: string; url: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/concerts?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
  return <SchemaMarkup schema={schema} />
}

/**
 * WebPage schema helper with optional SpeakableSpecification
 */
export function WebPageSchema({
  id,
  url,
  name,
  description,
  datePublished,
  dateModified,
  isPartOf,
  speakable = true,
  speakableCssSelectors,
}: {
  id?: string
  url: string
  name: string
  description?: string
  datePublished?: string
  dateModified?: string
  isPartOf?: string
  speakable?: boolean
  speakableCssSelectors?: string[]
}) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    ...(id && { '@id': id }),
    url,
    name,
    ...(description && { description }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(isPartOf && { isPartOf: { '@id': isPartOf } }),
  }
  if (speakable) {
    schema['speakable'] = {
      '@type': 'SpeakableSpecification',
      cssSelector: speakableCssSelectors ?? ['h1', '.speakable'],
    }
  }
  return <SchemaMarkup schema={schema} />
}

/**
 * BreadcrumbList schema helper
 */
export interface BreadcrumbItem {
  name: string
  url: string
  position: number
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.url,
    })),
  }
  return <SchemaMarkup schema={schema} />
}

/**
 * Article schema helper with abstract, mentions, about, and SpeakableSpecification
 */
export function ArticleSchema({
  headline,
  description,
  abstract,
  image,
  datePublished,
  dateModified,
  author,
  authorUrl,
  authorSameAs,
  url,
  mentions,
  about,
  speakable = true,
  speakableCssSelectors,
}: {
  headline: string
  description: string
  abstract?: string
  image: string
  datePublished: string
  dateModified?: string
  author?: string
  authorUrl?: string
  authorSameAs?: string[]
  url?: string
  mentions?: Array<{ name: string; type?: string; sameAs?: string }>
  about?: { name: string; type?: string; sameAs?: string }
  speakable?: boolean
  speakableCssSelectors?: string[]
}) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    inLanguage: 'es-ES',
    ...(abstract && { abstract }),
    ...(url && { url }),
    ...(about && {
      about: {
        '@type': about.type ?? 'Thing',
        name: about.name,
        ...(about.sameAs && { sameAs: about.sameAs }),
      },
    }),
    ...(mentions && mentions.length > 0 && {
      mentions: mentions.map((m) => ({
        '@type': m.type ?? 'Thing',
        name: m.name,
        ...(m.sameAs && { sameAs: m.sameAs }),
      })),
    }),
    ...(author && {
      author: {
        '@type': 'Person',
        name: author,
        ...(authorUrl && { url: authorUrl }),
        ...(authorSameAs && authorSameAs.length > 0 && { sameAs: authorSameAs }),
      },
    }),
  }
  if (speakable) {
    schema['speakable'] = {
      '@type': 'SpeakableSpecification',
      cssSelector: speakableCssSelectors ?? ['h1', 'h2', '.speakable'],
    }
  }
  return <SchemaMarkup schema={schema} />
}

/**
 * FAQ schema helper
 */
export interface FAQItem {
  question: string
  answer: string
}

export function FAQSchema({ items }: { items: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
  return <SchemaMarkup schema={schema} />
}

/**
 * SpeakableSchema — standalone component to inject SpeakableSpecification
 * on any WebPage. AI assistants and voice interfaces use this to identify
 * the most citeable content regions on the page.
 */
export function SpeakableSchema({
  url,
  name,
  cssSelectors = ['h1', '.speakable', 'article p:first-of-type'],
}: {
  url: string
  name: string
  cssSelectors?: string[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url,
    name,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelectors,
    },
  }
  return <SchemaMarkup schema={schema} />
}

/**
 * EventSchema — MusicEvent / generic Event schema component.
 * Use on festival landing pages, concert detail pages, and any page
 * describing a scheduled real-world event to enable AI engine citations
 * and Google rich-results for events.
 */
export interface EventSchemaProps {
  type?: 'MusicEvent' | 'Event'
  name: string
  url: string
  startDate: string
  endDate?: string
  description?: string
  image?: string
  locationName: string
  locationAddress?: string
  locationCity?: string
  locationRegion?: string
  lat?: number
  lng?: number
  organizerName?: string
  offerPrice?: string
  offerCurrency?: string
  eventStatus?: string
  eventAttendanceMode?: string
}

export function EventSchema({
  type = 'MusicEvent',
  name,
  url,
  startDate,
  endDate,
  description,
  image,
  locationName,
  locationAddress,
  locationCity,
  locationRegion,
  lat,
  lng,
  organizerName,
  offerPrice,
  offerCurrency = 'EUR',
  eventStatus = 'https://schema.org/EventScheduled',
  eventAttendanceMode = 'https://schema.org/OfflineEventAttendanceMode',
}: EventSchemaProps) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    url,
    startDate,
    ...(endDate && { endDate }),
    ...(description && { description }),
    ...(image && { image }),
    eventStatus,
    eventAttendanceMode,
    inLanguage: 'es',
    location: {
      '@type': 'Place',
      name: locationName,
      ...(locationAddress || locationCity || locationRegion
        ? {
            address: {
              '@type': 'PostalAddress',
              ...(locationAddress && { streetAddress: locationAddress }),
              ...(locationCity && { addressLocality: locationCity }),
              ...(locationRegion && { addressRegion: locationRegion }),
              addressCountry: 'ES',
            },
          }
        : {}),
      ...(lat !== undefined && lng !== undefined
        ? { geo: { '@type': 'GeoCoordinates', latitude: lat, longitude: lng } }
        : {}),
    },
    ...(organizerName && {
      organizer: { '@type': 'Organization', name: organizerName },
    }),
    ...(offerPrice !== undefined && {
      offers: {
        '@type': 'Offer',
        url,
        price: offerPrice,
        priceCurrency: offerCurrency,
        availability: 'https://schema.org/InStock',
      },
    }),
  }
  return <SchemaMarkup schema={schema} />
}

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
        urlTemplate: `${url}/concerts?artist={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
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
 * Article schema helper
 */
export function ArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
}: {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    ...(author && {
      author: {
        '@type': 'Person',
        name: author,
      },
    }),
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

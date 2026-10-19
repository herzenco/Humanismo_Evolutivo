import type { MetadataRoute } from 'next'
import { books } from '@/data/books'
import { events } from '@/data/events'
import { podcastSeries } from '@/data/media'
import { resourceArticles } from '@/data/resources'
import { publishedQuestions, questionPath, questionsCanonicalOrigin } from '@/data/questions'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.SITE_URL || 'https://yosoynosotros.org').replace(/\/$/, '')

  // Static pages
  const staticPages = [
    '',
    '/autor',
    '/libros',
    '/medios',
    '/eventos',
    '/resources',
    '/contacto',
    '/vision',
    '/chatbot',
    '/privacidad',
    '/terminos',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Book detail pages
  const bookPages = books.map(book => ({
    url: `${baseUrl}/libros/${book.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Event detail pages
  const eventPages = events.map(event => ({
    url: `${baseUrl}/eventos/${event.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Podcast show pages
  const showPages = podcastSeries.map(series => ({
    url: `${baseUrl}/medios/show/${series.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Individual episode pages
  const episodePages = podcastSeries.flatMap(series =>
    series.episodes.map(ep => ({
      url: `${baseUrl}/medios/${series.id}/${ep.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  )

  // OCC-managed resource article pages
  const resourcePages = resourceArticles.map(article => ({
    url: `${baseUrl}/resources/${article.slug}/`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const published = publishedQuestions()
  const questionPages: MetadataRoute.Sitemap = published.length ? [
    { url: `${questionsCanonicalOrigin}/51preguntas`, changeFrequency: 'weekly', priority: 0.8 },
    ...published.map(question => ({
      url: `${questionsCanonicalOrigin}${questionPath(question.number)}`,
      ...(question.updatedAt || question.publishedAt ? { lastModified: new Date((question.updatedAt || question.publishedAt)!) } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ] : []

  return [...staticPages, ...bookPages, ...eventPages, ...showPages, ...episodePages, ...resourcePages, ...questionPages]
}

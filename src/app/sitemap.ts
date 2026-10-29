import type { MetadataRoute } from 'next'
import { books } from '@/data/books'
import { events } from '@/data/events'
import { podcastSeries } from '@/data/media'
import { resourceArticles } from '@/data/resources'
import { publishedQuestions, questionPath } from '@/data/questions'
import { hreflangLanguages } from '@/lib/release-flags'
import { absoluteUrl } from '@/lib/site'

function localized(path: string, extra: Omit<MetadataRoute.Sitemap[number], 'url'> = {}): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    alternates: { languages: hreflangLanguages(absoluteUrl(path), absoluteUrl(path, 'en')) },
    ...extra,
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/autor',
    '/libros',
    '/medios',
    '/eventos',
    '/contacto',
    '/vision',
    '/privacidad',
    '/terminos',
  ].map(route => localized(route || '/', {
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))

  const bookPages = books.map(book => localized(`/libros/${book.id}`, {
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const eventPages = events.map(event => localized(`/eventos/${event.id}`, {
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const showPages = podcastSeries.map(series => localized(`/medios/show/${series.id}`, {
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  const episodePages = podcastSeries.flatMap(series =>
    series.episodes.map(ep => localized(`/medios/${series.id}/${ep.slug}`, {
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    }))
  )

  const resourcePages = resourceArticles.map(article => ({
    url: absoluteUrl(`/resources/${article.slug}/`),
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const published = publishedQuestions()
  const questionPages: MetadataRoute.Sitemap = published.length ? [
    localized('/51preguntas', { changeFrequency: 'weekly', priority: 0.8 }),
    ...published.map(question => localized(questionPath(question.number), {
      ...(question.updatedAt || question.publishedAt ? { lastModified: new Date((question.updatedAt || question.publishedAt)!) } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ] : []

  return [...staticPages, ...bookPages, ...eventPages, ...showPages, ...episodePages, ...resourcePages, ...questionPages]
}

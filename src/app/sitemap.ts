import type { MetadataRoute } from 'next';
import { resourceArticles } from '@/data/resources';
import { publishedQuestions, questionPath } from '@/data/questions';
import { indexablePaths } from '@/lib/indexable-paths';
import { hreflangLanguages } from '@/lib/release-flags';
import { absoluteUrl } from '@/lib/site';

function localized(path: string, lastModified?: string): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    alternates: { languages: hreflangLanguages(absoluteUrl(path), absoluteUrl(path, 'en')) },
    ...(lastModified ? { lastModified } : {}),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const questions = publishedQuestions();
  return [
    ...indexablePaths().map(path => localized(path)),
    { url: absoluteUrl('/resources') },
    ...resourceArticles.map(article => ({
      url: absoluteUrl(`/resources/${article.slug}`),
      lastModified: article.updatedAt,
    })),
    ...(questions.length ? [localized('/51preguntas')] : []),
    ...questions.map(question => localized(questionPath(question), question.updatedAt || question.publishedAt)),
  ];
}

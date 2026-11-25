import 'server-only';
import { cache } from 'react';
import { unstable_rethrow } from 'next/navigation';
import { qaGateEnabled } from '@/lib/qa-gate';
import { z } from 'zod';
import { getSupabaseConfig, isSupabaseConfigured } from '@/lib/supabase/config';
import { articlePayload, newsletterDesign, newsletterPayload, bookPayload, coursePayload, podcastPayload, questionPayload, resourceRow, type ResourceKind } from './qa-resource-contract';
import { resourceArticles, type ResourceArticle } from '@/data/resources';

import { schoolCourses } from '@/data/school-calendar-2027';
import { schoolCoursePreviews } from '@/data/school-course-previews';
import { questions, type Question } from '@/data/questions';
import { questionTitlesEn } from '@/data/questionTitlesEn';

import { books } from '@/data/books';
import { podcastSeries } from '@/data/media';
import type { Language } from '@/lib/site';

const qaSupabaseUrl = 'https://nywgzeucqbfgvyjfmvgt.supabase.co';

export function qaResourceReaderConfig() {
  const token = process.env.QA_RESOURCE_READER_TOKEN?.trim();
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;

  const explicitKey = process.env.QA_RESOURCE_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (qaGateEnabled() && explicitKey?.startsWith('sb_publishable_')) {
    return { url: qaSupabaseUrl, publishableKey: explicitKey, token };
  }
  if (!isSupabaseConfigured) return null;
  const config = getSupabaseConfig();
  return config.url === qaSupabaseUrl ? { ...config, token } : null;
}

export function qaResourceReaderConfigured() {
  return qaResourceReaderConfig() !== null;
}

export const readQaResources = cache(async (kind: ResourceKind) => {
  const config = qaResourceReaderConfig();
  if (!config) return [];
  const { url, publishableKey, token } = config;
  try {
    const response = await fetch(url + '/rest/v1/rpc/qa_public_resource_entries', {
      method: 'POST',
      headers: { apikey: publishableKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_kind: kind, p_token: token }),
      signal: AbortSignal.timeout(5000),
      ...(kind === 'revista' || kind === 'boletin' ? { cache: 'no-store' } : { next: { revalidate: 30 } }),
    });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return z.array(resourceRow).parse(await response.json());
  } catch (error) {
    unstable_rethrow(error);
    console.error('QA resources unavailable', kind, error instanceof Error ? error.message : '');
    throw new Error('No fue posible cargar los recursos de QA');
  }
});

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export const getMagazineArticles = cache(async (kind: 'revista' | 'boletin' = 'revista') => {
  const changes = await readQaResources(kind);
  const baseline = kind === 'revista' ? resourceArticles : [];
  const articles = new Map<string, ResourceArticle & { design?: import('zod').infer<typeof newsletterPayload>['design'] }>(baseline.map(article => [article.slug, article]));
  for (const change of changes) {
    if (change.payload === null) {
      articles.delete(change.slug);
      continue;
    }
    const { data } = (kind === "boletin" ? newsletterPayload : articlePayload).safeParse(change.payload);
    if (!data) continue;
    articles.set(change.slug, {
      id: change.slug,
      property: 'humanismo-evolutivo',
      slug: change.slug,
      title: data.title,
      excerpt: data.excerpt,
      bodyHtml: data.body.split(/\r?\n\s*\r?\n/).map(paragraph => '<p>' + escapeHtml(paragraph) + '</p>').join(''),
      publishedAt: data.publishedAt,
      updatedAt: change.updated_at,
      seoTitle: data.title,
      seoDescription: data.excerpt,
      heroImageUrl: null,
      heroImageAlt: null,
      canonicalUrl: '/resources/' + change.slug,
      author: data.author,
      category: data.category,
      design: "design" in data ? newsletterDesign.safeParse(data.design).data : undefined,
    });
  }
  return [...articles.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
});

export const getSchoolCourses = cache(async () => {
  const changes = await readQaResources('clases');
  const entries = new Map(schoolCourses.map(course => [course.id, {
    ...course, preview: schoolCoursePreviews[course.id],
  }]));
  for (const change of changes) {
    if (change.payload === null) entries.delete(change.slug);
    else {
      const { data } = coursePayload.safeParse(change.payload);
      if (data) entries.set(change.slug, { id: change.slug, ...data });
    }
  }
  return [...entries.values()];
});

export const getQuestions = cache(async () => {
  const changes = await readQaResources('preguntas');
  const entries = new Map<number, Question & { titleEn?: string }>(
    questions.map(question => [question.number, { ...question, titleEn: questionTitlesEn[question.number] }]),
  );
  for (const change of changes) {
    const number = Number(change.slug);
    if (change.payload === null) entries.delete(number);
    else {
      const { data } = questionPayload.safeParse(change.payload);
      if (data && data.number === number) entries.set(number, data);
    }
  }
  return [...entries.values()];
});

export const getBooks = cache(async () => {
  const changes = await readQaResources('libros');
  const entries = new Map(books.map(book => [book.id, book]));
  for (const change of changes) {
    if (change.payload === null) entries.delete(change.slug);
    else {
      const { data } = bookPayload.safeParse(change.payload);
      if (data) entries.set(change.slug, { id: change.slug, ...data, managed: true });
    }
  }
  return [...entries.values()];
});

export const getPodcastSeries = cache(async (language: Language) => {
  const changes = await readQaResources('podcasts');
  const entries = new Map(podcastSeries.map(series => [series.id, series]));
  for (const change of changes) {
    if (change.payload === null) {
      entries.delete(change.slug);
      continue;
    }
    const { data } = podcastPayload.safeParse(change.payload);
    if (!data) continue;
    entries.set(change.slug, {
      id: change.slug,
      titleKey: (language === 'en' && data.titleEn) || data.title,
      descriptionKey: (language === 'en' && data.descriptionEn) || data.description,
      coverImage: data.coverImage,
      managed: true,
      episodes: data.episodes.map(episode => ({
        id: episode.id, slug: episode.slug, date: episode.date, duration: episode.duration,
        audioUrl: episode.audioUrl, categoryKey: episode.category, managed: true,
        titleKey: (language === 'en' && episode.titleEn) || episode.title,
        descriptionKey: (language === 'en' && episode.descriptionEn) || episode.description,
      })),
    });
  }
  return [...entries.values()];
});

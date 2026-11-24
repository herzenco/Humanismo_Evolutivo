// The QA marketing site uses the same published payload contract.
import { z } from "zod";

export const resourceKind = z.enum(["videos", "revista", "clases", "preguntas", "boletin", "libros", "podcasts"]);
export type ResourceKind = z.infer<typeof resourceKind>;
export const resourceSlug = z.string().regex(/^[a-z0-9][a-z0-9-]{0,99}$/);

const text = (max: number) => z.string().trim().min(1).max(max);

function mediaLocation(value: string) {
  if (/^\/(?!\/)[a-zA-Z0-9/_%.?=&-]+$/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

const media = text(2048).refine(mediaLocation);
export const videoPayload = z.object({
  title: text(200),
  titleEn: z.string().trim().max(200),
  description: text(2000),
  descriptionEn: z.string().trim().max(2000),
  category: z.enum(["introductions", "documentaries", "events"]),
  source: z.union([z.string().regex(/^youtube:[A-Za-z0-9_-]{11}$/), media]),
  poster: media,
  duration: z.string().trim().max(30),
}).strict();

export const articlePayload = z.object({
  title: text(200),
  excerpt: text(500),
  author: text(150),
  category: text(100),
  publishedAt: z.iso.date(),
  body: text(12000),
}).strict();

export const resourceRow = z.object({
  slug: resourceSlug,
  version: z.number().int().positive(),
  updated_at: z.iso.datetime({ offset: true }),
  payload: z.unknown().nullable(),
});

const clock = z.string().regex(/^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/);
const preview = z.object({
  summary: text(4000), title: text(200), lesson: text(6000), exercise: text(6000),
  venue: text(200).optional(),
  summaryPending: z.literal(true).optional(),
  objectives: z.object({
    general: text(4000),
    specific: z.array(z.object({ label: text(200).optional(), text: text(4000) })).max(25),
  }).optional(),
});
export const coursePayload = z.object({
  title: text(200), instructor: text(200).nullable(),
  days: z.array(z.number().int().min(1).max(6)).min(1).max(6)
    .refine(days => new Set(days).size === days.length),
  start: clock, end: clock,
  termSessions: z.tuple([z.number().int().min(0).max(365), z.number().int().min(0).max(365)]),
  preview: z.object({ es: preview, en: preview }),
}).strict().refine(course => course.start < course.end, { path: ["end"] });

const publicMedia = text(2048).refine(value => value.startsWith("https://") && mediaLocation(value));
export const questionPayload = z.object({
  number: z.number().int().min(1).max(51),
  title: z.string().trim().max(250), titleEn: text(250).optional(),
  description: z.string().trim().max(2500),
  status: z.enum(["draft", "published"]),
  sections: z.array(z.object({
    kind: z.enum(["narration", "dialogue"]).optional(),
    heading: text(200).optional(),
    paragraphs: z.array(text(12000)).max(70),
  })).max(20),
  videos: z.array(z.object({
    label: text(200), kind: z.enum(["narration", "dialogue"]),
    orientation: z.enum(["horizontal", "vertical"]),
    src: publicMedia, poster: publicMedia, durationSeconds: z.number().positive(),
    uploadedAt: z.string().optional(),
  })).max(12).optional(),
  sourceTitle: z.string().optional(),
  author: z.string().optional(),
  publishedAt: z.union([z.iso.date(), z.iso.datetime({ offset: true })]).optional(),
  updatedAt: z.union([z.iso.date(), z.iso.datetime({ offset: true })]).optional(),
}).strict().refine(question => question.status === "draft" || (question.title && question.description && question.sections.some(section => section.paragraphs.length)));

const paragraphs = z.array(text(16000)).max(150);
export const bookPayload = z.object({
  title: text(250), subtitle: z.string().max(500), author: text(200),
  image: media, coverImage: media,
  year: z.string().max(30), pages: z.string().max(30), excerpt: text(2500),
  description: paragraphs, keywords: z.array(text(150)).max(40),
  prologue: paragraphs, summary: paragraphs,
  pdfUrl: z.union([z.literal(""), media]),
  pdfUrlEn: z.union([z.literal(""), media]).optional(),
  downloadAvailable: z.boolean(),
}).strict().refine(book => !book.downloadAvailable || !!book.pdfUrl, { path: ["pdfUrl"] });

const podcastEpisode = z.object({
  id: z.number().int().positive(), slug: resourceSlug,
  title: text(250), titleEn: z.string().max(250).optional(),
  description: text(8000), descriptionEn: z.string().max(8000).optional(),
  duration: text(40), date: z.iso.date(), category: text(160),
  audioUrl: publicMedia,
}).strict();

export const podcastPayload = z.object({
  title: text(250), titleEn: z.string().max(250).optional(),
  description: text(8000), descriptionEn: z.string().max(8000).optional(),
  coverImage: media,
  episodes: z.array(podcastEpisode).max(200).refine(episodes =>
    new Set(episodes.map(episode => episode.slug)).size === episodes.length &&
    new Set(episodes.map(episode => episode.id)).size === episodes.length),
}).strict();

export const payloadSchemas = {
  videos: videoPayload, revista: articlePayload, boletin: articlePayload,
  clases: coursePayload, preguntas: questionPayload, libros: bookPayload, podcasts: podcastPayload,
} as const;

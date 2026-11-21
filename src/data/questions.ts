import importedQuestions from "../generated/questions.json" with { type: "json" };

export type QuestionVideo = {
  label: string;
  kind: "narration" | "dialogue";
  orientation: "horizontal" | "vertical";
  src: string;
  poster: string;
  durationSeconds: number;
  uploadedAt?: string;
};

export type QuestionSection = {
  kind?: "narration" | "dialogue";
  heading?: string;
  paragraphs: string[];
};

export type Question = {
  number: number;
  title: string;
  description: string;
  status: 'draft' | 'published';
  sections: QuestionSection[];
  videos?: QuestionVideo[];
  sourceTitle?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
};

// Generated from the user-supplied Markdown files; see scripts/import-questions.mjs.
export const questions: Question[] = importedQuestions as Question[];

export function questionSlug(question: Pick<Question, 'number' | 'title'>): string {
  const words = question.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().match(/[a-z0-9]+/g) ?? [];
  return ['pregunta', question.number, ...words].join('-');
}

export function questionPath(question: Pick<Question, 'number' | 'title'>): string {
  return `/51preguntas/${questionSlug(question)}`;
}

export function publishedQuestions(source: readonly Question[] = questions): Question[] {
  const numbers = new Set<number>();
  for (const question of source) {
    if (!Number.isInteger(question.number) || question.number < 1 || question.number > 51) {
      throw new Error('Question numbers must be integers from 1 to 51.');
    }
    if (numbers.has(question.number)) throw new Error(`Duplicate question ${question.number}.`);
    numbers.add(question.number);
    if (question.status !== 'published') continue;
    if (!question.title.trim() || !question.description.trim() ||
      !question.sections.some(section => section.paragraphs.some(paragraph => paragraph.trim()))) {
      throw new Error(`Published question ${question.number} needs a title, description and answer.`);
    }
    for (const video of question.videos || []) {
      if (!video.src.startsWith('https://') || !video.poster.startsWith('https://') || video.durationSeconds <= 0) {
        throw new Error(`Invalid video on question ${question.number}.`);
      }
    }
    for (const date of [question.publishedAt, question.updatedAt]) {
      if (date && Number.isNaN(Date.parse(date))) throw new Error(`Invalid date on question ${question.number}.`);
    }
  }
  return source.filter(question => question.status === 'published').sort((a, b) => a.number - b.number);
}

export function questionBySlug(slug: string, source: readonly Question[] = questions): Question | undefined {
  return publishedQuestions(source).find(question =>
    slug === questionSlug(question) || slug === `pregunta_${question.number}`);
}

export const questionsCanonicalOrigin = 'https://humanismoevolutivo.com';

export function questionKeywords(question: Question): string[] {
 const topics = [question.title.replace(/[¿?¡!]/g, ''), ...question.title.replace(/[¿?¡!]/g, '').split(/[:;,]/).map(topic => topic.trim())].filter(Boolean);
 return [...new Set([...topics, 'Humanismo Evolutivo', `Pregunta ${question.number}`, 'Marcos Constandse'])];
}

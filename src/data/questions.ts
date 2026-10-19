export type QuestionSection = {
  heading?: string;
  paragraphs: string[];
};

export type Question = {
  number: number;
  title: string;
  description: string;
  status: 'draft' | 'published';
  sections: QuestionSection[];
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
};

// Populate with the user's supplied questions and answers. No sample pages are published.
export const questions: Question[] = [];

export function questionPath(number: number): string {
  if (!Number.isInteger(number) || number < 1 || number > 51) {
    throw new Error('Question numbers must be integers from 1 to 51.');
  }
  return `/51preguntas/pregunta_${number}`;
}

export function publishedQuestions(source: readonly Question[] = questions): Question[] {
  const numbers = new Set<number>();
  for (const question of source) {
    questionPath(question.number);
    if (numbers.has(question.number)) throw new Error(`Duplicate question ${question.number}.`);
    numbers.add(question.number);
    if (question.status !== 'published') continue;
    if (!question.title.trim() || !question.description.trim() ||
      !question.sections.some(section => section.paragraphs.some(paragraph => paragraph.trim()))) {
      throw new Error(`Published question ${question.number} needs a title, description and answer.`);
    }
    for (const date of [question.publishedAt, question.updatedAt]) {
      if (date && Number.isNaN(Date.parse(date))) throw new Error(`Invalid date on question ${question.number}.`);
    }
  }
  return source.filter(question => question.status === 'published').sort((a, b) => a.number - b.number);
}

export function questionBySlug(slug: string, source: readonly Question[] = questions): Question | undefined {
  if (!/^pregunta_([1-9]|[1-4][0-9]|5[01])$/.test(slug)) return undefined;
  const number = Number(slug.slice('pregunta_'.length));
  return publishedQuestions(source).find(question => question.number === number);
}

export const questionsCanonicalOrigin = 'https://humanismoevolutivo.com';

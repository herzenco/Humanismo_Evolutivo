import { getMagazineArticles } from '@/lib/qa-resources';
import type { Language } from '@/lib/site';

export const copy = {
  es: {
    title: 'Boletín de Humanismo Evolutivo',
    description: 'Reflexiones, nuevos contenidos y eventos para seguir evolucionando juntos.',
    archive: 'Ediciones del boletín',
    monthly: 'Boletín mensual',
    subject: 'Un jardín para mirar de nuevo',
    intro: '¿Qué cambia cuando nos detenemos a observar un jardín? El Jardín de la Evolución invita a recorrer la historia de la vida y a preguntarnos qué lugar ocupamos en ella.',
    reflection: 'En tu próximo paseo, elige un detalle que normalmente pasarías por alto. Obsérvalo un momento y pregúntate qué te dice sobre el lugar que habitas.',
    read: 'Leer edición',
    back: 'Todas las ediciones',
    subscribe: 'Recibe el boletín cada mes',
    unavailable: 'Las suscripciones no están disponibles por el momento.',
  },
  en: {
    title: 'Evolutionary Humanism Newsletter',
    description: 'Reflections, new content and events to keep growing together.',
    archive: 'Newsletter issues',
    monthly: 'Monthly newsletter',
    subject: 'A garden worth a closer look',
    intro: 'What changes when we pause to observe a garden? The Garden of Evolution invites us to trace the history of life and ask where we fit in it.',
    reflection: 'On your next walk, choose a detail you would usually pass by. Spend a moment with it and ask what it tells you about the place you inhabit.',
    read: 'Read issue',
    back: 'All editions',
    subscribe: 'Get the newsletter each month',
    unavailable: 'Subscriptions are currently unavailable.',
  },
};


function monthDate(month: string) {
  return new Date(month + '-01T00:00:00Z');
}

export function monthLabel(month: string, lang: Language) {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', {
    month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(monthDate(month));
}

export function editionSlug(month: string, lang: Language) {
  const name = new Intl.DateTimeFormat(lang === 'es' ? 'es-MX' : 'en-US', {
    month: 'long', timeZone: 'UTC',
  }).format(monthDate(month)).toLowerCase();
  return name + '-' + month.slice(0, 4);
}

export async function editionsByMonth() {
  const articles = await getMagazineArticles('boletin');
  const editions = new Map<string, typeof articles>([['2026-11', []]]);
  for (const article of articles) {
    const month = article.publishedAt.slice(0, 7);
    const issues = editions.get(month) ?? [];
    issues.push(article);
    editions.set(month, issues);
  }
  return [...editions].sort(([a], [b]) => b.localeCompare(a));
}

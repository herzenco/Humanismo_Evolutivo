import { translations } from '@/data/translations';
import type { Language } from '@/lib/site';
export type ContentRecord = { key: string; content: string; language: string | null };
export const contentKeys = Object.keys(translations.es);
export function contentDictionary(language: Language, records: ContentRecord[] = []) {
  const dictionary: Record<string, string> = { ...translations.es, ...translations[language] };
  for (const record of records) {
    if (record.language === language && contentKeys.includes(record.key)) {
      dictionary[record.key] = record.content;
    }
  }
  return dictionary;
}

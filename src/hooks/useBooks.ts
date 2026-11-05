"use client";
import { useMemo } from 'react';
import { books } from '@/data/books';
import { useLanguage } from '@/contexts/LanguageContext';
import { localizeBook } from '@/lib/localized-books';
export function useBooks() {
  const { t } = useLanguage();
  return useMemo(() => books.map(book => localizeBook(book, t)), [t]);
}

'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { publicCopy } from '@/components/design/publicCopy';

export function useTx() {
  const { language } = useLanguage();
  return (es: string) => (language === 'en' ? publicCopy[es] ?? es : es);
}

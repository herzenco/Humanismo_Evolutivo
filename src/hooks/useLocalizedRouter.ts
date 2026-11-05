"use client";
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { localizedPath } from '@/lib/site';
export function useLocalizedRouter() {
  const router = useRouter();
  const { language } = useLanguage();
  return {
    ...router,
    push: (href: string) => router.push(localizedPath(href, language)),
    replace: (href: string) => router.replace(localizedPath(href, language)),
  };
}

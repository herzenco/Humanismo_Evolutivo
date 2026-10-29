"use client";
import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { localizedPath } from '@/lib/site';
export default function LocalizedLink({ href, ...props }: ComponentProps<typeof NextLink>) {
  const { language } = useLanguage();
  const localized = typeof href === 'string' ? localizedPath(href, language) : {
    ...href, pathname: href.pathname ? localizedPath(href.pathname, language) : href.pathname,
  };
  return <NextLink href={localized} {...props} />;
}

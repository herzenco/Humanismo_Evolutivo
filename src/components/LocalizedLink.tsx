"use client";
import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { localizedPath } from '@/lib/site';
const sharedRoute = /^\/(portal|resources|51preguntas|qa-access)(\/|$)/;
export default function LocalizedLink({ href, ...props }: ComponentProps<typeof NextLink>) {
  const { language } = useLanguage();
  const localize = (path: string) => sharedRoute.test(path.split(/[?#]/)[0]) ? path : localizedPath(path, language);
  const localized = typeof href === 'string' ? localize(href) : {
    ...href, pathname: href.pathname ? localize(href.pathname) : href.pathname,
  };
  return <NextLink href={localized} {...props} />;
}

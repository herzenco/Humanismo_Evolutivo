import { notFound } from 'next/navigation';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { getPublicSiteData } from '@/lib/public-content';
import { isLanguage, languages } from '@/lib/site';

export function generateStaticParams() {
  return languages.map(lang => ({ lang }));
}

export default async function LangLayout({ children, params }: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const { content } = await getPublicSiteData();
  return <LanguageProvider language={lang} content={content}>{children}</LanguageProvider>;
}

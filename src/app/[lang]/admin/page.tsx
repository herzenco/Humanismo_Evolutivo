export const dynamic = 'force-dynamic';
import { notFound, redirect } from 'next/navigation';
import View from './View';
import { pageMetadata } from '@/lib/seo';
import { isLanguage, localizedPath } from '@/lib/site';
import { getAdminClient } from '@/lib/require-admin';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({ title: lang === 'es' ? 'Administración' : 'Administration', description: lang === 'es' ? 'Panel de administración del sitio.' : 'Website administration dashboard.', path: '/admin', language: lang, index: false });
}
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  if (!await getAdminClient()) redirect(localizedPath('/auth', lang));
  return <View />;
}

import { notFound, permanentRedirect } from 'next/navigation';
import { isLanguage, localizedPath } from '@/lib/site';

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ tab?: string | string[] }> };

export default async function MediaPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const { tab } = await searchParams;
  permanentRedirect(localizedPath(tab === 'videos' ? '/videos' : '/podcasts', lang));
}

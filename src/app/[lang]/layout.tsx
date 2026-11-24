import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import { Providers } from '../providers';
import { SITE_URL, SITE_NAME, isLanguage, languages } from '@/lib/site';
import { getPublicSiteData } from '@/lib/public-content';
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} - Marcos Constandse Madrazo`, template: `%s | ${SITE_NAME}` },
  authors: [{ name: 'Marcos Constandse Madrazo' }],
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.png' },
};
export function generateStaticParams() { return languages.map(lang => ({ lang })); }
export default async function RootLayout({ children, params }: {
  children: React.ReactNode; params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const { content, images, series } = await getPublicSiteData();
  return <html lang={lang} className="scroll-smooth"><body className="min-h-screen antialiased">
    <Providers language={lang} content={content} images={images} series={series}>{children}</Providers>
  </body></html>;
}

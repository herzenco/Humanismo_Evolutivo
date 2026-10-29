import { qaGateEnabled } from '@/lib/qa-gate';
import type { Metadata } from 'next';
import './fonts.css';
import './globals.css';
import './editorial.css';
import './design.css';
import { Providers } from './providers';
import { getPublicSiteData } from '@/lib/public-content';
import { HtmlLang } from '@/components/HtmlLang';

export const metadata: Metadata = {
  metadataBase: new URL('https://humanismoevolutivo.com'),
  title: {
    default: 'Humanismo Evolutivo - Marcos Constandse Madrazo',
    template: '%s | Humanismo Evolutivo',
  },
  description:
    'Explora la obra filosófica de Marcos Constandse Madrazo. Un viaje de conciencia que conecta ciencia, espiritualidad y humanidad hacia una visión transpersonal del mundo.',
  keywords: [
    'Marcos Constandse',
    'Humanismo Evolutivo',
    'filosofía transpersonal',
    'conciencia',
    'espiritualidad',
    'ecología',
    'México',
    'Yo soy nosotros',
  ],
  authors: [{ name: 'Marcos Constandse Madrazo' }],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: 'Humanismo Evolutivo',
    title: 'Humanismo Evolutivo - Marcos Constandse Madrazo',
    description:
      'Un viaje de conciencia para entender quiénes somos, de dónde venimos y hacia dónde vamos',
    url: 'https://humanismoevolutivo.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Humanismo Evolutivo - Marcos Constandse Madrazo',
    description:
      'Un viaje de conciencia para entender quiénes somos, de dónde venimos y hacia dónde vamos',
  },
  robots: {
    index: !qaGateEnabled(),
    follow: !qaGateEnabled(),
  },
  icons: {
    icon: '/favicon-small.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { content, images, series } = await getPublicSiteData();
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen antialiased">
        <Providers language="es" content={content} images={images} series={series}>
          <HtmlLang />
          {children}
        </Providers>
      </body>
    </html>
  );
}

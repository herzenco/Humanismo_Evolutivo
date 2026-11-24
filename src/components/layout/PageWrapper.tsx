import { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import SkipLink from './SkipLink';

export default function PageWrapper({ children, showFooterNewsletter = true }: { children: ReactNode; showFooterNewsletter?: boolean }) {
  return <div className="min-h-screen flex flex-col"><SkipLink /><Header /><main id="contenido-principal" tabIndex={-1} className="site-main flex-grow">{children}</main><Footer showNewsletter={showFooterNewsletter} /></div>;
}

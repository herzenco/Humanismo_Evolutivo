import { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function PageWrapper({ children }: { children: ReactNode }) {
  return <div className="min-h-screen flex flex-col"><a href="#contenido-principal" className="skip-to-content">Saltar al contenido</a><Header /><main id="contenido-principal" tabIndex={-1} className="site-main flex-grow">{children}</main><Footer /></div>;
}

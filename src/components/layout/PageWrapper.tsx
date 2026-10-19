import { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function PageWrapper({ children }: { children: ReactNode }) {
  return <div className="min-h-screen flex flex-col"><Header /><main className="site-main flex-grow">{children}</main><Footer /></div>;
}

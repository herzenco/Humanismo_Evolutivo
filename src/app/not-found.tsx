import Link from 'next/link';
import { ArrowRight, Leaf, Search } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';

export default function NotFound() {
  return <PageWrapper><section className="design-not-found"><div className="design-content-width"><Leaf size={56} strokeWidth={1} /><span className="design-eyebrow">UN NUEVO CAMINO</span><p className="design-404">404</p><h1>Este camino aún no existe</h1><p>La página que buscas no está disponible. Siempre hay otra forma de continuar explorando.</p><div className="design-actions"><Link href="/" className="design-button">Volver al inicio<ArrowRight size={18} /></Link><Link href="/buscar" className="design-button design-button-outline"><Search size={18} />Buscar contenido</Link></div></div></section></PageWrapper>;
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Leaf, Menu, Search, Shield, X } from 'lucide-react';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAdmin } from '@/hooks/useAdmin';

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const { isAdmin } = useAdmin();
  const toggle = useRef<HTMLButtonElement>(null);
  const links = [
    [t('nav.author'), '/autor'], [t('nav.books'), '/libros'],
    [language === 'es' ? 'Medios' : 'Media', '/medios'], [t('nav.events'), '/eventos'],
    [t('nav.vision'), '/vision'], [language === 'es' ? 'Contacto' : 'Contact', '/contacto'],
  ];
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return <header className="site-header">
    <div className="site-header-inner">
      <Link href="/" className="site-brand" onClick={() => setOpen(false)} aria-label="Humanismo Evolutivo · Inicio">
        <Leaf aria-hidden="true" />
        <span><span className="site-brand-name">Humanismo Evolutivo</span><span className="site-brand-caption">Transpersonal</span></span>
      </Link>
      <nav aria-label={language === 'es' ? 'Principal' : 'Main navigation'} className="site-desktop-nav">
        {links.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>{label}</Link>)}
      </nav>
      <div className="site-header-actions">
        <Link className="site-icon-button" href="/buscar" aria-label={language === 'es' ? 'Buscar' : 'Search'}><Search size={19} /></Link>
        <LanguageToggle />
        <Link href="/portal" aria-label="Portal educativo" className="site-portal-button"><GraduationCap size={19} /><span>{language === 'es' ? 'Portal educativo' : 'Education portal'}</span></Link>
        {isAdmin ? <Link className="site-icon-button" href="/admin" aria-label="Administración"><Shield size={18} /></Link> : null}
        <button ref={toggle} className="site-icon-button site-menu-toggle" type="button" aria-expanded={open} aria-controls="site-mobile-nav" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen(value => !value)}>{open ? <X /> : <Menu />}</button>
      </div>
    </div>
    {open ? <nav id="site-mobile-nav" className="site-mobile-nav" aria-label="Menú principal">
      {links.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
      <Link href="/resources" onClick={() => setOpen(false)}>{language === 'es' ? 'Recursos' : 'Resources'}</Link>
      <Link href="/portal" onClick={() => setOpen(false)}><GraduationCap size={19} />{language === 'es' ? 'Portal educativo' : 'Education portal'}</Link>
    </nav> : null}
  </header>;
}

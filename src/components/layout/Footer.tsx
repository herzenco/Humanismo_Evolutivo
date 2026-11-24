'use client';

import { EDUCATION_WAITLIST_URL } from '@/lib/site';

import NewsletterForm from './NewsletterForm';
import Link from '@/components/LocalizedLink';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer({ showNewsletter = true }: { showNewsletter?: boolean }) {
  const { language, newsletterEnabled, newsletterArchiveEnabled } = useLanguage();
  const es = language === 'es';
  return <footer className="site-footer">
    <div className="site-footer-inner">
      {showNewsletter ? <section id="boletin" className="site-newsletter" aria-labelledby="newsletter-title">
        <div><span className="design-eyebrow">Humanismo Evolutivo</span><h2 id="newsletter-title">{es ? 'Recibe nuestras novedades' : 'Stay connected'}</h2><p>{es ? 'Reflexiones, nuevos contenidos y eventos para seguir evolucionando juntos.' : 'Reflections, new content and events to keep growing together.'}</p></div>
        {newsletterEnabled ? <NewsletterForm es={es} /> : null}
        {newsletterArchiveEnabled ? <Link href="/boletin">{es ? 'Leer ediciones del boletín' : 'Read newsletter issues'}</Link> : null}
      </section> : null}
      <div className="site-footer-grid">
        <div><Link href="/" className="site-brand"><img src="/brand/humanismo-evolutivo-transparent.webp" alt="Humanismo Evolutivo Transpersonal" width="375" height="640" className="site-brand-logo" /></Link><p className="footer-description">{es ? 'Una visión transpersonal del mundo que conecta ciencia, espíritu y humanidad.' : 'A transpersonal vision connecting science, spirit and humanity.'}</p><p className="footer-author">Marcos Constandse Madrazo</p></div>
        <nav aria-label="Explorar"><h3>{es ? 'Explora' : 'Explore'}</h3>{[['/',es ? 'Inicio' : 'Home'],['/autor',es ? 'Sobre el autor' : 'About the author'],['/vision',es ? 'Visión' : 'Vision'],['/podcasts','Podcasts'],['/videos','Videos'],['/eventos',es ? 'Eventos' : 'Events'],['/resources',es ? 'Recursos' : 'Resources']].map(([href,label]) => <Link key={href} href={href}>{label}</Link>)}</nav>
        <nav aria-label="Obras"><h3>{es ? 'Biblioteca filosófica' : 'Philosophical library'}</h3>{[['yo-soy-nosotros','Yo soy nosotros'],['ecologia-y-espiritualidad','Ecología y espiritualidad'],['dejalo-ser','¡Déjalo ser!'],['lo-mejor-esta-por-venir','¡Y lo mejor aún está por venir!'],['el-arte-de-ser-empresario','El arte de ser empresario']].map(([id,label]) => <Link href={`/libros/${id}`} key={id}>{label}</Link>)}</nav>
        <nav aria-label="Comunidad"><h3>{es ? 'Sigamos en contacto' : 'Stay in touch'}</h3><Link href="/contacto">{es ? 'Escríbenos' : 'Contact us'} <ArrowUpRight size={16} /></Link>{<Link href={EDUCATION_WAITLIST_URL}>{es ? 'Portal educativo' : 'Education portal'}</Link>}{<Link href={EDUCATION_WAITLIST_URL}>{es ? 'Únete a la comunidad' : 'Join the community'}</Link>}</nav>
      </div>
      <div className="site-footer-bottom"><p>© {new Date().getFullYear()} Humanismo Evolutivo. {es ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p><div><Link href="/privacidad">{es ? 'Privacidad' : 'Privacy'}</Link><Link href="/terminos">{es ? 'Términos y condiciones' : 'Terms and conditions'}</Link></div></div>
    </div>
  </footer>;
}

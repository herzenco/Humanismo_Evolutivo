'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, ChevronLeft, ChevronRight, GraduationCap, Leaf, Library, LogOut, Menu, X } from 'lucide-react';
import { events } from '@/data/events';
import { useLanguage } from '@/contexts/LanguageContext';

type View = 'courses' | 'library' | 'calendar';
export default function PortalDashboard({ firstName, email }: { firstName: string; email?: string }) {
  const [view, setView] = useState<View>('courses');
  const [menu, setMenu] = useState(false);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const { t } = useLanguage();
  const title = view === 'courses' ? 'Mis cursos' : view === 'library' ? 'Biblioteca' : 'Calendario';
  const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const offset = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const today = new Date();
  const monthEvents = events.filter(event => { const date = new Date(`${event.date}T12:00:00`); return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear(); });
  const navigate = (next: View) => { setView(next); setMenu(false); };
  return <div className="portal-app">
    <aside className={`portal-sidebar ${menu ? 'portal-sidebar-open' : ''}`}>
      <Link href="/" className="site-brand"><Leaf /><span><span className="site-brand-name">Humanismo Evolutivo</span><span className="site-brand-caption">Transpersonal</span></span></Link>
      <span className="portal-sidebar-label">PORTAL EDUCATIVO</span>
      <nav aria-label="Portal educativo">{([{ id: 'courses', label: 'Mis cursos', icon: GraduationCap }, { id: 'library', label: 'Biblioteca', icon: Library }, { id: 'calendar', label: 'Calendario', icon: CalendarDays }] as const).map(item => <button key={item.id} type="button" aria-current={view === item.id ? 'page' : undefined} onClick={() => navigate(item.id)}><item.icon size={20} />{item.label}</button>)}</nav>
      <div className="portal-sidebar-bottom"><Link href="/"><ArrowLeft size={18} />Volver al sitio</Link><form action="/auth/signout" method="post"><button type="submit"><LogOut size={18} />Cerrar sesión</button></form><p>Aprender es una forma de evolucionar.</p></div>
    </aside>
    <div className="portal-workspace"><header className="portal-topbar"><div><button type="button" className="portal-mobile-toggle" aria-expanded={menu} aria-label={menu ? 'Cerrar menú del portal' : 'Abrir menú del portal'} onClick={() => setMenu(value => !value)}>{menu ? <X /> : <Menu />}</button><span>Portal educativo <span aria-hidden="true">/</span> <strong>{title}</strong></span></div><div><span className="portal-avatar" aria-hidden="true">{firstName.charAt(0).toUpperCase()}</span><span className="portal-user">{firstName}<small>{email}</small></span></div></header>
      <main className="portal-main" id="contenido-principal"><div className="portal-welcome"><span className="design-eyebrow">TU ESPACIO PARA EVOLUCIONAR</span><h1>{view === 'courses' ? `Bienvenido, ${firstName}` : title}</h1><p>{view === 'courses' ? 'Cada nueva perspectiva es un paso hacia una vida más consciente. Continúa tu camino de aprendizaje.' : view === 'library' ? 'Explora las lecturas, reflexiones y conversaciones de Humanismo Evolutivo.' : 'Un espacio para consultar nuestros encuentros y presentaciones.'}</p></div>
        {view === 'courses' ? <><div className="portal-stats"><div><GraduationCap /><strong>0</strong><span>Cursos disponibles</span></div><div><BookOpen /><strong>0</strong><span>Cursos en progreso</span></div><div><CalendarDays /><strong>{monthEvents.length}</strong><span>Encuentros este mes</span></div></div><section aria-labelledby="courses-title"><div className="portal-section-heading"><h2 id="courses-title">Tu camino de aprendizaje</h2><span>Mis cursos</span></div><div className="portal-empty"><GraduationCap size={48} strokeWidth={1.2} /><h3>Estamos preparando tus próximos pasos</h3><p>Los cursos aparecerán aquí cuando se publiquen. Mientras tanto, descubre los libros y las conversaciones que dan vida a nuestra filosofía.</p><button type="button" className="design-button" onClick={() => navigate('library')}>Explorar la biblioteca<ArrowRight size={18} /></button></div></section></> : null}
        {view === 'library' ? <div className="portal-library-grid">{[{ title: 'Libros', description: 'Cinco obras para conectar ciencia, filosofía y espiritualidad.', href: '/libros', icon: BookOpen }, { title: 'Podcast y videos', description: 'Conversaciones e ideas para acompañar tu búsqueda.', href: '/medios', icon: GraduationCap }, { title: 'Artículos y recursos', description: 'Lecturas y materiales publicados para profundizar.', href: '/resources', icon: Library }].map(item => <article key={item.href}><item.icon size={32} strokeWidth={1.4} /><h2>{item.title}</h2><p>{item.description}</p><Link href={item.href} className="design-text-link">Explorar<ArrowRight size={18} /></Link></article>)}</div> : null}
        {view === 'calendar' ? <section className="portal-calendar" aria-label="Calendario de eventos"><div className="portal-calendar-heading"><h2 aria-live="polite">{month.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}</h2><div><button type="button" aria-label="Mes anterior" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft /></button><button type="button" onClick={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))}>Hoy</button><button type="button" aria-label="Mes siguiente" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight /></button></div></div><div className="portal-calendar-grid">{weekdays.map(day => <div className="portal-weekday" key={day}>{day}</div>)}{Array.from({ length: offset }, (_, i) => <div className="portal-day portal-day-empty" key={`empty-${i}`} />)}{Array.from({ length: days }, (_, i) => {
          const day = i + 1;
          const isToday = today.getDate() === day && today.getMonth() === month.getMonth() && today.getFullYear() === month.getFullYear();
          return <div className={`portal-day ${isToday ? 'portal-day-today' : ''}`} key={day}><span>{day}</span>{monthEvents.filter(event => Number(event.date.slice(-2)) === day).map(event => <Link href={`/eventos/${event.id}`} key={event.id}>{t(event.titleKey)}</Link>)}</div>;
        })}</div>{monthEvents.length === 0 ? <p className="portal-calendar-empty">No hay encuentros publicados para este mes.</p> : null}</section> : null}
      </main><footer className="portal-bottom">Humanismo Evolutivo · Portal educativo<span>Un camino de conciencia compartida</span></footer>
    </div>
  </div>;
}

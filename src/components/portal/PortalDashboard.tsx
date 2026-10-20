'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import PortalCalendar from './PortalCalendar';
import { portalCourses, portalClasses } from '@/data/portal';
import type { EducationContext } from '@/lib/education/contracts';
import PortalSchools from './PortalSchools';
import type { ResourceArticle } from '@/data/resources';
import { ArrowLeft, ArrowRight, CalendarDays, GraduationCap, Leaf, Library, LogOut, Menu, X } from 'lucide-react';

const PortalLibrary = dynamic(() => import('./PortalLibrary'), { loading: () => <p role="status">Cargando biblioteca…</p> });

type View = 'courses' | 'library' | 'calendar' | 'school';
export default function PortalDashboard({ firstName, email, articles, educationContext }: { firstName: string; email?: string; articles: ResourceArticle[]; educationContext?: EducationContext | null }) {
  const params = useSearchParams();
  const router = useRouter();
  const selectedView = params.get('view');
  const view: View = selectedView === 'library' || selectedView === 'calendar' || (selectedView === 'school' && educationContext) ? selectedView : 'courses';
  const [menu, setMenu] = useState(false);
  const title = view === 'courses' ? 'Mis cursos' : view === 'library' ? 'Biblioteca' : view === 'school' ? 'Mis escuelas' : 'Calendario';
  const course = portalCourses.find(item => item.id === params.get('course'));
  const lesson = course?.lessons.find(item => item.id === params.get('lesson'));
  const navigate = (next: View) => { router.push(`/portal?view=${next}`); setMenu(false); };
  return <div className="portal-app">
    <aside className={`portal-sidebar ${menu ? 'portal-sidebar-open' : ''}`}>
      <Link href="/" className="site-brand"><Leaf /><span><span className="site-brand-name">Humanismo Evolutivo</span><span className="site-brand-caption">Transpersonal</span></span></Link>
      <span className="portal-sidebar-label">PORTAL EDUCATIVO</span>
      <nav aria-label="Portal educativo">{([{ id: 'courses', label: 'Mis cursos', icon: GraduationCap }, { id: 'library', label: 'Biblioteca', icon: Library }, { id: 'calendar', label: 'Calendario', icon: CalendarDays }] as const).map(item => <button key={item.id} type="button" aria-current={view === item.id ? 'page' : undefined} onClick={() => navigate(item.id)}><item.icon size={20} />{item.label}</button>)}{educationContext ? <button type="button" aria-current={view === 'school' ? 'page' : undefined} onClick={() => navigate('school')}><GraduationCap size={20} />Mis escuelas</button> : null}</nav>
      <div className="portal-sidebar-bottom"><Link href="/"><ArrowLeft size={18} />Volver al sitio</Link><form action="/auth/signout" method="post"><button type="submit"><LogOut size={18} />Cerrar sesión</button></form><p>Aprender es una forma de evolucionar.</p></div>
    </aside>
    <div className="portal-workspace"><header className="portal-topbar"><div><button type="button" className="portal-mobile-toggle" aria-expanded={menu} aria-label={menu ? 'Cerrar menú del portal' : 'Abrir menú del portal'} onClick={() => setMenu(value => !value)}>{menu ? <X /> : <Menu />}</button><span>Portal educativo <span aria-hidden="true">/</span> <strong>{title}</strong></span></div><div><span className="portal-avatar" aria-hidden="true">{firstName.charAt(0).toUpperCase()}</span><span className="portal-user">{firstName}<small>{email}</small></span></div></header>
      <main className="portal-main" id="contenido-principal"><div className="portal-welcome"><span className="design-eyebrow">TU ESPACIO PARA EVOLUCIONAR</span><h1>{title}</h1><p>{view === 'courses' ? 'Explora todos los cursos disponibles y elige tu próximo paso de aprendizaje.' : view === 'library' ? 'Explora las lecturas, reflexiones y conversaciones de Humanismo Evolutivo.' : view === 'school' ? 'Tu comunidad, tus escuelas y el aprendizaje compartido.' : 'Consulta todas las clases programadas en vista de calendario o lista.'}</p></div>
        {view === 'courses' ? <section aria-labelledby="courses-title">
          <div className="portal-section-heading"><h2 id="courses-title">{course ? course.title : 'Todos los cursos'}</h2><span>{portalCourses.length} cursos disponibles</span></div>
          {course ? <div className="portal-reader"><Link href="/portal?view=courses" className="design-text-link"><ArrowLeft size={17} />Todos los cursos</Link><p>{course.description}</p>{lesson ? <article><h3>{lesson.title}</h3><p>{lesson.text}</p>{lesson.videoUrl ? <video controls preload="none" src={lesson.videoUrl} aria-label={lesson.title} /> : null}<Link href={`/portal?view=courses&course=${encodeURIComponent(course.id)}`} className="design-text-link">Volver a las clases</Link></article> : <ol className="portal-lesson-list">{course.lessons.map((item, index) => <li key={item.id}><Link href={`/portal?view=courses&course=${encodeURIComponent(course.id)}&lesson=${encodeURIComponent(item.id)}`}><span>{index + 1}</span>{item.title}<ArrowRight size={18} /></Link></li>)}</ol>}</div>
            : params.get('course') ? <div className="portal-empty"><h3>Curso no disponible</h3><Link href="/portal?view=courses">Ver cursos disponibles</Link></div>
            : portalCourses.length ? <div className="portal-content-grid">{portalCourses.map(item => <article className="portal-content-card" key={item.id}><div><GraduationCap size={32} /><h3>{item.title}</h3><p>{item.description}</p><span>{item.lessons.length} clases</span><Link href={`/portal?view=courses&course=${encodeURIComponent(item.id)}`} className="design-text-link">Explorar curso<ArrowRight size={18} /></Link></div></article>)}</div>
            : <div className="portal-empty"><GraduationCap size={48} strokeWidth={1.2} /><h3>Próximamente, nuevos cursos</h3><p>Aquí encontrarás todas las clases disponibles cuando se publique el catálogo. Mientras tanto, puedes explorar las lecturas y conversaciones de nuestra biblioteca.</p><button type="button" className="design-button" onClick={() => navigate('library')}>Explorar la biblioteca<ArrowRight size={18} /></button></div>}
        </section> : null}
        {view === 'library' ? <PortalLibrary key={params.get('category') || 'all'} articles={articles} /> : null}
        {view === 'school' && educationContext ? <PortalSchools key={JSON.stringify(educationContext)} context={educationContext} /> : null}
        {view === 'calendar' ? <PortalCalendar sessions={portalClasses} /> : null}
      </main><footer className="portal-bottom">Humanismo Evolutivo · Portal educativo<span>Un camino de conciencia compartida</span></footer>
    </div>
  </div>;
}

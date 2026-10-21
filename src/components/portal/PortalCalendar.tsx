'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { portalRoleSuffix } from '@/lib/portal-role';
import { portalCourses, type PortalClass } from '@/data/portal';
import { filterSchedule, groupSchedule, scheduleDate, scheduleTime } from '@/lib/portal-schedule';
import { courseHref } from './CourseCatalog';

export default function PortalCalendar({ sessions }: { sessions: PortalClass[] }) {
  const params = useSearchParams();
  const roleSuffix = portalRoleSuffix(params.get('role'));
  const [query, setQuery] = useState('');
  const [courseId, setCourseId] = useState('');
  const selectedClass = sessions.find(session => session.id === params.get('class'));
  const courses = groupSchedule(filterSchedule(sessions));
  const filtered = filterSchedule(sessions, query, courseId);
  const groups = groupSchedule(filtered);
  const classLink = (id: string) => `/portal?view=calendar&class=${encodeURIComponent(id)}${roleSuffix}`;

  if (selectedClass) {
    const catalogId = selectedClass.courseId === 'filosofia-de-yo-soy-nosotros' ? 'yo-soy-nosotros' : selectedClass.courseId;
    const course = portalCourses.find(item => item.id === catalogId);
    return <article className="portal-reader portal-scheduled-class">
      <Link href={`/portal?view=calendar${roleSuffix}`} className="design-text-link"><ArrowLeft size={18} />Volver a la lista</Link>
      <span className="design-eyebrow">PROGRAMA ESCOLAR 2027 · CLASE PRESENCIAL</span>
      <h2>{selectedClass.title}</h2>
      <dl className="portal-class-facts">
        <div><dt>Fecha</dt><dd><time dateTime={selectedClass.startsAt}>{scheduleDate(selectedClass)}</time></dd></div>
        <div><dt>Horario</dt><dd>{scheduleTime(selectedClass)}–{scheduleTime(selectedClass, true)}</dd></div>
        <div><dt>Modalidad y ubicación</dt><dd>{selectedClass.location || 'Ubicación por confirmar'}</dd></div>
        <div><dt>Zona horaria</dt><dd>{selectedClass.timeZone || 'Por confirmar'}</dd></div>
      </dl>
      <section className="portal-class-material"><h3>Material del curso</h3>{course ? <Link className="design-text-link" href={courseHref(course.id)}>Ver programa y mi progreso<ArrowRight size={18} /></Link> : <p>El material de este curso estará disponible cuando se publique.</p>}</section>
    </article>;
  }

  return <section className="portal-schedule-list" aria-label="Lista de clases programadas">
    <div className="portal-schedule-filters">
      <label className="portal-search"><Search size={20} aria-hidden="true" /><span className="sr-only">Buscar clases</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar curso, fecha o ubicación" /></label>
      <label className="portal-schedule-select">Filtrar por curso<select value={courseId} onChange={event => setCourseId(event.target.value)}><option value="">Todos los cursos</option>{courses.map(course => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>
      {query || courseId ? <button className="design-text-link" type="button" onClick={() => { setQuery(''); setCourseId(''); }}>Limpiar filtros</button> : null}
    </div>
    <div className="portal-section-heading"><h2>Próximas clases</h2><span role="status">{groups.length} {groups.length === 1 ? 'curso' : 'cursos'} · {filtered.length} {filtered.length === 1 ? 'sesión' : 'sesiones'}</span></div>
    <p className="portal-schedule-coverage">Fechas incluidas en el programa recibido: 15–20 de febrero de 2027. Sede y zona horaria pendientes de confirmar.</p>
    {groups.length ? <div className="portal-schedule-groups">{groups.map(group => <section className="portal-schedule-group" key={group.id} aria-labelledby={`schedule-${group.id}`}>
      <div className="portal-schedule-group-heading"><h3 id={`schedule-${group.id}`}>{group.title}</h3><span>{group.sessions.length} {group.sessions.length === 1 ? 'sesión' : 'sesiones'}</span></div>
      <ul>{group.sessions.map(session => <li key={session.id}><div><time dateTime={session.startsAt}>{scheduleDate(session)}</time><span>{scheduleTime(session)}–{scheduleTime(session, true)} · {session.timeZone || 'Zona horaria por confirmar'}</span></div><Link href={classLink(session.id)} className="design-text-link" aria-label={`Ver sesión de ${session.title}, ${scheduleDate(session)}`}>Ver sesión<ArrowRight size={17} /></Link></li>)}</ul>
    </section>)}</div> : <div className="portal-empty"><h3>No encontramos clases</h3><p>Prueba otro nombre o selecciona todos los cursos.</p><button className="design-button" type="button" onClick={() => { setQuery(''); setCourseId(''); }}>Ver todas las clases</button></div>}
  </section>;
}

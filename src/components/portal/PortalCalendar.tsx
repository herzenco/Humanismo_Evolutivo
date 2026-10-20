'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CalendarDays, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { classDateKey, classesForMonth, type PortalClass } from '@/data/portal';

export default function PortalCalendar({ sessions }: { sessions: PortalClass[] }) {
  const params = useSearchParams();
  const selectedClass = sessions.find(session => session.id === params.get('class'));
  const [month, setMonth] = useState(() => {
    const first = [...sessions].sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];
    const date = first ? classDateKey(first).split('-').map(Number) : null;
    return date ? new Date(date[0], date[1] - 1, 1) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });
  const [mode, setMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<string>();
  const today = new Date();
  const classes = classesForMonth(sessions, month.getFullYear(), month.getMonth());
  const activeDate = selectedDate && classes.some(session => classDateKey(session) === selectedDate) ? selectedDate : classes[0] ? classDateKey(classes[0]) : undefined;
  const offset = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const time = (session: PortalClass) => new Intl.DateTimeFormat('es-MX', { timeZone: session.timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(session.startsAt));
  if (selectedClass) return <section className="portal-reader"><Link href="/portal?view=calendar" className="design-text-link"><ChevronLeft size={18} />Volver al calendario</Link><span className="design-eyebrow">CLASE PROGRAMADA</span><h2>{selectedClass.title}</h2><p>{classDateKey(selectedClass)} · {time(selectedClass)}–{new Intl.DateTimeFormat('es-MX', { timeZone: selectedClass.timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(selectedClass.endsAt))}</p><p>{selectedClass.location}</p><p>El material de esta clase estará disponible cuando se publique el curso.</p><p>{selectedClass.timeZone || 'Horario de la fuente original; zona horaria por confirmar.'}</p></section>;
  return <section className="portal-calendar" aria-label="Calendario de clases">
    <div className="portal-schedule-note"><strong>Programa escolar 2027</strong><p>Primer periodo: 15 febrero–15 junio · Segundo periodo: 15 agosto–15 diciembre.</p><p>Se muestran las fechas explícitas del programa recibido (15–20 de febrero). El resto del calendario está pendiente de confirmar, al igual que la sede y la zona horaria.</p></div>
    <div className="portal-calendar-heading"><h2 aria-live="polite">{month.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}</h2><div className="portal-calendar-controls"><div className="portal-view-switch" role="group" aria-label="Vista de clases"><button type="button" aria-pressed={mode === 'calendar'} onClick={() => setMode('calendar')}><CalendarDays size={16} />Calendario</button><button type="button" aria-pressed={mode === 'list'} onClick={() => setMode('list')}><List size={16} />Lista</button></div><div className="portal-month-controls"><button type="button" aria-label="Mes anterior" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft /></button><button type="button" onClick={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))}>Hoy</button><button type="button" aria-label="Mes siguiente" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight /></button></div></div></div>
    {mode === 'calendar' ? <div className="portal-calendar-grid">{['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => <div className="portal-weekday" key={day}>{day}</div>)}{Array.from({ length: offset }, (_, i) => <div className="portal-day portal-day-empty" key={`empty-${i}`} />)}{Array.from({ length: days }, (_, i) => {
      const day = i + 1;
      const date = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = day === today.getDate() && month.getMonth() === today.getMonth() && month.getFullYear() === today.getFullYear();
      const dayClasses = classes.filter(session => classDateKey(session) === date);
      return <div className={`portal-day ${isToday ? 'portal-day-today' : ''}`} key={day}><span aria-current={isToday ? 'date' : undefined}>{day}</span>{dayClasses.length ? <button className="portal-day-count" type="button" aria-pressed={activeDate === date} aria-label={`Ver ${dayClasses.length} clases del ${day} de ${month.toLocaleDateString('es-MX', { month: 'long' })}`} onClick={() => setSelectedDate(date)}>{dayClasses.length} clases</button> : null}</div>;
    })}</div> : null}
    {mode === 'calendar' && activeDate ? <h3 className="portal-day-detail-heading">Clases del {new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' }).format(new Date(`${activeDate}T12:00:00`))}</h3> : null}
    <ul className="portal-class-list">{classes.filter(session => mode === 'list' || classDateKey(session) === activeDate).map(session => <li key={session.id}><div><time dateTime={session.startsAt}>{new Intl.DateTimeFormat('es-MX', { timeZone: session.timeZone, day: 'numeric', month: 'long' }).format(new Date(session.startsAt))}</time><span>{time(session)}–{new Intl.DateTimeFormat('es-MX', { timeZone: session.timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(session.endsAt))} · {session.timeZone || 'Zona horaria por confirmar'}</span></div><div><h3><Link href={`/portal?view=calendar&class=${encodeURIComponent(session.id)}`}>{session.title}</Link></h3>{session.location ? <p>{session.location}</p> : null}</div></li>)}</ul>
    {!classes.length ? <p className="portal-calendar-empty" role="status">No hay clases programadas para este mes. Las fechas aparecerán aquí cuando se publique el calendario de cursos.</p> : <p className="portal-calendar-empty">Los horarios corresponden a la fuente original. Consulta la zona horaria en la vista de lista.</p>}
  </section>;
}

import type { PortalClass } from '../data/portal';

export function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
}

// Floating dates in the source are wall-clock times, not times in the viewer's timezone.
function sessionDate(value: string, timeZone?: string) {
  return new Date(!timeZone && !/(Z|[+-]\d{2}:?\d{2})$/.test(value) ? `${value}Z` : value);
}
export function scheduleDate(session: PortalClass) {
  return new Intl.DateTimeFormat('es-MX', {
    timeZone: session.timeZone || 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(sessionDate(session.startsAt, session.timeZone));
}
export function scheduleTime(session: PortalClass, end = false) {
  return new Intl.DateTimeFormat('es-MX', {
    timeZone: session.timeZone || 'UTC', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(sessionDate(end ? session.endsAt : session.startsAt, session.timeZone));
}
export function filterSchedule(sessions: PortalClass[], query = '', courseId = '') {
  const search = normalizeSearch(query);
  return sessions.filter(session => (!courseId || session.courseId === courseId) &&
    (!search || normalizeSearch(`${session.title} ${session.location || ''} ${scheduleDate(session)}`).includes(search)))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt) || a.id.localeCompare(b.id));
}
export function groupSchedule(sessions: PortalClass[]) {
  const groups = new Map<string, { id: string; title: string; sessions: PortalClass[] }>();
  for (const session of sessions) {
    const group = groups.get(session.courseId) || { id: session.courseId, title: session.title, sessions: [] };
    group.sessions.push(session);
    groups.set(session.courseId, group);
  }
  return [...groups.values()];
}

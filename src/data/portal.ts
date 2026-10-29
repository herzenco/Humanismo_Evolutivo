import courseCatalog from '../generated/course-catalog.json' with { type: 'json' };
import suppliedSchedule from '../generated/portal-schedule.json' with { type: 'json' };

/** Publish supplied courses and scheduled classes here. Do not use public events as classes. */
export type PortalLesson = { id: string; title: string; text?: string; videoUrl?: string };
export type PortalCourse = { id: string; title: string; description: string; lessons: PortalLesson[] };
export type PortalClass = { id: string; courseId: string; title: string; startsAt: string; endsAt: string; timeZone?: string; location?: string };

export const portalCourses = courseCatalog;
// Only the 23 explicitly dated sessions in the supplied PortalCalendario.html.
// The source gives no timezone and no complete recurrence/holiday rules.
export const portalClasses: PortalClass[] = suppliedSchedule;
export const portalScheduleCourses = [...new Map(portalClasses.map(session => [session.courseId, { id: session.courseId, title: session.title }])).values()];

export function classDateKey(session: PortalClass) {
  if (!session.timeZone) return session.startsAt.slice(0, 10);
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: session.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(session.startsAt));
  const part = (type: string) => parts.find(item => item.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function classesForMonth(sessions: PortalClass[], year: number, month: number) {
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
  return sessions.filter(session => classDateKey(session).startsWith(prefix)).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
}

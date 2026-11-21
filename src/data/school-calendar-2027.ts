import onlineCatalog from '../generated/course-catalog.json';

// The course-page brief confirms February 16 for the first term.
// Remaining dates and session counts come from Calendario Escolar 2027, scan pp. 1–5.
export const schoolTerms = [
  { start: '2027-02-16', end: '2027-06-15' },
  { start: '2027-08-16', end: '2027-12-15' },
] as const;

export const schoolBreak = { start: '2027-03-22', end: '2027-03-27' } as const;
export const schoolHolidays = ['2027-03-15', '2027-05-01', '2027-09-16', '2027-10-15', '2027-11-15'] as const;

const mondayWednesdayFriday = [1, 3, 5] as const;
const tuesdayThursday = [2, 4] as const;
const saturday = [6] as const;

type SchoolCourse = {
  id: string;
  title: string;
  instructor: string | null;
  days: readonly number[];
  start: string;
  end: string;
  termSessions: readonly [number, number];
};

export const schoolCourses: readonly SchoolCourse[] = [
  { id: 'humanismo-evolutivo-transpersonal', title: 'Introducción al Humanismo Evolutivo Transpersonal', instructor: 'Aída', days: mondayWednesdayFriday, start: '18:00', end: '19:00', termSessions: [45, 51] },
  { id: 'yo-soy-nosotros', title: 'Introducción a la Filosofía de “Yo soy nosotros”', instructor: 'Olimpia', days: mondayWednesdayFriday, start: '17:00', end: '18:00', termSessions: [45, 51] },
  { id: 'ecologia-y-espiritualidad', title: 'Ecología y Espiritualidad', instructor: null, days: mondayWednesdayFriday, start: '16:00', end: '17:00', termSessions: [45, 51] },
  { id: 'introduccion-a-la-filosofia', title: 'Introducción a la Filosofía', instructor: 'Olimpia', days: tuesdayThursday, start: '18:00', end: '19:00', termSessions: [33, 34] },
  { id: 'introduccion-a-la-antropologia', title: 'Introducción a la Antropología', instructor: null, days: tuesdayThursday, start: '17:00', end: '18:00', termSessions: [33, 34] },
  { id: 'historia-evolutiva-del-arte', title: 'Historia Evolutiva del Arte', instructor: 'Alex', days: tuesdayThursday, start: '16:00', end: '17:00', termSessions: [33, 34] },
  { id: 'el-arte-de-ser-empresario', title: 'El arte de ser empresario', instructor: 'MCM', days: saturday, start: '11:00', end: '13:00', termSessions: [11, 12] },
  { id: 'historia-de-las-religiones', title: 'Historia de las Religiones', instructor: 'Alex', days: saturday, start: '10:00', end: '11:00', termSessions: [11, 12] },
  { id: 'filosofia-para-ninos', title: 'Filosofía para niños', instructor: 'Olimpia', days: saturday, start: '10:00', end: '11:00', termSessions: [11, 12] },
];

const onlineCourses = new Map(onlineCatalog.map(course => [course.id, course]));

export function onlineSchoolCourse(id: string) {
  return onlineCourses.get(id);
}

export function schoolCoursePath(id: string) {
  return `/clases/${id}`;
}

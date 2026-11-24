import { ArrowDown, ArrowRight, CalendarDays, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from '@/components/LocalizedLink';
import JsonLd from '@/components/seo/JsonLd';
import PageWrapper from '@/components/layout/PageWrapper';
import { schoolBreak, schoolCoursePath, schoolHolidays, schoolTerms, schoolYearSessions } from '@/data/school-calendar-2027';
import { pageMetadata } from '@/lib/seo';
import { absoluteUrl, EDUCATION_WAITLIST_URL, isLanguage } from '@/lib/site';
import styles from './classes.module.css';

import { getSchoolCourses } from '@/lib/qa-resources';

function getWeeklySchedule(schoolCourses: Awaited<ReturnType<typeof getSchoolCourses>>) {
  return Array.from({ length: 6 }, (_, index) => {
    const day = index + 1;
    return {
      day,
      courses: schoolCourses.filter(course => course.days.includes(day))
        .sort((a, b) => a.start.localeCompare(b.start)),
    };
  });
}

const copy = {
  es: {
    title: 'Cursos de filosofía y antropología en Cancún',
    description: 'Consulta los cursos presenciales de filosofía y antropología en Cancún, el calendario 2027 y cómo pedir información a la Fundación Humanismo Evolutivo.',
    contact: 'Solicitar información sobre los cursos',
    courses: 'Cursos de la Fundación',
    calendar: 'Calendario de clases',
    weekly: 'Horario semanal',
    terms: 'Periodos del ciclo escolar',
    first: 'Primer periodo',
    second: 'Segundo periodo',
    instructor: 'Docente',
    instructorPending: 'Docente por confirmar',
    courseDetails: 'Ver curso',
    break: 'Semana Santa',
    holidays: 'Días festivos durante el ciclo',
    onSite: 'Presencial',
    sessions: 'sesiones',
    planPending: 'Plan de clases pendiente',
    period: 'Calendario Escolar 2027. Horarios en hora de Cancún. Consulta la sede en la página de cada curso.',
    saturdayNote: 'Las clases de los sábados se imparten en fechas seleccionadas.',
    portal: 'Portal educativo',
  },
  en: {
    title: 'Philosophy and anthropology courses in Cancún',
    description: 'Browse in-person philosophy and anthropology courses in Cancún, check the 2027 timetable and contact the Evolutionary Humanism Foundation.',
    contact: 'Ask about the courses',
    courses: 'Foundation courses',
    calendar: 'Class calendar',
    weekly: 'Weekly timetable',
    terms: 'School terms',
    first: 'First term',
    second: 'Second term',
    instructor: 'Instructor',
    instructorPending: 'Instructor to be confirmed',
    courseDetails: 'View course',
    break: 'Holy Week break',
    holidays: 'Holidays during term',
    onSite: 'In person',
    sessions: 'sessions',
    planPending: 'Class plan pending',
    period: '2027 school calendar. Times are local to Cancún. See each course page for the venue.',
    saturdayNote: 'Saturday classes are held on selected dates.',
    portal: 'Education portal',
  },
};

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return pageMetadata({
    title: copy[lang].title,
    description: copy[lang].description,
    path: '/clases',
    image: '/design/clases-pabellon.webp',
    language: lang,
    index: true,
  });
}

export default async function ClassesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const text = copy[lang];
  const schoolCourses = await getSchoolCourses();
  const weeklySchedule = getWeeklySchedule(schoolCourses);
  const locale = lang === 'es' ? 'es-MX' : 'en-US';
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' });
  const date = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', timeZone: 'UTC' });
  const formatDate = (day: string) => new Date(`${day}T00:00:00Z`);
  const range = (start: string, end: string) => date.formatRange(formatDate(start), formatDate(end));

  return <PageWrapper>
    <JsonLd data={{
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: text.courses,
      itemListElement: schoolCourses.map((course, index) => {
        const summary = course.preview?.[lang]?.summary;
        const url = absoluteUrl(schoolCoursePath(course.id), lang);
        return {
          '@type': 'ListItem', position: index + 1, url,
          item: {
            '@type': 'Course', name: course.title, url,
            provider: { '@type': 'Organization', '@id': `${absoluteUrl('/')}#fundacion`, name: 'Fundación Humanismo Evolutivo' },
            ...(summary ? { description: summary } : {}),
          },
        };
      }),
    }} />
    <section className={`design-media-hero ${styles.hero}`}>
      <Image
        src="/design/clases-pabellon.webp"
        alt=""
        fill
        sizes="100vw"
        fetchPriority="high"
        className={styles.heroImage}
      />
      <div className={`design-content-width ${styles.heroContent}`}>
        <h1>{text.title}</h1>
        <p>{text.description}</p>
        <a href="#calendario" className="design-button design-button-gold">
          {text.calendar}<ArrowDown size={18} aria-hidden="true" />
        </a>
      </div>
    </section>

    <section className={`design-content-width ${styles.section}`} aria-labelledby="cursos-title">
      <div className="design-section-heading"><h2 id="cursos-title">{text.courses}</h2></div>
      <ul className={styles.courseGrid}>
        {schoolCourses.map(course => {
          const summary = course.preview?.[lang]?.summary;
          const sessions = schoolYearSessions(course.termSessions);
          return <li key={course.id} id={`curso-${course.id}`}>
            <Link href={schoolCoursePath(course.id)} className={styles.courseLink} aria-label={`${text.courseDetails}: ${course.title}`}>
              <h3>{course.title}</h3>
              {summary ? <p>{summary}</p> : null}
              <p>{text.onSite} · {sessions} {text.sessions}</p>
              <p>{course.instructor ? `${text.instructor}: ${course.instructor}` : text.instructorPending}</p>
              {course.classPlanPending ? <p className={styles.planPending}>{text.planPending}</p> : null}
              <span className={`design-text-link ${styles.courseLinkLabel}`}>{text.courseDetails}<ArrowRight size={17} aria-hidden="true" /></span>
            </Link>
          </li>;
        })}
      </ul>
      <div className="design-actions">
        <Link className="design-button design-button-outline" href="/contacto">{text.contact}</Link>
        <a className="design-button design-button-gold" href={EDUCATION_WAITLIST_URL}>
          <GraduationCap size={19} aria-hidden="true" />{text.portal}
        </a>
      </div>
    </section>

    <section id="calendario" className={styles.calendar} aria-labelledby="calendario-title">
      <div className={`design-content-width ${styles.section}`}>
        <div className="design-section-heading">
          <CalendarDays size={28} aria-hidden="true" />
          <h2 id="calendario-title">{text.calendar}</h2>
          <p className={styles.coverage}>{text.period}</p>
        </div>
        <section aria-labelledby="horario-title">
          <h3 id="horario-title" className={styles.subheading}>{text.weekly}</h3>
          <div className={styles.agenda}>
            {weeklySchedule.map(({ day, courses }) => {
              const dayName = weekday.format(new Date(Date.UTC(2027, 1, 14 + day)));
              return <section key={day} aria-labelledby={`horario-dia-${day}`}>
                <h4 id={`horario-dia-${day}`}>{dayName}</h4>
                <ul>{courses.map(course => <li key={course.id}>
                  <span><time dateTime={course.start}>{course.start}</time>–<time dateTime={course.end}>{course.end}</time></span>
                  <span>{course.title}</span>
                </li>)}</ul>
              </section>;
            })}
          </div>
          <p className={styles.coverage}>{text.saturdayNote}</p>
        </section>

        <section aria-labelledby="periodos-title">
          <h3 id="periodos-title" className={styles.subheading}>{text.terms}</h3>
          <ul className={styles.courseGrid}>
            {schoolTerms.map(({ start, end }, index) => <li key={start}>
              <h4>{index === 0 ? text.first : text.second}</h4>
              <p>{range(start, end)}</p>
            </li>)}
            <li><h4>{text.break}</h4><p>{range(schoolBreak.start, schoolBreak.end)}</p></li>
            <li><h4>{text.holidays}</h4><p>{schoolHolidays.map(day => date.format(formatDate(day))).join(' · ')}</p></li>
          </ul>
        </section>
      </div>
    </section>
  </PageWrapper>;
}

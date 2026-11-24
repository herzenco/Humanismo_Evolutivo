import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from '@/components/LocalizedLink';
import PageWrapper from '@/components/layout/PageWrapper';
import JsonLd from '@/components/seo/JsonLd';
import { schoolBreak, schoolCoursePath, schoolTerms } from '@/data/school-calendar-2027';
import { getSchoolCourses } from '@/lib/qa-resources';
import { pageMetadata } from '@/lib/seo';
import { absoluteUrl, isLanguage } from '@/lib/site';
import styles from '../classes.module.css';

type Props = { params: Promise<{ lang: string; courseSlug: string }> };

async function courseData(params: Props['params']) {
  const { lang, courseSlug } = await params;
  if (!isLanguage(lang)) notFound();
  const course = (await getSchoolCourses()).find(item => item.id === courseSlug);
  if (!course) notFound();

  const preview = course.preview?.[lang];
  if (!preview) notFound();
  return { lang, course, preview, path: schoolCoursePath(course.id) };
}

export async function generateMetadata({ params }: Props) {
  const { lang, course, preview, path } = await courseData(params);
  const description = preview.summaryPending
    ? lang === 'es'
      ? `Consulta el horario 2027 y la clase de muestra de ${course.title} en Cancún.`
      : `See the 2027 schedule and sample class for ${course.title} in Cancún.`
    : preview.summary;
  return pageMetadata({ title: `${course.title} ${lang === 'es' ? 'en' : 'in'} Cancún`, description, path, language: lang, image: '/design/clases-pabellon.webp' });
}

export default async function CoursePage({ params }: Props) {
  const { lang, course, preview, path } = await courseData(params);
  const en = lang === 'en';
  const locale = en ? 'en-US' : 'es-MX';
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' });
  const date = new Intl.DateTimeFormat(locale, { month: 'long', day: 'numeric', timeZone: 'UTC' });
  const dateRange = (start: string, end: string) => date.formatRange(
    new Date(`${start}T00:00:00Z`), new Date(`${end}T00:00:00Z`),
  );
  const days = course.days.map(day => {
    const name = weekday.format(new Date(Date.UTC(2027, 1, 14 + day)));
    return name.charAt(0).toLocaleUpperCase(locale) + name.slice(1);
  });
  const listedDays = new Intl.ListFormat(locale, { type: 'conjunction' }).format(days);
  const url = absoluteUrl(path, lang);
  const teacher = course.instructor
    ? `${en ? 'Instructor' : 'Docente'}: ${course.instructor}`
    : (en ? 'Instructor to be confirmed' : 'Docente por confirmar');
  const planPending = course.classPlanPending ? (en ? 'Class plan pending' : 'Plan de clases pendiente') : null;

  return <PageWrapper>
    <JsonLd data={{
      '@context': 'https://schema.org', '@type': 'Course', name: course.title, description: preview.summary, url,
      provider: { '@type': 'Organization', '@id': `${absoluteUrl('/')}#fundacion`, name: 'Fundación Humanismo Evolutivo' },
    }} />
    <section className={`design-media-hero ${styles.courseDetailHero}`}>
      <div className="design-content-width">
        <Link href="/clases" className={styles.back}><ArrowLeft size={18} aria-hidden="true" />{en ? 'All courses' : 'Todos los cursos'}</Link>
        <h1>{course.title}</h1>
        <p>{teacher}</p>
        {planPending ? <p className={styles.planPending}>{planPending}</p> : null}
        <p>{preview.summary}</p>
        {preview.credit ? <p className={styles.courseCredit}>{preview.credit}</p> : null}
      </div>
    </section>

    <div className={`design-content-width ${styles.courseReader}`}>
      <section className={styles.courseSchedule} aria-labelledby="course-schedule">
        <h2 id="course-schedule">{en ? '2027 schedule' : 'Horario 2027'}</h2>
        <p className={styles.courseTime}><time dateTime={course.start}>{course.start}</time>–<time dateTime={course.end}>{course.end}</time></p>
        <p>{listedDays}</p>
        <p className={styles.coverage}>{en ? 'Cancún time' : 'Hora de Cancún'}</p>
        <ul className={styles.courseDates}>
          {schoolTerms.map(({ start, end }) => <li key={start}>
            {dateRange(start, end)}
          </li>)}
        </ul>
        <p className={styles.coverage}>{en ? 'Easter break' : 'Receso de Semana Santa'}: {dateRange(schoolBreak.start, schoolBreak.end)}</p>
        <p className={styles.coverage}>{en ? 'No classes on school-calendar holidays.' : 'No hay clases en los días festivos del calendario escolar.'}</p>
        {course.days.includes(6) && <p className={styles.coverage}>{en ? 'Classes are held on selected Saturdays.' : 'Las clases se imparten en sábados seleccionados.'}</p>}
        <p className={styles.coverage}>{preview.venue ?? (en ? 'Venue pending confirmation.' : 'Sede por confirmar.')}</p>
      </section>

      <section className={styles.courseSample} aria-labelledby="course-sample">
        <h2 id="course-sample">{en ? 'Sample class' : 'Clase de muestra'}</h2>
        <h3>{preview.title}</h3>
        <p>{preview.lesson}</p>
        <div className={styles.courseExercise}>
          <h4>{en ? 'Try it' : 'Actividad'}</h4>
          <p>{preview.exercise}</p>
        </div>
      </section>

      {preview.objectives ? <section className={styles.courseObjectives} aria-labelledby="course-objectives">
        <h2 id="course-objectives">{en ? 'Course objectives' : 'Objetivos del curso'}</h2>
        <p>{preview.objectives.general}</p>
        <ol>
          {preview.objectives.specific.map(item => <li key={item.text}>
            {item.label ? <><strong>{item.label}</strong> {item.text}</> : item.text}
          </li>)}
        </ol>
      </section> : null}
    </div>
  </PageWrapper>;
}

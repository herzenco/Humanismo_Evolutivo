import Link from 'next/link';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { portalCourses } from '@/data/portal';
export const courseHref = (id: string) => `/portal/cursos/${id}`;
export const lessonHref = (id: string, lesson: number) => `${courseHref(id)}/clases/${lesson}`;
export default function CourseCatalog() {
  return <section aria-labelledby="courses-title"><div className="portal-section-heading"><h2 id="courses-title">Todos los cursos</h2><span>4 cursos · 146 clases</span></div><div className="portal-content-grid">{portalCourses.map(course=><article className="portal-content-card" key={course.id}><div><GraduationCap size={32}/><span className="design-eyebrow">{course.lessons.length} CLASES · {course.minutes} MIN POR CLASE</span><h3>{course.title}</h3><p>{course.description}</p><Link className="design-text-link" href={courseHref(course.id)}>Explorar curso<ArrowRight size={18}/></Link></div></article>)}</div><p className="portal-course-note">Cada curso tiene su propio recorrido. Completa una clase para abrir la siguiente; las clases completadas quedan disponibles para repasar.</p></section>;
}

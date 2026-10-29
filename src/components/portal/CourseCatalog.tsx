import type {LearningCourse} from '@/lib/courses/contracts';
import Link from 'next/link';
import { ArrowRight, GraduationCap } from 'lucide-react';
export const courseHref = (id: string) => `/portal/cursos/${id}`;
export const lessonHref = (id: string, lesson: number) => `${courseHref(id)}/clases/${lesson}`;
export default function CourseCatalog({courses=[]}:{courses?:LearningCourse[]}) {
  return <section aria-labelledby="courses-title"><div className="portal-section-heading"><h2 id="courses-title">Todos los cursos</h2><span>{courses.length} cursos · {courses.reduce((n,c)=>n+c.lessons.length,0)} clases</span></div><div className="portal-content-grid">{courses.map(course=><article className="portal-content-card" key={course.id}><div><GraduationCap size={32}/><span className="design-eyebrow">{course.lessons.length} CLASES · {course.minutes} MIN POR CLASE</span><h3>{course.title}</h3><p>{course.description}</p><Link className="design-text-link" href={courseHref(course.id)}>Explorar curso<ArrowRight size={18}/></Link></div></article>)}</div><p className="portal-course-note">Cada curso tiene su propio recorrido. Completa una clase para abrir la siguiente; las clases completadas quedan disponibles para repasar.</p></section>;
}

import Link from 'next/link';
import { CheckCircle2, LockKeyhole, ArrowRight } from 'lucide-react';
import { portalCourses } from '@/data/portal';
import { LearningShell, learningIdentity, LearningUnavailable, notFound } from '@/lib/learning/pages';
import { learningAccess } from '@/lib/learning/server';
import { courseHref, lessonHref } from '@/components/portal/CourseCatalog';
export { metadata } from '../../page';
export const dynamic='force-dynamic';
export default async function CoursePage({params}:{params:Promise<{courseId:string}>}) {
 const {courseId}=await params;
 const course=portalCourses.find(c=>c.id===courseId);
 if(!course) notFound();
 await learningIdentity(courseHref(courseId));
 const {data,error}=await learningAccess('summary');
 if(error) return <LearningShell><LearningUnavailable/></LearningShell>;
 const completed=Number((data as Record<string,number>)?.[courseId] || 0);
 return <LearningShell><section className="portal-course-space"><Link className="design-text-link" href="/portal">← Todos los cursos</Link><span className="design-eyebrow">TU RECORRIDO · {course.lessons.length} CLASES</span><h2>{course.title}</h2><p>{course.description}</p><div className="portal-course-progress"><label htmlFor="course-progress">{completed} de {course.lessons.length} clases completadas</label><progress id="course-progress" value={completed} max={course.lessons.length}/><Link className="design-button" href={lessonHref(courseId,Math.min(completed+1,course.lessons.length))}>{completed===course.lessons.length ? 'Repasar el curso' : completed ? 'Continuar mi curso' : 'Comenzar mi curso'}<ArrowRight size={18}/></Link></div><h3>Programa de clases</h3><p>Avanza en orden. Puedes volver a cualquier clase que ya hayas completado.</p><ol className="portal-lesson-list">{course.lessons.map((lesson,i)=>{const locked=i>completed;return <li key={lesson.id}>{locked ? <div className="portal-lesson-locked"><span>{i+1}</span><div>{lesson.title}<small>Completa la clase {i} para desbloquear</small></div><LockKeyhole size={18} aria-label="Bloqueada"/></div> : <Link href={lessonHref(courseId,i+1)}><span>{i+1}</span><div>{lesson.title}<small>{i<completed ? 'Completada · Disponible para repasar' : 'Disponible · Tu siguiente paso'}</small></div>{i<completed ? <CheckCircle2 size={20} aria-label="Completada"/> : <ArrowRight size={20}/>}</Link>}</li>})}</ol></section></LearningShell>;
}

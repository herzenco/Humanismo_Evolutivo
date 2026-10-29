import type {LearningCourse} from '@/lib/courses/contracts';
import Link from 'next/link';
import { ArrowRight, CalendarCheck2, BookOpenCheck, GraduationCap, Users } from 'lucide-react';
import type { AttendanceSummary } from '@/lib/attendance/contracts';
import { studentOverview } from '@/lib/learning/overview';
import { courseHref, lessonHref } from './CourseCatalog';
export default function StudentDashboard({ progress, attendance, courses }: { courses?:LearningCourse[]; progress: Record<string,number> | null; attendance: AttendanceSummary | null }) {
 const overview = studentOverview(progress,attendance,courses);
 const metrics = [
  { label:'Asistencias presenciales', value:attendance?.presentSessions, detail:'Registradas por tu maestro', icon:CalendarCheck2 },
  { label:'Cursos con asistencia', value:attendance?.presentCourses, detail:'Con al menos una asistencia presencial', icon:Users },
  { label:'Clases completadas en línea', value:overview.completedLessons, detail:'Tu participación en las lecciones', icon:BookOpenCheck },
  { label:'Cursos con participación en línea', value:overview.onlineCourses, detail:`${overview.finishedCourses ?? '—'} de ${overview.courses.length} cursos completados`, icon:GraduationCap },
 ];
 return <div className="portal-student-dashboard">
  <section className="portal-student-metrics" aria-label="Resumen de mi aprendizaje">{metrics.map(metric=><article key={metric.label}><metric.icon size={22} aria-hidden="true"/><span>{metric.label}</span><strong>{metric.value ?? '—'}</strong><small>{metric.detail}</small></article>)}</section>
  <section aria-labelledby="my-progress-title"><div className="portal-section-heading"><h2 id="my-progress-title">Mi avance por curso</h2><Link href="/portal?view=courses" className="design-text-link">Ver todos los cursos<ArrowRight size={17}/></Link></div><p className="portal-student-definition">La asistencia presencial la registra tu maestro. Tu participación en línea avanza al completar cada lección; son registros independientes.</p>
   {progress === null ? <p role="alert" className="portal-data-notice">No pudimos cargar tu progreso en línea. Vuelve a intentarlo; tu avance se conserva.</p> : null}
   <div className="portal-student-courses">{overview.courses.map(course=><article className="portal-student-course" key={course.id}><div className="portal-student-course-heading"><h3><Link href={courseHref(course.id)}>{course.title}</Link></h3><span className="portal-course-status">{course.completed === null ? 'Sin datos' : course.completed === course.lessons.length ? 'Completado' : course.completed ? 'En curso' : 'Por comenzar'}</span></div><div className="portal-student-course-progress"><span>Participación en línea</span><strong>{course.percent === null ? '—' : `${course.percent}%`}</strong>{course.completed === null ? null : <progress aria-label={`Progreso en ${course.title}`} value={course.completed} max={course.lessons.length}/>}<small>{course.completed === null ? 'Progreso no disponible' : `${course.completed} de ${course.lessons.length} clases completadas`}</small></div><div className="portal-student-course-footer"><span><CalendarCheck2 size={17} aria-hidden="true"/>{course.attended === null ? 'Asistencia no disponible' : `${course.attended} ${course.attended === 1 ? 'asistencia presencial' : 'asistencias presenciales'}`}</span><Link className="design-text-link" href={course.completed === null ? courseHref(course.id) : lessonHref(course.id,Math.min(course.completed+1,course.lessons.length))}>{course.completed === course.lessons.length ? 'Repasar' : course.completed ? 'Continuar' : 'Comenzar'}<ArrowRight size={17}/></Link></div></article>)}</div>
  </section>
  <section className="portal-attendance-summary" aria-labelledby="my-attendance-title"><div className="portal-section-heading"><h2 id="my-attendance-title">Mi asistencia presencial</h2><Link className="design-text-link" href="/portal?view=calendar">Ver clases programadas<ArrowRight size={17}/></Link></div>
   {attendance === null ? <p role="status">La asistencia presencial no está disponible en este momento. Se mostrará cuando puedas consultar los registros de tu escuela.</p> : attendance.courses.length ? <div className="portal-school-table"><table><caption className="sr-only">Asistencias y ausencias registradas por el maestro, por curso</caption><thead><tr><th>Curso</th><th>Asistencias</th><th>Ausencias registradas</th></tr></thead><tbody>{attendance.courses.map(course=><tr key={course.courseId}><td>{course.title}</td><td>{course.present}</td><td>{course.absent}</td></tr>)}</tbody></table></div> : <p>Aún no tienes asistencias presenciales registradas. Aparecerán aquí cuando tu maestro pase lista.</p>}
  </section>
 </div>;
}

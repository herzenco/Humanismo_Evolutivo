import Link from 'next/link';
import { portalCourses } from '@/data/portal';
import { LearningShell, learningIdentity, LearningUnavailable, notFound } from '@/lib/learning/pages';
import { learningAccess, type LessonState } from '@/lib/learning/server';
import { courseHref, lessonHref } from '@/components/portal/CourseCatalog';
import LessonWorkspace from '@/components/portal/LessonWorkspace';
export { metadata } from '../../../../page';
export const dynamic='force-dynamic';
export default async function LessonPage({params}:{params:Promise<{courseId:string;lessonId:string}>}) {
 const {courseId,lessonId}=await params;
 const course=portalCourses.find(c=>c.id===courseId);
 const number=Number(lessonId);
 if(!course || !/^[1-9]\d*$/.test(lessonId) || !course.lessons[number-1]) notFound();
 await learningIdentity(lessonHref(courseId,number));
 const {data,error}=await learningAccess('read',courseId,number);
 if(error) return <LearningShell>{error.code==='42501' ? <div className="portal-empty"><h2>Esta clase aún está bloqueada</h2><p>Completa las clases anteriores de este curso para continuar. Las clases que ya terminaste siguen disponibles.</p><Link className="design-button" href={courseHref(courseId)}>Volver al programa</Link></div> : <LearningUnavailable/>}</LearningShell>;
 // This module is never imported by a client component; locked lesson bodies never enter the response.
 const {default:content}=await import('@/generated/course-content.json');
 const lesson=content.find(c=>c.id===courseId)!.lessons[number-1];
 return <LearningShell><LessonWorkspace key={`${courseId}-${number}`} course={course} lesson={lesson} number={number} state={data as unknown as LessonState}/></LearningShell>;
}

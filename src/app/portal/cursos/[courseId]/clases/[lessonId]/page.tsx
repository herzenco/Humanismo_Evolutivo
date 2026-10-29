import {lessonContentSchema} from '@/lib/courses/contracts';
import Link from 'next/link';
import {getLearningCourses} from '@/lib/courses/server';
import {createClient} from '@/lib/supabase/server';
import { LearningShell, learningIdentity, LearningUnavailable, notFound } from '@/lib/learning/pages';
import { learningAccess, type LessonState } from '@/lib/learning/server';
import { courseHref, lessonHref } from '@/components/portal/CourseCatalog';
import LessonWorkspace from '@/components/portal/LessonWorkspace';
export { metadata } from '../../../../page';
export const dynamic='force-dynamic';
export default async function LessonPage({params}:{params:Promise<{courseId:string;lessonId:string}>}) {
 const {courseId,lessonId}=await params;
 await learningIdentity(lessonHref(courseId,Number(lessonId)));
 const course=(await getLearningCourses()).find(c=>c.id===courseId);
 const number=Number(lessonId);
 if(!course || !/^[1-9]\d*$/.test(lessonId) || !course.lessons[number-1]) notFound();
 await learningIdentity(lessonHref(courseId,number));
 const {data,error}=await learningAccess('read',courseId,number);
 if(error) return <LearningShell>{error.code==='42501' ? <div className="portal-empty"><h2>Esta clase aún está bloqueada</h2><p>Completa las clases anteriores de este curso para continuar. Las clases que ya terminaste siguen disponibles.</p><Link className="design-button" href={courseHref(courseId)}>Volver al programa</Link></div> : <LearningUnavailable/>}</LearningShell>;
 // Lesson bodies come from the database. A locked class never reaches this query.
 const client=await createClient();
 const stored=await client.rpc('portal_course_access',{p_action:'lesson.read',p_input:{courseId,lesson:number}});
 if(stored.error||!stored.data)return <LearningShell><LearningUnavailable/></LearningShell>;
 const lesson=lessonContentSchema.parse(stored.data);
 return <LearningShell><LessonWorkspace key={`${courseId}-${number}`} course={course} lesson={lesson} number={number} state={data as unknown as LessonState}/></LearningShell>;
}

import 'server-only';
import {createClient} from '@/lib/supabase/server';
import {portalCourses} from '@/data/portal';
import {isEducationAccessEnabled} from '@/lib/education/server';
import type {LearningCourse} from './contracts';
export async function getLearningCourses(): Promise<LearningCourse[]> {
 if(!isEducationAccessEnabled)return portalCourses;
 const client=await createClient();
 const {data,error}=await client.rpc('portal_course_access',{p_action:'list',p_input:{}});
 if(error)throw new Error('No se pudo cargar el catálogo de cursos.');
 return [...portalCourses,...data as LearningCourse[]];
}

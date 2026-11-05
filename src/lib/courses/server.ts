import 'server-only';
import { createClient } from '@/lib/supabase/server';
import type { LearningCourse } from './contracts';

// The catalog is the database. course-catalog.json is only the seed source.
export async function getLearningCourses(): Promise<LearningCourse[]> {
  try {
    const client = await createClient();
    const { data, error } = await client.rpc('portal_course_access', { p_action: 'list', p_input: {} });
    if (error || !Array.isArray(data)) return [];
    return data as LearningCourse[];
  } catch {
    return [];
  }
}

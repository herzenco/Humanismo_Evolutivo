import 'server-only';
import { createClient } from '@/lib/supabase/server';
export type LessonWork = { reflection: string; reviewed: boolean };
export type LessonState = { completed: number; work: LessonWork };
export async function learningAccess(action: 'summary' | 'read' | 'save' | 'complete', course?: string, lesson?: number, work?: LessonWork) {
  const client = await createClient();
  return client.rpc('portal_learning_access', { p_action: action, p_course: course, p_lesson: lesson, p_reflection: work?.reflection ?? '', p_reviewed: work?.reviewed ?? false });
}

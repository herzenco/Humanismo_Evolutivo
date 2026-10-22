import 'server-only';
import { qaGateEnabled } from '@/lib/qa-gate';
import { createClient } from '@/lib/supabase/server';
import { educationContextSchema, type EducationRequest } from './contracts';

// A separate switch makes activation explicit while QA and production share Auth.
export const isEducationAccessEnabled = qaGateEnabled() && process.env.EDUCATION_ACCESS_ENVIRONMENT === 'qa';
export async function educationAccess(request: EducationRequest) {
  const supabase = await createClient();
  return supabase.rpc('education_qa_access', { p_action: request.action, p_input: request.input });
}
export async function getEducationContext() {
  if (!isEducationAccessEnabled) return null;
  const { data, error } = await educationAccess({ action: 'context', input: {} });
  if (error) throw new Error('Education access could not be verified.');
  return educationContextSchema.parse(data);
}

import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { isEducationAccessEnabled } from '@/lib/education/server';
import type { AttendanceRequest, AttendanceSummary } from './contracts';
export async function attendanceAccess(action: AttendanceRequest['action'] | 'mine', input: AttendanceRequest['input'] | Record<string,never> = {}) {
 const client = await createClient();
 return client.rpc('portal_attendance_access', { p_action: action, p_input: input });
}
export async function studentAttendance(): Promise<AttendanceSummary | null> {
 if (!isEducationAccessEnabled) return null;
 const { data, error } = await attendanceAccess('mine');
 return error ? null : data as unknown as AttendanceSummary;
}

import { z } from 'zod';
const scope = { schoolId: z.uuid(), sessionId: z.string().min(1).max(200) };
export const attendanceRequestSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('roster'), input: z.object({ ...scope, limit: z.number().int().min(1).max(100).default(50), offset: z.number().int().min(0).max(100000).default(0) }).strict() }).strict(),
  z.object({ action: z.literal('mark'), input: z.object({ ...scope, userId: z.uuid(), status: z.enum(['present','absent']) }).strict() }).strict(),
]);
export type AttendanceRequest = z.infer<typeof attendanceRequestSchema>;
export type AttendanceSummary = { presentSessions: number; presentCourses: number; courses: { courseId: string; title: string; present: number; absent: number }[] };
export type AttendanceStudent = { userId: string; displayName: string | null; email: string | null; status: 'present' | 'absent' | null; recordedAt: string | null };

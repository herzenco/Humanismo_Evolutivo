import { z } from 'zod';

const school = z.object({ schoolId: z.uuid() });
const page = z.object({ limit: z.number().int().min(1).max(100).default(50), offset: z.number().int().min(0).max(100000).default(0) });
const empty = z.object({}).strict();
const operation = <A extends string, S extends z.ZodType>(action: A, input: S) => z.object({ action: z.literal(action), input }).strict();
export const educationRequestSchema = z.discriminatedUnion('action', [
  operation('context', empty),
  operation('schools.list', page),
  operation('people.list', page),
  operation('audit.list', page.extend({ schoolId: z.uuid().optional() }).strict()),
  operation('schools.create', z.object({ name: z.string().trim().min(1).max(160), slug: z.string().max(100).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/) }).strict()),
  operation('schools.status', school.extend({ status: z.enum(['active','archived']) }).strict()),
  operation('roster', school.extend(page.shape).strict()),
  operation('activity.list', school.extend({ userId: z.uuid().optional(), ...page.shape }).strict()),
  operation('activity.mine', page.extend({ schoolId: z.uuid().optional() }).strict()),
  operation('memberships.set', school.extend({ userId: z.uuid(), role: z.enum(['student','teacher']), status: z.enum(['active','suspended','removed']) }).strict()),
  operation('memberships.leave', school.strict()),
  operation('invitations.list', school.extend(page.shape).strict()),
  operation('invitations.mine', page.strict()),
  operation('invitations.create', school.extend({ email: z.email().trim().toLowerCase().max(254) }).strict()),
  operation('invitations.revoke', z.object({ invitationId: z.uuid() }).strict()),
  operation('invitations.accept', z.object({ invitationId: z.uuid() }).strict()),
  operation('activity.record', school.extend({ eventId: z.uuid(), classId: z.string().min(1).max(200), contentVersion: z.string().min(1).max(200), kind: z.enum(['opened','completed']), depth: z.number().finite().gt(0.5).max(1).optional() }).strict()),
]);
export type EducationRequest = z.infer<typeof educationRequestSchema>;
export type SchoolMembership = { schoolId: string; schoolName: string; role: 'student' | 'teacher'; status: 'active' | 'suspended' | 'removed'; schoolStatus: 'active' | 'archived'; isCommunity: boolean };
export type EducationContext = { userId: string; isPlatformAdmin: boolean; defaultSchoolId: string; memberships: SchoolMembership[] };
export const educationContextSchema = z.object({
  userId: z.uuid(), isPlatformAdmin: z.boolean(), defaultSchoolId: z.uuid(),
  memberships: z.array(z.object({ schoolId: z.uuid(), schoolName: z.string(), role: z.enum(['student','teacher']), status: z.enum(['active','suspended','removed']), schoolStatus: z.enum(['active','archived']), isCommunity: z.boolean() })),
});
export function educationErrorStatus(code: string | undefined) {
  if (code === '42501') return 403;
  if (code === '23505') return 409;
  if (['22023','22P02','23514','23502','23503','22003'].includes(code || '')) return 400;
  return 503;
}

import type { EducationContext } from '../education/contracts';
export function activeTeachingSchool(context?: EducationContext | null) {
 return context?.memberships.find(member=>member.role==='teacher'&&member.status==='active'&&member.schoolStatus==='active');
}

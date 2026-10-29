import type { EducationContext } from '../education/contracts';
export function activeTeachingSchool(context?: EducationContext | null) {
 const teaching=context?.memberships.filter(member=>member.role==='teacher'&&member.status==='active'&&member.schoolStatus==='active');
 return teaching?.find(member=>!member.isCommunity)||teaching?.[0];
}

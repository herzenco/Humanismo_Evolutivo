import type { EducationContext } from './education/contracts';
export type PortalRole = 'student' | 'teacher' | 'school_admin' | 'admin';
export const roleLabels: Record<PortalRole,string> = {student:'Estudiante',teacher:'Maestro',school_admin:'Administrador escolar',admin:'Administrador de plataforma'};
// Preview values never authorize a request. Actual capabilities come from DB context.
export function portalRole(value: string | null, enabled: boolean): PortalRole {
 return enabled && (value === 'teacher' || value === 'school_admin' || value === 'admin') ? value : 'student';
}
export function portalRoleSuffix(value: string | null) {
 return value === 'student' || value === 'teacher' || value === 'school_admin' || value === 'admin' ? `&role=${value}` : '';
}
export function availablePortalRoles(context?: EducationContext | null): PortalRole[] {
 const roles: PortalRole[] = ['student'];
 const active = context?.memberships.filter(m=>m.status==='active'&&m.schoolStatus==='active') || [];
 if(active.some(m=>m.role==='teacher')) roles.push('teacher');
 if(active.some(m=>m.role==='school_admin')) roles.push('school_admin');
 if(context?.isPlatformAdmin) roles.push('admin');
 return roles;
}
export function selectedPortalRole(context: EducationContext | null | undefined, requested: string | null): PortalRole {
 const roles=availablePortalRoles(context);
 return roles.includes(requested as PortalRole) ? requested as PortalRole : roles[roles.length-1];
}

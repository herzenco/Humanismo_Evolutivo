export type PortalRole = 'student' | 'teacher' | 'school' | 'admin';
type RoleContext = {isPlatformAdmin:boolean; memberships:{role:string;status:string;schoolStatus:string}[]};
export function availablePortalRoles(context?: RoleContext | null): PortalRole[] {
 const roles:PortalRole[]=['student'];
 for(const role of ['teacher','school'] as const) if(context?.memberships.some(m=>m.role===role&&m.status==='active'&&m.schoolStatus==='active')) roles.push(role);
 if(context?.isPlatformAdmin) roles.push('admin');
 return roles;
}
export function portalRole(value:string|null, allowed:readonly PortalRole[]):PortalRole {
 return allowed.includes(value as PortalRole) ? value as PortalRole : allowed[allowed.length-1] || 'student';
}
export function portalRoleSuffix(value:string|null) {
 return value==='teacher'||value==='school'||value==='admin' ? `&role=${value}` : '';
}

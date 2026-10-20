export type PortalRole = 'student' | 'teacher' | 'admin';
export function portalRole(value: string | null, enabled: boolean): PortalRole {
  return enabled && (value === 'teacher' || value === 'admin') ? value : 'student';
}
export function portalRoleSuffix(value: string | null) {
  return value === 'teacher' || value === 'admin' ? `&role=${value}` : '';
}

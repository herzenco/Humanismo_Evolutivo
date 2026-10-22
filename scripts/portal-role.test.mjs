import test from 'node:test';
import assert from 'node:assert/strict';
import { availablePortalRoles, portalRole, portalRoleSuffix } from '../src/lib/portal-role.ts';
test('query parameters cannot grant teacher, school or admin access',()=>{
 for(const value of ['teacher','school','admin','owner',null]) assert.equal(portalRole(value,availablePortalRoles(null)),'student');
 const context={isPlatformAdmin:false,memberships:[{role:'school',status:'active',schoolStatus:'active'}]};
 assert.deepEqual(availablePortalRoles(context),['student','school']);
 assert.equal(portalRole('admin',availablePortalRoles(context)),'school');
 assert.equal(portalRole('school',availablePortalRoles(context)),'school');
 assert.deepEqual(availablePortalRoles({...context,memberships:[{role:'school',status:'suspended',schoolStatus:'active'}]}),['student']);
 assert.deepEqual(availablePortalRoles({isPlatformAdmin:true,memberships:[]}),['student','admin']);
 assert.equal(portalRoleSuffix('student'),'&role=student');
 assert.equal(portalRole('student',availablePortalRoles(context)),'student');
 assert.equal(portalRoleSuffix('school'),'&role=school');
 assert.equal(portalRoleSuffix('owner'),'');
});

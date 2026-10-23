import test from 'node:test';
import assert from 'node:assert/strict';
import { portalRole, portalRoleSuffix } from '../src/lib/portal-role.ts';
test('role query cannot enable previews where server disables them', () => {
  for (const role of ['admin', 'teacher', 'student', null, 'owner']) assert.equal(portalRole(role, false), 'student');
  assert.equal(portalRole('admin', true), 'admin');
  assert.equal(portalRole('teacher', true), 'teacher');
  assert.equal(portalRole('owner', true), 'student');
  assert.equal(portalRoleSuffix('admin'), '&role=admin');
  assert.equal(portalRoleSuffix('teacher'), '&role=teacher');
  assert.equal(portalRoleSuffix('admin&view=school'), '');
});

test('real profile selection uses cumulative account roles and never query-string authority',async()=>{
 const {availablePortalRoles,selectedPortalRole}=await import('../src/lib/portal-role.ts');
 const school={schoolId:'10000000-0000-4000-8000-000000000001',schoolName:'ABC',status:'active',schoolStatus:'active',isCommunity:false};
 const student={userId:school.schoolId,isPlatformAdmin:false,defaultSchoolId:school.schoolId,memberships:[{...school,role:'student'}]};
 assert.deepEqual(availablePortalRoles(student),['student']);assert.equal(selectedPortalRole(student,'admin'),'student');assert.equal(selectedPortalRole(student,'school_admin'),'student');
 const admin={...student,memberships:[...student.memberships,{...school,role:'teacher'},{...school,role:'school_admin'}]};
 assert.deepEqual(availablePortalRoles(admin),['student','teacher','school_admin']);assert.equal(selectedPortalRole(admin,null),'school_admin');assert.equal(selectedPortalRole(admin,'teacher'),'teacher');
 assert.equal(selectedPortalRole({...admin,isPlatformAdmin:true},null),'admin');
 assert.equal(selectedPortalRole({...admin,memberships:admin.memberships.map(m=>({...m,status:'removed'}))},'school_admin'),'student');
});

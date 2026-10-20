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

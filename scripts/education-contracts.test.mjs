import test from 'node:test';
import assert from 'node:assert/strict';
import { educationRequestSchema, educationContextSchema, educationErrorStatus } from '../src/lib/education/contracts.ts';
const schoolId = '00000000-0000-4000-8000-000000000001';
test('education requests allow only the approved operations and fields', () => {
 assert.equal(educationRequestSchema.safeParse({action:'memberships.set',input:{schoolId,userId:schoolId,role:'owner',status:'active'}}).success,false);
 assert.equal(educationRequestSchema.safeParse({action:'activity.record',input:{schoolId,eventId:schoolId,classId:'test',contentVersion:'1',kind:'completed',depth:0.1}}).success,false);
 assert.equal(educationRequestSchema.safeParse({action:'activity.list',input:{schoolId,includeAnswers:true}}).success,false);
 assert.equal(educationRequestSchema.safeParse({action:'people.list',input:{limit:101}}).success,false);
 assert.equal(educationRequestSchema.safeParse({action:'unknown',input:{}}).success,false);
 assert.equal(educationRequestSchema.safeParse({action:'schools.status',input:{schoolId,status:'deleted'}}).success,false);
 assert.deepEqual(educationRequestSchema.parse({action:'people.list',input:{}}).input,{limit:50,offset:0});
});
test('context supports multiple student schools without turning school roles into platform admin', () => {
 const context=educationContextSchema.parse({userId:schoolId,isPlatformAdmin:false,defaultSchoolId:schoolId,memberships:[{schoolId,schoolName:'Amigos que Evolucionan',role:'student',status:'active',schoolStatus:'active',isCommunity:true},{schoolId,schoolName:'School',role:'student',status:'active',schoolStatus:'active',isCommunity:false}]});
 assert.equal(context.memberships.length,2);assert.equal(context.isPlatformAdmin,false);
});
test('education errors fail closed without returning database messages', () => {
 assert.equal(educationErrorStatus('42501'),403);assert.equal(educationErrorStatus('23505'),409);assert.equal(educationErrorStatus('22P02'),400);assert.equal(educationErrorStatus('unknown'),503);
});

test('governance contracts require initial admin, accepted roles and explicit classroom operations',()=>{
 assert.equal(educationRequestSchema.safeParse({action:'schools.create',input:{name:'ABC',slug:'abc'}}).success,false);
 assert.equal(educationRequestSchema.safeParse({action:'schools.create',input:{name:'ABC',slug:'abc',adminEmail:'admin@example.test'}}).success,true);
 assert.equal(educationRequestSchema.safeParse({action:'memberships.leave',input:{schoolId}}).success,false);
 assert.equal(educationRequestSchema.safeParse({action:'schools.settings',input:{schoolId,shareReflections:true}}).success,true);
 assert.equal(educationRequestSchema.safeParse({action:'schools.settings',input:{schoolId,shareReflections:'true'}}).success,false);
 assert.equal(educationRequestSchema.safeParse({action:'invitations.create',input:{schoolId,email:'teacher@example.test',role:'school_admin'}}).success,true);
});

// Local integration verification only. Requires learning-preview-server.mjs and Next on 3036.
import assert from 'node:assert/strict';
const base='http://localhost:3036',fixture='http://127.0.0.1:54339';
const sessions={};for(const name of ['student','teacher','schooladmin','platformadmin']){sessions[name]=await(await fetch(`${fixture}/test/session?email=${name}@example.test`)).json();}
async function request(name,path,body,origin=base){
 const cookie=name?'sb-127-auth-token=base64-'+Buffer.from(JSON.stringify(sessions[name])).toString('base64url'):'';
 const response=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',Origin:origin,...(cookie?{Cookie:cookie}:{})},body:JSON.stringify(body)});
 const result=await response.json();return{status:response.status,...result};
}
const education=(name,action,input={})=>request(name,'/api/education/access',{action,input});
assert.equal((await education(null,'context')).status,401);
assert.equal((await request('platformadmin','/api/education/access',{action:'context',input:{}},'https://untrusted.example')).status,403);
assert.equal((await education('student','memberships.leave',{schoolId:'20000000-0000-4000-8000-000000000001'})).status,400);
const schoolId='20000000-0000-4000-8000-000000000001';
assert.equal((await education('student','roster',{schoolId})).status,403);
let rows=await education('teacher','roster',{schoolId});assert.equal(rows.status,200);assert.equal(rows.data.length,1);assert.equal(rows.data[0].email,'student@example.test');
rows=await education('schooladmin','roster',{schoolId});assert.equal(rows.status,200);assert.ok(rows.data.some(r=>r.email==='otherstudent@example.test'));
assert.equal((await education('teacher','schools.create',{name:'Forbidden',slug:'forbidden',adminEmail:'outsider@example.test'})).status,403);
const created=await education('platformadmin','schools.create',{name:'Escuela API de prueba',slug:'escuela-api-prueba',adminEmail:'student@example.test'});assert.equal(created.status,200);assert.equal(created.data.deliveryStatus,'failed');assert.ok(created.data.deliveryMessage.includes('guardada'));
const mine=await education('student','invitations.mine',{});assert.ok(mine.data.some(i=>i.id===created.data.invitationId&&i.role==='school_admin'));
assert.equal((await education('teacher','invitations.accept',{invitationId:created.data.invitationId})).status,403);
assert.equal((await education('student','invitations.accept',{invitationId:created.data.invitationId})).status,200);
const after=await education('student','context');assert.ok(after.data.memberships.some(m=>m.schoolId===created.data.schoolId&&m.role==='school_admin'));
assert.equal((await education('schooladmin','memberships.set',{schoolId,userId:sessions.schooladmin.user.id,role:'school_admin',status:'removed'})).status,403);
assert.equal((await request('teacher','/api/courses',{action:'create',input:{courseId:'api-curso',title:'Curso API',description:'Programa de prueba',minutes:60}})).status,403);
assert.equal((await request('platformadmin','/api/courses',{action:'create',input:{courseId:'api-curso',title:'Curso API',description:'Programa de prueba',minutes:60}})).status,200);
assert.equal((await request('platformadmin','/api/courses',{action:'lesson.save',input:{courseId:'api-curso',lesson:1,title:'Primera lección',sections:[{title:'Contenido',text:'Contenido de prueba creado mediante la API.'}]}})).status,200);
assert.equal((await request('platformadmin','/api/courses',{action:'publish',input:{courseId:'api-curso'}})).status,200);
assert.equal((await request('student','/api/learning',{action:'complete',course:'api-curso',lesson:1,reflection:'Una reflexión de prueba para el nuevo curso.',reviewed:true})).status,200);
assert.equal((await request('teacher','/api/attendance',{action:'mark',input:{schoolId,userId:sessions.student.user.id,sessionId:'2027-02-15-ecologia-y-espiritualidad',status:'present'}})).status,403);
console.log('PASS: 4 authenticated profiles → Next APIs → PostgreSQL → validated responses. School creation, email failure feedback, invitation acceptance, classroom isolation, admin protection, course publication and student completion.');

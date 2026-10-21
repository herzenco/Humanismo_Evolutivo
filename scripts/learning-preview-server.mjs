// Isolated local browser fixture: ephemeral PostgreSQL and test accounts only.
// Never imported by the app. It does not use real credentials or a remote database.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
const db=new PGlite();
await db.exec(await readFile(new URL('../supabase/tests/education-school-fixture.sql',import.meta.url),'utf8'));
for(const file of ['20261020005503_education_qa_school_access.sql','20261021165012_portal_course_progress.sql','20261021212020_teacher_attendance_dashboard.sql'])await db.exec(await readFile(new URL('../supabase/migrations/'+file,import.meta.url),'utf8'));
const schoolId='20000000-0000-4000-8000-000000000001';
await db.query("insert into education_qa_private.schools(id,name,slug) values($1,'Escuela de prueba local','escuela-local')",[schoolId]);
const people=['student','teacher'].map((name,i)=>({id:`10000000-0000-4000-8000-${String(i+1).padStart(12,'0')}`,aud:'authenticated',role:'authenticated',email:`${name}@example.test`,user_metadata:{first_name:i?'Maestro local':'Estudiante'},app_metadata:{},email_confirmed_at:new Date().toISOString(),created_at:new Date().toISOString()}));
for(const [i,user] of people.entries()) {
 await db.query('insert into auth.users(id,email,email_confirmed_at,raw_user_meta_data) values($1,$2,now(),$3)',[user.id,user.email,user.user_metadata]);
 await db.query('insert into education_qa_private.memberships(school_id,user_id,role,display_name,email) values($1,$2,$3,$4,$5)',[schoolId,user.id,i?'teacher':'student',user.user_metadata.first_name,user.email]);
}
function claimsFor(user){return {sub:user.id,email:user.email,aud:'authenticated',role:'authenticated',exp:Math.floor(Date.now()/1000)+86400,iat:Math.floor(Date.now()/1000),is_anonymous:false,user_metadata:user.user_metadata};}
function sessionFor(user){const claims=claimsFor(user);const token=[Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url'),Buffer.from(JSON.stringify(claims)).toString('base64url'),Buffer.from('fixture-signature').toString('base64url')].join('.');return {access_token:token,refresh_token:'fixture-'+user.email,expires_in:86400,expires_at:claims.exp,token_type:'bearer',user};}
function actorFor(req){try {const sub=JSON.parse(Buffer.from(req.headers.authorization.split(' ')[1].split('.')[1],'base64url').toString()).sub;return people.find(p=>p.id===sub);}catch{return undefined;}}
let chain=Promise.resolve();
http.createServer(async(req,res)=>{
 res.setHeader('Access-Control-Allow-Origin','http://localhost:3036');res.setHeader('Access-Control-Allow-Headers','*');
 if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
 const chunks=[];for await(const c of req)chunks.push(c);
 let body;try {body=chunks.length?JSON.parse(Buffer.concat(chunks).toString()):{};}catch{res.writeHead(400);res.end();return;}
 const send=(value,status=200)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(value));};
 const url=new URL(req.url,'http://127.0.0.1:54339');
 if(url.pathname==='/test/session')return send(sessionFor(people.find(p=>p.email===url.searchParams.get('email'))||people[0]));
 if(url.pathname==='/auth/v1/token')return send(sessionFor(people.find(p=>p.email===body.email||body.refresh_token==='fixture-'+p.email)||people[0]));
 const user=actorFor(req);
 if(url.pathname==='/auth/v1/user')return user?send(user):send({message:'Invalid test session'},401);
 if(url.pathname==='/auth/v1/logout')return send({});
 if(url.pathname.startsWith('/rest/v1/rpc/')) {
  if(!user)return send({code:'42501',message:'Authentication required'},401);
  chain=chain.then(async()=>{
   try {
    await db.exec('reset role');await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify(claimsFor(user))]);await db.exec('set role authenticated');
    let result;
    if(url.pathname.endsWith('/portal_learning_access'))result=await db.query('select public.portal_learning_access($1,$2,$3,$4,$5) result',[body.p_action,body.p_course??null,body.p_lesson??null,body.p_reflection??'',body.p_reviewed??false]);
    else if(url.pathname.endsWith('/portal_attendance_access'))result=await db.query('select public.portal_attendance_access($1,$2) result',[body.p_action,body.p_input||{}]);
    else if(url.pathname.endsWith('/education_qa_access'))result=await db.query('select public.education_qa_access($1,$2) result',[body.p_action,body.p_input||{}]);
    else return send({message:'Unknown RPC'},404);
    send(result.rows[0].result);
   }catch(e){send({code:e.code,message:e.message},e.code==='42501'?403:400);}
  });return;
 }
 if(url.pathname.startsWith('/rest/v1/'))return send([]);
 send({message:'Not found'},404);
}).listen(54339,'127.0.0.1',()=>console.log('Isolated learning fixture on 54339: student@example.test / teacher@example.test'));

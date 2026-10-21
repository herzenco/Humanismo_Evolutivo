// Isolated local browser test fixture. Runs real progress SQL in ephemeral PostgreSQL.
// No real credentials or remote database; never imported by the application.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
const db=new PGlite();
await db.exec(await readFile(new URL('../supabase/tests/education-school-fixture.sql',import.meta.url),'utf8'));
await db.exec(await readFile(new URL('../supabase/migrations/20261021165012_portal_course_progress.sql',import.meta.url),'utf8'));
const user={id:'10000000-0000-4000-8000-000000000001',aud:'authenticated',role:'authenticated',email:'student@example.test',user_metadata:{first_name:'Estudiante'},app_metadata:{},email_confirmed_at:new Date().toISOString(),created_at:new Date().toISOString()};
await db.query('insert into auth.users(id,email,email_confirmed_at) values($1,$2,now())',[user.id,user.email]);
const claims={sub:user.id,email:user.email,aud:'authenticated',role:'authenticated',exp:Math.floor(Date.now()/1000)+86400,iat:Math.floor(Date.now()/1000),is_anonymous:false,user_metadata:user.user_metadata};
const token=[Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url'),Buffer.from(JSON.stringify(claims)).toString('base64url'),Buffer.from('fixture-signature').toString('base64url')].join('.');
const session={access_token:token,refresh_token:'fixture-refresh',expires_in:86400,expires_at:claims.exp,token_type:'bearer',user};
let chain=Promise.resolve();
http.createServer(async(req,res)=>{
 res.setHeader('Access-Control-Allow-Origin','http://localhost:3036');
 res.setHeader('Access-Control-Allow-Headers','*');
 if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
 const chunks=[];for await(const c of req)chunks.push(c);
 const body=chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {};
 const send=(value,status=200)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(value));};
 if(req.url==='/test/session')return send(session);
 if(req.url.startsWith('/auth/v1/token'))return send(session);
 if(req.url==='/auth/v1/user')return send(user);
 if(req.url.startsWith('/rest/v1/rpc/portal_learning_access')) {
  chain=chain.then(async()=>{
   try {
    await db.exec('reset role');await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify(claims)]);await db.exec('set role authenticated');
    const result=await db.query('select public.portal_learning_access($1,$2,$3,$4,$5) result',[body.p_action,body.p_course??null,body.p_lesson??null,body.p_reflection??'',body.p_reviewed??false]);send(result.rows[0].result);
   }catch(e){send({code:e.code,message:e.message},e.code==='42501'?403:400);}
  });return;
 }
 if(req.url.startsWith('/rest/v1/'))return send([]);
 send({message:'Not found'},404);
}).listen(54339,'127.0.0.1',()=>console.log('Isolated learning fixture listening on 54339'));

import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { QA_PROJECT_ID, QA_SESSION_SECONDS, createQaSession } from '../src/lib/qa-gate.ts';

// Exercises the optimized build, not a mocked proxy or an isolated password helper.
const password = randomBytes(24).toString('base64url');
const passwordHash = createHash('sha256').update(password).digest('hex');
const secret = randomBytes(48).toString('base64url');
const env = { ...process.env, NEXT_PUBLIC_SUPABASE_URL:'', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'', NEXT_PUBLIC_SUPABASE_ANON_KEY:'', VERCEL_PROJECT_ID:QA_PROJECT_ID, QA_GATE_ENABLED:'',QA_GATE_PASSWORD_HASH:passwordHash,QA_GATE_SECRET:secret };
async function withServer(overrides, port, verify) {
  const child = spawn(process.execPath, ['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{env:{...env,...overrides},stdio:['ignore','pipe','pipe']});
  let logs='';child.stdout.on('data',x=>logs+=x);child.stderr.on('data',x=>logs+=x);
  const base=`http://127.0.0.1:${port}`;
  const request=(path,options={})=>fetch(base+path,{redirect:'manual',signal:AbortSignal.timeout(10000),...options,headers:{Connection:'close',...options.headers}});
  try {
    let ready=false;
    for(let i=0;i<100;i++) {
      if(child.exitCode!==null)throw new Error(`Test server exited: ${logs}`);
      try {await request('/qa-access');ready=true;break;}catch{await delay(100);}
    }
    assert.ok(ready,'Test server did not start');
    await verify(request,base);
  }finally{child.kill('SIGKILL');await new Promise(resolve=>{if(child.exitCode!==null)resolve();else child.once('exit',resolve);});}
}
await withServer({},3169,async(request,base)=>{
  for(const path of ['/','/portal','/51preguntas/pregunta_1','/books/Yo_Soy_Nosotros_Resumen.pdf','/favicon-small.png','/sitemap.xml']) {
    const response=await request(path);assert.equal(response.status,303,path);assert.ok(response.headers.get('location').includes('/qa-access?next='));
  }
  assert.equal((await request('/api/education/access')).status,401);
  assert.equal((await request('/api/qa-media/introduction',{headers:{Range:'bytes=0-1'}})).status,401);
  assert.equal((await request('/_next/static/test.js')).status,401);
  assert.equal((await request('/portal',{headers:{RSC:'1'}})).status,303);
  assert.equal((await request('/',{headers:{Cookie:'__Host-qa-access=forged'}})).status,303);
  const page=await request('/qa-access');assert.equal(page.status,200);assert.match(await page.text(),/Acceso privado/);assert.match(page.headers.get('content-security-policy'),/frame-ancestors 'none'/);assert.equal(page.headers.get('referrer-policy'),'same-origin','Native form POST must retain its same-origin Origin header');
  const post=(body,origin=base)=>request('/qa-access',{method:'POST',headers:{Origin:origin,'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(body)});
  assert.equal((await post({password},'https://evil.test')).status,403);
  assert.equal((await post({password},'null')).status,403);
  assert.equal((await request('/qa-access',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({password})})).status,403);
  const bad=await post({password:'incorrect',next:'/portal'});assert.equal(bad.status,303);assert.ok(bad.headers.get('location').includes('error=invalid'));assert.equal(bad.headers.get('set-cookie'),null);
  const unlocked=await post({password,next:'/'});assert.equal(unlocked.status,303);
  const cookie=unlocked.headers.get('set-cookie');for(const flag of ['HttpOnly','Secure','SameSite=lax','Path=/','Max-Age=2592000'])assert.ok(cookie.toLowerCase().includes(flag.toLowerCase()),flag);assert.equal(cookie.includes(password),false);
  const headers={Cookie:cookie.split(';')[0]};
  const home=await request('/',{headers});assert.equal(home.status,200);assert.match(home.headers.get('cache-control'),/no-store/);assert.match(home.headers.get('x-robots-tag'),/noindex/);
  assert.equal(home.headers.get('set-cookie'),null);
  const legacy=createQaSession(new URL(base).host,{passwordHash,secret},Math.floor(Date.now()/1000)-QA_SESSION_SECONDS+8*3600);
  const remembered=await request('/',{headers:{Cookie:`__Host-qa-access=${legacy}`}});
  assert.equal(remembered.status,200);assert.match(remembered.headers.get('set-cookie'),/Max-Age=2592000/);
  const renewed=remembered.headers.get('set-cookie').split(';')[0];
  assert.equal((await request('/',{headers:{Cookie:renewed}})).status,200);
  const html=await home.text();const asset=html.match(/src="([^" ]*\/_next\/static\/[^" ]+)"/)[1];assert.equal((await request(asset,{headers})).status,200);assert.equal((await request(asset)).status,401);
  assert.equal((await request('/favicon-small.png',{headers})).status,200);
  const logout=await post({logout:'1'});assert.match(logout.headers.get('set-cookie'),/Max-Age=0/);
  const external=await post({password,next:'//evil.test'});assert.equal(new URL(external.headers.get('location')).origin,base);
});
await withServer({QA_GATE_PASSWORD_HASH:'',QA_GATE_SECRET:''},3170,async request=>{assert.equal((await request('/')).status,503);assert.equal((await request('/qa-access')).status,503);});
await withServer({VERCEL_PROJECT_ID:'public-project',QA_GATE_ENABLED:'',QA_GATE_PASSWORD_HASH:'',QA_GATE_SECRET:''},3171,async request=>{assert.equal((await request('/')).status,200);assert.equal((await request('/qa-access')).status,404);});
console.log('Verified: full QA gate, failed/successful unlock, secure cookie, protected files/API/RSC, logout, fail-closed configuration, and unaffected non-QA site.');

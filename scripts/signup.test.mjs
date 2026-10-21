import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { registerAccount } from '../src/lib/register-account.ts';
import { signUpSchema } from '../src/lib/auth.ts';

const registration = signUpSchema.parse({ firstName:' Ana ',lastName:' Pérez ',email:'ANA@EXAMPLE.TEST',password:'QA test password 123!',confirmPassword:'QA test password 123!' });

test('successful school-independent signup reaches Auth with names and a usable confirmation route', async () => {
  let request;
  const supabase = createClient('https://qa.example.test', 'public-test-key', {
    auth: { persistSession:false,autoRefreshToken:false },
    global: { fetch: async (url, options) => {
      request = { url:String(url),body:JSON.parse(options.body) };
      return new Response(JSON.stringify({ id:'10000000-0000-4000-8000-000000000001',email:registration.email,user_metadata:{first_name:'Ana'},aud:'authenticated',created_at:'2026-10-20T12:00:00Z' }),{status:200,headers:{'Content-Type':'application/json'}});
    } },
  });
  const { data,error } = await registerAccount(supabase.auth,registration,'https://qa.example.test','/portal');
  assert.equal(error,null);
  assert.equal(data.user.email,'ana@example.test');
  assert.equal(data.session,null); // Confirmation-enabled projects do not issue a session yet.
  const redirect = new URL(new URL(request.url).searchParams.get('redirect_to'));
  assert.equal(redirect.pathname,'/auth/confirm');
  assert.equal(redirect.searchParams.get('next'),'/portal');
  assert.deepEqual(request.body.data,{first_name:'Ana',last_name:'Pérez',full_name:'Ana Pérez'});
  assert.equal(request.body.email,'ana@example.test');
  assert.equal('school_id' in request.body.data,false);
  assert.equal('role' in request.body.data,false);
});

test('Auth database failures remain failures rather than a false signup confirmation',async()=>{
  const supabase=createClient('https://qa.example.test','public-test-key',{
    auth:{persistSession:false,autoRefreshToken:false},
    global:{fetch:async()=>new Response(JSON.stringify({code:'unexpected_failure',msg:'Database error saving new user'}),{status:500,headers:{'Content-Type':'application/json'}})},
  });
  const {data,error}=await registerAccount(supabase.auth,registration,'https://qa.example.test','/portal');
  assert.equal(data.user,null);
  assert.equal(error.status,500);
});

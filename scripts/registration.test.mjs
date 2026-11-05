import test from 'node:test';
import assert from 'node:assert/strict';
import { registerPortalAccount } from '../src/lib/registration.ts';
import { authErrorMessage } from '../src/lib/auth.ts';
const input={email:'ana@example.test',password:'valid test password',firstName:'Ana',lastName:'Pérez'};
test('successful sign-up creates a session and sends a confirmation callback without role claims',async()=>{
 let received;
 const result=await registerPortalAccount(async credentials=>{received=credentials;return {data:{session:{access_token:'test-only'},user:{identities:[{}]}},error:null};},input,'https://qa.humanismoevolutivo.com','/portal');
 assert.equal(result.hasSession,true);
 assert.equal(received.options.emailRedirectTo,'https://qa.humanismoevolutivo.com/auth/callback?next=%2Fportal');
 assert.deepEqual(received.options.data,{first_name:'Ana',last_name:'Pérez',full_name:'Ana Pérez'});
});
test('confirmation-only sign-up and duplicate account responses are handled',async()=>{
 assert.equal((await registerPortalAccount(async()=>({data:{session:null,user:{identities:[{}]}},error:null}),input,'https://qa.humanismoevolutivo.com','/portal')).hasSession,false);
 await assert.rejects(()=>registerPortalAccount(async()=>({data:{session:null,user:{identities:[]}},error:null}),input,'https://qa.humanismoevolutivo.com','/portal'),/already registered/);
 assert.equal(authErrorMessage({code:'user_already_exists',message:'User already registered'}),'Este correo ya está registrado. Inicia sesión.');
 assert.equal(authErrorMessage({message:'private database detail'}),'No pudimos completar la solicitud. Intenta nuevamente.');
});

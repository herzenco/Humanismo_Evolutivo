// Kept independent of the server action so success and confirmation flows are testable.
type Registration = {email:string;password:string;firstName:string;lastName:string;next?:string};
type SignupResult = {data:{session:unknown;user?:{identities?:unknown[]}|null};error:unknown};
type Signup = (credentials:{email:string;password:string;options:{emailRedirectTo:string;data:Record<string,string>}})=>Promise<SignupResult>;
export async function registerPortalAccount(signUp:Signup, input:Registration, origin:string, next:string) {
 const callback=new URL('/auth/callback',origin);callback.searchParams.set('next',next);
 const result=await signUp({email:input.email,password:input.password,options:{emailRedirectTo:callback.href,data:{first_name:input.firstName,last_name:input.lastName,full_name:`${input.firstName} ${input.lastName}`}}});
 if(result.error) throw result.error;
 if(result.data.user?.identities?.length===0 && !result.data.session) throw new Error('User already registered');
 return {hasSession:Boolean(result.data.session)};
}

import {courseRequestSchema} from '@/lib/courses/contracts';
import {isEducationAccessEnabled} from '@/lib/education/server';
import {educationErrorStatus} from '@/lib/education/contracts';
import {createClient} from '@/lib/supabase/server';
import {isEmailAccountClaims} from '@/lib/auth';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
export async function POST(request:Request){
 if(!isEducationAccessEnabled)return reply({error:'La administración de cursos no está habilitada.'},503);
 if(request.headers.get('origin')!==new URL(request.url).origin)return reply({error:'Solicitud no permitida.'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({error:'Se requiere JSON.'},415);
 const client=await createClient();const {data,error}=await client.auth.getClaims();
 if(error||!isEmailAccountClaims(data?.claims))return reply({error:'Inicia sesión para continuar.'},401);
 const text=await request.text();if(new TextEncoder().encode(text).length>800000)return reply({error:'El contenido es demasiado largo.'},413);
 let body:unknown;try{body=JSON.parse(text);}catch{return reply({error:'Solicitud inválida.'},400);}
 const parsed=courseRequestSchema.safeParse(body);if(!parsed.success)return reply({error:'Revisa los datos del curso y sus lecciones.'},400);
 const result=await client.rpc('portal_course_access',{p_action:parsed.data.action,p_input:parsed.data.input});
 if(result.error)return reply({error:result.error.code==='42501'?'Solo el administrador de plataforma puede gestionar cursos.':'No se pudo guardar. Revisa el identificador y que las lecciones sean consecutivas.'},educationErrorStatus(result.error.code));
 return reply({data:result.data});
}

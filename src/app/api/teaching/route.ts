import {teacherDashboardRequest} from '@/lib/teaching/contracts';
import {isEducationAccessEnabled} from '@/lib/education/server';
import {createClient} from '@/lib/supabase/server';
import {isEmailAccountClaims} from '@/lib/auth';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
export async function POST(request:Request) {
 if(!isEducationAccessEnabled)return reply({error:'El panel docente no está disponible en este entorno.'},503);
 if(request.headers.get('origin')!==new URL(request.url).origin)return reply({error:'Solicitud no permitida.'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({error:'Se requiere JSON.'},415);
 const client=await createClient();const {data,error}=await client.auth.getClaims();
 if(error||!isEmailAccountClaims(data?.claims))return reply({error:'Inicia sesión para continuar.'},401);
 const text=await request.text();if(new TextEncoder().encode(text).length>8192)return reply({error:'Solicitud demasiado grande.'},413);
 let body:unknown;try{body=JSON.parse(text);}catch{return reply({error:'Solicitud inválida.'},400);}
 const parsed=teacherDashboardRequest.safeParse(body);if(!parsed.success)return reply({error:'Revisa la escuela o los filtros.'},400);
 const {schoolId,query,limit,offset}=parsed.data;
 const result=await client.rpc('portal_teacher_dashboard',{p_school:schoolId,p_query:query,p_limit:limit,p_offset:offset});
 if(result.error)return reply({error:result.error.code==='42501'?'No tienes permiso para consultar esta escuela.':'No se pudo cargar el avance de los estudiantes. Inténtalo de nuevo.'},result.error.code==='42501'?403:503);
 return reply({data:result.data});
}

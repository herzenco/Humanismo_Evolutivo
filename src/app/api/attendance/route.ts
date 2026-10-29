import { attendanceRequestSchema } from '@/lib/attendance/contracts';
import { attendanceAccess } from '@/lib/attendance/server';
import { isEducationAccessEnabled } from '@/lib/education/server';
import { isEmailAccountClaims } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
const reply = (body: unknown, status=200) => Response.json(body, {status, headers:{'Cache-Control':'private, no-store'}});
export async function POST(request: Request) {
 if (!isEducationAccessEnabled) return reply({error:'La asistencia no está disponible en este entorno.'},503);
 if (request.headers.get('origin') !== new URL(request.url).origin) return reply({error:'Solicitud no permitida.'},403);
 if (!request.headers.get('content-type')?.startsWith('application/json')) return reply({error:'Se requiere JSON.'},415);
 const client=await createClient();
 const {data,error}=await client.auth.getClaims();
 if (error || !isEmailAccountClaims(data?.claims)) return reply({error:'Inicia sesión para continuar.'},401);
 const text=await request.text();
 if(new TextEncoder().encode(text).length>8192) return reply({error:'Solicitud demasiado grande.'},413);
 let body:unknown;
 try {body=JSON.parse(text);} catch {return reply({error:'Solicitud inválida.'},400);}
 const parsed=attendanceRequestSchema.safeParse(body);
 if(!parsed.success) return reply({error:'Revisa los datos de asistencia.'},400);
 const result=await attendanceAccess(parsed.data.action,parsed.data.input);
 if(result.error) return reply({error:result.error.code==='42501' ? 'No tienes permiso para gestionar esta asistencia.' : 'No se pudo consultar o guardar la asistencia. Inténtalo de nuevo.'},result.error.code==='42501' ? 403 : 503);
 return reply({data:result.data});
}

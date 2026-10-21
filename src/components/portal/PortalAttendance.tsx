'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { EducationContext } from '@/lib/education/contracts';
import type { AttendanceRequest, AttendanceStudent } from '@/lib/attendance/contracts';
import { portalClasses } from '@/data/portal';
import { scheduleDate, scheduleTime } from '@/lib/portal-schedule';
async function access<T>(request:AttendanceRequest,signal?:AbortSignal):Promise<T> {
 const response=await fetch('/api/attendance',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(request),signal,cache:'no-store'});
 const result=await response.json();
 if(!response.ok) throw new Error(result.error || 'No se pudo consultar la asistencia.');
 return result.data;
}
export default function PortalAttendance({context}:{context:EducationContext}) {
 const params=useSearchParams();
 const teaching=context.memberships.filter(m=>m.role==='teacher'&&m.status==='active'&&m.schoolStatus==='active');
 const [schools,setSchools]=useState(teaching.map(m=>({id:m.schoolId,name:m.schoolName})));
 const [schoolId,setSchoolId]=useState(teaching.find(m=>m.schoolId===params.get('school'))?.schoolId || teaching[0]?.schoolId || '');
 const [sessionId,setSessionId]=useState(portalClasses[0]?.id || '');
 const [students,setStudents]=useState<AttendanceStudent[]>([]);
 const [offset,setOffset]=useState(0);
 const [revision,setRevision]=useState(0);
 const [loading,setLoading]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const [message,setMessage]=useState('');
 useEffect(()=>{
  if(!context.isPlatformAdmin) return;
  const controller=new AbortController();
  fetch('/api/education/access',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'schools.list',input:{limit:100,offset:0}}),signal:controller.signal}).then(async r=>{const result=await r.json();if(!r.ok)throw new Error(result.error);return result.data;}).then((rows:{id:string;name:string;status:string}[])=>{const active=rows.filter(s=>s.status==='active');setSchools(active);setSchoolId(id=>id || active[0]?.id || '');}).catch(e=>{if(!controller.signal.aborted)setError(e.message);});
  return ()=>controller.abort();
 },[context.isPlatformAdmin]);
 useEffect(()=>{
  if(!schoolId || !sessionId) return;
  const controller=new AbortController();
  setLoading(true);setError('');setStudents([]);
  access<AttendanceStudent[]>({action:'roster',input:{schoolId,sessionId,limit:50,offset}},controller.signal).then(setStudents).catch(e=>{if(!controller.signal.aborted)setError(e.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
  return ()=>controller.abort();
 },[schoolId,sessionId,offset,revision]);
 async function mark(student:AttendanceStudent,status:'present'|'absent') {
  setBusy(true);setError('');setMessage('');
  try {await access({action:'mark',input:{schoolId,sessionId,userId:student.userId,status}});setMessage(`${student.displayName || student.email || 'Estudiante'}: ${status==='present' ? 'asistencia' : 'ausencia'} guardada.`);setRevision(n=>n+1);} catch(e){setError(e instanceof Error ? e.message : 'No se pudo guardar.');}finally{setBusy(false);}
 }
 return <section className="portal-attendance-manager"><p>Registra la asistencia presencial de tus estudiantes. Completar lecciones en línea no marca asistencia y pasar lista no modifica el avance en línea.</p><div className="portal-schedule-filters"><label className="portal-schedule-select">Escuela<select disabled={busy} value={schoolId} onChange={e=>{setSchoolId(e.target.value);setOffset(0);setMessage('');}}>{schools.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label className="portal-schedule-select">Sesión presencial<select disabled={busy} value={sessionId} onChange={e=>{setSessionId(e.target.value);setOffset(0);setMessage('');}}>{portalClasses.map(s=><option key={s.id} value={s.id}>{s.title} · {scheduleDate(s)} · {scheduleTime(s)}</option>)}</select></label></div>
 {loading ? <p role="status">Cargando lista…</p> : schoolId ? <div className="portal-school-table"><table><caption>Lista de asistencia presencial</caption><thead><tr><th>Estudiante</th><th>Estado</th><th>Registrar asistencia</th></tr></thead><tbody>{students.map(student=><tr key={student.userId}><td>{student.displayName || 'Estudiante'}<small>{student.email}</small></td><td>{student.status==='present' ? 'Presente' : student.status==='absent' ? 'Ausente' : 'Sin registrar'}</td><td><div className="portal-attendance-buttons"><button type="button" disabled={busy} aria-pressed={student.status==='present'} aria-label={`Presente: ${student.displayName || student.email || 'Estudiante'}`} onClick={()=>mark(student,'present')}>Presente</button><button type="button" disabled={busy} aria-pressed={student.status==='absent'} aria-label={`Ausente: ${student.displayName || student.email || 'Estudiante'}`} onClick={()=>mark(student,'absent')}>Ausente</button></div></td></tr>)}</tbody></table>{!students.length ? <p>No hay estudiantes activos en esta página.</p> : null}</div> : <p>No tienes escuelas disponibles para pasar lista.</p>}
 <div className="portal-school-pagination"><button type="button" disabled={offset===0||loading||busy} onClick={()=>setOffset(n=>Math.max(0,n-50))}>Anterior</button><button type="button" disabled={students.length<50||loading||busy} onClick={()=>setOffset(n=>n+50)}>Siguiente</button></div>{message ? <p role="status">{message}</p> : null}{error ? <p role="alert">{error}</p> : null}</section>;
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { EducationContext, EducationRequest } from '@/lib/education/contracts';

type School = { id: string; name: string; status: string };
type Student = { user_id: string; role: string; status: string; display_name: string | null; email: string | null; openings: number; completed_classes: number };
type Activity = { event_id: string; class_id: string; kind: 'opened' | 'completed'; occurred_at: string };
type Invitation = { id: string; school_id: string; school_name: string; expires_at: string };
async function access<T>(request: EducationRequest, signal?: AbortSignal): Promise<T> {
  const response = await fetch('/api/education/access', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request), cache: 'no-store', signal });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'No se pudo consultar la información.');
  return result.data as T;
}

export default function PortalSchools({ context }: { context: EducationContext }) {
  const router = useRouter();
  const teaching = context.memberships.filter(m => m.role === 'teacher' && m.status === 'active' && m.schoolStatus === 'active');
  const [schools, setSchools] = useState<School[]>(teaching.map(m => ({ id: m.schoolId, name: m.schoolName, status: 'active' })));
  const [schoolId, setSchoolId] = useState(teaching[0]?.schoolId || '');
  const [roster, setRoster] = useState<Student[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [activity, setActivity] = useState<Activity[] | null>(null);
  const [studentName, setStudentName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [revision,setRevision] = useState(0);
  const [pageFull, setPageFull] = useState(false);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    access<Invitation[]>({ action: 'invitations.mine', input: { limit: 100, offset: 0 } },controller.signal).then(setInvitations).catch(e => { if (!controller.signal.aborted) setError(e.message); });
    if (context.isPlatformAdmin) access<School[]>({ action: 'schools.list', input: { limit: 100, offset: 0 } },controller.signal).then(rows => { setSchools(rows); setSchoolId(id => id || rows[0]?.id || ''); }).catch(e => { if (!controller.signal.aborted) setError(e.message); });
    return () => controller.abort();
  },[context.isPlatformAdmin]);
  useEffect(() => {
    if (!schoolId) return;
    const controller = new AbortController();
    setLoading(true);setError('');setActivity(null);
    access<Student[]>({ action: 'roster', input: { schoolId, limit: 50, offset } },controller.signal).then(rows => { setRoster(rows);setPageFull(rows.length === 50); }).catch(e => { if (!controller.signal.aborted) { setRoster([]);setError(e.message); } }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  },[schoolId,offset,revision]);
  async function accept(invitationId: string) {
    setBusy(true);setError('');
    try { await access({ action: 'invitations.accept', input: { invitationId } });setInvitations(items => items.filter(item => item.id !== invitationId));setMessage('Te uniste a la escuela. Conservas tu membresía en Amigos que Evolucionan.');router.refresh(); } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo aceptar la invitación.'); } finally { setBusy(false); }
  }
  async function invite(event: React.FormEvent) {
    event.preventDefault();setBusy(true);setError('');setMessage('');
    try { await access({ action: 'invitations.create', input: { schoolId,email } });setEmail('');setMessage('Invitación creada. El estudiante la verá en Mis escuelas al iniciar sesión con ese correo.'); } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo crear la invitación.'); } finally { setBusy(false); }
  }
  async function changeStudent(student: Student, status: 'active' | 'suspended' | 'removed') {
    setBusy(true);setError('');
    try { await access({ action: 'memberships.set', input: { schoolId,userId:student.user_id,role:'student',status } });setRevision(value=>value+1);setMessage('Membresía actualizada. El historial escolar se conserva.'); } catch(e) { setError(e instanceof Error ? e.message : 'No se pudo actualizar la membresía.'); } finally { setBusy(false); }
  }
  async function leave(schoolId: string) {
    setBusy(true);setError('');
    try { await access({ action: 'memberships.leave', input: { schoolId } });setMessage('Dejaste la escuela. La escuela conserva su historial; tus otras membresías continúan activas.');router.refresh(); } catch(e) { setError(e instanceof Error ? e.message : 'No se pudo actualizar la membresía.'); } finally { setBusy(false); }
  }
  async function history(student: Student) {
    setError('');setBusy(true);setActivity(null);
    try { const rows = await access<Activity[]>({ action: 'activity.list', input: { schoolId, userId: student.user_id, limit:100,offset:0 } });setStudentName(student.display_name || student.email || 'Estudiante');setActivity(rows); } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo consultar la actividad.'); } finally { setBusy(false); }
  }
  return <section className="portal-school-space">
    <div className="portal-section-heading"><h2>Mis escuelas</h2></div><p>Puedes aprender en Amigos que Evolucionan y en otras escuelas al mismo tiempo.</p>
    <div className="portal-content-grid">{context.memberships.filter(m=>m.role==='student').map(m=><article className="portal-content-card" key={`${m.schoolId}-${m.role}`}><div><span className="design-eyebrow">{m.isCommunity ? 'COMUNIDAD' : 'ESCUELA'}</span><h3>{m.schoolName}</h3><p>{m.status === 'active' && m.schoolStatus === 'active' ? 'Membresía activa' : 'Membresía inactiva'}</p>{!m.isCommunity && m.status==='active' ? <><p>Si dejas esta escuela, conserva su historial de actividad escolar.</p><button type="button" className="design-text-link" disabled={busy} onClick={()=>leave(m.schoolId)}>Dejar esta escuela</button></> : null}</div></article>)}</div>
    {invitations.length ? <section><h2>Invitaciones pendientes</h2>{invitations.map(invite=><article className="portal-school-invitation" key={invite.id}><h3>{invite.school_name}</h3><p>Al aceptar, te unes como estudiante. La escuela podrá consultar la actividad y finalización asociadas a esa escuela; los registros escolares se conservan cuando dejas de pertenecer a ella. Tus respuestas y tu diario siguen siendo privados.</p><button type="button" className="design-button" disabled={busy} onClick={()=>accept(invite.id)}>Aceptar invitación</button></article>)}</section> : null}
    {context.isPlatformAdmin || teaching.length ? <section className="portal-school-report"><h2>Estudiantes y actividad escolar</h2><p>Cada escuela consulta únicamente su propia actividad y conserva su historial. Aquí no se muestran respuestas escritas ni diarios.</p><label>Escuela<select value={schoolId} onChange={event=>{setOffset(0);setSchoolId(event.target.value);}}>{schools.map(s=><option key={s.id} value={s.id}>{s.name}{s.status === 'archived' ? ' (archivada)' : ''}</option>)}</select></label>
      {schoolId ? <><form onSubmit={invite} className="portal-school-invite-form"><label>Invitar estudiante por correo<input type="email" value={email} onChange={event=>setEmail(event.target.value)} required maxLength={254} placeholder="estudiante@escuela.edu" /></label><button className="design-button" type="submit" disabled={busy}>Crear invitación</button></form>
      {loading ? <p role="status">Cargando estudiantes…</p> : <div className="portal-school-table"><table><caption className="sr-only">Estudiantes e historial de la escuela seleccionada</caption><thead><tr><th>Persona</th><th>Estado</th><th>Aperturas</th><th>Clases completadas</th><th>Actividad</th><th>Membresía</th></tr></thead><tbody>{roster.map(student=><tr key={`${student.user_id}-${student.role}`}><td>{student.display_name || 'Estudiante'}<small>{student.email}</small><small>{student.role === 'teacher' ? 'Docente' : 'Estudiante'}</small></td><td>{student.status === 'active' ? 'Activo' : student.status === 'removed' ? 'Anterior' : 'Suspendido'}</td><td>{student.openings}</td><td>{student.completed_classes}</td><td><button type="button" disabled={busy} onClick={()=>history(student)}>Ver actividad</button></td><td>{student.role==='student' && schoolId!==context.defaultSchoolId ? <div className="portal-member-actions">{student.status==='removed' ? <button type="button" disabled={busy} onClick={()=>{setEmail(student.email || '');setMessage('Crea una nueva invitación para que el estudiante decida si quiere volver.');}}>Invitar de nuevo</button> : student.status==='active' ? <button type="button" disabled={busy} onClick={()=>changeStudent(student,'suspended')}>Suspender</button> : <button type="button" disabled={busy} onClick={()=>changeStudent(student,'active')}>Reactivar</button>}{student.status!=='removed' ? <button type="button" disabled={busy} onClick={()=>changeStudent(student,'removed')}>Retirar de la escuela</button> : null}</div> : null}</td></tr>)}</tbody></table>{!roster.length ? <p>No hay estudiantes en esta página.</p> : null}</div>}
      <div className="portal-school-pagination"><button type="button" disabled={offset===0||loading} onClick={()=>setOffset(value=>Math.max(0,value-50))}>Anterior</button><button type="button" disabled={!pageFull||loading} onClick={()=>setOffset(value=>value+50)}>Siguiente</button></div></> : <p>No hay escuelas disponibles.</p>}
      {activity ? <section aria-live="polite"><h3>Actividad de {studentName}</h3>{activity.length ? <ul>{activity.map(event=><li key={event.event_id}>{event.kind==='opened' ? 'Abrió' : 'Completó'} · {event.class_id} · <time dateTime={event.occurred_at}>{new Date(event.occurred_at).toLocaleString('es-MX')}</time></li>)}</ul> : <p>No hay actividad asociada a esta escuela.</p>}{activity.length===100 ? <p>Se muestran las 100 actividades más recientes.</p> : null}</section> : null}
    </section> : null}
    {message ? <p role="status">{message}</p> : null}{error ? <p role="alert">{error}</p> : null}
  </section>;
}

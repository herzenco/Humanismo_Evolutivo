'use client';

import { useState, type Dispatch, type SetStateAction } from 'react';
import type { PortalRole } from '@/lib/portal-role';

type Person = { id: string; name: string; email: string };
type School = { id: string; name: string; active: boolean; community?: boolean };
type Membership = { person: string; school: string; role: 'student' | 'teacher'; status: 'active' | 'suspended' | 'removed' };
type Activity = { id: string; school: string; person: string; title: string; completed: boolean };
export type DemoEducation = { schools: School[]; people: Person[]; memberships: Membership[]; activity: Activity[]; invitations: {id:string;email:string;school:string;accepted:boolean}[]; audit: string[] };
export function createDemoEducation(): DemoEducation {
  return {
    schools:[{id:'demo-community',name:'Amigos que Evolucionan',active:true,community:true},{id:'demo-norte',name:'Escuela Ejemplo Norte',active:true},{id:'demo-sur',name:'Escuela Ejemplo Sur',active:true}],
    people:[{id:'demo-teacher-1',name:'Maestro de ejemplo 1',email:'maestro1@example.test'},{id:'demo-teacher-2',name:'Maestro de ejemplo 2',email:'maestro2@example.test'},{id:'demo-student-1',name:'Estudiante de ejemplo 1',email:'estudiante1@example.test'},{id:'demo-student-2',name:'Estudiante de ejemplo 2',email:'estudiante2@example.test'},{id:'demo-student-3',name:'Estudiante de ejemplo 3',email:'estudiante3@example.test'}],
    memberships:[{person:'demo-teacher-1',school:'demo-norte',role:'teacher',status:'active'},{person:'demo-teacher-2',school:'demo-sur',role:'teacher',status:'active'},...['1','2','3'].map(id=>({person:`demo-student-${id}`,school:'demo-community',role:'student' as const,status:'active' as const})),{person:'demo-student-1',school:'demo-norte',role:'student',status:'active'},{person:'demo-student-2',school:'demo-norte',role:'student',status:'active'},{person:'demo-student-3',school:'demo-sur',role:'student',status:'active'}],
    activity:[{id:'demo-a1',school:'demo-norte',person:'demo-student-1',title:'Identidad y Civismo',completed:true},{id:'demo-a2',school:'demo-norte',person:'demo-student-1',title:'Ecología y Espiritualidad',completed:false},{id:'demo-a3',school:'demo-norte',person:'demo-student-2',title:'Humanismo Evolutivo Transpersonal',completed:true},{id:'demo-a4',school:'demo-sur',person:'demo-student-3',title:'Filosofía para Niños',completed:true}], invitations:[],audit:[],
  };
}

export default function PortalRolePreview({role,data,setData}:{role:Exclude<PortalRole,'student'>;data:DemoEducation;setData:Dispatch<SetStateAction<DemoEducation>>}) {
  const [email,setEmail]=useState('');
  const [schoolName,setSchoolName]=useState('');
  const [teacherName,setTeacherName]=useState('');
  const [teacherSchool,setTeacherSchool]=useState('demo-norte');
  const [studentId,setStudentId]=useState('demo-student-1');
  const [studentSchool,setStudentSchool]=useState('demo-sur');
  const [selectedStudent,setSelectedStudent]=useState<string>();
  const [message,setMessage]=useState('');
  const admin=role==='admin';
  const school=data.schools.find(s=>s.id==='demo-norte');
  const teacherActive=school?.active && data.memberships.some(m=>m.person==='demo-teacher-1'&&m.school==='demo-norte'&&m.role==='teacher'&&m.status==='active');
  const visibleMemberships=data.memberships.filter(m=>m.role==='student'&&(admin||m.school==='demo-norte'));
  const students=data.people.filter(p=>data.memberships.some(m=>m.person===p.id&&m.role==='student'));
  const people=admin?students:data.people.filter(p=>visibleMemberships.some(m=>m.person===p.id));
  const visibleActivity=data.activity.filter(a=>(admin||a.school==='demo-norte')&&(!selectedStudent||a.person===selectedStudent));
  const name=(id:string)=>data.people.find(p=>p.id===id)?.name||id;
  const schoolLabel=(id:string)=>data.schools.find(s=>s.id===id)?.name||id;
  function status(person:string,school:string,next:Membership['status']) {
    if(!admin&&(!teacherActive||school!=='demo-norte'))return;
    setData(old=>({...old,memberships:old.memberships.map(m=>m.person===person&&m.school===school&&m.role==='student'?{...m,status:next}:m),audit:[`${next==='active'?'Reactivación':next==='removed'?'Retiro':'Suspensión'} de ${name(person)} · ${schoolLabel(school)}`,...old.audit]}));setMessage('Membresía de ejemplo actualizada. El historial de la escuela se conserva.');
  }
  function invite(event:React.FormEvent) {
    event.preventDefault();if(!teacherActive&&!admin)return;
    const school='demo-norte';const address=email.trim().toLowerCase();
    setData(old=>({...old,invitations:[...old.invitations,{id:crypto.randomUUID(),email:address,school,accepted:false}],audit:[`Invitación de estudiante · ${schoolLabel(school)}`,...old.audit]}));setEmail('');setMessage('Invitación de ejemplo creada. En el portal real, el estudiante debe aceptarla desde su cuenta.');
  }
  function acceptDemo(invitationId:string) {
    const invitation=data.invitations.find(i=>i.id===invitationId);if(!invitation)return;
    const existing=data.people.find(p=>p.email===invitation.email);const id=existing?.id||`demo-${crypto.randomUUID()}`;
    setData(old=>({...old,people:existing?old.people:[...old.people,{id,name:'Estudiante invitado de ejemplo',email:invitation.email}],invitations:old.invitations.map(i=>i.id===invitationId?{...i,accepted:true}:i),memberships:[...old.memberships.filter(m=>!(m.person===id&&m.school===invitation.school&&m.role==='student')),{person:id,school:invitation.school,role:'student',status:'active'},...(!old.memberships.some(m=>m.person===id&&m.school==='demo-community'&&m.role==='student')?[{person:id,school:'demo-community',role:'student' as const,status:'active' as const}]:[])],audit:['Aceptación de invitación de ejemplo',...old.audit]}));setMessage('Aceptación simulada: se conserva la comunidad y se añade la escuela.');
  }
  function addSchool(event:React.FormEvent) {
    event.preventDefault();if(!admin)return;const name=schoolName.trim();if(!name)return;
    setData(old=>({...old,schools:[...old.schools,{id:`demo-${crypto.randomUUID()}`,name,active:true}],audit:[`Creación de escuela: ${name}`,...old.audit]}));setSchoolName('');setMessage('Escuela de ejemplo creada.');
  }
  function assignTeacher(event:React.FormEvent) {
    event.preventDefault();if(!admin||!teacherName.trim())return;const id=`demo-${crypto.randomUUID()}`;
    setData(old=>({...old,people:[...old.people,{id,name:teacherName.trim(),email:'docente@example.test'}],memberships:[...old.memberships,{person:id,school:teacherSchool,role:'teacher',status:'active'}],audit:[`Asignación de docente · ${schoolLabel(teacherSchool)}`,...old.audit]}));setTeacherName('');setMessage('Docente de ejemplo asignado a una escuela.');
  }
  function assignStudent(event:React.FormEvent) {
    event.preventDefault();if(!admin)return;
    setData(old=>({...old,memberships:[...old.memberships.filter(m=>!(m.person===studentId&&m.school===studentSchool&&m.role==='student')),{person:studentId,school:studentSchool,role:'student',status:'active'}],audit:[`Asignación de estudiante · ${schoolLabel(studentSchool)}`,...old.audit]}));setMessage('Asignación de ejemplo guardada. Las otras escuelas y la comunidad se conservan.');
  }
  return <section className="portal-school-space portal-demo-space">
    <aside className="portal-demo-notice"><strong>Demostración para la revisión de roles</strong><p>Todos los nombres y registros de este panel son ficticios. Los cambios se guardan solo durante esta visita y no modifican cuentas ni permisos reales.</p></aside>
    <div className="portal-section-heading"><h2>{admin?'Administración de la plataforma':school?.name}</h2><span>{admin?'Todas las escuelas':'Escuela del maestro'}</span></div>
    <p>{admin?'Gestiona escuelas, maestros y estudiantes, y consulta la actividad escolar de toda la plataforma.':'Gestiona los estudiantes de tu escuela y consulta únicamente la actividad asociada a ella, incluido su historial.'} Las respuestas escritas y los diarios permanecen privados.</p>
    {admin?<><form className="portal-demo-form" onSubmit={addSchool}><label>Nueva escuela<input value={schoolName} onChange={e=>setSchoolName(e.target.value)} maxLength={160} required placeholder="Nombre de la escuela de ejemplo"/></label><button className="design-button" type="submit">Crear escuela</button></form>
      <div className="portal-content-grid">{data.schools.map(s=><article className="portal-content-card" key={s.id}><div><span className="design-eyebrow">{s.community?'COMUNIDAD':'ESCUELA'}</span><h3>{s.name}</h3><p>{s.active?'Activa':'Archivada'} · {data.memberships.filter(m=>m.school===s.id&&m.role==='student'&&m.status==='active').length} estudiantes</p>{!s.community?<button type="button" className="design-text-link" onClick={()=>{setData(old=>({...old,schools:old.schools.map(row=>row.id===s.id?{...row,active:!row.active}:row),audit:[`${s.active?'Archivo':'Reactivación'} de ${s.name}`,...old.audit]}));setMessage('Estado de la escuela de ejemplo actualizado.');}}>{s.active?'Archivar escuela':'Reactivar escuela'}</button>:null}</div></article>)}</div>
      <section><h2>Maestros de todas las escuelas</h2><form className="portal-demo-form" onSubmit={assignTeacher}><label>Nombre del nuevo maestro<input value={teacherName} onChange={e=>setTeacherName(e.target.value)} required maxLength={100}/></label><label>Escuela del maestro<select value={teacherSchool} onChange={e=>setTeacherSchool(e.target.value)}>{data.schools.filter(s=>s.active).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><button type="submit" className="design-button">Asignar maestro</button></form><p>Cada maestro tiene una sola escuela activa.</p><ul className="portal-demo-teachers">{data.memberships.filter(m=>m.role==='teacher').map(m=><li key={`${m.person}-${m.school}`}><span>{name(m.person)} · {schoolLabel(m.school)} · {m.status==='active'?'Activo':'Retirado'}</span>{m.status==='active'?<button type="button" onClick={()=>setData(old=>({...old,memberships:old.memberships.map(row=>row.person===m.person&&row.school===m.school&&row.role==='teacher'?{...row,status:'removed'}:row),audit:[`Retiro de maestro · ${schoolLabel(m.school)}`,...old.audit]}))}>Retirar maestro</button>:null}</li>)}</ul></section>
      <form className="portal-demo-form" onSubmit={assignStudent}><label>Estudiante<select value={studentId} onChange={e=>setStudentId(e.target.value)}>{students.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label>Escuela adicional<select value={studentSchool} onChange={e=>setStudentSchool(e.target.value)}>{data.schools.filter(s=>s.active).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><button type="submit" className="design-button">Asignar estudiante</button></form></>:null}
    {admin||teacherActive?<><section><h2>{admin?'Estudiantes de toda la plataforma':'Estudiantes de mi escuela'}</h2><div className="portal-school-table"><table><thead><tr><th>Estudiante</th><th>Escuela / membresía</th><th>Clases completadas</th><th>Acciones</th></tr></thead><tbody>{people.map(p=><tr key={p.id}><td>{p.name}<small>{p.email}</small></td><td>{visibleMemberships.filter(m=>m.person===p.id).map(m=><div key={m.school}>{schoolLabel(m.school)} · {m.status==='active'?'Activo':m.status==='removed'?'Anterior':'Suspendido'}</div>)}</td><td>{data.activity.filter(a=>a.person===p.id&&a.completed&&(admin||a.school==='demo-norte')).length}</td><td><div className="portal-member-actions"><button type="button" onClick={()=>setSelectedStudent(p.id)}>Ver actividad</button>{visibleMemberships.filter(m=>m.person===p.id&&m.school!=='demo-community').map(m=><div key={m.school}>{m.status==='removed'?admin?<span>Asignar de nuevo desde el formulario de escuelas</span>:<button type="button" onClick={()=>{setEmail(p.email);setMessage('Crea una nueva invitación para que el estudiante acepte volver.');}}>Invitar de nuevo</button>:<><button type="button" onClick={()=>status(p.id,m.school,m.status==='active'?'suspended':'active')}>{m.status==='active'?'Suspender':'Reactivar'}</button><button type="button" onClick={()=>status(p.id,m.school,'removed')}>Retirar estudiante</button></>}</div>)}</div></td></tr>)}</tbody></table></div></section>
    {!admin?<><form className="portal-demo-form" onSubmit={invite}><label>Invitar estudiante por correo<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="estudiante@example.test"/></label><button type="submit" className="design-button">Crear invitación</button></form>{data.invitations.filter(i=>i.school==='demo-norte').map(i=><div className="portal-school-invitation" key={i.id}><p>{i.email} · {i.accepted?'Aceptada':'Pendiente'}</p>{!i.accepted?<button type="button" onClick={()=>acceptDemo(i.id)}>Simular aceptación del estudiante</button>:null}</div>)}</>:null}
    <section aria-live="polite"><h2>Actividad {selectedStudent?`de ${name(selectedStudent)}`:'escolar'}</h2>{selectedStudent?<button type="button" className="design-text-link" onClick={()=>setSelectedStudent(undefined)}>Ver toda la actividad permitida</button>:null}<ul className="portal-demo-activity">{visibleActivity.map(a=><li key={a.id}><span>{name(a.person)}</span><strong>{a.title}</strong><span>{a.completed?'Completada':'En progreso'} · {schoolLabel(a.school)}</span></li>)}</ul>{!visibleActivity.length?<p>No hay actividad escolar de ejemplo.</p>:null}</section></>:<p>La escuela o la asignación del maestro está inactiva. Solo el administrador puede reactivarla.</p>}
    {admin?<section><h2>Registro de administración</h2>{data.audit.length?<ul>{data.audit.map((entry,i)=><li key={i}>{entry}</li>)}</ul>:<p>Las acciones de esta demostración aparecerán aquí.</p>}</section>:null}
    {message?<p role="status">{message}</p>:null}
  </section>;
}

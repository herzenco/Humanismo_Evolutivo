'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {educationRequest} from '@/lib/education/client';
import type {EducationContext} from '@/lib/education/contracts';
type Invitation={id:string;school_name:string;role:'student'|'teacher'|'school_admin';expires_at:string};
const names={student:'estudiante',teacher:'maestro',school_admin:'administrador escolar y maestro'};
export default function PortalSchools({context}:{context:EducationContext}){
 const router=useRouter();const [invitations,setInvitations]=useState<Invitation[]>([]),[offset,setOffset]=useState(0),[revision,setRevision]=useState(0),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{const c=new AbortController();educationRequest<Invitation[]>({action:'invitations.mine',input:{limit:50,offset}},c.signal).then(setInvitations).catch(e=>{if(!c.signal.aborted)setError(e.message);});return()=>c.abort();},[offset,revision]);
 const schools=[...new Map(context.memberships.filter(m=>m.status==='active'&&m.schoolStatus==='active').map(m=>[m.schoolId,m])).values()];
 async function accept(invitationId:string){setBusy(true);setError('');try{await educationRequest({action:'invitations.accept',input:{invitationId}});setRevision(n=>n+1);router.refresh();}catch(e){setError(e instanceof Error?e.message:'No se pudo aceptar.');}finally{setBusy(false);}}
 return <section><h2>Mis escuelas e invitaciones</h2><p>Tu cuenta y tu progreso te acompañan entre escuelas. Siempre formas parte de Amigos que evolucionan.</p><div className="portal-content-grid">{schools.map(s=><article className="portal-content-card" key={s.schoolId}><div><span className="design-eyebrow">{s.isCommunity?'COMUNIDAD':'ESCUELA'}</span><h3>{s.schoolName}</h3><p>Membresía activa</p>{!s.isCommunity?<p>Para cambios en tu membresía, contacta al maestro o al administrador escolar.</p>:null}</div></article>)}</div><h3>Invitaciones pendientes</h3>{invitations.map(i=><article className="portal-school-invitation" key={i.id}><h4>{i.school_name}</h4><p>Te invitaron como {names[i.role]}. Al aceptar conservarás tu cuenta, contraseña y progreso.</p><button className="design-button" disabled={busy} onClick={()=>accept(i.id)}>Aceptar invitación</button></article>)}{!invitations.length?<p>No tienes invitaciones pendientes en esta página.</p>:null}<div className="portal-school-pagination"><button disabled={!offset||busy} onClick={()=>setOffset(n=>Math.max(0,n-50))}>Anterior</button><button disabled={invitations.length<50||busy} onClick={()=>setOffset(n=>n+50)}>Siguiente</button></div>{error?<p role="alert">{error}</p>:null}</section>;
}

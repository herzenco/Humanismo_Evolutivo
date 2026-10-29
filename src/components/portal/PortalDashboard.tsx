'use client';
import {useState} from 'react';
import Link from 'next/link';
import {useRouter,useSearchParams} from 'next/navigation';
import dynamic from 'next/dynamic';
import {activeTeachingSchool} from '@/lib/teaching/role';
import StudentDashboard from './StudentDashboard';
import PortalAttendance from './PortalAttendance';
import type {AttendanceSummary} from '@/lib/attendance/contracts';
import CourseCatalog from './CourseCatalog';
import PortalCalendar from './PortalCalendar';
import {portalClasses} from '@/data/portal';
import type {EducationContext} from '@/lib/education/contracts';
import type {LearningCourse} from '@/lib/courses/contracts';
import PortalSchools from './PortalSchools';
import PortalAdministration from './PortalAdministration';
import {availablePortalRoles,selectedPortalRole,portalRoleSuffix,roleLabels,type PortalRole} from '@/lib/portal-role';
import type {ResourceArticle} from '@/data/resources';
import {ArrowLeft,CalendarCheck2,LayoutDashboard,CalendarDays,GraduationCap,Leaf,Library,LogOut,Menu,X} from 'lucide-react';
const PortalLibrary=dynamic(()=>import('./PortalLibrary'),{loading:()=> <p role="status">Cargando biblioteca…</p>});
type View='dashboard'|'attendance'|'courses'|'library'|'calendar'|'school';
type Props={firstName:string;email?:string;articles:ResourceArticle[];educationContext?:EducationContext|null;rolePreviewEnabled?:boolean;courseWorkspace?:React.ReactNode;studentProgress?:Record<string,number>|null;attendance?:AttendanceSummary|null;courses?:LearningCourse[]};
export default function PortalDashboard({firstName,email,articles,educationContext,courseWorkspace,studentProgress=null,attendance=null,courses=[]}:Props){
 const params=useSearchParams(),router=useRouter();const [menu,setMenu]=useState(false);
 const roles=availablePortalRoles(educationContext),role=selectedPortalRole(educationContext,params.get('role')||(courseWorkspace?'student':null));
 const teachingSchool=activeTeachingSchool(educationContext);
 const schoolAdmin=educationContext?.memberships.find(m=>m.role==='school_admin'&&m.status==='active'&&m.schoolStatus==='active');
 const roleSuffix=portalRoleSuffix(role),isTeacher=role==='teacher',isAdmin=role==='admin'||role==='school_admin';
 const canManageAttendance=Boolean(role!=='student'&&(educationContext?.isPlatformAdmin||educationContext?.memberships.some(m=>m.role==='teacher'&&m.isCommunity&&m.status==='active'&&m.schoolStatus==='active')));
 const selected=params.get('view');
 const view:View=selected==='courses'||selected==='library'||selected==='calendar'||selected==='school'||(selected==='attendance'&&canManageAttendance)?selected:courseWorkspace?'courses':'dashboard';
 const home=role==='admin'?'Administración de plataforma':role==='school_admin'?'Mi escuela':isTeacher?'Mis aulas':'Mi aprendizaje';
 const title=view==='dashboard'?home:view==='attendance'?'Asistencia presencial':view==='courses'?'Mis cursos':view==='library'?'Biblioteca':view==='school'?'Mis escuelas e invitaciones':'Calendario';
 const navigate=(next:View)=>{router.push(`/portal?view=${next}${roleSuffix}`);setMenu(false);};
 const changeRole=(next:PortalRole)=>{router.push(`/portal?view=dashboard&role=${next}`);setMenu(false);};
 return <div className="portal-app"><aside className={`portal-sidebar ${menu?'portal-sidebar-open':''}`}><Link href="/" className="site-brand"><Leaf/><span><span className="site-brand-name">Humanismo Evolutivo</span><span className="site-brand-caption">Transpersonal</span></span></Link><span className="portal-sidebar-label">{roleLabels[role]}</span>{role==='school_admin'&&schoolAdmin||isTeacher&&teachingSchool?<p className="portal-teacher-school-label">{role==='school_admin'?schoolAdmin?.schoolName:teachingSchool?.schoolName}</p>:null}<nav aria-label="Portal educativo">{([{id:'dashboard',label:home,icon:LayoutDashboard},{id:'courses',label:'Mis cursos',icon:GraduationCap},{id:'library',label:'Biblioteca',icon:Library},{id:'calendar',label:'Calendario',icon:CalendarDays},{id:'school',label:'Mis escuelas e invitaciones',icon:GraduationCap}] as const).map(item=><button key={item.id} type="button" aria-current={view===item.id?'page':undefined} onClick={()=>navigate(item.id)}><item.icon size={20}/>{item.label}</button>)}{canManageAttendance?<button type="button" aria-current={view==='attendance'?'page':undefined} onClick={()=>navigate('attendance')}><CalendarCheck2 size={20}/>Pasar lista en Amigos</button>:null}</nav><div className="portal-sidebar-bottom"><Link href="/"><ArrowLeft size={18}/>Volver al sitio</Link><form action="/auth/signout" method="post"><button type="submit"><LogOut size={18}/>Cerrar sesión</button></form><p>Aprender es una forma de evolucionar.</p></div></aside>
 <div className="portal-workspace"><header className="portal-topbar"><div><button type="button" className="portal-mobile-toggle" aria-expanded={menu} aria-label={menu?'Cerrar menú del portal':'Abrir menú del portal'} onClick={()=>setMenu(v=>!v)}>{menu?<X/>:<Menu/>}</button><span>Portal educativo / <strong>{title}</strong></span></div><div><span className="portal-avatar" aria-hidden="true">{firstName.charAt(0).toUpperCase()}</span><span className="portal-user">{firstName}<small>{email}</small></span></div></header><main className={`portal-main ${view==='calendar'?'portal-main-calendar':''}`} id="contenido-principal">
 {roles.length>1?<div className="portal-role-navigation"><div role="group" aria-label="Mis perfiles">{roles.map(r=><button key={r} aria-pressed={role===r} onClick={()=>changeRole(r)}>{roleLabels[r]}</button>)}</div><p>Accesos disponibles para tu cuenta. Cada operación verifica tus permisos.</p></div>:null}
 <div className="portal-welcome"><span className="design-eyebrow">TU ESPACIO PARA EVOLUCIONAR</span><h1>{title}</h1><p>{view==='dashboard'?isAdmin?'Gestiona tu comunidad y acompaña el aprendizaje.':isTeacher?'Consulta a los estudiantes de tus aulas y su avance.':'Tu asistencia presencial y tu avance en línea, en un solo lugar.':view==='courses'?'Explora los programas y continúa tu recorrido.':view==='attendance'?'La asistencia presencial en Amigos la registra el maestro.':view==='school'?'Acepta tus invitaciones y consulta tus membresías.':view==='library'?'Lecturas y recursos para profundizar.':'Busca tus clases programadas y filtra por curso.'}</p></div>
 {view==='dashboard'?(isAdmin&&educationContext?<PortalAdministration key={role} context={educationContext} courses={courses} platform={role==='admin'}/>:isTeacher&&teachingSchool&&educationContext?<PortalAdministration context={educationContext} courses={courses} teacher/>:<StudentDashboard progress={studentProgress} attendance={attendance} courses={courses}/>):null}
 {view==='attendance'&&canManageAttendance&&educationContext?<PortalAttendance context={educationContext}/>:null}
 {view==='courses'?courseWorkspace||<CourseCatalog courses={courses}/>:null}
 {view==='library'?<PortalLibrary key={params.get('category')||'all'} articles={articles}/>:null}
 {view==='school'&&educationContext?<PortalSchools context={educationContext}/>:null}
 {view==='calendar'?<PortalCalendar sessions={portalClasses} catalog={courses}/>:null}
 </main><footer className="portal-bottom">Humanismo Evolutivo · Portal educativo<span>Un camino de conciencia compartida</span></footer></div></div>;
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import TeacherDashboard from './TeacherDashboard';
import { activeTeachingSchool } from '@/lib/teaching/role';
import StudentDashboard from './StudentDashboard';
import PortalAttendance from './PortalAttendance';
import type { AttendanceSummary } from '@/lib/attendance/contracts';
import CourseCatalog from './CourseCatalog';
import PortalCalendar from './PortalCalendar';
import { portalClasses } from '@/data/portal';
import type { EducationContext } from '@/lib/education/contracts';
import PortalSchools from './PortalSchools';
import PortalRolePreview, { createDemoEducation } from './PortalRolePreview';
import { portalRole, portalRoleSuffix, type PortalRole } from '@/lib/portal-role';
import type { ResourceArticle } from '@/data/resources';
import { ArrowLeft, CalendarCheck2, LayoutDashboard, CalendarDays, GraduationCap, Leaf, Library, LogOut, Menu, X } from 'lucide-react';

const PortalLibrary = dynamic(() => import('./PortalLibrary'), { loading: () => <p role="status">Cargando biblioteca…</p> });

type View = 'dashboard' | 'attendance' | 'courses' | 'library' | 'calendar' | 'school';
export default function PortalDashboard({ firstName, email, articles, educationContext, rolePreviewEnabled = false, courseWorkspace, studentProgress = null, attendance = null }: { firstName: string; email?: string; articles: ResourceArticle[]; educationContext?: EducationContext | null; rolePreviewEnabled?: boolean; courseWorkspace?: React.ReactNode; studentProgress?: Record<string,number> | null; attendance?: AttendanceSummary | null }) {
  const params = useSearchParams();
  const router = useRouter();
  const teachingSchool = activeTeachingSchool(educationContext);
  const role = rolePreviewEnabled && params.has('role') ? portalRole(params.get('role'), true) : teachingSchool ? 'teacher' : 'student';
  const isTeacherHome = role === 'teacher' && Boolean(teachingSchool);
  const [demoData,setDemoData] = useState(createDemoEducation);
  const hasRealRole = role === 'admin' ? Boolean(educationContext?.isPlatformAdmin) : role === 'teacher' ? Boolean(educationContext?.memberships.some(m=>m.role==='teacher'&&m.status==='active'&&m.schoolStatus==='active')) : true;
  const scopedContext = educationContext ? { ...educationContext, isPlatformAdmin: role === 'admin' && educationContext.isPlatformAdmin, memberships: role === 'student' ? educationContext.memberships.filter(m=>m.role==='student') : educationContext.memberships } : null;
  const roleSuffix = portalRoleSuffix(role);
  const changeRole = (next: PortalRole) => { router.push(`/portal?view=${next === 'admin' ? 'school' : 'dashboard'}${next === 'student' ? '' : `&role=${next}`}`);setMenu(false); };
  const canManageAttendance = Boolean(educationContext?.isPlatformAdmin || educationContext?.memberships.some(m=>m.role==='teacher'&&m.status==='active'&&m.schoolStatus==='active'));
  const selectedView = params.get('view');
  const view: View = selectedView === 'courses' || selectedView === 'library' || selectedView === 'calendar' || (selectedView === 'attendance' && canManageAttendance) || (selectedView === 'school' && (educationContext || role !== 'student')) ? selectedView : courseWorkspace ? 'courses' : 'dashboard';
  const [menu, setMenu] = useState(false);
  const title = view === 'dashboard' ? isTeacherHome ? 'Mi escuela' : 'Mi aprendizaje' : view === 'attendance' ? 'Asistencia presencial' : view === 'courses' ? 'Mis cursos' : view === 'library' ? 'Biblioteca' : view === 'school' ? role === 'admin' ? 'Administración educativa' : role === 'teacher' ? 'Mi escuela y estudiantes' : 'Mis escuelas' : 'Calendario';
  const navigate = (next: View) => { router.push(`/portal?view=${next}${roleSuffix}`); setMenu(false); };
  return <div className="portal-app">
    <aside className={`portal-sidebar ${menu ? 'portal-sidebar-open' : ''}`}>
      <Link href="/" className="site-brand"><Leaf /><span><span className="site-brand-name">Humanismo Evolutivo</span><span className="site-brand-caption">Transpersonal</span></span></Link>
      <span className="portal-sidebar-label">{isTeacherHome ? 'PORTAL DOCENTE' : 'PORTAL EDUCATIVO'}</span>{isTeacherHome && teachingSchool ? <p className="portal-teacher-school-label">{teachingSchool.schoolName}</p> : null}
      <nav aria-label="Portal educativo">{([{ id: 'dashboard', label: isTeacherHome ? 'Mi escuela' : 'Mi aprendizaje', icon: LayoutDashboard }, { id: 'courses', label: 'Mis cursos', icon: GraduationCap }, { id: 'library', label: 'Biblioteca', icon: Library }, { id: 'calendar', label: 'Calendario', icon: CalendarDays }] as const).map(item => <button key={item.id} type="button" aria-current={view === item.id ? 'page' : undefined} onClick={() => navigate(item.id)}><item.icon size={20} />{item.label}</button>)}{canManageAttendance ? <button type="button" aria-current={view === 'attendance' ? 'page' : undefined} onClick={() => navigate('attendance')}><CalendarCheck2 size={20} />Pasar lista</button> : null}{educationContext || role !== 'student' ? <button type="button" aria-current={view === 'school' ? 'page' : undefined} onClick={() => navigate('school')}><GraduationCap size={20} />{role === 'admin' ? 'Escuelas y personas' : role === 'teacher' ? 'Estudiantes' : 'Mis escuelas'}</button> : null}</nav>
      <div className="portal-sidebar-bottom"><Link href="/"><ArrowLeft size={18} />Volver al sitio</Link><form action="/auth/signout" method="post"><button type="submit"><LogOut size={18} />Cerrar sesión</button></form><p>Aprender es una forma de evolucionar.</p></div>
    </aside>
    <div className="portal-workspace"><header className="portal-topbar"><div><button type="button" className="portal-mobile-toggle" aria-expanded={menu} aria-label={menu ? 'Cerrar menú del portal' : 'Abrir menú del portal'} onClick={() => setMenu(value => !value)}>{menu ? <X /> : <Menu />}</button><span>Portal educativo <span aria-hidden="true">/</span> <strong>{title}</strong></span></div><div><span className="portal-avatar" aria-hidden="true">{firstName.charAt(0).toUpperCase()}</span><span className="portal-user">{firstName}<small>{email}</small></span></div></header>
      <main className={`portal-main ${view === 'calendar' ? 'portal-main-calendar' : ''}`} id="contenido-principal">
        {rolePreviewEnabled ? <div className="portal-role-navigation"><div role="group" aria-label="Vista del portal por rol">{([{id:'student',label:'Estudiante'},{id:'teacher',label:'Maestro'},{id:'admin',label:'Administrador'}] as const).map(tab=><button key={tab.id} type="button" aria-pressed={role===tab.id} onClick={()=>changeRole(tab.id)}>{tab.label}</button>)}</div><p>{role!=='student'&&!hasRealRole ? 'Vista de demostración con datos de ejemplo. Cambiar de vista no modifica los permisos de tu cuenta.' : 'Los permisos de tu cuenta se verifican en el servidor.'}</p></div> : null}
        <div className="portal-welcome"><span className="design-eyebrow">TU ESPACIO PARA EVOLUCIONAR</span><h1>{title}</h1><p>{view === 'dashboard' ? isTeacherHome ? 'Tus estudiantes, su asistencia y su avance en un solo lugar.' : 'Tu asistencia presencial y tu avance en línea, en un solo lugar.' : view === 'attendance' ? 'La asistencia a las clases presenciales la registra el maestro.' : view === 'courses' ? 'Explora todos los cursos disponibles y elige tu próximo paso de aprendizaje.' : view === 'library' ? 'Explora las lecturas, reflexiones y conversaciones de Humanismo Evolutivo.' : view === 'school' ? 'Tu comunidad, tus escuelas y el aprendizaje compartido.' : 'Busca tus clases programadas y filtra la lista por curso.'}</p></div>
        {view === 'dashboard' ? isTeacherHome && teachingSchool ? <TeacherDashboard key={teachingSchool.schoolId} schoolId={teachingSchool.schoolId} schoolName={teachingSchool.schoolName} /> : <StudentDashboard progress={studentProgress} attendance={attendance} /> : null}
        {view === 'attendance' && canManageAttendance && educationContext ? <PortalAttendance context={educationContext} /> : null}
        {view === 'courses' ? courseWorkspace || <CourseCatalog /> : null}
        {view === 'library' ? <PortalLibrary key={params.get('category') || 'all'} articles={articles} /> : null}
        {view === 'school' && role !== 'student' && !hasRealRole ? <PortalRolePreview key={role} role={role} data={demoData} setData={setDemoData} /> : view === 'school' && scopedContext ? <PortalSchools key={JSON.stringify(scopedContext)} context={scopedContext} /> : null}
        {view === 'calendar' ? <PortalCalendar sessions={portalClasses} /> : null}
      </main><footer className="portal-bottom">Humanismo Evolutivo · Portal educativo<span>Un camino de conciencia compartida</span></footer>
    </div>
  </div>;
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { courseHref, lessonHref } from './CourseCatalog';
import type { LessonState } from '@/lib/learning/server';
type Lesson = { id: string; title: string; sections: {title:string;text:string}[] };
type Course = { id:string; title:string; minutes:number; lessons:{id:string;title:string}[] };
export default function LessonWorkspace({course,lesson,number,state}:{course:Course;lesson:Lesson;number:number;state:LessonState}) {
 const router=useRouter();
 const [reflection,setReflection]=useState(state.work.reflection);
 const [reviewed,setReviewed]=useState(state.work.reviewed);
 const [completed,setCompleted]=useState(state.completed);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');
 const [error,setError]=useState('');
 const [dirty,setDirty]=useState(false);
 async function save(action:'save'|'complete') {
  setBusy(true);setError('');setMessage('');
  try {
   const response=await fetch('/api/learning',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,course:course.id,lesson:number,reflection,reviewed})});
   const result=await response.json();
   if(!response.ok) throw new Error(result.error || 'No se pudo guardar.');
   setCompleted(result.data.completed);setDirty(false);
   setMessage(action==='complete' ? number===course.lessons.length ? '¡Completaste el curso! Todas tus clases están disponibles para repasar.' : 'Clase completada. Ya puedes abrir la siguiente.' : 'Tu trabajo se guardó. Puedes continuar más tarde.');
   router.refresh();
  } catch(e) { setError(e instanceof Error ? e.message : 'No se pudo guardar. Inténtalo otra vez.'); } finally {setBusy(false);}
 }
 return <div className="portal-course-space"><Link href={courseHref(course.id)} className="design-text-link"><ArrowLeft size={17}/>Programa del curso</Link><div className="portal-lesson-heading"><span className="design-eyebrow">CLASE {number} DE {course.lessons.length} · {course.minutes} MINUTOS</span><p>{course.title}</p><h2>{lesson.title}</h2>{number<=completed ? <span className="portal-completed"><CheckCircle2 size={18}/>Clase completada · Puedes repasar y editar tu trabajo</span> : null}</div><nav className="portal-section-nav" aria-label="Secciones de esta clase">{lesson.sections.map((section,i)=><a key={i} href={`#section-${i}`}>{section.title}</a>)}<a href="#mi-trabajo">Mi trabajo</a></nav><div className="portal-lesson-body">{lesson.sections.map((section,i)=><section id={`section-${i}`} key={i}><h3>{section.title}</h3><div className="portal-source-text">{section.text}</div></section>)}</div><section className="portal-lesson-work" id="mi-trabajo"><span className="design-eyebrow">INTEGRAR LO APRENDIDO</span><h3>Mi trabajo de esta clase</h3><p>Responde las preguntas de reflexión en tus propias palabras y registra lo que quieres llevar a la práctica. Este espacio es privado y se guarda en tu cuenta.</p><label htmlFor="lesson-reflection">Mi reflexión y ejercicios</label><textarea id="lesson-reflection" rows={10} maxLength={20000} value={reflection} disabled={busy} onChange={e=>{setReflection(e.target.value);setDirty(true);setMessage('');}} placeholder="¿Qué aprendí? ¿Cómo se relaciona con mi vida? ¿Qué preguntas me quedan?"/><small>{reflection.length}/20000 caracteres · Mínimo 20 para completar</small><label className="portal-review-confirm"><input type="checkbox" checked={reviewed} disabled={busy} onChange={e=>{setReviewed(e.target.checked);setDirty(true);setMessage('');}}/>He revisado los contenidos, realizado los ejercicios y respondido las preguntas de esta clase.</label><div className="portal-work-actions"><button type="button" className="design-text-link" disabled={busy} onClick={()=>save('save')}>{busy ? 'Guardando…' : 'Guardar mi trabajo'}</button><button type="button" className="design-button" disabled={busy||!reviewed||reflection.trim().length<20} onClick={()=>save('complete')}>{number<=completed ? 'Guardar clase completada' : 'Completar clase'}<CheckCircle2 size={18}/></button></div>{dirty ? <p role="status">Tienes cambios sin guardar. Guarda tu trabajo antes de salir de esta página.</p> : null}{message ? <p role="status">{message}</p> : null}{error ? <p role="alert">{error}</p> : null}</section><nav aria-label="Navegación de clases" className="portal-work-actions">{number>1 ? <Link href={lessonHref(course.id,number-1)} className="design-text-link"><ArrowLeft size={18}/>Clase anterior</Link> : <Link href={courseHref(course.id)} className="design-text-link">Ver programa</Link>}{number<course.lessons.length && number<=completed ? <Link href={lessonHref(course.id,number+1)} className="design-button">Siguiente clase<ArrowRight size={18}/></Link> : number===course.lessons.length && number<=completed ? <Link href={courseHref(course.id)} className="design-button">Volver al curso<CheckCircle2 size={18}/></Link> : <span className="portal-course-note">Completa esta clase para abrir la siguiente.</span>}</nav></div>;
}
